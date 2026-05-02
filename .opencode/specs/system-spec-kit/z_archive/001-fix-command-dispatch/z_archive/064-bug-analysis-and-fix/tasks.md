---
title: "Tasks: SpecKit Bug [system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/064-bug-analysis-and-fix/tasks]"
description: "Comprehensive task breakdown for fixing ~231 identified issues across the SpecKit system, organized by priority and phase."
trigger_phrases:
  - "tasks"
  - "speckit"
  - "bug"
  - "analysis"
  - "and"
  - "064"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: SpecKit Bug Analysis and Fix - Implementation Breakdown

Comprehensive task breakdown for fixing ~231 identified issues across the SpecKit system, organized by priority and phase.

<!-- SPECKIT_TEMPLATE_SOURCE: tasks | v2.2 -->

---

<!-- ANCHOR:notation -->
## QUICK REFERENCE FOR AI AGENTS

### Critical Path (Must Complete First)

| Task     | Priority | One-Line Summary                               | Key File                           |
| -------- | -------- | ---------------------------------------------- | ---------------------------------- |
| **T101** | P0       | Add `await` to 3 `formatSearchResults()` calls | `context-server.js:1085,1140,1161` |
| **T001** | P0       | Delete unused `config-loader.js`               | `mcp_server/lib/config-loader.js`  |
| **T003** | P0       | Change "2+" to "3+" in debug.md line 232       | `command/spec_kit/debug.md:232`    |
| **T004** | P0       | Create `memory_save.md` command file           | `command/spec_kit/memory_save.md`  |
| **T103** | P0       | Add E429 to ErrorCodes enum                    | `mcp_server/lib/errors.js`         |

### Most Common Verification Commands

```bash
# Check for broken references
grep -r "AGENTS.md" .opencode/skill/system-spec-kit/ --include="*.md" | wc -l  # Should be 0

# Verify await fix
grep -c "return await formatSearchResults" .opencode/skill/system-spec-kit/mcp_server/context-server.js  # Should be 3

# Verify threshold consistency
grep -rn "failed.*attempt" .opencode/ --include="*.md" | grep -v "3" | wc -l  # Should be 0

# Check syntax after edits
node --check .opencode/skill/system-spec-kit/mcp_server/context-server.js  # No errors
```

### Scratch Directory Usage

```bash
# Place ALL temporary files here:
mkdir -p .opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/064-bug-analysis-and-fix/scratch

# Examples of what goes in scratch/:
scratch/config-loader.js.bak     # Backups before deletion
scratch/test-output.log          # Test run outputs
scratch/debug-notes.md           # Investigation notes
```

---

<!-- /ANCHOR:notation -->
## Task Notation

| Prefix | Meaning                                      |
| ------ | -------------------------------------------- |
| `[ ]`  | Pending task                                 |
| `[x]`  | Completed task                               |
| `[P]`  | Can be done in parallel with other [P] tasks |
| `[B]`  | Blocked - waiting on dependency              |

<!-- /ANCHOR:notation -->
---

## AI EXECUTION PROTOCOL

### ⚠️ MANDATORY: Read Before Starting ANY Task

**This section defines HOW an AI agent must execute tasks in this document.**

#### Pre-Task Checklist (Before Each Task)

```
□ 1. READ the full task description including all sub-bullets
□ 2. VERIFY the affected files exist at the specified paths
□ 3. READ the relevant source code sections BEFORE making changes
□ 4. UNDERSTAND the acceptance criteria completely
□ 5. PLAN the specific code changes needed
□ 6. EXECUTE changes one file at a time
□ 7. VERIFY changes match acceptance criteria
□ 8. RUN verification command if provided
□ 9. UPDATE task status to [x] with evidence
```

#### Task Execution Rules

| Rule                       | Description                                                  |
| -------------------------- | ------------------------------------------------------------ |
| **ONE TASK AT A TIME**     | Complete task fully before moving to next                    |
| **VERIFY BEFORE CLAIMING** | Run verification command, confirm output                     |
| **EVIDENCE REQUIRED**      | Mark `[x]` only with evidence (command output, grep result)  |
| **NO ASSUMPTIONS**         | If file doesn't exist or differs from spec, STOP and clarify |
| **PRESERVE CONTEXT**       | Never modify files outside task scope                        |

#### Status Reporting Format

When completing a task, update it as follows:

```markdown
- [x] T001: Task description
  - **Completed**: YYYY-MM-DD
  - **Evidence**: [paste verification output]
  - **Files Modified**: [list files changed]
```

#### Blocked Task Protocol

If a task cannot be completed:

```markdown
- [B] T001: Task description
  - **Blocked**: YYYY-MM-DD
  - **Reason**: [specific blocker]
  - **Unblock Action**: [what needs to happen]
```

---

## 1. OBJECTIVE

### Metadata
- **Category**: Tasks
- **Tags**: spec-kit, bug-fix, memory-system, mcp-server
- **Priority**: P0-critical - HARD BLOCKER (Critical and High priority issues affect system reliability)

### Input
- Bug analysis findings from 20 parallel agent research (re-analysis included)
- Design documents from `.opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/064-bug-analysis-and-fix`

### Prerequisites
- **Required**: `spec.md`, `plan.md`, `research/research.md`
- **Optional**: None

### Organization
Tasks are grouped by priority phase to enable systematic bug elimination while maintaining system stability. The full issue inventory in `research/research.md` is the source of truth and must be fully cleared.

### Tests
Testing is integrated into each task where verification is possible.

---

## 2. CONVENTIONS

### Task Format

**Enhanced Format** (with requirement linking):
```markdown
- [ ] T###: Task description
  - **Priority:** P0/P1/P2
  - **Affected Files:** File paths
  - **Acceptance:** Specific acceptance criteria
  - **Verification:** How to verify completion
```

### Path Conventions
- **MCP Server**: `.opencode/skill/system-spec-kit/mcp_server/`
- **Shared**: `.opencode/skill/system-spec-kit/shared/`
- **Scripts**: `.opencode/skill/system-spec-kit/scripts/`
- **Templates**: `.opencode/skill/system-spec-kit/templates/`
- **Commands**: `.opencode/command/spec_kit/`
- **Documentation**: `.opencode/skill/system-spec-kit/references/`

---

## WORKING FILES LOCATION

**IMPORTANT:** During implementation, use appropriate directories:

| Directory  | Purpose                             | Persistence             |
| ---------- | ----------------------------------- | ----------------------- |
| `scratch/` | Debug logs, test data, draft code   | Temporary (git-ignored) |
| `memory/`  | Context to preserve across sessions | Permanent (git-tracked) |
| Root       | Final documentation only            | Permanent (git-tracked) |

**MUST:** Place ALL temporary/debug files in `scratch/`
**NEVER:** Create temp files in spec folder root or project root

---

## 3. TASK GROUPS BY PHASE

### Phase 1: Critical Fixes (P0 - HARD BLOCKERS)

**Purpose**: Fix critical bugs that break core functionality or cause data integrity issues (9 total)

**Estimated Complexity**: High (4 major system issues)

---

#### T001: Resolve Config System per ADR-001
- **Priority:** P0
- **Affected Files:**
  - `.opencode/skill/system-spec-kit/mcp_server/lib/config-loader.js`
  - `.opencode/skill/system-spec-kit/mcp_server/configs/search-weights.json`
  - All modules using hardcoded constants
- **Description:** 8 of 10 config sections in `search-weights.json` are never loaded. `config-loader.js` exists but is never imported. ADR-001 chooses removal of unused config infrastructure.

**STEP-BY-STEP EXECUTION:**

1. **Verify config-loader is unused:**
   ```bash
   grep -r "config-loader" .opencode/skill/system-spec-kit/mcp_server/ --include="*.js" | grep -v "config-loader.js:"
   ```
   Expected: No output (no imports found)

2. **Identify used config sections:**
   ```bash
   grep -r "maxTriggersPerMemory\|smartRanking" .opencode/skill/system-spec-kit/ --include="*.js"
   ```
   Document which files use these 2 sections.

3. **Backup and delete config-loader.js:**
   ```bash
   cp .opencode/skill/system-spec-kit/mcp_server/lib/config-loader.js scratch/config-loader.js.bak
   rm .opencode/skill/system-spec-kit/mcp_server/lib/config-loader.js
   ```

4. **Reduce search-weights.json** to only used sections (maxTriggersPerMemory, smartRanking)

5. **Update documentation** in SKILL.md to note limited configurability

- **Acceptance:**
  - `config-loader.js` removed (no imports remain)
  - `search-weights.json` reduced to actively used sections
  - Non-configurable values centralized in constants (if needed)
  - Documentation updated to reflect limited configurability
- **Verification:**
  ```bash
  # Confirm no config-loader imports remain
  grep -r "config-loader" .opencode/skill/system-spec-kit/ --include="*.js" | wc -l
  # Expected: 0
  
  # Confirm search-weights.json only has used sections
  cat .opencode/skill/system-spec-kit/mcp_server/configs/search-weights.json | grep -c "maxTriggersPerMemory\|smartRanking"
  # Expected: 2 (both sections present)
  ```

---

#### T002: Resolve ANCHOR System Scope (Defer Full Implementation)
- **Priority:** P0
- **Affected Files:**
  - `.opencode/skill/system-spec-kit/mcp_server/lib/memory-parser.js`
  - `.opencode/skill/system-spec-kit/mcp_server/context-server.js`
  - Database schema (anchor_id column)
- **Description:** `anchor_id` column in database is NEVER populated. ANCHOR tags are validated but never extracted for section-level retrieval. Documented "93% token savings" from anchors is not implemented. Plan is to document as non-indexed and defer full implementation.

**STEP-BY-STEP EXECUTION:**

1. **Verify anchor_id is never populated:**
   ```bash
   sqlite3 .opencode/skill/system-spec-kit/database/context-index.sqlite \
     "SELECT count(*) FROM memory_index WHERE anchor_id IS NOT NULL"
   ```
   Expected: 0

2. **Search for "93% token savings" claim:**
   ```bash
   grep -rn "93%" .opencode/skill/system-spec-kit/ --include="*.md"
   ```
   Document all locations.

3. **Remove or update false claims** in documentation:
   - Remove "93% token savings" claim
   - Update to: "ANCHOR tags are validated for syntax but not yet indexed for section-level retrieval"

4. **Create ADR-002** (if not exists) documenting the deferral decision

5. **Verify ANCHOR validation still works:**
   ```bash
   grep -n "VALID_ANCHOR_PATTERN" .opencode/skill/system-spec-kit/mcp_server/lib/memory-parser.js
   ```
   Confirm validation regex exists.

- **Acceptance:**
  - Documentation removes "93% token savings" claim
  - ANCHOR documented as validated but not indexed
  - Future feature spec or ADR created for full implementation
  - Existing ANCHOR validation remains intact
- **Verification:**
  ```bash
  # Confirm no "93%" claims remain
  grep -r "93%" .opencode/skill/system-spec-kit/ --include="*.md" | wc -l
  # Expected: 0
  
  # Confirm ANCHOR validation regex still exists
  grep -c "VALID_ANCHOR_PATTERN" .opencode/skill/system-spec-kit/mcp_server/lib/memory-parser.js
  # Expected: 1 or more
  ```

---

#### T003: Resolve Debug Trigger Threshold Inconsistency
- **Priority:** P0
- **Affected Files:**
  - `.opencode/skill/system-spec-kit/SKILL.md` (lines 543, 608)
  - `.opencode/command/spec_kit/debug.md` (line 232)
- **Description:** SKILL.md says "3+ failed fix attempts" but debug.md says "2+ fix attempts". Agents may follow inconsistent rules.

**STEP-BY-STEP EXECUTION:**

1. **Find all threshold references:**
   ```bash
   grep -rn "failed.*attempt\|fix attempt\|[0-9]+.*attempt" .opencode/skill/system-spec-kit/ .opencode/command/spec_kit/ --include="*.md"
   ```
   Document all locations and current values.

2. **Standardize to 3 attempts** (more conservative):
   - Update `.opencode/command/spec_kit/debug.md` line 232:
     - FROM: "2+ fix attempts"
     - TO: "3+ failed fix attempts"

3. **Verify SKILL.md already says 3:**
   ```bash
   grep -n "3.*failed\|3+.*attempt" .opencode/skill/system-spec-kit/SKILL.md
   ```
   Expected: Lines 543 and 608 show "3+"

4. **Check for any other inconsistent references** and update them

- **Acceptance:**
  - Single consistent threshold documented across all files
  - Recommend: 3 attempts (more conservative)
- **Verification:**
  ```bash
  # Confirm all references say "3"
  grep -rn "failed.*attempt\|fix attempt" .opencode/skill/system-spec-kit/ .opencode/command/spec_kit/ --include="*.md" | grep -v "3"
  # Expected: No output (all references use 3)
  
  # Confirm specific fix in debug.md
  grep -n "3.*failed\|3+.*attempt" .opencode/command/spec_kit/debug.md
  # Expected: Shows updated line with "3"
  ```

---

#### T004: Create Missing /memory:save Command
- **Priority:** P0
- **Affected Files:**
  - `.opencode/command/spec_kit/memory_save.md` (CREATE)
  - `.opencode/skill/system-spec-kit/SKILL.md` (lines 109, 421-426, 787-788)
- **Description:** SKILL.md references `/memory:save` command extensively but no corresponding command file exists.

**STEP-BY-STEP EXECUTION:**

1. **Verify command doesn't exist:**
   ```bash
   ls -la .opencode/command/spec_kit/memory_save.md 2>/dev/null || echo "CONFIRMED: File does not exist"
   ```

2. **Study existing command structure:**
   ```bash
   head -100 .opencode/command/spec_kit/complete.md
   ```
   Use as template for new command.

3. **Create memory_save.md** with the following structure:
   ```markdown
   # /spec_kit:memory_save
   
   <!-- SPECKIT_COMMAND_SOURCE: memory_save | v1.0 -->
   
   ## PURPOSE
   Save current session context to a memory file for future retrieval.
   
   ## TRIGGER PHRASES
   - `/memory:save`
   - "save context"
   - "save memory"
   
   ## WORKFLOW
   1. Identify current spec folder (Gate 3 if needed)
   2. Execute: `node .opencode/skill/system-spec-kit/scripts/generate-context.js [spec-folder-path]`
   3. Verify memory file created in `memory/` folder
   4. Confirm indexing via MCP memory_save tool
   
   ## MCP INTEGRATION
   - Tool: `spec_kit_memory_memory_save()`
   - Script: `generate-context.js`
   ```

4. **Verify SKILL.md references will resolve:**
   ```bash
   grep -n "memory:save\|memory_save" .opencode/skill/system-spec-kit/SKILL.md
   ```

- **Acceptance:**
  - `memory_save.md` command file created with proper structure
  - Command integrates with `generate-context.js` script
  - All SKILL.md references are valid
- **Verification:**
  ```bash
  # Confirm file exists
  ls -la .opencode/command/spec_kit/memory_save.md
  # Expected: File exists with proper permissions
  
  # Confirm file follows template
  head -20 .opencode/command/spec_kit/memory_save.md
  # Expected: Shows proper header structure
  ```

#### T101: Fix Missing await in memory_search
- **Priority:** P0
- **Affected Files:**
  - `.opencode/skill/system-spec-kit/mcp_server/context-server.js` (lines 1085, 1140, 1161)
- **Description:** `formatSearchResults()` is async but called without await, returning Promises in `memory_search`.

**STEP-BY-STEP EXECUTION:**

1. **Verify the bug exists:**
   ```bash
   grep -n "return formatSearchResults" .opencode/skill/system-spec-kit/mcp_server/context-server.js
   ```
   Expected: Lines 1085, 1140, 1161 show `return formatSearchResults(...)` WITHOUT await

2. **Verify formatSearchResults is async:**
   ```bash
   grep -n "async function formatSearchResults" .opencode/skill/system-spec-kit/mcp_server/context-server.js
   ```
   Expected: Line ~1170 shows `async function formatSearchResults`

3. **Fix all three locations** by adding `await`:
   - Line 1085: `return formatSearchResults(...)` → `return await formatSearchResults(...)`
   - Line 1140: `return formatSearchResults(...)` → `return await formatSearchResults(...)`
   - Line 1161: `return formatSearchResults(...)` → `return await formatSearchResults(...)`

4. **Verify the containing function is also async** (required for await to work)

- **Acceptance:**
  - All `formatSearchResults()` calls awaited
  - `memory_search` returns fully resolved results
- **Verification:**
  ```bash
  # Confirm all calls now have await
  grep -n "return.*formatSearchResults" .opencode/skill/system-spec-kit/mcp_server/context-server.js | grep -v "await"
  # Expected: No output (all calls have await)
  
  # Confirm with await present
  grep -n "return await formatSearchResults" .opencode/skill/system-spec-kit/mcp_server/context-server.js | wc -l
  # Expected: 3
  ```

#### T102: Standardize CHANGELOG Version Format
- **Priority:** P0
- **Affected Files:**
  - `CHANGELOG.md` and any versioned docs (see research/research.md)
- **Description:** Version format mismatch (`[1.7.1]` vs `17.1.0`).

**STEP-BY-STEP EXECUTION:**

1. **Check current CHANGELOG format:**
   ```bash
   head -50 .opencode/skill/system-spec-kit/CHANGELOG.md | grep -E "^\[|^## \["
   ```
   Document the format used (should be `[X.Y.Z]`)

2. **Check package.json versions:**
   ```bash
   grep '"version"' .opencode/skill/system-spec-kit/package.json .opencode/skill/system-spec-kit/mcp_server/package.json
   ```
   Document versions (should match CHANGELOG latest)

3. **Search for any mismatched versions:**
   ```bash
   grep -rn "17\.1\|1\.7\.1\|version" .opencode/skill/system-spec-kit/ --include="*.md" --include="*.json" | head -30
   ```
   Identify any inconsistencies

4. **Standardize to semantic versioning**: `X.Y.Z` format in brackets `[X.Y.Z]` for CHANGELOG

5. **Update any mismatched entries** to use canonical format

- **Acceptance:**
  - Single canonical version format documented and used
  - All mismatched entries updated
- **Verification:**
  ```bash
  # Confirm CHANGELOG uses consistent format
  grep -E "^## \[" .opencode/skill/system-spec-kit/CHANGELOG.md | head -10
  # Expected: All entries in [X.Y.Z] format
  
  # Confirm package.json matches latest CHANGELOG version
  grep '"version"' .opencode/skill/system-spec-kit/package.json
  # Expected: Matches latest CHANGELOG entry
  ```

#### T103: Define and Document E429 Error Code
- **Priority:** P0
- **Affected Files:**
  - `.opencode/skill/system-spec-kit/mcp_server/lib/errors.js`
  - References docs for error codes
- **Description:** `E429` error is thrown but not defined or documented.

**STEP-BY-STEP EXECUTION:**

1. **Find where E429 is used:**
   ```bash
   grep -rn "E429" .opencode/skill/system-spec-kit/ --include="*.js"
   ```
   Expected: context-server.js line ~2222

2. **Check current ErrorCodes enum:**
   ```bash
   grep -A 50 "ErrorCodes\|const.*Errors" .opencode/skill/system-spec-kit/mcp_server/lib/errors.js | head -60
   ```
   Verify E429 is NOT defined

3. **Add E429 to ErrorCodes** in errors.js:
   ```javascript
   E429: {
     code: 'E429',
     message: 'Rate limit exceeded - too many requests',
     httpStatus: 429
   }
   ```

4. **Document E429** in appropriate reference doc (error codes section)

5. **Verify the usage context** at line ~2222 to confirm the error description is accurate

- **Acceptance:**
  - `E429` exists in ErrorCodes enum with description
  - Documentation includes `E429`
- **Verification:**
  ```bash
  # Confirm E429 now defined in errors.js
  grep -n "E429" .opencode/skill/system-spec-kit/mcp_server/lib/errors.js
  # Expected: Shows E429 definition
  
  # Confirm all E429 usages have matching definition
  grep -c "E429" .opencode/skill/system-spec-kit/mcp_server/lib/errors.js
  # Expected: At least 1
  ```

#### T104: Add Rate Limiting for Batch Embedding Calls
- **Priority:** P0
- **Affected Files:**
  - Embedding batch callers (see research/research.md)
- **Description:** No rate limiting on batch embedding calls.

**STEP-BY-STEP EXECUTION:**

1. **Identify batch embedding call sites:**
   ```bash
   grep -rn "batch\|Batch" .opencode/skill/system-spec-kit/shared/embeddings*.js --include="*.js"
   grep -rn "generateEmbedding\|generate.*embedding" .opencode/skill/system-spec-kit/ --include="*.js" | head -20
   ```

2. **Check for existing rate limiting:**
   ```bash
   grep -rn "delay\|throttle\|rateLimit\|sleep" .opencode/skill/system-spec-kit/shared/ --include="*.js"
   ```
   Expected: Little or no rate limiting found

3. **Implement rate limiting** with configurable delay:
   ```javascript
   // Add to embeddings.js or factory.js
   const BATCH_DELAY_MS = process.env.EMBEDDING_BATCH_DELAY_MS || 100;
   
   async function rateLimitedBatch(items, processor) {
     const results = [];
     for (const item of items) {
       results.push(await processor(item));
       await new Promise(r => setTimeout(r, BATCH_DELAY_MS));
     }
     return results;
   }
   ```

4. **Add logging** for rate limiting behavior

- **Acceptance:**
  - Rate limiting/backoff applied to batch calls
  - Logging indicates throttling behavior
- **Verification:**
  ```bash
  # Confirm rate limiting code exists
  grep -rn "delay\|BATCH_DELAY\|rateLimit" .opencode/skill/system-spec-kit/shared/ --include="*.js"
  # Expected: Shows rate limiting implementation
  ```**
  - Load test batch calls to confirm throttling

#### T105: Enforce vec_memories Cleanup
- **Priority:** P0
- **Affected Files:**
  - Database schema/migrations
- **Description:** Missing ON DELETE CASCADE for vec_memories.

**STEP-BY-STEP EXECUTION:**

1. **Understand the constraint:**
   - `vec_memories` is a sqlite-vec virtual table (doesn't support FK CASCADE)
   - Must use application-level cleanup instead

2. **Find current cleanup logic:**
   ```bash
   grep -rn "DELETE FROM vec_memories" .opencode/skill/system-spec-kit/ --include="*.js"
   ```

3. **Verify cleanup script exists:**
   ```bash
   ls -la .opencode/skill/system-spec-kit/scripts/cleanup-orphaned-vectors.js
   ```

4. **Ensure deletion operations clean up vectors:**
   - Check `vector-index.js` delete functions
   - Verify they delete from `vec_memories` BEFORE deleting from `memory_index`

5. **Add cleanup trigger** or ensure transaction wraps both deletes

- **Acceptance:**
  - ON DELETE CASCADE (or equivalent) ensures vector rows removed on memory deletion
  - Migration path documented
- **Verification:**
  ```bash
  # Check cleanup script exists and has proper logic
  grep -n "DELETE FROM vec_memories" .opencode/skill/system-spec-kit/scripts/cleanup-orphaned-vectors.js
  # Expected: Shows cleanup query
  
  # Verify delete functions in vector-index.js handle vec_memories
  grep -B5 -A10 "DELETE FROM memory_index" .opencode/skill/system-spec-kit/mcp_server/lib/vector-index.js | head -30
  # Expected: Shows vec_memories deleted first
  ```

---

**Checkpoint**: Phase 1 complete - Critical system functionality restored

---

### Phase 2: High Priority Fixes (P1 - Required)

**Purpose**: Fix documentation mismatches and MCP server bugs that cause incorrect behavior

**Estimated Complexity**: Medium-High (47 issues)

---

#### Documentation vs Code Mismatches (T005-T011)

---

#### T005: Fix AGENTS.md Reference Error
- **Priority:** P1
- **Affected Files:**
  - `.opencode/skill/system-spec-kit/SKILL.md` (lines 14, 100, 288, 303, 420-423, 714-715)
- **Description:** SKILL.md references non-existent "AGENTS.md" file. Should reference AGENTS.md instead.

**STEP-BY-STEP EXECUTION:**

1. **Find all AGENTS.md references:**
   ```bash
   grep -n "AGENTS.md" .opencode/skill/system-spec-kit/SKILL.md
   ```
   Document all line numbers.

2. **Verify AGENTS.md does NOT exist:**
   ```bash
   ls -la .opencode/skill/system-spec-kit/AGENTS.md 2>/dev/null || echo "CONFIRMED: Does not exist"
   ```

3. **Determine correct replacement:**
   - Check if project-level AGENTS.md exists: `ls AGENTS.md`
   - Check if AGENTS.md exists: `ls .opencode/skill/system-spec-kit/AGENTS.md` or `ls AGENTS.md`

4. **Replace all references**:
   - If project-level AGENTS.md: Update to relative path `../../AGENTS.md` or `AGENTS.md`
   - If AGENTS.md: Update to `AGENTS.md`
   - Update each occurrence contextually (some may need different paths)

5. **Verify all links resolve**

- **Acceptance:**
  - All AGENTS.md references updated to correct file (AGENTS.md)
  - Cross-references validated
- **Verification:**
  ```bash
  # Confirm no AGENTS.md references remain in SKILL.md
  grep -c "AGENTS.md" .opencode/skill/system-spec-kit/SKILL.md
  # Expected: 0
  
  # Confirm replacement file exists
  ls -la AGENTS.md || ls -la AGENTS.md
  # Expected: One of these exists
  ```

---

#### T006: Fix Decay Formula Documentation
- **Priority:** P1
- **Affected Files:**
  - `.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/attention-decay.js`
- **Description:** troubleshooting.md documents time-based decay but attention-decay.js uses turn-based decay.

**STEP-BY-STEP EXECUTION:**

1. **Read the actual implementation:**
   ```bash
   grep -A20 "function.*decay\|calculateDecay" .opencode/skill/system-spec-kit/mcp_server/lib/attention-decay.js | head -30
   ```
   Document whether it's turn-based or time-based.

2. **Find the documentation claim:**
   ```bash
   grep -n "decay" .opencode/skill/system-spec-kit/references/debugging/troubleshooting.md | head -10
   ```

3. **Update documentation to match implementation**:
   - If code uses turns: Update docs to describe turn-based decay
   - Include the actual formula from the code

4. **Add code comment** in attention-decay.js explaining the decay mechanism

- **Acceptance:**
  - Documentation matches actual implementation (turn-based)
  - OR implementation updated to match documentation
- **Verification:**
  ```bash
  # Confirm docs mention "turn" not "time" for decay
  grep -i "turn\|time" .opencode/skill/system-spec-kit/references/debugging/troubleshooting.md | grep -i decay
  # Expected: Should reference turn-based decay
  ```

---

#### T007: Fix Embedding Model Recording
- **Priority:** P1
- **Affected Files:**
  - `.opencode/skill/system-spec-kit/shared/vector-index.js` (lines 861, 912)
- **Description:** Code always records `nomic-ai/nomic-embed-text-v1.5` even when using Voyage/OpenAI.

**STEP-BY-STEP EXECUTION:**

1. **Find the hardcoded model name:**
   ```bash
   grep -n "nomic-ai\|nomic-embed" .opencode/skill/system-spec-kit/ -r --include="*.js"
   ```

2. **Identify how to get actual model from factory:**
   ```bash
   grep -n "getModel\|modelName\|getEmbeddingProfile" .opencode/skill/system-spec-kit/shared/embeddings/*.js
   ```

3. **Update to use dynamic model name:**
   - Import/call the embedding profile getter
   - Use returned model name instead of hardcoded string

4. **Test with different providers** if possible

- **Acceptance:**
  - Correct embedding model name is recorded based on actual model used
  - Database records reflect true embedding model
- **Verification:**
  ```bash
  # Confirm hardcoded string removed
  grep -c "nomic-ai/nomic-embed-text-v1.5" .opencode/skill/system-spec-kit/shared/vector-index.js
  # Expected: 0 (or only in comments/defaults)
  ```

---

#### T008: Fix attention-decay Return Type
- **Priority:** P1
- **Affected Files:**
  - `.opencode/skill/system-spec-kit/mcp_server/lib/attention-decay.js` (line 198)
  - `.opencode/skill/system-spec-kit/mcp_server/context-server.js` (consumer)
- **Description:** Returns number at line 198, but context-server expects object with `decayedCount` property.
- **Acceptance:**
  - Return type matches consumer expectations
  - Type consistency enforced
- **Verification:**
  - Add JSDoc type annotations
  - Test decay calculation flow end-to-end

---

#### T009: Remove Invalid Failure Pattern Reference
- **Priority:** P1
- **Affected Files:**
  - `.opencode/command/spec_kit/implement.md` (lines 16-18)
- **Description:** References "Failure Pattern #19" but only patterns 1-18 exist in documentation.
- **Acceptance:**
  - Invalid reference removed or corrected
  - All failure pattern references valid
- **Verification:**
  - Grep for pattern references
  - Cross-validate with failure pattern table

---

#### T010: Fix memory_save Re-embedding Documentation
- **Priority:** P1
- **Affected Files:**
  - `.opencode/skill/system-spec-kit/references/memory/memory_system.md`
  - Actual re-embedding implementation
- **Description:** Documentation says re-embedding triggers "when title changes" but code uses full content comparison.
- **Acceptance:**
  - Documentation matches actual trigger condition
- **Verification:**
  - Test re-embedding with title change only
  - Test re-embedding with content change

---

#### T011: Document searchBoost Multipliers
- **Priority:** P1
- **Affected Files:**
  - `.opencode/skill/system-spec-kit/references/memory/memory_system.md`
  - Relevant config/code files
- **Description:** Documentation missing searchBoost multipliers (3.0, 2.0, 1.5, 1.0, 0.5) for importance tiers.
- **Acceptance:**
  - All searchBoost values documented
  - Documentation matches implementation
- **Verification:**
  - Compare documented values with code
  - Test search ranking with different importance tiers

---

#### MCP Server Bugs (T012-T018)

---

#### T012: Fix Embedding Warmup Race Condition
- **Priority:** P1
- **Affected Files:**
  - `.opencode/skill/system-spec-kit/mcp_server/context-server.js` (lines 2514-2522)
- **Description:** `embeddingModelReady` flag may be stale, causing race conditions during initialization.
- **Acceptance:**
  - Proper async/await pattern for embedding model readiness
  - Race condition eliminated
- **Verification:**
  - Test rapid successive operations during warmup
  - Add logging to track warmup state

---

#### T013: Expose Missing MCP Tool Parameters
- **Priority:** P1
- **Affected Files:**
  - `.opencode/skill/system-spec-kit/mcp_server/context-server.js` (lines 1849-1920)
- **Description:** `includeWorkingMemory` and `sessionId` parameters not exposed in MCP tool schema.
- **Acceptance:**
  - Both parameters added to tool schema
  - Parameters functional when provided
- **Verification:**
  - Inspect MCP tool schema
  - Test tools with new parameters

---

#### T014: Add Null Check in retry-manager
- **Priority:** P1
- **Affected Files:**
  - `.opencode/skill/system-spec-kit/mcp_server/lib/retry-manager.js` (lines 227-238)
- **Description:** `mark_as_failed` can crash if DB not initialized.
- **Acceptance:**
  - Null check added before DB operations
  - Graceful handling when DB unavailable
- **Verification:**
  - Test with uninitialized DB
  - No crashes on null DB

---

#### High-Priority Re-Analysis Buckets (T120-T127)

> **IMPORTANT**: These bucket tasks reference the detailed issue inventory in `research/research.md`. 
> For each bucket, open research/research.md and find the corresponding section to get exact file:line references.

#### T120: MCP Server Re-Analysis Fixes
- **Priority:** P1
- **Affected Files:** `.opencode/skill/system-spec-kit/mcp_server/context-server.js`
- **Description:** Clear all additional MCP server issues from research inventory (null dereferences, numeric validation, cache invalidation, startup mutex, error format consistency).

**ISSUES TO RESOLVE (from research/research.md):**
1. Null dereference in database queries (lines 1685, 1744, 1772) - add null checks
2. parseInt without radix (lines 285, 339) - add `, 10` parameter
3. Missing numeric validation (lines 613-616, 660-663, 741-744, 791, 1021)
4. Constitutional cache not cleared on reinitialize (lines 162-164, 304-316)
5. triggerMatcher.clearCache() not called after bulk indexing (lines 2191-2333)
6. startupScanInProgress mutex never checked (lines 2347-2356)

**STEP-BY-STEP EXECUTION:**
```bash
# Find each issue location
grep -n "\.count\|parseInt\|validateNumeric" .opencode/skill/system-spec-kit/mcp_server/context-server.js | head -20
```

- **Acceptance:** All MCP server items in research/research.md resolved
- **Verification:** Run targeted regression tests for each listed issue

---

#### T121: lib/ Module Reliability Fixes
- **Priority:** P1
- **Affected Files:** `.opencode/skill/system-spec-kit/mcp_server/lib/*.js`
- **Description:** Resolve JSON.parse crash paths, listener cleanup, global state mutation, error propagation, and timer cleanup issues.

**ISSUES TO RESOLVE (from research/research.md):**
1. **history.js**: JSON.parse in map callback without try-catch (lines 115-118, 159-166, 193-194)
2. **temporal-contiguity.js**: JSON.parse inside loop without try-catch (lines 67-70, 107-110)
3. **access-tracker.js**: Event listeners never removed (lines 123-135)
4. **channel.js**: Global state mutation (lines 17-19, 34-38, 57-61, 69-73)
5. **errors.js**: Timer in with_timeout never cleared (lines 49-54)
6. **vector-index.js**: Multiple issues (lines 64-74, 176-180, 213-236, 389-396)

**STEP-BY-STEP EXECUTION:**
```bash
# Find JSON.parse without try-catch
grep -n "JSON.parse" .opencode/skill/system-spec-kit/mcp_server/lib/*.js | head -20
```

- **Acceptance:** All lib/ module items in research/research.md resolved
- **Verification:** Unit tests and targeted error-case simulation

---

#### T122: Scripts Cross-Platform & Reliability Fixes
- **Priority:** P1
- **Affected Files:** `.opencode/skill/system-spec-kit/scripts/**`
- **Description:** Resolve signal handling, cross-platform path issues, race conditions, and hardcoded values.

**ISSUES TO RESOLVE (from research/research.md):**
1. **generate-context.js**: Missing SIGTERM handler
2. **archive-spec.sh:164**: macOS-specific `stat -f` command
3. **create-spec-folder.sh:196**: xargs without -r flag
4. **archive-spec.sh:137**: Non-atomic directory rename race condition
5. **data-loader.js:39-44**: Hardcoded `/tmp` path (use `os.tmpdir()`)

**STEP-BY-STEP EXECUTION:**
```bash
# Find hardcoded paths
grep -rn "/tmp\|/Users" .opencode/skill/system-spec-kit/scripts/ --include="*.js" --include="*.sh"
```

- **Acceptance:** All script items in research/research.md resolved
- **Verification:** Run scripts on macOS/Linux paths with edge-case inputs

---

#### T123: Template Consistency Fixes
- **Priority:** P1
- **Affected Files:** `.opencode/skill/system-spec-kit/templates/*.md`
- **Description:** Fix status vocab inconsistencies, "WHEN TO USE" gaps, marker positioning, metadata field naming, and numbering logic.

**ISSUES TO RESOLVE (from research/research.md):**
1. Status field values inconsistent across templates
2. Missing "WHEN TO USE" in handover.md, debug-delegation.md, implementation-summary.md
3. Template markers on line 5 instead of line 1 (or inconsistent)
4. Date format inconsistency in spec.md
5. handover.md version v2.0 vs others at v1.0

- **Acceptance:** All template issues in research/research.md resolved
- **Verification:** Template lint pass and manual review

---

#### T124: Command Workflow Alignment
- **Priority:** P1
- **Affected Files:** `.opencode/command/spec_kit/*.md`, `.opencode/command/spec_kit/assets/*.yaml`
- **Description:** Resolve step mismatches, termination text inconsistencies, and YAML/MD divergence.

**ISSUES TO RESOLVE (from research/research.md):**
1. Step count/termination mismatches (complete.md:277)
2. Cross-command step numbering inconsistency
3. Confidence checkpoints differ between MD and YAML
4. handover.md lacks auto/confirm YAML pattern
5. MCP tool naming issues (double prefix in resume.md:435)

- **Acceptance:** All command issues in research/research.md resolved
- **Verification:** Diff MD vs YAML step tables and re-run command flows

---

#### T125: Reference Documentation Corrections
- **Priority:** P1
- **Affected Files:** `.opencode/skill/system-spec-kit/references/**`
- **Description:** Align docs with actual parameter names, tier weights, and error code references.

**ISSUES TO RESOLVE (from research/research.md):**
1. Importance tier weights wrong in memory_system.md (lines 39-46)
2. Missing MCP tools from documentation (7 listed, 14 actual)
3. memory_list sortBy default incorrect
4. Hardcoded "Memory #132" reference
5. Level 1 required files inconsistency

- **Acceptance:** All reference doc issues in research/research.md resolved
- **Verification:** Cross-check docs against implementation

---

#### T126: shared/ Documentation + Integration Fixes
- **Priority:** P1
- **Affected Files:** `.opencode/skill/system-spec-kit/shared/**`, SKILL.md
- **Description:** Document shared/ modules and resolve integration gaps (checkpoint_restore docs, missing changelog refs).

**ISSUES TO RESOLVE (from research/research.md):**
1. Cache key collision risk in embeddings.js (16-char hash)
2. Query embedding not cached (only document embedding cached)
3. Inconsistent MAX_TEXT_LENGTH defined in multiple places
4. Provider fallback only for OpenAI, not Voyage
5. HF-Local truncates without semantic chunking

- **Acceptance:** All shared/integration issues in research/research.md resolved
- **Verification:** Documentation audit

---

#### T015: Fix Memory Leak in Trigger Cache
- **Priority:** P1
- **Affected Files:**
  - `.opencode/skill/system-spec-kit/mcp_server/lib/trigger-matcher.js` (lines 62-129)
- **Description:** Regex objects accumulate in cache without bounds or cleanup.
- **Acceptance:**
  - Cache has size limit (LRU or similar)
  - Old entries are evicted
- **Verification:**
  - Memory profiling during extended use
  - Cache size stays bounded

---

#### T016: Fix co-activation.init() Error Handling
- **Priority:** P1
- **Affected Files:**
  - `.opencode/skill/system-spec-kit/mcp_server/lib/co-activation.js`
- **Description:** Returns silently on null DB while other modules throw, causing inconsistent behavior.
- **Acceptance:**
  - Consistent error handling pattern across all modules
  - Either all throw or all return silently (prefer throwing)
- **Verification:**
  - Test init with null DB across all modules
  - Verify consistent behavior

---

#### Template Contradictions (T017-T019)

---

#### T017: Fix plan.md Level Contradiction
- **Priority:** P1
- **Affected Files:**
  - `.opencode/skill/system-spec-kit/templates/plan.md` (lines 368-378)
- **Description:** Says "Level 2 or Level 3" then immediately says "REQUIRED for ALL levels".
- **Acceptance:**
  - Clear, non-contradictory language
  - Specify which levels require plan.md
- **Verification:**
  - Read template, confirm no contradictions

---

#### T018: Fix tasks.md Level Contradiction
- **Priority:** P1
- **Affected Files:**
  - `.opencode/skill/system-spec-kit/templates/tasks.md` (lines 335-346)
- **Description:** Same contradiction as plan.md regarding level requirements.
- **Acceptance:**
  - Clear, non-contradictory language
  - Consistent with plan.md resolution
- **Verification:**
  - Read template, confirm no contradictions

---

#### T019: Add Missing spec.md Section
- **Priority:** P1
- **Affected Files:**
  - `.opencode/skill/system-spec-kit/templates/spec.md`
  - `.opencode/skill/system-spec-kit/references/level_specifications.md`
- **Description:** spec.md missing "Files to Change" section per level_specifications.md requirements.
- **Acceptance:**
  - "Files to Change" section added to spec.md template
  - Section follows level_specifications.md format
- **Verification:**
  - Compare spec.md with level_specifications.md requirements

---

**Checkpoint**: Phase 2 complete - Documentation accurate, MCP server stable

---

### Phase 3: Medium Priority Fixes (P2 - Important)

**Purpose**: Fix cross-reference errors, script issues, and documentation gaps

**Estimated Complexity**: Medium (12 issues)

---

#### Cross-Reference Errors (T020-T024)

---

#### T020: Fix complete.md Option Format Reference
- **Priority:** P2
- **Affected Files:**
  - `.opencode/command/spec_kit/complete.md` (line 100)
- **Description:** References `[1] [2] [3] [all] [skip]` format that doesn't exist elsewhere.
- **Acceptance:**
  - Reference updated to match actual format
  - OR actual format implemented
- **Verification:**
  - Cross-reference with implementation

---

#### T021: Fix plan.md Step Numbering Discrepancy
- **Priority:** P2
- **Affected Files:**
  - `.opencode/command/spec_kit/plan.md` (lines 248 vs 315)
- **Description:** Step 5 vs Step 6 discrepancy for Planning phase.
- **Acceptance:**
  - Consistent step numbering throughout
- **Verification:**
  - Review all step references

---

#### T022: Add checkpoint_restore to Tool Table
- **Priority:** P2
- **Affected Files:**
  - `.opencode/command/spec_kit/resume.md` (lines 421-427)
- **Description:** `checkpoint_restore` missing from tool table.
- **Acceptance:**
  - Tool added to table with proper documentation
- **Verification:**
  - Verify tool table completeness

---

#### T023: Document research/research.md Phase 3
- **Priority:** P2
- **Affected Files:**
  - `.opencode/command/spec_kit/research/research/research.md`
  - `.opencode/skill/system-spec-kit/SKILL.md`
- **Description:** research/research.md has unique Phase 3 (Prior Work Search) not documented in SKILL.md.
- **Acceptance:**
  - Phase 3 documented in SKILL.md
  - OR research/research.md aligned with SKILL.md
- **Verification:**
  - Cross-reference both files

---

#### T024: Add Missing YAML References to handover.md
- **Priority:** P2
- **Affected Files:**
  - `.opencode/command/spec_kit/handover.md`
- **Description:** Missing YAML asset file references unlike other commands.
- **Acceptance:**
  - YAML references added consistent with other commands
- **Verification:**
  - Compare with other command files

---

#### Script/Code Issues (T025-T029)

---

#### T025: Fix generate-context.js Spec Folder Regex
- **Priority:** P2
- **Affected Files:**
  - `.opencode/skill/system-spec-kit/scripts/generate-context.js` (lines 60-64)
- **Description:** Regex `/^\d{3}-/` is too permissive, may match non-spec folders.
- **Acceptance:**
  - Stricter regex or additional validation
  - Only valid spec folders matched
- **Verification:**
  - Test with edge cases (valid and invalid folder names)

---

#### T026: Remove Hardcoded macOS Path
- **Priority:** P2
- **Affected Files:**
  - `.opencode/skill/system-spec-kit/shared/semantic-summarizer.js` (lines 467-469)
- **Description:** Hardcoded `/Users/...` path makes code non-portable.
- **Acceptance:**
  - Dynamic path resolution
  - Works on all platforms
- **Verification:**
  - Test on different environments

---

#### T027: Fix checkpoints.js TTL Cleanup Logic
- **Priority:** P2
- **Affected Files:**
  - `.opencode/skill/system-spec-kit/mcp_server/lib/checkpoints.js` (lines 223-231)
- **Description:** TTL cleanup ignores last-used date, may delete recently accessed checkpoints.
- **Acceptance:**
  - TTL calculation considers last-used date
  - Recently used checkpoints preserved
- **Verification:**
  - Test checkpoint cleanup with various ages

---

#### T028: Fix hybrid-search.js README Documentation
- **Priority:** P2
- **Affected Files:**
  - `.opencode/skill/system-spec-kit/shared/hybrid-search.js` (README section)
- **Description:** Documents `vectorWeight`/`ftsWeight` params that don't exist in implementation.
- **Acceptance:**
  - Documentation matches actual API
  - OR params implemented as documented
- **Verification:**
  - Compare README with actual function signatures

---

#### T029: Add Template Error Handling
- **Priority:** P2
- **Affected Files:**
  - `.opencode/skill/system-spec-kit/mcp_server/lib/template-renderer.js` (lines 120-125)
- **Description:** Missing try-catch for template not found scenario.
- **Acceptance:**
  - Graceful error handling when template missing
  - Clear error message
- **Verification:**
  - Test with non-existent template name

---

#### Documentation Gaps (T030-T031)

---

#### T030: Document shared/ Directory
- **Priority:** P2
- **Affected Files:**
  - `.opencode/skill/system-spec-kit/SKILL.md`
  - `.opencode/skill/system-spec-kit/shared/` (reference)
- **Description:** `shared/` directory contents and purpose undocumented in SKILL.md.
- **Acceptance:**
  - shared/ directory documented with file purposes
- **Verification:**
  - Read SKILL.md, confirm shared/ coverage

---

#### T031: Document Root config/ Directory
- **Priority:** P2
- **Affected Files:**
  - `.opencode/skill/system-spec-kit/SKILL.md`
  - `.opencode/skill/system-spec-kit/config/` (reference)
- **Description:** Root `config/` directory undocumented in SKILL.md.
- **Acceptance:**
  - config/ directory documented with file purposes
- **Verification:**
  - Read SKILL.md, confirm config/ coverage

---

**Checkpoint**: Phase 3 complete - Cross-references valid, scripts portable

---

### Phase 4: Low Priority Fixes (P2 - Polish)

**Purpose**: Fix minor inconsistencies and documentation polish

**Estimated Complexity**: Low (10+ issues)

---

#### T032: [P] Fix Template Source Marker Position
- **Priority:** P2
- **Affected Files:**
  - 6 template files with marker on line 5 instead of line 1
- **Description:** Template source markers inconsistently positioned.
- **Acceptance:**
  - All markers on line 5 (after title) OR all on line 1
  - Consistent across all templates
- **Verification:**
  - Grep for SPECKIT_TEMPLATE_SOURCE, check line numbers

---

#### T033: [P] Standardize Command Endings
- **Priority:** P2
- **Affected Files:**
  - Various command files in `.opencode/command/spec_kit/`
- **Description:** Inconsistent "What would you like to do next?" endings across commands.
- **Acceptance:**
  - Consistent ending pattern across all commands
- **Verification:**
  - Review all command file endings

---

#### T034: [P] Fix README Module Count
- **Priority:** P2
- **Affected Files:**
  - `.opencode/skill/system-spec-kit/README.md`
- **Description:** Claims 29 modules but only 28 exist.
- **Acceptance:**
  - Correct module count documented
- **Verification:**
  - Count actual modules, update README

---

#### T035: [P] Fix config-loader Naming Convention
- **Priority:** P2
- **Affected Files:**
  - `.opencode/skill/system-spec-kit/mcp_server/lib/config-loader.js`
- **Description:** snake_case vs camelCase mismatch in defaults.
- **Acceptance:**
  - Consistent naming convention (prefer camelCase for JS)
- **Verification:**
  - Review all variable names in file

---

#### T036: [P] Remove Redundant BigInt Conversions
- **Priority:** P2
- **Affected Files:**
  - `.opencode/skill/system-spec-kit/mcp_server/lib/checkpoints.js`
- **Description:** Unnecessary BigInt conversions that don't serve a purpose.
- **Acceptance:**
  - Redundant conversions removed
  - Functionality preserved
- **Verification:**
  - Test checkpoint operations after change

---

#### T037: [P] Fix Logging Inconsistency
- **Priority:** P2
- **Affected Files:**
  - Various MCP server files
- **Description:** console.error used for info messages in some places.
- **Acceptance:**
  - Appropriate log level for each message type
- **Verification:**
  - Review console.* usage across codebase

---

#### T038: [P] Document MAX_CHECKPOINTS and CHECKPOINT_TTL_DAYS
- **Priority:** P2
- **Affected Files:**
  - `.opencode/skill/system-spec-kit/references/` (appropriate doc file)
  - `.opencode/skill/system-spec-kit/mcp_server/lib/checkpoints.js`
- **Description:** Constants (10 and 30) not documented.
- **Acceptance:**
  - Both constants documented with rationale
- **Verification:**
  - Confirm documentation exists

---

#### T039: [P] Increase Git Command Timeout
- **Priority:** P2
- **Affected Files:**
  - `.opencode/skill/system-spec-kit/mcp_server/lib/checkpoints.js`
- **Description:** 1 second timeout too short for git commands on large repos.
- **Acceptance:**
  - Reasonable timeout (5-10 seconds suggested)
  - Timeout configurable if possible
- **Verification:**
  - Test with large repository

---

#### T040: [P] Add Missing Template Instructional Footers
- **Priority:** P2
- **Affected Files:**
  - 3 template files missing footers
- **Description:** Inconsistent template footer presence.
- **Acceptance:**
  - All templates have consistent instructional footers
- **Verification:**
  - Review all template files

---

#### T041: [P] Fix Phase 2.5 Positioning in complete.md
- **Priority:** P2
- **Affected Files:**
  - `.opencode/command/spec_kit/complete.md`
- **Description:** Phase 2.5 appears in wrong location.
- **Acceptance:**
  - Phase ordering correct and logical
- **Verification:**
  - Review phase sequence

---

**Checkpoint**: Phase 4 complete - All issues addressed

---

## 4. VALIDATION CHECKLIST

### Code Quality
- [ ] All code changes pass lint checks
- [ ] No console warnings or errors
- [ ] Error handling consistent across modules
- [ ] Type annotations added where applicable

### Documentation
- [ ] All cross-references validated
- [ ] SKILL.md updated with any behavioral changes
- [ ] README module count accurate
- [ ] All templates consistent

### Testing
- [ ] MCP server starts without errors
- [ ] Memory save/load operations work
- [ ] Checkpoint operations functional
- [ ] Config loading verified

### Review & Sign-off
- [ ] Code review completed for each phase
- [ ] Documentation review completed
- [ ] Integration testing passed

### Cross-References
- **Specification**: See `spec.md` for requirements
- **Plan**: See `plan.md` for technical approach
- **Research**: See `research/research.md` for investigation findings
- **Checklist**: See `checklist.md` for validation criteria

---

## 5. DEPENDENCY GRAPH

```
Phase 1 (Critical):
T001 (Config) ←── T007, T011, T038 (depend on config working)
T002 (ANCHOR) ←── standalone
T003 (Threshold) ←── standalone
T004 (memory:save) ←── standalone

Phase 2 (High):
T005-T011 (Docs) ←── can run in parallel [P]
T012-T016 (MCP) ←── T001 should complete first
T017-T019 (Templates) ←── can run in parallel [P]

Phase 3 (Medium):
T020-T024 (Cross-refs) ←── T005-T011 should complete first
T025-T029 (Scripts) ←── can run in parallel [P]
T030-T031 (Doc Gaps) ←── can run in parallel [P]

Phase 4 (Low):
T032-T041 (Polish) ←── All previous phases should complete first
```

---

## 6. EFFORT ESTIMATES

| Phase        | Tasks     | Est. Hours | Complexity |
| ------------ | --------- | ---------- | ---------- |
| 1 - Critical | T001-T004 | 8-12       | High       |
| 2 - High     | T005-T019 | 6-10       | Medium     |
| 3 - Medium   | T020-T031 | 4-6        | Medium     |
| 4 - Low      | T032-T041 | 2-4        | Low        |
| **Total**    | **41**    | **20-32**  | **Mixed**  |

---

## 7. RISK MITIGATION

### High-Risk Tasks
- **T001 (Config System)**: May have cascading effects. Test thoroughly after changes.
- **T002 (ANCHOR System)**: Database schema changes may require migration. Backup first.
- **T012 (Race Condition)**: Timing-dependent. Use async/await patterns correctly.

### Rollback Plan
1. Create git branch before each phase
2. Commit after each task group
3. Tag stable checkpoints
4. Document any schema changes for rollback

---
