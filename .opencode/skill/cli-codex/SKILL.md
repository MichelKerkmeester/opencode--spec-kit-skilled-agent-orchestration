---
name: cli-codex
description: "Codex CLI orchestrator enabling any AI assistant to invoke OpenAI's Codex CLI for supplementary AI tasks including code generation, code review, web research, codebase analysis, cross-AI validation, and parallel task processing."
allowed-tools: [Bash, Read, Glob, Grep]
version: 1.3.1
---

<!-- Keywords: codex, codex-cli, openai, cross-ai, web-search, code-generation, code-review, second-opinion, agent-delegation, gpt-5, session-management -->

# Codex CLI Orchestrator - Cross-AI Task Delegation

Orchestrate OpenAI's Codex CLI for tasks that benefit from a second AI perspective, real-time web search, deep codebase analysis, built-in code review workflows, or parallel code generation.

**Core Principle**: Use Codex for what it does best. Delegate, validate, integrate. The calling AI stays the conductor.

---

<!-- ANCHOR:when-to-use -->
## 1. WHEN TO USE

### Activation Triggers

**Cross-AI Validation** - Use when:
- Code review needs a second perspective after writing code
- Security audit benefits from alternative analysis
- Bug detection where fresh eyes help
- `/review` command workflow is desired (diff-aware review)

**Web Research** - Use when:
- Questions require current internet information
- Checking latest library versions, API changes, documentation
- Finding community solutions or recent best practices
- `--search` flag enables live web browsing

**Codebase Architecture Analysis** - Use when:
- Onboarding to an unfamiliar codebase
- Mapping cross-file dependencies and component relationships
- Creating architecture documentation from existing code

**Parallel Task Processing** - Use when:
- Offloading generation tasks while continuing other work
- Running multiple code generations simultaneously
- Background documentation or test generation

**Agent-Delegated Tasks** - Use when:
- Task matches a specialized Codex agent's expertise (`.codex/agents/*.toml`)
- Session management needed (resume, fork for multi-turn workflows)
- Multi-strategy planning needs an independent perspective

**Specialized Generation** - Use when:
- User explicitly requests Codex operations
- Test suite generation for entire modules
- Code translation between languages
- Batch documentation generation (JSDoc, README, API docs)
- Visual input required (`--image` / `-i` for screenshots or designs)

### When NOT to Use

- **Self-invocation guard**: If you ARE Codex CLI (running natively inside a Codex CLI session), do NOT use this skill. You already have direct access to all capabilities described here — sandbox execution, /review workflow, --search, session management, and your profile system. Delegating to yourself via CLI is circular and wasteful. This skill is for EXTERNAL AIs (Claude Code, Gemini, Copilot) to delegate TO Codex CLI.
- Simple, quick tasks where CLI overhead is not worth it
- Tasks requiring immediate response (rate limits may cause delays)
- Context already loaded and understood by the current agent
- Interactive refinement requiring the full-screen TUI (use `codex` directly instead)
- Tasks where Codex CLI is not installed

---

<!-- /ANCHOR:when-to-use -->
<!-- ANCHOR:smart-routing -->
## 2. SMART ROUTING

### Prerequisite Detection

```bash
# Verify Codex CLI is available before routing
command -v codex || echo "Not installed. Run: npm i -g @openai/codex"
```

### Phase Detection

```text
TASK CONTEXT
    |
    +- STEP 0: Verify Codex CLI installed
    +- STEP 1: Score intents (top-2 when ambiguity is small)
    +- Phase 1: Construct prompt with agent routing and sandbox mode
    +- Phase 2: Execute via Bash tool
    +- Phase 3: Validate and integrate output
```

### Resource Domains

The router discovers markdown resources recursively from `references/` and `assets/` and then applies intent scoring from `INTENT_SIGNALS`.

```text
references/cli_reference.md          — CLI flags, commands, subcommands, config
references/integration_patterns.md   — Cross-AI orchestration patterns
references/codex_tools.md            — Built-in tools and capabilities comparison
references/agent_delegation.md       — Codex agent routing and invocation
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
    "GENERATION":        {"weight": 4, "keywords": ["generate", "create", "build", "write code", "codex create"]},
    "REVIEW":            {"weight": 4, "keywords": ["review", "audit", "security", "bug", "second opinion", "cross-validate", "/review"]},
    "RESEARCH":          {"weight": 4, "keywords": ["search", "latest", "current", "what's new", "web research", "--search", "browse"]},
    "ARCHITECTURE":      {"weight": 3, "keywords": ["architecture", "codebase", "investigate", "dependencies", "analyze project"]},
    "AGENT_DELEGATION":  {"weight": 4, "keywords": ["delegate", "agent", "background", "parallel", "offload", "codex agent"]},
    "TEMPLATES":         {"weight": 3, "keywords": ["template", "prompt", "how to ask", "codex prompt"]},
    "PATTERNS":          {"weight": 3, "keywords": ["pattern", "workflow", "orchestrate", "session", "resume", "fork"]},
}

RESOURCE_MAP = {
    "GENERATION":        ["references/cli_reference.md", "assets/prompt_templates.md"],
    "REVIEW":            ["references/integration_patterns.md", "references/agent_delegation.md"],
    "RESEARCH":          ["references/codex_tools.md", "assets/prompt_templates.md"],
    "ARCHITECTURE":      ["references/codex_tools.md", "references/agent_delegation.md"],
    "AGENT_DELEGATION":  ["references/agent_delegation.md", "references/integration_patterns.md"],
    "TEMPLATES":         ["assets/prompt_templates.md", "references/cli_reference.md"],
    "PATTERNS":          ["references/integration_patterns.md", "references/cli_reference.md"],
}

LOADING_LEVELS = {
    "ALWAYS": [DEFAULT_RESOURCE],
    "ON_DEMAND_KEYWORDS": ["full reference", "all templates", "deep dive", "complete guide"],
    "ON_DEMAND": ["references/codex_tools.md", "assets/prompt_templates.md"],
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Is the user asking about Codex CLI specifically?",
    "Does the task benefit from a second AI perspective?",
    "Is real-time web information needed (--search)?",
    "Would codebase-wide analysis or /review workflow help?",
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
        return ["GENERATION"]  # zero-score fallback
    selected = [ranked[0][0]]
    if len(ranked) > 1 and ranked[1][1] > 0 and (ranked[0][1] - ranked[1][1]) <= ambiguity_delta:
        selected.append(ranked[1][0])
    return selected[:max_intents]

def route_codex_resources(task):
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
            "intents": ["GENERATION"],
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

Codex CLI must be installed and authenticated:

```bash
# Verify installation
command -v codex || echo "Not installed. Run: npm i -g @openai/codex"

# First-time authentication — Option A: API key
export OPENAI_API_KEY=your-key-here

# First-time authentication — Option B: ChatGPT OAuth (interactive)
codex login
```

**Authentication options**: `OPENAI_API_KEY` environment variable (direct API access), or ChatGPT OAuth via `codex login` (uses ChatGPT account credentials).

### Core Invocation Pattern

All non-interactive Codex CLI calls use the `exec` subcommand:

```bash
codex exec "prompt" --model gpt-5.3-codex 2>&1
```

| Flag / Option | Purpose |
|---------------|---------|
| `--model <id>` | Model selection — `gpt-5.4` or `gpt-5.3-codex` |
| `-c model_reasoning_effort="<level>"` | Reasoning effort override — `none`, `minimal`, `low`, `medium`, `high`, `xhigh` |
| `--sandbox read-only` | Safe mode: read files, no writes or shell commands |
| `--sandbox workspace-write` | Allow file writes within the workspace |
| `--sandbox danger-full-access` | Full shell access — **requires explicit user approval** |
| `--ask-for-approval untrusted` | Prompt before untrusted operations (default) |
| `--ask-for-approval on-request` | Prompt only when Codex requests approval |
| `--ask-for-approval never` | Auto-approve all operations (use with caution) |
| `--full-auto` | Low-friction mode combining auto-approval — **requires explicit user approval** |
| `--search` | Enable live web browsing during task execution |
| `--image` / `-i` | Attach an image file as visual input |

### Model Selection

Codex CLI supports 2 models with distinct strengths:

| Model | ID | Use Case | Reasoning Effort |
|-------|----|----------|-----------------|
| **GPT-5.4** | `gpt-5.4` | Frontier reasoning, complex analysis, architecture, deep review, security audit | configurable via `-c model_reasoning_effort` |
| **GPT-5.3-Codex** | `gpt-5.3-codex` | Code generation, standard review, implementation, documentation, tests | `xhigh` (fixed) |

**Reasoning Effort Levels** (valid values for `-c model_reasoning_effort="<level>"`):

| Level | Use Case |
|-------|----------|
| `none` | No reasoning — fastest, cheapest |
| `minimal` | Trivial tasks |
| `low` | Simple lookups, formatting |
| `medium` | Standard tasks, Plan mode default |
| `high` | Complex analysis (global default in `~/.codex/config.toml`) |
| `xhigh` | Maximum reasoning depth (profile default for all agents) |

> **Note:** There is no `--reasoning-effort` CLI flag. Set reasoning effort via `-c model_reasoning_effort="high"` on the command line, or `model_reasoning_effort` in `config.toml` / profile sections. GPT-5.3-Codex uses `xhigh` reasoning regardless of the configured value.

**Selection Strategy:**
- **GPT-5.4** — Choose for reasoning-heavy tasks: architecture decisions, security audits, complex planning, multi-strategy analysis, deep code review
- **GPT-5.3-Codex** — Choose for code-focused tasks: generation, standard review, implementation, refactoring, documentation, test generation

### Codex Agent Delegation

The calling AI acts as the **conductor** that delegates tasks to Codex CLI. Codex CLI has specialized agent profiles configured in `config.toml` that provide domain expertise. Route tasks to the right profile for best results.

**Agent Profile Routing Table:**

| Task Type | Profile | Invocation Pattern |
|-----------|---------|-------------------|
| Code review / security audit | review | `codex exec -p review "Review @./src/auth.ts for security issues" -m gpt-5.4` |
| Git diff review | (built-in) | `codex exec review "Focus on security" --commit HEAD` |
| Architecture exploration | context | `codex exec -p context "Analyze the architecture of this project" -m gpt-5.4` |
| Technical research | research | `codex exec -p research "Research latest Express.js security advisories" -m gpt-5.4 --search` |
| Documentation generation | write | `codex exec -p write "Generate README for this project" -m gpt-5.3-codex` |
| Fresh-perspective debugging | debug | `codex exec -p debug "Debug this error: [error]" -m gpt-5.3-codex` |
| Multi-strategy planning | ultra-think | `codex exec -p ultra-think "Plan the authentication redesign" -m gpt-5.4` |

**Profile setup**: Profiles are defined in `.codex/config.toml` under `[profiles.<name>]` sections. Each profile can override `model`, `model_reasoning_effort`, `sandbox_mode`, and `approval_policy`. The `.codex/agents/*.toml` files provide agent definitions for the interactive multi-agent TUI feature.

**Orchestration principle**: The calling AI decides WHAT to delegate. The profile configuration shapes HOW Codex processes it (sandbox mode, reasoning effort). The calling AI always validates and integrates the output.

See [agent_delegation.md](./references/agent_delegation.md) for complete agent roster and invocation patterns.

### Unique Codex Capabilities

These capabilities are available only through Codex CLI or provide a meaningfully different workflow:

| Capability | Purpose | Invocation |
|------------|---------|------------|
| `/review` command | Built-in diff-aware code review in TUI | `codex` then type `/review` |
| `--search` flag | Live web browsing during exec | `codex exec "..." --search` |
| `codex mcp` | Connect to Model Context Protocol servers | `codex mcp` subcommand |
| Session resume | Continue a previous Codex session | `codex resume [session-id]` |
| Session fork | Branch from an existing session | `codex fork [session-id]` |
| `--image` / `-i` | Attach images for visual input | `codex exec "..." -i screenshot.png` |
| `codex cloud` | Remote task execution | `codex cloud` subcommand |

### Essential Commands

```bash
# Code generation (workspace writes allowed)
codex exec "Create [description] with [features]. Output complete file." --model gpt-5.3-codex --sandbox workspace-write

# Code review (read-only — no file modifications)
codex exec "Review @./src/auth.ts for security vulnerabilities" --model gpt-5.3-codex --sandbox read-only

# Git diff review (built-in review subcommand)
codex exec review "Focus on security vulnerabilities" --commit HEAD --model gpt-5.3-codex

# Web research (live web browsing enabled)
codex exec "What's new in [topic]? Search the web for current information." --model gpt-5.3-codex --search --sandbox read-only

# Architecture analysis
codex exec "Analyze the architecture of this project. Map key modules and dependencies." --model gpt-5.3-codex --sandbox read-only

# Background execution
codex exec "[long task]" --model gpt-5.3-codex --sandbox workspace-write 2>&1 &

# With image input
codex exec "Implement this UI component based on the attached design" --model gpt-5.3-codex -i design.png --sandbox workspace-write

# Profile-based task delegation
codex exec -p research "Research latest security advisories for Express.js" --model gpt-5.3-codex --search
```

### Error Handling

| Issue | Solution |
|-------|----------|
| CLI not installed | `npm i -g @openai/codex` |
| `OPENAI_API_KEY` not set | `export OPENAI_API_KEY=your-key` or run `codex login` |
| Rate limit exceeded | Wait for auto-retry or reduce request frequency |
| Auth expired | Run `codex login` to re-authenticate via OAuth |
| Sandbox violation | Match `--sandbox` level to task requirements |
| Context too large | Specify files explicitly with `@./path` rather than broad prompts |

---

<!-- /ANCHOR:how-it-works -->
<!-- ANCHOR:rules -->
## 4. RULES

### ✅ ALWAYS

**ALWAYS do these without asking:**

1. **ALWAYS verify Codex CLI is installed** before first invocation
   - Run `command -v codex` and handle missing installation gracefully

2. **ALWAYS use `--sandbox read-only`** for review and analysis tasks
   - Review, audit, architecture analysis, and research should never write files

3. **ALWAYS use `--sandbox workspace-write`** for code generation tasks
   - Generation, bug fixing, refactoring, and documentation writing need this level

4. **ALWAYS validate Codex-generated code** before applying to the project
   - Check for security vulnerabilities (XSS, injection, eval)
   - Verify functionality matches requirements
   - Run syntax checks (`node --check`, `tsc --noEmit`, etc.)

5. **ALWAYS capture stderr** with `2>&1` to catch rate limit messages and errors

6. **ALWAYS specify the model explicitly** — choose based on task type
   - Use `--model gpt-5.4` for reasoning-heavy tasks (architecture, security, planning)
   - Use `--model gpt-5.3-codex` for code-focused tasks (generation, review, implementation)

7. **ALWAYS route to the appropriate Codex profile** when the task matches a profile specialization
   - Use `-p <profile>` flag; see profile routing table in Section 3
   - Use `codex exec review` (built-in subcommand) for git diff reviews

### ❌ NEVER

**NEVER do these:**

1. **NEVER use `--sandbox danger-full-access` or `--full-auto`** without explicit user approval
   - These modes auto-approve file writes and shell commands beyond the workspace; this can cause damage

2. **NEVER trust Codex output blindly** for security-sensitive code
   - Always review for XSS, injection, hardcoded secrets, and eval() calls

3. **NEVER send sensitive data** (API keys, passwords, credentials) in prompts
   - Codex CLI transmits prompts to OpenAI's API

4. **NEVER hammer the API** with rapid sequential calls
   - Respect rate limits; use batch operations or background execution

5. **NEVER use Codex for tasks where context is already loaded**
   - If the current agent already understands the code, direct action is faster

6. **NEVER assume Codex output is correct** without verification
   - Cross-reference with the codebase and project standards

7. **NEVER invoke this skill from within Codex CLI itself**
   - If you ARE Codex CLI, you already have native access to all capabilities — do not self-delegate via CLI
   - Self-invocation creates a circular, wasteful loop; use your native tools directly instead

### ⚠️ ESCALATE IF

**Ask user when:**

1. **ESCALATE IF Codex CLI is not installed** and user has not acknowledged
   - Provide installation command: `npm i -g @openai/codex`

2. **ESCALATE IF rate limits are persistently exceeded**
   - Suggest checking API key quota or OAuth account limits

3. **ESCALATE IF Codex output conflicts with existing code patterns**
   - Present both perspectives and let user decide

4. **ESCALATE IF task requires `--sandbox danger-full-access` or `--full-auto`**
   - Describe risks and get explicit user approval before proceeding

### Memory Handback Protocol

When the calling AI needs to preserve session context from a Codex CLI delegation:

1. **Include epilogue**: Append the Memory Epilogue template (see `assets/prompt_templates.md` §13) to the delegated prompt
2. **Extract section**: After receiving agent output, extract the `MEMORY_HANDBACK` section using: `/<!-- MEMORY_HANDBACK_START -->([\s\S]*?)<!-- MEMORY_HANDBACK_END -->/`
3. **Parse to JSON**: Map extracted fields to `{ sessionSummary, filesModified, keyDecisions, specFolder, triggerPhrases, nextSteps }` (the save flow accepts either `nextSteps` or `next_steps`)
4. **Redact and scrub**: Remove secrets, tokens, credentials, and any unnecessary sensitive values before writing the JSON file
5. **Write JSON**: Save the scrubbed payload to `/tmp/save-context-data.json`
6. **Invoke generate-context.js**: `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json [spec-folder]`
7. **Index**: Run `memory_index_scan({ specFolder })` for immediate MCP visibility

**Graceful degradation**: If agent output lacks `MEMORY_HANDBACK` delimiters, the calling AI manually constructs the JSON from agent output and saves via the same JSON mode path. The save flow normalizes `nextSteps` or `next_steps`; the first entry persists as `Next: ...` and drives `NEXT_ACTION`, and remaining entries persist as `Follow-up: ...`.

**Explicit JSON mode failures**: If the explicit data file cannot be loaded, `generate-context.js` fails with `EXPLICIT_DATA_FILE_LOAD_FAILED: ...`. Do not fall back to OpenCode capture in that case; surface the error and stop.

---

<!-- /ANCHOR:rules -->
<!-- ANCHOR:references -->
## 5. REFERENCES

### Core References

- [cli_reference.md](./references/cli_reference.md) - Complete CLI subcommands, flags, sandbox modes, and config reference
- [integration_patterns.md](./references/integration_patterns.md) - Cross-AI orchestration patterns and workflows
- [codex_tools.md](./references/codex_tools.md) - Built-in capabilities documentation (/review, --search, MCP, session management)
- [agent_delegation.md](./references/agent_delegation.md) - Codex agent roster, routing table, and invocation patterns

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

- Codex CLI invoked with correct subcommand, flags, model, and sandbox mode
- Output captured, validated, and integrated appropriately
- No security vulnerabilities introduced from generated code
- Rate limits handled gracefully (retry or fallback strategy)
- Appropriate Codex profile routed for specialized tasks
- Sandbox level matched to task type (read-only for review, workspace-write for generation)

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
| **Bash** | Execute `codex exec` commands |
| **Read** | Examine Codex output files |
| **Glob** | Find generated files |
| **Grep** | Search within generated output |

### Related Skills

| Skill | Integration |
|-------|-------------|
| **cli-gemini** | Parallel cross-AI validation — Gemini for Google Search grounding, Codex for OpenAI perspective |
| **sk-code--web** | Use Codex for code review during web development |
| **sk-code--full-stack** | Delegate test generation or architecture analysis to Codex |
| **mcp-code-mode** | Codex CLI is independent; does not require Code Mode |

### External Tools

**Codex CLI** (required):
- Installation: `npm i -g @openai/codex`
- Authentication: `OPENAI_API_KEY` env var or `codex login` (ChatGPT OAuth)
- Purpose: Core execution engine for all delegated tasks
- Fallback: Skill informs user of installation steps if missing

---

<!-- /ANCHOR:integration-points -->
<!-- ANCHOR:related-resources -->
## 8. RELATED RESOURCES

### Reference Files
- [cli_reference.md](./references/cli_reference.md) - CLI subcommands, flags, sandbox modes, and configuration
- [integration_patterns.md](./references/integration_patterns.md) - Cross-AI orchestration patterns
- [codex_tools.md](./references/codex_tools.md) - Built-in tools (/review, --search, MCP, session management)
- [agent_delegation.md](./references/agent_delegation.md) - Agent routing and invocation

### Templates
- [prompt_templates.md](./assets/prompt_templates.md) - Copy-paste ready prompt templates

### Related Skills
- `cli-gemini` - Google Gemini CLI for parallel AI validation and Google Search grounding
- `sk-doc` - Documentation generation that Codex can supplement
- `sk-code--web` - Web development where Codex provides second opinions
- `sk-code--full-stack` - Full-stack tasks with Codex architecture analysis

### External
- [Codex CLI GitHub](https://github.com/openai/codex) - Official repository
- [OpenAI Platform](https://platform.openai.com/api-keys) - API key management
- [OpenAI ChatGPT](https://chatgpt.com) - ChatGPT OAuth account

---

<!-- /ANCHOR:related-resources -->
