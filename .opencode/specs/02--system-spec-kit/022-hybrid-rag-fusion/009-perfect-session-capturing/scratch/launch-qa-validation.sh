#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: SESSION CAPTURING QA VALIDATION LAUNCHER
# ───────────────────────────────────────────────────────────────
# Scratch operator helper for staged QA validation waves.
# Wave 1: QA-01..QA-05 (GPT-5.3-Codex via copilot, code standards alignment)
# Wave 2: QA-06..QA-10 (GPT-5.4 via copilot, deep re-review of fixes)
# Wave 3: QA-11..QA-13 (GPT-5.4 via codex xhigh, automated testing)
# Wave 4: QA-14..QA-18 (Gemini 3.1 Pro Preview via gemini, manual tests + docs)
# Wave 5: QA-19..QA-23 (GPT-5.3-Codex via copilot, final synthesis)
#
# Usage: bash launch-qa-validation.sh [--wave N] [--dry-run]
# Scratch operator helper only. Do not treat launcher output as canonical closure proof.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../../../../.." && pwd)"
SCRATCH_DIR="$SCRIPT_DIR"
SCRIPTS_DIR="$PROJECT_ROOT/.opencode/skill/system-spec-kit/scripts"
SPEC_DIR="$PROJECT_ROOT/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing"
SK_CODE_DIR="$PROJECT_ROOT/.opencode/skill/sk-code--opencode"

DRY_RUN=false
WAVE_FILTER=0
PIDS=()
FAILED=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --wave)
      if [[ $# -lt 2 || ! "$2" =~ ^[1-5]$ ]]; then
        echo "ERROR: --wave requires a value from 1 to 5" >&2
        exit 1
      fi
      WAVE_FILTER="$2"
      shift 2
      ;;
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    [1-5])
      WAVE_FILTER="$1"
      shift
      ;;
    *)
      echo "ERROR: Unknown argument: $1" >&2
      echo "Usage: bash launch-qa-validation.sh [--wave N] [--dry-run]" >&2
      exit 1
      ;;
  esac
done

log() { echo "[$(date +%H:%M:%S)] $*"; }

# ═══════════════════════════════════════════════════════════════
# LAUNCHER FUNCTIONS
# ═══════════════════════════════════════════════════════════════

launch_copilot() {
  local id="$1"
  local model="$2"
  local output_file="$3"
  local prompt="$4"

  if $DRY_RUN; then
    log "DRY-RUN: Would launch $id → $(basename "$output_file") (copilot model=$model)"
    return
  fi

  log "Launching $id → $(basename "$output_file") [copilot $model]"
  (
    cd "$PROJECT_ROOT"
    copilot -p "$prompt" \
      --model "$model" \
      --allow-all-tools \
      > "$output_file" 2>&1 || echo "AGENT_ERROR: $id failed with exit code $?" >> "$output_file"
  ) &
  PIDS+=($!)
}

launch_gemini() {
  local id="$1"
  local output_file="$2"
  local prompt="$3"

  if $DRY_RUN; then
    log "DRY-RUN: Would launch $id → $(basename "$output_file") (gemini)"
    return
  fi

  log "Launching $id → $(basename "$output_file") [gemini]"
  (
    cd "$PROJECT_ROOT"
    gemini -p "$prompt" \
      > "$output_file" 2>&1 || echo "AGENT_ERROR: $id failed with exit code $?" >> "$output_file"
  ) &
  PIDS+=($!)
}

launch_codex() {
  local id="$1"
  local model="$2"
  local output_file="$3"
  local prompt="$4"
  local extra_flags="${5:-}"
  local -a extra_args=()

  if $DRY_RUN; then
    log "DRY-RUN: Would launch $id → $(basename "$output_file") (codex model=$model)"
    return
  fi

  if [[ -n "$extra_flags" ]]; then
    read -r -a extra_args <<< "$extra_flags"
  fi

  log "Launching $id → $(basename "$output_file") [codex $model]"
  (
    cd "$PROJECT_ROOT"
    codex exec "$prompt" \
      --model "$model" \
      --sandbox read-only \
      "${extra_args[@]}" \
      > "$output_file" 2>&1 || echo "AGENT_ERROR: $id failed with exit code $?" >> "$output_file"
  ) &
  PIDS+=($!)
}

wait_wave() {
  local wave_name="$1"
  if $DRY_RUN; then return; fi
  log "=== Waiting for $wave_name (${#PIDS[@]} agents) ==="
  local wave_failed=0
  for pid in "${PIDS[@]}"; do
    if ! wait "$pid"; then
      wave_failed=$((wave_failed + 1))
    fi
  done
  FAILED=$((FAILED + wave_failed))
  log "=== $wave_name complete. Failed: $wave_failed/${#PIDS[@]} ==="
  PIDS=()
}

# ═══════════════════════════════════════════════════════════════
# SHARED PROMPT COMPONENTS
# ═══════════════════════════════════════════════════════════════

LEAF_CONSTRAINT='LEAF NESTING CONSTRAINT: You are at depth 1. Do NOT invoke sub-agents or spawn child tasks. Complete ALL work with direct tool calls only. Depth: 1'

FINDING_FORMAT='
OUTPUT FORMAT — repeat this block for EACH finding:

### FINDING-[NN]: [Title]
- **File:** [path:lines]
- **Severity:** CRITICAL / HIGH / MEDIUM / LOW
- **Category:** BUG / QUALITY / ALIGNMENT / SECURITY / DESIGN
- **Current Behavior:** [what happens now]
- **Expected Behavior:** [what should happen]
- **Root Cause:** [why it is wrong]
- **Suggested Fix:** [concrete code change]
- **Effort:** TRIVIAL (<5 min) / SMALL (<30 min) / MEDIUM (<2 hr)

End with:

### SUMMARY
- Total findings: [N]
- Critical: [N], High: [N], Medium: [N], Low: [N]
- Top 3 recommendations: [...]'

ALIGNMENT_RULES='P0 RULES (must pass):
- PascalCase MODULE header comment at top of file (e.g., // MODULE SessionExtractor)
- No any in public API signatures (parameters, return types, exported types)
- Numbered ALL-CAPS section headers (e.g., // 1. IMPORTS, // 2. TYPES, // 3. IMPLEMENTATION)
- No commented-out code blocks (dead code)

P1 RULES (should pass):
- Explicit return types on all exported functions
- catch (error: unknown) pattern with instanceof Error guard
- TSDoc comments (/** ... */) on all public API exports

P2 RULES (nice to have):
- import type for type-only imports
- readonly on immutable data structures
- Utility types (Readonly<>, Partial<>, Pick<>) where appropriate'

# ═══════════════════════════════════════════════════════════════
# WAVE 1: CODE STANDARDS ALIGNMENT (QA-01..QA-05)
# GPT-5.3-Codex via copilot
# ═══════════════════════════════════════════════════════════════

if [[ $WAVE_FILTER == 0 || $WAVE_FILTER == 1 ]]; then
  log "╔══════════════════════════════════════════════════════╗"
  log "║  WAVE 1: Code Standards Alignment (QA-01..QA-05)    ║"
  log "╚══════════════════════════════════════════════════════╝"

  # QA-01: session-extractor.ts + opencode-capture.ts
  launch_copilot "QA-01" "gpt-5.3-codex" "$SCRATCH_DIR/qa-01-alignment-extractors-large.md" \
    "You are checking TypeScript files against sk-code--opencode coding standards. Read EVERY LINE of these two files:
1. $SCRIPTS_DIR/extractors/session-extractor.ts (478 lines)
2. $SCRIPTS_DIR/extractors/opencode-capture.ts (539 lines)

Also read the alignment rules reference: $SK_CODE_DIR/SKILL.md (search for P0, P1, P2 rules sections).

$ALIGNMENT_RULES

For EACH file, check EVERY rule above and report violations. Be exhaustive — check every function signature, every catch block, every import, every type annotation.

$FINDING_FORMAT

$LEAF_CONSTRAINT"
  sleep 3

  # QA-02: workflow.ts (954 LOC)
  launch_copilot "QA-02" "gpt-5.3-codex" "$SCRATCH_DIR/qa-02-alignment-workflow.md" \
    "You are checking a large TypeScript file against sk-code--opencode coding standards. Read the ENTIRE file in sections:
1. $SCRIPTS_DIR/core/workflow.ts (read lines 1-300, then 300-600, then 600-end)

$ALIGNMENT_RULES

Check EVERY rule for the ENTIRE file. This file is ~954 lines so read it in sections. Pay special attention to:
- Step 1.5: Stateless alignment check (recently added)
- Step 8.7: Quality gate abort (recently added)
- All exported functions must have explicit return types
- All catch blocks must use (error: unknown) pattern

$FINDING_FORMAT

$LEAF_CONSTRAINT"
  sleep 3

  # QA-03: collect-session-data.ts (838 LOC)
  launch_copilot "QA-03" "gpt-5.3-codex" "$SCRATCH_DIR/qa-03-alignment-collect.md" \
    "You are checking a large TypeScript file against sk-code--opencode coding standards. Read the ENTIRE file:
$SCRIPTS_DIR/extractors/collect-session-data.ts (838 lines — read in 300-line sections)

$ALIGNMENT_RULES

Check EVERY rule. This file was recently modified with postflight delta type guards. Check all functions, catch blocks, types, imports.

$FINDING_FORMAT

$LEAF_CONSTRAINT"
  sleep 3

  # QA-04: config.ts + decision-extractor.ts + file-extractor.ts
  launch_copilot "QA-04" "gpt-5.3-codex" "$SCRATCH_DIR/qa-04-alignment-medium.md" \
    "You are checking TypeScript files against sk-code--opencode coding standards. Read EVERY LINE of these three files:
1. $SCRIPTS_DIR/core/config.ts (273 lines)
2. $SCRIPTS_DIR/extractors/decision-extractor.ts (400 lines)
3. $SCRIPTS_DIR/extractors/file-extractor.ts (338 lines)

$ALIGNMENT_RULES

For EACH file, check EVERY rule and report all violations.

$FINDING_FORMAT

$LEAF_CONSTRAINT"
  sleep 3

  # QA-05: file-writer.ts + contamination-filter.ts
  launch_copilot "QA-05" "gpt-5.3-codex" "$SCRATCH_DIR/qa-05-alignment-small.md" \
    "You are checking TypeScript files against sk-code--opencode coding standards. Read EVERY LINE of these two files:
1. $SCRIPTS_DIR/core/file-writer.ts (97 lines)
2. $SCRIPTS_DIR/extractors/contamination-filter.ts (61 lines)

$ALIGNMENT_RULES

For EACH file, check EVERY rule. These are small files — be exhaustive. Also run the alignment verifier if available:
$SK_CODE_DIR/scripts/verify_alignment_drift.py

$FINDING_FORMAT

$LEAF_CONSTRAINT"

  wait_wave "Wave 1"
fi

# ═══════════════════════════════════════════════════════════════
# WAVE 2: DEEP RE-REVIEW OF ALL FIXES (QA-06..QA-10)
# GPT-5.4 via copilot
# ═══════════════════════════════════════════════════════════════

if [[ $WAVE_FILTER == 0 || $WAVE_FILTER == 2 ]]; then
  log "╔══════════════════════════════════════════════════════╗"
  log "║  WAVE 2: Deep Re-Review of Fixes (QA-06..QA-10)     ║"
  log "╚══════════════════════════════════════════════════════╝"

  # QA-06: P0 security fixes
  launch_copilot "QA-06" "gpt-5.4" "$SCRATCH_DIR/qa-06-p0-fixes.md" \
    "You are verifying that 3 P0 (security/data-loss) fixes were implemented CORRECTLY and COMPLETELY. Read these files and verify each fix:

FIX 1 — Crypto Session ID:
- File: $SCRIPTS_DIR/extractors/session-extractor.ts
- Expected: Uses crypto.randomBytes() (NOT Math.random()) for session ID generation
- Check: Is the import present? Is the call correct? Is the output format valid?

FIX 2 — Random Temp File Suffix:
- File: $SCRIPTS_DIR/core/file-writer.ts
- Expected: Temp files use random hex suffix to prevent race conditions
- Check: Is crypto used? Is the suffix unique enough? Is cleanup correct?

FIX 3 — Batch Rollback:
- File: $SCRIPTS_DIR/core/file-writer.ts
- Expected: When a batch write fails, already-written files are rolled back (deleted)
- Check: Is the rollback loop correct? Does it handle rollback failures? Edge cases?

For EACH fix, verdict: CORRECT / INCOMPLETE / INCORRECT with detailed evidence.

$FINDING_FORMAT

$LEAF_CONSTRAINT"
  sleep 3

  # QA-07: P1 fixes part 1
  launch_copilot "QA-07" "gpt-5.4" "$SCRATCH_DIR/qa-07-p1-fixes-part1.md" \
    "You are verifying 4 P1 (quality/correctness) fixes. Read the files and verify each:

FIX 4 — Contamination Filter Expansion:
- File: $SCRIPTS_DIR/extractors/contamination-filter.ts
- Expected: Denylist expanded from 7 to 30+ patterns
- Check: Count exact patterns. Are they comprehensive? False positive risks?

FIX 5 — Evidence-Based Decision Confidence:
- File: $SCRIPTS_DIR/extractors/decision-extractor.ts
- Expected: Confidence computed from evidence (multiple options→70, rationale→65, default→50)
- Check: Is the logic correct? Are thresholds reasonable? Edge cases?

FIX 6 — Code-Block-Safe HTML Stripping:
- File: $SCRIPTS_DIR/core/workflow.ts
- Expected: Splits on code fences before stripping HTML, preserving code blocks
- Check: Does it handle nested fences? What about inline code? Edge cases?

FIX 7 — memoryId !== null:
- File: $SCRIPTS_DIR/core/workflow.ts
- Expected: Uses !== null (not !memoryId or !== undefined) to handle memoryId=0
- Check: Is the check correct everywhere memoryId is used?

For EACH fix, verdict: CORRECT / INCOMPLETE / INCORRECT.

$FINDING_FORMAT

$LEAF_CONSTRAINT"
  sleep 3

  # QA-08: P1 fixes part 2
  launch_copilot "QA-08" "gpt-5.4" "$SCRATCH_DIR/qa-08-p1-fixes-part2.md" \
    "You are verifying 4 P1 fixes. Read the files and verify each:

FIX 8 — File Description Dedup:
- File: $SCRIPTS_DIR/extractors/file-extractor.ts
- Expected: When deduplicating files, prefers longer (more descriptive) descriptions
- Check: Is the comparison correct? What about equal-length descriptions?

FIX 9 — 5-Value File Action Mapping:
- File: $SCRIPTS_DIR/extractors/file-extractor.ts
- Expected: Maps to Created/Modified/Deleted/Read/Renamed (not just Created/Modified)
- Check: Are all 5 values mapped correctly? Source data for each?

FIX 10 — Postflight Delta Type Guards:
- File: $SCRIPTS_DIR/extractors/collect-session-data.ts
- Expected: Delta computation only when both preflight and postflight data exist
- Check: Type guards correct? What if one side is partial?

FIX 11 — No-Tool Session Phase:
- File: $SCRIPTS_DIR/extractors/session-extractor.ts
- Expected: When total tools = 0, returns RESEARCH (not NaN/undefined from division)
- Check: Is the guard at the right place? What value was returned before?

Also verify the two EXTERNAL workflow.ts additions:
- Step 1.5: Stateless alignment check (overlap ratio < 0.05 warning)
- Step 8.7: Quality abort gate (score < 15 throws)

For EACH fix, verdict: CORRECT / INCOMPLETE / INCORRECT.

$FINDING_FORMAT

$LEAF_CONSTRAINT"
  sleep 3

  # QA-09: P2 configurability
  launch_copilot "QA-09" "gpt-5.4" "$SCRATCH_DIR/qa-09-p2-fixes.md" \
    "You are verifying that 7 P2 (configurability) fixes are correctly wired. Read:
- $SCRIPTS_DIR/core/config.ts (the CONFIG object definition)
- Then verify each config value is USED in the correct consumer file:

FIX 12: toolOutputMaxLength — used in opencode-capture.ts for truncation
FIX 13: timestampMatchToleranceMs — used in opencode-capture.ts for timestamp matching
FIX 14: maxFilesInMemory — used in file-extractor.ts for file count limit
FIX 15: maxObservations — used in opencode-capture.ts for observation count limit
FIX 16: minPromptLength — used in opencode-capture.ts for prompt filtering
FIX 17: maxContentPreview — used somewhere for content preview length
FIX 18: toolPreviewLines — used in opencode-capture.ts for tool output preview

For EACH config value:
1. Verify it exists in config.ts with a sensible default
2. Verify it is imported and used in the consumer file
3. Verify the consumer uses CONFIG.xxx (not a hardcoded value)
4. Check if there are OTHER places where the same hardcoded value still exists

Verdict per fix: CORRECT / INCOMPLETE (still hardcoded somewhere) / INCORRECT.

$FINDING_FORMAT

$LEAF_CONSTRAINT"
  sleep 3

  # QA-10: P3 hygiene + regression scan
  launch_copilot "QA-10" "gpt-5.4" "$SCRATCH_DIR/qa-10-p3-and-regressions.md" \
    "You are verifying P3 hygiene fixes and scanning for cross-fix regressions. Read ALL 9 modified files:
1. $SCRIPTS_DIR/extractors/session-extractor.ts
2. $SCRIPTS_DIR/extractors/contamination-filter.ts
3. $SCRIPTS_DIR/core/config.ts
4. $SCRIPTS_DIR/extractors/opencode-capture.ts
5. $SCRIPTS_DIR/extractors/decision-extractor.ts
6. $SCRIPTS_DIR/core/workflow.ts
7. $SCRIPTS_DIR/core/file-writer.ts
8. $SCRIPTS_DIR/extractors/file-extractor.ts
9. $SCRIPTS_DIR/extractors/collect-session-data.ts

FIXES 19-20 (P3 Hygiene):
- Redundant error handling boilerplate removed (catch (_error: unknown) { if (_error instanceof Error) { void _error.message; } })
- Verify no functional error handling was accidentally removed

REGRESSION SCAN:
Search all 9 files for:
- @ts-ignore or @ts-nocheck directives
- as any type assertions
- Broken or missing exports
- Import cycles between the 9 files
- Any Math.random() usage (should be crypto)
- Commented-out code blocks
- Functions that lost their return type
- Unhandled promise rejections

$FINDING_FORMAT

$LEAF_CONSTRAINT"

  wait_wave "Wave 2"
fi

# ═══════════════════════════════════════════════════════════════
# WAVE 3: AUTOMATED TESTING & BUILD (QA-11..QA-13)
# GPT-5.4 via codex xhigh
# ═══════════════════════════════════════════════════════════════

if [[ $WAVE_FILTER == 0 || $WAVE_FILTER == 3 ]]; then
  log "╔══════════════════════════════════════════════════════╗"
  log "║  WAVE 3: Automated Testing & Build (QA-11..QA-13)   ║"
  log "╚══════════════════════════════════════════════════════╝"

  # QA-11: Build + test suites
  launch_codex "QA-11" "gpt-5.4" "$SCRATCH_DIR/qa-11-build-and-tests.md" \
    "You are running automated build and test verification for the session-capturing pipeline.

Execute these commands IN ORDER and report results:

1. cd $PROJECT_ROOT && npx tsc --build
   - Report: zero errors? Any warnings? Build time?

2. Find and run ALL test files related to the session capturing pipeline:
   - Look for test files matching: test-extractors*, test-bug-fixes*, test-integration*, test-memory-quality*, *.test.ts, *.spec.ts
   - Search in: $SCRIPTS_DIR/__tests__/, $SCRIPTS_DIR/tests/, $PROJECT_ROOT/tests/
   - Run with: npx vitest run [file] --reporter=verbose OR node --experimental-vm-modules [file]

3. For each test suite, report:
   - Total tests / passed / failed / skipped
   - Any failing test names and error messages
   - Any test that exercises the 20 specific fixes from spec 012

End with overall BUILD+TEST verdict: PASS / FAIL with details.

$LEAF_CONSTRAINT" \
    '-c model_reasoning_effort="xhigh"'
  sleep 5

  # QA-12: Runtime quality scores
  launch_codex "QA-12" "gpt-5.4" "$SCRATCH_DIR/qa-12-runtime-quality.md" \
    "You are running the generate-context.js pipeline on real spec folders to verify runtime quality.

Execute these steps:

1. Build the project: cd $PROJECT_ROOT && npx tsc --build

2. Find 3 spec folders with existing memory/ subdirectories (that have real session data):
   ls -d $PROJECT_ROOT/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/*/

3. Run generate-context.js on 3 different spec folders:
   node $SCRIPTS_DIR/dist/memory/generate-context.js [spec-folder-path]

4. For EACH run, capture:
   - Exit code
   - Quality score reported (if any)
   - Any warnings or errors
   - Size of generated memory file
   - Whether the file contains placeholder artifacts ({{...}})
   - Whether contamination patterns leaked through

5. Check if quality scores meet the >= 85% target for well-formed sessions.

End with RUNTIME QUALITY verdict: PASS / CONDITIONAL / FAIL.

$LEAF_CONSTRAINT" \
    '-c model_reasoning_effort="xhigh"'
  sleep 5

  # QA-13: Alignment drift verification
  launch_codex "QA-13" "gpt-5.4" "$SCRATCH_DIR/qa-13-alignment-drift.md" \
    "You are running the automated alignment drift verifier on the session-capturing pipeline files.

Execute:

1. Check if the verifier exists and is executable:
   ls -la $SK_CODE_DIR/scripts/verify_alignment_drift.py

2. Run on core/ directory:
   python3 $SK_CODE_DIR/scripts/verify_alignment_drift.py $SCRIPTS_DIR/core/

3. Run on extractors/ directory:
   python3 $SK_CODE_DIR/scripts/verify_alignment_drift.py $SCRIPTS_DIR/extractors/

4. For each run, capture:
   - Exit code (0=pass, 1=warnings, 2=errors)
   - Total violations by severity
   - Specific violations in the 9 modified files

5. Cross-reference violations with Wave 1 manual findings.

End with ALIGNMENT DRIFT verdict: PASS / FAIL with violation count.

$LEAF_CONSTRAINT" \
    '-c model_reasoning_effort="xhigh"'

  wait_wave "Wave 3"
fi

# ═══════════════════════════════════════════════════════════════
# WAVE 4: MANUAL TESTING + DOCS + CONSISTENCY (QA-14..QA-18)
# Gemini 3.1 Pro Preview via gemini
# ═══════════════════════════════════════════════════════════════

if [[ $WAVE_FILTER == 0 || $WAVE_FILTER == 4 ]]; then
  log "╔══════════════════════════════════════════════════════╗"
  log "║  WAVE 4: Manual Tests + Docs (QA-14..QA-18)         ║"
  log "╚══════════════════════════════════════════════════════╝"

  # QA-14: 10 happy-path manual test scenarios
  launch_gemini "QA-14" "$SCRATCH_DIR/qa-14-manual-tests-happy.md" \
    "You are drafting 10 manual test scenarios (NEW-120 through NEW-129) for the session capturing pipeline HAPPY PATHS. Read these files first to understand the system:
1. $SPEC_DIR/implementation-summary.md (the 20 fixes)
2. $SCRIPTS_DIR/core/workflow.ts (pipeline orchestration — read first 300 lines for overview)
3. $SCRIPTS_DIR/core/config.ts (configurable values)

Also read the existing playbook format:
4. $PROJECT_ROOT/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/manual_testing_playbook/manual_testing_playbook.md (first 50 lines for table format)

Draft 10 scenarios in the EXACT table format used by the existing playbook:
| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |

Scenarios to cover (one per row):
NEW-120: Basic session capture (run generate-context.js on a well-formed spec folder)
NEW-121: Crypto session ID verification (check generated memory file has crypto ID format)
NEW-122: Contamination filter effectiveness (verify no AI chatter in output)
NEW-123: File action mapping (verify Created/Modified/Deleted/Read/Renamed in output)
NEW-124: Decision confidence scoring (verify evidence-based confidence values)
NEW-125: Configurable limits (override CONFIG values via .speckit.jsonc)
NEW-126: Postflight delta computation (verify learning deltas when both sides exist)
NEW-127: No-tool session handling (capture a RESEARCH-only session)
NEW-128: File description dedup (verify longer descriptions preferred)
NEW-129: Quality score threshold (verify score >= 85% on well-formed session)

$LEAF_CONSTRAINT"
  sleep 4

  # QA-15: 10 edge-case manual test scenarios
  launch_gemini "QA-15" "$SCRATCH_DIR/qa-15-manual-tests-edge.md" \
    "You are drafting 10 manual test scenarios (NEW-130 through NEW-139) for the session capturing pipeline EDGE CASES. Read these files first:
1. $SPEC_DIR/implementation-summary.md
2. $SCRIPTS_DIR/core/workflow.ts (lines 1-300 for pipeline overview)
3. $SCRIPTS_DIR/core/file-writer.ts (batch write + rollback)

Draft 10 scenarios in the EXACT table format:
| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |

Edge case scenarios:
NEW-130: Empty session capture (spec folder with no AI conversation data)
NEW-131: Long session capture (spec folder with 1000+ message exchanges)
NEW-132: Tool-only session (session with only tool calls, no human text)
NEW-133: Concurrent write safety (two generate-context.js runs on same folder)
NEW-134: Batch write rollback (simulate write failure on second file)
NEW-135: memoryId=0 handling (verify zero is treated as valid, not falsy)
NEW-136: Code-block HTML stripping (HTML inside code fences preserved)
NEW-137: Config override via .speckit.jsonc (custom toolOutputMaxLength)
NEW-138: No-decision session (session with no architectural decisions)
NEW-139: Contamination false positive check (verify technical terms not filtered)

$LEAF_CONSTRAINT"
  sleep 4

  # QA-16: Feature catalog entries
  launch_gemini "QA-16" "$SCRATCH_DIR/qa-16-feature-catalog-entry.md" \
    "You are drafting 8 feature catalog entries for the session capturing pipeline. Read:
1. $SPEC_DIR/implementation-summary.md (the 20 fixes and system overview)
2. $PROJECT_ROOT/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/feature_catalog.md (first 130 lines for format/structure)
3. $SCRIPTS_DIR/core/config.ts (configurable values)

Draft 8 feature catalog entries in the SAME format as the existing catalog. Each entry should have:
- Feature name as ### heading
- Description paragraph
- Implementation details
- Configuration options (if applicable)
- Related test scenarios

Features to catalog:
1. Session capture from OpenCode JSONL — transforms AI conversation state into indexed memory files
2. Contamination filtering (30+ patterns) — removes AI chatter, filler, orchestration artifacts
3. Cryptographic session ID generation — secure session identification via crypto.randomBytes()
4. Evidence-based decision confidence — computed from evidence strength (50/65/70 base scores)
5. Configurable pipeline constants (7 values) — toolOutputMaxLength, timestampMatchToleranceMs, etc.
6. Atomic batch file writing with rollback — random temp suffix + cleanup on failure
7. Code-block-safe HTML stripping — splits on code fences before stripping block elements
8. 5-value file action semantics — Created/Modified/Deleted/Read/Renamed mapping

Group them under a new section: ## Session Capturing Pipeline

$LEAF_CONSTRAINT"
  sleep 4

  # QA-17: README verification
  launch_gemini "QA-17" "$SCRATCH_DIR/qa-17-readme-verification.md" \
    "You are verifying that README files in the session capturing pipeline accurately reference the 20+ fixes. Read:

1. $SPEC_DIR/implementation-summary.md (the fixes)
2. Look for README.md files in:
   - $SCRIPTS_DIR/extractors/README.md
   - $SCRIPTS_DIR/core/README.md
   - $SCRIPTS_DIR/README.md
   - $SCRIPTS_DIR/../README.md

For each README found:
1. Does it mention the session capturing pipeline?
2. Does it reference the specific files that were modified?
3. Does it document the CONFIG system from config.ts?
4. Does it mention the contamination filter?
5. Does it reference the quality scoring system?
6. Are file counts, function names, and descriptions accurate?

List specific GAPS where information about the 20 fixes is missing or outdated.

$FINDING_FORMAT

$LEAF_CONSTRAINT"
  sleep 4

  # QA-18: Cross-file consistency
  launch_gemini "QA-18" "$SCRATCH_DIR/qa-18-cross-file-consistency.md" \
    "You are checking cross-file consistency across the 9 modified files in the session capturing pipeline.

Read ALL 9 files:
1. $SCRIPTS_DIR/extractors/session-extractor.ts
2. $SCRIPTS_DIR/extractors/contamination-filter.ts
3. $SCRIPTS_DIR/core/config.ts
4. $SCRIPTS_DIR/extractors/opencode-capture.ts
5. $SCRIPTS_DIR/extractors/decision-extractor.ts
6. $SCRIPTS_DIR/core/workflow.ts (read in 300-line sections)
7. $SCRIPTS_DIR/core/file-writer.ts
8. $SCRIPTS_DIR/extractors/file-extractor.ts
9. $SCRIPTS_DIR/extractors/collect-session-data.ts

Also read the barrel files:
- $SCRIPTS_DIR/extractors/index.ts
- $SCRIPTS_DIR/core/index.ts

Check:
1. IMPORTS: Every import resolves to an actual export. No circular dependencies.
2. EXPORTS: Every exported function/type from modified files is re-exported via barrel index.ts.
3. TYPE CONTRACTS: Types used across file boundaries are consistent (same field names, same types).
4. CONFIG USAGE: All files that should use CONFIG actually import and use it.
5. ERROR PATTERNS: Error handling is consistent across all 9 files.
6. NAMING: Function/variable naming conventions are consistent.

$FINDING_FORMAT

$LEAF_CONSTRAINT"

  wait_wave "Wave 4"
fi

# ═══════════════════════════════════════════════════════════════
# WAVE 5: FINAL SYNTHESIS (QA-19..QA-23)
# GPT-5.3-Codex via copilot
# ═══════════════════════════════════════════════════════════════

if [[ $WAVE_FILTER == 0 || $WAVE_FILTER == 5 ]]; then
  log "╔══════════════════════════════════════════════════════╗"
  log "║  WAVE 5: Final Synthesis (QA-19..QA-23)              ║"
  log "╚══════════════════════════════════════════════════════╝"

  # QA-19: Checklist assessment
  launch_copilot "QA-19" "gpt-5.3-codex" "$SCRATCH_DIR/qa-19-checklist-assessment.md" \
    "You are assessing the remaining NOT TESTED and REMAINING items in the checklist. Read:
1. $SPEC_DIR/checklist.md (the current checklist state)
2. The relevant source files for each unresolved item

Current unresolved items from checklist.md:
P1:
- [ ] Quality scores on well-formed sessions >= 85% — NOT TESTED
- [ ] No truncation artifacts in generated memory files — NOT TESTED
- [ ] Task extraction regex has <= 5% false positive rate — NOT TESTED
P2:
- [ ] Learning index weights configurable via config.ts — REMAINING
- [ ] Phase detection improved beyond simple regex — REMAINING
- [ ] All MEDIUM findings from audit resolved — REMAINING
- [ ] Generated memory files pass manual quality inspection — NOT TESTED

For each NOT TESTED item:
- Read the relevant source code
- Analyze whether the requirement is met based on code analysis alone
- Provide evidence-based verdict: LIKELY PASS / LIKELY FAIL / NEEDS RUNTIME TEST
- Cite specific code locations

For each REMAINING item:
- Assess current state and effort to resolve

$LEAF_CONSTRAINT"
  sleep 3

  # QA-20: Error path verification
  launch_copilot "QA-20" "gpt-5.3-codex" "$SCRATCH_DIR/qa-20-error-paths.md" \
    "You are mapping EVERY try/catch block in all 9 modified files. Read each file completely:

1. $SCRIPTS_DIR/extractors/session-extractor.ts
2. $SCRIPTS_DIR/extractors/contamination-filter.ts
3. $SCRIPTS_DIR/core/config.ts
4. $SCRIPTS_DIR/extractors/opencode-capture.ts
5. $SCRIPTS_DIR/extractors/decision-extractor.ts
6. $SCRIPTS_DIR/core/workflow.ts (read in sections)
7. $SCRIPTS_DIR/core/file-writer.ts
8. $SCRIPTS_DIR/extractors/file-extractor.ts
9. $SCRIPTS_DIR/extractors/collect-session-data.ts

For EACH try/catch block, document:
- File:line location
- What operation is wrapped
- What exception types are caught
- Whether it re-throws, swallows, or transforms the error
- Whether the error is logged with useful context
- Whether the catch uses (error: unknown) with instanceof guard (P1 rule)
- Verdict: CORRECT / NEEDS FIX

End with summary: Total catch blocks, how many follow P1 pattern, how many don't.

$LEAF_CONSTRAINT"
  sleep 3

  # QA-21: Security re-audit
  launch_copilot "QA-21" "gpt-5.3-codex" "$SCRATCH_DIR/qa-21-security-reaudit.md" \
    "You are performing a security re-audit of the 9 modified files. Search ALL files for these patterns:

1. Math.random() — should NOT exist (use crypto.randomBytes instead)
2. Path traversal risks — any string concatenation building file paths without sanitization
3. Config injection — can CONFIG values from .speckit.jsonc inject malicious paths/code?
4. Contamination bypass — can crafted session data slip through the 30+ denylist patterns?
5. Template injection — can session content inject Mustache {{directives}}?
6. as any type assertions — bypasses type safety
7. eval() or new Function() — code injection risk
8. Unvalidated user input used in file operations
9. Sensitive data that could leak into memory files (API keys, tokens)
10. Race conditions in file writing

Read all 9 files:
$SCRIPTS_DIR/extractors/session-extractor.ts
$SCRIPTS_DIR/extractors/contamination-filter.ts
$SCRIPTS_DIR/core/config.ts
$SCRIPTS_DIR/extractors/opencode-capture.ts
$SCRIPTS_DIR/extractors/decision-extractor.ts
$SCRIPTS_DIR/core/workflow.ts
$SCRIPTS_DIR/core/file-writer.ts
$SCRIPTS_DIR/extractors/file-extractor.ts
$SCRIPTS_DIR/extractors/collect-session-data.ts

$FINDING_FORMAT

$LEAF_CONSTRAINT"
  sleep 3

  # QA-22: Spec 012 doc completeness
  launch_copilot "QA-22" "gpt-5.3-codex" "$SCRATCH_DIR/qa-22-spec-completeness.md" \
    "You are verifying that all spec 012 documentation is complete and consistent. Read ALL docs:

1. $SPEC_DIR/spec.md
2. $SPEC_DIR/plan.md
3. $SPEC_DIR/tasks.md
4. $SPEC_DIR/checklist.md
5. $SPEC_DIR/decision-record.md
6. $SPEC_DIR/implementation-summary.md

Cross-check:
1. Do tasks.md items match the fixes listed in implementation-summary.md?
2. Does checklist.md cover all items from spec.md requirements?
3. Does decision-record.md document key technical decisions (crypto ID, config architecture, etc.)?
4. Does implementation-summary.md accurately reflect what was actually implemented?
5. Are there any spec.md requirements NOT covered by tasks or checklist?
6. Is the fix count consistent across all documents?

Report discrepancies and missing coverage.

$FINDING_FORMAT

$LEAF_CONSTRAINT"
  sleep 3

  # QA-23: FINAL SYNTHESIS
  launch_copilot "QA-23" "gpt-5.3-codex" "$SCRATCH_DIR/qa-23-final-synthesis.md" \
    "You are the FINAL SYNTHESIS agent. Read ALL 22 previous QA output files and produce an executive verdict.

Read these files (they may not all exist — skip missing ones):
$SCRATCH_DIR/qa-01-alignment-extractors-large.md
$SCRATCH_DIR/qa-02-alignment-workflow.md
$SCRATCH_DIR/qa-03-alignment-collect.md
$SCRATCH_DIR/qa-04-alignment-medium.md
$SCRATCH_DIR/qa-05-alignment-small.md
$SCRATCH_DIR/qa-06-p0-fixes.md
$SCRATCH_DIR/qa-07-p1-fixes-part1.md
$SCRATCH_DIR/qa-08-p1-fixes-part2.md
$SCRATCH_DIR/qa-09-p2-fixes.md
$SCRATCH_DIR/qa-10-p3-and-regressions.md
$SCRATCH_DIR/qa-11-build-and-tests.md
$SCRATCH_DIR/qa-12-runtime-quality.md
$SCRATCH_DIR/qa-13-alignment-drift.md
$SCRATCH_DIR/qa-14-manual-tests-happy.md
$SCRATCH_DIR/qa-15-manual-tests-edge.md
$SCRATCH_DIR/qa-16-feature-catalog-entry.md
$SCRATCH_DIR/qa-17-readme-verification.md
$SCRATCH_DIR/qa-18-cross-file-consistency.md
$SCRATCH_DIR/qa-19-checklist-assessment.md
$SCRATCH_DIR/qa-20-error-paths.md
$SCRATCH_DIR/qa-21-security-reaudit.md
$SCRATCH_DIR/qa-22-spec-completeness.md

Produce a synthesis with these sections:

## EXECUTIVE VERDICT: [PASS / CONDITIONAL PASS / FAIL]

## Verification Matrix
| Category | Agent(s) | Verdict | Critical Issues |
|----------|----------|---------|-----------------|

## P0/P1 Fix Verification Summary
| Fix # | Description | Verdict | Agent |
|-------|-------------|---------|-------|

## Outstanding Issues
- List ALL CRITICAL and HIGH findings from all agents
- Group by: Must Fix Before Release / Should Fix / Can Defer

## Alignment Score
- P0 violations: [count]
- P1 violations: [count]
- P2 violations: [count]

## Test Coverage
- Build status
- Test suites passed
- Runtime quality scores

## Checklist Resolution
- Items resolved by code analysis
- Items still needing runtime verification

## Recommendations
1. [Top priority actions]

$LEAF_CONSTRAINT"

  wait_wave "Wave 5"
fi

# ═══════════════════════════════════════════════════════════════
# FINAL REPORT
# ═══════════════════════════════════════════════════════════════

if ! $DRY_RUN; then
  log "╔══════════════════════════════════════════════════════╗"
  log "║  ALL WAVES COMPLETE                                  ║"
  log "╚══════════════════════════════════════════════════════╝"
  log "Total failed agents: $FAILED"

  echo ""
  echo "=== QA OUTPUT FILES ==="
  for f in "$SCRATCH_DIR"/qa-*.md; do
    if [[ -f "$f" ]]; then
      size=$(wc -c < "$f")
      lines=$(wc -l < "$f")
      printf "  %-45s %5d lines, %7d bytes\n" "$(basename "$f")" "$lines" "$size"
    fi
  done
  echo ""
  log "Next: Read qa-23-final-synthesis.md for executive verdict"
fi
