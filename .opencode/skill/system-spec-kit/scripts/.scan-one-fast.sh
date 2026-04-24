#!/usr/bin/env bash
# Validate ONE spec folder with 15s timeout, single summary line.
set +e
folder="$1"
VALIDATE="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec/validate.sh"
ROOT="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs"
tmp=$(mktemp)
( bash "$VALIDATE" "$folder" --strict >"$tmp" 2>&1 ) & pid=$!
( sleep 15 && kill -9 $pid 2>/dev/null ) & killer=$!
wait $pid 2>/dev/null
kill $killer 2>/dev/null
wait 2>/dev/null
out=$(cat "$tmp")
rm -f "$tmp"
rel="${folder#$ROOT/}"
summary=$(echo "$out" | grep -E "^  Summary:" | head -1)
if [ -z "$summary" ]; then
  echo "TIMEOUT_OR_FAIL | $rel"
  exit 0
fi
errs=$(echo "$summary" | sed -n 's/.*Errors: \([0-9]*\).*/\1/p')
warns=$(echo "$summary" | sed -n 's/.*Warnings: \([0-9]*\).*/\1/p')
if [ "${errs:-0}" -gt 0 ]; then
  rules=$(echo "$out" | grep -E "^✗ [A-Z_]+:" | sed 's/^✗ \([A-Z_]*\):.*/\1/' | sort -u | paste -sd, -)
  echo "ERR=${errs} WARN=${warns} | $rel | rules=$rules"
elif [ "${warns:-0}" -gt 0 ]; then
  rules=$(echo "$out" | grep -E "^⚠ [A-Z_]+:" | sed 's/^⚠ \([A-Z_]*\):.*/\1/' | sort -u | paste -sd, -)
  echo "ERR=0 WARN=${warns} | $rel | rules=$rules"
else
  echo "CLEAN | $rel"
fi
