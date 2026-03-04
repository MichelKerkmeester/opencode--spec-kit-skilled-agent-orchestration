---
title: "Patterns and Evaluation - Framework Library and CLEAR Scoring"
description: "Framework library, enhancement patterns, and CLEAR evaluation methodology for systematic prompt engineering. Covers 7 frameworks (RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE, CRAFT), the CLEAR 50-point scoring system, power combinations, and enhancement priority protocols."
---

# Prompt Patterns & Evaluation Reference

Comprehensive framework library, enhancement patterns, and CLEAR evaluation methodology for systematic prompt engineering excellence.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Core Principle

Systematic prompt engineering requires matching the right framework to each task, applying structured enhancement patterns, and evaluating quality through CLEAR scoring to achieve consistent, measurable excellence.

### When to Use

- Selecting the optimal framework for a prompt task (RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE, CRAFT)
- Evaluating prompt quality using CLEAR scoring
- Applying enhancement patterns and refinement techniques
- Combining frameworks for advanced use cases
- Optimizing token usage across frameworks
- Recovering and repairing weak prompts
- Building reusable prompt templates

<!-- /ANCHOR:overview -->
<!-- ANCHOR:framework-library -->
## 2. Framework Library & Selection

### Complete Framework Matrix

| Framework   | Elements                                                     | Best For                         | Avoid When               | Success Rate |
| ----------- | ------------------------------------------------------------ | -------------------------------- | ------------------------ | ------------ |
| **RCAF**    | Role, Context, Action, Format                                | 80% of prompts, general tasks    | Over-complex scenarios   | 92%          |
| **COSTAR**  | Context, Objective, Style, Tone, Audience, Response          | Content creation, communication  | Technical specifications | 94%          |
| **RACE**    | Role, Action, Context, Execute                               | Urgent tasks, quick iterations   | Detailed requirements    | 88%          |
| **CIDI**    | Context, Instructions, Details, Input                        | Process documentation, tutorials | Creative exploration     | 90%          |
| **TIDD-EC** | Task, Instructions, Do's, Don'ts, Examples, Context          | Quality-critical, compliance     | Brainstorming            | 93%          |
| **CRISPE**  | Capacity, Insight, Statement, Personality, Experiment        | Strategy, exploration            | Routine tasks            | 87%          |
| **CRAFT**   | Context, Role, Action, Format, Target                        | Complex projects, planning       | Simple queries           | 91%          |

### Framework Selection Algorithm

```yaml
select_optimal_framework:
  description: "Enhanced framework selection with pattern recognition"
  input: [task_analysis]

  analyze_characteristics:
    complexity: {scale: 1_to_10}
    urgency: {boolean: true_false}
    audience_specific: {boolean: true_false}
    creative_element: {boolean: true_false}
    precision_critical: {boolean: true_false}
    compliance_needs: {boolean: true_false}

  score_frameworks:
    rcaf:
      base_score: 5
      modifiers:
        - if: "complexity <= 6" then add: 5
        - if: "not audience_specific" then add: 3

    costar:
      base_score: 3
      modifiers:
        - if: "audience_specific" then add: 7
        - if: "creative_element" then add: 5

    race:
      base_score: 2
      modifiers:
        - if: "urgency" then add: 8
        - if: "complexity <= 3" then add: 5
        - if: "precision_critical" then subtract: 5

    tidd_ec:
      base_score: 3
      modifiers:
        - if: "precision_critical" then add: 7
        - if: "compliance_needs" then add: 5

  select_best:
    method: highest_score
    output: [primary, confidence, alternative, reasoning]
```

### Framework Selection Decision Table

| Complexity | Urgency | Audience | Creative | Precision | Recommended |
| ---------- | ------- | -------- | -------- | --------- | ----------- |
| 1-3        | Yes     | No       | No       | No        | **RACE**    |
| 1-6        | No      | No       | No       | No        | **RCAF**    |
| Any        | No      | Yes      | Yes      | No        | **COSTAR**  |
| 6+         | No      | No       | No       | Yes       | **TIDD-EC** |
| 7-10       | No      | Yes      | No       | Yes       | **CRAFT**   |

<!-- /ANCHOR:framework-library -->
<!-- ANCHOR:framework-deep-dives -->
## 3. Framework Deep Dives

### RCAF Mastery Patterns

**Layered RCAF** (representative example):

```yaml
layered_rcaf:
  role:
    primary: "[Main expertise]"
    secondary: "[Supporting skill]"
    domain: "[Specific knowledge area]"
  context:
    immediate: "[Current situation]"
    historical: "[Relevant background]"
    constraints: "[Limitations and boundaries]"
  action:
    primary: "[Main task]"
    method: "[How to accomplish]"
    outcome: "[Expected result]"
  format:
    structure: "[Organization pattern]"
    style: "[Tone and approach]"
    deliverables: "[Specific outputs]"
```

**RCAF Pattern Summary:**

| Pattern          | Key Feature                  | When to Use                    |
| ---------------- | ---------------------------- | ------------------------------ |
| Layered RCAF     | Multi-level context stacking | Complex multi-audience prompts |
| RCAF + Metrics   | Embedded success criteria    | Measurable outcome prompts     |
| Conditional RCAF | If-then role variations      | Context-dependent responses    |

### COSTAR Enhancement Techniques

**Style-Tone Matrix:**

| Combination              | Use For              | Balance                          |
| ------------------------ | -------------------- | -------------------------------- |
| Formal + Empathetic      | Crisis communication | Authority with understanding     |
| Technical + Enthusiastic | Product launches     | Expertise with excitement        |
| Casual + Authoritative   | Educational content  | Approachability with credibility |
| Creative + Professional  | Marketing materials  | Innovation with reliability      |

### TIDD-EC Excellence: Cascading Examples

| Level        | Description      | Key Elements                    |
| ------------ | ---------------- | ------------------------------- |
| Basic        | Simple case      | Input to output with explanation |
| Intermediate | Typical case     | Standard input to output         |
| Advanced     | Complex case     | Complex input to output          |
| Edge Case    | Unusual scenario | Special handling considerations |
| Anti-Pattern | What to avoid    | Why to avoid (explanation)      |

### RACE Urgency Patterns

**Rapid Action Template:**

```yaml
rapid_race:
  role:
    identity: "[Specialist with time-critical expertise]"
    authority: "[Decision-making level]"
  action:
    primary: "[Single clear directive]"
    method: "[Fastest effective approach]"
    deliverable: "[Concrete output in under N minutes]"
  context:
    urgency: "[Why speed matters now]"
    constraints: "[Hard limits: time, resources, scope]"
    prior_work: "[What already exists to build on]"
  execute:
    success_criteria: "[Measurable outcome]"
    format: "[Output structure]"
    fallback: "[If primary approach fails, do X]"
```

**RACE Compression Table:**

| Element   | Full Form                | Compressed (≤10 tokens) | When to Compress         |
| --------- | ------------------------ | ----------------------- | ------------------------ |
| **Role**  | Detailed expertise       | "[Domain] expert"       | Complexity ≤ 3           |
| **Action** | Multi-step instructions | Single verb + object    | Single-output tasks      |
| **Context** | Full background        | Key constraint only     | Context is self-evident  |
| **Execute** | Criteria + format      | Output type only        | Format is obvious        |

**RACE Pattern Summary:**

| Pattern            | Key Feature                  | When to Use                          |
| ------------------ | ---------------------------- | ------------------------------------ |
| Rapid RACE         | Minimal tokens, max speed    | Time-critical single-output tasks    |
| RACE + Constraint  | Hard limits front-loaded     | Urgent tasks with non-negotiables    |
| Iterative RACE     | Execute → feedback → re-RACE | Rapid prototyping cycles             |

### CIDI Process Documentation Patterns

**Layered Instructions Template:**

```yaml
layered_cidi:
  context:
    domain: "[Knowledge area]"
    audience_level: "[Beginner / Intermediate / Advanced]"
    environment: "[Tools, platforms, prerequisites]"
  instructions:
    primary: "[Core task to accomplish]"
    sequence:
      step_1: "[First action with expected result]"
      step_2: "[Next action building on step 1]"
      step_3: "[Verification or checkpoint]"
    style: "[Directive / Tutorial / Reference]"
  details:
    specifications: "[Exact values, thresholds, formats]"
    exceptions: "[When to deviate from standard flow]"
    troubleshooting: "[Common failure points and fixes]"
  input:
    required: "[What the user must provide]"
    optional: "[What enhances the output]"
    format: "[Expected input structure]"
```

**Input Specification Patterns:**

| Input Type       | Specification Pattern                    | Example                                 |
| ---------------- | ---------------------------------------- | --------------------------------------- |
| **Structured**   | Schema + validation rules                | "JSON with required fields: name, type" |
| **Freeform**     | Boundaries + examples                    | "1-3 paragraphs describing the issue"   |
| **Conditional**  | If-then input requirements               | "If API: include endpoint; if CLI: include command" |
| **Multi-source** | Priority ordering + merge rules          | "Primary: user data; Fallback: defaults" |

**CIDI Pattern Summary:**

| Pattern          | Key Feature                     | When to Use                          |
| ---------------- | ------------------------------- | ------------------------------------ |
| Tutorial CIDI    | Step-by-step with checkpoints   | Teaching new processes               |
| SOP CIDI         | Strict sequence, no deviation   | Compliance-critical procedures       |
| Onboarding CIDI  | Progressive detail revelation   | New user or system introduction      |

### CRISPE Strategic Exploration Patterns

**Strategy Exploration Template:**

```yaml
strategic_crispe:
  capacity:
    role: "[Strategic advisor with domain expertise]"
    perspective: "[Industry / academic / cross-functional]"
    thinking_style: "[First-principles / analogical / systems]"
  insight:
    background: "[Key data, trends, or observations]"
    assumptions: "[What we believe to be true and why]"
    unknowns: "[What we need to discover]"
  statement:
    challenge: "[Core question or problem to explore]"
    scope: "[Boundaries of exploration]"
    success: "[What a good answer looks like]"
  personality:
    tone: "[Analytical / visionary / pragmatic]"
    risk_appetite: "[Conservative / balanced / aggressive]"
    communication: "[Executive summary / detailed analysis / recommendation-first]"
  experiment:
    approach: "[How to test or validate findings]"
    alternatives: "[Generate N distinct options]"
    evaluation: "[Criteria for comparing options]"
```

**Experiment Design Patterns:**

| Experiment Type    | Structure                          | When to Use                           |
| ------------------ | ---------------------------------- | ------------------------------------- |
| **A/B Comparison** | Two approaches, same criteria      | Clear binary choice                   |
| **Multi-Option**   | 3-5 alternatives with trade-offs   | Complex decision with many variables  |
| **Staged**         | Sequential experiments building on results | Uncertain problem space          |
| **Constraint-First** | Define limits, then explore within | Resource-bounded exploration          |

**CRISPE Pattern Summary:**

| Pattern               | Key Feature                    | When to Use                          |
| --------------------- | ------------------------------ | ------------------------------------ |
| Market Analysis CRISPE | Data-driven insight focus     | Competitive analysis, market entry   |
| Innovation CRISPE     | Divergent thinking emphasis    | New product ideation, blue-sky       |
| Decision CRISPE       | Evaluation criteria up front   | Executive decisions, investment choices |

### CRAFT Comprehensive Planning Patterns

**Multi-Stakeholder Template:**

```yaml
comprehensive_craft:
  context:
    situation: "[Current state and background]"
    stakeholders: "[Who is affected and their priorities]"
    constraints: "[Budget, timeline, technical, regulatory]"
    dependencies: "[What this relies on or blocks]"
  role:
    primary: "[Lead expertise area]"
    secondary: "[Supporting perspective]"
    authority: "[Decision scope and escalation path]"
  action:
    objective: "[Primary goal with measurable outcome]"
    decomposition:
      phase_1: "[Foundation work]"
      phase_2: "[Core implementation]"
      phase_3: "[Validation and delivery]"
    methodology: "[Approach and reasoning]"
  format:
    structure: "[Document type and organization]"
    detail_level: "[Executive / operational / technical]"
    deliverables: "[List of concrete outputs]"
  target:
    audience: "[Primary and secondary consumers]"
    success_metrics: "[Quantifiable outcomes]"
    timeline: "[Key milestones and deadlines]"
```

**Nested Action Decomposition:**

| Level       | Scope               | Detail                                   |
| ----------- | -------------------- | ---------------------------------------- |
| **Objective** | What to achieve    | Single measurable outcome                |
| **Phase**   | Major work stream    | 2-4 phases with clear boundaries         |
| **Task**    | Actionable item      | Specific deliverable with owner          |
| **Step**    | Atomic instruction   | Single action, verifiable result         |

**CRAFT vs RCAF Decision Guidance:**

| Factor              | Choose RCAF           | Choose CRAFT              |
| ------------------- | --------------------- | ------------------------- |
| Stakeholders        | Single audience       | Multiple audiences        |
| Complexity          | ≤ 6                   | 7-10                      |
| Timeline            | Single deliverable    | Phased delivery           |
| Success criteria    | Implicit or simple    | Multi-metric, measurable  |
| Dependencies        | None or minimal       | Cross-functional          |

**CRAFT Pattern Summary:**

| Pattern           | Key Feature                       | When to Use                           |
| ----------------- | --------------------------------- | ------------------------------------- |
| Enterprise CRAFT  | Governance layers, approval gates | Organizational change, policy         |
| Research CRAFT    | Hypothesis-driven, evidence-based | Technical investigation, feasibility  |
| Product CRAFT     | User-centred, iterative phases    | Feature planning, roadmap items       |

<!-- /ANCHOR:framework-deep-dives -->
<!-- ANCHOR:pattern-combinations -->
## 4. Advanced Pattern Combinations

### Framework Fusion Patterns

**RCAF + CoT (Chain of Thought)**

```yaml
rcaf_cot_fusion:
  role: "[Expert] who thinks systematically"
  context: "[Situation requiring reasoning]"
  action:
    solve_by:
      step_1: {decompose: "[Break down]", reasoning: "[Why]"}
      step_2: {analyze: "[Examine]", reasoning: "[Approach]"}
      step_3: {synthesize: "[Combine]", reasoning: "[Logic]"}
      step_4: {validate: "[Verify]", reasoning: "[Criteria]"}
  format: "Show reasoning at each step with final answer highlighted"
```

**COSTAR + ReAct (Reasoning-Action)**

```yaml
costar_react_fusion:
  context: "[Initial situation]"
  objective: "[Goal requiring iteration]"
  style: "Analytical with visible reasoning"
  tone: "Professional problem-solver"
  audience: "[Stakeholders needing transparency]"
  response:
    cycle_format:
      thought: "[Current reasoning]"
      action: "[What to do]"
      observation: "[Result]"
    repeat_until: "[Success criteria met]"
    max_iterations: 5
```

**TIDD-EC + Few-Shot**

```yaml
tidd_ec_fewshot:
  task: "[Primary objective]"
  instructions: "Learn from examples then apply"
  dos: ["Follow patterns", "Maintain consistency", "Adapt to context"]
  donts: ["Deviate from patterns", "Ignore edge cases"]
  examples:
    case_1: {input: "[ex1]", output: "[out1]", explanation: "[pattern]"}
    case_2: {input: "[ex2]", output: "[out2]"}
    case_3: {input: "[ex3]", output: "[out3]"}
  context: "Apply learned patterns to new inputs"
```

### Framework Fusion Summary

| Combination            | Use Case             | Key Feature                       |
| ---------------------- | -------------------- | --------------------------------- |
| **RCAF + CoT**         | Systematic reasoning | Show reasoning at each step       |
| **COSTAR + ReAct**     | Iterative content    | Thought-action-observation cycles |
| **TIDD-EC + Few-Shot** | Pattern learning     | Learn from examples then apply    |
| **RACE + ToT**         | Quick decisions      | Decision trees for speed          |
| **CRAFT + All**        | Maximum power        | Comprehensive with all techniques |

<!-- /ANCHOR:pattern-combinations -->
<!-- ANCHOR:optimization-strategies -->
## 5. Framework Optimization Strategies

### Token Optimization

```yaml
optimize_framework_tokens:
  strategies:
    rcaf_optimization:
      role: {method: extract_key_expertise, remove: redundant_qualifiers}
      context: {method: filter_essential_only, remove: non_critical_details}
      action: {method: single_clear_verb, remove: multiple_actions}
      format: {method: structure_only, remove: style_descriptions}
    costar_optimization:
      merge_overlapping: {combine: [style, tone], into: style_tone}
      audience: {limit: 3_essential_characteristics}
      response: {remove: redundant_specifications}
    race_optimization:
      ultra_minimal: true
      single_line_per_element: true
      max_tokens_per_element: 10
```

**Efficiency Switching Rules:**

| Condition                                          | Switch         | Savings |
| -------------------------------------------------- | -------------- | ------- |
| token_count > threshold AND complexity < 4         | CRAFT to RCAF   | 15-20%  |
| token_count > threshold AND complexity < 2         | RCAF to RACE    | 5-10%   |
| token_count > threshold AND precision not critical | TIDD-EC to RCAF | 12-15%  |

<!-- /ANCHOR:optimization-strategies -->
<!-- ANCHOR:enhancement-methodology -->
## 6. Systematic Enhancement Methodology

### Enhancement Pipeline

```yaml
enhancement_pipeline:
  stages:
    structural_enhancement:
      description: "Improve organization and framework"
      process:
        apply_framework: {check: has_framework, if_missing: apply_best}
        reorganize_elements: {check: organization_quality, if_poor: reorganize}

    clarity_enhancement:
      description: "Improve expression and understanding"
      process:
        simplify_complex: {find: complex_sentences, action: simplify}
        remove_ambiguity: {find: ambiguous_terms, action: clarify}

    precision_enhancement:
      description: "Improve accuracy and specificity"
      process:
        add_measurability: {check: has_metrics, if_missing: add_success_metrics}
        specify_constraints: {check: has_constraints, if_missing: add_constraints}

    efficiency_enhancement:
      description: "Optimize token usage"
      process:
        remove_redundancy: {find: redundant_elements, action: consolidate}
        compress_verbose: {find: verbose_sections, action: compress}

    reusability_enhancement:
      description: "Make prompt template-ready"
      process:
        extract_parameters: {find: specific_values, action: convert_to_placeholders}
        add_flexibility: {find: rigid_structures, action: add_conditional_logic}
```

<!-- /ANCHOR:enhancement-methodology -->
<!-- ANCHOR:pattern-refinements -->
## 7. Pattern-Based Refinements

### Vague to Specific Transformation

| Detection                         | Transformation    | Example                                                         |
| --------------------------------- | ----------------- | --------------------------------------------------------------- |
| Vague verbs: help, assist, handle | Add specific role | "Help analyze" becomes "Data analyst specializing in [domain]"        |
| Vague nouns: things, stuff, data  | Specify context   | "customer data" becomes "[Platform] data, [Time period], [N] records" |
| Missing metrics                   | Define action     | "analyze" becomes "Identify [X] patterns, segment by [criteria]"      |
| Missing scope                     | Clarify format    | "provide results" becomes "[Format type] with [specific sections]"    |

**Impact:** CLEAR +15 to +20 | Primary: Expression and Logic

### Assumption Elimination

| Implicit Reference  | Replacement                       |
| ------------------- | --------------------------------- |
| "our system"        | [Specific tech stack description] |
| "the usual format"  | [Exact format specification]      |
| "standard approach" | [Specific methodology]            |
| "as discussed"      | [Reference or full context]       |

**Impact:** CLEAR +3 to +5 | Primary: Correctness

### Scope Boundary Definition

```yaml
scope_boundaries:
  included: {prefix: "This includes:", items: "[Explicit list of what is in scope]"}
  excluded: {prefix: "This excludes:", items: "[Explicit list of what is out of scope]"}
  edge_cases: {prefix: "Edge cases:", handling: "[How to handle boundary scenarios]"}
```

**Impact:** CLEAR +4 to +6 | Primary: Logic/Coverage

<!-- /ANCHOR:pattern-refinements -->
<!-- ANCHOR:excellence-patterns -->
## 8. Excellence Patterns

### Complete Context Layering (45+ CLEAR)

| Layer         | Description             | Elements                                         |
| ------------- | ----------------------- | ------------------------------------------------ |
| Environmental | Where/when this happens | location, timing, platform, environment          |
| Historical    | What led to this        | background, previous_attempts, lessons_learned   |
| Constraints   | Limitations             | technical, resource, time, regulatory            |
| Resources     | Available assets        | tools, data, team, budget                        |
| Dependencies  | What this relies on     | upstream, downstream, external, internal         |
| Stakeholders  | Who is involved         | users, approvers, implementers, affected_parties |

**Implementation:** For each layer, assess relevance. If relevant, add to context and organize hierarchically.

### Multi-Level Success Criteria

| Level          | Description            | Threshold                       | Measurement        |
| -------------- | ---------------------- | ------------------------------- | ------------------ |
| Minimum Viable | Baseline acceptability | [Specific minimum requirements] | [How to measure]   |
| Target         | Expected outcome       | [Standard success level]        | [Metrics and KPIs] |
| Excellence     | Exceptional result     | [Stretch goals]                 | [Advanced metrics] |

| Timeline   | Goals           |
| ---------- | --------------- |
| Immediate  | [Quick wins]    |
| Short-term | [30-day goals]  |
| Long-term  | [90+ day goals] |

<!-- /ANCHOR:excellence-patterns -->
<!-- ANCHOR:recovery-protocols -->
## 9. Recovery & Repair Protocols

### REPAIR Framework

```yaml
repair_framework:
  recognize:
    description: "Identify all issues by category (critical, major, minor, style)"
    process: "Load error patterns, match against prompt, categorize"

  explain:
    description: "Explain impact with examples"
    for_each_issue: [what, why_matters, example_failure, fix_preview]

  propose:
    description: "Generate fix proposals"
    for_each_issue: [solutions, effort, impact, priority]
    sort_by: priority_descending

  apply:
    description: "Apply fixes based on strategy"
    strategies:
      minimal: {filter: "priority > 8", description: "Critical fixes only"}
      balanced: {filter: "impact/effort > 2", description: "Best ROI fixes"}
      comprehensive: {filter: "priority > 3", description: "All meaningful fixes"}
      critical_only: {filter: "severity == critical", description: "Must-fix only"}

  iterate:
    description: "Iterate until quality target met"
    config: {max_iterations: 5, target_clear_score: target_score}
    process: "while iterations < max AND score < target: calculate, recognize, propose, apply"

  record:
    description: "Record for pattern learning"
    learning_record: [original_prompt, final_prompt, improvement_delta, successful_patterns, iterations_needed]
```

<!-- /ANCHOR:recovery-protocols -->
<!-- ANCHOR:clear-evaluation -->
## 10. CLEAR Evaluation Mastery

### CLEAR Dimensions (50 points)

| Dimension       | Points | Weight | Assessment Criteria                                |
| --------------- | ------ | ------ | -------------------------------------------------- |
| **C**orrectness | 10     | 20%    | Accuracy, no contradictions, valid assumptions     |
| **L**ogic       | 10     | 20%    | Reasoning flow, cause-effect, conditional handling |
| **E**xpression  | 15     | 30%    | Clarity, specificity, minimal ambiguity            |
| **A**rrangement | 10     | 20%    | Structure, organization, logical flow              |
| **R**eusability | 5      | 10%    | Adaptability, parameterization, flexibility        |

### Context-Aware Scoring

```yaml
contextual_clear_scoring:
  base_weights:
    correctness: 0.20
    logic: 0.20
    expression: 0.30
    arrangement: 0.20
    reuse: 0.10

  context_adjustments:
    api_integration:
      correctness: 0.30  # Precision critical
      expression: 0.20   # Less important

    creative_writing:
      expression: 0.35   # Clarity paramount
      correctness: 0.15  # Less critical

    template_creation:
      reuse: 0.25        # Reusability focus
      logic: 0.15        # Reduced weight
```

### Dimension Interdependencies

| Relationship             | Correlation | Notes                               |
| ------------------------ | ----------- | ----------------------------------- |
| Expression / Arrangement | 0.7         | Clear language needs good structure |
| Logic / Correctness      | 0.8         | Complete coverage ensures accuracy  |
| Arrangement / Reuse      | 0.6         | Good structure enables templates    |
| Expression / Correctness | 0.5         | Clarity prevents misinterpretation  |

### Per-Dimension Scoring Rubrics

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

**Dimension Floor Thresholds:**

| Dimension | Floor | Max | Weight |
|---|---|---|---|
| **C** - Correctness | 7 | 10 | 20% |
| **L** - Logic | 7 | 10 | 20% |
| **E** - Expression | 10 | 15 | 30% |
| **A** - Arrangement | 7 | 10 | 20% |
| **R** - Reusability | 3 | 5 | 10% |

A deliverable scoring 40+ overall but failing a per-dimension floor must still be revised until the floor is met.

<!-- /ANCHOR:clear-evaluation -->
<!-- ANCHOR:advanced-scoring -->
## 11. Advanced Scoring Techniques

### Multi-Pass Scoring

| Pass | Name                | Checks                                                      | Depth         | Weight |
| ---- | ------------------- | ----------------------------------------------------------- | ------------- | ------ |
| 1    | Surface Evaluation  | Framework presence, basic completeness, obvious issues      | Shallow       | 0.25   |
| 2    | Deep Analysis       | Ambiguity detection, hidden assumptions, edge case coverage | Thorough      | 0.40   |
| 3    | Interaction Testing | AI interpretation, failure modes, output predictability     | Comprehensive | 0.35   |

**Aggregation:** Use weighted average of pass scores.

### Comparative Scoring

```yaml
comparative_scoring:
  input: [prompt_versions]
  process:
    for_each_version:
      - calculate_clear_score
      - identify_strengths
      - identify_weaknesses
      - calculate_improvement_potential
  analysis:
    find_best: max_by_total_score
    extract_patterns: success_factors
    generate_path: optimization_sequence
```

<!-- /ANCHOR:advanced-scoring -->
<!-- ANCHOR:weakness-detection -->
## 12. Weakness Detection & Analysis

```yaml
detect_prompt_weaknesses:
  weakness_detectors:
    vagueness:
      - word_list: ["help", "assist", "some", "various"]
      - unmeasurable_outcomes
      - missing_specifics

    incompleteness:
      - missing_framework_elements
      - undefined_terms
      - assumed_knowledge

    ambiguity:
      - multiple_interpretations
      - pronoun_clarity
      - modifier_attachment

    structure:
      - logical_flow
      - element_organization
      - hierarchy_clarity

    efficiency:
      - redundancy
      - token_waste
      - unnecessary_complexity

  output: [categorized_issues, severity_scores, priority_fixes, estimated_improvement]
```

<!-- /ANCHOR:weakness-detection -->
<!-- ANCHOR:use-case-templates -->
## 13. Use Case Templates

### Software Development

```yaml
api_documentation_template:
  framework: TIDD-EC
  task: "Document REST API endpoint for [resource]"
  instructions:
    - "Define endpoint (method, path, version)"
    - "List all parameters with types"
    - "Show request/response examples"
    - "Document error codes"
  dos: ["Consistent formatting", "Include curl examples", "Specify auth"]
  donts: ["Expose internal logic", "Skip error docs"]
  examples: "[Include 3 real examples]"
  context: "[API version, tech stack, audience]"

code_review_template:
  framework: "RCAF + CoT"
  role: "Senior developer reviewing code for production readiness"
  context: "[Language], [Framework], [Project standards]"
  action:
    review_thinking:
      - "Functionality: Does it work as intended?"
      - "Performance: Are there bottlenecks?"
      - "Security: Any vulnerabilities?"
      - "Maintainability: Is it readable?"
      - "Testing: Adequate coverage?"
  format: "Structured feedback with severity levels"
```

### Data Analysis

```yaml
exploratory_data_analysis:
  framework: COSTAR
  context: "Dataset: [N] records, [M] features, [quality issues]"
  objective: "Understand patterns, prepare for modeling"
  style: "Technical but stakeholder-accessible"
  audience: "Data team and business analysts"
  response: "Jupyter notebook with: data quality, stats, visualizations, recommendations"
```

<!-- /ANCHOR:use-case-templates -->
<!-- ANCHOR:mastery-principles -->
## 14. Mastery Principles

### Ten Commandments of Prompt Excellence

| #   | Principle                       | Key Guidance                                                                         |
| --- | ------------------------------- | ------------------------------------------------------------------------------------ |
| 1   | Start Simple, Enhance Gradually | Begin RACE/RCAF. Add complexity only when needed. Stop when good enough.             |
| 2   | Clarity Trumps Completeness     | Better clear about less than comprehensive but confusing. Expression = 30% of CLEAR. |
| 3   | Framework Fit Over Fancy        | Right tool for job, not most sophisticated. RCAF works for 80%.                      |
| 4   | Measure, Don't Guess            | CLEAR score everything. Track improvements. Learn from patterns.                     |
| 5   | Examples Beat Explanations      | One example outweighs a paragraph. Show good and bad. Include edge cases.            |
| 6   | Constraints Liberate Creativity | Define boundaries. Include what is NOT wanted. Specify limits.                       |
| 7   | Token Economy Matters           | Every token has cost. Balance detail/efficiency. Optimize high-frequency.            |
| 8   | Test with Pessimism             | Assume misinterpretation. Check edge cases. Verify with variations.                  |
| 9   | Iterate Based on Output         | Start with v1. Refine based on results. Stop at diminishing returns.                 |
| 10  | Document for Reuse              | Build templates not one-offs. Extract patterns. Share knowledge.                     |

### Excellence Formula

```yaml
excellence_formula:
  equation: |
    Prompt Excellence =
      (Right Framework x Clear Requirements)
      x (Complete Coverage x Good Structure)
      x (Concise Expression)
      x (1 + Reasoning Pattern Bonus)
      x (1 - Token Overhead Penalty)
      + DEPTH Processing Bonus

  targets:
    minimum: "CLEAR >= 40/50"
    excellence: "CLEAR >= 45/50"

  variables:
    framework_fit: [0.8, 1.0]
    requirement_clarity: [0.7, 1.0]
    coverage: [0.6, 1.0]
    structure_quality: [0.7, 1.0]
    expression: [0.8, 1.0]
    reasoning_bonus: [0, 0.2]
    token_penalty: [0, 0.2]
    depth_bonus: 5  # points
```

<!-- /ANCHOR:mastery-principles -->
<!-- ANCHOR:quick-reference -->
## 15. Quick Reference Card

### Framework Quick Select

| Complexity/Need     | Framework |
| ------------------- | --------- |
| 1-3, speed          | RACE      |
| 1-4, balance        | RCAF      |
| 3-6, audience       | COSTAR    |
| 4-6, instructions   | CIDI      |
| 5-7, creative       | CRISPE    |
| 6-8, precision      | TIDD-EC   |
| 7-10, comprehensive | CRAFT     |

### Enhancement Priority Matrix

| Score | Action                   |
| ----- | ------------------------ |
| < 25  | Complete rewrite (RCAF)  |
| 25-30 | Framework switch         |
| 30-35 | Fix 2 weakest dimensions |
| 35-40 | Polish weakest dimension |
| 40-45 | Optional refinements     |
| 45+   | Ship it                  |

### Common Fixes

| Problem         | Solution                      |
| --------------- | ----------------------------- |
| Vague           | Add specifics (Role, Context) |
| No structure    | Apply RCAF                    |
| Too complex     | Switch to RACE                |
| Missing metrics | Add success criteria          |
| Poor expression | Simplify language             |
| Not reusable    | Extract parameters            |

### Power Combinations

| Combination        | Use Case               |
| ------------------ | ---------------------- |
| RCAF + CoT         | Systematic thinking    |
| COSTAR + ReAct     | Iterative content      |
| TIDD-EC + Few-Shot | Learning from examples |
| RACE + ToT         | Quick decisions        |
| CRAFT + All        | Maximum power          |

### Unified Severity Scale

| Range  | Quality   | Action                  | Urgency |
| ------ | --------- | ----------------------- | ------- |
| 80%+   | Excellent | Ready for use           | None    |
| 70-79% | Good      | Minor refinements       | Low     |
| 60-69% | Adequate  | Targeted improvements   | Medium  |
| <60%   | Weak      | Significant enhancement | High    |

Applies to CLEAR (50pt).

<!-- /ANCHOR:quick-reference -->
