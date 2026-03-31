# Iteration 018: D3 Traceability Re-verification

## Focus

Re-verify the prior D3 finding that phases 005, 006, 011, and 012 are only partially implemented even though their phase checklists are fully checked.

## Phase-by-Phase Status

### Phase 005 - Command & Agent Alignment

**Prior finding status:** CONFIRMED

**Checklist completion status:** REFUTED

**Checklist claims**

- The phase is marked complete across the command path: `/spec_kit:resume` passes `profile: "resume"`, returns a compact recovery brief, `/memory:save` avoids Stop-hook double-saves, and commands still work without hooks.[SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/005-command-agent-alignment/checklist.md:14-19]
- The runtime agents are marked complete across all four runtimes, including hook-aware context usage and command audits.[SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/005-command-agent-alignment/checklist.md:21-34]

**What the current implementation actually does**

- The supporting agent work is real: runtime agent docs do reference hook-injected context, `memory_context({ mode: "resume", profile: "resume" })` fallback, and CocoIndex-first semantic routing.[SOURCE: .opencode/agent/handover.md:322-326][SOURCE: .claude/agents/handover.md:318-324][SOURCE: .codex/agents/handover.toml:314-314][SOURCE: .gemini/agents/handover.md:319-319][SOURCE: .opencode/agent/context.md:354-360][SOURCE: .claude/agents/context.md:346-346][SOURCE: .codex/agents/context.toml:337-337][SOURCE: .gemini/agents/context.md:346-346]
- `/memory:save` also documents Stop-hook duplicate detection and merge/skip options.[SOURCE: .opencode/command/memory/save.md:133-140]
- But the canonical `/spec_kit:resume` contract still repeatedly documents bare `memory_context({ mode: "resume" })` recovery paths in its priority order, recovery tables, and primary note, without `profile: "resume"`.[SOURCE: .opencode/command/spec_kit/resume.md:257-262][SOURCE: .opencode/command/spec_kit/resume.md:276-279][SOURCE: .opencode/command/spec_kit/resume.md:291-291][SOURCE: .opencode/command/spec_kit/resume.md:354-360]

**Conclusion**

The phase contains genuine partial delivery, but the fully checked completion status is still inaccurate because the central resume contract remains out of sync with the claimed hook-aware recovery behavior.

### Phase 006 - Documentation Alignment

**Prior finding status:** CONFIRMED

**Checklist completion status:** REFUTED

**Checklist claims**

- The phase is marked complete for hook documentation, architecture documentation, root/system README updates, stale-reference cleanup, DQI alignment, and consistent cross-references.[SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/006-documentation-alignment/checklist.md:14-35]

**What the current implementation actually does**

- The documentation work is real: the shipped system skill documents the Claude hook scripts, lifecycle flow, cross-runtime fallback, token budgets, and code-graph/CocoIndex surfaces.[SOURCE: .opencode/skill/system-spec-kit/SKILL.md:734-766]
- But those docs still describe hooks as transport for the same retrieval primitives and state that the compact merger combines all three systems under the compaction injection path.[SOURCE: .opencode/skill/system-spec-kit/SKILL.md:736-766]
- The live PreCompact hook does not execute that documented contract: it builds `codeGraph` from transcript-extracted file paths, sets `cocoIndex` to a static advisory string, and passes empty `constitutional` and `triggered` sections into `mergeCompactBrief(...)`.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:145-155][SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:183-189]

**Conclusion**

Phase 006 is only partially implemented: the documentation refresh landed, but its checked “aligned” status is still overstated because the published docs continue to describe a richer live hook pipeline than the reviewed runtime actually executes.

### Phase 011 - Compaction Working-Set Integration

**Prior finding status:** CONFIRMED

**Checklist completion status:** REFUTED

**Checklist claims**

- The checklist marks the working-set tracker, budget allocator, empty-source overflow, deterministic trimming, 3-source compaction merge, constitutional preservation, cached SessionStart recovery, observability metadata, freshness metadata, and graceful degradation as complete.[SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/011-compaction-working-set/checklist.md:14-37]
- It also explicitly claims that `autoSurfaceAtCompaction` now uses the 3-source merge instead of the older memory-only path.[SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/011-compaction-working-set/checklist.md:21-23]

**What the current implementation actually does**

- The supporting helper modules exist and do implement substantial pieces in isolation: `WorkingSetTracker` provides in-memory file/symbol tracking, `allocateBudget()` implements floors plus overflow redistribution, and `mergeCompactBrief()` renders deduplicated titled sections with allocation/freshness metadata.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/working-set-tracker.ts:16-153][SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/budget-allocator.ts:31-132][SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:107-183]
- But the live compaction hook path is still not wired to that working-set-driven contract. `autoSurfaceAtCompaction(...)` in `memory-surface.ts` still delegates straight to `autoSurfaceMemories(...)`, which is the older memory-only surfacing path.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:283-317]
- The active Claude PreCompact hook also does not consume a persisted working set or retrieve real Memory/CocoIndex payloads. It derives file paths from transcript heuristics, builds a lightweight `codeGraph` section from those paths, inserts a static CocoIndex instruction, and leaves `constitutional` plus `triggered` empty.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:141-189]

**Conclusion**

Phase 011 remains partial: the helper layer exists, but the reviewed runtime still does not execute the checklist’s claimed working-set-driven 3-source compaction pipeline.

### Phase 012 - CocoIndex UX, Utilization & Usefulness

**Prior finding status:** CONFIRMED

**Checklist completion status:** REFUTED

**Checklist claims**

- The checklist marks hook build output, SessionStart health, `.claude/mcp.json` integration, CocoIndex status output, runtime-agent CocoIndex-first routing, semantic-neighbor compaction, reverse semantic augmentation, `ccc_*` tool support, stale-index guidance, and routing tests as complete.[SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/012-cocoindex-ux-utilization/checklist.md:14-40]

**What the current implementation actually does**

- Several major pieces are genuinely shipped: `.claude/mcp.json` registers `cocoindex_code`, SessionStart reports CocoIndex availability and resume guidance, and the MCP server exposes `ccc_status`, `ccc_reindex`, and `ccc_feedback` through the code-graph tool dispatcher.[SOURCE: .claude/mcp.json:27-35][SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:74-113][SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:138-152][SOURCE: .opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:17-26]
- The context-routing surface is also partially real: `code_graph_context` returns graph context plus `nextActions`, and one of those next actions is a prompt to use CocoIndex for semantic discovery of related code.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:59-83][SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:150-160]
- But the live PreCompact hook still does not query CocoIndex for semantic neighbors. Its `cocoIndex` input is only the string `Use mcp__cocoindex_code__search to find semantic neighbors...`, which means compaction carries an instruction to search later rather than actual semantic retrieval output.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:152-155]

**Conclusion**

Phase 012 also remains partial: CocoIndex availability, wrapper tools, and routing guidance are present, but the checked completion still overstates semantic integration depth in the live compaction and code-graph context path.

## Overall Re-verification Outcome

- The earlier D3 finding is unchanged: phases 005, 006, 011, and 012 still contain real implementation work, but all four are still marked more complete than the reviewed runtime and command surfaces justify.
- No new P0/P1/P2 findings were added in this pass.
- The correct traceability verdict for this slice remains: **prior partial-completion finding CONFIRMED; checked completion status REFUTED for all four phases**.
