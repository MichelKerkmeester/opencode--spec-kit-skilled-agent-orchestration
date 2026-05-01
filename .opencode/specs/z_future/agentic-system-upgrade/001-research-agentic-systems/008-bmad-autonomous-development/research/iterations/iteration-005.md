# Iteration 005 — Four-Step Pipeline Contracts

## Research question
What does BAD's four-step story pipeline actually enforce, and could local autonomous implementation benefit from equally explicit staged contracts?

## Hypothesis
BAD's biggest transferable idea is not its sprint backlog format but its stage-specific contracts, state transitions, and between-step safety checks.

## Method
Read BAD's Step 1-4 instructions plus pre-continuation checks, then compared them to the current autonomous implementation workflow's development and completion phases.

## Evidence
- BAD splits each story into Step 1 create, Step 2 develop, Step 3 code review, and Step 4 PR/CI, with explicit restart points based on prior status. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:189-205]
- BAD updates shared `sprint-status.yaml` after Step 1 (`ready-for-dev`), after Step 2 (`review`), and after Step 4 (`done`), making state transitions explicit instead of implicit. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:231-235]
- BAD reserves a higher-quality model for Step 3 review and requires step-by-step failure reporting so one broken story does not block the rest of the batch. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:255-336]
- BAD runs pre-continuation checks between steps to compact context or pause on rate limits before proceeding. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/references/pre-continuation-checks.md:1-88]
- Local autonomous implementation currently has one broad development phase followed by completion, with optional code/testing parallelism but without explicit stage-transition artifacts between create, build, review, and PR work. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:367-473]

## Analysis
The local implementation workflow is well structured, but its main execution block is still comparatively coarse-grained. BAD demonstrates the benefit of stage contracts for long unattended runs: each stage has a narrow objective, writes a state transition, and triggers a coordinator-only checkpoint before the next step begins. That is a strong fit for `system-spec-kit`, because the repo already values checklists, completion gates, and resumable state. Unlike BAD's story backlog specifics, staged contracts can transfer without importing the entire BMad method.

## Conclusion
confidence: high

finding: Explicit stage contracts are the clearest adoption candidate from BAD. `system-spec-kit`'s autonomous implementation flow would become easier to resume, audit, and stop safely if Step 6 were decomposed into named sub-stages with mandatory checkpoint outputs and coordinator checks between them.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml`
- **Change type:** modified existing
- **Blast radius:** medium
- **Prerequisites:** define a minimal stage-state schema so pauses and resumes know which sub-stage completed
- **Priority:** must-have

## Counter-evidence sought
I looked for existing local sub-stage state markers inside the autonomous implement YAML; current checkpoints exist before and after development, but not as a full create/build/review/PR sequence.

## Follow-up questions for next iteration
Would BAD's model tiering make those staged contracts cheaper to run locally?
How much does BAD's PR/CI loop rely on having a separate review stage?
Which local command assets already have parity tests that could protect a new staged workflow?
