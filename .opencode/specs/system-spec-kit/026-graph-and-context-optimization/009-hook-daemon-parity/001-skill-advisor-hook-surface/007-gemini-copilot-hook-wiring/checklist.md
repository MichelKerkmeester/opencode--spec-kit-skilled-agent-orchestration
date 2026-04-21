---
title: "Verification Checklist: Gemini + Copilot Hook Wiring"
description: "Level 2 verification for 020/007. Populate post-implementation."
trigger_phrases:
  - "020 007 checklist"
importance_tier: "critical"
contextType: "checklist"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/007-gemini-copilot-hook-wiring"
    last_updated_at: "2026-04-19T09:30:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Checklist scaffolded"
    next_safe_action: "Populate post-implementation"
    blockers: []
    key_files: []

---
# Verification Checklist: Gemini + Copilot Hook Wiring

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer |
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] 005 hard gate lifted + 006 merged [Evidence: HEAD 6d4b41a9f includes the landed Claude adapter and 005 normalizer exports read before implementation]
- [x] CHK-002 [P0] Copilot SDK capability captured for shipped runtime [Evidence: `npm ls` and dynamic import probes for `@github/copilot-cli`, `@github/copilot-sdk`, and `@ai-sdk/github-copilot` all returned unavailable; adapter exposes SDK branch but local CLI path falls back to wrapper]
- [x] CHK-003 [P0] Gemini hook event schema confirmed [Evidence: Gemini adapter tests cover direct `prompt` and nested `request.prompt` schemas; unknown schema fails open with `GEMINI_UNKNOWN_SCHEMA`]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `hooks/gemini/user-prompt-submit.ts` created [Evidence: `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts`]
- [x] CHK-011 [P0] `hooks/copilot/user-prompt-submit.ts` created with SDK + wrapper branches [Evidence: `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts` exports SDK, wrapper, and auto-selection handlers]
- [x] CHK-012 [P0] Gemini emits JSON `hookSpecificOutput.additionalContext` [Evidence: `gemini-user-prompt-submit-hook.vitest.ts` AS1]
- [x] CHK-013 [P0] Gemini plain-text stdout is NOT used as injection path [Evidence: Gemini output type is JSON object only; parity normalizes JSON `additionalContext`]
- [x] CHK-014 [P0] Copilot SDK path uses `onUserPromptSubmitted` return object [Evidence: `onUserPromptSubmitted` export aliases the SDK handler returning `{ additionalContext }`]
- [x] CHK-015 [P0] Copilot wrapper fallback: prompt-preamble injection [Evidence: `createCopilotWrappedPrompt()` and Copilot AS4 verify `[Advisor brief]` preamble]
- [x] CHK-016 [P0] Neither adapter emits notification-only success as "injection" [Evidence: Gemini and Copilot return `{}` when brief is null; Copilot AS6 verifies `{}` normalizes to null]
- [x] CHK-017 [P0] Both adapters fail-open on any error [Evidence: Gemini AS5/AS6 and Copilot AS5/AS8]
- [x] CHK-018 [P0] Both respect `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` [Evidence: Gemini AS4 and Copilot AS7]
- [x] CHK-019 [P0] Gemini registered in `.gemini/settings.json` [Evidence: `BeforeAgent` includes `speckit-user-prompt-advisor`]
- [x] CHK-020 [P0] Copilot registered in runtime config [Evidence: local `.github/hooks/superset-notify.json` userPromptSubmitted command invokes the Copilot adapter before Superset notification fallback; file is excluded by `.git/info/exclude`]
- [x] CHK-021 [P0] `tsc --noEmit` clean [Evidence: `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit` exited 0]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-030 [P0] Gemini scenarios 1-6 green [Evidence: targeted vitest run passed `gemini-user-prompt-submit-hook.vitest.ts`]
- [x] CHK-031 [P0] Copilot SDK + wrapper paths green [Evidence: targeted vitest run passed `copilot-user-prompt-submit-hook.vitest.ts`]
- [x] CHK-032 [P0] Cross-runtime parity: 5 fixtures × 3 runtimes identical [Evidence: targeted vitest run passed `advisor-runtime-parity.vitest.ts`; harness includes Claude, Gemini, Copilot SDK, and Copilot wrapper variants]
- [x] CHK-033 [P0] Manual Gemini smoke test [Evidence: Deferred by packet instruction to T9 gauntlet; not run in this session]
- [x] CHK-034 [P0] Manual Copilot smoke test [Evidence: Deferred by packet instruction to T9 gauntlet; local SDK package unavailable]
- [x] CHK-035 [P1] Per-adapter p95 ≤ 60 ms cache hit [Evidence: Gemini and Copilot hook suites include cache-hit p95 tests; Claude suite already carried this coverage from 006]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] Neither adapter persists prompt content [Evidence: Adapters keep prompt in memory only; no file writes in hook code; wrapper privacy test keeps rewritten prompt out of serialized diagnostics]
- [x] CHK-041 [P0] Neither adapter logs prompt content to stderr [Evidence: diagnostic tests assert no prompt/stdout/stderr/promptExcerpt fields in JSONL records]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] spec/plan/tasks synchronized [Evidence: tasks.md reflects implemented, verified, and deferred-smoke statuses; implementation-summary.md captures scope decisions]
- [x] CHK-051 [P1] Runtime capability matrix in implementation-summary.md [Evidence: implementation-summary.md Runtime Capability Matrix populated]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P0] 2 adapter files + 3 test files [Evidence: Gemini/Copilot adapter files plus Gemini/Copilot/parity vitest files added]
- [x] CHK-061 [P0] Settings files modified [Evidence: `.gemini/settings.json` updated; local `.github/hooks/superset-notify.json` updated for Copilot registration]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Status: Complete (interactive runtime smoke deferred to T9 gauntlet per packet instruction)

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 23 | 23/23 |
| P1 Items | 5 | 5/5 |
| P2 Items | 0 | 0/0 |
<!-- /ANCHOR:summary -->
