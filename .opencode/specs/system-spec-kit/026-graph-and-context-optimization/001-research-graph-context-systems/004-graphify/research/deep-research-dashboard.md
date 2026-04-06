---
title: Deep Research Dashboard
description: Auto-generated reducer view over the research packet.
---

# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active research packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Topic: Research the external repository at .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/004-graphify/external and identify concrete improvements for Code_Environment/Public, especially around two-pass codebase knowledge extraction (AST + LLM), Leiden community detection, EXTRACTED/INFERRED/AMBIGUOUS evidence tagging, multimodal artifact processing, and PreToolUse hook patterns for steering Claude toward graph-based context.
- Started: 2026-04-06T10:00:00Z
- Status: COMPLETE
- Iteration: 10 of 10
- Session ID: ds-2026-04-06-graphify-001
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Pipeline architecture lock — read ARCHITECTURE.md, README.md, __main__.py, map full file inventory | architecture | 1.00 | 8 | complete |
| 2 | AST extraction internals — read detect.py end-to-end, dispatch table in extract.py, Python extractor body, cross-file uses inference, sample JS/Go/Rust | ast-extraction | 0.95 | 10 | complete |
| 3 | Semantic subagent prompt + merge/cache/promotion to graph.json — read skill.md, cache.py, build.py, validate.py, export.py to_json | semantic-merge | 0.92 | 12 | complete |
| 4 | Leiden clustering + god nodes + surprising connections + suggested questions + report structure — read cluster.py, analyze.py, report.py end-to-end | clustering-analysis | 0.95 | 13 | complete |
| 5 | PreToolUse hook + cache invalidation 2-layer stack + rebuild orchestration — read __main__.py, watch.py, hooks.py end-to-end | hooks-cache | 0.92 | 12 | complete |
| 6 | Multimodal pipeline (PDFs, images, tweets, arxiv) and security layer — read ingest.py, security.py, re-cite detect.py PDF logic and skill.md image instructions | multimodal | 0.92 | 11 | complete |
| 7 | 71.5x token reduction claim credibility — read benchmark.py + worked karpathy-repos README/GRAPH_REPORT/review.md, validate math, identify load-bearing assumptions | benchmark-credibility | 0.92 | 12 | complete |
| 8 | Export + Wiki + MCP Serve Surface — read export.py full (954 lines), wiki.py full (214 lines), serve.py full (322 lines), cross-check mixed-corpus GRAPH_REPORT.md | export-serve | 0.95 | 10 | complete |
| 9 | Build orchestration + manifest + mixed-corpus cross-validation — manifest.py (4 lines, re-exports detect.py), build.py full (42 lines), skill.md merge logic 236-400 + 588-705, detect.py incremental 216-274, mixed-corpus + karpathy-repos worked corpora | build-orchestration | 0.92 | 10 | complete |
| 10 | Per-language extractor inventory + final Q12 Adopt/Adapt/Reject grounding — extract.py per-language bodies (JS/TS, Go, Rust, Java, C/C++, C#, Kotlin, Scala, PHP, Ruby), validate.py schema constraints, dispatch table 2367-2505 | per-language-final-synthesis | 0.90 | 12 | complete |

- iterationsCompleted: 10
- keyFindings: 103
- openQuestions: 12
- resolvedQuestions: 0

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 0/12
- [ ] Q1: Which languages and extensions are actually supported by the AST pass in `external/graphify/extract.py` and `external/graphify/detect.py`, and where does runtime coverage diverge between detection and extraction?
- [ ] Q2: What exact entities and relationship types does the deterministic pass emit (rationale nodes, method stubs, imports, calls, inheritance, cross-file `uses` edges)?
- [ ] Q3: How does the semantic subagent prompt in `external/skills/graphify/skill.md` define extraction behavior for docs, papers, images, semantic similarity, and hyperedges?
- [ ] Q4: How are AST and semantic outputs merged, deduplicated, cached, and promoted into final `graphify-out/graph.json`?
- [ ] Q5: What are the actual Leiden parameter choices in `external/graphify/cluster.py`, and what is the rationale behind community splitting at 25% of graph size with min split size 10?
- [ ] Q6: How does graphify represent evidence and confidence (EXTRACTED/INFERRED/AMBIGUOUS semantics, default scores, downstream JSON and `GRAPH_REPORT.md` reporting)?
- [ ] Q7: How does the multimodal pipeline work in practice for PDFs and images (`pypdf` usage, image handling, Claude vision vs OCR)?
- [ ] Q8: What is the cache invalidation strategy across `external/graphify/cache.py` and `external/graphify/detect.py`, and how much of the system can rerun without invoking Claude?
- [ ] Q9: How does the PreToolUse hook in `external/graphify/__main__.py` fire, what message does it inject, and how might a similar hook reshape Public's search behavior?
- [ ] Q10: How does `GRAPH_REPORT.md` identify god nodes, surprising connections, ambiguous edges, low-cohesion communities, and suggested questions, and which patterns are reusable in Public?
- [ ] Q11: How credible is the 71.5x token-reduction claim when cross-checked against `external/worked/karpathy-repos/`, README wording, and benchmark expectations?
- [ ] Q12: Which graphify ideas should be Adopted directly, Adapted into existing MCP surfaces, or Rejected because Public already covers them with Code Graph MCP or CocoIndex?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- Last 3 ratios: 0.95 -> 0.92 -> 0.90
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.90
- coverageBySources: {"code":70,"other":25}

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- **Hoping the Swift gap is fixable by adding extractor only**: it isn't. `collect_files()` inside extract.py (extract.py:2502-2506) hard-codes the `_EXTENSIONS` glob tuple, which omits `*.swift`. Even if a `extract_swift()` function existed and was wired into the dispatch, the file collection step would not surface Swift files unless callers bypass `collect_files()` and pass paths directly. Public should treat Swift coverage as a 3-layer fix, not a 1-layer fix. (iteration 2)
- **Looking for a unified `Extractor` class or visitor pattern**: there is no shared base class or registry. Each extractor is a standalone function that re-implements its own `add_node`/`add_edge` closures. The dispatch is a 110-line `if/elif` chain (extract.py:2367-2477). This rules out the hypothesis "graphify uses a plugin architecture for extractors." (iteration 2)
- **Looking for built-in JSDoc / Rustdoc / GoDoc extraction**: searched the JS, Go, Rust extractors for `docstring`, `rationale`, `comment`, `JSDoc`. None present. Rationale extraction is structurally Python-only. (iteration 2)
- **Hoping cache deduplication is content-aware across renames**: it is at the file-rename level (since SHA256 only sees content, not paths) but NOT at the file-edit-revert level (any change to a file invalidates the cache, even if you revert immediately afterward, because the post-revert hash matches the pre-edit hash but the cache file may have already been overwritten by an intermediate save). Public should consider this when evaluating cache stability. (iteration 3)
- **Looking for a Python class named `SemanticExtractor` or `SubagentPrompt`**: not found. The prompt is in `skill.md`, not Python. This means graphify cannot version the prompt as code, cannot unit-test it, and cannot expose it via the MCP `serve` interface. Public would treat this as a structural weakness if adopting the pattern. (iteration 3)
- **Looking for a unified merge function in graphify Python**: the merge logic is implemented as inline shell-invoked Python in `skill.md:259-317`. The graphify package does NOT export a `merge_extraction(ast, semantic)` function. The "build" function in `build.py:34-42` is for combining MULTIPLE extractions (e.g., parallel extract() runs), not for merging AST + semantic. This is a coupling between the skill orchestration layer and the data layer that Public should be aware of. (iteration 3)
- **Looking for hyperedge validation**: no validation. `validate.py` does not touch hyperedges; they pass through to `G.graph["hyperedges"]` unchecked. This is a clean extension point but also a correctness risk for Public. (iteration 3)
- **Hoping cluster IDs are stable across data updates**: they aren't. Re-indexing by size descending means adding a few nodes that grow community A past community B will swap their IDs. Public should NOT use community IDs as stable identifiers across runs; use community membership lookups via labels or content fingerprints. (iteration 4)
- **Looking for LLM calls during report generation**: there are zero. `report.py` is fully deterministic and only depends on the graph + community + cohesion + analysis state. This makes graphify's report cheap to regenerate and trivially testable — a property Public should preserve in any analogous output layer. (iteration 4)
- **Looking for recursive community splitting**: only one re-split pass exists. A community that survives the second Leiden pass at > 25% remains oversized. Public could improve on this by adding a recursive depth parameter, but should evaluate whether the added complexity matches user needs. (iteration 4)
- **Looking for tunable Leiden parameters in graphify**: not available. There is no resolution, randomness seed, or modularity-objective override exposed at any level (CLI, skill, Python API). Users must fork `cluster.py` to tune. This is a deliberate simplicity choice but a constraint Public should know about before adopting graspologic for its own clustering. (iteration 4)
- **Hoping git hooks fire on `git pull`**: not directly. They fire on the post-commit / post-checkout events that follow a pull, so a fast-forward merge will eventually trigger them, but a rebase or merge with conflicts may not produce the same hook sequence. Public's git-hook patterns should test against multiple update flows, not just `git commit`. (iteration 5)
- **Hoping the hook payload includes the actual report content**: it doesn't. The hook injects a one-line nudge that tells Claude to READ the report file. The report file is stored on disk and Claude must explicitly open it. This is a deliberate choice — injecting the full report would be a token explosion on every Glob/Grep call. Public should not try to inline structural answers into the hook message. (iteration 5)
- **Hoping watch.py can rebuild semantic content automatically**: it cannot. `_notify_only` is the explicit dead end for non-code changes — the watcher writes a flag and stops. Public should not assume "watcher = full freshness." Doc/image freshness still requires a human invocation of `/graphify --update`. (iteration 5)
- **Looking for a hook that blocks tool use**: graphify's hook is a guidance nudge, not a veto. There is no path in `__main__.py` or `hooks.py` that returns a non-zero exit code from the hook. Public should treat "block raw file search" as a separate design question — graphify's design intentionally avoids it. (iteration 5)
- **Looking for cache TTL or capacity management**: not implemented. The cache grows monotonically. Public should consider adding a GC pass when adopting the SHA256 cache pattern. (iteration 5)
- **Hoping `safe_fetch` blocks private IP ranges**: it doesn't. Scheme is checked but the resolved IP is not. A URL pointing at `http://169.254.169.254/` (AWS metadata service) or `http://127.0.0.1/` would pass `validate_url`. Public should add IP-range filtering if exposing ingestion to untrusted users. (iteration 6)
- **Hoping graphify has OCR fallback for scanned PDFs**: it does not. If `pypdf.extract_text()` returns empty (image-only PDF), graphify silently returns `""` and the file gets a 0 word count. The semantic subagent then reads the empty PDF (or skips it). Public should add an OCR fallback if it adopts this pattern for scanned-document corpora. (iteration 6)
- **Hoping graphify uses its own vision API**: it doesn't. All image understanding goes through the Agent tool dispatched in skill.md, which uses Claude's native vision. There is NO `extract_image()` Python function. Public should not look for one. (iteration 6)
- **Looking for content-type validation on fetched URLs**: not present. `safe_fetch` doesn't check `Content-Type` headers. A URL claimed to be a PDF that returns HTML will be saved as `.pdf` and likely fail at `pypdf` time. This is a known limitation that Public should harden if it adopts the pattern. (iteration 6)
- **Looking for image dimension or filesize introspection in detect.py**: not present. Images are categorized purely by extension. There is no width/height check, no `Pillow` import. Even gigabyte-sized images pass through. Public should consider this when adopting the pattern. (iteration 6)
- **Hoping the 71.5x is reproducible across arbitrary corpora**: it's not. The number is corpus-specific (depends on corpus size, graph density, and question-corpus match). Public should not cite 71.5x when describing graphify externally. (iteration 7)
- **Hoping the benchmark compares against graph-aware baselines**: it doesn't. Only naive full-corpus stuffing. The reduction vs Code Graph MCP or vector search is not measured. (iteration 7)
- **Hoping the benchmark uses real Claude tokenization**: it doesn't. Pure character-count heuristic. Real tokenization could shift numbers by ±50%. (iteration 7)
- **Looking for a tunable benchmark with custom baselines**: not present. `run_benchmark()` accepts custom `questions` and `corpus_words`, but the baseline calculation (`words * 100 // 75`) is hardcoded and the BFS depth (3) is hardcoded. Public would need to fork `benchmark.py` to compare against alternative baselines. (iteration 7)
- **Looking for Claude-actual token counts in any worked example**: not present. graphify never calls `count_tokens` from any LLM API. All numbers are heuristic estimates. (iteration 7)

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
**TRANSITION TO SYNTHESIS.** Iteration 8 should compile `research/research.md` with the following structure: 1. Executive summary with the 71.5x credibility verdict (do not lead with 71.5x) 2. Pipeline architecture (from iter 1) 3. AST extraction details (from iter 2) 4. Semantic + merge + cache (from iter 3) 5. Clustering + analysis + report (from iter 4) 6. Hooks + cache invalidation (from iter 5) 7. Multimodal pipeline (from iter 6) 8. Benchmark credibility (from iter 7) 9. **Comparison vs Public's Code Graph MCP and CocoIndex** (synthesis — depth analysis required) 10. **Adopt/Adapt/Reject recommendations** (synthesis — Q12 answer) 11. Evidence-grounded conclusion with specific file:line citations preserved from all 7 iterations The synthesis must produce the 5+ findings the prompt requires, all with file:line citations, and explicitly avoid duplicating findings already covered for codesight (002) or contextador (003).

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->
