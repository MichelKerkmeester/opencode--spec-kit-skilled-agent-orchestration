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
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/029-hook-parity-remediation"
    last_updated_at: "2026-04-21T10:20:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded checklist with 10 items + gates"
    next_safe_action: "Codex fills evidence after implementation"
    completion_pct: 5
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

- [ ] **R-P1-A / HOOK-P1-001** — `session_resume({ minimal: true })` returns `opencodeTransport`
  - Evidence (source): `mcp_server/handlers/session-resume.ts:<line>` contains `buildOpencodeTransport()` call in minimal branch
  - Evidence (test): `mcp_server/tests/session-resume.vitest.ts:<line>` asserts `opencodeTransport.transportOnly === true` for minimal call
  - Evidence (integration): `mcp_server/tests/opencode-plugin.vitest.ts:<line>` runs real bridge stdout through `parseTransportPlan()`

- [ ] **R-P1-B / HOOK-P1-002** — Codex hook emits `additionalContext` reliably
  - Evidence (native path): `mcp_server/hooks/codex/user-prompt-submit.ts:<line>` native-first branch
  - Evidence (timeout cfg): `mcp_server/skill-advisor/lib/subprocess.ts:<line>` reads `SPECKIT_CODEX_HOOK_TIMEOUT_MS` with `3000ms` default
  - Evidence (stale fallback): `hooks/codex/user-prompt-submit.ts:<line>` returns `status:"stale"` advisory on timeout
  - Evidence (smoke test): `mcp_server/tests/codex-user-prompt-submit-hook.vitest.ts:<line>` asserts non-empty `additionalContext`

- [ ] **R-P1-C / HOOK-P1-003** — `detectCodexHookPolicy()` uses valid probe
  - Evidence (removed): `lib/codex-hook-policy.ts` no longer calls `codex hooks list`
  - Evidence (added): `.codex/settings.json` + JSON-parse check is the primary signal
  - Evidence (env scrub): `codex --version` probe scrubs `CODEX_TUI_*` + `CODEX_CI`
  - Evidence (tests): `tests/codex-hook-policy.vitest.ts:<line>` covers invalid-list + Superset-env + settings-present

- [ ] **R-P1-D / HOOK-P1-004** — Copilot `sessionStart` routes to repo-local wrapper
  - Evidence (JSON): `.github/hooks/superset-notify.json:<line>` `sessionStart.command` equals `.github/hooks/scripts/session-start.sh`
  - Evidence (wrapper fans out): `.github/hooks/scripts/session-start.sh:41` calls Superset inline
  - Evidence (test): `mcp_server/tests/copilot-hook-wiring.vitest.ts:<line>` asserts the wrapper route

- [ ] **R-P1-E / HOOK-P1-005** — Codex `context-prime` claims removed or backed by file
  - Evidence (grep): `grep -rn context-prime .opencode/specs/ .opencode/skill/ AGENTS.md` returns no orphan references
  - Evidence (doc fix): `024/030/implementation-summary.md:<line>` points at `session_bootstrap`

## P2 Items (should pass)

- [ ] **R-P2-A / HOOK-P2-001** — Codex hooks README reflects current state
  - Evidence: `mcp_server/hooks/codex/README.md:<line>` describes settings+policy registered; lifecycle hooks absent; smoke procedure documented

- [ ] **R-P2-B / HOOK-P2-002** — PreToolUse policy coverage expanded
  - Evidence (alias): `loadPolicy()` merges `bashDenylist` + `bash_denylist`
  - Evidence (casing): `bashCommandFor()` parses `tool_input`, `toolInput`, `input`, `command`
  - Evidence (default): `.codex/policy.json` default denylist includes bare `git reset --hard`
  - Evidence (tests): three new cases in `codex-pre-tool-use.vitest.ts`

- [ ] **R-P2-C / HOOK-P2-003** — PreToolUse no longer writes policy file during execution
  - Evidence (removed): `ensurePolicyFile()` moved out of hook runtime path
  - Evidence (in-memory default): `loadPolicy()` returns defaults when file missing
  - Evidence (bootstrap): `session_bootstrap` or `setup:codex-policy` script creates the file
  - Evidence (test): missing-file case in `codex-pre-tool-use.vitest.ts` asserts no filesystem write

- [ ] **R-P2-D / HOOK-P2-004** — Runtime matrix docs split prompt vs lifecycle hooks
  - Evidence: `references/config/hook_system.md:<line>` contains the 4-column runtime matrix
  - Evidence: `AGENTS.md:<line>` references the matrix instead of "hook-capable runtimes"
  - Evidence: `INSTALL_GUIDE.md:137` clarifies Codex uses `session_bootstrap`

- [ ] **R-P2-E / HOOK-P2-005** — Plugin tests exercise real bridge shape
  - Evidence: `tests/opencode-plugin.vitest.ts:<line>` includes at least one test without `opencodeTransport` mock
  - Evidence: test passes against the real bridge stdout

## Verification Gates

- [ ] `cd .opencode/skill/system-spec-kit/mcp_server && npm run typecheck` → exit 0
- [ ] `cd .opencode/skill/system-spec-kit/mcp_server && npm run build` → exit 0
- [ ] `cd .opencode/skill/system-spec-kit/mcp_server && ../scripts/node_modules/.bin/vitest run --reporter=default` → full suite green + ≥6 new tests added
- [ ] `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/029-hook-parity-remediation --strict --no-recursive` → pass

## Regression Guards

- [ ] Non-minimal `session_resume` output snapshot UNCHANGED (Phase A refactor safety)
- [ ] Phase 020 skill-advisor hook surface tests still green
- [ ] Phase 024/030/031 Copilot wiring tests still green (or updated per R-P1-D)
- [ ] No new `dist/` build warnings
<!-- /ANCHOR:checklist-029 -->
