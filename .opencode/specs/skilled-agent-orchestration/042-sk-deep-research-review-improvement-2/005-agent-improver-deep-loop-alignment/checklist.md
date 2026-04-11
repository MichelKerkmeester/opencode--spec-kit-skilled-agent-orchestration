---
title: "Verification Checklist: Agent-Improver Deep-Loop Alignment [005]"
description: "Verification checklist for the 4-sub-phase deep-loop alignment of sk-improve-agent covering runtime truth, improvement intelligence, parallel candidates, and scoring optimization."
trigger_phrases:
  - "005"
  - "agent improver checklist"
  - "improvement verification"
  - "benchmark stability checklist"
importance_tier: "important"
contextType: "planning"
---
# Verification Checklist: Agent-Improver Deep-Loop Alignment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval for deferral |
| **[P2]** | Optional | Can defer with documented reason |

Mark each item `[x]` with evidence in brackets: `[Test: filename - result]`, `[Manual: description]`, `[Review: PR#]`.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] spec.md documents all 13 requirements (REQ-AI-001 through REQ-AI-013) with measurable acceptance criteria
- [ ] CHK-002 [P0] plan.md defines all 4 sub-phases with task breakdown and dependency order
- [ ] CHK-003 [P0] 042 Phase 1 journal schema read and confirmed compatible with improvement events
- [ ] CHK-004 [P0] 042 Phase 2 coverage graph API confirmed to support `loop_type` namespace parameter
- [ ] CHK-005 [P1] Existing sk-improve-agent SKILL.md, improvement_config.json, agent-improver.md read before modification
- [ ] CHK-006 [P1] ADR-005 backward compatibility commitment confirmed: all new config fields are optional with defaults
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] All 5 new CJS scripts (`improvement-journal.cjs`, `mutation-coverage.cjs`, `trade-off-detector.cjs`, `candidate-lineage.cjs`, `benchmark-stability.cjs`) follow existing sk-improve-agent script module pattern
- [ ] CHK-011 [P0] No hardcoded file paths in scripts; all paths pass through config or function arguments
- [ ] CHK-012 [P0] Journal emitter enforces append-only discipline: no overwrite code path exists in improvement-journal.cjs
- [ ] CHK-013 [P1] All new config fields in improvement_config.json have JSDoc comments with type, default, and valid range
- [ ] CHK-014 [P1] Error handling implemented in all scripts: invalid input rejected with descriptive error messages, not silent failures
- [ ] CHK-015 [P1] Coverage graph writer uses `loop_type: "improvement"` namespace on all write operations; no cross-contamination with deep-research/review namespaces
- [ ] CHK-016 [P2] Weight optimizer emits recommendation report file, not auto-applied weights; no code path exists that modifies scoring weights without explicit invocation
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] `improvement-journal.vitest.ts` passes: event emit, append-only enforcement, invalid event rejection, resume journal read, session-ended schema
- [ ] CHK-021 [P0] `mutation-coverage.vitest.ts` passes: namespace isolation, round-trip read/write, exhausted-mutations marking, trajectory minimum data-point enforcement
- [ ] CHK-022 [P0] `trade-off-detector.vitest.ts` passes: threshold crossing detection, no-event-when-below-threshold, configurable thresholds, empty trajectory handling
- [ ] CHK-023 [P0] `candidate-lineage.vitest.ts` passes: node creation, parent-child linkage, root-to-leaf traversal, wave-index assignment
- [ ] CHK-024 [P0] `benchmark-stability.vitest.ts` passes: stability coefficient math (perfect = 1.0), warning threshold triggering, weight recommendation report format
- [ ] CHK-025 [P0] All 5 Vitest suites pass with zero failures across 3 consecutive runs (no flaky tests)
- [ ] CHK-026 [P1] Manual integration test: run a complete improvement session and confirm journal file contains all required event types
- [ ] CHK-027 [P1] Manual backward-compatibility test: run improvement session without any new config fields; confirm identical behavior to pre-phase
- [ ] CHK-028 [P1] Parallel wave gate test: run with `parallelWaves.enabled: false` (default); confirm single-wave behavior and no lineage graph written
- [ ] CHK-029 [P2] Benchmark stability replay test: replay identical benchmark input 3 times; confirm stability coefficients are reported and consistent
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets, API keys, or credentials in any new script or config file
- [ ] CHK-031 [P0] Journal file paths validated before write: no path traversal possible via session-id input
- [ ] CHK-032 [P1] Coverage graph file paths validated before read/write: no arbitrary filesystem access via loop_type parameter
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P0] SKILL.md updated with stop-reason taxonomy, journal protocol, coverage graph, trajectory, trade-off, parallel wave, and weight optimizer sections
- [ ] CHK-041 [P0] improvement_charter.md updated with audit trail obligations for orchestrator
- [ ] CHK-042 [P0] improvement_strategy.md updated with trajectory-based convergence criteria and trade-off resolution guidance
- [ ] CHK-043 [P1] agent-improver.md updated with legal-stop gate protocol and parallel wave orchestration branch
- [ ] CHK-044 [P1] agent.md command updated with resume/session-id semantics and weight optimizer invocation guidance
- [ ] CHK-045 [P1] All 5 ADRs in decision-record.md marked Accepted with full rationale and alternatives
- [ ] CHK-046 [P2] improvement_config.json fields documented with JSDoc-style inline comments
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] All 5 new scripts placed in `.opencode/skill/sk-improve-agent/scripts/`
- [ ] CHK-051 [P1] All 5 new test suites placed in `.opencode/skill/sk-improve-agent/scripts/tests/`
- [ ] CHK-052 [P1] No test files or debug artifacts left in skill root or assets directories
- [ ] CHK-053 [P2] scratch/ cleared of temporary analysis files before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 18 | 0/18 |
| P1 Items | 14 | 0/14 |
| P2 Items | 5 | 0/5 |

**Verification Date**: [YYYY-MM-DD]
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] ADR-001 (journal emission in orchestrator) documented in decision-record.md and enforced: no journal write calls exist inside the agent-improver proposal agent
- [ ] CHK-101 [P0] ADR-002 (coverage graph namespace reuse) documented: `loop_type: "improvement"` confirmed in mutation-coverage.cjs; no separate graph infrastructure created
- [ ] CHK-102 [P1] ADR-003 (trajectory as convergence signal) documented: minimum 3 data-point requirement enforced in mutation-coverage.cjs and SKILL.md
- [ ] CHK-103 [P1] ADR-004 (parallel candidates opt-in) documented: `parallelWaves.enabled: false` default confirmed in improvement_config.json; gate check present in agent-improver.md
- [ ] CHK-104 [P1] ADR-005 (backward compatibility) documented: all new config fields optional with defaults; verified by backward-compat manual test (CHK-027)
- [ ] CHK-105 [P2] Alternatives rejected in each ADR are documented with specific rejection rationale (not generic)
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Journal append operations complete in under 50ms per event (NFR-P01) — measure with timing in integration test
- [ ] CHK-111 [P1] Coverage graph read/write adds no more than 100ms total overhead per iteration (NFR-P02) — measure with timing in integration test
- [ ] CHK-112 [P2] Scripts are idempotent: running with identical input twice produces identical output (NFR-R02)
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure documented in plan.md and verified: reverting 6 modified files and removing 5 new scripts fully restores prior behavior
- [ ] CHK-121 [P1] All new scripts are additive: not imported by existing sk-improve-agent code paths unless SKILL.md is updated to reference them
- [ ] CHK-122 [P1] New config fields confirmed optional: improvement session runs without them without error
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] Proposal-only constraint verified: agent-improver agent makes no direct filesystem writes; all state mutations go through orchestrator-called scripts
- [ ] CHK-131 [P1] Append-only journal discipline verified: no code path in improvement-journal.cjs opens files in overwrite mode
- [ ] CHK-132 [P2] Weight optimizer approval gate verified: no auto-apply code path exists; recommendations require explicit invocation to apply
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] spec.md, plan.md, tasks.md, checklist.md, decision-record.md all synchronized: requirements referenced consistently across documents
- [ ] CHK-141 [P1] Implementation summary placeholder in place for post-implementation completion
- [ ] CHK-142 [P2] Cross-reference links in spec.md RELATED DOCUMENTS section verified to resolve to existing files
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| michelkerkmeester-barter | Technical Lead | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
