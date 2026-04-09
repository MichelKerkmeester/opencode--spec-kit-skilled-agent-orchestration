---
title: "Deep Research Report — 004-get-it-right-main"
description: "10-iteration research of Get It Right for system-spec-kit improvement opportunities. 9 actionable findings, 1 rejected."
importance_tier: "important"
contextType: "research"
---

# Deep Research Report — 004-get-it-right-main

## 1. Executive Summary
- External repo: `Get It Right`, a Reliant workflow for structured retry-based AI coding on brownfield codebases. The bundled snapshot does not expose a canonical repo URL, but its purpose and runtime model are explicit in the local sources. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/README.md:6-18] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/workflow.yaml:3-24]
- Iterations executed: 10 of 10
- Stop reason: max_iterations
- Total actionable findings: 9
- Must-have: 5 | Should-have: 4 | Nice-to-have: 0 | Rejected: 1
- Top 3 adoption opportunities for system-spec-kit:
- Add an opt-in attempt controller to `/spec_kit:implement` rather than relying on ad hoc retries. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/workflow.yaml:111-134] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:392-433]
- Gate semantic review behind objective parallel validation so broken attempts do not consume expensive review cycles. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/workflow.yaml:310-317] [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:83-99]
- Reuse fresh-context-per-iteration semantics from the existing deep-research loop for any future implementation retry mode. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/thread-architecture.md:152-170] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:20-23]

## 2. External Repo Map
- Structure:
- `external/workflow.yaml` is the executable source of truth for loop behavior, retry budget, and inter-node wiring. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/workflow.yaml:1-40]
- `external/agents/implementer.md`, `external/agents/reviewer.md`, and `external/agents/refactorer.md` define role contracts for execution, control, and cleanup. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/agents/implementer.md:5-20] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/agents/reviewer.md:5-18] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/agents/refactorer.md:5-23]
- `external/docs/loop-explained.md`, `external/docs/thread-architecture.md`, and `external/docs/when-to-use.md` explain the mechanics, context model, and fit boundaries. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/loop-explained.md:5-21] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/thread-architecture.md:5-29] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/when-to-use.md:5-34]

```text
Original request
  -> Implement (fresh fork)
  -> Lint/Test/Build (parallel)
  -> Review (fresh fork, strategy selector)
  -> Refactor (only if strategy == refactor)
  -> Next attempt receives only review feedback
```

- Main patterns:
- Retry convergence is explicit in the loop condition rather than operator-managed. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/workflow.yaml:111-134]
- The feedback bridge is intentionally compressed to reviewer-authored guidance only. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/workflow.yaml:256-260] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/thread-architecture.md:148-170]
- Checks are parallel, objective, and capable of short-circuiting review. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/workflow.yaml:165-181] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/workflow.yaml:310-317]

## 3. Findings Registry

### Finding F-001 — Add An Opt-In Attempt Controller
- Origin iteration: `iteration-001.md`
- system-spec-kit target: `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml`
- Priority: should-have
- Description: `system-spec-kit` currently has a strong phase-oriented implementation flow, but not a first-class attempt controller for one difficult coding task. Get It Right shows that loop control becomes more reliable when retry, review, and optional cleanup are encoded into the workflow instead of improvised by the operator. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/workflow.yaml:111-134] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:392-433]
- Evidence: The external workflow treats retry as executable control flow, while the current internal implement workflow remains linear until completion validation. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/loop-explained.md:147-159] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:445-472]

### Finding F-002 — Use A Feedback-Only Bridge Between Attempts
- Origin iteration: `iteration-002.md`
- system-spec-kit target: `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml`
- Priority: should-have
- Description: The most reusable external idea is not the exact thread API but the compressed feedback bridge. The next attempt should see the original request plus a reviewer-authored corrective summary, not full prior attempt transcripts. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/workflow.yaml:14-24] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/agents/reviewer.md:41-53]
- Evidence: The external main thread stores only saved review messages, while internal durable memory is deliberately reserved for post-session preservation. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/thread-architecture.md:7-29] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:501-518]

### Finding F-003 — Reuse Fresh-Context Iteration Semantics
- Origin iteration: `iteration-003.md`
- system-spec-kit target: `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml`
- Priority: must-have
- Description: Any future retry workflow should reuse the same fresh-context pattern already used by internal deep research. The external repo proves it works for implementation retries; the internal repo proves the team already accepts this model operationally. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/thread-architecture.md:152-170] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:20-23]
- Evidence: Both systems separate leaf-attempt work from workflow-owned continuity, and both depend on externalized state rather than cumulative chat history. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/workflow.yaml:147-150] [SOURCE: .opencode/agent/deep-research.md:24-32]

### Finding F-004 — Add A Pre-Review Validation Gate
- Origin iteration: `iteration-004.md`
- system-spec-kit target: `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml`
- Priority: must-have
- Description: Broken attempts should fail fast on objective checks before semantic review runs. `system-spec-kit` already has deterministic validators, so this is a low-risk way to improve attempt cadence and reduce expensive review on obviously invalid outputs. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/workflow.yaml:310-317] [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:83-99]
- Evidence: The external repo wires failed checks to immediate loop continuation, while the internal repo emphasizes validation primarily near completion. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/loop-explained.md:34-44] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:449-472]

### Finding F-005 — Extend The Review Agent With A Strategy Field
- Origin iteration: `iteration-005.md`
- system-spec-kit target: `.opencode/agent/review.md`
- Priority: should-have
- Description: The current internal review agent already scores quality well, but a retry controller needs an explicit branch choice. Adding a `strategy` output, similar to `pass | continue | refactor`, would make review usable as workflow control rather than only retrospective scoring. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/workflow.yaml:191-223] [SOURCE: .opencode/agent/review.md:237-257]
- Evidence: The external reviewer is defined as a controller and sole bridge between attempts, while the internal reviewer remains primarily a scorer and issue classifier. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/agents/reviewer.md:3-12] [SOURCE: .opencode/agent/review.md:124-131]

### Finding F-006 — Adopt The Pattern, Not The Runtime
- Origin iteration: `iteration-007.md`
- system-spec-kit target: `.opencode/command/spec_kit/implement.md`
- Priority: must-have
- Description: `system-spec-kit` should describe the future retry design as an internal workflow pattern rather than as a translation of Reliant features. The thread API is non-portable, but the controller logic is already reproducible inside this repo's YAML-driven loop architecture. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/thread-architecture.md:7-15] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:328-343]
- Evidence: Internal deep research already shows reducer-owned loop state, per-iteration leaf execution, and synthesis ownership without any Reliant runtime dependency. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:385-445] [SOURCE: .opencode/agent/deep-research.md:24-32]

### Finding F-007 — Keep Retry Feedback Packet-Local
- Origin iteration: `iteration-008.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/SKILL.md`
- Priority: should-have
- Description: Retry guidance should stay in packet-local state and never be treated as durable memory by default. The external design uses the bridge only to steer the next attempt, while internal memory quality rules assume higher-stability artifacts. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/thread-architecture.md:11-15] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:86-115]
- Evidence: Internal memory save is a hard-bounded end-of-session step, and internal reducer-owned artifacts already offer a natural home for ephemeral observability without polluting memory search. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:501-518] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:361-369]

### Finding F-008 — Build A Configurable Parallel Verification Matrix
- Origin iteration: `iteration-009.md`
- system-spec-kit target: `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml`
- Priority: must-have
- Description: The external check stage is directly reusable as a pattern: configure objective checks by project, run them in parallel, join their results, and use them as the pre-review gate. Internal validators and repo-native commands already exist; what is missing is the packaged orchestration. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/workflow.yaml:165-181] [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:83-99]
- Evidence: Internal completion expects validation and test evidence already, which means the commands are present even if the reusable matrix is not. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/when-to-use.md:110-131] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:449-472]

### Finding F-009 — Keep The Retry Loop Opt-In And Phase-Scoped
- Origin iteration: `iteration-010.md`
- system-spec-kit target: `.opencode/command/spec_kit/implement.md`
- Priority: must-have
- Description: A Get It Right-style loop should be an explicit mode for brownfield understanding failures, not the default implementation path. Phase 004 should define the retry architecture; phase 001 can later consume telemetry from it for optimization, but the two should stay cleanly separated. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/when-to-use.md:5-52] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/phase-research-prompt.md:44-61]
- Evidence: Internal command design already favors specialized opt-in workflows rather than universal one-size-fits-all execution. [SOURCE: .opencode/command/spec_kit/deep-research.md:147-173] [SOURCE: .opencode/skill/system-spec-kit/constitutional/gate-enforcement.md:62-69]

## 4. Rejected Recommendations

### Rejection R-001 — Do Not Adopt Default In-Place Undo Refactoring
- Origin iteration: `iteration-006.md`
- Rationale: The external undo-only refactorer is sensible in an isolated workspace, but `system-spec-kit` frequently operates in dirty, shared worktrees. Internal failure handling currently escalates to debug or reassignment rather than automatic revert behavior, and that safety posture should stay intact unless worktree isolation becomes a hard prerequisite. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/agents/refactorer.md:17-30] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:414-417] [SOURCE: .opencode/agent/review.md:255-258]

## 5. Cross-Phase Implications
- Phase `001-agent-lightning-main`: retry feedback, check outcomes, and branch decisions could later become optimization signal, but this phase should stop at defining the retry controller and state boundaries. Do not mix controller design with training or tuning. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/phase-research-prompt.md:44-61]
- Phase `005-intellegix-code-agent-toolkit` and `008-BAD-autonomous-development`: if those phases surface stronger worktree isolation or portfolio orchestration patterns, they could revisit the rejected in-place refactor path under safer conditions. This phase alone does not justify it. [INFERENCE: based on the phase brief's cross-phase boundary table and the refactor risk profile]
- Phase `006-ralph-main`: Ralph-style persistence should stay distinct from the compressed feedback bridge. This phase supports a narrow inter-attempt state artifact, not a general persistent-memory layer. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/phase-research-prompt.md:57-61]

## 6. Recommended Next Step
Plan Finding F-004 first: add a pre-review validation gate to the future retry design, reusing `validate.sh --strict` and optional repo-native lint/test/build hooks. It is the smallest high-leverage wedge because it uses existing internal commands, lowers review waste immediately, and sets up the controller contract needed for F-001, F-003, and F-005.
