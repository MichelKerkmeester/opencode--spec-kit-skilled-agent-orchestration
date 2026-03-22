# Feature Catalog — Per-Category Summary

> Source: `.opencode/skill/system-spec-kit/feature_catalog/`
> Generated: 2026-03-22
> Total categories: 19 | Total features: 220

---

## 01--retrieval
Features: 10
1. 01-unified-context-retrieval-memorycontext.md — "Unified context retrieval (memory_context)"
2. 02-semantic-and-lexical-search-memorysearch.md — "Semantic and lexical search (memory_search)"
3. 03-trigger-phrase-matching-memorymatchtriggers.md — "Trigger phrase matching (memory_match_triggers)"
4. 04-hybrid-search-pipeline.md — "Hybrid search pipeline"
5. 05-4-stage-pipeline-architecture.md — "4-stage pipeline architecture"
6. 06-bm25-trigger-phrase-re-index-gate.md — "BM25 trigger phrase re-index gate"
7. 07-ast-level-section-retrieval-tool.md — "AST-level section retrieval tool"
8. 08-quality-aware-3-tier-search-fallback.md — "Quality-aware 3-tier search fallback"
9. 09-tool-result-extraction-to-working-memory.md — "Tool-result extraction to working memory"
10. 10-fast-delegated-search-memory-quick-search.md — "Fast delegated search (memory_quick_search)"

## 02--mutation
Features: 10
1. 01-memory-indexing-memorysave.md — "Memory indexing (memory_save)"
2. 02-memory-metadata-update-memoryupdate.md — "Memory metadata update (memory_update)"
3. 03-single-and-folder-delete-memorydelete.md — "Single and folder delete (memory_delete)"
4. 04-tier-based-bulk-deletion-memorybulkdelete.md — "Tier-based bulk deletion (memory_bulk_delete)"
5. 05-validation-feedback-memoryvalidate.md — "Validation feedback (memory_validate)"
6. 06-transaction-wrappers-on-mutation-handlers.md — "Transaction wrappers on mutation handlers"
7. 07-namespace-management-crud-tools.md — "Namespace management CRUD tools"
8. 08-prediction-error-save-arbitration.md — "Prediction-error save arbitration"
9. 09-correction-tracking-with-undo.md — "Correction tracking with undo"
10. 10-per-memory-history-log.md — "Per-memory history log"

## 03--discovery
Features: 3
1. 01-memory-browser-memorylist.md — "Memory browser (memory_list)"
2. 02-system-statistics-memorystats.md — "System statistics (memory_stats)"
3. 03-health-diagnostics-memoryhealth.md — "Health diagnostics (memory_health)"

## 04--maintenance
Features: 2
1. 01-workspace-scanning-and-indexing-memoryindexscan.md — "Workspace scanning and indexing (memory_index_scan)"
2. 02-startup-runtime-compatibility-guards.md — "Startup runtime compatibility guards"

## 05--lifecycle
Features: 7
1. 01-checkpoint-creation-checkpointcreate.md — "Checkpoint creation (checkpoint_create)"
2. 02-checkpoint-listing-checkpointlist.md — "Checkpoint listing (checkpoint_list)"
3. 03-checkpoint-restore-checkpointrestore.md — "Checkpoint restore (checkpoint_restore)"
4. 04-checkpoint-deletion-checkpointdelete.md — "Checkpoint deletion (checkpoint_delete)"
5. 05-async-ingestion-job-lifecycle.md — "Async ingestion job lifecycle"
6. 06-startup-pending-file-recovery.md — "Startup pending-file recovery"
7. 07-automatic-archival-subsystem.md — "Automatic archival subsystem"

## 06--analysis
Features: 7
1. 01-causal-edge-creation-memorycausallink.md — "Causal edge creation (memory_causal_link)"
2. 02-causal-graph-statistics-memorycausalstats.md — "Causal graph statistics (memory_causal_stats)"
3. 03-causal-edge-deletion-memorycausalunlink.md — "Causal edge deletion (memory_causal_unlink)"
4. 04-causal-chain-tracing-memorydriftwhy.md — "Causal chain tracing (memory_drift_why)"
5. 05-epistemic-baseline-capture-taskpreflight.md — "Epistemic baseline capture (task_preflight)"
6. 06-post-task-learning-measurement-taskpostflight.md — "Post-task learning measurement (task_postflight)"
7. 07-learning-history-memorygetlearninghistory.md — "Learning history (memory_get_learning_history)"

## 07--evaluation
Features: 2
1. 01-ablation-studies-evalrunablation.md — "Ablation studies (eval_run_ablation)"
2. 02-reporting-dashboard-evalreportingdashboard.md — "Reporting dashboard (eval_reporting_dashboard)"

## 08--bug-fixes-and-data-integrity
Features: 11
1. 01-graph-channel-id-fix.md — "Graph channel ID fix"
2. 02-chunk-collapse-deduplication.md — "Chunk collapse deduplication"
3. 03-co-activation-fan-effect-divisor.md — "Co-activation fan-effect divisor"
4. 04-sha-256-content-hash-deduplication.md — "SHA-256 content-hash deduplication"
5. 05-database-and-schema-safety.md — "Database and schema safety"
6. 06-guards-and-edge-cases.md — "Guards and edge cases"
7. 07-canonical-id-dedup-hardening.md — "Canonical ID dedup hardening"
8. 08-mathmax-min-stack-overflow-elimination.md — "Math.max/min stack overflow elimination"
9. 09-session-manager-transaction-gap-fixes.md — "Session-manager transaction gap fixes"
10. 10-chunking-orchestrator-safe-swap.md — "Chunking Orchestrator Safe Swap"
11. 11-working-memory-timestamp-fix.md — "Working Memory Session Cleanup Timestamp Fix"

## 09--evaluation-and-measurement
Features: 16
1. 01-evaluation-database-and-schema.md — "Evaluation database and schema"
2. 02-core-metric-computation.md — "Core metric computation"
3. 03-observer-effect-mitigation.md — "Observer effect mitigation"
4. 04-full-context-ceiling-evaluation.md — "Full-context ceiling evaluation"
5. 05-quality-proxy-formula.md — "Quality proxy formula"
6. 06-synthetic-ground-truth-corpus.md — "Synthetic ground truth corpus"
7. 07-bm25-only-baseline.md — "BM25-only baseline"
8. 08-agent-consumption-instrumentation.md — "Agent consumption instrumentation"
9. 09-scoring-observability.md — "Scoring observability"
10. 10-full-reporting-and-ablation-study-framework.md — "Full reporting and ablation study framework"
11. 11-shadow-scoring-and-channel-attribution.md — "Shadow scoring and channel attribution"
12. 12-test-quality-improvements.md — "Test quality improvements"
13. 13-evaluation-and-housekeeping-fixes.md — "Evaluation and housekeeping fixes"
14. 14-cross-ai-validation-fixes.md — "Cross-AI validation fixes"
15. 15-memory-roadmap-baseline-snapshot.md — "Memory roadmap baseline snapshot"
16. 16-int8-quantization-evaluation.md — "INT8 quantization evaluation"

## 10--graph-signal-activation
Features: 16
1. 01-typed-weighted-degree-channel.md — "Typed-weighted degree channel"
2. 02-co-activation-boost-strength-increase.md — "Co-activation boost strength increase"
3. 03-edge-density-measurement.md — "Edge density measurement"
4. 04-weight-history-audit-tracking.md — "Weight history audit tracking"
5. 05-graph-momentum-scoring.md — "Graph momentum scoring"
6. 06-causal-depth-signal.md — "Causal depth signal"
7. 07-community-detection.md — "Community detection"
8. 08-graph-and-cognitive-memory-fixes.md — "Graph and cognitive memory fixes"
9. 09-anchor-tags-as-graph-nodes.md — "ANCHOR tags as graph nodes"
10. 10-causal-neighbor-boost-and-injection.md — "Causal neighbor boost and injection"
11. 11-temporal-contiguity-layer.md — "Temporal contiguity layer"
12. 12-unified-graph-retrieval-deterministic-ranking-explainability-and-rollback.md — "Unified graph retrieval, deterministic ranking, explainability, and rollback"
13. 13-graph-lifecycle-refresh.md — "Graph lifecycle refresh"
14. 14-llm-graph-backfill.md — "Async LLM graph backfill"
15. 15-graph-calibration-profiles.md — "Graph calibration profiles and community thresholds"
16. 16-typed-traversal.md — "Typed traversal"

## 11--scoring-and-calibration
Features: 23
1. 01-score-normalization.md — "Score normalization"
2. 02-cold-start-novelty-boost.md — "Cold-start novelty boost"
3. 03-interference-scoring.md — "Interference scoring"
4. 04-classification-based-decay.md — "Classification-based decay"
5. 05-folder-level-relevance-scoring.md — "Folder-level relevance scoring"
6. 06-embedding-cache.md — "Embedding cache"
7. 07-double-intent-weighting-investigation.md — "Double intent weighting investigation"
8. 08-rrf-k-value-sensitivity-analysis.md — "RRF K-value sensitivity analysis"
9. 09-negative-feedback-confidence-signal.md — "Negative feedback confidence signal"
10. 10-auto-promotion-on-validation.md — "Auto-promotion on validation"
11. 11-scoring-and-ranking-corrections.md — "Scoring and ranking corrections"
12. 12-stage-3-effectivescore-fallback-chain.md — "Stage 3 effectiveScore fallback chain"
13. 13-scoring-and-fusion-corrections.md — "Scoring and fusion corrections"
14. 14-local-gguf-reranker-via-node-llama-cpp.md — "Local GGUF reranker via node-llama-cpp"
15. 15-tool-level-ttl-cache.md — "Tool-level TTL cache"
16. 16-access-driven-popularity-scoring.md — "Access-driven popularity scoring"
17. 17-temporal-structural-coherence-scoring.md — "Temporal-structural coherence scoring"
18. 18-adaptive-shadow-ranking-bounded-proposals-and-rollback.md — "Adaptive shadow ranking, bounded proposals, and rollback"
19. 19-learned-stage2-weight-combiner.md — "Learned Stage 2 weight combiner"
20. 20-shadow-feedback-holdout-evaluation.md — "Shadow scoring with holdout evaluation"
21. 21-calibrated-overlap-bonus.md — "Calibrated overlap bonus"
22. 22-rrf-k-experimental.md — "RRF K experimental tuning"
23. 23-fusion-policy-shadow-v2.md — "Fusion policy shadow evaluation V2"

## 12--query-intelligence
Features: 11
1. 01-query-complexity-router.md — "Query complexity router"
2. 02-relative-score-fusion-in-shadow-mode.md — "Relative score fusion in shadow mode"
3. 03-channel-min-representation.md — "Channel min-representation"
4. 04-confidence-based-result-truncation.md — "Confidence-based result truncation"
5. 05-dynamic-token-budget-allocation.md — "Dynamic token budget allocation"
6. 06-query-expansion.md — "Query expansion"
7. 07-llm-query-reformulation.md — "LLM query reformulation"
8. 08-hyde-hypothetical-document-embeddings.md — "HyDE (Hypothetical Document Embeddings)"
9. 09-index-time-query-surrogates.md — "Index-time query surrogates"
10. 10-query-decomposition.md — "Query decomposition"
11. 11-graph-concept-routing.md — "Graph concept routing"

## 13--memory-quality-and-indexing
Features: 24
1. 01-verify-fix-verify-memory-quality-loop.md — "Verify-fix-verify memory quality loop"
2. 02-signal-vocabulary-expansion.md — "Signal vocabulary expansion"
3. 03-pre-flight-token-budget-validation.md — "Pre-flight token budget validation"
4. 04-spec-folder-description-discovery.md — "Spec folder description discovery"
5. 05-pre-storage-quality-gate.md — "Pre-storage quality gate"
6. 06-reconsolidation-on-save.md — "Reconsolidation-on-save"
7. 07-smarter-memory-content-generation.md — "Smarter memory content generation"
8. 08-anchor-aware-chunk-thinning.md — "Anchor-aware chunk thinning"
9. 09-encoding-intent-capture-at-index-time.md — "Encoding-intent capture at index time"
10. 10-auto-entity-extraction.md — "Auto entity extraction"
11. 11-content-aware-memory-filename-generation.md — "Content-aware memory filename generation"
12. 12-generation-time-duplicate-and-empty-content-prevention.md — "Generation-time duplicate and empty content prevention"
13. 13-entity-normalization-consolidation.md — "Entity normalization consolidation"
14. 14-quality-gate-timer-persistence.md — "Quality gate timer persistence"
15. 15-deferred-lexical-only-indexing.md — "Deferred lexical-only indexing"
16. 16-dry-run-preflight-for-memory-save.md — "Dry-run preflight for memory_save"
17. 17-outsourced-agent-memory-capture.md — "Outsourced agent handback protocol"
18. 18-session-enrichment-and-alignment-guards.md — "Session enrichment and alignment guards"
19. 19-post-save-quality-review.md — "Post-save quality review"
20. 20-weekly-batch-feedback-learning.md — "Weekly batch feedback learning"
21. 21-assistive-reconsolidation.md — "Assistive reconsolidation"
22. 22-implicit-feedback-log.md — "Implicit feedback log"
23. 23-hybrid-decay-policy.md — "Hybrid decay policy"
24. 24-save-quality-gate-exceptions.md — "Save quality gate exceptions"

## 14--pipeline-architecture
Features: 22
1. 01-4-stage-pipeline-refactor.md — "4-stage pipeline refactor"
2. 02-mpab-chunk-to-memory-aggregation.md — "MPAB chunk-to-memory aggregation"
3. 03-chunk-ordering-preservation.md — "Chunk ordering preservation"
4. 04-template-anchor-optimization.md — "Template anchor optimization"
5. 05-validation-signals-as-retrieval-metadata.md — "Validation signals as retrieval metadata"
6. 06-learned-relevance-feedback.md — "Learned relevance feedback"
7. 07-search-pipeline-safety.md — "Search pipeline safety"
8. 08-performance-improvements.md — "Performance improvements"
9. 09-activation-window-persistence.md — "Activation window persistence"
10. 10-legacy-v1-pipeline-removal.md — "Legacy V1 pipeline removal"
11. 11-pipeline-and-mutation-hardening.md — "Pipeline and mutation hardening"
12. 12-dbpath-extraction-and-import-standardization.md — "DB_PATH extraction and import standardization"
13. 13-strict-zod-schema-validation.md — "Strict Zod schema validation"
14. 14-dynamic-server-instructions-at-mcp-initialization.md — "Dynamic server instructions at MCP initialization"
15. 15-warm-server-daemon-mode.md — "Warm server / daemon mode"
16. 16-backend-storage-adapter-abstraction.md — "Backend storage adapter abstraction"
17. 17-cross-process-db-hot-rebinding.md — "Cross-process DB hot rebinding"
18. 18-atomic-write-then-index-api.md — "Atomic write-then-index API"
19. 19-embedding-retry-orchestrator.md — "Embedding retry orchestrator"
20. 20-7-layer-tool-architecture-metadata.md — "7-layer tool architecture metadata"
21. 21-atomic-pending-file-recovery.md — "Atomic pending-file recovery"
22. 22-lineage-state-active-projection-and-asof-resolution.md — "Lineage state active projection and asOf resolution"

## 15--retrieval-enhancements
Features: 9
1. 01-dual-scope-memory-auto-surface.md — "Dual-scope memory auto-surface"
2. 02-constitutional-memory-as-expert-knowledge-injection.md — "Constitutional memory as expert knowledge injection"
3. 03-spec-folder-hierarchy-as-retrieval-structure.md — "Spec folder hierarchy as retrieval structure"
4. 04-lightweight-consolidation.md — "Lightweight consolidation"
5. 05-memory-summary-search-channel.md — "Memory summary search channel"
6. 06-cross-document-entity-linking.md — "Cross-document entity linking"
7. 07-tier-2-fallback-channel-forcing.md — "Tier-2 fallback channel forcing"
8. 08-provenance-rich-response-envelopes.md — "Provenance-rich response envelopes"
9. 09-contextual-tree-injection.md — "Contextual tree injection"

## 16--tooling-and-scripts
Features: 17
1. 01-tree-thinning-for-spec-folder-consolidation.md — "Tree thinning for spec folder consolidation"
2. 02-architecture-boundary-enforcement.md — "Architecture boundary enforcement"
3. 03-progressive-validation-for-spec-documents.md — "Progressive validation for spec documents"
4. 04-dead-code-removal.md — "Dead code removal"
5. 05-code-standards-alignment.md — "Code standards alignment"
6. 06-real-time-filesystem-watching-with-chokidar.md — "Real-time filesystem watching with chokidar"
7. 07-standalone-admin-cli.md — "Standalone admin CLI"
8. 08-watcher-delete-rename-cleanup.md — "Watcher delete/rename cleanup"
9. 09-migration-checkpoint-scripts.md — "Migration checkpoint scripts"
10. 10-schema-compatibility-validation.md — "Schema compatibility validation"
11. 11-feature-catalog-code-references.md — "Feature catalog code references"
12. 12-session-capturing-pipeline-quality.md — "Session Capturing Pipeline Quality"
13. 13-constitutional-memory-manager-command.md — "Constitutional memory manager command"
14. 14-source-dist-alignment-enforcement.md — "Source-dist alignment enforcement"
15. 15-module-boundary-map.md — "Module boundary map"
16. 16-json-mode-hybrid-enrichment.md — "JSON mode structured summary hardening"
17. 17-json-primary-deprecation-posture.md — "JSON-only save contract"

## 17--governance
Features: 4
1. 01-feature-flag-governance.md — "Feature flag governance"
2. 02-feature-flag-sunset-audit.md — "Feature flag sunset audit"
3. 03-hierarchical-scope-governance-governed-ingest-retention-and-audit.md — "Hierarchical scope governance, governed ingest, retention, and audit"
4. 04-shared-memory-rollout-deny-by-default-membership-and-kill-switch.md — "Shared-memory rollout, deny-by-default membership, and kill switch"

## 18--ux-hooks
Features: 19
1. 01-shared-post-mutation-hook-wiring.md — "Shared post-mutation hook wiring"
2. 02-memory-health-autorepair-metadata.md — "Memory health autoRepair metadata"
3. 03-checkpoint-delete-confirmname-safety.md — "Checkpoint delete confirmName safety"
4. 04-schema-and-type-contract-synchronization.md — "Schema and type contract synchronization"
5. 05-dedicated-ux-hook-modules.md — "Dedicated UX hook modules"
6. 06-mutation-hook-result-contract-expansion.md — "Mutation hook result contract expansion"
7. 07-mutation-response-ux-payload-exposure.md — "Mutation response UX payload exposure"
8. 08-context-server-success-hint-append.md — "Context-server success-path hint append"
9. 09-duplicate-save-no-op-feedback-hardening.md — "Duplicate-save no-op feedback hardening"
10. 10-atomic-save-parity-and-partial-indexing-hints.md — "Atomic-save parity and partial-indexing hints"
11. 11-final-token-metadata-recomputation.md — "Final token metadata recomputation"
12. 12-hooks-readme-and-export-alignment.md — "Hooks README and export alignment"
13. 13-end-to-end-success-envelope-verification.md — "End-to-end success-envelope verification"
14. 14-result-explainability.md — "Two-tier result explainability"
15. 15-mode-aware-response-profiles.md — "Mode-aware response profiles"
16. 16-progressive-disclosure.md — "Progressive disclosure with cursor pagination"
17. 17-retrieval-session-state.md — "Retrieval session state"
18. 18-empty-result-recovery.md — "Empty result recovery"
19. 19-result-confidence.md — "Result confidence scoring"

## 19--feature-flag-reference
Features: 7
1. 01-1-search-pipeline-features-speckit.md — "Search Pipeline Features (SPECKIT_*)"
2. 02-2-session-and-cache.md — "2. Session and Cache"
3. 03-3-mcp-configuration.md — "3. MCP Configuration"
4. 04-4-memory-and-storage.md — "4. Memory and Storage"
5. 05-5-embedding-and-api.md — "5. Embedding and API"
6. 06-6-debug-and-telemetry.md — "6. Debug and Telemetry"
7. 07-7-ci-and-build-informational.md — "7. CI and Build (informational)"
