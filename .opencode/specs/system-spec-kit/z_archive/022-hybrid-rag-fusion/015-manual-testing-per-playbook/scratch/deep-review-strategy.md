---
title: Deep Review Strategy - Feature Catalog ↔ Playbook ↔ Spec Phase Traceability
description: Runtime strategy tracking review progress across feature catalog, manual testing playbook, and spec phase documentation for system-spec-kit.
---

# Deep Review Strategy - Session Tracking

Runtime strategy for the deep review session. Tracks review progress across iterations.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Verify that every feature in the system-spec-kit feature catalog (222 entries across 21 categories) is properly referenced and connected to: (a) the manual testing playbook (230 scenarios across 19 categories), and (b) the spec phase documentation (22 phase folders). This is a traceability-focused review ensuring complete cross-referencing.

### Usage

- **Init:** Populated with scope, dimensions, and review boundaries.
- **Per iteration:** Each GPT-5.4 agent reviews assigned categories, updates findings.
- **Mutability:** Mutable — updated by orchestrator and agents throughout the session.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:topic -->
## 2. TOPIC

Review: Feature catalog ↔ Manual testing playbook ↔ Spec phase traceability for system-spec-kit

**Three artifact sets under review:**
1. **Feature Catalog:** `.opencode/skill/system-spec-kit/feature_catalog/` — 222 entries, 21 categories (01-21)
2. **Manual Testing Playbook:** `.opencode/skill/system-spec-kit/manual_testing_playbook/` — 230 scenarios, 19 categories (01-19) + root MANUAL_TESTING_PLAYBOOK.md
3. **Spec Phases:** `specs/system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/` — 22 phase folders (001-022)

**Key traceability checks:**
- Every feature catalog entry should map to at least one playbook scenario
- Every playbook scenario should reference its corresponding feature catalog entry
- Every feature should be referenced in the corresponding spec phase folder
- The playbook's Section 12 (Feature Catalog Cross-Reference Index) should be complete
- Categories 20-21 in feature catalog (stubs) should be properly handled

---

<!-- /ANCHOR:topic -->
<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
- [ ] D1 Correctness — Logic errors in cross-reference mappings, broken links, wrong IDs
- [ ] D2 Security — N/A for this review (documentation traceability)
- [ ] D3 Traceability — Feature catalog ↔ playbook ↔ spec phase alignment, cross-reference integrity
- [ ] D4 Maintainability — Naming consistency, documentation quality, navigability

---

<!-- /ANCHOR:review-dimensions -->
<!-- ANCHOR:non-goals -->
## 4. NON-GOALS
- Code correctness of the MCP server implementation
- Runtime behavior testing
- Feature catalog content accuracy (treated as source of truth)
- Automated test coverage

---

<!-- /ANCHOR:non-goals -->
<!-- ANCHOR:stop-conditions -->
## 5. STOP CONDITIONS
- All 21 feature catalog categories verified against playbook and spec phases
- All traceability gaps identified and documented
- Cross-reference index completeness confirmed
- No new findings discovered in final iteration

---

<!-- /ANCHOR:stop-conditions -->
<!-- ANCHOR:completed-dimensions -->
## 6. COMPLETED DIMENSIONS
[None yet — populated as iterations complete dimension reviews]

| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| | | | |

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
Iteration 1: Parallel review of all 21 categories via 7 GPT-5.4 agents.
- Agent 1: Categories 01-03 (Retrieval, Mutation, Discovery)
- Agent 2: Categories 04-07 (Maintenance, Lifecycle, Analysis, Evaluation)
- Agent 3: Categories 08-09 (Bug Fixes, Evaluation & Measurement)
- Agent 4: Categories 10-11 (Graph Signal, Scoring & Calibration)
- Agent 5: Categories 12-13 (Query Intelligence, Memory Quality & Indexing)
- Agent 6: Categories 14-16 (Pipeline, Retrieval Enhancements, Tooling & Scripts)
- Agent 7: Categories 17-21 (Governance, UX Hooks, Feature Flag, Remediation, Implement/Deprecated)

---

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:known-context -->
## 13. KNOWN CONTEXT
- Prior cross-check report exists in scratch/cross-check-report.md: PASSED — all 265 playbook IDs mapped to phases
- Playbook Section 12 contains Feature Catalog Cross-Reference Index
- Feature catalog has 21 categories; playbook has 19 (categories 20-21 are stubs in catalog)
- Feature catalog count (222) vs playbook count (230) suggests some scenarios test multiple features or have no 1:1 feature match
- Spec phases 020-022 exist in spec folder but not in playbook (these are audit/remediation phases)

---

<!-- /ANCHOR:known-context -->
<!-- ANCHOR:cross-reference-status -->
## 14. CROSS-REFERENCE STATUS

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pending | - | Spec phase docs reference correct playbook/catalog entries |
| `checklist_evidence` | core | pending | - | Checklist items have verification evidence |
| `feature_catalog_code` | overlay | pending | - | Every catalog entry maps to playbook scenario(s) |
| `playbook_capability` | overlay | pending | - | Every playbook scenario maps to catalog entry |

---

<!-- /ANCHOR:cross-reference-status -->
<!-- ANCHOR:files-under-review -->
## 15. FILES UNDER REVIEW

| Artifact Set | Files | Categories | Status |
|-------------|-------|------------|--------|
| Feature Catalog | 222 entries | 21 categories | pending |
| Manual Testing Playbook | 230 scenarios + root | 19 categories | pending |
| Spec Phase Folders | 22 phases + root docs | 22 folders | pending |
| Cross-Reference Index | Section 12 of MANUAL_TESTING_PLAYBOOK.md | 1 section | pending |

---

<!-- /ANCHOR:files-under-review -->
<!-- ANCHOR:review-boundaries -->
## 16. REVIEW BOUNDARIES
- Max iterations: 7
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[feature_catalog_code, playbook_capability]
- Started: 2026-03-26T09:10:00.000Z
<!-- /ANCHOR:review-boundaries -->
