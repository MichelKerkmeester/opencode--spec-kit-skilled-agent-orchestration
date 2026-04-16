<!-- SNAPSHOT: copied from 015-save-flow-planner-first-trim/review/iterations/iteration-008.md on 2026-04-15. Authoritative source at original packet. -->

---
iteration: 8
dimension: "Test coverage gap sweep"
focus: "Verify Phase 015 touched sources are covered in both planner-first and full-auto modes, then run the required targeted suites"
timestamp: "2026-04-15T09:10:35Z"
runtime: "cli-copilot --effort high"
status: "insight"
findings:
  P0: 0
  P1: 1
  P2: 0
---

# Iteration 008

## Findings

### P1
1. **F006 — Deferred follow-up surfaces are only shape-tested, not execution-tested across planner/apply mode boundaries.** Phase 015 added executable follow-up helpers for `reindexSpecDocs()` and `runEnrichmentBackfill()` plus planner-gated enrichment via `runPostInsertEnrichmentIfEnabled()`, but the current tests only assert that planner responses advertise those actions while direct follow-up API execution coverage exists only for `refreshGraphMetadata()`. That leaves the deferred enrichment/reindex path without a test that actually runs the helper bodies or distinguishes the planner-default skip from the full-auto branch, which is exactly why the iteration-7 enrichment-status bug could land undetected. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/api/indexing.ts:100-128] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:206-225] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/memory-save-planner-first.vitest.ts:60-86] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1206-1226] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-integration.vitest.ts:107-113]

**Remediation suggestion:** Add an end-to-end test that executes planner-default save -> advertised follow-up -> explicit full-auto/apply, and assert both `runEnrichmentBackfill()` / `reindexSpecDocs()` behavior plus the skipped-versus-ran enrichment status transition.

## Ruled-out directions explored

- **Core planner/apply parity for `memory-save.ts` is covered.** `memory-save-integration.vitest.ts` exercises both planner-default and explicit full-auto end to end for narrative-progress and metadata-only routes. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts:526-582] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts:584-620]
- **Router mode split is covered.** `content-router.vitest.ts` checks the default manual-review path and the explicit `tier3Enabled: true` path. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:219-243] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:261-293]
- **Quality-loop mode split is covered.** `quality-loop.vitest.ts` exercises the default advisory branch and explicit `mode: 'full-auto'` rejection/fix behavior. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:473-500] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:502-552]
- **Reconsolidation mode split is covered.** `reconsolidation-bridge.vitest.ts` covers the planner-default skip and several explicit full-auto outcomes. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation-bridge.vitest.ts:120-141] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation-bridge.vitest.ts:143-180]
- **Chunking mode split is covered.** `chunking-orchestrator.vitest.ts` explicitly checks `plan-only` versus `full-auto`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator.vitest.ts:211-215]
- **Required focused suites passed cleanly.** The specified seven-suite run completed with 223 passing tests and no failures. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/memory-save-planner-first.vitest.ts:1-214] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:1-260] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:460-570] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/save-quality-gate.vitest.ts:1-200] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:880-906] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation-bridge.vitest.ts:120-288] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator.vitest.ts:211-235]

## Evidence summary

- Targeted Phase 015 suites: passing.
- Direct two-mode coverage exists for core planner/apply surfaces.
- The remaining gap is the deferred follow-up execution path, especially enrichment backfill and reindex follow-ups.

## Novelty justification

This iteration added new signal by proving the main planner/full-auto split is tested while isolating a narrower but still material gap around deferred follow-up execution, which directly explains why a planner-default enrichment defect escaped the suite.
