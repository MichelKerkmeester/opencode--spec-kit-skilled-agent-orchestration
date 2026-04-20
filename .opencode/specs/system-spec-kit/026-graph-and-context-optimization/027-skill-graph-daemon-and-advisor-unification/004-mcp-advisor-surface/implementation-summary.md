---
SPECKIT_TEMPLATE_SOURCE: "impl-summary-core | v2.2"
title: "027/004 — Implementation Summary"
description: "Implementation summary for the MCP advisor surface."
trigger_phrases:
  - "027/004 implementation summary"
  - "advisor_recommend implementation"
  - "mcp advisor surface complete"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/004-mcp-advisor-surface"
    last_updated_at: "2026-04-20T22:15:00Z"
    last_updated_by: "codex"
    recent_action: "Remediated prompt-safe advisor output, absent-freshness fail-open semantics, and status envelope fields"
    next_safe_action: "Use remediation-report.md for review closure evidence"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-status.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/tools/index.ts"
    session_dedup:
      fingerprint: "sha256:027004implementationsummary0000000000000000000000000000000000"
      session_id: "027-004-implementation-r01"
      parent_session_id: "027-004-scaffold-r01"
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Use existing MCP dispatcher, not a new server."
      - "Use existing HMAC prompt cache and freshness generation/trust-state primitives."
---
# Implementation Summary: 027/004

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: level_2/implementation-summary.md | v2.2 -->

<!-- ANCHOR:status -->
## 1. STATUS

Implemented. P0 and P1 scope is complete inside the allowed MCP advisor surface. P2 trace and partial validation limit options remain deferred.
<!-- /ANCHOR:status -->

<!-- ANCHOR:completion-impact -->
## 2. COMPLETION IMPACT

The system-spec-kit MCP server now has an additive native advisor surface with `advisor_recommend`, `advisor_status`, and `advisor_validate`. The tools are registered through the existing dispatcher and public tool definition list, so no new MCP server registration is introduced.
<!-- /ANCHOR:completion-impact -->

<!-- ANCHOR:tool-surface -->
## 3. TOOL SURFACE TABLE

| Tool | Input | Output | Handler |
| --- | --- | --- | --- |
| `advisor_recommend` | `{ prompt, options?: { topK, includeAttribution, includeAbstainReasons, confidenceThreshold, uncertaintyThreshold } }` | Prompt-safe recommendations, ambiguity, freshness, trust state, cache, warnings, abstain reasons | `skill-advisor/handlers/advisor-recommend.ts` |
| `advisor_status` | `{ workspaceRoot }` | Freshness, generation, trust state, generation bump, last scan time, skill count, lane weights, daemon PID/errors | `skill-advisor/handlers/advisor-status.ts` |
| `advisor_validate` | `{ skillSlug?: string \| null }` | Measured corpus, holdout, parity, safety, and latency slices plus per-skill status | `skill-advisor/handlers/advisor-validate.ts` |
<!-- /ANCHOR:tool-surface -->

<!-- ANCHOR:schema-excerpts -->
## 4. ZOD SCHEMA EXCERPTS

- `AdvisorRecommendInputSchema` is strict and accepts only `prompt` plus nested strict `options`.
- `AdvisorStatusInputSchema` is strict and requires `workspaceRoot`.
- `AdvisorValidateInputSchema` is strict and accepts optional nullable `skillSlug`.
- Output schemas validate sanitized lane attribution metadata, freshness enums, trust state, status metadata, and validate-slice bundles before handlers return.
<!-- /ANCHOR:schema-excerpts -->

<!-- ANCHOR:handler-integration-map -->
## 5. HANDLER INTEGRATION MAP

| Handler | Reused module | Purpose |
| --- | --- | --- |
| `advisor-recommend.ts` | `lib/scorer/fusion.ts` | Calls `scoreAdvisorPrompt()` for normalized scorer output. |
| `advisor-recommend.ts` | `lib/prompt-cache.ts` | Reuses HMAC prompt cache with source-signature invalidation. |
| `advisor-recommend.ts` | `lib/render.ts` | Sanitizes recommendation skill labels, redirect metadata, and lifecycle status before public output. |
| `advisor-status.ts` | `lib/freshness/generation.ts` | Reads skill graph generation metadata. |
| `advisor-status.ts` | `lib/freshness/trust-state.ts` | Produces live/stale/absent/unavailable trust states. |
| `advisor-validate.ts` | `lib/scorer/fusion.ts` | Runs prompt corpus scoring for validation slices. |
| `advisor-validate.ts` | `lib/scorer/projection.ts` | Uses fixture projections for ambiguity, derived attribution, and safety checks. |
<!-- /ANCHOR:handler-integration-map -->

<!-- ANCHOR:files-changed -->
## 6. FILES CHANGED

- Added `mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts`.
- Added `mcp_server/skill-advisor/tools/advisor-{recommend,status,validate}.ts` and index export.
- Added `mcp_server/skill-advisor/handlers/advisor-{recommend,status,validate}.ts` and index export.
- Added handler tests under `mcp_server/skill-advisor/tests/handlers/`.
- Updated `mcp_server/tools/index.ts`, `mcp_server/schemas/tool-input-schemas.ts`, and `mcp_server/tool-schemas.ts` for dispatcher and schema registration.
<!-- /ANCHOR:files-changed -->

<!-- ANCHOR:verification -->
## 7. VERIFICATION

- Baseline before edits: requested suite passed 49 tests.
- New handler suite: `vitest run mcp_server/skill-advisor/tests/handlers/` passed 17 tests.
- Post-review package suite: `vitest run mcp_server/skill-advisor/tests/ --reporter=default` passed 93 tests before legacy-test consolidation and 167 tests after moving advisor legacy tests package-local.
- `npm run typecheck` exited 0.
- `npm run build` exited 0.
- Registry/schema smoke caveat: targeted run including `context-server.vitest.ts` passed 505 tests and failed one source-text assertion outside the allowed 027/004 write scope.
<!-- /ANCHOR:verification -->

<!-- ANCHOR:privacy -->
## 8. PRIVACY CONFORMANCE

`advisor_recommend` uses the existing HMAC prompt cache key and never returns raw prompt text. Public recommendations sanitize `skillId`, `redirectFrom`, `redirectTo`, and lifecycle `status`; `includeAttribution` returns only lane contribution metadata and strips prompt-derived evidence (`advisor-recommend.ts:92`, `advisor-recommend.ts:98`, `advisor-recommend.ts:115`). Handler tests assert prompt text, PII-shaped content, unsafe labels, and prompt-derived evidence do not appear in recommend/status/validate outputs (`advisor-recommend.vitest.ts:94`, `advisor-recommend.vitest.ts:117`, `advisor-recommend.vitest.ts:174`, `advisor-status.vitest.ts:77`). `advisor_validate` returns aggregate corpus metrics only and omits raw prompts.
<!-- /ANCHOR:privacy -->

<!-- ANCHOR:follow-ups -->
## 9. FOLLOW-UPS

- P2 `trace: true` debug attribution remains deferred.
- P2 partial corpus validation limit remains deferred.
- Existing `context-server.vitest.ts` source-text assertion should be repaired in a separate scope.
<!-- /ANCHOR:follow-ups -->
