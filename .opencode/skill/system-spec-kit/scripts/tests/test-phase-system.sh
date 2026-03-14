#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Test Phase System
# ───────────────────────────────────────────────────────────────
# Regression tests for create.sh phase-mode defaults and parent append mode.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_SCRIPTS_DIR="${SCRIPT_DIR}/../spec"
SOURCE_LIB_DIR="${SCRIPT_DIR}/../lib"
SOURCE_TEMPLATES_DIR="${SCRIPT_DIR}/../../templates"

PASS=0
FAIL=0
TOTAL=0
TMP_DIRS=()

pass() {
  PASS=$((PASS + 1))
  TOTAL=$((TOTAL + 1))
  echo "  PASS: $1"
}

fail() {
  FAIL=$((FAIL + 1))
  TOTAL=$((TOTAL + 1))
  echo "  FAIL: $1" >&2
}

cleanup_all() {
  local i=0
  while [[ $i -lt ${#TMP_DIRS[@]} ]]; do
    [[ -d "${TMP_DIRS[$i]}" ]] && rm -rf "${TMP_DIRS[$i]}"
    i=$((i + 1))
  done
}

trap cleanup_all EXIT

make_temp_repo() {
  local temp_repo
  temp_repo=$(mktemp -d "${TMPDIR:-/tmp}/test-phase-system-XXXXXX")
  TMP_DIRS+=("$temp_repo")

  mkdir -p "$temp_repo/.specify"
  mkdir -p "$temp_repo/specs"

  mkdir -p "$temp_repo/.opencode/skill/system-spec-kit/scripts/spec"
  mkdir -p "$temp_repo/.opencode/skill/system-spec-kit/scripts/lib"
  mkdir -p "$temp_repo/.opencode/skill/system-spec-kit/templates"

  cp "$SOURCE_SCRIPTS_DIR/create.sh" "$temp_repo/.opencode/skill/system-spec-kit/scripts/spec/create.sh"
  cp "$SOURCE_LIB_DIR/shell-common.sh" "$temp_repo/.opencode/skill/system-spec-kit/scripts/lib/shell-common.sh"
  cp "$SOURCE_LIB_DIR/git-branch.sh" "$temp_repo/.opencode/skill/system-spec-kit/scripts/lib/git-branch.sh"
  cp "$SOURCE_LIB_DIR/template-utils.sh" "$temp_repo/.opencode/skill/system-spec-kit/scripts/lib/template-utils.sh"

  cp -R "$SOURCE_TEMPLATES_DIR/level_1" "$temp_repo/.opencode/skill/system-spec-kit/templates/"
  cp -R "$SOURCE_TEMPLATES_DIR/addendum" "$temp_repo/.opencode/skill/system-spec-kit/templates/"

  echo "$temp_repo"
}

json_field() {
  local field_name="$1"
  python3 -c "import json, sys; print(json.load(sys.stdin)[\"${field_name}\"])"
}

echo ""
echo "---------------------------------------------------------------"
echo "  test-phase-system.sh"
echo "---------------------------------------------------------------"

if [[ ! -f "$SOURCE_SCRIPTS_DIR/create.sh" ]]; then
  echo "ERROR: create.sh not found at $SOURCE_SCRIPTS_DIR/create.sh" >&2
  exit 1
fi

# ───────────────────────────────────────────────────────────────
# Test 1: --phase defaults to 3 child phases
# ───────────────────────────────────────────────────────────────
echo ""
echo "-- Default phase count --"

repo1=$(make_temp_repo)
create1="$repo1/.opencode/skill/system-spec-kit/scripts/spec/create.sh"

json1=$(cd "$repo1" && bash "$create1" --json --phase --skip-branch --number 1 "Default phase count")
branch1=$(echo "$json1" | json_field "BRANCH_NAME")
phase_count1=$(echo "$json1" | json_field "PHASE_COUNT")

if [[ "$phase_count1" == "3" ]]; then
  pass "create.sh --phase defaults to 3 phases"
else
  fail "Expected PHASE_COUNT=3, got ${phase_count1}"
fi

child_count1=$(find "$repo1/specs/$branch1" -mindepth 1 -maxdepth 1 -type d -name '[0-9][0-9][0-9]-*' | wc -l | tr -d ' ')
if [[ "$child_count1" == "3" ]]; then
  pass "Default phase run created 3 child folders"
else
  fail "Expected 3 child folders, got ${child_count1}"
fi

# ───────────────────────────────────────────────────────────────
# Test 2: --parent appends phases to existing parent folder
# ───────────────────────────────────────────────────────────────
echo ""
echo "-- Parent append mode --"

repo2=$(make_temp_repo)
create2="$repo2/.opencode/skill/system-spec-kit/scripts/spec/create.sh"

base_json=$(cd "$repo2" && bash "$create2" --json --phase --skip-branch --number 2 --phases 1 --phase-names "foundation" "Parent append base")
base_branch=$(echo "$base_json" | json_field "BRANCH_NAME")
parent_rel="specs/$base_branch"

append_json=$(cd "$repo2" && bash "$create2" --json --phase --parent "$parent_rel" --phases 2 --phase-names "implementation,integration" "Parent append run")
append_count=$(echo "$append_json" | json_field "PHASE_COUNT")

if [[ "$append_count" == "2" ]]; then
  pass "Append mode reports 2 newly created phases"
else
  fail "Expected append PHASE_COUNT=2, got ${append_count}"
fi

if [[ -d "$repo2/$parent_rel/002-implementation" ]] && [[ -d "$repo2/$parent_rel/003-integration" ]]; then
  pass "Append mode created sequential child folders under parent"
else
  fail "Expected parent to contain 002-implementation and 003-integration"
fi

if grep -q "001-foundation" "$repo2/$parent_rel/002-implementation/spec.md" \
  && grep -q "003-integration" "$repo2/$parent_rel/002-implementation/spec.md"; then
  pass "Appended phase child headers link predecessor and successor correctly"
else
  fail "Appended phase child headers do not contain expected predecessor/successor links"
fi

echo ""
echo "---------------------------------------------------------------"
echo "  Results: ${PASS} passed, ${FAIL} failed (of ${TOTAL})" >&2
echo "---------------------------------------------------------------"
echo ""

if [[ "$FAIL" -gt 0 ]]; then
  exit 1
fi

exit 0

# Exit codes:
#   0 - Success
#   1 - ERROR: create.sh not found at $SOURCE_SCRIPTS_DIR/create.sh
