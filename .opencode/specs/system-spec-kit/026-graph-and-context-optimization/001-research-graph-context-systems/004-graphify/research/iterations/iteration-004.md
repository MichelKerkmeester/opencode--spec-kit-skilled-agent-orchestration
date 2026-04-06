# Iteration 4: Leiden Clustering + God Nodes + Surprising Connections + Suggested Questions

## Focus
Resolve Q5 (Leiden parameters and 25%/min-10 split rationale) and Q10 (god nodes, surprising connections, ambiguous edges, low-cohesion detection, suggested questions in `GRAPH_REPORT.md`). Read `external/graphify/cluster.py`, `external/graphify/analyze.py`, and `external/graphify/report.py` end-to-end. These three files implement the "interesting things to ask about a graph" layer that Public can most directly translate.

## Findings

1. **The Leiden implementation is a thin lazy-loaded wrapper around `graspologic.partition.leiden`** with no parameter tuning exposed: there are no resolution, randomness, or modularity-objective overrides. `cluster.py:39` imports `from graspologic.partition import leiden` lazily inside `cluster()` to avoid a 15-second numba JIT cost on import. The lazy import is a hot-path optimization that Public should adopt if it ever depends on graspologic. [SOURCE: external/graphify/cluster.py:39; external/graphify/cluster.py:1-21]

2. **The 25% / min-10 community split rule is two hard-coded module constants** at `cluster.py:23-24`: `_MAX_COMMUNITY_FRACTION = 0.25` and `_MIN_SPLIT_SIZE = 10`. The actual threshold is `max(_MIN_SPLIT_SIZE, int(G.number_of_nodes() * _MAX_COMMUNITY_FRACTION))` — so a 30-node graph uses min 10 (the floor), a 100-node graph uses 25, a 1000-node graph uses 250. There is **no docstring rationale** for these specific values; they're just constants. The empirical motivation is implicit: Leiden modularity tends to produce one giant community on graphs with heavy hubs (god nodes), and 25% is the inflection point where a "community" becomes too coarse to be useful as a navigation primitive. [SOURCE: external/graphify/cluster.py:23-24; external/graphify/cluster.py:58-65]

3. **Oversized-community splitting is a single-pass second Leiden run on the subgraph, not recursive.** `_split_community(G, nodes)` extracts the subgraph induced by the oversized community and runs Leiden again. Three escape hatches: (a) if the subgraph has zero edges, split into single-node communities; (b) if the second Leiden returns ≤ 1 community (couldn't split), return the original community as-is; (c) if Leiden raises any exception, return the original. There is no third pass — a giant subcommunity that survives one re-split stays giant. [SOURCE: external/graphify/cluster.py:72-89]

4. **Isolates are first-class single-node communities, not dropped.** `cluster.py:42-56` separates isolates (degree 0) from connected nodes BEFORE running Leiden, then runs Leiden only on the connected subgraph (graspologic warns and drops isolates otherwise), then assigns each isolate its own dedicated community ID after the connected partition completes. The result is that an isolated file or concept always survives the clustering pass with a community membership, even if its community has only one member. [SOURCE: external/graphify/cluster.py:42-56]

5. **Cohesion score is undirected edge density**, computed as `actual_edges / max_possible_edges` where max possible = `n*(n-1)/2` for a community of `n` nodes. Singletons score 1.0 (definitionally cohesive). The score is a single float per community, used by `analyze.suggest_questions` (threshold < 0.15 with ≥ 5 nodes flags a "low cohesion → should be split?" question) and by `report.py` to display community quality next to each cluster label. [SOURCE: external/graphify/cluster.py:92-100; external/graphify/analyze.py:416-426]

6. **God-node detection is degree-ranked but explicitly filters synthetic nodes** via `_is_file_node()`. The filter excludes: (a) labels matching code-extension filename patterns like `client.py`; (b) labels starting with `.` and ending with `()` (AST method stubs); (c) labels ending with `()` and degree ≤ 1 (orphan function nodes). This is graphify's way of saying "the most-connected NODE in the graph is meaningless because it's just a hub for `contains` edges — show me the most-connected real CLASS instead." Top N is configurable, default 10. [SOURCE: external/graphify/analyze.py:11-32; external/graphify/analyze.py:35-54]

7. **Surprising connections use a 6-factor composite score, not a single signal.** `_surprise_score()` adds together: confidence weight (AMBIGUOUS=3, INFERRED=2, EXTRACTED=1), cross-file-type bonus (+2 for code↔paper or code↔image), cross-repo bonus (+2 for different top-level directory), cross-community bonus (+1 for Leiden-distant), peripheral→hub bonus (+1 when min-degree ≤ 2 and max-degree ≥ 5), and a `semantically_similar_to` multiplier (×1.5 on the running total). Every contributing factor is recorded in a `reasons` array that becomes the `why` field in the output, so users can see exactly why an edge was flagged. [SOURCE: external/graphify/analyze.py:130-183]

8. **Single-source corpora get a different surprise algorithm: cross-community edges instead of cross-file.** `surprising_connections()` checks `len(source_files) > 1` and routes to `_cross_file_surprises` for multi-source corpora and `_cross_community_surprises` for single-source corpora. The single-source path filters out structural relations (`imports`, `imports_from`, `contains`, `method`), keeps only edges that bridge different Leiden communities, sorts by confidence (AMBIGUOUS first), and **deduplicates by community-pair** so a single high-betweenness god node can't dominate all results. If no community info is available, falls back to edge betweenness centrality. [SOURCE: external/graphify/analyze.py:57-86; external/graphify/analyze.py:244-323]

9. **`suggest_questions()` generates exactly five question types**, each from a distinct graph-shape signal (analyze.py:326-440):
   - **`ambiguous_edge`** — for every AMBIGUOUS edge, asks "What is the exact relationship between X and Y?" (no top-N cap; one question per AMBIGUOUS edge)
   - **`bridge_node`** — for top 3 high-betweenness non-file/non-concept nodes, asks "Why does X connect community A to B, C?" using community labels
   - **`verify_inferred`** — for top 5 god nodes (excluding file nodes), if a node has ≥ 2 INFERRED edges, asks "Are the N inferred relationships involving X actually correct?"
   - **`isolated_nodes`** — if any non-file/non-concept node has degree ≤ 1, asks "What connects [first 3 isolated nodes] to the rest of the system?"
   - **`low_cohesion`** — for any community with cohesion < 0.15 AND ≥ 5 nodes, asks "Should [community label] be split into smaller modules?"
   
   If all five generators produce nothing, returns a single `no_signal` sentinel question with a why-explanation. The full result is capped at `top_n=7`. [SOURCE: external/graphify/analyze.py:326-440]

10. **`GRAPH_REPORT.md` has 9 sections, each fully derived from in-process state — no LLM calls during reporting.** The sections in order: Corpus Check (with detection warning passthrough), Summary (node/edge/community counts + EXTRACTED/INFERRED/AMBIGUOUS percentages + INFERRED-edge average confidence score), God Nodes, Surprising Connections, Hyperedges (only if any exist), Communities (with cohesion score and label, member nodes filtered through `_is_file_node` to remove method stubs), Ambiguous Edges (every AMBIGUOUS edge listed for human review), Knowledge Gaps (isolated nodes + thin communities < 3 nodes + high-ambiguity flag if > 20% AMBIGUOUS), Suggested Questions. Each section is computed deterministically from the graph + analysis state. [SOURCE: external/graphify/report.py:1-155]

11. **The report explicitly distinguishes "the answer" from "review tasks".** Sections 1-6 (Corpus, Summary, God Nodes, Surprising Connections, Hyperedges, Communities) describe the graph; sections 7-9 (Ambiguous Edges, Knowledge Gaps, Suggested Questions) tell the human what to DO next. This is rare in graph reporting tools — most stop at "here's the graph". Graphify treats the report as a workflow primer, not a static export. The Knowledge Gaps section even fires a high-ambiguity warning at > 20% AMBIGUOUS, prompting users back to the Ambiguous Edges section. [SOURCE: external/graphify/report.py:103-141]

12. **The report cross-imports `_is_file_node` from `analyze.py`** to filter community member display (`report.py:88-94`) and ALSO imports `_is_file_node` and `_is_concept_node` for the Knowledge Gaps section (`report.py:115-120`). This means the same exclusion logic that drives god-node ranking also drives report rendering, ensuring consistent treatment of synthetic nodes across the analysis and presentation layers. Public should adopt this single-source-of-truth pattern if it builds analogous filters. [SOURCE: external/graphify/report.py:88; external/graphify/report.py:115; external/graphify/analyze.py:11-32]

13. **`graph_diff()` exists for incremental updates** (analyze.py:443-522). Compares two NetworkX snapshots and returns `{new_nodes, removed_nodes, new_edges, removed_edges, summary}` where `summary` is a human-readable string like "3 new nodes, 5 new edges, 1 node removed". Edge identity is `(source, target, relation)` tuple — so changing only confidence is NOT counted as a diff. This is the data layer underneath `watch.py` and the `/graphify --update` flow that iter 1 mapped. Public's incremental graph update path should consider the same identity-by-relation rule. [SOURCE: external/graphify/analyze.py:443-522]

## Leiden Clustering Algorithm (full trace)

```
cluster(G):
    if G.number_of_nodes() == 0:    return {}
    if G.number_of_edges() == 0:    return {i: [n] for each node n}    # all isolates

    isolates       = [n for n in G if degree(n) == 0]
    connected      = [n for n in G if degree(n) > 0]
    sub            = G.subgraph(connected)

    # Pass 1: Leiden on connected subgraph
    partition      = graspologic.leiden(sub)            # dict: node_id → cid
    raw            = group nodes by cid

    # Append isolates as single-node communities (continuing cid sequence)
    for isolate in isolates:
        raw[next_cid] = [isolate]
        next_cid += 1

    # Pass 2: Split oversized communities
    max_size       = max(10, int(N * 0.25))
    final          = []
    for nodes in raw.values():
        if len(nodes) > max_size:
            final.extend(_split_community(G, nodes))     # second Leiden pass on subgraph
        else:
            final.append(nodes)

    # Re-index by size descending — community 0 = largest
    final.sort(key=len, reverse=True)
    return {i: sorted(nodes) for i, nodes in enumerate(final)}
```

Properties:
- **Stable across runs**: community IDs are deterministic given graph topology (Leiden has internal randomness but graphify uses default seed; community 0 is always the largest by re-indexing).
- **Single-pass split**: if a subcommunity is still too large, it stays. Public should evaluate whether this is acceptable for its target corpus sizes.
- **No resolution parameter**: graphify uses graspologic's defaults. To change clustering granularity, users would have to fork the file.

## Suggested-Question Generation Logic (verbatim categories)

| Question Type | Trigger | Cap | Question Template |
|---|---|---|---|
| `ambiguous_edge` | Every edge with `confidence == "AMBIGUOUS"` | 1 per edge | "What is the exact relationship between `{u}` and `{v}`?" |
| `bridge_node` | Top 3 high-betweenness nodes (excluding file/concept nodes, > 0 betweenness) | 3 | "Why does `{label}` connect `{community_a}` to `{community_b}`?" |
| `verify_inferred` | Top 5 god nodes with ≥ 2 INFERRED edges | 5 | "Are the {N} inferred relationships involving `{label}` (e.g. with `{a}` and `{b}`) actually correct?" |
| `isolated_nodes` | Any non-file/non-concept node with degree ≤ 1 | 1 (lists first 3) | "What connects `{n1}`, `{n2}`, `{n3}` to the rest of the system?" |
| `low_cohesion` | Communities with cohesion < 0.15 AND ≥ 5 nodes | 1 per community | "Should `{label}` be split into smaller, more focused modules?" |
| `no_signal` (sentinel) | Returned only if all 5 generators produce nothing | 1 | (null question with explanatory `why`) |

Result is capped at `top_n=7` total questions across all types.

## Surprise-Score Components (verbatim from analyze.py:130-183)

| Component | Weight / Bonus | Trigger |
|---|---|---|
| Confidence weight | `+1` (EXTRACTED), `+2` (INFERRED), `+3` (AMBIGUOUS) | always (label-derived) |
| Cross file-type | `+2` | `_file_category(u_source) != _file_category(v_source)` (e.g., code↔paper) |
| Cross-repo | `+2` | `_top_level_dir(u_source) != _top_level_dir(v_source)` |
| Cross-community | `+1` | `node_community[u] != node_community[v]` (Leiden-distant) |
| Peripheral→hub | `+1` | `min(deg_u, deg_v) ≤ 2 AND max(deg_u, deg_v) ≥ 5` |
| Semantic-similarity multiplier | `×1.5` (rounded to int) | `relation == "semantically_similar_to"` |

Every active component appends a human-readable explanation to the `reasons` array, which becomes the `why` field in the output. Edges are sorted by total score and the top N (default 5) are returned. Structural edges (`imports`, `imports_from`, `contains`, `method`) are filtered out before scoring — they're never surprising.

## Knowledge Gaps Section (report.py:114-141)

```
gaps = []

# 1. Isolated nodes (degree ≤ 1, excluding file/concept stubs)
isolated = [n for n in G if degree(n) <= 1 and not _is_file_node(n) and not _is_concept_node(n)]
if isolated:
    gaps.append("**N isolated node(s)**: a, b, c (...) — possible missing edges")

# 2. Thin communities (< 3 nodes)
thin = {cid: nodes for cid, nodes in communities.items() if len(nodes) < 3}
for cid, nodes in thin.items():
    gaps.append(f"**Thin community `{label}`** (M nodes): a, b — too small to be meaningful")

# 3. High ambiguity (> 20% of edges)
if amb_pct > 20:
    gaps.append(f"**High ambiguity: {amb_pct}%** — review the Ambiguous Edges section")

if gaps: lines += ["", "## Knowledge Gaps", *gaps]
```

Public translation: this same three-signal pattern (isolation + thinness + uncertainty density) can be applied to any graph-backed retrieval system to surface "where coverage is weak" alongside "what's in the graph."

## Ruled Out

- **Looking for tunable Leiden parameters in graphify**: not available. There is no resolution, randomness seed, or modularity-objective override exposed at any level (CLI, skill, Python API). Users must fork `cluster.py` to tune. This is a deliberate simplicity choice but a constraint Public should know about before adopting graspologic for its own clustering.

- **Looking for recursive community splitting**: only one re-split pass exists. A community that survives the second Leiden pass at > 25% remains oversized. Public could improve on this by adding a recursive depth parameter, but should evaluate whether the added complexity matches user needs.

- **Looking for LLM calls during report generation**: there are zero. `report.py` is fully deterministic and only depends on the graph + community + cohesion + analysis state. This makes graphify's report cheap to regenerate and trivially testable — a property Public should preserve in any analogous output layer.

## Dead Ends

- **Hoping cluster IDs are stable across data updates**: they aren't. Re-indexing by size descending means adding a few nodes that grow community A past community B will swap their IDs. Public should NOT use community IDs as stable identifiers across runs; use community membership lookups via labels or content fingerprints.

## Sources Consulted

- `external/graphify/cluster.py:1-104` (full read)
- `external/graphify/analyze.py:1-522` (full read)
- `external/graphify/report.py:1-155` (full read)

## Assessment

- **New information ratio:** 0.95 (12 of 13 findings new beyond iter 3; finding 13 on `graph_diff` partially overlaps iter 1's mention of `watch.py` but extracts the actual identity rule)
- **Questions addressed:** Q5, Q10, Q6 (final piece — INFERRED average confidence in report)
- **Questions answered (fully):** Q5 (Leiden + 25%/min-10 split), Q10 (god nodes + surprising + ambiguous + suggested questions + report structure), Q6 (full evidence + confidence flow now traced through extraction → cache → merge → validate → build → cluster → analyze → report → export)
- **Questions partially advanced:** none new

## Reflection

- **What worked:** All three files (`cluster.py:104`, `analyze.py:522`, `report.py:155`) are small and self-contained. Reading them in one pass and cross-referencing the `_is_file_node` import chain revealed the consistency property between analysis and reporting that none of the files documents in isolation.
- **What did not work:** I initially expected the surprise score to be a single signal (confidence). It's actually a 6-factor composite — and the multiplier on `semantically_similar_to` is hidden inside `_surprise_score`, not advertised in any docstring. Public adopting this pattern needs the full source.
- **What I would do differently next iteration:** Continue the cluster→analyze→report pattern for the next module groups: PreToolUse hook + ingest/security for iter 5, multimodal/cache invalidation for iter 6, then start consolidating findings into the synthesis sections.

## Recommended Next Focus

Iteration 5 should resolve **Q9 (PreToolUse hook fire/payload/effect on Claude)** and **Q8 (cache invalidation strategy)** by reading `external/graphify/__main__.py` for the hook installer and payload, `external/graphify/watch.py` and `external/graphify/hooks.py` for the rebuild orchestration, and `external/graphify/cache.py` (already partially read in iter 3) for the SHA256 invalidation rules. Specifically: extract the exact JSON the hook injects into Claude's context, document when it fires (Glob|Grep matchers), trace the full rebuild path triggered by file save, and confirm what fraction of the graph can refresh without invoking Claude. This sets up iter 6 to look at multimodal extraction (Q7) — which is the last unanswered "how does it work?" question before iter 7-8 do credibility validation (Q11) and synthesis (Q12).
