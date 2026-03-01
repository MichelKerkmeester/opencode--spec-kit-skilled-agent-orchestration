---
title: "Implementation Plan: Memory Index TXT File Support [131-memory-index-txt-support/plan]"
description: "Extend the memory indexing subsystem (memory-index.ts, memory-save.ts) to discover and index .txt files alongside .md files. The implementation adds .txt extension checks to fou..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "memory"
  - "index"
  - "txt"
  - "131"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Memory Index TXT File Support

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript 5.x, Node.js 18+ |
| **Framework** | MCP Server (Model Context Protocol) |
| **Storage** | SQLite (better-sqlite3), sqlite-vec for embeddings |
| **Testing** | Vitest |

### Overview
Extend the memory indexing subsystem (`memory-index.ts`, `memory-save.ts`) to discover and index `.txt` files alongside `.md` files. The implementation adds `.txt` extension checks to four file discovery functions and updates path validation to accept `.txt` from allowed paths. All changes are additive—no `.md` behavior is modified.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md)
- [x] Success criteria measurable (SC-001 through SC-004)
- [x] Dependencies identified (memory-save.ts validation)

### Definition of Done
- [x] All acceptance criteria met (REQ-001 through REQ-007)
- [x] Tests passing (existing + new `.txt` tests)
- [x] Docs updated (spec/plan/tasks/decision-record.md)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Layered Architecture: MCP Tool Layer → Handler Layer → File Discovery → Indexing Logic

### Key Components
- **memory-index.ts**: File discovery functions (`findMemoryFiles()`, `findSkillReadmes()`, `findProjectReadmes()` - expanded to include `.opencode/command/` paths)
- **memory-save.ts**: Path validation (`indexMemoryFile()` entry guard)
- **memory-parser.ts**: Frontmatter extraction (already extension-agnostic)
- **incremental-index.ts**: Mtime/hash tracking (already path-agnostic)

### Data Flow
1. `memory_index_scan()` invoked via MCP
2. File discovery functions collect `.md` and `.txt` paths
3. Validation checks path + extension
4. Parser extracts frontmatter (title, triggers, content)
5. Embedding generated from content
6. SQLite stores metadata + embedding
7. Incremental tracker updates mtime/hash
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Discovery Functions (Core)
- [x] Update `findMemoryFiles()`: Add `.txt` extension check for `specs/**/memory/` paths
- [x] Update `findSkillReadmes()`: Add `.txt` support (e.g., `README.txt` in skill dirs)
- [x] Update `findProjectReadmes()`: Expand to discover `README.{md,txt}` including `.opencode/command/` paths

### Phase 2: Validation Update
- [x] Update `memory-save.ts` path validation regex to accept `.txt`
- [x] Ensure allowed paths remain restricted: specs/, .opencode/skill/, .opencode/command/

### Phase 3: Testing & Verification
- [x] Add vitest test: index `.txt` file from command folder
- [x] Add vitest test: verify incremental indexing skips unchanged `.txt`
- [x] Add vitest test: ensure command invocation does NOT occur
- [x] Run full test suite to verify no `.md` regressions
- [x] Manual test: index `.opencode/command/spec_kit/README.txt`, search for "spec kit plan"
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | File discovery functions (return `.txt` paths) | Vitest |
| Integration | End-to-end indexing (scan → save → search) | Vitest + test fixtures |
| Manual | Command invocation check (no side effects) | Run scan, verify no command triggers |
| Regression | All existing `.md` tests pass | Vitest (existing suite) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| memory-save.ts validation | Internal | Green | Must update regex before `.txt` files can index |
| Frontmatter parser | Internal | Green | Already extension-agnostic (no changes needed) |
| Incremental indexing | Internal | Green | Already path-agnostic (works for `.txt`) |
| Command invocation logic | Internal | Green | Must verify read-only operations (no execute) |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: If `.txt` indexing causes command invocations or crashes
- **Procedure**: Revert commits to memory-index.ts and memory-save.ts, redeploy MCP server
<!-- /ANCHOR:rollback -->

---

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Discovery) ──────┐
                          ├──► Phase 3 (Testing)
Phase 2 (Validation) ─────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Discovery | None | Testing |
| Validation | None | Testing |
| Testing | Discovery, Validation | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Discovery Functions | Low | 1-2 hours |
| Validation Update | Low | 30 minutes |
| Testing & Verification | Medium | 2-3 hours |
| **Total** | | **4-6 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup SQLite database (if testing in production)
- [ ] Feature can be reverted via code rollback (no schema changes)
- [ ] No data migrations (additive only)

### Rollback Procedure
1. Revert commits to memory-index.ts and memory-save.ts
2. Restart MCP server to reload handlers
3. Run `memory_index_scan({ force: true })` to re-index without `.txt` files
4. Verify search results no longer include `.txt` files

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Delete `.txt` entries from memories table (`DELETE FROM memories WHERE file_path LIKE '%.txt'`)
<!-- /ANCHOR:enhanced-rollback -->

---

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────────────┐     ┌─────────────────────┐
│  Phase 1: Discovery │────►│  Phase 3: Testing   │
│  (4 functions)      │     │  (unit + e2e)       │
└─────────────────────┘     └─────────────────────┘
                             ▲
┌─────────────────────┐     │
│  Phase 2: Validation│─────┘
│  (regex update)     │
└─────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Discovery Functions | None | `.txt` file paths | Testing |
| Validation Update | None | Path acceptance | Testing |
| Unit Tests | Discovery, Validation | Test coverage | None |
| E2E Tests | Discovery, Validation | Verification | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Discovery Functions** - 1-2 hours - CRITICAL
2. **Validation Update** - 30 minutes - CRITICAL
3. **E2E Testing** - 1-2 hours - CRITICAL

**Total Critical Path**: 3-4.5 hours

**Parallel Opportunities**:
- Unit tests can be written while implementing discovery functions
- Documentation updates can occur during testing phase
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Discovery Complete | All 4 functions return `.txt` paths | Phase 1 end |
| M2 | Validation Passes | `.txt` files accepted by memory-save.ts | Phase 2 end |
| M3 | Testing Green | All tests pass, no regressions | Phase 3 end |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Unified File Discovery (Single Extension Check)

**Status**: Accepted

**Context**: We need to add `.txt` support to file discovery functions. Options: (A) Separate discovery paths for `.md` and `.txt`, (B) Unified extension check in existing functions.

**Decision**: Unified extension check—modify existing discovery functions to accept both `.md` and `.txt` extensions in a single pass.

**Consequences**:
- **Positive**: Simpler code, single traversal, easier to maintain
- **Positive**: Consistent behavior for both file types
- **Negative**: Discovery functions become slightly more complex (mitigated by extension array)

**Alternatives Rejected**:
- **Separate discovery paths**: Would duplicate directory traversal logic, harder to maintain

---

### ADR-002: Command Folder Safeguard Strategy

**Status**: Accepted

**Context**: Indexing command folder `README.txt` files might trigger slash command invocation if file paths are executed rather than read.

**Decision**: Use read-only file operations (`fs.readFileSync`, `fs.promises.readFile`) and verify no execute permissions are used. Add explicit test to ensure command invocation does NOT occur during indexing.

**Consequences**:
- **Positive**: Prevents side effects, maintains indexing as pure read operation
- **Positive**: Test coverage provides regression protection
- **Negative**: Requires manual verification during testing (mitigated by automated test)

**Alternatives Rejected**:
- **Exclude command folders entirely**: Would defeat the purpose (we want to index these docs)
- **Feature flag**: Premature—low risk change doesn't warrant flag overhead

---

### ADR-003: Path Validation Extension

**Status**: Accepted

**Context**: `memory-save.ts` currently validates paths with regex requiring `.md` extension. Must allow `.txt` while maintaining security boundaries.

**Decision**: Update regex to accept `.txt` extension only for allowed paths (specs/, .opencode/skill/, .opencode/command/). Use explicit OR condition: `\.(md|txt)$`.

**Consequences**:
- **Positive**: Minimal change, preserves existing validation logic
- **Positive**: Security boundary unchanged (path prefixes still enforced)
- **Negative**: Regex becomes slightly longer (negligible)

**Alternatives Rejected**:
- **Remove extension check entirely**: Would allow arbitrary file types (security risk)
- **Separate validation function for `.txt`**: Code duplication, harder to maintain

---

<!--
LEVEL 3 PLAN (~270 lines)
- Core + L2 + L3 addendums
- Dependency graphs, milestones
- Architecture decision records
-->
