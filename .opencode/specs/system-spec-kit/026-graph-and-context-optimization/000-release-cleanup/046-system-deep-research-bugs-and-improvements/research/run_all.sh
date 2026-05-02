#!/usr/bin/env bash
# run_all.sh — dispatch iterations START..END sequentially
# Usage: run_all.sh [START] [END]   (defaults: 2..20)
set -uo pipefail

START="${1:-2}"
END="${2:-20}"

REPO_ROOT="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public"
PACKET="${REPO_ROOT}/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/046-system-deep-research-bugs-and-improvements"
ART="${PACKET}/research"
DRIVER="${ART}/run_iteration.sh"
PROMPTS="${ART}/prompts"

# angle-id mapping by iteration
declare -A ANGLE
ANGLE[1]=A1; ANGLE[2]=A2; ANGLE[3]=A3; ANGLE[4]=A4; ANGLE[5]=A5
ANGLE[6]=B1; ANGLE[7]=B2; ANGLE[8]=B3; ANGLE[9]=B4; ANGLE[10]=B5
ANGLE[11]=C1; ANGLE[12]=C2; ANGLE[13]=C3; ANGLE[14]=C4; ANGLE[15]=C5
ANGLE[16]=D1; ANGLE[17]=D2; ANGLE[18]=D3; ANGLE[19]=D4; ANGLE[20]=D5

declare -A TITLE
TITLE[1]="Daemon concurrency edge cases"
TITLE[2]="Code-graph SQLite contention"
TITLE[3]="Resource leaks across mcp_server"
TITLE[4]="Silent error recovery patterns"
TITLE[5]="Schema validation gaps"
TITLE[6]="Hook contract drift across runtimes"
TITLE[7]="CLI orchestrator skill correctness"
TITLE[8]="Memory MCP round-trip integrity"
TITLE[9]="Spec-kit validator correctness"
TITLE[10]="Workflow command auto-routing"
TITLE[11]="Search-quality W3-W13 latency and accuracy"
TITLE[12]="Scorer fusion accuracy on edge cases"
TITLE[13]="Skill advisor recommendation quality"
TITLE[14]="Code-graph staleness detection accuracy"
TITLE[15]="Test suite reliability and flake patterns"
TITLE[16]="mcp_server/lib/ boundary discipline"
TITLE[17]="Module dependency graph health"
TITLE[18]="Type / schema duplication"
TITLE[19]="Spec-kit folder topology sustainability"
TITLE[20]="Build / dist / runtime separation"

CONSEC_FAIL=0
TOTAL_OK=0
TOTAL_FAIL=0

for i in $(seq "${START}" "${END}"); do
  NNN=$(printf "%03d" "$i")
  AID="${ANGLE[$i]}"
  TIT="${TITLE[$i]}"
  PROMPT="${PROMPTS}/iteration-${NNN}.md"
  echo "[$(date -u +%H:%M:%S)] === DISPATCH iter ${NNN} (${AID}) ${TIT} ==="

  # Skip if iteration already complete (markdown + delta both present)
  if [[ -f "${ART}/iterations/iteration-${NNN}.md" ]] && [[ -f "${ART}/deltas/iter-${NNN}.jsonl" ]]; then
    echo "[$(date -u +%H:%M:%S)] SKIP iter ${NNN} — artifacts already exist"
    TOTAL_OK=$((TOTAL_OK+1))
    CONSEC_FAIL=0
    continue
  fi

  # Try up to 2 retries on transient failure
  RETRY=0
  while [[ $RETRY -le 2 ]]; do
    bash "${DRIVER}" "${NNN}" "${AID}" "${TIT}" "${PROMPT}"
    DRV_EXIT=$?
    if [[ $DRV_EXIT -eq 0 ]] && [[ -f "${ART}/iterations/iteration-${NNN}.md" ]] && [[ -f "${ART}/deltas/iter-${NNN}.jsonl" ]]; then
      echo "[$(date -u +%H:%M:%S)] OK iter ${NNN}"
      TOTAL_OK=$((TOTAL_OK+1))
      CONSEC_FAIL=0
      break
    fi
    RETRY=$((RETRY+1))
    echo "[$(date -u +%H:%M:%S)] RETRY $RETRY for iter ${NNN} (driver exit ${DRV_EXIT})"
    sleep 30
  done

  if [[ ! -f "${ART}/iterations/iteration-${NNN}.md" ]] || [[ ! -f "${ART}/deltas/iter-${NNN}.jsonl" ]]; then
    echo "[$(date -u +%H:%M:%S)] FAIL iter ${NNN} after retries — marking BLOCKED"
    # Mark blocked
    cat > "${ART}/iterations/iteration-${NNN}.md" <<EOF
# Iteration ${NNN} — ${AID}: ${TIT} (BLOCKED)

## Focus
Investigation aborted because cli-codex dispatch failed after 3 attempts (rate limit / timeout / transient error).

## Actions Taken
- Attempted dispatch via \`run_iteration.sh ${NNN} ${AID}\` 3 times.
- All attempts produced no iteration markdown.

## Findings

| ID | Priority | File:Line | Description | Recommendation |
|----|----------|-----------|-------------|----------------|
| F-${NNN}-${AID}-blocked | none | n/a | Iteration blocked, no findings produced | Re-run via /spec_kit:deep-research:auto with executor recovery |

## Questions Answered
- None (iteration blocked).

## Questions Remaining
- All ${AID} questions remain open.

## Next Focus
- Re-dispatch this iteration with a fresh codex session.
EOF
    cat > "${ART}/deltas/iter-${NNN}.jsonl" <<EOF
{"type":"iteration","iteration":${i},"newInfoRatio":0,"status":"blocked","focus":"${AID}: ${TIT}","angle":"${AID}"}
{"type":"event","event":"iteration_blocked","iteration":${i},"reason":"cli-codex dispatch failed after retries","angle":"${AID}"}
EOF
    # Append to state log
    echo "{\"type\":\"iteration\",\"iteration\":${i},\"newInfoRatio\":0,\"status\":\"blocked\",\"focus\":\"${AID}: ${TIT}\",\"angle\":\"${AID}\"}" >> "${ART}/deep-research-state.jsonl"
    TOTAL_FAIL=$((TOTAL_FAIL+1))
    CONSEC_FAIL=$((CONSEC_FAIL+1))
  fi

  # Hard halt: 3 consecutive iteration failures → bail out per task requirements
  if [[ $CONSEC_FAIL -ge 3 ]]; then
    echo "[$(date -u +%H:%M:%S)] HALT — 3 consecutive iteration failures; stopping loop"
    break
  fi
done

echo "[$(date -u +%H:%M:%S)] DONE iterations=${START}..${END} ok=${TOTAL_OK} fail=${TOTAL_FAIL}"
