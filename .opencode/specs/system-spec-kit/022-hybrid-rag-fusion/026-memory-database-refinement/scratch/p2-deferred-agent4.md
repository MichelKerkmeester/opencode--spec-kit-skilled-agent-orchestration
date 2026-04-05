## Agent 4 Summary

Implemented both deferred P2 trigger-matcher fixes in `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts` and added regression coverage in `.opencode/skill/system-spec-kit/mcp_server/tests/trigger-matcher.vitest.ts`.

### P2-034

- Unified trigger normalization through `normalizeTriggerText()`, which routes indexing and lookup through `normalizeUnicode()` and normalizes whitespace consistently.
- Replaced the Latin-1-only boundary handling with a Unicode-aware regex builder based on Unicode property classes.
- Added a focused CJK fallback so pure CJK trigger phrases still match inside flowing CJK text while Cyrillic and other word-delimited scripts keep stricter Unicode boundaries.
- Added tests covering Cyrillic and CJK phrase matching plus normalization parity between cache/indexing and lookup.

### P2-035

- Added a token and 2-3 gram candidate index (`Map<string, Set<triggerId>>`) alongside the trigger cache.
- `matchTriggerPhrases()` now narrows the regex scan to indexed candidates before running boundary regex evaluation.
- Added tests proving indexed lookup matches full-scan results and that the candidate set is smaller than the full cache on 500+ trigger datasets.

### Verification

- `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit 2>&1 | tail -5`
- `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/trigger-matcher.vitest.ts 2>&1 | tail -20`

Both commands passed.
