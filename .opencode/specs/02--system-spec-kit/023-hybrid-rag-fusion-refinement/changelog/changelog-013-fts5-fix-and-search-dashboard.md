## [v0.13.0] - 2026-04-02

This phase closes the latest search-runtime drift in the packet. It fixed the FTS5 double-quoting bug, applied the new folder-grouped `/memory:search` dashboard, hardened the database-path and rebind logic that could quietly drift vector search into an empty provider-specific database, and added warning-level diagnostics across previously silent failure paths. The phase packet records its P0 and P1 implementation and verification as complete, while still leaving one deferred P2 follow-up for saving the research and review findings into `memory/`.

> Spec folder: `.opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement/013-fts5-fix-and-search-dashboard` (Level 2)

---

## Search (3)

### Multi-word FTS5 search no longer drops valid matches

**Problem:** FTS5 terms that were already quoted could be quoted a second time, which produced invalid `\"\"phrase\"\"` syntax and silently removed FTS5 results from multi-word queries.

**Fix:** `sqlite-fts.ts` now guards pre-quoted tokens before FTS5 output is built, so multi-word searches keep their FTS-backed matches.

### `/memory:search` now groups results by folder in a readable dashboard

**Problem:** The old command output forced users to scan long paths instead of seeing the result set as grouped work areas.

**Fix:** Design 10, the folder-as-tree-group layout, now drives both `.opencode/command/memory/search.md` and `.agents/commands/memory/search.toml`.

### Focused-mode search no longer gets trapped by folder promotion

**Problem:** Folder discovery could promote a guessed folder into a hard filter and return zero results even when matching content existed elsewhere.

**Fix:** The phase keeps folder discovery from auto-promoting into the wrong filter path, which restores focused-mode results for cases like `memory_context({ mode: "focused" })`.

---

## Reliability (3)

### Vector search no longer drifts to an empty provider-specific database

**Problem:** `resolve_database_path()` could read provider singleton state after Voyage-4 lazy initialization and resolve to an empty provider-specific SQLite file instead of the populated `context-index.sqlite`.

**Fix:** The phase stabilized DB-path handling in `vector-index-store.ts`, guarded `reinitializeDatabase()` from rebinding consumers to an empty database, and kept connection caching behind the validated path.

### Startup now performs a clearer DB health check

**Problem:** Operators had too little visibility into whether the active database was populated and aligned before search consumers came online.

**Fix:** Startup now logs the active DB path and checks the initialization state before search consumers activate.

### Silent failure paths now leave traces instead of disappearing quietly

**Problem:** Several search-pipeline branches returned empty arrays or nulls on unexpected conditions without leaving operators a clue about why.

**Fix:** The phase added warning-level diagnostics across `hybrid-search.ts`, `stage1-candidate-gen.ts`, and `vector-index-queries.ts`, and surfaced graph zero-contribution metadata for bounded-runtime cases.

---

## Test Impact

| Metric | Before | After |
| ------ | ------ | ----- |
| FTS5 multi-word query handling | `Invalid double-quoted phrases could suppress matches` | `Guarded pre-quoted tokens preserve FTS5 results` |
| Focused-mode `memory_context` results in the audited scenario | `0` | `5 candidates` |
| Stage 1 pipeline channel visibility | `No explicit active channel count` | `activeChannels: 2` |
| Warning visibility for unexpected search failures | `Silent returns in multiple paths` | `31+ warning logs across key search modules` |

Verification in the phase packet records successful build output, live search results, focused-mode recovery, stage1 metadata visibility, and the graph zero-contribution diagnostic. One deferred P2 follow-up remains: saving the research and review findings through `generate-context.js`.

---

<details>
<summary>Technical Details: Files Changed (13 total)</summary>

### Source (13 files)

| File | Changes |
| ---- | ------- |
| `mcp_server/lib/search/sqlite-fts.ts` | Added the FTS5 double-quote guard and aligned the scope filter with exact-or-descendant folder matching. |
| `mcp_server/lib/search/vector-index-store.ts` | Stabilized DB-path resolution and cached connections only after path validation. |
| `mcp_server/core/db-state.ts` | Prevented rebinding consumers to an empty database unless explicitly overridden. |
| `mcp_server/context-server.ts` | Added startup DB-path visibility and health checks. |
| `mcp_server/lib/search/hybrid-search.ts` | Added warning logs for previously silent failure paths. |
| `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | Added warning logs, removed the bad sessionId governance interaction, and exposed `activeChannels`. |
| `mcp_server/lib/search/vector-index-queries.ts` | Added warning logs on unexpected return paths. |
| `mcp_server/lib/search/pipeline/types.ts` | Added the `activeChannels` field to stage output typing. |
| `mcp_server/lib/search/pipeline/stage2-fusion.ts` | Added graph zero-contribution diagnostics. |
| `mcp_server/handlers/memory-context.ts` | Stopped folder discovery from promoting the wrong filter path in the audited focused-mode case. |
| `.opencode/command/memory/search.md` | Applied the folder-grouped dashboard layout. |
| `.agents/commands/memory/search.toml` | Applied the same folder-grouped dashboard layout for agent command output. |
| `.opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement/013-fts5-fix-and-search-dashboard/*.md` | Captured the phase scope, tasks, checklist, and implementation summary for the completed work. |

### Tests (0 new files)

The phase relied on build verification, live search queries, focused-mode runtime checks, and checklist-backed evidence rather than adding a new dedicated test file set.

### Documentation (1 file)

| File | Changes |
| ---- | ------- |
| `.opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement/changelog/changelog-013-fts5-fix-and-search-dashboard.md` | Adds the missing changelog entry for the completed phase. |

</details>

---

## Upgrade

No migration required.

Users should see cleaner multi-word FTS5 results, a more readable `/memory:search` dashboard, and clearer diagnostics when search initialization or DB-path state drifts away from the populated database.
