**Per-Feature Verification (Tooling and Scripts)**  
Prior audit baseline read from [implementation-summary.md](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/016-tooling-and-scripts/implementation-summary.md):3-4.

1. **#01 Tree thinning for spec folder consolidation**  
Files: no `mcp_server/...` references in this entry’s source-file section ([01-tree-thinning-for-spec-folder-consolidation.md](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/01-tree-thinning-for-spec-folder-consolidation.md):30-40).  
Functions: N/A on `mcp_server` scope.  
Flags/defaults: N/A on `mcp_server` scope.  
Unreferenced `mcp_server` files: N/A.  
Verdict: **PARTIAL** (no `mcp_server` implementation surface to verify).

2. **#02 Architecture boundary enforcement**  
Files: wrapper exists at [reindex-embeddings.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/scripts/reindex-embeddings.ts):1.  
Functions/signatures: wrapper behavior present (`spawnSync` import and delegated exec) at [reindex-embeddings.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/scripts/reindex-embeddings.ts):6-12.  
Flags/defaults: N/A.  
Unreferenced files: `mcp_server/scripts/reindex-embeddings.ts` is implied by reality text but not listed in the source-file table ([02-architecture-boundary-enforcement.md](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/02-architecture-boundary-enforcement.md):30-38).  
Verdict: **PARTIAL** (behavior matches, catalog mapping incomplete for `mcp_server` wrapper).

3. **#03 Progressive validation for spec documents**  
Files: referenced test exists at [progressive-validation.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/progressive-validation.vitest.ts):1.  
Functions/signatures: pipeline coverage aligns with catalog via test contract comments and helpers ([progressive-validation.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/progressive-validation.vitest.ts):1-18, 114-155).  
Flags/defaults: exit contract and level behavior covered in test suite headings/comments ([progressive-validation.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/progressive-validation.vitest.ts):9-18).  
Unreferenced files: none found in `mcp_server` scope.  
Verdict: **MATCH**.

4. **#04 Dead code removal**  
Files: all referenced `mcp_server/lib/...` files exist (see appendix).  
Functions/signatures: removed symbols absent (`isShadowScoringEnabled`, `isRsfEnabled`, `computeCausalDepth`, `getSubgraphWeights`, `RECOVERY_HALF_LIFE_DAYS`, `CoActivationEvent`, `logCoActivationEvent`); retained replacements present ([learned-feedback.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts):418, [graph-signals.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts):484).  
Flags/defaults: no relevant defaults documented for this feature.  
Unreferenced files: retention statement references `computeStructuralFreshness`/`computeGraphCentrality` in [fsrs.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts):40,63, but that file is not in the feature’s source-file list.  
Verdict: **PARTIAL** (code state correct, source-file list incomplete).

5. **#05 Code standards alignment**  
Files: referenced `mcp_server` files exist (see appendix).  
Functions/signatures: catalog says `SPEC_FOLDER_LOCKS` is in `memory-save.ts`, but it is now defined in [spec-folder-mutex.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/spec-folder-mutex.ts):10 and consumed via import in [memory-save.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts):86.  
Flags/defaults: N/A.  
Unreferenced files: [spec-folder-mutex.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/spec-folder-mutex.ts):1-29 is implementing evidence but absent from feature source list.  
Verdict: **PARTIAL**.

6. **#06 Real-time filesystem watching with chokidar**  
Files: referenced files exist: [file-watcher.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts):1 and [file-watcher.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts):1.  
Functions/signatures: `startFileWatcher(config: WatcherConfig): FSWatcher` at [file-watcher.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts):159, `getWatcherMetrics()` at :52-56.  
Flags/defaults: `DEFAULT_DEBOUNCE_MS=2000`, retries `[1000,2000,4000]` at :43-45; `SPECKIT_FILE_WATCHER` default false via [search-flags.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts):220-223.  
Unreferenced files: runtime wiring/gating in [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts):1024-1051 and [search-flags.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts):220-223 are not listed in this feature’s source-file table.  
Verdict: **PARTIAL**.

7. **#07 Standalone admin CLI**  
Files: referenced files exist ([cli.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/cli.ts):1, [schema-downgrade.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts):241, [checkpoints.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts):1104).  
Functions/signatures: `runBulkDelete()` at [cli.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/cli.ts):173, `runReindex()` :364, `runSchemaDowngrade()` :431, `downgradeSchemaV16ToV15(database, options)` at [schema-downgrade.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts):241-244.  
Flags/defaults: safety and defaults align (`--skip-checkpoint` guard at [cli.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/cli.ts):205-207; best-effort checkpoint at :270-287; `--to 15 --confirm` required at :436-443).  
Unreferenced files: operational behavior also depends on dynamic `handleMemoryIndexScan` import at [cli.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/cli.ts):374 and mutation/history helpers at :24, 325-344, not listed in source-file table.  
Verdict: **PARTIAL**.

8. **#08 Watcher delete/rename cleanup**  
Files: referenced files exist ([file-watcher.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts):1, [file-watcher.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts):1).  
Functions/signatures: delete/rename cleanup path is present at [file-watcher.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts):350-378; tests cover unlink/rename/debounce/burst/concurrency ([file-watcher.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts):304,430,474,502,552).  
Flags/defaults: 2s default debounce is active at [file-watcher.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts):43,167.  
Unreferenced files: `removeFn` is wired from server startup in [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts):1048-1050 but not listed in feature source files.  
Verdict: **PARTIAL**.

9. **#09 Migration checkpoint scripts**  
Files: referenced files exist ([create-checkpoint.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/scripts/migrations/create-checkpoint.ts):1, [restore-checkpoint.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/scripts/migrations/restore-checkpoint.ts):1, [capability-flags.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts):1).  
Functions/signatures: exported helpers match (`parseArgs`, `runCreateCheckpoint`, `main`) at [create-checkpoint.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/scripts/migrations/create-checkpoint.ts):56,172,218,244-252 and (`parseArgs`, `runRestoreCheckpoint`, `main`) at [restore-checkpoint.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/scripts/migrations/restore-checkpoint.ts):55,151,194,222-229.  
Flags/defaults: defaults align (`name='migration-checkpoint'`, `json=false`, default out dir) at [create-checkpoint.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/scripts/migrations/create-checkpoint.ts):60,62,97-100; restore defaults (`force=false`, `json=false`, backup dir default) at [restore-checkpoint.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/scripts/migrations/restore-checkpoint.ts):59-60,97-100.  
Unreferenced files: none found.  
Verdict: **MATCH**.

10. **#10 Schema compatibility validation**  
Files: referenced files exist ([vector-index-schema.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts):1, [vector-index-schema-compatibility.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-compatibility.vitest.ts):1).  
Functions/signatures: `validate_backward_compatibility(database)` at [vector-index-schema.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts):1173; camelCase alias at :2014.  
Flags/defaults: N/A; hard requirements and warning-only tables match docs at [vector-index-schema.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts):49-59,1189-1196.  
Unreferenced files: none found.  
Verdict: **MATCH**.

11. **#11 Feature catalog code references**  
Files: representative files exist ([handlers/index.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts):1, [README.md](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/README.md):1).  
Functions/signatures: N/A.  
Flags/defaults: N/A.  
Behavioral accuracy: **does not match** catalog’s universal claim. Evidence: [handlers/index.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts):20 has one feature comment, but [mcp_server/README.md](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/README.md):1-220 has no `MODULE:` or `Feature catalog:` convention strings; coverage scan found `66`/`257` non-test `mcp_server` TS files missing `Feature catalog:` and `24`/`33` in `shared`; verifier script enforces `MODULE:` only ([verify_alignment_drift.py](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py):266-277).  
Unreferenced files: many actual code files are outside the representative mapping for this feature’s reality claim.  
Verdict: **MISMATCH**.

12. **#12 Session Capturing Pipeline Quality**  
Files: no `mcp_server` implementation files listed in source-file section ([12-session-capturing-pipeline-quality.md](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md):170-198); `mcp_server` appears only in verification command list (:232-235).  
Functions/signatures: N/A on `mcp_server` source-reference scope.  
Flags/defaults: N/A on `mcp_server` source-reference scope.  
Unreferenced files: N/A.  
Verdict: **PARTIAL**.

13. **#13 Constitutional memory manager command**  
Files: referenced `mcp_server` verification tests exist (e.g., [importance-tiers.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/importance-tiers.vitest.ts):1, [full-spec-doc-indexing.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts):1, [handler-memory-save.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts):1, [dual-scope-hooks.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts):1, [context-server.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts):1).  
Functions/signatures: mcp-side evidence is test-only; core feature implementation is command markdown outside `mcp_server` ([13-constitutional-memory-manager-command.md](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/13-constitutional-memory-manager-command.md):18,37).  
Flags/defaults: N/A on `mcp_server` scope.  
Unreferenced files: none in `mcp_server` verification set.  
Verdict: **PARTIAL**.

14. **#14 Source-dist alignment enforcement**  
Files: no `mcp_server` source file is listed in feature source-file table ([14-source-dist-alignment-enforcement.md](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/14-source-dist-alignment-enforcement.md):35-45).  
Functions/signatures: N/A on `mcp_server` source-reference scope.  
Flags/defaults: N/A.  
Behavioral check: current tree has both `mcp_server/dist/lib` and `mcp_server/lib`; orphan scan found `TOTAL_ORPHANS=0`.  
Unreferenced files: N/A.  
Verdict: **PARTIAL** (feature behavior validated, but no direct `mcp_server` source refs in catalog entry).

15. **#15 Module boundary map**  
Files: referenced file exists at [MODULE_MAP.md](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md):1.  
Functions/signatures: N/A.  
Flags/defaults: N/A.  
Behavioral accuracy: catalog says “all 26 subdirectories” ([15-module-boundary-map.md](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/15-module-boundary-map.md):3,17), but filesystem has `28` top-level `lib` dirs; map has 26 headings and no `feedback/` or `spec/` heading (`NO_FEEDBACK_SPEC_HEADINGS`).  
Unreferenced files: missing module-map coverage for `lib/feedback` and `lib/spec`.  
Verdict: **MISMATCH**.

16. **#16 JSON mode structured summary hardening**  
Files: referenced `mcp_server` files exist ([retry-manager.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts):1, [memory-crud-health.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts):1, tests in appendix).  
Functions/signatures: `EmbeddingRetryStats` interface at [retry-manager.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts):37-44; `getEmbeddingRetryStats()` at :305-314; consumed in health payload at [memory-crud-health.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts):301,365,436.  
Flags/defaults: zero-state/default telemetry aligns with init snapshot at [retry-manager.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts):120-127 and tests ([embedding-retry-stats.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/embedding-retry-stats.vitest.ts):24-34, [retry-manager-health.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/retry-manager-health.vitest.ts):23-30).  
Unreferenced files: none found for `mcp_server` subsection.  
Verdict: **MATCH**.

17. **#17 JSON-only save contract**  
Files: no `mcp_server` source references in source-file section ([17-json-primary-deprecation-posture.md](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/17-json-primary-deprecation-posture.md):65-80).  
Functions/signatures: N/A on `mcp_server` scope.  
Flags/defaults: N/A on `mcp_server` scope.  
Unreferenced files: N/A.  
Verdict: **PARTIAL**.

18. **#18 Template compliance contract enforcement**  
Files: no `mcp_server` source references in source-file section ([18-template-compliance-contract-enforcement.md](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/18-template-compliance-contract-enforcement.md):45-54).  
Functions/signatures: N/A on `mcp_server` scope.  
Flags/defaults: N/A on `mcp_server` scope.  
Unreferenced files: N/A.  
Verdict: **PARTIAL**.

**Summary Table**

| # | Feature | Files OK? | Functions OK? | Flags OK? | Unreferenced? | Verdict |
|---|---|---|---|---|---|---|
| 1 | Tree thinning for spec folder consolidation | N/A (`mcp_server` refs absent) | N/A | N/A | N/A | PARTIAL |
| 2 | Architecture boundary enforcement | Yes | Partial | N/A | Yes | PARTIAL |
| 3 | Progressive validation for spec documents | Yes | Yes | Yes | No | MATCH |
| 4 | Dead code removal | Yes | Yes (absence checks pass) | N/A | Yes | PARTIAL |
| 5 | Code standards alignment | Yes | Partial | N/A | Yes | PARTIAL |
| 6 | Real-time filesystem watching with chokidar | Yes | Yes | Yes | Yes | PARTIAL |
| 7 | Standalone admin CLI | Yes | Yes | Yes | Yes | PARTIAL |
| 8 | Watcher delete/rename cleanup | Yes | Yes | Yes | Yes | PARTIAL |
| 9 | Migration checkpoint scripts | Yes | Yes | Yes | No | MATCH |
| 10 | Schema compatibility validation | Yes | Yes | N/A | No | MATCH |
| 11 | Feature catalog code references | Yes | N/A | N/A | Yes | MISMATCH |
| 12 | Session Capturing Pipeline Quality | N/A (`mcp_server` impl refs absent) | N/A | N/A | N/A | PARTIAL |
| 13 | Constitutional memory manager command | Yes (verification files) | Partial (`mcp_server` is test-only) | N/A | No | PARTIAL |
| 14 | Source-dist alignment enforcement | N/A (no direct `mcp_server` source refs) | N/A | N/A | N/A | PARTIAL |
| 15 | Module boundary map | Yes | N/A | N/A | Yes | MISMATCH |
| 16 | JSON mode structured summary hardening | Yes | Yes | Yes | No | MATCH |
| 17 | JSON-only save contract | N/A (`mcp_server` refs absent) | N/A | N/A | N/A | PARTIAL |
| 18 | Template Compliance Contract Enforcement | N/A (`mcp_server` refs absent) | N/A | N/A | N/A | PARTIAL |

**Appendix: Exhaustive Referenced `mcp_server` File-Existence Sweep**  
All `mcp_server/...` paths referenced anywhere in `16--tooling-and-scripts/*.md` were checked and exist at `:1` (full list omitted here for brevity in this message body, but verification covered all 53 unique referenced paths, including all implementation/test/config/docs files from features 03, 04, 05, 06, 07, 08, 09, 10, 11, 13, 15, and 16).