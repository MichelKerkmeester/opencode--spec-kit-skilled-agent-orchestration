---
title: "Spec: Context Loader Sub-Agent (@context_loader) [04--agent-orchestration/z_archive/007-explore-sub-agent/spec]"
description: "Create a dedicated agent definition file (context_loader.md) for the @context_loader sub-agent — a fast, read-only context retrieval agent that gathers codebase and memory conte..."
trigger_phrases:
  - "spec"
  - "context"
  - "loader"
  - "sub"
  - "agent"
  - "007"
  - "explore"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: Context Loader Sub-Agent (@context_loader)

> **Spec Folder:** `.opencode/specs/04--agent-orchestration/z_archive/007-explore-sub-agent/`
> **Status:** Complete
> **Level:** 2
> **Created:** 2026-02-10
> **Note:** Originally scoped as `@explore`, renamed to `@context_loader` during implementation (T4).

---

<!-- ANCHOR:executive-summary -->
## 1. Overview

Create a dedicated agent definition file (`context_loader.md`) for the `@context_loader` sub-agent — a fast, read-only context retrieval agent that gathers codebase and memory context before implementation begins. It is primarily consumed by the orchestrator.

**Implementation Note:** Originally scoped as `@explore` (to match the built-in `subagent_type`), the agent was renamed to `@context_loader` during implementation to better describe its role as a context retrieval specialist rather than a generic explorer. The built-in `subagent_type: "explore"` remains unchanged — `@context_loader` is an INTELLIGENCE LAYER on top of it, adding memory retrieval, structured output, thoroughness levels, Active Dispatch, and pattern analysis.

<!-- /ANCHOR:executive-summary -->

<!-- ANCHOR:problem -->
## 2. Problem Statement

The orchestrator (`orchestrate.md`) originally referenced `@explore` in 18+ locations — as a routing target, in the Agent Selection Matrix, in Exploration-First rules, and in task decomposition examples. However, unlike every other agent, it had NO dedicated agent definition file. It exists only as a bare built-in `subagent_type: "explore"` in the Task tool, which provides Glob/Grep/Read access but no structured behavior, output formatting, or intelligence layer.

**Gap (now resolved)**: No agent definition meant no structured behavior, no memory retrieval, no output format standardization, no thoroughness levels. The `@context_loader` agent definition resolves all of these.

<!-- /ANCHOR:problem -->

<!-- ANCHOR:requirements -->
## 3. Goals

| # | Goal | Success Metric |
|---|------|---------------|
| G1 | Create `context_loader.md` agent definition | File exists at `.opencode/agent/context_loader.md` |
| G2 | Define 3 thoroughness levels (quick/medium/thorough) | Each level has clear tool usage, time budget, and output size |
| G3 | Integrate Memory/Context retrieval | Agent uses Spec Kit Memory MCP alongside Glob/Grep/Read |
| G4 | Define structured output format | Context Package with Memory, Findings, Patterns, Gaps, Recommendations |
| G5 | Maintain READ-ONLY safety | Agent NEVER writes, edits, or creates files |
| G6 | Follow existing agent structural patterns | Frontmatter, numbered emoji sections, consistent with peers |
| G7 | Active Dispatch capability | Agent can dispatch @explore and @research for deeper context gathering |

<!-- /ANCHOR:requirements -->

<!-- ANCHOR:scope -->
## 4. Scope

### In Scope
- Create `.opencode/agent/context_loader.md` agent definition file
- Define agent identity, capabilities, retrieval modes, output format
- Follow structural patterns from research/research.md, write.md, review.md
- Define 3 thoroughness levels with clear routing logic
- Include Memory MCP integration (memory_match_triggers, memory_search, memory_context)
- Structured Context Package output format
- Active Dispatch protocol (dispatching @explore and @research sub-agents)
- Ecosystem integration (orchestrate.md, AGENTS.md files, skills, commands, install guides)

### Out of Scope
- Creating new MCP tools or scripts
- Modifying any existing agent files
- Implementation of any code features

<!-- /ANCHOR:scope -->

## 5. Constraints

| Constraint | Description |
|-----------|-------------|
| C1 | Must use `subagent_type: "explore"` (built-in Task tool type — not renamed) |
| C2 | Must be READ-ONLY (permission write: deny, edit: deny) |
| C3 | Must follow the frontmatter + numbered section pattern of existing agents |
| C4 | Must integrate with Spec Kit Memory MCP tools |
| C5 | Must support orchestrator's CWB output size constraints |
| C6 | Must NOT overlap with @research's deep investigation role (clear speed-vs-depth differentiation) |

## 6. Key Differentiator: @explore vs @research

| Dimension | @context_loader (was @explore) | @research (EXISTING) |
|-----------|---------------|---------------------|
| Speed | FAST (30s–5min) | THOROUGH (extended) |
| Depth | Surface scan + pattern detection | Deep 9-step investigation |
| Output | Structured context package | Full research/research.md document |
| Scope | Codebase + Memory retrieval | Technical investigation, feasibility |
| Trigger | EVERY task (pre-implementation) | Complex/uncertain tasks only |
| Purpose | "What exists?" + "What do we know?" | "What should we do?" + "Why?" |
| Sub-Dispatch | Yes (dispatches @explore, @research) | No (standalone) |
| Model | GPT-5.2-think-medium (reasoning-capable) | GPT-5.2-think (deep reasoning) |

<!-- ANCHOR:dependencies -->
## 7. Dependencies

| Dependency | Type | Description |
|-----------|------|-------------|
| orchestrate.md | Consumer | Primary consumer of @explore output |
| Spec Kit Memory MCP | Tool | Memory retrieval capabilities |
| Task tool (explore type) | Platform | Built-in subagent type for tool access |
| Existing agent patterns | Template | Structural consistency requirement |

<!-- /ANCHOR:dependencies -->
