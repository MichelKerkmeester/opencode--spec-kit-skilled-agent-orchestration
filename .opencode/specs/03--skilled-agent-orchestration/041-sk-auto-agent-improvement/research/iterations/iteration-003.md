# Iteration 3: Feasibility and MVP Boundaries for `sk-agent-improvement-loop`

## Focus
Turn the external/internal comparison into an implementation recommendation: can this repo support `sk-agent-improvement-loop`, and if so, what must the first version include or exclude?

## Findings
1. A new `sk-agent-improvement-loop` skill is feasible from a packaging and routing standpoint. The repo already supports on-demand, auto-discovered skills, and it provides a canonical `/create:sk-skill` workflow for full-create or full-update skill lifecycles. [SOURCE: .opencode/skill/README.md:42] [SOURCE: .opencode/skill/README.md:68] [SOURCE: .opencode/command/create/sk-skill.md:9] [SOURCE: .opencode/command/create/sk-skill.md:120]
2. The MVP must keep a narrow mutable surface, just like `autoagent-main` does. Instead of "improve all agents," the first version should target one named runtime surface, one bounded editable file set, and one explicit directive file, because our agent paths already vary by runtime (`.opencode`, `.claude`, `.codex`) and the external repo succeeds partly by sharply separating editable vs fixed regions. [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:16] [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-auto-agent-improvement/external/autoagent-main/README.md:13] [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-auto-agent-improvement/external/autoagent-main/program.md:40]
3. The essential missing component is an evaluator. `autoagent-main` can keep or discard changes because it has Harbor tasks, verifier scores, and a run ledger; our current deep-research loop instead optimizes for evidence convergence and synthesized findings. A real agent-improvement loop here therefore needs scenario-based scoring or contract tests before it should ever mutate agent files automatically. [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-auto-agent-improvement/external/autoagent-main/README.md:26] [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-auto-agent-improvement/external/autoagent-main/program.md:156] [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:14] [INFERENCE: without a measurable evaluator, an automatic mutation loop would only rewrite prompts/configs without trustworthy keep/discard decisions.]
4. The safest MVP shape is a disk-first experiment loop that reuses our existing state discipline: directive file, target manifest, experiment ledger, reducer-friendly iteration artifacts, and explicit keep/discard criteria. Phase 1 should propose changes and run evaluators; Phase 2 can auto-edit a bounded target; Phase 3 can widen to cross-runtime parity once a mirror-sync contract exists. [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:179] [SOURCE: .opencode/agent/deep-research.md:50] [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-auto-agent-improvement/external/autoagent-main/program.md:141]

## Ruled Out
- Starting with a fully autonomous overnight loop over the entire `.opencode/agent` directory is too broad for an MVP because the repository lacks a benchmark-grade evaluator and because runtime mirrors would make result attribution ambiguous. [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:16] [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-auto-agent-improvement/external/autoagent-main/program.md:35]

## Dead Ends
- Copying `autoagent-main` wholesale would import the wrong trust boundary. Its loop assumes a benchmark harness under test, while our repo currently organizes behavior across commands, skills, and runtime agent files rather than one isolated harness file. [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-auto-agent-improvement/external/autoagent-main/README.md:13] [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:137]

## Sources Consulted
- .opencode/skill/README.md:42
- .opencode/command/create/sk-skill.md:9
- .opencode/skill/sk-deep-research/SKILL.md:16
- .opencode/specs/03--skilled-agent-orchestration/041-sk-auto-agent-improvement/external/autoagent-main/program.md:141

## Assessment
- New information ratio: 0.8
- Questions addressed: What capabilities are missing if we want a reliable `sk-agent-improvement-loop` rather than a one-off research packet? What should the MVP scope, boundaries, and success metric be for a new skill in this repo?
- Questions answered: What capabilities are missing if we want a reliable `sk-agent-improvement-loop` rather than a one-off research packet? What should the MVP scope, boundaries, and success metric be for a new skill in this repo?

## Reflection
- What worked and why: Reframing the problem around evaluator availability and mutable-surface discipline turned a vague "can we make this?" question into a concrete MVP boundary.
- What did not work and why: Treating the external repo as a drop-in template stayed misleading even in synthesis, because its single harness and benchmark assumptions do not map one-to-one onto our layered command/skill/runtime system.
- What I would do differently: The next implementation packet should define the evaluator before any new skill prose is written, because the scoring contract determines the rest of the workflow.

## Recommended Next Focus
Stop the loop and synthesize: the packet now has enough evidence to answer the feasibility question and recommend an MVP design for `sk-agent-improvement-loop`.
