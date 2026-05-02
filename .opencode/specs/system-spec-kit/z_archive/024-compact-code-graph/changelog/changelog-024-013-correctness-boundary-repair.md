# Changelog: 024/013-correctness-boundary-repair

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration)

---

## 013-correctness-boundary-repair -- 2026-03-31

This phase fixed 15 correctness bugs (2 critical, 11 must-fix, 2 improvements) found across 95 deep research iterations and 30 deep review iterations. These bugs meant the code graph produced wrong results for multi-line functions, could lose data during database failures, ignored caller-provided token budgets, leaked query results beyond requested boundaries, and accepted unsanitized inputs. Every fix had to land before any new feature work could proceed safely.

> Spec folder: `.opencode/specs/system-spec-kit/024-compact-code-graph/013-correctness-boundary-repair/`

---

## Bug Fixes (5 fixes)

### endLine collapse for all languages

**Problem:** The structural indexer -- the component that reads source code and records where each function starts and ends -- treated every function as a single line, regardless of its actual length. A 50-line function was indexed as occupying just one line. This meant the system missed all function calls inside the body of that function (since it only looked at line 1) and computed wrong content fingerprints (a digital signature used to detect when code has changed). The bug affected all three supported languages: JavaScript/TypeScript, Python, and Bash.

**Fix:** Added language-specific body detection: brace-counting for JavaScript/TypeScript and Bash (counting opening `{` and closing `}` to find where the function ends), and indentation tracking for Python (following Python's whitespace rules to detect where a block ends). The indexer now records accurate start-to-end ranges for every function, which enables correct call-edge detection (knowing which functions call which other functions) and reliable change tracking.

### Transitive query depth leak

**Problem:** When querying the code graph for related symbols up to a certain depth (for example, "show me everything connected within 3 hops"), results leaked beyond the requested boundary. The depth check used a "greater than" comparison instead of "greater than or equal to," so nodes sitting exactly at the maximum depth still expanded outward, pulling in nodes one level too deep. Additionally, when multiple paths converged on the same node, that node appeared multiple times in the results.

**Fix:** Changed the boundary check to a strict "greater than or equal to" comparison so nodes at the maximum depth are included but never expanded further. Added deduplication using a set of already-seen node identifiers, eliminating duplicate entries from converging paths. Query results now contain exactly what was requested -- nothing more, nothing less.

### Budget allocator ignored caller budgets

**Problem:** The budget allocator -- the component that divides a token budget (a size limit measured in text tokens) among different output sections -- had a hard-coded 4,000-token ceiling. No matter what budget the caller requested, the system silently capped it at 4,000. On top of that, the "session state" section (which summarizes what the user has been working on) bypassed the budget allocation model entirely, meaning it could push the total output well beyond the size the caller asked for.

**Fix:** Removed the hard-coded ceiling so the allocator respects whatever budget the caller provides (defaulting to 4,000 only when no budget is specified). Included session state in the normal allocation model so it competes for budget alongside every other section. Callers now get the output size they ask for.

### Zero-budget sections still rendered

**Problem:** When the budget allocator granted zero tokens to a section (meaning "this section should not appear"), the merger -- the component that assembles the final output -- still rendered an empty section header and appended a truncation marker (a note saying content was cut short). That truncation marker was added outside the budget, meaning it consumed space the caller did not authorize.

**Fix:** Zero-budget sections are now skipped entirely: no header, no truncation marker, no output at all. When truncation markers are needed for sections that did receive a budget, they are counted within the granted budget rather than appended after it.

### Working-set tracker exceeded its own limit

**Problem:** The working-set tracker -- which maintains a list of recently active files -- allowed the list to grow to twice the configured maximum before triggering eviction (removal of the oldest entries). This meant the tracker routinely held double the intended number of files, consuming unnecessary memory and returning an oversized list to downstream consumers.

**Fix:** Changed eviction to trigger at insertion time, enforcing the configured maximum immediately. The tracker now never exceeds its configured capacity.

---

## Database Safety (4 fixes)

### Database init failure poisoned all future calls

**Problem:** The database setup ran exactly once and stored the result in a module-level variable (a shared reference that every subsequent call reuses). If that one-time setup failed -- due to a full disk, a permissions error, or any other runtime problem -- the variable was left in a broken state permanently. Every subsequent call would encounter the broken reference and fail immediately, with no recovery path short of restarting the entire process.

**Fix:** Wrapped the initialization in error handling that, on failure, resets both the database reference and its file path back to null. This allows the next call to attempt a fresh initialization rather than inheriting the broken state.

### First-use crash on fresh runtime

**Problem:** Running a code graph scan before the database file existed threw an error. The scan handler assumed the database was already created and ready, but on a fresh runtime (first use after installation or after deleting the database file) no database existed yet.

**Fix:** The scan handler now ensures the database is initialized -- or created from scratch if it does not exist -- before performing any operation.

### Data loss on insert failure

**Problem:** The `replaceNodes()` function -- which updates a file's graph data when that file is re-indexed -- deleted the file's existing graph data first, then inserted the new data. These two operations were not wrapped in a transaction (an atomic unit that either fully succeeds or fully rolls back). If the insert step failed (for example, due to a constraint error), the delete had already completed, wiping the file's entire graph with no way to recover the original data.

**Fix:** Both operations now run inside a single database transaction. If the insert fails, the transaction rolls back, preserving the original data exactly as it was before the operation started.

### Orphan edges after re-indexing

**Problem:** When symbols (functions, classes, variables) were deleted during re-indexing, the edges connecting those symbols to other symbols were left behind as ghosts in the database. These orphan edges pointed to or from symbols that no longer existed, polluting query results and potentially causing errors in downstream graph traversal.

**Fix:** Added cleanup that removes all orphan edges -- both inbound (edges pointing to deleted symbols) and outbound (edges originating from deleted symbols) -- as part of the same transaction that replaces nodes. This ensures the graph stays internally consistent after every re-index.

---

## Security (3 fixes)

### Path traversal via rootDir

**Problem:** The `code_graph_scan` tool accepted any readable filesystem path as its root directory, with no boundary check. A caller could point the scanner at directories outside the current workspace -- including system directories or other projects -- to read and index files they should not have access to through this tool.

**Fix:** Added validation that the resolved path must fall within the current workspace directory. Paths that resolve outside the workspace are now rejected before any scanning occurs.

### Raw exception details exposed to callers

**Problem:** The `memory_context` and `code_graph_context` handlers reflected internal error details -- including stack traces (technical debugging information showing the exact sequence of code that triggered the error) and internal file paths -- directly to callers. This information could reveal implementation details useful to an attacker or simply confuse non-technical consumers.

**Fix:** Handlers now return generic, user-safe error messages while logging the full technical details to stderr (the server's internal error log) where developers can access them for debugging.

### Tool arguments bypassed validation

**Problem:** Schema validators (functions that check whether input data meets required rules) existed in the codebase, but the live dispatch path -- the actual route that tool calls follow at runtime -- did not use them. This meant callers could send malformed or oversized inputs that the system would process without complaint.

**Fix:** All code-graph tool inputs now pass through argument validation before dispatch. Missing required fields and invalid values are caught and rejected with clear error messages before any processing begins.

---

## Architecture (3 fixes)

### Seed identity lost during processing

**Problem:** The code graph context handler stripped the source-type discriminator from seeds during processing. Seeds (the starting points for a context query) carry a label indicating their origin -- whether they came from a manual user request, a graph traversal, or a search result. By removing this label, the handler made it impossible for downstream logic to prioritize seeds differently based on where they came from.

**Fix:** The source field is now preserved through the entire processing pipeline, from initial input through to final output, allowing downstream consumers to make origin-aware decisions.

### includeTrace was a dead option

**Problem:** The `code_graph_context` tool schema advertised an `includeTrace` option that callers could set. However, the handler never did anything with this option -- it was a complete no-op. Callers who set it received no trace output and no error, creating a confusing API surface.

**Fix:** Since no downstream consumers use trace metadata and the feature was never implemented, the option was removed from the schema entirely. This eliminates the false promise of trace support and produces a cleaner API surface with no behavioral change for any existing caller.

### ccc_feedback accepted unbounded input

**Problem:** The `comment` and `resultFile` fields in the feedback handler (which allows callers to submit comments about code graph results) had no length validation before writing their contents to disk. A caller could submit arbitrarily large strings that would be written to the filesystem without limit.

**Fix:** Added required-field checks at the dispatch layer that enforce the schema's bounds on these fields. Oversized or missing inputs are rejected before any disk write occurs.

---

<details>
<summary><strong>Files Changed (11 files)</strong></summary>

| File | What changed |
|------|-------------|
| `lib/code-graph/structural-indexer.ts` | Added `findBraceBlockEndLine()` and `findPythonBlockEndLine()` helpers; `capturesToNodes()` now hashes full body range; `extractEdges()` scans complete function bodies |
| `lib/code-graph/code-graph-db.ts` | Init guard with singleton reset on failure; schema migration tracking (v3); transaction wrapping for `replaceNodes()`; orphan edge cleanup |
| `lib/code-graph/budget-allocator.ts` | Removed hard-coded 4,000-token ceiling; sessionState now participates in budget allocation |
| `lib/code-graph/compact-merger.ts` | Zero-budget sections skipped entirely; truncation markers counted within budget |
| `lib/code-graph/working-set-tracker.ts` | Eviction threshold changed from 2x to 1x maxFiles |
| `handlers/code-graph/query.ts` | Strict maxDepth boundary check (`>=` instead of `>`); result deduplication via Set |
| `handlers/code-graph/context.ts` | Seed source identity preserved; exception strings sanitized; includeTrace handling removed |
| `handlers/code-graph/scan.ts` | rootDir boundary validation against workspace root |
| `handlers/memory-context.ts` | Exception strings sanitized (generic messages to callers) |
| `tools/code-graph-tools.ts` | All tool args routed through `getMissingRequiredStringArgs()` validation |
| `tool-schemas.ts` | `includeTrace` property removed from `code_graph_context` schema |

</details>

---

## Deep Review Fixes (2026-04-01)

### Doc Fixes
- ccc_feedback length validation marked as NOT IMPLEMENTED in checklist/tasks
- Tool arg validation documented as getMissingRequiredStringArgs (not unified validateToolArgs)
- Checklist count corrected from 20 to 25
- includeTrace boundary clarified (code-graph schema only)
- Decision record updated for includeTrace scope

---

## Upgrade

No migration required. The database schema version advances to v3 automatically on first use. All 226 existing tests pass without changes.
