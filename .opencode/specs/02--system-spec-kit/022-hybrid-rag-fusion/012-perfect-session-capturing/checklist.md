# Checklist: Perfect Session Capturing

## P0 — Critical (must pass)
- [x] `npx tsc --build` completes with zero errors — VERIFIED: clean build after all 20 fixes
- [x] Session ID generation uses `crypto.randomBytes()` (not `Math.random()`) — VERIFIED: session-extractor.ts:131
- [x] No data loss in tool output handling (truncation is configurable) — VERIFIED: config.ts `toolOutputMaxLength`, opencode-capture.ts uses `CONFIG.TOOL_OUTPUT_MAX_LENGTH`
- [x] No path traversal possible in file paths — VERIFIED: data-loader.ts sanitization intact
- [x] All CRITICAL findings from audit resolved — VERIFIED: 3/3 P0 fixes implemented

## P1 — Important (should pass)
- [x] No content leakage (irrelevant content in memory files) — VERIFIED: spec-folder relevance filter in input-normalizer.ts (prior fix)
- [x] No placeholder leakage in rendered templates — VERIFIED: file-writer.ts `validateNoLeakedPlaceholders()` intact
- [x] Contamination filter covers >= 25 patterns — VERIFIED: 30+ patterns in contamination-filter.ts
- [x] All HIGH findings from audit resolved — VERIFIED: 8/8 P1 fixes implemented
- [x] Decision confidence not hardcoded — VERIFIED: evidence-based computation (50/65/70 base) in decision-extractor.ts
- [x] No-tool sessions classified correctly — VERIFIED: `total === 0` returns RESEARCH in session-extractor.ts
- [x] File action semantics preserved — VERIFIED: 5-value mapping (Created/Modified/Deleted/Read/Renamed) in file-extractor.ts
- [x] Batch write failure rolls back prior files — VERIFIED: file-writer.ts rollback loop
- [x] Postflight deltas require both-side data — VERIFIED: collect-session-data.ts type guards
- [ ] Quality scores on well-formed sessions >= 85% — NOT TESTED: requires runtime verification
- [ ] No truncation artifacts in generated memory files — NOT TESTED: requires runtime verification
- [ ] Task extraction regex has <= 5% false positive rate — NOT TESTED: requires runtime verification

## P2 — Desirable (nice to have)
- [x] All hardcoded magic numbers documented or configurable — VERIFIED: 7 values moved to config.ts
- [x] Consistent error handling pattern across all extractors — VERIFIED: redundant patterns cleaned
- [x] MAX_FILES_IN_MEMORY configurable — VERIFIED: config.ts `maxFilesInMemory`
- [x] HTML stripping is code-block-safe — VERIFIED: workflow.ts splits on code fences before stripping
- [x] memoryId zero handled correctly — VERIFIED: workflow.ts `!== null` check
- [x] File description dedup prefers richer content — VERIFIED: file-extractor.ts longer-is-better
- [ ] Learning index weights configurable via config.ts — REMAINING: weights still in collect-session-data.ts
- [ ] Phase detection improved beyond simple regex — REMAINING: ratio-based detection adequate for now
- [ ] All MEDIUM findings from audit resolved — REMAINING: ~67 medium findings not yet addressed
- [ ] Generated memory files pass manual quality inspection (5 samples) — NOT TESTED: requires runtime verification
