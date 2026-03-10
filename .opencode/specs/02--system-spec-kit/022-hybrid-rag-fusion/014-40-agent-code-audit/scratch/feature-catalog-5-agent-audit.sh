#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# Feature Catalog Audit — 5-Agent Batch Launcher
# ───────────────────────────────────────────────────────────────
# All agents: GPT-5.4 via codex exec, xhigh reasoning, read-only
#
# Usage: bash feature-catalog-5-agent-audit.sh [--dry-run]
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../../../../.." && pwd)"
SCRATCH_DIR="$SCRIPT_DIR"
FC_DIR="$PROJECT_ROOT/.opencode/skill/system-spec-kit/feature_catalog"
MCP_DIR="$PROJECT_ROOT/.opencode/skill/system-spec-kit/mcp_server"
SHARED_DIR="$PROJECT_ROOT/.opencode/skill/system-spec-kit/shared"
SCRIPTS_DIR="$PROJECT_ROOT/.opencode/skill/system-spec-kit/scripts"

DRY_RUN=false
PIDS=()
FAILED=0

for arg in "$@"; do
  case $arg in
    --dry-run) DRY_RUN=true ;;
  esac
done

log() { echo "[$(date +%H:%M:%S)] $*"; }

launch_codex() {
  local id="$1"
  local output_file="$2"
  local prompt="$3"

  if $DRY_RUN; then
    log "DRY-RUN: Would launch $id → $(basename "$output_file")"
    log "  Prompt length: $(echo "$prompt" | wc -c | tr -d ' ') chars"
    return
  fi

  log "Launching $id → $(basename "$output_file")"
  (
    cd "$PROJECT_ROOT"
    codex exec "$prompt" \
      --model gpt-5.4 \
      -c model_reasoning_effort="xhigh" \
      --sandbox read-only \
      > "$output_file" 2>&1 || echo "AGENT_ERROR: $id failed with exit code $?" >> "$output_file"
  ) &
  PIDS+=($!)
}

# ═══════════════════════════════════════════════════════════════
# SHARED OUTPUT FORMAT (appended to all prompts)
# ═══════════════════════════════════════════════════════════════

OUTPUT_SUFFIX='

STEP-BY-STEP METHOD:
1. List all feature .md files in your assigned directories
2. For each feature file:
   a. Read the full file content
   b. Extract all source file paths from the Implementation and Test tables
   c. Verify each path exists using: test -f .opencode/skill/system-spec-kit/[path]
   d. Read the key implementation files (at minimum the first 2-3 listed in the Implementation table)
   e. Compare the "Current Reality" text against the actual code behavior
   f. Note any significant code functionality not mentioned in the feature description
   g. Produce the structured output block below

For features with 100+ source file references, verify a representative sample (first 10 implementation + first 5 test files) and note the scope limitation.
For features marked "No dedicated source files", verify the claim is correct.

OUTPUT FORMAT (repeat for each feature file):
---
FEATURE: [filename without path]
CATEGORY: [category directory name]
DESCRIPTION_ACCURACY: [ACCURATE/PARTIAL/INACCURATE]
DESCRIPTION_ISSUES: [specific claims that are wrong or outdated, or NONE]
PATHS_VALID: [YES/NO]
INVALID_PATHS: [list of paths that do not exist, or NONE]
MISSING_PATHS: [source files that implement this feature but are not listed, or NONE]
UNDOCUMENTED_CAPABILITIES: [significant code behaviors not mentioned in description, or NONE]
SEVERITY: [P0/P1/P2]
RECOMMENDED_ACTION: [NONE/UPDATE_PATHS/UPDATE_DESCRIPTION/BOTH/REWRITE]
EVIDENCE: [brief quote or line reference from source code supporting your findings]
---

IMPORTANT RULES:
- Do NOT skip any feature file. Audit every single one in your assigned directories.
- Be specific in DESCRIPTION_ISSUES — cite what the description says vs. what the code does.
- Use shell commands to verify file existence and read source code.
- Work through files sequentially and methodically.

LEAF NESTING CONSTRAINT: You are at depth 1. Do NOT invoke sub-agents or use the Task tool to create sub-tasks. Execute your work directly using your available tools. If you cannot complete the task alone, return what you have and escalate to the orchestrator.
Depth: 1'

# ═══════════════════════════════════════════════════════════════
# AGENT A1: Retrieval + Mutation + Discovery (22 files)
# ═══════════════════════════════════════════════════════════════

PROMPT_A1="You are a feature catalog auditor. Your job is to verify that feature documentation matches the actual source code of a TypeScript MCP server. You are auditing 22 feature files across 3 categories.

TASK: For each feature file, perform three checks:
1. ERRORS: Compare the 'Current Reality' description against the actual source code. Flag any claims that are wrong, outdated, or misleading.
2. MISSING PATHS: Verify every file path in the 'Source Files' tables exists on disk.
3. MISSING FEATURES: Look at what the referenced source files actually do. Flag any significant capabilities NOT documented in the feature description.

PRIOR AUDIT CONTEXT (2026-03-08, 30-agent audit):
- Category 01-retrieval: 1 pass, 8 issues (5 desc+paths, 3 paths-only). Feature 01 passed.
- Category 02-mutation: 0 passes, 10 issues (2 rewrites, 4 desc+paths, 3 paths, 1 desc). Rewrites: 07-namespace-management, 10-per-memory-history-log.
- Category 03-discovery: 0 passes, 3 issues (all desc+paths).
- Known batch-fixable: retry.vitest.ts should be retry-manager.vitest.ts (affects 52 files).

YOUR ASSIGNED DIRECTORIES (22 files total):
- .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/ (9 files)
- .opencode/skill/system-spec-kit/feature_catalog/02--mutation/ (10 files)
- .opencode/skill/system-spec-kit/feature_catalog/03--discovery/ (3 files)

SOURCE CODE ROOT: .opencode/skill/system-spec-kit/mcp_server/
SHARED CODE ROOT: .opencode/skill/system-spec-kit/shared/
SCRIPTS ROOT: .opencode/skill/system-spec-kit/scripts/
$OUTPUT_SUFFIX"

launch_codex "A1" "$SCRATCH_DIR/fc-audit-A1.md" "$PROMPT_A1"
sleep 5

# ═══════════════════════════════════════════════════════════════
# AGENT A2: Maintenance + Lifecycle + Analysis + Evaluation + Bug Fixes (29 files)
# ═══════════════════════════════════════════════════════════════

PROMPT_A2="You are a feature catalog auditor. Your job is to verify that feature documentation matches the actual source code of a TypeScript MCP server. You are auditing 29 feature files across 5 categories.

TASK: For each feature file, perform three checks:
1. ERRORS: Compare the 'Current Reality' description against the actual source code. Flag any claims that are wrong, outdated, or misleading.
2. MISSING PATHS: Verify every file path in the 'Source Files' tables exists on disk.
3. MISSING FEATURES: Look at what the referenced source files actually do. Flag any significant capabilities NOT documented in the feature description.

PRIOR AUDIT CONTEXT (2026-03-08, 30-agent audit):
- Category 04-maintenance: 0 passes, 2 issues (1 paths, 1 desc).
- Category 05-lifecycle: 0 passes, 7 issues (2 desc+paths, 4 paths, 1 desc). Desc fix: 06-startup-pending-file-recovery.
- Category 06-analysis: 0 passes, 7 issues (2 desc+paths, 5 paths).
- Category 07-evaluation: 0 passes, 2 issues (1 desc+paths, 1 desc).
- Category 08-bug-fixes: 0 passes, 11 issues (1 rewrite: 08-mathmax-min, 1 desc+paths, 9 paths).
- Known batch-fixable: retry.vitest.ts should be retry-manager.vitest.ts (affects 52 files).

YOUR ASSIGNED DIRECTORIES (29 files total):
- .opencode/skill/system-spec-kit/feature_catalog/04--maintenance/ (2 files)
- .opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/ (7 files)
- .opencode/skill/system-spec-kit/feature_catalog/06--analysis/ (7 files)
- .opencode/skill/system-spec-kit/feature_catalog/07--evaluation/ (2 files)
- .opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/ (11 files)

SOURCE CODE ROOT: .opencode/skill/system-spec-kit/mcp_server/
SHARED CODE ROOT: .opencode/skill/system-spec-kit/shared/
SCRIPTS ROOT: .opencode/skill/system-spec-kit/scripts/
$OUTPUT_SUFFIX"

launch_codex "A2" "$SCRATCH_DIR/fc-audit-A2.md" "$PROMPT_A2"
sleep 5

# ═══════════════════════════════════════════════════════════════
# AGENT A3: Eval-Measurement + Graph-Signal + Scoring (42 files)
# ═══════════════════════════════════════════════════════════════

PROMPT_A3="You are a feature catalog auditor. Your job is to verify that feature documentation matches the actual source code of a TypeScript MCP server. You are auditing 42 feature files across 3 categories. Many of these are small files (~30 lines each).

TASK: For each feature file, perform three checks:
1. ERRORS: Compare the 'Current Reality' description against the actual source code. Flag any claims that are wrong, outdated, or misleading.
2. MISSING PATHS: Verify every file path in the 'Source Files' tables exists on disk.
3. MISSING FEATURES: Look at what the referenced source files actually do. Flag any significant capabilities NOT documented in the feature description.

PRIOR AUDIT CONTEXT (2026-03-08, 30-agent audit):
- Category 09-eval-measurement: 0 passes, 14 issues (1 rewrite: 14-cross-ai-validation-fixes, 8 desc+paths, 5 paths).
- Category 10-graph-signal: 0 passes, 11 issues (1 rewrite: 08-graph-cognitive-fixes, 4 desc+paths, 4 paths, 2 desc).
- Category 11-scoring-calibration: 0 passes, 17 issues (2 rewrites: 07-double-intent-weighting, 17-temporal-structural-coherence, 5 desc+paths, 8 paths, 2 desc).
- Known batch-fixable: retry.vitest.ts should be retry-manager.vitest.ts.

YOUR ASSIGNED DIRECTORIES (42 files total):
- .opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/ (14 files)
- .opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/ (11 files)
- .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/ (17 files)

SOURCE CODE ROOT: .opencode/skill/system-spec-kit/mcp_server/
SHARED CODE ROOT: .opencode/skill/system-spec-kit/shared/
SCRIPTS ROOT: .opencode/skill/system-spec-kit/scripts/
$OUTPUT_SUFFIX"

launch_codex "A3" "$SCRATCH_DIR/fc-audit-A3.md" "$PROMPT_A3"
sleep 5

# ═══════════════════════════════════════════════════════════════
# AGENT A4: Query Intelligence + Memory Quality + Pipeline (43 files)
# ═══════════════════════════════════════════════════════════════

PROMPT_A4="You are a feature catalog auditor. Your job is to verify that feature documentation matches the actual source code of a TypeScript MCP server. You are auditing 43 feature files across 3 categories. Category 14 (pipeline-architecture) is the heaviest with 21 files.

TASK: For each feature file, perform three checks:
1. ERRORS: Compare the 'Current Reality' description against the actual source code. Flag any claims that are wrong, outdated, or misleading.
2. MISSING PATHS: Verify every file path in the 'Source Files' tables exists on disk.
3. MISSING FEATURES: Look at what the referenced source files actually do. Flag any significant capabilities NOT documented in the feature description.

PRIOR AUDIT CONTEXT (2026-03-08, 30-agent audit):
- Category 12-query-intelligence: 0 passes, 6 issues (1 rewrite: 02-relative-score-fusion, 4 desc+paths, 1 paths).
- Category 13-memory-quality: 0 passes, 16 issues (1 rewrite: 16-dry-run-preflight, 7 desc+paths, 7 paths, 1 desc). Also has 2 slug-utils.ts references to remove (PV-002).
- Category 14-pipeline-architecture: 0 passes, 21 issues (6 rewrites: 02-mpab, 08-performance, 10-legacy-v1, 16-backend-storage, 18-atomic-write, 21-atomic-pending-recovery, 3 desc+paths, 12 paths).
- Known batch-fixable: retry.vitest.ts should be retry-manager.vitest.ts. slug-utils.ts removed (PV-002).

YOUR ASSIGNED DIRECTORIES (43 files total):
- .opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/ (6 files)
- .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/ (16 files)
- .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/ (21 files)

SOURCE CODE ROOT: .opencode/skill/system-spec-kit/mcp_server/
SHARED CODE ROOT: .opencode/skill/system-spec-kit/shared/
SCRIPTS ROOT: .opencode/skill/system-spec-kit/scripts/
$OUTPUT_SUFFIX"

launch_codex "A4" "$SCRATCH_DIR/fc-audit-A4.md" "$PROMPT_A4"
sleep 5

# ═══════════════════════════════════════════════════════════════
# AGENT A5: Retrieval-Enhancements + Tooling + Governance + UX + Decisions + Flags (44 files)
# ═══════════════════════════════════════════════════════════════

PROMPT_A5="You are a feature catalog auditor. Your job is to verify that feature documentation matches the actual source code of a TypeScript MCP server. You are auditing 44 feature files across 6 categories. Categories 17, 19, 20 are lightweight (governance, decisions, flags); category 18 (ux-hooks) is the heaviest.

TASK: For each feature file, perform three checks:
1. ERRORS: Compare the 'Current Reality' description against the actual source code. Flag any claims that are wrong, outdated, or misleading.
2. MISSING PATHS: Verify every file path in the 'Source Files' tables exists on disk.
3. MISSING FEATURES: Look at what the referenced source files actually do. Flag any significant capabilities NOT documented in the feature description.

PRIOR AUDIT CONTEXT (2026-03-08, 30-agent audit):
- Category 15-retrieval-enhancements: 1 pass (01), 8 issues (2 desc+paths, 6 paths).
- Category 16-tooling: 0 passes, 8 issues (6 desc+paths, 2 paths). Also has check-architecture-boundaries.ts reference to remove (PV-003).
- Category 17-governance: 0 passes, 2 issues (1 rewrite: 02-feature-flag-sunset-audit, 1 paths).
- Category 18-ux-hooks: 1 pass (01), 12 issues (12 paths-only).
- Category 19-decisions: 0 passes, 5 issues (4 paths, 1 desc).
- Category 20-feature-flags: 0 passes, 7 issues (2 rewrites: 01-search-pipeline, 05-embedding-api, 2 desc+paths, 3 paths).
- Known batch-fixable: retry.vitest.ts should be retry-manager.vitest.ts. check-architecture-boundaries.ts removed (PV-003).

YOUR ASSIGNED DIRECTORIES (44 files total):
- .opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/ (9 files)
- .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/ (8 files)
- .opencode/skill/system-spec-kit/feature_catalog/17--governance/ (2 files)
- .opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/ (13 files)
- .opencode/skill/system-spec-kit/feature_catalog/19--decisions-and-deferrals/ (5 files)
- .opencode/skill/system-spec-kit/feature_catalog/20--feature-flag-reference/ (7 files)

SOURCE CODE ROOT: .opencode/skill/system-spec-kit/mcp_server/
SHARED CODE ROOT: .opencode/skill/system-spec-kit/shared/
SCRIPTS ROOT: .opencode/skill/system-spec-kit/scripts/
$OUTPUT_SUFFIX"

launch_codex "A5" "$SCRATCH_DIR/fc-audit-A5.md" "$PROMPT_A5"

# ═══════════════════════════════════════════════════════════════
# WAIT FOR ALL AGENTS
# ═══════════════════════════════════════════════════════════════

if ! $DRY_RUN; then
  log "=== All 5 agents launched. Waiting for completion... ==="
  for pid in "${PIDS[@]}"; do
    if ! wait "$pid"; then
      FAILED=$((FAILED + 1))
    fi
  done

  log "=== All agents finished. Failures: $FAILED ==="

  # Report output file sizes and block counts
  echo ""
  echo "=== OUTPUT FILES ==="
  total_blocks=0
  for f in "$SCRATCH_DIR"/fc-audit-A{1,2,3,4,5}.md; do
    if [ -f "$f" ]; then
      lines=$(wc -l < "$f" | tr -d ' ')
      size=$(wc -c < "$f" | tr -d ' ')
      blocks=$(grep -c '^FEATURE:' "$f" 2>/dev/null || echo "0")
      errors=$(grep -c "AGENT_ERROR" "$f" 2>/dev/null || echo "0")
      total_blocks=$((total_blocks + blocks))
      log "  $(basename "$f"): ${lines} lines, ${size} bytes, ${blocks} feature blocks, ${errors} errors"
    else
      log "  $(basename "$f"): MISSING"
    fi
  done
  echo ""
  echo "Total feature blocks: $total_blocks / 180 expected"
  echo "  A1=22, A2=29, A3=42, A4=43, A5=44"
fi

log "Done."
