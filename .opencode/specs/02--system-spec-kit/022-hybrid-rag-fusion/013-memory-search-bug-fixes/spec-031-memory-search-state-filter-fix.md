---
title: "Spec: Memory Search State Filter Fix + Folder Discovery Follow-up"
description: "Document follow-up enhancement for deep folder discovery, canonical root dedupe, staleness checks, and graceful invalid-path cache behavior."
importance_tier: "normal"
contextType: "implementation"
---
# Specification: Memory Search State Filter Fix + Folder Discovery Follow-up

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Completed |
| **Created** | 2026-03-05 |
| **Branch** | `031-memory-search-state-filter-fix` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After the Stage 4 state-filter fix, folder discovery behavior still needed hardening for deeper spec trees and aliased spec roots. Without recursive discovery, stale checks could miss nested spec folders; without canonical dedupe, `specs/` and `.opencode/specs/` aliases could duplicate work; and invalid explicit input paths needed graceful handling.

### Purpose
Capture and verify the completed follow-up enhancement so folder discovery remains correct for deep nesting, root aliases, recursive staleness checks, and invalid/nonexistent input paths.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add depth-limited recursive folder discovery for nested spec layers (4/5+), max depth 8.
- Dedupe aliased spec roots (`specs/` and `.opencode/specs/`) by canonical path while preserving first candidate path.
- Use recursively discovered spec folders for staleness checks.
- Ensure `ensureDescriptionCache` returns an empty cache object when non-empty input paths are invalid/nonexistent.
- Add/adjust unit and integration coverage for folder discovery behavior.

### Out of Scope
- Changes to memory scoring/ranking behavior.
- New indexing schema or database migration work.
- Changes outside folder-discovery logic and its direct tests.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts` | Modify | Implement recursive discovery, canonical root dedupe, recursive staleness checks, and invalid-path graceful cache behavior |
| `.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts` | Modify | Validate deep discovery and invalid input handling |
| `.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery-integration.vitest.ts` | Modify | Validate integration behavior across discovered folders and root alias scenarios |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Folder discovery cache must support deep nested spec layers using depth-limited recursion. | Recursive discovery traverses nested folders and respects max depth 8 in tests. |
| REQ-002 | Aliased specs roots must be deduped by canonical path while preserving first candidate path. | Duplicate canonical roots are skipped, and first candidate root remains active in discovery path selection. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Staleness checks must operate on recursively discovered spec folders. | Staleness logic evaluates full discovered folder set, not shallow roots only. |
| REQ-004 | `ensureDescriptionCache` must degrade gracefully for invalid/nonexistent non-empty input paths. | Function returns empty cache object instead of throwing or producing partial invalid state. |
| REQ-005 | Folder-discovery unit/integration verification must pass and be recorded with build/type/alignment checks. | Test and verification commands listed in this spec pass with documented evidence counts. |
<!-- /ANCHOR:requirements -->

---

## 4.1 ACCEPTANCE SCENARIOS

- **Given** nested spec folders deeper than 3 levels, **when** folder discovery runs, **then** recursive discovery includes valid nested spec folders up to max depth 8.
- **Given** `specs/` and `.opencode/specs/` point to the same canonical path, **when** root candidates are processed, **then** the duplicate canonical root is ignored and first candidate path is preserved.
- **Given** staleness evaluation is requested, **when** description-cache checks execute, **then** all recursively discovered spec folders are evaluated.
- **Given** non-empty explicit input paths that are invalid/nonexistent, **when** `ensureDescriptionCache` runs, **then** an empty cache object is returned without exception.

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Folder discovery reliably handles deep nested spec structures with bounded recursion.
- **SC-002**: Root alias duplication is eliminated via canonical-path dedupe without changing first-path behavior.
- **SC-003**: Recursive staleness checks and invalid-path graceful handling are verified by test coverage and command evidence.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Filesystem canonical path behavior (symlink/alias resolution) | Incorrect dedupe could hide valid roots or duplicate scans | Canonical-path dedupe with first-candidate retention and integration tests |
| Risk | Recursive traversal overreach | Medium | Enforce depth cap at 8 and targeted tests for deep but bounded traversal |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Follow-up scope is closed and evidence-backed.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Recursive discovery remains bounded by max depth 8.
- **NFR-P02**: Canonical dedupe avoids duplicate root traversal work.

### Security
- **NFR-S01**: No change to authentication or authorization behavior.
- **NFR-S02**: No new sensitive data fields introduced by discovery enhancements.

### Reliability
- **NFR-R01**: Invalid/nonexistent explicit input paths must not crash cache creation.
- **NFR-R02**: Recursive discovery and staleness checks remain deterministic across aliased roots.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: Existing query-validation behavior remains unchanged.
- Deep nesting: Discovery includes nested folders through configured depth boundary.
- Aliased roots: Canonical duplicate roots collapse to one logical root.

### Error Scenarios
- Invalid explicit input path(s): `ensureDescriptionCache` returns empty cache object.
- Symlink/alias duplication: Canonical dedupe prevents duplicate root processing.
- Concurrent cache checks: No write-side behavior changes.

### State Transitions
- Discovery paths transition from candidate roots to canonical deduped root set.
- Staleness checks transition from shallow selection to recursive discovered set.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Core discovery module plus unit/integration tests |
| Risk | 16/25 | Recursive traversal and canonical dedupe correctness |
| Research | 11/20 | Validate deep nesting, alias roots, and graceful invalid paths |
| **Total** | **45/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. REFERENCES

- `.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery-integration.vitest.ts`
