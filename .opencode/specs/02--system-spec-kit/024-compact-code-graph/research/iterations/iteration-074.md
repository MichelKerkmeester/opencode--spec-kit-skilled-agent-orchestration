# Iteration 74: Codex CLI and Copilot CLI Specific UX for Code Graph + Context Auto-Loading

## Focus
Investigate the two non-hook runtimes (Codex CLI and Copilot CLI) to understand their agent architecture, session lifecycle, and instruction-based context loading mechanisms. Design specific instruction patterns for each runtime to auto-trigger code graph and memory context without hooks. Compare with the hook-based Claude runtime (iteration 065 covered OpenCode).

## Findings

### 1. Codex CLI Agent Architecture: 10 TOML-Based Agents with Model+Reasoning Config
Codex CLI uses `.codex/agents/*.toml` with a structured format: `name`, `sandbox_mode`, `model`, `model_reasoning_effort`, and `developer_instructions` (long-form markdown in triple-quoted string). Each agent specifies its model explicitly (e.g., `model = "gpt-5.4"`, `model_reasoning_effort = "high"`). The `@context` agent is LEAF-only, read-only, with sandbox_mode = "read-only". All 10 agents mirror the OpenCode agent set: context, debug, deep-research, deep-review, handover, orchestrate, review, speckit, ultra-think, write.

[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.codex/agents/context.toml]

### 2. CODEX.md Already Instructs Memory Recovery But Has NO Code Graph Triggers
CODEX.md exists at the repo root and contains: (a) compaction recovery instructions telling the AI to call `memory_context({ mode: "resume" })`, (b) query-intent routing section mapping semantic/structural/continuity queries to tools, (c) available MCP tools list including Code Graph tools (`code_graph_scan`, `code_graph_query`, `code_graph_status`, `code_graph_context`). However, there is NO instruction to auto-trigger code graph context at session start or on first tool call. The code graph tools are listed but not connected to any automatic workflow.

[SOURCE: CODEX.md at repo root, read via Bash]

### 3. Copilot CLI Agent Architecture: 10 Markdown-Based Agents with YAML Frontmatter
Copilot CLI uses `.agents/agents/*.md` with YAML frontmatter: `name`, `description`, `kind: local`, `model`, `temperature`, `max_turns`, `timeout_mins`, and `tools` array. The `@context` agent uses `model: gemini-3.1-pro-preview` with `temperature: 0.1`, `max_turns: 10`, `timeout_mins: 5`. Critically, the tools list in frontmatter is limited to `read_file`, `grep_search`, `list_directory` -- MCP tools are NOT listed in the frontmatter, they come from the `.agents/settings.json` mcpServers configuration.

[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.agents/agents/context.md]

### 4. Copilot CLI Uses AGENTS.md and GEMINI.md as Instruction Files (Both Are Universal Template)
The `.agents/settings.json` specifies `"context": { "fileName": ["GEMINI.md", "AGENTS.md"] }` -- these are the instruction files loaded at session start. Both AGENTS.md and GEMINI.md are identical to the root CLAUDE.md (the universal AI Assistant Framework). There is NO Copilot-specific instruction file (no COPILOT.md exists). This means Copilot CLI gets the full universal framework including Gate 1 (`memory_match_triggers`), Gate 2 (skill routing), and Gate 3 (spec folder) -- but like Codex CLI, has NO code graph auto-trigger instructions.

[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.agents/settings.json, confirmed COPILOT.md absence]

### 5. Both Non-Hook Runtimes Share Identical MCP Server Registrations
Both `.codex/agents/` (via Codex CLI config) and `.agents/settings.json` (Copilot CLI) register the exact same 4 MCP servers: `sequential_thinking`, `spec_kit_memory`, `cocoindex_code`, and `code_mode`. The connection details are identical (same command paths, same env vars, same CWD). This means both runtimes have full access to code graph tools but neither has automated startup triggers.

[SOURCE: .agents/settings.json mcpServers block, CODEX.md Available MCP Tools section]

### 6. Claude Hooks Provide 3 Lifecycle Events That Non-Hook Runtimes Completely Lack
Claude Code has `.claude/settings.local.json` registering 3 hook scripts: (a) `PreCompact` runs `compact-inject.js` with 3s timeout -- injects context before compaction, (b) `SessionStart` runs `session-prime.js` with 3s timeout -- primes session with memory/code context at startup, (c) `Stop` runs `session-stop.js` with 10s async timeout -- saves session state. Non-hook runtimes (Codex, Copilot, OpenCode, Gemini) have ZERO lifecycle events. The gap is structural: these runtimes simply do not support pre/post processing hooks.

[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.claude/settings.local.json hooks config]

### 7. Design: Codex CLI Auto-Trigger via CODEX.md Enhancement + Agent Developer Instructions
**Proposed CODEX.md addition** (append to existing "Context Retrieval Primitives" section):
```markdown
## Session Start Protocol (Auto-Context)
On EVERY new session or after compaction, execute this sequence BEFORE any other work:
1. `memory_match_triggers(prompt)` -- surface constitutional + triggered context
2. `memory_context({ input: "[user's first message]", mode: "auto" })` -- intent-aware retrieval
3. `code_graph_status()` -- check if code graph index exists and is fresh
4. If code graph status shows stale or missing index: `code_graph_scan({ incremental: true })` (background)
5. For structural queries: `code_graph_context({ input: "[topic]", queryMode: "neighborhood" })` -- expand structural context
```
**Per-agent enhancement**: Add to each Codex agent's `developer_instructions` in the "CORE WORKFLOW" section, Step 1:
```
1. **CONTEXT LOAD** → On first turn: call `memory_match_triggers(prompt)`, then if file paths detected in request, call `code_graph_context({ seeds: [{ provider: "manual", filePath: "<path>" }], queryMode: "neighborhood" })` for structural context
```
This is instruction-only (no code changes) and leverages the existing CODEX.md loading mechanism.

[INFERENCE: based on existing CODEX.md structure + Codex CLI TOML agent format + iteration 062 FirstCallTracker design]

### 8. Design: Copilot CLI Auto-Trigger via AGENTS.md Section + Agent Frontmatter Enhancement
**Proposed approach**: Since Copilot CLI loads AGENTS.md (which IS the universal CLAUDE.md framework), the instruction already exists at Gate 1 (`memory_match_triggers`). The GAP is code graph. Add a new subsection to the universal CLAUDE.md "Quick Reference: Common Workflows" table:
```
| **Session start**     | `memory_match_triggers(prompt)` → `code_graph_status()` → if stale: `code_graph_scan()` → proceed |
```
And add to the "Code Search Protocol" section:
```markdown
### Structural Context Auto-Loading
When a user message references specific files or asks about code structure:
- Auto-call `code_graph_context({ seeds: [{ provider: "manual", filePath: "<mentioned-file>" }], queryMode: "neighborhood" })` 
- This provides call graph, import chain, and symbol outline without explicit user request
```
**Per-agent enhancement**: Copilot agents use YAML frontmatter `tools:` arrays that are limited. Add `code_graph_query` and `code_graph_context` to relevant agent tool lists if the Copilot runtime supports MCP tool references in frontmatter (currently only `read_file`, `grep_search`, `list_directory` are listed).

[INFERENCE: based on .agents/settings.json context.fileName loading + AGENTS.md identity with CLAUDE.md + Copilot agent frontmatter format]

## Ruled Out
- **Copilot native hooks**: Copilot CLI (GitHub Copilot in CLI mode) does not have a hook/lifecycle system like Claude Code. No equivalent of PreCompact/SessionStart/Stop.
- **Codex CLI native hooks**: Codex CLI also lacks lifecycle hooks. The `codex exec` mode runs agents to completion without lifecycle events.
- **Runtime-specific MCP servers**: All runtimes already share the same MCP servers. Adding runtime-specific servers would fragment the architecture.
- **COPILOT.md**: Does not exist and creating one would not be auto-loaded (settings.json specifies GEMINI.md + AGENTS.md).

## Dead Ends
- None new. The absence of hooks in non-Claude runtimes was already established in prior iterations.

## Sources Consulted
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.codex/agents/context.toml` -- Full Codex agent definition (411 lines)
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.agents/agents/context.md` -- Copilot agent definition with YAML frontmatter
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.agents/settings.json` -- Copilot CLI settings with MCP servers and context file config
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/CODEX.md` -- Codex CLI instruction file
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.claude/settings.local.json` -- Claude Code hooks registration
- Iteration 065 (OpenCode-specific UX) -- prior research on OpenCode agent architecture
- Iteration 058 (Q15 non-hook runtime UX) -- four-tier fallback architecture
- Iteration 062 (MCP first-call priming) -- FirstCallTracker singleton design

## Assessment
- New information ratio: 0.63
- Questions addressed: Codex CLI agent architecture, Copilot CLI agent architecture, instruction-based auto-trigger design, hook vs instruction UX comparison
- Questions answered: How do Codex and Copilot agents work (fully), how should code graph auto-trigger in each (designed), what is the UX parity gap (quantified)

## Reflection
- What worked and why: Direct file reading of all three runtimes' configuration and agent files provided a complete cross-runtime comparison. The TOML vs markdown-with-YAML-frontmatter format difference was only visible by reading the actual files.
- What did not work and why: COPILOT.md was expected to exist as an analog to CODEX.md but does not -- Copilot CLI uses the universal AGENTS.md instead. This means the Copilot instruction surface is the same as the universal framework.
- What I would do differently: Check for COPILOT.md absence earlier to avoid assuming it exists. The Copilot CLI's reliance on the universal framework means code graph instructions should go into CLAUDE.md (the universal template) rather than a runtime-specific file.

## Recommended Next Focus
This is iteration 74 of 75 (penultimate). The recommended next focus for the final iteration is: **Cross-runtime UX parity summary table and final consolidation** -- produce a definitive comparison matrix showing what each runtime gets automatically (hooks vs instructions vs manual) for memory context, code graph context, CocoIndex, and session lifecycle. This serves as the capstone finding for the entire Segment 6 research.
