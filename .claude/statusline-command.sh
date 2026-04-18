#!/usr/bin/env bash
# Claude Code status line — git branch + 5h limit + 7d weekly usage
set -euo pipefail

input=$(cat)

# --- Git branch ---
branch=$(git -C "$(echo "$input" | jq -r '.workspace.current_dir')" \
  --no-optional-locks branch --show-current 2>/dev/null || true)
if [ -n "$branch" ]; then
  branch_part=" $branch"
else
  branch_part=""
fi

# --- 5-hour session limit ---
five_pct=$(echo "$input" | jq -r '.rate_limits.five_hour.used_percentage // empty')
if [ -n "$five_pct" ]; then
  five_fmt=$(printf "%.0f" "$five_pct")
  five_part=" | 5h: ${five_fmt}%"
else
  five_part=""
fi

# --- 7-day weekly limit ---
week_pct=$(echo "$input" | jq -r '.rate_limits.seven_day.used_percentage // empty')
if [ -n "$week_pct" ]; then
  week_fmt=$(printf "%.0f" "$week_pct")
  week_part=" | 7d: ${week_fmt}%"
else
  week_part=""
fi

# --- Context window remaining ---
ctx_rem=$(echo "$input" | jq -r '.context_window.remaining_percentage // empty')
if [ -n "$ctx_rem" ]; then
  ctx_fmt=$(printf "%.0f" "$ctx_rem")
  ctx_part=" | ctx: ${ctx_fmt}% left"
else
  ctx_part=""
fi

printf "%s%s%s%s" "$branch_part" "$five_part" "$week_part" "$ctx_part"
