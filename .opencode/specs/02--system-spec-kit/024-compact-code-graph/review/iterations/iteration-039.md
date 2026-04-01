# Review Iteration 039
## Dimension: D1 Correctness
## Focus: Python/Bash tree-sitter parsing edge cases
## New Findings
### [P1] F033 (confirmed) - Decorated Python definitions are double-emitted, and decorated classes get a bogus function symbol
- File: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/tree-sitter-parser.ts:106-112,198-204,340-443`
- Evidence: `PYTHON_KIND_MAP` classifies `decorated_definition` as `function`, so `visit()` emits a symbol for the wrapper node, then the dedicated `decorated_definition` branch immediately descends into the inner `function_definition`/`class_definition` and emits that symbol again. A tree-sitter probe shows both `@property @classmethod def foo(...)` and `@decorator class C:` are wrapped in `decorated_definition`, so this creates duplicate symbols for decorated functions/methods and an extra spurious `function` node for decorated classes.
- Fix: Do not emit `decorated_definition` as its own symbol. Either remove it from `PYTHON_KIND_MAP` and only unwrap it in the dedicated branch, or resolve its kind/name from the inner definition before emitting exactly one capture.
- Note: This confirms F033 from iteration 031 with additional evidence from tree-sitter probe.

### [P1] F041 - Nested Python class methods lose the outer class qualifier
- File: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/tree-sitter-parser.ts:340-385`; `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:753-755,879-886`
- Evidence: When a class is visited, recursion uses `visit(child, name)` with only the immediate class name. For `class Outer: class Inner: def method(...)`, the inner class is captured as `Outer.Inner`, but its method is captured with `parentName = "Inner"`, producing `Inner.method` instead of `Outer.Inner.method`. That breaks fully qualified symbol IDs and can misattach `CONTAINS`/`OVERRIDES` edges whenever nested class names overlap.
- Fix: Thread the fully qualified class path through recursion, e.g. `const fqClassName = parentClassName ? \`\${parentClassName}.\${name}\` : name`, and use that for nested class descent and child parameter ownership.

### [P2] F042 - Bash regex fallback misses valid `function foo { ... }` declarations
- File: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:549-558,623-645`
- Evidence: `parseBash()` only matches `^(?:function\\s+)?(\\w+)\\s*\\(\\s*\\)`, which recognizes `foo() {}` but not the valid Bash form `function foo {}`. A tree-sitter probe shows both forms parse as `function_definition`, so when tree-sitter initialization fails or `SPECKIT_PARSER=regex` is used, one legal function form silently disappears from the code graph.
- Fix: Expand the fallback regex to accept both declaration styles, e.g. match either `function foo` or `foo()` before the body opener, and keep the existing brace-span logic for end-line detection.

## Remediation Verification
(N/A)

## Iteration Summary
- New findings: P1 x1 new + 1 confirmation, P2 x1
- Verified fixes: 0
- Remaining active: 2 new + 1 confirmed
