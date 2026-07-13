#!/usr/bin/env bash
set -euo pipefail

if [ -z "${DATABASE_URL:-}" ]; then
  if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
  fi
fi

if [ -z "${DATABASE_URL:-}" ]; then
  echo "DATABASE_URL is required. Set it in .env"
  exit 1
fi

DIR="$(cd "$(dirname "$0")/.." && pwd)/supabase/migrations"

for f in "$DIR"/*.sql; do
  echo "Applying $(basename "$f")..."
  psql "$DATABASE_URL" -f "$f"
done

echo "All migrations applied."
