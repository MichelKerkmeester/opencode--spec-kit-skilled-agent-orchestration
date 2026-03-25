---
title: Five Checks Framework
description: Evaluation framework for validating significant decisions before implementation
---

# Five Checks Framework

Evaluation framework for validating significant decisions before implementation.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Core Principle

Every significant decision must earn its existence through five explicit checks: Necessary?, Beyond Local Maxima?, Sufficient?, Fits Goal?, Open Horizons?

### When to Apply Five Checks

**Mandatory Application:**
- Changes exceeding 100 LOC
- Architectural decisions
- Level 3/3+ spec folders
- Any decision with long-term implications

**Recommended Application:**
- Level 2 spec folders
- Decisions affecting multiple components
- Introduction of new patterns or abstractions

**Not Required:**
- Level 1 spec folders (<100 LOC)
- Bug fixes with obvious solutions
- Trivial documentation changes (typos, formatting, copy edits) — NOT coordination-contract or ADR-governed documentation changes

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:the-five-checks -->
## 2. THE FIVE CHECKS

### Check 1: Necessary?

**Question:** Is this solving an ACTUAL need NOW?

**Evaluation Criteria:**
- Clear, documented requirement exists
- Not speculative or "future-proofing"
- Addresses real pain point or blocker
- User or system explicitly needs this

**PASS Examples:**
- "User requested feature X" - documented in spec.md
- "Bug Y is blocking production" - reproduction confirmed
- "Dependency Z requires upgrade" - security advisory cited

**FAIL Examples:**
- "This might be useful later"
- "Best practice says we should..."
- "Other projects do it this way"

---

### Check 2: Beyond Local Maxima?

**Question:** Have we explored alternatives?

**Evaluation Criteria:**
- At least 2 alternative approaches considered
- Trade-offs documented for each
- Selected approach justified against alternatives
- Not defaulting to first idea or familiar pattern

**PASS Examples:**
- "Considered A (fast, complex), B (slow, simple), C (balanced). Chose C because [justification]"
- "Evaluated library X vs custom implementation. Library chosen due to maintenance burden"

**FAIL Examples:**
- "This is the obvious solution"
- "We always do it this way"
- Only one approach considered

**Documentation Format:**
```
ALTERNATIVES CONSIDERED:
1. [Approach A] - Pros: [x], Cons: [y]
2. [Approach B] - Pros: [x], Cons: [y]
3. [Selected Approach C] - Pros: [x], Cons: [y]

SELECTION RATIONALE: [Why C over A and B]
```

---

### Check 3: Sufficient?

**Question:** Is this the simplest approach that works?

**Evaluation Criteria:**
- No simpler solution achieves the goal
- Removes unnecessary complexity
- Uses existing patterns where possible
- Every abstraction earns its existence

**PASS Examples:**
- "Single function handles case; class hierarchy would be overkill"
- "Using existing utility from shared module instead of new implementation"
- "Direct approach works; no need for design pattern"

**FAIL Examples:**
- Introducing abstraction for single use case
- Creating new utility when existing one works
- Adding configuration for non-variable behavior

**Simplicity Validation:**
```
SIMPLICITY CHECK:
- Could a simpler solution work? [YES/NO] - [explanation]
- Are there existing patterns to reuse? [YES/NO] - [what patterns]
- Does every new element serve a purpose? [YES/NO] - [justification]
```

---

### Check 4: Fits Goal?

**Question:** Does this stay on the critical path?

**Evaluation Criteria:**
- Directly advances stated objective
- No scope creep or gold-plating
- Aligned with spec.md requirements
- Not solving adjacent problems

**PASS Examples:**
- "Implements exactly what spec.md requests"
- "Fixes the reported bug without refactoring surrounding code"
- "Adds feature without 'improving' unrelated systems"

**FAIL Examples:**
- "While I'm here, let me also..."
- "This tangentially relates to..."
- "It would be nice to also..."

**Alignment Verification:**
```
GOAL ALIGNMENT:
- Original request: [what was asked]
- This change: [what we're doing]
- Match: [DIRECT/PARTIAL/DRIFT]
```

---

### Check 5: Open Horizons?

**Question:** Does this maintain long-term alignment?

**Evaluation Criteria:**
- Doesn't create technical debt
- Doesn't lock into specific vendor/approach
- Maintains flexibility for future changes
- Consistent with system architecture

**PASS Examples:**
- "Using standard interface allows swapping implementations"
- "Following established patterns maintains consistency"
- "No hard-coded values; configuration externalized"

**FAIL Examples:**
- "Quick fix now, proper solution later"
- "Tight coupling to specific service"
- "Works but violates architecture principles"

**Long-term Considerations:**
```
HORIZON CHECK:
- Technical debt introduced? [YES/NO] - [if yes, mitigation plan]
- Vendor lock-in? [YES/NO] - [if yes, exit strategy]
- Architecture alignment? [YES/NO] - [pattern followed]
```

---

<!-- /ANCHOR:the-five-checks -->
<!-- ANCHOR:evaluation-format -->
## 3. EVALUATION FORMAT

### Quick Assessment Table

| Check | Result | Evidence |
|-------|--------|----------|
| 1. Necessary? | PASS/FAIL | [specific justification] |
| 2. Beyond Local Maxima? | PASS/FAIL | [alternatives considered] |
| 3. Sufficient? | PASS/FAIL | [simplicity justification] |
| 4. Fits Goal? | PASS/FAIL | [alignment evidence] |
| 5. Open Horizons? | PASS/FAIL | [long-term considerations] |

**RESULT:** X/5 PASS

### Pass/Fail Criteria

**Overall PASS:** 5/5 checks pass
**Conditional PASS:** 4/5 with documented mitigation for failed check
**FAIL:** 3 or fewer checks pass - requires reconsideration

### Handling Failures

When a check fails:
1. Document the failure clearly
2. Propose remediation
3. Seek user approval before proceeding
4. Record decision in decision-record.md

---

<!-- /ANCHOR:evaluation-format -->
<!-- ANCHOR:examples -->
## 4. EXAMPLES

### Example A: Decision That Passes All Checks

**Context:** Adding error boundary to React component

```
FIVE CHECKS:
1. Necessary? PASS - User reported unhandled exceptions crashing the page
2. Beyond Local Maxima? PASS - Considered: (a) try/catch in render,
   (b) error boundary component, (c) global handler. Error boundary
   chosen for React best practice and component isolation
3. Sufficient? PASS - Single ErrorBoundary wrapper, no custom UI
   (uses existing error display component)
4. Fits Goal? PASS - Exactly addresses crash on render error, no
   additional features added
5. Open Horizons? PASS - Standard React pattern, works with any child
   component, no vendor lock-in

RESULT: 5/5 PASS - PROCEED
```

### Example B: Decision That Fails (with Remediation)

**Context:** Proposing to add Redux for state management

```
FIVE CHECKS:
1. Necessary? FAIL - Only 2 components share state currently;
   prop drilling is minimal
2. Beyond Local Maxima? PASS - Considered: Context API, Zustand,
   Redux. Redux chosen for team familiarity
3. Sufficient? FAIL - Context API would handle current needs with
   less complexity
4. Fits Goal? PASS - Would solve state sharing requirement
5. Open Horizons? PASS - Redux is well-maintained, standard patterns

RESULT: 3/5 PASS - RECONSIDER

REMEDIATION:
- Use React Context for current needs
- Document Redux as future option if state complexity grows
- Re-evaluate when >5 components share state
```

---

<!-- /ANCHOR:examples -->
<!-- ANCHOR:integration-with-decision-records -->
## 5. INTEGRATION WITH DECISION RECORDS

### Placement in decision-record.md

For Level 3/3+ spec folders, include Five Checks in the decision record:

```markdown
## Decision: [Decision Title]

### Context
[Background on why decision needed]

### Five Checks Evaluation

| Check | Result | Evidence |
|-------|--------|----------|
| Necessary? | PASS | [evidence] |
| Beyond Local Maxima? | PASS | [evidence] |
| Sufficient? | PASS | [evidence] |
| Fits Goal? | PASS | [evidence] |
| Open Horizons? | PASS | [evidence] |

**Result:** 5/5 PASS

### Decision
[What was decided]

### Consequences
[Expected outcomes and trade-offs]
```

### Cross-Reference

- **Templates:** `.opencode/skill/system-spec-kit/templates/`
- **Level 3 Template:** Includes Five Checks section
- **Level 3+ Template:** Extended Five Checks with stakeholder sign-off

---

<!-- /ANCHOR:integration-with-decision-records -->
<!-- ANCHOR:quick-reference -->
## 6. QUICK REFERENCE

```
FIVE CHECKS QUICK ASSESSMENT:
1. Necessary?      [PASS/FAIL] - Solving ACTUAL need NOW?
2. Local Maxima?   [PASS/FAIL] - Explored >=2 alternatives?
3. Sufficient?     [PASS/FAIL] - Simplest that works?
4. Fits Goal?      [PASS/FAIL] - On critical path?
5. Open Horizons?  [PASS/FAIL] - Long-term aligned?

RESULT: [X/5 PASS] -> [PROCEED/RECONSIDER]
```

---

<!-- /ANCHOR:quick-reference -->
<!-- ANCHOR:related-resources -->
## 7. RELATED RESOURCES

- [Structured Gate Decision Format](./decision_format.md) - Standard format for documenting decisions
- [Checklist Template](../../templates/level_2/checklist.md) - Level 2+ validation checklist structure
- [SKILL.md - Validation Workflow](../../SKILL.md) - Overview of validation workflows (Section 3)
- [Decision Record Template](../../templates/level_3/decision-record.md) - For documenting Level 3/3+ decisions
<!-- /ANCHOR:related-resources -->
