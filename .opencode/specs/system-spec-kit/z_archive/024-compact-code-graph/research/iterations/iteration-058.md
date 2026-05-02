# Iteration 58: Non-Hook CLI Runtime Context Preservation UX (Q15)

## Focus
Investigating how non-hook CLI runtimes (OpenCode, Codex CLI, Copilot, Gemini) can achieve equivalent context preservation UX to Claude Code's hook-based system. This includes command-based triggers, instruction file patterns, MCP auto-invocation, and session lifecycle detection.

## Findings

### 1. Claude Code Hooks Are the Gold Standard -- and They Are Runtime-Specific
Claude Code has a complete 3-event lifecycle hook system (`PreCompact`, `SessionStart`, `Stop`) implemented in `hooks/claude/`. The `session-prime.ts` handler routes by source (`compact`, `startup`, `resume`, `clear`) and injects context via stdout. It includes code graph stale-index detection, CocoIndex availability checks, and 3-source merge payload injection after compaction. No other runtime has this level of integration.
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:1-100]

### 2. CODEX.md Already Implements the Instruction-Based Fallback Pattern
The project has `CODEX.md` at root with explicit instructions for non-hook context recovery:
- **Compaction recovery**: "FIRST ACTION -- call: `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })`"
- **Query-intent routing**: Explicit routing table for semantic discovery (CocoIndex), structural navigation (Code Graph), and session continuity (Memory)
- **Two universal retrieval primitives**: `memory_match_triggers(prompt)` for turn-start context, `memory_context({ mode: "resume" })` for compaction recovery
This proves the instruction-file pattern is already the primary fallback mechanism for Codex CLI.
[SOURCE: /CODEX.md:1-32]

### 3. `/spec_kit:resume` Command Works Across All Runtimes as the Manual Recovery Path
The resume command provides a comprehensive 4-5 step workflow for session recovery that is completely runtime-agnostic. It uses only MCP tools (memory_context, memory_search, memory_match_triggers) -- no hooks required. Detection flow: validate path -> memory_match_triggers -> memory_context -> deterministic ranking -> user prompt. Context loading: handover.md -> memory_context(resume) -> CONTINUE_SESSION.md -> memory_search -> checklist.md. This serves as the universal "manual hook equivalent" for all runtimes.
[SOURCE: .opencode/command/spec_kit/resume.md:1-425]

### 4. Agent Definitions Are Already Cross-Runtime with Identical MCP Tool Access
Both `.opencode/agent/context.md` (OpenCode) and `.codex/agents/context.toml` (Codex CLI) define identical MCP server access (`spec_kit_memory`, `cocoindex_code`) and identical workflow: MEMORY FIRST -> CODEBASE SCAN -> DEEPEN -> SYNTHESIZE. The only difference is format (YAML frontmatter vs TOML) and model selection (not specified vs `gpt-5.4`). This means any MCP-based solution works identically across runtimes.
[SOURCE: .opencode/agent/context.md:1-70, .codex/agents/context.toml:1-55]

### 5. MCP Server Cannot Detect Session Start Without Hooks -- But Can Detect First Call
MCP servers are stateless request handlers. They cannot detect session start, compaction, or new-session events on their own. However, the `memory_context` handler already supports `mode: "resume"` which serves as a session-start detection proxy. A potential enhancement: track the timestamp of last MCP tool call per session. If the gap between calls exceeds a threshold (e.g., >5 minutes), treat the next call as a "session restart" and proactively include recovery context. This would be a server-side heuristic that works across all runtimes.
[INFERENCE: based on MCP tool statelessness from hooks/README.md and memory_context handler patterns]

### 6. Four-Tier Fallback Architecture Emerges from Existing Patterns
Based on the evidence, the cross-runtime UX is already stratified into 4 tiers:

| Tier | Mechanism | Runtimes | Quality |
|------|-----------|----------|---------|
| **T1: Lifecycle hooks** | PreCompact + SessionStart + Stop | Claude Code only | Best (automatic, 3-source merge) |
| **T2: Instruction-file triggers** | CODEX.md / CLAUDE.md / GEMINI.md instructions telling AI to call memory_context at session start | Codex CLI, Copilot, Gemini | Good (relies on AI compliance) |
| **T3: Command-based recovery** | `/spec_kit:resume` command | All runtimes | Good (manual trigger required) |
| **T4: Gate 1 automatic** | CLAUDE.md Gate 1 requires `memory_match_triggers()` on EACH new message | All runtimes | Basic (triggered context only, no full session recovery) |

[INFERENCE: synthesized from CODEX.md, CLAUDE.md Gate 1, resume.md, hooks/claude/ evidence]

### 7. OpenCode Specifically Uses .opencode/agent/ Definitions -- Has the Same MCP Access
OpenCode (Copilot) agent definitions in `.opencode/agent/` are functionally identical to Claude/Codex agents regarding MCP tool access. The key difference: OpenCode uses markdown agent files with YAML frontmatter and `mcpServers` arrays. It has NO hook system, so it relies entirely on T2 (CLAUDE.md instruction triggers) and T3 (/spec_kit:resume). The root CLAUDE.md serves as the universal instruction file that forces Gate 1 (memory_match_triggers) on every message.
[SOURCE: .opencode/agent/context.md:1-24, CLAUDE.md Gate 1 section]

### 8. Potential Enhancement: MCP "First-Call Priming" as a Universal T1.5 Mechanism
A new approach that could bridge the T1-T2 gap: implement "first-call priming" in the MCP server itself. When any MCP tool (memory_context, memory_search, code_graph_query, etc.) is called for the first time in a session (no prior calls in the last N minutes), the response could include a `_sessionPriming` metadata section with:
- Constitutional memories (already surfaced by memory_context)
- Code graph staleness warnings (if last scan > threshold)
- CocoIndex availability status
- Active spec folder hint (from most recent memory)

This would work identically across ALL runtimes without hooks or instruction compliance, because it is built into the MCP server response layer.
[INFERENCE: based on MCP response metadata patterns from hooks/response-hints.ts and auto-surface mechanisms]

## Ruled Out
- **Direct hook emulation in non-hook runtimes**: These runtimes lack the event system; cannot inject context via stdout before the conversation starts.
- **Unified hook abstraction layer**: Each runtime has fundamentally different hook APIs (Claude: stdin/stdout JSON, Copilot: .github/hooks/*.json, Gemini: event system). A single abstraction would be brittle and high-maintenance.

## Dead Ends
None definitively eliminated this iteration. All approaches have viability within their tier.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts` (lines 1-100)
- `.opencode/skill/system-spec-kit/mcp_server/hooks/README.md` (full file)
- `/CODEX.md` (full file, 32 lines)
- `/CLAUDE.md` (Gate 1, Resume workflow sections)
- `.opencode/command/spec_kit/resume.md` (full file, 425 lines)
- `.opencode/agent/context.md` (lines 1-80)
- `.codex/agents/context.toml` (lines 1-60)

## Assessment
- New information ratio: 0.72
- Questions addressed: [Q15]
- Questions answered: [Q15 -- partially; the four-tier architecture is clear but enhancement details need further investigation]

## Reflection
- What worked and why: Reading the actual runtime-specific files (CODEX.md, agent definitions, resume.md) revealed the existing fallback architecture is more mature than expected. The instruction-file pattern and Gate 1 requirements already provide a reasonable non-hook UX.
- What did not work and why: N/A -- all research avenues were productive.
- What I would do differently: Would investigate Copilot and Gemini hook APIs more deeply to see if they offer partial lifecycle detection.

## Recommended Next Focus
Q16 -- CocoIndex utilization improvements: automatic re-indexing triggers, smarter seed resolution from code_graph_context results, and query routing between structural graph and semantic search. This is the final remaining question for Segment 6.
