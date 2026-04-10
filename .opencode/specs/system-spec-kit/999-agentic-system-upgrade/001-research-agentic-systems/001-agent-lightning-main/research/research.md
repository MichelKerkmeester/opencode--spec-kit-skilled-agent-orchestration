---
title: "Deep Research Report — 001-agent-lightning-main"
description: "20-iteration research of Agent Lightning for system-spec-kit improvement, simplification, and architectural boundary decisions. 15 actionable findings, 5 rejected."
importance_tier: "important"
contextType: "research"
---

# Deep Research Report — 001-agent-lightning-main

## 1. Executive Summary
- External repo: Agent Lightning, a Microsoft Research framework for training and optimizing existing agents through tracing, stores, adapters, algorithms, and operator-facing examples rather than agent rewrites. [SOURCE: external/README.md:9-12] [SOURCE: external/agentlightning/store/base.py:104-124]
- Iterations executed: 20 of 20
- Stop reason: max_iterations
- Combined actionable findings: 15
- Combined totals: Must-have 3 | Should-have 10 | Nice-to-have 2 | Rejected 5
- Phase 2 totals: Must-have 2 | Should-have 5 | Nice-to-have 1 | Rejected 2
- Phase 2 refactor/pivot verdicts: REFACTOR 3 | PIVOT 1 | SIMPLIFY 2 | KEEP 4
- Highest-confidence next moves for `system-spec-kit` after Phase 2:
  - Keep Gate 3 explicit, but move Gate 1 and routine Gate 2 behavior behind runtime defaults so operators see fewer ceremonies. [SOURCE: external/AGENTS.md:11-16] [SOURCE: AGENTS.md:159-186]
  - Refactor `validate.sh` into composable validators with a compatibility wrapper rather than continuing to concentrate so much behavior in one script. [SOURCE: external/AGENTS.md:11-16] [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:611-633]
  - Simplify the operator-facing command and tool surface into clearer capability profiles and fewer primary entrypoints. [SOURCE: external/agentlightning/cli/__init__.py:12-31] [SOURCE: .opencode/skill/system-spec-kit/references/memory/memory_system.md:95-140]
  - Refactor deep-loop runtime state so readiness, block, timeout, recovery, and finalization become first-class reducer signals rather than mostly post-hoc summaries. [SOURCE: external/agentlightning/utils/server_launcher.py:73-84] [SOURCE: .opencode/agent/deep-research.md:167-200]

Phase 1 established that Agent Lightning offers real value at the RL-specific layer: richer evaluator payloads, stronger loop metrics, better adapter boundaries, and useful attempt-state vocabulary. Phase 2 widened the question from "what should Public adopt?" to "what parts of Public are overbuilt, misfactored, or aimed at the wrong UX?" The answer is not a wholesale pivot. The external repo mostly validates Public's mission-specific core while exposing several places where its operator surface and validator/runtime implementations have become heavier than they need to be.

This phase again attempted CocoIndex first for deeper repo exploration, but semantic searches against the vendored external repo timed out in this checkout. The deeper pass therefore used line-numbered direct file reads plus exact searches. That fallback was sufficient because the Phase 2 questions centered on architecture, failure modes, packaging, and docs philosophy rather than hidden implementation branches.

## 2. Research Expansion In Phase 2

Phase 2 intentionally moved beyond the Phase 1 adoption lens. The new research focused on:
- Refactor questions about where `system-spec-kit` is overcomplicated or misfactored
- Pivot questions about whether Gate 1/2/3, Level 1/2/3+, and the command/tool surface are the right product shape
- Simplification questions about user-visible ceremony, role taxonomy, and capability sprawl
- Architecture questions about deep-loop runtime state, validator structure, and memory boundaries
- UX questions about documentation navigation and the difference between internal authoring models and public/operator-facing surfaces

The external signals that mattered most in Phase 2 were:
- Compact public entrypoints
- Audience-based documentation
- Standard-tool validation
- Explicit runtime readiness/error handling
- Optional capability grouping
- The absence of repo-local governance machinery equivalent to Public's packets, constitutional memory, and conversational gates

## 3. External Repo Map

### Structure
- `agentlightning/` — adapters, execution stack, training loop, tracer, reward logic, store, utilities, and CLI surfaces [SOURCE: external/AGENTS.md:6-9]
- `docs/` — task-oriented docs organized as quickstart, how-to, deep dive, and references [SOURCE: external/mkdocs.yml:98-138] [SOURCE: external/docs/index.md:14-23]
- `examples/` — runnable examples with Included Files sections and CI-backed catalog coverage [SOURCE: external/examples/README.md:7-18] [SOURCE: external/examples/claude_code/README.md:33-47]
- `tests/` — mirrored runtime coverage with markers and real-object preference [SOURCE: external/AGENTS.md:27-31]

### Core Architecture
- Agent Lightning keeps agents in their native runtime and captures execution through tracer or emit helpers. [SOURCE: external/README.md:9-12]
- `LightningStore` coordinates rollout lifecycle, attempts, spans, and resources. [SOURCE: external/agentlightning/store/base.py:104-124]
- Adapters bridge raw traces into downstream payloads rather than coupling algorithms directly to raw spans. [SOURCE: external/agentlightning/adapter/base.py:13-20]
- The public CLI stays small even though the runtime is broad. [SOURCE: external/pyproject.toml:50-53] [SOURCE: external/agentlightning/cli/__init__.py:12-31]

### Public Comparison Map
- `AGENTS.md` — mandatory gates, spec-folder binding, workflow matrix, and agent routing
- `.opencode/agent/orchestrate.md` — named-agent taxonomy, delegation rules, and depth constraints
- `.opencode/agent/deep-research.md` — iteration contract, JSONL state model, and reducer ownership
- `.opencode/command/spec_kit/deep-research.md` — loop manager setup, YAML handoff, memory integration, and error handling
- `.opencode/skill/system-spec-kit/references/templates/level_specifications.md` — Level 1/2/3+ lifecycle and phase overlay
- `.opencode/skill/system-spec-kit/references/memory/memory_system.md` — memory architecture and 43-tool surface
- `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` — validator orchestration entrypoint

## 4. Findings Registry — Phase 1

### Finding F-001 — Backend-Agnostic Tracer Contract
- Origin iteration: `iteration-001.md`
- system-spec-kit target: `.opencode/agent/orchestrate.md`
- Priority: should-have
- Action: prototype later
- Description: Agent Lightning demonstrates a narrow trace seam that could eventually wrap existing Public workflows without rewriting prompt contracts. [SOURCE: external/agentlightning/tracer/base.py:27-39] [SOURCE: .opencode/agent/orchestrate.md:24-36]

### Finding F-002 — Attempt Lifecycle For Long-Running Loops
- Origin iteration: `iteration-002.md`
- system-spec-kit target: `.opencode/command/spec_kit/deep-research.md`
- Priority: should-have
- Action: prototype later
- Description: Public should borrow a smaller execution-state vocabulary from Agent Lightning's attempt lifecycle rather than its full store/control plane. [SOURCE: external/docs/deep-dive/store.md:22-72] [SOURCE: .opencode/command/spec_kit/deep-research.md:147-155]

### Finding F-003 — Structured Evaluator Payloads
- Origin iteration: `iteration-003.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
- Priority: should-have
- Action: prototype later
- Description: Reward-as-span patterns justify an optional structured evaluator payload that can later be reduced into current confidence and validation machinery. [SOURCE: external/agentlightning/emitter/reward.py:148-210] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:297-316]

### Finding F-004 — Reducer Adapter Boundary
- Origin iteration: `iteration-004.md`
- system-spec-kit target: `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- Priority: should-have
- Action: prototype later
- Description: Public should formalize a stable normalization seam between raw deep-loop artifacts and reducer-owned outputs. [SOURCE: external/agentlightning/adapter/base.py:13-20] [SOURCE: .opencode/agent/deep-research.md:159-165]

### Finding F-005 — Component Registry As Future Guardrail
- Origin iteration: `iteration-005.md`
- system-spec-kit target: `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- Priority: nice-to-have
- Action: prototype later
- Description: A small component registry becomes useful only if Public grows multiple loop backends or evaluator implementations. [SOURCE: external/agentlightning/trainer/trainer.py:36-58] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:64-89]

### Finding F-006 — Stable Agent-Role Labeling For Targeted Evaluation
- Origin iteration: `iteration-006.md`
- system-spec-kit target: `.opencode/agent/orchestrate.md`
- Priority: should-have
- Action: prototype later
- Description: Public should project stable delegated-role labels into machine-owned artifacts if it wants future targeted evaluation without new orchestration machinery. [SOURCE: external/agentlightning/adapter/triplet.py:317-359] [SOURCE: .opencode/agent/orchestrate.md:95-117]

### Finding F-008 — Richer Loop Metrics And Dashboards
- Origin iteration: `iteration-008.md`
- system-spec-kit target: `.opencode/command/spec_kit/deep-research.md`
- Priority: must-have
- Action: adopt now
- Description: Operational metrics such as liveness, source diversity, blocked approaches, and duration are the highest-confidence, lowest-risk adoption from this repo. [SOURCE: external/agentlightning/store/base.py:75-101] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:59-112]

## 5. Findings Registry — Phase 2

### Finding F-009 — Smaller Operator Front Door
- Origin iteration: `iteration-011.md`
- system-spec-kit target: operator-facing command/docs surface
- Priority: should-have
- Action: simplify
- Description: Public should stop exposing so much internal topology directly to operators. A smaller front door plus progressive disclosure would better match the external repo's UX strengths. [SOURCE: external/agentlightning/cli/__init__.py:12-31] [SOURCE: .opencode/skill/system-spec-kit/references/memory/memory_system.md:95-140]

### Finding F-010 — Composable Validation Architecture
- Origin iteration: `iteration-012.md`
- system-spec-kit target: `scripts/spec/validate.sh`
- Priority: must-have
- Action: refactor
- Description: Keep strict validation, but decompose it into explicit validator categories behind a compatibility wrapper instead of continuing to centralize so much behavior in one script. [SOURCE: external/AGENTS.md:11-16] [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:611-633]

### Finding F-011 — Deep-Loop Runtime State Machine
- Origin iteration: `iteration-013.md`
- system-spec-kit target: deep-loop runtime and reducer state
- Priority: should-have
- Action: refactor
- Description: Public should add explicit readiness, blocked, recovery, and finalization state to deep-loop runtime coordination, not just historical JSONL summaries. [SOURCE: external/agentlightning/utils/server_launcher.py:73-84] [SOURCE: .opencode/agent/deep-research.md:167-200]

### Finding F-012 — Gate 1/2 Should Become Runtime Defaults
- Origin iteration: `iteration-014.md`
- system-spec-kit target: gate model and runtime enforcement
- Priority: must-have
- Action: pivot
- Description: Keep Gate 3 explicit because it binds scope and documentation, but move Gate 1 and routine Gate 2 behavior behind runtime enforcement so operators see decisions, not ceremonies. [SOURCE: external/AGENTS.md:11-16] [SOURCE: AGENTS.md:159-186]

### Finding F-013 — Separate Authoring Levels From Reader Navigation
- Origin iteration: `iteration-015.md`
- system-spec-kit target: template/publishing architecture
- Priority: nice-to-have
- Action: keep current internal model, add public docs layer
- Description: Public should keep Level 1/2/3+ for authoring and coordination, but publish operator-facing guidance in audience-based categories like quickstart/how-to/reference. [SOURCE: external/docs/index.md:14-23] [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:48-73]

### Finding F-014 — Simplify Agent Architecture Around Capabilities
- Origin iteration: `iteration-017.md`
- system-spec-kit target: `.opencode/agent/orchestrate.md`
- Priority: should-have
- Action: simplify
- Description: Public's named-agent taxonomy is starting to encode workflow history as permanent topology; it should be rationalized around a smaller set of capability classes. [SOURCE: external/AGENTS.md:3-9] [SOURCE: .opencode/agent/orchestrate.md:93-118]

### Finding F-015 — Capability Profiles For Tool And Command Exposure
- Origin iteration: `iteration-018.md`
- system-spec-kit target: command/tool exposure model
- Priority: should-have
- Action: refactor
- Description: The system should define clearer `core` versus advanced capability profiles so users do not need to hold the whole 43-tool surface in mind by default. [SOURCE: external/pyproject.toml:30-49] [SOURCE: .opencode/skill/system-spec-kit/references/memory/memory_system.md:95-140]

### Finding F-016 — Keep Core Governance, Simplify The Edges
- Origin iteration: `iteration-020.md`
- system-spec-kit target: overall product direction
- Priority: should-have
- Action: keep core architecture, simplify edges
- Description: Agent Lightning validates that Public's mission is different enough to justify spec folders, file-first memory, and explicit scope binding. The right move is selective simplification, not wholesale imitation. [SOURCE: external/AGENTS.md:3-16] [SOURCE: AGENTS.md:159-186]

## 6. Rejected Recommendations

### Rejection R-001 — Merge Execution Wrappers Into The Existing Hook System
- Origin iteration: `iteration-007.md`
- Rationale: execution observability and session-context hooks are different layers and should remain separate. [SOURCE: external/examples/claude_code/README.md:5-12] [SOURCE: .opencode/skill/system-spec-kit/references/config/hook_system.md:3-6]

### Rejection R-002 — Store-Backed Resource Snapshots For Templates
- Origin iteration: `iteration-009.md`
- Rationale: Public's templates are canonical documentation contracts, not tunable runtime resource snapshots. [SOURCE: external/agentlightning/types/resources.py:146-204] [SOURCE: .opencode/skill/system-spec-kit/references/templates/template_guide.md:27-34]

### Rejection R-003 — Generic Loop-Architecture Adoption In This Phase
- Origin iteration: `iteration-010.md`
- Rationale: generic multi-agent loop redesign belongs with phase 005, not this RL-specific research packet. [SOURCE: external/docs/deep-dive/birds-eye-view.md:368-372] [SOURCE: .opencode/agent/orchestrate.md:24-36]

### Rejection R-004 — Store-Centric Memory Pivot
- Origin iteration: `iteration-016.md`
- Rationale: Public's file-first memory architecture remains better suited to auditability and spec-folder-local context. [SOURCE: external/agentlightning/store/base.py:104-124] [SOURCE: .opencode/skill/system-spec-kit/references/memory/memory_system.md:17-27]

### Rejection R-005 — Reflective CLI Config For Core Workflows
- Origin iteration: `iteration-019.md`
- Rationale: Agent Lightning's own caveats show that reflective config generation is too brittle for high-governance operator commands. [SOURCE: external/agentlightning/config.py:3-7] [SOURCE: external/tests/test_config.py:5-10]

## 7. Refactor / Pivot Recommendations

| Recommendation | Phase 2 Finding | Verdict | Priority | Why It Matters |
|---|---|---|---|---|
| Simplify the operator front door | F-009 | SIMPLIFY | should-have | Users should not need to understand internal topology to get work done |
| Break `validate.sh` into composable validators | F-010 | REFACTOR | must-have | Strict validation stays; implementation becomes easier to evolve and observe |
| Add explicit attempt/runtime state to deep loops | F-011 | REFACTOR | should-have | Long unattended runs need better active-state visibility and recovery |
| Move Gate 1/2 behind runtime defaults | F-012 | PIVOT | must-have | Preserve safety while reducing ceremony and operator anxiety |
| Publish docs by audience while keeping levels internally | F-013 | KEEP | nice-to-have | Public reading UX can improve without deleting authoring structure |
| Rationalize named agents around core capabilities | F-014 | SIMPLIFY | should-have | Reduce architectural sprawl and make routing easier to reason about |
| Introduce capability profiles for command/tool exposure | F-015 | REFACTOR | should-have | Give operators a smaller default surface and clearer rollout boundaries |
| Keep core governance, simplify only the edges | F-016 | KEEP | should-have | Avoid false pivots that erase the product's real differentiation |

## 8. Priority Queue

1. **Adopt richer deep-loop metrics immediately** from Phase 1 (`F-008`). It is the best cost-to-value improvement and strengthens every later refactor.
2. **Pivot Gate 1/2 toward runtime defaults** (`F-012`) while preserving explicit Gate 3 scope binding.
3. **Refactor validation architecture** (`F-010`) so strictness survives but the implementation stops acting like one giant shell monolith.
4. **Simplify the operator-facing command and tool surface** (`F-009`, `F-015`) with canonical entrypoints and capability profiles.
5. **Refactor deep-loop runtime state** (`F-011`) so resume, recovery, and blocked-run diagnostics become first-class.
6. **Prototype structured evaluator payloads** from Phase 1 (`F-003`) once metrics and runtime-state vocabulary are stronger.
7. **Standardize machine-readable role labels and rationalize role taxonomy** (`F-006`, `F-014`) before adding any new agent classes.
8. **Keep memory file-first and governance packet-first** (`R-004`, `F-016`) while improving adapters and publishable UX layers rather than replacing the architecture.

## 9. Combined Recommendation Summary

### Adopt Now
- Richer loop metrics and dashboard signals (`F-008`)

### Prototype / Refactor Next
- Smaller operator front door (`F-009`)
- Composable validator architecture (`F-010`)
- Deep-loop runtime state machine (`F-011`)
- Gate 1/2 runtime-default pivot (`F-012`)
- Structured evaluator payloads (`F-003`)
- Stable role labeling and capability-profile exposure (`F-006`, `F-015`)
- Agent taxonomy simplification (`F-014`)

### Keep Current Direction
- Internal Level 1/2/3+ authoring model (`F-013`)
- File-first memory architecture (`R-004`)
- Core spec-folder and scope-binding mission (`F-016`)

### Reject
- Hook-system merge with execution wrappers (`R-001`)
- Template/resource snapshot pivot (`R-002`)
- Generic loop redesign in this phase (`R-003`)
- Reflective CLI config for core operator flows (`R-005`)

## 10. Follow-On Packet Suggestions

- **Gate simplification packet:** keep Gate 3 explicit; move Gate 1 and routine Gate 2 into runtime defaults and clarify escalation points.
- **Validation architecture packet:** split `validate.sh` into category validators with wrapper parity and machine-readable outputs.
- **Operator surface packet:** define canonical entrypoints and capability profiles for commands and MCP tools.
- **Deep-loop runtime packet:** add reducer-owned attempt state, readiness, recovery, and active-health transitions.
- **Docs publication packet:** derive an audience-based public/operator docs layer from internal level-based authoring artifacts.
