# 009 Impact Analysis — 03 (003-hook-parity-remediation)

## Sub-packet Summary
- Sub-packet: `003-hook-parity-remediation`
- Spec docs read: `checklist.md` (depth 0), `decision-record.md` (depth 0), `implementation-summary.md` (depth 0), `plan.md` (depth 0), `spec.md` (depth 0), `tasks.md` (depth 0), `phase-A-fix-summary.md` (depth 0), `phase-B-fix-summary.md` (depth 0), `phase-C-fix-summary.md` (depth 0), `phase-D-fix-summary.md` (depth 0), `phase-E-fix-summary.md` (depth 0), `vitest-triage-phase-1-summary.md` (depth 0), `vitest-triage-phase-2-architecture-and-fixtures-summary.md` (depth 0), `vitest-triage-phase-3-save-and-session-summary.md` (depth 0), `vitest-triage-phase-4-docs-and-regressions-summary.md` (depth 0), `vitest-triage-final-summary.md` (depth 0)
- Work performed:
- Added visible OpenCode transport diagnostics for missing or unparsable plugin transport and kept minimal `session_resume` returning parseable `opencodeTransport`.
- Changed Codex `UserPromptSubmit` behavior to emit a prompt-safe stale advisory on timeout and to treat valid `.codex/settings.json` as the hook-policy registration signal.
- Corrected runtime docs so Codex startup recovery is `session_bootstrap`, not a native lifecycle hook, and so the runtime matrix distinguishes prompt, lifecycle, compaction, and stop capabilities.
- Corrected Copilot `sessionStart` wiring to use the repo-local wrapper while preserving the Superset fan-out path.
- Hardened Codex PreToolUse to accept both denylist key shapes, read `toolInput.command`, and fall back to in-memory defaults without runtime file writes.
- Refreshed packet-local validation, checklist evidence, continuity, graph metadata, and deferred-Vitest closure notes.
- Key surfaces touched: `hooks`, `advisor`, `plugin-loader`, `renderer`, `wiring`, `policy`, `docs`

## Files Requiring Updates
| Path | Category | Reason | Severity | Suggested Change |
|---|---|---|---|---|
| `.opencode/skill/system-spec-kit/SKILL.md` | Skill | The startup/recovery section still says Codex uses `SessionStart` hook scripts plus `~/.codex/hooks.json`, but this sub-packet explicitly documents the opposite: Codex has prompt hooks only and startup recovery should be described via `session_bootstrap`. | HIGH | Replace the Codex runtime paragraph with the current capability split: prompt hooks yes, lifecycle startup hook no, recovery via `session_bootstrap` or `/spec_kit:resume`, and keep OpenCode/Copilot wording aligned with the hook matrix. |
| `.opencode/skill/system-spec-kit/README.md` | README | The overview still compresses runtime integration into a generic "runtime hooks cover ... Codex CLI ... OpenCode plugin bridge" summary. After this packet, the operator-facing summary should mirror the new prompt-vs-lifecycle distinction instead of implying uniform runtime parity. | MED | Tighten the Skill Advisor/runtime overview to call out Codex prompt-only behavior, OpenCode plugin-based startup transport, and Copilot file-based startup refresh, or link directly to the hook matrix. |
| `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Skill | Phase B verification exercises `SPECKIT_CODEX_HOOK_TIMEOUT_MS`, and the timeout behavior now matters because Codex returns a stale advisory instead of empty output on timeout. The env reference documents adjacent Codex/session knobs but does not list this timeout control. | MED | Add `SPECKIT_CODEX_HOOK_TIMEOUT_MS` with default, scope, and the timeout fallback behavior for Codex `UserPromptSubmit` / advisor subprocess execution. |

## Files Not Requiring Updates (from audit)
- The runtime-integration docs that this packet explicitly corrected are already aligned in the audited set: `AGENTS.md`, `.opencode/skill/system-spec-kit/references/config/hook_system.md`, and `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md`.
- The audited command docs, agent docs, and most README/document entries are about memory/save/search/spec-folder workflows, release-cleanup playbooks, or generic setup; they do not document the hook, plugin transport, or PreToolUse contracts changed here.
- The audited feature-catalog, manual-testing, graph/search, and template references are orthogonal to this packet's runtime-hook parity changes.

## Evidence
- `.opencode/skill/system-spec-kit/SKILL.md`
- Source change evidence: `spec.md:76` says runtime docs are in scope, `spec.md:81-82` states Codex does not expose a `SessionStart` lifecycle hook, `spec.md:126` requires a hook-capability split, and `phase-C-fix-summary.md:7-8` records that Codex docs were corrected to `session_bootstrap` plus an explicit runtime matrix.
- Target evidence: `.opencode/skill/system-spec-kit/SKILL.md:745` still says "Claude, Gemini, and Codex use SessionStart hook scripts" and requires Codex `~/.codex/hooks.json` wiring.

## Uncertainty
- NEEDS VERIFICATION: The supplied audit file path is correct, but its header and summary still describe `005-release-cleanup-playbooks` rather than `010-hook-parity`. This analysis used the file's listed path inventory as the canonical audit set anyway.
- NEEDS VERIFICATION: The `ENV_REFERENCE.md` row assumes `SPECKIT_CODEX_HOOK_TIMEOUT_MS` is intended to remain an operator-facing env knob. Phase B clearly uses it in verification, but the packet docs do not explicitly say whether it is newly introduced public configuration or an internal/debug override that was simply exercised in tests.
