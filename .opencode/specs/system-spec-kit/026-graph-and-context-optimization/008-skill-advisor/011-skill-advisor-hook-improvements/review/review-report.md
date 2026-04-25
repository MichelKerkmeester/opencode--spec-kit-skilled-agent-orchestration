# Implementation Review Report - 014

## Summary

- Iterations run: 10
- Stop reason: `max_iterations_reached`
- Total findings: P0=1, P1=6, P2=1
- Overall verdict: `FAIL` because `advisor_recommend` can reuse cached recommendations across workspaces when freshness state matches, and the packet's own evidence ledger is materially incomplete.

## Methodology

This review followed the packet docs in the requested order, then audited every implementation file listed in `implementation-summary.md` plus the paired handler/hook coverage that exists for those surfaces. Each iteration focused on one review angle, captured file:line evidence, and separated implementation defects from documentation/verification drift.

## Key Findings

### P0

- `F-003` `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts:163`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/prompt-cache.ts:22`
  Evidence: `advisor_recommend` accepts explicit `workspaceRoot`, but the cache key parts do not include that root.
  Recommended fix: key the cache by resolved `workspaceRoot` (or a workspace-scoped freshness source signature) and add a multi-workspace cache isolation test.
  Target files: `handlers/advisor-recommend.ts`, `lib/prompt-cache.ts`, `tests/handlers/advisor-recommend.vitest.ts`

### P1

- `F-001` `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/011-skill-advisor-hook-improvements/spec.md:3`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/011-skill-advisor-hook-improvements/spec.md:82`
  Evidence: the governing spec still says the packet is research-only and excludes implementation, while the same folder now claims completed implementation and verification.
  Recommended fix: update the governing spec/metadata or move the implementation record under a packet whose spec authorizes it.
  Target files: `spec.md`, `implementation-summary.md`, `checklist.md`, `resource-map.md`

- `F-002` `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/011-skill-advisor-hook-improvements/checklist.md:46`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/011-skill-advisor-hook-improvements/resource-map.md:116`
  Evidence: checklist and resource-map both cite `applied/T-###.md`, but no `applied/` directory exists under the packet.
  Recommended fix: restore the missing evidence or correct the docs to stop claiming it exists.
  Target files: `checklist.md`, `implementation-summary.md`, `resource-map.md`

- `F-004` `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts:172`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/render.ts:98`
  Evidence: the builder still uses a private renderer, while hooks render through `renderAdvisorBrief(...)`; shared payload then stores the private format.
  Recommended fix: make the builder derive `brief` and shared payload content from the shared renderer.
  Target files: `lib/skill-advisor-brief.ts`, `lib/render.ts`, `tests/legacy/advisor-brief-producer.vitest.ts`

- `F-005` `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/011-skill-advisor-hook-improvements/implementation-summary.md:94`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/011-skill-advisor-hook-improvements/checklist.md:75`
  Evidence: packet-local Codex verification only documents fail-open `{}` smokes and missing `applied/T-013.md` evidence, not the successful shared-brief path.
  Recommended fix: replace those claims with packet-local success-path evidence or explicit references to the real codex tests that were rerun.
  Target files: `implementation-summary.md`, `checklist.md`, `resource-map.md`

- `F-006` `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts:400`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts:325`
  Evidence: durable outcome JSONL is parsed without validation or recovery, and `advisor_validate` reads it unguarded.
  Recommended fix: make outcome parsing corruption-tolerant and add malformed-telemetry tests.
  Target files: `lib/metrics.ts`, `handlers/advisor-validate.ts`, `tests/handlers/advisor-validate.vitest.ts`

- `F-007` `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts:311`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts:420`
  Evidence: `skillSlug` filters corpus rows only, but telemetry totals stay workspace-global.
  Recommended fix: either scope totals to the selected skill or relabel/document them as global.
  Target files: `handlers/advisor-validate.ts`, `schemas/advisor-tool-schemas.ts`, `README.md`

### P2

- `F-008` `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/011-skill-advisor-hook-improvements/resource-map.md:24`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/011-skill-advisor-hook-improvements/resource-map.md:121`
  Evidence: the resource map claims to be paths-only but includes narrative and unresolved `NEEDS VERIFICATION` notes, while also preserving stale research lineage.
  Recommended fix: regenerate the resource map as a factual ledger only.
  Target files: `resource-map.md`

## Regression Risk Assessment

- High for public MCP correctness because the cache isolation defect can surface wrong recommendations for the wrong repository without crashing.
- Medium for cross-runtime behavior because the builder/shared-payload renderer split means not every consumer sees the same brief string.
- Medium for operator trust because packet docs currently overstate verification completeness and artifact presence.

## Test Coverage Gaps

- Packet-local evidence does not prove `advisor_recommend` cache isolation across distinct `workspaceRoot` values.
- The validator suite does not exercise malformed durable outcomes JSONL.
- The packet's own implementation docs do not link success-path Codex tests even though such tests exist in the repo.

## Cross-Runtime Consistency Checks

- Positive: hook and wrapper tests exist for Codex success paths, and privacy-oriented tests continue to enforce prompt-safe diagnostics.
- Negative: the shared builder still emits a different brief format from the hook-visible shared renderer, so parity is incomplete at the contract boundary.
- Negative: packet docs still carry conflicting research/implementation lineage across `spec.md`, `checklist.md`, and `resource-map.md`.

## Recommended Follow-Up Fixes

1. Fix `advisor_recommend` cache isolation with explicit `workspaceRoot` scoping and add a regression test.
2. Collapse `buildSkillAdvisorBrief` onto `renderAdvisorBrief(...)` so shared payload and runtime hooks emit one brief contract.
3. Restore or regenerate the packet's missing `applied/T-###.md` evidence and correct the checklist/resource-map claims.
4. Harden durable outcome parsing so corrupted JSONL does not break `advisor_validate`.
5. Clarify or scope `skillSlug` telemetry totals so subset validation reports are not misleading.
6. Reconcile packet-014 lineage by aligning `spec.md`, `implementation-summary.md`, `checklist.md`, and `resource-map.md`.

## Convergence Report

- Iterations 1-4 found the highest-signal defects: scope drift, missing evidence, cache correctness, and renderer split.
- Iterations 5-8 confirmed the remaining risk pockets were verification quality and telemetry semantics, not fresh security/privacy regressions.
- Iterations 9-10 were stabilization passes; they did not add new P0/P1 findings.
- Convergence did not trigger early because each middle iteration still added non-trivial new information, but novelty fell steadily to `0.05` by iteration 10.

## References

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/011-skill-advisor-hook-improvements/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/011-skill-advisor-hook-improvements/implementation-summary.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/011-skill-advisor-hook-improvements/checklist.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/011-skill-advisor-hook-improvements/resource-map.md`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/prompt-cache.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/render.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts`
