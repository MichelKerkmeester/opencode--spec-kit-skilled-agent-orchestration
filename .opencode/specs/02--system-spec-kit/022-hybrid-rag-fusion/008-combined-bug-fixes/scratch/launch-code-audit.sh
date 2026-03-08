#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# Feature Catalog Code Audit — 35-Agent Batch Launcher
# ───────────────────────────────────────────────────────────────
# Stream 1: A01-A30 (gpt-5.3-codex via copilot, per-feature code audit)
# Stream 2: S01-S05 (gpt-5.4 via codex, cross-cutting architectural review)
#
# Usage: bash launch-code-audit.sh [--stream1-only] [--stream2-only] [--dry-run] [--wave N]
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../../../../.." && pwd)"
SCRATCH_DIR="$SCRIPT_DIR"
FC_DIR="$PROJECT_ROOT/.opencode/skill/system-spec-kit/feature_catalog"
MCP_DIR="$PROJECT_ROOT/.opencode/skill/system-spec-kit/mcp_server"
SHARED_DIR="$PROJECT_ROOT/.opencode/skill/system-spec-kit/shared"
PRIOR_REVIEW="$SCRATCH_DIR/codex-review-report-2026-03-08.md"

DRY_RUN=false
STREAM1=true
STREAM2=true
START_WAVE=1
PIDS=()
FAILED=0

for arg in "$@"; do
  case $arg in
    --stream1-only) STREAM2=false ;;
    --stream2-only) STREAM1=false ;;
    --dry-run) DRY_RUN=true ;;
    --wave) shift; START_WAVE="${2:-1}" ;;
    [0-9]) START_WAVE="$arg" ;;
  esac
done

log() { echo "[$(date +%H:%M:%S)] $*"; }

# ─── Launcher Functions ──────────────────────────────────────

launch_copilot() {
  local id="$1"
  local output_file="$2"
  local prompt="$3"

  if $DRY_RUN; then
    log "DRY-RUN: Would launch $id → $(basename "$output_file") [copilot/gpt-5.3-codex]"
    return
  fi

  log "Launching $id → $(basename "$output_file") [copilot/gpt-5.3-codex]"
  (
    cd "$PROJECT_ROOT"
    copilot -p "$prompt" --model gpt-5.3-codex --allow-all-tools \
      > "$output_file" 2>&1 || echo "AGENT_ERROR: $id failed with exit code $?" >> "$output_file"
  ) &
  PIDS+=($!)
}

launch_codex() {
  local id="$1"
  local output_file="$2"
  local prompt="$3"

  if $DRY_RUN; then
    log "DRY-RUN: Would launch $id → $(basename "$output_file") [codex/gpt-5.4]"
    return
  fi

  log "Launching $id → $(basename "$output_file") [codex/gpt-5.4]"
  (
    cd "$PROJECT_ROOT"
    codex exec "$prompt" \
      --model gpt-5.4 \
      --sandbox read-only \
      -c model_reasoning_effort="high" \
      > "$output_file" 2>&1 || echo "AGENT_ERROR: $id failed with exit code $?" >> "$output_file"
  ) &
  PIDS+=($!)
}

wait_wave() {
  local wave_name="$1"
  local count=${#PIDS[@]}
  log "=== Waiting for $wave_name ($count agents) ==="
  if [[ $count -gt 0 ]]; then
    for pid in "${PIDS[@]}"; do
      if ! wait "$pid"; then
        FAILED=$((FAILED + 1))
      fi
    done
  fi
  PIDS=()
  log "=== $wave_name complete (failed so far: $FAILED) ==="
}

# ─── Shared Prompt Suffix ────────────────────────────────────

AUDIT_SUFFIX='

FOR EACH FEATURE FILE:
1. Read the feature file, extract all paths from "## Source Files"
2. Read each source file and audit for:
   a. LOGIC BUGS: incorrect conditionals, off-by-one, wrong variable, race conditions
   b. ERROR HANDLING: uncaught exceptions, missing null checks, error swallowing
   c. TYPE SAFETY: unsafe casts, any-typed parameters, missing type guards
   d. EDGE CASES: empty arrays, zero values, undefined properties, NaN propagation
   e. RESOURCE MANAGEMENT: unclosed handles, missing cleanup, memory leaks
3. Check if each source file appears in its directory README.md

OUTPUT FORMAT (per feature):
---
FEATURE: [filename]
SOURCE_FILES_AUDITED: [count]
BUGS_FOUND: [count]

BUG: [id]
FILE: [path]:[line_range]
SEVERITY: [P0-CRITICAL/P1-IMPORTANT/P2-MINOR]
TYPE: [LOGIC/ERROR_HANDLING/TYPE_SAFETY/EDGE_CASE/RESOURCE]
DESCRIPTION: [what is wrong]
EVIDENCE: [code snippet]
SUGGESTED_FIX: [how to fix]

README_COVERAGE:
- [file]: [LISTED/MISSING] in [readme_path]
---

If no bugs found for a feature, still output the FEATURE header with BUGS_FOUND: 0.

LEAF NESTING CONSTRAINT: You are at depth 1. Do NOT invoke sub-agents. Complete with direct tool calls only.
Depth: 1'

# ═══════════════════════════════════════════════════════════════
# STREAM 1: CODE AUDIT AGENTS (A01-A30) via Copilot / gpt-5.3-codex
# ═══════════════════════════════════════════════════════════════

if $STREAM1; then

  # ─── WAVE 1: A01-A05 (Retrieval + Mutation + Discovery/Maintenance) ───

  if [[ $START_WAVE -le 1 ]]; then
    log "=== WAVE 1: A01-A05 ==="

    # A01: 01--retrieval (01-05)
    launch_copilot "A01" "$SCRATCH_DIR/code-audit-A01.md" \
      "You are a code audit agent. Audit the source code referenced by feature catalog files for bugs.

WORKING DIRECTORY: $PROJECT_ROOT
MCP SERVER: $MCP_DIR/

FEATURE FILES:
- $FC_DIR/01--retrieval/01-unified-context-retrieval-memorycontext.md
- $FC_DIR/01--retrieval/02-semantic-and-lexical-search-memorysearch.md
- $FC_DIR/01--retrieval/03-trigger-phrase-matching-memorymatchtriggers.md
- $FC_DIR/01--retrieval/04-hybrid-search-pipeline.md
- $FC_DIR/01--retrieval/05-4-stage-pipeline-architecture.md
$AUDIT_SUFFIX"
    sleep 3

    # A02: 01--retrieval (06-09)
    launch_copilot "A02" "$SCRATCH_DIR/code-audit-A02.md" \
      "You are a code audit agent. Audit the source code referenced by feature catalog files for bugs.

WORKING DIRECTORY: $PROJECT_ROOT
MCP SERVER: $MCP_DIR/

FEATURE FILES:
- $FC_DIR/01--retrieval/06-bm25-trigger-phrase-re-index-gate.md
- $FC_DIR/01--retrieval/07-ast-level-section-retrieval-tool.md
- $FC_DIR/01--retrieval/08-quality-aware-3-tier-search-fallback.md
- $FC_DIR/01--retrieval/09-tool-result-extraction-to-working-memory.md
$AUDIT_SUFFIX"
    sleep 3

    # A03: 02--mutation (01-05)
    launch_copilot "A03" "$SCRATCH_DIR/code-audit-A03.md" \
      "You are a code audit agent. Audit the source code referenced by feature catalog files for bugs.

WORKING DIRECTORY: $PROJECT_ROOT
MCP SERVER: $MCP_DIR/

FEATURE FILES:
- $FC_DIR/02--mutation/01-memory-indexing-memorysave.md
- $FC_DIR/02--mutation/02-memory-metadata-update-memoryupdate.md
- $FC_DIR/02--mutation/03-single-and-folder-delete-memorydelete.md
- $FC_DIR/02--mutation/04-tier-based-bulk-deletion-memorybulkdelete.md
- $FC_DIR/02--mutation/05-validation-feedback-memoryvalidate.md
$AUDIT_SUFFIX"
    sleep 3

    # A04: 02--mutation (06-10)
    launch_copilot "A04" "$SCRATCH_DIR/code-audit-A04.md" \
      "You are a code audit agent. Audit the source code referenced by feature catalog files for bugs.

WORKING DIRECTORY: $PROJECT_ROOT
MCP SERVER: $MCP_DIR/

FEATURE FILES:
- $FC_DIR/02--mutation/06-transaction-wrappers-on-mutation-handlers.md
- $FC_DIR/02--mutation/07-namespace-management-crud-tools.md
- $FC_DIR/02--mutation/08-prediction-error-save-arbitration.md
- $FC_DIR/02--mutation/09-correction-tracking-with-undo.md
- $FC_DIR/02--mutation/10-per-memory-history-log.md
$AUDIT_SUFFIX"
    sleep 3

    # A05: 03--discovery + 04--maintenance
    launch_copilot "A05" "$SCRATCH_DIR/code-audit-A05.md" \
      "You are a code audit agent. Audit the source code referenced by feature catalog files for bugs.

WORKING DIRECTORY: $PROJECT_ROOT
MCP SERVER: $MCP_DIR/

FEATURE FILES:
- $FC_DIR/03--discovery/01-memory-browser-memorylist.md
- $FC_DIR/03--discovery/02-system-statistics-memorystats.md
- $FC_DIR/03--discovery/03-health-diagnostics-memoryhealth.md
- $FC_DIR/04--maintenance/01-workspace-scanning-and-indexing-memoryindexscan.md
- $FC_DIR/04--maintenance/02-startup-runtime-compatibility-guards.md
$AUDIT_SUFFIX"
    sleep 3

    wait_wave "Wave 1"
  fi

  # ─── WAVE 2: A06-A10 (Lifecycle + Analysis + Evaluation + Bug Fixes) ───

  if [[ $START_WAVE -le 2 ]]; then
    log "=== WAVE 2: A06-A10 ==="

    # A06: 05--lifecycle (01-04)
    launch_copilot "A06" "$SCRATCH_DIR/code-audit-A06.md" \
      "You are a code audit agent. Audit the source code referenced by feature catalog files for bugs.

WORKING DIRECTORY: $PROJECT_ROOT
MCP SERVER: $MCP_DIR/

FEATURE FILES:
- $FC_DIR/05--lifecycle/01-checkpoint-creation-checkpointcreate.md
- $FC_DIR/05--lifecycle/02-checkpoint-listing-checkpointlist.md
- $FC_DIR/05--lifecycle/03-checkpoint-restore-checkpointrestore.md
- $FC_DIR/05--lifecycle/04-checkpoint-deletion-checkpointdelete.md
$AUDIT_SUFFIX"
    sleep 3

    # A07: 05--lifecycle (05-07)
    launch_copilot "A07" "$SCRATCH_DIR/code-audit-A07.md" \
      "You are a code audit agent. Audit the source code referenced by feature catalog files for bugs.

WORKING DIRECTORY: $PROJECT_ROOT
MCP SERVER: $MCP_DIR/

FEATURE FILES:
- $FC_DIR/05--lifecycle/05-async-ingestion-job-lifecycle.md
- $FC_DIR/05--lifecycle/06-startup-pending-file-recovery.md
- $FC_DIR/05--lifecycle/07-automatic-archival-subsystem.md
$AUDIT_SUFFIX"
    sleep 3

    # A08: 06--analysis (01-04)
    launch_copilot "A08" "$SCRATCH_DIR/code-audit-A08.md" \
      "You are a code audit agent. Audit the source code referenced by feature catalog files for bugs.

WORKING DIRECTORY: $PROJECT_ROOT
MCP SERVER: $MCP_DIR/

FEATURE FILES:
- $FC_DIR/06--analysis/01-causal-edge-creation-memorycausallink.md
- $FC_DIR/06--analysis/02-causal-graph-statistics-memorycausalstats.md
- $FC_DIR/06--analysis/03-causal-edge-deletion-memorycausalunlink.md
- $FC_DIR/06--analysis/04-causal-chain-tracing-memorydriftwhy.md
$AUDIT_SUFFIX"
    sleep 3

    # A09: 06--analysis (05-07) + 07--evaluation
    launch_copilot "A09" "$SCRATCH_DIR/code-audit-A09.md" \
      "You are a code audit agent. Audit the source code referenced by feature catalog files for bugs.

WORKING DIRECTORY: $PROJECT_ROOT
MCP SERVER: $MCP_DIR/

FEATURE FILES:
- $FC_DIR/06--analysis/05-epistemic-baseline-capture-taskpreflight.md
- $FC_DIR/06--analysis/06-post-task-learning-measurement-taskpostflight.md
- $FC_DIR/06--analysis/07-learning-history-memorygetlearninghistory.md
- $FC_DIR/07--evaluation/01-ablation-studies-evalrunablation.md
- $FC_DIR/07--evaluation/02-reporting-dashboard-evalreportingdashboard.md
$AUDIT_SUFFIX"
    sleep 3

    # A10: 08--bug-fixes (01-04)
    launch_copilot "A10" "$SCRATCH_DIR/code-audit-A10.md" \
      "You are a code audit agent. Audit the source code referenced by feature catalog files for bugs.

WORKING DIRECTORY: $PROJECT_ROOT
MCP SERVER: $MCP_DIR/

FEATURE FILES:
- $FC_DIR/08--bug-fixes-and-data-integrity/01-graph-channel-id-fix.md
- $FC_DIR/08--bug-fixes-and-data-integrity/02-chunk-collapse-deduplication.md
- $FC_DIR/08--bug-fixes-and-data-integrity/03-co-activation-fan-effect-divisor.md
- $FC_DIR/08--bug-fixes-and-data-integrity/04-sha-256-content-hash-deduplication.md
$AUDIT_SUFFIX"
    sleep 3

    wait_wave "Wave 2"
  fi

  # ─── WAVE 3: A11-A15 (Bug Fixes + Evaluation/Measurement) ───

  if [[ $START_WAVE -le 3 ]]; then
    log "=== WAVE 3: A11-A15 ==="

    # A11: 08--bug-fixes (05-08)
    launch_copilot "A11" "$SCRATCH_DIR/code-audit-A11.md" \
      "You are a code audit agent. Audit the source code referenced by feature catalog files for bugs.

WORKING DIRECTORY: $PROJECT_ROOT
MCP SERVER: $MCP_DIR/

FEATURE FILES:
- $FC_DIR/08--bug-fixes-and-data-integrity/05-database-and-schema-safety.md
- $FC_DIR/08--bug-fixes-and-data-integrity/06-guards-and-edge-cases.md
- $FC_DIR/08--bug-fixes-and-data-integrity/07-canonical-id-dedup-hardening.md
- $FC_DIR/08--bug-fixes-and-data-integrity/08-mathmax-min-stack-overflow-elimination.md
$AUDIT_SUFFIX"
    sleep 3

    # A12: 08--bug-fixes (09-11)
    launch_copilot "A12" "$SCRATCH_DIR/code-audit-A12.md" \
      "You are a code audit agent. Audit the source code referenced by feature catalog files for bugs.

WORKING DIRECTORY: $PROJECT_ROOT
MCP SERVER: $MCP_DIR/

FEATURE FILES:
- $FC_DIR/08--bug-fixes-and-data-integrity/09-session-manager-transaction-gap-fixes.md
- $FC_DIR/08--bug-fixes-and-data-integrity/10-chunking-orchestrator-safe-swap.md
- $FC_DIR/08--bug-fixes-and-data-integrity/11-working-memory-timestamp-fix.md
$AUDIT_SUFFIX"
    sleep 3

    # A13: 09--eval (01-04)
    launch_copilot "A13" "$SCRATCH_DIR/code-audit-A13.md" \
      "You are a code audit agent. Audit the source code referenced by feature catalog files for bugs.

WORKING DIRECTORY: $PROJECT_ROOT
MCP SERVER: $MCP_DIR/

FEATURE FILES:
- $FC_DIR/09--evaluation-and-measurement/01-evaluation-database-and-schema.md
- $FC_DIR/09--evaluation-and-measurement/02-core-metric-computation.md
- $FC_DIR/09--evaluation-and-measurement/03-observer-effect-mitigation.md
- $FC_DIR/09--evaluation-and-measurement/04-full-context-ceiling-evaluation.md
$AUDIT_SUFFIX"
    sleep 3

    # A14: 09--eval (05-08)
    launch_copilot "A14" "$SCRATCH_DIR/code-audit-A14.md" \
      "You are a code audit agent. Audit the source code referenced by feature catalog files for bugs.

WORKING DIRECTORY: $PROJECT_ROOT
MCP SERVER: $MCP_DIR/

FEATURE FILES:
- $FC_DIR/09--evaluation-and-measurement/05-quality-proxy-formula.md
- $FC_DIR/09--evaluation-and-measurement/06-synthetic-ground-truth-corpus.md
- $FC_DIR/09--evaluation-and-measurement/07-bm25-only-baseline.md
- $FC_DIR/09--evaluation-and-measurement/08-agent-consumption-instrumentation.md
$AUDIT_SUFFIX"
    sleep 3

    # A15: 09--eval (09-14)
    launch_copilot "A15" "$SCRATCH_DIR/code-audit-A15.md" \
      "You are a code audit agent. Audit the source code referenced by feature catalog files for bugs.

WORKING DIRECTORY: $PROJECT_ROOT
MCP SERVER: $MCP_DIR/

FEATURE FILES:
- $FC_DIR/09--evaluation-and-measurement/09-scoring-observability.md
- $FC_DIR/09--evaluation-and-measurement/10-full-reporting-and-ablation-study-framework.md
- $FC_DIR/09--evaluation-and-measurement/11-shadow-scoring-and-channel-attribution.md
- $FC_DIR/09--evaluation-and-measurement/12-test-quality-improvements.md
- $FC_DIR/09--evaluation-and-measurement/13-evaluation-and-housekeeping-fixes.md
- $FC_DIR/09--evaluation-and-measurement/14-cross-ai-validation-fixes.md
$AUDIT_SUFFIX"
    sleep 3

    wait_wave "Wave 3"
  fi

  # ─── WAVE 4: A16-A20 (Graph Signals + Scoring) ───

  if [[ $START_WAVE -le 4 ]]; then
    log "=== WAVE 4: A16-A20 ==="

    # A16: 10--graph (01-06)
    launch_copilot "A16" "$SCRATCH_DIR/code-audit-A16.md" \
      "You are a code audit agent. Audit the source code referenced by feature catalog files for bugs.

WORKING DIRECTORY: $PROJECT_ROOT
MCP SERVER: $MCP_DIR/

FEATURE FILES:
- $FC_DIR/10--graph-signal-activation/01-typed-weighted-degree-channel.md
- $FC_DIR/10--graph-signal-activation/02-co-activation-boost-strength-increase.md
- $FC_DIR/10--graph-signal-activation/03-edge-density-measurement.md
- $FC_DIR/10--graph-signal-activation/04-weight-history-audit-tracking.md
- $FC_DIR/10--graph-signal-activation/05-graph-momentum-scoring.md
- $FC_DIR/10--graph-signal-activation/06-causal-depth-signal.md
$AUDIT_SUFFIX"
    sleep 3

    # A17: 10--graph (07-11)
    launch_copilot "A17" "$SCRATCH_DIR/code-audit-A17.md" \
      "You are a code audit agent. Audit the source code referenced by feature catalog files for bugs.

WORKING DIRECTORY: $PROJECT_ROOT
MCP SERVER: $MCP_DIR/

FEATURE FILES:
- $FC_DIR/10--graph-signal-activation/07-community-detection.md
- $FC_DIR/10--graph-signal-activation/08-graph-and-cognitive-memory-fixes.md
- $FC_DIR/10--graph-signal-activation/09-anchor-tags-as-graph-nodes.md
- $FC_DIR/10--graph-signal-activation/10-causal-neighbor-boost-and-injection.md
- $FC_DIR/10--graph-signal-activation/11-temporal-contiguity-layer.md
$AUDIT_SUFFIX"
    sleep 3

    # A18: 11--scoring (01-06)
    launch_copilot "A18" "$SCRATCH_DIR/code-audit-A18.md" \
      "You are a code audit agent. Audit the source code referenced by feature catalog files for bugs.

WORKING DIRECTORY: $PROJECT_ROOT
MCP SERVER: $MCP_DIR/

FEATURE FILES:
- $FC_DIR/11--scoring-and-calibration/01-score-normalization.md
- $FC_DIR/11--scoring-and-calibration/02-cold-start-novelty-boost.md
- $FC_DIR/11--scoring-and-calibration/03-interference-scoring.md
- $FC_DIR/11--scoring-and-calibration/04-classification-based-decay.md
- $FC_DIR/11--scoring-and-calibration/05-folder-level-relevance-scoring.md
- $FC_DIR/11--scoring-and-calibration/06-embedding-cache.md
$AUDIT_SUFFIX"
    sleep 3

    # A19: 11--scoring (07-11)
    launch_copilot "A19" "$SCRATCH_DIR/code-audit-A19.md" \
      "You are a code audit agent. Audit the source code referenced by feature catalog files for bugs.

WORKING DIRECTORY: $PROJECT_ROOT
MCP SERVER: $MCP_DIR/

FEATURE FILES:
- $FC_DIR/11--scoring-and-calibration/07-double-intent-weighting-investigation.md
- $FC_DIR/11--scoring-and-calibration/08-rrf-k-value-sensitivity-analysis.md
- $FC_DIR/11--scoring-and-calibration/09-negative-feedback-confidence-signal.md
- $FC_DIR/11--scoring-and-calibration/10-auto-promotion-on-validation.md
- $FC_DIR/11--scoring-and-calibration/11-scoring-and-ranking-corrections.md
$AUDIT_SUFFIX"
    sleep 3

    # A20: 11--scoring (12-17)
    launch_copilot "A20" "$SCRATCH_DIR/code-audit-A20.md" \
      "You are a code audit agent. Audit the source code referenced by feature catalog files for bugs.

WORKING DIRECTORY: $PROJECT_ROOT
MCP SERVER: $MCP_DIR/

FEATURE FILES:
- $FC_DIR/11--scoring-and-calibration/12-stage-3-effectivescore-fallback-chain.md
- $FC_DIR/11--scoring-and-calibration/13-scoring-and-fusion-corrections.md
- $FC_DIR/11--scoring-and-calibration/14-local-gguf-reranker-via-node-llama-cpp.md
- $FC_DIR/11--scoring-and-calibration/15-tool-level-ttl-cache.md
- $FC_DIR/11--scoring-and-calibration/16-access-driven-popularity-scoring.md
- $FC_DIR/11--scoring-and-calibration/17-temporal-structural-coherence-scoring.md
$AUDIT_SUFFIX"
    sleep 3

    wait_wave "Wave 4"
  fi

  # ─── WAVE 5: A21-A25 (Query Intelligence + Quality + Pipeline) ───

  if [[ $START_WAVE -le 5 ]]; then
    log "=== WAVE 5: A21-A25 ==="

    # A21: 12--query-intelligence
    launch_copilot "A21" "$SCRATCH_DIR/code-audit-A21.md" \
      "You are a code audit agent. Audit the source code referenced by feature catalog files for bugs.

WORKING DIRECTORY: $PROJECT_ROOT
MCP SERVER: $MCP_DIR/

FEATURE FILES:
- $FC_DIR/12--query-intelligence/01-query-complexity-router.md
- $FC_DIR/12--query-intelligence/02-relative-score-fusion-in-shadow-mode.md
- $FC_DIR/12--query-intelligence/03-channel-min-representation.md
- $FC_DIR/12--query-intelligence/04-confidence-based-result-truncation.md
- $FC_DIR/12--query-intelligence/05-dynamic-token-budget-allocation.md
- $FC_DIR/12--query-intelligence/06-query-expansion.md
$AUDIT_SUFFIX"
    sleep 3

    # A22: 13--quality (01-06)
    launch_copilot "A22" "$SCRATCH_DIR/code-audit-A22.md" \
      "You are a code audit agent. Audit the source code referenced by feature catalog files for bugs.

WORKING DIRECTORY: $PROJECT_ROOT
MCP SERVER: $MCP_DIR/

FEATURE FILES:
- $FC_DIR/13--memory-quality-and-indexing/01-verify-fix-verify-memory-quality-loop.md
- $FC_DIR/13--memory-quality-and-indexing/02-signal-vocabulary-expansion.md
- $FC_DIR/13--memory-quality-and-indexing/03-pre-flight-token-budget-validation.md
- $FC_DIR/13--memory-quality-and-indexing/04-spec-folder-description-discovery.md
- $FC_DIR/13--memory-quality-and-indexing/05-pre-storage-quality-gate.md
- $FC_DIR/13--memory-quality-and-indexing/06-reconsolidation-on-save.md
$AUDIT_SUFFIX"
    sleep 3

    # A23: 13--quality (07-12)
    launch_copilot "A23" "$SCRATCH_DIR/code-audit-A23.md" \
      "You are a code audit agent. Audit the source code referenced by feature catalog files for bugs.

WORKING DIRECTORY: $PROJECT_ROOT
MCP SERVER: $MCP_DIR/

FEATURE FILES:
- $FC_DIR/13--memory-quality-and-indexing/07-smarter-memory-content-generation.md
- $FC_DIR/13--memory-quality-and-indexing/08-anchor-aware-chunk-thinning.md
- $FC_DIR/13--memory-quality-and-indexing/09-encoding-intent-capture-at-index-time.md
- $FC_DIR/13--memory-quality-and-indexing/10-auto-entity-extraction.md
- $FC_DIR/13--memory-quality-and-indexing/11-content-aware-memory-filename-generation.md
- $FC_DIR/13--memory-quality-and-indexing/12-generation-time-duplicate-and-empty-content-prevention.md
$AUDIT_SUFFIX"
    sleep 3

    # A24: 13--quality (13-16)
    launch_copilot "A24" "$SCRATCH_DIR/code-audit-A24.md" \
      "You are a code audit agent. Audit the source code referenced by feature catalog files for bugs.

WORKING DIRECTORY: $PROJECT_ROOT
MCP SERVER: $MCP_DIR/

FEATURE FILES:
- $FC_DIR/13--memory-quality-and-indexing/13-entity-normalization-consolidation.md
- $FC_DIR/13--memory-quality-and-indexing/14-quality-gate-timer-persistence.md
- $FC_DIR/13--memory-quality-and-indexing/15-deferred-lexical-only-indexing.md
- $FC_DIR/13--memory-quality-and-indexing/16-dry-run-preflight-for-memory-save.md
$AUDIT_SUFFIX"
    sleep 3

    # A25: 14--pipeline (01-07)
    launch_copilot "A25" "$SCRATCH_DIR/code-audit-A25.md" \
      "You are a code audit agent. Audit the source code referenced by feature catalog files for bugs.

WORKING DIRECTORY: $PROJECT_ROOT
MCP SERVER: $MCP_DIR/

FEATURE FILES:
- $FC_DIR/14--pipeline-architecture/01-4-stage-pipeline-refactor.md
- $FC_DIR/14--pipeline-architecture/02-mpab-chunk-to-memory-aggregation.md
- $FC_DIR/14--pipeline-architecture/03-chunk-ordering-preservation.md
- $FC_DIR/14--pipeline-architecture/04-template-anchor-optimization.md
- $FC_DIR/14--pipeline-architecture/05-validation-signals-as-retrieval-metadata.md
- $FC_DIR/14--pipeline-architecture/06-learned-relevance-feedback.md
- $FC_DIR/14--pipeline-architecture/07-search-pipeline-safety.md
$AUDIT_SUFFIX"
    sleep 3

    wait_wave "Wave 5"
  fi

  # ─── WAVE 6: A26-A30 (Pipeline + Retrieval Enhancements + Tooling + UX) ───

  if [[ $START_WAVE -le 6 ]]; then
    log "=== WAVE 6: A26-A30 ==="

    # A26: 14--pipeline (08-14)
    launch_copilot "A26" "$SCRATCH_DIR/code-audit-A26.md" \
      "You are a code audit agent. Audit the source code referenced by feature catalog files for bugs.

WORKING DIRECTORY: $PROJECT_ROOT
MCP SERVER: $MCP_DIR/

FEATURE FILES:
- $FC_DIR/14--pipeline-architecture/08-performance-improvements.md
- $FC_DIR/14--pipeline-architecture/09-activation-window-persistence.md
- $FC_DIR/14--pipeline-architecture/10-legacy-v1-pipeline-removal.md
- $FC_DIR/14--pipeline-architecture/11-pipeline-and-mutation-hardening.md
- $FC_DIR/14--pipeline-architecture/12-dbpath-extraction-and-import-standardization.md
- $FC_DIR/14--pipeline-architecture/13-strict-zod-schema-validation.md
- $FC_DIR/14--pipeline-architecture/14-dynamic-server-instructions-at-mcp-initialization.md
$AUDIT_SUFFIX"
    sleep 3

    # A27: 14--pipeline (15-21)
    launch_copilot "A27" "$SCRATCH_DIR/code-audit-A27.md" \
      "You are a code audit agent. Audit the source code referenced by feature catalog files for bugs.

WORKING DIRECTORY: $PROJECT_ROOT
MCP SERVER: $MCP_DIR/

FEATURE FILES:
- $FC_DIR/14--pipeline-architecture/15-warm-server-daemon-mode.md
- $FC_DIR/14--pipeline-architecture/16-backend-storage-adapter-abstraction.md
- $FC_DIR/14--pipeline-architecture/17-cross-process-db-hot-rebinding.md
- $FC_DIR/14--pipeline-architecture/18-atomic-write-then-index-api.md
- $FC_DIR/14--pipeline-architecture/19-embedding-retry-orchestrator.md
- $FC_DIR/14--pipeline-architecture/20-7-layer-tool-architecture-metadata.md
- $FC_DIR/14--pipeline-architecture/21-atomic-pending-file-recovery.md
$AUDIT_SUFFIX"
    sleep 3

    # A28: 15--retrieval-enhancements
    launch_copilot "A28" "$SCRATCH_DIR/code-audit-A28.md" \
      "You are a code audit agent. Audit the source code referenced by feature catalog files for bugs.

WORKING DIRECTORY: $PROJECT_ROOT
MCP SERVER: $MCP_DIR/

FEATURE FILES:
- $FC_DIR/15--retrieval-enhancements/01-dual-scope-memory-auto-surface.md
- $FC_DIR/15--retrieval-enhancements/02-constitutional-memory-as-expert-knowledge-injection.md
- $FC_DIR/15--retrieval-enhancements/03-spec-folder-hierarchy-as-retrieval-structure.md
- $FC_DIR/15--retrieval-enhancements/04-lightweight-consolidation.md
- $FC_DIR/15--retrieval-enhancements/05-memory-summary-search-channel.md
- $FC_DIR/15--retrieval-enhancements/06-cross-document-entity-linking.md
- $FC_DIR/15--retrieval-enhancements/07-tier-2-fallback-channel-forcing.md
- $FC_DIR/15--retrieval-enhancements/08-provenance-rich-response-envelopes.md
- $FC_DIR/15--retrieval-enhancements/09-contextual-tree-injection.md
$AUDIT_SUFFIX"
    sleep 3

    # A29: 16--tooling + 17--governance
    launch_copilot "A29" "$SCRATCH_DIR/code-audit-A29.md" \
      "You are a code audit agent. Audit the source code referenced by feature catalog files for bugs.

WORKING DIRECTORY: $PROJECT_ROOT
MCP SERVER: $MCP_DIR/

FEATURE FILES:
- $FC_DIR/16--tooling-and-scripts/01-tree-thinning-for-spec-folder-consolidation.md
- $FC_DIR/16--tooling-and-scripts/02-architecture-boundary-enforcement.md
- $FC_DIR/16--tooling-and-scripts/03-progressive-validation-for-spec-documents.md
- $FC_DIR/16--tooling-and-scripts/04-dead-code-removal.md
- $FC_DIR/16--tooling-and-scripts/05-code-standards-alignment.md
- $FC_DIR/16--tooling-and-scripts/06-real-time-filesystem-watching-with-chokidar.md
- $FC_DIR/16--tooling-and-scripts/07-standalone-admin-cli.md
- $FC_DIR/16--tooling-and-scripts/08-watcher-delete-rename-cleanup.md
- $FC_DIR/17--governance/01-feature-flag-governance.md
- $FC_DIR/17--governance/02-feature-flag-sunset-audit.md
$AUDIT_SUFFIX"
    sleep 3

    # A30: 18--ux-hooks + 19--decisions + 20--flags
    launch_copilot "A30" "$SCRATCH_DIR/code-audit-A30.md" \
      "You are a code audit agent. Audit the source code referenced by feature catalog files for bugs.

WORKING DIRECTORY: $PROJECT_ROOT
MCP SERVER: $MCP_DIR/

FEATURE FILES:
- $FC_DIR/18--ux-hooks/01-shared-post-mutation-hook-wiring.md
- $FC_DIR/18--ux-hooks/02-memory-health-autorepair-metadata.md
- $FC_DIR/18--ux-hooks/03-checkpoint-delete-confirmname-safety.md
- $FC_DIR/18--ux-hooks/04-schema-and-type-contract-synchronization.md
- $FC_DIR/18--ux-hooks/05-dedicated-ux-hook-modules.md
- $FC_DIR/18--ux-hooks/06-mutation-hook-result-contract-expansion.md
- $FC_DIR/18--ux-hooks/07-mutation-response-ux-payload-exposure.md
- $FC_DIR/18--ux-hooks/08-context-server-success-hint-append.md
- $FC_DIR/18--ux-hooks/09-duplicate-save-no-op-feedback-hardening.md
- $FC_DIR/18--ux-hooks/10-atomic-save-parity-and-partial-indexing-hints.md
- $FC_DIR/18--ux-hooks/11-final-token-metadata-recomputation.md
- $FC_DIR/18--ux-hooks/12-hooks-readme-and-export-alignment.md
- $FC_DIR/18--ux-hooks/13-end-to-end-success-envelope-verification.md
- $FC_DIR/19--decisions-and-deferrals/01-int8-quantization-evaluation.md
- $FC_DIR/19--decisions-and-deferrals/02-implemented-graph-centrality-and-community-detection.md
- $FC_DIR/19--decisions-and-deferrals/03-implemented-auto-entity-extraction.md
- $FC_DIR/19--decisions-and-deferrals/04-implemented-memory-summary-generation.md
- $FC_DIR/19--decisions-and-deferrals/05-implemented-cross-document-entity-linking.md
- $FC_DIR/20--feature-flag-reference/01-1-search-pipeline-features-speckit.md
- $FC_DIR/20--feature-flag-reference/02-2-session-and-cache.md
- $FC_DIR/20--feature-flag-reference/03-3-mcp-configuration.md
- $FC_DIR/20--feature-flag-reference/04-4-memory-and-storage.md
- $FC_DIR/20--feature-flag-reference/05-5-embedding-and-api.md
- $FC_DIR/20--feature-flag-reference/06-6-debug-and-telemetry.md
- $FC_DIR/20--feature-flag-reference/07-7-ci-and-build-informational.md
$AUDIT_SUFFIX"
    sleep 3

    wait_wave "Wave 6"
  fi

fi

# ═══════════════════════════════════════════════════════════════
# STREAM 2: ARCHITECTURAL REVIEW AGENTS (S01-S05) via Codex / gpt-5.4
# ═══════════════════════════════════════════════════════════════
# Launches alongside Wave 4 (independent of A01-A30 outputs)

if $STREAM2; then
  log "=== STREAM 2: Architectural Review Agents (S01-S05) ==="

  # S01: Scoring & Fusion Integrity
  launch_codex "S01" "$SCRATCH_DIR/arch-review-S01.md" \
    "You are a cross-cutting architectural review agent. Perform deep analysis of scoring and fusion code for mathematical correctness bugs.

WORKING DIRECTORY: $PROJECT_ROOT
MCP SERVER: $MCP_DIR/
SHARED: $SHARED_DIR/

FOCUS FILES (read ALL of these):
- $MCP_DIR/lib/scoring/ (all .ts files)
- $SHARED_DIR/scoring/ (all .ts files)
- $SHARED_DIR/algorithms/ (all .ts files, if exists)

PRIOR FINDINGS TO RE-VERIFY (from $PRIOR_REVIEW):
- F1: rrf-fusion.ts:334 — fuseResultsCrossVariant() mixes normalized and raw convergence bonus scales
- F2: rrf-fusion.ts:188 — No finite-number validation on list.weight; NaN/Infinity propagation
- F3: adaptive-fusion.ts:210 — All-zero channel weights not guarded, scores map to 1.0

AUDIT FOR:
1. NaN/Infinity guards on all numeric computations
2. Division-by-zero in normalization and averaging
3. Score scale mismatches (mixing normalized 0-1 with raw unbounded values)
4. Off-by-one in array indexing and slice operations
5. Floating point comparison bugs (=== on floats)
6. Weight validation (negative, zero, non-finite)
7. Sort stability assumptions

For each prior finding (F1/F2/F3): state whether it is STILL PRESENT, FIXED, or PARTIALLY FIXED with evidence.

OUTPUT FORMAT:
---
FINDING: [id]
FILE: [path]:[line_range]
SEVERITY: [P0-CRITICAL/P1-IMPORTANT/P2-MINOR]
TYPE: [MATH/NaN/SCALE_MISMATCH/DIVISION_BY_ZERO/EDGE_CASE]
STATUS: [NEW/STILL_PRESENT/FIXED/PARTIALLY_FIXED]
PRIOR_REF: [F# if re-verifying, or NONE]
DESCRIPTION: [what is wrong]
EVIDENCE: [code snippet]
SUGGESTED_FIX: [how to fix]
---

LEAF NESTING CONSTRAINT: You are at depth 1. Do NOT invoke sub-agents.
Depth: 1"
  sleep 3

  # S02: Storage & Transaction Safety
  launch_codex "S02" "$SCRATCH_DIR/arch-review-S02.md" \
    "You are a cross-cutting architectural review agent. Perform deep analysis of storage and transaction code for data integrity bugs.

WORKING DIRECTORY: $PROJECT_ROOT
MCP SERVER: $MCP_DIR/

FOCUS FILES (read ALL of these):
- $MCP_DIR/lib/storage/ (all .ts files)
- $MCP_DIR/database/ (all .ts files)
- $MCP_DIR/handlers/checkpoints.ts
- $MCP_DIR/lib/cognitive/causal-edges.ts

PRIOR FINDINGS TO RE-VERIFY:
- F4: checkpoints.ts:664 — restoreCheckpoint FK CASCADE risk on working_memory
- F5: checkpoints.ts:873 — Causal-edge restore bypasses self-loop guard in insertEdge
- F20: causal-edges.ts:522 — cleanupOrphanedEdges without transaction; partial cleanup risk

AUDIT FOR:
1. Transaction boundaries — multi-step mutations without BEGIN/COMMIT
2. FK cascade risks — ON DELETE CASCADE chains that could delete too much
3. Self-loop injection via restore/import paths bypassing guards
4. INSERT OR REPLACE without schema validation
5. Concurrent access — WAL mode assumptions, lock contention
6. Missing rollback on partial failure
7. Orphan data from failed operations

For each prior finding (F4/F5/F20): state whether it is STILL PRESENT, FIXED, or PARTIALLY FIXED with evidence.

OUTPUT FORMAT:
---
FINDING: [id]
FILE: [path]:[line_range]
SEVERITY: [P0-CRITICAL/P1-IMPORTANT/P2-MINOR]
TYPE: [TRANSACTION/FK_CASCADE/SELF_LOOP/VALIDATION/CONCURRENCY]
STATUS: [NEW/STILL_PRESENT/FIXED/PARTIALLY_FIXED]
PRIOR_REF: [F# if re-verifying, or NONE]
DESCRIPTION: [what is wrong]
EVIDENCE: [code snippet]
SUGGESTED_FIX: [how to fix]
---

LEAF NESTING CONSTRAINT: You are at depth 1. Do NOT invoke sub-agents.
Depth: 1"
  sleep 3

  # S03: Handler Security & Input Validation
  launch_codex "S03" "$SCRATCH_DIR/arch-review-S03.md" \
    "You are a cross-cutting architectural review agent. Perform deep security analysis of handler code for input validation and injection bugs.

WORKING DIRECTORY: $PROJECT_ROOT
MCP SERVER: $MCP_DIR/

FOCUS FILES (read ALL of these):
- $MCP_DIR/handlers/ (all .ts files)
- $MCP_DIR/lib/validation/ (all .ts files)
- $MCP_DIR/api/ (all .ts files)

PRIOR FINDINGS TO RE-VERIFY:
- F6: folder-detector.ts:469 — resolveSessionSpecFolderPaths accepts absolute spec_folder without approved-root validation; path traversal risk
- F7: workflow.ts:788 — HTML cleaning incomplete, only strips summary/details tags
- F10: Loose type contracts at boundaries, permissive index signatures

AUDIT FOR:
1. Path traversal — user-supplied paths not validated against approved roots
2. SQL injection — raw string interpolation in SQL queries
3. Input sanitization — HTML/script injection in stored content
4. Schema validation gaps — handlers accepting unvalidated input
5. Type coercion bugs — string-to-number without parseInt/parseFloat validation
6. Missing bounds checking — array index, offset, limit parameters
7. Privilege escalation — operations that bypass access controls

For each prior finding (F6/F7/F10): state whether it is STILL PRESENT, FIXED, or PARTIALLY FIXED with evidence.

OUTPUT FORMAT:
---
FINDING: [id]
FILE: [path]:[line_range]
SEVERITY: [P0-CRITICAL/P1-IMPORTANT/P2-MINOR]
TYPE: [PATH_TRAVERSAL/SQL_INJECTION/INPUT_SANITIZATION/SCHEMA_GAP/TYPE_COERCION/BOUNDS]
STATUS: [NEW/STILL_PRESENT/FIXED/PARTIALLY_FIXED]
PRIOR_REF: [F# if re-verifying, or NONE]
DESCRIPTION: [what is wrong]
EVIDENCE: [code snippet]
SUGGESTED_FIX: [how to fix]
---

LEAF NESTING CONSTRAINT: You are at depth 1. Do NOT invoke sub-agents.
Depth: 1"
  sleep 3

  # S04: README Coverage Audit
  launch_codex "S04" "$SCRATCH_DIR/arch-review-S04.md" \
    "You are a README coverage audit agent. Cross-check every .ts source file against its directory README.md.

WORKING DIRECTORY: $PROJECT_ROOT
MCP SERVER: $MCP_DIR/
SHARED: $SHARED_DIR/

TASK: For each of the following README.md files, list all .ts files in its directory (excluding test files, .vitest.ts, .test.ts, .spec.ts), then check if each .ts file is referenced/listed in the README.

README FILES TO CHECK (38 total):
MCP_SERVER READMES:
- $MCP_DIR/README.md
- $MCP_DIR/api/README.md
- $MCP_DIR/configs/README.md
- $MCP_DIR/core/README.md
- $MCP_DIR/database/README.md
- $MCP_DIR/formatters/README.md
- $MCP_DIR/handlers/README.md
- $MCP_DIR/hooks/README.md
- $MCP_DIR/lib/README.md
- $MCP_DIR/lib/architecture/README.md
- $MCP_DIR/lib/cache/README.md
- $MCP_DIR/lib/cognitive/README.md
- $MCP_DIR/lib/config/README.md
- $MCP_DIR/lib/contracts/README.md
- $MCP_DIR/lib/errors/README.md
- $MCP_DIR/lib/eval/README.md
- $MCP_DIR/lib/extraction/README.md
- $MCP_DIR/lib/interfaces/README.md
- $MCP_DIR/lib/learning/README.md
- $MCP_DIR/lib/manage/README.md
- $MCP_DIR/lib/parsing/README.md
- $MCP_DIR/lib/providers/README.md
- $MCP_DIR/lib/response/README.md
- $MCP_DIR/lib/scoring/README.md
- $MCP_DIR/lib/search/README.md
- $MCP_DIR/lib/session/README.md
- $MCP_DIR/lib/storage/README.md
- $MCP_DIR/lib/telemetry/README.md
- $MCP_DIR/lib/utils/README.md
- $MCP_DIR/lib/validation/README.md
- $MCP_DIR/scripts/README.md
- $MCP_DIR/tests/README.md
- $MCP_DIR/tools/README.md
- $MCP_DIR/utils/README.md

SHARED READMES:
- $SHARED_DIR/README.md
- $SHARED_DIR/embeddings/README.md
- $SHARED_DIR/scoring/README.md
- $SHARED_DIR/utils/README.md

OUTPUT FORMAT:
---
DIRECTORY: [path]
README: [readme path]
TOTAL_TS_FILES: [count]
LISTED_IN_README: [count]
MISSING_FROM_README: [count]
MISSING_FILES:
- [file1.ts]
- [file2.ts]
---

At the end, provide a SUMMARY:
TOTAL_DIRECTORIES: [count]
TOTAL_TS_FILES: [count]
TOTAL_LISTED: [count]
TOTAL_MISSING: [count]
COVERAGE_PERCENTAGE: [pct]

LEAF NESTING CONSTRAINT: You are at depth 1. Do NOT invoke sub-agents.
Depth: 1"
  sleep 3

  # S05: Cross-Cutting Integration
  launch_codex "S05" "$SCRATCH_DIR/arch-review-S05.md" \
    "You are a cross-cutting architectural review agent. Perform deep analysis of server integration, startup, shutdown, and hook wiring for correctness bugs.

WORKING DIRECTORY: $PROJECT_ROOT
MCP SERVER: $MCP_DIR/

FOCUS FILES (read ALL of these):
- $MCP_DIR/context-server.ts
- $MCP_DIR/cli.ts
- $MCP_DIR/startup-checks.ts
- $MCP_DIR/hooks/ (all .ts files)
- $MCP_DIR/lib/session/ (all .ts files)

PRIOR FINDINGS TO RE-VERIFY:
- F8: memory-crud-health.ts:396 — Orphan-edge auto-repair without local causal-edge DB initialization
- F9: Error contracts differ by layer (in-band vs sentinels vs throw)
- F11: Persistence duplication — checkpoints.ts writes to causal_edges directly, bypassing causal-edges.ts

AUDIT FOR:
1. Startup sequence — initialization order dependencies, missing await
2. Shutdown/cleanup — unclosed database connections, dangling watchers
3. Hook wiring — hooks that reference undefined handlers, missing error boundaries
4. Error contract consistency — mixed throw/return/sentinel patterns
5. Session lifecycle — creation, cleanup, timeout handling
6. Process signal handling — SIGTERM, SIGINT, uncaughtException
7. Module circular dependencies

For each prior finding (F8/F9/F11): state whether it is STILL PRESENT, FIXED, or PARTIALLY FIXED with evidence.

OUTPUT FORMAT:
---
FINDING: [id]
FILE: [path]:[line_range]
SEVERITY: [P0-CRITICAL/P1-IMPORTANT/P2-MINOR]
TYPE: [STARTUP/SHUTDOWN/HOOK_WIRING/ERROR_CONTRACT/SESSION/SIGNAL/CIRCULAR_DEP]
STATUS: [NEW/STILL_PRESENT/FIXED/PARTIALLY_FIXED]
PRIOR_REF: [F# if re-verifying, or NONE]
DESCRIPTION: [what is wrong]
EVIDENCE: [code snippet]
SUGGESTED_FIX: [how to fix]
---

LEAF NESTING CONSTRAINT: You are at depth 1. Do NOT invoke sub-agents.
Depth: 1"

  wait_wave "Stream 2"
fi

# ═══════════════════════════════════════════════════════════════
# FINAL REPORT
# ═══════════════════════════════════════════════════════════════

if ! $DRY_RUN; then
  log "=== ALL AGENTS COMPLETE. Total failed: $FAILED ==="

  echo ""
  echo "=== OUTPUT FILES ==="
  for f in "$SCRATCH_DIR"/code-audit-A*.md "$SCRATCH_DIR"/arch-review-S*.md; do
    if [[ -f "$f" ]]; then
      size=$(wc -c < "$f")
      lines=$(wc -l < "$f")
      errors=$(grep -c "AGENT_ERROR" "$f" 2>/dev/null || true)
      marker=""
      [[ $errors -gt 0 ]] && marker=" [ERROR]"
      echo "  $(basename "$f"): ${lines} lines, ${size} bytes${marker}"
    fi
  done

  echo ""
  echo "=== SUMMARY ==="
  total_bugs=$(grep -c "^BUG:" "$SCRATCH_DIR"/code-audit-A*.md 2>/dev/null || echo 0)
  total_findings=$(grep -c "^FINDING:" "$SCRATCH_DIR"/arch-review-S*.md 2>/dev/null || echo 0)
  echo "  Stream 1 bugs: $total_bugs"
  echo "  Stream 2 findings: $total_findings"
  echo "  Agent errors: $FAILED"
fi
