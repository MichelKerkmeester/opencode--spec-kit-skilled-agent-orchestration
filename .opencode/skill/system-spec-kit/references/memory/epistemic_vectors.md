---
title: Epistemic Vectors Reference
description: Uncertainty tracking framework for measuring knowledge gaps separate from confidence scoring
---

# Epistemic Vectors Reference - Uncertainty Tracking

Framework for measuring and tracking uncertainty separate from confidence, enabling detection of "confident ignorance" and improving decision quality through dual-threshold validation.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Why Uncertainty Tracking Matters

Traditional confidence scoring answers: "How sure am I about what I know?"

But this misses a critical dimension: "How much don't I know?"

**The Danger of Confident Ignorance:** High confidence combined with high uncertainty creates a dangerous cognitive state where the agent proceeds with conviction despite significant knowledge gaps. This is often worse than low confidence because:

1. **No warning signs** - High confidence masks underlying problems
2. **Overcommitment** - Resources invested before gaps discovered
3. **Cascade failures** - Unknown unknowns surface late, requiring rework
4. **Trust erosion** - Confident failures damage credibility more than cautious ones

**Solution:** Track uncertainty as a separate, orthogonal dimension from confidence. Both must pass thresholds before proceeding.

### Key Concepts

| Term | Definition |
|------|------------|
| **Confidence** | Certainty about known information (0-100%) |
| **Uncertainty** | Measure of unknown factors and gaps (0.0-1.0) |
| **Epistemic Gap** | Something I don't know that I don't know |
| **Model Boundary** | Edge of capability or competence |
| **Dual-Threshold** | Requirement to pass BOTH confidence AND uncertainty checks |

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:the-four-uncertainty-factors -->
## 2. THE FOUR UNCERTAINTY FACTORS

Uncertainty is computed as a weighted average of four distinct factors:

### Factor 1: Epistemic Gaps (Weight: 0.30)

**Question:** "What don't I know that I don't know?"

This is the most dangerous factor because by definition, you cannot directly observe your own epistemic gaps. Instead, assess through proxy indicators:

**Assessment Questions:**
- Am I working in a familiar domain or unfamiliar territory?
- Have I encountered similar problems before?
- Are there aspects of this request I'm assuming rather than verifying?
- Could there be implicit requirements not stated?
- What would an expert in this domain ask that I haven't considered?

**Scoring Guide:**

| Score | Interpretation |
|-------|----------------|
| 0.0-0.2 | Familiar domain, well-understood problem |
| 0.3-0.5 | Some unknown elements, but bounded |
| 0.6-0.8 | Significant unknowns, new territory |
| 0.9-1.0 | Completely unfamiliar, many assumptions |

**Examples:**
- Modifying a well-documented Webflow component: 0.1
- Implementing a new auth pattern without prior examples: 0.6
- Integrating with an undocumented third-party API: 0.8

### Factor 2: Model Boundaries (Weight: 0.25)

**Question:** "Am I at or near the limits of my capabilities?"

Every agent has boundaries of competence. Operating near these boundaries increases the chance of errors that the agent cannot detect.

**Assessment Questions:**
- Is this task within my core competencies?
- Am I being asked to perform beyond my training?
- Do I have reliable feedback mechanisms for this task?
- Can I verify my own output quality?
- Would a specialized tool or expert be more appropriate?

**Scoring Guide:**

| Score | Interpretation |
|-------|----------------|
| 0.0-0.2 | Well within capabilities, high reliability |
| 0.3-0.5 | Near capability edge, some degradation expected |
| 0.6-0.8 | At boundary, significant error risk |
| 0.9-1.0 | Beyond boundaries, unreliable output |

**Examples:**
- Writing JavaScript code: 0.1
- Complex mathematical proofs: 0.5
- Real-time system performance analysis: 0.7
- Medical diagnosis: 0.9

### Factor 3: Temporal Variability (Weight: 0.20)

**Question:** "How stable is this knowledge over time?"

Some knowledge is immutable (mathematical truths), while other knowledge changes rapidly (API versions, package dependencies, team conventions).

**Assessment Questions:**
- When was this knowledge last verified?
- How quickly does this domain change?
- Could there be recent updates I'm unaware of?
- Is this based on current documentation or older patterns?
- Are there version-specific considerations?

**Scoring Guide:**

| Score | Interpretation |
|-------|----------------|
| 0.0-0.2 | Stable, timeless knowledge |
| 0.3-0.5 | Moderate change rate, recently verified |
| 0.6-0.8 | Rapid change domain, verification needed |
| 0.9-1.0 | Highly volatile, likely outdated |

**Examples:**
- HTML5 semantic elements: 0.1
- React patterns (evolve but stable core): 0.3
- npm package version compatibility: 0.6
- External API behavior (without recent testing): 0.8

### Factor 4: Situational Completeness (Weight: 0.25)

**Question:** "Is the context sufficient to act?"

Even with domain knowledge, incomplete situational context can lead to incorrect actions.

**Assessment Questions:**
- Do I have all necessary file contents loaded?
- Are there related files I should check?
- Is the user's intent fully understood?
- Are there environmental factors (staging vs production)?
- What dependencies or side effects might exist?

**Scoring Guide:**

| Score | Interpretation |
|-------|----------------|
| 0.0-0.2 | Full context available, verified |
| 0.3-0.5 | Most context available, minor gaps |
| 0.6-0.8 | Significant context missing |
| 0.9-1.0 | Minimal context, flying blind |

**Examples:**
- After reading all relevant files and spec: 0.1
- Understanding task but not checking dependencies: 0.4
- Modifying code without seeing related modules: 0.6
- Acting on vague request without clarification: 0.8

---

<!-- /ANCHOR:the-four-uncertainty-factors -->
<!-- ANCHOR:calculating-uncertainty -->
## 3. CALCULATING UNCERTAINTY

### Weighted Average Formula

```
uncertainty = (epistemic_gaps × 0.30) + (model_boundaries × 0.25) +
              (temporal_variability × 0.20) + (situational_completeness × 0.25)
```

### Example Calculation

**Scenario:** Implementing a new authentication flow in a Webflow project

| Factor | Score | Weight | Contribution |
|--------|-------|--------|--------------|
| Epistemic Gaps | 0.5 | 0.30 | 0.150 |
| Model Boundaries | 0.2 | 0.25 | 0.050 |
| Temporal Variability | 0.3 | 0.20 | 0.060 |
| Situational Completeness | 0.4 | 0.25 | 0.100 |
| **TOTAL** | - | - | **0.360** |

Result: Uncertainty = 0.36 (MEDIUM - just over threshold)

---

<!-- /ANCHOR:calculating-uncertainty -->
<!-- ANCHOR:threshold-interpretation -->
## 4. THRESHOLD INTERPRETATION

### Uncertainty Thresholds

| Level | Range | Action | Description |
|-------|-------|--------|-------------|
| **LOW** | <= 0.35 | PROCEED | Sufficient context, acceptable unknowns |
| **MEDIUM** | 0.36-0.60 | VERIFY | Investigate unknowns before acting |
| **HIGH** | > 0.60 | CLARIFY | Too many unknowns to proceed safely |

### Actions by Threshold

**LOW (<=0.35):** Proceed with normal confidence checking
- Knowledge gaps are bounded and acceptable
- Context is sufficient for reliable action
- Model is operating within comfortable boundaries

**MEDIUM (0.36-0.60):** Verify first
- Read additional files to improve situational completeness
- Search memory for related prior work
- Check documentation for temporal updates
- Consider: "What am I assuming that I should verify?"

**HIGH (>0.60):** Require clarification
- Do NOT proceed without reducing uncertainty
- Ask user specific questions to close gaps
- Request access to missing context
- Consider if a specialized tool/skill is needed

---

<!-- /ANCHOR:threshold-interpretation -->
<!-- ANCHOR:the-confident-ignorance-anti-pattern -->
## 5. THE "CONFIDENT IGNORANCE" ANTI-PATTERN

### Definition

**Confident Ignorance** occurs when confidence is high but uncertainty is also high. This is the most dangerous cognitive state.

```
HIGH CONFIDENCE + HIGH UNCERTAINTY = CONFIDENT IGNORANCE
```

### Why It's Dangerous

1. **False assurance** - Agent feels ready to act
2. **Missing safeguards** - No hesitation or verification
3. **Blind spots invisible** - Unknown unknowns by definition undetectable
4. **Late discovery** - Problems surface after significant work

### Detection Pattern

```
if (confidence >= 0.70 && uncertainty > 0.35):
    STATE = "CONFIDENT IGNORANCE"
    ACTION = "INVESTIGATE" // Reduce uncertainty first
```

### Examples

| Scenario | Confidence | Uncertainty | State |
|----------|------------|-------------|-------|
| Familiar task, full context | 90% | 0.15 | READY - proceed |
| New domain, explicit gaps | 50% | 0.70 | LOW CONFIDENCE - ask |
| Familiar domain, missing files | 85% | 0.55 | CONFIDENT IGNORANCE |
| Partial knowledge, known gaps | 60% | 0.40 | NOT READY - investigate |

### Recovery from Confident Ignorance

When detected, do NOT proceed. Instead:

1. **Identify which factor is elevated:**
   - Epistemic gaps? → Research domain
   - Model boundaries? → Consider delegation
   - Temporal variability? → Check current docs
   - Situational completeness? → Read more files

2. **Take targeted action to reduce uncertainty**

3. **Re-assess before proceeding**

---

<!-- /ANCHOR:the-confident-ignorance-anti-pattern -->
<!-- ANCHOR:practical-assessment-guide -->
## 6. PRACTICAL ASSESSMENT GUIDE

### Quick Assessment Checklist

Before acting on any significant task, evaluate:

```
UNCERTAINTY ASSESSMENT:
├─ Epistemic gaps: [0.0-1.0] - [what's unknown]
├─ Model boundaries: [0.0-1.0] - [capability concerns]
├─ Temporal variability: [0.0-1.0] - [knowledge freshness]
├─ Situational completeness: [0.0-1.0] - [context gaps]
└─ TOTAL: [weighted average] → [LOW/MEDIUM/HIGH]
```

### Sample Self-Assessment Questions

**Before starting a task:**
1. What don't I know about this domain? (epistemic gaps)
2. Am I equipped to handle this, or should I delegate? (model boundaries)
3. How current is my knowledge here? (temporal variability)
4. Do I have all the context I need? (situational completeness)

**During execution:**
1. Have I discovered new unknowns?
2. Is this harder than expected? (model boundary signal)
3. Did something behave unexpectedly? (knowledge staleness signal)
4. Am I making assumptions I should verify?

**Before claiming completion:**
1. Did I close the gaps identified at start?
2. Were there surprises that indicate higher uncertainty than assessed?
3. Would I be comfortable explaining all decisions made?

---

<!-- /ANCHOR:practical-assessment-guide -->
<!-- ANCHOR:integration-with-gates -->
## 7. INTEGRATION WITH GATES

### Dual-Threshold Validation

Gates now require BOTH thresholds to pass:

```
READINESS = (confidence >= 0.70) AND (uncertainty <= 0.35)
```

### Gate Response States

| Confidence | Uncertainty | State | Action |
|------------|-------------|-------|--------|
| >= 0.70 | <= 0.35 | **READY** | PROCEED |
| >= 0.70 | > 0.35 | **Confident Ignorance** | INVESTIGATE |
| < 0.70 | <= 0.35 | **Low Confidence** | INVESTIGATE |
| < 0.70 | > 0.35 | **Lost** | ESCALATE to user |

### Investigation Protocol

When READINESS fails, investigate (max 3 iterations):

**Iteration 1:** Local search
- Read relevant files
- Search memory for prior work
- Check spec folder documentation

**Iteration 2:** Expand scope
- Read adjacent/related files
- Broader memory search
- Check external documentation

**Iteration 3:** Final attempt
- Comprehensive search
- Review all available context
- Prepare specific questions

**After 3 failures:** Escalate with format:
```
ESCALATION REQUIRED

What I know:
- [Known facts with sources]

What I don't know:
- [Specific gaps identified]

Options:
A) [Option with trade-offs]
B) [Option with trade-offs]
C) [Request specific information]
```

### Structured Decision Format with Uncertainty

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

### Combined Assessment Format

```
DUAL-THRESHOLD CHECK:
├─ Confidence: [NN]% → [HIGH/MEDIUM/LOW]
├─ Uncertainty: [0.NN] → [LOW/MEDIUM/HIGH]
├─ READINESS: [READY/NOT READY]
└─ ACTION: [PROCEED/INVESTIGATE/ESCALATE]
```

---

<!-- /ANCHOR:integration-with-gates -->
<!-- ANCHOR:learning-index-workflow -->
## 7b. LEARNING INDEX WORKFLOW

Three MCP tools measure knowledge gains across implementation tasks:

1. **`task_preflight()`** — Captures epistemic baseline before work begins. Records uncertainty score (0-100), knowledge gaps, and context coverage.
2. **`task_postflight()`** — Measures post-task state. Computes Learning Index: `LI = (KnowledgeDelta × 0.4) + (UncertaintyReduction × 0.35) + (ContextImprovement × 0.25)`.
3. **`memory_get_learning_history()`** — Returns historical learning measurements with trend analysis.

**Score Interpretation (0-100):**

| Range | Interpretation |
|-------|---------------|
| 80-100 | Significant learning — major knowledge gains |
| 60-79 | Moderate learning — meaningful progress |
| 40-59 | Incremental learning — steady improvement |
| 20-39 | Execution-focused — task completed, limited new knowledge |
| 0-19 | Knowledge regression — review needed |

**Mapping to Uncertainty Factors:** The `uncertaintyScore` (0-100) returned by these tools is derived from the four-factor weighted model (§2) scaled to integer range: `uncertaintyScore = round(weightedAverage × 100)`.

---

<!-- /ANCHOR:learning-index-workflow -->
<!-- ANCHOR:related-resources -->
## 8. RELATED RESOURCES

### AGENTS.md Reference
- **Section 4**: Confidence & Clarification Framework (includes uncertainty tracking)
- **Section 2**: Mandatory Gates (dual-threshold validation in Gate 1)

### Related Skills
- `system-spec-kit` - Parent skill using uncertainty tracking in gates
- `sk-code--web` - Implementation skill with verification gates
<!-- /ANCHOR:related-resources -->
