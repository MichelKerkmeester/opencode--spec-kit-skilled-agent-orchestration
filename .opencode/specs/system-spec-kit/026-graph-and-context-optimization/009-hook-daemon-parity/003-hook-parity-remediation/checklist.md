---
title: "029 — Hook Parity Remediation Checklist"
description: "Acceptance-criteria checklist mapping each finding to a verification step with evidence slot (file:line) and test citation."
trigger_phrases:
  - "029 checklist"
  - "hook parity checklist"
importance_tier: "high"
contextType: "qa-checklist"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/003-hook-parity-remediation"
    last_updated_at: "2026-04-21T13:10:00Z"
    last_updated_by: "codex-gpt-5.4"
    recent_action: "Implementation evidence filled; blocked gates documented"
    next_safe_action: "Resolve out-of-scope suite baseline and .codex policy write"
    completion_pct: 95
---

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->

# Verification Checklist: 029 — Runtime Hook Parity Remediation

All items must be `[x]` with a file:line evidence citation before claiming complete.

<!-- ANCHOR:checklist-029 -->
## Verification Protocol

Each R-P* item below must be checked `[x]` with file:line evidence. Code Quality (typecheck, build, vitest) gates listed at the end are run after all items are checked.

## Code Quality

- typecheck must exit 0
- build must exit 0
- vitest suite must remain green with at least 6 new tests added per plan.md
- validate.sh --strict --no-recursive on this folder must pass

## P1 Items (must pass to release)

- [x] **R-P1-A / HOOK-P1-001** — `session_resume({ minimal: true })` returns `opencodeTransport` [EVIDENCE: `handlers/session-resume.ts:657`, `tests/session-resume.vitest.ts:287`]
  - Evidence (source): `mcp_server/handlers/session-resume.ts:214` defines `buildOpencodeTransport()`; `mcp_server/handlers/session-resume.ts:657` calls it in the minimal branch.
  - Evidence (test): `mcp_server/tests/session-resume.vitest.ts:287` asserts `opencodeTransport.transportOnly === true` for minimal call.
  - Evidence (integration): `mcp_server/tests/opencode-plugin.vitest.ts:111-127` runs real bridge stdout through `parseTransportPlan()`.

- [x] **R-P1-B / HOOK-P1-002** — Codex hook emits `additionalContext` reliably [EVIDENCE: `hooks/codex/user-prompt-submit.ts:350-360`, `tests/codex-user-prompt-submit-hook.vitest.ts:233-258`]
  - Evidence (native path): `mcp_server/hooks/codex/user-prompt-submit.ts:227-240` tries native-first advisor dispatch before subprocess fallback.
  - Evidence (timeout cfg): `mcp_server/skill-advisor/lib/subprocess.ts:63-76` reads `SPECKIT_CODEX_HOOK_TIMEOUT_MS` with `3000ms` default.
  - Evidence (stale fallback): `hooks/codex/user-prompt-submit.ts:350-360` returns `status:"stale"` advisory on timeout.
  - Evidence (smoke test): `mcp_server/tests/codex-user-prompt-submit-hook.vitest.ts:233-258` asserts non-empty `additionalContext`.

- [x] **R-P1-C / HOOK-P1-003** — `detectCodexHookPolicy()` uses valid probe [EVIDENCE: `lib/codex-hook-policy.ts:193-198`, `tests/codex-hook-policy.vitest.ts:86-179`]
  - Evidence (removed): `lib/codex-hook-policy.ts:193-198` calls only `codex --version`; no `codex hooks list` call remains.
  - Evidence (added): `lib/codex-hook-policy.ts:120-136` validates `.codex/settings.json` by existence + JSON parse.
  - Evidence (env scrub): `lib/codex-hook-policy.ts:108-118` scrubs `CODEX_TUI_*`, `CODEX_CI`, and `CODEX_THREAD_ID`.
  - Evidence (tests): `tests/codex-hook-policy.vitest.ts:86-179` covers invalid-list, Superset env scrub, and settings-present cases.

- [x] **R-P1-D / HOOK-P1-004** — Copilot `sessionStart` routes to repo-local wrapper [EVIDENCE: `.github/hooks/superset-notify.json:4-8`, `tests/copilot-hook-wiring.vitest.ts:15-21`]
  - Evidence (JSON): `.github/hooks/superset-notify.json:4-8` sets `sessionStart` bash to `.github/hooks/scripts/session-start.sh`.
  - Evidence (wrapper fans out): `.github/hooks/scripts/session-start.sh:41` calls Superset inline.
  - Evidence (test): `mcp_server/tests/copilot-hook-wiring.vitest.ts:15-21` asserts the wrapper route.

- [~] **R-P1-E / HOOK-P1-005** — Codex `context-prime` claims removed or backed by file
  - Evidence (active grep): targeted `rg -n "context-prime"` over active Phase C docs returned exit 1/no matches.
  - Evidence (doc fix): `024/030/implementation-summary.md:51` and `024/030/implementation-summary.md:143` point at `session_bootstrap`.
  - Deferred note: the exact broad grep still finds historical/archive references outside the authorized edit scope, so this item is functionally fixed for active docs but not globally zero-match.

## P2 Items (should pass)

- [x] **R-P2-A / HOOK-P2-001** — Codex hooks README reflects current state
  - Evidence: `mcp_server/hooks/codex/README.md:19-28` describes settings+policy registration, lifecycle absence, smoke procedure, and stale timeout behavior.

- [~] **R-P2-B / HOOK-P2-002** — PreToolUse policy coverage expanded
  - Evidence (alias): `hooks/codex/pre-tool-use.ts:193-198` merges `bashDenylist`, `bash_denylist`, and runtime defaults.
  - Evidence (casing): `hooks/codex/pre-tool-use.ts:143-145` parses `tool_input`, `toolInput`, `input`, and direct `command`.
  - Evidence (default): `hooks/codex/pre-tool-use.ts:63-82` includes bare `git reset --hard` in runtime/setup defaults.
  - Evidence (tests): `codex-pre-tool-use.vitest.ts:101-158` covers alias, camelCase command, and missing-file defaults.
  - Deferred note: `.codex/policy.json` itself could not be updated because the sandbox returned `EPERM`; runtime behavior is still hardened.

- [x] **R-P2-C / HOOK-P2-003** — PreToolUse no longer writes policy file during execution
  - Evidence (removed): `hooks/codex/pre-tool-use.ts:118-126` returns defaults when missing instead of writing a file.
  - Evidence (in-memory default): `hooks/codex/pre-tool-use.ts:110-126` emits `status:"in_memory_default"` and returns defaults.
  - Evidence (bootstrap): `hooks/codex/setup.ts:25-40` provides `ensurePolicyBootstrap()` and writes only from setup.
  - Evidence (test): `codex-pre-tool-use.vitest.ts:140-158` asserts missing-file behavior and no filesystem write.

- [x] **R-P2-D / HOOK-P2-004** — Runtime matrix docs split prompt vs lifecycle hooks
  - Evidence: `references/config/hook_system.md:48-58` contains the 4-column runtime matrix.
  - Evidence: `AGENTS.md:92-97` references the matrix instead of generic "hook-capable runtimes".
  - Evidence: `INSTALL_GUIDE.md:137` clarifies Codex uses `session_bootstrap`.

- [x] **R-P2-E / HOOK-P2-005** — Plugin tests exercise real bridge shape
  - Evidence: `tests/opencode-plugin.vitest.ts:111-127` includes a real bridge stdout parse without an `opencodeTransport` mock.
  - Evidence: targeted Phase A vitest passed `tests/session-resume.vitest.ts tests/opencode-plugin.vitest.ts` with 15 tests.

## Verification Gates

- [x] `cd .opencode/skill/system-spec-kit/mcp_server && npm run typecheck` → exit 0 after each phase
- [x] `cd .opencode/skill/system-spec-kit/mcp_server && npm run build` → exit 0 after each phase
- [~] `cd .opencode/skill/system-spec-kit/mcp_server && ../scripts/node_modules/.bin/vitest run --reporter=default` → targeted new tests pass; full suite blocked by out-of-scope baseline failures across progressive-validation, canonical-save, integration, context-server, and related suites
- [x] `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/003-hook-parity-remediation --strict --no-recursive` → pass [EVIDENCE: strict validation passed with Errors: 0 / Warnings: 0]

## Regression Guards

- [x] Non-minimal `session_resume` output snapshot UNCHANGED (Phase A targeted `tests/session-resume.vitest.ts` passed)
- [x] Phase 020 skill-advisor hook surface tests still green (`skill-advisor/tests/legacy/advisor-subprocess.vitest.ts` and `advisor-observability.vitest.ts` passed)
- [x] Phase 024/030/031 Copilot wiring tests still green/updated (`tests/copilot-hook-wiring.vitest.ts` passed)
- [x] No new `dist/` build warnings (`npm run build` exit 0)
<!-- /ANCHOR:checklist-029 -->
