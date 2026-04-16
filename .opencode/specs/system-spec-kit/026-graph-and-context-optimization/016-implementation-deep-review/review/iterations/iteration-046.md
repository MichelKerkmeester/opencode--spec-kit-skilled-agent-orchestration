# Iteration 46 - test-quality - tests

## Dispatcher
- iteration: 46 of 50
- dispatcher: cli-copilot gpt-5.4 high (code review v1)
- timestamp: 2026-04-16T06:34:43.006Z

## Files Reviewed
- `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/copilot-hook-wiring.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/create-record-identity.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/embeddings.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/follow-up-api.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/gate-d-benchmark-memory-search.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/gate-d-benchmark-session-resume.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/gate-d-benchmark-trigger-fast-path.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/archive/coverage-graph-db.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/archive/coverage-graph-tools.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tools/types.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts`

## Findings - New
### P0 Findings
- None.

### P1 Findings
- **`context-server.vitest.ts` validates a shadow copy of `parseArgs()` and source text instead of the shipped parser.** The suite defines its own local `parseArgs` implementation and exercises that replica for the behavioral cases (`.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:77-150`), while the checks against the real module are mostly regex scans over source text (`.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:83-97`, `.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:217-259`). The production implementation in `tools/types.ts` already contains a real null/non-object guard (`.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:10-16`), but this suite never imports and exercises that boundary behavior, so a regression in the actual protocol guard can slip through while the test stays green.

```json
{
  "claim": "The context-server suite gives false confidence for parseArgs because its behavioral assertions target a locally redefined helper and its real-module checks are source-text regexes, not runtime execution of the shipped parser.",
  "evidenceRefs": [
    ".opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:77-150",
    ".opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:83-97",
    ".opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:217-259",
    ".opencode/skill/system-spec-kit/mcp_server/tools/types.ts:10-16"
  ],
  "counterevidenceSought": "Looked for any direct import-and-call coverage of parseArgs or assertions for the null/non-object guard branch in the reviewed context-server suite and did not find one.",
  "alternativeExplanation": "The authors may have intentionally used source-shape tests because parseArgs is tiny and protocol-boundary casts are considered stable implementation detail.",
  "finalSeverity": "P1",
  "confidence": 0.97,
  "downgradeTrigger": "Downgrade to P2 if another reviewed suite directly exercises the exported parseArgs function, including the null/non-object guard branch, so this file is only redundant rather than the primary coverage."
}
```

- **The Gate D latency benchmarks time mocked facsimiles, not the canonical hot paths they claim to guard.** The memory-search benchmark replaces the pipeline, formatter, cache, intent, session, eval, and feedback dependencies before measuring p95 (`.opencode/skill/system-spec-kit/mcp_server/tests/gate-d-benchmark-memory-search.vitest.ts:13-143`, `.opencode/skill/system-spec-kit/mcp_server/tests/gate-d-benchmark-memory-search.vitest.ts:170-195`). The session-resume benchmark similarly mocks graph freshness, graph stats, context metrics, and hook state before enforcing its latency budget (`.opencode/skill/system-spec-kit/mcp_server/tests/gate-d-benchmark-session-resume.vitest.ts:11-41`, `.opencode/skill/system-spec-kit/mcp_server/tests/gate-d-benchmark-session-resume.vitest.ts:131-161`). The trigger fast-path benchmark also replaces the DB, vector store, cognitive layers, envelope builder, and telemetry before timing the handler (`.opencode/skill/system-spec-kit/mcp_server/tests/gate-d-benchmark-trigger-fast-path.vitest.ts:26-104`, `.opencode/skill/system-spec-kit/mcp_server/tests/gate-d-benchmark-trigger-fast-path.vitest.ts:171-195`). Those budgets therefore only validate wrapper overhead under fixtures, not the real Gate D search/resume/trigger pipelines named in the test titles.

```json
{
  "claim": "The three Gate D benchmark suites do not provide a reliable performance gate for the shipped canonical paths because they benchmark handlers with most expensive dependencies mocked out.",
  "evidenceRefs": [
    ".opencode/skill/system-spec-kit/mcp_server/tests/gate-d-benchmark-memory-search.vitest.ts:13-143",
    ".opencode/skill/system-spec-kit/mcp_server/tests/gate-d-benchmark-memory-search.vitest.ts:170-195",
    ".opencode/skill/system-spec-kit/mcp_server/tests/gate-d-benchmark-session-resume.vitest.ts:11-41",
    ".opencode/skill/system-spec-kit/mcp_server/tests/gate-d-benchmark-session-resume.vitest.ts:131-161",
    ".opencode/skill/system-spec-kit/mcp_server/tests/gate-d-benchmark-trigger-fast-path.vitest.ts:26-104",
    ".opencode/skill/system-spec-kit/mcp_server/tests/gate-d-benchmark-trigger-fast-path.vitest.ts:171-195"
  ],
  "counterevidenceSought": "Looked for an unmocked end-to-end benchmark path or any assertion that validates real pipeline work (DB access, routing, cognitive layers, graph freshness) within the benchmark loops and did not find one.",
  "alternativeExplanation": "These may be intended as deterministic microbenchmarks of handler shell overhead rather than end-to-end performance tests.",
  "finalSeverity": "P1",
  "confidence": 0.95,
  "downgradeTrigger": "Downgrade to P2 if the project documents these suites as microbenchmarks only and keeps separate end-to-end latency gates for the actual Gate D flows."
}
```

### P2 Findings
- **The only remaining coverage-graph suites in this slice are archived contract stubs, not live handler tests.** The requested live paths no longer exist under `tests/`; the surviving files are under `tests/archive/` and explicitly describe themselves as contract placeholders for an implementation that would be wired later (`.opencode/skill/system-spec-kit/mcp_server/tests/archive/coverage-graph-db.vitest.ts:11-17`, `.opencode/skill/system-spec-kit/mcp_server/tests/archive/coverage-graph-tools.vitest.ts:11-17`). Their assertions mostly validate hand-constructed literals and schema shapes rather than invoking coverage-graph handlers (`.opencode/skill/system-spec-kit/mcp_server/tests/archive/coverage-graph-db.vitest.ts:42-83`, `.opencode/skill/system-spec-kit/mcp_server/tests/archive/coverage-graph-tools.vitest.ts:47-85`, `.opencode/skill/system-spec-kit/mcp_server/tests/archive/coverage-graph-tools.vitest.ts:169-186`), so they are weak evidence for current implementation behavior.

## Traceability Checks
- The reviewed Gate D benchmark files do **not** match the spec intent of guarding canonical path latency: they enforce budgets on heavily mocked handler scaffolding rather than the actual search, resume, and trigger pipelines.
- `content-router.vitest.ts` **does** match implementation intent well: it instantiates `createContentRouter()` and exercises real tier-1/2/3 classification behavior, refusal paths, and cache behavior instead of asserting source text.
- `create-record-identity.vitest.ts` also tracks the shipped contract accurately by using real helper calls plus in-memory SQLite rows to verify canonical doc-anchor identity selection and continuity routing.
- The suggested coverage-graph filenames have drifted from the live tree into `tests/archive/`, so the iteration focus list no longer maps 1:1 onto the current active test layout.

## Confirmed-Clean Surfaces
- `content-router.vitest.ts` provides meaningful behavior coverage for routed save classification, including refusal defaults, phase-anchor inference, Tier 3 fallback, and cache-hit behavior.
- `create-record-identity.vitest.ts` exercises real create-record helpers against SQLite fixtures and verifies canonical identity routing across legacy, continuity, and routed-save cases.
- `cross-encoder-extended.vitest.ts` covers provider failures, fallback scoring, and response-shape assertions that the lighter `cross-encoder.vitest.ts` omits.
- `embeddings.vitest.ts` meaningfully exercises provider resolution, fail-fast validation, warmup fallback metadata, and startup profile path derivation.
- `follow-up-api.vitest.ts` checks both success and throw paths for enrichment backfill environment restoration, which is the failure-prone part of that wrapper API.

## Next Focus
- Inspect the non-benchmark search/resume/trigger integration suites next so iteration 47 can confirm whether there is any real end-to-end coverage for the hot paths that the Gate D benchmark files currently abstract away.
