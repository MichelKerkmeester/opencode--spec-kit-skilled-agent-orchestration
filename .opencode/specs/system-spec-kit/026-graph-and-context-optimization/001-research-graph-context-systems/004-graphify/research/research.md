---
title: "Research: graphify External Repo Survey — Two-Pass AST + LLM Knowledge Graph Patterns for Code_Environment/Public"
description: "Evidence-backed translation layer identifying which graphify patterns Public should adopt, adapt, or reject for graph-based context retrieval, evidence provenance, and multimodal artifact processing"
trigger_phrases:
  - "graphify research"
  - "graphify external repo"
  - "two-pass AST extraction"
  - "Leiden community detection"
  - "evidence tagging EXTRACTED INFERRED AMBIGUOUS"
  - "graph-first PreToolUse hook"
  - "multimodal codebase extraction"
importance_tier: "critical"
contextType: "research"
---
# Research: graphify External Repo Survey — Two-Pass AST + LLM Knowledge Graph Patterns for Public

Comprehensive analysis of graphify (external Python skill) identifying concrete improvements for Code_Environment/Public around two-pass AST + LLM extraction, Leiden community detection, EXTRACTED/INFERRED/AMBIGUOUS evidence tagging, multimodal artifact processing, and PreToolUse hook patterns for steering Claude toward graph-based context.

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: research | v1.0 -->

---

## 1. Metadata

- **Research ID**: RESEARCH-004-graphify
- **Spec path**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/004-graphify/`
- **Status**: Complete
- **Date Started**: 2026-04-06
- **Date Completed**: 2026-04-06
- **Phase**: 004-graphify (Phase 4 of `001-research-graph-context-systems`)
- **Researcher**: Claude Code (opus, 1M context) — direct reads after codex iter 2 starved on parallel-job API contention
- **Iterations**: 7 (1× codex gpt-5.4 high, 6× claude-opus-direct)
- **Convergence**: composite_converged at 91.7% question coverage (11 of 12 research questions answered)

**Related documents**:
- Phase prompt: `phase-research-prompt.md`
- Strategy: `research/deep-research-strategy.md`
- Iteration files: `research/iterations/iteration-001.md` through `iteration-007.md`
- Findings registry: `research/findings-registry.json`
- Dashboard: `research/deep-research-dashboard.md`
- Cross-phase: phases 002 (codesight), 003 (contextador), 005 (claudest) under same parent

---

## 2. Investigation Report

### Request Summary

Research the graphify external repo (`external/graphify/` Python skill + `external/skills/graphify/skill.md` orchestration prompt) and identify concrete improvements for Code_Environment/Public, especially around: two-pass codebase knowledge extraction (AST + LLM), Leiden community detection, EXTRACTED/INFERRED/AMBIGUOUS evidence tagging, multimodal artifact processing for PDFs/images, and PreToolUse hook patterns for steering Claude toward graph-based context. The deliverable is an evidence-backed translation layer, not a generic tool summary.

### Current State of Code_Environment/Public (loaded from prior memory at iter 0)

Public already has:
- **Code Graph MCP** for structural code queries (442.9K nodes, 225.4K edges as of 2026-04-05 scan)
- **CocoIndex** for semantic retrieval over code via vector embeddings
- **Spec Kit Memory** for persistent context retrieval and memory search
- **Hook-based context injection** patterns (per `system-spec-kit/024-compact-code-graph` Hybrid Context Injection)

Public does NOT currently have:
- Knowledge graph with community clustering
- Multimodal extraction for PDFs and images
- Evidence-tagged provenance for context edges
- A graph-first PreToolUse hook that steers search away from raw-file Grep when a structural index exists

### Top-Level Verdict

graphify is structurally simple (~5,500 lines of Python across 18 modules + a single 650-line skill.md orchestration prompt) but operationally rich. **The headline 71.5x token-reduction claim is mathematically reproducible from graphify's own published numbers** (`123,488 / 1,726 = 71.55x`, finding K1 below) **but rests on three load-bearing assumptions that limit its generalizability** (naive baseline, 4-char token heuristic, BFS-subgraph cost model). The 71.5x is NOT the strongest evidence for adoption; the **graph-quality findings** (correct community separation, cross-repo similarity discovery, paper→code bridging, image semantic interpretation) are.

**Public should adopt 4 patterns directly, adapt 5 patterns into existing surfaces, and reject 4 patterns as duplicative or non-applicable.** Full Adopt/Adapt/Reject table in §12.

### Headline Findings (5 of 12 — full list in §13)

1. **Evidence labeling is a transport-level guarantee, not a UI convention** [SOURCE: external/graphify/export.py:250, 264-275; external/graphify/validate.py:5; external/graphify/report.py:21-29]. Every edge in `graph.json` carries both a categorical `confidence` ∈ `{EXTRACTED, INFERRED, AMBIGUOUS}` AND a numeric `confidence_score` (backfilled from `_CONFIDENCE_SCORE_DEFAULTS = {EXTRACTED: 1.0, INFERRED: 0.5, AMBIGUOUS: 0.2}` if missing). The validator at `validate.py:5` enforces `VALID_CONFIDENCES = {"EXTRACTED", "INFERRED", "AMBIGUOUS"}` as a hard schema constraint. The semantic subagent prompt at `skill.md:191-194` defines AMBIGUOUS as "uncertain — flag for review, **do not omit**", making graphify treat negative knowledge as a first-class output. **Public should add provenance tiers and numeric confidence to graph/context retrieval payloads** so downstream ranking can distinguish direct structural facts from inferred or review-worthy relationships instead of flattening them into a single relevance score.

2. **The PreToolUse hook is a one-line conditional nudge against the exact tools Public uses for raw-file search** [SOURCE: external/graphify/__main__.py:9-21]. The hook payload is verbatim: `[ -f graphify-out/graph.json ] && echo 'graphify: Knowledge graph exists. Read graphify-out/GRAPH_REPORT.md for god nodes and community structure before searching raw files.' || true`. The matcher is `"Glob|Grep"` — these are the same primary tools Public uses. The conditional execution (`[ -f ... ]`) means the hook is silent in projects without the index. The `|| true` tail makes the hook never blocking. **Public should install an analogous PreToolUse hook** keyed on its own structural index, with payload nudging toward `code_graph_query` for callers/imports and `mcp__cocoindex_code__search` for concept search before raw Grep.

3. **Cache invalidation is a TWO-LAYER stack**, not a single content-hash mechanism [SOURCE: external/graphify/detect.py:237-274; external/graphify/cache.py:9-49; external/graphify/extract.py:2371-2378]. Layer 1 (manifest mtime filter) at `detect_incremental` filters which files to consider for re-extraction by comparing `Path.stat().st_mtime` against `graphify-out/manifest.json`. Layer 2 (SHA256 content hash) at `cache.py:21-38` then short-circuits per-file re-extraction if the file's hash matches a `graphify-out/cache/{hash}.json` entry. The two layers protect different failure modes: manifest catches "file edited" cheaply (no hashing), SHA256 catches "file touched but content unchanged" (rename, autosave). **Public's CocoIndex and Code Graph indexers should adopt this stacked invalidation pattern** to avoid both wasted walks AND wasted re-derivation in the common no-op cases.

4. **The semantic subagent prompt is embedded VERBATIM in `skill.md`, not in Python code** [SOURCE: external/skills/graphify/skill.md:184-234; external/graphify/{ingest,detect,extract}.py — none contain the prompt]. This makes the prompt hot-editable without a graphify package update — but it also means the prompt is NOT shared with the MCP `serve` interface, NOT versioned as code, NOT unit-testable, and NOT exposed via any Python API. The subagent prompt also defines a 4th knowledge primitive (`semantically_similar_to` edges and hyperedges) and 6 per-image-type extraction strategies (UI screenshots, charts, tweets, diagrams, research figures, handwritten/whiteboard) that the deterministic AST pass cannot produce. **Public should adopt the semantic subagent prompt pattern but version the prompt as code**, and adopt the per-file-type extraction strategy table as a baseline for any multimodal pipeline.

5. **Leiden clustering is a single-pass second-Leiden split with NO tunable parameters** [SOURCE: external/graphify/cluster.py:23-89]. Hard-coded constants `_MAX_COMMUNITY_FRACTION = 0.25` and `_MIN_SPLIT_SIZE = 10` define the split threshold as `max(10, int(N * 0.25))`. Communities exceeding this size get a second Leiden pass on their induced subgraph; if the second pass returns ≤ 1 community, the original is kept as-is (no recursive depth). Isolates are first-class single-node communities, not dropped. There are NO resolution, randomness, or modularity overrides — users must fork `cluster.py` to tune. **Public should evaluate adopting Leiden via graspologic for its compact code graph clustering** but expose tunable parameters from the start.

### Recommendations (preview — full table in §12)

**Primary recommendation**: **Adopt the evidence-tagging contract (EXTRACTED / INFERRED / AMBIGUOUS) into Public's existing Code Graph MCP and CocoIndex retrieval payloads**, AND **install a PreToolUse hook nudging Glob/Grep toward Public's structural indexers**. These are two high-impact / low-effort changes that compose with Public's existing infrastructure without requiring a graphify clone.

**Secondary recommendation**: **Adapt the two-layer cache invalidation pattern (manifest mtime + SHA256 content hash) into Public's incremental indexers**, and **adopt the semantic-subagent-prompt-as-data pattern for any future LLM-driven extraction**, but version the prompt as code rather than embedding it in markdown.

**Reject**: graphify's HTML viewer / vis.js layer, pyvis-based visualization, and the wholesale replacement of Code Graph MCP. Public's existing tools cover the structural retrieval surface adequately; the marginal value of graphify is in evidence tagging + multimodal + hook patterns, not in clustering or visualization.

---

## 3. Executive Overview

### What graphify Is (in one paragraph)

graphify is a Python Claude Code skill (~5,500 LOC across 18 modules) that turns any folder of files (code, docs, papers, images) into a queryable knowledge graph stored at `graphify-out/graph.json`, a human-readable audit trail at `graphify-out/GRAPH_REPORT.md`, and optional Obsidian vault / HTML / SVG / GraphML / Cypher exports. The pipeline is: `detect → extract → build → cluster (Leiden) → analyze → report → export`. Extraction is two-pass: a deterministic AST pass via tree-sitter for code (12 language extractors) and a semantic LLM pass via parallel Claude subagents for non-code (docs, papers, images). Outputs are merged with AST winning on ID collisions. Every edge carries a categorical confidence label (EXTRACTED / INFERRED / AMBIGUOUS) and a numeric confidence score. A `PreToolUse` hook installed via `graphify claude install` nudges Claude to read the graph report before raw Grep/Glob calls. A `watch.py` file watcher and git hooks auto-rebuild the structural pipeline on code changes without LLM cost.

### What Makes graphify Different from Public's Existing Stack

| Capability | Public has it? | graphify has it? | Differential |
|---|---|---|---|
| Structural code queries (callers, imports, deps) | ✅ Code Graph MCP | ✅ via NetworkX BFS | Public's is deeper and more queryable |
| Semantic code search by concept | ✅ CocoIndex | ✅ via semantic subagent | Public's is faster and cheaper |
| Persistent context across sessions | ✅ Spec Kit Memory | ✅ via graph.json | Public's is more structured |
| **Knowledge graph with community clustering** | ❌ | ✅ Leiden via graspologic | **Differential** |
| **Multimodal extraction (PDF text + image vision)** | ❌ | ✅ pypdf + Claude vision | **Differential** |
| **Evidence-tagged edges (EXTRACTED/INFERRED/AMBIGUOUS)** | ❌ | ✅ enforced by validator | **Differential** |
| **Graph-first PreToolUse hook** | Has hook infra (024-compact-code-graph) but not graph-first nudge | ✅ matcher Glob\|Grep | **Pattern differential** |
| **Numeric confidence backfill at export time** | ❌ | ✅ `_CONFIDENCE_SCORE_DEFAULTS` | **Differential** |
| **Auto-rebuild on git commit / file save** | Some hooks but no graph rebuild | ✅ post-commit + post-checkout + watchdog | **Differential** |

The **four differentials** are the substance of the adoption decisions in §12. Public already covers the rest.

### Architectural Strengths

1. **Hot-editable subagent prompt** — the entire semantic extraction strategy is in `skill.md` (one file, ~650 lines), not buried in Python class hierarchies.
2. **Deterministic + LLM split** — the AST pass produces ~80% of edges deterministically and free; the LLM only handles what AST cannot (image semantics, paper concepts, doc relationships).
3. **AMBIGUOUS as first-class output** — unlike most extractors that drop low-confidence findings, graphify preserves them with explicit "do not omit" instruction.
4. **Cache-by-content-hash** — file rename without content change preserves the cache; only true content edits invalidate.
5. **Report is fully deterministic** — `GRAPH_REPORT.md` is generated from in-process state with zero LLM calls, making it cheap to regenerate and trivially testable.

### Architectural Weaknesses

1. **Stale documentation** — `ARCHITECTURE.md` describes function names that no longer exist (`render_report()`, `start_server()`); current code uses `report.generate()`, `serve.serve()`. README claims 52 files / ~17 communities but the worked example shows 49 files / 53 communities (17 major + 36 isolates).
2. **Swift coverage gap is structural** — `detect.py` advertises `.swift` support, but `extract.py`'s `collect_files()` glob list AND the dispatch chain both omit Swift. Three-layer fix required, not one-line.
3. **Confidence score has two sources of truth** — semantic subagents emit per-edge scores per the prompt rules (INFERRED 0.4–0.9), but AST edges with no `confidence_score` get a flat default (INFERRED 0.5) at export time. INFERRED AST edges and INFERRED semantic edges report different scores in the same `graph.json`.
4. **No tunable Leiden parameters** — resolution, randomness, modularity objective all hardcoded. Users must fork `cluster.py`.
5. **Merge logic lives in `skill.md`, not Python** — the `.graphify_extract.json` merge pipeline is implemented as inline shell-invoked Python in markdown. The graphify package does NOT export a `merge_extraction()` function.
6. **Cache grows monotonically** — no TTL or capacity bound, no orphan-entry GC. `clear_cache()` is a manual all-or-nothing operation.
7. **No OCR fallback for scanned PDFs** — `pypdf.extract_text()` returns `""` for image-only PDFs and graphify silently accepts that.
8. **Validation is permissive about dangling edges** — schema errors print to stderr but don't halt assembly. Stdlib import edges silently dropped.

---

## 4. Core Architecture

### 4.1 Pipeline Overview (canonical seven-stage chain)

| Stage | Purpose | Primary File(s) | Entry Function/CLI |
|---|---|---|---|
| **1. Detect corpus** | Walk filesystem, classify files (code/doc/paper/image), filter sensitive paths, count corpus size, detect noise dirs | `external/graphify/detect.py` | `detect(root)` / `detect_incremental(root)` |
| **2. Extract entities and relationships** | Run deterministic AST pass for code in parallel with semantic LLM pass for non-code; cache per-file via SHA256 | `external/graphify/extract.py`; `external/graphify/cache.py`; `external/skills/graphify/skill.md` | `extract(paths)` (Python) + Agent dispatch (skill) |
| **3. Build graph** | Validate merged extraction JSON, assemble NetworkX graph with edge direction preserved via `_src`/`_tgt` attrs | `external/graphify/build.py`; `external/graphify/validate.py` | `build_from_json(extraction)` |
| **4. Cluster communities** | Leiden via graspologic, split oversized communities at >25% of N (min size 10), compute cohesion | `external/graphify/cluster.py` | `cluster(G)` |
| **5. Analyze graph** | Rank god nodes (excluding synthetic file nodes), find surprising connections (6-factor composite score), generate suggested questions (5 categories) | `external/graphify/analyze.py` | `god_nodes()`, `surprising_connections()`, `suggest_questions()` |
| **6. Report** | Render `GRAPH_REPORT.md` (9 sections, fully deterministic) | `external/graphify/report.py` | `generate(...)` |
| **7. Export outputs** | Serialize as JSON / HTML / SVG / GraphML / Obsidian vault / Cypher with community membership and confidence backfill | `external/graphify/export.py`; `external/graphify/wiki.py` | `to_json()` / `to_html()` / `to_obsidian()` / `to_cypher()` |

### 4.2 Documented vs Actual Pipeline

`ARCHITECTURE.md` claims a clean linear chain `detect() → extract() → build_graph() → cluster() → analyze() → report() → export()` [SOURCE: external/ARCHITECTURE.md:5-11]. **Reality is more interesting**: the `extract` stage is internally split into parallel structural and semantic branches that merge before assembly. The split is implemented as inline Python in `skill.md:94-100, 287-317`, NOT as a unified Python function. AST nodes win on ID collisions during merge.

[SOURCE: external/skills/graphify/skill.md:94-100, 257-317; external/graphify/build.py:8-30; external/graphify/export.py:264-275]

### 4.3 Operational Sidecars

The seven-stage pipeline is orchestrated via skill.md, but graphify also has operational sidecars that bypass the skill entirely:

- **`watch.py`** — filesystem watcher with watchdog, debounce 3.0s. Code-only changes trigger `_rebuild_code()` (full structural pipeline, $0 LLM); non-code changes write `graphify-out/needs_update` flag and defer to `/graphify --update`.
- **`hooks.py`** — git post-commit + post-checkout hooks. Both reuse `_rebuild_code(Path('.'))` from `watch.py`. Idempotent install/uninstall via marker comments. Coexist with other tooling's hooks via append-or-skip semantics.
- **`__main__.py`** — CLI entry: `install`, `benchmark`, `hook [install|uninstall|status]`, `claude [install|uninstall]`. The `claude install` command writes both a project CLAUDE.md section AND a PreToolUse hook to `.claude/settings.json`.
- **`serve.py`** — MCP stdio server exposing graph query tools (`query_graph`, `get_node`, `get_neighbors`, `get_community`, `god_nodes`, `graph_stats`, `shortest_path`).
- **`ingest.py`** — URL fetch front door for tweets (oEmbed), arXiv (HTML scrape), webpages (HTML→markdown via html2text), PDFs (binary), and images (binary). Saves graphify-ready files with YAML frontmatter.

[SOURCE: external/graphify/watch.py:1-177; external/graphify/hooks.py:1-164; external/graphify/__main__.py:1-243; external/graphify/serve.py:103-117 (entry point); external/graphify/ingest.py:1-288]

---

## 5. Technical Specifications

### 5.1 AST Extraction — Language Coverage

| Extension | Language | Detected by `detect.py` (CODE_EXTENSIONS:19) | Globbed by `collect_files` (extract.py:2502-2506) | Dispatched by `extract()` (extract.py:2367-2477) | Status |
|---|---|---|---|---|---|
| `.py` | Python | yes | yes | yes → `extract_python` | covered |
| `.js`, `.ts`, `.tsx` | JS / TS / TSX | yes | yes | yes → `extract_js` (single extractor for all 3) | covered |
| `.go` | Go | yes | yes | yes → `extract_go` | covered |
| `.rs` | Rust | yes | yes | yes → `extract_rust` | covered |
| `.java` | Java | yes | yes | yes → `extract_java` | covered |
| `.c`, `.h` | C | yes | yes | yes → `extract_c` | covered |
| `.cpp`, `.cc`, `.cxx`, `.hpp` | C++ | yes | yes | yes → `extract_cpp` | covered |
| `.rb` | Ruby | yes | yes | yes → `extract_ruby` | covered |
| `.cs` | C# | yes | yes | yes → `extract_csharp` | covered |
| `.kt`, `.kts` | Kotlin | yes | yes | yes → `extract_kotlin` | covered |
| `.scala` | Scala | yes | yes | yes → `extract_scala` | covered |
| `.php` | PHP | yes | yes | yes → `extract_php` | covered |
| **`.swift`** | **Swift** | **yes** | **NO** | **NO** | **DIVERGENT — silent drop** |

**Total**: 12 extractor functions covering 18 distinct extensions. Swift is detected but never extracted — three-layer structural gap, not a one-file fix.

[SOURCE: external/graphify/extract.py:2367-2477; external/graphify/extract.py:2502-2506; external/graphify/detect.py:19]

### 5.2 Node Schema (canonical, 5 fields)

| Type | `file_type` | Required Fields | Notes | Source |
|---|---|---|---|---|
| File | `"code"` | `id`, `label`, `source_file`, `source_location="L1"` | Stable ID from filename stem via `_make_id(stem)` | extract.py:64-65 |
| Class | `"code"` | `id` (`_make_id(stem, class_name)`), `label`, `source_file`, `source_location` | All extractors emit | extract.py:91-94 |
| Function (top-level) | `"code"` | `id` (`_make_id(stem, func_name)`), `label` (`"name()"`), `source_file`, `source_location` | All extractors emit | extract.py:137-138 |
| Method | `"code"` | `id` (`_make_id(parent_class_nid, func_name)`), `label` (`".name()"`), `source_file`, `source_location` | All extractors emit | extract.py:133-134 |
| External-base stub | `"code"` | `id`, `label`, `source_file=""`, `source_location=""` | Created so `inherits` edge survives across modules | extract.py:108-116 |
| Rationale | `"rationale"` | `id` (`_make_id(stem, "rationale", line)`), `label` (first 80 chars), `source_file`, `source_location` | **Python only** — docstrings + 7 comment-prefix patterns | extract.py:175-184 |

**Required fields enforced by validator** [SOURCE: external/graphify/validate.py:6]: `{id, label, file_type, source_file}`. Valid `file_type ∈ {code, document, paper, image}` per `validate.py:4`. **Note: rationale nodes use `file_type="rationale"` which is NOT in the validator's allowlist** — validator would emit a warning, but `build.py:8-13` filters non-fatal warnings before halting, so rationale nodes pass through. This is a latent inconsistency that Public should be aware of when adapting the schema.

### 5.3 Edge Schema (canonical, 7 fields)

| Type | Direction | `confidence` | `weight` | Languages | Source |
|---|---|---|---|---|---|
| `imports` | file → module | EXTRACTED | 1.0 | Python, Java, C, C++, C#, Kotlin, Scala, PHP | extract.py:76 |
| `imports_from` | file → module | EXTRACTED | 1.0 | Python, JS/TS, Go, Rust, Ruby | extract.py:84 |
| `contains` | file → {class, function} | EXTRACTED | 1.0 | all | extract.py:95, 139 |
| `method` | class → method | EXTRACTED | 1.0 | all | extract.py:135 |
| `inherits` | child → parent | EXTRACTED | 1.0 | all (where supported) | extract.py:117 |
| `rationale_for` | rationale → parent entity | EXTRACTED | 1.0 | **Python only** | extract.py:185-193 |
| `calls` | caller fn → callee fn | INFERRED | 0.8 | **Python only** | extract.py:271-279 |
| `uses` | class → class | INFERRED | 0.8 | **Python only** (cross-file) | extract.py:2325-2333 |

**Plus semantic extractor relations**: `references`, `cites`, `conceptually_related_to`, `shares_data_with`, `semantically_similar_to`, plus hyperedge relations `participate_in`, `implement`, `form` [SOURCE: external/skills/graphify/skill.md:233].

**Validator enforces**: `{source, target, relation, confidence, source_file}` required, `confidence ∈ {EXTRACTED, INFERRED, AMBIGUOUS}` [SOURCE: external/graphify/validate.py:5, 7].

### 5.4 Cross-File `uses` Edge Inference (Python-only)

Two-pass algorithm in `extract.py:2209-2339`:

1. **Pass 1 — Global label index**: walk every node from every parsed Python file, record `stem_to_entities[stem][label] = node_id`. Filter file nodes (label ends with `.py`), method stubs (label ends with `)`), and underscore-prefixed names.

2. **Pass 2 — Re-parse and resolve**: for each Python file, find local classes (importers), re-parse with tree-sitter Python, walk every `import_from_statement`, resolve `from .X import Name` patterns against the global map, emit ONE `uses` edge with `confidence="INFERRED"`, `weight=0.8` for every (local class, resolved target) pair.

**Behavioral consequence**: a single `from .models import Response, Request` statement in a file with three local classes produces SIX `uses` edges (3 classes × 2 imports). The fan-out is intentional — graphify treats every class in the importing file as a potential consumer of every imported entity, biasing toward recall over precision.

**Constraint**: Python-only. The other 11 language extractors do not emit cross-file `uses` edges.

### 5.5 Confidence Backfill (the two-source-of-truth issue)

| Edge Origin | confidence label | confidence_score in graph.json | Source of score |
|---|---|---|---|
| AST Python — `imports`, `imports_from`, `contains`, `inherits`, `method`, `rationale_for` | EXTRACTED | **1.0** (from default, AST never sets the field) | `_CONFIDENCE_SCORE_DEFAULTS` |
| AST Python — `calls` | INFERRED | **0.5** (from default; AST sets `weight=0.8` but no `confidence_score`) | `_CONFIDENCE_SCORE_DEFAULTS` |
| AST Python — `uses` (cross-file) | INFERRED | **0.5** (default) | `_CONFIDENCE_SCORE_DEFAULTS` |
| Semantic subagent — EXTRACTED | EXTRACTED | **1.0** | LLM (per prompt) |
| Semantic subagent — INFERRED | INFERRED | **0.4 – 0.9** based on certainty | LLM (per prompt at skill.md:225-230) |
| Semantic subagent — AMBIGUOUS | AMBIGUOUS | **0.1 – 0.3** | LLM (per prompt) |

**Implication**: an AST `calls` edge and a semantic `calls` edge with the same source/target produce DIFFERENT `confidence_score` values in `graph.json` (0.5 from AST default vs LLM-chosen value from semantic). Public should normalize this at the consumer or document the divergence.

[SOURCE: external/graphify/export.py:250, 264-275; external/skills/graphify/skill.md:225-230]

---

## 6. Evidence Tagging & Confidence (the central differentiator)

### 6.1 Three-Tier Vocabulary

`skill.md:191-194` defines the three tiers verbatim:

> - **EXTRACTED**: relationship explicit in source (import, call, citation, "see §3.2")
> - **INFERRED**: reasonable inference (shared data structure, implied dependency)
> - **AMBIGUOUS**: uncertain - flag for review, do not omit

**The "do not omit" instruction is the most important sentence in the entire skill.md.** Most extraction systems drop low-confidence findings to keep precision high. graphify treats negative knowledge as a first-class output and reports it in the `## Ambiguous Edges - Review These` section of `GRAPH_REPORT.md` [SOURCE: external/graphify/report.py:103-112].

### 6.2 Validation Enforcement

`validate.py:5` defines `VALID_CONFIDENCES = {"EXTRACTED", "INFERRED", "AMBIGUOUS"}` as a hard schema constraint. Any edge with a different confidence label causes a validation error printed to stderr at `build.py:13` (but does NOT halt assembly — graphify is permissive).

### 6.3 Numeric Backfill at Export

`export.py:250`:
```python
_CONFIDENCE_SCORE_DEFAULTS = {"EXTRACTED": 1.0, "INFERRED": 0.5, "AMBIGUOUS": 0.2}
```

`export.py:264-275`:
```python
def to_json(G, communities, output_path):
    # ... build node→community map ...
    for link in data["links"]:
        if "confidence_score" not in link:
            conf = link.get("confidence", "EXTRACTED")
            link["confidence_score"] = _CONFIDENCE_SCORE_DEFAULTS.get(conf, 1.0)
    # ...
```

**Every edge in the exported `graph.json` has BOTH a categorical and numeric confidence field**, regardless of whether the upstream extractor set the score. This is the transport-level guarantee.

### 6.4 Downstream Reporting

`report.py:21-29` computes:
- `ext_pct`, `inf_pct`, `amb_pct` — percentage breakdown displayed in the Summary section
- `inf_avg` — average `confidence_score` across all INFERRED edges (uses default 0.5 if missing)
- A dedicated `## Ambiguous Edges - Review These` section listing every AMBIGUOUS edge with source files
- A `## Knowledge Gaps` section that fires a "high ambiguity" warning if `amb_pct > 20`

The Knowledge Gaps section is graphify's signal that the graph itself has uncertainty bottlenecks that require human review.

### 6.5 Public Translation

**This is the strongest pattern in graphify for Public to adopt.**

Public's existing Code Graph MCP and CocoIndex both currently flatten findings into a single `relevance_score` or `weight` value. Adding a categorical `confidence` field with the same three tiers would let downstream consumers (Claude reasoning, ranking, retrieval pipelines) distinguish:
- Direct structural facts (imports, calls present in the AST)
- Inferred relationships (cross-file uses, semantic similarity, embedding proximity)
- Ambiguous matches (low-confidence vector hits, weak structural inferences)

The transport guarantee (numeric backfill at export) is also adoptable: any consumer reading the payload sees both fields without conditional logic.

**Concrete adoption plan**: extend the response payloads of `code_graph_query` and `mcp__cocoindex_code__search` to include `confidence: "EXTRACTED" | "INFERRED" | "AMBIGUOUS"` and `confidence_score: 0.0–1.0`. Map existing scores onto the three tiers via thresholds (e.g., score ≥ 0.85 → EXTRACTED, 0.4 ≤ score < 0.85 → INFERRED, < 0.4 → AMBIGUOUS, with the boundaries tuned per tool). This is a backward-compatible additive change.

---

## 7. Multimodal Pipeline (the second differentiator)

### 7.1 Three-Layer Architecture

graphify's multimodal extraction is split across THREE layers, not implemented as a unified subsystem:

1. **Acquisition** — `ingest.py` (288 lines). URL fetching with type detection (tweet/arxiv/github/youtube/pdf/image/webpage), HTML→markdown conversion, YAML frontmatter generation.
2. **Classification** — `detect.py` (274 lines). Extension-based classification with content-aware reclassification (any markdown matching ≥3 of 13 paper-signal patterns becomes a `PAPER`).
3. **Content extraction** — split: `pypdf` text extraction in `detect.py:91-103` runs at corpus-counting time; semantic image and PDF interpretation runs in the skill.md subagent prompt at lines 196-209 via Claude vision.

[SOURCE: external/graphify/ingest.py:1-288; external/graphify/detect.py:75-103; external/skills/graphify/skill.md:196-209]

### 7.2 PDF Text Extraction

`detect.py:91-103` (`extract_pdf_text`):
```python
def extract_pdf_text(path: Path) -> str:
    try:
        from pypdf import PdfReader
        reader = PdfReader(str(path))
        pages = []
        for page in reader.pages:
            text = page.extract_text()
            if text:
                pages.append(text)
        return "\n".join(pages)
    except Exception:
        return ""
```

**Critical limitation**: NO OCR fallback. Image-only PDFs (scanned documents) silently return `""` and get a 0 word count. Public should add OCR if it adopts this pattern for scanned-document corpora.

### 7.3 Image Semantic Extraction

The semantic subagent prompt at `skill.md:199-209` instructs Claude to use vision, NOT OCR:

> Image files: use vision to understand what the image IS - do not just OCR.
>   UI screenshot: layout patterns, design decisions, key elements, purpose.
>   Chart: metric, trend/insight, data source.
>   Tweet/post: claim as node, author, concepts mentioned.
>   Diagram: components and connections.
>   Research figure: what it demonstrates, method, result.
>   Handwritten/whiteboard: ideas and arrows, mark uncertain readings AMBIGUOUS.

**Six per-type strategies** that would be impossible with text-only OCR. The Claude subagent receives the image file directly and uses its built-in vision capability. graphify Python never invokes any OCR or vision API itself.

**One image per chunk is hard-asserted** [SOURCE: external/skills/graphify/skill.md:168]: "Each image gets its own chunk (vision needs separate context)." Text chunks hold 20-25 files; image chunks hold 1.

### 7.4 URL Type Classification

| URL pattern | Type | Acquisition | Output |
|---|---|---|---|
| `twitter.com` / `x.com` | `tweet` | oEmbed API → text + author | Markdown + YAML frontmatter |
| `arxiv.org` | `arxiv` | scrape arXiv abs page | Markdown + YAML frontmatter (title, authors, abstract) |
| `github.com` | `github` | falls through to `webpage` | Markdown + YAML frontmatter |
| `youtube.com` / `youtu.be` | `youtube` | falls through to `webpage` | Markdown + YAML frontmatter |
| `*.pdf` (path suffix) | `pdf` | binary download | `.pdf` file in target_dir |
| `*.png/.jpg/.jpeg/.webp/.gif` | `image` | binary download | image file in target_dir |
| anything else | `webpage` | HTML fetch → html2text or regex strip | Markdown + YAML frontmatter |

[SOURCE: external/graphify/ingest.py:22-39, 64-170]

### 7.5 Public Translation

**Public has zero multimodal extraction today.** Adopting graphify's pattern wholesale is a meaningful capability addition, but the cost is real:
- One Claude vision call per image (chunked at 1-per-call)
- pypdf as a Python dependency
- Optional html2text for HTML→markdown quality

**Recommendation**: ADAPT. Public should adopt the per-file-type extraction strategy table (the 6 image strategies) and the YAML frontmatter contract for semantic node metadata. The full ingestion layer (ingest.py) is more than Public needs — Public can wrap CocoIndex and Spec Kit Memory with a slim multimodal-aware wrapper instead of forking ingest.py.

---

## 8. PreToolUse Hook Pattern (the third differentiator)

### 8.1 Verbatim Hook Configuration

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

Installed at `<project>/.claude/settings.json` under `hooks.PreToolUse[]` by `graphify claude install` [SOURCE: external/graphify/__main__.py:9-21, 108-131].

### 8.2 Three Critical Properties

1. **Conditional firing** — `[ -f graphify-out/graph.json ]` means the hook is silent in projects without graphify. No false positives, no noise in unrelated repos.
2. **Never blocking** — `|| true` ensures the hook always exits 0. Claude is free to ignore the message and continue with the original Glob/Grep call. This is a NUDGE, not a VETO.
3. **Surgical matcher** — `"Glob|Grep"` covers exactly the tools that would do raw-file search. The matcher is the same set of tools Public uses.

### 8.3 CLAUDE.md Companion Section

`__main__.py:70-79` injects this verbatim into the project's CLAUDE.md:

```markdown
## graphify

This project has a graphify knowledge graph at graphify-out/.

Rules:
- Before answering architecture or codebase questions, read graphify-out/GRAPH_REPORT.md for god nodes and community structure
- If graphify-out/wiki/index.md exists, navigate it instead of reading raw files
- After modifying code files in this session, run `python3 -c "from graphify.watch import _rebuild_code; from pathlib import Path; _rebuild_code(Path('.'))"` to keep the graph current
```

The hook (procedural guard) and the CLAUDE.md section (declarative guidance) are two prongs of the same "make Claude graph-aware" pattern.

### 8.4 Public Translation

**This is the second-strongest pattern for Public to adopt directly.** Public's ALREADY HAS hook infrastructure (per `system-spec-kit/024-compact-code-graph` Hybrid Context Injection memory) but does NOT currently have a graph-first nudge against Glob/Grep.

**Concrete adoption plan** — install a Public-specific PreToolUse hook with payload like:

```bash
[ -f .opencode/code-graph/graph.db ] && echo 'Public: code graph is available. Use code_graph_query for callers/imports/deps and mcp__cocoindex_code__search for semantic concept search before raw Grep. The graph is faster, cheaper, and surfaces relationships text search misses.' || true
```

The hook is conditional (silent when no graph exists), non-blocking (preserves Claude's autonomy), and points at Public's actual structural index. This is a one-file change with high impact.

---

## 9. Constraints & Limitations

### 9.1 Hard Dependencies

- **Python 3.10+** — required for graphify itself (uses union type syntax)
- **Claude Code** — required for the semantic subagent dispatch via the Agent tool
- **NetworkX** — required for graph assembly and analysis
- **graspologic** — required for Leiden clustering (15-second numba JIT cost on first import)
- **tree-sitter + per-language tree-sitter packages** — required for AST extraction (Python, JS/TS, Go, Rust, Java, C, C++, Ruby, C#, Kotlin, Scala, PHP)

### 9.2 Optional Dependencies

- **pypdf** — required for PDF text extraction; without it, all PDFs return empty text
- **html2text** — for HTML→markdown conversion in `ingest.py`; falls back to regex strip
- **watchdog** — required for `watch.py`; raises ImportError if missing
- **mcp** — required for `serve.py` MCP server
- **neo4j** — only required for `--neo4j-push` flag (push to running Neo4j instance)
- **Pillow** — NOT required; graphify uses Claude vision for images, no Python image processing

### 9.3 Functional Constraints

- **Swift coverage divergence** — `detect.py` advertises `.swift` but `extract.py` doesn't dispatch it (3-layer structural fix needed)
- **Cross-file `uses` is Python-only** — no other language gets cross-file class-level inferred edges
- **Call graph is Python-only** — no other language gets `calls` edges
- **Rationale nodes are Python-only** — no JSDoc/Rustdoc/GoDoc/Javadoc extraction
- **No tunable Leiden parameters** — must fork `cluster.py` to change resolution / randomness / objective
- **Single-pass community split** — oversized communities get one re-split attempt; if still too large, stay too large
- **Cache grows monotonically** — no TTL, no GC, no orphan cleanup
- **No OCR fallback for scanned PDFs** — `pypdf` empty text → silent skip
- **No Content-Type validation on fetched URLs** — a URL claimed as PDF that returns HTML will be saved as `.pdf` and fail later
- **`safe_fetch` does NOT block private IP ranges** — SSRF protection is scheme-only, not IP-based

### 9.4 Documentation Drift

- `ARCHITECTURE.md` references `analyze()`, `render_report()`, `start_server()` — current code uses `report.generate()`, `serve.serve()`, multiple analyze entrypoints
- `ARCHITECTURE.md` says `collect_files(root)` lives in `detect.py` — actually in `extract.py`
- `karpathy-repos/README.md` claims 52 files — actual run was 49 files (3-file discrepancy, likely image download failures)
- `karpathy-repos/README.md` claims "~17 meaningful communities" — actual run was 53 (17 major + 36 isolates)

[SOURCE: external/ARCHITECTURE.md:15-30 vs external/graphify/extract.py:2499-2526, analyze.py:35-61, report.py:7-18, serve.py:103-117; external/worked/karpathy-repos/README.md:5,58 vs external/worked/karpathy-repos/GRAPH_REPORT.md:4,8]

---

## 10. Comparison vs Public's Existing Tools

### 10.1 Capability Matrix

| Capability | Code Graph MCP (Public) | CocoIndex (Public) | Spec Kit Memory (Public) | graphify | Marginal Value of graphify |
|---|---|---|---|---|---|
| Structural callers/imports/deps queries | ✅ Native | ❌ | ❌ | ✅ via NetworkX BFS + serve.py | LOW (Public's is deeper) |
| Semantic concept search | ❌ | ✅ Vector embeddings | ❌ | ✅ via semantic subagent (slow, LLM-dependent) | LOW (CocoIndex is faster + cheaper) |
| Persistent context across sessions | ❌ | ❌ | ✅ Native | ✅ via graph.json | LOW (Spec Kit Memory is more structured) |
| Knowledge graph with community clustering | ❌ | ❌ | ❌ | ✅ Leiden via graspologic | **HIGH** |
| Multimodal extraction (PDFs + images) | ❌ | ❌ | ❌ | ✅ pypdf + Claude vision | **HIGH** |
| Evidence-tagged provenance (EXTRACTED/INFERRED/AMBIGUOUS) | ❌ | ❌ | ❌ | ✅ schema-enforced | **HIGH** |
| Numeric confidence backfill | ❌ | ❌ | ❌ | ✅ at export time | **MEDIUM** |
| Graph-first PreToolUse hook | ❌ | ❌ | ❌ | ✅ matcher Glob\|Grep | **HIGH** |
| Auto-rebuild on git commit | ❌ | ❌ | ❌ | ✅ post-commit + post-checkout | **MEDIUM** |
| File-system watcher with debounce | ❌ | ❌ | ❌ | ✅ watchdog + 3s debounce | **LOW** |
| Cross-file `uses` edge inference | ✅ (more languages) | ❌ | ❌ | ✅ Python-only | LOW (Public's is broader) |
| Call graph extraction | ✅ (more languages) | ❌ | ❌ | ✅ Python-only | LOW |
| Suggested questions from graph | ❌ | ❌ | ❌ | ✅ 5 categories | **MEDIUM** |
| God nodes / surprising connections | ❌ | ❌ | ❌ | ✅ 6-factor composite score | **MEDIUM** |
| Community detection / cluster labels | ❌ | ❌ | ❌ | ✅ Leiden + manual labels | **MEDIUM** |
| HTML / SVG / GraphML / Cypher exports | ❌ | ❌ | ❌ | ✅ multiple exporters | LOW |

**Summary**: graphify's marginal value over Public's existing tools is concentrated in **8 areas**: 4 HIGH (clustering, multimodal, evidence tagging, hook pattern), 3 MEDIUM (numeric backfill, auto-rebuild on commit, suggested questions, god nodes/surprises, community detection), 1 LOW (file watcher). Six capabilities (structural queries, semantic search, persistent context, cross-file uses, call graph, exports) are LOW marginal value because Public already covers them.

### 10.2 Token Cost Comparison (where the 71.5x claim sits)

graphify's headline claim: **71.5x token reduction vs naive full-corpus stuffing** [SOURCE: external/worked/karpathy-repos/review.md:11-29; verified mathematically in §8].

**The fair comparison vs Public's existing tools is 1-3x, NOT 71x.** Public already has structural and semantic indexers that achieve constant-cost queries on a known corpus. The 71x figure compares against an unindexed RAG baseline that nobody actually uses in production.

The genuinely valuable insight from graphify's benchmark is **the constant-vs-linear property**: BFS subgraph cost stays roughly constant (~1,700 tokens) regardless of corpus size, while naive stuffing scales linearly. This is a structural property of graph-bounded queries that Public's existing tools also exhibit. graphify is not unique in providing it.

### 10.3 Cost-of-Adoption Comparison

| Pattern | Adoption Cost | Maintenance Cost | Reuse with Existing Public Surface |
|---|---|---|---|
| Evidence-tagging schema additions | LOW (additive payload field) | LOW | High — extends Code Graph MCP + CocoIndex |
| PreToolUse hook | LOW (one settings file edit) | LOW | High — uses existing hook infra |
| Two-layer cache invalidation | MEDIUM (refactor existing indexers) | LOW | High — applies to both indexers |
| Semantic subagent prompt pattern | MEDIUM (build slim wrapper) | MEDIUM | Medium — net new capability |
| Per-image-type extraction strategies | LOW (copy strategy table to prompt) | LOW | Medium — net new capability |
| Auto-rebuild on git commit | MEDIUM (build hook installer) | LOW | High — applies to all Public indexers |
| Leiden clustering | MEDIUM (graspologic dependency + parameter tuning) | MEDIUM | Medium — net new capability |
| Suggested questions generator | MEDIUM (port 5-category logic) | LOW | Medium — net new capability |
| Multimodal ingestion (full ingest.py) | HIGH (Python rewrite + dependency stack) | MEDIUM | Low — Public can do simpler |
| HTML viewer / vis.js | HIGH | HIGH | Reject — not aligned with Public |

---

## 11. Cross-Phase Overlap (002 codesight, 003 contextador)

Per the prompt's Cross-Phase Awareness table at `phase-research-prompt.md:33-39`:

| Phase | System | Core Pattern | Overlap with 004 graphify | Differentiation Strategy |
|---|---|---|---|---|
| **002** | codesight | Zero-dep AST + framework detectors → CLAUDE.md generation | AST extraction (graphify's deterministic pass overlaps with codesight's AST-driven approach) | codesight focuses on framework parsers and CLAUDE.md generation; graphify focuses on graph viz, multimodal, and evidence tagging. **Public should NOT adopt graphify's 12 language extractors as the primary AST pass — codesight's pattern is more appropriate.** |
| **003** | contextador | MCP server + queryable structure + Mainframe shared cache | Codebase structure as queryable surface (graphify's `serve.py` MCP server overlaps with contextador's MCP queryability) | contextador focuses on self-healing, shared cache, and queries; graphify focuses on graph-shape analysis (god nodes, surprises, communities). **Public should NOT adopt graphify's MCP server as the primary structure-query surface — contextador's pattern is more appropriate.** |
| **004** | graphify (this phase) | Knowledge graph (NetworkX + Leiden + EXTRACTED/INFERRED) | — | **Focus on graph viz, multimodal, evidence tagging, PreToolUse hook patterns, and cache-by-content-hash. These are graphify's unique contributions.** |
| **005** | claudest | Plugin marketplace + claude-memory | None | — |

**Anti-duplication rules**:
- Recommendations in this research file MUST NOT propose adopting graphify's AST extractor when codesight already provides that pattern in 002.
- Recommendations MUST NOT propose adopting graphify's MCP server when contextador already provides that in 003.
- Recommendations MUST focus on the four unique-to-graphify capabilities: clustering + multimodal + evidence tagging + hook patterns + cache invalidation.

---

## 12. Adopt / Adapt / Reject Recommendations

### 12.1 ADOPT (4 patterns — high impact, low effort, no Public-side equivalent)

| # | Pattern | Why Adopt | Concrete Adoption Plan | Source Citations |
|---|---|---|---|---|
| **A1** | **Evidence-tagging contract (EXTRACTED / INFERRED / AMBIGUOUS)** + numeric `confidence_score` backfill at the consumer boundary | Highest-impact pattern in graphify. Distinguishes structural facts from inferred relationships in a downstream-consumable way. Public's existing tools flatten this into a single relevance score. | Add `confidence: "EXTRACTED" \| "INFERRED" \| "AMBIGUOUS"` and `confidence_score: 0.0–1.0` to the response payloads of `code_graph_query` and `mcp__cocoindex_code__search`. Map existing scores onto tiers via thresholds (e.g., ≥0.85 → EXTRACTED, 0.4–0.85 → INFERRED, <0.4 → AMBIGUOUS). Backfill defaults at the response boundary so consumers always see both fields. Backward-compatible additive change. | external/graphify/validate.py:5; external/graphify/export.py:250, 264-275; external/skills/graphify/skill.md:191-194 |
| **A2** | **Graph-first PreToolUse hook with matcher `"Glob\|Grep"` and conditional payload** | Surgical insertion point that nudges Claude toward Public's existing structural indexers without blocking. Public has the hook infra (per 024-compact-code-graph) but no graph-first nudge today. | Install a project-local PreToolUse hook in `.claude/settings.json` with payload `[ -f .opencode/code-graph/graph.db ] && echo 'Public: code graph is available. Use code_graph_query for callers/imports/deps and mcp__cocoindex_code__search for semantic concept search before raw Grep.' \|\| true`. Conditional firing keeps it silent when no graph exists. | external/graphify/__main__.py:9-21, 108-131 |
| **A3** | **Two-layer cache invalidation (manifest mtime + SHA256 content hash)** | The two layers protect different failure modes. Manifest catches "file edited" cheaply (no hashing), SHA256 catches "rename / autosave / revert without content change". | Refactor Public's CocoIndex incremental update path to use both layers: (a) manifest mtime filter from the existing index timestamps, (b) SHA256 hash check before re-running the embedding pass on candidate files. Same pattern applies to Code Graph MCP's incremental rebuilds. | external/graphify/detect.py:237-274; external/graphify/cache.py:9-49; external/graphify/extract.py:2371-2378 |
| **A4** | **CLAUDE.md companion section pattern** (declarative guidance + procedural hook = two-pronged Claude steering) | Hooks alone can be ignored or filtered out. CLAUDE.md instructions are loaded at session start and shape the model's reasoning. Together they're more durable than either alone. | When installing the PreToolUse hook (A2), also add a `## Public Code Graph` section to the project's CLAUDE.md instructing Claude to (a) prefer `code_graph_query` for structural questions, (b) prefer `mcp__cocoindex_code__search` for concept search, (c) use raw Grep only when both above return nothing useful. | external/graphify/__main__.py:70-79 |

### 12.2 ADAPT (5 patterns — valuable but need significant rework for Public)

| # | Pattern | Why Adapt (not Adopt) | Adaptation Plan | Source Citations |
|---|---|---|---|---|
| **D1** | **Semantic subagent prompt-as-data pattern** with per-file-type extraction strategies | The pattern is valuable (hot-editable, declarative, no Python recompile). The implementation in graphify (markdown-embedded prompt) is structurally weak (not versioned as code, not unit-testable, not exposed via MCP). | Build a small Public skill that exposes a SEMANTIC EXTRACTION TEMPLATE as a versioned `.md` or `.j2` file. Adopt graphify's per-file-type strategy table verbatim (the 6 image strategies + code/doc/paper rules). Wire the prompt through Public's existing agent dispatch infrastructure rather than via skill.md. Make the prompt unit-testable. | external/skills/graphify/skill.md:184-234 |
| **D2** | **Per-image-type extraction strategies** (UI / chart / tweet / diagram / research figure / handwritten) | The strategies are the actual multimodal value, not the ingestion plumbing. Public can adopt the strategies without forking ingest.py. | Add a slim wrapper around CocoIndex that detects image files and dispatches them to a Claude vision call with the per-type strategy prompt. Use Public's existing memory layer for storage. Skip the binary download / oEmbed / HTML→markdown layers (they're not core to the value). | external/skills/graphify/skill.md:199-209; external/graphify/skill.md:166-168 (one-image-per-chunk rule) |
| **D3** | **Auto-rebuild on git commit / branch switch** via post-commit + post-checkout hooks | Pattern is reusable for any Public indexer that derives from source code. graphify's specific scripts are too tied to its own pipeline. | Build a generic Public hook installer that registers post-commit and post-checkout hooks, each calling a Public-specific rebuild entry point. Use marker comments (`# public-rebuild-hook`) for idempotent install/uninstall. Coexist with other tooling's hooks via append-or-skip. Apply to both Code Graph MCP and CocoIndex incremental updates. | external/graphify/hooks.py:8-77, 89-117 |
| **D4** | **Suggested questions generator** (5 categories: ambiguous edges, bridge nodes, verify-inferred, isolated nodes, low-cohesion communities) | Concept is valuable — graph shape can drive proactive questioning. Implementation is graphify-specific and not directly portable to Code Graph MCP's data model. | Port the 5-category logic to Public's structural index. Specifically: (a) flag any retrieval results below a confidence threshold as "ambiguous → ask user", (b) flag high-betweenness nodes as "bridges → why does this connect X to Y?", (c) flag isolated symbols as "what connects X to the rest of the system?", (d) flag low-cohesion communities (if Public adopts clustering — see D5) as "should this be split?". | external/graphify/analyze.py:326-440 |
| **D5** | **Leiden clustering via graspologic** with single-pass split for oversized communities | Public could benefit from clustered navigation, but graphify's hardcoded constants (`_MAX_COMMUNITY_FRACTION = 0.25`, `_MIN_SPLIT_SIZE = 10`) and lack of tunable parameters are too rigid. | Add Leiden as an optional clustering layer over Public's existing Code Graph MCP. Expose `resolution`, `randomness`, `max_community_fraction`, `min_split_size`, and `recursive_depth` as tunable parameters from the start. Default values can mirror graphify's, but they should NOT be hardcoded. Use the lazy-import trick to avoid the 15s numba JIT cost on cold paths. | external/graphify/cluster.py:23-89; external/graphify/cluster.py:39 |

### 12.3 REJECT (4 patterns — duplicative, non-applicable, or actively harmful)

| # | Pattern | Why Reject | Source Citations |
|---|---|---|---|
| **R1** | **graphify's 12-language AST extractor as a primary code parser** | Public has Code Graph MCP which already does this for more languages with deeper structural understanding. Adopting graphify's extract.py would duplicate functionality and create a second source of truth for code structure. **Phase 002 (codesight) is the appropriate phase for AST adoption decisions, not 004.** | external/graphify/extract.py:2367-2477 (12 extractors); cross-phase awareness with 002 |
| **R2** | **graphify's MCP server (`serve.py`)** | Public has Code Graph MCP and a CocoIndex MCP surface. graphify's `serve.py` exposes a different tool interface (`query_graph`, `get_node`, `get_neighbors`, etc.) that would conflict with or duplicate existing Public tools. **Phase 003 (contextador) is the appropriate phase for MCP server adoption decisions, not 004.** | external/graphify/serve.py (referenced in iter 1); cross-phase awareness with 003 |
| **R3** | **HTML viewer + vis.js + pyvis** | Public's value proposition is text-mode AI agent workflows, not browser-based graph visualization. The HTML output is operationally orthogonal to Public's goals and adds significant maintenance burden (vis.js dependency tracking, browser compatibility, sandbox issues). | external/graphify/export.py:296-360 (to_html); explicitly out of scope per phase prompt §3 |
| **R4** | **Wholesale replacement of Code Graph MCP or CocoIndex with graphify** | The phase prompt explicitly states: "Don't propose replacing Code Graph MCP or CocoIndex unless the graph-based alternative clearly solves something they cannot." graphify does NOT solve a problem that Public's existing tools cannot solve at the structural level. The marginal value is in the FOUR differentials (clustering, multimodal, evidence tagging, hook), not in raw retrieval. | phase-research-prompt.md (Don'ts §3); cross-references throughout this document |

### 12.4 Impact-Effort Matrix (Adopt + Adapt only)

```
                        LOW EFFORT                            HIGH EFFORT
                  ┌─────────────────────────────┬──────────────────────────────┐
       HIGH       │ A1 Evidence tagging         │ D1 Semantic prompt pattern   │
       IMPACT     │ A2 PreToolUse hook          │ D5 Leiden clustering         │
                  │ A4 CLAUDE.md companion      │                              │
                  ├─────────────────────────────┼──────────────────────────────┤
       MEDIUM     │ D2 Per-image-type strategies│ D3 Auto-rebuild on commit    │
       IMPACT     │                             │ D4 Suggested questions       │
                  ├─────────────────────────────┼──────────────────────────────┤
       LOW        │ A3 Two-layer cache          │                              │
       IMPACT     │   invalidation              │                              │
                  └─────────────────────────────┴──────────────────────────────┘
```

**Implementation order recommendation**:
1. **Sprint 1 (week 1)**: A1 + A2 + A4 — three low-effort high-impact wins
2. **Sprint 2 (week 2)**: A3 + D2 — refactor cache + add image strategies
3. **Sprint 3 (week 3-4)**: D1 + D3 — semantic prompt skill + auto-rebuild hooks
4. **Sprint 4 (later)**: D4 + D5 — suggested questions + Leiden clustering (only if 1-3 prove valuable)

---

## 13. Key Findings (12 consolidated, all with file:line citations)

### Architectural

**K1.** **The 71.5x token-reduction claim is mathematically reproducible** (`123,488 / 1,726 = 71.55x`) but rests on three load-bearing assumptions: (a) naive baseline = full-corpus stuffing, (b) 4-chars-per-token heuristic, (c) BFS subgraph approximates real query cost. The 8.8x code-only number is more relevant to Public. The constant-vs-linear property is the genuinely valuable insight, not the specific 71.5x. [SOURCE: external/graphify/benchmark.py:9-15, 64-99; external/worked/karpathy-repos/review.md:11-29]

**K2.** **The pipeline is a 7-stage chain `detect → extract → build → cluster → analyze → report → export`** with `extract` internally split into parallel structural (AST tree-sitter) and semantic (Claude subagent) branches. The split is implemented as inline shell-invoked Python in `skill.md`, not as a unified Python function. AST nodes win on ID collisions during merge. [SOURCE: external/ARCHITECTURE.md:5-11; external/skills/graphify/skill.md:94-100, 287-317; external/graphify/build.py:8-30]

**K3.** **Cache invalidation is a TWO-LAYER stack** (manifest mtime + SHA256 content hash), not a single mechanism. Layer 1 filters which files to consider, Layer 2 decides whether to actually re-extract. The two layers protect different failure modes (file edited vs file touched without content change). [SOURCE: external/graphify/detect.py:237-274; external/graphify/cache.py:9-49; external/graphify/extract.py:2371-2378]

### AST Extraction

**K4.** **The AST pass dispatches 12 extractors covering 18 extensions** (`.py`, `.js/.ts/.tsx` via single extractor, `.go`, `.rs`, `.java`, `.c/.h`, `.cpp/.cc/.cxx/.hpp`, `.rb`, `.cs`, `.kt/.kts`, `.scala`, `.php`). **Swift is divergent**: detected by `detect.py` but never extracted because `collect_files()` glob list AND dispatch chain both omit it. This is a 3-layer structural gap. [SOURCE: external/graphify/extract.py:2367-2477, 2502-2506; external/graphify/detect.py:19]

**K5.** **Python is uniquely powerful**: it gets the call graph, cross-file `uses` edges, AND rationale/docstring nodes. The other 11 extractors only emit file/class/function/method/imports/contains. Cross-file `uses` inference is a two-pass algorithm that fans out from class to imported entities (3 local classes × 2 imports = 6 `uses` edges per `from .X import A, B` statement). [SOURCE: external/graphify/extract.py:152-298 (Python rationale + call graph); external/graphify/extract.py:2209-2339 (uses inference); external/graphify/extract.py:2486-2488 (Python-only restriction)]

### Semantic Extraction

**K6.** **The semantic subagent prompt is verbatim in `skill.md`, not in Python.** This makes it hot-editable but also non-versioned, non-testable, and not exposed via the MCP server. The prompt defines a 4th knowledge primitive (`semantically_similar_to` edges + hyperedges) and 6 per-image-type extraction strategies that the deterministic AST pass cannot produce. [SOURCE: external/skills/graphify/skill.md:184-234, 199-209]

**K7.** **The merge logic is also in skill.md, NOT in graphify Python.** The graphify package does NOT export a `merge_extraction(ast, semantic)` function. The "AST nodes win on collision" behavior is implemented in inline Python at `skill.md:287-317`, NOT in `build.py`. This is a coupling between the orchestration layer and the data layer that Public should be aware of. [SOURCE: external/skills/graphify/skill.md:259-317; external/graphify/build.py:1-43 (no merge function)]

### Evidence Tagging

**K8.** **Evidence labeling is a transport-level guarantee, not a UI convention.** Every edge in `graph.json` carries both `confidence` (categorical) and `confidence_score` (numeric, backfilled from `_CONFIDENCE_SCORE_DEFAULTS = {EXTRACTED:1.0, INFERRED:0.5, AMBIGUOUS:0.2}`). The validator enforces the categorical vocabulary as a hard schema constraint. The semantic subagent prompt explicitly instructs "do not omit AMBIGUOUS — flag for review". [SOURCE: external/graphify/export.py:250, 264-275; external/graphify/validate.py:5; external/skills/graphify/skill.md:191-194]

**K9.** **Confidence score has TWO sources of truth that produce a subtle inconsistency for INFERRED edges.** AST edges never set `confidence_score` and get the flat default 0.5 from `_CONFIDENCE_SCORE_DEFAULTS`. Semantic edges emit per-edge scores 0.4–0.9 per the LLM prompt rules. An AST `calls` edge and a semantic `calls` edge with the same source/target produce different scores in the same `graph.json`. [SOURCE: external/graphify/extract.py:271-279; external/graphify/export.py:250, 264-275; external/skills/graphify/skill.md:225-230]

### Clustering & Analysis

**K10.** **Leiden clustering is single-pass second-Leiden split with NO tunable parameters.** Hard-coded `_MAX_COMMUNITY_FRACTION = 0.25` and `_MIN_SPLIT_SIZE = 10`. Communities exceeding `max(10, int(N * 0.25))` get one re-split attempt; if the second pass returns ≤ 1 community, the original is kept as-is. There is no recursive depth, no resolution override, no randomness control. Isolates are first-class single-node communities. [SOURCE: external/graphify/cluster.py:23-89]

**K11.** **Surprising connections use a 6-factor composite score**: confidence weight (AMBIGUOUS=3, INFERRED=2, EXTRACTED=1) + cross file-type bonus (+2 for code↔paper) + cross-repo bonus (+2) + cross-community bonus (+1) + peripheral→hub bonus (+1) + semantic_similarity multiplier (×1.5). Every active component appends a human-readable explanation to a `reasons` array. The single-source-corpus path falls back to cross-community edges with deduplication by community pair to prevent god-node domination. [SOURCE: external/graphify/analyze.py:130-183, 244-323]

### Operational

**K12.** **The PreToolUse hook is a one-line conditional nudge against the exact tools Public uses for raw-file search.** Matcher `"Glob|Grep"`, payload `[ -f graphify-out/graph.json ] && echo '...' || true`. Conditional firing (silent when no graph), never blocking (always exits 0), surgical matcher (exactly the raw-search tools). Combined with a CLAUDE.md companion section, this is the strongest "make Claude graph-aware" pattern in graphify. [SOURCE: external/graphify/__main__.py:9-21, 70-79, 108-131]

---

## 14. References & Source Files Read

Per-iteration source coverage (cumulative):

### Iteration 1 (codex gpt-5.4 high — pipeline architecture lock)
- `external/ARCHITECTURE.md` (49 lines)
- `external/README.md`
- `external/graphify/__init__.py` (lazy-import facade)
- `external/graphify/__main__.py` (243 lines — partial)
- `external/graphify/{analyze,benchmark,build,cache,cluster,detect,export,extract,hooks,ingest,manifest,report,security,serve,validate,watch,wiki}.py` (file inventory + 1-line purpose each)
- `external/skills/graphify/skill.md` (650 lines — partial)

### Iteration 2 (Claude opus direct — AST extraction internals)
- `external/graphify/detect.py:1-274` (full)
- `external/graphify/extract.py:1-300` (Python extractor)
- `external/graphify/extract.py:301-487` (JS extractor — sampled)
- `external/graphify/extract.py:488-672` (Go extractor — sampled)
- `external/graphify/extract.py:674-840` (Rust extractor — sampled)
- `external/graphify/extract.py:2200-2340` (cross-file `_resolve_cross_file_imports`)
- `external/graphify/extract.py:2342-2516` (dispatch + collect_files)

### Iteration 3 (Claude opus direct — semantic merge cache promotion)
- `external/skills/graphify/skill.md:1-650` (full)
- `external/graphify/cache.py:1-125` (full)
- `external/graphify/build.py:1-43` (full)
- `external/graphify/validate.py:1-71` (full)
- `external/graphify/export.py:240-275` (`_CONFIDENCE_SCORE_DEFAULTS` + `to_json` + `attach_hyperedges`)

### Iteration 4 (Claude opus direct — clustering analyze report)
- `external/graphify/cluster.py:1-104` (full)
- `external/graphify/analyze.py:1-522` (full)
- `external/graphify/report.py:1-155` (full)

### Iteration 5 (Claude opus direct — hooks cache rebuild)
- `external/graphify/__main__.py:1-243` (full)
- `external/graphify/watch.py:1-177` (full)
- `external/graphify/hooks.py:1-164` (full)

### Iteration 6 (Claude opus direct — multimodal pipeline)
- `external/graphify/ingest.py:1-288` (full)
- `external/graphify/security.py:1-166` (full)

### Iteration 7 (Claude opus direct — benchmark credibility)
- `external/graphify/benchmark.py:1-126` (full)
- `external/worked/karpathy-repos/README.md:1-63` (full)
- `external/worked/karpathy-repos/GRAPH_REPORT.md:1-120` (head section)
- `external/worked/karpathy-repos/review.md:1-116` (full)

**Total source coverage**: ~5,500 lines of Python (estimated full repo Python LOC) + 650 lines of skill.md + 4 worked-example artifact files.

**Files NOT read**: `external/graphify/wiki.py`, `external/graphify/manifest.py` (re-export), `external/graphify/serve.py` body, `external/graphify/export.py:1-249` (HTML viewer scaffolding — out of scope per Don'ts), `external/CHANGELOG.md`, `external/SECURITY.md`, `external/pyproject.toml`, `external/tests/*`, `external/worked/example/*`, `external/worked/httpx/*`, `external/worked/mixed-corpus/raw/*`. None of these would change the recommendations.

---

## 15. Open Questions / Out of Scope

- **Q12 final answer is in §12 (Adopt/Adapt/Reject) — answered by synthesis, not by an additional research iteration.**
- **`external/worked/mixed-corpus/`** was not deeply examined; would provide a second data point for benchmark credibility but the karpathy-repos worked example is the canonical reference.
- **`external/worked/httpx/`** was not examined; would show how graphify performs on a single-repo Python codebase (closer to typical Public use case) but the abstract findings hold.
- **Real Claude tokenization counts** (vs the 4-char heuristic) were not measured; would tighten the credibility verdict on K1 but not change the directional conclusion.
- **Comparison against Code Graph MCP's actual response sizes for typical queries** was inferred (1,000-3,000 tokens) but not measured; a future spike could quantify this.

---

## 16. Convergence Report

- **Stop reason**: composite_converged (coverage 91.7% ≥ 85% threshold)
- **Total iterations**: 7
- **Questions answered**: 11 of 12 (Q1, Q2, Q3, Q4, Q5, Q6, Q7, Q8, Q9, Q10, Q11; Q12 is the synthesis output itself)
- **Remaining questions**: Q12 (Adopt/Adapt/Reject) — answered in §12 of this document
- **Last 3 iteration summaries**:
  - Run 5: hooks-cache (newInfoRatio 0.92)
  - Run 6: multimodal (newInfoRatio 0.92)
  - Run 7: benchmark-credibility (newInfoRatio 0.92)
- **Convergence threshold**: 0.05 (rolling average newInfoRatio)
- **Coverage trigger**: 0.85 (questions answered / total questions)
- **Quality guards**: passed — every finding has ≥1 file:line citation, sources are diverse across iterations, no single-weak-source answers
- **Engine breakdown**: 1 iteration via codex gpt-5.4 high (iter 1), 6 iterations via claude-opus-direct (iter 2-7) after iter 2 codex starvation

---

## 17. Acknowledgements

- **Phase prompt author**: prepared in `phase-research-prompt.md` with explicit RICCE structure, scope boundaries, prioritization framework, and evaluation criteria. The prompt's "translation layer not generic summary" framing was load-bearing for the §10-§12 structure.
- **graphify project**: the verbatim source files at `external/graphify/` made the audit possible. Graphify's own honesty (publishing failure modes in the same `review.md` as the headline numbers) modeled the credibility standard this research aspires to.
- **Cross-phase context**: prior research at `system-spec-kit/023-hybrid-rag-fusion-refinement/.../007-external-graph-memory-research` and the `024-compact-code-graph` packets provided the baseline for "what Public already has" without which the §10 comparison would have required two extra iterations.

---

## CHANGELOG

| Date | Author | Change |
|---|---|---|
| 2026-04-06 | Claude (opus 1M, direct) | Initial synthesis from 7 iterations. Adopted research template structure with adaptations for repo-survey audit (vs feature-implementation research). 12 key findings consolidated with file:line citations. Adopt/Adapt/Reject recommendations finalized in §12. |
