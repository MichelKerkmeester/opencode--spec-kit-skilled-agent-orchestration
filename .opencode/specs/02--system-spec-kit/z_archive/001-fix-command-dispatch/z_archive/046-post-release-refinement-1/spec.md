---
title: "Post-Release Refinement 1: Infrastructure Bug Fixes [046-post-release-refinement-1/spec]"
description: "Systematically address all bugs, misalignments, and technical debt identified during the comprehensive 20-agent deep dive analysis of the OpenCode infrastructure. This includes ..."
trigger_phrases:
  - "post"
  - "release"
  - "refinement"
  - "infrastructure"
  - "bug"
  - "spec"
  - "046"
importance_tier: "important"
contextType: "decision"
---
# Post-Release Refinement 1: Infrastructure Bug Fixes

<!-- SPECKIT_TEMPLATE_SOURCE: system-spec-kit/templates/spec.md -->

| Metadata | Value |
|----------|-------|
| **Level** | 3 |
| **Status** | Draft |
| **Created** | 2025-12-26 |
| **Author** | OpenCode Analysis (20 Opus Agents) |
| **LOC Estimate** | 500+ |

---

## OBJECTIVE

Systematically address all bugs, misalignments, and technical debt identified during the comprehensive 20-agent deep dive analysis of the OpenCode infrastructure. This includes fixes for the Memory MCP Server, Spec-Kit scripts, Skills system, Commands, and cross-system integration issues.

---

## SCOPE

### In Scope

| Category | Count | Priority |
|----------|-------|----------|
| Critical Bugs | 6 | P0 - Must fix |
| High Severity | 10 | P1 - Should fix |
| Medium Severity | 20 | P1/P2 - Should fix |
| Low Severity | 33 | P2 - Nice to have |
| Cross-System Misalignments | 6 | P1 |

### Out of Scope

- API key migration from `.utcp_config.json` to `.env` (deferred to separate security audit)
- New feature development
- Performance optimization beyond bug fixes
- UI/UX changes

---

## USER STORIES

### US-001: Reliable Memory System
**As a** developer using OpenCode  
**I want** the memory system to be consistent and accurate  
**So that** I can trust search results and context recovery

**Acceptance Criteria:**
- No duplicate memory entries returned from searches
- Orphaned database entries are automatically detected and cleaned
- Confidence tracking is thread-safe
- Embedding failures don't leave system in inconsistent state

### US-002: Accurate Documentation
**As a** developer learning OpenCode  
**I want** documentation to match implementation  
**So that** I can trust the guides and examples

**Acceptance Criteria:**
- All referenced scripts exist
- Gate numbering is consistent across all documents
- Tool names use correct prefixes
- Anchor links point to correct sections

### US-003: Portable Configuration
**As a** developer setting up OpenCode on a new machine  
**I want** configuration files to work without modification  
**So that** I can get started quickly

**Acceptance Criteria:**
- No hardcoded absolute paths in configuration
- Environment variables used for machine-specific paths
- Commands work cross-platform (macOS, Linux)

### US-004: Robust Skill System
**As a** developer using skills  
**I want** skill routing to be accurate  
**So that** the right skill is invoked for my task

**Acceptance Criteria:**
- Skill advisor matches all documented skills
- INTENT_BOOSTERS are reachable (no hyphen tokenization issues)
- allowed-tools frontmatter lists actual tools, not skill names

---

## FUNCTIONAL REQUIREMENTS

### FR-001: Memory System Reliability

#### FR-001.1: Duplicate Entry Prevention
- **Requirement:** Checkpoint restore MUST check for existing entries before insert
- **Location:** `checkpoints.js:405-479`
- **Behavior:** Use INSERT OR REPLACE or explicit duplicate check
- **Validation:** Run checkpoint restore twice, verify no duplicates

#### FR-001.2: Orphan Detection
- **Requirement:** `verifyIntegrity()` MUST detect database entries where file no longer exists
- **Location:** `vector-index.js:2824-2848`
- **Behavior:** Check `fs.existsSync(file_path)` for all entries
- **Validation:** Delete a memory file, run verify, confirm detection

#### FR-001.3: Race Condition Prevention
- **Requirement:** `recordValidation()` MUST be wrapped in database transaction
- **Location:** `confidence-tracker.js:49-79`
- **Behavior:** Use `db.transaction()` wrapper
- **Validation:** Concurrent validation calls produce correct counts

#### FR-001.4: Embedding Failure Rollback
- **Requirement:** Metadata update MUST rollback if embedding regeneration fails
- **Location:** `context-server.js:981-1004`
- **Behavior:** Wrap in transaction, rollback on embedding failure
- **Validation:** Force embedding failure, verify metadata unchanged

### FR-002: Documentation Accuracy

#### FR-002.1: Gate Numbering Standardization
- **Requirement:** All gate references MUST use AGENTS.md numbering (1, 2, 3)
- **Location:** `system-spec-kit/SKILL.md`
- **Lines:** 82, 253, 255, 271, 447, 797, 854
- **Validation:** grep for "Gate [4-9]" returns no results

#### FR-002.2: Missing Scripts Resolution
- **Requirement:** Either create referenced scripts OR remove from documentation
- **Location:** `system-spec-kit/SKILL.md:187-188`
- **Scripts:** `validate-spec-folder.js`, `validate-memory-file.js`
- **Decision:** Create stub implementations (see decision-record.md)

#### FR-002.3: Anchor Link Correction
- **Requirement:** All anchor links in workflows-code SKILL.md MUST point to correct sections
- **Location:** `workflows-code/SKILL.md:91-107`
- **Validation:** Each link resolves to expected section

#### FR-002.4: Tool Naming Consistency
- **Requirement:** LEANN tool names MUST use `leann_leann_*` prefix consistently
- **Location:** `AGENTS.md:482`, `mcp-code-mode/SKILL.md:480`
- **Validation:** All LEANN tool references use full prefix

### FR-003: Configuration Portability

#### FR-003.1: Relative Path Usage
- **Requirement:** `.utcp_config.json` MUST use relative paths or environment variables
- **Location:** `.utcp_config.json:117, 120`
- **Current:** `/Users/michelkerkmeester/MEGA/...`
- **Target:** `${NARSIL_BINARY}` or `./path/relative/to/workspace`

#### FR-003.2: Cross-Platform Commands
- **Requirement:** Validation scripts MUST work on both macOS and Linux
- **Location:** `search/index.md:86-89`
- **Issue:** `stat -f '%m'` is macOS-specific
- **Fix:** Use portable alternatives or conditional logic

### FR-004: Skill System Robustness

#### FR-004.1: Skill Reference Fixes
- **Requirement:** Command YAML files MUST reference existing skills
- **Location:** `create_skill_reference.yaml:430`, `create_skill_asset.yaml:318`, `create_folder_readme.yaml:413`
- **Current:** References `system-memory` (doesn't exist)
- **Target:** Reference `system-spec-kit`

#### FR-004.2: INTENT_BOOSTERS Reachability
- **Requirement:** All INTENT_BOOSTERS entries MUST be matchable
- **Location:** `skill_advisor.py`
- **Issue:** `dead-code`, `call-graph` unreachable due to hyphen tokenization
- **Fix:** Add non-hyphenated variants or modify tokenization

#### FR-004.3: Allowed-Tools Accuracy
- **Requirement:** Skill frontmatter MUST list tool names, not skill names
- **Location:** `mcp-chrome-devtools/SKILL.md`, `sk-git/SKILL.md`
- **Issue:** Lists `mcp-code-mode` (skill) instead of `call_tool_chain` (tool)

### FR-005: Database Integrity

#### FR-005.1: Missing Index Creation
- **Requirement:** `idx_history_timestamp` index MUST exist on `memory_history` table
- **Location:** `vector-index.js:714`
- **Fix:** Add migration for existing databases

#### FR-005.2: Timestamp Format Standardization
- **Requirement:** `last_accessed` column MUST use consistent format
- **Location:** `vector-index.js:2329`
- **Issue:** Code writes ISO string to INTEGER column
- **Decision:** Migrate to TEXT ISO format (see decision-record.md)

#### FR-005.3: Cascade Delete Implementation
- **Requirement:** `deleteMemory()` MUST clean up related `memory_history` entries
- **Location:** `vector-index.js:923-939`
- **Fix:** Delete history before deleting memory

---

## NON-FUNCTIONAL REQUIREMENTS

### NFR-001: Reliability
- All database operations MUST be transactional where data integrity is at risk
- Error handling MUST NOT swallow errors silently in critical paths
- Graceful degradation MUST be implemented for non-critical failures

### NFR-002: Maintainability
- All fixes MUST include inline comments explaining the change
- Breaking changes MUST be documented in decision-record.md
- Test cases SHOULD be added for each critical bug fix

### NFR-003: Compatibility
- All changes MUST maintain backward compatibility with existing memory databases
- Configuration changes MUST support both old and new formats during transition
- Cross-platform support for macOS and Linux

### NFR-004: Performance
- Bug fixes MUST NOT degrade performance by more than 10%
- Database migrations MUST be idempotent and safe to run multiple times

---

## SUCCESS CRITERIA

| Criterion | Target | Measurement |
|-----------|--------|-------------|
| Critical bugs fixed | 100% (6/6) | All P0 checklist items complete |
| High severity bugs fixed | 100% (10/10) | All P1 checklist items complete |
| Medium severity bugs fixed | 80% (16/20) | P1/P2 checklist items |
| No regressions | 0 new bugs | Validation testing passes |
| Documentation accuracy | 100% | All doc issues resolved |
| Cross-platform compatibility | macOS + Linux | Manual testing on both |

---

## RISKS AND MITIGATIONS

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Database migration breaks existing data | Medium | High | Create checkpoint before migration, test on copy |
| Transaction wrapping affects performance | Low | Medium | Benchmark before/after |
| Documentation changes miss some references | Medium | Low | Use grep to find all occurrences |
| Cross-platform fixes break macOS | Low | Medium | Test on both platforms |

---

## DEPENDENCIES

| Dependency | Type | Status |
|------------|------|--------|
| SQLite database access | Internal | Available |
| File system access | Internal | Available |
| skill_advisor.py | Internal | Available |
| MCP server restart capability | Internal | Available |

---

## APPENDIX A: Bug Reference Table

| ID | Severity | System | File | Line(s) | Description |
|----|----------|--------|------|---------|-------------|
| C1 | CRITICAL | Memory | checkpoints.js | 405-479 | Duplicate entries on checkpoint restore |
| C2 | CRITICAL | Memory | vector-index.js | 2824-2848 | No orphaned file detection |
| C3 | CRITICAL | Commands | create_*.yaml | 318,413,430 | Broken system-memory reference |
| C4 | CRITICAL | Skills | system-spec-kit/SKILL.md | 82,253,... | Gate numbering mismatch |
| C5 | CRITICAL | Config | .utcp_config.json | 117,120 | Hardcoded absolute paths |
| C6 | CRITICAL | Memory | confidence-tracker.js | 49-79 | Race condition |
| H1 | HIGH | Scripts | SKILL.md | 187-188 | Missing validation scripts |
| H2 | HIGH | Skills | workflows-code/SKILL.md | 91-107 | Incorrect anchor links |
| H3 | HIGH | Memory | context-server.js | 1584-1637 | No real-time sync |
| H4 | HIGH | Memory | context-server.js | 981-1004 | Partial embedding update |
| H5 | HIGH | Database | vector-index.js | 714 | Missing index |
| H6 | HIGH | Database | vector-index.js | 2329 | Timestamp format |
| H7 | HIGH | Database | vector-index.js | 923-939 | No cascade delete |
| H8 | HIGH | Docs | AGENTS.md | 482 | Tool naming inconsistency |
| H9 | HIGH | Memory | context-server.js | 568-578 | Generic error response |
| H10 | HIGH | Frontend | form_submission.js | 161-166 | Silent Botpoison failure |

*(See tasks.md for complete list including Medium and Low severity items)*
