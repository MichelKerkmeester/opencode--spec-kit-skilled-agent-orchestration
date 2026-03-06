---
title: "Specification: Memory Search Bug Fixes (Unified)"
description: "Canonical Level 2 spec for stateless parity fixes, folder-discovery hardening, and the Voyage 4 memory-index environment fix under spec 013"
importance_tier: "normal"
contextType: "implementation"
---
# Specification: Memory Search Bug Fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. Metadata

| Field | Value |
|-------|-------|
| **Canonical Spec Folder** | `013-memory-search-bug-fixes` |
| **Parent Spec** | `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/` |
| **Status** | Verification refreshed |
| **Level** | 2 |
| **Date Consolidated** | 2026-03-06 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. Problem & Purpose

Three linked workstreams were completed in this spec folder but documented across follow-up remediation passes:

1. Stateless filename / generic-slug parity fixes.
2. Folder-discovery follow-up hardening and verification.
3. Voyage 4 memory-index environment hardening and fail-fast startup behavior.

This unified spec makes `013-memory-search-bug-fixes` the only canonical identity and records all three workstreams in one standard Level 2 packet.
<!-- /ANCHOR:problem -->

---

## Problem Statement

Memory-search bug-fix work was split across duplicate root and addendum document packets, verification statements drifted from actual command outcomes, and the live memory-index runtime could still drift away from Voyage 4 when `opencode.json` passed literal placeholder strings like `${VOYAGE_API_KEY}` into the managed MCP child process. The canonical spec packet must remain single-identity (`013-memory-search-bug-fixes`), retain all follow-up workstreams, and carry truthful verification status, including the follow-up `memory_health` reporting fix that removed the stale 768d fallback from lazy startup.

---

<!-- ANCHOR:scope -->
## 3. Scope

### In Scope
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

### Out of Scope
- Memory scoring/ranking algorithm changes.
- Database schema/index migrations.
- Auth/security model changes beyond no-regression verification.
- Host launcher/session management beyond confirming the corrected managed startup state.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. Requirements

### Workstream A: Stateless Filename + Generic Slug Parity

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-A01 | Generic stateless task labels must enrich from spec title fallback. | Stateless mode uses `spec.md` title-derived fallback for descriptive slug/title when task label is generic. |
| REQ-A02 | Enrichment must not affect JSON/file-backed mode. | Guard blocks enrichment when source/file-backed input indicates JSON mode. |
| REQ-A03 | Generic-task semantics must align with slug behavior. | Generic detection includes `Implementation and updates` parity with slug handling. |
| REQ-A04 | Template honesty must remain intact. | `IMPL_TASK` remains sourced from original `implSummary.task`. |
| REQ-A05 | Regression coverage must prove divergence, seam restoration, and outcomes. | Tests verify JSON-vs-stateless behavior, prove a file-backed run cannot leak `CONFIG.DATA_FILE` into a later stateless run, and preserve slug expectations. |

### Workstream B: Folder Discovery Follow-up

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-B01 | Folder discovery must support deep nested spec layers with bounded recursion. | Recursive discovery includes nested folders and enforces max depth 8. |
| REQ-B02 | Aliased roots must dedupe by canonical path while preserving first candidate path. | Duplicate canonical roots are skipped without changing first-path semantics. |
| REQ-B03 | Staleness checks must use recursively discovered folders and handle cache shrink scenarios. | Cache staleness evaluates full discovered set, not shallow roots only, and a removed cached folder forces regeneration. |
| REQ-B04 | Invalid/nonexistent non-empty input paths must degrade gracefully. | `ensureDescriptionCache` returns empty cache object instead of invalid/throw behavior. |
| REQ-B05 | Unit/integration verification state must be recorded with evidence. | Passing checks are documented truthfully in the packet, including final green integration coverage. |

### Workstream C: Voyage 4 Memory-Index Environment Fix

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-C01 | MCP memory runtime must remain provider-compatible while preferring Voyage when Voyage credentials are present. | `opencode.json` keeps `EMBEDDINGS_PROVIDER` on `auto` for `spec_kit_memory`, so provider selection remains compatible with Voyage, OpenAI, and hf-local. |
| REQ-C02 | MCP launch config must not replace real cloud-provider keys with literal placeholder strings. | `opencode.json` keeps `EMBEDDINGS_PROVIDER=auto` but does not inject `${VOYAGE_API_KEY}` / `${OPENAI_API_KEY}` into the child environment; the real keys must come from the parent shell/launcher environment. |
| REQ-C03 | Startup must fail safe on provider/database dimension drift. | `context-server.ts` throws during startup when `validateEmbeddingDimension()` is invalid instead of only warning and continuing. |
| REQ-C04 | Regression coverage must lock the startup failure behavior. | `context-server.vitest.ts` asserts startup exits on a 1024 vs 768 mismatch. |
| REQ-C05 | Runtime proof must show auto-mode compatibility with the active 1024d database while selecting Voyage 4 when Voyage credentials are present. | Managed startup reports `spec_kit_memory` connected with Voyage and validated dimension 1024, a real MCP SDK `memory_health` call reports `provider: voyage`, `model: voyage-4`, `dimension: 1024`, and direct `handleMemoryIndexScan` on this packet completes with `failed: 0`. |
| REQ-C06 | `memory_health` must report the active provider profile even when the embedding provider is still lazily initialized. | The handler resolves the lazy embedding profile before formatting `embeddingProvider`, so it reports the real runtime model/dimension instead of the stale 768 fallback. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. Success Criteria

- SC-001: Stateless mode yields descriptive filenames/titles for generic labels while JSON mode remains unchanged and invocation-local config state is restored after `runWorkflow()`.
- SC-002: Generic label parity includes `Implementation and updates` across enrichment and slug handling.
- SC-003: Recursive discovery supports deep trees with max depth 8, canonical alias-root dedupe, and stale-cache shrink detection when cached folders disappear.
- SC-004: Invalid/nonexistent non-empty explicit input paths return empty cache object gracefully.
- SC-005: Evidence-backed verification and coherent Level 2 docs exist with standard filenames only.
- SC-006: Workspace MCP config keeps `EMBEDDINGS_PROVIDER=auto`, avoids literal placeholder env injection, and prefers Voyage 4 for this memory runtime when Voyage credentials are present, without giving up auto-mode compatibility.
- SC-007: Startup no longer serves through an embedding-dimension mismatch, and managed startup plus direct indexing against this packet complete without failures.
- SC-008: `memory_health` reports the active provider/model/dimension accurately during lazy startup instead of falling back to 768d metadata.
<!-- /ANCHOR:success-criteria -->

---

## Acceptance Scenarios

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

<!-- ANCHOR:risks -->
## 6. Risks & Dependencies

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Behavior drift between stateless and JSON modes | Incorrect enrichment side effects | Explicit stateless guard + regression tests |
| Risk | Recursive traversal overreach | Performance/coverage ambiguity | Hard max depth 8 + depth-boundary tests |
| Risk | Auth validation can still fail before diagnostics come up | Operators may lose `memory_health` during true credential failures | Document the limitation honestly as an out-of-scope follow-up |
| Dependency | Filesystem canonicalization for alias dedupe | Duplicate/missed root scanning | Canonical-path dedupe + integration coverage |
| Dependency | Parent shell/launcher environment provides cloud-provider keys | Remote runtime selection cannot occur without the matching key | `opencode.json` must not override those keys with literal `${...}` placeholders |
| Dependency | Existing test harnesses (`vitest`, build/type scripts) | Verification confidence | Required commands recorded in checklist/summary |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: Non-Functional Requirements

### Performance
- NFR-P01: Recursive folder discovery remains bounded by depth 8.
- NFR-P02: Canonical dedupe avoids duplicate root traversal work.

### Reliability
- NFR-R01: JSON mode behavior remains unchanged by enrichment logic.
- NFR-R02: Invalid explicit paths degrade to empty cache object without crashes.

### Security
- NFR-S01: No credentials/secrets introduced.
- NFR-S02: No auth/authz behavior changes.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:references -->
## 8. References

- `spec.md` (this file, canonical)
- `plan.md`
- `tasks.md`
- `checklist.md`
- `decision-record.md`
- `implementation-summary.md`
- `handover.md`
<!-- /ANCHOR:references -->
