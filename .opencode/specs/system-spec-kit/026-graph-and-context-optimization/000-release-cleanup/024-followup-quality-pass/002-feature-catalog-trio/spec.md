---
title: "Feature Specification: 037/002 feature-catalog-trio"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "Updates three feature-catalog surfaces with packet 031-036 runtime changes. Doc-only packet for system-spec-kit, skill_advisor, and code_graph catalog discovery/alignment."
trigger_phrases:
  - "037-002-feature-catalog-trio"
  - "feature catalog updates"
  - "catalog refresh 031-036"
  - "system-spec-kit catalog"
  - "skill_advisor catalog"
  - "code_graph catalog"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/024-followup-quality-pass/002-feature-catalog-trio"
    last_updated_at: "2026-04-29T20:35:30+02:00"
    last_updated_by: "cli-codex"
    recent_action: "Resource map indexed"
    next_safe_action: "Use packet for downstream work"
    blockers: []
    key_files:
      - "discovery-notes.md"
      - ".opencode/skill/system-spec-kit/feature_catalog/"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/feature_catalog/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "037-002-feature-catalog-trio"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Standalone code_graph feature catalog was not found; code-graph notes were applied to the existing system-spec-kit code-graph catalog entry."
---
# Feature Specification: 037/002 feature-catalog-trio

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
| **Created** | 2026-04-29 |
| **Parent Spec** | ../spec.md |
| **Successor** | ../003-testing-playbook-trio/spec.md |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../001-sk-code-opencode-audit/spec.md |
| **Parent Spec** | ../spec.md |
| **Branch** | `main` |
| **Parent** | `024-followup-quality-pass` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packets 031-036 added MCP tools, hook diagnostics, CLI matrix runners, and changed freshness contracts. The feature catalogs lagged those shipped surfaces, which makes operator-facing docs undercount tools and miss the current repair/freshness behavior.

### Purpose
Refresh the existing catalogs with line-cited current-reality entries while keeping the packet doc-only and template-aligned.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Discover feature catalog locations and record the result in `discovery-notes.md`.
- Update the system-spec-kit catalog with `memory_retention_sweep`, CLI matrix adapter runners, Codex freshness smoke check, and the 54-tool count.
- Update the skill_advisor catalog with `advisor_rebuild` and the diagnostic-only `advisor_status` contract.
- Update existing code-graph catalog material only where a catalog entry already exists inside system-spec-kit.

### Out of Scope
- Code changes.
- Creating a new standalone code_graph feature catalog when discovery did not find one.
- Updating unrelated README or install-guide surfaces.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/.../002-feature-catalog-trio/*.md` | Create | Level 2 packet docs and discovery notes |
| `specs/.../002-feature-catalog-trio/*.json` | Create | Packet metadata and graph metadata |
| `.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md` | Modify | Tool count and new root catalog summaries |
| `.opencode/skill/system-spec-kit/feature_catalog/02--mutation/12-memory-retention-sweep.md` | Create | Retention sweep feature entry |
| `.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/37-cli-matrix-adapter-runners.md` | Create | CLI matrix runner feature entry |
| `.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/38-codex-hook-freshness-smoke-check.md` | Create | Codex smoke-check feature entry |
| `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/24-code-graph-readiness-contract.md` | Modify | Read-path/manual freshness contract note |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/feature_catalog/feature_catalog.md` | Modify | Advisor MCP surface count and entry list |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/feature_catalog/06--mcp-surface/02-advisor-status.md` | Modify | Diagnostic-only status contract |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/feature_catalog/06--mcp-surface/05-advisor-rebuild.md` | Create | Advisor rebuild feature entry |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Preserve doc-only scope | Git diff contains no code changes |
| REQ-002 | Cite source file lines for new entries | New entries include source file:line references for packet 033/034/036 surfaces |
| REQ-003 | Run strict packet validation | `validate.sh <packet> --strict` exits 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Record discovery | `discovery-notes.md` lists catalog paths and the code_graph catalog gap |
| REQ-005 | Refresh system-spec-kit catalog | Root count is 54 and new packet 031-036 surfaces have entries |
| REQ-006 | Refresh skill_advisor catalog | `advisor_rebuild` exists and `advisor_status` is diagnostic-only |
| REQ-007 | Address code_graph catalog request without fabrication | Existing code-graph catalog material is updated; missing standalone catalog is documented |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: System-spec-kit catalog documents the new packet 033/034/036 surfaces.
- **SC-002**: Skill Advisor catalog documents `advisor_rebuild` and the updated `advisor_status` contract.
- **SC-003**: Code graph discovery gap is explicit and no standalone catalog is fabricated.
- **SC-004**: Strict spec validator exits 0.

### Acceptance Scenarios

- **SCN-001**: **Given** the system-spec-kit feature catalog is opened, when a reader checks the command-surface contract, then the MCP tool count is 54 and `memory_retention_sweep` appears in the manage surface.
- **SCN-002**: **Given** the skill_advisor feature catalog is opened, when a reader checks the MCP surface group, then `advisor_rebuild` has a dedicated entry and `advisor_status` is documented as diagnostic-only.
- **SCN-003**: **Given** packet 036 matrix runners are present, when a reader opens the system-spec-kit tooling entries, then the CLI adapter runner entry cites the real adapter files.
- **SCN-004**: **Given** no standalone code_graph feature catalog exists, when a reader opens `discovery-notes.md`, then the gap is documented and no new standalone catalog is fabricated.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Packet 036 matrix runners | Catalog entry needs real adapter files | Discovery found `mcp_server/matrix_runners/`, so entry uses real refs |
| Risk | Missing standalone code_graph catalog | Could tempt invented docs | Document the gap and update only existing system-spec-kit code-graph entry |
| Risk | Catalog count drift | Tool count may be wrong if dist/source differ | Verified `TOOL_DEFINITIONS.length` from dist as 54 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Documentation-only changes add no runtime cost.

### Security
- **NFR-S01**: Catalog entries must not expose secrets or local private paths beyond repo-relative source references.

### Reliability
- **NFR-R01**: Source references must point to existing files and line ranges.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Missing catalog: document the gap and skip standalone creation.
- Packet not merged: defer entry rather than fabricating references.
- Existing catalog shape differs from template: preserve local shape and add surgical entries.

### Error Scenarios
- Validator failure: repair docs and rerun strict validation.
- Source line drift: reread source and patch references before completion.

### State Transitions
- In-progress to complete: after sk-doc checks and strict validator pass.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Multiple docs, no runtime code |
| Risk | 8/25 | Traceability and count accuracy matter |
| Research | 10/20 | Requires catalog discovery and source line evidence |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

None.
<!-- /ANCHOR:questions -->
