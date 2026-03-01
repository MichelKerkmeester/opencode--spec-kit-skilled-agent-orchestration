---
title: "Decision Record: Plan-to-Implementation Gate Bypass Fix [134-command-adherence/decision-record]"
description: "Gate 3 (spec folder question) has no concept of workflow phases, causing answers to carry over indefinitely within a conversation. When /spec_kit:plan completes and user says \"i..."
trigger_phrases:
  - "decision"
  - "record"
  - "plan"
  - "implementation"
  - "gate"
  - "decision record"
  - "134"
  - "command"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: Plan-to-Implementation Gate Bypass Fix

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Phase Boundary Rule vs Gate Expiry

<!-- ANCHOR:adr-001-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-17 |
| **Deciders** | System Design Team |

---

### Context

Gate 3 (spec folder question) has no concept of workflow phases, causing answers to carry over indefinitely within a conversation. When `/spec_kit:plan` completes and user says "implement this" (free text), the agent assumes the Gate 3 answer from the plan phase still applies and skips re-asking. This bypasses the mandatory gate system for implementation workflows.

### Constraints

- Must fix gate bypass without breaking existing workflows
- Cannot introduce timer-based logic (instruction system lacks primitives)
- Must preserve Memory Save Rule convenience (spec folder carry-over for saves)
- Cannot modify tool behavior (EnterPlanMode/ExitPlanMode are read-only)
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**Summary**: Add explicit PHASE BOUNDARY RULE to Gate 3 stating answers apply only within the current workflow phase. New workflow phases (plan → implement) require gate re-evaluation.

**Details**: Insert instruction block in CLAUDE.md Gate 3 (before closing line ~147) explaining:
1. Gate 3 answers apply ONLY within the current workflow phase
2. When plan workflow completes and user requests implementation, Gate 3 MUST be re-evaluated
3. Free-text implement requests → Route through `/spec_kit:implement`
4. Plan phase Gate 3 answer does NOT auto-carry to implementation phase
5. Exception: Gate 3 carry-over IS valid for Memory Save Rule (post-execution, not new phase)
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Phase Boundary Rule** | Clear separation, instruction-based, no breaking changes | Adds complexity to Gate 3 block | 9/10 |
| Gate Expiry Timers | Automatic reset after timeout | Complex, no timer primitives in instruction system | 3/10 |
| Remove Carry-Over Entirely | Simplest rule (always re-ask) | Breaks Memory Save convenience (UX regression) | 4/10 |
| Tool-Based Phase Tracking | Enforced by EnterPlanMode/ExitPlanMode | Cannot modify tool behavior (tools are read-only) | 2/10 |

**Why Chosen**: Phase boundary rule is instruction-based (no new primitives required), preserves Memory Save convenience, and provides clear guidance for when gates expire. Minimal complexity increase with clear examples.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**Positive**:
- Clear separation between workflow phases (plan vs implement)
- Consistent gate enforcement across phase transitions
- Preserves Memory Save Rule convenience (post-execution carry-over valid)
- No breaking changes to existing tools or workflows

**Negative**:
- Adds ~6 lines to Gate 3 block - Mitigation: Clear formatting with examples

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Agent misinterprets phase boundary | M | Explicit examples (plan→implement), clear termination markers |
| Over-application to single-phase workflows | H | Explicit exception for `/spec_kit:complete` |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Solving actual problem: gate bypass in production |
| 2 | **Beyond Local Maxima?** | PASS | Evaluated 4 alternatives (timer, remove carry-over, tools, phase boundary) |
| 3 | **Sufficient?** | PASS | Instruction-based rule sufficient to fix behavior |
| 4 | **Fits Goal?** | PASS | Directly addresses gate bypass without breaking existing workflows |
| 5 | **Open Horizons?** | PASS | Pattern extensible to other workflow phase transitions |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**Affected Systems**:
- CLAUDE.md: Gate 3 block (lines ~127-149)

**Rollback**: Remove PHASE BOUNDARY RULE section from Gate 3 block
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Enforcement Block Location (YAML Termination vs Tool Logic)

<!-- ANCHOR:adr-002-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-17 |
| **Deciders** | System Design Team |

---

### Context

Plan workflows (`/spec_kit:plan`) terminate with `next_steps: ["Use /spec_kit:implement:auto or /spec_kit:implement:confirm"]` as a suggestion, but when users use free text ("implement this" instead of invoking the command), the message bypasses the command system entirely and there's no enforcement routing it back. The agent proceeds directly to coding, skipping all gates.

### Constraints

- Cannot modify EnterPlanMode/ExitPlanMode tools (behavior is read-only)
- Must work with instruction-based system (no code changes)
- Must provide clear user feedback (not silent routing)
- Must not break direct `/spec_kit:implement` invocations
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**Summary**: Add `enforcement:` block to plan YAML termination sections requiring agent to route free-text implement requests through `/spec_kit:implement` command.

**Details**: After the `next_steps:` line in both `spec_kit_plan_auto.yaml` and `spec_kit_plan_confirm.yaml`, add:

```yaml
enforcement: |
  CRITICAL: If user requests implementation via free text (e.g., "implement this",
  "go ahead", "start coding"), you MUST:
  1. Route through /spec_kit:implement command (do NOT implement directly)
  2. Re-evaluate Gate 3 (spec folder confirmation for implementation phase)
  3. NEVER skip gates because they were passed during plan phase
  Plan and implementation are SEPARATE gate-checked workflows.
```
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **YAML Enforcement Block** | Instruction-based, clear rationale, no code changes | Agent must recognize free-text intent | 9/10 |
| Tool-Based Enforcement | Automated, foolproof | Cannot modify tool behavior (tools are read-only) | 1/10 |
| Silent Routing | Simple | No user feedback, confusing UX | 4/10 |
| Remove Free-Text Support | Forces command usage | Poor UX, users expect natural language | 2/10 |

**Why Chosen**: YAML enforcement blocks are instruction-based (no code changes), provide clear rationale for routing (user education), and maintain natural language flexibility while enforcing safety checks.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**Positive**:
- Instruction-based enforcement (no code changes required)
- Clear rationale for routing ("separate gate-checked phases") educates users
- Maintains natural language flexibility (doesn't force command invocation syntax)
- Consistent across both plan workflow variants (auto + confirm)

**Negative**:
- Agent must recognize free-text intent (e.g., "go ahead" = implement request) - Mitigation: Natural language understanding, examples in enforcement text

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Agent fails to detect implement intent | H | Comprehensive example list ("implement", "go ahead", "start coding") |
| Over-routing (false positives) | L | User can still invoke `/spec_kit:implement` directly (bypass enforcement) |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Must prevent gate bypass via free-text requests |
| 2 | **Beyond Local Maxima?** | PASS | Evaluated 4 alternatives (tool, silent, remove support, YAML) |
| 3 | **Sufficient?** | PASS | Enforcement block sufficient to trigger routing |
| 4 | **Fits Goal?** | PASS | Directly enforces gate re-evaluation for implement phase |
| 5 | **Open Horizons?** | PASS | Pattern reusable for other workflow transitions |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**Affected Systems**:
- `.opencode/command/spec_kit/spec_kit_plan_auto.yaml` (termination section)
- `.opencode/command/spec_kit/spec_kit_plan_confirm.yaml` (termination section)

**Rollback**: Remove `enforcement:` blocks from both YAML files
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Memory Save Rule Scoping Strategy

<!-- ANCHOR:adr-003-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-17 |
| **Deciders** | System Design Team |

---

### Context

The Memory Save Rule (CLAUDE.md lines 184-186) says: "If spec folder was established at Gate 3 in this conversation → USE IT as the folder argument (do NOT re-ask the user)." This instruction — intended only for memory saves — creates a precedent the agent generalizes: "don't re-ask Gate 3 questions that were already answered." The agent applies this to implementation requests too, causing the gate bypass bug.

### Constraints

- Must preserve Memory Save convenience (users shouldn't be re-asked spec folder for every save)
- Must prevent over-generalization to workflow phase transitions
- Must maintain backward compatibility (no UX regressions)
- Must be clear enough to prevent agent misinterpretation
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**Summary**: Add explicit scope to Memory Save Rule: "This carry-over applies ONLY to memory saves. New workflow phases (plan → implement) MUST re-evaluate Gate 3."

**Details**: Update CLAUDE.md Memory Save Rule (lines 184-186):

**Before**:
```
│   0. If spec folder was established at Gate 3 in this conversation →        │
│      USE IT as the folder argument (do NOT re-ask the user).                │
│      Gate 3's answer is the session's active spec folder.                   │
```

**After**:
```
│   0. If spec folder was established at Gate 3 in this conversation →        │
│      USE IT as the folder argument for memory saves (do NOT re-ask).        │
│      NOTE: This carry-over applies ONLY to memory saves. New workflow       │
│      phases (plan→implement) MUST re-evaluate Gate 3.                       │
```
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Explicit Scoping** | Preserves convenience, prevents over-generalization | Adds 2 lines | 10/10 |
| Remove "do NOT re-ask" | Simplest wording | Causes user re-prompts on every memory save (UX regression) | 3/10 |
| Separate Rule for Phases | Clear separation | Code duplication, harder to maintain | 6/10 |
| Move Rule to Memory Section | Clearer context | Breaks logical flow (rule is post-execution) | 5/10 |

**Why Chosen**: Explicit scoping is the surgical fix that preserves existing behavior while preventing misapplication. Minimal line count increase (2 lines) with clear directive.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**Positive**:
- Preserves Memory Save convenience (no UX regression)
- Prevents misapplication to workflow phase transitions
- Clear directive ("ONLY to memory saves") prevents agent confusion
- Minimal change (2 lines added)

**Negative**:
- None identified

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Agent still over-generalizes | M | Explicit "ONLY" and "MUST re-evaluate" directives |
| Memory Save Rule breaks | L | No behavior change, only clarification |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Must prevent over-generalization causing gate bypass |
| 2 | **Beyond Local Maxima?** | PASS | Evaluated 4 alternatives (remove, separate, move, scope) |
| 3 | **Sufficient?** | PASS | Explicit scoping sufficient to prevent misapplication |
| 4 | **Fits Goal?** | PASS | Preserves convenience while fixing bug |
| 5 | **Open Horizons?** | PASS | Pattern reusable for other carry-over rules |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**Affected Systems**:
- CLAUDE.md: Memory Save Rule (lines 184-186)

**Rollback**: Revert to original 3-line Memory Save Rule (remove scoping note)
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!--
Level 3 Decision Record
Document significant technical decisions
One ADR per major decision
Bug fix ADRs (pre-implementation)
-->
