# Wave 8: Feature Flag Sunset Review — Sprint 3

## Audit Date: 2026-02-27
## Scope: SPECKIT_* flags in `.opencode/skill/system-spec-kit/mcp_server/lib/`

---

## Complete Flag Inventory

### Sprint 1 Flags (4 flags — managed by Sprint 1)

| Flag | Location | Default | Purpose |
|------|----------|---------|---------|
| `SPECKIT_DEGREE_BOOST` | hybrid-search.ts:488 | disabled | 5th RRF channel (degree centrality) |
| `SPECKIT_SIGNAL_VOCAB` | trigger-matcher.ts:493 | disabled | Signal vocabulary detection in trigger matching |
| `SPECKIT_CONSUMPTION_LOG` | consumption-logger.ts:65 | enabled | Consumption telemetry logging |
| `SPECKIT_TOKEN_BUDGET` | hybrid-search.ts:765 | 2000 (numeric) | Static token budget override |

### Sprint 2 Flags (5 flags — managed by Sprint 2)

| Flag | Location | Default | Purpose |
|------|----------|---------|---------|
| `SPECKIT_INTERFERENCE_SCORE` | interference-scoring.ts:259 | disabled | Interference penalty on similar memories |
| `SPECKIT_NOVELTY_BOOST` | composite-scoring.ts:411 | disabled | N4 cold-start detection boost |
| `SPECKIT_SCORE_NORMALIZATION` | rrf-fusion.ts:355, composite-scoring.ts:716 | disabled | Min-max normalize RRF/composite scores to [0,1] |
| `SPECKIT_FOLDER_SCORING` | folder-relevance.ts:27 | disabled | Folder-level relevance scoring |
| `SPECKIT_CLASSIFICATION_DECAY` | fsrs-scheduler.ts:346 | disabled | Classification-dependent stability in FSRS |

### Sprint 3 Flags (5 flags — this sprint)

| Flag | Location | Default | Purpose |
|------|----------|---------|---------|
| `SPECKIT_COMPLEXITY_ROUTER` | query-classifier.ts:48 | disabled | R15 query complexity routing |
| `SPECKIT_RSF_FUSION` | rsf-fusion.ts:378 | disabled | RSF (Relative Score Fusion) opt-in |
| `SPECKIT_CHANNEL_MIN_REP` | channel-representation.ts:72 | disabled | R2 channel minimum representation |
| `SPECKIT_CONFIDENCE_TRUNCATION` | confidence-truncation.ts:50 | disabled | Confidence gap-based result truncation |
| `SPECKIT_DYNAMIC_TOKEN_BUDGET` | dynamic-token-budget.ts:51 | disabled | Tier-based token budget allocation |

### Pre-Sprint / Infrastructure Flags (not sprint-owned)

| Flag | Location | Default | Purpose |
|------|----------|---------|---------|
| `SPECKIT_RRF` | rrf-fusion.ts:347 | enabled | Core RRF fusion (kill switch) |
| `SPECKIT_MMR` | search-flags.ts:13 | enabled | MMR reranking |
| `SPECKIT_TRM` | search-flags.ts:21 | enabled | Term matching |
| `SPECKIT_MULTI_QUERY` | search-flags.ts:29 | enabled | Multi-query expansion |
| `SPECKIT_CROSS_ENCODER` | search-flags.ts:37 | enabled | Cross-encoder reranking |
| `SPECKIT_GRAPH_UNIFIED` | graph-flags.ts:12 | enabled | Unified graph search |
| `SPECKIT_CAUSAL_BOOST` | causal-boost.ts:58 | enabled | Causal neighbor boost |
| `SPECKIT_SESSION_BOOST` | session-boost.ts:29 | disabled | Session-based score boost |
| `SPECKIT_WORKING_MEMORY` | working-memory.ts:30 | enabled | Working memory sessions |
| `SPECKIT_ARCHIVAL` | archival-manager.ts:71 | enabled | Background archival |
| `SPECKIT_COACTIVATION` | co-activation.ts:16 | enabled | Spreading activation |
| `SPECKIT_COACTIVATION_STRENGTH` | co-activation.ts:17 | 0.15 (numeric) | Coactivation boost factor |
| `SPECKIT_RELATIONS` | corrections.ts:119 | enabled | Correction tracking |
| `SPECKIT_ROLLOUT_PERCENT` | rollout-policy.ts:8 | 100 (numeric) | Feature rollout percentage |
| `SPECKIT_EXTENDED_TELEMETRY` | retrieval-telemetry.ts:21 | enabled | Extended telemetry metrics |
| `SPECKIT_EXTRACTION` | extraction-adapter.ts:71 | disabled | Post-tool extraction pipeline |
| `SPECKIT_ADAPTIVE_FUSION` | adaptive-fusion.ts:82 | disabled | Intent-aware weighted RRF |
| `SPECKIT_EVENT_DECAY` | working-memory.ts:491 | disabled | Event-based attention decay |
| `SPECKIT_DEBUG` | co-activation.ts:349 | disabled | Debug logging |
| `SPECKIT_EVAL_LOGGING` | eval-logger.ts:22 | disabled | Eval framework logging |
| `SPECKIT_PRESSURE_POLICY` | (referenced in docs) | disabled | Pressure-aware token budget |
| `SPECKIT_REDACTION_GATE` | (referenced in docs) | enabled | PII redaction gate |

---

## Sprint 3 Flag Count: 5 Active Flags

### Count Against Limit (<=6 per sprint)

Sprint 3 owns **5 flags**:
1. `SPECKIT_COMPLEXITY_ROUTER`
2. `SPECKIT_RSF_FUSION`
3. `SPECKIT_CHANNEL_MIN_REP`
4. `SPECKIT_CONFIDENCE_TRUNCATION`
5. `SPECKIT_DYNAMIC_TOKEN_BUDGET`

**Result: 5/6 — WITHIN LIMIT**

Note: `SPECKIT_DYNAMIC_TOKEN_BUDGET` was found in `dynamic-token-budget.ts` (Sprint 3, T007 per module header). This IS a Sprint 3 flag despite not being listed in the original "known Sprint 3" flags. The S3-C1 agent implemented it as part of the Sprint 3 work.

---

## Sunset Recommendations for Sprint 3 Flags

### KEEP (needs more measurement time)

| Flag | Reason |
|------|--------|
| `SPECKIT_COMPLEXITY_ROUTER` | Core Sprint 3 feature (R15). Needs live dark-run measurement to verify p95 latency before graduation to default-on. Keep as opt-in. |
| `SPECKIT_CHANNEL_MIN_REP` | Core Sprint 3 feature (R2). Works well in unit tests but needs live precision measurement. Keep as opt-in. |
| `SPECKIT_CONFIDENCE_TRUNCATION` | New in Sprint 3. Truncation logic is sound from tests but needs live measurement of tail reduction impact. Keep as opt-in. |
| `SPECKIT_DYNAMIC_TOKEN_BUDGET` | Tier-to-budget mapping is implemented and tested. Needs live measurement of context quality per tier. Keep as opt-in. |

### EVALUATE FOR SUNSET (conditional)

| Flag | Condition |
|------|-----------|
| `SPECKIT_RSF_FUSION` | Kendall tau analysis shows mean tau = 0.8507 (ACCEPT). RSF rankings are highly correlated with RRF. However, RSF is a replacement algorithm and switching mid-sprint is risky. Recommend: keep flag, enable in next sprint's dark-run if tau remains >= 0.4. |

### No flags recommended for immediate sunset

All 5 Sprint 3 flags are new features that were introduced in this sprint. None have had enough production exposure to warrant sunsetting (removing the flag and making them default-on). The standard graduation path is:
1. Sprint 3: introduce with flag (current state)
2. Next sprint: enable in dark-run, measure
3. Following sprint: graduate to default-on, remove flag

---

## Cross-Sprint Flag Observations

- Total flags across the codebase: ~27 unique flags (including infra flags)
- Sprint 1 flags (4): All still opt-in. `SPECKIT_DEGREE_BOOST` could be candidates for graduation if Sprint 1 measurements are positive.
- Sprint 2 flags (5): All still opt-in. These have had longer exposure but remain ungated in production.
- Infrastructure flags (~18): Most are enabled by default (kill switches). These are stable and do not count against per-sprint limits.
