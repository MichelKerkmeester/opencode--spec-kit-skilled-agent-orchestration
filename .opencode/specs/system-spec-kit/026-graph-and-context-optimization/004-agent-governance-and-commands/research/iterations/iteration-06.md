## Iteration 06

### Focus
Artifact-root contract drift for child-phase deep-research packets.

### Findings
- The deep-research state-format reference says runtime state lives under `{spec_folder}/research/`, with iterations under `{spec_folder}/research/iterations/` and synthesis at `{spec_folder}/research/research.md` (`.opencode/skill/sk-deep-research/references/state_format.md:24-27`).
- The live auto YAML says child-phase research folders are resolved at the spec-tree root instead, writing to `{root}/research/{phaseSlug}-pt-{NN}` and treating `{spec_folder}/research` as a legacy local path (`.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:124-133`).
- The shared resolver implements the root-level behavior by walking up to the highest parent with `spec.md` and allocating `{phaseSlug}-pt-{NN}` whenever the target is a child phase (`.opencode/skill/system-spec-kit/shared/review-research-paths.cjs:45-100`).

### New Questions
- Do any remaining docs still promise phase-local `research/` as the only runtime packet location?
- Are all deep-research artifacts actually routed through the same root-level resolver, or do some writes still target the phase-local folder?
- Does the same root-level relocation rule apply consistently to deep-review?

### Status
new-territory
