---
SPECKIT_TEMPLATE_SOURCE: "plan-core | v2.2"
title: "027/004 — Plan"
description: "Phased implementation plan for MCP advisor tool surface."
trigger_phrases:
  - "027/004 plan"
  - "mcp advisor surface plan"
  - "advisor tool implementation"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/005-mcp-advisor-surface"
    last_updated_at: "2026-04-20T18:50:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented MCP advisor surface"
    next_safe_action: "Commit in-scope files without pushing"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/"
      - ".opencode/skill/system-spec-kit/mcp_server/skill-advisor/tools/"
    session_dedup:
      fingerprint: "sha256:027004mcpadvisorsurface00000000000000000000000000000000000000"
      session_id: "027-004-implementation-r01"
      parent_session_id: "027-004-scaffold-r01"
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Plan: 027/004

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: level_2/plan.md | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

Expose the native skill advisor through three MCP tools in the existing system-spec-kit server: `advisor_recommend`, `advisor_status`, and `advisor_validate`. The implementation consumes 027/001 freshness/generation, 027/002 lifecycle redirect metadata, and 027/003 scorer output without modifying predecessor `lib/` code.

### Technical Context

- Runtime: TypeScript MCP server under `.opencode/skill/system-spec-kit/mcp_server`.
- Validation: Zod schemas, Vitest handler tests, `npm run typecheck`, and `npm run build`.
- Dependencies: existing scorer, freshness, trust-state, prompt-cache, and dispatcher modules.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- Strict Zod input and output schemas for all three tools.
- Prompt privacy: no raw prompt content in status, validate, diagnostics, or cache keys.
- Cache/freshness: HMAC prompt cache with source-signature invalidation.
- Tests: handler happy/error/abstain/cache/stale/disabled paths plus schema rejection.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- Schema layer: `mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts`.
- Handler layer: `mcp_server/skill-advisor/handlers/advisor-*.ts`.
- Tool descriptor layer: `mcp_server/skill-advisor/tools/advisor-*.ts`.
- Dispatcher layer: existing `mcp_server/tools/index.ts` plus public `tool-schemas.ts`.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:implementation-phases -->
## 4. IMPLEMENTATION PHASES

## Phase 1: Advisor Surface Implementation

1. Contract reading: spec, checklist, research Track D D3/D5/D6, predecessor scorer/freshness/lifecycle APIs.
2. Schemas: strict advisor input/output Zod contracts.
3. Handlers: recommend/status/validate logic and prompt-safe envelopes.
4. Tool definitions: MCP introspection descriptors and dispatcher registration.

## Phase 2: Advisor Surface Verification

5. Tests: handler coverage and dispatcher smoke.
6. Verification: focused vitest, typecheck, build, and spec validation.
<!-- /ANCHOR:implementation-phases -->

<!-- ANCHOR:testing-strategy -->
## 5. TESTING STRATEGY

- `advisor_recommend`: happy, ambiguous, redirect, UNKNOWN fallback, disabled, cache hit, stale, strict input, dispatcher.
- `advisor_status`: live, stale, absent, unavailable, privacy.
- `advisor_validate`: slice bundle schema, privacy, strict input.
- Regression command: advisor/freshness vitest suite.
<!-- /ANCHOR:testing-strategy -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- 027/001: `lib/freshness/generation.ts` and `lib/freshness/trust-state.ts`.
- 027/002: lifecycle redirect metadata consumed through scorer recommendation fields.
- 027/003: `scoreAdvisorPrompt()` and scorer validation corpus.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback-plan -->
## 7. ROLLBACK PLAN

Remove the `advisorTools` dispatcher entry and the three public tool definitions, then delete the new `skill-advisor/tools/`, `skill-advisor/handlers/`, `advisor-tool-schemas.ts`, and handler tests. No database migration is introduced by this phase.
<!-- /ANCHOR:rollback-plan -->
