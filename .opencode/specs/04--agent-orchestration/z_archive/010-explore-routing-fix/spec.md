---
title: "Spec: Fix @explore Direct Dispatch in Orchestrate [04--agent-orchestration/z_archive/010-explore-routing-fix/spec]"
description: "The orchestrate agent (orchestrate.md) contains Rule 4 (\"Never Dispatch @explore Directly\") instructing the LLM to route all exploration through @context instead of dispatching ..."
trigger_phrases:
  - "spec"
  - "fix"
  - "explore"
  - "direct"
  - "dispatch"
  - "010"
importance_tier: "important"
contextType: "decision"
---
# Spec: Fix @explore Direct Dispatch in Orchestrate Agent

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec Folder** | `.opencode/specs/04--agent-orchestration/z_archive/010-explore-routing-fix/` |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-02-11 |
| **Risk** | LOW (text changes to agent instructions, easily reversible) |
| **Target File** | `.opencode/agent/orchestrate.md` |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The orchestrate agent (`orchestrate.md`) contains Rule 4 ("Never Dispatch @explore Directly") instructing the LLM to route all exploration through `@context` instead of dispatching `@explore` directly. Despite this rule, the orchestrator **still frequently dispatches @explore agents directly**, bypassing `@context`.

This causes three concrete harms:

1. **Token waste** -- @explore returns raw, unstructured results that consume context window budget without the compression and structuring @context provides.
2. **Memory bypass** -- Direct @explore dispatches skip Spec Kit Memory integration (memory_match_triggers, memory_search, memory_context) that @context performs automatically.
3. **Unstructured output** -- @explore returns free-form text instead of the structured Context Package format @context produces.

### The "Pink Elephant" Problem

The root cause is a well-known cognitive phenomenon: telling an LLM "never use @explore" forces it to repeatedly activate the concept of @explore in its attention, making it **more likely** to dispatch @explore, not less. The current document mentions `@explore` approximately 5 times while instructing the LLM not to use it -- the textual equivalent of saying "don't think of a pink elephant."

### Purpose

Rewrite orchestrate.md to eliminate the pink elephant effect by:
- **Promoting @context** as the sole exploration agent with rich, specific descriptions
- **Minimizing @explore mentions** to reduce its salience in the LLM's attention
- **Adding structural enforcement** at the dispatch point (subagent_type constraints)
- **Reframing rules positively** ("route through @context" instead of "never use @explore")

<!-- /ANCHOR:problem -->

---

## 3. ROOT CAUSE ANALYSIS

Five root causes identified, ranked by impact:

| # | Root Cause | Impact | Description |
|---|-----------|--------|-------------|
| RC-1 | **Pink Elephant Problem** | HIGH | Document mentions "@explore" ~5 times while telling LLM NOT to use it. Negative framing paradoxically increases @explore's salience in LLM attention. |
| RC-2 | **System Tool Description** | HIGH | The Task tool's built-in system description explicitly lists `subagent_type: "explore"` with an attractive, actionable description ("Fast agent specialized for exploring codebases..."). This permanently advertises @explore as a first-class dispatch option and CANNOT be modified from orchestrate.md. |
| RC-3 | **No Gate Enforcement** | MEDIUM | Rule 4 is a soft "don't do this" without structural enforcement. Unlike Gate 3 (spec folder) which has HARD BLOCK designation with stop/ask/wait mechanics, Rule 4 has no gate mechanism, consequence, or circuit breaker. |
| RC-4 | **Parallel Dispatch Incentive** | MEDIUM | @explore's description emphasizes "Fast" which incentivizes the orchestrator to dispatch multiple @explore agents in parallel for speed. @context appears slower (single agent that internally dispatches). The orchestrator's "parallel-first" design (section 12) amplifies this bias toward the seemingly faster option. |
| RC-5 | **Weaker @context Description** | LOW-MEDIUM | @context's description ("Context retrieval, analysis, and exploration dispatch agent") is abstract and procedural. @explore's description is concrete and actionable ("find files by patterns, search code for keywords"). LLMs gravitate toward specific, actionable language. |

### Why Previous Fixes Failed

The current Rule 4 ("Never Dispatch @explore Directly") was added as a direct prohibition. This approach fails because:
- It increases @explore mentions (adding to RC-1)
- It cannot override the system-level tool description (RC-2 remains)
- It provides no structural enforcement at the dispatch point (RC-3 remains)
- It does not address the attractiveness gap between descriptions (RC-4, RC-5 remain)

---

<!-- ANCHOR:scope -->
## 4. SCOPE

### In Scope

| Item | Description |
|------|-------------|
| orchestrate.md | All 8 targeted changes to reduce @explore salience and promote @context routing |
| Section 3 | Agent Routing Table -- rewrite @context description, add subagent_type column, remove @explore references |
| Section 5 | Rule 4 -- reframe from negative to positive; Two-Tier Model -- remove @explore name |
| Section 10 | Task Decomposition Format -- add subagent_type constraint at dispatch point |
| Section 21 | Summary -- remove @explore note |
| Section 24 | Anti-Patterns -- reframe around @context routing |

### Out of Scope

| Item | Reason |
|------|--------|
| AGENTS.md section 7 | Contains similar @explore references but is a separate file requiring its own spec (follow-up) |
| context.md agent | May need strengthening for increased routing load but is a separate concern |
| Task tool system description | Cannot be modified from agent definition files (platform-level) |
| Any code or script changes | This is purely an agent instruction text change |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

| ID | Criterion | Measurement |
|----|-----------|-------------|
| SC-001 | Zero direct @explore dispatches by orchestrator | Observe across 3-5 sessions post-fix |
| SC-002 | @explore mentions in orchestrate.md reduced from ~5 to <=2 | Word count in file |
| SC-003 | Rule 4 reframed as positive routing rule | Text inspection: rule title and body focus on @context, not @explore |
| SC-004 | subagent_type constraint present at dispatch point | Section 10 contains explicit constraint |
| SC-005 | @context description is comprehensive and actionable | Description covers file search, pattern discovery, keyword search, context loading |

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Changes insufficient to override system tool description (RC-2) | Medium -- @explore still advertised by system | Structural enforcement at dispatch point (Change 6) acts as secondary barrier |
| Risk | @context becomes overloaded with routing traffic | Low -- @context already handles this role | Monitor @context performance; strengthen if needed (separate spec) |
| Dependency | orchestrate.md must be read before editing | Blocking -- required by Critical Rule 1 | Read file first in implementation |
| Rollback | Single file change | Easy -- `git revert` or `git checkout` of one file | Low-risk change with simple rollback path |

<!-- /ANCHOR:risks -->

---

## 7. CONSTRAINTS

| ID | Constraint | Description |
|----|-----------|-------------|
| C1 | Single file only | All changes confined to `orchestrate.md` |
| C2 | No behavioral changes | Agent routing logic unchanged; only text/framing changes |
| C3 | Minimize @explore mentions | Target: <=2 mentions (down from ~5) |
| C4 | Positive framing only | Rules must describe what TO DO, not what NOT to do |
| C5 | Cannot modify system tool description | The Task tool's built-in `subagent_type: "explore"` description is read-only |

---

## 8. RELATED DOCUMENTS

| Document | Purpose |
|----------|---------|
| [`plan.md`](./plan.md) | Implementation approach, phased changes, before/after |
| [`tasks.md`](./tasks.md) | Detailed task breakdown with acceptance criteria |
| [`checklist.md`](./checklist.md) | Verification checklist (P0/P1/P2 items) |
| `007-explore-sub-agent/spec.md` | Prior work: @context_loader agent creation |
| `006-orchestrate-context-window/` | Prior work: orchestrate.md context window protection |

---

## Phase 4 Extension: Agent Loading Protocol (Added During Implementation)

### Discovery
During implementation of Phases 1-3, the orchestrator itself exhibited the same routing failure for @speckit — dispatching a generic agent with improvised "you are @speckit" instructions instead of loading the actual `speckit.md` agent definition. This revealed a systemic gap.

### Root Cause
orchestrate.md tells the orchestrator WHICH agent to use (§3 routing table) but never HOW to properly instantiate a custom agent. There is no protocol requiring the orchestrator to read and include agent definition files when dispatching custom agents.

### Impact
Affects ALL 7 custom agents: @context, @research, @speckit, @review, @write, @debug, @handover. Without loading agent definitions, specialized templates, enforcement rules, and quality standards are lost.

### Changes Made
- §3: Added Agent Loading Protocol (mandatory 3-step process before dispatching custom agents)
- §10 Task Decomposition: Added "Agent Definition" field requiring file path
- §10 PDR: Added "Agent Def" check (loaded/built-in/prior-session)
- §5 Rule 5: Added explicit Dispatch Protocol for @speckit with HOW-TO
- §24: Added anti-pattern "Never improvise custom agent instructions"

---
