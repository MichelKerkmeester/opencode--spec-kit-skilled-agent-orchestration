---
title: Deep Research Strategy - Stream 03 Internal Agent Inventory
description: Runtime strategy for the internal `.opencode/agent/` + AGENTS.md governance research stream of packet 059-agent-implement-code.
---

# Deep Research Strategy - Stream 03 Internal Agent Inventory

Runtime packet for `specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-03-internal-agent-inventory/`.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Investigate the existing internal `.opencode/agent/*` ecosystem, AGENTS.md universal governance (canonical + Barter + fs-enterprises siblings), the skill-advisor hook auto-load mechanism, and dispatch wiring (e.g. the `step_dispatch_iteration` step in `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`) to surface harness-level mechanisms relevant to the D3 caller-restriction blocker and to design a concrete `.opencode/agent/code.md` skeleton.

### Usage

- 8 iterations target the 5 key questions; convergence detected via 3-signal vote.
- Cross-stream synthesis happens at parent `059-agent-implement-code/research.md`; this stream's output is `research.md` packet-local.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:topic -->
## 2. TOPIC
Inventory existing internal agent ecosystem and harness governance: skill auto-loading patterns, stack-agnostic detection mechanisms, caller-restriction enforcement (D3 BLOCKER), write-capable safety guarantees, sub-agent dispatch contracts and depth/nesting rules. Output a concrete recommendation set for `.opencode/agent/code.md`.

<!-- /ANCHOR:topic -->
<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Q1: Skill auto-loading patterns - how do current agents pick up skills? Is there a frontmatter field naming skills to auto-load? What does the skill-advisor hook do at the agent boundary?
- [ ] Q2: Stack-agnostic detection mechanisms - concretely: how does `sk-code` detect Webflow vs Next.js vs Go vs Swift? Where is the marker-file probing logic? Can a future `@code` agent reuse this without hardcoding stack assumptions?
- [ ] Q3: Caller-restriction enforcement (D3 BLOCKER) - any harness-level mechanism in our codebase that enforces caller restrictions? Inspect every `.opencode/agent/*.md` for relevant frontmatter. Inspect AGENTS.md "Distributed Governance Rule" and "@orchestrate routes to" pattern. Find what mechanism, if any, the harness already supports for "callable only by orchestrator".
- [ ] Q4: Write-capable safety guarantees - how do existing write-capable agents (write, debug for `debug-delegation.md`, deep-research for `research/research.md`) bound their writes? Path allowlists, scope locks, validation hooks?
- [ ] Q5: Sub-agent dispatch contracts and depth/nesting rules - what does LEAF mean concretely in our agents? Find every `leaf` flag, every `task:` permission, every comment forbidding nested dispatch. What enforces it at runtime? `task: deny` is one example - where is it implemented?

<!-- /ANCHOR:key-questions -->
<!-- ANCHOR:non-goals -->
## 4. NON-GOALS

- No changes to source agent files, AGENTS.md, or the skill-advisor implementation
- No external research (treat external repos surveyed by streams 01/02 as out of scope here)
- No edits to spec.md or plan.md - research-only stream
- No design of `.opencode/agent/code.md` itself - this stream produces a recommendation, not the agent file

<!-- /ANCHOR:non-goals -->
<!-- ANCHOR:stop-conditions -->
## 5. STOP CONDITIONS

- Complete up to 8 packet-local iterations
- All 5 key questions have at least one cited finding
- 3-signal weighted convergence vote scores > 0.60: rolling_avg(3) < 0.05 OR MAD floor at 4+ iters OR coverage >= 0.85
- Stuck count >= 3 triggers recovery, not stop

<!-- /ANCHOR:stop-conditions -->
<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->
<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- The frontmatter inventory plus focused grep gave a high-confidence negative result: the ecosystem has role/tool metadata but no caller allowlist metadata. (iteration 1)
- Reading the hook reference before searching frontmatter kept the layers separate. The hook explains recommendation timing, while the agent files show how skill usage is actually expressed. (iteration 4)
- Reading `SKILL.md` with the router references separated the actual contract from the repo-level summary. The repo summary mentions more stacks, but `sk-code` itself only owns WEBFLOW, NEXTJS, and GO. (iteration 5)

<!-- /ANCHOR:what-worked -->
<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- Broad grep for `caller` was noisy because the memory/session harness uses caller context for MCP security, which is unrelated to agent dispatch authority. (iteration 1)
- Broad runtime grep for `skills` was noisy because skill graphs, integration scanners, docs, and agent body tables all use that word. Exact loader-shaped terms like `auto_load_skills` and frontmatter-key searches were more decisive. (iteration 4)
- Treating the pseudocode as executable would overstate the evidence. The detector is authoritative documentation for the active model to apply, not a script a future agent can import today. (iteration 5)

<!-- /ANCHOR:what-failed -->
<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `@orchestrate` having an explicit `permission.task: allow` frontmatter field in the current file. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `@orchestrate` having an explicit `permission.task: allow` frontmatter field in the current file.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `@orchestrate` having an explicit `permission.task: allow` frontmatter field in the current file.

### A local `agent_config.leaf_only` loader that enforces no Task dispatch. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A local `agent_config.leaf_only` loader that enforces no Task dispatch.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A local `agent_config.leaf_only` loader that enforces no Task dispatch.

### A universal runtime write allowlist for `.opencode/agent/*` agents in system-spec-kit scripts/shared code. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A universal runtime write allowlist for `.opencode/agent/*` agents in system-spec-kit scripts/shared code.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A universal runtime write allowlist for `.opencode/agent/*` agents in system-spec-kit scripts/shared code.

### Code-level enforcement for "spec.md scope is FROZEN"; the focused search found the scope-lock rule as AGENTS.md prose only. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Code-level enforcement for "spec.md scope is FROZEN"; the focused search found the scope-lock rule as AGENTS.md prose only.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Code-level enforcement for "spec.md scope is FROZEN"; the focused search found the scope-lock rule as AGENTS.md prose only.

### Existing agent frontmatter keys named `skills`, `skill`, `auto_skills`, `loaded_skills`, `requires`, `uses`, `dependencies`, or `routes`. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Existing agent frontmatter keys named `skills`, `skill`, `auto_skills`, `loaded_skills`, `requires`, `uses`, `dependencies`, or `routes`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Existing agent frontmatter keys named `skills`, `skill`, `auto_skills`, `loaded_skills`, `requires`, `uses`, `dependencies`, or `routes`.

### Existing explicit frontmatter keys named `caller`, `dispatchableBy`, `callableFrom`, `parent`, `restricted_callers`, `allowed_callers`, or equivalent. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Existing explicit frontmatter keys named `caller`, `dispatchableBy`, `callableFrom`, `parent`, `restricted_callers`, `allowed_callers`, or equivalent.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Existing explicit frontmatter keys named `caller`, `dispatchableBy`, `callableFrom`, `parent`, `restricted_callers`, `allowed_callers`, or equivalent.

### Existing harness-level validator patterns named `isOrchestrator`, `restricted_callers`, or `dispatchableBy`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Existing harness-level validator patterns named `isOrchestrator`, `restricted_callers`, or `dispatchableBy`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Existing harness-level validator patterns named `isOrchestrator`, `restricted_callers`, or `dispatchableBy`.

### Existing searched runtime loader patterns named `auto_load_skills`, `preload_skills`, or generic agent-skill binding. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Existing searched runtime loader patterns named `auto_load_skills`, `preload_skills`, or generic agent-skill binding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Existing searched runtime loader patterns named `auto_load_skills`, `preload_skills`, or generic agent-skill binding.

### Machine-readable `allowed_paths` / `allowedPaths` / `allowed_path` fields in the inspected agent frontmatter. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Machine-readable `allowed_paths` / `allowedPaths` / `allowed_path` fields in the inspected agent frontmatter.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Machine-readable `allowed_paths` / `allowedPaths` / `allowed_path` fields in the inspected agent frontmatter.

### Post-dispatch validation as LEAF validation; it validates iteration artifacts and JSONL schema only. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Post-dispatch validation as LEAF validation; it validates iteration artifacts and JSONL schema only.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Post-dispatch validation as LEAF validation; it validates iteration artifacts and JSONL schema only.

### Tests that automatically assert `permission.task: deny` blocks Task-tool calls from a LEAF agent. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Tests that automatically assert `permission.task: deny` blocks Task-tool calls from a LEAF agent.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Tests that automatically assert `permission.task: deny` blocks Task-tool calls from a LEAF agent.

### Treating `permission.task: deny` as caller restriction. It prevents the callee from dispatching onward; it does not restrict who can invoke the callee. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating `permission.task: deny` as caller restriction. It prevents the callee from dispatching onward; it does not restrict who can invoke the callee.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `permission.task: deny` as caller restriction. It prevents the callee from dispatching onward; it does not restrict who can invoke the callee.

### Treating the Skill Advisor hook as skill auto-loading. It recommends and injects brief context; it does not read or load `SKILL.md` for the agent. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Treating the Skill Advisor hook as skill auto-loading. It recommends and injects brief context; it does not read or load `SKILL.md` for the agent.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the Skill Advisor hook as skill auto-loading. It recommends and injects brief context; it does not read or load `SKILL.md` for the agent.

<!-- /ANCHOR:exhausted-approaches -->
<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Existing explicit frontmatter keys named `caller`, `dispatchableBy`, `callableFrom`, `parent`, `restricted_callers`, `allowed_callers`, or equivalent. (iteration 1)
- Existing harness-level validator patterns named `isOrchestrator`, `restricted_callers`, or `dispatchableBy`. (iteration 1)
- Treating `permission.task: deny` as caller restriction. It prevents the callee from dispatching onward; it does not restrict who can invoke the callee. (iteration 1)
- A universal runtime write allowlist for `.opencode/agent/*` agents in system-spec-kit scripts/shared code. (iteration 2)
- Code-level enforcement for "spec.md scope is FROZEN"; the focused search found the scope-lock rule as AGENTS.md prose only. (iteration 2)
- Machine-readable `allowed_paths` / `allowedPaths` / `allowed_path` fields in the inspected agent frontmatter. (iteration 2)
- `@orchestrate` having an explicit `permission.task: allow` frontmatter field in the current file. (iteration 3)
- A local `agent_config.leaf_only` loader that enforces no Task dispatch. (iteration 3)
- Post-dispatch validation as LEAF validation; it validates iteration artifacts and JSONL schema only. (iteration 3)
- Tests that automatically assert `permission.task: deny` blocks Task-tool calls from a LEAF agent. (iteration 3)
- Existing agent frontmatter keys named `skills`, `skill`, `auto_skills`, `loaded_skills`, `requires`, `uses`, `dependencies`, or `routes`. (iteration 4)
- Existing searched runtime loader patterns named `auto_load_skills`, `preload_skills`, or generic agent-skill binding. (iteration 4)
- Treating the Skill Advisor hook as skill auto-loading. It recommends and injects brief context; it does not read or load `SKILL.md` for the agent. (iteration 4)

<!-- /ANCHOR:ruled-out-directions -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Iteration 6 should synthesize the `@code` design contract from Q1-Q5: body-level skill binding to `sk-code`, no claimed caller-restriction enforcement, `permission.task: deny` for LEAF behavior, bounded write prose plus verification gates, and stack detection delegated to `sk-code` by reference rather than duplicated inside the agent. If implementation is next, the lowest-risk improvement is a tiny, tested `sk-code` stack detector shared by `SKILL.md`, advisor diagnostics, and future `@code`.

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

This packet investigates internal `.opencode/agent/` + AGENTS.md governance only. Cross-stream synthesis happens at parent `059-agent-implement-code/research.md`. Companion streams (01 and 02) survey external repositories `oh-my-opencode-slim` and `opencode-swarm-main`.

Decision-record context (D1-D10) at `specs/skilled-agent-orchestration/059-agent-implement-code/decision-record.md`. The D3 row is the explicit research blocker:
- `@code` should be "called by orchestrate and cant be used in other ways"
- Initial decision: convention-floor with three layers (frontmatter description + dispatch-gate refusal on missing orchestrator-context marker + orchestrator-side routing table entry)
- Research goal: surface any existing harness mechanism that could replace or strengthen layer (ii)

D2 already commits to permission profile `task: deny` for `@code`. Question 5 (sub-agent dispatch contracts) confirms whether `task: deny` is sufficient for LEAF-depth-1 enforcement at runtime.

D4 commits to delegating stack detection to `sk-code`. Question 2 confirms what marker-file probing mechanism `sk-code` actually uses, so `@code` can reuse it without re-implementing.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 8
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 15 minutes
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `new` (live)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11
- Canonical pause sentinel: `research/stream-03-internal-agent-inventory/.deep-research-pause`
- Capability matrix: `.opencode/skill/sk-deep-research/assets/runtime_capabilities.json`
- Capability matrix doc: `.opencode/skill/sk-deep-research/references/capability_matrix.md`
- Capability resolver: `.opencode/skill/sk-deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 1
- Started: 2026-05-01T15:00:00Z
