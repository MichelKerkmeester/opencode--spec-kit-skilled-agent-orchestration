---
title: "Consolidated spec: 002-indexing-normalization [002-indexing-normalization/spec.md]"
description: "Consolidated from 002-index-tier-anomalies/spec.md and 004-frontmatter-indexing/spec.md."
SPECKIT_TEMPLATE_SOURCE: "merge-consolidation | v1.0"
trigger_phrases:
  - "consolidated"
  - "002-indexing-normalization"
importance_tier: "important"
contextType: "implementation"
---
# Consolidated spec.md

This document consolidates source documents from:
- `002-index-tier-anomalies/spec.md`
- `004-frontmatter-indexing/spec.md`

## Source: `002-index-tier-anomalies/spec.md`

---
title: "Feature Specification: Memory Index Deduplication and Tier Normalization [002-index-tier-anomalies/spec]"
description: "memory_index_scan can index the same logical files twice when both specs/ and .opencode/specs/ resolve to the same tree through symlinks or mirrored paths. This inflates scan co..."
SPECKIT_TEMPLATE_SOURCE: "spec-core + level2-verify + level3-arch | v2.2"
trigger_phrases:
  - "feature"
  - "specification"
  - "memory"
  - "index"
  - "deduplication"
  - "spec"
  - "003"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: Memory Index Deduplication and Tier Normalization

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

`memory_index_scan` can index the same logical files twice when both `specs/` and `.opencode/specs/` resolve to the same tree through symlinks or mirrored paths. This inflates scan counts, can create duplicate memory records, and makes retrieval behavior noisy.

The same workflow also shows tier inconsistencies when parsed metadata and document-type defaults are applied differently across scan and save paths. This spec defines one canonical indexing path strategy and one deterministic tier resolution strategy.

**Key Decisions**: canonical path dedup before indexing; deterministic tier precedence for all indexed markdown docs.

**Critical Dependencies**: existing incremental-index metadata and memory parser behavior must remain backward compatible.
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
The index scan currently collects files from both `specs/` and `.opencode/specs/` roots. If one path is a symlink or alias of the other, identical files can enter the same scan batch twice. This can overcount scanned/indexed totals and introduce duplicate rows for the same logical artifact.

In parallel, tier assignment is not explicitly documented as a single precedence chain across parser metadata, inline markers, and document-type defaults. This causes tier anomalies that are hard to diagnose during search ranking and auditing.

### Purpose
Make indexing deterministic by deduplicating canonical file paths before indexing and by enforcing one clear tier precedence model with regression coverage.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Canonical path deduplication in memory file discovery and index scan assembly.
- Tier precedence normalization for spec docs, memory docs, and constitutional docs.
- Regression tests covering symlink alias scanning and tier resolution edge cases.
- Validation that incremental scan metrics remain accurate after dedup.

### Out of Scope
- Changes to embedding model providers or vector DB schema.
- Search relevance algorithm redesign outside tier-normalization fixes.
- Migration of historical duplicate data already stored in production indexes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts` | Modify | Canonical path handling in directory scan and filter logic |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts` | Modify | Dedup merged scan file list before batch indexing |
| `.opencode/skill/system-spec-kit/mcp_server/lib/scoring/importance-tiers.ts` | Modify | Clarify and enforce default tier mapping behavior |
| `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts` | Modify | Add duplicate-source scan regression coverage |
| `.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts` | Modify | Add tier precedence and parser normalization tests |
| `.opencode/skill/system-spec-kit/mcp_server/tests/importance-tiers.vitest.ts` | Modify | Add tier mapping consistency tests |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Canonical file path deduplication occurs before indexing batches are created | A scan where `specs/` and `.opencode/specs/` point to same files indexes each logical file once |
| REQ-002 | Index scan counters report unique-file totals | `scanned`, `indexed`, and `unchanged` are not inflated by alias roots |
| REQ-003 | Tier resolution follows documented precedence | Tests prove deterministic result for metadata tier, inline markers, and defaults |
| REQ-004 | Constitutional tier handling stays intact | Constitutional docs still surface with expected always-surface behavior |
| REQ-005 | Regression tests protect against symlink/alias duplication | New tests fail before fix and pass after fix |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Diagnostic output explains dedup decisions in verbose logs | Debug logs show deduped path counts and skipped aliases |
| REQ-007 | Spec and implementation docs reflect final tier precedence rules | `plan.md`, `decision-record.md`, and `implementation-summary.md` stay synchronized |
| REQ-008 | Tier fallback behavior is explicit for invalid metadata values | Invalid or unknown tiers resolve to documented defaults in tests |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Alias-path scans no longer create duplicate indexing operations.
- **SC-002**: Tier assignment is deterministic and test-covered.
- **SC-003**: No regression in constitutional memory surfacing behavior.
- **SC-004**: Validation and test suite pass with no new errors.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Filesystem behavior differs across macOS/Linux symlink handling | Dedup can miss path aliases on one platform | Normalize with `realpath` and path separator normalization in tests |
| Risk | Over-aggressive dedup could drop valid distinct files | Missing index coverage | Dedup key uses canonical absolute path only after existence checks |
| Risk | Tier precedence change can alter ranking behavior | Search result order shifts | Add explicit before/after tests for representative document types |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Dedup step adds negligible overhead (<5% to scan time in local test corpus).

### Security
- **NFR-S01**: No file writes outside existing index and metadata storage paths.

### Reliability
- **NFR-R01**: Re-running scans on unchanged trees remains idempotent.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- Empty memory directories still return zero-scan success.
- Duplicate file discovered through more than two alias roots is indexed once.

### Error Scenarios
- Broken symlink entries are skipped without aborting full scan.
- Invalid tier metadata falls back to documented default tier.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Core parser + index scan + tests across multiple modules |
| Risk | 22/25 | Ranking/tier behavior and index integrity are high impact |
| Research | 14/20 | Requires path-canonicalization and tier-precedence validation |
| Multi-Agent | 8/15 | Single implementation stream, multiple verification artifacts |
| Coordination | 9/15 | Cross-file coupling between parser, scanner, and scoring |
| **Total** | **73/100** | **Level 3** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Canonicalization mismatch across platforms | H | M | Add path-normalization tests for POSIX and escaped separators |
| R-002 | Tier normalization changes ranking unexpectedly | H | M | Snapshot-like ranking assertions on representative fixtures |
| R-003 | Dedup reduces scan logs needed for debugging | M | M | Add explicit dedup summary counters in scan response metadata |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Deterministic Indexing (Priority: P0)

**As a** platform maintainer, **I want** one logical file to be indexed once regardless of alias paths, **so that** the memory database stays clean and metrics stay trustworthy.

**Acceptance Criteria**:
1. Given alias roots that point to the same file tree, when `memory_index_scan` runs, then each canonical file path is processed once.

---

### US-002: Predictable Tier Assignment (Priority: P0)

**As a** retrieval-system maintainer, **I want** deterministic tier precedence, **so that** ranking and memory behavior are explainable.

**Acceptance Criteria**:
1. Given conflicting metadata signals, when a file is parsed, then tier resolution follows one documented precedence chain.
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:acceptance-scenarios -->
## 11.5 ACCEPTANCE SCENARIOS

1. **Alias roots deduped**
   **Given** `specs/` and `.opencode/specs/` resolve to the same tree
   **When** `memory_index_scan` runs
   **Then** each canonical file path is indexed once.

2. **Spec folder filtering preserved**
   **Given** a `specFolder` filter for one child spec
   **When** canonicalization and dedup are applied
   **Then** files outside the filtered subtree are excluded.

3. **Tier metadata precedence**
   **Given** a memory file with valid YAML tier metadata and inline tier marker mismatch
   **When** parsing runs
   **Then** YAML metadata tier wins.

4. **Inline marker fallback**
   **Given** a file without tier metadata but with inline marker
   **When** parsing runs
   **Then** marker tier is used.

5. **Document-type fallback**
   **Given** a file with no explicit tier signals
   **When** parsing runs
   **Then** document-type default tier is applied.

6. **Invalid tier safety**
   **Given** malformed tier metadata
   **When** parser normalizes the tier
   **Then** a valid default tier is applied without crashing.
<!-- /ANCHOR:acceptance-scenarios -->

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Should historical duplicate rows be cleaned in this same delivery or tracked as a follow-up maintenance spec?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`

## Source: `004-frontmatter-indexing/spec.md`

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
