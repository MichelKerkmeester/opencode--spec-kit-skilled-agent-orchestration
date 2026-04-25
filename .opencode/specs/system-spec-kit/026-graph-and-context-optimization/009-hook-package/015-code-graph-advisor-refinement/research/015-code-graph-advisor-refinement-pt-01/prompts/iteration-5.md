# Deep-Research Iteration 5 of 20 — cli-codex executor

You are the @deep-research LEAF agent executing ONE iteration. Do NOT dispatch sub-agents. Write ALL findings to files. Target 3–5 research actions, max 12 tool calls.

## STATE

Iteration: 5 of 20 | Questions: 6/10 resolved (RQ-01, RQ-03, RQ-04, RQ-07, RQ-08, RQ-10) | Stuck count: 0
Last 4 ratios: 0.88 → 0.86 → 0.84 → 0.85 | Trend: high-stable, productive

**Next focus (iter 5):** RQ-05 (scan throughput & incremental accuracy) + RQ-06 groundwork (query latency & cache hit ratio).

1. **RQ-05 close:** Read and analyze:
   - `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts` — scan driver
   - `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/tree-sitter-parser.ts` — per-file AST parse
   - `.opencode/skill/system-spec-kit/mcp_server/code-graph/bench/` or any benchmark harness — if present, what does it measure?
   - `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts` — persistence layer, incremental accuracy (mtime vs content-hash)
   Quantify: throughput ceiling per language (if measurable or inferable), incremental-skip correctness (mtime false-negatives: does a file with unchanged mtime but changed content get skipped?), worst-case per-file parse time.

2. **RQ-06 groundwork:** Grep for query latency measurement in `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/code-graph-query.ts` + `lib/code-graph-query.ts` + any cache layer. Catalog cache-keying strategy (is it workspaceRoot + sourceSignature only, or does it include query shape?). Identify where near-duplicate prompts would miss.

## STATE FILES (absolute paths)

Spec folder root: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/015-code-graph-advisor-refinement`

Artifact dir: `<spec-folder>/research/015-code-graph-advisor-refinement-pt-01`

- Config: `<artifact-dir>/deep-research-config.json`
- State Log: `<artifact-dir>/deep-research-state.jsonl`
- Strategy: `<artifact-dir>/deep-research-strategy.md`
- Registry: `<artifact-dir>/findings-registry.json`
- Prior narratives (READ iter-004 FIRST for continuity): `<artifact-dir>/iterations/iteration-001.md` through `iteration-004.md`
- **Write iteration narrative to:** `<artifact-dir>/iterations/iteration-005.md`
- **Write delta file to:** `<artifact-dir>/deltas/iter-005.jsonl`
- **Append JSONL iteration record to:** `<artifact-dir>/deep-research-state.jsonl`

## OUTPUT CONTRACT

You MUST produce THREE artifacts per iteration:

1. **Iteration narrative** at `iterations/iteration-005.md` with headings: Focus, Actions Taken, Findings, Questions Answered, Questions Remaining, Next Focus. Cite file paths + line numbers for every finding.

2. **JSONL iteration record** appended to state log. The record MUST use `"type":"iteration"` EXACTLY. Schema:
   ```json
   {"type":"iteration","iteration":5,"newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","graphEvents":[/* optional */]}
   ```
   Append via: `echo '<single-line-json>' >> <state-log-path>`. Do NOT pretty-print.

3. **Delta file** at `deltas/iter-005.jsonl`. One `{"type":"iteration",...}` record (same content as state-log append) plus per-event records (finding, invariant, observation, edge, ruled_out, resolved) one per JSON line.

If you resolve RQ-05 or RQ-06 at depth, emit `{"type":"resolved","questionId":"question-5-rq-05-..." or "question-6-rq-06-...","iteration":5,...}` delta records. Reference exact question IDs from registry `openQuestions[]`.

Target newInfoRatio 0.5+. Trend so far 0.84–0.88 high-stable — maintain productive research.

Start now.
