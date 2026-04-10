---
title: "Deep Research Report — 004-get-it-right-main"
description: "20-iteration research of Get It Right for system-spec-kit improvement and refactor opportunities. 17 actionable findings, 3 rejected."
importance_tier: "important"
contextType: "research"
---

# Deep Research Report — 004-get-it-right-main

## 1. Executive Summary
- External repo: `Get It Right`, a Reliant workflow for structured retry-based AI coding on brownfield codebases. The bundled snapshot does not expose a canonical repo URL, but its purpose and runtime model are explicit in the local sources. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/README.md:7-12] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/workflow.yaml:3-24]
- Iterations executed: 20 of 20
- Stop reason: max_iterations
- Total actionable findings: 17
- Must-have: 8 | Should-have: 9 | Nice-to-have: 0 | Rejected: 3
- Phase 2 changed the recommendation shape. The main value is no longer just "add a retry feature." Get It Right exposes places where `system-spec-kit` should separate retry control from implementation completion, keep loop state out of durable memory, and treat objective code outcomes as the first-class attempt gate. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/loop-explained.md:34-75] [SOURCE: .opencode/command/spec_kit/implement.md:151-205] [SOURCE: .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:61-93]
- Top 5 adoption opportunities for system-spec-kit:
- Create a separate opt-in retry controller instead of bolting retries into the 9-step `/spec_kit:implement` workflow. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/workflow.yaml:7-24] [SOURCE: .opencode/command/spec_kit/implement.md:151-205]
- Keep loop-critical working state packet-local and reserve durable memory for synthesis or explicit save boundaries. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/thread-architecture.md:11-28] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:591-611]
- Use outcome-centric attempt gates: objective code checks first, semantic review second, packet validation at completion. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/loop-explained.md:54-75] [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:94-99]
- Give retry-mode a fixed artifact set instead of reusing Level 1/2/3 documentation arbitration. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/README.md:162-177] [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/create.sh:225-244]
- Extract a shared loop kernel across retry, deep-research, and deep-review instead of building another bespoke orchestration stack. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/workflow.yaml:108-134] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:212-380] [SOURCE: .opencode/skill/sk-deep-review/SKILL.md:163-243]

## 2. External Repo Map
- Structure:
- `external/workflow.yaml` is the executable source of truth for loop behavior, retry budget, and inter-node wiring. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/workflow.yaml:1-40]
- `external/agents/implementer.md`, `external/agents/reviewer.md`, and `external/agents/refactorer.md` define role contracts for execution, control, and cleanup. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/README.md:152-158]
- `external/docs/loop-explained.md`, `external/docs/thread-architecture.md`, and `external/docs/when-to-use.md` explain the mechanics, context model, and fit boundaries. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/README.md:172-177]
- The small repo shape is itself a signal: the published artifact set is a workflow, three agent docs, three explanation docs, and a license. There is no extra persistence, validation-rule, or governance layer in the loop product. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/README.md:162-177]

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
- Operator-facing control is exposed through a compact set of knobs: retry budget, yield policy, mode, check commands, and optional app-start inputs for UX review. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/README.md:80-105]

## 3. Phase 1 Findings Registry

### Finding F-001 — Add An Opt-In Attempt Controller
- Origin iteration: `iteration-001.md`
- system-spec-kit target: `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml`
- Priority: should-have
- Description: `system-spec-kit` currently has a strong phase-oriented implementation flow, but not a first-class attempt controller for one difficult coding task. Get It Right shows that loop control becomes more reliable when retry, review, and optional cleanup are encoded into the workflow instead of improvised by the operator. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/workflow.yaml:111-134] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:313-518]
- Evidence: The external workflow treats retry as executable control flow, while the current internal implement workflow remains linear until completion validation. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/loop-explained.md:147-159] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:445-472]

### Finding F-002 — Use A Feedback-Only Bridge Between Attempts
- Origin iteration: `iteration-002.md`
- system-spec-kit target: `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml`
- Priority: should-have
- Description: The most reusable external idea is not the exact thread API but the compressed feedback bridge. The next attempt should see the original request plus a reviewer-authored corrective summary, not full prior attempt transcripts. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/workflow.yaml:14-24] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/workflow.yaml:256-260]
- Evidence: The external main thread stores only saved review messages, while internal durable memory is deliberately reserved for post-session preservation. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/thread-architecture.md:7-29] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:501-518]

### Finding F-003 — Reuse Fresh-Context Iteration Semantics
- Origin iteration: `iteration-003.md`
- system-spec-kit target: `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml`
- Priority: must-have
- Description: Any future retry workflow should reuse the same fresh-context pattern already used by internal deep research. The external repo proves it works for implementation retries; the internal repo proves the team already accepts this model operationally. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/thread-architecture.md:152-170] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:212-330]
- Evidence: Both systems separate leaf-attempt work from workflow-owned continuity, and both depend on externalized state rather than cumulative chat history. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/workflow.yaml:147-150] [SOURCE: .opencode/agent/deep-research.md:24-60]

### Finding F-004 — Add A Pre-Review Validation Gate
- Origin iteration: `iteration-004.md`
- system-spec-kit target: `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml`
- Priority: must-have
- Description: Broken attempts should fail fast on objective checks before semantic review runs. `system-spec-kit` already has deterministic validators, so this is a low-risk way to improve attempt cadence and reduce expensive review on obviously invalid outputs. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/workflow.yaml:310-317] [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:80-99]
- Evidence: The external repo wires failed checks to immediate loop continuation, while the internal repo emphasizes validation primarily near completion. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/loop-explained.md:34-44] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:449-472]

### Finding F-005 — Extend The Review Agent With A Strategy Field
- Origin iteration: `iteration-005.md`
- system-spec-kit target: `.opencode/agent/review.md`
- Priority: should-have
- Description: The current internal review agent already scores quality well, but a retry controller needs an explicit branch choice. Adding a `strategy` output, similar to `pass | continue | refactor`, would make review usable as workflow control rather than only retrospective scoring. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/workflow.yaml:191-223] [SOURCE: .opencode/agent/review.md:239-243]
- Evidence: The external reviewer is defined as a controller and sole bridge between attempts, while the internal reviewer remains primarily a scorer and issue classifier. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/workflow.yaml:239-260] [SOURCE: .opencode/agent/review.md:124-131]

### Finding F-006 — Adopt The Pattern, Not The Runtime
- Origin iteration: `iteration-007.md`
- system-spec-kit target: `.opencode/command/spec_kit/implement.md`
- Priority: must-have
- Description: `system-spec-kit` should describe the future retry design as an internal workflow pattern rather than as a translation of Reliant features. The thread API is non-portable, but the controller logic is already reproducible inside this repo's YAML-driven loop architecture. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/thread-architecture.md:7-15] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:294-330]
- Evidence: Internal deep research already shows reducer-owned loop state, per-iteration leaf execution, and synthesis ownership without any Reliant runtime dependency. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:328-369] [SOURCE: .opencode/agent/deep-research.md:24-60]

### Finding F-007 — Keep Retry Feedback Packet-Local
- Origin iteration: `iteration-008.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/SKILL.md`
- Priority: should-have
- Description: Retry guidance should stay in packet-local state and never be treated as durable memory by default. The external design uses the bridge only to steer the next attempt, while internal memory quality rules assume higher-stability artifacts. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/thread-architecture.md:11-15] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/quality-gates.ts:17-67]
- Evidence: Internal memory save is a hard-bounded end-of-session step, and internal reducer-owned artifacts already offer a natural home for ephemeral observability without polluting memory search. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:501-518] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:328-369]

### Finding F-008 — Build A Configurable Parallel Verification Matrix
- Origin iteration: `iteration-009.md`
- system-spec-kit target: `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml`
- Priority: must-have
- Description: The external check stage is directly reusable as a pattern: configure objective checks by project, run them in parallel, join their results, and use them as the pre-review gate. Internal validators and repo-native commands already exist; what is missing is the packaged orchestration. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/workflow.yaml:165-181] [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:80-99]
- Evidence: Internal completion expects validation and test evidence already, which means the commands are present even if the reusable matrix is not. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/when-to-use.md:110-131] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:449-472]

### Finding F-009 — Keep The Retry Loop Opt-In And Phase-Scoped
- Origin iteration: `iteration-010.md`
- system-spec-kit target: `.opencode/command/spec_kit/implement.md`
- Priority: must-have
- Description: A Get It Right-style loop should be an explicit mode for brownfield understanding failures, not the default implementation path. Phase 004 should define the retry architecture; phase 001 can later consume telemetry from it for optimization, but the two should stay cleanly separated. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/when-to-use.md:5-52] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/phase-research-prompt.md:44-61]
- Evidence: Internal command design already favors specialized opt-in workflows rather than universal one-size-fits-all execution. [SOURCE: .opencode/command/spec_kit/deep-research.md:151-176] [SOURCE: .opencode/skill/system-spec-kit/constitutional/gate-enforcement.md:62-68]

## 4. Phase 2 Findings Registry

### Finding F-010 — Separate Retry Controller From `/spec_kit:implement`
- Origin iteration: `iteration-011.md`
- system-spec-kit target: `.opencode/command/spec_kit/retry.md` plus dedicated YAML assets
- Priority: must-have
- Description: The external repo points toward a separate retry controller, not a retry branch buried inside the existing 9-step implementation command. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/workflow.yaml:7-24] [SOURCE: .opencode/command/spec_kit/implement.md:151-205]
- Evidence: The current implement workflow also owns doc levels, checklist handling, memory save, and handover, which are unrelated to attempt-scoped retry control. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:73-131] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:313-518]

### Finding F-011 — Use A Fixed Retry Packet Instead Of Level Arbitration
- Origin iteration: `iteration-012.md`
- system-spec-kit target: retry packet conventions plus `create.sh` / `validate.sh` routing rules
- Priority: should-have
- Description: Retry-mode should not reuse the full Level 1/2/3+ documentation model. The external repo's fixed artifact set is a better shape for attempt history and feedback continuity. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/README.md:162-177] [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/create.sh:225-244]
- Evidence: Internal phase creation and recursive validation are built for durable feature documentation, not high-churn attempt state. [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/create.sh:590-880] [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:531-616]

### Finding F-012 — Simplify Retry UX To A Few Explicit Knobs
- Origin iteration: `iteration-013.md`
- system-spec-kit target: retry command surface
- Priority: should-have
- Description: Once a packet is already bound, retry-mode should be controlled by a few explicit knobs such as retry budget, yield, mode, checks, and optional UX review inputs. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/README.md:80-105] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/when-to-use.md:89-139]
- Evidence: The current implementation setup flow is optimized for generic first-run execution and asks for folder, mode, dispatch, and memory choices. [SOURCE: .opencode/command/spec_kit/implement.md:29-125] [SOURCE: .opencode/skill/system-spec-kit/constitutional/gate-enforcement.md:62-68]

### Finding F-013 — Split Working State From Durable Memory More Aggressively
- Origin iteration: `iteration-014.md`
- system-spec-kit target: memory save architecture (`generate-context.js`, post-save review, loop command contracts)
- Priority: must-have
- Description: The durable memory pipeline is solving a different problem from inter-attempt steering. Retry continuity should stay packet-local, with durable memory reserved for synthesis and explicit session preservation. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/thread-architecture.md:11-28] [SOURCE: .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:61-93]
- Evidence: Internal durable memory creation includes JSON-mode routing, post-save review, metadata drift checks, quality gates, and possible rejection/manual patch requirements. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:591-611] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:1080-1133] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/quality-gates.ts:17-67]

### Finding F-014 — Refactor Execution Loops Around A Smaller Core Role Set
- Origin iteration: `iteration-015.md`
- system-spec-kit target: agent architecture and orchestrator routing contracts
- Priority: should-have
- Description: The external loop shows that execution workflows become easier to reason about when the runtime role vocabulary is small. `system-spec-kit` likely needs a smaller reusable core role set for loop internals, even if specialist names remain user-facing. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/README.md:152-158] [SOURCE: .opencode/agent/orchestrate.md:171-181]
- Evidence: Internal workflows currently mix capability roles and workflow-specific leaves, which increases orchestration surface area. [SOURCE: .opencode/agent/orchestrate.md:191-211] [SOURCE: .opencode/agent/deep-research.md:24-32]

### Finding F-015 — Make Deep-Loop Views Optional, Not Mandatory
- Origin iteration: `iteration-016.md`
- system-spec-kit target: `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- Priority: should-have
- Description: Rich loop observability is useful, but the current deep-research contract likely makes too many state views mandatory. Smaller loops should be able to run with a lighter kernel. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:79-89] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:218-369]
- Evidence: The internal loop treats strategy, registry, and dashboard as synchronized packet surfaces rather than optional views. [SOURCE: .opencode/agent/deep-research.md:159-165] [SOURCE: .opencode/agent/deep-research.md:203-213]

### Finding F-016 — Pivot Retry Validation Toward Outcome-Centric Attempt Gates
- Origin iteration: `iteration-018.md`
- system-spec-kit target: retry workflow and implementation completion contracts
- Priority: must-have
- Description: Retry-mode should gate first on objective code outcomes and only later on full packet-validation concerns. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/loop-explained.md:34-75] [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:94-99]
- Evidence: The internal validator's rule set is document-structure heavy, while current completion rules already reserve it for the end of the implementation workflow. [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:315-319] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:447-477]

### Finding F-017 — Extract A Generic Loop Kernel Shared By Retry, Deep Research, And Deep Review
- Origin iteration: `iteration-020.md`
- system-spec-kit target: loop orchestration architecture across command YAMLs and supporting scripts
- Priority: should-have
- Description: The strongest Phase 2 architecture signal is repetition. Retry, deep-research, and deep-review all follow the same broad skeleton and should share a kernel instead of each re-implementing orchestration. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/workflow.yaml:108-134] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:212-380] [SOURCE: .opencode/skill/sk-deep-review/SKILL.md:163-243]
- Evidence: Deep research and deep review already both use command -> loop engine -> leaf agent -> disk-backed state packet architectures, which makes the duplication visible and extractable. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:385-487] [SOURCE: .opencode/skill/sk-deep-review/SKILL.md:163-243]

## 5. Refactor / Pivot Recommendations

| Iteration | Subsystem | Verdict | Summary | Blast Radius |
| --- | --- | --- | --- | --- |
| 011 | Command / implementation flow | REFACTOR | Build retry-mode as a separate controller, not as an extension of the 9-step implement workflow | large |
| 012 | Spec packet shape | SIMPLIFY | Use a fixed retry packet instead of Level 1/2/3 arbitration | medium |
| 013 | Operator UX | SIMPLIFY | Replace the generic setup questionnaire with a few retry-specific knobs after packet binding | medium |
| 014 | Memory architecture | PIVOT | Split loop-critical working state from durable indexed memory more aggressively | architectural |
| 015 | Agent taxonomy | REFACTOR | Introduce a smaller reusable runtime core for execution loops | large |
| 016 | Deep-loop infrastructure | SIMPLIFY | Make dashboard/registry/strategy optional generated views for lightweight loops | medium |
| 017 | Global specialist roster | KEEP | Preserve research/doc/handover specialists outside the retry kernel | large if misapplied |
| 018 | Validation philosophy | REFACTOR | Make objective code checks the primary retry gate and reserve packet validation for completion | large |
| 019 | Durable spec lifecycle | KEEP | Do not replace long-lived spec docs with README-style minimalism | large if misapplied |
| 020 | Iterative workflow architecture | REFACTOR | Extract a shared loop kernel across retry, deep-research, and deep-review | architectural |

## 6. Rejected Recommendations

### Rejection R-001 — Do Not Adopt Default In-Place Undo Refactoring
- Origin iteration: `iteration-006.md`
- Rationale: The external undo-only refactorer is sensible in an isolated workspace, but `system-spec-kit` frequently operates in dirty, shared worktrees. Internal failure handling currently escalates to debug or reassignment rather than automatic revert behavior, and that safety posture should stay intact unless worktree isolation becomes a hard prerequisite. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/workflow.yaml:262-293] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:414-417] [SOURCE: .opencode/agent/review.md:255-258]

### Rejection R-002 — Do Not Collapse The Entire Agent System Into Three Loop Roles
- Origin iteration: `iteration-017.md`
- Rationale: Get It Right uses three roles because it is a narrow retry product. `system-spec-kit` still needs explicit research, documentation, debug, and handover specialists outside the retry kernel. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/README.md:152-158] [SOURCE: .opencode/agent/orchestrate.md:171-181] [SOURCE: .opencode/agent/deep-research.md:24-32]

### Rejection R-003 — Do Not Replace Durable Spec Docs With README-Style Minimalism
- Origin iteration: `iteration-019.md`
- Rationale: The external repo's minimal docs are appropriate for a focused workflow product, but they are not a substitute for `system-spec-kit`'s long-lived planning, verification, and audit artifacts. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/README.md:162-177] [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/create.sh:225-244] [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:80-99]

## 7. Cross-Phase Implications
- Phase `001-agent-lightning-main`: retry feedback, check outcomes, and branch decisions still look like promising optimization signal, but the architecture work here should stop at the controller, state boundaries, and operator contract. Training/tuning remains a later consumer, not part of Phase 004. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/phase-research-prompt.md:44-61]
- Deep research and deep review are now part of the evidence base, not just analogies. Both already prove that `system-spec-kit` accepts loop engines with fresh-context leaf execution and disk-backed state packets, which lowers the risk of a retry-kernel extraction. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:212-380] [SOURCE: .opencode/skill/sk-deep-review/SKILL.md:163-243]
- The external repo reinforces the Phase 1 boundary on memory: retry guidance should remain ephemeral and local to the loop, while durable memory stays reserved for curated synthesis and handoff. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/thread-architecture.md:11-28] [SOURCE: .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:61-93]
- Phase 2 weakens the case for using the full spec lifecycle inside retry-mode, but it strengthens the case for keeping durable spec docs for feature packets. The simplification target is loop-local machinery, not the whole packet model. [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/create.sh:225-244] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/README.md:162-177]

## 8. Priority Queue
1. **F-010 — Separate retry controller:** design an opt-in `/spec_kit:retry` surface rather than extending `/spec_kit:implement` directly. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/workflow.yaml:7-24] [SOURCE: .opencode/command/spec_kit/implement.md:151-205]
2. **F-013 — Two-lane state model:** formalize packet-local working state versus durable memory saves before retry-mode implementation begins. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/thread-architecture.md:148-170] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:591-611]
3. **F-016 — Outcome-centric attempt gates:** define the objective check matrix that decides whether review runs. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/loop-explained.md:54-75] [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:94-99]
4. **F-011 — Fixed retry packet:** prevent retry-mode from inheriting Level 1/2/3 branching and recursive spec validation by default. [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/create.sh:225-244] [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:531-616]
5. **F-017 — Shared loop kernel:** once retry-mode is framed, use it to extract common primitives already visible in deep-research and deep-review. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:212-380] [SOURCE: .opencode/skill/sk-deep-review/SKILL.md:163-243]
6. **Second-wave improvements:** F-003, F-004, F-005, F-012, F-014, and F-015 remain valuable, but they depend on the architectural split above being defined first.

## 9. Recommended Next Step
Plan one focused architecture phase around F-010, F-013, F-016, and F-011 together. The design brief should answer five questions in order:
1. What is the exact `/spec_kit:retry` command contract?
2. What is the fixed retry packet shape?
3. Which objective checks make up the attempt gate?
4. What reviewer strategy schema becomes the feedback bridge?
5. When, if ever, does retry-mode promote outputs into durable memory?

That sequence captures the main lesson from Get It Right: solve the loop as a small, explicit controller first, then attach richer governance only at the boundaries. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/workflow.yaml:7-24] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/thread-architecture.md:148-170] [SOURCE: .opencode/command/spec_kit/implement.md:151-205]
