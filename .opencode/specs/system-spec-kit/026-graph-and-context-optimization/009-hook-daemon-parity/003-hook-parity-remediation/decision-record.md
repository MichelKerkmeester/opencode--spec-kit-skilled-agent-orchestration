---
title: "029 — Hook Parity Remediation Decisions"
description: "Architecture decisions for Phase 029 hook remediation. Each ADR lists context, decision, consequences, and alternatives rejected."
trigger_phrases:
  - "029 decisions"
  - "hook parity adr"
importance_tier: "high"
contextType: "decision-record"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/003-hook-parity-remediation"
    last_updated_at: "2026-04-21T10:20:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored 6 ADRs for 029"
    next_safe_action: "Codex references ADRs during implementation"
    completion_pct: 10
---

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core | v2.2 -->

# Decision Record

<!-- ANCHOR:adr-001 -->
## ADR-001 — Minimal `session_resume` returns `opencodeTransport`

**Context**
The OpenCode plugin bridge invokes `session_resume --minimal` to avoid heavy memory enrichment, but the plugin parser requires `data.opencodeTransport.transportOnly === true` to emit any injection. The minimal branch currently returns before building the transport, so the plugin silently no-ops. Option (i): remove `--minimal`, accept latency cost. Option (ii): make minimal include transport.

**Decision**
Keep `--minimal` AND return `opencodeTransport`. Transport payload is lightweight (metadata only — no memory content). The latency win of `--minimal` is about skipping `session_resume`'s heavy memory retrieval, not about skipping plugin-contract fields. Extract a `buildOpencodeTransport(state, { minimal })` helper; call it from both branches.

### Consequences
- Plugin injection works under the current bridge path without changing bridge invocation.
- Helper extraction keeps non-minimal behavior identical (snapshot-tested).
- Plugin tests gain a real-bridge contract test that would catch future regressions of the same shape.

**Rejected alternatives**
- Removing `--minimal`: worse latency and plugin bridge still doesn't validate the real shape.
- Teaching the plugin parser to treat missing transport as "ok, no injection": hides actionable failures and leaves operators debugging a silent no-op.
<!-- /ANCHOR:adr-001 -->

<!-- ANCHOR:adr-002 -->
## ADR-002 — Remove `context-prime` claim; document `session_bootstrap` as Codex startup recovery

**Context**
`024/030/implementation-summary.md:143` claims Codex has startup parity via a `context-prime` agent. No `.codex/agents/context-prime.toml` exists. Operators reading the packet believe Codex has an automatic startup surface equivalent to Claude `SessionStart`, which it does not.

**Decision**
Remove the `context-prime` claim from packet docs. Codex startup recovery is operator-driven via `session_bootstrap` MCP tool, per `INSTALL_GUIDE.md:137`. This truth matches both the CLI's current capability (no native SessionStart hook) and the actually-wired recovery path.

Stretch option: create `.codex/agents/context-prime.toml` that aliases `session_bootstrap`. Deferred — adds complexity for zero runtime improvement (operator still runs a tool manually either way).

### Consequences
- Packet docs stop misleading operators about Codex auto-recovery.
- `.opencode/skill/system-spec-kit/references/config/hook_system.md` matrix shows Codex as `prompt-hook: yes, lifecycle: no`.
- Any future `SessionStart` capability in Codex CLI can add the hook without a doc retraction.

**Rejected alternatives**
- Creating the TOML anyway: unproductive indirection, still requires operator invocation.
- Keeping the claim and updating docs to "partial parity": ambiguous phrasing, operators still misread.
<!-- /ANCHOR:adr-002 -->

<!-- ANCHOR:adr-003 -->
## ADR-003 — Copilot `sessionStart` routes to repo-local wrapper with inline Superset fan-out

**Context**
Phase 031 implementation-summary claims `sessionStart` was replaced with a repo-local wrapper, but the checked-in `.github/hooks/superset-notify.json` still routes directly to `/Users/michelkerkmeester/.superset/hooks/copilot-hook.sh`. Operators lose the repo-local code-graph banner. Two possible fixes: (i) route JSON to wrapper; wrapper fans out to Superset. (ii) Keep direct Superset route; give up on repo-local banner.

**Decision**
Route JSON to the repo-local wrapper (option i). The wrapper already fans out to Superset at `session-start.sh:41`, so Superset behavior is preserved while the repo-local code-graph banner is restored. Tests assert the wrapper route so this cannot silently regress.

### Consequences
- Copilot users see the repo-local startup digest as intended.
- Superset fan-out preserved (no operator workflow change).
- Phase 031 summary truth matches checked-in JSON.

**Rejected alternatives**
- Option ii: contradicts Phase 031 intent; loses the code-graph startup signal that the wrapper was designed to produce.
- Parallel routing (call both from the JSON): duplicates work and risks timing races.
<!-- /ANCHOR:adr-003 -->

<!-- ANCHOR:adr-004 -->
## ADR-004 — Codex hook timeout: stale-advisory fallback, not silent fail-open

**Context**
Codex `UserPromptSubmit` hook currently spawns the Python advisor subprocess with a 1000ms timeout. Cold starts exceed this, the subprocess is SIGKILLed, and the hook returns `{}` with `status:"fail_open"` + `errorCode:"SIGNAL_KILLED"`. The model receives no advisor context and no signal that an advisory was attempted.

Three options:
(i) Extend timeout to ~3000ms and accept slower hook.
(ii) Use the native TS scorer path when available, Python only as fallback.
(iii) Return a prompt-safe stale advisory instead of silent `{}`.

**Decision**
Implement all three, layered:
1. Native-first: if `skill-advisor/` native scorer is reachable, use it. Zero subprocess overhead.
2. Timeout extended to `SPECKIT_CODEX_HOOK_TIMEOUT_MS` default `3000ms`. Configurable so operators can tune.
3. On timeout: return `hookSpecificOutput.additionalContext: "Advisor: stale (cold-start timeout)"` with `status:"stale"` diagnostic. Never silent `{}`.

### Consequences
- Cold-start path: 3s budget is large enough for current advisor bench numbers.
- Warm path: native scorer keeps hook under ~50ms.
- Failure mode: operator sees `Advisor: stale` in context rather than nothing; debuggable.
- Subprocess still used when native path unavailable (backwards compat).

**Rejected alternatives**
- Option (i) alone: doesn't help hot-path latency; leaves native code unused.
- Option (ii) alone: Python fallback still needed for installs without daemon; cold-start gap unfixed.
- Option (iii) alone: doesn't fix the timeout itself, just makes the failure visible.
<!-- /ANCHOR:adr-004 -->

<!-- ANCHOR:adr-005 -->
## ADR-005 — PreToolUse policy reads both `bashDenylist` and `bash_denylist` aliases

**Context**
`.codex/policy.json:3` advertises both `bashDenylist` and `bash_denylist` as accepted keys, but `CodexPolicyFile` type and `loadPolicy()` only read `bashDenylist`. An operator writing `bash_denylist` silently gets no denylist. Additionally, `bashCommandFor()` reads `command` / `tool_input.command` / `input.command`, but not `toolInput.command` (camelCase) — Codex CLI payloads vary by runtime.

**Decision**
- `loadPolicy()` merges `policy.bashDenylist ?? []` with `policy.bash_denylist ?? []`.
- `bashCommandFor()` accepts `command`, `tool_input.command`, `toolInput.command`, `input.command`.
- Default denylist includes bare `git reset --hard` (prefix match) so destructive commands are denied regardless of branch suffix.

### Consequences
- Operator policy files work as documented.
- Payload casing drift across Codex CLI versions is absorbed.
- Baseline safety improves against a common destructive pattern.

**Rejected alternatives**
- Canonicalize on one casing: breaks existing operator workflows silently.
- Add only default denylist expansion without fixing alias/casing: leaves two of the three issues unfixed.
<!-- /ANCHOR:adr-005 -->

<!-- ANCHOR:adr-006 -->
## ADR-006 — PreToolUse hook must not perform filesystem writes

**Context**
`ensurePolicyFile()` creates `.codex/policy.json` with defaults if missing. It runs from inside `loadPolicy()`, which runs on every hook invocation. A read/enforce gate performing a write-side-effect is surprising and unsafe in read-only environments (CI, sandboxed evaluation, read-only clones).

**Decision**
Hook runtime path is read-only:
- `loadPolicy()` returns in-memory defaults when the file is missing; logs `status:"in_memory_default"` to stderr.
- Policy file creation moves to `session_bootstrap` MCP tool (or a standalone `npm run setup:codex-policy` script) — explicit operator action, not a side-effect of `PreToolUse`.

### Consequences
- `PreToolUse` is now purely read-only; safe in constrained environments.
- First-run operators need to explicitly bootstrap (covered by `session_bootstrap` or install guide).
- Missing-file scenario is still safe (defaults applied) — no degradation vs current behavior.

**Rejected alternatives**
- Guard with an env flag (e.g., `SPECKIT_CODEX_READONLY=1`): increases surface area; easy to forget.
- Leave write path in place: violates principle-of-least-surprise for a hook surface.
<!-- /ANCHOR:adr-006 -->

## Future ADRs (out of scope for 029)

- Codex `SessionStart` lifecycle hook parity — pending CLI capability.
- Advisor subprocess retirement / full native bridge — tracked post-027.
- Gemini hook deep-smoke + parity matrix — separate phase.
