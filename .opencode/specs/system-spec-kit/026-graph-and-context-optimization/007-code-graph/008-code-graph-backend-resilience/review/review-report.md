# Review Report

**Verdict: FAIL.** This packet still has 5 active P0 findings, all on the traceability axis: the implementation and packet docs claim direct coverage for REQ-002/003/004/005/006/007/008/009/012/015, but the landed tests do not directly execute those behaviors. Separate from those release blockers, 12 P1 issues remain across workspace containment, resolver correctness, drift reporting, verifier semantics, and contract hygiene. Under the packet criteria, any active P0 blocks release readiness.

## 1. Executive Summary

- Deduplicated active findings: **5 P0**, **12 P1**, **7 P2**
- Reviewed packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience`
- Readiness result: `FAIL`

The backend resilience work added the intended streams, but the evidence and safety story did not land cleanly. The strongest implementation issues are inconsistent workspace containment on the new verify/resolver paths, resolver fallback gaps, malformed-baseline drift handling, and verifier contract mismatches. The strongest release blocker is simpler: too many claimed requirements are still verified indirectly, with synthetic helpers or mock-only shapes instead of direct executable proof.

## 2. Scope

- Prior review inputs: `review/iterations/iteration-001.md` through `review/iterations/iteration-009.md`, their JSON deltas, `review/deep-review-state.jsonl`, `review/deep-review-config.json`, and `review/deep-review-strategy.md`
- Packet docs: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`
- Research lineage: 007 research iterations 008-012 plus `assets/code-graph-gold-queries.json`
- Implementation surface: code-graph handlers, resolver/parser/indexer libraries, verify/drift/readiness helpers, tool registration, and the tests cited by iterations 001-009

## 3. Methodology

- Review model: deep-review synthesis pass over 9 completed iterations plus this final iteration 10
- Dimensions covered: correctness, security, traceability, maintainability
- Executor from packet config: `cli-codex`, model `gpt-5.4`, reasoning `high`, service tier `fast`
- Synthesis method: deduplicate repeated findings, preserve the highest justified severity, and separate real production defects from evidence-only gaps

## 4. Findings By Dimension

- **Correctness:** 13 active findings. The biggest issues are nested tsconfig resolution, type-only import tagging, regex-fallback resolver parity, malformed-baseline drift status, case-insensitive verifier matching, incomplete persisted verification context, and readiness-state propagation.
- **Security:** 3 active findings. The new verify surface does not enforce the same canonical workspace boundary as scan/detect-changes, `batteryPath` is an arbitrary-file read surface, and resolver-side tsconfig/alias handling can still touch external paths.
- **Traceability:** 6 active findings. Five are P0 because the packet still lacks direct executable coverage for large parts of REQ-002 through REQ-015, and one P2 remains because two documented limitations still do not name concrete follow-up ownership.
- **Maintainability:** 2 active findings. The verifier depends on a duplicated untyped query transport contract, and the verify-side result/schema vocabulary is already drifting enough to need compatibility shims.

## 5. Findings By Severity

### P0

- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:236-243` with `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:138-332` — `REQ-002` has no direct test for `currentContentHash` propagation. Fix: add a scan assertion that pins `isFileStale('/workspace/current.ts', { currentContentHash: 'hash-1' })`.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:358-449`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1458-1527,1728-1809`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:232-420` — `REQ-003`, `REQ-004`, and `REQ-006` do not have direct parse-level, tsconfig-backed, or `export *` resolution coverage. Fix: add parser-capture tests, a real tsconfig alias scan test, and an outline query test that resolves through a star barrel.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:12-29`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1773-1809`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:265-311` — `REQ-005` is not directly implemented or tested as a distinct `TYPE_ONLY` edge contract. Fix: either add the promised edge type plus tests, or amend the spec/design docs to accept metadata-only tagging.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:281-289`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:40-76,155-214`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:219-225`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:138-332`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-siblings-readiness.vitest.ts:302-322` — `REQ-007`, `REQ-008`, and `REQ-009` lack direct tests for edge weights, baseline persistence, drift thresholds, and status fallback behavior. Fix: add `edge-drift.ts` unit tests plus scan/status coverage for baseline persistence and thresholded drift summaries.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:30-39,346-425`, `.opencode/skill/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts:108-274`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/detect-changes.test.ts:77-111` — `REQ-012` and `REQ-015` are not directly exercised on the real self-heal and verification-gate branches. Fix: add `ensureCodeGraphReady()` tests for skipped, ok, and failed selective reindex and assert the real helper output that `detect_changes` consumes.

### P1

- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1500-1528` — nested tsconfig `extends` is still single-level only and never rejects cycles. Fix: recurse through the full chain with canonical visited-path tracking.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:364-380,388-392` — inline type-only imports are stamped as value imports. Fix: detect the `type` modifier per specifier instead of once per statement.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:531-559` — the regex fallback still drops resolver metadata required for type-only and re-export resolution. Fix: emit `moduleSpecifier`, `importKind`, and `exportKind` on the regex path too.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:40-67` with `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:281-288` — malformed or missing baselines are silently reported as zero drift and malformed metadata blocks auto-reseeding. Fix: treat invalid baseline state as unavailable and reseed after parse failure.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:56-64` — `share_drift` loses direction by taking absolute values. Fix: keep signed deltas in the surfaced summary and only use absolute values for threshold checks.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/gold-query-verifier.ts:226-227` — verifier symbol matching is case-insensitive. Fix: compare exact identifier strings by default.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/gold-query-verifier.ts:36-49,298-325` with `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/verify.ts:98-104` — persisted failed probe results omit query text and source context. Fix: persist the original query metadata with each probe result.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:346-359` with `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:253-266` — `verificationGate` is dropped on the real `action:'none'` path, so fresh graphs with failed verification can return `ok`. Fix: preserve the gate independently of `state.action` and test the production-shaped branch.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/verify.ts:72-78` — `code_graph_verify` trusts caller `rootDir` and can inline-index outside the workspace. Fix: add the same canonical workspace containment guard used by scan and detect-changes.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/verify.ts:88-96` — `batteryPath` is an unrestricted arbitrary-file read surface and can persist leaked path context. Fix: remove it from the public schema or restrict it to an approved asset directory.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1458-1474,1500-1506,1628-1638` — tsconfig `extends` and alias target resolution can still read or probe paths outside the approved root. Fix: canonicalize every resolved file before `readFileSync()` or `statSync()`.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/gold-query-verifier.ts:234-330,344-361` with `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:1111-1131` — the verifier duplicates the `code_graph_query` transport contract through `any`-typed parsing. Fix: extract a shared typed adapter for outline/query responses and test against the real handler output.

### P2

- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:242-296` — the scan tests still do not pin `currentContentHash` propagation even though the implementation currently does it correctly. Fix: add a direct `isFileStale(...)` call-shape assertion.
- `.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:906-947` — the crash-recovery freshness regression still passes under the old mtime-only semantics. Fix: add a same-mtime/content-changed stale check or narrow the test's stated scope.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1725-1755` — barrel traversal is cycle-safe but unbounded and emits no depth/cycle metadata. Fix: add a max-depth guard plus failure metadata.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/gold-query-verifier.ts:205-213` — unsupported v2 probe warnings are emitted once per query row. Fix: emit one battery-level warning summarizing affected entries.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:349-350,362-373,428-443` — `lastSelfHealAt` timestamps skipped and failed attempts, not just successful self-heals. Fix: stamp success only or split attempt-vs-success timestamps.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/implementation-summary.md:151-159` — limitations 1 and 5 explain the present state but do not name a concrete future follow-up path. Fix: add explicit ownership or a follow-on packet decision.
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:564-566,640-654` with `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/verify.ts:26-33,88-100` and `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/gold-query-verifier.ts:51-58,450-453` — verify-side naming and casing are already drifting (`persistBaseline`, mixed snake/camel result fields). Fix: normalize naming at the handler boundary and keep aliases temporary.

## 6. Cross-Cutting Themes

- **Evidence trails lagged behind implementation.** Several major behaviors exist in code but are still only indirectly covered, mocked, or asserted through synthetic helpers instead of direct end-to-end execution.
- **Boundary enforcement is inconsistent.** Scan and detect-changes were hardened with canonical path checks, but verify and resolver-side helpers still bypass those guarantees.
- **Fallback paths are weaker than primary paths.** The regex parser, malformed-baseline handling, `action:'none'` readiness flow, and unsupported v2 probe handling all degrade incorrectly or opaquely.
- **Contracts drifted at multiple seams.** Spec vs implementation (`TYPE_ONLY`, signed drift deltas), handler vs helper (`verificationGate`), query vs verifier transport, and public schema naming all show divergence.

## 7. Remediation Roadmap

1. Close the three security P1s first: verifier `rootDir` containment, `batteryPath` allowlisting/removal, and resolver-side external path fencing.
2. Repair the five FAIL-grade traceability gaps by adding direct tests for REQ-002/003/004/005/006/007/008/009/012/015 and updating packet evidence to point at those tests.
3. Fix the production correctness bugs that can misreport state today: `verificationGate` loss on `action:'none'`, malformed-baseline drift suppression, signed `share_drift`, and case-sensitive verifier matching.
4. Bring resolver behavior up to the packet contract: full tsconfig `extends` traversal with cycle protection, per-specifier type-only import tagging, and regex fallback metadata parity.
5. Improve persisted verification observability by carrying full query/source metadata and reducing noisy v2 warnings to one battery-level signal.
6. Resolve spec and API drift explicitly: either implement a distinct `TYPE_ONLY` edge contract or amend the spec, then normalize verify-side naming and result casing.
7. Finish with targeted regression coverage for the remaining P2 items: crash-recovery hash semantics, bounded barrel traversal metadata, and accurate self-heal timestamps.

## 8. Verdict

`FAIL` is the right final state. The packet does not meet its own release criteria because five active P0 findings remain, and each one is grounded in missing direct executable evidence for claimed requirement coverage. Even if those P0s were closed immediately, the packet would still need a second pass before release because 12 P1 findings remain on correctness, security, and contract integrity.

## 9. Adversarial Self-Check Summary

- I checked whether the P0 set was merely documentation drift. It is not: each P0 is anchored in a concrete mismatch between claimed direct REQ coverage and the tests that actually execute.
- I checked whether any P1 should have been promoted to P0. I kept them at P1 where the code defect is real but the release-blocking criterion is still dominated by the traceability failures.
- I checked for duplicate counting across iterations. Repeated scan-propagation/test-evidence items were folded into one active finding per issue, and totals in this report are deduplicated rather than raw iteration sums.
