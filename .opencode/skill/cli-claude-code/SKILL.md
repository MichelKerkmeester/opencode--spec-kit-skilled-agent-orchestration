---
name: cli-claude-code
description: "Claude Code CLI orchestrator enabling external AI assistants (Gemini, Codex, Copilot) to invoke Anthropic's Claude Code CLI for supplementary tasks including deep reasoning, code editing, structured output, code review, agent delegation, and extended thinking."
allowed-tools: [Bash, Read, Glob, Grep]
version: 1.1.3
---

<!-- Keywords: claude-code, claude-cli, anthropic, cross-ai, deep-reasoning, extended-thinking, code-editing, structured-output, agent-delegation, opus, sonnet, haiku -->

# Claude Code CLI Orchestrator - Cross-AI Task Delegation

> **CRITICAL — SELF-INVOCATION PROHIBITED**
>
> This skill dispatches to the Anthropic CLI binary (`claude`). If the agent currently reading this skill is itself running inside Claude Code (detection signals listed in §2), the skill MUST refuse to load and return the documented error message instead of generating any `claude` invocation.
>
> Just as a Claude Code agent never calls cli-claude-code, an OpenCode agent never calls cli-opencode, a Codex agent never calls cli-codex, a Copilot agent never calls cli-copilot, and a Gemini agent never calls cli-gemini. The cli-X skills are for **cross-AI delegation only** — never self-invocation.

Orchestrate Anthropic's Claude Code CLI from external AI assistants (Gemini CLI, Codex CLI, Copilot, etc.) for tasks that benefit from deep extended thinking, surgical code editing, structured output with JSON schema validation, agent delegation, or persistent memory context.

**Core Principle**: The calling AI stays the conductor. Delegate to Claude Code for what it does best — deep reasoning, precise code editing, and structured analysis. Validate and integrate the output.

---

<!-- ANCHOR:when-to-use -->
## 1. WHEN TO USE

### Activation Triggers

- **Deep Reasoning** — extended-thinking architectural decisions, multi-dimensional trade-off analysis, step-by-step algorithm design, root-cause analysis of subtle bugs.
- **Code Editing** — surgical diff-based edits, pattern-preserving refactors, multi-file coordinated changes, deep-context modifications.
- **Structured Output** — `--json-schema`-validated output, machine-readable analysis, guaranteed-structure data extraction, pipeline integration.
- **Code Review** — second-AI security audits, extended-thinking architecture review, cross-AI validation, pre-merge quality gates.
- **Agent-Delegated Tasks** — specialized `.claude/agents/*.md` matches, `--permission-mode plan` read-only exploration, `@ultra-think` planning, session continuity (`--continue`, `--resume`).
- **Background Processing** — long-running offloaded analysis, parallel generation/docs, batch processing with `--max-budget-usd` cost control.

### When NOT to Use

- **You ARE Claude Code already.** If your runtime is Claude Code (detection signal: `$CLAUDECODE` env var set, `claude` in process ancestry, or `~/.claude/state/<id>/lock` present), this skill refuses to load. Self-invocation creates a circular dispatch loop and burns tokens for no value. The cli-X family is exclusively for cross-AI delegation.
- Simple, quick tasks where CLI overhead is not worth it.
- Tasks requiring interactive terminal UI (use `claude` directly instead).
- Context already loaded and understood by the calling AI.
- Tasks where Claude Code CLI is not installed.
- Real-time web search (Claude Code has no `--search` flag — use Gemini or Codex).

---

<!-- /ANCHOR:when-to-use -->
<!-- ANCHOR:smart-routing -->
## 2. SMART ROUTING

### Prerequisite Detection

```bash
# Verify Claude Code CLI is available before routing
command -v claude || echo "Not installed. Run: npm install -g @anthropic-ai/claude-code"

# SELF-INVOCATION GUARD: If you ARE Claude Code, do not use this skill — use native capabilities
[ -n "$CLAUDECODE" ] && echo "ERROR: Already inside Claude Code session. Do not self-invoke."
```

### Self-Invocation Guard

```python
def detect_self_invocation():
    """Returns a non-None signal when the orchestrator is already running inside Claude Code."""
    # Layer 1: env var lookup — Claude Code sets CLAUDECODE on session start
    if os.environ.get('CLAUDECODE'):
        return ('env', 'CLAUDECODE')
    # Layer 2: process ancestry — claude in parent tree
    try:
        ancestry = subprocess.check_output(['ps', '-o', 'command=', '-p', str(os.getppid())]).decode()
        if '/claude' in ancestry or 'claude ' in ancestry:
            return ('ancestry', 'claude')
    except subprocess.SubprocessError:
        pass
    # Layer 3: state lock-file probe
    state_dir = os.path.expanduser('~/.claude/state')
    if os.path.isdir(state_dir):
        for entry in os.listdir(state_dir):
            if os.path.exists(os.path.join(state_dir, entry, 'lock')):
                return ('lockfile', entry)
    return None

if detect_self_invocation():
    refuse(
        "Self-invocation refused: this agent is already running inside Claude Code. "
        "Use a sibling cli-* skill or a fresh shell session in a different runtime to dispatch a different model."
    )
```

### Resource Loading Levels

| Level       | When to Load            | Resources                      |
| ----------- | ----------------------- | ------------------------------ |
| ALWAYS      | Every skill invocation  | `references/cli_reference.md`, `assets/prompt_quality_card.md` |
| CONDITIONAL | If intent signals match | Intent-mapped reference docs   |
| ON_DEMAND   | Only on explicit request| Extended templates and patterns |

### Smart Router

Provider-specific dictionaries (used by the shared helper functions in [`system-spec-kit/references/cli/shared_smart_router.md`](../system-spec-kit/references/cli/shared_smart_router.md)):

```python
INTENT_SIGNALS = {
    "DEEP_REASONING":    {"weight": 4, "keywords": ["reason", "think", "analyze", "trade-off", "architecture", "extended thinking", "chain-of-thought"]},
    "CODE_EDITING":      {"weight": 4, "keywords": ["edit", "refactor", "modify", "fix", "change code", "surgical edit", "diff-based"]},
    "STRUCTURED_OUTPUT": {"weight": 4, "keywords": ["json", "schema", "structured", "extract", "parse", "validate output", "--json-schema"]},
    "REVIEW":            {"weight": 4, "keywords": ["review", "audit", "security", "quality", "second opinion", "cross-validate"]},
    "AGENT_DELEGATION":  {"weight": 4, "keywords": ["delegate", "agent", "background", "parallel", "offload", "claude agent"]},
    "TEMPLATES":         {"weight": 3, "keywords": ["template", "prompt", "how to ask", "claude prompt"]},
    "PATTERNS":          {"weight": 3, "keywords": ["pattern", "workflow", "orchestrate", "session", "continue", "resume"]},
}

RESOURCE_MAP = {
    "DEEP_REASONING":    ["references/cli_reference.md", "references/claude_tools.md"],
    "CODE_EDITING":      ["references/cli_reference.md", "assets/prompt_templates.md"],
    "STRUCTURED_OUTPUT": ["references/cli_reference.md", "references/claude_tools.md"],
    "REVIEW":            ["references/integration_patterns.md", "references/agent_delegation.md"],
    "AGENT_DELEGATION":  ["references/agent_delegation.md", "references/integration_patterns.md"],
    "TEMPLATES":         ["assets/prompt_templates.md", "references/cli_reference.md"],
    "PATTERNS":          ["references/integration_patterns.md", "references/cli_reference.md"],
}

LOADING_LEVELS = {
    "ALWAYS": ["references/cli_reference.md", "assets/prompt_quality_card.md"],
    "ON_DEMAND_KEYWORDS": ["full reference", "all templates", "deep dive", "complete guide", "extended thinking", "json schema", "claude agent", "claude prompt", "diff-based edit"],
    "ON_DEMAND": ["references/claude_tools.md", "assets/prompt_templates.md"],
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Is the user asking about Claude Code CLI specifically?",
    "Does the task benefit from deep reasoning or extended thinking?",
    "Is structured JSON output needed (--json-schema)?",
    "Would surgical code editing or agent delegation help?",
]
```

**Call sequence** (using shared helpers from `shared_smart_router.md`):

1. `discover_markdown_resources()` — enumerate available `.md` files under `references/` and `assets/`
2. `score_intents(task)` — keyword-weight match against `INTENT_SIGNALS`
3. `select_intents(scores, ambiguity_delta=1.0)` — top-1 or top-2 if scores within delta
4. ALWAYS-load `LOADING_LEVELS["ALWAYS"]`, then UNKNOWN-fallback if max score == 0
5. CONDITIONAL-load `RESOURCE_MAP[intent]` for each selected intent
6. ON_DEMAND-load if any `ON_DEMAND_KEYWORDS` match the task text

The `route_claude_code_resources(task)` function body lives in [`shared_smart_router.md`](../system-spec-kit/references/cli/shared_smart_router.md) — substitute `<PROVIDER>` = `claude_code`.

---

<!-- /ANCHOR:smart-routing -->
<!-- ANCHOR:how-it-works -->
## 3. HOW IT WORKS

### Prerequisites

```bash
# Verify installation
command -v claude || echo "Not installed. Run: npm install -g @anthropic-ai/claude-code"

# Self-invocation guard
[ -n "$CLAUDECODE" ] && echo "ERROR: Already inside a Claude Code session — do not self-invoke"

# Authentication — API key OR setup-token (CI/CD)
export ANTHROPIC_API_KEY=your-key-here
claude setup-token
```

**Authentication options**: `ANTHROPIC_API_KEY` env var (direct API), `claude auth login` (interactive OAuth), or `claude setup-token` (non-interactive CI/CD).

### Core Invocation Pattern

All non-interactive Claude Code CLI calls use the `-p` (print) flag:

```bash
claude -p "prompt" --output-format text 2>&1
```

| Flag / Option | Purpose |
|---------------|---------|
| `-p "prompt"` | Non-interactive mode — send prompt, get response, exit |
| `--output-format text` | Plain text output (default for human consumption) |
| `--output-format json` | JSON output with metadata (role, content, cost) |
| `--output-format stream-json` | Streaming JSON for real-time processing |
| `--model claude-sonnet-4-6` | Model selection (default: sonnet) |
| `--permission-mode plan` | Read-only safe exploration — no file writes |
| `--permission-mode bypassPermissions` | Auto-approve all operations — **requires explicit user approval** |
| `--json-schema '{"type":"object",...}'` | Schema-validated structured output |
| `--max-budget-usd 1.00` | Cost cap for the session |
| `--agent review` | Route to a specialized agent |
| `--continue` | Continue the most recent conversation |
| `--resume SESSION_ID` | Resume a specific session |

### Model Selection

| Model | ID | Use Case |
|-------|----|----------|
| **Opus** | `claude-opus-4-6` | Deep reasoning, complex architecture, extended thinking |
| **Sonnet** | `claude-sonnet-4-6` | Balanced performance/cost — default for most tasks |
| **Haiku** | `claude-haiku-4-5-20251001` | Fast, lightweight tasks (classification, formatting, simple queries) |

**Selection guidance**: Default to Sonnet unless the task specifically needs deep reasoning (Opus + `--effort high`) or is trivially simple (Haiku for batch ops where speed > depth).

### Claude Code Agent Delegation

The calling AI is the conductor; Claude Code agents in `.claude/agents/*.md` shape HOW Claude Code processes the task.

| Task Type | Agent | Invocation Pattern |
|-----------|-------|-------------------|
| Codebase exploration | `context` | `claude -p "Analyze the architecture of src/" --agent context --permission-mode plan --output-format text 2>&1` |
| Systematic debugging | `debug` | `claude -p "Debug this error: [error]" --agent debug --output-format text 2>&1` |
| Session state capture | `handover` | `claude -p "Create handover for current work" --agent handover --output-format text 2>&1` |
| Multi-agent coordination | `orchestrate` | `claude -p "Coordinate review and testing of auth module" --agent orchestrate --output-format text 2>&1` |
| Evidence gathering | `research` | `claude -p "Research best practices for [topic]" --agent research --output-format text 2>&1` |
| Code review / audit | `review` | `claude -p "Review @src/auth.ts for security issues" --agent review --permission-mode plan --output-format text 2>&1` |
| Spec documentation | `speckit` | `claude -p "Create spec folder for [feature]" --agent speckit --output-format text 2>&1` |
| Multi-strategy planning | `ultra-think` | `claude -p "Plan the authentication redesign" --agent ultra-think --permission-mode plan --output-format text 2>&1` |
| Documentation generation | `write` | `claude -p "Generate README for this project" --agent write --output-format text 2>&1` |

See [agent_delegation.md](./references/agent_delegation.md) for complete agent roster.

### Unique Claude Code Capabilities

| Capability | Purpose | Invocation |
|------------|---------|------------|
| Extended Thinking | Deep chain-of-thought reasoning | `claude -p "..." --effort high --model claude-opus-4-6` |
| Edit Tool | Surgical diff-based code editing | Built-in — Claude Code edits files directly |
| Agent Tool | Spawn focused subagents within a session | Built-in — agents defined in `.claude/agents/` |
| `--json-schema` | Schema-validated structured output | `claude -p "..." --json-schema '{"type":"object",...}'` |
| `--permission-mode plan` | Read-only safe exploration | `claude -p "..." --permission-mode plan` |
| `--max-budget-usd` | Cost-controlled execution | `claude -p "..." --max-budget-usd 1.00` |
| Skills System | On-demand specialized workflows | Loaded via SKILL.md files |
| Spec Kit Memory | Persistent structured context across sessions | Via MCP tools |
| Hooks | Pre/post tool-call automation | Configured in settings |
| Session continuity | Continue or resume conversations | `--continue` or `--resume SESSION_ID` |

### Essential Commands

```bash
# Deep reasoning with extended thinking (Opus)
claude -p "Analyze the trade-offs between microservices and monolith for this project." \
  --model claude-opus-4-6 --effort high --output-format text 2>&1

# Code review (read-only — safe exploration)
claude -p "Review @src/auth.ts for security vulnerabilities" \
  --permission-mode plan --output-format text 2>&1

# Structured JSON output with schema validation
claude -p "Analyze src/utils.ts and return function signatures" \
  --json-schema '{"type":"object","properties":{"functions":{"type":"array"}}}' \
  --output-format json 2>&1

# Agent-delegated architecture analysis
claude -p "Map the dependency graph for src/" \
  --agent context --permission-mode plan --output-format text 2>&1

# Cost-controlled background execution
claude -p "Generate comprehensive tests for src/utils.ts" \
  --max-budget-usd 0.50 --output-format text 2>&1 &

# Continue previous conversation
claude -p "Now refactor the auth module based on the review" --continue --output-format text 2>&1
```

### Error Handling

| Issue | Solution |
|-------|----------|
| CLI not installed | `npm install -g @anthropic-ai/claude-code` |
| `ANTHROPIC_API_KEY` not set | `export ANTHROPIC_API_KEY=your-key` or run `claude auth login` |
| Nested session detected | Cannot run `claude` inside Claude Code — use a different terminal or exit first |
| Rate limit exceeded | Wait for auto-retry or reduce request frequency |
| Budget exceeded | Increase `--max-budget-usd` or reduce prompt complexity |
| Permission denied | Match `--permission-mode` to task requirements |
| Context too large | Specify files explicitly with `@./path` rather than broad prompts |

---

<!-- /ANCHOR:how-it-works -->
<!-- ANCHOR:rules -->
## 4. RULES

### ALWAYS

1. Verify Claude Code CLI is installed before first invocation (`command -v claude`); check `$CLAUDECODE` for nesting.
2. Use `--permission-mode plan` for review/analysis/exploration (no file writes); `--output-format text` unless JSON is specifically needed.
3. Validate output before applying — correctness, completeness, alignment, syntax checks if code generated.
4. Capture stderr (`2>&1`) to catch errors and warnings.
5. Specify `--model` explicitly: default `claude-sonnet-4-6` unless task needs Opus (deep reasoning) or Haiku (fast/cheap).
6. Route to the appropriate `--agent <name>` when the task matches a specialization (see Section 3 routing table).
7. **Pass the spec folder to the delegated agent** in the prompt: if the calling AI has an active Gate-3 spec folder, include `Spec folder: <path> (pre-approved, skip Gate 3)`. If none, ASK the user before delegating — the delegated agent cannot answer Gate 3 interactively.
8. **Load `assets/prompt_quality_card.md` before building any dispatch prompt.** Apply the CLEAR 5-question check, tag the framework in the Bash invocation comment, and use the returned `ENHANCED_PROMPT`. If complexity ≥ 7/10 or compliance/security signals appear, dispatch `@improve-prompt` via the Task tool instead of loading `sk-improve-prompt` inline.

### NEVER

1. Use `--permission-mode bypassPermissions` without explicit user approval (auto-approves all writes/tool calls).
2. Trust output blindly for security-sensitive code (review for XSS, injection, hardcoded secrets, eval), or send sensitive data (API keys, passwords, credentials) in prompts — Claude Code transmits to Anthropic's API.
3. Hammer the API with rapid sequential calls — respect rate limits; use `--max-budget-usd` for cost control.
4. Use Claude Code for tasks where context is already loaded — direct action by the calling AI is faster.

### ESCALATE IF

1. Claude Code CLI is not installed and user has not acknowledged (provide `npm install -g @anthropic-ai/claude-code`).
2. Rate limits or budget caps are persistently hit (suggest increasing `--max-budget-usd` or checking quota).
3. Output conflicts with existing code patterns (present both perspectives; user decides).
4. Task requires `--permission-mode bypassPermissions` (describe risks; get explicit user approval).

### Memory Handback Protocol

When the calling AI needs to preserve session context from a Claude Code CLI delegation, run the canonical 7-step procedure (extract `MEMORY_HANDBACK` section → build structured JSON → scrub secrets → invoke `generate-context.js` via `--stdin`/`--json`/temp-file → `memory_index_scan`). Full procedure and caveats: [`system-spec-kit/references/cli/memory_handback.md`](../system-spec-kit/references/cli/memory_handback.md).

Claude-Code-specific Memory Epilogue template: see [assets/prompt_templates.md](./assets/prompt_templates.md) §11.

Example invocation:
```bash
printf '%s' "$JSON_PAYLOAD" | node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --stdin [spec-folder]
```

---

<!-- /ANCHOR:rules -->
<!-- ANCHOR:references -->
## 5. REFERENCES

### Core References

- [cli_reference.md](./references/cli_reference.md) - Complete CLI flags, commands, models, authentication, and configuration
- [integration_patterns.md](./references/integration_patterns.md) - Cross-AI orchestration patterns (reversed: external AI conducts, Claude Code executes)
- [claude_tools.md](./references/claude_tools.md) - Unique capabilities and 3-way comparison with Gemini CLI and Codex CLI
- [agent_delegation.md](./references/agent_delegation.md) - 9 agent roster, routing table, and invocation patterns

### Templates and Assets

- [prompt_templates.md](./assets/prompt_templates.md) - Copy-paste ready prompt templates for common tasks

### Shared (cli-* family)
- [shared_smart_router.md](../system-spec-kit/references/cli/shared_smart_router.md) - Helper-function bodies for the smart router.
- [memory_handback.md](../system-spec-kit/references/cli/memory_handback.md) - Canonical 7-step Memory Handback procedure.

### External
- [Claude Code GitHub](https://github.com/anthropics/claude-code) - Official repository
- [Anthropic Console](https://console.anthropic.com/settings/keys) - API key management
- [Claude Code Documentation](https://docs.anthropic.com/en/docs/claude-code) - Official docs

### Reference Loading Notes

- Load only references needed for current intent.
- Smart Routing (Section 2) is the single routing authority.
- `cli_reference.md` is ALWAYS loaded as baseline.

---

<!-- /ANCHOR:references -->
<!-- ANCHOR:success-criteria -->
## 6. SUCCESS CRITERIA

### Task Completion

- Claude Code CLI invoked with correct flags, model, and permission mode.
- Output captured, validated, and integrated appropriately.
- No security vulnerabilities introduced from generated code.
- Rate limits and budget caps handled gracefully.
- Appropriate agent routed for specialized tasks.
- Permission mode matched to task type (plan for review, default for generation).

### Skill Quality

- All 8 sections present with proper anchor comments.
- Smart routing covers all intent signals with UNKNOWN_FALLBACK.
- Reference files provide deep-dive content without duplication.

---

<!-- /ANCHOR:success-criteria -->
<!-- ANCHOR:integration-points -->
## 7. INTEGRATION POINTS

### Framework Integration

This skill operates within the behavioral framework defined in [AGENTS.md](../../../AGENTS.md).

Key integrations:
- **Gate 2**: Skill routing via `skill_advisor.py`
- **Tool Routing**: Per AGENTS.md Section 6 decision tree
- **Memory**: Context preserved via Spec Kit Memory MCP

**Tool roles**: Bash dispatches the CLI; Read/Glob/Grep validate output.

### Related Skills

| Skill | Integration |
|-------|-------------|
| **cli-gemini** | Parallel cross-AI validation — Gemini for Google Search grounding, Claude Code for deep reasoning |
| **cli-codex** | Parallel cross-AI validation — Codex for sandbox execution, Claude Code for extended thinking |
| **sk-code-web** | Use Claude Code for code review during web development |
| **sk-code-full-stack** | Delegate architecture analysis or test generation to Claude Code |
| **mcp-code-mode** | Claude Code CLI is independent; does not require Code Mode |

---

<!-- /ANCHOR:integration-points -->
<!-- ANCHOR:related-resources -->
## 8. RELATED RESOURCES

See Section 5 REFERENCES for the canonical reference, asset, shared, and external link list.

---

<!-- /ANCHOR:related-resources -->
