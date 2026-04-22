---
title: "Deep Research Synthesis — Copilot CLI Hook Schema & userPromptSubmitted Failure"
description: "Synthesis of 8 iterations converging on the root cause of the 'Neither bash nor powershell specified in hook command configuration' error blocking 026/007/007. Root cause: Copilot 1.0.34 merges .claude/settings.local.json into its hook pipeline and executes the Claude matcher wrapper as a command; the wrapper lacks top-level bash/powershell. Fix: add top-level no-op bash to the Claude wrapper — empirically cross-runtime safe."
importance_tier: "high"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/research/007-deep-review-remediation-pt-03"
    last_updated_at: "2026-04-22T15:05:00Z"
    last_updated_by: "claude-opus-4-7+cli-codex-gpt-5.4"
    recent_action: "Research converged at iteration 8 (stuck_count=3, threshold=0.05)"
    next_safe_action: "Open implementation packet to patch .claude/settings.local.json UserPromptSubmit wrapper"
    completion_pct: 100
---

# Deep Research Synthesis — Copilot CLI Hook Schema & userPromptSubmitted Failure

**Parent spec phase**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/007-copilot-hook-parity-remediation/`
**Research packet**: `007-deep-review-remediation-pt-03/`
**Prior research**: `007-deep-review-remediation-pt-01/research.md` (outcome B file-based workaround; did not touch schema)
**Iterations**: 8 (10 configured; converged early at iter-8 with stuck_count=3)
**Executor**: `cli-codex` gpt-5.4 high fast, sandbox workspace-write, 900s timeout
**Outcome**: **Root cause identified + cross-runtime-safe fix verified**

---

## 1. EXECUTIVE SUMMARY

**The research question**: why does Copilot CLI 1.0.34 log `"Hook execution failed: Error: Neither 'bash' nor 'powershell' specified in hook command configuration"` when `.github/hooks/superset-notify.json` clearly has `"bash"` keys, and why does this block the per-prompt `Refreshed:` update in `$HOME/.copilot/copilot-instructions.md`?

**Short answer**: **Copilot 1.0.34 merges hooks from BOTH `.github/hooks/*.json` AND `.claude/settings.local.json`.** The Claude config uses a *nested* wrapper shape — `hooks.UserPromptSubmit[0].hooks[0].command` — where the OUTER matcher-group object carries no top-level `bash` or `powershell`. Copilot normalizes Claude's `UserPromptSubmit` onto its own `userPromptSubmitted` event, attempts to execute the outer wrapper, and throws because the wrapper lacks an executable shell alias. The flat `.github/hooks/superset-notify.json` entries continue to execute *successfully*; they're not the failure source.

**The fix** (empirically verified in iter-5 + iter-6): add `type: "command"`, `bash: "true"`, `timeoutSec: 3` to each matcher-group object in `.claude/settings.local.json` that uses an event Copilot also consumes (UserPromptSubmit, SessionStart, etc.). Claude Code 2.1.117 ignores these extra fields and still executes the nested `hooks[0].command`; Copilot executes the top-level `true` no-op and stops throwing. **Cross-runtime compatibility proved in an isolated Claude Code smoke**.

**Why it's been happening since March 2026**: the same merge behavior existed in Copilot 1.0.14, 1.0.15, 1.0.19, 1.0.20, 1.0.25, 1.0.29, 1.0.32 — all show the identical error in `~/.copilot/logs/`. It's a long-standing cross-runtime collision, not a 1.0.34 regression.

---

## 2. ROOT CAUSE

### 2.1 Validator source

Copilot 1.0.34 ships its JS entrypoint at `~/.copilot/pkg/universal/1.0.34/app.js` (iter-2 F8). The executor throw site is:

```js
// ~/.copilot/pkg/universal/1.0.34/app.js chunk 1201, offsets 3732 / 3784 / 4358
g2(entry) {
  // ...
  if (!entry.bash && !entry.powershell) {
    throw new Error("Neither 'bash' nor 'powershell' specified in hook command configuration");
  }
}
```

`g2()` is called per-entry during `userPromptSubmitted` normalization but is bypassed for `sessionStart` (which filters by `type === "command"` before wrapping) — this is why sessionStart parses and userPromptSubmitted fails on the same file.

### 2.2 Config-source merge

Copilot's hook-loading pipeline (iter-4 source trace, app.js chunk 4998, offsets 10626 / 10727):

```
loadHooks(cwd)
  ├─ read .github/hooks/*.json             → flat {type, bash, timeoutSec} entries ✓
  └─ read .claude/settings.local.json      → normalize Claude events onto Copilot events
                                              UserPromptSubmit → userPromptSubmitted
                                              SessionStart     → sessionStart
                                              PreToolUse       → preToolUse
                                              PostToolUse      → postToolUse
                                              Stop             → sessionEnd
```

Claude's nested matcher shape has no top-level executable field, so after normalization the outer wrapper object looks like `{ matcher: "", hooks: [{ type: "command", command: "...", timeout: 3 }] }`. Copilot iterates *this* object and hands it to `g2()`.

### 2.3 Asymmetric parse behavior (KQ-2)

The paradox "sessionStart succeeds while userPromptSubmitted fails" has a concrete source explanation:
- `sessionStart` filter: `entries.filter(e => e.type === "command")` → discards wrapper-only objects → then `g2()` → no-op.
- `userPromptSubmitted` filter: **none** → every entry is passed to `g2()` → wrapper-only objects throw.

That's why the managed block at `$HOME/.copilot/copilot-instructions.md` had `Source: system-spec-kit copilot sessionStart hook` at 11:08 UTC but never refreshed: sessionStart ran, wrote the block, exited; every userPromptSubmitted call since has crashed inside `g2()` before hitting `.github/hooks/scripts/user-prompt-submitted.sh`.

---

## 3. EMPIRICAL REPRODUCERS

### 3.1 Isolated "broken" case (iter-5 F28)

- Path: `/tmp/copilot-hook-repro-iter005c-1776868850/broken/`
- Contents: `.github/hooks/superset-notify.json` (flat bash) + `.claude/settings.local.json` (nested UserPromptSubmit, no top-level bash)
- Run: Copilot 1.0.34 app.js + `--allow-all` + isolated `COPILOT_HOME` + unreachable BYOK
- Result (log `broken/logs/process-1776868851140-10267.log`):
  - `:26` `Executing hook … broken github userPromptSubmitted` ✓
  - `:28` `Spawned hook command` ✓
  - `:29` `Hook execution failed: Error: Neither 'bash' nor 'powershell' specified in hook command configuration` ✗

Decisively separates: the `.github/hooks` flat entry executes fine; the crash comes from the additional Claude wrapper object Copilot also ingests.

### 3.2 Isolated "mitigated" case (iter-5 F29)

- Same repo, `.claude/settings.local.json` updated with top-level `type: "command", bash: "true", timeoutSec: 3` + nested `hooks[0].command` preserved.
- Result (log `mitigated/logs/process-1776868939747-14186.log`):
  - `:26` `Executing hook … mitigated github userPromptSubmitted` ✓
  - `:29` `Executing hook … mitigated copilot-safe claude-wrapper-noop` ✓
  - No `Neither 'bash' nor 'powershell'` line anywhere.
- Both hook markers landed: `.github/hooks` flat command + wrapper no-op.

### 3.3 Claude Code cross-runtime compatibility (iter-6 F33/F34)

- Path: `/tmp/claude-hook-compat-iter006-1776869539/`
- Settings: Claude wrapper with the Copilot-safe top-level fields added.
- Run: Claude Code 2.1.117 non-interactive + `--debug hooks` + unreachable `ANTHROPIC_BASE_URL`.
- Result (transcript `home/.claude/projects/.../*.jsonl:7`):
  - `hook_success` attachment for `UserPromptSubmit` with `exitCode: 0, durationMs: 9`.
  - Debug log `:131-132`: `Hook UserPromptSubmit (UserPromptSubmit) success`.
  - Nested marker `nested-command.log` written ✓
  - Top-level `top-level-bash.log` **NOT** written — Claude ignores the Copilot-only fields.

This is the exact cross-runtime behavior needed: one file, both CLIs happy.

---

## 4. CONCRETE PATCHES

### 4.1 `.github/hooks/superset-notify.json` — no change required

The flat-bash shape that the Superset wrapper already writes is **schema-valid and executing successfully**. Iter-5 empirical log lines prove the `userPromptSubmitted` entry fires before the wrapper-object crash. No patch is needed here.

```json
{
  "version": 1,
  "hooks": {
    "sessionStart": [
      { "type": "command", "bash": "/Users/michelkerkmeester/.superset/hooks/copilot-hook.sh sessionStart", "timeoutSec": 5 }
    ],
    "sessionEnd": [
      { "type": "command", "bash": "/Users/michelkerkmeester/.superset/hooks/copilot-hook.sh sessionEnd", "timeoutSec": 5 }
    ],
    "userPromptSubmitted": [
      { "type": "command", "bash": "/Users/michelkerkmeester/.superset/hooks/copilot-hook.sh userPromptSubmitted", "timeoutSec": 5 }
    ],
    "postToolUse": [
      { "type": "command", "bash": "/Users/michelkerkmeester/.superset/hooks/copilot-hook.sh postToolUse", "timeoutSec": 5 }
    ]
  }
}
```

**Note**: the current version of this file points at `/Users/michelkerkmeester/.superset/hooks/copilot-hook.sh` which only emits `{}` and posts Superset notifications — it **does not invoke the system-spec-kit writer**. That's a separate wiring problem from the schema issue; see §7.

### 4.2 `.claude/settings.local.json` — the load-bearing fix

Add top-level Copilot-safe fields to every matcher-group object whose parent event name maps to a Copilot event (at minimum `UserPromptSubmit`; consider `SessionStart`, `Stop`, `PreToolUse`, `PostToolUse` too for full coverage):

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "type": "command",
        "bash": "true",
        "timeoutSec": 3,
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'cd \"$(git rev-parse --show-toplevel 2>/dev/null || pwd)\" && node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/user-prompt-submit.js'",
            "timeout": 3
          }
        ]
      }
    ]
  }
}
```

Behavior:
- Claude Code 2.1.117 accepts the outer fields silently (iter-6 R7/R8 ruled out rejection), runs only the nested `command`.
- Copilot 1.0.34 executes the top-level `bash: "true"` as a no-op, then moves on — no throw.

If you want the wrapper itself to invoke the system-spec-kit writer under Copilot (rather than just a no-op), replace `"bash": "true"` with the actual shell wrapper that pipes Copilot's stdin to `dist/hooks/copilot/user-prompt-submit.js`. But the minimal mitigation is `"true"` — all the Copilot hook wiring is already in `.github/hooks/superset-notify.json`.

---

## 5. KEY FINDINGS INDEX

| ID | Iter | Finding | Evidence |
|---|---|---|---|
| F1 | 1 | Docs still document flat `bash`/`powershell` schema. | `docs.github.com/en/copilot/reference/hooks-configuration` lines 541-558 |
| F2 | 1 | Copilot reads hooks from `.github/hooks/*.json` (cwd). | GitHub Use-Hooks page lines 513-516 |
| F3 | 1 | Current `superset-notify.json` is schema-valid on disk. | `.github/hooks/superset-notify.json:4-30` |
| F4 | 1 | Superset wrapper rewrites `superset-notify.json` on every launch. | `~/.superset/bin/copilot:30-69` |
| F5 | 1 | The error predates 1.0.34 — appears in logs for 1.0.14 through 1.0.32. | log archaeology timestamp `2026-04-22T13:58:12Z` |
| F8 | 2 | Copilot 1.0.34 validator source at `~/.copilot/pkg/universal/1.0.34/app.js`. | empirical extraction |
| F9 | 2 | Executor `g2()` throws post-normalization on wrapper-only objects. | app.js chunk 1201 |
| F27 | 4 | Copilot merges `.claude/settings.local.json` into its hook pipeline. | app.js chunk 4998, offsets 10626/10727 |
| **F28** | **5** | **Broken repro: `.github/hooks` executes, then Claude wrapper crashes.** | `/tmp/.../broken/logs/process-*.log:26,:29` |
| **F29** | **5** | **Mitigated repro: top-level `bash: "true"` on wrapper eliminates crash.** | `/tmp/.../mitigated/logs/process-*.log:29,:31` |
| F33 | 6 | Claude Code 2.1.117 accepts the Copilot-safe top-level fields. | `/tmp/.../home/.claude/.../*.jsonl:7` |
| F34 | 6 | Claude ignores the top-level `bash`, runs only the nested `command`. | nested-command.log present, top-level-bash.log absent |

---

## 6. RULED OUT

| ID | Direction | Why |
|---|---|---|
| R1 | "Schema migration in 1.0.34 broke the flat `bash` shape." | Error exists since 1.0.14; docs unchanged; flat shape executes successfully. |
| R2 | "`.github/hooks/superset-notify.json` is the offender." | Iter-5 broken repro logs `Executing hook` for the flat entry *before* the crash. |
| R3 | "Copilot only reads `.github/hooks/*.json`." | Iter-4 source trace + iter-5 repro prove `.claude/settings.local.json` is merged. |
| R4 | "Rewriting `.github/hooks/superset-notify.json` alone resolves it." | Iter-5 R6: broken repro had a valid `.github/hooks` file AND still crashed. |
| R5 | "`COPILOT_OFFLINE=true` is a valid reproducer path." | Offline mode skips project hooks entirely. |
| R7 | "Claude rejects wrappers with Copilot-only top-level fields." | Iter-6 smoke: `hook_success`, `exitCode: 0`. |
| R8 | "Claude executes the top-level Copilot `bash` as an extra hook." | Iter-6: top-level marker file missing; nested marker present. |

---

## 7. SECONDARY ISSUE — WRITER WIRING

Even after the schema crash is fixed, the currently-deployed `.github/hooks/superset-notify.json` points at `~/.superset/hooks/copilot-hook.sh <event>` which only posts Superset notifications — **it does not invoke `.github/hooks/scripts/user-prompt-submitted.sh`**, which is what actually runs `dist/hooks/copilot/user-prompt-submit.js` and refreshes the managed block.

The Superset wrapper at `~/.superset/bin/copilot:30-69` generates this config on every launch. So even a manual patch to chain `user-prompt-submitted.sh` through `superset-notify.sh` will get clobbered.

**Implementation-packet options**:

1. **Patch the Superset wrapper generator** to emit the system-spec-kit wrapper script as the `userPromptSubmitted` target. Changes an external dependency.
2. **Move the system-spec-kit refresh into the Claude wrapper's top-level `bash`** field (replace `"true"` with the actual command). Then Copilot runs the writer directly on every prompt; the `.github/hooks/superset-notify.json` rewrite doesn't matter for the refresh.
3. **Ignore the Copilot-side refresh** and rely on sessionStart + out-of-band cron/IDE refresh. Matches the current Outcome B model but leaves per-prompt freshness unachieved.

Option 2 is the smallest repo-local change. Recommend for the implementation packet.

---

## 8. ANSWERS TO ORIGINAL KEY QUESTIONS

| KQ | Answer |
|---|---|
| KQ-1 (current schema) | Unchanged — flat `{type, bash|powershell, cwd?, timeoutSec?, env?}` under `hooks.<event>[]`. |
| KQ-2 (asymmetric parse) | `sessionStart` filters by `type === "command"`; `userPromptSubmitted` does not. Wrapper objects from `.claude/settings.local.json` therefore reach `g2()` only on userPromptSubmitted. |
| KQ-3 (new required key) | None. `command` alias exists but is not required. |
| KQ-4 (which path) | Both `.github/hooks/*.json` AND `.claude/settings.local.json` (Claude event names normalized to Copilot events). |
| KQ-5 (schema trace) | `app.js:1201:3732` / `:3784` / `:4358` (validator); `:4998:10626` / `:10727` (loader). |
| KQ-6 (JSON schema file) | No standalone schema file; validation inline in the packaged JS at `~/.copilot/pkg/universal/1.0.34/app.js`. |
| KQ-7 (concrete patch) | `.github/hooks/superset-notify.json` needs no change. `.claude/settings.local.json` needs top-level `{type:"command", bash:"true", timeoutSec:3}` on each matcher-group wrapper. |
| KQ-8 (deprecation warning) | None — fails with a throw, not a warning. |
| KQ-9 (ACP fallback) | Still deferred. ACP wouldn't change that Copilot ingests `.claude/settings.local.json`; addresses a different capability gap. |
| KQ-10 (Refreshed: advances) | Not validated in this research-only run. Implementation packet must smoke: patch, `copilot -p "smoke"`, check log for no missing-shell error + `Refreshed:` timestamp increments + `Source: system-spec-kit copilot userPromptSubmitted hook`. |

---

## 9. CONVERGENCE REPORT

- Stop reason: **composite_converged** (stuck_count=3 at iter-8; self-reported `converged` status at iters 6/7/8)
- Total iterations: 8 of 10 configured
- Questions answered: 10 of 10 KQs (KQ-9/KQ-10 answered within scope; KQ-10 live smoke deferred to implementation)
- newInfoRatio trajectory:
  - iter-1: 0.74 (schema grounded)
  - iter-2: 0.67 (validator source extracted)
  - iter-3: 0.58 (isolated reproducer)
  - iter-4: 0.72 (root cause narrowed to Claude wrapper)
  - iter-5: 0.64 (empirical collision + mitigation)
  - iter-6: 0.04 ★ (Claude compatibility verified — converged)
  - iter-7: 0.02 (convergence confirmation)
  - iter-8: 0.01 (final pad check)

---

## 10. NEXT STEPS

1. **Open implementation packet** as a sibling of `007-copilot-hook-parity-remediation/`: e.g. `008-copilot-wrapper-schema-fix/` or as a follow-on within the same parent remediation tree.
2. **Patch `.claude/settings.local.json`** per §4.2. Include `UserPromptSubmit`, `SessionStart`, and any other events Copilot maps.
3. **Decide writer integration strategy** (§7, option 2 recommended).
4. **Smoke test**: in a fresh shell, `copilot -p "hook smoke"`, confirm:
   - No `Neither 'bash' nor 'powershell'` line in the new `~/.copilot/logs/process-*.log`.
   - `$HOME/.copilot/copilot-instructions.md` `Refreshed:` timestamp increments per-prompt.
   - `Source:` line names the `userPromptSubmitted` hook (not just sessionStart).
5. **Update `007/007/implementation-summary.md` §Known Limitations** to reflect:
   - The chronic cross-runtime collision (not a 1.0.34 regression).
   - The Claude-wrapper patch as the actual fix.
   - The writer-wiring secondary issue + chosen strategy.

---

## 11. REFERENCES

### Primary sources
- Copilot 1.0.34 validator: `~/.copilot/pkg/universal/1.0.34/app.js` (chunks 1201 & 4998)
- GitHub hooks reference: https://docs.github.com/en/copilot/reference/hooks-configuration
- GitHub Use-Hooks guide: https://docs.github.com/en/enterprise-cloud@latest/copilot/how-tos/copilot-cli/customize-copilot/use-hooks
- Claude Code hooks reference: https://code.claude.com/docs/en/hooks

### Empirical artifacts (research-only tmp dirs; cleaned after synthesis)
- `/tmp/copilot-hook-repro-iter005c-1776868850/broken/` — reproduces the crash
- `/tmp/copilot-hook-repro-iter005c-1776868850/mitigated/` — proves the fix
- `/tmp/claude-hook-compat-iter006-1776869539/` — cross-runtime compatibility

### Packet-local artifacts
- Iterations 1-8: `iterations/iteration-{001..008}.md`
- Delta streams: `deltas/iter-{001..008}.jsonl`
- Canonical state: `deep-research-state.jsonl` (10 records: 1 config + 8 iterations + 1 synthesis)

---

## Convergence Report

- **Stop reason**: composite_converged
- **Total iterations**: 8
- **Questions answered**: 10/10 (KQ-10 live smoke deferred to implementation)
- **Convergence threshold**: 0.05
- **Final ratios**: 0.04 → 0.02 → 0.01 (three consecutive sub-threshold)
- **Wall-time**: ~60 min driver + ~7 min iter-1 = 67 min total
