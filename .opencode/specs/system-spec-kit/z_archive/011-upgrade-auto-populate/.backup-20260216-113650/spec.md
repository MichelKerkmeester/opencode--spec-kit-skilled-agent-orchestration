---
title: "Feature Specification: AI [system-spec-kit/z_archive/011-upgrade-auto-populate/.backup-20260216-113650/spec]"
description: "When upgrade-level.sh upgrades a spec folder (e.g., L1 → L3+), it injects template scaffolding with placeholder text like [Response time target], [Low/Med/High], [Component A]. ..."
trigger_phrases:
  - "feature"
  - "specification"
  - "auto"
  - "populate"
  - "spec"
  - "backup"
  - "20260216"
importance_tier: "important"
contextType: "planning"
---
<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: AI Auto-Populate on Spec Upgrade

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- ANCHOR:spec-overview -->

## EXECUTIVE SUMMARY

When `upgrade-level.sh` upgrades a spec folder (e.g., L1 → L3+), it injects template scaffolding with placeholder text like `[Response time target]`, `[Low/Med/High]`, `[Component A]`. These placeholders provide no value until manually filled in. The AI agent performing the upgrade should automatically populate these scaffolds with context-aware content derived from the existing spec folder documents.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec Number** | 128 |
| **Parent** | system-spec-kit |
| **Level** | 1 |
| **Priority** | P1 |
| **Triggered By** | Spec 127 upgrade revealed all injected sections were empty placeholders |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The `upgrade-level.sh` script injects template sections when upgrading spec levels, but all injected content is generic placeholder text. After upgrading spec 127 from L1 → L3+, the result was:

- `spec.md`: L2 NFR/Edge Cases/Complexity sections all `[placeholder]`
- `plan.md`: L2 Phase Dependencies/Effort, L3 Dependency Graph/Critical Path/Milestones/ADR, L3+ AI Execution/Workstreams/Communication all `[placeholder]`
- `checklist.md`: Created with entirely unchecked generic items
- `decision-record.md`: Created as empty template (had to be manually populated)

The upgrade script is a shell script — it cannot reason about content. But the AI agent invoking the upgrade CAN. The agent has full context of the spec folder (spec.md, plan.md, tasks.md, implementation-summary.md) and should use that context to populate the scaffolding.

### Purpose

After the upgrade script runs, the AI agent should read the injected placeholder sections and replace them with content derived from the existing spec folder documents, producing a complete and useful upgraded spec folder rather than one full of `[placeholder]` text.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Post-upgrade AI pass that fills placeholder content in all modified/created files
- Context extraction from existing spec documents (spec.md, plan.md, tasks.md, implementation-summary.md)
- Populating L2 sections: NFRs, Edge Cases, Complexity Assessment, Phase Dependencies, Effort Estimation, Enhanced Rollback
- Populating L3 sections: Dependency Graph, Critical Path, Milestones, ADR
- Populating L3+ sections: AI Execution Framework, Workstream Coordination, Communication Plan
- Populating checklist.md with spec-relevant items
- Populating decision-record.md with actual decisions from the spec work

### Out of Scope

- Modifying `upgrade-level.sh` itself (shell script stays as-is, does structural scaffolding only)
- Auto-populating during `spec_kit:complete` or `spec_kit:plan` workflows (separate concern)
- Generating content when no existing context is available (new empty spec folders)
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| R-001 | AI reads all existing spec files after upgrade completes | Agent reads spec.md, plan.md, tasks.md, implementation-summary.md |
| R-002 | All `[placeholder]` patterns replaced with contextual content | Grep for `\[.*\]` placeholder patterns returns 0 in upgraded files |
| R-003 | Original user-written content preserved unchanged | Diff shows only placeholder sections modified |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| R-004 | Complexity Assessment scores derived from actual spec scope | Scores reflect real file count, LOC, risk factors |
| R-005 | Phase Dependencies reflect actual plan phases | Dependency table matches plan.md phase structure |
| R-006 | Checklist items relevant to the specific spec | Generic items replaced or supplemented with spec-specific checks |
| R-007 | Decision-record.md populated with actual decisions (if any exist) | ADRs reference real decisions from implementation-summary or plan |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- SC-001: After upgrade, zero `[placeholder]` patterns remain in any spec file
- SC-002: Populated content is factually accurate to the spec's actual scope and implementation
- SC-003: The upgrade + populate flow completes without user intervention
- SC-004: Works for all upgrade paths (L1→L2, L1→L3, L1→L3+, L2→L3, L2→L3+, L3→L3+)
<!-- /ANCHOR:success-criteria -->

## 6. IMPLEMENTATION APPROACH

The implementation should be an AI-side workflow step, not a script change:

1. **upgrade-level.sh** runs as-is (structural scaffolding)
2. **AI agent** reads all files in the upgraded spec folder
3. **AI agent** identifies placeholder patterns (`[...]`, template text)
4. **AI agent** extracts context from existing content (problem statement, phases, tasks, decisions, files changed)
5. **AI agent** replaces placeholders with derived content using Edit tool
6. **AI agent** reports what was populated

This could be integrated into:
- The `/spec_kit:complete` workflow as a post-upgrade step
- A standalone command or skill invoked after manual `upgrade-level.sh` usage
- The upgrade script's own documentation (instructing the AI to populate after running)

## 7. RELATED DOCUMENTS

- **Triggered by**: Spec 127 (`127-spec126-documentation-alignment`) — upgrade produced all-placeholder files
- **Upgrade script**: `.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh`
- **Templates**: `.opencode/skill/system-spec-kit/templates/addendum/`
- **Script bug found**: `EXECUTIVE SUMMARY` false positive skips L2→L3 spec.md injection (separate fix needed)

<!-- /ANCHOR:spec-overview -->
