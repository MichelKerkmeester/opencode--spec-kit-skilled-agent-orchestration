## Iteration 01
### Focus
Audit the non-native executor provenance contract across the prompt pack, YAML dispatch order, and post-dispatch validation.

### Findings
- The prompt pack requires executors to append a JSONL record with `type`, `iteration`, `newInfoRatio`, `status`, `focus`, and optional `graphEvents`, but it does not require an `executor` field. A literal implementation of that contract cannot satisfy non-native validation. [Evidence: .opencode/skill/sk-deep-research/assets/prompt_pack_iteration.md.tmpl:38-48; .opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts:145-150]
- `post_dispatch_validate` runs before `record_executor_audit`, so the documented post-hoc audit write cannot rescue a non-native iteration record that lacks `executor`. [Evidence: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:586-617]
- `writeFirstRecordExecutor` can only patch an existing `iteration` or `iteration_start` record, or append an `iteration_start` prelude, but the validator inspects the last appended iteration record and still requires inline provenance on that final line. [Evidence: .opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts:94-125; .opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts:93-151]
- The prior 30-iteration refinement research already described non-native provenance as "optional, post-hoc and failure-blind", which matches the shipped code path instead of a closed hardening item. [Evidence: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/017-sk-deep-cli-runtime-execution-pt-01/research.md:54-59]

### New Questions
- Should `executor` become a required field in the prompt-pack JSONL schema for all non-native runs?
- Should validation accept provenance carried by `iteration_start`, or should first-write provenance move into the canonical iteration record?
- Is `record_executor_audit` still needed if the iteration record must already carry executor metadata to pass validation?

### Status
new-territory
