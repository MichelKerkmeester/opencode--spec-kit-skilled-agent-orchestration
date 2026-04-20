---
title: "Phase 026 — Tasks"
description: "12 per-finding remediation tasks, sequential cli-copilot dispatch."
importance_tier: "normal"
contextType: "implementation"
---

# Phase 026 Tasks

## T01 — P1-007-01 (D7): Hook reference config drift
- [ ] Read `../020-skill-advisor-hook-surface/review/iterations/iteration-007.md`
- [ ] Update `references/hooks/skill-advisor-hook.md` Copilot + Codex snippets to byte-match `.github/hooks/superset-notify.json` + `.codex/settings.json` + `.codex/policy.json`, OR label as illustrative with repo-relative links
- [ ] Completion marker: `TASK_T01_DONE`

## T02 — P1-014-01 (D7): Stale inventory/status values
- [ ] Read `../020-skill-advisor-hook-surface/review/iterations/iteration-014.md`
- [ ] Replace hardcoded values with dynamic references OR add explicit snapshot annotation
- [ ] Completion marker: `TASK_T02_DONE`

## T03 — P1-017-01 (D3): finalizePrompt unreachable from docs
- [ ] Read `../020-skill-advisor-hook-surface/review/iterations/iteration-017.md`
- [ ] Update `LIVE_SESSION_WRAPPER_SETUP.md` + any related setup docs to document per-prompt `finalizePrompt()` invocation in operator flow
- [ ] Completion marker: `TASK_T03_DONE`

## T04 — P1-018-01 (D4): Bare catch handlers discard root-cause
- [ ] Read `../020-skill-advisor-hook-surface/review/iterations/iteration-018.md`
- [ ] Replace bare `catch {}` in advisor producer stack with typed error classification preserving root-cause in diagnostics
- [ ] Completion marker: `TASK_T04_DONE`

## T05 — P1-019-01 (D5): Plugin cache cross-workspace bleed
- [ ] Read `../020-skill-advisor-hook-surface/review/iterations/iteration-019.md`
- [ ] Add workspace root to plugin host cache key in `.opencode/plugins/spec-kit-skill-advisor.js`
- [ ] Completion marker: `TASK_T05_DONE`

## T06 — P1-020-01 (D6): Cross-workspace cache test missing
- [ ] Read `../020-skill-advisor-hook-surface/review/iterations/iteration-020.md`
- [ ] Add test in `mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts` exercising T05 fix
- [ ] Completion marker: `TASK_T06_DONE`

## T07 — P1-021-01 (D7): Split-doc package claim vs reality
- [ ] Read `../020-skill-advisor-hook-surface/review/iterations/iteration-021.md`
- [ ] Reconcile `manual_testing_playbook.md`: either create split-doc files OR update text to reflect inline structure
- [ ] Completion marker: `TASK_T07_DONE`

## T08 — P1-028-01 (D7): Non-runnable bare-path commands
- [ ] Read `../020-skill-advisor-hook-surface/review/iterations/iteration-028.md`
- [ ] Replace bare-path commands in playbook measurement + analyzer scenarios with `npm --prefix` or explicit `cd` commands
- [ ] Completion marker: `TASK_T08_DONE`

## T09 — P2-007-01 (D7): LT-001 bare filename reference
- [ ] Read `../020-skill-advisor-hook-surface/review/iterations/iteration-007.md`
- [ ] Replace bare `LIVE_SESSION_WRAPPER_SETUP.md` in LT-001 with repo-relative Markdown link
- [ ] Completion marker: `TASK_T09_DONE`

## T10 — P2-013-01 (D6): Default telemetry fallback untested
- [ ] Read `../020-skill-advisor-hook-surface/review/iterations/iteration-013.md`
- [ ] Add test covering default telemetry fallback path
- [ ] Completion marker: `TASK_T10_DONE`

## T11 — P2-013-02 (D6): Subprocess spawn-error classification untested
- [ ] Read `../020-skill-advisor-hook-surface/review/iterations/iteration-013.md`
- [ ] Add test covering subprocess spawn-error classification branch
- [ ] Completion marker: `TASK_T11_DONE`

## T12 — P2-029-01 (D1): sourceRefs skip sanitizer
- [ ] Read `../020-skill-advisor-hook-surface/review/iterations/iteration-029.md`
- [ ] Apply single-line sanitizer to `provenance.sourceRefs` (same sanitizer as `metadata.skillLabel`)
- [ ] Completion marker: `TASK_T12_DONE`

## T13 — Verification
- [ ] TS build passes: `npm --prefix .opencode/skill/system-spec-kit/mcp_server run build`
- [ ] Focused test suite passes (8 baseline files + T06/T10/T11 new tests)
- [ ] Implementation-summary.md populated with per-finding evidence
- [ ] Checklist.md marked [x]

## T14 — Commit + Push
- [ ] Single commit with all 12 fixes
- [ ] Push to origin/main
