# Iteration 001 — Fresh Context Loop Value

## Research question
What concrete benefits does Ralph get from spawning a fresh AI instance every iteration, and where could `system-spec-kit` reuse that pattern?

## Hypothesis
Fresh-process iteration reduces context drift enough to justify repeated setup when the task state is small and durable.

## Method
Read `external/ralph.sh`, `external/prompt.md`, and `external/README.md` to trace Ralph's control loop, then compared that loop to `.opencode/agent/deep-research.md` and `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`.

## Evidence
- Ralph launches a brand-new Amp or Claude invocation inside each loop iteration and only decides whether to continue after checking for the completion sentinel. [SOURCE: external/ralph.sh:84-107]
- The per-iteration prompt explicitly forces the agent to re-read `prd.json` and `progress.txt`, pick one unfinished story, and stop after that single story. [SOURCE: external/prompt.md:7-17] [SOURCE: external/prompt.md:94-108]
- Ralph's README makes the architectural claim explicit: each iteration is a fresh instance and memory persists only via git history, `progress.txt`, and `prd.json`. [SOURCE: external/README.md:5-6] [SOURCE: external/README.md:163-169]
- `system-spec-kit` already uses the same fresh-context idea for deep research: the agent is defined as a single-iteration leaf, and the YAML loop dispatches it once per iteration with externalized state files. [SOURCE: .opencode/agent/deep-research.md:24-29] [SOURCE: .opencode/agent/deep-research.md:50-60] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:20-24] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:294-320]

## Analysis
Ralph's main benefit is not novelty, but discipline. By forcing every cycle through the same tiny bridge artifacts, it prevents the agent from carrying stale conversational state, sprawling TODOs, or accidental side quests. `system-spec-kit` already proves this works in the deep-research workflow, so the external repo is less a new mechanism than a validation that the pattern generalizes beyond research. The gap is that this rationale is encoded in internal agent/YAML machinery, not surfaced as a reusable design principle for other long-running autonomous workflows.

## Conclusion
confidence: high

finding: Ralph's strongest contribution is a small, restartable execution contract: fresh process, tiny durable state, one scoped unit of work, then exit. `system-spec-kit` already does this in deep research, so the adoption opportunity is not a new engine; it is making "fresh-context iteration" a first-class reusable pattern for future autonomous workflows.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/spec_kit/deep-research.md`
- **Change type:** modified existing
- **Blast radius:** small
- **Prerequisites:** none
- **Priority:** should-have

## Counter-evidence sought
I looked for hidden in-process memory retention or multi-story continuation logic in Ralph and did not find any; the loop stays intentionally stateless between invocations. [SOURCE: external/ralph.sh:84-113]

## Follow-up questions for next iteration
- What costs does Ralph pay for this discipline in duplicated setup and lost scratch state?
- Which `system-spec-kit` surfaces already cover those costs better than Ralph?
- Should the fresh-context principle be exported beyond deep research into implementation workflows?
