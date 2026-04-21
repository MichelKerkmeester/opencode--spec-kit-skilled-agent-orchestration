---
title: "029 — Runtime Hook Parity Remediation Implementation Summary"
description: "Runtime hook parity remediation across OpenCode transport, Codex advisor/pre-tool hooks, Copilot startup wiring, and hook documentation truth-sync."
trigger_phrases:
  - "029 summary"
  - "hook parity summary"
importance_tier: "high"
contextType: "implementation-summary"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/003-hook-parity-remediation"
    last_updated_at: "2026-04-21T13:10:00Z"
    last_updated_by: "codex-gpt-5.4"
    recent_action: "Phases A-D targeted gates green"
    next_safe_action: "Orchestrator reviews summaries and resolves suite/.codex blockers"
    completion_pct: 95
---

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->

# Implementation Summary: 029 — Runtime Hook Parity Remediation

<!-- ANCHOR:summary-029 -->
## Status

**Implemented with documented blockers.** Phases A–D are complete at the targeted source/test layer, and Phase E captured remediation evidence. The whole-repo vitest gate is not green because broader baseline suites still fail outside this packet's implementation scope, and this sandbox denied direct writes to `.codex/policy.json` with `EPERM`.
<!-- /ANCHOR:summary-029 -->

<!-- ANCHOR:scope-029 -->
## Scope

10 findings (5 P1 + 5 P2) from `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/027-skill-graph-daemon-and-advisor-unification-pt-01/codex-and-code-graph-hook-deep-dive.md`.

Phases:
- Phase A — OpenCode plugin transport fix (HOOK-P1-001 + HOOK-P2-005)
- Phase B — Codex advisor hook reliability (HOOK-P1-002 + HOOK-P1-003)
- Phase C — Copilot startup + docs truth-sync (HOOK-P1-004 + HOOK-P1-005 + HOOK-P2-001 + HOOK-P2-004)
- Phase D — Codex PreToolUse policy hardening (HOOK-P2-002 + HOOK-P2-003)
<!-- /ANCHOR:scope-029 -->

<!-- ANCHOR:what-built-029 -->
## What Was Built

Phase A restored OpenCode plugin transport parity by extracting `buildOpencodeTransport()` in `handlers/session-resume.ts`, wiring the helper into the minimal `session_resume` branch, exporting `parseTransportPlan()`, and adding a real bridge contract test for `.opencode/plugins/spec-kit-compact-code-graph-bridge.mjs --minimal`. The bridge now emits a stderr diagnostic when handler output lacks `opencodeTransport`.

Phase B made the Codex advisor hook reliable by replacing the invalid `codex hooks list` probe with `.codex/settings.json` JSON validation plus a scrubbed `codex --version` hint, adding native-first advisor scoring, extending hook timeout handling through `SPECKIT_CODEX_HOOK_TIMEOUT_MS`, and returning a prompt-safe `Advisor: stale (cold-start timeout)` advisory on true timeouts. Subprocess timeout classification now distinguishes `TIMEOUT` from external `SIGNAL_KILLED`.

Phase C repaired Copilot startup wiring by routing `.github/hooks/superset-notify.json` `sessionStart` through `.github/hooks/scripts/session-start.sh` while preserving the Superset fan-out. Runtime docs now split prompt hooks from lifecycle hooks, Codex docs point to `session_bootstrap` for startup recovery, and active `context-prime` claims were removed from the 024/030 implementation summary.

Phase D hardened Codex PreToolUse policy handling by supporting `bash_denylist`, parsing `toolInput.command`, removing runtime filesystem writes, adding in-memory defaults with `status:"in_memory_default"` diagnostics, and moving policy bootstrap into `hooks/codex/setup.ts` with `npm run setup:codex-policy`. Because `.codex/policy.json` was not writable in this sandbox, the runtime supplements existing policy files with default deny entries, including bare `git reset --hard`.
<!-- /ANCHOR:what-built-029 -->

<!-- ANCHOR:how-delivered-029 -->
## How It Was Delivered

Work proceeded phase-by-phase in the requested order: A, B, C, D, then closing. After each phase, targeted source checks ran and a phase summary file was written:

- `phase-A-fix-summary.md`
- `phase-B-fix-summary.md`
- `phase-C-fix-summary.md`
- `phase-D-fix-summary.md`

No `git add`, `git commit`, or `git reset` commands were run. Each phase summary includes addressed findings, absolute modified paths, verification output, and the proposed commit message for the orchestrator.
<!-- /ANCHOR:how-delivered-029 -->

<!-- ANCHOR:decisions-029 -->
## Decisions

See `decision-record.md`:
- ADR-001: Minimal `session_resume` returns `opencodeTransport`
- ADR-002: Remove `context-prime` claim; document `session_bootstrap`
- ADR-003: Copilot `sessionStart` → repo-local wrapper
- ADR-004: Codex hook timeout → stale-advisory fallback, not silent fail-open
- ADR-005: PreToolUse reads `bashDenylist` + `bash_denylist` aliases
- ADR-006: PreToolUse does not perform filesystem writes during hook execution
<!-- /ANCHOR:decisions-029 -->

<!-- ANCHOR:verification-029 -->
## Verification

Completed targeted gates:

- `cd .opencode/skill/system-spec-kit/mcp_server && npm run typecheck` → exit 0 after phases A, B, C, and D.
- `cd .opencode/skill/system-spec-kit/mcp_server && npm run build` → exit 0 after phases A, B, C, and D.
- `vitest run tests/session-resume.vitest.ts tests/opencode-plugin.vitest.ts` → 15 tests passed.
- `vitest run tests/codex-hook-policy.vitest.ts tests/codex-user-prompt-submit-hook.vitest.ts skill-advisor/tests/legacy/advisor-subprocess.vitest.ts skill-advisor/tests/legacy/advisor-observability.vitest.ts` → 29 tests passed.
- `vitest run tests/copilot-hook-wiring.vitest.ts` → 3 tests passed.
- `vitest run tests/codex-pre-tool-use.vitest.ts` → 10 tests passed.
- Codex hook compiled smoke returned non-empty `hookSpecificOutput.additionalContext`.
- OpenCode bridge smoke parsed `--minimal` stdout into a valid transport plan with `transportOnly: true`.
- `jq empty .github/hooks/superset-notify.json` → exit 0.

Blocked gates:

- The full workspace vitest command is not green. The completed whole-suite run reports out-of-scope baseline failures in progressive validation, canonical-save validation, integration, context-server, CLI, resume performance, task-enrichment, search archival, transcript planner, advisor runtime parity, and deep-loop prompt-pack tests.
- `.codex/policy.json` could not be updated because sandbox write attempts returned `EPERM`; runtime behavior was hardened through defaults and setup bootstrap instead.
<!-- /ANCHOR:verification-029 -->
