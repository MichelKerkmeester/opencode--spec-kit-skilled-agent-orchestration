## Iteration 07
### Focus
Trace stuck-recovery and stop-reason normalization across the skill docs, YAML, and reducer to find contract drift.

### Findings
- The live YAML normalizes raw `stuck_recovery` into canonical `stuckRecovery`, but multiple skill reference docs still describe the raw snake_case event as if it were written to JSONL. That makes failure forensics harder because the docs describe a path the reducer no longer expects. [Evidence: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:454-470; .opencode/skill/sk-deep-research/references/convergence.md:711-757]
- The reducer derives dashboard status from `stuckRecovery` and terminal stop records, not from raw `stuck_recovery`; stale docs can therefore mislead operators about what to grep for in a broken run. [Evidence: .opencode/skill/sk-deep-research/scripts/reduce-state.cjs:324-383]
- The skill contract still phrases recovery as "3 consecutive failures -> stuck_recovery", but the executable path only says validation failure escalates after three consecutive failures; there is no typed bridge from timeout/crash categories into that counter beyond generic validator failure. [Evidence: .opencode/skill/sk-deep-research/SKILL.md:95-114; .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:586-608]
- The system-hardening umbrella explicitly treated canonical command routing and findings registries as hard requirements, which means stop-reason drift in the executor layer now undermines a broader packet contract than just one CLI branch. [Evidence: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/003-system-hardening/spec.md:46-49,176-183]

### New Questions
- Should all deep-research references be rewritten to the frozen camelCase event names before further executor changes land?
- Does the reducer need to tolerate legacy snake_case events for backward compatibility, or should migration be one-way?
- Would a dedicated stop-reason schema test catch this drift earlier than prose reviews?

### Status
converging
