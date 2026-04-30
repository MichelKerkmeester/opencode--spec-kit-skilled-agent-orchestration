---
iteration: 6
focus: RQ6 - Cross-W composition opportunities
newInfoRatio: 0.49
status: complete
---

# Iteration 006 - Cross-W Composition

## Focus

Identify whether W3 can feed W4 decisions, whether W5 shadow data can feed W3 trust scoring, and how W6/W7 telemetry could join a single search decision envelope.

## Evidence Reviewed

- `.opencode/skill/system-spec-kit/mcp_server/lib/rag/trust-tree.ts:52` defines trust-tree output with decision, contradiction flag, signals, causal edges, citations, and reasons.
- `.opencode/skill/system-spec-kit/mcp_server/lib/rag/trust-tree.ts:65` composes response policy, code graph, advisor, CocoIndex, and causal signals.
- `.opencode/skill/system-spec-kit/mcp_server/lib/rag/trust-tree.ts:205` maps mixed/degraded/unavailable states.
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/rerank-gate.ts:66` already has a weak-evidence trigger.
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/rerank-gate.ts:69` already accepts disagreement reasons.
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:327` invokes the gate, but only with local result signals.
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-recommend.ts:176` computes shadow live-vs-shadow deltas.
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-recommend.ts:270` emits those deltas in `_shadow`.
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cocoindex-calibration.ts:20` defines duplicate-density telemetry.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:214` emits blocked degraded envelope fields including readiness, canonical readiness, trust state, and fallback decision.

## Findings

### F-XW-001 - P2 - Existing contracts almost align for one decision envelope

W3 can produce `decision: degraded|mixed|unavailable`; W4 can consume `weakEvidence` and disagreement reasons; W5 can produce shadow deltas; W6 can produce duplicate-density telemetry; W7 can produce degraded-readiness envelopes. The missing piece is a runtime object that carries these facts across pipeline boundaries.

## Composition Verdict

There is a high-leverage Phase G shape: create an auditable `SearchDecisionEnvelope` that records QueryPlan, trust tree, rerank gate decision, shadow scorer deltas, CocoIndex calibration telemetry, and degraded-readiness state. Use it as telemetry first; only after measurement should it change ranking/refusal behavior.

## Opportunities

- W3 -> W4: map trust-tree `degraded`, `mixed`, or contradiction reasons into W4 `weakEvidence` or `disagreementReasons`.
- W5 -> W3: map advisor shadow deltas and dominant shadow lane into advisor trust signal metadata.
- W6 -> W3/W4: map duplicate density/path class to weak evidence or source confidence.
- W7 -> W3: map canonical readiness/trust state directly into code graph trust signal.

## Next Focus

Iteration 007 should trace adjacent pipelines: `memory_search`, `memory_context`, `memory_save`, advisor, and code graph.
