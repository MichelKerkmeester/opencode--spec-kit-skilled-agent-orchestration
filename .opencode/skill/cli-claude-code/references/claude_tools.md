---
title: "Claude Code CLI Built-in Tools Reference"
description: "Reference for Claude Code CLI unique capabilities including extended thinking, Edit tool, Agent tool, structured output, permission modes, and 3-way comparison with Gemini CLI and Codex CLI."
---

# Claude Code CLI Built-in Tools Reference

Reference for all Claude Code CLI capabilities, highlighting unique features and comparison with Gemini CLI and Codex CLI.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Core Principle

Delegate to Claude Code CLI for capabilities other AIs lack natively — especially extended thinking for deep reasoning, surgical diff-based code editing, schema-validated structured output, and cost-controlled execution with budget caps.

### Purpose

Covers all built-in capabilities of Claude Code CLI, highlights what is unique compared to other CLIs, and provides a 3-way comparison table for task routing decisions.

### When to Use

- Choosing whether to delegate a task to Claude Code CLI vs handle it locally
- Understanding which Claude Code flags and modes to use for different task types
- Mapping calling AI capabilities to Claude Code equivalents
- Leveraging Claude Code-exclusive features (extended thinking, --json-schema, --permission-mode plan)

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:unique-capabilities -->
## 2. UNIQUE CAPABILITIES

### Extended Thinking

**Deep chain-of-thought reasoning.** Claude's extended thinking produces detailed internal reasoning before responding, leading to higher quality outputs for complex tasks.

**Capabilities:**
- Multi-step logical reasoning with visible chain-of-thought
- Complex trade-off analysis across multiple dimensions
- Architecture design with consideration of constraints and alternatives
- Root cause analysis that traces through multiple code paths
- Mathematical and algorithmic problem solving

**Usage:**

```bash
# Extended thinking with Opus (maximum depth)
claude -p "Design a real-time collaboration system for a document editor. Consider: CRDT vs OT, WebSocket vs SSE, conflict resolution, offline support, and scaling to 10K concurrent users." \
  --model claude-opus-4-6 --effort high --output-format text 2>&1

# Extended thinking with Sonnet (good balance)
claude -p "Analyze the trade-offs of our current caching strategy" \
  --effort high --output-format text 2>&1
```

**Best For:**
- Architecture decisions that require weighing 4+ competing concerns
- Debugging subtle issues where surface-level analysis fails
- Algorithm design requiring correctness proofs or edge case analysis
- Technical decisions that will be hard to reverse

**Compared to other CLIs:** Gemini CLI and Codex CLI have reasoning capabilities, but Claude's extended thinking produces explicit, visible chain-of-thought that is especially strong for multi-dimensional trade-off analysis.

---

### Edit Tool (Built-in)

**Surgical diff-based code editing.** Claude Code's Edit tool makes precise, targeted changes to files — replacing specific strings without rewriting entire files.

**Capabilities:**
- Replace specific code blocks while preserving surrounding context
- Multi-file coordinated edits with dependency awareness
- Pattern-based replacements across files
- Preserves formatting, indentation, and file structure

**How it works:** When Claude Code generates a code change, it uses the Edit tool internally to apply surgical diffs rather than rewriting entire files. This means:

1. Only changed lines are modified
2. Surrounding context is preserved exactly
3. Multiple edits to the same file are applied sequentially
4. The calling AI receives the final result, not intermediate diffs

**Best For:**
- Precise refactoring (rename variable, extract function, change signature)
- Bug fixes that require changing specific lines without touching others
- Multi-file changes where files have interdependencies

**Compared to other CLIs:** Codex CLI has workspace-write sandbox but operates at file level. Gemini CLI uses code execution for modifications. Claude Code's Edit tool is the most precise for surgical changes.

---

### Agent Tool (Built-in)

**Spawn focused subagents within a session.** Claude Code can internally create subagents for parallel or specialized tasks within a single session.

**Capabilities:**
- Spawn specialized subagents (explore, general-purpose, plan)
- Run parallel research tasks within a single session
- Isolate complex subtasks without context pollution
- Agent types: general-purpose, Explore (fast search), Plan (architecture)

**How it works:** When delegating a complex task to Claude Code, it may internally spawn subagents to handle subtasks. The calling AI doesn't need to manage this — it's transparent.

**Best For:**
- Complex tasks that naturally decompose into independent subtasks
- Research that requires exploring multiple code paths simultaneously
- Tasks where Claude Code needs to prototype before committing

---

### Structured Output (--json-schema)

**Schema-validated JSON output.** Claude Code can produce output that conforms to a JSON schema, guaranteeing structure for downstream processing.

**Capabilities:**
- Validates output against provided JSON schema before returning
- Supports complex nested schemas (objects, arrays, enums)
- Integrates with `--output-format json` for complete metadata
- Enables reliable pipeline integration

**Usage:**

```bash
# Function analysis with guaranteed schema
claude -p "Analyze all exported functions in @src/utils.ts" \
  --json-schema '{"type":"object","properties":{"functions":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"params":{"type":"array","items":{"type":"string"}},"returnType":{"type":"string"},"lineNumber":{"type":"number"},"complexity":{"type":"string","enum":["low","medium","high"]}},"required":["name","params","returnType"]}}}}' \
  --output-format json 2>&1

# Security audit with structured findings
claude -p "Audit @src/auth.ts for security issues" \
  --json-schema '{"type":"object","properties":{"findings":{"type":"array","items":{"type":"object","properties":{"severity":{"type":"string","enum":["critical","high","medium","low"]},"category":{"type":"string"},"line":{"type":"number"},"description":{"type":"string"},"recommendation":{"type":"string"}},"required":["severity","category","description"]}},"overallRisk":{"type":"string","enum":["critical","high","medium","low"]}}}' \
  --output-format json 2>&1
```

**Best For:**
- Pipeline integration where downstream tools need guaranteed JSON structure
- Batch analysis producing machine-readable results
- Data extraction tasks that feed into automated workflows
- API response analysis with consistent output format

**Compared to other CLIs:** Codex CLI requests JSON via prompt instructions (no schema validation). Gemini CLI has `--output_format json` but no schema validation. Claude Code's `--json-schema` provides the strongest structural guarantee.

---

### Permission Mode: Plan (Read-Only)

**Safe read-only exploration mode.** `--permission-mode plan` restricts Claude Code to read-only operations — no file writes, no shell commands.

**Capabilities:**
- All read tools available (Read, Glob, Grep, WebFetch, WebSearch)
- File writing and editing disabled
- Shell command execution disabled
- Safe for exploration, review, and analysis tasks

**Usage:**

```bash
# Safe codebase exploration
claude -p "Analyze the architecture of this project" \
  --permission-mode plan --output-format text 2>&1

# Safe code review
claude -p "Review @src/auth.ts for security issues" \
  --permission-mode plan --output-format text 2>&1
```

**Best For:**
- Any task where the calling AI wants guaranteed read-only behavior
- Review and audit tasks where file modification would be inappropriate
- Exploration tasks before committing to implementation approach

**Compared to other CLIs:** Codex CLI has `--sandbox read-only` (similar concept). Gemini CLI has no equivalent read-only enforcement.

---

### Cost Control (--max-budget-usd)

**Budget-capped execution.** Set a maximum dollar amount for a Claude Code session.

**Usage:**

```bash
# Cap at $0.50
claude -p "Generate comprehensive tests for src/" --max-budget-usd 0.50 --output-format text 2>&1

# Cap at $2.00 for complex analysis
claude -p "Full security audit of the entire src/ directory" \
  --max-budget-usd 2.00 --permission-mode plan --output-format text 2>&1
```

**Best For:**
- Batch operations where costs could accumulate
- Experimentation without runaway spend
- CI/CD pipelines with cost budgets

**Compared to other CLIs:** Codex CLI and Gemini CLI have no built-in budget cap mechanism.

---

### Skills System

**On-demand specialized workflows.** Claude Code loads SKILL.md files that provide domain-specific instructions, reference materials, and routing logic.

**How it works:** Skills are loaded dynamically based on task intent. Each skill provides structured guidance including when to use, how to route, rules, and reference materials. This is an internal Claude Code capability — the calling AI doesn't invoke skills directly.

---

### Spec Kit Memory (MCP)

**Persistent structured context across sessions.** Via MCP tools, Claude Code maintains a searchable memory of project context, decisions, and implementation history.

**How it works:** Memory is stored in spec folders with semantic search, trigger phrases, and importance tiers. This enables Claude Code to recall prior decisions and context across sessions. The calling AI benefits because Claude Code can leverage historical project context that the calling AI doesn't have.

---

### Hooks

**Pre/post tool-call automation.** Configure shell commands that execute before or after specific tool invocations.

**How it works:** Hooks are configured in Claude Code's settings and fire automatically. For example, a hook could run linting after every file edit, or log every Bash command execution. This is transparent to the calling AI.

<!-- /ANCHOR:unique-capabilities -->

---

<!-- ANCHOR:comparison-table -->
## 3. THREE-WAY COMPARISON TABLE

### Claude Code vs Gemini CLI vs Codex CLI

| Capability | Claude Code | Gemini CLI | Codex CLI |
|------------|-------------|------------|-----------|
| **Deep Reasoning** | Extended thinking (`--effort high`) | Thinking mode (built-in) | `xhigh` reasoning effort |
| **Code Editing** | Edit tool (surgical diff-based) | Code execution | Workspace-write sandbox |
| **Structured Output** | `--json-schema` (validated) | `--output_format json` | Prompt-based JSON |
| **Read-Only Mode** | `--permission-mode plan` | N/A | `--sandbox read-only` |
| **Web Search** | N/A (use Gemini/Codex) | Google Search grounding | `--search` flag |
| **Cost Control** | `--max-budget-usd` | N/A | N/A |
| **Agent System** | 9 agents via `--agent` | 8 agents via `.gemini/agents/` | 9 agents via `-p` profiles |
| **Session Continuity** | `--continue`, `--resume` | `--session` | `resume`, `fork` |
| **Image Input** | N/A | `--image` | `--image` / `-i` |
| **Memory System** | Spec Kit Memory MCP | N/A | N/A |
| **Hooks** | Pre/post tool hooks | N/A | N/A |
| **Model Count** | 3 (opus, sonnet, haiku) | 1 (gemini-3.1-pro-preview) | 1 (gpt-5.3-codex) |
| **Auth Methods** | API key, OAuth, setup-token | API key, OAuth | API key, OAuth |
| **Nesting Guard** | `$CLAUDECODE` env var | N/A | N/A |
| **Non-Interactive** | `-p "prompt"` | `-p "prompt"` | `exec "prompt"` |
| **Review Workflow** | Via `--agent review` | Via agent definition | `/review` command (TUI) |
| **Background Exec** | `& 2>&1` (shell) | `& 2>&1` (shell) | `& 2>&1` (shell) |
| **MCP Support** | Built-in | `--mcp_tools` | `codex mcp` |

### When to Choose Each

| Need | Best Choice | Why |
|------|-------------|-----|
| Deep extended thinking | **Claude Code** | Explicit chain-of-thought with `--effort high` |
| Surgical code edits | **Claude Code** | Edit tool operates at diff level |
| Schema-validated JSON | **Claude Code** | `--json-schema` guarantees structure |
| Read-only exploration | **Claude Code** or **Codex** | Both have enforced read-only modes |
| Live web search | **Gemini** or **Codex** | Claude Code lacks web search |
| Cost-controlled batch ops | **Claude Code** | `--max-budget-usd` built-in |
| Diff-aware code review | **Codex** | `/review` command is diff-native |
| Google Search grounding | **Gemini** | Native Google Search integration |
| Multi-model flexibility | **Claude Code** | 3 tiers (opus/sonnet/haiku) |
| Visual input (screenshots) | **Gemini** or **Codex** | Both support `--image` |
| Persistent project memory | **Claude Code** | Spec Kit Memory MCP |

<!-- /ANCHOR:comparison-table -->

---

<!-- ANCHOR:integration-tips -->
## 4. INTEGRATION TIPS FOR CALLING AIs

### Combine CLI Strengths

External AIs can leverage multiple CLIs in a single workflow:

```text
1. Gemini CLI: Web research (Google Search grounding)
   → Gather current information about a library or vulnerability

2. Claude Code: Deep reasoning (extended thinking)
   → Analyze the research and design an implementation approach

3. Codex CLI: Code generation (sandbox-write)
   → Generate implementation based on Claude's plan

4. Claude Code: Code review (--permission-mode plan)
   → Review the generated code for quality and security

5. Calling AI: Final integration
   → Merge reviewed code into the project
```

### Output Parsing Patterns

```bash
# Plain text — direct string
OUTPUT=$(claude -p "Review this code" --output-format text 2>&1)

# JSON with metadata
claude -p "Analyze functions" --output-format json 2>&1 | jq -r '.result'

# Schema-validated JSON
claude -p "List endpoints" --json-schema '{"type":"object",...}' --output-format json 2>&1 | jq '.result'

# Stream JSON for real-time
claude -p "Long analysis task" --output-format stream-json 2>&1 | while read -r line; do
    echo "$line" | jq -r '.type // empty'
done
```

### Error Handling

```bash
# Robust invocation with error handling
OUTPUT=$(claude -p "$PROMPT" --output-format text 2>&1)
EXIT_CODE=$?

if [ $EXIT_CODE -ne 0 ]; then
    echo "Claude Code failed (exit $EXIT_CODE): $OUTPUT"
    # Fallback strategy: try with simpler model or different approach
fi

# Check for nesting error
if echo "$OUTPUT" | grep -q "CLAUDECODE"; then
    echo "Nesting detected — cannot run Claude Code inside itself"
fi
```

<!-- /ANCHOR:integration-tips -->
