---
title: "Implementation Plan"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Implementation Plan: SK-Doc-Visual Design System

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context
| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown / HTML / CSS |
| **Source of Truth** | `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html` |
| **Validation Tool** | `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` |

This plan remediates the Level 3 docs by adding concrete extraction evidence and reconciling traceability across all spec artifacts.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
### Definition of Ready
- [x] Problem statement clear
- [x] Success criteria measurable

### Entry Conditions
- Source template exists and is readable.
- Target spec folder contains all Level 3 files.

### Definition of Done
- [x] All acceptance criteria met
- [x] Docs synchronized (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`)
- [x] Validation command exits 0
- [x] Memory context saved through `generate-context.js`
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
### Pattern
Documentation-only extraction and traceability pattern.

### Key Components
- Source capture: extract layout, variables, components, and section IDs from canonical HTML.
- Evidence normalization: every claim includes command/file evidence or explicit N/A rationale.
- Verification chain: validator output and memory-save output are recorded in checklist + implementation summary.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
### Phase 1: Setup
- Confirm canonical source path and extractable anchors.
- Confirm target spec files and anchors are present.

### Phase 2: Core Implementation
- Add extraction evidence in `spec.md` Section 13 (layout, variable inventory, components, section map).
- Expand `decision-record.md` with full ADR quality (metadata, alternatives, five checks, rollback).
- Reconcile `tasks.md`, `checklist.md`, and `implementation-summary.md` with evidence-based state.

### Phase 3: Verification
- Run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/03--commands-and-skills/sk-doc-visual/006-sk-doc-visual-design-system/001-initial-set-up`.
- Run `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js specs/03--commands-and-skills/sk-doc-visual/006-sk-doc-visual-design-system/001-initial-set-up`.
- Record outputs in checklist and implementation summary.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static verification | Spec folder rule checks | `validate.sh` |
| Manual traceability | HTML vs extracted evidence | `rg`, `read` |
| Process verification | Memory save workflow | `generate-context.js` |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html` | Internal | Green | Cannot extract canonical evidence |
| `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` | Internal | Green | Cannot confirm completion gate |
| `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js` | Internal | Green | Cannot complete memory evidence |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
- Trigger: Validation fails or evidence tables are inconsistent with source HTML.
- Procedure:
  1. Revert modified files in this spec folder only.
  2. Re-run extraction commands and restore evidence from source lines.
  3. Re-run validation before marking complete.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:ai-protocol -->
## AI Execution Protocol
### Pre-Task Checklist
- [x] Context loaded
- [x] Templates validated

### Execution Rules
| Rule | Description |
|------|-------------|
| R1 | Do not modify HTML source. |
| R2 | Keep changes scoped to this spec folder. |
| R3 | Use evidence-backed checklist updates only. |

### Status Reporting Format
- Status: Complete when validation + memory evidence are present.

### Blocked Task Protocol
- Stop and ask user for clarification.
<!-- /ANCHOR:ai-protocol -->

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verification |
| Verification | Core | Completion |
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION
| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 10 mins |
| Core Implementation | Medium | 35 mins |
| Verification | Low | 10 mins |
<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK
### Pre-deployment Checklist
- [x] Snapshot available in git history
- [x] Source HTML left unchanged
<!-- /ANCHOR:enhanced-rollback -->

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH
- Source HTML -> Evidence Extraction -> Spec Tables
- Spec/Plan/Tasks/ADR -> Checklist Evidence -> Implementation Summary
- Validation Script + Memory Script -> Completion Evidence
<!-- /ANCHOR:dependency-graph -->

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH
1. Setup
2. Extract and document evidence in `spec.md`
3. Reconcile checklist/ADR/summary
4. Validate and save memory
<!-- /ANCHOR:critical-path -->

<!-- ANCHOR:milestones -->
## L3: MILESTONES
| Milestone | Description |
|-----------|-------------|
| M1 | Source evidence captured in `spec.md` |
| M2 | Traceability reconciled across all Level 3 docs |
| M3 | Validation + memory evidence recorded |
<!-- /ANCHOR:milestones -->
