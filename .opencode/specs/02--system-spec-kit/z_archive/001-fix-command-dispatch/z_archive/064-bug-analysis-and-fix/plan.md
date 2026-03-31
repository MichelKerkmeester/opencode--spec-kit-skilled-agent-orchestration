---
title: "Implementation Plan [02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/064-bug-analysis-and-fix/plan]"
description: "Implementation plan for systematically addressing ~231 identified issues across system-spec-kit skill and spec_kit commands."
trigger_phrases:
  - "implementation"
  - "plan"
  - "system"
  - "spec"
  - "kit"
  - "064"
  - "bug"
importance_tier: "important"
contextType: "planning"
---
# Implementation Plan: System-Spec-Kit Bug Fix - Technical Approach & Architecture

Implementation plan for systematically addressing ~231 identified issues across system-spec-kit skill and spec_kit commands.

<!-- SPECKIT_TEMPLATE_SOURCE: plan | v1.0 -->

---

<!-- ANCHOR:summary -->
## EXECUTIVE SUMMARY FOR AI AGENTS

### What This Plan Accomplishes

Fix **~231 bugs** across the SpecKit system in **4 phases**:

| Phase | Priority    | Issues | Key Deliverables                                                   |
| ----- | ----------- | ------ | ------------------------------------------------------------------ |
| **1** | P0-Critical | 9      | Missing await, unused config, debug threshold, memory:save command |
| **2** | P1-High     | 47     | AGENTS.md refs, MCP bugs, template contradictions                  |
| **3** | P2-Medium   | 86     | Cross-refs, script bugs, doc gaps                                  |
| **4** | P2-Low      | 89+    | Polish, consistency, naming                                        |

### Critical Decisions Already Made (ADRs)

| ADR         | Decision                    | Rationale                           |
| ----------- | --------------------------- | ----------------------------------- |
| **ADR-001** | Remove `config-loader.js`   | Never imported, dead code           |
| **ADR-002** | Defer ANCHOR implementation | Document as "validation only"       |
| **-**       | Debug threshold = 3         | More conservative, matches SKILL.md |

### Files Most Frequently Modified

```
.opencode/skill/system-spec-kit/
├── mcp_server/context-server.js     # T101, T012, T013 (await, race, params)
├── mcp_server/lib/errors.js         # T103 (E429)
├── mcp_server/lib/config-loader.js  # T001 (DELETE)
├── SKILL.md                         # T002, T005, T030, T031 (docs)
└── shared/embeddings.js             # T104 (rate limiting)

.opencode/command/spec_kit/
├── debug.md                         # T003 (threshold)
└── memory_save.md                   # T004 (CREATE)
```

### Execution Order (Strict)

```
Phase 1 (BLOCKING) → Phase 2 → Phase 3 → Phase 4
     ↓
     └── Cannot proceed to Phase 2 until ALL Phase 1 tasks [x]
```

---

<!-- /ANCHOR:summary -->
## 1. OBJECTIVE

### Metadata
- **Category**: Plan
- **Tags**: system-spec-kit, bug-fix, memory-system, mcp-server
- **Priority**: P0
- **Branch**: `064-bug-analysis-and-fix`
- **Date**: 2026-01-15
- **Spec**: See `spec.md` in this folder

### Input
Bug analysis audit + re-analysis identifying ~231 issues across 4 severity levels (see research/research.md).

### Summary
Systematically fix all identified bugs in the system-spec-kit skill and spec_kit commands, prioritizing critical architectural issues and production-breaking defects (missing await in memory_search) before addressing documentation mismatches and minor inconsistencies. Each phase delivers independently verifiable improvements. The full issue inventory is in `research/research.md` and must be treated as the source of truth.

### Technical Context

- **Language/Version**: JavaScript (Node.js), Markdown
- **Primary Dependencies**: better-sqlite3, MCP SDK, embedding APIs
- **Storage**: SQLite (`context-index.sqlite`)
- **Testing**: Manual verification, runtime testing
- **Target Platform**: macOS/Linux (OpenCode CLI)
- **Project Type**: Single-project MCP server with documentation
- **Constraints**: Backward compatibility with existing spec folders and memory files

---

## AI EXECUTION FRAMEWORK

### ⚠️ MANDATORY: AI Agent Behavior Rules

**This section defines how AI agents must interpret and execute this plan.**

#### Plan Interpretation Rules

| Rule                   | Description                                                    |
| ---------------------- | -------------------------------------------------------------- |
| **PHASE ORDER**        | Execute phases 1→2→3→4 sequentially. Never skip phases.        |
| **TASK GRANULARITY**   | Each task in `tasks.md` is atomic. Complete fully before next. |
| **DECISION RESPECT**   | ADRs in `decision-record.md` are FINAL. Do not re-debate.      |
| **VERIFICATION FIRST** | Before claiming task complete, run verification commands.      |
| **EVIDENCE REQUIRED**  | All completion claims must include terminal output evidence.   |

#### Phase Gate Protocol

```
┌─────────────────────────────────────────────────────────────────┐
│ PHASE GATE: Before starting ANY phase                          │
│                                                                 │
│ □ 1. Previous phase 100% complete (all tasks marked [x])       │
│ □ 2. Previous phase checklist items verified                    │
│ □ 3. No regressions introduced (run integration tests)          │
│ □ 4. Git commit made with phase summary                         │
│ □ 5. Ready for next phase (dependencies resolved)               │
└─────────────────────────────────────────────────────────────────┘
```

#### File Modification Protocol

When modifying files per this plan:

1. **READ** the file section completely before editing
2. **BACKUP** critical files: `cp file.js scratch/file.js.bak`
3. **EDIT** one logical change at a time
4. **VERIFY** syntax: `node --check file.js` for JS files
5. **TEST** behavior hasn't regressed
6. **COMMIT** with descriptive message

#### Decision Escalation

If during execution you encounter:
- Contradiction between plan and actual code → **STOP**, document in scratch/
- Missing file referenced in plan → **STOP**, clarify with user
- Unexpected behavior after fix → **REVERT** and document

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

**GATE: Must pass before each phase begins. Re-check after phase completion.**

### Definition of Ready (DoR)
- [x] Problem statement clear; scope documented (see spec.md)
- [x] All ~231 issues categorized and prioritized
- [x] File locations identified for each issue
- [x] Decision points identified (config, ANCHOR, debug threshold)

### Definition of Done (DoD)
- [ ] All 9 CRITICAL issues resolved
- [ ] All 47 HIGH priority issues resolved
- [ ] All 86 MEDIUM priority issues resolved
- [ ] Documentation updated to match implementation
- [ ] No regression in existing functionality

### AI Implementation Workflow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TASK EXECUTION FLOWCHART                            │
│                                                                             │
│   ┌─────────────┐                                                           │
│   │ Start Task  │                                                           │
│   └──────┬──────┘                                                           │
│          │                                                                  │
│          ▼                                                                  │
│   ┌─────────────────────────────────────────┐                               │
│   │ 1. READ task description completely     │                               │
│   │    - All bullets, acceptance criteria   │                               │
│   │    - Step-by-step execution guide       │                               │
│   └──────┬──────────────────────────────────┘                               │
│          │                                                                  │
│          ▼                                                                  │
│   ┌─────────────────────────────────────────┐                               │
│   │ 2. VERIFY affected files exist          │                               │
│   │    - ls -la [file path]                 │                               │
│   │    - Read relevant sections             │                               │
│   └──────┬──────────────────────────────────┘                               │
│          │                                                                  │
│          ▼                                                                  │
│   ┌─────────────────────────────────────────┐    ┌─────────────────────┐    │
│   │ 3. File matches expected state?         │───▶│ NO: STOP, clarify   │    │
│   └──────┬──────────────────────────────────┘    │ with user           │    │
│          │ YES                                   └─────────────────────┘    │
│          ▼                                                                  │
│   ┌─────────────────────────────────────────┐                               │
│   │ 4. BACKUP if deleting/modifying         │                               │
│   │    - cp file scratch/file.bak           │                               │
│   └──────┬──────────────────────────────────┘                               │
│          │                                                                  │
│          ▼                                                                  │
│   ┌─────────────────────────────────────────┐                               │
│   │ 5. EXECUTE changes                      │                               │
│   │    - One file at a time                 │                               │
│   │    - Use precise line numbers           │                               │
│   └──────┬──────────────────────────────────┘                               │
│          │                                                                  │
│          ▼                                                                  │
│   ┌─────────────────────────────────────────┐                               │
│   │ 6. VERIFY syntax (for code files)       │                               │
│   │    - node --check file.js               │                               │
│   └──────┬──────────────────────────────────┘                               │
│          │                                                                  │
│          ▼                                                                  │
│   ┌─────────────────────────────────────────┐                               │
│   │ 7. RUN verification command             │                               │
│   │    - Command from task description      │                               │
│   │    - Compare output to expected         │                               │
│   └──────┬──────────────────────────────────┘                               │
│          │                                                                  │
│          ▼                                                                  │
│   ┌─────────────────────────────────────────┐    ┌─────────────────────┐    │
│   │ 8. Verification passed?                 │───▶│ NO: Debug or revert │    │
│   └──────┬──────────────────────────────────┘    └─────────────────────┘    │
│          │ YES                                                              │
│          ▼                                                                  │
│   ┌─────────────────────────────────────────┐                               │
│   │ 9. UPDATE tasks.md                      │                               │
│   │    - Mark [x] with evidence             │                               │
│   │    - Add completion date                │                               │
│   └──────┬──────────────────────────────────┘                               │
│          │                                                                  │
│          ▼                                                                  │
│   ┌─────────────┐                                                           │
│   │  Next Task  │                                                           │
│   └─────────────┘                                                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Rollback Guardrails
- **Stop Signals**: New critical bug introduced, data corruption, MCP server crash
- **Recovery Procedure**: Git revert specific commits, restore database backup

### Constitution Check (Complexity Tracking)

No complexity violations anticipated - fixes are within existing architecture.

<!-- /ANCHOR:quality-gates -->
---

## 3. PROJECT STRUCTURE

### Architecture Overview

The system-spec-kit is an MCP server providing memory management capabilities. Key components:

```
.opencode/skill/system-spec-kit/
  mcp_server/
    context-server.js       # Main MCP server
    lib/
      attention-decay.js    # Decay calculations
      checkpoints.js        # Checkpoint management
      co-activation.js      # Memory co-activation
      config-loader.js      # Config loading (UNUSED)
      memory-parser.js      # ANCHOR parsing
      retry-manager.js      # Retry logic
      trigger-matcher.js    # Trigger matching
      vector-index.js       # Embedding storage
    configs/
      search-weights.json   # Configuration (MOSTLY UNUSED)
  shared/
    embeddings.js           # Embedding utilities
    embeddings/
      factory.js            # Embedding model factory
  scripts/
    generate-context.js     # Memory save script
    semantic-summarizer.js  # Summarization
  templates/
    *.md                    # SpecKit templates
  references/
    debugging/
      troubleshooting.md    # Debugging docs
    memory/
      memory_system.md      # Memory system docs
```

### Documentation Structure

```
.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/064-bug-analysis-and-fix
  spec.md              # Feature specification
  plan.md              # This file
  decision-record.md   # Architectural decisions
  checklist.md         # Validation checklist (Level 2+)
  scratch/             # Temporary work files
  memory/              # Session context
```

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Critical Fixes (HARD BLOCKERS)

**Goal**: Resolve all 9 CRITICAL issues that represent architectural failures or production-breaking defects.

**Duration**: 2-3 days

**Issues Addressed**:

#### 1.1 Config System Decision (REQ-FUNC-001)

**Location**: `mcp_server/configs/search-weights.json`, `lib/config-loader.js`

**Problem**:
- `config-loader.js` exists but is never imported by any module
- 8 of 10 config sections are never used
- Only `maxTriggersPerMemory` and `smartRanking` are actually referenced

**Options**:
- **Option A**: Implement proper config loading (add imports to all modules)
- **Option B**: Remove `config-loader.js` and document that config is for future use
- **Option C**: Remove unused config sections, keep only what's used

**Recommended**: Option 1 - remove unused config infrastructure, keep only used sections (aligns with ADR-001)

**Tasks**:
1. Audit which modules use which config sections
2. Remove unused sections from `search-weights.json`
3. Delete `config-loader.js` (no imports exist)
4. Add constants for fixed values if needed
5. Update documentation to reflect actual state
6. Verify no behavior change

#### 1.2 ANCHOR System Decision (REQ-FUNC-002)

**Location**: `mcp_server/lib/memory-parser.js`, `context-server.js`, database schema

**Problem**:
- `anchor_id` column in database is NEVER populated
- ANCHOR tags are validated in `parse_memory_file` but IDs never extracted
- `indexMemory` call never passes `anchorId` parameter
- Documented "93% token savings" is false advertising

**Options**:
- **Option A**: Fully implement ANCHOR functionality
  - Extract anchor IDs during parsing
  - Store in database with section content
  - Implement anchor-based retrieval API
- **Option B**: Remove ANCHOR documentation claims
  - Update SKILL.md to remove false claims
  - Keep ANCHOR validation for future use
  - Document as "planned feature"

**Recommended**: Option B for now, Option A as separate future feature (record in ADR-002)

**Tasks**:
1. Update SKILL.md to remove "93% token savings" claim
2. Document ANCHOR as "validated but not indexed"
3. Create future feature spec for full ANCHOR implementation
4. Verify ANCHOR validation still works

#### 1.3 Debug Threshold Consistency (REQ-FUNC-003)

**Location**: `SKILL.md` lines 543, 608; `references/debugging/debug.md` line 237

**Problem**: SKILL.md says "3+ failed fix attempts", debug.md says "2+ fix attempts"

**Decision**: Standardize on **3+ failed attempts** (matches SKILL.md, more conservative)

**Tasks**:
1. Update `debug.md` line 237 to say "3+ failed fix attempts"
2. Search all files for debug threshold references
3. Update any other inconsistent references
4. Verify consistency

#### 1.4 Memory Save Command (REQ-FUNC-004)

**Location**: SKILL.md lines 109, 421-426, 787-788; missing `.opencode/command/spec_kit/memory_save.md`

**Problem**: SKILL.md references `/memory:save` but command file doesn't exist

**Options**:
- **Option A**: Create the missing command file
- **Option B**: Update SKILL.md to reference existing `generate-context.js` workflow

**Recommended**: Option A - create command for consistency with other commands

**Tasks**:
1. Create `.opencode/command/spec_kit/memory_save.md`
2. Model on existing command structure
3. Reference `generate-context.js` as implementation
4. Verify command is discoverable

#### 1.5 Fix Missing await in memory_search (REQ-FUNC-031)

**Location**: `mcp_server/context-server.js` lines 1085, 1140, 1161

**Problem**: `formatSearchResults()` is async but called without await, returning Promises when `includeContent=true`.

**Root Cause Analysis**:
- `formatSearchResults` was originally synchronous
- When `includeContent` feature was added, the function became async to read file contents
- The callers were never updated to await the result

**Exact Code Changes Required**:

```javascript
// Line 1085 - BEFORE:
return formatSearchResults(results, 'multi-concept', includeContent);
// Line 1085 - AFTER:
return await formatSearchResults(results, 'multi-concept', includeContent);

// Line 1140 - BEFORE:
return formatSearchResults(filteredResults, 'hybrid', includeContent);
// Line 1140 - AFTER:
return await formatSearchResults(filteredResults, 'hybrid', includeContent);

// Line 1161 - BEFORE:
return formatSearchResults(results, 'vector', includeContent);
// Line 1161 - AFTER:
return await formatSearchResults(results, 'vector', includeContent);
```

**Tasks**:
1. Add `await` before all `formatSearchResults()` calls
2. Verify containing function is async (should already be)
3. Add regression test for `includeContent=true` result shape
4. Verify no Promise objects leak into tool responses

**Verification Command**:
```bash
grep -n "return.*formatSearchResults" .opencode/skill/system-spec-kit/mcp_server/context-server.js | grep -v "await"
# Expected: No output (all calls now have await)
```

#### 1.6 Standardize CHANGELOG Version Format (REQ-FUNC-035)

**Location**: `CHANGELOG.md` and any versioned docs (see research/research.md)

**Problem**: Version formats conflict (`[1.7.1]` vs `17.1.0`).

**Tasks**:
1. Choose canonical version format and document it
2. Update mismatched entries
3. Verify references across docs match the canonical format

#### 1.7 Define and Document E429 Error Code (REQ-FUNC-032)

**Location**: `mcp_server/lib/errors.js`, references docs

**Problem**: `E429` is thrown but not defined or documented.

**Tasks**:
1. Add `E429` to ErrorCodes enum with description
2. Document `E429` in references
3. Add tests to ensure code registry matches usage

#### 1.8 Add Rate Limiting for Batch Embedding Calls (REQ-FUNC-033)

**Location**: Embedding batch API callers (see research/research.md)

**Problem**: No rate limiting for batch calls; provider throttling risk.

**Tasks**:
1. Identify batch call sites
2. Implement rate limiting/backoff
3. Add logging and tests for throttling behavior

#### 1.9 Enforce vec_memories Cleanup (REQ-FUNC-034)

**Location**: Database schema/migrations

**Problem**: Missing ON DELETE CASCADE leads to orphaned vec_memories rows.

**Tasks**:
1. Add ON DELETE CASCADE or equivalent cleanup
2. Provide migration path for existing DBs
3. Verify deletion removes vec_memories rows

---

### Phase 2: High Priority Fixes (Documentation & MCP Bugs)

**Goal**: Fix all 47 HIGH priority issues including doc mismatches, MCP server bugs, and re-analysis findings.

**Duration**: 3-4 days

**Dependencies**: Phase 1 decisions inform some Phase 2 fixes

#### 2.1 Documentation Mismatches

| Issue                       | Location                                           | Fix                                            |
| --------------------------- | -------------------------------------------------- | ---------------------------------------------- |
| AGENTS.md reference         | SKILL.md lines 14, 100, 288, 303, 420-423, 714-715 | Update to correct filename (AGENTS.md)         |
| Decay formula wrong         | troubleshooting.md                                 | Document turn-based decay, not time-based      |
| Embedding model hardcoded   | vector-index.js:861,912                            | Record actual model from factory               |
| attention-decay return type | attention-decay.js:198                             | Return object with `decayedCount`              |
| Failure Pattern #19         | implement.md:16-18                                 | Remove reference (only 1-18 exist)             |
| Re-embedding trigger doc    | memory_system.md                                   | Update to "full content" not "title change"    |
| searchBoost missing         | Documentation                                      | Add tier multipliers (3.0, 2.0, 1.5, 1.0, 0.5) |

**Tasks per issue**:
1. Locate the file
2. Make the correction
3. Verify no other references need update
4. Test behavior matches documentation

#### 2.2 MCP Server Bugs

| Issue                   | Location                    | Fix                                                   |
| ----------------------- | --------------------------- | ----------------------------------------------------- |
| Embedding warmup race   | context-server.js:2514-2522 | Add proper async handling                             |
| Missing MCP parameters  | context-server.js:1849-1920 | Expose `includeWorkingMemory`, `sessionId`            |
| Null check missing      | retry-manager.js:227-238    | Add DB null check before `mark_as_failed`             |
| Memory leak in triggers | trigger-matcher.js:62-129   | Clear regex cache periodically                        |
| co-activation.init()    | co-activation.js            | Consistent error handling (throw or return, not both) |

**Tasks per issue**:
1. Review the problematic code
2. Implement fix with proper error handling
3. Add inline comment explaining the fix
4. Test the edge case

#### 2.3 Template Contradictions

| Issue                           | Location         | Fix                                        |
| ------------------------------- | ---------------- | ------------------------------------------ |
| Level requirement contradiction | plan.md:368-378  | Clarify Level 2+ requirement vs ALL levels |
| Level requirement contradiction | tasks.md:335-346 | Same fix as plan.md                        |
| Missing "Files to Change"       | spec.md template | Add section per level_specifications.md    |

---

### Phase 3: Medium Priority Fixes (Cross-References & Scripts)

**Goal**: Fix all 86 MEDIUM priority issues.

**Duration**: 2-3 days

**Dependencies**: Phases 1-2 completed

#### 3.1 Cross-Reference Errors

| Issue              | Location           | Fix                                              |
| ------------------ | ------------------ | ------------------------------------------------ |
| Format notation    | complete.md:100    | Fix `[1] [2] [3] [all] [skip]` reference         |
| Step numbering     | plan.md:248 vs 315 | Resolve Phase 5 vs Phase 6 discrepancy           |
| Missing tool       | resume.md:421-427  | Add `checkpoint_restore` to tool table           |
| Undocumented phase | research/research.md        | Document Phase 3 (Prior Work Search) in SKILL.md |
| Missing YAML refs  | handover.md        | Add YAML asset file references                   |

#### 3.2 Script Bugs

| Issue             | Location                       | Fix                                  |
| ----------------- | ------------------------------ | ------------------------------------ |
| Permissive regex  | generate-context.js:60-64      | Stricter spec folder path validation |
| Hardcoded path    | semantic-summarizer.js:467-469 | Remove `/Users/...` hardcoded path   |
| TTL cleanup       | checkpoints.js:223-231         | Consider last-used date in cleanup   |
| Wrong params      | hybrid-search.js README        | Document actual parameter names      |
| Missing try-catch | template-renderer.js:120-125   | Add template not found handling      |

#### 3.3 Documentation Gaps

| Issue                | Location | Fix                                       |
| -------------------- | -------- | ----------------------------------------- |
| shared/ undocumented | SKILL.md | Add section documenting shared/ directory |
| config/ undocumented | SKILL.md | Add section documenting config/ directory |

---

### Phase 4: Low Priority Cleanup

**Goal**: Address consistency and style issues.

**Duration**: 1-2 days

**Dependencies**: Phases 1-3 completed

**Issues**:
1. Template source markers on line 5 instead of line 1 (6 templates)
2. Inconsistent "What would you like to do next?" endings
3. Module count wrong in README (29 vs 28)
4. snake_case vs camelCase in config-loader defaults
5. Redundant BigInt conversions in checkpoints.js
6. Logging inconsistency (console.error for info messages)
7. MAX_CHECKPOINTS and CHECKPOINT_TTL_DAYS not documented
8. Git command timeout too short (1 second)
9. Missing instructional footers in 3 templates
10. Phase 2.5 positioning error in complete.md

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

### Test Pyramid

```
        /\
       /E2E\      <- Manual end-to-end verification
      /------\
     /  INTEG \   <- MCP tool invocation tests
    /----------\
   /   UNIT     \  <- Individual fix verification
  /--------------\
```

### Unit Tests (Per Fix)

Each fix should be verified individually:
- Config: Change value, verify behavior changes
- ANCHOR: Verify validation still works
- Debug threshold: Search all docs, verify consistency
- MCP fixes: Trigger edge case, verify no crash
- memory_search: includeContent=true returns resolved results
- Error codes: registry matches usage (including E429)
- Batch embedding: rate limiting applied under load
- vec_memories: deletion removes related vector rows

### Integration Tests

- Memory save workflow: Create memory, save, verify indexed
- Search workflow: Index memory, search, verify results
- Checkpoint workflow: Save, restore, verify state

### End-to-End Tests

- Full spec folder creation with all templates
- Memory context loading and saving
- Debug delegation workflow

### Test Data

- Sample memory files with ANCHOR tags
- Sample config with modified values
- Edge case inputs (null, undefined, empty)

<!-- /ANCHOR:testing -->
---

## 6. SUCCESS METRICS

### Functional Metrics

| Metric                   | Target       | Measurement Method  |
| ------------------------ | ------------ | ------------------- |
| CRITICAL issues resolved | 4/4 (100%)   | Manual verification |
| HIGH issues resolved     | 47/47 (100%) | Manual verification |
| MEDIUM issues resolved   | 86/86 (100%) | Manual verification |
| LOW issues resolved      | 10/10 (100%) | Manual verification |

### Quality Metrics

| Metric              | Target | Measurement Method    |
| ------------------- | ------ | --------------------- |
| Doc-code mismatches | 0      | Cross-reference audit |
| MCP crash rate      | 0      | Error monitoring      |
| Regression bugs     | 0      | Full workflow test    |

---

## 7. RISKS & MITIGATIONS

### Risk Matrix

| Risk ID | Description                             | Impact | Likelihood | Mitigation Strategy              | Owner       |
| ------- | --------------------------------------- | ------ | ---------- | -------------------------------- | ----------- |
| R-001   | Config removal breaks hidden dependency | High   | Low        | Thorough grep before removal     | Engineering |
| R-002   | ANCHOR removal disappoints users        | Low    | Low        | Document as future feature       | Engineering |
| R-003   | MCP fixes introduce regressions         | Medium | Medium     | Incremental testing              | Engineering |
| R-004   | Template changes break existing specs   | Medium | Low        | Backward compatible changes only | Engineering |

### Rollback Plan

- **Rollback Trigger**: Any fix causes new bug or regression
- **Rollback Procedure**:
  1. Identify problematic commit via git bisect
  2. Git revert the specific commit
  3. Restart MCP server
  4. Verify functionality restored
- **Database Backup**: Before any schema changes, backup `context-index.sqlite`

---

<!-- ANCHOR:dependencies -->
## 8. DEPENDENCIES

### Internal Dependencies

| Dependency                  | Type     | Owner       | Status  | Timeline | Impact if Blocked      |
| --------------------------- | -------- | ----------- | ------- | -------- | ---------------------- |
| Decision on config system   | Internal | Engineering | Pending | Phase 1  | Blocks config fixes    |
| Decision on ANCHOR system   | Internal | Engineering | Pending | Phase 1  | Blocks ANCHOR fixes    |
| Decision on debug threshold | Internal | Engineering | Pending | Phase 1  | Blocks doc consistency |

### External Dependencies

None - all fixes are internal to system-spec-kit.

<!-- /ANCHOR:dependencies -->
---

## 9. COMMUNICATION & REVIEW

### Stakeholders

- **Engineering**: Primary implementer

### Checkpoints

- **Phase 1 Review**: After critical fixes, before Phase 2
- **Phase 2 Review**: After high priority fixes, before Phase 3
- **Final Review**: After all phases complete

---

## 10. FILE CHANGE MATRIX

### Phase 1 Files

| File                                        | Change Type      | Issue                         |
| ------------------------------------------- | ---------------- | ----------------------------- |
| `mcp_server/configs/search-weights.json`    | Modify           | Config cleanup                |
| `mcp_server/lib/config-loader.js`           | Delete or Modify | Config cleanup                |
| `SKILL.md`                                  | Modify           | ANCHOR docs, memory:save refs |
| `references/debugging/debug.md`             | Modify           | Debug threshold               |
| `.opencode/command/spec_kit/memory_save.md` | Create           | Missing command               |

### Phase 2 Files

| File                                      | Change Type | Issue                          |
| ----------------------------------------- | ----------- | ------------------------------ |
| `SKILL.md`                                | Modify      | AGENTS.md refs, multiple fixes |
| `references/debugging/troubleshooting.md` | Modify      | Decay formula                  |
| `mcp_server/lib/vector-index.js`          | Modify      | Embedding model                |
| `mcp_server/lib/attention-decay.js`       | Modify      | Return type                    |
| `.opencode/command/spec_kit/implement.md` | Modify      | Pattern #19                    |
| `references/memory/memory_system.md`      | Modify      | Re-embedding doc               |
| `mcp_server/context-server.js`            | Modify      | Warmup race, params            |
| `mcp_server/lib/retry-manager.js`         | Modify      | Null check                     |
| `mcp_server/lib/trigger-matcher.js`       | Modify      | Memory leak                    |
| `mcp_server/lib/co-activation.js`         | Modify      | Error handling                 |
| `templates/plan.md`                       | Modify      | Level contradiction            |
| `templates/tasks.md`                      | Modify      | Level contradiction            |
| `templates/spec.md`                       | Modify      | Missing section                |

### Phase 3 Files

| File                                     | Change Type | Issue             |
| ---------------------------------------- | ----------- | ----------------- |
| `.opencode/command/spec_kit/complete.md` | Modify      | Format notation   |
| `templates/plan.md`                      | Modify      | Step numbering    |
| `.opencode/command/spec_kit/resume.md`   | Modify      | Tool table        |
| `.opencode/command/spec_kit/research/research/research.md` | Modify      | Phase 3 doc       |
| `.opencode/command/spec_kit/handover.md` | Modify      | YAML refs         |
| `scripts/generate-context.js`            | Modify      | Regex validation  |
| `scripts/semantic-summarizer.js`         | Modify      | Hardcoded path    |
| `mcp_server/lib/checkpoints.js`          | Modify      | TTL cleanup       |
| `shared/hybrid-search.js`                | Modify      | README params     |
| `mcp_server/lib/template-renderer.js`    | Modify      | Try-catch         |
| `SKILL.md`                               | Modify      | Undocumented dirs |

### Phase 4 Files

| File                                     | Change Type | Issue                  |
| ---------------------------------------- | ----------- | ---------------------- |
| 6 template files                         | Modify      | Source marker position |
| Command files                            | Modify      | Ending consistency     |
| `README.md`                              | Modify      | Module count           |
| `mcp_server/lib/config-loader.js`        | Modify      | Naming convention      |
| `mcp_server/lib/checkpoints.js`          | Modify      | BigInt, timeout        |
| Multiple files                           | Modify      | Logging consistency    |
| 3 template files                         | Modify      | Missing footers        |
| `.opencode/command/spec_kit/complete.md` | Modify      | Phase 2.5              |

---

## 11. REFERENCES

### Related Documents

- **Feature Specification**: See `spec.md` for requirements and user stories
- **Decision Record**: See `decision-record.md` for architectural decisions
- **Checklist**: See `checklist.md` for validation (to be created)

### Source Files

- `mcp_server/context-server.js` - Main MCP server
- `SKILL.md` - Primary skill documentation
- All files listed in File Change Matrix above

---

<!--
  PLAN TEMPLATE - TECHNICAL APPROACH & ARCHITECTURE
  - Defines HOW features will be implemented
  - Phases organized by priority and dependencies
  - Success metrics and rollback plans included
-->
#### 2.4 High-Priority Re-Analysis Buckets (NEW)

Use the research inventory as the canonical list and clear all items in each bucket:

1. **MCP Server additions** (null dereferences, missing validation, cache invalidation, startup mutex)
2. **lib/ modules** (JSON.parse error handling, listener cleanup, global state mutation, error propagation)
3. **Scripts** (signal handling, cross-platform paths, race conditions, hardcoded paths)
4. **Commands** (step mismatches, missing tools, YAML/MD divergence)
5. **Templates** (status vocab, "WHEN TO USE", marker positioning, metadata naming)
6. **References** (tool docs, parameter names, tier weights)
7. **shared/** (missing docs, cache collisions)
8. **Integration** (checkpoint_restore documentation, changelog references)
