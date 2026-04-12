# Iteration 024 — Simplify Template Levels And Validation So The System Feels Guided Rather Than Hostile

Date: 2026-04-10

## Research question
Does the external repo's lighter artifact model imply that `system-spec-kit`'s Level 1/2/3+ template architecture and strict validation UX are too cognitively expensive at the operator layer?

## Hypothesis
Partly yes. The durable packet model remains valuable, but the current template vocabulary and validator framing likely expose too much structure too early.

## Method
I compared the external repo's minimal shipped artifact set with the internal template architecture, level-selection guidance, and validator contract to identify where the mental model is useful versus where it becomes ceremony.

## Evidence
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/README.md:162-177] The external repo ships a very small artifact set: one workflow, three agent docs, three explanation docs, and a license.
- [SOURCE: .opencode/skill/system-spec-kit/templates/README.md:30-35] Internal templates use a CORE + ADDENDUM v2.2 architecture that already requires understanding composed versus source templates.
- [SOURCE: .opencode/skill/system-spec-kit/templates/README.md:42-60] The template tree spans `core`, `addendum`, four level folders, context, research, handover, debug, changelog, scratch, sharded, and composition hashes.
- [SOURCE: .opencode/skill/system-spec-kit/templates/README.md:66-84] The level model adds required files and workflow notes, including checklist verification and mandatory implementation summaries.
- [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:15-75] Level guidance explains compositional architecture, soft LOC thresholds, value layering, and multiple level semantics before actual work begins.
- [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:81-97] Even Level 1 requires four files and adaptation steps.
- [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:173-206] Level 2 adds checklist requirements and hard-block enforcement.
- [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:80-100] The validator exposes strict mode, recursive behavior, many rules, and warnings-as-errors semantics.

## Analysis
The external repo is too minimal to replace the packet model wholesale, but it does reveal where internal UX drifts from guidance into taxonomy. `system-spec-kit` has a strong documentation framework for high-accountability work, yet the operator-visible story currently begins with architecture vocabulary like CORE, ADDENDUM, composed templates, levels, recursive validation, and rule names. That is excellent for framework maintainers and experienced operators, but it is a lot to front-load for routine work. The better posture is to keep the durable artifact model while dramatically simplifying how the system explains itself: fewer visible levels, stronger defaults, and validator messages that feel assistive rather than constitutional.

## Conclusion
confidence: high
finding: keep spec folders and strict validation, but simplify the operator mental model to stronger defaults and fewer visible documentation modes.

## Adoption recommendation for system-spec-kit
- **Target file or module:** template routing, level-selection UX, and validator messaging
- **Change type:** operator-surface simplification
- **Blast radius:** medium
- **Prerequisites:** separate framework-maintainer concepts from operator-facing concepts
- **Priority:** should-have

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** operators are exposed to level ladders, composed-template architecture, and strict validation rule machinery.
- **External repo's approach:** the operator mainly sees a small set of artifacts and one workflow purpose.
- **Why the external approach might be better:** it makes the system legible faster, especially for repeat but non-framework-specialist users.
- **Why system-spec-kit's approach might still be correct:** durable specs, checklists, and validation are real differentiators for complex work.
- **Verdict:** SIMPLIFY
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** preserve Level 1/2/3+ internally, but expose a simpler operator model such as standard, verified, and architectural, with the system auto-selecting the exact underlying template set.
- **Blast radius of the change:** templates docs, create/validate scripts, and onboarding materials.
- **Migration path:** keep current folders and validators, but redesign docs and command prompts so most users see defaults and rationale rather than the full template architecture.

## UX / System Design Analysis

- **Current system-spec-kit surface:** operators must understand levels, file requirements, composed templates, and strict validator rules.
- **External repo's equivalent surface:** operators mostly understand one workflow and a few docs.
- **Friction comparison:** internal UX yields better auditability, but much higher cognitive load because the documentation system itself becomes part of the task.
- **What system-spec-kit could DELETE to improve UX:** early exposure to CORE + ADDENDUM composition details and too much level jargon in normal flows.
- **What system-spec-kit should ADD for better UX:** auto-selected documentation defaults and validator messages that recommend the next repair action in plain language.
- **Net recommendation:** SIMPLIFY

## Counter-evidence sought
I looked for evidence that lower-friction docs would undermine audit quality. The validator and required artifacts still provide that safety; what feels optional to change is the amount of architectural explanation exposed up front.

## Follow-up questions for next iteration
- Can the visible level model collapse into fewer operator-facing names?
- Which validator outputs most often feel punitive instead of directional?
- Should template architecture remain documented only in maintainer-facing references?
