# Iteration 007 — Status snapshot closure and P0/P1 contradiction check

## Status
- Iteration: 7 / 10
- Focus: close Q-P2 with a test-ready read-only readiness snapshot; verify P0/P1 winners still match the current test/source anchors
- newInfoRatio: 0.34
- Convergence trajectory: P0/P1 remain stable; Q-P2 now has an implementation-ready winner and falsifiable status assertions.

## Q-P0: cli-copilot /memory:save Gate 3 bypass

See iteration-005 and iteration-006 for the converged recommendation: command-owned target authority in the Copilot prompt helper, shared by deep-research and deep-review.

Contradiction check: no current helper already carries target authority. `executor-config.ts:66` through `executor-config.ts:70` still exposes only `resolveCopilotPromptArg(promptPath, prompt, thresholdBytes)`, which chooses raw prompt vs `@PROMPT_PATH` and does not encode an approved spec folder or plan-only Gate 3 fallback. The existing deep-loop executor tests validate executor config and supported fields, but the shown `executor-config.vitest.ts:50` through `executor-config.vitest.ts:55` only proves cli-copilot config parsing, not prompt authority.

Winner remains: replace or wrap `resolveCopilotPromptArg` with `buildCopilotPromptArg({ promptPath, prompt, targetAuthority })`. Source target authority only from workflow-owned state for the resolved spec folder. If a continuity-write prompt has no operator-approved folder, the helper must prepend a plan-only Gate 3 instruction and avoid any wording that says the folder is approved.

Success criteria to carry forward:
- Small and large Copilot prompt paths both include the exact approved spec folder when authority exists.
- Missing authority plus `/memory:save` yields only a Gate 3 question/options response and performs no memory mutation.
- Prompt body, bootstrap context, `last_active_child_id`, and memory search results cannot override `targetAuthority.specFolder`.
- Deep-research and deep-review call the same helper; no shell-only Copilot prompt-size branch remains.

## Q-P1: code-graph fast-fail not testable

See iteration-005 and iteration-006 for the converged recommendation: keep mocked unit coverage and add a deterministic degraded-graph stress cell using an isolated `SPEC_KIT_DB_DIR`.

Contradiction check: the current tests and handler still support that winner. `code-graph-query-fallback-decision.vitest.ts:76` through `code-graph-query-fallback-decision.vitest.ts:105` already covers empty and stale full-scan states routing to `fallbackDecision.nextTool:"code_graph_scan"`. The same file covers no `fallbackDecision` for selective/fresh states at `code-graph-query-fallback-decision.vitest.ts:108` through `code-graph-query-fallback-decision.vitest.ts:129`, and readiness errors routing to `rg` at `code-graph-query-fallback-decision.vitest.ts:132` through `code-graph-query-fallback-decision.vitest.ts:160`.

The production branch also matches the proposed matrix. `query.ts:791` through `query.ts:807` maps `freshness:"error"` to `{ nextTool:"rg", reason:"scan_failed" }`, and maps non-inline `full_scan` to `{ nextTool:"code_graph_scan", reason:"full_scan_required", retryAfter:"scan_complete" }`. `query.ts:1088` through `query.ts:1092` keeps read paths from performing inline full scans, and `query.ts:1136` through `query.ts:1141` returns the blocked payload when full scan is required.

Winner remains: v1.0.3 should add an end-to-end degraded graph harness, not more mocked unit cases. The useful cells are:
1. Empty isolated DB: first query blocks with `fallbackDecision.nextTool:"code_graph_scan"`.
2. Stale/full-scan isolated DB: first query blocks with the same scan-first decision.
3. Readiness crash/unavailable DB: first query reports `fallbackDecision.nextTool:"rg"`.
4. Fresh pre-scanned isolated DB: query succeeds or honestly returns no result without `fallbackDecision`.

Success criterion: the harness must leave the operator's live graph untouched; all destructive setup happens under the temporary `SPEC_KIT_DB_DIR`.

## Q-P2: file-watcher debounce

Recommended winner: add `getGraphReadinessSnapshot(rootDir)` as a non-mutating read-only helper and make `code_graph_status` emit that snapshot. Do not lower `DEFAULT_DEBOUNCE_MS=2000` first.

The current status path loses the action that operators need. `status.ts:163` calls `getGraphFreshness(process.cwd())`, then `status.ts:189` through `status.ts:194` builds a readiness block with `action:"none"` and a generic status-probe reason. That means an empty graph, a 51-file stale set, and a git-HEAD full-scan requirement can appear as freshness/trust changes without the actionable `full_scan` vs `selective_reindex` distinction already available inside readiness detection.

The helper shape is already present, but private. `ensure-ready.ts:141` through `ensure-ready.ts:226` has `detectState(rootDir)`, which computes `freshness`, `action`, stale files, deleted files, and reason without indexing. `getGraphFreshness` at `ensure-ready.ts:461` through `ensure-ready.ts:467` catches probe crashes but returns only the enum. `ensureCodeGraphReady` cannot simply be reused by status because it has a 5s cache (`ensure-ready.ts:300` through `ensure-ready.ts:338`), removes deleted tracked files while probing (`ensure-ready.ts:341` through `ensure-ready.ts:342`), and may perform inline indexing later in the same function. That conflicts with the handler README's explicit status contract: `handlers/README.md:19` through `handlers/README.md:20` says `status.ts` is non-mutating.

Implementation sketch:

```ts
export function getGraphReadinessSnapshot(rootDir: string): ReadyResult {
  try {
    const state = detectState(rootDir);
    return {
      freshness: state.freshness,
      action: state.action,
      ...(state.action === 'selective_reindex' ? { files: state.staleFiles } : {}),
      inlineIndexPerformed: false,
      reason: state.reason,
      verificationGate: getVerificationGate(graphDb.getLastGoldVerification()),
    };
  } catch {
    return {
      freshness: 'error',
      action: 'none',
      inlineIndexPerformed: false,
      reason: 'status readiness snapshot crashed',
    };
  }
}
```

Patch `status.ts` to call `getGraphReadinessSnapshot(process.cwd())`, pass that object to `buildReadinessBlock`, and keep the existing top-level `freshness`, `canonicalReadiness`, and `trustState` fields derived from the same block. Do not call `cleanupDeletedTrackedFiles`, `indexFiles`, or the readiness debounce from this helper.

Test-ready assertions:
- Status with an empty mocked DB emits `data.readiness.action:"full_scan"`, `freshness:"empty"`, `canonicalReadiness:"missing"`, `trustState:"absent"`, and no index/cleanup calls.
- Status with 51 stale files emits `data.readiness.action:"full_scan"` and a reason containing the selective threshold.
- Status with one stale file emits `data.readiness.action:"selective_reindex"` and `data.readiness.files` with that file.
- Status with a probe crash emits `freshness:"error"` and `trustState:"unavailable"` via `buildReadinessBlock`, whose mapping is defined at `readiness-contract.ts:241` through `readiness-contract.ts:248`.
- The existing sibling-readiness test at `code-graph-siblings-readiness.vitest.ts:246` through `code-graph-siblings-readiness.vitest.ts:300` should be extended, not replaced, because it already checks status emits canonical readiness fields.

Watcher evidence still argues against changing debounce first. The watcher uses `DEFAULT_DEBOUNCE_MS=2000` (`file-watcher.ts:49`) plus chokidar write stability of 1000ms (`file-watcher.ts:251` through `file-watcher.ts:254`), clears repeated per-file timers (`file-watcher.ts:278` through `file-watcher.ts:296`), and already has bounded concurrency with content-hash dedupe (`file-watcher.ts:222` through `file-watcher.ts:239`, `file-watcher.ts:370` through `file-watcher.ts:385`). Without status-level action visibility, lowering debounce would be a latency guess rather than a fix targeted at the observed stale-status perception.

## Q-OPP: CocoIndex fork telemetry leverage

See iteration-006. No new contradiction found this pass. Keep the recommendation as telemetry/provenance passthrough on Code Graph CocoIndex seeds, not downstream reranking in `mcp_server/lib/search`.

## Q-ARCH: intelligence-system seams (light touch)

The two final synthesis candidates still hold:
- Target authority vs recovered context: mutating delegation needs an explicit authority token, not inferred memory/bootstrap context.
- Readiness action vs freshness label: status/read/search surfaces should expose the same action-oriented readiness vocabulary, while preserving non-mutating status behavior.

## Sources read this iteration (delta from prior)
- `.opencode/skill/sk-deep-research/SKILL.md`
- `.opencode/skill/system-spec-kit/SKILL.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/011-post-stress-followup-research/research/deep-research-strategy.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/011-post-stress-followup-research/research/iterations/iteration-005.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/011-post-stress-followup-research/research/iterations/iteration-006.md`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/readiness-contract.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-query-fallback-decision.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/deep-loop/executor-config.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-siblings-readiness.vitest.ts`

## Suggested focus for iteration 8

Mark Q-P0, Q-P1, and Q-P2 as answered if no new contradictions appear. Spend iteration 8 on finalizing Q-OPP schema details and turning Q-ARCH into exactly 1-2 scoped downstream packet candidates, with no broad architecture refactor.
