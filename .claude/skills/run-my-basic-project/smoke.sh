#!/usr/bin/env bash
# Smoke test: start backend, verify endpoints, stop.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
PORT=8000
BASE="http://localhost:$PORT"

# Kill any existing server on this port
pkill -f "uvicorn main:app" 2>/dev/null || true
sleep 1

# Start server in background
cd "$REPO_ROOT/backend"
.venv/bin/uvicorn main:app --host 0.0.0.0 --port "$PORT" &
SERVER_PID=$!
trap "kill $SERVER_PID 2>/dev/null || true" EXIT

# Wait for ready
for i in $(seq 1 10); do
  curl -sf "$BASE/health" >/dev/null 2>&1 && break
  sleep 1
done

echo "--- /health ---"
curl -sf "$BASE/health"
echo ""

echo "--- / (expect HTML) ---"
CT=$(curl -sf -o /dev/null -w "%{content_type}" "$BASE/")
echo "Content-Type: $CT"
[[ "$CT" == text/html* ]] || { echo "FAIL: expected text/html, got $CT"; exit 1; }

echo ""
echo "OK: all checks passed"
