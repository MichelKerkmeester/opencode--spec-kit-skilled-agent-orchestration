## Iteration 06

### Focus
Startup-surface parity across Claude, Gemini, and Copilot: compare the actual startup builders, not just the docs.

### Findings
- Claude's `handleStartup()` threads richer continuity state into the startup surface: it passes `session_id` and optional `specFolder` into `buildStartupBrief()`, inspects cached session-summary acceptance, and rewrites the memory line with rejection-specific wording. Evidence: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:188`, `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:197`, `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:218`, `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:226`, `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:235`
- Gemini's `handleStartup()` is materially thinner: it passes only `claudeSessionId`, never a `specFolder`, and it does not mirror Claude's cached-summary rejection handling or memory-line rewriting. Evidence: `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:129`, `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:133`, `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:146`, `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:181`
- Copilot's startup path is thinner still: `buildStartupBanner()` just calls `buildStartupBrief()` with no session or spec scope and writes the resulting banner into the managed instructions file. Evidence: `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/session-prime.ts:153`, `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/session-prime.ts:156`, `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/session-prime.ts:168`, `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/session-prime.ts:188`
- Codex is closer to Claude because its `SessionStart` adapter directly reuses Claude's startup-section builder, so the startup-surface drift is primarily Gemini and Copilot versus Claude/Codex rather than a fully four-way split. Evidence: `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/session-start.ts:18`, `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/session-start.ts:19`, `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/session-start.ts:155`, `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/session-start.ts:159`

### New Questions
- Is the lighter Gemini/Copilot startup surface intentional because of transport limits, or accidental drift from earlier implementations?
- Should `buildStartupBrief()` take a shared runtime-agnostic state scope object so Gemini and Copilot can pass the same continuity hints as Claude?
- Do any packet docs still over-promise full startup parity across all four runtimes?
- Would harmonizing startup surfaces reduce the need for runtime-specific recovery caveats in operator docs?

### Status
converging
