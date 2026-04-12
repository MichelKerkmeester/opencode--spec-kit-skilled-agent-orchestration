---
title: "Iteration 032 — Shadow-compare equivalence metric and activation rules"
iteration: 32
band: F
timestamp: 2026-04-11T13:03:49Z
worker: cli-codex gpt-5.4 xhigh fast
scope: q8_q9_shadow_compare
status: complete
focus: "Define what shadow-compare equivalence means, acceptance thresholds per query class, divergence detection, auto-disable rules, golden-set fixture design, and shadow-only → dual-write state transitions."
maps_to_questions: [Q8, Q9]
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["research/iterations/iteration-032.md"]

---
# Iteration 032 — Shadow-compare equivalence metric and activation rules

## 1. Goal
Shadow-compare is the Gate C and D0 reducer that answers one narrow question: is the new save/read path close enough to legacy, per query class, to safely advance rollout?
It proves:
- live dual-write parity is within class-specific tolerances
- divergence is visible early enough to block promotion or force rollback
- rollout state changes are evidence-based instead of anecdotal
It does not prove:
- that legacy was semantically perfect
- that every unseen future query will behave well
- that regression, latency, and operator UX gates can be skipped
Interpretation:
- online shadow-compare is a parity test against legacy
- offline golden-set replay is the truth-correction layer when divergence may reflect legacy weakness rather than new-path failure

## 2. Equivalence definition
Use two layers:
1. Online parity metric on sampled dual-write traffic
2. Offline weekly golden-set replay with judged relevance
Metric formulas:
```text
topk_hit_rate@K = |legacy_topK ∩ new_topK| / K
weighted_overlap@K = sum(weight_i * 1[legacy_rank_i appears anywhere in new_topK]) / sum(weight_i)
jaccard@K = |legacy_pageK ∩ new_pageK| / |legacy_pageK ∪ new_pageK|
kendall_tau@K = rank-order correlation between legacy_topK paths and new_topK paths
exact_target_match = 1 if the expected anchor/path/trigger target is identical, else 0
```
Primary metric by class:
| Query class | Primary metric | Secondary guard | Why |
|---|---|---|---|
| `resume` | `weighted_overlap@3` weights `[1.0, 0.7, 0.4]` | `rank1_exact_match` | Resume is top-heavy and human-critical. |
| `search:add_feature` | `topk_hit_rate@5` | weekly `ndcg@10` | Coverage matters more than exact order. |
| `search:fix_bug` | `weighted_overlap@5` weights `[1.0, 0.8, 0.6, 0.3, 0.2]` | `rank1_in_top3` | Debugging punishes top-slot misses. |
| `search:refactor` | `topk_hit_rate@5` | weekly `ndcg@10` | Several structural anchors may be equally valid. |
| `search:understand` | `jaccard@10` | weekly `ndcg@10` | Broad first-page parity is enough. |
| `causal_graph` | `kendall_tau@5` | `primary_path_exact_match` | Ordered explanation paths are the product. |
| `trigger_match` | `exact_target_match` | latency ratio guard | Trigger behavior is binary, not fuzzy ranking. |
Principles:
- no single universal metric
- top-slot misses cost more for `resume`, `fix_bug`, and `trigger_match`
- `causal_graph` is path-order quality, not generic hit overlap
- NDCG belongs in the golden set, not the hot-path reducer

## 3. Query classes
Acceptance thresholds:
| Query class | Primary metric | Accept threshold | Severe threshold | Min sample / window | Notes |
|---|---|---:|---:|---:|---|
| `resume` | `weighted_overlap@3` | `>= 0.98` | `< 0.95` | `200 / 30m` | Also require `rank1_exact_match >= 0.95`. |
| `search:add_feature` | `topk_hit_rate@5` | `>= 0.92` | `< 0.88` | `300 / 2h` | Weekly `ndcg@10` cannot trail legacy by more than `0.01`. |
| `search:fix_bug` | `weighted_overlap@5` | `>= 0.95` | `< 0.92` | `200 / 1h` | Also require legacy rank 1 in new top 3 at `>= 0.90`. |
| `search:refactor` | `topk_hit_rate@5` | `>= 0.90` | `< 0.86` | `250 / 2h` | Moderate tolerance. |
| `search:understand` | `jaccard@10` | `>= 0.85` | `< 0.80` | `300 / 4h` | Lowest bar because breadth matters most. |
| `causal_graph` | `kendall_tau@5` | `>= 0.90` | `< 0.85` | `100 / 2h` | Also require `primary_path_exact_match >= 0.95`. |
| `trigger_match` | `exact_target_match` | `= 1.000` | `< 1.000` | `50 / 30m` | Zero tolerance. |
Why the bars differ:
- `resume` is the operator recovery surface, so it gets the highest bar
- `fix_bug` is next because bad ranking wastes debugging cycles
- `trigger_match` is exact because "almost matched" is still a miss
- `understand` can tolerate the most variance because equivalent background docs are common

## 4. Golden-set fixture
Corpus size: 180 judged queries.
| Class | Count |
|---|---:|
| `resume` | 40 |
| `search:add_feature` | 30 |
| `search:fix_bug` | 30 |
| `search:refactor` | 25 |
| `search:understand` | 25 |
| `causal_graph` | 20 |
| `trigger_match` | 10 |
Selection strategy:
- 50% anonymized real traffic from `resume`, `memory_context`, `memory_search`, and trigger flows
- 25% variants of the 13 regression scenarios from iteration 025
- 25% adversarial edge cases: archived-only fallback, stale handover, trigger collisions, mixed tier anchors, competing causal paths
Fixture shape:
- one canonical packet with dense anchor coverage
- one archived-only packet
- one mixed packet with fresh and archived content
- one causal two-hop packet with competing paths
- one trigger-heavy packet with near collisions
- one scoped shared-memory packet to verify governance-preserving parity
Refresh cadence and ownership:
- refresh weekly through Gate C
- refresh at D0 start and D0 end
- refresh monthly after canonical if legacy remains available for background compare
- freeze the corpus inside a promotion window
- retrieval owner curates, QA signs off, on-call approves changes that alter pass/fail

## 5. Sampling cadence
| Stage | Global sample rate | Forced 100% classes | Reason |
|---|---:|---|---|
| Gate C, first 7 days | 100% | all | Establish baseline fast. |
| Gate C, remaining days | 25% | `resume`, `search:fix_bug`, `causal_graph`, `trigger_match` | Keep expensive classes dense. |
| D0 observation window | 10% | same flagged classes | Sustain measurement at lower cost. |
| 24h after any retrieval/save deploy | 50% | same flagged classes | Treat deploys as temporary risk spikes. |
| Canonical steady state | 1% | flagged classes at 10% | Background drift detector. |
| Active incident | 100% for affected class | affected class | Reconstruct failure quickly. |
Rules:
- sample the first 500 requests after any bucket change
- always sample canary tenants and synthetic probes
- keep `trigger_match` at 100% while dual-write is proving correctness

## 6. Divergence detection reducer
Each sampled request emits a JSONL row with timestamp, class, rollout state, legacy IDs/ranks, new IDs/ranks, legacy and new latency, primary metric value, and guard values.
Reducer pseudocode:
```python
WINDOWS = {"5m": minutes(5), "30m": minutes(30), "1h": hours(1), "2h": hours(2), "4h": hours(4), "24h": hours(24)}

RULES = {
    "resume": {"metric": "weighted_overlap@3", "threshold": 0.98, "severe": 0.95, "scope": "global_read_path"},
    "search:add_feature": {"metric": "topk_hit_rate@5", "threshold": 0.92, "severe": 0.88, "scope": "intent:add_feature"},
    "search:fix_bug": {"metric": "weighted_overlap@5", "threshold": 0.95, "severe": 0.92, "scope": "intent:fix_bug"},
    "search:refactor": {"metric": "topk_hit_rate@5", "threshold": 0.90, "severe": 0.86, "scope": "intent:refactor"},
    "search:understand": {"metric": "jaccard@10", "threshold": 0.85, "severe": 0.80, "scope": "intent:understand"},
    "causal_graph": {"metric": "kendall_tau@5", "threshold": 0.90, "severe": 0.85, "scope": "causal_graph"},
    "trigger_match": {"metric": "exact_target_match", "threshold": 1.0, "severe": 0.999999, "scope": "trigger_match"},
}

MIN_SAMPLES = {
    "resume": {"30m": 200},
    "search:add_feature": {"2h": 300},
    "search:fix_bug": {"1h": 200},
    "search:refactor": {"2h": 250},
    "search:understand": {"4h": 300},
    "causal_graph": {"2h": 100},
    "trigger_match": {"30m": 50},
}

def recent(rows, now, window_name):
    cutoff = now - WINDOWS[window_name]
    return [r for r in rows if r["ts"] >= cutoff]

def aggregate(rows):
    primary = [r["evaluation"]["primary_value"] for r in rows]
    latency = [r["new_latency_ms"] / max(r["legacy_latency_ms"], 1) for r in rows]
    return {
        "count": len(rows),
        "primary_mean": mean(primary),
        "primary_p10": percentile(primary, 10),
        "primary_ewma": ewma(primary, alpha=0.25),
        "latency_ratio_p95": percentile(latency, 95),
        "rank1_exact_rate": rate(rows, "rank1_exact_match"),
        "rank1_top3_rate": rate(rows, "rank1_in_top3"),
        "primary_path_exact_rate": rate(rows, "primary_path_exact_match"),
        "worst_examples": worst(rows, limit=5),
    }

def guard_failed(class_name, s):
    if class_name == "resume": return s["rank1_exact_rate"] < 0.95
    if class_name == "search:fix_bug": return s["rank1_top3_rate"] < 0.90
    if class_name == "causal_graph": return s["primary_path_exact_rate"] < 0.95
    if class_name == "trigger_match": return s["latency_ratio_p95"] > 1.25 or s["primary_mean"] < 1.0
    return False

def classify_window(class_name, summary, window_name):
    if summary["count"] < MIN_SAMPLES[class_name].get(window_name, 0):
        return {"status": "insufficient_sample", "summary": summary}
    rules = RULES[class_name]
    if summary["primary_mean"] < rules["severe"] or guard_failed(class_name, summary):
        return {"status": "severe", "summary": summary}
    if summary["primary_mean"] < rules["threshold"]:
        return {"status": "breach", "summary": summary}
    return {"status": "healthy", "summary": summary}

def recommended_action(class_name):
    if class_name in ("resume", "trigger_match"): return "flip_to_shadow_only"
    if class_name in ("search:fix_bug", "causal_graph"): return "disable_class_and_step_back_one_bucket"
    return "step_back_one_bucket_and_freeze_promotion"

def reduce_shadow_compare(jsonl_rows, now):
    trend, divergence_events, alerts = [], [], []
    for class_name in RULES.keys():
        class_rows = [r for r in jsonl_rows if r["class"] == class_name]
        states = {}
        for window_name in WINDOWS.keys():
            rows = recent(class_rows, now, window_name)
            if not rows: continue
            summary = aggregate(rows)
            state = classify_window(class_name, summary, window_name)
            states[window_name] = state
            trend.append({
                "class": class_name,
                "window": window_name,
                "status": state["status"],
                "primary_mean": summary["primary_mean"],
                "sample_count": summary["count"],
            })
        bad = [w for w, s in states.items() if s["status"] in ("breach", "severe")]
        severe = [w for w, s in states.items() if s["status"] == "severe"]
        if severe or len(bad) >= 2:
            window = severe[0] if severe else bad[0]
            summary = states[window]["summary"]
            divergence_events.append({
                "span": "shadow.compare.divergence_detected",
                "class": class_name,
                "window": window,
                "observed_primary": summary["primary_mean"],
                "sample_count": summary["count"],
                "examples": summary["worst_examples"],
            })
            alerts.append({
                "class": class_name,
                "flag_scope": RULES[class_name]["scope"],
                "recommended_action": recommended_action(class_name),
                "threshold": RULES[class_name]["threshold"],
                "observed_primary": summary["primary_mean"],
            })
    return {"metric_trend": trend, "divergence_events": divergence_events, "alerts": alerts}
```
Reducer outputs:
- per-class metric trend by window
- divergence events when thresholds or guards fail
- alert payload with class, scope, observed value, threshold, and rollback recommendation

## 7. Auto-disable rule
| Class | Auto-disable trigger | Action | Escalation |
|---|---|---|---|
| `resume` | severe breach for 2 consecutive `5m` windows or any guard breach with `>= 25` samples | flip global read path to `shadow_only` immediately | page |
| `search:fix_bug` | severe breach for 3 consecutive `10m` windows | disable new path for `fix_bug`, step back one bucket | page |
| `causal_graph` | `tau < 0.85` or primary-path match `< 0.90` for 2 consecutive `15m` windows | disable new causal path, use legacy | page |
| `trigger_match` | any target miss in `30m` with `>= 20` samples | disable new trigger path immediately | page |
| `search:add_feature` | threshold breach for `1h` | step back one bucket, freeze promotion | Slack + ticket |
| `search:refactor` | threshold breach for `1h` | step back one bucket | Slack + ticket |
| `search:understand` | severe breach for `2h` | freeze promotion, continue observation only | ticket |
Cross-class rule: if two or more noncritical classes hit severe breach in the same `30m` window, step the whole rollout back one bucket even if each class would otherwise only trigger intent-scoped rollback.

## 8. State transitions (feature flag)
| From | To | Required shadow-compare evidence |
|---|---|---|
| `shadow_only` | `dual_write_10` | golden set exists, regression scenarios green, reducer/dashboards live, synthetic probes healthy |
| `dual_write_10` | `dual_write_50` | 24h live traffic, all classes above threshold, zero auto-disable events, minimum sample counts reached |
| `dual_write_50` | `dual_write_100` | 72h live traffic, flagged classes healthy in every `30m` window, latency p95 delta within `+10%`, weekly golden set still passes |
| `dual_write_100` | `canonical` | D0 observation complete, no unresolved divergence incident, manual playbooks pass, no severe breach in trailing 7 days |
| `canonical` | `legacy_cleanup` | 30 days stable canonical operation, background shadow sample healthy, no class on rollback watchlist |
Rules:
- never skip a bucket
- any auto-disable resets the clock for the current bucket
- `resume`, `trigger_match`, and `causal_graph` must each pass independently; no averaging into one global score

## 9. Observability
Required spans:
- `shadow.compare.eval`
- `shadow.compare.divergence_detected`
Required `shadow.compare.eval` fields:
- `query.class`, `rollout.state`, `primary.metric`, `primary.value`
- `legacy.latency_ms`, `new.latency_ms`
- `rank1_exact_match`, `primary_path_exact_match`
Required dashboard panels:
- per-class primary metric vs threshold
- per-class sample volume and sampling rate
- rank-1 exact match for `resume`, `fix_bug`, `trigger_match`
- `kendall_tau@5` and primary-path exact match for `causal_graph`
- new-vs-legacy latency p95 delta
- divergence events timeline with flag-state overlays
- recent automatic rollbacks
- weekly golden-set scorecard
- top divergent examples table
Alert escalation:
- page for `resume`, `trigger_match`, `causal_graph`, `fix_bug` severe breaches
- Slack + incident ticket for `add_feature` and `refactor`
- ticket only for `understand` unless it participates in a cross-class incident

## 10. Ruled Out
- Exact set match for all search classes: too strict and improvement-hostile.
- Plain top-K hit rate for `resume`: too weak because top-slot misses matter more.
- Jaccard for `fix_bug`: too rank-blind for debugging.
- Rank correlation for `understand`: too sensitive for naturally broad first pages.
- NDCG as the online primary metric: too expensive and judgment-dependent for Gate C hot-path use.
- Raw score delta between legacy and new ranking scores: not a stable contract across implementations.

## Findings
- **F32.1**: Shadow-compare must be class-specific, not a single global parity score.
- **F32.2**: The online reducer should stay cheap and legacy-relative; the golden set is the truth-correction layer.
- **F32.3**: `resume`, `trigger_match`, and `causal_graph` need hard independent gates because they are not safely represented by averages.
- **F32.4**: Auto-disable needs both class-scoped and global rollback paths.
- **F32.5**: The clean shadow-compare rollout is `shadow_only -> dual_write_10 -> dual_write_50 -> dual_write_100 -> canonical -> legacy_cleanup`, with promotion reset on rollback.
