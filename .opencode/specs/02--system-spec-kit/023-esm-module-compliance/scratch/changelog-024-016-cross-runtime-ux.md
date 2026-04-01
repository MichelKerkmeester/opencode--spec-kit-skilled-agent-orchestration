# Changelog: 024/016-cross-runtime-ux

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration)

---

## 016-cross-runtime-ux — 2026-03-31

The code graph and memory system worked well on Claude Code (which has full hook support), but the other four runtimes -- OpenCode, Codex CLI, Copilot CLI, and Gemini CLI -- had no automatic way to trigger code graph loading or memory context recovery on session start. This meant that roughly half the AI assistants supported by the project started every session blind, without access to the code graph or prior conversation context. This phase closes that gap by adding Session Start Protocol instructions to all five runtimes' instruction files, making seed resolution smarter (tolerating small line shifts instead of failing), auto-refreshing the code graph index when you switch git branches, fixing a silent failure in the seed resolver that masked real errors, consolidating duplicated recovery documentation into a single source of truth, and correcting checklist items that overstated what earlier phases had actually shipped.

> Spec folder: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/016-cross-runtime-ux/`

---

## What Changed

### Search (3 changes)

---

### Near-exact seed resolution

**Problem:** The code graph uses "seeds" -- saved positions in source files that anchor context to specific functions, classes, or blocks of code. When you edit a file and code shifts by a few lines (say, adding an import at the top), those seed positions become stale. Previously, if the exact line number did not match, the system fell all the way back to a coarse file-level anchor. That meant the code graph lost precision: instead of pointing to a specific function, it could only say "somewhere in this file." Every minor edit risked degrading the accuracy of every seed in the affected file.

**Fix:** A new resolution tier sits between "exact match" and the coarse "file-level" fallback. When an exact match fails, the resolver now searches within a window of plus or minus five lines around the original position. Confidence scores graduate smoothly: a one-line shift scores 0.95 (very high), dropping by 0.02 for each additional line of distance. At the maximum of five lines away, the score is still 0.85 -- well above the 0.7 that enclosing-symbol resolution provides. A new composite database index on file path and start line keeps these lookups fast. The practical result: routine edits like adding imports or reformatting no longer cause the code graph to lose track of where things are.

---

### Query intent pre-classifier

**Problem:** The system offers two search backends: the code graph (which understands structural relationships like "what calls this function" or "what does this class extend") and CocoIndex (which understands meaning, like "find code similar to this pattern"). There was no way for the system to know which backend to use for a given query. A structural question sent to CocoIndex would return irrelevant results; a semantic question sent to the code graph would return nothing. Users had to manually pick the right tool or get empty results.

**Fix:** A new heuristic classifier called `classifyQueryIntent()` examines query keywords before routing. Structural keywords (such as "calls," "imports," "implements," "extends") route to the code graph. Semantic keywords (such as "similar," "like," "related," "example") route to CocoIndex. When the query is ambiguous -- no clear signal either way -- it runs against both backends so results are not missed. This removes the guesswork of which search tool to invoke for a given question.

---

### Auto-reindex on branch switch

**Problem:** Switching git branches left the code graph stale. It still reflected the old branch's files and symbols -- functions that no longer existed, files that had been renamed, relationships that had changed. Querying this outdated graph returned misleading or completely wrong results, and there was no prompt or warning that the data was out of date.

**Fix:** The `code_graph_scan` handler now checks the current git commit hash (via `git rev-parse HEAD`) against a stored value in a new `code_graph_metadata` database table. When the hash changes -- whether from a branch switch, a rebase, or pulling new commits -- a full reindex triggers automatically. As part of that reindex, stale database entries for files that no longer exist on disk are pruned. The code graph now always describes the code you are actually looking at, not the code from a previous branch.

---

### Bug Fixes (2 changes)

---

### Seed-resolver silent database failure

**Problem:** When a database query failed during seed resolution (for example, a corrupted index or a connection timeout), the error was silently swallowed. The resolver returned a low-confidence file-level placeholder anchor as if nothing had gone wrong. Callers had no way to distinguish "resolution genuinely produced a low-confidence result" from "resolution failed entirely and you are getting a fake fallback." This made debugging nearly impossible -- real errors were invisible.

**Fix:** The resolver now throws an explicit error with full logged context via a new `throwResolutionError()` function instead of silently returning a placeholder. Callers see that resolution failed, why it failed, and where in the chain the failure occurred. Failures are now visible and debuggable rather than quietly producing misleading results.

---

### SessionStart scope mismatch between spec and settings

**Problem:** The spec document for this phase described four separate, source-scoped SessionStart hook matchers -- one each for "startup," "resume," "clear," and "compact" events. However, the actual `settings.local.json` configuration file registered a single unscoped entry that handled all four sources via branching logic inside the hook script itself. This discrepancy made it look like the implementation was incomplete when it was actually working as designed.

**Fix:** Updated the spec to reflect the actual (and intentional) design: one registration entry in settings with in-script source branching is correct. The single-entry approach is simpler and achieves the same result. This was a documentation-reality gap, not a code bug.

---

### Documentation (3 changes)

---

### Cross-runtime Session Start Protocol

**Problem:** Only Claude Code had automatic hooks that triggered code graph loading and memory context recovery when a session started. The other four runtimes -- OpenCode, Codex CLI, Copilot CLI, and Gemini CLI -- relied entirely on users remembering to manually invoke these tools at the beginning of every conversation. In practice, users rarely did, which meant these runtimes started each session without access to the code graph or any prior conversation context. Context preservation parity across the five runtimes sat at roughly 50-60%.

**Fix:** Added a Session Start Protocol section to every runtime's instruction file. Codex CLI (`CODEX.md`) now calls `memory_context()` with a resume profile plus `code_graph_status()` on its first turn. Copilot CLI and Gemini CLI (`AGENTS.md`) received code graph auto-trigger instructions. OpenCode's `context.md` integrates graph health checks into its exploration workflow with a tool reference table. Gemini CLI's `GEMINI.md` shares the protocol via a symlink to `AGENTS.md`. The result: all five runtimes now auto-trigger context loading on session start, bringing cross-runtime parity from roughly 50-60% up to an estimated 80-90%.

---

### Recovery documentation consolidation

**Problem:** Recovery instructions -- the steps an AI assistant follows to rebuild context after a session reset or context compaction -- were split across two files: the root `CLAUDE.md` and `.claude/CLAUDE.md`. The two files had overlapping and sometimes conflicting guidance. It was unclear which file was authoritative, and different runtimes could end up following different recovery procedures.

**Fix:** Moved all universal recovery steps (those that work on every runtime, not just Claude Code) to the root `CLAUDE.md`. Trimmed `.claude/CLAUDE.md` down to only Claude-specific, hook-aware behavior. There is now a single source of truth for recovery, and each file has a clear, non-overlapping purpose.

---

### Truth-sync checklist annotations

**Problem:** Five checklist items across earlier phases (005, 006, 008, 011, and 012) claimed features were fully shipped when they were only partially implemented. For example, the resume profile documentation had gaps, the indexer description referenced tree-sitter (a parsing library) when the actual implementation used regex-based parsing, and CocoIndex semantic neighbor retrieval was listed as complete but had never been wired into the pipeline. The parent checklist gave a false picture of what had actually been delivered.

**Fix:** Downgraded all five items from "complete" to "PARTIAL" with specific annotations explaining what was missing. The parent checklist now accurately reflects the actual state of each delivered feature, making it a reliable reference for future planning.

---

<details>
<summary>Files Changed (11 files)</summary>

| File | What changed |
|------|-------------|
| `mcp_server/lib/code-graph/seed-resolver.ts` | Near-exact resolution tier with +/-5 line window and graduated confidence scoring; `throwResolutionError()` replacing silent placeholder fallback on database failures |
| `mcp_server/lib/code-graph/code-graph-db.ts` | Composite index `idx_file_line ON code_nodes(file_path, start_line)` for fast near-exact lookups; `code_graph_metadata` table for storing git HEAD hash |
| `mcp_server/handlers/code-graph/scan.ts` | Git HEAD change detection via `git rev-parse HEAD`, automatic reindex trigger on branch switch, stale entry pruning for removed files |
| `mcp_server/lib/code-graph/query-intent-classifier.ts` | New file: `classifyQueryIntent()` heuristic that routes structural, semantic, and ambiguous queries to the appropriate search backend |
| `CODEX.md` | Session Start Protocol section: forces `memory_context()` and `code_graph_status()` on first turn |
| `AGENTS.md` | Code graph auto-trigger instructions for Copilot CLI and Gemini CLI agents |
| `.opencode/agent/context.md` | Code graph integration with tool reference table and graph health check in exploration workflow |
| `GEMINI.md` | Session start protocol via symlink to AGENTS.md |
| `CLAUDE.md` (root) | Universal recovery instructions consolidated from both CLAUDE.md files |
| `.claude/CLAUDE.md` | Trimmed to Claude-specific hook-aware additions only |
| Root `checklist.md` | Five items across phases 005/006/008/011/012 downgraded to PARTIAL with specific annotations |

</details>

## Deep Review Fixes (2026-04-01)

### Doc Fixes
- Phase status aligned to "Partial (11/14 items)" with 3 deferred items clearly separated
- Intent classifier documented as metadata annotation only (not backend routing)
- query-intent-classifier.ts added to implementation-summary Files Changed table
- Deferred items explicitly separated in tasks and checklist

---

## Upgrade

No migration required.
