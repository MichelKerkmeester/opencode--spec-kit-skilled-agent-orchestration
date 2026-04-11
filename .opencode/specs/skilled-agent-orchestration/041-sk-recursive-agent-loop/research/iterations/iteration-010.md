# Iteration 10: Skill Package Shape and Workflow Surface

## Focus
Infer the most repo-native package shape for a future `sk-improve-agent` and decide whether it should be skill-only or paired with a command/workflow layer.

## Findings
1. Skills are self-contained and auto-discovered. The skills library expects a `SKILL.md` entrypoint, keeps references/assets/scripts inside the skill folder, and makes new skills discoverable without manual registration. [SOURCE: .opencode/skill/README.md:42] [SOURCE: .opencode/skill/README.md:46] [SOURCE: .opencode/skill/README.md:209]
2. `/create:sk-skill` is the canonical packaging workflow. It routes through explicit mode YAMLs, operation branches, and validation/completion phases, and full-create/full-update paths stay attached to the active spec workflow. [SOURCE: .opencode/command/create/sk-skill.md:9] [SOURCE: .opencode/command/create/sk-skill.md:239] [SOURCE: .opencode/command/create/sk-skill.md:279] [SOURCE: .opencode/command/create/sk-skill.md:310]
3. `sk-deep-research` is not just a skill folder. Its architecture depends on a command entrypoint, workflow layer, leaf agent, disk-state contract, and reducer script, which implies `sk-improve-agent` would likely need the same command/workflow pairing if it owns iterative execution. [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:137] [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:179]
4. The recommended skill layout already tells us where pieces should go: `SKILL.md` for routing and instructions, `references/` for evaluator and promotion policy, `assets/` for charter/manifest templates, and `scripts/` for ledger updates, scoring, and reducer refreshes. [SOURCE: .opencode/skill/README.md:209] [SOURCE: .opencode/skill/README.md:220]

## Ruled Out
- A skill folder alone is probably insufficient if the loop owns lifecycle orchestration. The repo's established pattern for iterative workflows is skill + command + workflow + agent + scripts, not prose-only routing. [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:137] [SOURCE: .opencode/command/create/sk-skill.md:239]

## Dead Ends
- Treating packaging as the core risk would be misleading. The repo already knows how to package skills; the hard parts remain evaluator design, mutation boundary control, and promotion rules.

## Sources Consulted
- .opencode/skill/README.md:42
- .opencode/command/create/sk-skill.md:239
- .opencode/skill/sk-deep-research/SKILL.md:137
- .opencode/skill/README.md:209

## Assessment
- New information ratio: 0.38
- Questions addressed: What should the MVP scope, boundaries, and success metric be for a new skill in this repo?
- Questions answered: None newly answered; this iteration clarified packaging and workflow shape.

## Reflection
- What worked and why: Comparing skill packaging rules to the deep-research architecture made it clear where the future loop would need to expand beyond a bare `SKILL.md`.
- What did not work and why: The Copilot pass explored the right files but needed manual normalization into a packet-ready shape.
- What I would do differently: If implementation starts, create the command and state contract first, then fill the skill references and templates around that spine.

## Recommended Next Focus
Choose the safest and most measurable first target surface so evaluator design can stay concrete instead of generic.
