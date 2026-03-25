# Iteration 007: Feature Catalog 08-14 vs Code

## Findings

1. **Coverage + existence check passed for all claimed features**
   - Verified categories `08--` through `14--` against master catalog sections covering BUG FIXES through PIPELINE ARCHITECTURE.
   - Master claims reviewed: **120 features**.
   - Snippet files found: **120/120**.
   - Referenced snippet links in master: **120/120 valid**.
   - Unreferenced snippets in categories 08-14: **0**.

2. **Master↔snippet parity is partially drifted (mostly in Current Reality blocks)**
   - Title parity: **120/120 exact**.
   - Description parity: **100/120 exact**, **20 mismatches**.
   - Current Reality parity: **81/120 exact**, **39 mismatches**.
   - Interpretation: file-level traceability is complete, but narrative content in snippets has drifted from master for a non-trivial subset.

3. **Implementation status vs code reality: 119/120 matched, 1 mismatch confirmed**
   - Confirmed mismatch:
     - **Scoring and fusion corrections** (`11--scoring-and-calibration/13-scoring-and-fusion-corrections.md`)
     - Snippet claims tests:
       - `mcp_server/tests/rsf-fusion-edge-cases.vitest.ts`
       - `mcp_server/tests/rsf-fusion.vitest.ts`
     - These files are not present in codebase; only `rrf-fusion` test files exist.
   - Supporting code reality checks also confirm related architecture claims:
     - `postSearchPipeline` removed (only historical comment remains in `handlers/memory-search.ts`).
     - Shared `resolveEffectiveScore()` is wired in pipeline stages.

4. **Material parity mismatch list (description mismatches and/or confirmed status mismatch)**

| Section | Feature | Snippet | Issue |
|---|---|---|---|
| 9 | Math.max/min stack overflow elimination | `08--bug-fixes-and-data-integrity/08-mathmax-min-stack-overflow-elimination.md` | description drift |
| 10 | Agent consumption instrumentation | `09--evaluation-and-measurement/08-agent-consumption-instrumentation.md` | description drift |
| 11 | Typed traversal | `10--graph-signal-activation/16-typed-traversal.md` | description drift |
| 12 | RRF K-value sensitivity analysis | `11--scoring-and-calibration/08-rrf-k-value-sensitivity-analysis.md` | description drift |
| 12 | Scoring and fusion corrections | `11--scoring-and-calibration/13-scoring-and-fusion-corrections.md` | **status mismatch** (missing RSF test files) |
| 12 | Calibrated overlap bonus | `11--scoring-and-calibration/21-calibrated-overlap-bonus.md` | description drift |
| 12 | RRF K experimental tuning | `11--scoring-and-calibration/22-rrf-k-experimental.md` | description drift |
| 12 | Shadow scoring with holdout evaluation | `11--scoring-and-calibration/20-shadow-feedback-holdout-evaluation.md` | description drift |
| 13 | Relative score fusion in shadow mode | `12--query-intelligence/02-relative-score-fusion-in-shadow-mode.md` | description drift |
| 13 | Query decomposition | `12--query-intelligence/10-query-decomposition.md` | description drift |
| 13 | Graph concept routing | `12--query-intelligence/11-graph-concept-routing.md` | description drift |
| 13 | LLM query reformulation | `12--query-intelligence/07-llm-query-reformulation.md` | description drift |
| 13 | HyDE (Hypothetical Document Embeddings) | `12--query-intelligence/08-hyde-hypothetical-document-embeddings.md` | description drift |
| 13 | Index-time query surrogates | `12--query-intelligence/09-index-time-query-surrogates.md` | description drift |
| 14 | Post-save quality review | `13--memory-quality-and-indexing/19-post-save-quality-review.md` | description drift |
| 14 | Implicit feedback log | `13--memory-quality-and-indexing/22-implicit-feedback-log.md` | description drift |
| 14 | Hybrid decay policy | `13--memory-quality-and-indexing/23-hybrid-decay-policy.md` | description drift |
| 14 | Save quality gate exceptions | `13--memory-quality-and-indexing/24-save-quality-gate-exceptions.md` | description drift |
| 14 | Weekly batch feedback learning | `13--memory-quality-and-indexing/20-weekly-batch-feedback-learning.md` | description drift |
| 14 | Assistive reconsolidation | `13--memory-quality-and-indexing/21-assistive-reconsolidation.md` | description drift |
| 15 (Pipeline Architecture) | Legacy V1 pipeline removal | `14--pipeline-architecture/10-legacy-v1-pipeline-removal.md` | description drift |

5. **Current Reality drift-only set (additional 19 features)**
   - These features have matching title/description but non-identical Current Reality text between master and snippet:
   - `08--.../03-co-activation-fan-effect-divisor.md`
   - `08--.../09-session-manager-transaction-gap-fixes.md`
   - `10--.../02-co-activation-boost-strength-increase.md`
   - `10--.../09-anchor-tags-as-graph-nodes.md`
   - `10--.../11-temporal-contiguity-layer.md`
   - `10--.../13-graph-lifecycle-refresh.md`
   - `10--.../14-llm-graph-backfill.md`
   - `10--.../15-graph-calibration-profiles.md`
   - `11--.../02-cold-start-novelty-boost.md`
   - `11--.../13-scoring-and-fusion-corrections.md`
   - `11--.../19-learned-stage2-weight-combiner.md`
   - `12--.../05-dynamic-token-budget-allocation.md`
   - `13--.../01-verify-fix-verify-memory-quality-loop.md`
   - `13--.../05-pre-storage-quality-gate.md`
   - `13--.../16-dry-run-preflight-for-memory-save.md`
   - `13--.../17-outsourced-agent-memory-capture.md`
   - `13--.../18-session-enrichment-and-alignment-guards.md`
   - `14--.../18-atomic-write-then-index-api.md`
   - `14--.../19-embedding-retry-orchestrator.md`

## Summary

- **Existence/traceability:** complete (120/120).
- **Master↔snippet textual parity:** partial drift (20 description mismatches, 39 current-reality mismatches).
- **Implementation status vs code reality:** mostly aligned; **1 confirmed mismatch** (`Scoring and fusion corrections` references non-existent RSF tests).
- **Recommendation:** run a snippet refresh pass for the 39 drifted entries, prioritizing the 21 material items listed above.

## JSONL (type:iteration, run:7, mode:review, dimensions:[traceability])

{"type":"iteration","run":7,"mode":"review","dimensions":["traceability"],"scope":{"categories":["08--bug-fixes-and-data-integrity","09--evaluation-and-measurement","10--graph-signal-activation","11--scoring-and-calibration","12--query-intelligence","13--memory-quality-and-indexing","14--pipeline-architecture"],"master_sections":["9","10","11","12","13","14","15"]},"totals":{"features_claimed":120,"snippets_found":120,"snippet_missing":0,"title_mismatch":0,"description_mismatch":20,"current_reality_mismatch":39,"implementation_status_mismatch":1},"status":"needs_alignment","findings":[{"id":"fc-007-001","severity":"high","type":"implementation_status_mismatch","feature":"Scoring and fusion corrections","snippet":"11--scoring-and-calibration/13-scoring-and-fusion-corrections.md","evidence":{"missing_tests":["mcp_server/tests/rsf-fusion-edge-cases.vitest.ts","mcp_server/tests/rsf-fusion.vitest.ts"],"existing_related_tests":["mcp_server/tests/rrf-fusion.vitest.ts","mcp_server/tests/unit-rrf-fusion.vitest.ts"]}},{"id":"fc-007-002","severity":"medium","type":"parity_drift","metric":"description_mismatch","count":20},{"id":"fc-007-003","severity":"medium","type":"parity_drift","metric":"current_reality_mismatch","count":39}],"method":"Automated parse of feature_catalog.md sections 9-15, link verification to snippet files in categories 08-14, section text equality checks, and source file existence checks against .opencode/skill/system-spec-kit."}
