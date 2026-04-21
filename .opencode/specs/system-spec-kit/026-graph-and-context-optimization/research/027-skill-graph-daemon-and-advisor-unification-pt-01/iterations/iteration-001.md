# Iteration 001 — Track A: A1 — Watcher choice

## Question
Which file-watching implementation should Phase 027 use for the skill-graph auto-update daemon: raw Node `fs.watch`, `chokidar`, direct macOS `fsevents`, polling, or another approach?

## Evidence Collected
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/research/deep-research-strategy.md:48` → Iteration 1 is mapped to "A1 Watcher choice".
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/research/deep-research-strategy.md:104` → A1 evidence map calls for Node `fs.watch`, `chokidar`, `fsevents`, atomic-rename editor behavior, and existing repo watcher usage.
- `.opencode/skill/system-spec-kit/mcp_server/package.json:43`-`.opencode/skill/system-spec-kit/mcp_server/package.json:50` → The MCP server already depends on `chokidar` `^4.0.3`, so choosing it adds no new dependency to this package.
- `.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:23`-`.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:29` → The existing reusable watcher helper accepts paths, `reindexFn`, optional `removeFn`, debounce, and injectable `watchFactory`.
- `.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:49`-`.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:58` → The helper has a 2-second default debounce, retry delays, metrics counters, and lazy `chokidar` module state.
- `.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:251`-`.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:258` → The helper configures `ignoreInitial`, `awaitWriteFinish`, ignored paths, and `followSymlinks: false`.
- `.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:299`-`.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:405` → Reindex scheduling resolves real paths, verifies containment, hashes content, skips unchanged files, bounds concurrency, retries `SQLITE_BUSY`, and records timing metrics.
- `.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:407`-`.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:445` → Delete handling clears canonical path/hash state, calls `removeFn`, and maps `add`, `change`, `unlink`, and `error` watcher events.
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1510`-`.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1544` → A skill-graph-specific watcher already uses `chokidar`, watches `*/graph-metadata.json`, debounces via `scheduleSkillGraphIndex`, and handles add/change/unlink/error.
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1588`-`.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1608` → Shutdown cleanup already closes both the markdown file watcher and the skill graph watcher before closing the skill graph DB.
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:2038`-`.opencode/skill/system-spec-kit/mcp_server/context-server.ts:2094` → `SPECKIT_FILE_WATCHER` startup currently starts the markdown watcher and then attempts `startSkillGraphWatcher()`.
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:2119`-`.opencode/skill/system-spec-kit/mcp_server/context-server.ts:2123` → Startup always schedules a non-blocking full memory scan and skill graph scan, so watcher choice is about keeping the graph fresh after startup, not initial seeding.
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:348`-`.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:356` → The watcher remains opt-in through `SPECKIT_FILE_WATCHER=true` and the rollout policy.
- `.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/06-real-time-filesystem-watching-with-chokidar.md:16`-`.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/06-real-time-filesystem-watching-with-chokidar.md:20` → The shipped feature catalog records chokidar-based push indexing with 2-second debounce, SHA-256 deduplication, `SQLITE_BUSY` backoff, metrics, lifecycle wiring, and tests.
- `.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/08-watcher-delete-rename-cleanup.md:16`-`.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/08-watcher-delete-rename-cleanup.md:22` → Existing watcher behavior treats rename as unlink plus add, removes stale entries, and has coverage for unlink cleanup, rename lifecycle, debounce, burst rename, and concurrent rename handling.
- `.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:304`-`.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:327` → Tests verify `removeFn` fires when a markdown file is deleted.
- `.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:329`-`.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:359` → Tests verify `SQLITE_BUSY` retries before success.
- `.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:364`-`.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:428` → Tests verify changed `.md` files reindex within 5 seconds and rapid saves debounce to one reindex.
- `.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:430`-`.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:473` → Tests verify rename cleanup removes the old path and indexes the new resolved path.
- `.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:503`-`.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:552` → Tests verify burst renames leave only the final path indexed.
- `.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:554`-`.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:606` → Tests verify concurrent renames across multiple files.
- `.opencode/skill/skill-advisor/manual_testing_playbook/05--sqlite-graph/003-auto-reindex.md:22`-`.opencode/skill/skill-advisor/manual_testing_playbook/05--sqlite-graph/003-auto-reindex.md:30` → The manual validation contract expects watcher-driven SQLite updates after a metadata edit without manual compiler rerun.
- `.opencode/skill/skill-advisor/manual_testing_playbook/05--sqlite-graph/003-auto-reindex.md:61`-`.opencode/skill/skill-advisor/manual_testing_playbook/05--sqlite-graph/003-auto-reindex.md:75` → Failure triage points to `context-server.ts` watcher scheduling and skill-graph hash-skip logic; source anchors list the watcher, DB indexer, and `graph-metadata.json`.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:448`-`.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:455` → The skill graph indexer already declares SHA-256 unchanged-file skipping and stale node deletion as core indexer behavior.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:520`-`.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:587` → Skill graph indexing runs inside a `better-sqlite3` transaction, skips unchanged rows, deletes edges for changed sources, rejects bad edges, and inserts updated edges.
- `https://nodejs.org/api/fs.html:L4224-L4240` → Node documents that `fs.watch` depends on platform backends, may fail or be unreliable on network/virtualized filesystems, has inode behavior on Linux/macOS after delete/recreate, and does not always provide a filename.
- `https://raw.githubusercontent.com/paulmillr/chokidar/main/README.md:L0-L1` → Chokidar describes itself as a cross-platform library that normalizes raw `fs.watch`/`fs.watchFile` events and reports add/change/unlink instead of raw rename-style events.
- `https://raw.githubusercontent.com/paulmillr/chokidar/main/README.md:L8-L19` → Chokidar exposes `awaitWriteFinish`, `atomic`, filtering, depth, polling controls, and normalized events; `atomic` can convert quick unlink/add sequences into a change event.
- `https://raw.githubusercontent.com/paulmillr/chokidar/main/README.md:L22-L24` → Chokidar documents file-handle exhaustion risks and polling fallback tradeoffs.
- `https://npm.io/package/fsevents:L25-L31` → `fsevents` is native macOS FSEvents access and its own docs point cross-platform watcher users to Chokidar.
- `https://npm.io/package/fsevents:L47-L56` → Direct `fsevents` requires retaining the returned stop function and exposes lower-level path/flag/id events, making it a narrower platform-specific primitive.
- `https://vimhelp.org/options.txt.html:L1064-L1101` → Vim documents save modes that either copy-overwrite or rename-and-create-new, and explicitly notes rename mode can matter to file-watcher daemons.

## Analysis
The local evidence favors `chokidar` immediately because it is already a package dependency, already loaded by both the generic file watcher and the skill-graph watcher, and already wrapped in lifecycle, shutdown, debounce, retry, and metrics conventions (`package.json:43-50`, `file-watcher.ts:23-29`, `context-server.ts:1510-1544`, `context-server.ts:1588-1608`). Raw `fs.watch` would move Phase 027 toward platform-specific caveats that Node itself documents: backend differences, unreliable network/virtualized paths, inode loss after delete/recreate, and non-guaranteed filenames (`https://nodejs.org/api/fs.html:L4224-L4240`).

Direct `fsevents` should be rejected for the Phase 027 daemon path because it is macOS-only and low-level; its own docs direct cross-platform users to Chokidar (`https://npm.io/package/fsevents:L25-L31`). The user environment is macOS, but the repo's MCP server and skill-advisor stack are not macOS-only; adopting direct `fsevents` would require a second implementation path for Linux/Windows while Chokidar already normalizes platform backends (`https://raw.githubusercontent.com/paulmillr/chokidar/main/README.md:L0-L1`).

The most important A1 design pressure is editor save behavior. Vim explicitly documents rename-and-new-file save modes that affect watcher daemons (`https://vimhelp.org/options.txt.html:L1064-L1101`), while Chokidar offers `atomic` and `awaitWriteFinish` knobs for atomic and chunked write patterns (`https://raw.githubusercontent.com/paulmillr/chokidar/main/README.md:L8-L19`). The repo's current generic helper already combines `awaitWriteFinish`, content hashing, containment checks, bounded concurrency, `SQLITE_BUSY` retry, delete cleanup, and event mapping (`file-watcher.ts:251-258`, `file-watcher.ts:299-405`, `file-watcher.ts:407-445`), and its tests cover delete, rename, burst rename, concurrent rename, debounce, timing, and retry cases (`file-watcher.vitest.ts:304-606`).

The only caution is that the skill-graph watcher in `context-server.ts` currently duplicates a slimmer direct Chokidar path rather than reusing the fuller `startFileWatcher` helper (`context-server.ts:1510-1544`). That does not weaken the watcher-choice verdict; it only means later A2/A3/A4 work should decide whether to keep the targeted `*/graph-metadata.json` watcher or refactor it onto the shared helper without reopening the underlying library choice.

## Verdict
- **Call:** adopt_now
- **Confidence:** high
- **Rationale:** Adopt Chokidar now as the daemon watcher substrate; reject raw `fs.watch` and direct `fsevents` for Phase 027 because the repo already ships Chokidar and has watcher behavior patterns/tests that address platform and editor-save hazards.

## Dependencies
A2, A3, A4, A5, A6, A8, B5

## Open follow-ups
Verify whether the skill-graph watcher should reuse `startFileWatcher` or remain a narrow `graph-metadata.json` watcher in A2/A3. Benchmark watcher count and resource budget in A6, especially because Chokidar warns about file-handle exhaustion and polling fallback costs. Confirm implementation-phase behavior for VS Code-specific save settings if a reproducible VS Code atomic-save edge case is required.

## Metrics
- newInfoRatio: 0.86
- dimensions_advanced: [A]
