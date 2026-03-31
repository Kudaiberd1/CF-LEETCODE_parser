export default function UserSearchForm({
  platform,
  username,
  onUsernameChange,
  onSubmit
}) {
  return (
    <form
      className={`search-row ${platform === "codeforces" ? "search-row-cf" : ""}`}
      onSubmit={onSubmit}
    >
      <input
        value={username}
        onChange={(event) => onUsernameChange(event.target.value)}
        placeholder={
          platform === "leetcode" ? "LeetCode username" : "Codeforces handle"
        }
      />
      <button type="submit">Load</button>
    </form>
  );
}
