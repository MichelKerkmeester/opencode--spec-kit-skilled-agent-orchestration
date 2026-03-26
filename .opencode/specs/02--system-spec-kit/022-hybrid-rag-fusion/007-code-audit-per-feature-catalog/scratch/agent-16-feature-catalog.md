## Agent 16a - retrieval/query doc split

- Scope completed: retrieval/query-related feature-catalog docs only.
- Updated `feature_catalog/FEATURE_CATALOG.md` summary lines for `memory_context`, RSF shadow mode, and local GGUF reranker behavior.
- Corrected `memory_context` session semantics to reflect caller-scoped reuse: cross-turn dedup and resume context require a caller-supplied `sessionId`; anonymous calls receive an ephemeral UUID for that invocation only.
- Corrected RSF status to reflect current runtime reality: RSF module/tests remain, but the live hybrid-search branch and `isRsfEnabled()` guard were removed; `SPECKIT_RSF_FUSION` is inert for production ranking.
- Corrected local reranker activation details to match current gate logic: strict `RERANKER_LOCAL=true`, rollout-gated enablement, readable model file, and total-memory thresholds of 8GB default / 2GB with custom model path.
- Corrected local reranker fallback wording to match implementation: when the local path cannot run or fails, it returns the incoming order unchanged rather than introducing a separate RSF/RRF fallback step.
- Checks to run/record after edit: targeted diff review and spec validation for `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion`.

## Agent 16b - eval/health doc split

- Updated reporting-dashboard summaries to match runtime behavior: sprint labels come from `metadata.sprint`/`metadata.sprintLabel` with `run-{eval_run_id}` fallback; trend comparisons use each sprint group's latest metric values.
- Documented the two dashboard limits separately: request `limit` trims sprint groups after grouping, while `SPECKIT_DASHBOARD_LIMIT` caps raw SQL rows.
- Reduced the reporting-dashboard source inventory to directly relevant handler/lib/test files instead of broad transitive references.
- Updated memory-health auto-repair docs to reflect runtime scope: confirmation-only response when `autoRepair:true` lacks `confirmed:true`, and auto-repair only applies in `reportMode:"full"`.
- Corrected the repair-action inventory to the actual runtime actions (`fts_rebuild`, `trigger_cache_refresh`, orphan-edge cleanup) and reduced the source inventory to directly relevant files/tests.

## Agent 16c - repair-action micro-fix

- Added `fts_consistency_verified` to the documented `repair.actions` inventory so the feature entry matches the handler payload after successful FTS rebuild verification.
