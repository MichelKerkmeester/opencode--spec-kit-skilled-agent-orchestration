---
title: Deep Research Strategy — Copilot CLI Hook Parity
description: Session tracking for 007-copilot-hook-parity-remediation deep-research.
---

# Deep Research Strategy — Copilot CLI Hook Parity

<!-- ANCHOR:topic -->
## 2. TOPIC
Does GitHub Copilot CLI (1.0.34, April 2026) expose any mechanism — hook, pre-prompt script, plugin, agent extension, config file, env-var injection, or MCP integration — that would let the Spec Kit Memory MCP inject (a) a per-session `SessionStart:startup` payload (code-graph freshness + structural highlights) and (b) a per-prompt `UserPromptSubmit` advisor brief (format: `Advisor: <skill> <conf>/<uncert> <status>`), mirroring the working Claude Code behavior?

---

<!-- /ANCHOR:topic -->
<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Q1: Does Copilot CLI have a documented pre-prompt hook API, event hook system, or equivalent lifecycle extension point?
- [ ] Q2: What is the `/agent` / `--agent` extension model — can a custom agent inject system-prompt-level context at session start?
- [ ] Q3: What is the `/skills` extension model — is it comparable to Claude Code skills or different?
- [ ] Q4: What is the `/mcp` / `--additional-mcp-config` integration — can an MCP server push context (not just respond to tool calls)?
- [ ] Q5: Is there a user-config file (like `~/.copilot/AGENTS.md`, `~/.copilot/instructions.md`, system-prompt config key) that Copilot reads at session start and injects into the model context?
- [ ] Q6: Does `--acp` (Agent Client Protocol server mode) expose a bidirectional context injection channel we could exploit?
- [ ] Q7: What env vars does Copilot read at startup that could carry a payload?
- [ ] Q8: If hook/extension paths are absent, what's the least-friction shell-wrapper pattern (aliased `copilot` that prepends payload) and what breaks (TUI, stdin, token budget)?

---

<!-- /ANCHOR:key-questions -->
<!-- ANCHOR:non-goals -->
## 4. NON-GOALS
- Re-implementing the advisor logic (owned by spec 020, unchanged).
- Parity work for Gemini CLI or other runtimes (separate efforts).
- Shipping a Copilot plugin if no extension API is available — will not vendor patches.
- Modifying the root project `AGENTS.md` (universal framework, per spec 046 ADR-005).

---

<!-- /ANCHOR:non-goals -->
<!-- ANCHOR:stop-conditions -->
## 5. STOP CONDITIONS
- All 8 key questions answered with ≥2 primary-source citations each.
- Outcome classifiable as A (full parity viable), B (workaround viable), or C (no path — documented limitation).
- newInfoRatio < 0.05 for 3 consecutive iterations (convergence).
- Max 10 iterations.

---

<!-- /ANCHOR:stop-conditions -->
<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet — pre-research finding from copilot --help below]

---

<!-- /ANCHOR:answered-questions -->
<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[Populated by reducer after iteration 1]

---

<!-- /ANCHOR:what-worked -->
<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[Populated by reducer after iteration 1]

---

<!-- /ANCHOR:what-failed -->
<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[Populated when approach blocked]

---

<!-- /ANCHOR:exhausted-approaches -->
<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[Populated from iteration dead-end data]

---

<!-- /ANCHOR:ruled-out-directions -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Q1 + Q2: Map Copilot CLI's `--agent` / `--acp` / `/agent` surface. Fetch official docs at https://docs.github.com/en/copilot/concepts/agents/about-copilot-cli and adjacent pages; inspect the github/copilot-cli repo or any public source for agent extension schema and lifecycle hooks. Also empirically probe `~/.copilot/` for additional config files.

---

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->
<!-- ANCHOR:known-context -->
## 12. KNOWN CONTEXT

### Pre-research discoveries (from `copilot --help` on 1.0.34, 2026-04-22)

Copilot CLI flags that suggest an extensibility surface:
- `--effort, --reasoning-effort <level>` — values: low/medium/high/xhigh (correction to the prior Q-Exec hint that claimed config-only)
- `--agent <agent>` — "Specify a custom agent to use"
- `--acp` — "Start as Agent Client Protocol server"
- `--additional-mcp-config <json>` — augments `~/.copilot/mcp-config.json`
- `--allow-tool` / `--deny-tool` / `--available-tools` — tool-level permissions
- `--config-dir <directory>` — default `~/.copilot`
- `--autopilot` — autopilot mode
- `--bash-env` — BASH_ENV support (on|off)

Interactive slash commands visible in `/help`:
- `/agent` — browse agents
- `/skills` — manage skills
- `/mcp` — manage MCP servers

Implication: Copilot has its OWN agent + skill + MCP registration model. The research target is whether any of those support injecting startup-context / per-prompt advisor payloads the way Claude hooks do.

### File inventory at `~/.copilot/` (2026-04-22)
- `config.json` — auth, trustedFolders, banner. No AGENTS.md or instructions.md present.
- `rules/` — Starlark execution policies (separate from instruction injection).
- `mcp-config.json` — assumed to exist per `--additional-mcp-config` doc text; not verified yet.

### Related prior work
- Spec 020 (`skill-advisor-hook-surface`) wired Claude Code's SessionStart + UserPromptSubmit hooks via `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts`. That's the reference implementation to parity-match.
- Spec 046 (`cli-codex-tone-of-voice`, closed) established the user-global AGENTS.md pattern for Codex CLI at `<repo>/.codex/AGENTS.md` symlinked from `~/.codex/AGENTS.md`. Copilot may have an analogous user-global file path — TBD.

---

<!-- /ANCHOR:known-context -->
<!-- ANCHOR:research-boundaries -->
## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 15 minutes
- Executor: `cli-copilot` with model `gpt-5.4`, reasoning-effort `high`
- Concurrency cap: 3 (Copilot API throttle per-account per user-memory)
- Progressive synthesis: true
- Machine-owned sections: reducer owns §3, §6, §7-11
- Canonical pause sentinel: `<art-dir>/.deep-research-pause`
- Current generation: 1
- Started: EOF TIMESTAMP will be in config
<!-- /ANCHOR:research-boundaries -->
