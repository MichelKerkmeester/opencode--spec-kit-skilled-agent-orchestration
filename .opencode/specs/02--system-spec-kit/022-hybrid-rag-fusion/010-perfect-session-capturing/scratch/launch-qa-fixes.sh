#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# Session Capturing QA Fixes — 7-Agent Implementation Launcher
# ───────────────────────────────────────────────────────────────
# All agents: GPT-5.4 via copilot with --allow-all-tools
#
# Usage: bash launch-qa-fixes.sh [--dry-run]
# Scratch operator helper only. Do not treat launcher output as canonical closure proof.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../../../../.." && pwd)"
SCRATCH_DIR="$SCRIPT_DIR"
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

launch_copilot() {
  local id="$1"
  local output_file="$2"
  local prompt="$3"

  if $DRY_RUN; then
    log "DRY-RUN: Would launch $id → $(basename "$output_file")"
    return
  fi

  log "Launching $id → $(basename "$output_file") [copilot gpt-5.4]"
  (
    cd "$PROJECT_ROOT"
    copilot -p "$prompt" \
      --model gpt-5.4 \
      --allow-all-tools \
      > "$output_file" 2>&1 || echo "AGENT_ERROR: $id failed with exit code $?" >> "$output_file"
  ) &
  PIDS+=($!)
}

LEAF_CONSTRAINT='LEAF NESTING CONSTRAINT: You are at depth 1. Do NOT invoke sub-agents or spawn child tasks. Complete ALL work with direct tool calls only. Depth: 1
IMPORTANT: You MUST make the code changes described. This is an IMPLEMENTATION task, not a review. Edit the files directly. After editing, verify with grep that your changes are in place.'

# ═══════════════════════════════════════════════════════════════
# FIX AGENTS (7 total, all parallel)
# ═══════════════════════════════════════════════════════════════

log "╔══════════════════════════════════════════════════════╗"
log "║  QA Fix Implementation (7 copilot GPT-5.4 agents)   ║"
log "╚══════════════════════════════════════════════════════╝"

# FIX-01: Crypto session ID format (Fix 1)
launch_copilot "FIX-01" "$SCRATCH_DIR/fix-01-crypto-id.md" \
  "You MUST edit code. This is an implementation task.

FILE: $SCRIPTS_DIR/extractors/session-extractor.ts

PROBLEM (from QA-06): The crypto session ID fix uses base64url encoding which produces uppercase letters, underscores, and hyphens. This breaks the existing format contract: ^session-\d+-[a-z0-9]+$

The current code at approximately line 123-128 does something like:
  crypto.randomBytes(7).toString('base64url').substring(0, 9)

This produces IDs like 'session-1772998095969-j-gz1DM76' which fail the regex.

FIX: Change the random segment to use hex encoding instead:
  crypto.randomBytes(8).toString('hex').slice(0, 9)

This produces lowercase alphanumeric characters only, matching the format contract.

STEPS:
1. Read the file to find the exact line with the base64url encoding
2. Edit that line to use .toString('hex').slice(0, 9) instead of .toString('base64url').substring(0, 9)
3. Verify with grep that the change is in place
4. Report the exact line changed

$LEAF_CONSTRAINT"
sleep 3

# FIX-02: Batch rollback with backup (Fix 3)
launch_copilot "FIX-02" "$SCRATCH_DIR/fix-02-batch-rollback.md" \
  "You MUST edit code. This is an implementation task.

FILE: $SCRIPTS_DIR/core/file-writer.ts

PROBLEM (from QA-06): The batch rollback deletes written files on failure, but if a file was OVERWRITTEN (not newly created), the original content is lost because rollback just deletes the new file.

FIX: Before overwriting an existing file, create a backup. On rollback, restore from backup instead of deleting. Track per-file metadata.

IMPLEMENTATION:
1. Read the entire file (93 lines)
2. Find the writeFilesAtomically function (or similar batch write function)
3. Modify it to:
   a. Before writing each file, check if the target already exists
   b. If it exists, copy it to a backup path (e.g., targetPath + '.bak.' + tempSuffix)
   c. Track written files with metadata: { filename, existedBefore, backupPath? }
   d. On failure rollback:
      - For new files: delete them (current behavior)
      - For overwritten files: restore from backup (rename backup back to original)
   e. On success: delete any backup files
4. Verify the changes compile (check syntax)
5. Report what changed

$LEAF_CONSTRAINT"
sleep 3

# FIX-03: Decision confidence manual path (Fix 5)
launch_copilot "FIX-03" "$SCRATCH_DIR/fix-03-decision-confidence.md" \
  "You MUST edit code. This is an implementation task.

FILE: $SCRIPTS_DIR/extractors/decision-extractor.ts

PROBLEM (from QA-07): The evidence-based confidence scoring (50/65/70) was only applied to the observation-derived decision path. The manual/explicit decision path still hardcodes CONFIDENCE: 80.

FIX: Apply the same evidence-based confidence logic to the manual decision path.

IMPLEMENTATION:
1. Read the entire file (402 lines)
2. Find the manual decision normalization path (look for 'CONFIDENCE: 80' or similar hardcoded 80 value)
3. Replace the hardcoded 80 with the same evidence-based computation:
   - If decision has multiple options (options.length > 1): confidence = 70
   - If decision has rationale present: confidence = 65
   - Default: confidence = 50
4. Ideally extract this logic into a shared helper function used by both paths
5. Verify with grep that no hardcoded 80 confidence remains
6. Report what changed

$LEAF_CONSTRAINT"
sleep 3

# FIX-04: workflow.ts triple fix (Fix 6 + Step 1.5 + Step 8.7)
launch_copilot "FIX-04" "$SCRATCH_DIR/fix-04-workflow-triple.md" \
  "You MUST edit code. This is an implementation task.

FILE: $SCRIPTS_DIR/core/workflow.ts

THREE FIXES in this file:

FIX A — HTML strip closing tags (QA-07 Finding 03):
Location: approximately lines 821-840
PROBLEM: The HTML stripping regex only removes opening tags like <div>, not closing tags like </div>.
Current regex is something like: /<(?:div|span|p|br|hr)\b[^>]*\/?>/gi
FIX: Change to: /<\/?(?:div|span|p|br|hr)\b[^>]*\/?>/gi
(Add the optional \/ after < to match closing tags)

FIX B — Step 1.5 stateless alignment check (QA-08 Finding 12):
Location: approximately lines 443-469
PROBLEM: When overlap ratio < 0.05 in stateless mode, the code THROWS an error. It should only WARN.
FIX: Replace the throw statement with a console.warn() or log warning. Keep the warning message but remove the throw. The workflow should continue, not abort.

FIX C — Step 8.7 quality abort threshold (QA-08 Finding 13):
Location: approximately lines 881-888
PROBLEM: QUALITY_ABORT_THRESHOLD is set to 25, but should be 15.
FIX: Change 'const QUALITY_ABORT_THRESHOLD = 25' to 'const QUALITY_ABORT_THRESHOLD = 15'

STEPS:
1. Read the file in sections (lines 1-300, 300-600, 600-end)
2. Apply all three fixes
3. Verify each fix with grep
4. Report all changes

$LEAF_CONSTRAINT"
sleep 3

# FIX-05: 5-value action map upstream (Fix 9)
launch_copilot "FIX-05" "$SCRATCH_DIR/fix-05-action-map.md" \
  "You MUST edit code. This is an implementation task.

FILES:
1. $SCRIPTS_DIR/lib/semantic-summarizer.ts (upstream producer)
2. $SCRIPTS_DIR/extractors/file-extractor.ts (downstream consumer, already has 5-value map)

PROBLEM (from QA-08): file-extractor.ts can handle 5 actions (Created/Modified/Deleted/Read/Renamed), but the upstream semantic-summarizer.ts:
- Drops 'read' actions with 'if (action === \"read\") continue;'
- Has no 'renamed' detection at all
So only 3 values (created/modified/deleted) actually flow through.

FIX:
1. Read semantic-summarizer.ts and find the line that drops read actions
2. Remove or comment out the 'if (action === \"read\") continue;' line so read actions flow through
3. Add a basic 'renamed' detection pattern. Look for patterns like:
   - 'renamed X to Y', 'moved X to Y', 'mv X Y' in the file change context
   - If a file appears as both deleted and created in the same changeset, treat as renamed
4. Verify the change in file-extractor.ts normalizeFileAction() already handles 'read' and 'renamed' inputs
5. Report changes

$LEAF_CONSTRAINT"
sleep 3

# FIX-06: Postflight delta guard (Fix 10)
launch_copilot "FIX-06" "$SCRATCH_DIR/fix-06-postflight-delta.md" \
  "You MUST edit code. This is an implementation task.

FILE: $SCRIPTS_DIR/extractors/collect-session-data.ts

PROBLEM (from QA-08): The HAS_POSTFLIGHT_DELTA boolean guard is stricter than the actual computation code. The guard requires all 3 metrics on both sides, but the computation still runs when only knowledgeScore exists, using 0 for missing values.

FIX: Make the computation guard match the reporting guard. Use the HAS_POSTFLIGHT_DELTA boolean as the SINGLE gate for ALL delta computation.

IMPLEMENTATION:
1. Read the file (lines 198-290 area where delta computation happens)
2. Find the HAS_POSTFLIGHT_DELTA check and the separate delta computation block
3. Wrap ALL delta computation inside the HAS_POSTFLIGHT_DELTA guard
4. OR: compute each metric independently and use null (not 0) for missing values
5. Ensure no partial deltas are produced from incomplete data
6. Report changes

$LEAF_CONSTRAINT"
sleep 3

# FIX-07: Config wiring (Fixes 15-18)
launch_copilot "FIX-07" "$SCRATCH_DIR/fix-07-config-wiring.md" \
  "You MUST edit code. This is an implementation task.

FOUR CONFIG VALUES need to be wired to their intended consumers:

FIX 15 — maxObservations:
- Config: CONFIG.MAX_OBSERVATIONS (default 3) in $SCRIPTS_DIR/core/config.ts
- Consumer: $SCRIPTS_DIR/extractors/opencode-capture.ts
- Action: Find where observations are sliced/limited (e.g., .slice(0, 3) or .slice(0, 10)) and replace the hardcoded number with CONFIG.MAX_OBSERVATIONS. Add the import if needed.

FIX 16 — minPromptLength:
- Config: CONFIG.MIN_PROMPT_LENGTH (default 60) in config.ts
- Consumer: $SCRIPTS_DIR/extractors/opencode-capture.ts
- Action: Find where prompts are collected (getRecentPrompts or similar) and add a filter: entry.input.trim().length >= CONFIG.MIN_PROMPT_LENGTH. Add the import if needed.

FIX 17 — maxContentPreview:
- Config: CONFIG.MAX_CONTENT_PREVIEW (default 500) in config.ts
- Consumer: $SCRIPTS_DIR/lib/semantic-summarizer.ts
- Action: Find context.substring(0, 500) and replace 500 with CONFIG.MAX_CONTENT_PREVIEW. Add the import.

FIX 18 — toolPreviewLines:
- Config: CONFIG.TOOL_PREVIEW_LINES (default 10) in config.ts
- Consumer: $SCRIPTS_DIR/extractors/opencode-capture.ts
- Action: Find where tool output previews are line-limited and use CONFIG.TOOL_PREVIEW_LINES instead of hardcoded values. Add the import if needed.

STEPS:
1. Read config.ts to confirm the CONFIG property names
2. For each consumer file, read it, find the hardcoded value, and replace with CONFIG reference
3. Add import { CONFIG } from '../core/config' (or correct relative path) if not already imported
4. Verify each change with grep
5. Report all changes

$LEAF_CONSTRAINT"

# ═══════════════════════════════════════════════════════════════
# WAIT FOR ALL AGENTS
# ═══════════════════════════════════════════════════════════════

if ! $DRY_RUN; then
  log "=== Waiting for ${#PIDS[@]} fix agents to complete ==="
  for pid in "${PIDS[@]}"; do
    if ! wait "$pid"; then
      FAILED=$((FAILED + 1))
    fi
  done

  log "╔══════════════════════════════════════════════════════╗"
  log "║  ALL FIX AGENTS COMPLETE. Failed: $FAILED/${#PIDS[@]}          ║"
  log "╚══════════════════════════════════════════════════════╝"

  echo ""
  echo "=== FIX OUTPUT FILES ==="
  for f in "$SCRATCH_DIR"/fix-*.md; do
    if [[ -f "$f" ]]; then
      size=$(wc -c < "$f")
      lines=$(wc -l < "$f")
      printf "  %-45s %5d lines, %7d bytes\n" "$(basename "$f")" "$lines" "$size"
    fi
  done
fi
