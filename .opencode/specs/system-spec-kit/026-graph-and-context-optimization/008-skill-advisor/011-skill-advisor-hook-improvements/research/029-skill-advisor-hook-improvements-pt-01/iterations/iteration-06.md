## Iteration 06

### Focus
Hook telemetry: what is emitted, where it goes, and whether any health/alerting surface is actually wired.

### Findings
- The diagnostic schema only captures runtime, status, freshness, duration, cache hit, error code/details, skill label, and generation; it does not include sink metadata or downstream outcome fields. Citation: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts:41`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts:52`.
- All runtime hooks emit diagnostics by serializing that record straight to stderr; none of the handlers in the investigated hook surfaces persist or aggregate those records. Citation: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:88`, `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:97`, `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts:102`, `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:156`.
- The metrics module defines a rolling health section plus alert thresholds, but repo search only found production references inside `lib/metrics.ts`; external consumption is test-only. Citation: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts:194`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts:264`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/legacy/advisor-observability.vitest.ts:115`.
- This leaves observability in a write-only state: diagnostics exist, but operators and adaptive systems do not get a durable health feed from the shipped surfaces. Citation: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts:254`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts:271`.

### New Questions
- Where should hook diagnostic JSONL land so health can be queried instead of inferred from stderr?
- Should `advisor_status` or a new MCP tool expose rolling hook health and alert-threshold breaches?
- Is there an intended retention policy for per-runtime hook diagnostics?
- Should the OpenCode plugin status tool expose the same health rollups as the native advisor surfaces?

### Status
converging
