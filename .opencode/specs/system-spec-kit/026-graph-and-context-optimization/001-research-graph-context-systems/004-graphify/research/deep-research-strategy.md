---
title: Deep Research Strategy - 004-graphify
description: Session tracking for deep research on graphify external repo with Code_Environment/Public translation focus
---

# Deep Research Strategy - 004-graphify

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose
Persistent brain for deep research session investigating `external/graphify/` and `external/skills/graphify/` to identify concrete improvements for Code_Environment/Public's codebase navigation, context retrieval, evidence provenance, and multimodal artifact processing.

Wave 2 (`completed-continue`) extends the original external-tool survey into repo-internal translation work: map the strongest graphify patterns onto current Public handlers, hooks, schema surfaces, validation flows, and rollout paths so iterations 11-20 end with implementation-grade adoption guidance rather than only external-tool analysis.

### Usage
- Init: orchestrator populated topic, key questions, non-goals, stop conditions, and known context from prior memory
- Per iteration: agent reads Next Focus, executes 3-5 research actions, writes iteration evidence; reducer refreshes machine-owned sections
- Mutability: Sections 7-11 reducer-owned; Sections 1-6, 12-13 analyst-owned
- Constraint: User directive to prefer `cli-codex gpt-5.4-high` for heavy code analysis where it fits within Bash budget

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:topic -->
## 2. TOPIC

Research the external repository at `external/` (graphify Python skill) and identify concrete improvements for Code_Environment/Public, especially around two-pass codebase knowledge extraction (AST + LLM), Leiden community detection, EXTRACTED/INFERRED/AMBIGUOUS evidence tagging, multimodal artifact processing, and PreToolUse hook patterns for steering Claude toward graph-based context.

The goal is an evidence-backed translation layer: determine what graphify does that Code_Environment/Public can reuse, adapt, or reject, and explain why. NOT a generic tool summary.

---

<!-- /ANCHOR:topic -->
<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Q1: Which languages and extensions are actually supported by the AST pass in `external/graphify/extract.py` and `external/graphify/detect.py`, and where does runtime coverage diverge between detection and extraction?
- [x] Q2: What exact entities and relationship types does the deterministic pass emit (rationale nodes, method stubs, imports, calls, inheritance, cross-file `uses` edges)?
- [x] Q3: How does the semantic subagent prompt in `external/skills/graphify/skill.md` define extraction behavior for docs, papers, images, semantic similarity, and hyperedges?
- [x] Q4: How are AST and semantic outputs merged, deduplicated, cached, and promoted into final `graphify-out/graph.json`?
- [x] Q5: What are the actual Leiden parameter choices in `external/graphify/cluster.py`, and what is the rationale behind community splitting at 25% of graph size with min split size 10?
- [x] Q6: How does graphify represent evidence and confidence (EXTRACTED/INFERRED/AMBIGUOUS semantics, default scores, downstream JSON and `GRAPH_REPORT.md` reporting)?
- [x] Q7: How does the multimodal pipeline work in practice for PDFs and images (`pypdf` usage, image handling, Claude vision vs OCR)?
- [x] Q8: What is the cache invalidation strategy across `external/graphify/cache.py` and `external/graphify/detect.py`, and how much of the system can rerun without invoking Claude?
- [x] Q9: How does the PreToolUse hook in `external/graphify/__main__.py` fire, what message does it inject, and how might a similar hook reshape Public's search behavior?
- [x] Q10: How does `GRAPH_REPORT.md` identify god nodes, surprising connections, ambiguous edges, low-cohesion communities, and suggested questions, and which patterns are reusable in Public?
- [x] Q11: How credible is the 71.5x token-reduction claim when cross-checked against `external/worked/karpathy-repos/`, README wording, and benchmark expectations?
- [x] Q12: Which graphify ideas should be Adopted directly, Adapted into existing MCP surfaces, or Rejected because Public already covers them with Code Graph MCP or CocoIndex?
- [x] Q13: Which existing Public handlers and payload contracts should carry graphify-style provenance tiers and numeric confidence without breaking current callers?
- [x] Q14: Where should a graph-first nudge live in Public today (PreToolUse, SessionStart, PreCompact, bootstrap, or command routing), and what exact existing hook/runtime files govern that path?
- [x] Q15: Which current Code Graph MCP and CocoIndex bridge surfaces already expose enough structure to absorb community labels, confidence metadata, or graph-first routing hints?
- [x] Q16: Where does Public already implement mtime/hash/incremental indexing, and where does graphify's two-layer invalidation pattern still add net value?
- [x] Q17: What is the narrowest viable multimodal adoption path for Public (PDFs, screenshots, diagrams) without forcing a graphify-style full-ingestion subsystem?
- [x] Q18: If Public wanted graph-aware clustering, what is the lightest-weight implementation path using current code-graph data stores and query surfaces?
- [x] Q19: Which existing tests, validators, or manual playbooks would need extension to prove graph-first routing and evidence-tagged retrieval work correctly?
- [x] Q20: What evaluation metrics should Public use instead of graphify's 71.5x headline so future rollout claims are architecture-native and reproducible?
- [x] Q21: Which current security, governance, or trust-boundary constraints in Public make direct graphify ingestion patterns unsafe or incomplete without adaptation?
- [x] Q22: What phased Adopt / Adapt / Reject rollout plan best fits Public's architecture over immediate, near-term, and later phases?

<!-- /ANCHOR:key-questions -->
<!-- ANCHOR:non-goals -->
## 4. NON-GOALS

- HTML viewer styling, sidebar cosmetics, vis.js chrome
- PyPI packaging, release mechanics, naming trivia
- Marketing copy quality
- General OSS project maintenance unrelated to retrieval architecture
- Replacing Code Graph MCP or CocoIndex (only suggest replacement if graph-based alternative clearly solves something they cannot)
- Conflating graphify's graph structure with codesight's text-context generation (covered by phase 002)
- Duplicating findings already produced for codesight (002) or contextador (003)

---

<!-- /ANCHOR:non-goals -->
<!-- ANCHOR:stop-conditions -->
## 5. STOP CONDITIONS

Hard stops (in addition to convergence detection):
- At least 5 cited findings in `research/research.md` with file:line evidence
- Comparison section mapping graphify capabilities vs Public's existing Code Graph MCP and CocoIndex
- Explicit Adopt / Adapt / Reject recommendations
- Cross-phase overlap with 002 (codesight AST extraction) and 003 (contextador queryable context) acknowledged
- All 22 key questions either answered or explicitly marked as out-of-scope
- Iteration cap (20) reached for the reopened wave
- Three consecutive iterations with newInfoRatio < 0.05

---

<!-- /ANCHOR:stop-conditions -->
<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Q1: Which languages and extensions are actually supported by the AST pass in `external/graphify/extract.py` and `external/graphify/detect.py`, and where does runtime coverage diverge between detection and extraction?
- Q2: What exact entities and relationship types does the deterministic pass emit (rationale nodes, method stubs, imports, calls, inheritance, cross-file `uses` edges)?
- Q3: How does the semantic subagent prompt in `external/skills/graphify/skill.md` define extraction behavior for docs, papers, images, semantic similarity, and hyperedges?
- Q4: How are AST and semantic outputs merged, deduplicated, cached, and promoted into final `graphify-out/graph.json`?
- Q5: What are the actual Leiden parameter choices in `external/graphify/cluster.py`, and what is the rationale behind community splitting at 25% of graph size with min split size 10?
- Q6: How does graphify represent evidence and confidence (EXTRACTED/INFERRED/AMBIGUOUS semantics, default scores, downstream JSON and `GRAPH_REPORT.md` reporting)?
- Q7: How does the multimodal pipeline work in practice for PDFs and images (`pypdf` usage, image handling, Claude vision vs OCR)?
- Q8: What is the cache invalidation strategy across `external/graphify/cache.py` and `external/graphify/detect.py`, and how much of the system can rerun without invoking Claude?
- Q9: How does the PreToolUse hook in `external/graphify/__main__.py` fire, what message does it inject, and how might a similar hook reshape Public's search behavior?
- Q10: How does `GRAPH_REPORT.md` identify god nodes, surprising connections, ambiguous edges, low-cohesion communities, and suggested questions, and which patterns are reusable in Public?
- Q11: How credible is the 71.5x token-reduction claim when cross-checked against `external/worked/karpathy-repos/`, README wording, and benchmark expectations?
- Q12: Which graphify ideas should be Adopted directly, Adapted into existing MCP surfaces, or Rejected because Public already covers them with Code Graph MCP or CocoIndex?
- Q13: Which existing Public handlers and payload contracts should carry graphify-style provenance tiers and numeric confidence without breaking current callers?
- Q14: Where should a graph-first nudge live in Public today (PreToolUse, SessionStart, PreCompact, bootstrap, or command routing), and what exact existing hook/runtime files govern that path?
- Q15: Which current Code Graph MCP and CocoIndex bridge surfaces already expose enough structure to absorb community labels, confidence metadata, or graph-first routing hints?
- Q16: Where does Public already implement mtime/hash/incremental indexing, and where does graphify's two-layer invalidation pattern still add net value?
- Q17: What is the narrowest viable multimodal adoption path for Public (PDFs, screenshots, diagrams) without forcing a graphify-style full-ingestion subsystem?
- Q18: If Public wanted graph-aware clustering, what is the lightest-weight implementation path using current code-graph data stores and query surfaces?
- Q19: Which existing tests, validators, or manual playbooks would need extension to prove graph-first routing and evidence-tagged retrieval work correctly?
- Q20: What evaluation metrics should Public use instead of graphify's 71.5x headline so future rollout claims are architecture-native and reproducible?
- Q21: Which current security, governance, or trust-boundary constraints in Public make direct graphify ingestion patterns unsafe or incomplete without adaptation?
- Q22: What phased Adopt / Adapt / Reject rollout plan best fits Public's architecture over immediate, near-term, and later phases?

<!-- /ANCHOR:answered-questions -->
<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->
<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->
<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **Hoping `safe_fetch` blocks private IP ranges**: it doesn't. Scheme is checked but the resolved IP is not. A URL pointing at `http://169.254.169.254/` (AWS metadata service) or `http://127.0.0.1/` would pass `validate_url`. Public should add IP-range filtering if exposing ingestion to untrusted users. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **Hoping `safe_fetch` blocks private IP ranges**: it doesn't. Scheme is checked but the resolved IP is not. A URL pointing at `http://169.254.169.254/` (AWS metadata service) or `http://127.0.0.1/` would pass `validate_url`. Public should add IP-range filtering if exposing ingestion to untrusted users.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Hoping `safe_fetch` blocks private IP ranges**: it doesn't. Scheme is checked but the resolved IP is not. A URL pointing at `http://169.254.169.254/` (AWS metadata service) or `http://127.0.0.1/` would pass `validate_url`. Public should add IP-range filtering if exposing ingestion to untrusted users.

### **Hoping cache deduplication is content-aware across renames**: it is at the file-rename level (since SHA256 only sees content, not paths) but NOT at the file-edit-revert level (any change to a file invalidates the cache, even if you revert immediately afterward, because the post-revert hash matches the pre-edit hash but the cache file may have already been overwritten by an intermediate save). Public should consider this when evaluating cache stability. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Hoping cache deduplication is content-aware across renames**: it is at the file-rename level (since SHA256 only sees content, not paths) but NOT at the file-edit-revert level (any change to a file invalidates the cache, even if you revert immediately afterward, because the post-revert hash matches the pre-edit hash but the cache file may have already been overwritten by an intermediate save). Public should consider this when evaluating cache stability.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Hoping cache deduplication is content-aware across renames**: it is at the file-rename level (since SHA256 only sees content, not paths) but NOT at the file-edit-revert level (any change to a file invalidates the cache, even if you revert immediately afterward, because the post-revert hash matches the pre-edit hash but the cache file may have already been overwritten by an intermediate save). Public should consider this when evaluating cache stability.

### **Hoping cluster IDs are stable across data updates**: they aren't. Re-indexing by size descending means adding a few nodes that grow community A past community B will swap their IDs. Public should NOT use community IDs as stable identifiers across runs; use community membership lookups via labels or content fingerprints. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Hoping cluster IDs are stable across data updates**: they aren't. Re-indexing by size descending means adding a few nodes that grow community A past community B will swap their IDs. Public should NOT use community IDs as stable identifiers across runs; use community membership lookups via labels or content fingerprints.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Hoping cluster IDs are stable across data updates**: they aren't. Re-indexing by size descending means adding a few nodes that grow community A past community B will swap their IDs. Public should NOT use community IDs as stable identifiers across runs; use community membership lookups via labels or content fingerprints.

### **Hoping git hooks fire on `git pull`**: not directly. They fire on the post-commit / post-checkout events that follow a pull, so a fast-forward merge will eventually trigger them, but a rebase or merge with conflicts may not produce the same hook sequence. Public's git-hook patterns should test against multiple update flows, not just `git commit`. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Hoping git hooks fire on `git pull`**: not directly. They fire on the post-commit / post-checkout events that follow a pull, so a fast-forward merge will eventually trigger them, but a rebase or merge with conflicts may not produce the same hook sequence. Public's git-hook patterns should test against multiple update flows, not just `git commit`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Hoping git hooks fire on `git pull`**: not directly. They fire on the post-commit / post-checkout events that follow a pull, so a fast-forward merge will eventually trigger them, but a rebase or merge with conflicts may not produce the same hook sequence. Public's git-hook patterns should test against multiple update flows, not just `git commit`.

### **Hoping graphify has OCR fallback for scanned PDFs**: it does not. If `pypdf.extract_text()` returns empty (image-only PDF), graphify silently returns `""` and the file gets a 0 word count. The semantic subagent then reads the empty PDF (or skips it). Public should add an OCR fallback if it adopts this pattern for scanned-document corpora. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **Hoping graphify has OCR fallback for scanned PDFs**: it does not. If `pypdf.extract_text()` returns empty (image-only PDF), graphify silently returns `""` and the file gets a 0 word count. The semantic subagent then reads the empty PDF (or skips it). Public should add an OCR fallback if it adopts this pattern for scanned-document corpora.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Hoping graphify has OCR fallback for scanned PDFs**: it does not. If `pypdf.extract_text()` returns empty (image-only PDF), graphify silently returns `""` and the file gets a 0 word count. The semantic subagent then reads the empty PDF (or skips it). Public should add an OCR fallback if it adopts this pattern for scanned-document corpora.

### **Hoping graphify uses its own vision API**: it doesn't. All image understanding goes through the Agent tool dispatched in skill.md, which uses Claude's native vision. There is NO `extract_image()` Python function. Public should not look for one. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **Hoping graphify uses its own vision API**: it doesn't. All image understanding goes through the Agent tool dispatched in skill.md, which uses Claude's native vision. There is NO `extract_image()` Python function. Public should not look for one.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Hoping graphify uses its own vision API**: it doesn't. All image understanding goes through the Agent tool dispatched in skill.md, which uses Claude's native vision. There is NO `extract_image()` Python function. Public should not look for one.

### **Hoping the 71.5x is reproducible across arbitrary corpora**: it's not. The number is corpus-specific (depends on corpus size, graph density, and question-corpus match). Public should not cite 71.5x when describing graphify externally. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **Hoping the 71.5x is reproducible across arbitrary corpora**: it's not. The number is corpus-specific (depends on corpus size, graph density, and question-corpus match). Public should not cite 71.5x when describing graphify externally.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Hoping the 71.5x is reproducible across arbitrary corpora**: it's not. The number is corpus-specific (depends on corpus size, graph density, and question-corpus match). Public should not cite 71.5x when describing graphify externally.

### **Hoping the benchmark compares against graph-aware baselines**: it doesn't. Only naive full-corpus stuffing. The reduction vs Code Graph MCP or vector search is not measured. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **Hoping the benchmark compares against graph-aware baselines**: it doesn't. Only naive full-corpus stuffing. The reduction vs Code Graph MCP or vector search is not measured.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Hoping the benchmark compares against graph-aware baselines**: it doesn't. Only naive full-corpus stuffing. The reduction vs Code Graph MCP or vector search is not measured.

### **Hoping the benchmark uses real Claude tokenization**: it doesn't. Pure character-count heuristic. Real tokenization could shift numbers by ±50%. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **Hoping the benchmark uses real Claude tokenization**: it doesn't. Pure character-count heuristic. Real tokenization could shift numbers by ±50%.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Hoping the benchmark uses real Claude tokenization**: it doesn't. Pure character-count heuristic. Real tokenization could shift numbers by ±50%.

### **Hoping the hook payload includes the actual report content**: it doesn't. The hook injects a one-line nudge that tells Claude to READ the report file. The report file is stored on disk and Claude must explicitly open it. This is a deliberate choice — injecting the full report would be a token explosion on every Glob/Grep call. Public should not try to inline structural answers into the hook message. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Hoping the hook payload includes the actual report content**: it doesn't. The hook injects a one-line nudge that tells Claude to READ the report file. The report file is stored on disk and Claude must explicitly open it. This is a deliberate choice — injecting the full report would be a token explosion on every Glob/Grep call. Public should not try to inline structural answers into the hook message.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Hoping the hook payload includes the actual report content**: it doesn't. The hook injects a one-line nudge that tells Claude to READ the report file. The report file is stored on disk and Claude must explicitly open it. This is a deliberate choice — injecting the full report would be a token explosion on every Glob/Grep call. Public should not try to inline structural answers into the hook message.

### **Hoping the Swift gap is fixable by adding extractor only**: it isn't. `collect_files()` inside extract.py (extract.py:2502-2506) hard-codes the `_EXTENSIONS` glob tuple, which omits `*.swift`. Even if a `extract_swift()` function existed and was wired into the dispatch, the file collection step would not surface Swift files unless callers bypass `collect_files()` and pass paths directly. Public should treat Swift coverage as a 3-layer fix, not a 1-layer fix. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Hoping the Swift gap is fixable by adding extractor only**: it isn't. `collect_files()` inside extract.py (extract.py:2502-2506) hard-codes the `_EXTENSIONS` glob tuple, which omits `*.swift`. Even if a `extract_swift()` function existed and was wired into the dispatch, the file collection step would not surface Swift files unless callers bypass `collect_files()` and pass paths directly. Public should treat Swift coverage as a 3-layer fix, not a 1-layer fix.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Hoping the Swift gap is fixable by adding extractor only**: it isn't. `collect_files()` inside extract.py (extract.py:2502-2506) hard-codes the `_EXTENSIONS` glob tuple, which omits `*.swift`. Even if a `extract_swift()` function existed and was wired into the dispatch, the file collection step would not surface Swift files unless callers bypass `collect_files()` and pass paths directly. Public should treat Swift coverage as a 3-layer fix, not a 1-layer fix.

### **Hoping watch.py can rebuild semantic content automatically**: it cannot. `_notify_only` is the explicit dead end for non-code changes — the watcher writes a flag and stops. Public should not assume "watcher = full freshness." Doc/image freshness still requires a human invocation of `/graphify --update`. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Hoping watch.py can rebuild semantic content automatically**: it cannot. `_notify_only` is the explicit dead end for non-code changes — the watcher writes a flag and stops. Public should not assume "watcher = full freshness." Doc/image freshness still requires a human invocation of `/graphify --update`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Hoping watch.py can rebuild semantic content automatically**: it cannot. `_notify_only` is the explicit dead end for non-code changes — the watcher writes a flag and stops. Public should not assume "watcher = full freshness." Doc/image freshness still requires a human invocation of `/graphify --update`.

### **Looking for a hook that blocks tool use**: graphify's hook is a guidance nudge, not a veto. There is no path in `__main__.py` or `hooks.py` that returns a non-zero exit code from the hook. Public should treat "block raw file search" as a separate design question — graphify's design intentionally avoids it. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Looking for a hook that blocks tool use**: graphify's hook is a guidance nudge, not a veto. There is no path in `__main__.py` or `hooks.py` that returns a non-zero exit code from the hook. Public should treat "block raw file search" as a separate design question — graphify's design intentionally avoids it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Looking for a hook that blocks tool use**: graphify's hook is a guidance nudge, not a veto. There is no path in `__main__.py` or `hooks.py` that returns a non-zero exit code from the hook. Public should treat "block raw file search" as a separate design question — graphify's design intentionally avoids it.

### **Looking for a Python class named `SemanticExtractor` or `SubagentPrompt`**: not found. The prompt is in `skill.md`, not Python. This means graphify cannot version the prompt as code, cannot unit-test it, and cannot expose it via the MCP `serve` interface. Public would treat this as a structural weakness if adopting the pattern. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Looking for a Python class named `SemanticExtractor` or `SubagentPrompt`**: not found. The prompt is in `skill.md`, not Python. This means graphify cannot version the prompt as code, cannot unit-test it, and cannot expose it via the MCP `serve` interface. Public would treat this as a structural weakness if adopting the pattern.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Looking for a Python class named `SemanticExtractor` or `SubagentPrompt`**: not found. The prompt is in `skill.md`, not Python. This means graphify cannot version the prompt as code, cannot unit-test it, and cannot expose it via the MCP `serve` interface. Public would treat this as a structural weakness if adopting the pattern.

### **Looking for a tunable benchmark with custom baselines**: not present. `run_benchmark()` accepts custom `questions` and `corpus_words`, but the baseline calculation (`words * 100 // 75`) is hardcoded and the BFS depth (3) is hardcoded. Public would need to fork `benchmark.py` to compare against alternative baselines. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **Looking for a tunable benchmark with custom baselines**: not present. `run_benchmark()` accepts custom `questions` and `corpus_words`, but the baseline calculation (`words * 100 // 75`) is hardcoded and the BFS depth (3) is hardcoded. Public would need to fork `benchmark.py` to compare against alternative baselines.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Looking for a tunable benchmark with custom baselines**: not present. `run_benchmark()` accepts custom `questions` and `corpus_words`, but the baseline calculation (`words * 100 // 75`) is hardcoded and the BFS depth (3) is hardcoded. Public would need to fork `benchmark.py` to compare against alternative baselines.

### **Looking for a unified `Extractor` class or visitor pattern**: there is no shared base class or registry. Each extractor is a standalone function that re-implements its own `add_node`/`add_edge` closures. The dispatch is a 110-line `if/elif` chain (extract.py:2367-2477). This rules out the hypothesis "graphify uses a plugin architecture for extractors." -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Looking for a unified `Extractor` class or visitor pattern**: there is no shared base class or registry. Each extractor is a standalone function that re-implements its own `add_node`/`add_edge` closures. The dispatch is a 110-line `if/elif` chain (extract.py:2367-2477). This rules out the hypothesis "graphify uses a plugin architecture for extractors."
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Looking for a unified `Extractor` class or visitor pattern**: there is no shared base class or registry. Each extractor is a standalone function that re-implements its own `add_node`/`add_edge` closures. The dispatch is a 110-line `if/elif` chain (extract.py:2367-2477). This rules out the hypothesis "graphify uses a plugin architecture for extractors."

### **Looking for a unified merge function in graphify Python**: the merge logic is implemented as inline shell-invoked Python in `skill.md:259-317`. The graphify package does NOT export a `merge_extraction(ast, semantic)` function. The "build" function in `build.py:34-42` is for combining MULTIPLE extractions (e.g., parallel extract() runs), not for merging AST + semantic. This is a coupling between the skill orchestration layer and the data layer that Public should be aware of. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Looking for a unified merge function in graphify Python**: the merge logic is implemented as inline shell-invoked Python in `skill.md:259-317`. The graphify package does NOT export a `merge_extraction(ast, semantic)` function. The "build" function in `build.py:34-42` is for combining MULTIPLE extractions (e.g., parallel extract() runs), not for merging AST + semantic. This is a coupling between the skill orchestration layer and the data layer that Public should be aware of.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Looking for a unified merge function in graphify Python**: the merge logic is implemented as inline shell-invoked Python in `skill.md:259-317`. The graphify package does NOT export a `merge_extraction(ast, semantic)` function. The "build" function in `build.py:34-42` is for combining MULTIPLE extractions (e.g., parallel extract() runs), not for merging AST + semantic. This is a coupling between the skill orchestration layer and the data layer that Public should be aware of.

### **Looking for built-in JSDoc / Rustdoc / GoDoc extraction**: searched the JS, Go, Rust extractors for `docstring`, `rationale`, `comment`, `JSDoc`. None present. Rationale extraction is structurally Python-only. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Looking for built-in JSDoc / Rustdoc / GoDoc extraction**: searched the JS, Go, Rust extractors for `docstring`, `rationale`, `comment`, `JSDoc`. None present. Rationale extraction is structurally Python-only.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Looking for built-in JSDoc / Rustdoc / GoDoc extraction**: searched the JS, Go, Rust extractors for `docstring`, `rationale`, `comment`, `JSDoc`. None present. Rationale extraction is structurally Python-only.

### **Looking for cache TTL or capacity management**: not implemented. The cache grows monotonically. Public should consider adding a GC pass when adopting the SHA256 cache pattern. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Looking for cache TTL or capacity management**: not implemented. The cache grows monotonically. Public should consider adding a GC pass when adopting the SHA256 cache pattern.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Looking for cache TTL or capacity management**: not implemented. The cache grows monotonically. Public should consider adding a GC pass when adopting the SHA256 cache pattern.

### **Looking for Claude-actual token counts in any worked example**: not present. graphify never calls `count_tokens` from any LLM API. All numbers are heuristic estimates. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **Looking for Claude-actual token counts in any worked example**: not present. graphify never calls `count_tokens` from any LLM API. All numbers are heuristic estimates.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Looking for Claude-actual token counts in any worked example**: not present. graphify never calls `count_tokens` from any LLM API. All numbers are heuristic estimates.

### **Looking for content-type validation on fetched URLs**: not present. `safe_fetch` doesn't check `Content-Type` headers. A URL claimed to be a PDF that returns HTML will be saved as `.pdf` and likely fail at `pypdf` time. This is a known limitation that Public should harden if it adopts the pattern. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **Looking for content-type validation on fetched URLs**: not present. `safe_fetch` doesn't check `Content-Type` headers. A URL claimed to be a PDF that returns HTML will be saved as `.pdf` and likely fail at `pypdf` time. This is a known limitation that Public should harden if it adopts the pattern.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Looking for content-type validation on fetched URLs**: not present. `safe_fetch` doesn't check `Content-Type` headers. A URL claimed to be a PDF that returns HTML will be saved as `.pdf` and likely fail at `pypdf` time. This is a known limitation that Public should harden if it adopts the pattern.

### **Looking for hyperedge validation**: no validation. `validate.py` does not touch hyperedges; they pass through to `G.graph["hyperedges"]` unchecked. This is a clean extension point but also a correctness risk for Public. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Looking for hyperedge validation**: no validation. `validate.py` does not touch hyperedges; they pass through to `G.graph["hyperedges"]` unchecked. This is a clean extension point but also a correctness risk for Public.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Looking for hyperedge validation**: no validation. `validate.py` does not touch hyperedges; they pass through to `G.graph["hyperedges"]` unchecked. This is a clean extension point but also a correctness risk for Public.

### **Looking for image dimension or filesize introspection in detect.py**: not present. Images are categorized purely by extension. There is no width/height check, no `Pillow` import. Even gigabyte-sized images pass through. Public should consider this when adopting the pattern. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **Looking for image dimension or filesize introspection in detect.py**: not present. Images are categorized purely by extension. There is no width/height check, no `Pillow` import. Even gigabyte-sized images pass through. Public should consider this when adopting the pattern.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Looking for image dimension or filesize introspection in detect.py**: not present. Images are categorized purely by extension. There is no width/height check, no `Pillow` import. Even gigabyte-sized images pass through. Public should consider this when adopting the pattern.

### **Looking for LLM calls during report generation**: there are zero. `report.py` is fully deterministic and only depends on the graph + community + cohesion + analysis state. This makes graphify's report cheap to regenerate and trivially testable — a property Public should preserve in any analogous output layer. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Looking for LLM calls during report generation**: there are zero. `report.py` is fully deterministic and only depends on the graph + community + cohesion + analysis state. This makes graphify's report cheap to regenerate and trivially testable — a property Public should preserve in any analogous output layer.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Looking for LLM calls during report generation**: there are zero. `report.py` is fully deterministic and only depends on the graph + community + cohesion + analysis state. This makes graphify's report cheap to regenerate and trivially testable — a property Public should preserve in any analogous output layer.

### **Looking for recursive community splitting**: only one re-split pass exists. A community that survives the second Leiden pass at > 25% remains oversized. Public could improve on this by adding a recursive depth parameter, but should evaluate whether the added complexity matches user needs. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Looking for recursive community splitting**: only one re-split pass exists. A community that survives the second Leiden pass at > 25% remains oversized. Public could improve on this by adding a recursive depth parameter, but should evaluate whether the added complexity matches user needs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Looking for recursive community splitting**: only one re-split pass exists. A community that survives the second Leiden pass at > 25% remains oversized. Public could improve on this by adding a recursive depth parameter, but should evaluate whether the added complexity matches user needs.

### **Looking for tunable Leiden parameters in graphify**: not available. There is no resolution, randomness seed, or modularity-objective override exposed at any level (CLI, skill, Python API). Users must fork `cluster.py` to tune. This is a deliberate simplicity choice but a constraint Public should know about before adopting graspologic for its own clustering. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Looking for tunable Leiden parameters in graphify**: not available. There is no resolution, randomness seed, or modularity-objective override exposed at any level (CLI, skill, Python API). Users must fork `cluster.py` to tune. This is a deliberate simplicity choice but a constraint Public should know about before adopting graspologic for its own clustering.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Looking for tunable Leiden parameters in graphify**: not available. There is no resolution, randomness seed, or modularity-objective override exposed at any level (CLI, skill, Python API). Users must fork `cluster.py` to tune. This is a deliberate simplicity choice but a constraint Public should know about before adopting graspologic for its own clustering.

<!-- /ANCHOR:exhausted-approaches -->
<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
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

<!-- /ANCHOR:ruled-out-directions -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved. Research is complete. Optional next step: open a follow-on implementation packet only if the team decides to execute the phased rollout recommendations.]

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->
<!-- ANCHOR:known-context -->
## 12. KNOWN CONTEXT

### Prior Memory Context (loaded at init)

**Highly relevant prior research found:**

1. **`system-spec-kit/023-hybrid-rag-fusion-refinement/011-indexing-and-adaptive-fusion/007-external-graph-memory-research/research/research.md`** — "External Graph Memory Systems Survey" (importance: critical). Comparative analysis of 7 external graph memory systems with ranked improvement backlog for Spec Kit Memory. Strong baseline for "what graph memory ideas have already been evaluated."

2. **`system-spec-kit/024-compact-code-graph/`** packet — Spec Kit Memory's existing compact code graph track. Key sub-packets include:
   - `009-code-graph-storage-query` — code graph storage and query layer (already in Public)
   - Hybrid Context Injection — Hook + Tool Architecture (Public already has hook-based context injection patterns)
   - `030-opencode-graph-plugin` — OpenCode LCM Plugin Fit research

3. **System constitutional memory:** TOOL ROUTING decision tree — `mcp__cocoindex_code__search` for semantic discovery, `code_graph_query` for structural navigation, `Grep` for exact text. This is Public's current tool surface.

### What Public Already Has (per repo introspection)
- **Code Graph MCP** for structural code queries and symbol relationships (442.9K nodes, 225.4K edges as of 2026-04-05 scan)
- **CocoIndex** for semantic retrieval over code via vector embeddings
- **Spec Kit Memory** for persistent context retrieval and memory search
- **Hook-based context injection** patterns (per 024-compact-code-graph hybrid architecture)

### What Public Does NOT Currently Have
- Knowledge graph with community clustering
- Multimodal extraction for PDFs and images
- Evidence-tagged provenance for context edges
- Graph-first PreToolUse hook that steers search away from raw-file grep when a graph exists

### Cross-Phase Awareness (from prompt)
- **002 codesight** — Zero-dep AST + framework detectors → CLAUDE.md generation. Overlap risk: AST extraction. Differentiation: codesight focuses on framework parsers + MCP tools.
- **003 contextador** — MCP server + queryable structure + Mainframe shared cache. Overlap risk: codebase structure. Differentiation: contextador focuses on self-healing, shared cache, queries.
- **004 graphify (this phase)** — Knowledge graph (NetworkX + Leiden + EXTRACTED/INFERRED). Overlap risk: 002, 003. Differentiation: graph viz, multimodal, evidence tagging.

### Reading Order (per prompt instructions §6)
1. `external/ARCHITECTURE.md` — lock end-to-end pipeline first
2. `external/graphify/__main__.py` — installer / hook entry points
3. `external/graphify/extract.py` — AST pass
4. `external/skills/graphify/skill.md` — semantic / subagent pass
5. `external/graphify/build.py` + merge logic in `skills/graphify/skill.md`
6. `external/graphify/cluster.py` — Leiden clustering
7. `external/graphify/analyze.py` — god nodes / cross-community surprises
8. `external/graphify/report.py` — `GRAPH_REPORT.md` generation
9. `external/graphify/export.py` — JSON / HTML / Obsidian artifacts
10. `external/graphify/cache.py` and `external/graphify/detect.py` — incremental + detection logic
11. `external/worked/` — concrete example outputs (validate 71.5x claim)

---

<!-- /ANCHOR:known-context -->
<!-- ANCHOR:research-boundaries -->
## 13. RESEARCH BOUNDARIES

- Max iterations: 10
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart`, `fork`, `completed-continue`
- Machine-owned sections: reducer controls Sections 7-11
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.opencode/skill/sk-deep-research/assets/runtime_capabilities.json`
- Capability matrix doc: `.opencode/skill/sk-deep-research/references/capability_matrix.md`
- Capability resolver: `.opencode/skill/sk-deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 1
- Started: 2026-04-06T10:00:00Z
- **External constraint:** prefer `cli-codex gpt-5.4-high` for heavy code analysis tasks during iterations (per user directive). Read `.opencode/skill/cli-codex/SKILL.md` for invocation patterns.
- **Hard scope rule:** treat `external/` as read-only. Never modify graphify source.
- **Evidence rule:** every finding must cite specific `external/graphify/` or `external/skills/graphify/` paths (file:line where relevant).

<!-- /ANCHOR:research-boundaries -->
