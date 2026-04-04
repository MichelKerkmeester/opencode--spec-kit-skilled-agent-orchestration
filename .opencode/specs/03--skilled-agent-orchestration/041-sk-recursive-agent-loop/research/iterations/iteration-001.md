# Iteration 1: External autoagent-main Loop Anatomy

## Focus
Map how `autoagent-main` performs automated agent improvement, where the editable boundary lives, and what objective function governs the loop.

## Findings
1. `autoagent-main` is a meta-agent loop for agent engineering, not a direct task-solving harness: the human edits `program.md`, while the meta-agent repeatedly changes the harness, reruns the benchmark, checks score, and keeps or discards the change. [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/README.md:5] [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/program.md:141]
2. The mutable surface is deliberately narrow. `program.md` says only the pre-boundary section of `agent.py` is editable, covering prompt/configuration, tool creation, agent construction, and orchestration; the fixed Harbor adapter below the boundary is off-limits. [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/README.md:13] [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/program.md:38] [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/agent.py:24]
3. The improvement signal is benchmark-first and ledgered. The loop runs Harbor tasks, records `passed` and `avg_score`, logs each experiment in `results.tsv`, and applies strict keep/discard rules: keep only if passed improves or if equal performance becomes simpler. [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/README.md:26] [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/program.md:120] [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/program.md:156]
4. The repo already supports multiple runtime harness styles. The OpenAI version exposes a single `run_shell` tool and serializes ATIF trajectories, while the Claude variant exposes a richer runtime configuration surface with presets, MCP servers, subagents, hooks, and a local `.agent` working directory. [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/agent.py:33] [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/agent-claude.py:48]

## Ruled Out
- Treating `autoagent-main` as a research loop equivalent to `sk-deep-research` is inaccurate; it is an experiment loop with benchmark scoring, not a general evidence-synthesis loop. [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/README.md:5] [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/program.md:80]

## Dead Ends
- Assuming the harness itself is the human-authored control plane. The human-controlled directive actually lives in `program.md`, which means the loop depends on a stable "meta-program" surface rather than ad hoc prompting. [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/README.md:7] [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/program.md:3]

## Sources Consulted
- .opencode/specs/03--skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/README.md:5
- .opencode/specs/03--skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/program.md:21
- .opencode/specs/03--skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/agent.py:24
- .opencode/specs/03--skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/agent-claude.py:22

## Assessment
- New information ratio: 1.0
- Questions addressed: How does `autoagent-main` structure its automatic agent-improvement loop and editable boundary?
- Questions answered: How does `autoagent-main` structure its automatic agent-improvement loop and editable boundary?

## Reflection
- What worked and why: Reading `README.md`, `program.md`, and both harness files together exposed the true control plane, score loop, and fixed-boundary model quickly because each file explains a different part of the experiment contract.
- What did not work and why: Semantic search over the imported external folder was not useful here; the local index did not return targeted hits for this small snapshot, so direct file inspection was more reliable.
- What I would do differently: If the folder gains `tasks/` and `results.tsv` later, inspect a real benchmark branch next to verify how the experiment ledger behaves in practice.

## Recommended Next Focus
Map the external loop onto our current `.opencode/agent`, `sk-deep-research`, and skill infrastructure to separate what we already have from what a future `sk-agent-improver` would still need.
