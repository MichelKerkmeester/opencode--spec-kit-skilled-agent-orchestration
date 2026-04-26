---
name: cli-opencode
description: "OpenCode CLI orchestrator for external AI runtimes and detached sessions to invoke opencode run with full plugin, skill, and MCP runtime context."
allowed-tools: [Bash, Read, Glob, Grep]
version: 1.0.0
---

<!-- Keywords: opencode, opencode-cli, opencode-run, cross-ai, spec-kit-runtime, plugin-runtime, parallel-sessions, share-url, detached-session, agent-delegation, anthropic, openai, google, gemini -->

# OpenCode CLI Orchestrator - Full-Runtime Cross-AI Dispatch

Orchestrate OpenCode's `opencode run` from external AI assistants (Claude Code, Codex, Copilot, Gemini, raw shell) AND from inside an existing OpenCode session for parallel detached workers. Three documented use cases keep the cycle risk explicit while giving every dispatch path a copy-paste invocation shape.

**Core Principle**: The calling AI stays the conductor. Delegate to OpenCode for what it does best — full plugin, skill, MCP, and Spec Kit Memory runtime in a one-shot dispatch. Validate and integrate the output.

---

<!-- ANCHOR:when-to-use -->
## 1. WHEN TO USE

### Activation Triggers

**Full plugin / skill / MCP runtime** — Use when:
- The calling AI is Claude Code / Codex / Copilot / Gemini / raw shell AND the task needs the project's full Spec Kit Memory database, CocoIndex semantic index, or structural code graph
- A one-shot dispatch must load every plugin, skill, and MCP tool the project configures
- A `@deep-research` or `@deep-review` agent loop needs externalized state under the project's `.opencode/specs/` tree

**Parallel detached session** — Use when:
- The operator is already inside OpenCode (TUI / web / serve / acp) AND wants a SEPARATE session with its own session id and state directory for ablation, worker farm, or parallel research
- The prompt explicitly mentions "parallel detached", "ablation suite", "worker farm", "parallel research", "spawn detached", or "share URL"

**Cross-AI orchestration handback** — Use when:
- The calling AI is a non-Anthropic CLI (Codex / Copilot / Gemini) AND the task targets a project-specific subsystem (spec-kit, memory, code-graph, advisor)
- The non-Anthropic CLI cannot load the project's plugin / skill / MCP runtime on its own and needs OpenCode as a bridge

**Agent dispatch** — Use when:
- The task matches a specialized OpenCode agent (`general`, `context`, `orchestrate`, `write`, `review`, `debug`, `deep-research`, `deep-review`, `ultra-think`, `improve-agent`)
- The dispatched session benefits from the agent's pinned model, tool permissions, and system prompt

**Cross-repo dispatch** — Use when:
- A session in repo A needs to dispatch into repo B's plugin / skill / MCP runtime via `--dir <path>`
- A remote OpenCode server's path needs to be targeted via `--attach <url>` plus `--dir`

### When NOT to Use

- **Self-invocation guard**: If you are already running inside OpenCode AND the prompt requests "delegate this exact prompt to OpenCode" (no "parallel detached" qualifier), do NOT use this skill. The smart router REFUSES self-invocation per ADR-001 to prevent circular dispatch. Detection: any `OPENCODE_*` env var present, opencode in process ancestry, OR a live `~/.opencode/state/<id>/lock` file.
- Simple, quick tasks where `opencode run` overhead is not worth it
- Tasks that only need a raw model dispatch — use a sibling cli-* skill (cli-claude-code, cli-codex, cli-copilot, cli-gemini)
- Tasks that require interactive TUI or web UI (use `opencode` directly instead of `opencode run`)
- Context already loaded and understood by the calling AI
- Tasks where the OpenCode binary is not installed at the expected path

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
    """Three-layer detection. Trip on ANY positive."""
    # Layer 1: env var lookup
    for key in os.environ:
        if key.startswith('OPENCODE_'):
            return ('env', key)
    # Layer 2: process ancestry
    try:
        ancestry = subprocess.check_output(
            ['ps', '-o', 'command=', '-p', str(os.getppid())]
        ).decode()
        if '/opencode' in ancestry or 'opencode ' in ancestry:
            return ('ancestry', 'opencode')
    except subprocess.SubprocessError:
        pass
    # Layer 3: lock file
    state_dir = os.path.expanduser('~/.opencode/state')
    if os.path.isdir(state_dir):
        for entry in os.listdir(state_dir):
            if os.path.exists(os.path.join(state_dir, entry, 'lock')):
                return ('lockfile', entry)
    return None

if detect_self_invocation():
    if not has_parallel_session_keywords(prompt):
        refuse('You are already inside OpenCode; '
               'use a sibling cli-* skill or a fresh shell session '
               'to dispatch a different model. '
               'For a parallel detached session, restate with explicit '
               'parallel-session keywords.')
```

### Phase Detection

```text
TASK CONTEXT
    |
    +- STEP 0: Verify opencode CLI installed + check self-invocation guard
    +- STEP 1: Score intents (top-2 when ambiguity is small)
    +- STEP 2: Map intents to one of the 3 documented use cases
    +- Phase 1: Construct prompt with model + agent + variant + format + dir
    +- Phase 2: Execute via Bash tool (with </dev/null in background loops)
    +- Phase 3: Parse JSON event stream, extract MEMORY_HANDBACK, integrate
```

### Resource Domains

The router discovers markdown resources recursively from `references/` and `assets/` and then applies intent scoring from `INTENT_SIGNALS`.

```text
references/cli_reference.md          — CLI subcommands, flags, models, version drift
references/integration_patterns.md   — 3 use cases + decision tree + self-invocation guard
references/opencode_tools.md         — Unique value props vs sibling cli-* skills
references/agent_delegation.md       — Agent routing matrix and patterns
assets/prompt_templates.md           — Copy-paste templates per use case
assets/prompt_quality_card.md        — Framework-per-task selector, CLEAR 5-check
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
    "ALWAYS": [DEFAULT_RESOURCE, "assets/prompt_quality_card.md"],
    "ON_DEMAND_KEYWORDS": ["full reference", "all templates", "deep dive", "complete guide", "opencode agent", "opencode prompt", "share url", "ablation", "worker farm", "self-invocation", "memory handback"],
    "ON_DEMAND": ["references/opencode_tools.md", "assets/prompt_templates.md"],
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Is the user asking about OpenCode CLI specifically?",
    "Does the task need the project's full plugin / skill / MCP runtime?",
    "Is a parallel detached session what they want?",
    "Is a non-Anthropic CLI handing back to OpenCode for a spec-kit workflow?",
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
        return ["UNKNOWN"]
    selected = [ranked[0][0]]
    if len(ranked) > 1 and ranked[1][1] > 0 and (ranked[0][1] - ranked[1][1]) <= ambiguity_delta:
        selected.append(ranked[1][0])
    return selected[:max_intents]

def route_opencode_resources(task):
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
        return {
            "intents": ["UNKNOWN"],
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

OpenCode CLI must be installed and a provider must be authenticated:

```bash
# Verify installation (cli-opencode v1.0.0 is pinned to opencode v1.3.17)
opencode --version | grep -q '^1\.' || echo "Not installed or version drift. See references/cli_reference.md §9."

# SELF-INVOCATION GUARD
env | grep -q '^OPENCODE_' && echo "ERROR: Already inside OpenCode session"

# Authentication — providers are configured via opencode providers (alias auth)
opencode providers
```

**Authentication options**: `opencode auth login <provider>` for OAuth flows, or per-provider API key env vars (e.g. `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`) that the provider plugins read at session start.

### Default Invocation (Skill Default)

**Default model + variant + agent + format + dir**: `anthropic/claude-opus-4-7` · `--variant high` · `--agent general` · `--format json` · `--dir <repo-root>`.

When the caller does not specify a model, agent, or variant, dispatch with these defaults. The repo root pin (`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`) avoids CWD ambiguity.

```bash
opencode run \
  --model anthropic/claude-opus-4-7 \
  --agent general \
  --variant high \
  --format json \
  --dir /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public \
  "<prompt>"
```

**User override**: The caller MAY override the default by stating the model, agent, or variant. Honor explicit user phrasing verbatim.

| User says | Resolve to |
|-----------|------------|
| (nothing specified) | `--model anthropic/claude-opus-4-7 --agent general --variant high --format json` |
| "Use anthropic claude sonnet 4-7" | `--model anthropic/claude-sonnet-4-7 --agent general --variant high --format json` |
| "Use the deep-research agent" | `--model anthropic/claude-opus-4-7 --agent deep-research --variant high --format json` |
| "Use openai gpt-5.5 high" | `--model openai/gpt-5.5 --agent general --variant high --format json` |
| "Spawn a parallel detached session on port 4096" | (use case 2) appends `--share --port 4096` |

### Core Invocation Pattern

All non-interactive OpenCode CLI calls use the `run` subcommand:

```bash
opencode run "prompt" --model anthropic/claude-opus-4-7 --agent general --variant high --format json --dir /repo 2>&1
```

| Flag / Option | Purpose |
|---------------|---------|
| `--model <provider/model>` | Provider-prefixed model selector (e.g. `anthropic/claude-opus-4-7`) |
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
| Anthropic | `anthropic/claude-opus-4-7` (default) | `minimal`, `low`, `medium`, `high`, `max` | Deep reasoning, planning, code review |
| Anthropic | `anthropic/claude-sonnet-4-7` | same | Balanced cost / depth |
| Anthropic | `anthropic/claude-haiku-4-5` | same | Fast classification, cheap batch ops |
| OpenAI | `openai/gpt-5.5` | `minimal`, `low`, `medium`, `high`, `xhigh` | Codex-style code generation |
| Google | `google/gemini-2.5-pro` | `minimal`, `low`, `medium`, `high` | Web research, long context |

`opencode models <provider>` enumerates available models. The skill defaults to `anthropic/claude-opus-4-7 --variant high` for cross-AI dispatches because the typical task benefits from elevated reasoning.

### OpenCode Agent Delegation

The calling AI acts as the **conductor** that delegates tasks to OpenCode CLI. OpenCode has specialized agents under `.opencode/agent/<slug>.md` that pin the model, tool permissions, and system prompt.

**Agent routing table**:

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

**Orchestration principle**: The calling AI decides WHAT to delegate. The OpenCode agent's frontmatter shapes HOW the dispatched session processes it. The calling AI always validates and integrates the output.

See [agent_delegation.md](./references/agent_delegation.md) for the complete agent roster and invocation patterns.

### Unique OpenCode Capabilities

These capabilities are exclusive to `opencode run` or provide a meaningfully different workflow than the four sibling cli-* skills:

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
  --model anthropic/claude-opus-4-7 --agent general --variant high --format json \
  --dir /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public \
  "Run memory_search for 'spec kit memory health' and return top 5 results."

# 2. Parallel detached session (use case 2 — only valid from inside OpenCode)
opencode run --share --port 4096 \
  --model anthropic/claude-opus-4-7 --agent deep-research --variant high --format json \
  --dir /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public \
  "Run iteration 3 of the deep-research loop on packet 047."

# 3. Cross-AI handback (use case 3 — Codex / Copilot / Gemini calling)
opencode run \
  --model anthropic/claude-opus-4-7 --agent general --variant high --format json \
  --dir /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public \
  "Use system-spec-kit to validate packet 047. Return JSON validation report."

# 4. Code review with the review agent
opencode run \
  --model anthropic/claude-opus-4-7 --agent review --variant high --format json \
  --dir /repo \
  "Review @src/auth.ts for security issues. Surface P0 / P1 with file:line evidence."

# 5. Cross-repo dispatch (Barter sibling)
opencode run \
  --model anthropic/claude-opus-4-7 --agent general --variant high --format json \
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

**ALWAYS do these without asking:**

1. **ALWAYS verify OpenCode CLI is installed** before first invocation
   - Run `command -v opencode` and handle missing installation gracefully
   - Confirm version baseline against v1.3.17 — drift handled per `references/cli_reference.md` §9

2. **ALWAYS run the self-invocation guard** before dispatch (ADR-001)
   - Layer 1: env var lookup for any `OPENCODE_*` variable
   - Layer 2: process ancestry probe for `opencode` parent
   - Layer 3: `~/.opencode/state/<id>/lock` file probe
   - Trip on ANY positive — refuse unless prompt has explicit parallel-session keywords

3. **ALWAYS pin the model + agent + variant + format + dir** explicitly
   - Default: `--model anthropic/claude-opus-4-7 --agent general --variant high --format json --dir <repo-root>`
   - Honor user overrides verbatim (e.g. "use anthropic sonnet" -> `anthropic/claude-sonnet-4-7`)

4. **ALWAYS pass `--format json`** unless the calling AI explicitly wants formatted output
   - JSON event stream is what external runtimes parse incrementally

5. **ALWAYS append `</dev/null`** when backgrounding `opencode run` in a `while read` loop
   - Without it the backgrounded process consumes the loop's stdin and silently exits early
   - See `references/integration_patterns.md` §6

6. **ALWAYS pass the spec folder to the dispatched session** in the prompt
   - If the calling AI has an active spec folder (from Gate 3), include `Spec folder: <path> (pre-approved, skip Gate 3)` in the prompt
   - If the calling AI does NOT have a spec folder, ask the user BEFORE delegating — the dispatched session cannot answer Gate 3 interactively in non-interactive `run` mode

7. **ALWAYS load `assets/prompt_quality_card.md` before building any dispatch prompt**
   - Apply the CLEAR 5-question check from the card
   - Tag the selected framework in the Bash invocation comment
   - If complexity is `>= 7/10` or compliance / security signals appear, dispatch `@improve-prompt` via the Task tool first
   - Use the returned `ENHANCED_PROMPT` as the final OpenCode prompt

8. **ALWAYS validate dispatched session output** before applying to the project
   - Parse JSON events incrementally — surface tool calls, partial messages, the final summary
   - Run syntax checks if code was generated
   - Cross-reference against the project's standards (sk-code-review, sk-code-opencode)

9. **ALWAYS capture stderr** with `2>&1` to catch tool errors and warnings

10. **ALWAYS classify the use case** before dispatching
    - Use case 1: external runtime to OpenCode
    - Use case 2: in-OpenCode parallel detached session
    - Use case 3: cross-AI handback for spec-kit-specific workflows
    - The smart router refuses dispatches that do not map to one of the three cases

### NEVER

**NEVER do these:**

1. **NEVER invoke this skill from within OpenCode itself for a self-dispatch**
   - If you ARE OpenCode AND the prompt requests "delegate this exact prompt to OpenCode", REFUSE with the documented error message
   - Use a sibling cli-* skill OR a fresh shell session OR add explicit parallel-session keywords

2. **NEVER pass `--share` without operator confirmation** (CHK-033)
   - The share URL exposes session contents — opt-in only

3. **NEVER trust dispatched session output blindly** for security-sensitive code
   - Always review for XSS, injection, hardcoded secrets, eval() calls

4. **NEVER send sensitive data** (API keys, passwords, credentials) in prompts
   - The dispatched session transmits prompts to the configured provider's API

5. **NEVER use `--pure` outside of plugin debugging**
   - Disabling plugins removes the entire point of the cli-opencode dispatch (full plugin / skill / MCP runtime)

6. **NEVER hammer the API** with rapid sequential calls
   - Respect provider rate limits; use background dispatch with `</dev/null` for batch work

7. **NEVER nest `opencode run` inside a dispatched session's tool calls**
   - Use OpenCode's native Task tool for sub-agent dispatch, not nested CLI invocations

### ESCALATE IF

**Ask user when:**

1. **ESCALATE IF OpenCode CLI is not installed** and user has not acknowledged
   - Provide installation command: `brew install opencode` (macOS) or `curl -fsSL https://opencode.ai/install | bash`

2. **ESCALATE IF the operator wants to publish a `--share` URL**
   - The URL exposes session contents — get explicit operator confirmation per CHK-033

3. **ESCALATE IF the binary version differs from the v1.3.17 baseline**
   - Run `opencode --version` and `opencode run --help` to inspect drift
   - Surface drift in the calling AI's response and either fall back or require operator approval

4. **ESCALATE IF the smart router cannot map the prompt to one of the three use cases**
   - Surface the disambiguation checklist from the UNKNOWN_FALLBACK lane

5. **ESCALATE IF the self-invocation guard trips AND the prompt is ambiguous**
   - Surface the refusal message with the three remediation options (sibling cli-* / fresh shell / parallel-session keywords)

### Memory Handback Protocol

When the calling AI needs to preserve session context from an OpenCode CLI delegation:

1. **Include epilogue**: Append the Memory Epilogue template (see `assets/prompt_templates.md` §14) to the delegated prompt
2. **Extract section**: After receiving the dispatched output, extract the `MEMORY_HANDBACK` section using: `/<!-- MEMORY_HANDBACK_START -->([\s\S]*?)<!-- MEMORY_HANDBACK_END -->/`
3. **Convert to structured JSON**: Build the JSON-primary payload that `generate-context.js` documents. Use `specFolder`, `user_prompts`, `observations`, and `recent_context` as the canonical field names. Add `FILES`, `sessionSummary`, `keyDecisions`, `nextSteps`, `triggerPhrases`, `toolCalls`, `exchanges`, `preflight`, and `postflight` when the dispatched run produced that evidence.
4. **Redact and scrub**: Remove secrets, tokens, credentials before writing the JSON file
5. **Choose a structured-input mode**: Save the scrubbed payload to `/tmp/save-context-data-<session-id>.json`, pipe it with `--stdin`, or pass it inline with `--json`
6. **Invoke generate-context.js**: Use one of:
   - `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data-<session-id>.json [spec-folder]`
   - `printf '%s' "$JSON_PAYLOAD" | node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --stdin [spec-folder]`
   - `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json "$JSON_PAYLOAD" [spec-folder]`
7. **Index**: Run `memory_index_scan({ specFolder })` for immediate MCP visibility

**Delimiter missing**: If output lacks `MEMORY_HANDBACK` delimiters, the calling AI manually constructs the structured JSON payload. The save flow normalizes `nextSteps` or `next_steps`; the first entry persists as `Next: ...` and drives `NEXT_ACTION`, remaining entries persist as `Follow-up: ...`.

**Structured JSON only**: Direct spec-folder-only invocation is no longer supported. Always call `generate-context.js` with `--stdin`, `--json`, or a JSON temp file.

**Compatibility aliases**: The normalizer accepts documented camelCase / snake_case pairs (`sessionSummary` / `session_summary`, `nextSteps` / `next_steps`, `userPrompts` / `user_prompts`, `recentContext` / `recent_context`). Prefer the canonical field names in new payloads.

**Minimum payload guidance**: Include a specific `sessionSummary`, at least one meaningful `recent_context` entry, and rich `FILES` entries with a descriptive `DESCRIPTION`. Add `ACTION`, `MODIFICATION_MAGNITUDE`, and `_provenance` when known.

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

### Reference Loading Notes

- Load only references needed for current intent
- Keep Smart Routing (Section 2) as the single routing authority
- `cli_reference.md` and `prompt_quality_card.md` are ALWAYS loaded as baseline

---

<!-- /ANCHOR:references -->
<!-- ANCHOR:success-criteria -->
## 6. SUCCESS CRITERIA

### Task Completion

- OpenCode CLI invoked with the correct subcommand, flags, model, agent, variant, format, and dir
- Self-invocation guard checked before dispatch — refused when appropriate
- Use case (1 / 2 / 3) classified explicitly before invocation
- JSON event stream captured, parsed incrementally, validated, integrated
- No security vulnerabilities introduced from generated code
- `--share` URLs opt-in with operator confirmation per CHK-033
- Background dispatches in `while read` loops include `</dev/null` redirect
- Memory Handback extracted and saved through `generate-context.js` when applicable

### Skill Quality

- SKILL.md within the ~450-650 LOC sibling band
- All 8 sections present with proper anchor comments
- Smart routing covers all intent signals with UNKNOWN_FALLBACK
- Reference files provide deep-dive content without duplication
- Self-invocation guard pseudocode reproduced in Section 2 mirrors ADR-001

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

### Tool Usage

| Tool | Purpose |
|------|---------|
| **Bash** | Execute `opencode run` commands |
| **Read** | Examine event-stream output files and dispatched session artifacts |
| **Glob** | Find generated files |
| **Grep** | Search within generated output and `~/.opencode/state/` for session lock probes |

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

### External Tools

**OpenCode CLI** (required):
- Installation: `brew install opencode` (macOS) or `curl -fsSL https://opencode.ai/install | bash`
- Authentication: per-provider via `opencode auth login <provider>` or env vars (`ANTHROPIC_API_KEY`, etc.)
- Purpose: Core execution engine for all delegated tasks
- Fallback: Skill informs user of installation steps if missing

---

<!-- /ANCHOR:integration-points -->
<!-- ANCHOR:related-resources -->
## 8. RELATED RESOURCES

### Reference Files
- [cli_reference.md](./references/cli_reference.md) - Full subcommand and flag reference
- [integration_patterns.md](./references/integration_patterns.md) - Three use cases, decision tree, self-invocation
- [opencode_tools.md](./references/opencode_tools.md) - Unique capabilities and comparison vs siblings
- [agent_delegation.md](./references/agent_delegation.md) - Agent roster, routing matrix, leaf constraints

### Templates
- [prompt_templates.md](./assets/prompt_templates.md) - 13 templates: 3 use cases + agents + handback
- [prompt_quality_card.md](./assets/prompt_quality_card.md) - CLEAR check and framework selection

### Related Skills
- `cli-claude-code` - Anthropic Claude Code CLI for raw model dispatch
- `cli-codex` - OpenAI Codex CLI for code generation and sandboxed execution
- `cli-copilot` - GitHub Copilot CLI for cloud-agent-style dispatches
- `cli-gemini` - Google Gemini CLI for Google Search grounding
- `system-spec-kit` - Spec folder workflow + Spec Kit Memory (cross-AI handback target)
- `sk-doc` - Documentation generation that the @write agent dispatches into
- `sk-deep-research` - Iterative research loop (dispatched via `--agent deep-research`)
- `sk-deep-review` - Iterative review loop (dispatched via `--agent deep-review`)

### External
- [OpenCode GitHub](https://github.com/sst/opencode) - Official repository
- [OpenCode Install](https://opencode.ai/install) - Standalone installer entry point
- [OpenCode Documentation](https://opencode.ai/docs) - Official docs

---

<!-- /ANCHOR:related-resources -->
