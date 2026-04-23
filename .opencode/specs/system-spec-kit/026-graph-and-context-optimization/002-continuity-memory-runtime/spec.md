---
title: "Feature Specification: Continuity Memory Runtime"
description: "Cache hooks, memory quality, continuity refactor, and memory-save rewrite. Consolidated active parent for 4 direct child phase packet(s)."
trigger_phrases:
  - "002-continuity-memory-runtime"
  - "cache hooks, memory quality, continuity refactor, and memory-save rewrite"
  - "001-cache-warning-hooks"
  - "002-memory-quality-remediation"
  - "003-continuity-refactor-gates"
  - "004-memory-save-rewrite"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime"
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
      fingerprint: "sha256:20e8bf1a71b2f73f0fa93cb90e57ddf012b150e1e35522d7e715d7b62caa2567"
      session_id: "026-phase-root-flatten-2026-04-21"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Continuity Memory Runtime

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
| **Predecessor** | ../001-research-and-baseline/spec.md |
| **Successor** | ../003-code-graph-package/spec.md |
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
- Keep the active thematic parent at `002-continuity-memory-runtime/`.
- Place old phase packets directly under this root.
- Maintain `context-index.md` as the bridge from old phase identity to current child folder.

### Out of Scope
- Rewriting child-owned requirements or historical implementation narratives.
- Moving root `research/`, `review/`, or `scratch/` support folders.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `context-index.md` | Modify | Bridge index for the direct child phases in this theme. |
| `002-continuity-memory-runtime/00N-*/` | Move | Original phase packet roots now live directly under this parent. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Status | Description |
|-------|--------|--------|-------------|
| 1 | `001-cache-warning-hooks/` | Implemented — predecessor verified | Feature Specification: Cache-Warning Hook System |
| 2 | `002-memory-quality-remediation/` | Complete | Feature Specification: Memory Quality Backend Improvements |
| 3 | `003-continuity-refactor-gates/` | Complete | Feature Specification: Phase 6 — Continuity Refactor Gates |
| 4 | `004-memory-save-rewrite/` | Complete | Feature Specification: /memory:save Planner-First Default |
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

- None for the flattened layout itself.
- Deep-research active: 026 continuity-memory-runtime — correctness gaps, concurrency/race conditions, and doc-code drift across the parent and its four direct children.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:research-context -->
## 8. RESEARCH CONTEXT

Deep-research is active for this packet (session `dr-002cmr-20260423-200456`). Canonical findings live in `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/002-continuity-memory-runtime-pt-01/research.md`; this spec will carry only a bounded post-synthesis generated findings fence.
<!-- /ANCHOR:research-context -->
