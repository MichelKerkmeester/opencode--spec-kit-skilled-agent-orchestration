# Iteration 12: Where the Graph-First Nudge Should Live

## Focus
This iteration answers Q14 by locating the actual runtime surfaces that can steer Public toward graph-first retrieval. The important design question is not "can we copy graphify's PreToolUse hook?" but "which existing Public runtime paths already inject routing guidance, and which of them are durable across Claude startup, resume, compacting, and post-response hinting?"

## Findings

### Finding 37
Public already has a post-response hinting surface. `response-hints.ts` appends auto-surface hints to the response envelope and stores `meta.autoSurface` with counts, latency, surfaced-at timestamps, and token counts. That makes it the best generic place for a graph-first nudge that depends on what the system actually did, not just what the user asked. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:86-133]

### Finding 38
Public also has an explicit Claude startup and resume injection path. `session-prime.ts` injects compact recovery context, structural context, recovery tools, and stale warnings directly into startup and resume flows, which means graph-first steering can happen before the first raw-file search is ever attempted. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:35-157]

### Finding 39
The pre-compact path is already context-aware. `compact-inject.ts` extracts file paths, topics, attention signals, active spec folder, and then builds merged context from codeGraph, cocoIndex, and session state. This is a stronger place than a raw PreToolUse hook to keep graph-first retrieval sticky under token pressure. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:45-68; .opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:74-124; .opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:205-259]

### Finding 40
Bootstrap and resume already surface actionable guidance through `hints`, `nextActions`, `graphOps`, and structural-context fields. That means the graph-first nudge should be layered: generic recovery guidance in bootstrap/resume, Claude-specific startup guidance in session-prime, and response-time reinforcement in response-hints. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:68-100; .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:203-217; .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:139-143; .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:200-213]

## Cross-Phase Overlap Handling
- This iteration stayed inside hook and bootstrap files already owned by Public instead of proposing a new tool surface.
- It deliberately avoided copying graphify's literal PreToolUse matcher because Public already has broader, richer runtime injection points.

## Exhausted / Ruled-Out Directions
- I looked for a single best hook location and ruled out a single-location design. Public's runtime already has three complementary steering layers: startup/resume, pre-compact, and post-response hints. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:35-157; .opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:205-259; .opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:86-133]

## Final Verdict on Q14
Public's graph-first nudge should not live in one copied PreToolUse hook. The best current path is a layered design: startup and resume guidance in `session-prime.ts`, durable recovery guidance in bootstrap/resume handler payloads, compact-preserving reinforcement in `compact-inject.ts`, and post-response behavioral nudges in `response-hints.ts`.

## Tools Used
- `sed -n`
- `rg -n`
- `nl -ba`

## Sources Queried
- `.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:86-133`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:35-157`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:45-68`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:74-124`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:205-259`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:68-100`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:203-217`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:139-143`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:200-213`
