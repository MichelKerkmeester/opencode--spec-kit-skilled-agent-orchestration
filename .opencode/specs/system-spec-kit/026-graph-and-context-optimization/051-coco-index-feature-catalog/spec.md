---
title: "Feature Specification: 051 CocoIndex Feature Catalog"
description: "Author a complete canonical feature catalog for the mcp-coco-index semantic code search skill."
template_source: "SPECKIT_TEMPLATE_SOURCE: level_2"
trigger_phrases:
  - "051-coco-index-feature-catalog"
  - "mcp-coco-index feature catalog"
  - "cocoindex catalog"
  - "semantic search catalog"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/051-coco-index-feature-catalog"
    last_updated_at: "2026-04-30T09:30:00+02:00"
    last_updated_by: "cli-codex"
    recent_action: "Catalog authored"
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
      fingerprint: "sha256:051-coco-index-feature-catalog-specification"
      session_id: "051-coco-index-feature-catalog"
      parent_session_id: "026-graph-and-context-optimization"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: 051 CocoIndex Feature Catalog

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
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The `mcp-coco-index` skill had a broad runtime and documentation surface but no `feature_catalog/` inventory. Operators had to read `SKILL.md`, references, scripts, tests and vendored source separately to understand what currently ships.

### Purpose

Create a canonical feature catalog that maps current `mcp-coco-index` capabilities to real implementation and validation anchors.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Create `.opencode/skill/mcp-coco-index/feature_catalog/feature_catalog.md`.
- Create per-feature files in numbered `NN--category/` folders.
- Cite real source and validation file anchors.
- Create Level 2 packet docs and audit logs.

### Out of Scope

- Runtime code changes.
- Vendored upstream source edits.
- Feature behavior changes or schema changes.
- Git commits or branch changes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/mcp-coco-index/feature_catalog/` | Create | Root catalog plus per-feature snippets |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/051-coco-index-feature-catalog/` | Create | Packet docs, metadata and reports |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Create a complete feature catalog package | Root index and per-feature files exist under `mcp-coco-index/feature_catalog/` |
| REQ-002 | Follow canonical snippet shape | Per-feature files expose `OVERVIEW`, `CURRENT REALITY`, `SOURCE FILES`, `SOURCE METADATA` as the first four H2s |
| REQ-003 | Keep catalog evergreen | Catalog files contain no packet-history wording |
| REQ-004 | Cite real source anchors | Source tables use real file paths and line numbers from current files |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Cover CLI, MCP, indexing, daemon, search, fork extensions, tooling, configuration and validation | Category structure maps these surfaces without invented features |
| REQ-006 | Create packet documentation | Level 2 docs, audit findings and remediation log exist |
| REQ-007 | Pass verification | Strict validator, shape audit, evergreen grep and build sanity run |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: **Given** the root catalog is opened, **Then** it links to 46 per-feature files across 9 categories.
- **SC-002**: **Given** the shape audit runs, **Then** it emits zero `DRIFT` lines.
- **SC-003**: **Given** the evergreen grep runs, **Then** it emits no unexempted catalog hits.
- **SC-004**: **Given** strict validation runs, **Then** the packet validator exits 0.
<!-- /ANCHOR:success-criteria -->

---

## L2: ACCEPTANCE SCENARIOS

### Scenario 1: Root Catalog Navigation

Given a reader opens `.opencode/skill/mcp-coco-index/feature_catalog/feature_catalog.md`
When they scan the table of contents and category sections
Then they can reach every per-feature file through a relative link.

### Scenario 2: Per-Feature Shape

Given a per-feature catalog file under `.opencode/skill/mcp-coco-index/feature_catalog/`
When the first four H2 headings are inspected
Then they are `OVERVIEW`, `CURRENT REALITY`, `SOURCE FILES`, and `SOURCE METADATA`.

### Scenario 3: Source Traceability

Given a feature file describes a current capability
When the `SOURCE FILES` section is reviewed
Then it cites real implementation and validation anchors with file paths and line numbers.

### Scenario 4: Evergreen Safety

Given the catalog is evergreen skill documentation
When the packet-history grep runs on the new catalog files
Then it returns no unexempted hits.

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Prior catalog shape realignment | Confirms target shape | Read sk-doc templates and example catalog first |
| Risk | Vendored source contains packet-history comments | Evergreen grep could flag copied wording | Do not copy patch-history prose into catalog files |
| Risk | Large catalog could invent features | Catalog only behaviors visible in source, references, scripts or tests |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Documentation Quality

- **NFR-D01**: Per-feature files keep balanced anchor markers.
- **NFR-D02**: Root index stays navigable and does not duplicate source tables.
- **NFR-D03**: Packet continuity frontmatter keeps short `recent_action` and `next_safe_action` values.

### Safety

- **NFR-S01**: No runtime source files are edited.
- **NFR-S02**: No upstream vendored files are touched.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Template example differs from packet shape: follow the packet's explicit four-section snippet contract.
- Existing untracked packet folder contains only logs: preserve it and add required packet files.
- Source comments mention historical patch numbers: catalog references current behavior without copying packet history.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | 46 feature snippets plus root and packet docs |
| Risk | 8/25 | Documentation only |
| Research | 16/20 | Broad inventory across source, references, tests and scripts |
| **Total** | **42/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
