/* eslint-disable react/jsx-key */
// Install AOS by running: npm install aos
"use client"
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useState, useEffect, useRef } from "react"
import { SiHtml5, SiJavascript, SiReact, SiNodedotjs, SiPython, SiTailwindcss, SiDocker, SiGithub } from "react-icons/si";
import { FaJava } from "react-icons/fa";
import { PiLink } from "react-icons/pi";

const getSkillIcon = (name) => {
  switch (name) {
    case "HTML": return <SiHtml5 />;
    case "JavaScript": return <SiJavascript />;
    case "React": return <SiReact />;
    case "Node.js": return <SiNodedotjs />;
    case "Python": return <SiPython />;
    case "Tailwind CSS": return <SiTailwindcss />;
    case "Docker": return <SiDocker />;
    case "Java": return <FaJava />;
    default: return null;
  }
};

// Interactive 3D Skill Cube Component
function SkillCube({ skill, index }) {
  const [rotation, setRotation] = useState({
    x: 15, // Start with a slight rotation so cubes are visible
    y: 15
  })
  const [isDragging, setIsDragging] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const cubeRef = useRef(null)
  const lastMousePos = useRef({ x: 0, y: 0 })

  // Set random rotation after hydration to avoid SSR mismatch
  useEffect(() => {
    setIsHydrated(true)
    setRotation({
      x: Math.random() * 60 - 30,
      y: Math.random() * 60 - 30
    })
  }, [])

  const handleMouseDown = (e) => {
    setIsDragging(true)
    lastMousePos.current = { x: e.clientX, y: e.clientY }
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    
    const deltaX = e.clientX - lastMousePos.current.x
    const deltaY = e.clientY - lastMousePos.current.y
    
    setRotation(prev => ({
      x: prev.x + deltaY * 0.5,
      y: prev.y + deltaX * 0.5
    }))
    
    lastMousePos.current = { x: e.clientX, y: e.clientY }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Touch event handlers for mobile
  const handleTouchStart = (e) => {
    setIsDragging(true);
    const touch = e.touches[0];
    lastMousePos.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - lastMousePos.current.x;
    const deltaY = touch.clientY - lastMousePos.current.y;

    setRotation((prev) => ({
      x: prev.x + deltaY * 0.5,
      y: prev.y + deltaX * 0.5,
    }));

    lastMousePos.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging])

  return (
    <div 
      className="perspective-1000 h-24 flex justify-center items-center px-4"
      style={{
        opacity: 0,
        animation: `fadeInUp 0.6s ease-out ${index * 0.1}s forwards`
      }}
    >
      <div
        ref={cubeRef}
        className="relative w-20 h-20 cursor-grab active:cursor-grabbing"
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transformStyle: 'preserve-3d'
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Cube faces */}
        {[
          { name: 'front', transform: 'translateZ(40px)', bg: 'bg-gray-700/80' },
          { name: 'back', transform: 'translateZ(-40px) rotateY(180deg)', bg: 'bg-gray-600/80' },
          { name: 'right', transform: 'rotateY(90deg) translateZ(40px)', bg: 'bg-gray-800/80' },
          { name: 'left', transform: 'rotateY(-90deg) translateZ(40px)', bg: 'bg-gray-500/80' },
          { name: 'top', transform: 'rotateX(90deg) translateZ(40px)', bg: 'bg-gray-700/80' },
          { name: 'bottom', transform: 'rotateX(-90deg) translateZ(40px)', bg: 'bg-gray-600/80' }
        ].map((face) => (
          <div
            key={face.name}
            className={`absolute w-20 h-20 ${face.bg} backdrop-blur-md border border-gray-400/40 rounded-lg flex flex-col items-center justify-center text-center select-none shadow-lg`}
            style={{
              transform: face.transform,
              backdropFilter: 'blur(12px)'
            }}
          >
            {skill.icon && (
              <div className="text-3xl text-white drop-shadow">
                {skill.icon}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

export default function Home() {
  const [activeSection, setActiveSection] = useState("hero")
  const [isScrolled, setIsScrolled] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setIsHydrated(true);
    AOS.init({
      duration: 800,
      offset: 150,
      easing: 'ease-out',
      once: true,
    });
  }, []);

  // Helper to parse "Month Year" for sorting
  const parseDate = (str) => {
    const [month, year] = str.split(" ");
    return new Date(`${month} 1, ${year}`);
  };
  // Timeline entries: merge experience + projects, add tech to experience if any.
  const timelineEntries = [
    // Project entries
    {
      year: "June 2025",
      title: "Screenshot to Latex Converter",
      desc: "Image-to-LaTeX tool using FastAPI + KaTeX, deployed as a microservice. Integrated with Vibe for screenshot recognition.",
      tech: ["FastAPI", "KaTeX", "Python", "Microservices"],
      logo: "https://i.imgur.com/04g9rum.png",
      link: "https://github.com/Shreyas4240/imagetolatex"
    },
    {
      year: "July 2025",
      title: "SWE Intern at The /Nudge Institute",
      desc: "Developed an end-to-end grant proposal curation tool for The/Nudge Institute. Built a front-end interface (HTML/CSS/JS) for customizing proposals to new foundations. Engineered Python scripts to scrape foundation data, recommend aligned Nudge programs, and auto-generate proposals using LLMs via the Together API. Implemented multi-step prompting to extract relevant focus areas and generate tailored proposals using foundation info, old drafts, and new templates.",
      tech: ["Prompt Engineering", "BeautifulSoup", "Python", "Workflow Automation"],
      logo: "https://i.imgur.com/J2GJlB6.jpeg",
      link: "https://github.com/shreyasbhaskar/pix2tex"
    },
    {
      year: "August 2025",
      title: "Strike Email Sender",
      desc: "Email reminders with Google Apps Script and Sheets for Village Tutoring Club.",
      tech: ["Google Apps Script", "Google Sheets", "JavaScript", "Workflow Automation"],
      logo: "https://i.imgur.com/YW8BEBA.png",
      link: "https://github.com/shreyasbhaskar/strike-email-sender"
    },
    {
      year: "June 2025",
      title: "Vibe",
      desc: "Co-founded Vibe, a free resource platform for AP/IB students at The Village School. Developed a 6-lesson ACT course with concept breakdowns, practice sets, and study plans. Recruited 15+ tutors to produce subject-specific videos and host monthly Q&As. Built and deployed a subject-specific chatbot using FastAPI (Python) with KaTeX, Markdown, and Tesseract.js on the frontend.",
      tech: ["Tesseract.js", "Markdown", "KaTeX", "JavaScript"],
      logo: "https://i.imgur.com/Dx4Cubv.png",
      link: "https://www.vikinginitiative.com/"
    },
    {
      year: "August 2025",
      title: "Honor Societies Attendance + Dues Tracker",
      desc: "Used Canvas LMS API to track attendance and dues for honor societies, with Google Sheets integration.",
      tech: ["Canvas API", "Google Sheets", "Python", "Data Tracking", "Workflow Automation"],
      logo: "https://i.imgur.com/JR7eTDe.png",
      link: "https://github.com/shreyasbhaskar/honor-societies-tracker"
    },
  ].sort((a, b) => parseDate(b.year) - parseDate(a.year));

  const skills = [
    "HTML",
    "JavaScript",
    "React",
    "Node.js",
    "Python",
    "Tailwind CSS",
    "Docker",
    "Java"
  ];

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white min-h-screen">
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.3; }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-pulse-custom {
          animation: pulse 3s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }

        @keyframes fadeLeft {
          from {
            opacity: 0;
            transform: translateX(-40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fadeRight {
          from {
            opacity: 0;
            transform: translateX(40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fade-left {
          animation: fadeLeft 0.8s ease-out both;
        }
        .animate-fade-right {
          animation: fadeRight 0.8s ease-out both;
        }

        /* Timeline logo styles */
        .timeline-logo-container {
          width: 54px;
          height: 54px;
          border-radius: 9999px;
          background: rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 10px 0 rgba(0,0,0,0.13);
          border: 1.5px solid #444;
          margin-bottom: 0.5rem;
        }
        .timeline-logo-img {
          width: 38px;
          height: 38px;
          object-fit: contain;
          border-radius: 9999px;
          background: #fff;
          box-shadow: 0 1px 4px 0 rgba(0,0,0,0.11);
        }
      `}</style>
      
      {/* ENHANCED NAVBAR */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-gray-900/95 backdrop-blur-md shadow-2xl' : 'bg-transparent'
      }`}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center py-4">
            <div className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent animate-fade-in">
              SB
            </div>
            {isHydrated && (
              <>
                {/* Hamburger button for mobile */}
                <button
                  className="md:hidden text-gray-300 hover:text-white focus:outline-none"
                  onClick={() => setShowMenu(!showMenu)}
                  aria-label="Toggle menu"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
                {/* Nav list: responsive */}
                <ul className={`mt-4 md:mt-0 ${showMenu ? 'flex' : 'hidden'} flex-col md:flex md:flex-row gap-4 md:gap-8 font-medium justify-end bg-gray-900/95 md:bg-transparent rounded-lg md:rounded-none p-4 md:p-0 absolute md:static top-full left-0 w-full md:w-auto shadow-lg md:shadow-none transition-all duration-200`}
                  style={{ zIndex: 100 }}
                >
                  {['Home', 'Projects', 'Skills', 'Resume', 'Contact'].map((item, i) => (
                    <li key={item} style={{ animation: `fadeIn 0.8s ease-out ${i * 0.1}s forwards`, opacity: 0 }}>
                      <a
                        href={`#${item === "Projects" ? "experience" : item.toLowerCase()}`}
                        className="relative text-gray-300 hover:text-white transition-colors duration-300 group"
                        onClick={() => setShowMenu(false)}
                      >
                        {item}
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-white to-gray-300 group-hover:w-full transition-all duration-300"></span>
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="scroll-smooth">
        {/* HERO SECTION */}
        <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-xl animate-pulse-custom"></div>
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gray-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse-custom" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-gray-600 rounded-full mix-blend-multiply filter blur-xl animate-pulse-custom" style={{ animationDelay: '2s' }}></div>
          </div>
          
          <div className="text-center z-10 px-6 max-w-4xl">
            <div className="animate-fade-in">
              <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
                Shreyas Bhaskar
              </h1>
            </div>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 font-light animate-fade-in" style={{ animationDelay: '0.4s', opacity: 0 }}>
              Problem Solver • Full Stack Developer • Cricket Enthusiast
            </p>
            
            <div className="flex gap-4 justify-center flex-wrap animate-fade-in" style={{ animationDelay: '0.8s', opacity: 0 }}>
              <a 
                href="#projects" 
                className="px-8 py-3 bg-gradient-to-r from-white to-gray-300 text-black rounded-full font-semibold hover:shadow-2xl hover:shadow-white/25 transition-all duration-300 transform hover:scale-105"
              >
                View My Work
              </a>
              <a 
                href="#contact" 
                className="px-8 py-3 border border-gray-400 rounded-full font-semibold hover:bg-white hover:text-black transition-all duration-300"
              >
                Get In Touch
              </a>
            </div>
          </div>
        </section>

        {/* ABOUT ME SECTION */}
        <section id="about" className="py-20 px-6 bg-gray-900/40">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl font-bold mb-8 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              About Me
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              I&apos;m a passionate high school student who loves building tools that solve real problems. Whether it&apos;s automating club workflows, helping others learn, or exploring new tech stacks, I&apos;m driven by curiosity and impact. Beyond code, I enjoy cricket, mentoring peers, and constantly learning new things.
            </p>
          </div>
        </section>

        {/* EXPERIENCE & PROJECTS TIMELINE */}
        <section id="experience" className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Experience & Projects
            </h2>
            <div className="relative max-w-4xl mx-auto">
              <div className="absolute left-1/2 transform -translate-x-1 w-1 h-full bg-gray-600"></div>
              {timelineEntries.map((entry, idx) => (
                <div
                  key={idx}
                  className={`relative w-full my-12 flex ${
                    idx % 2 === 0 ? 'justify-start' : 'justify-end'
                  }`}
                >
                  <div
                    className={`w-1/2 px-8 py-4 bg-gray-800/60 rounded-xl shadow-lg border border-gray-600`}
                    data-aos={idx % 2 === 0 ? 'fade-right' : 'fade-left'}
                  >
                    <div className="mb-1">
                      {entry.link ? (
                        <a
                          href={entry.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xl font-bold text-white hover:underline"
                        >
                          {entry.title}
                        </a>
                      ) : (
                        <h3 className="text-xl font-bold text-white">{entry.title}</h3>
                      )}
                      {(entry.title === "Vibe") && entry.link && (
                        <a
                          href={entry.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-gray-400 hover:text-blue-400 flex items-center gap-1 mt-1"
                        >
                          <PiLink className="w-4 h-4" />
                          Visit Website
                        </a>
                      )}
                      {(entry.title !== "Vibe" && entry.title !== "SWE Intern at The /Nudge Institute" && entry.title !== "Strike Email Sender" && entry.title !== "Honor Societies Attendance + Dues Tracker") && entry.link && (
                        <a
                          href={entry.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-gray-400 hover:text-blue-400 flex items-center gap-1 mt-1"
                        >
                          <SiGithub className="w-4 h-4" />
                          Visit GitHub
                        </a>
                      )}
                      <div className="text-sm text-gray-400 mt-1">{entry.year}</div>
                    </div>
                    <p className="text-gray-300 mt-2">{entry.desc}</p>
                    {entry.tech && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {entry.tech.map((techItem, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 text-xs font-medium bg-gray-500/20 text-gray-300 rounded-full border border-gray-500/30"
                          >
                            {techItem}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {entry.logo && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                      <div className="timeline-logo-container">
                        <img src={entry.logo} alt={`${entry.title} logo`} className="timeline-logo-img" referrerPolicy="no-referrer" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Removed Projects section: now merged into timeline above */}

        {/* SKILLS SECTION */}
        <section id="skills" className="py-20 px-6 bg-gray-800/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Technical Skills
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-8 gap-y-14 justify-items-center max-w-5xl mx-auto">
              {isHydrated && skills.map((name, i) => (
                <SkillCube key={i} skill={{ name, icon: getSkillIcon(name) }} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* RESUME SECTION */}
        <section id="resume" className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div>
              <h2 className="text-5xl font-bold mb-8 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Resume
              </h2>
              <p className="text-xl text-gray-400 mb-8">
                Download my resume to learn more about my experience
              </p>
              <a 
                href="/resume.pdf" 
                target="_blank"
                className="inline-block px-8 py-4 bg-gradient-to-r from-white to-gray-300 text-black rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-white/25 transition-all duration-300 hover:scale-105"
              >
                Download Resume
              </a>
            </div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="py-20 px-6 bg-gray-800/30">
          <div className="max-w-4xl mx-auto text-center">
            <div>
              <h2 className="text-5xl font-bold mb-8 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Let&apos;s Connect
              </h2>
              <p className="text-xl text-gray-400 mb-12">
                I&apos;m always open to discussing new opportunities
              </p> 
              
              <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                <a 
                  href="mailto:shreyasnbhaskar@gmail.com"
                  className="group bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 hover:border-gray-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-white/10 hover:scale-105"
                  style={{
                    backdropFilter: 'blur(12px)'
                  }}
                >
                  <div className="mb-4 flex justify-center">
                    <svg className="w-12 h-12 text-gray-400 group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-gray-300 transition-colors duration-300">Email</h3>
                  <p className="text-gray-400">shreyasnbhaskar@gmail.com</p>
                </a>
                
                <a 
                  href="https://www.linkedin.com/in/shreyas-nirmalabhaskar/" 
                  target="_blank"
                  className="group bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 hover:border-gray-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-white/10 hover:scale-105"
                  style={{
                    backdropFilter: 'blur(12px)'
                  }}
                >
                  <div className="mb-4 flex justify-center">
                    <svg className="w-12 h-12 text-gray-400 group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-gray-300 transition-colors duration-300">LinkedIn</h3>
                  <p className="text-gray-400">Connect with me</p>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}