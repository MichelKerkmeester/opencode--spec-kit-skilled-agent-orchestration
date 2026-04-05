# Iteration 8: Quality Score Distribution and Filtering Impact

## Focus

This iteration traced how `quality_score` is generated, persisted, and consumed during search in the live DB at `.opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite`. The goal was to determine whether ingest is setting scores correctly, whether `min_quality_score` removes real results in practice, and whether stored quality correlates with observed search relevance.

## Findings

1. `min_quality_score` is an opt-in DB-column filter, and the requested source/dist files are in sync.

   The helper in `lib/search/search-utils.ts` only filters when the caller passes a finite threshold; otherwise it returns the original result set unchanged. When active, it clamps the threshold to `[0,1]`, treats missing or non-finite `quality_score` as `0`, and performs a raw `quality_score >= threshold` test. The compiled JS in `dist/lib/search/search-utils.js` is semantically identical. The handler layer only resolves the threshold and passes it into the V2 pipeline; the live filtering happens in Stage 1 candidate generation, including the main candidate batch, LLM reformulation, HyDE, and summary-embedding candidates. Code: `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:79-105`, `.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/search-utils.js:28-49`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:431-486`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:101-117`, `:991-993`, `:1038-1049`, `:1097-1106`, `:1182-1183`.

   SQL evidence on the live DB shows the filter would be highly destructive if enabled:

   ```sql
   SELECT '>=0.1' AS threshold, SUM(CASE WHEN quality_score < 0.1 THEN 1 ELSE 0 END) AS removed
   FROM memory_index
   UNION ALL
   SELECT '>=0.4', SUM(CASE WHEN quality_score < 0.4 THEN 1 ELSE 0 END)
   FROM memory_index;
   ```

   Observed:

   - `>=0.1` would remove `520 / 1002` rows (`51.9%`)
   - `>=0.4` would remove `586 / 1002` rows (`58.48%`)

   Conclusion: the filter absolutely can remove results, but only when a caller explicitly opts into `min_quality_score` or `minQualityScore`.

2. `save-quality-gate.ts` is not the thing that writes `quality_score`; it is a pass/fail gate, and it is currently in warn-only rollout.

   In the requested TS source, `save-quality-gate.ts` computes a structural/content-quality decision around a `0.4` signal-density threshold and optional semantic dedup, but it does not mutate `parsed.qualityScore`. The dist JS mirrors the same behavior. The actual persisted `quality_score` for MCP saves comes from `runQualityLoop(...)`, which writes `parsed.qualityScore = qualityLoopResult.score.total` before record creation, and that parsed value is then stored in `create-record.ts`. Code: `.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:99-125`, `:243-257`, `:570-619`, `:728-823`, `.opencode/skill/system-spec-kit/mcp_server/dist/lib/validation/save-quality-gate.js:26-47`, `:159-172`, `:441-479`, `:575-655`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:261-265`, `:737-788`, `.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:180-229`.

   SQL evidence confirms the rollout state:

   ```sql
   SELECT key,
          value,
          datetime(CAST(value AS INTEGER) / 1000, 'unixepoch') AS utc_datetime
   FROM config
   WHERE key = 'quality_gate_activated_at';
   ```

   Observed:

   - `quality_gate_activated_at = 1774875098059`
   - activation time = `2026-03-30 12:51:38 UTC`

   Given the 14-day warn-only window in `save-quality-gate.ts`, this means the gate is still in warn-only mode as of March 30, 2026. So low-signal saves can still enter the DB even when the gate would reject them.

3. Ingest is not using one quality-scoring path; MCP saves get meaningful scores, while script/index-scan style ingest often writes zero because it only extracts frontmatter `quality_score`.

   The script-side indexer reads `quality_score` from frontmatter using `extractQualityScore(content)` and does not run the quality loop. That extractor returns `0` whenever the frontmatter is missing or does not contain `quality_score`. This is a different ingest contract from `memory-save.ts`, which overwrites `parsed.qualityScore` from `runQualityLoop(...)`. Code: `.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:145-172`, `.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.ts:21-28`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:261-265`, `.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:227-228`.

   The DB distribution strongly matches that split ingest model:

   ```sql
   SELECT COUNT(*) AS total_rows,
          SUM(CASE WHEN quality_score = 0 THEN 1 ELSE 0 END) AS zero_rows,
          ROUND(AVG(quality_score), 4) AS avg_score
   FROM memory_index;

   SELECT CASE WHEN document_type='memory' THEN 'memory-save-like' ELSE 'spec-doc-or-other' END AS ingest_class,
          COUNT(*) AS rows,
          SUM(CASE WHEN quality_score = 0 THEN 1 ELSE 0 END) AS zero_rows,
          ROUND(AVG(quality_score), 4) AS avg_quality
   FROM memory_index
   GROUP BY ingest_class;

   SELECT document_type,
          COUNT(*) AS rows,
          SUM(CASE WHEN quality_score = 0 THEN 1 ELSE 0 END) AS zero_rows,
          ROUND(AVG(quality_score), 4) AS avg_quality
   FROM memory_index
   GROUP BY document_type
   ORDER BY rows DESC;
   ```

   Observed:

   - whole DB: `1002` rows, `520` zero-score rows (`51.9%`), average `0.3883`, median `0.0`
   - `document_type='memory'`: `80` rows, `0` zeros, average `0.8806`
   - non-`memory` rows: `922` rows, `520` zeros, average `0.3456`
   - `research`: `146` rows, `142` zeros, average `0.0091`
   - `decision_record`: `115` rows, `108` zeros, average `0.0435`
   - `spec`: `107` rows, `93` zeros, average `0.1122`

   This is the clearest answer to "are quality scores being set correctly during ingest?": they are set coherently for MCP `memory_save` records, but they are not coherently set across the full corpus because script/indexed spec docs depend on frontmatter metadata that is often absent.

4. `filterByMinQualityScore` does remove real search results in practice if enabled, but the current evidence suggests it is mostly dormant in normal search because no runtime caller sets a default threshold.

   I found the parameter defined in the handler/schema/docs/tests, but no non-test runtime caller in the repo that sets it by default. The implementation itself also has no default threshold. Code/search evidence: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:431-486`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:115-125`, `.opencode/command/memory/search.md:897-898`, plus repo-wide `rg -n "min_quality_score|minQualityScore"` showing docs, schemas, tests, and no production caller setting a baseline threshold.

   The live search logs show why enabling it would be risky:

   ```sql
   WITH ranked AS (
     SELECT cl.id AS search_log_id,
            cl.query_text,
            CAST(j.key AS INTEGER) + 1 AS rank_pos,
            CAST(j.value AS INTEGER) AS memory_id,
            mi.quality_score
     FROM consumption_log cl, json_each(cl.result_ids) j
     JOIN memory_index mi ON mi.id = CAST(j.value AS INTEGER)
     WHERE cl.event_type='search' AND cl.result_count > 0
   )
   SELECT search_log_id,
          query_text,
          COUNT(*) AS shown,
          SUM(CASE WHEN quality_score < 0.1 THEN 1 ELSE 0 END) AS removed_ge_01,
          SUM(CASE WHEN quality_score < 0.4 THEN 1 ELSE 0 END) AS removed_ge_04,
          MIN(CASE WHEN quality_score < 0.1 THEN rank_pos END) AS first_removed_rank_ge_01
   FROM ranked
   GROUP BY search_log_id, query_text
   ORDER BY search_log_id;
   ```

   Observed:

   - only `4` logged searches returned results, for `29` shown rows total
   - `11 / 29` shown rows had `quality_score = 0`
   - every logged search would lose its rank-1 result at `min_quality_score >= 0.1`
   - for `semantic search implementation architecture`, `min_quality_score >= 0.4` would remove `4 / 8` shown results

   So the filter is not harmless. It is likely dormant by default, but once a caller turns it on, it can remove highly ranked live results immediately.

5. Stored `quality_score` currently has weak-to-negative correlation with observed search relevance; in the available logs, zero-score rows often rank at the top.

   There is no populated `scoring_observations` telemetry in this DB snapshot, and `feedback_events` only contains `search_shown`, so the best available relevance proxy is returned rank position from logged searches. Using that proxy, higher `quality_score` is associated with worse rank position, not better rank position:

   ```sql
   WITH ranked AS (
     SELECT cl.id AS search_log_id,
            CAST(j.key AS INTEGER) + 1 AS rank_pos,
            mi.quality_score
     FROM consumption_log cl, json_each(cl.result_ids) j
     JOIN memory_index mi ON mi.id = CAST(j.value AS INTEGER)
     WHERE cl.event_type='search' AND cl.result_count > 0
   ), stats AS (
     SELECT COUNT(*) AS n,
            AVG(quality_score) AS avg_q,
            AVG(rank_pos) AS avg_r,
            AVG(quality_score * rank_pos) AS avg_qr,
            AVG(quality_score * quality_score) AS avg_q2,
            AVG(rank_pos * rank_pos) AS avg_r2
     FROM ranked
   )
   SELECT ROUND((avg_qr - avg_q * avg_r) /
                NULLIF(sqrt((avg_q2 - avg_q * avg_q) * (avg_r2 - avg_r * avg_r)), 0), 4)
          AS pearson_quality_vs_rank
   FROM stats;
   ```

   Observed:

   - `pearson_quality_vs_rank = +0.3871`
   - because lower rank is better, this implies an inverse relationship to observed relevance in the limited live sample

   The concrete rows are even more telling:

   ```sql
   SELECT search_log_id, query_text, rank_pos, memory_id, quality_score, title
   FROM ranked
   WHERE quality_score = 0
   ORDER BY search_log_id, rank_pos;
   ```

   Observed zero-score top results:

   - memory `380` (`System-Spec-Kit Architecture Audit v2 -- Research Report`) ranked `#1` in all 4 logged searches
   - memory `764` (spec doc) ranked `#2` in 2 logged searches
   - memory `893` (research doc) ranked `#4` in 2 logged searches

   This does not prove that `quality_score` is useless, but it does show that the stored score is currently not a reliable proxy for search relevance. It is better interpreted as ingest completeness/metadata quality than ranking quality.

## Concrete Recommendations

1. Unify ingest scoring paths so spec-doc/index-scan ingestion computes the same quality signal as `memory_save` instead of relying on frontmatter `quality_score` alone. Expected impact: collapse the current `520` zero-score rows and make `min_quality_score` meaningful.

2. Do not enable a default `min_quality_score` in wrappers or command presets until the corpus is backfilled. Expected impact: avoids immediate recall loss of `51.9%` at `>=0.1` and `58.48%` at `>=0.4`.

3. Treat `quality_score` as an ingest-quality field, not a retrieval-quality field, unless the ranking pipeline starts producing a calibrated search-quality metric. Expected impact: clearer semantics and fewer false assumptions about relevance filtering.

4. Add search telemetry for `qualityThreshold`, `pre_filter_count`, and `post_filter_count` to the existing search logs. Expected impact: lets us measure real-world filter usage directly instead of inferring it from sparse `search_shown` rows.

5. Backfill the existing zero-score non-memory corpus, prioritizing `research`, `decision_record`, and `spec` documents. Expected impact: prevents top-ranked but zero-score docs from being dropped when any caller experiments with quality filtering.

## New Information Ratio

0.62
