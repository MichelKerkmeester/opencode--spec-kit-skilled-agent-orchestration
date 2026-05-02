# Iteration 3: Graph Identity Namespace Contracts

## Focus
This pass stayed on security around graph identity generation and cross-session reuse, then rotated into traceability and maintainability on the visible confirm/reference mirrors. I reviewed the coverage-graph upsert path, the confirm YAML graphEvents transforms, and the published state-format references to see whether the session namespace is encoded in the live contract or only carried as an out-of-band parameter.

## Scorecard
- Dimensions covered: [security, traceability, maintainability]
- Files reviewed: 11
- New findings: P0=0 P1=1 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.17

## Findings

### P0 — Blocker
- None.

### P1 — Required
- **F006**: Graph-event namespace contract is still undocumented on the visible path — `.opencode/skill/sk-deep-research/references/state_format.md:145` — The research state-format reference lists optional iteration fields through `sourceStrength` but never documents `graphEvents`, even though the live research confirm workflow requires `graphEvents` objects shaped as raw `{type, id, label, relation?, source?, target?}` and then preserves those IDs unchanged into `deep_loop_graph_upsert` at `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:438` and `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:464-475`. The review side is only slightly better: it names `graphEvents` as an optional field with no schema or namespace guidance at `.opencode/skill/sk-deep-review/references/state_format.md:192-194`, while the confirm mirror still emits raw `{type, id, ...}` events and deduplicates/upserts by bare `id` at `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:597` and `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:658-665`. Because the runtime write layer already keys rows by bare ID (see F004), the missing doc-level namespace contract leaves the session-isolation requirement invisible to operators and makes the collision hazard easy to reintroduce.

### P2 — Suggestion
- None.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | fail | hard | `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/008-further-deep-loop-improvements/spec.md:166` | Phase 008 requires all new JSONL fields and YAML steps to be documented in `state_format.md` and `loop_protocol.md` for each loop family, but the graphEvents/session-namespace contract is absent on research and skeletal on review. |
| confirm_runtime | partial | soft | `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:597` | The confirm mirrors preserve raw graph-event IDs and pass sessionId separately, so the namespace rule exists operationally but not in the payload contract authors are told to emit. |
| state_format | fail | hard | `.opencode/skill/sk-deep-review/references/state_format.md:192` | Review documents the field name only; research does not document `graphEvents` at all. Neither reference explains ID uniqueness or session-scoping expectations. |

## Assessment
- New findings ratio: 0.17
- Dimensions addressed: [security, traceability, maintainability]
- Novelty justification: No second runtime namespace defect surfaced beyond F004; the new evidence is contract-level. This pass shows the remaining risk is concentrated in the live mirrors and reference docs, which still describe graphEvents as raw IDs without the namespace rules needed to keep session isolation understandable and auditable.

## Ruled Out
- In-memory `coverage-graph-core.cjs` edge auto-ID generation: not on the visible deep-loop write path for this bundle — live research/review graph persistence goes through `deep_loop_graph_upsert` from the confirm/auto YAMLs, not through `insertEdge()` in the in-memory helper.

## Dead Ends
- Looking for a second handler-side auth or validation bypass in `mcp_server/handlers/coverage-graph/upsert.ts`: the handler validates `specFolder`, `loopType`, `sessionId`, relation/kind enums, and self-loops, so this pass did not uncover a new security defect there beyond the pre-existing bare-ID storage semantics already captured in F004.

## Recommended Next Focus
Rotate fully into maintainability and traceability on the remaining confirm/reference mirrors, especially places where the visible docs still lag reducer/runtime behavior (graph fields, claim-adjudication, and lifecycle/session metadata examples).
