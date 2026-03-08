#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# Feature Catalog Audit — 30-Agent Batch Launcher
# ───────────────────────────────────────────────────────────────
# Stream 1: C01-C20 (GPT-5.4 via codex, verification)
# Stream 2: X01-X10 (GPT-5.3-Codex via codex, gap investigation)
#
# Usage: bash launch-audit-agents.sh [--stream1-only] [--stream2-only] [--dry-run]
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../../../../.." && pwd)"
SCRATCH_DIR="$SCRIPT_DIR"
FC_DIR="$PROJECT_ROOT/.opencode/skill/system-spec-kit/feature_catalog"
MCP_DIR="$PROJECT_ROOT/.opencode/skill/system-spec-kit/mcp_server"
SCAN_FILE="$SCRIPT_DIR/../undocumented-features-scan.md"

DRY_RUN=false
STREAM1=true
STREAM2=true
PIDS=()
FAILED=0

for arg in "$@"; do
  case $arg in
    --stream1-only) STREAM2=false ;;
    --stream2-only) STREAM1=false ;;
    --dry-run) DRY_RUN=true ;;
  esac
done

log() { echo "[$(date +%H:%M:%S)] $*"; }

launch_codex() {
  local id="$1"
  local model="$2"
  local output_file="$3"
  local prompt="$4"
  local extra_flags="${5:-}"

  if $DRY_RUN; then
    log "DRY-RUN: Would launch $id → $output_file (model=$model)"
    return
  fi

  log "Launching $id → $(basename "$output_file")"
  (
    cd "$PROJECT_ROOT"
    codex exec "$prompt" \
      --model "$model" \
      --sandbox read-only \
      $extra_flags \
      > "$output_file" 2>&1 || echo "AGENT_ERROR: $id failed with exit code $?" >> "$output_file"
  ) &
  PIDS+=($!)
}

# ═══════════════════════════════════════════════════════════════
# STREAM 1: VERIFICATION AGENTS (C01-C20)
# ═══════════════════════════════════════════════════════════════

VERIFY_SUFFIX='

OUTPUT FORMAT (repeat for each feature file):
---
FEATURE: [filename without path]
DESCRIPTION_ACCURATE: [YES/NO/PARTIAL - does Current Reality match source code?]
CODE_PATHS_VALID: [YES/NO - do all listed file paths exist?]
INVALID_PATHS: [list any paths that do not exist, or NONE]
MISSING_CODE_PATHS: [list source files that implement this but are not listed, or NONE]
SEVERITY: [HIGH/MEDIUM/LOW - how important are any issues found]
RECOMMENDED_ACTION: [NONE/UPDATE_DESCRIPTION/UPDATE_PATHS/BOTH/REWRITE]
NOTES: [brief explanation of any issues]
---

LEAF NESTING CONSTRAINT: You are at depth 1. Do NOT invoke sub-agents. Complete with direct tool calls only.
Depth: 1'

if $STREAM1; then
  log "=== STREAM 1: Verification Agents (C01-C20) ==="

  # C01: 01-retrieval
  launch_codex "C01" "gpt-5.4" "$SCRATCH_DIR/verification-C01.md" \
    "You are a feature catalog verification agent. Read each feature snippet file in $FC_DIR/01--retrieval/ (9 files). For each, read its '## Source Files' section to find listed source file paths under $MCP_DIR/. Verify: (1) the 'Current Reality' description matches the actual code, (2) all listed file paths exist, (3) no important source files are missing. $VERIFY_SUFFIX"
  sleep 3

  # C02: 02-mutation
  launch_codex "C02" "gpt-5.4" "$SCRATCH_DIR/verification-C02.md" \
    "You are a feature catalog verification agent. Read each feature snippet file in $FC_DIR/02--mutation/ (10 files). For each, read its '## Source Files' section to find listed source file paths under $MCP_DIR/. Verify: (1) the 'Current Reality' description matches the actual code, (2) all listed file paths exist, (3) no important source files are missing. $VERIFY_SUFFIX"
  sleep 3

  # C03: 03-discovery + 04-maintenance + 05-lifecycle
  launch_codex "C03" "gpt-5.4" "$SCRATCH_DIR/verification-C03.md" \
    "You are a feature catalog verification agent. Read each feature snippet file in these directories: $FC_DIR/03--discovery/ (3 files), $FC_DIR/04--maintenance/ (2 files), $FC_DIR/05--lifecycle/ (7 files). For each, read its '## Source Files' section to find listed source file paths under $MCP_DIR/. Verify: (1) the 'Current Reality' description matches the actual code, (2) all listed file paths exist, (3) no important source files are missing. $VERIFY_SUFFIX"
  sleep 3

  # C04: 06-analysis + 07-evaluation
  launch_codex "C04" "gpt-5.4" "$SCRATCH_DIR/verification-C04.md" \
    "You are a feature catalog verification agent. Read each feature snippet file in: $FC_DIR/06--analysis/ (7 files), $FC_DIR/07--evaluation/ (2 files). For each, read its '## Source Files' section to find listed source file paths under $MCP_DIR/. Verify: (1) the 'Current Reality' description matches the actual code, (2) all listed file paths exist, (3) no important source files are missing. $VERIFY_SUFFIX"
  sleep 3

  # C05: 08-bug-fixes (1-6)
  launch_codex "C05" "gpt-5.4" "$SCRATCH_DIR/verification-C05.md" \
    "You are a feature catalog verification agent. Read these specific feature snippet files: $FC_DIR/08--bug-fixes-and-data-integrity/01-graph-channel-id-fix.md, $FC_DIR/08--bug-fixes-and-data-integrity/02-chunk-collapse-deduplication.md, $FC_DIR/08--bug-fixes-and-data-integrity/03-co-activation-fan-effect-divisor.md, $FC_DIR/08--bug-fixes-and-data-integrity/04-sha-256-content-hash-deduplication.md, $FC_DIR/08--bug-fixes-and-data-integrity/05-database-and-schema-safety.md, $FC_DIR/08--bug-fixes-and-data-integrity/06-guards-and-edge-cases.md. For each, read its '## Source Files' section to find listed source file paths under $MCP_DIR/. Verify: (1) the 'Current Reality' description matches the actual code, (2) all listed file paths exist, (3) no important source files are missing. $VERIFY_SUFFIX"
  sleep 3

  # C06: 08-bug-fixes (7-11)
  launch_codex "C06" "gpt-5.4" "$SCRATCH_DIR/verification-C06.md" \
    "You are a feature catalog verification agent. Read these specific feature snippet files: $FC_DIR/08--bug-fixes-and-data-integrity/07-canonical-id-dedup-hardening.md, $FC_DIR/08--bug-fixes-and-data-integrity/08-mathmax-min-stack-overflow-elimination.md, $FC_DIR/08--bug-fixes-and-data-integrity/09-session-manager-transaction-gap-fixes.md, $FC_DIR/08--bug-fixes-and-data-integrity/10-chunking-orchestrator-safe-swap.md, $FC_DIR/08--bug-fixes-and-data-integrity/11-working-memory-timestamp-fix.md. For each, read its '## Source Files' section to find listed source file paths under $MCP_DIR/. Verify: (1) the 'Current Reality' description matches the actual code, (2) all listed file paths exist, (3) no important source files are missing. $VERIFY_SUFFIX"
  sleep 3

  # C07: 09-eval-measurement (1-8)
  launch_codex "C07" "gpt-5.4" "$SCRATCH_DIR/verification-C07.md" \
    "You are a feature catalog verification agent. Read these specific feature snippet files: $FC_DIR/09--evaluation-and-measurement/01-evaluation-database-and-schema.md through $FC_DIR/09--evaluation-and-measurement/08-agent-consumption-instrumentation.md (files 01 through 08). For each, read its '## Source Files' section to find listed source file paths under $MCP_DIR/. Verify: (1) the 'Current Reality' description matches the actual code, (2) all listed file paths exist, (3) no important source files are missing. $VERIFY_SUFFIX"
  sleep 3

  # C08: 09-eval-measurement (9-14)
  launch_codex "C08" "gpt-5.4" "$SCRATCH_DIR/verification-C08.md" \
    "You are a feature catalog verification agent. Read these specific feature snippet files: $FC_DIR/09--evaluation-and-measurement/09-scoring-observability.md through $FC_DIR/09--evaluation-and-measurement/14-cross-ai-validation-fixes.md (files 09 through 14). For each, read its '## Source Files' section to find listed source file paths under $MCP_DIR/. Verify: (1) the 'Current Reality' description matches the actual code, (2) all listed file paths exist, (3) no important source files are missing. $VERIFY_SUFFIX"
  sleep 3

  # C09: 10-graph-signal (1-5)
  launch_codex "C09" "gpt-5.4" "$SCRATCH_DIR/verification-C09.md" \
    "You are a feature catalog verification agent. Read these specific feature snippet files: $FC_DIR/10--graph-signal-activation/01-typed-weighted-degree-channel.md through $FC_DIR/10--graph-signal-activation/05-graph-momentum-scoring.md (files 01 through 05). For each, read its '## Source Files' section to find listed source file paths under $MCP_DIR/. Verify: (1) the 'Current Reality' description matches the actual code, (2) all listed file paths exist, (3) no important source files are missing. $VERIFY_SUFFIX"
  sleep 3

  # C10: 10-graph-signal (6-11) + 11-scoring (1-4)
  launch_codex "C10" "gpt-5.4" "$SCRATCH_DIR/verification-C10.md" \
    "You are a feature catalog verification agent. Read these feature snippet files: $FC_DIR/10--graph-signal-activation/06-causal-depth-signal.md through $FC_DIR/10--graph-signal-activation/11-temporal-contiguity-layer.md (6 files), then $FC_DIR/11--scoring-and-calibration/01-score-normalization.md through $FC_DIR/11--scoring-and-calibration/04-classification-based-decay.md (4 files). For each, read its '## Source Files' section to find listed source file paths under $MCP_DIR/. Verify: (1) the 'Current Reality' description matches the actual code, (2) all listed file paths exist, (3) no important source files are missing. $VERIFY_SUFFIX"
  sleep 3

  # C11: 11-scoring (5-10)
  launch_codex "C11" "gpt-5.4" "$SCRATCH_DIR/verification-C11.md" \
    "You are a feature catalog verification agent. Read these feature snippet files: $FC_DIR/11--scoring-and-calibration/05-folder-level-relevance-scoring.md through $FC_DIR/11--scoring-and-calibration/10-auto-promotion-on-validation.md (files 05 through 10). For each, read its '## Source Files' section to find listed source file paths under $MCP_DIR/. Verify: (1) the 'Current Reality' description matches the actual code, (2) all listed file paths exist, (3) no important source files are missing. $VERIFY_SUFFIX"
  sleep 3

  # C12: 11-scoring (11-17)
  launch_codex "C12" "gpt-5.4" "$SCRATCH_DIR/verification-C12.md" \
    "You are a feature catalog verification agent. Read these feature snippet files: $FC_DIR/11--scoring-and-calibration/11-scoring-and-ranking-corrections.md through $FC_DIR/11--scoring-and-calibration/17-temporal-structural-coherence-scoring.md (files 11 through 17). For each, read its '## Source Files' section to find listed source file paths under $MCP_DIR/. Verify: (1) the 'Current Reality' description matches the actual code, (2) all listed file paths exist, (3) no important source files are missing. $VERIFY_SUFFIX"
  sleep 3

  # C13: 12-query-intelligence
  launch_codex "C13" "gpt-5.4" "$SCRATCH_DIR/verification-C13.md" \
    "You are a feature catalog verification agent. Read each feature snippet file in $FC_DIR/12--query-intelligence/ (6 files). For each, read its '## Source Files' section to find listed source file paths under $MCP_DIR/. Verify: (1) the 'Current Reality' description matches the actual code, (2) all listed file paths exist, (3) no important source files are missing. $VERIFY_SUFFIX"
  sleep 3

  # C14: 13-memory-quality (1-9)
  launch_codex "C14" "gpt-5.4" "$SCRATCH_DIR/verification-C14.md" \
    "You are a feature catalog verification agent. Read these feature snippet files: $FC_DIR/13--memory-quality-and-indexing/01-verify-fix-verify-memory-quality-loop.md through $FC_DIR/13--memory-quality-and-indexing/09-encoding-intent-capture-at-index-time.md (files 01 through 09). For each, read its '## Source Files' section to find listed source file paths under $MCP_DIR/. Verify: (1) the 'Current Reality' description matches the actual code, (2) all listed file paths exist, (3) no important source files are missing. $VERIFY_SUFFIX"
  sleep 3

  # C15: 13-memory-quality (10-16)
  launch_codex "C15" "gpt-5.4" "$SCRATCH_DIR/verification-C15.md" \
    "You are a feature catalog verification agent. Read these feature snippet files: $FC_DIR/13--memory-quality-and-indexing/10-auto-entity-extraction.md through $FC_DIR/13--memory-quality-and-indexing/16-dry-run-preflight-for-memory-save.md (files 10 through 16). For each, read its '## Source Files' section to find listed source file paths under $MCP_DIR/. Verify: (1) the 'Current Reality' description matches the actual code, (2) all listed file paths exist, (3) no important source files are missing. $VERIFY_SUFFIX"
  sleep 3

  # C16: 14-pipeline (1-12)
  launch_codex "C16" "gpt-5.4" "$SCRATCH_DIR/verification-C16.md" \
    "You are a feature catalog verification agent. Read these feature snippet files: $FC_DIR/14--pipeline-architecture/01-4-stage-pipeline-refactor.md through $FC_DIR/14--pipeline-architecture/12-dbpath-extraction-and-import-standardization.md (files 01 through 12). For each, read its '## Source Files' section to find listed source file paths under $MCP_DIR/. Verify: (1) the 'Current Reality' description matches the actual code, (2) all listed file paths exist, (3) no important source files are missing. $VERIFY_SUFFIX"
  sleep 3

  # C17: 14-pipeline (13-21)
  launch_codex "C17" "gpt-5.4" "$SCRATCH_DIR/verification-C17.md" \
    "You are a feature catalog verification agent. Read these feature snippet files: $FC_DIR/14--pipeline-architecture/13-strict-zod-schema-validation.md through $FC_DIR/14--pipeline-architecture/21-atomic-pending-file-recovery.md (files 13 through 21). For each, read its '## Source Files' section to find listed source file paths under $MCP_DIR/. Verify: (1) the 'Current Reality' description matches the actual code, (2) all listed file paths exist, (3) no important source files are missing. $VERIFY_SUFFIX"
  sleep 3

  # C18: 15-retrieval-enhancements
  launch_codex "C18" "gpt-5.4" "$SCRATCH_DIR/verification-C18.md" \
    "You are a feature catalog verification agent. Read each feature snippet file in $FC_DIR/15--retrieval-enhancements/ (9 files). For each, read its '## Source Files' section to find listed source file paths under $MCP_DIR/. Verify: (1) the 'Current Reality' description matches the actual code, (2) all listed file paths exist, (3) no important source files are missing. $VERIFY_SUFFIX"
  sleep 3

  # C19: 16-tooling + 17-governance
  launch_codex "C19" "gpt-5.4" "$SCRATCH_DIR/verification-C19.md" \
    "You are a feature catalog verification agent. Read each feature snippet file in: $FC_DIR/16--tooling-and-scripts/ (8 files), $FC_DIR/17--governance/ (2 files). For each, read its '## Source Files' section to find listed source file paths under $MCP_DIR/. Verify: (1) the 'Current Reality' description matches the actual code, (2) all listed file paths exist, (3) no important source files are missing. $VERIFY_SUFFIX"
  sleep 3

  # C20: 18-ux-hooks + 19-decisions + 20-flags
  launch_codex "C20" "gpt-5.4" "$SCRATCH_DIR/verification-C20.md" \
    "You are a feature catalog verification agent. Read each feature snippet file in: $FC_DIR/18--ux-hooks/ (13 files), $FC_DIR/19--decisions-and-deferrals/ (5 files), $FC_DIR/20--feature-flag-reference/ (7 files). For each, read its '## Source Files' section to find listed source file paths under $MCP_DIR/. Verify: (1) the 'Current Reality' description matches the actual code, (2) all listed file paths exist, (3) no important source files are missing. $VERIFY_SUFFIX"
fi

# ═══════════════════════════════════════════════════════════════
# STREAM 2: GAP INVESTIGATION AGENTS (X01-X10)
# ═══════════════════════════════════════════════════════════════

INVESTIGATE_SUFFIX='

OUTPUT FORMAT (repeat for each gap):
---
GAP_NUMBER: [from undocumented-features-scan.md]
FEATURE_NAME: [descriptive name]
STATUS: [CONFIRMED_GAP/NEW_GAP/FALSE_POSITIVE]
SOURCE_FILES: [file:line-range for implementation]
DRAFT_DESCRIPTION: [2-5 sentence Current Reality text]
SUGGESTED_CATEGORY: [which of the 20 existing categories]
SIGNIFICANCE: [HIGH/MEDIUM/LOW]
NOTES: [additional context]
---

Also report any NEW capabilities you find in these files that are not in the gap list.

LEAF NESTING CONSTRAINT: You are at depth 1. Do NOT invoke sub-agents. Complete with direct tool calls only.
Depth: 1'

if $STREAM2; then
  log "=== STREAM 2: Gap Investigation Agents (X01-X10) ==="
  sleep 5

  # X01: Server & Operations (gaps 1-4)
  launch_codex "X01" "gpt-5.3-codex" "$SCRATCH_DIR/investigation-X01.md" \
    "You are investigating undocumented features in an MCP server. Read these source files: $MCP_DIR/cli.ts, $MCP_DIR/context-server.ts, $MCP_DIR/startup-checks.ts, $MCP_DIR/core/db-state.ts. Verify these gaps from the scan: Gap 1 (Standalone Admin CLI in cli.ts), Gap 2 (Cross-Process DB Hot Rebinding in core/db-state.ts), Gap 3 (Startup Pending-File Recovery in context-server.ts), Gap 4 (Watcher Delete/Rename Cleanup in context-server.ts). For each gap, confirm it exists in the source code, document the exact implementation, and classify it. $INVESTIGATE_SUFFIX" \
    '-c model_reasoning_effort="xhigh"'
  sleep 5

  # X02: Save Path & Mutation (gaps 5-9)
  launch_codex "X02" "gpt-5.3-codex" "$SCRATCH_DIR/investigation-X02.md" \
    "You are investigating undocumented features in an MCP server. Read these source files: $MCP_DIR/handlers/memory-save.ts, $MCP_DIR/handlers/pe-gating.ts. Also check for files matching save/* and pe-orchestration* under $MCP_DIR/lib/. Verify these gaps: Gap 5 (Prediction-Error Save Arbitration), Gap 6 (PE Conflict Audit Journal), Gap 7 (Per-Spec-Folder Save Mutex), Gap 8 (Dry-Run Preflight for memory_save), Gap 9 (Atomic Write-Then-Index API). $INVESTIGATE_SUFFIX" \
    '-c model_reasoning_effort="xhigh"'
  sleep 5

  # X03: Discovery & Indexing (gaps 10-13)
  launch_codex "X03" "gpt-5.3-codex" "$SCRATCH_DIR/investigation-X03.md" \
    "You are investigating undocumented features in an MCP server. Read these source files under $MCP_DIR/: handlers/memory-index*.ts (all files matching this pattern), also check for causal-links-processor.ts and vector-index-mutations.ts under lib/ or handlers/. Verify these gaps: Gap 10 (Spec Document Discovery + Level Inference), Gap 11 (Auto Spec-Document Causal Chains), Gap 12 (Declarative Causal Link Ingestion), Gap 13 (Deferred Lexical-Only Indexing). $INVESTIGATE_SUFFIX" \
    '-c model_reasoning_effort="xhigh"'
  sleep 5

  # X04: Search & Retrieval (gaps 14-17)
  launch_codex "X04" "gpt-5.3-codex" "$SCRATCH_DIR/investigation-X04.md" \
    "You are investigating undocumented features in an MCP server. Search for and read these source files under $MCP_DIR/lib/: search/cross-encoder.ts, search/hybrid-search.ts (or hybrid-search*), search/causal-boost.ts (or causal-boost*), search/artifact-routing.ts. Verify these gaps: Gap 14 (Provider-Based Neural Reranking), Gap 15 (Quality-Aware 3-Tier Fallback), Gap 16 (Causal Neighbor Boost + Injection), Gap 17 (Artifact-Class Retrieval Routing). $INVESTIGATE_SUFFIX" \
    '-c model_reasoning_effort="xhigh"'
  sleep 5

  # X05: Cognitive Subsystems (gaps 18-23)
  launch_codex "X05" "gpt-5.3-codex" "$SCRATCH_DIR/investigation-X05.md" \
    "You are investigating undocumented features in an MCP server. Read the cognitive subsystem files under $MCP_DIR/lib/cognitive/: fsrs-scheduler.ts, archival-manager.ts, working-memory.ts, co-activation.ts, temporal-contiguity.ts. Also check $MCP_DIR/configs/ for memory-types.ts and type-inference.ts. Verify these gaps: Gap 18 (FSRS v4 Review Scheduling), Gap 19 (Automatic Archival Subsystem), Gap 20 (Session-Scoped Working Memory), Gap 21 (Hybrid Spreading Activation), Gap 22 (Temporal Contiguity Layer), Gap 23 (9-Type Memory Taxonomy + Inference). $INVESTIGATE_SUFFIX" \
    '-c model_reasoning_effort="xhigh"'
  sleep 5

  # X06: Scoring & Evaluation (gaps 24-31)
  launch_codex "X06" "gpt-5.3-codex" "$SCRATCH_DIR/investigation-X06.md" \
    "You are investigating undocumented features in an MCP server. Search for and read scoring and evaluation files under $MCP_DIR/lib/: scoring/composite-scoring.ts, eval/eval-metrics.ts, eval/bm25-baseline.ts, eval/ground-truth-feedback.ts, eval/ground-truth-generator.ts, eval/ablation-framework.ts, eval/channel-attribution.ts, and any telemetry/ files. Verify gaps 24-31: Gap 24 (Document-Type-Aware Scoring), Gap 25 (Diagnostic Retrieval Metrics Suite), Gap 26 (BM25 Contingency Gate), Gap 27 (Feedback-Driven Ground-Truth Expansion), Gap 28 (Ground-Truth Diversity Gate), Gap 29 (Ablation Significance Testing), Gap 30 (Exclusive Contribution Rate), Gap 31 (Extended Retrieval Telemetry). $INVESTIGATE_SUFFIX" \
    '-c model_reasoning_effort="xhigh"'
  sleep 5

  # X07: Infrastructure (gaps 32-37)
  launch_codex "X07" "gpt-5.3-codex" "$SCRATCH_DIR/investigation-X07.md" \
    "You are investigating undocumented features in an MCP server. Search for and read infrastructure files under $MCP_DIR/lib/: ops/job-queue.ts, providers/retry-manager.ts, cache/tool-cache.ts, learning/corrections.ts, architecture/layer-definitions.ts. Also check for any circuit breaker implementations. Verify gaps 32-37: Gap 32 (Durable Ingest Job Queue), Gap 33 (Embedding Retry Orchestrator), Gap 34 (Circuit-Broken Reranker Failover), Gap 35 (Tool-Level TTL Cache), Gap 36 (Correction Tracking with Undo), Gap 37 (7-Layer Tool Architecture Metadata). $INVESTIGATE_SUFFIX" \
    '-c model_reasoning_effort="xhigh"'
  sleep 5

  # X08: Storage & Parsing (gaps 38-42)
  launch_codex "X08" "gpt-5.3-codex" "$SCRATCH_DIR/investigation-X08.md" \
    "You are investigating undocumented features in an MCP server. Search for and read storage/parsing files under $MCP_DIR/lib/: storage/incremental-index.ts, storage/history.ts, storage/access-tracker.ts, storage/transaction-manager.ts, extraction/extraction-adapter.ts. Verify gaps 38-42: Gap 38 (Incremental Reindex Planner), Gap 39 (Per-Memory History Log), Gap 40 (Access-Driven Popularity Scoring), Gap 41 (Atomic Pending-File Recovery), Gap 42 (Tool-Result Extraction to Working Memory). $INVESTIGATE_SUFFIX" \
    '-c model_reasoning_effort="xhigh"'
  sleep 5

  # X09: Search internals low-sig (gaps 43-48)
  launch_codex "X09" "gpt-5.3-codex" "$SCRATCH_DIR/investigation-X09.md" \
    "You are investigating undocumented features in an MCP server. Search for and read search internal files under $MCP_DIR/lib/: search/intent-classifier.ts, search/evidence-gap-detector.ts, search/session-boost.ts, search/fsrs.ts (or scoring/fsrs*), search/anchor-metadata.ts, pipeline/stage2-fusion.ts. Verify gaps 43-48: Gap 43 (Hybrid intent classifier), Gap 44 (Evidence-gap Z-score detection), Gap 45 (Session attention boost), Gap 46 (Temporal-structural coherence scoring), Gap 47 (Anchor region metadata enrichment), Gap 48 (Validation-signal score adjustment). $INVESTIGATE_SUFFIX" \
    '-c model_reasoning_effort="xhigh"'
  sleep 5

  # X10: Handlers + infra low-sig (gaps 49-55)
  launch_codex "X10" "gpt-5.3-codex" "$SCRATCH_DIR/investigation-X10.md" \
    "You are investigating undocumented features in an MCP server. Search for and read handler files under $MCP_DIR/handlers/: memory-crud-health.ts, memory-crud-types.ts, memory-index-alias.ts, memory-bulk-delete.ts. Also check for save/embedding-pipeline.ts under lib/. Verify gaps 49-55: Gap 49 (Divergent alias diagnostics mode), Gap 50 (Mutation ledger audit trail), Gap 51 (Health auto-repair actions), Gap 52 (Alias divergence auto-reconcile), Gap 53 (Embedding input normalization), Gap 54 (Safety-tiered retention bulk delete), Gap 55 (Startup runtime compatibility guards). $INVESTIGATE_SUFFIX" \
    '-c model_reasoning_effort="xhigh"'
fi

# ═══════════════════════════════════════════════════════════════
# WAIT FOR ALL AGENTS
# ═══════════════════════════════════════════════════════════════

if ! $DRY_RUN; then
  log "=== Waiting for ${#PIDS[@]} agents to complete ==="
  for pid in "${PIDS[@]}"; do
    if ! wait "$pid"; then
      FAILED=$((FAILED + 1))
    fi
  done

  log "=== All agents complete. Failed: $FAILED/${#PIDS[@]} ==="

  # Report results
  echo ""
  echo "=== OUTPUT FILES ==="
  for f in "$SCRATCH_DIR"/verification-C*.md "$SCRATCH_DIR"/investigation-X*.md; do
    if [[ -f "$f" ]]; then
      size=$(wc -c < "$f")
      lines=$(wc -l < "$f")
      echo "  $(basename "$f"): ${lines} lines, ${size} bytes"
    fi
  done
fi
