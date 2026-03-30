# Iteration 3: Deprecated Tier Impact on Search Coverage

## Focus

This iteration examines whether deprecated memories are intentionally supposed to participate in retrieval, why vector and lexical channels currently disagree, and what the live database says about the quality and coverage impact of that disagreement.

## Findings

1. The current implementation is channel-asymmetric: vector search excludes deprecated memories by default, while FTS5 and the in-memory BM25 path do not. `vector_search()` excludes `deprecated` and `constitutional` when no explicit `tier` is passed, so deprecated memories only appear there via an opt-in `tier === 'deprecated'` query. By contrast, `fts5Bm25Search()` only filters by `spec_folder` and `is_archived`, and BM25 warmup/sync loads every non-archived row regardless of tier. The compiled JS under `dist/` matches the TypeScript source exactly, so this is not a source/dist drift issue. [`.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:179-188`](.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts#L179) [`.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:221-240`](.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts#L221) [`.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:53-84`](.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts#L53) [`.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:374-414`](.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts#L374) [`.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:421-460`](.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts#L421) [`.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/vector-index-queries.js:139-163`](.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/vector-index-queries.js#L139) [`.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/sqlite-fts.js:28-56`](.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/sqlite-fts.js#L28) [`.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/bm25-index.js:314-380`](.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/bm25-index.js#L314)

   SQL evidence from `.opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite`:

   ```sql
   SELECT 'active_projection' AS scope,
          SUM(CASE WHEN m.importance_tier = 'deprecated' THEN 1 ELSE 0 END) AS deprecated_count,
          SUM(CASE WHEN m.importance_tier = 'normal' THEN 1 ELSE 0 END) AS normal_count,
          COUNT(*) AS total
   FROM active_memory_projection p
   JOIN memory_index m ON m.id = p.active_memory_id
   UNION ALL
   SELECT 'projection_plus_embedding_success',
          SUM(CASE WHEN m.importance_tier = 'deprecated' THEN 1 ELSE 0 END),
          SUM(CASE WHEN m.importance_tier = 'normal' THEN 1 ELSE 0 END),
          COUNT(*)
   FROM memory_index m
   JOIN active_memory_projection p ON p.active_memory_id = m.id
   WHERE m.embedding_status = 'success'
     AND (m.expires_at IS NULL OR m.expires_at > datetime('now'))
     AND (m.is_archived IS NULL OR m.is_archived = 0)
   UNION ALL
   SELECT 'fts_joinable_not_archived',
          SUM(CASE WHEN m.importance_tier = 'deprecated' THEN 1 ELSE 0 END),
          SUM(CASE WHEN m.importance_tier = 'normal' THEN 1 ELSE 0 END),
          COUNT(*)
   FROM memory_fts f
   JOIN memory_index m ON m.id = f.rowid
   WHERE (m.is_archived IS NULL OR m.is_archived = 0);
   ```

   Result:

   ```text
   active_projection                  | 530 deprecated | 374 normal | 994 total
   projection_plus_embedding_success  | 530 deprecated | 371 normal | 991 total
   fts_joinable_not_archived          | 538 deprecated | 374 normal | 1002 total
   ```

   In other words: lexical search can see all `538` deprecated rows, while the vector path is coded to reject them by default even though `530` deprecated rows are active, non-archived, and embedding-success candidates before the tier predicate is applied.

2. The repo's tier policy says deprecated memories should be hidden from search, so the lexical behavior is inconsistent with the stated contract. `getSearchableTiersFilter()` returns `importance_tier != 'deprecated'`, and the scoring README explicitly documents deprecated as `Hidden from search` with `Search Boost 0.0x`. That makes the current FTS5/BM25 behavior a policy gap, not just a design choice the codebase has consistently embraced. [`.opencode/skill/system-spec-kit/mcp_server/lib/scoring/importance-tiers.ts:147-150`](.opencode/skill/system-spec-kit/mcp_server/lib/scoring/importance-tiers.ts#L147) [`.opencode/skill/system-spec-kit/mcp_server/dist/lib/scoring/importance-tiers.js:113-116`](.opencode/skill/system-spec-kit/mcp_server/dist/lib/scoring/importance-tiers.js#L113) [`.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:91-99`](.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md#L91)

3. Deprecated tier coverage is not marginal anymore; it is the majority of the live corpus. The checked-in DB has `1002` non-archived memories, of which `538` are deprecated (`53.7%`). All `538` deprecated rows have `embedding_status='success'`, so the vector channel is not excluding them because they are unembedded or low-readiness; it is excluding them because of the explicit tier predicate. There are also `8` deprecated parent rows missing from `active_memory_projection`, but no non-deprecated rows are missing from that projection, so deprecated memories are the only tier currently paying both the projection gap and the vector tier filter. [`.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:221-240`](.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts#L221) [`.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/vector-index-queries.js:143-163`](.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/vector-index-queries.js#L143)

   SQL evidence:

   ```sql
   WITH totals AS (
     SELECT COUNT(*) AS total FROM memory_index
   )
   SELECT COALESCE(importance_tier, 'normal') AS tier,
          COUNT(*) AS count,
          ROUND(COUNT(*) * 100.0 / (SELECT total FROM totals), 1) AS pct_total,
          SUM(CASE WHEN embedding_status = 'success' THEN 1 ELSE 0 END) AS embedding_success,
          SUM(CASE WHEN COALESCE(is_archived, 0) = 0 THEN 1 ELSE 0 END) AS not_archived
   FROM memory_index
   GROUP BY COALESCE(importance_tier, 'normal')
   ORDER BY count DESC;
   ```

   ```text
   deprecated      | 538 | 53.7% | 538 success | 538 not_archived
   normal          | 374 | 37.3% | 371 success | 374 not_archived
   important       |  71 |  7.1% |  71 success |  71 not_archived
   critical        |  18 |  1.8% |  18 success |  18 not_archived
   constitutional  |   1 |  0.1% |   1 success |   1 not_archived
   ```

   ```sql
   SELECT COALESCE(m.importance_tier, 'normal') AS tier,
          SUM(CASE WHEN p.active_memory_id IS NULL THEN 1 ELSE 0 END) AS not_in_projection,
          SUM(CASE WHEN p.active_memory_id IS NULL AND m.parent_id IS NULL THEN 1 ELSE 0 END) AS not_in_projection_parent,
          SUM(CASE WHEN p.active_memory_id IS NULL AND m.parent_id IS NOT NULL THEN 1 ELSE 0 END) AS not_in_projection_chunk,
          COUNT(*) AS total
   FROM memory_index m
   LEFT JOIN active_memory_projection p ON p.active_memory_id = m.id
   WHERE COALESCE(m.is_archived, 0) = 0
   GROUP BY COALESCE(m.importance_tier, 'normal')
   ORDER BY total DESC;
   ```

   ```text
   deprecated      | 8 missing from projection | 8 parent | 0 chunk | 538 total
   all other tiers | 0 missing from projection
   ```

4. Deprecated memories are not lower-quality than normal memories in this DB; they are substantially higher-quality by `quality_score`. Deprecated rows have `avg_q = 0.5089`, `median_q = 0.817`, and `55.0%` of rows at `quality_score >= 0.7`. Normal rows have `avg_q = 0.2120`, `median_q = 0.0`, and only `19.5%` at `quality_score >= 0.7`. The higher-quality pattern still holds after restricting to `active_memory_projection`: deprecated `avg_q = 0.5035`, `median_q = 0.811`, `54.0% >= 0.75`; non-deprecated `avg_q = 0.2485`, `median_q = 0.0`, `24.1% >= 0.75`. That means deprecated currently behaves more like "superseded but well-formed historical knowledge" than "bad/noisy content." [`.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:91-99`](.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md#L91)

   SQL evidence:

   ```sql
   WITH ranked AS (
     SELECT COALESCE(importance_tier, 'normal') AS tier,
            quality_score,
            ROW_NUMBER() OVER (PARTITION BY COALESCE(importance_tier, 'normal') ORDER BY quality_score) AS rn,
            COUNT(*) OVER (PARTITION BY COALESCE(importance_tier, 'normal')) AS cnt
     FROM memory_index
     WHERE quality_score IS NOT NULL
   )
   SELECT tier,
          cnt AS count,
          ROUND(MIN(quality_score), 4) AS min_q,
          ROUND(AVG(quality_score), 4) AS avg_q,
          ROUND(AVG(CASE WHEN rn IN ((cnt + 1) / 2, (cnt + 2) / 2) THEN quality_score END), 4) AS median_q,
          ROUND(MAX(quality_score), 4) AS max_q,
          ROUND(AVG(CASE WHEN quality_score = 0 THEN 1.0 ELSE 0 END) * 100, 1) AS pct_zero,
          ROUND(AVG(CASE WHEN quality_score >= 0.7 THEN 1.0 ELSE 0 END) * 100, 1) AS pct_ge_07,
          ROUND(AVG(CASE WHEN quality_score >= 0.9 THEN 1.0 ELSE 0 END) * 100, 1) AS pct_ge_09
   FROM ranked
   GROUP BY tier, cnt
   ORDER BY count DESC;
   ```

   ```text
   deprecated      | count 538 | avg 0.5089 | median 0.817 | 39.6% zero | 55.0% >= 0.7 | 16.2% >= 0.9
   normal          | count 374 | avg 0.2120 | median 0.000 | 70.1% zero | 19.5% >= 0.7 |  9.1% >= 0.9
   important       | count  71 | avg 0.3783 | median 0.000 | 50.7% zero | 40.8% >= 0.7 | 12.7% >= 0.9
   critical        | count  18 | avg 0.4521 | median 0.417 | 50.0% zero | 50.0% >= 0.7 | 16.7% >= 0.9
   constitutional  | count   1 | avg 1.0000 | median 1.000 |  0.0% zero | 100% >= 0.7  | 100% >= 0.9
   ```

   ```sql
   SELECT COALESCE(importance_tier, 'normal') AS tier,
          SUM(CASE WHEN quality_score < 0.25 THEN 1 ELSE 0 END) AS lt_025,
          SUM(CASE WHEN quality_score >= 0.25 AND quality_score < 0.50 THEN 1 ELSE 0 END) AS q_025_050,
          SUM(CASE WHEN quality_score >= 0.50 AND quality_score < 0.75 THEN 1 ELSE 0 END) AS q_050_075,
          SUM(CASE WHEN quality_score >= 0.75 THEN 1 ELSE 0 END) AS ge_075
   FROM memory_index
   GROUP BY COALESCE(importance_tier, 'normal')
   ORDER BY COUNT(*) DESC;
   ```

   ```text
   deprecated      | 214 <0.25 | 24 in 0.25-0.50 | 7 in 0.50-0.75 | 293 >=0.75
   normal          | 276 <0.25 | 22 in 0.25-0.50 | 3 in 0.50-0.75 |  73 >=0.75
   ```

5. Should deprecated memories be searchable? Not in the default retrieval path if `deprecated` still means "superseded and hidden," but the current asymmetry is the worst possible middle state. The code and docs say hidden; the lexical channels still retrieve them; and the live DB shows deprecated now contains a large amount of high-quality information. That means the real product decision is not "searchable or not" in the abstract. It is whether deprecated is still the right tier for these `538` rows. If the semantics stay the same, all channels should exclude deprecated by default and only expose them through an explicit opt-in historical/debug mode. If the team wants this historical knowledge to remain discoverable for SEO/search coverage, then these rows should not stay in a tier whose documented meaning is "hidden from search."

## Concrete Recommendations

1. Make the default contract symmetric across channels. The fastest, least ambiguous fix is to add the same default deprecated-tier filter to `sqlite-fts.ts` and the BM25 warmup/query path that `vector_search()` already applies. Expected impact: hybrid retrieval stops mixing "hidden" content back in through lexical channels, and search results become easier to reason about and debug.

2. Add an explicit opt-in path for historical retrieval instead of relying on accidental lexical exposure. Examples: `tier: 'deprecated'`, a `includeDeprecated` flag, or a last-resort fallback mode when primary retrieval under-recovers. Expected impact: preserves access to superseded history without silently contaminating default ranking.

3. Audit why `538/1002` rows are deprecated and why their quality is higher than normal. The data suggests deprecated is being used as a lineage/supersession marker rather than a low-value/noisy-content marker. Expected impact: either reclaim a large amount of search coverage by re-tiering high-quality rows, or confirm that the system intentionally prioritizes recency/canonicality over raw lexical recall.

4. If search coverage is the priority, do not simply re-enable deprecated everywhere without a weighting strategy. A safer alternative is a separate low-priority historical lane with explicit labeling or a strict post-filter that only surfaces deprecated when non-deprecated recall is weak. Expected impact: better recall without letting superseded content outrank current canonical memories.

## New Information Ratio

0.84
