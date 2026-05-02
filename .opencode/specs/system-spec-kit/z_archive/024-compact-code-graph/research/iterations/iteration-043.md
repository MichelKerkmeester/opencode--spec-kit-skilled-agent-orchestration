# Iteration 043: Open-Source Code Graph Tools Survey

## Focus

Survey open-source code graph and code-intelligence tools that could inform a future code-graph retrieval channel for our MCP server. The emphasis for this iteration is:

- breadth of the OSS landscape,
- maintenance status in 2025-2026,
- embeddability as libraries versus CLI-only tools,
- license and integration posture,
- Node.js/TypeScript fit,
- practical recommendation for our existing hybrid-search architecture.

## Findings (numbered)

1. The landscape splits into five distinct categories, and only one of them is a strong primary foundation for a multi-language MCP code-graph channel.

   | Tool | Primary role | Multi-language? | Importable library? | Node.js / TS / npm story | License | 2025-2026 status | Integration posture |
   | --- | --- | --- | --- | --- | --- | --- | --- |
   | tree-sitter | Incremental parser + CST/AST foundation | Yes, via separate grammars | Yes | Strong: `tree-sitter` npm package, Wasm binding, embeddable C core | MIT | Active | Excellent base layer |
   | ast-grep | Structural search / lint / rewrite on top of tree-sitter | Yes, but rules are per-language | Yes-ish, but more query/manipulation API than graph toolkit | Good: npm install path, JS-facing API surface in project | MIT | Active | Strong query layer, not primary graph store |
   | Semgrep CE | Pattern-based static analysis | Yes, 30+ languages | Mostly CLI / engine, not a Node-native graph library | Weak for Node embedding | LGPL-2.1 | Active | Useful rule engine, not ideal graph backbone |
   | CodeQL | Semantic security analysis with query libraries | Multi-language, curated set | Yes inside CodeQL ecosystem, but not as a normal Node runtime lib | Weak for Node embedding | MIT repo for libraries/queries; CLI licensed separately | Active | Powerful but heavy and license-sensitive |
   | Sourcetrail | GUI source explorer + SDK | Limited set | SDK exists (`SourcetrailDB`) | No meaningful Node path | GPL-3.0 | Archived | Not recommended |
   | universal-ctags | Symbol/tag indexer | Yes, very broad | C-level `libreadtags`, mainly tool-first | No first-class Node path | GPL-2.0 | Active | Good fallback/external tool, not best in-process core |
   | ts-morph | TS Compiler API wrapper | JS/TS only | Yes | Excellent: first-class TS library | MIT | Active | Excellent TS/JS enrichment layer |
   | jscodeshift | Codemod runner + AST transform API | JS/TS family | Yes | Excellent: npm, codemod API | MIT | Active | Good transform/query layer, not graph backbone |
   | recast | AST transform + printer | JS/TS family | Yes | Excellent: npm, importable parse/print API | MIT | Slower / less clearly active | Great utility library, not graph engine |
   | dependency-cruiser | Dependency graph validation/visualization | JS/TS/CoffeeScript family | Yes | Excellent: npm, TS types, API docs | MIT | Very active | Best JS/TS file-dependency adapter |
   | madge | Module dependency graph | JS/TS-ish module graph | Yes | Good: npm library/CLI | MIT | Slower / unclear | Fine quick graph tool, shallow semantics |
   | Pyright | Python type checker / analyzer | Python only | Package exists, but library embedding is secondary | npm package exists | Permissive Microsoft OSS license in repo; npm-distributed | Active | Strong Python-only enrichment, not multi-language core |
   | mypy | Python type checker | Python only | Python package, library use possible but CLI-first | No npm path | MIT | Active | Strong Python-only enrichment |
   | rust-analyzer | Rust LSP + analysis libraries | Rust only | Yes, internally library-structured | No npm path | MIT OR Apache-2.0 | Very active | Excellent Rust-only enrichment |
   | gopls | Go LSP + analyzers | Go only | Mostly command/service-first, with internal packages | No npm path | BSD-3-Clause | Active | Excellent Go-only enrichment |

   The big takeaway is that `tree-sitter` is the best foundational parser substrate, while the others mostly sit in one of three roles: query layer (`ast-grep`, `Semgrep`), language-specific enrichers (`Pyright`, `mypy`, `rust-analyzer`, `gopls`, `ts-morph`), or dependency/symbol adapters (`dependency-cruiser`, `madge`, `universal-ctags`).

2. The projects that are clearly actively maintained in 2025-2026 are: `tree-sitter`, `ast-grep`, `Semgrep`, `CodeQL`, `universal-ctags`, `ts-morph`, `jscodeshift`, `dependency-cruiser`, `Pyright`, `mypy`, `rust-analyzer`, and `gopls`.

   Current activity signals from official release pages and package indexes:

   - `tree-sitter`: latest GitHub release `v0.26.7` on March 14, 2026.
   - `ast-grep`: latest GitHub release `0.42.0` on March 16, 2026.
   - `Semgrep`: latest GitHub release `v1.156.0` on March 17, 2026.
   - `universal-ctags`: latest GitHub release `6.2.1` on October 25, 2025.
   - `ts-morph`: latest GitHub release `27.0.2` on October 12, 2025, and npm package activity remained recent.
   - `jscodeshift`: latest GitHub release `v17.3.0` on March 24, 2025.
   - `dependency-cruiser`: latest GitHub release `v17.3.10` on March 26, 2026.
   - `Pyright`: latest GitHub release `1.1.408` on January 8, 2026.
   - `mypy`: PyPI released `1.19.1` on December 15, 2025, with frequent 2025 releases.
   - `rust-analyzer`: latest GitHub release `2026-03-30` on March 30, 2026.
   - `gopls`: pkg.go.dev shows a February 10, 2026 publication on the Go package site.

   The tools that look materially weaker on current maintenance evidence are:

   - `Sourcetrail`: archived on December 14, 2021.
   - `recast`: still popular and widely used, but its public GitHub release stream is old (`v0.21.1`, April 27, 2022), so I would treat it as usable but slower-moving.
   - `madge`: still useful, but its surfaced repo metadata looks much less obviously current than the tools above; I would classify it as viable but not a strategic core dependency.

3. The best importable libraries, as opposed to tool-first CLIs, are `tree-sitter`, `ts-morph`, `recast`, `jscodeshift`, and `dependency-cruiser`.

   - `tree-sitter` is the strongest embeddable substrate because it is explicitly designed to be embedded in other applications, exposes Rust and Wasm bindings, and has a clean Node package.
   - `ts-morph` has the best TypeScript-first API quality of the set. If we were building a JS/TS-only graph channel, it would be a top contender.
   - `recast` and `jscodeshift` are high-quality AST utilities for JS/TS transforms and structural analysis, but they are centered on ESTree and code mods, not on multi-language graph storage or cross-language indexing.
   - `dependency-cruiser` is an underrated candidate because it already has a useful API and battle-tested dependency extraction for JS/TS projects.
   - `ast-grep` is importable enough to be useful, but its center of gravity is still structural matching/rules rather than graph construction.

   By contrast:

   - `Semgrep`, `CodeQL`, `universal-ctags`, `madge`, `mypy`, `rust-analyzer`, and `gopls` are better treated as external tools or optional sidecar analyzers than as the main in-process library inside a TypeScript MCP server.

4. License posture matters a lot, and it narrows the practical shortlist.

   Low-friction, permissive options:

   - `tree-sitter` — MIT
   - `ast-grep` — MIT
   - `CodeQL` repo contents — MIT
   - `ts-morph` — MIT
   - `jscodeshift` — MIT
   - `recast` — MIT
   - `dependency-cruiser` — MIT
   - `madge` — MIT
   - `mypy` — MIT
   - `rust-analyzer` — dual MIT / Apache-2.0
   - `gopls` — BSD-3-Clause

   Higher-friction options:

   - `Semgrep CE` — LGPL-2.1. This is not a blocker, but it is less attractive for tight in-process embedding and redistribution than MIT/Apache/BSD tools. It is safer as an external analyzer or optional dependency.
   - `universal-ctags` — GPL-2.0. Good as a separate executable or optional external tool, but not my first choice for a deeply embedded core dependency.
   - `Sourcetrail` — GPL-3.0 and archived, so both legally and operationally unattractive.
   - `CodeQL CLI` — the repo for libraries and queries is MIT, but GitHub’s own documentation says the CLI/engine is licensed separately, and analyzing closed-source code requires a separate commercial license. That makes CodeQL a poor primary dependency for a general MCP code-graph channel.

   This is not legal advice, but from an engineering-risk perspective the cleanest integration path is to prefer MIT / Apache / BSD components for the primary channel, then keep any copyleft or separately licensed tools behind optional adapters or external-process boundaries.

5. Multi-language coverage and Node/TS ergonomics point to a clear split between “foundation” tools and “specialist” tools.

   Best multi-language foundations:

   - `tree-sitter`: broad grammar ecosystem, incremental parsing, embeddable runtime.
   - `ast-grep`: broad tree-sitter-backed coverage, but query/rule oriented.
   - `Semgrep`: broad language coverage, especially for rule scanning.
   - `universal-ctags`: extremely broad symbol coverage, but coarse.
   - `CodeQL`: broad but curated language set, with deep semantics and heavy setup.

   Best Node/TypeScript-native choices:

   - `tree-sitter`
   - `ts-morph`
   - `jscodeshift`
   - `recast`
   - `dependency-cruiser`
   - `madge`
   - `pyright` (because it ships on npm, even though it is Python-specific)

   Single-language specialists worth using only as enrichers:

   - `Pyright`, `mypy`
   - `rust-analyzer`
   - `gopls`

6. On speed, accuracy, language coverage, and API quality, the tools are not competing for exactly the same job.

   Practical comparison:

   - Fastest parsing substrate: `tree-sitter`
     - Strength: incremental parsing, robust syntax-error tolerance, embeddable runtime.
     - Weakness: no graph model out of the box; we must build symbol/import/xref extraction ourselves.

   - Best structural query ergonomics: `ast-grep`
     - Strength: developer-friendly pattern search and rewrite on real ASTs, multi-core compiled core.
     - Weakness: not a complete semantic engine; best as query layer atop a graph, not as the graph itself.

   - Best semantic depth: `CodeQL`
     - Strength: richest query libraries and semantic analysis among the surveyed tools.
     - Weakness: heavy extraction/database workflow, separate CLI licensing, not Node-native.

   - Best rule-engine ergonomics: `Semgrep`
     - Strength: easy rule authoring, broad language support, very active.
     - Weakness: even Semgrep’s own README says Community Edition misses many security true positives and is limited relative to the commercial platform for cross-file/cross-function data flow; also not graph-native.

   - Broadest cheap symbol extraction: `universal-ctags`
     - Strength: very broad language support and low cost.
     - Weakness: symbol tags are much less accurate and structurally faithful than AST or type-based systems.

   - Best JS/TS API quality: `ts-morph`
     - Strength: excellent TypeScript Compiler API wrapper for navigation and manipulation.
     - Weakness: JS/TS only, heavier than tree-sitter for a multi-language strategy.

   - Best JS/TS dependency graphing: `dependency-cruiser`
     - Strength: real dependency graph plus validation, active maintenance, API/docs, direct npm fit.
     - Weakness: file/module dependency layer only, not symbol/xref layer.

   - Lightweight JS/TS dependency graphing: `madge`
     - Strength: easy to use.
     - Weakness: shallower than dependency-cruiser and less compelling as a long-term foundation.

   - Highest language accuracy within one language: `Pyright`, `mypy`, `rust-analyzer`, `gopls`
     - Strength: type-aware and IDE-grade in their own ecosystems.
     - Weakness: each one brings a language silo, service/runtime complexity, and inconsistent embedding ergonomics.

7. The best answer to “which tools should power our MCP code graph channel?” is not one tool. It is a layered stack.

   Best-fit stack for our MCP server:

   1. `tree-sitter` as the primary parser and graph-ingestion substrate.
   2. Our own clean-room graph schema and ranking logic in the MCP server.
   3. `ast-grep` patterns as an optional structural-query layer for search and heuristics.
   4. `dependency-cruiser` as an optional JS/TS adapter for file/module dependency validation and bootstrapping.
   5. `universal-ctags` only as a fallback for unsupported grammars or as a low-fidelity bootstrap path.
   6. Language-specific enrichers (`ts-morph`, `Pyright`, `rust-analyzer`, `gopls`) only where there is enough ROI to justify the complexity.

   I would explicitly avoid making `Semgrep`, `CodeQL`, `madge`, or `Sourcetrail` the core engine:

   - `Semgrep` is rule-first, not graph-first.
   - `CodeQL` is powerful but too heavy and license-sensitive for the primary path.
   - `madge` is too shallow.
   - `Sourcetrail` is archived.

8. This recommendation fits our local architecture unusually well because the MCP server already exposes a graph-capable hybrid search pipeline.

   Local repo evidence from this packet and current codebase:

   - The packet’s decision record already says code graph should be its own clean-room effort, separate from compact/hook work.
   - `context-server.ts` already advertises channels including `vector`, `fts5`, `bm25`, `graph`, and `degree`.
   - The MCP README already describes a five-channel fused retrieval architecture.
   - Earlier packet research correctly observed that the current `graph` channel is a causal-memory graph, not a code-structure graph.

   That means we do not need a greenfield search architecture. We need a new structural data source and ranking layer that plugs into an already multi-channel system. In other words, the real architectural decision is not “do we build graph search?” but “what ingestion substrate best feeds the existing fusion pipeline?” On that question, `tree-sitter` is the strongest answer.

9. A concise implementation ranking for our purposes is:

   | Rank | Recommendation | Why |
   | --- | --- | --- |
   | 1 | `tree-sitter` + clean-room graph channel | Best blend of speed, embeddability, multi-language reach, permissive license, and TS-server fit |
   | 2 | `tree-sitter` + `ast-grep` companion layer | Best if we want both graph ingestion and structural query ergonomics |
   | 3 | `tree-sitter` + `dependency-cruiser` for JS/TS enrichment | Best hybrid if early value in JS/TS dependency edges matters |
   | 4 | `ts-morph` for a JS/TS-only first phase | Strong if we deliberately scope v1 to TS-heavy repos |
   | 5 | `universal-ctags` fallback adapter | Useful for breadth, but too low-fidelity for primary ranking |
   | 6 | `Semgrep` sidecar analyzer | Good for pattern/rule signals, not for the main graph |
   | 7 | `CodeQL` sidecar for niche high-value analysis | Powerful, but operationally and legally heavy |

## Evidence (cite sources/URLs)

- Local repo / packet evidence
  - `.opencode/specs/system-spec-kit/024-compact-code-graph/decision-record.md`
  - `.opencode/skill/system-spec-kit/mcp_server/context-server.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/README.md`
  - `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-007.md`

- tree-sitter
  - https://github.com/tree-sitter/tree-sitter
  - https://www.npmjs.com/package/tree-sitter/v/0.22.3?activeTab=dependencies

- ast-grep
  - https://github.com/ast-grep/ast-grep
  - https://ast-grep.github.io/
  - https://ast-grep.github.io/advanced/faq.html

- Semgrep
  - https://github.com/semgrep/semgrep
  - https://semgrep.dev/docs/

- CodeQL
  - https://github.com/github/codeql
  - https://docs.github.com/code-security/codeql-cli/about-the-codeql-cli#about-the-github-codeql-license
  - https://codeql.github.com/docs/codeql-overview/supported-languages-and-frameworks/

- Sourcetrail
  - https://github.com/CoatiSoftware/Sourcetrail

- universal-ctags
  - https://github.com/universal-ctags/ctags

- ts-morph
  - https://github.com/dsherret/ts-morph
  - https://www.npmjs.com/package/ts-morph

- jscodeshift
  - https://github.com/facebook/jscodeshift

- recast
  - https://github.com/benjamn/recast

- dependency-cruiser
  - https://github.com/sverweij/dependency-cruiser
  - https://www.npmjs.com/package/dependency-cruiser

- madge
  - https://github.com/pahen/madge

- Pyright
  - https://github.com/microsoft/pyright
  - https://www.npmjs.com/package/pyright

- mypy
  - https://github.com/python/mypy
  - https://pypi.org/project/mypy/

- rust-analyzer
  - https://github.com/rust-lang/rust-analyzer
  - https://rust-analyzer.github.io/

- gopls
  - https://pkg.go.dev/golang.org/x/tools/gopls
  - https://github.com/golang/tools/releases

## New Information Ratio (0.0-1.0)

0.74

## Novelty Justification

Earlier packet work already identified `tree-sitter`, aider repo-map, and a clean-room code-graph direction as promising. What is new in this iteration is the broader 2025-2026 market survey and the decision-quality comparison across license, embeddability, maintenance status, Node/TypeScript fit, and integration risk. This iteration also sharpens the recommendation from “tree-sitter seems best” to a more concrete layered architecture: `tree-sitter` as the core parser, optional `ast-grep` query layer, optional `dependency-cruiser` JS/TS adapter, and selective language-server/type-checker enrichment later.

## Recommendations for Our Implementation

1. Build the future code-graph channel on `tree-sitter`, not on `Semgrep`, `CodeQL`, `madge`, or `Sourcetrail`.

2. Keep the design clean-room and TypeScript-native:
   - parse files with `tree-sitter`,
   - extract symbols, imports, exports, references, and file-level edges,
   - persist them in SQLite alongside current MCP search data,
   - expose them as a new structural retrieval input to the existing fusion pipeline.

3. Add `ast-grep` later if we want a developer-friendly structural-query layer for:
   - “find similar implementation shapes,”
   - rewrite candidates,
   - structural heuristics during ranking.

4. Use `dependency-cruiser` as an optional JS/TS adapter, not as the core system. It is especially useful if we want fast wins on module dependency edges before we finish symbol-level extraction.

5. Treat `universal-ctags` as a fallback compatibility layer only:
   - good for unsupported grammars,
   - good for quick symbol bootstrapping,
   - not good enough as the primary ranking signal.

6. Defer language-specific semantic enrichers until v2:
   - `ts-morph` for TypeScript-heavy repos,
   - `Pyright` or `mypy` for Python,
   - `rust-analyzer` for Rust,
   - `gopls` for Go.

7. Avoid `CodeQL` as a primary dependency unless we explicitly want a heavyweight security-analysis sidecar and are willing to accept the workflow and licensing overhead.

8. Keep the MCP shape channel-oriented. The packet’s local evidence says our server already has late-fusion search channels, so the code graph should be a sibling structural channel feeding that fusion step, not a replacement for vector / FTS / BM25 retrieval.
