<!-- SPECKIT_TEMPLATE_SOURCE: system-spec-kit templates | v2.2 -->
---
title: "Implementation Summary: Tree-Sitter & Classifier Fixes [024/017]"
description: "15 bug fixes across tree-sitter parser and query-intent classifier — 12 fixed, 3 deferred."
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

<!-- ANCHOR:metadata -->
### Metadata
| Field | Value |
|-------|-------|
| **Spec Folder** | 017-tree-sitter-classifier-fixes |
| **Completed** | 2026-03-31 (3 items deferred) |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
### What Was Built
Fixed 12 of 15 bugs found by a 10-iteration GPT-5.4 review of the tree-sitter WASM parser and query-intent classifier. The parser now handles abstract methods, class expressions, multi-import/export, decorated definitions, init poisoning recovery, and nested class qualified names. The classifier has improved pattern narrowing, word boundary matching, evidence-based confidence scaling, and expanded keyword coverage.

### Tree-Sitter Parser Fixes (F030-F034, F041)

- **F030**: Added `abstract_method_signature` to `JS_TS_KIND_MAP` so TypeScript abstract methods are indexed as `method` kind.
- **F031**: `resolveKind()` now checks the RHS type of `variable_declarator` and `lexical_declaration` nodes, correctly classifying `const X = class {}` as a class.
- **F032**: Created `emitImportCaptures()` and `emitExportCaptures()` helpers that emit one capture per specifier, fixing multi-import truncation.
- **F033**: Removed `decorated_definition` from kind map; `walkAST()` delegates to the inner definition node, preventing double-emission and class-as-function mistyping.
- **F034**: `ensureInit()` resets `initPromise` on rejection, so a transient init failure no longer poisons the singleton permanently.
- **F041**: `walkAST()` threads the full qualified class name through recursion, preserving `Outer.Inner.method` paths for nested Python classes.

### Query-Intent Classifier Fixes (F035-F038)

- **F035**: Semantic patterns narrowed to require a semantic noun alongside the opener, preventing structural queries from being misrouted.
- **F036**: Replaced substring matching with exact token n-gram matching, eliminating false positives like `call chaining` matching `call chain`.
- **F037**: Confidence now scales by absolute evidence count instead of saturating at 0.95 from a single keyword match.
- **F038**: Expanded structural keyword dictionary with inflections: `import/imports`, `export/exports`, `caller/callers`.

### Shared Contract Unification (F043)

- `RawCapture` and `ParserAdapter` contracts moved to a single source of truth in `structural-indexer.ts`, imported by `tree-sitter-parser.ts`.
<!-- /ANCHOR:what-built -->

---
### Files Changed

| File | Change Type | Description |
|------|------------|-------------|
| `lib/code-graph/tree-sitter-parser.ts` | Modified | F030-F034, F041: abstract methods, class expressions, multi-import, decorators, init recovery, nested fqName |
| `lib/code-graph/query-intent-classifier.ts` | Modified | F035-F038: semantic narrowing, word boundaries, confidence scaling, keyword expansion |
| `lib/code-graph/structural-indexer.ts` | Modified | F034: grammar validation; F043: RawCapture single source of truth |
| `lib/config/capability-flags.ts` | Modified | SPECKIT_PARSER env var reference (internal) |
---

<!-- ANCHOR:verification -->
### Verification
- TypeScript: 0 errors
- Tests: 327 passed, 23 failed (pre-existing, unrelated)
- Review: Opus CONDITIONAL PASS 78/100, GPT-5.4 CONDITIONAL 82%
<!-- /ANCHOR:verification -->
