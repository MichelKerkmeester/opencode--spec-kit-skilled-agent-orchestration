---
title: "OpenCode Configuration Directory"
description: "AI assistant configuration backbone containing agents, skills, commands, scripts and specs that power the OpenCode framework with persistent memory and structured documentation."
trigger_phrases:
  - "opencode config"
  - "opencode directory"
  - "agent definitions"
  - "skill modules"
  - "slash commands"
  - "gate system"
  - "framework structure"
importance_tier: "normal"
---

# `.opencode/`: AI Assistant Configuration Directory

> AI assistant configuration backbone containing agents, skills, commands, scripts and specs that power the OpenCode framework with persistent memory and structured documentation.

---

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. OVERVIEW](#1--overview)
- [2. DIRECTORY STRUCTURE](#2--directory-structure)
- [3. AGENTS OVERVIEW](#3--agents-overview)
- [4. SKILLS OVERVIEW](#4--skills-overview)
- [5. COMMANDS OVERVIEW](#5--commands-overview)
- [6. KEY CONFIGURATION FILES](#6--key-configuration-files)
- [7. MEMORY SYSTEM](#7--memory-system)
- [8. GATE SYSTEM](#8--gate-system)
- [9. GETTING STARTED](#9--getting-started)

<!-- /ANCHOR:table-of-contents -->

---

## 1. OVERVIEW
<!-- ANCHOR:overview -->

This directory serves as the configuration backbone of the OpenCode AI Assistant Framework. It contains agents, skills, commands, scripts, specs and configuration that power an AI coding assistant with persistent memory and structured documentation.

The framework is built on two core systems:

1. **Memory Engine**: 33 memory MCP tools across 7 layers, with 3-source indexing, 7-intent retrieval routing, schema v15 metadata (`document_type`, `spec_level`), document-type scoring, causal lineage tracking, typed-weighted degree channel, persistent embedding cache, query complexity routing, RSF fusion and confidence truncation
2. **Spec Kit Documentation Framework**: Structured documentation with 83 templates, 13 validation rules and Level 1-3+ CORE + ADDENDUM architecture

Together, these systems enable context-aware development with traceability, hardened retrieval behavior and session continuity through quality gates.

### Current Counts

| Category | Count | Details |
|---|---:|---|
| MCP Servers | 4 | Spec Kit Memory, CocoIndex Code, Code Mode, Sequential Thinking |
| MCP Tools | 40 | 33 memory + 7 code mode tools |
| Agents | 10 | Base agent definitions in `.opencode/agent/*.md` |
| Skills | 19 | Skill modules in `.opencode/skill/` (excluding `skill/scripts/`) |
| Commands | 22 | Markdown command entry points in `.opencode/command/` |
| Templates | 83 | Spec Kit CORE + ADDENDUM templates |
| YAML assets | 27 | Command execution YAML files |
| Validation rules | 13 | Spec folder validation scripts |
| Last Verified | 2026-03-27 | Counts refreshed against live repository state |

<!-- /ANCHOR:overview -->

---

## 2. DIRECTORY STRUCTURE
<!-- ANCHOR:directory-structure -->

```
.opencode/
├── agent/           — 10 specialized AI agent definitions for task delegation
├── command/         — 22 slash command entry points for workflow automation (spec_kit, memory, create, agent_router)
├── install_guides/  — Setup and configuration guides for framework installation
├── skill/scripts/   — Skill routing scripts (skill_advisor.py) and setup guides
├── skill/           — 19 domain expertise skill modules with bundled resources
└── specs/           — Spec folder storage for documentation and memory files
```

**Directory Descriptions:**

- **`agent/`**: Agent definition files (`.md`) that provide specialized capabilities for orchestration, research, debugging, code review, documentation and session handover.
- **`command/`**: Slash command definitions organized by domain (spec_kit, memory, create) that provide workflow shortcuts and automation.
- **`install_guides/`**: Comprehensive setup documentation including `SET-UP - AGENTS.md`, skill installation guides and configuration examples.
- **`skill/scripts/`**: Skill routing utilities including `skill_advisor.py` (routing engine) and setup guides. Agent provider scripts are in `agent/scripts/`.
- **`skill/`**: Self-contained skill modules with `SKILL.md` entry points, bundled references, scripts and assets for domain-specific workflows.
- **`specs/`**: Archived or system-level spec folders. User spec folders typically live in project root `/specs/`.

<!-- /ANCHOR:directory-structure -->

---

## 3. AGENTS OVERVIEW
<!-- ANCHOR:agents-overview -->

The framework includes 10 specialized agents plus 2 built-in agents:

This is a 12-agent / 4-runtime model (OpenCode, Claude, Codex, Gemini) with aligned role definitions.

| Agent | Description | When to Use |
|-------|-------------|-------------|
| `@orchestrate` | Task decomposition and multi-agent coordination | Complex requests needing delegation across multiple agents |
| `@context` | Codebase exploration and context retrieval (read-only) | ALL file search, pattern discovery and context loading tasks |
| `@debug` | Fresh-perspective debugging (4-phase methodology) | After 3+ failed debug attempts, stuck issues |
| `@deep-research` | Autonomous iterative research loop with externalized state | Deep multi-round investigation, evidence-based analysis |
| `@deep-review` | Autonomous iterative review loop with findings convergence | Multi-round release and quality audits |
| `@speckit` | Spec folder documentation (Level 1-3+) | Creating/updating spec folder docs (EXCLUSIVE for spec templates) |
| `@review` | Code review with 5-dimension quality scoring | PR reviews, pre-commit checks, code quality validation |
| `@write` | Documentation generation (READMEs, guides, skills) | Project-level docs outside spec folders |
| `@handover` | Session continuation and context preservation | Ending sessions, branching work, team handoffs |
| `@ultra-think` | Multi-strategy planning architect | Complex planning that benefits from comparing multiple solution strategies |
| `@general` | General implementation and complex tasks | Default agent for code implementation (built-in) |
| `@explore` | Fast codebase search and discovery | Quick file/pattern search (built-in) |

**Agent Routing:** Automatic via Gate 2 (`skill_advisor.py`) or manual via `@agent_name` syntax. Current agent state includes model-agnostic `@review`, Haiku-tier `@handover` and Codex profile-based agent frontmatter.

<!-- /ANCHOR:agents-overview -->

---

## 4. SKILLS OVERVIEW
<!-- ANCHOR:skills-overview -->

Skills are specialized, on-demand capabilities invoked for complex workflows:

| Skill | Description |
|-------|-------------|
| `system-spec-kit` | Spec folders, memory system, context preservation with CORE + ADDENDUM v2.2 architecture |
| `sk-doc` | Markdown quality enforcement, DQI scoring, templates, validation (v5.2) |
| `sk-git` | Git workflow orchestrator for worktrees, commits, PRs with read-only enforcement (v1.5) |
| `sk-code--web` | Frontend development lifecycle: implementation, debugging, verification (v1.0.9) |
| `sk-code--full-stack` | Multi-stack development with auto-detection (Go, Node.js, React, React Native, Swift) (v1.0) |
| `sk-code--review` | Stack-agnostic findings-first review baseline that layers with stack-specific code standards (v1.2.0.0) |
| `sk-code--opencode` | OpenCode system code standards for JS, TS, Python, Shell with language routing (v1.1.0.0) |
| `mcp-chrome-devtools` | Chrome DevTools orchestrator with CLI (bdg) and MCP (Code Mode) routing (v2.1) |
| `mcp-clickup` | ClickUp project-management orchestrator with CLI and Code Mode routing (v1.0) |
| `mcp-code-mode` | MCP orchestration via TypeScript execution for external tools (ClickUp, Figma, etc.) (v1.1) |
| `mcp-coco-index` | Semantic code search via vector embeddings for concept-first code discovery (v1.0) |
| `mcp-figma` | Figma design file access with 18 tools for components, styles, exports (v1.1) |
| `cli-gemini` | Gemini CLI orchestration for cross-AI tasks, web research via Google Search, architecture analysis (v1.1) |
| `cli-codex` | Codex CLI orchestration for cross-AI task delegation via OpenAI Codex, parallel code generation, and multi-agent task dispatch (v1.2.0) |
| `cli-claude-code` | Claude Code CLI orchestration enabling external AIs to invoke Claude Code for deep reasoning, extended thinking, code editing, and structured output (v1.0) |
| `cli-copilot` | Copilot CLI orchestration for multi-model tasks, cloud delegation, plan mode, autopilot, and repository memory (v1.2.0) |
| `sk-deep-research` | Autonomous deep-research loop protocol with iterative investigation and convergence handling (v1.0) |
| `sk-deep-review` | Autonomous iterative code review with severity-weighted findings, dimension coverage, convergence detection, and release readiness verdicts (v1.0) |
| `sk-prompt-improver` | Prompt optimization with 7 frameworks (RCAF, CoSTAR, TIDD-EC, CRISPE, CRAFT, DEPTH, RICCE) and CLEAR scoring (v1.0) |

**Skill Structure:** Each skill contains `SKILL.md` (entry point), `references/` (documentation), `scripts/` (automation) and `assets/` (templates/checklists).

<!-- /ANCHOR:skills-overview -->

---

## 5. COMMANDS OVERVIEW
<!-- ANCHOR:commands-overview -->

Commands are invoked with `/command_name` syntax in the chat interface.

### Spec Kit Commands (`/spec_kit:*`)

- `/spec_kit:plan`: 7-step planning workflow from research to task breakdown
- `/spec_kit:implement`: Implementation workflow with quality gates
- `/spec_kit:complete`: Full 14+ step workflow from research to completion
- `/spec_kit:deep-research`: Autonomous iterative research workflow with convergence tracking
- `/spec_kit:deep-review`: Autonomous iterative code review workflow with convergence tracking
- `/spec_kit:debug`: Debug delegation with model selection and task dispatch
- `/spec_kit:handover`: Session continuation with context preservation
- `/spec_kit:resume`: Resume existing spec folder work with context loading
- `/spec_kit:plan :with-phases`: Phase decomposition pre-workflow (integrated into plan and complete commands)

### Memory Commands (`/memory:*`)

- `/memory:save`: Save session context to memory files (auto-indexed)
- `/memory:manage`: Memory database maintenance plus shared-memory lifecycle (`shared` setup, spaces, memberships, rollout)
- `/memory:learn`: Constitutional memory manager for durable always-surface rules
- `/memory:search`: Unified retrieval + analysis: intent-aware search, epistemic baselines, causal graph, evaluation

### Create Commands (`/create:*`)

- `/create:agent`: Generate new agent definition file
- `/create:changelog`: Generate a changelog entry from recent work
- `/create:sk-skill`: Unified skill command (full-create, full-update, reference-only, asset-only)
- `/create:folder_readme`: Unified documentation command (`readme` and `install` operations)
- `/create:feature-catalog`: Rooted feature catalog package creation/update
- `/create:testing-playbook`: Rooted manual testing playbook package creation/update
- `/create:prompt`: Create or improve prompts with framework-based guidance

### Utility Commands

- `/agent_router`: Interactive agent selection for complex tasks

<!-- /ANCHOR:commands-overview -->

---

## 6. KEY CONFIGURATION FILES
<!-- ANCHOR:key-configuration-files -->

### `opencode.json` (project root)
Primary configuration file defining:
- MCP server connections (Spec Kit Memory, Code Mode, Sequential Thinking)
- Model selection and capabilities
- Custom keybindings and permissions
- Agent and skill registration

### `package.json` (project root, when present)
Node.js project manifest used by scripts and npm workflows:
- Script entry points (`npm run ...`) for framework tooling
- Dependency versions for local utilities and MCP-related helpers
- Engine constraints (Node/npm) where configured

### `.utcp_config.json` (project root)
Code Mode MCP configuration for external tools:
- Webflow API integration
- Figma API integration
- GitHub API integration
- ClickUp API integration
- Chrome DevTools Protocol integration

### `.codex/config.toml` (project root)
Codex profile and sub-agent dispatch configuration:
- 4 execution profiles (`fast`, `balanced`, `powerful`, `readonly`)
- `gpt-5.3-codex-spark` for fast tier, `gpt-5.3-codex` for other tiers
- `codex-specialized-subagents` MCP server for delegate-based agent dispatch

### `AGENTS.md` (project root)
System prompt defining:
- Mandatory gates (Understanding, Skill Routing, Spec Folder)
- Operational protocols (confidence thresholds, clarification framework)
- Agent routing rules and escalation paths
- Code quality standards and anti-patterns

<!-- /ANCHOR:key-configuration-files -->

---

## 7. MEMORY SYSTEM
<!-- ANCHOR:memory-system -->

The Spec Kit Memory MCP provides persistent context across sessions:

- **Storage:** Memory files in `specs/[###-name]/memory/` using ANCHOR format for structured retrieval
- **Engine:** SQLite + `sqlite-vec` with provider auto-detection (Voyage, OpenAI, HF Local)
- **Retrieval:** Hybrid search across vector, BM25, trigger matching and typed-weighted degree channels with RRF + RSF (Reciprocal Similarity Fusion) fusion, cross-encoder reranking, query complexity routing (simple/moderate/complex), confidence truncation (2x median gap), persistent embedding cache and interference scoring
- **Architecture:** 7-layer tool hierarchy (L1 Orchestration to L7 Maintenance)
- **Indexing:** 3 sources (spec memories, constitutional files, spec documents) with `includeSpecDocs: true` default
- **Schema:** v15 adds `document_type` and `spec_level` columns for document-type scoring and filtering
- **Features:** Constitutional tier, session deduplication, causal lineage tracking, temporal decay, learning analytics, typed retrieval contracts, artifact-class routing, adaptive fusion, append-only mutation ledger, extended retrieval telemetry, session-cognitive automation (attention-based decay, tiered content injection, co-activation of related memories), persistent embedding cache (SQLite `embedding_cache` table), interference scoring (TM-01 penalty), classification-based decay (TM-03 context-type + importance-tier multipliers), query complexity routing (simple/moderate/complex tier dispatch), RSF fusion (single-pair, multi-list, cross-variant alternatives to RRF), channel min-representation (QUALITY_FLOOR=0.2), confidence truncation (2x median gap, min 3 results), dynamic token budget (1500/2500/4000 by tier), cold-start N4 boost, min-max score normalization, co-activation fan-effect (sqrt divisor), CORRECTION/PREFERENCE signal categories, pre-flight token budget estimation, verify-fix-verify quality loop, spec folder description discovery and ~14 `SPECKIT_*` feature flags
- **Hardening (Spec126):** import-path fixes, `specFolder` filtering, metadata preservation, vector metadata plumbing and stable causal edge semantics

**Spec Kit workflow features:** `upgrade-level.sh`, auto-populate workflow, `check-placeholders.sh` and anchor tags.

**Memory File Format:** ANCHOR tags for semantic sections (`summary`, `state`, `decisions`, `context`, `artifacts`, `next-steps`, `blockers`).

**Unified Entry Point:** `memory_context()` provides intent-aware routing with 7 intents: `add_feature`, `fix_bug`, `understand`, `refactor`, `security_audit`, `find_spec`, `find_decision`.

<!-- /ANCHOR:memory-system -->

---

## 8. GATE SYSTEM
<!-- ANCHOR:gate-system -->

All AI interactions pass through 3 mandatory gates to ensure quality and traceability:

### Gate 1: Understanding + Context Surfacing (Soft Block)
- Trigger: Each new user message
- Action: `memory_match_triggers()` surfaces relevant context, parse intent, dual-threshold validation (confidence >= 0.70 AND uncertainty <= 0.35)
- Pass: Proceed to next gate
- Fail: Investigate (max 3 iterations) or escalate with options

### Gate 2: Skill Routing (Required for Non-Trivial Tasks)
- Trigger: Complex tasks
- Action: Run `skill_advisor.py "[request]" --threshold 0.8` OR cite user's explicit direction
- Pass: Confidence >= 0.8, MUST invoke recommended skill
- Fail: Confidence < 0.8, proceed with general approach

### Gate 3: Spec Folder (HARD BLOCK)
- Trigger: ANY file modification detected
- Action: Ask user: A) Use existing | B) Create new | C) Update related | D) Skip
- Pass: User provides A/B/C/D answer
- Fail: CANNOT use tools without answer
- Priority: Overrides soft blocks (ask BEFORE Gates 1-2 analysis)

**Enforcement:** Gate violations trigger self-correction protocol (STOP, Ask, Wait, Continue).

<!-- /ANCHOR:gate-system -->

---

## 9. GETTING STARTED
<!-- ANCHOR:getting-started -->

### Installation

1. **Review Setup Guide:** See `install_guides/README.md` for comprehensive setup instructions
2. **Configure MCP Servers:** Edit `opencode.json` to enable Spec Kit Memory MCP, Code Mode MCP and Sequential Thinking MCP
3. **Set Environment Variables:** Configure API keys for OpenAI (embeddings), external tools (Webflow, Figma, etc.)
4. **Initialize Memory Database:** Run `node .opencode/skill/system-spec-kit/scripts/dist/memory/setup-db.js`

### Using the Framework

**Invoking Skills:**
- Automatic: Gate 2 auto-routes based on `skill_advisor.py` confidence scores
- Manual: Reference skill name in request (e.g., "Use sk-doc to create README")

**Running Commands:**
- Type `/command_name` in chat interface (e.g., `/spec_kit:plan`, `/memory:save`)

**Creating Spec Folders:**
- Gate 3 triggers spec folder question on file modifications
- Choose Option A (existing), B (new), C (update related) or D (skip)
- Level selection (1-3+) auto-determined by LOC and complexity

**Memory Operations:**
- Save context: `/memory:save` or trigger via "save context" phrase
- Resume work: `/spec_kit:resume` or `memory_search({ specFolder, anchors: ['state', 'next-steps'] })`
- Explore memories: `memory_stats()`, `memory_list()`, `memory_health()`

### Common Workflows

- **File modification:** Gate 1, Gate 2, Gate 3 (ask spec folder), Load memory context, Execute
- **Research task:** `memory_match_triggers()`, `memory_context()`, Document findings
- **Resume session:** `/spec_kit:resume`, Review checklist, Continue work
- **End session:** `/spec_kit:handover`, Save context, Continuation prompt

### Further Reading

- **Agents:** Runtime sources in `.opencode/agent/`, with runtime copies under `.claude/agents/`, `.codex/agents/`, and `.gemini/agents/`
- **Skills:** `SKILL.md` in each `.opencode/skill/[skill-name]/` directory
- **Commands:** `.md` files in `.opencode/command/[domain]/[command-name].md`
- **Setup:** `.opencode/install_guides/` for installation and configuration

<!-- /ANCHOR:getting-started -->
