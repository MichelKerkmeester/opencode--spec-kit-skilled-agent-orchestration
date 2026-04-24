# Strategy — 013-code-graph-hook-improvements-pt-02

## Research Charter

### Non-Goals

- Do not reopen already-applied CF-002, CF-009, CF-010, CF-013, or CF-014 unless the live code shows a distinct residual gap downstream of those fixes.
- Do not investigate zero-calls behavior or the dedicated zero-calls packet; that lane is explicitly reserved for pt-03.
- Do not propose storage-engine rewrites, new query engines, or broad memory-system work outside the code-graph and hook integration surfaces.
- Do not treat CocoIndex indexing internals as the subject of this packet; only the code-graph bridge contract is in scope.

### Stop Conditions

- Stop early only if two consecutive iterations land below `newInfoRatio < 0.05` and the packet already has enough evidence-backed findings to justify synthesis.
- Stop immediately if the investigation collapses into already-closed CF lanes without exposing a distinct downstream residual.
- Stop at iteration 10 if novelty keeps tapering but still produces bounded incremental evidence.

### Success Criteria

- Produce net-new, evidence-backed findings in correctness, freshness, observability, ergonomics, and cross-runtime behavior beyond the closed CF set.
- Tie every recommended fix to concrete target files so a downstream implementation packet can act without re-discovery.
- Separate confirmed gaps from ruled-out hypotheses so later packets do not repeat dead ends.

## Known Context

- Pt-01 already established that subtree-root scans, readiness debounce caching, context freshness drift, latent deadline handling, and startup transport loss were the highest-yield unresolved buckets after the earlier remediation wave [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/028-code-graph-hook-improvements-pt-01/research.md:3-4,13-20].
- The parent packet explicitly scoped code-graph scan/read/readiness paths, CocoIndex bridge behavior, hook-triggered staleness handling, and operator-facing status/docs surfaces for follow-on investigation [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/013-code-graph-hook-improvements/spec.md:54-74].
- The parent packet also marked implementation as out of scope, so this packet should stay in evidence-gathering and recommendation mode [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/013-code-graph-hook-improvements/spec.md:76-81].
- CF-009 closed the staged-persistence hole by routing manual scan persistence through `persistIndexedFileResult()`, so pt-02 should look for residual freshness or metadata issues that survive the staged write path [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/applied/CF-009.md:5-12].
- CF-010 unified query trust mapping around detector provenance, which means new findings should look for other surfaces that still bypass or dilute the shared readiness contract [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/applied/CF-010.md:5-13].
- CF-014 moved child-phase research artifacts onto a canonical packet root, so pt-02 should not spend time on artifact-root drift unless a new downstream consumer still assumes the pre-fix layout [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/applied/CF-014.md:5-13].
- Pt-01's findings registry left the most actionable open lanes in correctness, freshness, observability, and cross-runtime transport rather than introducing a broader architecture rewrite agenda [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/028-code-graph-hook-improvements-pt-01/findings-registry.json:26-125].
- Startup-brief builder tests already assert that a structured `sharedPayload` exists at the builder layer, so transport loss is likely happening in runtime adapters rather than the builder itself [.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:64-81].
- The live startup docs still frame SessionStart as a shared runtime capability, which raises the bar for any remaining text-only or runtime-specific degradation across adapters [.opencode/skill/system-spec-kit/references/config/hook_system.md:35-45,64-78].

## Initial Hypotheses

1. Read-path handlers still treat `allowInlineFullScan: false` as a soft hint instead of a hard gate, which can yield misleading empty or stale outputs.
   How to test: inspect `query.ts` and `context.ts` control flow after `ensureCodeGraphReady()` and compare against unit coverage.
2. The CocoIndex-to-code-graph bridge still discards semantic ranking context, causing anchor resolution quality loss even when the graph lookup succeeds.
   How to test: inspect `seed-resolver.ts` seed shapes, resolution order, and sorting logic.
3. Scan-time metadata can go stale even after CF-009 because post-scan summary persistence is not symmetric for empty vs non-empty summaries.
   How to test: inspect `scan.ts` summary writes, `code-graph-db.ts` metadata setters/getters, and unit tests.
4. Persisted provenance/enrichment summaries are still effectively write-only and not consumable by operators.
   How to test: trace getters/readers into `getStats()`, `status.ts`, `startup-brief.ts`, and docs/tests.
5. Startup transport still down-converts the builder's structured graph payload and lacks adapter-level regression coverage.
   How to test: compare `startup-brief.ts` with runtime adapters and runtime hook tests.
6. The context deadline contract remains partial enough to produce unlabeled truncation or inconsistent boundedness.
   How to test: inspect `code-graph-context.ts`, handler wiring, and test expectations.
7. Docs and smoke tests may still encode a text-only startup contract, which would make future structured transport changes fragile.
   How to test: inspect `hook_system.md`, runtime READMEs, and startup hook test files.

## Iteration Plan

1. Re-anchor on pt-01, the parent packet, and the closed CF set so residual work stays net-new.
2. Validate whether query/context read paths gate correctly when full scans are required but suppressed.
3. Audit the CocoIndex seed bridge and graph anchor resolution fidelity.
4. Inspect scan-time summary persistence and look for stale metadata behavior after successful scans.
5. Trace whether persisted detector/enrichment summaries have any production readers.
6. Follow startup builder output into Claude, Gemini, Copilot, and Codex adapters plus their tests.
7. Revisit the context deadline/truncation contract and confirm whether bounded-work claims are real.
8. Compare docs, READMEs, and runtime-specific transport surfaces to identify operator-facing drift.
9. Re-check earlier hypotheses, close dead ends, and make sure no finding just rephrases pt-01 or a closed CF.
10. Run a convergence pass, collapse duplicates, and prepare synthesis-ready recommendations.

## Risks and Mitigations

- Risk: accidentally restating pt-01 findings without raising the evidence bar.
  Mitigation: treat pt-01 as known context and require either deeper code-level evidence or a distinct downstream residual before carrying a theme forward.
- Risk: mixing code-graph gaps with zero-calls or unrelated CocoIndex infrastructure.
  Mitigation: keep every finding tied to in-scope files and bridge/runtime behavior only.
- Risk: over-weighting docs/tests over production behavior.
  Mitigation: only promote docs/test drift when it masks or locks in a production-facing contract gap.
- Risk: relying on unavailable semantic search tooling.
  Mitigation: document the attempted tool path in methodology if needed and ground findings in direct source reads and line-cited evidence.
