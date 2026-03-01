---
title: "Implementation Summary: Context Loader Sub-Agent (@context_loader) [007-explore-sub-agent/implementation-summary]"
description: "A dedicated agent definition file for @context_loader — a fast, read-only context retrieval sub-agent that gathers codebase and memory context before implementation work begins...."
trigger_phrases:
  - "implementation"
  - "summary"
  - "context"
  - "loader"
  - "sub"
  - "implementation summary"
  - "007"
  - "explore"
importance_tier: "normal"
contextType: "implementation"
---
# Implementation Summary: Context Loader Sub-Agent (@context_loader)

> **Spec Folder:** `.opencode/specs/05--agent-orchestration/z_archive/007-explore-sub-agent/`
> **Status:** Complete
> **Level:** 2
> **Created:** 2026-02-10
> **Note:** Originally scoped as `@explore`, renamed to `@context_loader` during implementation.

---

<!-- ANCHOR:metadata -->
## 1. What Was Built

A dedicated agent definition file for `@context_loader` — a fast, read-only context retrieval sub-agent that gathers codebase and memory context before implementation work begins. The agent adds an intelligence layer on top of the built-in `subagent_type: "explore"` Task tool type, providing structured output, memory retrieval, thoroughness levels, and Active Dispatch capability.

<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
### Primary Deliverable

**File:** `.opencode/agent/context_loader.md` (~723 lines, 11 sections)

| Property | Value |
|----------|-------|
| Model | `github-copilot/gpt-5.2-think-medium` |
| Mode | `subagent` |
| Permissions | READ-ONLY (`write: deny`, `edit: deny`, `task: allow`) |
| Thoroughness Levels | quick (30s) / medium (2min) / thorough (5min) |
| Active Dispatch | Dispatches `@explore` (built-in) and `@research` only |
| Dispatch Limits | quick=0, medium=2 max, thorough=3 max |
| Output Format | Structured "Context Package" |

### Agent Workflow

```
RECEIVE → MEMORY (Layer 1) → CODEBASE (Layer 2) → DISPATCH (if needed) → SYNTHESIZE → DELIVER
```

<!-- /ANCHOR:what-built -->

<!-- ANCHOR:decisions -->
## 2. Key Design Decisions

| # | Decision | Rationale | Alternatives Considered |
|---|----------|-----------|------------------------|
| D1 | Rename `@explore` → `@context_loader` | Better describes the role as context retrieval, not generic exploration | Keep `@explore` — rejected because it conflicted with built-in subagent_type name |
| D2 | Model: `gpt-5.2-think-medium` | Context retrieval benefits from reasoning capability for synthesis | `claude-sonnet-4.5` (original plan) — rejected as less suited for reasoning |
| D3 | Active Dispatch via `task: allow` | Enables deeper context gathering by dispatching @explore/@research | No dispatch (original plan) — too limiting for thorough mode |
| D4 | Strict dispatch allowlist | Prevents scope creep — ONLY @explore and @research, never implementation agents | Open dispatch — rejected for safety |
| D5 | Two-Tier Dispatch Model in orchestrator | Clear separation: @context_loader for UNDERSTANDING, orchestrator for ACTION | Single-tier — rejected as unclear responsibility boundary |
| D6 | READ-ONLY enforcement | Agent must never modify files — same safety model as @review | Allow write — rejected for safety |
| D7 | Dispatch limit bump (+1) | medium: 1→2, thorough: 2→3 after user feedback that original limits were too restrictive | Original limits — rejected as insufficient for thorough context gathering |

<!-- /ANCHOR:decisions -->

## 3. Deviations from Original Plan

| Aspect | Original Plan | Actual Implementation | Why |
|--------|--------------|----------------------|-----|
| Agent name | `@explore` / `explore.md` | `@context_loader` / `context_loader.md` | Avoids confusion with built-in `subagent_type: "explore"` |
| Model | `claude-sonnet-4.5` | `github-copilot/gpt-5.2-think-medium` | Reasoning capability needed for context synthesis |
| Sections | §1-§9 (9 sections) | §1-§11 (11 sections) | Added §1 Core Identity, §5 Agent Dispatch Protocol |
| Dispatch | `task: deny` (no sub-delegation) | `task: allow` (Active Dispatch) | Thoroughness levels needed deeper investigation capability |
| Scope | Agent file only | Agent + ecosystem integration | Rename required updating orchestrate.md, AGENTS.md, skills, commands, install guides |
| orchestrate.md | "No modification needed" | ~15 changes + Two-Tier Model subsection | Rename and Active Dispatch required orchestrator updates |

## 4. Files Modified

| # | File | Change Type | Description |
|---|------|------------|-------------|
| 1 | `.opencode/agent/context_loader.md` | Created | Agent definition (~723 lines, 11 sections) |
| 2 | `.opencode/agent/orchestrate.md` | Updated | @context_loader refs, Two-Tier Dispatch Model, ~15 changes |
| 3 | `AGENTS.md` (Public) | Updated | Added @context_loader row + quick reference |
| 4 | `AGENTS.md` (anobel.com) | Updated | Added @context_loader row + quick reference |
| 5 | `AGENTS.md` (Barter/coder) | Updated | Added @context_loader row + quick reference |
| 6 | `agent_template.md` (sk-doc) | Updated | Added @context_loader, @general, @handover to both agent tables |
| 7 | `SET-UP - Opencode Agents.md` | Updated | 16 changes across 2 passes (8+8) |
| 8 | `.claude/agents/context_loader.md` | Created | Symlink → `../../.opencode/agent/context_loader.md` |

### Spec Folder Files Updated

| # | File | Change |
|---|------|--------|
| 9 | `tasks.md` | Rewritten with T1-T12 (including T11a-T11f), all task details |
| 10 | `checklist.md` | Rewritten with 8 sections, 40+ items |
| 11 | `spec.md` | Updated for @context_loader rename and scope expansion |
| 12 | `plan.md` | Updated for @context_loader rename, Active Dispatch, Phase 3 |

<!-- ANCHOR:verification -->
## 5. Verification Results

### Audits Completed

| Audit | Scope | Result |
|-------|-------|--------|
| Skills directories | 9 skill directories | 8/9 clean, 1 fixed (agent_template.md) |
| Command files | 38 files (18 .md + 20 .yaml) | All clean |
| Install guides | SET-UP - Opencode Agents.md | 16 changes applied |
| @explore references in orchestrate.md | 9 remaining references | All reviewed, all intentional |

### Intentional @explore References (orchestrate.md)

9 references to `@explore` remain in orchestrate.md. All were individually reviewed and confirmed intentional:

- **Comparative text**: "Preferred over raw @explore"
- **Dispatch relationship**: Two-Tier Model describes dispatching @explore
- **Example output**: Attribution examples (`[found by @explore]`, `[verified via @explore]`)
- **Template syntax**: Generic task decomposition templates
- **Routing logic**: Both @context_loader and @explore listed as valid options
- **Reassignment example**: Generic failure handling example

### Verified Clean Directories

No changes needed in:
- `.opencode/skill/system-spec-kit/`
- `.opencode/skill/workflows-code--web-dev/`
- `.opencode/skill/sk-code--full-stack/`
- `.opencode/skill/sk-code--opencode/`
- `.opencode/skill/sk-git/`
- `.opencode/skill/mcp-chrome-devtools/`
- `.opencode/skill/mcp-code-mode/`
- `.opencode/skill/mcp-figma/`

<!-- /ANCHOR:verification -->

## 6. Architecture: Two-Tier Dispatch Model

```
┌─────────────────────────────────────────────────────────┐
│                    ORCHESTRATOR                          │
│                                                         │
│  Phase 1: UNDERSTANDING                                 │
│  ├─► @context_loader (context retrieval)                │
│  │     ├─► @explore (built-in fast search)              │
│  │     └─► @research (deep investigation)               │
│  │                                                      │
│  Phase 2: ACTION                                        │
│  ├─► @general (implementation)                          │
│  ├─► @write (documentation)                             │
│  ├─► @review (quality gates)                            │
│  ├─► @speckit (spec folders)                            │
│  ├─► @debug (stuck debugging)                           │
│  └─► @handover (session continuation)                   │
└─────────────────────────────────────────────────────────┘
```

**Key Principle:** @context_loader dispatches for UNDERSTANDING (gathering context), the orchestrator dispatches for ACTION (implementation, documentation, review). These tiers never cross — @context_loader never dispatches implementation agents.

<!-- ANCHOR:limitations -->
## 7. What's NOT Included

- No new MCP tools or scripts were created
- No existing agent files were modified (only the new context_loader.md and orchestrate.md)
- No changes to the built-in `subagent_type: "explore"` Task tool type
- No code implementation features — this was purely agent infrastructure work

<!-- /ANCHOR:limitations -->
