GATE 3 PRE-ANSWERED: A (existing spec folder)
Spec folder for this run: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/
Skill routing: sk-deep-review is preselected; do not re-evaluate.
You may write to: review/iterations/, review/deltas/, review/deep-review-state.jsonl. Do NOT modify any other file. Do NOT ask the user any questions.
This is a READ-ONLY review of the implementation. NEVER edit code outside the review/ directory.

==========

You are running iteration 4 of 10 in a deep-review loop on the 008-code-graph-backend-resilience packet.

# Iteration 4 — Correctness — Edge Weight Config + Drift Math

## Focus

Audit T11-T12 edge-weight tuning + drift detection:

- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:73-80` (edgeWeights + DEFAULT_EDGE_WEIGHTS)
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:895-1071, 1357-1377` (weight resolution)
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/edge-drift.ts` (NEW — PSI, JSD, share computation)
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:230-245` (baseline persistence)
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:40-62` (drift surfacing)

## Look For

- DEFAULT_EDGE_WEIGHTS values exactly match prior hard-coded constants?
- PSI formula correctness: `Σ (observed - baseline) * ln(observed / baseline)` with zero handling
- JSD correctness: 0.5 * KL(P || M) + 0.5 * KL(Q || M) where M = (P+Q)/2
- Share-drift: per-edge-type (current_share - baseline_share) — sign convention consistent?
- What happens when baseline is missing? when an edge type appears in current but not baseline (or vice versa)?
- Threshold defaults from impl-summary: PSI ≥ 0.25, JSD ≥ 0.10, |share_drift| ≥ 0.05 — are they actually applied in the flagged check?
- persistBaseline gating: is it gated correctly so we don't accidentally rotate the baseline on every scan?

## Outputs as iteration 1.
