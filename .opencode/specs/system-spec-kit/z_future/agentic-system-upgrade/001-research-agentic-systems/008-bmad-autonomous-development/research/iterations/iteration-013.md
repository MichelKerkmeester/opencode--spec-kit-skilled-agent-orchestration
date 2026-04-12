# Iteration 013 — Harness-Aware Config Centralization

## Research question
Does BAD's harness-aware setup suggest `system-spec-kit` should centralize runtime-specific model and workflow settings instead of distributing them across command assets and env flags?

## Hypothesis
BAD's setup/data split is a better configuration architecture for autonomous workflow settings than the current mix of per-command YAML and large environment-variable matrices.

## Method
Read BAD's setup asset, module metadata, and merge scripts, then compared that architecture to local workflow assets and environment-variable documentation.

## Evidence
- BAD setup writes shared config plus user config, prefixes harness-specific settings when multiple runtimes coexist, and stores module defaults as data in `module.yaml`. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/assets/module-setup.md:10-14] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/assets/module-setup.md:68-93] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/assets/module.yaml:5-38]
- BAD's merge helpers apply anti-zombie replacement and scoped legacy migration only for the active module, which keeps configuration ownership localized. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/scripts/merge-config.py:6-16] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/scripts/merge-config.py:230-275] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/scripts/merge-help-csv.py:9-18] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/scripts/merge-help-csv.py:176-212]
- Local `deep-research` still hard-codes core execution settings such as `model: opus`, tool budget, and state paths inside the workflow asset itself. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:66-89]
- The local runtime/config surface is otherwise heavily env-var driven, including dozens of `SPECKIT_*` retrieval, graph, memory, and observability flags. [SOURCE: .opencode/skill/system-spec-kit/references/config/environment_variables.md:21-39] [SOURCE: .opencode/skill/system-spec-kit/references/config/environment_variables.md:164-219] [SOURCE: .opencode/skill/system-spec-kit/references/config/environment_variables.md:223-308]

## Analysis
`system-spec-kit` already has centralization for low-level runtime behavior via env vars, but high-level workflow profiles are still scattered across command assets. BAD's architecture is cleaner for workflow configuration because defaults, prompts, migration behavior, and harness branching all live in one module-owned layer. That does not mean local env vars should disappear; it means workflow-profile settings need a more canonical home.

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** workflow behavior is split between per-command YAML assets and a broad env-var reference.
- **External repo's approach:** shared module-owned config plus harness-aware setup, with runtime overrides layered on top.
- **Why the external approach might be better:** it reduces per-command drift and makes runtime portability a first-class configuration concept.
- **Why system-spec-kit's approach might still be correct:** env vars remain the right layer for low-level MCP/search/runtime flags that should not be entangled with workflow UX.
- **Verdict:** REFACTOR
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** create a shared workflow-profile artifact for autonomous command families that owns model tiers, tool budgets, continuation behavior, and runtime capability branching; leave low-level retrieval flags in env vars.
- **Blast radius of the change:** large
- **Migration path:** start by lifting shared config from `deep-research`, `deep-review`, and future autonomous implementation flows into one profile artifact, then gradually slim command YAMLs down to references.

## Conclusion
confidence: high

finding: BAD points to a missing middle layer in `system-spec-kit`: workflow-profile configuration. Local env vars are too low-level and per-command YAML is too duplicated. A shared harness-aware workflow profile would reduce drift without collapsing the existing runtime controls.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- **Change type:** architectural shift
- **Blast radius:** large
- **Prerequisites:** define ownership boundaries between workflow profiles and environment-variable flags
- **Priority:** must-have

## Counter-evidence sought
I checked whether a shared workflow-profile file already existed for command families; the current sources still point to per-command YAML plus env-var references.

## Follow-up questions for next iteration
If workflow-profile config becomes centralized, does that change any of the current Level 1/2/3+ and phase-lifecycle assumptions, or are those deeper structural choices still justified?
