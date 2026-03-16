---
name: cli-claude-code
description: "Claude Code CLI orchestrator enabling external AI assistants (Gemini, Codex, Copilot) to invoke Anthropic's Claude Code CLI for supplementary tasks including deep reasoning, code editing, structured output, code review, agent delegation, and extended thinking."
allowed-tools: [Bash, Read, Glob, Grep]
version: 1.1.1
---

<!-- Keywords: claude-code, claude-cli, anthropic, cross-ai, deep-reasoning, extended-thinking, code-editing, structured-output, agent-delegation, opus, sonnet, haiku -->

# Claude Code CLI Orchestrator - Cross-AI Task Delegation

Orchestrate Anthropic's Claude Code CLI from external AI assistants (Gemini CLI, Codex CLI, Copilot, etc.) for tasks that benefit from deep extended thinking, surgical code editing, structured output with JSON schema validation, agent delegation, or persistent memory context.

**Core Principle**: The calling AI stays the conductor. Delegate to Claude Code for what it does best — deep reasoning, precise code editing, and structured analysis. Validate and integrate the output.

---

<!-- ANCHOR:when-to-use -->
## 1. WHEN TO USE

### Activation Triggers

**Deep Reasoning** - Use when:
- Complex architectural decisions need extended thinking with chain-of-thought
- Trade-off analysis requires weighing multiple dimensions simultaneously
- Algorithm design needs step-by-step logical reasoning
- Root cause analysis of subtle bugs that resist surface-level debugging

**Code Editing** - Use when:
- Surgical, diff-based edits needed across specific files
- Precise refactoring that must preserve existing patterns
- Multi-file coordinated changes with dependency awareness
- Code modifications requiring deep codebase context

**Structured Output** - Use when:
- JSON schema-validated output is required (`--json-schema`)
- Analysis results need machine-readable format for downstream processing
- Data extraction needs guaranteed structure
- Pipeline integration requires predictable output format

**Code Review** - Use when:
- Security audit needs a second AI perspective
- Architecture review benefits from Claude's extended thinking
- Cross-AI validation to catch blind spots from the calling AI
- Quality gate verification before merge

**Agent-Delegated Tasks** - Use when:
- Task matches a specialized Claude Code agent's expertise (`.opencode/agent/*.md`)
- Read-only exploration needed via `--permission-mode plan`
- Multi-strategy planning via `@ultra-think` agent
- Session continuity needed (`--continue`, `--resume`)

**Background Processing** - Use when:
- Offloading long-running analysis while the calling AI continues other work
- Parallel code generation or documentation tasks
- Batch processing multiple files with `--max-budget-usd` cost control

### When NOT to Use

- **Self-invocation guard**: If you ARE Claude Code (running natively inside a Claude Code session), do NOT use this skill. You already have direct access to all capabilities described here — Edit tool, Agent tool, extended thinking, structured output, skills system, and Spec Kit Memory. Delegating to yourself via CLI is circular and wasteful. This skill is for EXTERNAL AIs (Gemini, Codex, Copilot) to delegate TO Claude Code. Detection: `$CLAUDECODE` env var is set when inside a Claude Code session.
- Simple, quick tasks where CLI overhead is not worth it
- Tasks requiring interactive terminal UI (use `claude` directly instead)
- Context already loaded and understood by the calling AI
- Tasks where Claude Code CLI is not installed
- Real-time web search (Claude Code has no `--search` flag — use Gemini or Codex)

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

### Phase Detection

```text
TASK CONTEXT
    |
    +- STEP 0: Verify Claude Code CLI installed + not nested
    +- STEP 1: Score intents (top-2 when ambiguity is small)
    +- Phase 1: Construct prompt with model selection and output format
    +- Phase 2: Execute via Bash tool
    +- Phase 3: Validate and integrate output
```

### Resource Domains

The router discovers markdown resources recursively from `references/` and `assets/` and then applies intent scoring from `INTENT_SIGNALS`.

```text
references/cli_reference.md          — CLI flags, commands, models, auth, config
references/integration_patterns.md   — Cross-AI orchestration patterns (reversed)
references/claude_tools.md           — Unique capabilities and comparison table
references/agent_delegation.md       — Claude Code agent routing and invocation
assets/prompt_templates.md           — Copy-paste ready templates
```

### Resource Loading Levels

| Level       | When to Load            | Resources                      |
| ----------- | ----------------------- | ------------------------------ |
| ALWAYS      | Every skill invocation  | `references/cli_reference.md`  |
| CONDITIONAL | If intent signals match | Intent-mapped reference docs   |
| ON_DEMAND   | Only on explicit request| Extended templates and patterns |

### Smart Router Pseudocode

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/cli_reference.md"

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
    "ALWAYS": [DEFAULT_RESOURCE],
    "ON_DEMAND_KEYWORDS": ["full reference", "all templates", "deep dive", "complete guide"],
    "ON_DEMAND": ["references/claude_tools.md", "assets/prompt_templates.md"],
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Is the user asking about Claude Code CLI specifically?",
    "Does the task benefit from deep reasoning or extended thinking?",
    "Is structured JSON output needed (--json-schema)?",
    "Would surgical code editing or agent delegation help?",
]

def _task_text(task) -> str:
    return " ".join([
        str(getattr(task, "text", "")),
        str(getattr(task, "query", "")),
        " ".join(getattr(task, "keywords", []) or []),
    ]).lower()

def _guard_in_skill(relative_path: str) -> str:
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)
    if resolved.suffix.lower() != ".md":
        raise ValueError(f"Only markdown resources are routable: {relative_path}")
    return resolved.relative_to(SKILL_ROOT).as_posix()

def discover_markdown_resources() -> set[str]:
    docs = []
    for base in RESOURCE_BASES:
        if base.exists():
            docs.extend(p for p in base.rglob("*.md") if p.is_file())
    return {doc.relative_to(SKILL_ROOT).as_posix() for doc in docs}

def score_intents(task) -> dict[str, float]:
    text = _task_text(task)
    scores = {intent: 0.0 for intent in INTENT_SIGNALS}
    for intent, cfg in INTENT_SIGNALS.items():
        for keyword in cfg["keywords"]:
            if keyword in text:
                scores[intent] += cfg["weight"]
    return scores

def select_intents(scores: dict[str, float], ambiguity_delta: float = 1.0, max_intents: int = 2) -> list[str]:
    ranked = sorted(scores.items(), key=lambda item: item[1], reverse=True)
    if not ranked or ranked[0][1] <= 0:
        return ["DEEP_REASONING"]  # zero-score fallback
    selected = [ranked[0][0]]
    if len(ranked) > 1 and ranked[1][1] > 0 and (ranked[0][1] - ranked[1][1]) <= ambiguity_delta:
        selected.append(ranked[1][0])
    return selected[:max_intents]

def route_claude_code_resources(task):
    inventory = discover_markdown_resources()
    scores = score_intents(task)
    intents = select_intents(scores, ambiguity_delta=1.0)
    loaded = []
    seen = set()

    def load_if_available(relative_path: str) -> None:
        guarded = _guard_in_skill(relative_path)
        if guarded in inventory and guarded not in seen:
            load(guarded)
            loaded.append(guarded)
            seen.add(guarded)

    # 1. ALWAYS load baseline
    for relative_path in LOADING_LEVELS["ALWAYS"]:
        load_if_available(relative_path)

    # 2. UNKNOWN FALLBACK: no keywords matched at all
    if max(scores.values()) == 0:
        load_if_available("references/cli_reference.md")
        return {
            "intents": ["DEEP_REASONING"],
            "load_level": "UNKNOWN_FALLBACK",
            "needs_disambiguation": True,
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
            "resources": loaded,
        }

    # 3. CONDITIONAL: intent-mapped resources
    for intent in intents:
        for relative_path in RESOURCE_MAP.get(intent, []):
            load_if_available(relative_path)

    # 4. ON_DEMAND: explicit keyword triggers
    text = _task_text(task)
    if any(keyword in text for keyword in LOADING_LEVELS["ON_DEMAND_KEYWORDS"]):
        for relative_path in LOADING_LEVELS["ON_DEMAND"]:
            load_if_available(relative_path)

    # 5. Safety net
    if not loaded:
        load_if_available(DEFAULT_RESOURCE)

    return {"intents": intents, "intent_scores": scores, "resources": loaded}
```

---

<!-- /ANCHOR:smart-routing -->
<!-- ANCHOR:how-it-works -->
## 3. HOW IT WORKS

### Prerequisites

Claude Code CLI must be installed and authenticated:

```bash
# Verify installation
command -v claude || echo "Not installed. Run: npm install -g @anthropic-ai/claude-code"

# SELF-INVOCATION GUARD: Cannot run Claude Code inside Claude Code
[ -n "$CLAUDECODE" ] && echo "ERROR: Already inside a Claude Code session — do not self-invoke"

# Authentication — API key
export ANTHROPIC_API_KEY=your-key-here

# Authentication — token setup for CI/CD
claude setup-token
```

**Authentication options**: `ANTHROPIC_API_KEY` environment variable (direct API access), or OAuth via `claude auth login` (interactive browser flow), or `claude setup-token` (non-interactive CI/CD).

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

**Selection guidance:**
- Default to **Sonnet** unless the task specifically needs deep reasoning (Opus) or is trivially simple (Haiku)
- Use `--effort high` with Opus for maximum reasoning depth
- Use Haiku for batch operations where speed matters more than depth

### Claude Code Agent Delegation

The calling AI acts as the **conductor** that delegates tasks to Claude Code CLI. Claude Code has specialized agents defined in `.opencode/agent/*.md` that provide domain expertise.

**Agent Routing Table:**

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

**Orchestration principle**: The calling AI decides WHAT to delegate. Claude Code's agent configuration shapes HOW it processes the task. The calling AI always validates and integrates the output.

See [agent_delegation.md](./references/agent_delegation.md) for complete agent roster and invocation patterns.

### Unique Claude Code Capabilities

These capabilities are exclusive to Claude Code CLI or provide meaningfully different workflows:

| Capability | Purpose | Invocation |
|------------|---------|------------|
| Extended Thinking | Deep chain-of-thought reasoning | `claude -p "..." --effort high --model claude-opus-4-6` |
| Edit Tool | Surgical diff-based code editing | Built-in — Claude Code edits files directly |
| Agent Tool | Spawn focused subagents within a session | Built-in — agents defined in `.opencode/agent/` |
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
claude -p "Analyze the trade-offs between microservices and monolith for this project. Consider scalability, team size, deployment complexity." \
  --model claude-opus-4-6 --effort high --output-format text 2>&1

# Code review (read-only — safe exploration)
claude -p "Review @src/auth.ts for security vulnerabilities" \
  --permission-mode plan --output-format text 2>&1

# Structured JSON output with schema validation
claude -p "Analyze src/utils.ts and return function signatures" \
  --json-schema '{"type":"object","properties":{"functions":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"params":{"type":"string"},"returnType":{"type":"string"}}}}}}' \
  --output-format json 2>&1

# Fast classification with Haiku
claude -p "Classify this error as: syntax, runtime, logic, or configuration: [error]" \
  --model claude-haiku-4-5-20251001 --output-format text 2>&1

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

**ALWAYS do these without asking:**

1. **ALWAYS verify Claude Code CLI is installed** before first invocation
   - Run `command -v claude` and handle missing installation gracefully

2. **ALWAYS check for nesting** before invocation
   - Check `$CLAUDECODE` env var — Claude Code cannot run inside itself

3. **ALWAYS use `--permission-mode plan`** for review and analysis tasks
   - Review, audit, architecture analysis, and exploration should never write files

4. **ALWAYS use `--output-format text`** unless JSON output is specifically needed
   - Text output is simpler to parse and integrate into calling AI workflows

5. **ALWAYS validate Claude Code output** before applying to the project
   - Check for correctness, completeness, and alignment with requirements
   - Run syntax checks if code was generated

6. **ALWAYS capture stderr** with `2>&1` to catch error messages and warnings

7. **ALWAYS specify the model** explicitly with `--model`
   - Default to `claude-sonnet-4-6` unless task requires opus (deep reasoning) or haiku (fast/cheap)

8. **ALWAYS route to the appropriate agent** when the task matches an agent specialization
   - Use `--agent <name>` flag; see agent routing table in Section 3

### NEVER

**NEVER do these:**

1. **NEVER use `--permission-mode bypassPermissions`** without explicit user approval
   - This mode auto-approves all file writes and tool executions

2. **NEVER invoke this skill from within Claude Code itself**
   - If you ARE Claude Code, you already have native access to all capabilities — do not self-delegate via CLI
   - Check `$CLAUDECODE` env var; self-invocation and nesting cause circular loops and undefined behavior

3. **NEVER trust Claude Code output blindly** for security-sensitive code
   - Always review for XSS, injection, hardcoded secrets, and eval() calls

4. **NEVER send sensitive data** (API keys, passwords, credentials) in prompts
   - Claude Code CLI transmits prompts to Anthropic's API

5. **NEVER hammer the API** with rapid sequential calls
   - Respect rate limits; use `--max-budget-usd` for cost control

6. **NEVER use Claude Code for tasks where context is already loaded**
   - If the calling AI already understands the code, direct action is faster

### ESCALATE IF

**Ask user when:**

1. **ESCALATE IF Claude Code CLI is not installed** and user has not acknowledged
   - Provide installation command: `npm install -g @anthropic-ai/claude-code`

2. **ESCALATE IF rate limits or budget caps are persistently hit**
   - Suggest increasing `--max-budget-usd` or checking API key quota

3. **ESCALATE IF Claude Code output conflicts with existing code patterns**
   - Present both perspectives and let user decide

4. **ESCALATE IF task requires `--permission-mode bypassPermissions`**
   - Describe risks and get explicit user approval before proceeding

### Memory Handback Protocol

When the calling AI needs to preserve session context from a Claude Code CLI delegation:

1. **Include epilogue**: Append the Memory Epilogue template (see `assets/prompt_templates.md` §11) to the delegated prompt
2. **Extract section**: After receiving agent output, extract the `MEMORY_HANDBACK` section using: `/<!-- MEMORY_HANDBACK_START -->([\s\S]*?)<!-- MEMORY_HANDBACK_END -->/`
3. **Parse to JSON**: Map extracted fields to `{ sessionSummary, filesModified, keyDecisions, specFolder, triggerPhrases, nextSteps }` (the save flow also accepts documented snake_case keys such as `session_summary`, `files_modified`, `trigger_phrases`, `recent_context`, and `next_steps`)
4. **Redact and scrub**: Remove secrets, tokens, credentials, and any unnecessary sensitive values before writing the JSON file
5. **Write JSON**: Save the scrubbed payload to `/tmp/save-context-data.json`
6. **Invoke generate-context.js**: `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json [spec-folder]`
7. **Index**: Run `memory_index_scan({ specFolder })` for immediate MCP visibility

**Graceful degradation**: If agent output lacks `MEMORY_HANDBACK` delimiters, the calling AI manually constructs the JSON from agent output and saves via the same JSON mode path. The save flow normalizes `nextSteps` or `next_steps`; the first entry persists as `Next: ...` and drives `NEXT_ACTION`, and remaining entries persist as `Follow-up: ...`.

**Explicit JSON mode failures**: If the explicit data file cannot be loaded, `generate-context.js` fails with `EXPLICIT_DATA_FILE_LOAD_FAILED: ...`. Do not fall back to OpenCode capture in that case; surface the error and stop.

**Post-010 save gates**: Valid JSON can still be rejected after normalization. File-backed handbacks skip the stateless alignment and `QUALITY_GATE_ABORT` checks, but they still fail with `INSUFFICIENT_CONTEXT_ABORT` when the payload is too thin and with `CONTAMINATION_GATE_ABORT` when it includes content from another spec.

**Minimum payload guidance**: Include a specific `sessionSummary`, at least one meaningful `recentContext` entry or equivalent observation, and rich `FILES` entries with a descriptive `DESCRIPTION`. Add `ACTION`, `MODIFICATION_MAGNITUDE`, and `_provenance` when known so the saved memory carries durable evidence instead of bare filenames.

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

### Reference Loading Notes

- Load only references needed for current intent
- Keep Smart Routing (Section 2) as the single routing authority
- `cli_reference.md` is ALWAYS loaded as baseline

---

<!-- /ANCHOR:references -->
<!-- ANCHOR:success-criteria -->
## 6. SUCCESS CRITERIA

### Task Completion

- Claude Code CLI invoked with correct flags, model, and permission mode
- Output captured, validated, and integrated appropriately
- No security vulnerabilities introduced from generated code
- Rate limits and budget caps handled gracefully
- Appropriate agent routed for specialized tasks
- Permission mode matched to task type (plan for review, default for generation)

### Skill Quality

- SKILL.md under 5000 words with progressive disclosure
- All 8 sections present with proper anchor comments
- Smart routing covers all intent signals with UNKNOWN_FALLBACK
- Reference files provide deep-dive content without duplication

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

### Tool Usage

| Tool | Purpose |
|------|---------|
| **Bash** | Execute `claude -p` commands |
| **Read** | Examine Claude Code output files |
| **Glob** | Find generated files |
| **Grep** | Search within generated output |

### Related Skills

| Skill | Integration |
|-------|-------------|
| **cli-gemini** | Parallel cross-AI validation — Gemini for Google Search grounding, Claude Code for deep reasoning |
| **cli-codex** | Parallel cross-AI validation — Codex for sandbox execution, Claude Code for extended thinking |
| **sk-code--web** | Use Claude Code for code review during web development |
| **sk-code--full-stack** | Delegate architecture analysis or test generation to Claude Code |
| **mcp-code-mode** | Claude Code CLI is independent; does not require Code Mode |

### External Tools

**Claude Code CLI** (required):
- Installation: `npm install -g @anthropic-ai/claude-code`
- Authentication: `ANTHROPIC_API_KEY` env var or `claude auth login` (OAuth)
- Purpose: Core execution engine for all delegated tasks
- Fallback: Skill informs user of installation steps if missing

---

<!-- /ANCHOR:integration-points -->
<!-- ANCHOR:related-resources -->
## 8. RELATED RESOURCES

### Reference Files
- [cli_reference.md](./references/cli_reference.md) - CLI flags, commands, models, authentication, and configuration
- [integration_patterns.md](./references/integration_patterns.md) - Cross-AI orchestration patterns (reversed)
- [claude_tools.md](./references/claude_tools.md) - Unique capabilities and 3-way comparison
- [agent_delegation.md](./references/agent_delegation.md) - Agent routing and invocation

### Templates
- [prompt_templates.md](./assets/prompt_templates.md) - Copy-paste ready prompt templates

### Related Skills
- `cli-gemini` - Google Gemini CLI for Google Search grounding and cross-AI validation
- `cli-codex` - OpenAI Codex CLI for sandbox execution and cross-AI validation
- `sk-doc` - Documentation generation that Claude Code can supplement
- `sk-code--web` - Web development where Claude Code provides second opinions
- `sk-code--full-stack` - Full-stack tasks with Claude Code architecture analysis

### External
- [Claude Code GitHub](https://github.com/anthropics/claude-code) - Official repository
- [Anthropic Console](https://console.anthropic.com/settings/keys) - API key management
- [Claude Code Documentation](https://docs.anthropic.com/en/docs/claude-code) - Official docs

---

<!-- /ANCHOR:related-resources -->
