# Review Iteration 002: Correctness - Anchor-Aware Causal Edge Identity

## Focus
Verify that the Gate B remediation actually fixed the anchor-aware identity bug in runtime code, not just the review packet narrative.

## Scope
- Review target: `vector-index-schema.ts`, `causal-edges.ts`, and `reconsolidation.ts`
- Dimension: correctness

## Scorecard
| File | Corr | Sec | Trace | Maint |
|------|------|-----|-------|-------|
| `vector-index-schema.ts` | 9 | 8 | 8 | 8 |
| `causal-edges.ts` | 9 | 8 | 8 | 8 |
| `reconsolidation.ts` | 8 | 8 | 7 | 7 |

## Findings
- No new P0/P1/P2 findings confirmed in this iteration.

## Cross-Reference Results
### Core Protocols
- Confirmed: the `causal_edges` rebuild now uses `UNIQUE(source_id, target_id, relation, source_anchor, target_anchor)` so anchor-distinct edges no longer share the same identity key [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1286].
- Confirmed: the live read/update path now qualifies edge lookups with `COALESCE(source_anchor, '')` and `COALESCE(target_anchor, '')`, so inserts and updates preserve anchor identity in both existence checks and writes [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:267] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:291].
- Confirmed: reconsolidation now writes source/target anchors when it creates supersedes edges, so the upstream producer matches the new schema/read path [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:973] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:979].
- Contradictions: none
- Unknowns: none

### Overlay Protocols
- Confirmed: none relevant in this slice
- Contradictions: none
- Unknowns: none

## Ruled Out
- Prior anchor-collapse defect: ruled out because the schema key and runtime lookup/update path now both include source/target anchors.
- Supersedes-edge anchor omission: ruled out because reconsolidation explicitly passes `source_anchor` and `target_anchor` into the insert payload.

## Sources Reviewed
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1286]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1313]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:267]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:291]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:973]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:979]

## Assessment
- Confirmed findings: 0
- New findings ratio: 0.00
- noveltyJustification: This iteration added only high-confidence runtime confirmation; it did not surface a new defect.
- Dimensions addressed: correctness

## Reflection
- What worked: reviewing the schema migration, storage path, and reconsolidation writer together gave a full end-to-end proof that the remediation landed.
- What did not work: relying on packet summaries alone would not have proved the live identity path is fixed.
- Next adjustment: move from runtime correctness to packet/runtime traceability, because post-remediation drift can still leave the gate misleading.
