---
title: "Deep Research Report — 005-intellegix-code-agent-toolkit-master"
description: "10-iteration research of Intellegix Code Agent Toolkit patterns for system-spec-kit improvement opportunities. 8 actionable findings and 2 rejected recommendations."
importance_tier: "important"
contextType: "research"
---

# Deep Research Report — 005-intellegix-code-agent-toolkit-master

## 1. Executive Summary
- External repo: Intellegix Code Agent Toolkit, a bundled toolkit for autonomous loops, orchestrator/worker control, council-style multi-model querying, browser-backed exploration, and portfolio governance.
- Iterations executed: 10 of 10
- Stop reason: max_iterations
- Total actionable findings: 8
- Must-have: 2 | Should-have: 4 | Nice-to-have: 2 | Rejected: 2
- Top 3 adoption opportunities for system-spec-kit: add a packet-level completion gate with explicit stop reasons; add optional session-health and resumable runtime-session support; expand deep-research tests into runtime-behavior specifications.

## 2. External Repo Map
- The external repo is organized around four major subsystems:
  - `automated-loop/`: single-loop runtime, state, NDJSON parsing, and multi-agent support.
  - `commands/` and `hooks/`: orchestrator prompts and enforcement hooks.
  - `council-automation/`: multi-model query and synthesis pipeline.
  - `mcp-servers/browser-bridge/` and `portfolio/`: browser-backed evidence collection and delivery-governance overlays.
- The deepest transferable ideas came from `automated-loop/` and `hooks/`, not from the browser or portfolio subsystems.

```text
Intellegix Toolkit
├── automated-loop
│   ├── loop_driver.py
│   ├── state_tracker.py
│   ├── ndjson_parser.py
│   ├── research_bridge.py
│   └── tests/
├── commands
│   ├── orchestrator.md
│   └── frontend-e2e.md
├── hooks
│   └── orchestrator-guard.py
├── council-automation
│   ├── council_query.py
│   ├── council_config.py
│   └── synthesis_prompt.md
├── mcp-servers
│   └── browser-bridge/
└── portfolio
    ├── PORTFOLIO.md.example
    └── DECISIONS.md
```

## 3. Findings Registry

### Finding F-001 — Add A Final Completion Gate And Rich Stop Reasons
- Origin iteration: `iteration-001.md`
- system-spec-kit target: `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`, `.opencode/command/spec_kit/deep-research.md`, `.opencode/skill/sk-deep-research/references/loop_protocol.md`
- Priority: must-have
- Description: The external loop does not trust "done" claims; it validates a completion gate loaded from policy text, differentiates terminal causes with explicit exit codes, and tests the rejection path before accepting success. `system-spec-kit` already has strong convergence logic, but it still needs a packet-level closeout contract that can distinguish completion, convergence, budget stop, and stagnation. This is the single highest-value transfer because it improves auditability without discarding the current research model.
- Evidence: `[SOURCE: external/automated-loop/loop_driver.py:33-37]`, `[SOURCE: external/automated-loop/loop_driver.py:541-587]`, `[SOURCE: external/automated-loop/tests/test_loop_driver.py:2213-2272]`, `[SOURCE: .opencode/command/spec_kit/deep-research.md:147-155]`, `[SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:250-286]`

### Finding F-002 — Add Optional Runtime Session Continuity Beside Lineage
- Origin iteration: `iteration-002.md`
- system-spec-kit target: `.opencode/skill/sk-deep-research/references/state_format.md`, `.opencode/skill/sk-deep-research/assets/deep_research_config.json`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- Priority: should-have
- Description: The external repo records the most recent resumable runtime session separately from the higher-level workflow lineage. `system-spec-kit` already models lineage well, but it could improve long-running continuity by adding an optional runtime-session field and JSONL events for runtimes that support true resume handles. This should remain capability-gated and optional.
- Evidence: `[SOURCE: external/automated-loop/state_tracker.py:65-76]`, `[SOURCE: external/automated-loop/loop_driver.py:265-289]`, `[SOURCE: external/automated-loop/tests/test_ndjson_parser.py:135-149]`, `[SOURCE: .opencode/skill/sk-deep-research/references/state_format.md:55-81]`

### Finding F-003 — Introduce Operational Backoff, Cooldown, And Single-Step Fallback
- Origin iteration: `iteration-003.md`
- system-spec-kit target: `.opencode/skill/sk-deep-research/assets/deep_research_config.json`, `.opencode/skill/sk-deep-research/references/loop_protocol.md`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- Priority: should-have
- Description: The external loop turns repeated timeouts and stalls into bounded operational behavior: cooldown, trace logging, and one-step model fallback. `system-spec-kit` already has soft iteration budgets, but it lacks explicit retry shaping for overnight autonomous runs. Bringing in optional operational controls would improve resilience while keeping the base flow simple for lighter runtimes.
- Evidence: `[SOURCE: external/automated-loop/config.py:36-71]`, `[SOURCE: external/automated-loop/loop_driver.py:367-449]`, `[SOURCE: external/automated-loop/tests/test_loop_driver.py:1183-1225]`, `[SOURCE: .opencode/skill/sk-deep-research/assets/deep_research_config.json:3-13]`

### Finding F-004 — Add Session-Health Signals Before Declaring Stagnation
- Origin iteration: `iteration-004.md`
- system-spec-kit target: `.opencode/skill/sk-deep-research/references/convergence.md`, `.opencode/skill/sk-deep-research/references/loop_protocol.md`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- Priority: should-have
- Description: The external repo distinguishes semantic stagnation from session fatigue by rotating sessions when turn patterns and cost behavior indicate context exhaustion. `system-spec-kit` currently decides stuckness from novelty and question coverage only. Adding a session-health layer would let compatible runtimes refresh context before escalating to stuck recovery.
- Evidence: `[SOURCE: external/automated-loop/loop_driver.py:1064-1143]`, `[SOURCE: external/automated-loop/tests/test_loop_driver.py:1231-1413]`, `[SOURCE: .opencode/skill/sk-deep-research/references/convergence.md:41-48]`, `[SOURCE: .opencode/skill/sk-deep-research/references/convergence.md:214-243]`

### Finding F-005 — Add Sentinel-Based Orchestrator Enforcement
- Origin iteration: `iteration-006.md`
- system-spec-kit target: `.opencode/agent/orchestrate.md`, `.opencode/skill/system-spec-kit/constitutional/gate-tool-routing.md`
- Priority: should-have
- Description: The external toolkit enforces orchestrator role boundaries with a pre-tool-use guard and sentinel metadata, rather than relying only on prompt instructions. This pattern transfers well to `system-spec-kit` because the local orchestrator already has strong behavioral rules that would benefit from optional runtime enforcement.
- Evidence: `[SOURCE: external/commands/orchestrator.md:1-23]`, `[SOURCE: external/hooks/orchestrator-guard.py:130-250]`, `[SOURCE: .opencode/agent/orchestrate.md:36-37]`, `[SOURCE: .opencode/skill/system-spec-kit/constitutional/gate-tool-routing.md:31-40]`

### Finding F-006 — Offer An Optional Council-Style Synthesis Profile
- Origin iteration: `iteration-007.md`
- system-spec-kit target: `.opencode/command/spec_kit/deep-research.md`, `.opencode/skill/sk-deep-research/assets/deep_research_strategy.md`, `.opencode/skill/system-spec-kit/templates/research.md`
- Priority: nice-to-have
- Description: The external council pipeline treats agreement, disagreement, and unique insights as structured synthesis inputs. `system-spec-kit` should not make this the default deep-research path, but it could adopt the synthesis shape as an optional advanced mode when multiple model families are available.
- Evidence: `[SOURCE: external/council-automation/council_query.py:1-18]`, `[SOURCE: external/council-automation/synthesis_prompt.md:12-21]`, `[SOURCE: .opencode/skill/cli-copilot/SKILL.md:189-220]`

### Finding F-007 — Add Advisory Anti-Overbuilding Guidance, Not A New Tier System
- Origin iteration: `iteration-009.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/templates/decision-record.md`, `.opencode/skill/system-spec-kit/references/validation/validation_rules.md`
- Priority: nice-to-have
- Description: The external portfolio layer is the wrong abstraction to import directly because `system-spec-kit` phases are not product-maturity tiers. Still, the external repo's concrete anti-overbuilding heuristics could become advisory prompts in planning or decision-record templates.
- Evidence: `[SOURCE: external/portfolio/PORTFOLIO.md.example:29-50]`, `[SOURCE: external/portfolio/DECISIONS.md:16-33]`, `[SOURCE: .opencode/skill/system-spec-kit/references/structure/phase_definitions.md:8-19]`

### Finding F-008 — Expand Tests From Parity Checks To Runtime Guarantees
- Origin iteration: `iteration-010.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts`, `.opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts`
- Priority: must-have
- Description: The external repo's strongest discipline is that loop runtime behavior is specified in tests: stop reasons, completion-gate rejection, fallback boundaries, session rotation, and parser output all have assertions. `system-spec-kit` should adopt that testing posture before or alongside any runtime enhancements from this research phase.
- Evidence: `[SOURCE: external/automated-loop/tests/test_loop_driver.py:129-164]`, `[SOURCE: external/automated-loop/tests/test_loop_driver.py:2213-2468]`, `[SOURCE: external/automated-loop/tests/test_state_tracker.py:158-168]`, `[SOURCE: .opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts:24-57]`, `[SOURCE: .opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts:225-259]`

## 4. Rejected Recommendations

### Rejection R-001 — Do Not Import Multi-Agent File Locks Into The Current Deep-Research Loop
- Origin iteration: `iteration-005.md`
- Rationale: The external manifest-and-lock stack solves concurrent worker editing and synced-folder safety. The current `system-spec-kit` deep-research loop is intentionally leaf-only and serial. Importing locks now would add complexity for a problem the workflow is designed to avoid.
- Evidence: `[SOURCE: external/automated-loop/multi_agent.py:1-10]`, `[SOURCE: external/automated-loop/file_locking.py:95-169]`, `[SOURCE: .opencode/skill/sk-deep-research/references/loop_protocol.md:159-175]`

### Rejection R-002 — Do Not Make Browser Automation A Default Research Dependency
- Origin iteration: `iteration-008.md`
- Rationale: Browser-backed evidence gathering is powerful but belongs to an optional capability layer or adjacent command, not the baseline deep-research loop. The complexity-to-default-value ratio is too high for `system-spec-kit` core research.
- Evidence: `[SOURCE: external/mcp-servers/browser-bridge/server.js:95-176]`, `[SOURCE: external/commands/frontend-e2e.md:34-45]`, `[SOURCE: .opencode/command/spec_kit/deep-research.md:196-209]`

## 5. Cross-Phase Implications
- Findings F-001 through F-004 likely depend on whichever sibling phases own deep-research runtime behavior, session-start hooks, or documentation/runtime parity for autonomous workflows. They should be implemented together enough to avoid documentation promising controls that the runtime cannot yet honor.
- Finding F-005 touches orchestration policy and could affect sibling phases concerned with agent routing, constitutional guardrails, or task delegation semantics.
- Findings F-006 and F-007 are lower-risk and can follow after the runtime contract stabilizes.

## 6. Recommended Next Step
Plan and implement Finding F-001 first, followed immediately by F-008. A packet-level completion gate and explicit stop taxonomy create the contract that later runtime improvements can safely plug into, and the test expansion ensures those semantics stay real instead of becoming documentation drift.
