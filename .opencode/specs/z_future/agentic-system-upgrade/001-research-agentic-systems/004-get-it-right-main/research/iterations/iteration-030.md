# Iteration 030 — Redesign The End-To-End Feature Workflow Around Lower Friction Defaults

Date: 2026-04-10

## Research question
When compared end to end, does `system-spec-kit` ask the operator to traverse too many steps, files, and command surfaces to accomplish a normal feature workflow?

## Hypothesis
Yes. The system's strength is completeness, but the total friction across gates, commands, templates, skills, and memory workflows is now high enough to justify a more opinionated default path.

## Method
I walked the common internal feature path from spec selection through planning, implementation, validation, save, and handover, then compared that aggregate surface to the external repo's one-workflow model and small public artifact set.

## Evidence
- [SOURCE: .opencode/README.md:52-62] The framework currently exposes 12 agents, 20 skills, 21 commands, 83 templates, and 29 YAML assets.
- [SOURCE: .opencode/command/spec_kit/plan.md:171-200] Planning alone is a 7-step workflow with spec creation, clarification, planning, save context, and handover check.
- [SOURCE: .opencode/command/spec_kit/implement.md:171-205] Implementation is a separate 9-step workflow with preflight, development, postflight, save context, and handover.
- [SOURCE: .opencode/command/spec_kit/complete.md:198-229] End-to-end completion expands that into a 14-step lifecycle.
- [SOURCE: .opencode/skill/system-spec-kit/templates/README.md:66-84] Even the default documentation path implies multiple required files and checklist semantics depending on level.
- [SOURCE: .opencode/skill/README.md:65-70] Gate 2 skill routing is another default step in non-trivial work.
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/README.md:19-49] The external repo frames its end-to-end journey as one loop with four visible stages.
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/README.md:80-105] The external operator mostly tunes a few inputs instead of navigating a large workflow product.

## Analysis
Any one part of `system-spec-kit` is defensible in isolation: gates improve safety, templates improve traceability, skills improve specialization, memory improves continuity. The friction problem only becomes obvious when those layers stack. A normal feature request can require spec choice, command choice, skill routing, template level understanding, lifecycle mode selection, validation semantics, context-save expectations, and optional handover. The external repo is intentionally narrower, so it is not a direct replacement. But it usefully exposes the design smell: `system-spec-kit` has accumulated enough subsystems that the default path now needs stronger opinionated defaults and more invisible automation.

## Conclusion
confidence: high
finding: `system-spec-kit` should redesign its end-to-end default workflow around one lower-friction feature path, while preserving advanced surfaces as opt-in expert modes.

## Adoption recommendation for system-spec-kit
- **Target file or module:** full operator journey across commands, skills, templates, gates, and memory
- **Change type:** operator-workflow redesign
- **Blast radius:** architectural
- **Prerequisites:** define one opinionated default feature path and explicitly classify advanced surfaces as expert modes
- **Priority:** must-have

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** the end-to-end experience is assembled from many individually strong subsystems that the operator often has to navigate explicitly.
- **External repo's approach:** one focused workflow carries the user through the job with a small number of visible controls.
- **Why the external approach might be better:** it makes the happy path clear and keeps optional complexity behind the curtain.
- **Why system-spec-kit's approach might still be correct:** complex, audited, multi-phase work genuinely needs richer artifacts and controls.
- **Verdict:** REDESIGN
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** define one default feature workflow with automatic phase detection, inline memory handling, auto-selected documentation level, and a smaller visible command/skill vocabulary.
- **Blast radius of the change:** almost all operator-facing docs and wrapper flows.
- **Migration path:** ship the lower-friction default path first as an additive canonical route, measure adoption, then progressively demote expert-only surfaces in onboarding.

## UX / System Design Analysis

- **Current system-spec-kit surface:** a normal feature workflow touches multiple commands, gates, template decisions, skill routing, validation semantics, and memory steps.
- **External repo's equivalent surface:** one workflow with a small role set and a few explicit configuration knobs.
- **Friction comparison:** `system-spec-kit` delivers far more governance, but the aggregate step count and cognitive load are materially higher than the external repo's default path.
- **What system-spec-kit could DELETE to improve UX:** the expectation that operators should manually traverse each subsystem boundary in ordinary work.
- **What system-spec-kit should ADD for better UX:** one strongly opinionated default feature path that auto-handles routing, packet level, memory, and resume behavior.
- **Net recommendation:** REDESIGN

## Counter-evidence sought
I looked for evidence that the current complexity is mostly invisible in practice. The docs show the opposite: many surfaces are explicitly operator-facing, not merely internal implementation details.

## Follow-up questions for next iteration
- What should the single default feature path actually be called?
- Which advanced surfaces remain visible, and to whom?
- How should the system distinguish default path versus expert mode without losing trust?
