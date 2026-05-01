# Iteration 014 — Internalize the Gate Machinery

Date: 2026-04-10

## Research question
Is `system-spec-kit`'s user-facing gate model overbuilt, and does Relay suggest a simpler operator experience without discarding the underlying safeguards?

## Hypothesis
Relay's docs and CLI surface are materially simpler because they package behavior as modes and verbs instead of exposing internal enforcement structure to end users.

## Method
Read Relay's introduction docs and CLI bootstrap tests, then compared that UX with Public's Gate 1/2/3 contract, constitutional cross-reference files, and orchestrator workflow.

## Evidence
- Relay introduces itself through two top-level modes, `Orchestrate` and `Communicate`, rather than by teaching the user its internal enforcement machinery first. [SOURCE: external/docs/introduction.md:2-6] [SOURCE: external/docs/introduction.md:15-49]
- Relay's user-facing examples lean on verbs and coordination intents (`/relay-team`, `/relay-fanout`, `/relay-pipeline`) rather than on an explicit pre-execution gate taxonomy. [SOURCE: external/docs/introduction.md:67-89]
- The CLI bootstrap test locks down a broad but still straightforward command catalog through executable behavior, which keeps the public surface concrete and testable. [SOURCE: external/src/cli/bootstrap.test.ts:6-48] [SOURCE: external/src/cli/bootstrap.test.ts:68-125]
- Public's AGENTS contract exposes three named gates, consolidated question protocol, completion verification, violation recovery, and self-checklists directly to the operator-facing doctrine. [SOURCE: AGENTS.md:159-229]
- Constitutional gate memories reinforce the same explicit framing: Gate 3 overrides Gates 1-2, continuation validation, and trigger routing remain prominently surfaced. [SOURCE: .opencode/skill/system-spec-kit/constitutional/gate-enforcement.md:58-69] [SOURCE: .opencode/skill/system-spec-kit/constitutional/gate-enforcement.md:74-103]
- Public's orchestrator then repeats gate checking as a first-class operational step before task decomposition. [SOURCE: .opencode/agent/orchestrate.md:49-60]

## Analysis
The question is not whether Public needs safeguards. It clearly does. The question is whether users need to think in terms of "Gate 1 / Gate 2 / Gate 3" as often as they currently do. Relay suggests a cleaner separation: keep internal enforcement real, but present the operator with simple, intention-shaped surfaces. Public currently teaches too much of its internal control system as if it were the product.

## Conclusion
confidence: high
finding: Public should simplify its UX by internalizing most gate machinery. Preserve the protections, but expose simpler operator-facing modes and prompts that describe outcomes rather than the constitutional implementation.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `AGENTS.md`, `.opencode/skill/system-spec-kit/constitutional/gate-enforcement.md`, `.opencode/agent/orchestrate.md`, command entrypoints that currently restate gate doctrine
- **Change type:** documentation and behavior simplification
- **Blast radius:** large
- **Prerequisites:** identify which gate behaviors must remain operator-visible versus silently enforced at runtime
- **Priority:** should-have (adopt now)

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** The operator is taught the gate taxonomy, escalation rules, and violation-recovery logic as explicit front-door concepts.
- **External repo's approach:** The user sees simple modes and commands, while enforcement and capability details live behind the interface and in tests.
- **Why the external approach might be better:** It lowers onboarding friction, reduces prompt ceremony, and makes the system feel more like a tool and less like a bureaucracy manual.
- **Why system-spec-kit's approach might still be correct:** Public serves high-governance workflows, and visible rules sometimes prevent misuse before it happens.
- **Verdict:** SIMPLIFY
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** Keep hard protections internally, but rewrite operator-facing surfaces around a few clear intents such as start/update/continue or research/review/implement, with the gate logic applied automatically in the background.
- **Blast radius of the change:** large
- **Migration path:** First simplify command/docs wording while keeping current enforcement behavior, then progressively hide internal gate terminology from default user flows, leaving the constitutional details in reference docs for maintainers.

## Counter-evidence sought
Looked for Relay docs that foreground internal coordination heuristics as operator-facing doctrine; the reviewed intro and CLI surfaces instead privileged simple modes and executable commands.

## Follow-up questions for next iteration
- Which current gate concepts genuinely help users versus only helping maintainers?
- Can a simpler front door preserve the same safety guarantees?
- Which command families would benefit most from "mode-first" wording?
