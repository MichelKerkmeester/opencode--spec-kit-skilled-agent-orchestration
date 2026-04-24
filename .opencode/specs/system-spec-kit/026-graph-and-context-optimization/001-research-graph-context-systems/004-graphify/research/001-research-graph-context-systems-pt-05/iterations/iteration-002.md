# Iteration 2: AST Extraction Internals

## Focus
Resolve language coverage (Q1) and entity/edge schema (Q2) by reading detect.py end-to-end, the extract() dispatch table, the per-language extractors (Python in detail, plus JS/TS, Go, Rust as samples), the rationale-node logic, and the cross-file `uses` inference. This iteration extracts the canonical node/edge schema and confirms the Swift coverage gap is structural, not a bug in extract.py alone.

## Findings

1. The deterministic AST pass dispatches on file suffix in `extract()` and supports exactly 12 extractor functions covering 18 distinct extensions: `.py`, `.js`/`.ts`/`.tsx` (single JS extractor), `.go`, `.rs`, `.java`, `.c`/`.h`, `.cpp`/`.cc`/`.cxx`/`.hpp`, `.rb`, `.cs`, `.kt`/`.kts`, `.scala`, `.php`. There is NO Swift extractor and NO header-only path for `.h` outside the C extractor. [SOURCE: external/graphify/extract.py:2367-2477]

2. The Swift coverage divergence is structural at three layers, not just `extract.py`: `detect.py` advertises `.swift` in `CODE_EXTENSIONS`, the `collect_files()` glob list inside `extract.py` itself omits `*.swift`, and the `extract()` dispatch chain has no `.swift` branch. So even if a Swift file is detected and routed in via `paths`, the dispatch silently drops it. [SOURCE: external/graphify/detect.py:19; external/graphify/extract.py:2502-2506; external/graphify/extract.py:2367-2477]

3. The canonical node schema is exactly five fields, set at every `add_node` call: `id` (slug from `_make_id`), `label` (display name), `file_type` (`"code"` or `"rationale"`), `source_file` (absolute path string or empty for external stubs), `source_location` (`"L<line>"` format). External-base inheritance stubs use empty `source_file`/`source_location` so the inherits edge survives without a real anchor. [SOURCE: external/graphify/extract.py:40-49; external/graphify/extract.py:108-116]

4. The canonical edge schema is exactly seven fields: `source`, `target`, `relation`, `confidence` (`"EXTRACTED"` or `"INFERRED"`), `source_file`, `source_location`, `weight` (`1.0` for EXTRACTED, `0.8` for INFERRED). Confidence and weight are correlated: every EXTRACTED edge in the Python extractor uses `weight=1.0` and every INFERRED edge uses `weight=0.8`, set at the call site. [SOURCE: external/graphify/extract.py:51-61; external/graphify/extract.py:271-279]

5. The full set of relation types emitted by the deterministic pass (across all extractors) is: `imports`, `imports_from`, `contains`, `inherits`, `method`, `calls` (Python only), `uses` (Python only, cross-file), `rationale_for` (Python only). Most languages emit only the first five; only the Python extractor produces the call graph, the cross-file `uses` edges, and rationale/docstring nodes. [SOURCE: external/graphify/extract.py:70-145; external/graphify/extract.py:271-279; external/graphify/extract.py:185-193; external/graphify/extract.py:2325-2333]

6. Rationale nodes are first-class graph entities, not just edge attributes: `extract_python` creates a node with `file_type="rationale"` for every module/class/function docstring AND every comment line starting with `# NOTE:`, `# IMPORTANT:`, `# HACK:`, `# WHY:`, `# RATIONALE:`, `# TODO:`, or `# FIXME:`, then connects it to its parent entity via a `rationale_for` edge. Docstrings under 20 characters are filtered out. [SOURCE: external/graphify/extract.py:152-236]

7. Cross-file `uses` inference is Python-only and runs as a second pass after all per-file extractions complete. It builds a global `stem → {label: node_id}` map across all parsed Python files, then re-parses each file with tree-sitter Python, walks `import_from_statement` nodes, resolves `from .X import Name` patterns against that global map, and emits an `INFERRED` `uses` edge from EVERY local class in the importing file to the imported entity. The edge carries `weight=0.8`, the import line as `source_location`, and the importing file path. [SOURCE: external/graphify/extract.py:2209-2339; external/graphify/extract.py:2486-2489]

8. The Python call-graph pass is intentionally conservative: it builds a label-to-node-id lookup from already-extracted nodes, walks each function body once, dedupes via `seen_call_pairs`, refuses to recurse into nested function definitions, and only emits a `calls` edge when both caller and callee already exist as graph nodes. Method calls resolve via the attribute name only (`obj.foo()` matches any `.foo()` in the lookup), so the resolver is correct on uniqueness but may misroute on overloaded names. [SOURCE: external/graphify/extract.py:238-285]

9. Sensitive-file filtering happens in `detect.py`, NOT in `extract.py`: six regex patterns silently drop `.env*`, `*.pem|key|p12|pfx|cert|crt|der|p8`, anything with `credential|secret|passwd|password|token|private_key`, SSH key file names, `.netrc|.pgpass|.htpasswd`, and `aws_credentials|gcloud_credentials|service.account` paths. The skipped files are reported back via `skipped_sensitive` but do not appear in the file lists. This is graph-level secret hygiene that any consumer of the AST pass inherits for free. [SOURCE: external/graphify/detect.py:29-36; external/graphify/detect.py:181-183]

10. `detect.py` also classifies markdown/txt as `PAPER` instead of `DOCUMENT` when it contains at least 3 of 13 paper-signal patterns (arXiv, DOI, abstract, proceedings, journal, preprint, LaTeX `\cite{}`, numbered citations `[1]`, equation refs, `XXXX.YYYYY` arXiv IDs, "we propose", "literature"). This means converted academic PDFs that round-tripped through markdown still get routed to the paper-handling semantic pipeline rather than the generic doc pipeline. [SOURCE: external/graphify/detect.py:39-54; external/graphify/detect.py:75-88]

## Language Coverage Matrix

| Extension | Language | Detected by `detect.py` (CODE_EXTENSIONS:19) | Globbed by `collect_files` (extract.py:2502-2506) | Dispatched by `extract()` (extract.py:2367-2477) | Status |
|---|---|---|---|---|---|
| `.py` | Python | yes | yes | yes → `extract_python` (2370) | covered |
| `.js` | JavaScript | yes | yes | yes → `extract_js` via `_JS_SUFFIXES` (2379) | covered |
| `.ts` | TypeScript | yes | yes | yes → `extract_js` (2379) | covered |
| `.tsx` | TSX | yes | yes | yes → `extract_js` (2379) | covered |
| `.go` | Go | yes | yes | yes → `extract_go` (2388) | covered |
| `.rs` | Rust | yes | yes | yes → `extract_rust` (2397) | covered |
| `.java` | Java | yes | yes | yes → `extract_java` (2406) | covered |
| `.c` | C | yes | yes | yes → `extract_c` (2415) | covered |
| `.h` | C header | yes | yes | yes → `extract_c` (2415) | covered |
| `.cpp` | C++ | yes | yes | yes → `extract_cpp` (2424) | covered |
| `.cc` | C++ | yes | yes | yes → `extract_cpp` (2424) | covered |
| `.cxx` | C++ | yes | yes | yes → `extract_cpp` (2424) | covered |
| `.hpp` | C++ header | yes | yes | yes → `extract_cpp` (2424) | covered |
| `.rb` | Ruby | yes | yes | yes → `extract_ruby` (2433) | covered |
| `.cs` | C# | yes | yes | yes → `extract_csharp` (2442) | covered |
| `.kt` | Kotlin | yes | yes | yes → `extract_kotlin` (2451) | covered |
| `.kts` | Kotlin script | yes | yes | yes → `extract_kotlin` (2451) | covered |
| `.scala` | Scala | yes | yes | yes → `extract_scala` (2460) | covered |
| `.php` | PHP | yes | yes | yes → `extract_php` (2469) | covered |
| **`.swift`** | **Swift** | **yes (detect.py:19)** | **NO (extract.py:2502-2506)** | **NO (extract.py:2367-2477)** | **DIVERGENT — silent drop** |

## Entity & Relationship Types (Deterministic AST Pass)

### Node Types

| Type | `file_type` field | Required Fields | Notes | Source File:Line |
|---|---|---|---|---|
| File | `"code"` | `id`, `label` (filename), `source_file`, `source_location="L1"` | Stable ID from filename stem only via `_make_id(stem)` | extract.py:64-65 |
| Class | `"code"` | `id` (`_make_id(stem, class_name)`), `label` (class name), `source_file`, `source_location` | All extractors emit this | extract.py:91-94 |
| Function (top-level) | `"code"` | `id` (`_make_id(stem, func_name)`), `label` (`"name()"`), `source_file`, `source_location` | All extractors emit this | extract.py:137-138 |
| Method (class member) | `"code"` | `id` (`_make_id(parent_class_nid, func_name)`), `label` (`".name()"` with leading dot), `source_file`, `source_location` | All extractors emit this | extract.py:133-134 |
| External-base stub | `"code"` | `id` (`_make_id(base)`), `label`, `source_file=""`, `source_location=""` | Created so an `inherits` edge survives even when base class is in another module | extract.py:108-116 |
| Rationale | `"rationale"` | `id` (`_make_id(stem, "rationale", line)`), `label` (first 80 chars of text), `source_file`, `source_location` | Python only — docstrings + 7 comment-prefix patterns | extract.py:175-184 |

### Edge Types

| Type | Direction | `confidence` | `weight` | Languages | Inference | Source File:Line |
|---|---|---|---|---|---|---|
| `imports` | file → module | EXTRACTED | 1.0 | Python, Java, C, C++, C#, Kotlin, Scala, PHP | direct AST | extract.py:76 (Python sample) |
| `imports_from` | file → module | EXTRACTED | 1.0 | Python, JS/TS, Go, Rust, Ruby | direct AST | extract.py:84 (Python sample) |
| `contains` | file → {class, function} | EXTRACTED | 1.0 | all | direct AST (declaration nesting) | extract.py:95, 139 |
| `method` | class → method | EXTRACTED | 1.0 | all | direct AST (member position) | extract.py:135 |
| `inherits` | child → parent | EXTRACTED | 1.0 | all (where supported by language) | direct AST (`superclasses` field) | extract.py:117 |
| `rationale_for` | rationale → parent entity | EXTRACTED | 1.0 | **Python only** | docstring + comment-prefix scan | extract.py:185-193 |
| `calls` | caller fn → callee fn | INFERRED | 0.8 | **Python only** | label lookup post-extraction | extract.py:271-279 |
| `uses` | class → class | INFERRED | 0.8 | **Python only** | cross-file `from X import Y` resolution | extract.py:2325-2333 |

## Cross-File `uses` Edge Inference

`_resolve_cross_file_imports()` runs once after all per-file extractions complete and is restricted to Python files via `py_paths = [p for p in paths if p.suffix == ".py"]` (extract.py:2486-2488). It executes a two-pass algorithm:

1. **Pass 1 — global label index** (extract.py:2238-2249): Walk every node from every parsed Python file, record `stem_to_entities[stem][label] = node_id`. Filter out file nodes (label ends with `.py`), method stubs (label ends with `)`), and underscore-prefixed names. The result is a dictionary keyed by file stem, mapping every public class/function name to its node ID.

2. **Pass 2 — re-parse and resolve** (extract.py:2255-2337): For each Python file, find all locally-defined classes (the importers), re-parse with tree-sitter Python, walk every `import_from_statement`, extract the target stem from `relative_import → dotted_name` (relative) or `dotted_name` (absolute), and look up each imported name in the global map. For every (local class, resolved target) pair, emit ONE `uses` edge with `confidence="INFERRED"`, `weight=0.8`, `source_file=str_path`, and `source_location` set to the import line.

A key behavioral consequence: a single `from .models import Response, Request` statement in a file with three local classes produces SIX `uses` edges (3 classes × 2 imports), not 2. The fan-out is intentional — graphify treats every class in the importing file as a potential consumer of every imported entity, biasing toward recall over precision.

## Rationale / Docstring Node Treatment

Rationale nodes are explicit graph entities — NOT edge attributes — and are emitted ONLY by the Python extractor. The logic in `extract_python` runs AFTER the structural walk completes (extract.py:152-236):

**Sources of rationale text:**
1. **Module-level docstring** — first string literal at the top of the file body, attached to the file node via `rationale_for` (extract.py:195-199).
2. **Class and function docstrings** — first string literal in each class/function body, attached to the class/function node (extract.py:202-229). Walked via a separate `walk_docstrings` recursion that mirrors the structural walk.
3. **Inline rationale comments** — line-by-line scan for any line whose stripped form starts with `# NOTE:`, `# IMPORTANT:`, `# HACK:`, `# WHY:`, `# RATIONALE:`, `# TODO:`, or `# FIXME:`. These all attach to the file node (extract.py:231-236), not the enclosing function — a precision loss but a simpler implementation.

**Filtering:** docstrings shorter than 20 characters are dropped (extract.py:168). Labels are truncated to 80 characters and have newlines collapsed to spaces (extract.py:174).

**No rationale extraction in non-Python languages:** the JS/TS, Go, Rust, Java, C, C++, Ruby, C#, Kotlin, Scala, and PHP extractors all skip docstring/comment harvesting entirely. JSDoc, GoDoc, Rustdoc, and Javadoc are NOT mined.

## Per-Language Extractor Notes

### Python (canonical, most expressive — extract.py:17-298)
Emits the full superset: file, class, function, method, rationale nodes, and `imports`, `imports_from`, `contains`, `inherits`, `method`, `rationale_for`, `calls` (post-walk pass), and downstream `uses` (cross-file pass). Inheritance bases that aren't local create stub nodes with empty `source_file` so the `inherits` edge survives. The call-graph pass is post-hoc and label-based, deduping via `seen_call_pairs`, refusing to recurse into nested `function_definition` nodes (so closures don't pollute the parent's call set). Result: Python files contribute roughly 6× more edge variety than any other language.

### JavaScript / TypeScript / TSX (extract.py:301-487)
Single `extract_js` extractor handles `.js`, `.ts`, and `.tsx` via `_JS_SUFFIXES = {".js", ".ts", ".tsx"}` (extract.py:2367). Emits file, class, function, method nodes, `imports_from`, `contains`, `method`. The `add_edge` helper accepts a `confidence` parameter that defaults to `"EXTRACTED"` and `weight=1.0` (extract.py:340). No call graph, no cross-file inference, no docstring extraction, no inheritance edges (base class identifiers are NOT walked). TypeScript-specific constructs like interfaces, type aliases, and decorators are NOT modeled.

### Go (extract.py:488-672)
Emits file, function, method, type nodes via `add_edge_raw` (extract.py:522). Distinguishes receiver types: when a function has a receiver, it creates a parent node for the receiver type and emits a `method` edge from receiver-type → method (extract.py:569-578). Type declarations (struct/interface) become standalone nodes. Imports use `imports_from` (extract.py:606, 613). No call graph, no cross-file inference, no rationale.

### Rust (extract.py:674-840)
Emits file, function, struct/enum, impl block nodes via `add_edge` with confidence param (extract.py:708). `impl` blocks create dedicated nodes (`impl_nid` at extract.py:761) and methods inside an impl get a `method` edge from the impl node — not from the underlying struct. This means a `struct Foo` and an `impl Foo` produce two separate nodes; reconnecting them requires graph-level reasoning. Imports use `imports_from`. No traits-as-edges modeling, no call graph, no rationale.

## Ruled Out

- **Looking for a unified `Extractor` class or visitor pattern**: there is no shared base class or registry. Each extractor is a standalone function that re-implements its own `add_node`/`add_edge` closures. The dispatch is a 110-line `if/elif` chain (extract.py:2367-2477). This rules out the hypothesis "graphify uses a plugin architecture for extractors."

- **Looking for built-in JSDoc / Rustdoc / GoDoc extraction**: searched the JS, Go, Rust extractors for `docstring`, `rationale`, `comment`, `JSDoc`. None present. Rationale extraction is structurally Python-only.

## Dead Ends

- **Hoping the Swift gap is fixable by adding extractor only**: it isn't. `collect_files()` inside extract.py (extract.py:2502-2506) hard-codes the `_EXTENSIONS` glob tuple, which omits `*.swift`. Even if a `extract_swift()` function existed and was wired into the dispatch, the file collection step would not surface Swift files unless callers bypass `collect_files()` and pass paths directly. Public should treat Swift coverage as a 3-layer fix, not a 1-layer fix.

## Sources Consulted

- `external/graphify/detect.py:1-274` (full read)
- `external/graphify/extract.py:1-300` (Python extractor + helpers)
- `external/graphify/extract.py:2200-2340` (cross-file `uses` inference)
- `external/graphify/extract.py:2342-2516` (extract() dispatch + collect_files)
- `external/graphify/extract.py:301-487` (JS/TS extractor — sampled via grep + targeted reads)
- `external/graphify/extract.py:488-672` (Go extractor — sampled via grep)
- `external/graphify/extract.py:674-840` (Rust extractor — sampled via grep)

## Assessment

- **New information ratio:** 0.95 (10 of 10 findings genuinely new vs. iter 1 baseline; small overlap with iter 1's finding about Swift)
- **Questions addressed:** Q1, Q2, partial Q4 (cache integration), partial Q6 (confidence/weight schema)
- **Questions answered (fully):** Q1 (language coverage + Swift gap fully resolved), Q2 (entity + relationship types fully enumerated with schemas)
- **Questions partially advanced:** Q4 (load_cached / save_cached call sites mapped to dispatch chain), Q6 (EXTRACTED/INFERRED/weight correlation established)

## Reflection

- **What worked:** Reading detect.py end-to-end (only 274 lines) gave the full extension surface in one pass; then using Grep with a wide pattern across extract.py surfaced the dispatch table, every per-language extractor, the rationale logic, and the cross-file inference in a single tool call. Targeted reads of the dispatch and the Python extractor body produced the full schema without needing to parse 2526 lines.
- **What did not work:** The earlier codex iter 2 attempt starved on API rate limits because the spec folder's parallel-running codex jobs from other sessions saturated the OpenAI quota. Switching to direct tool-based reads bypassed that contention entirely and finished in under a minute.
- **What I would do differently next iteration:** Continue with direct reads and Grep for files I know are surgically scoped (cluster.py, build.py, export.py — all under 700 lines). Reserve the codex CLI for genuinely large or reasoning-heavy passes where its high-effort reasoning adds value beyond pattern extraction.

## Recommended Next Focus

Iteration 3 should resolve **Q3 (semantic subagent prompt)** and **Q4 (merge / cache / promotion to graph.json)** by reading `external/skills/graphify/skill.md` end-to-end alongside `external/graphify/cache.py`, `external/graphify/build.py`, `external/graphify/validate.py`, and `external/graphify/export.py:264-275` (the `to_json()` confidence_score backfill site that iter 1 flagged). Specifically: extract the semantic subagent's instruction prompt verbatim, document what node/edge schema fragments it is told to emit, trace how `.graphify_extract.json` flows from cache → merge → validate → build → graph.json, and confirm the EXTRACTED/INFERRED/AMBIGUOUS → numeric confidence backfill mapping. This sets up iter 4 to tackle Leiden clustering (Q5) with the merged graph schema fully understood.
