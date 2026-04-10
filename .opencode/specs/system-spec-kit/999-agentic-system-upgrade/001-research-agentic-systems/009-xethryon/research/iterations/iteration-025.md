# Iteration 025 — Keep LEAF Research And Review Agents Explicit

Date: 2026-04-10

## Research question
Should `system-spec-kit` replace its explicit LEAF deep-research and deep-review agents with a more hidden iteration architecture inspired by Xethryon's runtime reflection and post-turn hooks?

## Hypothesis
No. The LEAF pattern is exactly the right abstraction when the loop output is itself part of the deliverable.

## Method
I compared the local one-iteration research/review agents with Xethryon's bounded self-reflection pass and background memory post-turn hook.

## Evidence
- `@deep-research` is explicitly a one-iteration LEAF worker that writes iteration artifacts, updates JSONL state, and contributes to synthesis/dashboard outputs. [SOURCE: .opencode/agent/deep-research.md:22-32] [SOURCE: .opencode/agent/deep-research.md:48-60] [SOURCE: .opencode/agent/deep-research.md:121-171] [SOURCE: .opencode/agent/deep-research.md:203-213]
- `@deep-review` uses the same one-iteration LEAF pattern for review-state convergence. [SOURCE: .opencode/agent/deep-review.md:21-31] [SOURCE: .opencode/agent/deep-review.md:45-57] [SOURCE: .opencode/agent/deep-review.md:95-142]
- Xethryon's reflection loop is intentionally bounded to a single revise pass and is injected at runtime just before returning to the user. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/session/prompt.ts:1389-1428]
- Xethryon's memory post-turn hook also runs in the background after the main loop finishes. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/session/prompt.ts:1643-1659]

## Analysis
Xethryon's hidden loop architecture is good at reducing visible ceremony inside an interactive terminal. It is weaker for governed research and review because the loop state is not the product. In `system-spec-kit`, the iteration files, dashboards, and JSONL state are part of the artifact contract. That means the loop must stay visible and file-mediated.

This iteration reinforces Phase 2's architecture result from a UX angle: some complexity is the work. If the user is asking for iterative research or review, hiding the loop would make the result harder to trust and resume.

## UX / System Design Analysis

- **Current system-spec-kit surface:** research/review loops are explicit, stateful, and file-backed.
- **External repo's equivalent surface:** reflection and memory loops are mostly hidden runtime behavior.
- **Friction comparison:** Xethryon feels lighter in-session, but `system-spec-kit` offers much better inspectability and resumability when the loop output matters.
- **What system-spec-kit could DELETE to improve UX:** not the LEAF pattern itself; only unnecessary prose around it.
- **What system-spec-kit should ADD for better UX:** better summaries of loop state, not a more hidden runtime architecture.
- **Net recommendation:** KEEP

## Conclusion
confidence: high

finding: do not replace explicit LEAF deep-research/deep-review loops with hidden runtime iteration machinery. The current explicit loop architecture is the correct tradeoff for governed artifact-producing workflows.

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** explicit, resumable, artifact-backed iteration loops.
- **External repo's approach:** lightweight hidden loop behavior inside the runtime.
- **Why the external approach might be better:** lower visible ceremony for ordinary chat interactions.
- **Why system-spec-kit's approach might still be correct:** artifact-producing workflows need visible state, durable outputs, and auditable convergence.
- **Verdict:** KEEP
- **If KEEP — concrete proposal:** improve summaries and dashboards, but preserve the explicit LEAF contract.
- **Blast radius of the change:** low
- **Migration path:** none required beyond documentation clarity.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/agent/deep-research.md`
- **Change type:** no-op architecture decision
- **Blast radius:** low
- **Prerequisites:** none
- **Priority:** rejected

## Counter-evidence sought
I looked for a way to get Xethryon's lighter UX without losing explicit state. The best candidates were summary improvements, not loop replacement.

## Follow-up questions for next iteration
- If the deep-loop agents should stay explicit, where is the biggest remaining skill-surface fragmentation?
