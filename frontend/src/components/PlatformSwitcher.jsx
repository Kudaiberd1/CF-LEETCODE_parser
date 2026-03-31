export default function PlatformSwitcher({
  platform,
  onLeetCode,
  onCodeforces
}) {
  return (
    <div className="platform-row">
      <button
        type="button"
        className={`platform-btn ${platform === "leetcode" ? "active" : ""}`}
        onClick={onLeetCode}
      >
        LeetCode
      </button>
      <button
        type="button"
        className={`platform-btn platform-btn-cf ${platform === "codeforces" ? "active" : ""}`}
        onClick={onCodeforces}
      >
        Codeforces
      </button>
    </div>
  );
}
