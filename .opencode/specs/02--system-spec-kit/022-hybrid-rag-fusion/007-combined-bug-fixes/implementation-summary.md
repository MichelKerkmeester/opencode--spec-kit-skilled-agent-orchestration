<!-- SPECKIT_TEMPLATE_SOURCE: .opencode/skill/system-spec-kit/templates/implementation-summary.md -->
---
title: "Combined Implementation Summary: Bug Fixes (003, 008, 013, 015, 016, 017)"
description: "Merged implementation summary covering auto-detected session bug, subfolder resolution fix, memory search bug fixes, bug fixes and alignment, the 2026-03-08 code audit follow-up, and the W5 bug audit"
importance_tier: "normal"
contextType: "implementation"
---
# Combined Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->

---

## Overview

This document merges implementation summaries and follow-up closure evidence from 6 spec folders under `022-hybrid-rag-fusion` into a single canonical reference.

| # | Spec Folder | Completed | Key Scope |
|---|-------------|-----------|-----------|
| 1 | `007-combined-bug-fixes` | 2026-02-22 | Session selection finalization, detector regression tests (32 passed) |
| 2 | `007-combined-bug-fixes` | 2026-03-01 / 2026-03-06 | 3 bugs fixed for bare-name and relative-path resolution in 3-level-deep spec hierarchies (31 tests) |
| 3 | `007-combined-bug-fixes` | 2026-03-06 | Stateless parity, folder-discovery follow-up, Voyage 4 memory-index fix (3 workstreams, 492+ tests) |
| 4 | `007-combined-bug-fixes` | 2026-03-07 | 49 P0/P1/P2 fixes across 5 phases, 30+ source files, 14 parallel agents |
| 5 | `007-combined-bug-fixes` | 2026-03-10 | 62 P1 fixes across 3 waves (W5), 45 source files, 15 Codex CLI agents |

---
---

## Source: 003 -- Auto-Detected Session Bug

<!-- ANCHOR:metadata -->
### Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-combined-bug-fixes |
| **Completed** | 2026-02-22 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
### What Was Built

Session selection finalization is complete for this spec. Regression tests and command guidance now capture and enforce the intended behavior: prefer active non-archived specs, handle `specs/` vs `.opencode/specs/` deterministically, remain resilient to mtime distortion, and require safe behavior when confidence is low.

#### Delivered Behavior and Evidence

Detector logic was confirmed active with no additional code delta required in this pass. The implementation is present in both source and dist artifacts, and existing command guidance was verified as aligned with user-facing behavior.

#### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skill/system-spec-kit/scripts/tests/test-folder-detector-functional.js` | Modified | Adds and validates detector regression coverage for the bug acceptance dimensions. |
| `.opencode/command/spec_kit/resume.md` | Verified alignment (no net diff in this pass) | Existing resume command guidance aligns with deterministic session selection expectations. |
| `.opencode/command/spec_kit/handover.md` | Verified alignment (no net diff in this pass) | Existing handover command guidance aligns with session selection behavior. |
| `.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts` | Verified active (no net diff) | Confirms detector implementation already present and in use for target behavior. |
| `.opencode/skill/system-spec-kit/scripts/dist/spec-folder/folder-detector.js` | Verified active (no net diff) | Confirms runtime-distributed detector artifact matches active behavior. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
### How It Was Delivered

Delivery completed through targeted regression and command-guidance verification, then validated by execution and review gates:
- Functional test command: `node .opencode/skill/system-spec-kit/scripts/tests/test-folder-detector-functional.js`
- Result: `32 passed, 0 failed, 3 skipped`
- Review gate: PASS, score `88/100`, no P0/P1 findings
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
### Key Decisions

| Decision | Why |
|----------|-----|
| Accept no-net-diff detector finalization | Source and dist detector implementations were already active; forcing redundant edits would create noise without behavioral gain. |
| Use tests and docs as completion evidence | The changed artifact in this pass was regression testing coverage, while command guidance alignment was verified with no net diff. |
| Keep scope locked to session auto-detection bug | Prevents unrelated refactoring and preserves confidence in completion evidence. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
### Verification

| Check | Result |
|-------|--------|
| Functional detector regression suite | PASS (`node .opencode/skill/system-spec-kit/scripts/tests/test-folder-detector-functional.js` -> 32 passed, 0 failed, 3 skipped) |
| Review gate | PASS (score 88/100, no P0/P1 findings) |
| Detector implementation presence | PASS (verified active in `.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts` and `.opencode/skill/system-spec-kit/scripts/dist/spec-folder/folder-detector.js`; no net diff required) |
| Spec validator for this folder | PASS (`bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-combined-bug-fixes`) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
### Known Limitations

1. **P2 deferred memory save** Memory snapshot generation was intentionally deferred because this pass explicitly disallowed memory loading/saving.
2. **Residual audit risk** Future detector refactors could reintroduce mtime-heavy ranking bias if regression coverage is not maintained.
<!-- /ANCHOR:limitations -->

---
---

## Source: 008 -- Subfolder Resolution Fix

### Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-combined-bug-fixes |
| **Completed** | 2026-03-01 (original), 2026-03-06 (post-review remediation) |
| **Level** | 2 |

---

### What Was Built

Bare-name and relative-path inputs to `generate-context.js` now resolve correctly for spec folders nested 3+ levels deep (e.g., `specs/02--system-spec-kit/022-hybrid-rag-fusion/007-combined-bug-fixes/`). Previously only the full `.opencode/specs/...` path worked.

#### Bug 1 Fix: Multi-segment path handling
`parseArguments` in `generate-context.ts` changed from `segments.length === 2` to `segments.length >= 2`. Now joins all segments under each specs directory to find matches, supporting 3-level `category/parent/child` paths.

#### Bug 2 Fix: Recursive child folder search
`findChildFolderSync` and `findChildFolderAsync` in `subfolder-utils.ts` replaced flat `specsDir/*/childName` loop with recursive `searchDir(dir, depth)` up to `MAX_DEPTH=4`. Aliased root deduplication via `realpathSync` prevents false ambiguity from `specs/` and `.opencode/specs/` symlinks.

#### Bug 3 Fix: Category folder traversal
New `CATEGORY_FOLDER_PATTERN` (`/^\d{2}--[a-z][a-z0-9-]*$/`) recognizes organizational containers like `02--system-spec-kit`. `isTraversableFolder()` checks both spec and category patterns during recursive search.

#### Validation fallback
`isValidSpecFolder` in `generate-context.ts` now tries filesystem resolution under known specs directories when `isUnderApprovedSpecsRoot` fails, catching relative paths that don't start with `specs/`.

---

### How It Was Delivered

All 3 code fixes were implemented in parallel, then the test file was updated to match new behavior:
- 2 test cases moved from valid to invalid (`02--system-spec-kit` never matched `SPEC_FOLDER_PATTERN`)
- 3 aliased-root tests updated (dedup now resolves instead of returning null)
- 2 ambiguity tests rewritten with truly different parents
- 3 new test categories added (CATEGORY_FOLDER_PATTERN valid/invalid, deep nesting)

---

### Files Changed

| File | Changes |
|------|---------|
| `.opencode/skill/system-spec-kit/scripts/core/subfolder-utils.ts` | +`CATEGORY_FOLDER_PATTERN`, +`isTraversableFolder`, recursive search, +`SEARCH_MAX_DEPTH`, +`FindChildOptions`, `withFileTypes`, root dedup, symlink skip, visited-set, warning collection |
| `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts` | Multi-segment `parseArguments`, filesystem fallback, +`CATEGORY_FOLDER_PATTERN` import, path containment in `isUnderApprovedSpecsRoot`, category-aware deep-match fallback |
| `.opencode/skill/system-spec-kit/scripts/core/index.ts` | Export `CATEGORY_FOLDER_PATTERN`, `SEARCH_MAX_DEPTH`, `FindChildOptions` |
| `.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts` | `=== 2` to `>= 2` with last-segment validation (2 locations) |
| `.opencode/skill/system-spec-kit/scripts/tests/test-subfolder-resolution.js` | Fixed expectations, +5 new tests (31 total), T-SF07a tightened |

---

### Verification

| Check | Result |
|-------|--------|
| TypeScript build | PASS (0 errors) |
| `test-subfolder-resolution.js` | PASS (31/31, 0 failed -- 26 original + 5 post-review) |
| Bare name `007-combined-bug-fixes` | PASS (resolves via recursive search) |
| Relative path `02--system-spec-kit/023-.../011-...` | PASS (resolves via multi-segment join) |
| `test-folder-detector-functional.js` | PASS (28/28 + 1 pre-existing T-FD09b) |

---

### Behavioral Changes

#### Dual-level ambiguity (breaking change from flat-loop)
Previously, `findChildFolderSync` used a flat `specsDir/*/childName` loop. If a child existed at both top-level and nested under a parent, the flat loop would find the top-level one first and return it as the winner. With the recursive search, both locations are discovered, triggering the ambiguity handler (returns null). This is intentional -- silent preference for one location over another could cause subtle regressions.

#### Symlink traversal
Symlinked entries within specs directories are now skipped during child folder search. This prevents traversal of symlinks pointing outside the project (security) and eliminates potential cycle-related redundant scans. Root specs directories that are themselves symlinks are still resolved correctly via upfront dedup.

#### Root dedup
Aliased roots (e.g., `specs/` to `.opencode/specs/` symlink) are now deduplicated before traversal starts, rather than after matches are collected. This eliminates duplicate traversal work (~2N cost) and ensures deterministic single-traversal behavior.

---

### Post-Review Remediation (Cross-AI Review)

10-agent cross-AI review (6 Opus + 4 Codex) identified 8 Major and 14 Minor issues. All addressed:

| Category | Changes |
|----------|---------|
| **Performance** | `withFileTypes` replaces per-entry `statSync`; root dedup eliminates duplicate traversal |
| **Security** | Symlink entries skipped; visited-set prevents cycles; `isUnderApprovedSpecsRoot` uses path containment |
| **Error handling** | Catch blocks collect warnings (logged with DEBUG); MAX_DEPTH boundary logs warning |
| **Architecture** | `SEARCH_MAX_DEPTH` extracted to module constant; `onAmbiguity` callback decouples logging from search; deep-match fallback searches category folders |
| **Tests** | +5 new tests (MAX_DEPTH boundary x2, multi-segment validation, SEARCH_MAX_DEPTH export, onAmbiguity callback); T-SF07a tightened |
| **Compatibility** | `folder-detector.ts` `=== 2` to `>= 2` for multi-segment nested paths |

---
---

## Source: 013 -- Memory Search Bug Fixes

### Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-combined-bug-fixes |
| **Completed** | 2026-03-06 |
| **Level** | 2 |
| **Status** | Unified canonical packet updated after verified Voyage 4 launcher/config remediation and the follow-up `memory_health` reporting fix |

---

### What Was Built

This spec now captures all completed workstreams in one canonical Level 2 packet.

#### Workstream A: Stateless filename/generic-slug parity
- Preserved title fallback enrichment for generic task labels in stateless mode.
- Added explicit stateless-only guard so JSON/file-backed mode remains unchanged.
- Prevented file-backed/JSON mode from reselecting `specTitle` later through preferred-task fallback.
- Added a workflow serialization guard so overlapping `runWorkflow()` calls do not interleave invocation-local state.
- Propagated `specFolderArg` explicitly through the workflow/data-loader path so file-backed runs no longer rely on global `CONFIG` mutation, and the seam test proves the later stateless invocation reaches the loader path with `CONFIG.DATA_FILE === null`.
- Aligned generic-task semantics with slug behavior including `Implementation and updates`.
- Preserved template honesty (`IMPL_TASK` still reflects original task field).
- Added regression tests proving JSON-vs-stateless divergence, workflow-level seam isolation, overlapping-call serialization, and slug outcomes.

#### Workstream B: Folder-discovery follow-up
- Added depth-limited recursive discovery with max depth 8.
- Added canonical-path dedupe for alias roots while preserving first-candidate behavior.
- Updated staleness checks to use recursively discovered folders.
- Added stale-cache shrink follow-up coverage plus future-dated cache invalidation when cached/discovered folder sets differ, while keeping future-dated caches fresh when the folder set still matches.
- Added alias-root order determinism integration coverage so canonical root ordering remains stable.
- Ensured invalid/nonexistent non-empty explicit input paths return an empty cache object.
- Added/updated unit and integration verification coverage.

#### Workstream C: Voyage 4 memory-index environment fix
- Updated `opencode.json` so `spec_kit_memory` keeps `EMBEDDINGS_PROVIDER=auto` for provider compatibility instead of hard-pinning `voyage`.
- Removed literal `${VOYAGE_API_KEY}` and `${OPENAI_API_KEY}` interpolation from `opencode.json` after confirming the managed MCP child process was receiving those placeholders as bogus API keys; the real cloud-provider keys now come only from the parent shell/launcher environment.
- Kept the existing 1024d database path in place to preserve the fuller active index while aligning the runtime to Voyage 4.
- Changed startup so `context-server.ts` throws on embedding dimension mismatch instead of warning and continuing.
- Added focused regression coverage proving startup exits on a 1024 vs 768 mismatch.
- Fixed `memory_health` so it resolves the lazy embedding profile before formatting `embeddingProvider`, which removed the stale 768d fallback and made the health payload report the active `voyage` / `voyage-4` / `1024` profile.
- Verified provider-resolution compatibility with `embeddings.vitest.ts`, then verified both managed startup and a real MCP SDK `memory_health` call: managed startup connected `spec_kit_memory` with Voyage and validated dimension 1024, and the stdio client returned `Memory system healthy: 963 memories indexed` plus `embeddingProvider { provider: voyage, model: voyage-4, dimension: 1024, healthy: true }`.
- Verified direct `handleMemoryIndexScan` for this packet completed with `failed: 0` after the fix.
- Recorded the residual out-of-scope limitation that true startup auth failures still exit before `memory_health` can provide diagnostics.

---

### Files Changed

| File | Changes |
|------|---------|
| `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` | Stateless enrichment consumption, preferred-task fallback guarding for file-backed/JSON mode, overlapping-call serialization guard, fallback handling for descriptive slug/title generation, and explicit `specFolderArg` propagation with no global `CONFIG` mutation |
| `.opencode/skill/system-spec-kit/scripts/utils/task-enrichment.ts` | Stateless-only enrichment guard helper |
| `.opencode/skill/system-spec-kit/scripts/utils/slug-utils.ts` | Generic classification parity for `implementation-and-updates` |
| `.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts` | Regression coverage for mode divergence, preferred-task fallback guarding, workflow seam loader-path proof, overlapping-call serialization, and slug outcomes |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts` | Recursive discovery, canonical root dedupe, recursive staleness checks, future-dated cache invalidation on folder-set mismatch, and graceful invalid-path cache behavior |
| `.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts` | Unit tests for deep recursion/depth boundary/invalid-path behavior |
| `.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery-integration.vitest.ts` | Integration tests for alias dedupe, alias-root order determinism, future-dated cache invalidation on folder-set mismatch, and recursive staleness behavior |
| `opencode.json` | `EMBEDDINGS_PROVIDER=auto`, no literal `${VOYAGE_API_KEY}` / `${OPENAI_API_KEY}` interpolation, and updated notes clarifying parent-environment key sourcing |
| `.opencode/skill/system-spec-kit/mcp_server/context-server.ts` | Fatal startup behavior when embedding dimension and active database disagree |
| `.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts` | Regression coverage for startup exit on embedding dimension mismatch |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts` | Lazy-profile resolution before `memory_health` reports `embeddingProvider` |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts` | Provider metadata type widened for runtime health reporting |
| `.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts` | Regression coverage for lazy-profile health reporting and configured fallback behavior |
| `decision-record.md` | Decision rationale for workflow serialization and alias-root order stability |
| `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `handover.md` | Canonical Level 2 documentation merge for spec 013 |

---

### Verification

| Check | Result |
|-------|--------|
| `npx tsc --noEmit` | PASS |
| `node ../mcp_server/node_modules/vitest/vitest.mjs run tests/task-enrichment.vitest.ts --root . --config ../mcp_server/vitest.config.ts` (from `.opencode/skill/system-spec-kit/scripts`) | PASS (32 passed; includes preferred-task fallback guarding, workflow-level seam proof that the later stateless run reaches the loader path with `CONFIG.DATA_FILE === null`, overlapping-call concurrency coverage, and the HTML sanitization regression coverage) |
| `npm run test --workspace=mcp_server -- tests/folder-discovery.vitest.ts` | PASS (45 passed) |
| `npm run test --workspace=mcp_server -- tests/folder-discovery-integration.vitest.ts` | PASS (28 passed; includes stale-cache shrink follow-up coverage, future-dated cache invalidation on folder-set mismatch, and alias-root order determinism integration assertions) |
| `npm run test --workspace=mcp_server -- tests/context-server.vitest.ts` | PASS (315 passed; includes fatal startup mismatch coverage) |
| `npm run test --workspace=mcp_server -- tests/embeddings.vitest.ts` | PASS (14 passed; includes auto-mode provider-resolution coverage) |
| `npx vitest run tests/memory-crud-extended.vitest.ts` | PASS (68 passed; includes lazy-profile health reporting coverage) |
| `~/.opencode/bin/opencode --print-logs --log-level DEBUG mcp list` | PASS (`spec_kit_memory` connected; startup logs reported `API key validated (provider: voyage)` and `Embedding dimension validated: 1024`) |
| `npx tsc -p tsconfig.json --noEmit` in `.opencode/skill/system-spec-kit/mcp_server` | PASS |
| `npx tsc -p tsconfig.json` in `.opencode/skill/system-spec-kit/mcp_server` | PASS |
| `npm run typecheck` in `.opencode/skill/system-spec-kit` | PASS |
| `npm run build` in `.opencode/skill/system-spec-kit` | PASS |
| Real MCP SDK `memory_health` probe against `dist/context-server.js` | PASS (`Memory system healthy: 963 memories indexed`; `provider: voyage`; `voyage-4`; `dimension: 1024`; `healthy: true`) |
| Direct `handleMemoryIndexScan` for `02--system-spec-kit/022-hybrid-rag-fusion/007-combined-bug-fixes` | PASS (`failed: 0`) |
| `python3 .opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py --root .opencode/skill/system-spec-kit` | PASS |
| Spec validator (`validate.sh`) | PASS |
| Context memory save | PASS via explicit phase-folder target `02--system-spec-kit/022-hybrid-rag-fusion/007-combined-bug-fixes`; closure context saved directly to `007-combined-bug-fixes/memory/` and packet docs refreshed via `memory_index_scan` (supersedes earlier rejection-based owning-root workaround) |
| Raw verification artifacts | Saved under `scratch/verification-logs/` for command-level audit evidence |

---

### Known Limitations

1. Recursive discovery is intentionally bounded to max depth 8.
2. Invalid/nonexistent non-empty explicit paths intentionally degrade to empty cache object.
3. If startup auth truly fails, pre-flight validation still exits before `memory_health` is available; that broader boot-order behavior remains outside this spec's completed scope.

---

### Post-Review Remediation

Following the 8-agent multi-perspective review (2026-03-06), 7 findings were identified and addressed:

#### Findings Addressed

| ID | Severity | Description | Resolution |
|----|----------|-------------|------------|
| F1 | BLOCKING | tasks.md lacked REQ-xxx traceability | Added inline REQ references to all 32 tasks |
| F2 | BLOCKING | No getEmbeddingProfileAsync rejection test | Added EXT-H4d test with mockRejectedValue |
| F3 | MINOR | Phase naming inconsistency (1/2/3/4 vs A/B/C/D) | Aligned plan.md to letter naming (A/B/C/D) |
| F4 | MINOR | Pre-impl P0 evidence cited docs not commands | Enhanced with grep-verifiable evidence |
| F5 | MINOR | ProviderMetadata type divergence + unsafe cast | Removed unsafe `as` cast, aligned types |
| F6 | MINOR | No depth-8 positive boundary test | Added T046-10a2 acceptance test |
| F7 | MINOR | Test singleton reuse without module reset | Added afterAll with vi.resetModules() |

#### Remediation Files Changed

- `tasks.md` -- REQ-xxx inline references (F1)
- `plan.md` -- Phase header renaming (F3)
- `checklist.md` -- P0 evidence enhancement (F4)
- `implementation-summary.md` -- This remediation section (meta)
- `memory-crud-types.ts` -- Type alignment (F5)
- `memory-crud-health.ts` -- Cast removal (F5)
- `memory-crud-extended.vitest.ts` -- Rejection test + cleanup (F2, F7)
- `folder-discovery-integration.vitest.ts` -- Depth-8 boundary test (F6)

---
---

## Source: 015 -- Bug Fixes and Alignment

### Metadata

| Field | Value |
| --- | --- |
| Spec ID | 022-015 |
| Status | In progress -- merged historical implementation snapshot (57/76 task snapshot) with open work still tracked in spec/tasks/checklist |
| Implemented | 2026-03-07 |
| Method | 14 parallel agents, autonomous mode |

---

### Canonical Merge Context (2026-03-07)

This file is now part of the canonical merged folder `007-combined-bug-fixes`, which supersedes the former remediation-epic track now folded into `007-combined-bug-fixes` and the prior audit follow-up folder `008-architecture-audit`.

Completion statements inherited from prior folders are retained as historical snapshots only. Current truth for completion remains the open/closed state in `spec.md`, `tasks.md`, and `checklist.md`.

#### Historical 009 Remediation Digest (Snapshot)

- Execution model snapshots: 3-wave pass (up to 14 agents), 5-wave pass (up to 16 agents), and 5-sprint Opus pass (10-agent review remediation).
- Metric snapshots retained from 009 lineage: 7,003/7,003 and 7,008/7,008 test gates in early waves, 7,081/7,081 during tranche closure, and 7,085/7,085 after Opus Phase 6 consolidation.
- Representative workstreams absorbed as historical context: legacy V1 pipeline removal, shared score-resolution normalization (`resolveEffectiveScore()`), BM25 stemmer hardening, checkpoint/data-safety fixes, and graph/cognitive integrity fixes.

#### Historical 010 Continuity Digest (Snapshot)

- Session objective snapshot (2026-03-03 handover): close remaining test/build issues, verify standards alignment, update root-level docs, and complete commit/push cycle.
- Important fixes snapshot: DB test mock hardening in `handler-helpers.vitest.ts`, root/scripts TypeScript config alignment, duplicate `escapeLikePattern` removal by import reuse, and modularization guard tightening.
- Commit/test snapshot from 010 handover: commit `40891251` (`167 files`, `+25,694/-13,365`) with reported `230 files` and `7085 tests` passing at that historical point.
- Continuity snapshot: Tier 3 follow-up remains delegated to `008-architecture-audit`.
- CR-P2-4 nuance resolution: 010 handover text still called `memory-save.ts` decomposition deferred, but 010 task ledger later marked CR-P2-4 complete with extracted `handlers/save/*` modules and a slim orchestrator path. In 015 this is treated as historical completion context, not an active deferment.

All bullets above are historical records absorbed from 009/010 artifacts; they are not asserted as current-branch verification truth.

---

### What Was Built

Earlier remediation waves implemented a substantial subset of P0/P1/P2 findings from prior audit passes. The implementation covered 5 phases across 20+ source files in `shared/`, `mcp_server/`, and `scripts/` directories, plus documentation fixes across feature-catalog and spec folders.

#### Phase 1: Critical Scoring Pipeline (8 fixes)

**P0-001: RRF Division by Zero** -- Added `k < 0` validation at entry of `fuseResults()`, `fuseResultsMulti()`, and `fuseResultsCrossVariant()` in `rrf-fusion.ts`. Three guard locations (lines 115, 178, 330-331).

**P1-004: termMatchBonus coercion** -- Changed `||` to `??` for `termMatchBonus` default (line 247). `termMatchBonus: 0` now correctly disables the bonus.

**P1-005: convergenceBonus double-counting** -- Stripped per-variant convergenceBonus from initial insertion in cross-variant merge (line 375). Cross-variant bonus now applied cleanly in Step 4 only.

**P1-006: convergenceBonus unit mismatch** -- Normalized bonus by `1/(k+1)` factor at lines 216-218 and 384-386, matching RRF score magnitude.

**P1-009/010/011: NaN propagation in composite-scoring.ts** -- Added `isFinite(stability)` guard (line 248), `Math.max(0, accessCount)` clamp (line 314), and `similarity ?? 0` nullish coalescing (line 366).

**P1-001/002/003: MMR reranker edge cases** -- Added `limit <= 0` guard (line 95), `Math.max(0, maxCandidates)` clamp (line 98), and vector length mismatch detection with zero-padding (lines 49-76).

**P1-007: Recency boost normalization** -- Added max-normalization pass after `applyRecencyBoost()` to guarantee [0,1] range.

**P1-008: Intent weight normalization** -- Moved weight normalization outside the `documentType` conditional so weights always sum to 1.0.

#### Phase 1B: Checkpoint Data Loss (2 fixes)

**P0-005: INSERT OR REPLACE CASCADE** -- Split prepared statement by mode in `checkpoints.ts`. Merge-mode (`clearExisting=false`) now uses `INSERT OR IGNORE` + explicit `UPDATE` (lines 518-660), preventing CASCADE deletes on `working_memory`.

**P1-036: Causal edges in checkpoint snapshot** -- Added `causalEdges` to `CheckpointSnapshot` interface, snapshot query in `createCheckpoint()` (lines 347-363), and restore logic with `INSERT OR IGNORE` (lines 738-761).

#### Phase 2: Graph and Handler Fixes (8 fixes)

**P1-014: Stale community assignments** -- Added `DELETE FROM community_assignments WHERE memory_id NOT IN (SELECT id FROM memory_index)` before insertions (line 392).

**P1-015: NaN nodeId guard** -- Added `Number.isFinite(numId)` validation with `continue` on failure (lines 407-408).

**P1-016: parseInt prefix matching** -- Replaced `Number.parseInt(id, 10)` with `Number(id)` + `Number.isInteger()` in `graph-signals.ts` (lines 68-69, 188-190).

**P1-035: Algorithm label timing** -- Changed function to accept `algorithm` parameter instead of computing from module-level state (line 387).

**P1-017: Structured error response** -- Replaced `throw new Error(...)` with `createMCPErrorResponse()` in `memory-triggers.ts` (lines 185-195).

**P1-018: Shape validation** -- Added `console.warn()` for shape mismatches before dedup in `memory-search.ts` (lines 925-932).

**P1-037: insertEdge null check** -- Added `if (!edge)` guard returning `createMCPErrorResponse` with code E031 (lines 504-517).

**P1-038: Compare-and-swap** -- Added `AND state = ?` to UPDATE WHERE clause in `setIngestJobState()` with conflict detection (lines 270-280).

#### Phase 3: Mutation Safety and Scripts (8 fixes)

**P1-019: JSDoc accuracy** -- Rewrote `atomicSaveMemory` JSDoc to describe best-effort indexing (lines 391-405).

**P1-020: DB-commit vulnerability** -- Added detailed code comment explaining the renameSync failure window (lines 203-210).

**P1-021/022: No-database early return** -- Both `memory-crud-update.ts` (line 187) and `memory-crud-delete.ts` (line 93) now return early with warning when database handle is null.

**P1-023: Path boundary check** -- Added `PROJECT_ROOT` boundary validation for `--roots` (lines 170-176) and `--report` (lines 186-189) in `backfill-frontmatter.ts`.

**P1-024: I/O error handling** -- Wrapped `readFileSync` in try/catch with user-friendly error message in `validate-memory-quality.ts` (lines 293-307).

**P1-025: Parameterized SQL** -- Replaced string interpolation with `?` placeholders in `folder-detector.ts` (lines 947-953).

**P1-026: CONFIG parameter passing** -- Added `LoadOptions` parameter to `loadCollectedData()` in `data-loader.ts` (lines 73-139) and updated caller in `workflow.ts` (line 435).

**P1-034: Replace require()** -- Added proper `import Database` and `import { DB_PATH }` at top of `folder-detector.ts` (lines 10-14), replaced runtime `require()` (line 945).

#### Phase 4: Embeddings and Architecture (5 fixes)

**P1-012: Ollama removal** -- Removed `|| providerName === 'ollama'` from `validateApiKey()` local providers check in `factory.ts` (line 304).

**P1-013: Forward options** -- Forwarded `baseUrl`, `timeout`, `maxTextLength` to VoyageProvider, OpenAIProvider, and HfLocalProvider constructors with unsupported-option warnings (lines 138-179).

**P1-031: Layer definitions** -- Added `memory_bulk_delete`, `memory_ingest_start`, `memory_ingest_status`, `memory_ingest_cancel` to LAYER_DEFINITIONS. Three tools already present.

**P1-032: Dead code removal** -- Deleted `mcp_server/lib/utils/retry.ts` (365 lines) and `mcp_server/tests/retry.vitest.ts` (622 lines).

**P1-033: Package root resolution** -- Replaced hardcoded `__dirname` candidates with `findUp('package.json')` pattern in `shared/config.ts`.

#### Phase 5: Documentation Quality (18 fixes)

**P1 Accuracy (4 fixes):** checkpoint_delete confirmName gate, feature 13-11 slug-utils.ts, feature 16-03 progressive-validate.sh, feature 16-02 name alignment.

**P2 Doc Quality (7 fixes):** All em dashes replaced in feature_catalog.md (50 instances), HVR "robust" replaced in 2 files, 3 boilerplate READMEs rewritten with actual content, 4 broken TOC links fixed, test playbook header updated 128->151, flag count reconciled 89->72 across 6 locations, epic status updated to 85%+ complete.

**P2 Code Quality (6 fixes):** DegradedModeContract fields to camelCase, isHealthy reset on success (openai.ts + voyage.ts), O(n) queue.shift() replaced with index-based BFS (2 files), double adjacency build eliminated, cache size bounds added (10000 limit), rank-memories.ts main() guarded with ESM entry-point check.

---

### Files Changed

| File | Action | Purpose |
| --- | --- | --- |
| `shared/algorithms/rrf-fusion.ts` | Modified | P0-001, P1-004, P1-005, P1-006 |
| `shared/algorithms/mmr-reranker.ts` | Modified | P1-001, P1-002, P1-003 |
| `shared/algorithms/adaptive-fusion.ts` | Modified | P1-007, P1-008, P2-006 |
| `shared/embeddings/factory.ts` | Modified | P1-012, P1-013 |
| `shared/embeddings/providers/openai.ts` | Modified | P2-008 |
| `shared/embeddings/providers/voyage.ts` | Modified | P2-008 |
| `shared/config.ts` | Modified | P1-033 |
| `mcp_server/lib/scoring/composite-scoring.ts` | Modified | P1-009, P1-010, P1-011 |
| `mcp_server/lib/storage/checkpoints.ts` | Modified | P0-005, P1-036 |
| `mcp_server/lib/storage/causal-edges.ts` | Modified | P1-040 |
| `mcp_server/lib/storage/transaction-manager.ts` | Modified | P1-020 |
| `mcp_server/lib/graph/community-detection.ts` | Modified | P1-014, P1-015, P1-035, P2-009, P2-010 |
| `mcp_server/lib/graph/graph-signals.ts` | Modified | P1-016, P2-009, P2-011 |
| `mcp_server/lib/ops/job-queue.ts` | Modified | P1-038 |
| `mcp_server/lib/eval/ablation-framework.ts` | Modified | P1-039 |
| `mcp_server/lib/architecture/layer-definitions.ts` | Modified | P1-031 |
| `mcp_server/lib/utils/retry.ts` | Deleted | P1-032 |
| `mcp_server/tests/retry.vitest.ts` | Deleted | P1-032 |
| `mcp_server/handlers/causal-graph.ts` | Modified | P1-037 |
| `mcp_server/handlers/memory-triggers.ts` | Modified | P1-017 |
| `mcp_server/handlers/memory-search.ts` | Modified | P1-018 |
| `mcp_server/handlers/memory-save.ts` | Modified | P1-019 |
| `mcp_server/handlers/memory-crud-update.ts` | Modified | P1-021 |
| `mcp_server/handlers/memory-crud-delete.ts` | Modified | P1-022 |
| `scripts/memory/backfill-frontmatter.ts` | Modified | P1-023 |
| `scripts/memory/validate-memory-quality.ts` | Modified | P1-024 |
| `scripts/memory/rank-memories.ts` | Modified | P2-025 |
| `scripts/spec-folder/folder-detector.ts` | Modified | P1-025, P1-034 |
| `scripts/core/workflow.ts` | Modified | P1-026 |
| `scripts/loaders/data-loader.ts` | Modified | P1-026 |

#### Documentation Files Changed

| File | Action | Purpose |
| --- | --- | --- |
| ../011-feature-catalog/feature_catalog.md | Modified | P2-002 em dashes, P2-003 HVR |
| ../011-feature-catalog/07-evaluation/01-ablation-studies-evalrunablation.md | Modified | P2-003 HVR |
| ../011-feature-catalog/05-lifecycle/04-checkpoint-deletion-checkpointdelete.md | Modified | P1-027 |
| ../011-feature-catalog/13-memory-quality-and-indexing/11-content-aware-memory-filename-generation.md | Modified | P1-028 |
| ../011-feature-catalog/16-tooling-and-scripts/02-architecture-boundary-enforcement.md | Modified | P1-030 |
| ../011-feature-catalog/16-tooling-and-scripts/03-progressive-validation-for-spec-documents.md | Modified | P1-029 |
| Historical 009 README (retired folder) | Rewritten | P2-004 |
| `../002-indexing-normalization/README.md` | Rewritten | P2-004 |
| `../006-ux-hooks-automation/README.md` | Rewritten | P2-004 |
| Historical 009 implementation summary (retired folder) | Modified | P2-014 flag count |
| Historical 009 checklist (retired folder) | Modified | P2-014 flag count |
| `../001-hybrid-rag-fusion-epic/spec.md` | Modified | P2-013 status |
| ../016-manual-testing-per-playbook/manual-test-playbooks.md | Modified | P2-012 header |
| Historical constitutional README (external snapshot) | Modified | P2-005 TOC |
| Historical config README (external snapshot) | Modified | P2-005 TOC |

---

### Verification Results

| Check | Result |
| --- | --- |
| `npm run check --workspace=scripts` | PASS |
| `npm run check --workspace=mcp_server` in `.opencode/skill/system-spec-kit` | PASS |
| `python3 .opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py --root .opencode/skill/system-spec-kit` | PASS (scanned 731, findings 0) |
| `node node_modules/vitest/vitest.mjs run tests/graph-signals.vitest.ts tests/working-memory.vitest.ts tests/checkpoint-working-memory.vitest.ts tests/checkpoints-storage.vitest.ts tests/memory-crud-extended.vitest.ts tests/bm25-index.vitest.ts` in `.opencode/skill/system-spec-kit/mcp_server` | PASS (6 files, 275 tests) |
| `node mcp_server/node_modules/vitest/vitest.mjs run tests/unit-rrf-fusion.vitest.ts tests/checkpoints-storage.vitest.ts tests/access-tracker.vitest.ts tests/access-tracker-extended.vitest.ts` | PASS (73 passed) |
| `node node_modules/vitest/vitest.mjs run tests/composite-scoring.vitest.ts tests/unit-rrf-fusion.vitest.ts tests/mpab-aggregation.vitest.ts tests/co-activation.vitest.ts tests/fsrs-scheduler.vitest.ts tests/eval-metrics.vitest.ts` | PASS (322 passed) |
| `node node_modules/vitest/vitest.mjs run tests/score-normalization.vitest.ts tests/unit-normalization.vitest.ts tests/unit-normalization-roundtrip.vitest.ts` | PASS (56 passed) |
| `node mcp_server/node_modules/vitest/vitest.mjs run tests/context-server.vitest.ts` | PASS (315 passed) |
| `node .opencode/skill/system-spec-kit/scripts/tests/test-folder-detector-functional.js` | PASS (32 passed, 0 failed, 3 skipped) |
| Full `vitest run` | PASS (`264` passed, `1` skipped test files; `7536` passed, `47` skipped, `28` todo tests) |
| `tsc --noEmit` | Pass -- zero errors |
| Em dashes in feature_catalog.md | 0 remaining |
| HVR "robust" in authored prose | 0 remaining |
| TODO/FIXME in modified files | 0 found |
| Dead retry.ts deleted | Confirmed |

---

### Historical Completion Snapshot (Not Current Overall Truth)

The table below is retained as a historical progress snapshot from prior execution reporting. It does not override current open items tracked in this spec folder.

| Category | Done | Total | Rate |
| --- | --- | --- | --- |
| P0 code fixes | 2/2 | 2 | 100% |
| P1 code fixes | 35/35 | 35 | 100% |
| P1 doc accuracy | 4/4 | 4 | 100% |
| P2 doc quality | 7/7 | 7 | 100% |
| P2 code quality | 6/10 | 10 | 60% |
| Test tasks | 0/10 | 10 | 0% |
| **Total** | **57** | **76** | **75%** |

#### Deferred Items

- **Test tasks (6):** T015, T020, T023, T028, T033, T036 -- writing tests for remaining coverage gaps. Recommend as follow-up sprint.
- **P2 code (4):** T054 (EMBEDDING_DIM), T059 (shared error utils), T060 (dimension fallback), T061 (mutation ledger transaction) -- lower priority improvements.

---

### 2026-03-13 Deferred Follow-up

This follow-up pass closed the remaining composite-scoring regression gap from source 015 and retired a large set of stale or already-implemented source 016 audit findings with fresh evidence from the current tree.

- Source 015: T006 / CHK-014 closed via explicit composite-scoring regressions for negative and non-finite stability, invalid dates, undefined inputs, Infinity inputs, and negative usage counts.
- Source 016: T069-T085 are now fully complete, including T080. `graph-signals.ts` now uses SCC condensation with longest-path DAG traversal for causal depth, with regressions covering rooted cycles, a rootless cycle with an outgoing tail, and shortcut edges.
- Source 016: `working-memory.ts` canonical schema now uses `ON DELETE SET NULL` with legacy-schema migration support; tests verify migration and detached-row behavior.
- Source 016: `memory-crud-update.ts` / `memory-crud-delete.ts` error-envelope evidence remains valid and was re-verified via `memory-crud-extended.vitest.ts` and `bm25-index.vitest.ts`.
- Current deferred inventory is now 10 items in source 015 only.

---
---

## Source: 017 -- 30-Commit Bug Audit (W5, 2026-03-10)

### Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-combined-bug-fixes |
| **Completed** | 2026-03-10 |
| **Level** | 3 |
| **Method** | 15 Codex CLI agents (gpt-5.3-codex --full-auto), 3 sequential waves |

---

### What Was Built

62 P1 bug fixes across 3 waves, addressing all remaining findings from the 30-commit audit (15 CLI agents). Fixes span race conditions, data flow integrity, architecture contracts, handler logic, cognitive subsystem, save/mutation pipeline, storage integrity, eval scripts, and extractor/script hardening.

#### Wave A+B: Quick Wins + Medium Effort (29 fixes)

**Commit:** `0b53820c` (23 files, +265/-97)

**Race conditions (R02, R04, R07-R11):** Atomic SQL retry_count increment, lastDbCheck timing fix, narrow error catch, BM25 rollback cleanup, storageLayer-routed chunk delete, error status check after save, flush accumulator preservation.

**Config validation (A03, A04, A07):** Number.isFinite + positive checks for BATCH_SIZE and batch-processor, early return when archival disabled.

**Cognitive (C01-C04):** Cache key includes limit parameter, event_counter increment in batchUpdateScores, try/catch on getLatestSessionEventCounter, filter includes pending/partial embedding statuses.

**Data flow (D01, D02, D06, D09, D10):** Score alias synchronization after boost writes, resolveEffectiveScore pattern, parentMemoryId normalization before MPAB, filePath validation via isPathWithin, specFolder-based cache invalidation.

**Handlers (H03, H04, H06, H07):** str.includes() replaces RegExp(userInput), non-success status counting, dedup before chunking branch, Map-based anchor validation.

**Save/Mutation (M01-M03):** SUPERSEDE failure returns error, error status check before hooks, numeric epoch for last_accessed.

**Storage (S02):** stmt.changes === 0 tracked in failure counter.

**Eval (E05, E06):** Empty dataset guards before division.

#### Wave C: Larger Refactors (33 fixes)

**Commit:** `37b5ba59` (30 files, +543/-201)

**Race conditions (R01, R03, R05, R06):** Atomic session dedup via BEGIN IMMEDIATE, cadence gate transaction, divergence retry in runInTransaction, in-flight promise coalescing for cache.

**Data flow (D03-D05, D07, D08):** Post-hydration filter re-application for summary hits, MPAB fallback promotes parent identity, reassembly writes to precomputedContent, buildPipelineRow normalizes score aliases, canonical_file_path replaces LIKE query.

**Architecture (A01, A02, A05, A06):** Lazy cognitive config via getCognitiveConfig() getter, shared resolveDatabasePaths(), typed GraphSearchFn, re-export VectorStoreInterface from shared.

**Handlers (H01, H02, H05, H08, H09):** Session ownership guard, confirmation gate for autoRepair, contentDiverged tracking, pending status in dedup SELECT, unified computeCacheKey.

**Storage (S01, S03):** Removed id from bulkInsertEdges INSERT, orphan edge guard.

**Eval (E01-E04, E07, E08):** UTC date component validation, AST-based import detection, allowlist schema validation, removed unimplemented --apply flag, 1/rank MRR, baseline MRR=0 yields undefined ratio.

**Extractors/Scripts (X01-X07):** path.resolve() normalization, workflow ordering fix, branching structure detection, thematic break handling, path containment check, segment parsing via path.relative, narrow ENOENT catch.

---

### Regression Fixes

Two regressions were detected and fixed during Wave C verification:

1. **UNIQUE index on mutation_ledger (3 test failures):** The R05 fix added `CREATE UNIQUE INDEX` on `(linked_memory_ids[0], mutation_type, timestamp)` which was too strict -- tests legitimately insert multiple entries with the same combination. Changed to regular `CREATE INDEX` since `runInTransaction()` already provides atomicity.

2. **autoRepair confirmation gate (1 test failure):** The H02 fix added a confirmation gate (`if (autoRepair && !confirmed) return needsConfirmation`). The EXT-H12 test called with `autoRepair: true` without `confirmed: true`. Fixed by adding `confirmed: true` to the test call.

---

### Files Changed

| Wave | Files | LOC |
|------|-------|-----|
| A+B | 23 files | +265/-97 |
| C | 30 files | +543/-201 |
| **Total** | ~45 unique files | +808/-298 |

---

### Verification

| Check | Result |
|-------|--------|
| `npx tsc --noEmit` (mcp_server) | PASS |
| `npx tsc --noEmit` (scripts) | PASS |
| `npx tsc --noEmit` (shared) | PASS |
| Test suite | 11 pre-existing failures across 9 files (90 pre-existing failures resolved) |
| New regressions | 0 (after 2 regression fixes) |
| `git diff --stat` scope check | All changes within expected file scope |

---

### Known Limitations

1. **015 deferred tasks (10 items):** Remaining packet deferrals are now source 015 only.
2. **Test failure count discrepancy:** Commit message says "9 pre-existing test failures" while the actual test run showed 11 failures across 9 files (some files have multiple failing tests).
