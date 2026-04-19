# Iteration 19: portable token-insight contracts after normalized analytics

## Focus
Narrow the token-observability import down to contracts Public can actually honor once a normalized reader exists. This is about contract shape, not about copying Claudest's presentation layer or overpromising cross-session metrics before the reader lands. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:40-133] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md:134-138]

## Findings
- Public already exposes the beginnings of a token contract. `response-hints.ts` can aggregate prompt, completion, cache-creation, cache-read, and total tokens from surfaced envelopes and attach `tokenCount` metadata, which means the future analytics reader does not start from zero. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:40-84] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:122-133]
- The portable contract set remains the same as the earlier Claudest synthesis, but generation 2 can now state the dependency explicitly:
  - `trends`
  - `skill_usage`
  - `agent_delegation`
  - `hook_performance`
  - `findings`
  - `recommendations`
  These become safe only after normalized replay makes their cross-session fields queryable. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:86-133] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md:134-138]
- Cache-tier pricing is the highest-leverage sub-contract. Public's current Stop-hook packet explicitly says cost estimation omits cache pricing, so the analytics reader should elevate cache-read/cache-write costs to first-class fields before any dashboard or recommendations layer depends on them. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md:134-138] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/claude-transcript.ts:95-106]
- Hook latency and surfaced token counts are already aligned enough to be carried forward. `response-hints.ts` attaches `latencyMs` and aggregate token counts to auto-surfaced payloads, which makes `hook_performance` a realistic early contract once session/turn normalization exists. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:111-128]
- Presentation remains out of scope. The portable layer is typed JSON payloads and documented field semantics; any HTML, charting, theme, or widget layer should come later and be designed around Public's own product surface. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:86-133]

## Ruled Out
- Treating the dashboard shell as part of the adoption contract. Public should borrow field semantics and recommendation logic, not an embedded UI. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md:134-138]

## Dead Ends
- No new dead-end path occurred. The main correction was tying each contract to an explicit analytics-reader dependency instead of implying they are available immediately from hook state. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md:134-138]

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/claude-transcript.ts`
- `.opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md`

## Reflection
- What worked and why: the existing envelope metadata was enough to keep this pass grounded in current Public capabilities instead of hypothetical reporting. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:122-133]
- What did not work and why: the earlier synthesis risked making the contract list feel immediately available, when in reality only fragments are available until normalized replay exists. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md:134-138]
- What I would do next: collapse generation-2 findings into a dependency-ordered roadmap with acceptance gates per packet. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md:118-127]

## Recommended Next Focus
Convert the generation-2 contracts into a packet order with entry conditions and acceptance gates so implementation can begin without reopening research. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:123-145]
