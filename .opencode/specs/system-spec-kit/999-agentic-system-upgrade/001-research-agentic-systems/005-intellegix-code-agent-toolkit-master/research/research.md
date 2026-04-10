---
title: "Deep Research Report — 005-intellegix-code-agent-toolkit-master"
description: "20-iteration research of Intellegix Code Agent Toolkit patterns for system-spec-kit improvement, including Phase 2 refactor/pivot/simplification analysis. 16 actionable findings and 4 rejected recommendations."
importance_tier: "important"
contextType: "research"
---

# Deep Research Report — 005-intellegix-code-agent-toolkit-master

## 1. Executive Summary
- External repo: Intellegix Code Agent Toolkit, a bundled control plane for autonomous loops, orchestrator/worker control, council-style multi-model querying, browser-backed evidence gathering, and portfolio governance.
- Iterations executed: 20 of 20
- Stop reason: max_iterations
- Combined finding totals: Must-have 4 | Should-have 9 | Nice-to-have 3 | Rejected 4
- Phase 2 added a second research lens: not just "what to adopt," but "what to refactor, pivot, simplify, or explicitly keep" inside `system-spec-kit`.
- Highest-priority combined outcomes:
  - Build a dedicated typed deep-loop controller and move runtime truth out of scattered docs and YAML.
  - Pivot automation-heavy packet governance toward behavior-first tests, with validators serving packet integrity rather than runtime truth.
  - Formalize a lighter research-packet profile and decouple loop completion from mandatory archival-memory export.

## 2. Research Method Note
- Phase 1 followed the original improvement-adoption brief and concentrated on loop runtime, stop reasons, tests, session continuity, and optional council/guard patterns.
- Phase 2 re-read the Phase 1 artifacts first, then expanded into refactor/pivot/simplification questions across spec lifecycle, memory boundaries, gate UX, agent architecture, validation philosophy, and operator surface.
- On 2026-04-10, `mcp__cocoindex_code__search` timed out for this phase checkout, so Phase 2 fell back to direct file reads, exact `rg` searches, and test inspection. The fallback did not block the packet because the target scope is file-bounded and richly test-backed.

## 3. External Repo Map
- The external repo is organized around five operational centers:
  - `automated-loop/`: typed runtime config, state persistence, budget enforcement, NDJSON parsing, research bridge, and tests.
  - `commands/` and `agents/`: user-facing orchestration surfaces and specialist prompts.
  - `hooks/`: runtime enforcement and session injection.
  - `council-automation/` and `mcp-servers/browser-bridge/`: optional advanced evidence gathering and multi-model workflows.
  - `portfolio/`: maturity-aware anti-overbuilding rules.
- The most transferable Phase 1 ideas came from `automated-loop/` and `hooks/`.
- The most valuable Phase 2 signals came from the absence of local-equivalent simplicity: the external repo keeps loop runtime, instruction UX, and enforcement narrower than `system-spec-kit` does.

```text
Intellegix Toolkit
├── automated-loop
│   ├── loop_driver.py
│   ├── config.py
│   ├── state_tracker.py
│   ├── ndjson_parser.py
│   └── tests/
├── agents
│   └── orchestrator*.md
├── commands
│   └── orchestrator*.md, research/council/handoff commands
├── hooks
│   └── orchestrator-guard.py, inject-time.py
├── council-automation
├── mcp-servers/browser-bridge
└── portfolio
```

## 4. Findings Registry

### Phase 1 Findings Retained

### Finding F-001 — Add A Final Completion Gate And Rich Stop Reasons
- Origin iteration: `iteration-001.md`
- system-spec-kit target: `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`, `.opencode/command/spec_kit/deep-research.md`, `.opencode/skill/sk-deep-research/references/loop_protocol.md`
- Priority: must-have
- Description: The external loop does not trust "done" claims; it validates completion against a machine-checkable gate and emits explicit terminal causes. `system-spec-kit` should keep its convergence model, but add a packet-level completion gate and a richer stop taxonomy.
- Evidence: `[SOURCE: external/automated-loop/loop_driver.py:33-37]`, `[SOURCE: external/automated-loop/loop_driver.py:541-587]`, `[SOURCE: external/automated-loop/tests/test_loop_driver.py:2213-2272]`, `[SOURCE: .opencode/command/spec_kit/deep-research.md:147-155]`, `[SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:250-286]`

### Finding F-002 — Add Optional Runtime Session Continuity Beside Lineage
- Origin iteration: `iteration-002.md`
- system-spec-kit target: `.opencode/skill/sk-deep-research/references/state_format.md`, `.opencode/skill/sk-deep-research/assets/deep_research_config.json`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- Priority: should-have
- Description: The external repo records a resumable runtime session handle separately from higher-level lineage state. `system-spec-kit` should add an optional runtime-session seam without replacing artifact-based lineage continuity.
- Evidence: `[SOURCE: external/automated-loop/state_tracker.py:65-76]`, `[SOURCE: external/automated-loop/loop_driver.py:265-289]`, `[SOURCE: external/automated-loop/tests/test_ndjson_parser.py:135-149]`, `[SOURCE: .opencode/skill/sk-deep-research/references/state_format.md:55-81]`

### Finding F-003 — Introduce Operational Backoff, Cooldown, And Single-Step Fallback
- Origin iteration: `iteration-003.md`
- system-spec-kit target: `.opencode/skill/sk-deep-research/assets/deep_research_config.json`, `.opencode/skill/sk-deep-research/references/loop_protocol.md`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- Priority: should-have
- Description: The external loop turns repeated slowdowns and timeouts into bounded, testable operational behavior. `system-spec-kit` should add optional cooldown, retry shaping, and one-step fallback for long autonomous runs.
- Evidence: `[SOURCE: external/automated-loop/config.py:36-71]`, `[SOURCE: external/automated-loop/loop_driver.py:367-449]`, `[SOURCE: external/automated-loop/tests/test_loop_driver.py:1183-1225]`, `[SOURCE: .opencode/skill/sk-deep-research/assets/deep_research_config.json:3-13]`

### Finding F-004 — Add Session-Health Signals Before Declaring Stagnation
- Origin iteration: `iteration-004.md`
- system-spec-kit target: `.opencode/skill/sk-deep-research/references/convergence.md`, `.opencode/skill/sk-deep-research/references/loop_protocol.md`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- Priority: should-have
- Description: The external loop distinguishes research saturation from session fatigue and rotates runtime sessions before declaring stagnation. `system-spec-kit` should add an optional session-health layer rather than relying on novelty signals alone.
- Evidence: `[SOURCE: external/automated-loop/loop_driver.py:1064-1143]`, `[SOURCE: external/automated-loop/tests/test_loop_driver.py:1231-1413]`, `[SOURCE: .opencode/skill/sk-deep-research/references/convergence.md:41-48]`, `[SOURCE: .opencode/skill/sk-deep-research/references/convergence.md:214-243]`

### Finding F-005 — Add Sentinel-Based Orchestrator Enforcement
- Origin iteration: `iteration-006.md`
- system-spec-kit target: `.opencode/agent/orchestrate.md`, `.opencode/skill/system-spec-kit/constitutional/gate-tool-routing.md`
- Priority: should-have
- Description: The external toolkit enforces orchestrator role boundaries with a sentinel and hook rather than relying only on prompt compliance. `system-spec-kit` should adopt a lightweight runtime-enforcement pattern for orchestrated workflows where the runtime supports it.
- Evidence: `[SOURCE: external/commands/orchestrator.md:1-23]`, `[SOURCE: external/hooks/orchestrator-guard.py:130-250]`, `[SOURCE: .opencode/agent/orchestrate.md:36-37]`, `[SOURCE: .opencode/skill/system-spec-kit/constitutional/gate-tool-routing.md:31-40]`

### Finding F-006 — Offer An Optional Council-Style Synthesis Profile
- Origin iteration: `iteration-007.md`
- system-spec-kit target: `.opencode/command/spec_kit/deep-research.md`, `.opencode/skill/sk-deep-research/assets/deep_research_strategy.md`, `.opencode/skill/system-spec-kit/templates/research.md`
- Priority: nice-to-have
- Description: The external council pipeline structures agreement, disagreement, and unique insights before synthesis. `system-spec-kit` should adopt the synthesis shape as an optional advanced mode, not as the default loop path.
- Evidence: `[SOURCE: external/council-automation/council_query.py:1-18]`, `[SOURCE: external/council-automation/synthesis_prompt.md:12-21]`, `[SOURCE: .opencode/skill/cli-copilot/SKILL.md:189-220]`

### Finding F-007 — Add Advisory Anti-Overbuilding Guidance, Not A New Tier System
- Origin iteration: `iteration-009.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/templates/decision-record.md`, `.opencode/skill/system-spec-kit/references/validation/validation_rules.md`
- Priority: nice-to-have
- Description: The external portfolio tier model is the wrong abstraction to import directly, but its anti-overbuilding heuristics could become advisory planning prompts or decision-record guidance.
- Evidence: `[SOURCE: external/portfolio/PORTFOLIO.md.example:29-50]`, `[SOURCE: external/portfolio/DECISIONS.md:16-33]`, `[SOURCE: .opencode/skill/system-spec-kit/references/structure/phase_definitions.md:8-19]`

### Finding F-008 — Expand Tests From Parity Checks To Runtime Guarantees
- Origin iteration: `iteration-010.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts`, `.opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts`
- Priority: must-have
- Description: The external repo treats tests as executable runtime specification. `system-spec-kit` should expand deep-research testing so stop reasons, session continuity, guard behavior, and fallback boundaries are provable rather than only documented.
- Evidence: `[SOURCE: external/automated-loop/tests/test_loop_driver.py:129-164]`, `[SOURCE: external/automated-loop/tests/test_loop_driver.py:2213-2468]`, `[SOURCE: external/automated-loop/tests/test_state_tracker.py:158-168]`, `[SOURCE: .opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts:24-57]`, `[SOURCE: .opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts:225-259]`

### Phase 2 Findings

### Finding F-009 — Formalize A Research-Packet Minimal Profile
- Origin iteration: `iteration-011.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/references/templates/level_specifications.md`, `.opencode/skill/system-spec-kit/references/templates/template_guide.md`, `.opencode/skill/system-spec-kit/references/structure/phase_definitions.md`, `.opencode/skill/sk-deep-research/references/state_format.md`
- Priority: should-have
- Refactor verdict: SIMPLIFY
- Description: `system-spec-kit` already behaves as if deep research uses a distinct packet type, but the core documentation model still frames all work through the general Level 1/2/3+ ladder. It should formalize a lighter research-packet profile instead of leaving that split implicit.
- Evidence: `[SOURCE: external/commands/orchestrator.md:193-220]`, `[SOURCE: external/portfolio/PORTFOLIO.md.example:45-50]`, `[SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:51-57]`, `[SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:81-97]`, `[SOURCE: .opencode/skill/system-spec-kit/references/structure/phase_definitions.md:17-27]`, `[SOURCE: .opencode/skill/sk-deep-research/references/state_format.md:15-27]`

### Finding F-010 — Separate Loop Completion From Memory Export
- Origin iteration: `iteration-012.md`
- system-spec-kit target: `.opencode/command/spec_kit/deep-research.md`, `.opencode/command/spec_kit/deep-review.md`, `.opencode/skill/system-spec-kit/references/memory/save_workflow.md`, `.opencode/skill/system-spec-kit/references/memory/memory_system.md`
- Priority: should-have
- Refactor verdict: REFACTOR
- Description: Packet-local research artifacts already form a complete operational record. `system-spec-kit` should keep archival memory, but stop treating memory export as part of the loop's core success contract.
- Evidence: `[SOURCE: external/automated-loop/state_tracker.py:65-77]`, `[SOURCE: external/automated-loop/state_tracker.py:137-179]`, `[SOURCE: .opencode/command/spec_kit/deep-research.md:147-154]`, `[SOURCE: .opencode/command/spec_kit/deep-research.md:196-209]`, `[SOURCE: .opencode/skill/system-spec-kit/references/memory/memory_system.md:17-27]`, `[SOURCE: .opencode/skill/system-spec-kit/references/memory/save_workflow.md:17-39]`

### Finding F-011 — Build A First-Class Deep-Loop Controller
- Origin iteration: `iteration-013.md`
- system-spec-kit target: `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`, `.opencode/skill/sk-deep-research/references/loop_protocol.md`, `.opencode/skill/sk-deep-research/references/state_format.md`, `.opencode/skill/sk-deep-research/references/convergence.md`
- Priority: must-have
- Refactor verdict: REFACTOR
- Description: The local runtime contract is spread across command docs, YAML, protocol references, state references, and convergence logic. `system-spec-kit` should centralize lifecycle truth in a typed loop engine shared by research and review.
- Evidence: `[SOURCE: external/automated-loop/config.py:36-71]`, `[SOURCE: external/automated-loop/config.py:178-250]`, `[SOURCE: external/automated-loop/state_tracker.py:65-77]`, `[SOURCE: .opencode/command/spec_kit/deep-research.md:166-173]`, `[SOURCE: .opencode/skill/sk-deep-research/references/loop_protocol.md:15-16]`, `[SOURCE: .opencode/skill/sk-deep-research/references/state_format.md:15-27]`, `[SOURCE: .opencode/skill/sk-deep-research/references/convergence.md:21-39]`

### Finding F-012 — Replace Universal Gate Choreography With Operating Profiles
- Origin iteration: `iteration-014.md`
- system-spec-kit target: `AGENTS.md`, `.opencode/skill/system-spec-kit/constitutional/gate-enforcement.md`, `.opencode/skill/system-spec-kit/constitutional/gate-tool-routing.md`
- Priority: should-have
- Refactor verdict: PIVOT
- Description: The local gate system is safer than the external one in absolute terms, but it imposes too much conversational ceremony on already-bound continuation work. `system-spec-kit` should introduce profiles such as `new-work`, `bound-continuation`, and `read-only-review`.
- Evidence: `[SOURCE: AGENTS.md:165-186]`, `[SOURCE: AGENTS.md:198-209]`, `[SOURCE: .opencode/skill/system-spec-kit/constitutional/gate-enforcement.md:62-69]`, `[SOURCE: external/commands/orchestrator.md:36-43]`, `[SOURCE: external/commands/orchestrator.md:83-97]`, `[SOURCE: external/hooks/orchestrator-guard.py:56-83]`, `[SOURCE: external/hooks/orchestrator-guard.py:130-175]`

### Finding F-013 — Decompose The Orchestrator Into Prompt Plus Policy
- Origin iteration: `iteration-015.md`
- system-spec-kit target: `.opencode/agent/orchestrate.md`, `.opencode/skill/system-spec-kit/constitutional/gate-tool-routing.md`, future orchestration policy manifests
- Priority: should-have
- Refactor verdict: REFACTOR
- Description: The local orchestrator prompt currently acts as routing manual, budget policy, review checklist, and dispatch template. It should be reduced to a decision layer backed by smaller structured policy surfaces.
- Evidence: `[SOURCE: .opencode/agent/orchestrate.md:24-36]`, `[SOURCE: .opencode/agent/orchestrate.md:49-60]`, `[SOURCE: .opencode/agent/orchestrate.md:93-118]`, `[SOURCE: .opencode/agent/orchestrate.md:158-166]`, `[SOURCE: external/agents/orchestrator.md:15-23]`, `[SOURCE: external/agents/orchestrator.md:52-67]`, `[SOURCE: external/commands/orchestrator.md:1-18]`, `[SOURCE: external/hooks/orchestrator-guard.py:130-175]`
- Overlap: phase `003` because command and orchestration UX would change alongside runtime shape.

### Finding F-014 — Govern Automation Packets With Tests First
- Origin iteration: `iteration-016.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`, deep-loop contract tests, future orchestration/runtime test suites
- Priority: must-have
- Refactor verdict: PIVOT
- Description: Documentation validators should remain strong for packet integrity, but automation-heavy workflows should be governed primarily by executable contract tests. The current validation culture still leans too heavily on documentation as runtime authority.
- Evidence: `[SOURCE: external/.github/workflows/ci.yml:13-40]`, `[SOURCE: external/automated-loop/tests/test_loop_driver.py:2213-2272]`, `[SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:81-99]`, `[SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:528-634]`, `[SOURCE: .opencode/skill/system-spec-kit/references/templates/template_guide.md:716-729]`

### Finding F-015 — Publish A Flatter Operator Surface Over Command Internals
- Origin iteration: `iteration-017.md`
- system-spec-kit target: `.opencode/command/spec_kit/deep-research.md`, `.opencode/command/spec_kit/deep-review.md`, command README surfaces, future generated operator docs
- Priority: nice-to-have
- Refactor verdict: SIMPLIFY
- Description: The modular layering of command docs, YAML assets, skills, and routing policy is good internally, but too much of it leaks into the operator experience. `system-spec-kit` should present flatter generated command surfaces for humans.
- Evidence: `[SOURCE: external/README.md:11-17]`, `[SOURCE: external/commands/orchestrator.md:1-24]`, `[SOURCE: .opencode/command/spec_kit/deep-research.md:166-173]`, `[SOURCE: .opencode/command/spec_kit/deep-research.md:216-224]`, `[SOURCE: AGENTS.md:174-179]`
- Overlap: phase `003` because this is partly a command-system UX problem rather than a pure loop-runtime problem.

### Finding F-016 — Add A Machine-Readable Runtime Summary Artifact
- Origin iteration: `iteration-018.md`
- system-spec-kit target: `.opencode/skill/sk-deep-research/references/state_format.md`, reducer/dashboard generation surfaces, future `research/deep-research-runtime.json`
- Priority: should-have
- Refactor verdict: KEEP
- Description: Keep the existing packet architecture, but add one derived machine-readable summary so later automation does not need to parse JSONL and markdown dashboards to assess loop health.
- Evidence: `[SOURCE: external/automated-loop/state_tracker.py:52-60]`, `[SOURCE: external/automated-loop/state_tracker.py:239-260]`, `[SOURCE: .opencode/skill/sk-deep-research/references/state_format.md:15-27]`, `[SOURCE: .opencode/skill/sk-deep-research/references/state_format.md:469-499]`

## 5. Refactor / Pivot Recommendations
- **Dedicated deep-loop controller first.** Phase 2's clearest architectural conclusion is that runtime truth should move out of scattered docs and YAML into a typed controller that owns lifecycle, state writes, and stop reasons.
- **Research packets need a lighter formal profile.** The system already behaves as if deep-loop packets are a distinct packet class; formalizing that class would reduce documentation friction without weakening implementation packets.
- **Keep archival memory, but stop making it a loop primitive.** Packet-local research artifacts should define completion; memory export should be an explicit downstream action.
- **Shift gate enforcement toward profiles and runtime sentinels.** New-work safety should stay strong, but bound continuation and read-only review should not pay the same conversational setup tax.
- **Refactor the orchestrator prompt into prompt plus policy.** Routing tables, budget rules, and dispatch schema should become structured policy rather than remaining embedded in one large prompt.
- **Treat automation semantics as test-owned.** Validators should keep packets clean, while executable tests become the primary source of truth for loop behavior.
- **Flatten the operator surface.** Commands should feel simpler even if the internals remain modular.
- **Add one machine-readable runtime summary.** This is a low-risk improvement that supports the larger controller/testing changes without forcing a redesign first.

## 6. Rejected Recommendations

### Rejection R-001 — Do Not Import Multi-Agent File Locks Into The Current Deep-Research Loop
- Origin iteration: `iteration-005.md`
- Rationale: The external manifest-and-lock stack solves concurrent worker editing, while the current deep-research loop is intentionally leaf-only and serial.
- Evidence: `[SOURCE: external/automated-loop/multi_agent.py:1-10]`, `[SOURCE: external/automated-loop/file_locking.py:95-169]`, `[SOURCE: .opencode/skill/sk-deep-research/references/loop_protocol.md:159-175]`

### Rejection R-002 — Do Not Make Browser Automation A Default Research Dependency
- Origin iteration: `iteration-008.md`
- Rationale: Browser-backed evidence gathering is valuable but belongs to an optional capability layer, not the baseline deep-research runtime.
- Evidence: `[SOURCE: external/mcp-servers/browser-bridge/server.js:95-176]`, `[SOURCE: external/commands/frontend-e2e.md:34-45]`, `[SOURCE: .opencode/command/spec_kit/deep-research.md:196-209]`

### Rejection R-003 — Do Not Replace Global Memory With `.workflow` Files And Handoffs Alone
- Origin iteration: `iteration-019.md`
- Rationale: The external repo's runtime state and handoffs are narrower than `system-spec-kit`'s cross-packet semantic memory problem. Keep the memory platform; only clean up the runtime boundary.
- Evidence: `[SOURCE: external/automated-loop/state_tracker.py:65-77]`, `[SOURCE: external/handoffs/README.md:1-18]`, `[SOURCE: .opencode/skill/system-spec-kit/references/memory/memory_system.md:17-35]`, `[SOURCE: .opencode/skill/system-spec-kit/references/memory/memory_system.md:99-145]`

### Rejection R-004 — Do Not Replace Fresh-Context Research Loops With A Single-Loop Manager Model
- Origin iteration: `iteration-020.md`
- Rationale: The external single-loop orchestrator is a good abstraction for implementation supervision, but it is not a stronger abstraction for packet-local research evidence gathering.
- Evidence: `[SOURCE: external/agents/orchestrator.md:15-23]`, `[SOURCE: external/agents/orchestrator.md:52-67]`, `[SOURCE: .opencode/command/spec_kit/deep-research.md:136-154]`, `[SOURCE: .opencode/skill/sk-deep-research/references/loop_protocol.md:159-175]`

## 7. Priority Queue
1. **Controller + tests together.** Pair Finding F-011 with Finding F-014 so the new runtime contract is executable from day one.
2. **Formalize research-packet minimal mode.** Implement Finding F-009 early so later runtime/controller work is not forced through the wrong packet model.
3. **Decouple loop completion from archival memory.** Apply Finding F-010 once the minimal research-packet profile exists.
4. **Introduce gate profiles and orchestrator policy extraction.** Findings F-012 and F-013 are the next leverage point for operator UX and enforcement clarity.
5. **Add machine-readable runtime summaries.** Finding F-016 is a low-risk enabler for later reporting and controller work.
6. **Leave operator-surface consolidation until after phase `003` alignment work.** Finding F-015 is valuable but should not outrun command-system ownership.

## 8. Cross-Phase Implications
- **Phase `003` overlap:** Findings F-013 and F-015 touch command packaging, public workflow surfaces, and orchestration UX. They should be coordinated with the phase researching command-system ergonomics rather than implemented in isolation.
- **Phase `001` overlap:** The strongest Phase 2 findings are less about agent optimization itself than about runtime control-plane shape, so overlap with phase `001` is limited.
- **Sibling runtime packets:** Findings F-011, F-012, F-014, and F-016 all touch shared deep-loop runtime behavior and should be planned together enough to avoid documentation/runtime drift.
- **Memory and validation packets:** Findings F-010 and F-014 both affect where the system draws the line between loop-state truth, archival memory, and packet governance.

## 9. Recommended Next Step
Open a follow-on implementation packet for a **shared deep-loop runtime contract** that combines:
- F-011: typed controller extraction
- F-014: behavior-first validation pivot
- F-016: machine-readable runtime summary

That packet should explicitly preserve the current fresh-context leaf model (R-004), preserve the global memory platform (R-003), and use F-009/F-010 as boundary constraints so the new controller is built against the right packet model from the start.
