---
title: "Feature Specification: 001-Retrieval Code Audit"
description: "Audit and align retrieval implementation, tests, and documentation across nine retrieval features. Close correctness and verification gaps, then record honest post-fix evidence."
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
| **Parent Spec** | ../spec.md |
| **Predecessor** | None |
| **Successor** | ../002-mutation/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Retrieval behavior and documentation had drifted. The audit surfaced correctness issues in token budget enforcement, transactional delete reporting, schema/index error handling, convergence scoring defaults, and backward-compatibility handling for older schemas. Several retrieval tests also had weak or placeholder assertions.

### Purpose
Verify all 9 retrieval features against real code and tests, fix the validated gaps, and keep documentation aligned with verified post-fix evidence.

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
- Spec-folder documentation accuracy for final post-fix state

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
| `mcp_server/handlers/memory-context.ts` | Modify | Enforce budget even for single-result / still-over-budget structured payloads via compaction + binary-search truncation fallback |
| `mcp_server/lib/search/vector-index-mutations.ts` | Modify | Ensure `delete_memories()` reports committed counts only and returns `deleted: 0` on rollback |
| `mcp_server/lib/search/vector-index-schema.ts` | Modify | Replace remaining silent catches with structured warnings; validate migration v14 file paths before read |
| `shared/algorithms/rrf-fusion.ts` | Modify | Set `fuseResultsMulti()` default convergence bonus to `CONVERGENCE_BONUS` |
| `shared/dist/algorithms/rrf-fusion.js` | Modify | Keep runtime build aligned with source convergence-bonus behavior |
| `mcp_server/lib/extraction/extraction-adapter.ts` | Modify | Add fallback to `file_path` lookup when `canonical_file_path` is unavailable |
| `mcp_server/tests/token-budget-enforcement.vitest.ts` | Modify | Strengthen token-budget assertions and add single-result structured compaction test |
| `mcp_server/tests/search-archival.vitest.ts` | Modify | Replace placeholder assertions with real source-contract/export assertions |
| `mcp_server/tests/memory-context.vitest.ts` | Modify | Replace default-mode todos with source-backed assertions |
| `mcp_server/tests/vector-index-impl.vitest.ts` | Modify | Replace tautological symlink fallback check and add batch-delete rollback regression test |
| `mcp_server/tests/bm25-index.vitest.ts` | Modify | Add positive title-change BM25 re-index regression test |
| `mcp_server/tests/memory-search-integration.vitest.ts` | Modify | Replace placeholder-heavy checks with concrete runtime/source assertions |
| `mcp_server/tests/rrf-fusion.vitest.ts` | Modify | Update convergence-bonus expectations for corrected default behavior |
| `mcp_server/tests/unit-rrf-fusion.vitest.ts` | Modify | Update convergence-bonus expectations for corrected default behavior |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Ensure token-budget enforcement cannot silently pass over-budget structured payloads | [x] `enforceTokenBudget()` compacts structured fields and falls back to binary-search truncation when still over budget |
| REQ-002 | Ensure mutation rollback reporting is transaction-correct | [x] `delete_memories()` now reports committed counts only and returns `deleted: 0` when transaction rolls back |
| REQ-003 | Eliminate silent catch behavior in retrieval schema/index flow | [x] Remaining silent catches replaced with structured warnings in `vector-index-schema.ts` |
| REQ-004 | Preserve intended multi-source ranking behavior in RRF fusion | [x] `fuseResultsMulti()` default convergence bonus restored to `CONVERGENCE_BONUS` in both source and dist runtime |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Keep extraction compatible with older schemas lacking canonical path column | [x] `resolveMemoryIdFromText()` falls back from `canonical_file_path` lookup to `file_path` lookup |
| REQ-006 | Remove weak retrieval-test assertions and placeholders in audited suites | [x] Placeholder/todo assertions replaced with concrete source/runtime assertions in target retrieval suites |
| REQ-007 | Add/adjust retrieval regressions for corrected behavior | [x] Token budget, vector-index rollback, BM25 title-change, and RRF convergence regressions are covered and passing |
| REQ-008 | Keep documentation and evidence synchronized with current verification reality | [x] Success metrics now reflect scoped and full-suite outcomes without unsupported score claims |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- [x] **SC-001**: All 9 retrieval features audited with structured findings and closure tasks
- [x] **SC-002**: TypeScript compile is clean (`tsc --noEmit` passes)
- [x] **SC-003**: Retrieval-targeted verification is green (`10` suites, `365` passed, `0` failed)
- [x] **SC-004**: Full-suite status is documented honestly (`7339` passed, `5` failed, `28` todo, `1` pending), with failures outside retrieval scope
- [x] **SC-005**: Unsupported score claims and stale pass-count claims are removed from this spec folder

### Acceptance Scenarios

1. **Given** the documented requirements for this phase, **When** a reviewer walks the updated packet, **Then** each requirement has a matching verification path in tasks and checklist artifacts.
2. **Given** current implementation behavior, **When** spec statements are compared with source and test references, **Then** no contradictory behavior claims remain in the phase packet.
3. **Given** the updated verification evidence, **When** checklist entries are audited, **Then** each completed P0/P1 item carries inline evidence and traceable context.
4. **Given** Level 2 template constraints, **When** the spec validator runs, **Then** acceptance-scenario coverage and section integrity checks pass without structural warnings.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Retrieval implementation modules (`handlers`, `lib/search`, `lib/extraction`, shared RRF) | Shared modules affect multiple features simultaneously | Keep fixes narrow and regression-test changed behavior |
| Dependency | Retrieval verification suites (targeted Vitest set) | Weak assertions can hide real regressions | Replace placeholders/todos with concrete assertions |
| Dependency | TypeScript compile gate | Type drift or missing exports can break MCP surfaces | Require clean `tsc --noEmit --pretty false` |
| Risk | Full repository suite has unrelated failures | Could be misread as retrieval instability | Explicitly separate scoped retrieval verification from repository-wide failures |
| Risk | Dist/source divergence in shared algorithms | Runtime behavior can drift from source behavior | Mirror RRF convergence fix in both `shared/algorithms` and `shared/dist` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- N/A for this audit-focused documentation alignment phase.

### Security
- Retrieval path handling and input validation must remain explicit; no hardcoded secrets or credential material is introduced by this phase.

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
| Scope | 16/25 | 9 audited features with correctness fixes across handlers, search libs, extraction, shared algorithm code, and retrieval tests |
| Risk | 11/25 | Shared retrieval/search modules carry medium regression risk; mitigated through scoped regressions and compile gate |
| Research | 15/20 | Feature-by-feature verification plus targeted and full-suite baseline reporting |
| **Total** | **40/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None — all resolved.
<!-- /ANCHOR:questions -->
