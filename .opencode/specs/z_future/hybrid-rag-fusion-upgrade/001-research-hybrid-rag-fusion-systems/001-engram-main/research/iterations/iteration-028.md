# Iteration 028: BENCHMARK & METRICS

## Focus
BENCHMARK & METRICS: What does this system measure? What metrics should we track for memory quality, retrieval accuracy, and system health?

## Findings
### Finding 1: Engram’s only first-class benchmark surface is inventory, not quality
- **Source**: `001-engram-main/external/internal/store/store.go:71-76,1588-1608`; `001-engram-main/external/internal/mcp/mcp.go:399-411`
- **What it does**: Engram’s built-in `mem_stats` surface returns only `total_sessions`, `total_observations`, `total_prompts`, and the active `projects` list.
- **Why it matters**: Those are useful capacity/adoption counters, but they are not retrieval-quality metrics. For Public, these belong in the baseline dashboard, not as a proxy for memory usefulness.
- **Recommendation**: adopt now
- **Impact**: medium

### Finding 2: Engram’s real memory-quality telemetry is hygiene metadata on each observation
- **Source**: `001-engram-main/external/internal/store/store.go:959-1056`; `001-engram-main/external/docs/ARCHITECTURE.md:86-95`
- **What it does**: Engram measures evolving-memory quality through `revision_count`, `duplicate_count`, `last_seen_at`, and `deleted_at`: topic-key upserts bump revisions, hash-window dedupe bumps duplicate counters, and soft-delete keeps rows out of search without losing history.
- **Why it matters**: This is a strong reminder that memory quality is partly corpus hygiene, not just ranking quality. Public already has `quality_score` and feedback confidence, but it should also expose explicit churn metrics such as revision rate, duplicate-suppression rate, soft-delete rate, and stale-memory rate.
- **Recommendation**: NEW FEATURE
- **Impact**: high

### Finding 3: Engram’s passive-capture path is instrumented with yield metrics we should copy
- **Source**: `001-engram-main/external/internal/store/store.go:3396-3495`; `001-engram-main/external/internal/mcp/mcp.go:565-590`
- **What it does**: `PassiveCaptureResult` reports `Extracted`, `Saved`, and `Duplicates`, and the MCP tool description explicitly frames duplicate skipping as a success case rather than an error.
- **Why it matters**: If Public adds a friendlier passive-learning or session-end capture wrapper, it should immediately log extraction yield, save yield, duplicate-skip rate, and zero-extraction rate. Those are the right first metrics for judging whether passive capture is useful or noisy.
- **Recommendation**: NEW FEATURE
- **Impact**: high

### Finding 4: In the code examined, Engram does not expose first-class retrieval-accuracy evaluation; Public already does
- **Source**: `001-engram-main/external/internal/mcp/mcp.go:41-46,50-74,399-590`; `001-engram-main/external/internal/store/store.go:1462-1547`; `.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:648-790`; `.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:83-179`; `.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:223-326`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:297-317,508-541`
- **What it does**: Engram exposes search, save, context, lifecycle, passive capture, and basic stats, but I did not find a first-class retrieval-evaluation surface analogous to Public’s `memory_validate` or `eval_run_ablation`. Public already records confidence/validation counts and can run channel ablations with persisted `Recall@20` deltas.
- **Why it matters**: Public’s benchmark backbone should be retrieval accuracy, not raw corpus counts. The core accuracy metrics to track are `Recall@K`, per-channel ablation deltas, positive-selection rate, selected-rank distribution, learned-feedback application rate, and confidence/validation trends.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 5: Public already has richer operational health telemetry than Engram; the gap is scorecarding, not instrumentation
- **Source**: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:126-154,205-320`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:296-594`; `.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:33-195`; `.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:667-749`; `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/status.ts:10-34`; `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-status.ts:10-40`; `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/status.ts:27-77`; `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:58-163`
- **What it does**: Public already measures memory totals/statuses/tier breakdowns, trigger counts, embedding retry state, FTS drift, repair actions, session quality, code-graph freshness, CocoIndex readiness, causal-link coverage, and deep-loop convergence signals.
- **Why it matters**: Engram’s simpler `mem_stats` should not tempt Public to shrink its telemetry model. The real missing piece is a unified benchmark surface that presents these as one operator-facing scorecard instead of many separate tools.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 6: Public’s benchmark model should be explicitly split into three planes
- **Source**: `.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:73-78,102-220,691-727`; `.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:767-790`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:520-610,724-807,904-934`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1134-1154`
- **What it does**: Public already exposes the ingredients for a 3-plane metric taxonomy:
  1. **Memory quality**: trigger coverage, anchor correctness, token budget, coherence, `quality_score`, confidence, validation count, promotion eligibility.
  2. **Retrieval accuracy**: `Recall@K`, ablation deltas, intent-confidence versus success, selected-rank distribution, learned-feedback application, exact-key/artifact-hit rate, fallback/evidence-gap rate.
  3. **System health**: embedding readiness, vector availability, FTS parity, alias conflicts, session quality, graph freshness, code-graph parse health, CocoIndex availability, causal coverage, convergence blockers.
- **Why it matters**: This is the clean benchmark architecture Public should use. A single blended “memory score” will hide whether failures come from bad memories, bad ranking, or broken infrastructure.
- **Recommendation**: adopt now
- **Impact**: high

## Assessment
- New information ratio: 0.57
- Fallback note: CocoIndex/semantic search was permission-blocked for this external path in-session, so this pass used targeted grep plus direct file reads.

## Recommended Next Focus
Design a concrete Public benchmark scorecard and eval schema that rolls up `quality_loop`, `memory_validate`, `eval_run_ablation`, `memory_health`, `session_health`, `code_graph_status`, `ccc_status`, and causal/coverage-graph signals into one report, then decide which missing hygiene metrics (`revision_rate`, `duplicate_rate`, passive-capture yield) need new storage.


Total usage est:        1 Premium request
API time spent:         3m 57s
Total session time:     4m 20s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  2.0m in, 16.1k out, 1.9m cached, 7.2k reasoning (Est. 1 Premium request)
