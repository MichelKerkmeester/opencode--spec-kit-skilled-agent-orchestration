<!-- SPECKIT_TEMPLATE_SOURCE: system-spec-kit templates | v2.2 -->
---
title: "Implementation Summary [system-spec-kit/024-compact-code-graph/015-tree-sitter-migration/implementation-summary]"
description: "Phase 015 delivered the adapter foundation, regex-based edge and SymbolKind improvements, and cleanup work. Tree-sitter default-parser follow-through landed later in Phase 017."
trigger_phrases:
  - "implementation"
  - "summary"
  - "implementation summary"
  - "015"
  - "tree"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "024-compact-code-graph/015-tree-sitter-migration"
    last_updated_at: "2026-04-24T15:33:48Z"
    last_updated_by: "claude-opus-4-7-spec-audit-2026-04-24"
    recent_action: "Spec audit + path reference remediation (Pass 1-3)"
    next_safe_action: "Continue systematic remediation or reindex"
    blockers: []

---
# Implementation Summary


<!-- SPECKIT_TEMPLATE_SHIM_START -->
<!-- Auto-generated compliance shim to satisfy required template headers/anchors. -->
## Metadata
Template compliance shim section. Legacy phase content continues below.

## What Was Built
Template compliance shim section. Legacy phase content continues below.

## How It Was Delivered
Template compliance shim section. Legacy phase content continues below.

## Key Decisions
Template compliance shim section. Legacy phase content continues below.

## Verification
Template compliance shim section. Legacy phase content continues below.

## Known Limitations
Template compliance shim section. Legacy phase content continues below.

<!-- ANCHOR:metadata -->
Template compliance shim anchor for metadata.
<!-- /ANCHOR:metadata -->
<!-- ANCHOR:what-built -->
Template compliance shim anchor for what-built.
<!-- /ANCHOR:what-built -->
<!-- ANCHOR:how-delivered -->
Template compliance shim anchor for how-delivered.
<!-- /ANCHOR:how-delivered -->
Template compliance shim anchor for decisions.
<!-- ANCHOR:decisions -->
Decision details are documented in the Key Decisions section above.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
Template compliance shim anchor for verification.
<!-- /ANCHOR:verification -->
<!-- ANCHOR:limitations -->
Template compliance shim anchor for limitations.
<!-- /ANCHOR:limitations -->
<!-- SPECKIT_TEMPLATE_SHIM_END -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata-2 -->
### Metadata
| Field | Value |
|-------|-------|
| **Spec Folder** | 015-tree-sitter-migration |
| **Completed** | 2026-03-31 (foundation); tree-sitter WASM completed in Phase 017 |
| **Level** | 2 |
<!-- /ANCHOR:metadata-2 -->

---

<!-- ANCHOR:what-built-2 -->
### What Was Built
Phase 015 established the migration foundation without claiming the later runtime switch. The structural indexer gained a clean adapter interface, three new regex-based relationship types, four previously ghost SymbolKinds, and targeted cleanup for dead code and discovery gaps. Tree-sitter becoming the default parser happened later in Phase 017.

### Parser Adapter Interface (Item 31)

A `ParserAdapter` interface (`parse(content, language): ParseResult`) abstracts the parsing backend. `RegexParser` wraps all existing regex logic. `getParser()` returns the active adapter based on `SPECKIT_PARSER` env var. In current code, `SPECKIT_PARSER` defaults to `treesitter`, and if tree-sitter init/import fails `getParser()` logs a warning and returns `new RegexParser()`. That default-parser and auto-fallback behavior was completed in Phase 017; the interface itself is the Phase 015 deliverable.

### New Edge Types (Item 33)

Three edge types added to the `EdgeType` union in `indexer-types.ts`:
- **DECORATES** (confidence 0.9): Detects `@decorator` patterns above functions/classes in Python and TypeScript.
- **OVERRIDES** (confidence 0.9): Detects class methods that shadow parent methods via extends chain tracking.
- **TYPE_OF** (confidence 0.85): Detects type annotations (`: TypeName`) and type references in function signatures.

All three use regex-based detection in `extractEdges()` and will gain AST precision when tree-sitter lands.

### Ghost SymbolKinds (Item 34)

Four SymbolKinds previously defined but never extracted are now emitted by the regex parser:
- **method**: Class methods in JS/TS (previously reported as `function`)
- **variable**: `const`/`let`/`var` declarations
- **parameter**: Function parameters with type annotations
- **module**: Module-level export patterns

### Indexer Cleanup (Items 36-38)

Dead per-file TESTED_BY branch removed (cross-file heuristic preserved). `excludeGlobs` was an exposed option that did nothing; now wired into recursive file discovery via `globToRegExp()` + `shouldExcludePath()`. `.zsh` was mapped to `bash` in the language table but never discovered; `**/*.zsh` added to default globs. Regex was later demoted to fallback in Phase 017, but it was not removed.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `lib/code-graph/structural-indexer.ts` | Modified | ParserAdapter, RegexParser, new edges, dead code removal, excludeGlobs wiring |
| `lib/code-graph/indexer-types.ts` | Modified | DECORATES/OVERRIDES/TYPE_OF, .zsh in default globs |
<!-- /ANCHOR:what-built-2 -->

---

<!-- ANCHOR:how-delivered-2 -->
### How It Was Delivered
Two Codex CLI agents (GPT-5.4, high reasoning) working in parallel. Agent 015-A handled the adapter interface and cleanup. Agent 015-C handled new edge types and SymbolKinds. Both ran concurrently with Phase 014 Wave 3 agents. Verified with 18/18 indexer tests and clean ESLint.
<!-- /ANCHOR:how-delivered-2 -->

---
### Key Decisions
| Decision | Why |
|----------|-----|
| Regex detection for new edge types (not waiting for tree-sitter) | DECORATES and TYPE_OF were good enough to ship in Phase 015. That delivered value immediately while leaving room for tree-sitter precision later. |
| Keep regex as fallback instead of fully removing it | Phase 017 showed that auto-falling back on tree-sitter init/import failure is safer than a hard failure. The adapter boundary made that resilience possible. |
| Wire excludeGlobs rather than remove | The option has legitimate use cases (excluding vendor directories, generated code). Removal would be a breaking API change. |
---

<!-- ANCHOR:verification-2 -->
### Verification
| Check | Result |
|-------|--------|
| `tests/code-graph-indexer.vitest.ts` | PASS (18/18) |
| ESLint on structural-indexer.ts, indexer-types.ts | PASS (0 errors) |
| Phase 015 checklist | Current state reflects Phase 015 foundation plus Phase 017 follow-through; only additional SymbolKinds remain deferred |
<!-- /ANCHOR:verification-2 -->

---

<!-- ANCHOR:limitations-2 -->
### Known Limitations
1. **Tree-sitter default-parser behavior was completed in Phase 017, not Phase 015.** Current code defaults `SPECKIT_PARSER` to `treesitter`, but init/import failures log a warning and auto-fall back to regex.
2. **OVERRIDES detection requires extends chain.** Only works when the parent class is defined in the same file or the extends relationship is captured. Cross-file inheritance detection is approximate.
3. **TYPE_OF captures type names, not resolved types.** Type aliases and re-exports may create edges to the alias rather than the underlying type.
4. **Regex was demoted to fallback, not removed.** `RegexParser` still exists in `structural-indexer.ts` with roughly 430 lines of parser logic.
5. **Additional SymbolKinds (decorator, property, constant) still deferred.** Live `SymbolKind` does not include these values yet, and no parser currently emits them.
<!-- /ANCHOR:limitations-2 -->
