---
title: "Feature Specification: 004-frontmatter-indexing [004-frontmatter-indexing/spec]"
description: "This child spec defines a focused Level 3 implementation for frontmatter normalization and index rebuild. The goal is to standardize metadata across templates, spec docs, and me..."
SPECKIT_TEMPLATE_SOURCE: "spec-core + level2-verify + level3-arch | v2.2"
trigger_phrases:
  - "feature"
  - "specification"
  - "004"
  - "frontmatter"
  - "indexing"
  - "spec"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: 004-frontmatter-indexing

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

This child spec defines a focused Level 3 implementation for frontmatter normalization and index rebuild. The goal is to standardize metadata across templates, spec docs, and memory artifacts so retrieval quality and indexing consistency improve. The work includes parser/compose/migration tooling, deterministic rewrite rules, and reindex plus regression validation.

**Key Decisions**: enforce one canonical frontmatter schema, run idempotent migrations before reindex.

**Critical Dependencies**: existing memory parser/index pipeline and template source files.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Completed |
| **Created** | 2026-02-22 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Frontmatter keys and value shapes are currently inconsistent across templates, spec documents, and memory records. This causes parse edge cases, indexing drift, and uneven retrieval signals in hybrid search. Without normalization, migration and reindex operations are brittle and hard to validate.

### Purpose
Define and execute a deterministic normalization plus reindex workflow that produces stable metadata across all targeted document classes.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Define canonical frontmatter key set, casing rules, and value normalization policy.
- Build parser/compose/migration tooling for templates, spec docs, and memory markdown.
- Rebuild indexes and run verification tests for parser behavior and retrieval integrity.

### Out of Scope
- Rewriting narrative body content in spec or memory documents - not needed for metadata normalization.
- Database schema changes - this work is file-format and indexing-pipeline focused.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/templates/level_3/spec.md` | Modify | Normalize template frontmatter keys and defaults. |
| `.opencode/skill/system-spec-kit/templates/level_3/plan.md` | Modify | Apply canonical frontmatter format. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts` | Modify | Enforce normalized parse + compose behavior. |
| `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js` | Modify | Add migration pass and trigger reindex flow. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/spec126-full-spec-doc-indexing.vitest.ts` | Modify | Expand tests for normalized frontmatter indexing. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Canonical frontmatter schema is defined and documented. | Schema file and usage rules are committed with no conflicting keys in targeted templates. |
| REQ-002 | Migration tooling rewrites existing targeted docs idempotently. | Running migration twice produces zero additional diffs on second pass. |
| REQ-003 | Full index rebuild uses normalized metadata output. | Reindex run completes and indexed records expose canonical fields only. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Parser and compose logic reject malformed or ambiguous frontmatter. | Unit tests cover malformed blocks, duplicate keys, and mixed scalar/list inputs. |
| REQ-005 | Regression coverage protects retrieval behavior after normalization. | Integration tests pass for spec and memory retrieval with unchanged functional results. |
| REQ-006 | Canonical key ordering is deterministic in composed output. | Repeated compose runs produce byte-stable frontmatter ordering. |
| REQ-007 | Migration tooling supports dry-run and apply modes. | Dry-run reports planned changes without writing files; apply mode writes expected changes. |
| REQ-008 | Reindex workflow emits structured success/failure metadata. | Command output includes counts for scanned, migrated, indexed, and failed records. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All targeted files conform to canonical frontmatter shape after migration.
- **SC-002**: Index rebuild + test suite completes with no parser regressions.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Existing parser/index contracts | Incorrect assumptions can break indexing. | Add compatibility adapter and staged tests before full migration. |
| Risk | Bulk migration touches many markdown files | High churn can hide mistakes. | Use dry-run diff mode and idempotency checks before write mode. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Full migration + reindex for targeted scope completes within established CI timeout budget.

### Security
- **NFR-S01**: No secrets are introduced or persisted by migration outputs.

### Reliability
- **NFR-R01**: Migration is deterministic and safe to re-run without data loss.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- Empty frontmatter block: parser emits explicit defaults and non-fatal warning.
- Mixed type values for same key across files: migration coerces to canonical type with traceable report.

### Error Scenarios
- Parse failure on malformed YAML: file is skipped, logged, and reported for manual correction.
- Reindex interruption: rerun resumes safely because migration and compose are idempotent.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Multiple templates, parser, scripts, and tests updated. |
| Risk | 18/25 | Broad metadata rewrite can affect retrieval correctness. |
| Research | 12/20 | Canonical schema and mapping policy need alignment. |
| Multi-Agent | 8/15 | Workstreams can split by templates/parser/tests. |
| Coordination | 9/15 | Requires ordered migration then reindex then verification. |
| **Total** | **67/100** | **Level 3** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Frontmatter rewrite drops required metadata fields | H | M | Enforce schema validation and pre/post migration diff checks. |
| R-002 | Reindex pipeline consumes stale composed values | M | M | Couple migration completion to explicit rebuild trigger and assertions. |
| R-003 | Parser strictness breaks legacy documents | M | H | Provide compatibility mapping and clear error reports for unsupported cases. |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Normalize Metadata at Scale (Priority: P0)

**As a** maintainer, **I want** frontmatter normalization applied consistently, **so that** indexing has one reliable metadata contract.

**Acceptance Criteria**:
1. Given mixed legacy frontmatter, when migration runs, then output uses canonical keys and value types.
2. Given canonical files, when migration runs again, then no content changes are produced.

---

### US-002: Preserve Retrieval Integrity (Priority: P1)

**As a** developer, **I want** index rebuild and retrieval tests after migration, **so that** search quality is stable after normalization.

**Acceptance Criteria**:
1. Given normalized files, when reindex executes, then indexed frontmatter fields match the canonical schema.
2. Given regression tests, when suite runs, then expected retrieval fixtures continue to pass.
<!-- /ANCHOR:user-stories -->

---

## ACCEPTANCE SCENARIOS

1. **Given** a template file with mixed-case frontmatter keys, **When** migration runs, **Then** keys are rewritten to canonical casing.
2. **Given** a spec file already compliant with canonical schema, **When** migration runs, **Then** no file diff is produced.
3. **Given** a memory file with duplicate logical keys, **When** parser normalization runs, **Then** one canonical key remains with deterministic value resolution.
4. **Given** malformed frontmatter syntax, **When** migration runs, **Then** the file is skipped and reported as an error without partial write.
5. **Given** successful migration output, **When** reindex is executed, **Then** indexed metadata fields match canonical names and types.
6. **Given** a full regression run after rebuild, **When** retrieval tests execute, **Then** expected fixtures pass with no normalization regressions.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Should migration auto-fix unknown custom keys into `x_`-prefixed extension fields, or fail closed?
- Should index rebuild run in one global pass or in ordered template/spec/memory stages with checkpoints?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
