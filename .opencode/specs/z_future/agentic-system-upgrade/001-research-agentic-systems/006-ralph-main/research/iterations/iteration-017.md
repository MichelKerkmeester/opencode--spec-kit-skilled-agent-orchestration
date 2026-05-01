# Iteration 017 — Reject Ralph's Thin Failure Model

## Research question
Should `system-spec-kit` simplify its deep-loop failure handling down toward Ralph's sentinel-and-max-iterations model?

## Hypothesis
Ralph's failure model is readable and adequate for a tiny loop, but it is too shallow for `system-spec-kit`'s broader autonomous workflows.

## Method
Re-read Ralph's runtime control flow around tool execution and stop conditions, then compared it with the richer status taxonomy and error handling documented in the deep-research agent and command.

## Evidence
- Ralph validates the tool choice, runs the tool, ignores tool-process failure with `|| true`, checks only for the completion sentinel, then either continues or exits at max iterations. [SOURCE: external/ralph.sh:31-35] [SOURCE: external/ralph.sh:90-113]
- The README's debugging guidance is intentionally manual: inspect `prd.json`, `progress.txt`, and `git log`. [SOURCE: external/README.md:209-221]
- `system-spec-kit`'s deep-research agent distinguishes `complete`, `timeout`, `error`, `stuck`, `insight`, and `thought`, and the command defines explicit actions for dispatch timeout, missing state files, repeated failures, and memory-save failures. [SOURCE: .opencode/agent/deep-research.md:167-199] [SOURCE: .opencode/command/spec_kit/deep-research.md:252-260]

## Analysis
Ralph's model works because the loop is small and the operator is expected to inspect artifacts manually when something goes wrong. That does not scale well to `system-spec-kit`, where research, recovery, memory, and multi-phase packet behavior all depend on more structured failure states. The transparency of Ralph's loop is worth admiring, but the actual failure taxonomy should not be copied downward.

## Conclusion
confidence: high

finding: `system-spec-kit` should reject simplification toward Ralph's thin failure model. Its richer loop status and recovery handling are solving real problems that Ralph simply leaves to manual inspection.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/spec_kit/deep-research.md`
- **Change type:** rejected
- **Blast radius:** large
- **Prerequisites:** none
- **Priority:** rejected

## Counter-evidence sought
I looked for richer retry categorization, structured remediation paths, or differentiated failure outcomes in Ralph's runtime and did not find them. [SOURCE: external/ralph.sh:90-113]

## Follow-up questions for next iteration
- If thin failure handling is rejected, what is the real durable lesson about task sizing and runtime tolerance?
- Does Ralph's optional Amp auto-handoff weaken the repo's own "one iteration = one context window" story?
- How much onboarding burden comes from documentation form versus the actual runtime architecture?
