# Iteration 003 — Runtime-Enforced Gates

Date: 2026-04-09

## Research question
Does Babysitter's process-code authority plus mandatory-stop runtime offer a stronger enforcement model than `system-spec-kit`'s documentation-surfaced gates?

## Hypothesis
Babysitter will prove stronger because the process code defines the only legal next steps, while `system-spec-kit` gates are still primarily expressed as documents and YAML conventions.

## Method
I compared Babysitter's runtime authority model from README and execution code with `system-spec-kit`'s constitutional gate memory and deep-research command workflow.

## Evidence
- Babysitter's architecture makes the JavaScript process the authority, treats breakpoints as enforced human gates, and stores every decision in an immutable journal. [SOURCE: external/README.md:319-376]
- When a process requests unresolved work, `orchestrateIteration` returns `waiting` plus explicit `nextActions` instead of allowing execution to continue speculatively. [SOURCE: external/packages/sdk/src/runtime/orchestrateIteration.ts:106-114] [SOURCE: external/packages/sdk/src/runtime/orchestrateIteration.ts:217-224]
- The process context only exposes approved intrinsics like `task`, `breakpoint`, `sleepUntil`, `hook`, and `parallel`, which constrains what a process may do at runtime. [SOURCE: external/packages/sdk/src/runtime/processContext.ts:57-75]
- `system-spec-kit`'s constitutional gate file explicitly says the full gate definitions live in `AGENTS.md`, meaning the enforcement contract is surfaced from documentation rather than from a dedicated runtime engine. [SOURCE: .opencode/skill/system-spec-kit/constitutional/gate-enforcement.md:51-69]
- The current deep-research command defines a YAML loop manager and outputs packet files, but it does not describe a runtime that hard-stops the workflow at machine-checkable gate boundaries the way Babysitter does. [SOURCE: .opencode/command/spec_kit/deep-research.md:115-173]

## Analysis
Babysitter's main transferable idea is not just "use breakpoints." It is "the runtime can only advance when the process code has produced an allowed next action." That is a stronger invariant than a prompt, rulebook, or YAML convention that depends on the active model following instructions. [SOURCE: external/README.md:319-376] [SOURCE: external/packages/sdk/src/runtime/orchestrateIteration.ts:106-114]

`system-spec-kit` already has well-designed gate content, but the current authority lives mostly in constitutional text and workflow definitions. That means the system is strong on guidance and auditing, but weaker on mechanically proving that a gate was actually satisfied before progression. [SOURCE: .opencode/skill/system-spec-kit/constitutional/gate-enforcement.md:51-69] [SOURCE: .opencode/command/spec_kit/deep-research.md:115-173]

## Conclusion
confidence: high

finding: This is the most important Babysitter lesson for `system-spec-kit`: move high-risk workflows from "instruction-enforced" gates toward "runtime-enforced" gates. The current system has the right policies, but Babysitter shows how to make those policies executable and replayable rather than advisory.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`, and `.opencode/skill/system-spec-kit/constitutional/gate-enforcement.md`
- **Change type:** architectural shift
- **Blast radius:** large
- **Prerequisites:** define a machine-readable gate state model and a minimal runtime executor for `spec_kit` workflows
- **Priority:** must-have

## Counter-evidence sought
I looked for an existing `system-spec-kit` runtime component that turns constitutional gates into hard stop states and found workflow definitions plus constitutional guidance, but not a comparable enforcement loop. [SOURCE: .opencode/skill/system-spec-kit/constitutional/gate-enforcement.md:51-69] [SOURCE: .opencode/command/spec_kit/deep-research.md:115-173]

## Follow-up questions for next iteration
- How should auto mode record gate bypasses if the runtime starts enforcing approvals explicitly?
- Which existing `spec_kit` workflows are safest to pilot with runtime-enforced gates first?
- Can a lighter-weight event journal support runtime-enforced gates without adopting Babysitter wholesale?
