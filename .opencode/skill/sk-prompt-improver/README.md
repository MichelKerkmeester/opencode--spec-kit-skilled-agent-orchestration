---
title: "Prompt Engineering Specialist"
description: "Multi-framework prompt enhancement skill that transforms vague requests into structured, scored AI prompts using DEPTH processing, CLEAR scoring and 7 proven frameworks"
trigger_phrases:
  - "prompt engineering enhancement"
  - "improve my prompt CLEAR score"
  - "DEPTH processing framework"
  - "prompt framework selection"
  - "RCAF CRAFT prompt structure"
---

# Prompt Engineering Specialist

> Transforms vague requests into structured, scored AI prompts using 7 frameworks, DEPTH thinking methodology and CLEAR quality scoring.

---

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [Prompt Engineering Specialist](#prompt-engineering-specialist)
  - [TABLE OF CONTENTS](#table-of-contents)
  - [1. OVERVIEW](#1-overview)
    - [Key Statistics](#key-statistics)
    - [Key Features](#key-features)
    - [Requirements](#requirements)
  - [2. QUICK START](#2-quick-start)
  - [3. STRUCTURE](#3-structure)
    - [Key Files](#key-files)
  - [4. FEATURES](#4-features)
  - [5. CONFIGURATION](#5-configuration)
  - [6. EXAMPLES](#6-examples)
    - [Example 1: Basic Prompt Improvement](#example-1-basic-prompt-improvement)
    - [Example 2: JSON Format Output](#example-2-json-format-output)
    - [Example 3: Quick Refinement](#example-3-quick-refinement)
    - [Common Patterns](#common-patterns)
  - [7. TROUBLESHOOTING](#7-troubleshooting)
  - [8. RELATED](#8-related)
<!-- /ANCHOR:table-of-contents -->

---

## 1. OVERVIEW
<!-- ANCHOR:overview -->

This skill takes vague or incomplete prompts and produces structured, high-quality output through a four-phase pipeline: **Mode Detection** (command prefix or keyword analysis), **Framework Selection** (scoring 7 frameworks against task characteristics), **DEPTH Processing** (3-10 rounds of iterative refinement) and **CLEAR Scoring** (50-point quality validation).

The core approach is prompt-first: every enhancement starts with understanding what the user needs, selects the right structural framework, then applies iterative thinking rounds to produce a prompt that scores above threshold.

Use this skill when enhancing AI prompts, evaluating prompt quality, selecting the right framework for a task or converting prompts between formats. If the request is for code implementation, route to `sk-code` skills instead. If the request is for documentation, route to `sk-doc`. Simple text editing without prompt structure needs also falls outside scope.

### Key Statistics

| Category           | Count | Details                                                    |
| ------------------ | ----- | ---------------------------------------------------------- |
| Frameworks         | 7     | RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE, CRAFT           |
| Operating Modes    | 8     | Interactive, Text, Short, Improve, Refine, JSON, YAML, Raw |
| Scoring Dimensions | 5     | Correctness, Logic, Expression, Arrangement, Reusability   |
| Output Formats     | 3     | Markdown (default), JSON, YAML                             |
| DEPTH Phases       | 5     | Discover, Engineer, Prototype, Test, Harmonize             |

### Key Features

| Feature                      | Description                                                                  |
| ---------------------------- | ---------------------------------------------------------------------------- |
| **Framework Auto-Selection** | Scores task characteristics against 7 frameworks to find the best fit        |
| **DEPTH Processing**         | 5-phase iterative refinement with 3-10 rounds based on mode                  |
| **CLEAR Scoring**            | 50-point quality scale with a 40+ threshold for delivery                     |
| **Multi-Format Output**      | Delivers prompts in Markdown, JSON or YAML with format-specific validation   |
| **RICCE Validation**         | Checks Role, Instructions, Context, Constraints and Examples before delivery |

### Requirements

| Requirement           | Details                                                         |
| --------------------- | --------------------------------------------------------------- |
| Skill files           | `SKILL.md`, `references/` present in skill directory            |
| External dependencies | None                                                            |

<!-- /ANCHOR:overview -->

---

## 2. QUICK START
<!-- ANCHOR:quick-start -->

The skill is invoked automatically via Gate 2 routing when prompt engineering tasks are detected, or manually via the `skill` tool:

```
skill("sk-prompt-improver")
```

**Common commands:**

```bash
# Standard prompt improvement (10 DEPTH rounds)
$improve [your prompt here]

# Quick refinement (3 DEPTH rounds)
$short [your prompt here]

# JSON format output
$json [your prompt here]

# YAML format output
$yaml [your prompt here]

# Maximum optimization
$refine [your prompt here]

# Skip DEPTH processing entirely
$raw [your prompt here]
```

The skill asks one comprehensive question before processing (except in `$raw` mode), then delivers the enhanced prompt with a transparency report showing the framework selected, rounds applied and score breakdown.

<!-- /ANCHOR:quick-start -->

---

## 3. STRUCTURE
<!-- ANCHOR:structure -->

```
sk-prompt-improver/
├── SKILL.md                          # Entry point with routing logic
├── README.md                         # This file
├── assets/
│   ├── format_guide_markdown.md      # Markdown format deep-dive
│   ├── format_guide_json.md          # JSON format deep-dive
│   └── format_guide_yaml.md          # YAML format deep-dive
└── references/
    ├── depth_framework.md            # DEPTH methodology, RICCE integration
    └── patterns_evaluation.md        # 7 framework definitions, CLEAR scoring
```

### Key Files

| File                                | Purpose                                                                                   |
| ----------------------------------- | ----------------------------------------------------------------------------------------- |
| `SKILL.md`                          | AI entry point with mode detection, smart routing and processing pipeline                 |
| `references/depth_framework.md`     | DEPTH methodology (Discover, Engineer, Prototype, Test, Harmonize) with RICCE integration |
| `references/patterns_evaluation.md` | Framework definitions, selection matrix and CLEAR scoring criteria                        |
| `assets/format_guide_*.md`          | Individual format-specific deep-dives for targeted loading                                |

<!-- /ANCHOR:structure -->

---

## 4. FEATURES
<!-- ANCHOR:features -->

**Framework Selection:**
- Evaluates 7 frameworks against task complexity, audience, urgency, creativity and precision
- Auto-selects the best match with a secondary recommendation
- Covers the full complexity range from simple (RACE at 1-3) to comprehensive (CRAFT at 7-10)

| Complexity | Primary Need  | Framework | Success Rate |
| ---------- | ------------- | --------- | ------------ |
| 1-3        | Speed         | RACE      | 88%          |
| 1-4        | Clarity       | RCAF      | 92%          |
| 3-6        | Audience      | COSTAR    | 94%          |
| 4-6        | Instructions  | CIDI      | 90%          |
| 5-7        | Creativity    | CRISPE    | 87%          |
| 6-8        | Precision     | TIDD-EC   | 93%          |
| 7-10       | Comprehensive | CRAFT     | 91%          |

**DEPTH Processing:**
- 5-phase iterative thinking methodology applied to every enhancement
- Discover: 5 perspectives, assumption audit, RICCE Role and Context
- Engineer: Framework application, constraint mapping
- Prototype: Template build, RICCE validation
- Test: CLEAR scoring, quality gates
- Harmonize: Final polish, completeness check

**CLEAR Scoring:**
- 50-point scale across 5 dimensions with a minimum threshold of 40
- Correctness (10), Logic (10), Expression (15), Arrangement (10), Reusability (5)
- Applied to every output except `$raw` mode

<!-- /ANCHOR:features -->

---

## 5. CONFIGURATION
<!-- ANCHOR:configuration -->

No configuration required. The skill auto-detects the operating mode from command prefix or keyword analysis:

| Command    | Mode        | DEPTH Rounds | Use Case                          |
| ---------- | ----------- | ------------ | --------------------------------- |
| (default)  | Interactive | 10           | Guided enhancement with questions |
| `$text`    | Text        | 10           | Standard text prompt              |
| `$short`   | Short       | 3            | Quick refinement                  |
| `$improve` | Improve     | 10           | Standard enhancement              |
| `$refine`  | Refine      | 10           | Maximum optimization              |
| `$json`    | JSON        | 10           | API-ready format                  |
| `$yaml`    | YAML        | 10           | Configuration format              |
| `$raw`     | Raw         | 0            | Skip DEPTH entirely               |

Resource loading is managed by the smart router in `SKILL.md` Section 2. References load conditionally based on detected intent to avoid unnecessary context consumption.

<!-- /ANCHOR:configuration -->

---

## 6. EXAMPLES
<!-- ANCHOR:usage-examples -->

### Example 1: Basic Prompt Improvement

```
$improve Write a marketing email for our new product launch
```

The skill asks one clarifying question, then applies RCAF framework with 10 DEPTH rounds. Output includes the enhanced prompt with a transparency report.

**Result**: Structured prompt with Role, Context, Action and Format fields. CLEAR score of 42+/50.

### Example 2: JSON Format Output

```
$json Create an API endpoint specification for user authentication
```

Produces a pure JSON structure with proper field types, nested objects and RCAF/CRAFT framework mapping. Delivered as a `.json` file with validation.

**Result**: Valid JSON with framework fields, consistent types and no trailing commas.

### Example 3: Quick Refinement

```
$short Analyze customer churn data
```

Runs 3 DEPTH rounds instead of 10 for faster turnaround. Uses RCAF framework for straightforward tasks.

**Result**: Concise structured prompt in under 30 seconds.

### Common Patterns

| Pattern              | Command             | When to Use                        |
| -------------------- | ------------------- | ---------------------------------- |
| Standard enhancement | `$improve [prompt]` | General prompt improvement         |
| Maximum quality      | `$refine [prompt]`  | Critical or high-stakes prompts    |
| Fast iteration       | `$short [prompt]`   | Quick improvements, time-sensitive |
| API integration      | `$json [prompt]`    | Machine-readable output needed     |
| Config templates     | `$yaml [prompt]`    | Configuration-style prompts        |
| Raw pass-through     | `$raw [prompt]`     | Skip processing, direct output     |

<!-- /ANCHOR:usage-examples -->

---

## 7. TROUBLESHOOTING
<!-- ANCHOR:troubleshooting -->

| Issue                               | Cause                                         | Fix                                                                                                |
| ----------------------------------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| CLEAR score below 40                | Vague input or mismatched framework           | Provide more context in the original prompt, or ask the skill to try a different framework         |
| Wrong framework selected            | Ambiguous task complexity                     | Specify complexity explicitly (e.g., "This is a complex multi-stakeholder task")                   |
| JSON output has markdown formatting | Format lock failed to engage                  | Prefix the request with `$json` to force JSON-only mode                                            |
| Mode detection picks wrong mode     | Keywords overlap between modes                | Use explicit command prefix (`$improve`, `$json`, `$yaml`) instead of relying on keyword detection |
| DEPTH rounds feel excessive         | Task is simple but mode defaults to 10 rounds | Use `$short` (3 rounds) or `$raw` (0 rounds) for simpler tasks                                     |

<!-- /ANCHOR:troubleshooting -->

---

## 8. RELATED
<!-- ANCHOR:related -->

- **sk-doc** - Documentation quality enforcement and component creation workflows
- **sk-code--web** - Web development implementation lifecycle (pairs with prompts for web contexts)
- [SKILL.md](./SKILL.md) - AI entry point with full routing logic and processing pipeline
- [depth_framework.md](./references/depth_framework.md) - DEPTH methodology reference
- [patterns_evaluation.md](./references/patterns_evaluation.md) - Framework library and CLEAR scoring


<!-- /ANCHOR:related -->
