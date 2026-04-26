---
title: "OpenCode CLI Orchestrator"
description: "Cross-AI task delegation and parallel detached sessions for OpenCode CLI with full plugin, skill, and MCP runtime context. Three documented use cases plus a layered self-invocation guard."
trigger_phrases:
  - "opencode cli"
  - "opencode run"
  - "delegate to opencode"
  - "parallel detached session"
  - "spec kit runtime"
---

# OpenCode CLI Orchestrator

> Delegate tasks from any AI assistant to OpenCode CLI for one-shot dispatches into the project's full plugin, skill, and MCP runtime, plus parallel detached sessions for ablation, worker farms, and parallel research.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1-overview)
- [2. QUICK START](#2-quick-start)
- [3. FEATURES](#3-features)
  - [3.1 FEATURE HIGHLIGHTS](#31-feature-highlights)
  - [3.2 FEATURE REFERENCE](#32-feature-reference)
- [4. STRUCTURE](#4-structure)
- [5. CONFIGURATION](#5-configuration)
- [6. USAGE EXAMPLES](#6-usage-examples)
- [7. TROUBLESHOOTING](#7-troubleshooting)
- [8. FAQ](#8-faq)
- [9. RELATED DOCUMENTS](#9-related-documents)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### What This Skill Does

This skill lets external AI assistants (Claude Code, Codex, Copilot, Gemini, raw shell) invoke OpenCode CLI as a one-shot specialist tool. The calling AI stays the conductor, delegating specific tasks to OpenCode and integrating the structured event stream back into its own workflow.

OpenCode brings a capability that the four sibling cli-* skills do not: a one-shot dispatch that loads the full plugin, skill, MCP, and Spec Kit Memory runtime. When `opencode run` starts a session, every plugin in the project's `opencode.json` loads, every skill under `.opencode/skill/` becomes accessible, every MCP tool wired through the project becomes callable, and the Spec Kit Memory database is on-line.

The skill documents three orthogonal use cases: external runtime to OpenCode, in-OpenCode parallel detached sessions for ablation and worker farms, and cross-AI handback where a non-Anthropic CLI needs OpenCode-specific plugins.

The skill includes a layered self-invocation guard. Three checks (env var lookup, process ancestry, lock-file probe) detect when the orchestrator is already running inside OpenCode. The smart router refuses self-dispatch with a documented error message that names the remediation path.

### Key Statistics

| Category | Value | Details |
|----------|-------|---------|
| **Use cases** | 3 | External runtime, in-OpenCode parallel detached, cross-AI handback |
| **Self-invocation layers** | 3 | Env var, process ancestry, lock-file probe |
| **Default invocation** | `--model anthropic/claude-opus-4-7 --agent general --variant high --format json` | Pinned shape for routine dispatches |
| **References** | 4 | cli_reference, integration_patterns, opencode_tools, agent_delegation |
| **Assets** | 2 | prompt_quality_card, prompt_templates (13 templates) |
| **Version baseline** | opencode v1.3.17 | Pinned in cli_reference §9 |
| **Skill version** | 1.0.0 | Initial release |

### How This Compares

| Capability | Claude Code CLI | Codex CLI | Copilot CLI | Gemini CLI | OpenCode CLI |
|------------|-----------------|-----------|-------------|------------|--------------|
| **Plugin runtime** | None (raw Claude) | None (raw Codex) | Limited | None | Full project plugins |
| **Skill runtime** | Native via SKILL.md inside Claude Code only | None | None | None | Full project skills |
| **MCP runtime** | None (per-session config) | Native via `codex mcp` | Limited | None | Full project MCP servers |
| **Spec Kit Memory** | None (no project-aware DB) | None | None | None | Full project DB |
| **Parallel detached sessions** | No | Session fork | Cloud delegation | No | `--share --port N` |
| **Agent dispatch** | `--agent` (Claude agents) | `-p` profile | Built-in | None | `--agent` (project agents) |
| **Cross-repo dispatch** | No | No | Cloud only | No | `--dir <path>` |

### Key Features at a Glance

| Feature | What It Does |
|---------|-------------|
| **Full plugin runtime** | Dispatched session loads every project plugin from `opencode.json` |
| **Full skill runtime** | All skills under `.opencode/skill/` become accessible inside the dispatched session |
| **Full MCP runtime** | Spec Kit Memory's 40+ tools, CocoIndex semantic search, Code Mode, sequential thinking — all callable |
| **Parallel detached sessions** | `--share --port N` spawns a separate session id with independent state |
| **Structured event stream** | `--format json` emits typed JSON events the calling AI parses incrementally |
| **Agent dispatch** | `--agent <slug>` loads project agents (deep-research, deep-review, review, ultra-think, etc.) |
| **Cross-repo dispatch** | `--dir <path>` targets a different repo's plugin / skill / MCP runtime |
| **Self-invocation guard** | Three-layer detection refuses circular dispatch when already inside OpenCode |
| **Memory handback** | `MEMORY_HANDBACK` delimiters preserve session context through `generate-context.js` |

### Requirements

| Requirement | Value | Notes |
|-------------|-------|-------|
| **CLI** | OpenCode v1.3.17+ | `brew install opencode` (macOS) or `curl -fsSL https://opencode.ai/install \| bash` |
| **Auth** | Per-provider (`opencode auth login <provider>`) or env vars | `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, etc. |
| **Node.js** | 18+ | Required for the npm install path |

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:quick-start -->
## 2. QUICK START

### 1. Verify Installation

```bash
command -v opencode || echo "Not installed. Run: brew install opencode (macOS) or curl -fsSL https://opencode.ai/install | bash"
opencode --version
```

### 2. Run the Self-Invocation Guard

```bash
# If any of these print, you are inside OpenCode and must use a sibling cli-* skill instead
env | grep -q '^OPENCODE_' && echo "OPENCODE_* env detected"
ps -o command= -p "$PPID" | grep -q opencode && echo "opencode parent process"
ls ~/.opencode/state/*/lock 2>/dev/null | head -1 | grep -q lock && echo "live OpenCode session lock"
```

### 3. Run a Simple External-Runtime Dispatch

```bash
opencode run \
  --model anthropic/claude-opus-4-7 \
  --agent general \
  --variant high \
  --format json \
  --dir /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public \
  "Use memory_search to find context on packet 047." 2>&1
```

### 4. Spawn a Parallel Detached Session

```bash
opencode run --share --port 4096 \
  --model anthropic/claude-opus-4-7 \
  --agent deep-research \
  --variant high \
  --format json \
  --dir /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public \
  "Run iteration 3 of the deep-research loop on packet 047." 2>&1
```

<!-- /ANCHOR:quick-start -->

---

<!-- ANCHOR:features -->
## 3. FEATURES

### 3.1 FEATURE HIGHLIGHTS

OpenCode CLI stands apart from the four sibling cli-* skills in three ways: full project runtime, parallel detached sessions, and cross-repo dispatch.

The full project runtime is the headline capability. Sibling cli-* dispatches send a raw model behind a thin CLI wrapper. The dispatched call loads no plugins, no skills, no MCP tools, no Spec Kit Memory. `opencode run` is different. The dispatched session loads every plugin in `opencode.json`, every skill under `.opencode/skill/`, every MCP server wired through the project, and the Spec Kit Memory database. A one-shot dispatch becomes a fully-loaded project agent.

Parallel detached sessions matter for ablation suites, worker farms, and parallel research. `opencode run --share --port N` spawns a separate session id with its own state directory under `~/.opencode/state/<session_id>/`. The original session continues unaffected. The new session can publish a `--share` URL for browser inspection. This pattern is unique to cli-opencode because the four sibling binaries do not have an equivalent of OpenCode's session model.

Cross-repo dispatch via `--dir <path>` lets a session in repo A target repo B's plugin / skill / MCP runtime. Combined with `--attach <url>`, it can reach a remote OpenCode server. The four siblings have no equivalent — their CWD is wherever the calling AI lives.

The skill is built around a self-invocation guard that protects against circular dispatch. Three layers of detection (env var lookup, process ancestry probe, lock-file check) trip when the orchestrator is already running inside OpenCode. The smart router then refuses unless the prompt explicitly names a parallel detached session.

### 3.2 FEATURE REFERENCE

#### Use Cases

| Use case | Calling runtime | Target | Self-invocation? |
|----------|-----------------|--------|------------------|
| **External runtime to OpenCode** | Claude Code, Codex, Copilot, Gemini, raw shell | OpenCode for full plugin / skill / MCP runtime | No |
| **In-OpenCode parallel detached** | OpenCode itself (TUI / web / serve / acp) | New OpenCode session via `--share --port N` | No (different session id) |
| **Cross-AI orchestration handback** | Codex / Copilot / Gemini | OpenCode for spec-kit specific workflows | No |

#### Models

| Provider | Model id | Variant range | Default for cli-opencode? |
|----------|----------|---------------|---------------------------|
| Anthropic | `anthropic/claude-opus-4-7` | minimal / low / medium / high / max | YES |
| Anthropic | `anthropic/claude-sonnet-4-7` | same | No |
| Anthropic | `anthropic/claude-haiku-4-5` | same | No |
| OpenAI | `openai/gpt-5.5` | minimal / low / medium / high / xhigh | No |
| Google | `google/gemini-2.5-pro` | minimal / low / medium / high | No |

#### Core Flags

| Flag | Short | Purpose |
|------|-------|---------|
| `--model` | `-m` | Provider-prefixed model selector |
| `--agent` | | Project agent slug |
| `--variant` | | Provider-specific reasoning effort |
| `--format` | | `default` (formatted) or `json` (event stream) |
| `--dir` | | Working directory or remote-server path |
| `--share` | | Publish session share URL (operator confirmation required) |
| `--port` | | Local server port for parallel detached sessions |
| `--continue` | `-c` | Continue last session in this project |
| `--session` | `-s` | Continue specific session id |
| `--fork` | | Fork before continuing (requires `--continue` or `--session`) |
| `--file` | `-f` | Attach files to message |
| `--thinking` | | Show thinking blocks |
| `--pure` | | Disable plugins (debugging only) |

#### Agent Roster

| Agent | Purpose | Constraint |
|-------|---------|------------|
| `general` | Default subagent | None |
| `context` | Codebase exploration | LEAF — read-only, no sub-dispatches |
| `orchestrate` | Multi-agent coordination | None |
| `write` | Documentation generation | None |
| `review` | Code review | READ-ONLY |
| `debug` | Fresh-perspective debugging | Exclusive write access for `debug-delegation.md` |
| `deep-research` | Iterative research loop | LEAF — single iteration |
| `deep-review` | Iterative code review loop | LEAF — single iteration |
| `ultra-think` | Multi-strategy planning | PLANNING-ONLY |
| `improve-agent` | Agent improvement proposals | Proposal-only |

<!-- /ANCHOR:features -->

---

<!-- ANCHOR:structure -->
## 4. STRUCTURE

```text
cli-opencode/
  SKILL.md                              # Skill definition, smart routing, self-invocation guard
  README.md                             # This file
  graph-metadata.json                   # Sibling edges, intent signals, derived block
  assets/
    prompt_quality_card.md              # Framework selection, CLEAR 5-check
    prompt_templates.md                 # 13 copy-paste templates per use case + agent + handback
  references/
    cli_reference.md                    # Subcommands, flags, models, version drift
    integration_patterns.md             # 3 use cases, decision tree, self-invocation guard
    opencode_tools.md                   # Unique value props vs sibling cli-* skills
    agent_delegation.md                 # Agent routing matrix, leaf-agent constraints
```

<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:configuration -->
## 5. CONFIGURATION

### Authentication

OpenCode resolves credentials through configured providers. Use `opencode providers` (alias `auth`) to enumerate.

| Method | Setup | Best For |
|--------|-------|----------|
| **OAuth via providers** | `opencode auth login <provider>` | Interactive browser flow |
| **Per-provider env vars** | `export ANTHROPIC_API_KEY=...` | Programmatic / CI use |
| **Credential file** | Per-provider config under `~/.opencode/auth/` | Persistent setups |

### Model Defaults

cli-opencode defaults to `anthropic/claude-opus-4-7 --variant high` for cross-AI dispatches because routine cli-opencode tasks benefit from elevated reasoning. Override per invocation:

```bash
opencode run \
  --model openai/gpt-5.5 \
  --variant high \
  --agent general \
  --format json \
  --dir /repo \
  "<prompt>"
```

### Session Modes

| Mode | Behavior | Use Case |
|------|----------|----------|
| One-shot (default) | Single dispatch, session terminates after response | Most cli-opencode dispatches |
| `-c` / `--continue` | Continue the last session in this project | Memory-threaded continuation |
| `-s <id>` / `--session <id>` | Continue a specific session | Resume by id |
| `--fork` | Branch from a continued session | Diverge from a known prior state |
| `--share --port N` | Detached session with publishable URL | Use case 2 (parallel research) |

<!-- /ANCHOR:configuration -->

---

<!-- ANCHOR:usage-examples -->
## 6. USAGE EXAMPLES

### External Runtime to OpenCode (Use Case 1)

```bash
opencode run \
  --model anthropic/claude-opus-4-7 \
  --agent general \
  --variant high \
  --format json \
  --dir /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public \
  "Search Spec Kit Memory for context on packet 047. Return top 5 hits as JSON." 2>&1
```

### Parallel Detached Session (Use Case 2)

```bash
opencode run --share --port 4096 \
  --model anthropic/claude-opus-4-7 \
  --agent deep-research \
  --variant high \
  --format json \
  --dir /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public \
  "Run iteration 3 of the deep-research loop on packet 047. Externalize state to scratch/iteration-3.jsonl." 2>&1
```

### Cross-AI Handback (Use Case 3)

```bash
# Calling AI is Codex / Copilot / Gemini — needs OpenCode for spec-kit workflow
opencode run \
  --model anthropic/claude-opus-4-7 \
  --agent general \
  --variant high \
  --format json \
  --dir /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public \
  "Use system-spec-kit to validate packet 047. Return strict-mode validation report as JSON." 2>&1
```

### Code Review with the Review Agent

```bash
opencode run \
  --model anthropic/claude-opus-4-7 \
  --agent review \
  --variant high \
  --format json \
  --dir /repo \
  "Review @src/auth.ts for security issues. Surface P0 / P1 findings with file:line evidence." 2>&1
```

### Worker Farm (Background Loop with `</dev/null`)

```bash
for n in $(seq 1 8); do
  port=$((4100 + n))
  opencode run --share --port "$port" \
    --model anthropic/claude-opus-4-7 \
    --agent general \
    --variant high \
    --format json \
    --dir /repo \
    "Worker $n: <shard-specific prompt>" > "logs/worker-$n.log" 2>&1 </dev/null &
done
wait
```

<!-- /ANCHOR:usage-examples -->

---

<!-- ANCHOR:troubleshooting -->
## 7. TROUBLESHOOTING

### OpenCode CLI Not Found

**What you see**: `command not found: opencode`
**Common causes**: Binary not on PATH or not installed.
**Fix**: Run `brew install opencode` (macOS) or `curl -fsSL https://opencode.ai/install | bash`. Verify with `command -v opencode`.

### Self-Invocation Refused

**What you see**: `ERROR: cli-opencode self-invocation refused. You are already inside OpenCode...`
**Common causes**: The smart router detected an `OPENCODE_*` env var, an `opencode` parent process, or a live `~/.opencode/state/<id>/lock`.
**Fix**: Use a sibling cli-* skill (cli-claude-code, cli-codex, cli-copilot, cli-gemini) OR open a fresh shell session OR add explicit "parallel detached" / "ablation suite" / "worker farm" / "share URL" keywords to the prompt to switch the router into use case 2.

### Authentication Failure

**What you see**: `provider/model not found` or `401 Unauthorized`
**Common causes**: Provider not configured or credentials expired.
**Fix**: Run `opencode providers` to enumerate. Re-authenticate with `opencode auth login <provider>`.

### Background Dispatch Hangs

**What you see**: A backgrounded `opencode run` inside a `while read` loop runs once and the loop exits early.
**Common causes**: The backgrounded process inherits the loop's stdin and silently consumes the rest.
**Fix**: Add `</dev/null` after the redirect: `opencode run ... > log.out 2>&1 </dev/null &`. See `references/integration_patterns.md` §6.

### Plugin Load Crash

**What you see**: `MODULE_NOT_FOUND` or plugin-loader stack trace at session start.
**Common causes**: A plugin path is wrong or a dependency is missing.
**Fix**: Rerun with `--pure` to bypass plugins. The dispatched session will not have full project runtime — surface the underlying issue as a separate task.

### Version Drift

**What you see**: `unknown option --variant` or `unknown option --share`.
**Common causes**: Binary is older than the v1.3.17 baseline.
**Fix**: Run `opencode --version` and `opencode run --help`. Compare against `references/cli_reference.md` §9 (Version Drift). Either upgrade the binary or fall back to the closest analogue flag.

<!-- /ANCHOR:troubleshooting -->

---

<!-- ANCHOR:faq -->
## 8. FAQ

### General

**Q: When should I use OpenCode CLI instead of the four siblings?**
A: Use cli-opencode when the task needs the project's full plugin / skill / MCP / Spec Kit Memory runtime, when you want a parallel detached session for ablation or worker farms, or when a non-Anthropic CLI needs OpenCode-specific plugins. For raw model dispatches, use the appropriate sibling.

**Q: Can OpenCode CLI search the web?**
A: Indirectly — the dispatched session can call Code Mode (mcp-code-mode) to reach Webflow / ClickUp / Figma / Chrome DevTools, or call CocoIndex for semantic code search, but there is no first-class `--search` flag. For Google Search grounding use cli-gemini; for Codex's `--search` use cli-codex.

**Q: How does the self-invocation guard work?**
A: Three layers (per ADR-001). Layer 1 checks for any `OPENCODE_*` env var. Layer 2 walks the process ancestry looking for `opencode`. Layer 3 probes `~/.opencode/state/<id>/lock`. ANY positive trips the guard. The router then refuses unless the prompt has explicit parallel-session keywords.

### Models

**Q: Which model should I default to?**
A: `anthropic/claude-opus-4-7` with `--variant high`. cli-opencode dispatches typically benefit from elevated reasoning because the dispatched session has full project context.

**Q: Can I use OpenAI or Google models?**
A: Yes — pass `--model openai/gpt-5.5` or `--model google/gemini-2.5-pro`. Run `opencode models <provider>` to enumerate.

### Sessions

**Q: How do I share a session URL?**
A: Pass `--share` and an explicit `--port`. The URL exposes session contents, so the calling AI MUST get operator confirmation before publishing per CHK-033.

**Q: What is the difference between `--continue`, `--session <id>`, and `--fork`?**
A: `--continue` resumes the last session in the project. `--session <id>` resumes a specific id. `--fork` (used with `--continue` or `--session`) branches a new session from the resumed state.

### Agents

**Q: How do I pick the right agent?**
A: Match the task type to the agent roster in Section 3.2. For routine work, use `general`. For research loops, `deep-research`. For code review, `review`. For multi-strategy planning, `ultra-think`.

**Q: Can the dispatched session spawn its own sub-agents?**
A: Yes via the dispatched session's native Task tool — but NOT via nested `opencode run` invocations. Nested CLI calls break the orchestration tree. Use `--agent orchestrate` for the entry-point dispatch and let the orchestrator handle sub-agent dispatch internally.

<!-- /ANCHOR:faq -->

---

<!-- ANCHOR:related-documents -->
## 9. RELATED DOCUMENTS

### Skill Resources
- [SKILL.md](./SKILL.md): Skill definition, smart routing logic, self-invocation guard
- [cli_reference.md](./references/cli_reference.md): Subcommands, flags, models, version drift
- [integration_patterns.md](./references/integration_patterns.md): 3 use cases, decision tree, self-invocation guard
- [opencode_tools.md](./references/opencode_tools.md): Unique capabilities and cross-CLI comparison
- [agent_delegation.md](./references/agent_delegation.md): Agent roster, routing matrix, leaf constraints
- [prompt_templates.md](./assets/prompt_templates.md): 13 copy-paste templates
- [prompt_quality_card.md](./assets/prompt_quality_card.md): Framework selection, CLEAR 5-check

### Related Skills
- [cli-claude-code](../cli-claude-code/): Anthropic Claude Code CLI orchestrator
- [cli-codex](../cli-codex/): OpenAI Codex CLI orchestrator
- [cli-copilot](../cli-copilot/): GitHub Copilot CLI orchestrator
- [cli-gemini](../cli-gemini/): Google Gemini CLI orchestrator
- [system-spec-kit](../system-spec-kit/): Spec folder workflow + Spec Kit Memory (cross-AI handback target)

<!-- /ANCHOR:related-documents -->
