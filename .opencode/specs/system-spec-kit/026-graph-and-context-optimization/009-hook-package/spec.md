---
title: "Feature Specification: Hook Package [system-spec-kit/026-graph-and-context-optimization/009-hook-package/spec]"
description: "Hook-package parent for skill-advisor hook surface, skill-graph daemon, cross-runtime hook parity (Claude/Codex/Copilot), plugin-loader hardening, writer wiring, and code-graph hook improvements. Aggregates 14 direct child phase packets."
trigger_phrases:
  - "009-hook-package"
  - "hook-package"
  - "hook daemon parity"
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
  - "012-docs-impact-remediation"
  - "013-code-graph-hook-improvements"
  - "014-skill-advisor-hook-improvements"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-package"
    last_updated_at: "2026-04-24T17:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Packet renamed to 009-hook-package (prior slug: hook+daemon+parity); 388 path refs + 7 slug/title residues rewritten; frontmatter resynced to 14 direct children"
    next_safe_action: "Run validate.sh --strict on the packet, then refresh DB via generate-context.js to re-index under the new slug"
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
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
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
- Keep the active thematic parent at `009-hook-package/`.
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
| `009-hook-package/00N-*/` | Move | Original phase packet roots now live directly under this parent. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Status | Description |
|-------|--------|--------|-------------|
| 1 | `001-skill-advisor-hook-surface/` | In Progress | Skill-Advisor Hook Surface implementation is shipped, but the child checklist and closeout surfaces are still scaffolded and need reconciliation before this row can claim complete. |
| 2 | `002-skill-graph-daemon-and-advisor-unification/` | In Progress | Feature Specification: Phase 027 — Skill-Graph Auto-Update Daemon + Advisor Unification |
| 3 | `003-hook-parity-remediation/` | Complete | Feature Specification: 029 — Runtime Hook Parity Remediation |
| 4 | `004-copilot-hook-parity-remediation/` | Complete | Feature Specification: Copilot CLI Hook Parity Remediation |
| 5 | `005-codex-hook-parity-remediation/` | Complete | Feature Specification: Codex CLI Hook Parity Remediation |
| 6 | `006-claude-hook-findings-remediation/` | In Progress | Feature Specification: Claude Hook Findings Remediation |
| 7 | `007-opencode-plugin-loader-remediation/` | Complete | Feature Specification: OpenCode Plugin Loader Remediation |
| 8 | `008-skill-advisor-plugin-hardening/` | Complete | Feature Specification: Skill-Advisor Plugin Hardening |
| 9 | `009-skill-advisor-standards-alignment/` | Complete | Feature Specification: Skill-Advisor Standards Alignment |
| 10 | `010-copilot-wrapper-schema-fix/` | Reverted - Reapply Required | Copilot Wrapper Schema Fix landed historically, then reverted; the top-level wrapper fields must be reapplied. |
| 11 | `011-copilot-writer-wiring/` | Reverted - Reapply Required | Copilot Writer Wiring landed historically, then reverted; reapply after packet 010 restores the wrapper shape. |
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
