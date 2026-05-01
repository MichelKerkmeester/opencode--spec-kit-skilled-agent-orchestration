# Iteration 026 — LEAF Iteration Architecture vs Ralph's Simple Loop

## Research question
Is Ralph's extremely simple iteration model a signal that `system-spec-kit` should replace its LEAF-agent, JSONL-state, reducer-style deep research and deep review architecture?

## Hypothesis
Ralph's minimal loop is a strong pattern for narrow execution, but deep research and deep review are the places where `system-spec-kit`'s richer iteration architecture is probably earning its complexity.

## Method
Compared Ralph's shell loop, completion sentinel, and tiny state bundle with the deep-research and deep-review contracts that use fresh context, scoped write surfaces, and append-only state plus progressive synthesis.

## Evidence
- Ralph's loop is intentionally thin: spawn a fresh tool, check for completion, and stop after max iterations. [SOURCE: external/ralph.sh:84-113]
- `system-spec-kit`'s deep-research agent is explicitly designed as a single-iteration LEAF that writes iteration artifacts, appends JSONL state, and contributes to progressive synthesis. [SOURCE: .opencode/agent/deep-research.md:22-33] [SOURCE: .opencode/agent/deep-research.md:121-205]
- The deep-review workflow uses similar externalized state and reducer ownership because review findings, claim adjudication, and convergence logic need more structure than a single sentinel string can provide. [SOURCE: .opencode/agent/deep-review.md:21-31] [SOURCE: .opencode/agent/deep-review.md:124-236] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:20-35]

## Analysis
This is one of the clearest "do not over-simplify" signals in the entire study. Ralph works because its per-iteration question is always "what is the next executable story?" Deep research and deep review instead need evidence accumulation, convergence detection, scoped write control, and progressive synthesis across iterations. That additional state is not accidental ceremony; it is the mechanism that makes the loops reliable. The simplification opportunity is around operator-facing explanation, not around deleting the LEAF model.

## Conclusion
confidence: high

finding: `system-spec-kit` should NOT replace deep research or deep review with Ralph's thinner shell-loop architecture.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/agent/deep-research.md`
- **Change type:** no change recommended
- **Blast radius:** architectural
- **Prerequisites:** none
- **Priority:** rejected

## UX / System Design Analysis

- **Current system-spec-kit surface:** Deep loops use fresh-context iterations, scoped artifacts, JSONL state, and reducer-style synthesis.
- **External repo's equivalent surface:** Ralph uses a minimal runner, tiny persisted state, and a completion sentinel.
- **Friction comparison:** Ralph is much lighter, but it is solving a simpler loop. For research and review work, `system-spec-kit`'s extra state reduces ambiguity and supports convergence in a way Ralph's loop does not.
- **What system-spec-kit could DELETE to improve UX:** Delete over-explanation of internal reducer mechanics from operator-facing docs, not the mechanics themselves.
- **What system-spec-kit should ADD for better UX:** Add a short explanation of why deep loops are intentionally heavier than normal execution loops so operators do not expect Ralph-style simplicity in the wrong place.
- **Net recommendation:** KEEP

## Counter-evidence sought
I looked for proof that Ralph's sentinel-and-progress model can already carry multi-iteration evidence synthesis and structured review adjudication, but the repo does not target that workflow class. [SOURCE: external/README.md:170-188] [SOURCE: external/README.md:205-207]

## Follow-up questions for next iteration
- If deep-loop complexity is justified, is the real over-design pressure instead in the skills system and the gate ceremony that routes into it?
