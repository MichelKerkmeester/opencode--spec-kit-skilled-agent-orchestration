---
title: "Plan: sk-doc Skill Functional Testing [002-skill-rename/plan]"
description: "Parallel execution of 8 test agents, each validating a specific component"
trigger_phrases:
  - "plan"
  - "documentation"
  - "skill"
  - "functional"
  - "testing"
  - "016"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# Plan: sk-doc Skill Functional Testing

| Field | Value |
|-------|-------|
| Spec | `008-sk-doc-test` |
| Level | 1 (Baseline) |
| LOC | N/A (testing, not implementation) |
| Risk | Low |

<!-- ANCHOR:summary -->
## Technical Approach

### Testing Strategy

Parallel execution of 8 test agents, each validating a specific component:

```
                    ┌─────────────────────────────────┐
                    │   ORCHESTRATOR                  │
                    │   Dispatch & Synthesize         │
                    └─────────────┬───────────────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        │         │         │         │         │         │         │         │
        ▼         ▼         ▼         ▼         ▼         ▼         ▼         ▼
    ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐
    │Agent 1│ │Agent 2│ │Agent 3│ │Agent 4│ │Agent 5│ │Agent 6│ │Agent 7│ │Agent 8│
    │extract│ │quick_ │ │CLI    │ │CLI    │ │init_  │ │templ- │ │refer- │ │flow-  │
    │struct │ │valid  │ │extract│ │valid  │ │skill  │ │ates   │ │ences  │ │chart  │
    └───────┘ └───────┘ └───────┘ └───────┘ └───────┘ └───────┘ └───────┘ └───────┘
```

### Test Components

| Agent | Component | Test Method | Expected Output |
|-------|-----------|-------------|-----------------|
| 1 | extract_structure.py | Run on SKILL.md | Valid JSON with sections |
| 2 | quick_validate.py | Run on skill dir | Validation report |
| 3 | CLI extract | Execute subcommand | JSON to stdout |
| 4 | CLI validate | Execute subcommand | Validation output |
| 5 | init_skill.py | Create test skill | Scaffolded directory |
| 6 | Templates | Read all assets/ | Content accessible |
| 7 | References | Read all references/ | Content accessible |
| 8 | validate_flowchart.sh | Run on sample | Validation result |

### File Paths

```
.opencode/skills/sk-doc/
├── SKILL.md                          # Main skill file
├── markdown-document-specialist      # CLI executable
├── scripts/
│   ├── extract_structure.py         # Test 1
│   ├── quick_validate.py            # Test 2
│   ├── init_skill.py                # Test 5
│   ├── package_skill.py             # Bonus test
│   └── validate_flowchart.sh        # Test 8
├── assets/                           # Test 6
│   ├── skill_md_template.md
│   ├── skill_asset_template.md
│   ├── skill_reference_template.md
│   ├── readme_template.md
│   ├── command_template.md
│   ├── frontmatter_templates.md
│   ├── llmstxt_templates.md
│   └── flowcharts/
│       ├── simple_workflow.md
│       ├── decision_tree_flow.md
│       ├── parallel_execution.md
│       ├── approval_workflow_loops.md
│       ├── user_onboarding.md
│       └── system_architecture_swimlane.md
└── references/                       # Test 7
    ├── core_standards.md
    ├── skill_creation.md
    ├── optimization.md
    ├── workflows.md
    ├── validation.md
    └── quick_reference.md
```

<!-- /ANCHOR:summary -->

<!-- ANCHOR:phases -->
## Execution Plan

### Phase 1: Parallel Test Dispatch
All 8 agents execute simultaneously, results collected.

### Phase 2: Result Synthesis
Orchestrator evaluates each result against gates:
- **Accuracy**: Output matches expected format
- **Completeness**: All checks performed
- **Consistency**: No conflicts between tests

### Phase 3: Report Generation
Final test report generated in scratch/test_results.md

<!-- /ANCHOR:phases -->

<!-- ANCHOR:risks -->
## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Script execution fails | Check Python version, permissions |
| CLI not executable | chmod +x if needed |
| Path references broken | Verify relative paths work |

<!-- /ANCHOR:risks -->

<!-- ANCHOR:dependencies -->
## Dependencies

- Python 3.x installed
- Bash shell available
- File system permissions

<!-- /ANCHOR:dependencies -->
