# Implementation Summary — Memory Save Quality Root Cause Fixes

## What Changed

8 backend fixes to the `generate-context.js` pipeline extractors, addressing structural quality issues in memory file output.

### Fix 1: Decision Deduplication (`decision-extractor.ts`)
- CONTEXT now shows `"title — rationale[0:120]"` instead of duplicating full RATIONALE
- String-form decisions split at sentence boundaries for title vs rationale extraction
- Default `OPTIONS[0].DESCRIPTION` truncated to 60 chars to avoid duplicating TITLE

### Fix 2: Session Status (`collect-session-data.ts`)
- `hasNextSteps` now also checks observations with "Next Steps" title pattern
- Fixes CG-03 completion detection when input normalizer converts `nextSteps` to observations

### Fix 3: Blocker False-Positive (`session-extractor.ts`)
- Replaced 8 broad keywords (`error`, `problem`, `failed`, etc.) with 7 structural patterns
- Patterns require blocker-specific sentence structure: "blocked on/by", "stuck on", "cannot proceed", etc.

### Fix 4: Pattern Specificity (`implementation-guide-extractor.ts`)
- Removed "Module Pattern" and "Functional Transforms" matchers (matched all TS code)
- Require >=2 word-boundary keyword matches per pattern (prevents substring inflation)
- Match against observation text only (not file names)

### Fix 5: Trigger Phrase Quality (`shared/trigger-extractor.ts`)
- Added `TECHNICAL_SHORT_WORDS` set (70+ entries: acronyms, verbs, nouns, programming keywords)
- 2-word phrases with short generic words (< 4 chars, not in allowlist) are filtered
- Relaxed mode now applies `filterTechStopWords` instead of bypassing entirely
- Golden test updated: "the error" correctly filtered, replaced by "fixed null pointer memory"

### Fix 6: File Path Separator (`input-normalizer.ts`)
- Separator regex now supports em dash (`—`), en dash (`–`), and colon (`:`) alongside hyphen (`-`)
- Path validation guard: first capture group must contain `.` or `/`

### Fix 7: Tree Thinning (`tree-thinning.ts`)
- `memoryThinThreshold`: 300 → 150 tokens
- Max 3 children per merged parent; overflow files upgraded to 'keep'

### Fix 8: Conversation Synthesis (`conversation-extractor.ts`)
- When `userPrompts` is sparse but `sessionSummary` exists, synthesizes Assistant messages
- Includes session summary, key decisions count, and next steps

## Review Process

Two independent GPT-5.4 ultra-think reviews:
1. **Review 1**: Found Fix 4 substring bug and Fix 5 over-aggressive filter → both fixed
2. **Review 2**: All 8 fixes PASS (LOW risk), no cross-fix interactions, ready to ship

## Test Results

- **106/106 tests pass** across 4 test files
- 1 golden test expectation updated (intentional behavior improvement)
- Pre-existing failures in `memory-render-fixture.vitest.ts` (from separate `workflow.ts` changes) confirmed unrelated
