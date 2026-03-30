# Iteration 038: tree-sitter Deep Dive — Queries and Incremental Parsing

## Focus

Deep-dive the Tree-sitter mechanics most relevant to a compact code-graph pipeline:
- incremental parsing and why it is fast,
- the query language and how to use it for symbol extraction,
- practical query examples for JavaScript/TypeScript, Python, and Shell,
- error recovery on partial/broken code,
- playground-driven query development,
- real-world editor/code-navigation usage,
- limitations and benchmark reality,
- implementation guidance for a production code index.

## Findings

1. Tree-sitter incremental parsing works by reparsing against the previous tree, not by reparsing the whole file blindly. The core flow is: update the old tree with an edit (`ts_tree_edit` / `tree.edit(...)`), then call parse again while passing the old tree. Tree-sitter explicitly states that the new tree "internally shares structure with the old tree", and the bindings expose `changed_ranges` / `changed_ranges(new_tree)` so downstream code can limit re-indexing work to syntax regions that actually changed. This is the main reason it is fast enough for editor-like workloads: reuse old structure, limit work to changed regions, and keep parsing close to the underlying text storage through callbacks or custom input readers.

   What makes it fast in practice:
   - old-tree reuse plus structural sharing,
   - explicit edit coordinates in bytes and points,
   - `changed_ranges` for narrow downstream invalidation,
   - a small C runtime intended to be embedded,
   - direct parsing from ropes/piece tables/custom buffers instead of forced string copies,
   - optional range-limited parsing for embedded/multi-language documents via included ranges.

2. Tree-sitter queries are S-expression pattern matchers over concrete syntax trees. A query is one or more patterns; each pattern can match node types, child structures, fields, literal tokens, wildcards, supertypes, and error nodes. Captures (`@name`) label matched nodes, operators add repetition/alternation/anchors, and predicates/directives add conditions or metadata. The mental model is closer to "AST CSS selectors plus captures and predicates" than to a semantic symbol solver.

   The most useful query building blocks for indexing are:
   - fields: `name:`, `body:`, `source:` to make patterns precise,
   - captures: `@definition.function`, `@name`, `@reference.call`,
   - alternation: `[...]` for multiple declaration forms,
   - quantifiers: `*`, `+`, `?` for decorators/comments/optional children,
   - anchors: `.` to force adjacency or first/last-child behavior,
   - predicates: `#eq?`, `#match?`, `#any-of?`, `#is-not?`,
   - directives: `#set!`, `#select-adjacent!`, `#strip!`.

3. The most reliable way to write extraction queries is to start from grammar node names and fields, then normalize the result into your own graph schema. Tree-sitter's own docs recommend field-aware queries, and `node-types.json` exists specifically to describe every possible node type plus its fields and child shapes. For code-navigation-style extraction, Tree-sitter and GitHub both use a `@role.kind` convention such as `@definition.function`, `@definition.class`, `@definition.type`, `@reference.call`, and an inner `@name` capture for the actual identifier.

   Practical extraction mapping for our index:
   - functions/methods: `@definition.function`, `@definition.method`
   - classes/interfaces/enums/type aliases: `@definition.class`, `@definition.interface`, `@definition.type`, `@definition.enum`
   - imports/includes: custom capture like `@definition.import` or `@reference.include`
   - exports/public surface: custom `@definition.export` or reuse declaration captures with exported metadata
   - references/calls: `@reference.call`

   Important constraint: queries are grammar-specific. The portable part is the capture vocabulary and indexing pipeline, not the exact node names.

4. Example extraction queries for JavaScript and TypeScript are straightforward because upstream grammars already ship tag queries for functions/classes/interfaces, and the static node types documentation shows how declarations like `export_statement` are structured. The examples below are suitable starting points for a code index, but should still be verified against the exact grammar revision in the playground.

   ```scheme
   ; JavaScript / TypeScript core definitions
   [
     (function_declaration name: (identifier) @name)
     (generator_function_declaration name: (identifier) @name)
     (lexical_declaration
       (variable_declarator
         name: (identifier) @name
         value: [(arrow_function) (function_expression)]))
     (variable_declaration
       (variable_declarator
         name: (identifier) @name
         value: [(arrow_function) (function_expression)]))
   ] @definition.function

   (method_definition
     name: (property_identifier) @name) @definition.method

   [
     (class name: (_) @name)
     (class_declaration name: (_) @name)
   ] @definition.class

   (import_statement
     source: (string) @name) @definition.import

   (export_statement) @definition.export

   ; TypeScript-specific type surface
   (interface_declaration
     name: (type_identifier) @name) @definition.interface

   (type_alias_declaration
     name: (type_identifier) @name) @definition.type

   (enum_declaration
     name: (identifier) @name) @definition.enum
   ```

   Notes:
   - `export_statement` often wraps another declaration, so many indexers treat export as metadata on the inner symbol rather than as a standalone symbol.
   - `import_statement` is reliable; `export ... from "x"` can also expose a `source:` field depending on the grammar path.
   - For code navigation, GitHub's convention is `@definition.*` plus `@name`; for our internal graph we can additionally capture `@source` or `@export` metadata.

5. Python is simpler structurally, but its module system differs from JS/TS: there is no dedicated `export` keyword, and "type definition" is usually best modeled as class/interface-like declarations rather than expecting a JS-style export/type surface. Upstream Python tags already capture classes, functions, constants, and call references. For indexing, imports are explicit, classes are the portable type-definition unit, and export handling is convention-based (`__all__`) rather than grammar-native.

   ```scheme
   ; Python
   (class_definition
     name: (identifier) @name) @definition.class

   (function_definition
     name: (identifier) @name) @definition.function

   [
     (import_statement)
     (import_from_statement)
   ] @definition.import

   ; Portable "type-like" symbol extraction
   (class_definition
     name: (identifier) @name) @definition.type

   ; Convention-based export surface
   ((assignment
      left: (identifier) @name)
    (#eq? @name "__all__")) @definition.export
   ```

   Notes:
   - `class_definition` is a practical type-definition proxy for graphing.
   - `__all__` is a Python convention, not a language keyword, so treat it as metadata rather than a guaranteed export list.
   - If we later want Python type-alias coverage, we should inspect the exact grammar revision in the playground before hard-coding alias nodes.

6. Shell is the least "module-like" of the target languages, so a good Bash index is intentionally asymmetric. Functions are first-class parse targets, but classes and type definitions do not exist, and imports/includes are conventions (`source foo.sh` or `. foo.sh`) rather than dedicated syntax categories. That means the right extraction strategy is: capture functions, capture export-like declaration commands, and recognize include/source commands as dependency edges. These Bash patterns are illustrative and should be validated against the exact grammar revision in the playground.

   ```scheme
   ; Shell / Bash
   (function_definition) @definition.function

   (declaration_command) @definition.export

   (command
     (command_name) @name
     (#any-of? @name "source" ".")) @reference.include

   (variable_assignment) @definition.variable
   ```

   Notes:
   - Shell has no class/type layer, so do not force the graph schema to pretend otherwise.
   - A useful normalization is:
     - `function_definition` -> symbol definition
     - `declaration_command` -> environment-export edge/metadata
     - `command` named `source` or `.` -> include/dependency edge
     - `variable_assignment` -> configuration/data node if we need it

7. Tree-sitter's error recovery is one of its strongest practical advantages. The project explicitly aims to be "robust enough to provide useful results even in the presence of syntax errors", and the query language can directly target `(ERROR)` and `(MISSING)` nodes. `ERROR` represents text the parser could not incorporate into a valid tree; `MISSING` represents tokens the parser inserted during recovery to keep the tree shape usable. In practice, this means a partially broken file still yields a mostly useful tree for indexing, highlighting, or outline extraction, but symbols near the broken region can be less trustworthy.

   Practical implications for our graph:
   - keep indexing partially broken files, but lower confidence on captures intersecting `ERROR`/`MISSING`,
   - treat `changed_ranges` plus nearby syntax ancestors as the minimum invalidation region after edits,
   - optionally record whether a file parse produced recoverable syntax errors,
   - expose a parser-health bit so callers know "indexed from a recovered tree" vs "clean parse".

8. The Tree-sitter playground is the fastest way to develop and debug queries. The hosted playground lets you choose a grammar, paste code, inspect the tree live, and enter queries in a side panel. If the query is valid, captures are highlighted in both the code and query panes; if it is invalid, the broken parts are underlined and diagnostics appear on hover. For custom grammars, the CLI can serve the same UI locally via `tree-sitter playground`, after building the grammar as Wasm.

   Best workflow for query development:
   1. paste minimal representative code,
   2. inspect exact node names and field names in the tree,
   3. write the smallest possible query with a single capture,
   4. add predicates/alternations only after the basic match works,
   5. test failure cases and broken code,
   6. run `tree-sitter query --time` once the query is stable.

9. Editors and code-navigation systems use Tree-sitter as a structural substrate, not as full semantic analysis. The common pattern is "Tree-sitter for syntax-accurate structure, LSP or custom logic for semantics." Neovim integrates Tree-sitter directly for incremental buffer parsing, query-based highlighting, folding, and node inspection. Zed uses Tree-sitter queries for syntax highlighting, bracket matching, code outline/structure, auto-indentation, injections, runnable detection, redactions, and selecting functions/classes. Helix uses Tree-sitter for syntax-aware motions and for indentation through `indents.scm`. GitHub code navigation uses the Tree-sitter ecosystem plus tags queries to extract definitions/references across repositories.

   The common downstream pattern is important for us:
   - queries are the main extension surface,
   - capture names become product features,
   - syntax and semantics stay separate,
   - each host adds its own query files and sometimes host-specific predicates/directives.

10. Tree-sitter is excellent for a structural code index, but it has clear limitations and benchmark caveats. Upstream gives strong qualitative claims and a few concrete examples, but not a universal repo-scale benchmark. The best official concrete speed datum I found is from `tree-sitter-rust`: parsing a 2,157-line Rust file takes `6.48 ms`, and incremental updates are generally "less than a millisecond." The CLI also exposes `parse --time`, `query --time`, and `highlight --time`, which is a strong signal that Tree-sitter expects you to benchmark against your own corpus instead of trusting generic headline numbers.

   Limitations that matter to our implementation:
   - syntax only: Tree-sitter does not resolve symbols/types/modules by itself,
   - grammar quality varies by language and version,
   - exact node names and fields are grammar-specific,
   - host query dialects can differ (for example, Neovim explicitly documents predicate differences from upstream),
   - non-local query patterns disable some range optimizations,
   - `changed_ranges` identifies syntactic deltas, not semantic impact,
   - dynamic or convention-heavy languages like Shell and Python exports need normalization logic beyond raw syntax captures.

   Bottom line: Tree-sitter should be our structural frontend, not our entire code-intelligence stack.

## Evidence (cite sources/URLs)

- Tree-sitter overview and goals:
  - https://tree-sitter.github.io/tree-sitter/index.html
  - https://tree-sitter.github.io/tree-sitter/5-implementation.html
  - https://tree-sitter.github.io/tree-sitter/creating-parsers/3-writing-the-grammar.html

- Incremental parsing, edits, structural sharing, included ranges:
  - https://tree-sitter.github.io/tree-sitter/using-parsers/2-basic-parsing.html
  - https://tree-sitter.github.io/tree-sitter/using-parsers/3-advanced-parsing.html
  - https://github.com/tree-sitter/py-tree-sitter
  - https://tree-sitter.github.io/py-tree-sitter/classes/tree_sitter.Parser.html

- Query syntax, operators, predicates, directives, error nodes:
  - https://tree-sitter.github.io/tree-sitter/using-parsers/queries/1-syntax.html
  - https://tree-sitter.github.io/tree-sitter/using-parsers/queries/2-operators.html
  - https://tree-sitter.github.io/tree-sitter/using-parsers/queries/3-predicates-and-directives.html
  - https://tree-sitter.github.io/py-tree-sitter/classes/tree_sitter.Query.html
  - https://tree-sitter.github.io/py-tree-sitter/classes/tree_sitter.QueryCursor.html
  - https://tree-sitter.github.io/py-tree-sitter/classes/tree_sitter.Node.html
  - https://tree-sitter.github.io/py-tree-sitter/classes/tree_sitter.LookaheadIterator.html

- Code navigation and capture conventions:
  - https://tree-sitter.github.io/tree-sitter/4-code-navigation.html
  - https://github.com/github/code-navigation

- Static node shapes and field metadata:
  - https://tree-sitter.github.io/tree-sitter/using-parsers/6-static-node-types.html

- Playground and CLI query development:
  - https://tree-sitter.github.io/tree-sitter/7-playground.html
  - https://tree-sitter.github.io/tree-sitter/cli/playground.html
  - https://tree-sitter.github.io/tree-sitter/cli/query.html
  - https://tree-sitter.github.io/tree-sitter/cli/parse.html
  - https://tree-sitter.github.io/tree-sitter/cli/highlight.html

- Upstream query examples and grammar conventions:
  - https://raw.githubusercontent.com/tree-sitter/tree-sitter-javascript/master/queries/tags.scm
  - https://raw.githubusercontent.com/tree-sitter/tree-sitter-python/master/queries/tags.scm
  - https://raw.githubusercontent.com/tree-sitter/tree-sitter-typescript/master/queries/tags.scm
  - https://raw.githubusercontent.com/tree-sitter/tree-sitter-javascript/master/src/node-types.json
  - https://raw.githubusercontent.com/tree-sitter/tree-sitter-python/master/src/node-types.json
  - https://raw.githubusercontent.com/tree-sitter/tree-sitter-bash/master/grammar.js

- Real-world editor/system usage:
  - https://neovim.io/doc/user/treesitter.html
  - https://zed.dev/docs/extensions/languages
  - https://zed.dev/docs/configuring-languages
  - https://docs.helix-editor.com/syntax-aware-motions.html
  - https://docs.helix-editor.com/master/guides/indent.html
  - https://github.com/github/code-navigation

- Concrete benchmark evidence:
  - https://github.com/tree-sitter/tree-sitter-rust

## New Information Ratio (0.0-1.0)

0.73

## Novelty Justification

Iteration 031 established that Tree-sitter is viable for a Node-based code graph and outlined package/runtime tradeoffs. This iteration goes deeper into the mechanics we would actually implement: exact incremental parse flow, query language semantics, practical extraction query shapes, error recovery behavior, playground-driven development, editor/query ecosystem patterns, benchmark reality, and the specific limits we need to design around. The biggest new value is that it translates "Tree-sitter is viable" into "here is how to author, validate, range-limit, normalize, and operationalize Tree-sitter queries in a production index."

## Recommendations for Our Implementation

1. Use Tree-sitter as the structural parsing layer only. Keep symbol resolution, export semantics, and cross-file graph logic in our own normalization/index layer.

2. Make the index query-first, not traversal-first. Prefer per-language `.scm` files for definitions/imports/exports/types, and only fall back to manual tree walking for grammar gaps.

3. Build the update pipeline around incremental parsing:
   - keep previous trees for hot files,
   - call `edit` + reparse with the old tree,
   - use `changed_ranges` to narrow re-extraction,
   - store extracted graph facts separately from the syntax tree.

4. Standardize our internal capture vocabulary now. Recommended baseline:
   - `@definition.function`
   - `@definition.method`
   - `@definition.class`
   - `@definition.interface`
   - `@definition.type`
   - `@definition.enum`
   - `@definition.import`
   - `@definition.export`
   - `@reference.call`
   - `@reference.include`
   - `@name`

5. Treat Shell as an intentionally lower-semantic language in the graph. Capture functions, `export`-style declarations, and `source`/`.` includes, but do not force fake class/type semantics into the model.

6. Add a query-authoring workflow to the implementation plan:
   - inspect the tree in the playground,
   - consult `node-types.json`,
   - write the smallest working query,
   - benchmark with `tree-sitter query --time`,
   - add broken-code fixtures that contain `ERROR`/`MISSING` recovery.

7. Design for host variance. Neovim, Zed, Helix, and GitHub all use Tree-sitter queries, but they do not all expose identical predicate/directive sets. Keep our indexer on upstream-compatible query constructs wherever possible.

8. Benchmark on our own corpus before freezing architecture. Upstream proves "fast enough for editors" and gives some concrete file-level timings, but repo-level SLA decisions should come from our own `parse --time` and query benchmarks over representative JS/TS/Python/Shell files.

9. Plan for multi-language documents and injections early. Tree-sitter already supports included ranges and injection metadata, which means mixed-language files should be treated as a first-class design concern rather than a post-MVP bolt-on.

10. Store confidence/health metadata per indexed file. A recovered parse with `ERROR`/`MISSING` nodes is still useful, but downstream ranking and UX should know when a symbol came from a structurally recovered tree rather than a clean parse.
