# Iteration 004 — Integration Feasibility: Extracting Dual-Graph Logic

**Focus:** Can we extract/replicate graperoot's code graph logic?
**Status:** complete
**newInfoRatio:** 0.78
**Novelty:** This iteration adds live PyPI/package evidence, inspectability constraints, and a clean-room integration path that was not covered in the repo-only analysis from iteration 001.

---

## Findings

### 1. `graperoot` is a real PyPI package, but it was not installed locally in this environment

- Local verification:
  - `python3 -m pip show graperoot` returned `Package(s) not found: graperoot`
  - `python3 -m pip install graperoot --dry-run` could not complete because this sandbox has no outbound package-network access
- Live PyPI verification:
  - The package exists at `https://pypi.org/project/graperoot/`
  - Latest visible version: `3.8.92`
  - Release date on PyPI: `March 21, 2026`
  - Metadata summary: "GrapeRoot — graph-based context engine for AI coding agents"
  - Requires `Python >=3.10`
  - License metadata is explicitly `Proprietary`
  - PyPI shows a `Programming Language :: Cython` classifier
  - PyPI currently shows a source distribution tarball (`graperoot-3.8.92.tar.gz`, 615.9 kB)

### 2. The package is probably at least partially inspectable, but not confirmed as plain readable Python

- Important nuance: PyPI is not showing a platform wheel on the public package page, only a source tarball.
- That means `graperoot` is not obviously a binary-only black box in the way a compiled wheel would be.
- However, the `Cython` classifier is a strong signal that the implementation may be:
  - `.pyx` Cython source
  - generated C from Cython
  - mixed Python/Cython packaging
  - partially source-visible but intentionally harder to port cleanly
- Because I could not download the tarball from this sandbox, I could not confirm whether the archive contains:
  - normal `.py` files
  - `.pyx`/`.pxd` files
  - generated C
  - obfuscated code
- So the best evidence-backed conclusion is:
  - `graperoot` is not proven to be opaque binary-only
  - `graperoot` is also not proven to be clean, directly reusable Python source
  - direct extraction risk remains high

### 3. License restrictions are the main blocker to "extract and integrate"

- PyPI marks the core package as `Proprietary`.
- Iteration 001 already established that the open GitHub repo exposes launchers, install scripts, benchmarks, and dashboards, while the core graph engine lives in `graperoot`.
- That creates a clear split:
  - public repo artifacts: inspectable wrapper/integration surface
  - core graph engine: proprietary package
- Engineering implication:
  - Even if the source tarball is readable, that does not make it safe to copy or port into our TypeScript MCP server.
  - The acceptable path is a clean-room reimplementation based on public behavior and product claims, not code extraction.
- Conclusion: "Can we extract their logic?" is legally and operationally the wrong frame. "Can we reproduce the concept cleanly?" is the viable frame.

### 4. The core concept is technically reproducible without `graperoot`

The underlying idea is not magical. It is a structural code graph plus session-memory weighting:

1. Parse source files
2. Extract nodes such as files, modules, classes, functions, symbols
3. Extract edges such as imports, containment, references, and optionally calls
4. Rank candidates for a query using graph locality plus recent session activity
5. Fuse that signal with other retrieval methods

Open-source building blocks exist for this:

- `tree-sitter`
  - Multi-language parser infrastructure that yields syntax trees and nodes
  - Best fit for a cross-language structural index
- Python `ast`
  - Standard-library AST support for Python
  - Good for Python-only extraction of imports, classes, functions, and definitions
- `ts-morph`
  - TypeScript Compiler API wrapper for programmatic navigation of TS/JS code
  - Strong fit for symbol-aware graphs in our predominantly TypeScript codebase
- `dependency-cruiser`
  - Purpose-built JS/TS dependency graph generator and validator
  - Fastest route to a file/module import graph
- `madge`
  - Mature dependency graph and cycle-detection tool for module graphs
  - Useful for quick dependency graph extraction and visualization

Practical constraint:

- Cross-language import graphs are straightforward.
- Cross-language call graphs are much harder because dynamic dispatch, metaprogramming, and language-specific semantics reduce precision.
- So a realistic v1 should target:
  - file nodes
  - symbol nodes
  - import edges
  - contains/declares edges
  - optional lightweight reference edges
- A full "semantic call graph" should be treated as a later phase, not the extraction baseline.

### 5. A code graph is orthogonal to our current embedding-based retrieval, not a replacement

Our existing Spec Kit Memory MCP already has a multi-channel retrieval architecture:

- `hybrid-search.ts` combines vector, FTS, and BM25 channels, then fuses/reranks them.
- `query-router.ts` already routes among five channels: `vector`, `fts`, `bm25`, `graph`, and `degree`.
- But the current `graph` channel is not a code graph. It is a memory graph:
  - `graph-search-fn.ts` explicitly says "Causal graph search channel"
  - it ranks memory nodes via `causal_edges` and spec-folder hierarchy, not source-code AST relationships

That means Dual-Graph's "code map" idea fits as a new structural signal alongside our current system:

- embeddings answer semantic similarity and fuzzy intent
- FTS/BM25 answer lexical/spec-document retrieval
- memory graph answers causal/history relationships between memories
- code graph would answer structural questions:
  - what imports this file?
  - what symbols live here?
  - what files are likely impacted by this edit?
  - what neighbors should be read next?

So yes, they can coexist cleanly. In fact, our architecture is already better suited to coexistence than replacement because it already expects multiple ranked channels.

### 6. Our repo already has AST-friendly precedent, which lowers implementation risk

Two internal signals matter here:

- We already ship an AST-aware markdown chunker in `shared/lib/structure-aware-chunker.ts`
- We already document a deferred AST retrieval feature in the feature catalog:
  - `read_spec_section(filePath, heading)` via Markdown AST parsing with `remark`

That does not mean we already have code-graph infrastructure.
It does mean the system already accepts the pattern of:

- parse structure first
- preserve meaningful boundaries
- use structure as a retrieval aid

So a code graph would be an extension of an existing design philosophy, not a foreign architectural direction.

### 7. Feasibility verdict

#### A. Can we extract `graperoot` logic directly?

Not responsibly.

- Technical status: maybe partially inspectable, but unconfirmed from this sandbox
- Legal status: proprietary, so direct extraction/porting is the wrong path
- Maintenance status: even a successful reverse-port would tie us to an opaque upstream we do not control

#### B. Can we replicate the useful parts ourselves?

Yes.

And our system is a good host for it because we already have:

- SQLite
- retrieval channel routing
- multi-channel fusion
- reranking
- session/history signals
- MCP tooling surface for code/memory workflows

#### C. Best integration model

Build a clean-room `code_graph` channel rather than replacing the current memory stack.

Recommended shape:

- separate SQLite tables, for example:
  - `code_nodes`
  - `code_edges`
  - `code_symbols`
- start with TypeScript/JavaScript first
  - `ts-morph` if we want symbol-level precision
  - `dependency-cruiser` or `madge` if we want a fast import-graph proof of concept
- map nodes back to file paths and symbol spans
- expose code-graph retrieval only for queries where structure matters:
  - impact analysis
  - follow imports
  - find neighboring files
  - what should I read next after editing X?
- fuse this channel with existing vector/FTS/BM25 rather than replacing them

Bottom line:

- **Do not try to transplant `graperoot`.**
- **Do build a clean-room structural graph channel.**
- **Treat Dual-Graph as a product inspiration, not a code donor.**

## Dead Ends

- Direct local package inspection was blocked by sandbox networking:
  - `pip show` only proved `graperoot` is not installed here
  - `pip install --dry-run` failed before package resolution because outbound access to PyPI was unavailable
- I could not inspect the contents of `graperoot-3.8.92.tar.gz` directly, so the inspectability conclusion is based on PyPI metadata, not archive contents.
- I could not verify whether the source tarball contains plain `.py`, `.pyx`, generated C, or some obfuscated variant; that remains an open evidence gap.

## Sources

- [SOURCE: specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-001.md] — prior repo-level Dual-Graph analysis
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts] — current multi-channel retrieval/fusion architecture
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts] — active retrieval channel set (`vector`, `fts`, `bm25`, `graph`, `degree`)
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts] — current graph channel is causal-memory graph, not code graph
- [SOURCE: .opencode/skill/system-spec-kit/shared/lib/structure-aware-chunker.ts] — existing AST-aware structural parsing precedent
- [SOURCE: .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/07-ast-level-section-retrieval-tool.md] — documented AST parsing direction already exists in product planning
- [SOURCE: https://pypi.org/project/graperoot/] — package existence, release metadata, license metadata, classifier, and distribution format
- [SOURCE: https://graperoot.dev/] — public product claims for code map, action graph, dependency awareness, and impact analysis
- [SOURCE: https://tree-sitter.github.io/tree-sitter/using-parsers/1-getting-started.html] — cross-language syntax-tree foundation
- [SOURCE: https://docs.python.org/3/library/ast.html] — Python standard-library AST capabilities
- [SOURCE: https://github.com/dsherret/ts-morph] — TS/JS symbol-aware static analysis wrapper over the TypeScript compiler API
- [SOURCE: https://www.npmjs.com/package/dependency-cruiser/v/12.2.0] — JS/TS dependency graph generation and validation
- [SOURCE: https://www.npmjs.com/package/madge] — module dependency graph generation and circular-dependency analysis
