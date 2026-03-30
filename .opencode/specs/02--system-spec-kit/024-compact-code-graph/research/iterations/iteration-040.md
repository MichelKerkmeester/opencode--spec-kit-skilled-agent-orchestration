# Iteration 040: Code Graph Storage — SQLite vs Graph Databases

## Focus

Evaluate practical storage and query strategies for a compact code graph, with emphasis on whether we should use:

- SQLite tables plus recursive CTEs and targeted indexes,
- a dedicated graph database such as Neo4j or Dgraph,
- or lighter-weight options such as in-memory objects or JSON exports.

This iteration also answers how existing code-analysis systems persist graph-like program structure, what schema/index designs fit a compact TS/JS code graph, and whether our graph should share a database with the current Spec Kit Memory system.

## Findings

1. Storage options for code graphs fall into five practical buckets:
   - `SQLite / relational tables`: best fit for compact, embedded, single-project graphs where we control schema and want zero extra service dependency.
   - `Dedicated graph DB`: Neo4j and Dgraph are optimized for repeated traversal-centric workloads, built-in reverse traversals, and richer graph query languages.
   - `In-memory graph`: fast for build-time extraction or ephemeral analysis, but poor for persistence, diffing, and incremental query reuse.
   - `JSON / JSONL adjacency data`: good as an interchange or debug/export format, weak as the primary query substrate because reverse lookups, filtering, and multi-hop traversals become expensive or custom-coded.
   - `Hybrid`: persistent SQLite for the authoritative graph plus optional in-memory caches and JSON export/import for tooling.

2. SQLite is genuinely capable of graph-like queries when the graph is modeled as adjacency tables. SQLite's recursive CTE support explicitly covers "trees and graphs," and its docs include a graph example using `checkin` and `derivedfrom` tables plus an index on the reverse direction. Recursive `ORDER BY` can also steer traversal order, including breadth-first vs depth-first, and `LIMIT` can cap recursion safely. In short: SQLite is fine for direct-edge and bounded multi-hop traversals, especially when we know the hot edge kinds ahead of time.

3. SQLite performance is strongest when queries are adjacency-style rather than arbitrary graph-pattern search. Direct neighbor queries such as "what does this function call?" and "who calls this function?" are simple indexed joins. Multi-column indexes and covering indexes matter a lot here: SQLite's planner documentation recommends multi-column indexes for AND-connected predicates, and covering indexes can avoid table lookups entirely. Partial indexes are also attractive for code graphs because hot edge kinds such as `CALL`, `IMPORT`, and `CONTAINS` are usually a small subset of all rows.

4. The main trade-off is not "can SQLite do graph queries?" but "how much graph-database behavior do we need?" Dedicated graph databases win when the workload is dominated by repeated, exploratory, variable-length path traversals, rich path pattern matching, or multi-user graph analytics. Neo4j and Dgraph both expose traversal as a first-class concept; Dgraph also has built-in reverse edges, and Neo4j has node/relationship-aware planners and indexes. SQLite wins on operational simplicity, embeddability, local-file portability, and tight integration with existing app code.

5. Existing code-analysis tools do not converge on graph databases. CodeQL stores a relational representation per language, including AST, data flow, and control flow, inside a CodeQL database; that is a strong precedent for "graph over relational storage" rather than "must use a graph DB." Sourcetrail similarly uses a persistent per-project database file and an API that records symbols, references, locations, and typed edges like `CALL`, with transaction support for speed. Semgrep's public docs point in a different direction: cross-file analysis is delivered as a separate analysis binary with substantial memory requirements and fallback behavior when scans grow too large. That suggests scan-time analysis and in-memory or engine-internal state, not a user-visible persistent graph database.

6. The best SQLite schema for our compact graph is a typed `nodes + edges` design with a few supporting tables, not a JSON blob per file and not a full CodeQL-style per-expression schema. Recommended core shape:
   - `code_files(id, path, language, content_hash, mtime)`
   - `code_nodes(id, file_id, kind, stable_key, display_name, fq_name, start_line, start_col, end_line, end_col, exported, external_ref)`
   - `code_edges(src_id, dst_id, kind, ord, file_id, line, col, metadata_json)`
   - optional `node_aliases(node_id, alias)` or `symbol_names(name, normalized_name, node_id)` for lookup
   - optional `graph_stats` or `graph_versions` for incremental rebuild bookkeeping

   For a compact v1, nodes should represent only durable semantic units: file, module, class, interface, function, method, variable/export symbol, and maybe import symbol. Edges should be limited to a small controlled vocabulary such as `CONTAINS`, `CALLS`, `IMPORTS`, `EXPORTS`, `EXTENDS`, `IMPLEMENTS`, `REFERENCES`.

7. The two most important code-graph queries do not need recursion at all:

   ```sql
   -- What does this function call?
   SELECT callee.*
   FROM code_edges e
   JOIN code_nodes callee ON callee.id = e.dst_id
   WHERE e.src_id = ?1
     AND e.kind = 'CALLS'
   ORDER BY e.ord, callee.id;
   ```

   ```sql
   -- What calls this function?
   SELECT caller.*
   FROM code_edges e
   JOIN code_nodes caller ON caller.id = e.src_id
   WHERE e.dst_id = ?1
     AND e.kind = 'CALLS'
   ORDER BY caller.id;
   ```

   For deeper traversal, use recursive CTEs with an explicit depth cap and cycle guard:

   ```sql
   WITH RECURSIVE call_chain(depth, src_id, dst_id, path) AS (
     SELECT 1, e.src_id, e.dst_id, printf('%d>%d', e.src_id, e.dst_id)
     FROM code_edges e
     WHERE e.kind = 'CALLS' AND e.src_id = ?1
     UNION ALL
     SELECT c.depth + 1, e.src_id, e.dst_id, c.path || '>' || e.dst_id
     FROM call_chain c
     JOIN code_edges e ON e.src_id = c.dst_id
     WHERE e.kind = 'CALLS'
       AND c.depth < ?2
       AND instr(c.path, printf('>%d', e.dst_id)) = 0
   )
   SELECT * FROM call_chain;
   ```

   This is enough for "callers," "callees," "import neighborhood," "same file container chain," and bounded fan-out analysis.

8. Index strategy is where SQLite either feels fast or disappointing. Recommended indexes:
   - `UNIQUE INDEX code_nodes_stable_key ON code_nodes(stable_key)`
   - `INDEX code_nodes_file_kind_name ON code_nodes(file_id, kind, display_name)`
   - `INDEX code_nodes_fq_name ON code_nodes(fq_name)`
   - `INDEX code_edges_out_call ON code_edges(src_id, kind, ord, dst_id)`
   - `INDEX code_edges_in_call ON code_edges(dst_id, kind, src_id)`
   - `INDEX code_edges_file_kind ON code_edges(file_id, kind, src_id, dst_id)`
   - partial indexes for hot kinds, for example:
     `CREATE INDEX code_edges_calls_out ON code_edges(src_id, dst_id, ord) WHERE kind='CALLS';`
     `CREATE INDEX code_edges_calls_in ON code_edges(dst_id, src_id) WHERE kind='CALLS';`

   The important pattern is directional symmetry: one index for outgoing traversals, one for incoming traversals. This mirrors the reverse-edge convenience that graph databases expose natively.

9. Size estimate for a ~500-file TS/JS project: a compact code graph should stay modest; a full semantic graph grows quickly. This estimate is an inference from the storage patterns above, from CodeQL's much richer relational representation, and from Semgrep's memory-heavy cross-file analysis behavior, not a directly published benchmark. A reasonable planning envelope is:
   - compact graph: roughly 5k-25k nodes and 20k-150k edges
   - on-disk SQLite size: roughly 10-80 MB for graph tables plus indexes
   - if we add per-reference spans, unresolved identifier nodes, or AST-level nodes, size can jump sharply
   - if we pursue CodeQL-like richness (statement/expression/data-flow granularity), expect the data to move from "tens of MB" toward "hundreds of MB or more"

   The main lesson is: compact semantic symbols plus typed edges are cheap; full-program IR is not.

10. For our implementation, the code graph should be a separate SQLite database file, not another table family inside the current memory database. This is partly a design inference from the research above and partly grounded in the current Spec Kit layout: the repo already uses multiple specialized SQLite files for different purposes (`context-index.sqlite`, embedding-profile databases, and `speckit-eval.db`). A separate `code-graph.sqlite` keeps lifecycle, rebuild cadence, schema churn, and write amplification isolated from memory retrieval. If we later need cross-database joins, SQLite already gives us `ATTACH DATABASE` without forcing us into a single all-purpose file.

## Evidence (cite sources/URLs)

- SQLite recursive CTE docs explicitly state that recursive CTEs can walk trees and graphs, and include graph-query examples plus guidance on `UNION ALL`, `ORDER BY`, and `LIMIT`:
  - https://system.data.sqlite.org/home/doc/4deb290d232e5850/Doc/Extra/Core/lang_with.html
- SQLite query planner guidance on multi-column and covering indexes:
  - https://sqlite.org/queryplanner.html
  - https://www.sqlite.org/optoverview.html
- SQLite partial indexes:
  - https://www.sqlite.org/partialindex.html
  - https://www.sqlite.org/lang_createindex.html
- CodeQL stores a relational representation of source code and includes AST, data-flow, and control-flow representations:
  - https://codeql.github.com/docs/codeql-overview/about-codeql/
- CodeQL hardware guidance shows that full-code semantic databases can require substantial RAM/disk even for modest codebases:
  - https://docs.github.com/en/code-security/reference/code-scanning/codeql/recommended-hardware-resources-for-running-codeql
- Neo4j traversal and index behavior:
  - https://neo4j.com/docs/java-reference/current/java-embedded/traversal/
  - https://neo4j.com/docs/cypher-manual/current/indexes/
  - https://neo4j.com/docs/cypher-manual/current/indexes/search-performance-indexes/using-indexes/
- Dgraph relationship, traversal, index, and reverse-edge behavior:
  - https://docs.hypermode.com/dgraph/concepts/relationships
  - https://docs.hypermode.com/dgraph/guides/get-started-with-dgraph/basic-operations
  - https://docs.hypermode.com/dgraph/dql/indexes
- Semgrep cross-file/interfile analysis behavior and memory requirements:
  - https://semgrep.dev/docs/semgrep-code/semgrep-pro-engine-intro
  - https://semgrep.dev/docs/writing-rules/data-flow/taint-mode/overview
  - https://semgrep.dev/docs/references/feature-definitions
- SourcetrailDB persistent database-file writer API, symbol/reference recording, and transaction support:
  - https://github.com/CoatiSoftware/SourcetrailDB
- Repo-local context for the "separate database" recommendation:
  - `.opencode/skill/system-spec-kit/mcp_server/database/README.md`
  - `.opencode/skill/system-spec-kit/mcp_server/core/config.ts`

## New Information Ratio (0.0-1.0)

0.84

## Novelty Justification

This iteration adds a concrete storage decision framework that the packet did not previously contain. Earlier packet research established that a clean-room code graph was desirable, but it did not answer the operational database question: SQLite versus graph DB, shared database versus separate database, or the exact schema/index/query shape needed for a compact TS/JS graph. The most important new synthesis here is that we do not need a graph database to get graph behavior for our likely workload; we need a compact adjacency schema, directional indexes, bounded recursive traversal, and a separate lifecycle from the memory index.

## Recommendations for Our Implementation

1. Use SQLite for v1, not Neo4j or Dgraph.
   - Our likely workload is local, embedded, single-project, and dominated by direct-neighbor and short multi-hop traversals.
   - The operational simplicity advantage is large, while the graph-DB-only benefits are not yet clearly necessary.

2. Keep the graph compact.
   - Store semantic symbols and typed relationships, not the full AST.
   - Do not model every expression/statement in v1.
   - Treat CodeQL as the "rich graph" upper bound, not the target shape.

3. Use a separate `code-graph.sqlite`.
   - Place it beside the existing memory/eval databases.
   - Keep rebuilds, migrations, and corruption/recovery isolated from the memory index.
   - Use `ATTACH DATABASE` later if we need cross-store joins.

4. Implement a `nodes + edges + files` schema first.
   - `code_nodes` and `code_edges` should be the backbone.
   - Add optional alias/name tables only if lookup pain shows up in practice.

5. Optimize for the two hot queries first.
   - outgoing calls
   - incoming callers

6. Add recursive CTE traversal only for bounded depth.
   - Require an explicit max depth.
   - Include cycle protection.
   - Avoid pretending SQLite is a general-purpose graph analytics engine.

7. Index both directions explicitly.
   - outgoing `src_id -> dst_id`
   - incoming `dst_id -> src_id`
   - partial indexes for `CALLS` and `IMPORTS`

8. Separate extraction from querying.
   - Build the graph incrementally from tree-sitter or another parser into SQLite.
   - Query the persisted SQLite graph from the MCP side.
   - Keep JSON export as a debug artifact, not as the primary storage format.

9. Revisit dedicated graph DBs only if one of these becomes true:
   - we need rich variable-length path queries all the time,
   - the graph becomes multi-project and very large,
   - we need concurrent multi-user graph exploration,
   - or SQLite recursive traversals become the measured bottleneck.
