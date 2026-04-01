## [v0.11.0] - 2026-04-01

This phase matters because search is only trustworthy when its indexes, generated output, and release record stay in step after a repository move. It captures seven completed changes across CocoIndex Code (the semantic code search service), BM25 (exact-word matching), Code Graph (the structural map of files, imports, and calls), build output, and retroactive documentation, with fresh rebuild and health data confirming the stack is usable again.

> Spec folder: `.opencode/specs/02--system-spec-kit/023-esm-module-compliance/011-indexing-and-adaptive-fusion` (Level 1)

---

## Search (5)

These five changes restore the parts of the search stack that were weakened by the repository move and the follow-up cleanup work. Together they make semantic search, exact-word matching, structural lookup, and ranking explanations easier to trust again.

### CocoIndex Code lost its bearings after the repository move

**Problem:** CocoIndex Code (the semantic code search service) was still tied to the old repository location and stale local index state after the move. That left concept-based search in a shaky state where results could be outdated or shaped by folders that should not influence code discovery. It was like moving a library but forgetting to update the catalog and shelf map.

**Fix:** Semantic code search now rebuilds from clean state against the current repository and skips noisy documentation folders that should not shape code results. That gives users a current, cleaner search map of the codebase instead of a half-stale one.

### BM25 memory search needed a clean rebuild of its index

**Problem:** BM25 (exact-word matching) depends on a current memory index to surface the right documents when the query wording matters. After the repository move and related search repairs, that index needed a full rebuild so memory search would reflect the live repository instead of older state.

**Fix:** Exact-word memory search now works from a freshly rebuilt index of the current memory set. Users get results based on what is actually stored now, not leftovers from an earlier repository layout.

### Code Graph could fail on the very first lookup

**Problem:** Code Graph (the structural map of files, imports, and calls) expected its storage to be prepared in advance. If that had not happened yet, a perfectly valid structural search could fail on first use instead of starting itself.

**Fix:** Structural lookup now prepares its own storage the first time it is needed. That changes the experience from a setup-order failure to a tool that starts working when someone asks a graph question.

### Adaptive fusion was hard to trust across MCP clients

**Problem:** Adaptive fusion decides how much influence each search channel gets, but that default behavior was not clearly shown across MCP (the protocol layer that connects tools to the assistant) client configurations. When code and configuration tell different stories, operators cannot easily tell whether ranking behavior is intentional or accidental.

**Fix:** The runtime configurations now state the intended adaptive behavior directly, so assistant integrations read the same default story everywhere. That makes rollouts easier to understand and reduces doubt when ranking behavior changes.

### Exact-word score traces vanished after blended ranking

**Problem:** BM25 and FTS5 (SQLite's built-in full-text search engine) both provide exact-word evidence that helps explain why a result ranked well. After the blended ranking step, that evidence could disappear from the final trace, which made search results harder to inspect and harder to debug.

**Fix:** Final search traces now keep exact-word scoring evidence visible after ranking is blended. Users and maintainers can see when word-based matching helped a result, instead of losing that explanation at the last step.

---

## Bug Fixes (1)

### Generated runtime output had to catch up with the source changes

**Problem:** The source-side search repairs were complete, but generated runtime output still needed to be rebuilt so packaged execution would reflect the same behavior. Without that refresh, people relying on compiled output could see older behavior than the phase record described.

**Fix:** The generated runtime output is now rebuilt to match the current source state. That keeps packaged execution aligned with the documented fixes instead of leaving a gap between source and shipped output.

---

## Documentation (1)

### This phase needed its own audit trail

**Problem:** The work was complete, but without a dedicated spec folder its scope, task list, and implementation record were harder to follow later. That weakens traceability for anyone trying to understand why these search repairs were made.

**Fix:** This phase now has a retroactive spec folder that gathers the scope, plan, tasks, and implementation summary in one place. Reviewers and future maintainers get a single record instead of scattered notes.

---

## Test Impact

| Metric | Before | After |
| ------ | ------ | ----- |
| Fresh semantic code rebuild coverage | 0 files | 51,820 files |
| Fresh semantic code rebuild detail | 0 chunks | 663,336 chunks |
| Fresh BM25 memory rebuild coverage | 0 memories | 1,228 memories |
| Verified healthy memory records | 0 verified | 2,961 verified healthy |
| TypeScript dist rebuilds completed | 0 | 1 |

No new automated test files were added in this phase. Validation came from runtime health checks, a full semantic-code rebuild, a full memory re-index, and a TypeScript build that refreshed generated output while surfacing the same 3 unrelated pre-existing compiler errors recorded in the implementation summary.

---

<details>
<summary>Technical Details: Files Changed (17 total)</summary>

### Source (13 files)

| File | Changes |
| ---- | ------- |
| `.opencode/skill/mcp-coco-index/mcp_server/.venv/` | Recreated the Python environment so the semantic code search service resolves against the current repository path. |
| `.opencode/skill/mcp-coco-index/mcp_server/.cocoindex_code/settings.yml` | Tightened crawler exclusions so semantic code search skips spec and changelog noise during rebuilds. |
| `.opencode/skill/mcp-coco-index/mcp_server/.cocoindex_code/cocoindex.db/` | Cleared stale local index state before the fresh semantic code rebuild. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts` | Added first-use database initialization for structural graph lookups. |
| `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts` | Preserved BM25 and FTS5 source scores after reciprocal rank fusion (RRF, the method that blends ranked lists). |
| `.opencode/skill/system-spec-kit/mcp_server/dist/` | Rebuilt the generated runtime output so packaged MCP server execution matches the source-side search fixes. |
| `.mcp.json` | Made adaptive fusion explicit in the Public MCP runtime configuration. |
| `.claude/mcp.json` | Made adaptive fusion explicit in the Claude runtime configuration for the Public repo. |
| `.vscode/mcp.json` | Made adaptive fusion explicit in the VS Code runtime configuration for the Public repo and corrected the note about defaults. |
| `opencode.json` | Made adaptive fusion explicit in the OpenCode runtime configuration for the Public repo. |
| `Barter/.claude/mcp.json` | Added the same adaptive-fusion setting to the paired Claude runtime configuration in the companion repo. |
| `Barter/.vscode/mcp.json` | Added the same adaptive-fusion setting and note correction to the paired VS Code runtime configuration in the companion repo. |
| `Barter/opencode.json` | Added the same adaptive-fusion setting to the paired OpenCode runtime configuration in the companion repo. |

### Tests (0 files)

No dedicated automated test files changed in this phase. Validation covered `memory_health()` with 2,961 healthy memories, `memory_index_scan(force: true)` with 1,228 memories re-indexed, `ccc doctor` with a verified binary and running daemon, `ccc index` with 51,820 files indexed, and a TypeScript build that refreshed generated `dist/` output while leaving the same 3 unrelated pre-existing compiler errors noted in the implementation summary.

### Documentation (4 files)

| File | Changes |
| ---- | ------- |
| `.opencode/specs/02--system-spec-kit/023-esm-module-compliance/011-indexing-and-adaptive-fusion/spec.md` | Captured the retroactive scope, problem statement, and solution summary for the phase. |
| `.opencode/specs/02--system-spec-kit/023-esm-module-compliance/011-indexing-and-adaptive-fusion/plan.md` | Recorded the implementation sequence and completion status for the phase work. |
| `.opencode/specs/02--system-spec-kit/023-esm-module-compliance/011-indexing-and-adaptive-fusion/tasks.md` | Recorded the completed task checklist, including the dist rebuild, BM25 re-index, and retroactive spec creation. |
| `.opencode/specs/02--system-spec-kit/023-esm-module-compliance/011-indexing-and-adaptive-fusion/implementation-summary.md` | Captured the verification results and source-level detail behind the phase summary. |

</details>

---

## Upgrade

No migration required.
