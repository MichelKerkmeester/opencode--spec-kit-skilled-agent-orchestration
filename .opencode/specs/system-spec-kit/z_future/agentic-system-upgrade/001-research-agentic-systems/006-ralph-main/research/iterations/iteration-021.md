# Iteration 021 — Command Surface Size and Fragmentation

## Research question
Is `system-spec-kit` exposing too many operator-facing commands compared with Ralph's much smaller runtime surface, and is that making the default UX harder than it needs to be?

## Hypothesis
The current command catalog is functionally rich but over-exposed. The strongest Ralph signal is not feature parity but operator obviousness.

## Method
Compared Ralph's plugin entrypoints and documented workflow against the visible `spec_kit` and `memory` command map, then traced how much of `system-spec-kit`'s surface is expert-only versus genuinely first-line.

## Evidence
- Ralph exposes an intentionally tiny operator surface: `/prd`, `/ralph`, and the shell runner. Its README teaches a three-step workflow instead of a taxonomy. [SOURCE: external/README.md:54-86] [SOURCE: external/README.md:88-145] [SOURCE: external/.claude-plugin/plugin.json:2-9]
- `system-spec-kit`'s quick reference already shows a much larger visible catalog: eight `spec_kit` commands plus four `memory` commands before the user has even chosen a workflow lane. [SOURCE: .opencode/skill/system-spec-kit/references/workflows/quick_reference.md:110-130]
- The command docs themselves assume substantial setup branching, flags, and mode selection before execution begins. [SOURCE: .opencode/command/spec_kit/plan.md:31-145] [SOURCE: .opencode/command/spec_kit/implement.md:35-120] [SOURCE: .opencode/command/spec_kit/complete.md:1-4]

## Analysis
The problem is not that the larger command surface is unjustified. The problem is that the full catalog is exposed too early. Ralph wins on UX because a new operator can understand "make a PRD, run Ralph" without learning internal boundaries. `system-spec-kit` currently makes users see the whole machine before they know which part they need. That creates unnecessary branching pressure and makes advanced capabilities look mandatory.

## Conclusion
confidence: high

finding: `system-spec-kit` should simplify its visible command surface so the default operator map shows a small recommended lifecycle path, while advanced commands remain available but demoted.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md`
- **Change type:** modified existing
- **Blast radius:** medium
- **Prerequisites:** define a "default path" versus "advanced tools" split for command documentation
- **Priority:** should-have

## UX / System Design Analysis

- **Current system-spec-kit surface:** Operators are shown a broad command family up front, including planning, implementation, completion, recovery, handover, deep research, deep review, debug, and four separate memory surfaces.
- **External repo's equivalent surface:** Ralph teaches one tiny loop with two user-facing commands and one obvious runner entrypoint.
- **Friction comparison:** Ralph has lower cognitive load because the user only learns the next step. `system-spec-kit` asks the user to parse a menu of lifecycle, memory, and admin surfaces before work begins.
- **What system-spec-kit could DELETE to improve UX:** Delete the full command taxonomy from the default quick-reference path; keep it in an advanced appendix instead.
- **What system-spec-kit should ADD for better UX:** Add a "recommended path" card that shows the 3-5 commands a normal operator actually needs.
- **Net recommendation:** SIMPLIFY

## Counter-evidence sought
I looked for proof that the wide command catalog is already hidden behind a smaller default operator layer, but the quick reference and primary command docs still foreground the broad surface. [SOURCE: .opencode/skill/system-spec-kit/references/workflows/quick_reference.md:110-130] [SOURCE: .opencode/command/spec_kit/resume.md:29-141]

## Follow-up questions for next iteration
- If the visible command map shrinks, should `plan`, `implement`, and `complete` remain peer entrypoints or be wrapped behind one guided front door?
