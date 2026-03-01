---
title: "Implementation Plan: Path-Scoped Validation Rules [001-mvp-monolithic/plan]"
description: "┌─────────────────────────────────────────────────────────────────┐"
trigger_phrases:
  - "implementation"
  - "plan"
  - "path"
  - "scoped"
  - "validation"
  - "001"
  - "mvp"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Path-Scoped Validation Rules
<!-- SPECKIT_TEMPLATE_SOURCE: plan.md | v1.0 -->

## Metadata

| Field | Value |
|-------|-------|
| **Feature** | path-scoped-rules |
| **Area** | validation |
| **Priority** | P1 |
| **Spec Folder** | 012-path-scoped-rules |
| **Created** | 2024-12-24 |
| **Related Spec** | [spec.md](./spec.md) |

---

## 1. Technical Context

### Technology Stack
| Component | Technology | Notes |
|-----------|------------|-------|
| Language | Bash 4.0+ | Consistent with existing scripts |
| Config | YAML | `.speckit.yaml` parsed with shell tools |
| Output | Text/JSON | JSON via jq if available |
| Testing | Bash + fixtures | Test spec folders with known states |

### Existing Components
| Component | Role | Integration Point |
|-----------|------|-------------------|
| `common.sh` | Shared utilities | Source for logging, colors |
| `check-prerequisites.sh` | File existence | Call validate-spec.sh |
| `calculate-completeness.sh` | Checklist % | Share parsing logic |
| `AGENTS.md` Gate 6 | Completion check | Validation requirement |
| `SKILL.md` | AI instructions | Document validation |

### Constraints
- Must work without additional dependencies (no Node.js requirement)
- Must complete in <2 seconds for typical spec folder
- Must not break existing scripts or workflows
- Must handle missing config gracefully

---

## 2. Architecture

### Component Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        validate-spec.sh                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Config       │  │ Level        │  │ Path         │          │
│  │ Loader       │  │ Detector     │  │ Matcher      │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                 │                 │                   │
│         └────────────┬────┴────────────────┘                   │
│                      ▼                                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Rule Engine                           │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │   │
│  │  │FILE_    │ │PLACE-   │ │SECTIONS_│ │PRIORITY_│ ...   │   │
│  │  │EXISTS   │ │HOLDER   │ │PRESENT  │ │TAGS     │       │   │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                      │                                          │
│                      ▼                                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                 Report Generator                         │   │
│  │         (Text / JSON / Summary)                          │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow

```
Input: spec folder path
         │
         ▼
┌─────────────────────┐
│ 1. Load config      │ ← .speckit.yaml (optional)
│    (.speckit.yaml)  │ ← Environment variables
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ 2. Detect level     │ ← spec.md metadata
│    (1/2/3)          │ ← File presence inference
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ 3. Match path       │ ← Determine rule set
│    patterns         │ ← (NONE/MINIMAL/STANDARD/STRICT)
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ 4. Execute rules    │ ← Run applicable checks
│    for each file    │ ← Collect results
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ 5. Generate report  │ → Text (human) or JSON (tooling)
│    and exit code    │ → Exit: 0=pass, 1=warn, 2=error
└─────────────────────┘
```

---

## 3. Implementation Phases

### Phase 1: Core Validation Engine (P0)
**Goal:** Basic validation script with core checks
**Duration:** 3-4 hours
**Output:** Working `validate-spec.sh` with 6 core rules

| Step | Task | Output |
|------|------|--------|
| 1.1 | Create script skeleton | validate-spec.sh with args, help |
| 1.2 | Implement level detection | Reads spec.md or infers from files |
| 1.3 | Implement FILE_EXISTS | Checks required files per level |
| 1.4 | Implement PLACEHOLDER_FILLED | Detects unfilled placeholders |
| 1.5 | Implement SECTIONS_PRESENT | Validates required sections |
| 1.6 | Implement PRIORITY_TAGS | Validates P0/P1/P2 in checklists |
| 1.7 | Implement EVIDENCE_CITED | Validates [EVIDENCE:] format |
| 1.8 | Add JSON output mode | --json flag |
| 1.9 | Create test fixtures | Sample spec folders for testing |

### Phase 2: Path Scoping (P1)
**Goal:** Different rules for different paths
**Duration:** 2-3 hours
**Output:** Path pattern matching with rule sets

| Step | Task | Output |
|------|------|--------|
| 2.1 | Define .speckit.yaml schema | Config file format |
| 2.2 | Implement config loader | Parse YAML with shell |
| 2.3 | Implement path matcher | Glob pattern matching |
| 2.4 | Define rule sets | NONE/MINIMAL/STANDARD/STRICT |
| 2.5 | Wire patterns to rules | Pattern → rule set mapping |
| 2.6 | Add environment overrides | SPECKIT_* variables |

### Phase 3: Integration (P1)
**Goal:** Integrate with existing system
**Duration:** 1-2 hours
**Output:** Validation in workflows

| Step | Task | Output |
|------|------|--------|
| 3.1 | Update check-prerequisites.sh | Call validation |
| 3.2 | Update AGENTS.md Gate 6 | Require validation |
| 3.3 | Update /spec_kit:complete | Validation in Step 11 |
| 3.4 | Backward compatibility test | Verify no breaks |

### Phase 4: Documentation (P2)
**Goal:** Complete documentation
**Duration:** 1 hour
**Output:** Updated docs

| Step | Task | Output |
|------|------|--------|
| 4.1 | Update SKILL.md | Document validation |
| 4.2 | Update path_scoped_rules.md | Implementation docs |
| 4.3 | Create validation_rules.md | Rule reference |
| 4.4 | Update README.md | Feature description |

---

## 4. Validation Rules Detail

### Rule Definitions

| Rule ID | Description | Severity | Applies To |
|---------|-------------|----------|------------|
| `FILE_EXISTS` | Required files present for level | ERROR | All levels |
| `PLACEHOLDER_FILLED` | No unfilled `[YOUR_VALUE_HERE:]` | ERROR | spec.md, plan.md |
| `SECTIONS_PRESENT` | Required sections in templates | WARNING | All templates |
| `PRIORITY_TAGS` | P0/P1/P2 format in checklists | WARNING | checklist.md |
| `EVIDENCE_CITED` | `[EVIDENCE:]` on completed items | WARNING | checklist.md |
| `ANCHORS_VALID` | ANCHOR tags properly paired | ERROR | memory/*.md |
| `LEVEL_DECLARED` | Level explicitly stated | INFO | spec.md |

### Rule Sets

| Set | Rules Applied | Use Case |
|-----|---------------|----------|
| `NONE` | (none) | scratch/ - skip everything |
| `MINIMAL` | ANCHORS_VALID | memory/ - format only |
| `STANDARD` | FILE_EXISTS, PLACEHOLDER_FILLED, SECTIONS_PRESENT | Normal specs |
| `STRICT` | All rules | CI/CD, Level 3 |

### Path Pattern Defaults

| Pattern | Rule Set | Rationale |
|---------|----------|-----------|
| `**/scratch/**` | NONE | Disposable, no validation |
| `**/memory/**` | MINIMAL | Auto-generated, format only |
| `**/templates/**` | NONE | Placeholders expected |
| `specs/*/*` | STANDARD | Normal validation |

---

## 5. Configuration Schema

### .speckit.yaml

```yaml
# .speckit.yaml - Project-level validation config
validation:
  enabled: true
  default_ruleset: STANDARD
  
  # Severity overrides (error → warning → info → ignore)
  severity:
    PLACEHOLDER_FILLED: error
    SECTIONS_PRESENT: warning
    EVIDENCE_CITED: info
  
  # Path pattern overrides
  patterns:
    - path: "**/scratch/**"
      ruleset: NONE
    - path: "**/memory/**"
      ruleset: MINIMAL
    - path: "**/templates/**"
      ruleset: NONE
    - path: "specs/*/decision-record.md"
      ruleset: STRICT
  
  # Level-specific rules
  levels:
    1:
      required_files: [spec.md, plan.md, tasks.md]
    2:
      required_files: [spec.md, plan.md, tasks.md, checklist.md]
    3:
      required_files: [spec.md, plan.md, tasks.md, checklist.md, decision-record.md]
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `SPECKIT_VALIDATION` | `true` | Enable/disable validation |
| `SPECKIT_RULESET` | `STANDARD` | Override default ruleset |
| `SPECKIT_STRICT` | `false` | Treat warnings as errors |
| `SPECKIT_JSON` | `false` | Force JSON output |

---

## 6. Output Formats

### Text Output (Human)

```
Validating: specs/007-auth-feature/
Level: 2 (from spec.md metadata)
Ruleset: STANDARD

✓ FILE_EXISTS: All required files present
✗ PLACEHOLDER_FILLED: 3 unfilled placeholders
  - spec.md:25: [YOUR_VALUE_HERE: acceptance criteria]
  - plan.md:12: [NEEDS CLARIFICATION: database choice]
  - plan.md:45: [YOUR_VALUE_HERE: timeline]
⚠ SECTIONS_PRESENT: Missing optional section
  - plan.md: "Risk Assessment" section not found
✓ PRIORITY_TAGS: All items properly tagged

Summary: 1 error, 1 warning, 0 info
Result: FAIL (fix errors to pass)
```

### JSON Output (Tooling)

```json
{
  "folder": "specs/007-auth-feature/",
  "level": 2,
  "ruleset": "STANDARD",
  "results": [
    {"rule": "FILE_EXISTS", "status": "pass"},
    {"rule": "PLACEHOLDER_FILLED", "status": "fail", "count": 3, "items": [
      {"file": "spec.md", "line": 25, "placeholder": "[YOUR_VALUE_HERE: acceptance criteria]"},
      {"file": "plan.md", "line": 12, "placeholder": "[NEEDS CLARIFICATION: database choice]"},
      {"file": "plan.md", "line": 45, "placeholder": "[YOUR_VALUE_HERE: timeline]"}
    ]},
    {"rule": "SECTIONS_PRESENT", "status": "warn", "missing": ["Risk Assessment"]},
    {"rule": "PRIORITY_TAGS", "status": "pass"}
  ],
  "summary": {"errors": 1, "warnings": 1, "info": 0},
  "passed": false
}
```

---

## 7. Testing Strategy

### Test Fixtures

Create test spec folders in `scratch/test-fixtures/`:

| Fixture | Purpose |
|---------|---------|
| `valid-level1/` | Clean Level 1 spec, should pass |
| `valid-level2/` | Clean Level 2 spec, should pass |
| `valid-level3/` | Clean Level 3 spec, should pass |
| `missing-files/` | Missing required files, should fail |
| `unfilled-placeholders/` | Has `[YOUR_VALUE_HERE:]`, should fail |
| `missing-sections/` | Missing required sections, should warn |
| `scratch-content/` | Content in scratch/, should skip |

### Test Script

```bash
#!/bin/bash
# test-validation.sh

run_test() {
  local fixture="$1"
  local expected="$2"
  
  result=$(./validate-spec.sh "scratch/test-fixtures/$fixture" --json)
  actual=$(echo "$result" | jq -r '.passed')
  
  if [[ "$actual" == "$expected" ]]; then
    echo "✓ $fixture: expected $expected, got $actual"
  else
    echo "✗ $fixture: expected $expected, got $actual"
    exit 1
  fi
}

run_test "valid-level1" "true"
run_test "valid-level2" "true"
run_test "valid-level3" "true"
run_test "missing-files" "false"
run_test "unfilled-placeholders" "false"

echo "All tests passed!"
```

---

## 8. Rollout Plan

### Stage 1: Internal Testing
- Validate against all existing spec folders
- Fix any false positives
- Refine rule thresholds

### Stage 2: Opt-in
- Document in SKILL.md
- Add to /spec_kit:complete as optional step
- Gather feedback

### Stage 3: Default On
- Enable in Gate 6 by default
- Warnings only (not blocking)
- Monitor for issues

### Stage 4: Enforcement
- Errors block completion
- CI/CD integration
- Full documentation

---

## 9. Stop/Rollback Conditions

| Condition | Action |
|-----------|--------|
| >10% false positive rate | Disable rule, investigate |
| Performance >5 seconds | Profile and optimize |
| Breaking existing workflows | Rollback, fix compatibility |
| User complaints about friction | Loosen defaults, review rules |

---

## 10. Related Documents

- [spec.md](./spec.md) - Requirements
- [tasks.md](./tasks.md) - Task breakdown
- [checklist.md](./checklist.md) - Verification
- [decision-record.md](./decision-record.md) - ADRs
