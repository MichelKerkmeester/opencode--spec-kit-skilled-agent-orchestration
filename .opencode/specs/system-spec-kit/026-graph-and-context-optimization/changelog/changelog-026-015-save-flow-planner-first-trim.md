---
title: "Changelog: Save Flow Planner-First Trim [026-graph-and-context-optimization/015-save-flow-planner-first-trim]"
description: "Chronological changelog for the Save Flow Planner-First Trim phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-15

> Spec folder: `specs/system-spec-kit/026-graph-and-context-optimization/015-save-flow-planner-first-trim` (Level 3)
> Parent packet: `specs/system-spec-kit/026-graph-and-context-optimization`

### Summary

Packet 015 changed /memory:save so canonical saves default to planner-first output. The shared planner schema now carries route, target, blocker, continuity, and follow-up information across the handler, CLI wrapper, and command docs while the explicit full-auto path still points at the canonical atomic writer.

### Added

- Add planner response interfaces and follow-up action types to .opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts. Dependencies: T001. Milestone: M1. Evidence: added planner route target, proposed edit, blocker, advisory, follow-up action, and planner envelope types plus plannerMode save args.
- Add planner-response serialization helpers to .opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts. Dependencies: T003. Milestone: M1. Evidence: added planner serializers plus buildPlannerResponse() for MCP planner payloads and hints.
- [P] Add planner blocker and advisory-warning response helpers to .opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts. Dependencies: T003. Milestone: M1. Evidence: added buildPlannerBlocker() and buildPlannerAdvisory() helpers used by planner-mode save responses.
- [P] Update .opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts to verify non-mutating default responses and hard-blocker reporting. Dependencies: T008. Milestone: M1. Evidence: added planner-default non-mutating and blocker tests, and pinned fallback mutation-path assertions to explicit plannerMode: "full-auto".
- Create .opencode/skill/system-spec-kit/mcp_server/tests/memory-save-planner-first.vitest.ts with focused schema and follow-up-action coverage. Dependencies: T008. Milestone: M1. Evidence: new focused suite covers planner response schema, blocker payloads, and follow-up action serialization.
- Trim default Tier 3 participation in .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts while preserving the eight-category contract. Dependencies: T008. Milestone: M2. Evidence: default router path now refuses uncertain chunks with Router uncertain for [chunk]; operator should specify routeAs, while tier3Enabled remains opt-in via SPECKIT_ROUTER_TIER3_ENABLED and plannerMode: "full-auto" still preserves legacy Tier 3 fallback.

### Changed

- Make .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts request planner-first behavior by default and expose explicit fallback mode. Dependencies: T003, T004. Milestone: M1. Evidence: CLI now defaults to plannerMode: "plan-only" and parses --planner-mode / --full-auto, verified in scripts/tests/generate-context-cli-authority.vitest.ts.
- [P] Update .opencode/command/memory/save.md to describe planner-first default behavior, fallback mode, and deferred freshness actions. Dependencies: T002, T006. Milestone: M1. Evidence: command doc now explains planner-first default, explicit full-auto, and deferred refresh-graph / reindex follow-ups.
- Make .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts return planner output by default while preserving the current canonical atomic path behind explicit fallback. Dependencies: T003, T004, T005, T006. Milestone: M1. Evidence: routed canonical saves now emit planner payloads by default while plannerMode: "full-auto" still drives the existing atomic writer path.
- [P] Update .opencode/skill/system-spec-kit/mcp_server/tests/memory-save.vitest.ts for planner-default behavior and explicit fallback mode. Dependencies: T008. Milestone: M1. Evidence: aggregate memory-save suite now includes memory-save-planner-first.vitest.ts alongside the handler suite.
- [P] Update .opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts so CLI target authority survives planner-default execution. Dependencies: T006, T008. Milestone: M1. Evidence: CLI authority tests now assert default plan-only forwarding and explicit --full-auto override behavior.
- [P] Reduce or re-scope .opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json to the remaining Tier 2 library required after default Tier 3 removal. Dependencies: T013. Milestone: M2. Evidence: reduced the Tier 2 prototype library to four entries per routing category while keeping all eight categories intact.

### Fixed

- Add planner-default and fallback flag definitions to .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts. Dependencies: None. Milestone: M1. Evidence: added SavePlannerMode, resolveSavePlannerMode(), and save-time opt-in gates for reconsolidation, enrichment, and quality auto-fix.
- [P] Document planner-default, fallback, and deferred follow-up flags in .opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md. Dependencies: T001. Milestone: M1. Evidence: documented SPECKIT_SAVE_PLANNER_MODE, SPECKIT_RECONSOLIDATION_ENABLED, SPECKIT_POST_INSERT_ENRICHMENT_ENABLED, and SPECKIT_QUALITY_AUTO_FIX.
- Retire default-path auto-fix retries in .opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts while preserving advisory quality output. Dependencies: T008. Milestone: M3. Evidence: runQualityLoop() now defaults to advisory mode, skips auto-fix retries on the planner path, and only re-enables the legacy retry loop in full-auto mode or when SPECKIT_QUALITY_AUTO_FIX=true.
- [P] Update .opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts to cover advisory-only default behavior and any retained opt-in auto-fix mode. Dependencies: T018. Milestone: M3. Evidence: added advisory-default assertions plus explicit mode: "full-auto" coverage for rejection, retry-count, and successful auto-fix behavior; verified with npx vitest run tests/content-router.vitest.ts tests/quality-loop.vitest.ts tests/save-quality-gate.vitest.ts.
- [P] Update .opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation-bridge.vitest.ts for explicit opt-in reconsolidation behavior. Dependencies: T023. Milestone: M4. Evidence: suite now covers planner-default reconsolidation skip plus full-auto merge, assistive, and BM25 repair behavior; verified with cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/reconsolidation-bridge.vitest.ts tests/chunking-orchestrator.vitest.ts.
- CHK-015 quality-loop.ts no longer performs auto-fix retries on the default path. Evidence: T018 and quality-loop.vitest.ts passed with advisory-default behavior.

### Verification

- Typecheck - PASS
- Targeted planner-first sweep - PASS, 52 tests across memory-save-integration, memory-save-ux-regressions, thin-continuity-record, memory-save-planner-first, content-router, and reconsolidation-bridge
- memory-save-integration.vitest.ts - PASS, planner-default and full-auto fallback keep narrative-progress and metadata-only targets aligned end to end
- memory-save-ux-regressions.vitest.ts - PASS, planner output stayed readable, action-oriented, and blocker-aware
- thin-continuity-record.vitest.ts - PASS, continuity normalization and upsert replacement rules stayed intact
- memory-save-planner-first.vitest.ts - PASS, 2 focused planner-contract tests in the current suite
- content-router.vitest.ts - PASS, 26 focused routing tests in the current suite
- reconsolidation-bridge.vitest.ts - PASS, 4 reconsolidation gating tests

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- COMPLEXITY_MATCH warning The strict packet validator may still surface the accepted complexity-match warning for this packet.
- Legacy handler-memory-save fixtures Eight older handler-memory-save fixtures remain outside this packet scope.
- Split finishing pass M5 closeout was finalized by cli-copilot after cli-codex hit its usage cap mid-batch.
