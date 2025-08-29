"use client"
import { useEffect, useState } from "react";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

const GITHUB_API = "https://api.github.com/graphql";
const GITHUB_USERNAME = "Shreyas4240";
const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

const COLORS = ["#4a4a4a", "#9be9a8", "#40c463", "#30a14e", "#216e39"]; // Dark grey for empty, GitHub greens
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]; // Show all days Sunday through Saturday

export default function GitHubContributionChart() {
  const [weeks, setWeeks] = useState([]);
  const [error, setError] = useState(null);
  const [monthLabels, setMonthLabels] = useState([]);

  useEffect(() => {
    const fetchContributions = async () => {
      const today = new Date();
      const fromDate = new Date();
      fromDate.setFullYear(today.getFullYear() - 1);

      const query = `
      query ($username: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $username) {
          contributionsCollection(from: $from, to: $to) {
            contributionCalendar {
              weeks {
                contributionDays {
                  date
                  contributionCount
                }
              }
            }
          }
        }
      }`;

      try {
        const res = await fetch(GITHUB_API, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${GITHUB_TOKEN}`,
          },
          body: JSON.stringify({
            query,
            variables: { username: GITHUB_USERNAME, from: fromDate.toISOString(), to: today.toISOString() },
          }),
        });

        const data = await res.json();
        if (!data.data || !data.data.user) {
          setError("GitHub API returned no data. Check your token/username.");
        } else if (data.errors) {
          setError(data.errors[0].message);
        } else {
          const fetchedWeeks = data.data.user.contributionsCollection.contributionCalendar.weeks;
          setWeeks(fetchedWeeks);

          // Calculate month labels aligned to first square of each month
          const months = [];
          const monthNameMap = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
          fetchedWeeks.forEach((week, weekIndex) => {
            week.contributionDays.forEach((day, dayIndex) => {
              if (!day) return;
              const date = new Date(day.date);
              const dayOfWeek = date.getDay(); // 0=Sun,...6=Sat
              // Only consider Sundays (dayOfWeek === 0) as start of week squares
              if (dayOfWeek === 0) {
                const month = date.getMonth();
                const labelExists = months.some(m => m.month === month);
                if (!labelExists) {
                  months.push({ month, weekIndex });
                }
              }
            });
          });
          setMonthLabels(months);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchContributions();
  }, []);

  const getColor = (count) => {
    if (count === 0) return COLORS[0];
    if (count <= 3) return COLORS[1];
    if (count <= 6) return COLORS[2];
    if (count <= 10) return COLORS[3];
    return COLORS[4];
  };

  if (error) return <div className="text-red-500">{error}</div>;
  if (weeks.length === 0) return <div>Loading contributions...</div>;

  return (
    <div className="bg-black p-4 rounded-lg overflow-x-auto">
      <div className="flex mb-1 ml-10 relative" style={{ height: '16px' }}>
        {monthLabels.map(({ month, weekIndex }) => (
          <div
            key={month}
            className="text-xs text-white absolute font-bold"
            style={{ left: `${weekIndex * 18}px` }}
          >
            {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][month]}
          </div>
        ))}
      </div>
      <div className="flex">
        {/* Weekday labels */}
        <div className="flex flex-col mr-2" style={{ height: '112px', justifyContent: 'space-between' }}>
          {WEEKDAYS.map((d) => (
            <div key={d} className="text-xs text-white font-bold">{d}</div>
          ))}
        </div>

        {/* Contribution grid */}
        <div className="flex">
          {weeks.map((week, i) => (
            <div key={i} className="flex flex-col mb-1" style={{ marginRight: '6px' }}>
              {[0,1,2,3,4,5,6].map((dayIndex, j) => {
                const day = week.contributionDays[dayIndex];
                if (!day) return <div key={j} className="w-3 h-3 mb-1"></div>;
                return (
                  <Tippy key={j} content={`${day.date}: ${day.contributionCount} contribution${day.contributionCount === 1 ? '' : 's'}`}>
                    <div
                      className="w-3 h-3 mb-1 rounded-[1px] cursor-pointer"
                      style={{ backgroundColor: getColor(day.contributionCount), marginBottom: '4px' }}
                    />
                  </Tippy>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}