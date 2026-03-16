# Research Brief: Root README Rewrite (D4)

> Compiled 2026-03-15 for spec `018-rewrite-repo-readme`
> Covers: T001-T006 (Phase 1: Research)

---

## 1. Agent Network

11 agents total: 2 built-in (OpenCode platform) + 9 custom agents defined in `.opencode/agent/`, `.claude/agents/`, `.opencode/agent/chatgpt/`, and `.gemini/agents/`.

Custom agents share the same role definitions across 4 runtime directories. OpenCode (`.opencode/agent/`) is the source of truth. Claude, ChatGPT and Gemini directories are runtime adapters.

### All 11 Agents

| # | Agent | Type | Model | Role | Key Capabilities |
|---|-------|------|-------|------|------------------|
| 1 | `@general` | Built-in | (platform default) | Implementation, complex coding tasks | General-purpose agent for direct coding work |
| 2 | `@explore` | Built-in | (platform default) | Quick codebase exploration, file discovery | Built-in to OpenCode for fast file search |
| 3 | `@orchestrate` | Custom | opus | Senior task commander | Task decomposition, strategic delegation, quality evaluation, conflict resolution, unified synthesis. Uses Task tool for sub-agent dispatch. Context Window Budget, circuit breaker, saga compensation, quality gates, checkpointing, conditional branching, sub-orchestrator pattern |
| 4 | `@context` | Custom | sonnet | Memory-first retrieval specialist | Exclusive entry point for ALL exploration. Read-only. Surfaces Context Packages. Memory-first retrieval. NEVER writes, edits, creates, or deletes files |
| 5 | `@speckit` | Custom | sonnet | Spec folder documentation specialist | EXCLUSIVE agent for writing `*.md` inside spec folders. Template-first. Creates/maintains Level 1-3+ documentation. CORE + ADDENDUM architecture |
| 6 | `@debug` | Custom | opus | Fresh perspective debugging specialist | 5-phase methodology: Observe, Analyze, Hypothesize, Validate, Fix. Starts with NO prior context (intentional bias prevention). May write `debug-delegation.md` in spec folders |
| 7 | `@research` | Custom | opus | Technical investigation specialist | 9-step research process. Evidence gathering, planning, Gate 3 Option B. May write `research.md` inside spec folders |
| 8 | `@review` | Custom | opus | Code quality guardian | READ-ONLY. Quality scoring, pattern validation, security assessment, standards enforcement. Baseline+overlay standards contract |
| 9 | `@write` | Custom | sonnet | Documentation generation specialist | Template-first. DQI-compliant output. Creates READMEs, skills, guides. MUST NOT write inside spec folders |
| 10 | `@handover` | Custom | sonnet | Session continuation specialist | Creates continuation documents (handover.md). Gathers context from spec folders. May write `handover.md` in spec folders |
| 11 | `@ultra-think` | Custom | opus | Multi-strategy planning architect | Dispatches N diverse thinking strategies (Analytical, Creative, Critical, Pragmatic, Holistic lenses). Formal comparative scoring via 5-dimension rubric. Planning ONLY, never modifies files |

### Runtime Platforms

| Runtime | Agent Directory | Config File | Notes |
|---------|----------------|-------------|-------|
| OpenCode (default) | `.opencode/agent/` | `opencode.json` | Source of truth |
| Claude Code | `.claude/agents/` | `.claude/mcp.json` | 9 agent files |
| ChatGPT | `.opencode/agent/chatgpt/` | n/a | 9 agent files |
| Gemini CLI | `.gemini/agents/` | `.gemini/settings.json` | 9 agent files |

**Note on agent counts**: The current README says "10 specialized agents" in the architecture diagram but "11 specialized agents" in the Agent Network section. The correct count is 11 (2 built-in + 9 custom). The `@general` and `@explore` agents are OpenCode built-ins without custom definition files.

[SOURCE: `.claude/agents/*.md` - 9 files verified]
[SOURCE: `AGENTS.md:237-246` - agent definitions section]
[SOURCE: `README.md:406-424` - current agent table]

---

## 2. Skills Library

16 skill directories in `.opencode/skill/` (excluding `scripts/` and `README.md` which are not skills).

### All 16 Skills

| # | Skill | Domain | Version | Description |
|---|-------|--------|---------|-------------|
| 1 | `system-spec-kit` | Documentation | v2.2.26.0 | Unified documentation and context preservation: spec folder workflow (levels 1-3+), CORE + ADDENDUM template architecture (v2.2), validation, and Spec Kit Memory for context preservation. Mandatory for all file modifications |
| 2 | `mcp-code-mode` | Integrations | v1.0.7.0 | MCP orchestration via TypeScript execution for multi-tool workflows. 200+ MCP tools through progressive disclosure. 98.7% context reduction, 60% faster execution |
| 3 | `mcp-figma` | Design | v1.0.7.0 | Figma design file access via MCP. 18 tools for file retrieval, image export, component/style extraction, team management, and collaborative commenting |
| 4 | `mcp-chrome-devtools` | Browser | v1.0.7.0 | Chrome DevTools orchestrator with CLI (bdg) and MCP approaches. CLI prioritized for speed, MCP fallback for multi-tool integration |
| 5 | `mcp-clickup` | Project Mgmt | v1.0.0 | ClickUp project management orchestrator. CLI-first (cu) for speed, MCP for enterprise features like docs, goals, webhooks, and bulk operations |
| 6 | `sk-code--full-stack` | Multi-Stack | v1.1.0.0 | Stack-agnostic development orchestrator with auto-detection via marker files. Supports Go, Node.js, React/Next.js, React Native/Expo, Swift |
| 7 | `sk-code--opencode` | System Code | v1.2.0.0 | Multi-language code standards for OpenCode system code (JavaScript, TypeScript, Python, Shell, JSON/JSONC) |
| 8 | `sk-code--web` | Web Dev | v1.1.0.0 | Development orchestrator for frontend: implementation, debugging, verification across 6 specialized code quality sub-skills |
| 9 | `sk-code--review` | Review | v1.2.0.0 | Stack-agnostic code review baseline. Findings-first severity analysis, mandatory security/correctness minimums, baseline+overlay compatibility |
| 10 | `sk-doc` | Docs | v1.1.2.0 | Unified markdown and OpenCode component specialist. Document quality enforcement, content optimization, component creation workflows, ASCII flowcharts, install guides |
| 11 | `sk-git` | Git | v1.1.0.0 | Git workflow orchestrator: workspace setup (worktrees), clean commits (conventional), and work completion (PRs) |
| 12 | `sk-prompt-improver` | Prompt Eng | v1.2.0.0 | Prompt engineering specialist. 7 frameworks (RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE, CRAFT), DEPTH thinking methodology, CLEAR scoring |
| 13 | `cli-gemini` | Cross-AI | v1.2.1 | Gemini CLI orchestrator for web research via Google Search, codebase architecture analysis, cross-AI validation, parallel code generation |
| 14 | `cli-codex` | Cross-AI | v1.3.1 | Codex CLI orchestrator for OpenAI cross-AI tasks: code generation, web research, codebase analysis, code review, parallel processing |
| 15 | `cli-claude-code` | Cross-AI | v1.1.1 | Claude Code CLI orchestrator for deep reasoning, extended thinking, code editing, structured output, agent delegation |
| 16 | `cli-copilot` | Cross-AI | v1.3.1 | Copilot CLI orchestrator for multi-model tasks, cloud delegation, collaborative planning, autopilot mode |

### Skill Categories

| Category | Count | Skills |
|----------|-------|--------|
| Cross-AI CLI | 4 | cli-gemini, cli-codex, cli-claude-code, cli-copilot |
| MCP Integration | 4 | mcp-code-mode, mcp-figma, mcp-chrome-devtools, mcp-clickup |
| Code Workflows | 4 | sk-code--full-stack, sk-code--opencode, sk-code--web, sk-code--review |
| Documentation | 2 | system-spec-kit, sk-doc |
| Git | 1 | sk-git |
| Prompt Engineering | 1 | sk-prompt-improver |

[SOURCE: `.opencode/skill/` - 16 directories verified via ls]
[SOURCE: Each `SKILL.md` frontmatter - descriptions and versions extracted directly]

---

## 3. Gate System

3 mandatory gates defined in CLAUDE.md (project root) and AGENTS.md. Every request passes through these gates before any file change.

### Gate Summary

| Gate | Name | Type | Trigger | Purpose |
|------|------|------|---------|---------|
| **Gate 1** | Understanding + Context Surfacing | SOFT BLOCK | Every new user message | Surfaces relevant memories via `memory_match_triggers()`. Classifies intent (Research or Implementation). Applies dual-threshold: confidence >= 0.70 AND uncertainty <= 0.35. Either fails -> investigate (max 3 iterations) -> escalate |
| **Gate 2** | Skill Routing | REQUIRED | Non-trivial tasks | Runs `skill_advisor.py` against the request. Confidence >= 0.8 means the skill MUST be loaded. Ensures correct domain expertise is always in context |
| **Gate 3** | Spec Folder | HARD BLOCK | Any file modification detected | Overrides Gates 1-2. Asks: A) Existing folder? B) New folder? C) Update related? D) Skip? E) Phase folder? No file changes without an answer. Triggers on: rename, move, delete, create, add, remove, update, change, modify, edit, fix, refactor, implement, build, write, generate, configure, analyze, decompose, phase |

### Post-Execution Rules

| Rule | Type | Trigger | Enforcement |
|------|------|---------|-------------|
| Memory Save | HARD BLOCK | "save context", "save memory", `/memory:save` | Must use `generate-context.js` (no manual memory file creation) |
| Completion Verification | HARD BLOCK | Claiming "done", "complete", "finished" | Load `checklist.md`, verify ALL items with evidence |

### Analysis Lenses (6)

Applied silently during gate processing: CLARITY (simplicity), SYSTEMS (dependencies), BIAS (wrong problem), SUSTAINABILITY (maintainability), VALUE (actual impact), SCOPE (complexity match).

### Anti-Patterns (6 core)

Auto-detected: over-engineering, premature optimization, cargo culting, gold-plating, wrong abstraction, scope creep.

[SOURCE: `CLAUDE.md:89-117` (project root) - gate definitions]
[SOURCE: `AGENTS.md:89-117` - identical content]
[SOURCE: `README.md:585-636` - current gate documentation]

---

## 4. Command Architecture

22 commands across 4 namespaces. Two-layer architecture: Markdown entry points (.md) route to execution engines.

### Namespace Inventory

#### spec_kit/ (8 commands)

| Command | Purpose |
|---------|---------|
| `/spec_kit:complete` | Full workflow: spec -> plan -> implement -> verify |
| `/spec_kit:plan` | Planning only, no implementation |
| `/spec_kit:implement` | Execute an existing plan |
| `/spec_kit:phase` | Decompose a spec into phased child folders |
| `/spec_kit:research` | Technical investigation with evidence gathering |
| `/spec_kit:debug` | Delegate debugging to fresh-perspective sub-agent |
| `/spec_kit:resume` | Continue a previous session (auto-loads memory) |
| `/spec_kit:handover` | Create session handover (`:quick` or `:full` variants) |

#### memory/ (7 commands)

| Command | Purpose |
|---------|---------|
| `/memory:save` | Save context via `generate-context.js` |
| `/memory:continue` | Session recovery from crash or compaction |
| `/memory:context` | Unified retrieval with intent-aware routing |
| `/memory:learn` | Constitutional memory manager (list, edit, remove, budget) |
| `/memory:manage` | Database ops: stats, health, cleanup, checkpoints |
| `/memory:analyze` | Preflight, postflight, causal graph, ablation, dashboard, history |
| `/memory:shared` | Shared memory: create, member, status (deny-by-default governance) |

#### create/ (5 commands)

| Command | Purpose |
|---------|---------|
| `/create:sk-skill` | Unified skill workflows (create/update/file) |
| `/create:agent` | Scaffold a new agent definition |
| `/create:folder_readme` | Unified README + install guide creation |
| `/create:changelog` | Create changelog entry from recent work |
| `/create:prompt` | Create or improve AI prompts with structured frameworks |

#### Utility (1 command)

| Command | Purpose |
|---------|---------|
| `/agent_router` | Route requests to AI Systems with full System Prompt identity adoption |

### Architecture Note

**Layer 1**: Entry point (.md) - user-facing interface for input collection, setup, and routing.
**Layer 2**: Execution engine - behavioral spec with step enumeration, validation gates, agent prompts, and circuit breakers.

**Current README discrepancy**: The current README says "19 commands across 4 namespaces" and lists only 5 memory commands. The actual count is 22 commands (8 spec_kit + 7 memory + 5 create + 1 utility + 1 agent_router). The memory namespace now has 7 commands (`analyze` and `shared` were added).

[SOURCE: `.opencode/command/` - all 22 .md files verified]
[SOURCE: `README.md:464-524` - current command documentation showing 19]

---

## 5. Code Mode MCP

### Native MCP Servers (3)

Defined in `opencode.json`:

| Server | Tools | Purpose |
|--------|-------|---------|
| `spec_kit_memory` | 25 | Cognitive memory system (the memory engine) |
| `code_mode` | 7 | External tool orchestration via TypeScript execution |
| `sequential_thinking` | - | Structured multi-step reasoning for complex problems |

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

### Code Mode Integrations (via .utcp_config.json)

6 external tool providers registered:

| Provider | Type | Key Capabilities |
|----------|------|------------------|
| `chrome_devtools_1` | MCP/stdio | Browser automation (instance 1) |
| `chrome_devtools_2` | MCP/stdio | Browser automation (instance 2) |
| `clickup` | MCP/stdio | Task management (requires CLICKUP_API_KEY) |
| `figma` | MCP/stdio | Design files (requires FIGMA_API_KEY) |
| `github` | MCP/stdio | Issues, PRs, commits (requires GITHUB_PERSONAL_ACCESS_TOKEN) |
| `webflow` | MCP/remote | Sites, CMS (remote SSE transport) |

Additionally, a `paper` provider is registered (local MCP remote at 127.0.0.1:29979).

### Performance Numbers

| Metric | Without Code Mode | With Code Mode |
|--------|-------------------|----------------|
| Context tokens | 141k (47 tools loaded) | 1.6k (on-demand) |
| Round trips | 15+ for chained ops | 1 (TypeScript chain) |
| Type safety | None | Full TypeScript support |
| Context reduction | - | 98.7% |

[SOURCE: `opencode.json:1-52` - MCP server definitions]
[SOURCE: `.utcp_config.json:1-144` - Code Mode provider registrations]
[SOURCE: `README.md:640-683` - current Code Mode documentation]

---

## 6. Key Numbers

| Category | Count | Source |
|----------|-------|--------|
| Agents (total) | 11 | 2 built-in + 9 custom |
| Agent runtime platforms | 4 | OpenCode, Claude Code, ChatGPT, Gemini CLI |
| Skills | 16 | `.opencode/skill/` directories |
| MCP tools (memory) | 25 | spec_kit_memory server |
| MCP tools (code mode) | 7 | code_mode server |
| MCP tools (total) | 32 | 25 memory + 7 code mode |
| Commands | 22 | 8 spec_kit + 7 memory + 5 create + 1 utility + 1 agent_router |
| Command namespaces | 4 | spec_kit, memory, create, utility |
| Gates | 3 | Understanding, Skill Routing, Spec Folder |
| Post-execution rules | 2 | Memory Save, Completion Verification |
| Analysis lenses | 6 | CLARITY, SYSTEMS, BIAS, SUSTAINABILITY, VALUE, SCOPE |
| Documentation levels | 4 | Level 1, 2, 3, 3+ |
| Templates | 81 | CORE + ADDENDUM v2.2 |
| Validation rules | 13 | Pluggable spec folder validation |
| Embedding providers | 4 | Voyage AI, OpenAI, HuggingFace Local, auto-detection |
| Code Mode integrations | 6 | Chrome DevTools (x2), ClickUp, Figma, GitHub, Webflow |
| Memory layers | 7 | L1 Orchestration through L7 Maintenance |
| Causal relationship types | 6 | caused, derived_from, supports, supersedes, enabled, contradicts |
| Cognitive features | 5 | Attention decay, tiered injection, co-activation, FSRS scheduler, prediction error gating |
| Memory retrieval channels | 3 | Vector, BM25, FTS5 (fused via RRF) |
| Anchor tags | ~473 | Across ~74 READMEs |

---

## 7. Current README Gaps

### What Exists (15 sections, ~1040 lines)

The current README has these sections:
1. Overview (with architecture diagram)
2. Quick Start
3. Spec Kit Documentation
4. Memory Engine
5. Agent Network
6. Command Architecture
7. Skills Library
8. Gate System
9. Code Mode MCP
10. Extensibility
11. Configuration
12. Usage Examples
13. Troubleshooting
14. FAQ
15. Related Documents

### What is Stale or Inaccurate

| Issue | Location | Details |
|-------|----------|---------|
| **Command count wrong** | Section 6, line 467 | Says "19 commands across 4 namespaces" but actual count is 22. Missing: `/memory:analyze`, `/memory:shared`, possibly `/agent_router` |
| **Memory command count wrong** | Section 6, line 498 | Lists 5 memory commands. Actual is 7 (missing `analyze` and `shared`) |
| **Agent count inconsistency** | Architecture diagram vs Section 5 | Diagram says "10 specialized" but text says "11 specialized" |
| **Context agent model wrong** | Section 5, line 417 | Lists `claude-haiku` but actual frontmatter says `model: sonnet` |
| **Handover agent model wrong** | Section 5, line 423 | Lists `claude-haiku` but actual frontmatter says `model: sonnet` |
| **Review agent model wrong** | Section 5, line 421 | Lists `inherited` but actual frontmatter says `model: opus` |
| **Debug phases mismatch** | Section 5, line 458 | Says "4-phase" methodology but agent definition says "5-phase" (Observe, Analyze, Hypothesize, Validate, Fix) |
| **Memory tools count discrepancy** | Section 4, lines 248-252 | Header says "25 MCP tools" but description says "23 MCP tools across 7 architectural layers" |
| **MCP tool total inconsistency** | Architecture diagram line 72 | Says "32 MCP tools: 25 memory + 7 code mode" which is correct |
| **Highlights section aging** | Section 1, lines 92-103 | "Recent Platform Highlights" will become stale. Some items reference spec numbers that may confuse new users |
| **Paper MCP not mentioned** | Section 9 | `paper` provider in `.utcp_config.json` is not documented |
| **Extensibility section generic** | Section 10 | Could be more specific with examples |

### What is Missing

| Gap | Priority | Notes |
|-----|----------|-------|
| Role-based navigation | P1 | Newcomers, developers, and administrators need different entry points |
| `memory:analyze` command | P1 | New command not documented |
| `memory:shared` command | P1 | New command not documented |
| Structure/directory overview | P2 | No section showing project directory structure |
| Link to component READMEs | P1 | Should link prominently to D1 (MCP README) and D3 (Spec Kit README) for depth, not duplicate their content |

### What is Good and Should Be Preserved

- Architecture diagram (updated with correct numbers)
- Embedding providers table and privacy note
- FAQ answers (well-written, practical)
- Troubleshooting section (actionable)
- Quick Start section (concise)
- ANCHOR tags for section-level retrieval
- Badge shields at top

[SOURCE: `README.md:1-1041` - full current README analyzed]

---

## 8. Target Section Structure

Based on the `readme_template.md` from sk-doc, the target structure for a Project README is:

| # | Section | Required | Key Content |
|---|---------|----------|-------------|
| 1 | **OVERVIEW** | Required | What this is, key statistics, key features, requirements |
| 2 | **QUICK START** | Required | 30-second setup, verification, first use |
| 3 | **STRUCTURE** | Required (Project) | Directory tree, key files table |
| 4 | **FEATURES** | Optional | Feature categories with examples |
| 5 | **CONFIGURATION** | Optional | Config files, options, env vars |
| 6 | **USAGE EXAMPLES** | Optional | 3+ examples, common patterns |
| 7 | **TROUBLESHOOTING** | Required | Common issues, quick fixes, diagnostics |
| 8 | **FAQ** | Optional | General + technical Q&A |
| 9 | **RELATED DOCUMENTS** | Required | Internal docs, external resources |

### Current README vs Target Template

The current README has 15 sections. The template prescribes 9. The current approach uses topic-specific sections (Spec Kit, Memory Engine, Agent Network, etc.) instead of grouping under a generic "FEATURES" section. This is appropriate for a complex system and should be retained, mapping topic sections into the template's Features slot.

**Recommended mapping**:

| Template Section | Maps To |
|-----------------|---------|
| 1. OVERVIEW | Overview (What, How It Connects, Requirements) |
| 2. QUICK START | Quick Start |
| 3. SPEC KIT DOCUMENTATION | (Feature) Spec Kit summary, link to D3 |
| 4. MEMORY ENGINE | (Feature) Memory summary, link to D1 |
| 5. AGENT NETWORK | (Feature) All 11 agents |
| 6. COMMAND ARCHITECTURE | (Feature) All 22 commands |
| 7. SKILLS LIBRARY | (Feature) All 16 skills |
| 8. GATE SYSTEM | (Feature) 3 gates |
| 9. CODE MODE MCP | (Feature) 7 tools, integrations |
| 10. CONFIGURATION | Configuration |
| 11. USAGE EXAMPLES | Usage Examples |
| 12. TROUBLESHOOTING | Troubleshooting |
| 13. FAQ | FAQ |
| 14. RELATED DOCUMENTS | Related Documents |

### Template Style Rules

- H2 headings: numbered, ALL CAPS (`## 1. OVERVIEW`)
- TOC links: `#n--section-name` (number + double-dash + lowercase-hyphenated)
- ANCHOR tags on every major section
- Badges above H1 in `<div align="left">`
- No HVR banned words (see sk-doc checklist)
- Progressive disclosure: 10s understand -> 30s decide -> 2m working -> depth on demand

[SOURCE: `.opencode/skill/sk-doc/assets/documentation/readme_template.md:1-1093`]

---

## 9. Cross-Reference Notes

### D1: MCP Server README

- **Path**: `.opencode/skill/system-spec-kit/mcp_server/README.md`
- **Spec**: `022-hybrid-rag-fusion/015-rewrite-memory-mcp-readme/`
- **Relationship**: D4 (this README) should link to D1 for memory engine depth. Avoid duplicating MCP tool documentation. Summary-only in root README with "See [MCP Server Documentation](...) for complete reference."

### D3: Spec Kit README

- **Path**: `.opencode/skill/system-spec-kit/README.md`
- **Spec**: `022-hybrid-rag-fusion/017-rewrite-system-speckit-readme/`
- **Relationship**: D4 should link to D3 for spec folder workflow depth. Avoid duplicating template architecture, validation rules, or memory pipeline details. Summary-only in root README with "See [Spec Kit Documentation](...) for complete reference."

### Linking Strategy

```
Root README (D4)
  ├── Summary of Memory Engine → links to D1 (MCP README) for depth
  ├── Summary of Spec Kit → links to D3 (Spec Kit README) for depth
  ├── Links to individual skill READMEs where useful
  └── Links to AGENTS.md for complete gate/rule documentation
```

### Deduplication Principle

D4 should be a navigation hub, not an encyclopedia. For each component:
- **1-2 sentences** describing what it is
- **Key numbers** (tools, features, etc.)
- **One table** summarizing the component
- **Link** to component README for full reference

Content that currently lives only in the root README (gate system, agent network overview, command architecture) stays in D4 as the canonical location since no component README owns it.

---

## 10. Evidence Summary

| Claim | Evidence Grade | Source |
|-------|---------------|--------|
| 11 agents | A (verified) | Agent definition files in 4 runtime directories |
| 16 skills | A (verified) | `.opencode/skill/` directory listing |
| 22 commands | A (verified) | `.opencode/command/` file listing (22 .md files) |
| 3 gates | A (verified) | CLAUDE.md sections 89-117 |
| 32 MCP tools (25+7) | B (from README) | README architecture diagram, not independently verified |
| 6 Code Mode integrations | A (verified) | `.utcp_config.json` - 6 manual_call_templates |
| Model assignments stale | A (verified) | Agent frontmatter vs README table comparison |
| Command count stale | A (verified) | 22 actual vs 19 documented |

---

*This research brief completes Phase 1 tasks T001-T006 for spec 018-rewrite-repo-readme.*
