# Deep Research — 010-memory-indexer-lineage-and-concurrency-fix

## Summary
<!-- ANCHOR:summary -->
This phase investigated whether the recent memory-indexer fix packet actually closes the original lineage and scan-concurrency failures, and where residual risk still remains. The code review found no new P0 defect in the fix itself: cross-file PE mutations are downgraded before mutation, same-folder saves still serialize in process, SQLite still enforces a write transaction, and lineage-state still rejects mismatched logical identities. The remaining risk is mostly follow-up hardening and verification debt rather than a discovered active correctness break. Two P1 items remain: `fromScan` is still an internal boolean capability rather than a structurally impossible-to-misuse contract, and the live acceptance rerun on `026/009-hook-daemon-parity` still has not been completed in an embedding-capable runtime. Two P2 gaps also remain: there is no direct PE regression for null `canonical_file_path` fallback, and there is no packet-local scoped `fromScan` regression.
Primary evidence: [iteration-02.md](./iterations/iteration-02.md), [iteration-04.md](./iterations/iteration-04.md), [iteration-08.md](./iterations/iteration-08.md), and [iteration-10.md](./iterations/iteration-10.md).
<!-- /ANCHOR:summary -->

## Scope
This research covered:

- Phase packet docs for `010-memory-indexer-lineage-and-concurrency-fix`
- Cross-file PE downgrade behavior in `pe-orchestration.ts` and `pe-gating.ts`
- Scan-time `fromScan` propagation and transactional recheck behavior in `memory-index.ts` and `memory-save.ts`
- Concurrency controls across scan lease, per-spec-folder mutex, and SQLite write transaction boundaries
- Lineage-state logical-key enforcement and adjacent tests for legacy canonical-path and scope behavior
- Sibling/parent packet context where needed, especially `026` root and `009-hook-daemon-parity`

## Key Findings
### P0
- No P0 finding was confirmed. The packet now applies layered protection at the PE, transaction, and lineage-state layers, and the review did not uncover a still-active route back to the original `E_LINEAGE` failure. Evidence: [iteration-02.md](./iterations/iteration-02.md), [iteration-05.md](./iterations/iteration-05.md), [iteration-07.md](./iterations/iteration-07.md), [iteration-10.md](./iterations/iteration-10.md).

### P1
- `F-001` Architecture: `fromScan` is still carried as a plain internal boolean on exported `indexMemoryFile()`. `memory_index_scan` is the only current production caller, and `memory_save` does not expose the flag publicly, but any future in-repo caller could bypass the transactional recheck by convention rather than by a hardened contract. Evidence: [iteration-08.md](./iterations/iteration-08.md), `.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:282-301`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2546-2590`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:3238-3245`.
- `F-002` Verification: the packet still lacks the live acceptance rerun on `026/009-hook-daemon-parity`, so the "zero `candidate_changed` after B2" outcome remains documented intent rather than completed operational proof in a real embedding-backed runtime. Evidence: [iteration-01.md](./iterations/iteration-01.md), [iteration-09.md](./iterations/iteration-09.md), `implementation-summary.md §Verification`, `checklist.md §Testing`.

### P2
- `F-003` Correctness coverage: the PE guard now falls back from `canonical_file_path` to `file_path`, but the packet did not add a direct regression for a sibling candidate whose canonical column is null, so that safety path is inferred rather than directly proven. Evidence: [iteration-03.md](./iterations/iteration-03.md), `.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:28-40`, `.opencode/skill/system-spec-kit/mcp_server/tests/pe-orchestration.vitest.ts:51-60`.
- `F-004` Correctness coverage: the packet's `fromScan` regressions are unscoped, even though scope participates in both reconsolidation candidate filtering and lineage logical keys. Existing neighboring tests reduce concern, but packet-local proof is still missing. Evidence: [iteration-09.md](./iterations/iteration-09.md), `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:235-291`, `.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:247-272`, `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:742-819`.

## Evidence Trail
- Iteration 02: "the downgrade point is local to orchestration rather than search itself," which explains why the patch preserves similarity visibility while blocking unsafe lineage reuse. See [iteration-02.md](./iterations/iteration-02.md).
- Iteration 04: "the only code gated by `!fromScan` is the transactional complement recheck," which narrows the bypass to the problematic re-evaluation layer rather than disabling reconsolidation wholesale. See [iteration-04.md](./iterations/iteration-04.md).
- Iteration 05: "the write path also keeps a `BEGIN IMMEDIATE`-style SQLite transaction as defense in depth for multi-process races," which is the key reason no new P0 concurrency defect was found. See [iteration-05.md](./iterations/iteration-05.md).
- Iteration 07: "lineage logical keys are built from spec folder, normalized scope, canonical path, and anchor id," and mismatches still throw, which is the lower-layer backstop behind the original failure class. See [iteration-07.md](./iterations/iteration-07.md).
- Iteration 08: "`fromScan` is scan-only by caller convention, not by a type-level or provenance-level guarantee," which is the strongest remaining architecture concern. See [iteration-08.md](./iterations/iteration-08.md).
- Iteration 09: "the strongest remaining uncertainty is operational rather than code-structural," referring to the deferred live acceptance rerun. See [iteration-09.md](./iterations/iteration-09.md).

## Recommended Fixes
- `[P1][runtime API]` Replace the raw `fromScan?: boolean` parameter on exported `indexMemoryFile()` with a scan-only wrapper, branded token, or similarly non-forgeable internal contract so future callers cannot silently opt into the transactional bypass.
- `[P1][verification]` After restarting the MCP runtime in an embedding-enabled environment, rerun `memory_index_scan` against `026/009-hook-daemon-parity` and record exact counts for `E_LINEAGE`, `candidate_changed`, and any residual failures in the packet docs.
- `[P2][tests]` Add a PE orchestration regression where the chosen sibling candidate has `canonical_file_path: null` and only `file_path` populated, proving the null-canonical fallback path directly.
- `[P2][tests]` Add a scoped `fromScan` regression that exercises tenant/session-governed saves so the packet directly proves the scan bypass does not regress scope-filtered reconsolidation or lineage logical-key behavior.
- `[P2][observability]` Consider logging or annotating scan-bypass usage so future investigations can distinguish ordinary saves from scan-originated saves without code archaeology.

## Convergence Report
The loop converged without early termination. Iterations 01-03 contributed the biggest net-new information by restating the fix boundary, locating the PE downgrade, and checking legacy canonical-path behavior. Iterations 04-07 tightened confidence by showing that the bypass is narrow and that concurrency/lineage backstops still exist. Iteration 08 uncovered the main new P1 insight: `fromScan` is structurally under-hardened even though current call sites are safe. Iterations 09-10 mostly confirmed that the remaining work is verification and coverage debt, not an already-active correctness regression.

## Open Questions
- Should the next remediation packet harden `fromScan` at the API boundary, or is the operational rerun more urgent?
- What exact live command and environment notes should be treated as the canonical acceptance rerun for `026/009-hook-daemon-parity`?
- Is packet-local observability for scan-bypass usage worth adding, or would that be unnecessary noise once the API surface is hardened?
- Should the packet explicitly document the unavailable CocoIndex run as a research-process limitation, or leave it out of downstream summaries?

## References
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-memory-indexer-invariants/001-memory-indexer-lineage-and-concurrency-fix/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-memory-indexer-invariants/001-memory-indexer-lineage-and-concurrency-fix/plan.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-memory-indexer-invariants/001-memory-indexer-lineage-and-concurrency-fix/tasks.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-memory-indexer-invariants/001-memory-indexer-lineage-and-concurrency-fix/implementation-summary.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-memory-indexer-invariants/001-memory-indexer-lineage-and-concurrency-fix/checklist.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/spec.md`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/spec-folder-mutex.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/pe-orchestration.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/create-record-lineage-regressions.vitest.ts`
