---
SPECKIT_TEMPLATE_SOURCE: "checklist | v2.2"
title: "027/004 — Checklist"
description: "Acceptance verification for MCP advisor surface."
trigger_phrases:
  - "027/004 checklist"
  - "advisor mcp verification"
  - "advisor tool acceptance"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/005-mcp-advisor-surface"
    last_updated_at: "2026-04-20T22:15:00Z"
    last_updated_by: "codex"
    recent_action: "Replaced vague checklist evidence with file:line citations after post-review remediation"
    next_safe_action: "Use remediation-report.md for closure evidence"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/"
    session_dedup:
      fingerprint: "sha256:027004checklistevidence00000000000000000000000000000000000000"
      session_id: "027-004-implementation-r01"
      parent_session_id: "027-004-scaffold-r01"
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Verification Checklist: 027/004 MCP Advisor Surface

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: level_2/checklist.md | v2.2 -->

<!-- ANCHOR:verification-protocol -->
## Verification Protocol

- Baseline: requested command passed 49 tests before edits.
- Implementation regression: package-local advisor suite passed 93 tests after code remediation and 167 tests after legacy advisor-test consolidation.
- Build gates: `npm run typecheck` and `npm run build` exited 0.
- Caveat: targeted `context-server.vitest.ts` has one source-text assertion failure outside the allowed write scope.
<!-- /ANCHOR:verification-protocol -->

<!-- ANCHOR:pre-implementation -->
## Pre-Implementation

- [x] [P0] Read spec, plan, tasks, and checklist [evidence: task execution log].
- [x] [P0] Read Track D D3/D5/D6 research [evidence: implementation summary].
- [x] [P0] Read scorer, freshness, lifecycle, and dispatcher surfaces [evidence: implementation summary].
<!-- /ANCHOR:pre-implementation -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] [P0] `advisor_recommend` tool exposed with Zod schemas [evidence: `advisor-tool-schemas.ts:24`, `advisor-tool-schemas.ts:46`, `advisor-recommend.ts:191`].
- [x] [P0] `advisor_status` tool exposed with Zod schemas [evidence: `advisor-tool-schemas.ts:66`, `advisor-tool-schemas.ts:70`, `advisor-status.ts:60`].
- [x] [P0] `advisor_validate` tool exposed with Zod schemas [evidence: `advisor-tool-schemas.ts:88`, `advisor-tool-schemas.ts:102`, `advisor-validate.ts:53`].
- [x] [P0] All 3 tools registered in existing system-spec-kit MCP dispatcher [evidence: `advisor-recommend.vitest.ts:273` dispatcher smoke].
- [x] [P1] Handlers live under `mcp_server/skill-advisor/handlers/` [evidence: `advisor-recommend.ts:191`, `advisor-status.ts:120`, `advisor-validate.ts:1`].
- [x] [P1] Tools live under `mcp_server/skill-advisor/tools/` [evidence: `advisor-tool-schemas.ts:165` schema registry and tool descriptor files].
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] [P0] Handler tests per tool passed [evidence: `advisor-recommend.vitest.ts:93`, `advisor-status.vitest.ts:32`, `advisor-validate.vitest.ts`].
- [x] [P1] Cache hit and stale freshness paths passed [evidence: `advisor-recommend.vitest.ts:245`, `advisor-recommend.vitest.ts:256`].
- [x] [P1] Live/stale/absent/unavailable status paths passed [evidence: `advisor-status.vitest.ts:33`, `advisor-status.vitest.ts:47`, `advisor-status.vitest.ts:58`, `advisor-status.vitest.ts:67`].
- [x] [P1] Validate slice bundle schema passed [evidence: `advisor-validate.ts:116`, `advisor-validate.ts:191`, `advisor-validate.ts:269`].
- [x] [P0] Requested regression suite passed [evidence: `vitest run mcp_server/skill-advisor/tests/ --reporter=default` 167/167 after consolidation].
- [x] [P0] Typecheck and build passed [evidence: both exit 0].
<!-- /ANCHOR:testing -->

<!-- ANCHOR:security -->
## Security

- [x] [P0] Cache reuses HMAC prompt cache with source-signature invalidation [evidence: `advisor-recommend.ts:136`, `advisor-recommend.ts:138`, `advisor-recommend.ts:181`].
- [x] [P0] No raw prompts in diagnostics, cache keys, status, or validate output [evidence: `advisor-recommend.vitest.ts:117`, `advisor-status.vitest.ts:77`, `advisor-validate.ts:53` aggregate-only corpus loading].
- [x] [P1] Strict schemas reject unknown prompt leakage knobs [evidence: `advisor-tool-schemas.ts:24`, `advisor-recommend.vitest.ts:266`].
- [x] [P1] Prompt-safe sanitizer wraps recommendations, redirect metadata, and status [evidence: `advisor-recommend.ts:92`, `advisor-recommend.ts:98`, `advisor-recommend.vitest.ts:174`].
- [x] [P1] `includeAttribution` strips prompt-derived evidence and returns lane metadata only [evidence: `advisor-recommend.ts:115`, `advisor-recommend.vitest.ts:94`].
<!-- /ANCHOR:security -->

<!-- ANCHOR:documentation -->
## Documentation

- [x] [P1] Tool surface table populated [evidence: `implementation-summary.md` §3].
- [x] [P1] Handler integration map populated [evidence: `implementation-summary.md` §5].
- [x] [P1] Test counts and privacy evidence recorded [evidence: `implementation-summary.md` §7-§8].
<!-- /ANCHOR:documentation -->

<!-- ANCHOR:file-organization -->
## File Organization

- [x] [P1] New advisor files are self-contained under `mcp_server/skill-advisor/` [evidence: `compat/index.ts:5`, migrated tests under `skill-advisor/tests/legacy/advisor-*.vitest.ts`].
- [x] [P0] Existing `mcp_server/skill-advisor/lib/` was not modified [evidence: `git diff --stat` and scoped status].
- [x] [P1] No new MCP server registration was added [evidence: existing dispatcher arrays updated only].
<!-- /ANCHOR:file-organization -->

<!-- ANCHOR:verification-summary -->
## Verification Summary

P0/P1 acceptance is met. The broad context-server smoke command exposed one existing source-text assertion unrelated to the advisor dispatcher behavior and outside the allowed write scope, so the "full vitest suite green" checklist item is intentionally not claimed.
<!-- /ANCHOR:verification-summary -->
