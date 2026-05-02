Loaded and verified all requested artifacts:
- Catalog entries: 22 files in `14--pipeline-architecture` (892 `mcp_server/...` references, 889 unique-by-feature, 362 globally unique), all existence-checked.
- Prior audit summary: [implementation-summary.md#L1](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/specs/system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/014-pipeline-architecture/implementation-summary.md#L1).
- Source verification done against `.opencode/skill/system-spec-kit/mcp_server/...` plus directly referenced shared/script files where needed.

1. **F01 — 4-stage pipeline refactor**  
Files: 157/157 `mcp_server` refs exist (catalog refs at [01-4-stage-pipeline-refactor.md#L42](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/01-4-stage-pipeline-refactor.md#L42) through L220).  
Functions: `resolveEffectiveScore(row: PipelineRow): number` exists at [types.ts#L58](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts#L58); `verifyScoreInvariant(...)` at [types.ts#L396](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts#L396); alias `resolveBaseScore` at [stage2-fusion.ts#L167](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L167); alias `effectiveScore` at [stage3-rerank.ts#L546](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts#L546).  
Flags: `SPECKIT_CROSS_ENCODER` default ON matches docs at [search-flags.ts#L49](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts#L49).  
Unreferenced files: none found.  
Verdict: **MATCH**.

2. **F02 — MPAB chunk-to-memory aggregation**  
Files: 2/2 exist (catalog refs [02-mpab...#L30](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/02-mpab-chunk-to-memory-aggregation.md#L30)-L36).  
Functions: `computeMPAB(scores: number[]): number` exists at [mpab-aggregation.ts#L100](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/mpab-aggregation.ts#L100); constant `MPAB_BONUS_COEFFICIENT` at [mpab-aggregation.ts#L60](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/mpab-aggregation.ts#L60).  
Flags: `SPECKIT_DOCSCORE_AGGREGATION` default ON matches [search-flags.ts#L75](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts#L75).  
Behavior check: catalog says Stage 3 post-RRF; active MPAB formula use is in [hybrid-search.ts#L832](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L832), while Stage 3 has separate collapse logic in [stage3-rerank.ts#L443](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts#L443).  
Unreferenced files: `mcp_server/lib/search/hybrid-search.ts`, `mcp_server/lib/search/search-flags.ts`, `mcp_server/lib/search/pipeline/stage3-rerank.ts`.  
Verdict: **PARTIAL**.

3. **F03 — Chunk ordering preservation**  
Files: 8/8 exist ([03-chunk-ordering...#L28](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/03-chunk-ordering-preservation.md#L28)-L40).  
Functions: behavior confirmed by sort on `chunk_index` at [stage3-rerank.ts#L483](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts#L483), reassembly/fallback tags at [stage3-rerank.ts#L604](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts#L604) and [stage3-rerank.ts#L644](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts#L644).  
Flags: none documented/required.  
Unreferenced files: none found.  
Verdict: **MATCH**.

4. **F04 — Template anchor optimization**  
Files: 10/10 exist ([04-template-anchor...#L30](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/04-template-anchor-optimization.md#L30)-L45).  
Functions: `extractAnchorMetadata(content: string): AnchorMetadata[]` at [anchor-metadata.ts#L106](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts#L106); enrichment at [anchor-metadata.ts#L172](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts#L172).  
Flags: “No feature flag, always active” matches Stage 2 enrichment wiring at [stage2-fusion.ts#L833](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L833).  
Unreferenced files: `mcp_server/lib/search/pipeline/stage2-fusion.ts` (actual integration point).  
Verdict: **PARTIAL**.

5. **F05 — Validation signals as retrieval metadata**  
Files: 10/10 exist ([05-validation-signals...#L30](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/05-validation-signals-as-retrieval-metadata.md#L30)-L45).  
Functions: extraction at [validation-metadata.ts#L173](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts#L173); Stage 2 scoring/clamp at [stage2-fusion.ts#L108](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L108) and [stage2-fusion.ts#L149](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L149).  
Flags: “No feature flag, always active” aligns with unconditional enrichment/scoring path [stage2-fusion.ts#L833](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L833).  
Unreferenced files: `mcp_server/lib/search/pipeline/stage2-fusion.ts`.  
Verdict: **PARTIAL**.

6. **F06 — Learned relevance feedback**  
Files: 13/13 exist ([06-learned-relevance...#L34](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/06-learned-relevance-feedback.md#L34)-L53).  
Functions: `recordSelection(...)` [learned-feedback.ts#L257](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts#L257), `isInShadowPeriod(db)` [learned-feedback.ts#L418](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts#L418), `queryLearnedTriggers(query, db)` [learned-feedback.ts#L448](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts#L448).  
Flags: `SPECKIT_LEARN_FROM_SELECTION` default ON (`false` disables) matches [learned-feedback.ts#L169](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts#L169).  
Unreferenced files: `mcp_server/lib/search/pipeline/stage2-fusion.ts` (uses `queryLearnedTriggers` at [stage2-fusion.ts#L443](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L443)).  
Verdict: **PARTIAL**.

7. **F07 — Search pipeline safety**  
Files: 153/153 exist ([07-search-pipeline-safety.md#L34](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/07-search-pipeline-safety.md#L34)-L209).  
Functions: D1 quality filter fix at [stage1-candidate-gen.ts#L947](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts#L947); D2 shared `sanitizeQueryTokens` at [bm25-index.ts#L311](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts#L311) and use in [sqlite-fts.ts#L71](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts#L71); D3 `QUALITY_FLOOR=0.005` at [channel-representation.ts#L15](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts#L15).  
Flags: none central to this entry.  
Unreferenced files: none obvious; however source list is heavily over-inclusive for a 3-fix feature.  
Verdict: **PARTIAL**.

8. **F08 — Performance improvements**  
Files: 12/12 exist ([08-performance-improvements.md#L34](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/08-performance-improvements.md#L34)-L50).  
Functions/behavior: reduce max at [tfidf-summarizer.ts#L150](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/tfidf-summarizer.ts#L150); summary `LIMIT` at [memory-summaries.ts#L174](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts#L174); SQL `COUNT/json_extract` at [mutation-ledger.ts#L294](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts#L294); batch edge count via `UNION ALL` at [entity-linker.ts#L548](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts#L548); 60s WeakMap TTL at [spec-folder-hierarchy.ts#L26](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/spec-folder-hierarchy.ts#L26).  
Flags: none.  
Unreferenced files: none found.  
Verdict: **MATCH**.

9. **F09 — Activation window persistence**  
Files: 4/4 exist ([09-activation-window...#L28](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/09-activation-window-persistence.md#L28)-L36).  
Functions: `ensureActivationTimestampInitialized()` exists [save-quality-gate.ts#L287](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts#L287) and is called [save-quality-gate.ts#L759](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts#L759).  
Flags: none.  
Unreferenced files: none found.  
Verdict: **MATCH**.

10. **F10 — Legacy V1 pipeline removal**  
Files: 110/110 exist ([10-legacy-v1...#L28](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/10-legacy-v1-pipeline-removal.md#L28)-L157).  
Functions: `isPipelineV2Enabled`/`SPECKIT_PIPELINE_V2` absent in runtime (only test comment remains at [pipeline-v2.vitest.ts#L289](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-v2.vitest.ts#L289)); `verify_integrity(options)` exists at [vector-index-queries.ts#L1284](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts#L1284) with `autoClean` [vector-index-queries.ts#L1285](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts#L1285).  
Flags: “not consumed” is accurate for runtime search path.  
Unreferenced files: missing core path files in catalog (`mcp_server/handlers/memory-search.ts` [#L15](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L15), [#L634](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L634); `mcp_server/lib/search/pipeline/orchestrator.ts` [#L33](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts#L33)).  
Verdict: **PARTIAL**.

11. **F11 — Pipeline and mutation hardening**  
Files: 20/20 exist ([11-pipeline-and-mutation...#L39](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/11-pipeline-and-mutation-hardening.md#L39)-L73).  
Functions/behavior: schema params exposed in [tool-schemas.ts#L159](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L159) and [tool-input-schemas.ts#L147](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts#L147); constitutional passthrough in [orchestrator.ts#L154](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts#L154) and [stage4-filter.ts#L346](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts#L346); `simpleStem` fix at [bm25-index.ts#L72](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts#L72); update embedding input in [memory-crud-update.ts#L98](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts#L98); ancillary cleanup + BM25 removal in [vector-index-mutations.ts#L40](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts#L40) and [#L502](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts#L502); dynamic preflight code in [memory-save.ts#L779](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L779).  
Flags: no default mismatch found.  
Unreferenced files: none found.  
Verdict: **MATCH**.

12. **F12 — DB_PATH extraction and import standardization**  
Files: `mcp_server` refs = 0 (catalog has no `mcp_server/...` paths).  
Functions: `getDbDir()` exists [shared/config.ts#L9](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/shared/config.ts#L9); `DB_PATH` uses it at [shared/paths.ts#L45](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/shared/paths.ts#L45).  
Flags/env defaults: `SPEC_KIT_DB_DIR`/`SPECKIT_DB_DIR` usage matches docs.  
Unreferenced files: none in `mcp_server` scope (N/A).  
Verdict: **MATCH**.

13. **F13 — Strict Zod schema validation**  
Files: 2/2 `mcp_server` refs exist (catalog refs [13-strict-zod...#L18](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/13-strict-zod-schema-validation.md#L18), [#L28](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/13-strict-zod-schema-validation.md#L28)).  
Functions: strict toggle is `strict ? base.strict() : base.passthrough()` at [tool-input-schemas.ts#L27](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts#L27).  
Flags: `SPECKIT_STRICT_SCHEMAS` default true matches [tool-input-schemas.ts#L5](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts#L5).  
Behavior: “33 live tools” matches `TOOL_SCHEMAS` size (33 entries from [tool-input-schemas.ts#L389](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts#L389) onward).  
Unreferenced files: `mcp_server/tool-schemas.ts` participates in tool definitions but omitted from implementation table.  
Verdict: **PARTIAL**.

14. **F14 — Dynamic server instructions at MCP initialization**  
Files: 344/344 exist ([14-dynamic-server...#L28](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/14-dynamic-server-instructions-at-mcp-initialization.md#L28)-L396).  
Functions: `server.setInstructions(...)` path exists at [context-server.ts#L1072](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L1072); dynamic payload builder includes counts/channels at [context-server.ts#L223](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L223).  
Flags: `SPECKIT_DYNAMIC_INIT` default true behavior (`!== 'false'`) at [context-server.ts#L224](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L224) and [#L1068](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L1068).  
Unreferenced files: none found; list is extremely over-inclusive.  
Verdict: **PARTIAL**.

15. **F15 — Warm server / daemon mode**  
Files: 6/6 exist ([15-warm-server...#L28](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/15-warm-server-daemon-mode.md#L28)-L38).  
Functions/behavior: stdio transport is active at [context-server.ts#L16](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L16) and [#L1082](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L1082); `shouldEagerWarmup` is re-exported from `mcp_server` provider module [embeddings.ts#L33](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/providers/embeddings.ts#L33) and currently returns false in shared impl [shared/embeddings.ts#L306](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/shared/embeddings.ts#L306).  
Flags: no mismatch.  
Unreferenced files: none in `mcp_server` scope.  
Verdict: **MATCH**.

16. **F16 — Backend storage adapter abstraction**  
Files: 6/6 exist ([16-backend-storage...#L28](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/16-backend-storage-adapter-abstraction.md#L28)-L38).  
Functions/signatures: `IVectorStore` runtime base class at [vector-store.ts#L13](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/interfaces/vector-store.ts#L13); `SQLiteVectorStore extends IVectorStore` at [vector-index-store.ts#L705](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts#L705).  
Flags: none.  
Unreferenced files: none found.  
Verdict: **MATCH**.

17. **F17 — Cross-process DB hot rebinding**  
Files: 3/3 exist ([17-cross-process...#L28](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/17-cross-process-db-hot-rebinding.md#L28)-L35).  
Functions/signatures: `checkDatabaseUpdated(): Promise<boolean>` at [db-state.ts#L118](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts#L118); `reinitializeDatabase(updatedMarkerTime?): Promise<boolean>` at [db-state.ts#L146](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts#L146); marker constant `DB_UPDATED_FILE` at [config.ts#L78](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/core/config.ts#L78).  
Flags: none.  
Unreferenced files: none found.  
Verdict: **MATCH**.

18. **F18 — Atomic write-then-index API**  
Files: 6/6 exist ([18-atomic-write...#L30](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/18-atomic-write-then-index-api.md#L30)-L40).  
Functions/signatures: `indexMemoryFile(...)` exists [memory-save.ts#L509](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L509); `atomicSaveMemory(...)` exists [memory-save.ts#L871](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L871); `dbCommitted` is returned on rename failure [memory-save.ts#L1003](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L1003).  
Behavior mismatch: catalog states transaction-manager `dbOperation` callback/no-op model; active atomic path writes/renames directly in handler ([memory-save.ts#L904](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L904), [#L985](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L985)) and does not call `executeAtomicSave(...)`.  
Flags: none.  
Unreferenced files: none required for this mismatch finding.  
Verdict: **MISMATCH**.

19. **F19 — Embedding retry orchestrator**  
Files: 6/6 exist ([19-embedding-retry...#L30](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/19-embedding-retry-orchestrator.md#L30)-L40).  
Functions/behavior: retry queue/status logic in [retry-manager.ts#L216](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts#L216), [#L270](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts#L270), [#L431](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts#L431); direct `vec_memories` writes at [retry-manager.ts#L393](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts#L393) and [#L399](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts#L399).  
Behavior drift: catalog says coordination with `index-refresh`; file is marked deprecated/not wired at [index-refresh.ts#L7](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/index-refresh.ts#L7).  
Unreferenced files: `mcp_server/lib/search/vector-index-mutations.ts` participates in `embedding_status='pending'` transitions ([#L206](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts#L206), [#L288](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts#L288)).  
Verdict: **PARTIAL**.

20. **F20 — 7-layer tool architecture metadata**  
Files: 8/8 exist ([20-7-layer...#L30](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/20-7-layer-tool-architecture-metadata.md#L30)-L42).  
Functions/signatures: layer IDs/task mapping in [layer-definitions.ts#L23](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts#L23) and [#L26](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts#L26); single-hop dispatch `dispatchTool(name, args)` at [tools/index.ts#L25](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/tools/index.ts#L25) and call site [context-server.ts#L326](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L326).  
Flags: none.  
Unreferenced files: none found.  
Verdict: **MATCH**.

21. **F21 — Atomic pending-file recovery**  
Files: 4/4 exist ([21-atomic-pending...#L30](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/21-atomic-pending-file-recovery.md#L30)-L38).  
Functions/signatures: `findPendingFiles(dirPath)` [transaction-manager.ts#L302](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts#L302), `recoverPendingFile(...)` [transaction-manager.ts#L325](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts#L325), startup recovery entry [context-server.ts#L423](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L423), recovery invocation [context-server.ts#L478](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L478).  
Flags: none.  
Unreferenced files: none found.  
Verdict: **MATCH**.

22. **F22 — Lineage state active projection and asOf resolution**  
Files: 5/5 exist ([22-lineage-state...#L32](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/22-lineage-state-active-projection-and-asof-resolution.md#L32)-L41).  
Functions/signatures: `resolveActiveLineageSnapshot(...)` [lineage-state.ts#L771](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts#L771), `resolveLineageAsOf(...)` [lineage-state.ts#L812](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts#L812), active projection upsert [lineage-state.ts#L260](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts#L260), schema support [vector-index-schema.ts#L935](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts#L935), save integration [memory-save.ts#L427](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L427).  
Flags: none.  
Unreferenced files: none found.  
Verdict: **MATCH**.

| # | Feature | Files OK? | Functions OK? | Flags OK? | Unreferenced? | Verdict |
|---|---|---|---|---|---|---|
| 1 | 4-stage pipeline refactor | Yes (157/157) | Yes | Yes | No | MATCH |
| 2 | MPAB chunk-to-memory aggregation | Yes (2/2) | Partial | Yes | Yes | PARTIAL |
| 3 | Chunk ordering preservation | Yes (8/8) | Yes | N/A | No | MATCH |
| 4 | Template anchor optimization | Yes (10/10) | Yes | Yes (always-on) | Yes | PARTIAL |
| 5 | Validation signals as retrieval metadata | Yes (10/10) | Yes | Yes (always-on) | Yes | PARTIAL |
| 6 | Learned relevance feedback | Yes (13/13) | Yes | Yes | Yes | PARTIAL |
| 7 | Search pipeline safety | Yes (153/153) | Yes | N/A | No (but over-broad list) | PARTIAL |
| 8 | Performance improvements | Yes (12/12) | Yes | N/A | No | MATCH |
| 9 | Activation window persistence | Yes (4/4) | Yes | N/A | No | MATCH |
| 10 | Legacy V1 pipeline removal | Yes (110/110) | Yes | Yes | Yes | PARTIAL |
| 11 | Pipeline and mutation hardening | Yes (20/20) | Yes | N/A | No | MATCH |
| 12 | DB_PATH extraction/import standardization | N/A (`mcp_server` refs: 0) | Yes | N/A | N/A | MATCH |
| 13 | Strict Zod schema validation | Yes (2/2) | Yes | Yes | Yes | PARTIAL |
| 14 | Dynamic server instructions at MCP init | Yes (344/344) | Yes | Yes | No (but over-broad list) | PARTIAL |
| 15 | Warm server / daemon mode | Yes (6/6) | Yes | N/A | No | MATCH |
| 16 | Backend storage adapter abstraction | Yes (6/6) | Yes | N/A | No | MATCH |
| 17 | Cross-process DB hot rebinding | Yes (3/3) | Yes | N/A | No | MATCH |
| 18 | Atomic write-then-index API | Yes (6/6) | Partial | N/A | No | MISMATCH |
| 19 | Embedding retry orchestrator | Yes (6/6) | Partial | N/A | Yes | PARTIAL |
| 20 | 7-layer tool architecture metadata | Yes (8/8) | Yes | N/A | No | MATCH |
| 21 | Atomic pending-file recovery | Yes (4/4) | Yes | N/A | No | MATCH |
| 22 | Lineage state active projection/asOf | Yes (5/5) | Yes | N/A | No | MATCH |

Overall: **12 MATCH, 9 PARTIAL, 1 MISMATCH**.