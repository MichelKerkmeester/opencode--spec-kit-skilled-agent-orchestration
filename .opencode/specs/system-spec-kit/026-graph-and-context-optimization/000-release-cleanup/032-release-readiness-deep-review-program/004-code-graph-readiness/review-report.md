---
title: "Review Report: Code Graph Readiness"
description: "Release-readiness deep-review report for the code graph readiness contract."
trigger_phrases:
  - "045-004-code-graph-readiness"
  - "code graph readiness audit"
  - "read-path contract review"
  - "ensure-ready behavior"
importance_tier: "important"
contextType: "review"
---
# Review Report: Code Graph Readiness

## 1. Executive Summary

**Verdict: FAIL.** Active findings: P0=1, P1=2, P2=1. `hasAdvisories=true`.

The post-032 contract is mostly implemented honestly: current code_graph docs do not claim structural real-time watching, `detect_changes` passes `allowInlineIndex:false`, `code_graph_status` uses a read-only readiness snapshot, and `code_graph_verify` blocks on non-fresh readiness by default.

The release blocker is `ensureCodeGraphReady`'s five-second debounce. It caches readiness by root/options only, not by tracked-file freshness. If a read path gets a fresh result, then an operator edits files and immediately calls `code_graph_query`, the handler can reuse the cached fresh result and answer from stale graph rows. That bypasses both selective self-heal and required-action blocking.

## 2. Planning Trigger

Route to remediation planning before release readiness. The P0 needs a runtime fix plus regression coverage that proves fresh-to-stale transitions cannot be hidden by the readiness debounce.

P1 work should update the trust-state wording in operator docs and add targeted coverage for same-root fresh-then-edit behavior. P2 cleanup can be batched with the same docs pass.

## 3. Active Finding Registry

### P0-001: Readiness debounce can silently bypass stale detection after recent fresh reads

**Severity:** P0, silent stale-graph read / selective self-heal bypass.

**Evidence:** `ensureCodeGraphReady` caches by `rootDir`, `allowInlineIndex`, and `allowInlineFullScan` only `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:309`. It returns the cached result for five seconds without calling `detectState` `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:334`. `detectState` is the function that would call `getTrackedFiles()` and `ensureFreshFiles(existingFiles)` to discover all stale tracked files `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:141` and `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:166`. `ensureFreshFiles` compares every tracked file's stored mtime/hash to disk `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:437`. Selective repair then indexes exactly `state.staleFiles` `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:398`.

`code_graph_query` calls `ensureCodeGraphReady(process.cwd(), { allowInlineIndex:true, allowInlineFullScan:false })` `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:1087`. It only blocks when the returned readiness action is `full_scan` and no inline index happened `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:787`; otherwise it proceeds to graph queries `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:1136`. A cached fresh result has `freshness:"fresh"` and `action:"none"`, so it neither self-heals nor blocks.

**Impact:** The concrete user scenario "operator edits 5 files, then runs `code_graph_query`" is safe only if there was no matching readiness cache entry from the previous five seconds. If there was a recent fresh read, all five edits are invisible to that query. The graph answer can be stale while the payload still advertises live readiness.

**Concrete fix:** Remove the freshness debounce for graph-answering read paths, or make the cache key include a cheap tracked-file freshness fingerprint such as tracked-file count plus max mtime/content-hash sentinel. At minimum, do not cache `fresh` results across calls when `allowInlineIndex:true`; fresh-to-stale must re-run `detectState` before any query answers.

### P1-001: Current README mixes trust-state and canonical-readiness vocabulary

**Severity:** P1, operator-facing contract drift.

**Evidence:** The code graph README lists "Trust state probing (`live` / `stale` / `missing`) via `lib/readiness-contract.ts`" `.opencode/skill/system-spec-kit/mcp_server/code_graph/README.md:58`. The runtime trust-state mapper emits `live`, `stale`, `absent`, and `unavailable` `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/readiness-contract.ts:96`; the `error` arm returns `unavailable` `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/readiness-contract.ts:119`. `missing` is a canonical readiness value, not a trust-state value, as shown by `canonicalReadinessFromFreshness` mapping `empty` and `error` to `missing` `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/readiness-contract.ts:65`.

**Impact:** Operators reading the subsystem README can look for the wrong field value. That weakens degraded-readiness observability because `unavailable` and `absent` are the important distinction between crash-on-probe and empty graph state.

**Concrete fix:** Change the README line to distinguish `canonicalReadiness` (`ready` / `stale` / `missing`) from `trustState` (`live` / `stale` / `absent` / `unavailable`). Keep the feature catalog and playbook wording aligned with that split.

### P1-002: Degraded stress coverage skips the same-root fresh-then-edit path that exposes the P0

**Severity:** P1, release-readiness coverage gap.

**Evidence:** The degraded sweep explicitly covers empty, broad-stale, readiness exception, and fresh buckets `.opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:23`. It pins each bucket to a separate temp cwd so the module-level readiness debounce keys differently per bucket `.opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:181`. The fresh bucket asserts no `fallbackDecision` when the graph is fresh `.opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:342`, but no bucket performs "fresh query, edit tracked files within debounce window, query same root again." Query unit tests mock `ensureCodeGraphReady` at module level `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-query-handler.vitest.ts:39`, so they also cannot catch cache invalidation bugs inside `ensure-ready.ts`.

**Impact:** The stress suite does exercise degraded paths, but it does not guard the release-critical transition where a graph becomes stale immediately after a fresh read. That is the path the P0 uses.

**Concrete fix:** Add an integration test using one temp root and the real `ensureCodeGraphReady`: seed a fresh graph, run `handleCodeGraphQuery`, edit multiple tracked files, immediately run `handleCodeGraphQuery` again, and assert the second call either selectively self-heals all edited files or blocks. The test should fail if a cached fresh readiness result is reused.

### P2-001: Internal readiness-contract comments still describe the pre-error three-state subset

**Severity:** P2, cleanup.

**Evidence:** The top comment in `readiness-contract.ts` says the helper maps `GraphFreshness` `('fresh'|'stale'|'empty')` `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/readiness-contract.ts:12` and says handler-level helpers emit a three-value subset `live|stale|absent` `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/readiness-contract.ts:23`. Later code correctly includes the `error` arm and `unavailable` trust state `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/readiness-contract.ts:119`.

**Impact:** Runtime behavior is correct here, but maintainers reading the module header get a stale mental model.

**Concrete fix:** Update the comment block to name all four live code-graph readiness states: `fresh`, `stale`, `empty`, and `error`, plus trust states `live`, `stale`, `absent`, and `unavailable`.

## 4. Remediation Workstreams

| Workstream | Findings | Action |
|------------|----------|--------|
| Readiness cache correctness | P0-001 | Remove or invalidate the debounce for graph-answering reads; prove fresh-to-stale same-root queries cannot stale-read. |
| Coverage hardening | P1-002 | Add same-root fresh-then-edit integration coverage with multiple edited tracked files. |
| Contract docs | P1-001, P2-001 | Align README and module comments on canonical readiness versus trust state vocabulary. |

## 5. Spec Seed

Follow-up packet: `046-code-graph-readiness-remediation`.

Problem: Release readiness is blocked because code graph read paths can reuse a cached fresh readiness result after files change, skipping both selective repair and full-scan blocking.

Requirements:
- P0: `code_graph_query` and `code_graph_context` must never answer graph data from a cached fresh readiness result after tracked files change.
- P0: Fresh-to-stale same-root integration coverage must fail on stale-read bypass and pass after the fix.
- P1: Documentation must distinguish `canonicalReadiness` from `trustState`.
- P1: The degraded stress suite must include the multiple-edited-files selective self-heal scenario.

## 6. Plan Seed

1. Rework `ensureCodeGraphReady` debounce so it cannot return stale `fresh` results for graph-answering reads.
2. Add a focused integration test for same-root fresh query, five tracked-file edits, immediate second query.
3. Confirm selective self-heal covers all stale tracked files when the stale count is at or below `SELECTIVE_REINDEX_THRESHOLD`.
4. Confirm broad stale still blocks with `requiredAction:"code_graph_scan"` when inline full scan is disallowed.
5. Patch README and readiness-contract comments for readiness/trust vocabulary.
6. Run targeted code graph tests plus strict spec validation.

## 7. Traceability Status

Question: After 032's watcher retraction, is there any remaining code path that claims "real-time watching" of code_graph?

Answer: No current code_graph operator doc found by the targeted regex claims structural real-time watching. Current hits are negative or manual-contract statements: the coverage graph catalog says there is no watcher `.opencode/skill/system-spec-kit/mcp_server/code_graph/feature_catalog/05--coverage-graph/01-deep-loop-graph-query.md:24`, ensure-ready says it is not a background watcher `.opencode/skill/system-spec-kit/mcp_server/code_graph/feature_catalog/01--read-path-freshness/01-ensure-code-graph-ready.md:25`, and detect_changes says it has no watcher or hook trigger `.opencode/skill/system-spec-kit/mcp_server/code_graph/feature_catalog/03--detect-changes/01-detect-changes-preflight.md:29`. Historical specs still mention the old claim as evidence records, especially 032's retraction spec `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/019-code-graph-watcher-retraction/spec.md:53`.

Question: Does `ensureCodeGraphReady` handle concurrent modifications correctly when an operator edits five files, then runs `code_graph_query`?

Answer: Conditional. Without a matching recent cache entry, yes: `detectState` checks all tracked files `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:166`, `ensureFreshFiles` compares each path's mtime/hash `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:437`, and selective reindex passes all stale files to `indexFiles(..., { specificFiles: state.staleFiles })` `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:398`. With a recent cached fresh readiness result, no: lines 334-338 return the cached result before detection, so all five edits can be missed. That is P0-001.

Question: Does `code_graph_status` ever side-effect by mutating freshness?

Answer: Static evidence says no. `handleCodeGraphStatus` reads `getGraphReadinessSnapshot(process.cwd())` first `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:158`; the snapshot helper explicitly avoids cache writes, deleted-file cleanup, inline indexing, and git-head updates `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:470`. It calls only `detectState` and returns freshness/action/reason `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:508`.

Question: Does `code_graph_verify` correctly distinguish fresh vs stale vs blocked?

Answer: Mostly yes. It canonicalizes root and battery paths before readiness `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/verify.ts:97`, calls `ensureCodeGraphReady` with `allowInlineIndex:false` and `allowInlineFullScan:false` by default `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/verify.ts:153`, returns `status:"blocked"` unless readiness is fresh `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/verify.ts:160`, and only then executes the battery `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/verify.ts:167`. Existing tests assert stale blocks and fresh returns ok `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-verify.vitest.ts:331` and `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-verify.vitest.ts:357`.

Question: Does `detect_changes` always set `allowInlineIndex:false`?

Answer: Yes. It passes `{ allowInlineIndex:false, allowInlineFullScan:false }` to `ensureCodeGraphReady` before diff parsing `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:241`, and tests assert that exact call shape `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/detect-changes.test.ts:177`.

Question: Does `code-graph-degraded-sweep.vitest.ts` actually exercise the degraded path?

Answer: Yes for empty graph, broad stale, and readiness exception paths: empty routes to `code_graph_scan` `.opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:197`, broad stale over threshold routes to `code_graph_scan` `.opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:231`, and readiness exception routes to `rg` `.opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:302`. It does not exercise the same-root fresh-to-stale debounce bypass. That is P1-002.

Security question: Is there path injection or arbitrary code execution via crafted file refs or tracked-file logic?

Answer: No arbitrary code execution path found in the audited tracked-file logic. Selective indexing resolves specific files through `resolveWorkspaceCandidateWithinRoot` `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1454`; that helper realpaths candidates and refuses paths outside the canonical workspace root `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1565`. The parser reads file content with `readFileSync` and structural parsing only `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:2127`; no child process execution occurs in that path. `detect_changes` rejects diff paths with control characters or workspace escapes `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:137` and `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:164`.

## 8. Deferred Items

- Implement the readiness debounce fix in a remediation packet.
- Add same-root fresh-to-stale integration coverage with multiple edited tracked files.
- Re-run targeted code graph tests after remediation.
- Refresh README and readiness-contract comment vocabulary.

## 9. Audit Appendix

### Coverage

Reviewed surfaces:
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/{query,scan,verify,status,context,detect-changes}.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/readiness-contract.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/feature_catalog/`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/manual_testing_playbook/`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/`
- Prior evidence packets 013, 032, and 035.

### Regex Evidence

Command class: `rg -n "real[- ]?time|watcher|watching|file watcher|file-watcher|watch mode|live watch" .opencode/skill/system-spec-kit/mcp_server/code_graph -g '*.md'`.

Current code_graph docs returned only no-watcher/manual-contract hits:
- `feature_catalog/05--coverage-graph/01-deep-loop-graph-query.md:24`
- `feature_catalog/01--read-path-freshness/01-ensure-code-graph-ready.md:14`
- `feature_catalog/01--read-path-freshness/01-ensure-code-graph-ready.md:25`
- `feature_catalog/03--detect-changes/01-detect-changes-preflight.md:29`

Historical specs outside current code_graph docs still mention watcher claims as evidence, not current operator guidance.

### Coverage Matrix

| Question | Result |
|----------|--------|
| Watcher retraction honesty | PASS for current code_graph docs; historical evidence records remain. |
| Selective self-heal for five edited files | FAIL when a recent cached fresh readiness result exists; otherwise the stale-file set covers all tracked files. |
| Query block-with-required-action | PASS for full-scan readiness; P0 bypass exists when cached fresh result skips detection. |
| Status read-only diagnostic | PASS by static source. |
| Verify fresh/stale/blocked distinction | PASS for default no-inline-index verify path. |
| detect_changes no inline index | PASS by source and tests. |
| Degraded stress path | PASS for empty/broad-stale/error; missing fresh-to-stale cache transition. |
| Path injection / arbitrary exec | PASS by static source; no arbitrary exec path found. |

### Convergence Evidence

All four review dimensions were covered:
- Correctness: readiness state detection, selective repair, query blocking, verify and status behavior.
- Security: workspace containment, diff path validation, tracked-file indexing path, no arbitrary execution.
- Traceability: 032 watcher retraction, 013 adversarial verdict, 035 F5/F6 coverage, 039 catalog/playbook docs.
- Maintainability: handler interface consistency, selective versus full-scan split, stale comments and doc vocabulary drift.

Convergence is blocked by one active P0 and two active P1 findings. Release readiness for code graph readiness is not achieved.
