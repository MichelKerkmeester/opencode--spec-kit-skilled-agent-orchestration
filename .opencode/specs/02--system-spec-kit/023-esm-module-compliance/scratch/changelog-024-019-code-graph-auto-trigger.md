# Changelog: 024/019-code-graph-auto-trigger

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration)

---

## 019-code-graph-auto-trigger — 2026-03-31

The code graph required a manual `code_graph_scan` command before any query would return results. If you asked "who calls this function?" without remembering to scan first, you got an empty answer or an error -- a frustrating interruption that broke the workflow on every runtime. This phase eliminates that manual step entirely by adding a shared `ensureCodeGraphReady()` helper that runs transparently before every code graph query. It checks three conditions (is the graph empty? did the git branch change? have files been modified?) and triggers the right kind of reindex automatically. The user just asks their question and gets an answer. Because this logic lives entirely on the server side, it delivers the highest cross-runtime parity gain of all Phase 024 proposals: OpenCode, Codex CLI, Copilot CLI, and Gemini CLI all jump from ~50-60% code graph coverage to ~95%, matching Claude Code's existing 100%.

> Spec folder: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/019-code-graph-auto-trigger/`

---

## New Features (3)

### Automatic freshness detection

**Problem:** Before every code graph query, you had to remember to run the `code_graph_scan` command yourself. If you forgot -- and most people did -- the query returned empty results or an outright error. There was no warning, no fallback, and no hint that the graph was out of date. This was especially painful on runtimes other than Claude Code (OpenCode, Codex CLI, Copilot CLI, Gemini CLI), where nothing prompted you to scan first. The code graph was powerful but unreliable because it depended on a manual step that was easy to skip.

**Fix:** A new `detectState()` function now runs automatically before every code graph query and checks three freshness conditions. First, it checks whether the graph is completely empty -- meaning this is the very first time the code graph is being used and a full scan is needed. Second, it compares the stored git HEAD hash against the current one to detect branch switches, which also require a full rescan. Third, it compares stored per-file modification timestamps against the actual files on disk to catch individual edits since the last index. If any condition fails, the system knows exactly what kind of reindex is needed and triggers it before the query runs. You never see this happening -- you just ask your question and get an accurate answer.

---

### Transparent auto-reindex

**Problem:** Even users who remembered to scan before querying faced a second problem: choosing the right type of scan. A full scan reindexes the entire repository, which is thorough but slow. A selective scan reindexes only changed files, which is fast but only appropriate when a few files changed. Picking wrong meant either waiting too long or missing changes. This decision should never have been the user's responsibility in the first place.

**Fix:** The new `ensureCodeGraphReady()` helper makes this decision automatically based on what `detectState()` found. An empty graph or a branch switch triggers a full scan -- there is no shortcut when the entire index is missing or invalidated. A handful of changed files triggers a selective reindex that touches only those specific files, keeping things fast. But if more than 50 files have changed (controlled by the `SELECTIVE_REINDEX_THRESHOLD` constant), the system falls back to a full rescan rather than selectively processing too many files one by one. All of this happens invisibly before the query runs. The user asks a question; the system figures out the fastest path to an accurate answer.

---

### True freshness reporting

**Problem:** The `code_graph_status` command previously only reported when the last scan happened -- a raw timestamp that told you nothing useful. A scan from two minutes ago might already be stale if you edited files in the meantime. A scan from an hour ago might still be perfectly valid if nothing changed. There was no way to know whether the graph data actually reflected the current state of the codebase, which made it impossible to trust the results.

**Fix:** The status command now reports real freshness through a new `getGraphFreshness()` function that evaluates the actual state of the index. It returns one of three clear labels: "fresh" means the graph was indexed within the last 5 minutes and no file changes have been detected since, "stale" means files have been modified since the last index (and the next query will trigger an automatic reindex), and "empty" means the graph has never been indexed at all. This gives both human users and AI agents an honest, actionable picture of data quality instead of a meaningless timestamp.

---

## Architecture (2)

### 10-second timeout guard

**Problem:** Automatically reindexing before every query introduced a new risk: on large repositories with thousands of files, a full scan could take a long time. If the auto-reindex ran unchecked, it could block the query for 30 seconds or more, making the cure worse than the disease. A user who just wanted a quick answer would be stuck waiting for an index operation they did not ask for and could not cancel.

**Fix:** A 10-second timeout (the `AUTO_INDEX_TIMEOUT_MS` constant) now caps how long the auto-reindex can run before a query. If the indexing finishes within 10 seconds, the query gets perfectly fresh data. If it does not finish in time, the query proceeds immediately with whatever data is already available rather than hanging indefinitely. The indexing operation continues in the background so the next query will benefit from it, but the current query is never held hostage. This means the worst case is a slightly stale answer delivered quickly, not a perfect answer delivered too late.

---

### Per-file modification time tracking

**Problem:** To enable selective reindexing -- where only changed files are rescanned instead of the entire repository -- the system needed a way to know exactly which files had changed. Without this, the only options were "rescan everything" (slow) or "rescan nothing and hope for the best" (unreliable). There was no middle ground.

**Fix:** A new `ensureFreshFiles()` function was added to the code graph database layer. It stores a modification timestamp for every indexed file and compares those stored timestamps against the actual file system on each freshness check. When the comparison reveals that specific files have newer modification times than what was recorded, those files -- and only those files -- are flagged for reindexing. This is the mechanism that powers the selective reindex path: instead of rescanning thousands of files because three changed, the system identifies and processes only the three that actually need attention.

---

<details>
<summary><strong>Files Changed (5)</strong></summary>

| File | What changed |
|------|-------------|
| `mcp_server/lib/code-graph/ensure-ready.ts` | New shared helper (217 lines) containing `ensureCodeGraphReady()`, `detectState()` for three freshness conditions (empty graph, HEAD hash mismatch, file modification time drift), the 10-second timeout guard, and the selective reindex threshold |
| `mcp_server/handlers/code-graph/context.ts` | Calls `ensureCodeGraphReady(process.cwd())` before building the context response |
| `mcp_server/handlers/code-graph/query.ts` | Calls `ensureCodeGraphReady(process.cwd())` before dispatching the query |
| `mcp_server/handlers/code-graph/status.ts` | New `getGraphFreshness()` function returning fresh, stale, or empty instead of raw timestamps |
| `mcp_server/lib/code-graph/code-graph-db.ts` | Added `ensureFreshFiles()` for per-file modification time tracking and change detection |

</details>

## Upgrade

No migration required.
