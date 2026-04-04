# Claude Code Graph Runtime Retest

**Runtime:** Claude Code
**Repo Root:** `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`
**Goal:** Verify the current startup-surface and bounded code-graph behavior in the live Claude runtime without making code changes.

## Instructions

Do not make code changes. You may read files, call MCP tools, and run safe shell commands. Be evidence-based and quote exact startup text and exact readiness output. Do not create commits.

Read these files first:

- `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts`

## What To Verify

1. The Claude startup hook still injects the shared startup surface.
2. The startup surface reports freshness-aware graph status instead of count-only health.
3. The startup surface includes the startup-snapshot note.
4. `session_resume({ minimal: true })` still returns freshness-aware graph status.
5. `code_graph_query` still returns a `readiness` block.
6. Small stale deltas still trigger bounded inline `selective_reindex` when safe.
7. Empty or broadly stale cases still stay on the explicit `code_graph_scan` path instead of inline full scans.

## Required Test Flow

1. Report the exact startup context you received at session start.
2. Confirm whether the startup surface includes the idea:
   `Note: this is a startup snapshot; later structural reads may differ if the repo state changed.`
3. Call `session_resume({ minimal: true })` and capture:
   - `codeGraph.status`
   - payload summary
   - structural context summary
4. Run one structural read with `code_graph_query`.
5. Capture the exact `readiness` object from the structural read.
6. If the first structural read reports `full_scan` because the graph is empty or broadly stale, run `code_graph_scan` once to establish a clean baseline before the small-delta retest.
7. Touch one already-tracked test file under:
   `.opencode/skill/system-spec-kit/mcp_server/tests/`
8. Wait for the debounce window to expire, then rerun `code_graph_query`.
9. Confirm whether the second read now shows:
   - `freshness=stale`
   - `action=selective_reindex`
   - `inlineIndexPerformed=true`
10. If the graph stays in `full_scan`, explain exactly why from the returned `reason` field instead of guessing.

## Output Format

- Startup context
- Startup snapshot check
- `session_resume` evidence
- Structural read evidence
- Small stale-delta evidence
- Verdict

Be explicit about whether Claude currently receives both:

- the freshness-aware startup surface
- the bounded code-graph readiness behavior
