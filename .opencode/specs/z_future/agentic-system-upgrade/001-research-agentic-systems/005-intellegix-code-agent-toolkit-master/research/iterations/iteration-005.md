# Iteration 005 — Multi-Agent Manifests And File Locks

Date: 2026-04-09

## Research question
Are the external repo's multi-agent manifests and Dropbox-safe file locks appropriate for `system-spec-kit`'s deep-research loop?

## Hypothesis
Probably not for the current deep-research loop, because `system-spec-kit` intentionally keeps the research agent as a single leaf worker.

## Method
I compared the external multi-agent coordination modules and tests with `system-spec-kit`'s current leaf-only deep-research protocol and orchestrator rules.

## Evidence
- `[SOURCE: external/automated-loop/multi_agent.py:1-10]` The external multi-agent runner is explicitly designed around multiple parallel loops, manifests, lock management, merge, and cleanup.
- `[SOURCE: external/automated-loop/multi_agent.py:56-107]` Each agent workspace gets an `assigned_files.txt` manifest and a scoped `CLAUDE.md`.
- `[SOURCE: external/automated-loop/multi_agent.py:149-183]` File ownership is split by parent directory using greedy bin packing.
- `[SOURCE: external/automated-loop/file_locking.py:26-33]` The lock system exists to make shared-file coordination safe across synced folders.
- `[SOURCE: external/automated-loop/file_locking.py:95-169]` Lock acquisition retries and verifies state after a sync delay instead of trusting a single write.
- `[SOURCE: external/automated-loop/tests/test_multi_agent.py:261-340]` Tests cover workspace setup, dashboard generation, and lock counts, confirming this is a first-class runtime subsystem.
- `[SOURCE: .opencode/skill/sk-deep-research/references/loop_protocol.md:159-175]` The current deep-research dispatch contract is leaf-only and explicitly says not to dispatch sub-agents from an iteration.
- `[SOURCE: .opencode/agent/orchestrate.md:40-46]` Orchestration rules enforce single-hop delegation.
- `[SOURCE: .opencode/agent/orchestrate.md:110-127]` Depth 1 agents are always leaf agents and may not dispatch further.

## Analysis
The external repo is solving a different class of problem: concurrent implementation workers editing overlapping trees. `system-spec-kit`'s deep-research loop is intentionally closer to a serial evidence engine, and the user explicitly requested no sub-agents for this phase. Importing manifest-and-lock machinery into the current research loop would overfit to a capability the workflow is designed to avoid. There is still a useful lesson here: if a future sibling workflow introduces parallel research waves, it should borrow manifest discipline before it borrows lock complexity. But for today's deep-research skill, the external subsystem is mostly the wrong abstraction.

## Conclusion
confidence: high

finding: The external multi-agent manifest and locking model should be rejected for the current `system-spec-kit` deep-research loop. It solves a real coordination problem, but not one the present leaf-only design should absorb.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/sk-deep-research/references/loop_protocol.md`, `.opencode/agent/orchestrate.md`
- **Change type:** rejected
- **Blast radius:** large
- **Prerequisites:** none
- **Priority:** rejected

## Counter-evidence sought
I looked for existing multi-agent wave execution in the live deep-research protocol. The docs explicitly frame segments and waves as reference-only or leaf-only constraints rather than active parallel execution.

## Follow-up questions for next iteration
- If not multi-agent file locks, what safety mechanism does orchestration actually need?
- Could role boundaries be enforced more strongly without introducing worker concurrency?
- What is the smallest borrowable idea from the external orchestrator?
