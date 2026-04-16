# Review Iteration 003: Traceability - Gate B Packet Still Requires Removed Archive-Ranking Work

## Focus
Verify that the Gate B packet now describes the cleaned-up runtime accurately, and flag any remaining spec-to-code contradictions created by the remediation.

## Scope
- Review target: Gate B `spec.md`, `tasks.md`, `implementation-summary.md`, `stage2-fusion.ts`, and `memory-crud-stats.ts`
- Dimension: traceability

## Scorecard
| File | Corr | Sec | Trace | Maint |
|------|------|-----|-------|-------|
| `002-gate-b-foundation/spec.md` | 6 | 8 | 4 | 5 |
| `002-gate-b-foundation/tasks.md` | 8 | 8 | 8 | 8 |
| `002-gate-b-foundation/implementation-summary.md` | 8 | 8 | 8 | 8 |
| `stage2-fusion.ts` | 8 | 8 | 8 | 7 |
| `memory-crud-stats.ts` | 8 | 8 | 8 | 7 |

## Findings
### P1-001: Gate B `spec.md` still mandates removed archive-ranking and `archived_hit_rate` behavior
- Dimension: traceability
- Evidence: the live Gate B spec still promises archive-ranking behavior and archived-hit telemetry in the active requirements/success criteria, including archive demotion work and `archived_hit_rate` rollout outputs [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/002-gate-b-foundation/spec.md:63] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/002-gate-b-foundation/spec.md:65] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/002-gate-b-foundation/spec.md:118] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/002-gate-b-foundation/spec.md:119]. But the same packet now marks that work N/A in `tasks.md` [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/002-gate-b-foundation/tasks.md:76] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/002-gate-b-foundation/tasks.md:78], and `implementation-summary.md` explicitly records that archive-ranking penalty work and the `archived_hit_rate` metric were removed from the final change set [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/002-gate-b-foundation/implementation-summary.md:149] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/002-gate-b-foundation/implementation-summary.md:150]. The current runtime also no longer contains those branches: `stage2-fusion.ts` documents the active scoring inputs without an archive-weighting stage [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:17], and `memory-crud-stats.ts` exposes aggregate CRUD and folder-ranking stats without any `archived_hit_rate` field [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:177].
- Impact: the packet is self-contradictory post-remediation, so future follow-up work can incorrectly treat the cleaned-up runtime as incomplete or try to resurrect removed rollout requirements.
- Why this is not P2: this is not cosmetic wording drift; it changes the declared contract for what Gate B is supposed to ship and validate.
- Final severity: P1

## Claim Adjudication
- Claim: "Gate B packet matches the cleaned-up post-remediation runtime."
- Evidence for claim: `tasks.md` and `implementation-summary.md` both record the cleanup, and the inspected runtime no longer includes archive-ranking or `archived_hit_rate`.
- Strongest counter-evidence: `spec.md` still requires those removed behaviors in live requirement/success-criteria sections.
- Referee decision: claim rejected. The packet remains materially inconsistent until `spec.md` is updated.

## Cross-Reference Results
### Core Protocols
- Confirmed: `tasks.md` and `implementation-summary.md` consistently describe the cleaned-up runtime.
- Contradictions: `spec.md` still requires removed archive-ranking and `archived_hit_rate` behavior.
- Unknowns: none

### Overlay Protocols
- Confirmed: none relevant in this slice
- Contradictions: none
- Unknowns: none

## Ruled Out
- Archive-weighting still active in `stage2-fusion.ts`: ruled out by direct review of the current scoring pipeline description.
- `archived_hit_rate` still emitted from `memory-crud-stats.ts`: ruled out by direct review of the current stats result shape.

## Sources Reviewed
- [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/002-gate-b-foundation/spec.md:63]
- [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/002-gate-b-foundation/spec.md:65]
- [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/002-gate-b-foundation/spec.md:118]
- [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/002-gate-b-foundation/spec.md:119]
- [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/002-gate-b-foundation/tasks.md:76]
- [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/002-gate-b-foundation/tasks.md:78]
- [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/002-gate-b-foundation/implementation-summary.md:149]
- [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/002-gate-b-foundation/implementation-summary.md:150]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:17]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:177]

## Assessment
- Confirmed findings: 1
- New findings ratio: 0.50
- noveltyJustification: The runtime bug is fixed, but this iteration found a new post-remediation packet contradiction that can still misdirect future work.
- Dimensions addressed: traceability

## Reflection
- What worked: checking the spec against both the implementation summary and the live runtime exposed a real residual contract mismatch.
- What did not work: assuming the packet cleanup was complete because the code and tasks were already aligned would have missed the stale spec requirements.
- Next adjustment: move to Gate C and validate the write-path routing plus fail-closed guardrails that were remediated there.
