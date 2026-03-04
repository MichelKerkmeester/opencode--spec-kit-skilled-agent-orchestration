---
title: "DEPTH Thinking Framework"
description: "Five-phase thinking system (Discover, Engineer, Prototype, Test, Harmonize) with energy-level scaling, cognitive rigor techniques, CLEAR quality scoring, and proof-through-output transparency for prompt improvement work."
---

# DEPTH Thinking Framework

Five-phase thinking system for all prompt improvement work with energy-level scaling and cognitive rigor techniques.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Core Principle

DEPTH is the single thinking system for all prompt improvement work. Five phases, five energy levels, cognitive techniques applied when they add value. No other thinking framework is referenced or needed.

### When to Use

- Loaded automatically for all prompt improvement tasks within the sk-prompt-improver skill
- Any prompt enhancement requiring structured multi-phase analysis (Discover, Engineer, Prototype, Test, Harmonize)
- Energy-level routing: Raw passthrough, Quick concise, Standard default, Deep complex
- Multi-perspective analysis (min 3, target 5) with cognitive rigor techniques
- CLEAR quality scoring (40+/50)
- Proof-through-output transparency for deliverables

### Core Definition

**DEPTH:** **D**iscover **E**ngineer **P**rototype **T**est **H**armonize. Five phases. One thinking system. No other thinking framework is referenced or needed.

### Energy Levels (Canonical Reference)

This table is the source of truth. Other files reference it.

| Energy Level | Phases | Perspectives | Cognitive Techniques | When |
|---|---|---|---|---|
| **Raw** | None | 0 | None | `$raw`: passthrough, no enhancement |
| **Quick** | D - P - H | 1-2 | Pick 1 | `$short`/`$s`: concise enhancement, quick refinements |
| **Standard** | D - E - P - T - H | 3 minimum (BLOCKING), target 5 | Pick 1-2 relevant | Default for all standard modes |
| **Deep** | D(extended) - E - P - T - H | All 5 (BLOCKING) | All 5 applied | `$deep`/`$d` or complex prompts |

### Fundamental Principles

| Principle | Rule |
|---|---|
| **Transparent Professional Excellence** | Apply professional depth automatically. Explain the technical process AFTER delivery. Guarantee quality with visibility. |
| **Single-Point Interaction** | Ask one comprehensive question per task. Never answer own questions. Always wait for the user's response. |
| **Energy-Appropriate Rigor** | Scale depth proportional to task. Raw for passthrough, Quick for concise, Standard by default, Deep for complexity. |
| **Prove Through Output** | The deliverable must prove thinking happened: Mode, Framework, Perspectives used, score. |
| **Format Compliance** | Use latest format guides (JSON, YAML, Markdown). Maintain consistent structure across deliverables. |

### Signal-Based Routing

Route to the appropriate energy level based on the user signal or prompt characteristics:

```yaml
routing:
  raw:
    trigger: "$raw"
    action: "Passthrough. No enhancement. Skip all phases."
  quick:
    trigger: "$short | $s"
    action: "Concise enhancement. Phases: D - P - H. 1-2 perspectives."
  standard:
    trigger: "default (no signal)"
    action: "Full enhancement. All 5 phases. 3+ perspectives (blocking)."
  deep:
    trigger: "$deep | $d | complex prompt detected"
    action: "Extended Discover. All 5 phases. All 5 perspectives (blocking). All 5 techniques."
```

### DEPTH Round Configuration

Configure the maximum number of DEPTH improvement rounds per mode:

| Mode | Max Rounds | Rationale |
|---|---|---|
| **Text** (standard, deep) | 10 | Text prompts benefit from iterative refinement |
| **Short** (`$short`) | 3 | Quick refinements need fewer rounds |
| **Raw** (`$raw`) | 0 | Passthrough mode; no enhancement rounds |

<!-- /ANCHOR:overview -->
<!-- ANCHOR:depth-phases -->
## 2. DEPTH Phases

| Phase | Purpose | Output |
|---|---|---|
| **D** -- Discover | Deep understanding of prompt and improvement needs | Perspectives analysed, weaknesses identified, framework selected, assumptions surfaced |
| **E** -- Engineer | Generate and optimise enhancement approaches | 8+ approaches evaluated, best selected, requirements mapped |
| **P** -- Prototype | Build enhanced prompt structure | Draft built per framework, mechanism-first applied, format applied |
| **T** -- Test | Validate enhancement quality | CLEAR scored (40+/50), content validated |
| **H** -- Harmonize | Final polish and transparent delivery | Format verified, perspectives confirmed, deliverable ready |

**Raw energy skips all phases.** Passthrough with no enhancement.

### D -- DISCOVER

Understand the current prompt, identify improvement needs, select framework approach.

**User-Facing Update:** `"Phase D - Discover: Analysing from [X] perspectives | Synthesis: [findings]"`

| Activity | Focus | Constraint |
|---|---|---|
| Current State Mapping | What the user provided, context, requirements | Only stated elements |
| Weakness Identification | Vagueness, scope gaps, ambiguity | Only weaknesses in provided prompt |
| Complexity Assessment | Prompt complexity level 1-10 | Do not add unrequested complexity |
| Perspective Analysis | Analyse from multiple viewpoints (see Section 3) | Count per energy level |
| Perspective Inversion | Argue against approach, find merit in objections | Refined approach |
| Assumption Surface | Identify hidden assumptions early | Classify: validated/questionable/unknown |
| CLEAR Analysis | User's prompt scoring potential | Not other possible prompts |
| Framework Selection | Match use case, success rate, efficiency | Do not force complex frameworks |

**Exit:** Perspectives analysed per energy level, inversion applied, assumptions flagged, framework selected, complexity assessed.
**Deep extension:** Perform full 5-perspective analysis, perspective inversion, and assumption audit before proceeding.

### E -- ENGINEER (Standard/Deep/Creative)

Generate and optimise enhancement approaches.

**User-Facing Update:** `"Phase E - Engineer: Evaluated 8 approaches, selected [FRAMEWORK]"`

| Technique | Output |
|---|---|
| **Constraint Reversal** | Identify conventional approach, define opposite, analyse mechanism, find minimal flip, apply. Yields non-obvious insights. |
| **Divergent Thinking** | Framework patterns, clarity improvements, structure optimisations, expression enhancements. Generate 8+ approaches. |
| **Framework Fit** | Assess best framework for use case (not most complex). Yields selected framework. |
| **Optimisation** | Select highest CLEAR score approach. Yields ONE enhanced prompt. |
| **Assumption Audit** | Continuous: classify [validated, questionable, unknown]. Yields flagged assumptions. |

**Exit:** Framework selected, reversal applied, 8+ approaches evaluated, requirements mapped.

### P -- PROTOTYPE

Build enhanced prompt structure.

| Step | Action | Validation |
|---|---|---|
| Mechanism First | Ensure WHY is explained before WHAT | On fail: Add mechanism depth |
| Format Selection | Markdown / JSON / YAML per guide | Apply selected format rules |
| Structure Assembly | Apply format guide, required sections | Framework-specific elements used |
| Content Integration | All context layers, requirements actionable | Complete and unambiguous |

**Exit:** Draft complete, mechanism-first validated (WHY then WHAT), all sections written, format applied.

### T -- TEST (Standard/Deep/Creative)

Validate enhancement quality.

| Check | Criteria | Threshold |
|---|---|---|
| CLEAR Scoring | Calculate each dimension, weight by use case (see Section 4) | **40+/50 required** |
| Content Validation | Intent preserved, improvements clear, format compliant | All pass |
| Cognitive Rigor | Perspectives integrated (min 3), assumptions flagged, mechanism explained | All pass |

**Improvement:** If any dimension falls below floor OR total is below 40, apply targeted improvement and re-score (max 3 iterations).

### H -- HARMONIZE

Final polish, format verification, delivery preparation.

| Validation | Requirement | On Fail |
|---|---|---|
| Perspectives Check | Count meets energy level requirement | CRITICAL: Return to Phase D |
| Cognitive Rigor Gates | Techniques applied per energy level guidance | Address gaps |
| Format Verification | Latest guide, all rules applied, professional quality | Correct format |
| Transparency Prep | Improvement log, CLEAR breakdown, decisions documented | Complete logs |
| Output Metadata | Mode, Framework, Perspectives, CLEAR score in deliverable | Add missing fields |

### Phase Exit Criteria (Mandatory)

| Phase | Exit Criteria | Gate |
|---|---|---|
| **Discover** | Perspectives analysed per energy level, inversion applied, assumptions flagged, framework selected | All met -> Engineer |
| **Engineer** | Framework selected, reversal applied, 8+ approaches evaluated | All met -> Prototype |
| **Prototype** | Structure built, mechanism-first validated (WHY then WHAT), format applied | All met -> Test |
| **Test** | CLEAR 40+/50, all dimension floors met, intent preserved | All met -> Harmonize |
| **Harmonize** | Perspectives confirmed per energy level, rigor gates passed, output metadata present | All met -> DELIVER |

### State Management

```yaml
system_state:
  energy_level: [raw, quick, standard, deep]
  current_phase: [discover, engineer, prototype, test, harmonize]
  perspectives_count: integer   # raw: 0, standard: MUST be >= 3, deep: MUST be 5
  perspectives_list: []         # MANDATORY: tracks WHICH perspectives were used
  clear_scores: {}              # Target: 40+/50, dimension floors enforced
  framework_selected: string
  complexity: integer           # 1-10
  quality_target_met: boolean
  improvement_cycles: integer   # max 3
  techniques_applied: []
```

<!-- /ANCHOR:depth-phases -->
<!-- ANCHOR:cognitive-rigor -->
## 3. Cognitive Rigor

### Standard Perspectives (Per-Prompt, Not Per-Iteration)

Analyse once during Discover, then let findings inform all subsequent enhancement work.

| # | Perspective | Focus | Energy |
|---|---|---|---|
| 1 | **Prompt Engineering Expert** | Frameworks, best practices, patterns, structural optimisation | All (Std+) |
| 2 | **AI Interpretation Specialist** | Model understanding, ambiguity detection, token efficiency | All (Std+) |
| 3 | **End-User Experience Designer** | Comprehension, usability, reusability, clarity | Std+ |
| 4 | **Framework Architecture Expert** | RCAF, COSTAR, RACE, CIDI, structural patterns, framework fit | Deep |
| 5 | **Token Optimisation Specialist** | Conciseness, cost efficiency, minimal overhead | Deep |

Standard: 3 minimum (BLOCKING), target 5. Deep: all 5 (BLOCKING). Quick: 1-2 recommended. Raw: 0.

### Cognitive Techniques (Optional Toolkit)

Five techniques are available as tools. Apply when they add value; the energy level guides usage.

1. **Multi-Perspective Analysis:** Analyse from Prompt Engineering, AI Interpretation, User Clarity (minimum) plus Framework and Token Efficiency (target). Synthesise findings across perspectives and identify gaps.
2. **Perspective Inversion:** Challenge the enhancement approach by arguing against it. Challenge, understand opposition, synthesise, strengthen.
3. **Constraint Reversal:** Ask what if the opposite approach is superior. Identify conventional approach, reverse it, find driving principles, apply minimal change.
4. **Assumption Audit:** Surface hidden assumptions, classify as validated/questionable/unknown, challenge systematically. Flag with `[Assumes: X]`.
5. **Mechanism First:** Explain WHY before WHAT. Present principle, explain why it works, then show tactics. Structure: WHY, HOW, WHAT.

**Usage by energy level:** Raw = none. Quick = pick 1. Standard = 1-2 relevant. Deep = all 5 applied.

### Quality Gates (Pre-Delivery, Standard/Deep/Creative)

- [ ] Perspectives analysed per energy level requirement
- [ ] Assumptions surfaced and classified
- [ ] Mechanism-first validated: WHY before WHAT in all enhancements
- [ ] Techniques applied per energy level guidance
- [ ] Perspective inversion applied: counter-arguments addressed

If any gate fails, apply the relevant technique and re-validate.

### Technique-to-Phase Mapping

| Phase | Cognitive Techniques | Focus |
|---|---|---|
| Discover | Multi-perspective (BLOCKING at Std+), Inversion, Assumption start | Prompt analysis, weakness identification |
| Engineer | Constraint Reversal, Assumption ongoing | Approach optimisation, framework selection |
| Prototype | Mechanism First validation, assumption flagging | Structure building (WHY then WHAT) |
| Test | Full rigor validation, assumption flags check, mechanism depth | CLEAR scoring |
| Harmonize | Final perspective check (per energy level), all gates pass | Final verification, delivery prep |

<!-- /ANCHOR:cognitive-rigor -->
<!-- ANCHOR:clear-scoring -->
## 4. CLEAR Scoring and Integration

**CLEAR** is the quality scoring framework for prompt improvement deliverables. CLEAR validates quality; DEPTH provides process methodology. **C**orrectness, **L**ogic, **E**xpression, **A**rrangement, **R**eusability.

### RICCE Integration

CLEAR dimensions map to RICCE evaluation criteria as follows:

| CLEAR Dimension | RICCE Criterion | Relationship |
|---|---|---|
| **C** - Correctness | **Relevance** + **Correctness** | Factual grounding aligns with relevance; accuracy maps directly to correctness |
| **L** - Logic | **Coherence** | Reasoning flow, cause-effect chains map to coherence evaluation |
| **E** - Expression | **Clarity** (RICCE implicit) | Language precision assessed through expression quality |
| **A** - Arrangement | **Coherence** + **Efficiency** | Structure and flow support both coherence and efficient consumption |
| **R** - Reusability | **Efficiency** | Adaptability and template potential contribute to efficient reuse |

When RICCE evaluation is active, use CLEAR scores as the quantitative backing for RICCE qualitative assessments.

### Dimensions

| Dimension | Max | Weight | Measures | Floor |
|---|---|---|---|---|
| **C** - Correctness | 10 | 20% | Accuracy, no contradictions, valid assumptions, factual grounding | 7 |
| **L** - Logic | 10 | 20% | Reasoning flow, cause-effect chains, conditional handling, coherence | 7 |
| **E** - Expression | 15 | 30% | Clarity of language, specificity, minimal ambiguity, precise wording | 10 |
| **A** - Arrangement | 10 | 20% | Structure, organisation, logical flow, section hierarchy, formatting | 7 |
| **R** - Reusability | 5 | 10% | Adaptability, parameterisation, template potential, flexibility | 3 |
| **Total** | **50** | | | **34** |

### Scoring Criteria

**C - Correctness (0-10):**

| Score | Criteria |
|---|---|
| 0-3 | Factual errors, contradictory instructions, invalid assumptions |
| 4-6 | Mostly accurate but contains minor contradictions or unverified claims |
| 7-8 | Accurate, internally consistent, valid assumptions throughout |
| 9-10 | Flawless accuracy, all claims verified, zero contradictions, robust assumptions |

**L - Logic (0-10):**

| Score | Criteria |
|---|---|
| 0-3 | Broken reasoning, missing cause-effect, illogical conditionals |
| 4-6 | Basic reasoning present but gaps in cause-effect chains or edge cases |
| 7-8 | Sound reasoning, clear cause-effect, conditionals handled properly |
| 9-10 | Rigorous logic, all edge cases addressed, reasoning chains complete and verifiable |

**E - Expression (0-15):**

| Score | Criteria |
|---|---|
| 0-5 | Vague, ambiguous, imprecise language that invites misinterpretation |
| 6-9 | Adequate clarity but contains jargon, redundancy, or imprecise phrasing |
| 10-12 | Clear, specific, minimal ambiguity, well-chosen vocabulary |
| 13-15 | Surgical precision, zero ambiguity, every word earns its place, exemplary clarity |

**A - Arrangement (0-10):**

| Score | Criteria |
|---|---|
| 0-3 | Disorganised, no clear structure, information scattered |
| 4-6 | Basic structure but illogical ordering or inconsistent formatting |
| 7-8 | Well-organised, logical flow, consistent formatting, clear hierarchy |
| 9-10 | Optimal structure, information architecture serves comprehension perfectly |

**R - Reusability (0-5):**

| Score | Criteria |
|---|---|
| 0-1 | Hardcoded, single-use, no adaptability |
| 2-3 | Some parameterisation but limited flexibility |
| 4-5 | Fully templated, easily adapted to new contexts, parameters clearly marked |

### Thresholds

| Range | Status | Action |
|---|---|---|
| 40-50 | PASS | Proceed to Harmonize. Top-tier deliverable. |
| 30-39 | REVISION NEEDED | Return to Prototype, focus on weakest dimension. Max 3 iterations. |
| 0-29 | REJECTED | Major rework required. **20-29:** Restart from Engineer. **0-19:** Complete restart, fundamental issues. |

A deliverable scoring 40+ overall but failing a per-dimension floor (C:7, L:7, E:10, A:7, R:3) must still be revised until the floor is met.

### Context-Aware Weighting

```yaml
context_adjustments:
  api_integration: { expression: +5%, logic: +5%, reusability: +5% }
  creative_writing: { expression: +10%, arrangement: -5% }
  template_creation: { reusability: +10%, arrangement: +5% }
```

### Phase-to-Dimension Mapping

| DEPTH Phase | CLEAR Dimension | Validation | Output |
|---|---|---|---|
| Discover | Correctness (C) | Assumptions verified, facts grounded, context validated | Accurate foundation |
| Engineer | Logic (L) + Arrangement (A) | Reasoning structured, flow designed, hierarchy planned | Sound architecture |
| Prototype | Expression (E) + Reusability (R) | Language precise, template potential assessed, parameters marked | Clear, adaptable draft |
| Test | All Dimensions | CLEAR scored (40+/50), all floors met | Validated quality |
| Harmonize | All Dimensions | Final polish, consistency verified, output metadata complete | Export-ready deliverable |

### Final Validation Checkpoint

```yaml
clear_depth_check:
  before_delivery:
    correctness: "Accurate, no contradictions, valid assumptions? (C >= 7)"
    logic: "Sound reasoning, cause-effect complete? (L >= 7)"
    expression: "Clear, specific, zero ambiguity? (E >= 10)"
    arrangement: "Well-structured, logical flow? (A >= 7)"
    reusability: "Adaptable, parameterised where applicable? (R >= 3)"
    total_score: "CLEAR >= 40/50?"
  on_any_fail:
    action: "Return to appropriate DEPTH phase"
    blocking: true
```

<!-- /ANCHOR:clear-scoring -->
<!-- ANCHOR:quality-transparency -->
## 5. Quality and Transparency

### Proof Through Output Metadata

Every deliverable must include these fields. If any field is missing, thinking has not been proven; return to the relevant phase.

| Field | Content | Purpose |
|---|---|---|
| Mode | Which mode produced this | Traceability |
| Framework | Which framework was applied | Proves engineering happened |
| Perspectives | Count and which ones were used | Proves multi-angle analysis |
| CLEAR Score | Final score out of 50 | Proves quality validation |

### Two-Layer Transparency Model

| Layer | Purpose | Content |
|---|---|---|
| **Internal** | Full rigor | Complete perspective analysis, detailed audits, full evaluations, scoring calculations, iteration tracking |
| **External** | User visibility | Phase progress with indicators, key insights (1-2 sentences), scores (before/after), critical flags, framework selection with reasoning |

**Balance:** Transparent enough to build trust, concise enough to prevent overwhelm.

### Domain Standards (Every Deliverable)

| Standard | Requirement | On Fail |
|---|---|---|
| Prompt Focus | Improve prompts, never create content | Redirect to enhancement |
| Format Compliance | Per latest format guide (Markdown / JSON / YAML) | Apply correct format |
| Scope Discipline | Only deliver what the user requested, no feature invention | Remove additions |
| Output Metadata | Mode, Framework, Perspectives, Score: all present | Add missing fields |
| File Delivery | Downloadable files (.md, .json, .yaml) | Create proper file |

### Improvement Protocol

```yaml
improvement_cycle:
  trigger: "Any dimension below floor OR total below 40"
  max_iterations: 3
  process:
    1: "Identify weakest dimension, apply targeted improvement, re-score"
    2: "Analyse remaining gaps, apply comprehensive enhancement, re-score"
    3: "Try alternative framework, apply all improvements, final validation"
  on_exceed:
    action: "Deliver best version with quality note"
    prevent_phase_return: true
  user_sees: "Applied [X] improvement cycles. CLEAR: [before] -> [after]"
```

### REPAIR Protocol

For structural recovery when enhancement fails validation repeatedly, reference the REPAIR protocol for systematic error diagnosis and correction. Consult the Patterns and Evaluation guide.

<!-- /ANCHOR:quality-transparency -->
<!-- ANCHOR:quick-reference -->
## 6. Quick Reference

### Energy Level Summary

| | Raw | Quick | Standard | Deep |
|---|---|---|---|---|
| **Phases** | None | D - P - H | D - E - P - T - H | D(ext) - E - P - T - H |
| **Perspectives** | 0 | 1-2 | 3+ blocking | 5 blocking |
| **Techniques** | None | Pick 1 | 1-2 relevant | All 5 |
| **Scoring** | None | CLEAR 40+/50 | CLEAR 40+/50 | CLEAR 40+/50 |
| **Trigger** | `$raw` | `$short`/`$s` | Default | `$deep`/`$d` or complex |

### Phase Checklist

```
D -- DISCOVER:    [ ] Current state mapped  [ ] Perspectives (per energy)  [ ] Weaknesses identified  [ ] Framework selected  [ ] Assumptions surfaced
E -- ENGINEER:    [ ] 8+ approaches evaluated  [ ] Best approach selected  [ ] Requirements mapped  [ ] Constraint reversal applied
P -- PROTOTYPE:   [ ] Structure built  [ ] Mechanism-first (WHY then WHAT)  [ ] Format applied  [ ] Content complete
T -- TEST:        [ ] CLEAR 40+/50 (or mode-specific score)  [ ] All dimension floors met  [ ] Intent preserved
H -- HARMONIZE:   [ ] Output metadata  [ ] Perspectives confirmed  [ ] Format verified  [ ] Deliverable ready
```

### Must-Have Rules

**Always:** DEPTH is the one thinking system. Apply perspectives per energy level. Use CLEAR scoring to validate quality (Standard/Deep). Include output metadata to prove thinking. Apply format guides.

**Never:** Skip perspectives at Standard/Deep (BLOCKING). Answer own questions. Expand scope. Overwhelm with internal detail. Claim done without output metadata.

---

*DEPTH: five phases, five energy levels, cognitive techniques when they add value. Proof is in the output.*

<!-- /ANCHOR:quick-reference -->
