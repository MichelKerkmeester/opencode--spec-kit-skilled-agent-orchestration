---
title: "Implementation Plan: 039 code-graph-catalog-and-playbook"
description: "Doc-only plan for code_graph runtime feature catalog and manual testing playbook creation."
trigger_phrases:
  - "026-code-graph-catalog-and-playbook"
  - "code_graph feature catalog"
  - "code_graph manual testing playbook"
  - "code_graph runtime catalog"
importance_tier: "important"
contextType: "general"
template_source_marker: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/026-code-graph-catalog-and-playbook"
    last_updated_at: "2026-04-29T19:26:00+02:00"
    last_updated_by: "cli-codex"
    recent_action: "Runtime docs created"
    next_safe_action: "Run strict validator"
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
# Implementation Plan: 039 code-graph-catalog-and-playbook

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation |
| **Framework** | sk-doc feature catalog + manual playbook |
| **Storage** | Repository markdown and metadata JSON |
| **Testing** | Link checks by inspection + strict spec validator |

### Overview
Create package-local code_graph catalog/playbook docs by following the existing skill_advisor pattern. The implementation is source-cited and doc-only, with cross-links from runtime and root documentation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Target spec folder established.
- [x] Reference skill_advisor pattern read.
- [x] code_graph handlers, libs, tools, and reality packets read.

### Definition of Done
- [x] Runtime catalog created.
- [x] Runtime playbook created.
- [x] Cross-links updated.
- [x] Strict validator passes.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Split-document documentation package.

### Key Components
- **Runtime catalog**: current feature inventory and source anchors.
- **Runtime playbook**: deterministic manual validation scenarios.
- **Packet docs**: Level 2 traceability and verification.

### Data Flow
Source files and packet reality maps feed catalog entries; catalog entries feed playbook scenarios; root docs link to runtime details.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Discovery
- [x] Read skill_advisor pattern docs and sk-doc templates.
- [x] Read code_graph README, handlers, libs, tools.
- [x] Read packet 013 and 035 classifications.

### Phase 2: Runtime Docs
- [x] Create feature_catalog package.
- [x] Create manual_testing_playbook package.

### Phase 3: Cross-Links And Packet Docs
- [x] Link runtime/root docs.
- [x] Create Level 2 packet docs.
- [x] Run strict validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structure | Packet docs | `validate.sh --strict` |
| Manual | Links and source anchors | Direct file reads |
| Regression | None | Doc-only packet |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Packet 013 reality map | Internal docs | Green | Classification source |
| Packet 035 validation | Internal docs | Green | Conditional validation context |
| sk-doc templates | Internal skill | Green | Shape reference |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Strict validation fails or docs misclassify runtime behavior.
- **Procedure**: Revert this packet's doc additions and cross-link edits, then re-run strict validation.
<!-- /ANCHOR:rollback -->

---

## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Discovery | None | Runtime Docs |
| Runtime Docs | Discovery | Cross-Links |
| Cross-Links | Runtime Docs | Verification |

---

## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Discovery | Medium | 1 hour |
| Runtime Docs | Medium | 2-3 hours |
| Verification | Low | 30 minutes |
| **Total** | | **3-5 hours** |

---

## L2: ENHANCED ROLLBACK

No data migrations or runtime rollout. Restore changed markdown/JSON files and validate.
