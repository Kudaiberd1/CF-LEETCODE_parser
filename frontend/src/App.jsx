import "react-calendar-heatmap/dist/styles.css";
import "react-circular-progressbar/dist/styles.css";
import CfModeFilter from "./components/CfModeFilter";
import CodeforcesDashboard from "./components/CodeforcesDashboard";
import LeetCodeDashboard from "./components/LeetCodeDashboard";
import PlatformSwitcher from "./components/PlatformSwitcher";
import UserSearchForm from "./components/UserSearchForm";
import { useDashboardData } from "./hooks/useDashboardData";
import { useDashboardQueryState } from "./hooks/useDashboardQueryState";

export default function App() {
  const {
    screenshotMode,
    apiBase,
    platform,
    username,
    setUsername,
    query,
    cfMode,
    setCfMode,
    setLeetCodePreset,
    setCodeforcesPreset,
    submitUser
  } = useDashboardQueryState();

  const dashboardData = useDashboardData({ apiBase, platform, query, cfMode });

  const leetcodeDashboard =
    dashboardData.isReady &&
    platform === "leetcode" &&
    dashboardData.profile &&
    dashboardData.calendar ? (
      <LeetCodeDashboard
        profile={dashboardData.profile}
        calendar={dashboardData.calendar}
        badges={dashboardData.badges}
        heatmapValues={dashboardData.heatmapValues}
        totalYearSubmissions={dashboardData.totalYearSubmissions}
        lineData={dashboardData.lc.lineData}
        histogramData={dashboardData.histogramData}
        percentile={dashboardData.percentile}
        solvePct={dashboardData.lc.solvePct}
        solved={dashboardData.lc.solved}
        totalQuestions={dashboardData.lc.totalQuestions}
      />
    ) : null;

  const codeforcesDashboard =
    dashboardData.isReady && platform === "codeforces" && dashboardData.cfData ? (
      <CodeforcesDashboard
        cfData={dashboardData.cfData}
        cfAccent={dashboardData.cf.accent}
        cfRating={dashboardData.cf.rating}
        cfMaxRating={dashboardData.cf.maxRating}
        cfAcceptedPct={dashboardData.cf.acceptedPct}
        cfLineData={dashboardData.cf.lineData}
        totalYearSubmissions={dashboardData.totalYearSubmissions}
        heatmapValues={dashboardData.heatmapValues}
        cfMode={cfMode}
      />
    ) : null;

  return (
    <div className={`page ${platform === "codeforces" ? "cf-page" : ""}`}>
      <div className="container">
        {!screenshotMode && (
          <>
            <PlatformSwitcher
              platform={platform}
              onLeetCode={setLeetCodePreset}
              onCodeforces={setCodeforcesPreset}
            />
            {platform === "codeforces" && (
              <CfModeFilter cfMode={cfMode} onChange={setCfMode} />
            )}
            <UserSearchForm
              platform={platform}
              username={username}
              onUsernameChange={setUsername}
              onSubmit={submitUser}
            />
          </>
        )}

        {!screenshotMode && dashboardData.loading && (
          <p className="status">Loading dashboard...</p>
        )}
        {!screenshotMode && dashboardData.error && (
          <p className="status error">{dashboardData.error}</p>
        )}

        {screenshotMode && dashboardData.loading && (
          <p className="status">Loading dashboard...</p>
        )}

        {screenshotMode && (dashboardData.error || dashboardData.isReady) && (
          <div id="screenshot-capture" data-screenshot-ready="true">
            {dashboardData.error && (
              <p className="status error">{dashboardData.error}</p>
            )}
            {leetcodeDashboard}
            {codeforcesDashboard}
          </div>
        )}

        {!screenshotMode && leetcodeDashboard}
        {!screenshotMode && codeforcesDashboard}
      </div>
    </div>
  );
}
