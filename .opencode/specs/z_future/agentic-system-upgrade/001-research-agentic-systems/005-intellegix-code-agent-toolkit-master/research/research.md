---
title: "...c-kit/z_future/agentic-system-upgrade/001-research-agentic-systems/005-intellegix-code-agent-toolkit-master/research]"
description: "30-iteration research of Intellegix Code Agent Toolkit patterns for system-spec-kit improvement. Includes Phase 1 adoption findings, Phase 2 refactor/pivot analysis, and Phase 3 UX, agent-system, command, and skill recommendations. 24 actionable findings and 6 rejected recommendations."
trigger_phrases:
  - "kit"
  - "future"
  - "agentic"
  - "system"
  - "upgrade"
  - "research"
  - "005"
  - "intellegix"
importance_tier: "important"
contextType: "research"
---
# Deep Research Report — 005-intellegix-code-agent-toolkit-master

## 1. Executive Summary
- External repo: Intellegix Code Agent Toolkit, a bundled control plane for orchestrator-driven autonomous loops, worktree-based multi-agent execution, technology research, and lightweight project governance.
- Iterations executed: 30 of 30
- Stop reason: max_iterations
- Combined finding totals: Must-have 6 | Should-have 14 | Nice-to-have 4 | Rejected 6
- Phase 1 asked: what patterns are worth adopting?
- Phase 2 asked: what should `system-spec-kit` refactor, pivot, simplify, or explicitly keep?
- Phase 3 asked: how should the operator-facing UX, command surface, agent roster, skill system, and automation shell change?

### Highest-Priority Combined Outcomes
- Build a dedicated typed deep-loop controller and pair it with behavior-first runtime tests.
- Replace operator-facing level and gate ceremony with named work profiles and a thinner runtime brief.
- Merge the public lifecycle, memory, agent, and skill surfaces down to smaller operator entry points while keeping current internals where they solve real problems.
- Add a fast path for bound continuation and small scoped changes.

## 2. Research Method Note
- Phase 1 concentrated on deep-loop runtime, stop reasons, session continuity, tests, orchestration guardrails, and optional council/browser capabilities.
- Phase 2 re-read the Phase 1 artifacts first, then expanded into refactor, pivot, simplify, and keep decisions around runtime truth, memory boundaries, validation philosophy, gate UX, and orchestration shape.
- Phase 3 re-read the existing iterations and synthesis, then focused on user-facing command ergonomics, template/spec-folder UX, sub-agent granularity, skill packaging, hooks and constitutional automation, and full workflow friction.
- On 2026-04-10, `mcp__cocoindex_code__search` timed out for this phase checkout, so the Phase 2 and Phase 3 passes fell back to direct file reads and exact `rg` searches. The fallback was acceptable because the scope is doc-heavy and file-bounded.

## 3. External Repo Map
- The external repo clusters around five operating centers:
  - `automated-loop/`: runtime config, state persistence, budget handling, NDJSON parsing, and tests
  - `commands/`: orchestration, research, handoff, and project bootstrap surfaces
  - `agents/`: orchestrator, research, and specialist execution roles
  - `hooks/`: orchestration guardrails and time/context injection
  - `portfolio/`, `council-automation/`, and browser tooling: optional higher-order governance and research support
- The strongest Phase 1 imports came from loop runtime control, stop handling, and test posture.
- The strongest Phase 2 imports came from the external repo's tighter runtime boundaries.
- The strongest Phase 3 signal came from its flatter operator-facing surface, even though the local system still solves a broader problem.

## 4. Findings Registry

### Phase 1 Findings Retained

### Finding F-001 — Add A Final Completion Gate And Rich Stop Reasons
- Origin iteration: `iteration-001.md`
- system-spec-kit target: `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`, `.opencode/command/spec_kit/deep-research.md`, `.opencode/skill/sk-deep-research/references/loop_protocol.md`
- Priority: must-have
- Description: Keep convergence-based research, but add a stronger packet-level completion gate and richer terminal reasons instead of relying on "done" claims and thin stop semantics.

### Finding F-002 — Add Optional Runtime Session Continuity Beside Lineage
- Origin iteration: `iteration-002.md`
- system-spec-kit target: `.opencode/skill/sk-deep-research/references/state_format.md`, `.opencode/skill/sk-deep-research/assets/deep_research_config.json`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- Priority: should-have
- Description: Add a resumable runtime-session seam without replacing the existing artifact-based lineage model.

### Finding F-003 — Introduce Operational Backoff, Cooldown, And Single-Step Fallback
- Origin iteration: `iteration-003.md`
- system-spec-kit target: `.opencode/skill/sk-deep-research/assets/deep_research_config.json`, `.opencode/skill/sk-deep-research/references/loop_protocol.md`
- Priority: should-have
- Description: Turn repeated stalls into explicit operational behavior through cooldowns, retry shaping, and bounded fallback steps.

### Finding F-004 — Add Session-Health Signals Before Declaring Stagnation
- Origin iteration: `iteration-004.md`
- system-spec-kit target: `.opencode/skill/sk-deep-research/references/convergence.md`, `.opencode/skill/sk-deep-research/references/loop_protocol.md`
- Priority: should-have
- Description: Separate research saturation from session fatigue by adding optional session-health heuristics and rotation behavior.

### Finding F-005 — Add Sentinel-Based Orchestrator Enforcement
- Origin iteration: `iteration-006.md`
- system-spec-kit target: `.opencode/agent/orchestrate.md`, `.opencode/skill/system-spec-kit/constitutional/gate-tool-routing.md`
- Priority: should-have
- Description: Add lightweight runtime enforcement for orchestration role boundaries where supported, instead of relying only on prompt compliance.

### Finding F-006 — Offer An Optional Council-Style Synthesis Profile
- Origin iteration: `iteration-007.md`
- system-spec-kit target: `.opencode/command/spec_kit/deep-research.md`, `.opencode/skill/sk-deep-research/assets/deep_research_strategy.md`, `.opencode/skill/system-spec-kit/templates/research.md`
- Priority: nice-to-have
- Description: Import the external repo's agreement/disagreement synthesis shape as an optional advanced research mode, not as the default path.

### Finding F-007 — Add Advisory Anti-Overbuilding Guidance, Not A New Tier System
- Origin iteration: `iteration-009.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/templates/decision-record.md`, `.opencode/skill/system-spec-kit/references/validation/validation_rules.md`
- Priority: nice-to-have
- Description: Adapt anti-overbuilding heuristics into advisory prompts rather than importing the external portfolio-tier model literally.

### Finding F-008 — Expand Tests From Parity Checks To Runtime Guarantees
- Origin iteration: `iteration-010.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts`, `.opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts`
- Priority: must-have
- Description: Treat runtime tests as executable specification for stop reasons, session continuity, and fallback behavior.

### Phase 2 Findings

### Finding F-009 — Formalize A Research-Packet Minimal Profile
- Origin iteration: `iteration-011.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/references/templates/level_specifications.md`, `.opencode/skill/system-spec-kit/references/templates/template_guide.md`
- Priority: should-have
- Refactor verdict: SIMPLIFY
- Description: Deep research already behaves like a distinct packet class. Formalize that lighter packet profile instead of forcing it through the full general level ladder.

### Finding F-010 — Separate Loop Completion From Memory Export
- Origin iteration: `iteration-012.md`
- system-spec-kit target: `.opencode/command/spec_kit/deep-research.md`, `.opencode/command/spec_kit/deep-review.md`, `.opencode/skill/system-spec-kit/references/memory/save_workflow.md`
- Priority: should-have
- Refactor verdict: REFACTOR