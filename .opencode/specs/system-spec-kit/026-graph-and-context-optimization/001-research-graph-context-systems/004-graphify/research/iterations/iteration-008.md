# Iteration 8: Export + Wiki + MCP Serve Surface

## Focus
This iteration closes the remaining gap on graphify's downstream delivery surfaces: how the built graph is exported for humans, files, and graph databases, and how that same graph is exposed over MCP to an LLM caller. This matters for Public because Code Graph MCP, CocoIndex, and Spec Kit Memory already solve structural retrieval well; the open question is which graphify export patterns are genuinely additive for evidence-preserving interchange, offline review, and assistant-facing graph serving. All findings below are new relative to iterations 1-7 because they concern output contracts and serve boundaries rather than pipeline, extraction, clustering, hooks, multimodal ingest, or benchmark claims.

## Findings
1. **`to_json()` is graphify's canonical machine-readable interchange, and it explicitly preserves both community IDs and edge-confidence numerics.** [SOURCE: external/graphify/export.py:264-275]
   It serializes the NetworkX graph with node-link JSON, injects `community` onto every node, backfills a numeric `confidence_score` for edges that only have categorical confidence, and carries `hyperedges` from graph metadata into the output. That makes `graph.json` more than a raw dump: it is the handoff artifact from build-time analysis into downstream consumers. Public should **Adapt** this pattern by extending its own export layer with a stable JSON contract that preserves provenance/confidence and any higher-order structures, rather than relying only on in-process MCP responses. **EXTRACTED**

2. **The HTML export is a bounded human-review surface, not a universal downstream API.** [SOURCE: external/graphify/export.py:296-403]
   `to_html()` hard-fails above `MAX_NODES_FOR_VIZ = 5000`, then emits a single self-contained vis.js page with degree-scaled nodes, confidence-styled edges, search, click inspection, community legend filtering, and hyperedge overlays. The design is explicitly for interactive review of one graph snapshot, not for programmatic traversal or large-scale serving. Public should **Adopt** the idea of a disposable evidence-review artifact, but **Reject** this as a serving primitive because Public's graph is already far larger than the hard cap and needs typed retrieval, not browser-only inspection. **EXTRACTED**

3. **The Obsidian export is opinionated knowledge packaging, not just markdown dumping.** [SOURCE: external/graphify/export.py:410-649]
   `to_obsidian()` creates one note per node, assigns YAML frontmatter, tags by file type, dominant confidence, and community, adds `[[wikilink]]` connections, writes per-community overview notes, embeds a Dataview query, and generates `.obsidian/graph.json` so Obsidian colors graph nodes by community. This is a real translation layer from graph structure into a vault-native browsing experience. Public should **Adapt** this for spec/research evidence bundles or packet-local review vaults, especially the frontmatter/tagging/community-note pattern, but avoid making Obsidian a core runtime dependency. **EXTRACTED**

4. **The Canvas export is intentionally lossy and presentation-first: it spatializes communities, rewrites nodes as Obsidian file cards, and caps visible edges at 200.** [SOURCE: external/graphify/export.py:652-806]
   `to_canvas()` computes a community grid layout, writes group boxes plus per-node file cards, hardcodes note paths under `graphify/obsidian/`, and keeps only the top 200 weighted edges for readability. That makes the canvas an explorable map for humans, but not a faithful full-graph interchange format. Public should **Reject** this as a primary export contract, but **Adopt** the narrower lesson that review-oriented visual exports can safely be lossy when they are explicitly branded as presentation artifacts. **EXTRACTED**

5. **graphify supports Neo4j in two modes: offline Cypher script generation and direct live upserts via the Python driver.** [SOURCE: external/graphify/export.py:278-293; external/graphify/export.py:809-867]
   `to_cypher()` emits MERGE-based Cypher statements with node labels derived from `file_type` and relationships derived from sanitized relation names, while `push_to_neo4j()` performs the same basic mapping directly against a running Neo4j instance and upserts scalar node/edge properties. The important design choice is not "Neo4j support" by itself, but that graphify treats external graph stores as secondary projections from `graph.json`, not as the source of truth. Public should **Adapt** this projection model if it wants external graph-database interoperability, but **Reject** any move that would make Neo4j a required serving dependency for Code Graph MCP. **EXTRACTED**

6. **The standalone wiki export republishes graph structure as agent-crawlable articles centered on communities and god nodes, with audit summaries baked into the prose.** [SOURCE: external/graphify/wiki.py:25-214]
   `to_wiki()` writes an `index.md`, one article per community, and one article per supplied god node; each community article lists key concepts, cross-community relationships, source files, and an "Audit Trail" section showing EXTRACTED/INFERRED/AMBIGUOUS percentages. This is a different surface from Obsidian: it is optimized for sequential reading and agent crawling rather than backlink-native vault navigation. Public should **Adopt** the idea of report-grade narrative exports that preserve provenance summaries, especially for research packets and external evidence handoff, because that adds something distinct from current live MCP query surfaces. **EXTRACTED**

7. **`serve.py` makes `graph.json` the serving boundary by reconstructing communities from node properties instead of depending on clustering-side state.** [SOURCE: external/graphify/serve.py:11-31; external/graphify/serve.py:103-115]
   The server loads a validated graph path, parses node-link JSON back into NetworkX, and rebuilds the community map purely from each node's serialized `community` attribute. That means any consumer that can read the JSON artifact can serve the graph without access to the earlier clustering pipeline. Public should **Adopt** this boundary discipline: export enough structural metadata into durable artifacts that serving layers can be stateless projections rather than tightly coupled to the build pipeline. **EXTRACTED**

8. **The main query tool is lexical seeding plus BFS/DFS text rendering, not semantic retrieval and not structured graph return.** [SOURCE: external/graphify/serve.py:34-43; external/graphify/serve.py:45-93; external/graphify/serve.py:190-203]
   `query_graph` splits the user's question into lowercase terms, scores nodes by substring hits in labels and source paths, chooses up to three seed nodes, traverses with BFS or DFS, and emits a plain-text listing of `NODE` and `EDGE` lines truncated by a rough token budget. This is useful as a lightweight assistant-facing projection, but it is materially weaker than Public's existing CocoIndex semantic search and typed code-graph context handlers. Public should **Adapt** only the token-budgeted subgraph-text projection as an optional output mode, and **Reject** the lexical-seed retrieval strategy as a replacement for current search/retrieval infrastructure. **EXTRACTED**

9. **The MCP surface is intentionally narrow and text-only: seven read-only tools, all wrapped as `TextContent`.** [SOURCE: external/graphify/serve.py:117-188; external/graphify/serve.py:304-309]
   The server exposes `query_graph`, `get_node`, `get_neighbors`, `get_community`, `god_nodes`, `graph_stats`, and `shortest_path`, and every call returns a single `types.TextContent` payload rather than structured JSON or rich typed objects. That keeps implementation small and model-friendly, but it also discards machine-usable structure at the final serving step. Public should **Reject** this as the main MCP contract because its current Code Graph MCP and Spec Kit Memory surfaces benefit from typed schemas, but **Adopt** the idea of a parallel "brief text answer" mode layered on top of richer structured handlers. **EXTRACTED**

10. **The serve layer is deliberately thin and mostly static: no cache invalidation, no refresh tool, no watch loop, and no write-back capabilities.** [SOURCE: external/graphify/serve.py:103-115; external/graphify/serve.py:117-188; external/graphify/serve.py:311-322]
    The graph is loaded once before tool registration, then the process simply runs the MCP stdio server; the listed tools are all read-only queries over the already-loaded snapshot. That keeps the boundary simple, but it means freshness is delegated to the caller rebuilding `graph.json` out of band. Public should **Reject** this operational model for its primary MCP because it already has stronger freshness/recovery expectations, but **Adopt** the separation of concerns: a serve layer can stay read-only if rebuild and invalidation are explicit elsewhere. **EXTRACTED**

## Exhausted / Ruled-Out Directions
- Looking for a CSV exporter: not present. `export.py` defines JSON, Cypher, HTML, Obsidian, Canvas, Neo4j push, GraphML, and SVG export surfaces, but no `to_csv()` or CSV-specific branch. [SOURCE: external/graphify/export.py:264-887]
- Looking for structured MCP graph payloads: not present. `query_graph()` renders plain text lines, and `call_tool()` wraps every result as `types.TextContent` instead of returning JSON objects or typed graph fragments. [SOURCE: external/graphify/serve.py:77-93; external/graphify/serve.py:304-309]
- Looking for a serve-side refresh or reindex control: not present. The server loads `graph.json` once before registering tools, and `list_tools()` exposes only read/query operations. [SOURCE: external/graphify/serve.py:103-115; external/graphify/serve.py:117-188]
- Looking for community lookup by label or semantic topic: not present. The MCP surface only accepts integer `community_id` for community retrieval, and the wiki/export layers assume labels were already computed elsewhere. [SOURCE: external/graphify/serve.py:156-164; external/graphify/serve.py:236-245; external/graphify/wiki.py:188-198]

## Verdict on Export/Serve Surface
graphify's strongest new ideas for Public are not in the retrieval algorithm itself, but in how it turns one graph artifact into multiple evidence-preserving downstream views. The most reusable patterns are: a stable JSON handoff that preserves community/provenance metadata, narrative wiki export that keeps audit information visible, and Obsidian packaging that transforms graph structure into a browsable vault with community-aware tagging. Those are additive to Public because they create durable review/share artifacts outside the live MCP path.

The MCP serve layer is much less compelling as a direct model for Public. It is clean and easy to reason about, but it is intentionally shallow: lexical seeding, BFS/DFS traversal, text-only output, and no freshness controls. Public already has better live retrieval primitives through CocoIndex, Code Graph MCP, and Spec Kit Memory. The right move is to **adapt** graphify's export discipline and optional text-subgraph rendering, while **rejecting** its serve surface as a replacement for Public's typed, specialized MCP handlers.

If Public wants to borrow one architectural principle from this pass, it is this: keep the analysis pipeline, export artifact, and serve layer loosely coupled. Build rich graph artifacts once, preserve provenance in the exported representation, and let multiple consumers project from that artifact without collapsing everything into one text-only MCP tool.

## Tools Used
- `functions.mcp__spec_kit_memory__memory_match_triggers` (attempted; cancelled)
- `functions.exec_command`
- `multi_tool_use.parallel`
- `functions.apply_patch`

## Sources Queried
- `external/graphify/export.py:1-954`
- `external/graphify/wiki.py:1-214`
- `external/graphify/serve.py:1-322`
- `external/worked/mixed-corpus/GRAPH_REPORT.md:1-68`
