# Deep-Research Iteration 2 (007 MCP Runtime Improvement)

## STATE

Segment: 1 | Iteration: 2 of 10
Iterations completed: 2 | Last focus: Q1 phantom fix root cause
Last 2 ratios: 0.86 -> 0.82
Resource map: resource-map.md not present; skipping coverage gate.
Next focus: Iteration 1: Investigate Q1 phantom fix root cause. Check 005 implementation-summary for what was claimed landed, then probe the running MCP daemon to confirm pre-fix vs post-fix behavior. Identify whether dist/ was rebuilt and whether daemon was restarted. Document the canonical fix-and-verify protocol. 

Research Topic: MCP runtime improvement research investigating root causes for memory layer, code graph, cocoindex, and intent classifier defects from 005 + 006 findings.
Iteration: 2 of 10

## REMAINING KEY QUESTIONS

Q1: Why are 005 P0 fixes (Cluster 1, 2, 3) not active in the running daemon? Source patches were claimed as landed but live MCP probes show pre-fix behavior. Is this a missing dist rebuild, daemon restart, or both? What is the canonical fix-and-verify protocol going forward?
Q2: How to fix cocoindex mirror-folder duplicates (005 REQ-018)? 10-result responses currently return the same chunk from .gemini/specs/, .claude/specs/, .codex/specs/ mirror copies. Recommend exclude rules or canonical-source-only ranking with confidence tiers.
Q3: How to fix cocoindex source-vs-markdown ranking imbalance (005 REQ-019)? Research markdown outranks implementation source on technical queries. Recommend ranking weights or path-class boosting (mcp_server/lib/ wins over .opencode/specs/.../research/).
Q4: How to harden against the model-side hallucination class on weak retrieval (006 I2 finding)? When requestQuality:"weak" and recovery.suggestedQueries:[], cli-codex and cli-copilot models fabricate fake spec packets and file paths instead of refusing. Recommend stronger guardrail responses (refuse, require disambiguation, suggest broader queries).
Q5: Why does memory_context wrapper truncate to count:0 at 2 percent budget (005 REQ-002)? Direct memory_search returns hits but the wrapper drops to zero on the same query. Identify the truncation logic bug and recommend wrapper fix.
Q6: How to recover from empty code-graph (005 REQ-017)? Q1/cli-opencode took 4 min falling back to grep when code-graph returned empty. Recommend warm-start scan, scan-on-empty trigger, or stale-graph repair.
Q7: How to address lopsided causal-graph edge growth (005 REQ-010)? 344 supersedes edges added in 15 min while caused/supports edges stayed unchanged. Recommend edge-class balancing, per-class caps, or detection of supersedes-spam.
Q8: Intent classifier improvements beyond Cluster 2 fix (005 REQ-001/004/016). Address dual-classifier dissonance, paraphrase stability across cli-opencode/cli-codex/cli-copilot, and cross-CLI consistency findings.

## STATE FILES (relative to repo root)

- Config: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/002-mcp-runtime-improvement-research/research/002-mcp-runtime-improvement-research-pt-01/deep-research-config.json
- State Log: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/002-mcp-runtime-improvement-research/research/002-mcp-runtime-improvement-research-pt-01/deep-research-state.jsonl
- Strategy: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/002-mcp-runtime-improvement-research/research/002-mcp-runtime-improvement-research-pt-01/deep-research-strategy.md
- Registry: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/002-mcp-runtime-improvement-research/research/002-mcp-runtime-improvement-research-pt-01/findings-registry.json
- Write iteration narrative to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/002-mcp-runtime-improvement-research/research/002-mcp-runtime-improvement-research-pt-01/iterations/iteration-002.md
- Write per-iteration delta file to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/002-mcp-runtime-improvement-research/research/002-mcp-runtime-improvement-research-pt-01/deltas/iter-002.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 3-5 research actions. Max 12 tool calls total.
- Write ALL findings to files. Do not hold in context.
- Reducer owns strategy machine-owned sections, registry, and dashboard.
- When emitting JSONL, include optional graphEvents array of {type, id, label, relation?, source?, target?} objects.
- This is a READ-ONLY investigation. Do NOT modify mcp_server source. Cite file paths + line numbers as evidence.
- For Q1: already answered in iteration-001.md (rebuild + restart protocol). Do not re-investigate.
- Pick the next-most-valuable unanswered question per your judgment from the remaining list. Prioritize: Q5 (memory_context truncation, P0), Q2 (cocoindex mirror dup), Q3 (cocoindex ranking), Q4 (hallucination guard), Q6 (code-graph empty), Q7 (causal-graph imbalance), Q8 (classifier improvements).

## OUTPUT CONTRACT (REQUIRED — all three artifacts)

1. Write iteration narrative markdown to .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/002-mcp-runtime-improvement-research/research/002-mcp-runtime-improvement-research-pt-01/iterations/iteration-002.md. Headings: Focus, Actions Taken, Findings, Questions Answered, Questions Remaining, Next Focus.

2. APPEND single-line JSONL record to .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/002-mcp-runtime-improvement-research/research/002-mcp-runtime-improvement-research-pt-01/deep-research-state.jsonl via:
   echo '<single-line-json>' >> .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/002-mcp-runtime-improvement-research/research/002-mcp-runtime-improvement-research-pt-01/deep-research-state.jsonl
   Schema: {"type":"iteration","iteration":2,"newInfoRatio":<0..1>,"status":"insight|thought|error","focus":"<short>","graphEvents":[/* opt */],"timestamp":"<ISO8601>"}
   The "type" MUST be exactly "iteration" — not "iteration_delta" — or reducer drops it.

3. Write delta file to .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/002-mcp-runtime-improvement-research/research/002-mcp-runtime-improvement-research-pt-01/deltas/iter-002.jsonl (one JSON per line):
   - 1 line {"type":"iteration",...} matching the state-log append
   - Per finding/invariant/observation/edge/ruled_out as applicable

newInfoRatio guidance: 0.0-0.10 = no new info (stuck), 0.30-0.60 = solid evidence on one cluster, 0.70-0.90 = breakthrough. Be honest.

Now investigate the next-focus question, write the three artifacts, and exit.
