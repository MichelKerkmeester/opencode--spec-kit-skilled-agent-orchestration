---
title: "Implementation Plan: Sub-Agent Nesting Depth Control [019-incorrect-sub-agent-nesting/plan]"
description: "This implements the Nesting Depth Protocol (NDP) across all three orchestrate.md variants by: (1) adding a new dedicated NDP section that defines 3-tier agent classification, (2..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "sub"
  - "agent"
  - "nesting"
  - "019"
  - "incorrect"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Sub-Agent Nesting Depth Control

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (agent definition files) |
| **Framework** | OpenCode Agent System |
| **Storage** | File-based (.opencode/agent/*.md) |
| **Testing** | Manual verification + diff comparison |

### Overview

This implements the Nesting Depth Protocol (NDP) across all three orchestrate.md variants by: (1) adding a new dedicated NDP section that defines 3-tier agent classification, (2) updating the Task Decomposition Format with a `Depth` field, (3) updating the Sub-Orchestrator Pattern with absolute depth rules, and (4) adding a depth-violation anti-pattern. The approach modifies existing sections surgically rather than rewriting the documents.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (3 files must sync)

### Definition of Done
- [ ] All 3 orchestrate.md files updated with NDP section
- [ ] Agent routing table includes TIER column
- [ ] Task Decomposition Format includes Depth field
- [ ] Anti-pattern added for depth violations
- [ ] All 3 files have identical NDP content
- [ ] Spec docs updated (checklist signed off)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Document-level architecture change — no code, purely markdown definition updates.

### Key Components
- **NDP Section (new Section 27)**: Self-contained section defining the Nesting Depth Protocol
- **Agent Tier Classification**: Added to Section 3 (Agent Routing) as a new column
- **Depth Field**: Added to Section 10 (Task Decomposition Format) and PDR template
- **Anti-Pattern**: Added to Section 24

### Data Flow
```
User Request
  └─► Orchestrator [Depth: 0, Tier: ORCHESTRATOR]
        ├─► @context [Depth: 1, Tier: DISPATCHER]
        │     └─► @explore [Depth: 2, Tier: LEAF] ← MAX, no further nesting
        ├─► @speckit [Depth: 1, Tier: LEAF] ← No sub-dispatch allowed
        ├─► @general [Depth: 1, Tier: LEAF] ← No sub-dispatch allowed
        └─► Sub-Orchestrator [Depth: 1, Tier: ORCHESTRATOR]
              └─► @review [Depth: 2, Tier: LEAF] ← MAX, no further nesting
```

### Illegal Chain (PREVENTED by NDP)
```
User Request
  └─► Orchestrator [Depth: 0]
        └─► Sub-Orchestrator [Depth: 1]
              └─► @context [Depth: 2]
                    └─► @explore [Depth: 3]
                          └─► ??? [Depth: 4] ← ILLEGAL: exceeds max 3
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Design NDP Content
- [x] Define 3-tier agent classification (ORCHESTRATOR, DISPATCHER, LEAF)
- [x] Define depth counting rules
- [x] Define enforcement mechanism (instruction-based, in dispatch templates)
- [x] Write NDP section content

### Phase 2: Update orchestrate.md Files
- [ ] Add NDP section (new Section 27) to base orchestrate.md
- [ ] Update Section 3 Agent Routing table with Tier column
- [ ] Update Section 4 Sub-Orchestrator Pattern with depth inheritance
- [ ] Update Section 10 Task Decomposition Format with Depth field
- [ ] Update Section 10 PDR template with Depth line
- [ ] Add depth-violation anti-pattern to Section 24
- [ ] Apply identical changes to chatgpt/orchestrate.md
- [ ] Apply identical changes to copilot/orchestrate.md
- [ ] Fix copilot Section 11 conflicting "3 levels" → align with NDP

### Phase 3: Verification
- [ ] Diff all 3 files — NDP sections must be identical
- [ ] Verify agent routing table has Tier for every agent
- [ ] Verify Task Decomposition Format has Depth field
- [ ] Verify anti-pattern section has depth violation entry
- [ ] Trace 3 common workflows through NDP to confirm they work within depth limits
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual | Trace workflows through NDP depth rules | Document walkthrough |
| Diff | Compare NDP sections across 3 files | diff/grep |
| Scenario | Test legal chains (depth 1-3) and illegal chains (depth 4+) | Mental model verification |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Base orchestrate.md | Internal | Green | Primary file, must update first |
| ChatGPT orchestrate.md | Internal | Green | Must sync with base |
| Copilot orchestrate.md | Internal | Green | Must sync with base + fix Section 11 |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: NDP rules break existing workflows (e.g., @context cannot dispatch @explore)
- **Procedure**: Revert NDP section changes via git; depth field in dispatch format is additive and harmless
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Design) ──► Phase 2 (Update Files) ──► Phase 3 (Verify)
                           │
                     ┌─────┼─────┐
                     │     │     │
                   base  chatgpt copilot  ← parallel within Phase 2
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Design | None | Update Files |
| Update Files | Design | Verify |
| Verify | Update Files | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Design NDP Content | Medium | Done (in this spec) |
| Update orchestrate.md files | Medium | 30-60 min |
| Verification | Low | 15 min |
| **Total** | | **45-75 min** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (git tracks all changes)
- [ ] All 3 files backed up before edit

### Rollback Procedure
1. `git checkout -- .opencode/agent/orchestrate.md .opencode/agent/chatgpt/orchestrate.md .opencode/agent/copilot/orchestrate.md`
2. Verify rollback with diff
3. No data migration needed

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — pure documentation change
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────────┐     ┌──────────────────────────┐     ┌────────────────┐
│   Phase 1       │────►│      Phase 2             │────►│   Phase 3      │
│   NDP Design    │     │   Update All 3 Files     │     │   Verification │
└─────────────────┘     └──────┬───────┬───────┬───┘     └────────────────┘
                               │       │       │
                         ┌─────▼──┐ ┌──▼────┐ ┌▼───────┐
                         │  base  │ │chatgpt│ │copilot │
                         │  .md   │ │  .md  │ │  .md   │
                         └────────┘ └───────┘ └────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| NDP Design | Spec analysis | NDP section content | All file updates |
| Base orchestrate.md | NDP Design | Reference implementation | ChatGPT, Copilot variants |
| ChatGPT orchestrate.md | Base changes | Synced variant | Verification |
| Copilot orchestrate.md | Base changes | Synced variant (+ Section 11 fix) | Verification |
| Verification | All file updates | Sign-off | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **NDP Content Design** - Complete (this spec) - CRITICAL
2. **Base orchestrate.md Update** - 20 min - CRITICAL
3. **ChatGPT + Copilot Sync** - 15 min (parallel) - CRITICAL
4. **Verification** - 15 min - CRITICAL

**Total Critical Path**: ~50 min

**Parallel Opportunities**:
- ChatGPT and Copilot updates can run simultaneously after base is done
- Verification runs once after all 3 files are updated
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | NDP Design Complete | Spec + plan finalized | Phase 1 |
| M2 | Base File Updated | NDP section, routing table, format, anti-pattern all in base | Phase 2 |
| M3 | All Variants Synced | ChatGPT + Copilot match base NDP | Phase 2 |
| M4 | Verification Complete | Diff confirms sync, workflow trace passes | Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Three-Tier Agent Classification

**Status**: Accepted

**Context**: The current orchestrate.md only distinguishes between "orchestrators" and "agents" but doesn't formally classify which agents are allowed to spawn sub-agents.

**Decision**: Introduce a 3-tier classification: ORCHESTRATOR (can dispatch any agent), DISPATCHER (can dispatch LEAF agents only), LEAF (must not dispatch any sub-agents).

**Consequences**:
- @context becomes DISPATCHER — preserves its ability to dispatch @explore/@research
- All implementation agents (@general, @write, @review, @speckit, @debug, @handover) become LEAF
- Sub-orchestrators become depth-limited ORCHESTRATORs inheriting parent's remaining depth budget

**Alternatives Rejected**:
- Binary ORCHESTRATOR/LEAF (too restrictive — would break @context's dispatch capability)
- No formal classification (status quo — doesn't fix the problem)

---

<!--
LEVEL 3 PLAN
- Core + L2 + L3 addendums
- Dependency graphs, milestones
- Architecture decision records
-->
