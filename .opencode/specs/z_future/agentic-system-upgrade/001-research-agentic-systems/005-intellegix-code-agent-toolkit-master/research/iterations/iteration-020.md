# Iteration 020 — Keep Fresh-Context Leaf Research, Reject Single-Loop Manager Replacement

Date: 2026-04-10

## Research question
Should `system-spec-kit` replace its fresh-context deep-research/deep-review loop abstraction with an external-style human-managed single-loop orchestrator that writes instructions and monitors one long-lived runtime?

## Hypothesis
No. The external single-loop manager is a strong fit for implementation automation, but it is not a better abstraction for packet-local research and review, where fresh context and write-once evidence are core strengths of the local design.

## Method
I compared the external orchestrator agent and command with the local deep-research command and loop protocol. I looked for whether the external model actually solves the same problem as the local research loop.

## Evidence
- `[SOURCE: external/agents/orchestrator.md:15-23]` The external orchestrator is explicitly a loop manager that writes instructions, launches one process, monitors it, and reports.
- `[SOURCE: external/agents/orchestrator.md:52-67]` It explicitly does not decompose tasks, delegate to specialist agents, run quality gates, or read source code directly.
- `[SOURCE: external/agents/orchestrator.md:69-109]` Its operational flow is centered on instruction writing, one background loop, anomaly response, and reporting.
- `[SOURCE: external/agents/orchestrator.md:111-122]` Its interaction model is defined around loop exit codes, state inspection, and relaunch behavior.
- `[SOURCE: .opencode/command/spec_kit/deep-research.md:136-154]` The local deep-research command is a packet-local iterative investigation workflow with initialization, repeated iterations, synthesis, and optional preserve/export.
- `[SOURCE: .opencode/command/spec_kit/deep-research.md:263-269]` It explicitly treats fresh-context leaf dispatch, externalized state, convergence detection, and persistent dashboarding as defining features.
- `[SOURCE: .opencode/skill/sk-deep-research/references/loop_protocol.md:15-16]` The local loop architecture is intentionally split between YAML lifecycle management, a leaf research agent, and reducer synchronization.
- `[SOURCE: .opencode/skill/sk-deep-research/references/loop_protocol.md:159-175]` Each iteration dispatches a constrained leaf agent that reads packet state and writes one new evidence artifact.

## Analysis
The external orchestrator solves implementation supervision. It is designed for a human or high-level manager to keep one long-running automation loop aligned with a project task. That is a different job than `system-spec-kit` deep research. The local research loop is trying to preserve evidence quality under fresh context, not maintain one instruction file while a worker loop mutates the project. The write-once iteration files and reducer-owned packet state are advantages here, not liabilities.

This is the clearest "do not pivot" result in Phase 2. Some external ideas improve the local research loop, but the top-level abstraction should remain a fresh-context evidence engine rather than a single long-lived manager loop. Replacing it would trade the local system's strongest research property for a model optimized around implementation supervision.

## Conclusion
confidence: high

finding: `system-spec-kit` should reject replacing deep-research/deep-review with an external-style single-loop orchestrator manager. Keep the fresh-context leaf iteration model and improve its controller, testing, and observability instead.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/spec_kit/deep-research.md`, `.opencode/command/spec_kit/deep-review.md`, `.opencode/skill/sk-deep-research/references/loop_protocol.md`
- **Change type:** rejected
- **Blast radius:** architectural
- **Prerequisites:** none
- **Priority:** rejected

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** Research and review run as fresh-context iterative loops with packet-local evidence files, reducers, and synthesis.
- **External repo's approach:** A human-managed orchestrator supervises one long-lived implementation loop and relaunches it when needed.
- **Why the external approach might be better:** It is simpler for supervised implementation work and makes runtime anomalies easier to operationalize.
- **Why system-spec-kit's approach might still be correct:** Research quality benefits from fresh context, write-once evidence, and reducer-owned packet state more than it benefits from one persistent manager loop.
- **Verdict:** KEEP
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** N/A. Keep the fresh-context loop, but strengthen its runtime controller and contract tests.
- **Blast radius of the change:** architectural
- **Migration path:** N/A

## Counter-evidence sought
I looked for evidence that the external single-loop manager provides a stronger research-evidence discipline than the local iteration model. I did not find it; the external abstraction is better matched to implementation automation.

## Follow-up questions for next iteration
- Which external implementation-supervision ideas can still be borrowed without replacing the local research abstraction?
- Should deep-review and deep-research share more runtime code once the abstraction boundary is explicitly preserved?
- What is the smallest controller change that would strengthen the current fresh-context loop first?
