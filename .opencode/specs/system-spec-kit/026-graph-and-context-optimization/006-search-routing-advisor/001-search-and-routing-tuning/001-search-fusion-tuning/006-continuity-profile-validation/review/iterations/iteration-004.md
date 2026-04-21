# Iteration 004: Maintainability

## Focus
- Dimension: `maintainability`
- Files: `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts`, `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts`, `implementation-summary.md`, `checklist.md`
- Scope: public routing vocabulary and whether the frozen contract stays easy to maintain

## Scorecard
- Dimensions covered: maintainability
- Files reviewed: 4
- New findings: P0=0 P1=0 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P0 - Blocker
- None.

### P1 - Required
- None.

### P2 - Suggestion
- **F003** *(maintainability)*: Public Tier 3 contract still mixes `drop` with `drop_candidate` — `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1273-1288`, `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:582-585`, `implementation-summary.md:59` — The prompt declares eight canonical categories ending in `drop`, but the bullet list and frozen test still teach `drop_candidate`, which keeps the public contract and internal aliasing vocabulary out of sync.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1273-1288`, `implementation-summary.md:59` | Runtime docs and packet docs disagree on the published name of the eighth category. |
| checklist_evidence | partial | hard | `checklist.md:75`, `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:582-585` | CHK-041 overstates category alignment because the frozen prompt still expects the alias term. |
| feature_catalog_code | notApplicable | advisory | — | No feature catalog surface in scope. |
| playbook_capability | notApplicable | advisory | — | No packet-local playbook artifact in scope. |

## Assessment
- New findings ratio: 1.00
- Dimensions addressed: maintainability
- Novelty justification: first pass that compared the public prompt wording, the frozen test contract, and the packet summary language in one place

## Ruled Out
- This is not a current runtime failure because the alias is normalized before surfaced decisions are emitted (`.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1205-1207`).

## Dead Ends
- No packet-local artifact documented the alias intentionally, so the mixed vocabulary still reads as accidental drift.

## Recommended Next Focus
Return to correctness and decide whether F001 still holds after checking the implementation summary and checklist language.
