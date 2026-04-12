# Iteration 025 — Do Not Delete Externalized Loop Artifacts

Date: 2026-04-10

## Research question
Is the LEAF-agent plus externalized JSONL/iteration-file pattern itself too heavy, or is the real UX problem elsewhere?

## Hypothesis
The operator friction is more likely in the wrapper surface than in the existence of explicit loop artifacts. Babysitter may confirm that replayable, inspectable iteration state is still valuable even in a simpler UX.

## Method
I compared Spec Kit's deep-research/deep-review artifact model with Babysitter's run/events/tasks observability model and bound orchestration loop.

## Evidence
- `@deep-research` is explicitly a single-iteration LEAF agent that writes iteration files, appends JSONL, and lets reducer-owned packet files refresh around it. [SOURCE: .opencode/agent/deep-research.md:24-33] [SOURCE: .opencode/agent/deep-research.md:50-60] [SOURCE: .opencode/agent/deep-research.md:159-166] [SOURCE: .opencode/agent/deep-research.md:203-213]
- `@deep-review` follows the same externalized-state contract for review iterations and packet-local review artifacts. [SOURCE: .opencode/agent/deep-review.md:23-31] [SOURCE: .opencode/agent/deep-review.md:45-57] [SOURCE: .opencode/agent/deep-review.md:231-253]
- Babysitter's orchestration loop is also explicitly inspectable: it creates runs, iterates them, resolves effects, posts task results, and exposes run status, events, and pending tasks as first-class artifacts. [SOURCE: external/packages/sdk/src/cli/commands/harnessPhase2.ts:4-18] [SOURCE: external/packages/sdk/src/cli/commands/harnessPhase2.ts:97-157] [SOURCE: external/packages/sdk/src/cli/commands/harnessPhase2.ts:202-250]
- Babysitter's quick-reference prompt template tells the operator how to create runs, inspect status, inspect events, list tasks, post results, and iterate again. [SOURCE: external/packages/sdk/src/prompts/templates/quick-reference.md:1-34]
- The repo also keeps strong diagnostic surfaces such as `doctor`, which inspect journals, state cache, effects, locks, sessions, and logs rather than hiding them. [SOURCE: external/plugins/babysitter-opencode/commands/doctor.md:1-19] [SOURCE: external/plugins/babysitter-opencode/commands/doctor.md:23-80]

## Analysis
Babysitter does not actually argue for hiding loop state. It argues for centralizing control while keeping observability strong. Runs, journals, events, and effects remain explicit because inspectability is part of the deterministic contract. [SOURCE: external/packages/sdk/src/cli/commands/harnessPhase2.ts:4-18] [SOURCE: external/packages/sdk/src/prompts/templates/quick-reference.md:1-34]

That means a common simplification instinct would be wrong here: deleting iteration files, dashboards, or JSONL logs just because the entry surface should shrink. Those artifacts are not the main friction source. They are the evidence layer that makes autonomous loops debuggable and resumable.

Spec Kit should therefore simplify the front door, not the evidence trail.

## UX / System Design Analysis

- **Current system-spec-kit surface:** Deep loops produce explicit iteration files, JSONL logs, dashboards, and synthesis documents. [SOURCE: .opencode/agent/deep-research.md:50-60] [SOURCE: .opencode/agent/deep-review.md:45-57]
- **External repo's equivalent surface:** Babysitter keeps run status, journals, events, effects, and doctor tooling visible and inspectable. [SOURCE: external/packages/sdk/src/prompts/templates/quick-reference.md:1-34] [SOURCE: external/plugins/babysitter-opencode/commands/doctor.md:23-80]
- **Friction comparison:** The artifact trail itself is not the high-friction part. The friction comes from how many wrappers and concepts surround it.
- **What system-spec-kit could DELETE to improve UX:** Delete the expectation that end users must understand the internal loop plumbing, but do not delete the artifacts themselves.
- **What system-spec-kit should ADD for better UX:** Add clearer summary views and one recommended next action above the artifact layer, while preserving packet-local iteration evidence underneath.
- **Net recommendation:** KEEP

## Conclusion
confidence: high

finding: `system-spec-kit` should **not** delete its packet-local iteration artifacts, JSONL state, dashboards, or progressive synthesis outputs. The right simplification target is the wrapper surface around the loop, not the inspectable evidence trail.

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** Preserve externalized loop state in packet files for research and review. [SOURCE: .opencode/agent/deep-research.md:167-213] [SOURCE: .opencode/agent/deep-review.md:231-253]
- **External repo's approach:** Preserve explicit run journals, events, and task state even while keeping orchestration control centralized. [SOURCE: external/packages/sdk/src/cli/commands/harnessPhase2.ts:4-18] [SOURCE: external/packages/sdk/src/prompts/templates/quick-reference.md:1-34]
- **Why the external approach might be better:** It proves that simplification and observability are not opposites; the runtime can be simpler without making state opaque.
- **Why system-spec-kit's approach might still be correct:** The packet-local evidence trail is precisely what makes deep loops reviewable and resumable.
- **Verdict:** KEEP
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** None. Keep the artifact model; simplify discovery and continuation views above it.
- **Blast radius of the change:** N/A
- **Migration path:** N/A

## Adoption recommendation for system-spec-kit
- **Target file or module:** none; preserve the current artifact model while simplifying wrapper surfaces elsewhere
- **Change type:** rejected
- **Blast radius:** large if misapplied
- **Prerequisites:** none
- **Priority:** rejected

## Counter-evidence sought
I looked for evidence that Babysitter hides or minimizes run-state artifacts in the name of UX simplicity, but its quick-reference and doctor flows show the opposite: inspectable state is treated as a feature, not as accidental complexity. [SOURCE: external/packages/sdk/src/prompts/templates/quick-reference.md:1-34] [SOURCE: external/plugins/babysitter-opencode/commands/doctor.md:23-80]

## Follow-up questions for next iteration
- Which continuity responsibilities can still be merged without deleting useful artifacts?
- Are the current top-level skill families carrying their weight, or are they mostly exposing routing internals?
- How much of Gate 2 should remain visible once command and skill surfaces are simplified?
