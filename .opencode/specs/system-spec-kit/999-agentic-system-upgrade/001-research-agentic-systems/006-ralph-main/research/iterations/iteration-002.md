# Iteration 002 — Tradeoffs of Clean Restarts

## Research question
What tradeoffs does Ralph's clean-context loop create, and should `system-spec-kit` replace its richer continuity stack with the same model?

## Hypothesis
Ralph lowers context drift, but pays for it with repeated setup work and weaker recovery when durable artifacts are thin.

## Method
Compared Ralph's required restart steps in `external/prompt.md` and `external/README.md` against `system-spec-kit`'s memory and handover documentation in `.opencode/skill/system-spec-kit/references/memory/memory_system.md` and `.opencode/skill/system-spec-kit/templates/handover.md`.

## Evidence
- Every Ralph iteration must re-read `prd.json`, re-read `progress.txt`, verify the branch, pick one unfinished story, and append a new progress entry before yielding. [SOURCE: external/prompt.md:7-17] [SOURCE: external/prompt.md:18-35]
- Ralph compensates for clean restarts by consolidating reusable patterns at the top of `progress.txt`; without that summary, each new run would restart from raw commit history plus unchecked stories. [SOURCE: external/prompt.md:37-48]
- Ralph's README explicitly limits continuity to git history, `progress.txt`, and `prd.json`; it does not describe richer semantic retrieval, causal links, or targeted recall. [SOURCE: external/README.md:163-169]
- `system-spec-kit` already provides vector search, importance tiers, checkpoints, constitutional rules, and intent-aware memory retrieval, which are designed to preserve more than the last linear execution trace. [SOURCE: .opencode/skill/system-spec-kit/references/memory/memory_system.md:15-18] [SOURCE: .opencode/skill/system-spec-kit/references/memory/memory_system.md:28-35] [SOURCE: .opencode/skill/system-spec-kit/references/memory/memory_system.md:99-145]
- `system-spec-kit` also has a formal handover template that preserves decisions, blockers, next actions, and exact files to review, which is broader than Ralph's progress log. [SOURCE: .opencode/skill/system-spec-kit/templates/handover.md:20-29] [SOURCE: .opencode/skill/system-spec-kit/templates/handover.md:62-77]

## Analysis
Ralph works because it narrows the problem aggressively. The agent never needs to reconstruct a broad project state; it only needs to finish the next tiny story. `system-spec-kit` solves a broader problem space: paused implementation, deep research, multi-phase packets, recovery after compaction, and cross-session context loading. Replacing those richer continuity surfaces with Ralph's minimal stack would throw away capabilities that the repo explicitly relies on. The right lesson is additive: keep rich retrieval, but make restart packets smaller when the task is narrow.

## Conclusion
confidence: medium

finding: Ralph's clean-context tradeoff is acceptable because the system is deliberately small and linear. `system-spec-kit` should not replace Spec Kit Memory or handover documents with a Ralph-style minimal continuity model. The current stack addresses a wider and more failure-prone class of workflows.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/references/memory/memory_system.md`
- **Change type:** rejected
- **Blast radius:** large
- **Prerequisites:** none
- **Priority:** rejected

## Counter-evidence sought
I looked for evidence that Ralph preserves richer recovery context than `progress.txt` plus PRD state and did not find it. The bundled repo documents no semantic retrieval or structured handover equivalent. [SOURCE: external/README.md:132-145] [SOURCE: external/prompt.md:18-48]

## Follow-up questions for next iteration
- If git should not replace memory, what git-derived signals are still worth importing into memory artifacts?
- Can `system-spec-kit` add a compact restart digest without weakening the richer retrieval model?
- Which Ralph artifact is the best candidate for selective adoption: commits, `progress.txt`, or `prd.json`?
