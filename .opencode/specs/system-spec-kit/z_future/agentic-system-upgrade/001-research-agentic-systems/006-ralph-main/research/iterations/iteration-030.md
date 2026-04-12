# Iteration 030 — End-to-End Workflow Friction

## Research question
When a user wants to add a feature, how much more friction does `system-spec-kit` impose end to end than Ralph's equivalent workflow, and what is the most valuable UX response?

## Hypothesis
The biggest UX gap is not one isolated command. It is the cumulative effect of many individually reasonable steps that add up to a much heavier default operator path.

## Method
Walked a representative `system-spec-kit` feature flow from Gate 3 through spec creation, planning, implementation, completion, context save, and optional handover, then compared it with Ralph's create-PRD -> convert -> run loop.

## Evidence
- Ralph's documented workflow is compact: create a PRD, convert it into Ralph's story format, then run the loop until complete. [SOURCE: external/README.md:88-130]
- `system-spec-kit`'s common feature flow can involve Gate 3, documentation-level decisions, planning prompts, implementation prompts, completion prompts, validation, memory save behavior, and optional handover/recovery tooling. [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:342-443] [SOURCE: .opencode/command/spec_kit/plan.md:31-145] [SOURCE: .opencode/command/spec_kit/implement.md:35-120] [SOURCE: .opencode/command/spec_kit/complete.md:1-4] [SOURCE: .opencode/command/spec_kit/handover.md:195-224]
- The repo already contains the ingredients for a smoother path, including `/spec_kit:resume`, hooks, and progressive enhancement, but they are not yet assembled into one obvious "start work" experience. [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:741-804] [SOURCE: .opencode/skill/system-spec-kit/references/workflows/quick_reference.md:21-45]

## Analysis
This comparison makes the UX verdict hard to ignore. Ralph asks the user to understand a small task loop. `system-spec-kit` asks the user to understand an operating system. The deeper machinery is not worthless; it is often justified. But the default feature path still needs a stronger frontend. The best response is not deleting the governed stack. It is designing a guided start experience that chooses the right lane, creates only the minimum necessary artifacts, and keeps advanced surfaces in reserve.

## Conclusion
confidence: high

finding: `system-spec-kit` should redesign the front door around a guided "start work" flow that chooses the right lane, provisions only the needed artifacts, and then drives the lifecycle on the operator's behalf.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md`
- **Change type:** modified existing
- **Blast radius:** architectural
- **Prerequisites:** define lane-selection criteria and how the guided start hands off to expert subflows when needed
- **Priority:** should-have

## UX / System Design Analysis

- **Current system-spec-kit surface:** The end-to-end workflow is powerful but step-dense: spec binding, level selection, planning, implementation, completion, validation, memory, and possible handover.
- **External repo's equivalent surface:** Ralph keeps one compact workflow with three legible stages and a single main execution loop.
- **Friction comparison:** `system-spec-kit` has much higher step count, more questions, more files created, and more terminology to internalize. Ralph has lower friction because it optimizes for one narrow happy path.
- **What system-spec-kit could DELETE to improve UX:** Delete the expectation that operators should manually assemble the lifecycle from several adjacent commands and support systems.
- **What system-spec-kit should ADD for better UX:** Add a guided "start work" front door that chooses between lightweight and governed lanes, sets up only the required artifacts, and keeps `/spec_kit:resume` as the recovery bridge.
- **Net recommendation:** REDESIGN

## Counter-evidence sought
I looked for proof that the current end-to-end experience is already fronted by a single guided command and found only partial ingredients, not a unified operator journey. [SOURCE: .opencode/skill/system-spec-kit/references/workflows/quick_reference.md:110-187] [SOURCE: .opencode/command/spec_kit/resume.md:200-223]

## Follow-up questions for next iteration
- None. This iteration closes Phase 3 and feeds directly into combined synthesis.
