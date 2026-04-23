## Iteration 08
### Focus
Measure the remaining test gaps and determine which failure modes still lack executable coverage.

### Findings
- `executor-config.vitest.ts` validates parse-time flag combinations, but it never proves that a parsed `sandboxMode` or `timeoutSeconds` value is consumed by the actual YAML branch for any executor. [Evidence: .opencode/skill/system-spec-kit/mcp_server/tests/deep-loop/executor-config.vitest.ts:9-173]
- `cli-matrix.vitest.ts` explicitly says it mirrors YAML dispatch logic "for verification purposes"; it does not execute YAML, spawn CLIs, or verify artifact writes. That leaves large-prompt wrapper behavior, permission flags, and timeout handling untested end-to-end. [Evidence: .opencode/skill/system-spec-kit/mcp_server/tests/deep-loop/cli-matrix.vitest.ts:8-18,70-160]
- The Phase 018 checklist expected integration tests for native-path bit identity, `cli-codex` smoke, `sk-deep-review` parity, and three-consecutive-failure recovery, but the shipped verification evidence only claims unit suites plus grep-based YAML checks. [Evidence: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/002-sk-deep-cli-runtime-execution/001-executor-feature/checklist.md:110-119; .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/002-sk-deep-cli-runtime-execution/001-executor-feature/implementation-summary.md:203-240]
- The Phase 019 implementation summary explicitly defers live-dispatch smoke tests to Track 2, which means the current executor matrix shipped without proving any real CLI could complete the full artifact contract under its own branch. [Evidence: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/002-sk-deep-cli-runtime-execution/002-runtime-matrix/implementation-summary.md:180-199]

### New Questions
- Which missing test is the highest-value first addition: non-native provenance smoke, timeout smoke, or Copilot large-prompt smoke?
- Should the YAML assets gain a shared command builder so test code stops mirroring branch strings by hand?
- Is Track 2 already the de facto integration test surface, and if so should that dependency be documented as a release gate?

### Status
converging
