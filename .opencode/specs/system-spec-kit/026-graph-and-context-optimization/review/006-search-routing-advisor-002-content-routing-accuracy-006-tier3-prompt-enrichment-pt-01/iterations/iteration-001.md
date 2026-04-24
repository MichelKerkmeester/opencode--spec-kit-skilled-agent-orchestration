# Iteration 001: Correctness contract baseline

## Focus
Correctness review of the Tier 3 prompt contract and the packet's explicit acceptance criteria.

## Files Reviewed
- `spec.md`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts`

## Findings
### P1 - Required
- **F001**: Tier 3 prompt still exposes the internal `drop_candidate` alias inside the public 8-category contract — `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1275` — `spec.md` requires the router to keep the existing 8 categories, but the shipped prompt still lists `drop_candidate` in the category table and merge-mode guidance, and the prompt-contract test freezes that drift instead of the public `drop` label. Supporting evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1283`, `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1288`, `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:582`, `spec.md:24`.

### P2 - Suggestion
None.

## Ruled Out
- The packet did not change parser behavior or target resolution directly; the visible drift is in the Tier 3 prompt contract and its frozen test.

## Dead Ends
- Re-reading `checklist.md` did not add any correctness-only evidence beyond what the prompt and prompt-shape test already expose.

## Recommended Next Focus
Rotate into security and test whether the new continuity-model paragraph disclosed more topology than necessary to the external Tier 3 classifier.

## Assessment
- Dimensions addressed: correctness
- New findings ratio: 0.32
- Convergence: Continue. Only correctness is covered and the prompt-contract drift remains unresolved.
