---
title: "Feature Specification: 039 code-graph-catalog-and-playbook"
description: "Adds a runtime-package feature catalog and manual testing playbook for code_graph, mirroring skill_advisor's package shape and cross-linking root docs."
trigger_phrases:
  - "026-code-graph-catalog-and-playbook"
  - "code_graph feature catalog"
  - "code_graph manual testing playbook"
  - "code_graph runtime catalog"
importance_tier: "important"
contextType: "general"
template_source_marker: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/026-code-graph-catalog-and-playbook"
    last_updated_at: "2026-04-29T20:35:30+02:00"
    last_updated_by: "cli-codex"
    recent_action: "Resource map indexed"
    next_safe_action: "Use packet for downstream work"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/code_graph/feature_catalog/"
      - ".opencode/skill/system-spec-kit/mcp_server/code_graph/manual_testing_playbook/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "026-code-graph-catalog-and-playbook"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Runtime package catalog/playbook are source-of-truth under mcp_server/code_graph."
---
# Feature Specification: 039 code-graph-catalog-and-playbook

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
| **Branch** | `main` |
| **Parent** | `026-graph-and-context-optimization` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The code_graph runtime package had README coverage and root skill catalog/playbook entries, but it lacked package-local `feature_catalog/` and `manual_testing_playbook/` directories at the source-of-truth runtime path. That left runtime details scattered and made code_graph weaker than the already documented skill_advisor package.

### Purpose
Add a package-local feature catalog and manual testing playbook for code_graph, with classifications copied from the packet 013/035 reality map and cross-links from runtime and root docs.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create `.opencode/skill/system-spec-kit/mcp_server/code_graph/feature_catalog/`.
- Create `.opencode/skill/system-spec-kit/mcp_server/code_graph/manual_testing_playbook/`.
- Cross-link runtime README, parent MCP README, root feature catalog category, and root manual playbook category.
- Create this Level 2 packet with strict validation passing.

### Out of Scope
- Runtime TypeScript changes.
- Test runner or MCP handler changes.
- Commits or PR creation.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/feature_catalog/` | Create | Runtime feature catalog package |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/manual_testing_playbook/` | Create | Runtime manual playbook package |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/README.md` | Modify | Link runtime catalog/playbook |
| `.opencode/skill/system-spec-kit/mcp_server/README.md` | Modify | Mention code_graph runtime docs |
| `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/01-category-overview.md` | Modify | Link runtime catalog |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/254-code-graph-scan-query.md` | Modify | Link runtime playbook |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Runtime feature catalog exists. | Root index plus 8 numbered groups and 17 per-feature files exist. |
| REQ-002 | Runtime manual playbook exists. | Root index plus 8 numbered groups and 15 scenario files exist. |
| REQ-003 | Reality classifications are precise. | Entries cite packet 013/035 classifications: half/manual/auto as applicable. |
| REQ-004 | Cross-links are added. | Runtime README, MCP README, root catalog, and root playbook point to package docs. |
| REQ-005 | Validation passes. | Strict spec validator exits 0. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `.opencode/skill/system-spec-kit/mcp_server/code_graph/feature_catalog/feature_catalog.md` links every per-feature catalog entry.
- **SC-002**: `.opencode/skill/system-spec-kit/mcp_server/code_graph/manual_testing_playbook/manual_testing_playbook.md` links every scenario.
- **SC-003**: Strict validator exits 0.

### Acceptance Scenarios

1. **Given** the runtime catalog root is opened, **when** a reader follows the group links, **then** all 17 per-feature files are reachable.
2. **Given** a per-feature catalog entry is opened, **when** its Surface section is inspected, **then** it cites file:line evidence for the runtime surface.
3. **Given** the runtime playbook root is opened, **when** a reader follows the group links, **then** all 15 manual test scenarios are reachable.
4. **Given** the package/root documentation is opened, **when** related-doc links are inspected, **then** the runtime catalog and playbook are discoverable.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 013 reality map | Misclassification risk | Copied classifications from 013 rows and 035 caveats. |
| Risk | Fabricating unsupported groups | Stale or misleading docs | Omit zero-entry groups and cite actual line anchors. |
| Risk | Doc-only scope drift | Runtime code changes | No TypeScript edits. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None.
<!-- /ANCHOR:questions -->

---

## L2: NON-FUNCTIONAL REQUIREMENTS

- **NFR-D01**: Docs use sk-doc catalog/playbook split-document conventions.
- **NFR-D02**: Per-feature files cite file:line source evidence.
- **NFR-D03**: Packet remains doc-only.

---

## L2: EDGE CASES

- If CocoIndex is unavailable, CCC playbook scenarios accept unavailable status as valid diagnostic evidence.
- If graph readiness is stale, verify and detect_changes scenarios must block instead of inventing green results.
- If deep-loop graphEvents are absent, upsert skip is expected behavior.

---

## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Many docs, no runtime code |
| Risk | 8/25 | Documentation accuracy risk |
| Research | 16/20 | Handler and packet evidence required |
| **Total** | **42/70** | **Level 2** |
