# Research Dashboard — 009-xethryon

| Iteration | Phase | Question | Confidence | Priority | Adopt Target | Verdict |
|-----------|-------|----------|------------|----------|--------------|---------|
| 001 | 1 | Does Xethryon's live prompt-injection path actually use LLM-ranked memory retrieval by default, and should system-spec-kit adopt that retrieval pattern? | high | rejected | `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts` | KEEP |
| 002 | 1 | Should system-spec-kit adopt Xethryon's project-global memory namespace so session continuity is not tied primarily to spec-folder memory artifacts? | medium | nice-to-have | `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts` | ADD |
| 003 | 1 | Does Xethryon's post-turn memory hook expose a continuity pattern that system-spec-kit should adopt for non-hook runtimes? | medium | should-have | `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts` | ADD |
| 004 | 1 | Should system-spec-kit adopt Xethryon's time-and-activity-gated AutoDream model on top of its existing reconsolidation-on-save path? | high | should-have | `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts` | ADD |
| 005 | 1 | Can Xethryon's one-pass self-reflection gate improve system-spec-kit deep-research quality without importing hidden runtime behavior? | high | should-have | `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | ADD |
| 006 | 1 | Should system-spec-kit surface live git state during `session_bootstrap()` and `session_resume()` the way Xethryon injects git context into every turn? | medium | nice-to-have | `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts` | ADD |
| 007 | 1 | Should system-spec-kit adopt Xethryon's explicit role-switch trigger matrix even if it does not adopt Xethryon's autonomy toggle and switch_agent runtime? | high | should-have | `.opencode/agent/orchestrate.md` | ADD |
| 008 | 1 | Is Xethryon's autonomous invoke_skill pattern compatible with system-spec-kit's gate-driven workflow model? | high | rejected | `.opencode/command/spec_kit/deep-research.md` | KEEP |
| 009 | 1 | Can Xethryon's file-based swarm mailbox and task-board model improve Spec Kit's multi-agent workflows if translated into packet-local artifacts rather than a live IPC runtime? | medium | nice-to-have | `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | ADD |
| 010 | 1 | What process change should system-spec-kit adopt so deep-research packets reliably surface docs-vs-code mismatches like Xethryon's retrieval claims? | high | must-have | `.opencode/agent/deep-research.md` | ADD |
| 011 | 2 | What does the gap between Xethryon's rebase checklist documentation and its actual runtime surface teach system-spec-kit about researching and documenting forked agentic systems? | high | should-have | `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | KEEP |
| 012 | 2 | Should system-spec-kit require deep-research findings to map feature claims to explicit verification artifacts instead of treating the existence of CI and tests as sufficient evidence? | high | must-have | `.opencode/agent/deep-research.md` | KEEP |
| 013 | 2 | Does Xethryon's prompt-authored, repo-global markdown memory suggest that system-spec-kit should pivot away from its explicit JSON-primary save pipeline and indexed memory architecture? | high | rejected | `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts` | KEEP |
| 014 | 2 | If system-spec-kit adopts more of Xethryon's deferred consolidation cadence, what must change architecturally so the feature is safe and trustworthy? | high | should-have | `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts` | REFACTOR |
| 015 | 2 | Does Xethryon's swarm runtime suggest that system-spec-kit should pivot from its current orchestrate-and-packet model to a mailbox-driven team runtime? | high | rejected | `.opencode/agent/orchestrate.md` | KEEP |
| 016 | 2 | Does Xethryon's apparent autonomy simplicity mean system-spec-kit should simplify by replacing explicit gate-driven workflow cues with more hidden runtime behavior? | high | nice-to-have | `.opencode/skill/system-spec-kit/constitutional/gate-enforcement.md` | SIMPLIFY |
| 017 | 2 | Should system-spec-kit replace its explicit deep-research/deep-review loop artifacts with more hidden, runtime-embedded quality loops inspired by Xethryon's reflection and post-turn memory behavior? | high | should-have | `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | KEEP |
| 018 | 2 | If system-spec-kit wants some of Xethryon's ambient project orientation, what is the right architecture: durable repo-global memory, or a lighter read-only orientation surface? | high | should-have | `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts` | SIMPLIFY |
| 019 | 2 | Does Xethryon's lighter documentation posture imply that system-spec-kit should pivot away from Level 1/2/3+ spec folders, `create.sh`, and `validate.sh` toward a simpler documentation lifecycle? | high | rejected | `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` | KEEP |
| 020 | 2 | What is the smallest UX improvement system-spec-kit should borrow from Xethryon after rejecting the bigger architectural pivots? | medium | nice-to-have | `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts` | SIMPLIFY |
| 021 | 3 | Does system-spec-kit expose too much lifecycle branching through separate `/spec_kit:plan`, `/spec_kit:implement`, and `/spec_kit:complete` entry points compared with Xethryon's flatter operator surface? | high | should-have | `.opencode/command/spec_kit/plan.md` | MERGE |
| 022 | 3 | Is the `/memory:*` command family awkwardly parallel to `/spec_kit:*`, or is that separation actually justified for a governed memory subsystem? | high | rejected | `.opencode/command/memory/README.txt` | KEEP |
| 023 | 3 | Is the Level 1/2/3+ plus CORE+ADDENDUM template model intuitive enough, or does system-spec-kit need a more guided spec-folder UX? | high | should-have | `.opencode/agent/speckit.md` | ADD |
| 024 | 3 | Is system-spec-kit exposing too much agent granularity at the UX layer, especially around `@context` and `@context-prime`? | high | should-have | `.opencode/agent/orchestrate.md` | MERGE |
| 025 | 3 | Should system-spec-kit replace explicit LEAF deep-research and deep-review agents with a more hidden iteration architecture inspired by Xethryon's runtime reflection and post-turn hooks? | high | rejected | `.opencode/agent/deep-research.md` | KEEP |
| 026 | 3 | Is the system-spec-kit skill catalog too fragmented at the operator surface compared with Xethryon's bundled-skill model? | medium | nice-to-have | `.opencode/skill/system-spec-kit/SKILL.md` | MERGE |
| 027 | 3 | Is Gate 2's explicit `skill_advisor.py` workflow the right UX for skill routing, or has it become operator-facing ceremony? | high | must-have | `.opencode/skill/scripts/skill_advisor.py` | REDESIGN |
| 028 | 3 | Does the full Gate 1->2->3 and constitutional/hook machinery expose too much workflow theory to the operator? | high | should-have | `.opencode/skill/system-spec-kit/constitutional/gate-enforcement.md` | SIMPLIFY |
| 029 | 3 | What single artifact would reduce the most end-to-end workflow friction in system-spec-kit without weakening spec folders, gates, or validation? | medium | nice-to-have | `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts` | ADD |
| 030 | 3 | Is the current YAML workflow-asset pattern still the right abstraction for autonomous execution, or has the asset layer become too broad and repetitive? | medium | should-have | `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml` | SIMPLIFY |

## Convergence Signal
- Iterations without new signal in Phase 3: 0
- Stop rule triggered: yes
- Stop reason: max_iterations

## Phase 3 Totals
- Must-have: 1
- Should-have: 5
- Nice-to-have: 2
- Rejected: 2

## Phase 3 UX Verdicts
- SIMPLIFY: 2
- ADD: 2
- MERGE: 3
- KEEP: 2
- REDESIGN: 1

## Combined Totals
- Must-have: 3
- Should-have: 13
- Nice-to-have: 7
- Rejected: 7
