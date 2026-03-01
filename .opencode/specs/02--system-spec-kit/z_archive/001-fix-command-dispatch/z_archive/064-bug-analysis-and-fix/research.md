---
title: "Feature Research: SpecKit Bug Analysis - Comprehensive Technical Investigation [064-bug-analysis-and-fix/research]"
description: "Complete research documentation providing in-depth analysis of bugs, inconsistencies, and issues across the SpecKit system."
trigger_phrases:
  - "feature"
  - "research"
  - "speckit"
  - "bug"
  - "analysis"
  - "064"
importance_tier: "normal"
contextType: "research"
---
# Feature Research: SpecKit Bug Analysis - Comprehensive Technical Investigation

Complete research documentation providing in-depth analysis of bugs, inconsistencies, and issues across the SpecKit system.

<!-- SPECKIT_TEMPLATE_SOURCE: research | v1.0 -->

---

## 1. METADATA

- **Research ID**: RESEARCH-064
- **Feature/Spec**: SpecKit System Bug Analysis and Remediation
- **Status**: Completed - findings documented (UPDATED with re-analysis)
- **Date Started**: 2026-01-15
- **Date Completed**: 2026-01-15
- **Last Updated**: 2026-01-15 (Re-analysis completed)
- **Researcher(s)**: 20 parallel Claude Opus agents (10 initial + 10 re-analysis)
- **Reviewers**: Pending

**Related Documents**:
- Spec: [spec.md](./spec.md)
- Plan: [plan.md](./plan.md)
- Tasks: [tasks.md](./tasks.md)
- Checklist: [checklist.md](./checklist.md)

---

## 2. INVESTIGATION REPORT

### Request Summary
Conduct comprehensive audit of the SpecKit system to identify bugs, documentation inconsistencies, and code issues. The investigation spans the MCP server, shared modules, scripts, templates, commands, and all documentation files. Goal is to create actionable remediation plan.

### Research Methodology

**Two-Phase Parallel Agent Architecture:**

```
┌─────────────────────────────────────────────────────────────────────┐
│                 PHASE 1: INITIAL ANALYSIS (10 Agents)               │
└─────────────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
          ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  Agent Group A  │ │  Agent Group B  │ │  Agent Group C  │
│  (Code Audit)   │ │  (Doc Analysis) │ │  (Integration)  │
└─────────────────┘ └─────────────────┘ └─────────────────┘
    │   │   │           │   │   │           │   │   │
    ▼   ▼   ▼           ▼   ▼   ▼           ▼   ▼   ▼
   A1  A2  A3          B1  B2  B3          C1  C2  C3
                              │
                              ▼
                    ┌─────────────────┐
                    │    Agent 10     │
                    │  (Synthesis)    │
                    └─────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                 PHASE 2: RE-ANALYSIS (10 Agents)                    │
│           Deep dive to find missed issues                           │
└─────────────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
          ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│   Deep Audit    │ │   Deep Audit    │ │   Deep Audit    │
│ (SKILL.md, MCP) │ │ (lib/, scripts) │ │ (templates,cmds)│
└─────────────────┘ └─────────────────┘ └─────────────────┘
    │   │   │           │   │   │           │   │   │
    ▼   ▼   ▼           ▼   ▼   ▼           ▼   ▼   ▼
   R1  R2  R3          R4  R5  R6          R7  R8  R9
                              │
                              ▼
                    ┌─────────────────┐
                    │    Agent R10    │
                    │ (Cross-System)  │
                    └─────────────────┘
```

**Phase 2 Agent Assignments:**
| Agent | Focus Area | Files Analyzed |
|-------|------------|----------------|
| R1 | SKILL.md Deep Audit | All paths, tools, versions, examples |
| R2 | context-server.js Deep Audit | All handlers, validation, async |
| R3 | lib/ Modules (29 files) | All modules, patterns, exports |
| R4 | Scripts Deep Audit | All scripts, subfolders, tests |
| R5 | Templates Deep Audit | All 10 templates + style guides |
| R6 | Commands Deep Audit | All 7 commands + YAML assets |
| R7 | References Deep Audit | All reference docs |
| R8 | shared/ + database/ | Embeddings, schema, indexes |
| R9 | Assets + Configs | All assets, configs, constitutional |
| R10 | Cross-System Integration | AGENTS.md ↔ Skill ↔ Commands |

### Key Findings

**Finding Summary by Severity (UPDATED):**

| Severity | Initial | Re-Analysis | Total |
|----------|---------|-------------|-------|
| Critical (P0) | 4 | 5 | **9** |
| High (P1) | 15 | 32 | **47** |
| Medium (P2) | 12 | 74 | **86** |
| Low | 10+ | 79 | **89+** |
| **TOTAL** | **41+** | **~190** | **~231** |

### Recommendations

**Primary Recommendation:**
- Phase-based remediation starting with Critical issues
- Each phase should be completed and verified before proceeding
- Maintain system stability through incremental fixes

**Alternative Approaches:**
- Big-bang fix (higher risk, faster completion)
- Per-module fixes (more isolation, longer timeline)

---

## 3. EXECUTIVE OVERVIEW

### Executive Summary (UPDATED)

The SpecKit system audit (two phases, 20 total agents) revealed **~231 issues** across four severity levels. The re-analysis phase discovered **~190 additional issues** beyond the initial 41.

**Most Critical Discovery (NEW):** Missing `await` on `formatSearchResults()` in context-server.js (lines 1085, 1140, 1161) causes `memory_search` to return Promise objects instead of actual results when `includeContent=true`. **This is a production bug that breaks core functionality.**

Other critical findings include:
- Config system almost entirely unused (8 of 10 sections never loaded)
- ANCHOR system that promises "93% token savings" is non-functional
- Debug threshold inconsistency (SKILL.md says 3+, debug.md says 2+)
- CHANGELOG version mismatch (`[1.7.1]` vs `17.1.0` everywhere else)
- E429 error code thrown but not defined in ErrorCodes enum or documented

The re-analysis revealed systemic patterns including:
- JSON.parse without try-catch in 8+ locations
- Global state mutation risks in 6 modules
- Silent failures in 7+ locations
- Cross-platform compatibility issues in 5 scripts
- Event listener leaks causing memory issues

### Architecture Diagram (UPDATED)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SPECKIT SYSTEM ARCHITECTURE                        │
│                        (Problem Areas Highlighted)                           │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   SKILL.md      │────▶│    Commands     │────▶│   Workflows     │
│  (Entry Point)  │     │  spec_kit/*.md  │     │  (Execution)    │
│  ⚠️ 19 issues    │     │  ⚠️ 18 issues    │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                      │                       │
         │              ┌───────┴───────┐               │
         │              ▼               ▼               │
         │      ┌─────────────┐ ┌─────────────┐         │
         │      │  Templates  │ │  References │         │
         │      │ (Scaffolds) │ │   (Docs)    │         │
         │      │ ⚠️ 15 issues │ │ ⚠️ 17 issues │         │
         │      └─────────────┘ └─────────────┘         │
         │                                              │
         ▼                                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         MCP SERVER                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │ context-    │  │   lib/      │  │  configs/   │◀── BROKEN   │
│  │ server.js   │  │ (modules)   │  │ (unused)    │   (8/10)    │
│  │ 🔴 CRITICAL │  │ ⚠️ 40+ issues│  └─────────────┘             │
│  │ Missing     │  └─────────────┘                              │
│  │ await!      │        │                                      │
│  └─────────────┘        ▼                                      │
│         │        ┌─────────────────────────────────────────────┐
│         ▼        │              SQLite Database                 │
│  ┌─────────────────────────────────────────────┐               │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐      │               │
│  │  │memories │  │triggers │  │checkpts │      │               │
│  │  │anchor_id│◀─┼─ NEVER  │  │         │      │               │
│  │  │ EMPTY   │  │POPULATED│  │         │      │               │
│  │  │         │  │         │  │ No TTL  │      │               │
│  │  │ No idx  │◀─┼─expires │  │last_used│      │               │
│  │  │on expire│  │  _at    │  │ ignored │      │               │
│  │  └─────────┘  └─────────┘  └─────────┘      │               │
│  └─────────────────────────────────────────────┘               │
└─────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                        SHARED MODULES                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │ embeddings/ │  │ vector-     │  │ hybrid-     │             │
│  │  factory.js │  │ index.js    │  │ search.js   │             │
│  │  (model ID  │  │  (wrong     │  │  (docs ≠    │             │
│  │   wrong)    │  │   model)    │  │   code)     │             │
│  │  No rate    │◀─┼─ batch API  │  │             │             │
│  │  limiting   │  │  calls      │  │             │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│         │                                                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │ Cache key   │  │ No rate     │  │ Query emb   │             │
│  │ collision   │◀─┼─ limiting   │  │ not cached  │             │
│  │ risk (16ch) │  │ for batch   │  │ (API waste) │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
└─────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                          SCRIPTS                                │
│  ⚠️ 26 new issues including:                                    │
│  - Signal handling missing (SIGTERM)                            │
│  - Cross-platform issues (macOS stat, xargs -r, perl timing)    │
│  - Race conditions in file operations                           │
│  - Hardcoded paths (/tmp, /Users/...)                          │
└─────────────────────────────────────────────────────────────────┘
```

### Quick Reference Guide

**When to use this research:**
- Planning bug fix sprints
- Understanding system architecture issues
- Prioritizing remediation work
- Onboarding new developers to known issues

**When NOT to use this research:**
- For implementing new features (see spec.md instead)
- For understanding intended behavior (see SKILL.md)

**Key considerations:**
- All file:line citations were accurate at time of research
- Line numbers may shift after fixes begin
- Some issues are interconnected (config system affects multiple modules)

### Research Sources

| Source Type | Description | Location | Credibility |
|-------------|-------------|----------|-------------|
| Code | MCP Server | `.opencode/skill/system-spec-kit/mcp_server/` | High |
| Code | Shared Modules | `.opencode/skill/system-spec-kit/shared/` | High |
| Code | Scripts | `.opencode/skill/system-spec-kit/scripts/` | High |
| Documentation | SKILL.md | `.opencode/skill/system-spec-kit/SKILL.md` | High |
| Documentation | Commands | `.opencode/command/spec_kit/*.md` | High |
| Documentation | References | `.opencode/skill/system-spec-kit/references/` | High |
| Templates | All templates | `.opencode/skill/system-spec-kit/templates/` | High |

---

## 4. DETAILED FINDINGS BY AREA

### Area 1: SKILL.md Analysis (Initial + Re-Analysis)

**Files Analyzed:**
- `.opencode/skill/system-spec-kit/SKILL.md`

#### Initial Findings (4 issues)

**Critical Finding: AGENTS.md Reference Error**
```
Location: SKILL.md lines 14, 100, 288, 303, 420-423, 714-715
Issue: References non-existent "AGENTS.md" file
Evidence: File search returns no results for AGENTS.md in project
Impact: Broken cross-references, agent confusion
Fix: Update to reference AGENTS.md or correct file
```

**Critical Finding: Debug Threshold Inconsistency**
```
Location: SKILL.md lines 543, 608
Issue: Documents "3+ failed fix attempts" for debug escalation
Conflict: debug.md line 237 says "2+ fix attempts"
Impact: Inconsistent agent behavior
Fix: Standardize on single value (recommend 3)
```

**Critical Finding: /memory:save Command Missing**
```
Location: SKILL.md lines 109, 421-426, 787-788
Issue: References /memory:save command extensively
Evidence: No .opencode/command/spec_kit/memory_save.md exists
Impact: Documented workflow doesn't work
Fix: Create memory_save.md command file
```

**High Finding: shared/ Directory Undocumented**
```
Location: SKILL.md (entire file)
Issue: No documentation of shared/ directory contents
Evidence: shared/ contains 8+ critical modules
Impact: Developers unaware of shared module purposes
Fix: Add shared/ section to SKILL.md
```

#### Re-Analysis Findings (19 NEW issues)

**Issue 1.1: MCP Server Tool Count Mismatch**
```
Location: SKILL.md Section 3 vs mcp_server/package.json
Issue: SKILL.md claims 14 tools, package.json says 13
Evidence: Actual count in context-server.js is 14
Impact: Inconsistent documentation
```

**Issue 1.2: scripts/ Directory Count Incorrect**
```
Location: SKILL.md line 278 vs scripts/README.md line 56
Issue: Conflicting module counts (44 vs 30)
Evidence: Different counting methodologies
Impact: Unclear architecture documentation
```

**Issue 1.3: Cognitive Memory Default Parameter Mismatch**
```
Location: SKILL.md line 151 vs MCP server README line 183
Issue: include_cognitive default: false vs true
Evidence: Conflicting default values
Impact: Unexpected behavior depending on which doc is followed
```

**Issue 1.4: Missing utils.js Reference in shared/**
```
Location: shared/README.md structure diagram
Issue: utils.js exists but not documented
Evidence: File exists at shared/utils.js
Impact: Developers unaware of utility functions
```

**Issue 1.5: MCP Server bin Entry Broken**
```
Location: mcp_server/package.json lines 7-8
Issue: References ./scripts/index-cli.js that doesn't exist
Evidence: Directory mcp_server/scripts/ doesn't exist
Impact: npm link/install fails
```

**Issue 1.6-1.19: Additional SKILL.md Issues**
- registry-loader.sh not in Key Scripts table
- Test fixture count wrong (10 vs 51 actual)
- Template subdirectories undocumented
- Cognitive memory module count unclear
- Missing CHANGELOG.md reference
- Reference file path inconsistencies
- SQL diagnostic command wrong table name
- Health endpoint reference invalid (stdio not HTTP)
- version string inconsistencies
- Missing config/ directory documentation

---

### Area 2: MCP Server Core (Initial + Re-Analysis)

**Files Analyzed:**
- `.opencode/skill/system-spec-kit/mcp_server/context-server.js`
- `.opencode/skill/system-spec-kit/mcp_server/lib/*.js`

#### Initial Findings (3 issues)

**Critical Finding: Config System Unused**
```
Location: mcp_server/configs/search-weights.json, mcp_server/lib/config-loader.js
Issue: 8 of 10 config sections never loaded or used
Sections Used: maxTriggersPerMemory, smartRanking (2/10)
Sections Unused: decay, semantic, vector, fts, importance,
                 coactivation, triggers, performance (8/10)
Impact: Config changes have no effect
```

**High Finding: Embedding Warmup Race Condition**
```
Location: context-server.js lines 2514-2522
Issue: embeddingModelReady flag may be stale
Impact: Early queries may fail
```

**High Finding: MCP Tool Parameters Not Exposed**
```
Location: context-server.js lines 1849-1920
Issue: includeWorkingMemory and sessionId not in tool schema
Impact: Advanced features inaccessible via MCP
```

#### Re-Analysis Findings (16 NEW issues)

**🔴 CRITICAL: Missing `await` on `formatSearchResults()`**
```
Location: context-server.js lines 1085, 1140, 1161
Issue: formatSearchResults() is async but called without await
Code:
  return formatSearchResults(results, 'multi-concept', includeContent);
  // Should be: return await formatSearchResults(...)
Impact: Returns Promise object instead of actual results!
        BREAKS memory_search when includeContent=true
Severity: CRITICAL - Production bug affecting core functionality
Fix: Add await before all three formatSearchResults() calls
```

**Issue 2.1: Potential Null Dereference in Database Queries**
```
Locations: context-server.js lines 1685, 1744, 1772
Issue: Unchecked .count access on query results
Code: const total = database.prepare(countSql).get(...countParams).count;
Impact: TypeError if query returns null
Fix: Add null checks: const result = query.get(); total = result?.count || 0;
```

**Issue 2.2: parseInt Without Radix Parameter**
```
Locations: context-server.js lines 285, 339
Issue: parseInt() without explicit radix
Code: const updateTime = parseInt(fs.readFileSync(DB_UPDATED_FILE, 'utf8'));
Impact: Potential octal interpretation issues
Fix: Always use parseInt(value, 10)
```

**Issue 2.3: Missing Validation on Numeric Parameters**
```
Locations: context-server.js lines 613-616, 660-663, 741-744, 791, 1021
Issue: limit parameter not validated for positive integer
Impact: Floating point or negative values cause unexpected behavior
Fix: Add validation: if (!Number.isInteger(limit) || limit < 1)
```

**Issue 2.4: Constitutional Cache Not Cleared on Reinitialize**
```
Location: context-server.js lines 162-164, 304-316
Issue: constitutional_cache not cleared when reinitializeDatabase() called
Impact: Stale data returned for up to 60 seconds after DB reinit
Fix: Clear constitutional_cache in reinitializeDatabase()
```

**Issue 2.5: triggerMatcher.clearCache() Not Called in handleMemoryIndexScan**
```
Location: context-server.js lines 2191-2333
Issue: After bulk indexing, trigger cache not cleared
Impact: New triggers not matched until cache expires (60 seconds)
Fix: Add triggerMatcher.clearCache() after indexing
```

**Issue 2.6: startupScanInProgress Mutex Never Checked**
```
Location: context-server.js lines 2347-2356
Issue: isStartupScanInProgress() defined but never called
Impact: Tools can execute during startup scan
Fix: Check mutex before tool execution
```

**Issue 2.7-2.16: Additional context-server.js Issues**
- Hardcoded CONSTITUTIONAL_CACHE_TTL (60000ms)
- Hardcoded INDEX_SCAN_COOLDOWN (60000ms)
- Hardcoded MAX_QUERY_LENGTH (10000)
- Hardcoded WARMUP_TIMEOUT (60000ms)
- Inconsistent error response format (line 1032 vs 999-1006)
- Redundant constitutional filtering logic (lines 1123-1138)
- Memory growth pattern in cognitive processing arrays
- Race condition in cognitive memory activation loop

---

### Area 3: lib/ Modules (Re-Analysis - 40+ NEW issues)

**Files Analyzed:**
- All 29 .js files in `.opencode/skill/system-spec-kit/mcp_server/lib/`

#### Summary by Category

| Category | Count | Most Affected Files |
|----------|-------|---------------------|
| Missing Error Propagation | 8 | history.js, temporal-contiguity.js |
| Silent Failures | 7 | access-tracker.js, config-loader.js |
| Global State Mutation | 6 | channel.js, reranker.js, vector-index.js |
| Inconsistent Error Handling | 4 | co-activation.js, checkpoints.js |
| Missing Input Validation | 4 | token-budget.js, checkpoints.js |
| Initialization Order Issues | 4 | channel.js, hybrid-search.js |
| Timer/Interval Cleanup | 2 | errors.js, vector-index.js |
| Event Listener Leaks | 1 | access-tracker.js |
| Circular Dependency Risk | 2 | embeddings.js, trigger-extractor.js |
| Memory Usage Concerns | 2 | trigger-matcher.js, checkpoints.js |

#### Detailed lib/ Findings

**access-tracker.js Issues:**
```
Line 123-135: Event listeners for exit/SIGINT/SIGTERM never removed
             If module hot-reloaded, listeners accumulate
Line 130-134: Silent failure in signal handlers (catch swallows errors)
Line 84-96: Missing error propagation in flush transaction
```

**channel.js Issues:**
```
Line 34-38, 57-61, 69-73: execSync without process.cwd()
                          Git commands may run in wrong directory
Line 17-19: Global state mutation (cached_branch, cache_expiry)
            Concurrent requests see inconsistent state
```

**history.js Issues (JSON.parse without try-catch):**
```
Line 115-118: JSON.parse in map callback can throw
Line 159-166: Same issue in get_recent_history
Line 193-194: Same issue in undo_last_change
Impact: Entire function throws on invalid JSON in any row
```

**temporal-contiguity.js Issues:**
```
Line 67-70: JSON.parse inside loop without try-catch
Line 107-110: Same issue in get_temporal_neighbors
Impact: Invalid trigger_phrases JSON crashes entire function
```

**errors.js Issues:**
```
Line 49-54: Timer in with_timeout never cleared
           If promise resolves before timeout, timer still fires
```

**vector-index.js Issues:**
```
Line 64-74: Potential infinite loop in get_confirmed_embedding_dimension
Line 176-180: Global singleton db can be overwritten
Line 213-236: Prepared statements cached forever, never cleared
Line 389-396: sqlite-vec load error silently degrades
Line 850-876: Transaction callback closures may have stale values
```

**summary-generator.js Issues:**
```
Line 235-243: JSON.parse in try-catch but error swallowed
            Returns empty array with no logging
```

**token-budget.js Issues:**
```
Line 12-15: parseInt/parseFloat on env vars without NaN checks
           Config will have NaN values if env var invalid
```

**checkpoints.js Issues (beyond initial findings):**
```
Line 26-35: init() returns boolean, others throw - inconsistent
Line 120-130: Buffer operations without length validation
Line 560-564: Float32Array conversion memory intensive
```

**retry-manager.js Issues (beyond initial finding):**
```
Line 27-28: Calls vector_index.initialize_db() potentially causing re-init
Line 338: require() inside async function
```

---

### Area 4: Scripts (Re-Analysis - 26 NEW issues)

**Files Analyzed:**
- All scripts in `.opencode/skill/system-spec-kit/scripts/`
- Including subdirectories: core/, extractors/, lib/, loaders/, renderers/, rules/, spec-folder/, utils/, tests/

#### Summary by Category

| Category | Count |
|----------|-------|
| Signal Handling | 3 |
| Cross-Platform Compatibility | 3 |
| Argument Validation | 2 |
| Race Conditions | 3 |
| Error Messages | 2 |
| Temp File Handling | 1 |
| Hardcoded Values | 3 |
| Missing Error Handling | 2 |
| Exit Code Handling | 2 |
| Dependencies | 2 |
| External Tool Dependencies | 2 |
| Security | 1 |

#### Detailed Script Findings

**Signal Handling Issues:**
```
generate-context.js: Missing SIGTERM handler for graceful shutdown
archive-spec.sh: No trap statement to clean up on SIGINT/SIGTERM
validate-spec.sh: No trap for cleanup during rule execution
Impact: Interrupted operations leave partial state
```

**Cross-Platform Compatibility Issues:**
```
archive-spec.sh:164 - macOS-specific stat command
  Code: date=$(stat -f "%Sm" ...) - macOS only
  Fix: Add proper Linux fallback with error handling

create-spec-folder.sh:196 - xargs without -r flag
  Code: ... | xargs -n1 basename
  Issue: On empty find, xargs runs basename with no args
  Fix: Use xargs -r (GNU extension) or handle empty case

test-validation.sh:91-101 - Perl dependency for millisecond timing
  Issue: Requires Time::HiRes module which may not be installed
  Fix: Better fallback handling
```

**Race Conditions:**
```
archive-spec.sh:137 - Non-atomic directory rename
  Code: mv "$spec_folder" "$ARCHIVE_DIR/$basename"
  Issue: Concurrent processes could move same folder
  Fix: Use flock or atomic rename pattern

create-spec-folder.sh:216-219 - TOCTOU race
  Issue: Folder could be deleted between check and use

create-spec-folder.sh:475 - git checkout without branch check
  Code: git checkout -b "$BRANCH_NAME"
  Issue: Fails if branch exists remotely
  Fix: Check branch existence first
```

**Hardcoded Values (NEW, beyond macOS path):**
```
data-loader.js:39-44 - Hardcoded /tmp Unix path
  Issue: Windows uses %TEMP%
  Fix: Use os.tmpdir()

archive-spec.sh:16 - Hardcoded project root depth
  Code: PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"
  Issue: Breaks if installed elsewhere
  Fix: Use marker file detection

test-validation.sh:16 - Hardcoded fixture path
  Issue: Tests fail if fixtures in different location
```

**Security Consideration:**
```
test-validation.sh:356-359 - CWE-78 potential
  Code: output=$(env $env_vars "$VALIDATOR" ...)
  Issue: Unquoted $env_vars could inject commands
  Impact: Low (test file only), but bad pattern
```

---

### Area 5: Templates (Re-Analysis - 15 NEW issues)

**Files Analyzed:**
- All 10 templates in `.opencode/skill/system-spec-kit/templates/`
- Reference files: template_guide.md, template_style_guide.md, level_specifications.md

#### Detailed Template Findings

**Issue 5.1: Cross-Reference Path Inconsistencies**
```
Location: plan.md line 355, tasks.md line 306
Issue: Reference absolute template path instead of relative spec folder path
Current: "See .opencode/skill/system-spec-kit/templates/checklist.md"
Should be: "See checklist.md" (relative to spec folder)
```

**Issue 5.2: Missing "WHEN TO USE" Sections**
```
Affected templates:
- handover.md - No "WHEN TO USE" section
- debug-delegation.md - No "WHEN TO USE" section
- implementation-summary.md - No "WHEN TO USE" section
Other templates have this guidance section
```

**Issue 5.3: Inconsistent Status Field Values**
```
spec.md line 18: Draft | In Review | Approved | In Progress | Complete
checklist.md line 23: Draft | In Progress | Completed
research.md line 30: In Progress | Completed | Archived
decision-record.md line 12: Proposed | Accepted | Deprecated | Superseded
level_specifications.md defines: draft | active | paused | complete | archived
Issue: No unified status vocabulary
```

**Issue 5.4: Date Format Inconsistency in spec.md Changelog**
```
Line 389, 394: Uses ([DATE]) placeholder
Line 415: Uses hardcoded (2025-01-15) example
Line 17: Uses [FORMAT: YYYY-MM-DD]
Should be consistent throughout
```

**Issue 5.5: handover.md Version Mismatch**
```
Line 2: <!-- SPECKIT_TEMPLATE_SOURCE: handover | v2.0 -->
All other templates: v1.0
No changelog explaining v2.0 changes
```

**Issue 5.6: Inconsistent Metadata Field Naming**
```
spec.md line 17: - **Created**: [FORMAT: YYYY-MM-DD]
plan.md line 16: - **Date**: [FORMAT: YYYY-MM-DD]
implementation-summary.md line 7: - **Completed:** [FORMAT: YYYY-MM-DD]
Should use consistent field name
```

**Issue 5.7: context_template.md Complex Section Numbering**
```
Lines 179, 220, 247, 284, 358, 445: Dynamic Mustache section numbering
Issue: Complex nested conditionals could produce incorrect numbering
       when only some optional sections exist
```

**Issue 5.8: research.md "WHEN TO USE" Position**
```
Lines 9-24: "WHEN TO USE" appears BEFORE metadata
All other templates: "WHEN TO USE" appears at END
Inconsistent positioning
```

**Issue 5.9: Template Marker Position Misalignment**
```
template_style_guide.md says: "First line of the template file"
Actual:
- spec.md, plan.md, tasks.md, checklist.md, decision-record.md: Line 5
- handover.md, debug-delegation.md: Line 2
- None follow "first line" guidance
```

---

### Area 6: Commands (Re-Analysis - 18 NEW issues)

**Files Analyzed:**
- All 7 command files in `.opencode/command/spec_kit/`
- All YAML assets in `.opencode/command/spec_kit/assets/`

#### Detailed Command Findings

**Issue 6.1: Step Count/Termination Mismatches**
```
complete.md:277 - Workflow table shows 14 steps
YAML files have inconsistent termination points

spec_kit_implement_auto.yaml:720-722 - Termination message mismatch
  after_step: 9 but message says "step 8 (save context)"

spec_kit_implement_confirm.yaml:812-814 - Same issue
```

**Issue 6.2: Cross-Command Step Numbering Inconsistency**
```
Same operation has different step numbers:
- complete.md: Step 11 = Development, Step 13 = Save Context
- implement.md: Step 6 = Development, Step 8 = Save Context
Makes cross-referencing confusing
```

**Issue 6.3: Confidence Checkpoints Differ Between MD and YAML**
```
complete.md:317-320: Key checkpoints "Steps 1, 3, 6, 10"
spec_kit_complete_confirm.yaml:315: "Steps 1, 3, 6, 10, 14"
YAML adds Step 14 not mentioned in MD
```

**Issue 6.4: handover.md Lacks Auto/Confirm YAML Pattern**
```
Only references spec_kit_handover_full.yaml
Other commands have _auto.yaml and _confirm.yaml variants
Breaks consistent command pattern
```

**Issue 6.5: MCP Tool Naming Issues**
```
resume.md:435 - Double prefix: "spec_kit_memory_memory_search"
Should be: "memory_search" or "spec_kit_memory_search"

resume.md:429-437 vs research.md:107 - Inconsistent naming
Some use full MCP prefix, others use short names
```

**Issue 6.6: Incomplete Conditional Branches**
```
resume.md:156-169 - Phase 3 IF branch lacks clear ELSE handling
resume.md:263-278 - Mixed bash/prose formatting in pseudocode
```

**Issue 6.7: Missing Error Handling Instructions**
```
research.md:107-109 - memory_match_triggers() no error handling
debug.md:171-186 - No fallback if model selection fails/times out
```

**Issue 6.8: Parallel Dispatch Configuration Gaps**
```
Different commands have different eligible phases without explanation:
- complete.md: step_6_analysis
- implement.md: step_6_development only
- plan.md: Steps 3 and 6
- research.md: Steps 3, 4, 5
No unified documentation of why they differ
```

---

### Area 7: References Documentation (Re-Analysis - 17 NEW issues)

**Files Analyzed:**
- All files in `.opencode/skill/system-spec-kit/references/`

#### Detailed Reference Findings

**Issue 7.1: Incorrect Importance Tier Weights**
```
Location: memory_system.md lines 39-46
Documented weights: 1.0, 1.0, 0.8, 0.5, 0.3, 0.1
Actual searchBoost: 3.0, 2.0, 1.5, 1.0, 0.5, 0.0
Values don't match any implementation
```

**Issue 7.2: Missing MCP Tools from Documentation**
```
memory_system.md lines 64-72 lists 7 tools
Actual context-server.js has 14 tools
Missing: memory_delete, memory_update, memory_stats,
         checkpoint_list, checkpoint_delete, memory_index_scan, memory_health
```

**Issue 7.3: memory_list sortBy Default Incorrect**
```
memory_system.md line 169: Default "created_at"
context-server.js: Default "created_at DESC"
Missing DESC ordering direction
```

**Issue 7.4: Fragile Hardcoded Reference**
```
trigger_config.md lines 100-101
References "Memory #132" - specific ID that changes on rebuild
```

**Issue 7.5: Level 1 Required Files Inconsistency**
```
level_specifications.md:44-47: spec.md, plan.md, tasks.md, implementation-summary.md
create-spec-folder.sh:6 comment: spec+plan+tasks (no implementation-summary)
Conflicting requirements
```

**Issue 7.6: FILE_EXISTS Validation Table Mismatch**
```
validation_rules.md:59-63 vs path_scoped_rules.md:58
Different Level 1 required files listed
```

**Issue 7.7: recommend-level.sh Usage Example Wrong**
```
execution_methods.md:130-134 shows:
  bash recommend-level.sh "Add user authentication"
Actual script requires --loc and --files flags
Example would fail
```

**Issue 7.8: recommend-level.sh Flags Incomplete**
```
execution_methods.md:137-143 shows 4 flags
Missing: --loc, --files, --json/-j, --help/-h
```

**Issue 7.9: Missing INPUT_LIMITS Documentation**
```
context-server.js:534-542 defines security limits:
  query: 10000, title: 500, specFolder: 200, etc.
Not documented anywhere
```

**Issue 7.10: Memory File Date Format Wrong**
```
folder_structure.md:193: 2024-01-15_session-summary.md (YYYY-MM-DD)
save_workflow.md:228-229: DD-MM-YY format
Contradictory formats
```

**Issue 7.11-7.17: Additional Reference Issues**
- Section numbering inconsistency in quick_reference.md
- ANCHOR format case inconsistency
- EVIDENCE_CITED patterns incomplete
- memory_search schema mismatch
- Archive prompt step incorrect
- Missing CONSTITUTIONAL_CACHE_TTL documentation
- Missing error code documentation

---

### Area 8: shared/ and database/ (Re-Analysis - 16 NEW issues)

**Files Analyzed:**
- `.opencode/skill/system-spec-kit/shared/`
- `.opencode/skill/system-spec-kit/database/`

#### Shared Module Findings

**Issue 8.1: Cache Key Collision Risk (MODERATE)**
```
Location: embeddings.js lines 18-19
Issue: Using only first 16 chars of SHA256
       Only 2^64 possible keys vs 2^256 for full hash
Impact: Potential cache collisions with large memory indices
Fix: Use longer key (at least 32 chars)
```

**Issue 8.2: No Rate Limiting for Batch API Calls (HIGH)**
```
Location: embeddings.js lines 139-157
Issue: No inter-batch delay for cloud providers
Impact: Can trigger rate limits under heavy load
Fix: Add configurable delay between batches for API providers
```

**Issue 8.3: Query Embedding Not Cached**
```
Location: embeddings.js lines 194-203
Issue: generate_query_embedding() doesn't cache
       generate_document_embedding() does cache
Impact: Repeated searches cause unnecessary API calls
Fix: Add query caching with appropriate TTL
```

**Issue 8.4: Inconsistent MAX_TEXT_LENGTH**
```
Locations:
- embeddings.js:317 - MAX_TEXT_LENGTH = 8000
- chunking.js:10 - MAX_TEXT_LENGTH = 8000
- hf-local.js:14 - this.max_text_length = 8000
Issue: Same constant defined independently in multiple places
Fix: Centralize constant definition
```

**Issue 8.5: Provider Fallback Only for OpenAI**
```
Location: factory.js lines 114-143
Issue: Fallback to hf-local only for OpenAI failures
       Voyage failures don't trigger fallback
Fix: Add Voyage fallback handling
```

**Issue 8.6: HF-Local Truncates Without Semantic Chunking**
```
Location: hf-local.js lines 124-127
Issue: Uses naive substring() truncation
       Main embeddings.js uses semantic_chunk()
Impact: Important end-of-document content lost
Fix: Use semantic chunking for all providers
```

#### Database Findings

**Issue 8.7: Missing ON DELETE CASCADE (DATA INTEGRITY)**
```
Location: vector-index.js lines 705-712
Issue: vec_memories has no FK relationship to memory_index
       memory_history has FK but no CASCADE
Impact: Orphaned vectors if delete transaction fails mid-way
Fix: Add proper FK constraints with CASCADE
```

**Issue 8.8: Schema Migration Not Idempotent**
```
Location: vector-index.js lines 321-331
Issue: Migration v3 catches "duplicate column" by string match
       SQLite message format could change
Fix: Check column existence before ALTER
```

**Issue 8.9: No Index on expires_at Column**
```
Location: vector-index.js line 698
Issue: expires_at column exists but no index
Impact: TTL queries do full table scan
Fix: CREATE INDEX idx_expires ON memory_index(expires_at)
```

**Issue 8.10: content_hash Column Not Used**
```
Location: vector-index.js line 697
Issue: Column indexed but never populated
       Intended for deduplication but not implemented
Fix: Implement or remove
```

**Issue 8.11: session_id Column Redundant**
```
Location: vector-index.js line 694
Issue: session_id in both memory_index and working_memory
       Creates potential for stale session references
```

**Issue 8.12: FTS5 Sync Triggers Missing Error Handling**
```
Location: vector-index.js lines 723-745
Issue: Triggers have no error handling
       FTS insertion failure aborts entire operation
```

**Issue 8.13: UNIQUE Constraint Includes Always-NULL anchor_id**
```
Location: vector-index.js line 701
Issue: UNIQUE(spec_folder, file_path, anchor_id)
       anchor_id always NULL makes this effectively UNIQUE(spec_folder, file_path)
       NULL values in UNIQUE treated specially in SQLite
```

**Issue 8.14-8.16: Additional Database Issues**
- Token estimation inconsistency (3.5 vs 4 chars per token)
- Export naming duplication (snake_case + camelCase)
- Provider singleton race condition

---

### Area 9: Assets and Configs (Re-Analysis - 15 NEW issues)

**Files Analyzed:**
- `.opencode/skill/system-spec-kit/assets/`
- `.opencode/skill/system-spec-kit/mcp_server/configs/`
- `.opencode/skill/system-spec-kit/constitutional/`

#### Asset Findings

**Issue 9.1: Broken Cross-References in All Asset Files**
```
Locations: level_decision_matrix.md:304-306, template_mapping.md:308-310, parallel_dispatch_config.md:84-85
Issue: Reference ../references/level_specifications.md
Actual: Should be ../references/templates/level_specifications.md
```

**Issue 9.2: ANCHOR Format Documentation Inconsistency**
```
Location: level_decision_matrix.md lines 210, 213
Documents: <!-- ANCHOR_START: id --> / <!-- ANCHOR_END: id -->
Validation: <!-- ANCHOR:id --> / <!-- /ANCHOR:id -->
Templates: <!-- ANCHOR:id --> / <!-- /ANCHOR:id -->
THREE different formats documented!
```

**Issue 9.3: Missing implementation-summary.md in Copy Commands**
```
Location: template_mapping.md lines 51-56
Issue: Level 1 Copy Commands omit implementation-summary.md
       But Required Files table shows it's required
```

#### Config Findings

**Issue 9.4: config-loader.js Default Config Mismatch**
```
Location: config-loader.js lines 52-58
Issue: Defaults use snake_case (hybrid_search, memory_decay)
       search-weights.json uses camelCase (hybridSearch, memoryDecay)
       deep_merge() won't properly merge due to key mismatch
```

**Issue 9.5: importance-tiers.js Ignores Config File Entirely**
```
Location: importance-tiers.js lines 12-58
Issue: IMPORTANCE_TIERS completely hardcoded
       search-weights.json importanceTiers section NEVER loaded
       Editing config has no effect
```

**Issue 9.6: RRF K Parameter Duplicated**
```
search-weights.json:9 - rrfK: 60
hybrid-search.js:111 - hardcoded 60
Config value ignored
```

**Issue 9.7: Performance Thresholds Unused**
```
search-weights.json:60-64 defines thresholds
No code checks these values
```

#### Constitutional Findings

**Issue 9.8: No Cross-References to AGENTS.md**
```
Neither README.md nor gate-enforcement.md links to AGENTS.md
Despite documenting same gates and rules
```

**Issue 9.9: Gate Numbering Discrepancy**
```
Constitutional file refers to "Gate 1" and "Gate 2"
AGENTS.md has 3-gate system with different numbering
```

**Issue 9.10: Token Budget Claim Unverified**
```
README.md:37 claims "~2000" token budget
importance-tiers.js:19 hardcodes maxTokens: 2000
tokenBudget config section unused (has maxTokens: 25000)
```

#### Root-Level File Findings

**Issue 9.11: README.md Command Count Inconsistency**
```
Line 15: "12 slash commands"
Line 35: "COMMANDS (7 TOTAL)"
Actual: 7 spec_kit + 3 memory = 10
```

**Issue 9.12: README.md Script Count Wrong**
```
Claims "11 scripts"
Actual: 10 .sh files in scripts root
```

**Issue 9.13: package.json Missing Script Wrappers**
```
Only 4 npm scripts defined
10 shell scripts exist
```

---

### Area 10: Cross-System Integration (Re-Analysis - 8 NEW issues)

**Files Analyzed:**
- Cross-references between AGENTS.md, SKILL.md, commands, and MCP server

#### Integration Findings

**Issue 10.1: Missing Checkpoint Routing in AGENTS.md**
```
Location: AGENTS.md Tool Routing Decision Tree
Issue: Checkpoints mentioned in triggers but not in routing
Impact: Users don't know where checkpoints fit in tool routing
```

**Issue 10.2: memory_search Required Param Not Emphasized**
```
Location: AGENTS.md quick reference
Issue: Doesn't emphasize REQUIRED query OR concepts parameter
SKILL.md line 476-486 explicitly warns about E040 error
Impact: Users encounter E040 errors
```

**Issue 10.3: checkpoint_restore Missing from resume.md**
```
Location: resume.md lines 421-427
Issue: Tool table lists create, list, delete but NOT restore
Evidence: Tool exists in context-server.js lines 1900-1921
Impact: Documented capability inaccessible
```

**Issue 10.4: YAML Asset Files Not Verified**
```
Location: Multiple command files
Issue: Commands reference YAML assets without verification
       No validation that YAML matches command documentation
Impact: Silent workflow failures if YAML out of sync
```

**Issue 10.5: Undocumented Tool Parameters**
```
Locations: SKILL.md vs context-server.js
Undocumented parameters:
- memory_update: allowPartialUpdate (line 1546)
- checkpoint_restore: clearExisting (line 1903)
- memory_index_scan: includeConstitutional (line 2192)
```

**Issue 10.6: E429 Error Code Not in Enum**
```
Location: context-server.js line 2222
Code: code: 'E429'
Issue: NOT defined in errors.js ErrorCodes (only E001-E041)
       NOT documented in troubleshooting.md
       HTTP-style code doesn't match E0xx pattern
```

**Issue 10.7: CHANGELOG Version Format Mismatch**
```
CHANGELOG.md uses: [1.7.1], [1.7.0], [1.6.0]...
Everything else uses: 17.1.0
Major version inconsistency
```

**Issue 10.8: Rate Limiting Documentation Missing**
```
context-server.js implements INDEX_SCAN_COOLDOWN (60s)
Returns E429 error
troubleshooting.md has no rate limiting section
Users have no guidance when hitting limits
```

---

## 5. PATTERNS IDENTIFIED (UPDATED)

### Systemic Pattern 1: Documentation-Code Drift

**Pattern Description:**
Documentation was written describing intended behavior, but implementation diverged. No automated validation ensures docs match code.

**Affected Areas:**
- Decay formula (time vs turn based)
- Re-embedding triggers
- Config system usage
- ANCHOR system
- Tool parameters
- Error codes

**Root Cause:**
- No doc-code consistency checks
- Documentation written before implementation finalized
- No update process when code changes

### Systemic Pattern 2: Dead Code / Unused Features

**Pattern Description:**
Features are designed, documented, and partially implemented but never connected to the system.

**Affected Areas:**
- Config system (8/10 sections unused)
- ANCHOR system (never populates database)
- Tool parameters (not exposed in schema)
- config-loader.js (never imported)

### Systemic Pattern 3: Error Handling Inconsistency

**Pattern Description:**
Different modules handle errors differently - some throw, some return silently, some return null.

**Affected Areas:**
- co-activation.init() returns silently
- retry-manager crashes on null
- template-renderer crashes on missing file
- checkpoints.init() returns boolean

### Systemic Pattern 4: Cross-Reference Rot

**Pattern Description:**
References to other files, sections, or features become invalid over time.

**Affected Areas:**
- AGENTS.md references (file doesn't exist)
- Failure Pattern #19 (only 1-18 exist)
- Step numbering discrepancies
- Asset file cross-references

### Systemic Pattern 5: JSON.parse Without Try-Catch (NEW)

**Pattern Description:**
JSON.parse called without error handling in callbacks and loops.

**Affected Areas (8 occurrences):**
- history.js lines 115-118, 159-166, 193-194
- temporal-contiguity.js lines 67-70, 107-110
- workflow.js lines 196-197
- summary-generator.js lines 235-243

### Systemic Pattern 6: Global State Mutation (NEW)

**Pattern Description:**
Modules use mutable global state that can cause race conditions.

**Affected Areas (6 modules):**
- channel.js - cached_branch/cache_expiry
- config-loader.js - cached_config
- reranker.js - _python_available
- vector-index.js - db singleton
- hybrid-search.js - db and vector_search_fn

### Systemic Pattern 7: Silent Failures (NEW)

**Pattern Description:**
Errors caught and swallowed without logging or propagation.

**Affected Areas (7 occurrences):**
- access-tracker.js signal handlers
- config-loader.js parse errors
- tier-classifier.js threshold validation
- vector-index.js sqlite-vec load
- summary-generator.js JSON parse

### Systemic Pattern 8: Cross-Platform Issues (NEW)

**Pattern Description:**
Code assumes Unix/macOS environment without Windows support.

**Affected Areas (5 scripts):**
- archive-spec.sh - macOS stat
- create-spec-folder.sh - xargs -r
- test-validation.sh - perl timing
- data-loader.js - hardcoded /tmp
- semantic-summarizer.js - /Users/ path

---

## 6. ROOT CAUSE ANALYSIS

### Critical Issue: Missing `await` on formatSearchResults()

**5 Whys Analysis:**

1. **Why** does memory_search return Promise objects?
   → formatSearchResults() is async but called without await

2. **Why** is it called without await?
   → The function was made async later to support file reading
   → Callers weren't updated

3. **Why** weren't callers updated?
   → No TypeScript to catch Promise<T> vs T mismatch
   → No integration tests for includeContent=true

4. **Why** no integration tests?
   → Feature added incrementally
   → Manual testing "worked" without includeContent

5. **Why** did manual testing work?
   → Without includeContent, formatSearchResults is synchronous
   → Bug only manifests with includeContent=true

**Root Cause:** Async function modification without updating all call sites
**Fix:** Add await to lines 1085, 1140, 1161

### Critical Issue: CHANGELOG Version Format

**5 Whys Analysis:**

1. **Why** is CHANGELOG using [1.7.1] format?
   → Different versioning scheme started

2. **Why** different scheme?
   → CHANGELOG was created before version standardized

3. **Why** not updated when version standardized?
   → No automated version sync
   → CHANGELOG updated manually

4. **Why** manual updates?
   → No semantic-release or similar tooling

5. **Why** no tooling?
   → Project evolved organically

**Root Cause:** Manual version management without sync
**Fix:** Update CHANGELOG to use 17.1.0 format

---

## 7. EVIDENCE REPOSITORY (UPDATED)

### Critical Code Evidence

```javascript
// Evidence E001: CRITICAL - Missing await (PRODUCTION BUG)
// File: mcp_server/context-server.js lines 1085, 1140, 1161
async function formatSearchResults(results, type, includeContent) {
  // ... reads files if includeContent=true
}

// BUG: All three calls missing await!
return formatSearchResults(results, 'multi-concept', includeContent); // Line 1085
return formatSearchResults(filteredResults, 'hybrid', includeContent); // Line 1140
return formatSearchResults(results, 'vector', includeContent); // Line 1161

// Evidence E002: Config loader never imported
// File: mcp_server/lib/attention-decay.js
const DECAY_RATE = 0.1; // Hardcoded, should use config.decay.rate

// Evidence E003: JSON.parse without try-catch pattern
// File: mcp_server/lib/history.js lines 115-118
const history = rows.map(row => ({
  ...row,
  prev_value: JSON.parse(row.prev_value), // Can throw!
  new_value: JSON.parse(row.new_value),   // Can throw!
}));

// Evidence E004: E429 error code not in enum
// File: mcp_server/context-server.js line 2222
return { error: true, code: 'E429', message: 'Rate limited' };
// File: mcp_server/lib/errors.js - E429 NOT DEFINED
const ErrorCodes = {
  EMBEDDING_FAILED: 'E001',
  // ... E001-E041 only, no E429
};
```

### Version Evidence

```markdown
<!-- Evidence V001: CHANGELOG version format -->
<!-- File: CHANGELOG.md lines 8, 37, 54, 73, 99, 114 -->
## [1.7.1] - 2026-01-15
## [1.7.0] - 2026-01-14
## [1.6.0] - 2026-01-02

<!-- File: package.json -->
"version": "17.1.0"

<!-- File: SKILL.md frontmatter -->
version: 17.1.0

<!-- File: context-server.js line 15 -->
// @version 17.1.0
```

### Database Evidence

```sql
-- Evidence DB001: ANCHOR never populated
SELECT COUNT(*) FROM memory_index WHERE anchor_id IS NOT NULL;
-- Result: 0

-- Evidence DB002: No index on expires_at
SELECT name FROM sqlite_master WHERE type='index' AND tbl_name='memory_index';
-- Result: No idx_expires or similar

-- Evidence DB003: Wrong embedding model recorded
SELECT DISTINCT embedding_model FROM memory_index;
-- Result: nomic-ai/nomic-embed-text-v1.5 (always, regardless of actual model)
```

---

## 8. RISK ASSESSMENT (UPDATED)

### Implementation Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Missing await fix introduces new async bugs | Low | High | Comprehensive async testing |
| Config changes break existing behavior | Medium | High | Comprehensive testing |
| ANCHOR implementation causes data migration | Low | Medium | Backward compatible design |
| JSON.parse fixes change error behavior | Medium | Low | Document error handling changes |
| Cross-platform fixes break macOS | Low | Medium | Test on both platforms |

### Dependency Risks

| Module | Depends On | Risk if Changed |
|--------|------------|-----------------|
| context-server.js | All lib modules | High - central hub |
| formatSearchResults | File system | High - async critical |
| config-loader.js | search-weights.json | Low - new addition |
| memory-parser.js | Database schema | Medium - schema change |

---

## 9. FULL ISSUE INVENTORY

### By Severity

**Critical (9 total):**
1. Missing `await` on formatSearchResults() - context-server.js:1085,1140,1161
2. Config system 8/10 sections unused
3. ANCHOR system non-functional (anchor_id never populated)
4. Debug threshold mismatch (3+ vs 2+)
5. /memory:save command missing
6. CHANGELOG version format mismatch ([1.7.1] vs 17.1.0)
7. E429 error code undefined and undocumented
8. No rate limiting for batch API calls
9. Missing ON DELETE CASCADE for vec_memories

**High (47 total):**
- MCP Server: Embedding warmup race, tool params not exposed, null dereferences
- lib/ modules: Event listener leaks, JSON.parse crashes, global state mutations
- Templates: Level contradictions, missing sections
- Commands: Step count mismatches, missing tools
- References: Wrong tier weights, missing tool docs
- shared/: Cache collisions, no query caching
- Integration: checkpoint_restore undocumented

**Medium (86 total):**
- See detailed findings per area above

**Low (89+ total):**
- Style inconsistencies
- Minor documentation gaps
- Cosmetic issues

---

## 10. CHANGELOG & UPDATES

### Version History

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2026-01-15 | 1.0.0 | Initial research completed | 10 parallel opus agents |
| 2026-01-15 | 2.0.0 | Re-analysis with ~190 new issues | 10 parallel opus agents |

### Research Timeline

| Phase | Time | Activity | Agents | Issues Found |
|-------|------|----------|--------|--------------|
| 1 | T+0 | Initial task distribution | Coordinator | - |
| 1 | T+1 | Parallel analysis | A1-A3, B1-B3, C1-C3 | ~41 |
| 1 | T+2 | Findings aggregation | Agent 10 | - |
| 2 | T+3 | Re-analysis dispatch | Coordinator | - |
| 2 | T+4 | Deep dive analysis | R1-R10 | ~190 |
| 2 | T+5 | Synthesis and update | Agent | ~231 total |

---

## APPENDIX

### Glossary

- **ANCHOR**: Section-level marker for fine-grained memory retrieval
- **MCP**: Model Context Protocol - server interface for AI tools
- **FTS**: Full-Text Search (SQLite feature)
- **LRU**: Least Recently Used (cache eviction strategy)
- **TTL**: Time To Live (expiration duration)
- **TOCTOU**: Time-of-check-time-of-use (race condition type)
- **CWE**: Common Weakness Enumeration (security vulnerability classification)

### File Index

| Category | Path | Files | Issues Found |
|----------|------|-------|--------------|
| MCP Server | mcp_server/context-server.js | 1 | 16+ |
| MCP Lib | mcp_server/lib/ | 29 | 40+ |
| MCP Config | mcp_server/configs/ | 1 | 8+ |
| Shared | shared/ | 8+ | 16 |
| Scripts | scripts/ | 10+ | 26 |
| Templates | templates/ | 10 | 15 |
| Commands | .opencode/command/spec_kit/ | 7 | 18 |
| References | references/ | 18+ | 17 |
| Assets | assets/ | 3 | 5 |
| Constitutional | constitutional/ | 2 | 4 |
| Root | package.json, README.md, CHANGELOG.md | 3 | 6 |

### Commands for Verification

```bash
# Check missing await (CRITICAL)
grep -n "formatSearchResults" .opencode/skill/system-spec-kit/mcp_server/context-server.js

# Check CHANGELOG version format
head -20 .opencode/skill/system-spec-kit/CHANGELOG.md

# Check E429 in ErrorCodes
grep -n "E429" .opencode/skill/system-spec-kit/mcp_server/lib/errors.js

# Check JSON.parse without try-catch
grep -rn "JSON.parse" .opencode/skill/system-spec-kit/mcp_server/lib/*.js | grep -v "try"

# Check config-loader usage
grep -r "config-loader" .opencode/skill/system-spec-kit/ --include="*.js"

# Check AGENTS.md references
grep -r "AGENTS.md" .opencode/skill/system-spec-kit/

# Check hardcoded paths
grep -rn "/Users/\|/tmp" .opencode/skill/system-spec-kit/ --include="*.js"

# Count lib/ modules
ls -1 .opencode/skill/system-spec-kit/mcp_server/lib/*.js | wc -l

# Check anchor_id population
sqlite3 .opencode/skill/system-spec-kit/database/context-index.sqlite \
  "SELECT COUNT(*) FROM memory_index WHERE anchor_id IS NOT NULL"
```

---
