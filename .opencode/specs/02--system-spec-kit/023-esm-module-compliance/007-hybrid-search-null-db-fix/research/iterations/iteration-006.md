# Iteration 6: FTS5 BM25 Tokenization and Query Processing

## Focus

This iteration audited the live lexical-search pipeline for compound-term recall and tokenizer behavior. I read the source and built artifacts for BM25/FTS query normalization, then ran SQL against `.opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite` to verify how the live FTS index behaves for `cocoindex`, `speckit`, `memorystate`, and nearby variants.

## Findings

1. The source and built artifacts are in sync, and the in-memory BM25 stemmer is intentionally minimal. `STOP_WORDS` is a fixed English stop-list; `simpleStem()` only strips `ing`, `tion`, `ed`, `ly`, `es`, and `s`, with a small doubled-consonant cleanup after suffix removal. `splitLexicalFragments()` lowercases text but preserves hyphens and underscores, so the in-memory BM25 path keeps `memory-state`, `spec-kit`, and `coco-index` as single tokens instead of splitting them. `normalizeContentForBM25()` does not add any BM25-specific compound handling; it delegates to the generic content normalizer. Code: `.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:87-156`, `:562-590`, `.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/bm25-index.js:48-130`, `:471-497`, `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts:234-263`.

   Runtime probe against the built JS:

   ```text
   normalizeLexicalQueryTokens('cocoindex')     => fts=['cocoindex'], bm25=['cocoindex']
   normalizeLexicalQueryTokens('coco-index')    => fts=['coco-index'], bm25=['coco-index']
   normalizeLexicalQueryTokens('speckit')       => fts=['speckit'], bm25=['speckit']
   normalizeLexicalQueryTokens('spec-kit')      => fts=['spec-kit'], bm25=['spec-kit']
   normalizeLexicalQueryTokens('memorystate')   => fts=['memorystate'], bm25=['memorystate']
   normalizeLexicalQueryTokens('memory-state')  => fts=['memory-state'], bm25=['memory-state']
   simpleStem('states')       => 'stat'
   simpleStem('indexed')      => 'index'
   simpleStem('indexing')     => 'index'
   simpleStem('connections')  => 'connection'
   simpleStem('notification') => 'notifica'
   ```

   Conclusion: the current stemmer does not split or normalize concatenated compounds like `cocoindex`, `speckit`, or `memorystate`; it only handles a small set of suffix cases.

2. The live `memory_fts` table is using default FTS5 tokenization, not `porter`, and the live index already contains exact compound tokens for the terms in scope. Both the main schema migration and the downgrade-path schema builder create `memory_fts` without a `tokenize=` clause, and the compiled JS mirrors the same SQL. Code: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:751-757`, `.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:203-209`, `.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/vector-index-schema.js:639-648`.

   SQL evidence:

   ```sql
   .schema memory_fts

   CREATE VIRTUAL TABLE memory_fts USING fts5(
               title, trigger_phrases, file_path, content_text,
               content='memory_index', content_rowid='id'
             )
   ```

   ```sql
   CREATE VIRTUAL TABLE vocab USING fts5vocab('memory_fts', 'row');
   SELECT term, doc
   FROM vocab
   WHERE term IN ('cocoindex','coco','index','speckit','spec','kit','memorystate','memory','state')
   ORDER BY term;
   ```

   Observed:

   - `cocoindex = 16 docs`
   - `speckit = 718 docs`
   - `memorystate = 4 docs`
   - `coco = 13 docs`
   - `index = 305 docs`
   - `spec = 985 docs`
   - `kit = 853 docs`
   - `memory = 617 docs`
   - `state = 444 docs`

   Conclusion: the exact compounds are not being lost during indexing. The live FTS corpus already contains searchable `cocoindex`, `speckit`, and `memorystate` terms.

3. Compound recall is mostly fine for exact concatenated terms, but the current system is inconsistent across lexical channels for hyphenated and space-separated variants. The SQLite FTS path uses `normalizeLexicalQueryTokens(query).fts` and joins tokens with `OR`, while the in-memory BM25 path uses `normalizeLexicalQueryTokens(query).bm25`, which preserves hyphenated compounds and applies stemming. Code: `.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:55-60`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:153-156`, `:320`, `:562-570`, `.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/sqlite-fts.js:28-35`.

   In-memory BM25 probe against the built JS:

   ```text
   query 'memory-state' -> matches only doc tokenized as ['memory-state', ...]
   query 'memorystate'  -> matches only doc tokenized as ['memorystate', ...]
   query 'memory state' -> matches only doc tokenized as ['memory','state', ...]
   query 'spec-kit'     -> matches only ['spec-kit', ...]
   query 'speckit'      -> matches only ['speckit', ...]
   query 'spec kit'     -> matches only ['spec','kit', ...]
   ```

   SQL evidence from the live FTS table:

   ```sql
   SELECT 'cocoindex' AS query, count(*) AS hits FROM memory_fts WHERE memory_fts MATCH '"cocoindex"';
   SELECT 'coco-index' AS query, count(*) AS hits FROM memory_fts WHERE memory_fts MATCH '"coco-index"';
   SELECT 'speckit' AS query, count(*) AS hits FROM memory_fts WHERE memory_fts MATCH '"speckit"';
   SELECT 'spec-kit' AS query, count(*) AS hits FROM memory_fts WHERE memory_fts MATCH '"spec-kit"';
   SELECT 'memorystate' AS query, count(*) AS hits FROM memory_fts WHERE memory_fts MATCH '"memorystate"';
   SELECT 'memory-state' AS query, count(*) AS hits FROM memory_fts WHERE memory_fts MATCH '"memory-state"';
   ```

   Observed:

   - `cocoindex = 16 hits`
   - `coco-index = 13 hits`
   - `speckit = 718 hits`
   - `spec-kit = 853 hits`
   - `memorystate = 4 hits`
   - `memory-state = 22 hits`

   Example rows for the hyphenated queries show why this matters:

   - `"memory-state"` returns a mix of true hyphenated content and broader `memory`/`state` phrase matches, including `Decision Record: 002-versioned-memory-state`.
   - `"spec-kit"` returns very broad results because `unicode61` tokenization treats the hyphen as a separator and matches the phrase `spec kit`, not a literal preserved hyphen token.

   Conclusion: the current system does not have one stable notion of “same term” for `foo-bar`, `foobar`, and `foo bar`. In-memory BM25 treats them as different tokens; SQLite FTS with default tokenization partially collapses them.

4. Query sanitization is safe, but it strips user intent and broadens split queries aggressively. `sanitizeQueryTokens()` removes `AND`, `OR`, `NOT`, `NEAR`, `/N`, quotes, and `:`; then the SQLite FTS path wraps the resulting `fts` tokens in quotes and joins them with `OR`. That means `title:memory AND vector` becomes `title OR memory OR vector`, and `memory NEAR/5 state` becomes `memory OR state`. Code: `.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:534-571`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:55-60`, `.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/bm25-index.js:462-497`.

   Runtime probe:

   ```text
   normalizeLexicalQueryTokens('AND or not memory')
     => fts=['memory'], bm25=['memory']

   normalizeLexicalQueryTokens('title:memory AND vector')
     => fts=['title','memory','vector'], bm25=['title','memory','vector']

   normalizeLexicalQueryTokens('memory NEAR/5 state')
     => fts=['memory','state'], bm25=['memory','state']

   normalizeLexicalQueryTokens('spec-kit OR speckit')
     => fts=['spec-kit','speckit'], bm25=['spec-kit','speckit']
   ```

   SQL evidence:

   ```sql
   SELECT 'coco OR index' AS query, count(*) AS hits
   FROM memory_fts WHERE memory_fts MATCH '"coco" OR "index"';

   SELECT 'spec OR kit' AS query, count(*) AS hits
   FROM memory_fts WHERE memory_fts MATCH '"spec" OR "kit"';

   SELECT 'memory OR state' AS query, count(*) AS hits
   FROM memory_fts WHERE memory_fts MATCH '"memory" OR "state"';
   ```

   Observed:

   - `coco OR index = 305 hits`
   - `spec OR kit = 985 hits`
   - `memory OR state = 712 hits`

   Conclusion: the query builder currently favors recall over precision very aggressively. That helps recover split forms, but it also creates a lot of lexical noise for compound-like queries.

5. Switching the live FTS table to `porter` would improve inflectional recall, but it does not solve the compound-term problem the user asked about, and it noticeably widens the match surface. On the real corpus, a disposable `porter unicode61` mirror increased recall for morphology-sensitive terms, but compound terms were unchanged. Code context: `.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:106-128`, `:562-570`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:55-60`.

   Real-corpus SQL experiment using disposable in-memory FTS mirrors:

   ```sql
   ATTACH DATABASE '.opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite' AS src;
   CREATE VIRTUAL TABLE u USING fts5(title, trigger_phrases, file_path, content_text, tokenize='unicode61');
   CREATE VIRTUAL TABLE p USING fts5(title, trigger_phrases, file_path, content_text, tokenize='porter unicode61');
   INSERT INTO u(...) SELECT ... FROM src.memory_index WHERE COALESCE(is_archived,0)=0;
   INSERT INTO p(...) SELECT ... FROM src.memory_index WHERE COALESCE(is_archived,0)=0;
   ```

   Result snapshot:

   - `indexed: 100 -> 369`
   - `indexing: 197 -> 369`
   - `states: 47 -> 462`
   - `connection: 23 -> 45`
   - `connections: 7 -> 45`
   - `notification: 6 -> 7`
   - `cocoindex: 16 -> 16`
   - `coco-index: 13 -> 13`
   - `speckit: 718 -> 718`
   - `spec-kit: 853 -> 853`
   - `memorystate: 4 -> 4`
   - `memory-state: 22 -> 22`

   Synthetic control-table evidence also showed over-broad matches:

   - With `unicode61`, query `"indexed"` matched only the doc containing `indexed`.
   - With `porter unicode61`, query `"indexed"` matched docs containing `indexed`, `indexing`, and `coco-index` because they all reduce to `index`.

   Conclusion: `porter` is useful for inflectional variants, but it does not improve `cocoindex`/`speckit`/`memorystate` recall. A global tokenizer switch would likely trade better morphology recall for broader, noisier lexical matches.

## Concrete Recommendations

1. Do not switch the live `memory_fts` table to `porter` solely to fix compound-term recall. Based on the real-corpus experiment above, it will not improve `cocoindex`, `speckit`, or `memorystate`, because those compounds already index and match correctly. Expected impact: avoids a schema rebuild that does not address the actual compound-term problem.

2. Align compound handling across lexical channels instead. Add a shared expansion step for both indexing and query normalization that emits the original token plus controlled variants for hyphen/space forms, for example `memory-state` -> `memory-state`, `memory state`; `coco-index` -> `coco-index`, `coco index`; optionally add a gated alias list for known concatenations like `speckit` <-> `spec kit`. Expected impact: better recall for compound variants without the global noise increase that comes with `porter`.

3. Keep `unicode61` as the base tokenizer unless there is a separate morphology-focused ablation. If morphology recall becomes a priority, test `porter` as a secondary or fallback lexical channel rather than replacing the only FTS index. Expected impact: preserves current exact-compound behavior while allowing measured experiments on inflectional recall.

4. Tighten query sanitization before any tokenizer swap. Dropping field labels like `title:` instead of turning them into searchable `title` tokens, and replacing unconditional `OR` expansion with a more selective strategy for split compounds, should improve precision immediately. Expected impact: fewer `spec OR kit` / `memory OR state` style explosions and more stable BM25 ranking.

## New Information Ratio

0.84
