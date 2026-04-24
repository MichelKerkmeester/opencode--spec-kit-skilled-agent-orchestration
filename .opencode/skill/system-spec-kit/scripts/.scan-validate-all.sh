#!/usr/bin/env bash
# Run validate.sh --strict across every spec folder and summarize failures.
set -uo pipefail

ROOT="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs"
VALIDATE="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec/validate.sh"

# Find all spec folders that contain at least a spec.md
mapfile -t FOLDERS < <(find "$ROOT" -type f -name spec.md \
  -not -path '*/z_archive/*' \
  -not -path '*/z_future/*' \
  -not -path '*/research/iterations/*' \
  -not -path '*/review/iterations/*' \
  -not -path '*/.tmp/*' \
  -not -path '*/tmp-test-fixtures/*' \
  | xargs -n1 dirname | sort -u)

echo "Scanning ${#FOLDERS[@]} spec folders..."

PASS=0
ERRORS=0
WARNS_ONLY=0
FAILED_FOLDERS=()
ERROR_FOLDERS=()

for f in "${FOLDERS[@]}"; do
  out=$(bash "$VALIDATE" "$f" --strict 2>&1)
  summary=$(echo "$out" | grep -E "^  Summary:" | head -1)
  errs=$(echo "$summary" | sed -n 's/.*Errors: \([0-9]*\).*/\1/p')
  warns=$(echo "$summary" | sed -n 's/.*Warnings: \([0-9]*\).*/\1/p')
  errs=${errs:-0}
  warns=${warns:-0}
  if [ "$errs" -gt 0 ]; then
    ERRORS=$((ERRORS + 1))
    rel=${f#"$ROOT/"}
    ERROR_FOLDERS+=("$rel | errors=$errs warns=$warns")
  elif [ "$warns" -gt 0 ]; then
    WARNS_ONLY=$((WARNS_ONLY + 1))
    rel=${f#"$ROOT/"}
    FAILED_FOLDERS+=("$rel | warns=$warns")
  else
    PASS=$((PASS + 1))
  fi
done

echo
echo "=== SUMMARY ==="
echo "Total folders:   ${#FOLDERS[@]}"
echo "PASSED clean:    $PASS"
echo "WARNS only:      $WARNS_ONLY"
echo "HAS ERRORS:      $ERRORS"
echo
echo "=== FOLDERS WITH ERRORS ==="
for line in "${ERROR_FOLDERS[@]}"; do echo "$line"; done
echo
echo "=== FOLDERS WITH WARNINGS ONLY (first 20) ==="
count=0
for line in "${FAILED_FOLDERS[@]}"; do
  echo "$line"
  count=$((count + 1))
  [ "$count" -ge 20 ] && echo "...(and $((${#FAILED_FOLDERS[@]} - 20)) more)" && break
done
