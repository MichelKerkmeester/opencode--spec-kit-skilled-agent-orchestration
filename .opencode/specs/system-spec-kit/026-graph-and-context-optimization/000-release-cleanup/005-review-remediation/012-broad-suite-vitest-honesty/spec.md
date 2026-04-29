---
title: "Spec: Broad-Suite Vitest Honesty (Tier 3 / F-005)"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "Investigate broad-suite vitest hangs/failures, document actual state honestly, either fix or scope-down 026's overstated claim. Closes 011 deep-review F-005."
trigger_phrases:
  - "012-broad-suite-vitest-honesty"
  - "broad suite vitest investigation"
  - "F-005 vitest honesty"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/012-broad-suite-vitest-honesty"
    last_updated_at: "2026-04-29T12:25:00Z"
    last_updated_by: "codex-gpt-5.5"
    recent_action: "Completed broad Vitest investigation and corrected 026's verification claim"
    next_safe_action: "Run final strict validators and close F-005"
    blockers: []
    completion_pct: 100
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Spec: Broad-Suite Vitest Honesty

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-04-29 |
| **Branch** | `main` |
| **Parent** | `005-review-remediation` |
| **Source** | 011 deep-review F-005 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Packet 026's `implementation-summary.md:58, 133` claims "all Vitest green" / "full Vitest pass." The 011 deep-review reproduced broad-suite failures or hangs and flagged this as F-005 P1 traceability. An earlier in-session attempt to run `npx vitest run` from this conversation also hung past 10 minutes with 0 bytes of output, requiring a forced kill.

Targeted vitest suites (`tests/handler-memory-search-live-envelope`, `tests/search-quality/`, `tests/graph-readiness-mapper`, `tests/handler-memory-crud`, `tests/memory-search-integration`, `scripts/tests/review-research-paths`) ARE green. So the regression is in some non-targeted slice of the broad suite — but its identity is unknown.

### Purpose

Investigate. Identify whether broad-suite Vitest hangs are:
- Pre-existing (unrelated to today's batch)
- Side-effects of 026's scaffolding cleanup
- Race / resource issues unrelated to code (e.g., environment, parallelism)
- Real bugs requiring a fix

Either remediate the failures OR honestly scope-down 026's claim with documented limitations.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Run `npx vitest run` with progressive scope (file pattern → directory → full) and report-style logging to identify which test files fail or hang.
- Diff against pre-026 git state if needed to isolate cause.
- For each failing/hanging test:
  - Determine if it's pre-existing (was failing before today's commits) or 026-induced
  - Document the failure mode (assertion fail vs hang vs OOM vs config error)
  - Fix if surgical (≤ 50 LOC) and clearly 026-induced
      - Otherwise scope-down the 026 implementation summary to honestly list "broad-suite N test files have pre-existing/unrelated failures; targeted suites all pass"
- Update 026's claim with the actual numbers (X passed / Y failed / Z hung).

### Out of Scope

- Refactoring tests for non-026 reasons (defer)
- Touching today's other packets' implementation summaries beyond 026
- Re-running stress tests
- Test infrastructure overhauls (vitest config, parallelism settings) unless directly causing failures

### Files to Change

| File | Action |
|------|--------|
| `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/026-readiness-scaffolding-cleanup/implementation-summary.md` | Edit — honest test-suite state |
| `mcp_server/tests/<failing-test-files>` (if surgical fix) | Edit |
| `mcp_server/<runtime-files>` (if real bug found) | Edit |
| Packet's own plan.md, tasks.md, checklist.md, implementation-summary.md | Create |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (none initially; could surface)

### P1 — Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Reproducible vitest invocation that exits cleanly. | A documented command produces a numeric pass/fail count without hanging > 5 min. May require excludes or batching. |
| REQ-002 | Honest test-state inventory. | List of every test file: PASS / FAIL / HANG / SKIP. |
| REQ-003 | 026's claim corrected. | The 026 implementation summary no longer claims "all Vitest green" beyond what's actually true. Either: (a) full suite is green and claim stands, OR (b) claim is scoped to targeted suites with explicit list of unrelated failures. |
| REQ-004 | Real bugs (if any) fixed or escalated. | Any 026-induced failure is either fixed in this packet or escalated as P0 follow-up with file:line root cause. |
| REQ-005 | Strict validator green on this packet. | `validate.sh <packet> --strict` exits 0. |

### Acceptance Scenarios

1. **Given** a future reviewer reads the 026 implementation summary, **when** they look at Verification, **then** they see honest pass/fail counts that match what `npx vitest run` actually produces.
2. **Given** any failure is 026-induced, **when** this packet completes, **then** the failure is fixed and the original test passes.
3. **Given** a full-suite run hangs, **when** this packet completes, **then** the implementation summary identifies the bounded timeout and the narrowed suspect slice.
4. **Given** a failure is pre-existing or environment-specific, **when** this packet completes, **then** the failure is documented without modifying unrelated tests.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Vitest broad-suite invocation produces numeric output (pass/fail counts).
- **SC-002**: 026's claim is accurate post-update.
- **SC-003**: Strict validator green.
- **SC-004**: Any 026-induced failures are fixed; pre-existing failures are documented as such.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Risk | Hang is environment-specific (machine state, port collision) | Run in clean shell; document repro steps |
| Risk | Many failures are pre-existing unrelated technical debt | Scope-down 026's claim; track each as separate follow-up if non-trivial |
| Risk | Real bugs surface that require runtime fixes | Escalate as P0 if so; halt and report |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Total investigation runtime ≤ 90 minutes (cli-codex executor budget).

### Reliability
- **NFR-R01**: Every claim in updated 026 doc cites command output or file:line evidence.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- A test file's failure is intermittent (flaky): run 3x, document flake rate, do not falsely call it a hard failure.
- A test file requires environment setup not available locally: document as `SKIPPED:env-unavailable`, not failure.
- Vitest itself errors out at config-loading: that's a P0 — escalate immediately.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Investigation + targeted fixes only |
| Risk | 14/25 | May surface real bugs; halts allowed |
| Research | 10/20 | Diagnostic-heavy first half |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Q1: Should pre-existing failures be batched into a separate follow-up packet? **Default**: yes if > 5; document inline if ≤ 5.
- Q2: If vitest itself is the issue (config / version), should this packet upgrade vitest? **Default**: no — escalate as separate follow-up.
<!-- /ANCHOR:questions -->
