# Iteration 021 - Merge The Lifecycle Command Front Door

## Research question
Is `system-spec-kit` asking operators to remember too many lifecycle entry points (`/spec_kit:plan`, `/spec_kit:implement`, `/spec_kit:complete`, `/spec_kit:resume`) compared with the external repo's more centralized workflow surface?

## Hypothesis
The local lifecycle will prove functionally richer, but the external repo will show that daily operator UX improves when most work routes through one memorable front door instead of several equally primary commands.

## Method
Compared local Spec Kit lifecycle commands and workflow assets to the external repo's command entry pattern, especially `/mdd`, `/help`, and progress-oriented guidance.

## Evidence
- The local command README and Spec Kit README present a broad command matrix, then ask the operator to choose among separate planning, implementation, completion, resume, handover, debug, deep-review, and deep-research entry points. [SOURCE: .opencode/command/README.txt:84-100] [SOURCE: .opencode/command/spec_kit/README.txt:54-76] [SOURCE: .opencode/command/spec_kit/README.txt:121-159]
- Local lifecycle commands are not just labels; they each carry their own autonomous workflow logic and branching prompts, especially in the completion and resume assets. [SOURCE: .opencode/command/spec_kit/implement.md:29-120] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml:30-108] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml:32-92]
- The external repo centers operator orientation around a smaller set of memorable commands. `/help` explains the system, while `/mdd` acts as the main guided work entry point for requirement capture and execution setup. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/help.md:31-107] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/mdd.md:31-131]
- The external user guide reinforces a simpler mental model: install, run a starter command, follow guided prompts, then inspect progress. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/USER_GUIDE.md:38-108]

## Analysis
This looks like a real UX problem, not just a documentation issue. `system-spec-kit` has strong workflow coverage, but the operator has to know which lifecycle phase they are in before they can pick the right command. The external repo instead gives the user a small number of front doors and lets the command decide what details to collect next. That is easier to remember under time pressure. The local split still has value internally, but it is too visible at the operator surface.

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** Separate lifecycle commands for plan, implement, complete, and resume, each documented and invoked as a first-class choice.
- **External repo's approach:** Use a smaller set of memorable commands, with one guided command doing most of the interview and routing work.
- **Why the external approach might be better:** It reduces decision fatigue and lowers the chance that a user starts in the wrong lifecycle mode.
- **Why system-spec-kit's approach might still be correct:** Internally, those stages have different contracts and artifacts, so some separation is still useful below the UX layer.
- **Verdict:** MERGE
- **If REFACTOR/PIVOT/SIMPLIFY - concrete proposal:** Keep the underlying plan/implement/complete flows, but add one operator-facing front door that dispatches internally based on state and user intent.
- **Blast radius of the change:** medium
- **Migration path:** Introduce a guided front-door command first, then gradually demote the current lifecycle commands to advanced or direct-entry status.

## UX / System Design Analysis

- **Current system-spec-kit surface:** Operators must choose among several lifecycle commands, understand which one is appropriate, and sometimes learn separate flags or YAML-driven execution paths.
- **External repo's equivalent surface:** Operators mainly learn `/help` plus a guided work command and then follow prompts.
- **Friction comparison:** The local system has more power but higher cognitive load because the user must classify the task before the tooling helps. The external repo defers that classification and therefore has fewer wrong-turn opportunities.
- **What system-spec-kit could DELETE to improve UX:** Delete the assumption that `plan`, `implement`, and `complete` must all be equally visible as first-choice entry points.
- **What system-spec-kit should ADD for better UX:** Add one lifecycle front door that interviews the user once, infers state, and routes to the correct internal workflow.
- **Net recommendation:** MERGE

## Conclusion
confidence: high

finding: `system-spec-kit` should merge its visible lifecycle command surface behind a guided front door instead of making operators memorize separate primary commands for each stage.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/spec_kit/README.txt`, command routing surfaces, workflow asset entrypoints
- **Change type:** UX consolidation
- **Blast radius:** medium
- **Prerequisites:** decide whether the new front door becomes canonical or co-exists as a guided wrapper
- **Priority:** should-have

## Counter-evidence sought
I looked for evidence that the local split materially reduces ambiguity for operators, but the docs mostly shift the burden onto the user to pick the correct command before the automation begins. [SOURCE: .opencode/command/spec_kit/README.txt:83-111]

## Follow-up questions for next iteration
If lifecycle commands are merged at the front door, should memory-oriented commands also be folded into that same operator surface?
