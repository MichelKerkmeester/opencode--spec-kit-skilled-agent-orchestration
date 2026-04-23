## Iteration 09

### Focus
Runtime-source-of-truth ambiguity between AGENTS routing and workflow agent configuration.

### Findings
- AGENTS says operators should pick the agent directory that matches the active runtime and stay consistent for that workflow phase (`AGENTS.md:300-311`).
- The deep-research loop manager hardcodes `.opencode/agent/deep-research.md` as `agent_file` and describes runtime-specific directories as references to that source (`.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:81-84`).
- The deep-review loop manager does the same for `.opencode/agent/deep-review.md` (`.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:69-72`).
- The result is dual authority: governance docs tell callers to use the runtime-specific directory, while workflow assets treat the OpenCode copy as the canonical source.

### New Questions
- Is the OpenCode copy meant to be the single editable source with generated runtime mirrors, and if so, where is that contract documented?
- Should AGENTS explicitly carve out deep-loop workflows as exceptions to runtime-local directory routing?
- Does Codex path drift persist because the workflow-source-of-truth and runtime-source-of-truth contracts were never fully reconciled?

### Status
converging
