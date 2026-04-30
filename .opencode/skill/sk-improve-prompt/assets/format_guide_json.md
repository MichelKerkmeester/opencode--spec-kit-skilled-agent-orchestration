---
title: Format Guide -- JSON
description: >
  Deep-dive formatting guide for JSON output in prompt engineering.
  Covers fundamentals, data types, delivery standards, RCAF/CRAFT structures,
  advanced patterns, syntax validation, and best practices for JSON prompt output.
---

# Format Guide -- JSON

Complete formatting specification for delivering enhanced prompts in JSON format, optimized for API integration and programmatic consumption.

---

## 1. OVERVIEW

### Purpose

Defines the JSON formatting rules, structures, and best practices for delivering enhanced prompts. JSON output is optimized for machine readability, API integration, and structured data processing.

### Usage

- Delivering enhanced prompts in JSON format (`$json` mode)
- Applying RCAF or CRAFT framework structures to JSON output
- Validating JSON-specific syntax and delivery requirements
- Building API-ready prompt structures
- Creating downloadable `.json` prompt files with proper headers

---

## 2. FUNDAMENTALS

### Core Principles

1. **Structure Over Prose:** Fields replace sentences.
2. **Explicit Types:** Clear data type definitions.
3. **Hierarchical Organization:** Nested structures for complexity.
4. **Schema Consistency:** Predictable field patterns.
5. **Minimal Redundancy:** No repeated information.

### Basic Structure

```json
{
  "instruction": "Primary directive",
  "context": "Essential information",
  "parameters": {
    "key1": "value1",
    "key2": "value2"
  },
  "output": {
    "format": "desired structure",
    "constraints": ["constraint1", "constraint2"]
  }
}
```

### Data Types

| Type        | Use Case         | Example                        |
| ----------- | ---------------- | ------------------------------ |
| **String**  | Text values      | `"role": "Data Analyst"`       |
| **Number**  | Quantities       | `"limit": 100`                 |
| **Boolean** | Flags            | `"detailed": true`             |
| **Array**   | Lists            | `"skills": ["Python", "SQL"]`  |
| **Object**  | Nested structure | `"format": {"type": "report"}` |

---

## 3. DELIVERY STANDARDS

### Mandatory Header Format

Single line at the TOP of every JSON prompt file:

```
Mode: $json | Complexity: [level] | Framework: [RCAF/CRAFT]
```

### File Content Rules

| Allowed                            | Forbidden                             |
| ---------------------------------- | ------------------------------------- |
| Single-line header (with $ prefix) | Format Options section                |
| JSON prompt content                | CLEAR Evaluation breakdown            |
|                                    | Processing Applied section            |
|                                    | Explanations (go in CHAT)             |
|                                    | Markdown formatting                   |
|                                    | Comments (JSON does not support them) |
|                                    | Inline/chat delivery                  |

### Format Lock Protocol

```
DETECTION: $json command identified
    |
LOCK: JSON-only output mode, .json file type
    |
GENERATE: Pure JSON structure
    |
VALIDATE: Is it valid JSON?
    |
If NO -> STOP -> REGENERATE
If YES -> DELIVER as file
```

### Correct vs Incorrect

| Status  | Example                                        | Problem                  |
| ------- | ---------------------------------------------- | ------------------------ |
| CORRECT | `{ "role": "Data analyst", "context": "..." }` | Pure JSON in file        |
| WRONG   | `**Role:** Data analyst`                        | Markdown, not JSON       |
| WRONG   | `Here's the JSON:` followed by code block      | Explanatory text in file |
| WRONG   | Inline code in chat                             | Not delivered as file    |

---

## 4. RCAF JSON STRUCTURE

### Template

```json
{
  "role": "Specific expertise definition",
  "context": "Essential background information",
  "action": "Clear measurable task",
  "format": {
    "structure": "output type",
    "requirements": ["req1", "req2"],
    "constraints": ["limit1", "limit2"]
  }
}
```

### Example -- Analysis Task

```
Mode: $json | Complexity: Medium | Framework: RCAF

{
  "role": "Financial analyst specializing in SaaS metrics",
  "context": "Q4 2024 revenue data from B2B platform with 10K customers",
  "action": "Calculate MRR growth and identify top 3 trends",
  "format": {
    "structure": "executive_summary",
    "length": "500_words",
    "include": ["metrics", "charts", "recommendations"]
  }
}
```

---

## 5. CRAFT JSON STRUCTURE

### Template

```json
{
  "context": {
    "background": "Full situation details",
    "constraints": ["constraint1", "constraint2"]
  },
  "role": {
    "expertise": "Detailed expertise",
    "perspective": "Specific viewpoint"
  },
  "action": {
    "primary": "Main task",
    "subtasks": ["task1", "task2"],
    "deliverables": ["deliverable1"]
  },
  "format": {
    "structure": "Output organization",
    "specifications": {
      "length": "word_count",
      "style": "tone"
    }
  },
  "target": {
    "metrics": ["metric1", "metric2"],
    "success_criteria": "Definition of success"
  }
}
```

### Example -- Complex Analysis

```
Mode: $json | Complexity: High | Framework: CRAFT

{
  "context": {
    "background": "E-commerce platform experiencing 15% cart abandonment",
    "timeframe": "Last 6 months",
    "data_available": ["user_sessions", "transaction_logs", "surveys"],
    "constraints": ["GDPR compliance", "30-day deadline"]
  },
  "role": {
    "expertise": "UX researcher with e-commerce specialization",
    "perspective": "User-centric analysis"
  },
  "action": {
    "primary": "Identify cart abandonment root causes",
    "subtasks": [
      "Analyze user behavior patterns",
      "Segment users by abandonment stage",
      "Correlate with survey responses"
    ]
  },
  "format": {
    "structure": "research_report",
    "specifications": {
      "length": "2500_words",
      "visualizations": ["flow_diagrams", "heat_maps"],
      "sections": ["executive_summary", "methodology", "findings", "recommendations"]
    }
  },
  "target": {
    "metrics": ["abandonment_rate_reduction", "conversion_improvement"],
    "success_criteria": "Actionable insights reducing abandonment by 20%"
  }
}
```

---

## 6. ADVANCED PATTERNS

### Multi-Step Process

```json
{
  "role": "Project coordinator",
  "context": "Software deployment for enterprise client",
  "action": {
    "phase_1": {
      "task": "Environment preparation",
      "outputs": ["checklist", "validation_report"]
    },
    "phase_2": {
      "task": "Deployment execution",
      "outputs": ["deployment_log", "test_results"]
    },
    "phase_3": {
      "task": "Post-deployment validation",
      "outputs": ["performance_metrics", "user_feedback"]
    }
  },
  "format": {
    "per_phase": "status_report",
    "final": "comprehensive_summary"
  }
}
```

### Conditional Logic

```json
{
  "role": "Customer service AI",
  "context": "Support ticket classification system",
  "action": "Route tickets based on criteria",
  "logic": {
    "if_technical": { "route_to": "engineering", "priority": "assess_severity" },
    "if_billing": { "route_to": "finance", "priority": "high" },
    "if_general": { "route_to": "support_tier_1", "priority": "standard" }
  },
  "format": {
    "response": "routing_decision",
    "include": ["department", "priority", "rationale"]
  }
}
```

### Parameterized Template

```json
{
  "template": "data_analysis",
  "parameters": {
    "dataset": "${DATASET_NAME}",
    "metrics": "${METRICS_ARRAY}",
    "timeframe": "${TIME_PERIOD}"
  },
  "role": "Data analyst",
  "context": "Business intelligence reporting",
  "action": "Generate insights from ${DATASET_NAME}",
  "format": {
    "structure": "dashboard",
    "charts": ["${CHART_TYPES}"]
  }
}
```

---

## 7. SYNTAX VALIDATION

### Validation Checklist

| Check                         | Required | Action if Failed        |
| ----------------------------- | -------- | ----------------------- |
| Valid JSON syntax (parseable) | Yes      | Regenerate              |
| No markdown formatting        | Yes      | Remove bold/header/code |
| All RCAF/CRAFT fields present | Yes      | Add missing fields      |
| Header has `$json` mode       | Yes      | Add header              |
| Consistent data types         | Yes      | Fix types               |
| No trailing commas            | Yes      | Remove commas           |
| Double quotes only            | Yes      | Replace single quotes   |

### Common Issues and Fixes

| Issue                | Recognition              | Solution                     |
| -------------------- | ------------------------ | ---------------------------- |
| **Invalid JSON**     | Parse errors             | Validate with JSON linter    |
| **Format violation** | Markdown instead of JSON | Regenerate as pure JSON      |
| **Trailing commas**  | Extra comma at end       | Remove trailing commas       |
| **Unquoted keys**    | Parse failure            | Wrap all keys in quotes      |
| **Single quotes**    | Parse failure            | Use double quotes only       |
| **Comments**         | Parse failure            | Remove (JSON has no support) |
| **Missing braces**   | Incomplete structure     | Add closing brackets         |

---

## 8. BEST PRACTICES

### Do / Do Not

| Category       | Do                                 | Do Not                        |
| -------------- | ---------------------------------- | ----------------------------- |
| **Quotes**     | Use double quotes for keys/strings | Use single quotes             |
| **Validation** | Validate JSON before delivery      | Skip validation               |
| **Nesting**    | Keep shallow (< 4 levels)          | Over-nest structures          |
| **Naming**     | Use consistent field naming        | Mix naming conventions        |
| **Data Types** | Use appropriate types              | Mix types inconsistently      |
| **Header**     | Include `$json` mode               | Add verbose sections          |
| **Content**    | Only header + JSON                 | Include markdown/explanations |
| **Syntax**     | Escape special characters          | Use trailing commas           |
| **Comments**   | Remove all comments                | Include comments (invalid)    |

### Nesting Depth by Complexity

| Complexity     | Framework | JSON Structure      | Nesting Depth |
| -------------- | --------- | ------------------- | ------------- |
| Simple (1-3)   | RCAF      | Flat structure      | 1-2 levels    |
| Medium (4-6)   | RCAF      | Nested format field | 2-3 levels    |
| Complex (7-10) | CRAFT     | Multi-level nesting | 3-4 levels    |

### Token Optimization

```json
// Less efficient (verbose keys)
{ "artificial_intelligence_model_role": "expert" }

// More efficient (concise keys)
{ "role": "expert" }
```

---

## 9. FORMAT SELECTION

### When to Use JSON

| Use JSON When              | Use Markdown When          | Use YAML When           |
| -------------------------- | -------------------------- | ----------------------- |
| API integration needed     | Human readability priority | Configuration templates |
| Structured data processing | Natural conversation flow  | Human editing needed    |
| Programmatic generation    | Creative/open-ended tasks  | Complex hierarchies     |
| Schema validation required | Flexibility needed         | Comments helpful        |
| Batch processing           | Single prompt usage        | Multi-line text common  |

### Philosophy

> "Structure enables consistency. Consistency enables automation. Automation enables scale."

Core principles:
1. Clarity through structure -- Clear field separation
2. Precision through types -- Explicit data types
3. Reusability through templates -- Parameterized patterns
4. Integration through standards -- API compatibility
5. Quality through validation -- Syntax enforcement

