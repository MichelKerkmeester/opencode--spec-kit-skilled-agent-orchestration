## Iteration 09
### Focus
Verify which cross-cutting status-cleanup tasks from `001` are still live in code and which are already fixed.

### Findings
- T047 still looks live: `determineSessionStatus()` returns `COMPLETED` when the repository is clean and a commit/head ref exists with no pending indicators, and it also auto-completes high-activity sessions without explicit completion evidence. Evidence: `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:443`, `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:447`, `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:524`, `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:525`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/001-deep-review-and-remediation/tasks.md:128`
- The tests reinforce that permissive completion heuristic rather than ruling it out; they explicitly expect `COMPLETED` for a high-activity session with no blockers. Evidence: `.opencode/skill/system-spec-kit/scripts/tests/collect-session-data.vitest.ts:116`, `.opencode/skill/system-spec-kit/scripts/tests/collect-session-data.vitest.ts:138`
- T049 is also still live: `spec_kit_complete_confirm.yaml` asks the user whether to dispatch `@debug`, but the configured `debug_dispatch.subagent_type` is still `general-purpose`. Evidence: `.opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml:918`, `.opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml:920`, `.opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml:928`, `.opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml:929`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/001-deep-review-and-remediation/tasks.md:130`
- T048 is probably stale now: current deep-review workflow documents `fork` and `completed-continue` as deferred and routes `on_completed_session` directly to synthesis instead of a continuation branch. Evidence: `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:206`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:207`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:209`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/001-deep-review-and-remediation/tasks.md:129`
### New Questions
- Should T047 be narrowed to the clean-worktree shortcut only, or also to the high-activity fallback?
- Is the same `general-purpose` miswire present in `spec_kit_complete_auto.yaml`, or only the confirm workflow?
- Are there any remaining runtime paths that still honor `completed-continue`, or is the task now fully obsolete?
- Should a refreshed checklist separate live code bugs from status/doc-sync tasks to avoid conflation?

### Status
converging
