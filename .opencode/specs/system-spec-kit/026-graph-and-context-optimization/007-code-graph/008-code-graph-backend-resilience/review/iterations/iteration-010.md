# Iteration 010

**Run Date:** 2026-04-26
**Dimension:** synthesis
**Focus:** Cross-cutting findings, verdict, and remediation roadmap
**Verdict Snapshot:** FAIL

## Summary

- This synthesis deduplicated repeated evidence across iterations 001-009 into 24 distinct active findings: 5 P0, 12 P1, and 7 P2.
- The verdict is `FAIL` because the packet still has 5 active P0 findings, all on the traceability axis: the implementation and packet docs claim direct REQ coverage that the landed tests do not directly execute.
- Even ignoring the traceability blockers, the packet would still be `CONDITIONAL` because 12 P1 issues remain across workspace containment, resolver correctness, drift reporting, verifier semantics, and contract hygiene.

## Per-Dimension Summary

- **Correctness:** 13 active findings (0 P0 / 8 P1 / 5 P2). The primary gaps are resolver fidelity, drift-status semantics, verifier result semantics, and readiness-state propagation.
- **Security:** 3 active findings (0 P0 / 3 P1 / 0 P2). All three are boundary-enforcement issues: `code_graph_verify` root containment, `batteryPath` arbitrary reads, and resolver-side external-path probes.
- **Traceability:** 6 active findings (5 P0 / 0 P1 / 1 P2). The packet does not yet have direct executable coverage for REQ-002/003/004/005/006/007/008/009/012/015, and two implementation-summary limitations still lack explicit follow-up ownership.
- **Maintainability:** 2 active findings (0 P0 / 1 P1 / 1 P2). The verifier still depends on an ad hoc `code_graph_query` transport contract, and the verify-side naming/schema surface is already drifting.

## Finding Totals By Severity

- **P0:** 5
- **P1:** 12
- **P2:** 7

## Top 5 P0 Findings

1. `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:236-243` with `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:138-332` — `REQ-002` is not directly tested because the scan suite never asserts `currentContentHash` propagation into `isFileStale(...)`. Fix: add a scan assertion that pins `isFileStale('/workspace/current.ts', { currentContentHash: 'hash-1' })`.
2. `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:358-449` with `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1458-1527,1728-1809` and `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:232-420` — `REQ-003`, `REQ-004`, and `REQ-006` do not have direct parse-level, tsconfig-backed, or `export *` resolution coverage. Fix: add parser-capture tests, a real tsconfig alias scan test, and an outline query test that resolves through a star barrel.
3. `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:12-29` with `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1773-1809` and `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:265-311` — `REQ-005` is neither directly implemented as a distinct `TYPE_ONLY` edge contract nor directly tested. Fix: either add the promised edge type plus tests, or amend the spec/design docs to ratify metadata-only tagging.
4. `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:281-289` with `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:40-76,155-214` and related tests at `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:219-225`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:138-332`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-siblings-readiness.vitest.ts:302-322` — `REQ-007`, `REQ-008`, and `REQ-009` do not have direct edge-weight, baseline-persistence, or drift-threshold coverage. Fix: add edge-drift unit tests, scan baseline-persistence tests, and status threshold/fallback tests.
5. `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:30-39,346-425` with `.opencode/skill/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts:108-274` and `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/detect-changes.test.ts:77-111` — `REQ-012` and `REQ-015` are still not directly exercised on the real self-heal/readiness branches. Fix: add `ensureCodeGraphReady()` tests for skipped, ok, and failed selective reindex plus verification-gate propagation.

## Top 10 P1 Findings

1. `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/verify.ts:72-78` — `code_graph_verify` trusts caller `rootDir` and can inline-index outside the workspace. Fix: apply the same canonical realpath containment guard used by scan and detect-changes.
2. `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/verify.ts:88-96` — `batteryPath` is an unrestricted arbitrary-file read surface and can persist leaked absolute-path context. Fix: remove it from the public surface or enforce a canonical allowlist.
3. `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1458-1474,1500-1506,1628-1638` — tsconfig `extends` and alias probing can still touch files outside the approved root. Fix: canonicalize every resolved tsconfig and alias target before `readFileSync()` or `statSync()`.
4. `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:346-359` with `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:253-266` — `verificationGate` is dropped on the real `action:'none'` path, so fresh graphs with failed verification can return `ok`. Fix: preserve the gate independently of `state.action` and test the production-shaped branch.
5. `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1500-1528` — nested tsconfig `extends` is still single-level only and does not reject cycles. Fix: recurse through the full chain with visited-path tracking.
6. `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:531-559` — the regex fallback still drops resolver metadata needed for `import type`, `export { ... } from`, and `export * from` parity. Fix: emit the same `moduleSpecifier` / `importKind` / `exportKind` contract as the tree-sitter path.
7. `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:40-67` with `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:281-288` — malformed or missing edge baselines are silently reported as zero drift and can become sticky. Fix: surface baseline-unavailable state and reseed on parse failure instead of raw-key presence.
8. `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/gold-query-verifier.ts:226-227` — verifier symbol matching is case-insensitive, so case-only identifier regressions can still pass. Fix: match exact identifier strings by default.
9. `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/gold-query-verifier.ts:36-49,298-325` with `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/verify.ts:98-104` — persisted failed probe results omit query text and source context required by downstream consumers. Fix: persist the original query metadata alongside each failure.
10. `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:56-64` — `share_drift` reports absolute magnitude instead of signed `current_share - baseline_share`. Fix: keep signed deltas in the surfaced summary and use absolute values only for threshold checks.

## Convergence Signals

- The final deduped registry stayed above the fail threshold because the traceability pass introduced 5 P0 findings and none were closed in later iterations.
- Multiple later P1 findings line up with the P0 evidence gaps rather than contradicting them, which increases confidence that the fail verdict is a real release-readiness signal instead of a documentation artifact.
- No new P0 findings appeared after iteration 008, but the active P0 set remained unresolved through synthesis, so convergence on release readiness was not achieved.
