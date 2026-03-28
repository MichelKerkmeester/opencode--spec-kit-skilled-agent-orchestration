# Agent 3 Doc Alignment Summary

## Updated files

- `feature_catalog/01--retrieval/04-hybrid-search-pipeline.md`
  - Corrected fallback behavior to show that Tier 2 widening preserves caller-disabled channels instead of forcing every channel back on.
  - Added the lexical fallback constraint: only still-allowed lexical channels participate, using the same normalized lexical query path as the main search flow.
- `feature_catalog/01--retrieval/08-quality-aware-3-tier-search-fallback.md`
  - Matched the quality-aware fallback description to current runtime behavior: Tier 2 widens inside `allowedChannels`, and Tier 3 lexical fallback respects caller routing and archive filtering.
- `manual_testing_playbook/01--retrieval/004-hybrid-search-pipeline.md`
  - Reworked the scenario to validate multi-channel trace evidence, boosted-score alias consistency, and `useGraph:false` suppression of both graph and degree signals during fallback.
- `manual_testing_playbook/01--retrieval/109-quality-aware-3-tier-search-fallback.md`
  - Updated expected signals and execution notes so the scenario now proves channel-preserving fallback instead of the old "force all channels" behavior.
- `feature_catalog/04--maintenance/01-workspace-scanning-and-indexing-memoryindexscan.md`
  - Added the content-hash secondary change detector and documented that oversized batch requests clamp to a safe maximum with warning output.
- `feature_catalog/05--lifecycle/05-async-ingestion-job-lifecycle.md`
  - Added queue-time canonical-path dedup behavior, `duplicatePathCount`, and the duplicate-removal hint surfaced by `memory_ingest_start`.
- `manual_testing_playbook/05--lifecycle/097-async-ingestion-job-lifecycle-p0-3.md`
  - Expanded the scenario to prove duplicate-path dedup before queueing in addition to the lifecycle state machine.
- `feature_catalog/07--evaluation/01-ablation-studies-evalrunablation.md`
  - Added requested/resolved/missing query-ID behavior, the explicit alignment guard for orphaned or chunk-backed mappings, and clarified that synthetic zero token-usage rows are skipped from persistence.
- `feature_catalog/07--evaluation/02-reporting-dashboard-evalreportingdashboard.md`
  - Documented that sprint-group recency is chosen by `lastSeen`, that the report still renders chronologically, and that per-channel breakdown is preserved for kept sprint groups.
- `manual_testing_playbook/07--evaluation/026-ablation-studies-eval-run-ablation.md`
  - Added missing query-ID warning coverage to the focused ablation scenario so the playbook matches the new ablation report contract.
- `manual_testing_playbook/07--evaluation/027-reporting-dashboard-eval-reporting-dashboard.md`
  - Added sprint-group limit semantics and chronological rendering expectations to the dashboard scenario.
- `feature_catalog/11--scoring-and-calibration/03-interference-scoring.md`
  - Clarified that interference scoring only counts live peer memories and excludes chunk, archived, and deprecated rows.
- `manual_testing_playbook/11--scoring-and-calibration/025-interference-scoring-tm-01.md`
  - Updated the scenario to verify that inactive siblings do not inflate active interference penalties.
- `feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md`
  - Corrected `SPECKIT_SEARCH_FALLBACK` wording to match caller-preserving fallback behavior.
  - Clarified that `SPECKIT_GRAPH_WALK_ROLLOUT` supports only `off`, `trace_only`, and `bounded_runtime`, with unsupported values resolving through the live runtime resolver.
  - Added an explicit note that roadmap capability flags are live runtime resolvers, with canonical `SPECKIT_MEMORY_*` keys taking precedence over legacy `SPECKIT_HYDRA_*` aliases.
- `manual_testing_playbook/17--governance/148-shared-memory-disabled-by-default-and-first-run-setup.md`
  - Added partial `shared_space_upsert()` preservation coverage for `rolloutCohort` and `metadata`.
- `manual_testing_playbook/19--feature-flag-reference/125-hydra-roadmap-capability-flags.md`
  - Retargeted the scenario to the current runtime resolver contract: canonical `SPECKIT_MEMORY_*` precedence, legacy Hydra alias fallback, and separation from live `SPECKIT_GRAPH_UNIFIED`.
- `feature_catalog/FEATURE_CATALOG.md`
  - Updated the root catalog summaries for hybrid fallback and quality-aware fallback so the top-level reference matches the corrected split-entry behavior.
- `manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md`
  - Updated scenario `125` in the root playbook so the directory summary matches the new canonical-first roadmap resolver contract.
- `feature_catalog/feature_catalog_in_simple_terms.md`
  - Updated the plain-language summaries for hybrid fallback, workspace scanning, async ingestion, ablation, dashboard reporting, interference scoring, and feature-flag runtime resolution.

## Audited and left unchanged

- `feature_catalog/13--memory-quality-and-indexing/12-generation-time-duplicate-and-empty-content-prevention.md`
- `feature_catalog/13--memory-quality-and-indexing/16-dry-run-preflight-for-memory-save.md`
- `manual_testing_playbook/13--memory-quality-and-indexing/133-dry-run-preflight-for-memory-save.md`
- `manual_testing_playbook/13--memory-quality-and-indexing/200-generation-time-duplicate-and-empty-content-prevention.md`
- `feature_catalog/16--tooling-and-scripts/21-eval-runner-cli.md`
- `feature_catalog/16--tooling-and-scripts/31-evaluation-benchmark-and-import-policy-tooling.md`
- `manual_testing_playbook/16--tooling-and-scripts/235-eval-runner-cli.md`
- `manual_testing_playbook/16--tooling-and-scripts/245-evaluation-benchmark-and-import-policy-tooling.md`
- `feature_catalog/17--governance/04-shared-memory-rollout-deny-by-default-membership-and-kill-switch.md`
- `manual_testing_playbook/01--retrieval/143-bounded-graph-walk-rollout-and-diagnostics.md`

These files already matched the refined runtime behavior closely enough that no wording change was needed for this pass.

## Source-of-truth checks used

- `mcp_server/lib/search/hybrid-search.ts`
- `mcp_server/lib/search/search-flags.ts`
- `mcp_server/utils/batch-processor.ts`
- `mcp_server/handlers/memory-ingest.ts`
- `mcp_server/lib/eval/ablation-framework.ts`
- `mcp_server/lib/eval/reporting-dashboard.ts`
- `mcp_server/handlers/eval-reporting.ts`
- `mcp_server/lib/scoring/interference-scoring.ts`
- `mcp_server/lib/config/capability-flags.ts`

## Notes

- I did not change catalog or playbook entries whose current wording already matched the runtime fixes after review.
- I did not update root indexes because the affected per-entry files remain in the same locations and keep the same scenario/file references.
