---
title: "Patterns and Evaluation - Framework Library and CLEAR Scoring"
description: "Framework library, enhancement patterns, and CLEAR evaluation methodology for systematic prompt engineering. Covers 11 frameworks (RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE, CRAFT, VIBE, VIBE-MP, FRAME, MOTION), the CLEAR 50-point scoring system, EVOKE/EVOKE-MP scoring, VISUAL scoring, power combinations, and enhancement priority protocols."
---

# Prompt Patterns & Evaluation Reference

Comprehensive framework library, enhancement patterns, and CLEAR evaluation methodology for systematic prompt engineering excellence.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Core Principle

Systematic prompt engineering requires matching the right framework to each task, applying structured enhancement patterns, and evaluating quality through calibrated scoring systems (CLEAR, EVOKE, VISUAL) to achieve consistent, measurable excellence.

### When to Use

- Selecting the optimal framework for a prompt task (RCAF, COSTAR, RACE, TIDD-EC, CRAFT, VIBE, VIBE-MP, FRAME, MOTION, etc.)
- Evaluating prompt quality using CLEAR, EVOKE, EVOKE-MP, or VISUAL scoring
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
| **VIBE**    | Vision, Inspiration, Behavior, Experience                    | Visual UI concepting, design     | Precision/specification  | 90%          |
| **VIBE-MP** | VIBE + MagicPath calibration                                 | MagicPath.ai UI design           | Non-MagicPath platforms  | 92%          |
| **FRAME**   | Focus, Rendering, Atmosphere, Modifiers, Exclusions          | Image generation optimization    | Precision/text prompts   | 90%          |
| **MOTION**  | Movement, Origin, Temporal, Intention, Orchestration, Nuance | Video generation                 | Static/image prompts     | 90%          |

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

    vibe:
      base_score: 2
      modifiers:
        - if: "visual_ui_concepting" then add: 10
        - if: "precision_critical" then subtract: 10

    vibe_mp:
      base_score: 2
      modifiers:
        - if: "magicpath_detected" then add: 12
        - if: "multi_page_flow" then add: 5
        - if: "user_journey_design" then add: 3
        - if: "precision_critical" then subtract: 10

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
| Visual UI  | -       | -        | Yes      | No        | **VIBE**    |
| MagicPath  | -       | -        | Yes      | No        | **VIBE-MP** |
| Image gen  | -       | -        | Yes      | No        | **FRAME**   |
| Video gen  | -       | -        | Yes      | No        | **MOTION**  |

### Design Directions (8 Total)

Apply these directions with the VIBE framework for UI concepting:

| Direction                    | Reference Products        | Emotional Core                   |
| ---------------------------- | ------------------------- | -------------------------------- |
| **Precision & Density**      | Linear, Raycast           | Efficiency, power, mastery       |
| **Warmth & Approachability** | Notion, Coda              | Comfort, collaboration           |
| **Sophistication & Trust**   | Stripe, Mercury           | Trust, security, professionalism |
| **Boldness & Clarity**       | Vercel                    | Decisiveness, modernity          |
| **Utility & Function**       | GitHub, VS Code           | Focus, productivity              |
| **Data & Analysis**          | Mixpanel, Amplitude       | Understanding, insight           |
| **Journey & Flow**           | Duolingo, Headspace       | Progress, achievement, discovery |
| **Narrative & Story**        | Apple Pages, Stripe Atlas | Storytelling, revelation         |

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

### FRAME Framework (Image Generation)

| Element        | Focus                 | Core Question                    |
| -------------- | --------------------- | -------------------------------- |
| **F**ocus      | Subject & Composition | "What is the viewer looking at?" |
| **R**endering  | Medium & Style        | "How should it be visualized?"   |
| **A**tmosphere | Lighting & Mood       | "What feeling does it evoke?"    |
| **M**odifiers  | Technical Parameters  | "What constraints apply?"        |
| **E**xclusions | Negative Prompts      | "What should be avoided?"        |

**FRAME Structure:**

```yaml
frame_structure:
  focus:
    subject: "[Primary subject with descriptive adjectives]"
    composition: "[Shot type, framing, perspective]"
  rendering:
    medium: "[Photography, digital art, oil painting, etc.]"
    style: "[Art movement, aesthetic, technique]"
  atmosphere:
    lighting: "[Natural, studio, dramatic, etc.]"
    mood: "[Emotional quality of the scene]"
    color: "[Color palette, temperature]"
  modifiers:
    platform_specific: "[--ar, --s for MJ; weights for SD]"
  exclusions:
    negative: "[Elements to avoid]"
```

**FRAME Vocabulary Banks (30 Sub-Categories):**

| Component          | Sub-Categories                                                                                                                 | Examples                                                              |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| **F - Focus**      | Shot Types, Camera Angles, Subject Hierarchy, Spatial Relationships, Composition Techniques, Subject Specificity               | Extreme wide, eye-level, primary/secondary/background, rule of thirds |
| **R - Rendering**  | Photography Styles, Illustration Styles, 3D Rendering, Movement & Era Aesthetics, Anime Sub-Types, Fine Art                    | Editorial, cel-shaded, Pixar, cyberpunk, chibi, impressionist         |
| **A - Atmosphere** | Lighting (Kelvin), Mood Vocabulary, Color Temperature, Weather/Environmental, Time of Day, Lighting Techniques, Depth of Field | Golden hour (2700K), ethereal, warm earth palette, volumetric fog     |
| **M - Modifiers**  | Aspect Ratios, Quality Markers, Emphasis Syntax, Reference Parameters, Camera Settings, Render Settings                        | 16:9, --sref, (element:1.4), f/1.4                                    |
| **E - Exclusions** | Negative Categories, Universal Foundation, Platform Handling, Positive Rephrasing, Style-Specific                              | Quality issues, anatomical flaws, DALL-E rephrasing                   |

**Platform Modifiers:**

| Platform             | Key Parameters                                       | Negatives                |
| -------------------- | ---------------------------------------------------- | ------------------------ |
| **Midjourney**       | `--ar`, `--s`, `--chaos`, `--sref`, `--cref`, `--no` | Partial (`--no`)         |
| **DALL-E 3**         | Size, Style (vivid/natural)                          | No (rephrase positively) |
| **Stable Diffusion** | `(weight:1.5)`, CFG scale, steps                     | Yes (dedicated field)    |
| **Flux**             | Guidance scale, HEX colors                           | No (ignored)             |
| **Imagen 4**         | Aspect ratio, multi-reference                        | No                       |
| **Ideogram**         | Text rendering focus                                 | No                       |
| **Leonardo**         | Style presets                                        | Yes                      |
| **Seedream**         | Speed optimization                                   | No                       |

### MOTION Framework (Video Generation)

| Element           | Focus                    | Core Question                  |
| ----------------- | ------------------------ | ------------------------------ |
| **M**ovement      | Subject & Camera Motion  | "How does everything move?"    |
| **O**rigin        | Starting Point/Reference | "What is the visual anchor?"   |
| **T**emporal      | Duration & Pacing        | "How does time flow?"          |
| **I**ntention     | Narrative Purpose        | "What story is being told?"    |
| **O**rchestration | Scene Choreography       | "How do elements interact?"    |
| **N**uance        | Subtle Details           | "What refinements are needed?" |

**MOTION Structure:**

```yaml
motion_structure:
  movement:
    camera: "[Static, pan, tilt, dolly, crane, handheld, drone]"
    subject: "[Walking, running, floating, spinning, swaying]"
    direction: "[Left to right, ascending, approaching, retreating]"
  origin:
    reference_type: "[Text-to-video, image-to-video]"
    establishing: "[Opening shot description]"
  temporal:
    duration: "[5 sec, 10 sec - platform dependent]"
    pacing: "[Slow motion, real-time, time-lapse]"
  intention:
    narrative: "[What story or feeling to convey]"
    purpose: "[Commercial, artistic, documentary]"
  orchestration:
    choreography: "[How elements move together]"
    transitions: "[Cut, dissolve, continuous shot]"
  nuance:
    details: "[Atmospheric effects, subtle movements]"
    physics: "[Realistic, stylized, dream-like]"
```

**Critical Video Principles:**

1. Describe motion, not static scenes ("walks slowly" not "is walking").
2. Avoid negative prompts (most video AI ignores them).
3. Keep clips short (5-10 seconds for consistency).
4. Specify camera movement first.
5. Image-to-video: 20-40 words; Text-to-video: 50-80 words.

**Platform Syntax (Top 5):**

| Platform             | Max Duration | Key Features                                | Audio     |
| -------------------- | ------------ | ------------------------------------------- | --------- |
| **Runway Gen-4/4.5** | 10 sec       | 6 camera movement types, Motion Brush       | No        |
| **Sora**             | 20 sec       | Natural language, physics simulation        | No        |
| **Kling 2.5/2.6**    | 5 min        | Motion brush, reversed pan/tilt terminology | Yes (2.6) |
| **Veo 3.1+**         | 148 sec      | Native audio, cinematography                | Yes       |
| **Pika 2.5**         | 10 sec       | Pikaswaps, lip sync                         | No        |

**Master Prompt Formula:**

| Mode      | Formula                                                                   |
| --------- | ------------------------------------------------------------------------- |
| **Image** | Subject then Setting then Lighting then Style then Camera then Technical                 |
| **Video** | Camera Movement then Subject then Action then Setting then Atmosphere then Style then Audio |

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

> For Visual UI Concepting (`$vibe`, `$v`), use **EVOKE scoring**. For Image/Video (`$image`, `$video`), use **VISUAL scoring**.

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

### CLEAR vs EVOKE vs VISUAL

| Criteria         | CLEAR                | EVOKE                | EVOKE-MP                  | VISUAL                   |
| ---------------- | -------------------- | -------------------- | ------------------------- | ------------------------ |
| **Use When**     | Precision prompts    | Visual UI concepting | MagicPath.ai UI           | Image/video generation   |
| **Modes**        | $improve, $refine    | $vibe, $v            | $vibe + magicpath context | $image, $video           |
| **Philosophy**   | Completeness & logic | Evocativeness        | Creative Director brief   | Specificity & atmosphere |
| **Total Points** | 50                   | 50                   | 50                        | 60 (image) / 70 (video)  |
| **Threshold**    | 40+                  | 40+                  | 42+                       | 48+ / 56+                |

**Standard EVOKE Weights (50 points):**

- **Evocative:** 15pts - Creates vivid mental imagery
- **Visual:** 10pts - Paints a picture AI can render
- **Open:** 10pts - Leaves room for creativity
- **Kinetic:** 10pts - Suggests motion and life
- **Emotional:** 5pts - Conveys experiential goals

**EVOKE-MP Weight Calibration (MagicPath.ai):**

- **Kinetic:** 13pts (vs 10 standard) - Critical for pathfinding
- **Visual:** 12pts (vs 10 standard) - Higher spatial clarity
- **Evocative:** 12pts (vs 15 standard) - Clear directional language
- **Open:** 8pts (vs 10 standard) - More structured flows
- **Emotional:** 5pts (same)

<!-- /ANCHOR:clear-evaluation -->
<!-- ANCHOR:visual-scoring -->
## 11. Visual Scoring for Image & Video

### VISUAL - Image Mode (60 points)

| Dimension       | Points | Threshold | Criteria                                 |
| --------------- | ------ | --------- | ---------------------------------------- |
| **V**ivid       | 15     | 12+       | Clear mental imagery, specific details   |
| **I**ntentional | 10     | 8+        | Clear purpose, defined composition       |
| **S**tyled      | 10     | 8+        | Defined aesthetic, consistent references |
| **U**nambiguous | 10     | 8+        | No conflicts, single interpretation      |
| **A**tmospheric | 10     | 8+        | Lighting, mood, color defined            |
| **L**ayered     | 5      | 4+        | Depth, foreground/background             |
| **Total**       | **60** | **48+**   | Quality threshold                        |

### VISUAL - Video Mode (70 points)

Adds: **M**otion (10 points, 8+ threshold) - Camera and subject motion described.

### VISUAL Scoring Algorithm

```yaml
calculate_visual_score:
  input: [prompt, mode]  # mode: "image" or "video"

  dimensions:
    vivid: {weight: 15, checks: [specific_subject, concrete_details, sensory_elements]}
    intentional: {weight: 10, checks: [defined_composition, clear_hierarchy, purpose_evident]}
    styled: {weight: 10, checks: [art_style_defined, consistent_aesthetic, technique_mentioned]}
    unambiguous: {weight: 10, checks: [no_conflicting_styles, single_interpretation, consistent_mood]}
    atmospheric: {weight: 10, checks: [lighting_defined, mood_conveyed, color_palette_implied]}
    layered: {weight: 5, checks: [foreground_background, depth_of_field, spatial_relationships]}
    motion: {weight: 10, video_only: true, checks: [camera_movement, subject_motion, temporal_pacing]}

  process:
    - determine_mode
    - score_each_dimension: [0-max_weight]
    - calculate_total
    - apply_threshold: 48 (image) or 56 (video)
```

### Common VISUAL Fixes

| Issue             | Impact         | Fix                            |
| ----------------- | -------------- | ------------------------------ |
| Vague subject     | -5 Vivid       | Specify subject with details   |
| No composition    | -4 Intentional | Add shot type + framing        |
| Missing style     | -4 Styled      | Define art style or medium     |
| Conflicting terms | -5 Unambiguous | Choose dominant style          |
| No lighting       | -4 Atmospheric | Add lighting direction + quality |
| No motion (video) | -6 Motion      | Add camera movement + action verbs |

<!-- /ANCHOR:visual-scoring -->
<!-- ANCHOR:advanced-scoring -->
## 12. Advanced Scoring Techniques

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
## 13. Weakness Detection & Analysis

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
## 14. Use Case Templates

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
## 15. Mastery Principles

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
## 16. Quick Reference Card

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
| Visual UI           | VIBE      |
| MagicPath.ai        | VIBE-MP   |
| Image generation    | FRAME     |
| Video generation    | MOTION    |

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
| Visual UI       | Switch to VIBE                |

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

Applies to CLEAR (50pt), EVOKE (50pt), VISUAL Image (60pt), VISUAL Video (70pt).

<!-- /ANCHOR:quick-reference -->
