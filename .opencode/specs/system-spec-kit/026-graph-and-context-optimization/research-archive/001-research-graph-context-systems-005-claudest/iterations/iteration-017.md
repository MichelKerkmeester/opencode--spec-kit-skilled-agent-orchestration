# Iteration 17: SessionStart cached-summary fast path mapped to Public startup surfaces

## Focus
Identify exactly where a Claudest-style cached summary can land inside Public's existing startup and resume flows. The key constraint is additive placement: augment the current hook outputs, do not replace the explicit recovery tools that Public already relies on. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:85-168] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:88-129]

## Findings
- Public already separates startup, resume, clear, and compact routing. `session-prime.ts` dispatches per source and uses startup/resume as tool-guidance and continuity surfaces, not as active retrieval calls. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:85-168]
- The current startup brief is intentionally shallow. `buildStartupSurface()` says "session continuity available" or "startup summary only (resume on demand)," and `buildSessionContinuity()` only emits `lastSpecFolder` plus a truncated `sessionSummary`. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:88-129] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:179-193]
- That means the safest Claudest-style import is a cached-summary augmentation on `resume` and `compact`, plus an optional startup brief hint when a fresh deterministic summary is available. It should not replace the current instruction to call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })`. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:66-83] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:140-167]
- The producer seam for that cached summary is already nearby. `generateContextSummary()` and `buildContinueSessionData()` create bounded summary structures in the script layer, so Public can compute a deterministic "resume brief" at save time instead of building a new LLM summarizer. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:572-683]
- This preserves the explicit design from `024/002`: startup remains a lightweight orientation surface, resume remains explicit, clear stays minimal, and compact keeps the cached payload path. The improvement is simply that the continuity summary becomes richer and cheaper to inject. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/024-compact-code-graph/002-session-start-hook/implementation-summary.md:68-83]

## Ruled Out
- Replacing `session_bootstrap()` or `memory_context(...resume...)` with a hook-only recency heuristic. Public's existing recovery surfaces remain the source of truth. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/024-compact-code-graph/002-session-start-hook/implementation-summary.md:73-76]

## Dead Ends
- No new dead-end path occurred. The correction was placement, not capability: the fast path belongs inside current source-aware routing, not beside it as a separate recovery system. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:186-206]

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts`
- `.opencode/specs/system-spec-kit/024-compact-code-graph/002-session-start-hook/implementation-summary.md`
- `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts`

## Reflection
- What worked and why: the current startup/resume separation is already clean, so the mapping exercise turned into finding the smallest richer continuity payload rather than arguing about a new hook model. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/024-compact-code-graph/002-session-start-hook/implementation-summary.md:68-83]
- What did not work and why: the Claudest phrase "automatic context injection" still tempts a wholesale replacement framing, but Public's source already shows that startup guidance and explicit resume tools are deliberate. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:101-108]
- What I would do next: map the verifier/discoverer split onto Public's script-side signal extraction and post-save review boundaries. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:208-360]

## Recommended Next Focus
Define where discovery ends and verification begins in Public so Claudest's auditor/discoverer split becomes an implementation contract rather than an inspiration note. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/008-signal-extraction/implementation-summary.md:35-54]
