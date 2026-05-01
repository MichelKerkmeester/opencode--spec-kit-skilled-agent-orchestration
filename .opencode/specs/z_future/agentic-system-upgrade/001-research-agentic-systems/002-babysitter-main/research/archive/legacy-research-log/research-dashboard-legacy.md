# Research Dashboard — 002-babysitter-main

| Phase | Iteration | Question | Confidence | Priority | Verdict / Target |
|-------|-----------|----------|------------|----------|------------------|
| 1 | 001 | Can Babysitter's append-only journal model materially improve deep-research auditability over JSONL-only state logging? | high | should-have | Journaled workflow state |
| 1 | 002 | Would journal-head-based replay caches make `session_resume` more deterministic than the current cached-summary flow? | high | should-have | Cache + journal-head validation |
| 1 | 003 | Does process-code authority plus mandatory-stop runtime offer a stronger enforcement model than documentation-surfaced gates? | high | must-have | Runtime-enforced gates |
| 1 | 004 | Should auto mode emit explicit audit records when approval gates are auto-passed? | high | should-have | Approval audit semantics |
| 1 | 005 | Can pending-action batches improve resumability for blocked or partially parallel research loops? | high | should-have | Pending-action registry |
| 1 | 006 | Is executable methodology packaging a better reuse primitive than prose-only workflow references? | medium | nice-to-have | Executable workflow packs |
| 1 | 007 | Should `system-spec-kit` adopt a unified runtime-manifest layer for multi-harness resolution? | high | must-have | Runtime manifest |
| 1 | 008 | Should `system-spec-kit` adopt Babysitter's full plugin marketplace and installer model? | medium | rejected | Reject marketplace import |
| 1 | 009 | Would a built-in internal harness or headless runner materially improve CI and overnight workflows? | medium | should-have | Headless runner |
| 1 | 010 | Should command-phase lifecycle hooks become first-class extension points? | high | should-have | Lifecycle hooks |
| 2 | 011 | Is the Level 1/2/3/3+ classification the right control model, or should Spec Kit move to workflow profiles? | high | should-have | `PIVOT` workflow profiles |
| 2 | 012 | Is the current Gate 1/2/3 system the right UX, or should it become persistent runtime policy plus checkpoints? | high | must-have | `SIMPLIFY` gate entry ritual |
| 2 | 013 | Is the memory architecture the right shape, or should session capture split from durable indexed memory? | high | must-have | `PIVOT` two-lane memory |
| 2 | 014 | Are deep-research and deep-review the right separate abstractions, or should Spec Kit use one iteration engine? | high | should-have | `REFACTOR` shared iteration engine |
| 2 | 015 | Is the universal validation pipeline too broad, and should semantic checks move into workflow-owned gates? | high | should-have | `SIMPLIFY` validator scope |
| 2 | 016 | Is the specialist agent architecture over-factored, or is the real problem mirror tax around it? | high | should-have | `KEEP` roles, centralize mirrors |
| 2 | 017 | What does Babysitter's structured runtime error model suggest about current operator-facing failures? | high | should-have | Structured error taxonomy |
| 2 | 018 | Does Babysitter's testing approach suggest a better test philosophy for workflow runtime behavior? | high | should-have | Deterministic workflow simulation |
| 2 | 019 | Does Babysitter surface a lightweight timing safeguard that Spec Kit should add to unattended loops? | medium | nice-to-have | Timing guard |
| 2 | 020 | Should Spec Kit adopt Babysitter's four-layer compression subsystem as a major architecture move? | medium | rejected | `KEEP` current boundary; reject wholesale import |
| 3 | 021 | Is the `/spec_kit:plan` -> `/implement` -> `/complete` split the right lifecycle UX? | high | must-have | `MERGE` lifecycle surface |
| 3 | 022 | Should routine `/memory:*` behavior disappear into the main lifecycle UX? | high | should-have | `MERGE` memory into lifecycle |
| 3 | 023 | Is the Level 1/2/3+ spec-folder UX intuitive enough, or should artifact creation become lazy? | high | should-have | `REDESIGN` starter packet + lazy expansion |
| 3 | 024 | Are `@context-prime` and `@context` both necessary public continuity concepts? | high | should-have | `MERGE` bootstrap into continuity |
| 3 | 025 | Is the externalized iteration/dashboard/JSONL artifact model itself too heavy? | high | rejected | `KEEP` inspectable evidence layer |
| 3 | 026 | Should resume, handover, and bootstrap merge into one continuity stack? | high | should-have | `MERGE` handover into continuity |
| 3 | 027 | Is the public skill roster too fragmented for operators? | high | must-have | `MERGE` public skills |
| 3 | 028 | Should mandatory `skill_advisor.py` routing become fallback-only? | high | must-have | `SIMPLIFY` Gate 2 routing |
| 3 | 029 | Is the operator guidance surface too hand-maintained across docs, commands, and YAML? | high | must-have | `REDESIGN` generated operator guidance |
| 3 | 030 | Does the end-to-end workflow need execution profiles to lower repeat friction? | medium | nice-to-have | `ADD` execution profiles |

## Convergence Signal
- Phase 1 iterations without new signal at stop: 0
- Phase 2 iterations without new signal at stop: 0
- Phase 3 iterations without new signal at stop: 0
- Stop rule triggered: yes (`max_iterations`)

## Totals
- Phase 1: must-have 2 | should-have 6 | nice-to-have 1 | rejected 1
- Phase 2: must-have 2 | should-have 6 | nice-to-have 1 | rejected 1
- Phase 3: must-have 4 | should-have 4 | nice-to-have 1 | rejected 1
- Combined: must-have 8 | should-have 16 | nice-to-have 3 | rejected 3

## Phase 3 UX Verdicts
- `SIMPLIFY`: 1
- `ADD`: 1
- `MERGE`: 5
- `KEEP`: 1
- `REDESIGN`: 2

## Combined Verdicts
- `REFACTOR`: 1
- `PIVOT`: 2
- `SIMPLIFY`: 3
- `MERGE`: 5
- `ADD`: 1
- `REDESIGN`: 2
- `KEEP`: 3
