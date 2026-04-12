# Iteration 030 — End-To-End Workflow Friction And Oneclick Presets

Date: 2026-04-10

## Research question
How much friction does a common `system-spec-kit` feature workflow create end to end, and what should it borrow from Agent Lightning's quickstart and oneclick patterns?

## Hypothesis
Public's end-to-end workflow creates too many up-front decisions and artifacts for routine cases. The external repo suggests Public should add preset-driven "oneclick" starts without abandoning its spec and validation guarantees.

## Method
I walked the common Public feature path implied by `plan`, `complete`, template levels, `resume`, and memory save, then compared that to Agent Lightning's install -> docs -> example/tutorial -> `Trainer` or `oneclick` flow.

## Evidence
- Public's planning and complete workflows both start with consolidated prompt blocks that can ask about spec folder choice, execution mode, dispatch mode, memory context, research intent, and phase decomposition. [SOURCE: .opencode/command/spec_kit/plan.md:31-44] [SOURCE: .opencode/command/spec_kit/complete.md:32-45]
- The template model expands required artifacts from baseline docs through checklist, decision record, optional research output, and later completion artifacts. [SOURCE: .opencode/skill/system-spec-kit/references/templates/template_guide.md:18-24] [SOURCE: .opencode/skill/system-spec-kit/references/templates/template_guide.md:131-170]
- Resume and memory-save flows add more continuation-specific surfaces around handover, `session_bootstrap()`, and explicit memory preservation. [SOURCE: .opencode/command/spec_kit/resume.md:258-304] [SOURCE: .opencode/command/memory/save.md:57-75]
- Agent Lightning starts with `pip install agentlightning`, then points users to installation docs and examples. [SOURCE: external/README.md:31-45]
- The docs then direct readers into tutorials and how-to recipes rather than asking them to choose among many control surfaces. [SOURCE: external/docs/index.md:14-19]
- The `tinker` example explicitly offers a `oneclick` path that spawns the necessary pieces automatically, while still documenting the advanced distributed path. [SOURCE: external/examples/tinker/hello.py:22-29] [SOURCE: external/examples/tinker/hello.py:154-185]
- The first-agent tutorial likewise frames the happy path around configuring the trainer and calling `trainer.fit()`. [SOURCE: external/docs/how-to/train-first-agent.md:181-187]

## Analysis
Public's full workflow is heavier because it solves a heavier problem: scope binding, durable artifacts, verification, and cross-session continuity. That is justified. But the operator still encounters too many front-loaded choices for routine cases. Public currently optimizes for explicitness before momentum.

The external repo shows a more forgiving pattern: one quickstart path, one advanced path, and strong examples that teach by execution. Public should add preset-driven starts such as "new feature," "fix existing packet," and "research topic," each with recommended defaults for memory loading, dispatch mode, and artifact depth. The advanced matrix can remain available, but it should stop being the default experience.

## Conclusion
confidence: high

finding: `system-spec-kit` should add guided oneclick-style workflow presets for common jobs so operators can start safely with defaults and only drop into the full configuration matrix when needed.

## Adoption recommendation for system-spec-kit
- **Target file or module:** top-level workflow entrypoints and quickstart documentation
- **Change type:** capability addition
- **Blast radius:** medium
- **Prerequisites:** define safe defaults per preset, preserve full advanced mode access, and make preset choice visible at the start of the workflow
- **Priority:** should-have

## UX / System Design Analysis

- **Current system-spec-kit surface:** A common feature flow can require multiple setup decisions, 4-6 authored artifacts, later validation, explicit memory handling, and optional handover.
- **External repo's equivalent surface:** The happy path is "install, choose tutorial/example, run oneclick or trainer flow," with advanced distributed options documented separately.
- **Friction comparison:** Public has higher safety and auditability, but also higher startup cost, more questions asked, more files created, and more conceptual layers. Agent Lightning gets to usefulness faster.
- **What system-spec-kit could DELETE to improve UX:** Delete the assumption that routine work should begin with the full advanced setup matrix.
- **What system-spec-kit should ADD for better UX:** Add preset-driven quickstarts with safe defaults, similar in spirit to a oneclick path plus an advanced-mode escape hatch.
- **Net recommendation:** ADD

## Counter-evidence sought
I looked for evidence that preset-driven starts would be unsafe for Public, but the existing system already has enough enforcement and validation to make defaults viable as long as escape hatches remain obvious.

## Follow-up questions for next iteration
- Which presets cover most real usage: new feature, fix existing packet, resume, and deep research?
- How much of the current setup questionnaire can be inferred from a preset plus context?
- Should preset choice happen inside `/spec_kit:complete`, or should Public expose dedicated quickstart aliases?
