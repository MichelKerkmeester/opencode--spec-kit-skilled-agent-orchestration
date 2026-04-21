---
title: "Phase 026 — Tasks"
description: "12 per-finding remediation tasks, sequential cli-copilot dispatch."
importance_tier: "normal"
contextType: "implementation"
---

# Phase 026 Tasks

## T01 — P1-007-01 (D7): Hook reference config drift
- [x] Read `../../009-hook-daemon-parity/001-skill-advisor-hook-surface/../../009-hook-daemon-parity/001-skill-advisor-hook-surface/review/iterations/iteration-007.md`
- [x] Update `../../../../../skill/system-spec-kit/references/hooks/skill-advisor-hook.md` Copilot + Codex snippets to byte-match `.github/hooks/superset-notify.json` + `.codex/settings.json` + `.codex/policy.json`, OR label as illustrative with repo-relative links [Evidence: `../../../../../skill/system-spec-kit/../../../../../skill/system-spec-kit/references/hooks/skill-advisor-hook.md:183-257`]
- [x] Completion marker: `TASK_T01_DONE`

## T02 — P1-014-01 (D7): Stale inventory/status values
- [x] Read `../../009-hook-daemon-parity/001-skill-advisor-hook-surface/../../009-hook-daemon-parity/001-skill-advisor-hook-surface/review/iterations/iteration-014.md`
- [x] Replace hardcoded values with dynamic references OR add explicit snapshot annotation [Evidence: `../../../../../skill/system-spec-kit/mcp_server/skill-advisor/README.md:62-64`, `:190-192`; `../../../../../skill/system-spec-kit/mcp_server/skill-advisor/SET-UP_GUIDE.md:305-308`; `../../../../../skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:78-78`, `:222-226`; `../../../../../skill/system-spec-kit/mcp_server/skill-advisor/feature_catalog/04--testing/02-health-check.md:18-18`]
- [x] Completion marker: `TASK_T02_DONE`

## T03 — P1-017-01 (D3): finalizePrompt unreachable from docs
- [x] Read `../../009-hook-daemon-parity/001-skill-advisor-hook-surface/../../009-hook-daemon-parity/001-skill-advisor-hook-surface/review/iterations/iteration-017.md`
- [x] Update `../../../../../skill/system-spec-kit/scripts/observability/LIVE_SESSION_WRAPPER_SETUP.md` + any related setup docs to document per-prompt `finalizePrompt()` invocation in operator flow [Evidence: `../../../../../skill/system-spec-kit/scripts/observability/LIVE_SESSION_WRAPPER_SETUP.md:48-169`; `../../../../../skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:304-304`]
- [x] Completion marker: `TASK_T03_DONE`

## T04 — P1-018-01 (D4): Bare catch handlers discard root-cause
- [x] Read `../../009-hook-daemon-parity/001-skill-advisor-hook-surface/../../009-hook-daemon-parity/001-skill-advisor-hook-surface/review/iterations/iteration-018.md`
- [x] Replace bare `catch {}` in advisor producer stack with typed error classification preserving root-cause in diagnostics [Evidence: `../../../../../skill/system-spec-kit/mcp_server/lib/skill-advisor/error-diagnostics.ts:5-118`; `../../../../../skill/system-spec-kit/mcp_server/lib/skill-advisor/generation.ts:26-33`, `:79-90`, `:134-154`; `../../../../../skill/system-spec-kit/mcp_server/lib/skill-advisor/freshness.ts:42-48`, `:191-202`, `:298-329`; `../../../../../skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:47-55`, `:360-427`, `:469-479`; `../../../../../skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:163-170`; `../../../../../skill/system-spec-kit/mcp_server/tests/advisor-freshness.vitest.ts:139-150`, `:229-241`; `../../../../../skill/system-spec-kit/mcp_server/tests/advisor-brief-producer.vitest.ts:98-117`, `:162-193`; `../../../../../skill/system-spec-kit/mcp_server/tests/claude-user-prompt-submit-hook.vitest.ts:135-154`]
- [x] Completion marker: `TASK_T04_DONE`

## T05 — P1-019-01 (D5): Plugin cache cross-workspace bleed
- [x] Read `../../009-hook-daemon-parity/001-skill-advisor-hook-surface/../../009-hook-daemon-parity/001-skill-advisor-hook-surface/review/iterations/iteration-019.md`
- [x] Add workspace root to plugin host cache key in `.opencode/plugins/spec-kit-skill-advisor.js` [Evidence: `.opencode/plugins/spec-kit-skill-advisor.js:115-134`; `.opencode/plugins/spec-kit-skill-advisor.js:300-345`]
- [x] Completion marker: `TASK_T05_DONE`

## T06 — P1-020-01 (D6): Cross-workspace cache test missing
- [x] Read `../../009-hook-daemon-parity/001-skill-advisor-hook-surface/../../009-hook-daemon-parity/001-skill-advisor-hook-surface/review/iterations/iteration-020.md`
- [x] Add test in `mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts` exercising T05 fix [Evidence: `../../../../../skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:276-304`]
- [x] Completion marker: `TASK_T06_DONE`

## T07 — P1-021-01 (D7): Split-doc package claim vs reality
- [x] Read `../../009-hook-daemon-parity/001-skill-advisor-hook-surface/../../009-hook-daemon-parity/001-skill-advisor-hook-surface/review/iterations/iteration-021.md`
- [x] Reconcile `../../../../../skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/manual_testing_playbook.md`: either create split-doc files OR update text to reflect inline structure [Evidence: `../../../../../skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:10-28`, `:56-58`, `:117-123`, `:278-313`, `:373-384`]
- [x] Completion marker: `TASK_T07_DONE`

## T08 — P1-028-01 (D7): Non-runnable bare-path commands
- [x] Read `../../009-hook-daemon-parity/001-skill-advisor-hook-surface/../../009-hook-daemon-parity/001-skill-advisor-hook-surface/review/iterations/iteration-028.md`
- [x] Replace bare-path commands in playbook measurement + analyzer scenarios with `npm --prefix` or explicit `cd` commands [Evidence: `../../../../../skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:298-299`; `../../../../../skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:310-313`]
- [x] Completion marker: `TASK_T08_DONE`

## T09 — P2-007-01 (D7): LT-001 bare filename reference
- [x] Read `../../009-hook-daemon-parity/001-skill-advisor-hook-surface/../../009-hook-daemon-parity/001-skill-advisor-hook-surface/review/iterations/iteration-007.md`
- [x] Replace bare `../../../../../skill/system-spec-kit/scripts/observability/LIVE_SESSION_WRAPPER_SETUP.md` in LT-001 with repo-relative Markdown link [Evidence: `../../../../../skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:310`]
- [x] Completion marker: `TASK_T09_DONE`

## T10 — P2-013-01 (D6): Default telemetry fallback untested
- [x] Read `../../009-hook-daemon-parity/001-skill-advisor-hook-surface/../../009-hook-daemon-parity/001-skill-advisor-hook-surface/review/iterations/iteration-013.md`
- [x] Add test covering default telemetry fallback path [Evidence: `../../../../../skill/system-spec-kit/mcp_server/tests/smart-router-telemetry.vitest.ts:274-293`]
- [x] Completion marker: `TASK_T10_DONE`

## T11 — P2-013-02 (D6): Subprocess spawn-error classification untested
- [x] Read `../../009-hook-daemon-parity/001-skill-advisor-hook-surface/../../009-hook-daemon-parity/001-skill-advisor-hook-surface/review/iterations/iteration-013.md`
- [x] Add test covering subprocess spawn-error classification branch [Evidence: `../../../../../skill/system-spec-kit/mcp_server/tests/advisor-subprocess.vitest.ts:197-230`]
- [x] Completion marker: `TASK_T11_DONE`

## T12 — P2-029-01 (D1): sourceRefs skip sanitizer
- [x] Read `../../009-hook-daemon-parity/001-skill-advisor-hook-surface/../../009-hook-daemon-parity/001-skill-advisor-hook-surface/review/iterations/iteration-029.md`
- [x] Apply single-line sanitizer to `provenance.sourceRefs` (same sanitizer as `metadata.skillLabel`) [Evidence: `../../../../../skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:555-587`; `../../../../../skill/system-spec-kit/mcp_server/tests/shared-payload-advisor.vitest.ts:113-132`]
- [x] Completion marker: `TASK_T12_DONE`

## T13 — Verification
- [ ] TS build passes: `npm --prefix ../../../../../skill/system-spec-kit/mcp_server run build`
- [ ] Focused test suite passes (8 baseline files + T06/T10/T11 new tests)
- [ ] Implementation-summary.md populated with per-finding evidence
- [ ] Checklist.md marked [x]

## T14 — Commit + Push
- [ ] Single commit with all 12 fixes
- [ ] Push to origin/main
