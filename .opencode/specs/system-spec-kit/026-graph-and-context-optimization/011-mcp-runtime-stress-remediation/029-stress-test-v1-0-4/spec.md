---
title: "Spec: v1.0.4 Stress Test on Clean Infrastructure"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "Phase K stress cycle v1.0.4: re-run the search/RAG stress matrix on the now-clean post-today infrastructure to validate the v1.0.3 caveats are closed and produce the first apples-to-apples comparison vs the v1.0.2 baseline."
trigger_phrases:
  - "029-stress-test-v1-0-4"
  - "v1.0.4 stress cycle"
  - "phase K stress cycle"
  - "stress test clean infrastructure"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/029-stress-test-v1-0-4"
    last_updated_at: "2026-04-29T12:55:00Z"
    last_updated_by: "codex"
    recent_action: "Stress run complete"
    next_safe_action: "Run strict validator"
    blockers: []
    completion_pct: 100
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Spec: v1.0.4 Stress Test on Clean Infrastructure

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-04-29 |
| **Branch** | `main` |
| **Parent** | `011-mcp-runtime-stress-remediation` |
| **Predecessor cycles** | `001` (v1.0.1), `010` (v1.0.2), `021` (v1.0.3) |
| **Infrastructure dependencies** | All 9 of today's commits (009 docs + 010 gate + 022-028 work) shipped on main |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The v1.0.3 stress test (Phase H, packet 021) produced a CONDITIONAL verdict with three caveats:

1. **Live handler probe blocked** — direct `handleMemorySearch` call hung at the 30s embedding-readiness timeout
2. **Harness fixture-only telemetry** — search-quality harness couldn't natively emit envelope/audit/shadow records; needed a packet-local wrapper
3. **`degradedReadiness` always undefined** — handler didn't populate the envelope's degraded-readiness field

Today's batch closed all three:
- Caveat 1 → fixed by `010-vestigial-embedding-readiness-gate-removal` (`e91d2c7c2`)
- Caveat 2 → fixed by `024-harness-telemetry-export-mode` PP-2 (`c4f738b1d`)
- Caveat 3 → fixed by `025-memory-search-degraded-readiness-wiring` Option C (`bd0de4b6b`)

Plus PP-1 (`023`) shipped the behavioral test pattern that proves the live handler path emits envelope + audit JSONL end-to-end, and `028` ensured deep-review/research synthesis auto-stages the iteration trail.

### Purpose

Re-run the stress test against the now-clean infrastructure to:

1. **Validate** the three caveats are closed (live handler path works; harness emits telemetry natively; degradedReadiness populated)
2. **Measure** real metrics on the new envelope shape (no packet-local wrapper masking the contract)
3. **Compare** apples-to-apples against v1.0.2 baseline (30-cell rubric / 201 / 83.8% / 6 PROVEN / 1 NOT-PROVEN / 0 REGRESSION)
4. **Document** v1.0.4 as the first stress cycle authored under the new sk-doc stress-test pattern (`../../../../../skill/system-spec-kit/feature_catalog/14--stress-testing/01-stress-test-cycle.md`)
5. **Render verdict**: PASS / CONDITIONAL / FAIL on the today's wiring + cleanup arc
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Re-use the existing `mcp_server/stress_test/search-quality/` corpus (frozen at v1.0.3) as the stress fixture
- Run the search-quality harness with `telemetryExportPath` set to capture envelopes + audit + shadow rows natively (PP-2 path)
- Use PP-1's behavioral test pattern: `executePipeline` mocked at the retrieval boundary; `handleMemorySearch` runs as real production code; envelope + `recordSearchDecision` emit naturally
- Capture per-cell scores on the canonical rubric: correctness / robustness / telemetry / regression-safety, 0-2 scale
- Compute aggregate (sum / max-possible × 100) and W4 trigger distribution
- Compare to v1.0.2 baseline + v1.0.3 wiring run + Phase E measurements
- Author `findings-v1-0-4.md` (narrative + per-W verdict + adversarial Hunter→Skeptic→Referee on any REGRESSION)
- Author `findings-rubric-v1-0-4.json` (machine-readable sidecar following the `findings-rubric.template.json` schema)
- Capture telemetry samples under `measurements/v1-0-4-{envelopes,audit-log-sample,shadow-sink-sample}.jsonl` + `summary.json`
- Render final verdict: PASS / CONDITIONAL / FAIL with hasAdvisories flag
- Strict validator green on this packet

### Out of Scope

- New runtime code changes (this is a measurement cycle)
- Modifications to the harness (PP-2 already shipped the export mode)
- Modifications to the corpus (frozen)
- Re-running prior cycles
- Stress-cycle pattern revisions (the 14--stress-testing pattern is the authoritative format)

### Files to Create

| File | Action | Purpose |
|------|--------|---------|
| `findings-v1-0-4.md` | Create | Narrative + per-W verdict + adversarial self-check |
| `findings-rubric-v1-0-4.json` | Create | Machine-readable rubric per `templates/stress-test/findings-rubric.template.json` |
| `measurements/v1-0-4-envelopes.jsonl` | Create | ≥10 envelope samples from harness telemetry export |
| `measurements/v1-0-4-audit-log-sample.jsonl` | Create | ≥10 decision-audit rows |
| `measurements/v1-0-4-shadow-sink-sample.jsonl` | Create | ≥10 shadow records |
| `measurements/v1-0-4-summary.json` | Create | Aggregate metrics + SLA panel + W4 trigger counts |
| `implementation-summary.md` | Create | Verdict + comparison vs v1.0.2/v1.0.3/Phase-E |

### Files to Read (representative)

- v1.0.3 packet: `../021-stress-test-v1-0-3-with-w3-w13-wiring/findings-v1-0-3.md` + measurements
- v1.0.2 packet: `../010-stress-test-rerun-v1-0-2/findings.md` + rubric
- Phase E measurements: `005-review-remediation/007-search-rag-measurement-driven-implementation/measurements/`
- Stress-cycle pattern: `../../../../../skill/system-spec-kit/feature_catalog/14--stress-testing/01-stress-test-cycle.md`
- Manual playbook: `../../../../../skill/system-spec-kit/manual_testing_playbook/14--stress-testing/01-run-stress-cycle.md`
- Templates: `../../../../../skill/system-spec-kit/templates/stress-test/findings-rubric.template.json` + `../../../../../skill/system-spec-kit/templates/stress-test/findings-rubric.schema.md` + `../../../../../skill/system-spec-kit/templates/stress-test/findings.template.md`
- PP-1 test pattern: `mcp_server/tests/handler-memory-search-live-envelope.vitest.ts`
- PP-2 harness export: `mcp_server/stress_test/search-quality/{harness.ts, harness-telemetry-export.vitest.ts}`
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (none)

### P1 — Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Live handler path emits envelope + audit JSONL natively. | At least 1 envelope row produced via `handleMemorySearch` running as real code (not packet-local wrapper); 1 corresponding audit JSONL row appended. |
| REQ-002 | Harness telemetry export mode used. | At least 1 measurement file produced via `telemetryExportPath`, not via packet-local composition. |
| REQ-003 | `degradedReadiness` populated on every envelope. | Sample shows 100% non-undefined `degradedReadiness.freshness`. |
| REQ-004 | W4 real triggers fire on at least 5 cells. | Trigger distribution shows real triggers (`complex-query`, `high-authority`, `weak-evidence`, `multi-channel-weak-margin`, `disagreement:advisor-memory-divergence`); 0% `flag_disabled` / `unknown`. |
| REQ-005 | Findings authored per the new sk-doc stress-test pattern. | `findings-v1-0-4.md` follows the narrative skeleton; `findings-rubric-v1-0-4.json` follows the JSON schema; verdict ladder used (PROVEN/NEUTRAL/REGRESSION/NOT-PROVEN). |
| REQ-006 | Apples-to-apples comparison to v1.0.2. | Same 30-cell shape OR explicit rationale if cell count differs; per-cell delta table; aggregate %. |
| REQ-007 | Adversarial self-check on every REGRESSION. | Any v1.0.4 cell scoring lower than v1.0.2 same-cell triggers Hunter→Skeptic→Referee inline. |
| REQ-008 | Strict validator green on this packet. | `validate.sh <packet> --strict` exits 0. |

### Acceptance Scenarios

1. **Given** the harness runs with `telemetryExportPath` set, **when** the corpus completes, **then** 3 sibling JSONL files exist under `measurements/` with non-zero rows each.
2. **Given** the v1.0.3 caveats are closed, **when** the v1.0.4 envelope sample is inspected, **then** every envelope has `degradedReadiness` populated and at least one envelope is from a live handler call (not synthesized).
3. **Given** v1.0.4 finishes, **when** verdict is rendered, **then** it cites comparison to v1.0.2's 83.8% baseline + v1.0.3's caveat resolution.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 4 measurement files emitted with real data.
- **SC-002**: All 3 v1.0.3 caveats demonstrably closed.
- **SC-003**: Aggregate v1.0.4 % computed; delta vs v1.0.2 stated.
- **SC-004**: Verdict rendered with adversarial self-check on any REGRESSION.
- **SC-005**: Strict validator green.

### Acceptance Scenarios

- **SCN-001**: **Given** the harness telemetry export mode, **when** the cycle completes, **then** zero packet-local wrapper code is required.
- **SCN-002**: **Given** today's wiring closes the v1.0.3 caveats, **when** verdict is computed, **then** PASS or PASS+hasAdvisories is the expected outcome (CONDITIONAL is acceptable if a new finding surfaces; FAIL would be a P0 escalation).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Risk | Live handler invocation requires a non-stub embedding model | Use PP-1's pattern: mock `executePipeline` at retrieval boundary; handler still runs as production code |
| Risk | Harness telemetry export mode has back-compat regressions not yet caught | PP-2's tests verified back-compat; if issue surfaces, fall back to packet-local wrapper for that cell with explicit rationale |
| Risk | A regression vs v1.0.2 surfaces and obligates a fix-then-rerun cycle | Adversarial self-check + clear escalation: REGRESSION findings get P0 if it's a real backslide, P1 if measurement noise |
| Dependency | All 9 of today's commits shipped on main | Verified — `git log --oneline -15` shows 028..009 + remediation tiers |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Stress cycle wall-time ≤ 90 minutes (cli-codex executor budget).
- **NFR-P02**: Measurement files committed; ≤ 5 MB per JSONL file (sample size bounded).

### Reliability
- **NFR-R01**: Every claim in `findings-v1-0-4.md` cites file:line evidence or measurement-file evidence.
- **NFR-R02**: Sample-size guards activated for any percentile/rate claim depending on > 10× sample size.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- A cell that was NOT-PROVEN in v1.0.2 stays NOT-PROVEN in v1.0.4: not a regression; document and continue.
- W4 trigger distribution differs from v1.0.3: expected (real handler vs packet-local runner). Document the shift; treat 100% trigger rate as "trigger reachability proven, not selectivity proven."
- A telemetry file fails to write (filesystem error): treat as P1; note in findings; continue with remaining cells.
- Adversarial self-check flips a P0 to P1 → record dialogue inline.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | Measurement run with 4 file outputs + comparison narrative |
| Risk | 12/25 | No runtime code changes; harness/test infrastructure stable post-PP-1/PP-2 |
| Research | 14/20 | Comparison + adversarial self-check |
| **Total** | **42/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Q1: Should v1.0.4 use the same 30-cell rubric as v1.0.2, or extend? **Default**: same 30-cell shape for direct comparability; extension is a separate v1.0.5+ decision.
- Q2: If v1.0.4 surfaces a P0 REGRESSION, halt + escalate or continue with caveats? **Default**: halt + escalate as new P0; do not author a CONDITIONAL verdict for a real regression.
<!-- /ANCHOR:questions -->
