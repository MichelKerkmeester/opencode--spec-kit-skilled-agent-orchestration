# Iteration 002: D1 Correctness

## Findings

### P0
None.

### [P1] Auto-detected `planning` sessions now downgrade to episodic memories because downstream classification still keys on `decision`
- **File**: `.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:120-150`; `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:886-893`; `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:1044-1047`; `.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:68-78`; `.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:127-137`
- **Issue**: `detectContextType()` now returns `planning` for decision-heavy sessions, and that value is written through as `CONTEXT_TYPE`, but `inferMemoryType()` still only treats `decision`, `research`, and `discovery` as semantic memories. `planning` therefore falls through to `episodic`.
- **Evidence**: `session-extractor.ts` returns `planning` when `decisionCount > 0` and marks `planning` sessions as `important`. `collect-session-data.ts` persists that result into `CONTEXT_TYPE`. `memory-metadata.ts` then derives the fallback `memoryType` from `CONTEXT_TYPE`, but its semantic branch still checks `contextType === 'decision' || contextType === 'research' || contextType === 'discovery'`, so `planning` hits the default `episodic` path.
- **Impact**: Decision-heavy sessions that previously classified as semantic memories now default to episodic memories with the shorter 30-day half-life instead of the semantic 365-day half-life, unless a caller explicitly overrides `memory_type`. That is a correctness regression in retention and retrieval behavior even though the session-level rename itself is intentional.
- **Recommendation**: Update `inferMemoryType()` and any related downstream heuristics to treat `planning` the same as legacy `decision`, or keep emitting `decision` until all downstream consumers have been migrated.

### [P1] Legacy `bug` context canonicalizes inconsistently between the MCP parser and frontmatter migration
- **File**: `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:108-121`; `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:831-840`; `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1026-1046`
- **Issue**: The MCP parser now maps `bug` to `implementation`, but the frontmatter migration normalizer still maps `bug` to `discovery`. The same legacy frontmatter value therefore canonicalizes differently depending on which ingestion path touches it.
- **Evidence**: `memory-parser.ts` defines `bug: 'implementation'` in `CONTEXT_TYPE_MAP`. `frontmatter-migration.ts` still defines `bug: 'discovery'` in `normalizeContextType()`'s alias map, even though the same module documents that downstream consumers expect `implementation` / `planning` / `research` / `general` rather than the old default `decision`.
- **Impact**: A legacy memory with `contextType: bug` can be normalized to `discovery` during migration but later parsed as `implementation` by the MCP server. That creates inconsistent stored metadata, breaks assumptions about stable canonicalization, and can skew context-type filtering, ranking, and migration audits.
- **Recommendation**: Pick one canonical target for `bug` and apply it consistently across both normalizers. If `implementation` is the intended new behavior, update `normalizeContextType()` and any coupled tests or migration expectations to match.

### [P1] The parser mapping change is not test-clean: the targeted `CONTEXT_TYPE_MAP` regression suite still encodes the old contract
- **File**: `.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser-extended.vitest.ts:219-233`
- **Issue**: The extended parser test still expects canonical self-maps for `decision` and `discovery`, and still asserts the old alias behavior `planning -> decision` and `bug -> discovery`. Running the targeted suite now fails T06-T08.
- **Evidence**: `memory-parser-extended.vitest.ts` hard-codes `['implementation', 'research', 'decision', 'discovery', 'general']` as the canonical `ContextType[]`, expects `planning` to alias to `decision`, and expects `bug` to alias to `discovery`. A targeted run of `npx vitest run tests/memory-parser-extended.vitest.ts --reporter=verbose` failed exactly those three assertions after the mapping change.
- **Impact**: The reviewed change leaves the parser regression suite red. That blocks a clean release signal for the migration and makes it harder to tell whether future mapping changes are intentional compatibility work or accidental contract drift.
- **Recommendation**: Update the parser tests to reflect the new canonical mapping, and add explicit backward-compatibility assertions for accepted legacy inputs (`decision`, `discovery`) if that compatibility remains required.

### P2
None.

## Summary
- P0: 0 findings
- P1: 3 findings
- P2: 0 findings
