# Iteration 019 — Keep Durable Spec Docs; Reject README Minimalism As A Replacement

Date: 2026-04-10

## Research question
Does the external repo's minimal documentation posture imply that `system-spec-kit` should replace its durable spec-folder lifecycle with a README-like workflow model?

## Hypothesis
No. The external repo is intentionally narrow; its minimal docs are not a good substitute for `system-spec-kit`'s durable planning and verification contracts.

## Method
I compared the external repo's published file set with `system-spec-kit`'s spec-creation and validation contracts to judge whether the current durable doc lifecycle is solving a different class of problem.

## Evidence
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/README.md:19-55] The external repo explains one focused loop and its runtime semantics.
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/README.md:162-177] The repo structure is intentionally small: workflow, agent docs, loop docs, and license.
- [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/create.sh:225-244] `system-spec-kit` explicitly creates different documentation depths with checklists, decision records, and AI-protocol content because it supports larger feature governance.
- [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:80-99] Validation expects durable feature artifacts such as `checklist.md` and `decision-record.md`, not just a workflow README.
- [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:270-282] Level detection is keyed off the presence of durable governance files, which means the system is deliberately built for more than one focused runtime loop.

## Analysis
This is the second place where external minimalism is easy to overread. Get It Right is documenting one behaviorally tight product. `system-spec-kit` is coordinating multi-session planning, implementation, completion, validation, and memory preservation across many task types. The current spec lifecycle is heavy, but it is heavy in service of those broader responsibilities. Replacing it with README-style documentation would remove precisely the artifacts that make long-running packet work auditable and resumable. The better lesson is narrower: keep durable feature docs, but keep retry packets lighter.

## Conclusion
confidence: high
finding: Get It Right's minimal docs are a good model for loop-local runtime explanation, but not for replacing `system-spec-kit`'s durable spec-folder lifecycle.

## Adoption recommendation for system-spec-kit
- **Target file or module:** spec lifecycle architecture
- **Change type:** rejected
- **Blast radius:** large
- **Prerequisites:** none
- **Priority:** rejected

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** durable feature work uses spec, plan, tasks, checklist, and decision-record artifacts with explicit validation.
- **External repo's approach:** one compact repo explains one focused retry controller through a small set of docs.
- **Why the external approach might be better:** it is easier to scan and cheaper to maintain for a single workflow product.
- **Why system-spec-kit's approach might still be correct:** durable spec docs are doing long-lived governance, handoff, and verification work that the external repo does not attempt.
- **Verdict:** KEEP
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** none for the global spec lifecycle; apply simplification only to retry-local packet design.
- **Blast radius of the change:** large if misapplied
- **Migration path:** preserve current durable packet docs while allowing loop-local surfaces to stay much smaller.

## Counter-evidence sought
I looked for evidence that `system-spec-kit` users no longer need checklists, decision records, or validated packet structure. The code and scripts still assume those artifacts are first-class.

## Follow-up questions for next iteration
- How should retry-local surfaces relate back to durable packet docs?
- Which parts of the current doc lifecycle are feature-critical versus loop-specific?
- Can command docs become more README-like without weakening packet governance?
