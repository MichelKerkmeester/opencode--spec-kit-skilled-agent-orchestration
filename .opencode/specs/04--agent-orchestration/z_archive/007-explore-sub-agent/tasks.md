---
title: "Tasks: Context Loader Sub-Agent (@context_loader) [04--agent-orchestration/z_archive/007-explore-sub-agent/tasks]"
description: "Objective: Understand the structural template used by existing agent files"
trigger_phrases:
  - "tasks"
  - "context"
  - "loader"
  - "sub"
  - "agent"
  - "007"
  - "explore"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Context Loader Sub-Agent (@context_loader)

> **Spec Folder:** `.opencode/specs/04--agent-orchestration/z_archive/007-explore-sub-agent/`
> **Created:** 2026-02-10
> **Note:** Originally scoped as `@explore`, renamed to `@context_loader` during implementation.

---

<!-- ANCHOR:notation -->
## Task List

| # | Task | Status | Assignee | Priority | Depends On |
|---|------|--------|----------|----------|------------|
| T1 | Analyze existing agent structural patterns | ✅ Done | @explore | P0 | — |
| T2 | Design agent architecture (sequential thinking) | ✅ Done | Orchestrator | P0 | — |
| T3 | Create spec folder documentation (Level 2) | ✅ Done | @speckit | P0 | T1, T2 |
| T4 | Write context_loader.md agent definition | ✅ Done | @write | P0 | T3 |
| T5 | Add Active Dispatch capability (§5) | ✅ Done | Orchestrator | P0 | T4 |
| T6 | Bump dispatch limits (+1 medium, +1 thorough) | ✅ Done | Orchestrator | P1 | T5 |
| T7 | Update orchestrate.md references | ✅ Done | Orchestrator | P0 | T4 |
| T8 | Add Two-Tier Dispatch Model to orchestrate.md | ✅ Done | Orchestrator | P1 | T5, T7 |
| T9 | Update all 3 AGENTS.md files | ✅ Done | Orchestrator | P0 | T4 |
| T10 | Update spec folder tasks.md + checklist.md | ✅ Done | Orchestrator | P1 | T5-T9 |
| T11 | Final verification grep | ✅ Done | Orchestrator | P1 | T10 |
| T11a | Audit all 9 skill directories for agent references | ✅ Done | Orchestrator | P1 | T10 |
| T11b | Fix agent_template.md in sk-doc (add 3 missing agents) | ✅ Done | @general | P1 | T11a |
| T11c | Audit all 38 command/YAML files for agent references | ✅ Done | Orchestrator | P1 | T10 |
| T11d | Fix SET-UP - Opencode Agents.md install guide (16 changes) | ✅ Done | @general | P1 | T11c |
| T11e | Create symlink at .claude/agents/context_loader.md | ✅ Done | @general | P1 | T4 |
| T11f | Update spec.md and plan.md to reflect @context_loader rename | ✅ Done | @general | P2 | T11 |
| T12 | Create implementation-summary.md | ✅ Done | @write | P2 | T11f |

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Task Details

### T1: Analyze Existing Agent Patterns ✅

**Objective**: Understand the structural template used by existing agent files
**Findings**:
- 7 agent files exist in `.opencode/agent/`
- Common pattern: YAML frontmatter + numbered emoji sections
- Mandatory sections: Core Workflow, Capability Scan, Output Format, Anti-Patterns, Related Resources
- Permissions pattern varies: review.md is READ-ONLY (write: deny, edit: deny)
- Models vary: research uses gpt-5.2-think-high, write uses claude-sonnet-4.5, review uses claude-opus-4.6

### T2: Design Agent Architecture ✅

**Objective**: Deep analysis of what the agent should be
**Findings** (from Sequential Thinking):
- "Context Scout" — fast, read-only context retrieval
- 3 thoroughness levels: quick/medium/thorough
- 3 retrieval layers: Memory → Codebase → Deep Memory
- Structured Context Package output format
- READ-ONLY safety property (like @review)
- Clear differentiation from @research (speed vs depth)

### T3: Create Spec Documentation ✅

**Objective**: Level 2 spec folder with spec.md, plan.md, tasks.md, checklist.md
**Deliverables**: This spec folder

<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
### T4: Write context_loader.md ✅

**Objective**: Create the agent definition file
**Key Changes from Original Plan**:
- **Renamed**: `explore.md` → `context_loader.md` (better describes the role)
- **Path**: `.opencode/agent/context_loader.md` (~723 lines, 11 sections §1-§11)
- **Model changed**: `claude-sonnet-4.5` → `github-copilot/gpt-5.2-think-medium` (reasoning needed)
- **Permissions**: READ-ONLY enforced (`write: deny`, `edit: deny`)
- **Mode**: `subagent`
- Has all mandatory sections plus additional ones for dispatch protocol

### T5: Add Active Dispatch Capability ✅

**Objective**: Upgrade @context_loader with ability to dispatch sub-agents for deeper analysis
**Changes**:
- Added §5 Agent Dispatch Protocol to context_loader.md
- **Dispatch allowlist**: ONLY `@explore` (built-in fast search) and `@research` (deep investigation)
- ANALYSIS-ONLY boundary: never dispatch for implementation
- Permission changed: `task: deny` → `task: allow`
- Added structured dispatch prompt format and result collection

### T6: Bump Dispatch Limits ✅

**Objective**: Increase dispatch limits by +1 for medium and thorough modes
**Changes** (updated across 7 locations in context_loader.md):
- quick = 0 (unchanged per user decision)
- medium = 1 → **2**
- thorough = 2 → **3**
- Updated: mode definitions table, mermaid diagram, dispatch limits table, §5 "When to Dispatch", NEVER list, summary block, over-dispatching anti-pattern

<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
### T7: Update orchestrate.md References ✅

**Objective**: Replace `@explore` with `@context_loader` where appropriate in orchestrate.md
**Changes**:
- Added `@context_loader` row to Project-Specific Agents table
- Added "Context loading" and "Quick file search" rows to Agent Selection Matrix
- Rules 1 & 2: `@explore` → `@context_loader` for exploration-first and spec folder discovery
- File Existence Check verification action: `@context_loader` dispatch
- OnError trigger: `@context_loader` for investigation
- Example Task #1 (toast patterns): `@context_loader`
- Routing Logic #9: `@context_loader (context retrieval) or @explore (fast search)`
- Summary block, Pattern A examples, anti-pattern: updated to `@context_loader`

**9 Intentional @explore references retained** (reviewed and confirmed):
- Comparative text ("Preferred over raw @explore")
- Two-Tier Model describing dispatch relationship
- Example output text, template syntax, generic examples
- Routing logic showing both as valid options

### T8: Add Two-Tier Dispatch Model ✅

**Objective**: Document the two-tier dispatch model in orchestrate.md
**Location**: New subsection after Rule 3 (~line 265)
**Content**:
- Phase 1: UNDERSTANDING — @context_loader gathers context (dispatches @explore/@research)
- Phase 2: ACTION — Orchestrator dispatches implementation agents
- Includes dispatch limits (quick=0, medium=2, thorough=3)

### T9: Update All 3 AGENTS.md Files ✅

**Objective**: Add @context_loader to all AGENTS.md instances
**Files Updated**:
1. `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/AGENTS.md`
2. `/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com/AGENTS.md`
3. `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Barter/coder/AGENTS.md`
**Changes**: Added `@context_loader` row to agent table + "Context loading / exploration" entry in quick reference

### T10: Update Spec Folder Docs ✅

**Objective**: Bring tasks.md and checklist.md up to date with all completed work

<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:phase-4 -->
### T11: Final Verification Grep ✅

**Objective**: Search all modified files for any remaining misalignment between context_loader.md, orchestrate.md, and AGENTS.md files

### T11a: Audit All Skill Directories ✅

**Objective**: Search all 9 skill directories for agent references needing update after @context_loader rename
**Method**: 10 agents dispatched in parallel (1 discovery + 9 skill-specific searches)
**Findings**:
- 8/9 skills contained zero named agent references — completely clean
- 1 skill (`sk-doc`) had 2 outdated agent tables in `assets/opencode/agent_template.md`
- Zero stale `@explore` references found anywhere in skills directory
- Skills searched: system-spec-kit, workflows-code--web-dev, sk-code--full-stack, sk-code--opencode, sk-git, sk-doc, mcp-chrome-devtools, mcp-code-mode, mcp-figma

### T11b: Fix agent_template.md ✅

**Objective**: Add 3 missing agents to both agent tables in `sk-doc/assets/opencode/agent_template.md`
**Changes**:
- Table 1 (Current Production Agents, ~line 589): Added @context_loader, @general, @handover (6→9 rows)
- Table 2 (Agent Files, ~line 680): Added context_loader, general, handover (6→9 rows)
- Verified both tables now contain all 9 agents
- All existing rows preserved, alphabetical ordering maintained

### T11c: Audit All Command/YAML Files ✅

**Objective**: Search all 38 command files (18 .md + 20 .yaml) for agent references needing update
**Method**: 4 agents dispatched in parallel
**Findings**:
- All command files clean — no stale agent references
- 4× `subagent_type: explore` in spec_kit YAMLs correctly reference the built-in Task tool type (not the agent)
- Directories searched: `.opencode/command/create/` (12 files), `.opencode/command/spec_kit/` (21 files), `.opencode/command/memory/` (5 files), `.opencode/command/agent_router.md`

### T11d: Fix Install Guide ✅

**Objective**: Update `SET-UP - Opencode Agents.md` to include @context_loader references
**File**: `.opencode/install_guides/SET-UP - Opencode Agents.md`
**Changes** (16 total across 2 passes):
- **Pass 1** (8 changes): Added @context_loader to agent table, quick reference, `ls` output, directory tree, and 4 other locations
- **Pass 2** (8 changes): 3× REPLACE Quick Start references (`@explore` → `@context_loader`) + 5× ADD "prefer @context_loader" notes alongside factual @explore documentation
- Consolidated First Use items 3+4 into single @context_loader item, renumbered list

### T11e: Create Symlink ✅

**Objective**: Create symlink for @context_loader matching pattern of other agent symlinks
**Action**: Created `.claude/agents/context_loader.md` → `../../.opencode/agent/context_loader.md`
**Verification**: Symlink follows same relative path pattern as all other agent symlinks in `.claude/agents/`

### T11f: Update spec.md and plan.md ✅

**Objective**: Update spec.md and plan.md to reflect rename from @explore to @context_loader and expanded scope
**Changes**:
- spec.md: Title, status (→Complete), overview, problem statement, goals (+G7 Active Dispatch), scope (added ecosystem integration), constraints (clarified), differentiator table (+Sub-Dispatch row, model update)
- plan.md: Title, approach, architecture decision, sections table (§1-§9 → §1-§11), Phase 3 ecosystem integration added, frontmatter (model + task permission), risk table (+Active Dispatch misuse), rollback plan (ecosystem reverts)

<!-- /ANCHOR:phase-4 -->

<!-- ANCHOR:completion -->
### T12: Create implementation-summary.md ✅

**Objective**: Document final implementation details, key decisions, and deviations from original plan
**Deliverable**: `.opencode/specs/04--agent-orchestration/z_archive/007-explore-sub-agent/implementation-summary.md`
**Content**: 7 sections covering what was built, design decisions (7), deviations (6), files modified (12), verification results, Two-Tier architecture diagram, and exclusions

<!-- /ANCHOR:completion -->
