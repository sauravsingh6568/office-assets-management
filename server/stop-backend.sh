#!/bin/sh

set -eu

SERVER_PORT="${SERVER_PORT:-8080}"
PIDS="$(lsof -ti tcp:${SERVER_PORT} -sTCP:LISTEN 2>/dev/null || true)"

if [ -z "${PIDS}" ]; then
  echo "No backend process is listening on port ${SERVER_PORT}."
  exit 0
fi

echo "Stopping backend on port ${SERVER_PORT} (PID: ${PIDS})"
kill ${PIDS}

sleep 1

REMAINING_PIDS="$(lsof -ti tcp:${SERVER_PORT} -sTCP:LISTEN 2>/dev/null || true)"
if [ -n "${REMAINING_PIDS}" ]; then
  echo "Process is still running on port ${SERVER_PORT}. Use the following if you need a force stop:"
  echo "  kill -9 ${REMAINING_PIDS}"
  exit 1
fi

echo "Backend stopped successfully."
