---
title: Deep Research Strategy — Codex CLI Hook Parity Contract
description: Session tracking for 008-codex-hook-parity-remediation deep-research with cli-codex executor.
---

# Deep Research Strategy — Codex Hook Contract

<!-- ANCHOR:topic -->
## 2. TOPIC
What is the exact Codex CLI (codex-cli 0.122.0) hook contract that `~/.codex/hooks.json` registers commands against? Specifically: (a) what stdin payload format do hook commands receive; (b) is stdout injected into the model context or is it purely terminal-notification; (c) what do exit codes mean (block vs log-only); (d) what's the timeout budget; (e) when multiple hooks are registered for one event, is execution serial/parallel and in what order; (f) what's the full event taxonomy beyond SessionStart/UserPromptSubmit/Stop; (g) can a UserPromptSubmit hook decline/transform the prompt before it reaches the model (Claude's "blocker" pattern); (h) do hooks run with full env vars?

---

<!-- /ANCHOR:topic -->
<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Q1: What stdin payload format (JSON, plain text, empty) does codex pass to SessionStart hook commands, and UserPromptSubmit hook commands?
- [ ] Q2: When a hook writes to stdout, does the content get injected into the model's context for the current turn? If yes — prepended, appended, or replacing? If no — is it purely notification/logged?
- [ ] Q3: Exit code semantics: does non-zero abort the turn (Claude's blocker pattern), short-circuit, or just log a warning?
- [ ] Q4: Timeout budget — how long before codex considers a hook stuck and kills/skips it? What happens on timeout?
- [ ] Q5: Concurrency/ordering when multiple hooks are registered for one event: serial in registration order? Parallel? Undefined?
- [ ] Q6: What events does codex expose beyond SessionStart/UserPromptSubmit/Stop (e.g., PostToolUse, PreCompact, PreToolUse, Error)?
- [ ] Q7: Can a UserPromptSubmit hook decline or transform the user's prompt before it's passed to the model (like Claude's blocking pattern)?
- [ ] Q8: Do hooks inherit the full parent env (HOME, PATH, OPENAI_API_KEY, custom env vars) or a sanitized subset?

---

<!-- /ANCHOR:key-questions -->
<!-- ANCHOR:non-goals -->
## 4. NON-GOALS
- Implementation (this is the research/contract phase; port is Phase 2 work after this converges).
- Parity for Copilot CLI (sibling phase 007, separate research).
- Modifying ~/.codex/hooks.json in a way that breaks the existing Superset notify.sh wiring.
- Modifying the root project AGENTS.md.

---

<!-- /ANCHOR:non-goals -->
<!-- ANCHOR:stop-conditions -->
## 5. STOP CONDITIONS
- All 8 key questions answered with ≥2 primary-source citations OR documented empirical probe results.
- Rolling avg newInfoRatio < 0.05 for 3 consecutive iterations.
- Max 10 iterations.

---

<!-- /ANCHOR:stop-conditions -->
<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
Pre-research confirmed:
- Codex CLI supports hooks natively (schema shape matches Claude Code).
- Three events wired locally today: SessionStart, UserPromptSubmit, Stop.
- codex exec reads prompts from stdin with `- <` shell redirection or plain `< file`.

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
## 9. EXHAUSTED APPROACHES
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
Q1 + Q2: probe the stdin payload format and stdout injection semantics. Two paths: (a) fetch official Codex CLI docs at developers.openai.com/codex for hooks documentation; (b) install a throwaway test hook at /tmp/codex-probe-hook.sh registered alongside notify.sh in ~/.codex/hooks.json, run a codex session, observe what stdin it receives and whether stdout appears in the model's context.

---

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->
<!-- ANCHOR:known-context -->
## 12. KNOWN CONTEXT

### Pre-research discoveries (empirically verified 2026-04-22)

**~/.codex/hooks.json** (630 bytes):
```json
{"hooks":{
  "SessionStart":     [{"hooks":[{"type":"command","command":"/Users/michelkerkmeester/.superset/hooks/notify.sh"}]}],
  "UserPromptSubmit": [{"hooks":[{"type":"command","command":"/Users/michelkerkmeester/.superset/hooks/notify.sh"}]}],
  "Stop":             [{"hooks":[{"type":"command","command":"/Users/michelkerkmeester/.superset/hooks/notify.sh"}]}]
}}
```

**codex exec flags** (codex-cli 0.122.0):
- `-c key=value` — config override (used for model_reasoning_effort, service_tier, approval_policy)
- `-c model_reasoning_effort="high"` — reasoning depth
- `-c service_tier="fast"` — fast tier (explicit, never rely on config default)
- `-c approval_policy=never` — non-interactive, auto-approve
- `--sandbox workspace-write` — filesystem writes allowed in workspace
- `--config-dir <dir>` — override ~/.codex
- stdin: instructions read from stdin when piped; `< file` redirection works

**User runtime setup**:
- ~/.codex/config.toml has `personality = "friendly"`, `[features] multi_agent=true, memories=false, code_mode=true`
- Spec Kit Memory MCP registered in config.toml
- ~/.codex/AGENTS.md symlinked to <repo>/.codex/AGENTS.md (voice addendum from spec 046)

### Related prior work

- Spec 020 shipped the Claude hook wiring at `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts`. Reference implementation for the port.
- Sibling phase 007 is researching Copilot CLI parity (separate transport, separate contract).

---

<!-- /ANCHOR:known-context -->
<!-- ANCHOR:research-boundaries -->
## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 15 min
- Executor: `cli-codex` with gpt-5.4, reasoning high, service_tier fast, sandbox workspace-write
- Sandbox=workspace-write means Codex CAN run empirical probes (install test hooks, run codex sessions) — unlike Copilot which was read-only research
- Progressive synthesis: true
- Machine-owned sections: reducer owns §3, §6, §7-11
- Current generation: 1
<!-- /ANCHOR:research-boundaries -->
