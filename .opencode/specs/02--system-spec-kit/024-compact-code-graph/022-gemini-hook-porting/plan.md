---
title: "Plan: Gemini CLI Hook Porting [024/022]"
description: "Implementation order for porting Claude hooks to Gemini CLI lifecycle format."
---
# Plan: Phase 022 — Gemini CLI Hook Porting

## Implementation Order

1. **Shared utilities** (40-50 LOC)
   - Create `hooks/gemini/shared.ts` with parseGeminiStdin and formatGeminiOutput helpers
   - Define GeminiHookInput/GeminiHookOutput types
   - Reuse Claude hook core logic where applicable

2. **Session Prime (SessionStart)** (80-100 LOC)
   - Create `hooks/gemini/session-prime.ts`
   - Map directly from Claude SessionStart — detect source (startup/resume/clear)
   - Output session context as JSON additionalContext for Gemini format
   - Reuse memory-surface.ts context gathering

3. **Compact Cache (PreCompress)** (60-80 LOC)
   - Create `hooks/gemini/compact-cache.ts`
   - Cache critical context to temp file before Gemini compression
   - Equivalent to Claude PreCompact phase

4. **Compact Inject (BeforeAgent)** (40-50 LOC)
   - Create `hooks/gemini/compact-inject.ts`
   - Read cached context from temp file and inject as additionalContext
   - Uses sanitized payload (F055 fix applied)
   - One-shot: only fires on first agent turn after compression

5. **Session Stop (SessionEnd)** (50-60 LOC)
   - Create `hooks/gemini/session-stop.ts`
   - Track token usage and save session state
   - Adapted from Claude Stop hook — different transcript format

6. **Settings Registration** (15-20 LOC)
   - Edit `.gemini/settings.json` to add hooks block
   - Register all 4 hooks with correct lifecycle event mappings

## Dependencies
- None — can be done independently of other phases

## Estimated Total LOC: 140-260
