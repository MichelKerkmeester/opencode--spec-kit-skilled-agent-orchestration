# Iteration 017 — Externalized Loop State Is the Better Architecture

Date: 2026-04-10

## Research question
Should `system-spec-kit` replace its explicit deep-research/deep-review loop artifacts with more hidden, runtime-embedded quality loops inspired by Xethryon's reflection and post-turn memory behavior?

## Hypothesis
No. Xethryon's hidden loops are useful for lightweight UX, but Spec Kit's explicit JSONL + reducer + packet-artifact model is architecturally stronger for governed research and review work.

## Method
I compared Xethryon's reflection and memory-hook behavior to Spec Kit's deep-research loop contracts and reducer-owned state surfaces.

## Evidence
- Xethryon's reflection gate is embedded in the session prompt loop, silently revises once, and then exits without producing a first-class artifact describing the critique or revision outcome. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/session/prompt.ts:1383-1431]
- Xethryon's memory hook also runs in the background after the main turn and can trigger extraction and AutoDream without creating a reducer-owned state surface. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/session/prompt.ts:1643-1659] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/memory/memoryHook.ts:148-171]
- Xethryon also defines a hidden `reflection` agent internally, reinforcing that some quality behavior lives as runtime internals rather than explicit workflow artifacts. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/agent/agent.ts:286-300]
- Spec Kit's deep-research contract explicitly says the loop is externalized, reducer-owned, and iteration-driven, with JSONL state, dashboards, and a progressive research output. [SOURCE: .opencode/agent/deep-research.md:24-29] [SOURCE: .opencode/agent/deep-research.md:50-60] [SOURCE: .opencode/agent/deep-research.md:159-213]
- The command workflow encodes that same design principle at the workflow level: "Never hold findings in memory; write everything to files." [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:20-23] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:79-89]

## Analysis
This is the clearest architectural "keep" signal from Phase 2. Xethryon's hidden loops optimize for interaction smoothness, but they weaken inspectability and post-hoc reasoning. Spec Kit is building a different kind of system: one where the loop itself is part of the deliverable. For that class of problem, externalized state is not incidental overhead. It is the architecture. The only worthwhile import is bounded critique as an explicit artifact, which Phase 1 already identified.

## Conclusion
confidence: high

finding: Spec Kit's file-mediated loop design is better than Xethryon's hidden runtime loop model for deep research and review. Future quality loops should stay reducer-visible and artifact-backed.

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** deep loops are explicit, file-mediated, and reducer-owned.
- **External repo's approach:** quality and memory loops are mostly hidden inside the runtime and prompt assembly.
- **Why the external approach might be better:** it reduces visible ceremony and gives the operator a smoother chat experience.
- **Why system-spec-kit's approach might still be correct:** Spec Kit treats loop outputs as deliverables, so observability and recoverability matter more than chat smoothness.
- **Verdict:** KEEP
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** none at the architectural level. The actionable extension is to document this file-mediated principle more explicitly for future loop features.
- **Blast radius of the change:** medium if documented, architectural if reversed
- **Migration path:** codify the principle in loop docs rather than changing runtime behavior.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- **Change type:** modified existing
- **Blast radius:** medium
- **Prerequisites:** add an explicit design note that future loop features must emit reducer-visible artifacts
- **Priority:** should-have

## Counter-evidence sought
I looked for evidence that Xethryon's hidden loops produced a clearer audit trail or easier recovery story than Spec Kit's externalized loop. I found the opposite.

## Follow-up questions for next iteration
- Could Spec Kit still borrow Xethryon's repo-level orientation feel without turning branch/worktree state into durable memory?
