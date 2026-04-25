# Iteration 6 - Edge Weight Drift + Symbol Resolution Failures

## Summary

Q7 is answered: current code-graph edge weights are hard-coded literals in the scanner, persisted as `code_edges.weight`, duplicated into `metadata.confidence`, and only filtered at read time for blast-radius via `minConfidence`; there is no post-deploy tuning surface for the producer weights. Drift should therefore be detected with measurable scan-time and query-time telemetry rather than subjective inspection: compare edge-type distribution, confidence distribution, gold-query top-K pass rate, and blast-radius import coverage against baselines after each full scan.

Q8 is answered: the current resolver stack has a structural producer/consumer mismatch. `extractEdges()` resolves imports, exports, calls, type refs, decorators, overrides, and implements relationships only against nodes in the same parse result; consumers such as `queryFileImportDependents()` and blast-radius traversal expect cross-file `IMPORTS` edges. Current code contains reproducible broken cases for cross-module static imports, dynamic imports, path aliases, type-only imports under regex fallback, re-export barrels, and default-import aliasing. Decorator-mutated names are not currently reproducible in the reviewed `mcp_server` sources because no decorator sites were found, but the resolver is limited to same-file decorator symbols and does not model wrapper-renamed exports.

## Edge Weight Catalog

| Edge / confidence surface | Current value | How it is set | Tunable today? | Evidence |
|---|---:|---|---|---|
| `CONTAINS` | `1.0` | Hard-coded in `extractEdges()` for class -> method edges and mirrored to `metadata.confidence`. | No | `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:895-905` |
| `IMPORTS` | `1.0` | Hard-coded for import-node -> same-file target-node matches. | No | `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:909-920` |
| `EXPORTS` | `1.0` | Hard-coded for same-file exported symbol -> export capture. | No | `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:922-933` |
| `EXTENDS` | `0.95` | Hard-coded for class -> parent class when parent resolves by name in the same parse result. | No | `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:935-947` |
| `IMPLEMENTS` | `0.95` | Hard-coded for class -> interface/type/import when the interface resolves by name in the same parse result. | No | `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:950-965` |
| `CALLS` | `0.8` | Hard-coded for regex call-name matches in function/method bodies; metadata marks `detectorProvenance:'heuristic'` and `evidenceClass:'INFERRED'`. | No | `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:967-997`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:154-184` |
| `DECORATES` | `0.9` | Hard-coded for decorator symbol -> decorated symbol when the decorator name resolves in the same parse result. | No | `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1000-1020` |
| `OVERRIDES` | `0.9` | Hard-coded for method -> parent method by walking `extendsName` captures in the same parse result. | No | `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1022-1046` |
| `TYPE_OF` | `0.85` | Hard-coded for symbol -> type reference when the type resolves in the same parse result. | No | `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1048-1069` |
| `TESTED_BY` | `0.6` | Hard-coded in `finalizeIndexResults()` using filename heuristic `.test` / `.spec` / `.vitest`; metadata marks `AMBIGUOUS`. | No | `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1357-1377` |
| DB default | `1.0` | SQLite schema default for `code_edges.weight`; actual inserts pass explicit weights. | Schema default only | `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:86-92`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:358-375` |
| Read-path confidence filter | caller-supplied `0..1` | `minConfidence` filters blast-radius dependency edges by `metadata.confidence ?? weight`. | Yes, per query only | `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:582-584`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:817-862` |
| Seed resolution confidence | exact `1.0`, near-exact `0.95 - 0.02*distance`, enclosing `0.7`, file anchor `0.3`, manual exact `0.9`, miss `0.1` | Hard-coded in `seed-resolver.ts`; separate from edge weights but affects graph-context anchor trust. | No | `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/seed-resolver.ts:113-168`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/seed-resolver.ts:218-327`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-seed-resolver.vitest.ts:39-74` |

Current values are not loaded from config. `IndexerConfig` only exposes root, include/exclude globs, size, and languages; edge weights are not part of that contract. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:73-80`]

## Drift Detection Proposal

1. **Scan-time edge mix baseline**
   - After every trusted full scan, persist or emit:
     - `COUNT(*) BY edge_type`
     - `AVG(weight), MIN(weight), MAX(weight) BY edge_type`
     - `AVG(json_extract(metadata,'$.confidence')) BY edge_type`
     - cross-file ratio by edge type: `source.file_path != target.file_path`
   - Drift rule: flag when any edge type's share changes by `> 30% relative` or `> 5 percentage points absolute` versus the last trusted full-scan baseline, or when a previously non-zero edge type drops to zero.
   - Rationale: this catches parser/backend changes that silently demote `CALLS`, `TYPE_OF`, or `IMPORTS` from useful signals into sparse/noisy channels.

2. **Gold-query top-K pass rate by edge focus**
   - Reuse iteration 4's gold queries and record pass/fail per `edge_focus` (`define`, `import`, `call`, `ref`).
   - Drift rule: block trust promotion if overall pass rate drops below `90%`, or if any edge-focus bucket drops below `80%`, or if an expected symbol disappears from top K for two consecutive scans.
   - Rationale: static distribution drift can miss semantic damage; the gold battery catches user-visible ranking/retrieval regression. [SOURCE: `research/iterations/iteration-004.md:11-57`; `research/deltas/iteration-004.json:4-323`]

3. **Blast-radius import coverage sentinel**
   - Measure `cross_file_import_edges / static_import_declarations_seen`. Today this is expected to be weak because producer resolution is same-file only, but once fixed it becomes the main drift canary for import resolver regressions.
   - Drift rule: after a baseline is established, flag if the ratio falls by `> 20% relative` or below an absolute floor agreed for the repo.
   - Rationale: `queryFileImportDependents()` and blast-radius traversal depend on cross-file `IMPORTS` edges, so import coverage drift has direct safety impact. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:602-612`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:829-862`]

4. **Confidence calibration by evidence class**
   - Track the weakest returned edge confidence per relationship query payload and compare it with edge metadata distribution.
   - Drift rule: flag if `heuristic/INFERRED` edges exceed `50%` of returned relationship payloads for gold queries that should be direct/extracted, or if average returned confidence shifts by `> 0.15`.
   - Rationale: query tests already aggregate payload trust from the weakest returned edge, so this metric maps directly onto output confidence behavior. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-query-handler.vitest.ts:637-683`]

5. **Statistical drift score**
   - Compute Jensen-Shannon divergence or PSI over normalized `edge_type` and `edge_type + evidenceClass` distributions.
   - Drift rule: warn at PSI `>= 0.10`, require review at `>= 0.25`; warn at JSD `>= 0.10`.
   - Rationale: the edge mix is categorical and low-cardinality, so these are cheap and stable enough for a doctor command without per-symbol model training.

## Resolver Failure Catalog

| Failure mode | Current behavior / broken case | Evidence |
|---|---|---|
| Cross-module TS/JS imports | Broken for actual dependency edges. `extractEdges()` builds `nodesByName` only from `nodes` passed for the current parse result, then resolves `IMPORTS` via `preferredKinds(imp.name, ...)` against that same map. Current source imports `isFileStale` from `./code-graph-db.js`, while the target function is defined in a different file; that import cannot produce the cross-file edge expected by `queryFileImportDependents()`. | `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:857-872`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:909-920`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:10-21`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:380-388`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:602-612` |
| Path aliases | Broken because parser captures imported names but discards module specifier path, and no resolver reads `tsconfig.paths`. The repo has `@spec-kit/shared/*` path alias config and current imports from `@spec-kit/shared/embeddings/factory`, but the scanner has no module-specifier -> file-path resolution step. | `.opencode/skill/system-spec-kit/mcp_server/tsconfig.json:12-15`; `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:70-74`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:340-397`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:485-502` |
| Dynamic imports | Broken for import/dependency graph. Current code has `await import('./tree-sitter-parser.js')` and `await import('web-tree-sitter')`; the regex fallback static import extractor does not match those lines, and the call extractor sees `import(` only as a call name with no resolvable target. Probe result using the current regexes: dynamic import produced `staticImport:null`, `namedExport:null`, `calls:["import"]`. | `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:756-776`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:51-60`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:485-502`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:967-997` |
| Decorator-mutated names | Not reproducible in the reviewed `mcp_server` sources because `rg '^\\s*@\\w+|@\\w+\\(' .opencode/skill/system-spec-kit/mcp_server --glob '*.ts'` found no decorator sites. Latent failure remains: decorators are captured by decorator identifier, `DECORATES` resolves only if that decorator symbol exists in the same parse result, and the decorated symbol keeps its original declared name even if the decorator wraps/renames it at runtime. | `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:243-260`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:521-534`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1000-1020` |
| Type-only imports | Backend-dependent gap. Current code has `import type { EdgeType } ...`; the regex fallback import matcher does not match `import type { ... }`, and even tree-sitter import captures are represented as import symbols rather than pure `TYPE_OF` edges to external definitions. Probe result using the current fallback regex: type-only import produced `staticImport:null`, `namedExport:null`, `calls:[]`. | `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:8`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:485-502`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:483-488`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1048-1069` |
| Re-exports / barrel files | Broken for star exports and incomplete for named re-exports. Current `lib/index.ts` uses `export * from './indexer-types.js'` and other barrels; neither tree-sitter `emitExportCaptures()` nor regex export matching records the source module path for `export *`, so there is no edge from the barrel to the exported module/symbol. Current `handlers/index.ts` named re-exports match `export { ... }`, but the source `from './scan.js'` is discarded. Probe result using current regexes: `export *` produced no export match; named re-export produced only the local exported name. | `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/index.ts:4-15`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/index.ts:4-11`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:399-465`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:504-517` |
| Default imports vs named exports | Partially captured but not resolved. Current `code-graph-db.ts` imports default `Database` from `better-sqlite3`; the fallback regex captures the local alias `Database` but not a target exported symbol or module node, so it cannot distinguish default export identity from an arbitrary named symbol. | `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:7`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:485-502` |
| Ambiguous subject names | Query-time subject resolution is safer than producer resolution: it tries symbol ID, `fq_name`, then `name`, ranks by operation edge count and callable kind, and emits an ambiguous-subject warning. This is not a failure but should remain a gold-query guard because producer-side duplicate names can still make relationship answers surprising. | `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:177-211`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:259-320`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:323-391` |

Existing resolver tests leave these gaps uncovered. `code-graph-indexer.vitest.ts` checks a single simple named import and edge metadata, `code-graph-seed-resolver.vitest.ts` checks near-exact/file-anchor seed resolution, and query-handler tests check confidence/dangling-edge behavior; none exercise dynamic import, path alias resolution, `export *`, type-only import classification, or cross-file import linking. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:111-117`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:154-184`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-seed-resolver.vitest.ts:39-74`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-query-handler.vitest.ts:637-735`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-query-handler.vitest.ts:994-1025`]

## Files Reviewed

- `research/deep-research-strategy.md:1-80`
- `research/deep-research-state.jsonl:1-7`
- `research/iterations/iteration-001.md:1-76`
- `research/iterations/iteration-002.md:1-75`
- `research/iterations/iteration-003.md:1-187`
- `research/iterations/iteration-004.md:1-180`
- `research/iterations/iteration-005.md:1-76`
- `research/deltas/iteration-004.json:1-323`
- `research/deltas/iteration-005.json:1-159`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:1-95`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1-130`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:130-620`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:700-850`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:850-1085`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1320-1385`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:1-560`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/seed-resolver.ts:1-380`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:50-120`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:355-388`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:602-618`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:760-825`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:70-460`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:800-880`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:1-260`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-seed-resolver.vitest.ts:1-220`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-query-handler.vitest.ts:620-735`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-query-handler.vitest.ts:990-1025`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-context-handler.vitest.ts:420-470`
- `.opencode/skill/system-spec-kit/mcp_server/tsconfig.json:1-32`
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:68-78`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/index.ts:1-13`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/index.ts:1-16`

## Convergence Signals

- newFindingsRatio: 0.70
- research_questions_answered: ["Q7", "Q8"]
- dimensionsCovered: ["edge-weight-catalog", "drift-detection", "cross-module-import-resolution", "dynamic-import-resolution", "path-alias-resolution", "type-only-imports", "re-export-barrels", "default-import-aliasing", "test-coverage-gaps"]
- novelty justification: This iteration adds the first complete edge-weight/confidence catalog, identifies that weights are not tunable post-deploy, proposes concrete PSI/JSD + gold-query + blast-radius coverage drift metrics, and ties resolver failures to current source lines and parser probe results.
- remaining gaps: Iteration 7 should fold drift metrics into the confidence-floor/self-healing policy and decide whether resolver failures are doctor warnings, gold-query failures, or implementation prerequisites for trustworthy blast-radius answers.
