# Iteration 009: Correctness stabilization pass

## Focus
Correctness stabilization pass on the public Tier 3 contract wording after the deeper metadata review.

## Files Reviewed
- `spec.md`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts`

## Findings
### P1 - Required
- **F001**: Tier 3 prompt still exposes the internal `drop_candidate` alias inside the public 8-category contract — `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1275` — Re-confirmed during the stabilization pass. The packet requirement still says the router chooses from the existing 8 categories, but the prompt and frozen test still ship the internal alias.
- **F006**: The packet closes `metadata_only -> implementation-summary.md` only after handler resolution, not at the router contract layer itself — `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:197` — Re-confirmed during the stabilization pass. The router-facing contract still differs from the packet's concrete-target wording.

### P2 - Suggestion
None.

## Ruled Out
- The parser does normalize the refusal path correctly, so this remains a public-contract clarity issue rather than a malformed runtime response bug.

## Dead Ends
- Re-checking the prompt-shape assertions did not reveal a hidden test that already enforces the public `drop` label.

## Recommended Next Focus
Finish with one more security verification pass, then synthesize the packet under the requested scoring rule.

## Assessment
- Dimensions addressed: correctness
- New findings ratio: 0.11
- Convergence: Continue. Correctness drift remains active and the loop cap is one pass away.
