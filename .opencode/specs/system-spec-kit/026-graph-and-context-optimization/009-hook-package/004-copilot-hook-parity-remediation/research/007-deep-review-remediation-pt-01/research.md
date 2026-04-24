---
title: "...ation/009-hook-package/004-copilot-hook-parity-remediation/research/007-deep-review-remediation-pt-01/research]"
description: "Synthesis of 10 iterations investigating whether GitHub Copilot CLI (1.0.34, April 2026) exposes a mechanism to inject per-session startup context and per-prompt advisor brief payloads the way Claude Code does via SessionStart/UserPromptSubmit hooks. Outcome: B (file-based workaround) — Copilot has a rich extension surface but no dynamic hook-driven prompt-injection channel."
trigger_phrases:
  - "ation"
  - "009"
  - "hook"
  - "daemon"
  - "parity"
  - "research"
  - "007"
  - "deep"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-package/004-copilot-hook-parity-remediation/research/007-deep-review-remediation-pt-01"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["research.md"]
---
# Deep Research Synthesis — Copilot CLI Hook Parity

**Spec phase**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/004-copilot-hook-parity-remediation/`
**Research packet**: `007-deep-review-remediation-pt-01/`
**Iterations**: 10 (all completed; rolling newInfoRatio saturation curve 0.85 → 0.10)
**Executor**: `cli-copilot` with gpt-5.4, reasoning high
**Outcome**: **B (file-based workaround)**

---

## 1. EXECUTIVE SUMMARY

**The research question**: does Copilot CLI 1.0.34 expose any mechanism — hook, pre-prompt script, plugin, agent extension, config file, env-var injection, or MCP integration — that would let the Spec Kit Memory MCP inject (a) a per-session startup-context payload and (b) a per-prompt advisor brief the way Claude Code's SessionStart + UserPromptSubmit hooks already do?

**Short answer**: **No** native parity exists. Copilot CLI *does* have a documented hook system with the right event names (`sessionStart`, `userPromptSubmitted`, `preToolUse`, `postToolUse`, `sessionEnd`, `errorOccurred`), but **the hook output contract explicitly forbids prompt mutation**: GitHub's own hook reference says `sessionStart` output is ignored, `userPromptSubmitted` output is ignored because "prompt modification is not currently supported in customer hooks," and `postToolUse` / `errorOccurred` outputs are also ignored. Only `preToolUse` hooks can influence behavior (deny/ask/allow a tool call). That means Copilot hooks can observe, log, and gate — but not inject text into the model's session.

**Classification**: **Outcome B (file-based workaround)**. The documented native startup-context path is *static file-based custom instructions*. The recommended parity implementation is:

1. **Primary path** (static-file workaround): background job rewrites `$HOME/.copilot/copilot-instructions.md` with current graph-freshness metrics + latest advisor brief at a cadence matching the update frequency (e.g., on advisor recalculation). Copilot reads on next prompt.
2. **Programmatic path** (for `copilot -p` scripting): shell wrapper that prepends advisor brief to the prompt via `copilot -p "$(build_brief)\n\n$PROMPT"`.
3. **Full parity path** (high effort): build a Spec Kit Memory ACP client that wraps Copilot CLI as `copilot --acp` and injects context into each `prompt()` call.

---

## 2. KEY FINDINGS (PRIMARY-SOURCE-CITED)

### F1. Copilot CLI hooks exist but are NOT a prompt-mutation API

- Events exposed: `sessionStart`, `sessionEnd`, `userPromptSubmitted`, `preToolUse`, `postToolUse`, `errorOccurred`, `agentStop`, `subagentStop`.
- Hook contract: shell command execution with `bash`/`powershell`/script path, `cwd`, `env`, `timeoutSec`.
- **Critical limit**: official hook reference states `sessionStart` output is ignored, `userPromptSubmitted` output is ignored (with explicit text: "prompt modification is not currently supported in customer hooks"), and `postToolUse`/`errorOccurred` outputs are ignored.
- Only `preToolUse` can affect execution — by returning a deny/ask/allow decision for a tool call. Not usable for startup-context or advisor-brief injection.

**Sources**:
- [Copilot CLI — use hooks (how-to)](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/use-hooks)
- [Hooks configuration (reference)](https://docs.github.com/en/copilot/reference/hooks-configuration)
- [About hooks (concept)](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-hooks)

### F2. `/agent` and `--agent` select delegated subagents, not a main-session system-prompt extension

- Custom agents are `.agent.md` profiles stored in `.github/agents/` or `~/.copilot/agents/`.
- Profile schema: YAML frontmatter with prompt, `tools`, `mcp-servers`. No `sessionStart`/`userPromptSubmitted`-style callback fields.
- GitHub docs explicitly say custom-agent work is "carried out by a subagent with its own context window" — selected by `/agent`, prompt inference, or `--agent` — not prepended to every main-session turn.

**Sources**:
- [About custom agents (concept)](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-custom-agents)
- [Create custom agents for CLI (how-to)](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/create-custom-agents-for-cli)
- [Custom agents configuration (reference)](https://docs.github.com/en/copilot/reference/custom-agents-configuration)
- [CLI programmatic reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-programmatic-reference)

### F3. Skills are task-scoped capability packs, not an always-on briefing channel

- Skills live at project `.github/skills/` and personal `~/.copilot/skills/`.
- GitHub describes skills as folders of instructions/scripts/resources "loaded when relevant" or explicitly via `/skills`.
- Contrasted on the comparison page with **custom instructions**, which are the session-start persistent guidance mechanism.
- Conceptually comparable to Claude Code skills, but NOT a guaranteed per-prompt advisor-brief injection surface.

**Sources**:
- [About agent skills (concept)](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills)
- [Add skills (how-to)](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills)
- [Comparing CLI features](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/comparing-cli-features)

### F4. MCP is pull-based tool/data access — not a push channel for unsolicited context

- MCP servers registered in `~/.copilot/mcp-config.json`, `/mcp add`, or `--additional-mcp-config`.
- Documented model: Copilot may call MCP tools "when relevant" during a session.
- No documented mechanism for an MCP server to inject arbitrary text into session start or prompt stream without Copilot first invoking one of its tools.

**Sources**:
- [Add MCP servers (how-to)](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-mcp-servers)
- [Use Copilot CLI (how-to)](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-copilot-cli)
- [CLI config dir reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference)

### F5. Custom instructions are the documented native startup-context surface — static, file-based

Documented automatic instruction inputs, auto-loaded into requests:

- Repo: `.github/copilot-instructions.md`
- Path-specific: `.github/instructions/**/*.instructions.md`
- Project/CWD: `AGENTS.md`
- Home: `$HOME/.copilot/copilot-instructions.md`
- Extra directories: via `COPILOT_CUSTOM_INSTRUCTIONS_DIRS` env var
- Opt-out CLI flag: `--no-custom-instructions`

This is real startup context loading, but **file-based/static**: changes become active on the next submitted prompt. To simulate dynamic content, an external writer must rewrite the file(s) between prompts. This is the closest native parity path.

**Sources**:
- [Add custom instructions (how-to)](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-custom-instructions)
- [Custom instructions support (reference)](https://docs.github.com/en/copilot/reference/custom-instructions-support)
- [Use Copilot CLI (how-to)](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-copilot-cli)

### F6. ACP server mode (`--acp`) is the only surface that supports external-client context injection

- Copilot CLI can run as an Agent Client Protocol (ACP) server: `copilot --acp`.
- External client creates a session via `newSession({ cwd, mcpServers: [] })`, then sends user prompts via `prompt(...)` and receives `sessionUpdate` events over NDJSON.
- This means a Spec Kit Memory client could wrap Copilot CLI as an ACP client and prepend startup context + advisor brief to each `prompt()` call.
- Public preview (launched 2026-01-28). Open issues request more extension points (custom JSON-RPC methods, `ask_user` extension) — indicating ACP is still a narrowing scope, not yet a full hook replacement.

**Sources**:
- [ACP server (reference)](https://docs.github.com/en/copilot/reference/copilot-cli-reference/acp-server)
- [ACP support in Copilot CLI is now in public preview (changelog)](https://github.blog/changelog/2026-01-28-acp-support-in-copilot-cli-is-now-in-public-preview/)
- [GitHub issue #1245](https://github.com/github/copilot-cli/issues/1245) — request for ask_user extension
- [GitHub issue #2044](https://github.com/github/copilot-cli/issues/2044) — arbitrary JSON-RPC methods not exposed
- [GitHub issue #2555](https://github.com/github/copilot-cli/issues/2555) — ACP slash command coverage gap

### F7. Env vars are for config/discovery, not payload delivery

Documented env vars relevant to this research:

- `COPILOT_CUSTOM_INSTRUCTIONS_DIRS` — adds directories scanned for instruction files
- `COPILOT_HOME` — config directory override
- `COPILOT_CACHE_HOME` — cache directory
- `COPILOT_SKILLS_DIRS` — extra skill directories
- `COPILOT_MODEL` — model override
- Auth: `COPILOT_GITHUB_TOKEN`, `GITHUB_TOKEN`, `GH_TOKEN`

None of these carry arbitrary startup-context or advisor-brief payload text.

**Sources**:
- [Add custom instructions (env vars)](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-custom-instructions)
- [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)
- Empirical: `copilot help environment` on 2026-04-22

### F8. Shell-wrapper prepending works for programmatic mode only

- `copilot -p "..."` and `echo "..." | copilot` are supported programmatic entry points.
- A wrapper can prepend advisor brief + startup context to the user prompt: `copilot -p "$(build_brief)\n\n$USER_PROMPT"`.
- Piped stdin is ignored if `-p/--prompt` is supplied.
- **Breaks interactive TUI**: `copilot` (no `-p`) starts the TUI; wrapping that path requires stdin piping which may break terminal ergonomics.

**Sources**:
- [Run CLI programmatically (how-to)](https://docs.github.com/en/copilot/how-tos/copilot-cli/automate-copilot-cli/run-cli-programmatically)
- [About Copilot CLI](https://docs.github.com/en/copilot/concepts/agents/about-copilot-cli)

---

## 3. ANSWERS TO KEY QUESTIONS (from spec.md §7)

| ID | Question | Answer | Evidence |
|---|---|---|---|
| Q1 | Does Copilot CLI have a documented pre-prompt hook / lifecycle extension point? | **Yes (exists) / No (not usable for injection)**. Hook system supports 6+ events, but outputs are ignored for every lifecycle event except `preToolUse` (which gates tool calls, not prompts). | F1 |
| Q2 | Is `/agent` / `--agent` a main-session startup-context injector? | **No**. Selects delegated subagents with separate context windows. | F2 |
| Q3 | Is `/skills` a per-prompt injection surface? | **No**. Skills are task-scoped/just-in-time bundles, loaded "when relevant", not always-on. | F3 |
| Q4 | Can MCP push context into the session? | **No**. Pull-based tool/data access only; no documented push channel. | F4 |
| Q5 | Is there a user-config file Copilot reads at session start? | **Yes** — multiple: `AGENTS.md`, `.github/copilot-instructions.md`, `$HOME/.copilot/copilot-instructions.md`, path-specific instructions, plus `COPILOT_CUSTOM_INSTRUCTIONS_DIRS` for extra directories. **File-based/static**. | F5 |
| Q6 | Does `--acp` expose a bidirectional context-injection channel? | **Yes, but requires external client wrapper**. `copilot --acp` can be controlled by a Spec Kit ACP client that prepends context into each `prompt()` call. Public preview; API evolving. | F6 |
| Q7 | Do env vars carry payload text? | **No**. Env vars cover config/discovery/auth only. | F7 |
| Q8 | What's the shell-wrapper workaround pattern? | Works for `copilot -p` programmatic mode: prepend brief to the prompt string. Breaks interactive TUI if mandatorily wrapped. | F8 |

---

## 4. OUTCOME CLASSIFICATION — B (File-based workaround)

**Classification**: **B** per `plan.md` §2 Phase 1 exit criteria.

**Rationale**:
- **Not A (full hook parity)**: Copilot hooks exist but cannot inject prompt/session text. Per the hook reference, "prompt modification is not currently supported in customer hooks." There is no path to SessionStart/UserPromptSubmit parity through hooks as they exist today.
- **Not C (no path at all)**: Copilot has a rich extension surface. Multiple viable workarounds exist.
- **B (workaround viable)**: The static-file custom-instructions surface provides a real parity mechanism with acceptable freshness trade-offs. ACP client wrapper provides deeper parity with engineering cost.

---

## 5. DECISION MATRIX — Implementation Paths

| # | Path | Mechanism | Feasibility | Eng. cost | Runtime cost | Coverage | Recommended |
|---|---|---|---|---|---|---|---|
| 1 | Static file rewrite | Background job rewrites `$HOME/.copilot/copilot-instructions.md` with latest graph metrics + advisor brief on each advisor recalculation | High | Low (~1 day) | Negligible (file write per update) | Both startup context + advisor brief (static; freshness bounded by update cadence) | **Yes — primary path** |
| 2 | Shell wrapper for `-p` mode | Alias `cpx` to a script that builds brief and runs `copilot -p "$brief\n\n$@"` | High | Low (~1 hour) | Per-invocation brief generation (<100ms) | Programmatic mode only; no interactive TUI coverage | Yes — supplementary for scripts |
| 3 | ACP client wrapper | Spec Kit Memory acts as ACP client, spawns `copilot --acp` as server, injects context into each `prompt()` call | Medium (ACP API is public-preview, evolving) | High (~1-2 weeks) | Protocol overhead per turn | Full dynamic injection, both surfaces, all modes | Medium priority — revisit after ACP stabilizes |
| 4 | Custom-agent profile approach | Write a `.agent.md` profile that prepends advisor brief via its frontmatter prompt | Low (profile prompts are static; advisor brief changes per prompt) | Low | Per-invocation static overhead | Selected agents only; doesn't auto-apply; static | No — wrong abstraction |
| 5 | MCP tool proxy | MCP server exposes `getAdvisorBrief` tool; agent must discover and call it | Low (requires the agent to voluntarily call; no auto-injection) | Medium | Per-call overhead | Only if agent calls the tool; unreliable | No — pull-based, agent may skip |
| 6 | `preToolUse` hook inject | Use the one mutation-capable hook; but it can only deny/ask/allow tool calls, not write text | None | — | — | No coverage | No — not a text channel |
| 7 | Document limitation, no action | Ship cli-copilot skill docs stating the gap | High | Zero | None | Zero parity | No — options 1-3 are viable; don't need to retreat |

---

## 6. RECOMMENDED IMPLEMENTATION PLAN (Phase 2)

### Primary: File-based custom-instructions rewrite

- **Write target**: `$HOME/.copilot/copilot-instructions.md`
- **Writer**: background job or hook on advisor recalculation (existing in Spec Kit Memory — already writes the Claude hook payload via `hooks/claude/user-prompt-submit.ts`).
- **Content shape**:
  ```markdown
  # Spec Kit Memory — Auto-Generated Context (refreshed: <timestamp>)
  
  ## Startup Context
  Code graph: <N> files, <M> nodes, <E> edges, last scan <timestamp>, freshness: <fresh|stale>
  
  ## Active Advisor Brief
  Advisor: <skill> <conf>/<uncert> <status>
  ```
- **Freshness**: whatever cadence the writer runs at (on advisor change; real-time if hooked into the advisor update event; otherwise periodic).
- **Trade-off**: Copilot picks up the file on NEXT prompt, not mid-prompt. Acceptable for most use cases; advisor brief staleness < 1 prompt.
- **User opt-out**: they already can use `--no-custom-instructions` to disable if desired.
- **Coexistence**: the file sits alongside `~/.codex/AGENTS.md` (spec 046) and `~/.claude/CLAUDE.md` without conflict.

### Supplementary: Shell wrapper for programmatic mode

- Alias `cpx` in shell rc:
  ```bash
  cpx() {
    local brief
    brief=$(node /path/to/spec-kit-memory/emit-brief.js)
    copilot -p "$brief

  $*" --model gpt-5.4 --allow-all-tools --no-ask-user "$@"
  }
  ```
- For CI / scripting / `copilot exec`-style invocations where the static-file approach has freshness concerns.

### Deferred: ACP client wrapper

- Track ACP API stability (currently public preview). Revisit when:
  - `ask_user` / `ask_question` extension lands ([issue #1245](https://github.com/github/copilot-cli/issues/1245))
  - Arbitrary JSON-RPC methods are exposed ([issue #2044](https://github.com/github/copilot-cli/issues/2044))
  - ACP slash command coverage closes ([issue #2555](https://github.com/github/copilot-cli/issues/2555))
- Engineering cost estimate is ~1-2 weeks for a functional prototype; more for production quality.

---

## 7. WHAT THIS DOES NOT SOLVE

- **Interactive TUI parity**: `copilot` (no `-p`) starts the full-screen interactive TUI. The static-file approach works here (Copilot reads custom instructions on each turn). The shell-wrapper does not work here (can't wrap TUI cleanly).
- **Freshness below the file-write interval**: if advisor brief changes 10× within a single prompt, only the most recent value lands in Copilot's context. For most use cases this is fine; for real-time advisor updates within a single turn, no native path.
- **Multi-tenant scenarios**: the static-file approach writes to `$HOME/.copilot/` — per-user. Doesn't scale to shared-host scenarios without per-session config dirs (`COPILOT_HOME` override).

---

## 8. OPEN ITEMS FOR PHASE 2

1. Decide whether to implement option 1 immediately, or wait for ACP stabilization and go straight to option 3.
2. If option 1: choose writer trigger — event-driven (hooked into advisor recalculation) vs periodic (cron-like).
3. Decide on the exact content format and header/footer of the auto-generated file so human-edited and auto-generated sections don't conflict.
4. Document the precedence and interaction with other instruction files (`AGENTS.md`, `.github/copilot-instructions.md`) — does the writer use only `$HOME/.copilot/copilot-instructions.md`, or also inject into project-level files?
5. Decide whether to replicate the shell-wrapper approach (option 2) for other programmatic CLIs (e.g., `codex exec -p` — this was actually the gap in phase 008, independent path).

---

## 9. METHODOLOGY NOTES (for future CLI-parity efforts)

The research methodology that worked for this packet — reusable for Gemini CLI or other runtimes:

1. **First-party docs sweep**: start with `docs.github.com/en/copilot/` root and walk the customization tree (concepts, how-tos, references).
2. **Source repo search**: search `github/copilot-cli` for keywords like "hook", event names, "SessionStart", "userPromptSubmitted".
3. **Release notes scan**: last 6-12 months of release notes for new extensibility features.
4. **Local empirical probe**: `{cli} --help`, `{cli} help environment`, inspect `~/.{cli}/*.json` and `~/.{cli}/*.toml`.
5. **Comparison matrix**: map each extension surface against 3 axes — (a) static/dynamic, (b) push/pull, (c) model-context/side-effect.

---

## 10. CONVERGENCE REPORT

- **Total iterations**: 10
- **Stop reason**: max_iterations_reached (rolling avg at stop = 0.1833, still above 0.05 threshold)
- **Iteration ratio trajectory**: 0.85 → 0.65 → 0.60 → 0.55 → 0.45 → 0.40 → 0.30 → 0.25 → 0.20 → 0.10 (monotonic saturation curve)
- **Total findings**: ~48 across 10 iterations (deduplicated into ~20 unique claims in this synthesis)
- **Status distribution**: 9 × insight, 1 × evidence (iter 10)
- **Total primary-source URLs cited**: 30+ distinct URLs across GitHub docs, github/copilot-cli repo, official GitHub blog

---

## 11. RELATED DOCUMENTS

- **Spec**: `../../009-hook-package/004-copilot-hook-parity-remediation/spec.md`
- **Plan**: `../../009-hook-package/004-copilot-hook-parity-remediation/plan.md`
- **Tasks**: `../../009-hook-package/004-copilot-hook-parity-remediation/tasks.md`
- **Decisions**: `../../009-hook-package/004-copilot-hook-parity-remediation/decision-record.md` — ADR-003 populated from §5 above
- **Sibling phase**: `../../009-hook-package/005-codex-hook-parity-remediation/` — Codex has native hooks with DIFFERENT semantics; separate synthesis
- **Reference implementation**: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts` — the Claude-side hook this phase parity-matches (implementation tracked against outcome B path)
