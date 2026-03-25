# Deep Review Strategy — v4 Verification of 022-hybrid-rag-fusion

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose
Verify that all 58 findings from the v3 full-tree review (6 P0, 38 P1, 14 P2) have been properly remediated via T31-T97. This is a verification review, not a fresh audit. The goal is to confirm release readiness and drive the score from 42/100 FAIL to 100/100 PASS.

### Usage
- **Init:** Populated from config + prior review-report.md
- **Per iteration:** Agent reads Next Focus, verifies remediation status, updates findings
- **Mutability:** Mutable — updated by both orchestrator and agents

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:topic -->
## 2. TOPIC
v4 verification review of the full 022-hybrid-rag-fusion spec tree release readiness. Prior v3 review scored 42/100 FAIL with 58 active findings. Full remediation claimed via T31-T97. This review verifies those remediations and checks for regressions.

---

<!-- /ANCHOR:topic -->
<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
- [ ] D1 Correctness — Logic errors, off-by-one, wrong return types, broken invariants. Focus: verify 12 code P1 fixes in mcp_server/, scripts/, shared/
- [ ] D2 Security — Injection, auth bypass, secrets exposure, unsafe deserialization. Focus: verify BM25 fail-closed, session IDOR fix, error sanitization, startup validation
- [ ] D3 Traceability — Spec/code alignment, checklist evidence, cross-reference integrity. Focus: verify 6 P0 false completion fixes, 16 status drift fixes, 11 count drift fixes
- [ ] D4 Maintainability — Patterns, clarity, documentation quality, safe follow-on change cost. Focus: verify 8 missing docs/evidence repairs, README updates

---

<!-- /ANCHOR:review-dimensions -->
<!-- ANCHOR:non-goals -->
## 4. NON-GOALS
- New feature development or scope expansion
- Refactoring beyond what was required by v3 findings
- Expanding playbooks or catalogs beyond evidence gap closure
- Re-auditing areas not covered by v3 findings
- Performance optimization or benchmarking

---

<!-- /ANCHOR:non-goals -->
<!-- ANCHOR:stop-conditions -->
## 5. STOP CONDITIONS
- All 4 dimensions reviewed and all v3 findings verified as resolved → STOP (release ready)
- All 20 iterations consumed → STOP (max iterations)
- 3+ consecutive iterations with 0 new findings and all dimensions covered → STOP (converged)
- New P0 blocker discovered that requires implementation work → continue but flag

---

<!-- /ANCHOR:stop-conditions -->
<!-- ANCHOR:completed-dimensions -->
## 6. COMPLETED DIMENSIONS
[None yet — populated as iterations complete dimension reviews]

| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|

---

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 7. RUNNING FINDINGS
- **P0 (Critical):** 0 active
- **P1 (Major):** 0 active
- **P2 (Minor):** 0 active
- **Delta this iteration:** +0 P0, +0 P1, +0 P2

---

<!-- /ANCHOR:running-findings -->
<!-- ANCHOR:what-worked -->
## 8. WHAT WORKED
[First iteration — populated after iteration 1 completes]

---

<!-- /ANCHOR:what-worked -->
<!-- ANCHOR:what-failed -->
## 9. WHAT FAILED
[First iteration — populated after iteration 1 completes]

---

<!-- /ANCHOR:what-failed -->
<!-- ANCHOR:exhausted-approaches -->
## 10. EXHAUSTED APPROACHES (do not retry)
[None yet]

---

<!-- /ANCHOR:exhausted-approaches -->
<!-- ANCHOR:ruled-out-directions -->
## 11. RULED OUT DIRECTIONS
[None yet]

---

<!-- /ANCHOR:ruled-out-directions -->
<!-- ANCHOR:next-focus -->
## 12. NEXT FOCUS
**Iteration 1: Inventory pass + D3 Traceability (P0 verification)**
- Verify all 6 v3 P0 blockers (T31-T36) are truly resolved
- Check root 022 spec.md phase statuses against live children
- Check epic parent now certifies correct sprint count
- Check sprint 010 successor navigation
- Check 001-retrieval audit count matches live catalog
- Check 021-remediation vs 022 reconciliation
- Check Hydra safety-rail drill evidence status

---

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:known-context -->
## 13. KNOWN CONTEXT

### Prior v3 Review (2026-03-24)
- **Verdict:** FAIL (42/100)
- **Findings:** 6 P0, 38 P1, 14 P2 (58 total)
- **Iterations:** 20 of 20
- **Agents:** copilot + codex (GPT-5.4)
- **Key risk:** Trust failure in release evidence layer — parent/umbrella packets not authoritative

### Claimed Remediation (T31-T97)
- T31-T36: 6 P0 blockers cleared
- T37-T47: 11 count/inventory drift fixed
- T48-T63: 16 status/completion drift reconciled
- T64-T71: 8 missing docs/evidence resolved
- T72-T83: 12 code correctness/security P1 fixed
- T84-T97: 14 P2 closed or deferred

### Prior v1 Review
- Original 49-finding audit, all P0 verified fixed
- v2 narrow review: 84/100 PASS WITH NOTES

---

<!-- /ANCHOR:known-context -->
<!-- ANCHOR:cross-reference-status -->
## 14. CROSS-REFERENCE STATUS

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pending | — | Verify spec claims match implementation |
| `checklist_evidence` | core | pending | — | Verify checklist [x] items have backing evidence |
| `skill_agent` | overlay | pending | — | Verify skill contracts match agent files |
| `agent_cross_runtime` | overlay | pending | — | Verify agent consistency across runtimes |
| `feature_catalog_code` | overlay | pending | — | Verify catalog claims match implementation |
| `playbook_capability` | overlay | pending | — | Verify playbook preconditions match capabilities |

---

<!-- /ANCHOR:cross-reference-status -->
<!-- ANCHOR:files-under-review -->
## 15. FILES UNDER REVIEW

### Spec Tree (19 top-level phases, 70+ children)
| Area | Key Files | Focus |
|------|-----------|-------|
| Root 022 | spec.md, checklist.md | Phase status accuracy, dir counts |
| 001-epic + 12 sprints | spec.md, plan.md, tasks.md, checklist.md | Sprint count, phase map, navigation |
| 005-architecture-audit | spec.md, checklist.md | Navigation contract |
| 006-feature-catalog | spec.md, checklist.md | Snippet/category counts |
| 007-code-audit (22 children) | spec.md, checklist.md per child | Feature inventory counts, umbrella totals |
| 008-hydra-db (6 children) | spec.md, checklist.md per child | Safety-rail evidence, completion claims |
| 009-session-capturing (19 children) | spec.md, checklist.md per child | Status consistency, sequencing |
| 010-018 alignment/rewrite | spec.md, tasks.md | Completion vs live state |
| 015-manual-testing (22 children) | spec.md, checklist.md per child | Playbook paths, umbrella totals |

### Implementation Code
| Area | Key Files | Focus |
|------|-----------|-------|
| mcp_server/lib/ | memory-search.js, memory-save.js, handlers/ | BM25 fail-closed, session scope, governance |
| scripts/dist/ | generate-context.js, core/*.js | Signal handling, JSON input validation |
| shared/ | embedding handlers, startup validation | Provider validation, Voyage URL, retry atomicity |

---

<!-- /ANCHOR:files-under-review -->
<!-- ANCHOR:review-boundaries -->
## 16. REVIEW BOUNDARIES
- Max iterations: 20
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: track
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-03-25T06:42:00.000Z
<!-- /ANCHOR:review-boundaries -->
