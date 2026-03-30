import { useEffect, useMemo, useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

function percentileFromRanking(ranking) {
  if (!ranking) return 94.26;
  const basePopulation = 858465;
  return Number(Math.max(0.01, 100 - (ranking / basePopulation) * 100).toFixed(2));
}

function buildHeatValuesFromEpochMap(calendarMap) {
  const dateToCount = new Map();
  for (const [tsKey, rawCount] of Object.entries(calendarMap || {})) {
    const seconds = Number(tsKey);
    if (!Number.isFinite(seconds)) continue;
    const dateKey = new Date(seconds * 1000).toISOString().slice(0, 10);
    dateToCount.set(dateKey, Number(rawCount || 0));
  }
  return buildHeatValuesFromDateCounter(dateToCount);
}

/** Codeforces user.status uses creationTimeSeconds (not submissionTimeSeconds). Same as cf-heatmap/mapper.js */
function codeforcesSubmissionSeconds(s) {
  const t = Number(s?.creationTimeSeconds ?? s?.submissionTimeSeconds);
  return Number.isFinite(t) ? t : null;
}

function buildHeatValuesFromSubmissionList(list, acceptedOnly) {
  const dateToCount = new Map();
  for (const item of list || []) {
    if (acceptedOnly && item?.verdict !== "OK") continue;
    const seconds = codeforcesSubmissionSeconds(item);
    if (seconds === null) continue;
    const dateKey = new Date(seconds * 1000).toISOString().slice(0, 10);
    dateToCount.set(dateKey, Number(dateToCount.get(dateKey) || 0) + 1);
  }
  return buildHeatValuesFromDateCounter(dateToCount);
}

function filterCodeforcesSubmissionsByMode(submissions, mode) {
  if (mode === "all") return submissions || [];
  const modeMap = {
    contest: "CONTESTANT",
    practice: "PRACTICE",
    virtual: "VIRTUAL"
  };
  const participantType = modeMap[mode];
  if (!participantType) return submissions || [];
  return (submissions || []).filter((s) => s?.author?.participantType === participantType);
}

function buildHeatValuesFromDateCounter(dateToCount) {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 364);
  const values = [];
  for (let i = 0; i < 365; i += 1) {
    const day = new Date(startDate);
    day.setDate(startDate.getDate() + i);
    const dateKey = day.toISOString().slice(0, 10);
    values.push({ date: dateKey, count: Number(dateToCount.get(dateKey) || 0) });
  }
  return values;
}

function buildMockLine(rankingValue) {
  const base = rankingValue || 1345;
  return [
    { name: "Mar", value: Math.round(base + 75) },
    { name: "Apr", value: Math.round(base + 28) },
    { name: "May", value: Math.round(base - 15) },
    { name: "Jun", value: Math.round(base - 72) },
    { name: "Jul", value: Math.round(base - 90) }
  ];
}

/** Codeforces-style tier color from rating (site convention, approximated). */
function cfAccentFromRating(rating) {
  const r = Number(rating) || 0;
  if (r <= 0) return "#3b5998";
  if (r < 1200) return "#808080";
  if (r < 1400) return "#008000";
  if (r < 1600) return "#03a89e";
  if (r < 1900) return "#0000ff";
  if (r < 2100) return "#aa00aa";
  if (r < 2300) return "#ff8c00";
  if (r < 2400) return "#ff0000";
  return "#a00000";
}

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

export default function App() {
  const [platform, setPlatform] = useState("leetcode");
  const [username, setUsername] = useState("alfaarghya");
  const [query, setQuery] = useState("alfaarghya");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState(null);
  const [calendar, setCalendar] = useState(null);
  const [cfData, setCfData] = useState(null);
  const [cfMode, setCfMode] = useState("all");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError("");
      try {
        if (platform === "leetcode") {
          const [profileRes, calendarRes] = await Promise.all([
            fetch(`${API_BASE}/${query}/profile`),
            fetch(`${API_BASE}/${query}/calendar`)
          ]);
          if (!profileRes.ok || !calendarRes.ok) {
            throw new Error("Could not fetch LeetCode data. Check username/API.");
          }
          const profileData = await profileRes.json();
          const calendarData = await calendarRes.json();
          const calendarMap =
            typeof calendarData.submissionCalendar === "string"
              ? JSON.parse(calendarData.submissionCalendar)
              : calendarData.submissionCalendar;
          setProfile(profileData);
          setCalendar({ ...calendarData, submissionCalendar: calendarMap });
          setCfData(null);
        } else {
          const cfRes = await fetch(`${API_BASE}/codeforces/${encodeURIComponent(query)}`);
          if (!cfRes.ok) {
            throw new Error("Could not fetch Codeforces data.");
          }
          const cfJson = await cfRes.json();
          const user = cfJson.user;
          const ratingHistory = cfJson.ratingHistory || [];
          const submissions = cfJson.submissions || [];
          const accepted = submissions.filter((s) => s.verdict === "OK");
          const uniqueSolved = new Set(
            accepted.map((s) => `${s.problem?.contestId || "x"}-${s.problem?.index || "x"}`)
          );
          const activeDays = new Set(
            accepted
              .map((s) => {
                const seconds = codeforcesSubmissionSeconds(s);
                if (seconds === null) return null;
                return new Date(seconds * 1000).toISOString().slice(0, 10);
              })
              .filter(Boolean)
          );
          setCfData({
            user,
            ratingHistory,
            submissions,
            accepted,
            totalSolved: uniqueSolved.size,
            totalAccepted: accepted.length,
            totalSubmissions: submissions.length,
            totalActiveDays: activeDays.size
          });
          setProfile(null);
          setCalendar(null);
        }
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [query, platform]);

  const heatmapValues = useMemo(() => {
    if (platform === "leetcode") {
      if (!calendar?.submissionCalendar) return [];
      return buildHeatValuesFromEpochMap(calendar.submissionCalendar);
    }
    const filteredSubmissions = filterCodeforcesSubmissionsByMode(cfData?.submissions || [], cfMode);
    return buildHeatValuesFromSubmissionList(filteredSubmissions, true);
  }, [calendar, cfData, platform, cfMode]);

  const totalYearSubmissions = useMemo(
    () => heatmapValues.reduce((sum, day) => sum + day.count, 0),
    [heatmapValues]
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!username.trim()) return;
    setQuery(username.trim());
  };

  const lcTotalQuestions = Number(profile?.totalQuestions || 0);
  const lcSolved = Number(profile?.totalSolved || 0);
  const lcSolvePct = lcTotalQuestions ? (lcSolved / lcTotalQuestions) * 100 : 0;

  const cfRating = Number(cfData?.user?.rating || 0);
  const cfMaxRating = Number(cfData?.user?.maxRating || 0);
  const cfAcceptedPct = cfData?.totalSubmissions
    ? (Number(cfData.totalAccepted) / Number(cfData.totalSubmissions)) * 100
    : 0;

  const lineData = platform === "leetcode" ? buildMockLine(profile?.ranking) : [];

  const cfLineData = useMemo(() => {
    const hist = cfData?.ratingHistory || [];
    return hist.map((x, i) => ({
      name: String(i + 1),
      value: x.newRating,
      contest: x.contestName || `Contest ${i + 1}`
    }));
  }, [cfData]);

  const cfAccent = useMemo(() => cfAccentFromRating(cfData?.user?.rating ?? cfData?.user?.maxRating), [cfData]);

  const histogramData = [2, 5, 15, 11, 7, 4, 2, 1].map((v, index) => ({ name: `${index}`, value: v }));
  const percentile = percentileFromRanking(platform === "leetcode" ? profile?.ranking : cfRating || 808460);

  const isReady = !loading && !error && (platform === "leetcode" ? profile && calendar : cfData);

  return (
    <div className={`page ${platform === "codeforces" ? "cf-page" : ""}`}>
      <div className="container">
        <div className="platform-row">
          <button
            type="button"
            className={`platform-btn ${platform === "leetcode" ? "active" : ""}`}
            onClick={() => {
              setPlatform("leetcode");
              setUsername("alfaarghya");
              setQuery("alfaarghya");
            }}
          >
            LeetCode
          </button>
          <button
            type="button"
            className={`platform-btn platform-btn-cf ${platform === "codeforces" ? "active" : ""}`}
            onClick={() => {
              setPlatform("codeforces");
              setUsername("tourist");
              setQuery("tourist");
              setCfMode("all");
            }}
          >
            Codeforces
          </button>
        </div>

        {platform === "codeforces" && (
          <div className="platform-row cf-mode-row">
            <span className="cf-mode-label">Activity filter</span>
            <button type="button" className={`cf-chip ${cfMode === "all" ? "active" : ""}`} onClick={() => setCfMode("all")}>
              All
            </button>
            <button type="button" className={`cf-chip ${cfMode === "contest" ? "active" : ""}`} onClick={() => setCfMode("contest")}>
              Contest
            </button>
            <button type="button" className={`cf-chip ${cfMode === "practice" ? "active" : ""}`} onClick={() => setCfMode("practice")}>
              Practice
            </button>
            <button type="button" className={`cf-chip ${cfMode === "virtual" ? "active" : ""}`} onClick={() => setCfMode("virtual")}>
              Virtual
            </button>
          </div>
        )}

        <form className={`search-row ${platform === "codeforces" ? "search-row-cf" : ""}`} onSubmit={handleSubmit}>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={platform === "leetcode" ? "LeetCode username" : "Codeforces handle"}
          />
          <button type="submit">Load</button>
        </form>

        {loading && <p className="status">Loading dashboard...</p>}
        {error && <p className="status error">{error}</p>}

        {isReady && platform === "leetcode" && (
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
                    value={lcSolvePct}
                    strokeWidth={8}
                    styles={buildStyles({ pathColor: "#f59e0b", trailColor: "#f3f4f6" })}
                  >
                    <h2 className="gauge-title">
                      {lcSolved}
                      <span>/{lcTotalQuestions}</span>
                    </h2>
                    <p className="gauge-subtitle">Solved</p>
                  </CircularProgressbarWithChildren>
                </div>
                <div className="attempting">{`${Math.max(totalYearSubmissions - lcSolved, 0)} Attempting`}</div>
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
        )}

        {isReady && platform === "codeforces" && cfData && (
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
        )}
      </div>
    </div>
  );
}
