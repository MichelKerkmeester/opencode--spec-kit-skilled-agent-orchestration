# Iteration 008: Maintainability Re-check

## Focus
- Dimension: `maintainability`
- Files: `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts`, `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts`
- Scope: verify whether F003 should stay advisory

## Scorecard
- Dimensions covered: maintainability
- Files reviewed: 2
- New findings: P0=0 P1=0 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.00

## Findings

### P0 - Blocker
- None.

### P1 - Required
- None.

### P2 - Suggestion
- **F003** *(carried)*: Public Tier 3 contract still mixes `drop` with `drop_candidate` — `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1273-1288`, `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:582-585` — The issue remained vocabulary drift only; no new runtime break emerged.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1205-1207`, `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1273-1288` | Alias normalization prevents runtime failure, but the published contract still drifts. |
| checklist_evidence | partial | hard | `checklist.md:75`, `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:582-585` | The checklist claim remains slightly overstated. |
| feature_catalog_code | notApplicable | advisory | — | No feature catalog surface in scope. |
| playbook_capability | notApplicable | advisory | — | No packet-local playbook artifact in scope. |

## Assessment
- New findings ratio: 0.00
- Dimensions addressed: maintainability
- Novelty justification: stabilization pass; confirmed F003 stays advisory only

## Ruled Out
- No evidence supports escalating F003 to P1 because the runtime normalization path is explicit.

## Dead Ends
- The packet docs do not explain the alias as intentional public contract.

## Recommended Next Focus
Run the final two stabilization passes on correctness and security, then synthesize.
