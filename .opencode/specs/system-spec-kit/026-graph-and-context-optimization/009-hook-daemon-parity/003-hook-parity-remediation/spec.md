---
title: "029 — Runtime Hook Parity Remediation"
description: "Fix 10 hook findings (5 P1 + 5 P2) from the 2026-04-21 deep-dive."
trigger_phrases:
  - "029 hook parity"
  - "opencode plugin bridge"
  - "codex advisor hook"
importance_tier: "high"
contextType: "feature-specification"
packet_level: 3
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/003-hook-parity-remediation"
    last_updated_at: "2026-04-21T10:20:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded packet"
    next_safe_action: "Dispatch codex Phase A"
    completion_pct: 5
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Feature Specification: 029 — Runtime Hook Parity Remediation

| Field | Value |
|---|---|
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../002-skill-graph-daemon-and-advisor-unification/spec.md |

<!-- ANCHOR:spec-context-029 -->
## 1. Context

### Problem Statement
The 2026-04-21 Codex-and-code-graph hook deep-dive surfaced 10 runtime-hook findings: OpenCode plugin silently no-ops, Codex advisor hook fail-opens before injection, Codex hook-policy detector uses invalid probes, Copilot startup wiring points at Superset instead of the repo wrapper, packet docs claim a nonexistent `context-prime` agent, and PreToolUse policy has alias/casing coverage gaps.

The 2026-04-21 Codex-and-code-graph hook deep-dive (under the 027 review packet) produced 10 findings across runtime hook surfaces:

- **OpenCode plugin bridge** (HOOK-P1-001): `--minimal` path drops `opencodeTransport`, plugin no-ops
- **Codex advisor hook fail-open** (HOOK-P1-002): subprocess 1s timeout produces `{}` with `SIGNAL_KILLED`
- **Codex hook-policy detector** (HOOK-P1-003): `codex hooks list` probe invalid in 0.121.0; Superset TUI env causes spurious version-probe timeouts
- **Copilot startup hook routing** (HOOK-P1-004): `superset-notify.json` still routes `sessionStart` to Superset, not the repo-local wrapper (contradicts Phase 031 summary)
- **Codex lifecycle docs** (HOOK-P1-005): packet docs claim a `context-prime` Codex agent that does not exist
- **Codex README staleness** (HOOK-P2-001): claims repo-local `.codex/settings.json` registration was deferred — it was not
- **Codex PreToolUse policy coverage** (HOOK-P2-002): only `bashDenylist` (not `bash_denylist` alias) and only snake_case `tool_input` (not `toolInput`); bare `git reset --hard` not denied
- **Codex PreToolUse filesystem side-effect** (HOOK-P2-003): `ensurePolicyFile()` writes a default policy from inside the hook
- **Runtime docs overstate Codex hook coverage** (HOOK-P2-004): "hook-capable runtimes" phrasing implies lifecycle parity
- **OpenCode plugin tests mock bridge contract** (HOOK-P2-005): tests mock `opencodeTransport` instead of exercising the real bridge

No P0 findings. The highest customer-facing risk is HOOK-P1-001 (OpenCode plugin delivers no code-graph context) and HOOK-P1-002 (Codex advisor brief invisible in hook-driven flows).
<!-- /ANCHOR:spec-context-029 -->

<!-- ANCHOR:spec-goals-029 -->
## 2. Goals

- **G1** — OpenCode code-graph plugin delivers `opencodeTransport` through the real bridge path (no mocks).
- **G2** — Codex `UserPromptSubmit` hook reliably returns `hookSpecificOutput.additionalContext` on a warm workspace; `SIGNAL_KILLED` failure mode eliminated or reclassified.
- **G3** — Codex hook-policy detector uses a valid capability probe that works under Superset TUI env and classifies `.codex/settings.json` presence accurately.
- **G4** — Copilot `sessionStart` points to the repo-local wrapper when the wrapper is the intended entrypoint; tests assert the intended route.
- **G5** — Codex lifecycle claims in packet docs match actual filesystem state (`context-prime` removed or implemented).
- **G6** — Codex PreToolUse policy covers `bash_denylist` alias, `toolInput` casing, and bare destructive commands; does not mutate the workspace during execution.
- **G7** — Runtime hook docs split prompt-time hooks from lifecycle hooks so Codex is not misreported.
- **G8** — OpenCode plugin tests exercise the real bridge shape (or assert the real minimal handler output parses through `parseTransportPlan()`).
<!-- /ANCHOR:spec-goals-029 -->

<!-- ANCHOR:spec-requirements-029 -->
## 3. Non-Goals

- Implementing a Codex `SessionStart` lifecycle hook (per CLI capability; out of scope for this phase).
- Rewriting the advisor subprocess or replacing the Python shim wholesale.
- Changing skill-advisor scoring, projection, or fusion math.
- Touching findings from `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/027-skill-graph-daemon-and-advisor-unification-pt-01/scan-findings.md` (handled in parallel Phase 027 remediation, commit `<pending>`).

## 4. Requirements

### 4.1 P0 (none)

No P0 items in this phase.

### 4.2 P1 (must-have, blocks release)

- **R-P1-A (HOOK-P1-001)**: `session_resume({ minimal: true })` MUST return `data.opencodeTransport` with `transportOnly: true` so the OpenCode plugin bridge produces a valid transport plan. **Evidence**: running the bridge with `--minimal` returns JSON containing `data.opencodeTransport.transportOnly === true`; `parseTransportPlan()` accepts the real bridge output.
- **R-P1-B (HOOK-P1-002)**: Compiled `dist/hooks/codex/user-prompt-submit.js` MUST emit `hookSpecificOutput.additionalContext` on a known prompt in a prepared workspace within the hook timeout budget. The `SIGNAL_KILLED` failure mode MUST be eliminated (via native path / extended timeout / warm cache) OR reclassified into a prompt-safe `stale` advisory with explicit `status`.
- **R-P1-C (HOOK-P1-003)**: `detectCodexHookPolicy()` MUST NOT depend on `codex hooks list`. Detection MUST treat `.codex/settings.json` presence + valid JSON as the project-level registration source. The version probe MUST not time out under Superset TUI env.
- **R-P1-D (HOOK-P1-004)**: `.github/hooks/superset-notify.json` MUST route `sessionStart` through the intended entrypoint. If the repo-local wrapper is intended (per Phase 031 summary), the JSON MUST point at `.github/hooks/scripts/session-start.sh`; the wrapper continues to fan out to Superset inline.
- **R-P1-E (HOOK-P1-005)**: Packet docs MUST NOT reference `.codex/agents/context-prime.toml` unless the file exists. Docs update (recommended) + optional agent TOML creation (if desired).

### 4.3 P2 (should-have)

- **R-P2-A (HOOK-P2-001)**: `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/README.md` MUST describe current registration state (settings + policy present, lifecycle hooks still absent, prompt hook smoke verification recommended).
- **R-P2-B (HOOK-P2-002)**: `handleCodexPreToolUse()` MUST read both `bashDenylist` and `bash_denylist` alias, parse `tool_input` and `toolInput` casings, and include bare `git reset --hard` in the default denylist.
- **R-P2-C (HOOK-P2-003)**: PreToolUse MUST NOT write a default policy file during hook execution. Missing policy → fail open with in-memory defaults. Policy generation moves to setup/bootstrap.
- **R-P2-D (HOOK-P2-004)**: `.opencode/skill/system-spec-kit/references/config/hook_system.md`, `AGENTS.md`, `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md` updated with a runtime matrix splitting prompt-time hooks from lifecycle/startup hooks.
- **R-P2-E (HOOK-P2-005)**: `tests/opencode-plugin.vitest.ts` MUST include at least one test that exercises the real bridge stdout shape (unmocked) or asserts `session_resume({ minimal: true })` real output parses through `parseTransportPlan()` successfully.

## 5. Acceptance Scenarios

- **AC-1** (R-P1-A): Running `node .opencode/plugins/spec-kit-compact-code-graph-bridge.mjs --minimal` produces JSON with `data.opencodeTransport.transportOnly === true`. Plugin test suite includes a contract test without bridge-output mocks.
- **AC-2** (R-P1-B): `printf '{"prompt":"review","cwd":"/abs/workspace"}' | node dist/hooks/codex/user-prompt-submit.js` returns stdout containing `hookSpecificOutput.additionalContext`; stderr diagnostic shows `status:"ok"` or explicit `status:"stale"` (NOT `status:"fail_open"` with `SIGNAL_KILLED`).
- **AC-3** (R-P1-C): Vitest `codex-hook-policy.vitest.ts` covers: (a) valid `codex --version` + invalid `hooks list`, (b) inherited Superset TUI env timeout, (c) `.codex/settings.json` presence as the authoritative signal. All pass.
- **AC-4** (R-P1-D): `.github/hooks/superset-notify.json` `sessionStart` entry equals `.github/hooks/scripts/session-start.sh`; `tests/copilot-hook-wiring.vitest.ts` asserts that exact route.
- **AC-5** (R-P1-E): `grep -r context-prime .opencode/specs/` returns only entries that reference an existing file; `.codex/agents/context-prime.toml` either exists or is absent from all docs.
- **AC-6** (R-P2-A): `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/README.md` no longer says registration is deferred; describes current state.
- **AC-7** (R-P2-B): Vitest `codex-pre-tool-use.vitest.ts` includes: (a) `bash_denylist` alias denies, (b) `toolInput.command` denies, (c) bare `git reset --hard` denies.
- **AC-8** (R-P2-C): `dist/hooks/codex/pre-tool-use.js` with missing `.codex/policy.json` does NOT create the file; stderr diagnostic shows in-memory default policy path taken.
- **AC-9** (R-P2-D): `.opencode/skill/system-spec-kit/references/config/hook_system.md` includes a runtime matrix table with columns `prompt hook | lifecycle hook | compaction hook | stop hook`; Codex row shows `yes | no | no | no`.
- **AC-10** (R-P2-E): `tests/opencode-plugin.vitest.ts` includes at least one test with no bridge-output mock; or `tests/session-resume.vitest.ts` asserts `minimal: true` payload contains `opencodeTransport`.
<!-- /ANCHOR:spec-requirements-029 -->

## 6. Verification Gates

- `cd mcp_server && npm run typecheck` → exit 0
- `cd mcp_server && npm run build` → exit 0
- `cd mcp_server && ../scripts/node_modules/.bin/vitest run --reporter=default` → baseline tests green + new hook-parity tests added (no regressions)
- `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict --no-recursive` → pass
- Codex smoke: compiled entrypoint emits `additionalContext` (AC-2)
- OpenCode bridge smoke: `--minimal` returns valid transport plan (AC-1)

## 7. Out-of-Scope / Future Work

- Codex `SessionStart` lifecycle hook parity (requires CLI capability that does not exist as of 0.121.0).
- Gemini hook deep-smoke (out of scope per deep-dive confidence notes).
- Advisor subprocess architectural rewrite.
- Python shim retirement (tracked post-027).

## 8. References

- Source findings: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/027-skill-graph-daemon-and-advisor-unification-pt-01/codex-and-code-graph-hook-deep-dive.md`
- Prior art: Phase 020 (skill-advisor-hook-surface), Phase 024/030/031 (copilot startup hook wiring)
- Runtime truth-source: `INSTALL_GUIDE.md:137`, `hook_system.md:50`

## 9. Requirement Trace

- **REQ-001**: OpenCode minimal resume payload includes an OpenCode transport plan for plugin lifecycle injection.
- **REQ-002**: OpenCode plugin regression tests exercise real bridge stdout, not only mocked transport payloads.
- **REQ-003**: Codex `UserPromptSubmit` returns a non-empty advisor `additionalContext` for work-intent prompts when the hook path is available.
- **REQ-004**: Codex advisor timeout failures produce a prompt-safe stale advisory, not an empty fail-open result.
- **REQ-005**: Codex hook policy detection uses valid `.codex/settings.json` evidence and a scrubbed `codex --version` hint.
- **REQ-006**: Copilot `sessionStart` routes through the repo-local startup wrapper and preserves Superset fan-out.
- **REQ-007**: Active Codex startup docs point to `session_bootstrap`, not a nonexistent `context-prime` lifecycle agent.
- **REQ-008**: Codex hook README documents actual prompt/pre-tool registration and lifecycle limitations.
- **REQ-009**: Codex PreToolUse supports denylist aliases, camelCase command payloads, and bare destructive reset defaults.
- **REQ-010**: Codex PreToolUse hook execution is read-only and uses in-memory defaults when policy files are absent.

## 10. Acceptance Scenario Trace

- **Scenario 1**: OpenCode bridge `--minimal` stdout parses into a transport plan with `transportOnly: true`.
  - **Given** the OpenCode bridge runs with `--minimal`, **When** stdout is parsed by `parseTransportPlan()`, **Then** the result has `transportOnly: true`.
- **Scenario 2**: Codex compiled prompt hook smoke emits non-empty `hookSpecificOutput.additionalContext`.
  - **Given** a work-intent prompt and workspace cwd, **When** the compiled Codex hook reads the JSON payload, **Then** stdout includes non-empty `hookSpecificOutput.additionalContext`.
- **Scenario 3**: Codex hook policy tests prove `.codex/settings.json` detection does not depend on `codex hooks list`.
  - **Given** `codex --version` succeeds and a hooks-list probe would fail, **When** settings JSON is valid, **Then** hook availability is `live`.
- **Scenario 4**: Copilot hook wiring tests assert the `sessionStart` wrapper route and keep other events on Superset.
  - **Given** checked-in Copilot hook JSON, **When** `sessionStart` is inspected, **Then** it points at `.github/hooks/scripts/session-start.sh`.
- **Scenario 5**: Active docs contain no stale `context-prime` startup claim and direct Codex startup recovery to `session_bootstrap`.
  - **Given** active hook docs and packet summaries, **When** Codex startup recovery is described, **Then** the docs point at `session_bootstrap`.
- **Scenario 6**: Codex hook README states prompt/pre-tool registration exists and lifecycle hooks are absent.
  - **Given** the Codex hooks README, **When** registration state is read, **Then** prompt/pre-tool hooks are present and lifecycle hooks are absent.
- **Scenario 7**: PreToolUse tests deny via `bash_denylist`, deny via `toolInput.command`, and deny bare `git reset --hard`.
  - **Given** alias denylist and camelCase command payloads, **When** destructive Bash commands are submitted, **Then** PreToolUse returns `decision:"deny"`.
- **Scenario 8**: Missing Codex policy file does not get created during hook execution and logs `in_memory_default`.
  - **Given** a missing policy path, **When** PreToolUse evaluates a Bash command, **Then** no file is written and an `in_memory_default` diagnostic is emitted.
- **Scenario 9**: Runtime hook docs include the prompt/lifecycle/compaction/stop matrix with Codex `yes | no | no | no`.
  - **Given** the runtime hook matrix, **When** Codex is checked, **Then** prompt hooks are `yes` and lifecycle/compaction/stop are `no`.
- **Scenario 10**: Phase summaries capture verification output and proposed commit messages without running git staging or commits.
  - **Given** each phase completes, **When** the phase summary is written, **Then** it includes verification output and proposed commit message without git staging.

## 11. AI Execution Protocol

### Pre-Task Checklist

- Read `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and the source deep-dive before edits.
- Confirm the established spec folder is `029-hook-parity-remediation`.
- Keep file writes inside the authority list supplied by the user.
- Do not run `git add`, `git commit`, or `git reset`.

### Execution Rules

| Rule | Enforcement |
| --- | --- |
| Work phase-by-phase | Complete A, B, C, D, then E; write a phase summary after each phase. |
| Preserve sandbox truth | Record `DEFERRED` or blocked status when a requested write/check cannot complete. |
| Verify each phase | Run typecheck, build, and targeted regression tests; attempt full suite only when it does not block progress. |
| Keep docs synchronized | Update checklist evidence, implementation summary, phase summaries, and source remediation log. |

### Status Reporting Format

Each phase summary records: finding IDs addressed, modified absolute file paths, verification output, blocked/deferred items, and proposed commit message.

### Blocked Task Protocol

If a finding is ambiguous or blocked, record the item as `DEFERRED` with the exact command/error evidence, continue to the next phase, and avoid claiming that the blocked gate passed.
