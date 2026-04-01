---
title: "Checklist: Gemini CLI Hook Porting [024/022]"
description: "8 items across P1/P2 for phase 022."
---
# Checklist: Phase 022 — Gemini CLI Hook Porting

## P1 — Must Pass

- [x] GeminiHookInput/Output types defined — hooks/gemini/shared.ts
- [x] SessionStart hook detects startup/resume/clear and outputs context — hooks/gemini/session-prime.ts (165 lines)
- [x] PreCompress hook caches critical context to temp file — hooks/gemini/compact-cache.ts (137 lines)
- [x] BeforeAgent hook injects cached context with sanitized payload — hooks/gemini/compact-inject.ts (82 lines), F055 fixed
- [x] SessionEnd hook tracks token usage and saves session state — hooks/gemini/session-stop.ts (113 lines)
- [x] All hooks registered in .gemini/settings.json — hook block with correct lifecycle events

## P2 — Should Pass

- [x] Shared parseGeminiStdin and formatGeminiOutput utilities — hooks/gemini/shared.ts (89 lines)
- [ ] F056: session-stop applies size limit when reading transcript — DEFERRED (low practical risk)
