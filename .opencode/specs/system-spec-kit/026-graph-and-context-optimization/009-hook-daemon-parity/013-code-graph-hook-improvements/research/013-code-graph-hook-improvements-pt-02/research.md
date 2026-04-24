---
title: "...ion/009-hook-daemon-parity/013-code-graph-hook-improvements/research/013-code-graph-hook-improvements-pt-02/research]"
description: "This packet deepened the code-graph and hook investigation beyond pt-01 by focusing on residual contract gaps that survived the earlier remediation wave. The strongest new issue..."
trigger_phrases:
  - "ion"
  - "009"
  - "hook"
  - "daemon"
  - "parity"
  - "research"
  - "013"
  - "code"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/013-code-graph-hook-improvements/research/013-code-graph-hook-improvements-pt-02"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["research.md"]
---
# Deep Research — 013-code-graph-hook-improvements-pt-02

## Summary

This packet deepened the code-graph and hook investigation beyond pt-01 by focusing on residual contract gaps that survived the earlier remediation wave. The strongest new issues are not broad storage or parser failures, but downstream correctness and transport leaks: read-path handlers continue operating when a full scan is required but intentionally suppressed, the CocoIndex bridge sheds semantic ranking fidelity before graph resolution, and scan-time enrichment metadata can remain stale because null summaries never clear prior state [.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:595-599; .opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts:103-106; .opencode/skill/system-spec-kit/mcp_server/code-graph/lib/seed-resolver.ts:19-25,86-92; .opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts:239-242]. The investigation also confirmed that persisted detector/enrichment summaries are still effectively write-only for operators, while startup structured payloads exist only at the builder layer and disappear at adapter boundaries and in adapter test expectations [.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts:226-259,652-692; .opencode/skill/system-spec-kit/mcp_server/code-graph/lib/startup-brief.ts:230-245; .opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:64-81; .opencode/skill/system-spec-kit/mcp_server/tests/codex-session-start-hook.vitest.ts:46-68]. The context deadline surface remains only partially real because the handler never supplies `deadlineMs`, only one mode enforces an elapsed-time budget, and budget-driven omissions are unlabeled in the response payload [.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-context.ts:13-21,189-240,281-327; .opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts:168-176]. Ten iterations were used because novelty kept tapering but did not hit the two-iteration early-stop condition soon enough to justify a legal early exit.

## Scope

In scope:

- Code-graph read, readiness, scan, context, and startup surfaces named by the parent packet [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/013-code-graph-hook-improvements/spec.md:54-74].
- CocoIndex-to-code-graph seed resolution and neighborhood expansion behavior [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/013-code-graph-hook-improvements/spec.md:67-74].
- Runtime startup hook transport and operator-facing docs/tests tied to code-graph priming [.opencode/skill/system-spec-kit/references/config/hook_system.md:35-45,64-78].

Out of scope:

- Reopening already-applied CF-002, CF-009, CF-010, CF-013, or CF-014 as if they were still unfixed [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/applied/CF-009.md:5-12; .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/applied/CF-010.md:5-13; .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/applied/CF-014.md:5-13].
- CocoIndex indexing internals, broad memory-system work, storage-engine rewrites, or the dedicated zero-calls lane [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/013-code-graph-hook-improvements/spec.md:76-81].

## Methodology

The packet ran 10 iterations and stopped at the configured cap rather than early convergence. Sources included the parent spec packet, pt-01 synthesis and findings registry, the closed CF notes used as background boundaries, live code in `mcp_server/code-graph/**` and `hooks/**`, and runtime-facing tests/docs. I attempted to use the deferred Spec Kit Memory and CocoIndex MCP tools first, but their calls returned cancelled responses in this runtime, so the investigation proceeded via direct source inspection and line-cited local evidence. Iteration notes were used to separate live gaps from ruled-out or already-closed themes, then collapsed into a six-finding synthesis.

## Research Charter Recap

- Non-goals held: no reopening of closed CFs as open bugs, no zero-calls work, and no architecture rewrite.
- Stop conditions held: novelty declined steadily but only the final iteration fell below the `0.05` threshold, so the packet used the max-iteration stop rather than an early convergence stop.
- Success criteria held: the packet produced more than three net-new P1/P2 findings beyond the closed CF set, each with target files and direct evidence.

## Key Findings

### P0

- None. The remaining residuals are meaningful but do not rise above P1 without a demonstrated user-facing failure or data-loss path in the current code.

### P1

- `F-001` `correctness` — `code_graph_query` and `code_graph_context` continue executing after `ensureCodeGraphReady()` reports a `full_scan` requirement while `allowInlineFullScan` is disabled, so callers can receive unresolved or partial graph answers instead of an explicit blocked-until-scan contract [.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:595-599,613-727; .opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts:103-106,168-178; .opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-query-handler.vitest.ts:98-130; .opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-context-handler.vitest.ts:56-104].
- `F-002` `correctness` — The CocoIndex bridge discards semantic `score`, `snippet`, and meaningful range semantics before graph resolution, then reorders seeds by local graph confidence, which can mis-anchor or mis-rank multi-seed semantic search results [.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/seed-resolver.ts:19-25,86-92,185-246,275-290].
- `F-003` `freshness` — `handleCodeGraphScan()` only persists `graphEdgeEnrichmentSummary` when it is non-null, so a later scan with no enrichment evidence leaves the previous summary in metadata and creates stale post-scan observability state [.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts:187-188,239-242; .opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts:243-259; .opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-scan.vitest.ts:91-138].

### P2

- `F-004` `observability` — Detector-provenance and edge-enrichment summaries are persisted in metadata but still have no operator-facing readers in `getStats()`, `code_graph_status`, or `buildStartupBrief()`, which makes them effectively write-only outside direct DB access [.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts:226-259,652-692; .opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/status.ts:13-47; .opencode/skill/system-spec-kit/mcp_server/code-graph/lib/startup-brief.ts:131-169,223-255].
- `F-005` `cross-runtime` — `buildStartupBrief()` creates a structured startup `sharedPayload`, but Claude, Gemini, Copilot, and Codex adapters still emit text-only startup surfaces, and adapter tests only assert text output, so the structured startup contract is not runtime-real today [.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/startup-brief.ts:230-245; .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:235-285; .opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:170-219; .opencode/skill/system-spec-kit/mcp_server/hooks/copilot/session-prime.ts:171-219; .opencode/skill/system-spec-kit/mcp_server/hooks/codex/session-start.ts:155-176; .opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:64-81; .opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:257-268; .opencode/skill/system-spec-kit/mcp_server/tests/codex-session-start-hook.vitest.ts:46-68].
- `F-006` `ergonomics` — `code_graph_context` still presents a partially implemented bounded-work contract: the handler never sets `deadlineMs`, only `impact` mode enforces an elapsed-time budget, and text-budget omission is not labeled as partial output in the response envelope [.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-context.ts:13-21,73-95,189-240,281-327; .opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts:168-176].

## Evidence Trail

- Iteration 01 re-established the packet charter, pt-01 carry-over themes, and the closure boundaries that should not be reopened [`iterations/iteration-01.md#findings`].
- Iteration 02 isolated the read-path soft-continuation issue when `full_scan` is required but suppressed [`iterations/iteration-02.md#findings`].
- Iteration 03 showed that the CocoIndex bridge drops semantic ranking context before graph resolution and then reorders on graph confidence [`iterations/iteration-03.md#findings`].
- Iteration 04 established the stale-summary persistence bug for `graphEdgeEnrichmentSummary` [`iterations/iteration-04.md#findings`].
- Iteration 05 confirmed that persisted summaries still lack production readers in status and startup surfaces [`iterations/iteration-05.md#findings`].
- Iteration 06 showed that structured startup payloads stop at the builder layer and adapter tests lock in text-only behavior [`iterations/iteration-06.md#findings`].
- Iteration 07 refined the deadline/truncation story from a latent setting problem into a broader unlabeled-partial-output ergonomics gap [`iterations/iteration-07.md#findings`].
- Iterations 08-10 validated that docs, runtime smoke checks, and final convergence all reinforce the same six-bucket synthesis rather than revealing a separate seventh finding [`iterations/iteration-08.md#findings`; `iterations/iteration-09.md#findings`; `iterations/iteration-10.md#findings`].

## Recommended Fixes

### Read-Path Contract

- `RF-001` for `F-001`
  Severity: `P1`
  Target files: `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-query-handler.vitest.ts`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-context-handler.vitest.ts`
  Recommendation: after `ensureCodeGraphReady()`, explicitly gate on `readiness.action === "full_scan"` when `inlineIndexPerformed` is false. Either return a structured "full scan required" error or a clearly marked degraded payload with no graph answers.
  Diff shape: add a helper such as `shouldBlockReadPath(readiness)` and unit tests for empty/full-scan-needed states.

### CocoIndex Bridge Fidelity

- `RF-002` for `F-002`
  Severity: `P1`
  Target files: `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/seed-resolver.ts`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-context-handler.vitest.ts`
  Recommendation: preserve CocoIndex `score`, `snippet`, and full range overlap through seed resolution, and only fall back to local graph confidence as a secondary tie-breaker.
  Diff shape: extend `ArtifactRef` or a parallel metadata carrier to preserve original semantic ranking, and update seed ordering to combine semantic and structural confidence instead of replacing one with the other.

### Scan Metadata Freshness

- `RF-003` for `F-003`
  Severity: `P1`
  Target files: `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-scan.vitest.ts`
  Recommendation: clear persisted enrichment summary metadata when a successful scan computes no current summary.
  Diff shape: add an explicit `clearLastGraphEdgeEnrichmentSummary()` DB helper or allow null writes, then add a regression test that runs two scans with a non-null then null summary.

### Operator Observability

- `RF-004` for `F-004`
  Severity: `P2`
  Target files: `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/status.ts`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/startup-brief.ts`, `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md`
  Recommendation: add a compact graph-quality summary reader and surface it in `code_graph_status` and startup priming.
  Diff shape: extend `getStats()` or introduce `getGraphQualitySummary()` with detector counts and enrichment confidence class, then document the meaning of those fields for operators.

### Startup Transport

- `RF-005` for `F-005`
  Severity: `P2`
  Target files: `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/startup-brief.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/session-prime.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/session-start.ts`, `.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts`, `.opencode/skill/system-spec-kit/mcp_server/tests/codex-session-start-hook.vitest.ts`
  Recommendation: either propagate `sharedPayload` (or a compact serialized derivative) through runtime startup adapters, or delete the builder-level startup `sharedPayload` so the code stops advertising an unused contract.
  Diff shape: choose one transport contract, implement it in all adapters, and add adapter-level tests that assert structured startup graph metadata rather than text only.

### Context Boundedness

- `RF-006` for `F-006`
  Severity: `P2`
  Target files: `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-context.ts`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-context-handler.vitest.ts`
  Recommendation: make `deadlineMs` real by default, enforce it across all modes, and annotate responses when sections are omitted or truncated.
  Diff shape: pass a default deadline from the handler, add budget checks to `neighborhood` and `outline`, and attach explicit partial-output metadata to the result envelope.

## Negative Knowledge

- CF-009's staged-persistence fix remains a valid closure; pt-02 did not find evidence that file/node/edge writes reverted to pre-fix behavior [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/applied/CF-009.md:5-12].
- CF-010's trust-mapping unification remains valid for the query path; pt-02 focused on other surfaces that still bypass or fail to transport the shared contract [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/applied/CF-010.md:5-13].
- CF-014's artifact-root correction remains valid; packet-local research artifact placement was not a live problem in this run [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/applied/CF-014.md:5-13].
- The subtree-root scan deletion and readiness debounce invalidation issues from pt-01 still matter, but this packet did not need to promote them again to justify its own synthesis [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/013-code-graph-hook-improvements/research/028-code-graph-hook-improvements-pt-01/research.md:3-4,13-20].

## Cross-Cutting Themes

- The main residual pattern is contract leakage: information exists in one layer (`sharedPayload`, semantic score, scan summary metadata, readiness action) but gets dropped or softened before reaching the next layer.
- Several gaps are amplified by test shape rather than code alone. Builder tests know about structured startup payloads, while adapter tests only check text; readiness tests know about fresh/stale/crash paths, but not blocked-full-scan states.
- Most fixes can be made surgically without changing the graph schema, provided the team treats transport and summary surfaces as first-class contracts.

## Risk Matrix

| Risk | Severity | Why it matters | Mitigation |
|---|---|---|---|
| Read paths silently continue when a full scan is required | P1 | Consumers can misread empty or unresolved results as authoritative absence | Add explicit blocked-full-scan contract and tests |
| Semantic ranking is lost before graph resolution | P1 | Multi-seed semantic discovery can anchor to the wrong graph nodes | Preserve CocoIndex score/snippet/range through resolution |
| Enrichment metadata can stay stale after later scans | P1 | Future operator surfaces may report old confidence data as current | Clear summary metadata on null-summary scans |
| Persisted summaries are invisible to operators | P2 | Drift in parser mix or enrichment quality remains undiagnosed | Surface graph-quality summary in status/startup |
| Builder/runtime startup contract diverges | P2 | Structured graph trust metadata can rot unnoticed | Pick one transport contract and assert it in adapter tests |
| Partial context output is unlabeled | P2 | Consumers cannot tell omission from absence | Add partial-output metadata and consistent deadlines |

## Alternatives Considered

- For `F-001`, an alternative is to keep soft continuation but annotate the payload heavily rather than blocking. I rejected that as the primary recommendation because the current code already returns plain unresolved errors in some branches, which makes soft continuation easy to misread.
- For `F-002`, one alternative is to keep seed resolution line-based and document the lossiness. I rejected that because the seed type already carries richer semantic fields, so throwing them away is unnecessary contract loss.
- For `F-005`, an alternative is to delete `sharedPayload` from `buildStartupBrief()` and accept text-only startup everywhere. That is viable, but it should be a deliberate simplification rather than the current accidental builder/runtime split.

## Open Questions

- Should read-path handlers hard-error on `full_scan`, or return a typed degraded payload with no graph answers?
- What combined scoring rule should order resolved CocoIndex seeds: semantic score first, graph confidence first, or a weighted blend?
- Is the right operator surface for detector/enrichment summaries `code_graph_status`, startup priming, or both?
- Which runtime should pilot structured startup graph transport first if the team keeps the builder `sharedPayload` contract?
- Does a bounded `code_graph_context` need a boolean partial flag only, or a richer omitted-section summary?

## Convergence Report

Iterations 02-07 produced the decisive evidence. Iteration 02 established the read-path contract problem; iteration 03 surfaced the seed-fidelity loss; iteration 04 exposed the stale-summary persistence behavior; iterations 05-06 proved that observability and startup transport still stop short of operators and runtimes; iteration 07 refined the ergonomics story into a partial-output contract gap. Later iterations mostly performed consolidation and ruled-out work. The `newInfoRatio` trend was `0.92, 0.76, 0.68, 0.53, 0.41, 0.31, 0.21, 0.14, 0.08, 0.04`, so novelty clearly tapered, but only the final iteration fell under the `0.05` threshold. Stop reason: `max_iterations`.

## Related Work

- Parent packet spec: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/013-code-graph-hook-improvements/spec.md`
- Prior packet synthesis: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/013-code-graph-hook-improvements/research/028-code-graph-hook-improvements-pt-01/research.md`
- Prior packet registry: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/013-code-graph-hook-improvements/research/028-code-graph-hook-improvements-pt-01/findings-registry.json`
- Closed closure notes used as boundaries: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/applied/CF-009.md`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/applied/CF-010.md`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/applied/CF-014.md`
- Startup/runtime reference docs: `.opencode/skill/system-spec-kit/references/config/hook_system.md`, `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/README.md`

## Next Steps

- Create an implementation packet for read-path contract hardening (`query.ts` + `context.ts` + tests).
- Create a bridge-fidelity packet for `seed-resolver.ts` and `code_graph_context` seed ordering.
- Create an observability packet for scan summary clearing plus `status`/startup exposure.
- Create a startup-transport packet that either propagates or removes `sharedPayload` consistently across Claude, Gemini, Copilot, and Codex.
- Create a smaller ergonomics packet for default deadlines and partial-output markers in `code_graph_context`.

## References

### Prior Research and Spec Packets

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/013-code-graph-hook-improvements/research/028-code-graph-hook-improvements-pt-01/research.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/013-code-graph-hook-improvements/research/028-code-graph-hook-improvements-pt-01/findings-registry.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/013-code-graph-hook-improvements/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/applied/CF-009.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/applied/CF-010.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/applied/CF-014.md`

### Code Surfaces

- `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/status.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/ensure-ready.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/seed-resolver.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-context.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/startup-brief.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/session-prime.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/session-start.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/custom-instructions.ts`

### Docs and Tests

- `.opencode/skill/system-spec-kit/references/config/hook_system.md`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/codex-session-start-hook.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-query-handler.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-context-handler.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-scan.vitest.ts`
