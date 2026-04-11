---
title: "Prompt Engineering Specialist"
description: "Multi-framework prompt enhancement skill that transforms vague requests into structured, scored AI prompts using DEPTH processing, CLEAR scoring, and 7 proven frameworks."
trigger_phrases:
  - "prompt engineering enhancement"
  - "improve my prompt CLEAR score"
  - "DEPTH processing framework"
  - "prompt framework selection"
  - "RCAF CRAFT prompt structure"
  - "sk-improve-prompt"
---

# sk-improve-prompt

> Transforms vague or incomplete AI prompts into structured, scored outputs using 7 proven frameworks, DEPTH thinking methodology, and CLEAR quality validation.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. QUICK START](#2--quick-start)
- [3. FEATURES](#3--features)
  - [3.1 FEATURE HIGHLIGHTS](#31-feature-highlights)
  - [3.2 FEATURE REFERENCE](#32-feature-reference)
- [4. STRUCTURE](#4--structure)
- [5. CONFIGURATION](#5--configuration)
- [6. USAGE EXAMPLES](#6--usage-examples)
- [7. TROUBLESHOOTING](#7--troubleshooting)
- [8. FAQ](#8--faq)
- [9. RELATED DOCUMENTS](#9--related-documents)
<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### What This Skill Does

`sk-improve-prompt` is a prompt engineering specialist that takes vague, incomplete, or under-specified AI prompts and produces structured, high-quality outputs through a four-phase pipeline. The pipeline begins with mode detection (via command prefix or keyword scoring), moves to framework selection (scoring 7 frameworks against task characteristics), applies DEPTH processing (iterative refinement across up to 5 cognitive phases and up to 10 rounds), and completes with CLEAR scoring (a 50-point quality validation that must reach 40 to pass).

The skill covers the full spectrum of prompt complexity, from rapid single-output tasks handled by the RACE framework to large-scale multi-stakeholder projects handled by CRAFT. Framework selection is automatic: the skill scores each candidate against your task's complexity, urgency, audience specificity, creativity requirements, and precision needs, then selects the best match and offers an alternative. Every output except `$raw` mode includes a transparency report showing which framework was chosen, how many DEPTH rounds ran, and the CLEAR score breakdown.

The skill also validates every prompt against RICCE criteria (Role, Instructions, Context, Constraints, Examples) before delivery. If any element is missing, the DEPTH Harmonize phase flags it and either adds it or documents why it was intentionally omitted. This prevents silent gaps that would cause the enhanced prompt to underperform in practice.

When prompt work feeds back into a Spec Kit packet, `/spec_kit:resume` is the canonical recovery surface. Packet continuity still lives in `handover.md`, then `_memory.continuity`, then the remaining spec docs, while generated memory artifacts stay secondary.

### Key Statistics

| Category | Value | Details |
| --- | --- | --- |
| Frameworks | 7 | RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE, CRAFT |
| Operating Modes | 8 | Interactive, Text, Short, Improve, Refine, JSON, YAML, Raw |
| CLEAR Score Dimensions | 5 | Correctness, Logic, Expression, Arrangement, Reusability |
| Output Formats | 3 | Markdown (default), JSON, YAML |
| DEPTH Phases | 5 | Discover, Engineer, Prototype, Test, Harmonize |
| CLEAR Pass Threshold | 40/50 | Applied to all modes except `$raw` |
| Max DEPTH Rounds | 10 | Standard modes (3 for `$short`, 0 for `$raw`) |

### Key Features

| Feature | Description |
| --- | --- |
| Framework Auto-Selection | Scores 7 frameworks against task characteristics and selects the best fit automatically |
| DEPTH Processing | 5-phase iterative refinement (Discover, Engineer, Prototype, Test, Harmonize) |
| CLEAR Scoring | 50-point quality scale with per-dimension floors and a 40+ delivery threshold |
| RICCE Validation | Checks Role, Instructions, Context, Constraints, and Examples before delivery |
| Multi-Format Output | Delivers structured prompts in Markdown, JSON, or YAML |
| Transparency Report | Every output includes mode, framework, perspective count, and score breakdown |
| Smart Routing | Command prefix detection with keyword-weighted fallback and disambiguation checklist |
| Framework Fusion | Supports advanced combinations (RCAF + CoT, COSTAR + ReAct, TIDD-EC + Few-Shot) |

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:quick-start -->
## 2. QUICK START

**Step 1.** Invoke the skill. The skill loads automatically via Gate 2 routing when prompt engineering intent is detected. You can also invoke it directly by reading `SKILL.md`.

**Step 2.** Choose a mode using a command prefix. For most improvements, use `$improve`. For quick iterations, use `$short`. For structured API output, use `$json` or `$yaml`. Omit the prefix to enter interactive (guided) mode.

```
$improve Write a summary of this document for an executive audience
$short Analyze customer churn data
$json Create an API endpoint specification for user authentication
$yaml Define a CI pipeline configuration for a Node.js project
$refine Build a complex multi-stakeholder project brief
$raw Restate this prompt exactly as given
```

**Step 3.** Answer the clarifying question. The skill asks one consolidated question before processing (all modes except `$raw`). Wait for it, then respond. The skill will not begin enhancement until you reply.

**Step 4.** Review the output. The skill delivers the enhanced prompt followed by a transparency report showing the framework selected, the number of DEPTH rounds applied, and the CLEAR score per dimension. If the score is below 40, the skill flags this and offers three options: additional refinement, a framework switch, or accepting the current output.

<!-- /ANCHOR:quick-start -->

---

<!-- ANCHOR:features -->
## 3. FEATURES

### 3.1 FEATURE HIGHLIGHTS

The framework selection system is the core differentiator of this skill. Rather than applying a single template to every request, the skill evaluates each of the 7 frameworks against five task characteristics: complexity (1-10 scale), urgency, audience specificity, creative element, and precision criticality. RCAF scores well for the majority of prompts because it covers the widest range without introducing unnecessary structure. COSTAR takes over when audience targeting or content style matters. TIDD-EC is selected when precision and compliance are non-negotiable, because its explicit Do's and Don'ts structure prevents ambiguity in high-stakes outputs. CRAFT sits at the top of the complexity range, handling multi-stakeholder planning where phased decomposition and measurable success criteria are required.

DEPTH processing is the thinking methodology that runs beneath every enhancement. It moves through five phases in sequence. Discover maps the current prompt, identifies weaknesses, selects the framework, and surfaces hidden assumptions. Engineer generates at least 8 enhancement approaches, applies constraint reversal to find non-obvious improvements, and selects the best candidate. Prototype builds the structured draft, applying mechanism-first ordering (why before what). Test applies CLEAR scoring and checks that every per-dimension floor is met (Correctness 7+, Logic 7+, Expression 10+, Arrangement 7+, Reusability 3+). Harmonize runs final checks, confirms perspective counts match the energy level, and prepares the transparency metadata. The number of rounds per phase scales by mode: 10 for most text modes, 3 for `$short`, and 0 for `$raw`.

CLEAR scoring gives every output a quantified quality measure before it leaves the skill. The 50-point scale weights Expression highest at 30% (15 points) because language clarity has the largest impact on how a model interprets a prompt. Correctness and Logic each carry 20% (10 points), covering factual accuracy and reasoning soundness. Arrangement carries 20% (10 points) for structure and hierarchy. Reusability carries 10% (5 points) for template potential and parameterization. A prompt that scores 40 or above in total but falls below a per-dimension floor must be revised before delivery. The floor system prevents a high Expression score from masking a logic gap that would cause the prompt to fail in practice.

The transparency report at the end of every delivery is intentional. It shows the framework selected and why, the number of DEPTH rounds applied, which perspectives were used during Discover, the CLEAR score per dimension, and any assumptions that were flagged during processing. This lets you evaluate the enhancement process, not just the result, and iterate with confidence.

### 3.2 FEATURE REFERENCE

#### Operating Modes

| Mode | Command | DEPTH Rounds | Scoring | Use Case |
| --- | --- | --- | --- | --- |
| Interactive | (no prefix) | 10 | CLEAR | Guided enhancement with one clarifying question |
| Text | `$text` | 10 | CLEAR | Standard text prompt improvement |
| Short | `$short` | 3 | CLEAR | Quick refinement, time-sensitive tasks |
| Improve | `$improve` | 10 | CLEAR | Standard enhancement (most common) |
| Refine | `$refine` | 10 | CLEAR | Maximum optimization for critical prompts |
| JSON | `$json` | 10 | CLEAR | API-ready structured output |
| YAML | `$yaml` | 10 | CLEAR | Configuration-style structured output |
| Raw | `$raw` | 0 | None | Pass-through with no enhancement |

#### Framework Selection Matrix

| Complexity | Primary Need | Framework | Success Rate |
| --- | --- | --- | --- |
| 1-3 | Speed | RACE | 88% |
| 1-4 | Clarity | RCAF | 92% |
| 3-6 | Audience | COSTAR | 94% |
| 4-6 | Instructions | CIDI | 90% |
| 5-7 | Creativity | CRISPE | 87% |
| 6-8 | Precision | TIDD-EC | 93% |
| 7-10 | Full-scope | CRAFT | 91% |

#### CLEAR Scoring Dimensions

| Dimension | Max Points | Weight | Floor | Measures |
| --- | --- | --- | --- | --- |
| Correctness (C) | 10 | 20% | 7 | Accuracy, no contradictions, valid assumptions |
| Logic (L) | 10 | 20% | 7 | Reasoning flow, cause-effect, conditional handling |
| Expression (E) | 15 | 30% | 10 | Clarity, specificity, minimal ambiguity |
| Arrangement (A) | 10 | 20% | 7 | Structure, organization, logical flow |
| Reusability (R) | 5 | 10% | 3 | Adaptability, parameterization, template potential |
| **Total** | **50** | | **40 to pass** | |

#### DEPTH Phases

| Phase | Purpose | Key Output |
| --- | --- | --- |
| Discover | Map current prompt, identify weaknesses, select framework | Perspectives analyzed, assumptions surfaced, framework chosen |
| Engineer | Generate 8+ enhancement approaches, apply constraint reversal | Best approach selected, requirements mapped |
| Prototype | Build structured draft with mechanism-first ordering | Draft complete, format applied |
| Test | Apply CLEAR scoring, check per-dimension floors | Score validated (40+/50 required) |
| Harmonize | Final polish, confirm perspectives, prepare metadata | Transparency report complete, deliverable ready |

#### Framework Fusion Options

| Combination | Use Case |
| --- | --- |
| RCAF + Chain of Thought | Systematic multi-step reasoning |
| COSTAR + ReAct | Iterative content with visible reasoning cycles |
| TIDD-EC + Few-Shot | Pattern learning from examples |
| RACE + Tree of Thought | Quick decisions with branching options |
| CRAFT + All techniques | Maximum power for complex, multi-audience projects |

<!-- /ANCHOR:features -->

---

<!-- ANCHOR:structure -->
## 4. STRUCTURE

```
sk-improve-prompt/
├── SKILL.md                          # AI entry point: mode detection, smart routing, pipeline
├── README.md                         # This file
├── references/
│   ├── depth_framework.md            # DEPTH phases, energy levels, RICCE integration, CLEAR scoring
│   └── patterns_evaluation.md        # 7 framework definitions, selection matrix, CLEAR rubrics
└── assets/
    ├── format_guide_markdown.md      # Markdown format deep-dive: delivery standards, validation
    ├── format_guide_json.md          # JSON format deep-dive: data types, RCAF/CRAFT structures
    └── format_guide_yaml.md          # YAML format deep-dive: templates, validation, best practices
```

| File | Purpose |
| --- | --- |
| `SKILL.md` | AI entry point with mode detection, smart routing pseudocode, and operating rules |
| `references/depth_framework.md` | DEPTH methodology: five phases, energy levels, cognitive techniques, CLEAR integration |
| `references/patterns_evaluation.md` | Framework library, selection algorithm, CLEAR scoring rubrics, recovery protocols |
| `assets/format_guide_*.md` | Format-specific deep-dives loaded on demand for JSON, YAML, and Markdown outputs |

<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:configuration -->
## 5. CONFIGURATION

No configuration is required. The skill detects the operating mode from the command prefix in your message. If no prefix is present, it falls back to keyword-weighted intent scoring. If intent scoring produces no match, the skill defaults to interactive mode and presents a disambiguation checklist.

| Command Prefix | Mode Activated | Notes |
| --- | --- | --- |
| `$improve` | Improve | Most common general-purpose mode |
| `$text` | Text | Equivalent to Improve for text prompts |
| `$short` or `$s` | Short | Reduces DEPTH rounds to 3 |
| `$refine` | Refine | Maximum optimization pass |
| `$json` | JSON | Forces JSON-only output format |
| `$yaml` | YAML | Forces YAML-only output format |
| `$raw` | Raw | Skips all DEPTH processing |
| `$deep` or `$d` | Deep | Extended Discover phase, all 5 perspectives required |

Resource loading is controlled by the smart router in `SKILL.md` Section 2. `depth_framework.md` and `patterns_evaluation.md` load conditionally based on detected intent. The format guide assets (`format_guide_*.md`) load only when a format-specific mode is active, keeping context usage proportional to the task.

<!-- /ANCHOR:configuration -->

---

<!-- ANCHOR:usage-examples -->
## 6. USAGE EXAMPLES

### Example 1: Standard Prompt Improvement

**Input:**
```
$improve Write a marketing email for our new product launch
```

The skill asks one clarifying question covering use case, target audience, and any tone or length requirements. After you respond, it scores the task characteristics: complexity 3, urgency low, audience specific, creative element present. COSTAR scores highest. 10 DEPTH rounds run across all five phases. The Discover phase analyzes from three perspectives (Prompt Engineering Expert, AI Interpretation Specialist, End-User Experience Designer). The Prototype phase builds the structured draft using COSTAR elements. The Test phase scores CLEAR at 43/50 (C:8, L:8, E:13, A:9, R:5), clearing the 40 threshold and all per-dimension floors.

**Output includes:** Structured COSTAR prompt with Context, Objective, Style, Tone, Audience, and Response fields defined. Transparency report showing framework, 3 perspectives used, and CLEAR 43/50.

---

### Example 2: JSON Format for API Use

**Input:**
```
$json Create an API endpoint specification for user authentication
```

The `$json` prefix locks the output to pure JSON format. The skill scores the task as complexity 5, precision-critical, no audience specificity: TIDD-EC is selected. The Prototype phase applies the JSON format guide, producing nested objects with consistent types, no trailing commas, and required fields verified. CLEAR scores 41/50 with Expression weighted toward JSON schema correctness.

**Output includes:** Valid JSON object with `task`, `instructions`, `dos`, `donts`, `examples`, and `context` fields. No Markdown formatting in the response body.

---

### Example 3: Quick Refinement

**Input:**
```
$short Analyze customer churn data
```

The `$short` prefix activates Quick energy level: phases run as Discover, Prototype, Harmonize (Engineer and Test are condensed). One to two perspectives are used. Three DEPTH rounds run. The task scores complexity 2, no urgency, no audience specificity: RCAF is selected. The output is concise and delivered faster than a full 10-round run.

**Output includes:** Structured RCAF prompt with Role, Context, Action, and Format fields. CLEAR score reported. Total turnaround is significantly faster than standard mode.

<!-- /ANCHOR:usage-examples -->

---

<!-- ANCHOR:troubleshooting -->
## 7. TROUBLESHOOTING

**CLEAR score below 40 after DEPTH processing**

What you see: The transparency report shows a total below 40, or a per-dimension floor is not met (for example, Expression at 9 when the floor is 10).

Common causes: The original prompt lacks sufficient context for the skill to work with, or the selected framework is mismatched to the actual task complexity.

Fix: Provide more context in your original request, especially audience, purpose, and any constraints. Ask the skill to switch frameworks (for example, "Try TIDD-EC instead"). The skill offers three options when it cannot reach threshold: additional refinement, framework switch, or accepting the current output with the score flagged.

---

**Wrong framework selected**

What you see: The transparency report shows a framework that does not fit the task (for example, RACE selected for a complex multi-stakeholder planning request).

Common causes: The task description is ambiguous about complexity or scope, causing the framework scoring algorithm to underestimate.

Fix: State complexity explicitly in your request (for example, "This is a complex, multi-audience, compliance-critical task"). You can also name the framework directly (for example, "Use CRAFT"). The skill respects explicit framework instructions and skips auto-selection.

---

**JSON output contains Markdown formatting**

What you see: The JSON response includes Markdown code fences, headers, or prose explanations mixed into the JSON body.

Common causes: The `$json` prefix was not used, and the smart router defaulted to Markdown format. Keyword detection picked up "JSON" in the prompt text but did not activate JSON-only mode.

Fix: Prefix the request with `$json` to force JSON-only output mode. Do not describe JSON in the prompt text without the prefix, as keyword overlap can confuse mode detection.

---

**Mode detection picks the wrong mode**

What you see: The transparency report shows Interactive mode when you expected Improve or Refine.

Common causes: Keywords in the request overlap across multiple modes, and the intent scoring algorithm cannot determine a clear winner.

Fix: Use an explicit command prefix. `$improve`, `$refine`, `$json`, `$yaml`, `$short`, and `$raw` always override keyword scoring. Rely on keyword detection only when you want the skill to infer intent.

---

**DEPTH rounds feel excessive for a simple task**

What you see: The skill runs 10 full rounds for what you consider a simple, low-complexity prompt.

Common causes: Standard and Improve modes default to 10 rounds regardless of prompt complexity, because the skill cannot predict output quality in advance.

Fix: Use `$short` (3 rounds) for simple or time-sensitive tasks. Use `$raw` to skip all processing entirely. Both modes still deliver structured output, but with lower processing depth.

<!-- /ANCHOR:troubleshooting -->

---

<!-- ANCHOR:faq -->
## 8. FAQ

**Q: When should I use `$refine` instead of `$improve`?**

A: Both modes run 10 DEPTH rounds and use the same framework selection process. The difference is intent signal: `$refine` tells the skill that the prompt is going to a high-stakes use case and you want maximum optimization. In practice, the skill applies the same rigor either way, but `$refine` is the right signal when you need the transparency report to reflect that a maximum-effort pass was made.

---

**Q: Can I specify which framework to use instead of letting the skill choose?**

A: Yes. Name the framework explicitly in your request (for example, "Use TIDD-EC to structure this" or "Apply COSTAR"). The skill skips auto-selection and applies the named framework directly. If you name a framework that is a poor fit for the task, the skill flags this in the transparency report but proceeds as instructed.

---

**Q: What happens if the skill cannot reach a CLEAR score of 40 after all improvement cycles?**

A: After three improvement iterations, the skill stops cycling and delivers the best version it produced. The transparency report shows the score, flags which dimensions fell short, and offers three explicit options: accepting the current output, requesting another round with additional context from you, or switching to a different framework.

---

**Q: Does the skill modify the meaning or intent of my original prompt?**

A: No. The DEPTH Prototype and Test phases both include an intent preservation check. If any enhancement changes the core meaning of your request, the skill rolls back that change and flags it in the transparency report. The goal is structural improvement, not reinterpretation.

<!-- /ANCHOR:faq -->

---

<!-- ANCHOR:related-documents -->
## 9. RELATED DOCUMENTS

| Resource | Path | Purpose |
| --- | --- | --- |
| SKILL.md | `./SKILL.md` | AI entry point with routing logic, rules, and processing pipeline |
| DEPTH Framework | `./references/depth_framework.md` | Five-phase thinking methodology, energy levels, cognitive techniques |
| Patterns and Evaluation | `./references/patterns_evaluation.md` | Framework library, CLEAR scoring rubrics, recovery protocols |
| Markdown Format Guide | `./assets/format_guide_markdown.md` | Markdown delivery standards, RCAF and CRAFT structures |
| JSON Format Guide | `./assets/format_guide_json.md` | JSON data types, nested structures, CLEAR validation for API outputs |
| YAML Format Guide | `./assets/format_guide_yaml.md` | YAML templates, validation, best practices for config-style prompts |
| sk-doc | `.opencode/skill/sk-doc/` | Documentation quality enforcement (use when output needs doc structure) |

<!-- /ANCHOR:related-documents -->
