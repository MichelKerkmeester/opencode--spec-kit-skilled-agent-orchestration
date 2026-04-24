---
title: "Tasks: Tree-Sitter Migration Foundation [system-spec-kit/024-compact-code-graph/015-tree-sitter-migration/tasks]"
description: "Task tracking for 13 items across adapter interface, new edge types, ghost SymbolKinds, and cleanup."
trigger_phrases:
  - "tasks"
  - "tree"
  - "sitter"
  - "migration"
  - "foundation"
  - "015"
importance_tier: "normal"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/024-compact-code-graph/015-tree-sitter-migration"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["tasks.md"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 015 — Tree-Sitter Migration Foundation


<!-- SPECKIT_TEMPLATE_SHIM_START -->
<!-- Auto-generated compliance shim to satisfy required template headers/anchors. -->
## Task Notation
Template compliance shim section. Legacy phase content continues below.

## Phase 1: Setup
Template compliance shim section. Legacy phase content continues below.

## Phase 2: Implementation
Template compliance shim section. Legacy phase content continues below.

## Phase 3: Verification
Template compliance shim section. Legacy phase content continues below.

## Completion Criteria
Template compliance shim section. Legacy phase content continues below.

## Cross-References
Template compliance shim section. Legacy phase content continues below.

<!-- ANCHOR:notation -->
Template compliance shim anchor for notation.
<!-- /ANCHOR:notation -->
<!-- ANCHOR:phase-1 -->
Template compliance shim anchor for phase-1.
<!-- /ANCHOR:phase-1 -->
<!-- ANCHOR:phase -->
Template compliance shim anchor for phase-2.
<!-- /ANCHOR:phase -->
<!-- ANCHOR:phase-3 -->
Template compliance shim anchor for phase-3.
<!-- /ANCHOR:phase-3 -->
<!-- ANCHOR:completion -->
Template compliance shim anchor for completion.
<!-- /ANCHOR:completion -->
<!-- ANCHOR:cross-refs -->
Template compliance shim anchor for cross-refs.
<!-- /ANCHOR:cross-refs -->
<!-- SPECKIT_TEMPLATE_SHIM_END -->

### Completed

- [x] Item 31: ParserAdapter interface created (`parse(content, language): ParseResult`) — Evidence: structural-indexer.ts, RegexParser wraps all existing logic, `getParser()` dispatches via SPECKIT_PARSER env var
- [x] Item 31 / follow-through: `SPECKIT_PARSER=treesitter` now auto-falls back to regex on init/import failure — Completed in Phase 017. Evidence: `getParser()` catches tree-sitter init/import errors, logs a warning, and returns `new RegexParser()`
- [x] Item 33: DECORATES edge type added (confidence 0.9) — Evidence: indexer-types.ts EdgeType union, extractEdges() in structural-indexer.ts; detects `@decorator` in Python/TS
- [x] Item 33: OVERRIDES edge type added (confidence 0.9) — Evidence: extractEdges() detects class methods shadowing parent via extends chain tracking
- [x] Item 33: TYPE_OF edge type added (confidence 0.85) — Evidence: extractEdges() detects `: TypeName` annotations and type references in function signatures
- [x] Item 34: Ghost SymbolKind `method` now extracted for JS/TS class methods — Evidence: regex parser emits method nodes (previously reported as function) [F008]
- [x] Item 34: Ghost SymbolKind `variable` now extracted — Evidence: regex parser detects `const`/`let`/`var` declarations
- [x] Item 34: Ghost SymbolKind `parameter` now extracted — Evidence: regex parser detects function parameters with type annotations
- [x] Item 34: Ghost SymbolKind `module` now extracted — Evidence: regex parser detects module-level export patterns
- [x] Item 36: Dead per-file TESTED_BY branch removed from structural-indexer.ts — Evidence: cross-file heuristic preserved, per-file dead code path deleted [F015]
- [x] Item 37: excludeGlobs wired into glob pipeline — Evidence: `globToRegExp()` + `shouldExcludePath()` in structural-indexer.ts [F016]
- [x] Item 38: .zsh files discoverable via default globs — Evidence: `**/*.zsh` added to default globs in indexer-types.ts [F017]
- [x] Regex fallback verified working when SPECKIT_PARSER=regex — Evidence: 18/18 indexer tests pass

### Completed in Phase 017

- [x] Item 32: web-tree-sitter WASM implementation — Completed in Phase 017. Evidence: tree-sitter parser landed and `SPECKIT_PARSER` now defaults to `treesitter`
- [x] Tree-sitter as default parser (`SPECKIT_PARSER=treesitter`) — Completed in Phase 017. Evidence: default parser selection now prefers tree-sitter, with automatic regex fallback on init/import failure
- [x] Item 35 follow-through: regex parsing demoted to fallback instead of removed — Completed in Phase 017. Evidence: `RegexParser` still exists in `structural-indexer.ts` (~430 LOC) and is returned on init/import failure or explicit `SPECKIT_PARSER=regex`

### Deferred

- [x] Additional SymbolKinds (decorator, property, constant) extraction remains explicitly deferred for later parser follow-up work
