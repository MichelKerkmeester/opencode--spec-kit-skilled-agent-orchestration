# Iteration 010 — Applicability Boundaries And Phase Separation

Date: 2026-04-09

## Research question
When should a Get It Right-style retry loop be used inside `system-spec-kit`, and how should that stay separate from phase 001's optimization research?

## Hypothesis
The retry loop should be an opt-in control mode for brownfield understanding failures, while phase 001 remains about improving agents from collected feedback signals later.

## Method
I used the external "when to use" guidance and the phase brief's cross-phase boundaries, then mapped that onto internal command surfaces and loop infrastructure.

## Evidence
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/when-to-use.md:5-34] The external workflow is aimed at brownfield codebases where understanding is the bottleneck and where agents keep making the same category of mistakes.
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/when-to-use.md:35-52] It is explicitly not for greenfield work, simple isolated changes, or speed-first tasks.
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/phase-research-prompt.md:44-61] The phase brief says overlap with phase 001 should be noted only where retry feedback might later feed optimization systems, while keeping this phase focused on retry architecture and feedback transfer.
- [SOURCE: .opencode/command/spec_kit/deep-research.md:147-173] Internal command design already supports specialized modes with their own YAML workflows rather than forcing one default path for every task.
- [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:250-276] The internal deep-research loop already shows how a specialized opt-in controller can enforce its own convergence logic without taking over all workflows.
- [SOURCE: .opencode/skill/system-spec-kit/constitutional/gate-enforcement.md:62-69] Internal constitutional guidance already distinguishes different gate types and reinforces that workflow behavior is intentionally routed rather than globally uniform.

## Analysis
The external repo is very clear that this loop is a tool for a specific failure class, not a universal default. That matters even more in `system-spec-kit`, where many tasks are documentation-heavy, validation-heavy, or intentionally narrow. The right adoption is an explicit mode or companion command for complex brownfield implementation retries. Phase 001 can later mine retry outcomes for optimization or training signal, but phase 004 should stop at defining the retry controller and its state boundaries.

## Conclusion
confidence: high
finding: A Get It Right-style retry loop should enter `system-spec-kit` only as an opt-in mode for high-friction brownfield work. It should not become the default implementation path, and it should not absorb the optimization concerns that belong to phase 001.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/spec_kit/implement.md`
- **Change type:** modified existing
- **Blast radius:** small
- **Prerequisites:** write clear fit/non-fit guidance and name the retry mode distinctly so operators know when to reach for it
- **Priority:** must-have

## Counter-evidence sought
I looked for evidence that `system-spec-kit` prefers one universal workflow for all task classes. The existing command set already uses dedicated flows for deep research, deep review, resume, handover, and implement, which supports an opt-in retry mode rather than a forced default.

## Follow-up questions for next iteration
- Should the retry controller be exposed as a new command or as an advanced mode of `/spec_kit:implement`?
- What telemetry should phase 004 preserve so phase 001 can later consume it without coupling the two designs?
- Which default safety rails should guard against accidental use on trivial tasks?
