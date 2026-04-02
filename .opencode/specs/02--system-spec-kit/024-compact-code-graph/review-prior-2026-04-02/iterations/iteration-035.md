# Review Iteration 035

## Dimension: D3 Traceability

## Focus: F011-F020 remediation verification

## New Findings
None.

## Remediation Verification
- F011: FIXED — `allocateBudget()` now honors the caller-supplied `totalBudget`, seeds overflow from `totalBudget - floorTotal`, and trims back to `totalBudget` instead of a fixed 4000 ceiling (`budget-allocator.ts:52-58`, `budget-allocator.ts:94-116`).
- F012: FIXED — truncation now reserves space for the `"[...truncated]"` marker inside the token budget, and zero-grant / empty sections are skipped before rendering (`compact-merger.ts:50-63`, `compact-merger.ts:146-153`).
- F013: FIXED — file tracking now evicts immediately once `size > maxFiles`, and eviction loops until the tracker is back within capacity (`working-set-tracker.ts:44-47`, `working-set-tracker.ts:89-97`).
- F014: FIXED — DB failures no longer fall through to placeholder anchors; all resolver catch blocks call `throwResolutionError()`, which logs and throws (`seed-resolver.ts:78-82`, `seed-resolver.ts:127-129`, `seed-resolver.ts:164-166`, `seed-resolver.ts:261-263`).
- F015: FIXED — `indexFiles()` now contains a live `TESTED_BY` generation path for `.test/.spec/.vitest` files and pushes `TESTED_BY` edges when the corresponding source file is present (`structural-indexer.ts:1069-1090`).
- F016: FIXED — `excludeGlobs` are now compiled, checked before recursion/file collection, and passed from `indexFiles()` into `findFiles()` (`structural-indexer.ts:1000-1008`, `structural-indexer.ts:1012-1026`, `structural-indexer.ts:1053-1055`).
- F017: FIXED — `.zsh` is still mapped to `bash`, and the default include globs now explicitly discover `**/*.zsh` files (`indexer-types.ts:81-96`, `indexer-types.ts:99-106`).
- F018: FIXED — recovery authority is now explicit: root `CLAUDE.md` defines the universal recovery flow, while `.claude/CLAUDE.md` declares itself Claude-specific and defers to root for canonical recovery (`CLAUDE.md:69-78`, `.claude/CLAUDE.md:1-9`).
- F019: FIXED — token-count sync is centralized in the envelope module; `response-hints.ts` now imports and uses `serializeEnvelopeWithTokenCount` / `syncEnvelopeTokenCount` from `lib/response/envelope.ts` instead of maintaining its own sync loop (`hooks/response-hints.ts:4`, `hooks/response-hints.ts:130-142`, `lib/response/envelope.ts:116-138`).
- F020: PARTIAL — `sessionState` is now included in source sizing/allocation and truncated through the normal section path (`compact-merger.ts:122-166`), but the final rendered brief still appends unbudgeted section headers and only reports `totalTokenEstimate` as the sum of section contents, with no final cap on rendered `text` (`compact-merger.ts:171-176`).

## Iteration Summary
- New findings: 0
- Verified fixes: 9
- Remaining active: 1
