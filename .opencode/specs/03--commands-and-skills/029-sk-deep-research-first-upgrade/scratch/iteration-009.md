# Iteration 009 — Minimal Loop Counterpoint (Ralph)

## Focus
Q9: Does Ralph's minimal fresh-agent loop validate or challenge our complex state machine? Are we over-engineering?

## Key Delta Findings

### Finding 1: Ralph is minimal at the controller layer, not state-free overall
- The shell driver is tiny: parse args, archive old branch artifacts, initialize `progress.txt`, spawn a fresh agent, and stop only on `<promise>COMPLETE</promise>` or max iterations. [SOURCE: /tmp/deep-research-029-wave2/ralph/ralph.sh:7] [SOURCE: /tmp/deep-research-029-wave2/ralph/ralph.sh:42] [SOURCE: /tmp/deep-research-029-wave2/ralph/ralph.sh:84]
- But the working system still depends on a real external state bundle: `prd.json` as backlog, `progress.txt` as append-only memory, git history as durable execution record, branch archives for session reset, and AGENTS/CLAUDE instructions as persistent guidance. [SOURCE: /tmp/deep-research-029-wave2/ralph/README.md:5] [SOURCE: /tmp/deep-research-029-wave2/ralph/README.md:122] [SOURCE: /tmp/deep-research-029-wave2/ralph/prompt.md:7] [SOURCE: /tmp/deep-research-029-wave2/ralph/prompt.md:20] [SOURCE: /tmp/deep-research-029-wave2/ralph/README.md:185]
- Delta vs Wave 1: this challenges any assumption that "simple loop" means "no state." Ralph still externalizes state aggressively; it just uses human-legible artifacts instead of a typed orchestrator-owned state machine.

### Finding 2: Ralph works because it constrains the unit of work harder than we currently do
- Ralph's skill makes story size the primary control knob: every story must fit in one iteration, dependencies must be ordered, and acceptance criteria must be directly checkable. [SOURCE: /tmp/deep-research-029-wave2/ralph/skills/ralph/SKILL.md:46] [SOURCE: /tmp/deep-research-029-wave2/ralph/skills/ralph/SKILL.md:67] [SOURCE: /tmp/deep-research-029-wave2/ralph/skills/ralph/SKILL.md:83]
- The README reinforces that the loop only behaves well when stories are small and when feedback loops like typecheck, tests, CI, and browser verification exist. [SOURCE: /tmp/deep-research-029-wave2/ralph/README.md:170] [SOURCE: /tmp/deep-research-029-wave2/ralph/README.md:194] [SOURCE: /tmp/deep-research-029-wave2/ralph/README.md:201]
- Delta vs Wave 1: Ralph suggests some of our orchestration complexity may be compensating for under-specified work units. Better bounded questions/stories can substitute for some control-plane logic.

### Finding 3: The "essential loop" is surprisingly small and already overlaps with our real core
- Ralph's flowchart reduces the whole system to: write PRD, convert to structured backlog, run loop, pick next item, implement, commit, mark done, log learnings, ask "more stories?", repeat. [SOURCE: /tmp/deep-research-029-wave2/ralph/flowchart/src/App.tsx:37] [SOURCE: /tmp/deep-research-029-wave2/ralph/flowchart/src/App.tsx:141] [SOURCE: /tmp/deep-research-029-wave2/ralph/flowchart/src/App.tsx:228]
- Our own skill already names the same irreducible primitives for research: fresh context each iteration, externalized state on disk, one focus per iteration, append-only logging, and loop evaluation. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-deep-research/SKILL.md:169] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-deep-research/SKILL.md:220] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-deep-research/references/loop_protocol.md:79] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-deep-research/references/loop_protocol.md:143]
- Delta vs Wave 1: Ralph validates our freshest-context architectural premise more than it attacks it. The challenge is not the loop concept; it is how much machinery we put around that loop by default.

### Finding 4: Ralph's simplicity is explicitly packaged to spread, which is evidence for the appeal of low-ceremony orchestration
- The repo is not just a script dump. It ships installable skills, a Claude marketplace manifest, and a GitHub Pages-deployed explainer flowchart. [SOURCE: /tmp/deep-research-029-wave2/ralph/.claude-plugin/plugin.json:2] [SOURCE: /tmp/deep-research-029-wave2/ralph/.claude-plugin/marketplace.json:2] [SOURCE: /tmp/deep-research-029-wave2/ralph/.github/workflows/deploy.yml:1]
- Inference: that packaging does not prove broad community adoption, but it does show the project's main product value is teachable simplicity. The pattern is meant to be copied, installed, and understood quickly, not studied as a complex orchestration framework.

### Finding 5: What breaks when you take Ralph's minimalism into deep research is exactly the area our state machine covers
- Ralph has no structured convergence model beyond "task list empty" or "max iterations reached," no machine-readable per-iteration novelty accounting, no explicit stuck-recovery path beyond trying again, and no canonical synthesis artifact. [SOURCE: /tmp/deep-research-029-wave2/ralph/ralph.sh:84] [SOURCE: /tmp/deep-research-029-wave2/ralph/README.md:205] [SOURCE: /tmp/deep-research-029-wave2/ralph/prompt.md:94]
- Our research loop adds those missing pieces because research lacks Ralph's strong external verifier. We need explicit initialization, state agreement, convergence signals, structured iteration records, and final synthesis precisely because "done" is subjective. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-deep-research/references/loop_protocol.md:42] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-deep-research/references/convergence.md:25] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-deep-research/references/state_format.md:15]
- Delta vs Wave 1: Ralph strengthens the earlier caveat that code-task loops and knowledge-research loops are different domains. Minimalism transfers best to controller design, not to evidence/stop logic.

### Finding 6: Ralph challenges our optional complexity, not our necessary complexity
- Wave 1 already concluded that our biggest gains come from layering on top of the core loop, not replacing it, and it demoted live branches/segments in favor of lighter track labels and dashboards. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/03--commands-and-skills/029-sk-deep-research-first-upgrade/research.md:12] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/03--commands-and-skills/029-sk-deep-research-first-upgrade/research.md:21] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/03--commands-and-skills/029-sk-deep-research-first-upgrade/research.md:147] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/03--commands-and-skills/029-sk-deep-research-first-upgrade/research.md:152]
- Ralph adds confidence to that demotion. Features we already mark as reference-only or optional, such as waves, live segments, checkpoint commits, and heavier orchestration layers, should stay non-core until proven necessary. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-deep-research/SKILL.md:240] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-deep-research/references/loop_protocol.md:151] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-deep-research/references/state_format.md:213]
- Best interpretation: keep the rich research state model, but simplify the default runtime story to the essential loop plus a small set of high-value artifacts.

## Bottom Line
Ralph does not show that our deep-research state model is unnecessary. It shows that the controller can be much simpler when the unit of work is tightly bounded and the environment supplies objective pass/fail signals.

So the right takeaway is mixed:
- **Validate**: fresh-context iteration, externalized file state, append-only learnings, and one-focus-at-a-time are real essentials, not over-engineering.
- **Challenge**: waves, branches, checkpointing, and other advanced state-machine ideas should remain optional overlays, not the default mental model.
- **Keep**: explicit convergence, structured iteration logs, and synthesis for research-specific workflows, because Ralph's minimal loop has no answer for subjective "done."

## Sources Consulted
- `/tmp/deep-research-029-wave2/ralph/README.md`
- `/tmp/deep-research-029-wave2/ralph/ralph.sh`
- `/tmp/deep-research-029-wave2/ralph/prompt.md`
- `/tmp/deep-research-029-wave2/ralph/CLAUDE.md`
- `/tmp/deep-research-029-wave2/ralph/skills/ralph/SKILL.md`
- `/tmp/deep-research-029-wave2/ralph/skills/prd/SKILL.md`
- `/tmp/deep-research-029-wave2/ralph/.claude-plugin/plugin.json`
- `/tmp/deep-research-029-wave2/ralph/.claude-plugin/marketplace.json`
- `/tmp/deep-research-029-wave2/ralph/.github/workflows/deploy.yml`
- `/tmp/deep-research-029-wave2/ralph/flowchart/src/App.tsx`
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-deep-research/SKILL.md`
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-deep-research/references/loop_protocol.md`
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-deep-research/references/convergence.md`
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-deep-research/references/state_format.md`
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/03--commands-and-skills/029-sk-deep-research-first-upgrade/research.md`

## Assessment
- newInfoRatio: 0.77
- findingsCount: 6
- status: complete
- keyInsights: Ralph validates fresh-context file-based looping, but mostly by pushing structure into PRD discipline and feedback loops; for research, that argues for a simpler default controller, not for removing convergence, synthesis, or typed iteration state.

## Questions Answered
- Q9: Ralph challenges us only if we treat every orchestration feature as core. Its minimal bash loop is enough for bounded coding tasks with objective verifiers, but deep research still needs explicit convergence, synthesis, and structured state. The right move is to trim optional orchestration layers, not to discard the research-state model.

## New Questions Raised
- Should sk-deep-research have a "minimal mode" whose required artifacts are just config, a compact dashboard/next-focus summary, iteration files, and JSONL?
- Can `deep-research-strategy.md` be reduced to a thinner state-summary artifact in the default path, with richer planning sections enabled only for hard topics?
- Which current reference-only ideas should remain documentation only unless real user demand proves they belong in the live workflow?
