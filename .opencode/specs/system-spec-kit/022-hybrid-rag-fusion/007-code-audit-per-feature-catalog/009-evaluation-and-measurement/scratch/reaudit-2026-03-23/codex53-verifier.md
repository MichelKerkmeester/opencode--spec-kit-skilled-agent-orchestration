Audit scope completed for all 16 entries in `09--evaluation-and-measurement`, plus prior findings and referenced `mcp_server` sources.

Prior audit reference: `specs/system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/009-evaluation-and-measurement/implementation-summary.md:34-47`.

1. Feature 01 — Evaluation database and schema  
- File verification: catalog refs `.opencode/.../01-evaluation-database-and-schema.md:30,36` both exist (`mcp_server/lib/eval/eval-db.ts`, `mcp_server/tests/eval-db.vitest.ts`).  
- Function verification: `initEvalDb(dataDir?: string)` [eval-db.ts#L114](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-db.ts#L114), `getEvalDb()` #L154, `getEvalDbPath()` #L165, `closeEvalDb()` #L172; five-table schema at #L40-99.  
- Flag defaults: `SPECKIT_EVAL_LOGGING` true-only gate in [eval-logger.ts#L21](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts#L21)-#L23; fail-safe try/catch logging in handlers [memory-search.ts#L527](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L527), [memory-context.ts#L929](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts#L929), [memory-triggers.ts#L207](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts#L207).  
- Unreferenced files found: `mcp_server/lib/eval/eval-logger.ts`, `mcp_server/handlers/memory-search.ts`, `mcp_server/handlers/memory-context.ts`, `mcp_server/handlers/memory-triggers.ts`.  
- Verdict: **PARTIAL** (behavior matches, catalog source list is incomplete for logging hooks).

2. Feature 02 — Core metric computation  
- File verification: catalog refs `.opencode/.../02-core-metric-computation.md:32,38` both exist.  
- Function verification: core functions exist in [eval-metrics.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts): `computeMRR` #L108, `computeNDCG` #L139, `computeRecall` #L181, `computeHitRate` #L303, plus diagnostics and extras incl. `computeMAP` #L264, `computeAllMetrics` #L576.  
- Flag defaults: N/A.  
- Unreferenced files found: none material.  
- Behavioral accuracy: catalog says 11 metrics (`02...md:10`), code computes 12 (`AllMetrics` includes `map` at #L53; returned at #L597).  
- Verdict: **PARTIAL**.

3. Feature 03 — Observer effect mitigation  
- File verification: catalog refs `.opencode/.../03-observer-effect-mitigation.md:30-31,37-39` all exist.  
- Function verification: `runShadowScoring(...)` returns `null` at [shadow-scoring.ts#L252](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts#L252)-#L261; `logShadowComparison(...)` returns `false` at #L379-#L382.  
- Flag defaults: eval logging true-only gate [eval-logger.ts#L21](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts#L21)-#L23; fail-safe non-fatal logging paths confirmed.  
- Unreferenced files found: eval-logger + handler integration files (same as Feature 01).  
- Behavioral accuracy: matches catalog statement that formal p95 overhead alerting is not implemented (`03...md:20`).  
- Verdict: **MATCH**.

4. Feature 04 — Full-context ceiling evaluation  
- File verification: catalog refs `.opencode/.../04-full-context-ceiling-evaluation.md:28-29,35-36` all exist.  
- Function verification: `computeCeilingFromGroundTruth` [eval-ceiling.ts#L188](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-ceiling.ts#L188), `computeCeilingWithScorer` #L263, `interpretCeilingVsBaseline` #L344.  
- Flag defaults: `k` default 5 in both ceiling funcs (#L191, #L270).  
- Unreferenced files found: none required.  
- Behavioral accuracy: module is marked deprecated/not wired (`@deprecated` at #L10; non-test usages not found). Catalog does not state deprecation.  
- Verdict: **PARTIAL**.

5. Feature 05 — Quality proxy formula  
- File verification: catalog refs `.opencode/.../05-quality-proxy-formula.md:32,38-39` all exist.  
- Function verification: `computeQualityProxy(input)` at [eval-quality-proxy.ts#L166](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-quality-proxy.ts#L166).  
- Flag/default check: weights exactly match 0.40/0.25/0.20/0.15 at #L21-26; default latency target 500ms at #L18 (input default at #L175).  
- Unreferenced files found: `mcp_server/lib/telemetry/retrieval-telemetry.ts` uses canonical formula [#L483](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts#L483)-#L493.  
- Verdict: **MATCH**.

6. Feature 06 — Synthetic ground truth corpus  
- File verification: catalog refs `.opencode/.../06-synthetic-ground-truth-corpus.md:32-33,39` all exist.  
- Function verification: `generateGroundTruth` [ground-truth-generator.ts#L103](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts#L103), `loadGroundTruth` #L137, `validateGroundTruthDiversity` #L210.  
- Defaults: diversity gates at #L66-83 (min totals/intents/manual/hard-negatives).  
- Unreferenced files found: `mcp_server/lib/eval/data/ground-truth.json` (data backing this feature).  
- Behavioral accuracy: JSON currently has 110 queries, 40 manual, 11 hard negatives, 7 intent types (computed from the file).  
- Verdict: **MATCH**.

7. Feature 07 — BM25-only baseline  
- File verification: catalog refs `.opencode/.../07-bm25-only-baseline.md:30-32,38-40` all exist.  
- Function verification: `runBM25Baseline(searchFn, config?)` at [bm25-baseline.ts#L490](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts#L490); configurable `recallK` use at #L504 and #L549.  
- Flag defaults: `ENABLE_BM25` default-on behavior in [bm25-index.ts#L56](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts#L56)-#L58.  
- Unreferenced files found: `mcp_server/lib/search/bm25-index.ts` (flag/runtime channel control).  
- Verdict: **MATCH**.

8. Feature 08 — Agent consumption instrumentation  
- File verification: catalog refs `.opencode/.../08-agent-consumption-instrumentation.md:30,36` exist.  
- Function verification: `isConsumptionLogEnabled()` hardcoded false at [consumption-logger.ts#L84](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts#L84)-#L86; `logConsumptionEvent` early no-op at #L133-135.  
- Flag defaults: inert/deprecated behavior is correct.  
- Unreferenced files found: handler wiring in `memory-search.ts` #L953-980, `memory-context.ts` #L1139-1169, `memory-triggers.ts` #L449-464.  
- Verdict: **MATCH**.

9. Feature 09 — Scoring observability  
- File verification: catalog refs `.opencode/.../09-scoring-observability.md:32,38-39` exist.  
- Function verification: `SAMPLING_RATE=0.05` [scoring-observability.ts#L21](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/scoring-observability.ts#L21); `logScoringObservation` persists caller-provided novelty/interference fields at #L133-145; fail-safe `console.error` on errors at #L90-94, #L147-150, #L203-207.  
- Flag/default check: sampling default correct (5%).  
- Unreferenced files found: integration in `context-server.ts` #L862-867 and `lib/scoring/composite-scoring.ts` #L539-558.  
- Verdict: **MATCH**.

10. Feature 10 — Full reporting and ablation framework  
- File verification: catalog refs `.opencode/.../10-full-reporting-and-ablation-study-framework.md:32-37,42-46` all exist.  
- Function verification: `isAblationEnabled()` [ablation-framework.ts#L44](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts#L44), `runAblation(...)` #L361, `storeAblationResults(...)` #L524; sign-test log-space math at #L229-257; dashboard `generateDashboardReport(...)` [reporting-dashboard.ts#L511](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts#L511), `isHigherBetter(...)` #L170-177.  
- Flag/default check: `SPECKIT_ABLATION` true-only; `SPECKIT_DASHBOARD_LIMIT` default 10000 at [reporting-dashboard.ts#L25](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts#L25).  
- Unreferenced files found: MCP exposure is implemented via `handlers/eval-reporting.ts` #L166, #L316; `handlers/index.ts` #L129-135; `tool-schemas.ts` #L458-508.  
- Verdict: **MATCH**.

11. Feature 11 — Shadow scoring and channel attribution  
- File verification: catalog refs `.opencode/.../11-shadow-scoring-and-channel-attribution.md:32-34,40-43` all exist.  
- Function verification: `runShadowScoring` returns null [shadow-scoring.ts#L252](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts#L252)-#L261, `logShadowComparison` returns false #L379-382; channel attribution APIs exist in [channel-attribution.ts#L103](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/channel-attribution.ts#L103), #L150, #L212.  
- Flag/default check: shadow flag retained as no-op behavior is accurate.  
- Unreferenced files found: no production pipeline consumers of channel-attribution found (only tests import/use it).  
- Behavioral accuracy: catalog claims “channel attribution logic remains active within the 4-stage pipeline” (`11...md:23`), but code marks it deprecated and never wired (`channel-attribution.ts:16`).  
- Verdict: **MISMATCH**.

12. Feature 12 — Test quality improvements  
- File verification: catalog refs `.opencode/.../12-test-quality-improvements.md:38,44-46` all exist.  
- Function verification: `isMemoryFile` exclusion `!normalizedPath.includes('/z_archive/')` at [memory-parser.ts#L693](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts#L693); timeout 15000 at [memory-save-extended.vitest.ts#L755](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts#L755); `db.close()` in [entity-linker.vitest.ts#L136](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts#L136); behavioral flag tests in [integration-search-pipeline.vitest.ts#L252](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-search-pipeline.vitest.ts#L252).  
- Flag/default check: N/A.  
- Unreferenced files found: catalog text claims “18+ test files updated” (`12...md:28`) but source table lists 4 files; additional named suites exist (e.g., `assistive-reconsolidation.vitest.ts`, `five-factor-scoring.vitest.ts`, `working-memory.vitest.ts`, `session-cleanup.vitest.ts`, etc.).  
- Verdict: **PARTIAL**.

13. Feature 13 — Evaluation and housekeeping fixes  
- File verification: catalog refs `.opencode/.../13-evaluation-and-housekeeping-fixes.md:35-37,43-45` all exist.  
- Function verification: some fixes in listed files (evalRunId bootstrap [eval-logger.ts#L48](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts#L48)-#L55), but four other fixes are in non-listed files:  
  - postflight re-correction query: `handlers/session-learning.ts` #L400  
  - `parseArgs<T>()` guard: `tools/types.ts` #L19-24  
  - 128-bit hash: `lib/session/session-manager.ts` #L309  
  - exit handler cleanup: `lib/storage/access-tracker.ts` #L293-299  
- Flag/default check: N/A.  
- Unreferenced files found: the four files above plus ablation recallK plumbing in `handlers/eval-reporting.ts` #L196-207 and `lib/eval/ablation-framework.ts` #L369/#L540.  
- Verdict: **PARTIAL**.

14. Feature 14 — Cross-AI validation fixes  
- File verification: catalog refs `.opencode/.../14-cross-ai-validation-fixes.md:41-47,53-58` all exist.  
- Function verification:  
  - Re-sort after feedback mutation is present: [stage2-fusion.ts#L766](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L766)-#L771 and #L821-823.  
  - `Number.isFinite` guards present: [evidence-gap-detector.ts#L142](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts#L142)-#L145, #L164-166.  
  - Dashboard limit fix present: [reporting-dashboard.ts#L25](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts#L25).  
  - Causal-edge exception propagation present: [causal-edges.ts#L552](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts#L552)-#L563 with transactional caller [memory-crud-delete.ts#L93](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts#L93)-#L116.  
  - Partial-update transaction wrapper present: [memory-crud-update.ts#L137](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts#L137)-#L144.  
  - Cache-before-embedding gate present in handler: [memory-search.ts#L614](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L614)-#L628.  
  - Dedup `parent_id IS NULL` is in [handlers/save/dedup.ts#L97](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts#L97), #L170, #L186, not in listed `vector-index-queries.ts` (that file’s `parent_id` usage is orphan-chunk diagnostics at #L1357-1364).  
- Flag/default check: dashboard limit default is correct; other fix locations are mismapped in catalog.  
- Unreferenced files found: `handlers/save/dedup.ts`, `handlers/memory-search.ts`, `handlers/memory-crud-update.ts`, `handlers/memory-crud-delete.ts`, `lib/session/session-manager.ts` (`id != null` guards at #L352/#L363/#L395).  
- Verdict: **PARTIAL**.

15. Feature 15 — Memory roadmap baseline snapshot  
- File verification: catalog refs `.opencode/.../15-memory-roadmap-baseline-snapshot.md:32-34,40` all exist.  
- Function verification: `captureMemoryStateBaselineSnapshot(...)` at [memory-state-baseline.ts#L176](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/memory-state-baseline.ts#L176), `persistMemoryStateBaselineSnapshot(...)` #L153.  
- Flag/default check: baseline path initializes eval DB beside context DB at #L180; persisted channel `memory-state-baseline` at #L163; metadata includes phase/capabilities/scope/context path at #L193-198; defaults phase `shared-rollout` [capability-flags.ts#L114](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts#L114), scopeDimensionsTracked=5 #L153.  
- Unreferenced files found: none material.  
- Verdict: **MATCH**.

16. Feature 16 — INT8 quantization evaluation  
- File verification: catalog explicitly states no dedicated source files (`16-int8-quantization-evaluation.md:28`).  
- Function verification: N/A.  
- Flag/default check: N/A.  
- Unreferenced files found: none.  
- Verdict: **MATCH**.

**Summary Table**

| # | Feature | Files OK? | Functions OK? | Flags OK? | Unreferenced? | Verdict |
|---|---|---|---|---|---|---|
| 1 | Evaluation database and schema | Yes | Yes | Yes | Yes | PARTIAL |
| 2 | Core metric computation | Yes | No | N/A | No | PARTIAL |
| 3 | Observer effect mitigation | Yes | Yes | Yes | Yes | MATCH |
| 4 | Full-context ceiling evaluation | Yes | Yes | N/A | No | PARTIAL |
| 5 | Quality proxy formula | Yes | Yes | Yes | Yes | MATCH |
| 6 | Synthetic ground truth corpus | Yes | Yes | N/A | Yes | MATCH |
| 7 | BM25-only baseline | Yes | Yes | Yes | Yes | MATCH |
| 8 | Agent consumption instrumentation | Yes | Yes | Yes | Yes | MATCH |
| 9 | Scoring observability | Yes | Yes | Yes | Yes | MATCH |
| 10 | Full reporting and ablation framework | Yes | Yes | Yes | Yes | MATCH |
| 11 | Shadow scoring and channel attribution | Yes | Yes | Yes | Yes | MISMATCH |
| 12 | Test quality improvements | Yes | Yes | N/A | Yes | PARTIAL |
| 13 | Evaluation and housekeeping fixes | Yes | No | N/A | Yes | PARTIAL |
| 14 | Cross-AI validation fixes | Yes | No | No | Yes | PARTIAL |
| 15 | Memory roadmap baseline snapshot | Yes | Yes | N/A | No | MATCH |
| 16 | INT8 quantization evaluation | N/A | N/A | N/A | No | MATCH |