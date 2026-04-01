---
title: "Tasks: Gemini CLI Hook Porting [024/022]"
description: "Task tracking for Gemini CLI hook implementation."
---
# Tasks: Phase 022 — Gemini CLI Hook Porting

## Completed

- [x] Shared utilities — hooks/gemini/shared.ts (89 lines): parseGeminiStdin, formatGeminiOutput, GeminiHookInput/Output types
- [x] Session Prime (SessionStart) — hooks/gemini/session-prime.ts (165 lines): detects startup/resume/clear, outputs JSON additionalContext
- [x] Compact Cache (PreCompress) — hooks/gemini/compact-cache.ts (137 lines): caches context to temp file before compression, but `tailFile()` still uses unbounded `readFileSync`
- [x] Compact Inject (BeforeAgent) — hooks/gemini/compact-inject.ts (82 lines): reads cached context, injects sanitized payload (F055 fixed)
- [x] Session Stop (SessionEnd) — hooks/gemini/session-stop.ts (113 lines): runs on a single `SessionEnd` hook, saves session state, and only provides partial token tracking because Gemini transcript token usage is not parsed
- [x] Nested spec detection guard documented — `session-stop.ts` regex only captures shallow `.opencode/specs/<segment>/<segment>/` paths, so deeper phase paths can be truncated
- [ ] Settings Registration verification — `.gemini/settings.json` remains a user-local target and still needs local workspace-path verification
 
## Open / Deferred

- [ ] F056: transcript-size hardening is incomplete — `session-stop.ts` has `MAX_TRANSCRIPT_BYTES`, but `compact-cache.ts` still uses unbounded `readFileSync`
- [ ] Workspace-path verification for `.gemini/settings.json` — no checked-in settings file exists in the repo, and stale local paths must be corrected manually
