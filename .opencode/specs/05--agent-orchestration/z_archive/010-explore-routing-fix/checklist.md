---
title: "Verification Checklist: Fix @explore Direct Dispatch in Orchestrate Agent [010-explore-routing-fix/checklist]"
description: "Verification Date: 2026-02-12"
trigger_phrases:
  - "verification"
  - "checklist"
  - "fix"
  - "explore"
  - "direct"
  - "010"
importance_tier: "normal"
contextType: "implementation"
---
# Verification Checklist: Fix @explore Direct Dispatch in Orchestrate Agent

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval to defer |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] orchestrate.md read and understood before any edits — read in full before changes
- [x] CHK-002 [P0] Current @explore mention count baseline established (~5 mentions) — baseline confirmed at ~5
- [x] CHK-003 [P1] Spec folder (010-explore-routing-fix) established with all Level 2 docs — folder created with spec.md, plan.md, tasks.md, checklist.md

<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:testing -->
## Phase 1: High-Impact Changes (Pink Elephant Elimination)

### Section 3 -- Agent Routing Table (T1: Changes 1, 7, 8)

- [x] CHK-010 [P0] @context row has comprehensive exploration description covering: file search, pattern discovery, keyword search, context loading — rewritten to "ALL codebase exploration, file search, pattern discovery, context loading"
- [x] CHK-011 [P0] @context description contains exclusivity language ("SOLE agent" or equivalent) — includes "The SOLE agent for any exploration need"
- [x] CHK-012 [P0] `subagent_type` column added to Agent Routing Table showing "general" for all agents — column present, all rows show "general"
- [x] CHK-013 [P0] No @explore footnote or row remains in section 3 — footnote replaced with @context-focused note
- [x] CHK-014 [P0] Zero @explore text mentions in section 3 — verified zero mentions

### Section 5 -- Rule 4 (T2: Change 2)

- [x] CHK-020 [P0] Rule 4 title reframed as positive routing instruction (contains "@context", not "Never @explore") — title: "Route ALL Exploration Through @context"
- [x] CHK-021 [P0] Rule 4 body focuses on @context capabilities and benefits — rewritten with memory integration, structured output, thoroughness levels
- [x] CHK-022 [P0] @explore mentioned at most 1 time in entire Rule 4 (down from ~4) — ZERO mentions, fully eliminated
- [x] CHK-023 [P0] No negative framing as primary instruction ("never", "don't" not leading the rule) — positive framing throughout

### Section 5 -- Two-Tier Model (T3: Change 3)

- [x] CHK-030 [P0] Two-Tier Dispatch Model text does not mention "@explore" by name — replaced with "specialized sub-agents"
- [x] CHK-031 [P0] Fast search and deep investigation concepts preserved — both concepts retained in rewritten text
- [x] CHK-032 [P1] @context clearly identified as the dispatcher in Two-Tier Model — @context named as dispatcher

---

## Phase 2: Cleanup (T4: Changes 4, 5)

### Section 21 -- Summary (Change 4)

- [x] CHK-040 [P1] Section 21 contains no @explore reference — replaced with "@context handles ALL exploration tasks exclusively"
- [x] CHK-041 [P1] If replaced (not just removed), replacement text is @context-focused — confirmed @context-focused

### Section 24 -- Anti-Patterns (Change 5)

- [x] CHK-050 [P1] Anti-pattern text focuses on @context routing, not @explore avoidance — "Never bypass @context for exploration tasks"
- [x] CHK-051 [P1] Anti-pattern does not name "@explore" as the thing to avoid — reframed around correct routing

---

## Phase 3: Structural Reinforcement (T5: Change 6)

### Section 10 -- Task Decomposition Format (Change 6)

- [x] CHK-060 [P0] subagent_type constraint present in section 10 dispatch template — new "Subagent Type" line added
- [x] CHK-061 [P0] Constraint explicitly requires "general" as subagent_type value — states MUST be "general"
- [x] CHK-062 [P1] Constraint is positioned at or near the dispatch format (not buried in prose) — inline in dispatch template
- [x] CHK-063 [P1] Exploration routing through @context mentioned at the constraint point — parenthetical note included

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:summary -->
## Global Verification

### @explore Mention Count

- [x] CHK-070 [P1] Total @explore mentions in orchestrate.md reduced from ~5 to <=2 — reduced to 0 (only benign verb "Explore" remains in example task title)
- [x] CHK-071 [P1] Remaining @explore mentions (if any) are in purely technical/footnote context, not instructional — zero @explore mentions remain

### Document Quality

- [x] CHK-080 [P0] All modified sections have valid markdown formatting — verified
- [x] CHK-081 [P0] Table column alignment consistent across all modified tables — verified
- [x] CHK-082 [P0] Section numbering sequential (no gaps or duplicates introduced) — verified
- [x] CHK-083 [P1] No contradictions introduced between modified sections and unchanged sections — verified
- [x] CHK-084 [P1] Cross-references between sections still resolve correctly — verified

### Behavioral Preservation

- [x] CHK-090 [P0] Orchestrator routing logic unchanged (only text/framing changes) — no behavioral changes, only documentation
- [x] CHK-091 [P0] All agents still routable (no agent accidentally removed from table) — all agents present in table
- [x] CHK-092 [P1] @context routing instructions are clear and unambiguous — comprehensive description with exclusivity language

---

## Phase 4: Agent Loading Protocol (P0)

### Section 3 -- Agent Loading Protocol (T7)

- [x] CHK-110 [P0] Agent Loading Protocol section added before Agent Files table in §3 — 3-step protocol with READ → INCLUDE → SET
- [x] CHK-111 [P0] Protocol includes rationale explaining why this prevents improvisation — rationale present
- [x] CHK-112 [P0] Exception clause for built-in agents (@general) included — exception clause present
- [x] CHK-113 [P0] Protocol is positioned prominently (before agent table, not buried) — placed immediately before Agent Files table

### Section 10 -- Agent Definition Fields (T8)

- [x] CHK-120 [P0] "Agent Definition" field added to Task Decomposition format — field added with file path requirement
- [x] CHK-121 [P0] "Agent Def" check added to PDR format — check added with three states (loaded/built-in/prior-session)
- [x] CHK-122 [P0] Both fields properly aligned in tree structure format — alignment verified

### Section 5 & 24 -- @speckit Dispatch + Anti-Pattern (T9)

- [x] CHK-130 [P0] §5 Rule 5 includes concrete Dispatch Protocol with example — 3-step example for @speckit added
- [x] CHK-131 [P0] Dispatch Protocol shows Read() + Task() calls with actual paths — `.opencode/agent/speckit.md` path shown
- [x] CHK-132 [P0] §24 Anti-Patterns has new entry for agent improvisation — "Never improvise custom agent instructions" added
- [x] CHK-133 [P1] Anti-pattern explains harm (missing templates, rules, standards) — explanation included

### Coverage Verification

- [x] CHK-140 [P0] Protocol covers ALL 7 custom agents, not just @speckit — protocol is agent-agnostic, applies to all custom agents
- [x] CHK-141 [P1] Changes address the root cause (no HOW-TO for agent loading) — 3-step protocol provides explicit HOW-TO

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:sign-off -->
## Post-Implementation Verification (T6)

- [ ] CHK-100 [P2] Orchestrator observed across 3+ sessions post-fix
- [ ] CHK-101 [P2] Zero direct @explore dispatches in observed sessions
- [ ] CHK-102 [P2] All exploration requests routed through @context
- [ ] CHK-103 [P2] No degradation in exploration quality or speed
- [ ] CHK-104 [P2] Follow-up spec created for AGENTS.md section 7 updates
- [ ] CHK-105 [P2] context.md agent reviewed for increased routing load readiness

---

## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 28 | 28/28 |
| P1 Items | 14 | 14/14 |
| P2 Items | 6 | 0/6 |
| **Total** | **48** | **42/48** |

**Verification Date**: 2026-02-12

<!-- /ANCHOR:sign-off -->

---
