# Research Dashboard — 007-relay-main

| Iteration | Phase | Question | Confidence | Priority | Verdict | Adopt Target |
|-----------|-------|----------|------------|----------|---------|--------------|
| 001 | 1 | Ready-state handshake vs. spawn success | high | should-have | future transport concept | `.opencode/agent/orchestrate.md` + future `mcp_server` transport module |
| 002 | 1 | Callback and lifecycle-hook contract | high | must-have | adopt | `.opencode/agent/orchestrate.md` + `cli-*/references/agent_delegation.md` |
| 003 | 1 | Channels vs. DMs vs. threads | high | should-have | prototype later | `.opencode/agent/orchestrate.md` + future transport-routing module |
| 004 | 1 | Workspace-aware delivery scoping | medium | nice-to-have | prototype later | `.opencode/command/spec_kit/resume.md` + `.opencode/agent/context-prime.md` |
| 005 | 1 | Provider-first spawning + transport defaults | high | must-have | adopt | `cli-codex`, `cli-gemini`, `cli-copilot` delegation references |
| 006 | 1 | Team / fan-out / pipeline taxonomy | high | must-have | adopt | `.opencode/agent/orchestrate.md` + `parallel_dispatch_config.md` + `deep-research.md` |
| 007 | 1 | Evidence-based completion pipeline | high | should-have | adopt | `.opencode/command/spec_kit/deep-research.md` |
| 008 | 1 | Delivery-state + idle-state tracking | medium | nice-to-have | roadmap | future `.opencode/skill/system-spec-kit/mcp_server/` coordination module |
| 009 | 1 | TypeScript/Python parity rubric | medium | should-have | adopt | `cli-*/references/agent_delegation.md` + `system-spec-kit` documentation contract |
| 010 | 1 | Replace Task orchestration with full broker now? | high | rejected | KEEP | architectural boundary only |
| 011 | 2 | One shared deep-loop kernel for research + review? | high | should-have | REFACTOR | `deep-research`, `deep-review`, `sk-deep-research`, `sk-deep-review` |
| 012 | 2 | Split lightweight continuity from durable semantic memory? | high | must-have | PIVOT | memory pipeline + deep-loop continuity/handover surfaces |
| 013 | 2 | Add explicit resume/start-from semantics to deep loops? | high | should-have | REFACTOR | deep-loop commands + reducer/runner implementation |
| 014 | 2 | Internalize Gate 1/2/3 behind simpler user modes? | high | should-have | SIMPLIFY | `AGENTS.md` + gate docs + command front door |
| 015 | 2 | Scenario-first validation instead of rule-first emphasis? | high | must-have | REFACTOR | `validate.sh`, memory-quality pipeline, deep-loop verification |
| 016 | 2 | Single-source provider registry + generated parity docs? | high | must-have | SIMPLIFY | provider delegation references + shared doc/config generation |
| 017 | 2 | Fewer top-level operator modes over hidden specialist agents? | medium | nice-to-have | SIMPLIFY | top-level orchestration/delegation docs |
| 018 | 2 | Pivot away from Level 1/2/3+ lifecycle? | high | rejected | KEEP | none; simplify exposure only |
| 019 | 2 | Replace specialized deep loops with Relay workflow DSL? | high | rejected | KEEP | none; shared kernel only |
| 020 | 2 | Generate machine-readable markdown mirrors from one source? | medium | should-have | SIMPLIFY | command/provider docs generation pipeline |
| 021 | 3 | Merge visible plan/implement/complete lifecycle front door? | high | must-have | MERGE | spec_kit command/help surfaces |
| 022 | 3 | Add unified context concierge across /memory and /spec_kit? | high | should-have | ADD | resume + memory onboarding surfaces |
| 023 | 3 | Simplify template/level UX while keeping spec folders? | medium | nice-to-have | SIMPLIFY | template onboarding + validator messaging |
| 024 | 3 | Merge context-prime/context/handover operator surface? | high | should-have | MERGE | orchestrate + context/handover surfaces |
| 025 | 3 | Replace LEAF deep loops and explicit state files? | high | rejected | KEEP | architecture boundary only |
| 026 | 3 | Merge visible sk-code skill family? | high | must-have | MERGE | skill onboarding + routing surfaces |
| 027 | 3 | Demote explicit Gate 2 skill advisor ceremony? | high | must-have | SIMPLIFY | AGENTS/CLAUDE + routing prompts |
| 028 | 3 | Redesign AGENTS/CLAUDE/hooks operator contract? | high | must-have | REDESIGN | top-level doctrine docs |
| 029 | 3 | Rebuild feature workflow around lead mode plus escalation? | high | should-have | REDESIGN | top-level workflow docs/wrappers |
| 030 | 3 | Merge per-command YAML assets into shared lifecycle engine? | high | should-have | MERGE | command asset layer + lifecycle engine |

## Convergence Signal
- Iterations without new signal: 0
- Stop rule triggered: no
- Minimum Phase 3 angle coverage met: yes (all six required angles covered)

## Finding Totals
- Must-have: 10
- Should-have: 12
- Nice-to-have: 4
- Rejected: 4

## Phase 2 Verdict Totals
- REFACTOR: 3
- PIVOT: 1
- SIMPLIFY: 4
- KEEP: 2

## Phase 3 UX Verdict Totals
- SIMPLIFY: 2
- ADD: 1
- MERGE: 4
- KEEP: 1
- REDESIGN: 2
