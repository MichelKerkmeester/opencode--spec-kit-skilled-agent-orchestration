---
title: "Feature Specification: 050 Feature Catalog Shape Realignment"
description: "Realign per-feature catalog snippets to the canonical sk-doc four-section shape while preserving current-reality content and source references."
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
trigger_phrases:
  - "037-feature-catalog-shape-realignment"
  - "feature catalog shape audit"
  - "sk-doc snippet template alignment"
  - "catalog OVERVIEW canonical"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/037-feature-catalog-shape-realignment"
    last_updated_at: "2026-04-30T08:40:00+02:00"
    last_updated_by: "cli-codex"
    recent_action: "Shape realigned"
    next_safe_action: "Orchestrator commit"
    blockers: []
    key_files:
      - "audit-findings.md"
      - "remediation-log.md"
      - "lint-results.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "037-feature-catalog-shape-realignment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: 050 Feature Catalog Shape Realignment

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
| **Created** | 2026-04-30 |
| **Branch** | `037-feature-catalog-shape-realignment` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Per-feature feature-catalog snippets had drifted away from the canonical sk-doc shape. The largest drift lived in the `code_graph` and `skill_advisor` catalogs, with additional lint drift in the main `system-spec-kit` catalog.

### Purpose

Make every per-feature file in the six real feature catalogs present the same four H2 sections: `OVERVIEW`, `CURRENT REALITY`, `SOURCE FILES`, and `SOURCE METADATA`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Lint the four catalog roots reported as conformant.
- Remove redundant `sk-deep-review` per-file TOCs.
- Realign `skill_advisor` feature files from PURPOSE and TEST COVERAGE shape.
- Realign `code_graph` feature files from SURFACE, TRIGGER, CLASS, CAVEATS, CROSS-REFS shape.
- Fix any additional per-feature drift found during the six-catalog audit.
- Preserve source references, validation references, and current behavior text.

### Out of Scope

- Code or schema changes.
- Root `feature_catalog.md` index edits.
- Renaming published feature files.
- Rewriting content meaning beyond section placement and evergreen cleanup.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/sk-deep-review/feature_catalog/**/*.md` | Modify | Remove redundant per-file TOCs where present |
| `.opencode/skill/system-spec-kit/feature_catalog/**/*.md` | Modify | Fix lint-discovered per-feature shape drift |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/feature_catalog/**/*.md` | Modify | Rebuild per-feature files into canonical shape |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/feature_catalog/**/*.md` | Modify | Rebuild per-feature files into canonical shape |
| `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/037-feature-catalog-shape-realignment/*` | Create | Packet docs, audit findings, remediation log, and lint results |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Keep edits documentation-only. | No code, schema, or root index files change. |
| REQ-002 | Use canonical per-feature shape. | Six-catalog shape audit returns zero drift. |
| REQ-003 | Preserve catalog content meaning. | Old sections are renamed, moved, or nested rather than discarded. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Realign `skill_advisor` files. | PURPOSE becomes OVERVIEW, TEST COVERAGE becomes Validation And Tests, RELATED moves to metadata. |
| REQ-005 | Realign `code_graph` files. | SURFACE becomes SOURCE FILES, runtime behavior sections move to CURRENT REALITY, CROSS-REFS move to metadata. |
| REQ-006 | Lint conformant catalogs. | `lint-results.md` records before and after results for all six roots. |
| REQ-007 | Honor evergreen-doc rule. | Unexempted packet-history references are removed from touched feature catalog files. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `audit-findings.md` records before and after drift for each catalog.
- **SC-002**: `remediation-log.md` records mapping decisions for changed files.
- **SC-003**: `lint-results.md` confirms frontmatter, H1, shape, anchor balance, and evergreen checks.
- **SC-004**: Strict packet validator exits 0.

### Acceptance Scenarios

- **Given** a `skill_advisor` per-feature file with PURPOSE, TEST COVERAGE, and RELATED sections, **When** the realignment runs, **Then** it uses the canonical four H2 sections and retains validation plus related references in the mapped sections.
- **Given** a `code_graph` per-feature file with SURFACE, TRIGGER, CLASS, CAVEATS, and CROSS-REFS sections, **When** the realignment runs, **Then** runtime behavior moves into CURRENT REALITY and source paths move into SOURCE FILES.
- **Given** a conformant catalog root with redundant per-file TOCs, **When** lint cleanup runs, **Then** TOCs are removed without changing the canonical H2 order.
- **Given** the final six-root shape audit, **When** each per-feature file is checked, **Then** no catalog root returns a `DRIFT` line.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | sk-doc snippet template | Defines the canonical four-section shape | Read before edits |
| Dependency | Prior graph/context packets | Catalogs depend on current catalog entries | Use current files as source of truth |
| Risk | Template asset false positives | Broad `find` includes sk-doc asset templates that are not catalog snippets | Audit the six real catalog roots separately and record the exemption |
| Risk | Evergreen false positives | Manual playbook scenario IDs look like packet IDs | Classify stable scenario IDs as exempt in `lint-results.md` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Maintainability

- **NFR-M01**: Per-feature catalog files use a predictable H2 order.
- **NFR-M02**: Catalog source and validation references remain close to the feature they document.

### Reliability

- **NFR-R01**: Verification commands are reproducible from this packet.
- **NFR-R02**: Packet docs distinguish real catalog roots from sk-doc asset templates.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Template Assets

The broad repository grep under `*/feature_catalog/*` also sees sk-doc template assets. Those two files are not per-feature catalog snippets and remain untouched.

### Stable Scenario IDs

Manual playbook paths include stable scenario IDs such as `001-...` and `025-...`. The evergreen rule permits these as current validation artifacts, not packet history.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 22/25 | Six catalog roots, 404 per-feature files audited, 100 files touched |
| Risk | 10/25 | Documentation-only, no source behavior changes |
| Research | 12/20 | Template, example, evergreen, and catalog shape audits required |
| **Total** | **44/70** | **Level 2** |
<!-- /ANCHOR:complexity -->
