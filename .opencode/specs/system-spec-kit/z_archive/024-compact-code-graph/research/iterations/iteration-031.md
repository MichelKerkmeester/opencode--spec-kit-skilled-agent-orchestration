# Iteration 031: tree-sitter NPM Package Evaluation

## Focus

Evaluate the practical fit of the Tree-sitter JavaScript ecosystem for a compact code-graph pipeline in Node.js, with emphasis on package footprint, API surface, AST extraction patterns, TypeScript support, long-running server suitability, and relevant prior art from aider's repo-map implementation.

## Findings

1. The package set is workable for a Node.js code-graph, but the footprint is uneven. Recent npm package pages show `tree-sitter` at about `928 kB` unpacked, `tree-sitter-typescript` at about `38.8 MB`, `tree-sitter-python` at about `7.44 MB`, `tree-sitter-bash` at about `20.6 MB`, and `web-tree-sitter` at about `5.77-5.78 MB`. The big outlier is `tree-sitter-typescript`, because it ships both TypeScript and TSX grammars plus generated artifacts. Practical implication: a native Node install for JS/TS/Python/Bash is still reasonable, but grammar packages dominate the disk budget, not the core runtime.

   Approximate package budget from currently indexed npm pages:

   | Package | Purpose | Approx. unpacked size | Notes |
   | --- | --- | ---: | --- |
   | `tree-sitter` | Native Node binding | `928 kB` | Small core runtime |
   | `tree-sitter-typescript` | TS + TSX grammars | `38.8 MB` | Largest package in this set |
   | `tree-sitter-python` | Python grammar | `7.44 MB` | Moderate |
   | `tree-sitter-bash` | Bash grammar | `20.6 MB` | Large for a single grammar |
   | `web-tree-sitter` | Wasm runtime | `5.77-5.78 MB` | Runtime only; languages loaded separately as `.wasm` |

   Important caveat: npm search indexing lagged behind some repository `package.json` versions during this research, so treat these as current package-page size snapshots, not locked release metadata.

2. The Node API surface is small and stable enough for a code graph. The core workflow is: `new Parser()`, `parser.setLanguage(language)`, `parser.parse(source[, oldTree])`, then inspect `tree.rootNode`. For traversal/extraction, the important APIs are `SyntaxNode.type`, `SyntaxNode.text`, `namedChildren`, `childForFieldName()`, `childrenForFieldName()`, `descendantsOfType()`, `walk()`, plus `Query` and `captures()`/`matches()` for grammar-aware extraction. Incremental update support comes from `tree.edit(...)`, `parser.parse(newSource, oldTree)`, and `tree.getChangedRanges(otherTree)`.

   Minimal native Node examples:

   ```js
   const Parser = require("tree-sitter");
   const TS = require("tree-sitter-typescript").typescript;
   const TSX = require("tree-sitter-typescript").tsx;
   const Python = require("tree-sitter-python");
   const Bash = require("tree-sitter-bash");

   const parser = new Parser();

   parser.setLanguage(TS);
   const tsTree = parser.parse("export class A { method() {} }");

   parser.setLanguage(TSX);
   const tsxTree = parser.parse("export const App = () => <div />");

   parser.setLanguage(Python);
   const pyTree = parser.parse("import os\nclass A:\n    pass\n");

   parser.setLanguage(Bash);
   const shTree = parser.parse("export FOO=1\nmy_fn() { echo hi; }\n");
   ```

   Query-based extraction example:

   ```js
   const { Query } = require("tree-sitter");

   const query = new Query(TS, `
     (function_declaration name: (identifier) @fn.name) @fn
     (class_declaration name: (type_identifier) @class.name) @class
     (import_statement source: (string) @import.source) @import
     (export_statement) @export
   `);

   for (const capture of query.captures(tsTree.rootNode)) {
     console.log(capture.name, capture.node.type, capture.node.text);
   }
   ```

3. `tree-sitter` and `web-tree-sitter` solve different runtime problems. `tree-sitter` is the native Node binding backed by a compiled addon and prebuilt binaries via `node-gyp-build`. `web-tree-sitter` is the WebAssembly binding, initialized with `Parser.init()` and loading language grammars as separate `.wasm` files via `Language.load(...)`. The upstream `web-tree-sitter` README is explicit that executing the Wasm path in Node.js is "considerably slower" than using the Node bindings. For a Node-only MCP server, `tree-sitter` is the better default. `web-tree-sitter` only wins if browser parity, Electron-like packaging constraints, or "no native addon" deployment rules matter more than speed.

4. AST extraction is straightforward for JS/TS/Python, but Shell needs a semantic normalization layer. For JS/TS, the node names you usually care about are `function_declaration`, `method_definition`, `class_declaration`, `import_statement`, and `export_statement`. For Python they are `function_definition`, `class_definition`, `import_statement`, and `import_from_statement`. For Bash they are `function_definition`, `variable_assignment`, `declaration_command`, `command`, and `command_substitution`; there is no first-class "module import" node, so `source foo.sh` / `. foo.sh` must be recognized as a `command` pattern, and `export` is represented as a `declaration_command`, not a JavaScript-like export statement.

   Useful normalization strategy:

   - JS/TS `import_statement` -> dependency edge
   - JS/TS `export_statement` or exported declarations -> symbol exposure edge
   - Python `import_statement` / `import_from_statement` -> dependency edge
   - Python functions/classes -> symbol definition edge
   - Bash `function_definition` -> symbol definition edge
   - Bash `declaration_command` beginning with `export` -> environment-export edge
   - Bash `command` named `source` or `.` -> shell-include edge

5. Tree-sitter is fast enough for repo indexing, but upstream does not publish a canonical "500-file codebase" benchmark for these npm bindings. What upstream does say is strong enough to guide implementation: Tree-sitter is designed to parse on every keystroke, incremental reparses are faster than cold parses, and both `tree-sitter parse` and `tree-sitter query` have `--time` support for measurement. The safest planning assumption for a 500-file codebase is:

   - Native `tree-sitter` cold parse plus extraction: budget low-single-digit seconds on a modern machine for typical code files, not milliseconds for the whole repo.
   - Warm or incremental runs: much cheaper, typically proportional to changed files, not total repo size.
   - `web-tree-sitter` in Node: slower enough that it should not be the default for a latency-sensitive MCP server.

   This timing range is an implementation estimate, not an upstream benchmark. If exact SLA matters, the right validation command is a local harness or `tree-sitter parse --time` / `tree-sitter query --time` over a representative file list.

6. Memory usage looks suitable for a long-running MCP server if the server keeps facts, not whole forests, in memory. Tree-sitter's runtime is designed for incremental editing and syntax-tree reuse, which is a good fit for daemon processes. But practical memory behavior is dominated by what the application retains:

   - Keeping one parser per language is cheap.
   - Keeping every `Tree` object for every file is not cheap at scale.
   - Query extraction can be treated as a streaming stage: parse -> extract graph facts -> release the tree reference.
   - Incremental reparsing only pays off if you intentionally retain a prior tree for files that may change soon.

   For a long-running MCP server, the best pattern is bounded in-memory AST retention, plus persisted normalized graph facts. Aider's repo-map code points in the same direction: it caches extracted tags and map output, not full ASTs for the entire repository.

7. TypeScript support is strong enough for real-world code graphing. `tree-sitter-typescript` explicitly ships two grammars, `typescript` and `tsx`, because TS and TSX are treated as separate dialects. The grammar also has first-class rules for decorators, decorator call expressions, repeated decorators on classes/members/parameters, type annotations, `import type`, `typeof` imports, `satisfies`, `override`, `readonly`, `abstract`, generic type parameters, and JSX-only paths in the TSX dialect. For a code graph, this is a major plus: you can parse modern TS/TSX syntax without bolting extra post-processing onto a weaker JS grammar.

   Practical implementation guidance:

   - Use `.typescript` for `.ts`, `.mts`, `.cts`.
   - Use `.tsx` for `.tsx`.
   - If you later expand to plain JS/JSX, keep the parser abstraction language-pluggable rather than hard-coding TS-only assumptions.
   - Treat decorators as metadata edges on classes, methods, fields, and parameters.

8. Installation and deployment requirements favor native bindings in Node, but both native and Wasm paths are viable. The native packages (`tree-sitter`, `tree-sitter-typescript`, `tree-sitter-python`, `tree-sitter-bash`) all use `node-gyp-build` install scripts and include `prebuilds/**`, which usually means "fast install with prebuilt binaries when your platform is covered; native build fallback when it is not." The grammar packages also include `*.wasm`, which is useful if you later want to share grammars with a browser/Wasm path. `web-tree-sitter`, by contrast, requires shipping `web-tree-sitter.wasm`, calling `Parser.init()`, and loading each grammar as a `.wasm` file. In browsers or Vite/Next-style setups, you may also need a `locateFile` hook or a postinstall step to copy the Wasm asset into a public path.

9. Aider uses Tree-sitter as a symbol/tag extractor, not as a full semantic graph engine. In `aider/repomap.py`, aider imports `Query` from `tree_sitter` plus `get_language()` and `get_parser()` from `grep_ast.tsl`, parses each file, loads an `.scm` tags query, runs the query over `tree.root_node`, and extracts captures named like `name.definition.*` and `name.reference.*`. It then builds a weighted graph over those definitions/references and ranks files/symbols using PageRank (`networkx`). Two implementation details are especially relevant for this spec:

   - aider caches extracted tags by file mtime in a disk-backed cache, which is exactly the kind of persistence pattern a long-running MCP server should copy;
   - aider falls back to Pygments-derived references if a tags query only yields definitions, which suggests a practical resilience pattern for imperfect grammar/query coverage.

   In other words, aider is proof that Tree-sitter is already good enough for a repo-map style feature, but it also shows that the winning architecture is "Tree-sitter + query files + cache + ranking," not "hold every AST forever."

## Evidence (cite sources/URLs)

1. Node binding package metadata and install model:
   - https://www.npmjs.com/package/tree-sitter?activeTab=versions
   - https://github.com/tree-sitter/node-tree-sitter/blob/master/package.json
   - https://github.com/tree-sitter/node-tree-sitter/blob/master/README.md
   - https://tree-sitter.github.io/node-tree-sitter/modules/Parser.html
   - https://tree-sitter.github.io/node-tree-sitter/interfaces/Parser.SyntaxNode.html
   - https://tree-sitter.github.io/node-tree-sitter/interfaces/Parser.Tree.html
   - https://tree-sitter.github.io/node-tree-sitter/classes/Parser.Query.html

2. TypeScript package metadata and grammar details:
   - https://www.npmjs.com/package/tree-sitter-typescript
   - https://github.com/tree-sitter/tree-sitter-typescript/blob/master/README.md
   - https://github.com/tree-sitter/tree-sitter-typescript/blob/master/package.json
   - https://github.com/tree-sitter/tree-sitter-typescript/blob/master/common/define-grammar.js
   - https://github.com/tree-sitter/tree-sitter-typescript/blob/master/typescript/grammar.js
   - https://github.com/tree-sitter/tree-sitter-typescript/blob/master/tsx/grammar.js

3. Python package metadata and grammar details:
   - https://www.npmjs.com/package/tree-sitter-python?activeTab=versions
   - https://github.com/tree-sitter/tree-sitter-python/blob/master/package.json
   - https://github.com/tree-sitter/tree-sitter-python/blob/master/grammar.js

4. Bash package metadata and grammar details:
   - https://www.npmjs.com/package/tree-sitter-bash
   - https://github.com/tree-sitter/tree-sitter-bash/blob/master/package.json
   - https://github.com/tree-sitter/tree-sitter-bash/blob/master/grammar.js

5. Wasm binding behavior and Node-vs-Wasm tradeoff:
   - https://www.npmjs.com/package/web-tree-sitter
   - https://github.com/tree-sitter/tree-sitter/blob/master/lib/binding_web/package.json
   - https://github.com/tree-sitter/tree-sitter/blob/master/lib/binding_web/README.md

6. Upstream performance and timing support:
   - https://tree-sitter.github.io/tree-sitter/index.html
   - https://tree-sitter.github.io/tree-sitter/cli/parse.html
   - https://tree-sitter.github.io/tree-sitter/cli/query.html
   - https://tree-sitter.github.io/tree-sitter/using-parsers/2-basic-parsing.html
   - https://github.com/tree-sitter/tree-sitter

7. Query syntax and capture model:
   - https://tree-sitter.github.io/tree-sitter/using-parsers/queries/2-operators.html
   - https://tree-sitter.github.io/node-tree-sitter/classes/Parser.Query.html

8. Aider repo-map implementation:
   - https://github.com/Aider-AI/aider/blob/main/aider/repomap.py
   - https://github.com/Aider-AI/aider/blob/main/requirements.txt
   - https://github.com/Aider-AI/aider/blob/main/pyproject.toml

## New Information Ratio (0.0-1.0)

0.81

## Novelty Justification

This iteration adds concrete package-level and implementation-level detail that is directly actionable for `024-compact-code-graph`: approximate npm footprint by package, the exact native-vs-Wasm tradeoff for Node.js, the specific extraction APIs and node kinds to normalize per language, the TypeScript/TSX/decorator support level, and a realistic architecture pattern derived from aider's repo-map code. The most useful new information is not "Tree-sitter can parse code" but rather "which package combination to ship, how to wire extraction, what Shell does not model cleanly, and what caching pattern already works in production-like tooling."

## Recommendations for Implementation

1. Use native `tree-sitter` for the MCP server baseline, not `web-tree-sitter`. Reserve `web-tree-sitter` for browser/Electron parity or environments where native addons are prohibited.

2. Start with this package set:
   - `tree-sitter`
   - `tree-sitter-typescript`
   - `tree-sitter-python`
   - `tree-sitter-bash`

3. Make the extractor query-first, not hand-walk-first. Use per-language `.scm` query files for definitions/imports/exports and only fall back to manual node walking for grammar-specific gaps.

4. Normalize graph edges by language capability:
   - JS/TS: imports, exports, classes, functions, methods, decorators
   - Python: imports, classes, functions
   - Bash: functions, exports, sourced files, command substitutions

5. Do not retain every AST in memory. Keep one parser per language, keep previous trees only for hot files where incremental reparsing matters, and persist extracted graph facts plus file-mtime cache keys.

6. Treat Shell as a second-class semantic language in the graph. It is parseable, but "imports/exports" are conventions (`source`, `.`, `export`) rather than first-class module syntax.

7. Add a benchmark harness before locking architecture. Measure:
   - cold full parse over a representative 500-file sample
   - warm incremental reparse after 1-file and 10-file edits
   - query extraction time per language
   - peak RSS with and without tree retention

8. If we want aider-like behavior, copy the architecture, not just the library choice:
   - Tree-sitter parser
   - query-based tag extraction
   - mtime-keyed persistent cache
   - graph ranking stage over extracted symbols/references
