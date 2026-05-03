---
name: cli-opencode
description: "OpenCode CLI orchestrator covering three use cases: external AI runtimes dispatching opencode run, in-OpenCode parallel detached sessions for ablation and worker farms, and cross-AI orchestration handback with full plugin, skill, and MCP runtime context."
allowed-tools: [Bash, Read, Glob, Grep]
version: 1.3.0.0
---

<!-- Keywords: opencode, opencode-cli, opencode-run, cross-ai, spec-kit-runtime, plugin-runtime, parallel-sessions, share-url, detached-session, agent-delegation, opencode-go, deepseek -->

# OpenCode CLI Orchestrator - Full-Runtime Cross-AI Dispatch

> **CRITICAL — SELF-INVOCATION PROHIBITED**
>
> This skill dispatches to the OpenCode CLI binary (`opencode`). If the agent currently reading this skill is itself running inside OpenCode (TUI / acp / serve / run modes — detection signals listed in §2), the skill MUST refuse to load and return the documented error message instead of generating any `opencode` invocation. The only exception is an explicit "parallel detached" request that intentionally spawns a SEPARATE session with its own session id and state directory.
>
> Just as a Claude Code agent never calls cli-claude-code, an OpenCode agent never calls cli-opencode, a Codex agent never calls cli-codex, a Copilot agent never calls cli-copilot, and a Gemini agent never calls cli-gemini. The cli-X skills are for **cross-AI delegation only** — never self-invocation.

Orchestrate OpenCode's `opencode run` from external AI assistants (Claude Code, Codex, Copilot, Gemini, raw shell) AND from inside an existing OpenCode session for parallel detached workers. Three documented use cases keep the cycle risk explicit while giving every dispatch path a copy-paste invocation shape.

**Core Principle**: The calling AI stays the conductor. Delegate to OpenCode for what it does best — full plugin, skill, MCP, and Spec Kit Memory runtime in a one-shot dispatch. Validate and integrate the output.

---

## 1. WHEN TO USE

### Activation Triggers

- **Full plugin / skill / MCP runtime** (use case 1) — calling AI is Claude Code / Codex / Copilot / Gemini / raw shell AND the task needs the project's full Spec Kit Memory database, CocoIndex semantic index, structural code graph, or every plugin/skill/MCP tool in a one-shot dispatch. Includes `@deep-research` / `@deep-review` agent loops with externalized state under `.opencode/specs/`.
- **Parallel detached session** (use case 2) — operator already inside OpenCode (TUI / web / serve / acp) AND wants a SEPARATE session with its own session id and state directory for ablation, worker farm, or parallel research. Prompt explicitly mentions "parallel detached", "ablation suite", "worker farm", "parallel research", "spawn detached", or "share URL".
- **Cross-AI orchestration handback** (use case 3) — calling AI is non-Anthropic (Codex / Copilot / Gemini), task targets a project-specific subsystem (spec-kit, memory, code-graph, advisor), and the non-Anthropic CLI cannot load the project's plugin/skill/MCP runtime on its own and needs OpenCode as a bridge.
- **Agent dispatch** — task matches a specialized OpenCode agent. Primary agents (directly invokable via `--agent`): `general`, `plan` (built-in), `orchestrate`, `multi-ai-council`. Subagents dispatched via the orchestrate primary: `context`, `review`, `write`, `debug`, `deep-research`, `deep-review`, `improve-agent`, `improve-prompt`.
- **Cross-repo dispatch** — session in repo A dispatches into repo B's plugin/skill/MCP runtime via `--dir <path>` or remote OpenCode server via `--attach <url>`.

### When NOT to Use

- **You ARE OpenCode already.** If your runtime is OpenCode (detection signal: `$OPENCODE_CONFIG_DIR` or any `OPENCODE_*` env var set, `opencode` in process ancestry, or `~/.opencode/state/<id>/lock` present), this skill refuses to load. Self-invocation creates a circular dispatch loop and burns tokens for no value. The cli-X family is exclusively for cross-AI delegation. The single legitimate exception is an explicit "parallel detached" request that intentionally spawns a SEPARATE session id and state directory (use case 2); without that qualifier, the smart router refuses per ADR-001.
- Simple, quick tasks where `opencode run` overhead is not worth it.
- Tasks that only need a raw model dispatch — use a sibling cli-* skill.
- Tasks requiring interactive TUI or web UI (use `opencode` directly instead of `opencode run`).
- Context already loaded and understood by the calling AI.
- Tasks where the OpenCode binary is not installed at the expected path.

---

## 2. SMART ROUTING


### Prerequisite Detection

```bash
# Verify OpenCode CLI is available
command -v opencode || echo "Not installed. Run: brew install opencode (macOS) or curl -fsSL https://opencode.ai/install | bash"

# SELF-INVOCATION GUARD (ADR-001 layered detection)
# Layer 1: env var lookup — any OPENCODE_* variable
env | grep -q '^OPENCODE_' && echo "ERROR: OPENCODE_* env detected — already inside OpenCode."
# Layer 2: process ancestry — opencode in parent tree
ps -o command= -p "$PPID" | grep -q opencode && echo "ERROR: opencode parent process detected."
# Layer 3: state lock-file probe
ls ~/.opencode/state/*/lock 2>/dev/null | head -1 | grep -q lock && echo "ERROR: live OpenCode session lock detected."
```

### Self-Invocation Guard (ADR-001)

```python
def detect_self_invocation():
    """Returns a non-None signal when the orchestrator is already running inside OpenCode."""
    # Layer 1: env var lookup — OpenCode sets OPENCODE_CONFIG_DIR and OPENCODE_* vars
    for key in os.environ:
        if key == 'OPENCODE_CONFIG_DIR' or key.startswith('OPENCODE_'):
            return ('env', key)
    # Layer 2: process ancestry — opencode in parent tree
    try:
        ancestry = subprocess.check_output(['ps', '-o', 'command=', '-p', str(os.getppid())]).decode()
        if '/opencode' in ancestry or 'opencode ' in ancestry:
            return ('ancestry', 'opencode')
    except subprocess.SubprocessError:
        pass
    # Layer 3: state lock-file probe
    state_dir = os.path.expanduser('~/.opencode/state')
    if os.path.isdir(state_dir):
        for entry in os.listdir(state_dir):
            if os.path.exists(os.path.join(state_dir, entry, 'lock')):
                return ('lockfile', entry)
    return None

if detect_self_invocation():
    # Single legitimate exception: explicit "parallel detached" keywords (use case 2)
    # spawn a SEPARATE session id and state directory, not a self-dispatch.
    if not has_parallel_session_keywords(prompt):
        refuse(
            "Self-invocation refused: this agent is already running inside OpenCode. "
            "Use a sibling cli-* skill or a fresh shell session in a different runtime to dispatch a different model. "
            "For a parallel detached session, restate with explicit parallel-session keywords."
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

- Pattern 1: Runtime Discovery - `discover_markdown_resources()` recursively scans `references/` and `assets/`.
- Pattern 2: Existence-Check Before Load - `load_if_available()` uses `_guard_in_skill()`, `inventory`, and `seen`.
- Pattern 3: Extensible Routing Key - provider/use-case context derives an `opencode` routing key across external dispatch, detached sessions, handback, agents, cross-repo, templates, and workflows.
- Pattern 4: Multi-Tier Graceful Fallback - `UNKNOWN_FALLBACK` disambiguates OpenCode vs sibling CLI vs detached/handback and missing intent routes return a "no knowledge base" notice.

```python
INTENT_SIGNALS = {
    "EXTERNAL_DISPATCH":  {"weight": 4, "keywords": ["delegate to opencode", "opencode run", "from claude code", "from codex", "from gemini", "from copilot", "external runtime", "full plugin runtime"]},
    "PARALLEL_DETACHED":  {"weight": 4, "keywords": ["parallel detached", "ablation suite", "worker farm", "parallel research", "spawn detached", "share url", "share-url", "detached session"]},
    "CROSS_AI_HANDBACK":  {"weight": 4, "keywords": ["spec kit", "spec-kit", "spec_kit", "code graph", "memory_search", "session_bootstrap", "skill advisor", "cross-ai handback"]},
    "AGENT_DISPATCH":     {"weight": 4, "keywords": ["delegate", "agent", "deep-research", "deep-review", "multi-ai-council", "review agent", "context agent"]},
    "CROSS_REPO":         {"weight": 3, "keywords": ["cross-repo", "different repo", "--dir", "another repository", "remote opencode"]},
    "TEMPLATES":          {"weight": 3, "keywords": ["template", "prompt", "how to ask", "opencode prompt"]},
    "PATTERNS":           {"weight": 3, "keywords": ["pattern", "workflow", "orchestrate", "session continue", "resume session"]},
}

RESOURCE_MAP = {
    "EXTERNAL_DISPATCH":  ["references/cli_reference.md", "references/integration_patterns.md"],
    "PARALLEL_DETACHED":  ["references/integration_patterns.md", "assets/prompt_templates.md"],
    "CROSS_AI_HANDBACK":  ["references/integration_patterns.md", "references/opencode_tools.md"],
    "AGENT_DISPATCH":     ["references/agent_delegation.md", "assets/prompt_templates.md"],
    "CROSS_REPO":         ["references/cli_reference.md", "references/opencode_tools.md"],
    "TEMPLATES":          ["assets/prompt_templates.md", "references/cli_reference.md"],
    "PATTERNS":           ["references/integration_patterns.md", "references/cli_reference.md"],
}

LOADING_LEVELS = {
    "ALWAYS": ["references/cli_reference.md", "assets/prompt_quality_card.md"],
    "ON_DEMAND_KEYWORDS": ["full reference", "all templates", "deep dive", "complete guide", "opencode agent", "opencode prompt", "share url", "ablation", "worker farm", "self-invocation", "memory handback"],
    "ON_DEMAND": ["references/opencode_tools.md", "assets/prompt_templates.md"],
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Is the user asking about OpenCode CLI specifically?",
    "Does the task need the project's full plugin / skill / MCP runtime?",
    "Is a parallel detached session what they want?",
    "Is a non-Anthropic CLI handing back to OpenCode for a spec-kit workflow?",
]
```

**Call sequence** (using shared helpers from `shared_smart_router.md`):

1. `discover_markdown_resources()` — recursively enumerate current `.md` files under existing `references/` and `assets/` folders at routing time.
2. `_guard_in_skill()` + `load_if_available()` — sandbox paths to this skill, reject non-markdown loads, skip missing files, and suppress duplicates.
3. `score_intents(task)` and `select_intents(scores, ambiguity_delta=1.0)` — preserve provider-specific weighted intent scoring and top-2 ambiguity handling.
4. `get_routing_key(task, intents)` — derive the provider routing key from task/provider context, then fall back to `opencode`.
5. ALWAYS-load `LOADING_LEVELS["ALWAYS"]`, then return `UNKNOWN_FALLBACK` with `UNKNOWN_FALLBACK_CHECKLIST` when max score is 0.
6. CONDITIONAL-load `RESOURCE_MAP[intent]`, ON_DEMAND-load keyword matches, and return a notice when no provider-specific knowledge base is available beyond always-load resources.

The `route_opencode_resources(task)` function body lives in [`shared_smart_router.md`](../system-spec-kit/references/cli/shared_smart_router.md) — substitute `<PROVIDER>` = `opencode`.

---

## 3. HOW IT WORKS

### Prerequisites

```bash
# Verify installation (cli-opencode v1.0.0 is pinned to opencode v1.3.17)
opencode --version | grep -q '^1\.' || echo "Not installed or version drift. See references/cli_reference.md §9."

# Self-invocation guard
env | grep -q '^OPENCODE_' && echo "ERROR: Already inside OpenCode session"

# Authentication — providers configured via opencode providers (alias auth)
opencode providers
```

**Authentication options**: `opencode providers login <provider>` for OAuth and API key flows. Configured providers on a typical install: `opencode-go` (api), `deepseek` (api).

### Provider Auth Pre-Flight (Smart Fallback)

**MANDATORY before any first dispatch in a session.** The default provider may not be logged in on this machine — silently failing with `provider/model not found` or `401 Unauthorized` mid-dispatch wastes a round-trip. Run this check once per session, cache the result, and re-run it only if a dispatch fails with an auth error.

```bash
# One-shot pre-flight: list configured providers, capture for routing
PROVIDERS=$(opencode providers list 2>&1)
echo "$PROVIDERS" | grep -q "opencode-go" && OPENCODE_GO_OK=1 || OPENCODE_GO_OK=0
echo "$PROVIDERS" | grep -q "deepseek"     && DEEPSEEK_OK=1   || DEEPSEEK_OK=0
```

**Decision tree** (apply in order — first match wins):

| State | OPENCODE_GO_OK | DEEPSEEK_OK | Action |
|-------|----------------|-------------|--------|
| Default available | 1 | * | Proceed with `--model opencode-go/deepseek-v4-pro --variant high` |
| Default missing, fallback ready | 0 | 1 | **ASK user** before substituting — never auto-fall-back silently. Surface options A/B/C below. |
| Both missing | 0 | 0 | **ASK user** to configure a provider — surface the login commands, do NOT dispatch. |

**User prompt template — default missing, fallback configured:**

```
The skill default `opencode-go/deepseek-v4-pro` is not configured on this machine.
A configured fallback is available. Pick one:
  A) Use `deepseek/deepseek-v4-pro --variant high` (direct DeepSeek API, configured now)
  B) Run `opencode providers login opencode-go` first, then retry the original dispatch
  C) Name a different model — paste the `--model <provider/model>` you want to use
```

**User prompt template — both providers missing:**

```
No supported providers are configured on this machine. Run one:
  - `opencode providers login opencode-go`  (recommended — default for cli-opencode)
  - `opencode providers login deepseek`     (direct DeepSeek API alternative)
Which would you like to set up? Confirm when login finishes; the skill will retry the original dispatch.
```

**Error-recovery contract.** If a dispatch returns an auth error after pre-flight passed (credential expired or rotated), invalidate the cache, rerun the pre-flight, and apply the same decision tree before retrying. Never substitute a model the user didn't approve.

### Default Invocation (Skill Default)

**Default model + variant + agent + format + dir**: `opencode-go/deepseek-v4-pro` · `--variant high` · `--agent general` · `--format json` · `--dir <repo-root>`. The repo root pin avoids CWD ambiguity. OpenCode Go is the default provider — it routes DeepSeek and other open models through a single gateway and gives elevated reasoning at low cost for routine cli-opencode dispatches.

Use `opencode run --model opencode-go/deepseek-v4-pro --agent general --variant high --format json --dir <repo-root> "<prompt>"`.

Honor explicit user model, agent, port, and handback phrasing verbatim; otherwise use the default invocation above.

### Core Invocation Pattern

Core flags: `--model`, `--agent`, `--variant`, `--format json`, `--dir`, continuation/session/fork flags, `--share` and `--port` for detached sessions, `--file`, `--thinking`, `--pure`, and log flags.

> **Background dispatch in a `while read` loop**: always append `</dev/null` after the redirect when backgrounding `opencode run` inside a loop. Without it the backgrounded process inherits the loop's stdin and silently consumes the rest. See `references/integration_patterns.md` §6.

### Model Selection

Run `opencode providers list` to confirm credentials and `opencode models <provider>` for live choices. Default to `opencode-go/deepseek-v4-pro --variant high`; direct `deepseek/*` remains available when explicitly requested.

### OpenCode Agent Delegation

The calling AI is the conductor. OpenCode distinguishes **primary agents** (directly invokable via `--agent <slug>`) from **subagents** (dispatched as Task-tool subagents from a primary).

#### Primary agents — directly invokable via `--agent`

Direct agents are `general`, `plan`, `orchestrate`, and `multi-ai-council`. Pin one explicitly when the task needs planning, orchestration, or multi-strategy planning.

#### Subagents — dispatched as Task subagents from a primary

<!-- F-007-B2-01: clarified single-hop dispatch contract; deep-research/deep-review/improve-* are command-only -->

These live at `.opencode/agent/<slug>.md` with `mode: subagent` and are NOT directly invokable via `opencode run --agent`. Two dispatch surfaces are legal under the single-hop NDP contract:

1. **Generic subagents** (`context`, `review`, `write`, `debug`) — dispatched by a primary (`orchestrate`) using the Task tool. To exercise via the opencode CLI, route through `--agent orchestrate` and let it dispatch the relevant subagent.
2. **Command-owned loop executors** (`deep-research`, `deep-review`, `improve-agent`, `improve-prompt`) — dispatched ONLY by their parent commands (`/spec_kit:deep-research`, `/spec_kit:deep-review`, `/improve:agent`, `/improve:prompt`). Never dispatch these directly via `--agent <slug>` and never route them through `orchestrate`. The parent command owns iteration state, convergence detection, and continuity.

Generic subagents (`context`, `review`, `write`, `debug`) route through `orchestrate`; loop executors (`deep-research`, `deep-review`, `improve-agent`, `improve-prompt`) route only through their parent commands.

See [agent_delegation.md](./references/agent_delegation.md) for the complete agent roster and dispatch patterns.

### Unique OpenCode Strengths

OpenCode dispatch provides full project runtime loading, detached sessions, JSON event streams, agent routing, cross-repo/server dispatch, session continuation, and plugin-disable debugging.

### Essential Commands

Use the default invocation for external runtime handback, append `--share --port <N>` only for explicit detached sessions, select `--agent orchestrate` for generic subagent routing, and change `--dir` for cross-repo dispatch.

### Error Handling

Install missing binaries, refuse ambiguous self-invocation, run provider pre-flight for model/auth errors, check version drift for unknown flags, force `--format json` for empty streams, add `</dev/null` for background loops, confirm `--share`, use `--pure` only for plugin crashes, and inspect state logs for stuck sessions.

---

## 4. RULES

### ALWAYS

1. Verify OpenCode CLI is installed before first invocation; confirm version baseline against v1.3.17 (drift handling per `references/cli_reference.md` §9).
2. **Run the self-invocation guard before dispatch** (ADR-001): Layer 1 env-var lookup for any `OPENCODE_*`, Layer 2 process-ancestry probe for `opencode` parent, Layer 3 `~/.opencode/state/<id>/lock` probe. Trip on ANY positive — refuse unless prompt has explicit parallel-session keywords.
3. Pin model + agent + variant + format + dir explicitly. Default: `--model opencode-go/deepseek-v4-pro --agent general --variant high --format json --dir <repo-root>`. Honor user overrides verbatim (e.g. `opencode-go/deepseek-v4-flash`, `opencode-go/glm-5.1`, `deepseek/deepseek-v4-pro`).
4. Pass `--format json` unless the calling AI explicitly wants formatted output — JSON event stream is what external runtimes parse incrementally.
5. Append `</dev/null` when backgrounding `opencode run` inside `while read` loops (otherwise stdin is silently consumed).
6. **Pass the spec folder to the dispatched session** in the prompt: if the calling AI has an active Gate-3 spec folder, include `Spec folder: <path> (pre-approved, skip Gate 3)`. If none, ASK the user before delegating — the dispatched session cannot answer Gate 3 interactively in non-interactive `run` mode.
7. **Load `assets/prompt_quality_card.md` before building any dispatch prompt.** Apply the CLEAR 5-question check, tag the framework in the Bash invocation comment, and use the returned `ENHANCED_PROMPT`. If complexity ≥ 7/10 or compliance/security signals appear, dispatch `@improve-prompt` via the Task tool first.
8. Validate dispatched session output: parse JSON events incrementally (tool calls, partial messages, final summary), run syntax checks if code generated, cross-reference against project standards via the baseline+overlay contract (`sk-code` baseline + one matching `sk-code-*` overlay; see ALWAYS rule 12).
9. Capture stderr (`2>&1`) to catch tool errors and warnings.
10. Classify the use case (1 / 2 / 3) before dispatching — the smart router refuses dispatches that do not map to one of the three.
11. **Run the Provider Auth Pre-Flight once per session** (see §3 Provider Auth Pre-Flight). Cache the configured-providers list. If the default `opencode-go` is missing, ASK the user — never silently substitute the model. If a later dispatch returns an auth error, invalidate the cache and rerun the pre-flight before retrying.
12. **Code Standards Loading (codebase-agnostic baseline+overlay contract)** — When dispatching for code review or code generation, instruct the dispatched session to: (1) load `sk-code` baseline first (universal findings-first rules, security/correctness minimums, severity contract); (2) detect stack/codebase signals (markers, framework presence, file extensions); (3) load exactly one overlay skill matching `sk-code-*` selected from those signals; (4) apply precedence: overlay style/process guidance overrides generic baseline style guidance, while baseline security/correctness minimums remain mandatory. Fallback: if stack cannot be determined confidently, use the default available `sk-code-*` overlay and note the uncertainty. NEVER hardcode a specific overlay (e.g. `sk-code-opencode`, `sk-code-review`) in dispatch prompts — the dispatched session selects the overlay; the CLI skill only stipulates the contract.

### NEVER

1. Invoke this skill from within OpenCode itself for a self-dispatch — refuse with the documented error message; use a sibling cli-* / fresh shell / parallel-session keywords.
2. Pass `--share` without operator confirmation (CHK-033) — share URL exposes session contents.
3. Trust dispatched session output blindly for security-sensitive code, send sensitive data (API keys, passwords, credentials) in prompts, or hammer the API with rapid sequential calls.
4. Use `--pure` outside of plugin debugging (disabling plugins removes the entire point of cli-opencode dispatch).
5. Nest `opencode run` inside a dispatched session's tool calls — use OpenCode's native Task tool for sub-agent dispatch.

### ESCALATE IF

1. OpenCode CLI is not installed and user has not acknowledged (provide `brew install opencode` or `curl -fsSL https://opencode.ai/install | bash`).
2. Operator wants to publish a `--share` URL — get explicit confirmation per CHK-033.
3. Binary version differs from the v1.3.17 baseline — run `opencode --version` and `opencode run --help`; surface drift and fall back or require approval.
4. Smart router cannot map the prompt to one of the three use cases — surface the disambiguation checklist from UNKNOWN_FALLBACK.
5. Self-invocation guard trips AND the prompt is ambiguous — surface the refusal with three remediation options (sibling cli-* / fresh shell / parallel-session keywords).

### Memory Handback Protocol

When the calling AI needs to preserve session context from an OpenCode CLI delegation, run the canonical 7-step procedure (extract `MEMORY_HANDBACK` section → build structured JSON → scrub secrets → invoke `generate-context.js` via `--stdin`/`--json`/temp-file → `memory_index_scan`). Full procedure and caveats: [`system-spec-kit/references/cli/memory_handback.md`](../system-spec-kit/references/cli/memory_handback.md).

OpenCode-specific Memory Epilogue template: see [assets/prompt_templates.md](./assets/prompt_templates.md) §14.

Example invocation:
```bash
printf '%s' "$JSON_PAYLOAD" | node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --stdin [spec-folder]
```

---

## 5. REFERENCES

### Core References

- [cli_reference.md](./references/cli_reference.md) - Full subcommand and flag reference, models, version drift handling
- [integration_patterns.md](./references/integration_patterns.md) - 3 use cases, decision tree, self-invocation guard, silent stdin
- [opencode_tools.md](./references/opencode_tools.md) - Unique value props vs sibling cli-* skills
- [agent_delegation.md](./references/agent_delegation.md) - Agent routing matrix, leaf-agent constraints

### Templates and Assets

- [prompt_templates.md](./assets/prompt_templates.md) - 13 numbered copy-paste templates per use case + agent + handback
- [prompt_quality_card.md](./assets/prompt_quality_card.md) - Framework selection, CLEAR 5-check, escalation triggers

### Shared (cli-* family)
- [shared_smart_router.md](../system-spec-kit/references/cli/shared_smart_router.md) - Helper-function bodies for the smart router.
- [memory_handback.md](../system-spec-kit/references/cli/memory_handback.md) - Canonical 7-step Memory Handback procedure.

### External
- [OpenCode GitHub](https://github.com/sst/opencode) - Official repository
- [OpenCode Install](https://opencode.ai/install) - Standalone installer entry point
- [OpenCode Documentation](https://opencode.ai/docs) - Official docs

### Reference Loading Notes

- Load only references needed for current intent.
- Smart Routing (Section 2) is the single routing authority.
- `cli_reference.md` and `prompt_quality_card.md` are ALWAYS loaded as baseline.

---

## 6. SUCCESS CRITERIA

### Task Completion

- OpenCode CLI invoked with the correct subcommand, flags, model, agent, variant, format, and dir.
- Self-invocation guard checked before dispatch — refused when appropriate.
- Use case (1 / 2 / 3) classified explicitly before invocation.
- JSON event stream captured, parsed incrementally, validated, integrated.
- No security vulnerabilities introduced from generated code.
- `--share` URLs opt-in with operator confirmation per CHK-033.
- Background dispatches in `while read` loops include `</dev/null` redirect.
- Memory Handback extracted and saved through `generate-context.js` when applicable.

### Skill Quality

- All 8 sections present with proper anchor comments.
- Smart routing covers all intent signals with UNKNOWN_FALLBACK.
- Reference files provide deep-dive content without duplication.
- Self-invocation guard pseudocode reproduced in Section 2 mirrors ADR-001.

---

## 7. INTEGRATION POINTS

### Framework Integration

This skill operates within the behavioral framework defined in [AGENTS.md](../../../AGENTS.md).

Key integrations:
- **Gate 2**: Skill routing via the Skill Advisor Hook (or `skill_advisor.py` fallback)
- **Tool Routing**: Per AGENTS.md Section 6 decision tree
- **Memory**: Context preserved via Spec Kit Memory MCP (`generate-context.js`)
- **Validation**: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh` for spec-folder workflows

**Tool roles**: Bash dispatches the CLI; Read/Glob/Grep validate output and probe `~/.opencode/state/` for session locks.

### Related Skills

| Skill | Integration |
|-------|-------------|
| **cli-claude-code** | Sibling — dispatch raw Claude when full project runtime is not needed |
| **cli-codex** | Sibling — dispatch Codex for code generation; cli-opencode is the bridge for spec-kit handback |
| **cli-copilot** | Sibling — dispatch Copilot for cloud-agent style execution |
| **cli-gemini** | Sibling — dispatch Gemini for Google Search grounding |
| **system-spec-kit** | Cross-AI handback target — dispatched sessions load this skill for spec-folder workflows |
| **sk-code** + `sk-code-*` overlay | Baseline+overlay code-quality contract for dispatched code review/generation; dispatched session selects overlay from stack signals (see Section 4 ALWAYS rule 12) |
| **sk-deep-research** | LEAF agent dispatched as `--agent deep-research` for parallel research iterations |
| **sk-deep-review** | LEAF agent dispatched as `--agent deep-review` for parallel review iterations |
| **mcp-code-mode** | Code Mode tools available inside the dispatched session via the project's MCP wiring |

---

## 8. RELATED RESOURCES

See Section 5 REFERENCES for the canonical reference, asset, shared, and external link list.

---
