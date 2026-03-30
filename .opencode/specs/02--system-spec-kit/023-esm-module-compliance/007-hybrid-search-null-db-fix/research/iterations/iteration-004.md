# Iteration 4: Embedding Expansion (R12) Effectiveness

## Focus

This iteration examined whether R12 embedding expansion materially helps retrieval in the current `context-index.sqlite` snapshot, how much latency it adds, what terms it actually generates, and whether the `isExpansionActive()` suppression gate is too aggressive. The analysis covered both source and built runtime paths in `lib/` and `dist/`, plus SQL and offline runtime experiments against the live SQLite database.

## Findings

1. R12 is wired correctly, but it is a narrow, second-channel fanout rather than a proven recall improvement.

   In source and dist, R12 only runs in the non-deep hybrid branch, only when `SPECKIT_EMBEDDING_EXPANSION` is enabled and `isExpansionActive(query)` returns `true`. When it fires, Stage 1 first mines terms from the top-5 vector neighbors, then launches a second hybrid search on `expanded.combinedQuery`, and finally merges baseline-first so duplicate IDs keep the baseline score/order. This behavior is consistent between source and built output. Source: `lib/search/embedding-expansion.ts:181-304`, `lib/search/pipeline/stage1-candidate-gen.ts:717-791`. Runtime build: `dist/lib/search/embedding-expansion.js:127-231`, `dist/lib/search/pipeline/stage1-candidate-gen.js:530-586`.

   The term miner is frequency-based over raw `content_text`, `title`, and `trigger_phrases`, with a hard cap of 8 terms and only a small generic stop-word set. There is no weighting against anchors, checklist boilerplate, phase labels, or structural metadata. Source: `lib/search/embedding-expansion.ts:124-149`, `lib/search/embedding-expansion.ts:225-268`. Runtime build: `dist/lib/search/embedding-expansion.js:76-97`, `dist/lib/search/embedding-expansion.js:161-197`.

2. The active database does not contain recall ground truth, so R12 recall improvement is not demonstrably proven in this snapshot.

   The requested database contains no `eval_%` tables at all, which means there is no stored `eval_queries`, `eval_ground_truth`, or prior ablation output to compute Recall@K directly from this file.

   SQL evidence:

   ```sql
   SELECT name
   FROM sqlite_master
   WHERE type = 'table' AND name LIKE 'eval_%'
   ORDER BY name;
   ```

   Result:

   ```text
   -- no rows
   ```

   So the strict answer to "does R12 actually improve recall?" is: not provably from this DB snapshot. What I could measure is candidate-pool broadening. In an offline 20-query sweep over real 022/023 trigger phrases (4-8 terms only, using live stored document embeddings as topical stand-ins), the second channel raised the unique candidate pool from `20.0` baseline candidates to `26.2` merged unique candidates on average, a `+6.2` delta. That suggests R12 can broaden Stage 1 coverage, but it is not the same as measured Recall@K because the true expanded-query embedding could not be regenerated in this sandboxed environment.

   Offline sweep evidence:

   ```text
   sampleSize=20
   avgBaselineCount=20.0
   avgExpandedChannelCount_sameEmbedding=20.0
   avgMergedUnique_sameEmbedding=26.2
   avgDelta_sameEmbedding=+6.2
   ```

   Example query-level deltas from the same sweep:

   ```text
   "hybrid search fix plan" -> 20 baseline, 27 merged unique, +7
   "db dimension integrity tests" -> 20 baseline, 29 merged unique, +9
   "manual testing retrieval enhancements checks" -> 20 baseline, 20 merged unique, +0
   ```

3. R12 adds modest local search cost, but the real latency risk is the extra provider embedding call.

   Local-only overhead is not large. Across the same 20-query offline sweep, the first R12 step (`expandQueryWithEmbeddings`) averaged `10.62 ms`, the baseline hybrid candidate collection averaged `13.35 ms`, and the second expanded-query hybrid collection averaged `16.43 ms` when reusing the same stored embedding to isolate local search cost.

   Local timing evidence:

   ```text
   sampleSize=20
   avgExpansionMs=10.62
   avgBaselineMs=13.35
   avgExpandedSearchMs_sameEmbedding=16.43
   ```

   The real end-to-end path is more expensive than those local numbers because Stage 1 also does a fresh `generateQueryEmbedding(expanded.combinedQuery)` before running the second hybrid channel. That extra provider call is on the hot path at `lib/search/pipeline/stage1-candidate-gen.ts:746-761` and `dist/lib/search/pipeline/stage1-candidate-gen.js:553-560`. In this sandbox, a controlled runtime call to `generateQueryEmbedding()` failed after `7058 ms` because the Voyage provider retried four times and exhausted retries. So healthy-provider overhead is at least "local R12 work + one extra query embedding request", while degraded-provider overhead can balloon into multi-second stalls.

   Runtime failure evidence:

   ```text
   [retry] voyage-embedding exhausted retries (4 attempts)
   {"ok":false,"elapsedMs":7058,"error":"voyage-embedding failed after 4 attempts: fetch failed"}
   ```

4. The expansion terms currently generated are mostly structural/boilerplate tokens, not strong intent-preserving synonyms.

   The 20-query offline sweep produced the following most-common expansion terms:

   ```text
   anchor(20), all(11), test(7), code(6), feature(6),
   opencode(6), pass(6), pipeline(6), research(6), stage(6),
   fix(5), error(4), evidence(4), memory(4), packet(4)
   ```

   That term profile is a direct consequence of the current extractor design: it mines frequent tokens from raw similar-memory contents, titles, and trigger phrases, but does not down-rank structural vocabulary. Source: `lib/search/embedding-expansion.ts:124-149`, `lib/search/embedding-expansion.ts:225-243`. Runtime build: `dist/lib/search/embedding-expansion.js:76-97`, `dist/lib/search/embedding-expansion.js:161-180`.

   Concrete examples:

   ```text
   "hybrid search fix plan"
   -> pipeline, anchor, all, research, stage, code, feature, error

   "db dimension integrity tests"
   -> anchor, modify, fix, test, packet, mcp_server, pass, benchmark

   "manual testing retrieval enhancements checks"
   -> evidence, anchor, tasks, pass, scenario, all, checklist, implementation-summary
   ```

   These are not useless, but they skew toward repository boilerplate and packet mechanics. That increases the chance that the second channel broadens candidate count without improving actual relevance quality.

5. `isExpansionActive()` suppression looks too aggressive for this corpus.

   `isExpansionActive()` suppresses R12 whenever the query classifier returns `simple`, and the classifier marks any query with `<= 3` terms as simple unless the complexity router is disabled. Source: `lib/search/embedding-expansion.ts:300-304`, `lib/search/query-classifier.ts:172-181`. Runtime build: `dist/lib/search/embedding-expansion.js:226-230`, `dist/lib/search/query-classifier.js` equivalent behavior.

   On real trigger phrases stored in the requested DB, that gate suppresses a large majority of likely search inputs:

   SQL evidence across all trigger phrases:

   ```sql
   WITH triggers AS (
     SELECT trim(j.value) AS phrase
     FROM memory_index m, json_each(m.trigger_phrases) j
     WHERE json_valid(m.trigger_phrases) AND trim(j.value) <> ''
   ),
   counts AS (
     SELECT phrase,
       CASE
         WHEN instr(phrase, ' ') = 0 THEN 1
         ELSE length(phrase) - length(replace(phrase, ' ', '')) + 1
       END AS term_count
     FROM triggers
   )
   SELECT
     COUNT(*) AS total_phrases,
     SUM(term_count <= 3) AS suppressed_simple,
     ROUND(100.0 * SUM(term_count <= 3) / COUNT(*), 1) AS suppressed_pct,
     SUM(term_count BETWEEN 4 AND 8) AS moderate_active,
     ROUND(100.0 * SUM(term_count BETWEEN 4 AND 8) / COUNT(*), 1) AS moderate_pct,
     SUM(term_count > 8) AS complex_active,
     ROUND(100.0 * SUM(term_count > 8) / COUNT(*), 1) AS complex_pct
   FROM counts;
   ```

   Result:

   ```text
   total_phrases=3491
   suppressed_simple=2833 (81.2%)
   moderate_active=645 (18.5%)
   complex_active=13 (0.4%)
   ```

   In the directly relevant 022/023 packet neighborhood, suppression is still `76.2%` (`1790 / 2348`) of trigger phrases.

   More importantly, a one-token difference flips R12 entirely even for the same underlying topic:

   ```text
   "mcp runtime hardening" -> simple, active=false, expandedTerms=[]
   "db dimension integrity tests" -> moderate, active=true,
   expandedTerms=[anchor, modify, fix, test, packet, mcp_server, pass, benchmark]
   ```

   That makes the gate feel too coarse for technical retrieval, where short noun-phrase queries are common but can still benefit from semantic broadening.

## Concrete Recommendations

1. Add a true Recall@K experiment for R12 before treating it as successful. The active DB has no `eval_%` tables, so the next step should be to populate `eval_queries` and `eval_ground_truth` for this database or run against an evaluation DB that already has them. Expected impact: converts R12 from "candidate broadening hypothesis" into a measurable retrieval feature.

2. Relax `isExpansionActive()` for technical noun-phrase queries. A practical first change is to stop using raw `<= 3 terms` as an absolute suppression rule and instead allow 3-term queries when they have high information density, code-ish tokens, acronyms, underscores, digits, or low stop-word ratio. Expected impact: reduces over-suppression on queries like `mcp runtime hardening` without fully enabling R12 for trivial one-word lookups.

3. Filter structural boilerplate out of expansion terms before frequency ranking. Add a denylist or heuristic penalty for tokens like `anchor`, `all`, `pass`, `stage`, `feature`, `implementation-summary`, `packet`, and path-like identifiers. Expected impact: fewer noisy expansion terms and a better chance that the second channel improves relevance rather than just fanout.

4. Keep the top-5 neighbor mining, but score mined terms by source field and distinct-memory coverage instead of raw frequency alone. For example: prefer trigger/title hits over generic body-content hits, and prefer terms seen across multiple similar memories. Expected impact: more intent-preserving terms and less contamination from checklist/template boilerplate.

5. Protect the extra embedding call with a tighter timeout or degraded fallback path. Right now the second-channel embedding request inherits provider retry behavior and can add multi-second tail latency under network/provider failure. Expected impact: preserves R12 upside in healthy conditions while preventing search stalls when embeddings are unavailable.

## New Information Ratio

0.84
