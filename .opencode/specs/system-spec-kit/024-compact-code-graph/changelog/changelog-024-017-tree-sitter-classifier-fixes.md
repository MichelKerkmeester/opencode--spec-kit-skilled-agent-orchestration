# Changelog: 024/017-tree-sitter-classifier-fixes

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration)

---

## 017-tree-sitter-classifier-fixes -- 2026-03-31

A 10-iteration external review uncovered 15 bugs in the tree-sitter WASM parser and the query-intent classifier -- two modules added during the v2 remediation. The parser silently dropped imports, double-counted decorated Python definitions, misclassified class expressions, and could be permanently disabled by a single failed startup. The classifier routed structural questions ("Where is this function defined?") to the wrong search path and gave overconfident answers from thin evidence. This phase fixed 12 of those 15 bugs, making code structure analysis more accurate and search routing more reliable.

> Spec folder: `.opencode/specs/system-spec-kit/024-compact-code-graph/017-tree-sitter-classifier-fixes/`

---

## What Changed

### Bug Fixes (6 items)

These fixes address silent data loss, misclassification, and crash-recovery failures in the tree-sitter parser -- the component that reads source code files and builds a structured map of every function, class, import, and variable they contain.

---

### F030 -- Abstract method indexing

**Problem:** TypeScript abstract methods (method signatures declared without a body, meant to be implemented by subclasses) were silently skipped during code analysis. When the parser built its map of a file's structure, abstract methods simply did not appear. Any search for "where is this method defined?" would return nothing for abstract methods, even though they exist in the source code.

**Fix:** Added the `abstract_method_signature` node type to the parser's dictionary of recognized TypeScript constructs. Abstract methods now appear in structural search results alongside regular methods, with the correct "method" classification.

---

### F031 -- Class expression classification

**Problem:** When a class is written as an assignment -- `const MyClass = class {}` instead of the more common `class MyClass {}` -- the parser looked only at the left side of the assignment and classified `MyClass` as a variable. This meant code graph entries showed it as a plain variable rather than a class, and class-specific searches would miss it entirely.

**Fix:** The parser now inspects the right-hand side of assignments to detect class expressions and generator function expressions. Both `variable_declarator` nodes (like `const X = class {}`) and `lexical_declaration` nodes are handled. Class expressions now show up correctly in search results and code graphs with their true "class" type.

---

### F032 -- Multi-import capture

**Problem:** When a file imported multiple names in a single statement -- for example `import { a, b, c } from './module'` -- only the first name (`a`) was captured. The remaining names (`b`, `c`) were silently dropped. The same issue affected re-exports (`export { x, y } from './other'`). This meant the code graph had an incomplete picture of a file's dependencies, and searches for where a symbol was imported would fail for any name that was not listed first.

**Fix:** Created two dedicated helper functions, `emitImportCaptures` and `emitExportCaptures`, that iterate through every specifier in an import or export statement and emit one capture per name. All imported and re-exported names are now visible to search, giving the code graph a complete view of each file's dependency relationships.

---

### F033 -- Decorated definition handling

**Problem:** In Python, decorators are annotations placed above a class or function (like `@staticmethod` or `@app.route`). The parser treated the decorator wrapper as a separate definition, so a decorated class or function was emitted twice -- once for the decorator line and once for the actual definition. Worse, decorated classes were mistyped as functions because the parser read the decorator's node type instead of the inner class definition. This produced duplicate entries in search results with incorrect type labels.

**Fix:** Removed the decorator wrapper (`decorated_definition`) from the parser's node type dictionary entirely. When the parser encounters a decorated definition during its tree walk, it now delegates directly to the inner definition node (the actual class or function). Each decorated symbol appears exactly once in the output, with its correct type.

---

### F034 -- Init poisoning recovery

**Problem:** The tree-sitter parser uses a one-time initialization step to load its language grammars (WASM binary files). If that initialization failed for any reason -- a missing file, a network timeout, a corrupted download -- the failure result was cached permanently as a resolved promise. Every subsequent attempt to use the parser would immediately fail with the same cached error, with no way to retry. The only recovery was to restart the entire process.

**Fix:** The parser now resets its initialization promise whenever initialization fails. On the next parse attempt, it retries the full initialization sequence from scratch. A transient startup failure (such as a temporarily missing file) no longer permanently disables the parser for the rest of the session. The structural indexer also validates grammars before caching them, preventing corrupt state from persisting.

---

### F041 -- Nested class qualified names

**Problem:** Python allows classes to be nested inside other classes. For a structure like `class Outer: class Inner: def method()`, the fully qualified name should be `Outer.Inner.method`. However, the parser lost the outer class prefix during its recursive walk through the syntax tree, recording only `Inner.method`. This made it impossible to distinguish identically named methods in different nesting contexts, and searches for the full path would fail.

**Fix:** The parser now threads the full qualified class name through each level of its recursive walk. When entering a nested class, the outer class prefix is prepended to the current name, preserving the complete hierarchy (`Outer.Inner.method`) in all emitted captures.

---

### Search (4 items)

These fixes address incorrect routing, false matches, overconfidence, and vocabulary gaps in the query-intent classifier -- the component that decides whether a user's question should be answered by structural search (exact code lookups) or semantic search (meaning-based retrieval).

---

### F035 -- Structural query misrouting

**Problem:** Questions about code structure, such as "Where is the function defined?" or "Show me all class definitions," were being routed to semantic search instead of structural search. Semantic search looks for conceptual similarity and is designed for questions like "how does authentication work?" Structural search looks up exact code locations and is designed for "where is function X?" The classifier's semantic patterns were too broad -- any question starting with "where" or "show me" matched the semantic path, even when the question was clearly structural.

**Fix:** Narrowed the semantic pattern rules to require a semantic noun (words like "concept," "approach," "architecture") alongside the query opener. A question like "Where is the function defined?" no longer matches the semantic path because "function" and "defined" are structural terms, not semantic ones. Structural lookups now reach the correct search pipeline.

---

### F036 -- False positive matching

**Problem:** The classifier used simple substring matching to detect keywords in queries. This meant a query containing "call chaining" would incorrectly match the keyword "call chain" because "call chain" is a substring of "call chaining." Similarly, "imported" would match "import," and "exporting" would match "export." These false positives caused queries to be scored as matching categories they did not actually belong to.

**Fix:** Replaced substring matching with exact token n-gram matching. The classifier now splits queries into individual words (tokens) and checks for exact multi-word sequences. "Call chaining" no longer matches "call chain" because the tokens do not match exactly. This eliminates an entire class of false-positive keyword matches.

---

### F037 -- Overconfident scoring

**Problem:** The classifier's confidence score could reach 95% from a single keyword match. This meant that finding just one relevant-looking word in a query was enough for the system to act with near-certainty about the query's intent. In practice, one keyword is weak evidence -- the word "function" alone does not reliably indicate whether a query is structural or semantic.

**Fix:** Confidence now scales with the number of matching signals rather than saturating from a single hit. The scoring formula requires multiple pieces of evidence (several matching keywords, pattern matches, or structural markers) before reaching high confidence levels. A single keyword match produces a modest score, reflecting the actual strength of the evidence.

---

### F038 -- Missing structural keywords

**Problem:** Common plural forms of structural terms -- "imports," "exports," and "callers" -- were not in the classifier's keyword dictionary. Only their singular forms ("import," "export," "caller") were recognized. A user asking "Show me all imports in this file" would not trigger the structural keyword bonus because "imports" was an unknown word. This caused some clearly structural queries to receive lower structural scores than they deserved.

**Fix:** Expanded the structural keyword dictionary with both singular and plural inflections for all relevant terms. The classifier now recognizes "import/imports," "export/exports," "caller/callers," and other paired forms, ensuring that natural phrasing does not penalize query classification.

---

### Architecture (2 items)

Structural improvements to reduce duplication and activate unused code.

---

### F043 -- Shared type contracts

**Problem:** The `RawCapture` type (defining the shape of a parsed code element) and the `ParserAdapter` interface (defining the contract that any parser must satisfy) were duplicated between the tree-sitter parser and the structural indexer. Changes to one copy could silently diverge from the other, creating subtle bugs where the two modules disagreed on the shape of their shared data.

**Fix:** Consolidated both type definitions into a single source of truth in `structural-indexer.ts`. The tree-sitter parser now imports `RawCapture` and `ParserAdapter` from the indexer instead of maintaining its own copies. Any future changes to these contracts are made in one place and automatically apply everywhere.

---

### F040 -- Classifier integration

**Problem:** The query-intent classifier was fully implemented and exported, but no other module actually called it. It sat as dead code -- available but unused in any real search routing path. The fixes above (F035-F038) improved its accuracy, but those improvements had no effect on system behavior because the classifier was not wired into the pipeline.

**Fix:** Integrated the classifier into the memory context routing logic in Phase 020. When a search query arrives, it now passes through the classifier to determine whether structural or semantic search is more appropriate. The classifier actively influences which search pipeline handles each query, making all the accuracy improvements in F035-F038 operationally meaningful.

---

<details>
<summary><strong>Files Changed (4 files)</strong></summary>

| File | What changed |
|------|-------------|
| `lib/code-graph/tree-sitter-parser.ts` | F030-F034, F041: abstract method support, class expression detection, multi-import/export capture, decorator delegation, init recovery, nested class qualified-name threading |
| `lib/code-graph/query-intent-classifier.ts` | F035-F038: semantic pattern narrowing, word boundary matching, confidence scaling, keyword expansion |
| `lib/code-graph/structural-indexer.ts` | F034: grammar validation before caching; F043: RawCapture and ParserAdapter as single source of truth |
| `lib/config/capability-flags.ts` | SPECKIT_PARSER environment variable reference (internal) |

</details>

---

## Deferred

Three items were deferred to future phases:

- **F039**: Dedicated test file for the tree-sitter parser -- deferred to a future testing phase.
- **F042**: Bash regex does not recognize the `function foo { }` declaration style -- needs investigation.
- **F044**: `SPECKIT_PARSER` environment variable documentation -- demoted to internal-only.

---

## Deep Review Fixes (2026-04-01)

### Code Fix
- **Tree-sitter isReady checks ALL grammars** -- `isReady()` changed from `grammarCache.size > 0` to `SUPPORTED_LANGUAGES.every(lang => grammarCache.has(lang))`, preventing false-ready states after partial grammar loads

### Doc Fixes
- F039/F042/F044 marked DONE with code evidence (were stale as "deferred")
- ParserAdapter duplication noted as tech debt
- Test file gap documented (lacks parser-selection coverage)

---

## Upgrade

No migration required.
