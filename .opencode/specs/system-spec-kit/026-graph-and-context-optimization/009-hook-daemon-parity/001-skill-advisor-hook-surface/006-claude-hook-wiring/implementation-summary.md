---
title: "Implementation Summary: Claude Hook Wiring"
description: "Claude UserPromptSubmit hook wired to buildSkillAdvisorBrief via JSON hookSpecificOutput.additionalContext with fail-open diagnostics and settings registration."
trigger_phrases:
  - "020 006 summary"
importance_tier: "critical"
contextType: "implementation-summary"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/006-claude-hook-wiring"
    last_updated_at: "2026-04-19T14:04:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Hook implemented and verified"
    next_safe_action: "Dispatch 007 Gemini/Copilot and 008 Codex follow-on adapters"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/tests/claude-user-prompt-submit-hook.vitest.ts"
      - ".claude/settings.local.json"

---
# Implementation Summary: Claude Hook Wiring

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-claude-hook-wiring |
| **Completed** | 2026-04-19 |
| **Level** | 2 |
| **Parent** | `../spec.md` |
| **Predecessors** | `../004-*`, `../005-*` (hard gate lifted by commit 043c3cd43) |
| **Position in train** | 5 of 8 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This packet shipped the Claude `UserPromptSubmit` runtime adapter for the skill-advisor brief. The hook reads Claude JSON from stdin, delegates to `buildSkillAdvisorBrief(prompt, { runtime: 'claude', workspaceRoot })`, renders with `renderAdvisorBrief(result)`, and emits model-visible JSON through `hookSpecificOutput.additionalContext`.

All no-op and error cases fail open to `{}` on stdout with exit code 0. Diagnostics are written as structured JSONL records through the 005 metrics contract and exclude prompt-bearing fields.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts` | Created | Claude `UserPromptSubmit` hook entrypoint, parser, fail-open handler, JSON output serializer, and diagnostic JSONL emitter |
| `.opencode/skill/system-spec-kit/mcp_server/tests/claude-user-prompt-submit-hook.vitest.ts` | Created | 6 required acceptance scenarios, Python-missing fail-open, cache-hit p95 adapter check, and 005 normalizer parity |
| `.claude/settings.local.json` | Updated | Added `hooks.UserPromptSubmit` command pointing at `dist/hooks/claude/user-prompt-submit.js` |
| `spec.md` | Updated | Marked 005 blocker lifted and packet implemented |
| `plan.md` | Updated | Checked off execution phases and predecessor readiness |
| `tasks.md` | Updated | Marked T001-T019 complete with evidence |
| `checklist.md` | Updated | Marked 20/20 P0 and 5/5 P1 checks complete |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implementation stayed inside the child packet scope and reused predecessor runtime surfaces:

- Producer: `buildSkillAdvisorBrief(prompt, { runtime: 'claude', workspaceRoot })`
- Renderer: `renderAdvisorBrief(result)`
- Observability: `createAdvisorHookDiagnosticRecord()` and `serializeAdvisorHookDiagnosticRecord()`
- Transport: Claude JSON `hookSpecificOutput.additionalContext`

The adapter exports `handleClaudeUserPromptSubmit()` so tests can exercise the hook without an interactive Claude session. The CLI entrypoint still reads stdin and writes JSON stdout for the real Claude hook path.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

1. **Fail-open means JSON `{}` on stdout.** The mission text required an empty JSON object for skipped, disabled, parse-failed, and fail-open cases, so the hook emits `{}` rather than plain empty stdout.
2. **Diagnostics are default-on and schema-only.** Every invocation attempts one JSONL diagnostic record on stderr, but the diagnostic writer is fail-open and cannot affect hook output.
3. **Interactive Claude smoke is deferred.** Per mission, real Claude session validation is deferred to the T9 integration gauntlet; this packet performed a direct built-hook CLI smoke with simulated stdin.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Command / Evidence | Result |
|-------|--------------------|--------|
| Hook acceptance suite | `npm exec --workspace=@spec-kit/mcp-server -- vitest run mcp_server/tests/claude-user-prompt-submit-hook.vitest.ts` | PASS - 9 tests |
| TypeScript no-emit | `npx tsc --noEmit --composite false -p tsconfig.json` from `mcp_server/` | PASS |
| Build for dist hook | `npm run --workspace=@spec-kit/mcp-server build` | PASS |
| Settings registered | `jq -r '.hooks.UserPromptSubmit[0].hooks[0].command' .claude/settings.local.json` | YES |
| Direct CLI smoke | `node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/user-prompt-submit.js` with simulated Claude stdin | PASS - exit 0, diagnostic JSONL on stderr, `{}` on stdout |
| Real Claude smoke | Interactive Claude session | DEFERRED to T9 integration gauntlet per mission |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

The direct CLI smoke returned `{}` because the live repo advisor freshness was stale and produced a skipped result (`SOURCE_NEWER_THAN_SKILL_GRAPH`). That is an acceptable fail-open/no-op smoke for this packet; model-visible `additionalContext` is covered by the focused Vitest fixture using the 005 renderer.

Follow-on packets own cross-runtime runtime capture:

- `007-gemini-copilot-hook-wiring`
- `008-codex-integration-and-hook-policy`
- T9 integration gauntlet for an interactive Claude session
<!-- /ANCHOR:limitations -->
