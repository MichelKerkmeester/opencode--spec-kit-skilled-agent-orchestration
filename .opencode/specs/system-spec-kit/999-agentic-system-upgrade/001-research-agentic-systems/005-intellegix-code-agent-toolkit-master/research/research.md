---
title: "Deep Research Report — 005-intellegix-code-agent-toolkit-master"
description: "30-iteration research of Intellegix Code Agent Toolkit patterns for system-spec-kit improvement. Includes Phase 1 adoption findings, Phase 2 refactor/pivot analysis, and Phase 3 UX, agent-system, command, and skill recommendations. 24 actionable findings and 6 rejected recommendations."
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
- Description: Keep archival memory, but stop treating memory export as part of the loop's core completion contract.

### Finding F-011 — Build A First-Class Deep-Loop Controller
- Origin iteration: `iteration-013.md`
- system-spec-kit target: `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`, `.opencode/skill/sk-deep-research/references/loop_protocol.md`
- Priority: must-have
- Refactor verdict: REFACTOR
- Description: Move lifecycle truth out of scattered docs and YAML into a typed runtime controller shared by research and review.

### Finding F-012 — Replace Universal Gate Choreography With Operating Profiles
- Origin iteration: `iteration-014.md`
- system-spec-kit target: `AGENTS.md`, `.opencode/skill/system-spec-kit/constitutional/gate-enforcement.md`, `.opencode/skill/system-spec-kit/constitutional/gate-tool-routing.md`
- Priority: should-have
- Refactor verdict: PIVOT
- Description: Keep strong safety, but stop making every workflow pay the same conversational setup tax. Introduce profiles such as `new-work`, `bound-continuation`, and `read-only-review`.

### Finding F-013 — Decompose The Orchestrator Into Prompt Plus Policy
- Origin iteration: `iteration-015.md`
- system-spec-kit target: `.opencode/agent/orchestrate.md`, `.opencode/skill/system-spec-kit/constitutional/gate-tool-routing.md`
- Priority: should-have
- Refactor verdict: REFACTOR
- Description: Reduce the orchestrator prompt to a decision layer backed by smaller policy surfaces.

### Finding F-014 — Govern Automation Packets With Tests First
- Origin iteration: `iteration-016.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`, future runtime test suites
- Priority: must-have
- Refactor verdict: PIVOT
- Description: Keep validators for packet integrity, but move runtime truth for automation-heavy workflows into executable tests.

### Finding F-015 — Publish A Flatter Operator Surface Over Command Internals
- Origin iteration: `iteration-017.md`
- system-spec-kit target: `.opencode/command/spec_kit/deep-research.md`, `.opencode/command/spec_kit/deep-review.md`
- Priority: nice-to-have
- Refactor verdict: SIMPLIFY
- Description: Keep modular command internals, but generate flatter operator-facing command surfaces.

### Finding F-016 — Add A Machine-Readable Runtime Summary Artifact
- Origin iteration: `iteration-018.md`
- system-spec-kit target: `.opencode/skill/sk-deep-research/references/state_format.md`
- Priority: should-have
- Refactor verdict: KEEP
- Description: Add one derived machine-readable runtime summary so automation does not need to parse JSONL plus markdown dashboards.

### Phase 3 Findings

### Finding F-017 — Merge Lifecycle Commands Into One Profile-Driven Entry Surface
- Origin iteration: `iteration-021.md`
- system-spec-kit target: `.opencode/command/spec_kit/plan.md`, `.opencode/command/spec_kit/implement.md`, `.opencode/command/spec_kit/complete.md`
- Priority: should-have
- UX verdict: MERGE
- Description: Keep separate internal workflows if needed, but stop making `plan`, `implement`, and `complete` the primary public lifecycle split.

### Finding F-018 — Simplify Memory Command Exposure And Hide YAML Internals
- Origin iteration: `iteration-022.md`
- system-spec-kit target: `.opencode/command/spec_kit/*.md`, `.opencode/command/memory/save.md`, `.opencode/command/memory/search.md`
- Priority: should-have
- UX verdict: SIMPLIFY
- Description: Embed common context-load/save behavior into the lifecycle surface and keep YAML assets as an internal implementation detail.

### Finding F-019 — Redesign Spec-Folder UX Around Named Profiles
- Origin iteration: `iteration-023.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/references/templates/level_specifications.md`, `.opencode/skill/system-spec-kit/references/templates/template_guide.md`, `CLAUDE.md`
- Priority: must-have
- UX verdict: REDESIGN
- Description: Keep the current file sets and validators, but replace Level 1/2/3+ as the primary operator metaphor with named work profiles.

### Finding F-020 — Merge The Default Agent Roster Down To A Smaller Core
- Origin iteration: `iteration-024.md`
- system-spec-kit target: `.opencode/agent/orchestrate.md`, `.opencode/agent/context.md`, `.opencode/agent/context-prime.md`, `.opencode/agent/handover.md`
- Priority: should-have
- UX verdict: MERGE
- Description: Preserve truly distinct specialists, but collapse overlapping session-context roles into a smaller default roster.

### Finding F-021 — Merge The Skill Family Into A Smaller Operator Entry Surface
- Origin iteration: `iteration-026.md`
- system-spec-kit target: `.opencode/skill/sk-code-opencode/SKILL.md`, `.opencode/skill/sk-code-web/SKILL.md`, `.opencode/skill/sk-code-full-stack/SKILL.md`, `.opencode/skill/sk-code-review/SKILL.md`
- Priority: should-have
- UX verdict: MERGE
- Description: Extend the existing baseline-plus-overlay idea beyond review workflows so operators see one smaller code-workflow surface instead of many sibling skill identities.

### Finding F-022 — Make Skill Routing Implicit And Demote Niche Skills To Opt-In
- Origin iteration: `iteration-027.md`
- system-spec-kit target: `AGENTS.md`, `.opencode/skill/scripts/skill_advisor.py`, `.opencode/skill/sk-prompt-improver/SKILL.md`, `.opencode/skill/sk-agent-improver/SKILL.md`
- Priority: nice-to-have
- UX verdict: SIMPLIFY
- Description: Keep routing and niche specialist skills, but move them out of the everyday visible path.

### Finding F-023 — Redesign The Gate And Hook Surface Into A Thin Operator Contract
- Origin iteration: `iteration-028.md`
- system-spec-kit target: `CLAUDE.md`, constitutional gate docs, startup/stop hooks
- Priority: must-have
- UX verdict: REDESIGN
- Description: Keep the current automation and policy internals, but publish a much thinner operator brief over them.

### Finding F-024 — Add A Fast Path For Bound Continuation And Small Changes
- Origin iteration: `iteration-029.md`
- system-spec-kit target: `AGENTS.md`, `.opencode/command/spec_kit/implement.md`, `.opencode/command/spec_kit/resume.md`
- Priority: should-have
- UX verdict: ADD
- Description: Add a reduced-friction workflow for already-bound continuation and small deltas so the system stops re-asking and re-framing known state.

## 5. Phase 3 — UX, Agentic System & Skills Analysis

### Command UX
- The core lifecycle is over-fragmented at the public boundary. Internally, `plan`, `implement`, and `complete` are reasonable phases. Externally, they read like three products.
- `/memory:*` adds a second large public family beside `/spec_kit:*`, which makes the system feel bifurcated even though common context actions are part of normal lifecycle work.
- YAML assets are useful internals and a weak public abstraction. Operators should not need to care that markdown owns setup and YAML owns execution.

### Template And Spec-Folder UX
- Spec folders remain valuable because they preserve traceability, scope, and handoff quality.
- The Level 1/2/3+ numbering system is the wrong primary metaphor for operators. Named work profiles are easier to understand and easier to map to risk.
- `validate.sh --strict` and the 14-rule system are strong maintainer tools, but they should be progressively revealed rather than sitting at the center of the everyday UX.

### Sub-Agent Architecture
- The LEAF iteration model for deep research and deep review still solves a real problem and should stay.
- The default roster is too granular around session context handling. Bootstrap, retrieval, and continuation are over-separated compared with the value they provide as public identities.
- The orchestrate-plus-policy stack should trend toward fewer named roles at the shell and more runtime modules under the hood.

### Skills System
- The review stack already shows the best pattern: one baseline plus one overlay. The rest of the skill family should learn from that.
- Code-workflow skills are more fragmented than they need to be for operators.
- `skill_advisor.py` is useful infrastructure, but visible routing ceremony should shrink.
- Specialist skills such as prompt improvement and agent improvement are valid capabilities, but they are advanced tools, not core onboarding concepts.

### Automation And Integration UX
- Hooks, memory, code-graph state, and constitutional routing already form a strong hidden automation substrate.
- The problem is not lack of automation. It is that the operator sees too much of the machinery instead of getting a concise shell over it.
- `CLAUDE.md` in its current size and density is not a sustainable everyday interface for the value it is trying to carry.

### End-To-End Workflow Friction
- The current system asks too many setup questions on already-bound work and makes continuation feel more like a re-initialization than a resume.
- A bound continuation fast path is the clearest UX addition from this phase.

### Phase 3 Verdict Totals
- SIMPLIFY: 2
- ADD: 1
- MERGE: 3
- KEEP: 2
- REDESIGN: 2

## 6. Rejected Recommendations

### Rejection R-001 — Do Not Import Multi-Agent File Locks Into The Current Deep-Research Loop
- Origin iteration: `iteration-005.md`
- Rationale: The external manifest-and-lock stack solves concurrent worker editing, while the current deep-research loop is intentionally leaf-only and serial.

### Rejection R-002 — Do Not Make Browser Automation A Default Research Dependency
- Origin iteration: `iteration-008.md`
- Rationale: Browser-backed evidence gathering is useful but belongs to an optional capability layer, not the baseline deep-research runtime.

### Rejection R-003 — Do Not Replace Global Memory With `.workflow` Files And Handoffs Alone
- Origin iteration: `iteration-019.md`
- Rationale: The external repo's runtime state and handoffs are narrower than the local cross-packet semantic memory problem.

### Rejection R-004 — Do Not Replace Fresh-Context Research Loops With A Single-Loop Manager Model
- Origin iteration: `iteration-020.md`
- Rationale: The external single-loop orchestrator is a strong implementation supervisor, not a better packet-local research abstraction.

### Rejection R-005 — Do Not Replace LEAF Research And Review Loops With Generic Roles
- Origin iteration: `iteration-025.md`
- Rationale: The local LEAF iteration pattern solves packet-local evidence, reducer synchronization, and bounded write-scope problems that the external generic roles do not.

### Rejection R-006 — Do Not Copy External Minimalism Literally By Deleting The Local Capability Core
- Origin iteration: `iteration-030.md`
- Rationale: The external repo is simpler because it solves a narrower problem. `system-spec-kit` should thin the shell, not delete hooks, memory, spec packets, and loop capabilities that still add value.

## 7. Combined Recommendation Stack

### Immediate Architecture And Runtime
1. Pair Finding F-011 with Finding F-014 so the new deep-loop controller ships with runtime-first tests.
2. Preserve the fresh-context LEAF model and the broader memory platform as hard constraints while refactoring the runtime around them.
3. Add the machine-readable runtime summary once the controller boundary is stable.

### Immediate UX And Operator Surface
1. Treat Finding F-019 and Finding F-023 as the main shell redesign: named work profiles plus a thin operator contract.
2. Use Findings F-017 and F-018 to collapse the lifecycle and memory surfaces into a smaller public entry set.
3. Apply Finding F-024 early so bound continuation and small work can benefit immediately from shell simplification.

### Next-Order System Cleanup
1. Apply Finding F-020 to shrink the default agent roster without touching the specialized LEAF research and review roles.
2. Apply Findings F-021 and F-022 so the skill system becomes smaller at the surface while keeping routing and overlays internally.

## 8. Cross-Phase Implications
- Phase 1 proved that the deep-loop runtime wants stronger controller and test ownership.
- Phase 2 proved that safety and validation need different operating profiles instead of universal choreography.
- Phase 3 proved that most remaining pain is at the shell: commands, profiles, agent/skill naming, and visible gate machinery.
- The correct roadmap is therefore "runtime contract first, shell simplification immediately after," not either one in isolation.

## 9. Recommended Next Step
Open a follow-on implementation packet for a **profile-driven operator shell over the existing capability core** with this scope:
- Named work profiles replacing direct Level 1/2/3+ language at the primary entry surface
- A thin runtime brief replacing most operator-facing gate and policy exposition
- Merged public lifecycle and memory entry surfaces
- A fast continuation profile for already-bound work

That packet should explicitly preserve:
- the typed deep-loop controller and behavior-first testing direction from Phase 2
- the LEAF research/review iteration model
- the broader memory and hook automation core

The guiding principle after all 30 iterations is:

> `system-spec-kit` should become simpler where users touch it, not simpler by becoming less capable.
