#!/usr/bin/env bash
# Orchestrator: runs the 9-scenario × 3-CLI matrix + ablation cells.
# Usage: run-all.sh [--cli codex,copilot,opencode] [--scenarios S1,Q3,...] [--skip-existing]
#   Defaults: all 3 CLIs, all 9 scenarios, NO skip.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"   # .../001-search-intelligence-stress-test
RUNS_DIR="${ROOT}/002-scenario-execution/runs"
PROMPTS_DIR="${ROOT}/001-scenario-design/scripts/prompts"
LOG_FILE="${ROOT}/002-scenario-execution/runs/run-all.log"

mkdir -p "$RUNS_DIR" "$PROMPTS_DIR"

CLIS_DEFAULT="codex,copilot,opencode"
SCENARIOS_DEFAULT="S1,S2,S3,Q1,Q2,Q3,I1,I2,I3"
CLIS="$CLIS_DEFAULT"
SCENARIOS="$SCENARIOS_DEFAULT"
SKIP_EXISTING=0
RUN_ABLATION=1

while [ $# -gt 0 ]; do
  case "$1" in
    --cli) CLIS="$2"; shift 2 ;;
    --scenarios) SCENARIOS="$2"; shift 2 ;;
    --skip-existing) SKIP_EXISTING=1; shift ;;
    --no-ablation) RUN_ABLATION=0; shift ;;
    *) echo "unknown arg: $1" >&2; exit 1 ;;
  esac
done

log() { echo "[$(date -u +%H:%M:%S)] $*" | tee -a "$LOG_FILE"; }

# Pre-flight
log "=== PRE-FLIGHT ==="
for bin in codex copilot opencode; do
  if command -v "$bin" >/dev/null; then
    log "✓ $bin: $(command -v $bin)"
  else
    log "✗ $bin: NOT INSTALLED"
    exit 1
  fi
done

# DB snapshot hash (best-effort)
DB_PATH="${HOME}/.opencode/spec-kit-memory.db"
if [ -f "$DB_PATH" ]; then
  DB_HASH=$(shasum -a 256 "$DB_PATH" | cut -c1-16)
  log "memory-db hash: ${DB_HASH}"
fi

dispatch_one_ablation() {
  # cli-opencode --pure for ablation: disables plugins, isolates model quality from MCP advantage
  local scenario="$1" run_n="${2:-1}"
  local prompt_file="${PROMPTS_DIR}/${scenario}.md"
  local out_dir="${RUNS_DIR}/${scenario}"
  mkdir -p "$out_dir"
  if [ ! -f "$prompt_file" ]; then
    log "✗ ${scenario}/opencode-pure: prompt file missing"
    return 1
  fi
  local cell_dir="${out_dir}/cli-opencode-pure-${run_n}"
  if [ "$SKIP_EXISTING" -eq 1 ] && [ -f "${cell_dir}/meta.json" ]; then
    log "⊙ ${scenario}/opencode-pure/${run_n}: skipped (exists)"
    return 0
  fi
  log ">>> ${scenario}/opencode-pure/${run_n} dispatching..."
  bash "${SCRIPT_DIR}/dispatch-cli-opencode.sh" "$scenario" "$run_n" "$prompt_file" "$out_dir" "general" "pure"
}

dispatch_one() {
  local scenario="$1" cli="$2" run_n="${3:-1}" agent="${4:-general}"
  local prompt_file="${PROMPTS_DIR}/${scenario}.md"
  local out_dir="${RUNS_DIR}/${scenario}"
  mkdir -p "$out_dir"

  if [ ! -f "$prompt_file" ]; then
    log "✗ ${scenario}/${cli}: prompt file missing at ${prompt_file}"
    return 1
  fi

  local cell_label="${cli}"
  [ "$cli" = "opencode" ] && [ "$agent" != "general" ] && cell_label="opencode-${agent}"
  local cell_dir="${out_dir}/cli-${cell_label}-${run_n}"
  if [ "$SKIP_EXISTING" -eq 1 ] && [ -f "${cell_dir}/meta.json" ]; then
    log "⊙ ${scenario}/${cell_label}/${run_n}: skipped (exists)"
    return 0
  fi

  log ">>> ${scenario}/${cell_label}/${run_n} dispatching..."
  case "$cli" in
    codex) bash "${SCRIPT_DIR}/dispatch-cli-codex.sh" "$scenario" "$run_n" "$prompt_file" "$out_dir" ;;
    copilot) bash "${SCRIPT_DIR}/dispatch-cli-copilot.sh" "$scenario" "$run_n" "$prompt_file" "$out_dir" ;;
    opencode) bash "${SCRIPT_DIR}/dispatch-cli-opencode.sh" "$scenario" "$run_n" "$prompt_file" "$out_dir" "$agent" ;;
    *) log "✗ unknown cli: $cli"; return 1 ;;
  esac
}

# Main sweep
log "=== SWEEP START === clis=${CLIS} scenarios=${SCENARIOS}"
SWEEP_START=$(date +%s)

IFS=',' read -ra SCENARIO_LIST <<< "$SCENARIOS"
IFS=',' read -ra CLI_LIST <<< "$CLIS"

for scenario in "${SCENARIO_LIST[@]}"; do
  for cli in "${CLI_LIST[@]}"; do
    dispatch_one "$scenario" "$cli" "1" "general" || log "  -> failed; continuing"
  done
done

# Ablation cells: cli-opencode --pure for S1, S2, S3 (per cli-codex review P0:
# --pure ACTUALLY disables plugins/MCP; --agent context only swaps the agent profile)
if [ "$RUN_ABLATION" -eq 1 ] && echo "$CLIS" | grep -q opencode; then
  log "=== ABLATION CELLS (cli-opencode --pure, plugins disabled) ==="
  for scenario in S1 S2 S3; do
    if echo "$SCENARIOS" | grep -q "$scenario"; then
      dispatch_one_ablation "$scenario" || log "  -> ablation failed; continuing"
    fi
  done
fi

SWEEP_END=$(date +%s)
log "=== SWEEP DONE === elapsed=$((SWEEP_END - SWEEP_START))s"
log "Run artifacts: ${RUNS_DIR}"
log "Next: open each runs/<scenario>/<cli>-N/output.txt and fill score.md per 001 rubric"
