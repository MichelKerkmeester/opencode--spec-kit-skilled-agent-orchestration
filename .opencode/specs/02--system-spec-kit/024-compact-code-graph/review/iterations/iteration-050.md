# Review Iteration 050
## Dimension: D4 Architecture
## Focus: Cross-phase integration coherence — circular deps, layering, tool registration completeness

## Findings

### [P2] F067 - Circular dependency between tree-sitter-parser.ts and structural-indexer.ts resolved via dynamic import
- File: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:650-651
- Evidence: tree-sitter-parser.ts imports `extractEdges`, `capturesToNodes`, and `RawCapture` from structural-indexer.ts. In the reverse direction, structural-indexer.ts dynamically imports TreeSitterParser via `await import('./tree-sitter-parser.js')` to avoid the circular reference. This pattern works but is fragile — any refactoring that converts the dynamic import to a static one will create a circular dependency error at startup. Additionally, the `RawCapture` type originates in structural-indexer.ts and flows to tree-sitter-parser.ts, creating a tight coupling between parser and indexer.
- Fix: Accept as-is with documentation, or extract shared types (RawCapture, ParserAdapter) into indexer-types.ts to break the cycle entirely. This aligns with the existing F043 finding.

### [P2] F068 - Gemini hooks not exported from hooks/index.ts barrel
- File: .opencode/skill/system-spec-kit/mcp_server/hooks/index.ts
- Evidence: The hooks barrel (hooks/index.ts) does not export anything from the gemini/ subdirectory. The gemini hooks are standalone scripts (each has `#!/usr/bin/env node` and a main() entrypoint) and are invoked directly by the Gemini CLI hook system, so they don't need barrel exports. However, this means they're invisible to the TypeScript module graph for refactoring tools.
- Fix: This is by design — Gemini hooks are CLI scripts, not library modules. No action needed, but add a comment in hooks/index.ts noting the Gemini hooks are CLI-invoked, not module-imported.

### [P2] F069 - session-resume.ts lazy-loaded via handlers/index.ts but session_resume tool schema hardcoded
- File: .opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:80, tool-schemas.ts
- Evidence: The session-resume handler is lazy-loaded via the handlers/index.ts barrel pattern, and the session_resume tool is registered in tool-schemas.ts. The tool schema registration is static and won't fail. However, the lazy loading pattern means the first call to session_resume has higher latency due to module import overhead — this could be 50-200ms on first call.
- Fix: Accept as-is — lazy loading is the established pattern for all handlers, and 50-200ms on first call is acceptable.

## Verified Correct (Architecture)
- Layer separation: handlers/ (MCP tool interface) → lib/ (business logic) → hooks/ (lifecycle scripts) — clean separation maintained across all phases
- code-graph/index.ts barrel correctly exports all lib modules except ensure-ready.ts (intentional — used only by handlers)
- handlers/index.ts uses lazy loading for ALL handler modules — consistent pattern
- context-server.ts is the single dispatcher — all tool calls flow through it, including metrics recording
- No circular dependencies at the module level (tree-sitter ↔ structural-indexer resolved via dynamic import)
- runtime-detection.ts is consumed by 2 test files and hooks — properly placed in code-graph/ since it detects hook policy
- query-intent-classifier.ts is consumed by memory-context.ts handler — proper handler→lib dependency direction
- ensure-ready.ts is consumed by 3 handlers (context, query, status) — proper handler→lib direction
- context-metrics.ts is consumed by context-server.ts and session-health handler — proper lib→handler consumption
- All new tool schemas (session_health, session_resume) are registered in tool-schemas.ts
- Gemini hooks correctly reuse Claude shared helpers (hookLog, truncateToTokenBudget, formatHookOutput) while adding Gemini-specific stdin/stdout handling

## Iteration Summary
- New findings: 3 (P2)
- Items verified correct: 11
- Reviewer: Claude Opus 4.6 (1M context)
