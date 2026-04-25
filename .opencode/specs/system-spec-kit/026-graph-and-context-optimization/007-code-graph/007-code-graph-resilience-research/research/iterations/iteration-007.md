# Iteration 7 - Synthesis + Confidence-Floor + Self-Healing + Asset Materialization

## Summary

Iteration 7 answers Q9 and Q10 and materializes the final synthesis outputs. The confidence floor is a composite of readiness, scan persistence, age, gold-query pass rate, and edge drift signals. The self-healing boundary is intentionally narrow: auto partial re-scan is safe for bounded soft-stale states only, while full-scan and read-only impact flows must be explicit and operator-visible.

## Q9 Findings

The doctor command should tell the user "your graph is unreliable, do a full re-scan" when any hard-stale or confidence-floor signal is present:

1. `freshness` is `empty` or `error`, because those map to missing canonical readiness and `trustState:"absent"` or `trustState:"unavailable"`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/readiness-contract.ts:73-124`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:18-38`]
2. Readiness action is `full_scan`, including Git HEAD drift or more than 50 stale files. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:47-52`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:118-186`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:174-186`]
3. The scan has no persisted evidence (`lastScanAt`/`lastPersistedAt` missing), reports no graph data persisted, or leaves staged stale rows after a retry. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:40-64`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:247-284`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:227-248`]
4. Gold verification fails after a scan: overall pass rate below 90%, edge-focus bucket below 80%, or a critical expected symbol missing from top-K. [SOURCE: `research/iterations/iteration-004.md:59-354`; `research/iterations/iteration-006.md:40-43`]
5. Edge distribution or confidence drift crosses iteration 6's floors, especially edge share drift >30% relative, >5 percentage points absolute, PSI >= 0.25 review, JSD >= 0.10 warning, or blast-radius import coverage collapse after baseline. [SOURCE: `research/iterations/iteration-006.md:29-58`]

Soft warnings should not use the "unreliable full re-scan" wording. For 1-50 stale files, deleted-file cleanup, or scan age older than 8 hours without hard signals, doctor should say the graph is soft-stale and recommend selective re-scan or cleanup. Iteration 2's threshold table is preserved in `assets/staleness-model.md`. [SOURCE: `research/iterations/iteration-002.md:27-40`]

## Q10 Findings

Auto-triggered partial re-scan is viable only inside strict safety boundaries:

1. The stale set is bounded to existing tracked files and `stale.length <= 50`; this is the current selective reindex threshold. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:47-52`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:176-186`]
2. Git HEAD has not changed; otherwise readiness and explicit scan both require full reindex. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:118-145`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:174-186`]
3. The caller opts into inline indexing. `ensureCodeGraphReady` exposes `allowInlineIndex` and `allowInlineFullScan`; `detect_changes` disables both and blocks instead. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:38-41`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:245-264`]
4. The operation remains workspace-contained and bounded by timeout. The scan handler canonicalizes roots with `realpathSync` and rejects roots outside the workspace; auto-index has a 10-second timeout guard. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:135-168`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:47-49`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:189-224`]
5. Schema/corruption/error signals, repeated persistence errors, gold-query failures, or edge-drift failures must stop self-healing and surface an operator-visible full scan/recovery path. [SOURCE: `research/iterations/iteration-003.md:107-152`; `research/iterations/iteration-006.md:29-58`]

The safety boundary is therefore: auto partial re-scan for soft-stale query/context paths that explicitly allow inline indexing; no silent full scan; no silent repair on read-only impact/diff paths; and verification after any full repair or scan.

## Asset Materialization Status

| Output | Status |
|---|---|
| `assets/code-graph-gold-queries.json` | written |
| `assets/staleness-model.md` | written |
| `assets/recovery-playbook.md` | written |
| `assets/exclude-rule-confidence.json` | written |
| `research/research.md` | written |
| `decision-record.md` | written |

## Convergence Verdict

- newFindingsRatio: 0.34
- research_questions_answered_total: 10/10
- assets_materialized: 4/4
- research_md_synthesized: true
- decision_record_written: true
- verdict: CONVERGED
- stop_reason: max_iterations

## Files Reviewed

- `research/deep-research-strategy.md:1-80`
- `research/deep-research-state.jsonl:1-8`
- `research/iterations/iteration-001.md:1-76`
- `research/iterations/iteration-002.md:1-75`
- `research/iterations/iteration-003.md:1-187`
- `research/iterations/iteration-004.md:1-180`
- `research/iterations/iteration-005.md:1-76`
- `research/iterations/iteration-006.md:1-117`
- `research/deltas/iteration-001.json:1-27`
- `research/deltas/iteration-002.json:1-45`
- `research/deltas/iteration-003.json:1-52`
- `research/deltas/iteration-004.json:1-323`
- `research/deltas/iteration-005.json:1-159`
- `research/deltas/iteration-006.json:1-205`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:1-405`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/readiness-contract.ts:1-249`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:1-77`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:120-288`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:80-280`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:50-120`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:380-424`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:675-715`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:850-1085`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1350-1548`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:112-120`
- `.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts:31-48`

## Convergence Signals

- newFindingsRatio: 0.34
- research_questions_answered: ["Q9", "Q10"]
- research_questions_answered_total: 10/10
- assets_materialized: 4/4
- source_diversity: prior iteration outputs, delta JSON, readiness code, scan handler, status handler, detect-changes handler, DB schema/stats code, structural-indexer code
- novelty justification: This iteration adds the final confidence-floor decision rules, narrows self-healing to bounded soft-stale states, and materializes all four asset files plus synthesis and decision record.
