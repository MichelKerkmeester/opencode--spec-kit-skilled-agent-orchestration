---
title: Deep Research Strategy - 020 W3-W7 Verification & Expansion
description: Final running brain for the 10-iter deep research loop on W3-W7 verification, adjacency, expansion, and empty-folder audit.
status: complete
---

# Deep Research Strategy - 020

## 1. Charter

- Topic: W3-W7 verification + adjacent/connecting opportunities + enterprise-readiness expansion + empty-folder audit.
- Iterations completed: 10 of 10.
- Stop reason: max iteration count reached; convergence did not trigger.
- Executor context: requested cli-codex `gpt-5.5` reasoning=xhigh, normal/default tier. In this runtime, recursive Codex CLI invocation was not used; research was executed directly with externalized state.

## 2. Iteration Focus Map

| Iter | Focus | RQ | Status | newInfoRatio |
|------|-------|----|--------|--------------|
| 1 | W3 trust tree wiring audit | RQ1 | Complete | 0.92 |
| 2 | W4 conditional rerank wiring | RQ2 | Complete | 0.84 |
| 3 | W5 shadow learned weights data pipeline | RQ3 | Complete | 0.78 |
| 4 | W6 CocoIndex adaptive overfetch promotion candidacy | RQ4 | Complete | 0.69 |
| 5 | W7 degraded-readiness coverage gap analysis | RQ5 | Complete | 0.62 |
| 6 | Cross-W composition opportunities | RQ6 | Complete | 0.49 |
| 7 | Adjacent pipeline integration | RQ7 | Complete | 0.39 |
| 8 | Empty/dead folder audit | RQ8 | Complete | 0.30 |
| 9 | Enterprise-readiness gap analysis | RQ9 | Complete | 0.22 |
| 10 | Expansion candidates + synthesis | RQ10 | Complete | 0.14 |

## 3. Known Context After Research

### Phase C-E baseline

- Phase C correctly recommended measurement-first optimization.
- Phase D added the search-quality harness and telemetry-only QueryPlan foundation.
- Phase E produced W3-W7 measured artifacts and shipped W4 default-on after commit `74b6ef6b8`.

### W3-W7 final posture

- W3 trust tree: helper and tests exist, but no production consumer.
- W4 conditional rerank: production-wired through `memory_search`, but Stage 3 recreates an unknown empty QueryPlan instead of consuming actual QueryPlan telemetry.
- W5 shadow weights: `_shadow` is emitted from `advisor_recommend`, but no durable advisor-learning sink exists and the Python compatibility path drops it.
- W6 CocoIndex calibration: computes duplicate-density telemetry, but no production consumer calls the helper.
- W7 degraded-readiness cells: static search-quality fixture coverage, not real degraded runtime envelope coverage.

## 4. Active Findings

| ID | Severity | Summary | Report Section |
|----|----------|---------|----------------|
| F-W3-001 | P1 | W3 trust tree has zero production consumers. | Active Findings Registry |
| F-W4-001 | P1 | W4 gate is wired but underfed by an empty unknown QueryPlan. | Active Findings Registry |
| F-W5-001 | P1 | W5 shadow diagnostics lack a durable advisor learning sink. | Active Findings Registry |
| F-W6-001 | P1 | W6 calibration telemetry is test-only, not live. | Active Findings Registry |
| F-W7-001 | P1 | W7 stress files are static fixtures, not real degraded-runtime tests. | Active Findings Registry |
| F-XW-001 | P2 | W3-W7 contracts align for a unified SearchDecisionEnvelope. | Integration Insights |
| F-ADJ-001 | P2 | Adjacent pipeline integration is partial and inconsistent. | Integration Insights |
| F-EMPTY-001 | P2 | Two empty directory deletion candidates found. | RQ8 |
| F-ENT-001 | P2 | W3-W7 decisions are not tenant-aware. | RQ9 |
| F-ENT-002 | P2 | W3-W7 lack unified decision audit and SLA metrics. | RQ9 |

## 5. Final Next Focus

Phase G should be a telemetry-first remediation packet:

1. Create a request-scoped `SearchDecisionEnvelope`.
2. Wire real QueryPlan data into W4 Stage 3.
3. Add durable W5 shadow/audit sink.
4. Wire W3 and W6 into runtime traces before any ranking/refusal behavior changes.
5. Add real W7 degraded-readiness integration tests.

## 6. Convergence

Sequence: `0.92, 0.84, 0.78, 0.69, 0.62, 0.49, 0.39, 0.30, 0.22, 0.14`.

No two consecutive iterations were `<= 0.10`; the loop stopped at iteration 10.
