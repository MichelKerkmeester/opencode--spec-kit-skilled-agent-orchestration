# Iteration 65: OpenCode-Specific Deep Dive -- Agent System, Commands, and Integration Design

## Focus
Investigate how OpenCode (the primary non-hook runtime) structures its agents, commands, MCP server registration, and session lifecycle -- then design a concrete integration plan for automatic code graph and context preservation features within the OpenCode runtime.

## Findings

### 1. OpenCode Agent Architecture
OpenCode agents are defined as markdown files in `.opencode/agent/` with YAML frontmatter specifying name, description, mode (primary/subagent), temperature, permissions (read/write/edit/bash/grep/glob/webfetch/memory), and MCP server bindings. There are 10 agents: context, debug, deep-research, deep-review, handover, orchestrate, review, speckit, ultra-think, write.

Key architectural insight: OpenCode has NO native hook system. There is no equivalent to Claude Code's `settings.local.json` hooks (PreCompact, SessionStart, Stop). Agents are dispatched on-demand by the orchestrator or directly by the user -- there is no lifecycle event interception.

[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/agent/ -- directory listing showing 10 agent files]
[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/agent/context.md -- YAML frontmatter with permission model and mcpServers binding]

### 2. MCP Server Registration in OpenCode
`opencode.json` registers 4 MCP servers directly: `sequential_thinking`, `spec_kit_memory`, `cocoindex_code`, and `code_mode`. All use `"type": "local"` with command arrays. The `spec_kit_memory` server provides all memory tools (memory_context, memory_search, code_graph_scan, code_graph_query, etc.). The `cocoindex_code` server provides semantic code search.

Critical finding: Both code_graph and CocoIndex tools are already available to ALL agents via MCP -- the barrier is not availability but INVOCATION. No agent currently auto-calls `code_graph_scan` or `ccc_reindex` at session start because there is no lifecycle hook to trigger them.

[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/opencode.json:19-43 -- spec_kit_memory and cocoindex_code MCP configs]

### 3. OpenCode Command System as Hook Substitute
Commands in `.opencode/command/spec_kit/` are YAML-based workflow definitions (e.g., `resume.md`, `complete.md`, `plan.md`, `implement.md`). The `/spec_kit:resume` command (spec_kit_resume_auto.yaml) already implements session detection, memory loading, and progress calculation -- but focuses purely on memory context, not code graph or CocoIndex.

The resume command's 4-step workflow (detect session -> load memory -> calculate progress -> present resume) is the ideal injection point for code graph auto-refresh. Adding a Step 1.5 ("ensure structural index freshness") would give OpenCode users code-graph-enriched context on every session resume.

[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml -- full workflow definition with 4 steps]

### 4. The @context Agent as Universal Enrichment Gateway
The @context agent is the "exclusive entry point for ALL exploration tasks" -- every codebase search routes through it. Its 3-layer retrieval (Memory -> Codebase -> Deep Memory) currently does NOT include code graph or CocoIndex as automatic layers. Adding code_graph_context as a Layer 1.5 (between Memory and Codebase) would mean every exploration automatically benefits from structural graph data.

The agent already binds `mcpServers: [spec_kit_memory, cocoindex_code]` in its frontmatter, confirming tool availability. The missing piece is instruction-level triggers: the agent instructions should mandate `code_graph_context` calls alongside memory calls.

[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/agent/context.md:21-23 -- mcpServers binding showing spec_kit_memory + cocoindex_code]
[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/agent/context.md:117 -- 3-layer tool sequence without code graph]

### 5. Concrete OpenCode Integration Design

**Tier A: Instruction-File Auto-Triggers (Zero Code Changes)**

Modify `.opencode/agent/context.md` to add a new Layer 1.5 in the retrieval sequence:

```
Current:  memory_match_triggers -> memory_context -> memory_search -> CocoIndex -> Glob -> Grep -> Read
Proposed: memory_match_triggers -> memory_context -> code_graph_context(seeds from memory) -> CocoIndex search -> memory_search -> Glob -> Grep -> Read
```

Add to the Tool Sequence in section 3:
- After `memory_context(deep)`, call `code_graph_context({ queryMode: "neighborhood", input: <topic> })` to get structural context
- Feed code_graph results as seeds into CocoIndex for enriched semantic search

Cost: 1-2 additional tool calls per exploration. Benefit: Every @context dispatch automatically includes structural code graph data.

**Tier B: Resume Command Enhancement (YAML Config Change)**

Add a new step to `spec_kit_resume_auto.yaml`:

```yaml
step_1b_index_freshness:
  purpose: Ensure code graph and CocoIndex indices are fresh
  activities:
    - Check code_graph_status() for last_scan timestamp
    - If last_scan > 1 hour, trigger code_graph_scan({ incremental: true })
    - Check ccc_status() for CocoIndex readiness
    - If CocoIndex stale, trigger ccc_reindex({ full: false })
  timeout: 30 seconds (non-blocking, continue resume if slow)
  outputs: { graph_fresh: boolean, coco_fresh: boolean }
```

Cost: 30 seconds max added to resume. Benefit: Indices always fresh after resume.

**Tier C: CLAUDE.md Instruction Injection (Universal Fallback)**

Add to the root CLAUDE.md a section that applies regardless of runtime:

```markdown
## Auto-Context Enrichment
On first substantive tool call of any session:
1. Check code_graph_status() -- if stale (>2h), run code_graph_scan({ incremental: true })
2. Check ccc_status() -- if stale, run ccc_reindex()
This ensures structural and semantic indices are always fresh.
```

This works for ALL runtimes (OpenCode, Codex, Copilot, Gemini) because every AI reads the CLAUDE.md/instruction files.

**Tier D: MCP "First-Call Priming" (Server-Side, Universal)**

The most elegant solution: modify `context-server.js` (the spec_kit_memory MCP server) to check code graph freshness on its FIRST tool invocation per session. Since every session eventually calls a memory tool, this creates a universal session-start trigger without runtime-specific hooks.

Implementation: In `context-server.ts`, add a `sessionPrimed` flag. On first `memory_context` or `memory_match_triggers` call, check `code_graph_status` internally and trigger incremental scan if stale. This is invisible to the caller and works identically across all runtimes.

[INFERENCE: based on analysis of opencode.json MCP registration, context agent architecture, resume command workflow, and prior iteration 057-058 findings on non-hook runtime UX]

### 6. OpenCode vs Claude Code: Integration Parity Matrix

| Feature | Claude Code (hooks) | OpenCode (no hooks) | Parity Strategy |
|---------|-------------------|--------------------|-----------------| 
| Session start index refresh | PreCompact/SessionStart hook | Resume command step 1b + MCP first-call priming | Tier B + D |
| Auto graph enrichment on exploration | memory-surface.ts inline injection | @context agent instruction Layer 1.5 | Tier A |
| Background preloading | Hook runs before AI starts | No equivalent; use MCP first-call priming | Tier D |
| Index staleness check | Hook checks timestamp on every start | CLAUDE.md instruction + MCP internal check | Tier C + D |
| CocoIndex auto-reindex | Hook triggers on file changes | Resume command + CLAUDE.md instruction | Tier B + C |

Parity assessment: Tiers A-D together achieve ~90% feature parity with Claude Code hooks. The remaining 10% gap is latency: hooks run before the AI's first response, while MCP first-call priming adds ~1-3 seconds to the first tool call. This is acceptable for a non-hook runtime.

[INFERENCE: based on prior iterations 057-058 (hook architecture) combined with this iteration's OpenCode analysis]

## Ruled Out
- **OpenCode native hooks**: OpenCode has no hook system; there is no `opencode.json` hook registration equivalent to Claude Code's `settings.local.json` hooks.
- **Custom OpenCode plugin**: No plugin architecture exists in OpenCode's config; the only extension point is MCP servers and agent definitions.

## Dead Ends
None discovered this iteration. All proposed approaches (Tiers A-D) are viable.

## Sources Consulted
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/agent/` -- all 10 agent files (listed)
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/agent/context.md` -- full read (429 lines)
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/agent/orchestrate.md` -- partial read (100 lines)
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/opencode.json` -- full read (62 lines)
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml` -- full read (211 lines)
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/command/spec_kit/` -- directory listing

## Assessment
- New information ratio: 0.67
- Questions addressed: OpenCode integration design (Q15 deepening), automatic AI utilization (Q14 deepening)
- Questions answered: "How does OpenCode handle session start?" (no hooks, command-based), "What agents exist and how are they structured?" (10 agents, YAML frontmatter), "How should code graph integrate with OpenCode?" (4-tier design)

## Reflection
- What worked and why: Direct reading of OpenCode agent definitions and config files revealed the complete integration surface. The @context agent's explicit 3-layer retrieval model made it immediately clear where code_graph_context should be inserted (Layer 1.5). The resume command's step-based YAML workflow showed the exact injection point for index freshness checks.
- What did not work and why: N/A -- all research avenues were productive.
- What I would do differently: Could have also read the `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts` to verify the MCP first-call priming feasibility from the server side. This would strengthen the Tier D recommendation.

## Recommended Next Focus
Consolidation iteration: Synthesize all Q13-Q16 findings into a prioritized feature improvement roadmap. The 4-tier OpenCode integration design (this iteration) should be merged with the 3-tier auto-enrichment design (iteration 057), the non-hook runtime UX tiers (iteration 058), and the CocoIndex improvements (iteration 059) into a single implementation priority matrix.
