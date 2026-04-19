# Iteration 3: SessionStart context injection flow

## Focus
This iteration targeted Q3 only: how automatic context injection works at SessionStart and clear time in the mirrored Claude Memory plugin. The goal was to trace the full source-backed path from hook registration through session selection, cached summary reuse, fallback rendering, injected output, and Stop/import-time summary computation.

## Findings
- `external/plugins/claude-memory/hooks/hooks.json` source-proves that the flow is hook-driven across lifecycle boundaries, not an explicit user command: `SessionStart` always runs `memory-setup.py`, then for `startup|clear` runs `memory-context.py` and `consolidation-check.py`; `SessionEnd` on `clear` runs `clear-handoff.py`; `Stop` always runs `memory-sync.py`. For `Code_Environment/Public`, this differs from the documented recovery path in `.opencode/agent/context-prime.md:34-39` and `.opencode/command/spec_kit/resume.md:257-261`, where `session_bootstrap()` / `session_resume()` are explicit recovery pulls rather than automatic hook pushes. (prototype later)
- `external/plugins/claude-memory/hooks/memory-context.py` source-proves the session selection policy in `select_sessions()`: on `clear`, it consumes `clear-handoff.json` only when the cwd matches and the handoff is younger than 30 seconds, then hard-links to the exact cleared-from root session and appends one recent substantive supplementary session only when the cleared session has `<=2` exchanges; on `startup`, it excludes the current session, scans recent active root sessions, skips `<=1` exchange sessions, keeps recent 2-exchange sessions, and stops at the first substantive `>2` exchange session. Compared with `.opencode/command/spec_kit/resume.md:257-285`, this is a project-recency heuristic for conversational continuity, not a spec-folder-aware "next safe action" recovery chain. (prototype later)
- `external/plugins/claude-memory/hooks/memory-context.py` and `external/plugins/claude-memory/skills/recall-conversations/scripts/memory_lib/summarizer.py` source-prove the cached-summary fast path: `_CANDIDATE_QUERY` fetches `branches.context_summary`, `_load_messages_for()` only loads branch messages for entries missing that cache, `build_context()` prefers cached markdown and falls back to `_build_fallback_context()`, then `main()` wraps the result with `build_origin_block()` and emits `{"hookSpecificOutput":{"hookEventName":"SessionStart","additionalContext":...}}`. This matches the consumer-side assumption documented in `.opencode/agent/deep-research.md:438-442`: Public agents already know how to consume hook-injected startup context, but the producer shown here is cache-backed and project-local rather than memory-MCP-backed. (adopt now)
- `external/plugins/claude-memory/hooks/sync_current.py`, `external/plugins/claude-memory/skills/recall-conversations/scripts/memory_lib/summarizer.py`, and the caller sweep for `external/plugins/claude-memory/hooks/import_conversations.py` source-prove that summaries are precomputed outside SessionStart: Stop-time `memory-sync.py` writes branch metadata, rebuilds `aggregated_content`, then calls `compute_context_summary()` and stores `branches.context_summary`, `context_summary_json`, and `summary_version = 2`; the same summarizer is also used by `import_conversations.py`, so import-time computation is real, not just commented intent. The summarizer itself explicitly says "All extraction is deterministic Python — no LLM calls," which makes this cheaper than `session_bootstrap()` but also narrower than Public's broader readiness bundle in `README.md:536-543` and `.opencode/agent/context-prime.md:36-39,61-65`. (adopt now)

## Ruled Out
- The fallback path is not a special "last 3 exchanges" renderer in current source, even though `_build_fallback_context()` says that in its docstring; the implementation mirrors the same short-session/full render and long-session first-2 plus last-6 structure used by `render_context_summary()`.

## Dead Ends
- None this iteration

## Sources Consulted
- `external/plugins/claude-memory/hooks/hooks.json`
- `external/plugins/claude-memory/hooks/memory-context.py`
- `external/plugins/claude-memory/hooks/sync_current.py`
- `external/plugins/claude-memory/skills/recall-conversations/scripts/memory_lib/summarizer.py`
- `external/plugins/claude-memory/hooks/import_conversations.py`
- `.opencode/agent/context-prime.md`
- `.opencode/agent/deep-research.md`
- `.opencode/command/spec_kit/resume.md`
- `README.md`

## Reflection
- What worked and why: Reading the hook registration and injector together made the lifecycle boundary and cache-vs-fallback split obvious very quickly.
- What did not work and why: The mirrored plugin was not at repo-root `external/`, so the first read attempt failed until I resolved the phase-local `external/` copy.
- What I would do differently: I would start future iterations by resolving phase-local mirrors first whenever a packet vendors external code under its own `external/` subtree.

## Recommended Next Focus
Q5 is the best next step: trace the extract-learnings consolidation path through the relevant Claude Memory extraction pipeline, then compare it against `memory-auditor.md` and `signal-discoverer.md` so we can separate "session-start injection" from "post-session knowledge extraction" cleanly. That should answer how raw conversations get distilled into reusable signals versus just being surfaced back into the next session.
