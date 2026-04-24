# Iteration 37: Metadata-Only Identity Verification

## Focus
Verify the compiled save helpers and canonical handler seams around `metadata_only` so we can separate write-target correctness from router classification behavior.

## Findings
1. The routed identity helper now maps `metadata_only` saves to the continuity anchor on the canonical implementation summary host: `targetDocPath = implementation-summary.md` and `targetAnchorId = _memory.continuity`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:111] [INFERENCE: direct node probe against dist/handlers/save/create-record.js]
2. The canonical save handler resolves `spec-frontmatter` to `implementation-summary.md` when that file exists and falls back to `spec.md` only when the implementation summary is missing. That matches the new regression tests covering both paths. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1055] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1157] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1200]
3. Because the preserved replay stayed flat and the current tree shows no further diff in `content-router.ts` or `routing-prototypes.json`, the F7 change is a write-target correctness fix, not a classifier-tuning change. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:918] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1064] [INFERENCE: comparison against iteration 36 replay]

## Ruled Out
- Treating F7 as a hidden fix for the `research_finding` versus `metadata_only` classification seam.

## Dead Ends
- Looking for a new same-path identity collision after the fix; the helper now resolves continuity identity onto the canonical host doc and anchor explicitly.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:111`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1055`
- `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1157`
- `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1200`

## Assessment
- New information ratio: 0.04
- Questions addressed: RQ-17
- Questions answered: none

## Reflection
- What worked and why: The distilled identity probe was enough to prove the fix shape without widening into the noisy full handler suite.
- What did not work and why: Full end-to-end handler execution would have added unrelated database and suite noise for a question that was really about routed identity.
- What I would do differently: Keep a tiny packet-local smoke harness for canonical routed saves so future write-target regressions are even cheaper to verify.

## Recommended Next Focus
Run one final active-doc and edge-case sweep; if it stays clean, stop the loop early for convergence.
