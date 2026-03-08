# Audit D-09: Import Path & Dead Code Scan
## Summary
| Metric | mcp_server/ | scripts/ | Total |
|--------|------------|----------|-------|
| .ts files scanned | 459 | 85 | 544 |
| Broken imports | 1 | 0 | 1 |
| Unused exports | 243 | 140 | 383 |
| Circular deps | 0 | 0 | 0 |

Scope note: this scan excludes generated/vendor trees (`dist/`, `node_modules/`, `build/`) and `.d.ts` files to avoid false positives from compiled artifacts.

Relative vs absolute consistency: mcp_server/ mixes relative internal imports with external package imports, but no absolute internal alias imports were detected. scripts/ mixes relative internal imports with external package imports, but no absolute internal alias imports were detected. Missing index candidates: 20.

## Broken Imports
| File | Import | Expected Path | Status |
| --- | --- | --- | --- |
| .opencode/skill/system-spec-kit/mcp_server/tests/channel.vitest.ts | `../lib/session/channel` | `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/../lib/session/channel` | missing target |

## Unused Exports
| File | Export Name | Type |
| --- | --- | --- |
| .opencode/skill/system-spec-kit/mcp_server/configs/cognitive.ts | `CognitiveConfig` | interface |
| .opencode/skill/system-spec-kit/mcp_server/configs/cognitive.ts | `CognitiveConfigParseError` | interface |
| .opencode/skill/system-spec-kit/mcp_server/configs/cognitive.ts | `CognitiveConfigParseResult` | interface |
| .opencode/skill/system-spec-kit/mcp_server/context-server.ts | `registerAfterToolCallback` | function |
| .opencode/skill/system-spec-kit/mcp_server/core/config.ts | `COGNITIVE_CONFIG` | const |
| .opencode/skill/system-spec-kit/mcp_server/core/config.ts | `CONSTITUTIONAL_CACHE_TTL` | const |
| .opencode/skill/system-spec-kit/mcp_server/core/config.ts | `InputLimitsConfig` | interface |
| .opencode/skill/system-spec-kit/mcp_server/core/config.ts | `MAX_QUERY_LENGTH` | const |
| .opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts | `AnchorTokenMetrics` | interface |
| .opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts | `FormattedSearchResult` | interface |
| .opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts | `MemoryParserLike` | interface |
| .opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts | `MemoryResultEnvelope` | interface |
| .opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts | `MemoryResultScores` | interface |
| .opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts | `MemoryResultSource` | interface |
| .opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts | `MemoryResultTrace` | interface |
| .opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts | `RawSearchResult` | interface |
| .opencode/skill/system-spec-kit/mcp_server/formatters/token-metrics.ts | `TieredResult` | interface |
| .opencode/skill/system-spec-kit/mcp_server/formatters/token-metrics.ts | `TokenMetrics` | interface |
| .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts | `AliasConflictRow` | interface |
| .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts | `AliasConflictSample` | interface |
| .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts | `AliasConflictSummary` | interface |
| .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts | `DivergenceReconcileHookOptions` | interface |
| .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts | `DivergenceReconcileSummary` | interface |
| .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts | `SpecDiscoveryOptions` | interface |
| .opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts | `CHARS_PER_TOKEN` | named |
| .opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts | `MAX_CACHE_ENTRIES` | named |
| .opencode/skill/system-spec-kit/mcp_server/lib/chunking/anchor-chunker.ts | `ChunkingResult` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/chunking/chunk-thinning.ts | `ChunkScore` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/chunking/chunk-thinning.ts | `ThinningResult` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/pressure-monitor.ts | `PressureLevel` | type |
| .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/pressure-monitor.ts | `PressureMonitorResult` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/pressure-monitor.ts | `PressureSource` | type |
| .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/pressure-monitor.ts | `RuntimeContextStats` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts | `EXPECTED_TYPES` | const |
| .opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts | `HalfLifeValidationResult` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts | `PathTypePattern` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts | `SpecDocumentConfig` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts | `getDefaultHalfLives` | function |
| .opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts | `getHalfLife` | function |
| .opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts | `getTypeConfig` | function |
| .opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts | `getValidTypes` | function |
| .opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts | `isDecayEnabled` | function |
| .opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts | `validateHalfLifeConfig` | function |
| .opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts | `DetailedTypeSuggestion` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts | `InferMemoryTypeParams` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts | `InferenceResult` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts | `MemoryForBatchInference` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts | `TIER_TO_TYPE_MAP` | const |
| .opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts | `TypeValidationResult` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts | `getTypeSuggestionDetailed` | function |
| .opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts | `inferMemoryTypesBatch` | function |
| .opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts | `validateInferredType` | function |
| .opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts | `AblationChannelFailure` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts | `BM25BaselineConfig` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts | `BM25BaselineMetrics` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts | `BM25BaselineResult` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts | `BM25SearchFn` | type |
| .opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts | `BM25SearchResult` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts | `BootstrapCIResult` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts | `ContingencyDecision` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts | `QueryGroundTruth` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts | `computeBootstrapCI` | function |
| .opencode/skill/system-spec-kit/mcp_server/lib/eval/channel-attribution.ts | `AttributedResult` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/eval/channel-attribution.ts | `ChannelAttributionReport` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/eval/channel-attribution.ts | `ChannelECR` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/eval/channel-attribution.ts | `ChannelName` | type |
| .opencode/skill/system-spec-kit/mcp_server/lib/eval/edge-density.ts | `DensityClassification` | type |
| .opencode/skill/system-spec-kit/mcp_server/lib/eval/edge-density.ts | `EdgeDensityResult` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-ceiling.ts | `CeilingEvalOptions` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-ceiling.ts | `CeilingMemory` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-ceiling.ts | `CeilingQuery` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-ceiling.ts | `CeilingResult` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-ceiling.ts | `CeilingVsBaselineResult` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-ceiling.ts | `PerQueryCeiling` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-ceiling.ts | `ScoredMemory` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-ceiling.ts | `computeCeilingWithScorer` | function |
| .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-db.ts | `DEFAULT_DB_DIR` | named |
| .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts | `AllMetrics` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts | `computeF1` | function |
| .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts | `computePrecision` | function |
| .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-quality-proxy.ts | `QualityProxyComponents` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-quality-proxy.ts | `QualityProxyInput` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-quality-proxy.ts | `QualityProxyResult` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-data.ts | `ComplexityTier` | type |
| .opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-data.ts | `GroundTruthRelevance` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-data.ts | `IntentType` | type |
| .opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-data.ts | `QueryCategory` | type |
| .opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-data.ts | `QuerySource` | type |
| .opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts | `GroundTruthCorpusSummary` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts | `JudgeAgreementResult` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts | `LlmJudgeLabel` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts | `ManualLabel` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts | `SelectionContext` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts | `UserSelection` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts | `DiversityGate` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts | `DiversityValidationReport` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts | `GROUND_TRUTH_QUERIES` | named |
| .opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts | `GroundTruthDataset` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts | `LoadGroundTruthOptions` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts | `QUERY_DISTRIBUTION` | named |
| .opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts | `ChannelPerformance` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts | `DashboardReport` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts | `MetricSummary` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts | `ReportConfig` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts | `SprintReport` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts | `TrendEntry` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts | `ResultDelta` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts | `ScoredResult` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts | `ShadowComparison` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts | `ShadowComparisonSummary` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts | `ShadowConfig` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts | `ShadowStats` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts | `isEnabled` | named |
| .opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts | `validateExtractionRules` | named |
| .opencode/skill/system-spec-kit/mcp_server/lib/extraction/redaction-gate.ts | `GIT_SHA_40` | named |
| .opencode/skill/system-spec-kit/mcp_server/lib/extraction/redaction-gate.ts | `UUID_PATTERN` | named |
| .opencode/skill/system-spec-kit/mcp_server/lib/learning/index.ts | `corrections` | named |
| .opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts | `FSWatcher` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts | `WatcherConfig` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts | `getWatcherMetrics` | function |
| .opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts | `IngestJob` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts | `IngestJobError` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts | `IngestJobState` | type |
| .opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts | `ensureIngestJobsTable` | named |
| .opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts | `resetIncompleteJobsToQueued` | named |
| .opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts | `setIngestJobState` | named |
| .opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts | `CreateEmptyResponseOptions` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts | `CreateErrorResponseOptions` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts | `CreateResponseOptions` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts | `DefaultHints` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts | `MCPEnvelope` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts | `RecoveryInfo` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts | `ResponseMeta` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts | `InterferenceResult` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts | `NegativeFeedbackStats` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts | `ensureNegativeFeedbackTable` | function |
| .opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts | `AnchorMetadata` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts | `// Classification
  classifyArtifact` | named |
| .opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts | `FILE_PATH_PATTERNS` | named |
| .opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts | `QUERY_PATTERNS` | named |
| .opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts | `AutoPromotionResult` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts | `NON_PROMOTABLE_TIERS` | const |
| .opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts | `PROMOTION_PATHS` | const |
| .opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts | `ChannelRepresentationResult` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-truncation.ts | `// Constants
  DEFAULT_MIN_RESULTS` | named |
| .opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-truncation.ts | `// Functions
  truncateByConfidence` | named |
| .opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-truncation.ts | `// Internal helpers (exported for testing)
  computeGaps` | named |
| .opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-truncation.ts | `// Types
  type ScoredResult` | named |
| .opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-truncation.ts | `type TruncationOptions` | named |
| .opencode/skill/system-spec-kit/mcp_server/lib/search/context-budget.ts | `BudgetResult` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/search/context-budget.ts | `estimateTokens` | function |
| .opencode/skill/system-spec-kit/mcp_server/lib/search/context-budget.ts | `optimizeContextBudget` | function |
| .opencode/skill/system-spec-kit/mcp_server/lib/search/dynamic-token-budget.ts | `// Constants
  DEFAULT_BUDGET` | named |
| .opencode/skill/system-spec-kit/mcp_server/lib/search/dynamic-token-budget.ts | `// Functions
  getDynamicTokenBudget` | named |
| .opencode/skill/system-spec-kit/mcp_server/lib/search/dynamic-token-budget.ts | `// Types
  type TokenBudgetConfig` | named |
| .opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts | `EmbeddingExpansionOptions` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts | `ExpandedQuery` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts | `GraphCoverageResult` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts | `MIN_ABSOLUTE_SCORE` | named |
| .opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts | `MIN_GRAPH_MEMORY_NODES` | named |
| .opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts | `predictGraphCoverage` | function |
| .opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts | `slugifyFolderName` | function |
| .opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts | `computeGraphCentrality` | function |
| .opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts | `computeStructuralFreshness` | function |
| .opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts | `// Typed-degree computation (R4 5th RRF channel)
  EDGE_TYPE_WEIGHTS` | named |
| .opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts | `AuditLogEntry` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts | `LEARNED_TERM_TTL_SECONDS` | const |
| .opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts | `LearnedTriggerMatch` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts | `MIN_TERM_LENGTH` | const |
| .opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts | `SelectionEvent` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts | `canUseLocalReranker` | function |
| .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts | `__testables` | const |
| .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts | `__testables` | const |
| .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts | `FilterResult` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts | `StateStats` | type |
| .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts | `extractScoringValue` | function |
| .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts | `filterByMemoryState` | function |
| .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts | `PipelineOrchestrator` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts | `Stage1Fn` | type |
| .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts | `Stage2Fn` | type |
| .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts | `Stage3Fn` | type |
| .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts | `Stage4Fn` | type |
| .opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts | `// Constants
  SIMPLE_TERM_THRESHOLD` | named |
| .opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts | `// Functions
  classifyQueryComplexity` | named |
| .opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts | `// Internal helpers (exported for testing)
  extractTerms` | named |
| .opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts | `// Types
  type QueryComplexityTier` | named |
| .opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts | `// Constants
  DEFAULT_ROUTING_CONFIG` | named |
| .opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts | `// Functions
  getChannelSubset` | named |
| .opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts | `// Internal helpers (exported for testing)
  enforceMinimumChannels` | named |
| .opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts | `// Types
  type ChannelName` | named |
| .opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts | `type RouteResult` | named |
| .opencode/skill/system-spec-kit/mcp_server/lib/search/retrieval-directives.ts | `ConstitutionalResult` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/search/retrieval-directives.ts | `RetrievalDirective` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/search/spec-folder-hierarchy.ts | `HierarchyNode` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/search/spec-folder-hierarchy.ts | `HierarchyTree` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/search/spec-folder-hierarchy.ts | `invalidateHierarchyCache` | function |
| .opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts | `SPECKIT_LEVEL_REGEX` | named |
| .opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts | `ConsolidationResult` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts | `ContradictionCluster` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts | `ContradictionPair` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts | `NEGATION_KEYWORDS` | named |
| .opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts | `LEARNED_TRIGGERS_DEFAULT` | const |
| .opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts | `LearnedTriggerEntry` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts | `ComplementResult` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts | `ConflictResult` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts | `MergeResult` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts | `ReconsolidateOptions` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/telemetry/scoring-observability.ts | `ScoringObservation` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/telemetry/scoring-observability.ts | `ScoringStats` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/telemetry/trace-schema.ts | `isTelemetryTracePayload` | named |
| .opencode/skill/system-spec-kit/mcp_server/lib/telemetry/trace-schema.ts | `validateRetrievalTracePayload` | named |
| .opencode/skill/system-spec-kit/mcp_server/lib/utils/logger.ts | `LogLevel` | type |
| .opencode/skill/system-spec-kit/mcp_server/lib/utils/logger.ts | `Logger` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/utils/logger.ts | `log` | named |
| .opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts | `ContentQualityDimensions` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts | `ContentQualityResult` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts | `DIMENSION_WEIGHTS` | named |
| .opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts | `GENERIC_TITLE_PATTERNS` | named |
| .opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts | `QualityGateParams` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts | `SemanticDedupResult` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts | `StructuralValidationResult` | interface |
| .opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts | `qualityGateActivatedAt` | let |
| .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts | `TOOL_SCHEMAS` | const |
| .opencode/skill/system-spec-kit/mcp_server/tools/index.ts | `ALL_DISPATCHERS` | const |
| .opencode/skill/system-spec-kit/mcp_server/tools/index.ts | `causalTools` | named |
| .opencode/skill/system-spec-kit/mcp_server/tools/index.ts | `checkpointTools` | named |
| .opencode/skill/system-spec-kit/mcp_server/tools/index.ts | `contextTools` | named |
| .opencode/skill/system-spec-kit/mcp_server/tools/index.ts | `lifecycleTools` | named |
| .opencode/skill/system-spec-kit/mcp_server/tools/index.ts | `memoryTools` | named |
| .opencode/skill/system-spec-kit/mcp_server/tools/types.ts | `MCPResponseWithContext` | interface |
| .opencode/skill/system-spec-kit/mcp_server/tools/types.ts | `parseValidatedArgs` | function |
| .opencode/skill/system-spec-kit/mcp_server/utils/batch-processor.ts | `ItemProcessor` | type |
| .opencode/skill/system-spec-kit/mcp_server/utils/batch-processor.ts | `RetryDefaults` | interface |
| .opencode/skill/system-spec-kit/mcp_server/utils/batch-processor.ts | `RetryErrorResult` | interface |
| .opencode/skill/system-spec-kit/mcp_server/utils/batch-processor.ts | `RetryOptions` | interface |
| .opencode/skill/system-spec-kit/mcp_server/utils/json-helpers.ts | `ExpectedJsonType` | type |
| .opencode/skill/system-spec-kit/mcp_server/utils/json-helpers.ts | `safeJsonParse` | function |
| .opencode/skill/system-spec-kit/mcp_server/utils/validators.ts | `INPUT_LIMITS` | const |
| .opencode/skill/system-spec-kit/mcp_server/utils/validators.ts | `InputLimits` | interface |
| .opencode/skill/system-spec-kit/mcp_server/utils/validators.ts | `SharedValidateFilePath` | type |
| .opencode/skill/system-spec-kit/mcp_server/utils/validators.ts | `ValidatableArgs` | interface |
| .opencode/skill/system-spec-kit/mcp_server/utils/validators.ts | `validateQuery` | function |
| .opencode/skill/system-spec-kit/mcp_server/vitest.config.ts | `defineConfig` | default |
| .opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts | `DB_UPDATED_FILE` | named |
| .opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts | `notifyDatabaseUpdated` | named |
| .opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts | `QualityScore` | interface |
| .opencode/skill/system-spec-kit/scripts/core/tree-thinning.ts | `MergedFileEntry` | interface |
| .opencode/skill/system-spec-kit/scripts/core/tree-thinning.ts | `ThinFileEntry` | interface |
| .opencode/skill/system-spec-kit/scripts/core/workflow.ts | `WorkflowOptions` | interface |
| .opencode/skill/system-spec-kit/scripts/core/workflow.ts | `WorkflowResult` | interface |
| .opencode/skill/system-spec-kit/scripts/extractors/implementation-guide-extractor.ts | `ObservationInput` | interface |
| .opencode/skill/system-spec-kit/scripts/extractors/implementation-guide-extractor.ts | `extract_main_topic` | named |
| .opencode/skill/system-spec-kit/scripts/extractors/implementation-guide-extractor.ts | `extract_what_built` | named |
| .opencode/skill/system-spec-kit/scripts/extractors/implementation-guide-extractor.ts | `has_implementation_work` | named |
| .opencode/skill/system-spec-kit/scripts/lib/anchor-generator.ts | `// Constants
  STOP_WORDS` | named |
| .opencode/skill/system-spec-kit/scripts/lib/anchor-generator.ts | `ACTION_VERBS` | named |
| .opencode/skill/system-spec-kit/scripts/lib/anchor-generator.ts | `AnchorTag` | type |
| .opencode/skill/system-spec-kit/scripts/lib/anchor-generator.ts | `AnchorWrapResult` | interface |
| .opencode/skill/system-spec-kit/scripts/lib/anchor-generator.ts | `extractKeywords` | named |
| .opencode/skill/system-spec-kit/scripts/lib/anchor-generator.ts | `generateSemanticSlug` | named |
| .opencode/skill/system-spec-kit/scripts/lib/anchor-generator.ts | `generateShortHash` | named |
| .opencode/skill/system-spec-kit/scripts/lib/anchor-generator.ts | `getCurrentDate` | named |
| .opencode/skill/system-spec-kit/scripts/lib/anchor-generator.ts | `slugify` | named |
| .opencode/skill/system-spec-kit/scripts/lib/ascii-boxes.ts | `BOX` | named |
| .opencode/skill/system-spec-kit/scripts/lib/ascii-boxes.ts | `BoxCharacters` | interface |
| .opencode/skill/system-spec-kit/scripts/lib/ascii-boxes.ts | `TextAlign` | type |
| .opencode/skill/system-spec-kit/scripts/lib/ascii-boxes.ts | `formatCaveatsBox` | named |
| .opencode/skill/system-spec-kit/scripts/lib/ascii-boxes.ts | `formatChosenBox` | named |
| .opencode/skill/system-spec-kit/scripts/lib/ascii-boxes.ts | `formatDecisionHeader` | named |
| .opencode/skill/system-spec-kit/scripts/lib/ascii-boxes.ts | `formatFollowUpBox` | named |
| .opencode/skill/system-spec-kit/scripts/lib/ascii-boxes.ts | `formatOptionBox` | named |
| .opencode/skill/system-spec-kit/scripts/lib/ascii-boxes.ts | `padText` | named |
| .opencode/skill/system-spec-kit/scripts/lib/content-filter.ts | `ContentType` | type |
| .opencode/skill/system-spec-kit/scripts/lib/content-filter.ts | `FilterConfig` | interface |
| .opencode/skill/system-spec-kit/scripts/lib/content-filter.ts | `FilterPipeline` | interface |
| .opencode/skill/system-spec-kit/scripts/lib/content-filter.ts | `NOISE_PATTERNS` | named |
| .opencode/skill/system-spec-kit/scripts/lib/content-filter.ts | `PromptItem` | interface |
| .opencode/skill/system-spec-kit/scripts/lib/content-filter.ts | `QualityFactors` | interface |
| .opencode/skill/system-spec-kit/scripts/lib/content-filter.ts | `calculateQualityScore` | named |
| .opencode/skill/system-spec-kit/scripts/lib/content-filter.ts | `calculateSimilarity` | named |
| .opencode/skill/system-spec-kit/scripts/lib/content-filter.ts | `filterContent` | named |
| .opencode/skill/system-spec-kit/scripts/lib/content-filter.ts | `generateContentHash` | named |
| .opencode/skill/system-spec-kit/scripts/lib/content-filter.ts | `getFilterStats` | named |
| .opencode/skill/system-spec-kit/scripts/lib/content-filter.ts | `isNoiseContent` | named |
| .opencode/skill/system-spec-kit/scripts/lib/content-filter.ts | `meetsMinimumRequirements` | named |
| .opencode/skill/system-spec-kit/scripts/lib/content-filter.ts | `resetStats` | named |
| .opencode/skill/system-spec-kit/scripts/lib/content-filter.ts | `stripNoiseWrappers` | named |
| .opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts | `BuildFrontmatterOptions` | interface |
| .opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts | `BuildFrontmatterResult` | interface |
| .opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts | `ClassifiedDocument` | interface |
| .opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts | `DocumentKind` | type |
| .opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts | `FrontmatterDetection` | interface |
| .opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts | `FrontmatterSection` | interface |
| .opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts | `FrontmatterValue` | type |
| .opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts | `ManagedFrontmatter` | interface |
| .opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts | `TITLE_MAX_LENGTH` | named |
| .opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts | `buildManagedFrontmatter` | function |
| .opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts | `detectFrontmatter` | function |
| .opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts | `parseFrontmatterSections` | function |
| .opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts | `parseSectionValue` | function |
| .opencode/skill/system-spec-kit/scripts/lib/semantic-summarizer.ts | `ExtractedDecision` | interface |
| .opencode/skill/system-spec-kit/scripts/lib/semantic-summarizer.ts | `FileChangeInfo` | interface |
| .opencode/skill/system-spec-kit/scripts/lib/semantic-summarizer.ts | `ImplementationSummary` | interface |
| .opencode/skill/system-spec-kit/scripts/lib/semantic-summarizer.ts | `MESSAGE_TYPES` | named |
| .opencode/skill/system-spec-kit/scripts/lib/semantic-summarizer.ts | `MessageStats` | interface |
| .opencode/skill/system-spec-kit/scripts/lib/semantic-summarizer.ts | `MessageType` | type |
| .opencode/skill/system-spec-kit/scripts/lib/semantic-summarizer.ts | `SemanticMessage` | interface |
| .opencode/skill/system-spec-kit/scripts/lib/semantic-summarizer.ts | `SemanticObservation` | interface |
| .opencode/skill/system-spec-kit/scripts/lib/semantic-summarizer.ts | `SummaryFileEntry` | interface |
| .opencode/skill/system-spec-kit/scripts/lib/semantic-summarizer.ts | `SummaryOptions` | interface |
| .opencode/skill/system-spec-kit/scripts/lib/semantic-summarizer.ts | `classifyMessage` | named |
| .opencode/skill/system-spec-kit/scripts/lib/semantic-summarizer.ts | `classifyMessages` | named |
| .opencode/skill/system-spec-kit/scripts/lib/semantic-summarizer.ts | `extractDecisions` | named |
| .opencode/skill/system-spec-kit/scripts/lib/structure-aware-chunker.ts | `Chunk` | interface |
| .opencode/skill/system-spec-kit/scripts/lib/structure-aware-chunker.ts | `ChunkOptions` | interface |
| .opencode/skill/system-spec-kit/scripts/lib/structure-aware-chunker.ts | `chunkMarkdown` | function |
| .opencode/skill/system-spec-kit/scripts/lib/structure-aware-chunker.ts | `splitIntoBlocks` | function |
| .opencode/skill/system-spec-kit/scripts/memory/ast-parser.ts | `ParsedSection` | interface |
| .opencode/skill/system-spec-kit/scripts/memory/ast-parser.ts | `chunkMarkdown` | named |
| .opencode/skill/system-spec-kit/scripts/memory/ast-parser.ts | `parseMarkdownSections` | function |
| .opencode/skill/system-spec-kit/scripts/memory/ast-parser.ts | `splitIntoBlocks` | named |
| .opencode/skill/system-spec-kit/scripts/memory/backfill-frontmatter.ts | `classifyDocument` | named |
| .opencode/skill/system-spec-kit/scripts/memory/backfill-frontmatter.ts | `collectSpecFiles` | named |
| .opencode/skill/system-spec-kit/scripts/memory/backfill-frontmatter.ts | `collectTemplateFiles` | named |
| .opencode/skill/system-spec-kit/scripts/memory/backfill-frontmatter.ts | `discoverSpecsRoots` | named |
| .opencode/skill/system-spec-kit/scripts/memory/backfill-frontmatter.ts | `parseArgs` | named |
| .opencode/skill/system-spec-kit/scripts/memory/backfill-frontmatter.ts | `run` | named |
| .opencode/skill/system-spec-kit/scripts/memory/cleanup-orphaned-vectors.ts | `main` | named |
| .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts | `SpecFolderValidation` | interface |
| .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts | `isValidSpecFolder` | named |
| .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts | `main` | named |
| .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts | `parseArguments` | named |
| .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts | `validateArguments` | named |
| .opencode/skill/system-spec-kit/scripts/memory/rank-memories.ts | `// Local functions
  formatRelativeTime` | named |
| .opencode/skill/system-spec-kit/scripts/memory/rank-memories.ts | `// Re-exported from folder-scoring
  isArchived` | named |
| .opencode/skill/system-spec-kit/scripts/memory/rank-memories.ts | `CLIOptions` | interface |
| .opencode/skill/system-spec-kit/scripts/memory/rank-memories.ts | `ConstitutionalEntry` | interface |
| .opencode/skill/system-spec-kit/scripts/memory/rank-memories.ts | `DECAY_RATE` | named |
| .opencode/skill/system-spec-kit/scripts/memory/rank-memories.ts | `FolderScoreEntry` | interface |
| .opencode/skill/system-spec-kit/scripts/memory/rank-memories.ts | `NormalizedMemory` | interface |
| .opencode/skill/system-spec-kit/scripts/memory/rank-memories.ts | `ProcessingOptions` | interface |
| .opencode/skill/system-spec-kit/scripts/memory/rank-memories.ts | `ProcessingResult` | interface |
| .opencode/skill/system-spec-kit/scripts/memory/rank-memories.ts | `RawMemory` | interface |
| .opencode/skill/system-spec-kit/scripts/memory/rank-memories.ts | `RecentMemoryEntry` | interface |
| .opencode/skill/system-spec-kit/scripts/memory/rank-memories.ts | `SCORE_WEIGHTS` | named |
| .opencode/skill/system-spec-kit/scripts/memory/rank-memories.ts | `TIER_WEIGHTS` | named |
| .opencode/skill/system-spec-kit/scripts/memory/rank-memories.ts | `computeFolderScore` | named |
| .opencode/skill/system-spec-kit/scripts/memory/rank-memories.ts | `computeRecencyScore` | named |
| .opencode/skill/system-spec-kit/scripts/memory/rank-memories.ts | `getArchiveMultiplier` | named |
| .opencode/skill/system-spec-kit/scripts/memory/rank-memories.ts | `processMemories` | named |
| .opencode/skill/system-spec-kit/scripts/memory/rank-memories.ts | `simplifyFolderPath` | named |
| .opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts | `validateMemoryQualityFile` | named |
| .opencode/skill/system-spec-kit/scripts/spec-folder/alignment-validator.ts | `AlignmentConfig` | interface |
| .opencode/skill/system-spec-kit/scripts/spec-folder/alignment-validator.ts | `AlignmentResult` | interface |
| .opencode/skill/system-spec-kit/scripts/spec-folder/alignment-validator.ts | `TelemetrySchemaDocsValidationOptions` | interface |
| .opencode/skill/system-spec-kit/scripts/spec-folder/alignment-validator.ts | `TelemetrySchemaFieldDiff` | interface |
| .opencode/skill/system-spec-kit/scripts/spec-folder/alignment-validator.ts | `WorkDomainResult` | interface |
| .opencode/skill/system-spec-kit/scripts/spec-folder/alignment-validator.ts | `parseSpecFolderTopic` | named |
| .opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts | `ALIGNMENT_CONFIG` | named |
| .opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts | `TEST_HELPERS` | named |
| .opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts | `detect_spec_folder` | named |
| .opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts | `filter_archive_folders` | named |
| .opencode/skill/system-spec-kit/scripts/spec-folder/index.ts | `ALIGNMENT_CONFIG` | named |
| .opencode/skill/system-spec-kit/scripts/spec-folder/index.ts | `calculateAlignmentScore` | named |
| .opencode/skill/system-spec-kit/scripts/spec-folder/index.ts | `computeTelemetrySchemaDocsFieldDiffs` | named |
| .opencode/skill/system-spec-kit/scripts/spec-folder/index.ts | `detect_spec_folder` | named |
| .opencode/skill/system-spec-kit/scripts/spec-folder/index.ts | `extractConversationTopics` | named |
| .opencode/skill/system-spec-kit/scripts/spec-folder/index.ts | `extractObservationKeywords` | named |
| .opencode/skill/system-spec-kit/scripts/spec-folder/index.ts | `extract_observation_keywords` | named |
| .opencode/skill/system-spec-kit/scripts/spec-folder/index.ts | `filterArchiveFolders` | named |
| .opencode/skill/system-spec-kit/scripts/spec-folder/index.ts | `filter_archive_folders` | named |
| .opencode/skill/system-spec-kit/scripts/spec-folder/index.ts | `formatTelemetrySchemaDocsDriftDiffs` | named |
| .opencode/skill/system-spec-kit/scripts/spec-folder/index.ts | `getPhaseFolderRejectionSync` | named |
| .opencode/skill/system-spec-kit/scripts/spec-folder/index.ts | `setup_context_directory` | named |
| .opencode/skill/system-spec-kit/scripts/spec-folder/index.ts | `validateContentAlignment` | named |
| .opencode/skill/system-spec-kit/scripts/spec-folder/index.ts | `validateFolderAlignment` | named |
| .opencode/skill/system-spec-kit/scripts/spec-folder/index.ts | `validateTelemetrySchemaDocsDrift` | named |
| .opencode/skill/system-spec-kit/scripts/spec-folder/index.ts | `validate_content_alignment` | named |
| .opencode/skill/system-spec-kit/scripts/spec-folder/index.ts | `validate_telemetry_schema_docs_drift` | named |
| .opencode/skill/system-spec-kit/scripts/utils/data-validator.ts | `ArrayFlagMappings` | interface |
| .opencode/skill/system-spec-kit/scripts/utils/data-validator.ts | `PresenceFlagMappings` | interface |
| .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts | `// Primary exports
  transformKeyDecision` | named |
| .opencode/skill/system-spec-kit/scripts/utils/slug-utils.ts | `truncateSlugAtWordBoundary` | function |

## Circular Dependencies
| File A | File B | Type |
| --- | --- | --- |
| None |  |  |

## Issues [ISS-D09-NNN]
### ISS-D09-001
mcp_server/ mixes relative internal imports with external package imports, but no absolute internal alias imports were detected.

### ISS-D09-002
scripts/ mixes relative internal imports with external package imports, but no absolute internal alias imports were detected.

### ISS-D09-003
Broken import: `.opencode/skill/system-spec-kit/mcp_server/tests/channel.vitest.ts` -> `../lib/session/channel` (expected near `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/../lib/session/channel`).

### ISS-D09-004
Possible missing barrel: `.opencode/skill/system-spec-kit/mcp_server` has 4 cross-directory child imports and no `index.ts` (`.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts` imports `../context-server`; `.opencode/skill/system-spec-kit/mcp_server/tests/review-fixes.vitest.ts` imports `../tool-schemas`; `.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts` imports `../tool-schemas`).

### ISS-D09-005
Possible missing barrel: `.opencode/skill/system-spec-kit/mcp_server/lib/cache` has 9 cross-directory child imports and no `index.ts` (`.opencode/skill/system-spec-kit/mcp_server/context-server.ts` imports `./lib/cache/tool-cache`; `.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts` imports `../lib/cache/tool-cache`; `.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts` imports `../lib/cache/embedding-cache`).

### ISS-D09-006
Possible missing barrel: `.opencode/skill/system-spec-kit/mcp_server/lib/chunking` has 6 cross-directory child imports and no `index.ts` (`.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts` imports `../lib/chunking/anchor-chunker`; `.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts` imports `../lib/chunking/chunk-thinning`; `.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts` imports `../chunking/anchor-chunker`).

### ISS-D09-007
Possible missing barrel: `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive` has 78 cross-directory child imports and no `index.ts` (`.opencode/skill/system-spec-kit/mcp_server/context-server.ts` imports `./lib/cache/cognitive/working-memory`; `.opencode/skill/system-spec-kit/mcp_server/context-server.ts` imports `./lib/cache/cognitive/attention-decay`; `.opencode/skill/system-spec-kit/mcp_server/context-server.ts` imports `./lib/cache/cognitive/co-activation`).

### ISS-D09-008
Possible missing barrel: `.opencode/skill/system-spec-kit/mcp_server/lib/config` has 4 cross-directory child imports and no `index.ts` (`.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts` imports `../config/type-inference`; `.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts` imports `../lib/config/memory-types`; `.opencode/skill/system-spec-kit/mcp_server/tests/memory-types.vitest.ts` imports `../lib/config/memory-types`).

### ISS-D09-009
Possible missing barrel: `.opencode/skill/system-spec-kit/mcp_server/lib/eval` has 33 cross-directory child imports and no `index.ts` (`.opencode/skill/system-spec-kit/mcp_server/api/eval.ts` imports `../lib/eval/ablation-framework`; `.opencode/skill/system-spec-kit/mcp_server/api/eval.ts` imports `../lib/eval/bm25-baseline`; `.opencode/skill/system-spec-kit/mcp_server/api/eval.ts` imports `../lib/eval/ground-truth-generator`).

### ISS-D09-010
Possible missing barrel: `.opencode/skill/system-spec-kit/mcp_server/lib/extraction` has 5 cross-directory child imports and no `index.ts` (`.opencode/skill/system-spec-kit/mcp_server/context-server.ts` imports `./lib/extraction/extraction-adapter`; `.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts` imports `../../lib/extraction/entity-extractor`; `.opencode/skill/system-spec-kit/mcp_server/tests/deferred-features-integration.vitest.ts` imports `../lib/extraction/entity-extractor`).

### ISS-D09-011
Possible missing barrel: `.opencode/skill/system-spec-kit/mcp_server/lib/graph` has 4 cross-directory child imports and no `index.ts` (`.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts` imports `../lib/graph/graph-signals`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts` imports `../../graph/community-detection`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts` imports `../../graph/graph-signals`).

### ISS-D09-012
Possible missing barrel: `.opencode/skill/system-spec-kit/mcp_server/lib/ops` has 4 cross-directory child imports and no `index.ts` (`.opencode/skill/system-spec-kit/mcp_server/context-server.ts` imports `./lib/ops/job-queue`; `.opencode/skill/system-spec-kit/mcp_server/context-server.ts` imports `./lib/ops/file-watcher`; `.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts` imports `../lib/ops/file-watcher`).

### ISS-D09-013
Possible missing barrel: `.opencode/skill/system-spec-kit/mcp_server/lib/parsing` has 35 cross-directory child imports and no `index.ts` (`.opencode/skill/system-spec-kit/mcp_server/cli.ts` imports `./lib/parsing/trigger-matcher`; `.opencode/skill/system-spec-kit/mcp_server/context-server.ts` imports `./lib/parsing/memory-parser`; `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts` imports `../lib/parsing/memory-parser`).

### ISS-D09-014
Possible missing barrel: `.opencode/skill/system-spec-kit/mcp_server/lib/providers` has 21 cross-directory child imports and no `index.ts` (`.opencode/skill/system-spec-kit/mcp_server/api/providers.ts` imports `../lib/providers/embeddings`; `.opencode/skill/system-spec-kit/mcp_server/cli.ts` imports `./lib/providers/embeddings`; `.opencode/skill/system-spec-kit/mcp_server/context-server.ts` imports `./lib/providers/embeddings`).

### ISS-D09-015
Possible missing barrel: `.opencode/skill/system-spec-kit/mcp_server/lib/scoring` has 27 cross-directory child imports and no `index.ts` (`.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts` imports `../lib/scoring/confidence-tracker`; `.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts` imports `../lib/scoring/negative-feedback`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts` imports `../lib/scoring/folder-scoring`).

### ISS-D09-016
Possible missing barrel: `.opencode/skill/system-spec-kit/mcp_server/lib/search` has 193 cross-directory child imports and no `index.ts` (`.opencode/skill/system-spec-kit/mcp_server/api/search.ts` imports `../lib/search/hybrid-search`; `.opencode/skill/system-spec-kit/mcp_server/api/search.ts` imports `../lib/search/sqlite-fts`; `.opencode/skill/system-spec-kit/mcp_server/cli.ts` imports `./lib/search/vector-index`).

### ISS-D09-017
Possible missing barrel: `.opencode/skill/system-spec-kit/mcp_server/lib/storage` has 67 cross-directory child imports and no `index.ts` (`.opencode/skill/system-spec-kit/mcp_server/api/storage.ts` imports `../lib/storage/checkpoints`; `.opencode/skill/system-spec-kit/mcp_server/api/storage.ts` imports `../lib/storage/access-tracker`; `.opencode/skill/system-spec-kit/mcp_server/cli.ts` imports `./lib/storage/checkpoints`).

### ISS-D09-018
Possible missing barrel: `.opencode/skill/system-spec-kit/mcp_server/lib/telemetry` has 7 cross-directory child imports and no `index.ts` (`.opencode/skill/system-spec-kit/mcp_server/context-server.ts` imports `./lib/telemetry/scoring-observability`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts` imports `../lib/telemetry/retrieval-telemetry`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts` imports `../lib/telemetry/consumption-logger`).

### ISS-D09-019
Possible missing barrel: `.opencode/skill/system-spec-kit/mcp_server/lib/utils` has 18 cross-directory child imports and no `index.ts` (`.opencode/skill/system-spec-kit/mcp_server/context-server.ts` imports `./lib/utils/canonical-path`; `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts` imports `../lib/utils/path-security`; `.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts` imports `../lib/utils/canonical-path`).

### ISS-D09-020
Possible missing barrel: `.opencode/skill/system-spec-kit/mcp_server/lib/validation` has 5 cross-directory child imports and no `index.ts` (`.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts` imports `../lib/validation/preflight`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts` imports `../lib/validation/save-quality-gate`; `.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts` imports `../lib/validation/save-quality-gate`).

### ISS-D09-021
Possible missing barrel: `.opencode/skill/system-spec-kit/scripts/evals` has 1 cross-directory child imports and no `index.ts` (`.opencode/skill/system-spec-kit/scripts/tests/import-policy-rules.vitest.ts` imports `../evals/import-policy-rules`).

### ISS-D09-022
Possible missing barrel: `.opencode/skill/system-spec-kit/scripts/lib` has 20 cross-directory child imports and no `index.ts` (`.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts` imports `../lib/embeddings`; `.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts` imports `../lib/trigger-extractor`; `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` imports `../lib/flowchart-generator`).

### ISS-D09-023
Possible missing barrel: `.opencode/skill/system-spec-kit/scripts/memory` has 6 cross-directory child imports and no `index.ts` (`.opencode/skill/system-spec-kit/scripts/core/workflow.ts` imports `../memory/validate-memory-quality`; `.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts` imports `../memory/generate-context`; `.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts` imports `../memory/generate-context`).
