---
title: Format Guides -- Markdown, JSON, and YAML
description: >
  Consolidated formatting guide for all three output formats used in prompt
  engineering. Covers format fundamentals, file delivery standards,
  RCAF/CRAFT framework structures, advanced patterns, format conversions,
  syntax validation, and best practices for Markdown (Standard), JSON, and
  YAML output.
---

# Format Guides -- Markdown, JSON, and YAML

Consolidated formatting guide covering all three output formats for prompt delivery: Markdown, JSON, and YAML.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Core Principle

Choose the format that matches your audience: Markdown for humans, JSON for machines, YAML for configuration.

### When to Use

- Delivering enhanced prompts in a specific output format
- Converting prompts between Markdown, JSON, and YAML formats
- Applying RCAF or CRAFT framework structures to formatted output
- Validating format-specific syntax requirements
- Optimizing token efficiency across formats
- Creating downloadable prompt files with proper headers

### Format Comparison

| Aspect             | Markdown (Standard) | JSON              | YAML                     |
| ------------------ | ------------------- | ----------------- | ------------------------ |
| **Readability**    | Natural language    | Structured data   | Human-friendly structure |
| **Token Usage**    | Baseline (100%)     | +5-10%            | +3-7%                    |
| **Best For**       | Human interaction   | API integration   | Configuration, templates |
| **Framework Fit**  | RCAF/CRAFT equal    | RCAF preferred    | RCAF optimal             |
| **Learning Curve** | None                | Medium            | Low                      |

**Terminology:**
- **Framework** = Prompt organization method (RCAF vs CRAFT)
- **Format** = Data structure (Markdown vs JSON vs YAML)

### Format Selection Guide

| Factor               | Choose Markdown  | Choose JSON          | Choose YAML          |
| -------------------- | ---------------- | -------------------- | -------------------- |
| **Audience**         | Humans           | Machines/APIs        | Configuration needs  |
| **Complexity**       | Any level        | Structured only      | Hierarchical         |
| **Flexibility**      | High             | Low                  | Medium               |
| **Readability**      | Excellent        | Fair                 | Good                 |
| **Token Efficiency** | Best             | Lower                | Medium               |
| **Validation**       | Visual           | Schema-based         | Indentation-based    |
| **Comments**         | N/A              | Not supported        | Supported            |

### CLEAR Score Impact by Format

| Format       | Avg CLEAR | Strengths                       | Weaknesses            |
| ------------ | --------- | ------------------------------- | --------------------- |
| **Markdown** | 43/50     | Expression (9/10), Natural flow | Structure consistency |
| **JSON**     | 41/50     | Arrangement (9/10), Precision   | Expression (7/10)     |
| **YAML**     | 42/50     | Balance (8/10 avg)              | Learning curve        |

### Framework vs Complexity

| Complexity     | Framework | Structure Depth |
| -------------- | --------- | --------------- |
| Simple (1-3)   | RCAF      | Flat, 4 fields  |
| Medium (4-6)   | RCAF      | Nested format   |
| Complex (7-10) | CRAFT     | Multi-level     |

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:markdown-format -->
## 2. Markdown Format

### Core Principles

1. **Clarity First:** Every word must earn its place.
2. **Natural Flow:** Conversational structure.
3. **Semantic Headers:** Clear section delineation.
4. **Concise Expression:** Maximum clarity, minimum tokens.
5. **Action-Oriented:** Focus on what needs to be done.

### Basic Structure

```markdown
**Role:** [Specific expertise needed]
**Context:** [Essential background information]
**Action:** [Clear, measurable task]
**Format:** [Expected output structure]
```

### Elements for Prompts

| Element            | Use Case              | Example                  |
| ------------------ | --------------------- | ------------------------ |
| **Bold Headers**   | Section markers       | `**Role:** Data Analyst` |
| **Bullet Lists**   | Multiple requirements | `- Requirement 1`        |
| **Numbered Lists** | Sequential steps      | `1. First step`          |
| **Inline Code**    | Technical terms       | `` `API endpoint` ``     |
| **Block Quotes**   | Context emphasis      | `> Important note`       |

### File Delivery Standards

**Delivery Methods:**
- Create an actual downloadable file (.md) using the file creation tool.
- In CLI/Agent Mode: save to `/Export` folder with format `[###] - descriptive-filename.md`.

**Mandatory Header Format (single line at TOP of every file):**
```
Mode: $[mode] | Complexity: [level] | Framework: [RCAF/CRAFT]
```

Header Requirements:
- Mode with $ prefix: $improve, $refine, $quick, etc.
- Complexity level: Low/Medium/High or 1-10
- Framework used: RCAF or CRAFT

**File Content Rules:**

| Allowed                            | Forbidden                  |
| ---------------------------------- | -------------------------- |
| Single-line header (with $ prefix) | CLEAR Evaluation breakdown |
| Enhanced prompt content            | Processing Applied section |
|                                    | Format Options section     |
|                                    | Explanations (go in CHAT)  |

**Correct Example:**
```
Mode: $improve | Complexity: Medium | Framework: RCAF

**Role:** Data analyst with expertise in SaaS metrics.
**Context:** Q4 revenue data from B2B platform with 10K customers.
**Action:** Calculate MRR growth and identify top 3 revenue trends.
**Format:** Executive summary (500 words) with metrics, charts, and recommendations.
```

**Incorrect Example (metadata in file):**
```
Mode: $improve | Complexity: Medium | Framework: RCAF

**Role:** Data analyst

**CLEAR Evaluation:**
- Correctness: 8/10
...

**Processing Applied:**
DEPTH rounds completed
```

### RCAF Markdown Structure

```markdown
**Role:** [Specific expertise definition]
**Context:** [Essential background information]
**Action:** [Clear measurable task]
**Format:** [Expected output requirements]
```

**Example -- Analysis Task:**
```
Mode: $improve | Complexity: Medium | Framework: RCAF

**Role:** Financial analyst specializing in SaaS metrics and growth analysis.
**Context:** Q4 2024 revenue data from B2B platform with 10,000 customers, focusing on subscription trends.
**Action:** Calculate MRR growth rate, identify top 3 revenue trends, and provide actionable insights.
**Format:** Executive summary (500 words) with key metrics, trend charts, and 3-5 strategic recommendations.
```

### CRAFT Markdown Structure

```markdown
**Context:** [Comprehensive background and constraints]
**Role:** [Detailed expertise and perspective]
**Action:** [Primary task with subtasks and deliverables]
**Format:** [Detailed output specifications]
**Target:** [Success metrics and criteria]
```

**Example -- Complex Analysis:**
```
Mode: $refine | Complexity: High | Framework: CRAFT

**Context:** E-commerce platform experiencing 15% cart abandonment rate over the last 6 months. Available data includes user session logs, transaction records, and customer surveys. Must comply with GDPR and deliver within 30 days.

**Role:** UX researcher with e-commerce specialization, applying user-centric analysis methodology using behavioral analytics and qualitative research techniques.

**Action:** Identify root causes of cart abandonment through multi-method analysis:
- Analyze user behavior patterns across abandonment stages
- Segment users by abandonment point and demographics
- Correlate quantitative findings with survey responses
- Generate prioritized recommendations

**Format:** Research report (2500 words) structured as:
- Executive summary with key findings
- Methodology overview
- Detailed findings with visualizations
- Actionable recommendations ranked by impact/effort

**Target:** Deliver insights that enable 20% reduction in abandonment rate within Q1 2025.
```

### CRAFT vs RCAF

| Use CRAFT When                      | Use RCAF When         |
| ----------------------------------- | --------------------- |
| Multiple success metrics needed     | Single clear outcome  |
| Complex multi-stakeholder scenarios | Straightforward task  |
| Detailed specifications required    | Flexibility preferred |
| Comprehensive documentation needed  | Quick clarity needed  |

### Advanced Markdown Patterns

**Multi-Step Process:**
```
Mode: $improve | Complexity: High | Framework: RCAF

**Role:** Project coordinator with software deployment expertise.

**Context:** Enterprise client deployment for cloud-based CRM system, 500+ users, requiring zero downtime migration.

**Action:** Execute three-phase deployment:
- **Phase 1:** Validate infrastructure, configure staging, create rollback procedures
- **Phase 2:** Migrate data, deploy components, run integration tests
- **Phase 3:** Monitor performance, gather feedback, address issues

**Format:** Status report per phase with traffic light indicators, plus comprehensive summary.
```

**Conditional Logic:**
```markdown
**Role:** Customer service specialist with technical troubleshooting skills.
**Context:** First-line support for software platform.

**Action:** Classify and route support tickets:
- Technical issue (error, bug, crash) -> Engineering, assess severity
- Billing/payment related -> Finance, high priority
- General inquiry -> Support Tier 1, standard queue

**Format:** Routing decision with department, priority, and brief rationale (50 words max).
```

### Markdown Syntax Validation

| Check                            | Required | Action if Failed    |
| -------------------------------- | -------- | ------------------- |
| File is downloadable (.md)       | Yes      | Create file         |
| Single-line header with $ prefix | Yes      | Add header          |
| All framework fields present     | Yes      | Add missing fields  |
| No forbidden sections            | Yes      | Remove/move to chat |
| Valid markdown formatting        | Yes      | Fix syntax          |
| Natural readability              | Yes      | Simplify language   |

**Framework Validation:**

RCAF Requirements:
- Role: Present, specific, domain-defined
- Context: Present, sufficient detail
- Action: Present, measurable
- Format: Present, clearly defined

CRAFT Additional:
- Target: Present, audience clear

### Markdown Best Practices

| Category      | Do                                 | Do Not                            |
| ------------- | ---------------------------------- | --------------------------------- |
| **Headers**   | Use bold for fields (`**Field:**`) | Over-format with complex markdown |
| **Structure** | Keep paragraphs concise            | Skip framework fields             |
| **Lists**     | Use for multiple items             | Nest lists excessively            |
| **Content**   | Include specific examples          | Use ambiguous language            |
| **Outcomes**  | Define measurable actions          | Create unmeasurable actions       |
| **Delivery**  | Create downloadable file           | Deliver in chat                   |
| **Header**    | Use $ prefix in mode               | Add quality scores to header      |
| **File**      | Only header + prompt content       | Include CLEAR evaluation          |

**Token Efficiency:**
```markdown
# Less efficient (verbose)
**Role:** You are a professional data analyst who specializes in...

# More efficient (concise)
**Role:** Data analyst specializing in...

# Specific terms over vague
**Context:** Dataset with 50K records (not "large dataset with lots of data")
```

**Markdown Philosophy:**
> "Natural language is the universal interface. Markdown provides structure without sacrificing humanity."

Core Principles:
1. Clarity through simplicity -- Direct communication
2. Structure through convention -- Consistent patterns
3. Flexibility through natural language -- Adaptable expression
4. Efficiency through minimalism -- No wasted tokens
5. Focus through minimalism -- Minimal header only

> **Deep-dive:** See [format_guide_markdown.md](../assets/format_guide_markdown.md) for the full Markdown format specification.

---

<!-- /ANCHOR:markdown-format -->
<!-- ANCHOR:json-format -->
## 3. JSON Format

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

### File Delivery Standards

**Core Rule:** Every enhancement MUST be delivered as a downloadable file (.json), NEVER inline or in chat.

**Delivery Methods:**
- Create an actual downloadable file using the file creation tool.
- In CLI/Agent Mode: use `/Export` folder with format `[###] - descriptive-filename.json`.

**Mandatory Header Format (single line at TOP of every JSON file):**
```
Mode: $json | Complexity: [level] | Framework: [RCAF/CRAFT]
```

**File Content Rules:**

| Allowed                            | Forbidden                               |
| ---------------------------------- | --------------------------------------- |
| Single-line header (with $ prefix) | Format Options section                  |
| JSON prompt content                | CLEAR Evaluation breakdown              |
|                                    | Processing Applied section              |
|                                    | Explanations (go in CHAT)               |
|                                    | Markdown formatting                     |
|                                    | Comments (JSON does not support them)   |
|                                    | Inline/chat delivery                    |

**Format Lock Protocol:**
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

**Correct vs Incorrect:**

| Status      | Example                                        | Problem                  |
| ----------- | ---------------------------------------------- | ------------------------ |
| CORRECT     | `{ "role": "Data analyst", "context": "..." }` | Pure JSON in file        |
| WRONG       | `**Role:** Data analyst`                       | Markdown, not JSON       |
| WRONG       | `Here's the JSON:` followed by code block      | Explanatory text in file |
| WRONG       | Inline code in chat                            | Not delivered as file    |

### RCAF JSON Structure

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

**Example -- Analysis Task:**
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

### CRAFT JSON Structure

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

**Example -- Complex Analysis:**
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

### Advanced JSON Patterns

**Multi-Step Process:**
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

**Conditional Logic:**
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

**Parameterized Template:**
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

### JSON Syntax Validation

| Check                         | Required | Action if Failed         |
| ----------------------------- | -------- | ------------------------ |
| Valid JSON syntax (parseable) | Yes      | Regenerate               |
| No markdown formatting        | Yes      | Remove bold/header/code  |
| All RCAF/CRAFT fields present | Yes      | Add missing fields       |
| Header has `$json` mode       | Yes      | Add header               |
| Delivered as file             | Yes      | Create file              |
| Consistent data types         | Yes      | Fix types                |
| No trailing commas            | Yes      | Remove commas            |
| Double quotes only            | Yes      | Replace single quotes    |

**Common Issues and Fixes:**

| Issue                | Recognition              | Solution                       |
| -------------------- | ------------------------ | ------------------------------ |
| **Invalid JSON**     | Parse errors             | Validate with JSON linter      |
| **Format violation** | Markdown instead of JSON | Regenerate as pure JSON        |
| **Trailing commas**  | Extra comma at end       | Remove trailing commas         |
| **Unquoted keys**    | Parse failure            | Wrap all keys in quotes        |
| **Single quotes**    | Parse failure            | Use double quotes only         |
| **Comments**         | Parse failure            | Remove (JSON does not support) |
| **Missing braces**   | Incomplete structure     | Add closing brackets           |

### JSON Best Practices

| Category       | Do                                 | Do Not                        |
| -------------- | ---------------------------------- | ----------------------------- |
| **Quotes**     | Use double quotes for keys/strings | Use single quotes             |
| **Validation** | Validate JSON before delivery      | Skip validation               |
| **Nesting**    | Keep shallow (< 4 levels)          | Over-nest structures          |
| **Naming**     | Use consistent field naming        | Mix naming conventions        |
| **Data Types** | Use appropriate types              | Mix types inconsistently      |
| **Delivery**   | Create downloadable file           | Deliver in chat               |
| **Header**     | Include `$json` mode               | Add verbose sections          |
| **Content**    | Only header + JSON                 | Include markdown/explanations |
| **Syntax**     | Escape special characters          | Use trailing commas           |
| **Comments**   | Remove all comments                | Include comments (invalid)    |

**Nesting Depth by Complexity:**

| Complexity     | Framework | JSON Structure      | Nesting Depth |
| -------------- | --------- | ------------------- | ------------- |
| Simple (1-3)   | RCAF      | Flat structure      | 1-2 levels    |
| Medium (4-6)   | RCAF      | Nested format field | 2-3 levels    |
| Complex (7-10) | CRAFT     | Multi-level nesting | 3-4 levels    |

**When to Use JSON:**

| Use JSON When              | Use Markdown When          | Use YAML When           |
| -------------------------- | -------------------------- | ----------------------- |
| API integration needed     | Human readability priority | Configuration templates |
| Structured data processing | Natural conversation flow  | Human editing needed    |
| Programmatic generation    | Creative/open-ended tasks  | Complex hierarchies     |
| Schema validation required | Flexibility needed         | Comments helpful        |
| Batch processing           | Single prompt usage        | Multi-line text common  |

**Token Optimization:**
```json
// Less efficient (verbose keys)
{ "artificial_intelligence_model_role": "expert" }

// More efficient (concise keys)
{ "role": "expert" }
```

**JSON Philosophy:**
> "Structure enables consistency. Consistency enables automation. Automation enables scale."

Core Principles:
1. Clarity through structure -- Clear field separation
2. Precision through types -- Explicit data types
3. Reusability through templates -- Parameterized patterns
4. Integration through standards -- API compatibility
5. Quality through validation -- Syntax enforcement

> **Deep-dive:** See [format_guide_json.md](../assets/format_guide_json.md) for the full JSON format specification.

---

<!-- /ANCHOR:json-format -->
<!-- ANCHOR:yaml-format -->
## 4. YAML Format

### Core Principles

1. **Indentation:** 2 spaces define hierarchy.
2. **No Quotes:** For simple strings.
3. **Lists:** Dash prefix for arrays.
4. **Key-Value:** Colon separation.
5. **Multi-line:** Literal (`|`) and folded (`>`) blocks.

### Basic Structure

```yaml
instruction: Primary directive for the task
context: Essential background information
parameters:
  key1: value1
  nested:
    subkey: subvalue
output:
  format: desired structure
  constraints:
    - constraint one
    - constraint two
```

### Data Types

| Type           | Syntax        | Example                                 |
| -------------- | ------------- | --------------------------------------- |
| **String**     | No quotes     | `role: Data Analyst`                    |
| **Number**     | Direct value  | `limit: 100`                            |
| **Boolean**    | true/false    | `detailed: true`                        |
| **List**       | Dash prefix   | `- Python`                              |
| **Object**     | Indented keys | `format:` / `  type: report`            |
| **Multi-line** | Pipe or >     | `description: \|` / `  Multiple lines`  |

### File Delivery Standards

**Core Rule:** Every enhancement MUST be delivered as a downloadable file (.yaml/.yml), NEVER inline or in chat.

**Delivery Methods:**
- Create an actual downloadable file using the file creation tool.
- In CLI/Agent Mode: use `/Export` folder with format `[###] - descriptive-filename.yaml`.

**Mandatory Header Format (single line at TOP of every YAML file):**
```
Mode: $yaml | Complexity: [level] | Framework: [RCAF/CRAFT]
```

**File Content Rules:**

| Allowed                            | Forbidden                          |
| ---------------------------------- | ---------------------------------- |
| Single-line header (with $ prefix) | Format Options section             |
| YAML prompt content                | CLEAR Evaluation breakdown         |
|                                    | Processing Applied section         |
|                                    | Explanations (go in CHAT)          |
|                                    | Markdown formatting                |
|                                    | Tab characters                     |
|                                    | Inconsistent indentation           |

**Format Lock Protocol:**
```
DETECTION: $yaml command identified
    |
LOCK: YAML-only output mode engaged
    |
GENERATE: Pure YAML structure
    |
VALIDATE: Is it valid YAML?
    |
If NO -> STOP -> REGENERATE
If YES -> DELIVER as file
```

**Correct Example:**
```
Mode: $yaml | Complexity: Medium | Framework: RCAF

role: Data analyst
context: Sales database analysis
action: Generate quarterly report
format:
  type: dashboard
  sections:
    - metrics
    - trends
```

**Incorrect Examples:**
```
# WRONG: Markdown in YAML
**Role:** Data analyst
**Context:** Sales database analysis

# WRONG: Explanatory text
Here's the YAML prompt:
role: Data analyst
```

### RCAF YAML Structure

```yaml
role: Specific expertise definition
context: Essential background information
action: Clear measurable task
format:
  structure: output type
  requirements:
    - requirement one
  constraints:
    - limit one
```

**Example -- Analysis Task:**
```
Mode: $yaml | Complexity: Medium | Framework: RCAF

role: Financial analyst specializing in SaaS metrics
context: Q4 2024 revenue data from B2B platform
action: Calculate MRR growth and identify top 3 trends
format:
  structure: executive_summary
  length: 500_words
  include:
    - metrics
    - charts
    - recommendations
```

### CRAFT YAML Structure

```yaml
context:
  background: Full situation details
  constraints:
    - constraint one
  assumptions:
    - assumption one
role:
  expertise: Detailed expertise description
  perspective: Specific viewpoint
action:
  primary: Main task to accomplish
  subtasks:
    - task one
  deliverables:
    - deliverable one
format:
  structure: Output organization type
  specifications:
    length: word_count
    style: tone_and_voice
target:
  metrics:
    - metric one
  success_criteria: Definition of successful outcome
```

**Example -- Complex Analysis:**
```
Mode: $yaml | Complexity: High | Framework: CRAFT

context:
  background: E-commerce platform experiencing 15% cart abandonment
  timeframe: Last 6 months
  data_available:
    - user_sessions
    - transaction_logs
    - surveys
  constraints:
    - GDPR compliance required
    - 30-day deadline
role:
  expertise: UX researcher with e-commerce specialization
  perspective: User-centric analysis approach
action:
  primary: Identify cart abandonment root causes
  subtasks:
    - Analyze user behavior patterns
    - Segment users by abandonment stage
    - Generate actionable recommendations
format:
  structure: research_report
  specifications:
    length: 2500_words
    visualizations:
      - flow_diagrams
      - heat_maps
target:
  metrics:
    - abandonment_rate_reduction
  success_criteria: Actionable insights reducing abandonment by 20%
```

### Advanced YAML Patterns

**Multi-Phase Process:**
```yaml
role: Project coordinator
context: Software deployment for enterprise client
phases:
  - name: Environment Preparation
    action: Setup and validate infrastructure
    outputs: [checklist, validation_report]
  - name: Deployment Execution
    action: Execute deployment procedures
    outputs: [deployment_log, test_results]
  - name: Post-Deployment
    action: Validate and monitor
    outputs: [performance_metrics, user_feedback]
format:
  per_phase: status_report
  final: comprehensive_summary
```

**Conditional Logic:**
```yaml
role: Customer service AI
context: Support ticket classification system
action: Route tickets based on criteria
routing_logic:
  technical:
    route_to: engineering
    conditions: [error, bug, crash]
  billing:
    route_to: finance
    priority: high
    conditions: [payment, invoice, subscription]
  general:
    route_to: support_tier_1
    default: true
format:
  response: routing_decision
  include: [department, priority, rationale]
```

**Template with Anchors (YAML-only feature):**
```yaml
defaults: &default_format
  style: professional
  tone: concise
  audience: technical

templates:
  analysis: &analysis_template
    structure: analytical_report
    <<: *default_format
    sections: [overview, methodology, findings, recommendations]

role: Data analyst
context: Customer behavior analysis needed
action: Analyze purchase patterns
format:
  <<: *analysis_template
  length: 2000_words
```

**Parameterized Research Template:**
```yaml
role: Research analyst
context: ${RESEARCH_DOMAIN}
action:
  primary: Investigate ${RESEARCH_QUESTION}
  methodology: ${METHOD}
  scope: ${SCOPE_DEFINITION}
format:
  structure: research_paper
  sections: [abstract, introduction, methodology, findings, conclusion]
  citations: ${CITATION_STYLE}
  length: ${WORD_COUNT}
```

**Customer Segmentation Example:**
```yaml
role: Marketing data scientist
context: E-commerce platform with 100K customers, 2 years transaction history
action:
  primary: Perform customer segmentation using RFM analysis
  steps:
    - Calculate recency, frequency, monetary scores
    - Create segment profiles
    - Generate recommendations
format:
  structure: analysis_report
  include: [segment_profiles, characteristics, recommendations]
  visualizations: [segment_distribution, value_matrix]
  export: [csv_data, pdf_report]
```

### YAML Syntax Validation

| Check                          | Required | Action if Failed    |
| ------------------------------ | -------- | ------------------- |
| Valid YAML syntax              | Yes      | Regenerate          |
| Consistent 2-space indentation | Yes      | Fix indentation     |
| No tab characters              | Yes      | Replace with spaces |
| No markdown formatting         | Yes      | Remove bold/headers |
| All RCAF/CRAFT fields present  | Yes      | Add missing fields  |
| Header has `$yaml` mode        | Yes      | Add header          |
| Delivered as file              | Yes      | Create file         |

**Common Issues and Fixes:**

| Issue                   | Recognition       | Solution                         |
| ----------------------- | ----------------- | -------------------------------- |
| **Indentation error**   | Parse fails       | Use exactly 2 spaces per level   |
| **Tab characters**      | Parse fails       | Replace tabs with spaces         |
| **Missing colon-space** | Key without value | Ensure `key: value` format       |
| **List syntax**         | Structure errors  | Use dash-space prefix: `- item`  |
| **Duplicate keys**      | Parser warning    | Ensure unique keys at each level |
| **Trailing spaces**     | Formatting issues | Remove trailing whitespace       |

### YAML Best Practices

| Category        | Do                          | Do Not                                |
| --------------- | --------------------------- | ------------------------------------- |
| **Indentation** | Use 2 spaces consistently   | Mix tabs and spaces                   |
| **Nesting**     | Keep hierarchy < 4 levels   | Over-nest structures                  |
| **Keys**        | Use meaningful names        | Use special characters without quotes |
| **Lists**       | Use dash-space prefix       | Forget list syntax                    |
| **Multi-line**  | Use `|` or `>` for blocks   | Use flow style for complex data       |
| **Delivery**    | Create downloadable file    | Deliver in chat                       |
| **Header**      | Include `$yaml` mode        | Add verbose sections                  |
| **Content**     | Only header + YAML          | Include explanations in file          |
| **Validation**  | Validate before delivery    | Skip validation                       |

**Nesting Depth by Complexity:**

| Complexity     | Framework | YAML Structure        |
| -------------- | --------- | --------------------- |
| Simple (1-3)   | RCAF      | Flat, 4 keys          |
| Medium (4-6)   | RCAF      | Nested format         |
| Complex (7-10) | CRAFT     | Multi-level hierarchy |

**Token Optimization:**
```yaml
# Less efficient (verbose keys)
artificial_intelligence_model_role: expert

# More efficient (concise keys)
role: expert

# Use anchors for repetition (YAML-unique advantage)
defaults: &defaults
  format: report
  length: 1000

task_1:
  <<: *defaults
  specific: value
```

**Performance Metrics:**

| Metric             | Target | Average |
| ------------------ | ------ | ------- |
| Parse Success Rate | >99%   | 99.5%   |
| Token Overhead     | <7%    | 5.2%    |
| Base CLEAR Score   | >40/50 | 42/50   |
| CLEAR with DEPTH   | >45/50 | 47/50   |
| Human Readability  | High   | 9/10    |

**Command Activation:**
- `$yaml` command for automatic YAML formatting
- `$y` as shorthand
- Combine with modes: `$improve $yaml` or `$refine $yaml`

**YAML Philosophy:**
> "Structure with humanity. YAML bridges machine precision with human readability."

Core Principles:
1. Clarity through indentation -- Visual hierarchy
2. Simplicity through minimalism -- Less syntax overhead
3. Flexibility through structure -- Nested when needed
4. Readability through spacing -- Natural formatting
5. Maintainability through comments -- Self-documenting

> **Deep-dive:** See [format_guide_yaml.md](../assets/format_guide_yaml.md) for the full YAML format specification.

---

<!-- /ANCHOR:yaml-format -->
<!-- ANCHOR:cross-format-conversion-reference -->
## 5. Cross-Format Conversion Reference

### Conversion Matrix

| From         | To       | Key Changes                                       |
| ------------ | -------- | ------------------------------------------------- |
| **Markdown** | JSON     | `**Field:**` becomes `"field":`, add braces/quotes |
| **Markdown** | YAML     | `**Field:**` becomes `field:`, indent nested       |
| **JSON**     | Markdown | Remove braces/quotes, add `**Field:**`             |
| **JSON**     | YAML     | Remove braces/quotes, use indentation              |
| **YAML**     | Markdown | Add `**Field:**` prefix, convert lists to bullets  |
| **YAML**     | JSON     | Add braces/quotes, commas after values             |

### Side-by-Side Example

**Markdown:**
```markdown
**Role:** Data analyst with SQL expertise.
**Context:** Sales database with 5 years of transaction data.
**Action:** Identify top performing products by region.
**Format:** Dashboard with charts and executive summary.
```

**JSON:**
```json
{
  "role": "Data analyst with SQL expertise",
  "context": "Sales database with 5 years of transaction data",
  "action": "Identify top performing products by region",
  "format": "Dashboard with charts and executive summary"
}
```

**YAML:**
```yaml
role: Data analyst with SQL expertise
context: Sales database with 5 years of transaction data
action: Identify top performing products by region
format: Dashboard with charts and executive summary
```

---

<!-- /ANCHOR:cross-format-conversion-reference -->
<!-- ANCHOR:error-recovery-protocol -->
## 6. Error Recovery Protocol (All Formats)

All formats share the same recovery workflow:

```
1. RECOGNIZE: Validation failure or format mismatch detected
2. STOP: Do not deliver invalid output
3. ANNOUNCE: "Format error detected. Regenerating..."
4. FIX: Address the specific issue
5. VALIDATE: Re-check all format-specific requirements
6. DELIVER: Only when valid
```

---

<!-- /ANCHOR:error-recovery-protocol -->
<!-- ANCHOR:rcaf-craft-field-requirements -->
## 7. RCAF/CRAFT Field Requirements (All Formats)

### RCAF Fields

| Field       | Required | Description          | Best Practices                      |
| ----------- | -------- | -------------------- | ----------------------------------- |
| **Role**    | Yes      | Expertise needed     | Be specific about domain and skills |
| **Context** | Yes      | Essential background | Include constraints and scope       |
| **Action**  | Yes      | Task to perform      | Make measurable and specific        |
| **Format**  | Yes      | Output structure     | Define sections and length          |

### CRAFT Additional Field

| Field      | Required    | Description              | Best Practices             |
| ---------- | ----------- | ------------------------ | -------------------------- |
| **Target** | Yes (CRAFT) | Success metrics/criteria | Define measurable outcomes |

---

<!-- /ANCHOR:rcaf-craft-field-requirements -->
<!-- ANCHOR:token-efficiency-summary -->
## 8. Token Efficiency Summary

General token optimization principles that apply across all formats:

1. **Concise keys** -- `role` not `artificial_intelligence_model_role`
2. **Specific terms** -- "50K records" not "large dataset with lots of data"
3. **Earned verbosity** -- Detail only where it adds precision
4. **Format-appropriate structure** -- Use each format's natural strengths
5. **No redundancy** -- State information once in the most appropriate field

<!-- /ANCHOR:token-efficiency-summary -->
