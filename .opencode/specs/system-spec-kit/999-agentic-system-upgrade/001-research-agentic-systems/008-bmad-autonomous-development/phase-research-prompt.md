# $refine TIDD-EC Prompt: 008-bmad-autonomous-development

## 2. Role

Act as a research specialist in coordinator-subagent architectures, sprint automation, dependency graph resolution, worktree-based parallel delivery, quality-tiered model selection, and skill-based agentic orchestration.

Operate as a phase-local analyst for `Code_Environment/Public`, with strong attention to evidence, execution boundaries, adoption cost, and orchestration safety.

## 3. Task

Research BAD (BMad Autonomous Development) to identify concrete improvements for `Code_Environment/Public`, especially around:

- coordinator-subagent delegation boundaries
- dependency-aware sprint scheduling
- parallel story execution through per-story worktrees
- quality-tiered model selection across pipeline steps
- CI / PR / merge automation loops
- continuation logic, timers, and rate-limit pauses

The goal is not to import BAD wholesale. The goal is to extract the most useful orchestration patterns, decide what this repo should adopt now, prototype later, or reject, and keep the analysis tightly focused on sprint automation and coordinator design.

## 4. Context

### 4.1 System Description

Treat BAD as a lightweight sprint orchestrator for the broader BMad Method with these relevant traits:

- The coordinator delegates every operational step to subagents and is intentionally kept lean.
- Dependency readiness is derived from sprint backlog data plus GitHub PR status reconciliation.
- Story execution happens in parallel batches, capped by `MAX_PARALLEL_STORIES` (default `3`).
- Each story runs through a strict four-step pipeline:
  1. create story spec
  2. implement code
  3. higher-quality code review
  4. commit / push / PR / CI monitoring / failure repair / merge-conflict handling
- Each story gets its own isolated git worktree.
- Optional auto-merge runs sequentially by lowest story number first.
- Model selection is tiered by step (`MODEL_STANDARD` vs `MODEL_QUALITY`).
- BAD includes timer-based continuation, context-compaction thresholds, and usage-limit pause logic.
- BAD depends on BMad Method planning artifacts, especially `sprint-status.yaml`.
- BAD is packaged as a skill-style Claude module in markdown, not a traditional application service.

Important evidence anchors in the external repo: `README.md`, `docs/index.md`, `skills/bad/SKILL.md`, `skills/bad/references/phase0-dependency-graph.md`, `skills/bad/references/pre-continuation-checks.md`, `skills/bad/references/phase4-auto-merge.md`, `skills/bad/assets/module-setup.md`, `skills/bad/assets/module.yaml`, and `.claude-plugin/marketplace.json`.

Important caution:

- BAD docs appear to have a config-path inconsistency: `README.md`, `docs/index.md`, and `skills/bad/SKILL.md` refer to `_bmad/bad/config.yaml`, while `skills/bad/assets/module-setup.md` writes shared config into `_bmad/config.yaml`. Do not guess which is correct; verify and document the discrepancy.

### 4.2 Cross-Phase Awareness Table

Use the full 9-phase packet map below to avoid duplicate analysis and to tag overlap intentionally.

| Phase | External target | This phase's relationship to it |
| --- | --- | --- |
| 001 | `001-agent-lightning-main` | Separate sibling packet. Only mention if BAD's batch orchestration or coordinator loops resemble RL-style optimization or multi-agent control surfaces. |
| 002 | `002-babysitter-main` | Separate sibling packet. Only mention if BAD's continuation, pause, or supervision patterns overlap event-driven orchestration or operator oversight. |
| 003 | `003-claude-code-mastery-project-starter-kit-main` | Explicit overlap packet for hook and workflow-rule conventions. In phase 008, note any BAD enforcement or harness patterns that resemble MDD / Claude hook workflows, but do not redo phase 003's CLAUDE.md deep dive. |
| 004 | `004-get-it-right-main` | Separate sibling packet. Only mention if BAD's review / fix / retry loop materially overlaps structured verification or correction workflows. |
| 005 | `005-intellegix-code-agent-toolkit-master` | Explicit overlap packet for agent coordination and worktree strategy. In phase 008, capture sprint-level orchestration and dependency scheduling, but route broader multi-agent council or general worktree-architecture conclusions to phase 005. |
| 006 | `006-ralph-main` | Separate sibling packet. Only mention if BAD's fresh-context subagent pattern or git-centric coordination clearly overlaps Ralph's execution model. |
| 007 | `007-relay-main` | Separate sibling packet. Only mention if BAD's notifications, timers, or continuation triggers resemble messaging / relay infrastructure. |
| 008 | `008-bmad-autonomous-development` | Primary focus. Own coordinator-subagent architecture, dependency graph scheduling, worktree batch execution, model tiering, PR automation, auto-merge, and sprint-status-driven loop control. |
| 009 | `009-xethryon` | Separate sibling packet. Only mention if BAD's pause / resume / context-boundary mechanics materially overlap memory-heavy autonomous systems. |

Cross-phase rule: do not do another packet's deep dive; tag overlap with `003` for hook / rule / Claude workflow conventions, tag overlap with `005` for generalized multi-agent / worktree architecture, and preserve phase `008` ownership over sprint automation.

### 4.3 What This Repo Already Has

Assume `Code_Environment/Public` already has meaningful orchestration infrastructure, but not BAD's sprint-level automation layer:

- `.opencode/agent/orchestrate.md` enforces single-hop NDP and makes the top-level orchestrator the only dispatcher.
- `.opencode/agent/speckit.md` owns spec-folder markdown workflows and template-governed documentation.
- `.opencode/skill/sk-git/SKILL.md` already covers git worktrees, commit hygiene, PR flow, and cleanup.
- `CLAUDE.md` and related repo rules already enforce gates, documentation discipline, and operational safety.
- Spec Kit Memory, code graph tools, CocoIndex, and deep-research workflows already cover context retrieval and research execution.

What this repo does **not** appear to have today:

- a sprint-level dependency graph tied to backlog artifacts and PR state
- coordinator-managed parallel story batches with ready-story selection
- a story-level create -> dev -> review -> PR loop plus sequential auto-merge

This means the research should compare equivalent surfaces:

- BAD coordinator vs local orchestrator
- BAD worktree batch flow vs `sk-git`
- BAD story-spec creation vs local spec / agent workflows
- BAD continuation logic vs local pause / resume / handover patterns

## 5. Instructions

Follow these steps in order and keep the analysis evidence-first.

1. Treat `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development` as the pre-approved phase folder. Skip Gate 3, do not create a sibling packet, and keep every write inside this phase folder only.
2. Treat `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/bmad-autonomous-development-main` as read-only.
3. Start with `external/bmad-autonomous-development-main/skills/bad/SKILL.md`. Extract the coordinator contract, coordinator-only responsibilities, phase layout, model roles, and rule set before reading anything else.
4. Read the phase-specific BAD references next, in this order:
   - `skills/bad/references/phase0-dependency-graph.md`
   - `skills/bad/references/pre-continuation-checks.md`
   - `skills/bad/references/phase4-auto-merge.md`
5. Read `skills/bad/assets/module-setup.md` and `skills/bad/assets/module.yaml` to understand configuration keys, harness detection, setup-time file writes, and runtime overrides.
6. Then inspect BAD's config surface. Start from `_bmad/bad/config.yaml` as claimed by `README.md`, `docs/index.md`, and `skills/bad/SKILL.md`. If the repo only provides setup-time evidence for `_bmad/config.yaml`, document the inconsistency explicitly instead of resolving it by assumption.
7. Read `README.md`, `docs/index.md`, and `.claude-plugin/marketplace.json` to confirm packaging, activation language, user-facing claims, and harness-level positioning.
8. Trace the full BAD execution pipeline end-to-end:
   - dependency graph build
   - GitHub PR status reconciliation
   - ready-story selection
   - worktree creation / reuse
   - Step 1 create
   - Step 2 dev
   - Step 3 quality review
   - Step 4 PR / CI / comment / fix loop
   - optional sequential auto-merge
   - batch wait / retro / continue
9. Identify which actions are coordinator-owned and which are subagent-owned. Be explicit about BAD's "coordinator never touches source code directly" principle and how hard that boundary really is in the source material.
10. Inspect how `sprint-status.yaml`, dependency-graph output, GitHub PR state, and epic ordering interact. Clarify which source of truth wins when state diverges.
11. Compare BAD's worktree lifecycle, branch safety, PR flow, and cleanup behavior against `.opencode/skill/sk-git/SKILL.md`. Focus on what BAD adds beyond a generic git workflow skill.
12. Compare BAD's coordinator model against `.opencode/agent/orchestrate.md`, especially around single-hop dispatch, leaf-agent boundaries, and whether BAD's coordinator is stricter or looser than local NDP.
13. Verify the orchestrator-guard / `PreToolUse` hook claim carefully. If you find an actual guard, hook, or manifest-level enforcement mechanism that prevents the coordinator from reading non-process files, cite it exactly. If you do **not** find it in this repo snapshot, classify it as an unverified claim and say what evidence would be needed.
14. For every meaningful finding, include exact source paths, a crisp comparison to the matching local surface, and one recommendation label: `adopt now`, `prototype later`, or `reject`.
15. Keep the research focused on automation patterns, not sprint content. Story text, example epics, or installation trivia matter only when they reveal orchestration design, safety boundaries, or adoption risk.

## 6. Research Questions

Answer these questions directly in the research output.

1. How strict is BAD's coordinator-subagent separation in practice, and what exact rules keep the coordinator from becoming an implementation agent?
2. How does BAD build and maintain the dependency graph, and how much of readiness is driven by backlog structure versus live GitHub PR state?
3. What scheduling rules govern parallel story execution, especially epic ordering, dependency readiness, and `MAX_PARALLEL_STORIES` batching?
4. How do BAD's per-story worktrees differ from this repo's existing `sk-git` worktree model?
5. What does the four-step story pipeline actually do at each stage, and where are the sharpest quality / safety gates?
6. How does BAD use `MODEL_STANDARD` versus `MODEL_QUALITY`, and what lessons apply to quality-tiered model selection in `Code_Environment/Public`?
7. How does BAD manage CI monitoring, failure repair, PR comment resolution, and merge-conflict recovery before merge?
8. What exactly does BAD's auto-merge phase do, and why is sequential merge-by-story-number important?
9. How does `sprint-status.yaml` drive execution, and what happens when it disagrees with GitHub state or local git state?
10. Is there a real orchestrator guard / `PreToolUse` hook implementation in the repo, or only a documented principle? What would be required to bring the same enforcement into this repo?
11. Compared with `.opencode/agent/orchestrate.md`, what does BAD add for sprint-level automation that this repo currently lacks?
12. Which findings clearly belong to phase `003` or `005`, and how should they be tagged without diluting phase `008` ownership?

## 7. Do's

- Do study the coordinator's "never touch source code directly" principle in detail.
- Do read the BAD skill before the README so the research starts from execution rules, not marketing copy.
- Do inspect the four-step pipeline step by step, not just the high-level diagram.
- Do examine how the dependency graph schema determines readiness and blockers.
- Do compare create / dev / review / PR subagent instructions side by side.
- Do inspect continuation logic, timer behavior, and rate-limit pauses as part of the orchestration story.
- Do verify whether the claimed orchestrator guard / `PreToolUse` hook is implemented, inferred, or missing from this repo snapshot.
- Do compare BAD against `.opencode/agent/orchestrate.md`, `.opencode/agent/speckit.md`, and `.opencode/skill/sk-git/SKILL.md`.
- Do tag overlap with phase `003` for hook / Claude workflow lessons.
- Do tag overlap with phase `005` for generalized multi-agent / worktree architecture lessons.

## 8. Don'ts

- Don't confuse BAD with the full BMad Method. BAD automates sprint execution; BMad is the broader methodology and planning system.
- Don't spend time analyzing specific story content unless it reveals automation behavior, dependency modeling, or safety boundaries.
- Don't assume `_bmad/bad/config.yaml` versus `_bmad/config.yaml` is settled; verify and record the discrepancy.
- Don't assume a `PreToolUse` guard hook exists just because BAD's narrative says the coordinator never reads files.
- Don't recommend running BAD in this repo without the required BMad Method installation and `sprint-status.yaml`.
- Don't reduce the analysis to feature counting. Coordinator boundaries, adoption cost, and failure modes matter more.
- Don't blur phase ownership. MDD / Claude hook conclusions belong partly to `003`; generalized multi-agent worktree architecture belongs partly to `005`.
- Don't dispatch sub-agents. This is a depth-1 leaf task and must be executed directly.

## 9. Examples

Use findings in this style.

### Example A - coordinator-subagent boundary

- **Evidence:** `skills/bad/SKILL.md`, `README.md`, `docs/index.md`
- **What it does:** BAD keeps the coordinator focused on selection, spawning, timers, and summaries while delegating file reads, git, gh, and disk writes to fresh-context subagents.
- **Why it matters here:** `Code_Environment/Public` already has a top-level orchestrator with single-hop NDP, but it does not yet have a sprint-specific coordinator that refuses implementation work this aggressively.
- **Recommendation:** `prototype later`
- **Affected area:** `.opencode/agent/orchestrate.md`, future sprint-automation skill or command layer
- **Risk / cost:** Medium. Strong boundary discipline is attractive, but it adds orchestration overhead and requires reliable subagent contracts.

### Example B - unverified `PreToolUse` guard claim

- **Evidence:** `README.md`, `skills/bad/SKILL.md`, plus explicit note that no concrete `PreToolUse` guard / hook file was found in the BAD repo snapshot
- **What it does:** BAD documents a strict coordinator-only pattern, but the repo snapshot may not contain a literal `PreToolUse` enforcement hook proving that the rule is technically blocked.
- **Why it matters here:** This repo should not copy a claimed safety mechanism unless the implementation path is real and portable.
- **Recommendation:** `prototype later` only after implementation evidence exists
- **Affected area:** hook strategy, orchestrator policy, possible Claude / Copilot enforcement surfaces
- **Risk / cost:** Medium to high if the team mistakes prose discipline for real guardrails.

## 10. Constraints

- Work only inside the approved phase folder for writable outputs.
- Treat the external BAD repo as read-only.
- Use exact file-path evidence for every substantive claim.
- Keep all packet paths under `999-agentic-system-upgrade` only.
- Maintain visible TIDD-EC completeness: Task, Instructions, Do's, Don'ts, Examples, and Context must remain explicit.
- Maintain visible RICCE completeness: Role, Instructions, Context, Constraints, and Examples must be explicit and usable.
- Prefer equivalent comparisons: coordinator to coordinator, worktree workflow to worktree workflow, review loop to review loop, config surface to config surface.
- Treat unverified claims as unverified. Do not upgrade narrative claims into facts.
- Execute directly as a LEAF agent at depth `1`; do not delegate or spawn sub-agents.

## 11. Deliverables

Produce research outputs that include all of the following:

1. A concise summary of BAD's coordinator-subagent operating model.
2. A pipeline trace covering dependency graph -> selection -> worktree -> create -> dev -> review -> PR / CI -> auto-merge -> continue.
3. A comparison section against `.opencode/agent/orchestrate.md`.
4. A comparison section against `.opencode/skill/sk-git/SKILL.md`.
5. A config section covering `_bmad/bad/config.yaml` versus `_bmad/config.yaml` evidence and any path discrepancy.
6. A scheduler section covering epic ordering, dependency readiness, and `MAX_PARALLEL_STORIES`.
7. A model-tiering section covering `MODEL_STANDARD` and `MODEL_QUALITY`.
8. A recommendation matrix with `adopt now`, `prototype later`, and `reject`, plus an overlap log for phase `003` and phase `005`.

## 12. Evaluation

Evaluate the finished research against this rubric before treating it as complete.

| Dimension | Target |
| --- | --- |
| TIDD-EC completeness | All required sections are materially addressed, not implied |
| RICCE completeness | Role, Instructions, Context, Constraints, and Examples are explicit and usable |
| Evidence quality | Exact file paths, concrete behaviors, no vague claims |
| Comparison depth | BAD behavior is compared to a real local equivalent |
| Domain focus | Research stays on coordinator-subagent and sprint-automation patterns |
| Overlap discipline | `003` and `005` overlap is tagged without losing `008` ownership |
| Actionability | Recommendations are specific enough to guide later planning work |
| Guard precision | Claimed enforcement is distinguished from verified enforcement |
| CLEAR score | Target `>= 40/50` |

Use this CLEAR self-check:

- **Correctness:** Are all claims grounded in the cited BAD and local files?
- **Logic:** Does each recommendation follow from the comparison?
- **Expression:** Is the write-up precise, concrete, and easy to scan?
- **Arrangement:** Is the research ordered around decisions rather than note dumping?
- **Reusability:** Can later packets reuse the findings without re-reading BAD from scratch?

## 13. Completion Bar

The task is complete only when all of the following are true:

- the research reads the BAD skill, BAD references, BAD setup assets, and BAD packaging docs in the required order
- the four-step story pipeline is traced with exact file-path evidence
- dependency-graph and `sprint-status.yaml` behavior are explained clearly
- the config-path discrepancy is documented instead of guessed away
- BAD is compared directly to `.opencode/agent/orchestrate.md` and `.opencode/skill/sk-git/SKILL.md`
- overlap with phase `003` and phase `005` is tagged explicitly where needed
- every major recommendation is labeled `adopt now`, `prototype later`, or `reject`
- all packet references use the approved `999-agentic-system-upgrade` root only
