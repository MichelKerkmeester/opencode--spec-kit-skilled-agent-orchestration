# Iteration 012 — Turn Gates Into Runtime Policy, Not Turn-Zero Ritual

Date: 2026-04-10

## Research question
Is the current Gate 1/2/3 system the right user experience for `system-spec-kit`, or does Babysitter suggest a less intrusive model?

## Hypothesis
Babysitter will show that persistent operator preferences plus runtime breakpoints are a better UX than re-running conversational gates on every non-trivial request.

## Method
I compared Babysitter's onboarding and mode-selection flow with `system-spec-kit`'s mandatory Gate 1/2/3 pre-execution protocol.

## Evidence
- Babysitter's front door is lightweight: install once, run `/babysitter:user-install`, `/babysitter:project-install`, and `/babysitter:doctor`, then choose an execution mode such as interactive, autonomous, planning, or continuous. [SOURCE: external/README.md:182-239]
- Babysitter captures breakpoint preferences as part of the user profile instead of forcing a fresh preflight questionnaire on each task. [SOURCE: external/README.md:186-205]
- The Babysitter runtime then enforces mandatory stops and gates during execution, rather than making turn-zero questioning the primary control plane. [SOURCE: external/README.md:319-376]
- `system-spec-kit` currently requires memory matching, confidence checks, skill routing, and a spec-folder question before most substantive work can begin. [SOURCE: AGENTS.md:159-229]
- The gate framework also includes confidence thresholds, consolidated-question rules, save-path mandates, and completion verification, which means a large part of the operator experience is spent satisfying framework protocol before entering the requested workflow. [SOURCE: AGENTS.md:165-229]

## Analysis
`system-spec-kit` is strong on governance, but the cost is visible: the framework asks operators and agents to perform a conversation-level ritual before the actual workflow starts. Babysitter suggests a cleaner separation of concerns. Setup and preference capture happen once; the runtime then decides when to stop, ask, or auto-pass based on the selected mode and stored policy. [SOURCE: external/README.md:182-239] [SOURCE: external/README.md:319-376]

That direction would help `system-spec-kit` most on two fronts. First, it would reduce repetitive front-door questioning for known projects. Second, it would move approval semantics into machine-checkable workflow state, making auto mode and confirm mode differences auditable at runtime instead of inferred from conversation history. [SOURCE: external/README.md:232-239] [SOURCE: AGENTS.md:165-229]

## Conclusion
confidence: high

finding: Babysitter's UX suggests `system-spec-kit` should simplify Gate 1/2/3 into a persistent policy layer plus runtime approval checkpoints. The current gate design captures important intent, but it does so at the wrong moment and with too much per-request ceremony.

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** Every new substantive request is filtered through Gate 1 context surfacing, Gate 2 skill routing, and Gate 3 spec-folder binding before normal execution begins. [SOURCE: AGENTS.md:165-229]
- **External repo's approach:** Babysitter captures user/project preferences up front, lets the operator choose a mode, and then enforces approvals through breakpoints and runtime stop conditions. [SOURCE: external/README.md:186-239] [SOURCE: external/README.md:319-376]
- **Why the external approach might be better:** It reduces repetitive operator friction, stores preference once, and keeps approval logic close to execution where it can be journaled.
- **Why system-spec-kit's approach might still be correct:** Conversational gating is flexible and works even when no project profile or runtime metadata exists yet.
- **Verdict:** SIMPLIFY
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** Add a project-scoped operator policy file that stores default spec root, documentation mode, memory preference, and approval policy; keep Gate 3 only as a fallback when no binding exists.
- **Blast radius of the change:** large
- **Migration path:** Introduce an opt-in bootstrap command that writes defaults, teach command workflows to honor it first, and fall back to today's gates only when required policy is missing.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `AGENTS.md`, `.opencode/skill/system-spec-kit/constitutional/gate-enforcement.md`, `.opencode/command/spec_kit/`
- **Change type:** behavioral simplification
- **Blast radius:** large
- **Prerequisites:** define a durable operator-policy format and the fallback behavior when policy is absent or stale
- **Priority:** must-have

## Counter-evidence sought
I looked for an existing persistent operator-policy mechanism in `system-spec-kit` that already shrinks Gate 1/2/3 to a fallback path and found only session-level rules plus the requirement to re-evaluate gates on each new user message. [SOURCE: AGENTS.md:165-229]

## Follow-up questions for next iteration
- If turn-zero gates are simplified, how should durable memory capture distinguish transient run state from indexed knowledge?
- Which parts of Gate 1/2/3 belong in runtime workflow policy versus static repo governance?
- Can the memory pipeline be simplified if the gate model stops depending on per-turn conversational scaffolding?
