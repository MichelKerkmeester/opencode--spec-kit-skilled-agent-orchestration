---
title: "Phase 8: Further Deep-Loop Improvements — Contract Truth, Graph Wiring, Reducer Surfacing, and Fixtures"
description: "Close the 12 P0/P1/P2 gaps surfaced by the 20-iteration deep-research audit of sk-deep-research v1.5.0.0, sk-deep-review v1.2.0.0, and sk-improve-agent v1.1.0.0. Make the shipped contracts executable on the visible workflow path, wire the coverage graph into live stop decisions, promote blocked-stop/insufficient-sample evidence into reducer-owned surfaces, and add durable fixtures so future audits can test the visible path directly."
trigger_phrases:
  - "008"
  - "further deep loop improvements"
  - "deep loop contract truth pass"
  - "graph wiring deep loops"
  - "blocked stop reducer surfacing"
  - "improvement journal wiring"
  - "sample size enforcement improve agent"
  - "phase 8 042"
importance_tier: "critical"
contextType: "implementation"
---

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_ADDENDUM: Phase - Child Header -->

# Feature Specification: Further Deep-Loop Improvements [008]

| Field | Value |
|-------|-------|
| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Phase** | 8 of 8 |
| **Predecessor** | 007-skill-rename-improve-agent-prompt |
| **Successor** | None |
| **Handoff Criteria** | All 3 P0 recommendations shipped, all 5 P1 recommendations shipped, all 4 P2 recommendations shipped, graph integration active on the visible loop path, fixtures validate blocked-stop + insufficient-sample + graph convergence paths, vitest suite green. |

---

## EXECUTIVE SUMMARY

The 20-iteration Codex-driven deep-research audit (`research/research.md`) surfaced a single dominant pattern across `sk-deep-research` v1.5.0.0, `sk-deep-review` v1.2.0.0, and `sk-improve-agent` v1.1.0.0: **the repo already ships richer stop, graph, and recovery helpers than the visible deep-loop workflows actually call**. Contract truth, reducer surfacing, graph wiring, and fixtures are the four workstreams required to close the gap and make the published v1.5 / v1.2 / v1.1 contracts executable on the shipped operator path.

This phase lands 12 concrete recommendations (3 P0, 5 P1, 4 P2) in four sequential passes. The decisive architectural choice — which graph-convergence regime becomes canonical (CJS helper in `scripts/lib/coverage-graph-convergence.cjs` vs. MCP handler in `mcp_server/handlers/coverage-graph/convergence.ts`) — is documented in the phase `decision-record.md`. After this phase, the coverage graph must be **actively and smartly utilized** by the live research and review loops, not merely emitted into JSONL.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Feature Name** | Further Deep-Loop Improvements |
| **Phase** | 008 |
| **Level** | 3 |
| **Status** | Draft |
| **Scope** | Multi-skill: `sk-deep-research`, `sk-deep-review`, `sk-improve-agent` + shared `system-spec-kit/scripts/lib/coverage-graph-*` and `mcp_server/handlers/coverage-graph/*` |
| **Estimated LOC** | 1,500–2,500 (CJS + TS + YAML + docs + tests + fixtures) |
| **Source of Truth** | `.../research/research.md` (P0/P1/P2 recommendations) + iteration-001.md through iteration-020.md (48 findings) |

---

## 2. PROBLEM & PURPOSE

### Problem Statement

Deep-research iteration-by-iteration evidence (see `research/iterations/iteration-001.md` through `iteration-020.md`) establishes that:

- **sk-deep-research v1.5.0.0** — reducer drops every non-iteration JSONL row (`reduce-state.cjs:489-502`), so `blocked_stop`, `paused`, and resume lineage events never reach operator-visible surfaces. The live auto workflow emits raw `paused` + free-form `reason` instead of the normalized `STOP_REASONS` enum. `sourceDiversity` and `contradictionDensity` are in the published contract but never evaluated at STOP time.
- **sk-deep-review v1.2.0.0** — reducer silently skips malformed JSONL (fail-open where fail-closed is wanted), blocked-stop bundles are flattened away in live workflow, missing machine-owned anchors silently persist, `repeatedFindings` bucket is too coarse at scale, `graphEvents` are emitted but never consumed, structural Code Graph tools are promised in agent prose but absent from command-doc tool budgets.
- **sk-improve-agent v1.1.0.0** — the visible `/improve:agent` YAML **never calls** `improvement-journal.cjs` despite the command doc mandating it; the published `--event=session_initialized` CLI example is malformed (helper expects `--emit <eventType>`); `trade-off-detector.cjs` fires on 2 trajectory points (not the published 3); `benchmark-stability.cjs` treats 1–2 replay samples as stable; reducer collapses weak benchmarks into generic failure counters; mutation-coverage is helper-only and never consulted for focus/stop decisions.
- **Shared graph stack** — two incompatible graph-convergence regimes exist (CJS vs. MCP) with divergent `sourceDiversity` semantics; shared read helpers aggregate by `specFolder + loopType` instead of session-scoped; contradiction-aware blockers exist in `coverage-graph-contradictions.cjs` but nothing in the live stop path consults them.

The root cause is consistent: **capability shipped but not wired**. The problem is not missing base capability; it is integration drift between the published contracts and the visible operator-facing files.

### Purpose

Make the published v1.5.0.0 / v1.2.0.0 / v1.1.0.0 contracts executable on the shipped operator path by:
1. Emitting the correct stop-state, blocked-stop, and journal events on the visible workflow path (contract truth).
2. Surfacing that evidence through reducer-owned registry / dashboard / strategy outputs (reducer surfacing).
3. Wiring the coverage graph into live stop evaluation so it actively informs focus selection and convergence (graph wiring).
4. Guarding the new behaviour with durable fixtures and regression tests so future audits can verify the visible path directly (fixtures & regression).

The phase's success criterion is binary: after implementation, the coverage graph must be **actively and smartly utilized** in the live research and review loops — not emit-only.

---

## 3. REQUIREMENTS

### Contract Truth (P0.1, P0.2)

- **REQ-001** — `spec_kit_deep-research_auto.yaml` MUST emit `blocked_stop` JSONL events with `blockedBy`, `gateResults`, `recoveryStrategy` fields whenever the legal-stop decision tree returns a blocked verdict.
- **REQ-002** — `spec_kit_deep-research_auto.yaml` MUST normalize `paused` sentinel events to `userPaused` and `stuck_recovery` events to `stuckRecovery` at emission time, consuming the frozen `STOP_REASONS` enum. `spec_kit_deep-research_confirm.yaml` MUST mirror the same contract.
- **REQ-003** — Both `spec_kit_deep-review_{auto,confirm}.yaml` MUST implement the equivalent normalization with review-specific gate names (`convergenceGate`, `dimensionCoverageGate`, `p0ResolutionGate`, `evidenceDensityGate`, `hotspotSaturationGate`).
- **REQ-004** — `improve_agent-improver_{auto,confirm}.yaml` MUST invoke `.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs --emit <eventType>` at every iteration boundary and session-start/session-end transition.
- **REQ-005** — `.opencode/command/improve/agent.md` MUST replace the malformed `--event=session_initialized` CLI example with a working `--emit session_start --payload '...'` invocation matching the helper's actual interface.
- **REQ-006** — `.opencode/skill/sk-improve-agent/scripts/trade-off-detector.cjs` MUST require `minDataPoints` (default: 3) before reporting a trade-off. Below threshold, emit `insufficientData` state instead of a trade-off verdict.
- **REQ-007** — `.opencode/skill/sk-improve-agent/scripts/benchmark-stability.cjs` MUST require `replayCount >= minReplayCount` (default: 3). Below threshold, emit `insufficientSample` state instead of a stability verdict.

### Graph Wiring (P0.3, P1.4, P1.5, P2.3)

- **REQ-008** — A canonical graph-convergence regime MUST be chosen in `decision-record.md` (ADR-001). Options: CJS helper or MCP handler. The non-canonical side becomes a thin adapter to the canonical metric contract.
- **REQ-009** — `spec_kit_deep-research_auto.yaml` and `spec_kit_deep-review_auto.yaml` MUST call `deep_loop_graph_upsert` during the iteration step (to persist `graphEvents` into the SQLite store) and `deep_loop_graph_convergence` during the stop-check step (to consult graph-backed blockers).
- **REQ-010** — `sourceDiversity` semantics MUST be harmonized between `scripts/lib/coverage-graph-convergence.cjs` and `mcp_server/lib/coverage-graph/coverage-graph-signals.ts`. One canonical definition; the other surface becomes an adapter.
- **REQ-011** — `code_graph_query` and `code_graph_context` MUST be provisioned in the visible LEAF-tool budgets of `.opencode/command/spec_kit/deep-research.md` and `.opencode/command/spec_kit/deep-review.md`, OR removed entirely from `.opencode/agent/deep-research.md` and `.opencode/agent/deep-review.md` prose. No prose-vs-budget drift may remain.
- **REQ-012** — `mcp_server/lib/coverage-graph/coverage-graph-query.ts`, `coverage-graph/convergence.ts`, and any other shared read helper MUST scope reads by `specFolder + loopType + sessionId`. Cross-session aggregation within a single packet is prohibited.
- **REQ-013** — The reducers (`sk-deep-research/scripts/reduce-state.cjs` and `sk-deep-review/scripts/reduce-state.cjs`) MUST consume graph convergence output, not just `convergenceSignals.compositeStop`. The registry MUST expose a new `graphConvergenceScore` field alongside `convergenceScore`.

### Reducer Surfacing (P1.1, P1.2, P1.3, P2.1, P2.2)

- **REQ-014** — Both research and review reducers MUST promote `blockedBy`, `gateResults`, and `recoveryStrategy` fields from `blocked_stop` JSONL events into the findings registry, dashboard, and strategy machine-owned anchors. Raw event rows remain append-only in JSONL; reducer-owned surfaces get a structured summary.
- **REQ-015** — `sk-deep-review/scripts/reduce-state.cjs` MUST fail loudly on malformed JSONL lines (instead of silently skipping). A new `corruptionWarnings` array in findings-registry.json records the offending lines with reason. Reducer exit code is non-zero when corruption is detected unless an explicit `--lenient` flag is passed.
- **REQ-016** — Missing machine-owned anchors in `sk-deep-review/scripts/reduce-state.cjs` MUST switch from silent-preserve to explicit failure: the reducer throws with a clear error message identifying the missing anchor.
- **REQ-017** — Either `sk-improve-agent/scripts/reduce-state.cjs` MUST read `improvement-journal.jsonl`, `candidate-lineage.json`, and `mutation-coverage.json` during reducer refresh, OR the claims in `sk-improve-agent/SKILL.md` and `.opencode/command/improve/agent.md` about journal-based replay MUST be downgraded to match current ledger-only reality. Decision recorded in `decision-record.md` (ADR-002).
- **REQ-018** — `sk-deep-review/scripts/reduce-state.cjs` MUST split `repeatedFindings` into two arrays: `persistentSameSeverity` (same ID, same severity across iterations) and `severityChanged` (same ID, severity transition across iterations). Dashboard renders both.
- **REQ-019** — `sk-improve-agent/scripts/reduce-state.cjs` MUST surface `replayCount`, `stabilityCoefficient`, and `insufficientSample` / `insufficientData` states as distinct dashboard fields, separate from generic benchmark-failure counters.

### Fixtures & Regression (P2.4)

- **REQ-020** — New fixture: `sk-deep-research/scripts/tests/fixtures/interrupted-session/` containing a deep-research packet that was interrupted mid-iteration (JSONL truncation + missing iteration file). Used by vitest to validate reducer fail-closed + resume behavior.
- **REQ-021** — New fixture: `sk-deep-review/scripts/tests/fixtures/blocked-stop-session/` containing a review packet with full `blockedBy` / `gateResults` / `recoveryStrategy` payloads. Used to validate reducer surfacing (REQ-014).
- **REQ-022** — New fixture: `sk-improve-agent/scripts/tests/fixtures/low-sample-benchmark/` containing a candidate with 1 replay + 2-point trade-off trajectory. Used to validate insufficientSample / insufficientData states (REQ-006, REQ-007, REQ-019).
- **REQ-023** — New vitest suite: `scripts/tests/graph-aware-stop.vitest.ts` that exercises the end-to-end graph convergence path on a research packet fixture. Suite MUST fail if the loop falls back to inline ratio math.
- **REQ-024** — New vitest suite: `scripts/tests/session-isolation.vitest.ts` verifying that two concurrent research sessions in the same packet do not see each other's graph nodes.
- **REQ-025** — New manual testing playbook scenarios (one per loop family) exercising the blocked-stop reducer surfacing, insufficient-sample dashboard display, and graph-aware convergence gate.

---

## 4. SCOPE

### In Scope

- `.opencode/skill/sk-deep-research/` — references, scripts, assets, SKILL.md, playbook
- `.opencode/skill/sk-deep-review/` — references, scripts, assets, SKILL.md, playbook
- `.opencode/skill/sk-improve-agent/` — references, scripts, assets, SKILL.md, playbook
- `.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-*.cjs` — CJS helper harmonization
- `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/` — TS query/signals/db
- `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/` — handlers + session scoping
- `.opencode/command/spec_kit/deep-research.md`, `deep-review.md`, `assets/spec_kit_deep-*_auto.yaml`, `assets/spec_kit_deep-*_confirm.yaml`
- `.opencode/command/improve/agent.md`, `assets/improve_agent-improver_{auto,confirm}.yaml`
- `.opencode/agent/deep-research.md`, `deep-review.md`, `agent-improver.md` (plus runtime mirrors in `.claude/agents/`, `.codex/agents/`, `.gemini/agents/`)
- `scripts/tests/*.vitest.ts` — new vitest coverage
- `scripts/tests/fixtures/` — new durable fixtures
- `manual_testing_playbook/` — new scenarios across all 3 skills

### Out of Scope

- Replacing the coverage graph modules or reducer architectures wholesale.
- Renaming skills or any breaking API changes.
- Wave executor work (Phase 3 remains deferred).
- Phase 4b prompt/meta optimizer (remains deferred).
- Migrating `sk-improve-agent` to the shared SQLite graph schema (explicitly ruled out in ADR-002 if journal replay is chosen; revisit in a future packet).
- Any work not traceable to a P0/P1/P2 recommendation in `research/research.md`.

### Success Criteria

1. **All 3 P0 recommendations shipped**: contract truth (REQ-001 through REQ-007), sample-size enforcement (REQ-006, REQ-007), graph convergence truth chosen and wired (REQ-008 through REQ-013).
2. **All 5 P1 recommendations shipped**: blocked-stop promotion (REQ-014), review fail-closed (REQ-015, REQ-016), replay decision (REQ-017), tool-routing parity (REQ-011), session scoping (REQ-012).
3. **All 4 P2 recommendations shipped**: repeatedFindings refinement (REQ-018), insufficient-sample dashboard (REQ-019), graph-math harmonization (REQ-010), fixtures (REQ-020 through REQ-022).
4. **Graph is actively utilized, not just emitted**: `deep_loop_graph_upsert` is called from at least one iteration step in both research and review auto YAMLs; `deep_loop_graph_convergence` is called from the stop-check step; reducer-owned `graphConvergenceScore` appears in the findings registry.
5. **Vitest suite green**: 10,335+ tests pass, plus the new `graph-aware-stop.vitest.ts` and `session-isolation.vitest.ts` suites pass. Fixture-based regression tests for interrupted sessions, blocked-stop, and low-sample benchmarks all pass.
6. **No prose-vs-runtime drift**: every tool-routing promise in agent docs has a matching command-doc provisioning (or the promise is removed). The deep review run that closes this phase must produce zero `P0` and zero `P1` self-compliance findings.
7. **Version bumps**: `sk-deep-research` 1.5.0.0 → 1.6.0.0, `sk-deep-review` 1.2.0.0 → 1.3.0.0, `sk-improve-agent` 1.1.0.0 → 1.2.0.0. Changelogs written for each.

---

<!-- ANCHOR:non-functional-requirements -->
## 5. NON-FUNCTIONAL REQUIREMENTS

- **Backward compatibility**: Existing research and review packets initialized under v1.5.0.0 / v1.2.0.0 MUST resume cleanly under the new reducer logic. New fields (`graphConvergenceScore`, `corruptionWarnings`, split `repeatedFindings`) MUST be additive only.
- **Idempotency**: All reducer changes MUST preserve the existing idempotency guarantee — running the reducer twice against the same state produces byte-identical output.
- **Performance**: The graph convergence call during the stop-check step MUST complete in under 500ms per iteration for packets up to 50 iterations. Session-scoped reads MUST NOT increase query complexity beyond O(n) on session size.
- **Observability**: All new JSONL event types, reducer fields, and YAML steps MUST be documented in `state_format.md` and `loop_protocol.md` for each loop family before the phase closes.
- **Fail-closed discipline**: The new `corruptionWarnings` channel and explicit-failure anchor handling MUST default to non-zero exit codes; an explicit `--lenient` flag is the only escape hatch.
<!-- /ANCHOR:non-functional-requirements -->

---

## 6. OPEN QUESTIONS

- **ADR-001 pending**: Which graph-convergence regime becomes canonical — the CJS helper (`coverage-graph-convergence.cjs`) or the MCP handler (`coverage-graph/convergence.ts`)? Default recommendation: **MCP handler**, because it already exposes session-scoping hooks via tool arguments and computes a broader signal set (contradiction density, claim verification rate, source diversity, evidence depth).
- **ADR-002 pending**: For `sk-improve-agent`, implement journal + lineage + coverage replay consumers in the reducer, OR downgrade the docs to match ledger-only reality? Default recommendation: **implement consumers**, because the helpers already exist and downgrading the docs would leave the v1.1.0.0 contract permanently contractually misaligned.
- **Playbook alignment**: Should new playbook scenarios land under the existing `03--iteration-execution-and-state-discipline/` and `04--convergence-and-recovery/` categories, or under a new `08--graph-integration/` category? (Low risk; confirm during tasks.md authoring.)
