## Iteration 05

### Focus
Deep-research convergence-model drift across quick-reference and detailed reference surfaces.

### Findings
- The quick reference defines the 3-signal convergence model as Rolling Average `0.45`, MAD `0.30`, and Coverage / Age `0.25` (`.opencode/skill/sk-deep-research/references/quick_reference.md:128-136`).
- The convergence reference defines the same 3-signal model as Rolling Average `0.30`, MAD `0.35`, and Question Entropy `0.35` (`.opencode/skill/sk-deep-research/references/convergence.md:146-154`).
- Both surfaces present themselves as stop-decision guidance, so a maintainer could compute materially different `stopScore` values without touching implementation code.

### New Questions
- Which weight table is aligned with the reducer and workflow behavior today?
- Did the quick reference fail to update after a convergence-model revision, or did the detailed reference drift later?
- Are the dashboard and findings-registry metrics described with the old or new stop model elsewhere in the skill?

### Status
new-territory
