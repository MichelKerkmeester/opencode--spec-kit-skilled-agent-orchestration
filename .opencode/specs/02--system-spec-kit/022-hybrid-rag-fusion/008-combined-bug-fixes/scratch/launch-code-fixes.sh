#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# Code Audit Fix Implementation — 15-Agent Batch Launcher
# ───────────────────────────────────────────────────────────────
# 15 Copilot agents (gpt-5.4) implementing T069-T085
# 3 waves of 5 agents each
#
# Usage: bash launch-code-fixes.sh [--dry-run] [--wave N]
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../../../../.." && pwd)"
SCRATCH_DIR="$SCRIPT_DIR"
MCP_DIR="$PROJECT_ROOT/.opencode/skill/system-spec-kit/mcp_server"
SHARED_DIR="$PROJECT_ROOT/.opencode/skill/system-spec-kit/shared"

DRY_RUN=false
START_WAVE=1
PIDS=()
FAILED=0

for arg in "$@"; do
  case $arg in
    --dry-run) DRY_RUN=true ;;
    [0-9]) START_WAVE="$arg" ;;
  esac
done

log() { echo "[$(date +%H:%M:%S)] $*"; }

launch_copilot() {
  local id="$1"
  local output_file="$2"
  local prompt="$3"

  if $DRY_RUN; then
    log "DRY-RUN: Would launch $id → $(basename "$output_file")"
    return
  fi

  log "Launching $id → $(basename "$output_file") [copilot/gpt-5.4]"
  (
    cd "$PROJECT_ROOT"
    copilot -p "$prompt" --model gpt-5.4 --allow-all-tools \
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

CONSTRAINT='

RULES:
- Make ONLY the specific fix described. Do NOT refactor surrounding code.
- Do NOT add comments, docstrings, or type annotations beyond what is needed for the fix.
- Do NOT modify test files unless the fix requires a test update.
- Verify the fix compiles by reading the file after editing.
- LEAF NESTING CONSTRAINT: You are at depth 1. Do NOT invoke sub-agents.
Depth: 1'

# ═══════════════════════════════════════════════════════════════
# WAVE 1: Independent simple fixes (T069, T070, T071, T072, T079)
# ═══════════════════════════════════════════════════════════════

if [[ $START_WAVE -le 1 ]]; then
  log "=== WAVE 1: I01-I05 (Simple targeted fixes) ==="

  # I01: T069 — Fix broken import path (P0)
  launch_copilot "I01" "$SCRATCH_DIR/fix-I01-T069.md" \
    "You are a code fix agent. Fix a broken import path in two files.

WORKING DIRECTORY: $PROJECT_ROOT

BUG: The import \`import { isFeatureEnabled } from '../cache/cognitive/rollout-policy'\` uses a non-existent path. The correct path is \`../cognitive/rollout-policy\` (without the \`cache/\` segment).

FILES TO FIX:
1. $MCP_DIR/lib/search/graph-flags.ts — line 6: change \`'../cache/cognitive/rollout-policy'\` to \`'../cognitive/rollout-policy'\`
2. $MCP_DIR/lib/search/causal-boost.ts — line 9: change \`'../cache/cognitive/rollout-policy'\` to \`'../cognitive/rollout-policy'\`

Read each file first, verify the broken import exists, fix it, then read the file again to confirm.
$CONSTRAINT"
  sleep 3

  # I02: T070 — Clear access-tracker flush interval on shutdown
  launch_copilot "I02" "$SCRATCH_DIR/fix-I02-T070.md" \
    "You are a code fix agent. Fix a resource leak in access-tracker.ts.

WORKING DIRECTORY: $PROJECT_ROOT

BUG: The \`access-tracker.ts\` file creates a \`setInterval\` timer for periodic flushing but never clears it on shutdown. This keeps the Node.js process alive.

FILE: $MCP_DIR/lib/storage/access-tracker.ts

FIX:
1. Read the file to understand the current implementation
2. Find the \`setInterval\` call that creates the flush timer
3. Store the interval ID in a module-level or class-level variable
4. Add a \`dispose()\` or \`shutdown()\` method that calls \`clearInterval()\` on the stored timer ID
5. Export the dispose method so the server shutdown path can call it
$CONSTRAINT"
  sleep 3

  # I03: T071 — Guard negative stability in composite-scoring.ts
  launch_copilot "I03" "$SCRATCH_DIR/fix-I03-T071.md" \
    "You are a code fix agent. Fix a NaN propagation bug in composite-scoring.ts.

WORKING DIRECTORY: $PROJECT_ROOT

BUG: In \`calculateRetrievabilityScore()\` around lines 247-303, negative \`stability\` values cause \`Math.pow(negative, -0.5)\` to return NaN, which propagates through the composite score.

FILE: $MCP_DIR/lib/scoring/composite-scoring.ts

FIX:
1. Read the file, find \`calculateRetrievabilityScore\` function
2. Before the \`Math.pow(stability, ...)\` call, add a guard: clamp \`stability\` to a minimum of 0 (or a small positive epsilon like 0.001)
3. After the final score computation, add a \`Number.isFinite()\` check — if not finite, return a sensible default (e.g., 0)
4. Keep the fix minimal — only add the guard, do not refactor
$CONSTRAINT"
  sleep 3

  # I04: T072 — Add finite validation in rrf-fusion.ts
  launch_copilot "I04" "$SCRATCH_DIR/fix-I04-T072.md" \
    "You are a code fix agent. Fix NaN propagation bugs in rrf-fusion.ts.

WORKING DIRECTORY: $PROJECT_ROOT

BUG: Around lines 179-195, the RRF fusion code lacks finite-number validation:
- \`k = NaN\` causes NaN division in the RRF formula
- \`convergenceBonus\` and \`graphWeightBoost\` lack finite/non-negative checks
- Negative \`list.weight\` inverts scores instead of disabling the channel

FILE: $SHARED_DIR/algorithms/rrf-fusion.ts (or check $MCP_DIR/lib/scoring/rrf-fusion.ts if shared doesn't exist)

FIX:
1. Read the file, find the RRF computation function
2. At the entry point of the function, add validation:
   - If \`k\` is not finite or <= 0, default to 60 (standard RRF k value)
   - If \`convergenceBonus\` is not finite, default to 0
   - If \`graphWeightBoost\` is not finite, default to 0
   - If any \`list.weight\` is not finite or < 0, clamp to 0
3. Keep changes minimal — add guards only, no refactoring
$CONSTRAINT"
  sleep 3

  # I05: T079 — Add empty ground-truth guard in eval-metrics.ts
  launch_copilot "I05" "$SCRATCH_DIR/fix-I05-T079.md" \
    "You are a code fix agent. Fix a division-by-zero bug in eval-metrics.ts.

WORKING DIRECTORY: $PROJECT_ROOT

BUG: Around lines 191-198, metric computation divides by the size of the ground truth set. When the set is empty, this produces Infinity/NaN.

FILE: $MCP_DIR/lib/eval/eval-metrics.ts

FIX:
1. Read the file, find the computation around lines 191-198
2. Add an early return guard: if the ground truth set/array is empty (length === 0), return 0 (or an appropriate neutral value) instead of proceeding to division
3. Also check the similar patterns at lines 233-239 (NDCG) and 425-432 (MRR) for the same issue and add guards there too
4. Keep changes minimal — guard clauses only
$CONSTRAINT"
  sleep 3

  wait_wave "Wave 1"
fi

# ═══════════════════════════════════════════════════════════════
# WAVE 2: Medium complexity fixes (T073, T074, T075, T076, T077)
# ═══════════════════════════════════════════════════════════════

if [[ $START_WAVE -le 2 ]]; then
  log "=== WAVE 2: I06-I10 (Medium complexity fixes) ==="

  # I06: T073 — Unify fatal error handlers in context-server.ts
  launch_copilot "I06" "$SCRATCH_DIR/fix-I06-T073.md" \
    "You are a code fix agent. Unify fatal error handlers in context-server.ts.

WORKING DIRECTORY: $PROJECT_ROOT

BUG: Around lines 571-681, fatal-process handlers diverge:
- \`gracefulShutdown()\` awaits watcher/reranker cleanup and closes transport
- \`unhandledRejection\` skips cleanup entirely
- \`uncaughtException\` exits without awaiting async cleanup

FILE: $MCP_DIR/context-server.ts

FIX:
1. Read the file, find all process signal/error handlers
2. Create a single \`fatalShutdown(reason: string, exitCode: number)\` async function that:
   - Logs the reason
   - Reuses the graceful cleanup sequence (watcher stop, reranker cleanup, transport close)
   - Uses a deadline timeout (e.g., 5 seconds) to prevent hanging
   - Calls \`process.exit(exitCode)\` after cleanup or timeout
3. Wire \`SIGINT\`, \`SIGTERM\`, \`uncaughtException\`, and \`unhandledRejection\` through this single function
4. Remove the old separate handler implementations
$CONSTRAINT"
  sleep 3

  # I07: T074 — Fix HTML sanitization in workflow.ts
  launch_copilot "I07" "$SCRATCH_DIR/fix-I07-T074.md" \
    "You are a code fix agent. Fix incomplete HTML sanitization in workflow.ts.

WORKING DIRECTORY: $PROJECT_ROOT

BUG: Around line 818, HTML cleaning uses regex that only removes a subset of tags (summary, details, div, span, p, br, hr). Active HTML tags like script, img, iframe, svg, style, and event-handler attributes are NOT sanitized.

FILE: $MCP_DIR/handlers/workflow.ts (or find the file containing the HTML stripping logic)

FIX:
1. Read the file, find the HTML stripping function/regex
2. Expand the tag removal regex to strip ALL HTML tags — use a general approach: replace \`/<[^>]*>/g\` with empty string to strip all HTML tags
3. Alternatively, if selective stripping is intended, at minimum add: script, img, iframe, svg, style, link, object, embed, form, input, button, textarea, select, meta, base
4. This is a security fix — err on the side of stripping more, not less
$CONSTRAINT"
  sleep 3

  # I08: T075 — Add root validation in folder-detector.ts
  launch_copilot "I08" "$SCRATCH_DIR/fix-I08-T075.md" \
    "You are a code fix agent. Add path traversal protection in folder-detector.ts.

WORKING DIRECTORY: $PROJECT_ROOT

BUG: Around line 459, \`resolveSessionSpecFolderPaths\` accepts absolute \`spec_folder\` values from session-learning rows without validating they are under an approved root directory. A poisoned DB row could route writes outside the specs directory.

FILE: $MCP_DIR/handlers/folder-detector.ts (or wherever this function lives — search for \`resolveSessionSpecFolderPaths\`)

FIX:
1. Read the file, find the function
2. Inside the function, after receiving the \`spec_folder\` value, add validation:
   - Resolve the path to an absolute path using \`path.resolve()\`
   - Check that it starts with the approved specs root (the project's specs directory)
   - If it doesn't, skip/reject the entry and log a warning
3. Import \`path\` if not already imported
4. Keep the fix minimal — add the guard check only
$CONSTRAINT"
  sleep 3

  # I09: T076 — Route checkpoint edge restore through causal-edges.ts
  launch_copilot "I09" "$SCRATCH_DIR/fix-I09-T076.md" \
    "You are a code fix agent. Fix persistence duplication in checkpoints.ts.

WORKING DIRECTORY: $PROJECT_ROOT

BUG: Around lines 819-848, checkpoint restore writes to \`causal_edges\` table directly with raw SQL, bypassing the \`causal-edges.ts\` module. This duplicates persistence logic and bypasses mutation side-effects like degree-cache invalidation.

FILES:
- $MCP_DIR/lib/storage/checkpoints.ts (main fix)
- $MCP_DIR/lib/storage/causal-edges.ts (reference — check available public APIs)

FIX:
1. Read \`causal-edges.ts\` first to understand its public API (insertEdge, deleteEdge, bulk operations)
2. Read \`checkpoints.ts\` around lines 819-848 to see the direct SQL
3. Replace the direct SQL INSERT/DELETE for causal_edges with calls to the public API from \`causal-edges.ts\`
4. If \`causal-edges.ts\` lacks a bulk insert API, add a \`bulkInsertEdges()\` function there
5. After checkpoint restore, call any cache invalidation hooks exposed by \`causal-edges.ts\`
$CONSTRAINT"
  sleep 3

  # I10: T077 — Add nested transaction guard in transaction-manager.ts
  launch_copilot "I10" "$SCRATCH_DIR/fix-I10-T077.md" \
    "You are a code fix agent. Add nested transaction safety in transaction-manager.ts.

WORKING DIRECTORY: $PROJECT_ROOT

BUG: Around lines 291-312, \`runInTransaction()\` does not detect if an outer transaction is already active. An inner call to \`runInTransaction()\` can fail silently when the outer transaction already holds a lock.

FILE: $MCP_DIR/lib/storage/transaction-manager.ts

FIX:
1. Read the file, find \`runInTransaction\` function
2. Add a flag or counter to track whether a transaction is already active
3. If \`runInTransaction\` is called while already inside a transaction:
   - Option A: Use SQLite SAVEPOINT for nested transaction support
   - Option B: Simply execute the callback directly without BEGIN/COMMIT (piggyback on outer transaction)
4. Choose the simpler approach (Option B is usually sufficient for SQLite)
$CONSTRAINT"
  sleep 3

  wait_wave "Wave 2"
fi

# ═══════════════════════════════════════════════════════════════
# WAVE 3: Quality hardening + README (T078, T080-T085)
# ═══════════════════════════════════════════════════════════════

if [[ $START_WAVE -le 3 ]]; then
  log "=== WAVE 3: I11-I15 (Quality hardening + README) ==="

  # I11: T078 — Wrap update+validation in transaction
  launch_copilot "I11" "$SCRATCH_DIR/fix-I11-T078.md" \
    "You are a code fix agent. Fix partial commit on validation failure in memory-crud-update.ts.

WORKING DIRECTORY: $PROJECT_ROOT

BUG: Around lines 187-200, the memory update handler can partially commit changes when validation fails on a later step. The update and validation should be wrapped in a single transaction with proper rollback.

FILE: $MCP_DIR/handlers/memory-crud-update.ts

FIX:
1. Read the file, find the update handler logic around lines 187-200
2. If the update + validation steps are not already inside a transaction, wrap them in one
3. Use the project's existing \`runInTransaction\` pattern (import from transaction-manager if needed)
4. Ensure validation failure triggers rollback (transaction abort)
$CONSTRAINT"
  sleep 3

  # I12: T080 — Fix causal depth computation in graph-signals.ts
  launch_copilot "I12" "$SCRATCH_DIR/fix-I12-T080.md" \
    "You are a code fix agent. Fix causal depth computation in graph-signals.ts.

WORKING DIRECTORY: $PROJECT_ROOT

BUG: Around lines 298-308, the causal depth algorithm uses first-visit BFS (\`if (!depthMap.has(neighbor))\`) which computes shortest depth from roots. The intended behavior is maximum distance from root nodes.

FILE: $MCP_DIR/lib/graph/graph-signals.ts

FIX:
1. Read the file, find the depth computation around lines 298-308
2. Change the BFS logic to compute maximum depth instead of shortest:
   - Remove the \`!depthMap.has(neighbor)\` guard that prevents revisiting
   - Instead, update a neighbor's depth whenever a longer path is found: \`if (!depthMap.has(neighbor) || neighborDepth > depthMap.get(neighbor)!)\`
   - Add cycle protection: track visited set per traversal path, or cap depth at a max value (e.g., 100) to prevent infinite loops in cyclic graphs
3. Keep the overall algorithm structure (BFS with queue) but allow depth updates
$CONSTRAINT"
  sleep 3

  # I13: T081 + T082 — NaN guards in mpab-aggregation.ts and normalization.ts
  launch_copilot "I13" "$SCRATCH_DIR/fix-I13-T081-T082.md" \
    "You are a code fix agent. Add NaN/Infinity guards in two files.

WORKING DIRECTORY: $PROJECT_ROOT

BUG 1 (T081): In \`mpab-aggregation.ts\` around lines 96-118, \`computeMPAB()\` lacks finite-number validation on chunk scores. A single Infinity yields infinite parent score; NaN makes sort order undefined.

BUG 2 (T082): In \`shared/normalization.ts\` around lines 25-61 and 117-154, normalization functions lack finite-input validation. Non-finite inputs break the [0,1] output contract.

FILES:
1. $MCP_DIR/lib/scoring/mpab-aggregation.ts
2. $SHARED_DIR/normalization.ts (or $SHARED_DIR/utils/normalization.ts — find the correct path)

FIX for mpab-aggregation.ts:
- In \`computeMPAB()\`, filter or guard chunk scores: skip non-finite values or treat them as 0
- After aggregation, add \`Number.isFinite()\` check on the result

FIX for normalization.ts:
- At the entry of normalization functions, check inputs with \`Number.isFinite()\`
- For non-finite inputs, return 0 (or the minimum of the output range)
- For all-NaN input arrays, return array of zeros instead of array of 1.0
$CONSTRAINT"
  sleep 3

  # I14: T083 + T084 — Type guards in co-activation.ts and fsrs-scheduler.ts
  launch_copilot "I14" "$SCRATCH_DIR/fix-I14-T083-T084.md" \
    "You are a code fix agent. Add type safety guards in two files.

WORKING DIRECTORY: $PROJECT_ROOT

BUG 1 (T083): In \`co-activation.ts\` around lines 131-153, parsed \`related_memories\` entries from JSON are not type-guarded. Malformed \`similarity\` values can propagate NaN into \`decayedScore\`.

BUG 2 (T084): In \`fsrs-scheduler.ts\` around lines 95-145, review interval calculation accepts unvalidated parameters that could produce negative intervals.

FILES:
1. $MCP_DIR/lib/cognitive/co-activation.ts
2. $MCP_DIR/lib/cognitive/fsrs-scheduler.ts

FIX for co-activation.ts:
- After \`JSON.parse()\` of related_memories, validate each entry:
  - Check \`typeof rel.similarity === 'number' && Number.isFinite(rel.similarity)\`
  - Filter out invalid entries before using them in score computation
  - Guard \`decayedScore\` with \`Number.isFinite()\` check

FIX for fsrs-scheduler.ts:
- At the entry of interval calculation functions, clamp parameters to valid ranges:
  - Ensure stability >= 0
  - Ensure difficulty is within [0, 10] or whatever the valid range is
  - Ensure computed interval >= 0 (use Math.max(0, interval))
$CONSTRAINT"
  sleep 3

  # I15: T085 — Update hooks/README.md
  launch_copilot "I15" "$SCRATCH_DIR/fix-I15-T085.md" \
    "You are a code fix agent. Update a README to list missing files.

WORKING DIRECTORY: $PROJECT_ROOT

BUG: The hooks/README.md is missing 3 source files that exist in the directory.

FILE: $MCP_DIR/hooks/README.md

FIX:
1. Read \`$MCP_DIR/hooks/README.md\` to see current content and format
2. List all .ts files in \`$MCP_DIR/hooks/\` (excluding test files)
3. Add the missing files to the README in the same format as existing entries:
   - memory-surface.ts
   - mutation-feedback.ts
   - response-hints.ts
4. Match the existing style (description format, table or list format, etc.)
$CONSTRAINT"
  sleep 3

  wait_wave "Wave 3"
fi

# ═══════════════════════════════════════════════════════════════
# FINAL REPORT
# ═══════════════════════════════════════════════════════════════

if ! $DRY_RUN; then
  log "=== ALL AGENTS COMPLETE. Total failed: $FAILED ==="

  echo ""
  echo "=== OUTPUT FILES ==="
  for f in "$SCRATCH_DIR"/fix-I*.md; do
    if [[ -f "$f" ]]; then
      lines=$(wc -l < "$f")
      errors=$(grep -c "AGENT_ERROR" "$f" 2>/dev/null || true)
      marker=""
      [[ $errors -gt 0 ]] && marker=" [ERROR]"
      echo "  $(basename "$f"): ${lines} lines${marker}"
    fi
  done
fi
