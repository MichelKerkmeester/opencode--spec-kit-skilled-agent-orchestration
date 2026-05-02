## Session Context
- **Spec Folder:** 041-sk-improve-agent-loop/002-sk-improve-agent-full-skill
- **Current Task:** benchmark harness verification
- **Blockers:** none

## System Health
- **Code Graph:** ready
- **CocoIndex:** available
- **Session Quality:** ok (score: 0.92)

## Structural Context
- **Status:** ready
- **Summary:** target profiles and benchmark evidence are present
- **Action:** use `code_graph_query` only for structural follow-up

## Recommended Next Steps
1. Run `session_bootstrap` if context was lost or the session was just resumed.
2. Use `mcp__cocoindex_code__search` for semantic follow-up questions.
3. Verify checklist evidence before closeout.

## Tool Routing
| Query Type | Tool | Examples |
| --- | --- | --- |
| Semantic/concept | `mcp__cocoindex_code__search` | find benchmark runner |
| Structural | `code_graph_query` | callers of reduce-state |
