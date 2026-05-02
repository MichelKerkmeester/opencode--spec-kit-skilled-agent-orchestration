---
title: "Implementation Plan: 051 CocoIndex Feature Catalog"
description: "Plan for inventorying mcp-coco-index and authoring a canonical feature catalog with verification evidence."
template_source: "SPECKIT_TEMPLATE_SOURCE: level_2"
trigger_phrases:
  - "038-coco-index-feature-catalog"
  - "mcp-coco-index feature catalog"
  - "cocoindex catalog"
  - "semantic search catalog"
importance_tier: "important"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/038-coco-index-feature-catalog"
    last_updated_at: "2026-04-30T09:30:00+02:00"
    last_updated_by: "cli-codex"
    recent_action: "Plan executed"
    next_safe_action: "Orchestrator commit"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "audit-findings.md"
      - "remediation-log.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "038-coco-index-feature-catalog"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: 051 CocoIndex Feature Catalog

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation, Python source inventory, Bash helper inventory |
| **Framework** | sk-doc feature catalog conventions |
| **Storage** | Filesystem only |
| **Testing** | Shape audit, evergreen grep, strict validator, system-spec-kit build |

### Overview

The plan reads the actual `mcp-coco-index` skill, references, scripts, tests and vendored source before writing. It groups current behavior into nine catalog categories, creates one per-feature file per capability and records audit decisions in packet-local reports.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Packet folder provided by user.
- [x] sk-doc feature catalog templates read.
- [x] Evergreen rule and standards read.
- [x] `mcp-coco-index` source, references, scripts and tests inventoried.

### Definition of Done

- [x] Catalog categories and feature list authored.
- [x] Per-feature snippets use canonical four-section shape.
- [x] Root `feature_catalog.md` links every feature.
- [x] Packet docs and logs written.
- [x] Verification commands pass.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Current-state documentation inventory with source-anchor traceability.

### Key Components

- **Inventory pass**: reads user-facing docs, references, scripts, tests and vendored implementation files.
- **Taxonomy pass**: groups features by runtime responsibility rather than file type alone.
- **Snippet pass**: writes canonical per-feature files with implementation and validation tables.
- **Root index pass**: summarizes each category and links to detailed feature files.
- **Verification pass**: validates packet docs and catalog shape.

### Data Flow

Source files and tests produce feature candidates. Categories define directory layout. Each feature becomes one snippet. The root catalog links the snippets, then packet reports record coverage and remediation.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Inventory

- [x] Read `SKILL.md`, `README.md`, references and manual playbook.
- [x] Read CLI, MCP, daemon, indexer, query, settings and script source.
- [x] Skim automated test coverage.

### Phase 2: Categorization

- [x] Select 9 category folders.
- [x] Assign 46 features to categories.
- [x] Exclude non-shipped or unsupported operations.

### Phase 3: Snippets

- [x] Create per-feature files with four canonical sections.
- [x] Add real source anchors and validation anchors.
- [x] Balance anchor markers.

### Phase 4: Root Index

- [x] Create root `feature_catalog.md`.
- [x] Add TOC and category sections.
- [x] Link every feature file.

### Phase 5: Validation

- [x] Run strict packet validator.
- [x] Run catalog shape audit.
- [x] Run evergreen grep.
- [x] Run build sanity.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Spec validation | Packet folder | `validate.sh --strict` |
| Shape audit | New catalog feature files | `find`, `grep` |
| Evergreen audit | New catalog files | `grep -rnE` |
| Build sanity | system-spec-kit MCP server | `npm run build` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| sk-doc catalog templates | Documentation standard | Available | Blocks catalog shape |
| Evergreen packet ID rule | Documentation standard | Available | Blocks evergreen content |
| Packet 050 shape realignment | Spec dependency | Available | Confirms shape expectations |
| mcp-coco-index source tree | Source of truth | Available | Blocks feature anchors |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Catalog taxonomy or scope is rejected.
- **Procedure**: Remove `.opencode/skill/mcp-coco-index/feature_catalog/` and this packet folder's authored files. Runtime code is untouched.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Inventory -> Categories -> Snippets -> Root index -> Reports -> Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Inventory | None | Categories |
| Categories | Inventory | Snippets |
| Snippets | Categories | Root index |
| Root index | Snippets | Reports |
| Reports | Root index | Verification |
| Verification | Reports | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Inventory | Medium | Complete |
| Catalog authoring | High | Complete |
| Verification | Medium | Complete |
| **Total** | | **Complete** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-Completion Checklist

- [x] Runtime files untouched.
- [x] Catalog files are additive.
- [x] Packet docs are isolated to packet folder.
<!-- /ANCHOR:enhanced-rollback -->
