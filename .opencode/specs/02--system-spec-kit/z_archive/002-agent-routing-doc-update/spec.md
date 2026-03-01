---
title: "Feature Specification: Agent Routing Documentation Update [119-agent-routing-doc-update/spec]"
description: "Spec 014 (Command Agent Utilization Audit) added formal agent routing to all spec_kit commands — @debug at failure >= 3, @research at confidence < 60%, dual-phase @review (Mode ..."
trigger_phrases:
  - "feature"
  - "specification"
  - "agent"
  - "routing"
  - "documentation"
  - "spec"
  - "119"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: Agent Routing Documentation Update

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
| **Created** | 2026-02-14 |
| **Parent** | 02--system-spec-kit |
| **Related** | `anobel.com.opencode/specs/05--agent-orchestration/z_archive/014-command-agent-utilization/` |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Spec 014 (Command Agent Utilization Audit) added formal agent routing to all spec_kit commands — @debug at failure >= 3, @research at confidence < 60%, dual-phase @review (Mode 2 + Mode 4), and @handover at session end. The SKILL.md and README.md for system-spec-kit were not updated to reflect these routing changes, leaving the authoritative skill documentation incomplete.

### Purpose

Update SKILL.md agent exclusivity section, README.md command mode suffixes, and create a changelog entry so that system-spec-kit documentation accurately reflects the current agent routing architecture.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Update SKILL.md Agent Exclusivity section to include @debug and @review
- Add Agent Dispatch subsection documenting which agents are dispatched during spec_kit commands
- Update README.md Mode Suffixes table to include `:with-research` and `:auto-debug`
- Create changelog entry v2.2.9.0

### Out of Scope

- Template files (debug-delegation.md, handover.md, etc.) — fill-in forms, not routing docs
- Reference files (quick_reference.md, phase_checklists.md) — already accurate
- Asset files (parallel_dispatch_config.md, complexity_decision_matrix.md) — unaffected
- YAML command files — already updated in spec 014

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/SKILL.md` | Modify | Agent Exclusivity exceptions + Agent Dispatch subsection |
| `.opencode/skill/system-spec-kit/README.md` | Modify | Mode Suffixes table + Recent Changes section |
| `.opencode/changelog/01--system-spec-kit/v2.2.9.0.md` | Create | Changelog entry |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | SKILL.md lists all agents dispatched in spec_kit commands | @debug, @review, @research, @handover all documented with their trigger conditions |
| REQ-002 | SKILL.md Agent Exclusivity exceptions include debug-delegation.md | `debug-delegation.md` listed with `@debug agent only` |
| REQ-003 | README.md documents `:with-research` and `:auto-debug` flags | Mode Suffixes table includes both flags with behavior descriptions |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Changelog v2.2.9.0 created | File exists at `.opencode/changelog/01--system-spec-kit/v2.2.9.0.md` |
| REQ-005 | README.md Recent Changes section updated | Section 10 references spec 014 agent routing work |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: SKILL.md contains complete agent dispatch documentation matching actual command YAML routing
- **SC-002**: README.md Mode Suffixes table includes `:with-research` and `:auto-debug`
- **SC-003**: Changelog entry created documenting the documentation update

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Spec 014 implementation complete | Changes reference spec 014 routing | Verified complete — 33 files modified |
| Risk | SKILL.md edits misrepresent routing | Low | Cross-reference against actual YAML files |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Consistency

- **NFR-C01**: Agent naming consistent across SKILL.md, README.md, and command files (@debug not "debug agent")
- **NFR-C02**: Trigger conditions match actual YAML thresholds (failure >= 3, confidence < 60%)

<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Documentation Scope

- @review has dual-phase behavior (Mode 2 advisory + Mode 4 blocking) — document both clearly
- `:with-research` and `:auto-debug` are `/spec_kit:complete`-specific flags, not universal mode suffixes

<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | 3 files, documentation-only changes |
| Risk | 3/25 | No code, no breaking changes |
| Research | 5/20 | Context agents already identified gaps |
| **Total** | **16/70** | **Level 2 (minimal)** |

<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None — gaps identified by context agents, changes scoped.

<!-- /ANCHOR:questions -->

---
