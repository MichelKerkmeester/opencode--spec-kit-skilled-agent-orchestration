# Iteration 8: Reusable State Architecture vs Mutation-Specific Ledger

## Focus
Separate the reusable packet machinery from the research-specific semantics so a future improvement loop can inherit the right scaffolding without inheriting the wrong objective function.

## Findings
1. The packet skeleton is already suitable for resumable experimentation. State format defines immutable config, append-only JSONL, mutable strategy, write-once iteration files, auto-generated dashboard/registry outputs, and workflow-owned synthesis. [SOURCE: .opencode/skill/sk-deep-research/references/state_format.md:15] [SOURCE: .opencode/skill/sk-deep-research/references/state_format.md:24] [SOURCE: .opencode/skill/sk-deep-research/references/state_format.md:84]
2. The reducer mechanics are reusable even if the semantics are not. `@deep-research` writes iteration files plus one JSONL line, while reducer-owned surfaces are refreshed afterward from those primary artifacts. [SOURCE: .opencode/agent/deep-research.md:159] [SOURCE: .opencode/skill/sk-deep-research/scripts/reduce-state.cjs:334] [SOURCE: .opencode/skill/sk-deep-research/scripts/reduce-state.cjs:466]
3. The current ledger schema is research-shaped. Iteration records optimize for `newInfoRatio`, answered questions, ruled-out approaches, and convergence signals rather than baseline score, delta, or accepted candidate state. [SOURCE: .opencode/skill/sk-deep-research/references/state_format.md:132] [SOURCE: .opencode/skill/sk-deep-research/references/state_format.md:147]
4. The stop contract must be replaced, not copied. Deep research stops on max-iteration, all-questions-answered, and convergence-quality guards, while an improvement loop should stop on plateau, no-regression windows, budget limits, or "equal score but simpler" wins. [SOURCE: .opencode/skill/sk-deep-research/references/convergence.md:25] [SOURCE: .opencode/skill/sk-deep-research/references/convergence.md:115]

## Ruled Out
- Copying deep-research convergence logic into an agent-improvement loop would optimize the wrong thing. Fresh-context orchestration is reusable; evidence-convergence semantics are not. [SOURCE: .opencode/skill/sk-deep-research/references/convergence.md:25] [SOURCE: .opencode/skill/sk-deep-research/references/convergence.md:121]

## Dead Ends
- Treating the existing findings registry as the final experiment ledger would blur key concepts. A mutation loop needs candidate IDs, evaluator outputs, best-so-far state, and promotion history, not just questions and findings.

## Sources Consulted
- .opencode/skill/sk-deep-research/references/state_format.md:15
- .opencode/agent/deep-research.md:159
- .opencode/skill/sk-deep-research/scripts/reduce-state.cjs:334
- .opencode/skill/sk-deep-research/references/convergence.md:25

## Assessment
- New information ratio: 0.42
- Questions addressed: Which parts of that loop align with our existing `.opencode/agent`, `sk-deep-research`, and skill infrastructure? What capabilities are missing if we want a reliable `sk-improve-agent` rather than a one-off research packet?
- Questions answered: None newly answered; this iteration clarified reuse boundaries.

## Reflection
- What worked and why: Reading the formal state-format and convergence references made it easy to separate plumbing from policy.
- What did not work and why: Looking only at the live packet state is misleading because it hides how much logic lives in the shared references and reducer.
- What I would do differently: The future implementation packet should explicitly fork the state schema rather than trying to overload the current question/finding registry.

## Recommended Next Focus
Lock down the repo guardrails that would constrain any mutation loop so the design stays compatible with existing safety and documentation rules.
