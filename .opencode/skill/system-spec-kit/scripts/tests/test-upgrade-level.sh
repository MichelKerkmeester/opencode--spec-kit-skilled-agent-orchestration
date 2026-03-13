#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Test Upgrade Level
# ───────────────────────────────────────────────────────────────
# Tests regression coverage for upgrade-level.sh
# Covers fixes applied in spec 125: shell-common guard, dry-run,
# Level detection, input validation, already-at-target, missing spec.md.
# COMPATIBILITY: bash 3.2+ (macOS default)

set -euo pipefail

# ───────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ───────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
UPGRADE_SCRIPT="$SCRIPT_DIR/../spec/upgrade-level.sh"
SHELL_COMMON="$SCRIPT_DIR/../lib/shell-common.sh"

# Test counters
PASS=0; FAIL=0; SKIP=0; TOTAL=0

pass() { PASS=$((PASS+1)); TOTAL=$((TOTAL+1)); echo "  PASS: $1"; }
fail() { FAIL=$((FAIL+1)); TOTAL=$((TOTAL+1)); echo "  FAIL: $1"; }
skip() { SKIP=$((SKIP+1)); TOTAL=$((TOTAL+1)); echo "  SKIP: $1"; }
begin_category() { echo ""; echo "── $1 ──"; }

# Cleanup tracking
CLEANUP_DIRS=()

cleanup_all() {
    local i=0
    while [[ $i -lt ${#CLEANUP_DIRS[@]} ]]; do
        [[ -d "${CLEANUP_DIRS[$i]}" ]] && rm -rf "${CLEANUP_DIRS[$i]}"
        i=$((i + 1))
    done
}
trap cleanup_all EXIT

make_temp_dir() {
    local tmp
    tmp=$(mktemp -d "${TMPDIR:-/tmp}/test-upgrade-XXXXXX")
    CLEANUP_DIRS+=("$tmp")
    echo "$tmp"
}

# ───────────────────────────────────────────────────────────────
# 2. PREFLIGHT CHECKS
# ───────────────────────────────────────────────────────────────

echo ""
echo "────────────────────────────────────────────────────"
echo "  upgrade-level.sh Test Suite"
echo "────────────────────────────────────────────────────"

if [[ ! -f "$UPGRADE_SCRIPT" ]]; then
    echo "ERROR: upgrade-level.sh not found at $UPGRADE_SCRIPT" >&2
    exit 1
fi

if [[ ! -f "$SHELL_COMMON" ]]; then
    echo "ERROR: shell-common.sh not found at $SHELL_COMMON" >&2
    exit 1
fi

# ───────────────────────────────────────────────────────────────
# 3. TEST CASES
# ───────────────────────────────────────────────────────────────

# ── Test 1: Shell-common guard ────────────────────────────────
begin_category "Shell-Common Guard"

# Use isolated copy of script with missing ../lib/shell-common.sh (no shared file mutation)
tmp_dir=$(make_temp_dir)
mkdir -p "$tmp_dir/spec"
cp "$UPGRADE_SCRIPT" "$tmp_dir/spec/upgrade-level.sh"

exit_code=0
output=$(bash "$tmp_dir/spec/upgrade-level.sh" /tmp --to 2 2>&1) || exit_code=$?

if [[ "$exit_code" -eq 1 ]] && echo "$output" | grep -qi "helper not found\|shell-common"; then
    pass "Missing helper exits with exact code 1 and clear message"
else
    fail "Expected exit=1 + helper error; got exit=$exit_code, output: $output"
fi

# ── Test 2: Invalid input (no args) ──────────────────────────
begin_category "Invalid Input"

exit_code=0
output=$(bash "$UPGRADE_SCRIPT" 2>&1) || exit_code=$?
if [[ "$exit_code" -ne 0 ]] && echo "$output" | grep -qi "missing.*argument\|usage"; then
    pass "No args produces usage error (exit=$exit_code)"
else
    fail "Expected non-zero + usage message; got exit=$exit_code, output: $output"
fi

# Missing --to flag
exit_code=0
tmp_dir=$(make_temp_dir)
mkdir -p "$tmp_dir/spec-test"
touch "$tmp_dir/spec-test/spec.md"
output=$(bash "$UPGRADE_SCRIPT" "$tmp_dir/spec-test" 2>&1) || exit_code=$?
if [[ "$exit_code" -ne 0 ]] && echo "$output" | grep -qi "missing.*--to\|usage"; then
    pass "Missing --to flag produces error (exit=$exit_code)"
else
    fail "Expected non-zero + --to error; got exit=$exit_code, output: $output"
fi

# Invalid --to value
exit_code=0
output=$(bash "$UPGRADE_SCRIPT" "$tmp_dir/spec-test" --to 5 2>&1) || exit_code=$?
if [[ "$exit_code" -ne 0 ]] && echo "$output" | grep -qi "must be 2, 3, or 3+\|invalid"; then
    pass "Invalid --to value rejected (exit=$exit_code)"
else
    fail "Expected non-zero + invalid level error; got exit=$exit_code, output: $output"
fi

# ── Test 3: Missing spec.md ──────────────────────────────────
begin_category "Missing spec.md"

tmp_dir=$(make_temp_dir)
mkdir -p "$tmp_dir/empty-spec"

exit_code=0
output=$(bash "$UPGRADE_SCRIPT" "$tmp_dir/empty-spec" --to 2 2>&1) || exit_code=$?
if [[ "$exit_code" -ne 0 ]] && echo "$output" | grep -qi "missing spec.md\|not a valid spec"; then
    pass "Empty dir (no spec.md) produces graceful error (exit=$exit_code)"
else
    fail "Expected non-zero + missing spec.md; got exit=$exit_code, output: $output"
fi

# Non-existent directory
exit_code=0
output=$(bash "$UPGRADE_SCRIPT" "/tmp/does-not-exist-$$" --to 2 2>&1) || exit_code=$?
if [[ "$exit_code" -ne 0 ]] && echo "$output" | grep -qi "not found"; then
    pass "Non-existent directory produces error (exit=$exit_code)"
else
    fail "Expected non-zero + not found; got exit=$exit_code, output: $output"
fi

# ── Test 4: Level detection ──────────────────────────────────
begin_category "Level Detection"

# Create spec.md with table-format level declaration
tmp_dir=$(make_temp_dir)
mkdir -p "$tmp_dir/level-detect"
cat > "$tmp_dir/level-detect/spec.md" <<'SPECMD'
# Test Spec

| Field | Value |
|---|---|
| **Level** | 2 |
| **Status** | Draft |

## 1. PROBLEM STATEMENT
Test problem.
SPECMD

# Trying to upgrade to level 2 should fail with "Already at Level 2"
# Which proves the script correctly detected level 2 from the table
exit_code=0
output=$(bash "$UPGRADE_SCRIPT" "$tmp_dir/level-detect" --to 2 2>&1) || exit_code=$?
if [[ "$exit_code" -ne 0 ]] && echo "$output" | grep -qi "already at level 2\|already at.*2"; then
    pass "Detects Level 2 from table format '| **Level** | 2 |' (exit=$exit_code)"
else
    fail "Expected 'Already at Level 2'; got exit=$exit_code, output: $output"
fi

# Test SPECKIT_LEVEL marker detection
tmp_dir2=$(make_temp_dir)
mkdir -p "$tmp_dir2/marker-detect"
cat > "$tmp_dir2/marker-detect/spec.md" <<'SPECMD'
# Test Spec
<!-- SPECKIT_LEVEL: 3 -->

## 1. PROBLEM STATEMENT
Test problem.
SPECMD

exit_code=0
output=$(bash "$UPGRADE_SCRIPT" "$tmp_dir2/marker-detect" --to 3 2>&1) || exit_code=$?
if [[ "$exit_code" -ne 0 ]] && echo "$output" | grep -qi "already at level 3\|already at.*3"; then
    pass "Detects Level 3 from SPECKIT_LEVEL marker (exit=$exit_code)"
else
    fail "Expected 'Already at Level 3'; got exit=$exit_code, output: $output"
fi

# ── Test 5: Already at target ────────────────────────────────
begin_category "Already At Target"

# Create spec folder with checklist.md (inferred level 2) and try upgrade to 2
tmp_dir=$(make_temp_dir)
mkdir -p "$tmp_dir/at-target"
cat > "$tmp_dir/at-target/spec.md" <<'SPECMD'
# Already at L2
| **Level** | 2 |
SPECMD
touch "$tmp_dir/at-target/checklist.md"

exit_code=0
output=$(bash "$UPGRADE_SCRIPT" "$tmp_dir/at-target" --to 2 2>&1) || exit_code=$?
if [[ "$exit_code" -ne 0 ]] && echo "$output" | grep -qi "already at level"; then
    pass "Already at target level = no-op with error (exit=$exit_code)"
else
    fail "Expected 'Already at Level' error; got exit=$exit_code, output: $output"
fi

# ── Test 6: Dry-run mode ─────────────────────────────────────
begin_category "Dry-Run Mode"

tmp_dir=$(make_temp_dir)
mkdir -p "$tmp_dir/dry-run"

# Create a minimal L1 spec folder (spec.md + plan.md + tasks.md)
cat > "$tmp_dir/dry-run/spec.md" <<'SPECMD'
# Dry Run Test
<!-- SPECKIT_LEVEL: 1 -->

| Field | Value |
|---|---|
| **Level** | 1 |

## 1. PROBLEM STATEMENT
Test.

## 2. OPEN QUESTIONS
None.
SPECMD
cat > "$tmp_dir/dry-run/plan.md" <<'PLANMD'
# Plan
## 1. ARCHITECTURE
Test.
PLANMD
cat > "$tmp_dir/dry-run/tasks.md" <<'TASKSMD'
# Tasks
- [ ] Task 1
TASKSMD

# Snapshot file state before dry-run
spec_before=$(cat "$tmp_dir/dry-run/spec.md")
plan_before=$(cat "$tmp_dir/dry-run/plan.md")
tasks_before=$(cat "$tmp_dir/dry-run/tasks.md")

exit_code=0
output=$(bash "$UPGRADE_SCRIPT" "$tmp_dir/dry-run" --to 2 --dry-run 2>&1) || exit_code=$?

# Check 1: exit code should be 0 (dry-run succeeds)
if [[ "$exit_code" -eq 0 ]]; then
    pass "Dry-run exits 0 (exit=$exit_code)"
else
    fail "Dry-run should exit 0; got exit=$exit_code, output: $output"
fi

# Check 2: no new files created (checklist.md should NOT exist)
if [[ ! -f "$tmp_dir/dry-run/checklist.md" ]]; then
    pass "Dry-run did not create checklist.md"
else
    fail "Dry-run created checklist.md (should not modify files)"
fi

# Check 3: existing files unchanged
spec_after=$(cat "$tmp_dir/dry-run/spec.md")
plan_after=$(cat "$tmp_dir/dry-run/plan.md")
tasks_after=$(cat "$tmp_dir/dry-run/tasks.md")

if [[ "$spec_before" == "$spec_after" ]] && [[ "$plan_before" == "$plan_after" ]] && [[ "$tasks_before" == "$tasks_after" ]]; then
    pass "Dry-run left existing files unchanged"
else
    fail "Dry-run modified existing files (spec.md, plan.md, or tasks.md changed)"
fi

# Check 4: no backup directory created
backup_count=$(find "$tmp_dir/dry-run" -maxdepth 1 -name '.backup-*' -type d 2>/dev/null | wc -l | tr -d ' ')
if [[ "$backup_count" -eq 0 ]]; then
    pass "Dry-run did not create backup directory"
else
    fail "Dry-run created backup directory (found $backup_count)"
fi

# Check 5: output mentions DRY RUN
if echo "$output" | grep -qi "dry.run\|DRY RUN"; then
    pass "Dry-run output mentions DRY RUN"
else
    fail "Dry-run output missing DRY RUN indicator; output: $output"
fi

# ───────────────────────────────────────────────────────────────
# 4. SUMMARY
# ───────────────────────────────────────────────────────────────

echo ""
echo "────────────────────────────────────────────────────"
echo "  Results: $PASS passed, $FAIL failed, $SKIP skipped (of $TOTAL)" >&2
echo "────────────────────────────────────────────────────"
echo ""

if [[ "$FAIL" -gt 0 ]]; then
    exit 1
elif [[ "$SKIP" -eq "$TOTAL" ]] && [[ "$TOTAL" -gt 0 ]]; then
    exit 0
else
    exit 0
fi

# Exit codes:
#   0 - Success
#   1 - ERROR: upgrade-level.sh not found at $UPGRADE_SCRIPT
