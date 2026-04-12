# Review Iteration 001: Correctness - Task Update Phase Anchors Through `memory-save.ts`

## Focus
Verify that routed `task_update` content reaches the correct `tasks.md` phase anchor when it flows through the actual Gate C save handler, not just the isolated router helper.

## Scope
- Review target: `content-router.ts`, `memory-save.ts`, Gate C `tasks.md`, and router unit coverage
- Spec refs: [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/003-gate-c-writer-ready/tasks.md:41]
- Dimension: correctness

## Scorecard
| File | Corr | Sec | Trace | Maint |
|------|------|-----|-------|-------|
| `content-router.ts` | 7 | 8 | 8 | 7 |
| `memory-save.ts` | 4 | 8 | 6 | 6 |
| `003-gate-c-writer-ready/tasks.md` | 8 | 8 | 8 | 7 |
| `content-router.vitest.ts` | 8 | 8 | 8 | 7 |

## Findings
### P1-001: Task updates are hardwired to `phase-1` in the save-handler integration
- Dimension: correctness
- Evidence: `content-router.ts` routes `task_update` content to `tasks.md` using `likelyPhaseAnchor` [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:938]. But `memory-save.ts` passes `likely_phase_anchor: 'phase-1'` into the router context unconditionally [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:997]. Gate C’s task ledger has separate `phase-1`, `phase-2`, and `phase-3` anchors [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/003-gate-c-writer-ready/tasks.md:41] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/003-gate-c-writer-ready/tasks.md:53] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/003-gate-c-writer-ready/tasks.md:66]. The router unit test itself expects `phase-2` when the context provides it [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:143].
- Impact: real save-handler task updates can only target `phase-1` unless some other caller-specific override repairs the context first. Updates for later task sections are therefore misrouted or rejected by merge legality, which violates the Gate C contract for routed writer correctness.
- Skeptic: maybe the handler only receives phase-1 task updates in practice, and later phases are updated through a different path.
- Referee: the packet’s own `tasks.md` uses three phase anchors, and the router contract explicitly supports a dynamic `likelyPhaseAnchor`. Hardcoding `phase-1` in the actual integration means the shipped handler cannot satisfy the more general contract that the surrounding code and docs describe.
- Final severity: P1

```json
{"type":"claim-adjudication","claim":"The Gate C save-handler integration hardcodes task-update routing to `phase-1`, so later task sections cannot be targeted correctly through the real writer path.","evidenceRefs":[".opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:938",".opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:997",".opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/003-gate-c-writer-ready/tasks.md:41",".opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/003-gate-c-writer-ready/tasks.md:53",".opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/003-gate-c-writer-ready/tasks.md:66",".opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:143"],"counterevidenceSought":"Checked whether the live handler derives a later phase anchor somewhere else before calling the router or whether the packet uses only one task phase in practice.","alternativeExplanation":"The hardcoded value may have been a temporary fixture left in production code, but it still governs the real save path today.","finalSeverity":"P1","confidence":0.95,"downgradeTrigger":"Downgrade if another pre-router step in the live save path overwrites `likely_phase_anchor` with the correct task section before routing occurs."}
```

## Cross-Reference Results
### Core Protocols
- Confirmed: the router helper is capable of honoring a later `likelyPhaseAnchor`.
- Contradictions: the handler integration hardcodes `phase-1`, which conflicts with the router contract and the packet’s own multi-phase task ledger.
- Unknowns: whether the live caller population ever passes an override that masks this bug.

### Overlay Protocols
- Confirmed: none relevant in this slice
- Contradictions: none beyond the handler/router integration mismatch
- Unknowns: none

## Ruled Out
- Router helper incapable of targeting later phases: ruled out by the unit test expecting `phase-2`.

## Sources Reviewed
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:938]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:997]
- [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/003-gate-c-writer-ready/tasks.md:41]
- [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/003-gate-c-writer-ready/tasks.md:53]
- [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/003-gate-c-writer-ready/tasks.md:66]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:143]

## Assessment
- Confirmed findings: 1
- New findings ratio: 1.00
- noveltyJustification: The first Gate C pass found a live integration bug between the router contract and the actual save-handler wiring.
- Dimensions addressed: correctness

## Reflection
- What worked: comparing the helper contract to the handler wiring immediately exposed the hidden integration assumption.
- What did not work: unit-level confidence around the router masked the real runtime anchor source.
- Next adjustment: verify the validator plan wiring so the remaining review does not over-attribute the problem to unrelated save-path guards.
