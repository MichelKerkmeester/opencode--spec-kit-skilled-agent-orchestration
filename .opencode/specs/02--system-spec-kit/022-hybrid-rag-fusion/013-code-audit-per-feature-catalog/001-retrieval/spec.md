---
title: "Feature Specification: 001-Retrieval Code Audit"
description: "Audit and align the retrieval feature catalog with actual TypeScript implementation and tests across nine retrieval features. The goal is to eliminate correctness gaps, standards violations, and catalog drift before the next phase."
trigger_phrases: ["retrieval", "code audit", "feature catalog", "specification", "level 2"]
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: 001-Retrieval Code Audit
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
Feature catalog behavior for retrieval can drift from implementation and tests over time. Before this phase, multiple retrieval features had correctness bugs, stale test references, and standards issues that reduced auditability and confidence in the documented "Current Reality".

### Purpose
Verify all 9 retrieval features against real code and tests, then close gaps so catalog, implementation, and verification evidence are aligned.

### Audit Criteria (Preserved)
1. Code correctness: logic bugs, off-by-one, null/undefined, error paths
2. Standards alignment: `sk-code--opencode` TypeScript checklist
3. Behavior match: code matches feature catalog "Current Reality"
4. Test coverage: tests exist and cover described behavior
5. Playbook mapping: EX-001..EX-009
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Retrieval feature catalog audit (`01--retrieval`) across 9 features
- Correctness and standards fixes discovered during audit
- Regression and coverage tests needed to close identified gaps
- Catalog corrections where source/test references were stale or incomplete

### Out of Scope
- New retrieval feature development not required by findings
- Non-retrieval feature categories outside `01--retrieval`
- Broad refactors unrelated to T-01 through T-09

### Feature Inventory (Preserved)
1. unified context retrieval memorycontext
2. semantic and lexical search memorysearch
3. trigger phrase matching memorymatchtriggers
4. hybrid search pipeline
5. 4 stage pipeline architecture
6. bm25 trigger phrase re index gate
7. ast level section retrieval tool
8. quality aware 3 tier search fallback
9. tool result extraction to working memory

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/handlers/memory-context.ts` | Modify | Fix fallback token-budget truncation signaling |
| `mcp_server/handlers/memory-triggers.ts` | Modify | Surface trigger-content load failures with warnings |
| `mcp_server/lib/search/hybrid-search.ts` | Modify | Align tier-3 score cap with documented 50% contract |
| `mcp_server/lib/providers/embeddings.ts` | Modify | Replace wildcard re-export with explicit named exports |
| `mcp_server/lib/scoring/folder-scoring.ts` | Modify | Replace wildcard re-export with explicit named exports |
| `mcp_server/lib/utils/path-security.ts` | Modify | Replace wildcard re-export with explicit named exports |
| `mcp_server/lib/search/vector-index-queries.ts` | Modify | Replace empty catch with structured warning |
| `mcp_server/lib/search/vector-index-schema.ts` | Modify | Replace empty catch with structured warning |
| `mcp_server/tests/token-budget-enforcement.vitest.ts` | Modify | Add malformed-payload budget fallback regression test |
| `mcp_server/tests/search-fallback-tiered.vitest.ts` | Modify | Add exact 50% tier-3 cap assertion |
| `mcp_server/tests/bm25-index.vitest.ts` | Modify | Add update-handler re-index gate positive/negative tests |
| `mcp_server/tests/memory-context.vitest.ts` | Modify | Update assertion impacted by truncation flag fix |
| `mcp_server/tests/working-memory.vitest.ts` | Modify | Add provenance upsert/conflict/checkpoint tests |
| `.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md` | Modify | Remove stale `retry.vitest.ts` reference |
| `.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md` | Modify | Remove stale `retry.vitest.ts` reference |
| `.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/03-trigger-phrase-matching-memorymatchtriggers.md` | Modify | Remove stale `retry.vitest.ts` reference |
| `.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/04-hybrid-search-pipeline.md` | Modify | Remove stale `retry.vitest.ts` reference |
| `.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/05-4-stage-pipeline-architecture.md` | Modify | Remove stale `retry.vitest.ts` reference |
| `.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/06-bm25-trigger-phrase-re-index-gate.md` | Modify | Add missing `memory-crud-update.ts` handler row |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Fix fallback token-budget truncation behavior (T-01) | [x] `enforceTokenBudget()` fallback path marks truncated responses correctly; [x] evidence recorded for `memory-context.ts` |
| REQ-002 | Add malformed-payload budget fallback regression coverage (T-02) | [x] Regression test added in `token-budget-enforcement.vitest.ts`; [x] suite passes |
| REQ-003 | Align tier-3 fallback cap with documented behavior (T-03) | [x] `0.9` cap corrected to `0.5` in `hybrid-search.ts`; [x] exact-cap assertion added and passing |
| REQ-004 | Complete BM25 re-index gate source/test coverage (T-04) | [x] Missing handler source row added to feature catalog; [x] positive/negative gate tests added and passing |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Surface trigger-content load failures (T-05) | [x] Silent blanking replaced with structured warning output; [x] return contract unchanged |
| REQ-006 | Replace retrieval-critical wildcard exports (T-06) | [x] Wildcard exports replaced with explicit named exports in target barrels; [x] `tsc --noEmit` clean |
| REQ-007 | Remove empty catches in retrieval search modules (T-07) | [x] Empty catches replaced with structured warnings in both target files; [x] lint/verification passed |
| REQ-008 | Harden 4-stage pipeline surfaces through shared fixes (T-08) | [x] Same-file fixes from T-06/T-07 applied to F-05 surfaces; [x] evidence linked in tasks |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- [x] **SC-001**: All 9 retrieval features audited with structured findings and closure tasks
- [x] **SC-002**: TypeScript compile is clean (`tsc --noEmit` passes)
- [x] **SC-003**: Verification tests pass (280 passed, 2 todo, 0 failed)
- [x] **SC-004**: Independent reviews score above 95/100 (99/100 + 96/100)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Retrieval feature catalog (`feature_catalog/01--retrieval`) | Incorrect source/test metadata can misdirect audits | Validate each feature's source and test list against live code |
| Dependency | Retrieval test suites (Vitest) | Regressions could hide in untested fallback paths | Add regression assertions for each fixed mismatch |
| Dependency | `sk-code--opencode` standards baseline | Inconsistent exports/error handling reduces maintainability | Apply named export and catch-block hygiene consistently |
| Risk | Shared retrieval modules touched by multiple features | Changes could regress adjacent retrieval behavior | Limit edits to audited surfaces and run targeted suites + type checks |
| Risk | Catalog-code drift reappears in later phases | Future audits lose trust in feature metadata | Keep feature-centric task tracking and evidence in this spec folder |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- N/A for this audit-focused documentation alignment phase.

### Security
- N/A for this audit-focused documentation alignment phase.

### Reliability
- N/A for this audit-focused documentation alignment phase.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- N/A for this audit-focused documentation alignment phase.

### Error Scenarios
- N/A for this audit-focused documentation alignment phase.

### State Transitions
- N/A for this audit-focused documentation alignment phase.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | 9 audited features, 19 touched files across handlers, libs, tests, and catalog docs |
| Risk | 10/25 | Medium shared-module risk, mitigated by focused tests and type/lint gates |
| Research | 15/20 | Feature-by-feature verification against implementation and tests |
| **Total** | **40/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None — all resolved.
<!-- /ANCHOR:questions -->
