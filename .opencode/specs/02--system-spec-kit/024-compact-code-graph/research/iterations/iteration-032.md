# Iteration 032: aider Repo-Map Implementation Analysis

## Focus

Analyze aider's open-source repo-map implementation in `Aider-AI/aider`, focusing on how it builds repository maps with tree-sitter, how its tag-based indexing works, how it handles scale and token budgets, and which design patterns are transferable to our planned code graph channel. Compare aider's approach against the previously researched Dual-Graph architecture to sharpen our clean-room implementation direction. [SOURCE: https://github.com/Aider-AI/aider/blob/main/aider/repomap.py] [SOURCE: https://github.com/Aider-AI/aider/blob/main/aider/coders/base_coder.py] [SOURCE: https://aider.chat/docs/repomap.html] [SOURCE: https://aider.chat/2023/10/22/repomap.html] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/research.md`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-001.md`]

## Findings

1. aider builds its repo map as an in-process prompt-construction pipeline, not as a standalone graph service.

   The core implementation lives in `aider/repomap.py` as the `RepoMap` class. `base_coder.py` creates one `RepoMap` instance per coder session, passing the repo root, token budget, model token counter, prompt prefix, refresh policy, and context-window info. On each turn, `base_coder.py` collects the currently added chat files, all other repo files, file-name mentions, and identifier mentions from the user's current message, then calls `repo_map.get_repo_map(...)`. The returned value is plain text, which aider injects into the LLM conversation as a synthetic user message before the actual task prompt. That means aider's "repo map" is not a persistent queryable graph API; it is a ranked, token-budgeted text summary generated just-in-time for prompt context. [SOURCE: https://github.com/Aider-AI/aider/blob/main/aider/coders/base_coder.py] [SOURCE: https://github.com/Aider-AI/aider/blob/main/aider/repomap.py] [SOURCE: https://github.com/Aider-AI/aider/blob/main/aider/coders/base_prompts.py] [SOURCE: https://aider.chat/docs/repomap.html]

2. aider uses tree-sitter by loading per-language `*-tags.scm` query files and running them against the parsed AST root.

   `get_tags_raw()` in `repomap.py` maps a file name to a language, gets the tree-sitter language and parser from `grep_ast.tsl`, loads a packaged query file via `get_scm_fname(lang)`, parses the file contents into a tree, and executes `Query(language, query_scm)` against `tree.root_node`. The query files come from aider's bundled `aider/queries/tree-sitter-language-pack/` directory, with fallback to `tree-sitter-languages/`. The article and docs confirm that aider moved from ctags to tree-sitter specifically to extract richer definitions, signatures, and context from source code. [SOURCE: https://github.com/Aider-AI/aider/blob/main/aider/repomap.py] [SOURCE: https://aider.chat/2023/10/22/repomap.html] [SOURCE: https://aider.chat/docs/repomap.html]

3. The queries are tag-oriented capture queries that focus on definitions and references, not full semantic analysis.

   The query contract is simple: aider looks for capture names that start with `name.definition.` or `name.reference.` and reduces them into two kinds of tags: `def` and `ref`. For Python, the bundled query matches assignment constants, `class_definition`, `function_definition`, and call sites. For JavaScript, the query is richer: it captures methods, classes, named functions, function-valued variable declarations, assignment-based function definitions, object-pair functions, call expressions, member calls, and `new` constructor references. The JavaScript query also strips doc-comment noise and associates adjacent doc blocks with definitions via query predicates such as `#strip!` and `#select-adjacent!`, although aider's ranking logic itself only consumes the captured identifier nodes and line numbers. [SOURCE: https://github.com/Aider-AI/aider/blob/main/aider/queries/tree-sitter-language-pack/python-tags.scm] [SOURCE: https://github.com/Aider-AI/aider/blob/main/aider/queries/tree-sitter-language-pack/javascript-tags.scm] [SOURCE: https://github.com/Aider-AI/aider/blob/main/aider/repomap.py]

4. aider's tag-based approach extracts a lightweight symbol/reference graph from AST captures, then ranks files and symbols with PageRank-style scoring.

   Internally, aider converts raw AST captures into `Tag(rel_fname, fname, line, name, kind)` tuples. It builds three main structures while scanning files: `defines[name] -> set(files)`, `references[name] -> list(files)`, and `definitions[(file, ident)] -> set(Tag)`. It then creates a `networkx.MultiDiGraph` whose nodes are files and whose weighted edges represent "this file references an identifier defined in that file." Identifier weighting is heuristic: user-mentioned identifiers get a 10x boost, long snake/camel/kebab names get another 10x, private identifiers are downweighted, and highly duplicated identifiers are downweighted. References from files already in chat get a 50x multiplier. After PageRank, aider redistributes node rank across outgoing edges and sums score per `(file, identifier)` pair, which is what actually drives which definitions survive into the final map. This is a very pragmatic file-level dependency graph synthesized from AST tags, not a full entity graph or control/data-flow graph. [SOURCE: https://github.com/Aider-AI/aider/blob/main/aider/repomap.py] [SOURCE: https://aider.chat/2023/10/22/repomap.html]

5. aider falls back gracefully when tree-sitter query coverage is incomplete.

   If a language query produces definitions but no references, aider does not stop there. It uses Pygments tokenization to backfill `ref` tags by extracting `Token.Name` occurrences from the file. This is a practical compatibility layer for languages whose `tags.scm` files only mark definitions. There is also a compatibility shim for different tree-sitter Python binding APIs (`Query.captures` versus `QueryCursor`). This tells us aider optimizes for broad, resilient symbol extraction rather than insisting on perfect AST semantics per language. [SOURCE: https://github.com/Aider-AI/aider/blob/main/aider/repomap.py]

6. aider handles large repositories with layered caching, refresh controls, and token-budget search rather than with persistent graph storage.

   There are two cache layers. First, file tags are cached on disk in `.aider.tags.cache.v{CACHE_VERSION}` using `diskcache`, keyed by file path and modification time; if SQLite-backed cache creation fails, aider falls back to an in-memory dict. Second, generated repo-map results are cached in-memory in `map_cache`, keyed by the chat file set, other file set, token budget, and, in `auto` mode, the mentioned files and identifiers too. There are additional in-memory `tree_cache` and `tree_context_cache` layers for rendered code snippets. For large repos, aider shows an initial scan progress bar when more than 100 files are uncached, warns users with more than 1000 tracked files to consider `--subtree-only` and `.aiderignore`, and can disable repo-map entirely on `RecursionError`. It also supports refresh policies (`manual`, `always`, `files`, `auto`). None of this is incremental graph maintenance in the database sense; it is on-demand recomputation with aggressive memoization. [SOURCE: https://github.com/Aider-AI/aider/blob/main/aider/repomap.py] [SOURCE: https://github.com/Aider-AI/aider/blob/main/aider/coders/base_coder.py] [SOURCE: https://github.com/Aider-AI/aider/issues/2394] [SOURCE: https://aider.chat/docs/repomap.html]

7. aider's output format is a prompt-oriented textual tree of ranked files plus "lines of interest," framed as read-only summaries for the AI.

   The final map is built by `to_tree()`, which groups ranked tags by file, calls `render_tree()` for files with selected definitions, and emits either a bare file name or `path:\n<snippet>` blocks. `render_tree()` uses `grep_ast.TreeContext` to render only the important lines and nearby structural context, not whole files. Long lines are truncated to 100 characters. `base_prompts.py` wraps the result with a repo-content prefix that explicitly tells the model these are read-only summaries and that it must ask to add files before editing them. `base_coder.py` then injects this as a `role="user"` message, immediately followed by a small assistant acknowledgement. The docs show the same presentation model: file paths followed by class/function signatures and minimal surrounding structure. [SOURCE: https://github.com/Aider-AI/aider/blob/main/aider/repomap.py] [SOURCE: https://github.com/Aider-AI/aider/blob/main/aider/coders/base_prompts.py] [SOURCE: https://github.com/Aider-AI/aider/blob/main/aider/coders/base_coder.py] [SOURCE: https://aider.chat/docs/repomap.html]

8. The most transferable patterns for our code graph channel are the AST-to-tag pipeline, file-level dependency ranking, token-budget pruning, and prompt-safe summarization boundary.

   aider demonstrates four especially reusable ideas:
   1. Per-language tree-sitter queries should extract a narrow contract first: definitions, references, and line anchors.
   2. File-level ranking from symbol references is often enough to outperform naive file lists, without needing a full-blown semantic graph.
   3. Token budget should be treated as a first-class optimization target; aider uses binary search over ranked entries to fit the active budget.
   4. Structural context and editable context should stay separate; aider tells the model repo-map files are read-only until explicitly promoted into full chat context.

   The main limitation we should not copy blindly is aider's final data shape: it collapses the graph into prompt text too early. For our MCP channel, we likely want to keep the structured graph in storage and make prompt summaries one possible projection of that graph, not the graph itself. [SOURCE: https://github.com/Aider-AI/aider/blob/main/aider/repomap.py] [SOURCE: https://github.com/Aider-AI/aider/blob/main/aider/coders/base_prompts.py] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/decision-record.md`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/research.md`]

9. aider is Apache 2.0 licensed, so we can safely reference its approach, but code/query reuse should still be deliberate and attributed.

   The repo license is Apache License 2.0, confirmed in both `LICENSE.txt` and `pyproject.toml`. The blog also notes that aider's bundled `tags.scm` files are modified from upstream tree-sitter grammars with their own licenses, mostly MIT plus some Apache-2.0. That means we can absolutely study and describe the approach, cite it in design docs, and implement a clean-room analogue. If we copy actual source code or query files, we need to preserve notices and comply with Apache-2.0 plus any relevant upstream grammar licenses. From our packet's perspective, this is a sharp contrast with Dual-Graph, whose core graph engine was found to be proprietary and therefore unsuitable as a dependency or extraction target. [SOURCE: https://github.com/Aider-AI/aider/blob/main/LICENSE.txt] [SOURCE: https://github.com/Aider-AI/aider/blob/main/pyproject.toml] [SOURCE: https://aider.chat/2023/10/22/repomap.html] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-001.md`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/decision-record.md`]

10. Compared with Dual-Graph, aider is simpler, more transparent, and easier to adapt, but it targets a narrower problem.

   Our earlier packet research described Dual-Graph as a three-stage system with persistent per-project graph data, session memory, MCP tools, and automatic context injection backed by a proprietary `graperoot` engine. aider, by contrast, is fully inspectable and prompt-centric: it computes a temporary structural map from tracked repo files, ranks it for the current turn, and injects it into the prompt. So aider is weaker than Dual-Graph on persistent graph services, explicit tool surfaces, and session-level graph memory, but much stronger as an open-source reference for the specific subproblem we care about now: building a clean, explainable, tree-sitter-based structural context layer. In other words, Dual-Graph is closer to an always-on graph product; aider is a strong OSS blueprint for a code graph channel's ingestion, ranking, and summarization stages. [SOURCE: https://github.com/Aider-AI/aider/blob/main/aider/repomap.py] [SOURCE: https://aider.chat/docs/repomap.html] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/research.md`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-001.md`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-007.md`]

## Evidence (cite sources/URLs)

- https://github.com/Aider-AI/aider/blob/main/aider/repomap.py
- https://github.com/Aider-AI/aider/blob/main/aider/coders/base_coder.py
- https://github.com/Aider-AI/aider/blob/main/aider/coders/base_prompts.py
- https://github.com/Aider-AI/aider/blob/main/aider/special.py
- https://github.com/Aider-AI/aider/blob/main/aider/queries/tree-sitter-language-pack/python-tags.scm
- https://github.com/Aider-AI/aider/blob/main/aider/queries/tree-sitter-language-pack/javascript-tags.scm
- https://github.com/Aider-AI/aider/blob/main/LICENSE.txt
- https://github.com/Aider-AI/aider/blob/main/pyproject.toml
- https://aider.chat/docs/repomap.html
- https://aider.chat/2023/10/22/repomap.html
- https://aider.chat/docs/usage.html
- https://github.com/Aider-AI/aider/issues/2394
- `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/research.md`
- `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-001.md`
- `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-007.md`
- `.opencode/specs/02--system-spec-kit/024-compact-code-graph/decision-record.md`

## New Information Ratio (0.0-1.0)

0.78

## Novelty Justification

Earlier packet work had already identified aider repo-map as a promising OSS analogue, but it stayed at the recommendation level. This iteration adds concrete implementation knowledge that was not previously captured in the packet: the exact `RepoMap` architecture, the `Tag` record shape, the `defines/references/definitions` indexing pattern, the `networkx.MultiDiGraph` PageRank pipeline, the token-budget binary search, the disk-backed mtime cache, the refresh modes, the AST query contract (`name.definition.*` and `name.reference.*`), and the prompt-injection mechanics in `base_coder.py`. That is a meaningful jump from "aider uses tree-sitter" to "here is the actual ingestion/ranking/rendering design we can adapt."

## Recommendations for Implementation

1. Use aider's AST contract as our phase-1 ingestion baseline: per-language queries should extract only definitions, references, and line anchors first. That is enough to build a useful structural channel quickly.

2. Keep aider's intermediate representation idea, but store it in our DB instead of collapsing immediately to prompt text. A normalized schema like `code_symbols`, `code_refs`, and `code_files` would preserve flexibility for search, ranking, and projection.

3. Reuse aider's ranking idea at the file level before attempting heavier entity-graph work. A file graph derived from symbol refs plus path/query personalization is likely the fastest path to a useful v1.

4. Copy the token-budget discipline, not the exact output path. Our channel should support a "repo brief" projection that uses binary search or top-k pruning to fit a requested token budget.

5. Adopt aider's cache instincts in a more MCP-native form: file mtime/content-hash invalidation, per-file tag cache, rendered-summary cache, and refresh modes. This should keep scans cheap without forcing full incremental graph maintenance on day 1.

6. Separate structural summaries from editable context, like aider does. The code graph channel should return read-only context candidates, while explicit promotion to full file content should remain a separate action or tool.

7. Do not copy aider's final limitation into our design. We should keep the graph as a first-class structured channel and treat prompt text as one consumer, while aider has to materialize text early because it operates inside an interactive coder prompt loop.

8. Treat aider as the open-source reference implementation for ingestion/ranking/rendering, and keep Dual-Graph as a product-pattern reference for lifecycle injection and persistent graph workflows. The clean-room design should blend the best of both without inheriting Dual-Graph's proprietary dependency risk. [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/decision-record.md`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/research.md`]
