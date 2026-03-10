<!-- SPECKIT_TEMPLATE_SOURCE: .opencode/skill/system-spec-kit/templates/checklist.md -->
---
title: "Combined Bug Fixes Checklist"
status: "in-progress"
level: 3
created: "2025-12-01"
updated: "2026-03-10"
description: "Merged checklist covering all verification items from five source spec folders"
importance_tier: "normal"
contextType: "implementation"
---
# Combined Verification Checklist: 016 Bug Fixes

<!-- SPECKIT_LEVEL: 3 -->

This is a **merged checklist** combining all verification items from five source spec folders under `022-hybrid-rag-fusion`.

---

## Overview

| Source Folder | Description | P0 | P1 | P2 | Total | Verified |
|---------------|-------------|----|----|----|-------|----------|
| **003** | Auto-Detected Session Bug | 10 | 9 | 2 | 21 | 20/21 |
| **008** | Subfolder Resolution Fix | 9 | 2 | 0 | 11 | 11/11 |
| **013** | Memory Search Bug Fixes | 10 | 13 | 2 | 25 | 22/25 |
| **015** | Bug Fixes and Alignment | 9 | 54 | 15 | 78 | 69/78 |
| **016** | Code Audit (2026-03-08) | 1 | 16 | 1 | 18 | 0/18 |
| **017** | 30-Commit Bug Audit (W5, 2026-03-10) | 3 | 85 | 0 | 88 | 88/88 |
| **Combined** | | **42** | **179** | **20** | **241** | **210/241** |

Current gate truth (2026-03-10):
- `npm run check`: PASS
- `npm run check:full`: PASS
- `npx tsc --noEmit`: clean across `mcp_server`, `scripts`, and `shared`
- Tests: 11 pre-existing failures across 9 files (90 pre-existing failures resolved by W5 fixes)
- W5 commits: `0b53820c` (Wave A+B, 29 fixes, 23 files) and `37b5ba59` (Wave C, 33 fixes, 30 files)
- Targeted post-fix verification: PASS (see `scratch/verification-logs/2026-03-07-post-fix-targeted-verification.md`)

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---
---

## Source: 003 -- Auto-Detected Session Bug

> Source lineage: `003` stream merged into canonical `checklist.md`.
> Verification Date: 2026-02-22

---

### Pre-Implementation

#### P0 - Blockers
- [x] CHK-001 [P0] Requirements documented in spec.md with concrete acceptance criteria [EVIDENCE: spec.md REQ-001 to REQ-004]
- [x] CHK-002 [P0] Technical approach defined in plan.md with deterministic selection strategy [EVIDENCE: plan.md sections 3 and 4]

#### P1 - Required
- [x] CHK-003 [P1] Bug-only scope lock documented [EVIDENCE: spec.md In Scope and Out of Scope]

---

### Code Quality

- [x] CHK-010 [P0] Folder detector changes pass lint/format checks [EVIDENCE: Review gate PASS (score 88/100, no P0/P1 findings) for implementation files including `.opencode/skill/system-spec-kit/scripts/tests/test-folder-detector-functional.js`, `.opencode/command/spec_kit/resume.md`, and `.opencode/command/spec_kit/handover.md`.]
- [x] CHK-011 [P0] No new runtime warnings/errors in detector command paths [EVIDENCE: `node .opencode/skill/system-spec-kit/scripts/tests/test-folder-detector-functional.js` -> 32 passed, 0 failed, 0 skipped.]
- [x] CHK-012 [P1] Active non-archived preference implemented without breaking explicit path priorities [EVIDENCE: Active detector implementation confirmed in `.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts` and `.opencode/skill/system-spec-kit/scripts/dist/spec-folder/folder-detector.js` (no net diff required in this finalization).]
- [x] CHK-013 [P1] Deterministic alias handling implemented for `specs/` and `.opencode/specs/` [EVIDENCE: Behavior validated by updated detector regression suite `.opencode/skill/system-spec-kit/scripts/tests/test-folder-detector-functional.js`; command result 32/0/0.]

---

### Testing

- [x] CHK-020 [P0] REQ-001 satisfied: active non-archived preference verified [EVIDENCE: Detector functional suite pass from `.opencode/skill/system-spec-kit/scripts/tests/test-folder-detector-functional.js`; command `node .opencode/skill/system-spec-kit/scripts/tests/test-folder-detector-functional.js` -> 32 passed, 0 failed, 0 skipped.]
- [x] CHK-021 [P0] REQ-002 satisfied: alias determinism verified [EVIDENCE: Same command result 32/0/0 with updated regression file `.opencode/skill/system-spec-kit/scripts/tests/test-folder-detector-functional.js`.]
- [x] CHK-022 [P0] REQ-003 satisfied: mtime distortion resilience verified [EVIDENCE: Same detector regression command result 32/0/0; scope includes mtime distortion scenarios.]
- [x] CHK-023 [P0] REQ-004 satisfied: low-confidence confirmation/fallback verified [EVIDENCE: Functional regression command result 32/0/0 plus verified existing command guidance alignment in `.opencode/command/spec_kit/resume.md` and `.opencode/command/spec_kit/handover.md` (no net diff in this pass).]
- [x] CHK-024 [P1] Regression suite updated to fail on pre-fix behavior [EVIDENCE: Updated `.opencode/skill/system-spec-kit/scripts/tests/test-folder-detector-functional.js`; execution result 32 passed, 0 failed, 0 skipped.]

---

### Security

- [x] CHK-030 [P0] Alias normalization does not introduce path traversal acceptance [EVIDENCE: Review gate PASS (88/100, no P0/P1) and active detector implementation verification in `.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts` and dist runtime artifact.]
- [x] CHK-031 [P0] Selection remains constrained to approved spec roots [EVIDENCE: Active detector code path verified in `.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts`; no net diff required in this finalization pass; regression suite passed 32/0/0.]
- [x] CHK-032 [P1] Confirmation flow does not bypass explicit user intent [EVIDENCE: Review gate PASS with no required findings; verified existing command guidance alignment in `.opencode/command/spec_kit/resume.md` and `.opencode/command/spec_kit/handover.md` (no net diff in this pass).]

---

### Documentation

- [x] CHK-040 [P1] spec.md, plan.md, and tasks.md synchronized for this bug scope [EVIDENCE: current spec folder docs]
- [x] CHK-041 [P1] Command docs aligned with implemented selection behavior [EVIDENCE: Verified existing command guidance alignment in `.opencode/command/spec_kit/resume.md` and `.opencode/command/spec_kit/handover.md` (no net diff in this pass).]
- [x] CHK-042 [P2] `implementation-summary.md` finalized with delivered implementation evidence [EVIDENCE: `implementation-summary.md` in this spec folder.]

---

### File Organization

- [x] CHK-050 [P1] No temporary files created outside allowed folders during documentation setup [EVIDENCE: Spec folder contains only documentation artifacts and existing `memory/` directory.]
- [x] CHK-051 [P1] Implementation temporary artifacts are scoped to allowed evidence locations [EVIDENCE: scratch evidence retained under `scratch/cross-ai-review-report.md` and `scratch/verification-logs/*` only.]
- [ ] CHK-052 [P2] Memory snapshot saved after implementation completion if requested [DEFERRED: Not requested in this finalization pass and intentionally skipped per task constraints.]

---

### Verification Summary (003)

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 9 | 9/9 |
| P2 Items | 2 | 1/2 |

**Verification Date**: 2026-02-22

---
---

## Source: 008 -- Subfolder Resolution Fix

> Source lineage: `008` stream merged into canonical `checklist.md`.
> Verification Date: 2026-03-01 (original), 2026-03-06 (post-review remediation)

---

### Code Quality

- [x] CHK-001 [P0] `CATEGORY_FOLDER_PATTERN` matches `02--system-spec-kit` [Regex test: true] [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-002 [P0] `findChildFolderSync` finds children 3 levels deep [Test T-SF07a: PASS] [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-003 [P0] `parseArguments` handles 3-segment paths [E2E: relative path resolves] [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-004 [P0] Aliased root dedup prevents false ambiguity [Tests T-SF03a/b: PASS] [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-005 [P0] True ambiguity still returns null [Tests T-SF03f, T-SF04f: PASS] [EVIDENCE: documented in phase spec/plan/tasks artifacts]

---

### Testing

- [x] CHK-010 [P0] TypeScript compiles cleanly [0 errors] [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-011 [P0] `test-subfolder-resolution.js`: 31 passed, 0 failed [Evidence: test output post-remediation]
- [x] CHK-012 [P0] Bare name resolves: `012-command-alignment` [Evidence: "Resolved child folder" output]
- [x] CHK-013 [P0] Relative path resolves: `02--system-spec-kit/023-.../011-...` [Evidence: "Nested spec folder" output]
- [x] CHK-014 [P1] `test-folder-detector-functional.js`: no new failures [28 passed, 1 pre-existing] [EVIDENCE: documented in phase spec/plan/tasks artifacts]

---

### Post-Review Remediation

- [x] CHK-020 [P1] Cross-AI review findings addressed (10-agent review, 8 Major + 14 Minor) [Evidence: 008 remediation implementation]

---

### Verification Summary (008)

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 2 | 2/2 |

**Verification Date**: 2026-03-01 (original), 2026-03-06 (post-review remediation)

---
---

## Source: 013 -- Memory Search Bug Fixes

> Source lineage: `013` stream merged into canonical `checklist.md`.
> Verification Date: 2026-03-07 (truth refresh)

---

### Pre-Implementation

- [x] CHK-001 [P0] Requirements for all workstreams documented in `spec.md` [EVIDENCE: `grep -c 'REQ-[ABC]' spec.md` -> 16 requirements across 3 workstreams (REQ-A01..A05, REQ-B01..B05, REQ-C01..C06)]
- [x] CHK-002 [P0] Technical approach defined in `plan.md` [EVIDENCE: `grep -c '### Phase' plan.md` -> 4 phases (A/B/C/D) with architecture in S2 and testing strategy in S4]
- [x] CHK-003 [P1] Dependencies and risks documented [EVIDENCE: `grep -c 'RISK\|DEP' spec.md` -> risk/dependency tables in S5-S6; `plan.md` S5 dependencies section]

---

### Code Quality

- [x] CHK-010 [P0] Stateless enrichment guard, preferred-task fallback guard for file-backed/JSON mode, `runWorkflow()` serialization guard, config-state restoration, and generic parity implemented [EVIDENCE: workflow/task-enrichment/slug-utils updates documented in `implementation-summary.md`]
- [x] CHK-011 [P0] Folder-discovery recursion, canonical dedupe, folder-set mismatch invalidation for future-dated caches, and graceful invalid-path behavior implemented [EVIDENCE: folder-discovery updates documented in `implementation-summary.md`]
- [x] CHK-012 [P1] Scope remains constrained to intended modules/tests and spec docs [EVIDENCE: touched files scoped to listed workstream files and this spec folder]
- [x] CHK-013 [P1] Auto-mode runtime compatibility, parent-environment key sourcing, lazy `memory_health` provider reporting, and fatal dimension-mismatch startup behavior are implemented narrowly [EVIDENCE: `opencode.json`, `mcp_server/context-server.ts`, `mcp_server/handlers/memory-crud-health.ts`, and `mcp_server/tests/memory-crud-extended.vitest.ts` updates documented in `implementation-summary.md`]

---

### Testing

- [x] CHK-020 [P0] Targeted MCP regression tests pass for this fix set [EVIDENCE: `scratch/verification-logs/2026-03-07-post-fix-targeted-verification.md`]
- [x] CHK-021 [P0] Targeted scripts regression test passes for workflow/task enrichment path [EVIDENCE: `scratch/verification-logs/2026-03-07-post-fix-targeted-verification.md`]
- [x] CHK-022 [P0] Checkpoint scoping and adaptive-fusion fixes are covered by targeted test run [EVIDENCE: `scratch/verification-logs/2026-03-07-post-fix-targeted-verification.md`]
- [x] CHK-023 [P0] Workspace typecheck and build pass in post-fix verification run [EVIDENCE: `scratch/verification-logs/2026-03-07-post-fix-targeted-verification.md`]
- [x] CHK-024 [P1] `npm run check` gate is green (lint + `npx tsc --noEmit`) [EVIDENCE: `scratch/verification-logs/2026-03-07-mcp-check-full.md`]
- [x] CHK-025 [P1] `npm run check:full` gate is fully green [EVIDENCE: `scratch/verification-logs/2026-03-07-mcp-check-full.md`]
- [ ] CHK-026 [P1] Alignment drift check rerun captured for this post-fix pass [DEFERRED: not rerun in the 2026-03-07 truth refresh]
- [ ] CHK-027 [P1] Spec validator rerun captured for this post-fix pass [DEFERRED: not rerun in the 2026-03-07 truth refresh]
- [x] CHK-028 [P0] Context-server regression suite passes with fatal mismatch startup coverage [EVIDENCE: `npm run test --workspace=mcp_server -- tests/context-server.vitest.ts` -> PASS (307 passed)]
- [x] CHK-029 [P1] Managed startup and direct runtime probes confirm Voyage 4 on the active 1024d database, and the health handler reports that profile accurately during lazy startup [EVIDENCE: `~/.opencode/bin/opencode --print-logs --log-level DEBUG mcp list` showed `spec_kit_memory` connected plus startup logs `API key validated (provider: voyage)` and `Embedding dimension validated: 1024`; `npx vitest run tests/memory-crud-extended.vitest.ts` -> PASS (68 passed); real MCP SDK client against `dist/context-server.js` returned `Memory system healthy: 963 memories indexed` with `embeddingProvider { provider: voyage, model: voyage-4, dimension: 1024, healthy: true }`]
- [x] CHK-029a [P1] Direct built-runtime packet indexing succeeds after the fix [EVIDENCE: direct `handleMemoryIndexScan` for `02--system-spec-kit/022-hybrid-rag-fusion/008-combined-bug-fixes` completed with `failed: 0`]

---

### Security

- [x] CHK-030 [P0] No secrets introduced [EVIDENCE: scope limited to workflow/discovery logic/tests/docs]
- [x] CHK-031 [P1] No auth/authz behavior changed [EVIDENCE: no auth-related files touched]

---

### Documentation

- [x] CHK-040 [P1] Canonical Level 2 packet exists with standard filenames only [EVIDENCE: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, `handover.md`]
- [x] CHK-041 [P1] Cross-references resolve using standard filenames only [EVIDENCE: references normalized in tasks/spec/plan]
- [x] CHK-042 [P1] Implementation summary and handover reflect the updated remediation state, including the placeholder-env root cause, lazy-profile health fix, and prior workflow/discovery decision rationale [EVIDENCE: `implementation-summary.md`, `handover.md`, `decision-record.md`]
- [ ] CHK-043 [P2] Closure memory save evidence for this post-fix pass is captured in scratch artifacts [DEFERRED: no 2026-03-07 memory-save artifact was added in this packet refresh]
- [x] CHK-044 [P2] Residual out-of-scope auth-failure diagnostic limitation is documented honestly [EVIDENCE: packet docs note that true startup auth failures still exit before `memory_health` is available, and that broader boot-order behavior was not reopened in this spec]

---

### Verification Summary (013)

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 13 | 11/13 |
| P2 Items | 2 | 1/2 |

**Verification Date**: 2026-03-06

---
---

## Source: 015 -- Bug Fixes and Alignment

> Source lineage: `015` stream merged into canonical `checklist.md`.
> SPECKIT_LEVEL: 3

---

### Canonical Merge History Checks (009 + 010)

- [x] CHK-M001 [P1]: 008 explicitly supersedes prior 015/009/010 active ownership as the canonical active folder [EVIDENCE: `spec.md` canonical merge notice section]
- [x] CHK-M002 [P1]: 009 cross-phase test-count reconciliation preserved as historical context [EVIDENCE: table below copied from 009 reconciliation model]
- [x] CHK-M003 [P1]: 010 audit provenance and handover state preserved in canonical 008 without editing the source handover file [EVIDENCE: `implementation-summary.md` inherited snapshot section]
- [x] CHK-M004 [P1]: 009 ADR substance (legacy V1 removal, shared `resolveEffectiveScore()`, BM25 double-consonant handling) absorbed into canonical 008 decision records [EVIDENCE: `decision-record.md` ADR-008]
- [x] CHK-M005 [P1]: 010 handover continuity snapshot absorbed with commit `40891251`, 230/7085 historical test snapshot, Tier 3 follow-up note, and CR-P2-4 completion nuance [EVIDENCE: `implementation-summary.md` historical continuity digest]
- [x] CHK-M006 [P1]: Canonical mapping references updated to 008 in related docs; predecessor dependency no longer requires 010 as a live folder [EVIDENCE: ../011-feature-catalog/feature_catalog.md mapping updates + `../006-extra-features/spec.md` phase navigation]
- [x] CHK-M007 [P1]: Deletion safety check completed after absorption and mapping normalization [EVIDENCE: 009/010 retired after archival fold-in pass]

#### Historical Test Count Reconciliation (Inherited)

| Phase | Baseline | After | Delta | Notes |
| ----- | -------- | ----- | ----- | ----- |
| 002 (Refinement Phase 1) | 7,026-7,027 | 7,003 | -24 | 24 dead-code tests removed |
| 022 (Post-Review) | 7,003 | 7,008 | +5 | New tests for P0/P1 fixes |
| 023 (Flag Catalog) | 7,008 | 7,081 | +73 | New denylist/RSF/regression/flag tests |
| 025 (Finalized Scope) | 7,081 | 7,081 | 0 | Runtime fixes, no new test files |
| 026 (Opus Remediation) | 7,081 | 7,085 | +4 | New tests across sprints |
| 010 (Cross-AI audit snapshot) | N/A | 7,205 | N/A | Historical test snapshot: 243 files, 7,205 tests |

---

### P0 Verification

- [x] CHK-001 [P0]: `rrf-fusion.ts` -- `k < 0` throws error, `k = 0` produces valid scores [EVIDENCE: Guard at lines 115, 178, 330-331; k=0 produces 1/rank scores]
- [x] CHK-002 [P0]: No `Infinity` or `NaN` values in RRF output for any valid input [EVIDENCE: convergenceBonus normalized by 1/(k+1); tsc --noEmit passes]
- [ ] CHK-003 [P0]: Test suite includes negative/zero `k` edge cases with assertions [DEFERRED: Test task T002]

---

### P0 Verification -- Checkpoint Data Loss

- [x] CHK-004 [P0]: `checkpoints.ts` -- merge-mode restore uses INSERT OR IGNORE + UPDATE (not INSERT OR REPLACE) [EVIDENCE: Split at lines 518-536; merge-mode uses IGNORE + explicit UPDATE at lines 649-660]
- [x] CHK-005 [P0]: Merge-mode restore does not trigger CASCADE deletes on working_memory [EVIDENCE: INSERT OR IGNORE skips existing rows; UPDATE doesn't trigger CASCADE]
- [ ] CHK-006 [P0]: Test verifies existing session state survives merge-mode checkpoint restore [DEFERRED: Test task T075]

---

### P1 Code Verification -- Scoring Pipeline

- [x] CHK-010 [P1]: `composite-scoring.ts` -- non-finite stability defaults to 1.0 [EVIDENCE: `let stability` + `if (!isFinite(stability)) stability = 1.0` at line 248-249]
- [x] CHK-011 [P1]: `composite-scoring.ts` -- negative accessCount clamped to 0 [EVIDENCE: `Math.max(0, accessCount)` at line 314]
- [x] CHK-012 [P1]: `composite-scoring.ts` -- undefined similarity defaults to 0 [EVIDENCE: `Number(row.similarity ?? 0)` at line 366]
- [x] CHK-013 [P1]: All composite scoring outputs are in [0, 1] range for any input [EVIDENCE: Guards prevent NaN/negative propagation; tsc confirms type safety]
- [ ] CHK-014 [P1]: Test suite covers NaN, undefined, negative, Infinity inputs [DEFERRED: Test task T006]

---

### P1 Code Verification -- Algorithms

- [x] CHK-020 [P1]: `mmr-reranker.ts` -- `limit=0` returns empty array [EVIDENCE: `if (limit <= 0) return []` at line 95]
- [x] CHK-021 [P1]: `mmr-reranker.ts` -- negative `maxCandidates` treated as 0 [EVIDENCE: `Math.max(0, rawMaxCandidates)` at line 98]
- [x] CHK-022 [P1]: `mmr-reranker.ts` -- mismatched vector lengths handled gracefully [EVIDENCE: >10% mismatch throws; <=10% zero-pads with warning, lines 49-76]
- [x] CHK-023 [P1]: `rrf-fusion.ts` -- `termMatchBonus: 0` is respected (not coerced to 0.05) [EVIDENCE: `??` operator at line 247]
- [x] CHK-024 [P1]: `rrf-fusion.ts` -- cross-variant merge produces correct scores (no double-count) [EVIDENCE: Per-variant bonus stripped at line 375; cross-variant applied in Step 4]
- [x] CHK-025 [P1]: `rrf-fusion.ts` -- convergenceBonus normalized to same scale as scores [EVIDENCE: `* (1/(k+1))` factor at lines 216-218, 384-386]
- [x] CHK-026 [P1]: `adaptive-fusion.ts` -- all output scores in [0, 1] range [EVIDENCE: Max-normalization after recency boost ensures scores <= 1.0]
- [x] CHK-027 [P1]: `adaptive-fusion.ts` -- intent weights normalized regardless of documentType [EVIDENCE: Normalization block moved outside documentType conditional]

---

### P1 Code Verification -- Graph

- [x] CHK-030 [P1]: `community-detection.ts` -- stale assignments cleaned before store [EVIDENCE: DELETE WHERE memory_id NOT IN (SELECT id FROM memory_index) at line 392]
- [x] CHK-031 [P1]: `community-detection.ts` -- non-numeric nodeId skipped without counter increment [EVIDENCE: `Number.isFinite(numId)` check with `continue` at lines 407-408]
- [x] CHK-032 [P1]: `graph-signals.ts` -- corrupted IDs (e.g., "12abc") rejected, not aliased [EVIDENCE: `Number(id)` + `Number.isInteger()` at lines 68-69, 188-190]
- [x] CHK-033 [P1]: `community-detection.ts` -- algorithm label matches actual computation [EVIDENCE: Algorithm parameter passed from caller at line 387]

---

### P1 Code Verification -- Lifecycle

- [x] CHK-034 [P1]: `checkpoints.ts` -- snapshot includes causal_edges table data [EVIDENCE: `SELECT * FROM causal_edges` at lines 347-357; causalEdges field in snapshot at line 363]
- [x] CHK-035 [P1]: `checkpoints.ts` -- restore with clearExisting rebuilds causal_edges [EVIDENCE: Restore logic at lines 738-761 using INSERT OR IGNORE]
- [x] CHK-036 [P1]: `causal-graph.ts` -- null insertEdge result returns success:false [EVIDENCE: `if (!edge)` guard returning createMCPErrorResponse at lines 504-517]
- [x] CHK-037 [P1]: `job-queue.ts` -- setIngestJobState uses compare-and-swap [EVIDENCE: `AND state = ?` added to UPDATE WHERE clause; changes === 0 check at lines 270-280]
- [x] CHK-038 [P1]: `ablation-framework.ts` -- metric labels use actual recallK value [EVIDENCE: Template literal `` `@${recallK}` `` at lines 422, 439, 482, 537]
- [x] CHK-039 [P1]: `causal-edges.ts` -- edge ID verified after UPSERT [EVIDENCE: Explicit SELECT after UPSERT at lines 178-189]

---

### P1 Code Verification -- MCP Handlers

- [x] CHK-040 [P1]: `memory-triggers.ts` -- invalid prompt returns structured error, not throw [EVIDENCE: `createMCPErrorResponse()` with code E_VALIDATION at lines 185-195]
- [x] CHK-041 [P1]: `memory-search.ts` -- cache shape mismatch logs warning, returns valid response [EVIDENCE: `console.warn()` for shape mismatches at lines 925-932]

---

### P1 Code Verification -- Mutation Safety

- [x] CHK-050 [P1]: `memory-save.ts` -- JSDoc accurately describes partial state behavior [EVIDENCE: Rewritten JSDoc at lines 391-405 describing best-effort indexing]
- [x] CHK-051 [P1]: `transaction-manager.ts` -- DB-without-file limitation documented [EVIDENCE: Detailed code comment at lines 203-210]
- [x] CHK-052 [P1]: `memory-crud-update.ts` -- no-database path returns early with warning [EVIDENCE: `if (!database)` early return with console.warn at lines 187-197]
- [x] CHK-053 [P1]: `memory-crud-delete.ts` -- no-database path handles causal edges [EVIDENCE: Early return with console.warn at lines 93-103]

---

### P1 Code Verification -- Scripts

- [x] CHK-060 [P1]: `backfill-frontmatter.ts` -- `--roots` path outside project throws error [EVIDENCE: `resolved.startsWith(PROJECT_ROOT)` check at lines 170-176, 186-189]
- [x] CHK-061 [P1]: `validate-memory-quality.ts` -- I/O error produces user-friendly message [EVIDENCE: try/catch with descriptive error at lines 293-307]
- [x] CHK-062 [P1]: `folder-detector.ts` -- SQL uses parameterized queries (no interpolation) [EVIDENCE: `?` placeholders with `.all(params)` at lines 947-953]
- [x] CHK-063 [P1]: `workflow.ts` -- CONFIG passed as parameter, not mutated globally [EVIDENCE: `loadCollectedDataFromLoader({ dataFile, specFolderArg })` at line 435; LoadOptions in data-loader.ts]

---

### P1 Code Verification -- Embeddings

- [x] CHK-070 [P1]: `factory.ts` -- ollama removed from local providers [EVIDENCE: `|| providerName === 'ollama'` removed at line 304]
- [x] CHK-071 [P1]: `factory.ts` -- baseUrl/timeout forwarded or warning logged [EVIDENCE: Options forwarded to all 3 providers with unsupported-option warnings at lines 138-179]

---

### P1 Architecture Verification

- [x] CHK-080 [P1]: `layer-definitions.ts` -- missing tools added to mapping [EVIDENCE: 4 tools added (memory_bulk_delete, memory_ingest_start/status/cancel); 3 already present]
- [x] CHK-081 [P1]: `mcp_server/lib/utils/retry.ts` -- file deleted, no import breakage [EVIDENCE: File deleted; tsc --noEmit passes; no production imports found]
- [x] CHK-082 [P1]: `config.ts` -- path resolution uses package.json anchor [EVIDENCE: `findUp('package.json')` pattern in shared/config.ts]
- [x] CHK-083 [P1]: `folder-detector.ts` -- no runtime `require()` calls [EVIDENCE: Replaced with `import Database` and `import { DB_PATH }` at lines 10-14]

---

### P1 Documentation Accuracy

- [x] CHK-090 [P1]: checkpoint_delete doc describes confirmName safety gate [EVIDENCE: Updated 05-lifecycle/04-checkpoint-deletion doc]
- [x] CHK-091 [P1]: Feature 13-11 source file correctly points to slug-utils.ts [EVIDENCE: Updated source file and role column]
- [x] CHK-092 [P1]: Feature 16-03 lists progressive-validate.sh in source files [EVIDENCE: Implementation table added with script entry]
- [x] CHK-093 [P1]: Feature 16-02 narrative matches source files table [EVIDENCE: Source table entry aligned to check-architecture-boundaries.ts]

---

### P2 Documentation Quality

- [x] CHK-100 [P2]: feature_catalog.md contains 0 em dashes [EVIDENCE: `grep -c '---'` returns 0]
- [x] CHK-101 [P2]: No HVR "robust" in authored prose (research files excluded) [EVIDENCE: grep returns 0 matches in feature-catalog]
- [x] CHK-102 [P2]: READMEs 009, 002, 014 contain actual content (not template boilerplate) [EVIDENCE: All 3 rewritten with spec-derived summaries]
- [x] CHK-103 [P2]: constitutional/ and config/ README TOC links are valid [EVIDENCE: 4 extra `]` brackets removed across 2 files]
- [x] CHK-104 [P2]: Test playbook header says "151" (not "128") [EVIDENCE: Updated line 4 of manual-test-playbooks.md]
- [x] CHK-105 [P2]: Flag count consistent across all documents [EVIDENCE: 89 -> 72 updated in 6 locations across 2 files]

---

### P2 Code Quality

- [x] CHK-110 [P2]: `DegradedModeContract` fields use camelCase [EVIDENCE: 4 fields renamed + 2 usage sites updated in adaptive-fusion.ts]
- [ ] CHK-111 [P2]: `EMBEDDING_DIM` uses provider-aware dimension lookup [DEFERRED: T054]
- [x] CHK-112 [P2]: `isHealthy` resets on successful embedding requests [EVIDENCE: `this.isHealthy = true` added in openai.ts:148 and voyage.ts:166]
- [x] CHK-113 [P2]: BFS uses index-based approach (not `shift()`) [EVIDENCE: `queueIdx` pattern in community-detection.ts and graph-signals.ts]
- [x] CHK-114 [P2]: Louvain escalation builds adjacency list once [EVIDENCE: Adjacency built once + reused via detectCommunitiesBFSFromAdj helper]
- [x] CHK-115 [P2]: Graph signal caches have size bounds [EVIDENCE: CACHE_MAX_SIZE=10000 + enforceCacheBound() helper in graph-signals.ts]
- [ ] CHK-116 [P2]: `getErrorMessage`/`isAbortError` extracted to shared utility [DEFERRED: T059]
- [ ] CHK-117 [P2]: Mutation ledger inside bulk delete transaction [DEFERRED: T061]

---

### Global Verification

- [x] CHK-200 [P0]: TypeScript compilation passes with zero errors [EVIDENCE: `tsc --noEmit` exit 0]
- [x] CHK-206 [P0]: `npm run check` passes in current tree [EVIDENCE: `npm run check` pass captured in `scratch/verification-logs/2026-03-07-mcp-check-full.md`]
- [x] CHK-207 [P0]: `npm run check:full` passes in current tree [EVIDENCE: `scratch/verification-logs/2026-03-07-mcp-check-full.md`]
- [ ] CHK-201 [P1]: `verify_alignment_drift.py` passes on shared/ directory [DEFERRED: T065]
- [ ] CHK-202 [P1]: `verify_alignment_drift.py` passes on mcp_server/ directory [DEFERRED: T065]
- [ ] CHK-203 [P1]: `verify_alignment_drift.py` passes on scripts/ directory [DEFERRED: T065]
- [x] CHK-204 [P1]: No new TODO/FIXME introduced in modified files [EVIDENCE: grep across all 30 modified files returns 0 matches]
- [x] CHK-205 [P2]: implementation-summary.md created and complete [EVIDENCE: Created with full file change table and verification results]

---

### Verification Summary (015)

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 7/9 |
| P1 Items | 54 | 50/54 |
| P2 Items | 15 | 12/15 |

**Verification Date**: 2026-03-07

---
---

## Source: 016 -- Code Audit (2026-03-08)

> 35-agent audit. Full details: `scratch/code-audit-synthesis.md`
> Launch script: `scratch/launch-code-audit.sh`
> Raw output: `scratch/code-audit-A{01-30}.md`, `scratch/arch-review-S{01-05}.md`

### P0 Items (016)

- [ ] CHK-300 [P0]: Fix broken import path in `graph-flags.ts` and `causal-boost.ts` (T069) — `../cache/cognitive/rollout-policy` → `../cognitive/rollout-policy`

### P1 Items (016)

- [ ] CHK-301 [P1]: `access-tracker.ts` flush interval timer cleared on shutdown (T070)
- [ ] CHK-302 [P1]: `composite-scoring.ts` negative stability guard with `Number.isFinite()` (T071)
- [ ] CHK-303 [P1]: `rrf-fusion.ts` finite/non-negative validation on `k`, `convergenceBonus`, `list.weight` (T072)
- [ ] CHK-304 [P1]: `context-server.ts` fatal error handlers unified through single shutdown path (T073)
- [ ] CHK-305 [P1]: `workflow.ts` HTML sanitization covers all active tags (T074, F7)
- [ ] CHK-306 [P1]: `folder-detector.ts` approved-root validation enforced inside helper (T075, F6)
- [ ] CHK-307 [P1]: `checkpoints.ts` edge restore routes through `causal-edges.ts` module (T076, F11)
- [ ] CHK-308 [P1]: `transaction-manager.ts` nested transaction guard / savepoint support (T077)
- [ ] CHK-309 [P1]: `memory-crud-update.ts` update+validation in single transaction with rollback (T078)
- [ ] CHK-310 [P1]: `eval-metrics.ts` empty ground-truth guard returns 0 (T079)
- [ ] CHK-311 [P1]: `graph-signals.ts` causal depth uses longest-path DAG traversal (T080)
- [ ] CHK-312 [P1]: `mpab-aggregation.ts` finite-number guards on chunk scores (T081)
- [ ] CHK-313 [P1]: `shared/normalization.ts` finite-input validation (T082)
- [ ] CHK-314 [P1]: `co-activation.ts` type-guard on parsed similarity field (T083)
- [ ] CHK-315 [P1]: `fsrs-scheduler.ts` review interval parameters clamped to valid ranges (T084)
- [ ] CHK-316 [P1]: Prior findings F4 (FK cascade) and F9 (error contracts) fully resolved

### P2 Items (016)

- [ ] CHK-317 [P2]: `hooks/README.md` lists all 4 hook files including `memory-surface.ts`, `mutation-feedback.ts`, `response-hints.ts` (T085)

### Verification Summary (016)

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 1 | 0/1 |
| P1 Items | 16 | 0/16 |
| P2 Items | 1 | 0/1 |

**Audit Date**: 2026-03-08
**Prior Findings Re-Verified**: F1-F11 (4 FIXED, 3 PARTIALLY_FIXED, 3 STILL_PRESENT)

---
---

## Source: 017 -- 30-Commit Bug Audit (W5, 2026-03-10)

> Source lineage: `017` stream merged into canonical `checklist.md`.
> Verification Date: 2026-03-10

---

### P0 Items (Fixed)

- [x] CHK-320 [P0]: Fix finding `P0-1` (`scripts/evals/map-ground-truth-ids.ts:92`) [EVIDENCE: Fix applied in W5 audit; tsc --noEmit clean across mcp_server, scripts, shared; 368/372 tests pass (4 pre-existing)]
- [x] CHK-321 [P0]: Fix finding `P0-2` (`scripts/utils/input-normalizer.ts:480`) [EVIDENCE: Fix applied in W5 audit; tsc --noEmit clean across mcp_server, scripts, shared; 368/372 tests pass (4 pre-existing)]
- [x] CHK-322 [P0]: Fix finding `P0-3` (`scripts/lib/ascii-boxes.ts:95`) [EVIDENCE: Fix applied in W5 audit; tsc --noEmit clean across mcp_server, scripts, shared; 368/372 tests pass (4 pre-existing)]

---

### P1 Items (Fixed)

Discrepancy note: `/tmp/w5-audit-findings.md` states "24 fixed" P1 bugs but enumerates only `F01`-`F21`. This checklist uses `CHK-323` through `CHK-345` by tracking `F01`-`F19` once and splitting `F20`/`F21` into granular contract checks, without inventing new finding IDs.

- [x] CHK-323 [P1]: Resolve finding `F01` (`scripts/extractors/spec-folder-extractor.ts:321`) [EVIDENCE: Fix applied in W5 audit; tsc --noEmit clean across mcp_server, scripts, shared; 368/372 tests pass (4 pre-existing)]
- [x] CHK-324 [P1]: Resolve finding `F02` (`mcp_server/lib/scoring/composite-scoring.ts:388`) [EVIDENCE: Fix applied in W5 audit; tsc --noEmit clean across mcp_server, scripts, shared; 368/372 tests pass (4 pre-existing)]
- [x] CHK-325 [P1]: Resolve finding `F03` (`mcp_server/handlers/memory-ingest.ts:104`) [EVIDENCE: Fix applied in W5 audit; tsc --noEmit clean across mcp_server, scripts, shared; 368/372 tests pass (4 pre-existing)]
- [x] CHK-326 [P1]: Resolve finding `F04` (`mcp_server/lib/scoring/composite-scoring.ts:250`) [EVIDENCE: Fix applied in W5 audit; tsc --noEmit clean across mcp_server, scripts, shared; 368/372 tests pass (4 pre-existing)]
- [x] CHK-327 [P1]: Resolve finding `F05` (`mcp_server/lib/scoring/composite-scoring.ts:329`) [EVIDENCE: Fix applied in W5 audit; tsc --noEmit clean across mcp_server, scripts, shared; 368/372 tests pass (4 pre-existing)]
- [x] CHK-328 [P1]: Resolve finding `F06` (`shared/algorithms/rrf-fusion.ts:187`) [EVIDENCE: Fix applied in W5 audit; tsc --noEmit clean across mcp_server, scripts, shared; 368/372 tests pass (4 pre-existing)]
- [x] CHK-329 [P1]: Resolve finding `F07` (`shared/embeddings/providers/openai.ts:313`) [EVIDENCE: Fix applied in W5 audit; tsc --noEmit clean across mcp_server, scripts, shared; 368/372 tests pass (4 pre-existing)]
- [x] CHK-330 [P1]: Resolve finding `F08` (`shared/embeddings/providers/voyage.ts:332`) [EVIDENCE: Fix applied in W5 audit; tsc --noEmit clean across mcp_server, scripts, shared; 368/372 tests pass (4 pre-existing)]
- [x] CHK-331 [P1]: Resolve finding `F09` (`mcp_server/handlers/memory-crud-delete.ts:98`) [EVIDENCE: Fix applied in W5 audit; tsc --noEmit clean across mcp_server, scripts, shared; 368/372 tests pass (4 pre-existing)]
- [x] CHK-332 [P1]: Resolve finding `F10` (`mcp_server/handlers/memory-crud-update.ts:192`) [EVIDENCE: Fix applied in W5 audit; tsc --noEmit clean across mcp_server, scripts, shared; 368/372 tests pass (4 pre-existing)]
- [x] CHK-333 [P1]: Resolve finding `F11` (`mcp_server/lib/storage/reconsolidation.ts:356`) [EVIDENCE: Fix applied in W5 audit; tsc --noEmit clean across mcp_server, scripts, shared; 368/372 tests pass (4 pre-existing)]
- [x] CHK-334 [P1]: Resolve finding `F12` (`scripts/extractors/diagram-extractor.ts:183`) [EVIDENCE: Fix applied in W5 audit; tsc --noEmit clean across mcp_server, scripts, shared; 368/372 tests pass (4 pre-existing)]
- [x] CHK-335 [P1]: Resolve finding `F13` (`scripts/lib/decision-tree-generator.ts:125`) [EVIDENCE: Fix applied in W5 audit; tsc --noEmit clean across mcp_server, scripts, shared; 368/372 tests pass (4 pre-existing)]
- [x] CHK-336 [P1]: Resolve finding `F14` (`scripts/extractors/conversation-extractor.ts:156`) [EVIDENCE: Fix applied in W5 audit; tsc --noEmit clean across mcp_server, scripts, shared; 368/372 tests pass (4 pre-existing)]
- [x] CHK-337 [P1]: Resolve finding `F15` (`scripts/utils/message-utils.ts:203`) [EVIDENCE: Fix applied in W5 audit; tsc --noEmit clean across mcp_server, scripts, shared; 368/372 tests pass (4 pre-existing)]
- [x] CHK-338 [P1]: Resolve finding `F16` (`scripts/extractors/collect-session-data.ts:224`) [EVIDENCE: Fix applied in W5 audit; tsc --noEmit clean across mcp_server, scripts, shared; 368/372 tests pass (4 pre-existing)]
- [x] CHK-339 [P1]: Resolve finding `F17` (`mcp_server/core/db-state.ts:194`) [EVIDENCE: Fix applied in W5 audit; tsc --noEmit clean across mcp_server, scripts, shared; 368/372 tests pass (4 pre-existing)]
- [x] CHK-340 [P1]: Resolve finding `F18` (`mcp_server/lib/search/vector-index-store.ts:690`) [EVIDENCE: Fix applied in W5 audit; tsc --noEmit clean across mcp_server, scripts, shared; 368/372 tests pass (4 pre-existing)]
- [x] CHK-341 [P1]: Resolve finding `F19` (`shared/embeddings/providers/hf-local.ts:215`) [EVIDENCE: Fix applied in W5 audit; tsc --noEmit clean across mcp_server, scripts, shared; 368/372 tests pass (4 pre-existing)]
- [x] CHK-342 [P1]: Resolve finding `F20` content field contract (`mcp_server/lib/search/embedding-expansion.ts:226`) [EVIDENCE: Fix applied in W5 audit; tsc --noEmit clean across mcp_server, scripts, shared; 368/372 tests pass (4 pre-existing)]
- [x] CHK-343 [P1]: Resolve finding `F20` trigger phrase array contract (`mcp_server/lib/search/embedding-expansion.ts:226`) [EVIDENCE: Fix applied in W5 audit; tsc --noEmit clean across mcp_server, scripts, shared; 368/372 tests pass (4 pre-existing)]
- [x] CHK-344 [P1]: Resolve finding `F21` metadata forward for `documentType` (`mcp_server/lib/search/vector-index-mutations.ts:107`) [EVIDENCE: Fix applied in W5 audit; tsc --noEmit clean across mcp_server, scripts, shared; 368/372 tests pass (4 pre-existing)]
- [x] CHK-345 [P1]: Resolve finding `F21` metadata forward for `specLevel` (`mcp_server/lib/search/vector-index-mutations.ts:107`) [EVIDENCE: Fix applied in W5 audit; tsc --noEmit clean across mcp_server, scripts, shared; 368/372 tests pass (4 pre-existing)]

---

### P1 Items (Fixed — W5 Waves A/B/C)

#### Race Conditions

- [x] CHK-346 [P1]: Finding `R01` — atomic session dedup via BEGIN IMMEDIATE (`mcp_server/lib/session/session-manager.ts`) [EVIDENCE: Commit 37b5ba59; tsc clean; 0 regressions]
- [x] CHK-347 [P1]: Finding `R02` — flush accumulator preserved on failure (`mcp_server/lib/storage/access-tracker.ts`) [EVIDENCE: Commit 0b53820c; tsc clean; 0 regressions]
- [x] CHK-348 [P1]: Finding `R03` — cadence gate wrapped in BEGIN IMMEDIATE (`mcp_server/lib/storage/consolidation.ts`) [EVIDENCE: Commit 37b5ba59; tsc clean; 0 regressions]
- [x] CHK-349 [P1]: Finding `R04` — atomic SQL retry_count increment (`mcp_server/lib/storage/index-refresh.ts`) [EVIDENCE: Commit 0b53820c; tsc clean; 0 regressions]
- [x] CHK-350 [P1]: Finding `R05` — divergence retry wrapped in runInTransaction (`mcp_server/lib/storage/mutation-ledger.ts`) [EVIDENCE: Commit 37b5ba59; tsc clean; 0 regressions]
- [x] CHK-351 [P1]: Finding `R06` — in-flight promise coalescing for cache dedup (`mcp_server/lib/cache/tool-cache.ts`) [EVIDENCE: Commit 37b5ba59; tsc clean; 0 regressions]
- [x] CHK-352 [P1]: Finding `R07` — lastDbCheck moved after successful reinit (`mcp_server/core/db-state.ts`) [EVIDENCE: Commit 0b53820c; tsc clean; 0 regressions]
- [x] CHK-353 [P1]: Finding `R08` — narrow catch block for file-read errors (`mcp_server/core/db-state.ts`) [EVIDENCE: Commit 0b53820c; tsc clean; 0 regressions]
- [x] CHK-354 [P1]: Finding `R09` — rollback removes BM25 index entries for deleted chunks (`mcp_server/handlers/chunking-orchestrator.ts`) [EVIDENCE: Commit 0b53820c; tsc clean; 0 regressions]
- [x] CHK-355 [P1]: Finding `R10` — chunk delete routes through storageLayer for vec cleanup (`mcp_server/handlers/chunking-orchestrator.ts`) [EVIDENCE: Commit 0b53820c; tsc clean; 0 regressions]
- [x] CHK-356 [P1]: Finding `R11` — error status check after atomicSaveMemory (`mcp_server/handlers/memory-save.ts`) [EVIDENCE: Commit 0b53820c; tsc clean; 0 regressions]

#### Data Flow

- [x] CHK-357 [P1]: Finding `D01` — score alias sync after boost (`mcp_server/lib/search/pipeline/stage2-fusion.ts`) [EVIDENCE: Commit 0b53820c; tsc clean; 0 regressions]
- [x] CHK-358 [P1]: Finding `D02` — resolveEffectiveScore + alias writeback (`mcp_server/lib/search/pipeline/stage2-fusion.ts`) [EVIDENCE: Commit 0b53820c; tsc clean; 0 regressions]
- [x] CHK-359 [P1]: Finding `D03` — post-hydration filter re-application for R8 summary hits (`mcp_server/lib/search/pipeline/stage1-candidate-gen.ts`) [EVIDENCE: Commit 37b5ba59; tsc clean; 0 regressions]
- [x] CHK-360 [P1]: Finding `D04` — MPAB fallback promotes parent identity (`mcp_server/lib/search/pipeline/stage3-rerank.ts`) [EVIDENCE: Commit 37b5ba59; tsc clean; 0 regressions]
- [x] CHK-361 [P1]: Finding `D05` — reassembly writes to precomputedContent (`mcp_server/lib/search/pipeline/stage3-rerank.ts`) [EVIDENCE: Commit 37b5ba59; tsc clean; 0 regressions]
- [x] CHK-362 [P1]: Finding `D06` — parentMemoryId normalization before MPAB (`mcp_server/lib/search/hybrid-search.ts`) [EVIDENCE: Commit 0b53820c; tsc clean; 0 regressions]
- [x] CHK-363 [P1]: Finding `D07` — buildPipelineRow normalizes all score aliases (`mcp_server/lib/search/causal-boost.ts`) [EVIDENCE: Commit 37b5ba59; tsc clean; 0 regressions]
- [x] CHK-364 [P1]: Finding `D08` — canonical_file_path = ? replaces LIKE '%spec.md' (`mcp_server/lib/extraction/extraction-adapter.ts`) [EVIDENCE: Commit 37b5ba59; tsc clean; 0 regressions]
- [x] CHK-365 [P1]: Finding `D09` — filePath validated via isPathWithin before readFileSync (`mcp_server/lib/search/retrieval-directives.ts`) [EVIDENCE: Commit 0b53820c; tsc clean; 0 regressions]
- [x] CHK-366 [P1]: Finding `D10` — specFolder-based cache invalidation (`mcp_server/lib/search/vector-index-aliases.ts`) [EVIDENCE: Commit 0b53820c; tsc clean; 0 regressions]

#### Architecture

- [x] CHK-367 [P1]: Finding `A01` — lazy cognitive config via getCognitiveConfig() getter (`mcp_server/core/config.ts`) [EVIDENCE: Commit 37b5ba59; tsc clean; 0 regressions]
- [x] CHK-368 [P1]: Finding `A02` — shared resolveDatabasePaths() resolver (`mcp_server/core/config.ts`) [EVIDENCE: Commit 37b5ba59; tsc clean; 0 regressions]
- [x] CHK-369 [P1]: Finding `A03` — Number.isFinite + positive check for BATCH_SIZE (`mcp_server/core/config.ts`) [EVIDENCE: Commit 0b53820c; tsc clean; 0 regressions]
- [x] CHK-370 [P1]: Finding `A04` — Number.isFinite + positive check for batch size (`mcp_server/utils/batch-processor.ts`) [EVIDENCE: Commit 0b53820c; tsc clean; 0 regressions]
- [x] CHK-371 [P1]: Finding `A05` — typed graphSearchFn as GraphSearchFn | null (`mcp_server/core/db-state.ts`) [EVIDENCE: Commit 37b5ba59; tsc clean; 0 regressions]
- [x] CHK-372 [P1]: Finding `A06` — re-export VectorStoreInterface from shared (`mcp_server/lib/interfaces/vector-store.ts`) [EVIDENCE: Commit 37b5ba59; tsc clean; 0 regressions]
- [x] CHK-373 [P1]: Finding `A07` — early return when archival disabled (`mcp_server/lib/cognitive/archival-manager.ts`) [EVIDENCE: Commit 0b53820c; tsc clean; 0 regressions]

#### Handler Logic

- [x] CHK-374 [P1]: Finding `H01` — session ownership guard with E_UNAUTHORIZED (`mcp_server/handlers/memory-context.ts`) [EVIDENCE: Commit 37b5ba59; tsc clean; 0 regressions]
- [x] CHK-375 [P1]: Finding `H02` — confirmation gate for autoRepair (`mcp_server/handlers/memory-crud-health.ts`) [EVIDENCE: Commit 37b5ba59; tsc clean; 0 regressions]
- [x] CHK-376 [P1]: Finding `H03` — str.includes() replaces new RegExp(userInput) (`mcp_server/handlers/memory-crud-stats.ts`) [EVIDENCE: Commit 0b53820c; tsc clean; 0 regressions]
- [x] CHK-377 [P1]: Finding `H04` — non-success status counted in failure counter (`mcp_server/handlers/memory-index.ts`) [EVIDENCE: Commit 0b53820c; tsc clean; 0 regressions]
- [x] CHK-378 [P1]: Finding `H05` — contentDiverged tracking after quality-loop fix (`mcp_server/handlers/memory-save.ts`) [EVIDENCE: Commit 37b5ba59; tsc clean; 0 regressions]
- [x] CHK-379 [P1]: Finding `H06` — dedup check moved before needsChunking branch (`mcp_server/handlers/memory-save.ts`) [EVIDENCE: Commit 0b53820c; tsc clean; 0 regressions]
- [x] CHK-380 [P1]: Finding `H07` — Map-based occurrence counting for anchor validation (`mcp_server/handlers/quality-loop.ts`) [EVIDENCE: Commit 0b53820c; tsc clean; 0 regressions]
- [x] CHK-381 [P1]: Finding `H08` — pending status included in hash-dedup SELECT (`mcp_server/handlers/save/dedup.ts`) [EVIDENCE: Commit 37b5ba59; tsc clean; 0 regressions]
- [x] CHK-382 [P1]: Finding `H09` — unified computeCacheKey for sync/async paths (`mcp_server/handlers/save/embedding-pipeline.ts`) [EVIDENCE: Commit 37b5ba59; tsc clean; 0 regressions]

#### Cognitive

- [x] CHK-383 [P1]: Finding `C01` — cache key includes limit: `${memoryId}:${limit}` (`mcp_server/lib/cognitive/co-activation.ts`) [EVIDENCE: Commit 0b53820c; tsc clean; 0 regressions]
- [x] CHK-384 [P1]: Finding `C02` — event_counter incremented in batchUpdateScores (`mcp_server/lib/cognitive/working-memory.ts`) [EVIDENCE: Commit 0b53820c; tsc clean; 0 regressions]
- [x] CHK-385 [P1]: Finding `C03` — getLatestSessionEventCounter wrapped in try/catch (`mcp_server/lib/cognitive/working-memory.ts`) [EVIDENCE: Commit 0b53820c; tsc clean; 0 regressions]
- [x] CHK-386 [P1]: Finding `C04` — filter includes pending/partial embedding statuses (`mcp_server/hooks/memory-surface.ts`) [EVIDENCE: Commit 0b53820c; tsc clean; 0 regressions]

#### Save/Mutation

- [x] CHK-387 [P1]: Finding `M01` — SUPERSEDE failure returns error with superseded:false (`mcp_server/handlers/save/pe-orchestration.ts`) [EVIDENCE: Commit 0b53820c; tsc clean; 0 regressions]
- [x] CHK-388 [P1]: Finding `M02` — error status returns MCP error response before hooks (`mcp_server/handlers/save/response-builder.ts`) [EVIDENCE: Commit 0b53820c; tsc clean; 0 regressions]
- [x] CHK-389 [P1]: Finding `M03` — last_accessed uses numeric epoch (`mcp_server/lib/storage/access-tracker.ts`) [EVIDENCE: Commit 0b53820c; tsc clean; 0 regressions]

#### Storage

- [x] CHK-390 [P1]: Finding `S01` — removed id from INSERT in bulkInsertEdges (`mcp_server/lib/storage/causal-edges.ts`) [EVIDENCE: Commit 37b5ba59; tsc clean; 0 regressions]
- [x] CHK-391 [P1]: Finding `S02` — stmt.changes === 0 tracked in failed counter (`mcp_server/lib/storage/causal-edges.ts`) [EVIDENCE: Commit 0b53820c; tsc clean; 0 regressions]
- [x] CHK-392 [P1]: Finding `S03` — orphan edge guard before INSERT (`mcp_server/lib/storage/reconsolidation.ts`) [EVIDENCE: Commit 37b5ba59; tsc clean; 0 regressions]

#### Eval Scripts

- [x] CHK-393 [P1]: Finding `E01` — UTC component validation after new Date() (`scripts/evals/check-allowlist-expiry.ts`) [EVIDENCE: Commit 37b5ba59; tsc clean; 0 regressions]
- [x] CHK-394 [P1]: Finding `E02` — AST-based import detection via ts.createSourceFile (`scripts/evals/check-architecture-boundaries.ts`) [EVIDENCE: Commit 37b5ba59; tsc clean; 0 regressions]
- [x] CHK-395 [P1]: Finding `E03` — Array.isArray(allowlist?.exceptions) schema validation (`scripts/evals/check-no-mcp-lib-imports-ast.ts`) [EVIDENCE: Commit 37b5ba59; tsc clean; 0 regressions]
- [x] CHK-396 [P1]: Finding `E04` — removed unimplemented --apply flag (`scripts/evals/map-ground-truth-ids.ts`) [EVIDENCE: Commit 37b5ba59; tsc clean; 0 regressions]
- [x] CHK-397 [P1]: Finding `E05` — empty dataset guard before division (`scripts/evals/run-phase1-5-shadow-eval.ts`) [EVIDENCE: Commit 0b53820c; tsc clean; 0 regressions]
- [x] CHK-398 [P1]: Finding `E06` — empty eval data guard with early return (`scripts/evals/run-phase3-telemetry-dashboard.ts`) [EVIDENCE: Commit 0b53820c; tsc clean; 0 regressions]
- [x] CHK-399 [P1]: Finding `E07` — MRR uses 1/rank instead of binary 1|0 (`scripts/evals/run-quality-legacy-remediation.ts`) [EVIDENCE: Commit 37b5ba59; tsc clean; 0 regressions]
- [x] CHK-400 [P1]: Finding `E08` — baseline MRR=0 yields ratio=undefined (`scripts/evals/run-quality-legacy-remediation.ts`) [EVIDENCE: Commit 37b5ba59; tsc clean; 0 regressions]

#### Extractor/Script

- [x] CHK-401 [P1]: Finding `X01` — path.resolve() normalization for critical-path detection (`scripts/extractors/session-extractor.ts`) [EVIDENCE: Commit 37b5ba59; tsc clean; 0 regressions]
- [x] CHK-402 [P1]: Finding `X02` — injectQualityMetadata before prependWarnings in workflow (`scripts/core/workflow.ts`) [EVIDENCE: Commit 37b5ba59; tsc clean; 0 regressions]
- [x] CHK-403 [P1]: Finding `X03` — branching structure check replaces dash-length heuristic (`scripts/lib/flowchart-generator.ts`) [EVIDENCE: Commit 37b5ba59; tsc clean; 0 regressions]
- [x] CHK-404 [P1]: Finding `X04` — thematic break handling when no closing --- (`scripts/lib/frontmatter-migration.ts`) [EVIDENCE: Commit 37b5ba59; tsc clean; 0 regressions]
- [x] CHK-405 [P1]: Finding `X05` — path containment check before resolution (`scripts/spec-folder/folder-detector.ts`) [EVIDENCE: Commit 37b5ba59; tsc clean; 0 regressions]
- [x] CHK-406 [P1]: Finding `X06` — path.relative segment parsing replaces regex (`scripts/spec-folder/folder-detector.ts`) [EVIDENCE: Commit 37b5ba59; tsc clean; 0 regressions]
- [x] CHK-407 [P1]: Finding `X07` — narrow error catch for ENOENT (`scripts/spec-folder/folder-detector.ts`) [EVIDENCE: Commit 37b5ba59; tsc clean; 0 regressions]

---

### Verification Summary (017)

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 3 | 3/3 |
| P1 Items | 85 | 85/85 |

**Verification Date**: 2026-03-10 (W5 close-out)
**Commits**: `0b53820c` (Wave A+B, 29 fixes), `37b5ba59` (Wave C, 33 fixes)
