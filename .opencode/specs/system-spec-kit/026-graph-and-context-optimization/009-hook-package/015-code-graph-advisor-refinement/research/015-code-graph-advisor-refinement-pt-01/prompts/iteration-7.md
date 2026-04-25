# Deep-Research Iteration 7 of 20 — cli-codex executor

You are the @deep-research LEAF agent. Do NOT dispatch sub-agents. Max 12 tool calls.

## STATE

Iteration: 7 of 20 | Questions: 8/10 resolved | Stuck count: 0
Ratios: 0.88 → 0.86 → 0.84 → 0.85 → 0.74 → 0.62

**Next focus (iter 7):** RQ-02 depth + RQ-09 close.

1. **RQ-02 depth:** Run the actual lane-ablation harness if runnable. Try:
   - `cd .opencode/skill/system-spec-kit/mcp_server/skill-advisor/bench && ls -1` to see runnable benches
   - If there's a CLI, run `node <bench-entry>` or `npm run bench:scorer` from the repo root — capture baseline accuracy vs per-lane ablation deltas
   - If tests exist in `.../tests/parity/`, run vitest on the existing single-lane assertion (lexical only) and report observed accuracy deltas
   - If nothing runs end-to-end, read `lib/scorer/ablation.ts:54-74` + `bench/scorer-bench.ts:42-61` and SYNTHESIZE what the bias picture would look like if a fuller ablation were run — which lane is MOST likely systematically biased based on code structure?
   Decide whether RQ-02 can be resolved from source + static analysis, or requires deferred empirical work.

2. **RQ-09 close:** Synthesize a comprehensive benchmark coverage gap report combining iters 1–6:
   - Missing per-edge-type precision/recall benchmark (iter 1 F3/iter 2)
   - Missing full lane-ablation assertion coverage (iter 6 F32) — only `lexical` asserted, 4 other lanes unbenchmarked
   - Missing query-latency percentile instrumentation (iter 6)
   - Missing concurrent freshness-state invariant test (iter 2/3)
   - Missing settings-driven hook invocation parity test (iter 4 F25)
   - Missing promotion-cycle oscillation/correlation regression test (iter 3 F15 Cat B)
   List each as a concrete benchmark suite (name, scope, pass criteria, estimated effort S/M/L).

## STATE FILES

Spec folder: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/015-code-graph-advisor-refinement`
Artifact dir: `<spec-folder>/research/015-code-graph-advisor-refinement-pt-01`

- Prior narratives (SKIM iter-006 + iter-005 for continuity): `<artifact-dir>/iterations/iteration-00{1-6}.md`
- **Write iteration narrative to:** `<artifact-dir>/iterations/iteration-007.md`
- **Write delta file to:** `<artifact-dir>/deltas/iter-007.jsonl`
- **Append JSONL iteration record to:** `<artifact-dir>/deep-research-state.jsonl`

## OUTPUT CONTRACT

Three artifacts (narrative md, state-log append with `"type":"iteration"` schema, delta jsonl). If you resolve RQ-02 or RQ-09, emit `{"type":"resolved","questionId":"question-2-rq-02-..." or "question-9-rq-09-...","iteration":7,...}` delta records.

Target newInfoRatio 0.4+ (expect continued tapering as questions close). Start now.
