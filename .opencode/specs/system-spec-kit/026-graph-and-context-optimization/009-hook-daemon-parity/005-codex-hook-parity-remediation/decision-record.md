---
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record + level3-arch | v2.2 -->"
title: "Decision Record: Codex CLI Hook Parity Remediation"
description: "ADRs for scoping decisions. Contract ADR (ADR-003) lands after Phase 1 probe completes."
trigger_phrases:
  - "026/009/005 adr"
  - "codex hook parity decisions"
importance_tier: "high"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/005-codex-hook-parity-remediation"
    last_updated_at: "2026-04-23T13:55:57Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Independent review and live re-verification — all claims hold"
    next_safe_action: "Run strict validation and memory save"
    completion_pct: 100
---
# Decision Record: Codex CLI Hook Parity Remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record + level3-arch | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Scope this as implementation-heavy, not investigation-heavy

**Status**: Accepted

### Context

**Context**: Sibling phase 004 (Copilot hook parity) is investigation-heavy because the existence of any hook transport is the research question. Here, the opposite is true — `~/.codex/hooks.json` visibly exists on the user's system, wires SessionStart / UserPromptSubmit / Stop, and uses the same schema shape as Claude (`{"hooks": {"<EventName>": [{"hooks": [{"type":"command", "command":"<path>"}]}]}}`). Only Superset's notify.sh is registered — no Spec Kit Memory hook was ever wired.

**Decision**: Structure this phase as Phase 1 (tight contract investigation, 2-4 iterations) + Phase 2 (port + register + test) + Phase 3 (document). Budget Phase 1 for confirming the contract details (stdin payload, stdout injection semantics, exit code, timeout, ordering) rather than establishing transport existence.

### Consequences

**Consequences**:
- **Positive**: implementation can proceed sooner than sibling 004; REQ-003 should be reachable within days of this phase starting.
- **Positive**: Phase 1 research artifact doubles as a durable hook-authoring reference, benefiting future hook authors.
- **Negative**: if Phase 1 uncovers a hard constraint (e.g., hook stdout is purely notification and not injected into model context), phase scope expands to include a workaround — treated as outcome B in contingency planning.

---

### ADR-002: Do not modify the existing Superset notify.sh hook

**Status**: Accepted

**Context**: `~/.codex/hooks.json` currently wires Superset's `~/.superset/hooks/notify.sh` for three events. Superset is the user's personality/agent-system layer. Modifying or replacing those entries could break other user workflows we don't own.

**Decision**: Append new Spec Kit Memory hook entries alongside the existing notify.sh entries. Never modify, replace, or remove the notify.sh lines. Use the outer-array shape that Codex already supports for multiple hooks per event. Back up `hooks.json` before any edit (T-15).

**Consequences**:
- **Positive**: Superset notify.sh continues firing exactly as before (REQ-005, SC-004).
- **Positive**: reversible — removing our entries returns the file to its original state.
- **Negative**: we inherit whatever ordering/concurrency semantics Codex uses for multiple hooks on one event. Phase 1 must probe these so the Spec Kit Memory hook does the right thing regardless of ordering (e.g., idempotent, does not race on shared files).

---

### ADR-003: Hook contract + implementation path - outcome A (full parity)

**Status**: Accepted (2026-04-22) — classified from 10-iteration deep-research synthesis in `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/005-codex-hook-parity-remediation/research/007-deep-review-remediation-pt-02/research.md`.

**Context**: 10 deep-research iterations via cli-codex (with workspace-write sandbox enabling empirical probes) fully mapped the Codex CLI 0.122.0 hook contract. The research confirmed — via official docs, generated JSON schemas, upstream Rust source, AND an isolated `CODEX_HOME` probe on 0.122.0 — that **Codex hooks DO inject stdout into the model context as `role: "developer"` messages**. This is the exact capability Claude's hooks provide and Copilot's hooks lack (see sibling phase 004).

The only operational constraint: hooks require `[features] codex_hooks = true` in `~/.codex/config.toml`. The user's current config does not have this flag set, which means the existing Superset `notify.sh` registrations in `~/.codex/hooks.json` are currently inert. Flipping the flag activates them + any new registrations.

**Decision**: Accept **outcome A (full hook parity)**. Primary path: port `hooks/claude/user-prompt-submit.ts` to `hooks/codex/user-prompt-submit.ts`, add a `session-start.ts` sibling, register both in `~/.codex/hooks.json` alongside the existing notify.sh entries, and enable the feature flag. Estimated effort: 2-3 days.

**Contract probe results (real entries from research)**:

| Aspect                | Codex actual (0.122.0, probed)                                                                                  | Evidence |
|-----------------------|-----------------------------------------------------------------------------------------------------------------|----------|
| stdin payload shape   | JSON object. SessionStart: `{cwd, hook_event_name, model, permission_mode, session_id, source, transcript_path}`. UserPromptSubmit adds `prompt`, `turn_id`. `additionalProperties: false`. | Generated schemas + empirical probe |
| stdout → model context | **YES** — plain stdout OR JSON `{hookSpecificOutput:{additionalContext:"..."}}` becomes a `role:"developer"` message. | `session_start.rs` + `user_prompt_submit.rs` + probe transcripts |
| stdout placement      | SessionStart context: BEFORE user prompt. UserPromptSubmit context: AFTER user message, as developer-role item. | `hook_runtime.rs` + probe transcripts |
| Exit code 0           | Success. stdout injected.                                                                                       | Docs + probe |
| Exit code 2 + stderr  | UserPromptSubmit BLOCKER path — `status: Blocked`, `should_stop: true`, stderr as reason. Turn aborts. | `user_prompt_submit.rs` + probe |
| Exit code other       | Hook marked failed (e.g. "hook exited with code N"). Turn CONTINUES (fail-open).                                | `user_prompt_submit.rs` + probe exit-1 test |
| Timeout budget        | Per-hook `timeout`/`timeoutSec` (seconds). Default 600s. `timeout_sec.unwrap_or(600).max(1)`. On timeout: empty result, turn continues. | `discovery.rs` + `command_runner.rs` + probe |
| Multi-hook ordering   | **CONCURRENT** via `join_all`. NOT serial by registration order.                                                | `dispatcher.rs` |
| Event taxonomy        | 6 events: SessionStart, PreToolUse, PermissionRequest, PostToolUse, UserPromptSubmit, Stop.                     | Docs + `discovery.rs` + schemas |
| Prompt transformation | **NOT SUPPORTED**. No `updatedInput` field in UserPromptSubmit output schema (`additionalProperties: false`).   | Generated output schema |
| Env propagation       | **INHERITED** from parent. No `env_clear`. `HOME`, `PATH` (Codex-augmented), `OPENAI_API_KEY`, custom env all visible. `shell_environment_policy` does NOT apply to hooks. | `command_runner.rs` + Rust stdlib + probe |
| Feature flag          | `[features] codex_hooks = true` REQUIRED in config.toml. Hooks silent without it. User's config currently lacks this flag. | Docs + empirical probe (no-fire without flag) |

**Alternatives considered (real entries)**:

| # | Implementation path                                                                 | Feasibility | Eng. cost    | Runtime cost | Coverage                                          | Recommended |
|---|-------------------------------------------------------------------------------------|-------------|--------------|--------------|---------------------------------------------------|-------------|
| 1 | **Full native hook port**: port Claude's `user-prompt-submit.ts` to `hooks/codex/`, add `session-start.ts` sibling, register in `hooks.json` alongside notify.sh, enable `codex_hooks = true` | **HIGH** (transport + contract proven) | Low-Medium (~2-3 days) | Negligible per-event | Full parity: SessionStart + UserPromptSubmit, both injected as dev-role messages, both interactive and programmatic | **Yes — primary** |
| 2 | SessionStart only (skip UserPromptSubmit) | High | Low (~1 day) | Negligible | Startup context only; no per-prompt advisor brief | No — option 1 includes this for same cost |
| 3 | AGENTS.md-only static context via spec 046 mechanism | High (already deployed) | Zero | None | Static tone/voice; doesn't carry dynamic advisor brief | No — doesn't solve the actual gap |
| 4 | Shell wrapper around `codex exec -p` with prepended brief | Medium | Low | Per-call | Programmatic only; option 1 covers interactive TUI too | No — option 1 beats it |
| 5 | Document limitation, no action | Zero | Zero | None | Zero parity | No — full native parity is achievable |

**Consequences**:
- **Positive**: Phase 2 has a clear, low-risk, bounded implementation path (~2-3 days). No new research needed.
- **Positive**: Parity matches Claude Code exactly — in-turn developer-role message injection, same semantics users already expect.
- **Positive**: The parent research contract spec doubles as the cli-codex hook contract reference for future Codex hook authors (REQ-011).
- **Positive**: `sandbox workspace-write` enabled the codex research agent to run actual empirical probes — verified behavior that sibling phase 004 (copilot, docs-only research) could not.
- **Negative**: Enabling `codex_hooks = true` activates the existing Superset notify.sh simultaneously. User must confirm whether notify.sh side-effects are acceptable before Phase 2 — or we pre-remove notify.sh entries / modify it to no-op on Codex events.
- **Negative**: Codex docs mark hooks "experimental" — future Codex releases could change schema. Risk is minor (schemas are stable for 0.122.0 through probe) but worth tracking.
- **Negative**: Hooks run concurrently with notify.sh per the `join_all` dispatcher. The Spec Kit hook must be idempotent and must not race on shared resources. Design directive: stdout-only, no disk writes.

**References**:
- Full synthesis: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/005-codex-hook-parity-remediation/research/007-deep-review-remediation-pt-02/research.md` — §5 decision matrix, §6 recommended plan, §7 implementation considerations.
- Primary-source URLs: 40+ in the parent research synthesis across developers.openai.com/codex, openai/codex repo source files, generated schemas, Rust stdlib docs.
- Reference implementation (Claude-side): `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts`.

---

### ADR-004: Ship native Codex SessionStart + UserPromptSubmit hooks

**Status**: Accepted and implemented (2026-04-22).

**Context**: ADR-003 confirmed full parity was possible. Live validation on Codex CLI 0.122.0 also showed the feature flag was still disabled in `~/.codex/config.toml`, and `~/.codex/hooks.json` only contained Superset notification commands.

**Decision**: Implement the full native path:

1. Keep the existing Superset `notify.sh` entries untouched.
2. Add Spec Kit Memory hook commands for `SessionStart` and `UserPromptSubmit` beside the existing notification entries.
3. Emit Codex-native JSON output with `hookSpecificOutput.additionalContext`.
4. Enable `[features].codex_hooks = true` in `~/.codex/config.toml`.
5. Document the stable authoring contract in `.opencode/skill/cli-codex/references/hook_contract.md`.

**Evidence**:

| Check | Result |
|-------|--------|
| Build | `npm run build` passed in `.opencode/skill/system-spec-kit/mcp_server`. |
| Focused tests | `npx vitest run tests/codex-session-start-hook.vitest.ts tests/codex-user-prompt-submit-hook.vitest.ts tests/claude-user-prompt-submit-hook.vitest.ts` passed: 3 files, 22 tests. |
| Direct SessionStart smoke | Emitted `hookSpecificOutput.hookEventName="SessionStart"` with startup context and code graph metrics in 42.22ms. |
| Direct UserPromptSubmit smoke | Emitted `Advisor: stale; use sk-code-opencode 0.92/0.12 pass.` in 71ms. |
| Live feature flag | `codex features list` reports `codex_hooks ... true`. |
| Real Codex smoke | `codex exec --json --ephemeral` returned `HOOK_SMOKE_OK` with 28,265 input tokens, exercising the actual CLI hook path. |

**Consequences**:
- **Positive**: Codex now has the same dynamic startup context and prompt-time advisor brief surface that Claude already had.
- **Positive**: The implementation is stdout-only for hook payloads and avoids disk writes in hook execution, which keeps concurrent hook dispatch safe.
- **Positive**: Superset notification behavior remains registered for SessionStart, UserPromptSubmit, and Stop.
- **Risk**: Codex hooks are still marked under development by the CLI feature list. The cli-codex hook contract reference includes source links and smoke checks so future breakage can be diagnosed quickly.

---

### Cross-References

- **Spec**: `spec.md` §2 (problem), §4 (requirements)
- **Plan**: `plan.md` §2 Phase 1 exit criteria
- **Tasks**: `tasks.md` T-01..T-08 (investigation to contract), T-11..T-16 (port plus register), T-19 (hook contract reference)
- **Research artifact**: parent research synthesis
- **Sibling phase**: `../004-copilot-hook-parity-remediation/` — contrast: Copilot's phase is investigation-heavy, no confirmed hook transport
- **Referenced hook-daemon parity packet**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/` — active hook surface lineage
- **External evidence**: `~/.codex/hooks.json` (inspected 2026-04-22)
<!-- /ANCHOR:adr-001 -->
