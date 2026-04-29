# Deep Research Strategy: v1.0.3 Stress Test Results

## Topic
v1.0.3 stress test results post W3-W13 wiring: live-handler gap, harness telemetry export gap, W4 trigger distribution, through-line v1.0.1 → v1.0.2 → v1.0.3, expansion candidates.

## Executor
- cli-codex `gpt-5.5` reasoning=`xhigh` service-tier=default (normal)
- maxIterations=5, convergenceThreshold=0.10, stuckThreshold=2

## Iteration Focus Map (Pre-Plan; iterations may refine)

| Iter | Focus | Primary RQs |
|------|-------|-------------|
| 1 | v1.0.3 evidence audit + sample-size implications | RQ1 |
| 2 | Live handler embed-readiness gate trace + test seam | RQ2, RQ3 |
| 3 | W4 trigger distribution + SLA panel + decision-class analysis | RQ4 |
| 4 | Through-line v1.0.1 → v1.0.2 → v1.0.3 cross-cycle synthesis | RQ5 |
| 5 | Expansion candidate ranking + Planning Packet synthesis | RQ6, all |

## Known Context

### Phase H v1.0.3 verdict
- Overall: **CONDITIONAL**
- W3-W13 module/source confirmation: PASS
- Live handler trace: BLOCKED (MCP cancellation + 30s embed-readiness timeout)
- W4 real triggers fired (no `flag_disabled`/`unknown`): PASS
- Aggregate harness rubric NOT directly comparable to v1.0.2 30-cell CLI rubric

### Critical evidence files
- `021/findings-v1-0-3.md` — narrative + per-W verdict + wiring confirmation table
- `021/findings-rubric-v1-0-3.json` — machine-readable sidecar
- `021/measurements/v1-0-3-{envelopes,audit-log-sample,shadow-sink-sample}.jsonl` — 12-row samples each
- `021/measurements/v1-0-3-summary.json` — aggregate metrics + SLA panel + W4 trigger counts
- `010/findings.md` + `010/findings-rubric.json` — v1.0.2 baseline
- `001/` — v1.0.1 corpus + dispatch matrix
- `020/research/research-report.md` — Phase F expansion research output

### Critical runtime files (READ ONLY)
- `mcp_server/handlers/memory-search.ts` — handler entry point, embed-readiness gate, envelope emission
- `mcp_server/lib/search/{search-decision-envelope.ts, decision-audit.ts, rerank-gate.ts}`
- `mcp_server/lib/rag/trust-tree.ts`
- `mcp_server/lib/query/query-plan.ts`
- `mcp_server/skill_advisor/lib/shadow/shadow-sink.ts`
- `mcp_server/tests/search-quality/{harness,corpus,metrics,baseline.vitest}.ts`

## Constraints
- READ ONLY for runtime code, harness, prior packets.
- Per-iter file:line citations MANDATORY.
- Speculation findings get severity ≤ P2.
- Convergence honest; stop when newInfoRatio < threshold for 2 consecutive iters OR max=5 reached.
- 12-row JSONL samples are small — flag any percentile/rate claim that depends on > 10× sample size.
- Aggregate harness percent vs CLI-model rubric percent — directional comparison only.

## Synthesis Targets
- `research/research-report.md` with 9-section structure + Planning Packet
- Per-RQ answers with file:line evidence
- Through-line table (per-cycle prove/disprove/leaves-open)
- Top 3 expansion candidates with Planning Packet entries
- Open questions for downstream phases
