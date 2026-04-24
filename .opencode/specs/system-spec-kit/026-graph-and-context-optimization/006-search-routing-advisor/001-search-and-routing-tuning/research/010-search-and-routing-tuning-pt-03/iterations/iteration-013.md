# Iteration 13: Narrow Key-File Junk-Pattern Filter Effectiveness

## Focus
Start with the least controversial `key_files` cleanup: reject command strings, version tokens, MIME values, and similar obvious non-path entries.

## Findings
1. `extractReferencedFilePaths()` currently accepts almost any backticked token that contains a dot-extension; it only excludes URLs, `./research/`, `../`, wildcards, and `...`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:320-334]
2. After resolving entries relative to the owning spec folder, the active corpus still contains 2,195 missing `key_files`. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
3. A narrow regex-only filter for command-shaped strings, version literals, MIME values, `_memory.continuity`, colon-delimited pseudo-fields, and `console.warn` removes 106 missing entries across 64 specs. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
4. This filter is worth keeping, but it is not the main fix. Most misses are still structurally path-like bare filenames such as `workflow.ts`, `context-server.ts`, and `memory-save.ts`. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]

## Ruled Out
- Treating the narrow junk-token filter as sufficient by itself.

## Dead Ends
- Repo-root-only existence checks. They still misclassify packet-local doc names.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:320-334`
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:463-471`
- Live filesystem scan over `.opencode/specs` on 2026-04-13

## Assessment
- New information ratio: `0.70`
- Questions addressed: `FQ-2`
- Questions answered: none yet

## Reflection
- What worked and why: separating regex-only wins from structural path-shape wins made the filter tradeoff easier to explain.
- What did not work and why: the narrow pass recovered too little to stand on its own.
- What I would do differently: gather top-miss examples earlier so the filter design starts from real strings instead of guessed classes.

## Recommended Next Focus
Test a stronger structural rule: reject non-canonical bare filenames unless they are one of the allowed packet docs.
