import CalendarHeatmap from "react-calendar-heatmap";
import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function LeetCodeDashboard({
  profile,
  calendar,
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
      <div className="grid top-grid">
        <div className="card rating-card">
          <div className="metrics-row">
            <div>
              <p className="label">Contest Rating</p>
              <h2>{Math.round(profile.ranking || 0).toLocaleString()}</h2>
            </div>
            <div>
              <p className="label">Global Ranking</p>
              <h3>{`${Math.round(profile.ranking || 0).toLocaleString()}/858,465`}</h3>
            </div>
            <div>
              <p className="label">Attended</p>
              <h3>3</h3>
            </div>
          </div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={90}>
              <LineChart data={lineData}>
                <CartesianGrid stroke="#f8fafc" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <YAxis hide />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card top-card">
          <p className="label">Top</p>
          <h2>{percentile}%</h2>
          <ResponsiveContainer width="100%" height={90}>
            <BarChart data={histogramData}>
              <Bar dataKey="value" radius={[3, 3, 0, 0]} fill="#e5e7eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

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
          <h2>{calendar.dccBadges?.badges?.length || 0}</h2>
          <p className="muted">Locked Badge</p>
          <h4>Mar LeetCoding Challenge</h4>
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
