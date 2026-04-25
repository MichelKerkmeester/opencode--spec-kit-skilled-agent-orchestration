# Deep-Research Iteration Prompt Pack

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 1 of 20
Questions: 0/10 answered | Last focus: none yet
Last 2 ratios: N/A -> N/A | Stuck count: 0
Resource map: resource-map.md not present; skipping coverage gate.
Next focus: Establish architectural baseline for both systems. Read code-graph top-level module layout (`mcp_server/code-graph/`) to map the AST detector → edge-enrichment → persistence → query pipeline. Read skill-advisor top-level module layout (`mcp_server/skill-advisor/`) to map the scorer lanes, freshness state machine, and promotion bundle. Identify the 3 MOST load-bearing files per system and read them in full. Answer RQ-01 at breadth (enumerate current edge types + one known gap) and RQ-03 at breadth (enumerate the four freshness states + invariant claims they make).

Research Topic: Code Graph System + Skill Advisor System refinement — investigate algorithm/correctness, performance, UX, observability, and evolution (RQ-01 through RQ-10 in spec.md)
Iteration: 1 of 20
Focus Area: Establish architectural baseline for both systems (see Next Focus above)
Remaining Key Questions:
- RQ-01: AST Edge Detection Gaps
- RQ-02: Scorer Lane Bias and Confidence Calibration
- RQ-03: Freshness Invariant Correctness
- RQ-04: Promotion Gate Rigor
- RQ-05: Scan Throughput and Incremental Accuracy
- RQ-06: Query Latency and Cache Hit Ratio
- RQ-07: Stale-State Messaging Consistency
- RQ-08: Hook Brief Signal-to-Noise
- RQ-09: Benchmark Coverage Gaps
- RQ-10: Cross-Runtime Parity and Extension Points
Last 3 Iterations Summary: (none — this is iteration 1)

## STATE FILES

All paths are relative to the repo root.

- Config: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/015-code-graph-advisor-refinement/research/015-code-graph-advisor-refinement-pt-01/deep-research-config.json
- State Log: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/015-code-graph-advisor-refinement/research/015-code-graph-advisor-refinement-pt-01/deep-research-state.jsonl
- Strategy: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/015-code-graph-advisor-refinement/research/015-code-graph-advisor-refinement-pt-01/deep-research-strategy.md
- Registry: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/015-code-graph-advisor-refinement/research/015-code-graph-advisor-refinement-pt-01/findings-registry.json
- Write iteration narrative to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/015-code-graph-advisor-refinement/research/015-code-graph-advisor-refinement-pt-01/iterations/iteration-001.md
- Write per-iteration delta file to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/015-code-graph-advisor-refinement/research/015-code-graph-advisor-refinement-pt-01/deltas/iter-001.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 3-5 research actions. Max 12 tool calls total.
- Write ALL findings to files. Do not hold in context.
- The workflow reducer owns strategy machine-owned sections, registry, and dashboard synchronization.
- When emitting the iteration JSONL record, include an optional `graphEvents` array of `{type, id, label, relation?, source?, target?}` objects representing coverage graph nodes and edges discovered this iteration. Omit the field when no graph events are produced.

## OUTPUT CONTRACT

You MUST produce THREE artifacts per iteration:

1. **Iteration narrative markdown** at `iterations/iteration-001.md`. Structure: headings for Focus, Actions Taken, Findings, Questions Answered, Questions Remaining, Next Focus.

2. **Canonical JSONL iteration record** APPENDED to the state log. The record MUST use `"type":"iteration"` EXACTLY. Required schema:

```json
{"type":"iteration","iteration":1,"newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","graphEvents":[/* optional */]}
```

Append via `echo '<single-line-json>' >> <state-log-path>`. Do NOT pretty-print.

3. **Per-iteration delta file** at `deltas/iter-001.jsonl`. This file holds the structured delta stream: one `{"type":"iteration",...}` record plus per-event structured records (finding, invariant, observation, edge, ruled_out) one per JSON line.

All three artifacts are REQUIRED.
