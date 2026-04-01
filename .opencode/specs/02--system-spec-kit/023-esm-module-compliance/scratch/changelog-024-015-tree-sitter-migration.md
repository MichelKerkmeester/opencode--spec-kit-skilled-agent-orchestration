# Changelog: 024/015-tree-sitter-migration

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration)

---

## 015-tree-sitter-migration — 2026-03-31

The structural indexer -- the component that reads source code files and builds a map of how symbols (functions, classes, variables) relate to each other -- was built in Phase 008 using regex patterns. Regex is a text-matching technique: fast and dependency-free, but only about 70% accurate for understanding code structure. Decorators, method overrides, and type annotations were invisible to it. On top of that, four symbol types (method, variable, parameter, module) were defined in the system's type definitions but never actually extracted, creating a gap between what the code graph promised and what it delivered.

This phase lays the foundation for tree-sitter WASM parsing -- a proper code parser that understands syntax at roughly 99% accuracy -- by introducing an adapter interface that lets the system swap between regex and tree-sitter at runtime. While tree-sitter itself ships later (Phase 017), this phase delivers immediate value: three new relationship types, four previously missing symbol kinds, and cleanup of dead code paths and broken configuration options.

> Spec folder: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/015-tree-sitter-migration/`

---

## Architecture (2 changes)

### Parser adapter interface

**Problem:** The indexer was hardwired to regex parsing. If you wanted to swap in a different, more accurate parser (like tree-sitter), you would have to rewrite the entire extraction pipeline. There was no clean separation between "how we parse" and "what we do with the results."

**Fix:** Introduced a `ParserAdapter` interface -- a contract that any parser must follow -- with a single method: `parse(content, language)` returning a `ParseResult`. All existing regex logic was wrapped into a `RegexParser` class that implements this interface. A `getParser()` function checks the `SPECKIT_PARSER` environment variable and returns the appropriate parser (`regex` or `treesitter`). This is the integration point that Phase 017 later plugs tree-sitter into, and it means any future parser can slot in without touching the rest of the pipeline.

### Explicit failure over silent fallback

**Problem:** Setting the environment variable `SPECKIT_PARSER=treesitter` before tree-sitter was actually implemented could have caused the system to silently fall back to the regex parser. A developer who explicitly requested tree-sitter would have no way of knowing their code graph was still being built by the less accurate regex engine.

**Fix:** Instead of falling back silently, the system now throws a clear error when tree-sitter is requested but not yet available. This follows a principle of "fail loudly" -- if someone sets a flag expecting a specific behavior, they should know immediately when that behavior cannot be provided.

---

## New Features (4 changes)

### DECORATES edge type

**Problem:** The code graph had no way to represent decorator relationships. Decorators are annotations placed above functions or classes (written as `@decorator` in Python, `@Decorator()` in TypeScript) that modify or extend behavior. They are a primary mechanism for adding cross-cutting functionality in both languages -- things like logging, authentication checks, or route registration. Without tracking them, the graph missed a significant class of code relationships.

**Fix:** Added a `DECORATES` edge type (confidence score 0.9, meaning high reliability) that detects decorator patterns above functions and classes using regex. When the system sees a `@something` annotation immediately above a function or class definition, it creates a DECORATES edge linking the decorator to the decorated symbol. This relationship will gain additional precision when tree-sitter parsing arrives.

### OVERRIDES edge type

**Problem:** When a subclass redefines a method that already exists in its parent class (called "overriding"), the code graph had no way to express this relationship. There was no distinction between a method that customizes inherited behavior and one that introduces entirely new functionality. This matters for understanding class hierarchies -- knowing which methods are customizations versus originals is essential for safe refactoring.

**Fix:** Added an `OVERRIDES` edge type (confidence 0.9) that detects class methods shadowing parent methods by tracking `extends` chains. When a class extends another and defines a method with the same name as one in the parent, the system creates an OVERRIDES edge. The detection requires the parent class to be defined in the same file or for the extends relationship to already be captured in the graph; cross-file inheritance detection is approximate.

### TYPE_OF edge type

**Problem:** Type annotations -- the `: TypeName` syntax in function signatures and variable declarations that tells TypeScript or Python what type a value should be -- were invisible to the code graph. There was no way to ask "what uses this interface?" or trace type dependencies through the codebase.

**Fix:** Added a `TYPE_OF` edge type (confidence 0.85, slightly lower because type names can be aliases or re-exports) that captures type references. It links functions and variables to the types they declare, creating a type-aware layer in the graph. Note that this captures type _names_, not fully resolved types -- if a type is re-exported under a different name, the edge points to the alias rather than the underlying type.

### Ghost SymbolKinds now extracted

**Problem:** Four symbol types were defined in the `SymbolKind` type system but never actually produced by the parser -- they were "ghosts." Class methods in JavaScript and TypeScript were misreported as plain functions. Variable declarations (`const`, `let`, `var`) were invisible. Function parameters with type annotations were ignored. Module-level export patterns went undetected. The code graph's type definitions promised these categories existed, but the parser never delivered them.

**Fix:** The regex parser now actively extracts all four previously ghost SymbolKinds:
- **method** -- Class methods are now correctly identified as methods rather than standalone functions, preserving the distinction between a method belonging to a class and a free-standing function.
- **variable** -- `const`, `let`, and `var` declarations are now captured as variable symbols in the graph.
- **parameter** -- Function parameters that include type annotations (e.g., `name: string`) are now extracted as parameter symbols.
- **module** -- Module-level export patterns (e.g., `export default`, named exports) are now detected and recorded.

---

## Bug Fixes (3 changes)

### Dead TESTED_BY code path removed

**Problem:** The structural indexer contained a per-file TESTED_BY detection branch -- code that was supposed to identify which test file tests which source file. However, this branch was never triggered at runtime. Only the separate cross-file TESTED_BY heuristic (which compares file names across the project) actually worked. The dead branch added confusion for anyone reading the code and represented logic that could never execute.

**Fix:** Removed the dead per-file branch entirely. The cross-file TESTED_BY heuristic, which is the one that actually produces results, was preserved unchanged.

### excludeGlobs option now actually works

**Problem:** The indexer exposed a configuration option called `excludeGlobs` -- a way to tell the indexer to skip certain files or directories during indexing (for example, vendor directories or auto-generated code). The option was accepted as input and appeared in the API, but it was never actually consulted during file discovery. It was a complete no-op: you could set it, but it had no effect.

**Fix:** Wired `excludeGlobs` into the recursive file discovery pipeline. Two new internal functions handle this: `globToRegExp()` converts glob patterns (like `**/vendor/**`) into regular expressions that can be tested against file paths, and `shouldExcludePath()` checks each discovered file against the exclusion list. The option was retained rather than removed because it has legitimate use cases and removing it would have been a breaking API change for anyone already passing the parameter.

### .zsh files now discoverable

**Problem:** The `.zsh` file extension was mapped to the `bash` language in the indexer's language table, meaning the system knew _how_ to parse `.zsh` files if given one. However, the default file discovery globs -- the patterns that tell the indexer which files to look for -- never included `**/*.zsh`. Zsh scripts were recognized if explicitly passed to the indexer, but could never be found automatically during a project scan. This meant zsh scripts were silently excluded from every code graph.

**Fix:** Added `**/*.zsh` to the default file discovery globs in `indexer-types.ts`, alongside the existing `**/*.sh` and `**/*.bash` patterns. Zsh scripts are now automatically discovered and indexed during project scans.

---

<details>
<summary><strong>Files Changed (2 files)</strong></summary>

| File | What changed |
|------|-------------|
| `mcp_server/lib/code-graph/structural-indexer.ts` | ParserAdapter interface and RegexParser wrapper class; new DECORATES, OVERRIDES, and TYPE_OF edge extraction logic; ghost SymbolKind extraction for method, variable, parameter, and module; dead per-file TESTED_BY branch removal; excludeGlobs wiring via `globToRegExp()` and `shouldExcludePath()` |
| `mcp_server/lib/code-graph/indexer-types.ts` | DECORATES, OVERRIDES, and TYPE_OF added to the EdgeType union type; `**/*.zsh` added to default file discovery globs |

</details>

## Upgrade

No migration required.
