# Review Iteration 009: Correctness - Shared-Memory Removal vs Live Schema

## Focus
Reviewed whether Gate F’s cleanup-verification closeout really supports the operator requirement that shared memory is completely removed from the live codebase.

## Scope
- Review target: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/006-gate-f-archive-permanence/implementation-summary.md`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/006-gate-f-archive-permanence/checklist.md`
- Spec refs: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/006-gate-f-archive-permanence/spec.md`
- Dimension: correctness

## Scorecard
| File | Corr | Sec | Trace | Maint |
|------|------|-----|-------|-------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts` | 6 | 8 | 5 | 6 |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/006-gate-f-archive-permanence/implementation-summary.md` | 7 | 8 | 5 | 6 |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/006-gate-f-archive-permanence/checklist.md` | 7 | 8 | 5 | 6 |

## Findings
### P1-006-001: Shared-memory cleanup is not complete while `shared_space_id` remains in the active schema
- Dimension: correctness
- Evidence: the active schema migration and create-table paths still add and define `shared_space_id` [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1449] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2304]
- Cross-reference: Gate F’s code-verification closeout marks cleanup as complete after checking archived-tier residue only [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/006-gate-f-archive-permanence/implementation-summary.md:108] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/006-gate-f-archive-permanence/checklist.md:49]
- Impact: future schema/bootstrap work still carries a shared-memory compatibility surface, so “shared memory completely removed” is not yet true.
- Skeptic: the column is commented as unused after Phase 018/010 removal, so retaining it may be intentional schema compatibility baggage.
- Referee: compatibility retention is acceptable only if the cleanup packet acknowledges that residue explicitly; the current Gate F closeout reads as if cleanup is complete and leaves the surviving shared-space surface unstated.
- Final severity: P1

```json
{"type":"claim-adjudication","claim":"Shared-memory cleanup is incomplete because `shared_space_id` still exists in the active schema and migration path while Gate F closeout text reads as complete.","evidenceRefs":[".opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1449",".opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2304",".opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/006-gate-f-archive-permanence/implementation-summary.md:108",".opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/006-gate-f-archive-permanence/checklist.md:49"],"counterevidenceSought":"Checked whether Gate F already calls out surviving shared-space compatibility residue or scopes it as an accepted exception.","alternativeExplanation":"`shared_space_id` is deliberate compatibility baggage rather than a functional shared-memory feature, but the cleanup packet still needs to say that explicitly.","finalSeverity":"P1","confidence":0.93,"downgradeTrigger":"Gate F documentation is updated to acknowledge `shared_space_id` as an intentional retained compatibility column rather than implying shared-memory cleanup is complete."}
```

## Cross-Reference Results
### Core Protocols
- Confirmed: Gate F correctly records the archived-tier and stale-memory cleanup checks it actually ran.
- Contradictions: the packet’s “cleanup complete” framing does not mention the surviving shared-space schema residue.
- Unknowns: none.

### Overlay Protocols
- Confirmed: no live `shared_memory`, `HYDRA`, or `archival-manager` identifiers remain in the scoped runtime files.
- Contradictions: `shared_space_id` remains and is still live code, not just historical commentary.
- Unknowns: none.

## Ruled Out
- The surviving shared-memory residue is only in packet prose and not in live code.
- Gate F already documents `shared_space_id` as an intentional retained compatibility field.

## Sources Reviewed
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1449]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2304]
- [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/006-gate-f-archive-permanence/implementation-summary.md:108]
- [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/006-gate-f-archive-permanence/checklist.md:49]
- [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/006-gate-f-archive-permanence/spec.md:51]

## Assessment
- Confirmed findings: 1
- New findings ratio: 1.00
- noveltyJustification: The pass surfaced a fully new P1 by comparing the live schema to the Gate F closeout text and checklist.
- Dimensions addressed: correctness, traceability

## Reflection
- What worked: searching for `shared_space` instead of only `shared_memory` caught the remaining cleanup residue quickly.
- What did not work: the packet’s archived-tier framing was too narrow to make the shared-space residue obvious without reading the schema directly.
- Next adjustment: finish with a live DB/filesystem recheck and re-verify the archived-tier runtime files so the batch closes with both the one miss and the confirmed passes.
