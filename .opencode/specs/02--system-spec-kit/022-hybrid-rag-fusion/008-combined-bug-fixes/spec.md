---
title: "Combined Bug Fixes"
status: "in-progress"
level: 3
created: "2025-12-01"
updated: "2026-03-08"
description: "Merged spec combining 4 bug-fix and alignment workstreams from 022-hybrid-rag-fusion: auto-detected session bug (003), subfolder resolution fix (008), memory search bug fixes (013), and bug fixes and alignment (015)"
SPECKIT_TEMPLATE_SOURCE: "spec-core | v2.2"
importance_tier: "high"
contextType: "implementation"
---
# Combined Specification: Bug Fixes (016)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

## Overview

This document merges the specifications from 4 related bug-fix and alignment workstreams under `022-hybrid-rag-fusion` into a single canonical reference.

### Merged Sources

| # | Source Folder | Title | Level | Priority |
|---|---------------|-------|-------|----------|
| 1 | `003-auto-detected-session-bug` (merged) | Auto-Detected Session Selection Bug | 2 | P0 |
| 2 | `008-subfolder-resolution-fix` (merged) | Subfolder Resolution Fix | 2 | Normal |
| 3 | `013-memory-search-bug-fixes` (merged) | Memory Search Bug Fixes (Unified) | 2 | Normal |
| 4 | `015-bug-fixes-and-alignment` (merged) | Bug Fixes and Alignment | 3 | P0-P1 |

### Current Verification Snapshot (2026-03-07)

- `npm run check`: PASS (lint + `npx tsc --noEmit`)
- `npm run check:full`: PASS (full package verification green; see `scratch/verification-logs/2026-03-07-mcp-check-full.md`)
- Targeted post-fix verification: PASS (`memory-crud-extended`, `checkpoints-storage`, `adaptive-fusion`, `task-enrichment`, workspace typecheck/build)
- Evidence artifacts:
  - `scratch/cross-ai-review-report.md`
  - `scratch/verification-logs/2026-03-07-post-fix-targeted-verification.md`
  - `scratch/verification-logs/2026-03-07-mcp-check-full.md`

---

## Combined Requirements

- REQ-001: Session auto-detection must prefer active (non-archived) spec folders over stale mtime matches
- REQ-002: Alias resolution for `specs/` and `.opencode/specs/` must be deterministic (same input → same result)
- REQ-003: Mtime distortion from bulk operations must not corrupt folder selection
- REQ-004: Low-confidence detection must trigger confirmation or safe fallback, not silent wrong selection
- REQ-005: Subfolder resolution must correctly resolve nested spec paths without false positives
- REQ-006: Memory search state filters must not exclude valid results when combining tier and recency criteria
- REQ-007: Memory search must handle empty result sets without runtime errors
- REQ-008: Bug-only scope lock: no feature additions or refactoring in this workstream

## Combined Acceptance Criteria

**Given** a repo with active and archived spec folders, **When** the folder detector runs, **Then** it returns the active folder regardless of mtime ordering.

**Given** a spec path using the `specs/` alias, **When** resolved by the detector, **Then** it produces the same result as the `.opencode/specs/` canonical path.

**Given** a memory search with state filters, **When** the filter combination yields no results, **Then** the system returns an empty set without throwing.

**Given** a subfolder path like `003-parent/121-child`, **When** resolved by the detector, **Then** it correctly identifies the child within the parent.

**Given** a bulk file operation that updates mtimes, **When** the folder detector runs afterward, **Then** it does not select a stale folder based on inflated mtime.

**Given** a low-confidence detection result, **When** presented to the user, **Then** the system requests confirmation before proceeding.

## Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node.js) + Markdown command specs |
| **Framework** | SpecKit scripting/runtime modules (MCP server) |
| **Storage** | Local filesystem + SQLite session_learning lookup |
| **Testing** | Functional regression suite (32 test scenarios) |

## Scope

### In Scope
- Folder detector: active-folder preference, alias normalization, mtime resilience, confidence gates
- Subfolder resolution: nested path handling
- Memory search: state filter fixes, empty result handling
- Command doc alignment for resume/handover

### Out of Scope
- New features or capability additions
- Performance optimizations beyond bug fixes
- UI/UX changes beyond confirmation prompts

---

## Verification

All sources share a unified verification gate:
- `npm run check` (lint + TypeScript) — PASS
- `npm run check:full` (full package) — PASS
- Functional regression: 32 passed, 0 failed, 0 skipped
- Cross-AI review: scratch/cross-ai-review-report.md

---

## Source: 003 -- Auto-Detected Session Selection Bug

---

<!-- ANCHOR:metadata -->
### 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-02-22 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
### 2. PROBLEM & PURPOSE

#### Problem Statement
Spec-folder auto-detection can select stale or archived paths when recent modification time is misleading. In the reported failure, detection selected an archived folder instead of active work under `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/`. This misroutes `/spec_kit:resume`, `/spec_kit:handover`, and related workflows to the wrong session context.

#### Purpose
Spec-folder auto-detection must consistently prefer active non-archived work, handle `specs/` and `.opencode/specs/` aliases deterministically, and require user confirmation when confidence is low.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
### 3. SCOPE

#### In Scope
- Deterministic candidate normalization and ranking in spec-folder auto-detection.
- Explicit preference for active non-archived folders over archived or fixture paths.
- Low-confidence confirmation or safe fallback behavior for ambiguous selections.

#### Out of Scope
- Changes to memory embedding/index ranking unrelated to spec folder selection logic.
- New command features unrelated to auto-detected session selection.

#### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts` | Modify | Canonicalize aliases, filter/score candidates, and enforce deterministic selection rules. |
| `.opencode/skill/system-spec-kit/scripts/spec-folder/alignment-validator.ts` | Modify | Align low-confidence decision thresholds and confirmation handling used by folder selection. |
| `.opencode/skill/system-spec-kit/scripts/tests/test-folder-detector-functional.js` | Modify | Add regression tests for archive preference, alias normalization, and mtime distortion scenarios. |
| `.opencode/command/spec_kit/resume.md` | Modify | Update command behavior notes to match deterministic selection and low-confidence confirmation. |
| `.opencode/command/spec_kit/handover.md` | Modify | Keep handover command guidance consistent with new selection/fallback rules. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
### 4. REQUIREMENTS

#### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Prefer active non-archived specs | Given mixed candidates, auto-detection excludes archive and test-fixture folders by default and selects an active non-archived folder unless user explicitly provided a different path. |
| REQ-002 | Deterministic alias handling for `specs/` and `.opencode/specs/` | Equivalent folder targets resolve to one canonical identity and produce the same final selection regardless of alias form in input or filesystem ordering. |
| REQ-003 | Resist mtime distortion | Selection does not rely on raw mtime alone; regression tests prove correctness when unrelated bulk touch/re-index operations skew mtimes. |
| REQ-004 | Low-confidence confirmation/fallback | When top candidates are ambiguous or below confidence threshold, workflow requires explicit user confirmation or falls back to a safe deterministic option with a clear warning. |

#### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Selection rationale visibility | Logs or output explain why a folder was chosen (filters applied, confidence, and tie-break rationale) to support debugging. |
| REQ-006 | Regression coverage | Automated tests cover the four acceptance dimensions in REQ-001 through REQ-004 and fail on pre-fix behavior. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
### 5. SUCCESS CRITERIA

- **SC-001**: Auto-detection never selects a `z_archive` or test-fixture folder when an active non-archived candidate exists.
- **SC-002**: `specs/...` and `.opencode/specs/...` references resolve consistently to the same canonical selection result.
- **SC-003**: Test scenarios with intentionally distorted mtimes still choose the intended active folder.
- **SC-004**: Ambiguous selections trigger explicit confirmation or documented fallback behavior instead of silent misrouting.

#### Acceptance Scenarios
- **Given** a candidate set with one active folder and one archived folder, **when** auto-detect runs, **then** the active non-archived folder is selected.
- **Given** equivalent folder references through `specs/` and `.opencode/specs/`, **when** selection executes, **then** canonical resolution yields the same final folder.
- **Given** mtimes are distorted by bulk touch operations, **when** ranking runs, **then** the selection remains stable for the true active folder.
- **Given** top candidates are close and below confidence threshold, **when** auto-detect cannot decide confidently, **then** it requests confirmation or applies deterministic fallback.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
### 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Existing folder-detection priority chain | Reordering priorities can regress CLI/data explicit path behavior | Preserve Priority 1 and Priority 2 precedence with regression tests. |
| Dependency | Alignment scoring thresholds | Mis-tuned threshold may over-prompt users | Keep threshold explicit and cover boundary values in tests. |
| Risk | Over-filtering candidate folders | Valid active folders could be excluded | Limit exclusions to archive/fixture patterns and add override path support. |
| Risk | Non-deterministic tie handling | Different environments may choose different folders | Define stable tie-breakers (confidence, canonical path, deterministic sort). |
<!-- /ANCHOR:risks -->

---

### L2: NON-FUNCTIONAL REQUIREMENTS

#### Performance
- **NFR-P01**: Auto-detection should complete in under 250ms p95 for up to 500 candidate folders on local disk.
- **NFR-P02**: Confirmation path should add no more than one prompt interaction in low-confidence mode.

#### Security
- **NFR-S01**: Folder normalization must reject path traversal and preserve existing safe path handling.
- **NFR-S02**: Alias canonicalization must not allow selecting folders outside approved `specs/` or `.opencode/specs/` roots.

#### Reliability
- **NFR-R01**: Same input and same filesystem state should always yield the same selected folder.
- **NFR-R02**: Selection behavior remains correct even when mtimes are uniformly modified by batch operations.

---

### L2: EDGE CASES

#### Data Boundaries
- Empty input: if no explicit folder and no candidates exist, emit standard "no spec folder found" guidance.
- Maximum candidate set: deterministic ranking works with deep parent/child phase trees and many siblings.
- Invalid format: malformed spec folder identifiers are rejected with clear expected format messaging.

#### Error Scenarios
- External service failure: if session-learning DB lookup fails, fall through to deterministic filesystem detection.
- Filesystem stat failure: unreadable candidates are skipped without aborting the whole selection flow.
- Concurrent access: if folder contents change during scan, re-sort remaining valid candidates and continue deterministically.

#### State Transitions
- Partial completion: if confidence cannot be established, pause and require confirmation before proceeding.
- Session expiry: if prior active session no longer exists, select best active candidate and explain fallback reason.

---

### L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | Focused bug fix across detection logic, command docs, and targeted tests. |
| Risk | 18/25 | Misrouting risk is high because wrong folder corrupts downstream workflow context. |
| Research | 10/20 | Existing detector and alignment modules already identified; moderate analysis only. |
| **Total** | **44/70** | **Level 2** |

---

### 10. OPEN QUESTIONS

- No blocking open questions at documentation time; confirmation threshold constants may be tuned during implementation using test evidence.

---
---

## Source: 008 -- Subfolder Resolution Fix

---

### Parent Reference

**Parent Spec:** `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/`
**Phase:** 012 of 023 (Hybrid RAG Fusion Refinement)

---

<!-- ANCHOR:problem-008 -->
### Problem

`generate-context.js` fails with "Invalid spec folder format" when given:
1. A bare child name like `012-command-alignment` (3 levels deep under `02--system-spec-kit/022-hybrid-rag-fusion/`)
2. A relative path like `02--system-spec-kit/022-hybrid-rag-fusion/012-command-alignment`

Only the full path `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/012-command-alignment` works.

Three interrelated bugs cause this:
1. `parseArguments` requires exactly 2 path segments (hard-coded `segments.length === 2`)
2. `findChildFolderSync` only searches 1 level deep (`specsDir/*/childName`)
3. Category folders (`02--system-spec-kit`) are invisible to `SPEC_FOLDER_PATTERN` (`/^\d{3}-[a-z][a-z0-9-]*$/`)
<!-- /ANCHOR:problem-008 -->

---

<!-- ANCHOR:requirements-008 -->
### Requirements

- REQ-001: Bare spec folder names must resolve via recursive search through category and parent folders
- REQ-002: Relative multi-segment paths must resolve against known specs directories
- REQ-003: Category folder pattern (`NN--name`) must be recognized as traversable during child folder search
- REQ-004: Existing 2-level nesting (`parent/child`) must continue to work
- REQ-005: Ambiguity detection must still return null when a child exists under multiple distinct parents
- REQ-006: All existing tests must pass; new tests added for deep nesting and category pattern
<!-- /ANCHOR:requirements-008 -->

---

<!-- ANCHOR:scope-008 -->
### Scope

#### In Scope
- `subfolder-utils.ts`: Add `CATEGORY_FOLDER_PATTERN`, recursive `findChildFolderSync`/`findChildFolderAsync`
- `generate-context.ts`: Multi-segment path handling, filesystem fallback in `isValidSpecFolder`
- `core/index.ts`: Export `CATEGORY_FOLDER_PATTERN`
- `test-subfolder-resolution.js`: Fix expectations, add category + deep nesting tests

#### Out of Scope
- Changes to `create.sh` or other scripts
- Spec hierarchy restructuring
<!-- /ANCHOR:scope-008 -->

---

<!-- ANCHOR:success-criteria-008 -->
### Success Criteria

1. `node generate-context.js "008-combined-bug-fixes"` succeeds (bare name)
2. `node generate-context.js "02--system-spec-kit/023-.../012-..."` succeeds (relative path)
3. `test-subfolder-resolution.js`: 31/31 passed, 0 failed (26 original + 5 post-review)
4. `test-folder-detector-functional.js`: no new failures
5. TypeScript compiles cleanly
<!-- /ANCHOR:success-criteria-008 -->

---

### Phase Navigation

| **Parent Spec** | ../spec.md |
- Predecessor: `012-command-alignment`
- Successor: `021-cross-cutting-remediation`

---
---

## Source: 013 -- Memory Search Bug Fixes

---

<!-- ANCHOR:metadata-013 -->
### 1. Metadata

| Field | Value |
|-------|-------|
| **Canonical Spec Folder** | `008-combined-bug-fixes` |
| **Parent Spec** | `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/` |
| **Status** | Verification refreshed |
| **Level** | 2 |
| **Date Consolidated** | 2026-03-06 |
<!-- /ANCHOR:metadata-013 -->

---

<!-- ANCHOR:problem-013 -->
### 2. Problem & Purpose

Three linked workstreams were completed in this spec folder but documented across follow-up remediation passes:

1. Stateless filename / generic-slug parity fixes.
2. Folder-discovery follow-up hardening and verification.
3. Voyage 4 memory-index environment hardening and fail-fast startup behavior.

This unified spec makes `008-combined-bug-fixes` the only canonical identity and records all three workstreams in one standard Level 2 packet.
<!-- /ANCHOR:problem-013 -->

---

### Problem Statement

Memory-search bug-fix work was split across duplicate root and addendum document packets, verification statements drifted from actual command outcomes, and the live memory-index runtime could still drift away from Voyage 4 when `opencode.json` passed literal placeholder strings like `${VOYAGE_API_KEY}` into the managed MCP child process. The canonical spec packet must remain single-identity (`008-combined-bug-fixes`), retain all follow-up workstreams, and carry truthful verification status, including the follow-up `memory_health` reporting fix that removed the stale 768d fallback from lazy startup.

---

<!-- ANCHOR:scope-013 -->
### 3. Scope

#### In Scope
- Stateless-only task enrichment guardrails for generic task labels.
- Generic slug parity alignment (including `Implementation and updates`).
- Regression coverage for JSON-vs-stateless divergence, workflow-level seam restoration, and slug outcomes.
- Folder discovery recursive hardening (depth-limited to 8), including stale-cache shrink follow-up behavior when cached folders disappear.
- Canonical root dedupe for alias roots (`specs/` and `.opencode/specs/`).
- Recursive staleness checks and graceful invalid-path cache behavior.
- Auto provider selection in `opencode.json` without literal `${VOYAGE_API_KEY}` / `${OPENAI_API_KEY}` interpolation; cloud keys must come from the parent shell/launcher environment.
- Context-server startup fail-fast behavior when embedding dimension and active database disagree.
- Accurate `memory_health` provider/model/dimension reporting under lazy provider initialization.
- Context-server regression coverage, direct managed-startup verification, real MCP SDK `memory_health` verification, and direct `handleMemoryIndexScan` verification for this packet.
- Documentation of the residual out-of-scope auth-failure diagnostic limitation where pre-flight validation can still exit before `memory_health` is available.
- Verification evidence and final handover coherence.

#### Out of Scope
- Memory scoring/ranking algorithm changes.
- Database schema/index migrations.
- Auth/security model changes beyond no-regression verification.
- Host launcher/session management beyond confirming the corrected managed startup state.
<!-- /ANCHOR:scope-013 -->

---

<!-- ANCHOR:requirements-013 -->
### 4. Requirements

#### Workstream A: Stateless Filename + Generic Slug Parity

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-A01 | Generic stateless task labels must enrich from spec title fallback. | Stateless mode uses `spec.md` title-derived fallback for descriptive slug/title when task label is generic. |
| REQ-A02 | Enrichment must not affect JSON/file-backed mode. | Guard blocks enrichment when source/file-backed input indicates JSON mode. |
| REQ-A03 | Generic-task semantics must align with slug behavior. | Generic detection includes `Implementation and updates` parity with slug handling. |
| REQ-A04 | Template honesty must remain intact. | `IMPL_TASK` remains sourced from original `implSummary.task`. |
| REQ-A05 | Regression coverage must prove divergence, seam restoration, and outcomes. | Tests verify JSON-vs-stateless behavior, prove a file-backed run cannot leak `CONFIG.DATA_FILE` into a later stateless run, and preserve slug expectations. |

#### Workstream B: Folder Discovery Follow-up

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-B01 | Folder discovery must support deep nested spec layers with bounded recursion. | Recursive discovery includes nested folders and enforces max depth 8. |
| REQ-B02 | Aliased roots must dedupe by canonical path while preserving first candidate path. | Duplicate canonical roots are skipped without changing first-path semantics. |
| REQ-B03 | Staleness checks must use recursively discovered folders and handle cache shrink scenarios. | Cache staleness evaluates full discovered set, not shallow roots only, and a removed cached folder forces regeneration. |
| REQ-B04 | Invalid/nonexistent non-empty input paths must degrade gracefully. | `ensureDescriptionCache` returns empty cache object instead of invalid/throw behavior. |
| REQ-B05 | Unit/integration verification state must be recorded with evidence. | Passing checks are documented truthfully in the packet, including final green integration coverage. |

#### Workstream C: Voyage 4 Memory-Index Environment Fix

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-C01 | MCP memory runtime must remain provider-compatible while preferring Voyage when Voyage credentials are present. | `opencode.json` keeps `EMBEDDINGS_PROVIDER` on `auto` for `spec_kit_memory`, so provider selection remains compatible with Voyage, OpenAI, and hf-local. |
| REQ-C02 | MCP launch config must not replace real cloud-provider keys with literal placeholder strings. | `opencode.json` keeps `EMBEDDINGS_PROVIDER=auto` but does not inject `${VOYAGE_API_KEY}` / `${OPENAI_API_KEY}` into the child environment; the real keys must come from the parent shell/launcher environment. |
| REQ-C03 | Startup must fail safe on provider/database dimension drift. | `context-server.ts` throws during startup when `validateEmbeddingDimension()` is invalid instead of only warning and continuing. |
| REQ-C04 | Regression coverage must lock the startup failure behavior. | `context-server.vitest.ts` asserts startup exits on a 1024 vs 768 mismatch. |
| REQ-C05 | Runtime proof must show auto-mode compatibility with the active 1024d database while selecting Voyage 4 when Voyage credentials are present. | Managed startup reports `spec_kit_memory` connected with Voyage and validated dimension 1024, a real MCP SDK `memory_health` call reports `provider: voyage`, `model: voyage-4`, `dimension: 1024`, and direct `handleMemoryIndexScan` on this packet completes with `failed: 0`. |
| REQ-C06 | `memory_health` must report the active provider profile even when the embedding provider is still lazily initialized. | The handler resolves the lazy embedding profile before formatting `embeddingProvider`, so it reports the real runtime model/dimension instead of the stale 768 fallback. |
<!-- /ANCHOR:requirements-013 -->

---

<!-- ANCHOR:success-criteria-013 -->
### 5. Success Criteria

- SC-001: Stateless mode yields descriptive filenames/titles for generic labels while JSON mode remains unchanged and invocation-local config state is restored after `runWorkflow()`.
- SC-002: Generic label parity includes `Implementation and updates` across enrichment and slug handling.
- SC-003: Recursive discovery supports deep trees with max depth 8, canonical alias-root dedupe, and stale-cache shrink detection when cached folders disappear.
- SC-004: Invalid/nonexistent non-empty explicit input paths return empty cache object gracefully.
- SC-005: Evidence-backed verification and coherent Level 2 docs exist with standard filenames only.
- SC-006: Workspace MCP config keeps `EMBEDDINGS_PROVIDER=auto`, avoids literal placeholder env injection, and prefers Voyage 4 for this memory runtime when Voyage credentials are present, without giving up auto-mode compatibility.
- SC-007: Startup no longer serves through an embedding-dimension mismatch, and managed startup plus direct indexing against this packet complete without failures.
- SC-008: `memory_health` reports the active provider/model/dimension accurately during lazy startup instead of falling back to 768d metadata.
<!-- /ANCHOR:success-criteria-013 -->

---

### Acceptance Scenarios

- **Given** a generic task label in stateless mode, **when** memory content slug/title are generated, **then** the spec-title fallback is used for descriptive naming.
- **Given** JSON/file-backed mode, **when** enrichment decision logic runs, **then** task enrichment from spec title is not applied.
- **Given** a file-backed workflow run followed by a stateless workflow run, **when** `runWorkflow()` completes each invocation, **then** `CONFIG.DATA_FILE` from the file-backed run is restored and cannot leak into the later stateless run.
- **Given** nested spec folders deeper than three levels, **when** folder discovery runs, **then** recursive discovery includes valid folders up to depth 8 and excludes depth 9.
- **Given** alias roots `specs/` and `.opencode/specs/`, **when** root candidates are canonicalized, **then** duplicate canonical roots are skipped while first-candidate behavior is preserved.
- **Given** invalid or nonexistent non-empty explicit input paths, **when** `ensureDescriptionCache` executes, **then** it returns an empty cache object without crashing.
- **Given** the workspace MCP memory runtime starts after the environment fix, **when** `spec_kit_memory` reads `opencode.json`, **then** `EMBEDDINGS_PROVIDER=auto` still resolves to Voyage when `VOYAGE_API_KEY` is present and `opencode.json` does not override that key with a literal placeholder string.
- **Given** a provider/database dimension mismatch at startup, **when** `context-server.ts` validates the database, **then** startup aborts instead of continuing in a degraded state.
- **Given** the embedding provider is still lazily initialized, **when** `memory_health` formats `embeddingProvider`, **then** it resolves the active profile and reports the real `provider`, `model`, and `dimension` instead of the stale 768d fallback.

---

<!-- ANCHOR:risks-013 -->
### 6. Risks & Dependencies

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Behavior drift between stateless and JSON modes | Incorrect enrichment side effects | Explicit stateless guard + regression tests |
| Risk | Recursive traversal overreach | Performance/coverage ambiguity | Hard max depth 8 + depth-boundary tests |
| Risk | Auth validation can still fail before diagnostics come up | Operators may lose `memory_health` during true credential failures | Document the limitation honestly as an out-of-scope follow-up |
| Dependency | Filesystem canonicalization for alias dedupe | Duplicate/missed root scanning | Canonical-path dedupe + integration coverage |
| Dependency | Parent shell/launcher environment provides cloud-provider keys | Remote runtime selection cannot occur without the matching key | `opencode.json` must not override those keys with literal `${...}` placeholders |
| Dependency | Existing test harnesses (`vitest`, build/type scripts) | Verification confidence | Required commands recorded in checklist/summary |
<!-- /ANCHOR:risks-013 -->

---

### L2: Non-Functional Requirements

#### Performance
- NFR-P01: Recursive folder discovery remains bounded by depth 8.
- NFR-P02: Canonical dedupe avoids duplicate root traversal work.

#### Reliability
- NFR-R01: JSON mode behavior remains unchanged by enrichment logic.
- NFR-R02: Invalid explicit paths degrade to empty cache object without crashes.

#### Security
- NFR-S01: No credentials/secrets introduced.
- NFR-S02: No auth/authz behavior changes.

---

### 8. References

- `spec.md` (this file, canonical)
- `plan.md`
- `tasks.md`
- `checklist.md`
- `decision-record.md`
- `implementation-summary.md`
- `handover.md`

---
---

## Source: 015 -- Bug Fixes and Alignment

---

<!-- ANCHOR:metadata-015 -->
### Metadata

| Field            | Value                                                |
| ---------------- | ---------------------------------------------------- |
| Spec ID          | 022-015                                              |
| Title            | Bug Fixes and Alignment                              |
| Status           | Partially complete (historical 015 stream merged; canonical current-state tracking lives in 008) |
| Priority         | P0-P1 (mixed)                                        |
| Level            | 3                                                    |
| Parent           | 022-hybrid-rag-fusion                                |
| Created          | 2026-03-07                                           |
| LOC Estimate     | 500+                                                 |
| Risk             | Medium -- scoring pipeline changes affect all search |
<!-- /ANCHOR:metadata-015 -->

### Canonical Merge Notice (2026-03-07)

`008-combined-bug-fixes` is the canonical destination for merged remediation and audit follow-up.

It supersedes active planning ownership from:
- the historical remediation-epic lineage now folded into `008-combined-bug-fixes` (including consolidated 002/022/023/024/025/026 roots)
- `009-architecture-audit` (cross-AI audit provenance and session handover state)

The remediation-epic lineage now lives inside `008-combined-bug-fixes`, while `009-architecture-audit` is retained as historical lineage; `008-combined-bug-fixes` is the live canonical folder.

---

<!-- ANCHOR:problem_statement-015 -->
### 1. Problem Statement

A 40-agent full audit of the 022-hybrid-rag-fusion system (618 spec files, 100+ source files, 20 feature catalog categories) revealed 5 P0 blockers, 40 P1 required fixes, and ~60 P2 suggestions across code, documentation, and spec alignment.

The most critical findings are: (1) a data loss bug in checkpoint merge-mode restore that triggers CASCADE deletes on live session state, (2) scoring pipeline NaN propagation and division-by-zero bugs, and (3) documentation accuracy errors and missing architecture mappings.

Verification-aligned note: audit counts above are inherited backlog from prior multi-agent review and remain provisional until reproduced in direct verification. This spec now distinguishes inherited backlog from newly confirmed findings.
<!-- /ANCHOR:problem_statement-015 -->

<!-- ANCHOR:scope-015 -->
### 2. Scope

#### In Scope

- P0 code bugs (division by zero, parameter validation, data loss in checkpoint restore)
- P1 code bugs (NaN propagation, bounds violations, transaction safety, error handling)
- P1 documentation accuracy errors (4 feature docs with wrong source file mappings)
- P1 architecture gaps (7 missing LAYER_DEFINITIONS entries, dead code removal)
- P2 documentation quality (em dashes, HVR violations, inflated source tables, stale counts)

#### Out of Scope

- Runtime verification tasks (006-extra-features T012-T098) -- requires live MCP server
- eval_run_ablation execution -- requires eval infrastructure
- 004-constitutional-learn-refactor -- separate workstream
- 012 boundary remediation Phases 1-3 -- separate workstream
- Phase 4 deferred features (warm server, storage adapters, namespaces, AST retrieval)
<!-- /ANCHOR:scope-015 -->

<!-- ANCHOR:requirements-015 -->
### Requirements

| ID | Requirement | Rationale |
| --- | --- | --- |
| REQ-001 | Resolve or explicitly defer VF-001 through VF-008 with evidence linked in checklist/tasks. | Keeps active work tied to reproduced findings, not stale backlog counts. |
| REQ-002 | Restore gate health for `npx tsc --noEmit`, `npm run check`, and `npm run check:full`. | Prevents shipping with known build and validation failures. |
| REQ-003 | Preserve canonical merge truth model where 008 is active and 009/010 plus 015 streams remain historical context only. | Avoids split-canonical drift and contradictory status claims. |
| REQ-004 | Keep P0 checkpoint merge restore safe by preventing CASCADE side effects. | Protects live session state from destructive restore behavior. |
| REQ-005 | Keep scoring and formatter contracts aligned so valid zero-values are not dropped. | Preserves deterministic ranking and response correctness. |
| REQ-006 | Keep documentation references truthful and path-resolvable from this canonical folder. | Ensures validator integrity checks and operator traceability. |
| REQ-007 | Keep inherited backlog clearly labeled as provisional until re-verified. | Prevents unverified historical findings from being treated as current blockers. |
| REQ-008 | Maintain concise Level 3 governance artifacts (spec, plan, tasks, checklist, decision record, implementation summary) with anchors and template provenance markers. | Preserves retrieval structure and validator compatibility. |
<!-- /ANCHOR:requirements-015 -->

<!-- ANCHOR:acceptance_scenarios-015 -->
### Acceptance Scenarios

1. **Given** the canonical folder is validated, **when** the validator runs for `008-combined-bug-fixes`, **then** `TEMPLATE_SOURCE`, `FRONTMATTER_VALID`, and `LEVEL_MATCH` pass without missing-marker findings.
2. **Given** major spec documents are retrieval targets, **when** anchor checks run, **then** `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `decision-record.md` each contain at least one valid ANCHOR pair.
3. **Given** Level 3 section requirements, **when** section checks run, **then** the spec includes explicit `Requirements` and this `Acceptance Scenarios` section with at least six Given/When/Then entries.
4. **Given** plan-level architecture governance, **when** AI protocol checks run, **then** the plan provides Pre-Task Checklist, Execution Rules, Status Reporting Format, and Blocked Task Protocol.
5. **Given** canonical merge history must remain auditable, **when** documentation is reviewed, **then** historical digest language is preserved and clearly separated from current open-work truth.
6. **Given** markdown references in `implementation-summary.md`, **when** integrity checks resolve backticked `.md` paths, **then** all referenced files resolve from this folder context.
<!-- /ANCHOR:acceptance_scenarios-015 -->

### 3. Audit Source

Audit conducted 2026-03-07 using 40 parallel agents:
- 20 native Opus 4.6 agents: Feature catalog review (20 categories) + spec completion
- 10 Codex 5.3 agents: Source code review (algorithms, embeddings, graph, quality, scoring, scripts, MCP tools)
- 10 GPT 5.4 agents: Architecture alignment (spec-vs-code, deferrals, tasks, decisions, READMEs, integration)

Coverage: 91.9% spec-to-code alignment (57/62 requirements), 161/161 feature catalog files, 155/155 testable features, 1418/1606 tasks complete.

#### Historical Test Snapshot Context

Cross-phase test totals differ across source folders because they were captured at different points in time (for example: 7003, 7008, 7081, 7085, 7205). In this canonical spec, those values are retained as historical snapshots only.

Current release truth for this folder is defined by this spec's current checklist and success criteria, not by inherited historical totals.

### 4. Findings Summary

#### Verification-Aligned Addendum (Newly Confirmed)

| ID     | Category | Finding | Location |
| ------ | -------- | ------- | -------- |
| VF-001 | Gate | Gate status green in current tree: `npm run check` and `npm run check:full` both pass | scratch/verification-logs/2026-03-07-mcp-check-full.md |
| VF-002 | Search | Hybrid search score-contract mismatch between scorer output and consumer assumptions | mcp_server/lib/search/hybrid-search.ts:85,109 |
| VF-003 | Search | Valid `similarity=0` is dropped via `||` fallback path | mcp_server/formatters/search-results.ts:348 |
| VF-004 | Runtime | Server error-envelope contract mismatch between handler and envelope/core error utilities | context-server.ts:399; lib/response/envelope.ts:11; lib/errors/core.ts:251 |
| VF-005 | Checkpoint | `clearExisting` restore scoping/causal-edge convergence has been fixed in current tree; retained as resolved lineage item | scratch/cross-ai-review-report.md |
| VF-006 | Documentation | Documentation truthfulness gaps: stale README tool counts and incomplete feature/playbook coverage | README.md:106,183,189,730; tool-schemas.ts:450; undocumented-features-scan.md:11; manual-test-playbooks.md:341,356; feature_catalog.md:296,1767,1776 |
| VF-007 | Scope | Touched non-`mcp_server` surfaces are now explicitly included and updated in this packet | scratch/cross-ai-review-report.md |
| VF-008 | Deferral | Explicit deferral marker still present in active code path (`TODO(CHK-069)`) | mcp_server/lib/search/local-reranker.ts:8 |

Status model for this spec:
- Inherited backlog: existing P0/P1/P2 audit findings (candidate work queue until reproduced)
- Active verification findings: Gate and documentation truth issues are resolved in the refreshed packet; only explicitly deferred historical items remain (VF-008 / D-11).
- Resolved-in-current-tree findings: VF-005 and VF-007 (see scratch evidence)

#### P0 -- Blockers (4)

| ID     | Category | Finding                                                                          | Location                  |
| ------ | -------- | -------------------------------------------------------------------------------- | ------------------------- |
| P0-001 | Code     | Division by zero in RRF fusion -- negative `k` makes denominator 0              | rrf-fusion.ts:120,189     |
| P0-002 | Spec     | 4 P0 checklist items unchecked (CHK-S10, CHK-S11, CHK-035, CHK-036)             | 000-epic/checklist.md     |
| P0-003 | Verify   | 41 runtime verification tasks never executed against live MCP server             | 006-extra-features        |
| P0-004 | Verify   | eval_run_ablation never run -- spec's own P0 hard blocker for release            | 006-extra-features        |
| P0-005 | Code     | INSERT OR REPLACE in checkpoint merge-mode triggers CASCADE, destroys sessions  | checkpoints.ts:506        |

#### P1 -- Required Fixes (35)

##### Code Bugs -- Algorithms (8)

| ID     | Finding                                                                    | Location                     |
| ------ | -------------------------------------------------------------------------- | ---------------------------- |
| P1-001 | `limit=0` returns 1 result (off-by-one in applyMMR)                       | mmr-reranker.ts:95           |
| P1-002 | Negative `maxCandidates` causes `slice(0,-N)` keeping most items           | mmr-reranker.ts:81           |
| P1-003 | Cosine similarity inflated for mismatched-length vectors                   | mmr-reranker.ts:49           |
| P1-004 | `\|\|` vs `??` coerces `termMatchBonus:0` to 0.05                         | rrf-fusion.ts:243            |
| P1-005 | Cross-variant merge double-counts convergenceBonus                         | rrf-fusion.ts:359,369        |
| P1-006 | Unit mismatch: normalized scores + unnormalized bonus                      | rrf-fusion.ts:224-226        |
| P1-007 | Recency boost breaks [0,1] normalization                                   | adaptive-fusion.ts:210,244   |
| P1-008 | Intent weights don't sum to 1.0, normalization conditional on documentType | adaptive-fusion.ts:52-59     |

##### Code Bugs -- Scoring (3)

| ID     | Finding                                                           | Location                   |
| ------ | ----------------------------------------------------------------- | -------------------------- |
| P1-009 | NaN from non-finite stability propagates through composite score  | composite-scoring.ts:300   |
| P1-010 | Negative `accessCount` produces negative usage scores             | composite-scoring.ts:312   |
| P1-011 | Undefined `similarity` yields NaN bypassing clamps                | composite-scoring.ts:364   |

##### Code Bugs -- Embeddings (2)

| ID     | Finding                                                                | Location           |
| ------ | ---------------------------------------------------------------------- | ------------------ |
| P1-012 | Ollama validated as "local" but factory throws "not yet implemented"    | factory.ts:76,289  |
| P1-013 | `baseUrl`, `timeout`, `maxTextLength` options silently ignored          | factory.ts:138,160 |

##### Code Bugs -- Graph (3)

| ID     | Finding                                                        | Location                    |
| ------ | -------------------------------------------------------------- | --------------------------- |
| P1-014 | Stale community assignments never cleaned up                   | community-detection.ts:391  |
| P1-015 | NaN from `Number(nodeId)` survives transaction rollback        | community-detection.ts:403  |
| P1-016 | `parseInt` prefix matching aliases corrupted IDs               | graph-signals.ts:68,188     |

##### Code Bugs -- MCP Handlers (2)

| ID     | Finding                                                             | Location                 |
| ------ | ------------------------------------------------------------------- | ------------------------ |
| P1-017 | Raw `Error` throw vs structured `createMCPErrorResponse`            | memory-triggers.ts:185   |
| P1-018 | Silent deduplication fallback on cached response shape change       | memory-search.ts:903-968 |

##### Code Bugs -- Mutation Safety (4)

| ID     | Finding                                                                   | Location                    |
| ------ | ------------------------------------------------------------------------- | --------------------------- |
| P1-019 | `atomicSaveMemory` partial state on embedding failure (misleading name)   | memory-save.ts:392          |
| P1-020 | DB commit without file on renameSync failure, no rollback possible        | transaction-manager.ts:206  |
| P1-021 | No-database fallback runs update without transaction wrapper              | memory-crud-update.ts:187   |
| P1-022 | Delete fallback skips causal edge cleanup                                 | memory-crud-delete.ts:93    |

##### Code Bugs -- Scripts (4)

| ID     | Finding                                                                          | Location                    |
| ------ | -------------------------------------------------------------------------------- | --------------------------- |
| P1-023 | `--roots`/`--report` CLI args allow path traversal outside project boundary      | backfill-frontmatter.js:141 |
| P1-024 | Uncaught I/O errors crash process with raw stack trace                            | validate-memory-quality.js:246 |
| P1-025 | SQL string interpolation with constants (fragile pattern)                         | folder-detector.ts:942      |
| P1-026 | Mutable global CONFIG during workflow execution (concurrency risk)                | workflow.ts:420             |

##### Documentation Accuracy (4)

| ID     | Finding                                                              | Location              |
| ------ | -------------------------------------------------------------------- | --------------------- |
| P1-027 | checkpoint_delete doc says "no safety net" but code requires confirm | 04-maintenance/04-*.md |
| P1-028 | Feature 13-11 source file points to wrong file                       | 13-memory-quality/11  |
| P1-029 | Feature 16-03 claims "no source files" but script exists             | 16-tooling/03         |
| P1-030 | Feature 16-02 narrative vs table name mismatch                       | 16-tooling/02         |

##### Code Bugs -- Lifecycle and Checkpoints (5)

| ID     | Finding                                                                     | Location                    |
| ------ | --------------------------------------------------------------------------- | --------------------------- |
| P1-036 | Checkpoint snapshot omits causal_edges; restore leaves orphaned edges        | checkpoints.ts:346,568      |
| P1-037 | `insertEdge()` returns null but handler returns `success: true`             | causal-graph.ts:502-509     |
| P1-038 | `setIngestJobState` read-validate-write without compare-and-swap (race)     | job-queue.ts:256-270        |
| P1-039 | Hardcoded `@20` metric labels even when `recallK` differs                   | ablation-framework.ts:420   |
| P1-040 | UPSERT `lastInsertRowid` may return wrong ID, affecting audit trail         | causal-edges.ts:188         |

##### Architecture Gaps (5)

| ID     | Finding                                                          | Location              |
| ------ | ---------------------------------------------------------------- | --------------------- |
| P1-031 | 7 MCP tools missing from LAYER_DEFINITIONS                       | layer-definitions.ts  |
| P1-032 | 365-line dead duplicate retry.ts in mcp_server/lib/utils/        | retry.ts              |
| P1-033 | brittle `__dirname` path resolution assuming 2-level depth       | config.ts:50-51       |
| P1-034 | runtime `require()` bypasses TypeScript module resolution         | folder-detector.ts:942 |
| P1-035 | community-detection algorithm label logic records wrong algorithm | community-detection.ts:398 |

#### P2 -- Suggestions (Top 25)

| ID     | Finding                                                             | Location                     |
| ------ | ------------------------------------------------------------------- | ---------------------------- |
| P2-001 | Source file tables over-inflated across ~50 feature docs             | 011-feature-catalog/*            |
| P2-002 | 50+ em dash violations in feature_catalog.md                        | feature_catalog.md           |
| P2-003 | HVR "robust" in authored prose (3+ locations)                       | multiple docs                |
| P2-004 | 3 spec-folder READMEs are template boilerplate (009, 002, 014)      | sub-spec READMEs             |
| P2-005 | 2 config READMEs broken TOC links (extra brackets)                  | constitutional/, config/     |
| P2-006 | `DegradedModeContract` uses snake_case fields                       | adaptive-fusion.ts:27        |
| P2-007 | `EMBEDDING_DIM` hardcoded 768 vs provider 1024/1536                 | embeddings.ts:561            |
| P2-008 | `isHealthy` flag never reset on success                             | openai.ts:163, voyage.ts:181 |
| P2-009 | O(n) `queue.shift()` causing O(V^2) BFS                            | community-detection.ts:108   |
| P2-010 | Double adjacency build on Louvain escalation                        | community-detection.ts:337   |
| P2-011 | Unbounded graph signal caches (memory leak risk)                    | graph-signals.ts:17,20       |
| P2-012 | Test playbook header says "128" but actual is 151                   | manual-test-playbooks.md     |
| P2-013 | Epic status "In Progress" despite 85% child completion              | 000-epic/spec.md             |
| P2-014 | Flag count 89 vs 72 contradiction between docs                     | 006 vs 010                   |
| P2-015 | `getErrorMessage()`/`isAbortError()` duplicated across 3 files      | openai.ts, voyage.ts         |
| P2-016 | Hardcoded dimension fallback in factory error path                  | factory.ts:214               |
| P2-017 | `createProfileSlug()` doesn't sanitize provider                     | profile.ts:18                |
| P2-018 | Mutation ledger written outside bulk delete transaction              | memory-bulk-delete.ts:186    |
| P2-019 | `confidence-tracker` floating-point drift                           | confidence-tracker.ts:117    |
| P2-020 | Non-finite chunk scores poison MPAB aggregation                     | mpab-aggregation.ts:96       |
| P2-021 | `resolvePackageRoot()` silent fallback without warning               | config.ts:26                 |
| P2-022 | `generateEmbeddingWithTimeout` dangling timer                       | embeddings.ts:268            |
| P2-023 | Comment-code mismatch in HTML stripping                             | workflow.ts:792              |
| P2-024 | Naive 200-char similarity metric (false positive risk)               | content-filter.ts:293        |
| P2-025 | `rank-memories.js` import triggers `main()` as side effect          | rank-memories.js:312         |

### 5. Deferred Items Inventory (11 -- All Documented)

| ID   | Item                              | Blocking Condition                         | Severity |
| ---- | --------------------------------- | ------------------------------------------ | -------- |
| D-01 | Warm server/daemon mode           | MCP SDK HTTP transport standardization     | P2       |
| D-02 | Backend storage adapters          | Corpus >100K or multi-node demand          | P2       |
| D-03 | Namespace management CRUD         | Multi-tenant demand                        | P2       |
| D-04 | AST-level section retrieval       | Spec docs >1000 lines                      | P2       |
| D-05 | ANCHOR tags as graph nodes        | Promoted to P1, Sprint 019                 | P1       |
| D-06 | INT8 quantization                 | Corpus <10K, p95 <50ms (NO-GO)             | P2       |
| D-07 | PageRank wiring to production     | Phase 4                                    | P2       |
| D-08 | Structure-aware chunker wiring    | Phase 4                                    | P2       |
| D-09 | Read-time prediction error gate   | Phase 4                                    | P2       |
| D-10 | RSF fusion production activation  | Shadow-only by design                      | P2       |
| D-11 | TODO(CHK-069) GGUF vs Cohere eval | Eval infrastructure needed                 | P2       |

Active deferrals intentionally exclude historical CR-P2-4 (`memory-save.ts` decomposition), which is treated as a completed legacy item carried from 010 snapshot records.

### 6. Success Criteria

- [x] Verification-aligned findings VF-001 through VF-008 are resolved or explicitly deferred with rationale
- [x] Current branch gate is green: `npx tsc --noEmit`, `npm run check`, and `npm run check:full` all pass
- [x] Documentation truthfulness is restored for tool counts, feature catalog status entries, and manual playbook coverage

- [ ] All P0 code bugs fixed with tests
- [ ] All P1 code bugs fixed with tests
- [ ] All P1 documentation accuracy errors corrected
- [ ] All P1 architecture gaps resolved
- [ ] P2 documentation quality issues addressed (em dashes, HVR, READMEs)
- [ ] verify_alignment_drift.py passes on all modified files
- [ ] No new regressions in existing test suite
