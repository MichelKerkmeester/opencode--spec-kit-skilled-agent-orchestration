---
title: "OpenCode CLI - Integration Patterns and Use Cases"
description: "The three documented use cases for cli-opencode (external runtime to OpenCode, in-OpenCode parallel detached session, cross-AI orchestration handback) with copy-paste prompt templates, smart-router signals, and the self-invocation guard decision tree."
---

# OpenCode CLI - Integration Patterns

How cli-opencode positions itself relative to the four sibling cli-* skills, the three documented use cases (per ADR-002), the smart-router decision tree that picks between them, and the self-invocation guard that protects against circular dispatch (per ADR-001).

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

The four sibling cli-* skills exist because their target binaries are external runtimes — Claude Code, Codex, Copilot, Gemini do not own this repo. OpenCode owns this repo. A naive "delegate to opencode" skill makes no sense for an in-OpenCode operator (it would create a circular dispatch).

cli-opencode resolves this by documenting THREE orthogonal use cases. The smart router selects between them based on the calling AI's runtime context.

| Use case | Calling runtime | Target | Self-invocation? |
|----------|-----------------|--------|------------------|
| 1. External runtime to OpenCode | Claude Code, Codex, Copilot, Gemini, raw shell | OpenCode for full plugin / skill / MCP runtime | No |
| 2. In-OpenCode parallel detached session | OpenCode itself (TUI / web / serve / acp) | New OpenCode session via `--share --port N` | No (different session id) |
| 3. Cross-AI orchestration handback | Codex / Copilot / Gemini | OpenCode for spec-kit specific workflows | No |

The cycle ADR-001 protects against is the operator inside OpenCode asking cli-opencode to "delegate this exact prompt to OpenCode" — that case is REFUSED at the routing layer.

<!-- /ANCHOR:overview -->

<!-- ANCHOR:use-case-1 -->
## 2. USE CASE 1 — EXTERNAL RUNTIME TO OPENCODE

### When to use

The calling AI is Claude Code, Codex, Copilot, Gemini, or a raw shell. The task needs the project's full plugin / skill / MCP / Spec Kit Memory runtime — not just a raw model dispatch. Examples:

- Run `memory_search` against the project's spec-doc database
- Call CocoIndex for semantic code search across the repo
- Dispatch a `@deep-research` or `@deep-review` agent loop with externalized state
- Run a sub-agent that needs Spec Kit Memory for continuity across iterations

### Smart-router signal

ADR-001's detection signal does NOT trip (no OPENCODE_* env var, no opencode parent process, no live state lock).

### Prompt template

```text
You are dispatching from <calling-runtime> into a fresh OpenCode session via cli-opencode.

Goal: <one-sentence goal>

Context:
- Spec folder: <path> (pre-approved, skip Gate 3)
- Plugins / skills required: <list>
- MCP tools required: <list>

Constraints:
- <list>

Success criteria:
- <list>

Memory epilogue: include MEMORY_HANDBACK delimiters at the end of the response so the calling runtime can preserve context.
```

### Invocation shape

```bash
opencode run \
  --model github-copilot/gpt-5.4 \
  --agent general \
  --variant high \
  --format json \
  --dir /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public \
  "<prompt-from-template>" 2>&1
```

### Why it matters

This is the canonical cross-AI dispatch path. It gives external runtimes a one-shot bridge into the project's full runtime without forcing the operator to leave their host session.

<!-- /ANCHOR:use-case-1 -->

<!-- ANCHOR:use-case-2 -->
## 3. USE CASE 2 — IN-OPENCODE PARALLEL DETACHED SESSION

### When to use

The operator is already inside an OpenCode session (TUI, web, serve, acp). They want a SEPARATE OpenCode session — not a continuation, not a fork — to run an ablation suite, a worker farm, or a parallel research sweep. The new session has its own session id, its own state directory, and an optional share URL.

### Smart-router signal

ADR-001's detection signal trips (in-OpenCode runtime). The router checks the prompt for explicit parallel-session keywords:

- "parallel detached session"
- "ablation suite"
- "worker farm"
- "parallel research"
- "spawn detached"
- "share URL"

If at least one of these phrases appears AND the prompt does NOT request "delegate this exact prompt", the router permits the dispatch with `--share --port <N>`.

### Prompt template

```text
You are spawning a parallel detached OpenCode session for <purpose>.

Goal: <one-sentence goal>

Context:
- Spec folder: <path> (pre-approved, skip Gate 3)
- Iteration N of <total>
- State file: <path>

Constraints:
- This session must NOT modify the parent session's state.
- Write results to <state file path>.
- Publish a share URL only if the operator confirmed (CHK-033).

Success criteria:
- <list>
```

### Invocation shape

```bash
opencode run \
  --share \
  --port 4096 \
  --model opencode-go/deepseek-v4-pro \
  --agent deep-research \
  --variant high \
  --format json \
  --dir /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public \
  "<prompt-from-template>" 2>&1
```

### Why it matters

Parallel research, ablation studies, and worker farms need N concurrent sessions. Each must be independent. The detached pattern makes this possible without leaking state between sessions.

### Operator confirmation for share URLs

Per CHK-033, the calling AI MUST confirm with the operator before passing `--share`. The share URL exposes the session's contents to anyone with the URL, so it is opt-in.

<!-- /ANCHOR:use-case-2 -->

<!-- ANCHOR:use-case-3 -->
## 4. USE CASE 3 — CROSS-AI ORCHESTRATION HANDBACK

### When to use

The calling AI is a non-Anthropic CLI (Codex, Copilot, Gemini). The task requires OpenCode-specific plugins or skills (e.g. spec-kit workflows, the Spec Kit Memory MCP database, the structural code graph). The non-Anthropic CLI cannot load the project's plugins on its own — cli-opencode is the documented bridge.

### Smart-router signal

ADR-001's detection signal does NOT trip (the calling AI is Codex / Copilot / Gemini, not OpenCode). The prompt mentions a project-specific subsystem:

- "spec kit" / "spec-kit" / "spec_kit"
- "spec kit memory"
- "code graph"
- "skill advisor"
- "session bootstrap"

When the calling AI is non-Anthropic AND a project-specific subsystem is named, this use case is selected over use case 1 (which is the more general path).

### Prompt template

```text
You are dispatching from <calling-runtime> into OpenCode for a spec-kit-specific workflow.

Goal: <one-sentence goal>

Context:
- Spec folder: <path> (pre-approved, skip Gate 3)
- Subsystem: <spec-kit / memory / code-graph / advisor>
- Operation: <save / search / query / scan / validate>

Constraints:
- The OpenCode session MUST load the system-spec-kit skill for this dispatch.
- All MCP calls go through the project's local MCP servers.

Success criteria:
- <list>

Memory epilogue: include MEMORY_HANDBACK delimiters at the end so the calling runtime can preserve context.
```

### Invocation shape

```bash
opencode run \
  --model github-copilot/gpt-5.4 \
  --agent general \
  --variant high \
  --format json \
  --dir /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public \
  "<prompt-from-template>" 2>&1
```

The invocation shape is identical to use case 1 — the difference is the prompt content, which targets a project-specific subsystem.

### Why it matters

Codex, Copilot, and Gemini cannot load this project's plugin / skill / MCP runtime on their own. cli-opencode is the documented bridge that lets a Codex-led orchestration call into the project's spec-kit workflows without leaving the Codex session.

<!-- /ANCHOR:use-case-3 -->

<!-- ANCHOR:decision-tree -->
## 5. SMART-ROUTER DECISION TREE

The skill's smart router picks between the three use cases (or refuses) using this decision tree:

```text
INPUT: prompt + calling runtime
                |
                v
[ADR-001 SELF-INVOCATION GUARD]
- Layer 1: env var lookup (any OPENCODE_* env var present?)
- Layer 2: process ancestry (opencode in parent process tree?)
- Layer 3: state lock-file probe (~/.opencode/state/<id>/lock present?)
                |
        +-------+-------+
        |               |
       NO              YES
        |               |
        v               v
[CALLING RUNTIME]   [PROMPT KEYWORDS]
        |               |
   +----+----+    +-----+-----+
   |         |    |           |
Anthropic  Other  parallel   self-dispatch
(Claude    (Codex words    only
Code)      Copilot
           Gemini)         |           |
   |         |             v           v
   v         v        USE CASE 2   REFUSE
USE CASE  [PROJECT     (in-       (cycle —
1         SUBSYSTEM    OpenCode   surface
(external NAMED?]      parallel)  ADR-001
to                      |          error)
OpenCode)        +------+------+
                 |             |
                YES            NO
                 |             |
                 v             v
             USE CASE 3     USE CASE 1
             (cross-AI      (external
             handback)      to OpenCode)
```

### Refusal message

When the router hits the REFUSE leaf, it surfaces this exact message:

```text
ERROR: cli-opencode self-invocation refused.

You are already inside OpenCode (signal: <env|ancestry|lockfile> tripped).
Asking cli-opencode to delegate this exact prompt back to OpenCode would create
a circular dispatch.

Options:
1. Use a sibling cli-* skill (cli-claude-code, cli-codex, cli-copilot, cli-gemini)
   to dispatch a different model.
2. Open a fresh shell session (no OpenCode parent) and re-run from there.
3. If you wanted a parallel detached session (different session id, separate
   state directory), restate the request with explicit "parallel detached" /
   "ablation suite" / "worker farm" / "share URL" keywords — that triggers
   use case 2 instead of refusal.
```

<!-- /ANCHOR:decision-tree -->

<!-- ANCHOR:silent-stdin -->
## 6. SILENT STDIN CONSUMPTION (BACKGROUND DISPATCH)

When dispatching `opencode run` in the background inside a `while read` loop, the same trap that affects cli-codex applies: the backgrounded process inherits the loop's stdin and silently consumes the remaining input.

### Failure pattern

```bash
# WRONG — background opencode silently consumes the rest of input.jsonl
while IFS= read -r line; do
  opencode run --format json "<prompt>" > "$LOG" 2>&1 &
done < input.jsonl
```

The first iteration spawns `opencode run`. The backgrounded process inherits the loop's stdin and reads the rest of `input.jsonl`. The loop exits after one or two iterations with no error.

### Fix

```bash
# CORRECT — redirect background opencode stdin from /dev/null
while IFS= read -r line; do
  opencode run --format json "<prompt>" > "$LOG" 2>&1 </dev/null &
done < input.jsonl
```

The `</dev/null` redirect prevents the backgrounded process from consuming the loop's stdin. This pattern is required for any cli-opencode background dispatch inside a read loop.

<!-- /ANCHOR:silent-stdin -->

<!-- ANCHOR:memory-handback -->
## 7. MEMORY HANDBACK

cli-opencode dispatches that produce evidence for a Spec Kit Memory save MUST include the Memory Epilogue at the end of the prompt. The dispatched session adds `MEMORY_HANDBACK_START` / `MEMORY_HANDBACK_END` delimiters around a structured JSON payload that the calling AI extracts and feeds to `generate-context.js`.

The full Memory Handback Protocol is shared with cli-claude-code and cli-codex. See SKILL.md Section 4 (RULES) for the canonical 7-step procedure. The same JSON normalization (camelCase / snake_case aliases) and post-010 save gates apply.

<!-- /ANCHOR:memory-handback -->

<!-- ANCHOR:related -->
## 8. RELATED RESOURCES

- `./cli_reference.md` - Full subcommand and flag reference
- `./opencode_tools.md` - Unique value props vs sibling cli-* skills
- `./agent_delegation.md` - Agent routing matrix
- `../assets/prompt_templates.md` - Copy-paste templates per use case
- `../SKILL.md` - Skill entry point and smart router pseudocode

<!-- /ANCHOR:related -->
