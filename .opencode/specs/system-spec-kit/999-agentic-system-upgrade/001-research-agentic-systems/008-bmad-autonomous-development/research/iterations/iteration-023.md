# Iteration 023 — Template And Spec Folder Bootstrap UX

## Research question
Is the Level 1/2/3+ spec-folder system intuitive enough for operators, or does BAD's one-shot setup pattern suggest a better onboarding experience?

## Hypothesis
The level model is structurally useful, but the bootstrap UX is too manual. BAD's setup flow suggests `system-spec-kit` should add a guided scaffold experience instead of asking users to reason from template architecture first.

## Method
Compared BAD's module setup questionnaire and module manifest to the current level-selection, template-copy, and validation rule experience.

## Evidence
- BAD centralizes setup in a compact configuration questionnaire and writes the needed files from that single guided path. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/assets/module-setup.md:40-93] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/assets/module.yaml:7-40]
- `system-spec-kit` uses a progressive level model with CORE + ADDENDUM templates, multiple level folders, and explicit copy/setup instructions. [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:14-39] [SOURCE: .opencode/skill/system-spec-kit/references/templates/template_guide.md:67-186] [SOURCE: .opencode/skill/system-spec-kit/templates/README.md:18-58]
- Strict validation is comprehensive and helpful for correctness, but the rule inventory is large and the first-run experience depends on the operator understanding required files, placeholders, and section contracts. [SOURCE: .opencode/skill/system-spec-kit/references/validation/validation_rules.md:39-55] [SOURCE: .opencode/skill/system-spec-kit/references/validation/validation_rules.md:65-204]

## Analysis
The local system has a better documentation substrate than BAD because it solves a broader planning/governance problem. The UX issue is not the existence of levels; it is the amount of up-front template literacy required to start safely. BAD's setup flow offers a portable lesson: ask a small number of intent questions, then generate the right structure. `system-spec-kit` should preserve level depth but front it with a guided scaffold path.

## UX / System Design Analysis

- **Current system-spec-kit surface:** Operators choose a level, copy templates, understand core/addendum composition, then rely on strict validation to catch omissions.
- **External repo's equivalent surface:** BAD asks grouped setup questions once, writes config and folders, and returns the user to a small command surface.
- **Friction comparison:** Local UX creates more files and more mental branching before the operator has momentum. BAD reduces cognitive load by turning structure decisions into a guided setup interaction.
- **What system-spec-kit could DELETE to improve UX:** Delete the expectation that most users should manually reason from template folder architecture and level docs during setup.
- **What system-spec-kit should ADD for better UX:** Add a spec bootstrap wizard that recommends a level, scaffolds the required files, and explains validation failures in grouped plain language.
- **Net recommendation:** ADD

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** powerful progressive template architecture with explicit level selection and strong validation.
- **External repo's approach:** compact setup questionnaire and generated config/files.
- **Why the external approach might be better:** it turns structural knowledge into a guided interaction instead of prerequisite reading.
- **Why system-spec-kit's approach might still be correct:** the local repo genuinely needs deeper documentation rigor than BAD.
- **Verdict:** ADD
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** add a guided spec-bootstrap surface that asks a few scope/risk questions, recommends a level, scaffolds required files, and groups validation output into onboarding-friendly categories.
- **Blast radius of the change:** medium
- **Migration path:** introduce the wizard as an optional front door first; keep raw templates and strict validation intact for advanced users and automation.

## Conclusion
confidence: high

finding: The Level 1/2/3+ model should stay, but its UX needs a BAD-style guided bootstrap. `system-spec-kit` should turn level and template selection into a short questionnaire plus generated scaffold path.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/templates/README.md`
- **Change type:** added capability
- **Blast radius:** medium
- **Prerequisites:** define the minimum question set that predicts level choice without reintroducing more ceremony
- **Priority:** should-have

## Counter-evidence sought
I looked for an existing one-shot local scaffold flow that already hides the template architecture. The current template guide is clear, but it still assumes the user will read and choose from the architecture directly.

## Follow-up questions for next iteration
If setup can become more guided, does the same simplification apply to the local agent roster and orchestration model?
