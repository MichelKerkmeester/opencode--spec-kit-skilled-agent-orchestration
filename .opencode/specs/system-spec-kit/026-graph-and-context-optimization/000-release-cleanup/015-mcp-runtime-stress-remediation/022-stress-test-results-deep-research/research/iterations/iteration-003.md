# Iteration 003 - W4 Trigger Distribution and SLA Panel

## Focus

W4 trigger distribution + SLA panel + decision-class analysis. This follows strategy iteration 3 and answers RQ4.

## Sources Read

- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/022-stress-test-results-deep-research/research/deep-research-strategy.md:12`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/findings-v1-0-3.md:37`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/findings-v1-0-3.md:55`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/findings-v1-0-3.md:67`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/findings-rubric-v1-0-3.json:382`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/findings-rubric-v1-0-3.json:415`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/measurements/v1-0-3-envelopes.jsonl:1`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/measurements/v1-0-3-envelopes.jsonl:6`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/measurements/v1-0-3-envelopes.jsonl:9`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/measurements/v1-0-3-envelopes.jsonl:12`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/measurements/phase-h-stress.test.ts:213`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/measurements/phase-h-stress.test.ts:239`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/rerank-gate.ts:31`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/rerank-gate.ts:42`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/rerank-gate.ts:57`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/rerank-gate.ts:68`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/rerank-gate.ts:71`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/decision-audit.ts:62`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/decision-audit.ts:82`

## Findings

- **P1 - The 100% W4 trigger rate is a corpus-shape signal, not production selectivity proof.** The summary reports 12 envelopes and rerank trigger rate 1 (`findings-v1-0-3.md:41`, `findings-v1-0-3.md:44`; `findings-rubric-v1-0-3.json:382`, `findings-rubric-v1-0-3.json:391`). The runner forces W4 cases to complex/high-authority with weak evidence and disagreement (`phase-h-stress.test.ts:213`, `phase-h-stress.test.ts:239`), and degraded-readiness/refusal cases also carry weak-evidence signals (`phase-h-stress.test.ts:249`, `phase-h-stress.test.ts:257`). Rationale: 100% trigger rate proves triggers are reachable and non-placeholder, but does not prove the gate is selective on a representative query population.

- **P1 - Trigger distribution reveals deliberate ambiguous/degraded skew.** Counts are `complex-query`: 6, `high-authority`: 5, `weak-evidence`: 6, `multi-channel-weak-margin`: 4, and one advisor-memory disagreement (`findings-v1-0-3.md:55`, `findings-v1-0-3.md:63`; `v1-0-3-summary.json:415`). Envelope line 6 shows a multi-trigger W4 case with all five trigger families, while lines 9-12 show degraded-readiness cells dominated by `weak-evidence` (`v1-0-3-envelopes.jsonl:6`, `v1-0-3-envelopes.jsonl:9`, `v1-0-3-envelopes.jsonl:12`). Rationale: the population is intentionally stress-heavy, so W4 tuning should be validated on a broader negative-control corpus before threshold changes.

- **P2 - The current gate has a floor but no weighting or multi-trigger backoff. `speculation: true` for the tuning candidates.** `decideConditionalRerank` returns false when no triggers exist (`rerank-gate.ts:31`) and blocks candidate counts below 4 (`rerank-gate.ts:42`), but once triggers survive that floor it returns true with all collected triggers (`rerank-gate.ts:50`, `rerank-gate.ts:57`). `multi-channel-weak-margin` fires when top score margin is at most 0.08 (`rerank-gate.ts:68`), and `weak-evidence` is a boolean trigger (`rerank-gate.ts:71`). Rationale: tuning candidates are threshold tightening, trigger weighting, or a multi-trigger backoff/cost cap, but the 12-row stress sample is too small and skewed to justify default behavior changes.

- **P2 - SLA panel is descriptive telemetry, not an SLO baseline.** SLA metrics compute counts, average/p95 latency, decision-class distribution, refusal rate, rerank trigger rate, and stage latencies from the envelope array (`decision-audit.ts:62`, `decision-audit.ts:102`). v1.0.3 reports degraded:5/trusted:7, refusal 8.3%, average latency 58.5ms, p95 97ms (`findings-v1-0-3.md:45`, `findings-v1-0-3.md:48`). Rationale: the panel is a strong contract shape for future dashboards, but a 12-row packet-local run cannot set production SLO thresholds.

## New Info Ratio

0.54. The main new information is not the raw counts themselves, but the causal link between runner signal construction, gate policy, and why 100% trigger rate should not be read as production selectivity.

## Open Questions Surfaced

- What negative-control query population should Phase K add to estimate rerank selectivity?
- Should W4 report a trigger-weight score separately from binary `shouldRerank`?
- Should high-authority and complex-query be sufficient alone, or should weak evidence/low margin be required for costly rerank?

## Convergence Signal

continue. W4 policy is understood enough for planning, but cross-cycle synthesis still needs to connect this to v1.0.1/v1.0.2 gaps.
