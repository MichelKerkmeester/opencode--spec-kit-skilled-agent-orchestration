---
title: "Specification: Memory Search Bug Fixes (Unified)"
description: "Canonical Level 2 spec for stateless filename/generic-slug parity fixes and folder-discovery follow-up hardening under spec 013"
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
| **Status** | Verification updated |
| **Level** | 2 |
| **Date Consolidated** | 2026-03-06 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. Problem & Purpose

Two linked workstreams were completed in this spec folder but documented in duplicate root/addendum packets:

1. Stateless filename / generic-slug parity fixes.
2. Folder-discovery follow-up hardening and verification.

This unified spec makes `013-memory-search-bug-fixes` the only canonical identity and records both workstreams in one standard Level 2 packet.
<!-- /ANCHOR:problem -->

---

## Problem Statement

Memory-search bug-fix work was split across duplicate root and addendum document packets, and verification statements drifted from actual command outcomes. The canonical spec packet must remain single-identity (`013-memory-search-bug-fixes`), retain both workstreams, and carry truthful verification status.

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
- Verification evidence and final handover coherence.

### Out of Scope
- Memory scoring/ranking algorithm changes.
- Database schema/index migrations.
- Auth/security model changes beyond no-regression verification.
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
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. Success Criteria

- SC-001: Stateless mode yields descriptive filenames/titles for generic labels while JSON mode remains unchanged and invocation-local config state is restored after `runWorkflow()`.
- SC-002: Generic label parity includes `Implementation and updates` across enrichment and slug handling.
- SC-003: Recursive discovery supports deep trees with max depth 8, canonical alias-root dedupe, and stale-cache shrink detection when cached folders disappear.
- SC-004: Invalid/nonexistent non-empty explicit input paths return empty cache object gracefully.
- SC-005: Evidence-backed verification and coherent Level 2 docs exist with standard filenames only.
<!-- /ANCHOR:success-criteria -->

---

## Acceptance Scenarios

- **Given** a generic task label in stateless mode, **when** memory content slug/title are generated, **then** the spec-title fallback is used for descriptive naming.
- **Given** JSON/file-backed mode, **when** enrichment decision logic runs, **then** task enrichment from spec title is not applied.
- **Given** a file-backed workflow run followed by a stateless workflow run, **when** `runWorkflow()` completes each invocation, **then** `CONFIG.DATA_FILE` from the file-backed run is restored and cannot leak into the later stateless run.
- **Given** nested spec folders deeper than three levels, **when** folder discovery runs, **then** recursive discovery includes valid folders up to depth 8 and excludes depth 9.
- **Given** alias roots `specs/` and `.opencode/specs/`, **when** root candidates are canonicalized, **then** duplicate canonical roots are skipped while first-candidate behavior is preserved.
- **Given** invalid or nonexistent non-empty explicit input paths, **when** `ensureDescriptionCache` executes, **then** it returns an empty cache object without crashing.

---

<!-- ANCHOR:risks -->
## 6. Risks & Dependencies

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Behavior drift between stateless and JSON modes | Incorrect enrichment side effects | Explicit stateless guard + regression tests |
| Risk | Recursive traversal overreach | Performance/coverage ambiguity | Hard max depth 8 + depth-boundary tests |
| Dependency | Filesystem canonicalization for alias dedupe | Duplicate/missed root scanning | Canonical-path dedupe + integration coverage |
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
