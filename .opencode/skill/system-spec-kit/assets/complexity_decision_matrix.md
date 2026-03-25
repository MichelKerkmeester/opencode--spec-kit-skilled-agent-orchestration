---
title: Complexity Decision Matrix
description: Quick reference for complexity-based level selection and feature enabling.
---

# Complexity Decision Matrix - Quick Reference for Level Selection

Quick reference for complexity-based level selection and feature enabling.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

This matrix provides quick-reference guidance for selecting the appropriate documentation level based on task complexity. Use it to determine which templates to use and which features to enable.

For cross-phase campaigns or shared-memory coordination work, treat boundary-management overhead as part of the complexity score. Tasks that span multiple spec folders, runtime families, or shared spaces should be scored as coordination-heavy even when each individual edit is small.

### Usage

1. Estimate your task's complexity score using the dimension signals in Section 3
2. Match the score to a level in Section 2
3. Verify feature requirements in Section 4
4. Use the CLI commands in Section 8 to create your spec folder
5. If the work crosses phases or shared spaces, add coordination weight before choosing a level

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:level-selection-by-score -->
## 2. LEVEL SELECTION BY SCORE

| Score Range | Level | Name         | Templates                                   | Features Auto-Enabled         |
| ----------- | ----- | ------------ | ------------------------------------------- | ----------------------------- |
| 0-25        | 1     | Baseline     | spec, plan, tasks, impl-summary             | None                          |
| 26-55       | 2     | Verification | Level 1 + checklist                         | dep-graph (table)             |
| 56-79       | 3     | Full         | Level 2 + decision-record                   | dep-graph (ASCII), effort-est |
| 80-100      | 3+    | Extended     | Level 3 + AI protocols + extended checklist | All features                  |

**Coordination-Root Override**: Root coordination packets governing multi-phase efforts
(phase maps, ADR records, tree-truth governance) should be classified as Level 3+
regardless of complexity score, as they require governance artifacts not covered by Level 3.

---

<!-- /ANCHOR:level-selection-by-score -->
<!-- ANCHOR:dimension-scoring-signals -->
## 3. DIMENSION SCORING SIGNALS

### Scope (25% weight)

| Signal             | Points | Example                    |
| ------------------ | ------ | -------------------------- |
| 100+ LOC mentioned | +15    | "about 200 lines"          |
| 500+ LOC mentioned | +25    | "major rewrite"            |
| 3-5 files affected | +10    | "update three files"       |
| 6+ files affected  | +20    | "affects multiple modules" |
| Multiple systems   | +15    | "frontend and backend"     |
| "comprehensive"    | +10    | "comprehensive redesign"   |
| "large-scale"      | +15    | "large-scale migration"    |

### Risk (25% weight)

| Signal           | Points | Example                                 |
| ---------------- | ------ | --------------------------------------- |
| Authentication   | +20    | "login", "auth", "session"              |
| Authorization    | +15    | "permissions", "access control"         |
| API changes      | +12    | "endpoint", "REST", "GraphQL"           |
| Database         | +15    | "migration", "schema", "query"          |
| Security         | +20    | "security", "encryption", "credentials" |
| Configuration    | +10    | "config", "environment", "settings"     |
| Breaking changes | +15    | "breaking", "deprecate", "remove API"   |

### Research (20% weight)

| Signal        | Points | Example                             |
| ------------- | ------ | ----------------------------------- |
| "investigate" | +15    | "investigate the issue"             |
| "analyze"     | +12    | "analyze performance"               |
| "research"    | +15    | "research alternatives"             |
| "explore"     | +10    | "explore options"                   |
| "unknown"     | +15    | "behavior is unknown"               |
| External deps | +12    | "third-party", "library", "service" |

### Multi-Agent (15% weight)

| Signal          | Points | Example                       |
| --------------- | ------ | ----------------------------- |
| "parallel"      | +20    | "parallel workstreams"        |
| "concurrent"    | +15    | "concurrent tasks"            |
| Multiple agents | +25    | "5 agents", "multiple agents" |
| Workstreams     | +20    | "separate workstreams"        |
| Coordination    | +15    | "coordinate between"          |

### Coordination (15% weight)

| Signal                 | Points | Example                               |
| ---------------------- | ------ | ------------------------------------- |
| Dependencies           | +15    | "depends on", "blocking"              |
| Cross-system           | +20    | "across systems", "integration"       |
| External services      | +15    | "external API", "third-party service" |
| Blocking relationships | +15    | "must complete before"                |
| Complex ordering       | +10    | "specific order", "sequence"          |

---

<!-- /ANCHOR:dimension-scoring-signals -->
<!-- ANCHOR:feature-decision-matrix -->
## 4. FEATURE DECISION MATRIX

| Feature               | Level 1 | Level 2 | Level 3  | Level 3+ |
| --------------------- | ------- | ------- | -------- | -------- |
| Basic templates       | ✓       | ✓       | ✓        | ✓        |
| Checklist             | -       | ✓       | ✓        | ✓        |
| Decision record       | -       | -       | ✓        | ✓        |
| Dep graph (table)     | -       | ✓       | ✓        | ✓        |
| Dep graph (ASCII)     | -       | -       | ✓        | ✓        |
| Dep graph (DAG)       | -       | -       | -        | ✓        |
| Effort estimation     | -       | -       | ✓        | ✓        |
| AI execution protocol | -       | -       | Optional | Required |
| Extended checklist    | -       | -       | -        | ✓        |
| Sign-off section      | -       | -       | -        | ✓        |
| Workstream org        | -       | -       | -        | ✓        |

---

<!-- /ANCHOR:feature-decision-matrix -->
<!-- ANCHOR:content-scaling-matrix -->
## 5. CONTENT SCALING MATRIX

| Content Type         | Level 1 | Level 2 | Level 3 | Level 3+ |
| -------------------- | ------- | ------- | ------- | -------- |
| User Stories         | 1-2     | 2-4     | 4-8     | 8-15     |
| Phases               | 2-3     | 3-5     | 5-8     | 8-12     |
| Tasks                | 5-15    | 15-50   | 50-100  | 100+     |
| Checklist items      | 10-20   | 30-50   | 60-100  | 100-150  |
| Requirements         | 3-5     | 5-10    | 8-15    | 15+      |
| Acceptance scenarios | 2-4     | 4-8     | 6-12    | 12+      |

---

<!-- /ANCHOR:content-scaling-matrix -->
<!-- ANCHOR:quick-decision-guide -->
## 6. QUICK DECISION GUIDE

### When to Override Auto-Detection

**Override to HIGHER level when:**
- Security-sensitive changes (even if low complexity score)
- Breaking API changes
- Database migrations
- Multi-team coordination required
- Compliance/audit requirements

**Override to LOWER level when:**
- False positive on keywords ("research" used casually)
- Simple task described with complex language
- One-time utility script

### Template Style Selection

Choose the appropriate template **style** based on user experience and requirement clarity:

| Style    | Lines  | Best For                              | Path                 |
| -------- | ------ | ------------------------------------- | -------------------- |
| **Core** | ~60-90 | Experienced users, clear requirements | `templates/level_N/` |

### Confidence Thresholds

| Confidence | Action                              |
| ---------- | ----------------------------------- |
| 85-95%     | Trust recommendation                |
| 70-84%     | Review dimensions, may accept       |
| 50-69%     | Review carefully, consider override |
| <50%       | Manual selection recommended        |

### Boundary Cases

| Score | Near Boundary?  | Recommendation                                    |
| ----- | --------------- | ------------------------------------------------- |
| 23-27 | L1/L2 boundary  | If any risk factors, choose L2                    |
| 53-57 | L2/L3 boundary  | If architectural impact, choose L3                |
| 77-82 | L3/L3+ boundary | If multi-agent or AI protocols needed, choose L3+ |

---

<!-- /ANCHOR:quick-decision-guide -->
<!-- ANCHOR:example-classifications -->
## 7. EXAMPLE CLASSIFICATIONS

| Task Description                         | Score | Level | Key Factors                      |
| ---------------------------------------- | ----- | ----- | -------------------------------- |
| "Fix typo in README"                     | 8     | 1     | Low scope, no risk               |
| "Add email validation to form"           | 22    | 1     | Single file, clear scope         |
| "Create reusable modal component"        | 38    | 2     | Multiple files, needs testing    |
| "Implement OAuth2 authentication"        | 62    | 3     | Auth risk, multiple systems      |
| "Add payment processing with Stripe"     | 71    | 3     | High risk, external integration  |
| "Platform migration with 10 workstreams" | 89    | 3+    | Multi-agent, high coordination   |
| "Real-time collaboration feature"        | 85    | 3+    | Complex state, high coordination |

---

<!-- /ANCHOR:example-classifications -->
<!-- ANCHOR:cli-quick-reference -->
## 8. CLI QUICK REFERENCE

```bash
# Create spec folder with Level 1 (default)
./scripts/spec/create.sh "Simple bugfix"

# Create spec folder with Level 2
./scripts/spec/create.sh "Add authentication" --level 2

# Create spec folder with Level 3
./scripts/spec/create.sh "Major refactor" --level 3

# Create spec folder with Level 3+ (extended)
./scripts/spec/create.sh "Platform migration" --level 3+
```

---

<!-- /ANCHOR:cli-quick-reference -->
<!-- ANCHOR:spec-traceability -->
## 9. SPEC TRACEABILITY

This decision matrix addresses the following spec requirements:

| Requirement | Section | Description                                       |
| ----------- | ------- | ------------------------------------------------- |
| REQ-011     | §4.1    | Complexity scoring algorithm and dimensions       |
| REQ-012     | §4.2    | Score-to-level mapping (0-25, 26-55, 56-79, 80+)  |
| REQ-013     | §4.3    | Dimension signals and keyword detection           |
| REQ-014     | §4.4    | Feature enablement based on complexity            |
| REQ-015     | §4.5    | Override conditions for manual level selection    |

**Source**: `.opencode/skill/system-spec-kit/spec.md`

---

<!-- /ANCHOR:spec-traceability -->
<!-- ANCHOR:related-resources -->
## 10. RELATED RESOURCES

### Asset Files
- [level_decision_matrix.md](./level_decision_matrix.md) - LOC-based level selection and progressive enhancement
- [template_mapping.md](./template_mapping.md) - Template routing with copy commands
- [parallel_dispatch_config.md](./parallel_dispatch_config.md) - Complexity scoring and agent dispatch

### Reference Files
- [level_specifications.md](../references/templates/level_specifications.md) - Complete Level 1-3+ requirements
- [template_guide.md](../references/template_guide.md) - Template selection and quality standards

### Scripts
- [compose.sh](../scripts/templates/compose.sh) - Template composition from core + addendum

### Related Skills
- `system-spec-kit` - Spec folder workflow orchestrator
<!-- /ANCHOR:related-resources -->
