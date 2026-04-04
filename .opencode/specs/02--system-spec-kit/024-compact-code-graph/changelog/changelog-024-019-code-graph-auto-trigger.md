# Changelog: 024/019-code-graph-auto-trigger

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration)

---

## 019-code-graph-auto-trigger — 2026-03-31

The code graph originally required a manual `code_graph_scan` command before queries were trustworthy. This phase introduced the shared `ensureCodeGraphReady()` helper so read paths could detect empty, stale, and fresh graph states before answering. Later packet work refined that behavior: small stale sets can repair inline through bounded `selective_reindex`, while empty or broadly stale states now stay explicit and report `full_scan` readiness instead of pretending every query can auto-heal itself.

> Spec folder: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/019-code-graph-auto-trigger/`

---

## New Features (3)

### Automatic freshness detection

**Problem:** Before every code graph query, you had to remember to run the `code_graph_scan` command yourself. If you forgot -- and most people did -- the query returned empty results or an outright error. There was no warning, no fallback, and no hint that the graph was out of date. This was especially painful on runtimes other than Claude Code (OpenCode, Codex CLI, Copilot CLI, Gemini CLI), where nothing prompted you to scan first. The code graph was powerful but unreliable because it depended on a manual step that was easy to skip.

**Fix:** A new `detectState()` function now runs before code graph read paths and checks whether the graph is empty, whether git HEAD changed, and whether tracked files drifted on disk. In the current packet state this no longer means "always reindex before every query": the helper reports the right readiness action (`none`, `selective_reindex`, or `full_scan`), and later bounded-refresh work decides whether that action is safe to execute inline.

---

### Transparent auto-reindex

**Problem:** Even users who remembered to scan before querying faced a second problem: choosing the right type of scan. A full scan reindexes the entire repository, which is thorough but slow. A selective scan reindexes only changed files, which is fast but only appropriate when a few files changed. Picking wrong meant either waiting too long or missing changes. This decision should never have been the user's responsibility in the first place.

**Fix:** The new `ensureCodeGraphReady()` helper makes this decision automatically based on what `detectState()` found. A handful of changed files can use selective reindexing, while larger stale sets fall back to `full_scan`. In the current packet state, structural read handlers intentionally keep `allowInlineFullScan: false`, so broad stale states stay bounded and tell the caller to run `code_graph_scan` instead of launching an unbounded inline rebuild.

---

### True freshness reporting

**Problem:** The `code_graph_status` command previously only reported when the last scan happened -- a raw timestamp that told you nothing useful. A scan from two minutes ago might already be stale if you edited files in the meantime. A scan from an hour ago might still be perfectly valid if nothing changed. There was no way to know whether the graph data actually reflected the current state of the codebase, which made it impossible to trust the results.

**Fix:** The status command now reports real freshness through a new `getGraphFreshness()` function that evaluates the actual state of the index. It returns one of three clear labels: "fresh" means the graph is up to date, "stale" means files have changed since the last useful index state, and "empty" means the graph has never been indexed at all. In the current packet state, "stale" does not imply that every next query will silently rebuild the graph: small stale sets can trigger bounded inline `selective_reindex`, while empty or broadly stale states report `full_scan` readiness and keep `code_graph_scan` explicit. This gives both human users and AI agents an honest, actionable picture of data quality instead of a meaningless timestamp.

---

## Architecture (2)

### 10-second timeout guard

**Problem:** Automatically reindexing before every query introduced a new risk: on large repositories with thousands of files, a full scan could take a long time. If the auto-reindex ran unchecked, it could block the query for 30 seconds or more, making the cure worse than the disease. A user who just wanted a quick answer would be stuck waiting for an index operation they did not ask for and could not cancel.

**Fix:** A 10-second timeout (the `AUTO_INDEX_TIMEOUT_MS` constant) caps inline indexing work so queries do not hang indefinitely. In the current packet state, bounded inline work applies only where read paths explicitly allow it; broad `full_scan` states on structural reads are surfaced as readiness instead of continuing in the background invisibly.

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

## Deep Review Fixes (2026-04-01)

### Doc Fixes
- Added 8-item Known Limitations section covering: 5-min freshness age check missing, debounce not keyed by rootDir, new files invisible, deleted files persist, selective reindex degrades, auto-index errors swallowed, runtime docs overstate, spec overstates completion
- Phase status aligned with F048/F049 deferred
- All overclaims corrected to "best-effort" language

---

## Upgrade

No migration required.
