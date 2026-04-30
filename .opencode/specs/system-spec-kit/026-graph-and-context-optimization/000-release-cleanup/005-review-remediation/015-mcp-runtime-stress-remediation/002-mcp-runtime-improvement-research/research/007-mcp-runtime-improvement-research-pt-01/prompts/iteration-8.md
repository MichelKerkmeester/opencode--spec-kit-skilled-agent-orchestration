# Deep-Research Iteration 8 (007 MCP Runtime Improvement)

## STATE

Segment: 1 | Iteration: 8 of 10
Iterations completed: 7 | Last focus: Q6 code-graph empty recovery
Last 2 ratios: 0.64 -> 0.67
Resource map: resource-map.md not present; skipping coverage gate.
Next focus: Q7 lopsided causal-graph edge growth (supersedes-spam, per-class caps, balancing).

Research Topic: MCP runtime improvement research investigating root causes for memory layer, code graph, cocoindex, and intent classifier defects from 005 + 006 findings.
Iteration: 8 of 10

## REMAINING KEY QUESTIONS

Q1: ANSWERED (iter 1) — daemon rebuild + restart protocol.
Q2: ANSWERED (iter 3) — cocoindex mirror duplicates: index-time canonicalization + query-time dedup.
Q3: ANSWERED (iter 4) — cocoindex source-vs-markdown ranking: path-class boost via source_role metadata.
Q4: ANSWERED (iter 6) — weak retrieval hallucination guard: non-authoritative retrieval policy + ask_user.
Q5: ANSWERED (iter 2 + iter 5) — memory_context truncation: post-fallback telemetry + zero-fill ladder; preserve survivors + payload invariants.
Q6: ANSWERED (iter 7) — code-graph empty recovery: blocked-read contract + structural preflight protocol.
Q7: How to address lopsided causal-graph edge growth (005 REQ-010)? 344 supersedes edges added in 15 min while caused/supports edges stayed unchanged. Recommend edge-class balancing, per-class caps, or detection of supersedes-spam.
Q8: Intent classifier improvements beyond Cluster 2 fix (005 REQ-001/004/016). Address dual-classifier dissonance, paraphrase stability across cli-opencode/cli-codex/cli-copilot, and cross-CLI consistency findings.

## STATE FILES (relative to repo root)

- Config: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/002-mcp-runtime-improvement-research/research/002-mcp-runtime-improvement-research-pt-01/deep-research-config.json
- State Log: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/002-mcp-runtime-improvement-research/research/002-mcp-runtime-improvement-research-pt-01/deep-research-state.jsonl
- Strategy: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/002-mcp-runtime-improvement-research/research/002-mcp-runtime-improvement-research-pt-01/deep-research-strategy.md
- Registry: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/002-mcp-runtime-improvement-research/research/002-mcp-runtime-improvement-research-pt-01/findings-registry.json
- Write iteration narrative to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/002-mcp-runtime-improvement-research/research/002-mcp-runtime-improvement-research-pt-01/iterations/iteration-008.md
- Write per-iteration delta file to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/002-mcp-runtime-improvement-research/research/002-mcp-runtime-improvement-research-pt-01/deltas/iter-008.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 3-5 research actions. Max 12 tool calls total.
- Write ALL findings to files. Do not hold in context.
- Reducer owns strategy machine-owned sections, registry, and dashboard.
- When emitting JSONL, include optional graphEvents array of {type, id, label, relation?, source?, target?} objects.
- This is a READ-ONLY investigation. Do NOT modify mcp_server source. Cite file paths + line numbers as evidence.
- Q1 through Q6 are answered. Focus exclusively on Q7 this iteration.
- For Q7: Investigate causal-graph edge ingestion in mcp_server (search for "supersedes", "caused", "supports" handlers, edge-class cap logic, batch ingestion paths). Also probe 005-memory-search-runtime-bugs/spec.md REQ-010 for the original symptom telemetry. Recommend per-edge-class caps, supersedes-spam heuristics (e.g., burst-rate detection), or schema-level constraints.

## OUTPUT CONTRACT (REQUIRED — all three artifacts)

1. Write iteration narrative markdown to .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/002-mcp-runtime-improvement-research/research/002-mcp-runtime-improvement-research-pt-01/iterations/iteration-008.md. Headings: Focus, Actions Taken, Findings, Questions Answered, Questions Remaining, Next Focus.

2. APPEND single-line JSONL record to .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/002-mcp-runtime-improvement-research/research/002-mcp-runtime-improvement-research-pt-01/deep-research-state.jsonl via:
   echo '<single-line-json>' >> .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/002-mcp-runtime-improvement-research/research/002-mcp-runtime-improvement-research-pt-01/deep-research-state.jsonl
   Schema: {"type":"iteration","iteration":8,"newInfoRatio":<0..1>,"status":"insight|thought|error","focus":"<short>","graphEvents":[/* opt */],"timestamp":"<ISO8601>"}
   The "type" MUST be exactly "iteration" — not "iteration_delta" — or reducer drops it.

3. Write delta file to .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/002-mcp-runtime-improvement-research/research/002-mcp-runtime-improvement-research-pt-01/deltas/iter-008.jsonl (one JSON per line):
   - 1 line {"type":"iteration",...} matching the state-log append
   - Per finding/invariant/observation/edge/ruled_out as applicable

newInfoRatio guidance: 0.0-0.10 = no new info (stuck), 0.30-0.60 = solid evidence on one cluster, 0.70-0.90 = breakthrough. Be honest.

Now investigate Q7, write the three artifacts, and exit.
