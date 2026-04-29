---
name: cli-codex
description: "Codex CLI orchestrator enabling any AI assistant to invoke OpenAI's Codex CLI for supplementary AI tasks including code generation, code review, web research, codebase analysis, cross-AI validation, and parallel task processing."
allowed-tools: [Bash, Read, Glob, Grep]
version: 1.4.2.0
---

<!-- Keywords: codex, codex-cli, openai, cross-ai, web-search, code-generation, code-review, second-opinion, agent-delegation, gpt-5, session-management -->

# Codex CLI Orchestrator - Cross-AI Task Delegation

> **CRITICAL — SELF-INVOCATION PROHIBITED**
>
> This skill dispatches to the OpenAI CLI binary (`codex`). If the agent currently reading this skill is itself running inside Codex (detection signals listed in §2), the skill MUST refuse to load and return the documented error message instead of generating any `codex` invocation.
>
> Just as a Claude Code agent never calls cli-claude-code, an OpenCode agent never calls cli-opencode, a Codex agent never calls cli-codex, a Copilot agent never calls cli-copilot, and a Gemini agent never calls cli-gemini. The cli-X skills are for **cross-AI delegation only** — never self-invocation.

Orchestrate OpenAI's Codex CLI for tasks that benefit from a second AI perspective, real-time web search, deep codebase analysis, built-in code review workflows, or parallel code generation.

**Core Principle**: Use Codex for what it does best. Delegate, validate, integrate. The calling AI stays the conductor.

---

<!-- ANCHOR:when-to-use -->
## 1. WHEN TO USE

### Activation Triggers

- **Cross-AI Validation** — code review second perspective, security audit alternative analysis, bug detection, `/review` diff-aware workflow.
- **Web Research** — current internet info via `--search` flag, latest library versions, API changes, community solutions.
- **Codebase Architecture Analysis** — onboarding to unfamiliar codebases, cross-file dependency mapping, architecture docs from code.
- **Parallel Task Processing** — offloading generation, simultaneous code generations, background docs/test generation.
- **Agent-Delegated Tasks** — specialized profile matches (`.codex/agents/*.toml`), session management (resume, fork), multi-strategy planning.
- **Specialized Generation** — explicit Codex requests, test suite generation, code translation, batch docs (JSDoc, README, API), visual input via `--image`/`-i`.

### When NOT to Use

- **You ARE Codex already.** If your runtime is Codex (detection signal: `$CODEX_SESSION_ID` or any `CODEX_*` env var set, `codex` in process ancestry, or `~/.codex/state/<id>/lock` present), this skill refuses to load. Self-invocation creates a circular dispatch loop and burns tokens for no value. The cli-X family is exclusively for cross-AI delegation.
- Simple, quick tasks where CLI overhead is not worth it.
- Tasks requiring immediate response (rate limits may cause delays).
- Context already loaded and understood by the current agent.
- Interactive refinement requiring the full-screen TUI (use `codex` directly instead).
- Tasks where Codex CLI is not installed.

---

<!-- /ANCHOR:when-to-use -->
<!-- ANCHOR:smart-routing -->
## 2. SMART ROUTING

### Prerequisite Detection

```bash
# Verify Codex CLI is available before routing
command -v codex || echo "Not installed. Run: npm i -g @openai/codex"
```

### Self-Invocation Guard

```python
def detect_self_invocation():
    """Returns a non-None signal when the orchestrator is already running inside Codex."""
    # Layer 1: env var lookup — Codex sets CODEX_SESSION_ID and CODEX_* vars
    for key in os.environ:
        if key == 'CODEX_SESSION_ID' or key.startswith('CODEX_'):
            return ('env', key)
    # Layer 2: process ancestry — codex in parent tree
    try:
        ancestry = subprocess.check_output(['ps', '-o', 'command=', '-p', str(os.getppid())]).decode()
        if '/codex' in ancestry or 'codex ' in ancestry:
            return ('ancestry', 'codex')
    except subprocess.SubprocessError:
        pass
    # Layer 3: state lock-file probe
    state_dir = os.path.expanduser('~/.codex/state')
    if os.path.isdir(state_dir):
        for entry in os.listdir(state_dir):
            if os.path.exists(os.path.join(state_dir, entry, 'lock')):
                return ('lockfile', entry)
    return None

if detect_self_invocation():
    refuse(
        "Self-invocation refused: this agent is already running inside Codex. "
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
    "GENERATION":        {"weight": 4, "keywords": ["generate", "create", "build", "write code", "codex create"]},
    "REVIEW":            {"weight": 4, "keywords": ["review", "audit", "security", "bug", "second opinion", "cross-validate", "/review"]},
    "RESEARCH":          {"weight": 4, "keywords": ["search", "latest", "current", "what's new", "web research", "--search", "browse"]},
    "ARCHITECTURE":      {"weight": 3, "keywords": ["architecture", "codebase", "investigate", "dependencies", "analyze project"]},
    "AGENT_DELEGATION":  {"weight": 4, "keywords": ["delegate", "agent", "background", "parallel", "offload", "codex agent"]},
    "TEMPLATES":         {"weight": 3, "keywords": ["template", "prompt", "how to ask", "codex prompt"]},
    "PATTERNS":          {"weight": 3, "keywords": ["pattern", "workflow", "orchestrate", "session", "resume", "fork"]},
    "HOOKS":             {"weight": 4, "keywords": ["hook", "hooks", "advisor brief", "startup context", "userpromptsubmit", "sessionstart", "codex_hooks"]},
}

RESOURCE_MAP = {
    "GENERATION":        ["references/cli_reference.md", "assets/prompt_templates.md"],
    "REVIEW":            ["references/integration_patterns.md", "references/agent_delegation.md"],
    "RESEARCH":          ["references/codex_tools.md", "assets/prompt_templates.md"],
    "ARCHITECTURE":      ["references/codex_tools.md", "references/agent_delegation.md"],
    "AGENT_DELEGATION":  ["references/agent_delegation.md", "references/integration_patterns.md"],
    "TEMPLATES":         ["assets/prompt_templates.md", "references/cli_reference.md"],
    "PATTERNS":          ["references/integration_patterns.md", "references/cli_reference.md"],
    "HOOKS":             ["references/hook_contract.md", "references/cli_reference.md"],
}

LOADING_LEVELS = {
    "ALWAYS": ["references/cli_reference.md", "assets/prompt_quality_card.md"],
    "ON_DEMAND_KEYWORDS": ["full reference", "all templates", "deep dive", "complete guide", "codex agent", "codex prompt", "web research", "review command", "fork session", "hook contract"],
    "ON_DEMAND": ["references/codex_tools.md", "assets/prompt_templates.md"],
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Is the user asking about Codex CLI specifically?",
    "Does the task benefit from a second AI perspective?",
    "Is real-time web information needed (--search)?",
    "Would codebase-wide analysis or /review workflow help?",
]
```

**Call sequence** (using shared helpers from `shared_smart_router.md`):

1. `discover_markdown_resources()` — enumerate available `.md` files under `references/` and `assets/`
2. `score_intents(task)` — keyword-weight match against `INTENT_SIGNALS`
3. `select_intents(scores, ambiguity_delta=1.0)` — top-1 or top-2 if scores within delta
4. ALWAYS-load `LOADING_LEVELS["ALWAYS"]`, then UNKNOWN-fallback if max score == 0
5. CONDITIONAL-load `RESOURCE_MAP[intent]` for each selected intent
6. ON_DEMAND-load if any `ON_DEMAND_KEYWORDS` match the task text

The `route_codex_resources(task)` function body lives in [`shared_smart_router.md`](../system-spec-kit/references/cli/shared_smart_router.md) — substitute `<PROVIDER>` = `codex`.

---

<!-- /ANCHOR:smart-routing -->
<!-- ANCHOR:how-it-works -->
## 3. HOW IT WORKS

### Prerequisites

```bash
# Verify installation
command -v codex || echo "Not installed. Run: npm i -g @openai/codex"

# Authentication — API key OR ChatGPT OAuth
export OPENAI_API_KEY=your-key-here
codex login
```

**Authentication options**: `OPENAI_API_KEY` env var (direct API), or ChatGPT OAuth via `codex login` (uses ChatGPT account credentials).

### Provider Auth Pre-Flight (Smart Fallback)

**MANDATORY before any first dispatch in a session.** The default OpenAI auth (API key OR ChatGPT OAuth) may not be configured on this machine — silently failing with `401 Unauthorized` or `not authenticated` mid-dispatch wastes a round-trip. Run this check once per session, cache the result, and re-run it only if a dispatch fails with an auth error.

```bash
# One-shot pre-flight: capture auth status for routing
[ -n "$OPENAI_API_KEY" ] && OPENAI_KEY_OK=1 || OPENAI_KEY_OK=0
CODEX_AUTH=$(codex auth status 2>&1)
echo "$CODEX_AUTH" | grep -qi "logged in\|chatgpt-oauth" && CODEX_OAUTH_OK=1 || CODEX_OAUTH_OK=0
```

**Decision tree** (apply in order — first match wins):

| State | OPENAI_KEY_OK | CODEX_OAUTH_OK | Action |
|-------|---------------|----------------|--------|
| Default available | 1 | * | Proceed with `codex exec --model gpt-5.5 -c model_reasoning_effort="medium" -c service_tier="fast"` |
| API key missing, OAuth ready | 0 | 1 | **ASK user** before substituting — never auto-fall-back silently. Surface options A/B/C below. |
| Both missing | 0 | 0 | **ASK user** to configure auth — surface the login commands, do NOT dispatch. |

**User prompt template — API key missing, OAuth configured:**

```
`$OPENAI_API_KEY` is not set, but ChatGPT OAuth via `codex login` is configured.
Pick one:
  A) Use the existing ChatGPT OAuth session (works for `codex exec` if your ChatGPT plan covers the model)
  B) Run `export OPENAI_API_KEY=sk-...` first, then retry the original dispatch
  C) Name a different model — paste the `--model <id>` you want to use
```

**User prompt template — both missing:**

```
No OpenAI auth is configured on this machine. Run one:
  - `export OPENAI_API_KEY=sk-...`  (recommended for direct API calls)
  - `codex login`                    (interactive ChatGPT OAuth flow; requires ChatGPT Plus/Pro/Business)
Which would you like to set up? Confirm when login finishes; the skill will retry the original dispatch.
```

**Error-recovery contract.** If a dispatch returns an auth error after pre-flight passed (key revoked or OAuth expired), invalidate the cache, rerun the pre-flight, and apply the same decision tree before retrying. Never substitute a model the user didn't approve.

### Default Invocation (Skill Default)

**Default model + effort + tier**: `gpt-5.5` · `medium` reasoning · `fast` service tier. Balances speed, cost, and quality for the typical delegation.

```bash
codex exec \
  --model gpt-5.5 \
  -c model_reasoning_effort="medium" \
  -c service_tier="fast" \
  -c approval_policy=never \
  --sandbox workspace-write \
  "<prompt>"
```

**User override** (honor explicit user phrasing verbatim):

| User says | Resolve to |
|-----------|------------|
| (nothing specified) | `--model gpt-5.5 -c model_reasoning_effort="medium" -c service_tier="fast"` |
| "Use gpt 5.5 high fast" | `--model gpt-5.5 -c model_reasoning_effort="high" -c service_tier="fast"` |
| "Use gpt 5.5 low" | `--model gpt-5.5 -c model_reasoning_effort="low" -c service_tier="fast"` (fast stays unless user drops it) |
| "Use gpt 5.5 xhigh" | `--model gpt-5.5 -c model_reasoning_effort="xhigh" -c service_tier="fast"` |

Only the reasoning-effort dimension changes via override; model stays on `gpt-5.5` and service tier stays on `fast` unless the user explicitly says otherwise.

### Core Invocation Pattern

```bash
codex exec "prompt" --model gpt-5.5 -c model_reasoning_effort="medium" -c service_tier="fast" 2>&1
```

> **Common flag mistakes**: `--reasoning`, `--reasoning-effort` and `--quiet` do NOT exist. Use `-c model_reasoning_effort="high"` for reasoning effort (or set it in `config.toml`). There is no quiet flag. Use `-o file.txt` to capture the last message to a file.

| Flag / Option | Purpose |
|---------------|---------|
| `--model <id>` | Model selection — `gpt-5.5` (always; skill default) |
| `-c model_reasoning_effort="<level>"` | Reasoning effort — `none`, `minimal`, `low`, `medium`, `high`, `xhigh` |
| `-c service_tier="fast"` | **Fast mode** — routes through fast tier. **Always pass explicitly** when delegating from another AI so the call is self-documenting and never silently falls back to a slower tier. |
| `--sandbox read-only` | Safe mode: read files, no writes or shell commands |
| `--sandbox workspace-write` | Allow file writes within the workspace |
| `--sandbox danger-full-access` | Full shell access — **requires explicit user approval** |
| `--ask-for-approval untrusted` | Prompt before untrusted operations (default) |
| `--ask-for-approval on-request` | Prompt only when Codex requests approval |
| `--ask-for-approval never` | Auto-approve all operations (use with caution) |
| `--full-auto` | Low-friction sandboxed automation: `workspace-write` sandbox + `on-request` approval. Default for unattended orchestration. |
| `--search` | Enable live web browsing during task execution |
| `--image` / `-i` | Attach an image file as visual input |

> **Default sandbox behavior**: `codex exec` without an explicit `--sandbox` flag defaults to `read-only` with `approval: never`. **File modification tasks will silently fail** — the agent reads code and plans changes but cannot write them. Always pass `--sandbox workspace-write` (or `--full-auto`) when the task requires file edits.

> **Fast mode (REQUIRED for cross-AI delegation)**: Always pass `-c service_tier="fast"` explicitly. This routes the call through the fast tier instead of relying on whatever the user's `~/.codex/config.toml` sets as default. Explicit means reproducible regardless of who runs it.

### Model Selection

The skill dispatches `gpt-5.5` for every task. Only the reasoning-effort dimension varies.

| Model | ID | Use Case | Reasoning Effort |
|-------|----|----------|-----------------|
| **GPT-5.5** ★ default | `gpt-5.5` | All delegations — code generation, review, implementation, documentation, architecture, research | configurable via `-c model_reasoning_effort` (default `medium`; raise to `high` / `xhigh` for hard problems, lower to `low` / `minimal` for trivial lookups) |

**Reasoning Effort Levels**: `none`, `minimal`, `low`, `medium` (skill default), `high` (user-override tier), `xhigh` (maximum depth — profile default for all agents).

> **Note**: There is no `--reasoning-effort` CLI flag. Set via `-c model_reasoning_effort="medium"` or in `config.toml` / profile sections.

**Selection Strategy**: `gpt-5.5` always; tune only reasoning effort: `medium` for most delegations (default), `high`/`xhigh` for architecture/security audits/complex planning, `low`/`minimal` for trivial lookups.

### Codex Agent Delegation

The calling AI is the conductor; Codex profiles in `config.toml` `[profiles.<name>]` shape HOW Codex processes the task (sandbox, reasoning).

| Task Type | Profile | Invocation Pattern |
|-----------|---------|-------------------|
| Code review / security audit | review | `codex exec -p review "Review @./src/auth.ts for security issues" -m gpt-5.5` |
| Git diff review | (built-in) | `codex exec review "Focus on security" --commit HEAD` |
| Architecture exploration | context | `codex exec -p context "Analyze the architecture of this project" -m gpt-5.5` |
| Technical research | research | `codex exec -p research "Research latest Express.js security advisories" -m gpt-5.5 --search` |
| Documentation generation | write | `codex exec -p write "Generate README for this project" -m gpt-5.5` |
| Fresh-perspective debugging | debug | `codex exec -p debug "Debug this error: [error]" -m gpt-5.5` |
| Multi-strategy planning | ultra-think | `codex exec -p ultra-think "Plan the authentication redesign" -m gpt-5.5` |

**Profile setup**: Defined in `.codex/config.toml` under `[profiles.<name>]`. Each profile can override `model`, `model_reasoning_effort`, `sandbox_mode`, and `approval_policy`. The `.codex/agents/*.toml` files provide agent definitions for the interactive multi-agent TUI feature.

See [agent_delegation.md](./references/agent_delegation.md) for complete agent roster.

### Unique Codex Capabilities

| Capability | Purpose | Invocation |
|------------|---------|------------|
| `/review` command | Built-in diff-aware code review in TUI | `codex` then type `/review` |
| `--search` flag | Live web browsing during exec | `codex exec "..." --search` |
| `codex mcp` | Connect to Model Context Protocol servers | `codex mcp` subcommand |
| Native hooks | Inject startup context and advisor briefs when `[features].codex_hooks = true` | `~/.codex/hooks.json` |
| Session resume | Continue a previous Codex session | `codex resume [session-id]` |
| Session fork | Branch from an existing session | `codex fork [session-id]` |
| `--image` / `-i` | Attach images for visual input | `codex exec "..." -i screenshot.png` |
| `codex cloud` | Remote task execution | `codex cloud` subcommand |

### Essential Commands

```bash
# Code generation (workspace writes allowed)
codex exec "Create [description] with [features]. Output complete file." --model gpt-5.5 --sandbox workspace-write

# Code review (read-only — no file modifications)
codex exec "Review @./src/auth.ts for security vulnerabilities" --model gpt-5.5 --sandbox read-only

# Git diff review (built-in review subcommand)
codex exec review "Focus on security vulnerabilities" --commit HEAD --model gpt-5.5

# Web research (live web browsing enabled)
codex exec "What's new in [topic]? Search the web for current information." --model gpt-5.5 --search --sandbox read-only

# Background execution
codex exec "[long task]" --model gpt-5.5 --sandbox workspace-write 2>&1 &

# With image input
codex exec "Implement this UI component based on the attached design" --model gpt-5.5 -i design.png --sandbox workspace-write

# Profile-based task delegation
codex exec -p research "Research latest security advisories for Express.js" --model gpt-5.5 --search
```

### Error Handling

| Issue | Solution |
|-------|----------|
| CLI not installed | `npm i -g @openai/codex` |
| `OPENAI_API_KEY` not set | `export OPENAI_API_KEY=your-key` or run `codex login` |
| Rate limit exceeded | Wait for auto-retry or reduce request frequency |
| Auth expired | Run `codex login` to re-authenticate via OAuth |
| Sandbox violation | Match `--sandbox` level to task requirements |
| Task ran but no files changed | `codex exec` defaults to `read-only` sandbox — add `--sandbox workspace-write` or `--full-auto` for edit tasks |
| Agent asks for spec folder / approval | Non-interactive `exec` cannot answer prompts — include `(pre-approved, skip Gate 3)` in prompt and use `--full-auto` |
| Context too large | Specify files explicitly with `@./path` rather than broad prompts |
| No startup context or advisor brief | Enable `[features].codex_hooks = true` and verify `~/.codex/hooks.json` has Spec Kit Memory `SessionStart` and `UserPromptSubmit` entries. See `references/hook_contract.md`. |

---

<!-- /ANCHOR:how-it-works -->
<!-- ANCHOR:rules -->
## 4. RULES

### ALWAYS

1. Verify Codex CLI is installed before first invocation (`command -v codex`).
2. Use `--sandbox read-only` for review/analysis/research; `--sandbox workspace-write` (or `--full-auto`) for code generation/file modification — `codex exec` defaults to `read-only`, so omitting causes silent no-op on edit tasks.
3. Validate Codex-generated code (XSS, injection, eval, syntax checks via `node --check`, `tsc --noEmit`, etc.) before applying.
4. Capture stderr (`2>&1`) so rate-limit messages and errors surface.
5. **Redirect codex stdin from `/dev/null`** when dispatching in a `while read` loop. Pattern: `codex exec "$PROMPT" > "$LOG" 2>&1 </dev/null &`. Without `</dev/null`, the backgrounded codex process inherits the loop's stdin (the file after `done < input.jsonl`) and silently consumes the remaining lines — the loop exits after 3-6 iterations with no error. See `references/integration_patterns.md#background-execution` → "Silent Stdin Consumption".
6. **Specify model + effort + service tier explicitly** — never rely on caller environment. Default: `--model gpt-5.5 -c model_reasoning_effort="medium" -c service_tier="fast"`. Honor user overrides verbatim. Use `high`/`xhigh` for reasoning-heavy tasks (architecture, security, deep planning).
7. Route to the appropriate `-p <profile>` when the task matches a specialization (see Section 3 routing table); use `codex exec review` (built-in subcommand) for git diff reviews.
8. **Pass the spec folder to the delegated agent** in the prompt: if the calling AI has an active Gate-3 spec folder, include `Spec folder: <path> (pre-approved, skip Gate 3)`. If none, ASK the user before delegating — the delegated agent cannot answer Gate 3 in `--full-auto` or non-interactive mode.
9. **Load `assets/prompt_quality_card.md` before building any dispatch prompt.** Apply the CLEAR 5-question check, tag the framework in the Bash invocation comment, and use the returned `ENHANCED_PROMPT`. If complexity ≥ 7/10 or compliance/security signals appear, dispatch `@improve-prompt` via the Task tool instead of loading `sk-improve-prompt` inline.
10. **Never inject user-level voice/personalization content into AI-orchestrated Codex delegations.** Codex CLI reads user-level voice from `~/.codex/AGENTS.md` (the human's global settings, loaded automatically). When an AI delegates via `codex exec`, the calling AI's own voice rules govern the response — do NOT read `~/.codex/AGENTS.md` and paste into delegation prompts. Keep delegations focused on task/model/sandbox/effort/(spec-folder pre-approval). If the user asks how to make Codex sound more like Claude in *their own* sessions, point to `~/.codex/AGENTS.md` — not any repo asset.

### NEVER

1. Use `--sandbox danger-full-access` without explicit user approval (full shell beyond workspace = damage risk). `--full-auto` (workspace-write + on-request approval) does not require pre-approval.
2. Trust Codex output blindly for security-sensitive code, send sensitive data (API keys, passwords, credentials) in prompts, or hammer the API with rapid sequential calls.
3. Use Codex for tasks where context is already loaded — direct action by the calling AI is faster.
4. Assume Codex output is correct without verification — cross-reference codebase and project standards.

### ESCALATE IF

1. Codex CLI is not installed and user has not acknowledged (provide `npm i -g @openai/codex`).
2. Rate limits are persistently exceeded (suggest checking API key quota or OAuth account limits).
3. Codex output conflicts with existing code patterns (present both perspectives; user decides).
4. Task requires `--sandbox danger-full-access` (describe risks; get explicit user approval). `--full-auto` does not require escalation.

### Memory Handback Protocol

When the calling AI needs to preserve session context from a Codex CLI delegation, run the canonical 7-step procedure (extract `MEMORY_HANDBACK` section → build structured JSON → scrub secrets → invoke `generate-context.js` via `--stdin`/`--json`/temp-file → `memory_index_scan`). Full procedure and caveats: [`system-spec-kit/references/cli/memory_handback.md`](../system-spec-kit/references/cli/memory_handback.md).

Codex-specific Memory Epilogue template: see [assets/prompt_templates.md](./assets/prompt_templates.md) §13.

Example invocation:
```bash
printf '%s' "$JSON_PAYLOAD" | node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --stdin [spec-folder]
```

---

<!-- /ANCHOR:rules -->
<!-- ANCHOR:references -->
## 5. REFERENCES

### Core References

- [cli_reference.md](./references/cli_reference.md) - Complete CLI subcommands, flags, sandbox modes, and config reference
- [integration_patterns.md](./references/integration_patterns.md) - Cross-AI orchestration patterns and workflows
- [codex_tools.md](./references/codex_tools.md) - Built-in capabilities documentation (/review, --search, MCP, session management)
- [hook_contract.md](./references/hook_contract.md) - Native hook contract and Spec Kit Memory startup/advisor wiring
- [agent_delegation.md](./references/agent_delegation.md) - Codex agent roster, routing table, and invocation patterns

### Templates and Assets

- [prompt_templates.md](./assets/prompt_templates.md) - Copy-paste ready prompt templates for common tasks

### Shared (cli-* family)
- [shared_smart_router.md](../system-spec-kit/references/cli/shared_smart_router.md) - Helper-function bodies for the smart router.
- [memory_handback.md](../system-spec-kit/references/cli/memory_handback.md) - Canonical 7-step Memory Handback procedure.

### External
- [Codex CLI GitHub](https://github.com/openai/codex) - Official repository
- [OpenAI Platform](https://platform.openai.com/api-keys) - API key management
- [OpenAI ChatGPT](https://chatgpt.com) - ChatGPT OAuth account

### Reference Loading Notes

- Load only references needed for current intent.
- Smart Routing (Section 2) is the single routing authority.
- `cli_reference.md` is ALWAYS loaded as baseline.

---

<!-- /ANCHOR:references -->
<!-- ANCHOR:success-criteria -->
## 6. SUCCESS CRITERIA

### Task Completion

- Codex CLI invoked with correct subcommand, flags, model, and sandbox mode.
- Output captured, validated, and integrated appropriately.
- No security vulnerabilities introduced from generated code.
- Rate limits handled gracefully (retry or fallback strategy).
- Appropriate Codex profile routed for specialized tasks.
- Sandbox level matched to task type (read-only for review, workspace-write for generation).

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
| **cli-gemini** | Parallel cross-AI validation — Gemini for Google Search grounding, Codex for OpenAI perspective |
| **sk-code-web** | Use Codex for code review during web development |
| **sk-code-full-stack** | Delegate test generation or architecture analysis to Codex |
| **mcp-code-mode** | Codex CLI is independent; does not require Code Mode |

---

<!-- /ANCHOR:integration-points -->
<!-- ANCHOR:related-resources -->
## 8. RELATED RESOURCES

See Section 5 REFERENCES for the canonical reference, asset, shared, and external link list.

---

<!-- /ANCHOR:related-resources -->
