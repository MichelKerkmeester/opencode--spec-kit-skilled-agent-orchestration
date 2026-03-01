# Level 2 Templates

> Medium-sized features requiring QA validation, NFRs, and edge case documentation (100-499 LOC).

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1.  OVERVIEW]](#1--overview)
- [2.  QUICK START]](#2--quick-start)
- [3.  STRUCTURE]](#3--structure)
- [4.  FEATURES]](#4--features)
- [5. ️ TROUBLESHOOTING]](#5--troubleshooting)
- [6.  RELATED DOCUMENTS]](#6--related-documents)

---
<!-- /ANCHOR:table-of-contents -->

<!-- ANCHOR:overview -->
## 1. OVERVIEW

**Purpose**: Level 2 templates provide enhanced documentation for medium-sized features that require systematic validation, non-functional requirements, and explicit edge case handling.

**When to Use Level 2**:
- **LOC Range** - Changes affect 100-499 lines of code
- **QA Validation** - Feature requires systematic verification checklist
- **NFRs Matter** - Non-functional requirements (performance, security) are critical
- **Edge Cases** - Edge cases need explicit documentation and handling
- **Complexity** - 2-4 user stories with moderate implementation complexity

### What Level 2 Adds

Level 2 builds on Level 1 by adding:

| Addition | Purpose |
|----------|---------|
| **checklist.md** | QA validation checklist with P0/P1/P2 prioritized items |
| **NFRs Section** | Performance, security, accessibility requirements in spec.md |
| **Edge Cases Section** | Explicit edge case documentation in spec.md |
| **Effort Estimates** | T-shirt sizing and hour estimates in plan.md |
| **Phase Dependencies** | Enhanced phase relationships and rollback plans in plan.md |

### Required Files

Level 2 includes **5 template files**:

| File | Purpose | Key Additions |
|------|---------|---------------|
| `spec.md` | Feature specification | +NFRs, +Edge Cases, +Complexity score |
| `plan.md` | Implementation plan | +Phase Dependencies, +Effort estimates, +Enhanced Rollback |
| `tasks.md` | Task breakdown | Standard task structure |
| `implementation-summary.md` | Post-implementation summary | Standard summary structure |
| `checklist.md` | Verification checklist | P0/P1/P2 prioritized verification items |

**Total Files**: 5 (Level 1 has 4, Level 3 has 6)

---
<!-- /ANCHOR:overview -->

<!-- ANCHOR:quick-start -->
## 2. QUICK START

### 30-Second Setup

```bash
# 1. Create spec folder
mkdir -p specs/###-feature-name

# 2. Copy all Level 2 templates
cp .opencode/skill/system-spec-kit/templates/level_2/*.md specs/###-feature-name/

# 3. Fill templates in order (see Fill Templates section below)
```

### Fill Templates

Fill out templates in this order:

1. **spec.md** - Define problem, scope, NFRs, edge cases
2. **plan.md** - Create implementation phases with effort estimates
3. **tasks.md** - Break down tasks (auto-generated from plan.md preferred)
4. **checklist.md** - Define verification criteria (can be created upfront or during implementation)
5. **implementation-summary.md** - Complete after implementation (post-work only)

### Validation

Level 2 requires passing validation script:

```bash
# Run validation
node .opencode/skill/system-spec-kit/scripts/validate-spec.js specs/###-feature-name/

# Exit codes:
# 0 = Pass
# 1 = Warnings (non-blocking)
# 2 = Errors (blocking - must fix)
```

---
<!-- /ANCHOR:quick-start -->

<!-- ANCHOR:structure -->
## 3. STRUCTURE

Level 2 spec folder structure:

```
specs/###-feature-name/
├── spec.md                      # Enhanced with NFRs and edge cases
├── plan.md                      # Enhanced with effort estimates
├── tasks.md                     # Task breakdown
├── checklist.md                 # NEW: QA validation checklist
├── implementation-summary.md    # Post-implementation summary
├── scratch/                     # Temporary files
└── memory/                      # Session context (auto-created)
```

### Key Files

| File | Purpose |
|------|---------|
| `checklist.md` | P0/P1/P2 prioritized verification items |
| `spec.md` | Specification with NFRs and edge cases |
| `plan.md` | Implementation plan with effort estimates |

---
<!-- /ANCHOR:structure -->

<!-- ANCHOR:features -->
## 4. FEATURES

### Enhanced Specifications

**Non-Functional Requirements (NFRs)**: Performance, security, accessibility, and scalability requirements explicitly documented in spec.md.

**Edge Cases**: Explicit documentation of edge cases, error conditions, and boundary scenarios.

**Complexity Scoring**: Quantitative complexity assessment to guide implementation approach.

### QA Validation Checklist

**checklist.md** provides:
- **P0 Items** - HARD BLOCKERS that must pass
- **P1 Items** - Must complete OR user-approved deferral
- **P2 Items** - Can defer without approval
- **Live Tracking** - Update during implementation

### Effort Estimation

**T-shirt sizing** (XS/S/M/L/XL) and hour estimates for each implementation phase.

### Validation Script

Automated validation ensures all required sections and formatting standards are met.

---
<!-- /ANCHOR:features -->

<!-- ANCHOR:troubleshooting -->
## 5. ️ TROUBLESHOOTING

### Common Issues

#### Validation script fails with errors

**Symptom**: `validate-spec.js` exits with code 2 (blocking errors)

**Cause**: Missing required sections or formatting issues

**Solution**:
```bash
# Run validation to see specific errors
node .opencode/skill/system-spec-kit/scripts/validate-spec.js specs/###-feature-name/

# Fix reported errors and re-run
```

#### Should I use Level 1, 2, or 3?

**Decision Criteria**:
- LOC < 100 → Level 1
- LOC 100-499 → Level 2
- LOC ≥ 500 → Level 3
- Needs checklist → Level 2+
- Needs decision record → Level 3
- Architectural changes → Level 3

#### Checklist items unclear

**Symptom**: Not sure what to put in checklist.md

**Cause**: Need examples of good verification items

**Solution**: Review existing Level 2 spec folders for examples, or consult the template guide for inline guidance.

### Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| Missing NFRs section | Add "## Non-Functional Requirements" to spec.md |
| Missing edge cases | Add "## Edge Cases" to spec.md |
| Validation warnings | Check exit code: 1 = warnings (non-blocking), 2 = errors (must fix) |

### Diagnostic Commands

```bash
# Validate spec folder
node .opencode/skill/system-spec-kit/scripts/validate-spec.js specs/###-feature-name/

# Check which files exist
ls -la specs/###-feature-name/

# Compare with template
diff specs/###-feature-name/checklist.md .opencode/skill/system-spec-kit/templates/level_2/checklist.md
```

---
<!-- /ANCHOR:troubleshooting -->

<!-- ANCHOR:related-documents -->
## 6. RELATED DOCUMENTS

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [Level 1 Templates](../level_1/) | Simple features (<100 LOC) |
| [Level 3 Templates](../level_3/) | Large features (500+ LOC) with decision records |
| [Level 2 Addendum](../addendum/level2-verify/) | Additional verification sections |
| [Template Guide](../../references/templates/template_guide.md) | Complete template usage guide |
| [Level Decision Matrix](../../assets/level_decision_matrix.md) | How to choose the right level |
| [Validation Rules](../../references/validation/validation_rules.md) | What validation checks |
| [system-spec-kit SKILL.md](../../SKILL.md) | Primary skill documentation |

---
<!-- /ANCHOR:related-documents -->

