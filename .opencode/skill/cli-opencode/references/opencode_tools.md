---
title: "OpenCode CLI - Unique Capabilities and Comparison"
description: "Documents the value props that distinguish opencode run from raw model dispatch — full plugin/skill/MCP runtime context, parallel detached sessions, structured event stream, agent dispatch, and cross-repo working directory routing."
---

# OpenCode CLI - Unique Capabilities

What `opencode run` brings that the four sibling cli-* dispatches do not. Each capability includes the invocation shape and the use case where it pays off.

---

## 1. OVERVIEW

The four sibling cli-* skills (cli-claude-code, cli-codex, cli-copilot, cli-gemini) dispatch a raw model behind a thin CLI wrapper. The model loads no project context, no plugins, no skills, no MCP tools, and no Spec Kit Memory unless the calling AI manually attaches files or pastes context.

`opencode run` is different. It spawns a full OpenCode session. That session loads:

1. Every plugin registered in the project's `opencode.json`
2. Every skill under `.opencode/skill/`
3. Every MCP tool wired through `opencode.json` and `.utcp_config.json`
4. The full Spec Kit Memory MCP database
5. The project's CLAUDE.md / AGENTS.md instructions
6. The structural code graph and CocoIndex semantic index

The cli-opencode skill exists because no sibling provides this. It is the bridge between an external AI and the full plugin / skill / MCP runtime this repo defines.

## 2. FULL PLUGIN, SKILL, AND MCP RUNTIME

### What it does

When `opencode run` starts a session, the runtime loads every plugin, skill, and MCP server the project configures. The dispatched agent has access to:

- All `Skill` invocations the calling AI has access to (system-spec-kit, sk-doc, `sk-code` + matching `sk-code-*` overlay, etc.)
- All MCP tools (Spec Kit Memory's 40+ tools, CocoIndex semantic search, Code Mode for ClickUp / Figma / Webflow, sequential thinking)
- Every project-local plugin
- The repo's CLAUDE.md / AGENTS.md instruction set as the system prompt

### Why it matters

A Claude Code CLI dispatch via `claude -p "<prompt>"` runs raw Claude with no plugins and no MCP. To get the same plugin / skill / MCP context inside Claude Code the operator would need to run a TUI session and import the project — not a one-shot invocation.

`opencode run` is the only one-shot path that loads the full runtime.

### Invocation shape

```bash
opencode run \
  --model opencode-go/deepseek-v4-pro \
  --agent general \
  --variant high \
  --format json \
  --dir /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public \
  "Analyze the spec-kit memory database health using memory_health, then propose three improvements with concrete file:line citations."
```

The dispatched session loads `system-spec-kit` skill, calls `memory_health` (an MCP tool), inspects the database, and writes the proposal back through Spec Kit Memory's normal save pipeline.

## 3. PARALLEL DETACHED SESSIONS

### What it does

A second `opencode run --share --port <N>` invocation from inside an existing OpenCode session spawns a separate session with its own session id, its own state directory, and a publishable share URL. The original session continues unaffected.

### Why it matters

For ablation suites, worker farms, and parallel research sweeps, the operator wants N sessions running concurrently. Each session must have:

- A unique session id (not a fork of the parent)
- An independent state directory (no shared `messages.jsonl`)
- An optional share URL so the operator can inspect it from a browser
- The same plugin / skill / MCP runtime as the parent

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
  "Run iteration N of the deep-research loop for the approved spec folder. State file at scratch/iteration-N.jsonl."
```

The skill's smart router gates this use case behind ADR-001's self-invocation signal. When the signal trips AND the prompt explicitly names a parallel detached session, the router permits the dispatch. Otherwise it refuses (see `./integration_patterns.md` for the full decision tree).

## 4. STRUCTURED EVENT STREAM

### What it does

`--format json` emits a newline-delimited JSON stream with typed events: `session.started`, `message.delta`, `tool.call`, `tool.result`, `session.completed`. Each event has a stable schema and a `session_id`.

### Why it matters

External runtimes (Claude Code, Codex, Copilot, Gemini) parse the event stream incrementally to surface tool calls and partial messages without waiting for the full response. The schema is stable enough to write thin adapters that translate OpenCode events into the calling AI's native event format.

### Invocation shape

```bash
opencode run \
  --format json \
  --model opencode-go/deepseek-v4-pro \
  --agent general \
  --variant high \
  --dir /repo \
  "<prompt>" 2>/dev/null | while IFS= read -r line; do
    type=$(echo "$line" | jq -r '.type')
    case "$type" in
      session.started) echo "session_id=$(echo "$line" | jq -r '.session_id')" ;;
      tool.call) echo "tool=$(echo "$line" | jq -r '.payload.name')" ;;
      session.completed) echo "DONE" ;;
    esac
  done
```

## 5. AGENT DISPATCH VIA `--agent`

### What it does

The `--agent <slug>` flag loads an agent definition from `.opencode/agent/<slug>.md`. The frontmatter pins the model, tool permissions, and system prompt. Specialized agents (`deep-research`, `deep-review`, `context`, `review`, `ultra-think`, etc.) provide domain-specific behavior the calling AI can target.

### Why it matters

Sibling cli-* skills that have agent equivalents (cli-claude-code's `--agent` flag, cli-codex's `-p <profile>` flag) only see the calling AI's perspective. cli-opencode dispatches into a session where the calling AI's prompt is shaped by the agent's frontmatter — its own routing decisions, its own tool permissions, its own constraints.

### Invocation shape

```bash
opencode run \
  --agent deep-review \
  --model opencode-go/deepseek-v4-pro \
  --variant high \
  --format json \
  --dir /repo \
  "Run iteration 3 of the deep-review loop for the approved spec folder. State file: review/deep-review-state.jsonl."
```

See `./agent_delegation.md` for the full routing matrix.

## 6. CROSS-REPO DISPATCH VIA `--dir`

### What it does

The `--dir <path>` flag pins the session's working directory. Combined with `--attach <url>`, it can also point at a remote OpenCode server's path on the remote machine.

### Why it matters

A calling AI in one repo (e.g. a sibling project) can dispatch into a different repo's plugin / skill / MCP runtime without leaving its own session. cli-opencode is the only cli-* skill that natively understands the cross-repo dispatch pattern because the four siblings' binaries have no equivalent of `--dir` (their CWD is wherever the calling AI lives).

### Invocation shape

```bash
# From a session in repo A, dispatch into repo B's runtime
opencode run \
  --dir /Users/michelkerkmeester/MEGA/Development/Code_Environment/Barter \
  --model opencode-go/deepseek-v4-pro \
  --agent general \
  --variant high \
  --format json \
  "Use Barter's spec-kit to draft a Level 1 spec for the X feature. Save context after."
```

## 7. STATE COMPARISON WITH SIBLING CLI BINARIES

| Sibling | Persistent state | Memory continuity | Plugin runtime |
|---------|-------------------|-------------------|----------------|
| cli-claude-code | Per-session conversation log | `--continue` / `--resume <id>` | None (raw Claude) |
| cli-codex | `~/.codex/sessions/` | `codex resume <id>` / `codex fork <id>` | None (raw Codex agent) |
| cli-copilot | Workspace-scoped repo memory | `--auto-resume` (when wired) | Limited (Copilot's own integrations) |
| cli-gemini | None (one-shot) | None | None |
| **cli-opencode** | `~/.opencode/state/<session_id>/` | `--continue` / `-s <id>` / `--fork` | **Full plugin + skill + MCP + Spec Kit Memory** |

The persistent state directory at `~/.opencode/state/` is what makes use case 2 (parallel detached sessions) possible — each session has an independent file-system footprint that the operator can inspect, archive, or replay.

## 8. RELATED RESOURCES

- `./cli_reference.md` - Full subcommand and flag reference
- `./integration_patterns.md` - Three use cases with prompt templates
- `./agent_delegation.md` - Agent routing matrix
- `../assets/prompt_templates.md` - Copy-paste templates per use case
- `../SKILL.md` - Skill entry point and smart router

