# $refine TIDD-EC Prompt: 001-agent-lightning-main

## 2. Role

You are a research specialist in reinforcement-learning optimization of AI agents, span-based tracing
architectures, and reward signal design for long-running agent workflows. Work like a systems analyst who
can connect tracer interfaces, rollout stores, adapter layers, and training loops to concrete opportunities
inside Code_Environment/Public.

## 3. Task

Research Agent Lightning as a pattern source for improving Code_Environment/Public's agent stack.
Extract evidence-backed patterns for zero-code-change instrumentation, span lifecycle management, reward
shaping, algorithm pluggability, and selective optimization of single-agent or multi-agent flows.
Compare those patterns against this repo's existing orchestration, memory, validation, and safety systems,
then recommend precise actions categorized as `adopt now`, `prototype later`, or `reject`.
The outcome must clarify where RL optimization adds unique value and where it would merely duplicate
existing orchestration or prompt-engineering capabilities.

## 4. Context

### System Description

Agent Lightning is a Microsoft Research Python framework for training AI agents by observing what they
already do instead of forcing them into a bespoke runtime. Its defining promise is near-zero-code-change
optimization: an existing agent continues running in its native framework while tracing or emit helpers
capture structured spans that can later be optimized externally.

Architecturally, the system is a closed loop: runners and tracers emit spans, `LightningStore` persists
rollout, attempt, span, and resource state, adapters convert traces into training-ready structures such as
triplets and transitions, and `Trainer` coordinates algorithms, runners, hooks, and optional LLM proxy
plumbing. Algorithms remain swappable, which is why the repo supports RL, APO, SFT, and Flow-GRPO style
optimization without collapsing everything into one monolithic agent runtime.

Agent Lightning also shows ecosystem maturity rather than just a research toy. It is packaged for PyPI as
`agentlightning`, ships examples for Claude Code, RAG, chart reasoning, and SQL, includes monitoring and
dashboard surfaces, and is referenced by community projects such as DeepWerewolf, AgentFlow, and
Youtu-Agent. Those community integrations matter because they demonstrate multi-agent usage, sparse-reward
scenarios, and large-scale optimization patterns that may generalize to Code_Environment/Public.

### Cross-Phase Awareness Table

| Phase | System | Core Pattern | Overlap Risk | Differentiation |
|-------|--------|-------------|-------------|-----------------|
| 001 | Agent Lightning | RL span optimization | 005 (loop driver) | Focus RL rewards, not general loops |
| 002 | Babysitter | Event-sourced orchestration | 007 (messaging) | Focus deterministic replay, not realtime |
| 003 | Claude Code Mastery | MDD + hooks | 005 (commands), 008 (skills) | Focus CLAUDE.md conventions |
| 004 | Get It Right | Structured retry | 001 (optimization) | Focus feedback bridges, YAML |
| 005 | Intellegix | Multi-agent worktrees | 001 (agents), 003 (cmds) | Focus worktree isolation, council |
| 006 | Ralph | Git-memory fresh agents | 002 (orchestration) | Focus bash simplicity, git-as-memory |
| 007 | Relay | Real-time messaging | 002 (orchestration) | Focus A2A transport, SDK |
| 008 | BAD | Sprint automation | 003 (MDD), 005 (agents) | Focus coordinator-subagent, skills |
| 009 | Xethryon | Memory + swarm | 006 (memory), 002 (swarm) | Focus self-reflection, Bun runtime |

### What This Repo Already Has

Code_Environment/Public already has agent orchestration in `.opencode/agent/orchestrate.md` with
single-hop NDP rules, memory/context systems in Spec Kit Memory with semantic search, MCP tooling such as
CocoIndex, Code Graph, and Sequential Thinking, validation gates through
`.opencode/skill/system-spec-kit/scripts/spec/validate.sh`, and operational safety rules in `CLAUDE.md`
with mandatory gates. Research should look for complementary RL and tracing patterns that strengthen those
systems rather than duplicating capabilities that are already mature.

## 5. Instructions

1. Treat `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/001-agent-lightning-main`
   as the pre-approved spec folder. Skip Gate 3, do not create a sibling packet, and keep every write
   inside this phase folder only.
2. Read the governing `AGENTS.md` files first: the repo root `AGENTS.md` and the external repo
   `external/AGENTS.md`. Treat everything under `external/` as read-only.
3. Create or refresh Level 3 Spec Kit docs in this phase folder before deep research begins:
   `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `decision-record.md`.
4. Use `@speckit` for markdown authoring when the runtime supports agent routing. If the runtime cannot
   route to `@speckit`, follow existing Spec Kit templates manually and preserve Level 3 structure.
5. Validate the phase folder before deep research with this exact command:
   ```bash
   cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/001-agent-lightning-main" --strict
   ```
6. If validation fails, fix the docs in this same phase folder and rerun strict validation before
   continuing. If blocked, record the blocker explicitly in `tasks.md` and `checklist.md`.
7. Run `spec_kit:deep-research` with a topic centered on RL optimization, span tracing, and reward
   signals. Use this exact topic string:
   ```text
   Research Agent Lightning for Code_Environment/Public with focus on RL optimization of AI agents, zero-code-change span tracing, reward signal design, algorithm pluggability, selective multi-agent optimization, and trainer/store integration patterns that could strengthen Public's orchestration, memory, validation, and safety systems.
   ```
8. Read the external repo in this order: `README.md`; then `agentlightning/tracer/base.py`,
   `agentlightning/store/base.py`, `agentlightning/adapter/triplet.py`, `agentlightning/trainer/trainer.py`,
   and `agentlightning/algorithm/base.py`; then `external/examples/README.md` plus one or two representative example
   subfolders; then relevant `docs/` pages for confirmation.
9. Use CocoIndex first for concept search across tracing, rewards, adapters, rollout state, and hooks.
   Use `grep` or equivalent exact search to confirm file paths, function names, interfaces, and call chains.
10. Trace at least three end-to-end flows: span creation, span-to-training-data transformation, and
    algorithm/runner/store coordination. Note where reward values attach, how attempts and rollouts are
    represented, and how multi-agent selection is expressed.
11. Explicitly compare Agent Lightning patterns to existing Public systems: `.opencode/agent/`,
    Spec Kit Memory, validation scripts, CLAUDE.md gate enforcement, and current orchestration constraints.
12. Save findings under `research/`, with `research/research.md` as the canonical output. If deep-research
    generates iterations, keep them under `research/iterations/` rather than scattering scratch notes.
13. For every finding, cite exact external file paths, explain the comparable subsystem in Public, state
    overlap risk with phases 002-009, and choose one action: `adopt now`, `prototype later`, or `reject`.
14. Update `checklist.md`, create `implementation-summary.md`, and save memory with this exact command:
    ```bash
    cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/001-agent-lightning-main"
    ```
15. Before closing, confirm that no edits escaped this phase folder and that cross-phase overlap with
    phase 005 has been explicitly addressed so RL-specific value is not confused with generic agent loops.

## 6. Research Questions

- How does `Tracer` define the minimum hook contract for capturing spans without rewriting agent business logic?
- How do `trace_context`, `create_span`, and operation recording map onto a reusable tracing surface for Public agents?
- How does `LightningStore` model rollout, attempt, worker, resource, and span lifecycle, and which of those concepts could improve Public's control plane?
- How does `TraceAdapter` or `TracerTraceToTriplet` transform spans into training-ready transitions or triplets?
- Where are reward values attached, matched, or propagated through the span tree, and what reward schema would Public need?
- How does `Trainer` keep algorithms pluggable while reusing runners, stores, hooks, and execution strategies?
- How does Agent Lightning selectively optimize one agent or subset of agents inside a multi-agent trace?
- What monitoring or convergence indicators exist in store statistics, examples, or docs that could inform Public's validation and review workflows?
- What integration points support the zero-code-change claim for external agent frameworks such as LangChain, AutoGen, or Claude Code?
- Which Agent Lightning patterns are immediately applicable to Public's orchestration and memory systems, and which would require a prototype packet first?

## 7. Do's

- Trace reward signal paths end to end, not just span creation in isolation.
- Examine the full span lifecycle: creation, parent/child linkage, storage, retrieval, and adaptation.
- Check algorithm extensibility patterns, especially where `Algorithm`, `Trainer`, and execution strategies stay decoupled.
- Study how adapters bridge raw spans into training data rather than assuming spans are directly consumable by RL code.
- Look for selective optimization mechanisms that distinguish one agent or one task slice inside larger workflows.
- Capture monitoring, statistics, or dashboard-relevant metrics only when they help assess optimization quality or convergence.
- Compare findings directly against Public's current orchestration, memory, and validation surfaces before recommending adoption.

## 8. Don'ts

- Do not try to run heavyweight training scripts or GPU-dependent workflows.
- Do not confuse the tracer layer with the agent layer; the point is observability and optimization, not agent authoring.
- Do not spend most of the analysis on dashboard UI, badges, or presentation details.
- Do not conflate Agent Lightning's RL approach with simple prompt optimization or retry logic.
- Do not ignore community projects; they show how the framework behaves in real multi-agent or sparse-reward settings.
- Do not recommend patterns that duplicate existing Public capabilities unless Agent Lightning adds clear RL-specific leverage.
- Do not edit anything under `external/` or outside this phase folder.

## 9. Examples

```text
**Finding: Backend-Agnostic Span Tracing Contract**
- Source: agentlightning/tracer/base.py
- What it does: Defines a tracer interface with `trace_context`, `create_span`, `operation_context`, and
  worker-level store binding so spans can be captured and attached to rollout or attempt identifiers without
  rewriting core agent logic.
- Why it matters: Code_Environment/Public could add a similar tracing seam around existing orchestration and
  memory flows, allowing agent quality to be observed and scored without modifying every agent implementation.
- Recommended action: prototype later
- Affected area: .opencode/agent/ orchestration, hook surfaces, and Spec Kit Memory integration points
- Risk/cost: Medium integration effort; requires a shared span schema and clear boundaries between tracing,
  validation, and memory indexing
```

## 10. Constraints

### Error Handling

- If CocoIndex cannot index the external Python code, fall back to targeted `grep`, direct file reads, and
  code-graph-style structural inspection when available. Record the fallback in `research/research.md`.
- If strict validation fails, fix the phase docs first. If a fix is not possible, document the blocker,
  its impact, and the unresolved rule in `tasks.md` and `checklist.md`.
- If `agentlightning/` imports are too complex to execute locally, analyze interfaces, docstrings, examples,
  and type shapes statically. Do not burn time on environment recreation or GPU stack setup.

### Scope Boundaries

- In scope: RL optimization, span tracing, reward signal design, adapter patterns, trainer/store boundaries,
  algorithm extensibility, selective multi-agent optimization, and monitoring signals tied to learning quality.
- Out of scope: dashboard UI polish, benchmark reproduction, GPU infrastructure, model weights, dependency
  wrestling, or unrelated examples that do not illuminate the core optimization loop.

### Prioritization

- High-impact and low-effort patterns should be marked `adopt now`.
- High-impact and high-effort patterns should be marked `prototype later`.
- Low-impact, redundant, or high-risk patterns should be marked `reject`.
- Any idea that overlaps phase 005 without adding RL-specific differentiation should be deprioritized.

## 11. Deliverables

- `spec.md`: Level 3 spec describing why Agent Lightning is worth researching and how it differs from other phases.
- `plan.md`: ordered work plan covering repo reading, evidence capture, synthesis, and closeout.
- `tasks.md`: actionable checklist of research steps, blockers, and completion items.
- `checklist.md`: verification checklist with evidence references and phase-overlap checks.
- `decision-record.md`: documented decisions about adoption, prototyping, rejection, and scope boundaries.
- `research/research.md`: canonical research report with at least five evidence-backed findings.
- `implementation-summary.md`: concise summary of results, recommended next packets, and key risks.
- Saved memory entry for this phase using `generate-context.js` after research is complete.

## 12. Evaluation Criteria

- Produce at least five evidence-backed findings.
- Every finding must cite at least one exact external file path.
- Every finding must map to at least one concrete Public subsystem, file, or operational surface.
- Findings must distinguish RL-specific value from generic orchestration, retry, or prompt-management ideas.
- Recommendations must use `adopt now`, `prototype later`, or `reject` with explicit reasoning.
- Overall output should be CLEAR-aligned and strong enough to score at least 40/50 for clarity, logic,
  expression, arrangement, and reusability.

## 13. Completion Bar

- Level 3 docs exist in the phase folder.
- `research/research.md` contains at least five evidence-backed findings.
- `checklist.md` is updated with evidence and completion marks.
- `implementation-summary.md` exists and names recommended next steps or follow-on packets.
- Memory is saved successfully for this exact phase folder.
- No edits were made outside the phase folder.
- Cross-phase overlap with phase 005 is explicitly addressed.
