---
title: "Checklist: Gemini CLI Hook Porting [024/022]"
description: "8 items across P1/P2 for phase 022."
---
# Checklist: Phase 022 — Gemini CLI Hook Porting

## P1 — Must Pass

- [x] GeminiHookInput/Output types defined [Code: hooks/gemini/shared.ts]
- [x] SessionStart hook detects startup/resume/clear and outputs context [Code: hooks/gemini/session-prime.ts]
- [x] PreCompress hook caches critical context to temp file [Code: hooks/gemini/compact-cache.ts]
- [x] BeforeAgent hook injects cached context with sanitized payload [Code: hooks/gemini/compact-inject.ts, F055 fixed]
- [x] SessionEnd hook saves session state on Gemini's single `SessionEnd` lifecycle event [Code: hooks/gemini/session-stop.ts]
- [ ] `.gemini/settings.json` registration verified for the active workspace [Known limitation: no checked-in repo file; local workspace path must be verified]

## P2 — Should Pass

- [x] Shared parseGeminiStdin and formatGeminiOutput utilities [Code: hooks/gemini/shared.ts]
- [ ] SessionEnd token tracking parses Gemini transcript token usage [Limitation: current implementation does not parse Gemini transcript token usage]
- [ ] Nested spec-folder detection preserves deep phase paths [Limitation: regex-based detection truncates deeper paths]
- [ ] F056: transcript-size hardening is complete [Open: `session-stop.ts` has `MAX_TRANSCRIPT_BYTES`, but `compact-cache.ts` still uses unbounded `readFileSync`]
