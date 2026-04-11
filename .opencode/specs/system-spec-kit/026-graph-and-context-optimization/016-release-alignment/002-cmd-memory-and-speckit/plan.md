---
title: "Implementation Plan: Release Alignment for Spec Kit and Memory Commands [template:level_3/plan.md]"
description: "Define the command-document alignment workflow for a later release pass while hardening this child packet into a Level 3, validation-ready planning artifact."
trigger_phrases:
  - "command release alignment"
  - "spec_kit planning"
  - "memory planning"
  - "level 3 packet"
  - "reference map workflow"
importance_tier: "important"
contextType: "documentation"
---
# Implementation Plan: Release Alignment for Spec Kit and Memory Commands

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown docs, README-style indexes, wrapper metadata, and operator guidance |
| **Framework** | Level 3 system-spec-kit planning packet |
| **Storage** | Child packet docs plus later command surfaces named in `reference-map.md` |
| **Testing** | `validate.sh --strict`, `git diff --check`, path review |

### Overview
This plan keeps the current request bounded to packet hardening while preserving the real goal of the child phase: a later documentation-only alignment pass across `spec_kit` and `memory` command surfaces. The later pass should move from authoritative command docs into repo guidance, agent routing docs, and wrapper mirrors in that order.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] `reference-map.md` exists and is treated as the baseline evidence source
- [x] The packet is scoped to planning and validation work inside this child folder
- [x] Runtime implementation remains out of scope

### Definition of Done
- [x] This child folder is fully documented at Level 3
- [x] Strict validation passes for the child folder
- [x] The later command-alignment pass can start from an authoritative-first review order
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Evidence-driven command-document planning packet

### Key Components
- **`reference-map.md`**: Curated command-surface evidence across authoritative docs, guidance, agents, and wrappers.
- **Level 3 packet docs**: The planning, verification, and decision artifacts for this child folder.
- **Later review targets**: `.opencode/command/`, root repo guidance, `.opencode/agent/`, and `.agents/commands/`.

### Data Flow
The command map establishes the authoritative review categories and order. The Level 3 packet turns those categories into a later execution plan, then adds packet-local risk framing, validation criteria, and rollback guidance.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Packet Hardening
- [x] Upgrade the child packet to Level 3
- [x] Add checklist, decision record, and implementation summary
- [x] Normalize packet-local broken references

### Phase 2: Command Review (Completed 2026-04-10)
- [x] Review authoritative memory command docs first
- [x] Review authoritative `spec_kit` command docs next
- [x] Review repo guidance, agent surfaces, and wrappers after the authoritative docs align

### Phase 3: Verification (Completed 2026-04-10)
- [x] Re-run strict validation after packet edits
- [x] Preserve the command map as the evidence artifact
- [x] Confirm the later command pass stays documentation-only
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Child packet integrity and template compliance | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <phase-folder> --strict` |
| Hygiene | Diff and whitespace checks inside the child folder | `git diff --check -- <phase-folder>` |
| Manual | Review the command ordering and boundaries against `reference-map.md` | Direct file review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `reference-map.md` | Internal evidence | Green | Later command review loses its baseline |
| Live command and wrapper paths | Internal repo surface | Green | Later execution would need rediscovery if these move |
| Strict validator | Internal tooling | Green | Packet-local integrity regressions may go unnoticed |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The packet starts to include live command edits or the command map meaning changes during validation cleanup.
- **Procedure**: Revert the Level 3 packet hardening changes in this child folder only, restore the earlier command map wording, and regenerate from the Level 3 templates.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Packet Hardening -> Command Review Planning -> Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Packet Hardening | Existing Level 1 packet and command map | Review Planning, Verification |
| Command Review Planning | Packet Hardening | Verification |
| Verification | Packet Hardening, Review Planning | Later execution handoff |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Packet Hardening | Medium | 1-2 hours |
| Command Review Planning | Medium | 1-2 hours |
| Verification | Low | <1 hour |
| **Total** | | **2-5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Packet scope remains local to this child folder
- [x] Command map content preserved
- [x] Strict validation rerun after final edits

### Rollback Procedure
1. Revert the packet-local doc changes inside this child folder.
2. Restore the pre-upgrade command map wording if validation cleanup overreached.
3. Re-run strict validation to confirm the rollback state.
4. Reapply the Level 3 upgrade from the templates if still needed.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
reference-map.md
      |
      v
Level 3 packet docs
      |
      v
Authoritative command doc review
      |
      v
Guidance, agents, and wrapper parity review
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| `reference-map.md` | Prior 026 command audit work | Review categories and order | All later planning and execution |
| `spec.md` | `reference-map.md` | Scope contract | Plan, tasks, checklist |
| `plan.md` | `spec.md`, `reference-map.md` | Authoritative-first workflow | Tasks and later handoff |
| `tasks.md` | `plan.md` | Command review sequence | Checklist and execution |
| `checklist.md` | `spec.md`, `plan.md` | Verification gates | Completion claims |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Convert packet docs to Level 3** - 45-60 min - CRITICAL
2. **Normalize the packet-local sibling reference** - 5-10 min - CRITICAL
3. **Run strict validation and review remaining output** - 10-20 min - CRITICAL

**Total Critical Path**: 60-90 minutes

**Parallel Opportunities**:
- Checklist and implementation summary authoring can run alongside tasks expansion.
- Decision-record writing can happen independently from packet-local link cleanup.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Level 3 packet scaffold complete | All required docs exist | Phase 1 |
| M2 | Command ordering preserved | Plan and tasks match the command map categories | Phase 2 |
| M3 | Validation-ready child packet | Strict validation passes or only external blockers remain | Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Keep command alignment authoritative-first

**Status**: Accepted

**Context**: This child packet covers authoritative command docs, repo guidance, agents, and wrappers. Without an explicit hierarchy, later updates could start at mirrors and create new drift.

**Decision**: Preserve the authoritative-first ordering from the command map and document it as the core execution path for the later pass.

**Consequences**:
- Later reviews start from the best source of truth.
- Wrapper and mirror work happens later, which may delay those edits but reduces churn.

**Alternatives Rejected**:
- Review all command surfaces in path order: rejected because it treats mirrors as peers to authoritative docs.
