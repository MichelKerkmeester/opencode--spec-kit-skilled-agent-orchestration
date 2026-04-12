# Review Iteration 001: Correctness - Anchor-aware Causal Edge Semantics

## Focus
Validate that Gate B’s new `source_anchor` / `target_anchor` fields actually preserve distinct continuity edges rather than just annotating a single legacy key.

## Scope
- Review target: `vector-index-schema.ts`, `causal-edges.ts`, `reconsolidation.ts`
- Spec refs: [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/002-gate-b-foundation/spec.md:78]
- Dimension: correctness

## Scorecard
| File | Corr | Sec | Trace | Maint |
|------|------|-----|-------|-------|
| `vector-index-schema.ts` | 4 | 8 | 7 | 6 |
| `causal-edges.ts` | 5 | 8 | 7 | 6 |
| `reconsolidation.ts` | 6 | 8 | 7 | 6 |

## Findings
### P1-001: Anchor-aware causal edges still collapse distinct anchor pairs into a single row
- Dimension: correctness
- Evidence: the schema keeps `UNIQUE(source_id, target_id, relation)` even after adding `source_anchor` and `target_anchor` [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:621]. `insertEdge()` then checks existence and upserts on the same three-column key [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:251] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:267] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:284]. At the same time, `reconsolidation.ts` explicitly derives `sourceAnchor` and `targetAnchor` before `INSERT OR IGNORE` into `causal_edges` [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:962] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:984].
- Impact: two edges between the same memories but different anchors cannot coexist; later writes overwrite or ignore the new anchor-specific provenance, which defeats Gate B’s mixed legacy/post-continuity lineage goal.
- Skeptic: maybe the design intentionally allows only one edge per `(source,target,relation)` and the anchor fields are purely advisory.
- Referee: Gate B’s scope and helper logic say otherwise. The packet calls the new columns part of mixed-edge traversal support, and `reconsolidation.ts` actively computes anchor values. If the persistence layer cannot distinguish anchor pairs, the new provenance is not reliable enough for the stated contract.
- Final severity: P1

```json
{"type":"claim-adjudication","claim":"Gate B's anchor-aware causal edge implementation still collapses multiple anchor-distinct relationships into one logical edge.","evidenceRefs":[".opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:621",".opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:251",".opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:267",".opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:962",".opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:984"],"counterevidenceSought":"Checked whether the schema or write path included anchor columns in the uniqueness key or used a separate dedupe mechanism for distinct anchor pairs.","alternativeExplanation":"The anchor fields may have been intended as best-effort annotations only, but the Gate B packet positions them as part of the migration's correctness story for mixed traversal.","finalSeverity":"P1","confidence":0.94,"downgradeTrigger":"Downgrade if another persistence layer or graph resolver stores multiple anchor-distinct edges without relying on the `(source_id,target_id,relation)` key."}
```

## Cross-Reference Results
### Core Protocols
- Confirmed: Gate B explicitly scopes anchor-aware `causal_edges` updates into schema and storage helpers [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/002-gate-b-foundation/spec.md:78].
- Contradictions: the schema/write key still ignores anchor identity.
- Unknowns: whether a later gate intends to widen the uniqueness model.

### Overlay Protocols
- Confirmed: checkpoint capture appears capable of serializing full `causal_edges` rows.
- Unknowns: whether query-time consumers already assume duplicate anchor-distinct edges can exist.

## Ruled Out
- Checkpoint snapshot dropping anchor columns: ruled out because checkpoint snapshots read `SELECT *` rows for `causal_edges` before compression.

## Sources Reviewed
- [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/002-gate-b-foundation/spec.md:78]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:621]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:251]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:267]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:284]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:962]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:984]

## Assessment
- Confirmed findings: 1
- New findings ratio: 1.00
- noveltyJustification: The first Gate B pass found a concrete mismatch between the promised anchor-aware migration and the persisted edge identity model.
- Dimensions addressed: correctness

## Reflection
- What worked: Following the uniqueness key from schema to upsert path exposed the defect quickly.
- What did not work: Looking only at column existence would have incorrectly marked the migration complete.
- Next adjustment: Compare the complete packet contract against the cleanup narrative to see whether the runtime and docs still agree on what Gate B ships.
