---
title: "Packet README: Normalized Analytics Reader"
description: "Overview for packet 024/031 and its reader-only runtime boundary."
trigger_phrases:
  - "packet readme"
  - "normalized analytics reader overview"
importance_tier: "normal"
contextType: "general"
---
# Normalized Analytics Reader

Packet `024/031` is the reader-side follow-on to the completed Stop-hook producer metadata packet.

## What This Packet Does

- Replays transcript JSONL into normalized session and turn tables
- Uses `claudeSessionId` as the session key
- Uses `transcript_path + byte_start` for idempotent turn identity
- Seeds pricing and cache-tier lookup tables for later reporting work

## What This Packet Does Not Do

- Change `session-stop.ts` or `hook-state.ts`
- Add a SessionStart startup consumer
- Add a dashboard or reporting endpoint
- Modify `.claude/settings.local.json`

## Runtime Scope

- `hooks/claude/claude-transcript.ts`
- `lib/analytics/session-analytics-db.ts`
- `tests/session-analytics-db.vitest.ts`

## Verification

- `TMPDIR=$PWD/.tmp/tsc-tmp npm run typecheck`
- `TMPDIR=$PWD/.tmp/vitest-tmp npx vitest run tests/session-analytics-db.vitest.ts tests/hook-session-stop-replay.vitest.ts tests/hook-stop-token-tracking.vitest.ts`
- `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh ".opencode/specs/system-spec-kit/024-compact-code-graph/031-normalized-analytics-reader" --strict`

## Follow-On Packets

1. Reporting contract and dashboard readers
2. Startup cached-summary consumer
3. Broader token-insight publication surfaces
