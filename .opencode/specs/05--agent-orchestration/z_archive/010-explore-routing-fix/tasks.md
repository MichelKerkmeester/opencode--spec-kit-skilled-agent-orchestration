---
title: "Tasks: Fix @explore Direct Dispatch in Orchestrate Agent [010-explore-routing-fix/tasks]"
description: "Phase: 1 (High-Impact)"
trigger_phrases:
  - "tasks"
  - "fix"
  - "explore"
  - "direct"
  - "dispatch"
  - "010"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Fix @explore Direct Dispatch in Orchestrate Agent

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Summary

| Task | Phase | Changes | Status | Priority |
|------|-------|---------|--------|----------|
| T1 | Phase 1 | 1, 7, 8 | ✅ Complete | P0 |
| T2 | Phase 1 | 2 | ✅ Complete | P0 |
| T3 | Phase 1 | 3 | ✅ Complete | P0 |
| T4 | Phase 2 | 4, 5 | ✅ Complete | P1 |
| T5 | Phase 3 | 6 | ✅ Complete | P0 |
| T7 | Phase 4 | Agent Loading Protocol | ✅ Complete | P0 |
| T8 | Phase 4 | Agent Definition fields | ✅ Complete | P0 |
| T9 | Phase 4 | @speckit dispatch + anti-pattern | ✅ Complete | P0 |
| T6 | Post | Verification | Pending | P1 |

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## T1: Rewrite Section 3 Agent Routing Table

**Phase:** 1 (High-Impact)
**Changes:** 1 + 7 + 8
**Priority:** P0
**Status:** ✅ COMPLETE — @context row rewritten with comprehensive exploration description, subagent_type column verified present, @explore footnote replaced with @context-focused note
**Estimated effort:** 5-8 minutes

### Description

Rewrite the Agent Routing Table in section 3 of orchestrate.md to:
1. Replace @context's abstract description with a comprehensive, actionable description covering all exploration capabilities
2. Add a `subagent_type` column showing "general" for every agent row
3. Remove any @explore footnote, row, or reference from the table and surrounding text

### Changes

**Change 1 -- @context description rewrite:**
- FROM: `@context | Context retrieval, analysis, and exploration dispatch agent`
- TO: `@context | ALL codebase exploration: file search, pattern discovery, keyword search, context loading. Internally dispatches fast search and deep investigation. The SOLE agent for any exploration need.`

**Change 7 -- Add subagent_type column:**
- Add `subagent_type` column to every row in the Agent Routing Table
- Every agent row shows `general` as the subagent_type
- No row should show `explore` as an option

**Change 8 -- Remove @explore references:**
- Remove any @explore footnote below the table
- Remove any @explore row from the table
- Remove any @explore mention from section 3 text

### Acceptance Criteria

- [ ] @context row has comprehensive description mentioning: file search, pattern discovery, keyword search, context loading
- [ ] @context description includes "SOLE agent" or equivalent exclusivity language
- [ ] `subagent_type` column present with "general" for all agent rows
- [ ] Zero @explore mentions in section 3 (no rows, footnotes, or text references)
- [ ] Table formatting is valid markdown with aligned columns

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## T2: Reframe Section 5 Rule 4 (Negative to Positive)

**Phase:** 1 (High-Impact)
**Changes:** 2
**Priority:** P0
**Status:** ✅ COMPLETE — Rule 4 title changed to "Route ALL Exploration Through @context", body reframed as positive routing instruction, @explore mentions reduced to zero
**Estimated effort:** 5-8 minutes

### Description

Rewrite Rule 4 in section 5 from a negative prohibition ("Never Dispatch @explore Directly") to a positive routing instruction ("Route ALL Exploration Through @context"). Minimize @explore mentions in the rule body from approximately 4 to at most 1.

### Changes

**Change 2 -- Rule 4 reframe:**
- Title FROM: "Never Dispatch @explore Directly"
- Title TO: "Route ALL Exploration Through @context"
- Body: Rewrite to focus on what @context provides (memory integration, structured output, thoroughness levels) and why routing through it is required
- @explore mentions: Reduce from ~4 to <=1 (at most a single technical footnote)

### Acceptance Criteria

- [ ] Rule 4 title contains "Route" and "@context" (not "Never" and "@explore")
- [ ] Rule body focuses on @context capabilities and benefits
- [ ] @explore mentioned at most 1 time in the entire rule (including any footnote)
- [ ] No negative framing ("never", "don't", "do not") as primary instruction
- [ ] Existing rule intent preserved (all exploration must go through @context)

---

## T3: Update Section 5 Two-Tier Dispatch Model

**Phase:** 1 (High-Impact)
**Changes:** 3
**Priority:** P0
**Status:** ✅ COMPLETE — @explore name removed from Two-Tier Model, replaced with "specialized sub-agents" while preserving fast search / deep investigation concepts
**Estimated effort:** 2-3 minutes

### Description

Update the Two-Tier Dispatch Model description in section 5 to remove the @explore name, replacing it with generic language about sub-agents.

### Changes

**Change 3 -- Remove @explore name from Two-Tier Model:**
- FROM: "@context internally dispatches @explore (fast search) and @research (deep investigation)"
- TO: "@context internally dispatches specialized sub-agents for fast search and deep investigation"

### Acceptance Criteria

- [ ] Two-Tier Model text does not mention "@explore" by name
- [ ] The concept of fast search and deep investigation is preserved
- [ ] @context is clearly identified as the dispatcher
- [ ] Text is grammatically correct and clear

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## T4: Clean Section 21 Summary and Section 24 Anti-Patterns

**Phase:** 2 (Cleanup)
**Changes:** 4 + 5
**Priority:** P1
**Status:** ✅ COMPLETE — §21 @explore reference replaced with "@context handles ALL exploration tasks exclusively"; §24 anti-pattern reframed to "Never bypass @context for exploration tasks"
**Estimated effort:** 5-8 minutes

### Description

Clean up @explore references in two secondary sections:
1. Section 21 (Summary): Remove the @explore note entirely or replace with @context-focused text
2. Section 24 (Anti-Patterns): Reframe the anti-pattern from "@explore" focus to "@context routing" focus

### Changes

**Change 4 -- Section 21 Summary:**
- FROM: "Note: @explore is a built-in subagent type used only internally by @context -- never dispatch directly."
- TO: Remove entirely, or replace with: "@context handles all exploration needs."

**Change 5 -- Section 24 Anti-Patterns:**
- FROM: Anti-pattern text containing "Never dispatch @explore directly"
- TO: "Never bypass @context for exploration tasks" -- focuses on correct routing, not wrong agent name

### Acceptance Criteria

- [ ] Section 21 contains no @explore reference (removed or replaced with @context text)
- [ ] Section 24 anti-pattern text focuses on @context routing, not @explore avoidance
- [ ] No new @explore mentions introduced
- [ ] Both sections maintain their structural role (summary, anti-patterns)

---

## T5: Add subagent_type Constraint to Section 10 Task Decomposition

**Phase:** 3 (Structural Reinforcement)
**Changes:** 6
**Priority:** P0
**Status:** ✅ COMPLETE — New "Subagent Type" line added to dispatch template in §10 with explicit "general" requirement and @context exploration routing note
**Estimated effort:** 3-5 minutes

### Description

Add an explicit `subagent_type` constraint to the Task Decomposition Format template in section 10. This places the routing constraint at the exact point where the LLM generates dispatch calls, making it maximally effective.

### Changes

**Change 6 -- Add constraint to dispatch template:**
- Add to the task decomposition template:
  ```
  subagent_type: MUST be "general" for all dispatches
                 (exploration routes through @context with subagent_type "general")
  ```
- Position: Within the dispatch format/template structure, near where subagent_type would be specified

### Acceptance Criteria

- [ ] subagent_type constraint visible in section 10 dispatch template
- [ ] Constraint explicitly states "general" as the required value
- [ ] Constraint is positioned at or near the dispatch format (not buried in surrounding text)
- [ ] Exploration routing through @context is mentioned at the constraint point
- [ ] Template remains syntactically valid and readable

<!-- /ANCHOR:phase-3 -->

---

## T6: Post-Implementation Verification

**Phase:** Post-implementation
**Changes:** N/A (verification only)
**Priority:** P1
**Status:** Pending
**Estimated effort:** Spread across 3-5 sessions

### Description

Verify that the orchestrate agent no longer dispatches @explore directly by observing behavior across 3-5 sessions after the fix is applied.

### Verification Method

1. Use the orchestrator normally across 3-5 sessions
2. Monitor Task tool dispatch calls for `subagent_type: "explore"`
3. Count @explore vs @context dispatches
4. Document results

### Acceptance Criteria

- [ ] Zero direct @explore dispatches observed across 3 sessions (minimum)
- [ ] All exploration requests routed through @context
- [ ] No degradation in exploration quality or speed
- [ ] Results documented in implementation-summary.md

---

<!-- ANCHOR:phase-4 -->
## T7: Add Agent Loading Protocol to §3

**Phase:** 4 (Agent Loading Protocol)
**Changes:** Agent Loading Protocol section
**Priority:** P0
**Status:** ✅ Complete
**Estimated effort:** 5-8 minutes

### Description

Add a mandatory Agent Loading Protocol section to §3 that instructs the orchestrator HOW to properly instantiate custom agents before dispatching them.

### Changes

Added 3-step protocol:
1. READ the agent definition file (`.opencode/agent/{agent-name}.md`)
2. INCLUDE the full agent definition in the dispatch prompt
3. SET `subagent_type: "general"` for all custom agents

### Acceptance Criteria

- [x] Protocol block inserted before Agent Files table in §3
- [x] Contains READ → INCLUDE → SET steps with clear instructions
- [x] Includes rationale explaining why this prevents improvisation
- [x] Has exception clause for built-in agents (@general)

**Evidence:** Protocol block inserted with READ → INCLUDE → SET steps, rationale, and exception clause

---

## T8: Add Agent Definition field to §10 + PDR

**Phase:** 4 (Agent Loading Protocol)
**Changes:** Task Decomposition format + PDR format
**Priority:** P0
**Status:** ✅ Complete
**Estimated effort:** 3-5 minutes

### Description

Add "Agent Definition" field to both the Task Decomposition format and the Pre-Dispatch Review (PDR) format in §10 to enforce agent loading at the dispatch point.

### Changes

- Task Decomposition format: Added "Agent Definition" field requiring file path for custom agents
- PDR format: Added "Agent Def" check with three possible states (loaded/built-in/prior-session)

### Acceptance Criteria

- [x] "Agent Definition" field present in Task Decomposition tree structure
- [x] "Agent Def" check present in PDR format
- [x] Both fields properly aligned with existing format structure
- [x] Instructions specify custom agents require file path

**Evidence:** Both fields properly aligned in tree structure

---

## T9: Strengthen @speckit routing + Add anti-pattern

**Phase:** 4 (Agent Loading Protocol)
**Changes:** §5 Rule 5 + §24 Anti-Patterns
**Priority:** P0
**Status:** ✅ Complete
**Estimated effort:** 5-8 minutes

### Description

Strengthen §5 Rule 5 with an explicit Dispatch Protocol showing HOW to properly load and dispatch @speckit. Add anti-pattern to §24 catching agent improvisation.

### Changes

- §5 Rule 5: Added "Dispatch Protocol" subsection with concrete 3-step example for @speckit
- §24 Anti-Patterns: Added new entry "Never improvise custom agent instructions"

### Acceptance Criteria

- [x] Rule 5 includes concrete dispatch example with Read() + Task() calls
- [x] Example shows @speckit loading from `.opencode/agent/speckit.md`
- [x] §24 has new anti-pattern entry about improvisation
- [x] Anti-pattern explains the harm (missing templates, rules, standards)

**Evidence:** Rule 5 now has concrete dispatch instructions; §24 has new entry

<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:cross-refs -->
## Dependencies Between Tasks

```
Phase 1 (T1, T2, T3) -- Can execute in any order within phase
         |
         v
Phase 2 (T4) -- Depends on Phase 1 completion (to count remaining @explore mentions)
         |
         v
Phase 3 (T5) -- Can execute independently, sequenced for review flow
         |
         v
Phase 4 (T7, T8, T9) -- Added during implementation, addresses systemic routing gap
         |
         v
Post (T6) -- Depends on all implementation tasks complete
```

**Note:** T1, T2, and T3 are independent and can be executed in parallel or any order. T4 logically follows because it requires knowing how many @explore mentions remain after Phase 1 changes. T5 is structurally independent but sequenced last for implementation review flow. T7-T9 (Phase 4) were added during implementation when @speckit routing failure was discovered. T6 requires all changes deployed.

<!-- /ANCHOR:cross-refs -->

---
