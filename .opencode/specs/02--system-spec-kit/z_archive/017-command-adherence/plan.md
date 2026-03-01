---
title: "Implementation Plan: Plan-to-Implementation Gate Bypass Fix [134-command-adherence/plan]"
description: "Fix gate bypass bug by adding phase boundary concept to CLAUDE.md Gate 3, scoping Memory Save Rule to memory saves only, and adding enforcement blocks to plan command YAML termi..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "gate"
  - "134"
  - "command"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Plan-to-Implementation Gate Bypass Fix

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (documentation), YAML (command configs) |
| **Framework** | OpenCode Claude Code instruction system |
| **Storage** | None (file-based configuration) |
| **Testing** | Manual verification (plan → free-text implement → observe behavior) |

### Overview

Fix gate bypass bug by adding phase boundary concept to CLAUDE.md Gate 3, scoping Memory Save Rule to memory saves only, and adding enforcement blocks to plan command YAML termination sections. All changes are instruction-text additions (~40 LOC total across 5 files). Implementation is a behavioral fix via instruction clarification, not code changes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Root cause analysis documented (3 compounding factors identified)
- [ ] All 5 affected files identified with exact line numbers
- [ ] Fix approach reviewed and approved

### Definition of Done
- [ ] All 5 files updated with phase boundary enforcement
- [ ] Manual test passes (plan → free-text implement → routes through command)
- [ ] No regressions in Memory Save Rule or `/spec_kit:complete` workflow
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:ai-execution-protocol -->
## 2A. AI EXECUTION PROTOCOL

### Pre-Task Checklist

- Confirm spec scope and target files before editing
- Re-run validator after documentation changes
- Keep phase-boundary wording consistent across all updated files

### Task Execution Rules

| Rule ID | Rule | Enforcement |
|---------|------|-------------|
| TASK-SEQ | Execute phases in order unless explicitly parallelized | Prevents verification before prerequisite updates |
| TASK-SCOPE | Change only files listed in spec scope | Prevents scope creep |
| TASK-VERIFY | Re-run validation after each fix batch | Ensures issues are actually resolved |

### Status Reporting Format

- Report phase progress as: `Phase X: <status> - <evidence>`
- Include validation result summary after each remediation cycle

### Blocked Task Protocol

- If a validation error cannot be resolved safely, mark task `BLOCKED` with cause and proposed workaround
- Do not proceed to handover generation while blocking issues remain unresolved or unapproved
<!-- /ANCHOR:ai-execution-protocol -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Instruction-based behavioral enforcement via documentation + command configuration

### Key Components

- **CLAUDE.md Gate 3**: Mandatory gate system enforcement (HARD BLOCK)
- **Memory Save Rule**: Post-execution rule for context saving (spec folder carry-over)
- **Plan YAML termination**: Command workflow termination with next-step guidance
- **plan.md command**: User-facing documentation for `/spec_kit:plan` workflow

### Data Flow

1. User completes `/spec_kit:plan` workflow
2. Agent reads plan YAML termination section with enforcement block
3. User says "implement this" (free text, not command invocation)
4. Agent checks CLAUDE.md Gate 3 PHASE BOUNDARY RULE
5. Agent recognizes new workflow phase, re-evaluates Gate 3
6. Agent routes request through `/spec_kit:implement` command per enforcement
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: CLAUDE.md Gate 3 Phase Boundary

- [ ] Add PHASE BOUNDARY RULE inside Gate 3 block (before closing line ~147)
- [ ] Content: Explain Gate 3 answers apply only within current workflow phase
- [ ] Content: Define phase transition triggers (plan → implement)
- [ ] Content: Exception for Memory Save Rule (post-execution, not new phase)

### Phase 2: CLAUDE.md Memory Save Rule Scoping

- [ ] Update Memory Save Rule lines 184-186
- [ ] Scope "do NOT re-ask" to memory saves explicitly
- [ ] Add note: Carry-over does NOT apply to new workflow phases (plan → implement)

### Phase 3: Plan YAML Enforcement Blocks

- [ ] Add enforcement block to `spec_kit_plan_auto.yaml` termination (after line 428)
- [ ] Add enforcement block to `spec_kit_plan_confirm.yaml` termination (after line 480)
- [ ] Content: Free-text implement requests MUST route through `/spec_kit:implement`
- [ ] Content: Plan and implementation are SEPARATE gate-checked workflows

### Phase 4: plan.md Command Enforcement Note

- [ ] Add enforcement note after line 121 in `plan.md`
- [ ] Content: If user requests implementation via free text, MUST route through implement command
- [ ] Content: Cite phase boundary concept (plan vs implementation)

### Phase 5: Verification

- [ ] Manual test: Run `/spec_kit:plan` → complete → say "implement this"
- [ ] Verify: Agent re-asks Gate 3 question (A/B/C/D) instead of coding
- [ ] Verify: Agent routes through `/spec_kit:implement` command
- [ ] Verify: Memory save still uses session spec folder (no regression)
- [ ] Verify: `/spec_kit:complete` workflow unchanged (single-phase)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual | Plan → free-text implement behavior | Claude Code session |
| Regression | Memory Save Rule (spec folder carry-over) | `/memory:save` invocation |
| Regression | `/spec_kit:complete` workflow (no phase boundary) | Full complete command |
| Edge Case | Different user phrasings ("go ahead", "start coding") | Manual testing |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| CLAUDE.md gate system | Internal | Green | Core instruction file, must coordinate changes |
| Plan YAML termination sections | Internal | Green | Command configuration, must preserve existing next_steps |
| plan.md command docs | Internal | Green | User-facing documentation, consistency required |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: If enforcement breaks valid workflows (e.g., `/spec_kit:complete`) or causes excessive user re-prompts
- **Procedure**: Revert changes to all 5 files (remove PHASE BOUNDARY sections, restore original Memory Save Rule, remove enforcement blocks)
<!-- /ANCHOR:rollback -->

---

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Gate 3 Rule) ────┐
                          ├──► Phase 5 (Verification)
Phase 2 (Memory Rule) ────┤
                          ├──► Phase 5 (Verification)
Phase 3 (YAML Blocks) ────┤
                          ├──► Phase 5 (Verification)
Phase 4 (plan.md) ────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Gate 3 Rule | None | Verification |
| Memory Rule | None | Verification |
| YAML Blocks | None | Verification |
| plan.md Note | None | Verification |
| Verification | Phases 1-4 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Gate 3 Rule | Low | 15-20 minutes |
| Memory Rule | Low | 10 minutes |
| YAML Blocks | Low | 20 minutes (2 files) |
| plan.md Note | Low | 10 minutes |
| Verification | Medium | 30-45 minutes (manual testing) |
| **Total** | | **1.5-2 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [ ] Backup current CLAUDE.md (copy to scratch/)
- [ ] Backup plan YAML files (copy to scratch/)
- [ ] No data changes (instruction-only fix)

### Rollback Procedure

1. Revert CLAUDE.md Gate 3 PHASE BOUNDARY RULE (delete added section)
2. Revert CLAUDE.md Memory Save Rule scoping (restore original 3 lines)
3. Revert plan YAML enforcement blocks (delete added termination content)
4. Revert plan.md enforcement note (delete added paragraph)
5. Verify agent behavior returns to original (plan → implement without gate re-check)

### Data Reversal

- **Has data migrations?** No
- **Reversal procedure**: N/A (instruction-only change)
<!-- /ANCHOR:enhanced-rollback -->

---

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────────────┐     ┌─────────────────────┐
│  Phase 1: Gate 3    │────►│  Phase 5: Verify    │
│  PHASE BOUNDARY     │     │  (manual test)      │
└─────────────────────┘     └─────────────────────┘
                             ▲
┌─────────────────────┐     │
│  Phase 2: Memory    │─────┤
│  Save Rule Scope    │     │
└─────────────────────┘     │
                             │
┌─────────────────────┐     │
│  Phase 3: YAML      │─────┤
│  Enforcement (x2)   │     │
└─────────────────────┘     │
                             │
┌─────────────────────┐     │
│  Phase 4: plan.md   │─────┘
│  Enforcement Note   │
└─────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Gate 3 Rule | None | Phase boundary concept | Verification |
| Memory Rule Scope | None | Clarified carry-over | Verification |
| YAML Enforcement | None | Routing requirement | Verification |
| plan.md Note | None | User-facing guidance | Verification |
| Verification | All above | Test results | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Gate 3 PHASE BOUNDARY RULE** - 15-20 minutes - CRITICAL
2. **Memory Save Rule Scoping** - 10 minutes - CRITICAL
3. **YAML Enforcement Blocks** - 20 minutes - CRITICAL
4. **Manual Verification** - 30-45 minutes - CRITICAL

**Total Critical Path**: 1.25-1.75 hours

**Parallel Opportunities**:

- Phases 1-4 can be done in any order (all independent file changes)
- Documentation synchronization (all files) can occur simultaneously
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Instruction Updates Complete | All 5 files modified | End of Phases 1-4 |
| M2 | Manual Test Passes | Free-text implement routes through command | Phase 5 end |
| M3 | Regression Tests Pass | Memory save + complete workflow unchanged | Phase 5 end |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Phase Boundary Rule vs Gate Expiry

**Status**: Accepted

**Context**: Gate 3 has no concept of workflow phases, causing answers to carry over indefinitely. Need to fix this without breaking existing workflows.

**Decision**: Add explicit PHASE BOUNDARY RULE to Gate 3 stating answers apply only within current workflow phase. New workflow phases (plan → implement) require gate re-evaluation.

**Consequences**:

- **Positive**: Clear separation between workflow phases, consistent gate enforcement
- **Positive**: Preserves Memory Save Rule convenience (post-execution, not new phase)
- **Negative**: Adds complexity to Gate 3 block (mitigated by clear documentation)

**Alternatives Rejected**:

- **Gate expiry timers**: Too complex, difficult to tune, instruction-based system lacks timer primitives
- **Remove carry-over entirely**: Would break Memory Save Rule convenience (UX regression)

---

### ADR-002: Enforcement Block Location (YAML vs Command Logic)

**Status**: Accepted

**Context**: Plan workflows terminate with `next_steps` suggestion, but free-text implement bypasses this. Need enforcement mechanism.

**Decision**: Add `enforcement:` block to plan YAML termination sections requiring routing free-text implement requests through `/spec_kit:implement` command.

**Consequences**:

- **Positive**: Instruction-based enforcement, no code changes required
- **Positive**: Clear rationale for routing ("separate gate-checked phases")
- **Negative**: Agent must recognize free-text intent (mitigated by natural language understanding)

**Alternatives Rejected**:

- **Tool-based enforcement**: Would require EnterPlanMode/ExitPlanMode tool modifications (not possible, tool behavior can't be changed)
- **Silent routing**: Agent should explain routing for transparency (user education)

---

### ADR-003: Memory Save Rule Scoping Strategy

**Status**: Accepted

**Context**: Memory Save Rule's "do NOT re-ask" language gets over-generalized to implementation requests. Need to scope without breaking existing behavior.

**Decision**: Add explicit scope: "This carry-over applies ONLY to memory saves. New workflow phases (plan → implement) MUST re-evaluate Gate 3."

**Consequences**:

- **Positive**: Preserves Memory Save convenience (no UX regression)
- **Positive**: Prevents misapplication to workflow phase transitions
- **Negative**: Adds line count to Memory Save Rule (minor, 2 lines)

**Alternatives Rejected**:

- **Remove "do NOT re-ask" entirely**: Would cause user re-prompts on every memory save (UX regression)
- **Separate rule for phase transitions**: Code duplication, harder to maintain

---

<!--
LEVEL 3 PLAN (~280 lines)
- Core + L2 + L3 addendums
- Dependency graphs, milestones
- Architecture decision records
- Bug fix plan (pre-implementation)
-->
