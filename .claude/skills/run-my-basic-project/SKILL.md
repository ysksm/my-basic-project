---
name: run-my-basic-project
description: run, start, launch, build, screenshot, test my-basic-project — FastAPI backend serving React frontend
---

FastAPI backend (`backend/`) serves the built React frontend (`web-frontend/dist`) as static files on port 8000. API endpoints sit alongside the SPA. The smoke driver (`smoke.sh`) starts the server, hits the endpoints, and exits. The web UI is driven via `chromium-cli`.

## Prerequisites

```bash
cd backend
uv sync          # creates .venv and installs fastapi + uvicorn
```

`web-frontend/dist` must exist for the static files to be served. If missing, build it first:

```bash
cd web-frontend
npm install
npm run build
```

## Run (agent path)

### Smoke test (API + static file check)

```bash
bash .claude/skills/run-my-basic-project/smoke.sh
```

Expected output:
```
--- /health ---
{"status":"ok"}
--- / (expect HTML) ---
Content-Type: text/html; charset=utf-8

OK: all checks passed
```

### Drive the web UI with chromium-cli

Start the server first:

```bash
cd backend && .venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000 &
```

Then use `chromium-cli` (Chrome DevTools MCP) to navigate and interact:

```
navigate to http://localhost:8000/
take snapshot            # find element uids
click uid=<button-uid>   # e.g. "Count is 0" button uid=1_8
take screenshot          # verify state change
```

Verified flow (run this session):
- `http://localhost:8000/` → returns `text/html` with React SPA
- Click "Count is 0" button (uid `1_8`) → button label updates to "Count is 1"

Stop the server:
```bash
pkill -f "uvicorn main:app"
```

## Run (human path)

```bash
cd backend
uv run uvicorn main:app --reload
# → http://localhost:8000  (browser opens manually)
# → http://localhost:8000/docs  (Swagger UI)
```

## Gotchas

- **Static files silently not served**: If `web-frontend/dist` doesn't exist at startup, `StaticFiles` mount is skipped (by design — see `main.py`). `GET /` returns 404 instead of HTML. Fix: build the frontend first.
- **Port already in use**: A previous uvicorn process may be lingering. Run `pkill -f "uvicorn main:app"` before starting.
- **CORS only allows `localhost:5173`**: If you run the React dev server (`npm run dev`) alongside the backend, API calls from the dev server (port 5173) are allowed. Calls from other origins are blocked.
