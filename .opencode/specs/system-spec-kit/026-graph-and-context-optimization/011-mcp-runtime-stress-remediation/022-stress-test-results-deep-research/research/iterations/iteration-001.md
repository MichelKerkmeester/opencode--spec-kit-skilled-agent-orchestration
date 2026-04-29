# Iteration 001 - v1.0.3 Evidence Audit

## Focus

v1.0.3 evidence audit + sample-size implications + harness-runner vs live-handler distinction. This follows the strategy focus for iteration 1 and primarily answers RQ1.

## Sources Read

- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/022-stress-test-results-deep-research/research/deep-research-strategy.md:10`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/findings-v1-0-3.md:14`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/findings-v1-0-3.md:20`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/findings-v1-0-3.md:21`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/findings-v1-0-3.md:23`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/findings-v1-0-3.md:27`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/findings-v1-0-3.md:41`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/findings-v1-0-3.md:101`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/findings-v1-0-3.md:113`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/measurements/v1-0-3-summary.json:5`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/measurements/v1-0-3-summary.json:4041`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/measurements/v1-0-3-summary.json:4052`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/measurements/v1-0-3-summary.json:4061`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/measurements/phase-h-stress.test.ts:45`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/measurements/phase-h-stress.test.ts:49`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/measurements/phase-h-stress.test.ts:82`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/measurements/phase-h-stress.test.ts:137`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/decision-audit.ts:43`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/decision-audit.ts:51`
- `.opencode/skill/system-spec-kit/mcp_server/tests/search-quality/measurement-fixtures.ts:155`
- `.opencode/skill/system-spec-kit/mcp_server/tests/search-quality/measurement-fixtures.ts:186`

## Findings

- **P1 - v1.0.3 proves packet-local module composition, not full live handler emission.** The findings file explicitly marks the verdict CONDITIONAL because MCP calls were cancelled and a direct handler probe timed out before a live handler envelope emitted (`findings-v1-0-3.md:14`, `findings-v1-0-3.md:101`). The packet runner did use production module builders and sinks (`phase-h-stress.test.ts:13`, `phase-h-stress.test.ts:18`, `phase-h-stress.test.ts:21`, `phase-h-stress.test.ts:26`, `phase-h-stress.test.ts:29`), but it drove them from corpus fixtures and local envelope construction (`phase-h-stress.test.ts:45`, `phase-h-stress.test.ts:49`, `phase-h-stress.test.ts:137`). Rationale: claims about field shape, JSONL writeability, and module-level contracts survive; claims about real MCP/live-handler end-to-end emission remain unproven.

- **P1 - Sample-size guards must downgrade rate and percentile claims to directional.** The summary records `caseCount: 12` and sample counts of 12 envelopes, 12 audit rows, and 12 shadow rows (`v1-0-3-summary.json:5`, `v1-0-3-summary.json:4061`). The SLA panel reports p95 latency and trigger/refusal rates from those 12 rows (`findings-v1-0-3.md:41`, `findings-v1-0-3.md:44`, `findings-v1-0-3.md:48`). Rationale: p95 and rates are valid descriptions of this sample, but production-tail claims or long-run percentages would require materially larger N; any claim depending on more than 120 implied observations is directional only.

- **P1 - Aggregate quality deltas are harness deltas, not live runtime performance deltas.** v1.0.3 reports precision +0.139, recall +0.042, p95 latency -0.100ms, and citation +0.167 versus Phase E baseline (`findings-v1-0-3.md:27`, `findings-v1-0-3.md:35`; `v1-0-3-summary.json:4052`). The same findings warn v1.0.2 used a 30-cell CLI-model rubric while v1.0.3 used deterministic harness telemetry (`findings-v1-0-3.md:23`, `findings-v1-0-3.md:113`). Rationale: the deltas are useful within the fixture harness, but not directly comparable to v1.0.2 or production latency.

- **P2 - Audit rows are envelope-shaped, which is acceptable but should be named precisely.** The packet runner calls `recordSearchDecision(envelope, { auditPath })` for each locally built envelope (`phase-h-stress.test.ts:49`, `phase-h-stress.test.ts:51`) and the audit implementation appends the full serialized envelope (`decision-audit.ts:43`, `decision-audit.ts:51`). Rationale: the file is a decision-audit sample, but downstream readers should not expect a narrower audit-only schema.

## New Info Ratio

0.86. Most findings refine prior context by separating packet-local module evidence from live-handler proof and by applying explicit sample-size guards.

## Open Questions Surfaced

- Should Phase K prioritize live-handler proof over broader corpus expansion?
- Should v1.0.4 require a minimum N before reporting p95/rate claims as anything stronger than directional?
- Should the audit sample be renamed or documented as full-envelope JSONL to avoid schema confusion?

## Convergence Signal

continue. The evidence audit answered RQ1 but surfaced live-handler and harness-native gaps that need separate passes.
