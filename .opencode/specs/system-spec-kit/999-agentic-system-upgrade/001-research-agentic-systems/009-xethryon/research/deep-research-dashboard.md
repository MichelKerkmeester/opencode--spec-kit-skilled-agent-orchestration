# Research Dashboard — 009-xethryon

| Iteration | Question | Confidence | Priority | Adopt Target |
|-----------|----------|------------|----------|--------------|
| 001 | Does Xethryon's live prompt-injection path actually use LLM-ranked memory retrieval by default, and should system-spec-kit adopt that retrieval pattern? | high | rejected | `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts` |
| 002 | Should system-spec-kit adopt Xethryon's project-global memory namespace so session continuity is not tied primarily to spec-folder memory artifacts? | medium | nice-to-have | `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts` |
| 003 | Does Xethryon's post-turn memory hook expose a continuity pattern that system-spec-kit should adopt for non-hook runtimes? | medium | should-have | `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts` |
| 004 | Should system-spec-kit adopt Xethryon's time-and-activity-gated AutoDream model on top of its existing reconsolidation-on-save path? | high | should-have | `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts` |
| 005 | Can Xethryon's one-pass self-reflection gate improve system-spec-kit deep-research quality without importing hidden runtime behavior? | high | should-have | `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` |
| 006 | Should system-spec-kit surface live git state during `session_bootstrap()` and `session_resume()` the way Xethryon injects git context into every turn? | medium | nice-to-have | `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts` |
| 007 | Should system-spec-kit adopt Xethryon's explicit role-switch trigger matrix even if it does not adopt Xethryon's autonomy toggle and switch_agent runtime? | high | should-have | `.opencode/agent/orchestrate.md` |
| 008 | Is Xethryon's autonomous invoke_skill pattern compatible with system-spec-kit's gate-driven workflow model? | high | rejected | `.opencode/command/spec_kit/deep-research.md` |
| 009 | Can Xethryon's file-based swarm mailbox and task-board model improve Spec Kit's multi-agent workflows if translated into packet-local artifacts rather than a live IPC runtime? | medium | nice-to-have | `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` |
| 010 | What process change should system-spec-kit adopt so deep-research packets reliably surface docs-vs-code mismatches like Xethryon's retrieval claims? | high | must-have | `.opencode/agent/deep-research.md` |

## Convergence Signal
- Iterations without new signal: 0
- Stop rule triggered: no

## Finding Totals
- Must-have: 1
- Should-have: 4
- Nice-to-have: 3
- Rejected: 2
