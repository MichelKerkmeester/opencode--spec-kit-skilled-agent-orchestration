---
title: "Feature Specification: Memory Index TXT File Support [02--system-spec-kit/z_archive/014-memory-index-txt-support/spec]"
description: "Add .txt file indexing support to the Spec Kit Memory memory_index_scan tool to enable command folder documentation (e.g., README.txt) to be discoverable via memory search, whil..."
trigger_phrases:
  - "feature"
  - "specification"
  - "memory"
  - "index"
  - "txt"
  - "spec"
  - "014"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: Memory Index TXT File Support

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

Add `.txt` file indexing support to the Spec Kit Memory `memory_index_scan` tool to enable command folder documentation (e.g., `README.txt`) to be discoverable via memory search, while preserving all existing `.md` file indexing behavior and preventing command invocation side effects.

**Key Decisions**: Unified file discovery (single pass), explicit `.txt` extension filter, command folder safeguards

**Critical Dependencies**: memory-index.ts handler, memory-save.ts validation
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | ✅ Completed |
| **Created** | 2026-02-16 |
| **Completed** | 2026-02-16 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Command folder documentation uses `README.txt` files with frontmatter metadata (title, description, trigger phrases) for structured documentation, but these files are not indexed by `memory_index_scan`, making them invisible to memory search tools. This creates a documentation discovery gap where command usage context exists but cannot be surfaced via the memory system.

### Purpose

Enable `.txt` file indexing in `memory_index_scan` to surface command documentation in memory search results, improving context discovery for slash command usage patterns.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `.txt` extension support to file discovery in `memory_index_scan`
- Extend validation in `memory-save.ts` to accept `.txt` files from allowed paths
- Preserve all existing `.md` file behavior (no regressions)
- Command folder safeguard: ensure `/command/invoke` is NOT triggered by indexing
- Unified discovery: single pass for both `.md` and `.txt` files
- Incremental indexing compatibility (mtime/hash tracking works for `.txt`)

### Out of Scope
- Changing frontmatter parsing logic (already extension-agnostic)
- Modifying embedding generation (already content-based)
- Indexing `.txt` files outside allowed paths (specs/, .opencode/skill/, .opencode/command/)
- Supporting other file extensions (`.rst`, `.adoc`, etc.)
- Changing command invocation behavior

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts` | Modify | Add `.txt` discovery to `findMemoryFiles()`, `findSkillReadmes()`, `findProjectReadmes()` (expanded to include `.opencode/command/` paths) |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts` | Modify | Update path validation regex to accept `.txt` extension |
| `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts` | Modify | Add test coverage for `.txt` indexing |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `.txt` files discovered by scan | `memory_index_scan()` returns `.txt` files from command folders in scan results |
| REQ-002 | `.txt` files pass validation | `memory-save.ts` allows `.opencode/command/**/README.txt` paths without error |
| REQ-003 | No `.md` file regressions | All existing `.md` file indexing tests pass unchanged |
| REQ-004 | Command invocation safeguard | Indexing does NOT trigger `/command/invoke` (read-only file access) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Incremental indexing support | `.txt` files skip re-indexing when mtime/hash unchanged |
| REQ-006 | Test coverage | Vitest tests verify `.txt` discovery and indexing |
| REQ-007 | Documentation update | SKILL.md or memory tool documentation mentions `.txt` support |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `memory_index_scan()` successfully indexes `.opencode/command/spec_kit/README.txt` and returns it in results
- **SC-002**: `memory_search({ query: "spec kit command" })` returns command folder `README.txt` files
- **SC-003**: All existing memory index tests pass (no regressions)
- **SC-004**: Command invocation is NOT triggered during indexing (verified via test or manual inspection)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | memory-save.ts validation | Blocks `.txt` indexing if validation too strict | Audit regex early, add `.txt` to allowed extensions |
| Risk | Command invocation side effect | Could trigger slash commands during scan | Use read-only file operations, add explicit safeguard check |
| Risk | Performance impact | More files = slower scan | Leverage existing incremental indexing (mtime/hash) |
| Risk | Frontmatter parsing | `.txt` files might lack frontmatter | Parsing is already tolerant (returns defaults if missing) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
<!-- ANCHOR:requirements -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Scan time increase <10% when indexing 10 additional `.txt` files
- **NFR-P02**: Incremental indexing skips unchanged `.txt` files (same as `.md`)

### Security
- **NFR-S01**: Only index `.txt` files from allowed paths (specs/, .opencode/skill/, .opencode/command/)
- **NFR-S02**: Read-only file access (no write/execute permissions)

### Reliability
- **NFR-R01**: Parsing errors for `.txt` files do NOT crash the scan (fail gracefully per-file)
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
<!-- /ANCHOR:requirements -->
## 8. EDGE CASES

### Data Boundaries
- Empty `.txt` file: Should index with empty content (no crash)
- `.txt` file without frontmatter: Should index with default metadata
- Very large `.txt` file (>1MB): Should index (no size limit in current code)

### Error Scenarios
- Invalid UTF-8 encoding: Should fail gracefully for that file, continue scan
- Permission denied on `.txt` file: Should log warning, continue scan
- `.txt` file in disallowed path (e.g., root `/tmp/`): Should skip (validation rejects)
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 12/25 | Files: 2-3, LOC: ~50-100, Systems: 1 (memory indexing) |
| Risk | 15/25 | No auth, API boundary (MCP), potential side effects (command invocation) |
| Research | 8/20 | Moderate: understand command folder structure and invocation flow |
| Multi-Agent | 0/15 | Single workstream |
| Coordination | 5/15 | Low: 2 files in same handler module |
| **Total** | **40/100** | **Level 3 (architectural decision)** |
<!-- /ANCHOR:complexity -->

**Justification for Level 3**: While scope is small, this changes the indexing subsystem's core file discovery behavior and introduces a new file extension, requiring architectural documentation and risk mitigation (command invocation safeguard).

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Command invocation triggered by indexing | H | L | Verify file operations are read-only, add test |
| R-002 | Performance regression on large repos | M | M | Use incremental indexing (already implemented) |
| R-003 | Frontmatter parsing fails for `.txt` | L | L | Parser already tolerant, add fallback test |
| R-004 | Path validation too permissive | M | L | Explicit allow-list: specs/, .opencode/skill/, .opencode/command/ |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Index Command Documentation (Priority: P0)

**As a** developer using the memory system, **I want** command folder `README.txt` files indexed, **so that** I can discover slash command usage patterns via memory search.

**Acceptance Criteria**:
1. Given a `README.txt` in `.opencode/command/spec_kit/`, When I run `memory_index_scan()`, Then the file appears in scan results
2. Given indexed command documentation, When I run `memory_search({ query: "spec kit plan" })`, Then `README.txt` content is returned with trigger phrase matches

---

### US-002: No Regressions for Markdown (Priority: P0)

**As a** spec kit user, **I want** all existing `.md` file indexing to work unchanged, **so that** I don't lose current functionality.

**Acceptance Criteria**:
1. Given existing `.md` memory files, When I run `memory_index_scan()`, Then all `.md` files are indexed as before
2. Given existing vitest tests for `.md` indexing, When I run tests, Then all pass without modification

---

### US-003: Command Invocation Safety (Priority: P0)

**As a** system operator, **I want** indexing to never trigger slash commands, **so that** scan operations remain side-effect-free.

**Acceptance Criteria**:
1. Given a command folder with `README.txt`, When `memory_index_scan()` runs, Then no command invocation occurs
2. Given file read operations, When indexing `.txt` files, Then only read permissions are used (no execute/write)

---

### US-004: Incremental Indexing Efficiency (Priority: P1)

**As a** developer running frequent scans, **I want** unchanged `.txt` files skipped, **so that** scan performance remains fast.

**Acceptance Criteria**:
1. Given an indexed `.txt` file with unchanged mtime, When I run `memory_index_scan({ incremental: true })`, Then the file is skipped (fast-path)
2. Given scan results, When I inspect `incremental.fast_path_skips`, Then it includes skipped `.txt` files
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- **Q1**: Should `.txt` files be indexed with reduced importance weight (similar to READMEs)? **Answer**: Yes, follow README precedent (importance 0.3)
- **Q2**: Should we support `.txt` files outside `.opencode/command/`? **Answer**: Yes, also allow in specs/ and .opencode/skill/ for consistency
- **Q3**: Do we need a feature flag for `.txt` indexing? **Answer**: No, low-risk additive change
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Technical Research**: See `research/research.md`

---

<!--
LEVEL 3 SPEC (~220 lines)
- Core + L2 + L3 addendums
- Executive Summary, Risk Matrix, User Stories
- Full Complexity Assessment
-->
