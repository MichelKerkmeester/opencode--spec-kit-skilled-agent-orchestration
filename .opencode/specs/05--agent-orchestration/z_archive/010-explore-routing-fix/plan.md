---
title: "Plan: Fix @explore Direct Dispatch in Orchestrate Agent [010-explore-routing-fix/plan]"
description: "The fix applies a three-pronged approach to LLM prompt engineering"
trigger_phrases:
  - "plan"
  - "fix"
  - "explore"
  - "direct"
  - "dispatch"
  - "010"
importance_tier: "important"
contextType: "decision"
---
# Plan: Fix @explore Direct Dispatch in Orchestrate Agent

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. IMPLEMENTATION APPROACH

### Strategy: "Promote @context, Demote @explore"

The fix applies a three-pronged approach to LLM prompt engineering:

1. **Salience Reduction** -- Minimize mentions of the unwanted dispatch target to reduce its activation in the LLM's attention (addresses RC-1: Pink Elephant Problem)
2. **Positive Reframing** -- Replace "don't use X" instructions with "always use Y" instructions, making the correct behavior the default mental model (addresses RC-3, RC-5)
3. **Structural Enforcement** -- Place constraints at the exact point where the dispatch decision is made, not in a separate rules section the LLM may not reference at dispatch time (addresses RC-3, RC-4)

### Why Text Changes Are Sufficient

This is a prompt engineering fix, not a code change. The orchestrator's behavior is entirely determined by the text in `orchestrate.md`. By changing the text to reduce @explore salience, strengthen @context descriptions, and add dispatch-point constraints, we directly modify the LLM's decision-making inputs.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:phases -->
## 2. PHASED IMPLEMENTATION

### Phase 1: High-Impact Changes (Pink Elephant Elimination)

**Estimated effort: 15 minutes**

These three changes address the highest-impact root causes (RC-1, RC-5) by promoting @context and reducing @explore visibility.

#### Change 1: Section 3 -- Rewrite @context Row in Agent Routing Table

| Aspect | Detail |
|--------|--------|
| **Section** | Section 3 (Agent Routing Table) |
| **Root Causes** | RC-1 (reduce @explore salience), RC-5 (strengthen @context description) |
| **Before** | `@context \| Context retrieval, analysis, and exploration dispatch agent` |
| **After** | `@context \| ALL codebase exploration: file search, pattern discovery, keyword search, context loading. Internally dispatches fast search and deep investigation. The SOLE agent for any exploration need.` |
| **Rationale** | Makes @context's description concrete and actionable (matching the specificity that makes @explore's system description attractive). Explicitly states "SOLE agent" to establish exclusivity. |

#### Change 2: Section 5 -- Reframe Rule 4 (Negative to Positive)

| Aspect | Detail |
|--------|--------|
| **Section** | Section 5 (Rules) |
| **Root Causes** | RC-1 (pink elephant), RC-3 (no gate enforcement) |
| **Before** | Title: "Never Dispatch @explore Directly" -- Body mentions @explore ~4 times with negative framing |
| **After** | Title: "Route ALL Exploration Through @context" -- Body focuses on what @context provides and why it's the correct routing. @explore mentioned at most 1 time in a technical footnote. |
| **Rationale** | Positive framing keeps the correct agent (@context) as the primary concept in the LLM's attention. Reducing @explore mentions from ~4 to ~1 lowers its salience. |

#### Change 3: Section 5 -- Update Two-Tier Dispatch Model

| Aspect | Detail |
|--------|--------|
| **Section** | Section 5 (Two-Tier Dispatch Model) |
| **Root Causes** | RC-1 (reduce @explore naming) |
| **Before** | "@context internally dispatches @explore (fast search) and @research (deep investigation)" |
| **After** | "@context internally dispatches specialized sub-agents for fast search and deep investigation" |
| **Rationale** | Removes the @explore name from the dispatch model description. The LLM doesn't need to know the internal sub-agent names to route correctly through @context. |

<!-- /ANCHOR:phases -->

---

### Phase 2: Medium-Impact Changes (Cleanup)

**Estimated effort: 10 minutes**

These changes clean up remaining @explore references in secondary sections.

#### Change 4: Section 21 -- Remove @explore Note from Summary

| Aspect | Detail |
|--------|--------|
| **Section** | Section 21 (Summary) |
| **Root Causes** | RC-1 (reduce total @explore mentions) |
| **Before** | "Note: @explore is a built-in subagent type used only internally by @context -- never dispatch directly." |
| **After** | Remove entirely, or replace with: "@context handles all exploration needs." |
| **Rationale** | The summary is a high-visibility section. Every @explore mention here reinforces its salience. |

#### Change 5: Section 24 -- Reframe Anti-Pattern

| Aspect | Detail |
|--------|--------|
| **Section** | Section 24 (Anti-Patterns) |
| **Root Causes** | RC-1 (positive framing), RC-3 (enforcement) |
| **Before** | Anti-pattern: "Never dispatch @explore directly" |
| **After** | Anti-pattern: "Never bypass @context for exploration tasks" -- focuses on the correct routing, not the wrong agent name |
| **Rationale** | Anti-patterns that name the wrong behavior paradoxically teach it. Reframing around the correct behavior (@context) is more effective. |

---

### Phase 3: Structural Reinforcement (Dispatch-Point Guards)

**Estimated effort: 10-15 minutes**

These changes add structural enforcement at the point where the LLM makes dispatch decisions.

#### Change 6: Section 10 -- Add subagent_type Constraint

| Aspect | Detail |
|--------|--------|
| **Section** | Section 10 (Task Decomposition Format) |
| **Root Causes** | RC-3 (gate enforcement), RC-4 (parallel dispatch incentive) |
| **Before** | No subagent_type constraint at dispatch point |
| **After** | Add to dispatch template: `subagent_type: MUST be "general" for all dispatches (exploration routes through @context with subagent_type "general")` |
| **Rationale** | Places the constraint at the exact moment the LLM writes the dispatch call. This is more effective than a rule in a separate section because the LLM references the template format when generating dispatch code. |

#### Change 7: Section 3 -- Add subagent_type Column to Agent Routing Table

| Aspect | Detail |
|--------|--------|
| **Section** | Section 3 (Agent Routing Table) |
| **Root Causes** | RC-2 (counter system description), RC-3 (structural enforcement) |
| **Before** | Table has Agent and Description columns only |
| **After** | Add `subagent_type` column showing "general" for every agent row. Creates a lookup table with NO "explore" option visible. |
| **Rationale** | When the LLM looks up which agent to dispatch, it sees "general" as the only subagent_type for every agent. This directly counters the system tool description that advertises "explore" as an option. |

#### Change 8: Section 3 -- Remove Remaining @explore References

| Aspect | Detail |
|--------|--------|
| **Section** | Section 3 (Agent Files Table, footnotes) |
| **Root Causes** | RC-1 (salience reduction) |
| **Before** | Any remaining @explore footnote, row, or mention in section 3 |
| **After** | Removed entirely |
| **Rationale** | Final cleanup pass to ensure section 3 contains zero @explore mentions. |

---

<!-- ANCHOR:dependencies -->
## 3. DEPENDENCIES

| Dependency | Type | Status |
|------------|------|--------|
| orchestrate.md | Must read before editing | Available |
| None (all changes in single file) | No external dependencies | N/A |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:effort -->
## 4. EFFORT ESTIMATE

| Phase | Changes | Estimated Time |
|-------|---------|---------------|
| Phase 1 | Changes 1, 2, 3 | 15 minutes |
| Phase 2 | Changes 4, 5 | 10 minutes |
| Phase 3 | Changes 6, 7, 8 | 10-15 minutes |
| **Total** | **8 changes** | **35-40 minutes** |

<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:rollback -->
## 5. ROLLBACK PLAN

| Scenario | Action |
|----------|--------|
| Changes cause unintended behavior | `git checkout -- .opencode/agent/orchestrate.md` restores previous version |
| Partial changes needed | Individual sections can be reverted independently (changes are section-scoped) |
| Full rollback | `git revert <commit-hash>` -- single file change makes this trivial |

<!-- /ANCHOR:rollback -->

---

## 6. FOLLOW-UP WORK (Out of Scope)

| Item | Priority | Description |
|------|----------|-------------|
| AGENTS.md section 7 update | P1 | Contains @explore references in Agent Routing table; should apply same "promote @context" strategy |
| context.md strengthening | P2 | If @context receives significantly more traffic, may need performance/capability updates |
| Verification sessions | P1 | Observe orchestrator behavior across 3-5 sessions post-fix to validate SC-001 |

---
