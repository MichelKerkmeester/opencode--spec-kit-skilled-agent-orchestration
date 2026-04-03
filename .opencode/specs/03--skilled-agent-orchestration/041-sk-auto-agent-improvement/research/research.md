# Research Report: 041 SK Auto Agent Improvement

## 1. Executive Summary
`autoagent-main` is a benchmark-driven meta-agent loop for improving an agent harness, not a general research workflow. The human controls the loop through `program.md`, the meta-agent mutates the editable portion of `agent.py`, Harbor task results provide the score, and the loop keeps or discards changes using explicit rules. [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-auto-agent-improvement/external/autoagent-main/README.md:5] [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-auto-agent-improvement/external/autoagent-main/program.md:35] [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-auto-agent-improvement/external/autoagent-main/program.md:156]

This repo already has several reusable ingredients for a similar idea: disk-first loop state, fresh-context iterations, reducer-managed synthesis, auto-discovered skills, and a canonical command for creating new `sk-*` skills. [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:137] [SOURCE: .opencode/agent/deep-research.md:24] [SOURCE: .opencode/skill/README.md:42] [SOURCE: .opencode/command/create/sk-skill.md:9]

The missing piece is not skill registration. The missing piece is a trustworthy evaluator and a tightly bounded mutable target. Because of that, a new `sk-agent-improvement-loop` is feasible, but only if its first version is framed as an experiment loop with explicit scoring and scope controls, not as freeform autonomous rewriting of the whole `.opencode/agent` tree. [SOURCE: .opencode/skill/README.md:46] [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-auto-agent-improvement/external/autoagent-main/program.md:160] [INFERENCE: without a measurable evaluator, automatic mutations would have no principled keep/discard rule.]

## 2. What `autoagent-main` Actually Does
The external repo uses a narrow control model:

- `program.md` is the human-edited directive that tells the meta-agent what kind of harness to build and how to operate the loop. [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-auto-agent-improvement/external/autoagent-main/README.md:7] [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-auto-agent-improvement/external/autoagent-main/program.md:3]
- The editable surface is intentionally limited to the pre-boundary portion of `agent.py`: prompt, config, tool creation, agent construction, and orchestration. The adapter boundary is fixed. [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-auto-agent-improvement/external/autoagent-main/README.md:13] [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-auto-agent-improvement/external/autoagent-main/program.md:40] [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-auto-agent-improvement/external/autoagent-main/agent.py:24]
- The decision rule is score-driven and ledgered. The loop runs Harbor tasks, logs each experiment in `results.tsv`, and keeps changes only when passed-task count improves or when equal performance becomes simpler. [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-auto-agent-improvement/external/autoagent-main/README.md:26] [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-auto-agent-improvement/external/autoagent-main/program.md:120] [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-auto-agent-improvement/external/autoagent-main/program.md:156]

That combination matters. The repo works because it has a directive surface, an editable target, and an evaluator that turns changes into keep/discard decisions.

## 3. What We Already Have Internally
The internal system is different, but some of the mechanics are already present:

- `sk-deep-research` already implements a three-layer loop: command entrypoint, YAML workflow, and a LEAF runtime agent with disk-first state and final synthesis. [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:137] [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:179]
- `.opencode/agent/*.md` defines runtime execution roles, not benchmark harnesses. `@deep-research` is explicitly a single-iteration LEAF agent that writes research artifacts under workflow control. [SOURCE: .opencode/agent/deep-research.md:24] [SOURCE: .opencode/agent/deep-research.md:28] [SOURCE: .opencode/agent/deep-research.md:50]
- Skill packaging is already standardized. The skills library says a new skill becomes discoverable via a valid `SKILL.md`, and `/create:sk-skill` is the canonical workflow for full skill creation/update. [SOURCE: .opencode/skill/README.md:46] [SOURCE: .opencode/skill/README.md:68] [SOURCE: .opencode/command/create/sk-skill.md:9] [SOURCE: .opencode/command/create/sk-skill.md:120]

So the repo can already host a new improvement-loop skill. What it does not yet host is an evaluation contract equivalent to Harbor tasks plus keep/discard rules for agent definitions.

## 4. Why a Direct Copy Would Fail
Several tempting interpretations were ruled out during the loop:

- `autoagent-main` is not the same kind of loop as `sk-deep-research`; it is experiment scoring, not evidence convergence. [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-auto-agent-improvement/external/autoagent-main/README.md:5] [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-auto-agent-improvement/external/autoagent-main/program.md:80]
- `.opencode/agent/*.md` is not equivalent to the external repo's single-file harness. Our agent layer is only one surface in a larger command/skill/runtime system. [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:16] [SOURCE: .opencode/agent/deep-research.md:28]
- Adding a skill folder is not the hard part. Registration and scaffolding already exist; evaluation and target definition do not. [SOURCE: .opencode/skill/README.md:46] [SOURCE: .opencode/command/create/sk-skill.md:201]
- Starting with a fully autonomous overnight loop over all `.opencode/agent` files is too broad for an MVP because runtime mirrors and missing evaluators would make results hard to trust. [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:16] [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-auto-agent-improvement/external/autoagent-main/program.md:35]

## 5. Feasibility Verdict
Yes, we can make a skill called `sk-agent-improvement-loop`.

The strongest version of that claim is:

1. The repo already supports skill creation, routing, and disk-first loop state.
2. The repo does not yet support automatic agent improvement as a benchmarked experiment loop.
3. Therefore the skill is feasible if we define the evaluator and mutable surface first.

In other words, the name and packaging are easy; the contract is the real work.

## 6. Recommended MVP
The first version should be narrow and evaluator-first.

### 6.1 Mutable Surface
Target one explicit runtime surface first, for example a single file such as `.opencode/agent/<name>.md`, or one bounded group of agent files that all belong to the same runtime. Do not start with all runtime mirrors at once. [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:16] [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-auto-agent-improvement/external/autoagent-main/README.md:13]

### 6.2 Control Plane
Use a human-authored directive file similar to `program.md` that states:

- the improvement goal
- the mutable files
- the fixed files
- the evaluator commands
- the keep/discard rule

This keeps the loop steerable without hiding policy in ad hoc prompts. [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-auto-agent-improvement/external/autoagent-main/README.md:7] [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-auto-agent-improvement/external/autoagent-main/program.md:141]

### 6.3 Evaluator
Define an explicit evaluator before allowing auto-mutation. Good candidates in this repo would be:

- agent contract validation
- scenario playbooks or golden transcripts
- bounded regression scripts
- style/permission/frontmatter checks

The exact evaluator is still open, but the loop must produce a numeric or clearly ordered outcome that can drive keep/discard decisions. [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-auto-agent-improvement/external/autoagent-main/program.md:122] [INFERENCE: an unordered prose review is not enough to automate mutation decisions.]

### 6.4 State and Ledger
Reuse the disk-first discipline we already trust:

- config/state/strategy files
- iteration artifacts
- experiment ledger
- synthesis summary

That lets the skill inherit the best part of `sk-deep-research`: resumable, auditable state instead of opaque prompt history. [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:181] [SOURCE: .opencode/agent/deep-research.md:167]

### 6.5 Phased Rollout
Recommended sequence:

1. Phase 1: evaluator-only loop that proposes changes and scores them without editing target files
2. Phase 2: bounded auto-edit loop for one runtime surface
3. Phase 3: parity-aware expansion across mirrors once sync rules are explicit

## 7. Suggested Skill Shape
If implemented, `sk-agent-improvement-loop` should probably look more like a sibling of `sk-deep-research` than a clone of `autoagent-main`.

Suggested ingredients:

- `SKILL.md` describing the experiment loop
- `assets/` for config and directive templates
- `references/` for evaluator design, mutable-boundary rules, and keep/discard heuristics
- `scripts/` for scoring, ledger updates, and reducer-like state refreshes

The key difference from `sk-deep-research` would be the stop condition: not convergence of information, but improvement or simplification under a defined evaluator. [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:217] [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-auto-agent-improvement/external/autoagent-main/program.md:89]

## 8. Convergence Report
- Stop reason: all questions answered
- Total iterations: 3
- Questions answered: 4 / 4
- Remaining questions: 0
- Iteration summary:
  - Iteration 1: mapped the external loop, editable boundary, and score-driven keep/discard contract
  - Iteration 2: mapped internal loop, agent, and skill infrastructure
  - Iteration 3: turned the comparison into an MVP recommendation

## 9. Bottom Line
`sk-agent-improvement-loop` is worth pursuing, but only as an evaluator-first experiment skill with a narrow target.

The right next move is not "start mutating all agents overnight." The right next move is "define one target, one directive file, one evaluator, and one keep/discard contract, then build the loop around that."
