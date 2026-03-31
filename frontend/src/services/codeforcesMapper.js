import { codeforcesSubmissionSeconds } from "./heatmapMapper";

export function normalizeCodeforcesPayload(cfJson) {
  const user = cfJson.user;
  const ratingHistory = cfJson.ratingHistory || [];
  const submissions = cfJson.submissions || [];
  const accepted = submissions.filter((submission) => submission.verdict === "OK");
  const uniqueSolved = new Set(
    accepted.map(
      (submission) =>
        `${submission.problem?.contestId || "x"}-${submission.problem?.index || "x"}`,
    ),
  );
  const activeDays = new Set(
    accepted
      .map((submission) => {
        const seconds = codeforcesSubmissionSeconds(submission);
        if (seconds === null) return null;
        return new Date(seconds * 1000).toISOString().slice(0, 10);
      })
      .filter(Boolean),
  );

  return {
    user,
    ratingHistory,
    submissions,
    accepted,
    totalSolved: uniqueSolved.size,
    totalAccepted: accepted.length,
    totalSubmissions: submissions.length,
    totalActiveDays: activeDays.size
  };
}

export function cfAccentFromRating(rating) {
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
