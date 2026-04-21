# Iteration 001 - Correctness

## Scope

Audited implementation code only:
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts`

## Verification

`cd .opencode/skill/system-spec-kit/mcp_server && ../scripts/node_modules/.bin/vitest run tests/handler-memory-save.vitest.ts tests/content-router.vitest.ts --reporter=default`

Result: PASS. `2` test files passed; `89` tests passed and `3` skipped.

Git history check: `git log --oneline --decorate -- <audited files>` showed the Tier 3 path was materially changed in `253b7d098b feat: enable Tier 3 LLM save routing by default, remove feature flag`, with later targeted test movement in `ba0dbea718`.

## Findings

### IMPL-F001 - P1 Correctness - Tier 3 cache keys ignore route-shaping context

`resolveTier3Decision()` uses only `input.chunk_hash` as the Tier 3 cache lookup key at `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:756`. `InMemoryRouterCache.buildKey()` then scopes that hash only by session id or spec folder at `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:334`.

That omits route-shaping fields that are sent to Tier 3 as part of the prompt: packet level/kind/save mode at `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1297`, `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1298`, `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1299`, and likely phase anchor at `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1303`.

The current cache tests prove reuse exists at `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:296`, but they do not prove identical text in different route contexts gets a cache miss. A prior ambiguous chunk can therefore replay a stale Tier 3 target for a later save whose packet kind, save mode, or phase anchor differs.

## Convergence

New weighted findings ratio: `0.32`. Continue.
