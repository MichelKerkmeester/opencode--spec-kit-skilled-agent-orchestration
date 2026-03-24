---
title: Deep Review Strategy - 022-hybrid-rag-fusion Full Tree Release Readiness
description: Runtime strategy tracking review progress across 119 spec dirs, 19 phases, and implementation code.
---

# Deep Review Strategy - Session Tracking

Runtime strategy for the deep review of the full 022-hybrid-rag-fusion spec tree for release readiness.

<!-- ANCHOR:overview -->
## 1. Overview

### Purpose

Serves as the "persistent brain" for this 20-iteration deep review session. Records which dimensions remain, what was found (P0/P1/P2), what review approaches worked or failed, and where to focus next.

### Scope

- **Spec tree**: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/` (119 numbered spec dirs, 19 direct phases)
- **Implementation code**: `.opencode/skill/system-spec-kit/` (mcp_server/, scripts/, shared/)
- **Dispatch**: 10 rounds x 2 parallel CLI agents (codex exec + copilot, GPT-5.4 xhigh)

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:topic -->
## 2. Topic

Full-tree release readiness review of the 022-hybrid-rag-fusion program. The tree contains 19 direct phases covering: MCP server implementation (33 tools), generate-context.js pipeline, feature catalog (219 snippets), manual testing playbooks (230 scenarios), session capturing, architecture audit, template compliance, and documentation. Most phases are marked Complete; 001 (epic) and 006 (feature-catalog) are In Progress; 010 (template-compliance) is Draft.

---

<!-- /ANCHOR:topic -->
<!-- ANCHOR:review-dimensions -->
## 3. Review Dimensions (remaining)
- [ ] D1 Correctness -- Logic errors, off-by-one, wrong return types, broken invariants
- [ ] D2 Security -- Injection, auth bypass, secrets exposure, unsafe deserialization
- [ ] D3 Spec Alignment -- Implementation matches spec.md, plan.md, and decision records
- [ ] D4 Completeness -- Missing edge cases, unhandled error paths, TODO/FIXME items
- [ ] D5 Cross-Reference Integrity -- Internal links, import paths, schema refs all resolve
- [ ] D6 Patterns -- Consistency with codebase conventions, anti-pattern detection
- [ ] D7 Documentation Quality -- Docstrings, comments, README accuracy, changelog entries

---

<!-- /ANCHOR:review-dimensions -->
<!-- ANCHOR:non-goals -->
## 4. Non-Goals
- Implementing fixes for any findings (review is READ-ONLY)
- New feature development outside current scope
- Re-reviewing the narrow 012 scope (already done in archive-review-v2, scored 84/100)
- Reviewing external dependencies or third-party packages
- Performance benchmarking or load testing

---

<!-- /ANCHOR:non-goals -->
<!-- ANCHOR:stop-conditions -->
## 5. Stop Conditions
- All 20 iterations completed (convergence override active — minimum 20 required)
- All 7 dimensions reviewed across spec tree AND implementation code
- Exception: 3 consecutive agent failures → enter partial synthesis

---

<!-- /ANCHOR:stop-conditions -->
<!-- ANCHOR:completed-dimensions -->
## 6. Completed Dimensions

| Dimension | Score | Iteration | Summary |
|-----------|-------|-----------|---------|

---

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 7. Running Findings
- **P0 (Critical):** 3 active
  - P0-001 (iter1): Root falsely marks 015 as Complete (child phases Not Started)
  - P0-001 (iter2): Parent epic certifies 10-sprint subtree, live has 11
  - P0-002 (iter2): Sprint 010 breaks navigation to 011 (declares itself final)
- **P1 (Major):** 3 active
  - P1-002 (iter1): Root tree counts internally contradictory (119 vs 118, stale child counts)
  - P1-003 (iter1): Checklist validation claims stale vs current validator output
  - P1-001 (iter2): Parent phase map status drift for sprint 008
- **P2 (Minor):** 1 active
  - P2-004 (iter4): Multiple overlapping feature catalog count layers without reconciliation
- **Delta R2:** +0 P0, +5 P1, +1 P2 (12 total findings)
- P1-001 (iter3): 005-architecture-audit missing root-family navigation pattern
- P1-002 (iter3): 005+010 broken evidence links in memory/scratch artifacts
- P1-003 (iter3): 010 internally inconsistent (spec says 2-layer, plan/tasks says 3-layer)
- P1-004 (iter4): Spec claims 222 snippet files, live has 219
- P1-005 (iter4): Spec claims 20 categories, live has 19

---

<!-- /ANCHOR:running-findings -->
<!-- ANCHOR:what-worked -->
## 8. What Worked
- Running validator against root packet to get fresh evidence vs stale checklist claims (iter 1)
- Counting live child folders vs parent-claimed counts to find tree-truth drift (iter 1+2)
- Auditing companion doc presence across all 11 sprint folders systematically (iter 2)

---

<!-- /ANCHOR:what-worked -->
<!-- ANCHOR:what-failed -->
## 9. What Failed
[None yet]

---

<!-- /ANCHOR:what-failed -->
<!-- ANCHOR:exhausted-approaches -->
## 10. Exhausted Approaches (do not retry)
[None yet]

---

<!-- /ANCHOR:exhausted-approaches -->
<!-- ANCHOR:ruled-out-directions -->
## 11. Ruled Out Directions
[None yet]

---

<!-- /ANCHOR:ruled-out-directions -->
<!-- ANCHOR:next-focus -->
## 12. Next Focus
**Round 4 (Iterations 7+8):**
- Iter 7 (copilot): 008-hydra-db-based-features (6 children) → D1 Correctness + D2 Security
- Iter 8 (copilot): 009-perfect-session-capturing children 000-009 → D1 Correctness + D4 Completeness

**R3 findings added:**
- P0 (iter5): 001-retrieval falsely claims complete coverage (audits 10, live catalog has 11)
- P0 (iter6): 021-remediation claims complete while 022 still has open tasks
- P1 (iter5): 009-eval and 011-scoring certify stale category inventories vs live catalog
- P1 (iter6): Umbrella spec counts 21 phases, omits child 022
- P1 (iter6): Several second-half audit phases lack required traceability evidence
- P2 (iter6): Conflicting level metadata in some child specs

---

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:known-context -->
## 13. Known Context
- Prior narrow review of 012 sub-spec: 84/100 PASS WITH NOTES (6 iterations, archived in scratch/archive-review-v2/)
- Root packet normalization completed 2026-03-21 (all 19 phases mapped, validator PASS)
- 8688 tests passing, 0 lint errors, 0 TypeScript errors (as of last check)
- Phase statuses: 15 Complete, 2 In Progress (001, 006), 1 Draft (010), 1 Implemented (001/006-sprint-5)

---

<!-- /ANCHOR:known-context -->
<!-- ANCHOR:cross-reference-status -->
## 14. Cross-Reference Status

| Check | Status | Iteration | Notes |
|-------|--------|-----------|-------|
| Spec vs Implementation | pending | -- | -- |
| Phase Status vs Reality | pending | -- | -- |
| Checklist vs Evidence | pending | -- | -- |
| Internal Links | pending | -- | -- |
| Feature Catalog vs Code | pending | -- | -- |

---

<!-- /ANCHOR:cross-reference-status -->
<!-- ANCHOR:iteration-allocation -->
## 15. Iteration Allocation

| Round | Iter | Target | Dimensions | Agent |
|-------|------|--------|------------|-------|
| R1 | 1 | Root 022 + 002, 003, 004 | D3, D7 | copilot |
| R1 | 2 | 001-epic + 11 sprints | D3, D4 | copilot |
| R2 | 3 | 005 + 010 | D5, D6 | copilot |
| R2 | 4 | 006 feature-catalog | D4, D5 | codex |
| R3 | 5 | 007 children 001-011 | D1, D6 | codex |
| R3 | 6 | 007 children 012-022 | D1, D6 | codex |
| R4 | 7 | 008 (6 children) | D1, D2 | codex |
| R4 | 8 | 009 children 000-009 | D1, D4 | codex |
| R5 | 9 | 009 children 010-019 | D1, D2 | codex |
| R5 | 10 | 001/012 + 001/013 recheck | D3, D5 | copilot |
| R6 | 11 | 011 + 012 + 013 + 014 | D5, D6 | copilot |
| R6 | 12 | 015 children 001-011 | D4, D7 | copilot |
| R7 | 13 | 015 children 012-019 | D4, D7 | copilot |
| R7 | 14 | 016, 017, 018, 019 | D7, D3 | copilot |
| R8 | 15 | mcp_server/lib/ group A | D1, D2 | codex |
| R8 | 16 | mcp_server/lib/ group B | D1, D2 | codex |
| R9 | 17 | scripts/ | D1, D6 | codex |
| R9 | 18 | shared/ + handlers/ | D1, D2 | codex |
| R10 | 19 | Cross-cutting spec-to-code | D3, D5 | copilot |
| R10 | 20 | Synthesis sweep | ALL | copilot |

---

<!-- /ANCHOR:iteration-allocation -->
<!-- ANCHOR:review-boundaries -->
## 16. Review Boundaries
- Max iterations: 20 (convergence override active)
- Convergence threshold: 0.05 (very low — expect all 20 to run)
- Per-iteration budget: 15 tool calls, 15 minutes
- Severity threshold: P2
- Quality gate threshold: 70
- Review target type: track (full spec tree)
- Cross-reference checks: spec=true, checklist=true, agentConsistency=true
- Started: 2026-03-24T18:30:00.000Z
<!-- /ANCHOR:review-boundaries -->
