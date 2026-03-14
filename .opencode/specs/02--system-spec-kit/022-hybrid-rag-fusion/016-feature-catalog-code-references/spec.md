---
title: "Feature Specification: 016-Feature Catalog Code References"
description: "Analyze all MCP server code against the feature catalog. Add concise inline comments referencing feature catalog items by name. Remove all stale spec folder and sprint references from code comments."
trigger_phrases: ["feature catalog", "inline comments", "code references", "sprint cleanup"]
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: 016-Feature Catalog Code References
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Completed (implementation + verification confirmed 2026-03-14) |
| **Created** | 2026-03-14 |
| **Branch** | `main` |
| **Parent Spec** | `022-hybrid-rag-fusion` |
| **Previous Phase** | `015-hydra-db-based-features` |
| **Next Phase** | TBD |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The MCP server codebase contains inline comments that reference old spec folder numbers (e.g., "Sprint 8", "Phase 017", "spec 013") and sprint identifiers. These references become stale as the project evolves and folder names change. Meanwhile, the feature catalog provides a stable, name-based inventory of every implemented behavior, but the code itself does not link back to it.

### Purpose
Create a two-way traceability link between the codebase and the feature catalog by:
1. Adding concise inline comments that reference feature catalog items by name (not number)
2. Removing all stale spec folder and sprint references from existing inline comments
3. Preserving all existing general-purpose code comments that describe logic or intent

### Reference Convention
All feature catalog references in code MUST use the feature name only, never folder numbers. Folder numbers can change. Feature names are stable.

**Format:** `// Feature catalog: <feature-name>`

**Examples:**
- `// Feature catalog: hybrid search pipeline`
- `// Feature catalog: score normalization`
- `// Feature catalog: transaction wrappers on mutation handlers`

**Anti-patterns (never use):**
- `// Feature catalog: 01--retrieval/04-hybrid-search-pipeline` (uses folder numbers)
- `// Sprint 8: added score normalization` (references sprint)
- `// Phase 017: removed legacy pipeline` (references phase number)
- `// Spec 013: code audit fix` (references spec folder number)
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- All TypeScript source files under `mcp_server/` (handlers, lib, shared, scripts)
- All inline comments referencing spec folders, sprints, phases or ticket numbers
- Adding feature catalog name references to key functions, modules and exports
- The feature catalog at `.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md` and its individual files as the source of truth for feature names

### Out of Scope
- Test files (`.vitest.ts`) are excluded from comment modifications
- The feature catalog files themselves (already documented)
- Spec folder markdown files
- External documentation or README files
- Refactoring or changing any runtime behavior

### Constraint: Reference by Name Only
Feature catalog references MUST use the human-readable feature name as it appears in the catalog heading. Never use:
- Folder numbers (e.g., `01--retrieval`, `11-scoring-and-ranking-corrections`)
- Sprint numbers (e.g., `Sprint 8`, `Sprint 019`)
- Phase numbers (e.g., `Phase 017`, `Phase 015`)
- Spec folder paths (e.g., `specs/013-code-audit`)

### Files to Change

Analysis required to build the full file list. The scope covers all `.ts` files under:

| Directory | Estimated Files | Focus |
|-----------|----------------|-------|
| `mcp_server/handlers/` | ~20 | Tool handler entry points |
| `mcp_server/lib/` | ~60 | Core library modules |
| `mcp_server/scripts/` | ~15 | Build and utility scripts |
| `shared/` | ~10 | Shared algorithms and types |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Remove all inline comments referencing specific spec folder numbers | [x] Zero matches for patterns like `Sprint N`, `Phase NNN`, `spec NNN`, `spec-folder NNN` in non-test `.ts` files |
| REQ-002 | Remove all inline comments referencing specific sprint identifiers | [x] Zero matches for `Sprint \d+` pattern in inline code comments |
| REQ-003 | Add feature catalog references to handler entry points | [x] Each handler file has a top-level comment linking to its primary feature catalog entry by name |
| REQ-004 | Feature catalog references use names only, never numbers | [x] Zero matches for folder-number patterns in newly added references |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Add feature catalog references to core library modules | [x] Key functions in `lib/` directories reference their feature catalog entry by name |
| REQ-006 | Add feature catalog references to shared algorithm modules | [x] Shared scoring, fusion and pipeline modules reference their feature catalog entries |
| REQ-007 | Preserve all existing general-purpose code comments | [x] No non-reference comments are removed or altered |
| REQ-008 | Comments are concise (single line where possible) | [x] References follow the `// Feature catalog: <name>` convention |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- [x] **SC-001**: Zero inline comments reference specific spec folder numbers, sprint numbers or phase numbers in source `.ts` files
- [x] **SC-002**: All handler files have feature catalog name references
- [x] **SC-003**: Core library modules have feature catalog name references at key boundaries
- [x] **SC-004**: All feature catalog references use the `// Feature catalog: <name>` format
- [x] **SC-005**: TypeScript compile passes (`tsc --noEmit`)
- [x] **SC-006**: No runtime behavior changes (comment-only modifications)

### Acceptance Scenarios

1. **Given** the updated codebase, **When** searching for sprint/phase/spec-number references in `.ts` comments, **Then** zero matches are found.
2. **Given** any handler file, **When** opened by a developer, **Then** a feature catalog reference identifies which feature the handler implements.
3. **Given** the feature catalog, **When** a reader looks up a feature by name, **Then** they can grep the codebase for that name and find the implementing code.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Feature catalog completeness | Missing features mean missing references | Cross-check catalog inventory before starting |
| Risk | Stale sprint references embedded in string literals (not comments) | Could accidentally change runtime output | Only modify comment lines, never string content |
| Risk | Feature names that are ambiguous or too long for inline comments | Comments become unwieldy | Use the shortest unambiguous feature name from the catalog heading |
| Risk | Folder renumbering invalidates number-based references | Stale references mislead future developers | Name-only convention prevents this by design |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- N/A. Comment-only changes have zero runtime impact.

### Security
- No secrets, credentials or sensitive paths are introduced.

### Reliability
- N/A. No behavioral changes.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Files implementing multiple features get multiple `// Feature catalog:` references.
- Files that do not map to any specific feature (e.g., pure utility/type files) do not need references.

### Error Scenarios
- If a code module references a feature that does not exist in the catalog, flag it for catalog update rather than inventing a name.

### State Transitions
- N/A. Comment-only changes.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | ~100 source files across handlers, lib, shared and scripts |
| Risk | 8/25 | Low risk since changes are comment-only with no behavioral impact |
| Research | 14/20 | Requires mapping every source file to its feature catalog entry |
| **Total** | **40/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
