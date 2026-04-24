---
title: "...ization/009-hook-package/005-codex-hook-parity-remediation/research/007-deep-review-remediation-pt-02/research]"
description: "Synthesis of 10 iterations investigating the exact Codex CLI 0.122.0 hook contract (stdin payload, stdout-to-model-context injection, exit codes, timeouts, concurrency, event taxonomy, env propagation). Outcome: A (full parity achievable) — Codex hooks DO inject stdout as developer-role messages, exactly the behavior needed to mirror Claude's SessionStart + UserPromptSubmit payloads."
trigger_phrases:
  - "ization"
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
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-package/005-codex-hook-parity-remediation/research/007-deep-review-remediation-pt-02"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["research.md"]
---
# Deep Research Synthesis — Codex CLI Hook Parity Contract

**Spec phase**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/005-codex-hook-parity-remediation/`
**Research packet**: `007-deep-review-remediation-pt-02/`
**Iterations**: 10 (all completed; newInfoRatio trajectory 0.90 → 0.10 over final 7 iterations)
**Executor**: `cli-codex` with gpt-5.4, reasoning `high`, service_tier `fast`, sandbox `workspace-write`
**Outcome**: **A (full hook parity achievable)**

---

## 1. EXECUTIVE SUMMARY

**The research question**: what is the exact Codex CLI 0.122.0 hook contract — stdin payload format, stdout-to-model-context semantics, exit-code behavior, timeout budget, multi-hook concurrency, event taxonomy, env propagation — so we can port the Claude-side `hooks/claude/user-prompt-submit.ts` to `hooks/codex/` without shipping against assumptions?

**Short answer**: **Codex hooks DO inject stdout into the model context as developer-role messages.** This is the key capability copilot CLI lacks (per sibling phase 007). The injection surface is exactly what Claude's `SessionStart` + `UserPromptSubmit` hooks do. Full parity is achievable with a straightforward port.

The contract, confirmed across official docs + generated schemas + upstream Rust source + a working empirical probe on 0.122.0:

- **Transport**: `tokio::process::Command` with piped stdin, writes a serialized JSON object containing event-specific fields.
- **stdin schema (SessionStart)**: `{cwd, hook_event_name:"SessionStart", model, permission_mode, session_id, source: "startup"|"resume"|"clear", transcript_path}` — `additionalProperties: false`.
- **stdin schema (UserPromptSubmit)**: `{cwd, hook_event_name:"UserPromptSubmit", model, permission_mode, prompt, session_id, transcript_path, turn_id}` — `additionalProperties: false`.
- **stdout contract**: plain text stdout OR JSON `{hookSpecificOutput: {additionalContext: "..."}}` — both become a `role: "developer"` message in the transcript. SessionStart context is recorded BEFORE the user prompt; UserPromptSubmit context AFTER.
- **Exit codes**: `0` = success + inject stdout. `2` + stderr text = block/decline (UserPromptSubmit only — aborts the turn with the stderr as reason). Other non-zero = hook failed, but turn continues (fail-open).
- **Timeout**: per-hook `timeout` or `timeoutSec` field (seconds); default 600s. On timeout, hook result is empty; turn continues.
- **Concurrency**: multiple matching hooks for one event run concurrently via `join_all`, NOT serial by registration order.
- **Events (6 total)**: `SessionStart`, `PreToolUse`, `PermissionRequest`, `PostToolUse`, `UserPromptSubmit`, `Stop`.
- **Environment**: inherits parent process env (no `env_clear` call in the command runner). Codex prepends arg0 directories to `PATH`.
- **Feature flag required**: `[features] codex_hooks = true` in `~/.codex/config.toml`. **Hooks do not fire without this flag** — this was confirmed empirically: on 0.122.0, the user's existing `hooks.json` registrations are currently inert because the flag is absent from their `config.toml`.

**Classification**: **Outcome A (full parity)** per `plan.md` §2 Phase 1 exit criteria. Phase 2 (port + register) can proceed immediately.

---

## 2. KEY FINDINGS (PRIMARY-SOURCE-CITED)

### F1. Command hooks receive one JSON object on stdin (not argv, not plain text)

`tokio::process::Command` is spawned with piped stdin; the serialized `SessionStartCommandInput` / `UserPromptSubmitCommandInput` Rust structs are written to the child's stdin via `write_all(input_json.as_bytes())`. The user's prompt is passed in the JSON `prompt` field, NOT as raw stdin text. `additionalProperties: false` in the generated schemas — unknown fields rejected.

**Sources**:
- Docs: [Codex hooks (developers.openai.com)](https://developers.openai.com/codex/hooks)
- Schema: [session-start.command.input.schema.json](https://raw.githubusercontent.com/openai/codex/main/codex-rs/hooks/schema/generated/session-start.command.input.schema.json)
- Schema: [user-prompt-submit.command.input.schema.json](https://raw.githubusercontent.com/openai/codex/main/codex-rs/hooks/schema/generated/user-prompt-submit.command.input.schema.json)
- Source: [command_runner.rs](https://github.com/openai/codex/blob/main/codex-rs/hooks/src/engine/command_runner.rs)
- Empirical: `codex-cli 0.122.0` isolated `CODEX_HOME` probe; observed stdin JSON matched schema exactly.

### F2. stdout IS injected into model-visible context as developer-role messages

**THIS IS THE CAPABILITY COPILOT LACKS.** For both `SessionStart` and `UserPromptSubmit`:

- Plain text stdout → added as extra developer context.
- JSON stdout with `{hookSpecificOutput: {additionalContext: "..."}}` → additionalContext value added as extra developer context.
- Stdout that LOOKS like JSON but fails to match the output schema → hook marked failed (not silently injected).

Source-level: both event parsers append accepted context into `additional_contexts_for_model`. `SessionStart` has a test literally named `plain_stdout_becomes_model_context`. The runtime path is `DeveloperInstructions::new(additional_context).into()` per upstream issue #16486 — confirming developer-role injection, not system-prompt replacement and not prompt substitution.

**Placement (verified empirically on 0.122.0)**:
- `SessionStart` context: recorded as a `role: "developer"` transcript item BEFORE the user prompt.
- `UserPromptSubmit` context: recorded AFTER the user message, as an additional developer-role transcript item visible to the model on the same turn.

**Sources**:
- Docs: [Codex hooks](https://developers.openai.com/codex/hooks)
- Source: [session_start.rs parser](https://github.com/openai/codex/blob/main/codex-rs/hooks/src/events/session_start.rs)
- Source: [user_prompt_submit.rs parser](https://github.com/openai/codex/blob/main/codex-rs/hooks/src/events/user_prompt_submit.rs)
- Source: [hook_runtime.rs (runtime injection path)](https://github.com/openai/codex/blob/main/codex-rs/core/src/hook_runtime.rs)
- Schema: [user-prompt-submit.command.output.schema.json](https://raw.githubusercontent.com/openai/codex/main/codex-rs/hooks/schema/generated/user-prompt-submit.command.output.schema.json)
- Upstream context: [issue #16486](https://github.com/openai/codex/issues/16486)
- Empirical: 0.122.0 probe — stdout observed as `role: "developer"` in transcript items.

### F3. Exit codes — `2` is the UserPromptSubmit blocker signal

- **Exit 0**: success. stdout (plain or JSON additionalContext) is injected.
- **Exit 2** + non-empty stderr: `UserPromptSubmit`-specific blocker path. Source sets `status: Blocked`, `should_stop: true`, captures stderr as reason. Turn aborts. Empirically confirmed: a probe registered with `exit 2` on UserPromptSubmit caused Codex to emit `turn.completed` with zero model tokens and the user prompt was not recorded as a user response item before completion.
- **Other non-zero** (e.g., exit 1): hook marked failed with "hook exited with code N" but turn continues (fail-open). Empirically verified on 0.122.0.

`PermissionRequest` has its own parallel decision contract (JSON `{"decision":"deny", "reason":"..."}` or exit 2; any deny wins over allow). `PreToolUse` has an `updatedInput` field but it's parsed-but-unsupported and fails open.

**Sources**:
- Docs: [Codex hooks](https://developers.openai.com/codex/hooks)
- Source: [user_prompt_submit.rs](https://github.com/openai/codex/blob/main/codex-rs/hooks/src/events/user_prompt_submit.rs)
- Source: [permission_request.rs](https://raw.githubusercontent.com/openai/codex/main/codex-rs/hooks/src/events/permission_request.rs)
- Source: [output_parser.rs](https://raw.githubusercontent.com/openai/codex/main/codex-rs/hooks/src/engine/output_parser.rs)
- Empirical: 0.122.0 probe transcripts.

### F4. No prompt transformation for UserPromptSubmit

The `UserPromptSubmit` output schema has `additionalProperties: false` and includes only: common fields, legacy `decision`/`reason`, `hookSpecificOutput.additionalContext`. There is NO `updatedInput` or equivalent prompt-rewrite field. The generated schema rejects such fields. Hooks can INJECT additional developer context alongside the user's prompt, BLOCK the prompt, but cannot REPLACE the prompt.

**Sources**:
- Schema: [user-prompt-submit.command.output.schema.json](https://raw.githubusercontent.com/openai/codex/main/codex-rs/hooks/schema/generated/user-prompt-submit.command.output.schema.json)
- Source: [user_prompt_submit.rs](https://github.com/openai/codex/blob/main/codex-rs/hooks/src/events/user_prompt_submit.rs)
- Docs: [Codex hooks](https://developers.openai.com/codex/hooks)

### F5. Timeout: per-hook `timeout`/`timeoutSec` in seconds, default 600s, fail-open on timeout

Source: `timeout_sec.unwrap_or(600).max(1)`. On timeout, `tokio::time::timeout` returns error text `hook timed out after Ns`. Command runner produces no exit code, empty stdout/stderr. Event parsers treat that as failed-hook-run unless the event has already produced a supported decision. Empirically confirmed on 0.122.0: a `UserPromptSubmit` hook with `"timeout": 1` sleeping 5s caused Codex to record the user message after ~timeout and continue to the model request; the hook's post-sleep stdout was not injected.

**Sources**:
- Docs: [Codex hooks](https://developers.openai.com/codex/hooks)
- Source: [discovery.rs (timeout default)](https://raw.githubusercontent.com/openai/codex/main/codex-rs/hooks/src/engine/discovery.rs)
- Source: [command_runner.rs (timeout implementation)](https://github.com/openai/codex/blob/main/codex-rs/hooks/src/engine/command_runner.rs)
- Empirical: 0.122.0 timeout probe.

### F6. Multiple matching hooks run CONCURRENTLY (not serially by registration order)

Source: `execute_handlers` uses `futures::future::join_all(...)` to launch all matching handlers at once. Result aggregation preserves selected handler order for folding, but execution is parallel. Implication: when the user's existing Superset `notify.sh` and a new Spec Kit Memory hook are both registered for the same event, they run in parallel. Neither can prevent the other from starting. For this spec: Spec Kit Memory's hook must be idempotent and must not depend on notify.sh having already completed.

**Sources**:
- Docs: [Codex hooks](https://developers.openai.com/codex/hooks)
- Source: [dispatcher.rs](https://raw.githubusercontent.com/openai/codex/main/codex-rs/hooks/src/engine/dispatcher.rs)

### F7. Event taxonomy (6 events, schema-backed, docs-matched)

| Event | Can inject stdout? | Can block? | Reserved/unsupported fields |
|---|---|---|---|
| `SessionStart` | ✓ (plain or JSON additionalContext) | — | — |
| `UserPromptSubmit` | ✓ (plain or JSON additionalContext) | ✓ (exit 2 + stderr, or JSON decision:block) | `updatedInput` absent from schema |
| `PreToolUse` | — | ✓ (via decision surface) | `updatedInput` parsed-but-unsupported (fail-open) |
| `PermissionRequest` | — | ✓ (JSON decision:deny, or exit 2 + stderr) | `updatedInput`, `updatedPermissions`, `interrupt` reserved (fail-closed) |
| `PostToolUse` | — | — | — |
| `Stop` | — | — | — |

Discovery source enumerates exactly these six events. No undocumented events found.

**Sources**:
- Docs: [Codex hooks](https://developers.openai.com/codex/hooks)
- Source: [discovery.rs](https://raw.githubusercontent.com/openai/codex/main/codex-rs/hooks/src/engine/discovery.rs)
- Schemas: [generated/](https://github.com/openai/codex/tree/main/codex-rs/hooks/schema/generated)

### F8. Environment inherited from parent process

Command runner sets `current_dir(cwd)`, pipes stdio, and sets `kill_on_drop(true)`. It does NOT call `env_clear`, `env`, `envs`, or `env_remove`. Per Rust stdlib docs, absent those methods, `Command` inherits the current process environment. Codex prepends temporary arg0 directories to `PATH`.

Empirically confirmed on 0.122.0: probe hooks saw inherited `HOME`, `PATH` (with Codex augmentation), `OPENAI_API_KEY`, and a custom `CODEX_PROBE_CUSTOM_ENV`.

Note: Codex's MODEL-REQUESTED SHELL TOOL subprocess path is different (uses `env_clear()` + explicit env map via `spawn.rs`). The `shell_environment_policy.*` config governs shell tools, NOT hooks. So hooks get the un-sanitized parent env; shell tools get the sanitized per-policy env.

**Sources**:
- Source: [command_runner.rs](https://github.com/openai/codex/blob/main/codex-rs/hooks/src/engine/command_runner.rs)
- Source (contrast): [spawn.rs (shell tool env policy)](https://github.com/openai/codex/blob/main/codex-rs/core/src/spawn.rs)
- Rust stdlib: [std::process::Command docs](https://doc.rust-lang.org/std/process/struct.Command.html)
- Docs: [Codex config reference](https://developers.openai.com/codex/config-reference)
- Empirical: 0.122.0 env probe.

### F9. Feature flag: hooks require `[features] codex_hooks = true`

Empirically confirmed: on 0.122.0, hooks do NOT fire unless `[features] codex_hooks = true` is present in the effective `config.toml`. The user's current `~/.codex/config.toml` has `[features] multi_agent=true, memories=false, code_mode=true` — but `codex_hooks` is absent. That means the existing Superset `notify.sh` registrations in `~/.codex/hooks.json` are currently INERT (they don't fire). Adding `codex_hooks = true` will activate BOTH the existing notify.sh entries AND any new Spec Kit Memory entries added alongside.

Implication for Phase 2: enabling the flag will start firing the Superset notify.sh for every SessionStart/UserPromptSubmit/Stop event — a side-effect the user may or may not want. Confirm with the user before flipping the flag.

**Sources**:
- Docs: [Codex hooks](https://developers.openai.com/codex/hooks)
- Empirical: 0.122.0 probe — hooks silent without flag; fire correctly with flag.
- Local config inspection: `~/.codex/config.toml` (feature flag absent 2026-04-22).

---

## 3. ANSWERS TO KEY QUESTIONS (from spec.md §7)

| ID | Question | Answer | Finding |
|---|---|---|---|
| Q1 | stdin payload format? | JSON object. 7-field schema for SessionStart (+ `source` enum: startup/resume/clear); 8-field schema for UserPromptSubmit (+ `turn_id`, `prompt`). `additionalProperties: false`. Serialized via `serde_json::to_string` in upstream source. | F1 |
| Q2 | stdout → model context? | **YES.** Plain stdout OR JSON `hookSpecificOutput.additionalContext` becomes a `role: "developer"` message. SessionStart context before user prompt; UserPromptSubmit context after. | F2 |
| Q3 | Exit-code semantics? | `0` = success + inject. `2` + stderr = UserPromptSubmit blocker (status: Blocked, should_stop: true). Other non-zero = fail-open (hook marked failed, turn continues). | F3 |
| Q4 | Timeout behavior? | Per-hook `timeout` or `timeoutSec` field (seconds). Default 600s. On timeout: empty result, turn continues (fail-open for the hook). | F5 |
| Q5 | Multi-hook ordering? | Concurrent via `join_all`, NOT serial. Aggregation preserves handler order for folding but execution is parallel. | F6 |
| Q6 | Full event taxonomy? | 6 events: `SessionStart`, `PreToolUse`, `PermissionRequest`, `PostToolUse`, `UserPromptSubmit`, `Stop`. Schema-backed. | F7 |
| Q7 | Prompt transformation? | **No.** `UserPromptSubmit` output schema has no `updatedInput` field. Can inject additionalContext alongside prompt or block the prompt, but not replace it. | F4 |
| Q8 | Env propagation? | Inherited from parent (no env_clear). `HOME`, `PATH` (Codex-augmented), `OPENAI_API_KEY`, custom env vars all visible. `shell_environment_policy` config governs shell tools, NOT hooks. | F8 |

**Plus one un-questioned discovery**: **F9 — feature flag `codex_hooks = true` required.** Not in the original questions but material to Phase 2 implementation.

---

## 4. OUTCOME CLASSIFICATION — A (Full hook parity)

**Classification**: **A** per `plan.md` §2 Phase 1 exit criteria.

**Rationale**:
- Transport exists ✓ (hooks.json registration model).
- Schema known and stable ✓ (generated schemas in openai/codex repo).
- Context injection into model is confirmed ✓ (developer-role message via `additional_contexts_for_model`; empirically observed).
- Blocker pattern available ✓ (exit 2 for UserPromptSubmit).
- Empirically reproducible on 0.122.0 ✓ (probe confirmed).

The only blocker is operational: the feature flag must be enabled. No code limitation, no API stability concern (docs mark hooks as experimental but all schemas are stable for 0.122.0 per the probed run).

---

## 5. DECISION MATRIX — Implementation Paths

| # | Path | Feasibility | Eng. cost | Runtime cost | Coverage | Recommended |
|---|---|---|---|---|---|---|
| 1 | **Full native hook port**: mirror `hooks/claude/user-prompt-submit.ts` to `hooks/codex/`, handle Codex-specific stdin/stdout schema, register in `~/.codex/hooks.json` alongside notify.sh, enable `codex_hooks = true` in `~/.codex/config.toml` | **HIGH** (contract proven) | Low-Medium (~2-3 days: port + test + register + user-facing docs) | Negligible per-event (one subprocess per hook invocation) | Full parity: SessionStart startup-context + UserPromptSubmit advisor brief, both injected as developer-role messages | **Yes — primary** |
| 2 | Additional SessionStart hook for startup context (separate file from UserPromptSubmit) | High | Low (~1 day after option 1) | Negligible | Covers SessionStart startup payload | **Yes — part of option 1** |
| 3 | File-based workaround via `AGENTS.md` (parallel to sibling phase 007's fallback) | High | Low (already exists via spec 046's voice content) | None | Static startup context only; doesn't solve per-prompt advisor brief | No — option 1 beats it cleanly for this runtime |
| 4 | Shell wrapper around `codex exec -p` with prepended brief | Medium | Low | Per-call | Programmatic mode only | No — option 1 covers interactive TUI too |
| 5 | Accept limitation, document only | Zero | Zero | None | Zero parity | No — Codex has real support, no reason to retreat |

---

## 6. RECOMMENDED IMPLEMENTATION PLAN (Phase 2)

### Required environmental change (user-approved before Phase 2)

Add to `~/.codex/config.toml`:

```toml
[features]
codex_hooks = true
```

**Warning**: this will also activate the existing Superset `notify.sh` hook, which is currently inert. If the user doesn't want the notification side-effects from notify.sh, either (a) remove the Superset entries from `hooks.json` first, (b) modify notify.sh to no-op on Codex events, or (c) leave as-is if the notifications are desired.

### Step-by-step

1. **Verify feature flag decision**: confirm with user whether enabling `codex_hooks` is acceptable given notify.sh side-effects.
2. **Create `hooks/codex/` directory** mirroring `hooks/claude/` structure.
3. **Port `user-prompt-submit.ts`**:
   - Read JSON from stdin (fields: `cwd`, `hook_event_name`, `model`, `permission_mode`, `prompt`, `session_id`, `transcript_path`, `turn_id`).
   - Compute advisor brief (reuse existing Claude-side logic).
   - Emit brief to stdout as plain text OR JSON `{hookSpecificOutput: {additionalContext: "<brief>"}}`.
   - Exit 0.
4. **Create `session-start.ts`**:
   - Read JSON from stdin (fields: `cwd`, `hook_event_name`, `model`, `permission_mode`, `session_id`, `source`, `transcript_path`).
   - Compute code-graph metrics (files, nodes, edges, freshness).
   - Emit as plain text or `hookSpecificOutput.additionalContext`.
   - Exit 0.
5. **Register hooks** in `~/.codex/hooks.json` alongside notify.sh (back up first):
   ```json
   {"hooks": {
     "SessionStart": [
       {"hooks": [{"type": "command", "command": "/Users/.../notify.sh"}]},
       {"hooks": [{"type": "command", "command": "node /absolute/path/to/hooks/codex/session-start.js"}]}
     ],
     "UserPromptSubmit": [
       {"hooks": [{"type": "command", "command": "/Users/.../notify.sh"}]},
       {"hooks": [{"type": "command", "command": "node /absolute/path/to/hooks/codex/user-prompt-submit.js"}]}
     ],
     "Stop": [
       {"hooks": [{"type": "command", "command": "/Users/.../notify.sh"}]}
     ]
   }}
   ```
6. **Write parity tests**: `tests/codex-user-prompt-submit-hook.vitest.ts` mirroring Claude's coverage.
7. **Smoke test**: `codex` session, run the two empirical questions ("what repository state was injected into your startup context?" + "what skill did the advisor recommend?"). Expect non-empty answers mirroring Claude Code.
8. **Verify Claude regression** (REQ-004): `vitest run claude-user-prompt-submit-hook.vitest.ts`.
9. **Document in `cli-codex/SKILL.md`** + `README.md`: new section announcing hook parity shipped, reference this research.md for contract details.
10. **Update parent `handover.md`** with phase outcome.

### Estimated effort: 2-3 days

---

## 7. IMPLEMENTATION CONSIDERATIONS

### Idempotency (because hooks run concurrently)

Since `notify.sh` and the new Spec Kit hook will run in parallel for the same event, the Spec Kit hook must:
- Not race on shared files with notify.sh (different paths).
- Be stdout-only (no side-effects like writing to disk that could conflict).
- Complete fast enough to fit within the default 600s timeout with margin. Advisor brief generation is already sub-second for the Claude hook, so this is not a concern.

### Timeout budget

Default 600s is generous. For the advisor-brief case (sub-second) we can leave default. For SessionStart (which might touch the code graph) set an explicit timeout of 30s as a safety net.

### Env propagation

Hook scripts will inherit all parent env vars including `OPENAI_API_KEY`, `HOME`, `PATH`. That's fine — the Spec Kit hook needs `HOME` to find its own config and doesn't exfiltrate any secrets.

### Blocker semantics

The UserPromptSubmit hook should NOT use exit 2 to block prompts (that's user-destructive). Always exit 0 with stdout; if the advisor has no recommendation to make, emit nothing or a single-line "no recommendation" string.

### Unknown `additionalProperties`

Because `additionalProperties: false` in the stdin schemas, we cannot add custom fields to the input — Codex would reject on parse. The hook only has access to the documented fields (`prompt`, `session_id`, etc.). That's sufficient for advisor brief generation.

---

## 8. WHAT THIS DOES NOT SOLVE

- **Pre-flag state**: users who haven't enabled `codex_hooks = true` get no hook behavior. Documented workaround: enable the flag.
- **Docs flag as experimental**: Codex docs mark hooks experimental. Schema-level breakage could require future re-testing. Current 0.122.0 behavior is stable.
- **UserPromptSubmit blocker could be abused**: we commit to never using exit 2 from the Spec Kit hook so we don't accidentally block the user's prompt on advisor failure.

---

## 9. METHODOLOGY NOTES (for future CLI-parity efforts)

The research methodology that worked — reusable for Gemini CLI or other runtimes:

1. **Documentation layer**: `developers.openai.com/codex/hooks` as starting point.
2. **Schema layer**: generated JSON schemas in the upstream repo (`codex-rs/hooks/schema/generated/`). Authoritative on wire format.
3. **Source layer**: Rust source files (`command_runner.rs`, `dispatcher.rs`, event parsers). Authoritative on runtime behavior.
4. **Empirical layer**: isolated probe with a throwaway `CODEX_HOME`. Verifies actual behavior on the installed binary version, catches doc/source drift.

Key trick for this research: the codex agent itself running with `--sandbox workspace-write` could actually perform the empirical probe (iter 2: wrote probe scripts, captured stdin/stdout/env, validated against docs). That's a capability copilot couldn't match because copilot research was limited to documentation/repo search — no sandbox-safe probe execution.

---

## 10. CONVERGENCE REPORT

- **Total iterations**: 10 (hit max; rolling avg at stop = 0.3833, still above 0.05 — but all 8 questions answered with primary-source citations, so additional iterations would diminish marginally)
- **Stop reason**: max_iterations_reached (functional convergence reached by iter 8; iters 9-10 consolidated)
- **Iteration ratio trajectory**: 0.90 → 0.70 → 0.45 → 0.35 → 0.55 → 0.20 → 0.15 → 0.35 → 0.45 → 0.35
- **Status distribution**: 10 × `evidence` (vs copilot run's 9 × `insight`, 1 × `evidence` — Codex iterations treated every finding as verified from primary sources)
- **Total findings**: 93 across 10 iterations (deduplicated into ~30 unique claims in this synthesis)
- **Primary-source URLs**: 40+ distinct URLs across developers.openai.com/codex, openai/codex GitHub repo source files, generated schemas, upstream issues, Rust stdlib docs
- **Empirical probe**: isolated `CODEX_HOME` probe on 0.122.0 verified stdin format, stdout injection, exit-code semantics, timeout behavior, and env propagation — without touching the real `~/.codex/hooks.json`

---

## 11. RELATED DOCUMENTS

- **Spec**: `../../009-hook-package/005-codex-hook-parity-remediation/spec.md`
- **Plan**: `../../009-hook-package/005-codex-hook-parity-remediation/plan.md`
- **Tasks**: `../../009-hook-package/005-codex-hook-parity-remediation/tasks.md`
- **Decisions**: `../../009-hook-package/005-codex-hook-parity-remediation/decision-record.md` — ADR-003 populated from §5 above
- **Sibling phase**: `../../009-hook-package/004-copilot-hook-parity-remediation/` — Copilot has NO dynamic hook-based injection (outcome B); this is the contrast case
- **Reference implementation (Claude-side)**: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts` — the implementation Phase 2 ports to `hooks/codex/`
- **User's existing config**: `~/.codex/hooks.json` (notify.sh registered), `~/.codex/config.toml` (feature flag ABSENT — must be added in Phase 2)
