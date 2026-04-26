---
name: cli-opencode
description: "OpenCode CLI orchestrator covering three use cases: external AI runtimes dispatching opencode run, in-OpenCode parallel detached sessions for ablation and worker farms, and cross-AI orchestration handback with full plugin, skill, and MCP runtime context."
allowed-tools: [Bash, Read, Glob, Grep]
version: 1.0.0
---

<!-- Keywords: opencode, opencode-cli, opencode-run, cross-ai, spec-kit-runtime, plugin-runtime, parallel-sessions, share-url, detached-session, agent-delegation, anthropic, openai, google, gemini -->

# OpenCode CLI Orchestrator - Full-Runtime Cross-AI Dispatch

> **CRITICAL — SELF-INVOCATION PROHIBITED**
>
> This skill dispatches to the OpenCode CLI binary (`opencode`). If the agent currently reading this skill is itself running inside OpenCode (TUI / acp / serve / run modes — detection signals listed in §2), the skill MUST refuse to load and return the documented error message instead of generating any `opencode` invocation. The only exception is an explicit "parallel detached" request that intentionally spawns a SEPARATE session with its own session id and state directory.
>
> Just as a Claude Code agent never calls cli-claude-code, an OpenCode agent never calls cli-opencode, a Codex agent never calls cli-codex, a Copilot agent never calls cli-copilot, and a Gemini agent never calls cli-gemini. The cli-X skills are for **cross-AI delegation only** — never self-invocation.

Orchestrate OpenCode's `opencode run` from external AI assistants (Claude Code, Codex, Copilot, Gemini, raw shell) AND from inside an existing OpenCode session for parallel detached workers. Three documented use cases keep the cycle risk explicit while giving every dispatch path a copy-paste invocation shape.

**Core Principle**: The calling AI stays the conductor. Delegate to OpenCode for what it does best — full plugin, skill, MCP, and Spec Kit Memory runtime in a one-shot dispatch. Validate and integrate the output.

---

<!-- ANCHOR:when-to-use -->
## 1. WHEN TO USE

### Activation Triggers

- **Full plugin / skill / MCP runtime** (use case 1) — calling AI is Claude Code / Codex / Copilot / Gemini / raw shell AND the task needs the project's full Spec Kit Memory database, CocoIndex semantic index, structural code graph, or every plugin/skill/MCP tool in a one-shot dispatch. Includes `@deep-research` / `@deep-review` agent loops with externalized state under `.opencode/specs/`.
- **Parallel detached session** (use case 2) — operator already inside OpenCode (TUI / web / serve / acp) AND wants a SEPARATE session with its own session id and state directory for ablation, worker farm, or parallel research. Prompt explicitly mentions "parallel detached", "ablation suite", "worker farm", "parallel research", "spawn detached", or "share URL".
- **Cross-AI orchestration handback** (use case 3) — calling AI is non-Anthropic (Codex / Copilot / Gemini), task targets a project-specific subsystem (spec-kit, memory, code-graph, advisor), and the non-Anthropic CLI cannot load the project's plugin/skill/MCP runtime on its own and needs OpenCode as a bridge.
- **Agent dispatch** — task matches a specialized OpenCode agent (`general`, `context`, `orchestrate`, `write`, `review`, `debug`, `deep-research`, `deep-review`, `ultra-think`, `improve-agent`).
- **Cross-repo dispatch** — session in repo A dispatches into repo B's plugin/skill/MCP runtime via `--dir <path>` or remote OpenCode server via `--attach <url>`.

### When NOT to Use

- **You ARE OpenCode already.** If your runtime is OpenCode (detection signal: `$OPENCODE_CONFIG_DIR` or any `OPENCODE_*` env var set, `opencode` in process ancestry, or `~/.opencode/state/<id>/lock` present), this skill refuses to load. Self-invocation creates a circular dispatch loop and burns tokens for no value. The cli-X family is exclusively for cross-AI delegation. The single legitimate exception is an explicit "parallel detached" request that intentionally spawns a SEPARATE session id and state directory (use case 2); without that qualifier, the smart router refuses per ADR-001.
- Simple, quick tasks where `opencode run` overhead is not worth it.
- Tasks that only need a raw model dispatch — use a sibling cli-* skill.
- Tasks requiring interactive TUI or web UI (use `opencode` directly instead of `opencode run`).
- Context already loaded and understood by the calling AI.
- Tasks where the OpenCode binary is not installed at the expected path.

---

<!-- /ANCHOR:when-to-use -->
<!-- ANCHOR:smart-routing -->
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

```python
INTENT_SIGNALS = {
    "EXTERNAL_DISPATCH":  {"weight": 4, "keywords": ["delegate to opencode", "opencode run", "from claude code", "from codex", "from gemini", "from copilot", "external runtime", "full plugin runtime"]},
    "PARALLEL_DETACHED":  {"weight": 4, "keywords": ["parallel detached", "ablation suite", "worker farm", "parallel research", "spawn detached", "share url", "share-url", "detached session"]},
    "CROSS_AI_HANDBACK":  {"weight": 4, "keywords": ["spec kit", "spec-kit", "spec_kit", "code graph", "memory_search", "session_bootstrap", "skill advisor", "cross-ai handback"]},
    "AGENT_DISPATCH":     {"weight": 4, "keywords": ["delegate", "agent", "deep-research", "deep-review", "ultra-think", "review agent", "context agent"]},
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

1. `discover_markdown_resources()` — enumerate available `.md` files under `references/` and `assets/`
2. `score_intents(task)` — keyword-weight match against `INTENT_SIGNALS`
3. `select_intents(scores, ambiguity_delta=1.0)` — top-1 or top-2 if scores within delta
4. ALWAYS-load `LOADING_LEVELS["ALWAYS"]`, then UNKNOWN-fallback if max score == 0
5. CONDITIONAL-load `RESOURCE_MAP[intent]` for each selected intent
6. ON_DEMAND-load if any `ON_DEMAND_KEYWORDS` match the task text

The `route_opencode_resources(task)` function body lives in [`shared_smart_router.md`](../system-spec-kit/references/cli/shared_smart_router.md) — substitute `<PROVIDER>` = `opencode`.

---

<!-- /ANCHOR:smart-routing -->
<!-- ANCHOR:how-it-works -->
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

**Authentication options**: `opencode auth login <provider>` for OAuth, or per-provider API key env vars (e.g. `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`) read by provider plugins at session start.

### Default Invocation (Skill Default)

**Default model + variant + agent + format + dir**: `opencode-go/deepseek-v4-pro` · `--variant high` · `--agent general` · `--format json` · `--dir <repo-root>`. The repo root pin avoids CWD ambiguity.

```bash
opencode run \
  --model opencode-go/deepseek-v4-pro \
  --agent general \
  --variant high \
  --format json \
  --dir /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public \
  "<prompt>"
```

**User override** (honor explicit user phrasing verbatim):

| User says | Resolve to |
|-----------|------------|
| (nothing specified) | `--model opencode-go/deepseek-v4-pro --agent general --variant high --format json` |
| "Use anthropic claude sonnet 4-7" | `--model anthropic/claude-sonnet-4-7 --agent general --variant high --format json` |
| "Use the deep-research agent" | `--model opencode-go/deepseek-v4-pro --agent deep-research --variant high --format json` |
| "Use openai gpt-5.5 high" | `--model openai/gpt-5.5 --agent general --variant high --format json` |
| "Spawn a parallel detached session on port 4096" | (use case 2) appends `--share --port 4096` |

### Core Invocation Pattern

```bash
opencode run "prompt" --model opencode-go/deepseek-v4-pro --agent general --variant high --format json --dir /repo 2>&1
```

| Flag / Option | Purpose |
|---------------|---------|
| `--model <provider/model>` | Provider-prefixed model selector (e.g. `opencode-go/deepseek-v4-pro`) |
| `--agent <slug>` | Agent definition from `.opencode/agent/<slug>.md` |
| `--variant <level>` | Provider-specific reasoning effort (`minimal`, `low`, `medium`, `high`, `max`) |
| `--format default \| json` | Human-readable log OR newline-delimited JSON event stream |
| `--dir <path>` | Working directory or remote-server path |
| `-c`, `--continue` | Continue the last session in this project |
| `-s`, `--session <id>` | Continue a specific session id |
| `--fork` | Fork before continuing (requires `--continue` or `--session`) |
| `--share` | Publish a shareable session URL — opt-in per CHK-033 |
| `--port <N>` | Local server port (only for parallel detached sessions) |
| `-f`, `--file <path>` | Attach file(s) to the message |
| `--thinking` | Show thinking blocks |
| `--pure` | Disable external plugins (debugging only) |
| `--print-logs` | Stream logs to stderr |
| `--log-level <level>` | DEBUG / INFO / WARN / ERROR |

> **Background dispatch in a `while read` loop**: always append `</dev/null` after the redirect when backgrounding `opencode run` inside a loop. Without it the backgrounded process inherits the loop's stdin and silently consumes the rest. See `references/integration_patterns.md` §6.

### Model Selection

| Provider | Model id | Reasoning effort range | Use case |
|----------|----------|------------------------|----------|
| opencode-go | `opencode-go/deepseek-v4-pro` (default) | `--variant` accepted; effect depends on opencode-go routing | Deep reasoning, planning, code review |
| opencode-go | `opencode-go/deepseek-v4-flash` | same | Lower-tier sibling for cost/latency |
| Anthropic | `anthropic/claude-opus-4-7` | `minimal`, `low`, `medium`, `high`, `max` | Available with `opencode auth login anthropic` |
| OpenAI | `openai/gpt-5.4` | `minimal`, `low`, `medium`, `high`, `xhigh` | Available with openai auth |
| Google | `google/gemini-2.5-pro` | `minimal`, `low`, `medium`, `high` | Available with google auth |

`opencode models <provider>` enumerates available models. The skill defaults to `opencode-go/deepseek-v4-pro --variant high` because the typical task benefits from elevated reasoning.

### OpenCode Agent Delegation

The calling AI is the conductor; OpenCode agents under `.opencode/agent/<slug>.md` pin the model, tool permissions, and system prompt.

| Task type | Agent | Invocation pattern |
|-----------|-------|---------------------|
| Default / unspecified | `general` | `opencode run --agent general --variant high --format json --dir /repo "<prompt>"` |
| Codebase exploration | `context` | `opencode run --agent context --variant high --format json --dir /repo "Map src/"` |
| Code review | `review` | `opencode run --agent review --variant high --format json --dir /repo "Review @src/auth.ts for security"` |
| Multi-strategy planning | `ultra-think` | `opencode run --agent ultra-think --variant high --format json --dir /repo "Plan auth redesign"` |
| Iterative deep research | `deep-research` | `opencode run --agent deep-research --variant high --format json --dir /repo "Iter 3 of packet 047"` |
| Iterative code review | `deep-review` | `opencode run --agent deep-review --variant high --format json --dir /repo "Iter 5 review of packet 047"` |
| Documentation | `write` | `opencode run --agent write --variant high --format json --dir /repo "Generate README"` |
| Multi-agent coordination | `orchestrate` | `opencode run --agent orchestrate --variant high --format json --dir /repo "Coordinate review + tests"` |

See [agent_delegation.md](./references/agent_delegation.md) for the complete agent roster.

### Unique OpenCode Capabilities

| Capability | Purpose | Invocation |
|------------|---------|------------|
| Full plugin / skill / MCP runtime | Dispatched session loads every project plugin, skill, MCP tool, and Spec Kit Memory | Default behavior — no special flag |
| Parallel detached sessions | Spawn separate session id + state directory + optional share URL | `opencode run --share --port <N>` |
| Structured event stream | Newline-delimited JSON events with stable schema | `--format json` |
| Agent dispatch | Pin model + tool permissions + system prompt via slug | `--agent <slug>` |
| Cross-repo dispatch | Target a different repo's runtime via path | `--dir <path>` |
| Cross-server dispatch | Attach to a remote OpenCode server | `--attach <url>` |
| Session continuation | Resume or fork a prior session | `-c` / `-s <id>` / `--fork` |
| Plugin disable for debugging | Run without plugins | `--pure` |

### Essential Commands

```bash
# 1. External runtime to OpenCode (use case 1)
opencode run \
  --model opencode-go/deepseek-v4-pro --agent general --variant high --format json \
  --dir /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public \
  "Run memory_search for 'spec kit memory health' and return top 5 results."

# 2. Parallel detached session (use case 2 — only valid from inside OpenCode)
opencode run --share --port 4096 \
  --model opencode-go/deepseek-v4-pro --agent deep-research --variant high --format json \
  --dir /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public \
  "Run iteration 3 of the deep-research loop on packet 047."

# 3. Cross-AI handback (use case 3 — Codex / Copilot / Gemini calling)
opencode run \
  --model opencode-go/deepseek-v4-pro --agent general --variant high --format json \
  --dir /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public \
  "Use system-spec-kit to validate packet 047. Return JSON validation report."

# 4. Code review with the review agent
opencode run \
  --model opencode-go/deepseek-v4-pro --agent review --variant high --format json \
  --dir /repo \
  "Review @src/auth.ts for security issues. Surface P0 / P1 with file:line evidence."

# 5. Cross-repo dispatch (Barter sibling)
opencode run \
  --model opencode-go/deepseek-v4-pro --agent general --variant high --format json \
  --dir /Users/michelkerkmeester/MEGA/Development/Code_Environment/Barter \
  "Draft a Level 1 spec for the auth refresh feature."
```

### Error Handling

| Issue | Solution |
|-------|----------|
| `command not found: opencode` | Install via `brew install opencode` (macOS) or the standalone installer |
| Self-invocation refused | Use a sibling cli-* skill OR a fresh shell session OR add explicit "parallel detached" keywords to the prompt |
| `provider/model not found` | Run `opencode providers` to enumerate; `auth login <provider>` if needed |
| `unknown option --variant` | Version drift — see `references/cli_reference.md` §9 |
| Empty event stream | Pass `--format json` and parse line-delimited events |
| Background dispatch hangs | Add `</dev/null` to background invocations inside `while read` loops |
| `--share` URL leaks secrets | Operator MUST confirm before passing `--share` (CHK-033) |
| Plugin load crash | Rerun with `--pure` to bypass plugins; surface the underlying issue |
| Session never finishes | Inspect `~/.opencode/state/<session_id>/messages.jsonl` for the last tool call |

---

<!-- /ANCHOR:how-it-works -->
<!-- ANCHOR:rules -->
## 4. RULES

### ALWAYS

1. Verify OpenCode CLI is installed before first invocation; confirm version baseline against v1.3.17 (drift handling per `references/cli_reference.md` §9).
2. **Run the self-invocation guard before dispatch** (ADR-001): Layer 1 env-var lookup for any `OPENCODE_*`, Layer 2 process-ancestry probe for `opencode` parent, Layer 3 `~/.opencode/state/<id>/lock` probe. Trip on ANY positive — refuse unless prompt has explicit parallel-session keywords.
3. Pin model + agent + variant + format + dir explicitly. Default: `--model opencode-go/deepseek-v4-pro --agent general --variant high --format json --dir <repo-root>`. Honor user overrides verbatim.
4. Pass `--format json` unless the calling AI explicitly wants formatted output — JSON event stream is what external runtimes parse incrementally.
5. Append `</dev/null` when backgrounding `opencode run` inside `while read` loops (otherwise stdin is silently consumed).
6. **Pass the spec folder to the dispatched session** in the prompt: if the calling AI has an active Gate-3 spec folder, include `Spec folder: <path> (pre-approved, skip Gate 3)`. If none, ASK the user before delegating — the dispatched session cannot answer Gate 3 interactively in non-interactive `run` mode.
7. **Load `assets/prompt_quality_card.md` before building any dispatch prompt.** Apply the CLEAR 5-question check, tag the framework in the Bash invocation comment, and use the returned `ENHANCED_PROMPT`. If complexity ≥ 7/10 or compliance/security signals appear, dispatch `@improve-prompt` via the Task tool first.
8. Validate dispatched session output: parse JSON events incrementally (tool calls, partial messages, final summary), run syntax checks if code generated, cross-reference against project standards (sk-code-review, sk-code-opencode).
9. Capture stderr (`2>&1`) to catch tool errors and warnings.
10. Classify the use case (1 / 2 / 3) before dispatching — the smart router refuses dispatches that do not map to one of the three.

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

<!-- /ANCHOR:rules -->
<!-- ANCHOR:references -->
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

<!-- /ANCHOR:references -->
<!-- ANCHOR:success-criteria -->
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

<!-- /ANCHOR:success-criteria -->
<!-- ANCHOR:integration-points -->
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
| **sk-doc** | Doc generation in dispatched `@write` agent runs |
| **sk-code-opencode** | Code-quality enforcement in dispatched code review or generation runs |
| **sk-deep-research** | LEAF agent dispatched as `--agent deep-research` for parallel research iterations |
| **sk-deep-review** | LEAF agent dispatched as `--agent deep-review` for parallel review iterations |
| **mcp-code-mode** | Code Mode tools available inside the dispatched session via the project's MCP wiring |

---

<!-- /ANCHOR:integration-points -->
<!-- ANCHOR:related-resources -->
## 8. RELATED RESOURCES

See Section 5 REFERENCES for the canonical reference, asset, shared, and external link list.

---

<!-- /ANCHOR:related-resources -->
