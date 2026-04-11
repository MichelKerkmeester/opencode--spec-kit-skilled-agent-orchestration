---
title: "Closing Review: Phase 008 Further Deep-Loop Improvements (T061)"
description: "Single-pass focused deep review of phase 008 changes. Findings-first, P0/P1/P2 severity."
---

# Closing Review: Phase 008 [T061]

## Verdict

**CONDITIONAL**

- Active P0: 0
- Active P1: 4
- Active P2: 0
- hasAdvisories: false

## Executive Summary

Phase 008 does put the coverage graph onto the live research and review YAML paths: `deep_loop_graph_upsert` is present after iteration reduction and `deep_loop_graph_convergence` is present before the inline stop vote in both loop families. The remaining release-level gaps are in contract fidelity around what gets persisted and surfaced: the reducers do not currently expose a trustworthy `graphConvergenceScore`, review-side blocked-stop payloads can serialize blocker objects into a `string[]` contract, session scoping is still optional/incomplete in shared read helpers, and review `next-focus` can stay pinned to an old blocked stop after later iterations.

The broad direction is honest: most of the 12 research recommendations are closed, and graph consultation is real rather than decorative. The remaining issues are about whether operators can trust the surfaced packet state to mean what the phase says it means.

## P0 Findings (blocker)

None found.

## P1 Findings (required)

### P1-01: `graphConvergenceScore` is not the live graph-convergence output

- Severity: P1
- Dimension: contract self-compliance
- Evidence:
  - `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:188-205`
  - `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:217-237`
  - `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:392-413`
  - `.opencode/skill/system-spec-kit/scripts/tests/graph-aware-stop.vitest.ts:199-225`
  - `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/008-further-deep-loop-improvements/spec.md:100`
- Description:
  - The canonical MCP handler returns raw `signals` plus `decision`/`blockers`, but it does not emit a numeric convergence score field. The research reducer therefore records `0` unless a handcrafted event injects `signals.blendedScore`, and the review reducer fabricates a score by averaging every numeric signal. That means the new `graphConvergenceScore` field is not the actual graph-convergence assessment promised by REQ-013; it is either always zero on the live research path or a synthetic arithmetic mean on the live review path.
  - The current tests do not catch this because `graph-aware-stop.vitest.ts` seeds `graph_convergence` fixtures with a manual `signals.blendedScore` field instead of using the real handler output shape.
- Recommended fix:
  - Make the MCP handler emit one canonical numeric score field alongside `signals` and `decision`, then have both reducers consume that exact field without fallback math. Update the tests to use handler-shaped payloads rather than synthetic `blendedScore` injections.

### P1-02: Review `blocked_stop.blockedBy` can persist blocker objects instead of gate names

- Severity: P1
- Dimension: contract self-compliance
- Evidence:
  - `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:417-450`
  - `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:40-45`
  - `.opencode/skill/sk-deep-review/references/state_format.md:237-262`
  - `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:436-458`
  - `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:737-753`
- Description:
  - On the review live path, when the graph vetoes STOP, `blocked_by_json` is assigned directly from `graph_blockers_json`, and the subsequent `blocked_stop` event writes that value into `blockedBy`. The handler’s blockers are structured objects (`type`, `description`, `count`, `severity`), but the published `blocked_stop` contract and reducer/dashboard logic expect `blockedBy` to be a `string[]` of gate names. The reducer later joins that array as strings, so live blocked-stop surfaces can render `[object Object]` instead of meaningful blocker names.
- Recommended fix:
  - Normalize graph blockers to a string name list before writing `blocked_stop.blockedBy` on the review path. If structured blocker detail is still needed, keep it in a separate field rather than overloading the `blockedBy` contract.

### P1-03: Review `next-focus` stays blocked even after a later iteration completes

- Severity: P1
- Dimension: correctness
- Evidence:
  - `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:186-222`
  - `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:604-623`
  - `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/008-further-deep-loop-improvements/spec.md:104`
- Description:
  - `updateStrategyContent()` is supposed to prefer the latest blocked-stop recovery only when blocked-stop is the most recent loop event, but `parseIterationFile()` never records iteration timestamps. As a result, `latestIterationTimestamp` is always absent, so any historical blocked-stop event permanently overrides the strategy `next-focus` anchor even after later iterations have completed. That breaks the operator-facing recovery story promised by REQ-014 because the strategy can remain stuck on stale blocked-stop guidance.
- Recommended fix:
  - Source recency from the JSONL iteration records rather than markdown iteration files, or parse/store iteration timestamps in `parseIterationFile()` before comparing blocked-stop freshness.

### P1-04: Session isolation is still optional and incomplete in shared coverage-graph reads

- Severity: P1
- Dimension: traceability
- Evidence:
  - `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/008-further-deep-loop-improvements/spec.md:99`
  - `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/008-further-deep-loop-improvements/decision-record.md:169-170`
  - `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:196-199`
  - `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts:67-73`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts:226-273`
  - `.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:162-194`
- Description:
  - REQ-012 and ADR-001/003 treat `specFolder + loopType + sessionId` scoping as mandatory, but the handlers still intentionally fall back to `all_sessions_default` aggregation when `sessionId` is omitted. More importantly, `findProvenanceChain()` delegates to helpers that filter by `sessionId` only and do not constrain by `specFolder` or `loopType`, so provenance reads are not fully namespaced even when a namespace object is already available.
  - The dedicated session-isolation test currently locks this fallback behavior in as expected output.
- Recommended fix:
  - Remove the cross-session default from the phase-008 coverage-graph read surfaces, make `sessionId` mandatory on these handlers/helpers, and thread `specFolder` + `loopType` through the provenance helper queries as well.

## P2 Findings (advisory)

None found.

## Contract Self-Compliance Check

| REQ | Status | Evidence / Notes |
|-----|--------|------------------|
| REQ-001 | Pass | Research auto/confirm add first-class `blocked_stop` emission: `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:330-338`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:350-358`. |
| REQ-002 | Pass | Research pause/recovery normalization is present: `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:353-361`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:373-381`. |
| REQ-003 | Pass | Review auto/confirm add blocked-stop and normalized pause/recovery flow: `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:471-518`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:471-518`. |
| REQ-004 | Pass | Improve-agent auto/confirm wire journal events at start, iteration boundaries, and end: `.opencode/command/improve/assets/improve_agent-improver_auto.yaml:132-183`, `.opencode/command/improve/assets/improve_agent-improver_confirm.yaml` mirrors. |
| REQ-005 | Pass | CLI example corrected in `.opencode/command/improve/agent.md` and implementation summary documents the fix: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/008-further-deep-loop-improvements/implementation-summary.md:48-50`. |
| REQ-006 | Pass | `trade-off-detector.cjs` min data gate shipped and reducer surfaces `insufficientData`: see implementation summary `.opencode/specs/.../implementation-summary.md:49-50`, reducer `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:127-142,443-476`. |
| REQ-007 | Pass | `benchmark-stability.cjs` min replay gate shipped and reducer surfaces `insufficientSample`: `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:144-159,443-476`. |
| REQ-008 | Pass | ADR-001 chooses MCP handler canonical: `.opencode/specs/.../decision-record.md:36-77`. |
| REQ-009 | Pass | Live YAML path genuinely calls graph convergence before stop vote and graph upsert after reduction in both loop families: research `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:250-266,415-433`; review `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:339-360,600-619`. |
| REQ-010 | Pass | CJS/TS parity work landed and is guarded by parity tests: `.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs:1-3`, `.opencode/skill/system-spec-kit/scripts/tests/graph-convergence-parity.vitest.ts:210-252`. |
| REQ-011 | Pass | Decision record and implementation summary both say the structural tools were provisioned on the live path: `.opencode/specs/.../decision-record.md:125-159`, `.opencode/specs/.../implementation-summary.md:59-60`. |
| REQ-012 | **Gap** | Session scoping is still optional and incomplete. Handlers intentionally allow `all_sessions_default`, and provenance helpers only filter by `sessionId`: `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:196-199`, `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts:67-73`, `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts:226-273`. |
| REQ-013 | **Gap** | Reducers expose `graphConvergenceScore`, but not as the real handler output. Research falls back to `0`; review averages raw signal values: `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:217-237`, `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:392-413`, handler output `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:188-205`. |
| REQ-014 | **Gap** | Blocked-stop promotion exists, but review live-path graph blockers can violate the `blockedBy: string[]` contract and the strategy can keep stale blocked-stop guidance: `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:417-450`, `.opencode/skill/sk-deep-review/references/state_format.md:237-262`, `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:604-623,737-753`. |
| REQ-015 | Pass | Review reducer now records `corruptionWarnings` and exits non-zero unless `--lenient`: `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:74-106,827-857,911-914`. |
| REQ-016 | Pass | Missing anchors now throw unless `--create-missing-anchors` is supplied: `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:548-569,880-888`. |
| REQ-017 | Pass | ADR-002 chose replay consumers and reducer now reads journal/lineage/coverage artifacts: `.opencode/specs/.../decision-record.md:80-121`, `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:178-281,841-849`. |
| REQ-018 | Pass | `persistentSameSeverity` and `severityChanged` arrays shipped: `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:469-509,774-776`. |
| REQ-019 | Pass | Improve-agent dashboard includes distinct Sample Quality section: `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:747-763,781-818`. |
| REQ-020 | Pass | Interrupted-session fixture exists: `.opencode/skill/sk-deep-research/scripts/tests/fixtures/interrupted-session/README.md:1-1` and spec summary `.opencode/specs/.../implementation-summary.md:77-79`. |
| REQ-021 | Pass | Review blocked-stop fixture exists and exercises reducer surfacing: `.opencode/skill/sk-deep-review/scripts/tests/fixtures/blocked-stop-session/README.md:1-24`. |
| REQ-022 | Pass | Low-sample improve-agent fixture exists per implementation summary and fixture tree: `.opencode/specs/.../implementation-summary.md:79-80`. |
| REQ-023 | Pass with test blind spot | `graph-aware-stop.vitest.ts` exists, but it seeds synthetic `signals.blendedScore` instead of the real handler shape: `.opencode/skill/system-spec-kit/scripts/tests/graph-aware-stop.vitest.ts:195-244`. |
| REQ-024 | Pass with test blind spot | `session-isolation.vitest.ts` exists, but it explicitly blesses the `all_sessions_default` fallback when `sessionId` is omitted: `.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:162-194`. |
| REQ-025 | Pass | New manual testing playbooks exist across all three loop families: see implementation summary `.opencode/specs/.../implementation-summary.md:81-88`. |

## Graph Integration Quality Check

`deep_loop_graph_upsert` and `deep_loop_graph_convergence` are genuinely on the live YAML path, so the graph is not just emitted on paper. Research calls convergence before the inline stop vote and upsert after reducer refresh at `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:250-266,415-433`; review mirrors that at `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:339-360,600-619`. On the "actively and smartly utilized" criterion, the answer is therefore **yes for live stop gating**.

The surfacing half is not honest enough yet. `graphConvergenceScore` is exposed in both reducers, but it is not the canonical convergence output:

- Research reducer expects `signals.blendedScore` or `signals.score` and otherwise records `0`: `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:225-229`.
- Review reducer averages raw numeric signals when no score field exists: `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:397-413`.
- The canonical handler returns raw `signals` plus `decision`/`blockers`, not a numeric score field: `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:188-205`.

So the graph is actively consulted on the live path, but the reducer-owned score that is supposed to prove that consultation is not yet a trustworthy representation of the handler output.

## Follow-up Items

None beyond the active P1 fixes above. The remaining work surfaced in this pass belongs to release-readiness closure for phase 008, not a future packet.

## Review Methodology Notes

- Reviewed the full phase range `d504f19ca^..81f8ede32` scoped to `.opencode/`, with focused reading on the 10 user-flagged high-risk files plus the phase `spec.md`, `tasks.md`, `decision-record.md`, `implementation-summary.md`, and parent `research/research.md`.
- Used direct file inspection, diff/stat inspection, and three temporary reducer sanity checks outside the repo tree to confirm operator-visible behavior:
  - research reducer with a handler-shaped `graph_convergence` event produced `graphConvergenceScore = 0`
  - review reducer with a handler-shaped `graph_convergence` event produced `graphConvergenceScore = 1.1`
  - review reducer with object-shaped `blockedBy` rendered `[object Object]` and kept `next-focus` pinned to blocked-stop text after a later iteration
- I did not rerun the full repository test suite or re-execute the actual YAML workflows end-to-end; this was a focused closing audit of the phase 008 changes and their operator-visible contracts.
