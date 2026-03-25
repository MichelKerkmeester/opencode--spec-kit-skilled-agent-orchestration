---
title: "Feature Specification: Code Audit — Tooling and Scripts"
description: "Systematic code audit of 17 Tooling and Scripts features against the current repository, covering validation scripts, admin tooling, filesystem watchers, source-dist alignment, and documentation-boundary helpers."
trigger_phrases:
  - "tooling and scripts audit"
  - "code audit tooling"
  - "016 tooling scripts"
  - "tree thinning"
  - "architecture boundary enforcement"
  - "progressive validation"
  - "dead code removal"
  - "admin CLI audit"
  - "session capturing pipeline"
  - "source-dist alignment"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: Code Audit — Tooling and Scripts

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

### Executive Summary

This packet audits the 17 Tooling and Scripts catalog entries that support Spec Kit build workflows, validation rules, admin operations, checkpointing, and source-dist hygiene. The verified result is 16 MATCH and 1 PARTIAL, with the remaining drift concentrated in the code-standards-alignment entry rather than runtime behavior.

**Outcome**: 16 MATCH, 1 PARTIAL, 0 MISMATCH.

**Key Decisions**: Keep the audit read-only; document stale standards-alignment references as catalog follow-up work rather than implementation work.

**Critical Dependencies**: Feature catalog entries under `feature_catalog/16--tooling-and-scripts/` and the live script/runtime files they describe.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-03-22 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../015-retrieval-enhancements/spec.md |
| **Successor** | ../017-governance/spec.md |
| **Parent** | [`../description.json`](../description.json) |
| **Feature Catalog** | `feature_catalog/16--tooling-and-scripts/` (17 features) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Tooling and Scripts category spans validation rules, CLI entrypoints, migration utilities, watcher logic, and session-capture plumbing. Before this audit pass, the category lacked a single packet confirming that the catalog still matched the repository's actual file layout, behavior, and operational boundaries.

### Purpose
Verify that each Tooling and Scripts feature remains accurately described, traceable to current source files, and properly classified as MATCH or PARTIAL for release-control documentation.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Audit all 17 features listed in `feature_catalog/16--tooling-and-scripts/`.
- Confirm source-file existence and role accuracy for each feature.
- Confirm current-reality text against the live codebase.
- Record follow-up catalog drift without changing implementation code.

### Out of Scope
- Modifying runtime or script implementation files.
- Running fresh performance or durability benchmarks.
- Re-auditing features owned by other catalog categories.

### Files Referenced

| File Path | Role |
|-----------|------|
| `feature_catalog/16--tooling-and-scripts/` | Feature catalog source (17 entries) |
| `scripts/core/tree-thinning.ts` | Tree thinning |
| `scripts/evals/check-architecture-boundaries.ts` | Architecture boundary enforcement |
| `scripts/spec/progressive-validate.sh` | Progressive validation |
| `mcp_server/lib/ops/file-watcher.ts` | Filesystem watcher and delete/rename cleanup |
| `mcp_server/cli.ts` | Standalone admin CLI |
| `scripts/evals/check-source-dist-alignment.ts` | Source-dist alignment enforcement |
| `scripts/memory/generate-context.ts` | JSON-only save contract path |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Audit all 17 Tooling and Scripts features against current source | Every feature entry receives a MATCH or PARTIAL result with supporting notes |
| REQ-002 | Confirm primary source files exist and align with described roles | Core files for each feature are present at HEAD and match the catalog claim |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Capture any stale catalog references as follow-up work | Remaining drift is written down without claiming a runtime mismatch that does not exist |
| REQ-004 | Keep packet-local and cross-packet markdown references resolvable | Spec-doc integrity passes without broken packet references |
| REQ-005 | Summarize the audit result for release-control reuse | The packet records summary counts and the one known PARTIAL finding |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 17 Tooling and Scripts features are classified as MATCH or PARTIAL.
- **SC-002**: The only remaining drift is the documented standards-alignment catalog follow-up.
- **SC-003**: Packet references resolve cleanly under the spec validator.
- **SC-004**: Release-control readers can identify the category verdict without re-reading every catalog entry.

### Acceptance Scenarios

- **Given** the Tooling and Scripts catalog, **when** the audit is reviewed, **then** all 17 entries have an explicit verdict.
- **Given** a reader checking the packet against the repo, **when** they inspect the cited primary files, **then** the file paths resolve and the described role still matches.
- **Given** the standards-alignment entry, **when** the follow-up notes are read, **then** the stale `SPEC_FOLDER_LOCKS` reference is clearly marked as catalog drift rather than runtime failure.
- **Given** the spec validator runs on this packet, **when** cross-document references are checked, **then** packet-local markdown links resolve cleanly.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Tooling catalog entries remain the audit source of truth | Stale catalog text can mislead later readers | Keep the PARTIAL finding explicit and scoped |
| Risk | Cross-cutting features sample multiple files | Overly broad file lists can hide the primary implementation | Record only the primary files in this packet summary |
| Risk | Documentation paths outside the packet can drift | Broken markdown references fail validator checks | Use packet-local references or descriptive text instead of unresolved external markdown paths |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The audit packet must remain readable without enumerating every cross-cutting helper file.

### Reliability
- **NFR-R01**: Findings must be reproducible by re-reading the cited primary sources at HEAD.

### Maintainability
- **NFR-M01**: The packet must distinguish catalog drift from runtime drift so future remediation does not target the wrong layer.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Cross-Cutting Features
- Features 04, 05, 11, 12, and 16 span many files; the audit tracks their primary surfaces rather than every incidental dependency.

### Documentation Drift
- Standards-alignment line citations can drift even when the underlying policy still exists in a nearby section.

### Shared Ownership
- Session-capture and JSON-mode hardening reuse some of the same files; the audit treats them as separate catalog responsibilities with overlapping evidence.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | 17 catalog entries across scripts, CLI, docs, and runtime helpers |
| Risk | 8/25 | Audit-only packet; main risk is stale documentation, not behavior regressions |
| Research | 14/20 | Cross-cutting features require representative source verification |
| **Total** | **38/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

### Audit Findings

**Audit Date**: 2026-03-22  
**Result**: 16 MATCH, 1 PARTIAL (out of 17 features)

| F# | Feature | Result | Notes |
|----|---------|--------|-------|
| F01 | Tree thinning for spec folder consolidation | MATCH | `scripts/core/tree-thinning.ts` and `scripts/core/workflow.ts` match the catalog behavior |
| F02 | Architecture boundary enforcement | MATCH | `scripts/evals/check-architecture-boundaries.ts` remains the enforcing script |
| F03 | Progressive validation for spec documents | MATCH | `scripts/spec/progressive-validate.sh` still matches the documented workflow |
| F04 | Dead code removal | MATCH | Cross-cutting cleanup pattern confirmed in `mcp_server/lib/` |
| F05 | Code standards alignment | PARTIAL | One stale source reference remains for `SPEC_FOLDER_LOCKS`; broader standards claims still match |
| F06 | Real-time filesystem watching with chokidar | MATCH | `mcp_server/lib/ops/file-watcher.ts` remains the operational surface |
| F07 | Standalone admin CLI | MATCH | `mcp_server/cli.ts` and downgrade helpers remain aligned |
| F08 | Watcher delete/rename cleanup | MATCH | Delete/rename handlers still live in `file-watcher.ts` |
| F09 | Migration checkpoint scripts | MATCH | Checkpoint create/restore scripts remain present and role-accurate |
| F10 | Schema compatibility validation | MATCH | Vector-index schema validation remains in place |
| F11 | Feature catalog code references | MATCH | The catalog-reference and module-comment conventions remain present |
| F12 | Session capturing pipeline quality | MATCH | Session capture still spans the documented script/runtime surfaces |
| F13 | Constitutional memory manager command | MATCH | The memory-learn command and supporting docs remain present |
| F14 | Source-dist alignment enforcement | MATCH | Alignment guard still lives in `check-source-dist-alignment.ts` |
| F15 | Module boundary map | MATCH | The module-boundary documentation surfaces remain present in the repo |
| F16 | JSON mode structured summary hardening | MATCH | JSON-mode hardening still spans the documented pipeline and handler layers |
| F17 | JSON-only save contract (deprecation posture) | MATCH | JSON-only save flow remains centered on `generate-context.ts` and data loading |

### F05 Detail — Code Standards Alignment (PARTIAL)

The only persistent drift in this category is catalog-side:

1. Stale line references in the code-standards-alignment entry no longer point at the exact locations used when the audit was first written.
2. The `SPEC_FOLDER_LOCKS` symbol is now owned by `spec-folder-mutex.ts` rather than the older `memory-save.ts` location cited by the catalog entry.

### Summary Statistics

| Result | Count |
|--------|-------|
| MATCH | 16 |
| PARTIAL | 1 |
| FAIL | 0 |
| **Total** | **17** |

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Q1 resolved: The code-standards-alignment entry still needs a catalog-only path correction for `SPEC_FOLDER_LOCKS`.
- Q2 open: Should future audits split cross-cutting tooling features into primary-file and supporting-file lists to reduce catalog drift?
<!-- /ANCHOR:questions -->

---

### Related Documents

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
