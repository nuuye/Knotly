#!/usr/bin/env bash
set -Eeuo pipefail

# Always run commands from the repository root.
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="${ROOT_DIR}/backend"
MODE="${1:-local}"
WATCHER_PID=""

cd "${ROOT_DIR}"

# Export local overrides when a .env file exists.
if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

# Keep local development usable even before .env is created.
export DB_NAME="${DB_NAME:-knotly}"
export DB_USER="${DB_USER:-knotly}"
export DB_PASSWORD="${DB_PASSWORD:-knotly_dev_password}"
export KAFKA_PORT="${KAFKA_PORT:-9092}"

print_usage() {
  cat <<'EOF'
Usage: ./dev.sh [command]

Commands:
  local   Start infrastructure, tools and frontend in Docker, then run Spring locally (default)
  docker  Build and start the complete application in Docker
  infra   Start only PostgreSQL and Kafka
  stop    Stop and remove the development containers, while preserving volumes
  status  Show the current container status
  logs    Follow logs from all enabled services
  help    Show this help
EOF
}

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1" >&2
    exit 1
  fi
}

is_java_21() {
  local java_home="$1"
  local version_output=""

  [[ -x "${java_home}/bin/java" ]] || return 1
  version_output="$("${java_home}/bin/java" -version 2>&1)" || return 1
  grep -Eq '^(openjdk|java) version "21([."-]|$)' <<<"${version_output}"
}

configure_java() {
  local java_home_candidate=""

  if [[ -n "${JAVA_HOME:-}" ]] && is_java_21 "${JAVA_HOME}"; then
    return
  fi

  if [[ -d /opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home ]]; then
    java_home_candidate=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home
  elif [[ -x /usr/libexec/java_home ]]; then
    java_home_candidate="$(/usr/libexec/java_home -v 21 2>/dev/null || true)"
  fi

  if [[ -z "${java_home_candidate}" ]] || ! is_java_21 "${java_home_candidate}"; then
    echo "Java 21 was not found. Set JAVA_HOME before starting the local backend." >&2
    exit 1
  fi

  JAVA_HOME="${java_home_candidate}"
  export JAVA_HOME
}

start_local_services() {
  echo "Starting PostgreSQL, Kafka, pgAdmin and the frontend..."
  # Stop a containerized backend left running after a previous Docker session.
  docker compose --profile backend stop backend >/dev/null 2>&1 || true
  docker compose up --detach --wait
}

start_watcher() {
  if ! command -v fswatch >/dev/null 2>&1; then
    echo "fswatch is not installed; automatic backend recompilation is disabled."
    return
  fi

  echo "Watching backend sources for changes..."
  (
    fswatch -o "${BACKEND_DIR}/src" | while read -r _; do
      echo "Recompiling the backend..."
      (cd "${BACKEND_DIR}" && ./mvnw --quiet --define skipTests compile)
    done
  ) &
  WATCHER_PID=$!
}

cleanup() {
  if [[ -n "${WATCHER_PID}" ]] && kill -0 "${WATCHER_PID}" 2>/dev/null; then
    kill "${WATCHER_PID}" 2>/dev/null || true
    wait "${WATCHER_PID}" 2>/dev/null || true
  fi
}

run_local_backend() {
  configure_java
  start_local_services
  start_watcher
  trap cleanup EXIT INT TERM

  echo "Starting the Spring Boot backend locally..."
  cd "${BACKEND_DIR}"
  ./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
}

# Check if docker is available on system
require_command docker
docker compose version >/dev/null

case "${MODE}" in
  local)
    run_local_backend
    ;;
  docker)
    echo "Building and starting the complete Docker environment..."
    docker compose --profile backend up --detach --build --wait
    ;;
  infra)
    echo "Starting PostgreSQL and Kafka..."
    docker compose up --detach --wait postgres kafka
    ;;
  stop)
    docker compose --profile backend down
    ;;
  status)
    docker compose --profile backend ps
    ;;
  logs)
    docker compose --profile backend logs --follow
    ;;
  help|-h|--help)
    print_usage
    ;;
  *)
    echo "Unknown command: ${MODE}" >&2
    print_usage >&2
    exit 1
    ;;
esac
