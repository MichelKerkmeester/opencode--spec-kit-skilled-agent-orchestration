# Iteration 001

## Dimension

- `correctness`

## Files Reviewed

- `.opencode/skill/sk-code-review/references/review_core.md`
- `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`
- `.opencode/skill/system-spec-kit/templates/level_1/README.md`
- `.opencode/skill/system-spec-kit/templates/level_1/spec.md`
- `.opencode/skill/system-spec-kit/templates/level_1/plan.md`
- `.opencode/skill/system-spec-kit/templates/level_1/tasks.md`
- `.opencode/skill/system-spec-kit/templates/level_1/implementation-summary.md`
- `.opencode/skill/system-spec-kit/templates/level_2/README.md`
- `.opencode/skill/system-spec-kit/templates/level_2/spec.md`
- `.opencode/skill/system-spec-kit/templates/level_2/plan.md`
- `.opencode/skill/system-spec-kit/templates/level_2/tasks.md`
- `.opencode/skill/system-spec-kit/templates/level_2/checklist.md`
- `.opencode/skill/system-spec-kit/templates/level_2/implementation-summary.md`
- `.opencode/skill/system-spec-kit/templates/level_3/README.md`
- `.opencode/skill/system-spec-kit/templates/level_3/spec.md`
- `.opencode/skill/system-spec-kit/templates/level_3/plan.md`
- `.opencode/skill/system-spec-kit/templates/level_3/tasks.md`
- `.opencode/skill/system-spec-kit/templates/level_3/checklist.md`
- `.opencode/skill/system-spec-kit/templates/level_3/decision-record.md`
- `.opencode/skill/system-spec-kit/templates/level_3/implementation-summary.md`

## Enumeration Results

### Shared Frontmatter Schema

All packet templates in `level_1/`, `level_2/`, and `level_3/` start with the same metadata contract:

`title`, `description`, `trigger_phrases`, `importance_tier`, `contextType`, `_memory.continuity.packet_pointer`, `_memory.continuity.last_updated_at`, `_memory.continuity.last_updated_by`, `_memory.continuity.recent_action`, `_memory.continuity.next_safe_action`, `_memory.continuity.blockers`, `_memory.continuity.key_files`, `_memory.continuity.session_dedup.fingerprint`, `_memory.continuity.session_dedup.session_id`, `_memory.continuity.session_dedup.parent_session_id`, `_memory.continuity.completion_pct`, `_memory.continuity.open_questions`, `_memory.continuity.answered_questions`.

Observed consistency notes:

- All 18 template files include the same frontmatter field family.
- 15 of 18 template files include a `SPECKIT_TEMPLATE_SOURCE` marker immediately below `SPECKIT_LEVEL`.
- The 3 README files are the only templates without `SPECKIT_TEMPLATE_SOURCE`.
- `level_3/decision-record.md` additionally declares `HVR_REFERENCE`.

### Core + Addendum File Catalogue

Role assignment is taken from each level README's `REQUIRED FILES` and `LEVEL N ADDITIONS` sections.

| Level | File | Role | Template source hint | Frontmatter fields | ANCHOR tags | Expected section headers |
| --- | --- | --- | --- | --- | --- | --- |
| L1 | `README.md` | Catalog | none | shared schema | `table-of-contents`, `overview`, `files`, `quick-start`, `phase`, `related` | `# Level 1 Templates`; `## TABLE OF CONTENTS`; `## 1. OVERVIEW`; `## 2. REQUIRED FILES`; `## 3. QUICK START`; `## 4. PHASE DECOMPOSITION`; `## 5. RELATED` |
| L1 | `spec.md` | Core | `spec-core | v2.2` | shared schema | `metadata`, `problem`, `scope`, `requirements`, `success-criteria`, `risks`, `questions` | `# Feature Specification: [NAME]`; `## 1. METADATA`; `## 2. PROBLEM & PURPOSE`; `### Problem Statement`; `### Purpose`; `## 3. SCOPE`; `### In Scope`; `### Out of Scope`; `### Files to Change`; `## 4. REQUIREMENTS`; `### P0 - Blockers (MUST complete)`; `### P1 - Required (complete OR user-approved deferral)`; `## 5. SUCCESS CRITERIA`; `## 6. RISKS & DEPENDENCIES`; `## 7. OPEN QUESTIONS` |
| L1 | `plan.md` | Core | `plan-core | v2.2` | shared schema | `summary`, `quality-gates`, `architecture`, `phases`, `testing`, `dependencies`, `rollback` | `# Implementation Plan: [NAME]`; `## 1. SUMMARY`; `### Technical Context`; `### Overview`; `## 2. QUALITY GATES`; `### Definition of Ready`; `### Definition of Done`; `## 3. ARCHITECTURE`; `### Pattern`; `### Key Components`; `### Data Flow`; `## 4. IMPLEMENTATION PHASES`; `### Phase 1: Setup`; `### Phase 2: Core Implementation`; `### Phase 3: Verification`; `## 5. TESTING STRATEGY`; `## 6. DEPENDENCIES`; `## 7. ROLLBACK PLAN` |
| L1 | `tasks.md` | Core | `tasks-core | v2.2` | shared schema | `notation`, `phase-1`, `phase-2`, `phase-3`, `completion`, `cross-refs` | `# Tasks: [NAME]`; `## Task Notation`; `## Phase 1: Setup`; `## Phase 2: Implementation`; `## Phase 3: Verification`; `## Completion Criteria`; `## Cross-References` |
| L1 | `implementation-summary.md` | Required output addendum | `impl-summary-core | v2.2` | shared schema | `metadata`, `what-built`, `how-delivered`, `decisions`, `verification`, `limitations` | `# Implementation Summary`; `## Metadata`; `## What Was Built`; `### [Feature Name]`; `### Files Changed`; `## How It Was Delivered`; `## Key Decisions`; `## Verification`; `## Known Limitations` |
| L2 | `README.md` | Catalog | none | shared schema | `table-of-contents`, `overview`, `files`, `additions`, `quick-start`, `workflow-notes`, `phase`, `related` | `# Level 2 Templates`; `## TABLE OF CONTENTS`; `## 1. OVERVIEW`; `## 2. REQUIRED FILES`; `## 3. LEVEL 2 ADDITIONS`; `## 4. QUICK START`; `### Primary Path — Canonical Intake`; `### Manual Fallback (Advanced)`; `## 5. WORKFLOW NOTES`; `## 6. PHASE DECOMPOSITION`; `## 7. RELATED` |
| L2 | `spec.md` | Core plus L2 additions | `spec-core | v2.2` | shared schema | `metadata`, `problem`, `scope`, `requirements`, `success-criteria`, `risks`, `questions`, `nfr`, `edge-cases`, `complexity` | L1 spec headers plus `## L2: NON-FUNCTIONAL REQUIREMENTS`; `### Performance`; `### Security`; `### Reliability`; `## L2: EDGE CASES`; `### Data Boundaries`; `### Error Scenarios`; `### State Transitions`; `## L2: COMPLEXITY ASSESSMENT`; `## 10. OPEN QUESTIONS` |
| L2 | `plan.md` | Core plus L2 additions | `plan-core | v2.2` | shared schema | `summary`, `quality-gates`, `architecture`, `phases`, `testing`, `dependencies`, `rollback`, `phase-deps`, `effort`, `enhanced-rollback` | L1 plan headers plus `## L2: PHASE DEPENDENCIES`; `## L2: EFFORT ESTIMATION`; `## L2: ENHANCED ROLLBACK`; `### Pre-deployment Checklist`; `### Rollback Procedure`; `### Data Reversal` |
| L2 | `tasks.md` | Core | `tasks-core | v2.2` | shared schema | `notation`, `phase-1`, `phase-2`, `phase-3`, `completion`, `cross-refs` | same as L1 `tasks.md` |
| L2 | `checklist.md` | Addendum | `checklist | v2.2` | shared schema | `protocol`, `pre-impl`, `code-quality`, `testing`, `security`, `docs`, `file-org`, `summary` | `# Verification Checklist: [NAME]`; `## Verification Protocol`; `## Pre-Implementation`; `## Code Quality`; `## Testing`; `## Security`; `## Documentation`; `## File Organization`; `## Verification Summary` |
| L2 | `implementation-summary.md` | Required output addendum | `impl-summary-core | v2.2` | shared schema | `metadata`, `what-built`, `how-delivered`, `decisions`, `verification`, `limitations` | same as L1 `implementation-summary.md` |
| L3 | `README.md` | Catalog | none | shared schema | `table-of-contents`, `overview`, `files`, `additions`, `quick-start`, `workflow-notes`, `phase`, `related` | `# Level 3 Templates`; `## TABLE OF CONTENTS`; `## 1. OVERVIEW`; `## 2. REQUIRED FILES`; `## 3. LEVEL 3 ADDITIONS`; `## 4. QUICK START`; `### Primary Path — Canonical Intake`; `### Manual Fallback (Advanced)`; `## 5. WORKFLOW NOTES`; `## 6. PHASE DECOMPOSITION`; `## 7. RELATED` |
| L3 | `spec.md` | Core plus L3 additions | `spec-core + level2-verify + level3-arch | v2.2` | shared schema | `metadata`, `problem`, `scope`, `requirements`, `success-criteria`, `risks`, `questions` | `# Feature Specification: [NAME]`; `## EXECUTIVE SUMMARY`; `## 1. METADATA`; `## 2. PROBLEM & PURPOSE`; `### Problem Statement`; `### Purpose`; `## 3. SCOPE`; `### In Scope`; `### Out of Scope`; `### Files to Change`; `## 4. REQUIREMENTS`; `### P0 - Blockers (MUST complete)`; `### P1 - Required (complete OR user-approved deferral)`; `## 5. SUCCESS CRITERIA`; `## 6. RISKS & DEPENDENCIES`; `## 7. NON-FUNCTIONAL REQUIREMENTS`; `### Performance`; `### Security`; `### Reliability`; `## 8. EDGE CASES`; `### Data Boundaries`; `### Error Scenarios`; `## 9. COMPLEXITY ASSESSMENT`; `## 10. RISK MATRIX`; `## 11. USER STORIES`; `### US-001: [Title] (Priority: P0)`; `### US-002: [Title] (Priority: P1)`; `## 12. OPEN QUESTIONS`; `## RELATED DOCUMENTS` |
| L3 | `plan.md` | Core plus L3 additions | `plan-core | v2.2` | shared schema | `summary`, `quality-gates`, `architecture`, `phases`, `testing`, `dependencies`, `rollback`, `phase-deps`, `effort`, `enhanced-rollback`, `dependency-graph`, `critical-path`, `milestones` | L2 plan headers plus `## L3: DEPENDENCY GRAPH`; `### Dependency Matrix`; `## L3: CRITICAL PATH`; `## L3: MILESTONES`; `## L3: ARCHITECTURE DECISION RECORD`; `### ADR-001: [Decision Title]` |
| L3 | `tasks.md` | Core | `tasks-core | v2.2` | shared schema | `notation`, `phase-1`, `phase-2`, `phase-3`, `completion`, `cross-refs` | same as L1 `tasks.md` |
| L3 | `checklist.md` | Addendum | `checklist | v2.2` | shared schema | `protocol`, `pre-impl`, `code-quality`, `testing`, `security`, `docs`, `file-org`, `summary`, `arch-verify`, `perf-verify`, `deploy-ready`, `compliance-verify`, `docs-verify`, `sign-off` | L2 checklist headers plus `## L3+: ARCHITECTURE VERIFICATION`; `## L3+: PERFORMANCE VERIFICATION`; `## L3+: DEPLOYMENT READINESS`; `## L3+: COMPLIANCE VERIFICATION`; `## L3+: DOCUMENTATION VERIFICATION`; `## L3+: SIGN-OFF` |
| L3 | `decision-record.md` | Addendum | `decision-record | v2.2` | shared schema plus `HVR_REFERENCE` | `adr-001`, `adr-001-context`, `adr-001-decision`, `adr-001-alternatives`, `adr-001-consequences`, `adr-001-five-checks`, `adr-001-impl` | `# Decision Record: [NAME]`; `## ADR-001: [Decision Title]`; `### Metadata`; `### Context`; `### Constraints`; `### Decision`; `### Alternatives Considered`; `### Consequences`; `### Five Checks Evaluation`; `### Implementation` |
| L3 | `implementation-summary.md` | Required output addendum | `impl-summary-core | v2.2` | shared schema | `metadata`, `what-built`, `how-delivered`, `decisions`, `verification`, `limitations` | same as L1 `implementation-summary.md` |

### Validator Entry Point Notes

- `validate.sh` is the strict-mode orchestrator for packet structure and rule execution.
- The help text advertises rule families that this catalogue will be cross-referenced against next: `FILE_EXISTS`, `PLACEHOLDER_FILLED`, `SECTIONS_PRESENT`, `TEMPLATE_HEADERS`, `PHASE_LINKS`, `SPEC_DOC_INTEGRITY`, `ANCHORS_VALID`, `CROSS_ANCHOR_CONTAMINATION`, `POST_SAVE_FINGERPRINT`, `CONTINUITY_FRESHNESS`, `MERGE_LEGALITY`, `NORMALIZER_LINT`, `EVIDENCE_MARKER_LINT`, `TOC_POLICY`, `FRONTMATTER_MEMORY_BLOCK`, `SPEC_DOC_SUFFICIENCY`, `LEVEL_DECLARED`, `LEVEL_MATCH`, `LINKS_VALID`, `GRAPH_METADATA_PRESENT`, `PRIORITY_TAGS`.

## Findings By Severity

### P2-001 [P2] `decision-record.md` ships a malformed description placeholder

- File: `.opencode/skill/system-spec-kit/templates/level_3/decision-record.md:3`
- Evidence: The frontmatter `description` literal is `not "A decision was required regarding the selection of an appropriate approach." -->`, which is the only template description containing a stray comment terminator and does not read like a valid placeholder.
- Recommendation: Replace the placeholder with a normal ADR-purpose description string so copied packets do not inherit broken metadata guidance.

## Traceability Checks

- `template_inventory_complete`: PASS. Enumerated 18 template files across `level_1`, `level_2`, and `level_3`, plus the `validate.sh` orchestrator.
- `frontmatter_schema_stability`: PASS. All 18 templates share the same continuity-oriented frontmatter family.
- `template_source_marker_coverage`: PASS with note. 15 of 18 template files carry `SPECKIT_TEMPLATE_SOURCE`; the 3 README files intentionally do not.
- `validator_entrypoint_reviewed`: PASS. `validate.sh` rule/help surface captured for the next cross-reference iteration.

## Verdict

- `PASS` with `hasAdvisories=true`

This iteration completed the requested catalogue foundation for template correctness review. No P0/P1 correctness defect was evidenced in the inventory pass; one P2 metadata-placeholder anomaly was identified for follow-up.

## Next Dimension

- `contracts`
- Planned focus: map the validator's strict-mode rules onto this catalogue, identify orphaned rules/fields, and confirm whether the Level 2 and Level 3 added sections are fully covered by `TEMPLATE_HEADERS`, `ANCHORS_VALID`, `FRONTMATTER_MEMORY_BLOCK`, `SPEC_DOC_SUFFICIENCY`, and related checks.
