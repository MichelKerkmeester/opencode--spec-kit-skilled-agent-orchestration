#!/bin/bash
# Generate self-contained implementation prompts for all 28 batches.
# Reads tasks.md, review-report.md, checklist.md and assembles per-batch prompts.
# Usage: gen_impl_prompts.sh
set -uo pipefail

REPO="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public"
SPEC=".opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-packets-009-014-audit"
ABS_SPEC="$REPO/$SPEC"
CONFIG="$ABS_SPEC/dispatch/batch_config.json"
PROMPTS_DIR="$ABS_SPEC/dispatch/prompts"
TASKS_FILE="$ABS_SPEC/tasks.md"
REPORT_FILE="$ABS_SPEC/review/review-report.md"
CHECKLIST_FILE="$ABS_SPEC/checklist.md"

mkdir -p "$PROMPTS_DIR"

echo "Generating implementation prompts..."

# Get all batch IDs
BATCHES=$(python3 -c "
import json
cfg = json.load(open('$CONFIG'))
for b in cfg['batches']:
  print(b)
")

for BATCH_ID in $BATCHES; do
  PROMPT_FILE="$PROMPTS_DIR/batch-${BATCH_ID}.txt"

  # Extract batch config
  BATCH_JSON=$(python3 -c "
import json
cfg = json.load(open('$CONFIG'))
b = cfg['batches']['$BATCH_ID']
print(json.dumps(b, indent=2))
")

  DESCRIPTION=$(echo "$BATCH_JSON" | python3 -c "import json,sys; print(json.load(sys.stdin)['description'])")
  PHASE=$(echo "$BATCH_JSON" | python3 -c "import json,sys; print(json.load(sys.stdin)['phase'])")

  # Extract task IDs
  TASK_IDS=$(echo "$BATCH_JSON" | python3 -c "
import json,sys
b = json.load(sys.stdin)
for t in b['tasks']:
  print(t)
")

  # Extract target files
  TARGET_FILES=$(echo "$BATCH_JSON" | python3 -c "
import json,sys
b = json.load(sys.stdin)
for f in b['targetFiles']:
  print(f)
")

  # Extract test files
  TEST_FILES=$(echo "$BATCH_JSON" | python3 -c "
import json,sys
b = json.load(sys.stdin)
for f in b.get('testFiles', []):
  print(f)
")

  # Extract checklist items
  CHECKLIST_ITEMS=$(echo "$BATCH_JSON" | python3 -c "
import json,sys
b = json.load(sys.stdin)
for c in b.get('checklistItems', []):
  print(c)
")

  # Extract matching tasks from tasks.md — match "- [ ] TXXX" pattern only
  TASK_CONTENT=""
  for tid in $TASK_IDS; do
    LINE=$(grep -n "\- \[ \] $tid " "$TASKS_FILE" 2>/dev/null | head -1)
    if [ -n "$LINE" ]; then
      TASK_CONTENT="${TASK_CONTENT}${LINE}
"
    fi
  done

  # Extract finding refs
  FINDING_REFS=$(echo "$BATCH_JSON" | python3 -c "
import json,sys
b = json.load(sys.stdin)
for f in b.get('findingRefs', []):
  print(f)
")

  # Build verification commands
  VERIFY_CMDS="After making ALL changes, run these verification commands:\n"
  VERIFY_CMDS="${VERIFY_CMDS}1. cd $REPO/.opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit\n"
  if [ -n "$TEST_FILES" ]; then
    VERIFY_CMDS="${VERIFY_CMDS}2. npx vitest run"
    for tf in $TEST_FILES; do
      VERIFY_CMDS="${VERIFY_CMDS} $REPO/$tf"
    done
    VERIFY_CMDS="${VERIFY_CMDS}\n"
  fi
  VERIFY_CMDS="${VERIFY_CMDS}3. Report pass/fail for each step in your final output.\n"

  # Write the prompt
  cat > "$PROMPT_FILE" << PROMPT_EOF
You are an IMPLEMENTATION agent for batch $BATCH_ID (Phase $PHASE).

REPO: $REPO
BRANCH: remedy/$BATCH_ID
MODE: WRITE — you MUST modify code and documents to fix the findings below.
CONTEXT: This batch is part of the remediation of 243 findings from a 120-iteration deep review of the OpenCode SpecKit system. You are fixing real bugs, stale references, and quality gaps found by GPT-5.4 and Claude Opus 4.6 reviewers.

WORKSTREAM: Phase $PHASE — $DESCRIPTION

=== CRITICAL RULES ===
1. Read each target file BEFORE modifying it
2. ONLY modify files listed in TARGET FILES below
3. Do NOT create new files unless a task explicitly requires it (e.g., new test files)
4. Do NOT run git commit — the orchestrator handles commits
5. Do NOT modify any files under dispatch/ or review/
6. After ALL changes, run the verification commands below
7. Fix ALL tasks listed — do not skip any

=== TASKS ===
$TASK_CONTENT

=== FINDING REFERENCES ===
Tasks reference findings from the review report using S3.X#Y notation:
$FINDING_REFS

For full finding details, read: $ABS_SPEC/review/review-report.md
Search for the S3.X section headers (e.g., "### 3.1." for S3.1) and find the numbered findings.

=== TARGET FILES (ONLY modify these) ===
$TARGET_FILES

=== CHECKLIST ITEMS TO SATISFY ===
$CHECKLIST_ITEMS

For checklist details, read: $ABS_SPEC/checklist.md

=== VERIFICATION ===
$(echo -e "$VERIFY_CMDS")

=== OUTPUT ===
When done, create a brief summary at: $ABS_SPEC/dispatch/logs/batch-${BATCH_ID}-summary.md
Include: tasks attempted, tasks completed, files modified, verification results.
PROMPT_EOF

  PROMPT_SIZE=$(wc -c < "$PROMPT_FILE")
  echo "  $BATCH_ID: $PROMPT_SIZE bytes ($DESCRIPTION)"
done

echo ""
echo "Generated $(echo "$BATCHES" | wc -l | tr -d ' ') prompts in $PROMPTS_DIR"
