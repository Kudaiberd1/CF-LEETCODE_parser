import CalendarHeatmap from "react-calendar-heatmap";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

function CfRatingTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const row = payload[0]?.payload ?? payload[0];
  return (
    <div className="cf-chart-tooltip">
      <strong>{row?.contest ?? "Contest"}</strong>
      <div>Rating: {row?.value}</div>
    </div>
  );
}

export default function CodeforcesDashboard({
  cfData,
  cfAccent,
  cfRating,
  cfMaxRating,
  cfAcceptedPct,
  cfLineData,
  totalYearSubmissions,
  heatmapValues,
  cfMode
}) {
  return (
    <>
      <header className="cf-header" style={{ borderLeftColor: cfAccent }}>
        {cfData.user?.titlePhoto ? (
          <img className="cf-avatar" src={cfData.user.titlePhoto} alt="" width={72} height={72} />
        ) : (
          <div className="cf-avatar cf-avatar-placeholder" aria-hidden />
        )}
        <div className="cf-header-main">
          <h1 className="cf-handle" style={{ color: cfAccent }}>
            {cfData.user?.handle}
          </h1>
          <p className="cf-meta">
            {(cfData.user?.rank || "unrated").replace(/_/g, " ")}
            {cfData.user?.maxRank ? (
              <>
                {" "}
                · max <span className="cf-max-rank">{cfData.user.maxRank.replace(/_/g, " ")}</span>
              </>
            ) : null}
          </p>
          {cfData.user?.country ? <p className="cf-country">{cfData.user.country}</p> : null}
        </div>
        <div className="cf-rating-block">
          <span className="cf-rating-label">Rating</span>
          <span className="cf-rating-value" style={{ color: cfAccent }}>
            {cfRating || "—"}
          </span>
          <span className="cf-max-rating-label">max {cfMaxRating || "—"}</span>
        </div>
      </header>

      <div className="cf-stats-bar">
        <div className="cf-stat">
          <span className="cf-stat-label">Contests</span>
          <span className="cf-stat-value">{cfData.ratingHistory.length}</span>
        </div>
        <div className="cf-stat">
          <span className="cf-stat-label">Problems solved</span>
          <span className="cf-stat-value">{cfData.totalSolved}</span>
        </div>
        <div className="cf-stat">
          <span className="cf-stat-label">Submissions</span>
          <span className="cf-stat-value">{cfData.totalSubmissions}</span>
        </div>
        <div className="cf-stat">
          <span className="cf-stat-label">Accepted</span>
          <span className="cf-stat-value">{cfData.totalAccepted}</span>
        </div>
        <div className="cf-stat">
          <span className="cf-stat-label">Acceptance</span>
          <span className="cf-stat-value">{cfAcceptedPct.toFixed(1)}%</span>
        </div>
        <div className="cf-stat">
          <span className="cf-stat-label">Active days</span>
          <span className="cf-stat-value">{cfData.totalActiveDays}</span>
        </div>
      </div>

      <section className="card cf-chart-card">
        <div className="cf-section-head">
          <h2>Rating</h2>
          <span className="cf-section-sub">Contest rating by time (official history)</span>
        </div>
        <div className="cf-chart-wrap">
          {cfLineData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={cfLineData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#e1e6ed" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#6b7280", fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "#6b7280", fontSize: 11 }} domain={["auto", "auto"]} />
                <Tooltip content={<CfRatingTooltip />} />
                <Line type="monotone" dataKey="value" stroke="#1991eb" strokeWidth={2} dot={{ r: 2, fill: "#1991eb" }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="cf-empty-chart">No rated contests yet.</p>
          )}
        </div>
      </section>

      <section className="card cf-calendar-card">
        <div className="calendar-head cf-calendar-head">
          <div>
            <h3 className="cf-calendar-title">
              {totalYearSubmissions}{" "}
              <span className="cf-calendar-title-muted">accepted submissions · last 365 days (UTC)</span>
            </h3>
            <p className="cf-calendar-hint">
              Heatmap counts <strong>accepted</strong> submissions per day · filter: {cfMode}
            </p>
          </div>
          <div className="calendar-summary cf-calendar-summary">
            <span>Active days (all time, AC): {cfData.totalActiveDays}</span>
          </div>
        </div>
        <div className="calendar-lib cf-heatmap-wrap">
          <CalendarHeatmap
            startDate={new Date(new Date().setDate(new Date().getDate() - 364))}
            endDate={new Date()}
            values={heatmapValues}
            classForValue={(v) => {
              if (!v || v.count === 0) return "cf-hm-empty";
              if (v.count < 2) return "cf-hm-1";
              if (v.count < 4) return "cf-hm-2";
              if (v.count < 7) return "cf-hm-3";
              return "cf-hm-4";
            }}
            titleForValue={(v) =>
              !v?.date ? "No submissions" : `${v.date}: ${v.count || 0} accepted`
            }
            showWeekdayLabels={false}
          />
        </div>
        <div className="cf-heatmap-legend">
          <span>Less</span>
          <i className="cf-legend-swatch cf-hm-empty" />
          <i className="cf-legend-swatch cf-hm-1" />
          <i className="cf-legend-swatch cf-hm-2" />
          <i className="cf-legend-swatch cf-hm-3" />
          <i className="cf-legend-swatch cf-hm-4" />
          <span>More</span>
        </div>
      </section>
    </>
  );
}
