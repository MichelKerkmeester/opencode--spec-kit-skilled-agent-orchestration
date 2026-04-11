---
title: Format Guide -- Markdown
description: >
  Deep-dive formatting guide for Markdown output in prompt engineering.
  Covers fundamentals, delivery standards, RCAF/CRAFT structures, advanced
  patterns, syntax validation, and best practices for Markdown prompt output.
---

# Format Guide -- Markdown

Complete formatting specification for delivering enhanced prompts in Markdown format, the default human-readable output mode.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Defines the Markdown formatting rules, structures, and best practices for delivering enhanced prompts. Markdown is the standard (default) output format, optimized for human readability and natural language flow.

### Usage

- Delivering enhanced prompts in Markdown format (default mode)
- Applying RCAF or CRAFT framework structures to Markdown output
- Validating Markdown-specific syntax and delivery requirements
- Optimizing token efficiency in text-based prompt delivery
- Creating downloadable `.md` prompt files with proper headers

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:fundamentals -->
## 2. FUNDAMENTALS

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

---

<!-- /ANCHOR:fundamentals -->
<!-- ANCHOR:delivery-standards -->
## 3. DELIVERY STANDARDS

### Mandatory Header Format

Single line at the TOP of every Markdown prompt file:

```
Mode: $[mode] | Complexity: [level] | Framework: [RCAF/CRAFT]
```

Header requirements:
- Mode with `$` prefix: `$improve`, `$refine`, `$quick`, etc.
- Complexity level: Low/Medium/High or 1-10
- Framework used: RCAF or CRAFT

### File Content Rules

| Allowed                            | Forbidden                  |
| ---------------------------------- | -------------------------- |
| Single-line header (with $ prefix) | CLEAR Evaluation breakdown |
| Enhanced prompt content            | Processing Applied section |
|                                    | Format Options section     |
|                                    | Explanations (go in CHAT)  |

### Correct Example

```
Mode: $improve | Complexity: Medium | Framework: RCAF

**Role:** Data analyst with expertise in SaaS metrics.
**Context:** Q4 revenue data from B2B platform with 10K customers.
**Action:** Calculate MRR growth and identify top 3 revenue trends.
**Format:** Executive summary (500 words) with metrics, charts, and recommendations.
```

### Incorrect Example (metadata in file)

```
Mode: $improve | Complexity: Medium | Framework: RCAF

**Role:** Data analyst

**CLEAR Evaluation:**
- Correctness: 8/10
...

**Processing Applied:**
DEPTH rounds completed
```

---

<!-- /ANCHOR:delivery-standards -->
<!-- ANCHOR:rcaf-structure -->
## 4. RCAF MARKDOWN STRUCTURE

### Template

```markdown
**Role:** [Specific expertise definition]
**Context:** [Essential background information]
**Action:** [Clear measurable task]
**Format:** [Expected output requirements]
```

### Example -- Analysis Task

```
Mode: $improve | Complexity: Medium | Framework: RCAF

**Role:** Financial analyst specializing in SaaS metrics and growth analysis.
**Context:** Q4 2024 revenue data from B2B platform with 10,000 customers, focusing on subscription trends.
**Action:** Calculate MRR growth rate, identify top 3 revenue trends, and provide actionable insights.
**Format:** Executive summary (500 words) with key metrics, trend charts, and 3-5 strategic recommendations.
```

---

<!-- /ANCHOR:rcaf-structure -->
<!-- ANCHOR:craft-structure -->
## 5. CRAFT MARKDOWN STRUCTURE

### Template

```markdown
**Context:** [Comprehensive background and constraints]
**Role:** [Detailed expertise and perspective]
**Action:** [Primary task with subtasks and deliverables]
**Format:** [Detailed output specifications]
**Target:** [Success metrics and criteria]
```

### Example -- Complex Analysis

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

### CRAFT vs RCAF Selection

| Use CRAFT When                      | Use RCAF When         |
| ----------------------------------- | --------------------- |
| Multiple success metrics needed     | Single clear outcome  |
| Complex multi-stakeholder scenarios | Straightforward task  |
| Detailed specifications required    | Flexibility preferred |
| Comprehensive documentation needed  | Quick clarity needed  |

---

<!-- /ANCHOR:craft-structure -->
<!-- ANCHOR:advanced-patterns -->
## 6. ADVANCED PATTERNS

### Multi-Step Process

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

### Conditional Logic

```markdown
**Role:** Customer service specialist with technical troubleshooting skills.
**Context:** First-line support for software platform.

**Action:** Classify and route support tickets:
- Technical issue (error, bug, crash) -> Engineering, assess severity
- Billing/payment related -> Finance, high priority
- General inquiry -> Support Tier 1, standard queue

**Format:** Routing decision with department, priority, and brief rationale (50 words max).
```

---

<!-- /ANCHOR:advanced-patterns -->
<!-- ANCHOR:syntax-validation -->
## 7. SYNTAX VALIDATION

### Validation Checklist

| Check                            | Required | Action if Failed    |
| -------------------------------- | -------- | ------------------- |
| Valid markdown formatting        | Yes      | Fix syntax          |
| Single-line header with $ prefix | Yes      | Add header          |
| All framework fields present     | Yes      | Add missing fields  |
| No forbidden sections            | Yes      | Remove/move to chat |
| Natural readability              | Yes      | Simplify language   |

### Framework Validation

**RCAF Requirements:**
- Role: Present, specific, domain-defined
- Context: Present, sufficient detail
- Action: Present, measurable
- Format: Present, clearly defined

**CRAFT Additional:**
- Target: Present, audience clear

---

<!-- /ANCHOR:syntax-validation -->
<!-- ANCHOR:best-practices -->
## 8. BEST PRACTICES

### Do / Do Not

| Category      | Do                                 | Do Not                            |
| ------------- | ---------------------------------- | --------------------------------- |
| **Headers**   | Use bold for fields (`**Field:**`) | Over-format with complex markdown |
| **Structure** | Keep paragraphs concise            | Skip framework fields             |
| **Lists**     | Use for multiple items             | Nest lists excessively            |
| **Content**   | Include specific examples          | Use ambiguous language            |
| **Outcomes**  | Define measurable actions          | Create unmeasurable actions       |
| **Header**    | Use $ prefix in mode               | Add quality scores to header      |
| **File**      | Only header + prompt content       | Include CLEAR evaluation          |

### Token Efficiency

```markdown
# Less efficient (verbose)
**Role:** You are a professional data analyst who specializes in...

# More efficient (concise)
**Role:** Data analyst specializing in...

# Specific terms over vague
**Context:** Dataset with 50K records (not "large dataset with lots of data")
```

### Philosophy

> "Natural language is the universal interface. Markdown provides structure without sacrificing humanity."

Core principles:
1. Clarity through simplicity -- Direct communication
2. Structure through convention -- Consistent patterns
3. Flexibility through natural language -- Adaptable expression
4. Efficiency through minimalism -- No wasted tokens
5. Focus through minimalism -- Minimal header only

<!-- /ANCHOR:best-practices -->
