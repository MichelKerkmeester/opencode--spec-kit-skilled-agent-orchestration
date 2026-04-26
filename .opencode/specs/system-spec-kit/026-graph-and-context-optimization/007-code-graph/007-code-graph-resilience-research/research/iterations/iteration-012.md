# Iteration 12 - Verification Harness + Backend Implementation Roadmap

## Summary

Iteration 12 answers Q15A-Q15D and closes the extended backend-design pass. The right harness shape is a reusable verification library plus a new `code_graph_verify` MCP tool, with scan/status/self-heal reading its persisted result instead of embedding verification in the scan handler. One evidence gap matters: `research/iterations/iteration-008.md` through `iteration-011.md` are absent in this packet, so this roadmap synthesizes the saved iteration 8-11 prompts, iteration 6/7 findings, and fresh source citations from the current backend rather than pretending those markdown files exist.

The main correction is that `assets/code-graph-gold-queries.json` is not directly executable by today's `code_graph_query` signature. The asset stores natural-language `query` strings and `expected_top_K_symbols`, while `code_graph_query` currently requires `operation` plus `subject` and supports only `outline`, relationship, and `blast_radius` operations. The implementation packet must therefore add a verifier adapter that either derives outline checks from `source_file:line` or introduces a battery v2 normalization layer before treating pass rates as a trust gate.

## Harness Design

**Location decision:** add a library at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/gold-query-verifier.ts`, a handler at `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/verify.ts`, and a registered MCP tool named `code_graph_verify`. A standalone CLI script can be a thin wrapper later, but the MCP tool should be the primary runtime because the rest of the code-graph surface is already registered through the code_graph tool dispatcher. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/tools/code-graph-tools.ts:19-29`; `.opencode/skill/system-spec-kit/mcp_server/tools/index.ts:84-110`]

**Proposed MCP signature:**

```ts
interface VerifyArgs {
  rootDir?: string;
  batteryPath?: string;
  category?: 'mcp-tool' | 'cross-module' | 'exported-type' | 'regression-detection';
  failFast?: boolean;
  includeDetails?: boolean;
  persistBaseline?: boolean;
  allowInlineIndex?: boolean;
}
```

`allowInlineIndex` should default to `false`. Verification should check readiness but should not silently repair the graph; self-heal can call verification after an allowed scan, not before.

**Execution flow:**

1. Load and validate `assets/code-graph-gold-queries.json` with `schema_version`, `pass_policy`, and `queries[]`. The current asset has 28 entries and pass floors of 0.90 overall and 0.80 for edge-focused buckets. [SOURCE: `assets/code-graph-gold-queries.json:1-10`; `assets/code-graph-gold-queries.json:10-235`]
2. Run `ensureCodeGraphReady(rootDir, { allowInlineIndex: false, allowInlineFullScan: false })`. If freshness is not `fresh`, return `status:"blocked"` with readiness, matching `detect_changes` safety semantics. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:245-264`]
3. For asset v1 entries, derive a file outline probe from `source_file:line`: call the existing query handler with `{ operation: 'outline', subject: sourceFile, limit: 200 }`, then compare returned `nodes[].name` and `nodes[].fqName` against `expected_top_K_symbols`. The handler already returns outline nodes with `name`, `kind`, `fqName`, `line`, `signature`, and `symbolId`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:1097-1133`]
4. For future asset v2 entries, support explicit executable probes such as `{ operation, subject, expectedSymbolsPath }`. This removes guesswork and lets relationship canaries exercise `calls_from`, `imports_to`, and `blast_radius`, which are already supported by the schema. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:570-588`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:1368-1435`]
5. Emit per-query results and aggregate rates: `passed`, `failed`, `blocked`, `overallPassRate`, `categoryPassRates`, `missingSymbols`, `unexpectedErrors`, `passPolicy`, and `readiness`.
6. Persist the latest verification summary in `code_graph_metadata` under `last_gold_verification` and optionally `last_gold_verification_at`; the metadata table already supports arbitrary key/value rows. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:99-103`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:190-204`]

**Partial failure reporting:** report both per-query and aggregate failures. Aggregate-only hides which symbol disappeared; per-query-only makes self-heal/status gating too expensive to consume. Each failed query should include `id`, `category`, `query`, `probe`, `expected_top_K_symbols`, `matchedSymbols`, `missingSymbols`, `source_file:line`, and `reason`.

## Wiring Points

1. **MCP registration:** add `codeGraphVerify` to `tool-schemas.ts`, include it in `TOOL_DEFINITIONS`, import/export `handleCodeGraphVerify`, include `code_graph_verify` in `TOOL_NAMES`, and dispatch it in `handleTool`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:554-647`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:915-920`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/index.ts:4-11`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/tools/code-graph-tools.ts:5-14`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/tools/code-graph-tools.ts:19-29`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/tools/code-graph-tools.ts:58-96`]
2. **Scan:** after `handleCodeGraphScan` persists results and builds `lastPersistedAt`, call the verifier only when the scan is a full scan or `persistBaseline`/`verify` is requested. Do not call it before persistence completes because `persistIndexedFileResult()` stages rows and finalizes mtime only after nodes and edges land. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:186-245`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:247-287`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:227-248`]
3. **Status:** extend `code_graph_status` with `lastGoldVerification`, `goldVerificationTrust`, and `edgeDriftSummary` once those metadata readers exist. The current status payload already carries readiness and graph quality summary, so this is a shape extension rather than a new status surface. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:40-62`]
4. **Self-heal:** `ensureCodeGraphReady()` should call verification after full auto-index only if full scan remains allowed; selective self-heal can update readiness and then rely on stored last-good verification until a full scan runs. It already separates `allowInlineIndex` from `allowInlineFullScan` and blocks full scans when disallowed. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:290-367`]
5. **detect_changes:** keep the current contract. It calls `ensureCodeGraphReady(... allowInlineIndex:false, allowInlineFullScan:false)` and blocks unless freshness is exactly `fresh`; verification failure should make freshness/trust non-fresh upstream, not trigger repair inside this read-only handler. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:94-106`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:245-264`]

## Per-Iteration Patch Index

| Iteration | Decision source | Patch points for 008 backend packet |
|---|---|---|
| 8 | Saved prompt plus current code. Iteration markdown is missing. | Modify `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:380-425` to make `isFileStale()` / `ensureFreshFiles()` hash-aware. Modify `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:55-66` and `:281-321` only if legacy nullable-hash migration/backfill helpers are required. Extend tests in `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:41-46` and add DB stale predicate tests. |
| 9 | Saved prompt plus iteration 6 resolver catalog. | Extend `RawCapture` with module specifier/type-only/re-export metadata at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:113-126`. Modify import/export capture extraction in `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:340-397` and `:399-465`. Add cross-file resolver logic around `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:857-920`. Add tsconfig path alias support from `.opencode/skill/system-spec-kit/mcp_server/tsconfig.json:12-15`. |
| 10 | Saved prompt plus iteration 6 edge catalog. | Extend `IndexerConfig` in `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:73-80`; centralize default edge weights from `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:895-1071` and `:1357-1377`; persist baseline distribution in `code_graph_metadata` at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:99-103`; surface drift in `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:40-62`. |
| 11 | Saved prompt plus iteration 7 self-heal boundary. | Modify `ReadyResult` at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:30-36` with self-heal/verification metadata. Extend the decision branches at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:302-367` with explicit self-heal result reasons. Preserve `detect_changes` read-only block at `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:245-264`. |
| 12 | This iteration. | Add `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/gold-query-verifier.ts`. Add `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/verify.ts`. Modify registrations in `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:554-647`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:915-920`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/index.ts:4-11`, and `.opencode/skill/system-spec-kit/mcp_server/code_graph/tools/code-graph-tools.ts:19-96`. |

## Implementation Roadmap

1. **Add verifier result types and metadata readers.** Add `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/gold-query-verifier.ts`; extend `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:190-204` with exported `getCodeGraphMetadata()` / `setCodeGraphMetadata()` or narrow `getLastGoldVerification()` / `setLastGoldVerification()` helpers. Dependency: none.
2. **Normalize battery v1 into executable probes.** Add validation in `gold-query-verifier.ts` for `assets/code-graph-gold-queries.json:1-10` and `:10-235`; derive v1 outline probes from `source_file:line`, and define v2 probe fields for future asset edits. Dependency: task 1.
3. **Execute probes through the query handler.** In `gold-query-verifier.ts`, call `handleCodeGraphQuery()` with `{ operation: 'outline', subject: sourceFile, limit: 200 }`, parse the MCP text payload, and compare `nodes[].name` / `nodes[].fqName` to `expected_top_K_symbols`. Cite the current query output at `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:1097-1133`. Dependency: task 2.
4. **Add `code_graph_verify` handler.** Add `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/verify.ts` with `VerifyArgs`, readiness blocking, report shaping, and persistence. Use `ensureCodeGraphReady(... allowInlineIndex:false, allowInlineFullScan:false)` to avoid hidden mutation. Dependency: tasks 1-3.
5. **Register `code_graph_verify` as an MCP tool.** Modify `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:554-647` to add the schema, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:915-920` to expose it, `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/index.ts:4-11` to export the handler, and `.opencode/skill/system-spec-kit/mcp_server/code_graph/tools/code-graph-tools.ts:19-96` to dispatch it. Dependency: task 4.
6. **Wire full-scan verification.** Modify `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:247-287` to optionally include `verification` in the scan result after persistence; default should be full-scan verification only or explicit `verify:true` to avoid extra cost on every incremental scan. Dependency: task 5.
7. **Surface verification in status.** Modify `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:40-62` to include `lastGoldVerification`, `goldVerificationTrust`, and `verificationPassPolicy`. Dependency: tasks 1 and 6.
8. **Make stale predicates hash-aware.** Modify `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:380-425` so mtime mismatch triggers content hashing before declaring stale when a stored `content_hash` is present; fall back to current mtime behavior when hash is missing/unreadable. Use `generateContentHash()` from `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:90-93`. Dependency: none, but land after verifier skeleton so regression canaries can run.
9. **Add resolver metadata to captures.** Modify `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:113-126` and `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:340-397` / `:399-465` to record module specifier, import kind, local/exported names, type-only flag, and re-export source. Dependency: task 8 only for safer validation order.
10. **Implement cross-file import and re-export resolver.** Modify `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:857-920` and `:1328-1381` to resolve captured module specifiers across parsed files, including path aliases from `.opencode/skill/system-spec-kit/mcp_server/tsconfig.json:12-15`. Preserve same-file edges but prefer cross-file targets when source module resolves. Dependency: task 9.
11. **Add edge-weight config and drift module.** Modify `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:73-80` with `edgeWeights?: Partial<Record<EdgeType, number>>`; replace literals in `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:895-1071` and `:1357-1377` with resolved weights; add `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/edge-drift.ts` for edge share, PSI, and JSD. Dependency: task 10.
12. **Persist and gate drift baselines.** Modify `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:99-103` metadata usage for `edge_distribution_baseline`; wire scan persistence in `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:230-245` and status output in `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:40-62`. Dependency: task 11.
13. **Make self-heal observable.** Modify `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:30-36` and `:302-367` to include `selfHealAttempted`, `selfHealResult`, `verificationGate`, and `lastSelfHealAt`; never override `allowInlineFullScan:false`. Dependency: tasks 6, 7, and 12.
14. **Preserve `detect_changes` hard block.** Add tests around `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:245-264` proving verification failure or stale graph returns `status:"blocked"` and never runs inline scan/verify mutation. Dependency: task 13.
15. **Add focused tests and gold-battery fixtures.** Extend `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-query-handler.vitest.ts:620-745` for verifier parsing/error cases, `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:41-46` and `:111-117` for hash/type-only/path alias/re-export cases, and add `code-graph-verify.vitest.ts`. Dependency: all implementation tasks.

## Risk Register

| Task | Risk | Mitigation |
|---|---|---|
| 1-3 | The current gold asset is semantic, while `code_graph_query` is structural. | Use explicit v1 outline adapter and mark relationship coverage as v2-only until asset schema is extended. |
| 4-5 | New tool registration can drift between schema and dispatcher. | Add a registration test asserting `TOOL_DEFINITIONS`, `TOOL_NAMES`, and `handleTool` all include `code_graph_verify`. |
| 6 | Running verification after every scan can slow local workflows. | Default to full scans or explicit `verify:true`; cap details unless `includeDetails:true`. |
| 7 | Status payload can become too noisy. | Surface summary by default and keep per-query failures behind the verifier tool. |
| 8 | Hashing every tracked file can be expensive. | Hash only when mtime differs or when legacy hash is missing; keep current mtime fallback on read errors. |
| 9-10 | Resolver upgrades can create duplicate or wrong cross-file edges. | Retain existing same-file resolver, add source-module metadata, and cover path alias/re-export/default import fixtures. |
| 11-12 | Drift thresholds can block trust promotion after legitimate code changes. | Persist baseline only after trusted full scan and report warning/review/block tiers separately. |
| 13 | Self-heal could hide hard-stale failures. | Respect `allowInlineFullScan:false`; only selective reindex can be automatic, and verification failures surface as operator-visible gates. |
| 14 | `detect_changes` false-safe regression is high impact. | Keep readiness check before diff parsing and add tests for stale/verification-failed states. |
| 15 | Test fixtures may overfit this repo. | Use small synthetic files plus one repo-local gold battery fixture; keep thresholds configurable. |

## Files Reviewed

- `research/prompts/iteration-008.md:1-63`
- `research/prompts/iteration-009.md:1-60`
- `research/prompts/iteration-010.md:1-57`
- `research/prompts/iteration-011.md:1-58`
- `research/iterations/iteration-006.md:1-117`
- `research/iterations/iteration-007.md:1-88`
- `assets/code-graph-gold-queries.json:1-235`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:23-33`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:1031-1095`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:1097-1435`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tools/code-graph-tools.ts:1-96`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/index.ts:1-11`
- `.opencode/skill/system-spec-kit/mcp_server/tools/index.ts:84-110`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:554-647`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:915-920`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:55-115`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:190-204`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:380-425`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:30-51`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:102-187`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:189-248`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:290-367`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:94-106`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:245-264`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:40-62`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:127-287`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:12-16`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:73-80`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:90-120`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:113-126`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:857-920`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:895-1071`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1328-1381`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:340-397`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:399-465`
- `.opencode/skill/system-spec-kit/mcp_server/tsconfig.json:12-15`

## Convergence Signals

- research_questions_answered: ["Q15A", "Q15B", "Q15C", "Q15D"]
- final_verdict: CONVERGED
- implementation_packet_ready: true
- roadmap_task_count: 15
- mandatory_asset_mutation: none; existing `assets/` files were read only
- evidence_gap: `research/iterations/iteration-008.md` through `iteration-011.md` are absent; synthesis used saved prompts plus iteration 6/7 source-grounded findings
- stop_reason: iteration 12 of 12; remaining work is implementation in `008-code-graph-backend-resilience`
