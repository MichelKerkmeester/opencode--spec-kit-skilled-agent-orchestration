# Iteration 041: Incremental Code Graph Updates

## Focus

Investigate how production code indexing systems keep code graphs fresh without rebuilding everything on every change, with emphasis on incremental indexing, file watching, tree-sitter incremental parsing, LSP-style update loops, cache invalidation, and background indexing ergonomics.

## Findings

1. Most mature code indexing systems use a hybrid update model, not a pure "full rebuild" or pure "incremental only" model. Open-file or recently changed files are updated incrementally and quickly, while a slower background or CI-driven pipeline fills in full-project coverage. Clangd is explicit about this split: `FileIndex` is a dynamic per-file layer for opened files, while `BackgroundIndex` parses all files in the project on a queue. Rust-analyzer similarly treats changes as small deltas, keeps source in memory, and recomputes lazily. Sourcegraph precise code navigation uses uploaded per-repository indexes and periodic background auto-indexing, while CodeQL freshness is workflow-driven because its databases are point-in-time snapshots rather than live mutable indexes. For our implementation, the right model is "incremental first, periodic catch-up second," not "choose one forever." Sources: https://clangd.llvm.org/design/indexing, https://rust-analyzer.github.io/book/contributing/architecture.html, https://sourcegraph.com/docs/code-navigation/auto-indexing, https://sourcegraph.com/docs/code-navigation/precise-code-navigation, https://codeql.github.com/docs/codeql-overview/about-codeql/, https://docs.github.com/en/code-security/reference/code-scanning/workflow-configuration-options

2. File watching strategy should be chosen by runtime mode, not ideology. Raw `fs.watch` is acceptable as the lowest-level primitive, but Node documents major caveats: platform inconsistency, dependency on OS-specific backends, unreliability on network and virtualized file systems, and inode behavior where delete-and-recreate can silently move future events onto a new inode. Chokidar exists precisely to normalize those problems: it gives stable `add`/`change`/`unlink` events, recursive watching, `atomic` handling, and `awaitWriteFinish` for chunked writes. `git status --porcelain` is not a real-time watcher, but it is a strong secondary detector for startup catch-up, on-demand refresh, CI, and "what changed while the watcher was offline?" workflows. Recommended split: use chokidar for local dev interactivity, keep a git-based reconciliation pass for startup/manual refresh, and retain a polling fallback only where native events are unreliable. Sources: https://nodejs.org/api/fs.html, https://github.com/paulmillr/chokidar, https://git-scm.com/docs/git-status/2.40.0.html

3. Tree-sitter's incremental parsing model is a strong fit for file-local graph maintenance. The documented flow is: apply `ts_tree_edit` or `Tree.edit(...)` to the old tree, then parse again while passing the old tree so the new tree can share structure with it. After parsing, `changed_ranges()` gives the ranges whose syntactic structure changed. Tree-sitter also notes those ranges may be slightly larger than the exact edit, which matters for safe invalidation. This enables a practical pipeline of "edit old tree -> reparse changed file -> re-extract only impacted declarations/refs -> recompute affected graph edges." Included ranges also make mixed-language files feasible without reparsing unrelated regions. Sources: https://tree-sitter.github.io/tree-sitter/using-parsers/3-advanced-parsing.html, https://tree-sitter.github.io/py-tree-sitter/classes/tree_sitter.Tree.html

4. Rebuild triggers should be tiered by cost and confidence. Immediate triggers should include file save, editor `didChange`, file add/remove/rename, and watcher-ready startup reconciliation. Broader async rebuild triggers should include branch switches, pulls/merges, dependency or build-config changes, grammar/schema changes, and detected watcher drift. Scheduled or explicit rebuild triggers should include first-open cold start, "refresh code graph" commands, and recovery after parser/index corruption. CodeQL and Sourcegraph both show that commit, pull request, and scheduled triggers are useful for keeping shared indexes fresh even when users are not actively editing locally. Recommended policy: hot path on save, warm path on repo-shape changes, cold path on demand or schedule. Sources: https://docs.github.com/en/code-security/reference/code-scanning/workflow-configuration-options, https://sourcegraph.com/docs/code-navigation/auto-indexing

5. Language servers handle incremental analysis by keeping an in-memory mirror of the document state and applying ordered deltas from the client. LSP 3.17 defines both full and incremental synchronization; in incremental mode, the full content is sent on open and then change notifications carry ordered content edits. Server implementations then layer their own analysis strategy on top. Rust-analyzer describes exactly this pattern: the client submits a small delta, the engine updates lazily and on demand, and background work is separated from requests that would block typing. Clangd similarly overlays a dynamic per-file index on top of broader background/static indexes so active files stay fresh even while project-wide work continues. The key design lesson is that LSP does not require whole-project recomputation per edit; it standardizes an ordered delta stream that incremental analyzers can exploit. Sources: https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/, https://rust-analyzer.github.io/book/contributing/architecture.html, https://clangd.llvm.org/design/indexing

6. The cost of re-indexing a single file in a tree-sitter-based system is typically "parse one file plus local symbol/edge extraction," while a full-project refresh is "sum of every file parse plus dependency traversal plus graph merge/update." Tree-sitter is explicitly designed to be fast enough to parse on every keystroke and operates on syntax trees for a source code file, not an entire repository-wide semantic graph. Rust-analyzer reinforces the same scaling model by making syntax trees single-file units to enable parallel parsing. So there is no single universal numeric multiplier, but the shape of the cost curve is clear: single-file incremental parse cost is local and bounded by file size plus downstream edge invalidation, whereas full-project cost grows with repository size and cross-file dependency fanout. For our packet, that means the parser is unlikely to be the bottleneck; edge invalidation and cross-file graph propagation will dominate long before tree-sitter parsing does. Sources: https://github.com/tree-sitter/tree-sitter, https://tree-sitter.github.io/tree-sitter/using-parsers/3-advanced-parsing.html, https://rust-analyzer.github.io/book/contributing/architecture.html

7. Index freshness policies differ sharply across tools:
   - Sourcetrail is no longer a strong freshness reference because the public project is archived and read-only. It is useful mainly as a reminder that desktop source explorers often depend on explicit project indexing flows rather than continuously self-healing freshness.
   - Sourcegraph keeps precise navigation fresh by requiring uploaded indexes per repository and offering auto-indexing policies that run periodically in the background, scoped by branches, tags, commit age, and dependency-triggered follow-up jobs.
   - CodeQL treats the database as a point-in-time artifact, so freshness comes from rerunning extraction and analysis on push, pull request, and schedule, not from mutating a live in-memory graph after every keystroke.
   The implementation takeaway is that local interactive freshness and shared canonical freshness are usually separate systems. Sources: https://github.com/CoatiSoftware/Sourcetrail/issues/1214, https://sourcegraph.com/docs/code-navigation/precise-code-navigation, https://sourcegraph.com/docs/code-navigation/auto-indexing, https://codeql.github.com/docs/codeql-overview/about-codeql/, https://docs.github.com/en/code-security/reference/code-scanning/workflow-configuration-options

8. The best caching strategies reduce work at three levels: file content, parse trees, and derived graph artifacts. Clangd caches per-file `.idx` artifacts on disk to avoid startup reindexing when nothing changed. Tree-sitter makes trees cheap to copy, which supports concurrent readers and background workers. Git status docs also hint at the value of caching untracked-file state because even change detection can become expensive in large trees. For our implementation, the cache stack should be:
   - content hash or `(mtime,size)` guard to skip unchanged files,
   - per-file parse tree cache keyed by file path + content hash + grammar version,
   - per-file extracted symbols/imports/refs cache,
   - reverse edge indexes keyed by symbol or file id,
   - durable on-disk snapshot for cold start.
   Avoid reusing caches across incompatible compile/build contexts without including config hash in the key. Sources: https://clangd.llvm.org/design/indexing, https://tree-sitter.github.io/tree-sitter/using-parsers/3-advanced-parsing.html, https://git-scm.com/docs/git-status/2.40.0.html

9. A file change should not invalidate "the whole graph"; it should invalidate specific edge classes. Clangd's index model is useful here because it explicitly distinguishes symbols, refs, and relations, and stores file data separately in the dynamic index. That suggests a safe invalidation model:
   - if imports/includes/module declarations changed, invalidate dependency edges and dependent file scheduling,
   - if exported declarations changed, invalidate defs/refs/relations keyed by affected symbol ids and schedule dependents,
   - if only function bodies changed, invalidate local refs/call edges/diagnostics, but preserve global symbol tables where possible,
   - use tree-sitter `changed_ranges()` to narrow extraction to changed declarations first, then widen only when syntax movement crosses declaration boundaries.
   Rust-analyzer's invariant that typing inside one function body should not invalidate global derived data is the right mental model: body edits and API edits should have different invalidation scopes. Sources: https://clangd.llvm.org/design/indexing, https://tree-sitter.github.io/py-tree-sitter/classes/tree_sitter.Tree.html, https://rust-analyzer.github.io/book/contributing/architecture.html

10. Background indexing should be visible, cancellable, and never block the user's typing loop. Clangd's split between `FileIndex`, `BackgroundIndex`, thread pools, queues, and cached on-disk artifacts is a strong reference design. Rust-analyzer explicitly keeps potentially blocking work off the main request path. Chokidar's `ready` event and write-stability options also fit well with staged background catch-up. Best practices for our implementation are:
   - prioritize the active file and its immediate neighbors first,
   - debounce watcher events and coalesce duplicate saves,
   - keep a bounded worker pool,
   - serve stale-but-known-good graph data until replacement is ready,
   - expose freshness metadata so callers know whether results are hot, warm, or rebuilding,
   - keep an explicit "full rebuild" recovery path,
   - treat repo-wide rebuilds as background jobs unless correctness is impossible otherwise.
   This favors responsive UX without pretending the graph is always perfectly current. Sources: https://clangd.llvm.org/design/indexing, https://rust-analyzer.github.io/book/contributing/architecture.html, https://github.com/paulmillr/chokidar

## Evidence

- Tree-sitter advanced parsing and incremental edit flow: https://tree-sitter.github.io/tree-sitter/using-parsers/3-advanced-parsing.html
- Tree-sitter changed range semantics: https://tree-sitter.github.io/py-tree-sitter/classes/tree_sitter.Tree.html
- Tree-sitter project overview and file-scoped parsing goals: https://github.com/tree-sitter/tree-sitter
- LSP 3.17 text document synchronization and ordered incremental changes: https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/
- Node `fs.watch` caveats and OS-dependent behavior: https://nodejs.org/api/fs.html
- Chokidar watcher normalization, atomic write handling, and recursive watching: https://github.com/paulmillr/chokidar
- Git porcelain status for scriptable repository change detection: https://git-scm.com/docs/git-status/2.40.0.html
- Clangd dynamic index, background index, queueing, and on-disk cache: https://clangd.llvm.org/design/indexing
- Rust-analyzer incremental architecture and background processing model: https://rust-analyzer.github.io/book/contributing/architecture.html
- Sourcegraph precise code navigation and auto-indexing freshness policy: https://sourcegraph.com/docs/code-navigation/precise-code-navigation
- Sourcegraph indexing policy scheduling and commit/branch scope: https://sourcegraph.com/docs/code-navigation/auto-indexing
- CodeQL database creation and point-in-time database model: https://codeql.github.com/docs/codeql-overview/about-codeql/
- GitHub CodeQL/code scanning trigger options on push, pull request, and schedule: https://docs.github.com/en/code-security/reference/code-scanning/workflow-configuration-options
- Sourcetrail public archive/EOL status: https://github.com/CoatiSoftware/Sourcetrail/issues/1214

## New Information Ratio (0.0-1.0)

0.74

## Novelty Justification

This iteration adds implementation-relevant detail that was not captured by a generic "incremental indexing is faster" summary. The new value is the synthesis across parser-local updates, watcher reliability, LSP delta handling, edge invalidation scope, and freshness policies from real tools. The most useful new distinction is between parser incrementality and graph incrementality: tree-sitter makes file reparsing cheap, but correctness and performance depend on how narrowly we invalidate symbols, refs, imports, and dependent files after that parse.

## Recommendations for Our Implementation

1. Use a hybrid freshness architecture: incremental per-file updates for active edits plus a background project catch-up queue.
2. Prefer `chokidar` over raw `fs.watch` for local development, but add a startup and manual reconciliation pass using Git-aware change detection.
3. Store one parse tree and one extracted graph fragment per file, keyed by content hash and grammar/config version.
4. Use tree-sitter `edit + reparse(oldTree) + changed_ranges()` as the first invalidation stage, not the final one.
5. Separate invalidation classes for body-only edits, declaration/API edits, and import/include/module graph edits.
6. Maintain reverse indexes from symbol id to outgoing and incoming edges so dependent invalidation is targeted instead of global.
7. Keep a dynamic "hot" overlay for changed/open files and merge it over a slower durable baseline snapshot.
8. Run full rebuilds only for corruption recovery, branch-wide drift, grammar/schema changes, or explicit user request.
9. Surface freshness state in the graph API so consumers can tell whether data is live, background-refreshing, or recovered from cache.
10. Design background indexing as cancelable, coalesced, and bounded so typing and interactive commands never wait on repo-wide work.
