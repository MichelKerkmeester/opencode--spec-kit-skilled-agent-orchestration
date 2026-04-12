---
name: cli-copilot
description: "GitHub Copilot CLI orchestrator enabling external AI assistants to invoke the standalone 'copilot' binary for supplementary tasks including collaborative planning, cloud delegation, versatile code generation, and autonomous task execution."
allowed-tools: [Bash, Read, Glob, Grep]
version: 1.3.3
---

<!-- Keywords: copilot, copilot-cli, github, cross-ai, planning, cloud-delegation, autopilot, multi-model, gpt-5, claude-4.6, gemini-3 -->

# GitHub Copilot CLI Orchestrator - Cross-AI Task Delegation

Orchestrate the GitHub Copilot CLI from external AI assistants (Gemini CLI, Codex CLI, Claude Code, etc.) for tasks that benefit from its deep GitHub ecosystem integration, multi-model flexibility, autonomous autopilot mode, and cloud-delegated coding agents.

**Core Principle**: The calling AI stays the conductor. Delegate to Copilot CLI for what it does best — collaborative planning, ecosystem-aware generation, and cloud-powered agent execution. Validate and integrate the output.

---

<!-- ANCHOR:when-to-use -->
## 1. WHEN TO USE

### Activation Triggers

**Collaborative Planning** - Use when:
- Complex features require a dedicated planning phase before implementation
- Architecture mapping needs "Explore" agent codebase analysis
- Multi-step workflows benefit from Copilot's "Plan" mode logic
- Cross-file dependency mapping is required for a large refactor

**Cloud Delegation** - Use when:
- Tasks benefit from GitHub's cloud-hosted coding agents (`/delegate` or `&prompt`)
- Offloading heavy compute or complex reasoning to the cloud is preferred
- Remote repository context is needed beyond the local workspace
- Scaling execution beyond local machine resources

**Versatile Generation** - Use when:
- Code generation benefits from specific models (GPT-5.3-Codex, Claude 4.6, Gemini 3 Pro)
- Rapid prototyping is needed using "Autopilot" for autonomous execution
- Boilerplate or unit test generation needs to match repo-specific conventions
- Multi-language support is required across a diverse stack

**Code Review** - Use when:
- GitHub-native perspective is needed for PR readiness
- Cross-AI validation to catch blind spots using different underlying models
- Security audits benefit from Copilot's specific training data
- Quality gate verification before pushing to a remote

**Agent-Delegated Tasks** - Use when:
- Task matches specialized "Explore" or "Task" agents
- Custom agent profiles (Markdown-based) are available for the project
- Session continuity is required with persistent repo memory
- MCP servers are used for extended tool capabilities

### When NOT to Use

- **Self-invocation guard**: If you ARE Copilot CLI (running natively inside a Copilot CLI session), do NOT use this skill. You already have direct access to all capabilities described here — Autopilot, Explore/Task agents, cloud delegation, repo memory, and multi-model selection. Delegating to yourself via CLI is circular and wasteful. This skill is for EXTERNAL AIs (Claude Code, Gemini, Codex) to delegate TO Copilot CLI.
- Simple, quick tasks where local execution is faster
- When GitHub authentication is unavailable or expired
- Real-time web search (use Gemini CLI or specialized search tools instead)
- Tasks where precise diff-based surgical editing is the only requirement

---

<!-- /ANCHOR:when-to-use -->
<!-- ANCHOR:smart-routing -->
## 2. SMART ROUTING

### Prerequisite Detection

```bash
# Verify Copilot CLI is available before routing
command -v copilot || echo "Not installed. Run: npm install -g @github/copilot"

# SELF-INVOCATION GUARD: If you are Copilot CLI, do not use this skill
# [ -n "$COPILOT_SESSION" ] && echo "ERROR: Already inside Copilot session. Do not self-invoke."
```

### Phase Detection

```text
TASK CONTEXT
    |
    +- STEP 0: Verify copilot binary installed
    +- STEP 1: Score intents (top-2 when ambiguity is small)
    +- Phase 1: Construct prompt with model selection and --allow-all-tools
    +- Phase 2: Execute via Bash tool (non-interactive -p flag)
    +- Phase 3: Validate and integrate output
```

### Resource Domains

The router discovers markdown resources recursively from `references/` and `assets/` and then applies intent scoring from `INTENT_SIGNALS`.

```text
references/cli_reference.md          — CLI flags, commands, models, auth, config
references/integration_patterns.md   — Cross-AI orchestration patterns
references/copilot_tools.md           — Unique capabilities (Autopilot, Cloud, Models)
references/agent_delegation.md       — Explore/Task agent routing and invocation
assets/prompt_templates.md           — Copy-paste ready templates
assets/prompt_quality_card.md        — Framework-per-task selector, CLEAR 5-check, escalation triggers
```

### Resource Loading Levels

| Level       | When to Load            | Resources                      |
| ----------- | ----------------------- | ------------------------------ |
| ALWAYS      | Every skill invocation  | `references/cli_reference.md`, `assets/prompt_quality_card.md` |
| CONDITIONAL | If intent signals match | Intent-mapped reference docs   |
| ON_DEMAND   | Only on explicit request| Extended templates and patterns |

### Smart Router Pseudocode

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/cli_reference.md"

INTENT_SIGNALS = {
    "PLANNING":          {"weight": 4, "keywords": ["plan", "architecture", "explore", "dependency", "structure", "roadmap"]},
    "CLOUD_DELEGATE":    {"weight": 4, "keywords": ["delegate", "cloud", "remote", "offload", "github agent", "&prompt"]},
    "GENERATION":        {"weight": 4, "keywords": ["generate", "write", "create", "build", "autopilot", "autonomous", "code"]},
    "REVIEW":            {"weight": 4, "keywords": ["review", "audit", "security", "pr", "quality", "second opinion"]},
    "AGENT_DELEGATION":  {"weight": 4, "keywords": ["agent", "explore agent", "task agent", "custom agent", "mcp"]},
    "TEMPLATES":         {"weight": 3, "keywords": ["template", "prompt", "how to ask", "copilot prompt"]},
    "PATTERNS":          {"weight": 3, "keywords": ["pattern", "workflow", "orchestrate", "session", "memory"]},
}

RESOURCE_MAP = {
    "PLANNING":          ["references/cli_reference.md", "references/copilot_tools.md"],
    "CLOUD_DELEGATE":    ["references/cli_reference.md", "references/integration_patterns.md"],
    "GENERATION":        ["references/cli_reference.md", "assets/prompt_templates.md"],
    "REVIEW":            ["references/integration_patterns.md", "references/agent_delegation.md"],
    "AGENT_DELEGATION":  ["references/agent_delegation.md", "references/integration_patterns.md"],
    "TEMPLATES":         ["assets/prompt_templates.md", "references/cli_reference.md"],
    "PATTERNS":          ["references/integration_patterns.md", "references/cli_reference.md"],
}

LOADING_LEVELS = {
    "ALWAYS": [DEFAULT_RESOURCE, "assets/prompt_quality_card.md"],
    "ON_DEMAND_KEYWORDS": ["full reference", "all templates", "deep dive", "complete guide"],
    "ON_DEMAND": ["references/copilot_tools.md", "assets/prompt_templates.md"],
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Is the user asking about Copilot CLI specifically?",
    "Does the task benefit from collaborative planning or cloud delegation?",
    "Is autonomous execution with --allow-all-tools needed?",
    "Would repo-memory-aware generation or review help?",
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

def select_intents(scores: dict[str, float], ambiguity_delta: float = 1.0, max_intents: int = 2) -> list[str]:
    ranked = sorted(scores.items(), key=lambda item: item[1], reverse=True)
    if not ranked or ranked[0][1] <= 0:
        return ["GENERATION"]  # zero-score fallback
    selected = [ranked[0][0]]
    if len(ranked) > 1 and ranked[1][1] > 0 and (ranked[0][1] - ranked[1][1]) <= ambiguity_delta:
        selected.append(ranked[1][0])
    return selected[:max_intents]

def score_intents(task) -> dict[str, float]:
    text = _task_text(task)
    scores = {intent: 0.0 for intent in INTENT_SIGNALS}
    for intent, cfg in INTENT_SIGNALS.items():
        for keyword in cfg["keywords"]:
            if keyword in text:
                scores[intent] += cfg["weight"]
    return scores

def route_copilot_resources(task):
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

    # 1. ALWAYS load baseline + fast-path prompt-quality asset
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

Copilot CLI must be installed and authenticated:

```bash
# Verify installation
command -v copilot || echo "Not installed. Run: npm install -g @github/copilot"

# Authentication - OAuth flow
copilot login

# Authentication - Non-interactive (CI/CD or automation)
export GH_TOKEN=your-github-pat
```

### Core Invocation Pattern

All non-interactive Copilot CLI calls use the `-p` (prompt) flag:

```bash
copilot -p "prompt" --allow-all-tools 2>&1
```

| Flag / Option | Purpose |
|---------------|---------|
| `-p "prompt"` | Non-interactive mode — send prompt and get response |
| `--allow-all-tools` | Enable Autopilot/Autonomous mode (no approval prompts) |
| `--model <id>` | Select AI model (e.g., `--model gpt-5.4`) |
| `--no-ask-user` | Autonomous mode — no interactive questions |
| `/model <id>` | Mid-session or initial model selection (interactive) |
| `/delegate` | Push task to GitHub Cloud Coding Agent |
| `&prompt` | Inline shorthand for cloud delegation |

### Model Selection

Copilot CLI supports 5 recommended models across 3 providers:

| Model | ID | Provider |
|-------|----|----------|
| **GPT-5.4** | `gpt-5.4` | OpenAI |
| **GPT-5.3-Codex** | `gpt-5.3-codex` | OpenAI |
| **Claude Opus 4.6** | `claude-opus-4.6` | Anthropic |
| **Claude Sonnet 4.6** | `claude-sonnet-4.6` | Anthropic |
| **Gemini 3.1 Pro Preview** | `gemini-3.1-pro-preview` | Google |

### Reasoning Effort (GPT-5.x models)

GPT-5.x models support reasoning effort levels that control depth vs speed:

| Level | Config Value | Description |
|-------|-------------|-------------|
| Low | `"low"` | Faster responses, less detailed reasoning |
| Medium | `"medium"` | Balanced speed and reasoning depth |
| High | `"high"` | More thorough reasoning, slower responses |
| Extra High | `"xhigh"` | Maximum reasoning depth, slowest responses |

**Per-model support and defaults:**

| Model | Supported Levels | Default |
|-------|-----------------|---------|
| `gpt-5.4` | low, medium, high, **xhigh** | high |
| `gpt-5.3-codex` | low, medium, high, xhigh | high |
| `gpt-5.1-codex-max` | low, medium, high, xhigh | high |
| `gpt-5.1-codex` | low, medium, high | medium |
| `gpt-5.1` | low, medium, high | medium |
| Claude models | low, medium, high | high |
| Gemini models | low, medium, high | medium |

**Setting reasoning effort:**

1. **Config file** (persistent, applies to all `-p` calls):
   ```bash
   # Set xhigh reasoning for all subsequent GPT-5.x calls
   # Edit ~/.copilot/config.json and add:
   #   "reasoning_effort": "xhigh"
   ```

2. **Interactive mode** (persists to config): Select via `/model` → choose GPT-5.x → select effort level. The selection is saved to `~/.copilot/config.json` automatically.

3. **No CLI flag**: There is no `--reasoning-effort` flag. The config file is the only non-interactive mechanism.

**Non-interactive invocation with xhigh reasoning:**
```bash
# Step 1: Set reasoning effort in config (one-time)
python3 -c "
import json
cfg_path = '$HOME/.copilot/config.json'
with open(cfg_path) as f: cfg = json.load(f)
cfg['reasoning_effort'] = 'xhigh'
with open(cfg_path, 'w') as f: json.dump(cfg, f, indent=2)
"

# Step 2: Invoke with model (reasoning_effort is read from config)
copilot -p "prompt" --model gpt-5.4 --allow-all-tools 2>&1
```

**How it works internally:** Copilot reads `reasoning_effort` from `~/.copilot/config.json`, validates it against the model's supported levels, and passes it as `reasoning_effort` in the OpenAI API request body. If the config value is invalid or unsupported for the selected model, the model's default level is used.

### Copilot CLI Agent Delegation

The calling AI acts as the **conductor** that delegates tasks to Copilot CLI.

| Task Type | Agent | Invocation Pattern |
|-----------|-------|-------------------|
| Codebase Exploration | `Explore` | `copilot -p "Explain the data flow in src/" --agent explore 2>&1` |
| Task Execution | `Task` | `copilot -p "Refactor the login module" --agent task --allow-all-tools 2>&1` |
| Cloud Delegation | Cloud | `copilot -p "/delegate Analyze this repo for security hot-spots" 2>&1` |
| Autonomous Build | Autopilot | `copilot -p "Implement the feature in spec.md" --allow-all-tools 2>&1` |

### Unique Copilot Capabilities

| Capability | Purpose |
|------------|---------|
| Autopilot | Fully autonomous execution without approval prompts |
| Repo Memory | Remembers conventions and prior decisions across sessions |
| Cloud Delegation | Offloads tasks to GitHub's high-performance coding agents |
| Multi-Model | Toggle between Anthropic, OpenAI, and Google models mid-session |
| MCP Support | Connect to Model Context Protocol servers for external data |

---

<!-- /ANCHOR:how-it-works -->
<!-- ANCHOR:rules -->
## 4. RULES

### ALWAYS

1. **ALWAYS verify the `copilot` binary is installed** before invocation.
2. **ALWAYS use the `-p` flag** for non-interactive execution from the calling AI.
3. **ALWAYS include `--allow-all-tools`** when the task requires autonomous execution (Autopilot).
4. **ALWAYS capture stderr** (`2>&1`) to ensure errors are surfaced to the conductor.
5. **ALWAYS specify the model** if the task benefits from a specific provider's strength (e.g., Opus for reasoning).
6. **ALWAYS validate output** against the local filesystem to ensure consistency.

7. **ALWAYS pass the spec folder to the delegated agent** in the prompt.
   - If the calling AI has an active spec folder (from Gate 3), include it in the prompt: `Spec folder: <path> (pre-approved, skip Gate 3)`
   - If the calling AI does NOT have a spec folder, it MUST ask the user for one BEFORE delegating — the delegated agent cannot answer Gate 3 interactively
   - This prevents the delegated agent from halting at the Gate 3 spec folder question in non-interactive mode
   - Example prompt suffix: `\n\nSpec folder: .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/022-spec-doc-indexing-bypass/ (pre-approved, skip Gate 3)`

8. **ALWAYS load `assets/prompt_quality_card.md` before building any dispatch prompt.**
   - Apply the CLEAR 5-question check from the card.
   - Tag the selected framework in the Bash invocation comment.
   - If complexity is `>= 7/10` or compliance/security signals appear, dispatch `@improve-prompt` via the Task tool instead of loading `sk-improve-prompt` inline.
   - Use the returned `ENHANCED_PROMPT` as the final Copilot prompt.

### CONCURRENCY LIMIT

**Maximum 5 concurrent `copilot` processes at any time.** Before launching a new `copilot -p` call, check `pgrep -f "copilot" | wc -l`. If 5 or more are already running, wait for one to finish before starting another. This prevents system memory exhaustion when dispatching parallel batches. For large fix or review campaigns, prefer sequential dispatch (one at a time) or small parallel batches (2-3 max).

### NEVER

1. **NEVER use interactive mode** (omit `-p`) as it will hang the conductor's shell.
2. **NEVER expose `GH_TOKEN`** in logs or printed output.
3. **NEVER assume Autopilot is perfect**; always verify the structural integrity of generated code.
4. **NEVER ignore repository memory**; check for existing conventions before overriding.
5. **NEVER run more than 5 concurrent copilot processes** — system memory exhaustion risk.
6. **NEVER invoke this skill from within Copilot CLI itself**
   - If you ARE Copilot CLI, you already have native access to all capabilities — do not self-delegate via CLI
   - Self-invocation creates a circular, wasteful loop; use your native tools directly instead

### ESCALATE IF

1. **ESCALATE IF `copilot login` is required** (authentication failure).
2. **ESCALATE IF a model conflict occurs** (requested model not available in current plan).
3. **ESCALATE IF Autopilot hits a safety block** or tool execution failure that it cannot resolve.
4. **ESCALATE IF cloud delegation times out** or returns a service error.

### Memory Handback Protocol

When the calling AI needs to preserve session context from a Copilot CLI delegation:

1. **Include epilogue**: Append the Memory Epilogue template (see `assets/prompt_templates.md` §12) to the delegated prompt
2. **Extract section**: After receiving agent output, extract the `MEMORY_HANDBACK` section using: `/<!-- MEMORY_HANDBACK_START -->([\s\S]*?)<!-- MEMORY_HANDBACK_END -->/`
3. **Parse to structured JSON**: Build a payload anchored on the current structured contract: `specFolder`, `user_prompts`, `observations`, and `recent_context`, with optional `toolCalls`, `exchanges`, `preflight`, and `postflight` when you have them. Convenience fields such as `sessionSummary`, `filesModified`, `keyDecisions`, `triggerPhrases`, and `nextSteps` are still accepted and normalized, and documented snake_case keys such as `session_summary`, `files_modified`, `trigger_phrases`, `recent_context`, and `next_steps` also work.
4. **Redact and scrub**: Remove secrets, tokens, credentials, and any unnecessary sensitive values before sending the JSON payload to the save script
5. **Choose a structured-input mode**: Prefer `--stdin` when you already have the JSON in memory, use `--json` for a compact inline payload, or write a temp JSON file for larger handbacks
6. **Invoke generate-context.js**: `printf '%s' "$JSON_PAYLOAD" | node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --stdin [spec-folder]`
7. **Index**: Run `memory_index_scan({ specFolder })` for immediate MCP visibility

**Missing delimiter handling**: If agent output lacks `MEMORY_HANDBACK` delimiters, the calling AI manually constructs the structured JSON payload from the agent output and saves it through the same structured-input flow. The save flow normalizes `nextSteps` or `next_steps`; the first entry persists as `Next: ...` and drives `NEXT_ACTION`, and remaining entries persist as `Follow-up: ...`.

**Target precedence**: When both the payload and the CLI specify a spec folder, the explicit CLI target wins. Use the CLI argument whenever the calling AI already knows the correct destination.

**Structured-input failures**: If an explicit temp file cannot be loaded, `generate-context.js` stops with `EXPLICIT_DATA_FILE_LOAD_FAILED: ...`. Surface the error and fix the file path or payload before retrying.

**Save gates**: Valid JSON can still be rejected after normalization. Thin payloads fail with `INSUFFICIENT_CONTEXT_ABORT`, and cross-spec payloads fail with `CONTAMINATION_GATE_ABORT`.

**Minimum payload guidance**: Include a specific summary, at least one meaningful `recent_context` entry, at least one useful observation, and rich `FILES` entries with a descriptive `DESCRIPTION`. Add `ACTION`, `MODIFICATION_MAGNITUDE`, `_provenance`, and `toolCalls` when known so the saved memory carries durable evidence instead of bare filenames.

---

<!-- /ANCHOR:rules -->
<!-- ANCHOR:references -->
## 5. REFERENCES

### Core References
- [cli_reference.md](./references/cli_reference.md) - CLI flags, commands, model IDs, and auth config.
- [agent_delegation.md](./references/agent_delegation.md) - Explore vs. Task agent details and custom agent creation.
- [copilot_tools.md](./references/copilot_tools.md) - Deep dive into Autopilot, Repo Memory, and MCP integration.
- [integration_patterns.md](./references/integration_patterns.md) - Orchestration patterns for multi-AI workflows.

### Templates and Assets
- [prompt_templates.md](./assets/prompt_templates.md) - Optimized prompts for planning, delegation, and generation.

---

<!-- /ANCHOR:references -->
<!-- ANCHOR:success-criteria -->
## 6. SUCCESS CRITERIA

### Task Completion
- Copilot CLI invoked successfully with the `-p` flag.
- Autopilot executed the requested changes autonomously (if `--allow-all-tools` used).
- Cloud delegation returned results from GitHub coding agents.
- Repo-specific conventions were respected (Repo Memory).
- All changes verified via local tests or syntax checks.

### Skill Quality
- Zero-score fallback correctly routes to `GENERATION`.
- Proper model selection matched to task complexity.
- Clear error handling for missing binary or auth issues.

---

<!-- /ANCHOR:success-criteria -->
<!-- ANCHOR:integration-points -->
## 7. INTEGRATION POINTS

### Framework Integration
This skill follows the [AGENTS.md](../../../AGENTS.md) orchestration protocol.

### Tool Usage
- **Bash**: Core tool for executing `copilot -p` commands.
- **Read/Glob/Grep**: Used for validating Copilot's output and auditing changes.

### Related Skills
- **cli-claude-code**: Delegate to Claude Code for surgical diff-based edits.
- **cli-gemini**: Delegate to Gemini for Google Search grounded research.
- **sk-git**: Use Copilot to generate commit messages or review diffs.

---

<!-- /ANCHOR:integration-points -->
<!-- ANCHOR:related-resources -->
## 8. RELATED RESOURCES

### Reference Files
- `references/cli_reference.md`
- `references/agent_delegation.md`
- `references/copilot_tools.md`
- `references/integration_patterns.md`

### External
- [GitHub Copilot CLI Documentation](https://docs.github.com/en/copilot/using-github-copilot/using-github-copilot-cli)
- [GitHub Models Directory](https://github.com/marketplace/models)

---

<!-- /ANCHOR:related-resources -->
