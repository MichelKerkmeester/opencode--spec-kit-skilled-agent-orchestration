# Iteration 5: PreToolUse Hook + Cache Invalidation + Incremental Rebuild

## Focus
Resolve Q9 (PreToolUse hook fire conditions, payload, effect on Claude) and Q8 (cache invalidation strategy across content hash, manifest, and rebuild orchestration). Read `external/graphify/__main__.py`, `external/graphify/watch.py`, and `external/graphify/hooks.py` end-to-end. These three files implement graphify's "make Claude graph-aware automatically" layer and the "rebuild without spending tokens" layer.

## Findings

1. **The PreToolUse hook payload is a single shell command stored verbatim in `_SETTINGS_HOOK`** at `__main__.py:9-21`. The hook entry registers under matcher `"Glob|Grep"` (Claude Code regex matches both `Glob` and `Grep` tool names), uses type `command`, and the command body is exactly: `[ -f graphify-out/graph.json ] && echo 'graphify: Knowledge graph exists. Read graphify-out/GRAPH_REPORT.md for god nodes and community structure before searching raw files.' || true`. Three properties make this surgically minimal: (a) it's conditional — only fires if `graphify-out/graph.json` exists, (b) it ALWAYS exits 0 via the `|| true` tail so the hook is never blocking, (c) the message is one line, not a structured payload. The matcher is the same set of tools Public uses for raw-file search, so this is an extremely tight insertion point. [SOURCE: external/graphify/__main__.py:9-21]

2. **Hook installation writes directly to `.claude/settings.json`** at the project root (NOT global). `_install_claude_hook()` reads or creates `.claude/settings.json`, navigates `settings["hooks"]["PreToolUse"]` (creating both keys if missing), and appends `_SETTINGS_HOOK` after an idempotency check that scans for any existing entry with `matcher == "Glob|Grep"` AND the literal substring `"graphify"` in its repr (`__main__.py:124-131`). Re-installation is safe; uninstall (`_uninstall_claude_hook` at __main__.py:134-149) filters that same predicate. The hook lives in a project-local file Public already controls. [SOURCE: external/graphify/__main__.py:108-149]

3. **`graphify claude install` writes a project CLAUDE.md section in addition to the hook** at `__main__.py:70-79`. The section instructs Claude to: (a) read `graphify-out/GRAPH_REPORT.md` before architecture/codebase questions; (b) navigate `graphify-out/wiki/index.md` if it exists instead of raw files; (c) run `python3 -c "from graphify.watch import _rebuild_code; from pathlib import Path; _rebuild_code(Path('.'))"` after modifying code in a session. This is a behavioral contract injected into the model's instructions, NOT a hook — it relies on Claude actually reading CLAUDE.md. The pair (CLAUDE.md instructions + PreToolUse hook) is graphify's two-pronged "make Claude graph-aware" pattern: declarative guidance for high-level reasoning, and procedural guards on the low-level tool calls. [SOURCE: external/graphify/__main__.py:70-79; external/graphify/__main__.py:84-106]

4. **Cache invalidation is a TWO-LAYER stack**, not a single content-hash mechanism: the manifest layer (mtime-based) filters which files to consider for re-extraction, then the SHA256 layer (content-based) decides whether to actually re-run the extractor. `detect.py:237-274` (`detect_incremental`) compares `Path(f).stat().st_mtime` against the stored manifest from a previous run and returns `new_files` (mtime newer than stored) versus `unchanged_files`. `extract.py` then calls `load_cached(path, root)` per file, which inside `cache.py:21-38` recomputes the SHA256 and returns the cached entry only if the hash still matches. The two layers protect against different failure modes: manifest catches the common "file edited" case cheaply (no hashing), SHA256 catches the rarer "file touched but content unchanged" case (rename-revert, autosave, etc.). [SOURCE: external/graphify/detect.py:237-274; external/graphify/cache.py:21-38; external/graphify/extract.py:2371-2378]

5. **The `_rebuild_code()` function at `watch.py:21-84` IS graphify's "Claude-free rebuild" primitive** — it's invoked by both the file watcher and both git hooks (post-commit, post-checkout). It re-runs the full pipeline (`extract → build → cluster → analyze → report → export`) for code files only, skipping `.`-prefixed paths, `graphify-out/`, and `__pycache__`. Critical property: it generates `Community {cid}` placeholder labels (watch.py:61), NOT semantic labels — those require Claude via skill.md Step 5. So watch-driven rebuilds preserve community structure but lose human-readable names until the next manual `/graphify` run. This is a deliberate trade-off: keep the graph fresh and queryable without spending tokens, even if community names go stale. [SOURCE: external/graphify/watch.py:21-84]

6. **The watch loop routes by file-type intent**: `_WATCHED_EXTENSIONS` covers code + docs + papers + images, but the dispatch in `watch()` calls `_has_non_code(batch)` to check whether the change set includes any non-code files. If yes, route to `_notify_only()` which writes a `graphify-out/needs_update` flag and prints "Run `/graphify --update`"; if no, route to `_rebuild_code()` for an immediate Claude-free rebuild. This is a precise statement of the LLM-vs-deterministic boundary: code changes are always free, doc/paper/image changes always cost tokens. Public should evaluate this routing rule when designing its own incremental update path. [SOURCE: external/graphify/watch.py:98-99; external/graphify/watch.py:150-161]

7. **Watchdog debouncing is 3.0 seconds by default**, with a clean implementation at `watch.py:119-166`. The handler accumulates `changed` paths and updates `last_trigger`, the polling loop sleeps 0.5s and checks `(time.monotonic() - last_trigger) >= debounce` before draining the batch. This is critical for IDE save patterns where a single semantic change can trigger 5-10 file save events in rapid succession (linters, formatters, type-checkers all re-saving). Public's hook-driven indexers should adopt similar debouncing or risk thundering-herd rebuild storms. [SOURCE: external/graphify/watch.py:102-166]

8. **Git hooks are bash wrappers around Python that delegate back into `_rebuild_code`** at `hooks.py:8-77`. The post-commit hook computes `git diff --name-only HEAD~1 HEAD`, filters to a hard-coded `CODE_EXTS` set, exits silently if no code changed, and otherwise calls `from graphify.watch import _rebuild_code; _rebuild_code(Path('.'))`. The post-checkout hook only fires on branch switches (`$3 == 1`) AND only if `graphify-out/` already exists, preventing it from firing in fresh clones. Both hooks use marker comments (`# graphify-hook`, `# graphify-checkout-hook`) for idempotent install/uninstall via append-or-skip semantics — they will COEXIST with other tooling's hooks rather than overwriting them. [SOURCE: external/graphify/hooks.py:8-77; external/graphify/hooks.py:89-117]

9. **The hook installer walks up to find `.git`** via `_git_root(path)` at `hooks.py:80-86`, traversing `current.resolve()` and its parents looking for a `.git` directory. This means the install command works from any subdirectory of a repo, and refuses to install (raises `RuntimeError`) if no git repo is found anywhere up the tree. This is a small but useful pattern for any tool that wants to attach itself to a repo without requiring the user to be at the root. [SOURCE: external/graphify/hooks.py:80-86; external/graphify/hooks.py:120-132]

10. **The hook payload is intentionally a NUDGE not a BLOCK** — `|| true` ensures the hook never fails, the `echo` injects a one-line message (not a structured tool result), and Claude is free to ignore the message and continue with the original Glob/Grep call. This is the difference between "guidance hook" and "veto hook." Public should evaluate which category fits its goals: a veto hook (fail with stderr to actually block the call) is more aggressive but breaks user trust if the alternative is wrong; a nudge hook (graphify's choice) preserves Claude's autonomy but relies on Claude's instruction-following discipline. The graphify approach is tractable because the message references a file the model can actually open — it's not just abstract guidance. [SOURCE: external/graphify/__main__.py:14-18]

11. **There is no per-file cache TTL or capacity bound.** `cache.py` has `clear_cache()` which deletes ALL `*.json` entries from `graphify-out/cache/` (cache.py:58-62), but no automatic eviction. If a file is renamed or deleted from the corpus, its cache entry persists indefinitely. This is intentional for the "rename = preserve cache" property (since rename without content change doesn't invalidate the SHA256), but it means the cache directory grows monotonically until manual cleanup. Public should evaluate whether to add a "garbage collect orphaned cache entries on full detect" pass when adopting this pattern. [SOURCE: external/graphify/cache.py:58-62]

12. **The full set of "what runs Claude-free" is broader than just AST extraction.** Per the watch + hooks architecture: full pipeline (`detect → extract (with cache) → build → cluster → analyze → report → export`) is free for code-only changes. The cached semantic extraction layer is also Claude-free — `check_semantic_cache` returns previously-extracted nodes/edges/hyperedges from prior runs without invoking Claude. Only files that are BOTH non-code AND not previously extracted require LLM. So a corpus that has been graphified once and then re-saves doc files in place (without content changes) costs zero tokens to re-rebuild. The cost-incurring scenarios are exactly: first-run semantic extraction, doc-content-changes, image-content-changes, and `--mode deep` re-runs. [SOURCE: external/graphify/watch.py:21-84; external/graphify/cache.py:65-124]

## PreToolUse Hook — Verbatim JSON

```json
{
  "matcher": "Glob|Grep",
  "hooks": [
    {
      "type": "command",
      "command": "[ -f graphify-out/graph.json ] && echo 'graphify: Knowledge graph exists. Read graphify-out/GRAPH_REPORT.md for god nodes and community structure before searching raw files.' || true"
    }
  ]
}
```

Installed at `<project>/.claude/settings.json` under `hooks.PreToolUse[]`.

## CLAUDE.md Section — Verbatim

```markdown
## graphify

This project has a graphify knowledge graph at graphify-out/.

Rules:
- Before answering architecture or codebase questions, read graphify-out/GRAPH_REPORT.md for god nodes and community structure
- If graphify-out/wiki/index.md exists, navigate it instead of reading raw files
- After modifying code files in this session, run `python3 -c "from graphify.watch import _rebuild_code; from pathlib import Path; _rebuild_code(Path('.'))"` to keep the graph current
```

## Cache Invalidation Stack (full trace)

```
[Layer 1: Manifest mtime filter]
detect_incremental(root, manifest_path):
    full = detect(root)                              # walk filesystem, classify files
    manifest = load_manifest()                       # {filepath: stored_mtime}
    for each file:
        if stored_mtime is None or current_mtime > stored:
            new_files[ftype].append(file)
        else:
            unchanged_files[ftype].append(file)
    return {new_files, unchanged_files, ...}

[Layer 2: SHA256 content hash]
load_cached(path, root):
    h = sha256(file.read_bytes()).hexdigest()
    entry = graphify-out/cache/{h}.json
    if entry.exists():
        return json.loads(entry.read_text())
    return None

extract(paths):
    for path in paths:                                # paths come from new_files OR full set
        cached = load_cached(path, root)              # SHA256 check
        if cached is not None:
            per_file.append(cached)                   # CACHE HIT — no extraction
            continue
        result = extract_<lang>(path)                 # CACHE MISS — re-extract
        if "error" not in result:
            save_cached(path, result, root)
        per_file.append(result)
```

**Combined behavior table:**

| Scenario | Manifest layer | SHA256 layer | Net result |
|---|---|---|---|
| File unchanged since last run | Skipped (mtime stale) | N/A (not asked) | 0 work |
| File saved without content change (touch, autosave) | Marked new (mtime updated) | Cache hit | re-walks but no re-extract |
| File edited and saved | Marked new | Cache miss | re-extracted, cache updated |
| File renamed (no content change) | Marked new (new path = no stored mtime) | Cache hit (same hash) | re-walks but no re-extract |
| File reverted to prior content | Marked new (mtime updated) | Cache hit | re-walks but no re-extract |
| Cache entry deleted / corrupted | Marked new | Cache miss | full re-extract |

## Rebuild Orchestration (full trace)

| Trigger | Mechanism | Routes To | LLM cost |
|---|---|---|---|
| File save (code) via watcher | watchdog → debounce 3s → `_has_non_code` false | `_rebuild_code(watch_path)` | $0 |
| File save (non-code) via watcher | watchdog → debounce 3s → `_has_non_code` true | `_notify_only` writes `needs_update` flag | $0 (deferred) |
| `git commit` | post-commit hook → `git diff` → filter code exts | `_rebuild_code(Path('.'))` | $0 |
| `git checkout <branch>` | post-checkout hook → check `$3 == 1` AND `graphify-out/` exists | `_rebuild_code(Path('.'))` | $0 |
| User runs `/graphify --update` | skill.md flow | full pipeline with cache lookups | only uncached docs/papers/images |
| User runs `/graphify <path>` | skill.md flow | full pipeline | only uncached files (first run = max cost) |
| User runs `python3 -c "from graphify.watch import _rebuild_code; _rebuild_code(Path('.'))"` (CLAUDE.md instruction) | direct call | `_rebuild_code(Path('.'))` | $0 |

**Implication for Public:** the entire structural rebuild path has been engineered to be Claude-free and re-entrant. Public's incremental indexer paths could match this property by ensuring (a) any deterministic re-derivation can be invoked from a CLI script, (b) hook-driven re-derivations call the same script, and (c) the LLM-dependent path is opt-in and clearly labeled.

## Public Translation Notes (preview, formalized in synthesis)

- **Matcher overlap is exact**: graphify's hook matcher `"Glob|Grep"` is the same set of tools Public uses as primary search. Translating this pattern to Public would mean adding a similar PreToolUse hook that nudges Claude toward `code_graph_query` or `mcp__cocoindex_code__search` when those would be cheaper or more accurate than raw `Grep`/`Glob`.
- **Hook payload format for Public**: a single-line conditional message keyed on whether Public's structural index exists. Example: `[ -d .opencode/code-graph ] && echo 'Public: code graph available. Use code_graph_query for callers/imports, mcp__cocoindex_code__search for concept search, before raw Grep.' || true`. Conditional execution preserves portability.
- **Two-layer invalidation is reusable**: Public's existing CocoIndex / Code Graph indexers could adopt the manifest+hash pattern to avoid both wasted walking AND wasted re-derivation in the common no-op cases.

## Ruled Out

- **Hoping the hook payload includes the actual report content**: it doesn't. The hook injects a one-line nudge that tells Claude to READ the report file. The report file is stored on disk and Claude must explicitly open it. This is a deliberate choice — injecting the full report would be a token explosion on every Glob/Grep call. Public should not try to inline structural answers into the hook message.

- **Looking for a hook that blocks tool use**: graphify's hook is a guidance nudge, not a veto. There is no path in `__main__.py` or `hooks.py` that returns a non-zero exit code from the hook. Public should treat "block raw file search" as a separate design question — graphify's design intentionally avoids it.

- **Looking for cache TTL or capacity management**: not implemented. The cache grows monotonically. Public should consider adding a GC pass when adopting the SHA256 cache pattern.

## Dead Ends

- **Hoping watch.py can rebuild semantic content automatically**: it cannot. `_notify_only` is the explicit dead end for non-code changes — the watcher writes a flag and stops. Public should not assume "watcher = full freshness." Doc/image freshness still requires a human invocation of `/graphify --update`.

- **Hoping git hooks fire on `git pull`**: not directly. They fire on the post-commit / post-checkout events that follow a pull, so a fast-forward merge will eventually trigger them, but a rebase or merge with conflicts may not produce the same hook sequence. Public's git-hook patterns should test against multiple update flows, not just `git commit`.

## Sources Consulted

- `external/graphify/__main__.py:1-243` (full read)
- `external/graphify/watch.py:1-177` (full read)
- `external/graphify/hooks.py:1-164` (full read)
- Cross-reference with iter 3's `cache.py` reads and iter 1's `__main__.py` partial read

## Assessment

- **New information ratio:** 0.92 (11 of 12 findings net-new beyond iter 1's `__main__.py` summary; finding 1 builds on iter 1's hook mention with the verbatim payload)
- **Questions addressed:** Q8, Q9
- **Questions answered (fully):** Q8 (cache invalidation: 2-layer manifest + SHA256, with full table of scenarios), Q9 (PreToolUse hook: matcher, payload, fire conditions, install/uninstall, CLAUDE.md companion section)
- **Questions partially advanced:** none new — Q7 (multimodal) deliberately deferred to iter 6

## Reflection

- **What worked:** Reading `__main__.py` + `watch.py` + `hooks.py` together revealed the symmetric pattern: `_rebuild_code` is invoked from THREE places (watcher, post-commit, post-checkout) and is the only Claude-free rebuild primitive. Without reading all three I would have missed that the symmetry is intentional.
- **What did not work:** Initially I expected cache invalidation to be a single mechanism. It's two stacked layers (manifest + SHA256) with different failure modes. The interaction is documented in neither file's docstrings — only visible by reading both `detect.py:237-274` and `cache.py:21-38` together.
- **What I would do differently next iteration:** When investigating multimodal (iter 6), check the README + skill.md text BEFORE reading `ingest.py`, since skill.md already contains the per-file-type instructions and `ingest.py` is the URL-fetch front door, not the multimodal extraction core.

## Recommended Next Focus

Iteration 6 should resolve **Q7 (multimodal pipeline for PDFs and images)** by reading `external/graphify/ingest.py` for the URL-fetch / arXiv / PDF / image acquisition path, `external/graphify/security.py` for the URL validation and label sanitization that protects multimodal ingestion, and re-reading the relevant slices of `external/skills/graphify/skill.md` (already covered in iter 3 — specifically lines 198-209 for image instructions). The goal is to produce a definitive answer on: how PDFs become text via `pypdf`, how images flow into Claude vision, what "vision interpretation" actually means versus OCR, and whether Public could adapt the per-image-type prompt strategy. After iter 6, iter 7 should validate the 71.5x token-reduction claim (Q11) by reading `external/graphify/benchmark.py` and a worked example under `external/worked/`. Iter 8 onward becomes synthesis (Q12 — Adopt/Adapt/Reject for Public).
