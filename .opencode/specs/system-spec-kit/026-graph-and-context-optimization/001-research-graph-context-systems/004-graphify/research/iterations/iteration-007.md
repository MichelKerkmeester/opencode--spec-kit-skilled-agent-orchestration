# Iteration 7: 71.5x Token Reduction Claim — Credibility Validation

## Focus
Resolve Q11 (how credible is the 71.5x token-reduction claim when cross-checked against `external/worked/karpathy-repos/`, README wording, and benchmark expectations). Read `external/graphify/benchmark.py` end-to-end (already partially done in iter 6 prep), check the actual numbers in `external/worked/karpathy-repos/GRAPH_REPORT.md` and the corpus described in `external/worked/karpathy-repos/README.md`, plus `external/worked/karpathy-repos/review.md` which contains the verbatim benchmark output. Then evaluate whether the 71.5x ratio is mathematically defensible and identify the load-bearing assumptions.

## Findings

1. **The 71.5x claim is mathematically reproducible** from the published numbers using graphify's own benchmark formula. From `karpathy-repos/review.md:11-29`: corpus tokens = 123,488 (calculated from 92,616 words via the `_estimate_tokens` heuristic at `benchmark.py:85`: `corpus_words * 100 // 75`), average query cost = 1,726 tokens, ratio = 123,488 / 1,726 = **71.55x**, rounded to 71.5x. The math checks out exactly. [SOURCE: external/worked/karpathy-repos/review.md:11-29; external/graphify/benchmark.py:85-99]

2. **The 71.5x number ONLY holds for the full multimodal corpus, NOT for code alone.** The same review file documents two distinct ratios at `review.md:13-19`: code-only (29 Python files via AST) gives **8.8x** reduction (corpus 16,997 tokens / avg query 1,929 tokens), full corpus (52 files including 5 papers + 4 images + 14 docs) gives **71.5x**. The 8x difference comes from the fact that adding non-code content scales the naive baseline linearly (~92k vs ~17k words) while the BFS subgraph cost stays roughly constant (~1,700 tokens). Public should NOT cite 71.5x when comparing against code-only retrieval systems. [SOURCE: external/worked/karpathy-repos/review.md:13-29]

3. **The benchmark math has THREE load-bearing assumptions** that make the 71.5x ratio fragile when generalized: (a) **token estimation is a 4-chars-per-token heuristic** at `benchmark.py:9, 12-13` — real Claude tokenization varies by language and can be 2-6x different per token; (b) **the naive baseline is "stuff the whole corpus into context"** which is the worst possible RAG strategy and not what production systems do — a fair baseline would be embedding search or tree-sitter symbol search, both of which would shrink the gap dramatically; (c) **the BFS subgraph approximates "what Claude actually reads"** but a real graph query workflow typically also opens the underlying source files for verified context, which would push effective query cost well above 1,700 tokens. [SOURCE: external/graphify/benchmark.py:9-15, 16-52, 64-99]

4. **The benchmark question set is corpus-aware, which inflates per-question reductions.** `_SAMPLE_QUESTIONS` at `benchmark.py:55-61` is a fixed list of 5 questions: "how does authentication work", "what is the main entry point", "how are errors handled", "what connects the data layer to the api", "what are the core abstractions". `_query_subgraph_tokens` at `benchmark.py:16-52` does keyword matching on node labels (any 3+ char query term that appears in any node label scores +1, top 3 nodes by score become BFS start points). On the karpathy corpus, the actual per-question reductions in `review.md:31-41` are 126.7x ("what connects micrograd to nanoGPT"), 100.8x ("how does FlashAttention improve memory efficiency"), 68.6x, 68.6x, 43.5x — but those are graphify's own RUN-TIME questions, NOT the canned `_SAMPLE_QUESTIONS`. The benchmark.py default questions are generic and would NOT all return matches on most corpora. [SOURCE: external/graphify/benchmark.py:55-61, 16-52; external/worked/karpathy-repos/review.md:31-41]

5. **The "reduction grows as corpus grows" property is real and structurally important.** Per `review.md:29` and the verdict at `review.md:112`: "the BFS subgraph stays roughly constant (~1,700 tokens) while naive stuffing scales linearly with corpus size." This is a true structural property of graph-bounded queries: BFS at depth 3 from a few seed nodes returns O(N) nodes where N is bounded by graph density, NOT by corpus size. So a 500k-word corpus would yield ~71.5x × (500k/92k) ≈ ~388x against the naive baseline. **This is the genuinely valuable insight** — the 71.5x specific number is corpus-specific, but the constant-vs-linear property is a generalizable claim that Public should evaluate against its own use cases. [SOURCE: external/worked/karpathy-repos/review.md:29, 112]

6. **The published worked numbers have small but real discrepancies** that bear on credibility. `karpathy-repos/README.md:5` says "52 files"; `karpathy-repos/review.md:4` confirms 52 files (29 Py + 14 docs + 5 PDFs + 4 images); BUT `karpathy-repos/GRAPH_REPORT.md:4` reports the actual run as **49 files · ~92,616 words**, a 3-file discrepancy. Most likely 3 of the 4 images failed to download or weren't picked up by detect.py's image classification (the README mentions "Any screenshot or diagram from the Attention Is All You Need paper" as a vague 4th image). Similarly `README.md:58` says "~17 meaningful communities" but `GRAPH_REPORT.md:8` reports 53 communities total — `review.md:51, 99` resolves this as 17 major + 36 isolates (single-node communities). Public should treat README claims with the same scrutiny graphify itself encourages: cite the worked output, not the marketing copy. [SOURCE: external/worked/karpathy-repos/README.md:5, 58; external/worked/karpathy-repos/GRAPH_REPORT.md:4, 8; external/worked/karpathy-repos/review.md:4, 51, 99]

7. **The benchmark cost-vs-value calculus is conservative for graphify itself**: only 9,500 tokens were spent BUILDING the graph (6,000 input + 3,500 output, per `GRAPH_REPORT.md:10`). At an average query cost of 1,726 tokens, the build pays for itself after roughly **5.5 queries**. After ~6 queries, the graph saves more tokens than it cost to build — and unlike a naive RAG approach, the savings compound across all future queries. This is the actual headline efficiency claim graphify could make if it weren't optimizing for the dramatic 71.5x number: amortized cost-per-query approaches the BFS subgraph cost asymptotically as query count grows. Public should evaluate this amortization model when sizing graph build costs. [SOURCE: external/worked/karpathy-repos/GRAPH_REPORT.md:10; external/worked/karpathy-repos/review.md:18, 25]

8. **The benchmark is designed for the "first time on a new codebase" scenario, not steady-state usage.** Public's existing Code Graph MCP + CocoIndex are optimized for steady-state queries on a known codebase where the index is already built and the user asks targeted questions. graphify's benchmark is comparing against "I have never seen this corpus before, let me read everything." That comparison is unfair to any indexed retrieval system, including Public's existing tools. A more honest comparison for Public's use case would be: (a) graphify BFS subgraph (1,700 tokens) vs (b) Code Graph MCP `code_graph_query` result (typically 200-2,000 tokens for callers/imports/deps queries) vs (c) CocoIndex semantic search top-K (typically 1,000-3,000 tokens for K=5). The reductions would be in the 1-3x range, not 71x. [INFERENCE: based on graphify benchmark methodology + Public's existing tool surface from prior memory context]

9. **The 8.8x code-only number is more relevant to Public** because Public is primarily a code-and-spec environment, not a multimodal research corpus. At 8.8x (review.md:19), graphify's AST-only mode reduces tokens by an order of magnitude vs naive code stuffing — but Public's Code Graph MCP achieves a similar order-of-magnitude reduction via structural queries today. The marginal value of graphify's AST pass over Code Graph MCP on a code-only corpus is therefore ~zero. The marginal value comes from (a) the multimodal extension for non-code content and (b) the evidence-tagging system for provenance — both of which are orthogonal to token reduction. [SOURCE: external/worked/karpathy-repos/review.md:13-19; INFERENCE]

10. **The benchmark code itself is honest about edge cases** — it returns `{"error": "No matching nodes found for sample questions. Build the graph first."}` at `benchmark.py:94-95` if none of the sample questions match any node labels. This means on a corpus with no "auth", "entry", "error", "data", "api", or "abstraction" terms in any node label, the benchmark refuses to produce a number rather than reporting 0x or infinity. This is graphify-internal hygiene that Public should preserve when adapting any benchmarking pattern: refuse to report a metric you can't trust. [SOURCE: external/graphify/benchmark.py:94-95]

11. **The graph-quality evaluation in `review.md:84-107` is more credible than the token reduction claim.** Specific verifiable findings: (a) micrograd correctly split into engine + nn communities matching the repo structure (review.md:88), (b) nanoGPT model vs training correctly separated into different communities (review.md:89), (c) BPETokenizer correctly isolated as standalone (review.md:90), (d) cross-repo `Block` similarity surfaced between nanoGPT and minGPT (review.md:91), (e) FlashAttention paper bridged into `CausalSelfAttention` in both repos (review.md:92), (f) image extraction worked: `gpt2_124M_loss.png` extracted as "val_loss=2.905 at step 399", `gout.svg` recognized as micrograd computation graph (review.md:93). These are concrete, verifiable claims that can be checked against the actual graph.json. They are graphify's strongest evidence — and they don't depend on the 71.5x number at all. [SOURCE: external/worked/karpathy-repos/review.md:84-107]

12. **Even graphify's own review acknowledges weaknesses**: "53 communities when 17 are real and 36 are isolates... visualization is noisy"; "Stdlib imports create 94 validation warnings"; "Papers not deep-linked to implementation" without `--mode deep`; config-only files become single-node communities. This honesty is itself a credibility signal — graphify documents its failure modes in the same file as its headline numbers. Public should treat this as the baseline standard for any benchmark claim it makes about its own retrieval systems: publish the failures in the same document as the reductions. [SOURCE: external/worked/karpathy-repos/review.md:95-101, 116]

## Verdict on Q11

**The 71.5x claim is mathematically reproducible from graphify's published numbers but rests on three load-bearing assumptions that limit its generalizability:**

1. **Naive baseline is full-corpus stuffing** — fair vs unindexed RAG, unfair vs Code Graph MCP / CocoIndex / any production retrieval system.
2. **Token estimation is a 4-chars-per-token heuristic** — real tokenization varies, especially across languages.
3. **BFS subgraph approximates query cost** — but real workflows often re-read source files for verification, inflating effective cost.

**For Public's use case, the realistic expected reduction is:**
- Code-only AST corpus: ~8.8x (vs naive); ~1-3x (vs Code Graph MCP / CocoIndex)
- Multimodal corpus with papers + images: scales with corpus size, structurally bounded by BFS subgraph cost (~1,700 tokens regardless of corpus size)
- The "constant-vs-linear" property is the genuinely valuable insight, NOT the specific 71.5x number

**The graph-quality findings (review.md:84-107) are more credible than the token reduction claim and would be the stronger basis for adoption decisions:** correct community separation, cross-repo similarity discovery, paper→code bridging, image semantic interpretation.

## Benchmark Math (verified end-to-end)

```
Step 1: Corpus token estimation (benchmark.py:85)
  corpus_tokens = corpus_words * 100 // 75
  92,616 * 100 // 75 = 123,488 tokens   ✓ matches review.md:5

Step 2: BFS subgraph estimation (benchmark.py:16-52)
  For each sample question:
    1. Tokenize question into terms (≥3 chars)
    2. Score nodes by label-term hits
    3. BFS depth 3 from top 3 scoring nodes
    4. Format visited nodes + edges as text
    5. _estimate_tokens(text) = max(1, len(text) // 4)
  Average across 5 successful questions
  → ~1,726 tokens per query  ✓ matches review.md:18-25

Step 3: Reduction ratio (benchmark.py:98)
  reduction = corpus_tokens / avg_query_tokens
  123,488 / 1,726 = 71.55x   ✓ matches headline

Step 4: Display (benchmark.py:111-126)
  print "{reduction}x fewer tokens per query"
  print per-question breakdown
```

## Reproducibility Test (per Public's use case)

| Public Corpus Type | Expected Naive Tokens | Expected Avg Query Tokens | Expected Reduction |
|---|---|---|---|
| Code-only OpenCode source (~50k LOC) | ~67,000 | ~1,800 | ~37x vs naive, ~2x vs Code Graph MCP |
| Spec folder (~30k words across 200 files) | ~40,000 | ~1,500 | ~27x vs naive |
| Mixed code + 10 PDFs + 20 images | ~120,000 | ~1,800 | ~67x vs naive (close to 71.5x) |
| Code + extensive Notion docs | ~200,000 | ~2,000 | ~100x vs naive |

**Note: all these numbers compare against the same unrealistic naive baseline. The fair comparison vs Public's existing tools is in the 1-3x range, not 30-100x.**

## Ruled Out

- **Hoping the 71.5x is reproducible across arbitrary corpora**: it's not. The number is corpus-specific (depends on corpus size, graph density, and question-corpus match). Public should not cite 71.5x when describing graphify externally.

- **Hoping the benchmark uses real Claude tokenization**: it doesn't. Pure character-count heuristic. Real tokenization could shift numbers by ±50%.

- **Hoping the benchmark compares against graph-aware baselines**: it doesn't. Only naive full-corpus stuffing. The reduction vs Code Graph MCP or vector search is not measured.

## Dead Ends

- **Looking for a tunable benchmark with custom baselines**: not present. `run_benchmark()` accepts custom `questions` and `corpus_words`, but the baseline calculation (`words * 100 // 75`) is hardcoded and the BFS depth (3) is hardcoded. Public would need to fork `benchmark.py` to compare against alternative baselines.

- **Looking for Claude-actual token counts in any worked example**: not present. graphify never calls `count_tokens` from any LLM API. All numbers are heuristic estimates.

## Sources Consulted

- `external/graphify/benchmark.py:1-126` (full read)
- `external/worked/karpathy-repos/README.md:1-63` (full read)
- `external/worked/karpathy-repos/GRAPH_REPORT.md:1-120` (head section for Summary, Communities, God Nodes)
- `external/worked/karpathy-repos/review.md:1-116` (full read — the verbatim benchmark output + graph quality evaluation)

## Assessment

- **New information ratio:** 0.92 (11 of 12 findings net-new beyond prior iterations; finding 1's math validation is the central credibility signal)
- **Questions addressed:** Q11
- **Questions answered (fully):** Q11 (71.5x credibility validated mathematically, three load-bearing assumptions documented, code-only vs multimodal split clarified, Public-specific expected ratios estimated)
- **Questions partially advanced:** Q12 (synthesis Adopt/Adapt/Reject — preliminary signals from this iteration: graph-quality findings are stronger evidence than token-reduction claim)

## Reflection

- **What worked:** Reading `review.md` (the worked example's verbatim benchmark output) BEFORE re-analyzing `benchmark.py` exposed the 8.8x vs 71.5x split immediately, which I would have missed if I had only worked from the source code. The worked examples are graphify's own honesty checkpoint and should be the first stop for any credibility question.
- **What did not work:** The README and review.md disagree on file count (52 vs 49 in the actual run). Without the GRAPH_REPORT.md to triangulate, I would have trusted README. Cross-referencing three documents was necessary to find the discrepancy.
- **What I would do differently next iteration:** Synthesis (iter 8) should weight the graph-quality findings more heavily than the token-reduction claim when constructing Adopt/Adapt/Reject recommendations. The 71.5x is a hook; the cross-repo similarity discovery and image semantic interpretation are the actual value drivers.

## Convergence Signal

After this iteration, **11 of 12 questions are fully answered**. The only remaining question is Q12 (Adopt/Adapt/Reject for Public), which IS the synthesis phase output, not a research question. Coverage is 11/12 = 0.917, which exceeds the convergence threshold of 0.85. The next iteration should be **synthesis**, not another research pass.

## Recommended Next Focus

**TRANSITION TO SYNTHESIS.** Iteration 8 should compile `research/research.md` with the following structure:
1. Executive summary with the 71.5x credibility verdict (do not lead with 71.5x)
2. Pipeline architecture (from iter 1)
3. AST extraction details (from iter 2)
4. Semantic + merge + cache (from iter 3)
5. Clustering + analysis + report (from iter 4)
6. Hooks + cache invalidation (from iter 5)
7. Multimodal pipeline (from iter 6)
8. Benchmark credibility (from iter 7)
9. **Comparison vs Public's Code Graph MCP and CocoIndex** (synthesis — depth analysis required)
10. **Adopt/Adapt/Reject recommendations** (synthesis — Q12 answer)
11. Evidence-grounded conclusion with specific file:line citations preserved from all 7 iterations

The synthesis must produce the 5+ findings the prompt requires, all with file:line citations, and explicitly avoid duplicating findings already covered for codesight (002) or contextador (003).
