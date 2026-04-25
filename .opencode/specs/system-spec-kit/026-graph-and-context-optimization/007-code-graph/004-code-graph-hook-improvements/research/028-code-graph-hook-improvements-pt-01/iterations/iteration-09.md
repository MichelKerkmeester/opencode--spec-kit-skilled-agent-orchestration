## Iteration 09
### Focus
Cross-runtime startup transport: structured graph payload exists but is mostly dropped.

### Findings
- `buildStartupBrief()` already constructs a `sharedPayload` envelope with startup provenance and a `structural-context` section, so the code-graph startup path has a machine-readable form in addition to the human text surface [.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/startup-brief.ts:200-255].
- Claude and Gemini `session-prime` handlers call `buildStartupBrief()` but then re-emit only `startupSurface`, `graphOutline`, and a stale warning as free-form sections; they never forward `sharedPayload` itself [.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:195-285; .opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:147-220].
- Copilot reduces startup priming even further to a single `startupSurface` string written into managed instructions, and Codex session-start wraps the same text sections into `additionalContext`, so no runtime gets the structured startup graph payload today [.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/session-prime.ts:171-219; .opencode/skill/system-spec-kit/mcp_server/hooks/codex/session-start.ts:153-176].

### New Questions
- Should runtime adapters surface `sharedPayload` side-channel metadata for diagnostics even when model-visible transport stays textual?
- Can Copilot custom instructions safely persist a compact JSON metadata block alongside the startup banner?
- Should Codex session-start diagnostics include graph trust/provenance rather than only `{surface,status,source,durationMs}`?
- Is OpenCode transport already the right structured-consumer model to mirror across other runtimes?

### Status
converging
