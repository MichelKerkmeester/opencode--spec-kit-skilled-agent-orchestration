---
title: "Review Report: Cross-Runtime Hook Parity"
description: "Release-readiness deep-review report for Claude, Codex, Copilot, Gemini, and OpenCode hook parity."
trigger_phrases:
  - "045-005-cross-runtime-hook-parity"
  - "hook parity audit"
  - "5-runtime hook review"
  - "cross-runtime feature parity"
importance_tier: "important"
contextType: "review"
---
# Review Report: Cross-Runtime Hook Parity

## 1. Executive Summary

**Verdict: FAIL.** Active findings: P0=1, P1=3, P2=2. `hasAdvisories=true`.

The hook source itself mostly produces the documented prompt-time signal in direct smokes: Claude, Codex, Copilot, Gemini, and OpenCode all have direct smoke PASS evidence. The release blocker is the checked-in Copilot live hook registration path: it points at a Superset notification wrapper that drains stdin and returns `{}` without invoking the Spec Kit Copilot writer scripts, while the passing Copilot smoke invokes the Spec Kit script directly. That is a silent runtime-switch gap.

The latest `hook-tests` evidence is not a normal-shell live verdict. All five live CLI cells in `run-output/latest` are `SKIPPED_SANDBOX`, so the direct-smoke layer is validated, but the canonical live runtime layer remains unproven.

## 2. Planning Trigger

Route to remediation planning before release readiness. The P0 needs a packet that either wires the checked-in Copilot wrapper through the Spec Kit writer scripts or documents and tests a different live Copilot registration path that operators actually use.

P1 work should update doc/runtime contract drift and capture a normal-shell `npm --prefix .opencode/skill/system-spec-kit/mcp_server run hook-tests` run. P2 work can be batched with doc polish.

## 3. Active Finding Registry

### P0-001: Copilot live hook registration can silently bypass Spec Kit context

**Severity:** P0, silent feature gap.

**Evidence:** The hook system reference says the current Copilot path runs Copilot-supported writer scripts and includes the checked-in `.github/hooks/superset-notify.json` wrapper where available `.opencode/skill/system-spec-kit/references/config/hook_system:37`. The checked-in wrapper routes `userPromptSubmitted` to `/Users/michelkerkmeester/.superset/hooks/copilot-hook.sh userPromptSubmitted` `.github/hooks/superset-notify.json:18`. That shell script drains stdin `/Users/michelkerkmeester/.superset/hooks/copilot-hook.sh:8`, returns `{}` `/Users/michelkerkmeester/.superset/hooks/copilot-hook.sh:27`, and only sends a Superset notification when Superset env vars exist `/Users/michelkerkmeester/.superset/hooks/copilot-hook.sh:30`. It never calls `.opencode/skill/system-spec-kit/mcp_server/dist/hooks/copilot/user-prompt-submit.js`.

The passing Copilot direct smoke invoked the Spec Kit script directly and wrote an isolated managed instructions file, despite recording `.github/hooks/superset-notify.json` as config evidence `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/030-hook-plugin-per-runtime-testing/run-output/latest/copilot-user-prompt-submitted-next-prompt-direct-smoke.jsonl:1`. The actual live CLI cell was skipped because the run was sandboxed `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/030-hook-plugin-per-runtime-testing/run-output/latest/copilot-user-prompt-submitted-next-prompt-live-cli.jsonl:1`.

**Impact:** An operator switching to Copilot can lose prompt-time advisor and startup context without a warning. The docs imply the checked-in wrapper participates in Spec Kit context refresh, but the executable wrapper is notification-only.

**Concrete fix:** Replace the checked-in Copilot wrapper with a dispatcher that runs the Spec Kit writer scripts before Superset notification, or split the files so `.github/hooks/superset-notify.json` is clearly notification-only and a separate checked-in Spec Kit Copilot registration is the documented live path. Update the runner so the live Copilot cell validates the actual checked-in wrapper chain, not only the direct script smoke.

### P1-001: No normal-shell live runtime verdict is present after the 044 methodology fix

**Severity:** P1, release-readiness evidence gap.

**Evidence:** The `hook-tests` script exists `.opencode/skill/system-spec-kit/mcp_server/package.json:27`, and 044 says the canonical live verdict requires a normal operator shell while sandbox mode is direct-smoke-only `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/031-hook-test-sandbox-fix/methodology-correction.md:35`. The latest live CLI outputs for Claude, Codex, Copilot, Gemini, and OpenCode all show `status:"SKIPPED_SANDBOX"` because `CODEX_SANDBOX` was present: Claude `.../claude-user-prompt-submit-live-cli.jsonl:1`, Codex `.../codex-user-prompt-submit-freshness-live-cli.jsonl:1`, Copilot `.../copilot-user-prompt-submitted-next-prompt-live-cli.jsonl:1`, Gemini `.../gemini-before-agent-additional-context-live-cli.jsonl:1`, OpenCode `.../opencode-plugin-system-transform-live-cli.jsonl:1`.

**Impact:** The audit can answer hook-code direct smoke parity, but it cannot honestly answer the user question "actual live verdict per runtime when run from a normal shell." Current live verdict is UNKNOWN for all five runtimes.

**Concrete fix:** Run `npm --prefix .opencode/skill/system-spec-kit/mcp_server run hook-tests` from a normal shell, preserve `run-output/latest`, and update 043/045 evidence with the five live CLI statuses.

### P1-002: OpenCode output shape is documented as `additionalContext`, but the plugin actually mutates the system transform

**Severity:** P1, contract drift.

**Evidence:** The skill advisor hook reference lists OpenCode output shape as "plugin `additionalContext`" `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook:66`. The actual plugin implements `experimental.chat.system.transform` `.opencode/plugins/spec-kit-skill-advisor.js:663` and appends the advisor brief into `output.system` `.opencode/plugins/spec-kit-skill-advisor.js:627`. The hook system reference uses the correct transform vocabulary `.opencode/skill/system-spec-kit/references/config/hook_system:111`.

**Impact:** Operators and tests can look for the wrong OpenCode transport shape. That is not a runtime failure, but it is contract drift in the operator-facing hook reference.

**Concrete fix:** Change the OpenCode row in the skill advisor hook reference from plugin `additionalContext` to `experimental.chat.system.transform` / `output.system` mutation.

### P1-003: Codex README registration snippet does not match the checked-in template or the authoritative live contract

**Severity:** P1, contract drift.

**Evidence:** The Codex README labels a "Checked-in `.codex/settings.json` shape" and shows event entries with direct `type`, `command`, and `timeout` fields `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/README:63`. The checked-in `.codex/settings.json` uses nested `hooks` arrays for `SessionStart`, `UserPromptSubmit`, and `PreToolUse` `.codex/settings.json:3`. The authoritative contract says `.codex/settings.json` is template-only and live native readiness requires `[features].codex_hooks = true` plus user/workspace `hooks.json` `.opencode/skill/system-spec-kit/references/config/hook_system:39`.

**Impact:** A maintainer copying the Codex README snippet can create a config shape that differs from the repo template and may not reflect native Codex hook registration. This is not the same as a current live failure, because the real user-level hooks are wired in `~/.codex/hooks.json`, but the per-runtime README is stale.

**Concrete fix:** Update the Codex README snippet to match the nested repo template and add the same "template-only, live hooks.json required" language as the hook system reference.

### P2-001: Gemini uses `UserPromptSubmit` as the output hook event name on the `BeforeAgent` surface

**Severity:** P2, parity polish.

**Evidence:** Gemini docs correctly say the advisor registers under `BeforeAgent` `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/README.md:26`, but `GeminiHookSpecificOutput` hardcodes `hookEventName: 'UserPromptSubmit'` `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts:46` and returns that value in the runtime output `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts:200`.

**Impact:** Direct smoke still passes because the runtime-visible `additionalContext` exists. The mismatch makes observability and test naming less clean.

**Concrete fix:** Either document that Gemini reuses the `UserPromptSubmit` payload name internally, or change the adapter/test contract to expose the Gemini-local `BeforeAgent` event name if supported by the runtime schema.

### P2-002: OpenCode silently skips advisor injection when prompt extraction fails

**Severity:** P2, silent-bypass polish.

**Evidence:** The OpenCode plugin tries to extract the prompt, falls back to session messages, swallows retrieval errors, and returns without status when no prompt is found `.opencode/plugins/spec-kit-skill-advisor.js:578` through `.opencode/plugins/spec-kit-skill-advisor.js:618`. The status tool reports bridge counters and last status `.opencode/plugins/spec-kit-skill-advisor.js:666`, but the no-prompt branch does not set an observable skip reason before returning.

**Impact:** If OpenCode changes the transform input shape, the advisor brief can disappear without an operator-visible diagnostic. This is lower severity than Copilot because the normal direct plugin smoke currently passes.

**Concrete fix:** Set `lastBridgeStatus='skipped'` and `lastErrorCode='MISSING_PROMPT'` before the no-prompt return, then add a smoke assertion for that diagnostic path.

## 4. Remediation Workstreams

| Workstream | Findings | Action |
|------------|----------|--------|
| Copilot live wiring | P0-001 | Wire the checked-in Copilot hook through Spec Kit writer scripts or split notification-only and Spec Kit hook registrations. |
| Live runtime evidence | P1-001 | Run `hook-tests` from a normal shell and persist non-sandbox live CLI verdicts. |
| Contract docs | P1-002, P1-003 | Align OpenCode output-shape docs and Codex README registration snippets with live behavior. |
| Observability polish | P2-001, P2-002 | Normalize Gemini event naming or document it, and expose OpenCode prompt-missing skips in status. |

## 5. Spec Seed

Follow-up packet: `046-cross-runtime-hook-parity-remediation`.

Problem: Release readiness is blocked because Copilot's checked-in live hook path can silently skip Spec Kit context, and live runtime evidence remains sandbox-skipped.

Requirements:
- P0: Copilot live hook registration must execute Spec Kit session/advisor writer scripts or be explicitly documented and tested as notification-only.
- P0: The runtime hook test runner must validate the actual Copilot checked-in wrapper path.
- P1: Normal-shell live CLI verdicts must be captured for Claude, Codex, Copilot, Gemini, and OpenCode.
- P1: OpenCode and Codex hook docs must match runtime behavior.

## 6. Plan Seed

1. Add or replace a Copilot hook wrapper that runs `dist/hooks/copilot/session-prime.js` for `sessionStart` and pipes prompt JSON into `dist/hooks/copilot/user-prompt-submit.js` for `userPromptSubmitted`, then calls Superset notification as a secondary side effect.
2. Update 043 runners so Copilot live validation asserts the checked-in wrapper produces or refreshes the managed Spec Kit block.
3. Run `npm --prefix .opencode/skill/system-spec-kit/mcp_server run hook-tests` from a normal shell and preserve results.
4. Patch the skill advisor hook reference OpenCode output shape and the Codex hooks README registration snippet.
5. Add OpenCode no-prompt diagnostic coverage if time allows.

## 7. Traceability Status

Question: Are Copilot and Codex hook configs in sync with docs after the 031 fix?

Answer: Codex is mostly aligned in the hook system reference and AGENTS/SKILL, but the Codex per-runtime README has a stale snippet. Copilot is not aligned at the live checked-in wrapper layer: docs say writer scripts refresh managed instructions, but `.github/hooks/superset-notify.json` routes to a notification-only shell wrapper.

Question: Does Copilot next-prompt freshness produce the same type of advisor brief as Claude's `additionalContext`, just on different timing?

Answer: The direct smoke says yes for the content type: Claude emitted `Advisor:` in `hookSpecificOutput.additionalContext`, while Copilot wrote an `Active Advisor Brief` with an `Advisor:` line into managed instructions. The output shape and timing differ by design.

Question: What is the actual live verdict per runtime from a normal shell?

Answer: UNKNOWN. The latest live CLI cells are all `SKIPPED_SANDBOX`, so they are not normal-shell verdicts. Direct smoke verdict is PASS for all five runtimes.

Question: Is fallback documented and does actual fallback match?

Answer: Claude, Gemini, and Codex fallback docs are broadly aligned. Codex timeout fallback is explicitly marked stale with `{"stale":true,"reason":"timeout-fallback"}` in source `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:194`. Copilot fallback documentation does not match the checked-in wrapper because the wrapper does not execute the managed-instructions writer. OpenCode fallback is documented, but missing-prompt skips should become observable.

Question: Are there silent bypass paths?

Answer: Yes. Copilot's checked-in wrapper silently bypasses Spec Kit context, and OpenCode silently returns on missing prompt extraction.

Question: Is the 5-runtime feature parity table in AGENTS / SKILL accurate?

Answer: It is accurate at the intended contract level: AGENTS says Copilot is next-prompt freshness and Codex requires `codex_hooks` plus hooks.json `AGENTS:96`, and the system-spec-kit skill says the same `.opencode/skill/system-spec-kit/SKILL:741`. It is not sufficient as release evidence because it does not expose the checked-in Copilot wrapper gap or the missing normal-shell live verdict.

## 8. Deferred Items

- Capture normal-shell live runtime output after leaving the Codex sandbox.
- Decide whether Gemini should expose `BeforeAgent` in `hookEventName` or keep the shared prompt-advisor payload name.
- Add OpenCode missing-prompt diagnostic coverage.
- Re-run strict validation after remediation packets patch docs or wrappers.

## 9. Audit Appendix

### Coverage

Reviewed surfaces:
- `.opencode/skill/system-spec-kit/mcp_server/hooks/{claude,codex,copilot,gemini}/`
- `.opencode/plugins/spec-kit-skill-advisor.js`
- `.opencode/skill/system-spec-kit/references/config/hook_system`
- `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md`
- `.claude/settings.local.json`, `.codex/settings.json`, `.gemini/settings.json`
- 035 findings, 043 findings/run-output, and 044 methodology correction
- AGENTS and `system-spec-kit/SKILL` parity tables

### Direct Smoke Matrix

| Runtime | Direct smoke | Evidence |
|---------|--------------|----------|
| Claude | PASS | `run-output/latest/claude-user-prompt-submit-direct-smoke.jsonl:1` |
| Codex | PASS | `run-output/latest/codex-user-prompt-submit-freshness-direct-smoke.jsonl:1` |
| Copilot | PASS | `run-output/latest/copilot-user-prompt-submitted-next-prompt-direct-smoke.jsonl:1` |
| Gemini | PASS | `run-output/latest/gemini-before-agent-additional-context-direct-smoke.jsonl:1` |
| OpenCode | PASS | `run-output/latest/opencode-plugin-system-transform-direct-smoke.jsonl:1` |

### Live CLI Matrix

| Runtime | Latest live CLI status | Release interpretation |
|---------|------------------------|------------------------|
| Claude | `SKIPPED_SANDBOX` | Normal-shell verdict unknown. |
| Codex | `SKIPPED_SANDBOX` | Normal-shell verdict unknown. |
| Copilot | `SKIPPED_SANDBOX` | Normal-shell verdict unknown; checked-in wrapper gap still P0. |
| Gemini | `SKIPPED_SANDBOX` | Normal-shell verdict unknown. |
| OpenCode | `SKIPPED_SANDBOX` | Normal-shell verdict unknown. |

### Convergence Evidence

All four review dimensions were covered:
- Correctness: runtime output shape and config registration.
- Security: Codex stale timeout marker and auth/sandbox boundary.
- Traceability: docs versus runtime source and run-output.
- Maintainability: shared behavior versus runtime-specific wrappers.

Convergence is blocked by one active P0 and three active P1 findings. Release readiness for hook parity is not achieved.
