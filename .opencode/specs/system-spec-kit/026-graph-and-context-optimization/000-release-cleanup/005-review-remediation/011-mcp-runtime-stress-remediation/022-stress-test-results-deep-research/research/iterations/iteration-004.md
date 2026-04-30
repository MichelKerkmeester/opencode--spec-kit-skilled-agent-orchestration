# Iteration 004 - Cross-Cycle Synthesis

## Focus

Through-line v1.0.1 -> v1.0.2 -> v1.0.3 cross-cycle synthesis. This follows strategy iteration 4 and answers RQ5.

## Sources Read

- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/022-stress-test-results-deep-research/research/deep-research-strategy.md:13`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/001-search-intelligence-stress-test/001-scenario-design/spec.md:133`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/001-search-intelligence-stress-test/001-scenario-design/spec.md:200`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/001-search-intelligence-stress-test/002-scenario-execution/findings.md:7`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/001-search-intelligence-stress-test/002-scenario-execution/findings.md:14`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/001-search-intelligence-stress-test/002-scenario-execution/findings.md:21`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/001-search-intelligence-stress-test/002-scenario-execution/findings.md:79`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/001-search-intelligence-stress-test/002-scenario-execution/findings.md:160`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/findings.md:15`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/findings.md:16`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/findings.md:18`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/findings.md:69`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/findings-rubric.json:65`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/findings-rubric.json:79`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/020-w3-w7-verification-and-expansion-research/research/research-report.md:9`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/020-w3-w7-verification-and-expansion-research/research/research-report.md:64`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/findings-v1-0-3.md:14`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/findings-v1-0-3.md:69`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/findings-rubric-v1-0-3.json:371`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/measurements/phase-h-stress.test.ts:190`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/measurements/v1-0-3-envelopes.jsonl:5`
- `.opencode/skill/system-spec-kit/mcp_server/lib/rag/trust-tree.ts:46`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/w3-trust-tree.vitest.ts:29`

## Findings

- **P1 - Net progress is real, but each cycle measured a different layer.** v1.0.1 established the 9-scenario playbook and completed 30 cells (`001-scenario-design/spec.md:133`, `002-scenario-execution/findings.md:7`). v1.0.2 reused the v1.0.1 rubric and improved from 76.7% to 83.8% with zero regressions (`010/findings.md:15`, `010/findings.md:16`; `010/findings-rubric.json:65`). v1.0.3 moved from model-behavior scoring into deterministic harness telemetry and envelope/audit/shadow artifacts (`021/findings-v1-0-3.md:14`, `021/findings-rubric-v1-0-3.json:371`). Rationale: the cycles show forward motion, but their percentages should not be placed on one continuous scale.

- **P1 - Persistent gaps narrowed from hallucination and daemon gaps to live observability and native telemetry export.** v1.0.1 exposed weak-retrieval hallucination and dangerous ambiguous save behavior (`002-scenario-execution/findings.md:14`, `002-scenario-execution/findings.md:15`). v1.0.2 proved six of seven remediation packets, while packet 005 remained neutral because degraded graph state was not exercised (`010/findings.md:18`, `010/findings.md:75`). Phase F then recommended W8-W13 telemetry-first expansion because W3-W7 were isolated artifacts (`020/research-report.md:9`, `020/research-report.md:64`). v1.0.3 confirms much of W8-W13 source wiring, but still leaves full live handler capture and harness-native telemetry open (`021/findings-v1-0-3.md:101`, `021/findings-v1-0-3.md:102`).

- **P1 - v1.0.3 adds one new caution: W3 causal contradiction telemetry is over-claimed in the packet-local envelopes.** The W3 focused test correctly uses `causal: { edges: [...] }` and expects `hasContradiction` true. The packet runner instead passes `causalEdges` inside `trustTreeInput` (`phase-h-stress.test.ts:190`) while the trust-tree input contract expects `causal` (`trust-tree.ts:46`). The resulting contradiction sample line has `hasContradiction:false` and empty causal arrays (`v1-0-3-envelopes.jsonl:5`). Rationale: this is not a v1.0.2/v1.0.1 regression, but it means v1.0.3 proves W3 envelope presence more strongly than W3 causal-edge correctness inside the packet-local sample.

- **P2 - Prior implementation summaries are less reliable than findings/rubric files for cycle synthesis.** The v1.0.1 and v1.0.2 implementation summaries still contain scaffold/deferred wording even though findings and rubric artifacts exist. Rationale: downstream phases should treat `findings.md`, `findings-rubric.json`, and v1.0.3 `findings-v1-0-3.md` as source of truth for cross-cycle conclusions.

## New Info Ratio

0.38. The cross-cycle table mostly synthesizes existing evidence, with the W3 causal-edge mismatch as the main new concrete finding.

## Open Questions Surfaced

- Should v1.0.4 explicitly replay the W3 contradiction cell through the live handler after fixing the packet-runner input shape?
- Should future cycle summaries carry a normalized "evidence layer" label: model-score, harness-score, packet-runner telemetry, live-handler telemetry?
- Should stale implementation summaries in prior packets be corrected in a separate documentation hygiene phase?

## Convergence Signal

approaching-convergence. The cross-cycle through-line is stable; iteration 5 should focus on ranked planning.
