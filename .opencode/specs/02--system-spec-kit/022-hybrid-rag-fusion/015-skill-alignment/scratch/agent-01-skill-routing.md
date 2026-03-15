## Findings

1. **RAG operations are under-modeled in `INTENT_SIGNALS`.**
   Section 2 routes only `PLAN/RESEARCH/IMPLEMENT/DEBUG/COMPLETE/MEMORY/HANDOVER/PHASE`, but the epic delivered retrieval quality engineering work (query complexity routing, RRF/normalization, reranking, dynamic token budgets, graph signals, and evaluation gates). There is no explicit intent bucket for retrieval tuning, scoring calibration, pipeline architecture, evaluation/ablation, or feature-flag rollout control.

2. **Keyword coverage is stale for post-022 vocabulary.**
   Existing keywords (for example `"implement"`, `"workflow"`, `"analyze"`) miss high-signal terms now common in this codebase: `rrf`, `rerank`, `mmr`, `ablation`, `recall@k`, `precision`, `f1`, `score normalization`, `complexity router`, `token budget`, `channel`, `feature flag`, `rollout`, `rollback`, `hydra`, `governance`, `shared memory`.

3. **`RESOURCE_MAP` does not route to newer high-value references that map to hybrid-RAG operations.**
   Section 2 currently maps mostly to generic template/validation/workflow docs. It does not route to references that directly support delivered RAG workflows:
   - `references/config/environment_variables.md` (graduated feature flags + rollout semantics)
   - `references/workflows/rollback_runbook.md` (flag disable/re-enable sequencing)
   - `references/memory/embedding_resilience.md` (fallback/degraded/offline retrieval behavior)
   - `references/memory/trigger_config.md` (trigger phrase tuning)
   - `references/workflows/execution_methods.md` (operational script surface)

4. **Smart routing command boosts are too narrow for memory/RAG command surface.**
   `COMMAND_BOOSTS` only includes `/spec_kit:*` prefixes; it does not boost MEMORY intent for commands like `/memory:save`, `/memory:context`, `/memory:manage`, `/memory:learn`, which are central to current retrieval and memory operations.

5. **Section 1 activation trigger examples are generic and partially misaligned with current workflows.**
   Current examples (`signup form`, `button alignment`, `user dashboard`) are product-feature examples, while this skill now supports advanced memory/retrieval architecture tasks. Also, `"analyze"` is listed as an activation keyword under file-modification triggers, which conflicts with the "When NOT to Use" guidance for pure exploration.

6. **Phase and rollout workflow signals are incomplete in Section 1 trigger patterns.**
   While Section 2 has a `PHASE` intent, Section 1 trigger patterns do not explicitly capture common decomposition and rollout language used in the epic (`sprint gate`, `phase split`, `child phase`, `flag sunset`, `canary`, `rollback`, `re-enable sequence`).

## Recommendations

1. **Add RAG-specific intents to smart routing (P0):**
   Introduce at least:
   - `RETRIEVAL_TUNING`
   - `SCORING_CALIBRATION`
   - `PIPELINE_ARCHITECTURE`
   - `EVALUATION`
   - `ROLLOUT_FLAGS`
   - `GOVERNANCE`

2. **Expand intent keywords with delivered-epic vocabulary (P0):**
   Add terms for RRF/MMR/rerank, normalization, complexity routing, token budgets, graph/co-activation/causal, Recall/F1/ablation/dashboard, rollout/rollback/feature flags/Hydra.

3. **Update `RESOURCE_MAP` to include RAG-operational references (P0):**
   - `ROLLOUT_FLAGS` → `references/config/environment_variables.md`, `references/workflows/rollback_runbook.md`
   - `RETRIEVAL_TUNING` / `PIPELINE_ARCHITECTURE` → `references/memory/embedding_resilience.md`, `references/workflows/execution_methods.md`
   - `MEMORY` (or new `TRIGGER_TUNING`) → `references/memory/trigger_config.md`

4. **Expand `COMMAND_BOOSTS` for memory command prefixes (P1):**
   Add boosts for `/memory:save`, `/memory:context`, `/memory:manage`, `/memory:learn` to reduce misclassification when users issue explicit memory/RAG commands.

5. **Refresh Section 1 activation examples and trigger list (P1):**
   Replace generic app/UI examples with system-spec-kit-native cases (for example: "tune reranker thresholds", "calibrate score normalization", "add rollout flag guardrail", "decompose 022 into child phases"). Remove or demote `"analyze"` from modification-trigger keywords to avoid false activation during exploration-only requests.

6. **Add explicit phase/rollout trigger phrases in Section 1 (P2):**
   Include terms such as `sprint gate`, `phase decomposition`, `child phase`, `flag sunset`, `rollback`, `re-enable`, `canary`, and `staged rollout` so activation language matches actual epic workflow patterns.

## Priority

- **Finding 1:** P0
- **Finding 2:** P0
- **Finding 3:** P0
- **Finding 4:** P1
- **Finding 5:** P1
- **Finding 6:** P2
