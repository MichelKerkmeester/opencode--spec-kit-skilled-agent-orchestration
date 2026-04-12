---
title: "Deep Review Iteration 010 - D1/D2/D4 Schema and Backfill Stabilization"
iteration: 010
dimension: D1 Correctness / D2 Security / D4 Maintainability
session_id: 2026-04-12T17:20:00Z-011-spec-folder-graph-metadata
timestamp: 2026-04-12T17:22:00Z
status: insight
---

# Review Iteration 10: D1/D2/D4 - Schema and Backfill Stabilization

## Focus
Confirm whether the advisory from iteration 9 is isolated to output quality or hints at a deeper schema/backfill correctness issue.

## Scope
- Review target: `graph-metadata-schema.ts`, `backfill-graph-metadata.ts`, `graph-metadata-parser.ts`
- Spec refs: packet `011` graph metadata contract
- Dimension: correctness, security, maintainability

## Scorecard
| File | Corr | Sec | Trace | Maint |
|------|------|-----|-------|-------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts` | 9 | 10 | 9 | 9 |
| `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts` | 9 | 10 | 9 | 8 |
| `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts` | 8 | 10 | 8 | 7 |

## Findings
### P0 - Blockers
None.

### P1 - Required
None.

### P2 - Suggestions
None new. `DR-011-I009-P2-001` remains the only active advisory after the stabilization pass.

## Cross-Reference Results
- Confirmed: The schema version, required fields, manual/derived split, and backfill traversal all look correct in the reviewed code.
- Contradictions: The remaining issue is limited to noisy file/entity derivation, not the schema or refresh/backfill contract itself.
- Unknowns: none

## Ruled Out
- No unsafe manual-field overwrite or cross-packet leakage was found in the reviewed merge/backfill paths.

## Sources Reviewed
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts:7-54]
- [SOURCE: .opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:139-177]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:418-471]

## Assessment
- Confirmed findings: 1
- New findings ratio: 0.00
- noveltyJustification: The second pass added no new correctness failures and stabilized the advisory as a metadata-quality issue only.
- Dimensions addressed: correctness, security, maintainability

## Reflection
- What worked: Rechecking the schema and backfill code prevented the advisory from being over-escalated.
- What did not work: None.
- Next adjustment: Close out the batch with a local state tracker and packet verification sweep.
