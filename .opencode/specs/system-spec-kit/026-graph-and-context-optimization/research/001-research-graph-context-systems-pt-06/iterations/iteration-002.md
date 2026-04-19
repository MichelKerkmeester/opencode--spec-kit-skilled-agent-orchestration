# Iteration 2: claude-memory SQLite schema + recall cascade

## Focus
This iteration inspected the vendored `claude-memory` recall stack to answer strategy Q2 and Q4 directly from implementation. The goal was to map the SQLite schema, identify how FTS capability is selected at runtime, and judge what parts are worth borrowing for `Code_Environment/Public`.

## Findings
- `external/plugins/claude-memory/skills/recall-conversations/scripts/memory_lib/db.py` stores a v3 schema with `projects(path,key,name)`, `sessions(uuid,project_id,parent_session_id,git_branch,cwd)`, `branches(session_id,leaf_uuid,fork_point_uuid,is_active,started_at,ended_at,exchange_count,files_modified,commits,tool_counts,aggregated_content,context_summary,context_summary_json,summary_version)`, `messages(session_id,uuid,parent_uuid,timestamp,role,content,tool_summary,has_tool_use,has_thinking,is_notification)`, `branch_messages(branch_id,message_id)`, and `import_log(file_path,file_hash,messages_imported)`. The notable design choice is “messages stored once, branches as separate index,” so recall queries can rank whole active branches while still hydrating exact message sequences afterward. For `Code_Environment/Public`, that makes branch-aware context retrieval feasible without duplicating raw message storage, but it depends on having a comparable branch/session graph first. (prototype later)
- `external/plugins/claude-memory/skills/recall-conversations/scripts/memory_lib/db.py` defines both `messages_fts` and `branches_fts` virtual tables and chooses the implementation with `detect_fts_support()` by reading `PRAGMA compile_options`: prefer `ENABLE_FTS5`, otherwise accept `ENABLE_FTS4` or `ENABLE_FTS3`, otherwise return `None`. FTS5 uses `tokenize='porter unicode61'` and explicitly supports BM25 ranking; FTS4 falls back to `tokenize=porter`; both are kept in sync with INSERT/DELETE/UPDATE triggers. This is a strong portability pattern for `Code_Environment/Public` because capability detection is automatic and keeps the same logical API even when ranking quality degrades on older SQLite builds. (adopt now)
- `external/plugins/claude-memory/skills/recall-conversations/scripts/search_conversations.py` runs search against `branches_fts`, not `messages_fts`, filters to `b.is_active = 1`, sanitizes query tokens, and builds an OR-joined quoted MATCH query. If the runtime supports FTS5 it orders by `bm25(branches_fts)`; if only FTS4 is available it still uses MATCH but falls back to recency ordering; if no FTS is available it searches `branches.aggregated_content` with per-term `LIKE` clauses joined by `AND`. Branch-level aggregation is important for BM25 because the unit being scored is the whole branch transcript summary, so rare terms spread across multiple messages still reinforce one branch result instead of fragmenting relevance across individual message rows. That is the clearest implementation-backed idea to borrow if Public ever wants ranked conversation recall above the current memory/document layer. (prototype later)
- `external/plugins/claude-memory/skills/recall-conversations/scripts/recent_chats.py` handles chronological browsing separately from search: it reads active branches joined to sessions/projects, orders by `b.ended_at`, then reconstructs the exact visible transcript through `branch_messages -> messages`, hiding notifications by default. It also probes `PRAGMA table_info(branches)` so pre-migration databases lacking `tool_counts` still work. For `Code_Environment/Public`, the split between ranked recall and deterministic chronological browsing is worth copying because it keeps search quality concerns separate from simple “show me the latest relevant context” retrieval. (adopt now)

## Ruled Out
- None this iteration

## Dead Ends
- None this iteration

## Sources Consulted
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external/plugins/claude-memory/skills/recall-conversations/scripts/memory_lib/db.py`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external/plugins/claude-memory/skills/recall-conversations/scripts/search_conversations.py`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external/plugins/claude-memory/skills/recall-conversations/scripts/recent_chats.py`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external/plugins/claude-memory/skills/recall-conversations/SKILL.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/research/deep-research-strategy.md`

## Reflection
- What worked and why: Reading the schema first made the search scripts easy to interpret because the branch/message split explains both the FTS tables and the result-hydration queries.
- What did not work and why: Nothing failed materially.
- What I would do differently: I would go straight to the SessionStart hook files next, because this iteration already surfaced the branch fields (`context_summary`, `context_summary_json`) that likely drive injection.

## Recommended Next Focus
Q3 is the strongest next step: inspect `hooks/hooks.json`, `hooks/memory-context.py`, `hooks/sync_current.py`, and `skills/recall-conversations/scripts/memory_lib/summarizer.py` to trace SessionStart injection end to end. The open question now is how those persisted branch summaries are selected, cached, and rendered back into Claude context.
