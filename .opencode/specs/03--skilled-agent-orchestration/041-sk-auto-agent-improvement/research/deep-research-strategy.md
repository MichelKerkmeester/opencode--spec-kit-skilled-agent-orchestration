# Deep Research Strategy - Session Tracking Template

Runtime template copied to `research/` during initialization. Tracks research progress across iterations.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Serve as the persistent brain for researching how `autoagent-main` performs automated agent iteration, how that maps to our `.opencode/agent` system, and whether `sk-agent-improvement-loop` is feasible.

### Usage

- Init the packet with key questions, boundaries, and known context.
- Feed each iteration's findings into reducer-owned sections through the normal deep-research workflow.
- Keep the final recommendation grounded in explicit code and command evidence rather than aspiration.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:topic -->
## 2. TOPIC
Compare `autoagent-main` automatic agent iteration with our `.opencode/agent` system and assess feasibility of a new skill named `sk-agent-improvement-loop`.

---

<!-- /ANCHOR:topic -->
<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] How does `autoagent-main` structure its automatic agent-improvement loop and editable boundary?
- [x] Which parts of that loop align with our existing `.opencode/agent`, `sk-deep-research`, and skill infrastructure?
- [x] What capabilities are missing if we want a reliable `sk-agent-improvement-loop` rather than a one-off research packet?
- [x] What should the MVP scope, boundaries, and success metric be for a new skill in this repo?

<!-- /ANCHOR:key-questions -->
<!-- ANCHOR:non-goals -->
## 4. NON-GOALS
- Re-implement `autoagent-main` inside this packet.
- Modify `.opencode/agent` or add a new skill during this research run.
- Design a benchmark dataset in full detail.

---

<!-- /ANCHOR:non-goals -->
<!-- ANCHOR:stop-conditions -->
## 5. STOP CONDITIONS
- Stop when the external loop, internal mapping, gap analysis, and MVP recommendation are all answered with direct file evidence.
- Stop immediately if the packet state becomes contradictory or reducer outputs fail repeatedly.

---

<!-- /ANCHOR:stop-conditions -->
<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- How does `autoagent-main` structure its automatic agent-improvement loop and editable boundary?
- Which parts of that loop align with our existing `.opencode/agent`, `sk-deep-research`, and skill infrastructure?
- What capabilities are missing if we want a reliable `sk-agent-improvement-loop` rather than a one-off research packet?
- What should the MVP scope, boundaries, and success metric be for a new skill in this repo?

<!-- /ANCHOR:answered-questions -->
<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Reading `README.md`, `program.md`, and both harness files together exposed the true control plane, score loop, and fixed-boundary model quickly because each file explains a different part of the experiment contract. (iteration 1)
- Reading the skill, runtime agent, skills library, and create command together made the "easy vs hard" split obvious: loop scaffolding and skill registration exist, but the target metric and mutation boundaries do not. (iteration 2)
- Reframing the problem around evaluator availability and mutable-surface discipline turned a vague "can we make this?" question into a concrete MVP boundary. (iteration 3)

<!-- /ANCHOR:what-worked -->
<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- Semantic search over the imported external folder was not useful here; the local index did not return targeted hits for this small snapshot, so direct file inspection was more reliable. (iteration 1)
- Looking for an existing "agent improvement" skill name via broad ripgrep produced a lot of unrelated historical noise, so direct architectural files were more useful than keyword sweeps. (iteration 2)
- Treating the external repo as a drop-in template stayed misleading even in synthesis, because its single harness and benchmark assumptions do not map one-to-one onto our layered command/skill/runtime system. (iteration 3)

<!-- /ANCHOR:what-failed -->
<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Assuming the harness itself is the human-authored control plane. The human-controlled directive actually lives in `program.md`, which means the loop depends on a stable "meta-program" surface rather than ad hoc prompting. [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-auto-agent-improvement/external/autoagent-main/README.md:7] [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-auto-agent-improvement/external/autoagent-main/program.md:3] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Assuming the harness itself is the human-authored control plane. The human-controlled directive actually lives in `program.md`, which means the loop depends on a stable "meta-program" surface rather than ad hoc prompting. [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-auto-agent-improvement/external/autoagent-main/README.md:7] [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-auto-agent-improvement/external/autoagent-main/program.md:3]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Assuming the harness itself is the human-authored control plane. The human-controlled directive actually lives in `program.md`, which means the loop depends on a stable "meta-program" surface rather than ad hoc prompting. [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-auto-agent-improvement/external/autoagent-main/README.md:7] [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-auto-agent-improvement/external/autoagent-main/program.md:3]

### Copying `autoagent-main` wholesale would import the wrong trust boundary. Its loop assumes a benchmark harness under test, while our repo currently organizes behavior across commands, skills, and runtime agent files rather than one isolated harness file. [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-auto-agent-improvement/external/autoagent-main/README.md:13] [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:137] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Copying `autoagent-main` wholesale would import the wrong trust boundary. Its loop assumes a benchmark harness under test, while our repo currently organizes behavior across commands, skills, and runtime agent files rather than one isolated harness file. [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-auto-agent-improvement/external/autoagent-main/README.md:13] [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:137]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Copying `autoagent-main` wholesale would import the wrong trust boundary. Its loop assumes a benchmark harness under test, while our repo currently organizes behavior across commands, skills, and runtime agent files rather than one isolated harness file. [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-auto-agent-improvement/external/autoagent-main/README.md:13] [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:137]

### Directly equating `.opencode/agent/*.md` with `autoagent-main`'s single-file harness would erase a key architectural difference: our agent layer is only one surface inside a broader command/skill/runtime ecosystem. [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:16] [SOURCE: .opencode/agent/deep-research.md:28] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Directly equating `.opencode/agent/*.md` with `autoagent-main`'s single-file harness would erase a key architectural difference: our agent layer is only one surface inside a broader command/skill/runtime ecosystem. [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:16] [SOURCE: .opencode/agent/deep-research.md:28]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Directly equating `.opencode/agent/*.md` with `autoagent-main`'s single-file harness would erase a key architectural difference: our agent layer is only one surface inside a broader command/skill/runtime ecosystem. [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:16] [SOURCE: .opencode/agent/deep-research.md:28]

### Starting with a fully autonomous overnight loop over the entire `.opencode/agent` directory is too broad for an MVP because the repository lacks a benchmark-grade evaluator and because runtime mirrors would make result attribution ambiguous. [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:16] [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-auto-agent-improvement/external/autoagent-main/program.md:35] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Starting with a fully autonomous overnight loop over the entire `.opencode/agent` directory is too broad for an MVP because the repository lacks a benchmark-grade evaluator and because runtime mirrors would make result attribution ambiguous. [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:16] [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-auto-agent-improvement/external/autoagent-main/program.md:35]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Starting with a fully autonomous overnight loop over the entire `.opencode/agent` directory is too broad for an MVP because the repository lacks a benchmark-grade evaluator and because runtime mirrors would make result attribution ambiguous. [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:16] [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-auto-agent-improvement/external/autoagent-main/program.md:35]

### Treating "add a skill folder" as the hard part of this idea is misleading. Skill discovery and creation are already solved; evaluation contract, mutable target definition, and success metrics are the real blockers. [SOURCE: .opencode/skill/README.md:46] [SOURCE: .opencode/command/create/sk-skill.md:201] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating "add a skill folder" as the hard part of this idea is misleading. Skill discovery and creation are already solved; evaluation contract, mutable target definition, and success metrics are the real blockers. [SOURCE: .opencode/skill/README.md:46] [SOURCE: .opencode/command/create/sk-skill.md:201]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating "add a skill folder" as the hard part of this idea is misleading. Skill discovery and creation are already solved; evaluation contract, mutable target definition, and success metrics are the real blockers. [SOURCE: .opencode/skill/README.md:46] [SOURCE: .opencode/command/create/sk-skill.md:201]

### Treating `autoagent-main` as a research loop equivalent to `sk-deep-research` is inaccurate; it is an experiment loop with benchmark scoring, not a general evidence-synthesis loop. [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-auto-agent-improvement/external/autoagent-main/README.md:5] [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-auto-agent-improvement/external/autoagent-main/program.md:80] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating `autoagent-main` as a research loop equivalent to `sk-deep-research` is inaccurate; it is an experiment loop with benchmark scoring, not a general evidence-synthesis loop. [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-auto-agent-improvement/external/autoagent-main/README.md:5] [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-auto-agent-improvement/external/autoagent-main/program.md:80]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `autoagent-main` as a research loop equivalent to `sk-deep-research` is inaccurate; it is an experiment loop with benchmark scoring, not a general evidence-synthesis loop. [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-auto-agent-improvement/external/autoagent-main/README.md:5] [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-auto-agent-improvement/external/autoagent-main/program.md:80]

<!-- /ANCHOR:exhausted-approaches -->
<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Assuming the harness itself is the human-authored control plane. The human-controlled directive actually lives in `program.md`, which means the loop depends on a stable "meta-program" surface rather than ad hoc prompting. [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-auto-agent-improvement/external/autoagent-main/README.md:7] [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-auto-agent-improvement/external/autoagent-main/program.md:3] (iteration 1)
- Treating `autoagent-main` as a research loop equivalent to `sk-deep-research` is inaccurate; it is an experiment loop with benchmark scoring, not a general evidence-synthesis loop. [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-auto-agent-improvement/external/autoagent-main/README.md:5] [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-auto-agent-improvement/external/autoagent-main/program.md:80] (iteration 1)
- Directly equating `.opencode/agent/*.md` with `autoagent-main`'s single-file harness would erase a key architectural difference: our agent layer is only one surface inside a broader command/skill/runtime ecosystem. [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:16] [SOURCE: .opencode/agent/deep-research.md:28] (iteration 2)
- Treating "add a skill folder" as the hard part of this idea is misleading. Skill discovery and creation are already solved; evaluation contract, mutable target definition, and success metrics are the real blockers. [SOURCE: .opencode/skill/README.md:46] [SOURCE: .opencode/command/create/sk-skill.md:201] (iteration 2)
- Copying `autoagent-main` wholesale would import the wrong trust boundary. Its loop assumes a benchmark harness under test, while our repo currently organizes behavior across commands, skills, and runtime agent files rather than one isolated harness file. [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-auto-agent-improvement/external/autoagent-main/README.md:13] [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:137] (iteration 3)
- Starting with a fully autonomous overnight loop over the entire `.opencode/agent` directory is too broad for an MVP because the repository lacks a benchmark-grade evaluator and because runtime mirrors would make result attribution ambiguous. [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:16] [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-auto-agent-improvement/external/autoagent-main/program.md:35] (iteration 3)

<!-- /ANCHOR:ruled-out-directions -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Stop the loop and synthesize: the packet now has enough evidence to answer the feasibility question and recommend an MVP design for `sk-agent-improvement-loop`.

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->
<!-- ANCHOR:known-context -->
## 12. KNOWN CONTEXT
- The repo already implements a disk-first iterative loop for deep research through `sk-deep-research`, a YAML workflow, and a LEAF `@deep-research` agent.
- Memory lookup suggests prior packet work exists around improving `sk-deep-research` and researching external auto-research patterns, but this packet should verify conclusions from first principles before adopting them.

---

<!-- /ANCHOR:known-context -->
<!-- ANCHOR:research-boundaries -->
## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart`, `fork`, `completed-continue`
- Machine-owned sections: reducer controls Sections 7-11
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.opencode/skill/sk-deep-research/assets/runtime_capabilities.json`
- Capability matrix doc: `.opencode/skill/sk-deep-research/references/capability_matrix.md`
- Capability resolver: `.opencode/skill/sk-deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 1
- Started: 2026-04-03T12:06:08Z
<!-- /ANCHOR:research-boundaries -->
