import CalendarHeatmap from "react-calendar-heatmap";
import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function LeetCodeDashboard({
  profile,
  calendar,
  badges,
  heatmapValues,
  totalYearSubmissions,
  lineData,
  histogramData,
  percentile,
  solvePct,
  solved,
  totalQuestions
}) {
  return (
    <>
      <div className="grid middle-grid">
        <div className="card solved-card">
          <div className="gauge-wrap">
            <CircularProgressbarWithChildren
              value={solvePct}
              strokeWidth={8}
              styles={buildStyles({ pathColor: "#f59e0b", trailColor: "#f3f4f6" })}
            >
              <h2 className="gauge-title">
                {solved}
                <span>/{totalQuestions}</span>
              </h2>
              <p className="gauge-subtitle">Solved</p>
            </CircularProgressbarWithChildren>
          </div>
          <div className="attempting">{`${Math.max(totalYearSubmissions - solved, 0)} Attempting`}</div>
        </div>
        <div className="card difficulty-card">
          <div className="diff easy">
            <p>Easy</p>
            <h4>{`${profile.easySolved}/${profile.totalEasy}`}</h4>
          </div>
          <div className="diff med">
            <p>Med.</p>
            <h4>{`${profile.mediumSolved}/${profile.totalMedium}`}</h4>
          </div>
          <div className="diff hard">
            <p>Hard</p>
            <h4>{`${profile.hardSolved}/${profile.totalHard}`}</h4>
          </div>
        </div>
        <div className="card badge-card">
          <p className="label">Badges</p>
          <h2>{badges?.badgesCount ?? 0}</h2>
          <div className="badge-icons" style={{ display: 'flex', height: '80px'}}>
            {badges?.badges?.slice(0, 3).map((badge) => (
              <img
                key={badge.name}
                src={badge.icon}
                alt={badge.name}
                className="badge-icon"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="card calendar-card">
        <div className="calendar-head">
          <h3>{totalYearSubmissions} submissions in the past one year</h3>
          <div className="calendar-summary">
            <span>Total active days: {calendar.totalActiveDays}</span>
            <span>Max streak: {calendar.streak}</span>
          </div>
        </div>
        <div className="calendar-lib">
          <CalendarHeatmap
            startDate={new Date(new Date().setDate(new Date().getDate() - 364))}
            endDate={new Date()}
            values={heatmapValues}
            classForValue={(v) => {
              if (!v || v.count === 0) return "color-empty";
              if (v.count < 2) return "color-scale-1";
              if (v.count < 4) return "color-scale-2";
              if (v.count < 7) return "color-scale-3";
              return "color-scale-4";
            }}
            titleForValue={(v) =>
              !v?.date ? "No submissions" : `${v.date}: ${v.count || 0} submissions`
            }
            showWeekdayLabels={false}
          />
        </div>
      </div>
    </>
  );
}
