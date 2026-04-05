# Deep Review Strategy — 027-opencode-structural-priming

## 2. TOPIC
Phase 027: OpenCode Structural Priming — Non-Hook Structural Bootstrap Contract.
Defines StructuralBootstrapContract type and buildStructuralBootstrapContract() builder in session-snapshot.ts. Consumed by auto-prime, session_bootstrap, session_resume, and session_health surfaces.

## 3. REVIEW DIMENSIONS (remaining)
- [ ] D1 Correctness — Logic errors, off-by-one, wrong return types, broken invariants
- [ ] D2 Security — Injection, auth bypass, secrets exposure, unsafe deserialization
- [ ] D3 Traceability — Spec/code alignment, checklist evidence, cross-reference integrity
- [ ] D4 Maintainability — Patterns, clarity, documentation quality, safe follow-on change cost

## 4. NON-GOALS
- Phase 026 hook-runtime startup injection (separate scope)
- OpenCode-specific runtime binary behavior
- Full test coverage expansion beyond contract surfaces

## 5. STOP CONDITIONS
- All 4 dimensions reviewed with file-cited evidence
- No P0 or P1 findings remaining active
- Convergence threshold met (newFindingsRatio <= 0.10)

## 6. COMPLETED DIMENSIONS
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|

## 7. RUNNING FINDINGS
- **P0 (Critical):** 0 active
- **P1 (Major):** 0 active
- **P2 (Minor):** 0 active
- **Delta this iteration:** +0 P0, +0 P1, +0 P2

## 8. WHAT WORKED
[First iteration — populated after iteration 1 completes]

## 9. WHAT FAILED
[First iteration — populated after iteration 1 completes]

## 10. EXHAUSTED APPROACHES (do not retry)
[None yet]

## 11. RULED OUT DIRECTIONS
[None yet]

## 12. NEXT FOCUS
D1 Correctness — Start with session-snapshot.ts contract definition, then trace into handler and surface consumers.

## 13. KNOWN CONTEXT
Phase 027 defines the structural bootstrap contract for non-hook runtimes (especially OpenCode).
Key deliverables: StructuralBootstrapContract interface, buildStructuralBootstrapContract() builder.
4 consumer surfaces: auto-prime (memory-surface.ts), session_bootstrap, session_resume, session_health.
First-turn guidance in context-server.ts. Agent definition updates in context-prime.md.
Build status: PASS. Spec validation: PASS (0 errors, 0 warnings).

## 14. CROSS-REFERENCE STATUS
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pending | — | — |
| `checklist_evidence` | core | pending | — | — |
| `skill_agent` | overlay | notApplicable | — | No skill contracts in scope |
| `agent_cross_runtime` | overlay | pending | — | context-prime.md has cross-runtime implications |

## 15. FILES UNDER REVIEW
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| lib/session/session-snapshot.ts | — | — | — | pending |
| hooks/memory-surface.ts | — | — | — | pending |
| handlers/session-bootstrap.ts | — | — | — | pending |
| handlers/session-resume.ts | — | — | — | pending |
| handlers/session-health.ts | — | — | — | pending |
| context-server.ts | — | — | — | pending |
| .opencode/agent/context-prime.md | — | — | — | pending |
| spec.md | — | — | — | pending |
| plan.md | — | — | — | pending |
| tasks.md | — | — | — | pending |
| checklist.md | — | — | — | pending |
| implementation-summary.md | — | — | — | pending |

## 16. REVIEW BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime]
- Started: 2026-04-02T16:00:00Z


## 2026-04-02 Strategy Update

- Review target: `.opencode/specs/system-spec-kit/024-compact-code-graph/027-opencode-structural-priming`
- This pass runs 4 iterations across: correctness, traceability, completeness, synthesis.
- Strict validation status at start: `PASS`.
- Unchecked tasks/checklist: 0/0.
- Existing active review iterations before this pass: 0.
