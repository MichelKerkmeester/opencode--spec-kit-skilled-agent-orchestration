# Research Dashboard — 001-agent-lightning-main

| Iteration | Phase | Question | Confidence | Priority | Verdict | Adopt Target |
|-----------|-------|----------|------------|----------|---------|--------------|
| 001 | 1 | Backend-agnostic tracer seam around existing agent workflows? | medium | should-have | prototype later | `.opencode/agent/orchestrate.md` |
| 002 | 1 | Attempt and rollout lifecycle model for long-running loops? | high | should-have | prototype later | `.opencode/command/spec_kit/deep-research.md` |
| 003 | 1 | Structured reward spans versus scalar validation signals? | high | should-have | prototype later | `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts` |
| 004 | 1 | Adapter boundary between raw artifacts and reducer outputs? | high | should-have | prototype later | `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` |
| 005 | 1 | Trainer pluggability pattern for loop drivers? | medium | nice-to-have | prototype later | `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` |
| 006 | 1 | Selective agent targeting without drifting into phase 005? | high | should-have | prototype later | `.opencode/agent/orchestrate.md` |
| 007 | 1 | Merge execution wrappers into Public hook system? | high | rejected | keep separate | `.opencode/skill/system-spec-kit/references/config/hook_system.md` |
| 008 | 1 | Richer loop metrics and dashboard signals? | high | must-have | adopt now | `.opencode/command/spec_kit/deep-research.md` |
| 009 | 1 | Store-backed immutable template resources? | high | rejected | keep current templates | `.opencode/skill/system-spec-kit/references/templates/template_guide.md` |
| 010 | 1 | Generic loop-architecture adoption in this phase? | high | rejected | defer to phase 005 | `.opencode/agent/orchestrate.md` |
| 011 | 2 | Compact CLI plus audience docs versus Public command and tool sprawl? | high | should-have | simplify | operator-facing command/docs surface |
| 012 | 2 | Standard-tool validation versus monolithic `validate.sh` orchestration? | high | must-have | refactor | `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` |
| 013 | 2 | Ready/error runtime state model for deep loops? | high | should-have | refactor | deep-loop runtime and reducer state |
| 014 | 2 | User-visible gate ceremony versus runtime defaults? | high | must-have | pivot | `AGENTS.md` gate model and runtime enforcement |
| 015 | 2 | Level taxonomy versus audience-based docs navigation? | high | nice-to-have | keep internal levels, add public docs layer | template/publishing architecture |
| 016 | 2 | Store-centric memory pivot? | high | rejected | keep file-first memory | memory architecture |
| 017 | 2 | Named agent-role sprawl versus capability layers? | medium | should-have | simplify | `.opencode/agent/orchestrate.md` |
| 018 | 2 | Optional capability groups versus 43-tool exposure? | high | should-have | refactor | command/tool exposure model |
| 019 | 2 | Reflective CLI config generation for primary workflows? | high | rejected | keep explicit contracts | command-surface design |
| 020 | 2 | Which differences should stay fundamental? | high | should-have | keep core architecture, simplify edges | product direction |
| 021 | 3 | Replace slash commands with a single `agl`-style front door? | high | rejected | keep slash commands, fix discovery | operator entrypoint strategy |
| 022 | 3 | Is `plan -> implement -> complete` plus YAML indirection too heavy? | high | must-have | redesign | `spec_kit` lifecycle front door |
| 023 | 3 | Is the `/memory:*` surface too parallel to `/spec_kit:*`? | high | should-have | merge | everyday memory UX |
| 024 | 3 | Are levels/templates/strict validation too internal-facing for operators? | high | nice-to-have | simplify | template and validator UX |
| 025 | 3 | Should named agents collapse into capability bundles? | high | must-have | merge | agent taxonomy |
| 026 | 3 | Should deep loops keep externalized JSONL state? | high | should-have | keep | deep-loop architecture |
| 027 | 3 | Should skills consolidate into capability packs? | high | should-have | merge | skill packaging |
| 028 | 3 | Should Gate 2 skill routing become implicit? | high | must-have | simplify | Gate 2 UX |
| 029 | 3 | Are `CLAUDE.md`, hooks, and constitutional docs too exposed? | high | should-have | redesign | operator contract and runtime docs |
| 030 | 3 | Should Public add oneclick-style workflow presets? | high | should-have | add | quickstart workflow presets |

## Convergence Signal
- Iterations without new signal: 0
- Stop rule triggered: no
- Stop reason: max_iterations

## Phase 2 Totals
- Must-have: 2
- Should-have: 5
- Nice-to-have: 1
- Rejected: 2
- Refactor/pivot verdicts: REFACTOR=3, PIVOT=1, SIMPLIFY=2, KEEP=4

## Phase 3 Totals
- Must-have: 3
- Should-have: 5
- Nice-to-have: 1
- Rejected: 1
- UX verdicts: SIMPLIFY=2, ADD=1, MERGE=3, KEEP=2, REDESIGN=2

## Combined Totals
- Must-have: 6
- Should-have: 15
- Nice-to-have: 3
- Rejected: 6
