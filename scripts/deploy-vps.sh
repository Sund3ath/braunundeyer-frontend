#!/bin/bash
# Deploy to the production VPS from your own machine.
#
#   ./scripts/deploy-vps.sh                 # frontend only (default)
#   ./scripts/deploy-vps.sh backend         # backend only
#   ./scripts/deploy-vps.sh admin           # admin panel (CMS) only
#   ./scripts/deploy-vps.sh all             # backend, then admin panel, then frontend
#   ./scripts/deploy-vps.sh rollback <sha>  # check out <sha> on the server and rebuild all three
#
# What it does (nothing is skipped silently; any failure stops the script):
#   1. checks that the commit you are about to deploy is on origin/main
#   2. backs up the SQLite database on the server (uploads are not touched)
#   3. git pull --ff-only origin main on the server
#   4. rebuilds the container(s) with docker compose (old containers keep
#      running until the new image is built)
#   5. waits for the site and smoke-tests the main URLs from here
#
# Requires the SSH alias `braunundeyer` (see ~/.ssh/config).

set -euo pipefail

HOST="${DEPLOY_HOST:-braunundeyer}"
REMOTE_DIR="${DEPLOY_DIR:-/home/braunundeyer-frontend}"
COMPOSE="docker compose -f docker-compose.prod-nginx.yml"
SITE="${DEPLOY_SITE:-https://braunundeyer.de}"

MODE="${1:-frontend}"
ROLLBACK_SHA="${2:-}"

c_ok()   { printf '\033[0;32m✓ %s\033[0m\n' "$1"; }
c_info() { printf '\033[1;33m→ %s\033[0m\n' "$1"; }
c_err()  { printf '\033[0;31m✗ %s\033[0m\n' "$1" >&2; }

case "$MODE" in
  frontend|backend|admin|all|rollback) ;;
  *) c_err "Unknown mode '$MODE' (use: frontend | backend | admin | all | rollback <sha>)"; exit 2 ;;
esac

ssh_run() { ssh -o BatchMode=yes -o ConnectTimeout=15 "$HOST" "$@"; }

# --- 1. what are we deploying? ------------------------------------------------
if [ "$MODE" != "rollback" ]; then
  git fetch -q origin main
  LOCAL_HEAD="$(git rev-parse --short HEAD)"
  REMOTE_MAIN="$(git rev-parse --short origin/main)"
  c_info "Local HEAD: $LOCAL_HEAD   origin/main: $REMOTE_MAIN"
  if ! git merge-base --is-ancestor HEAD origin/main; then
    c_err "Your local HEAD ($LOCAL_HEAD) is not on origin/main. Push first: git push origin <branch>:main"
    exit 1
  fi
  if [ "$LOCAL_HEAD" != "$REMOTE_MAIN" ]; then
    c_info "origin/main is ahead of your HEAD; the server will get origin/main ($REMOTE_MAIN)."
  fi
else
  [ -n "$ROLLBACK_SHA" ] || { c_err "rollback needs a commit: ./scripts/deploy-vps.sh rollback <sha>"; exit 2; }
fi

# --- 2. server state + backup -------------------------------------------------
c_info "Connecting to $HOST ..."
PREV_SHA="$(ssh_run "cd $REMOTE_DIR && git rev-parse --short HEAD")"
c_ok "Server is currently at $PREV_SHA"

STAMP="$(date +%Y%m%d_%H%M%S)"
c_info "Backing up the database ..."
ssh_run "cd $REMOTE_DIR && mkdir -p backups && docker cp braunundeyer-backend-prod:/app/data/database.sqlite backups/database_backup_pre-deploy_${STAMP}.sqlite && ls -la backups/database_backup_pre-deploy_${STAMP}.sqlite"
c_ok "Backup: backups/database_backup_pre-deploy_${STAMP}.sqlite"

# --- 3. code ------------------------------------------------------------------
if [ "$MODE" = "rollback" ]; then
  c_info "Checking out $ROLLBACK_SHA on the server ..."
  ssh_run "cd $REMOTE_DIR && git checkout -q $ROLLBACK_SHA && git log --oneline -1"
else
  c_info "Pulling origin/main on the server (fast-forward only) ..."
  ssh_run "cd $REMOTE_DIR && git pull --ff-only origin main 2>&1 | tail -4 && git log --oneline -1"
fi
NEW_SHA="$(ssh_run "cd $REMOTE_DIR && git rev-parse --short HEAD")"
c_ok "Server code is now at $NEW_SHA"

# --- 4. build -----------------------------------------------------------------
build() {
  c_info "Building $1 (this can take a few minutes; the old container keeps serving) ..."
  ssh_run "cd $REMOTE_DIR && $COMPOSE up -d --build $1 2>&1 | tail -8"
  c_ok "$1 rebuilt"
}

wait_backend() {
  c_info "Waiting for the backend to become healthy ..."
  st=unknown
  for i in $(seq 1 30); do
    st="$(ssh_run "docker inspect -f '{{.State.Health.Status}}' braunundeyer-backend-prod" 2>/dev/null || echo unknown)"
    [ "$st" = "healthy" ] && break
    sleep 3
  done
  if [ "$st" = "healthy" ]; then c_ok "Backend is healthy"; else c_err "Backend status: $st"; BACKEND_BAD=1; fi
}

BACKEND_BAD=0
case "$MODE" in
  backend)  build backend; wait_backend ;;
  admin)    build admin-panel ;;
  all|rollback)
            build backend; wait_backend
            if [ "$BACKEND_BAD" = "1" ]; then c_err "Stopping before admin panel and frontend because the backend is not healthy. Check: ssh $HOST 'docker logs --tail 60 braunundeyer-backend-prod'"; exit 1; fi
            build admin-panel
            build nextjs-app ;;
  *)        build nextjs-app ;;
esac

# --- 5. wait + smoke test -----------------------------------------------------
c_info "Waiting for $SITE/de ..."
code=000
for i in $(seq 1 40); do
  code="$(curl -s -o /dev/null -w '%{http_code}' "$SITE/de" || true)"
  [ "$code" = "200" ] && break
  sleep 3
done
[ "$code" = "200" ] || { c_err "$SITE/de answered $code after waiting. Check: ssh $HOST 'docker logs --tail 60 braunundeyer-nextjs-prod'"; FAIL=1; }

FAIL="${FAIL:-0}"
for u in /de /de/projekte /de/gallery /de/leistungen /de/uber-uns /de/kontakt /sitemap.xml /robots.txt /og-image.jpg; do
  code="$(curl -s -o /dev/null -w '%{http_code}' "$SITE$u" || true)"
  if [ "$code" = "200" ]; then c_ok "$u  200"; else c_err "$u  $code"; FAIL=1; fi
done
if [ "$MODE" = "backend" ] || [ "$MODE" = "all" ] || [ "$MODE" = "rollback" ]; then
  API="${DEPLOY_API:-https://api.braunundeyer.de}"
  for u in /api/projects /api/team /api/content/services; do
    code="$(curl -s -o /dev/null -w '%{http_code}' "$API$u" || true)"
    if [ "$code" = "200" ]; then c_ok "API $u  200"; else c_err "API $u  $code"; FAIL=1; fi
  done
  if [ "$MODE" != "rollback" ]; then
    # Hardened endpoints must refuse anonymous access (read-only checks).
    code="$(curl -s -o /dev/null -w '%{http_code}' "$API/api/analytics/dashboard" || true)"
    if [ "$code" = "401" ] || [ "$code" = "403" ]; then c_ok "API analytics/dashboard is protected ($code)"; else c_err "API analytics/dashboard answered $code (expected 401/403)"; FAIL=1; fi
    code="$(curl -s -o /dev/null -w '%{http_code}' "$API/api/contact/test" || true)"
    if [ "$code" = "401" ] || [ "$code" = "403" ]; then c_ok "API contact/test is protected ($code)"; else c_err "API contact/test answered $code (expected 401/403)"; FAIL=1; fi
  fi
fi
if [ "$MODE" = "admin" ] || [ "$MODE" = "all" ] || [ "$MODE" = "rollback" ]; then
  code="$(curl -s -o /dev/null -w '%{http_code}' "${DEPLOY_CMS:-https://cms.braunundeyer.de}/" || true)"
  if [ "$code" = "200" ]; then c_ok "CMS  200"; else c_err "CMS  $code"; FAIL=1; fi
fi

red="$(curl -s -o /dev/null -w '%{http_code}' "$SITE/de/homepage" || true)"
if [ "$red" = "308" ]; then c_ok "/de/homepage  308"; else c_err "/de/homepage  $red (expected 308)"; FAIL=1; fi

echo
if [ "$FAIL" = "0" ]; then
  c_ok "Deploy finished: $PREV_SHA -> $NEW_SHA"
else
  c_err "Deploy finished with problems. Roll back with:"
  echo "    ./scripts/deploy-vps.sh rollback $PREV_SHA"
  exit 1
fi
echo "Rollback if needed:  ./scripts/deploy-vps.sh rollback $PREV_SHA"
