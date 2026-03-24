---
title: "Code Audit: Tooling and Scripts"
description: "Code audit of 17 Tooling and Scripts features covering tree thinning, architecture boundary enforcement, progressive validation, dead code removal, code standards alignment, filesystem watching, admin CLI, migration checkpoints, schema validation, feature catalog references, session capturing, constitutional memory management, source-dist alignment, module boundary mapping, JSON mode hardening, and JSON-only deprecation posture."
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
  - "module boundary map"
importance_tier: "normal"
contextType: "general"
---
# Code Audit: Tooling and Scripts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

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
| **Parent** | [`../description.json`](../description.json) |
| **Feature Catalog** | `feature_catalog/16--tooling-and-scripts/` (17 features) |
<!-- /ANCHOR:metadata -->

Parent: 007-code-audit-per-feature-catalog

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Tooling and Scripts category contains 17 features spanning build-pipeline utilities, validation scripts, CLI tools, filesystem watchers, dead code cleanup, and session-capture infrastructure. These features lack a consolidated code audit that verifies source file accuracy, test coverage claims, and current-reality alignment against the live codebase.

### Purpose
Produce a structured, evidence-based code audit of all 17 features in the Tooling and Scripts category. Each audit task verifies that the feature catalog description matches the current implementation, that declared source files exist and contain the described functionality, and that test coverage claims are substantiated.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Audit all 17 features listed in `feature_catalog/16--tooling-and-scripts/`.
- Verify source file existence and role accuracy for each feature.
- Confirm test file existence and coverage claim alignment.
- Validate current-reality descriptions against HEAD of the codebase.
- Flag discrepancies: missing files, stale references, inaccurate descriptions, dead code claims.

### Out of Scope
- Modifying any implementation code or test files.
- Running tests or producing fresh test output.
- Auditing features from other catalog categories.
- Creating new tests or fixing found issues (those become follow-up tasks).

### Features Under Audit

| # | Feature | Key Source Files |
|---|---------|-----------------|
| 01 | Tree thinning for spec folder consolidation | `scripts/core/tree-thinning.ts`, `scripts/core/workflow.ts` |
| 02 | Architecture boundary enforcement | `scripts/evals/check-architecture-boundaries.ts` |
| 03 | Progressive validation for spec documents | `scripts/spec/progressive-validate.sh` |
| 04 | Dead code removal | Cross-cutting: 15 files in `mcp_server/lib/` |
| 05 | Code standards alignment | Cross-cutting: AI-intent comments, MODULE headers, import ordering |
| 06 | Real-time filesystem watching with chokidar | `mcp_server/lib/ops/file-watcher.ts` |
| 07 | Standalone admin CLI | `mcp_server/cli.ts`, `mcp_server/lib/storage/schema-downgrade.ts` |
| 08 | Watcher delete/rename cleanup | `mcp_server/lib/ops/file-watcher.ts` |
| 09 | Migration checkpoint scripts | `mcp_server/scripts/migrations/create-checkpoint.ts`, `restore-checkpoint.ts` |
| 10 | Schema compatibility validation | `mcp_server/lib/search/vector-index-schema.ts` |
| 11 | Feature catalog code references | Convention-based: `// Feature catalog:` and `// MODULE:` comments |
| 12 | Session capturing pipeline quality | 20+ files across `scripts/` and `mcp_server/` |
| 13 | Constitutional memory manager command | `.opencode/command/memory/learn.md` and supporting docs |
| 14 | Source-dist alignment enforcement | `scripts/evals/check-source-dist-alignment.ts` |
| 15 | Module boundary map | `mcp_server/lib/MODULE_MAP.md`, `ARCHITECTURE.md` |
| 16 | JSON mode structured summary hardening | `scripts/` pipeline files, `mcp_server/` handler and retry files |
| 17 | JSON-only save contract (deprecation posture) | `scripts/memory/generate-context.ts`, `scripts/loaders/data-loader.ts` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:approach -->
## 4. APPROACH

### Audit Protocol Per Feature (T001-T017)

Each task follows a uniform 5-step audit:

1. **File existence check** -- Verify every source file listed in the feature catalog entry exists at HEAD.
2. **Role accuracy check** -- Confirm each file contains the described functionality (exports, functions, classes, constants).
3. **Test coverage check** -- Verify test files exist and contain the claimed test groups or scenario names.
4. **Current-reality alignment** -- Compare the catalog's "Current Reality" section against the live code for factual accuracy.
5. **Finding summary** -- Record PASS/WARN/FAIL per check with evidence citations.

### Severity Classification

| Severity | Meaning |
|----------|---------|
| **PASS** | Catalog claim fully matches codebase reality |
| **WARN** | Minor drift: renamed export, slightly different line count, missing optional detail |
| **FAIL** | Material discrepancy: missing file, wrong function name, false coverage claim |
<!-- /ANCHOR:approach -->

---

<!-- ANCHOR:decision-record -->
## 5. DECISION RECORD

| ID | Decision | Rationale |
|----|----------|-----------|
| D1 | Audit is read-only; no code changes | Keeps audit objective; fixes tracked as follow-up tasks |
| D2 | Features 12 and 16 share overlapping source files | Audit each independently but note shared-file overlap |
| D3 | Cross-cutting features (04, 05, 11) audited by sampling | Full enumeration impractical; audit representative files per category |
<!-- /ANCHOR:decision-record -->

---

<!-- ANCHOR:references -->
## 6. REFERENCES

- Feature catalog source: `feature_catalog/16--tooling-and-scripts/` (17 `.md` files)
- Parent spec: [`007-code-audit-per-feature-catalog`](../description.json)
- Architecture docs: `ARCHITECTURE.md`, `mcp_server/lib/MODULE_MAP.md`
- Code standards: `.opencode/skill/sk-code--opencode/SKILL.md`
<!-- /ANCHOR:references -->

---

<!-- ANCHOR:audit-findings -->
## 7. AUDIT FINDINGS

**Audit Date**: 2026-03-22
**Result**: 16 MATCH, 1 PARTIAL (out of 17 features)

| F# | Feature | Result | Notes |
|----|---------|--------|-------|
| F01 | Tree thinning for spec folder consolidation | MATCH | `scripts/core/tree-thinning.ts` and `scripts/core/workflow.ts` confirmed as described |
| F02 | Architecture boundary enforcement | MATCH | `scripts/evals/check-architecture-boundaries.ts` confirmed present and accurate |
| F03 | Progressive validation for spec documents | MATCH | `scripts/spec/progressive-validate.sh` confirmed as described |
| F04 | Dead code removal | MATCH | 15 files in `mcp_server/lib/` confirmed cleaned; cross-cutting removal verified |
| F05 | Code standards alignment | PARTIAL | `SPEC_FOLDER_LOCKS` refactored from `memory-save.ts` into `spec-folder-mutex.ts`; all other standards alignment claims match |
| F06 | Real-time filesystem watching with chokidar | MATCH | `mcp_server/lib/ops/file-watcher.ts` confirmed present and role-accurate |
| F07 | Standalone admin CLI | MATCH | `mcp_server/cli.ts` and `mcp_server/lib/storage/schema-downgrade.ts` confirmed |
| F08 | Watcher delete/rename cleanup | MATCH | Delete/rename handlers in `mcp_server/lib/ops/file-watcher.ts` confirmed |
| F09 | Migration checkpoint scripts | MATCH | `create-checkpoint.ts` and `restore-checkpoint.ts` confirmed in `mcp_server/scripts/migrations/` |
| F10 | Schema compatibility validation | MATCH | `mcp_server/lib/search/vector-index-schema.ts` confirmed present and role-accurate |
| F11 | Feature catalog code references | MATCH | `// Feature catalog:` and `// MODULE:` comment conventions verified across files |
| F12 | Session capturing pipeline quality | MATCH | 20+ files across `scripts/` and `mcp_server/` confirmed as described |
| F13 | Constitutional memory manager command | MATCH | `.opencode/command/memory/learn.md` and supporting docs confirmed |
| F14 | Source-dist alignment enforcement | MATCH | `scripts/evals/check-source-dist-alignment.ts` confirmed present and role-accurate |
| F15 | Module boundary map | MATCH | `mcp_server/lib/MODULE_MAP.md` and `ARCHITECTURE.md` confirmed as described |
| F16 | JSON mode structured summary hardening | MATCH | Pipeline files in `scripts/` and handler/retry files in `mcp_server/` confirmed |
| F17 | JSON-only save contract (deprecation posture) | MATCH | `scripts/memory/generate-context.ts` and `scripts/loaders/data-loader.ts` confirmed |

### F05 Detail — Code Standards Alignment (PARTIAL)

Two stale references found and fixed in `feature_catalog/16--tooling-and-scripts/05-code-standards-alignment.md`:

1. **Stale SKILL.md line citations** — The catalog cited `sk-code--opencode/SKILL.md:357` for the AI-WHY/AI-TRACE/AI-GUARD prefix policy; this policy no longer exists in SKILL.md at HEAD. The generic purposeful-comment rule now occupies line 357. Additional line drift: `:444`→`:437`, `:435`→`:437`, `:429`→`:431`. All updated in-place.

2. **`SPEC_FOLDER_LOCKS` source file** — The catalog describes the constant as residing in `memory-save.ts`. The constant was refactored into a dedicated `spec-folder-mutex.ts` module. The catalog reference to `memory-save.ts` for this symbol is stale and should be updated to `spec-folder-mutex.ts` (tracked as follow-up; audit scope is read-only).

### Summary Statistics

| Result | Count |
|--------|-------|
| MATCH  | 16    |
| PARTIAL | 1   |
| FAIL   | 0    |
| **Total** | **17** |
<!-- /ANCHOR:audit-findings -->

---

<!-- ANCHOR:open-questions -->
## 8. OPEN QUESTIONS

| # | Question | Status |
|---|----------|--------|
| Q1 | F05 stale SKILL.md line refs (`:357` AI-intent policy removed, `:444`→`:437`, `:435`→`:437`, `:429`→`:431`) | **Resolved** — catalog entry updated in-place (2026-03-22) |
| Q2 | Should the feature catalog entry for F05 be updated to reference `spec-folder-mutex.ts` instead of `memory-save.ts` for `SPEC_FOLDER_LOCKS`? | **Open** — catalog update tracked as follow-up; audit scope is read-only |
<!-- /ANCHOR:open-questions -->
