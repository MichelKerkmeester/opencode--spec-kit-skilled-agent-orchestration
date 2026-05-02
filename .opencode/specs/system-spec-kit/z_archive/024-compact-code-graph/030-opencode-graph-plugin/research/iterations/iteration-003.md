# Research Iteration 003: Comparison With Packet 024 and Current Spec Kit Memory

## Focus

Compare LCM's method to packet 024 decisions and the live Spec Kit Memory runtime, so the final recommendation reflects our stack rather than assuming a greenfield design.

## Findings

1. Packet 024 already chose a hybrid hook + tool architecture and explicitly values lifecycle-bound context injection. [SOURCE: `decision-record.md:39-99`] [SOURCE: `.opencode/skill/system-spec-kit/references/config/hook_system.md:21-57`]
2. Packet 024 already decided the structural graph belongs in a separate SQLite graph store, not inside the memory DB. [SOURCE: `009-code-graph-storage-query/spec.md:68-168`]
3. The packet-level research also already states that graph context should be projected compactly, not dumped raw, and that CocoIndex should remain the semantic layer while the code graph handles structure. [SOURCE: `research/research.md:31-43`]
4. Current Spec Kit Memory already has a surprisingly similar startup/recovery story:
   - startup instructions include memory stats, session recovery digest, structural bootstrap guidance, and tool-routing hints. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:639-712`]
   - auto-surfacing already combines constitutional memory, trigger matches, attention boosts from working memory, and token-budget enforcement. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:365-417`]
5. The largest missing capability is OpenCode-native prompt-time injection. Our current non-hook runtime story is recovery-by-tool-call (`session_bootstrap`, `session_resume`) rather than OpenCode plugin transforms. [SOURCE: `.opencode/skill/system-spec-kit/references/config/hook_system.md:48-57`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:683-712`]

## Interim Conclusion

The gap is not retrieval intelligence. The gap is transport into OpenCode's prompt assembly lifecycle.

That means packet 024 should borrow LCM's injection method, but it should source its content from our own `memory_context`, `memory_match_triggers`, `code_graph_context`, and CocoIndex bridge logic.

## Open Question After This Iteration

Should packet 024 adopt a thin OpenCode adapter, a hybrid adapter with small local archive state, or the full LCM-style parallel archive?
