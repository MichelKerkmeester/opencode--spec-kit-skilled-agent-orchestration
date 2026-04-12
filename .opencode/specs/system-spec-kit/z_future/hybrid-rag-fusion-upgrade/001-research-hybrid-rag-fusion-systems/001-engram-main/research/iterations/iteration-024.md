# Iteration 024: COMPACTION & CONTEXT SURVIVAL

## Focus
COMPACTION & CONTEXT SURVIVAL: How does this system handle context window limits, compaction events, and startup context reconstruction? Lessons for our compaction survival.

## Findings
### Finding 1: Engram treats compaction survival as a runtime-integration problem, not a search-ranking problem
- **Source**: `001-engram-main/external/docs/AGENT-SETUP.md:23-61,65-105,145-169,311-372`; `001-engram-main/external/plugin/opencode/engram.ts:397-447`; `001-engram-main/external/plugin/claude-code/hooks/hooks.json:1-64`
- **What it does**: Engram wires compaction recovery into the delivery layer for each client: OpenCode gets always-on system instructions plus an `experimental.session.compacting` hook, Claude Code gets `SessionStart`/`compact` hooks, and Codex/Gemini setup writes persistent instruction files and compact-prompt files. The recovery rule is stable across all of them: after compaction or context reset, recover with `mem_context` before resuming work.
- **Why it matters**: The transferable lesson is architectural: compaction survival belongs in runtime hooks, startup prompts, and transport adapters that survive resets, not in `mem_search` itself. Public is already on this path with `.opencode/plugins/spec-kit-compact-code-graph.js` and the session bootstrap/resume surfaces, so the right move is to keep strengthening transport-owned recovery instead of widening retrieval tools.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 2: Engram's post-compaction checkpoint is clever but too agent-dependent to copy directly
- **Source**: `001-engram-main/external/plugin/opencode/engram.ts:423-447`; `001-engram-main/external/plugin/claude-code/scripts/post-compaction.sh:30-88`; `001-engram-main/external/DOCS.md:470-477`
- **What it does**: When compaction fires, Engram injects previous-session context and a "FIRST ACTION REQUIRED" instruction telling the next agent to immediately call `mem_session_summary` with the compacted summary, then call `mem_context`, and only then continue. This turns compaction into an explicit checkpoint handoff without needing a separate reducer or out-of-band state file.
- **Why it matters**: The upside is portability: even thin MCP clients can persist a checkpoint if the agent follows the instruction. The downside is authority and brittleness: continuity depends on the next model step doing a write correctly. Public already has a stronger fail-closed direction with transport-only startup/compaction payloads, structural trust labels, and additive cached continuity inside `session_resume`/`session_bootstrap`, so it should not shift compaction recovery onto model-authored writeback.
- **Recommendation**: reject
- **Impact**: high

### Finding 3: Engram's startup reconstruction works because `mem_context` is deterministic, bounded, and easy to scan
- **Source**: `001-engram-main/external/internal/store/store.go:818-840,1076-1105,1145-1175,1613-1667`; `001-engram-main/external/plugin/claude-code/scripts/session-start.sh:39-99`; `001-engram-main/external/internal/mcp/mcp.go:375-395`
- **What it does**: `FormatContext()` builds one predictable block with up to 5 recent sessions, 10 recent prompts, and `MaxContextResults` recent observations (default 20), truncating summaries/prompts to 200 chars and observations to 300 chars before returning the prose digest that `mem_context` exposes. Claude's startup hook then fetches that digest and injects it alongside the memory protocol at session start.
- **Why it matters**: Compaction survival is not just "search again later"; it is having a bounded continuity surface the agent can actually consume at startup. Public's richer `session_resume` output is more capable, but it is also heavier. Engram reinforces the Phase 022 recommendation: land a deterministic recent-session digest inside `session_resume` and reuse it in `session_bootstrap` and transport startup/compaction blocks.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 4: Public already has the stronger substrate for bounded, trust-labeled compaction continuity
- **Source**: `.opencode/plugins/spec-kit-compact-code-graph.js:185-223,323-417`; `.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:82-155`; `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:33-45,51-128,205-258`; `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:250-300,419-557`; `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:409-597`; `.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:101-131`
- **What it does**: Public builds transport-only startup/message/compaction blocks from shared payload envelopes, caches and dedupes them in the OpenCode plugin, enforces token budgets on auto-surfaced priming output, computes structural bootstrap contracts with explicit `ready`/`stale`/`missing` states, and exposes additive continuity through `session_resume`, `session_bootstrap`, and `session_health`.
- **Why it matters**: This is a better foundation than Engram's raw prose injection because it separates continuity payloads from retrieval authority and keeps provenance/trust visible. The Engram lesson here is not "copy the mechanism"; it is "finish the last mile" by making Public's startup and compaction surfaces more deterministic and more obviously action-oriented.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 5: Engram's cross-runtime "surviving compaction" snippets are packaging worth borrowing
- **Source**: `001-engram-main/external/docs/AGENT-SETUP.md:147-169,211-230,311-372`; `001-engram-main/external/plugin/opencode/engram.ts:45-122`
- **What it does**: Engram does not rely only on hooks. It also distributes tiny runtime-specific instruction snippets for Claude, OpenCode, Gemini, Codex, VS Code, Cursor, Windsurf, and Antigravity that all teach the same recovery habit: save proactively and call `mem_context` after compaction/context reset. The OpenCode plugin embeds the full memory protocol directly into the system prompt so the rule survives compaction even on models that only accept one system message.
- **Why it matters**: Public's non-hook recovery story is presently stronger in the MCP/tooling layer than in portable prompt packaging. Engram shows there is product value in shipping a minimal "recovery card" for runtimes that cannot rely on hooks or plugin registration. That should be an instruction-layer export of existing Public recovery semantics, not a new authority surface.
- **Recommendation**: prototype later
- **Impact**: medium

## Assessment
- New information ratio: 0.39

## Recommended Next Focus
Decide which parts of Public's compaction survival should become a reusable cross-runtime recovery card: likely a deterministic recent-session digest plus a minimal post-reset action sequence, while explicitly rejecting Engram's model-must-write-the-compaction-summary pattern.


Total usage est:        1 Premium request
API time spent:         6m 9s
Total session time:     6m 36s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  2.8m in, 26.8k out, 2.6m cached, 9.4k reasoning (Est. 1 Premium request)
