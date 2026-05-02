Verified. I checked all 7 catalog entries in `19--feature-flag-reference`, the prior audit summary, and the referenced `mcp_server` sources.

1. **Feature 1: Search Pipeline Features (SPECKIT_*)**
- File verification: **PARTIAL**
- Checked 100 flags, 60 listed source paths.
- Missing listed paths under `mcp_server`:
  - [`shared/algorithms/rrf-fusion.ts` (catalog lines 39,116)](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md:39)
  - [`shared/embeddings.ts` (catalog lines 60,93)](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md:60)
  - [`shared/algorithms/fusion-lab.ts` (catalog line 74)](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md:74)
  - [`shared/ranking/learned-combiner.ts` (catalog line 95)](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md:95)
  - [`scripts/core/workflow.ts` under `mcp_server` (catalog line 104)](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md:104)
- Function verification: **PARTIAL**
- Referenced functions exist, but some are indirect/moved:
  - [`buildServerInstructions(): Promise<string>`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:223)
  - [`injectContextualTree(...)`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1403)
  - [`getWatcherMetrics()`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:52)
  - [`runShadowScoring(...)`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:252)
  - [`logShadowComparison(...)`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:379)
- Flag defaults: **Mostly MATCH**
- Core gates align in code:
  - [`isContextHeadersEnabled(): true-by-default rollout gate`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:211)
  - [`isFileWatcherEnabled(): false unless explicit true`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:220)
  - [`resolveGraphWalkRolloutState()` default from `SPECKIT_GRAPH_SIGNALS`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:146)
  - [`SPECKIT_ROLLOUT_PERCENT` default 100](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/rollout-policy.ts:7)
- Unreferenced implementing files found: **YES** (26), including:
  - [`lib/search/pipeline/stage1-candidate-gen.ts`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts)
  - [`lib/search/pipeline/stage2-fusion.ts`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts)
  - [`lib/search/pipeline/stage3-rerank.ts`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts)
  - [`lib/search/embedding-expansion.ts`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts)
  - [`lib/storage/consolidation.ts`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts)
- Verdict: **PARTIAL**

2. **Feature 2: Session and Cache**
- File verification: **MATCH**
- Files exist and contain expected flags:
  - [`lib/session/session-manager.ts`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:163)
  - [`lib/search/bm25-index.ts`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:57)
  - [`lib/cache/tool-cache.ts`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:50)
- Function verification: **MATCH**
  - [`isBm25Enabled(): boolean`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:56)
  - [`filterSearchResults(sessionId, results): FilterResult`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:706)
  - [`withCache<T>(...)`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:315)
- Flag defaults: **MATCH**
  - `SESSION_TTL_MINUTES=30`, `SESSION_MAX_ENTRIES=100`, `DISABLE_SESSION_DEDUP=false` at [`session-manager.ts`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:163)
  - `TOOL_CACHE_*` defaults at [`tool-cache.ts`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:50)
- Unreferenced files: **none material**
- Verdict: **MATCH**

3. **Feature 3: MCP Configuration**
- File verification: **MATCH**
  - [`lib/validation/preflight.ts`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:187)
- Function verification: **MATCH**
  - [`validateAnchorFormat(...)`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:250)
  - [`checkDuplicate(...)`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:367)
  - [`runPreflight(...)`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:595)
- Flag defaults: **MATCH**
  - `MCP_CHARS_PER_TOKEN=4`, `MCP_MAX_MEMORY_TOKENS=8000`, `MCP_TOKEN_WARNING_THRESHOLD=0.8`, etc. at [`preflight.ts`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:187)
- Unreferenced files found: **YES**
  - [`handlers/quality-loop.ts` (`MCP_CHARS_PER_TOKEN`)](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:76)
  - [`lib/parsing/memory-parser.ts` (`MCP_MAX_CONTENT_LENGTH`)](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:95)
- Verdict: **PARTIAL**

4. **Feature 4: Memory and Storage**
- File verification: **PARTIAL**
- Missing listed path:
  - [`shared/config.ts` referenced in catalog](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/04-4-memory-and-storage.md:24)
- Existing refs verified:
  - [`core/config.ts`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/core/config.ts:44)
  - [`lib/search/vector-index-store.ts`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:224)
  - [`lib/search/vector-index-schema.ts`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:109)
- Function verification: **MATCH (for existing refs)**
  - [`resolveDatabasePaths(): DatabasePaths`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/core/config.ts:44)
  - [`get_embedding_dim(): number`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:124)
  - [`run_migrations(...)`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:155)
- Flag defaults: **PARTIAL**
  - `MEMORY_BASE_PATH=process.cwd()` and batch defaults match at [`core/config.ts`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/core/config.ts:85)
  - `SPEC_KIT_DB_DIR/SPECKIT_DB_DIR` behavior exists in compiled [`shared/config.js`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/shared/config.js:15), but not at documented `.ts` path.
- Unreferenced files found: **YES**
  - [`lib/eval/eval-db.ts` (`MEMORY_DB_DIR`)](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-db.ts:21)
  - [`context-server.ts` (`MEMORY_BASE_PATH`)](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:429)
- Verdict: **PARTIAL**

5. **Feature 5: Embedding and API**
- File verification: **PARTIAL**
- Missing listed path:
  - [`shared/embeddings/factory.ts` referenced in catalog](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/05-5-embedding-and-api.md:22)
- Existing refs verified:
  - [`lib/search/vector-index-store.ts`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:124)
  - [`lib/search/local-reranker.ts`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:212)
  - test refs exist (`tests/embeddings.vitest.ts`, `tests/search-limits-scoring.vitest.ts`)
- Function verification: **PARTIAL**
  - [`canUseLocalReranker(): Promise<boolean>`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:212)
  - Factory signatures available via compiled outputs:
    - [`resolveProvider(): ProviderResolution` (`.d.ts`)](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/shared/embeddings/factory.d.ts:6)
    - [`resolveProvider()` implementation (`.js`)](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/shared/embeddings/factory.js:56)
- Flag defaults: **MATCH for behavior, PARTIAL for citation quality**
  - `RERANKER_LOCAL=false` strict opt-in at [`local-reranker.ts`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:213)
  - `EMBEDDING_DIM` logic at [`vector-index-store.ts`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:124)
- Unreferenced files found: **YES**
  - [`lib/search/cross-encoder.ts` (actual `COHERE_API_KEY`/`VOYAGE_API_KEY` usage)](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:40)
- Verdict: **PARTIAL**

6. **Feature 6: Debug and Telemetry**
- File verification: **MATCH**
- All listed files exist and contain the documented env gates:
  - [`lib/parsing/trigger-matcher.ts`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:130)
  - [`lib/utils/logger.ts`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/utils/logger.ts:29)
  - [`lib/eval/eval-logger.ts`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts:22)
  - [`handlers/memory-index.ts`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:597)
  - [`lib/telemetry/retrieval-telemetry.ts`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:34)
  - [`lib/config/capability-flags.ts`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts:104)
  - [`lib/telemetry/consumption-logger.ts`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts:84)
- Function verification: **MATCH**
  - [`createLogger(moduleName: string): Logger`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/utils/logger.ts:85)
  - [`logExecutionTime(...)`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:114)
- Flag defaults: **MATCH**
  - `LOG_LEVEL` fallback `info` at [`logger.ts`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/utils/logger.ts:31)
  - `SPECKIT_EVAL_LOGGING` off unless explicit true at [`eval-logger.ts`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts:22)
  - `SPECKIT_EXTENDED_TELEMETRY` off unless explicit true at [`retrieval-telemetry.ts`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:34)
- Unreferenced files found: **YES** (Hydra alias/eval usage spread), e.g. [`lib/governance/scope-governance.ts`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:190), [`handlers/quality-loop.ts`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:675)
- Verdict: **PARTIAL**

7. **Feature 7: CI and Build (informational)**
- File verification: **MATCH**
  - [`lib/storage/checkpoints.ts`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:219)
- Function verification: **MATCH**
  - [`getGitBranch(): string | null`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:219)
- Flag/default check: **N/A (informational vars)**, behavior matches fallback order:
  - `GIT_BRANCH` -> `BRANCH_NAME` -> `CI_COMMIT_REF_NAME` -> `VERCEL_GIT_COMMIT_REF` at [`checkpoints.ts`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:220)
- Unreferenced files found: **none**
- Verdict: **MATCH**

| # | Feature | Files OK? | Functions OK? | Flags OK? | Unreferenced? | Verdict |
|---|---|---|---|---|---|---|
| 1 | Search Pipeline Features (SPECKIT_*) | No | Partial | Partial (mostly match; path/placement drift) | Yes | PARTIAL |
| 2 | Session and Cache | Yes | Yes | Yes | No | MATCH |
| 3 | MCP Configuration | Yes | Yes | Yes | Yes | PARTIAL |
| 4 | Memory and Storage | No | Partial | Partial | Yes | PARTIAL |
| 5 | Embedding and API | No | Partial | Partial | Yes | PARTIAL |
| 6 | Debug and Telemetry | Yes | Yes | Yes | Yes | PARTIAL |
| 7 | CI and Build (informational) | Yes | Yes | N/A (informational) | No | MATCH |

