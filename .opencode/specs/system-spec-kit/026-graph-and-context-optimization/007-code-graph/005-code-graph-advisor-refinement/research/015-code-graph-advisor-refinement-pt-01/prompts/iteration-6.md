# Deep-Research Iteration 6 of 20 — cli-codex executor

You are the @deep-research LEAF agent. Do NOT dispatch sub-agents. Write ALL findings to files. Target 3–5 research actions, max 12 tool calls.

## STATE

Iteration: 6 of 20 | Questions: 7/10 resolved (RQ-01, RQ-03, RQ-04, RQ-05, RQ-07, RQ-08, RQ-10) | Stuck count: 0
Last 5 ratios: 0.88 → 0.86 → 0.84 → 0.85 → 0.74 | Trend: productive but tapering

**Next focus (iter 6):** RQ-06 close + RQ-02 groundwork.

1. **RQ-06 close:** Iter 5 found no query-result cache, no P50/P95/P99 telemetry. Verify + close definitively:
   - Grep the code-graph handlers + lib for any `performance.now`, `process.hrtime`, `console.time`, `Date.now` timing instrumentation
   - Read `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/` for any latency assertions
   - Check `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/prompt-cache.ts` — this is the advisor cache (keyed on workspaceRoot + sourceSignature + generation per INV-F5); what is its hit/miss instrumentation? How does it report cache hit ratio?
   Conclude RQ-06 with: what latency/cache telemetry EXISTS today vs what's missing, plus concrete recommendations for instrumentation (counters, timers, histograms).

2. **RQ-02 groundwork:** Read `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/fusion.ts` and `lib/scorer/weights-config.ts` in full. Enumerate the 5 lanes + weights. Iter 1/3 noted semantic lane is shadow-only (weight 0.00) and graph_causal is derivative. Quantify effective lane diversity. Identify whether benchmark harness at `.../bench/` has lane-ablation tests.

## STATE FILES

Spec folder: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/015-code-graph-advisor-refinement`
Artifact dir: `<spec-folder>/research/015-code-graph-advisor-refinement-pt-01`

- Config / State Log / Strategy / Registry: `<artifact-dir>/*`
- Prior narratives (SKIM iter-005 for continuity): `<artifact-dir>/iterations/iteration-001.md` through `iteration-005.md`
- **Write iteration narrative to:** `<artifact-dir>/iterations/iteration-006.md`
- **Write delta file to:** `<artifact-dir>/deltas/iter-006.jsonl`
- **Append JSONL iteration record to:** `<artifact-dir>/deep-research-state.jsonl`

## OUTPUT CONTRACT

Three artifacts required:

1. **Iteration narrative** at `iterations/iteration-006.md` with headings: Focus, Actions Taken, Findings, Questions Answered, Questions Remaining, Next Focus. Cite file paths + line numbers for every finding.

2. **JSONL iteration record** appended to state log via `echo '<single-line-json>' >> <state-log-path>`. MUST use `"type":"iteration"` EXACTLY. Schema:
   ```json
   {"type":"iteration","iteration":6,"newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","graphEvents":[/* optional, prefer nodes/edges schema if emitted */]}
   ```

3. **Delta file** at `deltas/iter-006.jsonl`. One iteration record + per-event records (finding, invariant, observation, edge, ruled_out, resolved), one per JSON line.

If you resolve RQ-06 or RQ-02, emit `{"type":"resolved","questionId":"question-6-rq-06-..." or "question-2-rq-02-...","iteration":6,...}` delta records.

Target newInfoRatio 0.4+. Trend tapered to 0.74 — expect some continued decline as remaining questions are measurement-heavy.

Start now.
