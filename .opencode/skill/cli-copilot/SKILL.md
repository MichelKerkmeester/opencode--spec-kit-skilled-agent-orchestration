---
name: cli-copilot
description: "GitHub Copilot CLI orchestrator enabling external AI assistants to invoke the standalone 'copilot' binary for supplementary tasks including collaborative planning, cloud delegation, versatile code generation, and autonomous task execution."
allowed-tools: [Bash, Read, Glob, Grep]
version: 1.3.7.0
---

<!-- Keywords: copilot, copilot-cli, github, cross-ai, planning, cloud-delegation, autopilot, multi-model, gpt-5, claude-4.6, gemini-3 -->

# GitHub Copilot CLI Orchestrator - Cross-AI Task Delegation

> **CRITICAL — SELF-INVOCATION PROHIBITED**
>
> This skill dispatches to the GitHub CLI binary (`copilot`). If the agent currently reading this skill is itself running inside Copilot (detection signals listed in §2), the skill MUST refuse to load and return the documented error message instead of generating any `copilot` invocation.
>
> Just as a Claude Code agent never calls cli-claude-code, an OpenCode agent never calls cli-opencode, a Codex agent never calls cli-codex, a Copilot agent never calls cli-copilot, and a Gemini agent never calls cli-gemini. The cli-X skills are for **cross-AI delegation only** — never self-invocation.

Orchestrate the GitHub Copilot CLI from external AI assistants (Gemini CLI, Codex CLI, Claude Code, etc.) for tasks that benefit from its deep GitHub ecosystem integration, multi-model flexibility, autonomous autopilot mode, and cloud-delegated coding agents.

**Core Principle**: The calling AI stays the conductor. Delegate to Copilot CLI for what it does best — collaborative planning, ecosystem-aware generation, and cloud-powered agent execution. Validate and integrate the output.

---

<!-- ANCHOR:when-to-use -->
## 1. WHEN TO USE

### Activation Triggers

- **Collaborative Planning** — complex features needing a dedicated planning phase, "Explore" agent codebase analysis, or cross-file dependency mapping for large refactors.
- **Cloud Delegation** — tasks benefiting from GitHub's cloud-hosted coding agents (`/delegate`, `&prompt`), heavy compute offload, or scaling beyond local resources.
- **Versatile Generation** — model-targeted generation (GPT-5.3-Codex, Claude 4.6, Gemini 3 Pro), Autopilot prototyping, or repo-aware boilerplate.
- **Code Review** — GitHub-native PR readiness, cross-AI validation against different models, security audits, or pre-push quality gates.
- **Agent-Delegated Tasks** — Explore/Task agent matches, custom Markdown agent profiles, persistent repo memory, or MCP server integration.

### When NOT to Use

- **You ARE Copilot already.** If your runtime is Copilot (detection signal: `$COPILOT_SESSION_ID` or any `GH_COPILOT_*` env var set, `copilot` in process ancestry, or `~/.copilot/state/<id>/lock` present), this skill refuses to load. Self-invocation creates a circular dispatch loop and burns tokens for no value. The cli-X family is exclusively for cross-AI delegation.
- Simple, quick tasks where local execution is faster.
- GitHub authentication unavailable or expired.
- Real-time web search (use Gemini CLI or specialized search tools instead).
- Tasks where precise diff-based surgical editing is the only requirement.

---

<!-- /ANCHOR:when-to-use -->
<!-- ANCHOR:smart-routing -->
## 2. SMART ROUTING

### Prerequisite Detection

```bash
# Verify Copilot CLI is available before routing
command -v copilot || echo "Not installed. Run: npm install -g @github/copilot"

# SELF-INVOCATION GUARD: If you are Copilot CLI, do not use this skill
[ -n "$COPILOT_SESSION_ID" ] && echo "ERROR: Already inside Copilot session. Do not self-invoke."
```

### Self-Invocation Guard

```python
def detect_self_invocation():
    """Returns a non-None signal when the orchestrator is already running inside Copilot."""
    # Layer 1: env var lookup — Copilot sets COPILOT_SESSION_ID and GH_COPILOT_* vars
    for key in os.environ:
        if key == 'COPILOT_SESSION_ID' or key.startswith('GH_COPILOT_'):
            return ('env', key)
    # Layer 2: process ancestry — copilot in parent tree
    try:
        ancestry = subprocess.check_output(['ps', '-o', 'command=', '-p', str(os.getppid())]).decode()
        if '/copilot' in ancestry or 'copilot ' in ancestry:
            return ('ancestry', 'copilot')
    except subprocess.SubprocessError:
        pass
    # Layer 3: state lock-file probe
    state_dir = os.path.expanduser('~/.copilot/state')
    if os.path.isdir(state_dir):
        for entry in os.listdir(state_dir):
            if os.path.exists(os.path.join(state_dir, entry, 'lock')):
                return ('lockfile', entry)
    return None

if detect_self_invocation():
    refuse(
        "Self-invocation refused: this agent is already running inside Copilot. "
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
    "ALWAYS": ["references/cli_reference.md", "assets/prompt_quality_card.md"],
    "ON_DEMAND_KEYWORDS": ["full reference", "all templates", "deep dive", "complete guide", "github agent", "cloud delegation", "copilot prompt", "autopilot", "explore agent"],
    "ON_DEMAND": ["references/copilot_tools.md", "assets/prompt_templates.md"],
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Is the user asking about Copilot CLI specifically?",
    "Does the task benefit from collaborative planning or cloud delegation?",
    "Is autonomous execution with --allow-all-tools needed?",
    "Would repo-memory-aware generation or review help?",
]
```

**Call sequence** (using shared helpers from `shared_smart_router.md`):

1. `discover_markdown_resources()` — enumerate available `.md` files under `references/` and `assets/`
2. `score_intents(task)` — keyword-weight match against `INTENT_SIGNALS`
3. `select_intents(scores, ambiguity_delta=1.0)` — top-1 or top-2 if scores within delta
4. ALWAYS-load `LOADING_LEVELS["ALWAYS"]`, then UNKNOWN-fallback if max score == 0
5. CONDITIONAL-load `RESOURCE_MAP[intent]` for each selected intent
6. ON_DEMAND-load if any `ON_DEMAND_KEYWORDS` match the task text

The `route_copilot_resources(task)` function body lives in [`shared_smart_router.md`](../system-spec-kit/references/cli/shared_smart_router.md) — substitute `<PROVIDER>` = `copilot`.

---

<!-- /ANCHOR:smart-routing -->
<!-- ANCHOR:how-it-works -->
## 3. HOW IT WORKS

### Prerequisites

```bash
# Verify installation
command -v copilot || echo "Not installed. Run: npm install -g @github/copilot"

# Authentication — OAuth flow OR non-interactive PAT
copilot login
export GH_TOKEN=your-github-pat   # for CI/CD or automation
```

### Provider Auth Pre-Flight (Smart Fallback)

**MANDATORY before any first dispatch in a session.** The default GitHub Copilot OAuth or `GH_TOKEN` may not be configured on this machine — silently failing with `401 Unauthorized` or `not authenticated` mid-dispatch wastes a round-trip. Run this check once per session, cache the result, and re-run it only if a dispatch fails with an auth error.

```bash
# One-shot pre-flight: capture auth status for routing
GH_AUTH=$(gh auth status 2>&1)
echo "$GH_AUTH" | grep -q "Logged in to github.com" && GH_OAUTH_OK=1 || GH_OAUTH_OK=0
[ -n "$GH_TOKEN" ] && GH_TOKEN_OK=1 || GH_TOKEN_OK=0
```

**Decision tree** (apply in order — first match wins):

| State | GH_OAUTH_OK | GH_TOKEN_OK | Action |
|-------|-------------|-------------|--------|
| Default available | 1 | * | Proceed with `copilot -p "<prompt>" --model gpt-5.4 --allow-all-tools` |
| OAuth missing, PAT ready | 0 | 1 | **ASK user** before substituting — never auto-fall-back silently. Surface options A/B/C below. |
| Both missing | 0 | 0 | **ASK user** to configure GitHub auth — surface the login commands, do NOT dispatch. |

**User prompt template — OAuth missing, PAT configured:**

```
GitHub Copilot OAuth is not configured on this machine, but `$GH_TOKEN` is set.
Pick one:
  A) Use the existing `$GH_TOKEN` PAT (works for non-interactive `copilot -p` calls)
  B) Run `gh auth login` first to set up OAuth, then retry the original dispatch
  C) Name a different model — paste the `--model <id>` you want to use
```

**User prompt template — both missing:**

```
No GitHub auth is configured on this machine. Run one:
  - `gh auth login`              (recommended — interactive OAuth flow)
  - `export GH_TOKEN=ghp_...`    (non-interactive PAT for CI/CD)
Which would you like to set up? Confirm when login finishes; the skill will retry the original dispatch.
```

**Error-recovery contract.** If a dispatch returns an auth error after pre-flight passed (token expired or revoked), invalidate the cache, rerun the pre-flight, and apply the same decision tree before retrying. Never substitute a model the user didn't approve.

### Default Invocation (Skill Default)

**Default model + flags + agent**: `gpt-5.4` · `--allow-all-tools` · `--agent task` (default; for read-only exploration, switch to `--agent explore`). Reasoning effort `xhigh` (model default). The pinned shape:

```bash
copilot -p "<prompt>" \
  --model gpt-5.4 \
  --allow-all-tools \
  2>&1
```

**User override** (honor explicit user phrasing verbatim):

| User says | Resolve to |
|-----------|------------|
| (nothing specified) | `--model gpt-5.4 --allow-all-tools` |
| "Use copilot claude sonnet" | `--model claude-sonnet-4.6 --allow-all-tools` |
| "Use gpt-5.5" | `--model gpt-5.5 --allow-all-tools` |
| "Read-only exploration" | `--agent explore` (no `--allow-all-tools`) |
| "Cloud delegation" | Append `/delegate` to the prompt body |

### Core Invocation Pattern

All non-interactive Copilot CLI calls use the `-p` (prompt) flag:

```bash
copilot -p "prompt" --allow-all-tools 2>&1
```

| Flag / Option | Purpose |
|---------------|---------|
| `-p "prompt"` | Non-interactive mode — send prompt and get response |
| `--allow-all-tools` | Enable Autopilot/Autonomous mode (no approval prompts). **Required** for full autonomy — not enabled by default |
| `--model <id>` | Select AI model (e.g., `--model gpt-5.4`) |
| `--no-ask-user` | Autonomous mode — no interactive questions |
| `/model <id>` | Mid-session or initial model selection (interactive) |
| `/delegate` | Push task to GitHub Cloud Coding Agent |
| `&prompt` | Inline shorthand for cloud delegation |

### Spec Kit Context Parity

Copilot CLI does **not** receive Spec Kit's startup context or advisor brief through hook stdout. GitHub's hook contract currently ignores `sessionStart` output and ignores `userPromptSubmitted` output for prompt modification, so the Claude-style `additionalContext` path is unavailable.

Spec Kit uses the supported file-based workaround: the repository `userPromptSubmitted` hook refreshes a managed block in `$HOME/.copilot/copilot-instructions.md` with the latest startup context and advisor brief. Human Copilot instructions are preserved outside the `SPEC-KIT-COPILOT-CONTEXT` markers. Copilot reads the refreshed custom instructions on the next submitted prompt. For scripted `copilot -p` calls that need same-invocation context, use [assets/shell_wrapper.md](./assets/shell_wrapper.md). Use `--no-custom-instructions` only when intentionally bypassing this context surface.

### Model Selection

Copilot CLI supports 6 recommended models across 3 providers. **`gpt-5.4` is the skill default** — frontier reasoning with configurable effort levels; override per invocation with `--model`.

| Model | ID | Provider |
|-------|----|----------|
| **GPT-5.4** (DEFAULT) | `gpt-5.4` | OpenAI |
| **GPT-5.5** | `gpt-5.5` | OpenAI |
| **GPT-5.3-Codex** | `gpt-5.3-codex` | OpenAI |
| **Claude Opus 4.7** | `claude-opus-4.7` | Anthropic |
| **Claude Sonnet 4.6** | `claude-sonnet-4.6` | Anthropic |
| **Gemini 3.1 Pro Preview** | `gemini-3.1-pro-preview` | Google |

### Reasoning Effort (GPT-5.x models)

| Level | Config Value | Description |
|-------|-------------|-------------|
| Low | `"low"` | Faster responses, less detailed reasoning |
| Medium | `"medium"` | Balanced speed and reasoning depth |
| High | `"high"` | More thorough reasoning, slower responses |
| Extra High | `"xhigh"` | Maximum reasoning depth, slowest responses |

**Per-model support and defaults:**

| Model | Supported Levels | Default |
|-------|-----------------|---------|
| `gpt-5.4` (skill default) | low, medium, high, **xhigh** | high |
| `gpt-5.5` | low, medium, high, **xhigh** | high |
| `gpt-5.3-codex` | low, medium, high, xhigh | high |
| `gpt-5.1-codex-max` | low, medium, high, xhigh | high |
| `gpt-5.1-codex` | low, medium, high | medium |
| `gpt-5.1` | low, medium, high | medium |
| Claude models | low, medium, high | high |
| Gemini models | low, medium, high | medium |

**Setting reasoning effort**: copilot 1.0.36+ exposes `--effort` / `--reasoning-effort` as a CLI flag (preferred for scripted `-p` usage). For persistent default, edit `~/.copilot/config.json` (`"reasoning_effort": "xhigh"`) — also writable via the interactive `/model` flow. CLI flag takes precedence over config file when both are present.

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

Internally, Copilot reads `reasoning_effort` from `~/.copilot/config.json`, validates it against the model's supported levels, and passes it as `reasoning_effort` in the OpenAI API request body. Invalid values fall back to the model's default.

### Copilot CLI Agent Delegation

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

### Error Handling

| Issue | Solution |
|-------|----------|
| `command not found: copilot` | Install via `npm install -g @github/copilot`. Verify with `command -v copilot`. |
| Self-invocation refused | Use a sibling cli-* skill OR open a fresh shell session. Copilot self-dispatch is refused per the layered detection guard in §2. |
| `not authenticated` / `401 Unauthorized` | Run the Provider Auth Pre-Flight (§3); GitHub OAuth or `GH_TOKEN` is missing. Ask the user before falling back. |
| `401 Unauthorized` mid-dispatch | Token expired or revoked. Invalidate the pre-flight cache, rerun `gh auth status`, ask the user before retrying. |
| `model not found` for `--model X` | Run `copilot /model` interactively to enumerate available models per Section §3 Model Selection. The 6 documented models may differ on older `copilot` releases. |
| Reasoning effort flag rejected | Older `copilot` (< 1.0.36) does not accept `--effort` / `--reasoning-effort`. Set `reasoning_effort` in `~/.copilot/config.json` instead. |
| Cloud delegation hangs | `/delegate` requires GitHub cloud agent quota; surface a one-line check: `gh api /copilot/billing` confirms the subscription. Fall back to local `--allow-all-tools` if the cloud agent is unavailable. |
| Concurrency throttling | GitHub Copilot API throttles above 3 concurrent dispatches per account. The skill's hard ceiling is 3 (see [`references/concurrency.md`](./references/concurrency.md)). |
| Spec Kit context missing | Verify `$HOME/.copilot/copilot-instructions.md` contains the `SPEC-KIT-COPILOT-CONTEXT` markers. The repo `userPromptSubmitted` hook refreshes them; for scripted `copilot -p` calls, use [`assets/shell_wrapper.md`](./assets/shell_wrapper.md). |

---

<!-- /ANCHOR:how-it-works -->
<!-- ANCHOR:rules -->
## 4. RULES

### ALWAYS

1. Verify the `copilot` binary is installed before invocation.
2. Use the `-p` flag for non-interactive execution; include `--allow-all-tools` when autonomy is required.
3. Capture stderr (`2>&1`) so errors surface to the conductor.
4. Specify `--model` when the task benefits from a specific provider's strength.
5. Validate output against the local filesystem before integrating.
6. **Pass the spec folder to the delegated agent** in the prompt: if the calling AI has an active Gate-3 spec folder, include `Spec folder: <path> (pre-approved, skip Gate 3)`. If none, ASK the user before delegating — the delegated agent cannot answer Gate 3 interactively.
7. **Load `assets/prompt_quality_card.md` before building any dispatch prompt.** Apply the CLEAR 5-question check, tag the framework in the Bash invocation comment, and use the returned `ENHANCED_PROMPT`. If complexity ≥ 7/10 or compliance/security signals appear, dispatch `@improve-prompt` via the Task tool instead of loading `sk-improve-prompt` inline.

### CONCURRENCY LIMIT

Copilot CLI tolerates up to 5 concurrent `copilot` processes; the repo convention caps routine automation at 3 parallel calls. Check `pgrep -f "copilot" | wc -l` before launching. Treat 5 as the hard ceiling.

### NEVER

1. Use interactive mode (omit `-p`) — it hangs the conductor's shell.
2. Expose `GH_TOKEN`, sensitive prompts, or credentials in logs/output, or hammer the API with rapid sequential calls. Trust Autopilot output blindly — always verify generated code's structural integrity.
3. Ignore repository memory — check existing conventions before overriding.
4. Run more than 5 concurrent copilot processes (memory exhaustion risk).

### ESCALATE IF

1. `copilot login` is required (auth failure), a model conflict occurs (model not in current plan), Autopilot hits a safety block, or cloud delegation times out.

### Memory Handback Protocol

When the calling AI needs to preserve session context from a Copilot CLI delegation, run the canonical 7-step procedure (extract `MEMORY_HANDBACK` section → build structured JSON → scrub secrets → invoke `generate-context.js --stdin` → `memory_index_scan`). Full procedure and caveats: [`system-spec-kit/references/cli/memory_handback.md`](../system-spec-kit/references/cli/memory_handback.md).

Copilot-specific Memory Epilogue template: see [assets/prompt_templates.md](./assets/prompt_templates.md) §12.

Example invocation:
```bash
printf '%s' "$JSON_PAYLOAD" | node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --stdin [spec-folder]
```

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

### Shared (cli-* family)
- [shared_smart_router.md](../system-spec-kit/references/cli/shared_smart_router.md) - Helper-function bodies for the smart router.
- [memory_handback.md](../system-spec-kit/references/cli/memory_handback.md) - Canonical 7-step Memory Handback procedure.

### External
- [GitHub Copilot CLI Documentation](https://docs.github.com/en/copilot/using-github-copilot/using-github-copilot-cli)
- [GitHub Models Directory](https://github.com/marketplace/models)

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

**Tool roles**: Bash dispatches the CLI; Read/Glob/Grep validate output.

### Related Skills
- **cli-claude-code**: Delegate to Claude Code for surgical diff-based edits.
- **cli-gemini**: Delegate to Gemini for Google Search grounded research.
- **sk-git**: Use Copilot to generate commit messages or review diffs.

---

<!-- /ANCHOR:integration-points -->
<!-- ANCHOR:related-resources -->
## 8. RELATED RESOURCES

See Section 5 REFERENCES for the canonical reference, asset, shared, and external link list.

---

<!-- /ANCHOR:related-resources -->
