---
title: "Feature Specification: Deep Review Remediation"
description: "Deep review waves and post-review remediation. Consolidated active parent for 5 direct child phase packet(s)."
trigger_phrases:
  - "007-deep-review-remediation"
  - "deep review waves and post-review remediation"
  - "001-deep-review-and-remediation"
  - "002-cli-executor-remediation"
  - "003-deep-review-remediation"
  - "004-r03-post-remediation"
  - "005-006-campaign-findings-remediation"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation"
    last_updated_at: "2026-04-21T13:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Renumbered nested phases"
    next_safe_action: "Use context-index.md for local phase navigation"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:3f6e386d4a9c736ee0f6480581ec93366e76eb160274e6ba6f617ad2f3c336af"
      session_id: "026-phase-root-flatten-2026-04-21"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Deep Review Remediation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-04-21 |
| **Branch** | `026-graph-and-context-optimization` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../006-search-routing-advisor/spec.md |
| **Successor** | ../008-runtime-executor-hardening/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The first consolidation preserved old packets behind an extra archive layer, which made the active phase surface harder to browse.

### Purpose
Keep this theme as an active parent while making each original phase packet a direct child folder under the phase root.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Keep the active thematic parent at `007-deep-review-remediation/`.
- Place old phase packets directly under this root.
- Maintain `context-index.md` as the bridge from old phase identity to current child folder.

### Out of Scope
- Rewriting child-owned requirements or historical implementation narratives.
- Moving root `research/`, `review/`, or `scratch/` support folders.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `context-index.md` | Modify | Bridge index for the direct child phases in this theme. |
| `007-deep-review-remediation/00N-*/` | Move | Original phase packet roots now live directly under this parent. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Status | Description |
|-------|--------|--------|-------------|
| 1 | `001-deep-review-and-remediation/` | In Progress | Remediation Plan: 120-Iteration Deep Review Findings |
| 2 | `002-cli-executor-remediation/` | Spec Ready | Feature Specification: Phase 020 Research-Findings Remediation |
| 3 | `003-deep-review-remediation/` | Draft | Feature Specification: Phase 025 — Deep-Review Remediation |
| 4 | `004-r03-post-remediation/` | Draft | Feature Specification: Phase 026 — R03 Post-Remediation Remediation |
| 5 | `005-006-campaign-findings-remediation/` | Draft | Feature Specification: 005-006 Campaign Findings Remediation |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Preserve original child packet evidence. | Every mapped old phase exists as a direct child folder with root docs and metadata retained. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Expose a concise context bridge. | `context-index.md` lists child phase names, statuses, summaries, open/deferred items, and current paths. |
| REQ-003 | Keep root support folders discoverable. | Root `research/`, `review/`, and `scratch/` remain referenced as root-level support surfaces. |
<!-- /ANCHOR:requirements -->

---

### Acceptance Scenarios

**Given** this wrapper is opened, **when** a maintainer lists the folder, **then** the original original phases appear as direct child folders.

**Given** a maintainer needs an original phase packet, **when** they open `context-index.md`, **then** they can find the old status, summary, and current child path.

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The active parent validates independently.
- **SC-002**: Mapped source packets are direct child folders.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Direct child folders may contain older validation debt | Medium | Validate the active parent separately and preserve child docs unchanged unless requested. |
| Dependency | Root packet phase map | High | Root docs own the active nine-phase map. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. This parent records the requested flattened layout.
<!-- /ANCHOR:questions -->
