## Iteration 04

### Focus
Invocation syntax drift across AGENTS, skill docs, quick references, and command cards.

### Findings
- AGENTS Gate 4 mandates spaced invocations for iterative loops: `/spec_kit:deep-research :auto` and `/spec_kit:deep-review :auto` (`AGENTS.md:196-205`).
- sk-deep-research repeats the same spaced syntax in its mandatory `ALWAYS` guidance (`.opencode/skill/sk-deep-research/SKILL.md:54-56`).
- The live command cards and quick reference use attached suffixes instead: deep-research uses `/spec_kit:deep-research:auto` (`.opencode/command/spec_kit/deep-research.md:196-200`, `.opencode/skill/sk-deep-research/references/quick_reference.md:19-23`) and deep-review uses `/spec_kit:deep-review:auto` (`.opencode/command/spec_kit/deep-review.md:205-211`).

### New Questions
- Which syntax does the runtime parser actually treat as canonical?
- Are there more surface-level command examples that copied the older spaced syntax?
- Is the same syntax drift present for `/spec_kit:plan` and `/spec_kit:complete` mode suffixes?

### Status
new-territory
