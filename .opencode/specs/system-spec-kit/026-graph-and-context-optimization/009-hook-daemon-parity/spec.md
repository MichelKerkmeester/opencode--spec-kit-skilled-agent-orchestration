---
title: "Feature Specification: Hook Daemon Parity"
description: "Skill graph daemon, hook parity, plugin/runtime parity, and parity remediation. Consolidated active parent for 11 direct child phase packet(s)."
trigger_phrases:
  - "009-hook-daemon-parity"
  - "skill graph daemon, hook parity, plugin/runtime parity, and parity remediation"
  - "001-skill-advisor-hook-surface"
  - "002-skill-graph-daemon-and-advisor-unification"
  - "003-hook-parity-remediation"
  - "004-copilot-hook-parity-remediation"
  - "005-codex-hook-parity-remediation"
  - "006-claude-hook-findings-remediation"
  - "007-opencode-plugin-loader-remediation"
  - "008-skill-advisor-plugin-hardening"
  - "009-skill-advisor-standards-alignment"
  - "010-copilot-wrapper-schema-fix"
  - "011-copilot-writer-wiring"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity"
    last_updated_at: "2026-04-23T15:20:00Z"
    last_updated_by: "codex-gpt-5.4"
    recent_action: "009 packet truth-sync applied; 010 and 011 marked reverted-needs-reapply"
    next_safe_action: "Use context-index.md for local phase navigation, then reapply 010 and 011"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:83f15b899b5b7e4f77153974de794dc993531751d72a0c89ad7975af93e8a2be"
      session_id: "026-phase-root-flatten-2026-04-21"
      parent_session_id: null
    completion_pct: 85
    open_questions: []
    answered_questions: []
---
# Feature Specification: Hook Daemon Parity

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
| **Predecessor** | ../008-runtime-executor-hardening/spec.md |
| **Successor** | None |
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
- Keep the active thematic parent at `009-hook-daemon-parity/`.
- Place old phase packets directly under this root.
- Maintain `context-index.md` as the bridge from old phase identity to current child folder.
- Include the skill-advisor / plugin-loader infrastructure packets as direct children because they depend on the same OpenCode hook and daemon surfaces.

### Out of Scope
- Rewriting child-owned requirements or historical implementation narratives.
- Moving root `research/`, `review/`, or `scratch/` support folders.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `context-index.md` | Modify | Bridge index for the direct child phases in this theme. |
| `009-hook-daemon-parity/00N-*/` | Move | Original phase packet roots now live directly under this parent. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Status | Description |
|-------|--------|--------|-------------|
| 1 | `001-skill-advisor-hook-surface/` | Complete | Feature Specification: Skill-Advisor Hook Surface |
| 2 | `002-skill-graph-daemon-and-advisor-unification/` | In Progress | Feature Specification: Phase 027 — Skill-Graph Auto-Update Daemon + Advisor Unification |
| 3 | `003-hook-parity-remediation/` | Complete | Feature Specification: 029 — Runtime Hook Parity Remediation |
| 4 | `004-copilot-hook-parity-remediation/` | Complete | Feature Specification: Copilot CLI Hook Parity Remediation |
| 5 | `005-codex-hook-parity-remediation/` | Complete | Feature Specification: Codex CLI Hook Parity Remediation |
| 6 | `006-claude-hook-findings-remediation/` | In Progress | Feature Specification: Claude Hook Findings Remediation |
| 7 | `007-opencode-plugin-loader-remediation/` | Complete | Feature Specification: OpenCode Plugin Loader Remediation |
| 8 | `008-skill-advisor-plugin-hardening/` | Complete | Feature Specification: Skill-Advisor Plugin Hardening |
| 9 | `009-skill-advisor-standards-alignment/` | Complete | Feature Specification: Skill-Advisor Standards Alignment |
| 10 | `010-copilot-wrapper-schema-fix/` | Reverted - Reapply Required | Feature Specification: Copilot Wrapper Schema Fix |
| 11 | `011-copilot-writer-wiring/` | Reverted - Reapply Required | Feature Specification: Copilot Writer Wiring |
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
| Dependency | Root packet phase map | High | Root docs own the active eleven-phase map. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. This parent records the requested flattened layout.
<!-- /ANCHOR:questions -->
