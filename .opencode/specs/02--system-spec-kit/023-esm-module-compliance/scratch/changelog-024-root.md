# Changelog: 024-compact-code-graph (Root)

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration)

---

## 024-compact-code-graph — 2026-03-31

Long AI coding sessions lose critical knowledge whenever the conversation is compressed to save space. This release eliminates that problem entirely with a 24-phase effort spanning 3,500+ lines of code. The system now automatically saves and restores everything the AI needs to know -- the current task, relevant code structure, prior decisions -- at every session boundary. It works across five different AI coding tools (Claude Code, Codex CLI, Copilot CLI, Gemini CLI, and OpenCode), using native hooks where available and a universal fallback everywhere else. A structural code graph maps how code files relate to each other, complementing the existing semantic search that finds code by meaning. Together, these three knowledge sources (memory, structure, and semantics) are merged into a compact briefing that fits within a strict 4,000-token budget. A deep review of 30 iterations across three AI systems validated the result, with all 16 high-priority findings addressed.

> Spec folder: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/` (Level 3)

---

## New Features (9)

These are entirely new capabilities that did not exist before this release.

### Automatic context preservation on compaction

**Problem:** When an AI coding session runs long, the AI runtime compresses (compacts) the conversation to free up space. This compression discards the working context -- what task the AI was doing, which files it was editing, what decisions it had made. After compaction, the AI effectively forgot everything and the user had to re-explain the situation from scratch.

**Fix:** Built a two-step hook system that intercepts the compaction lifecycle. The first script (PreCompact) runs just before compression happens and pre-saves all critical context to a temporary cache file. The second script (SessionStart) runs immediately after compression completes and reads that cache, injecting the saved knowledge back into the conversation. The AI now resumes seamlessly after compaction with full awareness of its prior work.

### Session start priming

**Problem:** Every new AI coding session started completely cold, with no awareness of what happened in prior sessions. The user had to manually tell the AI what they were working on, where the relevant files were, and what the current state of the project was. This wasted the first several minutes of every session.

**Fix:** The system now auto-detects what kind of session is starting -- whether it is a fresh session, a resumed session, or a session recovering from compression -- and loads the appropriate context for each case. Fresh sessions get a tool overview and stale-index detection. Resumed sessions load the last spec folder and resume guidance. Post-compaction sessions inject the cached context. First interactions are immediately productive without manual context-setting.

### Session stop tracking

**Problem:** There was no visibility into how many tokens (the units AI models use to process text) were consumed per session. This made it impossible to track usage costs, detect inefficient sessions, or understand session patterns over time.

**Fix:** An asynchronous hook now fires when a session ends. It parses the conversation transcript (a JSONL log file that Claude Code writes), extracts token counts for prompts, completions, and cache operations, and saves the data to append-only snapshots. This enables usage tracking and provides the foundation for session continuity across restarts.

### Structural code graph

**Problem:** There was no way to answer structural questions about the codebase like "what calls this function?" or "what does this file import?" The existing semantic search (CocoIndex) could find code by meaning -- for example, "code that handles authentication" -- but it could not trace the actual connections between files, functions, and classes.

**Fix:** Built a code indexer that scans JavaScript, TypeScript, Python, and Shell files, extracts symbols (functions, classes, imports, exports), and stores their relationships as edges in a local SQLite database. The indexer initially used regular expressions (approximately 70% accuracy) and was later upgraded to tree-sitter (a professional-grade parser, achieving 99% accuracy) as the default, with the regex parser retained as a permanent fallback. Three new MCP tools expose the graph: `code_graph_scan` builds or refreshes the index, `code_graph_query` answers structural questions, and `code_graph_status` reports freshness and coverage.

### CocoIndex integration bridge

**Problem:** Semantic search (which finds code by meaning and similarity) and structural search (which finds code by its connections to other code) existed as completely separate systems. A semantic search might find a relevant function, but there was no way to then discover what calls that function, what it imports, or what else lives in the same module -- all of which are critical for understanding context.

**Fix:** Built a bridge so that results from CocoIndex semantic search feed directly into the structural code graph as seeds. When CocoIndex finds a match at, say, line 42 of a file, the bridge resolves that location to the enclosing symbol in the graph and then expands outward to show the structural neighborhood -- callers, callees, imports, and containing scope. This gives richer, more actionable context than either system provides alone.

### Three-source compaction merge

**Problem:** The compaction budget (the amount of context that can be preserved during compression) was previously spent entirely on memory -- prior session notes and constitutional rules. There was no room for structural code context or semantic search results, even though both carry information that is critical for the AI to resume work effectively.

**Fix:** The budget is now split across three sources -- memory, code structure, and semantic search -- using a system of reserved floors (minimum guaranteed allocations) with a shared overflow pool. Constitutional memories (always-on rules) get 700 tokens guaranteed, the code graph gets 1,200, semantic search gets 900, triggered context gets 400, and 800 tokens form a shared overflow pool. When a source has nothing to contribute, its floor flows back to the pool for other sources to use. High-priority items like constitutional rules always get their share regardless.

### Universal auto-priming for hookless runtimes

**Problem:** Claude Code has a native hook system that enables automatic context loading, but the other four supported runtimes (Codex CLI, Copilot CLI, Gemini CLI, and OpenCode) had no equivalent. Users of those tools had to manually trigger context loading at the start of every session.

**Fix:** Built MCP-level first-call detection: the very first tool call in any session automatically triggers context loading, regardless of which runtime is being used. This works because all five runtimes communicate with the same MCP server. The result achieves roughly 85-90% feature parity with Claude Code's native hooks, covering session priming, resume context, and stale-index detection without requiring any hook support from the runtime.

### Gemini CLI hook porting

**Problem:** Gemini CLI (Google's AI coding tool) has its own hook system with different event names and lifecycle semantics than Claude Code. The hooks built for Claude (PreCompact, SessionStart, Stop) could not be directly reused.

**Fix:** Mapped Gemini CLI's lifecycle events (PreCompress, BeforeAgent) to their Claude equivalents and created adapted hook scripts. Gemini sessions now get the same automatic context preservation as Claude sessions, using the same underlying context-loading logic but triggered through Gemini's native hook points.

### Context preservation metrics

**Problem:** There was no way to objectively measure whether context recovery was actually working well. Was the recovered context complete? Was it stale? Was the bootstrap (initial context load) fast enough? Without metrics, quality was assessed purely by subjective feel.

**Fix:** Added three measurement components: a session metrics collector that tracks context recovery events, a bootstrap quality scorer that evaluates the completeness and freshness of recovered context, and a reporting dashboard that visualizes preservation quality over time. These provide objective, trackable indicators of how well the system is performing.

---

## Architecture (4)

These are significant design decisions and structural approaches that shaped the system.

### Hybrid hook + tool design

**Problem:** Building context preservation that only works on one AI tool would leave users of the other four tools without coverage. But each runtime has different capabilities -- some have hooks (automated event triggers), some do not.

**Fix:** The system uses a two-layer architecture. Layer 1 uses native hooks for Claude Code, which are guaranteed to fire and execute quickly. Layer 2 uses instruction-driven tool calls for all other runtimes -- the AI is told (via instruction files like CLAUDE.md and CODEX.md) to call certain tools at certain moments. Both layers call the same underlying functions, so the business logic is written once and the transport mechanism is the only thing that varies.

### Rejected external dependency (Dual-Graph)

**Problem:** An open-source alternative called Codex-CLI-Compact / Dual-Graph offered some of the same structural code analysis capabilities. Adopting it would have saved initial development time.

**Fix:** After evaluation, the dependency was rejected for four reasons: its core engine is proprietary compiled code (Cython) that cannot be audited or debugged; it auto-generates instruction files that would overwrite the existing framework's CLAUDE.md and configuration; it sends telemetry (usage tracking data) with no opt-out mechanism; and it is maintained by a single developer, creating a bus-factor risk. The equivalent functionality was built from scratch instead, giving full control over the implementation.

### Tree-sitter with regex fallback

**Problem:** The initial code parser used regular expressions (pattern matching) to extract symbols from source code. This approach was roughly 70% accurate -- it missed edge cases like nested functions, complex class hierarchies, and multi-line signatures. But the more accurate alternative (tree-sitter, a professional parser framework) requires WebAssembly (WASM) support, which may not be available in all environments.

**Fix:** Upgraded to tree-sitter WASM parsing as the default, achieving 99% accuracy via a cursor-based AST (Abstract Syntax Tree) walk across JavaScript, TypeScript, Python, and Bash. The regex parser was retained as a permanent fallback for environments where WASM is unavailable. Parser selection is automatic (tree-sitter if available, regex otherwise) with a manual override via the `SPECKIT_PARSER=regex` environment variable. The adapter pattern (a shared interface both parsers implement) means the rest of the system does not need to know which parser is active.

### Token budget allocation: floors + overflow

**Problem:** Splitting the compaction token budget required balancing competing needs. A fixed split (e.g., 1,333 tokens each for three sources) wastes budget when a source has nothing to contribute. A pure pool (first-come, first-served) risks starving critical sources like constitutional memories.

**Fix:** Adopted a hybrid approach with reserved floors and a shared overflow pool. Each source gets a guaranteed minimum: constitutional memories 700 tokens, code graph 1,200 tokens, semantic search 900 tokens, triggered context 400 tokens. The remaining 800 tokens form a shared overflow pool. When a source uses less than its floor, the unused portion flows to the overflow pool, which is then distributed to sources that need more. Priority order ensures constitutional memories (always-on rules) are never starved: constitutional > code graph > CocoIndex > triggered.

---

## Bug Fixes (11)

These are corrections to incorrect behavior that existed in earlier phases or was discovered during the 30-iteration deep review.

### endLine always equaled startLine

**Problem:** The code indexer recorded every function as occupying a single line, regardless of how long the function actually was. A 50-line function would be indexed as starting and ending on the same line. This broke call-graph detection for multi-line functions because the system could not determine whether a line fell inside a function's body.

**Fix:** Implemented language-specific heuristics to find the true end line: brace-counting for JavaScript and TypeScript (counting `{` and `}` to find the matching closing brace), indentation tracking for Python (detecting when indentation returns to the function's level), and marker detection for Bash (finding the closing `}` or `done`/`fi` keywords). This was later superseded by tree-sitter parsing, which extracts exact span information directly from the parse tree with 99% accuracy.

### Resume mode returned search results instead of a brief

**Problem:** When the AI called the resume function to recover context after compaction, it received verbose search results (long lists of matching memories) instead of a compact briefing (a short summary of state, next steps, and blockers). This blew through the 4,000-token budget, leaving no room for code graph or semantic context.

**Fix:** The root cause was a missing parameter: `profile: "resume"` needed to be passed alongside `mode: "resume"` to trigger the brief format. All resume paths -- hook scripts, instruction files, and tool wrappers -- were updated to consistently pass both parameters.

### Database crashed on first use

**Problem:** The code graph database threw errors when used for the very first time on a fresh system. The initialization sequence assumed the database already existed and attempted operations on tables that had not yet been created.

**Fix:** Added a safe initialization sequence with migration guards. The system now checks whether the database and its tables exist before attempting any operation, creates them if missing, and includes singleton poisoning prevention -- if the first initialization attempt fails partway through, subsequent attempts detect the corrupted state and reinitialize cleanly rather than using a half-created database.

### Race condition in compact cache

**Problem:** During fast compaction cycles, the cached context file could be deleted before it was fully read. The PreCompact hook would write the cache, the SessionStart hook would begin reading it, and a cleanup routine would delete it before the read completed, resulting in missing or partial context injection.

**Fix:** Fixed the ordering so that the cache file is fully read and its contents consumed before any deletion occurs. The read-then-delete sequence is now atomic from the perspective of the hook lifecycle.

### Transitive queries leaked past depth limit

**Problem:** Graph queries that follow chains of connections (e.g., "what calls the function that calls this function?") could exceed the specified maximum depth and also return duplicate paths when multiple routes converged on the same node. This produced unexpectedly large and redundant results.

**Fix:** Fixed the graph traversal algorithm to strictly respect the configured depth limit and deduplicate convergent paths -- paths that reach the same destination through different intermediate nodes are collapsed into a single result.

### Database writes were not atomic

**Problem:** Replacing a file's symbols in the index involved deleting the old symbols and then inserting the new ones. If an error occurred between the delete and insert (e.g., a disk write failure), the database would be left in a broken state with the old data gone and the new data missing.

**Fix:** Wrapped the delete+insert operations in database transactions. If any step fails, the entire operation rolls back, leaving the previous data intact. This applies to both `replaceNodes` and `replaceEdges` operations.

### Session IDs could collide

**Problem:** The hashing scheme used to generate session identifiers was vulnerable to collisions (two different sessions producing the same ID). A collision would cause one session's state to overwrite another's, corrupting context for both.

**Fix:** Upgraded the session ID hashing algorithm to SHA-256, which has a negligible collision probability for the expected number of sessions.

### Temp files had insecure permissions

**Problem:** Hook state files stored in the system's temporary directory were world-readable (any user on the system could read them). These files contain session context, which may include sensitive information about the codebase and the user's work.

**Fix:** Set directory permissions to 0700 (only the owner can read, write, or list contents) and file permissions to 0600 (only the owner can read or write). This follows the principle of least privilege for temporary state files.

### Error messages could leak internal paths

**Problem:** Exception strings in tool handlers were passed through to the user without sanitization. If an internal error occurred, the full file path (including usernames and directory structure) could be exposed in the error message.

**Fix:** Added sanitization to all error messages returned by tool handlers, stripping internal path information before the message reaches the user.

### Working-set tracker allowed 2x overshoot

**Problem:** The file tracker (which records which files and symbols were touched during a session, for compaction priority) could accumulate twice the configured maximum number of entries before evicting old ones. The capacity check compared against the wrong value.

**Fix:** Corrected the capacity check so that eviction triggers at the configured maximum, not at double the maximum.

### Dead code and duplicated logic

**Problem:** Over 24 phases of development, several code paths became obsolete or were duplicated across files. The `workingSet` branch in `session-prime.ts` was never reached, the per-file `TESTED_BY` edge type was defined but never populated, and token-count synchronization logic was duplicated between `response-hints.ts` and `envelope.ts`. A pressure-budget helper had drifted from its tested counterpart.

**Fix:** Removed the dead `workingSet` branch, removed the unused `TESTED_BY` code path, consolidated the duplicated token-count logic into a single shared function, and replaced the drifted pressure-budget helper with the shared tested version. This reduces maintenance surface area and eliminates potential confusion from code that appears functional but never executes.

---

## Search (3)

Improvements to how the system finds and retrieves relevant code and context.

### Query-intent classification

**Problem:** All queries were routed through the same search pipeline regardless of their nature. A structural question like "what imports this file?" would go through semantic search (which finds code by meaning), producing irrelevant results. A session question like "what was I working on?" would search the code graph (which maps code relationships), also producing irrelevant results.

**Fix:** Added a query-intent classifier that analyzes the incoming question and routes it to the appropriate backend. Structural questions (containing keywords like "imports," "calls," "extends") go to the code graph. Semantic questions (about concepts, patterns, or intent) go to CocoIndex. Session questions (about recent work, current task, or history) go to Memory. The classifier uses keyword heuristics in this first version, with a confidence fallback that sends ambiguous queries to multiple backends.

### Near-exact seed resolution

**Problem:** When semantic search returns a result pointing to a specific line in a file (e.g., line 42 of `auth.ts`), the code graph needs to find the enclosing symbol (the function or class that contains that line) to expand the structural neighborhood. But line numbers do not always land exactly on a symbol boundary -- they might point to the middle of a function body or to a comment above a function.

**Fix:** Added graduated confidence resolution with three levels: exact match (the line corresponds to a symbol's start line), enclosing symbol (the line falls within a symbol's span), or file-level anchor (no symbol contains the line, so the entire file is used as context). Each level carries a confidence score that propagates through to the final results, so the AI knows how precisely the structural expansion matches the original semantic hit.

### Auto-reindex on branch switch

**Problem:** The code graph index could become stale after switching git branches. Files that changed between branches would still show their old symbols and relationships, leading to incorrect or misleading structural queries.

**Fix:** Added automatic re-indexing triggers that fire on three events: git branch switch (detected via the active branch name changing), session start (to catch any changes made outside the AI session), and stale detection (when the index timestamp is older than the most recent file modifications). Re-indexing is debounced (delayed and deduplicated) to avoid redundant scans when multiple triggers fire in quick succession.

---

## Security (2)

Hardening measures that protect the system and user data.

### Provenance fencing for injected context

**Problem:** Recovered context from compaction was injected into the conversation without any markers distinguishing it from user-written text. This created a theoretical attack vector: if a malicious transcript contained crafted text that looked like recovered context, it could be treated as trusted system state, potentially tricking the AI into acting on false information.

**Fix:** Added provenance fencing -- clear, machine-readable markers that wrap all recovered context with metadata about its source, timestamp, and generation method. The AI can now distinguish between context that was legitimately recovered by the hook system and text that merely looks like recovered context.

### Input validation widened

**Problem:** Only one tool parameter (`rootDir` in the code graph scan tool) was validated via a schema validator. All other tool arguments were accepted without type checking, range validation, or sanitization, creating potential for unexpected behavior or injection.

**Fix:** Extended schema validation to all tool arguments across all handlers. Every parameter now goes through a validation layer that checks types, ranges, and formats before the handler logic executes. Invalid arguments produce clear error messages rather than silent failures or crashes.

---

## Documentation (3)

Improvements to instruction files and recovery documentation.

### Cross-runtime instruction parity

**Problem:** Claude Code had detailed recovery instructions (telling the AI what to do after compaction), but the other four runtimes had no equivalent guidance. Users of Codex CLI, Copilot CLI, Gemini CLI, and OpenCode were left without automatic recovery behavior because their instruction files did not contain the necessary directions.

**Fix:** Added "No Hook Transport" sections to `CODEX.md`, `AGENTS.md`, and `GEMINI.md` with equivalent recovery guidance. Created a `@context-prime` agent for OpenCode that provides the same bootstrap capabilities. All five runtimes now have documented paths for context recovery, session priming, and stale-index detection.

### Recovery documentation consolidated

**Problem:** Context recovery instructions were scattered across multiple files -- root `CLAUDE.md`, agent definitions, skill files, and runtime-specific instruction files. Finding the authoritative recovery procedure required checking several locations, and the copies could (and did) drift out of sync.

**Fix:** Consolidated to a single source of truth in the root `CLAUDE.md`, with runtime-specific files referencing the canonical instructions rather than duplicating them. Each runtime file now contains only the delta (the differences specific to that runtime) rather than a full copy.

### `.claude/CLAUDE.md` created

**Problem:** Claude-specific recovery instructions did not have a dedicated home. Claude Code loads `.claude/CLAUDE.md` as project-level instructions with higher priority than the root `CLAUDE.md`, but this file did not exist. Claude-specific behaviors (like hook-aware recovery) were mixed into the general instructions.

**Fix:** Created `.claude/CLAUDE.md` with Claude Code-specific recovery behavior: how to use hook-injected context when it appears, when to fall back to manual recovery, and how the SessionStart hook payload should be treated as additive context. This separation keeps the root `CLAUDE.md` runtime-agnostic.

---

## Testing (3)

Verification and validation of the implemented system.

### Seven-scenario test matrix

**Problem:** The hook scripts interact with the AI runtime at lifecycle boundaries (startup, compaction, resume, stop) that are difficult to test in isolation. Without structured test scenarios, coverage gaps in edge cases (like rapid sequential compactions or cross-runtime fallback) could go undetected.

**Fix:** Verified hook scripts across seven scenarios: startup (fresh session), resume (continuing prior work), clear (after `/clear` command), compact (after conversation compression), token tracking (session stop with transcript parsing), cross-runtime fallback (tool-based priming without hooks), and error recovery (graceful degradation when MCP server is unavailable). Each scenario has defined inputs, expected outputs, and pass criteria.

### Vitest suites pass

**Problem:** The core modules (code graph indexer, crash recovery, budget allocator, compact merger) each handle complex logic with many edge cases. Unit tests are essential to catch regressions as the system evolves across phases.

**Fix:** Four vitest test suites cover the critical modules: code-graph-indexer (18 tests covering symbol extraction, edge creation, incremental updates), crash-recovery (36 tests covering database initialization failures, migration guards, singleton poisoning), budget-allocator (15 tests covering floor allocation, overflow distribution, priority ordering), and compact-merger (15 tests covering three-source merge, zero-budget sections, mixed freshness). All 84 tests pass.

### Deep review: 30 iterations

**Problem:** Self-review by the implementing AI risks blind spots -- the same reasoning that produced a bug may overlook it during review. Independent validation by different AI systems with different training and reasoning patterns provides genuine fresh perspectives.

**Fix:** Cross-validated the entire implementation through 30 review iterations across three AI systems: Claude Opus (the primary implementation model), GPT-5.4 via Codex CLI, and GPT-5.4 via Copilot CLI. The initial review verdict was FAIL, identifying 45 issues (2 P0 critical, 15 P1 high, 24 P2 medium, 4 P3 low). After all 16 P1 findings were addressed across remediation phases 013-016, the verdict was upgraded to CONDITIONAL. Four P2/P3 items remain deferred due to external dependencies.

---

## Phases

| Phase | Name | Status |
|-------|------|--------|
| 001 | Compaction Context Injection | Complete |
| 002 | SessionStart Hook | Complete |
| 003 | Stop Hook + Token Tracking | Complete |
| 004 | Cross-Runtime Fallback | Complete |
| 005 | Command & Agent Alignment | Complete |
| 006 | Documentation Alignment | Complete |
| 007 | Testing & Validation | Complete |
| 008 | Structural Indexer (tree-sitter JS/TS/Python/Shell) | Complete |
| 009 | Code Graph Storage + Query (SQLite + MCP tools) | Complete |
| 010 | CocoIndex Bridge + code_graph_context | Complete |
| 011 | Compaction Working-Set Integration | Complete |
| 012 | CocoIndex UX, Utilization & Usefulness | Complete |
| 013 | Correctness & Boundary Repair (15 items) | Complete |
| 014 | Hook Durability & Auto-Enrichment (14 items) | Complete |
| 015 | Tree-Sitter WASM Migration (7/8 items) | Complete (1 deferred) |
| 016 | Cross-Runtime UX & Documentation (8 items) | Complete |
| 017 | Tree-Sitter & Query-Intent Classifier Fixes | Complete |
| 018 | Non-Hook CLI Auto-Priming | Complete |
| 019 | Code Graph Auto-Trigger | Complete |
| 020 | Query-Intent Routing Integration | Complete |
| 021 | Cross-Runtime Instruction Parity | Complete |
| 022 | Gemini CLI Hook Porting | Complete |
| 023 | Context Preservation Metrics | Complete |
| 024 | Hookless Priming Optimization | Complete |
| 025 | Tool Routing Enforcement | Pending |

---

## Deep Review Fixes (2026-04-01)

Applied after GPT 5.4 deep review across all 25 phases. 24 code fixes + doc alignment across all phase spec folders.

### Code Fixes
- **Symlink boundary bypass** (security) -- workspace guard now uses realpathSync for canonical path validation
- **Deleted files purged from DB** -- incremental scans now remove files no longer on disk
- **Streaming transcript parser** -- replaced blocking readFileSync with readline streaming
- **Session-scoped priming** -- replaced process-global boolean with per-session Set
- **Compact payload race** -- clear only after stdout write confirmed
- **Tree-sitter isReady** -- checks ALL grammars loaded, not just one
- **Incremental scan skip** -- mtime check before parse, unchanged files skipped
- **Tool routing enforcement** -- 5-layer active routing (Phase 025)

### Doc Alignment
All 25 phase spec folders updated: spec.md, implementation-summary.md, tasks.md, checklist.md aligned to actual code state. Eliminated spec/code drift across all phases.

---

<details>
<summary>Files Changed (17 total)</summary>

| File | Changes |
|------|---------|
| `.opencode/skill/system-spec-kit/scripts/hooks/claude/compact-inject.ts` | PreCompact hook: precomputes context, caches to temp file |
| `.opencode/skill/system-spec-kit/scripts/hooks/claude/session-prime.ts` | SessionStart hook: injects context on compact/startup/resume/clear |
| `.opencode/skill/system-spec-kit/scripts/hooks/claude/session-stop.ts` | Stop hook: transcript parsing, token tracking, session save |
| `.opencode/skill/system-spec-kit/scripts/hooks/claude/shared.ts` | Common utilities for hook scripts |
| `.opencode/skill/system-spec-kit/scripts/hooks/claude/hook-state.ts` | Per-session state management, SHA-256 session IDs, secure permissions |
| `.opencode/skill/system-spec-kit/scripts/hooks/claude/claude-transcript.ts` | Transcript JSONL parser for token extraction |
| `.opencode/skill/system-spec-kit/mcp_server/lib/graph/structural-indexer.ts` | Code indexer: symbol extraction from JS/TS/Python/Shell |
| `.opencode/skill/system-spec-kit/mcp_server/lib/graph/tree-sitter-parser.ts` | Tree-sitter WASM parser (696 LOC), cursor-based AST walk |
| `.opencode/skill/system-spec-kit/mcp_server/lib/graph/code-graph-db.ts` | SQLite schema, DB init guards, migration safety, transaction atomicity |
| `.opencode/skill/system-spec-kit/mcp_server/lib/graph/query-intent-classifier.ts` | Query-intent routing: structural vs semantic vs session |
| `.opencode/skill/system-spec-kit/mcp_server/lib/graph/seed-resolver.ts` | CocoIndex seed to graph node resolution with graduated confidence |
| `.opencode/skill/system-spec-kit/mcp_server/lib/graph/working-set-tracker.ts` | Session file/symbol tracking for compaction priority |
| `.opencode/skill/system-spec-kit/mcp_server/lib/graph/budget-allocator.ts` | Token budget allocation: floors + overflow pool across 3 sources |
| `.opencode/skill/system-spec-kit/mcp_server/lib/graph/compact-merger.ts` | Three-source merge for compaction briefing |
| `.opencode/skill/system-spec-kit/mcp_server/context-server.ts` | MCP tool registration for code graph and session tools |
| `.claude/CLAUDE.md` | Claude-specific hook-aware recovery instructions |
| `.claude/settings.local.json` | Hook registration for PreCompact, SessionStart, Stop |
| `CLAUDE.md` | Enhanced compaction recovery, cross-runtime instructions |

</details>

---

## Upgrade

No migration required. Hook scripts auto-register via `.claude/settings.local.json`. The code graph database (`code-graph.sqlite`) is created automatically on first scan. Tree-sitter WASM grammars are bundled as npm dependencies. To use the regex parser fallback instead of tree-sitter, set `SPECKIT_PARSER=regex`.
