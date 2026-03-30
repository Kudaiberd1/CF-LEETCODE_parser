# alfa-leetcode-api

REST API around LeetCode’s GraphQL surface, plus a **React dashboard** for **LeetCode** stats and **Codeforces** profiles, and **Docker** recipes to run everything together.

Upstreams the original idea and endpoints from [alfaarghya/alfa-leetcode-api](https://github.com/alfaarghya/alfa-leetcode-api). A hosted demo of the API (may lag this repo) lives at:

[https://alfa-leetcode-api.onrender.com/](https://alfa-leetcode-api.onrender.com/)

---

## What’s in this repo

| Part | Description |
|------|-------------|
| **API** (`src/`) | Express + TypeScript: user profile, calendar, contests, problems, discussions, etc. |
| **`GET /codeforces/:handle`** | Server-side proxy: merges Codeforces [official API](https://codeforces.com/apiHelp) `user.info`, `user.rating`, and `user.status` (avoids browser CORS when the dashboard calls your backend only). |
| **Dashboard** (`frontend/`) | Vite + React: LeetCode tab (stats + heatmap) and Codeforces tab (profile-style layout, rating chart, submission heatmap, activity filters). |
| **Docker** | Production and dev Compose files, plus separate Dockerfiles for API and web. |

---

## Requirements

- **Node.js** 20+ (22 used in Docker images)
- **npm** 10+
- **Docker** + **Docker Compose** (optional, for containerized runs)

---

## Quick start (local, no Docker)

### 1. API

```bash
npm install
npm run dev
```

Server listens on [http://localhost:3000](http://localhost:3000) unless you set `PORT`.

Production-style run:

```bash
npm run build
npm start
```

### 2. Dashboard

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). By default the app calls the API at [http://localhost:3000](http://localhost:3000).

To point the UI at another API origin (build or dev):

```bash
# Linux / macOS
VITE_API_BASE=http://127.0.0.1:3000 npm run dev

# Windows PowerShell
$env:VITE_API_BASE="http://127.0.0.1:3000"; npm run dev
```

`VITE_API_BASE` must be a URL **the browser** can reach (not a Docker-only hostname like `http://api:3000` unless you reverse-proxy).

---

## Docker

### Production: API + static dashboard

From the **repository root**:

```bash
docker compose up --build
```

- **API:** [http://localhost:3000](http://localhost:3000)
- **Web:** [http://localhost:8080](http://localhost:8080)

If you open the dashboard from another machine, rebuild the `web` service with the API URL that machine should use:

```bash
VITE_API_BASE=http://YOUR_SERVER_IP:3000 docker compose up --build
```

### Development: hot reload

```bash
docker compose -f docker-compose.dev.yml up --build
```

- **API:** [http://localhost:3000](http://localhost:3000)
- **Vite:** [http://localhost:5173](http://localhost:5173)

### Dockerfiles

| File | Purpose |
|------|---------|
| `Dockerfile` | Production API (`tsc` → `node dist/index.js`) |
| `Dockerfile.dev` | Dev API image used by `docker-compose.dev.yml` |
| `frontend/Dockerfile` | Build SPA + serve with nginx on port 80 |
| `frontend/Dockerfile.dev` | Vite dev server |

Legacy one-liner (API only, upstream image tag):

```bash
docker run -p 3000:3000 alfaarghya/alfa-leetcode-api:2.0.3
```

For this repo’s full stack, prefer `docker compose` as above.

---

## Codeforces proxy endpoint

`GET /codeforces/:handle`

Returns JSON:

```json
{
  "user": { },
  "ratingHistory": [ ],
  "submissions": [ ]
}
```

Errors use `4xx` / `502` with an `error` field. The dashboard uses this route instead of calling Codeforces directly from the browser.

---

## REST API overview (LeetCode)

Rate limiting applies in `src/app.ts` (see deployed behavior). During heavy use, prefer running your own instance.

### User

| Endpoint | Description |
|----------|-------------|
| `GET /:username` | Profile summary |
| `GET /:username/profile` | Full profile payload |
| `GET /:username/badges` | Badges |
| `GET /:username/solved` | Solved counts |
| `GET /:username/contest` | Contest summary |
| `GET /:username/contest/history` | Contest history |
| `GET /:username/submission` | Recent submissions (`?limit=`) |
| `GET /:username/acSubmission` | Recent AC (`?limit=`) |
| `GET /:username/calendar` | Submission calendar (`?year=`) |
| `GET /:username/skill` | Skill stats |
| `GET /:username/language` | Language stats |
| `GET /:username/progress` | Question progress |

### Problems & daily

| Endpoint | Description |
|----------|-------------|
| `GET /daily`, `GET /daily/raw` | Daily problem |
| `GET /select`, `GET /select/raw?titleSlug=…` | Problem by slug |
| `GET /problems` | List (`?limit=`, `?skip=`, `?tags=`, `?difficulty=`) |
| `GET /officialSolution?titleSlug=…` | Official solution hook |

### Contests & discussion

| Endpoint | Description |
|----------|-------------|
| `GET /contests`, `GET /contests/upcoming` | Contest lists |
| `GET /trendingDiscuss?first=…` | Trending discussions |
| `GET /discussTopic/:topicId`, `GET /discussComments/:topicId` | Discussion detail |

`GET /` returns a JSON overview of routes. Demo screenshots for many endpoints are under [public/demo/](public/demo/).

---

## Dashboard (frontend)

- **LeetCode:** fetch `/:username/profile` and `/:username/calendar`; heatmap follows LeetCode-style submission data (epoch keys in `submissionCalendar`).
- **Codeforces:** fetch `/codeforces/:handle`; heatmap uses **`creationTimeSeconds`** on submissions; filters: All / Contest / Practice / Virtual.

Stack: React 18, Vite, Recharts, `react-calendar-heatmap`, `react-circular-progressbar`.

---

## Scripts (API package)

| Script | Command |
|--------|---------|
| Dev API | `npm run dev` |
| Build | `npm run build` |
| Start (after build) | `npm start` |
| Tests | `npm test` |
| Lint | `npm run lint` |

---

## MCP server

This repo includes a Model Context Protocol server under `mcp/`. Build with `npm run build`, then point your MCP client at `dist/mcp/index.js`. Details and example config are unchanged in spirit from earlier docs; see [CONTRIBUTING.md](CONTRIBUTING.md) for workflow.

Example client snippet:

```json
{
  "mcpServers": {
    "leetcode-suite": {
      "command": "node",
      "args": ["/absolute/path/to/alfa-leetcode-api/dist/mcp/index.js"]
    }
  }
}
```

Inspector (after build):

```bash
npx @modelcontextprotocol/inspector node /absolute/path/to/alfa-leetcode-api/dist/mcp/index.js
```

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

---

## License

[MIT](LICENSE)

---

## Authors & contributors

Original author: [@alfaarghya](https://github.com/alfaarghya)

Past contributions (from upstream history) include work by [@aryanpingle](https://github.com/aryanpingle), [@jamesh48](https://github.com/jamesh48), [@kvqn](https://github.com/kvqn), [@changchunlei](https://github.com/changchunlei), [@merakesh99](https://github.com/merakesh99), [@Ayushman2004](https://github.com/Ayushman2004), [@ajchili](https://github.com/ajchili), [@theinit01](https://github.com/theinit01), [@123xylem](https://github.com/123xylem), [@P-M-Manmohan](https://github.com/P-M-Manmohan), [@Ahmed-Armaan](https://github.com/Ahmed-Armaan), [@devroopsaha744](https://github.com/devroopsaha744), and others listed in previous README revisions.

Connect: [LinkedIn](https://linkedin.com/in/alfaarghya) · [LeetCode](https://leetcode.com/alfaarghya/)
