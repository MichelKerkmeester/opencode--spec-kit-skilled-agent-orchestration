---
title: "Feature Specification: Skill Advisor [system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/spec]"
description: "Skill advisor system: search/routing tuning, skill graph + advisor unification, advisor docs and standards, smart-router, hook surface, plugin hardening, hook improvements, and the /doctor:skill-advisor setup command. Consolidated active parent for 12 direct child phase packet(s)."
trigger_phrases:
  - "008-skill-advisor"
  - "skill advisor"
  - "skill advisor system"
  - "skill advisor hook"
  - "search/routing tuning, skill graph and advisor unification, advisor docs and standards, smart-router, hook surface, plugin hardening, and hook improvements"
  - "001-search-and-routing-tuning"
  - "002-skill-advisor-graph"
  - "003-advisor-phrase-booster-tailoring"
  - "004-skill-advisor-docs-and-code-alignment"
  - "005-smart-router-remediation-and-opencode-plugin"
  - "006-deferred-remediation-and-telemetry-run"
  - "007-skill-advisor-hook-surface"
  - "008-skill-graph-daemon-and-advisor-unification"
  - "009-skill-advisor-plugin-hardening"
  - "010-skill-advisor-standards-alignment"
  - "011-skill-advisor-hook-improvements"
  - "012-skill-advisor-setup-command"
  - "/doctor:skill-advisor"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-skill-advisor"
    migration_aliases:
      - "system-spec-kit/026-graph-and-context-optimization/008-skill-advisor"
    last_updated_at: "2026-04-25T11:50:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "2026-04-25 second consolidation: merged 008-skill-advisor root + 5 advisor children from 009-hook-parity into 008-skill-advisor"
    next_safe_action: "Use context-index.md for local phase navigation"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:8350b5dfe24e762cf2362790200b12b377034fd828359f13991f01cae70b7fd7"
      session_id: "026-phase-root-flatten-2026-04-21"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
---
# Feature Specification: Skill Advisor

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
| **Predecessor** | ../000-release-cleanup-playbooks/spec.md |
| **Successor** | ../007-deep-review-remediation/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Skill advisor work was scattered across two phase wrappers (`008-skill-advisor/` for search/routing/graph/smart-router, and parts of `009-hook-parity/` for hook surface, daemon unification, plugin hardening, standards alignment, and hook improvements). The split made it hard to see the advisor system as one coherent surface and forced cross-wrapper navigation when reasoning about advisor changes.

### Purpose
Keep this theme as the single active parent for the full skill advisor system. Every original phase packet — whether it came from the search/routing thread or the hook/plugin/standards thread — is a direct child folder under this phase root, so the advisor surface is browsable in one place.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Keep the active thematic parent at `008-skill-advisor/`.
- Place old phase packets directly under this root.
- Maintain `context-index.md` as the bridge from old phase identity to current child folder.

### Out of Scope
- Rewriting child-owned requirements or historical implementation narratives.
- Moving root `research/`, `review/`, or `scratch/` support folders.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `context-index.md` | Modify | Bridge index for the direct child phases in this theme. |
| `008-skill-advisor/00N-*/` | Move | Original phase packet roots now live directly under this parent. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Status | Description |
|-------|--------|--------|-------------|
| 1 | `001-search-and-routing-tuning/` | Complete | Feature Specification: Search and Routing Tuning Coordination Parent |
| 2 | `002-skill-advisor-graph/` | Implemented | Feature Specification: Skill Advisor Graph |
| 3 | `003-advisor-phrase-booster-tailoring/` | Draft | Feature Specification: Advisor Phrase-Booster Tailoring |
| 4 | `004-skill-advisor-docs-and-code-alignment/` | Spec Ready | Feature Specification: Skill-Advisor Docs + Phase 020 Code Alignment |
| 5 | `005-smart-router-remediation-and-opencode-plugin/` | Spec Ready | Feature Specification: Smart-Router Remediation + OpenCode Plugin |
| 6 | `006-deferred-remediation-and-telemetry-run/` | Spec Ready | Feature Specification: Deferred Remediation + Telemetry Measurement Run |
| 7 | `007-skill-advisor-hook-surface/` | In Progress | Feature Specification: Skill-Advisor Hook Surface |
| 8 | `008-skill-graph-daemon-and-advisor-unification/` | In Progress | Feature Specification: 027 - Skill Graph Daemon and Advisor Unification |
| 9 | `009-skill-advisor-plugin-hardening/` | Complete | Feature Specification: Skill-Advisor Plugin Hardening |
| 10 | `010-skill-advisor-standards-alignment/` | Complete | Feature Specification: Skill-Advisor Standards Alignment |
| 11 | `011-skill-advisor-hook-improvements/` | Research Queued | Feature Specification: Skill-Advisor Hook Improvements |
| 12 | `012-skill-advisor-setup-command/` | Implemented | Feature Specification: Skill Advisor Setup Command |
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
