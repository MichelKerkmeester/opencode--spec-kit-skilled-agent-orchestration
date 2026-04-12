# Iteration 010 — Adopt vs Reject Boundary

## Research question
Which Ralph patterns should `system-spec-kit` adopt now, prototype later, or reject so the result stays complementary to richer internal orchestration rather than replacing it?

## Hypothesis
The right outcome is a selective overlay: import Ralph's discipline and compact bridge artifacts, but reject replacement of the repo's richer memory and lineage systems.

## Method
Synthesized the prior nine iterations against the phase brief's scoping rules, Ralph's README/runtime contract, and `system-spec-kit`'s current command/memory architecture.

## Evidence
- The phase brief explicitly frames this phase as the owner of "minimal Bash loop, archive/reset behavior, and one-story-per-iteration discipline" and warns against drifting into richer deterministic-runtime concerns owned elsewhere. [SOURCE: phase-research-prompt.md:19-29] [SOURCE: phase-research-prompt.md:134-137]
- Ralph's runtime remains intentionally small: fresh iteration, PRD/progress state, stop sentinel, archive on branch change. [SOURCE: external/ralph.sh:42-113]
- Ralph's README centers the system on repeated fresh invocations with memory limited to git, `progress.txt`, and `prd.json`. [SOURCE: external/README.md:5-6] [SOURCE: external/README.md:163-169]
- `system-spec-kit` is architecturally broader: deep research alone spans setup, YAML workflow execution, convergence detection, synthesized reporting, and memory save. [SOURCE: .opencode/command/spec_kit/deep-research.md:115-154]
- The memory system adds semantic retrieval, checkpoints, causal tools, and constitutional always-surface rules beyond anything Ralph attempts. [SOURCE: .opencode/skill/system-spec-kit/references/memory/memory_system.md:15-35] [SOURCE: .opencode/skill/system-spec-kit/references/memory/memory_system.md:99-145]

## Analysis
The key boundary is architectural intent. Ralph is a tiny execution spine for one narrow class of work: linear, story-sized, verification-heavy coding loops. `system-spec-kit` is a broader governance and continuity system. Treating Ralph as a replacement would erase strengths the current repo already has. Treating it as a set of overlays keeps the adoption clean: better task sizing, lighter restart artifacts, explicit promotion of reusable learnings, and optionally a very thin wrapper around current commands.

## Conclusion
confidence: medium

finding: Ralph should influence `system-spec-kit` as a simplification overlay, not as a new source-of-truth runtime. Adopt the parts that sharpen execution discipline and restart clarity; reject the parts that would collapse semantic memory, lineage, and phased governance back into branch-local shell state.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md`
- **Change type:** added option
- **Blast radius:** small
- **Prerequisites:** finalize the adopt/prototype/reject matrix so user-facing guidance stays consistent
- **Priority:** nice-to-have

## Counter-evidence sought
I looked for evidence that Ralph solves the same scope of lifecycle/governance problems as `system-spec-kit` and found none; the bundled repo remains intentionally narrower throughout code and docs. [SOURCE: external/README.md:88-145] [SOURCE: .opencode/command/spec_kit/deep-research.md:147-174]

## Follow-up questions for next iteration
- None. This iteration closes the adoption boundary and feeds directly into synthesis.
