# Iteration 16: normalized analytics replay schema and idempotent join keys

## Focus
Translate Claudest's analytics value into a Public reader-owned replay model that respects the current Stop-hook producer. The main question is which identifiers are trustworthy enough to prevent duplicate sessions and duplicate turns across repeated Stop fires. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:194-257] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/claude-transcript.ts:55-123]

## Findings
- `claudeSessionId` is the only currently trustworthy session key. It is read from stdin, persisted in hook state, and reused across Stop-hook updates; `speckitSessionId` exists in the type but is not filled by the Stop hook. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:191-216] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:16-19] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:166-171]
- `lastTranscriptOffset` is a session replay checkpoint, not a turn identifier. `parseTranscript()` returns only aggregate usage and `newOffset=fileSize`, so a future reader cannot key individual turns from that field alone. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/claude-transcript.ts:55-123]
- The safe additive schema is therefore split by ownership:
  - `sessions`: one row per `claudeSessionId`, plus latest persisted transcript identity, spec-folder hint, summary, and aggregate usage totals.
  - `turns`: replay-derived rows keyed by `(claude_session_id, transcript_path, byte_start)` or `(claude_session_id, transcript_path, line_no)`.
  - `model_pricing_versioned` and `cache_tier_normalized`: reader-owned lookup tables so cost logic can evolve without mutating hook-state history. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md:73-80] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:40-84]
- Idempotency should be proven by replaying the same transcript twice: first ingestion creates one `sessions` row and N `turns`; second ingestion updates replay checkpoint metadata but does not duplicate the prior turn rows. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:197-216] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/claude-transcript.ts:72-118]
- The portable contract from Claudest is the normalized reporting surface, not the HTML shell. Once Public has the reader-owned schema above, it can safely add spend, usage, hook-latency, and recommendation contracts without copying presentation code. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:40-84] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md:134-138]
- The reader packet should explicitly state that cache token fields are optional until the producer patch lands, but the schema must already have room for them so historical backfill does not require another migration. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/claude-transcript.ts:23-30] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:54-80]

## Ruled Out
- Using `lastTranscriptOffset` as the turn-level natural key. The parser never emits per-turn offsets today, so that would create false idempotency. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/claude-transcript.ts:55-123]

## Dead Ends
- No new dead-end path occurred. The main correction was separating replay checkpoint state from durable per-turn identity. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:209-216]

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/claude-transcript.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts`
- `.opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md`

## Reflection
- What worked and why: the reader contract became much clearer once I treated hook state as immutable evidence and the normalized tables as an additive projection. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md:103-110]
- What did not work and why: the earlier roadmap still blurred session totals and per-turn identity into one replay story, which is why `lastTranscriptOffset` looked more magical than it is. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/claude-transcript.ts:118-123]
- What I would do next: map the cached-summary fast path onto the current SessionStart surfaces with the same additive discipline. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:85-138]

## Recommended Next Focus
Place the cached-summary fast path inside the current startup/resume/compact surfaces without turning it into a replacement for `session_bootstrap()` or `memory_context(...resume...)`. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:88-129]
