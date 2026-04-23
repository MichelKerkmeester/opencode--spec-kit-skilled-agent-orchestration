# Deep Research — 003-code-graph-package

## Summary
This investigation focused on production readiness and contract integrity for the self-contained `code-graph` package under `.opencode/skill/system-spec-kit/mcp_server/code-graph/`. The highest-risk issue is that the manual `code_graph_scan` path bypasses the staged persistence discipline already added to `ensure-ready`, so write failures can still mark broken files fresh and hide stale structural data. A second cluster of issues sits at the API boundary: `unionMode` is implemented but unreachable through schema validation, and `code_graph_context` accepts richer seed shapes than its schema allows. The trust surface also overstates parser confidence by hardcoding `parserProvenance: ast` for fresh and stale query responses even when the last persisted detector provenance is `structured`. Lower-severity findings cover stale-cache scoping, selective-reindex efficiency, freshness drift across surfaces, residual dangling-edge debt after dedup, and docs/test coverage gaps.

## Scope
Investigated:
- The phase packet docs for `003-code-graph-package` and its nested sub-packets, especially the self-contained package migration and the context/scan-scope remediation work.
- Runtime code under `.opencode/skill/system-spec-kit/mcp_server/code-graph/`, plus the shared `session-snapshot` and `shared-payload` helpers the package depends on.
- Schema and tool-definition surfaces in `schemas/tool-input-schemas.ts` and `tool-schemas.ts`.
- Existing Vitest coverage for scan, query, context, readiness, and tool-schema parity.

Not modified:
- Any runtime code outside the packet’s `research/` directory.
- Any sibling phase research folders.

Investigation note:
- CocoIndex semantic search was attempted twice for unfamiliar-code discovery, but the MCP call returned `user cancelled MCP tool call`, so the final analysis relied on direct code reads plus targeted grep.

## Key Findings
### P0
- **F-001 — `code_graph_scan` reintroduced the stale-reader persistence bug that `ensure-ready` already fixed.**
  Evidence: [iteration-01.md](./iterations/iteration-01.md) shows `ensure-ready` stages `file_mtime_ms=0` until nodes and edges persist, while `handlers/scan.ts` writes the real mtime before structural writes and then swallows persistence errors. That can mark a file fresh even when its node/edge rows never landed.

### P1
- **F-002 — Query trust metadata can falsely claim AST-backed confidence.**
  Evidence: [iteration-06.md](./iterations/iteration-06.md) shows `handlers/query.ts` hardcodes `parserProvenance: 'ast'` for fresh and stale responses, while the same response path can expose `graphMetadata.detectorProvenance: 'structured'`.
- **F-003 — Multi-file blast-radius union mode is implemented but unreachable through validated MCP inputs.**
  Evidence: [iteration-02.md](./iterations/iteration-02.md) ties `handlers/query.ts` and `code-graph-query-handler.vitest.ts` to a runtime `unionMode: 'multi'` branch, while `tool-input-schemas.ts` and `tool-schemas.ts` omit the field entirely.
- **F-004 — `code_graph_context` loses seed provenance because the schema is narrower than the handler interface.**
  Evidence: [iteration-03.md](./iterations/iteration-03.md) shows `source`, `kind`, `nodeId`, and `snippet` are accepted by `handlers/context.ts` but absent from `codeGraphSeedSchema`.
- **F-005 — `ensure-ready` debounce caching is globally scoped and not keyed by workspace or options.**
  Evidence: [iteration-04.md](./iterations/iteration-04.md) shows a single cached readiness result is reused for five seconds regardless of `rootDir`, `allowInlineIndex`, or `allowInlineFullScan`.
- **F-006 — Selective reindex still walks the full tree because exact stale-file paths are fed into a glob walker that only understands extension globs.**
  Evidence: [iteration-05.md](./iterations/iteration-05.md) compares `ensure-ready.ts` with `structural-indexer.ts` and shows the filesystem walk remains repo-wide even when parse work is stale-file-only.

### P2
- **F-007 — Freshness semantics drift across query/context/startup surfaces.**
  Evidence: [iteration-08.md](./iterations/iteration-08.md) shows `code_graph_context.metadata.freshness` is age-based, while `readiness` is mtime/git-head based.
- **F-008 — Detector provenance vocabulary is internally split between stored `structured` values and payload-layer `regex` translation.**
  Evidence: [iteration-07.md](./iterations/iteration-07.md) compares the runtime emitter with the shared payload mapper and packet docs.
- **F-009 — Cross-file dedup reduces crashes but still permits dangling-edge debt.**
  Evidence: [iteration-09.md](./iterations/iteration-09.md) shows `TESTED_BY` edges are built before dedup and DB insert-ignore can still leave edge rows whose source node was skipped.
- **F-010 — Package documentation and regression nets lag the current runtime shape.**
  Evidence: [iteration-10.md](./iterations/iteration-10.md) highlights stale parser docs and missing tests for schema parity and scan staging.

## Evidence Trail
- [iteration-01.md](./iterations/iteration-01.md): "manual scans can still mark broken files fresh" based on `ensure-ready.ts:198-233` versus `handlers/scan.ts:213-228`.
- [iteration-02.md](./iterations/iteration-02.md): "runtime supports unionMode, schemas do not" based on `handlers/query.ts:689-729`, `tool-input-schemas.ts:452-460`, and `tool-schemas.ts:570-585`.
- [iteration-03.md](./iterations/iteration-03.md): "validated context seeds cannot carry all handler-supported provenance fields" based on `handlers/context.ts:16-30` and `tool-input-schemas.ts:462-476`.
- [iteration-04.md](./iterations/iteration-04.md): "ensure-ready cache is not keyed by root or options" based on `ensure-ready.ts:256-268`.
- [iteration-05.md](./iterations/iteration-05.md): "selective refresh narrows parse work more than discovery work" based on `ensure-ready.ts:324-329` and `structural-indexer.ts:1185-1233`.
- [iteration-06.md](./iterations/iteration-06.md): "query trust surface overstates AST provenance" based on `handlers/query.ts:198-212`, `readiness-contract.ts:119-135`, and `shared-payload.ts:612-620`.
- [iteration-08.md](./iterations/iteration-08.md): "freshness means different things on the same response envelope" based on `handlers/context.ts:178-215` and `code-graph-context.ts:162-175`.
- [iteration-09.md](./iterations/iteration-09.md): "dedup is crash-proofing, not full integrity repair" based on `structural-indexer.ts:1268-1309` and `code-graph-db.ts:306-356`.

## Recommended Fixes
- **[P0][correctness] Unify scan persistence through one staged writer.**
  Scope: `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/ensure-ready.ts`.
  Change: Extract the three-stage `upsertFile(mtime=0) -> replaceNodes/replaceEdges -> finalize real mtime` flow into a shared helper and make both manual scan and inline refresh use it.
- **[P1][correctness] Derive query `parserProvenance` from persisted detector provenance instead of hardcoding `ast`.**
  Scope: `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts`, `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts`.
  Change: Use `getLastDetectorProvenance()` plus `detectorProvenanceToParserProvenance()`; fall back to `unknown` when provenance is absent.
- **[P1][architecture] Bring tool schemas into parity with runtime query/context handlers.**
  Scope: `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`, `.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts`.
  Change: Add `unionMode` to `code_graph_query`; add `source`, `kind`, `nodeId`, and any intentionally supported seed fields to `codeGraphSeedSchema`; add explicit tests.
- **[P1][performance] Replace stale-file `includeGlobs` overloading with a direct file-list refresh path.**
  Scope: `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/ensure-ready.ts`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts`.
  Change: Add an `indexSpecificFiles()` helper or allow `indexFiles()` to accept explicit file lists so selective refresh no longer traverses the full tree.
- **[P1][architecture] Key the ensure-ready debounce cache by request shape.**
  Scope: `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/ensure-ready.ts`, `.opencode/skill/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts`.
  Change: Cache by `{rootDir, allowInlineIndex, allowInlineFullScan}` and add regression coverage for cross-root and cross-option calls.
- **[P2][correctness] Collapse or clarify freshness vocabularies.**
  Scope: `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-context.ts`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/startup-brief.ts`, `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts`.
  Change: Either rename timestamp-age metadata to `scanAge` or derive it from the canonical readiness block instead of a parallel freshness ladder.
- **[P2][docs] Refresh package README/library README to match the post-migration runtime and renumbered phase packets.**
  Scope: `.opencode/skill/system-spec-kit/mcp_server/code-graph/README.md`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/README.md`.
  Change: Remove “tree-sitter planned” language, align packet references with `003-code-graph-context-and-scan-scope`, and document the schema-parity caveats if fixes are deferred.

## Convergence Report
The loop did not early-stop because each pass continued to uncover materially distinct contract failures or production-readiness risks; `newInfoRatio` stayed above `0.05` for all 10 iterations. The biggest information jumps came in iterations 1, 2, 3, and 6 because they exposed bugs that are not merely documentation drift:
- Iteration 01 contributed the highest-severity production finding by comparing scan-path persistence against the staged inline-refresh writer.
- Iteration 02 and iteration 03 exposed schema/runtime mismatches that make documented capabilities unreachable or lossy.
- Iteration 06 showed the trust payload violating the package’s own parser-provenance contract.

Later iterations were still useful but increasingly convergent, mostly tightening coherence, performance, and observability concerns rather than discovering new top-level failure classes.

## Open Questions
- Which of the P1 issues should block rollout together with the P0 scan-staging defect?
- Should detector provenance stay four-valued on the detector axis, or should `structured`/`regex` be collapsed into one canonical runtime value?
- Is there an existing downstream consumer that depends on `code_graph_context.metadata.freshness.staleness`, which would make that cleanup a compatibility change?
- Do operators want dangling-edge telemetry added to scan/status surfaces, or are query warnings sufficient for now?
- Should CocoIndex availability be treated as a hard dependency for future graph-context workflows, given the semantic search MCP call was unavailable during this research run?

## References
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-code-graph-package/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-code-graph-package/001-code-graph-upgrades/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-code-graph-package/002-code-graph-self-contained-package/implementation-summary.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-code-graph-package/003-code-graph-context-and-scan-scope/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-code-graph-package/003-code-graph-context-and-scan-scope/003-cross-file-dedup-defense/implementation-summary.md`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/ensure-ready.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/tree-sitter-parser.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/readiness-contract.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-context.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/status.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts`
- `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-query-handler.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-context-handler.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-scan.vitest.ts`
