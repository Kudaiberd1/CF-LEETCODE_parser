export function codeforcesSubmissionSeconds(submission) {
  const seconds = Number(
    submission?.creationTimeSeconds ?? submission?.submissionTimeSeconds,
  );
  return Number.isFinite(seconds) ? seconds : null;
}

export function buildHeatValuesFromDateCounter(dateToCount) {
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

export function buildHeatValuesFromEpochMap(calendarMap) {
  const dateToCount = new Map();
  for (const [tsKey, rawCount] of Object.entries(calendarMap || {})) {
    const seconds = Number(tsKey);
    if (!Number.isFinite(seconds)) continue;
    const dateKey = new Date(seconds * 1000).toISOString().slice(0, 10);
    dateToCount.set(dateKey, Number(rawCount || 0));
  }
  return buildHeatValuesFromDateCounter(dateToCount);
}

export function buildHeatValuesFromSubmissionList(list, acceptedOnly) {
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

export function filterCodeforcesSubmissionsByMode(submissions, mode) {
  if (mode === "all") return submissions || [];
  const modeMap = {
    contest: "CONTESTANT",
    practice: "PRACTICE",
    virtual: "VIRTUAL"
  };
  const participantType = modeMap[mode];
  if (!participantType) return submissions || [];
  return (submissions || []).filter(
    (submission) => submission?.author?.participantType === participantType,
  );
}
