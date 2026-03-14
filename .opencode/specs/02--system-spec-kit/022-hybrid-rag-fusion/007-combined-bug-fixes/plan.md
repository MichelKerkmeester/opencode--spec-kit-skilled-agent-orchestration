<!-- SPECKIT_TEMPLATE_SOURCE: .opencode/skill/system-spec-kit/templates/plan.md -->
---
title: "Combined Plan: Bug Fixes 003 + 008 + 013 + 015 + 016 + 017"
description: "Merged implementation plan consolidating six bug-fix spec folders: auto-detected session bug (003), subfolder resolution fix (008), memory search bug fixes (013), bug fixes and alignment (015), code audit follow-up (016), and 30-commit bug audit W5 (017)."
updated: "2026-03-13"
importance_tier: "high"
contextType: "implementation"
---
# Combined Implementation Plan: Bug Fixes (003 + 008 + 013 + 015 + 016 + 017)

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:overview -->
## Overview

This document merges the implementation plans from six related bug-fix spec folders under `022-hybrid-rag-fusion`:

| # | Source Folder | Title | Status |
|---|--------------|-------|--------|
| 1 | `003-auto-detected-session-bug` (merged) | Auto-Detected Session Selection Bug | Complete |
| 2 | `008-subfolder-resolution-fix` (merged) | Subfolder Resolution Fix | Complete |
| 3 | `013-memory-search-bug-fixes` (merged) | Memory Search Bug Fixes (Unified) | Complete |
| 4 | `015-bug-fixes-and-alignment` (merged) | Bug Fixes and Alignment | In Progress (10 deferred tasks) |
| 5 | `016-code-audit-followup` (merged) | Code Audit Follow-up (2026-03-08) | Complete (17/17 tasks, CHK-311 and CHK-316 closed) |
| 6 | `017-30-commit-bug-audit-w5` (merged) | 30-Commit Bug Audit (W5, 2026-03-10) | Complete |

Current gate truth (2026-03-13): `npm run check --workspace=mcp_server` in `.opencode/skill/system-spec-kit` passes; the scripts workspace underlying lint/boundary/allowlist checks pass when run directly; source-016 closure verification passes via `node node_modules/vitest/vitest.mjs run tests/graph-signals.vitest.ts tests/working-memory.vitest.ts tests/checkpoint-working-memory.vitest.ts tests/checkpoints-storage.vitest.ts tests/memory-crud-extended.vitest.ts tests/bm25-index.vitest.ts` in `.opencode/skill/system-spec-kit/mcp_server` (`6` files, `275` tests); focused follow-up suites pass (`322` tests across composite/RRF/MPAB/co-activation/FSRS/eval and `56` tests across score-normalization/normalization adapters); `npm run check:full` passes (`264` passed, `1` skipped test files; `7516` passed, `47` skipped, `28` todo tests). W5 commits remain `0b53820c` (Wave A+B, 29 fixes, 23 files) and `37b5ba59` (Wave C, 33 fixes, 30 files).

Each section below preserves the full original plan content with source attribution.
<!-- /ANCHOR:overview -->

---

## Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node.js) + Markdown command specs |
| **Framework** | SpecKit scripting/runtime modules |
| **Storage** | Local filesystem + SQLite |
| **Testing** | Node-based functional test suite (32 scenarios) |

## Cross-Cutting Dependencies

All four bug-fix streams share the same codebase root and test infrastructure:
- `folder-detector.ts` / `folder-detector.js` — central to sources 003 and 008
- Memory search pipeline (`search.ts`, `tier-classifier.ts`) — central to source 013
- Command specs (resume.md, handover.md) — alignment target for source 015
- Regression suite: `test-folder-detector-functional.js` — shared verification gate

## Verification Strategy

1. Run `npm run check` (lint + TypeScript noEmit) — must pass
2. Run `npm run check:full` — full package verification
3. Execute `node .opencode/skill/system-spec-kit/scripts/tests/test-folder-detector-functional.js` — 32 pass, 0 fail
4. Targeted post-fix verification for memory-crud-extended, checkpoints-storage, adaptive-fusion, task-enrichment
5. Cross-AI review via scratch/cross-ai-review-report.md

---

## Source: 003 — Auto-Detected Session Selection Bug

> **Source lineage:** `003` stream merged into canonical `plan.md`.

---

<!-- ANCHOR:003-summary -->
### 1. SUMMARY

#### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node.js) + Markdown command specs |
| **Framework** | Internal SpecKit scripting/runtime modules |
| **Storage** | Local filesystem + optional SQLite session_learning lookup |
| **Testing** | Node-based functional script tests and focused regression assertions |

#### Overview
The fix centers on `folder-detector.ts`, where current auto-detection can over-trust mtime and return stale archived context. Implementation adds deterministic alias normalization, active-folder preference, and confidence gates that require confirmation or safe fallback when ambiguous. Supporting command docs and regression tests are updated to keep behavior and guidance aligned.
<!-- /ANCHOR:003-summary -->

---

<!-- ANCHOR:003-quality-gates -->
### 2. QUALITY GATES

#### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

#### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing for new regression matrix
- [x] Docs updated and synchronized across spec/plan/tasks/checklist
<!-- /ANCHOR:003-quality-gates -->

---

<!-- ANCHOR:003-architecture -->
### 3. ARCHITECTURE

#### Pattern
Deterministic heuristic ranking with confidence gate and explicit fallback.

#### Key Components
- **Candidate Canonicalization Layer**: normalizes `specs/` and `.opencode/specs/` references to one comparable path identity.
- **Candidate Filter and Scorer**: excludes archive/fixture folders by default, then ranks remaining candidates with stable tie-breakers beyond raw mtime.
- **Confidence Decision Gate**: when score gap is low or threshold not met, requires user confirmation or a deterministic safe fallback.

#### Data Flow
Input sources (CLI arg, JSON data, session-learning DB, CWD, auto-detect scan) are resolved in existing priority order. Auto-detect path candidates are normalized, filtered, and scored; if confidence is high, best candidate is selected directly. If confidence is low, the flow prompts for confirmation or applies a documented fallback path.
<!-- /ANCHOR:003-architecture -->

---

<!-- ANCHOR:003-phases -->
### 4. IMPLEMENTATION PHASES

#### Phase 1: Setup and Baseline
- [x] Confirm current behavior and reproduce archived-folder misselection case.
- [x] Define deterministic scoring/tie-break rules and confidence threshold constants.
- [x] Prepare regression fixtures for alias, archive, and mtime distortion cases.

#### Phase 2: Core Implementation
- [x] Add canonical alias normalization for `.opencode/specs` and `specs`.
- [x] Apply active non-archived preference with explicit archive/fixture filtering.
- [x] Replace mtime-only winner logic with deterministic composite scoring.
- [x] Add low-confidence confirmation/fallback behavior and rationale output.

#### Phase 3: Verification and Documentation
- [x] Add or update functional regression tests covering REQ-001 through REQ-004.
- [x] Update command docs (`.opencode/command/spec_kit/resume.md`, `.opencode/command/spec_kit/handover.md`) for behavior parity.
- [x] Run validation/tests and capture evidence in checklist + implementation summary.
<!-- /ANCHOR:003-phases -->

---

<!-- ANCHOR:003-testing -->
### 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit-style functional checks | Candidate normalization/filtering/scoring behavior in folder detector | Existing Node test scripts in `scripts/tests/` |
| Integration behavior checks | Full priority chain with mixed folder sets and confidence outcomes | `test-folder-detector-functional.js` updates |
| Manual | Reproduce wrong archived selection and verify corrected auto-detect output | Terminal execution of relevant SpecKit commands |
<!-- /ANCHOR:003-testing -->

---

<!-- ANCHOR:003-dependencies -->
### 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing folder-detector priority chain | Internal | Green | Incorrect reordering could regress explicit argument handling. |
| Alignment/confidence utilities | Internal | Green | Low-confidence flow may be inconsistent without synchronized thresholds. |
| Regression test harness in `scripts/tests/` | Internal | Green | Missing coverage would allow this bug to recur silently. |
<!-- /ANCHOR:003-dependencies -->

---

<!-- ANCHOR:003-rollback -->
### 7. ROLLBACK PLAN

- **Trigger**: Regression tests fail for explicit CLI/data selection or users report new misrouting after deployment.
- **Procedure**: Revert detector scoring/filter updates, restore prior stable behavior, and keep enhanced test fixtures for iteration.
<!-- /ANCHOR:003-rollback -->

---

<!-- ANCHOR:003-phase-deps -->
### L2: PHASE DEPENDENCIES

```
Phase 1 (Baseline) ─────┐
                        ├──► Phase 2 (Detector Fix) ──► Phase 3 (Verify)
Phase 1.5 (Test Matrix) ┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Baseline | None | Detector Fix, Test Matrix |
| Test Matrix | Baseline | Detector Fix, Verify |
| Detector Fix | Baseline, Test Matrix | Verify |
| Verify | Detector Fix | None |
<!-- /ANCHOR:003-phase-deps -->

---

<!-- ANCHOR:003-effort -->
### L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup and Baseline | Medium | 1-2 hours |
| Core Implementation | Medium | 3-5 hours |
| Verification and Documentation | Medium | 2-3 hours |
| **Total** | | **6-10 hours** |
<!-- /ANCHOR:003-effort -->

---

<!-- ANCHOR:003-enhanced-rollback -->
### L2: ENHANCED ROLLBACK

#### Pre-deployment Checklist
- [ ] Backup created for modified detector files
- [ ] Regression suite updated with new bug scenarios
- [ ] Selection rationale logging enabled for diagnosis

#### Rollback Procedure
1. Revert detector and alignment changes in the targeted files.
2. Re-run regression suite to confirm pre-change stability.
3. Verify `/spec_kit:resume` and `/spec_kit:handover` explicit-path behavior manually.
4. Document rollback reason and failing scenario in this spec folder.

#### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:003-enhanced-rollback -->

---
---

## Source: 008 — Subfolder Resolution Fix

> **Source lineage:** `008` stream merged into canonical `plan.md`.

---

<!-- ANCHOR:008-approach -->
### Approach

| Bug | Root Cause | Fix |
|-----|-----------|-----|
| `parseArguments` 2-segment limit | `segments.length === 2` hard-coded | Change to `>= 2`, resolve full segment path |
| `findChildFolderSync` 1-level search | Flat loop over `specsDir/*` | Recursive `searchDir` with `MAX_DEPTH=4` |
| Category folders excluded | `SPEC_FOLDER_PATTERN` requires `\d{3}-` | Add `CATEGORY_FOLDER_PATTERN` (`/^\d{2}--[a-z][a-z0-9-]*$/`) |
<!-- /ANCHOR:008-approach -->

---

<!-- ANCHOR:008-architecture -->
### Architecture

#### New: `CATEGORY_FOLDER_PATTERN`
Matches organizational containers like `02--system-spec-kit`. Used only for traversal — not spec folders themselves.

#### Modified: Recursive search
`findChildFolderSync`/`Async` use inner `searchDir(dir, depth)` with `isTraversableFolder()` checking both patterns. Aliased root deduplication via `realpathSync`.

#### Modified: Multi-segment parsing
`parseArguments` accepts `segments.length >= 2`, joins all under each specs directory. `isValidSpecFolder` adds filesystem fallback when `isUnderApprovedSpecsRoot` fails.
<!-- /ANCHOR:008-architecture -->

---

<!-- ANCHOR:008-phases -->
### Execution

1. Fix `subfolder-utils.ts` — add pattern, recursive search, dedup
2. Fix `generate-context.ts` — multi-segment + validation fallback
3. Export from `core/index.ts`
4. Fix tests + add new ones
5. Build, run tests, end-to-end verify
<!-- /ANCHOR:008-phases -->

---
---

## Source: 013 — Memory Search Bug Fixes

> **Source lineage:** `013` stream merged into canonical `plan.md`.

---

<!-- ANCHOR:013-summary -->
### 1. Summary

This unified plan captures the documented bug-fix workstreams for `007-combined-bug-fixes`:

1. Stateless filename/generic-slug parity stabilization.
2. Folder-discovery reliability follow-up, including the stale-cache shrink remediation.
3. Voyage 4 memory-index environment hardening so the MCP runtime uses the intended provider, reports that provider accurately in `memory_health`, and fails safe on dimension drift.

Approach stayed intentionally narrow: adjust only the affected workflow/utilities/tests for workstream A, folder-discovery module/tests for workstream B, and the MCP launch/startup/test surface for workstream C.
<!-- /ANCHOR:013-summary -->

---

### Technical Context

| Aspect | Context |
|--------|---------|
| Stack | TypeScript/Node.js |
| Scope A | `.opencode/skill/system-spec-kit/scripts/*` workflow + utility + tests |
| Scope B | `.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts` + direct tests |
| Scope C | `opencode.json`, `.opencode/skill/system-spec-kit/mcp_server/context-server.ts`, and `.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts` |
| Validation Tooling | Vitest, `tsc`, alignment drift script, spec validator |
| Build Constraint | `npm run typecheck` and `npm run build` both pass in `.opencode/skill/system-spec-kit` |

---

### Architecture

The solution keeps architecture unchanged and applies targeted behavior fixes:
- Stateless enrichment routing remains in workflow path with explicit JSON/file-backed guard and explicit `specFolderArg` propagation, with no global `CONFIG` mutation.
- Generic-task parity remains centralized in slug/enrichment utility semantics.
- Folder discovery stays in existing module, expanded with bounded recursion, canonical root dedupe, and graceful invalid-path handling.
- MCP memory runtime remains on the existing 1024d database path, keeps `EMBEDDINGS_PROVIDER=auto`, avoids literal `${...}` key interpolation in `opencode.json`, resolves lazy provider metadata before formatting `memory_health`, and aborts startup if provider/database dimensions disagree.

---

<!-- ANCHOR:013-architecture -->
### 2. Technical Approach

#### Workstream A
- Preserve spec-title fallback enrichment for stateless generic tasks.
- Enforce explicit stateless-only guard (`JSON/file-backed` path bypasses enrichment).
- Prevent file-backed/JSON mode from reselecting `specTitle` later through preferred-task fallback.
- Propagate `specFolderArg` explicitly through `runWorkflow()` paths so file-backed runs cannot leak state into later stateless runs, with no global `CONFIG` mutation.
- Align generic-task classification with slug behavior (`implementation-and-updates` included).
- Keep template rendering honest by preserving original `implSummary.task` in `IMPL_TASK`.

#### Workstream B
- Add depth-limited recursive discovery (max depth 8).
- Dedupe alias roots by canonical path while preserving first candidate path behavior.
- Evaluate staleness over recursive discovered folders.
- Invalidate future-dated caches when cached/discovered folder sets differ, while keeping future-dated caches fresh when the folder set still matches.
- Return empty cache object for invalid/nonexistent non-empty explicit input paths.

#### Workstream C
- Keep the workspace MCP memory runtime on `EMBEDDINGS_PROVIDER=auto` in `opencode.json` so provider compatibility remains intact.
- Remove literal `${VOYAGE_API_KEY}` / `${OPENAI_API_KEY}` interpolation from `opencode.json` so managed MCP workers use the real parent shell/launcher environment instead of placeholder strings.
- Refuse startup when `validateEmbeddingDimension()` reports a provider/database mismatch.
- Resolve the lazy embedding profile inside `memory_health` before reporting `embeddingProvider`.
- Lock the fail-fast behavior with focused `context-server.vitest.ts` coverage.
- Verify managed startup via `opencode mcp list`, probe `memory_health` through a real MCP SDK client against `dist/context-server.js`, and re-run direct packet indexing under the corrected environment.
<!-- /ANCHOR:013-architecture -->

---

<!-- ANCHOR:013-phases -->
### 3. Implementation Phases

#### Phase A: Stateless Filename + Slug Parity
- [x] Add/keep stateless enrichment fallback path.
- [x] Add stateless-only enrichment guard.
- [x] Align generic-task semantics with slug behavior.
- [x] Add regression tests for JSON-vs-stateless behavior, workflow seam restoration, and slug outcomes.

#### Phase B: Folder Discovery Follow-up
- [x] Implement recursive discovery with max depth 8.
- [x] Implement canonical-path root dedupe with first-candidate retention.
- [x] Route staleness checks through recursive discoveries.
- [x] Add stale-cache shrink follow-up coverage for deleted cached folders.
- [x] Implement graceful empty-cache return for invalid/nonexistent explicit input paths.

#### Phase C: Verification + Documentation Consolidation
- [x] Run targeted workstream tests and compile checks.
- [x] Consolidate duplicate root/addendum docs into one canonical Level 2 packet.
- [x] Normalize references to standard filenames only.

#### Phase D: Voyage 4 Runtime Hardening
- [x] Update MCP workspace config to keep `EMBEDDINGS_PROVIDER=auto` and remove literal `${VOYAGE_API_KEY}` / `${OPENAI_API_KEY}` interpolation.
- [x] Make startup fail on embedding dimension mismatch instead of continuing.
- [x] Add focused regression coverage for fatal startup on mismatch.
- [x] Fix `memory_health` lazy provider metadata reporting and add regression coverage.
- [x] Verify managed startup and real MCP SDK `memory_health` both report `voyage` / `voyage-4` with dimension `1024`.
- [x] Verify direct `handleMemoryIndexScan` for this packet completes with `failed: 0`.
- [x] Record the residual out-of-scope auth-failure diagnostic limitation honestly.
<!-- /ANCHOR:013-phases -->

---

<!-- ANCHOR:013-testing -->
### 4. Testing Strategy

| Test Type | Scope | Evidence |
|-----------|-------|----------|
| Regression tests | Stateless task enrichment, preferred-task fallback guard, workflow seam loader-path proof, slug parity, and HTML sanitization coverage | `node ../mcp_server/node_modules/vitest/vitest.mjs run tests/task-enrichment.vitest.ts --root . --config ../mcp_server/vitest.config.ts` (from `.opencode/skill/system-spec-kit/scripts`) -> PASS (32 passed) |
| Unit tests | Folder discovery recursion/depth/invalid paths | `npm run test --workspace=mcp_server -- tests/folder-discovery.vitest.ts` -> PASS (45 passed) |
| Integration tests | Alias-root dedupe + recursive staleness behavior, including stale-cache shrink and folder-set mismatch invalidation coverage | `npm run test --workspace=mcp_server -- tests/folder-discovery-integration.vitest.ts` -> PASS (28 passed) |
| MCP startup tests | Fatal startup on embedding dimension mismatch | `node mcp_server/node_modules/vitest/vitest.mjs run tests/context-server.vitest.ts` -> PASS (315 passed) |
| Provider-resolution tests | Auto-mode provider compatibility remains intact | `npm run test --workspace=mcp_server -- tests/embeddings.vitest.ts` -> PASS (14 passed) |
| Health-handler regression tests | Lazy provider profile reporting remains accurate | `npx vitest run tests/memory-crud-extended.vitest.ts` -> PASS (68 passed) |
| Type/build checks | Type safety and build consistency | `npx tsc --noEmit` (PASS), `npx tsc -p tsconfig.json --noEmit` (PASS), `npx tsc -p tsconfig.json` (PASS), `npm run typecheck` (PASS), `npm run build` (PASS) |
| Managed startup probe | Host-managed MCP startup reaches the intended provider | PASS (`spec_kit_memory` connected; startup logs reported `API key validated (provider: voyage)` and `Embedding dimension validated: 1024`) |
| Direct runtime probe | Real MCP SDK `memory_health` alignment in auto mode | PASS (`Memory system healthy: 963 memories indexed`; `provider: voyage`; `voyage-4`; `dimension: 1024`) |
| Direct indexing proof | Built runtime packet indexing under corrected Voyage env | PASS (`handleMemoryIndexScan` for `02--system-spec-kit/022-hybrid-rag-fusion/007-combined-bug-fixes` -> `failed: 0`) |
| Alignment check | Full skill-root drift check | `python3 .opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py --root .opencode/skill/system-spec-kit` (PASS) |
<!-- /ANCHOR:013-testing -->

---

<!-- ANCHOR:013-dependencies -->
### 5. Dependencies

| Dependency | Status | Notes |
|------------|--------|-------|
| Existing memory workflow utilities/tests | Green | Needed for stateless vs JSON behavior proof and file-backed/stateless seam coverage |
| Filesystem canonical path behavior | Green | Needed for alias-root dedupe correctness |
| Parent launcher environment supplies real cloud-provider keys | Green | `opencode.json` no longer overrides those keys with literal `${...}` placeholders |
| Pre-flight auth-validation order | Mixed | True credential failures still exit before `memory_health` is available; documented as out-of-scope follow-up |
| Vitest/type/build tooling | Green | Required for verification evidence |
<!-- /ANCHOR:013-dependencies -->

---

<!-- ANCHOR:013-rollback -->
### 6. Rollback Plan

- Revert targeted workstream files if regression appears.
- Re-run targeted test suites and compile checks to confirm restoration.
- Keep rollback scope limited to touched workflow/util, folder-discovery, and MCP runtime config/startup/test surfaces.
<!-- /ANCHOR:013-rollback -->

---
---

## Source: 015 — Bug Fixes and Alignment

> **Source lineage:** `015` stream merged into canonical `plan.md`.

---

<!-- ANCHOR:015-metadata -->
### Metadata

| Field       | Value                              |
| ----------- | ---------------------------------- |
| Spec ID     | 022-015                            |
| Created     | 2026-03-07                         |
| Approach    | Phased fix-and-verify              |
| Est. Effort | 12-16h across 6 phases             |
<!-- /ANCHOR:015-metadata -->

<!-- ANCHOR:015-technical_context -->
### Technical Context

| Area | Current Truth |
| --- | --- |
| Canonical scope | `007-combined-bug-fixes` is the active remediation folder with merged 009/010 historical context. |
| Runtime surfaces | Primary fixes span `mcp_server/`, `shared/`, `scripts/`, plus documentation truth updates tied to validator rules. |
| Validation baseline | Current quality gate is defined by `npx tsc --noEmit`, `npm run check`, `npm run check:full`, and spec validator pass criteria. |
| Risk profile | Highest risk remains scoring/restore correctness and release-truth drift from inherited historical claims. |
<!-- /ANCHOR:015-technical_context -->

---

### Phase M: Canonical Merge Normalization (009 + 010 -> 015)

**Goal:** Keep `007-combined-bug-fixes` as the single active spec while preserving unique historical context from merged source folders.

- Carry forward 009 remediation-epic lineage context and ADR roots (ADR-001 through ADR-003) as inherited decision history.
- Carry forward 010 cross-AI audit provenance and handover state as historical context, without editing the source handover file.
- Normalize status truth: inherited "complete" claims remain historical snapshots; active truth is controlled by current open items in 008 spec/tasks/checklist.
- Keep 009 and 010 as historical source folders with superseded pointers to 008.

Execution rule for this plan: complete Phase M documentation normalization before continuing any new implementation claims in this folder.

---

### Phase 0: Verification-Aligned Blockers (Directly Reproduced)

**Goal:** Resolve directly reproduced blockers first, then process inherited backlog findings.

#### 0.1 Re-establish Current Gate Health (VF-001)
- Commands: `npx tsc --noEmit`, `npm run check`, `npm run check:full`
- Current status: `npm run check` PASS, `npm run check:full` PASS (legacy baseline failures resolved for this packet)
- Files: `mcp_server/tests/memory-crud-extended.vitest.ts` (line 5, 161), `mcp_server/lib/cache/cognitive/tier-classifier.ts` (line 416), `mcp_server/lib/storage/causal-edges.ts` (line 173)
- Exit criterion: preserve both `npm run check` and `npm run check:full` as PASS, with VF-001 fully resolved

#### 0.2 Search and Runtime Contract Alignment (VF-002, VF-003, VF-004)
- Hybrid score-contract mismatch: align producer/consumer contract in `mcp_server/lib/search/hybrid-search.ts` (line 85, 109)
- Similarity zero-loss bug: replace `||` fallback with null-safe handling in `mcp_server/formatters/search-results.ts` (line 348)
- Error envelope mismatch: align `context-server.ts` (line 399) with `lib/response/envelope.ts` (line 11) and `lib/errors/core.ts` (line 251)
- Verification: add/update tests that assert stable score and error schema behavior

#### 0.3 Checkpoint Restore Consistency (VF-005)
- Reconcile `clearExisting` restore semantics and vector restore behavior
- Files: `mcp_server/lib/storage/checkpoints.ts` (line 477, 569), `mcp_server/handlers/checkpoints.ts` (line 200)
- Verification: restore tests cover both merge/clearExisting and vector persistence expectations

#### 0.4 Documentation Truthfulness Corrections (VF-006)
- Update stale README counts using current tool registry source (`tool-schemas.ts`)
- Patch catalog and manual playbook coverage entries currently marked incomplete/planned where implementation now exists
- Files: `README.md` (line 106, 183, 189, 730), `tool-schemas.ts` (line 450), `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/999-final-polish-and-release/001-011-feature-catalog/undocumented-features-scan.md` (line 11), `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/016-manual-testing-per-playbook/manual-test-playbooks.md` (line 341, 356), `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/feature_catalog.md` (line 296, 1767, 1776)

#### 0.5 Scope Closure on Non-MCP Surfaces and Deferral Marker (VF-007, VF-008)
- Include touched non-`mcp_server` paths in review and remediation: `scripts/core/subfolder-utils.ts`, `scripts/memory/generate-context.ts`, `scripts/spec-folder/folder-detector.ts`, `shared/config.ts`, `opencode.json`
- Resolve or explicitly defer `TODO(CHK-069)` in `mcp_server/lib/search/local-reranker.ts` (line 8) with documented rationale

Execution rule for this spec: complete Phase 0 before broad inherited backlog phases below.

### Phase 1: Critical Scoring Pipeline Fixes (P0 + P1 Scoring)

**Goal:** Eliminate NaN propagation and bounds violations in the scoring pipeline.

#### 1.1 RRF Division by Zero (P0-001)
- File: `shared/algorithms/rrf-fusion.ts`
- Fix: Add `k` validation at function entry: `if (k < 0) throw new Error('k must be non-negative')`
- Lines: 120, 141, 189
- Test: Add test case with `k = -1`, `k = 0`, `k = 60` (default)

#### 1.2 Composite Scoring NaN Guards (P1-009, P1-010, P1-011)
- File: `shared/scoring/composite-scoring.ts`
- Fix P1-009: Add `if (!isFinite(stability)) stability = 1.0` before retrievability calc (line 300)
- Fix P1-010: Add `accessCount = Math.max(0, accessCount)` before usage calc (line 312)
- Fix P1-011: Add `similarity = similarity ?? 0` before pattern calc (line 364)
- Test: Add test cases with NaN, undefined, negative inputs

#### 1.3 Algorithm Edge Cases (P1-001 through P1-008)
- Files: `mmr-reranker.ts`, `rrf-fusion.ts`, `adaptive-fusion.ts`
- Fix P1-001: Guard `if (limit <= 0) return []` before MMR loop
- Fix P1-002: `maxCandidates = Math.max(0, maxCandidates)`
- Fix P1-003: Log warning and pad shorter vector with zeros, or throw if lengths differ by >10%
- Fix P1-004: Change `||` to `??` for termMatchBonus
- Fix P1-005: Remove convergenceBonus from first-insertion path in cross-variant merge
- Fix P1-006: Normalize convergenceBonus to same scale before subtraction
- Fix P1-007: Apply recency boost before normalization, not after
- Fix P1-008: Always normalize intent weights regardless of documentType presence

### Phase 1B: Checkpoint Data Loss Fix (P0)

**Goal:** Prevent checkpoint merge-mode restore from destroying live session state.

#### 1B.1 INSERT OR REPLACE CASCADE Fix (P0-005)
- File: `mcp_server/lib/checkpoints.ts`
- Fix: Replace `INSERT OR REPLACE INTO memory_index` at line 506 with `INSERT OR IGNORE` + explicit `UPDATE` for existing rows. This prevents CASCADE triggers on `working_memory`.
- Test: Create checkpoint, add new working_memory entries, restore in merge mode, verify working_memory survives

#### 1B.2 Causal Edges in Snapshot (P1-036)
- File: `mcp_server/lib/checkpoints.ts`
- Fix: Add `causal_edges` to snapshot at line 346. Add restore logic at line 568 to rebuild edges.
- Test: Create checkpoint with causal edges, restore, verify edges survive round-trip

#### 1B.3 Lifecycle Tool Fixes (P1-037 through P1-040)
- P1-037: Add `if (!edge)` check before returning success in causal-graph handler (line 504)
- P1-038: Add `WHERE state = ?` (expected current state) to UPDATE in `setIngestJobState` (compare-and-swap)
- P1-039: Replace hardcoded `@20` with template literal `@${recallK}` in ablation metric names
- P1-040: After UPSERT, use `SELECT id FROM causal_edges WHERE source_id=? AND target_id=? AND relation=?` instead of `lastInsertRowid`

### Phase 2: Graph and Handler Fixes (P1 Graph + MCP)

#### 2.1 Graph Module Fixes (P1-014 through P1-016, P1-035)
- File: `community-detection.ts`
- Fix P1-014: Add `DELETE FROM community_assignments WHERE memory_id NOT IN (SELECT id FROM memory_index)` before storing new assignments
- Fix P1-015: Validate `Number(nodeId)` is finite before insertion: `if (!Number.isFinite(numId)) continue`
- Fix P1-035: Record algorithm label after computation, not before

- File: `graph-signals.ts`
- Fix P1-016: Replace `Number.parseInt(id, 10)` with strict parser: `const n = Number(id); if (!Number.isInteger(n)) continue`

#### 2.2 MCP Handler Fixes (P1-017, P1-018)
- File: `memory-triggers.ts`
- Fix P1-017: Replace `throw new Error(...)` with `return createMCPErrorResponse(...)` at line 185

- File: `memory-search.ts`
- Fix P1-018: Add explicit shape validation before deduplication. If shape doesn't match, log warning and return un-deduped response

### Phase 3: Mutation Safety and Scripts (P1 Mutation + Scripts)

#### 3.1 Mutation Safety (P1-019 through P1-022)
- P1-019: Update JSDoc to accurately describe partial state behavior. Rename is out of scope (too many callers)
- P1-020: Document the limitation clearly. Add a recovery function that detects DB-without-file orphans
- P1-021: Add `if (!database)` early return with warning log instead of proceeding without transaction
- P1-022: Add causal edge cleanup to the no-database delete path, or early return with warning

#### 3.2 Script Fixes (P1-023 through P1-026)
- P1-023: Add path boundary check: `if (!resolved.startsWith(PROJECT_ROOT)) throw`
- P1-024: Wrap `readFileSync` in try/catch with user-friendly error message
- P1-025: Replace string interpolation with parameterized query
- P1-026: Pass CONFIG as parameter instead of mutating module-level state

### Phase 4: Embeddings and Architecture (P1-012, P1-013, P1-031 through P1-034)

#### 4.1 Embeddings Consistency (P1-012, P1-013)
- P1-012: Either remove ollama from `validateApiKey` local providers list, or implement basic ollama support
- P1-013: Forward `baseUrl`, `timeout`, `maxTextLength` to provider constructors. If not supported by a provider, log a warning

#### 4.2 Architecture Gaps (P1-031 through P1-034)
- P1-031: Add 7 missing tools to `LAYER_DEFINITIONS`: memory_bulk_delete, eval_run_ablation, eval_reporting_dashboard, memory_ingest_start/status/cancel, task_postflight
- P1-032: Delete `mcp_server/lib/utils/retry.ts` (dead duplicate)
- P1-033: Replace brittle `__dirname` resolution with `findUp` pattern or package.json anchor
- P1-034: Replace runtime `require()` with proper import or shared DB accessor

### Phase 5: Documentation Quality (P1 Docs + P2)

#### 5.1 Documentation Accuracy (P1-027 through P1-030)
- P1-027: Update checkpoint_delete doc to describe confirmName safety gate
- P1-028: Fix source file reference from content-normalizer.ts to slug-utils.ts
- P1-029: Add progressive-validate.sh to source files table
- P1-030: Align narrative name with source files table entry

#### 5.2 P2 Documentation Quality
- Replace all em dashes with hyphens in `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/feature_catalog.md`
- Fix HVR "robust" violations in authored prose
- Replace 3 boilerplate READMEs (009, 002, 014) with actual content
- Fix broken TOC links in constitutional/ and config/ READMEs
- Update test playbook header from "128" to "151"
- Reconcile flag count (89 vs 72) between documents
- Update epic status to reflect actual completion

---

<!-- ANCHOR:015-ai_execution_protocol -->
### AI Execution Protocol

#### Pre-Task Checklist
- Confirm edits are limited to this canonical folder.
- Confirm validator target path and expected Level 3 checks.

#### Execution Rules
| Rule | Requirement |
| --- | --- |
| TASK-SEQ | Apply structural validator fixes first (markers, anchors, required sections), then rerun validator and iterate. |
| TASK-SCOPE | Do not modify files outside `007-combined-bug-fixes`. |
| TASK-TRUTH | Preserve historical digests while updating only structural compliance and broken-path integrity. |

#### Status Reporting Format
Status Reporting Format: `DONE | IN_PROGRESS | BLOCKED` with file path plus validator evidence per update.

#### Blocked Task Protocol
If BLOCKED, record the blocker, attempted remediation, and the minimum safe next action before requesting escalation.
<!-- /ANCHOR:015-ai_execution_protocol -->

---

### Verification

After all phases:
1. Run existing test suite -- zero regressions
2. Run `verify_alignment_drift.py --root shared/ --fail-on-warn`
3. Run `verify_alignment_drift.py --root mcp_server/ --fail-on-warn`
4. Run `verify_alignment_drift.py --root scripts/ --fail-on-warn`
5. Grep for remaining TODO/FIXME in modified files
6. Verify feature catalog em dash count is 0

### Definition of Done

- [ ] All P0/P1 fixes merged with tests
- [ ] verify_alignment_drift.py passes
- [ ] No test regressions
- [ ] Documentation accuracy errors corrected
- [ ] P2 documentation quality addressed
- [ ] Checklist fully verified

---
---

## Source: 017 -- 30-Commit Bug Audit (W5, 2026-03-10)

> **Source lineage:** `017` stream merged into canonical `plan.md`.

---

### 1. Summary

W5 used a 15-agent audit strategy over the last 30 fix/feature commits:
- 10 Copilot agents (gpt-5.3-codex xhigh) in Waves 1-2 for per-module deep review.
- 5 Codex agents (gpt-5.4 xhigh) in Wave 3 for cross-cutting validation (security, architecture, data flow, state management, integration).

Scope covered `mcp_server/`, `scripts/`, and `shared/`, producing fixed and pending findings with explicit ID-to-file traceability.

---

### 2. Implementation Phases

#### Phase W5-A: Quick Wins (~15 items)
- Single-line or low-risk logic fixes from the audit shortlist.
- Includes config parsing guards, status counting, and narrow correctness checks.
- Objective: stabilize obvious correctness regressions quickly and safely.

#### Phase W5-B: Medium Effort (~20 items)
- Multi-line behavior fixes spanning handler flow, score-field synchronization, and storage cleanup contracts.
- Objective: resolve cross-function bugs without broad architecture shifts.

#### Phase W5-C: Larger Refactors (~15 items)
- Architectural and contract-level remediations (pipeline normalization, ownership/authorization boundaries, extraction/path parsing hardening).
- Objective: remove systemic drift and race-prone patterns.

---

### 3. Phase Dependencies

- W5-A executes first and is the stabilization gate for later phases.
- W5-B starts after W5-A baseline is confirmed.
- W5-C may run in parallel with W5-B after W5-A stabilization, with shared contract checkpoints to avoid drift.

---

### 4. Verification Strategy

1. Run `npx tsc --noEmit` for all three code surfaces (`mcp_server`, `scripts`, `shared`).
2. Run the test suite. Final state: 11 pre-existing failures across 9 files (90 pre-existing failures resolved by W5 fixes).
3. Validate each fix at file level by matching finding IDs to path:line evidence in tasks/checklist artifacts.
4. Keep each phase gated by explicit pass/fail evidence before promoting items to completed status.

### 5. Execution Record (2026-03-10)

W5 was executed in 3 sequential waves using 15 Codex CLI agents (`codex exec --model gpt-5.3-codex --full-auto`):

| Wave | Agents | Findings | Files Changed | Commit |
|------|--------|----------|---------------|--------|
| A | 5 | R04,R07,R08,A03,A04,A07,C01,C03,E05,E06,H04,M03,S02 | 13 | `0b53820c` |
| B | 5 | R02,R11,R09,R10,D01,D02,D06,D09,D10,H03,H06,H07,C02,C04,M01,M02 | 14 | `0b53820c` |
| C | 5 | R01,R03,R05,R06,D03-D08,A01,A02,A05,A06,H01,H02,H05,H08,H09,S01,S03,E01-E04,E07,E08,X01-X07 | 30 | `37b5ba59` |

Regression fixes applied manually: UNIQUE index changed to regular index on mutation_ledger (was too strict for legitimate duplicate entries), and autoRepair test updated to pass `confirmed: true` through the new confirmation gate.
