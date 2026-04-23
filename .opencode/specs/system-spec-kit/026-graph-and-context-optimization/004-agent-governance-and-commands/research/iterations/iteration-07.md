## Iteration 07

### Focus
Prompt-pack output paths that bypass the resolved artifact root.

### Findings
- `state_paths` routes config, state log, strategy, dashboard, iterations, deltas, and `research.md` through `{artifact_dir}` (`.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:94-117`).
- The prompt-pack renderer still writes to `{spec_folder}/research/prompts/iteration-{current_iteration}.md` rather than `{artifact_dir}/prompts/...` (`.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:484-487`).
- The `cli-codex`, `cli-copilot`, and `cli-gemini` branches all read from the same phase-local prompt path (`.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:523-555`), so a child-phase run is split between root-level packet state and phase-local prompt artifacts.

### New Questions
- Is the prompt path split intentional as a temporary compatibility bridge, or an unclosed migration gap?
- Should prompt artifacts be formalized in `state_paths` and `state_format.md` to match live behavior?
- Does the confirm YAML repeat the same split-brain prompt routing?

### Status
converging
