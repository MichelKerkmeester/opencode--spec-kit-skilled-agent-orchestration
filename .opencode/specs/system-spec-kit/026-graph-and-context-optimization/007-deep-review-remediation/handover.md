---
title: "Session Handover: Deep Review Remediation"
description: "Packet-level handover for 007-deep-review-remediation child phases, including Copilot hook parity, Codex hook parity, and OpenCode plugin loader remediation outcomes."
trigger_phrases:
  - "007-deep-review-remediation handover"
  - "copilot hook parity outcome"
  - "codex hook parity outcome"
  - "deep review remediation handover"
importance_tier: "important"
contextType: "handover"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation"
    last_updated_at: "2026-04-22T15:21:31Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Recorded OpenCode plugin loader remediation outcome"
    next_safe_action: "Resolve out-of-scope Copilot hook wiring test before claiming full package-wide vitest green"
    blockers:
      - "009 full vitest gate is blocked by `copilot-hook-wiring.vitest.ts` expecting repo-local hook commands while `.github/hooks/superset-notify.json` points to Superset hook commands."
    key_files:
      - "handover.md"
      - "007-copilot-hook-parity-remediation/implementation-summary.md"
      - "008-codex-hook-parity-remediation/implementation-summary.md"
      - "009-opencode-plugin-loader-remediation/implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "026-007-008-codex-remediation-2026-04-22"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Copilot parity uses a managed custom-instructions block because hook stdout cannot modify prompts."
      - "Codex parity uses native SessionStart and UserPromptSubmit hooks because Codex 0.122.0 injects hook stdout as developer context."
      - "OpenCode plugin loader remediation uses helper isolation plus a legacy parser guard so OpenCode 1.3.17 no longer crashes on `plugin2.auth`."
---
# Session Handover Document

<!-- SPECKIT_TEMPLATE_SOURCE: handover | v1.0 -->

---

<!-- ANCHOR:handover-summary -->
## 1. Handover Summary

- **From Session:** 026-007-008-codex-remediation-2026-04-22
- **To Session:** Next system-spec-kit remediation session
- **Phase Completed:** IMPLEMENTATION
- **Handover Time:** 2026-04-22T11:10:20Z
<!-- /ANCHOR:handover-summary -->

---

<!-- ANCHOR:context-transfer -->
## 2. Context Transfer

### 2.1 Key Decisions Made

| Decision | Rationale | Impact |
|----------|-----------|--------|
| Keep outcome B | GitHub's Copilot hook reference says `sessionStart` output is ignored and `userPromptSubmitted` output cannot modify prompts. | Copilot parity uses `$HOME/.copilot/copilot-instructions.md` instead of hook `additionalContext`. |
| Route `userPromptSubmitted` through repo-local wrapper | The previous hook config sent the event only to Superset notification, so Spec Kit's writer could not run. | `.github/hooks/scripts/user-prompt-submitted.sh` now refreshes the managed custom-instructions block and returns `{}`. |
| Preserve human Copilot instructions | Users may already have personal guidance in `$HOME/.copilot/copilot-instructions.md`. | The writer replaces only the `SPEC-KIT-COPILOT-CONTEXT` block. |
| Ship Codex outcome A | Codex 0.122.0 hooks inject stdout as developer context, and live config now has `codex_hooks = true`. | Native `SessionStart` startup context and `UserPromptSubmit` advisor briefs now run from `~/.codex/hooks.json`. |
| Preserve Superset Codex notifications | Existing `notify.sh` entries belong to the user's Superset layer. | Spec Kit hook entries were appended beside notify entries; Stop remains notify-only. |
| Ship OpenCode plugin-loader outcome A | OpenCode 1.3.17 discovers local plugin entrypoints from a flat `{plugin,plugins}/*.{ts,js}` glob and legacy loader paths can treat named function exports as plugin factories. | Three helper files moved to `.opencode/plugin-helpers/`, `.opencode/plugins/` is entrypoints-only, and the compact parser named export returns `{}` for non-string loader input. |

### 2.2 Blockers Encountered

| Blocker | Status | Resolution/Workaround |
|---------|--------|-----------------------|
| Full `npm run check` fails repo-wide lint | Open | Focused lint on touched TypeScript files passes. Full lint reports 15 unused-variable findings in files outside this phase write scope. |
| Parent `handover.md` was missing | Resolved | Created this packet-level handover and recorded the 007 phase outcome. |
| Codex feature flag was disabled | Resolved | Added `codex_hooks = true` to `~/.codex/config.toml`; `codex features list` now reports true. |
| Full package vitest during OpenCode loader remediation | Open | `npx vitest run` is blocked by out-of-scope `copilot-hook-wiring.vitest.ts` versus current `.github/hooks/superset-notify.json`; focused plugin-loader tests passed 15/15 and `npm run build` passed. |

### 2.3 Files Modified

| File | Change Summary | Status |
|------|----------------|--------|
| `.github/hooks/superset-notify.json` | Routes `userPromptSubmitted` through the local Spec Kit writer wrapper. | complete |
| `.github/hooks/scripts/user-prompt-submitted.sh` | New hook wrapper that runs the compiled Copilot advisor writer, then notifies Superset. | complete |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/*.ts` | Adds custom-instructions writer and rewires prompt/session hooks around file-based context. | complete |
| `.opencode/skill/system-spec-kit/mcp_server/tests/copilot-*.vitest.ts` | Updates tests to assert file-based context instead of prompt mutation. | complete |
| `.opencode/skill/cli-copilot/` | Documents Copilot hook limitation, managed custom-instructions workaround, and programmatic wrapper. | complete |
| `007-copilot-hook-parity-remediation/` | Updates tasks, checklist, and implementation summary with final evidence. | complete |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/session-start.ts` | New Codex SessionStart adapter emitting startup context through `hookSpecificOutput.additionalContext`. | complete |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts` | Codex UserPromptSubmit adapter emits compact skill advisor brief as developer context. | complete |
| `.opencode/skill/system-spec-kit/mcp_server/tests/codex-*.vitest.ts` | Codex hook tests for parsing, fail-open behavior, CLI execution, and compiled output. | complete |
| `.opencode/skill/cli-codex/` | Documents native hooks, `codex_hooks` flag, smoke checks, and hook contract reference. | complete |
| `008-codex-hook-parity-remediation/` | Updates tasks, checklist, and implementation summary with final evidence. | complete |
| `~/.codex/hooks.json` | Appends Spec Kit Memory SessionStart/UserPromptSubmit commands beside Superset notify hooks. | complete |
| `~/.codex/config.toml` | Enables `[features].codex_hooks = true`. | complete |
| `.opencode/plugin-helpers/` | New helper location for the advisor bridge, compact-code-graph bridge, and OpenCode message schema helper. | complete |
| `.opencode/plugins/spec-kit-skill-advisor.js` | Updates `BRIDGE_PATH` to the relocated advisor bridge. | complete |
| `.opencode/plugins/spec-kit-compact-code-graph.js` | Updates bridge/schema paths and guards `parseTransportPlan()` against legacy loader non-string input. | complete |
| `.opencode/plugins/README.md` | Documents the entrypoints-only convention and OpenCode 1.3.17 upgrade probe. | complete |
| `.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugins-folder-purity.vitest.ts` | Adds the plugin folder purity regression guard. | complete |
| `009-opencode-plugin-loader-remediation/` | Updates ADRs, checklist, tasks, and implementation summary with evidence and limitations. | complete |
<!-- /ANCHOR:context-transfer -->

---

<!-- ANCHOR:next-session -->
## 3. For Next Session

### 3.1 Recommended Starting Point

- **File:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/008-codex-hook-parity-remediation/implementation-summary.md`
- **Context:** Review the verification section first; Codex native hook parity is implemented, registered, and smoke-tested.

### 3.2 Priority Tasks Remaining

1. Resolve or explicitly scope the Copilot hook wiring mismatch before claiming full `npx vitest run` green for the package.
2. Monitor Codex hook schema changes while `codex_hooks` remains marked under development.
3. Decide whether a separate cleanup packet should address the package-wide lint findings noted by the Copilot child phase.
4. Monitor GitHub Copilot CLI hook and ACP updates for a future outcome A path.
5. Re-run `/spec_kit:resume` before any future continuation so memory picks up this handover and the child summaries.

### 3.3 Critical Context to Load

- [x] Indexed save target: `007-copilot-hook-parity-remediation`
- [x] Spec file: `007-copilot-hook-parity-remediation/spec.md`
- [x] Plan file: `007-copilot-hook-parity-remediation/plan.md`
- [x] Indexed save target: `008-codex-hook-parity-remediation`
- [x] Spec file: `008-codex-hook-parity-remediation/spec.md`
- [x] Plan file: `008-codex-hook-parity-remediation/plan.md`
- [x] Indexed save target: `009-opencode-plugin-loader-remediation`
- [x] Spec file: `009-opencode-plugin-loader-remediation/spec.md`
- [x] Plan file: `009-opencode-plugin-loader-remediation/plan.md`
<!-- /ANCHOR:next-session -->

---

<!-- ANCHOR:validation-checklist -->
## 4. Validation Checklist

- [ ] Current scoped implementation is built and tested. (OpenCode loader focused tests/build pass; full package vitest blocked by out-of-scope Copilot hook wiring mismatch.)
- [x] Current context is ready for `generate-context.js`.
- [x] No breaking changes left mid-implementation.
- [x] Touched-file lint, typecheck, build, focused tests, shell syntax, Copilot smoke, and Codex smoke were run.
- [x] This handover document is complete.
<!-- /ANCHOR:validation-checklist -->

---

<!-- ANCHOR:session-notes -->
## 5. Session Notes

Copilot CLI 1.0.34 confirmed the managed custom-instructions block in a real non-interactive smoke test on 2026-04-22. Prompt: `From your custom instructions, quote the Active Advisor Brief line that starts with Advisor:. If none is available, answer NONE.` Result: `Advisor: stale; use sk-code-opencode 0.92/0.00 pass.`

Codex CLI 0.122.0 confirmed native hooks are active on 2026-04-22. Direct SessionStart smoke emitted startup code-graph context, direct UserPromptSubmit smoke emitted `Advisor: stale; use sk-code-opencode 0.92/0.12 pass.`, and a fresh real `codex exec --json --ephemeral` returned `HOOK_SMOKE_OK` with 28,265 input tokens after the hook context was injected.

OpenCode 1.3.17 plugin loader remediation shipped Outcome A on 2026-04-22. `.opencode/plugins/` now contains only the two plugin entrypoints plus README; helper modules live under `.opencode/plugin-helpers/`. Public and Barter OpenCode smokes no longer emit `plugin2.auth`; XDG-writable smokes reached TUI/server bootstrap logs. Focused plugin-loader tests passed 15/15, `npm run build` passed, and the new purity guard fails on a temporary no-default-export stub.
<!-- /ANCHOR:session-notes -->
