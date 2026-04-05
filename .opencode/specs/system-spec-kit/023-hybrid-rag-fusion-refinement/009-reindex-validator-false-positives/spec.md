---
title: "Feature Specification: Reindex Validator False Positives [system-spec-kit/023-hybrid-rag-fusion-refinement/009-reindex-validator-false-positives/spec]"
description: "Fix false-positive validation behavior that blocked legitimate memory and spec files during batch reindex."
trigger_phrases:
  - "reindex false positive"
  - "validator blocking index"
  - "memory files not indexed"
  - "cross-spec contamination false positive"
  - "topical coherence mismatch"
importance_tier: "important"
contextType: "implementation"
---
# Feature Specification: Reindex Validator False Positives

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Review |
| **Created** | 2026-03-31 |
| **Branch** | `system-speckit/024-compact-code-graph` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | 008-spec-memory-compliance-audit |
| **Successor** | 010-search-retrieval-quality-fixes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Batch reindex discovered substantially more files on disk than were inserted into the memory index. Two validation rules were producing false positives in bulk mode, which blocked valid memory and spec documentation content from indexing.

### Purpose
Make bulk reindex permissive for valid spec-memory content while keeping contamination safeguards intact for real cross-spec leakage.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Repair V8 cross-spec contamination handling for batch mode context.
- Repair V12 topical coherence handling for memory/spec-document indexing paths.
- Keep existing interactive `memory_save` behavior stable.
- Align context type handling to canonical values used by runtime and schema.

### Out of Scope
- New validation rule families.
- Retrieval algorithm redesign.
- Dashboard formatting redesign.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scripts/lib/validate-memory-quality.ts` | Modify | Adjust V8/V12 behavior for bulk index path |
| `mcp_server/handlers/memory-index.ts` | Modify | Pass contextual path/scope data into validation |
| `scripts/lib/frontmatter-migration.ts` | Modify | Normalize context type defaults and aliases |
| `mcp_server/lib/search/vector-index-schema.ts` | Modify | Enforce canonical context type values in schema |
| `shared/context-types.ts` | Create/Modify | Shared canonical context type mapping |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Bulk reindex no longer false-blocks same-spec references | Batch indexing no longer rejects valid same-parent/same-scope files due V8 alone |
| REQ-002 | V12 no longer blocks eligible memory/spec docs during index | Memory and spec-doc paths are indexable without false V12 hard-blocks |
| REQ-003 | Canonical context types are enforced consistently | Runtime + migration + schema all accept canonical context set |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Duplicates are prevented during forced reindex | Reindex does not keep accumulating duplicate rows for identical content |
| REQ-005 | Rule output is diagnosable | Validation outputs include human-readable rule identity |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Recursive strict validator reports no structural errors for Phase 009 docs.
- **SC-002**: Phase documentation reflects implemented remediation scope without overstating fresh runtime verification.
- **SC-003**: Canonical context handling is documented consistently across spec, plan, tasks, checklist, and implementation summary.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->

### Acceptance Scenarios

**Given** the phase scope and requirements are loaded, **when** implementation starts, **then** only in-scope files and behaviors are changed.

**Given** the phase deliverables are implemented, **when** verification runs, **then** required checks complete without introducing regressions.

**Given** this phase depends on predecessor outputs, **when** those dependencies are present, **then** this phase behavior composes correctly with adjacent phases.

**Given** this phase modifies documented behavior, **when** packet docs are reviewed, **then** spec/plan/tasks/checklist remain internally consistent.

**Given** this phase is rerun in a clean environment, **when** the same commands are executed, **then** outcomes are reproducible.

**Given** completion is claimed, **when** evidence is inspected, **then** each required acceptance outcome is explicitly supported.

## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Over-relaxing contamination checks | May allow noisy content into index | Keep structured-path scoping explicit and narrow |
| Risk | Documentation drift from code truth | Misleading completion signals | Keep status as review-oriented and reference implementation artifacts |
| Dependency | Runtime DB state | Required for end-to-end confidence | Keep runtime validation explicitly separated from structural doc cleanup |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Batch reindex should complete without pathological retry/duplicate growth.
- **NFR-P02**: Validation overhead remains bounded per file.

### Security
- **NFR-S01**: Contamination defenses remain active for genuinely foreign-spec content.
- **NFR-S02**: No sensitive data handling behavior is weakened by documentation changes.

### Reliability
- **NFR-R01**: Canonical context type mapping remains deterministic across services.
- **NFR-R02**: Forced reindex remains idempotent for unchanged content.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty `spec_folder` metadata during batch mode must still derive valid scope from file path.
- Multi-level and single-level spec paths must resolve consistently.

### Error Scenarios
- Batch mode should warn with context when rule checks are skipped or relaxed.
- Unknown legacy context values should be normalized before persistence.

### State Transitions
- Forced reindex should avoid duplicate insert churn on repeated runs.
- Legacy DBs should migrate to canonical context constraints safely.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Touches validation, schema, migration, and handlers |
| Risk | 17/25 | Risky if contamination checks are loosened incorrectly |
| Research | 14/20 | Driven by deep-review and incident analysis |
| **Total** | **49/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should additional guardrails be added for future rule relaxation changes in bulk mode?
- Should reindex telemetry expose per-rule counters by default?
<!-- /ANCHOR:questions -->
