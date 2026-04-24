---
title: "...ion/009-hook-package/013-code-graph-hook-improvements/research/028-code-graph-hook-improvements-pt-01/research]"
description: "Ten focused iterations found one high-severity correctness gap and five follow-on P1/P2 gaps that sit outside the already-closed CF-002/CF-009/CF-010/CF-014 lanes [.opencode/spe..."
trigger_phrases:
  - "ion"
  - "009"
  - "hook"
  - "daemon"
  - "parity"
  - "research"
  - "028"
  - "code"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-package/013-code-graph-hook-improvements/research/028-code-graph-hook-improvements-pt-01"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["research.md"]
---
# Deep Research — 013-code-graph-hook-improvements

## Summary
Ten focused iterations found one high-severity correctness gap and five follow-on P1/P2 gaps that sit outside the already-closed CF-002/CF-009/CF-010/CF-014 lanes [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/013-code-graph-hook-improvements/research/iterations/iteration-02.md#Iteration-02; .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/013-code-graph-hook-improvements/research/iterations/iteration-04.md#Iteration-04; .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/013-code-graph-hook-improvements/research/iterations/iteration-09.md#Iteration-09]. The clearest risk is that `code_graph_scan(rootDir=...)` can narrow the graph to a subtree and then delete out-of-scope rows while status/startup surfaces still present the remaining graph as healthy. The freshness path also still has a hidden debounce cache that manual scans do not invalidate, which can briefly preserve stale/failing readiness results after the graph was repaired. Downstream surfaces remain inconsistent: `code_graph_context` carries a second freshness vocabulary and a reduced provenance object, while startup hooks mostly drop the structured graph payload that `buildStartupBrief()` already assembles. The later iterations mostly converged on these same buckets rather than surfacing a separate architecture class, so the next packet should prioritize correctness/freshness before transport polish.

## Scope
Investigated packet-local scope from `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/013-code-graph-hook-improvements/spec.md:54-74`: code-graph scan/read/readiness paths, status/context/startup surfaces, persisted provenance/edge-quality summaries, and cross-runtime startup hook wiring. Reviewed the already-closed closure notes in `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/applied/CF-009.md`, `CF-010.md`, and `CF-014.md` to avoid reopening remediated findings. Primary code evidence came from `.opencode/skill/system-spec-kit/mcp_server/code-graph/**`, `.opencode/skill/system-spec-kit/mcp_server/hooks/**`, `.opencode/skill/system-spec-kit/mcp_server/lib/context/**`, and the handler/test surfaces that expose graph state to operators and runtimes.

## Key Findings
### P0
- `F-001` `correctness` — Subtree-root manual scans can delete previously indexed files outside the requested subtree and still leave the surviving graph looking `ready/live`. Evidence: `handlers/scan.ts` accepts any in-workspace `rootDir` and feeds it into `getDefaultConfig()` [.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts:128-172; .opencode/skill/system-spec-kit/mcp_server/code-graph/lib/indexer-types.ts:112-120], then the full-reindex path removes every tracked file not returned in `results` [.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts:196-205]. `code_graph_status` and `startup-brief` then report health from the narrowed DB without any scope-completeness flag [.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/status.ts:13-47; .opencode/skill/system-spec-kit/mcp_server/code-graph/lib/startup-brief.ts:131-169].

### P1
- `F-002` `freshness` — The bounded inline refresh path caches readiness decisions for five seconds and exposes no invalidation hook, so a stale or failed read-path result can outlive a successful manual scan. Evidence: debounce map and cache-return path in `ensure-ready.ts` [.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/ensure-ready.ts:255-380], with no matching invalidation call in `handleCodeGraphScan()` [.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts:186-259].
- `F-003` `correctness` — `code_graph_context` emits a second freshness story (`metadata.freshness`) based only on `indexed_at`, so one payload can simultaneously say "readiness stale" and "metadata fresh/recent". Evidence: `computeFreshness()` in `code-graph-context.ts` [.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-context.ts:97-115,162-175] versus operational freshness in `detectState()` [.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/ensure-ready.ts:96-180], both emitted by `handlers/context.ts` [.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts:178-215].
- `F-004` `ergonomics` — The context surface advertises bounded work but does not actually wire a live deadline from the handler, and only `impact` mode checks elapsed budget. Evidence: `ContextArgs.deadlineMs` exists [.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-context.ts:13-21], but `handleCodeGraphContext()` never sets it [.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts:166-176], while `neighborhood`/`outline` lack the budget breaker that `impact` already uses [.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-context.ts:178-247].

### P2
- `F-005` `observability` — Scan-time detector-provenance and edge-enrichment summaries are persisted but disappear from operator-facing status/startup surfaces. Evidence: DB metadata getters/setters exist [.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts:226-259] and scan writes them [.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts:236-242], yet `getStats()` and `code_graph_status` omit them [.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts:652-692; .opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/status.ts:13-47], and `startup-brief` only forwards aggregate counts/state [.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/startup-brief.ts:88-128,131-169].
- `F-006` `cross-runtime` — `buildStartupBrief()` already produces a structured `sharedPayload`, but the Claude/Gemini/Copilot/Codex startup adapters re-emit only text sections, so runtimes never see machine-readable graph trust metadata. Evidence: structured payload creation in `startup-brief.ts` [.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/startup-brief.ts:200-255], contrasted with string-first startup adapters in Claude/Gemini/Copilot/Codex [.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:195-285; .opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:147-220; .opencode/skill/system-spec-kit/mcp_server/hooks/copilot/session-prime.ts:171-219; .opencode/skill/system-spec-kit/mcp_server/hooks/codex/session-start.ts:153-176].

## Evidence Trail
- Iteration 02 established the primary correctness bug: "`handleCodeGraphScan()` accepts any `rootDir` inside the workspace" and "a subtree scan therefore has the same cleanup semantics as a workspace scan" [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/013-code-graph-hook-improvements/research/iterations/iteration-02.md#Iteration-02].
- Iteration 03 showed why that bug is hard to detect operationally: "`code_graph_status` reports totals, freshness, parse health, and schema version, but not the scan root" and startup priming reuses the same aggregate-health view [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/013-code-graph-hook-improvements/research/iterations/iteration-03.md#Iteration-03].
- Iteration 04 isolated the freshness invalidation hole: "`ensureCodeGraphReady()` caches `ReadyResult` entries for five seconds" and `handleCodeGraphScan()` "never clears or refreshes the cached readiness entry" [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/013-code-graph-hook-improvements/research/iterations/iteration-04.md#Iteration-04].
- Iterations 05 and 06 converged on context-surface drift: one found that `metadata.freshness` is derived from `MAX(indexed_at)` age, and the next showed that `context.ts` still appends a handler-local provenance object instead of reusing `buildQueryTrustMetadata()` [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/013-code-graph-hook-improvements/research/iterations/iteration-05.md#Iteration-05; .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/013-code-graph-hook-improvements/research/iterations/iteration-06.md#Iteration-06].
- Iteration 08 captured the observability drop: "scan-time detector-provenance and edge-enrichment summaries are persisted" but "status/startup surfaces lose the parser-quality and edge-confidence signals" [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/013-code-graph-hook-improvements/research/iterations/iteration-08.md#Iteration-08].
- Iteration 09 captured the cross-runtime startup gap: `buildStartupBrief()` has a machine-readable payload, but the runtime adapters "never forward `sharedPayload` itself" [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/013-code-graph-hook-improvements/research/iterations/iteration-09.md#Iteration-09].

## Recommended Fixes
### Correctness
- `[P0]` Guard or redesign scoped scans in `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts`.
  Target files: `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/status.ts`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/startup-brief.ts`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-scan.vitest.ts`.
  Change bucket: reject non-workspace-root full scans by default, or persist explicit coverage metadata (`scanRoot`, `coverageComplete`) and restrict cleanup to the same scope.
- `[P1]` Unify `code_graph_context` freshness and provenance with the shared readiness contract.
  Target files: `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-context.ts`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/readiness-contract.ts`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-context-handler.vitest.ts`.
  Change bucket: either drop `metadata.freshness` or derive it from readiness helpers; stop emitting placeholder `'unknown'` provenance when metadata should be absent.

### Freshness
- `[P1]` Add explicit readiness-cache invalidation after successful manual scans and other graph mutations.
  Target files: `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/ensure-ready.ts`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-siblings-readiness.vitest.ts`.
  Change bucket: export an `invalidateCodeGraphReadiness(rootDir?)` helper, call it after successful persistence, and consider shorter caching or no caching for failure results.

### Ergonomics
- `[P1]` Make context deadlines real instead of latent.
  Target files: `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-context.ts`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-context-handler.vitest.ts`.
  Change bucket: set a default `deadlineMs` in the handler, apply the same elapsed-budget breaker to `neighborhood` and `outline`, and add regression tests for partial-but-bounded output.

### Observability
- `[P2]` Promote persisted provenance/enrichment summaries into operator surfaces.
  Target files: `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/status.ts`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/startup-brief.ts`, `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md`.
  Change bucket: extend `getStats()` or add a dedicated status summary getter so `code_graph_status` and startup surfaces can expose parser-mix/edge-confidence drift.

### Cross-Runtime
- `[P2]` Decide whether startup graph metadata should stay text-only or graduate to a shared structured adapter contract.
  Target files: `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/startup-brief.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/session-prime.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/session-start.ts`.
  Change bucket: either propagate `sharedPayload` (or a compact derivative) through runtime diagnostics/side channels, or delete the unused startup structure so the code stops pretending it is runtime-visible.

## Convergence Report
The packet did not hit the early-stop threshold: the last two `newInfoRatio` values were `0.07` and `0.06`, so there was still incremental value in the final passes. Convergence began around iterations 06-07, when the work shifted from discovery to contract alignment and regression-harness review. The highest-yield iterations were 02 (subtree scan correctness), 04 (readiness debounce invalidation), 05-06 (context freshness/provenance drift), and 09 (structured startup payload dropped by runtime adapters). Iteration 10 confirmed that later passes were mostly refining these buckets rather than opening a new one.

## Open Questions
- Should non-root scans be forbidden entirely, or preserved as an expert-only mode with explicit scope metadata?
- What is the smallest operator-visible coverage signal that would prevent partial graphs from masquerading as healthy?
- Is the better startup fix to propagate `sharedPayload`, or to keep startup textual and instead expose structured graph metadata through a side-channel diagnostic surface?
- Which runtime should serve as the pilot for structured startup graph metadata if that path is chosen?
- Should packet docs cleanup for the stale closure references be bundled into the first implementation packet or split into a docs-only follow-up?

## References
- Packet spec: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/013-code-graph-hook-improvements/spec.md`
- Prior closure notes: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/applied/CF-009.md`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/applied/CF-010.md`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/applied/CF-014.md`
- Sibling impact baseline: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/impact-analysis/merged-impact-report.md`
- Core code: `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/ensure-ready.ts`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-context.ts`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/readiness-contract.ts`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/startup-brief.ts`
- Hook/runtime surfaces: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/session-prime.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/session-start.ts`
- Packet-local evidence: `research/iterations/iteration-01.md` through `research/iterations/iteration-10.md`
