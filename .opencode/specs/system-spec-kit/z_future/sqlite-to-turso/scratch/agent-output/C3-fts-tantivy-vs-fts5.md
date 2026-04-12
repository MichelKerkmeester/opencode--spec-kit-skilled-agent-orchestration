# C3: FTS — Tantivy vs FTS5

**Agent:** general-purpose | **Duration:** ~159s | **Tokens:** 54,044

## Key Findings

- **Column weights supported but INDEX-TIME only**, not query-time:
  ```sql
  CREATE INDEX idx USING fts (title, trigger_phrases, file_path, content_text)
  WITH (weights = 'title=10.0,trigger_phrases=5.0,file_path=2.0,content_text=1.0');
  ```
- Query syntax: `fts_match(col1, col2, ..., query)` and `fts_score(col1, col2, ..., query)`
- **Default combiner is OR** (vs FTS5's AND) — significant behavioral change
- Transactional FTS sync is a **major advantage** — eliminates trigger-based sync bugs
- No `snippet()` function (only `fts_highlight()`)
- Tantivy adds: boost syntax (`term^2.0`), range queries, set matching, slop operator
- Manual `OPTIMIZE INDEX` required (Tantivy uses NoMergePolicy)
- Status: experimental, behind `--experimental-index-method` flag
