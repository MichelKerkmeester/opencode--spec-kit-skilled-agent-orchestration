---
title: "Feature Specification: Manual Testing Playbook Coverage and Run (011) [template:level_2/spec.md]"
description: "Sync manual testing playbook coverage with surfaces shipped by Phase 010 + 010/007 remediation, then execute the affected scenarios via the existing runner and produce a per-scenario + aggregate scorecard."
trigger_phrases:
  - "011 playbook coverage and run"
  - "phase 011 manual testing"
  - "playbook scorecard"
  - "manual testing playbook coverage"
  - "playbook revalidation 010"
importance_tier: "important"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-manual-testing-playbook-coverage-and-run"
    last_updated_at: "2026-04-25T19:10:00Z"
    last_updated_by: "claude-opus-4-7-orchestrator"
    recent_action: "Initialized 011 spec folder. Phase scaffolding (spec/plan/tasks/checklist) in progress; scenario edits + runner pass not yet started."
    next_safe_action: "Write plan.md / tasks.md / checklist.md, then update playbook scenarios 014/026/199/203 and run manual-playbook-runner with targeted filters."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "../../../../skill/system-spec-kit/manual_testing_playbook/03--discovery/014-detect-changes-preflight.md"
      - "../../../../skill/system-spec-kit/manual_testing_playbook/06--analysis/026-code-graph-edge-explanation-blast-radius-uplift.md"
      - "../../../../skill/system-spec-kit/manual_testing_playbook/11--scoring-and-calibration/199-skill-advisor-affordance-evidence.md"
      - "../../../../skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/203-memory-causal-trust-display.md"
      - "../../../../skill/system-spec-kit/scripts/tests/manual-playbook-runner.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "011-init"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions:
      - "Targeted scope (014/026/199/203) vs all 306 scenarios? — targeted, with broader run as optional follow-up."
---
# Feature Specification: Manual Testing Playbook Coverage and Run (011)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-04-25 |
| **Branch** | `011-manual-testing-playbook-coverage-and-run` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 010 and the 010/007 remediation pass shipped 33 closed findings spanning new operator-facing surfaces (detect_changes MCP tool, blast_radius enrichment, edge reason/step, affordance evidence, trust badges, memory_search causal cache invalidation). The baseline manual-testing-playbook scenarios written by 010/006 were authored before 010/007 hardened those surfaces. Two scenarios (014 detect_changes, 026 blast_radius) are now stale on adversarial paths and on the 010/007-added behaviour (path canonicalization, multi-file diff boundary, minConfidence, overflow detection, multi-subject seed preservation, failureFallback.code, edge reason/step sanitization, cache invalidation). One new scenario (memory_search cache invalidation on causal-edge mutation) is missing. Without this sync, the playbook is reassuring but not actually probing the surfaces operators rely on.

### Purpose
Sync the four affected playbook scenarios with current operator-facing reality, then execute them via the existing `manual-playbook-runner.ts` and produce a per-scenario + aggregate scorecard so the team can answer "do the shipped surfaces actually behave the way the docs claim?" with one number per scenario and a triage note per failure.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Update `manual_testing_playbook/03--discovery/014-detect-changes-preflight.md` with adversarial path-traversal + multi-file diff boundary scenarios.
- Update `manual_testing_playbook/06--analysis/026-code-graph-edge-explanation-blast-radius-uplift.md` with `minConfidence` filter, exact-limit overflow, multi-subject seed preservation, `failureFallback.code` enumeration, and edge `reason`/`step` control-character sanitization.
- Update `manual_testing_playbook/13--memory-quality-and-indexing/203-memory-causal-trust-display.md` with cache-invalidation-on-causal-edge-mutation scenario.
- Confirm (read-then-edit-only-if-needed) `manual_testing_playbook/11--scoring-and-calibration/199-skill-advisor-affordance-evidence.md` covers debug counters; extend if absent.
- Execute the runner against the four targeted scenarios.
- Record per-scenario verdicts + aggregate scorecard in `implementation-summary.md`.

### Out of Scope
- Re-running all 306 scenarios across all 22 categories — available as optional follow-up; not the deliverable here.
- Adding new playbook *categories* — scope is "extend existing entries", not "introduce new sections".
- Adding numerical-rubric scoring beyond `PASS / FAIL / SKIP / UNAUTOMATABLE` step counts — separate phase if desired.
- Modifying any code under `mcp_server/` — the surfaces under test are already shipped + verified (010/007 commit `d0b6a5ec8`). The runner itself may receive a *minor* CLI extension if needed for filter ergonomics; recorded as risk in §6.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `manual_testing_playbook/03--discovery/014-detect-changes-preflight.md` | Modify | Add 2 adversarial scenarios (path traversal, multi-file boundary) |
| `manual_testing_playbook/06--analysis/026-code-graph-edge-explanation-blast-radius-uplift.md` | Modify | Add 5 scenarios (minConfidence, overflow, seed preservation, failureFallback.code, control-char sanitization) |
| `manual_testing_playbook/13--memory-quality-and-indexing/203-memory-causal-trust-display.md` | Modify | Add cache-invalidation scenario |
| `manual_testing_playbook/11--scoring-and-calibration/199-skill-advisor-affordance-evidence.md` | Modify (conditional) | Add debug-counter scenario if missing |
| `011-manual-testing-playbook-coverage-and-run/scratch/manual-playbook-results/` | Create | Runner JSON output (gitignored or committed per project convention) |
| `011-manual-testing-playbook-coverage-and-run/implementation-summary.md` | Create | Scorecard + triage notes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Sync 014 detect_changes preflight scenario with 010/007/T-D hardening | Scenario file contains an explicit "adversarial path traversal" step and a "multi-file diff boundary" step, each with prompt, commands, expected signals, and pass/fail. |
| REQ-002 | Sync 026 graph query / blast_radius scenario with 010/007/T-C + T-D + T-F changes | Scenario file contains explicit steps for `minConfidence`, exact-limit overflow detection, multi-subject seed preservation, all 5 `failureFallback.code` values, and edge `reason`/`step` control-character sanitization. |
| REQ-003 | Add cache-invalidation-on-causal-edge-mutation scenario to 203 trust badges | Scenario file contains a step that calls `memory_search` with `enableCausalBoost=true`, mutates causal edges via `memory_causal_link`, re-calls `memory_search`, and asserts the second call hits a fresh cache key (cache miss / new fingerprint). |
| REQ-004 | Run targeted scenarios via `manual-playbook-runner.ts` | Runner produces `manual-playbook-results.json` containing 4 scenarios with `status` and step-level breakdowns; output written under `011/scratch/manual-playbook-results/`. |
| REQ-005 | Record scorecard in `implementation-summary.md` | Implementation-summary contains a per-scenario table (Steps / PASS / FAIL / SKIP / UNAUTOMATABLE / Verdict), an aggregate row, and a triage note for any FAIL. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Confirm 199 affordance evidence scenario covers debug counters | Either the file already contains a `received / accepted / dropped_unsafe / dropped_empty / dropped_unknown_skill` assertion (then no edit needed), or one is added. |
| REQ-007 | No regression in automated test suites | `tsc --noEmit` clean; canonical phase-010 11-file vitest suite passes 175/175; Python `test_skill_advisor.py` passes 57/57. |
| REQ-008 | Spec validation | `validate.sh --strict` reports either PASSED or FAILED-COSMETIC (template-section conformance) for the 011 spec folder; no contract violations. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All four targeted scenarios run end-to-end through the runner and produce per-step verdicts.
- **SC-002**: Aggregate `automated_coverage_pct = PASS / (PASS + FAIL)` recorded in implementation-summary.md.
- **SC-003**: Zero NEW automated-test regressions (vitest + pytest counts unchanged from 010/007 verification baseline of 175 vitest + 57 pytest).
- **SC-004**: Each FAIL has a triage note classifying root cause as one of: scenario-stale, surface-bug, runner-limitation.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `mcp_server/dist/handlers/index.js` must be built (the runner imports from `dist/`) | Runner crashes on import | Run `tsc` (build, not just `--noEmit`) before invoking runner. |
| Dependency | `MANUAL_PLAYBOOK_FILTER` env var only accepts a single substring | Need 4 separate runner invocations OR a small CLI extension | Default plan: 4 sequential runs with results merged. Extend runner only if 4-run merging proves brittle. |
| Risk | `failureFallback.code: compute_error` is hard to trigger from clean DB | Scenario step could be UNAUTOMATABLE | Use the existing `code-graph-query-handler.vitest.ts` fault-injection fixtures as reference; if not directly invocable from playbook, mark UNAUTOMATABLE with explicit reason. |
| Risk | `enableCausalBoost=true` cache scenario needs causal edges seeded | Step PASSes vacuously if no edges exist | Add explicit setup step that seeds 1-2 edges via `memory_causal_link` before assertion; teardown via `memory_causal_unlink` (or fixture reset). |
| Risk | Operator may want broader run (all 306 scenarios) | Plan documents this as out-of-scope; if requested, separate follow-up | Plan §9 explicitly notes broader run is available as a follow-up; targeted scope is faster and surfaces 010-specific regressions cleanly. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Targeted runner pass completes in under 5 minutes wall-clock (4 scenarios × handful of steps each).
- **NFR-P02**: Spec-doc edits stay under 1 hour total.

### Security
- **NFR-S01**: Adversarial path-traversal step in 014 must NOT actually escape the workspace — even if the runner's MCP server has loose sandboxing, the assertion is on `status: 'parse_error'` + `blockedReason`, not on a successful filesystem read.
- **NFR-S02**: Control-character injection in 026 (R-007-P2-3 scenario) writes raw bytes via direct DB statement; teardown must restore the row to a sanitized state OR run against a per-test isolated DB.

### Reliability
- **NFR-R01**: Each scenario is independently executable; failure of one does NOT block subsequent scenarios.
- **NFR-R02**: Runner output is JSON-stable so the scorecard can be regenerated from `manual-playbook-results.json` without re-running.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty diff input to `detect_changes`: existing scenario covers no-op; new scenario covers unsafe paths.
- `code_graph_query` with `minConfidence: 0`: identical to omitting the parameter — already covered by existing test.
- `code_graph_query` with `minConfidence: 1`: should return only edges with confidence === 1; assert this exact-boundary case.

### Error Scenarios
- DB failure mid-`fetchTrustBadgeSnapshots`: returns `failureReason: 'query_error'` (R-007-P2-11 trace flag); scenario asserts trace metadata visible.
- `compute_error` blast_radius: hard to trigger; if UNAUTOMATABLE, document reason and link to vitest coverage.
- Stale cache after causal-edge mutation: pre-010/007 would return stale-boost results; assertion in new 203 step verifies the cache key changed.

### State Transitions
- Multi-subject blast_radius with mixed resolution: assert `preservedSeedNodes` present, `partialResult: true`, `failureFallback.code: 'unresolved_subject'`.
- Trust-badge merge with caller-supplied partial: assert per-field overlay vs wholesale replacement.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | 4 doc files modified, 1 implementation-summary created, 1 runner pass; no code changes |
| Risk | 6/25 | Adversarial scenarios add complexity; runner already shipped + battle-tested |
| Research | 4/20 | Already complete (Explore agents in plan phase) |
| **Total** | **18/70** | **Level 2** (clearly under 30 P0 / 50 P1 thresholds) |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None at spec-write time. Plan-phase Explore agents resolved playbook structure, runner CLI, and stale-vs-current-coverage classification.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
