---
title: "Deep Research Report — 008-bmad-autonomous-development"
description: "20-iteration research of BMad Autonomous Development for system-spec-kit improvement, refactor, and simplification opportunities. 14 actionable findings, 6 rejected."
importance_tier: "important"
contextType: "research"
---

# Deep Research Report — 008-bmad-autonomous-development

## 1. Executive Summary
- External repo: BMad Autonomous Development (`bmad-bad`), a skill-packaged sprint execution orchestrator published at `https://github.com/stephenleo/bmad-autonomous-development`. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/.claude-plugin/marketplace.json:2-6]
- Iterations executed: 20 of 20
- Phase split: Phase 1 (`001`-`010`) established adoption opportunities; Phase 2 (`011`-`020`) expanded into refactor, pivot, simplification, architecture, and UX questions.
- Stop reason: max_iterations
- Total actionable findings: 14
- Must-have: 4 | Should-have: 9 | Nice-to-have: 1 | Rejected: 6
- Phase 2 verdict mix: REFACTOR 2 | PIVOT 2 | SIMPLIFY 3 | KEEP 3
- Top combined adoption opportunities for `system-spec-kit`:
  - Add explicit staged execution contracts to autonomous implementation so long runs can pause/resume safely between create/build/review/PR-style checkpoints. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:189-205] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:392-473]
  - Introduce `model_standard` / `model_quality` tiering and move shared autonomous workflow settings into a workflow-profile layer instead of scattering them across YAML assets and env flags. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:51-64] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/assets/module.yaml:5-38] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:66-89]
  - Refactor long-running loop recovery to use explicit runtime-aware continuation states such as compact, pause, manual resume, and continue-now. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/references/pre-continuation-checks.md:3-54] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:128-155]
  - Simplify the live deep-loop contract by separating active behavior from reference-only or future-facing state concepts. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/references/pre-continuation-checks.md:3-15] [SOURCE: .opencode/skill/sk-deep-research/references/state_format.md:65-183] [SOURCE: .opencode/skill/sk-deep-research/references/convergence.md:117-150]
  - Keep future BAD-like sprint automation out of core `spec_kit` / `memory` contracts until it proves itself as an extension-level module on top of existing primitives. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/README.md:9-20] [SOURCE: .opencode/command/spec_kit/README.txt:43-76]

## 2. External Repo Map
- The BAD snapshot is documentation-first: one `skills/bad/SKILL.md` coordinator contract, three phase references, setup assets, merge helpers, and plugin packaging metadata. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/README.md:80-93]
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
- Phase 2's deeper pass found the strongest new signals in areas Phase 1 only touched lightly:
  - Harness-aware setup and config ownership live in one module-owned layer instead of being spread across workflow assets. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/assets/module-setup.md:21-93] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/assets/module.yaml:5-38]
  - Continuation is treated as a runtime contract with explicit timer/rate-limit branches. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/references/pre-continuation-checks.md:3-88]
  - Merge helpers actively migrate legacy config and prevent zombie markers within the active module boundary. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/scripts/merge-config.py:230-275] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/scripts/merge-help-csv.py:176-212]
  - The repo has no semantic memory, governed retrieval layer, multi-level documentation taxonomy, or large validator stack. That absence matters because it shows what BAD can omit when it stays a thin domain module instead of a general planning/governance framework. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/README.md:25-32] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/README.md:63-78]

## 3. Findings Registry

### Phase 1 Findings

#### Finding F-001 — Tighten Coordinator Boundaries
- Origin iteration: `iteration-001.md`
- system-spec-kit target: `.opencode/agent/orchestrate.md`
- Priority: should-have
- Description: BAD's strongest orchestration lesson is the narrow coordinator contract: select work, spawn workers, manage timers, and report status, but do not become an implementation agent. Local orchestration already forbids direct implementation, yet it could state the boundary more explicitly for future long-running automation. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:16-25] [SOURCE: .opencode/agent/orchestrate.md:36-46]
- Evidence: BAD uses coordinator-only responsibilities and pure-coordinator Phase 1; local orchestrate already enforces single-hop delegation but allows a broader read surface. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:177-205] [SOURCE: .opencode/agent/deep-research.md:28-42]

#### Finding F-002 — Add A Readiness Ledger Concept For Phased Work
- Origin iteration: `iteration-002.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/references/structure/phase_definitions.md`
- Priority: should-have
- Description: BAD cleanly separates dependency structure from completion truth: backlog files define edges, but GitHub merge state decides whether a dependency is truly satisfied. Local phase docs currently stop at documented relationships and recursive folder validation. A future readiness ledger would let phased automation reason about "planned" versus "merged" without hand-waving. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/references/phase0-dependency-graph.md:7-33] [SOURCE: .opencode/skill/system-spec-kit/references/structure/phase_definitions.md:147-233]
- Evidence: BAD repairs `sprint-status.yaml` from GitHub merge truth and computes ready-to-work from merged dependencies and epic ordering. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:103-166] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/references/phase0-dependency-graph.md:66-73]

#### Finding F-003 — Queue-Based Phase Scheduling Is Interesting But Not First
- Origin iteration: `iteration-003.md`
- system-spec-kit target: `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml`
- Priority: nice-to-have
- Description: BAD's ready-queue scheduler is more mature than local intra-phase parallel dispatch because it chooses from backlog-wide candidates subject to epic order and dependency completion. That is useful for a future sprint runner, but it is a layer above today's `spec_kit:implement` responsibilities. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:177-185] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:392-405]
- Evidence: local implement automation decides whether to split code/testing work, not which packet or child phase should run next. [SOURCE: .opencode/skill/system-spec-kit/references/structure/phase_definitions.md:186-233]

#### Finding F-004 — Stage Contracts Are The Best Direct Transfer
- Origin iteration: `iteration-005.md`
- system-spec-kit target: `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml`
- Priority: must-have
- Description: BAD's four-step pipeline is explicit enough to resume safely, attribute failures precisely, and inject coordinator-only checks between stages. Local autonomous implementation is strong on gates before and after development, but its main execution section is still coarse. The most direct upgrade is to decompose Step 6 into explicit stage contracts with named outputs and resume points. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:189-205] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:392-473]
- Evidence: BAD records state transitions (`ready-for-dev`, `review`, `done`) and runs pre-continuation checks between steps. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:231-235] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/references/pre-continuation-checks.md:1-88]

#### Finding F-005 — Model Tiering Should Land Early
- Origin iteration: `iteration-006.md`
- system-spec-kit target: `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- Priority: must-have
- Description: BAD's `MODEL_STANDARD` / `MODEL_QUALITY` split is an immediately portable optimization. Local deep-research, deep-review, and implement workflows currently default to one premium model across most autonomous work. Introducing tiered model keys would lower cost and latency without weakening quality-sensitive review/synthesis steps. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:51-64] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:66-75]
- Evidence: local deep-review and implement assets show the same single-model pattern today. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:69-78] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:167-186]

#### Finding F-006 — Add An Opt-In PR Watch And Repair Loop
- Origin iteration: `iteration-007.md`
- system-spec-kit target: `.opencode/skill/sk-git/references/finish_workflows.md`
- Priority: should-have
- Description: BAD treats PR creation as the middle of the execution loop, not the end: it watches CI, runs a local fallback when needed, fixes failures, and re-reviews until clean. That is too heavy for the default git finish workflow, but it is valuable as an explicit opt-in automation mode layered above basic PR creation. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:270-336] [SOURCE: .opencode/skill/sk-git/references/finish_workflows.md:172-227]
- Evidence: BAD even re-checks CI during auto-merge to catch rebases or delayed reruns. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/references/phase4-auto-merge.md:36-49]

#### Finding F-007 — Keep Expanding Contract-Parity Tests
- Origin iteration: `iteration-009.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts`
- Priority: should-have
- Description: BAD's config-path inconsistency shows how easy it is for setup assets, docs, and skill entrypoints to drift apart. `system-spec-kit` already has a good antidote in its deep-research parity tests. That pattern should become standard whenever the repo adds a new automation bundle with multiple docs, runtime mirrors, and setup assets. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:10-14] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/assets/module-setup.md:9-23]
- Evidence: public BAD docs claim `_bmad/bad/config.yaml`, while setup writes `_bmad/config.yaml`; local parity tests already catch canonical artifact drift for deep research. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/README.md:61-74] [SOURCE: .opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts:24-84]

### Phase 2 Findings

#### Finding F-008 — Add A Shared Automation Bootstrap/Profile Layer
- Origin iteration: `iteration-011.md`
- system-spec-kit target: `.opencode/command/spec_kit/README.txt`
- Priority: should-have
- Description: BAD's strongest UX lesson is not fewer capabilities; it is one obvious setup path. `system-spec-kit` should keep its richer command set, but add a thinner operator-facing automation profile/bootstrap surface for autonomous workflows. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/README.md:41-78] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/assets/module-setup.md:21-93] [SOURCE: .opencode/command/spec_kit/README.txt:43-111] [SOURCE: .opencode/command/memory/README.txt:38-131]
- Evidence: BAD keeps install-time configuration and runtime overrides in one mental model, while local autonomous workflows span command families, YAML assets, and a large env-var surface. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/docs/index.md:29-46] [SOURCE: .opencode/skill/system-spec-kit/references/config/environment_variables.md:164-219]

#### Finding F-009 — Make Continuation Policies Runtime-Aware
- Origin iteration: `iteration-012.md`
- system-spec-kit target: `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- Priority: should-have
- Description: BAD treats pause, resume, compaction, and rate-limit waiting as explicit loop states. `system-spec-kit` should preserve packet-local disk state but refactor long autonomous loops to use a runtime-capability continuation policy instead of relying mostly on manual resume behavior. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/references/pre-continuation-checks.md:3-88] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:128-155]
- Evidence: local deep-research already persists state well; the missing piece is an explicit capability-aware continuation branch model. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:240-277] [SOURCE: .opencode/skill/system-spec-kit/references/memory/trigger_config.md:17-22]

#### Finding F-010 — Introduce Shared Workflow-Profile Configuration
- Origin iteration: `iteration-013.md`
- system-spec-kit target: `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- Priority: must-have
- Description: BAD points to a missing middle layer in `system-spec-kit`: workflow-profile configuration. Local env vars are too low-level and per-command YAML is too duplicated. A shared harness-aware workflow profile would reduce drift without collapsing existing runtime controls. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/assets/module-setup.md:68-93] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/assets/module.yaml:5-38] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:66-89]
- Evidence: BAD keeps defaults, migration behavior, and harness branching inside one module-owned config layer, while local workflow behavior is split across YAML assets and dozens of `SPECKIT_*` flags. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/scripts/merge-config.py:230-275] [SOURCE: .opencode/skill/system-spec-kit/references/config/environment_variables.md:223-308]

#### Finding F-011 — Package New Automation As Domain Coordinators, Not More Exposed Agent Taxonomy
- Origin iteration: `iteration-016.md`
- system-spec-kit target: `.opencode/agent/orchestrate.md`
- Priority: should-have
- Description: BAD argues for a different packaging direction more than a different capability set. `system-spec-kit` should pivot toward domain-first coordinator modules for new automation instead of continuing to expose more of its generic agent topology as a primary design surface. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/README.md:9-20] [SOURCE: .opencode/agent/orchestrate.md:24-36] [SOURCE: .opencode/agent/context-prime.md:24-39]
- Evidence: the local command layer already partially hides the roster, which supports pushing further toward domain-shaped entrypoints instead of more named-role proliferation. [SOURCE: .opencode/command/spec_kit/README.txt:147-159]

#### Finding F-012 — Add Thin Alias/Preset Entry Points For Common Workflows
- Origin iteration: `iteration-018.md`
- system-spec-kit target: `.opencode/command/spec_kit/README.txt`
- Priority: should-have
- Description: BAD's minimal command surface is a useful UX benchmark. `system-spec-kit` should keep its explicit command families, but add thinner preset or alias entrypoints for common autonomous flows so operators do not need to reason from the full inventory every time. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/README.md:41-63] [SOURCE: .opencode/command/spec_kit/README.txt:43-111] [SOURCE: .opencode/command/memory/README.txt:38-131]
- Evidence: current docs are comprehensive, but they still require users to choose a command family before any workflow guidance helps them. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/docs/index.md:92-97] [SOURCE: .opencode/command/spec_kit/README.txt:43-76]

#### Finding F-013 — Slim The Live Deep-Loop Contract
- Origin iteration: `iteration-019.md`
- system-spec-kit target: `.opencode/skill/sk-deep-research/references/state_format.md`
- Priority: must-have
- Description: BAD suggests a strong simplification rule for `system-spec-kit`: keep live loop contracts small, domain-shaped, and obviously enforceable. The current deep-loop design should retain its powerful primitives but stop mixing active behavior with future/reference-only complexity in the core contract. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/README.md:13-20] [SOURCE: .opencode/skill/sk-deep-research/references/state_format.md:65-183] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:116-197]
- Evidence: local deep-research defines rich state, lineage, reducer, dashboard, and convergence structures, but the live YAML still carries experimental/reference-only notes inside the executable contract. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:328-369] [SOURCE: .opencode/skill/sk-deep-research/references/convergence.md:117-150]

#### Finding F-014 — Keep Future Sprint Automation As An Extension Layer
- Origin iteration: `iteration-020.md`
- system-spec-kit target: `.opencode/command/spec_kit/README.txt`
- Priority: should-have
- Description: BAD's biggest architecture lesson is boundary discipline. If `system-spec-kit` wants BAD-like sprint automation, it should build it as a domain extension on top of current primitives rather than pushing more specialized behavior into the core command and memory systems. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/README.md:9-20] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/.claude-plugin/marketplace.json:1-24]
- Evidence: local core surfaces already cover planning, research, review, implementation, memory, and resume; fusing sprint automation into those contracts would import another domain's assumptions into an already broad substrate. [SOURCE: .opencode/command/spec_kit/README.txt:43-76] [SOURCE: .opencode/skill/system-spec-kit/references/memory/memory_system.md:99-145]

## 4. Rejected Recommendations

### Phase 1 Rejections

#### Rejected R-001 — Do Not Make `sk-git` Autonomously Create Worktrees
- Origin iteration: `iteration-004.md`
- Rationale: BAD's per-story worktree automation assumes a sprint runner that owns the whole batch. Local git rules deliberately require the user to choose worktree versus current branch first, so inheriting BAD's autonomy here would break a core local safety contract. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:212-236] [SOURCE: .opencode/skill/sk-git/SKILL.md:202-215]

#### Rejected R-002 — Do Not Fold Sequential Batch Auto-Merge Into Default Git Finish
- Origin iteration: `iteration-008.md`
- Rationale: BAD's merge ordering only makes sense when a coordinator already owns an ordered batch of related story branches. `sk-git` is a general workflow skill, not a batch scheduler, so defaulting it to BAD's merge semantics would over-specialize the git layer. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:340-353] [SOURCE: .opencode/skill/sk-git/references/finish_workflows.md:25-39]

#### Rejected R-003 — Do Not Treat BAD's Guard Claim As Verified Enforcement
- Origin iteration: `iteration-010.md`
- Rationale: The BAD snapshot documents a strong coordinator boundary but does not expose a hook or manifest-level guard that technically enforces it. Local constitutional docs can articulate similar expectations, but they should not claim BAD proved a portable enforcement mechanism. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:16-25] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/.claude-plugin/marketplace.json:22-32]

### Phase 2 Rejections / Keep Decisions

#### Rejected R-004 — Do Not Abandon Level 1/2/3+ And Phase Overlay
- Origin iteration: `iteration-014.md`
- Rationale: BAD does not present an alternative documentation-depth lifecycle. It stays thin because BMad already owns planning and backlog structure upstream. `system-spec-kit` is the planning/governance substrate, so collapsing levels would remove one of its core responsibilities. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/README.md:25-32] [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:183-206]

#### Rejected R-005 — Do Not Replace Spec Kit Memory With BAD-Style Local State
- Origin iteration: `iteration-015.md`
- Rationale: BAD omits semantic memory because its scope is narrower, not because cross-session retrieval, governance, and indexing are unnecessary. The local split is already architecturally correct: packet-local state for live continuity, global memory for recall and governance. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/README.md:63-78] [SOURCE: .opencode/skill/system-spec-kit/references/memory/memory_system.md:99-145]

#### Rejected R-006 — Do Not Tear Down Validation Because BAD Is Lighter
- Origin iteration: `iteration-017.md`
- Rationale: BAD's small bundle still drifted on its config contract, which is evidence for focused validation rather than against it. The simplification opportunity is presentation and targeting, not deleting the validation layer that catches multi-file drift. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/README.md:63-78] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/assets/module-setup.md:10-14] [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:183-206]

## 5. Refactor / Pivot Recommendations

### REFACTOR
- `iteration-012` -> runtime-aware continuation policy for long autonomous loops.
  - Verdict: REFACTOR
  - Priority: should-have
  - Target: `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
  - Proposal: preserve packet-local recovery, but add explicit continuation branches such as `compact_now`, `pause_until`, `manual_resume`, and `continue_now`.
- `iteration-013` -> shared workflow-profile configuration.
  - Verdict: REFACTOR
  - Priority: must-have
  - Target: `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
  - Proposal: centralize model tiers, tool budgets, runtime-capability branching, and continuation defaults into one harness-aware profile layer.

### PIVOT
- `iteration-016` -> future automation should ship as domain coordinators or command packs instead of exposing more named internal agents.
  - Verdict: PIVOT
  - Priority: should-have
  - Target: `.opencode/agent/orchestrate.md`
  - Proposal: keep internal specialists, but stop treating the generic agent roster as the primary design surface for new workflows.
- `iteration-020` -> build BAD-like sprint automation as an extension layer rather than expanding core `spec_kit` and `memory` contracts.
  - Verdict: PIVOT
  - Priority: should-have
  - Target: `.opencode/command/spec_kit/README.txt`
  - Proposal: stabilize the substrate first, then let specialized automation consume it from outside core.

### SIMPLIFY
- `iteration-011` -> add a shared automation bootstrap/profile entrypoint so users have one obvious setup path for autonomous workflows.
  - Verdict: SIMPLIFY
  - Priority: should-have
  - Target: `.opencode/command/spec_kit/README.txt`
- `iteration-018` -> add preset or alias entrypoints for common intents without deleting explicit command families.
  - Verdict: SIMPLIFY
  - Priority: should-have
  - Target: `.opencode/command/spec_kit/README.txt`
- `iteration-019` -> keep the live deep-loop contract small and move reference-only complexity out of the canonical execution path.
  - Verdict: SIMPLIFY
  - Priority: must-have
  - Target: `.opencode/skill/sk-deep-research/references/state_format.md`

### KEEP
- `iteration-014` -> keep Level 1/2/3+ plus phase overlay; BAD is not a replacement planning framework.
- `iteration-015` -> keep the packet-local-state plus global-memory split; BAD's local-state-only model is not solving the same problem.
- `iteration-017` -> keep validation where it prevents multi-file drift; simplify operator presentation instead of deleting the safeguards.

## 6. Cross-Phase Implications
- Overlap with phase `003`: BAD's unverified guard/hook narrative is relevant to the hook-and-workflow packet, but phase `008` should keep ownership of the sprint-automation conclusion: the coordinator boundary is useful even when hard enforcement is missing. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/assets/module-setup.md:24-38] [SOURCE: .opencode/skill/system-spec-kit/constitutional/gate-enforcement.md:58-103]
- Overlap with phase `005`: generalized multi-agent worktree architecture belongs partly there, but phase `008` owns the specific scheduler + stage-pipeline + batch-merge story because those behaviors only make sense together. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:72-99] [SOURCE: .opencode/skill/sk-git/references/worktree_workflows.md:43-57]
- Overlap with future deep-loop work: Phase 2 sharpened that the most urgent loop change is not more features, but simplification of the active contract plus a clearer continuation model. [SOURCE: .opencode/skill/sk-deep-research/references/state_format.md:65-183] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:116-197]
- Overlap with command and UX cleanup: the biggest UX mismatch is now clearly operator entrypoint sprawl, not missing raw capability. [SOURCE: .opencode/command/spec_kit/README.txt:43-111] [SOURCE: .opencode/command/memory/README.txt:38-131]

## 7. Updated Priority Queue
1. Create a shared autonomous workflow-profile layer that owns model tiers, tool budgets, runtime branching, and continuation defaults. This unlocks multiple Phase 1 and Phase 2 findings at once. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/assets/module.yaml:5-38] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:66-89]
2. Apply that profile layer to model tiering and runtime-aware continuation in `deep-research`, then mirror the pattern to `deep-review`. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/references/pre-continuation-checks.md:3-54] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:51-64]
3. Decompose autonomous implementation into explicit stage contracts with named outputs and resumable checkpoints. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:189-205] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:392-473]
4. Slim the canonical deep-loop contract so documentation and executable assets describe only what is truly live today. [SOURCE: .opencode/skill/sk-deep-research/references/state_format.md:65-183] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:328-369]
5. Add a thin operator UX layer on top of existing commands: one shared autonomous bootstrap/profile path plus a small set of common-intent aliases or presets. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/README.md:41-63] [SOURCE: .opencode/command/spec_kit/README.txt:43-111]
6. Keep any future sprint runner out of core until it proves itself as an extension that consumes stable local primitives. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/.claude-plugin/marketplace.json:1-24] [SOURCE: .opencode/skill/system-spec-kit/references/memory/memory_system.md:99-145]

## 8. Recommended Next Step
Do not start by building a full BAD-style sprint runner. First, carve out the shared autonomous workflow-profile layer and use it to land model tiering, runtime-aware continuation, and a slimmer deep-loop contract. Those changes improve today's core workflows immediately and also create the clean substrate an extension-level sprint runner would need later. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/assets/module.yaml:5-38] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/references/pre-continuation-checks.md:3-54] [SOURCE: .opencode/skill/sk-deep-research/references/state_format.md:65-183]
