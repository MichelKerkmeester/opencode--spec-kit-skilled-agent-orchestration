# Consolidated spec: Post-Review Remediation Epic

Consolidated on 2026-03-05 from the following source folders:

- 002-cross-cutting-remediation/spec.md
- 022-post-review-remediation/spec.md
- 023-flag-catalog-remediation/spec.md
- 024-timer-persistence-stage3-fallback/spec.md
- 025-finalized-scope/spec.md
- 026-opus-remediation/spec.md

---

## Source: 002-cross-cutting-remediation/spec.md

---
title: "Feature Specification: Comprehensive MCP Server Remediation"
description: "Consolidate cross-workstream remediation scope, constraints, and acceptance criteria for phase 006."
# SPECKIT_TEMPLATE_SOURCE: spec-core + phase-child-header | v2.2
trigger_phrases:
  - "refinement phase 1"
  - "phase 006"
  - "mcp server"
  - "hybrid rag refinement"
importance_tier: "important"
contextType: "implementation"
---
# Feature Specification: Comprehensive MCP Server Remediation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + phase-child-header | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0-P1 |
| **Status** | Complete |
| **Created** | 2026-03-01 |
| **Parent Spec** | ../000-feature-overview/spec.md |
| **Parent Plan** | ../000-feature-overview/plan.md |
| **Phase** | 10 of 10 |
| **Predecessor** | ../018-deferred-features/ |
| **Successor** | None (terminal remediation phase) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A consolidated remediation pass identified cross-cutting issues spanning correctness, dead-code cleanup, performance, and test reliability. Without a single bounded specification for this phase, validation and handoff quality degrade.

### Purpose
Define an explicit remediation scope with measurable outcomes so completion can be verified consistently across all work streams.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Work Stream 1: Correctness and safety fixes.
- Work Stream 2: Dead code elimination and cleanup.
- Work Stream 3: Performance and test-quality remediation.

### Out of Scope
- New architecture initiatives unrelated to identified remediation issues.
- Feature expansion beyond approved sprint goals.
- Unscoped test framework migrations.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Update | Add template source metadata, anchors, and phase-link references |
| `plan.md` | Update | Add template source metadata and structured execution anchors |
| `tasks.md` | Update | Add template source metadata and anchored task blocks |
| `implementation-summary.md` | Update | Add missing template source header |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-010-001 | Major remediation streams are explicitly captured | Spec lists all remediation streams and bounded scope |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-010-002 | Validation-critical metadata is present | Anchors and template-source markers are present in required files |
| REQ-010-003 | Verification remains reproducible | Plan and tasks define deterministic validation flow |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-010-001**: Recursive validator exits with code 0 or 1 (not 2) for this spec tree.
- **SC-010-002**: Required phase docs and metadata markers are present and parseable.
- **SC-010-003**: Remaining warnings are non-blocking and explicitly reportable.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Preceding phase links and parent spec integrity | Incomplete lineage validation | Maintain explicit parent/predecessor references |
| Risk | Over-correcting non-blocking warnings during blocker remediation | Scope drift and unnecessary churn | Restrict edits to hard/major blockers first |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which non-blocking warnings should be deferred to follow-up documentation hardening?
- Should this terminal phase be promoted to Level 2 in a separate, non-blocking pass?
<!-- /ANCHOR:questions -->

---

## Phase Navigation

- Predecessor: `008-subfolder-resolution-fix`
- Successor: `022-post-review-remediation`

## Acceptance Scenarios (Validator Coverage)
1. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
2. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.


---

## Source: 022-post-review-remediation/spec.md

---
title: "Post-Review Remediation: 59 Findings from 25-Agent Comprehensive Review"
description: "Remediation of 2 P0 blockers, 19 P1 required fixes, and 38 P2 improvements discovered during comprehensive 25-agent review of the Spec Kit Memory MCP server."
SPECKIT_TEMPLATE_SOURCE: "spec-core | v2.2"
trigger_phrases:
  - "post-review remediation"
  - "25-agent review findings"
  - "P0 P1 P2 fixes"
  - "comprehensive review remediation"
importance_tier: "critical"
contextType: "implementation"
---
# Post-Review Remediation: 59 Findings from 25-Agent Review

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
| **Created** | 2026-03-01 |
| **Parent** | `022-hybrid-rag-fusion` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A comprehensive 25-agent review of the Spec Kit Memory MCP server (`.opencode/skill/system-spec-kit/mcp_server/`) discovered 59 findings across 173 source files: 2 P0 blockers (schema/migration gaps), 19 P1 required fixes (code logic, error handling, standards, documentation), and 38 P2 improvements.

### Purpose
Remediate all P0 and P1 findings to ensure schema correctness, pipeline completeness, code quality standards, and documentation accuracy. P2 improvements are documented for future work.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- All P0 findings (2 blockers)
- All P1 findings (19 required fixes)
- Documentation of P2 findings for tracking

### Out of Scope
- P2 improvements (38) — documented but deferred to future phase
- New feature development
- Performance optimization beyond fixing P1-7

### Files to Change

| File Path | Change Type | Findings |
|-----------|-------------|----------|
| `mcp_server/lib/search/vector-index-impl.ts` | Modify | P0-1, P1-10 |
| `mcp_server/tests/reconsolidation.vitest.ts` | Modify | P0-2 |
| `mcp_server/handlers/memory-search.ts` | Modify | P1-3, P1-4 |
| `mcp_server/lib/search/mmr-reranker.ts` | Read | P1-3 |
| `mcp_server/lib/cognitive/co-activation.ts` | Modify | P1-4, P1-9 |
| `mcp_server/handlers/memory-save.ts` | Modify | P1-5, P1-14 |
| `mcp_server/lib/search/query-expander.ts` | Modify | P1-6 |
| `mcp_server/lib/eval/eval-metrics.ts` | Modify | P1-7 |
| `mcp_server/lib/search/graph-search-fn.ts` | Modify | P1-8 |
| `mcp_server/startup-checks.ts` | Modify | P1-11 |
| `mcp_server/lib/cache/tool-cache.ts` | Modify | P1-11 |
| `mcp_server/lib/search/pipeline/stage3-rerank.ts` | Modify | P1-11, P1-12 |
| `mcp_server/lib/search/vector-index-impl.ts` | Modify | P1-11 |
| `mcp_server/handlers/memory-crud-health.ts` | Modify | P1-11 |
| `mcp_server/handlers/memory-crud-update.ts` | Modify | P1-11 |
| `mcp_server/handlers/save-quality-gate.ts` | Modify | P1-13, P1-16 |
| `mcp_server/lib/search/hybrid-search.ts` | Modify | P1-14 |
| `mcp_server/handlers/memory-context.ts` | Modify | P1-15 |
| `mcp_server/lib/search/composite-scoring.ts` | Modify | P1-17 |
| `mcp_server/tool-schemas.ts` | Modify | P1-17 |
| `summary_of_existing_features.md` | Modify | P1-18, P1-20, P1-21 |
| `summary_of_new_features.md` | Modify | P1-18 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Finding | Description | File | Lines |
|----|---------|-------------|------|-------|
| P0-1 | `learned_triggers` column missing | Column referenced in code but absent from CREATE TABLE schema AND migration | `vector-index-impl.ts` | 1843-1891 |
| P0-2 | `frequency_counter` in test but not production | Test schema includes column not in production schema | `reconsolidation.vitest.ts` | 91, 390 |

### P1 - Code Logic (8)

| ID | Finding | Description | File |
|----|---------|-------------|------|
| P1-3 | MMR absent from Pipeline V2 | MMR reranking not wired into V2 orchestrator path | `memory-search.ts` |
| P1-4 | Co-activation absent from Pipeline V2 | Co-activation spreading not in V2 path | `memory-search.ts` |
| P1-5 | 5 duplicated SQL UPDATE blocks | Identical SQL blocks repeated 5 times | `memory-save.ts` |
| P1-6 | Regex from user input — ReDoS vector | Unsanitized user input used in `new RegExp()` | `query-expander.ts` |
| P1-7 | Intent-weighted NDCG extreme scaling | 3*5=15 extreme grade produces distorted NDCG | `eval-metrics.ts` |
| P1-8 | Graph channel SQL uses `id` not `memory_id` | Possible wrong column reference in graph search | `graph-search-fn.ts` |
| P1-9 | Co-activation fetches maxRelated+1 | Should be 2*maxRelated per spec | `co-activation.ts` |
| P1-10 | `interference_score` missing from CREATE TABLE | Column in migration but not base schema | `vector-index-impl.ts` |

### P1 - Error Handling (2)

| ID | Finding | Description | Files |
|----|---------|-------------|-------|
| P1-11 | 7 bare `catch` without `: unknown` | TypeScript strict mode violation | 5 files |
| P1-12 | Duplicate import | Same import on consecutive lines | `stage3-rerank.ts:20-21` |

### P1 - Standards (5)

| ID | Finding | Description | Files |
|----|---------|-------------|-------|
| P1-13 | Narrative "what" comments | Comments describe obvious code | `save-quality-gate.ts:206-226` |
| P1-14 | Sprint-tracking comments | Outdated sprint references in imports | `hybrid-search.ts`, `memory-save.ts` |
| P1-15 | Import ordering | `crypto` import after internal imports | `memory-context.ts:1-9` |
| P1-16 | Missing TSDoc on exports | Exported functions lack documentation | `save-quality-gate.ts` |
| P1-17 | Mixed section divider styles | Inconsistent divider formatting | `tool-schemas.ts`, `composite-scoring.ts` |

### P1 - Documentation (4)

| ID | Finding | Description | Files |
|----|---------|-------------|-------|
| P1-18 | 3 flags missing/misnamed in docs | BM25_CHANNEL, DEGREE_CHANNEL, FEEDBACK_LEARNING | `summary_of_*.md` |
| P1-19 | 43 undocumented feature flags | Feature flags exist in code but not documented | — |
| P1-20 | `minState` default incorrect | Docs say wrong default value | `summary_of_existing_features.md` |
| P1-21 | `asyncEmbedding` undocumented | Parameter exists but not in docs | `summary_of_existing_features.md` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All P0 findings resolved — `tsc --noEmit` passes
- **SC-002**: All P1 findings resolved — `npm test` passes
- **SC-003**: Build succeeds — `npm run build` passes
- **SC-004**: MCP smoke test — `memory_health`, `memory_stats`, `memory_search` functional
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Schema changes break existing databases | High | Migration-only approach, no destructive DDL |
| Risk | Pipeline V2 wiring introduces regressions | Medium | Feature-flag gated (SPECKIT_MMR, SPECKIT_COACTIVATION) |
| Risk | SQL dedup refactor changes save behavior | Medium | Extract helper without changing logic |
| Dependency | Existing test suite coverage | Medium | Run full suite before and after |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Security
- **NFR-S01**: ReDoS prevention — all user-derived regex must be sanitized (P1-6)

### Reliability
- **NFR-R01**: Schema consistency — production and test schemas must match
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | 20+ files, ~500 LOC changes |
| Risk | 15/25 | Schema changes, pipeline wiring |
| Research | 5/20 | Findings already documented |
| **Total** | **38/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## P2 FINDINGS (Deferred — 38 items)

Tracked for future phases. Categories include:
- Code quality improvements (naming, structure)
- Additional test coverage
- Performance optimizations
- Extended documentation
- Tooling enhancements

Full details available in the 25-agent synthesis report.

---

## Phase Navigation

| **Parent Spec** | ../spec.md |
- Predecessor: `021-cross-cutting-remediation`
- Successor: `023-flag-catalog-remediation`

## Supplemental Requirements
- REQ-DOC-001: Keep documentation internally consistent with existing phase artifacts and validation output.
- REQ-DOC-002: Keep documentation internally consistent with existing phase artifacts and validation output.
- REQ-DOC-003: Keep documentation internally consistent with existing phase artifacts and validation output.
- REQ-DOC-004: Keep documentation internally consistent with existing phase artifacts and validation output.
- REQ-DOC-005: Keep documentation internally consistent with existing phase artifacts and validation output.

## Acceptance Scenarios (Validator Coverage)
1. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
2. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
3. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
4. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.


---

## Source: 023-flag-catalog-remediation/spec.md

---
title: "P1-19 Flag Catalog + Refinement Phase 3"
description: "Address P1-19 (undocumented feature flags) and 38 P2 findings from 25-agent code review across code quality, performance, documentation, testing, and architecture."
SPECKIT_TEMPLATE_SOURCE: "spec-core | v2.2"
trigger_phrases:
  - "refinement phase 3"
  - "flag catalog"
  - "code review fixes"
  - "p2 improvements"
importance_tier: "important"
contextType: "implementation"
---
# P1-19 Flag Catalog + Refinement Phase 3

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 (flag catalog) + P2 (all others) |
| **Status** | Complete |
| **Created** | 2026-03-01 |
| **Branch** | `main` (no feature branch — skip-branch) |
| **Parent** | 022-post-review-remediation |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 25-agent code review (013) resolved all P0 and most P1 findings. Two categories remain: P1-19 (43+ undocumented environment variable feature flags) and 38 P2 improvements spanning code quality, performance, inline documentation, testing, and architecture across the MCP server.

### Purpose
Close all remaining review findings to achieve a clean audit trail, documented flag catalog, and improved code quality across the MCP server.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- P1-19: Feature flag catalog documenting all 80+ `SPECKIT_*`, `ENABLE_*`, `SESSION_*`, `TOOL_CACHE_*`, `MCP_*`, and `MEMORY_*` env vars
- 38 P2 improvements: score normalization, type safety, SQL indexes, Set dedup, JSDoc, inline docs, dead export cleanup, test additions, pipeline I/O contracts

### Out of Scope
- P0/P1 fixes (already completed in 013)
- New features or architectural changes
- Performance benchmarking (fix only, no measurement)

### Files to Change

~27 source files + 2 docs + 2-3 new test files across `mcp_server/`
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | TypeScript compiles cleanly | `tsc --noEmit` exits 0 |
| REQ-002 | All existing tests pass | `npm test` passes |

### P1 - Required
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Flag catalog covers 50+ env vars | Grep verification shows all SPECKIT_* flags documented |
| REQ-004 | All 38 P2 findings addressed or documented as N/A | Each finding has corresponding code change or skip justification |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `tsc --noEmit` exits 0 with all changes
- **SC-002**: Full test suite passes (7000+ tests)
- **SC-003**: Flag catalog contains 50+ documented env vars
- **SC-004**: All 38 P2 findings closed (fixed, documented, or N/A)
<!-- /ANCHOR:success-criteria -->

---

## 6. EXECUTION STRATEGY

3-wave parallel agent execution:
- **Wave 1** (5 Opus): Code quality + performance fixes
- **Wave 2** (5 mixed): Documentation + observability
- **Wave 3** (4 mixed): Testing + architecture docs

---

## Phase Navigation

| **Parent Spec** | ../spec.md |
- Successor: `024-timer-persistence-stage3-fallback`

## Supplemental Requirements
- REQ-DOC-005: Keep documentation internally consistent with existing phase artifacts and validation output.

## Acceptance Scenarios (Validator Coverage)
1. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
2. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
3. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
4. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.


---

## Source: 024-timer-persistence-stage3-fallback/spec.md

---
title: "Spec: Refinement Phase 4"
description: "Phase 4 remediation scope for warn-only timer persistence and stage3 effective score fallback hardening."
SPECKIT_TEMPLATE_SOURCE: "spec-core | v2.2"
importance_tier: "important"
contextType: "implementation"
---

# Spec: Refinement Phase 4

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- ANCHOR:summary -->

**Parent:** 022-hybrid-rag-fusion
**Level:** 2
**Status:** In Progress
**Created:** 2026-03-02

## Problem

Gemini code review (two reviews: 88/100 and 85/100, both Conditional Pass) identified two P1 issues requiring fixes before full approval:

1. **Warn-only timer persistence** — `qualityGateActivatedAt` in `save-quality-gate.ts` is stored in-memory only. Server restarts reset the 14-day graduation countdown, preventing the quality gate from ever leaving warn-only mode.

2. **Stage 3 effectiveScore() fallback gap** — `effectiveScore()` in `stage3-rerank.ts` skips `intentAdjustedScore` and `rrfScore` in its fallback chain. Additionally, Stage 3 overwrites the `score` field at line 312, violating the Score Immutability Invariant documented in `stage2-fusion.ts:38-43`.

## Scope

### In Scope
- Persist `qualityGateActivatedAt` to SQLite `config` table using existing kv_store pattern
- Update `effectiveScore()` fallback chain to include `intentAdjustedScore` and `rrfScore`
- Address Stage 3 score immutability invariant violation
- Tests for both fixes

### Out of Scope
- P2 items (memory-save.ts refactor, Stage 2 normalization, negative momentum cap)
- Any pipeline behavioral changes beyond the fallback chain fix

## Success Criteria
- [ ] Quality gate activation timestamp persists across server restarts
- [ ] `effectiveScore()` checks `intentAdjustedScore` -> `rrfScore` -> `score` -> `similarity/100`
- [ ] Stage 3 preserves Stage 2's `score` field (writes to `rerankScore` only, or documents why overwrite is acceptable)
- [ ] All 7,008+ existing tests pass
- [ ] New tests cover persistence and fallback scenarios
<!-- /ANCHOR:summary -->

---

## Phase Navigation

| **Parent Spec** | ../spec.md |
- Predecessor: `023-flag-catalog-remediation`
- Successor: `025-finalized-scope`

## Problem Statement
Documentation-level normalization for validator completeness without changing implementation outcomes.

## Requirements
- REQ-DOC-BASE: Maintain current factual implementation statements while improving structural completeness.

## Supplemental Requirements
- REQ-DOC-002: Keep documentation internally consistent with existing phase artifacts and validation output.
- REQ-DOC-003: Keep documentation internally consistent with existing phase artifacts and validation output.
- REQ-DOC-004: Keep documentation internally consistent with existing phase artifacts and validation output.
- REQ-DOC-005: Keep documentation internally consistent with existing phase artifacts and validation output.

## Acceptance Scenarios (Validator Coverage)
1. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
2. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
3. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
4. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.


---

## Source: 025-finalized-scope/spec.md

---
title: "Feature Specification: Refinement Phase 5 Finalized Scope [template:level_2/spec.md]"
description: "Level 2 child scope finalized across tranche-1 through tranche-4, including summary alignment, quality-gate robustness, hybrid-search hardening, and child-doc closeout."
SPECKIT_TEMPLATE_SOURCE: "spec-core + level2-verify | v2.2"
trigger_phrases:
  - "refinement phase 5"
  - "summary_of_existing_features"
  - "isInShadowPeriod contradiction"
  - "save-quality-gate ensure config"
  - "phase 016 tranche-1 through tranche-4"
importance_tier: "important"
contextType: "implementation"
---
# Feature Specification: Refinement Phase 5 Finalized Scope

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0/P1 |
| **Status** | Completed |
| **Created** | 2026-03-02 |
| **Branch** | `022-hybrid-rag-fusion/025-finalized-scope` |
| **Parent Spec** | `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/` |
| **Predecessor Context** | `024-timer-persistence-stage3-fallback/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

This child phase is now complete and records a bounded multi-tranche remediation sequence. Delivered scope includes tranche-1 summary alignment and quality-gate hardening, tranche-2 canonical ID dedup hardening, tranche-3 activation-window/fallback-channel continuity fixes plus targeted parent summary alignment updates, and tranche-4 parent-summary documentation polish.

### Purpose

Document and verify the finalized tranche-1 through tranche-4 outcomes with explicit evidence so the child folder accurately reflects completed remediation and remains aligned with parent summary truth.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Tranche-1 delivered fixes: summary wording/contradiction corrections and `save-quality-gate.ts` config-table ensure robustness across DB reinitialization/handle changes.
- Tranche-2 delivered fixes: canonical ID dedup hardening in `combinedLexicalSearch()` and legacy `hybridSearch()`.
- Tranche-3 delivered fixes: persisted activation timestamp continuity and tier-2 fallback `forceAllChannels` behavior, plus targeted parent-summary truth alignment corrections.
- Tranche-4 delivered fixes: parent-summary P2 documentation-polish items A-F and child status-doc finalization.
- Keep Level 2 child docs synchronized to completed scope and verification evidence.

### Out of Scope
- Any remediation items not directly tied to the completed tranche-1 through tranche-4 targets listed above.
- Additional feature work, refactors, or architectural redesign.
- Parent-folder rewrites outside the targeted summary-fix and documentation-polish updates.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/025-finalized-scope/spec.md` | Modify | Finalized child scope, requirements, and acceptance scenarios for completed tranches |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/025-finalized-scope/plan.md` | Modify | Finalized phase continuity and verification strategy through tranche-4 |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/025-finalized-scope/tasks.md` | Modify | Completed task ledger and final completion criteria |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/025-finalized-scope/checklist.md` | Modify | P0/P1 checklist mapped to the three fixes |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/025-finalized-scope/implementation-summary.md` | Modify | Finalized multi-tranche outcomes and evidence summary |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/000-feature-overview/summary_of_existing_features.md` | Modify (implementation tranche) | Terminology alignment for RSF/shadow/fallback/floor/reconsolidation |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/000-feature-overview/summary_of_new_features.md` | Modify (implementation tranche) | Resolve `isInShadowPeriod` contradiction |
| `.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts` | Modify (implementation tranche) | Harden config-table ensure behavior and activation-window continuity |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts` | Modify (implementation tranche) | Canonical ID dedup hardening and tier-2 fallback `forceAllChannels` override |
| `.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts` | Modify (implementation tranche) | Regression tests for canonical dedup and tier-2 fallback channel forcing |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Parent summary docs are aligned for tranche-1, tranche-3, and tranche-4 targeted documentation corrections. | `summary_of_existing_features.md` and `summary_of_new_features.md` reflect consistent RSF/shadow/fallback/floor/reconsolidation, `isInShadowPeriod`, gating/instrumentation/hook-scope/dead-code, and P2 A-F polish truth. |
| REQ-002 | `save-quality-gate.ts` robustness fixes cover both DB-handle churn and persisted activation-window continuity. | Config-table ensure behavior remains valid after DB handle changes, and persisted activation timestamp is preserved across restart; targeted tests pass. |
| REQ-003 | Hybrid-search remediation is complete for canonical dedup and tier-2 all-channel fallback forcing. | Canonicalization is applied in both modern and legacy dedup paths, and `forceAllChannels` is honored for tier-2 fallback; regression tests pass. |
| REQ-004 | Child Level 2 docs are synchronized to finalized tranche-1 through tranche-4 scope. | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` all reflect completed multi-tranche scope and evidence references. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Verification commands are finalized and executable for child validation and targeted MCP suite coverage. | `tasks.md` and `plan.md` include child validation command and expanded targeted suite command with passing evidence (`176 tests`). |
| REQ-006 | Acceptance scenarios are explicit for completed Level 2 verification depth. | At least four acceptance scenarios map to completed multi-tranche outcomes and verification closure. |

### Acceptance Scenarios

1. **Given** parent summary files are within targeted remediation scope, **when** tranche-1/tranche-3/tranche-4 summary updates are applied, **then** targeted contradiction and terminology alignment points remain coherent across both summaries.
2. **Given** SQLite handles and process lifecycle can change, **when** save-quality-gate persistence helpers initialize and run, **then** config-table ensure behavior and activation-window timestamp state remain stable.
3. **Given** hybrid search receives mixed memory ID encodings and simple-routed queries, **when** dedup and tier-2 fallback execute, **then** canonical dedup and all-channel fallback behavior are preserved.
4. **Given** tranche-1 through tranche-4 tasks are complete, **when** expanded targeted tests and child validation run, **then** targeted suite passes (`176 tests`) and child validation exits with zero errors.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The child spec reflects finalized, bounded tranche-1 through tranche-4 remediation scope with no stale in-progress language.
- **SC-002**: Parent summary contradiction/wording and P2 polish updates are captured as completed in-scope outcomes with evidence references.
- **SC-003**: Runtime fixes (`save-quality-gate.ts`, `hybrid-search.ts`) are captured with targeted passing regression coverage.
- **SC-004**: Child-folder validation reports zero errors after final documentation alignment.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Over-extending parent-summary edits beyond targeted tranche items | Medium | Keep parent edits bounded to documented tranche-1/tranche-3/tranche-4 correction sets |
| Risk | Runtime regressions in persistence or fallback logic after hardening | High | Maintain focused regression coverage and expanded targeted suite evidence in child records |
| Dependency | Existing `mcp_server` test harness (`vitest`) | Medium | Use expanded targeted command and capture outputs in `tasks.md`, `checklist.md`, and summary evidence |
| Dependency | Parent-phase context from `023` and predecessor `015` | Low | Keep lineage references in child docs while treating targeted parent summary fixes as in scope |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The save-quality-gate robustness fix introduces no measurable regression in targeted validation/test runs.
- **NFR-P02**: Child-folder validation remains a single-pass operation.

### Security
- **NFR-S01**: No secrets, credentials, or sensitive runtime data are added in docs or tests.
- **NFR-S02**: Evidence artifacts are text-only and safe for repository storage.

### Reliability
- **NFR-R01**: Config-table ensure behavior remains deterministic across repeated DB handle changes.
- **NFR-R02**: Child validation output remains stable (exit 0 or 1, no errors) after doc updates.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- `summary_of_existing_features.md` has multiple mentions of the same feature-flag topic; all references must remain mutually consistent.
- `summary_of_new_features.md` references removed dead code and historical context; contradiction fix must preserve historical notes without conflicting present-tense claims.

### Error Scenarios
- DB handle replacement occurs after initial config-table ensure and old ensure cache is stale.
- Validation passes structurally but wording contradiction remains semantically unresolved in summaries.

### State Transitions
- Current state: all planned remediation tranches in this child are completed and verified.
- Post-tranche state: child docs remain stable as final status artifacts; new remediation needs roll into a subsequent child folder.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Three targeted implementation fixes with strict boundary |
| Risk | 18/25 | DB handle lifecycle robustness can affect persistence reliability |
| Research | 10/20 | Requires contradiction and wording alignment against current source text |
| **Total** | **42/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- No open blockers for this child; verification evidence is fully captured in child status docs.
- Any new contradiction or drift findings should be deferred to the next child scope (for example `017-*`) unless explicitly reopened.
<!-- /ANCHOR:questions -->

---

<!-- End of filled Level 2 specification for child 016 (tranche-1 through tranche-4 aligned). -->

---

## Phase Navigation

- Successor: `026-opus-remediation`


---

## Source: 026-opus-remediation/spec.md

---
title: "Feature Specification: Refinement Phase 6 — Opus Review Remediation"
description: "37 remediation fixes (4 P0 + 33 P1) identified by 10-agent Opus review of the spec-kit-memory MCP server."
SPECKIT_TEMPLATE_SOURCE: "spec-core + level2-verify + level3-arch | v2.2"
trigger_phrases:
  - "refinement phase 6"
  - "opus review remediation"
  - "P0 P1 fixes"
  - "017 remediation"
importance_tier: "critical"
contextType: "implementation"
---
# Feature Specification: Refinement Phase 6 — Opus Review Remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

A 10-agent comprehensive review of the `022-hybrid-rag-fusion` codebase identified 4 P0 critical and 34 P1 important issues across the spec-kit-memory MCP server. Two prior phases (015, 016) resolved adjacent findings. This spec addresses the remaining 37 fixes across 5 implementation sprints: legacy pipeline removal, scoring/fusion corrections, pipeline/mutation hardening, graph/cognitive fixes, and evaluation housekeeping.

**Key Decisions**: Remove legacy V1 pipeline entirely (was already default-off), create shared `resolveEffectiveScore()` function, improve stemmer for double-consonant handling.

**Critical Dependencies**: Sprint 1 (legacy removal) blocks Sprints 2–4.

---

## 1. METADATA

<!-- ANCHOR:metadata -->

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 (4 critical) + P1 (33 important) |
| **Status** | Complete |
| **Created** | 2026-03-02 |
| **Parent** | `022-hybrid-rag-fusion` |
| **Siblings** | `015-gemini-review-p1-fixes` (complete), `016-alignment-remediation` (complete) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 10-agent Opus review identified 38 issues. 37 remain unresolved: 4 P0 critical bugs (inverted STATE_PRIORITY in legacy pipeline, scoring order divergence, MAX_DEEP_QUERY_VARIANTS mismatch, orphaned chunk corruption) and 33 P1 issues spanning scoring inaccuracies, mutation data leaks, graph integrity gaps, and evaluation framework defects. Fix #11's Stage 3 side was resolved by 015-gemini-review-p1-fixes.

### Purpose
Resolve all 37 remaining findings to achieve a clean, consistent, single-pipeline codebase with correct scoring, complete cleanup on delete, robust graph integrity, and reliable evaluation metrics.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **Sprint 1:** Remove legacy V1 pipeline (~600 LOC), deprecate `isPipelineV2Enabled()`, add orphaned chunk detection
- **Sprint 2:** Fix 8 scoring/fusion issues (#5–#12) including shared `resolveEffectiveScore()`
- **Sprint 3:** Fix 10 pipeline/retrieval/mutation issues (#13–#16, #18–#23)
- **Sprint 4:** Fix 9 graph/causal/cognitive issues (#24–#32)
- **Sprint 5:** Fix 6 evaluation/housekeeping issues (#33–#38)
- New tests for each fix (~50–100 total)

### Out of Scope
- P2/P3 findings from the same review — tracked separately
- Parent summary documentation updates — completed in 016
- Stage 3 `effectiveScore()` fallback chain — already fixed in 015

### Files to Change

| File Path | Change Type | Sprint |
|-----------|-------------|--------|
| `handlers/memory-search.ts` | Remove ~600 lines | 1 |
| `lib/search/search-flags.ts` | Modify | 1 |
| `lib/search/vector-index-impl.ts` | Modify | 1, 3 |
| `lib/search/intent-classifier.ts` | Modify | 2 |
| `lib/scoring/composite-scoring.ts` | Modify | 2 |
| `lib/search/hybrid-search.ts` | Modify | 2 |
| `lib/search/rrf-fusion.ts` | Modify | 2 |
| `lib/search/adaptive-fusion.ts` | Modify | 2 |
| `lib/search/pipeline/stage2-fusion.ts` | Modify | 2 |
| `lib/search/pipeline/types.ts` | Modify | 2 |
| `lib/scoring/interference-scoring.ts` | Modify | 2 |
| `tool-schemas.ts` | Modify | 3 |
| `lib/search/pipeline/stage4-filter.ts` | Modify | 3 |
| `lib/search/pipeline/stage1-candidate-gen.ts` | Modify | 3 |
| `lib/search/bm25-index.ts` | Modify | 3 |
| `handlers/memory-crud-update.ts` | Modify | 3 |
| `lib/storage/transaction-manager.ts` | Modify | 3 |
| `handlers/memory-save.ts` | Modify | 3 |
| `lib/storage/causal-edges.ts` | Modify | 4 |
| `handlers/causal-graph.ts` | Modify | 4 |
| `lib/graph/community-detection.ts` | Modify | 4 |
| `lib/cognitive/working-memory.ts` | Modify | 4 |
| `handlers/memory-triggers.ts` | Modify | 4 |
| `lib/session/session-manager.ts` | Modify | 4, 5 |
| `lib/cognitive/co-activation.ts` | Modify | 4 |
| `handlers/eval-reporting.ts` | Modify | 5 |
| `lib/eval/eval-logger.ts` | Modify | 5 |
| `handlers/session-learning.ts` | Modify | 5 |
| `tools/types.ts` | Modify | 5 |
| `lib/storage/access-tracker.ts` | Modify | 5 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-P0-1 | Remove inverted STATE_PRIORITY from legacy pipeline | Legacy `STATE_PRIORITY` map deleted; V2 pipeline is the only code path |
| REQ-P0-2 | Remove scoring order divergence | Legacy `postSearchPipeline()` deleted; no dual scoring paths exist |
| REQ-P0-3 | Remove MAX_DEEP_QUERY_VARIANTS mismatch | Legacy `MAX_DEEP_QUERY_VARIANTS=6` deleted; only V2 variant generation remains |
| REQ-P0-4 | Add orphaned chunk detection | `verify_integrity()` detects and optionally cleans orphaned chunks |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-P1-5 | Intent weights include recency | `applyIntentWeights` uses timestamp-based recency scoring |
| REQ-P1-6 | Five-factor weights normalize to 1.0 | Weights auto-normalize after partial override merge |
| REQ-P1-7 | No stack overflow on large arrays | Loop-based min/max replaces spread operator |
| REQ-P1-8 | BM25 specFolder filter works | DB lookup replaces ID comparison |
| REQ-P1-9 | No convergence double-counting | Per-variant bonus subtracted before cross-variant bonus |
| REQ-P1-10 | Adaptive fusion weights normalize | Core weights sum to 1.0 after doc-type adjustments |
| REQ-P1-11 | Stage 2/3 score consistency | Shared `resolveEffectiveScore()` in types.ts, used by both stages |
| REQ-P1-12 | Interference threshold configurable | Optional `threshold` parameter with default |
| REQ-P1-13 | Schema exposes hidden params | `trackAccess`, `includeArchived`, `mode` in schema |
| REQ-P1-14 | Dead dedup config removed | `sessionDeduped` removed from Stage 4 metadata |
| REQ-P1-15 | Constitutional count accurate | Stage 1 count flows to Stage 4 output |
| REQ-P1-16 | No duplicate embedding calls | Embedding cached and reused for constitutional path |
| REQ-P1-18 | Stemmer handles double-consonant | "running"→"run", "stopped"→"stop" |
| REQ-P1-19 | Update embeds full content | `memory_update` includes content_text in embedding |
| REQ-P1-20 | Delete cleans all ancillary records | All related tables cleaned on memory delete |
| REQ-P1-21 | BM25 index cleaned on delete | Document removed from BM25 index |
| REQ-P1-22 | Atomic save truly atomic | SAVEPOINT wraps DB+rename; rollback on failure |
| REQ-P1-23 | Preflight uses correct error code | Dynamic error code from validation result |
| REQ-P1-24 | No self-loops in causal edges | `insertEdge()` rejects sourceId === targetId |
| REQ-P1-25 | maxDepth server-side clamped | Clamped to [1, 10] |
| REQ-P1-26 | FK check on edge insertion | Source and target existence verified |
| REQ-P1-27 | Community debounce uses count+maxId | Edge-count-only debounce replaced |
| REQ-P1-28 | Orphan edges auto-cleaned | `cleanupOrphanedEdges()` in verify_integrity |
| REQ-P1-29 | WM scores clamped to [0,1] | `Math.min(1.0, rawScore)` added |
| REQ-P1-30 | No double-decay in triggers | `turnDecayFactor` multiplication removed |
| REQ-P1-31 | Entry limit exact | Off-by-one `+ 1` removed |
| REQ-P1-32 | Co-activation cache cleared on bulk | `clearRelatedCache()` exported and called |
| REQ-P1-33 | Ablation uses recallK | `limit: recallK` not hardcoded 20 |
| REQ-P1-34 | evalRunId persists across restarts | Initialized from DB MAX |
| REQ-P1-35 | Postflight allows re-correction | UPDATE instead of reject |
| REQ-P1-36 | parseArgs validates input | Null/undefined/non-object guard |
| REQ-P1-37 | Dedup hash 128-bit | `.slice(0, 32)` not `.slice(0, 16)` |
| REQ-P1-38 | Exit handlers removable | `process.removeListener()` in cleanup |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 7,081+ existing tests pass (zero regressions)
- **SC-002**: 50–100 new tests added covering all 37 fixes
- **SC-003**: Legacy V1 pipeline code fully removed (~600 LOC)
- **SC-004**: No dual scoring/filtering paths remain
- **SC-005**: Each sprint independently committable
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Legacy removal breaks hidden test dependencies | High | Search all test files for `SPECKIT_PIPELINE_V2=false` before removing |
| Risk | Line numbers shifted by 015/016 changes | Medium | Verify current line numbers before each edit |
| Risk | Stemmer change affects existing BM25 index | Medium | Changes only affect new indexing; existing data unaffected until re-index |
| Dependency | Sprint 1 blocks Sprints 2–4 | High | Execute Sprint 1 first; Sprint 5 can run in parallel |
| Dependency | Test baseline from 015 (7,081 tests) | Low | Verify exact count before starting |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No new O(n) DB queries in hot paths (BM25 specFolder filter uses per-result lookup — acceptable for small result sets)
- **NFR-P02**: Embedding cache in Stage 1 saves 1 API call per search with constitutional injection

### Reliability
- **NFR-R01**: SAVEPOINT-based atomicity prevents partial DB state on save failure
- **NFR-R02**: Orphaned record cleanup prevents data corruption over time

---

## 8. EDGE CASES

### Data Boundaries
- Stack overflow prevention (#7): Tested with 200K+ element arrays
- Hash collision (#37): 128-bit hash reduces collision probability to negligible

### Error Scenarios
- Rename failure during atomic save (#22): SAVEPOINT rollback ensures DB consistency
- Non-existent edge targets (#26): Returns null instead of creating dangling reference

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | Files: 30, LOC: ~1200 modified, Systems: 1 |
| Risk | 15/25 | Auth: N, API: N, Breaking: Y (legacy removal) |
| Research | 5/20 | Review findings already documented |
| Multi-Agent | 5/15 | Single executor, serial sprints |
| Coordination | 10/15 | Sprint dependencies, test baseline tracking |
| **Total** | **57/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Tests depend on legacy pipeline | H | L | Grep for PIPELINE_V2=false before removal |
| R-002 | Stemmer change breaks search quality | M | L | Only affects -ing/-ed suffix handling |
| R-003 | Stage 2 resolveBaseScore replacement misses call site | H | M | Search all usages, test each path |
| R-004 | Double-decay fix changes trigger scoring behavior | M | M | Compare before/after scores in tests |

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Parent Spec**: `022-hybrid-rag-fusion/`
- **Prior Work**: `015-gemini-review-p1-fixes/`, `016-alignment-remediation/`

---

## Phase Navigation

| **Parent Spec** | ../spec.md |
- Predecessor: `025-finalized-scope`
- Successor: `010-cross-ai-audit`

## Acceptance Scenarios (Validator Coverage)
1. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
2. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
3. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
4. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
5. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
6. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.


---

