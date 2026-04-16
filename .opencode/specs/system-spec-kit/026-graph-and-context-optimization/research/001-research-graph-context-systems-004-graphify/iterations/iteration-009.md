# Iteration 9: Build Orchestration + Manifest + Mixed-Corpus Cross-Validation

## Focus
This iteration closes the orchestration gap left after the earlier pipeline-focused passes by tracing how graphify actually saves rebuild state, merges partial results, and decides whether an incremental run can skip semantic extraction. That matters for Public because Code Graph MCP plus CocoIndex needs a testable, multimodal-aware incremental indexing story, not just a good extractor or benchmark headline.

## Findings
1. **`manifest.py` is only a backwards-compatibility facade, not an orchestration module.** [SOURCE: external/graphify/manifest.py:1-4; external/graphify/detect.py:216-244]
   The file exports `save_manifest`, `load_manifest`, and `detect_incremental` directly from `detect.py`, and contains no independent schema, storage logic, or update policy of its own. That means the real rebuild contract lives entirely in `detect.py`, while `manifest.py` exists only to preserve old import paths. For Public: Adapted. Keep a compatibility shim only if we need to preserve imports during a surface migration; otherwise keep the state contract in one module. EXTRACTED.

2. **Graphify's incremental rebuild key is a flat mtime manifest across all detected files, not a content hash or graph diff.** [SOURCE: external/graphify/detect.py:224-274]
   `save_manifest()` records `Path(f).stat().st_mtime` for every detected file, and `detect_incremental()` later re-runs full detection, then classifies files as `new_files` or `unchanged_files` by comparing current mtimes to the stored manifest. There is no checksum, per-node invalidation, or deletion tombstone layer in this path. For Public: Adapted. The "cheap first-pass manifest" pattern is useful, but it should be upgraded to content hashing plus explicit deletion handling before it becomes the primary incremental contract. EXTRACTED.

3. **The manifest is only written after the full run finishes, so `--update` anchors to successful end-to-end completion rather than intermediate extraction state.** [SOURCE: external/skills/graphify/skill.md:588-626]
   Step 9 saves the manifest only after report generation, cost tracking, and cleanup, which means a failed run before this stage leaves no new incremental baseline behind. That is operationally simple and avoids caching partial state, but it also means long runs pay the full cost again after late-stage failure. For Public: Adapted. Preserve the "commit rebuild state only after success" rule, but split durable state into smaller checkpoints so a late reporting failure does not invalidate a valid index build. EXTRACTED.

4. **The semantic merge path deduplicates nodes by `id` but appends edges blindly, so incremental reuse is node-stable but edge-unstable.** [SOURCE: external/skills/graphify/skill.md:257-285]
   Cached semantic nodes and newly extracted semantic nodes are concatenated, then deduped only on node id; edges are concatenated without a comparable identity check. This keeps the merge logic tiny, but repeated or superseded relationships can accumulate unless upstream extraction is perfectly stable. For Public: Adapted. Reuse the node-id dedupe idea, but give edges a deterministic identity so incremental graph merges can replace or prune them instead of only appending. EXTRACTED.

5. **The final AST-plus-semantic merge follows the same pattern: node dedupe, edge concatenation, and semantic-only token accounting.** [SOURCE: external/skills/graphify/skill.md:289-317; external/graphify/build.py:34-42]
   Graphify merges AST nodes first, adds semantic nodes only when their ids are new, concatenates AST and semantic edges, and carries token counts from the semantic side into the merged extraction. That keeps the final extraction format simple, but it also means the merge step does not reconcile duplicate edges or represent token cost as a modality-broken-down rebuild ledger. For Public: Adapted. Public should keep the simple multimodal envelope, but include per-modality counters and edge replacement semantics so incremental rebuilds stay auditable. EXTRACTED.

6. **`build.py` is intentionally tiny and should be read as a graph assembler, not a build orchestrator.** [SOURCE: external/graphify/build.py:8-31]
   Its responsibilities are limited to validating extraction output, dropping dangling edges to missing external nodes, preserving original direction via `_src` and `_tgt` attributes, and carrying through any `hyperedges`. All orchestration, caching, manifest writes, and output generation live outside this module. For Public: Adopted. Keeping graph assembly thin is the right boundary; orchestration logic should stay in dedicated services or handlers instead of leaking into the graph builder. EXTRACTED.

7. **Graphify's update flow is modality-aware: it explicitly short-circuits semantic extraction when all changed files are code.** [SOURCE: external/skills/graphify/skill.md:666-705]
   The `--update` path computes `code_only` by checking extensions on changed files and instructs the runner to execute only AST extraction when everything modified is code, while falling back to the full AST-plus-semantic pipeline if any doc, paper, or image changed. This is the clearest orchestration pattern Public can borrow from graphify: incremental policy is based on modality, not only "something changed." For Public: Adopted. Code Graph MCP should do the same kind of modality gate, with CocoIndex or semantic passes invoked only when changed artifacts actually require them. EXTRACTED.

8. **The checked-in `mixed-corpus` artifact does not validate graphify's multimodal claim as shipped; it captures a 4-file, zero-token, code-only result even though the README and live review describe a 5-file mixed-input run.** [SOURCE: external/worked/mixed-corpus/README.md:3-5; external/worked/mixed-corpus/README.md:19-21; external/worked/mixed-corpus/GRAPH_REPORT.md:3-10; external/worked/mixed-corpus/review.md:3-6; external/worked/mixed-corpus/review.md:96-122]
   The README says the benchmark is meant to include Python, markdown, and one image, and the review documents a live 5-file run with image OCR findings, but the checked-in `GRAPH_REPORT.md` reports only 4 files and zero input/output tokens. That means the repository artifact proves the orchestration on a tiny code-only subset, not the full multimodal scenario described in prose. For Public: Adopted as a cautionary process rule. Every worked corpus should ship a machine-readable run manifest that records the exact files and modalities actually present in the published artifact. EXTRACTED.

9. **The shipped `mixed-corpus` graph still proves graphify can cluster a small code corpus cleanly, but its question-generation surface shifts toward "verify inferred edges" rather than multimodal synthesis.** [SOURCE: external/worked/mixed-corpus/GRAPH_REPORT.md:7-10; external/worked/mixed-corpus/GRAPH_REPORT.md:24-29; external/worked/mixed-corpus/GRAPH_REPORT.md:52-68; external/worked/mixed-corpus/review.md:128-138]
   The report shows 22 nodes, 38 edges, and five communities, but the "Suggested Questions" section is dominated by prompts asking whether inferred edges are correct, which fits a small AST-heavy graph with limited cross-modal evidence. That is a useful reminder that question generation quality depends on corpus richness and not only on graph size. For Public: Adapted. Public should suppress or re-rank "verify inferred edges" prompts when the graph is tiny or multimodal coverage is absent, so exploratory questions stay higher signal. EXTRACTED.

10. **Cross-corpus, graphify's multimodal claim holds on `karpathy-repos` but not on the published `mixed-corpus` artifact, so the orchestration pattern is credible while the smaller worked example is packaging-incomplete.** [SOURCE: external/worked/karpathy-repos/README.md:56-62; external/worked/karpathy-repos/GRAPH_REPORT.md:7-10; external/worked/karpathy-repos/review.md:49-52; external/worked/karpathy-repos/review.md:88-94; external/worked/karpathy-repos/review.md:112-116; external/worked/mixed-corpus/GRAPH_REPORT.md:3-10]
   `karpathy-repos` shows non-zero token spend, a mixed AST/semantic graph, explicit paper and image findings, and a realistic large-corpus payoff, while the checked-in `mixed-corpus` report shows a smaller, code-only result. The important new conclusion is not that graphify's multimodal design is false, but that its worked-corpus packaging does not consistently preserve executed reality across examples. For Public: Adopted as a release discipline. Benchmarks and worked corpora should always publish the exact executed corpus manifest, modality counts, and token ledger alongside the graph outputs. INFERRED.

## Cross-Corpus Validation
| Aspect | karpathy-repos | mixed-corpus | What this means for Public |
| --- | --- | --- | --- |
| Checked-in corpus summary | 49 files, ~92,616 words, 6,000 input / 3,500 output tokens [SOURCE: external/worked/karpathy-repos/GRAPH_REPORT.md:3-10] | 4 files, ~2,500 words, 0 input / 0 output tokens [SOURCE: external/worked/mixed-corpus/GRAPH_REPORT.md:3-10] | Public needs run metadata baked into artifacts, not just narrative benchmark claims. |
| Multimodal evidence in shipped artifacts | Review explicitly documents paper and image extraction success [SOURCE: external/worked/karpathy-repos/review.md:88-94] | Review describes paper + image, but shipped report does not show them [SOURCE: external/worked/mixed-corpus/review.md:96-122; external/worked/mixed-corpus/GRAPH_REPORT.md:30-50] | Require corpus manifests and modality counts in output folders. |
| Community shape | 53 communities with 17 major + many isolates on a large mixed corpus [SOURCE: external/worked/karpathy-repos/review.md:49-52; external/worked/karpathy-repos/review.md:95-100] | 5 compact communities centered on `analyze.py`, `cluster.py`, and `build.py` [SOURCE: external/worked/mixed-corpus/GRAPH_REPORT.md:30-50] | Large-corpus graph UX needs isolate handling; tiny-corpus UX needs question-quality guards. |
| Extraction mix | 81% EXTRACTED / 19% INFERRED [SOURCE: external/worked/karpathy-repos/GRAPH_REPORT.md:7-10] | 50% EXTRACTED / 50% INFERRED [SOURCE: external/worked/mixed-corpus/GRAPH_REPORT.md:7-10] | Smaller graphs need stronger inferred-edge skepticism and better verification prompts. |
| Benchmark credibility | Large-corpus payoff is evidenced in both README and review [SOURCE: external/worked/karpathy-repos/README.md:56-62; external/worked/karpathy-repos/review.md:11-29] | Small-corpus example is only partially evidenced in the checked-in outputs [SOURCE: external/worked/mixed-corpus/README.md:37-45; external/worked/mixed-corpus/GRAPH_REPORT.md:3-10] | Public should treat worked corpora as auditable fixtures, not just marketing examples. |

## Exhausted / Ruled-Out Directions
- I looked for a standalone manifest implementation layer and did not find one; `manifest.py` only re-exports helpers from `detect.py`. [SOURCE: external/graphify/manifest.py:1-4]
- I looked for orchestration, caching, or manifest writes inside `build.py` and did not find them; the file only validates extraction input and assembles the graph object. [SOURCE: external/graphify/build.py:8-42]
- I looked for checked-in multimodal nodes in the published `mixed-corpus` report and did not find them; the communities list only code symbols from `analyze.py`, `cluster.py`, and `build.py`. [SOURCE: external/worked/mixed-corpus/GRAPH_REPORT.md:12-50]
- I looked for content-hash invalidation or deletion tombstones in incremental detection and did not find them; the update path only compares current mtimes against the saved manifest and separates files into `new_files` vs `unchanged_files`. [SOURCE: external/graphify/detect.py:237-274]

## Verdict on Build Orchestration
Graphify's most reusable orchestration idea is not the inline shell choreography itself, but the policy split underneath it: save a cheap manifest of known files, run a fast incremental detector, and branch the rebuild plan by modality so code-only changes avoid semantic cost. Public's Code Graph MCP plus CocoIndex should adopt that policy layer, because it directly matches the problem of keeping structural indexing fast while only invoking semantic passes when changed docs, papers, images, or other non-code assets actually require them.

What Public should not copy is the implementation shape. Graphify expresses major orchestration steps as long `python3 -c` fragments in `skill.md`, uses append-heavy merge logic for edges, and relies on end-of-run manifest commits plus manual community labeling. Public should adapt the orchestration into testable modules or MCP handlers, add stable edge identities and deletion-aware invalidation, and persist an executed corpus manifest plus token ledger with every build artifact so worked examples remain auditably true to what ran.

## Tools Used
- `mcp__spec_kit_memory__memory_match_triggers` (attempted; unavailable in this session)
- `exec_command` running `python3 .opencode/skill/scripts/skill_advisor.py`
- `exec_command` running `sed`, `nl`, `rg`, `ls`, and `find` for read-only evidence collection
- `apply_patch`

## Sources Queried
- `external/graphify/manifest.py:1-4`
- `external/graphify/build.py:1-42`
- `external/graphify/detect.py:216-274`
- `external/skills/graphify/skill.md:236-400`
- `external/skills/graphify/skill.md:588-705`
- `external/worked/mixed-corpus/README.md:1-45`
- `external/worked/mixed-corpus/GRAPH_REPORT.md:1-68`
- `external/worked/mixed-corpus/review.md:1-176`
- `external/worked/karpathy-repos/README.md:1-63`
- `external/worked/karpathy-repos/GRAPH_REPORT.md:1-116`
- `external/worked/karpathy-repos/review.md:1-116`
