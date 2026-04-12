# Iteration 022 — Lifecycle Split Versus Integrated Flow

## Research question
Does the current `plan -> implement -> complete` split plus a parallel `/memory:*` surface create unnecessary fragmentation compared with BAD's single integrated coordinator flow?

## Hypothesis
The local lifecycle split is useful internally, but the operator-facing separation is too exposed. BAD's integrated flow suggests `system-spec-kit` should merge more of the common path into one orchestrated surface.

## Method
Compared BAD's coordinator phases to local command chaining, memory command boundaries, and workflow-asset layering.

## Evidence
- BAD runs one domain-shaped pipeline with internal phases for dependency prep, story selection, create/dev/review/PR execution, and continuation checks. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:72-99] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:212-336]
- Local `spec_kit` documents a 3-command lifecycle (`plan`, `implement`, `complete`) plus separate `resume`, `handover`, `debug`, and deep-loop commands. [SOURCE: .opencode/command/spec_kit/README.txt:43-76] [SOURCE: .opencode/command/spec_kit/README.txt:121-145]
- Local memory docs explicitly position `/spec_kit:resume` as the recovery surface while still keeping `/memory:search`, `/memory:manage`, and `/memory:learn` in a separate family. [SOURCE: .opencode/command/memory/README.txt:38-40] [SOURCE: .opencode/command/memory/README.txt:308-320]
- The operator-facing command docs also expose a large workflow-asset matrix, which reinforces that the lifecycle is implemented as many adjacent bundles rather than one cohesive guided path. [SOURCE: .opencode/command/spec_kit/README.txt:85-111]

## Analysis
This is where command sprawl becomes architectural friction. Local commands are logically separated, but the most common path still crosses multiple surfaces: spec lifecycle, memory recovery, and autonomous workflow assets. BAD shows the value of one visible run-loop, even when its internals are composed of many steps. The local equivalent should be a merged operator path, not necessarily a merged internal implementation.

## UX / System Design Analysis

- **Current system-spec-kit surface:** Operators must decide whether they are planning, implementing, completing, resuming, saving memory, or managing memory before the system helps them.
- **External repo's equivalent surface:** BAD exposes one main coordinator run path and handles phase progression internally.
- **Friction comparison:** Local UX imposes more choice points and more command-boundary knowledge. BAD concentrates complexity in the orchestration layer instead of the operator's mental model.
- **What system-spec-kit could DELETE to improve UX:** Delete the expectation that operators should understand YAML workflow bundle boundaries or manually compose the common lifecycle from separate command families.
- **What system-spec-kit should ADD for better UX:** Add a merged "guided lifecycle" surface that owns the common path from planning through completion, with memory save/resume integrated by default.
- **Net recommendation:** MERGE

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** separate lifecycle, recovery, and memory surfaces with explicit command boundaries.
- **External repo's approach:** one coordinator flow whose phases are internally staged.
- **Why the external approach might be better:** it minimizes operator decision points and encourages the system to own handoffs.
- **Why system-spec-kit's approach might still be correct:** advanced users benefit from independently callable primitives, and the local system covers more domains than BAD.
- **Verdict:** MERGE
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** keep the underlying commands, but add a first-class integrated lifecycle surface that chains `plan`, `implement`, `complete`, save/resume, and continuation defaults for the standard path.
- **Blast radius of the change:** high
- **Migration path:** ship an integrated wrapper first, then progressively make the underlying commands feel more advanced/secondary in docs.

## Conclusion
confidence: high

finding: The `plan -> implement -> complete` split is a good internal decomposition, but it is too visible as operator UX. `system-spec-kit` should merge the common lifecycle path into a guided surface that also absorbs the most common memory handoffs.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/spec_kit/README.txt`
- **Change type:** UX and workflow merge
- **Blast radius:** high
- **Prerequisites:** define the standard lifecycle contract and decide which memory actions become implicit defaults versus advanced controls
- **Priority:** must-have

## Counter-evidence sought
I checked whether current docs already present a single dominant lifecycle wrapper. They explain command dependencies well, but they still leave composition responsibility mostly with the operator.

## Follow-up questions for next iteration
If the lifecycle should stay richer than BAD's, can the spec-folder and template experience absorb that complexity more gracefully?
