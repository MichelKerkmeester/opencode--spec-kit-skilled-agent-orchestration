## Iteration 08

### Focus
Distributed-governance enforcement for deep-research markdown writes.

### Findings
- Distributed governance requires any spec-folder markdown writer to use `templates/level_N/`, run `validate.sh --strict` after each file write, and route continuity through `/memory:save` (`AGENTS.md:325-327`, `.opencode/skill/system-spec-kit/SKILL.md:61-63`).
- The deep-research workflow seeds its packet from research-specific assets instead of level templates: config from `deep_research_config.json` and strategy from `deep_research_strategy.md` (`.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:213-240`).
- The synthesis path builds `research/research.md` as a dedicated research output (`.opencode/command/spec_kit/deep-research.md:189-192`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:728-739`), but the workflow surface does not expose a per-write validator step that matches the governance rule.

### New Questions
- Is `research/research.md` intentionally exempt from the level-template rule, or is the rule overstated?
- Should the deep-research workflow itself invoke validation after iteration and synthesis writes?
- Do deep-review and other workflow-owned markdown outputs follow the same enforcement gap?

### Status
converging
