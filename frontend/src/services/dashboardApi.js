import { normalizeCodeforcesPayload } from "./codeforcesMapper";

export async function fetchLeetCodeDashboard(apiBase, username) {
  const [profileRes, calendarRes, badgesRes] = await Promise.all([
    fetch(`${apiBase}/${username}/profile`),
    fetch(`${apiBase}/${username}/calendar`),
    fetch(`${apiBase}/${username}/badges`)
  ]);
  if (!profileRes.ok || !calendarRes.ok || !badgesRes.ok) {
    throw new Error("Could not fetch LeetCode data. Check username/API.");
  }
  const profileData = await profileRes.json();
  const calendarData = await calendarRes.json();
  const badgesData = await badgesRes.json();
  const calendarMap =
    typeof calendarData.submissionCalendar === "string"
      ? JSON.parse(calendarData.submissionCalendar)
      : calendarData.submissionCalendar;
  return {
    profile: profileData,
    calendar: { ...calendarData, submissionCalendar: calendarMap },
    badges: badgesData
  };
}

export async function fetchCodeforcesDashboard(apiBase, handle) {
  const response = await fetch(`${apiBase}/codeforces/${encodeURIComponent(handle)}`);
  if (!response.ok) {
    throw new Error("Could not fetch Codeforces data.");
  }
  const payload = await response.json();
  return normalizeCodeforcesPayload(payload);
}
