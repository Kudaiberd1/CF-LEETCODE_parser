import { useEffect, useMemo, useState } from "react";
import { fetchCodeforcesDashboard, fetchLeetCodeDashboard } from "../services/dashboardApi";
import {
  buildHeatValuesFromEpochMap,
  buildHeatValuesFromSubmissionList,
  filterCodeforcesSubmissionsByMode
} from "../services/heatmapMapper";
import { cfAccentFromRating } from "../services/codeforcesMapper";

function percentileFromRanking(ranking) {
  if (!ranking) return 94.26;
  const basePopulation = 858465;
  return Number(Math.max(0.01, 100 - (ranking / basePopulation) * 100).toFixed(2));
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

export function useDashboardData({ apiBase, platform, query, cfMode }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState(null);
  const [calendar, setCalendar] = useState(null);
  const [cfData, setCfData] = useState(null);
  const [badges, setBadges] = useState(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError("");
      try {
        if (platform === "leetcode") {
          const lcData = await fetchLeetCodeDashboard(apiBase, query);
          setProfile(lcData.profile);
          setCalendar(lcData.calendar);
          setBadges(lcData.badges);
          setCfData(null);
        } else {
          const nextCfData = await fetchCodeforcesDashboard(apiBase, query);
          setCfData(nextCfData);
          setProfile(null);
          setCalendar(null);
          setBadges(null);
        }
      } catch (err) {
        setError(err?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [apiBase, platform, query]);

  const heatmapValues = useMemo(() => {
    if (platform === "leetcode") {
      if (!calendar?.submissionCalendar) return [];
      return buildHeatValuesFromEpochMap(calendar.submissionCalendar);
    }
    const filteredSubmissions = filterCodeforcesSubmissionsByMode(
      cfData?.submissions || [],
      cfMode,
    );
    return buildHeatValuesFromSubmissionList(filteredSubmissions, true);
  }, [calendar, cfData, platform, cfMode]);

  const totalYearSubmissions = useMemo(
    () => heatmapValues.reduce((sum, day) => sum + day.count, 0),
    [heatmapValues],
  );

  const lcTotalQuestions = Number(profile?.totalQuestions || 0);
  const lcSolved = Number(profile?.totalSolved || 0);
  const lcSolvePct = lcTotalQuestions ? (lcSolved / lcTotalQuestions) * 100 : 0;
  const lcLineData = platform === "leetcode" ? buildMockLine(profile?.ranking) : [];

  const cfRating = Number(cfData?.user?.rating || 0);
  const cfMaxRating = Number(cfData?.user?.maxRating || 0);
  const cfAcceptedPct = cfData?.totalSubmissions
    ? (Number(cfData.totalAccepted) / Number(cfData.totalSubmissions)) * 100
    : 0;
  const cfLineData = useMemo(() => {
    const history = cfData?.ratingHistory || [];
    return history.map((row, index) => ({
      name: String(index + 1),
      value: row.newRating,
      contest: row.contestName || `Contest ${index + 1}`
    }));
  }, [cfData]);
  const cfAccent = useMemo(
    () => cfAccentFromRating(cfData?.user?.rating ?? cfData?.user?.maxRating),
    [cfData],
  );

  const histogramData = [2, 5, 15, 11, 7, 4, 2, 1].map((value, index) => ({
    name: String(index),
    value
  }));
  const percentile = percentileFromRanking(
    platform === "leetcode" ? profile?.ranking : cfRating || 808460,
  );

  const isReady =
    !loading && !error && (platform === "leetcode" ? profile && calendar : cfData);

  return {
    loading,
    error,
    profile,
    calendar,
    badges,
    cfData,
    heatmapValues,
    totalYearSubmissions,
    lc: {
      totalQuestions: lcTotalQuestions,
      solved: lcSolved,
      solvePct: lcSolvePct,
      lineData: lcLineData
    },
    cf: {
      rating: cfRating,
      maxRating: cfMaxRating,
      acceptedPct: cfAcceptedPct,
      lineData: cfLineData,
      accent: cfAccent
    },
    histogramData,
    percentile,
    isReady
  };
}
