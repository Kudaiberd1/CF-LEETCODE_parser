# alfa-leetcode-api

A LeetCode API wrapper with:

- REST endpoints for profile, submissions, discussions, contests, and problems
- Codeforces aggregate endpoint (`/codeforces/:handle`)
- React dashboard (LeetCode + Codeforces tabs)
- PNG rendering endpoints that capture the live dashboard UI (`/visual/*`)

## Tech Stack

- Backend: Node.js, TypeScript, Express
- Frontend: React + Vite + Recharts + react-calendar-heatmap
- Rendering: Puppeteer + headless Chromium
- Containerization: Docker + Docker Compose

## Project Structure

```text
.
├─ src/
│  ├─ app.ts
│  ├─ routes/
│  ├─ http/controllers/
│  ├─ services/
│  │  ├─ codeforces/
│  │  └─ leetcode/
│  ├─ clients/
│  ├─ middleware/
│  ├─ visual/
│  ├─ GQLQueries/
│  └─ FormatUtils/
├─ frontend/
│  ├─ src/
│  │  ├─ components/
│  │  ├─ hooks/
│  │  └─ services/
│  └─ Dockerfile*
├─ mcp/
│  ├─ modules/
│  └─ adapters/
├─ Dockerfile
├─ Dockerfile.dev
├─ docker-compose.yml
└─ docker-compose.dev.yml
```

## Run Locally (Node + Vite)

### 1) Install dependencies

```bash
npm install
cd frontend && npm install
```

### 2) Start backend (Terminal 1)

From repo root:

```bash
npm run dev
```

Backend default URL: `http://localhost:3000`

### 3) Start frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

Frontend default URL: `http://localhost:5173` (or next available port)

## Run with Docker

### Production-style stack

```bash
docker compose up --build
```

- API: `http://localhost:3000`
- Web: `http://localhost:8080`

### Development stack (hot reload)

```bash
docker compose -f docker-compose.dev.yml up --build
```

- API: `http://localhost:3000`
- Web (Vite): `http://localhost:5173`

## Key Endpoints

### Health / discovery

- `GET /` - API overview and route summary

### LeetCode user

- `GET /:username`
- `GET /:username/profile`
- `GET /:username/badges`
- `GET /:username/solved`
- `GET /:username/contest`
- `GET /:username/contest/history`
- `GET /:username/submission?limit=20`
- `GET /:username/acSubmission?limit=20`
- `GET /:username/calendar?year=2025`
- `GET /:username/skill`
- `GET /:username/language`
- `GET /:username/progress`

### Problems / contests / discussion

- `GET /daily`
- `GET /daily/raw`
- `GET /select?titleSlug=two-sum`
- `GET /select/raw?titleSlug=two-sum`
- `GET /officialSolution?titleSlug=two-sum`
- `GET /problems?limit=20&skip=0&difficulty=EASY&tags=array+math`
- `GET /contests`
- `GET /contests/upcoming`
- `GET /trendingDiscuss?first=20`
- `GET /discussTopic/:topicId`
- `GET /discussComments/:topicId`

### Codeforces

- `GET /codeforces/:handle`
  - Returns:
    - `user`
    - `ratingHistory`
    - `submissions`

### PNG snapshots (live dashboard capture)

- `GET /visual/leetcode/:username`
- `GET /visual/codeforces/:handle?cfMode=all|contest|practice|virtual`

Response type: `image/png`  
Cache header: `Cache-Control: public, max-age=300`

## How PNG Rendering Works

1. You call `/visual/...` on the API.
2. Backend launches Puppeteer.
3. Puppeteer opens the dashboard URL with screenshot query params.
4. React app loads data from API and marks `#screenshot-capture` ready.
5. Puppeteer captures that element and returns PNG bytes.

This guarantees the PNG looks like the same UI you see in the browser.

## Environment Variables

### Backend

- `PORT` (default `3000`)
- `DASHBOARD_URL`  
  URL Puppeteer opens to render dashboard UI.
  - local: `http://localhost:5173` (or your Vite port)
  - docker prod compose: `http://web:80`
  - docker dev compose: `http://web:5173`
- `SCREENSHOT_API_BASE` (default `http://127.0.0.1:3000`)  
  API base URL used by the dashboard from inside headless browser.
- `PUPPETEER_EXECUTABLE_PATH`  
  Optional local override for Chromium path.

### Frontend

- `VITE_API_BASE`  
  API URL used by users' browser (not by Puppeteer internal API calls).

## MCP Server

Run MCP tools via:

```bash
npm run mcp
```

MCP module modes:

- `all`
- `users`
- `problems`
- `discussions`

## Build

From repo root:

```bash
npm run build
cd frontend && npm run build
```

## Troubleshooting

- `ERR_CONNECTION_REFUSED` on `/visual/...`  
  `DASHBOARD_URL` is not reachable from backend process/container.

- `/visual/...` returns error JSON instead of PNG  
  Dashboard failed to load or fetch data (check backend logs and URL env vars).

- Frontend loads but API calls fail in browser  
  `VITE_API_BASE` is incorrect for your machine/network.

- Puppeteer launch fails on local machine  
  Install Chromium and set `PUPPETEER_EXECUTABLE_PATH`.

## License

ISC
