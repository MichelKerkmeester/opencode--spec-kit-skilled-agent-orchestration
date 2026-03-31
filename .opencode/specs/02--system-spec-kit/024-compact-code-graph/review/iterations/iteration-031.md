# Review Iteration 031
## Dimension: D1 Correctness
## Focus: tree-sitter-parser.ts AST walk, node type mapping, edge cases

## New Findings

### [P1] F030 - TypeScript abstract methods are skipped entirely
File: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/tree-sitter-parser.ts:91-104`, `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/tree-sitter-parser.ts:340-365`

Evidence: `JS_TS_KIND_MAP` includes `method_definition` but not tree-sitter's `abstract_method_signature`, and `walkAST()` only treats mapped node types (plus `variable_declarator` / `lexical_declaration`) as relevant. A TypeScript sample `abstract class A { abstract foo(): Promise<void>; }` parses `foo` as `abstract_method_signature`, so no `method` node is emitted and downstream `CONTAINS` / `OVERRIDES` coverage stays incomplete for abstract APIs.

Fix: Add `abstract_method_signature` handling in the JS/TS kind map and regression-test abstract class members.

### [P1] F031 - `resolveKind()` misclassifies class and generator-function expressions assigned to variables
File: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/tree-sitter-parser.ts:300-317`

Evidence: `resolveKind()` only upgrades `variable_declarator` / `lexical_declaration` values when the RHS node type is `arrow_function`, `function_expression`, or `function`. Tree-sitter emits `class` for `const X = class {}` and `generator_function` for `const Y = function*() {}`, so both common JS/TS patterns currently fall through to `variable` and never become class/function symbols.

Fix: Extend `resolveKind()` to recognize `class` as `class` and `generator_function` as `function`, then add fixtures for `const`-assigned class/generator expressions.

### [P1] F032 - Import/export capture is incomplete for namespace, multi-specifier, and re-export forms
File: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/tree-sitter-parser.ts:162-196`, `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/tree-sitter-parser.ts:346-356`, `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/tree-sitter-parser.ts:420-436`, `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:386-418`

Evidence: `extractName()` returns only the first matching import binding and never handles `namespace_import`, so `import foo, * as ns from "m"` yields only `foo`, and `import { a, b as c }` yields only one symbol. Exports are also inconsistent: `extractName()` only understands export declarations, so `export { x, y as z } from "m3"` returns `null`; `walkAST()` then exits before the export-specific branch, so no export capture is emitted. By contrast, the regex parser emits one capture per imported/exported name. Declaration exports are also at risk of duplicate export captures because both the generic relevant-node path and the export-specific block push `export` nodes.

Fix: Stop routing imports/exports through single-name `extractName()`. Instead, emit one `RawCapture` per `import_specifier`, `namespace_import`, default import, and `export_specifier`, with dedicated tests for multi-name imports and re-exports.

### [P1] F033 - Python `decorated_definition` nodes are mis-typed and double-emitted
File: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/tree-sitter-parser.ts:106-112`, `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/tree-sitter-parser.ts:198-204`, `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/tree-sitter-parser.ts:346-381`, `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/tree-sitter-parser.ts:439-444`

Evidence: `PYTHON_KIND_MAP` hard-codes `decorated_definition` to `function`, while `extractName()` unwraps both decorated functions and decorated classes. `walkAST()` therefore first emits a capture for the wrapper itself, then the dedicated `decorated_definition` branch recurses into the inner `class_definition` / `function_definition` and emits that again. Decorated classes get a bogus `function` symbol for the class name, and decorated functions produce duplicate same-name/function captures.

Fix: Remove `decorated_definition` from the direct kind map and only visit the wrapped inner definition once, preserving the child's real kind while attaching decorator metadata there.

## Remediation Verification
- F005: FIXED — `walkAST()` now uses tree-sitter `startPosition` / `endPosition` directly for captures, and those ranges flow unchanged into `capturesToNodes()`.[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/tree-sitter-parser.ts:368-374`][SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/tree-sitter-parser.ts:489-503`] A runtime TS sample with a multi-line method body produced `endLine: 6`, so `extractEdges()` now sees the full body instead of a one-line slice.
- F008: PARTIAL — normal JS/TS class methods are now emitted because `method_definition` maps to `method`.[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/tree-sitter-parser.ts:91-104`] But TypeScript abstract methods still parse as `abstract_method_signature` and are skipped, so JS/TS method coverage is still incomplete.

## Iteration Summary
- New findings: 4 P1
- Verified fixes: 1
- Remaining active: 4
