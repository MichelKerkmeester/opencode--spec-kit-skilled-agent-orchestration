---
title: "Feature Catalog Comprehensive Audit & Remediation"
status: "in-progress"
level: 3
created: "2025-12-01"
updated: "2026-03-21"
---
# Feature Catalog Comprehensive Audit & Remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch -->

---

## EXECUTIVE SUMMARY

The Spec Kit Memory MCP server's feature catalog had a verified **2026-03-08 historical snapshot** of 180 snippet files across 20 categories. That snapshot captured documentation drift: inaccurate descriptions, invalid code paths, and 55 undocumented capabilities discovered by a prior 10-agent scan. A **2026-03-16 current-state addendum** tracks live-tree drift to 189 snippet files and classifies 14 omitted current snippets. A **2026-03-21 normalization addendum** removes all provisional `NEW-NNN` markers, adds phase 016/017 coverage, and brings the catalog to 194 files and the playbook to 200 files.

**Key Decisions**: 30-agent partitioned research (20 verification + 10 gap investigation), 3-tier significance classification

**Critical Dependencies**: MCP server source code (`mcp_server/`), existing feature catalog snippets

---

## CURRENT-STATE ADDENDUM (2026-03-16)

- Historical snapshot remains unchanged: 2026-03-08 audit verified 180 snippets and produced the 202-item remediation base.
- Current tree now contains 189 snippets (net +9 versus snapshot baseline after taxonomy/category drift and post-snapshot additions).
- 14 current snippets were outside executed March 8 verification ranges and are now classified in the addendum:
  - 12 appear structurally current with no immediate remediation.
  - 2 require follow-up (`.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/11-feature-catalog-code-references.md`, `.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/13-constitutional-memory-manager-command.md`) for source-path normalization/correction.
- Tooling narrative is clarified as planned-vs-executed: some plan text says Copilot for Stream 1, but execution artifacts are Codex-based.

## NORMALIZATION ADDENDUM (2026-03-21)

- **Feature catalog**: 194 snippet files (net +5 since 2026-03-16 addendum). Two new entries added for phases 016/017.
- **Manual testing playbook**: 200 scenario files. Two new entries added (153, 154) for phases 016/017.
- All `NEW-NNN` provisional markers removed from both catalog and playbook individual files and index files.
- Playbook section renamed from "8. NEW FEATURES" to "8. FEATURES".
- `G-NEW-1`, `G-NEW-2`, `G-NEW-3` proper nouns preserved (evaluation framework feature IDs).
- New feature catalog entries: `16-json-mode-hybrid-enrichment.md` (phase 016), `17-json-primary-deprecation-posture.md` (phase 017).
- New playbook entries: `153-json-mode-hybrid-enrichment.md`, `154-json-primary-deprecation-posture.md`.
- Both index files updated with new entries and cross-reference table rows.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2025-12-01 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../005-architecture-audit/spec.md |
| **Successor** | ../007-code-audit-per-feature-catalog/spec.md |

---

## 2. PROBLEM & PURPOSE

### Problem Statement
As-of 2026-03-08, the historical audit baseline covered 180 features and found 55 genuine undocumented gaps (17 high, 25 medium, 13 low significance). As-of 2026-03-16, the live tree has 189 snippets and includes 14 current entries that were outside the executed March 8 ranges. Without explicit addendum accounting, completeness claims become ambiguous.

### Purpose
Preserve the March 8 snapshot as historical record while extending documentation with an explicit March 16 current-state addendum that tracks live-tree drift, omitted-snippet classification, and follow-up remediation priorities.

---

## 3. SCOPE

### In Scope
- Preserve and reference the 2026-03-08 180-feature historical snapshot
- Audit and classify the 14 omitted current snippets discovered on 2026-03-16
- Validate all `## Source Files` paths exist on disk
- Investigate and document all 55 known undocumented gaps
- Discover any new gaps not found in the prior scan
- Produce remediation manifest with prioritized action items, including addendum follow-up items

### Out of Scope
- Actual remediation edits to snippet files (separate follow-up phase)
- Restructuring the 20-category taxonomy
- Changes to MCP server source code
- Updating the monolithic `.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md` (done after snippet remediation)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Modify | Rewrite for L3 audit scope |
| `tasks.md` | Modify | New task breakdown |
| `plan.md` | Create | L3 implementation plan |
| `checklist.md` | Create | Audit verification checks |
| `decision-record.md` | Create | 3 ADRs |
| `006-feature-catalog/description.json` | Modify | Update level to 3 |
| `006-feature-catalog/scratch/verification-C*.md` | Create | 20 agent outputs |
| `006-feature-catalog/scratch/investigation-X*.md` | Create | 10 agent outputs |
| `scratch/remediation-manifest.md` | Create | Synthesis output |
| `scratch/analysis-summary.md` | Create | Statistics |

---

## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every snippet file verified by at least one agent | 20 verification reports covering all 20 categories |
| REQ-002 | All `## Source Files` paths validated | Zero paths pointing to non-existent files |
| REQ-003 | All 55 known gaps investigated | Each gap classified as CONFIRMED_GAP, NEW_GAP, or FALSE_POSITIVE |
| REQ-004 | Remediation manifest produced | Prioritized action items with P0/P1/P2 classification |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Description accuracy >95% | <10 features with materially inaccurate descriptions |
| REQ-006 | Cross-validation between verification and gap streams | Overlapping findings reconciled |
| REQ-007 | Analysis summary with aggregate statistics | Category-level pass/fail counts |
| REQ-008 | 2026-03-16 omitted-snippet addendum | All 14 omitted snippets explicitly listed and classified with evidence |

---

## 5. SUCCESS CRITERIA

- **SC-001**: All 180 historical-snapshot snippets (2026-03-08) have been read and verified against source code
- **SC-002**: All 55 gaps have a confirmed status (gap/false-positive) with evidence
- **SC-003**: Remediation manifest exists with zero unclassified findings
- **SC-004**: All file paths in existing snippets resolve to real files on disk
- **SC-005**: All 14 omitted current snippets (2026-03-16 addendum) are explicitly classified with remediation status

---

## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | MCP server source (`mcp_server/`) | Verification impossible without source | Source tree exists and is stable |
| Risk | Agent rate limiting (30 concurrent) | Partial results | Stagger launches 3-5s apart |
| Risk | Source files moved since last annotation | False invalid paths | Agents report both invalid and new paths |
| Risk | Context window overflow in agents | Incomplete verification | Partition into manageable chunks per agent |

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Accuracy
- **NFR-A01**: Description accuracy target >95% across all verified features
- **NFR-A02**: 100% of file paths must resolve to existing files

### Coverage
- **NFR-C01**: All 20 historical-snapshot categories verified by at least one agent
- **NFR-C02**: All 55 known gaps addressed (no gap left uninvestigated)
- **NFR-C03**: Current-tree drift documented with explicit omitted-snippet accounting

### Completeness
- **NFR-X01**: Each verification report follows the structured output format
- **NFR-X02**: Remediation manifest covers every finding from both streams

---

## 8. EDGE CASES

### Data Boundaries
- Features with no source files (governance, decisions, flags): Verify special-case markers are correct
- Features with 20+ transitive dependencies: Verify only direct implementation files are relevant

### Error Scenarios
- Agent fails mid-verification: Report covers partial results, remaining features flagged as unverified
- Source file deleted since annotation: Flagged as PATH-VALIDATE P0 in manifest

### State Transitions
- Gap confirmed as already documented: Mark as FALSE_POSITIVE with evidence pointer
- Verification finds new gap not in 55-list: Add as NEW_GAP with full details

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | Historical snapshot: 180 snippet files, ~216 source files, 20 categories |
| Risk | 10/25 | No code changes, documentation-only, reversible |
| Research | 18/20 | Deep source code verification across entire codebase |
| Multi-Agent | 15/15 | 30 concurrent agents in 2 streams |
| Coordination | 12/15 | Cross-stream validation, manifest synthesis |
| **Total** | **75/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Rate limits block agent launches | M | M | Stagger 3-5s apart |
| R-002 | Source code changed during audit | L | L | Snapshot-based verification |
| R-003 | Agent produces incomplete report | M | M | Structured output format enforced |
| R-004 | False positives inflate gap count | L | M | Cross-stream validation in Phase C |

---

## 11. USER STORIES

### US-001: Complete Feature Verification (Priority: P0)

**As a** catalog maintainer, **I want** every feature snippet verified against actual source code, **so that** I can trust the catalog descriptions are accurate.

**Acceptance Criteria**:
1. Given a feature snippet, When an agent reads both the snippet and its source files, Then it produces a structured accuracy report

### US-002: Gap Documentation (Priority: P0)

**As a** catalog maintainer, **I want** all 55 undocumented gaps investigated with draft descriptions, **so that** I can add them to the catalog.

**Acceptance Criteria**:
1. Given a gap from the scan, When an agent reads the source files, Then it produces a confirmed status and draft description

### US-003: Remediation Roadmap (Priority: P1)

**As a** catalog maintainer, **I want** a prioritized remediation manifest, **so that** I can fix issues in order of importance.

**Acceptance Criteria**:
1. Given all agent reports, When findings are synthesized, Then each finding has an action category and priority

### Additional Acceptance Scenarios

1. **Given** the March 8 historical audit is referenced in a current-state doc update, **When** the spec is refreshed, **Then** the 180-snippet snapshot remains clearly labeled as historical rather than current completeness.
2. **Given** omitted live-tree snippets are classified in the March 16 addendum, **When** follow-up remediation is later completed, **Then** the spec records that completion as post-addendum work instead of rewriting the original addendum state.
3. **Given** a validator-repair pass updates spec-folder markdown only, **When** validation is rerun, **Then** the result reports the exact remaining warnings or a clean pass without introducing unrelated scope changes.

---

## 12. OPEN QUESTIONS

- None currently. Historical (2026-03-08) and addendum (2026-03-16) boundaries are now explicit.

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Prior Scan Results**: See `undocumented-features-scan.md`

---

## Merged Section: 016-feature-catalog-code-references

> **Merge note (2026-03-14)**: The content below was originally in the 016 spec document (Level 2, Complete). It documents the code-to-catalog traceability work that is a direct downstream remediation action from 011's audit findings. The 016 spec folder has been absorbed into 011 to reduce folder count.

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
| **Status** | Completed — all 13 checks passed including CHK-012 (2026-03-14) |
| **Created** | 2026-03-14 |
| **Branch** | `main` |
| **Parent Spec** | `022-hybrid-rag-fusion` |
| **Previous Phase** | `008-hydra-db-based-features` |
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
- Spec folder paths (e.g., `specs/007-code-audit-per-feature-catalog`)

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
4. **Given** all `// Feature catalog:` references in scope, **When** validated against feature catalog H1 headings, **Then** zero invalid feature names are found.
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

---

## Phase Navigation

| Field | Value |
|-------|-------|
| **Parent Spec** | ../spec.md |
| **Previous Phase** | ../005-architecture-audit/spec.md |
| **Next Phase** | ../007-code-audit-per-feature-catalog/spec.md |
