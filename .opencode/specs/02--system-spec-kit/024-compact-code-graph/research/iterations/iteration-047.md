# Iteration 047: tree-sitter Structural Units ↔ CocoIndex Chunk Alignment

## Focus

Determine whether CocoIndex's semantic retrieval unit matches tree-sitter structural symbols closely enough for direct reuse in the compact code graph, or whether we need an explicit mapping layer between "semantic chunk" and "structural node."

## Findings

1. CocoIndex is not a true function-level index in the strict tree-sitter sense. The strongest repo-local evidence says CocoIndex uses a `RecursiveSplitter` with language-aware boundaries, a 1,000-character target chunk size, a 250-character minimum, and a 150-character overlap. It prefers function/class boundaries where possible, but it still falls back to line boundaries when no suitable structural boundary exists near the target size. That means the primary unit is a structure-aware text chunk, not a grammar-native symbol. Earlier packet phrasing like "function-level chunking" is directionally useful but technically overstated. Sources: `.opencode/skill/mcp-coco-index/SKILL.md:278-316`, `.opencode/skill/mcp-coco-index/references/settings_reference.md:142-160`, `.opencode/skill/mcp-coco-index/README.md:81-81`, `.opencode/specs/02--system-spec-kit/024-compact-code-graph/spec.md:44-45`, `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-033.md:11-19`

2. Tree-sitter boundaries and CocoIndex boundaries are therefore related but not identical. Tree-sitter gives exact grammar-defined node ranges for symbols such as `function_declaration`, `method_definition`, `class_definition`, `import_statement`, and `function_definition`, while CocoIndex gives retrieval windows that may align with those nodes but are not required to. In the best case, a chunk starts and ends on the same structural unit tree-sitter would extract. In the general case, the chunk is only approximately aligned to structure and may include surrounding context because chunk size and overlap still govern the split. Sources: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-038.md:27-47`, `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-038.md:49-147`, `.opencode/skill/mcp-coco-index/references/settings_reference.md:144-160`

3. A CocoIndex hit like "file X, lines 10-30" can usually be mapped to a tree-sitter node, but not reliably treated as the node itself. The MCP and CLI contracts return file path, line range, snippet, score, and language. That is enough to perform a second-stage lookup in our graph, but it only gives us a retrieval span, not an AST identity. The safe interpretation is "this span overlaps one or more structural nodes." The mapper should then resolve the best enclosing node, best-overlap node, or set of intersecting nodes rather than assuming a one-to-one correspondence. Sources: `.opencode/skill/mcp-coco-index/SKILL.md:310-317`, `.opencode/skill/mcp-coco-index/references/tool_reference.md:266-272`, `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-038.md:38-47`

4. Misalignment is expected, not exceptional. CocoIndex can split inside a large function because the chunker targets character windows with overlap; it can merge neighboring small symbols because chunks under 250 characters are merged; and it can keep imports/includes together as a single chunk even when tree-sitter would model them as multiple nodes. When that happens, the graph should model three outcomes: exact match, enclosing-node match, and multi-node overlap. We should never equate "semantic chunk" with "graph node" in storage or API contracts. Sources: `.opencode/skill/mcp-coco-index/references/settings_reference.md:146-159`, `.opencode/skill/mcp-coco-index/SKILL.md:286-290`, `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-033.md:15-19`

5. The two systems should not be normalized to the same primary unit. The code graph should remain tree-sitter-first and symbol-native, because its job is exact structural relations: imports, exports, containment, calls, and hierarchy. CocoIndex should remain chunk-first and semantic, because its job is recall by meaning. Forcing the graph onto CocoIndex chunks would weaken structural precision; forcing CocoIndex onto exact symbol units would likely reduce retrieval robustness for long bodies, adjacent context, and languages with weak symbol boundaries. The right design is hybrid: semantic candidate generation from CocoIndex, structural interpretation from tree-sitter. Sources: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-033.md:15-23`, `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-039.md:262-266`, `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-038.md:166-185`

6. "Function-level" is a good default retrieval mental model, but not a universal schema. Tree-sitter research already showed that Shell has no class/type layer and treats `source` / `.` includes and export-like declaration commands as conventions, not first-class module constructs. Python has explicit function and class definitions, but export behavior is convention-based (`__all__`) and top-level executable module code may matter even when it is not wrapped in a function. For these languages, the graph should support pseudo-units such as file/module nodes plus language-specific structural nodes, rather than expecting every relevant behavior to live inside a function symbol. Sources: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-038.md:95-123`, `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-038.md:125-146`, `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-038.md:176-183`

7. The graph needs explicit range metadata to make CocoIndex-to-node mapping fast and deterministic. Minimum useful fields are: normalized file path, node ID, node kind, symbol name, parent node ID, start line, end line, start byte, end byte, and parser-health flags. Start/end bytes matter because tree-sitter is byte-oriented and because line ranges can collide when multiple short nodes share nearby lines. Start/end lines matter because CocoIndex exposes line spans, not byte spans. With both, we can do an indexed "file + overlapping interval" lookup and rank candidates by containment, overlap ratio, and node priority. Sources: `.opencode/skill/mcp-coco-index/references/tool_reference.md:266-272`, `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-038.md:17-25`, `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-038.md:148-154`

8. A shared "source map" is feasible, but it should be a bridge table, not a shared primary index. CocoIndex's public search contract exposes only file path, lines, snippet, score, and language; it does not expose a stable chunk ID in the MCP docs. So if we want persistent chunk-to-node linkage, we likely need our own synthetic mapping key such as `(file_path, line_start, line_end, snippet_hash)` plus overlap metadata. The better long-term design is a lightweight mapping table that records how external semantic spans intersect internal structural nodes. That keeps CocoIndex replaceable, preserves graph independence, and still gives us fast post-search expansion. Sources: `.opencode/skill/mcp-coco-index/references/tool_reference.md:266-285`, `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-033.md:17-23`

## Evidence

- `.opencode/skill/mcp-coco-index/SKILL.md:278-316` documents the indexing pipeline, including `RecursiveSplitter`, 1,000-character chunks, 250-character minimum, 150-character overlap, function/class preservation "where possible," and line-range output.
- `.opencode/skill/mcp-coco-index/references/settings_reference.md:142-160` adds the strongest chunk-boundary detail: built-in chunking, line-boundary fallback, and import/include-block preservation.
- `.opencode/skill/mcp-coco-index/references/tool_reference.md:241-272` defines the public search response shape as file path, line range, snippet, score, and language, with no stable node or chunk identity in the MCP contract.
- `.opencode/skill/mcp-coco-index/README.md:81-81` and `.opencode/skill/mcp-coco-index/README.md:133-139` confirm that retrieval operates over code chunks and that language/path filters are applied after semantic ranking.
- `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-038.md:27-47` establishes tree-sitter's symbol extraction model as grammar-specific captured nodes rather than fuzzy windows.
- `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-038.md:49-147` gives the concrete symbol categories we care about across JS/TS, Python, and Shell.
- `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-038.md:148-185` supports storing parser-health and change-range metadata because recovered parses and grammar-specific limits affect mapping confidence.
- `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-033.md:11-23` already established, correctly, that CocoIndex is chunk-embedding retrieval rather than AST traversal and that the overlap with a code graph is partial rather than total.
- `.opencode/specs/02--system-spec-kit/024-compact-code-graph/spec.md:44-46` is the packet line that currently says "function-level chunking"; it should be read as shorthand, not literal AST equivalence, in light of the stronger CocoIndex evidence above.

## New Information Ratio (0.0-1.0)

0.68

## Novelty Justification

Earlier packet work already separated CocoIndex semantic retrieval from the planned structural code graph, and iteration 038 already established how tree-sitter defines symbols. The new value here is the alignment layer itself: this iteration resolves the ambiguity hidden inside the phrase "function-level chunking," shows that CocoIndex is actually structure-aware character chunking, and turns that into concrete mapping rules, storage requirements, and API guidance for our implementation.

## Recommendations for Our Implementation

1. Treat tree-sitter nodes as the source of truth for graph identity. Do not store CocoIndex chunks as graph nodes.

2. Correct packet language from "function-level chunking" to "structure-aware chunking that prefers function/class boundaries" anywhere precision matters.

3. Implement a `resolveSemanticHitToNodes(file_path, line_start, line_end)` layer that returns:
   - exact node match when ranges coincide,
   - best enclosing node,
   - best-overlap node,
   - intersecting sibling nodes when a chunk spans multiple symbols.

4. Store both line and byte ranges on every code node, plus parent/container metadata and parser-health flags.

5. Add a lightweight bridge table for semantic-hit mapping, for example:
   - `file_path`
   - `chunk_line_start`
   - `chunk_line_end`
   - `snippet_hash`
   - `best_node_id`
   - `match_kind` (`exact`, `enclosing`, `overlap`, `multi`)
   - `overlap_ratio`

6. Model file/module pseudo-nodes explicitly so Python module-level code and Shell top-level behavior have a structural home even when no function symbol exists.

7. Use CocoIndex for candidate recall and tree-sitter for structural expansion/reranking. That preserves the complementarity the packet already wants instead of collapsing both concerns into one compromised unit.
