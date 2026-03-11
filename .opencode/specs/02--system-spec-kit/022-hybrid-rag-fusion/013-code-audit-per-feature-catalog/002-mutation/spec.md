---
title: "Feature Specification: 002-Mutation Code Audit"
description: "Feature-centric audit and remediation of 10 mutation features in the Spec Kit Memory MCP server to validate correctness, standards alignment, behavior parity, and test coverage."
trigger_phrases: ["002-mutation", "mutation code audit", "feature catalog audit", "memory mcp mutation", "audit per feature"]
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: 002-Mutation Code Audit
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-03-10 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Mutation handlers and related mutation feature definitions can drift over time, creating correctness bugs, inconsistent validation behavior, missing audit trails, and documentation-to-code mismatches. Before this phase, several mutation paths had WARN/FAIL findings across validation contracts, transactional boundaries, and mutation history logging.

### Purpose
Verify all 10 mutation features against implementation reality, remediate high-priority defects, and produce evidence-backed completion artifacts.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Audit all 10 features in `feature_catalog/02--mutation/`.
- Execute feature-centric review criteria: correctness, standards alignment, behavior parity, test coverage, and playbook mapping.
- Implement and verify remediation tasks T-01 through T-09 (3 P0, 6 P1).
- Produce structured findings with PASS/WARN/FAIL and post-fix status annotations.

### Out of Scope
- Net-new feature development outside the mutation catalog - not part of the audit objective.
- Cross-category audits outside mutation phase `002-mutation` - handled in separate phase folders.
- P2 enhancements that do not block correctness or required behavior - explicitly deferred.

### Audit Context
- **Feature catalog:** `feature_catalog/02--mutation/`
- **Features:** 10
- **Complexity:** HIGH
- **Agent:** C2

### Features Audited
1. memory indexing memorysave
2. memory metadata update memoryupdate
3. single and folder delete memorydelete
4. tier based bulk deletion memorybulkdelete
5. validation feedback memoryvalidate
6. transaction wrappers on mutation handlers
7. namespace management crud tools
8. prediction error save arbitration
9. correction tracking with undo
10. per memory history log

### Audit Criteria
1. Code correctness - logic bugs, off-by-one, null/undefined, error paths
2. Standards alignment - `sk-code--opencode` TypeScript checklist
3. Behavior match - code matches feature catalog \"Current Reality\"
4. Test coverage - tests exist and cover described behavior
5. Playbook mapping - `EX-010..EX-017`, `NEW-*`

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/schemas/tool-input-schemas.ts` | Modify | Align `olderThanDays` minimum validation with schema contract. |
| `mcp_server/handlers/memory-bulk-delete.ts` | Modify | Add/adjust delete history recording and bulk delete behavior fixes. |
| `mcp_server/lib/learning/corrections.ts` | Modify | Make undo relation-scoped and surface edge-removal failures. |
| `mcp_server/lib/storage/history.ts` | Modify | Update history schema constraints and runtime compatibility. |
| `mcp_server/handlers/save/create-record.ts` | Modify | Wire `recordHistory('ADD')` in save transaction path. |
| `mcp_server/handlers/memory-crud-update.ts` | Modify | Make BM25 failure handling transactional and add update history recording. |
| `mcp_server/handlers/memory-crud-delete.ts` | Modify | Enforce safe bulk-folder delete behavior and delete history recording. |
| `mcp_server/handlers/save/reconsolidation-bridge.ts` | Modify | Collapse reconsolidation gating to canonical opt-in flag flow. |
| `mcp_server/lib/scoring/confidence-tracker.ts` | Modify | Replace success-shaped fallback with explicit throw behavior. |
| `.opencode/skill/system-spec-kit/feature_catalog/02--mutation/06-transaction-wrappers-on-mutation-handlers.md` | Modify | Correct source table coverage for wrapper feature documentation. |
| `mcp_server/lib/cognitive/prediction-error-gate.ts` | Modify | Ensure all PE decisions are logged. |
| `mcp_server/tests/confidence-tracker.vitest.ts` | Modify | Update tests for throw behavior in validation recording. |
| `mcp_server/tests/history.vitest.ts` | Modify | Add regression coverage for history schema migration behavior. |
| `mcp_server/tests/memory-save-ux-regressions.vitest.ts` | Modify | Adjust cleanup strategy for history persistence behavior. |
| `mcp_server/lib/search/vector-index-schema.ts` | Modify | Initialize history table lifecycle in companion schema init path. |
| `mcp_server/lib/search/vector-index-mutations.ts` | Modify | Preserve history rows during memory delete operations. |
| `mcp_server/context-server.ts` | Modify | Add history recording for file-watcher delete path. |
| `mcp_server/cli.ts` | Modify | Add history recording for CLI bulk delete path. |
| `mcp_server/handlers/memory-index.ts` | Modify | Add history recording for stale-record cleanup deletes. |
| `mcp_server/handlers/chunking-orchestrator.ts` | Modify | Add history recording before delete operations across re-chunk/rollback flows. |
| `mcp_server/lib/storage/reconsolidation.ts` | Modify | Add history recording for orphan conflict cleanup deletes. |
| `mcp_server/lib/storage/checkpoints.ts` | Modify | Add history recording for checkpoint restore clearExisting deletes. |
| `mcp_server/lib/search/vector-index-queries.ts` | Modify | Add history recording for integrity auto-clean delete operations. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Complete T-01: align `olderThanDays` validation across JSON schema, Zod schema, and handler guard. | Runtime and schema constraints both enforce `olderThanDays >= 1`; evidence recorded in T-01 as DONE. |
| REQ-002 | Complete T-02: make correction undo relation-scoped and prevent unintended edge deletion. | Undo deletes by source+target+relation and logs edge-removal failures; evidence recorded in T-02 as DONE. |
| REQ-003 | Complete T-03: wire `recordHistory` into live mutation paths. | Runtime mutation handlers populate history trail via ADD/UPDATE/DELETE events; evidence recorded in T-03 as DONE. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Complete T-04: unify reconsolidation gating to a single source of truth. | Bridge and internal defensive guard both require `SPECKIT_RECONSOLIDATION=true` (default OFF) with no semantic drift. |
| REQ-005 | Complete T-05: treat BM25 re-index failures with transactional correctness rules. | Infrastructure failures warn; data failures roll back transaction; update history recorded. |
| REQ-006 | Complete T-06: prevent partial bulk-folder deletes when DB handle is unavailable. | Bulk-folder no-DB path aborts with explicit error; no silent partial delete behavior remains. |
| REQ-007 | Complete T-07: expand validation feedback failure signaling consistency. | `recordValidation` throws on DB failure; tests updated to assert explicit failure path. |
| REQ-008 | Complete T-08: correct transaction-wrapper feature source table alignment. | Feature source table includes actual handler wrapper files and stale entries removed. |
| REQ-009 | Complete T-09: align prediction-error logging with "all decisions logged" contract. | All PE decision paths emit log entries when DB is available, including low/no-match creates. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 10 mutation features audited with structured PASS/WARN/FAIL findings.
- **SC-002**: TypeScript compile check is clean (`npx tsc --noEmit` passes with 0 errors).
- **SC-003**: Verification confirms the mutation fixes hold (`npx tsc --noEmit` clean, focused mutation suites green, full suite at `254 passed files / 5 failed files` and `7331 passed / 8 failed / 1 skipped / 30 todo` tests, with remaining failures outside mutation scope).
- **SC-004**: The 2026-03-11 re-audit closes the remaining mutation-specific correctness, schema-contract, and coverage gaps, and the spec folder reflects the current state rather than the older R11 snapshot.

### Acceptance Criteria (Original)
- [x] All 10 features audited with structured findings
- [x] Each feature has Status (PASS/WARN/FAIL), code issues, standards violations
- [x] Test gaps documented
- [x] Playbook scenarios mapped or gaps noted
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Feature catalog accuracy (`feature_catalog/02--mutation/*`) | Incorrect source mapping could skew audit outcomes | Cross-check catalog entries against actual implementation paths during each task. |
| Dependency | Test harness and fixtures for mutation flows | Deferred or thin integration assertions can hide behavior regressions | Add targeted regression tests and keep feature-catalog test mappings synchronized with real suites. |
| Risk | Silent catch/fallback patterns in mutation side effects | Audit trails can be lost without operator visibility | Convert success-shaped fallbacks to explicit warnings/errors where required. |
| Risk | History logging coverage gaps on delete paths | Incomplete lifecycle trail for destructive operations | Add `recordHistory('DELETE')` across all confirmed delete call sites and raw SQL paths. |
| Risk | Schema migration side effects on production SQLite | Migration errors could block runtime startup | Use guarded migration path and regression tests for legacy table conversion. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- N/A for audit documentation phase; no new runtime performance targets introduced.

### Security
- N/A for audit documentation phase; no auth model or secret handling changes introduced.

### Reliability
- N/A for audit documentation phase; reliability validation expressed through compile/test verification evidence.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- N/A for audit documentation phase.

### Error Scenarios
- N/A for audit documentation phase.

### State Transitions
- N/A for audit documentation phase.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | 10 feature audits plus 9 remediation tasks across handlers, schema, storage, and tests. |
| Risk | 15/25 | Mutation correctness and delete-history integrity are high-impact, mitigated by regression coverage and review rounds. |
| Research | 15/20 | Required multi-round evidence validation, source-table verification, and cross-AI review adjudication. |
| **Total** | **50/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None - all open questions were resolved during implementation and review.
<!-- /ANCHOR:questions -->
