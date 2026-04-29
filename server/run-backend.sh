#!/bin/sh

set -eu

SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
cd "$SCRIPT_DIR"

JAVA_HOME_CANDIDATE="$(/usr/libexec/java_home -v 24 2>/dev/null || /usr/libexec/java_home -v 23 2>/dev/null || /usr/libexec/java_home -v 22 2>/dev/null || /usr/libexec/java_home -v 21 2>/dev/null || true)"

if [ -z "${JAVA_HOME_CANDIDATE}" ]; then
  echo "No supported JDK was found on this machine."
  echo "Install Java 21, 22, 23, or 24, then run this script again."
  exit 1
fi

export JAVA_HOME="${JAVA_HOME_CANDIDATE}"
export PATH="${JAVA_HOME}/bin:${PATH}"

SERVER_PORT="${SERVER_PORT:-8080}"
EXISTING_PID="$(lsof -ti tcp:${SERVER_PORT} -sTCP:LISTEN 2>/dev/null || true)"

if [ -n "${EXISTING_PID}" ]; then
  echo "Port ${SERVER_PORT} is already in use by PID ${EXISTING_PID}."
  echo "The backend may already be running."
  echo "Stop the existing process first, or run with a different port like:"
  echo "  SERVER_PORT=8081 sh server/run-backend.sh"
  exit 1
fi

echo "Using $(java -version 2>&1 | head -n 1)"
exec mvn spring-boot:run -Dspring-boot.run.arguments="--server.port=${SERVER_PORT}"
