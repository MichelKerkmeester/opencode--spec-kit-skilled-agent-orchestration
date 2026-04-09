---
title: "Deep Research Report — 008-bmad-autonomous-development"
description: "10-iteration research of BMad Autonomous Development for system-spec-kit improvement opportunities. 7 actionable findings, 3 rejected."
importance_tier: "important"
contextType: "research"
---

# Deep Research Report — 008-bmad-autonomous-development

## 1. Executive Summary
- External repo: BMad Autonomous Development (`bmad-bad`), a skill-packaged sprint execution orchestrator published at `https://github.com/stephenleo/bmad-autonomous-development`. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/.claude-plugin/marketplace.json:2-6]
- Iterations executed: 10 of 10
- Stop reason: max_iterations
- Total actionable findings: 7
- Must-have: 2 | Should-have: 4 | Nice-to-have: 1 | Rejected: 3
- Top 3 adoption opportunities for system-spec-kit:
  - Add explicit staged execution contracts to autonomous implementation so long runs can pause/resume safely between create/build/review/PR-style checkpoints. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:189-205] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:392-473]
  - Introduce `model_standard` / `model_quality` tiering to stop using premium models for every autonomous step. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:51-64] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:66-75]
  - Expand contract-parity tests when new automation bundles add setup assets, docs, commands, and runtime mirrors so config/path drift fails fast. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/assets/module-setup.md:9-23] [SOURCE: .opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts:24-84]

## 2. External Repo Map
- The BAD snapshot is documentation-first: one `skills/bad/SKILL.md` coordinator contract, three phase references, setup assets, and plugin packaging metadata. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/README.md:80-93]
- BAD is not a service process; it is a skill-style orchestration layer that assumes BMad Method planning artifacts already exist. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/README.md:23-33]
- Its architecture is coordinator-centric:

```text
Planning artifacts + GitHub state
            |
            v
  Phase 0 dependency graph builder
            |
            v
   Coordinator ready-story selector
            |
            v
  Parallel story pipelines in worktrees
   create -> dev -> review -> PR/CI
            |
            v
   Optional sequential auto-merge
            |
            v
   wait / retro / continue loop
```

- The coordinator is intentionally thin and delegates almost everything to fresh-context subagents. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:16-25]

## 3. Findings Registry

### Finding F-001 — Tighten Coordinator Boundaries
- Origin iteration: `iteration-001.md`
- system-spec-kit target: `.opencode/agent/orchestrate.md`
- Priority: should-have
- Description: BAD's strongest orchestration lesson is the narrow coordinator contract: select work, spawn workers, manage timers, and report status, but do not become an implementation agent. Local orchestration already forbids direct implementation, yet it could state the boundary more explicitly for future long-running automation. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:16-25] [SOURCE: .opencode/agent/orchestrate.md:36-46]
- Evidence: BAD uses coordinator-only responsibilities and pure-coordinator Phase 1; local orchestrate already enforces single-hop delegation but allows a broader read surface. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:177-205] [SOURCE: .opencode/agent/deep-research.md:28-42]

### Finding F-002 — Add A Readiness Ledger Concept For Phased Work
- Origin iteration: `iteration-002.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/references/structure/phase_definitions.md`
- Priority: should-have
- Description: BAD cleanly separates dependency structure from completion truth: backlog files define edges, but GitHub merge state decides whether a dependency is truly satisfied. Local phase docs currently stop at documented relationships and recursive folder validation. A future readiness ledger would let phased automation reason about "planned" versus "merged" without hand-waving. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/references/phase0-dependency-graph.md:7-33] [SOURCE: .opencode/skill/system-spec-kit/references/structure/phase_definitions.md:147-233]
- Evidence: BAD repairs `sprint-status.yaml` from GitHub merge truth and computes ready-to-work from merged dependencies and epic ordering. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:103-166] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/references/phase0-dependency-graph.md:66-73]

### Finding F-003 — Queue-Based Phase Scheduling Is Interesting But Not First
- Origin iteration: `iteration-003.md`
- system-spec-kit target: `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml`
- Priority: nice-to-have
- Description: BAD's ready-queue scheduler is more mature than local intra-phase parallel dispatch because it chooses from backlog-wide candidates subject to epic order and dependency completion. That is useful for a future sprint runner, but it is a layer above today's `spec_kit:implement` responsibilities. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:177-185] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:392-405]
- Evidence: local implement automation decides whether to split code/testing work, not which packet or child phase should run next. [SOURCE: .opencode/skill/system-spec-kit/references/structure/phase_definitions.md:186-233]

### Finding F-004 — Stage Contracts Are The Best Direct Transfer
- Origin iteration: `iteration-005.md`
- system-spec-kit target: `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml`
- Priority: must-have
- Description: BAD's four-step pipeline is explicit enough to resume safely, attribute failures precisely, and inject coordinator-only checks between stages. Local autonomous implementation is strong on gates before and after development, but its main execution section is still coarse. The most direct upgrade is to decompose Step 6 into explicit stage contracts with named outputs and resume points. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:189-205] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:392-473]
- Evidence: BAD records state transitions (`ready-for-dev`, `review`, `done`) and runs pre-continuation checks between steps. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:231-235] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/references/pre-continuation-checks.md:1-88]

### Finding F-005 — Model Tiering Should Land Early
- Origin iteration: `iteration-006.md`
- system-spec-kit target: `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- Priority: must-have
- Description: BAD's `MODEL_STANDARD` / `MODEL_QUALITY` split is an immediately portable optimization. Local deep-research, deep-review, and implement workflows currently default to one premium model across most autonomous work. Introducing tiered model keys would lower cost and latency without weakening quality-sensitive review/synthesis steps. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:51-64] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:66-75]
- Evidence: local deep-review and implement assets show the same single-model pattern today. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:69-78] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:167-186]

### Finding F-006 — Add An Opt-In PR Watch And Repair Loop
- Origin iteration: `iteration-007.md`
- system-spec-kit target: `.opencode/skill/sk-git/references/finish_workflows.md`
- Priority: should-have
- Description: BAD treats PR creation as the middle of the execution loop, not the end: it watches CI, runs a local fallback when needed, fixes failures, and re-reviews until clean. That is too heavy for the default git finish workflow, but it is valuable as an explicit opt-in automation mode layered above basic PR creation. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:270-336] [SOURCE: .opencode/skill/sk-git/references/finish_workflows.md:172-227]
- Evidence: BAD even re-checks CI during auto-merge to catch rebases or delayed reruns. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/references/phase4-auto-merge.md:36-49]

### Finding F-007 — Keep Expanding Contract-Parity Tests
- Origin iteration: `iteration-009.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts`
- Priority: should-have
- Description: BAD's config-path inconsistency shows how easy it is for setup assets, docs, and skill entrypoints to drift apart. `system-spec-kit` already has a good antidote in its deep-research parity tests. That pattern should become standard whenever the repo adds a new automation bundle with multiple docs, runtime mirrors, and setup assets. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:10-14] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/assets/module-setup.md:9-23]
- Evidence: public BAD docs claim `_bmad/bad/config.yaml`, while setup writes `_bmad/config.yaml`; local parity tests already catch canonical artifact drift for deep research. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/README.md:61-74] [SOURCE: .opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts:24-84]

## 4. Rejected Recommendations

### Rejected R-001 — Do Not Make `sk-git` Autonomously Create Worktrees
- Origin iterations: `iteration-004.md`
- Rationale: BAD's per-story worktree automation assumes a sprint runner that owns the whole batch. Local git rules deliberately require the user to choose worktree versus current branch first, so inheriting BAD's autonomy here would break a core local safety contract. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:212-236] [SOURCE: .opencode/skill/sk-git/SKILL.md:202-215]

### Rejected R-002 — Do Not Fold Sequential Batch Auto-Merge Into Default Git Finish
- Origin iteration: `iteration-008.md`
- Rationale: BAD's merge ordering only makes sense when a coordinator already owns an ordered batch of related story branches. `sk-git` is a general workflow skill, not a batch scheduler, so defaulting it to BAD's merge semantics would over-specialize the git layer. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:340-353] [SOURCE: .opencode/skill/sk-git/references/finish_workflows.md:25-39]

### Rejected R-003 — Do Not Treat BAD's Guard Claim As Verified Enforcement
- Origin iteration: `iteration-010.md`
- Rationale: The BAD snapshot documents a strong coordinator boundary but does not expose a hook or manifest-level guard that technically enforces it. Local constitutional docs can articulate similar expectations, but they should not claim BAD proved a portable enforcement mechanism. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:16-25] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/.claude-plugin/marketplace.json:22-32]

## 5. Cross-Phase Implications
- Overlap with phase `003`: BAD's unverified guard/hook narrative is relevant to the hook-and-workflow packet, but phase `008` should keep ownership of the sprint-automation conclusion: the coordinator boundary is useful even when hard enforcement is missing. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/assets/module-setup.md:24-38] [SOURCE: .opencode/skill/system-spec-kit/constitutional/gate-enforcement.md:58-103]
- Overlap with phase `005`: generalized multi-agent worktree architecture belongs partly there, but phase `008` owns the specific scheduler + stage-pipeline + batch-merge story because those behaviors only make sense together. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:72-99] [SOURCE: .opencode/skill/sk-git/references/worktree_workflows.md:43-57]

## 6. Recommended Next Step
Plan the stage-contract upgrade first in `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml`, then pair it immediately with model-tier keys across the autonomous YAML assets. That sequence has the best payoff-to-risk ratio: it improves resumability and auditability in an existing local workflow, and it creates the stage boundaries needed to make model tiering meaningful rather than purely cosmetic. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:392-473] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:66-75]
