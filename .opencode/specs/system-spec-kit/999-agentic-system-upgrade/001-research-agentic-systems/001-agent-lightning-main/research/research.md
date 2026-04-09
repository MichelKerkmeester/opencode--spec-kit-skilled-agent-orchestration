---
title: "Deep Research Report — 001-agent-lightning-main"
description: "10-iteration research of Agent Lightning for system-spec-kit improvement opportunities. 7 actionable findings, 3 rejected."
importance_tier: "important"
contextType: "research"
---

# Deep Research Report — 001-agent-lightning-main

## 1. Executive Summary
- External repo: Agent Lightning, a Microsoft Research framework for optimizing existing agents through tracing, reward capture, adapters, and trainer or store orchestration rather than agent rewrites. [SOURCE: external/README.md:20-23] [SOURCE: external/README.md:65-67]
- Iterations executed: 10 of 10
- Stop reason: max_iterations
- Total actionable findings: 7
- Must-have: 1 | Should-have: 5 | Nice-to-have: 1 | Rejected: 3
- Top 3 adoption opportunities for system-spec-kit:
  - Enrich deep-research and deep-review dashboards with explicit operational metrics rather than sparse iteration counts alone. [SOURCE: external/agentlightning/store/base.py:75-101] [SOURCE: .opencode/command/spec_kit/deep-research.md:263-269]
  - Add a smaller attempt-lifecycle vocabulary for long-running loops so stuck, timeout, and recovery states are explicit. [SOURCE: external/docs/deep-dive/store.md:22-72] [SOURCE: .opencode/command/spec_kit/deep-research.md:147-155]
  - Introduce an optional structured evaluator payload so Public can capture richer judgment than `wasUseful` plus confidence counters. [SOURCE: external/agentlightning/emitter/reward.py:148-210] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:297-316]

This phase did not execute the external runtime. The evidence comes from static source analysis of the bundled Agent Lightning repository plus direct comparison against existing `system-spec-kit`, command, and agent contracts. CocoIndex was attempted first, per the phase brief, but the daemon was unavailable in this checkout, so the investigation fell back to direct file reads, `rg`, and line-numbered inspection. That fallback did not block the research because the target questions were all interface- and architecture-level.

## 2. External Repo Map

### Structure
- `agentlightning/tracer/` — tracer contracts and runtime instrumentation surfaces
- `agentlightning/store/` — rollout, attempt, span, worker, and resource control plane
- `agentlightning/adapter/` — transformations from raw traces to downstream payloads
- `agentlightning/trainer/` — orchestration that wires algorithm, runner, store, tracer, hooks, and optional proxy
- `agentlightning/algorithm/` — pluggable learning strategies
- `agentlightning/litagent/` — agent-facing rollout contract
- `examples/` — concrete integrations such as Claude Code and Tinker
- `docs/` — architecture, tutorials, and operational explanations

### Core Architecture
- Agent Lightning keeps agents in their native runtime and captures execution through tracer or emit helpers. [SOURCE: external/README.md:65-69]
- The store is the shared hub for rollouts, attempts, spans, workers, and resources. [SOURCE: external/docs/deep-dive/store.md:3-20]
- Adapters convert stored spans into learning-ready payloads such as triplets. [SOURCE: external/docs/deep-dive/birds-eye-view.md:312-317]
- The Trainer connects runner-side and algorithm-side bundles while allowing algorithm choice and execution strategy choice to vary. [SOURCE: external/docs/deep-dive/birds-eye-view.md:368-372] [SOURCE: external/agentlightning/trainer/trainer.py:36-58]

### ASCII Diagram
```text
Agent / Runner
  -> Tracer + Hook callbacks
  -> Span + Reward emission
  -> LightningStore
       -> Rollouts / Attempts / Workers / Resources / Spans
  -> Adapter
       -> Triplets / Messages / other normalized payloads
  -> Algorithm
       -> Updated resources, policies, prompts
  -> Trainer
       -> reconnects updates back to runners
```

### Public Comparison Map
- `.opencode/agent/orchestrate.md` — role taxonomy, delegation model, and single-hop orchestration
- `.opencode/agent/deep-research.md` and `.opencode/agent/deep-review.md` — iteration contracts and externalized-state loops
- `.opencode/command/spec_kit/deep-research.md` and `.opencode/command/spec_kit/deep-review.md` — command-level loop managers
- `.opencode/skill/system-spec-kit/mcp_server/` — feedback, scoring, dashboards, and resume surfaces
- `.opencode/skill/system-spec-kit/references/config/hook_system.md` — runtime hook scope
- `.opencode/skill/system-spec-kit/references/templates/` — canonical template source-of-truth model

## 3. Findings Registry

### Finding F-001 — Backend-Agnostic Tracer Contract
- Origin iteration: `iteration-001.md`
- system-spec-kit target: `.opencode/agent/orchestrate.md`
- Priority: should-have
- Action: prototype later
- Overlap risk: low with phase 005; this is about observability seams, not generic orchestration
- Description: Agent Lightning demonstrates that a narrow trace context plus canonical span envelope can sit around existing agent workflows without rewriting the agent contracts. Public has no equivalent runtime trace seam today, so this should stay a prototype-later idea until there is a clear trace consumer and store boundary.
- Evidence: [SOURCE: external/agentlightning/tracer/base.py:27-39] [SOURCE: external/agentlightning/types/tracer.py:213-248] [SOURCE: .opencode/agent/orchestrate.md:24-36] [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:61-73]

### Finding F-002 — Attempt Lifecycle For Long-Running Loops
- Origin iteration: `iteration-002.md`
- system-spec-kit target: `.opencode/command/spec_kit/deep-research.md`
- Priority: should-have
- Action: prototype later
- Overlap risk: medium with phase 005, but the retained value here is operational status vocabulary, not new loop topology
- Description: Agent Lightning's clearest control-plane contribution is its attempt model: preparing, running, timeout, unresponsive, retry, and recovery are explicit. Public's deep loops already exist, but they would benefit from a smaller version of that operational vocabulary for overnight runs and recovery diagnostics.
- Evidence: [SOURCE: external/docs/deep-dive/store.md:22-72] [SOURCE: external/agentlightning/types/core.py:174-207] [SOURCE: .opencode/command/spec_kit/deep-research.md:147-155] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:191-249]

### Finding F-003 — Structured Evaluator Payloads
- Origin iteration: `iteration-003.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
- Priority: should-have
- Action: prototype later
- Overlap risk: low; this improves validation richness rather than orchestration
- Description: Agent Lightning captures reward as a first-class span artifact, including ordered multi-dimensional rewards. Public's current evaluator surfaces reduce immediately to `wasUseful`, confidence tiers, and promotion counts. A better fit for Public is an optional structured evaluator payload that can later be reduced into the existing confidence and promotion machinery.
- Evidence: [SOURCE: external/agentlightning/emitter/reward.py:148-210] [SOURCE: external/agentlightning/runner/agent.py:293-314] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:19-45] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:297-316]

### Finding F-004 — Reducer Adapter Boundary
- Origin iteration: `iteration-004.md`
- system-spec-kit target: `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- Priority: should-have
- Action: prototype later
- Overlap risk: low; this concerns machine-owned state normalization, not user-facing loop behavior
- Description: Agent Lightning's adapter seam prevents downstream consumers from coupling directly to raw traces. Public has reducer-owned registries and dashboards, but it does not yet advertise a stable normalization contract between raw iteration artifacts and those machine-owned outputs. Introducing that seam would make future dashboards and evaluators easier to evolve safely.
- Evidence: [SOURCE: external/agentlightning/adapter/base.py:13-20] [SOURCE: external/agentlightning/adapter/triplet.py:702-758] [SOURCE: .opencode/agent/deep-research.md:159-165] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:79-89]

### Finding F-005 — Component Registry As Future Guardrail
- Origin iteration: `iteration-005.md`
- system-spec-kit target: `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- Priority: nice-to-have
- Action: prototype later
- Overlap risk: medium with phase 005 because this starts touching generic loop-driver architecture
- Description: Agent Lightning's Trainer resolves algorithms, stores, tracers, adapters, strategies, and hooks as separate pluggable components. Public does not need that level of abstraction today, but if multiple reducers or evaluator backends appear later, a small registry would be safer than cloning whole loop workflows.
- Evidence: [SOURCE: external/agentlightning/trainer/trainer.py:36-58] [SOURCE: external/agentlightning/trainer/trainer.py:120-145] [SOURCE: .opencode/command/spec_kit/deep-research.md:147-173] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:64-89]

### Finding F-006 — Stable Agent-Role Labeling For Targeted Evaluation
- Origin iteration: `iteration-006.md`
- system-spec-kit target: `.opencode/agent/orchestrate.md`
- Priority: should-have
- Action: prototype later
- Overlap risk: intentionally bounded against phase 005; keep only traceable role labeling, not new multi-agent orchestration
- Description: Agent Lightning's selective optimization works because agent identity survives into the adapter layer and can be filtered with `agent_match`. Public already has rich role taxonomy in orchestration, but not stable machine-readable agent-role labels flowing into evaluation artifacts. Adding those labels would enable targeted analysis later without reworking the orchestrator.
- Evidence: [SOURCE: external/agentlightning/adapter/triplet.py:317-359] [SOURCE: external/docs/how-to/train-sql-agent.md:234-239] [SOURCE: .opencode/agent/orchestrate.md:95-117] [SOURCE: .opencode/agent/deep-research.md:167-189]

### Finding F-008 — Richer Loop Metrics And Dashboards
- Origin iteration: `iteration-008.md`
- system-spec-kit target: `.opencode/command/spec_kit/deep-research.md`
- Priority: must-have
- Action: adopt now
- Overlap risk: low; this strengthens existing loop observability rather than changing architecture
- Description: Agent Lightning makes counts, liveness, and timing explicit. Public already owns deep-loop dashboards and a trend-reporting module, but its research and review loops still expose a thin operational vocabulary. Adding standard loop metrics such as source diversity, no-signal streak, files read, duration, and blocked-approach counts is the highest-confidence, lowest-risk improvement from this phase.
- Evidence: [SOURCE: external/agentlightning/store/base.py:75-101] [SOURCE: external/docs/deep-dive/store.md:74-82] [SOURCE: external/examples/tinker/agl_tinker/train.py:162-176] [SOURCE: .opencode/agent/deep-research.md:167-189] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:59-112]

## 4. Rejected Recommendations

### Rejection R-001 — Merge execution wrappers into the existing hook system
- Origin iteration: `iteration-007.md`
- Rationale: Agent Lightning's wrappers instrument live execution, while Public's hooks are explicitly scoped to context preservation and recovery. Combining them would overload a subsystem whose current value comes from staying narrow and understandable.
- Target kept unchanged: `.opencode/skill/system-spec-kit/references/config/hook_system.md`
- Evidence: [SOURCE: external/examples/claude_code/README.md:5-12] [SOURCE: external/agentlightning/litagent/litagent.py:45-50] [SOURCE: .opencode/skill/system-spec-kit/references/config/hook_system.md:3-6] [SOURCE: .opencode/skill/system-spec-kit/references/config/hook_system.md:48-57]

### Rejection R-002 — Store-backed resource snapshots for spec templates
- Origin iteration: `iteration-009.md`
- Rationale: Agent Lightning's resource snapshots exist because prompts and endpoints are tunable optimization inputs. Public's templates are canonical documentation contracts with composition and validation rules. Converting them into runtime resources would add complexity without matching value.
- Target kept unchanged: `.opencode/skill/system-spec-kit/references/templates/template_guide.md`
- Evidence: [SOURCE: external/agentlightning/types/resources.py:146-204] [SOURCE: external/docs/tutorials/write-agents.md:132-145] [SOURCE: .opencode/skill/system-spec-kit/references/templates/template_guide.md:27-34] [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:38-47]

### Rejection R-003 — Generic loop-architecture changes in this phase
- Origin iteration: `iteration-010.md`
- Rationale: Public already has mature orchestrator and iterative-loop contracts. Pulling generic loop architecture from Agent Lightning into this phase would duplicate existing strengths and blur the boundary with phase 005. The retained value from this repo is the RL-specific layer: observability, evaluator richness, and targeted analysis.
- Target kept unchanged: `.opencode/agent/orchestrate.md`
- Evidence: [SOURCE: external/docs/deep-dive/birds-eye-view.md:368-372] [SOURCE: .opencode/agent/orchestrate.md:24-36] [SOURCE: .opencode/command/spec_kit/deep-research.md:147-155] [SOURCE: .opencode/command/spec_kit/deep-review.md:162-169]

## 5. Cross-Phase Implications
- Phase 005 overlap is real whenever the discussion shifts from trace, reward, and targeted evaluation into general loop-manager or multi-agent topology. This report therefore keeps only the RL-specific layer from Agent Lightning and rejects generic loop imports. [SOURCE: external/README.md:20-23] [SOURCE: .opencode/agent/orchestrate.md:24-36]
- If a follow-on packet is opened from this phase, it should stay narrowly scoped to one of these categories:
  - Deep-loop metrics and dashboard enrichment
  - Structured evaluator payloads
  - Attempt lifecycle vocabulary for long-running loops
  - Optional role-label projection for future targeted evaluation
- A follow-on packet should not claim to redesign Public's orchestrator or general multi-agent loop architecture on the basis of this repo alone.

## 6. Recommended Next Step
Plan the first follow-on packet around richer deep-loop metrics and dashboard fields, anchored in `.opencode/command/spec_kit/deep-research.md` and the reducer-owned dashboard surfaces. It has the best cost-to-value ratio from this phase: Public already has the loop system, state files, and reporting primitives, so adding a stronger metric vocabulary is an incremental improvement rather than a speculative architecture bet. After that, the next strongest prototype packet would be structured evaluator payloads for `memory_validate`.
