# Deep-Research Iteration Prompt Pack

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 1 of 10
Questions: 0/8 answered | Last focus: none yet
Last 2 ratios: N/A -> N/A | Stuck count: 0
Resource map: resource-map.md not present; skipping coverage gate.
Next focus: Investigate Q1 phantom fix root cause. Check 005 implementation-summary for what was claimed landed, then probe the running MCP daemon to confirm pre-fix vs post-fix behavior. Identify whether dist/ was rebuilt and whether daemon was restarted. Document the canonical fix-and-verify protocol.

Research Topic: MCP runtime improvement research investigating root causes for memory layer, code graph, cocoindex, and intent classifier defects from 005 + 006 findings

Iteration: 1 of 10
Focus Area: Q1 — Phantom fix root cause for 005 P0 Clusters 1, 2, 3

Remaining Key Questions:
- [ ] Q1: Why are 005 P0 fixes (Cluster 1, 2, 3) not active in the running daemon? Source patches were claimed as landed but live MCP probes show pre-fix behavior. Is this a missing dist rebuild, daemon restart, or both? What is the canonical fix-and-verify protocol going forward?
- [ ] Q2: How to fix cocoindex mirror-folder duplicates (005 REQ-018)?
- [ ] Q3: How to fix cocoindex source-vs-markdown ranking imbalance (005 REQ-019)?
- [ ] Q4: How to harden against the model-side hallucination class on weak retrieval (006 I2)?
- [ ] Q5: Why does memory_context wrapper truncate to count:0 at 2 percent budget (005 REQ-002)?
- [ ] Q6: How to recover from empty code-graph (005 REQ-017)?
- [ ] Q7: How to address lopsided causal-graph edge growth (005 REQ-010)?
- [ ] Q8: Intent classifier improvements beyond Cluster 2 fix (005 REQ-001/004/016)?

Last 3 Iterations Summary: (none yet — first iteration)

## STATE FILES

All paths are relative to the repo root.

- Config: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/007-mcp-runtime-improvement-research/research/007-mcp-runtime-improvement-research-pt-01/deep-research-config.json
- State Log: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/007-mcp-runtime-improvement-research/research/007-mcp-runtime-improvement-research-pt-01/deep-research-state.jsonl
- Strategy: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/007-mcp-runtime-improvement-research/research/007-mcp-runtime-improvement-research-pt-01/deep-research-strategy.md
- Registry: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/007-mcp-runtime-improvement-research/research/007-mcp-runtime-improvement-research-pt-01/findings-registry.json
- Write iteration narrative to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/007-mcp-runtime-improvement-research/research/007-mcp-runtime-improvement-research-pt-01/iterations/iteration-001.md
- Write per-iteration delta file to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/007-mcp-runtime-improvement-research/research/007-mcp-runtime-improvement-research-pt-01/deltas/iter-001.jsonl

## CONSTRAINTS

- You are a LEAF research agent. Do NOT dispatch sub-agents.
- Target 3-5 research actions. Max 12 tool calls total.
- Write ALL findings to files. Do not hold in context.
- This is iteration 1 of 10. Focus narrowly on Q1.

## CONTEXT

Sibling packets you can read for ground truth:
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/005-memory-search-runtime-bugs/spec.md (17 defects catalogued, REQ-001..017)
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/005-memory-search-runtime-bugs/implementation-summary.md (claims about what was fixed for Clusters 1-3)
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/005-memory-search-runtime-bugs/decision-record.md (if present)

MCP source code locations:
- .opencode/skill/system-spec-kit/mcp_server/lib/ (TypeScript source)
- .opencode/skill/system-spec-kit/mcp_server/dist/ (compiled output the daemon serves)
- .opencode/skill/system-spec-kit/mcp_server/package.json (build scripts)
- ~/.opencode/mcp.log or similar daemon log path (if discoverable)

## TASK FOR THIS ITERATION

Investigate Q1 with the following sub-steps:

1. Read 005 implementation-summary.md and (if present) decision-record.md to identify exactly which Cluster 1, 2, 3 fixes were claimed landed. Capture the file paths of source patches and the claimed acceptance evidence.

2. For each claimed fix, verify whether the corresponding compiled code in mcp_server/dist/ matches the source. Use `diff` or content comparison; check timestamps with `stat`.

3. If dist/ is older than src/, that is direct evidence of a missing rebuild. Document which files have stale dist/.

4. Identify how the MCP daemon is started and how to restart it. Look in .opencode/skill/system-spec-kit/mcp_server/package.json scripts, opencode.json mcp section, and any process management tooling.

5. Document the canonical "fix-and-verify" protocol that should be enforced going forward (rebuild + restart + live probe + recorded evidence) so this phantom-fix class cannot recur.

## OUTPUT CONTRACT

You MUST produce THREE artifacts:

1. **Iteration narrative markdown** at the path noted above (`iterations/iteration-001.md`). Structure: Focus, Actions Taken, Findings (with evidence), Questions Answered (Q1 root cause + remediation + verification probe), Questions Remaining, Next Focus (Q2 cocoindex mirror duplicates).

2. **Canonical JSONL iteration record** APPENDED to the state log. Single-line JSON, newline terminator. Required schema:

```
{"type":"iteration","iteration":1,"newInfoRatio":<0..1>,"status":"insight|thought|error","focus":"Q1 phantom fix root cause","timestamp":"<ISO8601>"}
```

Use a high newInfoRatio (0.7-0.9) since this is iteration 1 (most findings will be new). Use status="insight" if you find concrete root cause evidence; "thought" if findings are speculative; "error" if blocked.

3. **Per-iteration delta file** at `deltas/iter-001.jsonl`. Contents: one `{"type":"iteration",...}` record (same as state-log append) plus per-event structured records:
   - one `{"type":"finding"}` per discovered root cause
   - one `{"type":"invariant"}` per protocol or contract that should never be violated
   - one `{"type":"observation"}` per concrete probe outcome
   - optional `{"type":"ruled_out"}` for hypotheses you eliminated

Example:
```
{"type":"iteration","iteration":1,"newInfoRatio":0.85,"status":"insight","focus":"Q1 phantom fix root cause","timestamp":"2026-04-27T07:00:00Z"}
{"type":"finding","id":"f-iter001-001","severity":"P0","label":"dist/ not rebuilt for X.ts after src patch","iteration":1}
{"type":"invariant","id":"inv-iter001-001","label":"Source patches require dist rebuild + daemon restart + live probe","iteration":1}
{"type":"observation","id":"obs-iter001-001","packet":"005","classification":"phantom_fix","iteration":1}
```

All three artifacts are REQUIRED. The orchestrator validates them after dispatch.

## REPORT BACK

After writing all three artifacts, print a one-line confirmation: `ITERATION 1 COMPLETE: <one-sentence summary>`.
