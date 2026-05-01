# Iteration 019 — Visual Lifecycle Docs as UX Infrastructure

## Research question
Does Ralph's documentation and flowchart approach suggest that `system-spec-kit`'s operator UX is too text-heavy for teaching complex autonomous workflows?

## Hypothesis
For systems with strong process contracts, visual lifecycle docs can reduce onboarding cost more than yet another prose checklist.

## Method
Read Ralph's flowchart and packaging surfaces, then compared them with `system-spec-kit`'s current quick-reference and command-driven onboarding.

## Evidence
- Ralph treats the flowchart as a first-class artifact: the README links directly to the interactive diagram and documents how to run it locally from `flowchart/`. [SOURCE: external/README.md:147-159]
- The flowchart app hardcodes the end-to-end loop visually: write PRD, convert to `prd.json`, run `ralph.sh`, pick story, implement, commit, update state, log progress, then decide whether more stories remain. [SOURCE: external/flowchart/src/App.tsx:37-50] [SOURCE: external/flowchart/src/App.tsx:141-155]
- `system-spec-kit` currently leans on dense textual quick-reference and command docs for onboarding and command selection. [SOURCE: .opencode/skill/system-spec-kit/references/workflows/quick_reference.md:15-32] [SOURCE: .opencode/skill/system-spec-kit/references/workflows/quick_reference.md:110-187]

## Analysis
This is not an architectural correction, but it is a real UX signal. Ralph's system is simpler than `system-spec-kit`, yet it still invests in a visual explainer because loop behavior is easier to internalize when seen as a path rather than a pile of commands. `system-spec-kit`'s current documentation density makes sense for maintainers, but it is likely harder than necessary for operators trying to understand where resume, plan, implement, memory, and review fit together.

## Conclusion
confidence: medium

finding: `system-spec-kit` should add a visual lifecycle explainer for its core operator path so onboarding does not rely entirely on dense prose and command-reference memorization.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md`
- **Change type:** added option
- **Blast radius:** small
- **Prerequisites:** choose whether the explainer is Mermaid, static SVG, or an interactive packet-local prototype
- **Priority:** nice-to-have

## Counter-evidence sought
I looked for an equivalent first-class lifecycle diagram in the current quick-reference and command docs and did not find one; the onboarding surface is primarily textual. [SOURCE: .opencode/skill/system-spec-kit/references/workflows/quick_reference.md:110-187]

## Follow-up questions for next iteration
- Does the absence of a lightweight architecture lane make the documentation harder because every workflow inherits the full system?
- What final recommendation best captures where Ralph should influence `system-spec-kit` structurally versus cosmetically?
- Should the capstone recommendation be a simplification overlay or a broader architecture pivot?
