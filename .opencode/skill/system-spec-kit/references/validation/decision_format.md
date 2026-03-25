---
title: Structured Gate Decision Format
description: Standardized format for documenting gate decisions to ensure auditability and traceability
---

# Structured Gate Decision Format

Standardized format for documenting gate decisions to ensure auditability and traceability.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

The Structured Gate Decision Format provides a consistent way to document decisions made at each gate in the workflow. This format ensures:

- **Auditability:** Decisions can be reviewed and understood later
- **Traceability:** Evidence links decisions to sources
- **Consistency:** Same format across all gates and decisions
- **Reproducibility:** Another agent can understand and verify decisions

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:the-format -->
## 2. THE FORMAT

### Standard Gate Decision

```
GATE: [GATE_NAME]
DECISION: [PASS | BLOCK]
CONFIDENCE: [HIGH | MEDIUM | LOW]
UNCERTAINTY: [0.0-1.0]
EVIDENCE: [Brief justification with source citation]

[If BLOCK:]
RESOLUTION_PATH: [Specific steps to unblock]
ALTERNATIVE: [Suggested alternative approach if applicable]
```

### Compact Format (for inline use)

```
GATE: [NAME] | DECISION: [PASS/BLOCK] | CONFIDENCE: [H/M/L] | EVIDENCE: [brief]
```

### Architectural Decision Records (ADR)

For Level 3+ spec folders, `decision-record.md` may also contain ADR entries:
- **ADR-NNN**: Unique identifier (e.g., ADR-001)
- **Status**: proposed | accepted | superseded | deprecated
- **Context**: Problem statement and constraints
- **Decision**: The chosen approach
- **Alternatives Considered**: Other options evaluated
- **Consequences**: Impact of the decision

ADR entries are particularly important for coordination-root decisions that establish source-of-truth policy.

---

<!-- /ANCHOR:the-format -->
<!-- ANCHOR:field-definitions -->
## 3. FIELD DEFINITIONS

### GATE

**Purpose:** Identifies which gate is being evaluated

**Valid Values:**
- `UNDERSTANDING` - Gate 1: Understanding + context surfacing
- `SKILL ROUTING` - Gate 2: Skill routing verification
- `SPEC FOLDER` - Gate 3: Spec folder question
- `MEMORY CONTEXT` - Memory context loading
- `COMPLETION` - Completion verification
- `MEMORY SAVE` - Memory save rule

**Example:**
```
GATE: SPEC FOLDER
```

---

### DECISION

**Purpose:** Binary outcome of the gate evaluation

**Valid Values:**
- `PASS` - Gate requirements satisfied, proceed to next gate or execution
- `BLOCK` - Gate requirements not met, requires resolution before proceeding

**Example:**
```
DECISION: PASS
```

---

### CONFIDENCE

**Purpose:** Qualitative assessment of decision certainty

**Valid Values:**
- `HIGH` - 80-100%: Strong evidence, clear requirements
- `MEDIUM` - 40-79%: Some evidence, minor ambiguity
- `LOW` - 0-39%: Limited evidence, significant ambiguity

**Example:**
```
CONFIDENCE: HIGH
```

---

### UNCERTAINTY

**Purpose:** Quantitative measure of unknown factors (dual-threshold system)

**Valid Range:** 0.0 to 1.0

**Thresholds:**
- `<= 0.35` (LOW) - Sufficient context, proceed
- `0.36-0.60` (MEDIUM) - Investigate unknowns first
- `> 0.60` (HIGH) - Too many unknowns, require clarification

**Factors Contributing to Uncertainty:**
| Factor | Weight | Question |
|--------|--------|----------|
| Epistemic gaps | 0.30 | What don't I know? |
| Model boundaries | 0.25 | At capability limits? |
| Temporal variability | 0.20 | How stable is this knowledge? |
| Situational completeness | 0.25 | Context sufficient? |

**Example:**
```
UNCERTAINTY: 0.25
```

---

### EVIDENCE

**Purpose:** Specific, citable justification for the decision

**Format Requirements:**
- Cite specific sources (file paths, line numbers)
- Reference user statements with quotes
- Include verification method used
- State "UNKNOWN" for unverified claims

**Good Evidence Examples:**
```
EVIDENCE: User specified "specs/077-speckit-upgrade" - path exists, contains spec.md
EVIDENCE: skill_advisor.py returned system-spec-kit (0.85) for "speckit upgrade" query
EVIDENCE: checklist.md shows all P0 items marked [x] with timestamps
```

**Poor Evidence Examples:**
```
EVIDENCE: Seems correct
EVIDENCE: Standard approach
EVIDENCE: [no citation]
```

---

### RESOLUTION_PATH (BLOCK only)

**Purpose:** Specific steps to unblock the gate

**Requirements:**
- Actionable steps
- Clear sequence
- Measurable completion criteria

**Example:**
```
RESOLUTION_PATH:
1. Ask user to select spec folder (A/B/C/D/E)
2. Wait for response
3. Re-evaluate gate with selected path
```

---

### ALTERNATIVE (BLOCK only)

**Purpose:** Suggested alternative approach if primary path blocked

**Example:**
```
ALTERNATIVE: If no existing spec folder applies, create new spec folder
with path specs/078-new-feature/
```

---

<!-- /ANCHOR:field-definitions -->
<!-- ANCHOR:examples -->
## 4. EXAMPLES

### PASS Example with Full Evidence

```
GATE: SPEC FOLDER
DECISION: PASS
CONFIDENCE: HIGH
UNCERTAINTY: 0.25
EVIDENCE: User specified "specs/077-speckit-upgrade" - path verified via
Bash(ls), contains spec.md with matching scope "upgrade speckit research phase"
```

### PASS Example for Skill Routing

```
GATE: SKILL ROUTING
DECISION: PASS
CONFIDENCE: HIGH
UNCERTAINTY: 0.15
EVIDENCE: skill_advisor.py returned system-spec-kit (0.85) for query
"speckit upgrade research". Confidence > 0.8 threshold, skill invoked.
```

### BLOCK Example with Resolution

```
GATE: SPEC FOLDER
DECISION: BLOCK
CONFIDENCE: LOW
UNCERTAINTY: 0.55
EVIDENCE: User request "fix the bug" - multiple spec folders could apply:
- specs/073-bug-fixes/
- specs/075-hotfixes/
- specs/077-speckit-upgrade/

RESOLUTION_PATH:
1. Present options to user with brief description of each
2. Wait for user selection (A/B/C/D/E)
3. Re-evaluate with selected spec folder

ALTERNATIVE: If bug is new/unrelated, suggest Option B (create new spec folder)
```

### BLOCK Example for Completion

```
GATE: COMPLETION
DECISION: BLOCK
CONFIDENCE: MEDIUM
UNCERTAINTY: 0.40
EVIDENCE: Claiming "done" but checklist.md item P0-3 not marked [x]:
"[ ] Browser verification at 3 viewports"

RESOLUTION_PATH:
1. Execute browser verification at mobile/tablet/desktop
2. Capture evidence (screenshots or DevTools output)
3. Update checklist.md with [x] and evidence
4. Re-evaluate completion gate

ALTERNATIVE: N/A - P0 items cannot be skipped
```

---

<!-- /ANCHOR:examples -->
<!-- ANCHOR:session-decision-log-level-3 -->
## 5. SESSION DECISION LOG (Level 3+)

For Level 3+ spec folders, maintain a decision log table in decision-record.md:

### Format

```markdown
## Session Decision Log

| Timestamp | Gate | Decision | Confidence | Uncertainty | Evidence Summary |
|-----------|------|----------|------------|-------------|------------------|
| 2024-01-15 10:30 | SPEC FOLDER | PASS | HIGH | 0.20 | User selected A: specs/077 |
| 2024-01-15 10:31 | SKILL ROUTING | PASS | HIGH | 0.15 | system-spec-kit (0.85) |
| 2024-01-15 10:32 | MEMORY CONTEXT | PASS | HIGH | 0.25 | Loaded 3 memories |
| 2024-01-15 14:45 | COMPLETION | BLOCK | MEDIUM | 0.40 | P0-3 not verified |
| 2024-01-15 14:50 | COMPLETION | PASS | HIGH | 0.15 | All P0 items [x] |
```

### When to Record

**Always Record:**
- BLOCK decisions (require audit trail)
- Decisions that required user input
- Decisions with MEDIUM or LOW confidence
- Decisions with uncertainty > 0.35

**Optional (but recommended):**
- All PASS decisions for complete audit trail
- Gate re-evaluations after BLOCK resolution

---

<!-- /ANCHOR:session-decision-log-level-3 -->
<!-- ANCHOR:dual-threshold-validation -->
## 6. DUAL-THRESHOLD VALIDATION

The decision format integrates with the dual-threshold validation system:

### Readiness Formula

```
READINESS = (confidence >= 0.70) AND (uncertainty <= 0.35)
```

### State Matrix

| Confidence | Uncertainty | State | Action |
|------------|-------------|-------|--------|
| >= 0.70 | <= 0.35 | READY | Proceed with PASS |
| >= 0.70 | > 0.35 | Confident Ignorance | INVESTIGATE |
| < 0.70 | <= 0.35 | Low Confidence | INVESTIGATE |
| < 0.70 | > 0.35 | Lost | ESCALATE to user |

### Example with Dual-Threshold

```
GATE: UNDERSTANDING
DECISION: BLOCK
CONFIDENCE: MEDIUM (65%)
UNCERTAINTY: 0.45

DUAL-THRESHOLD CHECK:
- Confidence: 65% -> BELOW 70% threshold
- Uncertainty: 0.45 -> ABOVE 0.35 threshold
- READINESS: NOT READY (both fail)
- ACTION: ESCALATE

EVIDENCE: Request "update the thing" is ambiguous. Multiple interpretations possible.

RESOLUTION_PATH:
1. Ask user: "Which 'thing' should be updated?"
   - A) Authentication module
   - B) Configuration file
   - C) Documentation
2. Wait for response
3. Re-evaluate with clarified scope
```

---

<!-- /ANCHOR:dual-threshold-validation -->
<!-- ANCHOR:quick-reference -->
## 7. QUICK REFERENCE

### Decision Format Template

```
GATE: [GATE_NAME]
DECISION: [PASS | BLOCK]
CONFIDENCE: [HIGH | MEDIUM | LOW]
UNCERTAINTY: [0.0-1.0]
EVIDENCE: [Source-cited justification]

[If BLOCK:]
RESOLUTION_PATH: [Steps to unblock]
ALTERNATIVE: [Alternative approach]
```

### Validation Checklist

Before recording a decision:
- [ ] Gate name is valid (from approved list)
- [ ] Decision is binary (PASS or BLOCK)
- [ ] Confidence maps to percentage range
- [ ] Uncertainty is in 0.0-1.0 range
- [ ] Evidence cites specific source
- [ ] BLOCK includes resolution path

---

<!-- /ANCHOR:quick-reference -->
<!-- ANCHOR:related-resources -->
## 8. RELATED RESOURCES

- [Five Checks Framework](./five_checks.md) - Evaluation framework for significant decisions
- [Decision Record Template](../../templates/level_3/decision-record.md) - For Level 3/3+ spec folders
- [SKILL.md - Gates Overview](../../SKILL.md) - Gate system documentation
- [AGENTS.md - Section 2](../../../../../AGENTS.md) - Gate definitions and protocols
<!-- /ANCHOR:related-resources -->
