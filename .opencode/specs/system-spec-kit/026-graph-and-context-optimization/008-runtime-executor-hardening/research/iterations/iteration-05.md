## Iteration 05
### Focus
Compare the documented timeout and retry behavior with the actual executor runtime wiring.

### Findings
- The config schema exposes `timeoutSeconds`, and the YAML passes it to each CLI command branch, but the deeper timeout contract in loop-protocol docs promises `iteration_timeout` events, status mutation to `timeout`, and continuation logic that is not implemented in the deep-loop modules. [Evidence: .opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts:19-25; .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:526-576; .opencode/skill/sk-deep-research/references/loop_protocol.md:232-241]
- `emitDispatchFailure` exists as a typed helper for `timeout`, `crash`, and related failure reasons, but nothing in the executor YAML or runtime library calls it outside tests. Timeout-specific failure recording is therefore defined but not wired. [Evidence: .opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts:128-149; .opencode/skill/system-spec-kit/mcp_server/tests/deep-loop/dispatch-failure.vitest.ts:29-93]
- The Phase 018 spec promised "retry once" for non-zero `codex exec` exits and even defined `executor.retryOnTransient` as deferred config, but the shipped config schema has no retry field and the YAML has no retry branch or helper. [Evidence: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/002-sk-deep-cli-runtime-execution/001-executor-feature/spec.md:152-154,212-216; .opencode/skill/sk-deep-research/assets/deep_research_config.json:14-21]
- The YAML `error_recovery` block still describes agent timeout retries in prose, yet no executable step in `workflow.steps` references that block for CLI dispatch failures. It is documentation, not enforcement. [Evidence: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:836-840; .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:992-996]

### New Questions
- Should timeout handling move into a shared deep-loop helper that emits `dispatch_failure` and `iteration_timeout` events consistently?
- Is the retry contract still desired, or should the Phase 018 spec be corrected to remove it?
- Should the dashboard/reporting layer distinguish process timeout from schema mismatch so operators can see infrastructure failures directly?

### Status
converging
