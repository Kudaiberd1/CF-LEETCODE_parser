import { useMemo, useState } from "react";

export function useDashboardQueryState() {
  const shotConfig = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const validCf = ["all", "contest", "practice", "virtual"];
    const cfMode = params.get("cfMode");
    const screenshot = params.get("screenshot") === "1";
    return {
      screenshot,
      apiBase:
        params.get("apiBase") ||
        import.meta.env.VITE_API_BASE ||
        "http://localhost:3000",
      initialUser: screenshot && params.get("user") ? params.get("user") : null,
      initialPlatform:
        screenshot && params.get("platform") === "codeforces"
          ? "codeforces"
          : "leetcode",
      cfMode: screenshot && validCf.includes(cfMode || "") ? cfMode : "all"
    };
  }, []);

  const defaultUser =
    shotConfig.initialPlatform === "codeforces" ? "tourist" : "alfaarghya";

  const [platform, setPlatform] = useState(() => shotConfig.initialPlatform);
  const [username, setUsername] = useState(
    () => shotConfig.initialUser || defaultUser,
  );
  const [query, setQuery] = useState(() => shotConfig.initialUser || defaultUser);
  const [cfMode, setCfMode] = useState(() =>
    shotConfig.screenshot ? shotConfig.cfMode : "all",
  );

  const setLeetCodePreset = () => {
    setPlatform("leetcode");
    setUsername("alfaarghya");
    setQuery("alfaarghya");
  };

  const setCodeforcesPreset = () => {
    setPlatform("codeforces");
    setUsername("tourist");
    setQuery("tourist");
    setCfMode("all");
  };

  const submitUser = (event) => {
    event.preventDefault();
    if (!username.trim()) return;
    setQuery(username.trim());
  };

  return {
    screenshotMode: shotConfig.screenshot,
    apiBase: shotConfig.apiBase,
    platform,
    setPlatform,
    username,
    setUsername,
    query,
    setQuery,
    cfMode,
    setCfMode,
    setLeetCodePreset,
    setCodeforcesPreset,
    submitUser
  };
}
