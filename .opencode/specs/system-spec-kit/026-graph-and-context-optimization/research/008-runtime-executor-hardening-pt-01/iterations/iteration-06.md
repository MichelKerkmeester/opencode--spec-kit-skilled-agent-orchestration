## Iteration 06
### Focus
Examine crash and missing-output behavior to find the actual root cause behind stuck-wrapper and generic schema-mismatch failures.

### Findings
- `validateIterationOutputs` can recognize a typed `dispatch_failure` event, but if the state log only contains the pre-dispatch `iteration_start` record and no typed failure event, the same crash collapses into `jsonl_wrong_type` or `jsonl_not_appended`. The runtime loses failure specificity unless another writer runs first. [Evidence: .opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts:84-174; .opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts:94-125]
- The current failure path therefore depends on an unwired helper (`emitDispatchFailure`) instead of the actual YAML command runner. That matches the prior research conclusion that non-native failure observability was "failure-blind". [Evidence: .opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts:128-149; .opencode/specs/system-spec-kit/026-graph-and-context-optimization/017-sk-deep-cli-runtime-execution/001-executor-feature/research/017-sk-deep-cli-runtime-execution-pt-01/research.md:54-59,210-213]
- The skill contract says post-dispatch validation will eventually catch recursive or broken executor runs through `schema_mismatch -> stuck_recovery`, but the actual reason surface shown to operators can be a generic wrong-type or missing-output error rather than the underlying crash/timeout/root cause. [Evidence: .opencode/skill/sk-deep-research/SKILL.md:83-102; .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:594-608]
- Because the pre-dispatch audit writes before execution, a crash can leave state that looks partially initialized without any machine-readable distinction between "executor never started", "executor crashed immediately", and "executor timed out after partial work". [Evidence: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:502-509; .opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts:94-126]

### New Questions
- Should the command runner always emit a typed `dispatch_failure` event before returning control to post-dispatch validation?
- Should `iteration_start` move to a separate per-iteration delta stream to avoid contaminating the main state log tail?
- Do we need a distinct failure taxonomy for "wrapper path not honored" versus "CLI process timed out" versus "artifact write missing"?

### Status
converging
