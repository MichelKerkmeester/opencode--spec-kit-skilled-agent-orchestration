---
title: "Task 03 — Command Configs Audit [task-03-command-alignment/spec]"
description: "Audit all command configuration files in .opencode/command/ to ensure agent routing patterns (spec 014), memory command capabilities (specs 126–128), and spec_kit command refere..."
trigger_phrases:
  - "task"
  - "command"
  - "configs"
  - "audit"
  - "spec"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 3+ -->
# Task 03 — Command Configs Audit

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3plus-govern | v2.2 -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Parent Spec** | 130 — Memory Overhaul & Agent Upgrade Release |
| **Task** | 03 of 07 |
| **Level** | 3+ |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-02-16 |
| **Depends On** | None (parallel with Tasks 01, 02, 04) |
| **Blocks** | Task 05 (Changelog Updates) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:purpose -->
## Purpose

Audit all command configuration files in `.opencode/command/` to ensure agent routing patterns (spec 014), memory command capabilities (specs 126–128), and spec_kit command references (specs 124, 128, 129) are current and consistent.
<!-- /ANCHOR:purpose -->

---

<!-- ANCHOR:scope -->
## Scope

### Create Commands (P0 — Agent Routing)

| File | Key Audit Points |
|------|-----------------|
| `.opencode/command/create/plan.md` | @speckit agent routing (spec 014) |
| `.opencode/command/create/implement.md` | @speckit agent routing (spec 014) |
| `.opencode/command/create/research.md` | @research agent routing (spec 014) |
| `.opencode/command/create/complete.md` | @speckit agent routing (spec 014) |
| `.opencode/command/create/debug.md` | @debug agent routing (spec 014) |
| `.opencode/command/create/resume.md` | @context agent routing (spec 014) |

### Create Command Assets (P1 — YAML Workflows)

| File | Key Audit Points |
|------|-----------------|
| `.opencode/command/create/assets/*.yaml` (12 files) | Agent routing in YAML workflows matches .md routing |

### Spec Kit Commands (P0 — Complete Workflow)

| File | Key Audit Points |
|------|-----------------|
| `.opencode/command/spec_kit/complete.md` | References check-placeholders.sh (spec 128), check-anchors.sh (spec 129), upgrade-level.sh (spec 124) |
| `.opencode/command/spec_kit/debug.md` | @debug agent routing (spec 014) |
| `.opencode/command/spec_kit/research.md` | @research agent routing (spec 014) |
| `.opencode/command/spec_kit/implement.md` | @speckit agent routing |
| `.opencode/command/spec_kit/plan.md` | @speckit agent routing |
| `.opencode/command/spec_kit/resume.md` | @context agent routing |
| `.opencode/command/spec_kit/handover.md` | @handover agent routing (spec 016: Haiku) |

### Spec Kit Command Assets (P1 — YAML Workflows)

| File | Key Audit Points |
|------|-----------------|
| `.opencode/command/spec_kit/assets/*.yaml` (10 files) | YAML workflows reference current scripts and tools |

### Memory Commands (P1)

| File | Key Audit Points |
|------|-----------------|
| `.opencode/command/memory/context.md` | 5-source pipeline, 7 intents, spec doc indexing |
| `.opencode/command/memory/learn.md` | Updated capabilities |
| `.opencode/command/memory/manage.md` | Updated capabilities |
| `.opencode/command/memory/save.md` | 5-source pipeline, spec doc indexing |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:audit-criteria -->
## Audit Criteria

### Agent Routing Patterns (spec 014)

1. **Create commands**: Each command should route to the correct agent (@speckit, @research, @debug, @context, @review, @handover)
2. **Spec kit commands**: Same routing verification, plus @debug and @research delegations
3. **YAML assets**: Agent references in YAML workflows match the .md command routing
4. **Handover command**: Should reference Haiku model (spec 016)

### Script References (specs 124, 128, 129)

1. **complete.md**: Should reference upgrade-level.sh in scope-growth guidance, check-placeholders.sh in verification step, check-anchors.sh if spec 129 implemented
2. **YAML workflows**: Script paths should be current

### Memory Command Updates (specs 126–128)

1. **context.md**: Should describe 5-source discovery pipeline, 7 intent types, spec doc indexing capability
2. **save.md**: Should describe 5-source pipeline, spec folder document inclusion
3. **learn.md / manage.md**: Should reference current capabilities
<!-- /ANCHOR:audit-criteria -->

---

<!-- ANCHOR:output -->
## Expected Output

The implementer should populate `changes.md` with:
- One section per file requiring changes
- Each section listing the specific content to update
- Before/after text for each change
- Priority (P0/P1/P2) for each change
<!-- /ANCHOR:output -->

---

<!-- ANCHOR:acceptance -->
## Acceptance Criteria

1. All 6 create command .md files audited for agent routing
2. All 12 create command YAML assets audited
3. All 7 spec_kit command .md files audited
4. All 10 spec_kit YAML assets audited
5. All 4 memory command .md files audited
6. changes.md has no placeholder text
<!-- /ANCHOR:acceptance -->

---

<!-- ANCHOR:approval-workflow -->
## Approval Workflow

| Checkpoint | Approver | Status | Date |
|------------|----------|--------|------|
| Audit Plan Review | Spec Owner | Approved | 2026-02-16 |
| Changes Review | Tech Lead | Pending | TBD |
| Implementation Complete | Spec Owner | Pending | TBD |
<!-- /ANCHOR:approval-workflow -->

---

<!-- ANCHOR:compliance -->
## Compliance Checkpoints

### Documentation Standards
- [ ] All command .md files follow standard format with agent routing
- [ ] YAML assets reference correct script paths
- [ ] Cross-references to agents and scripts resolve

### Quality Gates
- [ ] No placeholder text in changes.md
- [ ] Agent routing consistent across .md and YAML files
- [ ] Script references match current file locations
<!-- /ANCHOR:compliance -->

---

<!-- ANCHOR:stakeholders -->
## Stakeholder Matrix

| Stakeholder | Role | Interest | Communication |
|-------------|------|----------|---------------|
| Spec Owner | Documentation Lead | High | Direct updates via changes.md |
| Tech Lead | System Architect | Medium | Review approval for changes |
| End Users | AI Assistants | High | Updated commands via command loading |
<!-- /ANCHOR:stakeholders -->

---

<!-- ANCHOR:changelog -->
## Change Log

### v1.0 (2026-02-16)
**Initial task specification** — Defined audit scope for command configs across create, spec_kit, and memory namespaces.
<!-- /ANCHOR:changelog -->

---

## Related Documents

- **Parent**: [../spec.md](../spec.md)
- **Checklist**: [checklist.md](checklist.md)
- **Changes**: [changes.md](changes.md)
