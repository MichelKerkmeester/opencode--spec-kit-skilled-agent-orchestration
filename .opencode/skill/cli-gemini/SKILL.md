---
name: cli-gemini
description: "Gemini CLI orchestrator enabling any AI assistant to invoke Google's Gemini CLI for supplementary AI tasks including code generation, web research via Google Search, codebase architecture analysis, cross-AI validation, and parallel task processing."
allowed-tools: [Bash, Read, Glob, Grep]
version: 1.2.5.0
---

<!-- Keywords: gemini, gemini-cli, google, cross-ai, web-search, codebase-investigator, code-generation, code-review, second-opinion, agent-delegation -->

# Gemini CLI Orchestrator - Cross-AI Task Delegation

> **CRITICAL — SELF-INVOCATION PROHIBITED**
>
> This skill dispatches to the Google CLI binary (`gemini`). If the agent currently reading this skill is itself running inside Gemini (detection signals listed in §2), the skill MUST refuse to load and return the documented error message instead of generating any `gemini` invocation.
>
> Just as a Claude Code agent never calls cli-claude-code, an OpenCode agent never calls cli-opencode, a Codex agent never calls cli-codex, a Copilot agent never calls cli-copilot, and a Gemini agent never calls cli-gemini. The cli-X skills are for **cross-AI delegation only** — never self-invocation.

Orchestrate Google's Gemini CLI for tasks that benefit from a second AI perspective, real-time web search via Google Search grounding, deep codebase architecture analysis, or parallel code generation.

**Core Principle**: Use Gemini for what it does best. Delegate, validate, integrate. The calling AI stays the conductor.

---

## 1. WHEN TO USE

### Activation Triggers

- **Cross-AI Validation** — code review second perspective, security audit alternative analysis, bug detection with fresh eyes.
- **Google Search Grounding** — current internet info, latest library versions, API changes, community solutions, recent best practices.
- **Codebase Architecture Analysis** — onboarding to unfamiliar codebases, cross-file dependency mapping, architecture docs from code.
- **Parallel Task Processing** — offloading generation while continuing other work, simultaneous code generations, background docs/tests.
- **Agent-Delegated Tasks** — specialized Gemini agent matches, deep investigation using 1M+ token context, multi-strategy planning.
- **Specialized Generation** — explicit Gemini operations, test suite generation, code translation, batch docs (JSDoc, README, API).

### When NOT to Use

- **You ARE Gemini already.** If your runtime is Gemini (detection signal: `$GEMINI_SESSION_ID` or any `GEMINI_*` env var set, `gemini` in process ancestry, or `~/.gemini/state/<id>/lock` present), this skill refuses to load. Self-invocation creates a circular dispatch loop and burns tokens for no value. The cli-X family is exclusively for cross-AI delegation.
- Simple, quick tasks where CLI overhead is not worth it.
- Tasks requiring immediate response (rate limits may cause delays).
- Context already loaded and understood by the current agent.
- Interactive refinement requiring multi-turn conversation.
- Tasks where Gemini CLI is not installed.

---

## 2. SMART ROUTING


### Prerequisite Detection

```bash
# Verify Gemini CLI is available before routing
command -v gemini || echo "Not installed. Run: npm install -g @google/gemini-cli"
```

### Self-Invocation Guard

```python
def detect_self_invocation():
    """Returns a non-None signal when the orchestrator is already running inside Gemini."""
    # Layer 1: env var lookup — Gemini sets GEMINI_SESSION_ID and GEMINI_* vars
    for key in os.environ:
        if key == 'GEMINI_SESSION_ID' or key.startswith('GEMINI_'):
            return ('env', key)
    # Layer 2: process ancestry — gemini in parent tree
    try:
        ancestry = subprocess.check_output(['ps', '-o', 'command=', '-p', str(os.getppid())]).decode()
        if '/gemini' in ancestry or 'gemini ' in ancestry:
            return ('ancestry', 'gemini')
    except subprocess.SubprocessError:
        pass
    # Layer 3: state lock-file probe
    state_dir = os.path.expanduser('~/.gemini/state')
    if os.path.isdir(state_dir):
        for entry in os.listdir(state_dir):
            if os.path.exists(os.path.join(state_dir, entry, 'lock')):
                return ('lockfile', entry)
    return None

if detect_self_invocation():
    refuse(
        "Self-invocation refused: this agent is already running inside Gemini. "
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
    "GENERATION":        {"weight": 4, "keywords": ["generate", "create", "build", "write code", "gemini create"]},
    "REVIEW":            {"weight": 4, "keywords": ["review", "audit", "security", "bug", "second opinion", "cross-validate"]},
    "RESEARCH":          {"weight": 4, "keywords": ["search", "latest", "current", "what's new", "google search", "web research"]},
    "ARCHITECTURE":      {"weight": 3, "keywords": ["architecture", "codebase", "investigate", "dependencies", "analyze project"]},
    "AGENT_DELEGATION":  {"weight": 4, "keywords": ["delegate", "agent", "background", "parallel", "offload", "gemini agent"]},
    "TEMPLATES":         {"weight": 3, "keywords": ["template", "prompt", "how to ask", "gemini prompt"]},
    "PATTERNS":          {"weight": 3, "keywords": ["pattern", "workflow", "orchestrate"]},
}

RESOURCE_MAP = {
    "GENERATION":        ["references/cli_reference.md", "assets/prompt_templates.md"],
    "REVIEW":            ["references/integration_patterns.md", "references/agent_delegation.md"],
    "RESEARCH":          ["references/gemini_tools.md", "assets/prompt_templates.md"],
    "ARCHITECTURE":      ["references/gemini_tools.md", "references/agent_delegation.md"],
    "AGENT_DELEGATION":  ["references/agent_delegation.md", "references/integration_patterns.md"],
    "TEMPLATES":         ["assets/prompt_templates.md", "references/cli_reference.md"],
    "PATTERNS":          ["references/integration_patterns.md", "references/cli_reference.md"],
}

LOADING_LEVELS = {
    "ALWAYS": ["references/cli_reference.md", "assets/prompt_quality_card.md"],
    "ON_DEMAND_KEYWORDS": ["full reference", "all templates", "deep dive", "complete guide", "google search", "gemini prompt", "gemini agent", "web research", "multi query"],
    "ON_DEMAND": ["references/gemini_tools.md", "assets/prompt_templates.md"],
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Is the user asking about Gemini CLI specifically?",
    "Does the task benefit from a second AI perspective?",
    "Is real-time web information needed?",
    "Would codebase-wide analysis help?",
]
```

**Call sequence** (using shared helpers from `shared_smart_router.md`):

1. `discover_markdown_resources()` — recursively enumerate current `.md` files under existing `references/` and `assets/` folders at routing time.
2. `_guard_in_skill()` + `load_if_available()` — sandbox paths to this skill, reject non-markdown loads, skip missing files, and suppress duplicates.
3. `score_intents(task)` and `select_intents(scores, ambiguity_delta=1.0)` — preserve provider-specific weighted intent scoring and top-2 ambiguity handling.
4. `get_routing_key(task, intents)` — derive the provider routing key from task/provider context, then fall back to `gemini`.
5. ALWAYS-load `LOADING_LEVELS["ALWAYS"]`, then return `UNKNOWN_FALLBACK` with `UNKNOWN_FALLBACK_CHECKLIST` when max score is 0.
6. CONDITIONAL-load `RESOURCE_MAP[intent]`, ON_DEMAND-load keyword matches, and return a notice when no provider-specific knowledge base is available beyond always-load resources.

The `route_gemini_resources(task)` function body lives in [`shared_smart_router.md`](../system-spec-kit/references/cli/shared_smart_router.md) — substitute `<PROVIDER>` = `gemini`.

---

## 3. HOW IT WORKS

### Prerequisites

```bash
# Verify installation
command -v gemini || echo "Not installed. Run: npm install -g @google/gemini-cli"

# First-time authentication (interactive)
gemini
```

**Authentication options**: Google OAuth (free tier: 60 req/min, 1000 req/day), API key (`export GEMINI_API_KEY=key`), or Vertex AI (enterprise).

### Provider Auth Pre-Flight (Smart Fallback)

**MANDATORY before any first dispatch in a session.** The default Google auth (OAuth free-tier OR `GEMINI_API_KEY` OR Vertex AI) may not be configured on this machine — silently failing with `401 Unauthorized` or `not authenticated` mid-dispatch wastes a round-trip. Run this check once per session, cache the result, and re-run it only if a dispatch fails with an auth error.

```bash
# One-shot pre-flight: capture auth status for routing
[ -n "$GEMINI_API_KEY" ] && GEMINI_KEY_OK=1 || GEMINI_KEY_OK=0
GEMINI_AUTH=$(gemini config list 2>&1 || echo "")
echo "$GEMINI_AUTH" | grep -qi "oauth\|logged in" && GOOGLE_OAUTH_OK=1 || GOOGLE_OAUTH_OK=0
[ -n "$GOOGLE_GENAI_USE_VERTEXAI" ] && VERTEX_OK=1 || VERTEX_OK=0
```

**Decision tree** (apply in order — first match wins):

| State | GOOGLE_OAUTH_OK | GEMINI_KEY_OK | VERTEX_OK | Action |
|-------|-----------------|---------------|-----------|--------|
| Default available | 1 | * | * | Proceed with `gemini "<prompt>" -o text` (free-tier OAuth) |
| OAuth missing, API key ready | 0 | 1 | * | **ASK user** before substituting — never auto-fall-back silently. Surface options A/B/C below. |
| Only Vertex configured | 0 | 0 | 1 | **ASK user** to confirm enterprise Vertex AI dispatch (different billing surface) |
| All missing | 0 | 0 | 0 | **ASK user** to configure auth — surface the login commands, do NOT dispatch. |

**User prompt template — OAuth missing, API key configured:**

```
Google OAuth (free tier) is not configured on this machine, but `$GEMINI_API_KEY` is set.
Pick one:
  A) Use the existing `$GEMINI_API_KEY` (paid API plan; bypasses free-tier rate limits)
  B) Run `gemini` interactively first to set up OAuth (free 60 req/min, 1000 req/day), then retry
  C) Name a different model — paste the `--model <id>` you want to use
```

**User prompt template — all missing:**

```
No Google auth is configured on this machine. Run one:
  - Run `gemini` interactively      (recommended — sets up free-tier OAuth)
  - `export GEMINI_API_KEY=AIza...`  (paid API plan; for non-interactive CI/CD)
  - Vertex AI                        (enterprise; requires `gcloud auth` + `GOOGLE_GENAI_USE_VERTEXAI=true`)
Which would you like to set up? Confirm when login finishes; the skill will retry the original dispatch.
```

**Error-recovery contract.** If a dispatch returns an auth error after pre-flight passed (token expired or quota exhausted), invalidate the cache, rerun the pre-flight, and apply the same decision tree before retrying. Never substitute a model the user didn't approve. Note: free-tier rate-limit errors (429) are *not* auth errors — surface them as quota guidance instead of triggering fallback.

### Default Invocation (Skill Default)

**Default model + flags + agent**: `gemini-3.1-pro-preview` (only model surfaced) · `-o text` · agent via prompt prefix (e.g. `@review`, `@context`). The pinned shape:

```bash
gemini "<prompt>" -o text 2>&1
```

**User override** (honor explicit user phrasing verbatim):

| User says | Resolve to |
|-----------|------------|
| (nothing specified) | `-o text` |
| "JSON output" | `-o json` |
| "Auto-approve all tools" | Append `--yolo` (or `-y`) |
| "Use Google Search" | Add `google_web_search` tool invocation in prompt content |
| "Investigate codebase" | Add `codebase_investigator` tool invocation in prompt content |

### Core Invocation Pattern

```bash
gemini "[prompt]" -o text 2>&1
```

| Flag | Purpose |
|------|---------|
| `-o text` | Human-readable output (default for most tasks) |
| `-o json` | Structured output with stats (for programmatic processing) |
| `-m model` | Model selection: use `gemini-3.1-pro-preview` (only supported model) |
| `--yolo` or `-y` | Auto-approve all tool calls — **requires explicit user approval** |

### Model Selection

| Model | Use Case |
|-------|----------|
| `gemini-3.1-pro-preview` | All tasks (default and only model) |

### Gemini Agent Delegation

The calling AI is the conductor; Gemini agents in `.gemini/agents/` shape HOW Gemini processes the task.

| Task Type | Gemini Agent | Invocation Pattern |
|-----------|-------------|-------------------|
| Code review / security audit | `@review` | `gemini "As @review agent: Review @./src/auth.ts for security issues" -o text` |
| Architecture exploration | `@context` | `gemini "As @context agent: Analyze the architecture of this project" -o text` |
| Technical research | `@deep-research` | `gemini "As @deep-research agent: Research latest Express.js security advisories" -o text` |
| Fresh-perspective debugging | `@debug` | `Task tool -> @debug`, then run the Gemini CLI prompt with the packaged context |
| Multi-strategy planning | `@multi-ai-council` | `gemini "As @multi-ai-council agent: Plan the authentication redesign" -m gemini-3.1-pro-preview -o text` |

See [agent_delegation.md](./references/agent_delegation.md) for complete agent roster.

### Unique Gemini Capabilities

| Tool | Purpose | Invocation |
|------|---------|------------|
| `google_web_search` | Real-time Google Search grounding | "Use Google Search to find..." |
| `codebase_investigator` | Deep architecture analysis | "Use codebase_investigator to..." |
| `save_memory` | Cross-session persistent context | "Remember that..." |

### Essential Commands

```bash
# Code generation
gemini "Create [description] with [features]. Output complete file." --yolo -o text

# Code review (second opinion)
gemini "Review [file] for bugs and security issues" -o text

# Web research (Google Search grounding)
gemini "What's new in [topic]? Use Google Search." -o text

# Architecture analysis
gemini "Use codebase_investigator to analyze this project" -o text

# Background execution
gemini "[long task]" --yolo -o text 2>&1 &

# Explicit model (only supported model)
gemini "[prompt]" -m gemini-3.1-pro-preview -o text
```

### Error Handling

| Issue | Solution |
|-------|----------|
| CLI not installed | `npm install -g @google/gemini-cli` |
| Rate limit exceeded | Wait for auto-retry or reduce request frequency |
| Auth expired | Run `gemini` interactively to re-authenticate |
| Context too large | Use `.geminiignore` or specify files explicitly |

---

## 4. RULES

### ALWAYS

1. Verify Gemini CLI is installed before first invocation (`command -v gemini`).
2. Use `-o text` for human-readable output unless programmatic processing requires `-o json`.
3. Validate Gemini-generated code (XSS, injection, eval, syntax checks via `node --check`, `tsc --noEmit`, etc.) before applying.
4. Capture stderr (`2>&1`) so rate-limit messages and errors surface.
5. Use `gemini-3.1-pro-preview` as the model — it is the only supported model.
6. Route to the appropriate `@agent` when the task matches a specialization (see Section 3 routing table).
7. **Pass the spec folder to the delegated agent** in the prompt: if the calling AI has an active Gate-3 spec folder, include `Spec folder: <path> (pre-approved, skip Gate 3)`. If none, ASK the user before delegating — the delegated agent cannot answer Gate 3 interactively.
8. **Load `assets/prompt_quality_card.md` before building any dispatch prompt.** Apply the CLEAR 5-question check, tag the framework in the Bash invocation comment, and use the returned `ENHANCED_PROMPT`. If complexity ≥ 7/10 or compliance/security signals appear, dispatch `@improve-prompt` via the Task tool instead of loading `sk-improve-prompt` inline.
9. **Code Standards Loading (codebase-agnostic baseline+overlay contract)** — When dispatching for code review or code generation, instruct the dispatched session to: (1) load `sk-code` baseline first (universal findings-first rules, security/correctness minimums, severity contract); (2) detect stack/codebase signals (markers, framework presence, file extensions); (3) load exactly one overlay skill matching `sk-code-*` selected from those signals; (4) apply precedence: overlay style/process guidance overrides generic baseline style guidance, while baseline security/correctness minimums remain mandatory. Fallback: if stack cannot be determined confidently, use the default available `sk-code-*` overlay and note the uncertainty. NEVER hardcode a specific overlay (e.g. `sk-code-opencode`, `sk-code-review`) in dispatch prompts — the dispatched session selects the overlay; the CLI skill only stipulates the contract.

### NEVER

1. Use `--yolo` on production codebases without explicit user approval (auto-approves writes/shell — damage risk).
2. Trust Gemini output blindly for security-sensitive code, send sensitive data (keys/passwords/credentials) in prompts, or hammer the API with rapid sequential calls.
3. Use Gemini for tasks where context is already loaded — direct action by the current agent is faster.
4. Assume Gemini output is correct without verification — cross-reference codebase and project standards.

### ESCALATE IF

1. Gemini CLI is not installed and user has not acknowledged (provide `npm install -g @google/gemini-cli`).
2. Rate limits are persistently exceeded (suggest API key setup or fallback strategy).
3. Gemini output conflicts with existing code patterns (present both perspectives; user decides).
4. Task requires `--yolo` on sensitive files (describe risks; get explicit user approval).

### Memory Handback Protocol

When the calling AI needs to preserve session context from a Gemini CLI delegation, run the canonical 7-step procedure (extract `MEMORY_HANDBACK` section → build structured JSON → scrub secrets → invoke `generate-context.js --stdin` → `memory_index_scan`). Full procedure and caveats: [`system-spec-kit/references/cli/memory_handback.md`](../system-spec-kit/references/cli/memory_handback.md).

Gemini-specific Memory Epilogue template: see [assets/prompt_templates.md](./assets/prompt_templates.md) §13.

Example invocation:
```bash
printf '%s' "$JSON_PAYLOAD" | node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --stdin [spec-folder]
```

---

## 5. REFERENCES

### Core References

- [cli_reference.md](./references/cli_reference.md) - Complete CLI command, flag, and slash command reference
- [integration_patterns.md](./references/integration_patterns.md) - Cross-AI orchestration patterns and workflows
- [gemini_tools.md](./references/gemini_tools.md) - Built-in tools documentation (google_web_search, codebase_investigator, save_memory)
- [agent_delegation.md](./references/agent_delegation.md) - Gemini agent roster, routing table, and invocation patterns

### Templates and Assets

- [prompt_templates.md](./assets/prompt_templates.md) - Copy-paste ready prompt templates for common tasks

### Shared (cli-* family)
- [shared_smart_router.md](../system-spec-kit/references/cli/shared_smart_router.md) - Helper-function bodies for the smart router.
- [memory_handback.md](../system-spec-kit/references/cli/memory_handback.md) - Canonical 7-step Memory Handback procedure.

### External
- [Gemini CLI GitHub](https://github.com/google-gemini/gemini-cli) - Official repository
- [Google AI Studio](https://aistudio.google.com/apikey) - API key management

### Reference Loading Notes

- Load only references needed for current intent.
- Smart Routing (Section 2) is the single routing authority.
- `cli_reference.md` is ALWAYS loaded as baseline.

---

## 6. SUCCESS CRITERIA

### Task Completion

- Gemini CLI invoked with correct flags and model selection.
- Output captured, validated, and integrated appropriately.
- No security vulnerabilities introduced from generated code.
- Rate limits handled gracefully (retry or model fallback).
- Appropriate Gemini agent routed for specialized tasks.

### Skill Quality

- All 8 sections present with proper anchor comments.
- Smart routing covers all intent signals with UNKNOWN_FALLBACK.
- Reference files provide deep-dive content without duplication.

---

## 7. INTEGRATION POINTS

### Framework Integration

This skill operates within the behavioral framework defined in [AGENTS.md](../../../AGENTS.md).

Key integrations:
- **Gate 2**: Skill routing via `skill_advisor.py`
- **Tool Routing**: Per AGENTS.md Section 6 decision tree
- **Memory**: Context preserved via Spec Kit Memory MCP

**Tool roles**: Bash dispatches the CLI; Read/Glob/Grep validate output.

---

## 8. REFERENCES AND RELATED RESOURCES

The router discovers reference, asset, and script docs dynamically. Start with `references/cli_reference.md`, `references/integration_patterns.md`, `assets/prompt_quality_card.md`, `assets/prompt_templates.md`, `references/agent_delegation.md`, `references/gemini_tools.md`, then load task-specific resources from `references/`, templates from `assets/`, and automation from `scripts/` when present.

Related skills: `cli-claude-code` for extended reasoning, `cli-codex` for sandboxed OpenAI perspective, `sk-code` for code-quality contracts, `mcp-code-mode` for external MCP work, and `system-spec-kit` for packet handback.
