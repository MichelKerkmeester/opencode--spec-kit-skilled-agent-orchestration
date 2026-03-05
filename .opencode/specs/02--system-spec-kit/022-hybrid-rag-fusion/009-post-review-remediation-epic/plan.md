# Consolidated plan: Post-Review Remediation Epic

Consolidated on 2026-03-05 from the following source folders:

- 002-cross-cutting-remediation/plan.md
- 022-post-review-remediation/plan.md
- 023-flag-catalog-remediation/plan.md
- 024-timer-persistence-stage3-fallback/plan.md
- 025-finalized-scope/plan.md
- 026-opus-remediation/plan.md

---

## Source: 002-cross-cutting-remediation/plan.md

---
title: "Implementation Plan: Comprehensive MCP Server Remediation"
description: "Execute remediation in controlled waves with explicit quality gates and validation checkpoints."
# SPECKIT_TEMPLATE_SOURCE: plan-core + phase-child-header | v2.2
trigger_phrases:
  - "phase 006 plan"
  - "remediation waves"
  - "validation checkpoints"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Plan: Comprehensive MCP Server Remediation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + phase-child-header | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown specification artifacts |
| **Framework** | system-spec-kit phased documentation workflow |
| **Storage** | Git-managed spec tree |
| **Testing** | Recursive spec validator |

### Overview
This plan drives phase 006 remediation using wave-based execution and a verify-fix-verify cycle. Focus stays on blocking validation failures first, then on non-blocking quality improvements.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Required phase documents are identified
- [x] Validator command path is confirmed
- [x] Scope boundaries are explicit (spec-tree markdown only)

### Definition of Done
- [ ] Recursive validation exit code is 0 or 1
- [ ] All blocker-level doc issues in this phase are remediated
- [ ] Remaining warnings are documented in final report
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Wave-based remediation with strict scope lock and iterative validation.

### Key Components
- **Spec (`spec.md`)**: canonical requirements and acceptance scope.
- **Plan (`plan.md`)**: execution order, gates, and rollback path.
- **Tasks (`tasks.md`)**: completion tracking by wave.
- **Implementation Summary (`implementation-summary.md`)**: post-execution evidence record.

### Data Flow
Validation errors are mapped to targeted document edits, then re-validated recursively until only warnings remain.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Blocker Remediation
- [x] Create missing phase docs for `018-deferred-features`
- [x] Add required anchors to 010 major docs
- [x] Add missing template-source markers in 006 flagged files

### Phase 2: Format Hardening
- [x] Fix highest-priority checklist priority-tag format issue impacting validation signal quality
- [ ] Optional follow-up warning cleanup (deferred)

### Phase 3: Verification
- [ ] Run recursive validator and confirm non-error exit state
- [ ] Capture before/after error and warning counts
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Validation | Spec tree blocker and warning checks | `.opencode/skill/system-spec-kit/scripts/spec/validate.sh --recursive` |
| Structural | Required files/headers/anchors present | Validator rule set (FILE_EXISTS, ANCHORS_VALID, TEMPLATE_SOURCE) |
| Manual | Confirm changed paths are in-scope only | Path review under `022-hybrid-rag-fusion/**` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Parent phase tree integrity | Internal | Required | Recursive validation fails or reports lineage issues |
| Existing 010 docs content | Internal | Required | Missing context for remediation reporting |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Validation exit remains 2 after blocker edits.
- **Procedure**: Revert latest phase-specific markdown changes, restore last passing subset, then re-apply edits in smaller batches.
<!-- /ANCHOR:rollback -->


---

## Source: 022-post-review-remediation/plan.md

---
title: "Implementation Plan: Post-Review Remediation"
description: "2-wave parallel agent delegation strategy to remediate 21 P0/P1 findings from 25-agent comprehensive review of the Spec Kit Memory MCP server."
SPECKIT_TEMPLATE_SOURCE: "plan-core | v2.2"
trigger_phrases:
  - "remediation plan"
  - "wave 1 wave 2"
  - "agent delegation"
importance_tier: "critical"
contextType: "implementation"
---
# Implementation Plan: Post-Review Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Spec Kit Memory MCP server) |
| **Framework** | MCP SDK, SQLite, Vitest |
| **Storage** | SQLite (better-sqlite3) |
| **Testing** | Vitest |

### Overview
Two-wave parallel agent strategy: Wave 1 (5 Opus agents) handles P0 blockers and complex P1 code logic fixes; Wave 2 (5 Sonnet agents) handles P1 standards, error handling, and documentation fixes. All agents run in isolation with summary-mode returns (max 30 lines).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md)
- [x] Success criteria measurable (tsc, test, build)
- [x] Dependencies identified (none external)

### Definition of Done
- [ ] All P0 findings resolved
- [ ] All P1 findings resolved
- [ ] `tsc --noEmit` passes
- [ ] `npm test` passes
- [ ] `npm run build` passes
- [ ] MCP smoke test passes
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Wave 1: P0 + Complex P1 Code Fixes (5 Opus Agents, Parallel)

| Agent | Scope | Files | Findings | Est. TCB |
|-------|-------|-------|----------|----------|
| Opus-A | Schema & DB | `vector-index-impl.ts`, `reconsolidation.vitest.ts` | P0-1, P0-2, P1-10 | ~8 |
| Opus-B | Pipeline V2 | `memory-search.ts`, `mmr-reranker.ts`, `co-activation.ts` | P1-3, P1-4 | ~10 |
| Opus-C | Save Refactor | `memory-save.ts` | P1-5 | ~8 |
| Opus-D | Search Fixes | `query-expander.ts`, `graph-search-fn.ts`, `co-activation.ts` | P1-6, P1-8, P1-9 | ~10 |
| Opus-E | Eval Fix | `eval-metrics.ts` | P1-7 | ~6 |

### Wave 2: P1 Standards + Documentation (5 Sonnet Agents, Parallel)

| Agent | Scope | Files | Findings | Est. TCB |
|-------|-------|-------|----------|----------|
| Sonnet-A | Error Handling | 5 files + `stage3-rerank.ts` | P1-11, P1-12 | ~10 |
| Sonnet-B | Comment Standards | `save-quality-gate.ts` | P1-13, P1-16 | ~8 |
| Sonnet-C | Import/Format | `memory-context.ts`, `hybrid-search.ts`, `memory-save.ts` | P1-14, P1-15 | ~8 |
| Sonnet-D | Section Dividers | `composite-scoring.ts`, `tool-schemas.ts` | P1-17 | ~8 |
| Sonnet-E | Documentation | `summary_of_*.md` | P1-18, P1-20, P1-21 | ~8 |

### Phase 3: Verification
- [ ] `tsc --noEmit` passes
- [ ] `npm test` passes
- [ ] `npm run build` passes
- [ ] MCP smoke test passes
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Type Check | Full compilation | `tsc --noEmit` |
| Unit/Integration | Full test suite | `vitest` |
| Build | Production build | `npm run build` |
| Smoke | MCP tools | `memory_health`, `memory_stats` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: tsc or test failures after changes
- **Procedure**: `git checkout -- .` on affected files
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Wave 1 (5 Opus, parallel) ──► Wave 2 (5 Sonnet, parallel) ──► Verification ──► Finalize
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Wave 1 | Spec folder created | Wave 2 |
| Wave 2 | Wave 1 complete | Verification |
| Verification | Wave 2 complete | Finalize |
| Finalize | Verification passes | None |
<!-- /ANCHOR:phase-deps -->

## Architecture
No architecture changes are introduced by this normalization pass.

## Phase 2: Validation Alignment
- Normalize checklist metadata and evidence syntax.
- Re-run validator and resolve residual warnings.


---

## Source: 023-flag-catalog-remediation/plan.md

---
title: "Implementation Plan: [NAME] [template:level_2/plan.md]"
description: "[2-3 sentences: what this implements and the technical approach]"
SPECKIT_TEMPLATE_SOURCE: "plan-core | v2.2"
trigger_phrases:
  - "implementation"
  - "plan"
  - "name"
  - "template"
  - "plan core"
importance_tier: "normal"
contextType: "general"
---
# Implementation Plan: [NAME]

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | [e.g., TypeScript, Python 3.11] |
| **Framework** | [e.g., React, FastAPI] |
| **Storage** | [e.g., PostgreSQL, None] |
| **Testing** | [e.g., Jest, pytest] |

### Overview
[2-3 sentences: what this implements and the technical approach]
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
[MVC | MVVM | Clean Architecture | Serverless | Monolith | Other]

### Key Components
- **[Component 1]**: [Purpose]
- **[Component 2]**: [Purpose]

### Data Flow
[Brief description of how data moves through the system]
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Project structure created
- [ ] Dependencies installed
- [ ] Development environment ready

### Phase 2: Core Implementation
- [ ] [Core feature 1]
- [ ] [Core feature 2]
- [ ] [Core feature 3]

### Phase 3: Verification
- [ ] Manual testing complete
- [ ] Edge cases handled
- [ ] Documentation updated
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | [Components/functions] | [Jest/pytest/etc.] |
| Integration | [API endpoints/flows] | [Tools] |
| Manual | [User journeys] | Browser |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| [System/Library] | [Internal/External] | [Green/Yellow/Red] | [Impact] |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: [Conditions requiring rollback]
- **Procedure**: [How to revert changes]
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Config) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Config |
| Config | Setup | Core |
| Core | Setup, Config | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | [Low/Med/High] | [e.g., 1-2 hours] |
| Core Implementation | [Low/Med/High] | [e.g., 4-8 hours] |
| Verification | [Low/Med/High] | [e.g., 1-2 hours] |
| **Total** | | **[e.g., 6-12 hours]** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes)
- [ ] Feature flag configured
- [ ] Monitoring alerts set

### Rollback Procedure
1. [Immediate action - e.g., disable feature flag]
2. [Revert code - e.g., git revert or redeploy previous version]
3. [Verify rollback - e.g., smoke test critical paths]
4. [Notify stakeholders - if user-facing]

### Data Reversal
- **Has data migrations?** [Yes/No]
- **Reversal procedure**: [Steps or "N/A"]
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->


---

## Source: 024-timer-persistence-stage3-fallback/plan.md

---
title: "Plan: Refinement Phase 4"
description: "Execution plan for persistence and scoring fallback corrections in Phase 4."
SPECKIT_TEMPLATE_SOURCE: "plan-core | v2.2"
importance_tier: "important"
contextType: "implementation"
---

# Plan: Refinement Phase 4

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->

## P1 #1: Warn-Only Timer Persistence

**File:** `mcp_server/lib/validation/save-quality-gate.ts`

1. Import `ensureConfigTable`, `getDb` pattern from `db-state.ts` / `db-helpers.ts`
2. Add `loadActivationTimestamp()` — reads `quality_gate_activated_at` from `config` table on first access
3. Modify `setActivationTimestamp()` — writes to both in-memory variable AND `config` table
4. Add lazy-load in `isWarnOnlyMode()` — if `qualityGateActivatedAt` is null, attempt to load from DB before returning false
5. Add test: verify timestamp persists across simulated "restart" (clear in-memory, reload from DB)

## P1 #2: effectiveScore() Fallback Chain

**File:** `mcp_server/lib/search/pipeline/stage3-rerank.ts`

1. Update `effectiveScore()` fallback chain:
   - `intentAdjustedScore` (if present and finite)
   - `rrfScore` (if present and finite)
   - `score` (existing)
   - `similarity / 100` (existing fallback)
   - `0` (default)

2. For the Score Immutability Invariant: preserve Stage 2's `score` by renaming the field written at line 312. Store the cross-encoder result in `rerankScore` only, and let `effectiveScore()` handle score resolution for downstream consumers.

   **Decision:** After review, the current behavior at line 312 creates a new object (spread), so it's not mutating Stage 2's row. The `score` overwrite is the canonical pattern for "what Stage 4 should sort by." The invariant comment is aspirational. We'll add `stage2Score` preservation instead: save Stage 2's score before overwrite so it remains auditable.

3. Update cross-encoder document mapping (line 285) to use `effectiveScore()` instead of `row.score ?? row.similarity`

## Verification
- Run full test suite: `cd .opencode/skill/system-spec-kit && npm test`
- Verify TypeScript compiles: `npx tsc --noEmit`
<!-- /ANCHOR:summary -->

## Technical Context
Current plan scope remains documentation and validation normalization for this phase.

## Architecture
No architecture changes are introduced by this normalization pass.

## Implementation
Apply repeatable documentation updates, then validate recursively until clean.

## Phase 1: Validation Alignment
- Normalize checklist metadata and evidence syntax.
- Re-run validator and resolve residual warnings.

## Phase 2: Validation Alignment
- Normalize checklist metadata and evidence syntax.
- Re-run validator and resolve residual warnings.


---

## Source: 025-finalized-scope/plan.md

---
title: "Implementation Plan: Refinement Phase 5 Finalized Scope [template:level_2/plan.md]"
description: "Execution plan finalized across tranche-1 through tranche-4 with completed summary alignment, runtime hardening, and verification evidence."
SPECKIT_TEMPLATE_SOURCE: "plan-core + level2-verify | v2.2"
trigger_phrases:
  - "refinement phase 5 plan"
  - "tranche 1"
  - "isInShadowPeriod"
  - "save-quality-gate"
  - "config table ensure"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Plan: Refinement Phase 5 Finalized Scope

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, TypeScript, Bash |
| **Primary Targets** | Two summary docs + `save-quality-gate.ts` |
| **Validation** | Child `validate.sh` + targeted `vitest` commands |
| **Parent / Predecessor** | Parent `022-hybrid-rag-fusion`, predecessor `024-timer-persistence-stage3-fallback` |

### Overview
This plan records completed tranche continuity from tranche-1 through tranche-4 with bounded scope: summary alignment corrections, `save-quality-gate.ts` robustness/activation-window continuity, hybrid-search canonical dedup plus tier-2 `forceAllChannels` hardening, and parent-summary P2 documentation polish. Verification evidence is captured in this child folder.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Child scope lists only the three implementation fixes.
- [x] Task IDs and checklist items map directly to those fixes.
- [x] Verification commands are defined for docs and TypeScript runtime behavior.

### Definition of Done
- [x] `summary_of_existing_features.md` wording is aligned (RSF/shadow/fallback/floor/reconsolidation).
- [x] `summary_of_new_features.md` contradiction around `isInShadowPeriod` is removed.
- [x] `save-quality-gate.ts` config-table ensure behavior is robust across DB handle changes and persisted activation-window continuity.
- [x] Hybrid-search canonical dedup and tier-2 `forceAllChannels` fallback hardening are completed with regression coverage.
- [x] Child validation and targeted tests pass with evidence captured in `checklist.md` and `implementation-summary.md`.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Constrained remediation flow: docs alignment fixes first, runtime robustness fix second, verification and evidence capture last.

### Key Components
- **Summary Alignment Fix A**: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/000-feature-overview/summary_of_existing_features.md`
- **Summary Alignment Fix B**: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/000-feature-overview/summary_of_new_features.md`
- **Runtime Robustness Fix**: `.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts`
- **Evidence Layer**: child `tasks.md`, `checklist.md`, and `implementation-summary.md`

### Data Flow
Source wording and behavior mismatches are corrected in targeted files, then validated through command outputs. Evidence links are recorded in checklist and implementation summary to close P0/P1 criteria.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Child Doc Alignment (Completed)
- [x] Update `spec.md` to lock scope to the three fixes.
- [x] Update `plan.md` with exact implementation and test phases.
- [x] Update `tasks.md` and `checklist.md` with fix-mapped IDs and commands.
- [x] Initialize `implementation-summary.md` for tranche continuity tracking.

### Phase 2: Summary-Doc Fixes (Completed)
- [x] Edit `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/000-feature-overview/summary_of_existing_features.md` for RSF/shadow/fallback/floor/reconsolidation wording alignment.
- [x] Edit `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/000-feature-overview/summary_of_new_features.md` to remove `isInShadowPeriod` contradiction.

### Phase 3: save-quality-gate Robustness Fix (Completed)
- [x] Edit `.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts` to ensure config-table setup remains valid when DB handle changes.
- [x] Add focused tests for DB reinitialization/handle-change behavior in existing quality-gate test files (`WO6`, `WO7`).

### Phase 4: Tranche-2 Continuation (Completed)
- [x] Apply canonical ID dedup in `combinedLexicalSearch()` and legacy `hybridSearch()` for mixed ID representations.
- [x] Add regression tests `T031-LEX-05` and `T031-BASIC-04` in `hybrid-search.vitest.ts`.

### Phase 5: Tranche-3 Continuation (Completed)
- [x] Preserve persisted activation timestamp across restart in `save-quality-gate.ts` and add regression test `WO7`.
- [x] Add and plumb `forceAllChannels` for tier-2 fallback in `hybrid-search.ts` with regression test `C138-P0-FB-T2`.
- [x] Apply targeted parent-summary alignment corrections (gating/instrumentation/hook-scope/dead-code references).

### Phase 6: Tranche-4 P2 Documentation Polish (Completed)
- [x] Apply parent-summary P2 polish updates A-F in targeted summary files.
- [x] Update child status docs to finalized completed-state wording.
- [x] Run child validation and expanded targeted tests; capture evidence in `tasks.md`, `checklist.md`, and `implementation-summary.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Commands |
|-----------|-------|----------|
| Spec validation | Child Level 2 docs quality and structure | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh ".opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/025-finalized-scope"` |
| Targeted unit/integration | Quality-gate persistence behavior, hybrid-search regression coverage, and adjacent integration wiring | `npm run test --workspace=mcp_server -- tests/hybrid-search.vitest.ts tests/save-quality-gate.vitest.ts tests/mpab-quality-gate-integration.vitest.ts` (PASS, 3 files, 176 tests) |
| Manual contradiction review | Summary-doc consistency checks | `rg -n "RSF|shadow|fallback|floor|reconsolidation" .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/000-feature-overview/summary_of_existing_features.md && rg -n "isInShadowPeriod" .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/000-feature-overview/summary_of_new_features.md` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing summary source content | Internal | Green | Cannot complete wording/contradiction corrections safely |
| Existing quality-gate tests and vitest workspace | Internal | Green | Runtime robustness fix cannot be proven |
| Parent/predecessor context references | Internal | Green | Scope lineage clarity degrades |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any fix introduces contradiction regression, test failures, or new validation errors.
- **Procedure**: Revert only the failing file change, rerun targeted verification commands, and document blocker evidence in `checklist.md`.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Doc Alignment) -> Phase 2 (Summary Fixes) -> Phase 3 (save-quality-gate Fix) -> Phase 4 (Tranche-2 Continuation) -> Phase 5 (Tranche-3 Continuation) -> Phase 6 (Tranche-4 Polish)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 | Existing child docs | Phases 2-6 |
| Phase 2 | Phase 1 | Phase 6 closeout |
| Phase 3 | Phase 1 | Phase 6 closeout |
| Phase 4 | Phases 2 and 3 | Phase 5-6 |
| Phase 5 | Phase 4 | Phase 6 |
| Phase 6 | Phases 4 and 5 | Tranche closeout |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1: Doc alignment | Low-Medium | 1-2 hours |
| Phase 2: Summary-doc fixes | Medium | 2-4 hours |
| Phase 3: save-quality-gate fix + tests | Medium-High | 3-6 hours |
| Phase 4: Verification + evidence | Medium | 1-2 hours |
| **Total** | | **7-14 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline child validation output captured.
- [x] Planned edits were restricted to targeted tranche files.
- [x] Targeted test commands are confirmed runnable.

### Rollback Procedure
1. Stop further tranche changes.
2. Revert failing change set only.
3. Re-run validation and targeted tests.
4. Record rollback details and blockers in checklist evidence.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- End of filled Level 2 implementation plan for child 016 (tranche-1 through tranche-4 aligned). -->


---

## Source: 026-opus-remediation/plan.md

---
title: "Implementation Plan: Refinement Phase 6 — Opus Review Remediation"
description: "5-sprint plan implementing 37 remediation fixes (4 P0 + 33 P1) for spec-kit-memory MCP server."
SPECKIT_TEMPLATE_SOURCE: "plan-core | v2.2"
trigger_phrases:
  - "refinement phase 6 plan"
  - "opus remediation sprints"
  - "legacy pipeline removal"
importance_tier: "critical"
contextType: "implementation"
---
# Implementation Plan: Refinement Phase 6 — Opus Review Remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node.js) |
| **Framework** | MCP Server (Model Context Protocol) |
| **Storage** | SQLite (better-sqlite3) |
| **Testing** | Vitest (7,081+ tests baseline) |

### Overview
Implements 37 remediation fixes across 5 sprints. Sprint 1 removes the legacy V1 pipeline (~600 LOC) which resolves all 4 P0 critical issues. Sprints 2–5 address P1 findings in scoring/fusion, pipeline/mutation, graph/cognitive, and evaluation domains. Each sprint is independently committable.

**Base path:** `.opencode/skill/system-spec-kit/mcp_server/`
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md)
- [x] Success criteria measurable (7,081+ tests pass, 50+ new tests)
- [x] Dependencies identified (Sprint 1 blocks 2–4; Sprint 5 independent)

### Definition of Done
- [ ] All 37 fixes implemented with tests
- [ ] Full test suite passes (>= 7,081 existing + new)
- [ ] Each sprint committed independently
- [ ] `implementation-summary.md` written
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single MCP server with modular pipeline architecture (Stage 1–4).

### Key Components
- **Pipeline Stages**: Stage 1 (candidate generation) → Stage 2 (fusion) → Stage 3 (rerank) → Stage 4 (filter)
- **Search**: Hybrid search (vector + BM25 + FTS5 + graph + trigger channels)
- **Scoring**: Composite scoring, RRF fusion, adaptive fusion, interference scoring
- **Storage**: SQLite with transaction manager, causal edges, session manager
- **Cognitive**: Working memory, co-activation, session learning

### Data Flow
Query → Stage 1 (candidates + constitutional) → Stage 2 (fusion + intent weights) → Stage 3 (rerank + MMR) → Stage 4 (filter + dedup) → Results
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Sprint 1: Legacy Pipeline Removal + P0 Critical Fixes
**Fixes:** P0-1, P0-2, P0-3, P0-4, #17 | **Risk:** MEDIUM-HIGH | **~650 removed, ~80 added**

- [ ] Remove legacy `STATE_PRIORITY` map from `memory-search.ts`
- [ ] Remove `MAX_DEEP_QUERY_VARIANTS=6` constant
- [ ] Delete functions: `buildDeepQueryVariants()`, `strengthenOnAccess()`, `applyTestingEffect()`, `filterByMemoryState()`, `applySessionDedup()`, `applyCrossEncoderReranking()`, `applyIntentWeightsToResults()`, `shouldApplyPostSearchIntentWeighting()`, `postSearchPipeline()`
- [ ] Remove `if (isPipelineV2Enabled())` branch — make V2 the only path
- [ ] Mark `isPipelineV2Enabled()` as always-true with deprecation comment in `search-flags.ts`
- [ ] Add orphaned chunk detection to `verify_integrity()` in `vector-index-impl.ts`
- [ ] Add tests for orphaned chunk detection
- [ ] Verify no test depends on `SPECKIT_PIPELINE_V2=false`
- [ ] Run full test suite — confirm >= 7,081 passing

### Sprint 2: Scoring & Fusion Fixes (8 findings)
**Fixes:** #5–#12 | **Risk:** MEDIUM | **~120 modified, ~50 added**

- [ ] #5: Add recency scoring to `applyIntentWeights` in `intent-classifier.ts`
- [ ] #6: Normalize five-factor weights to sum 1.0 in `composite-scoring.ts`
- [ ] #7: Replace spread-based min/max with loop in `composite-scoring.ts`
- [ ] #8: Fix BM25 specFolder filter with DB lookup in `hybrid-search.ts`
- [ ] #9: Fix convergence double-counting in `rrf-fusion.ts`
- [ ] #10: Normalize adaptive fusion core weights in `adaptive-fusion.ts`
- [ ] #11: Create shared `resolveEffectiveScore()` in `types.ts`; replace Stage 2's `resolveBaseScore()`
- [ ] #12: Add optional `threshold` param to `computeInterferenceScoresBatch()`
- [ ] Add tests for all 8 fixes
- [ ] Run full test suite

### Sprint 3: Pipeline, Retrieval, and Mutation Fixes (10 findings)
**Fixes:** #13–#16, #18–#23 | **Risk:** MEDIUM | **~200 modified, ~100 added**

- [ ] #13: Add hidden params to `memorySearch.inputSchema` in `tool-schemas.ts`
- [ ] #14: Remove dead `sessionDeduped` from Stage 4 metadata
- [ ] #15: Pass constitutional count from Stage 1 through to Stage 4
- [ ] #16: Cache embedding in Stage 1 for constitutional reuse
- [ ] #18: Fix `simpleStem` double-consonant handling in `bm25-index.ts`
- [ ] #19: Embed full content (not title only) in `memory-crud-update.ts`
- [ ] #20: Clean all ancillary records on delete in `vector-index-impl.ts`
- [ ] #21: Clean BM25 index on delete in `vector-index-impl.ts`
- [ ] #22: Add SAVEPOINT to `atomicSaveMemory` in `transaction-manager.ts`
- [ ] #23: Use dynamic error code in `memory-save.ts` preflight
- [ ] Add tests for all 10 fixes
- [ ] Run full test suite

### Sprint 4: Graph/Causal + Cognitive Memory Fixes (9 findings)
**Fixes:** #24–#32 | **Risk:** LOW-MEDIUM | **~150 modified, ~80 added**

- [ ] #24: Prevent self-loops in `causal-edges.ts`
- [ ] #25: Clamp maxDepth to [1,10] in `causal-graph.ts`
- [ ] #26: Add FK/existence check in `causal-edges.ts`
- [ ] #27: Replace edge-count debounce with count:maxId in `community-detection.ts`
- [ ] #28: Add `cleanupOrphanedEdges()` in `causal-edges.ts`
- [ ] #29: Clamp WM scores to [0,1] in `working-memory.ts`
- [ ] #30: Remove double-decay in `memory-triggers.ts`
- [ ] #31: Fix off-by-one in `session-manager.ts`
- [ ] #32: Export `clearRelatedCache()` from `co-activation.ts`; call after bulk ops
- [ ] Add tests for all 9 fixes
- [ ] Run full test suite

### Sprint 5: Evaluation Framework + Housekeeping (6 findings)
**Fixes:** #33–#38 | **Risk:** LOW | **~80 modified, ~40 added**

- [ ] #33: Use `recallK` for ablation limit in `eval-reporting.ts`
- [ ] #34: Initialize `_evalRunCounter` from DB in `eval-logger.ts`
- [ ] #35: Allow postflight UPDATE in `session-learning.ts`
- [ ] #36: Add input guard to `parseArgs<T>()` in `tools/types.ts`
- [ ] #37: Extend dedup hash to 128-bit in `session-manager.ts`
- [ ] #38: Add `cleanupExitHandlers()` in `access-tracker.ts`
- [ ] Add tests for all 6 fixes
- [ ] Run full test suite
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Individual fix verification | Vitest |
| Regression | Full suite (7,081+ tests) | `npm test` |
| Integration | Pipeline end-to-end scoring | Existing integration tests |

**Per-Sprint Test Requirements:**
- Sprint 1: Orphaned chunk detection test, verify no legacy pipeline test dependencies
- Sprint 2: Stack overflow with 200K array, weight normalization sums, BM25 filter effectiveness
- Sprint 3: Embedding call count, stemmer symmetry, delete cleanup completeness, SAVEPOINT rollback
- Sprint 4: Self-loop rejection, depth clamping, score bounds, decay correctness
- Sprint 5: Ablation limit, evalRunId persistence, hash length, handler removal
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Sprint 1 completion | Internal | Pending | Blocks Sprints 2–4 |
| 015 effectiveScore fix | Internal | Complete | Sprint 2 #11 scope reduced |
| 016 hybrid-search changes | Internal | Complete | Verify line numbers in Sprint 2 #8 |
| Test baseline (7,081+) | Internal | Verified | Regression threshold |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Test suite drops below 7,081 passing tests after any sprint
- **Procedure**: `git revert` the sprint commit; investigate failures before re-attempting
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Sprint 1 (P0 + Legacy)  ──┬──> Sprint 2 (Scoring)
                           ├──> Sprint 3 (Pipeline + Mutation)
                           └──> Sprint 4 (Graph + Cognitive)

Sprint 5 (Eval + Housekeeping)  ──> Independent (parallel with 2–4)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Sprint 1 | None | Sprints 2, 3, 4 |
| Sprint 2 | Sprint 1 | None |
| Sprint 3 | Sprint 1 | None |
| Sprint 4 | Sprint 1 | None |
| Sprint 5 | None | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated LOC |
|-------|------------|---------------|
| Sprint 1: Legacy Removal | High | ~730 (650 removed, 80 added) |
| Sprint 2: Scoring/Fusion | Medium | ~170 (120 modified, 50 added) |
| Sprint 3: Pipeline/Mutation | Medium | ~300 (200 modified, 100 added) |
| Sprint 4: Graph/Cognitive | Medium | ~230 (150 modified, 80 added) |
| Sprint 5: Eval/Housekeeping | Low | ~120 (80 modified, 40 added) |
| **Total** | | **~1,550 LOC** |
<!-- /ANCHOR:effort -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Remove Legacy V1 Pipeline Entirely

**Status**: Accepted

**Context**: The V1 pipeline has been default-off since `SPECKIT_PIPELINE_V2=true` became the default. It contains 3 of 4 P0 bugs (inverted STATE_PRIORITY, different scoring order, MAX_DEEP_QUERY_VARIANTS mismatch). Maintaining it doubles the surface area for bugs.

**Decision**: Delete all legacy pipeline code (~600 LOC) rather than fixing the bugs in it.

**Consequences**:
- Eliminates 3 P0 bugs at once
- Reduces codebase by ~600 lines
- `SPECKIT_PIPELINE_V2=false` no longer functional (acceptable — it was already default-on)

### ADR-002: Shared resolveEffectiveScore() Function

**Status**: Accepted

**Context**: Stage 2's `resolveBaseScore()` and Stage 3's `effectiveScore()` compute the same concept with different logic. Stage 3 was fixed by 015 to use the correct fallback chain. Stage 2 still uses wrong order and no clamping.

**Decision**: Create shared `resolveEffectiveScore()` in `pipeline/types.ts` based on Stage 3's corrected pattern. Replace both functions.

**Consequences**:
- Consistent scoring across all pipeline stages
- Single point of change for future score resolution updates
- 9+ call sites in Stage 2 need updating

### ADR-003: Stemmer Double-Consonant Handling

**Status**: Accepted

**Context**: `simpleStem()` strips `-ing`/`-ed` suffixes but doesn't handle doubled consonants, producing "runn" from "running" instead of "run".

**Decision**: Add double-consonant reduction after suffix stripping. Check if the last two characters are identical consonants and remove one.

**Consequences**:
- "running"→"run", "stopped"→"stop" work correctly
- Only affects new indexing; existing BM25 data unchanged until re-index
- Minor risk of over-stemming rare words

---

## RELATED DOCUMENTS

- **Specification**: See `spec.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`

## Phase 1: Validation Alignment
- Normalize checklist metadata and evidence syntax.
- Re-run validator and resolve residual warnings.

## Phase 2: Validation Alignment
- Normalize checklist metadata and evidence syntax.
- Re-run validator and resolve residual warnings.

## AI Execution Protocol

### Pre-Task Checklist
- Confirm scope lock for this phase folder before edits.
- Confirm validator command and target path.

### Execution Rules
| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Execute fixes in warning-category order and re-validate after each pass. |
| TASK-SCOPE | Do not modify files outside this phase folder unless explicitly required by parent-link checks. |

### Status Reporting Format
Status Reporting Format: `DONE | IN_PROGRESS | BLOCKED` with file path and validator evidence per update.

### Blocked Task Protocol
If BLOCKED, record blocker, attempted remediation, and next safe action before proceeding.


---

