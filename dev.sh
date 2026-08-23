#!/bin/bash
set -euo pipefail

export JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home

set -a
source .env
set +a

echo "⏳ Docker compose down..."
docker compose -f docker-compose.dev.yml down

echo "⏳ Démarrage de l'infra..."
docker compose -f docker-compose.dev.yml up -d

echo "⏳ Attente que Postgres soit prêt..."
sleep 5

echo "⏳ Démarrage du watcher de compilation..."
fswatch -o ./backend/src | xargs -I{} sh -c 'echo "🔨 Recompilation..." && cd backend && mvn compile -q' &

echo "⏳ Démarrage du backend..."
cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev