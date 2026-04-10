# Iteration 013 — Simplify Retry UX To Operator Knobs

Date: 2026-04-10

## Research question
Does Get It Right's operator surface suggest that `system-spec-kit` asks users too many setup questions for retry-style workflows?

## Hypothesis
Yes. Once a packet is already bound, retry mode should be controlled by a few explicit knobs, not a large first-turn questionnaire.

## Method
I compared Get It Right's runtime inputs with `system-spec-kit`'s implementation setup flow and gate references to see how much operator ceremony sits in front of work execution.

## Evidence
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/README.md:80-105] Get It Right exposes a compact config surface: `max_retries`, `mode`, `yield`, check commands, and optional app-start settings.
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/when-to-use.md:89-139] The external docs frame operator control as simple tuning knobs rather than a questionnaire.
- [SOURCE: .opencode/command/spec_kit/implement.md:29-125] `/spec_kit:implement` begins with a single consolidated prompt that can ask about folder confirmation, execution mode, dispatch mode, and memory loading.
- [SOURCE: .opencode/skill/system-spec-kit/constitutional/gate-enforcement.md:62-68] Gate 3 is intentionally a hard block that overrides other gates before file modification work.
- [SOURCE: .opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:22-33] The implementation workflow reinforces Gate 3 compliance and first-message checks at the prompt level.

## Analysis
The internal setup flow is defensible for generic implementation because it has to establish spec folder, execution mode, dispatch policy, and memory loading from scratch. Retry mode is different. By the time a retry controller runs, the packet is already bound and the operator mostly needs to answer: how many attempts, whether to yield between them, what objective checks to run, and whether UX review is in scope. Get It Right's surface is closer to that need. Reusing the full implementation questionnaire for retry-mode would ask users to re-solve problems that were already solved when the packet was created.

## Conclusion
confidence: high
finding: retry-mode UX in `system-spec-kit` should expose a small set of explicit control knobs after packet binding, not the full implementation setup dialogue.

## Adoption recommendation for system-spec-kit
- **Target file or module:** retry command surface and operator docs
- **Change type:** modified existing
- **Blast radius:** medium
- **Prerequisites:** separate retry-mode entry from generic implementation setup
- **Priority:** should-have

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** setup logic is optimized for first-run implementation inside a spec packet, with multiple confirmation and mode questions.
- **External repo's approach:** operator control is reduced to direct loop parameters such as retry budget, yield policy, mode, checks, and optional UX review inputs.
- **Why the external approach might be better:** it lowers activation energy, makes the workflow easier to script, and aligns the control surface with the actual loop decisions.
- **Why system-spec-kit's approach might still be correct:** generic implementation needs stronger guardrails because the command may be invoked without bound packet context.
- **Verdict:** SIMPLIFY
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** once Gate 3 has already bound a packet, retry-mode should ask only for `max_retries`, `yield`, `mode`, objective checks, and optional app URL/port hints.
- **Blast radius of the change:** medium
- **Migration path:** keep the current setup flow for `/spec_kit:implement`; make retry-mode use flags or a compact post-binding prompt instead.

## Counter-evidence sought
I looked for evidence that retry-mode would still need the same folder/memory/dispatch questionnaire as first-run implementation and found only generic setup requirements, not retry-specific ones.

## Follow-up questions for next iteration
- Should retry-mode default to `yield=true` for safety?
- Which parameters belong on the command line versus interactive confirmation?
- Should UX review be opt-in through `start_app_command`-style inputs?
