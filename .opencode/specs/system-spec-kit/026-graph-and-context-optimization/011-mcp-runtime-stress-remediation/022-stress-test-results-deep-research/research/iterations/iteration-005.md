# Iteration 005 - Expansion Ranking and Planning Packet

## Focus

Expansion candidate ranking + Planning Packet synthesis. This follows strategy iteration 5 and answers RQ6 while wrapping RQ1-RQ5.

## Sources Read

- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/022-stress-test-results-deep-research/research/deep-research-strategy.md:14`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/020-w3-w7-verification-and-expansion-research/research/research-report.md:70`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/020-w3-w7-verification-and-expansion-research/research/research-report.md:82`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/020-w3-w7-verification-and-expansion-research/research/research-report.md:90`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/020-w3-w7-verification-and-expansion-research/research/research-report.md:171`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/findings-v1-0-3.md:105`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/findings-v1-0-3.md:107`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:927`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1169`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1410`
- `.opencode/skill/system-spec-kit/mcp_server/tests/search-quality/harness.ts:29`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/decision-audit.ts:23`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/decision-audit.ts:62`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/rerank-gate.ts:57`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/shadow/shadow-sink.ts:39`
- `.opencode/skill/system-spec-kit/mcp_server/tests/search-quality/w13-decision-audit.vitest.ts:47`

## Findings

- **P1 - Top expansion candidate is live-handler envelope capture, because it removes the biggest evidentiary caveat.** The handler gate blocks before pipeline execution unless embedding readiness is true (`memory-search.ts:927`), while envelope construction and audit recording happen later (`memory-search.ts:1169`, `memory-search.ts:1410`). Rationale: Phase K should first prove one full handler trace with envelope and audit output before expanding corpus size.

- **P1 - Second candidate is harness telemetry export mode, because it converts packet-local wrapper logic into reusable stress infrastructure.** The harness output types lack telemetry fields (`harness.ts:29`, `harness.ts:46`), while v1.0.3 recommendations already call for first-class telemetry export (`findings-v1-0-3.md:107`). Rationale: this is high leverage and high feasibility because it can preserve DB-agnostic runners while carrying optional envelope/audit/shadow artifacts.

- **P1 - Third candidate is SLA/decision-class dashboarding with drift detection, but only after handler and harness capture are deterministic.** The audit module already defines count, average/p95 latency, decision distribution, refusal rate, rerank trigger rate, and stage latencies (`decision-audit.ts:23`, `decision-audit.ts:62`), and W13 tests validate SLA computation (`w13-decision-audit.vitest.ts:47`). Rationale: dashboarding is production-hardening leverage, but it needs real live-handler rows rather than packet-local synthetic timings.

- **P2 - Additional ranked candidates are shadow-sink replay, W4 trigger weighting, audit retention policy, and calibration histogram alerting. `speculation: true` for the tuning/alert thresholds.** Shadow persistence exists as append-only JSONL (`shadow-sink.ts:39`), W4 triggers are collected centrally (`rerank-gate.ts:57`), and Phase F already identified enterprise audit and metrics as a W13 direction (`020/research-report.md:90`). Rationale: these are credible Phase L items, but they depend on the top two capture workstreams.

## New Info Ratio

0.22. This iteration mostly ranks and packages findings from prior iterations; the new information is the leverage/feasibility ordering and packet ownership proposal.

## Open Questions Surfaced

- Should Phase K combine live-handler seam and harness telemetry export in one packet, or keep them as 023 and 024?
- What minimum sample size should be required before dashboard thresholds become blocking release gates?
- Should shadow replay target advisor-only outcomes first, or replay full search decision envelopes?

## Convergence Signal

converged-by-max-iterations. New information remains above the 0.10 threshold, so early-stop convergence did not trigger. The loop stops because the configured maximum of 5 iterations was reached.

## Stop Reason

`max_iterations_reached`; newInfoRatio sequence: 0.86, 0.72, 0.54, 0.38, 0.22.
