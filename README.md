<div align="left">

# OpenCode — AI Assistant Framework

[![GitHub Stars](https://img.shields.io/github/stars/MichelKerkmeester/opencode-spec-kit-framework?style=for-the-badge&logo=github&color=fce566&labelColor=222222)](https://github.com/MichelKerkmeester/opencode-spec-kit-framework/stargazers)
[![License](https://img.shields.io/github/license/MichelKerkmeester/opencode-spec-kit-framework?style=for-the-badge&color=7bd88f&labelColor=222222)](LICENSE)
[![Latest Release](https://img.shields.io/github/v/release/MichelKerkmeester/opencode-spec-kit-framework?style=for-the-badge&color=5ad4e6&labelColor=222222)](https://github.com/MichelKerkmeester/opencode-spec-kit-framework/releases)

> Multi-agent AI development framework with cognitive memory, structured documentation and 22 commands — built for OpenCode, Claude Code, ChatGPT and Gemini CLI.
>
> 99.999% of people won't try this system. Beat the odds?
> Don't reward me with unwanted coffee: https://buymeacoffee.com/michelkerkmeester

</div>

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. QUICK START](#2--quick-start)
- [3. STRUCTURE](#3--structure)
- [4. SPEC KIT DOCUMENTATION](#4--spec-kit-documentation)
- [5. MEMORY ENGINE](#5--memory-engine)
- [6. AGENT NETWORK](#6--agent-network)
- [7. COMMAND ARCHITECTURE](#7--command-architecture)
- [8. SKILLS LIBRARY](#8--skills-library)
- [9. GATE SYSTEM](#9--gate-system)
- [10. CODE MODE MCP](#10--code-mode-mcp)
- [11. CONFIGURATION](#11--configuration)
- [12. USAGE EXAMPLES](#12--usage-examples)
- [13. TROUBLESHOOTING](#13--troubleshooting)
- [14. FAQ](#14--faq)
- [15. RELATED DOCUMENTS](#15--related-documents)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### What is OpenCode?

AI coding assistants have amnesia. Every session starts from zero. You explain your architecture Monday. By Wednesday, it's gone. This framework fixes that.

OpenCode is a multi-agent AI development framework built on top of the [OpenCode](https://github.com/sst/opencode) platform. It adds structured documentation (Spec Kit), a cognitive memory engine (MCP server), 11 coordinated agents, 22 commands and 18 specialized skills. Every session is documented, searchable, recoverable and auditable — across four AI runtimes.

**Who it's for:** Developers using AI assistants who are tired of re-explaining context every session and watching decisions disappear into chat history.

### Key Statistics

| Category | Count | Details |
|----------|-------|---------|
| Agents | 11 | 2 built-in + 9 custom (multi-runtime) |
| Skills | 18 | Code, docs, git, prompts, MCP, research, cross-AI |
| Commands | 22 | 8 spec_kit + 6 memory + 7 create + 1 utility |
| MCP tools | 40 | 33 memory + 7 code mode |
| Gates | 3 | Understanding, Skill Routing, Spec Folder |
| Runtimes | 4 | OpenCode, Claude Code, ChatGPT, Gemini CLI |
| Templates | 81 | CORE + ADDENDUM v2.2 |

### How It All Connects

```
┌──────────────────────────────────────────────────────────────┐
│                      YOUR REQUEST                            │
└──────────────────────┬───────────────────────────────────────┘
                       ▼
┌──────────────────────────────────────────────────────────────┐
│  GATE SYSTEM (3 mandatory gates)                             │
│  Gate 1: Understanding ─► Gate 2: Skill Routing ─► Gate 3:   │
│  Context surfacing        Auto-load expertise      Spec      │
│  Dual-threshold           skill_advisor.py         folder    │
│  validation               confidence >= 0.8        HARD BLOCK│
└──────────────────────┬───────────────────────────────────────┘
                       ▼
         ┌─────────────┴──────────────┐
         ▼                            ▼
┌─────────────────┐        ┌─────────────────────┐
│  AGENT NETWORK  │        │  SKILLS LIBRARY     │
│  11 specialized │        │  18 domain skills   │
│  agents with    │◄──────►│  auto-loaded by     │
│  routing logic  │        │  task keywords      │
└────────┬────────┘        └──────────┬──────────┘
         │                            │
         ▼                            ▼
┌──────────────────────────────────────────────────────────────┐
│  MEMORY ENGINE (40 MCP tools: 33 memory + 7 code mode)       │
│  Cognitive tiers ─ Causal graphs ─ Unified Context Engine    │
│  5-channel hybrid: Vector + BM25 + FTS5 + Graph + Degree     │
│  MMR diversity ─ TRM confidence gating ─ query expansion     │
│  Sources: spec memory + constitutional + spec documents      │
│  Embeddings: Voyage | OpenAI | HuggingFace Local (free)     │
└──────────────────────┬───────────────────────────────────────┘
                       ▼
┌──────────────────────────────────────────────────────────────┐
│  SPEC KIT (documentation framework)                          │
│  specs/###-feature/  ─  memory/  ─  scratch/                │
│  4 levels ─ 81 templates ─ 13 validation rules              │
└──────────────────────────────────────────────────────────────┘
```

### Role-Based Navigation

| I want to... | Start here |
|---|---|
| Get started with the framework | [Quick Start](#2--quick-start) |
| Understand the folder structure | [Structure](#3--structure) |
| Learn about the spec folder workflow | [Spec Kit Documentation](#4--spec-kit-documentation) |
| Understand the memory system | [Memory Engine](#5--memory-engine) |
| See all agents and their roles | [Agent Network](#6--agent-network) |
| Browse available commands | [Command Architecture](#7--command-architecture) |
| Find the right skill for a task | [Skills Library](#8--skills-library) |
| Understand how requests are validated | [Gate System](#9--gate-system) |
| Work with external tools (Figma, GitHub, etc.) | [Code Mode MCP](#10--code-mode-mcp) |
| Configure the framework | [Configuration](#11--configuration) |

### Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| [OpenCode](https://github.com/sst/opencode) | v1.0.190+ | Latest |
| Node.js | v18+ | v20+ |
| npm | v9+ | v10+ |

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:quick-start -->
## 2. QUICK START

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/MichelKerkmeester/opencode-spec-kit-framework.git
cd opencode-spec-kit-framework

# 2. Install dependencies
npm install

# 3. Build the memory server scripts
cd .opencode/skill/system-spec-kit/mcp_server && npm install && npm run build
cd ../../../../

# 4. Build the CLI scripts
cd .opencode/skill/system-spec-kit/scripts && npm install && npm run build
cd ../../../../
```

### Set Up Embedding Provider

The memory engine requires an embedding provider. Choose one:

```bash
# Option A: Voyage AI (recommended — best quality)
export VOYAGE_API_KEY="your-key-here"

# Option B: OpenAI embeddings
export OPENAI_API_KEY="your-key-here"

# Option C: HuggingFace Local (free, no API key needed)
# No setup required — auto-detected when no API keys are set
```

### Verify Installation

```bash
# Check that the memory server builds correctly
node .opencode/skill/system-spec-kit/mcp_server/dist/context-server.js --help

# Expected: help output with available options
```

### First Use

Open OpenCode in your project directory. The framework is active. Try:

```
/spec_kit:complete Build a user authentication system
```

This creates a spec folder, runs research, builds a plan and begins implementation — all with memory saved automatically.

<!-- /ANCHOR:quick-start -->

---

<!-- ANCHOR:structure -->
## 3. STRUCTURE

```
opencode-spec-kit-framework/
├── .opencode/                    # OpenCode runtime (source of truth)
│   ├── agent/                   # Agent definitions (OpenCode + ChatGPT)
│   ├── command/                 # 22 commands (.md entry points)
│   │   ├── spec_kit/            # 8 spec workflow commands
│   │   ├── memory/              # 7 memory commands
│   │   └── create/              # 5 creation commands
│   ├── skill/                   # 18 skills
│   │   ├── system-spec-kit/     # Documentation + memory MCP server
│   │   ├── sk-doc/              # Markdown quality and templates
│   │   ├── sk-code--*/          # Code workflow skills (3)
│   │   ├── mcp-*/               # MCP integration skills (5)
│   │   └── cli-*/               # Cross-AI CLI skills (4)
│   └── specs/                   # Active spec folders
│       ├── 01--[project]/       # Project-specific specs
│       └── 02--system-spec-kit/ # Framework development specs
├── .claude/agents/              # Claude Code agent adapters (9 files)
├── .gemini/agents/              # Gemini CLI agent adapters (9 files)
├── CLAUDE.md                    # Gate definitions + behavior rules
├── AGENTS.md                    # Agent routing + capability reference
└── opencode.json                # MCP server configuration
```

### Key Files

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Primary behavior framework — gates, skills, coding rules |
| `AGENTS.md` | Agent definitions, routing logic, capability reference |
| `opencode.json` | MCP server bindings and configuration |
| `.utcp_config.json` | Code Mode external tool registrations |
| `.opencode/skill/system-spec-kit/mcp_server/` | Memory MCP server source and build |
| `.opencode/skill/system-spec-kit/scripts/` | CLI scripts for memory and validation |

<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:spec-kit -->
## 4. SPEC KIT DOCUMENTATION

The Spec Kit is a documentation framework that enforces structured spec folders for every file change. It prevents undocumented edits and builds a searchable history of all work.

**Core idea:** Before any file modification, you must have a spec folder. That folder captures the spec, plan, tasks and implementation summary. Memory files inside the folder are auto-indexed.

### Documentation Levels

| Level | LOC | Required Files | Use When |
|-------|-----|----------------|----------|
| **1** | <100 | spec.md, plan.md, tasks.md, implementation-summary.md | All features (minimum) |
| **2** | 100-499 | Level 1 + checklist.md | QA validation needed |
| **3** | 500+ | Level 2 + decision-record.md | Complex architecture changes |
| **3+** | 80+ complexity | Level 3 + AI protocols, sign-offs | Multi-agent, enterprise governance |

### Spec Folder Layout

```
specs/###-feature-name/
├── spec.md                   # What to build and why
├── plan.md                   # How to build it
├── tasks.md                  # Checklist of work items
├── implementation-summary.md # Written after completion
├── checklist.md              # Level 2+: QA verification items
├── decision-record.md        # Level 3+: ADR-style decisions
├── memory/                   # Auto-indexed context files
│   └── metadata.json         # Memory index metadata
└── scratch/                  # Temporary working notes
```

For the full spec folder workflow, template architecture (81 templates, CORE + ADDENDUM v2.2) and validation rules, see the [Spec Kit README](.opencode/skill/system-spec-kit/README.md).

<!-- /ANCHOR:spec-kit -->

---

<!-- ANCHOR:memory-engine -->
## 5. MEMORY ENGINE

The Memory Engine is a local-first cognitive memory system built as an MCP server. It gives AI assistants persistent, searchable context across sessions — without any cloud dependency.

**How it works:** Memory files are created via `generate-context.js` and stored in spec folders. The MCP server indexes them with vector embeddings, BM25 and FTS5 full-text search. When you start a session, `memory_match_triggers()` surfaces relevant prior context automatically.

### Memory Retrieval

| Channel | Technique | Strength |
|---------|-----------|----------|
| Vector | Semantic similarity (Voyage/OpenAI/HuggingFace) | Conceptual matches |
| BM25 | Term frequency ranking | Keyword precision |
| FTS5 | SQLite full-text search | Exact phrase matching |
| Graph | Causal graph traversal | Relationship-aware retrieval |
| Degree | Node connectivity ranking | Hub and authority detection |
| Fusion | RRF + MMR diversity + TRM confidence gating | Best of all five |

### Embedding Providers

| Provider | Setup | Notes |
|----------|-------|-------|
| Voyage AI | `VOYAGE_API_KEY` env var | Best quality, recommended |
| OpenAI | `OPENAI_API_KEY` env var | Strong alternative |
| HuggingFace Local | No setup needed | Free, auto-detected fallback |
| Auto-detection | None | Picks best available provider |

**Local-first:** The memory database runs on your machine at `.opencode/skill/system-spec-kit/shared/mcp_server/database/`. No data leaves your system unless you configure a cloud embedding provider.

For the complete memory API (33 tools), pipeline architecture and retrieval configuration, see the [MCP Server README](.opencode/skill/system-spec-kit/mcp_server/README.md).

<!-- /ANCHOR:memory-engine -->

---

<!-- ANCHOR:agent-network -->
## 6. AGENT NETWORK

11 agents total: 2 built-in OpenCode agents and 9 custom agents. Custom agents are defined in `.opencode/agent/` (source of truth) and adapted for Claude Code (`.claude/agents/`), ChatGPT (`.opencode/agent/chatgpt/`) and Gemini CLI (`.gemini/agents/`).

### All 11 Agents

| Agent | Model | Type | Role |
|-------|-------|------|------|
| `@general` | Platform default | Built-in | General implementation and complex coding tasks |
| `@explore` | Platform default | Built-in | Quick codebase exploration and file discovery |
| `@orchestrate` | opus | Custom | Senior task commander — decomposes work, delegates to sub-agents, synthesizes results. Uses circuit breaker, saga compensation, quality gates and checkpointing |
| `@context` | sonnet | Custom | Memory-first retrieval specialist — exclusive entry point for ALL codebase exploration. Read-only. Surfaces Context Packages. Never writes or modifies files |
| `@speckit` | sonnet | Custom | Spec folder documentation specialist — EXCLUSIVE agent for writing `*.md` inside spec folders. Template-first, CORE + ADDENDUM architecture |
| `@debug` | opus | Custom | Fresh-perspective debugging specialist — 5-phase methodology (Observe, Analyze, Hypothesize, Validate, Fix). Starts with no prior context to prevent bias |
| `@deep-research` | opus | Custom | Autonomous deep research loop specialist — iterative evidence gathering with externalized state. May write `research.md` inside spec folders |
| `@review` | opus | Custom | Code quality guardian — READ-ONLY. Findings-first severity analysis, security assessment, baseline + overlay standards contract |
| `@write` | sonnet | Custom | Documentation generation specialist — template-first, DQI-compliant. Creates READMEs, skills, guides. Must NOT write inside spec folders |
| `@handover` | sonnet | Custom | Session continuation specialist — creates `handover.md` for context preservation across sessions |
| `@ultra-think` | opus | Custom | Multi-strategy planning architect — dispatches N diverse thinking strategies (Analytical, Creative, Critical, Pragmatic, Holistic). Planning only, never modifies files |

### Runtime Agent Directories

| Runtime | Directory | Notes |
|---------|-----------|-------|
| OpenCode (default) | `.opencode/agent/` | Source of truth |
| Claude Code | `.claude/agents/` | 9 adapter files |
| ChatGPT | `.opencode/agent/chatgpt/` | 9 adapter files |
| Gemini CLI | `.gemini/agents/` | 9 adapter files |

<!-- /ANCHOR:agent-network -->

---

<!-- ANCHOR:command-architecture -->
## 7. COMMAND ARCHITECTURE

22 commands across 4 namespaces. Each command is a two-layer system: a Markdown entry point (`.opencode/command/*.md`) for input collection and routing, backed by a behavioral execution spec.

### spec_kit/ — 8 Commands

| Command | Purpose |
|---------|---------|
| `/spec_kit:complete` | Full workflow: spec, plan, implement, verify |
| `/spec_kit:plan` | Planning only, no implementation |
| `/spec_kit:implement` | Execute an existing plan |
| `/spec_kit:phase` | Decompose a spec into phased child folders |
| `/spec_kit:debug` | Delegate debugging to fresh-perspective sub-agent |
| `/spec_kit:resume` | Continue a previous session (auto-loads memory) |
| `/spec_kit:deep-research` | Autonomous deep research loop with iterative investigation and convergence detection |
| `/spec_kit:handover` | Create session handover (`:quick` or `:full` variants) |

### memory/ — 6 Commands

| Command | Purpose |
|---------|---------|
| `/memory:save` | Save context via `generate-context.js` |
| `/memory:continue` | Session recovery from crash or compaction |
| `/memory:analyze` | Unified retrieval + analysis: intent-aware search, epistemic baselines, causal graph, ablation, dashboard |
| `/memory:learn` | Constitutional memory manager (list, edit, remove, budget) |
| `/memory:manage` | Database operations: stats, health, cleanup, checkpoints |
| `/memory:shared` | Shared memory: create, member, status (deny-by-default governance) |

### create/ — 7 Commands

| Command | Purpose |
|---------|---------|
| `/create:sk-skill` | Unified skill workflows (create, update, file) |
| `/create:agent` | Scaffold a new agent definition |
| `/create:folder_readme` | Unified README and install guide creation |
| `/create:changelog` | Create changelog entry from recent work |
| `/create:prompt` | Create or improve AI prompts with structured frameworks |
| `/create:feature-catalog` | Create or update feature catalog packages |
| `/create:testing-playbook` | Create or update manual testing playbook packages |

### Utility — 1 Command

| Command | Purpose |
|---------|---------|
| `/agent_router` | Route requests to AI systems with full System Prompt identity adoption |

<!-- /ANCHOR:command-architecture -->

---

<!-- ANCHOR:skills-library -->
## 8. SKILLS LIBRARY

18 skills in `.opencode/skill/`. Skills are on-demand capabilities loaded when a task matches. Gate 2 runs `skill_advisor.py` to recommend the right skill (confidence >= 0.8 means it must be loaded).

### Documentation Skills (2)

| Skill | Version | Description |
|-------|---------|-------------|
| `system-spec-kit` | v2.2.26.0 | Unified documentation and context preservation: spec folder workflow (levels 1-3+), CORE + ADDENDUM template architecture, validation and Spec Kit Memory. Mandatory for all file modifications |
| `sk-doc` | v1.1.2.0 | Markdown quality enforcement, content optimization, component creation workflows, ASCII flowcharts and install guides |

### Code Workflow Skills (4)

| Skill | Version | Description |
|-------|---------|-------------|
| `sk-code--full-stack` | v1.1.0.0 | Stack-agnostic development with auto-detection via marker files. Supports Go, Node.js, React/Next.js, React Native/Expo and Swift |
| `sk-code--opencode` | v1.2.0.0 | Code standards for OpenCode system code across JavaScript, TypeScript, Python, Shell and JSON/JSONC |
| `sk-code--web` | v1.1.0.0 | Frontend development orchestrator with 6 specialized code quality sub-skills |
| `sk-code--review` | v1.2.0.0 | Stack-agnostic code review baseline with findings-first severity analysis and mandatory security/correctness minimums |

### MCP Integration Skills (5)

| Skill | Version | Description |
|-------|---------|-------------|
| `mcp-code-mode` | v1.0.7.0 | MCP orchestration via TypeScript execution for multi-tool workflows. 200+ tools through progressive disclosure. 98.7% context reduction |
| `mcp-coco-index` | v1.0.0 | Semantic code search via vector embeddings. Natural-language discovery of relevant code, patterns and implementations. CLI for direct use; MCP exposes a single `search` tool for AI agent integration |
| `mcp-figma` | v1.0.7.0 | Figma design file access via MCP. 18 tools for file retrieval, image export, component/style extraction and team management |
| `mcp-chrome-devtools` | v1.0.7.0 | Chrome DevTools orchestrator. CLI-first (bdg) for speed, MCP fallback for multi-tool integration |
| `mcp-clickup` | v1.0.0 | ClickUp project management. CLI-first (cu) for speed, MCP for enterprise features like docs, goals and webhooks |

### Cross-AI CLI Skills (4)

| Skill | Version | Description |
|-------|---------|-------------|
| `cli-gemini` | v1.2.1 | Gemini CLI orchestrator for web research via Google Search, codebase architecture analysis and cross-AI validation |
| `cli-codex` | v1.3.1 | Codex CLI orchestrator for OpenAI cross-AI tasks: code generation, web research, codebase analysis and parallel processing |
| `cli-claude-code` | v1.1.1 | Claude Code CLI orchestrator for deep reasoning, extended thinking, code editing and structured output |
| `cli-copilot` | v1.3.1 | Copilot CLI orchestrator for multi-model tasks, cloud delegation, collaborative planning and autopilot mode |

### Other Skills (3)

| Skill | Version | Description |
|-------|---------|-------------|
| `sk-deep-research` | v1.0.0 | Autonomous deep research loop protocol with iterative investigation, externalized state, convergence detection and fresh context per iteration |
| `sk-git` | v1.1.0.0 | Git workflow orchestrator: workspace setup (worktrees), clean conventional commits and pull request workflows |
| `sk-prompt-improver` | v1.2.0.0 | Prompt engineering specialist with 7 frameworks (RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE, CRAFT), DEPTH methodology and CLEAR scoring |

<!-- /ANCHOR:skills-library -->

---

<!-- ANCHOR:gate-system -->
## 9. GATE SYSTEM

3 mandatory gates run before any file change. They are defined in `CLAUDE.md` and `AGENTS.md` and apply to all runtimes.

### The 3 Gates

| Gate | Name | Type | When It Runs | What It Does |
|------|------|------|--------------|--------------|
| **Gate 1** | Understanding + Context Surfacing | SOFT BLOCK | Every new user message | Calls `memory_match_triggers()` to surface relevant prior context. Classifies intent as Research or Implementation. Applies dual-threshold: confidence >= 0.70 AND uncertainty <= 0.35. Either fails means investigate (max 3 iterations) then escalate |
| **Gate 2** | Skill Routing | REQUIRED | Non-trivial tasks | Runs `skill_advisor.py` against the request. Confidence >= 0.8 means the skill must be loaded. Ensures the right domain expertise is always in context |
| **Gate 3** | Spec Folder | HARD BLOCK | Any file modification detected | Overrides Gates 1-2. Asks: A) Existing folder? B) New folder? C) Update related? D) Skip? E) Phase folder? No file changes without an answer |

### Post-Execution Rules

| Rule | Type | Trigger | Enforcement |
|------|------|---------|-------------|
| Memory Save | HARD BLOCK | "save context", `/memory:save` | Must use `generate-context.js` — no manual memory file creation |
| Completion Verification | HARD BLOCK | Claiming "done" or "complete" | Load `checklist.md`, verify ALL items with evidence |

### Analysis Lenses

Applied silently during gate processing on every request:

| Lens | Focus |
|------|-------|
| CLARITY | Is this the simplest solution? Are abstractions earned? |
| SYSTEMS | What does this touch? What are the side effects? |
| BIAS | Is the user solving a symptom? Is the framing correct? |
| SUSTAINABILITY | Will future developers understand this? |
| VALUE | Does this change behavior or just refactor? |
| SCOPE | Does solution complexity match problem size? |

Full gate definitions and anti-pattern detection rules are in [AGENTS.md](AGENTS.md).

<!-- /ANCHOR:gate-system -->

---

<!-- ANCHOR:code-mode-mcp -->
## 10. CODE MODE MCP

Code Mode MCP gives the AI access to external tools (Figma, GitHub, Chrome DevTools, ClickUp, Webflow) through a single TypeScript execution interface. Instead of loading 47 tool definitions into context (141k tokens), it loads them on demand (1.6k tokens) — a 98.7% reduction.

### Native MCP Servers

Defined in `opencode.json`:

| Server | Tools | Purpose |
|--------|-------|---------|
| `spec_kit_memory` | 33 | Cognitive memory system — the memory engine |
| `code_mode` | 7 | External tool orchestration via TypeScript execution |
| `sequential_thinking` | — | Structured multi-step reasoning for complex problems |

### Code Mode Tools (7)

| Tool | Purpose |
|------|---------|
| `search_tools` | Discover relevant tools by task description |
| `tool_info` | Get complete tool parameters and TypeScript interface |
| `call_tool_chain` | Execute TypeScript code with access to all registered tools |
| `list_tools` | List all currently registered tool names |
| `register_manual` | Register a new tool provider |
| `deregister_manual` | Remove a tool provider |
| `get_required_keys_for_tool` | Check required environment variables for a tool |

### External Integrations (via `.utcp_config.json`)

| Provider | Type | Key Capabilities | Required Env Var |
|----------|------|-----------------|-----------------|
| `chrome_devtools_1` | MCP/stdio | Browser automation (instance 1) | None |
| `chrome_devtools_2` | MCP/stdio | Browser automation (instance 2) | None |
| `clickup` | MCP/stdio | Task management, goals, docs | `CLICKUP_API_KEY` |
| `figma` | MCP/stdio | Design files, components, exports | `FIGMA_API_KEY` |
| `github` | MCP/stdio | Issues, pull requests, commits | `GITHUB_PERSONAL_ACCESS_TOKEN` |
| `webflow` | MCP/remote | Sites, CMS collections | Webflow auth |

### Performance

| Metric | Without Code Mode | With Code Mode |
|--------|-------------------|----------------|
| Context tokens | 141k (47 tools loaded) | 1.6k (on-demand) |
| Round trips | 15+ for chained operations | 1 (TypeScript chain) |
| Type safety | None | Full TypeScript |
| Context reduction | — | 98.7% |

To call a Code Mode tool: `call_tool_chain({ typescript: "const result = await figma.figma_get_file({fileKey: 'abc123'}); return result;" })`

For more on the `mcp-code-mode` skill and TypeScript execution patterns, see the skill at `.opencode/skill/mcp-code-mode/SKILL.md`.

<!-- /ANCHOR:code-mode-mcp -->

---

<!-- ANCHOR:configuration -->
## 11. CONFIGURATION

### Core Configuration Files

| File | Purpose | Who Uses It |
|------|---------|-------------|
| `CLAUDE.md` | Gate definitions, behavior rules, coding anti-patterns | Claude Code, primary runtime |
| `AGENTS.md` | Agent routing, capability reference, gate documentation | All runtimes |
| `opencode.json` | MCP server bindings, model configuration | OpenCode platform |
| `.utcp_config.json` | Code Mode external tool registrations | `mcp-code-mode` skill |
| `.claude/mcp.json` | Claude Code MCP configuration | Claude Code only |
| `.gemini/settings.json` | Gemini CLI configuration | Gemini CLI only |

### Memory Engine Configuration

The memory server reads configuration from environment variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `VOYAGE_API_KEY` | No | Voyage AI embeddings (recommended) |
| `OPENAI_API_KEY` | No | OpenAI embeddings (alternative) |
| `MEMORY_DB_PATH` | No | Override default database path |

Default database path: `.opencode/skill/system-spec-kit/shared/mcp_server/database/context-index.sqlite`

If no API key is set, the memory engine auto-detects HuggingFace Local embeddings (free, no setup required).

### opencode.json Structure

```json
{
  "mcp": {
    "spec_kit_memory": {
      "type": "local",
      "command": "node",
      "args": [".opencode/skill/system-spec-kit/mcp_server/dist/context-server.js"]
    },
    "code_mode": {
      "type": "local",
      "command": "npx",
      "args": ["ts-node", ".opencode/skill/mcp-code-mode/server.ts"]
    }
  }
}
```

<!-- /ANCHOR:configuration -->

---

<!-- ANCHOR:usage-examples -->
## 12. USAGE EXAMPLES

### Example 1: Start a New Feature

Use `/spec_kit:complete` to run the full workflow — research, plan, implementation and memory save.

```
/spec_kit:complete Add email verification to the user registration flow
```

This creates a spec folder under `.opencode/specs/`, researches the codebase, builds a plan, implements it and saves memory automatically.

### Example 2: Resume After a Crash or Compaction

Use `/memory:continue` to recover session context after a context window reset.

```
/memory:continue
```

The command loads the most recent memory files from the active spec folder and presents a session summary so you can pick up exactly where you left off.

### Example 3: Debug a Difficult Problem

Use `/spec_kit:debug` to delegate debugging to a fresh-perspective agent with no prior context bias.

```
/spec_kit:debug The authentication middleware is intermittently returning 401 for valid tokens
```

The `@debug` agent applies a 5-phase methodology (Observe, Analyze, Hypothesize, Validate, Fix) and writes a `debug-delegation.md` with findings.

### Example 4: Code Review Before Merging

Ask `@review` to evaluate your changes before a pull request.

```
@review Review the changes in src/auth/ for security issues and coding standards
```

The `@review` agent is read-only, applies the `sk-code--review` skill and returns a findings-first severity report.

### Example 5: Save Context Before Ending a Session

```
/memory:save
```

This runs `generate-context.js` against your active spec folder, writes a timestamped memory file and indexes it immediately for future retrieval.

### Common Patterns

| Pattern | Command | When to Use |
|---------|---------|-------------|
| New feature end-to-end | `/spec_kit:complete [description]` | Starting any feature from scratch |
| Planning without building | `/spec_kit:plan [description]` | When you want to review the plan first |
| Pick up previous work | `/spec_kit:resume` | Returning to an in-progress spec |
| Investigate a codebase | `@context [question]` | Exploration and research tasks |
| Generate a README | `/create:folder_readme` | Documenting a directory or component |

<!-- /ANCHOR:usage-examples -->

---

<!-- ANCHOR:troubleshooting -->
## 13. TROUBLESHOOTING

### Common Issues

#### Memory server fails to start

**Symptom**: OpenCode reports MCP connection error on startup.

**Cause**: The memory server binary has not been built, or Node.js is below v18.

**Solution**:
```bash
# Build the memory server
cd .opencode/skill/system-spec-kit/mcp_server
npm install && npm run build

# Verify Node.js version
node --version
# Expected: v18.x.x or higher
```

#### No embeddings generated (memory search returns no results)

**Symptom**: `memory_context()` returns empty results even for queries that should match.

**Cause**: No embedding provider is configured and HuggingFace Local failed to initialize.

**Solution**:
```bash
# Set a Voyage AI key (recommended)
export VOYAGE_API_KEY="your-key-here"

# Or set an OpenAI key
export OPENAI_API_KEY="your-key-here"

# Then re-run memory indexing
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js [spec-folder-path]
```

#### Gate 3 asks for a spec folder on every message

**Symptom**: Every request triggers the spec folder question, even for read-only tasks.

**Cause**: The request contains a trigger word that the gate system interprets as a file modification intent.

**Solution**: Use "skip context" or add `[skip]` to your message to bypass the gate for read-only exploration. Example: `[skip] What does the auth middleware do?`

#### `skill_advisor.py` returns low confidence

**Symptom**: Gate 2 reports confidence below 0.8 and no skill is loaded.

**Cause**: The request is ambiguous or the skill system doesn't have a strong match.

**Solution**: Either rephrase the request with more domain-specific terms, or explicitly name the skill: "Using sk-doc, improve this README."

### Quick Fixes

| Problem | Fix |
|---------|-----|
| Memory DB locked | `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --checkpoint` |
| Stale memory index | `/memory:manage` then select "reindex" |
| Wrong spec folder picked up | Explicitly set folder: `/memory:save specs/###-folder-name` |
| Command not found | Verify `.opencode/command/` contains the `.md` file for the command |
| Agent not routing correctly | Check `.claude/agents/` or `.opencode/agent/` for the agent definition file |

### Diagnostic Commands

```bash
# Check memory database health
node .opencode/skill/system-spec-kit/scripts/dist/memory/validate-memory-quality.js

# List all spec folders
ls .opencode/specs/

# Verify MCP server is running
node .opencode/skill/system-spec-kit/mcp_server/dist/context-server.js --version

# Check skill advisor output for a query
python3 .opencode/skill/scripts/skill_advisor.py "your task description" --threshold 0.8
```

<!-- /ANCHOR:troubleshooting -->

---

<!-- ANCHOR:faq -->
## 14. FAQ

### General Questions

**Q: Do I need all 18 skills installed to use the framework?**

A: No. Skills are loaded on demand by Gate 2. You only need the ones relevant to your work. The two core skills — `system-spec-kit` and `sk-doc` — cover most documentation workflows. The MCP and cross-AI CLI skills require additional API keys or tools.

---

**Q: Is this only for OpenCode, or does it work with Claude Code and other runtimes?**

A: It works with OpenCode, Claude Code, ChatGPT and Gemini CLI. Agent definitions are mirrored across all four runtime directories. Claude Code is the most feature-complete runtime adapter — the `.claude/agents/` directory contains all 9 custom agent files.

---

**Q: What happens if I don't use a spec folder?**

A: Gate 3 blocks file modifications until a spec folder answer is provided. You can skip it with option D, but skipped sessions are undocumented and won't be recoverable via memory search. For trivial changes under 5 characters in a single file, Gate 3 doesn't trigger.

---

**Q: How does the memory system know what is relevant to my current task?**

A: Every memory file has YAML frontmatter with tags, context type and trigger phrases. When you start a session, `memory_match_triggers()` runs a 5-channel hybrid search (vector + BM25 + FTS5 + graph + degree) across all indexed memory files and returns the top matches. The Gate 1 soft block then surfaces those results before any work begins.

---

**Q: Can I use this framework without the cognitive memory features?**

A: Yes. The Spec Kit documentation workflow (Gate 3, spec folders, templates) works independently of the memory MCP server. You won't have cross-session memory retrieval, but you'll still get structured documentation, agent routing and skill loading.

---

**Q: How do I add a new skill to the framework?**

A: Use `/create:sk-skill` to scaffold the skill structure. The command creates the `SKILL.md`, references and assets directories following the `sk-doc` template. Then register the skill in `.opencode/skill/README.md`.

---

**Q: What does "local-first" mean for the memory system?**

A: The memory database is a SQLite file on your local machine. No session data, code or context is sent to any external service unless you configure a cloud embedding provider (Voyage AI or OpenAI). HuggingFace Local embeddings run entirely on-device.

---

**Q: How do I contribute a new agent definition?**

A: Define the agent in `.opencode/agent/` (the source of truth), then copy the adapter to `.claude/agents/`, `.opencode/agent/chatgpt/` and `.gemini/agents/`. Use `/create:agent` to scaffold the file from the agent template.

<!-- /ANCHOR:faq -->

---

<!-- ANCHOR:related-documents -->
## 15. RELATED DOCUMENTS

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [AGENTS.md](AGENTS.md) | Complete agent routing reference, gate definitions and behavior rules for all runtimes |
| [Spec Kit README](.opencode/skill/system-spec-kit/README.md) | Full spec folder workflow, template architecture, validation rules and memory pipeline |
| [MCP Server README](.opencode/skill/system-spec-kit/mcp_server/README.md) | Complete memory API reference (33 tools), retrieval architecture and configuration |
| [sk-doc SKILL.md](.opencode/skill/sk-doc/SKILL.md) | Documentation standards, DQI scoring, templates and HVR writing rules |
| [Skills README](.opencode/skill/README.md) | Index of all 18 skills with descriptions and invocation patterns |
| [AGENTS_example_fs_enterprises.md](AGENTS_example_fs_enterprises.md) | Example AGENTS.md for a full-stack enterprise project (runtime-neutral) |

### External Resources

| Resource | Description |
|----------|-------------|
| [OpenCode](https://github.com/sst/opencode) | The underlying AI coding assistant platform this framework extends |
| [Voyage AI](https://www.voyageai.com/) | Recommended embedding provider for memory retrieval |
| [HuggingFace Local](https://huggingface.co/) | Free local embedding alternative (no API key required) |

<!-- /ANCHOR:related-documents -->

---

*Documentation version: 3.0 | Last updated: 2026-03-15 | Framework: 11 agents, 18 skills, 22 commands, 33 MCP tools*
