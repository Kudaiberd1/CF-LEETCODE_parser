const MODE_OPTIONS = ["all", "contest", "practice", "virtual"];

export default function CfModeFilter({ cfMode, onChange }) {
  return (
    <div className="platform-row cf-mode-row">
      <span className="cf-mode-label">Activity filter</span>
      {MODE_OPTIONS.map((mode) => (
        <button
          key={mode}
          type="button"
          className={`cf-chip ${cfMode === mode ? "active" : ""}`}
          onClick={() => onChange(mode)}
        >
          {mode.charAt(0).toUpperCase() + mode.slice(1)}
        </button>
      ))}
    </div>
  );
}
