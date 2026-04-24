# Iteration 3: Semantic Subagent Prompt + Merge / Cache / Promotion to graph.json

## Focus
Resolve Q3 (semantic subagent prompt design and multimodal instructions) and Q4 (how AST + semantic outputs are merged, deduplicated, cached, validated, and promoted into final `graphify-out/graph.json`). Read `external/skills/graphify/skill.md` for the subagent prompt and merge logic, `external/graphify/cache.py` for the cache architecture, `external/graphify/build.py` and `external/graphify/validate.py` for graph assembly, and `external/graphify/export.py:264-275` for the `to_json` confidence backfill.

## Findings

1. The semantic subagent prompt is embedded **verbatim in `skill.md`**, not in any Python module — it lives at `external/skills/graphify/skill.md:184-234`. This makes it hot-editable by anyone running the skill (no graphify package update needed) but also means the prompt is NOT shared with or surfaced by `graphify.serve` (the MCP server) or `extract.py`. The prompt is dispatched verbatim to N parallel subagents, each receiving a chunk of 20-25 files (or 1 file per chunk for images, since vision needs separate context). [SOURCE: external/skills/graphify/skill.md:166-234; external/skills/graphify/skill.md:170-181]

2. The subagent prompt enforces a **three-tier confidence vocabulary** with explicit semantics: `EXTRACTED` = "relationship explicit in source (import, call, citation, 'see §3.2')", `INFERRED` = "reasonable inference (shared data structure, implied dependency)", and `AMBIGUOUS` = "uncertain - flag for review, do not omit". The "do not omit" rule for AMBIGUOUS makes graphify treat negative/uncertain knowledge as a first-class graph output — most extractors discard low-confidence findings, graphify preserves them. [SOURCE: external/skills/graphify/skill.md:191-194]

3. **Confidence scores have two sources of truth that produce a subtle inconsistency for INFERRED edges.** The subagent prompt instructs LLMs to emit `confidence_score` per these rules: `EXTRACTED edges must be 1.0`, `INFERRED edges 0.4-0.9 based on certainty (strong=0.8-0.9, reasonable=0.6-0.7, weak=0.4-0.5)`, `AMBIGUOUS edges 0.1-0.3`. But `export.py:264-275` backfills MISSING `confidence_score` values from `_CONFIDENCE_SCORE_DEFAULTS = {"EXTRACTED": 1.0, "INFERRED": 0.5, "AMBIGUOUS": 0.2}`. AST edges have no `confidence_score` in extract.py (only a categorical `confidence` label), so they all get the default 0.5/0.2 floor at export time, while semantic edges keep the LLM's actual score. Result: a `INFERRED` AST edge always reports 0.5, while a `INFERRED` semantic edge can be 0.4-0.9. [SOURCE: external/graphify/export.py:250; external/graphify/export.py:264-275; external/skills/graphify/skill.md:225-230]

4. The semantic subagent prompt teaches **per-file-type extraction strategies** (skill.md:196-205): code files = extract semantic edges AST CANNOT find (call relationships, shared data, arch patterns), explicit instruction NOT to re-extract imports because AST already has them; doc/paper files = named concepts, entities, citations; image files = use vision to "understand what the image IS — do not just OCR." The image instructions are then specialized by sub-type: UI screenshots → layout patterns + design decisions + key elements + purpose; charts → metric + trend + data source; tweets/posts → claim as node + author + concepts; diagrams → components and connections; research figures → what it demonstrates + method + result; handwritten/whiteboard → ideas and arrows with uncertain readings marked AMBIGUOUS. This is the multimodal payload, and it's explicitly NOT OCR. [SOURCE: external/skills/graphify/skill.md:196-209]

5. The subagent prompt introduces **a fourth knowledge primitive — `semantically_similar_to` edges and hyperedges — that the deterministic AST pass cannot produce.** `semantically_similar_to` is for cross-cutting non-obvious links between concepts that have NO structural relationship (no import, no call, no citation), with a 0.6-0.95 confidence range and a "only when genuinely non-obvious" guard. Hyperedges are 3+ nodes participating in a shared concept/flow/pattern (e.g., all functions in an authentication flow), capped at 3 per chunk, written to a top-level `hyperedges` array. These two primitives are graphify's main differentiation from any pairwise-only graph extractor. [SOURCE: external/skills/graphify/skill.md:210-220]

6. **Caching is content-addressed via SHA256, not path-addressed.** `cache.py:9-11` defines `file_hash(path)` as `hashlib.sha256(Path(path).read_bytes()).hexdigest()` and `cache_dir()` writes to `graphify-out/cache/{hash}.json`. `load_cached(path, root)` returns the cached extraction iff the current hash still matches; any byte-level change (including whitespace edits) invalidates the cache. A file rename without content change keeps the cache hit, which is the *intended* behavior for refactor renames. There is no TTL — the cache lives until `clear_cache()` is called or the directory is deleted. [SOURCE: external/graphify/cache.py:9-49]

7. **The cache layer treats AST and semantic results identically** via two helpers: `check_semantic_cache(files)` returns `(cached_nodes, cached_edges, cached_hyperedges, uncached_files)`, and `save_semantic_cache(nodes, edges, hyperedges)` re-groups results by `source_file` and writes one cache entry per file (cache.py:65-124). The same `{hash}.json` cache entry stores either an AST extraction or a semantic extraction or both depending on which extractor wrote it last — there's no separate AST cache vs semantic cache. The dispatch in `extract.py:2370-2477` calls `load_cached` / `save_cached` per file before per-language extraction. [SOURCE: external/graphify/cache.py:65-124; external/graphify/extract.py:2371-2378]

8. **The two-stage merge that builds `.graphify_extract.json`** runs entirely in shell-invoked Python inline scripts inside `skill.md`, NOT in any graphify Python module. Stage 1 (skill.md:259-285): merge cached + new semantic results into `.graphify_semantic.json` with dedup by `node['id']` and edge concatenation (no edge dedup). Stage 2 (skill.md:287-317): merge `.graphify_ast.json` + `.graphify_semantic.json` into `.graphify_extract.json` — AST nodes go into the `seen` set FIRST, then semantic nodes are added only if their `id` is not already present, edges are concatenated. This is the source of the "AST wins on collision" behavior iter 1 flagged: it's not implemented inside graphify, it's implemented in the orchestration prompt. [SOURCE: external/skills/graphify/skill.md:259-317]

9. **Validation is enforced before NetworkX assembly, but with a permissive escape hatch.** `validate.py` defines required fields (`{id, label, file_type, source_file}` for nodes; `{source, target, relation, confidence, source_file}` for edges), valid file types `{code, document, paper, image}`, and valid confidence values `{EXTRACTED, INFERRED, AMBIGUOUS}`. It also checks that every edge `source` and `target` resolves to an existing node id. But `build.py:8-13` runs `validate_extraction` and then **filters out any error string containing "does not match any node id"** before deciding whether to warn — dangling edges (imports pointing at stdlib/external libs) are silently accepted. Schema-level errors (missing fields, invalid enums) only print to stderr, they don't halt assembly. [SOURCE: external/graphify/validate.py:1-71; external/graphify/build.py:8-13]

10. **NetworkX edges preserve original direction via `_src`/`_tgt` attribute backfill.** Because `build_from_json` constructs an undirected `nx.Graph()` (build.py:14), it would normally lose edge direction. The fix at build.py:24-26 explicitly stores `attrs["_src"] = src` and `attrs["_tgt"] = tgt` before adding the edge. Hyperedges are stored on `G.graph["hyperedges"]` as a graph-level metadata dict, not as multi-endpoint edges (build.py:28-30) — meaning every NetworkX algorithm operating on `G` ignores them entirely. They are only surfaced in export, MCP queries, and reports. [SOURCE: external/graphify/build.py:14-31]

11. **`to_json` is the final promotion step that produces `graphify-out/graph.json`** and does three things in order (export.py:264-275): (a) build a `node → community` map from the Leiden output and write it onto every node as `node["community"]`; (b) walk every edge and backfill `confidence_score` from `_CONFIDENCE_SCORE_DEFAULTS` only if the field is missing; (c) attach the graph-level `hyperedges` list under `data["hyperedges"]`. The output uses NetworkX's `node_link_data` JSON-graph format with `edges="links"`, so downstream consumers see `{nodes:[...], links:[...], hyperedges:[...]}`. Community membership is the first thing every consumer sees on a node — it's not metadata, it's primary. [SOURCE: external/graphify/export.py:264-275]

12. **Subagent dispatch is hard-asserted as parallel.** The skill.md instructions are explicit and unusually emphatic: "MANDATORY: You MUST use the Agent tool here. Reading files yourself one-by-one is forbidden — it is 5-10x slower. If you do not use the Agent tool you are doing this wrong" (skill.md:134), and "Call the Agent tool multiple times IN THE SAME RESPONSE - one call per chunk. This is the only way they run in parallel" (skill.md:172). Half-failed chunks are tolerated; if more than half fail, the skill aborts (skill.md:240-242). This means the merge/cache architecture is designed for partial failures from the start. [SOURCE: external/skills/graphify/skill.md:134; external/skills/graphify/skill.md:170-181; external/skills/graphify/skill.md:236-242]

## Semantic Subagent JSON Schema (verbatim from skill.md:233)

```json
{
  "nodes":[
    {
      "id":"filestem_entityname",
      "label":"Human Readable Name",
      "file_type":"code|document|paper|image",
      "source_file":"relative/path",
      "source_location":null,
      "source_url":null,
      "captured_at":null,
      "author":null,
      "contributor":null
    }
  ],
  "edges":[
    {
      "source":"node_id",
      "target":"node_id",
      "relation":"calls|implements|references|cites|conceptually_related_to|shares_data_with|semantically_similar_to",
      "confidence":"EXTRACTED|INFERRED|AMBIGUOUS",
      "confidence_score":1.0,
      "source_file":"relative/path",
      "source_location":null,
      "weight":1.0
    }
  ],
  "hyperedges":[
    {
      "id":"snake_case_id",
      "label":"Human Readable Label",
      "nodes":["node_id1","node_id2","node_id3"],
      "relation":"participate_in|implement|form",
      "confidence":"EXTRACTED|INFERRED",
      "confidence_score":0.75,
      "source_file":"relative/path"
    }
  ],
  "input_tokens":0,
  "output_tokens":0
}
```

## Merge / Cache / Promotion Pipeline (end-to-end trace)

```
Step B0 (skill.md:142-162) — Cache lookup
  check_semantic_cache(all_files) → (cached_nodes, cached_edges, cached_hyperedges, uncached_files)
  Writes:  .graphify_cached.json   (cached results)
           .graphify_uncached.txt  (files needing extraction)

Step B2 (skill.md:170-234) — Parallel subagent dispatch
  N parallel agents on uncached files (chunks of 20-25, 1 image per chunk)
  Each agent emits the JSON schema above

Step B3 (skill.md:236-285) — Cache + merge new semantic
  save_semantic_cache(new_nodes, new_edges, new_hyperedges)
  Merge cached + new with dedup by node['id'] →  .graphify_semantic.json

Part C (skill.md:287-317) — Merge AST + semantic
  Read .graphify_ast.json (from extract())
  Read .graphify_semantic.json
  seen = {n['id'] for n in ast['nodes']}                  # AST first
  for n in sem['nodes']:
      if n['id'] not in seen:                              # semantic only if id not taken
          merged_nodes.append(n)
  merged_edges = ast['edges'] + sem['edges']               # NO edge dedup
  Write .graphify_extract.json

Step 4 (skill.md:319-363) — Build graph
  build_from_json(extraction):
    1. validate_extraction()  →  filter dangling-edge errors  →  warn on real errors
    2. nx.Graph()
    3. for node in extraction['nodes']: G.add_node(id, **rest)
    4. for edge: skip if endpoints not in G; else G.add_edge(src,tgt, _src=src, _tgt=tgt, **rest)
    5. G.graph['hyperedges'] = extraction.get('hyperedges', [])
  cluster(G)  →  Leiden communities
  god_nodes / surprising_connections / suggest_questions
  to_json(G, communities, 'graphify-out/graph.json')

to_json (export.py:264-275) — Final promotion
  data = json_graph.node_link_data(G, edges='links')
  for node in data['nodes']:
      node['community'] = node_community.get(node['id'])
  for link in data['links']:
      if 'confidence_score' not in link:
          link['confidence_score'] = _CONFIDENCE_SCORE_DEFAULTS[link['confidence']]
  data['hyperedges'] = G.graph.get('hyperedges', [])
  json.dump(data, f, indent=2)
  →  graphify-out/graph.json
```

## Confidence-Score Backfill Inconsistency (cited from finding 3)

| Edge Origin | confidence label | confidence_score in graph.json | Source of score |
|---|---|---|---|
| AST extract.py — `imports`, `imports_from`, `contains`, `inherits`, `method`, `rationale_for` | EXTRACTED | **1.0** (from default, since AST never sets the field) | `_CONFIDENCE_SCORE_DEFAULTS` |
| AST extract.py — `calls` | INFERRED | **0.5** (from default; AST sets `weight=0.8` but no `confidence_score`) | `_CONFIDENCE_SCORE_DEFAULTS` |
| AST extract.py — `uses` (cross-file) | INFERRED | **0.5** (same; never sets `confidence_score`) | `_CONFIDENCE_SCORE_DEFAULTS` |
| Semantic subagent — any EXTRACTED relation | EXTRACTED | **1.0** | LLM (per prompt) |
| Semantic subagent — INFERRED relation | INFERRED | **0.4–0.9** depending on certainty | LLM (per prompt) |
| Semantic subagent — AMBIGUOUS relation | AMBIGUOUS | **0.1–0.3** | LLM (per prompt) |

**Implication for Public:** an AST `calls` edge and a semantic `calls` edge with the same source/target produce different `confidence_score` values (0.5 from AST default vs LLM-chosen value from semantic). Public can either accept this divergence or normalize it at the consumer.

## Validation Schema (verbatim from validate.py:1-71)

| Constraint | Required Fields | Valid Values |
|---|---|---|
| Node | `id`, `label`, `file_type`, `source_file` | `file_type ∈ {code, document, paper, image}` |
| Edge | `source`, `target`, `relation`, `confidence`, `source_file` | `confidence ∈ {EXTRACTED, INFERRED, AMBIGUOUS}` |
| Edge endpoints | `source` and `target` must resolve to a node id | Dangling endpoints permitted at build time (filtered to warning, then dropped by build.py:20-21) |
| Hyperedges | NOT validated | (no schema check; pass-through to G.graph) |

## Ruled Out

- **Looking for a Python class named `SemanticExtractor` or `SubagentPrompt`**: not found. The prompt is in `skill.md`, not Python. This means graphify cannot version the prompt as code, cannot unit-test it, and cannot expose it via the MCP `serve` interface. Public would treat this as a structural weakness if adopting the pattern.

- **Looking for a unified merge function in graphify Python**: the merge logic is implemented as inline shell-invoked Python in `skill.md:259-317`. The graphify package does NOT export a `merge_extraction(ast, semantic)` function. The "build" function in `build.py:34-42` is for combining MULTIPLE extractions (e.g., parallel extract() runs), not for merging AST + semantic. This is a coupling between the skill orchestration layer and the data layer that Public should be aware of.

- **Looking for hyperedge validation**: no validation. `validate.py` does not touch hyperedges; they pass through to `G.graph["hyperedges"]` unchecked. This is a clean extension point but also a correctness risk for Public.

## Dead Ends

- **Hoping cache deduplication is content-aware across renames**: it is at the file-rename level (since SHA256 only sees content, not paths) but NOT at the file-edit-revert level (any change to a file invalidates the cache, even if you revert immediately afterward, because the post-revert hash matches the pre-edit hash but the cache file may have already been overwritten by an intermediate save). Public should consider this when evaluating cache stability.

## Sources Consulted

- `external/skills/graphify/skill.md:1-650` (full read in two passes)
- `external/graphify/cache.py:1-125` (full read)
- `external/graphify/build.py:1-43` (full read)
- `external/graphify/validate.py:1-71` (full read)
- `external/graphify/export.py:240-275` (`_CONFIDENCE_SCORE_DEFAULTS` + `to_json`)
- Cross-reference with iter 2's `extract.py` reads for the AST edge schema

## Assessment

- **New information ratio:** 0.92 (11 of 12 findings genuinely new vs prior iterations; finding 3's confidence-backfill inconsistency partially overlaps iter 2's confidence/weight observation but extends it materially)
- **Questions addressed:** Q3, Q4, partial Q6
- **Questions answered (fully):** Q3 (semantic subagent prompt), Q4 (merge / cache / promotion to graph.json)
- **Questions partially advanced:** Q6 (EXTRACTED/INFERRED/AMBIGUOUS handling now traced through subagent rules → cache → merge → backfill → graph.json — most of Q6 is answered, only the report.py rendering side remains)

## Reflection

- **What worked:** Reading skill.md alongside the four small Python modules (cache, build, validate, export's to_json) gave the full data flow in one pass. The two-source-of-truth confidence score insight only became visible when comparing the subagent prompt rules (skill.md:225-230) against the export-time defaults (export.py:250) — neither file alone reveals it.
- **What did not work:** Initially I assumed merge logic would live in `build.py`. It doesn't. It's inline in `skill.md`. This pattern (orchestration logic in markdown shell scripts, not in Python) is a graphify design choice that affects almost every "where does X happen" question.
- **What I would do differently next iteration:** When investigating Leiden clustering (Q5) and report generation (Q10), look for orchestration logic in skill.md FIRST, then drop into the Python module. The skill.md is the master script, not the README.

## Recommended Next Focus

Iteration 4 should resolve **Q5 (Leiden parameter choices and 25%/min-10 community split rationale)** and **Q10 (god nodes, surprising connections, ambiguous edges, suggested questions in GRAPH_REPORT.md)** by reading `external/graphify/cluster.py` end-to-end, `external/graphify/analyze.py` for the analyzer functions named in finding 1's pipeline mapping (`god_nodes()`, `surprising_connections()`, `suggest_questions()`), and `external/graphify/report.py` for the report template. These three files together implement the "interesting questions to ask about the graph" layer that Public can most directly translate into graph-aware navigation tools.
