---
title: Deep Review Strategy - 008 Skill Graph Daemon And Advisor Unification PT-01
description: Session strategy for correctness, security, traceability, and maintainability review of the skill graph daemon and advisor unification packet.
---

# Deep Review Strategy - 008 Skill Graph Daemon And Advisor Unification PT-01

## 1. OVERVIEW

Review target: `specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/008-skill-graph-daemon-and-advisor-unification`

Mode: review. Lineage generation: 1. Session ID: `2026-04-28T15:00:00.000Z`.

## 2. TOPIC

Skill graph daemon and advisor unification: daemon freshness, native TypeScript scorer, MCP surface, Python/plugin compatibility shims, cache recovery, and promotion gates.

## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [x] D1 Correctness - Logic errors, off-by-one, wrong return types, broken invariants
- [x] D2 Security - Injection, auth bypass, secrets exposure, unsafe deserialization
- [x] D3 Traceability - Spec/code alignment, checklist evidence, cross-reference integrity
- [x] D4 Maintainability - Patterns, clarity, documentation quality, safe follow-on change cost
<!-- MACHINE-OWNED: END -->

## 4. NON-GOALS

- Do not fix findings in this review loop.
- Do not dispatch sub-agents.
- Do not broaden beyond the skill graph daemon/advisor unification packet and directly referenced runtime surfaces.

## 5. STOP CONDITIONS

- Max iterations: 7.
- Stop only after configured dimensions are covered and no active P0/P1 blocks convergence, or after loop manager intervention.

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| D1 Correctness | CONDITIONAL | 1 | One P1 found: direct `advisor_recommend` still scores during unavailable freshness; inventory and checklist traceability P2s also logged. |
| D2 Security | CONDITIONAL | 2 | One P1 found: public `skill_graph_scan` can reindex and publish generation without trusted-caller gating; corruption recovery and diagnostic path leaks logged as P2s. |
| D3 Traceability | CONDITIONAL | 3 | One P1 found: active issue invariants lack targeted regression tests; public scan authority docs/playbooks, lane-weight catalog drift, and promotion-gate artifact traceability logged as P2s. |
| D4 Maintainability | CONDITIONAL | 4 | No new P0/P1 found. Six P2s logged for retry-boundary consistency, lane extension cost, compat contract duplication, handler response schemas, fixture reuse, and ADR granularity. |
<!-- MACHINE-OWNED: END -->

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 3 active
- **P2 (Minor):** 15 active
- **Delta this iteration:** +0 P0, +0 P1, +6 P2
<!-- MACHINE-OWNED: END -->

## 8. WHAT WORKED

- Targeted line-numbered reads of daemon, MCP handler, scorer, shim, and focused tests quickly separated actual correctness risk from documentation drift (iteration 1).
- Comparing direct MCP behavior with compat probe semantics exposed the unavailable-freshness inconsistency (iteration 1).

## 9. WHAT FAILED

- Broad `rg` over all spec and review history was too noisy for this packet because prior review artifacts contain many advisor terms (iteration 1).

## 10. EXHAUSTED APPROACHES (do not retry)

None.

## 11. RULED OUT DIRECTIONS

- Exact Python/TypeScript score parity as a blocker: the packet explicitly claims regression-protection parity, and the parity test asserts Python-correct preservation rather than byte-for-byte exact-match (`python-ts-parity.vitest.ts:99-162`).

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:next-focus -->
STOP candidate — all 4 dimensions covered. Loop manager should evaluate STOP gates against the active P1 set and maintainability P2 advisories from iteration 4.
<!-- MACHINE-OWNED: END -->

## 13. KNOWN CONTEXT

- Top-level docs are present.
- Implementation summary enumerates seven shipped child areas.
- Resource map is not present; coverage gate skipped per config.
- Strict-validation follow-up remains pending in checklist/tasks.

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 3 | REQ-001 through REQ-007 mostly map; REQ-008 promotion gates only map to validation slices, and REQ-010 remains open. |
| `checklist_evidence` | core | fail | 3 | 16/16 completed CHK items lack file:line citations; prior finding remains active. |
| `skill_agent` | overlay | notApplicable | 1 | No agent definition review in this iteration. |
| `agent_cross_runtime` | overlay | notApplicable | 1 | Deferred unless later dimensions require it. |
| `feature_catalog_code` | overlay | fail | 3 | Derived lane weight catalog/docs say 0.10 while runtime uses 0.15. |
| `playbook_capability` | overlay | partial | 3 | Corrupt DB, restart, and unavailable-mode scenarios exist; external public scan caller authority is missing. |
<!-- MACHINE-OWNED: END -->

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|---------------------|----------------|----------|--------|
| `spec.md` | D1 | 1 | 0 P0, 0 P1, 2 P2 | partial |
| `implementation-summary.md` | D1 | 1 | 0 P0, 0 P1, 1 P2 | partial |
| `tasks.md` | D1 | 1 | 0 P0, 0 P1, 1 P2 | partial |
| `checklist.md` | D1 | 1 | 0 P0, 0 P1, 2 P2 | partial |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-recommend.ts` | D1 | 1 | 0 P0, 1 P1, 0 P2 | partial |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-status.ts` | D1 | 1 | 0 P0, 1 P1, 0 P2 | partial |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/compat/daemon-probe.ts` | D1 | 1 | 0 P0, 1 P1, 0 P2 | partial |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/watcher.ts` | D1 | 1 | 0 P0, 0 P1, 0 P2 | partial |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/lifecycle.ts` | D1 | 1 | 0 P0, 0 P1, 0 P2 | partial |
| `.opencode/plugins/spec-kit-skill-advisor.js` | D1 | 1 | 0 P0, 0 P1, 0 P2 | partial |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/scan.ts` | D2 | 2 | 0 P0, 1 P1, 1 P2 | partial |
| `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts` | D2 | 2 | 0 P0, 1 P1, 0 P2 | partial |
| `.opencode/skill/system-spec-kit/mcp_server/tools/index.ts` | D2 | 2 | 0 P0, 1 P1, 0 P2 | partial |
| `.opencode/skill/system-spec-kit/mcp_server/tools/skill-graph-tools.ts` | D2 | 2 | 0 P0, 1 P1, 0 P2 | partial |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness/rebuild-from-source.ts` | D2 | 2 | 0 P0, 0 P1, 2 P2 | partial |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness/generation.ts` | D2 | 2 | 0 P0, 0 P1, 1 P2 | partial |
<!-- MACHINE-OWNED: END -->

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 7
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=`2026-04-28T15:00:00.000Z`, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: target 9 tool calls, soft max 12, hard max 13
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=`spec_code`, `checklist_evidence`; overlays deferred as applicable
- Started: `2026-04-28T15:00:00.000Z`
<!-- MACHINE-OWNED: END -->
