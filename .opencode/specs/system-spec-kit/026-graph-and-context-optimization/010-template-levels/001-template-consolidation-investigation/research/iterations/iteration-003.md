# Focus

Deterministic output experiment, latency benchmark, and compatibility cache design for replacing checked-in `templates/level_N/` outputs with generation from `core/` and `addendum/`.

# Actions Taken

1. Read `scripts/templates/compose.sh` end-to-end and traced the exact composition rules.
2. Built an isolated `/tmp/template-experiment/system-spec-kit/` layout containing only `compose.sh`, `templates/core/`, and `templates/addendum/`, then generated all level outputs into that temp tree.
3. Compared generated temp outputs against checked-in `templates/level_1`, `level_2`, `level_3`, and `level_3+`.
4. Timed all-level generation, per-level generation, and checked-in `compose.sh --verify`.
5. Traced `create.sh` and `template-utils.sh::copy_template` hot paths that would need to resolve a generated compatibility cache.

# Findings

## Composition Algorithm

`compose.sh` is the current source-to-render transform, not just a file copier.

It resolves `TEMPLATES_DIR` relative to its own script path and hardcodes:

- sources: `templates/core`, `templates/addendum/level2-verify`, `templates/addendum/level3-arch`, `templates/addendum/level3-plus-govern`
- outputs: `templates/level_1`, `templates/level_2`, `templates/level_3`, `templates/level_3+`

Per-file behavior:

| File | Behavior |
| --- | --- |
| `spec.md` | Level 1 copies core; Level 2 inserts L2 content before open questions and renumbers; Level 3 and 3+ dynamically assemble frontmatter, guidance, prefix, core body, suffix, open questions, and related-doc sections. |
| `plan.md` | Level 1 copies core; higher levels append L2, L3, and L3+ addenda before synthetic closing comments. |
| `tasks.md` | Copies `tasks-core.md` with `SPECKIT_LEVEL` rewritten. |
| `implementation-summary.md` | Copies `impl-summary-core.md` with `SPECKIT_LEVEL` rewritten. |
| `checklist.md` | Level 2 copies L2 checklist; Level 3 and 3+ append extended checklist content and rewrite level marker. |
| `decision-record.md` | Level 3 and 3+ copy `addendum/level3-arch/decision-record.md`. |

Normalization steps:

- `update_level_marker` rewrites `<!-- SPECKIT_LEVEL: CORE -->` to the target level.
- `update_metadata_level` rewrites the metadata table placeholder to the target level.
- `strip_frontmatter` removes leading YAML blocks from addendum fragments.
- `strip_addendum_markers` removes `SPECKIT_ADDENDUM` and insertion marker comments.
- `normalize_template_title_suffix` rewrites frontmatter titles to `[template:level_N/file.md]`, but only when the output path is under the script-resolved `TEMPLATES_DIR`.

That last condition means a naive `--out-dir /tmp/cache` option would not be byte-identical unless it preserves a `.../templates/level_N/file.md` relative layout or changes suffix normalization deliberately.

## Deterministic Experiment

The temp experiment generated the expected 21 non-README rendered markdown files:

- Level 1: 4 files
- Level 2: 5 files
- Level 3: 6 files
- Level 3+: 6 files

It did not generate the four `README.md` files currently present in the checked-in level directories. So raw deletion would remove 25 checked-in files, but the generator only reproduces 21 runtime docs today.

`compose.sh --verify` against the checked-in templates failed with drift in all 21 rendered non-README files. This is not safe to treat as an already-equivalent cache.

Observed drift:

| Gap | Evidence |
| --- | --- |
| Missing `_memory.continuity` frontmatter | Generated files omit the continuity block present in checked-in rendered templates. |
| Missing level README files | Temp generation produced 21 `.md` files; checked-in level dirs contain 25 `.md` files including four READMEs. |
| Anchor-count drift | Checked-in non-README files contain more anchors than generated files: L1 `33 vs 26`, L2 `49 vs 40`, L3 `62 vs 52`, L3+ `69 vs 55`. |
| Decision-record source drift | Generated Level 3 `decision-record.md` produced `description: "not \"A decision was required...` from the addendum source, while checked-in Level 3 has a normal description. |
| All non-README files differ | `compose.sh --verify` reported drift for 21 files. |

Hash determinism inside the generated cache was good: running the temp composer twice and hashing all generated `level_N/*.md` files produced identical hashes (`determinism_rc=0`). So the current problem is not nondeterminism; it is mismatch between source-generated output and the committed rendered contract.

## Latency Benchmark

Measured on the current checkout, writing only under `/tmp/template-experiment` except for read-only `--verify`:

| Operation | real | user | sys |
| --- | ---: | ---: | ---: |
| Temp compose all levels | 0.47s | 0.16s | 0.31s |
| Temp compose Level 1 | 0.07s | 0.02s | 0.04s |
| Temp compose Level 2 | 0.10s | 0.03s | 0.07s |
| Temp compose Level 3 | 0.14s | 0.05s | 0.10s |
| Temp compose Level 3+ | 0.15s | 0.05s | 0.10s |
| Checked-in `compose.sh --verify` | 0.37s | 0.14s | 0.23s |

This is close to, but below, a 500ms all-level budget on this machine. It is still too expensive to run blindly on every `create.sh` invocation if post-create validation, description generation, and git work also run. A compatibility cache with hash-based reuse is the right latency shape: cold generation can be ~0.5s, hot resolution should be path lookup plus hash check.

## Create Hot Paths

The exact hot paths to change are:

| File | Lines | Current behavior | Replacement shape |
| --- | ---: | --- | --- |
| `scripts/lib/template-utils.sh` | 34-43 | `get_level_templates_dir` returns physical `templates/level_N`. | Return an ensured cache dir, or keep this function path-only and add a separate `ensure_level_templates_dir` that can generate/cache. |
| `scripts/lib/template-utils.sh` | 72-83 | `copy_template` resolves `level_templates_dir/file`, falls back to base, then `cp` or `touch`. | Replace fallback-to-empty behavior with generator-aware resolution. Missing generated canonical docs should be hard errors, not silent empty files. |
| `scripts/spec/create.sh` | 542-550 | Subfolder mode resolves `LEVEL_TEMPLATES_DIR`, loops `*.md`, and calls `copy_template`. | Call cache resolver before the loop; loop over generated level dir. |
| `scripts/spec/create.sh` | 962-980 | Phase child creation resolves Level 1 dir and copies every Level 1 template. | Resolve/generate Level 1 compatibility cache before phase child loop. |
| `scripts/spec/create.sh` | 1150-1163 | Normal mode resolves `LEVEL_TEMPLATES_DIR`, validates existence, and falls back to base templates if missing. | Replace existence fallback with cache generation; only fallback for cross-cutting templates that intentionally live at template root. |
| `scripts/spec/create.sh` | 1175-1180 | Normal mode loops over level dir `*.md` and copies via `copy_template`. | Same loop can remain if `LEVEL_TEMPLATES_DIR` points at a cache with the same filenames. |

The least disruptive change is a compatibility cache that preserves the same directory contract:

```text
templates resolver
  -> source hash = hash(compose.sh + wrap-all-templates + core/** + addendum/**)
  -> cache root = $SPECKIT_TEMPLATE_CACHE_DIR or repo-local generated cache
  -> ensure cache/$hash/level_1 ... level_3+
  -> return cache/$hash/level_N
```

The current `copy_template` fallback should not survive unchanged. It hides generator failures by creating empty files, which would turn a bad cache into malformed specs.

## Compatibility Cache Design

Recommended cache behavior:

- Compute a source hash over `compose.sh`, any anchor wrapper used in generation, `templates/core/**`, and `templates/addendum/**`.
- Generate all four levels into a temp cache directory, then atomically promote it to `cache/<hash>/`.
- Preserve the current `level_N/file.md` relative paths inside the cache so frontmatter title suffixes and downstream path expectations remain stable.
- Expose a resolver function consumed by `create.sh`, `template-structure.js`, `check-template-staleness.sh`, and tests.
- Keep checked-in `templates/level_N/` until the generated cache is byte-identical, validator-compatible, and wired into all consumers.
- Keep old `SPECKIT_TEMPLATE_SOURCE` values valid indefinitely. Existing spec folders use component markers such as `spec-core | v2.2` and `spec-core + level2-verify + level3-arch | v2.2`, not physical `level_N` paths.

Cache invalidation should use hash determinism, not mtimes. Mtime checks are easier but fragile across git checkouts, generated files, and CI.

## Generator Design Score

Rubric: 1 = weak fit, 5 = strong fit.

| Option | Complexity | Performance | Determinism | Maintainability | CI integration | Total | Notes |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Extend `compose.sh` | 4 | 4 | 4 | 3 | 4 | 19 | Best near-term path because it already encodes the transform. Needs `--out-dir` or cache root, byte-equivalence fixes, and stricter missing-file behavior. |
| TypeScript rewrite | 2 | 5 | 3 | 4 | 5 | 19 | Better long-term integration with existing TS validators, but high migration risk because shell semantics and blank-line behavior must be cloned exactly. |
| JSON-driven manifest generator | 3 | 4 | 2 | 4 | 4 | 17 | Good for required-file metadata, weak for current bespoke markdown transforms unless it still delegates to a renderer with golden tests. |

Tie-breaker: choose "extend `compose.sh` first" despite the equal score with a TS rewrite. The deciding factor is migration risk, not raw score. This system already has drift between source and rendered output; rewriting the generator before achieving byte equivalence adds a second moving target.

# Questions Answered

Q3: The near-term generator should extend `compose.sh` and add a compatibility-cache resolver. A TS rewrite can be a later refactor after byte-equivalence tests exist. JSON manifests should describe level/file contracts and validator expectations, but should not replace the renderer in the first consolidation.

Q6: Generated output is deterministic against itself, but not byte-identical to checked-in `level_N/` outputs. Current deletion would break hash expectations, anchor counts, and generated frontmatter. Hash determinism should be based on source hashes plus golden byte comparisons for all generated docs.

Q7: Cold all-level generation measured at 0.47s; per-level generation measured at 0.07s to 0.15s. A <500ms cold budget is plausible but narrow. Hot-path creation should use a cache, not compose every time.

# Questions Remaining

- Q1: Full deletion remains blocked until generated outputs become byte-identical or consumers are intentionally updated to accept a new rendered contract.
- Q2: Minimum source set still needs classification of generated README files and currently drifted source fragments.
- Q4: Validator migration needs a concrete resolver shared by `template-structure.js` and staleness checks.
- Q5: Backward compatibility plan needs an explicit policy for old generated templates that contain `_memory.continuity` and old source markers.
- Q8: Risk inventory should include generator drift, silent empty files, cache invalidation bugs, and path-contract breakage.
- Q9: Recommendation is trending PARTIAL, not CONSOLIDATE.
- Q10: Refactor plan should start with byte-equivalence repair, then cache resolver, then consumer migration.

# Next Focus

Repair-path design: identify the minimum source/addendum changes required for generated output to match checked-in `level_N` bytes, then design the resolver API shared by shell and JS consumers without deleting the level directories yet.
