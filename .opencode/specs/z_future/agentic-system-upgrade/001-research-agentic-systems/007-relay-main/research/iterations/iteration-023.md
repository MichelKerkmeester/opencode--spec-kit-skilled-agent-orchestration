# Iteration 023 — Simplify Spec Folder Template UX

Date: 2026-04-10

## Research question
Is the Level 1/2/3+ template and validation UX intuitive enough, or is too much of the internal template architecture exposed to operators?

## Hypothesis
The spec-folder model remains valuable, but Public exposes too much template-engine and validation ceremony compared with Relay's lighter workflow authoring experience.

## Method
Reviewed the templates overview, level specifications, template guide, and strict validator help/output, then compared them with Relay's workflow quick-start and YAML authoring surface.

## Evidence
- Public's template system explicitly documents `CORE + ADDENDUM v2.2`, separate `core/`, `addendum/`, `level_1` through `level_3+`, plus supporting template families such as `handover`, `debug-delegation`, `changelog`, and `sharded`. [SOURCE: .opencode/skill/system-spec-kit/templates/README.md:27-59]
- The level model adds not just files but large content growth, with guidance citing roughly `~455 LOC` for Level 1, `~875 LOC` for Level 2, and `~1090 LOC` for Level 3. [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:48-73]
- The template guide requires copying from canonical templates, preserving numbering and emojis, filling every placeholder, keeping irrelevant sections as `N/A`, and validating before coding. [SOURCE: .opencode/skill/system-spec-kit/references/templates/template_guide.md:168-237] [SOURCE: .opencode/skill/system-spec-kit/references/templates/template_guide.md:714-748]
- Strict validation turns warnings into failures and advertises a growing rule set including `FILE_EXISTS`, `PLACEHOLDER_FILLED`, `SECTIONS_PRESENT`, `PRIORITY_TAGS`, `EVIDENCE_CITED`, `ANCHORS_VALID`, `TOC_POLICY`, `PHASE_LINKS`, and `SPEC_DOC_INTEGRITY`. [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:80-99] [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:500-524]
- Relay's workflow docs instead start from one runner that accepts YAML, TypeScript, or Python workflows and a compact authoring model with agents, steps, and dependencies. [SOURCE: external/packages/sdk/src/workflows/README.md:1-27] [SOURCE: external/packages/sdk/src/workflows/README.md:125-140]

## Analysis
Public's richer spec packet gives stronger auditability than Relay's workflow-only approach, so removing spec folders would be the wrong conclusion. The real UX issue is exposure: operators do not need to think in terms of `core/` vs `addendum/`, template footers, or validator rule names in ordinary use. Relay demonstrates the benefit of meeting the user at a higher abstraction layer while keeping the lower-level contract real.

## Conclusion
confidence: medium
finding: Public should keep spec folders and the level system, but simplify the operator-facing template UX so users select an outcome and level while the underlying `CORE + ADDENDUM` and strict-rule machinery stays mostly behind the scenes.

## Adoption recommendation for system-spec-kit
- **Target file or module:** template onboarding docs, spec-folder creation surfaces, validator messaging
- **Change type:** template UX simplification
- **Blast radius:** medium
- **Prerequisites:** decide which parts of template architecture are operator-facing versus maintainer-facing
- **Priority:** nice-to-have (adopt now)

## UX / System Design Analysis

- **Current system-spec-kit surface:** Operators can encounter level selection, `CORE + ADDENDUM`, multiple template directories, placeholder rules, and strict validator rule names.
- **External repo's equivalent surface:** Relay mostly asks the user to define a workflow or coordination mode; the lower-level mechanics stay in the SDK and runner.
- **Friction comparison:** Public offers stronger governance but at higher cognitive load. Relay creates less friction because workflow authoring starts with one compact mental model instead of a visible documentation architecture.
- **What system-spec-kit could DELETE to improve UX:** Delete `CORE + ADDENDUM` as a primary operator-facing concept and stop presenting validator internals as front-door knowledge.
- **What system-spec-kit should ADD for better UX:** Add a level chooser and creation flow that shows only the selected outcome, file set, and why that level was chosen.
- **Net recommendation:** SIMPLIFY

## Counter-evidence sought
Looked for evidence that operators already interact only with level-specific templates and never see the internal architecture; the docs still surface `CORE + ADDENDUM`, file-copy mechanics, and detailed adherence rules directly.

## Follow-up questions for next iteration
- Which template details genuinely help operators versus only helping maintainers?
- Could strict validation errors be translated into friendlier task-language messages?
- Would a generated "what this level creates" preview remove most of the current confusion?
