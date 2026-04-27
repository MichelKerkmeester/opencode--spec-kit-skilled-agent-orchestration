# Iteration 004 - Q3 CocoIndex source-vs-markdown ranking imbalance

## Focus

Q3: explain why CocoIndex ranks research markdown above implementation source on technical implementation queries, then recommend a ranking and verification protocol. Q1 was not reopened. Q5 was already answered in Iteration 002, and Q2 was answered in Iteration 003.

## Actions Taken

1. Read the current strategy, state log, Iteration 002, and Iteration 003 to avoid duplicating answered Q1/Q5/Q2 work.
2. Re-read 005/006 reproduction notes for REQ-019, especially the queries where markdown research outranked source.
3. Inspected the installed `cocoindex_code` query, indexer, schema, project, server, and settings code.
4. Checked project `.cocoindex_code/settings.yml` to confirm markdown/spec-like files are eligible for indexing.
5. Attempted a direct SQLite count probe against `.cocoindex_code/target_sqlite.db`; plain `sqlite3` cannot load the `vec0` virtual table, so this iteration does not claim fresh corpus-count telemetry.

## Findings

### 1. REQ-019 is not just duplicate collapse; it is a source-class ranking gap

The 005 catalog records the failure directly: for `"code graph traversal callers query"`, the top 9 results were research markdown duplicates, while the actual implementation `mcp_server/handlers/code-graph/query.ts` appeared only at result 10 with score `0.6648` (`005-memory-search-runtime-bugs/spec.md:222`). The 006 live-probe note adds that `"semantic search vector embedding implementation"` returned only `research-06.md` chunks and did not surface the implementation source at all (`001-search-intelligence-stress-test/scratch/live-probes-2026-04-26.md:40-52`).

Iteration 003 explains why duplicates can fill the whole top-k. Q3 adds the next layer: after duplicate handling, a markdown chunk can still beat source because the query path has no source-vs-document scoring signal.

### 2. Project settings index markdown and text files alongside source code

The project settings include source extensions and documentation extensions in the same `include_patterns` list. Markdown and prose-like files are eligible through `**/*.md`, `**/*.mdx`, `**/*.txt`, and `**/*.rst` (`.cocoindex_code/settings.yml:16-44`).

The same settings exclude the canonical `.opencode/specs/**` path but not the symlink mirrors (`.cocoindex_code/settings.yml:14-15`). Iteration 003 covered that as Q2. For Q3, the important part is that documentation/research chunks are part of the vector corpus and are ranked in the same score space as implementation files.

### 3. The index schema has no path class, source type, or canonical role field

The stored chunk model contains only `id`, `file_path`, `language`, `content`, `start_line`, `end_line`, and `embedding` (`cocoindex_code/schema.py:7-17`). The indexer fills those fields from the alias path and chunk text (`cocoindex_code/indexer.py:179-189`), and the vector table exposes only `file_path`, `content`, `start_line`, and `end_line` as auxiliary columns (`cocoindex_code/indexer.py:202-212`).

That means the query layer cannot distinguish "implementation source under `mcp_server/`" from "research note under `research/iterations/`" except by path-string heuristics after retrieval. No durable `path_class`, `source_role`, `is_documentation`, `canonical_file_path`, or `content_hash` exists today.

### 4. Query ranking is pure vector distance plus optional language/path filtering

`query.py` converts L2 distance to score with `1.0 - distance * distance / 2.0` (`cocoindex_code/query.py:14-16`). The KNN query orders only by vector distance (`query.py:27-44`). The path-filter fallback also orders only by computed distance (`query.py:72-80`). `query_codebase()` then maps rows directly to `QueryResult` with that score (`query.py:115-145`).

There is no second-stage reranker, no path-class boost, no source-code preference for implementation-intent queries, and no markdown penalty. `project.py` and `server.py` pass those rows through without changing order or score (`cocoindex_code/project.py:174-203`, `cocoindex_code/server.py:139-155`).

### 5. Documentation can legitimately embed closer natural-language query text than sparse source symbols

The suspected mechanism in 005 is consistent with the implementation: markdown research often contains explicit prose such as "semantic search vector embedding implementation" or SQL/caller examples, while source may express the same concept through identifiers, imports, and smaller code chunks. A pure semantic vector scorer can therefore prefer the research explanation over the implementation, especially when duplicates amplify the effect.

This is not a model hallucination by itself. It is a ranking-policy mismatch: CocoIndex is documented as semantic code search, but the current project corpus and scoring policy treat narrative research as equal or better evidence for implementation questions.

## Questions Answered

### Q3 root cause

CocoIndex ranks research markdown above source because this repo indexes markdown/text documents together with code, stores no source-role metadata, and returns nearest vector neighbors ordered only by distance. Markdown research notes are often semantically closer to natural-language implementation queries than sparse implementation chunks, and the current query path has no reranking rule to prefer implementation paths for implementation-intent queries.

### Q3 recommended fix

Use a two-tier policy:

1. Corpus policy:
   - Default CocoIndex should be code-first. Exclude spec/research docs by default: `.opencode/specs/**`, `.claude/specs/**`, `.codex/specs/**`, `.gemini/specs/**`, `.agents/specs/**`, top-level `specs/**`, and `**/research/**`.
   - If mixed code plus docs remains required, tag indexed rows with `path_class` or `source_role`: `implementation`, `tests`, `docs`, `spec_research`, `generated`, `vendor`.

2. Query-time reranking:
   - Detect implementation-intent queries using terms such as `implementation`, `function`, `caller`, `handler`, `class`, `module`, `where is implemented`, and explicit source path hints.
   - Over-fetch before reranking, for example `limit * 4`.
   - Apply a bounded path-class adjustment after vector score:
     - `implementation`: +0.06 to +0.10
     - `tests`: +0.02 to +0.04 when query mentions tests
     - `docs/spec_research`: -0.04 to -0.08 for implementation-intent queries
     - mirror aliases: always lower than canonical paths
   - Keep the raw vector score and expose `rankingSignals` so the boost is inspectable.

The conservative first implementation is settings-only: make CocoIndex code-first and route spec/research retrieval to Spec Kit Memory. The more flexible implementation is schema plus rerank, but it needs migration and regression tests.

### Verification protocol

Add fixed probes that compare ordering before and after the change:

- `"code graph traversal callers query"` should return `mcp_server/handlers/code-graph/query.ts` in the top 3 after dedup.
- `"semantic search vector embedding implementation"` should return CocoIndex implementation files (`cocoindex_code/indexer.py`, `query.py`, or relevant source) before research markdown.
- A documentation-intent query such as `"research notes for vector probe"` may still return markdown first, proving the markdown penalty is conditional rather than global.

Each probe should assert `uniqueResultCount`, top-k path classes, raw score, adjusted score, and applied ranking signals.

## Questions Remaining

- Q4: weak retrieval hallucination guardrails remain open.
- Q6: empty/stale structural code graph recovery remains open.
- Q7: supersedes-heavy causal edge growth remains open.
- Q8: broader intent classifier consistency remains open.

## Next Focus

Q4: investigate weak retrieval guardrails. When `requestQuality:"weak"` and `recovery.suggestedQueries:[]`, model-side callers should refuse or ask for disambiguation instead of fabricating spec packet paths.
