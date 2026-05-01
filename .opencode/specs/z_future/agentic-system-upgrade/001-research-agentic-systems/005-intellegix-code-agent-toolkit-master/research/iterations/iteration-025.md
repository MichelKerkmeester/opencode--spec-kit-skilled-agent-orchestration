# Iteration 025 — Keep LEAF Research And Review Loops, Reject Generic Replacement

Date: 2026-04-10

## Research question
Does the external repo show that `system-spec-kit` should replace its LEAF deep-research and deep-review iteration model with more generic research and orchestrator roles?

## Hypothesis
No. The local LEAF iteration pattern is still the right abstraction for evidence-heavy research and review. The external repo demonstrates a simpler role map, but not a stronger replacement for packet-local iterative evidence loops.

## Method
I compared the local deep-research and deep-review agent contracts with the external research and orchestration roles. I focused on whether the external model preserves the same evidence discipline, state contract, and iteration boundary.

## Evidence
- `[SOURCE: .opencode/agent/deep-research.md:22-33]` The local deep-research agent is explicitly a single-iteration actor with permission to write packet-local research artifacts and progressive synthesis.
- `[SOURCE: .opencode/agent/deep-research.md:50-60]` The deep-research workflow formalizes state read, focused investigation, iteration artifact creation, JSONL append, reducer sync, and research update.
- `[SOURCE: .opencode/agent/deep-review.md:21-31]` The local deep-review agent is likewise a single-iteration actor with explicit review-only write scope inside `review/`.
- `[SOURCE: .opencode/agent/deep-review.md:45-57]` The deep-review loop formalizes dimension selection, analysis actions, severity classification, iteration artifact writing, strategy update, and JSONL append.
- `[SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/005-intellegix-code-agent-toolkit-master/external/agents/research.md:15-22]` The external research agent is a broad specialist for web research and technology evaluation, not a packet-local iterative reducer participant.
- `[SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/005-intellegix-code-agent-toolkit-master/external/agents/orchestrator.md:15-23]` The external orchestrator is a loop manager rather than a research-evidence reducer.

## Analysis
This is where local specialization still pays for itself. The external research agent is simpler because it solves a simpler job: gather information and report it. The local deep-research and deep-review roles are doing more than gathering information. They are maintaining packet-local evidence history, bounded iteration semantics, convergence-friendly state, and write-scope safety. Replacing that with generic research or orchestration roles would make the roster smaller, but the research system weaker.

So the right lesson is narrower than "merge everything." Merge overlapping session-context roles, yes. But keep the LEAF iteration model for research and review where the output contract genuinely differs.

## Conclusion
confidence: high

finding: `system-spec-kit` should reject replacing `@deep-research` and `@deep-review` with generic external-style research or orchestrator roles. Keep the LEAF iteration model.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/agent/deep-research.md`, `.opencode/agent/deep-review.md`
- **Change type:** rejected
- **Blast radius:** architectural
- **Prerequisites:** none
- **Priority:** rejected

## UX / System Design Analysis

- **Current system-spec-kit surface:** Deep research and deep review each use specialized LEAF agents with explicit iteration and state contracts.
- **External repo's equivalent surface:** The external repo uses broader research and orchestrator roles that do not own packet-local reducer workflows.
- **Friction comparison:** The local system is heavier, but the weight is tied to a real product need: iterative evidence discipline. The external surface is lighter because it solves a narrower problem.
- **What system-spec-kit could DELETE to improve UX:** Delete redundant neighboring roles, not the LEAF iteration pattern itself.
- **What system-spec-kit should ADD for better UX:** Add clearer operator explanations that deep research and deep review are specialized loop modes, not just more agent names to memorize.
- **Net recommendation:** KEEP

## Counter-evidence sought
I looked for evidence that the external research role offers packet-local iteration state, bounded evidence artifacts, or reducer-owned convergence handling equivalent to the local LEAF model. I did not find it.

## Follow-up questions for next iteration
- Can deep-research and deep-review share more runtime plumbing without losing their distinct output contracts?
- Which adjacent agent surfaces are still worth collapsing once these LEAF roles are explicitly preserved?
- Should the public command surface hide more of the agent naming while still preserving loop specialization?
