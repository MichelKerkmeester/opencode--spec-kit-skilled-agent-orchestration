# Iteration 006 — Executable Methodology Packs

Date: 2026-04-09

## Research question
Is executable methodology packaging a better reuse primitive than prose-only workflow references for `system-spec-kit`?

## Hypothesis
Babysitter's methodology library will be more reusable because it packages workflows as executable processes with guards and tasks, not just as explanatory markdown.

## Method
I inspected Babysitter's `state-machine-orchestration` methodology and its `spec-kit-orchestrator` methodology, then compared that model with `system-spec-kit`'s current reference-heavy skill structure.

## Evidence
- `state-machine-orchestration` encodes explicit states, transition history, and entry/exit actions rather than describing them informally. [SOURCE: external/library/methodologies/state-machine-orchestration.js:11-21] [SOURCE: external/library/methodologies/state-machine-orchestration.js:159-236]
- The Babysitter `spec-kit-orchestrator` packages the Spec Kit lifecycle as `defineTask(...)` units for constitution, specification, clarification, planning, decomposition, analysis, implementation, and checklist validation. [SOURCE: external/library/methodologies/spec-kit/spec-kit-orchestrator.js:14-108]
- The same methodology inserts enforced review breakpoints between constitution, specification, and analysis phases, so the reusable asset includes both tasks and governance. [SOURCE: external/library/methodologies/spec-kit/spec-kit-orchestrator.js:144-170] [SOURCE: external/library/methodologies/spec-kit/spec-kit-orchestrator.js:198-250]
- `system-spec-kit` currently organizes reuse primarily through markdown resource domains such as `references/memory/`, `references/workflows/`, and `references/templates/`, with scripts as separate operational tools. [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:90-118]

## Analysis
Babysitter's library turns methodology into an executable asset: the reusable unit can carry state transitions, phase guards, and breakpoints. That is meaningfully different from a markdown workflow guide because the consumer inherits behavior, not just instructions. [SOURCE: external/library/methodologies/state-machine-orchestration.js:11-21] [SOURCE: external/library/methodologies/spec-kit/spec-kit-orchestrator.js:14-108]

`system-spec-kit` already has strong documentation assets, but they are still mostly reference material plus separately maintained scripts. Babysitter suggests an intermediate layer: executable methodology packs for a few high-value workflows, while keeping markdown as explanation and onboarding. [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:90-118]

## Conclusion
confidence: medium

finding: Executable methodology packs are promising for `system-spec-kit`, especially for repeatable, multi-phase workflows like deep research, deep review, and completion gating. This is valuable, but lower priority than runtime-enforced gates and runtime-manifest cleanup because it introduces a bigger authoring-model shift.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/references/workflows/`, `.opencode/skill/system-spec-kit/scripts/core/`, and future workflow-pack modules under `.opencode/skill/system-spec-kit/`
- **Change type:** new module
- **Blast radius:** large
- **Prerequisites:** choose a minimal executable-pack format and decide which existing workflows graduate from prose to code first
- **Priority:** nice-to-have

## Counter-evidence sought
I looked for existing executable methodology packs inside `system-spec-kit` and found strong markdown routing plus scripts, but not reusable workflow modules comparable to Babysitter's methodology library. [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:90-118]

## Follow-up questions for next iteration
- If executable methodology packs are introduced, how should they resolve runtime-specific agent directories?
- Which reusable metadata belongs in a manifest versus inside each workflow pack?
- Is Babysitter's full plugin marketplace necessary, or is manifest metadata enough?
