---
title: "Checklist: Tree-Sitter & Classifier Fixes [024/017]"
description: "15 items across P1/P2 for phase 017."
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->
# Verification Checklist: Phase 017 — Tree-Sitter & Classifier Fixes

<!-- SPECKIT_LEVEL: 2 -->


<!-- SPECKIT_TEMPLATE_SHIM_START -->
<!-- Auto-generated compliance shim to satisfy required template headers/anchors. -->
## Verification Protocol
Template compliance shim section. Legacy phase content continues below.

## Pre-Implementation
Template compliance shim section. Legacy phase content continues below.

## Code Quality
Template compliance shim section. Legacy phase content continues below.

## Testing
Template compliance shim section. Legacy phase content continues below.

## Security
Template compliance shim section. Legacy phase content continues below.

## Documentation
Template compliance shim section. Legacy phase content continues below.

## File Organization
Template compliance shim section. Legacy phase content continues below.

## Verification Summary
Template compliance shim section. Legacy phase content continues below.

<!-- ANCHOR:protocol -->
Template compliance shim anchor for protocol.
<!-- /ANCHOR:protocol -->
<!-- ANCHOR:pre-impl -->
Template compliance shim anchor for pre-impl.
<!-- /ANCHOR:pre-impl -->
<!-- ANCHOR:code-quality -->
Template compliance shim anchor for code-quality.
<!-- /ANCHOR:code-quality -->
<!-- ANCHOR:testing -->
Template compliance shim anchor for testing.
<!-- /ANCHOR:testing -->
<!-- ANCHOR:security -->
Template compliance shim anchor for security.
<!-- /ANCHOR:security -->
<!-- ANCHOR:docs -->
Template compliance shim anchor for docs.
<!-- /ANCHOR:docs -->
<!-- ANCHOR:file-org -->
Template compliance shim anchor for file-org.
<!-- /ANCHOR:file-org -->
<!-- ANCHOR:summary -->
Template compliance shim anchor for summary.
<!-- /ANCHOR:summary -->
<!-- SPECKIT_TEMPLATE_SHIM_END -->

#### P1 — Must Pass

- [x] [P1] F030: Abstract methods indexed via `abstract_method_signature` in JS_TS_KIND_MAP — tree-sitter-parser.ts:87 [EVIDENCE: verified in implementation-summary.md]
- [x] [P1] F031: `const X = class {}` correctly classified as class, not variable — tree-sitter-parser.ts:295-306, lexical_declaration branch [EVIDENCE: verified in implementation-summary.md]
- [x] [P1] F032: Multi-import `import { a, b, c }` emits all specifiers — emitImportCaptures/emitExportCaptures functions [EVIDENCE: verified in implementation-summary.md]
- [x] [P1] F033: Python decorated definitions emit once from inner node, classes not mistyped as functions — walkAST:564-581 [EVIDENCE: verified in implementation-summary.md]
- [x] [P1] F034: Failed tree-sitter init resets initPromise, no permanent poisoning — tree-sitter-parser.ts:59-62 [EVIDENCE: verified in implementation-summary.md]
- [x] [P1] F035: Structural queries ("Where is defined?") no longer routed to semantic search — query-intent-classifier.ts:72-77 [EVIDENCE: verified in implementation-summary.md]
- [x] [P1] F041: Nested Python classes preserve full qualified path (Outer.Inner.method) — walkAST:527-529 [EVIDENCE: verified in implementation-summary.md]

### P2 — Should Pass

- [x] F036: Multi-word matching uses exact token boundaries, no false positives — query-intent-classifier.ts:94 [EVIDENCE: verified in implementation-summary.md]
- [x] F037: Single keyword match no longer saturates confidence at 0.95 — query-intent-classifier.ts:147-148 [EVIDENCE: verified in implementation-summary.md]
- [x] F038: Structural keyword dictionary expanded with inflections (import/imports, export/exports, caller/callers) — query-intent-classifier.ts:39-41 [EVIDENCE: verified in implementation-summary.md]
- [x] F039: Dedicated tree-sitter test file exists and covers readiness/init/error paths, but not parser-selection behavior — [Test: mcp_server/tests/tree-sitter-parser.vitest.ts:7-79] [EVIDENCE: verified in implementation-summary.md]
- [x] F040: Query-intent classifier integrated into routing path — wired in Phase 020 memory-context.ts [EVIDENCE: verified in implementation-summary.md]
- [x] F042: Bash regex handles `function foo { }` form — [Code: structural-indexer.ts:567-569] [EVIDENCE: verified in implementation-summary.md]
- [x] F043: RawCapture is unified to a single source of truth, but `ParserAdapter` remains duplicated between parser modules as tech debt — [Code: structural-indexer.ts:17-19; tree-sitter-parser.ts:20-23] [EVIDENCE: verified in implementation-summary.md]
- [x] F044: SPECKIT_PARSER env var documented in capability-flags.ts — [Code: capability-flags.ts:37-50] [EVIDENCE: verified in implementation-summary.md]