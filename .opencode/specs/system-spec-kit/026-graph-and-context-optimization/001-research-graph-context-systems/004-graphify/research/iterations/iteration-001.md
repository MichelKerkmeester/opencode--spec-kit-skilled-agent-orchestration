# Iteration 1: Pipeline Architecture Lock

## Focus
This iteration locked the graphify pipeline at the architecture level before drilling into extractor internals. I read the top-level architecture and README, verified the Python CLI and Claude hook entry points, inventoried the implementation files under `external/graphify/` and `external/skills/graphify/`, and mapped the documented stages to concrete modules.

## Findings
1. The documented canonical pipeline is a seven-stage chain, `detect() → extract() → build_graph() → cluster() → analyze() → report() → export()`, with plain Python dicts and NetworkX graphs as the handoff format and `graphify-out/` as the only declared side-effect boundary. [SOURCE: external/ARCHITECTURE.md:5-11]
2. In practice, the `extract` stage is split into parallel structural and semantic branches: AST extraction runs alongside semantic subagents, then both are merged into `.graphify_extract.json` before graph assembly. [SOURCE: external/skills/graphify/skill.md:94-100; external/skills/graphify/skill.md:287-317]
3. The actual AST dispatch supports Python, JS, TS, TSX, Go, Rust, Java, C, C headers, C++, C++ headers, Ruby, C#, Kotlin, KTS, Scala, and PHP; however, `detect.py` and `watch.py` advertise `.swift`, while `extract()` and `collect_files()` do not dispatch or glob Swift files. [SOURCE: external/graphify/detect.py:19-22; external/graphify/watch.py:8-18; external/graphify/extract.py:2367-2477; external/graphify/extract.py:2499-2513]
4. AST and semantic outputs are merged in two layers before `graph.json` is written: cached and new semantic fragments are combined first, then AST nodes win on ID collisions when AST and semantic outputs are merged, and `build_from_json()` validates and loads that merged extraction into a NetworkX graph before `to_json()` injects community IDs and default `confidence_score` values into the final JSON. [SOURCE: external/skills/graphify/skill.md:257-317; external/graphify/build.py:8-30; external/graphify/export.py:264-275]
5. The PreToolUse hook is installed by `graphify claude install`, stored in project-local `.claude/settings.json`, matches `Glob|Grep`, and injects the message telling Claude to read `graphify-out/GRAPH_REPORT.md` before searching raw files when `graphify-out/graph.json` exists. [SOURCE: external/graphify/__main__.py:9-21; external/graphify/__main__.py:84-131]
6. The Python CLI entry file is narrower than the README and skill surface: `__main__.py` exposes `install`, `benchmark`, `hook [install|uninstall|status]`, and `claude [install|uninstall]`, while `/graphify`, `add`, `query`, `path`, `explain`, `--watch`, and `--mcp` are documented in the skill layer rather than implemented as top-level subcommands here. [SOURCE: external/graphify/__main__.py:182-238; external/skills/graphify/skill.md:13-35]
7. `ARCHITECTURE.md` is partially stale relative to the implementation: it assigns `collect_files(root)` to `detect.py` and names single entry functions `analyze()`, `render_report()`, and `start_server()`, but current code uses `extract.collect_files()`, several analysis entrypoints, `report.generate()`, and `serve.serve()`. [SOURCE: external/ARCHITECTURE.md:15-30; external/graphify/extract.py:2499-2526; external/graphify/analyze.py:35-61; external/graphify/analyze.py:326-331; external/graphify/report.py:7-18; external/graphify/serve.py:103-117]
8. Incremental/runtime sidecars are code-first: `watch.py` reruns extract → build → cluster → report → JSON automatically for code-only changes, while non-code changes only write `graphify-out/needs_update` and defer semantic refresh to `/graphify --update`; git hooks reuse the same `_rebuild_code()` path on commit and branch switch. [SOURCE: external/graphify/watch.py:21-24; external/graphify/watch.py:48-80; external/graphify/watch.py:87-112; external/graphify/hooks.py:8-44; external/graphify/hooks.py:48-77]

## Pipeline Stages (canonical, end-to-end)
| Stage | Purpose | Primary File(s) | Entry Function/CLI |
|-------|---------|-----------------|--------------------|
| 1. Detect corpus | Discover supported files, classify by type, count corpus size, and surface warnings/incremental diffs | external/graphify/detect.py | `detect(root)` / `detect_incremental(root)` |
| 2. Extract entities and relationships | Run deterministic AST extraction for code, semantic extraction for non-code, then merge both into one extraction payload | external/graphify/extract.py; external/graphify/cache.py; external/skills/graphify/skill.md | `extract(paths)` / `/graphify <path>` Step 3 |
| 3. Build graph | Validate merged extraction JSON and assemble a NetworkX graph while preserving original edge direction metadata | external/graphify/build.py; external/graphify/validate.py | `build_from_json(extraction)` |
| 4. Cluster communities | Partition the graph with Leiden, split oversized communities, and compute cohesion | external/graphify/cluster.py | `cluster(G)` |
| 5. Analyze graph | Rank god nodes, surprising connections, and suggested questions | external/graphify/analyze.py | `god_nodes()` + `surprising_connections()` + `suggest_questions()` |
| 6. Report | Render the human-readable audit trail as `GRAPH_REPORT.md` | external/graphify/report.py | `generate(...)` |
| 7. Export outputs | Serialize the graph and optional derived views such as JSON, HTML, SVG, and wiki artifacts | external/graphify/export.py; external/graphify/wiki.py | `to_json()` / `to_html()` / `to_svg()` / `to_wiki()` |

## File Inventory
### external/graphify/
- `__init__.py` — lazy-import facade exposing the main extract/build/cluster/analyze/report/export/wiki entrypoints.
- `__main__.py` — CLI entry module for install, Claude hook setup, git hook management, and benchmarking.
- `analyze.py` — graph analysis utilities for god nodes, surprising connections, suggested questions, and graph diffs.
- `benchmark.py` — token-reduction benchmark comparing graph queries against naive full-corpus reading.
- `build.py` — assembles validated node/edge extraction dicts into a NetworkX graph.
- `cache.py` — per-file extraction cache plus semantic cache load/save helpers.
- `cluster.py` — Leiden community detection, oversized-community splitting, and cohesion scoring.
- `detect.py` — file discovery, type classification, corpus health checks, and incremental manifest support.
- `export.py` — exporters for graph JSON, HTML, SVG, GraphML, Obsidian, and Neo4j/Cypher outputs.
- `extract.py` — deterministic tree-sitter extraction plus cross-file import resolution across supported code languages.
- `hooks.py` — install/uninstall/status helpers for git post-commit and post-checkout auto-rebuild hooks.
- `ingest.py` — fetches URLs and saves graphify-ready local files for tweets, webpages, arXiv pages, PDFs, and images.
- `manifest.py` — backward-compatible re-export of manifest helpers from `detect.py`.
- `report.py` — generates `GRAPH_REPORT.md` as the human-readable audit output.
- `security.py` — URL validation, safe fetching, path guards, and label sanitization helpers.
- `serve.py` — MCP stdio server exposing graph query tools to Claude and other agents.
- `validate.py` — schema validator for extraction JSON before graph assembly.
- `watch.py` — watches a folder and auto-updates code-only graphs or flags non-code changes for later semantic refresh.
- `wiki.py` — generates an agent-crawlable wiki with community and god-node markdown articles.

### external/skills/graphify/
- `skill.md` — skill orchestration spec for `/graphify`, including detect, parallel AST/semantic extraction, merge, build, analyze, and export steps.

## Ruled Out
N/A for iter 1

## Dead Ends
N/A for iter 1

## Sources Consulted
- external/ARCHITECTURE.md
- external/README.md
- external/graphify/__init__.py
- external/graphify/__main__.py
- external/graphify/analyze.py
- external/graphify/benchmark.py
- external/graphify/build.py
- external/graphify/cache.py
- external/graphify/cluster.py
- external/graphify/detect.py
- external/graphify/export.py
- external/graphify/extract.py
- external/graphify/hooks.py
- external/graphify/ingest.py
- external/graphify/manifest.py
- external/graphify/report.py
- external/graphify/security.py
- external/graphify/serve.py
- external/graphify/skill.md
- external/graphify/validate.py
- external/graphify/watch.py
- external/graphify/wiki.py
- external/skills/graphify/skill.md

## Assessment
- New information ratio: 1.0 (first iteration, all baseline information is new)
- Questions addressed: Q1, Q4, Q9
- Questions answered (fully): none — iter 1 establishes baseline
- Questions partially advanced: Q1, Q4, Q9

## Reflection
- What worked: Reading the architecture docs first, then checking the skill orchestration and concrete module entrypoints, made it easy to separate the canonical seven-stage pipeline from the larger set of operational sidecars.
- What did not work: Treating `ARCHITECTURE.md` as fully current would have produced an inaccurate map because several function names and one stage/file assignment have drifted.
- What I would do differently next iteration: Start directly in `extract.py` with the dispatch block and each language extractor’s shared patterns, then trace how `detect.py` extension lists line up or fail to line up with actual extractor coverage.

## Recommended Next Focus
Iteration 2 should go deep on the AST extraction internals in `external/graphify/extract.py` and the coverage boundary in `external/graphify/detect.py`. The key goals are to enumerate the real language-by-language extractor implementations, confirm exactly which syntax features each one extracts, trace how cross-file import resolution works after per-file AST passes, and explain where rationale/docstring extraction is embedded into the AST path. That should also resolve the current extension mismatch around Swift and move Q1 from an initial scan to a complete implementation-backed answer.