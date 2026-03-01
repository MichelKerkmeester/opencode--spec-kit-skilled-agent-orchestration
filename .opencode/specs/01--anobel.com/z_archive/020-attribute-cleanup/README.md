# Level 1 Templates

> Minimal templates for small features and simple changes (under 100 lines of code).

---

## TABLE OF CONTENTS

- [1.  OVERVIEW]](#1--overview)
- [2.  QUICK START]](#2--quick-start)
- [3.  FEATURES]](#3--features)
- [4. TROUBLESHOOTING]](#4--troubleshooting)
- [5.  RELATED DOCUMENTS]](#5--related-documents)

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

**Purpose**: Level 1 templates provide minimal documentation structure for small features, bug fixes, and simple changes that don't require extensive validation or architectural decisions.

**When to Use Level 1**:
- **Small Changes** - Features under 100 lines of code
- **Single-File Edits** - Changes confined to one or two files
- **Clear Requirements** - Well-defined scope with no ambiguity
- **Bug Fixes** - Simple fixes with known solutions
- **Low Risk** - Changes that don't affect system architecture

**Escalate to Level 2 if**:
- LOC exceeds 100 lines
- QA validation is required
- Multiple files or systems are affected
- Checklist-based verification is needed

### Required Files

Level 1 requires **4 core files**:

| File | Purpose | Created When |
|------|---------|--------------|
| `spec.md` | Feature specification | Spec folder creation |
| `plan.md` | Implementation plan | Spec folder creation |
| `tasks.md` | Task breakdown | Spec folder creation |
| `implementation-summary.md` | Implementation summary | After implementation completes |

**Note**: `implementation-summary.md` is created AFTER implementation, not at spec folder creation time.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:quick-start -->
## 2. QUICK START

### 30-Second Setup

```bash
# 1. Create new spec folder
mkdir -p specs/###-short-name

# 2. Copy Level 1 templates (excluding implementation-summary.md)
cp .opencode/skill/system-spec-kit/templates/level_1/spec.md specs/###-short-name/
cp .opencode/skill/system-spec-kit/templates/level_1/plan.md specs/###-short-name/
cp .opencode/skill/system-spec-kit/templates/level_1/tasks.md specs/###-short-name/

# 3. Fill templates with your content
# implementation-summary.md is copied AFTER implementation completes
```

### Fill Templates

1. **spec.md** - Define what needs to be built and why
2. **plan.md** - Outline how it will be implemented
3. **tasks.md** - Break down work into actionable tasks

### Create Implementation Summary

After implementation completes:

```bash
# Copy implementation-summary template
cp .opencode/skill/system-spec-kit/templates/level_1/implementation-summary.md specs/###-short-name/

# Fill with actual implementation details
```

<!-- /ANCHOR:quick-start -->

---

<!-- ANCHOR:features -->
## 3. FEATURES

### Characteristics

- **Lightweight** - Minimal overhead for simple changes
- **Flexible** - Adapt templates to your specific needs
- **Fast** - Get started in under a minute
- **Clear** - Well-defined structure without unnecessary complexity

<!-- /ANCHOR:features -->

---

<!-- ANCHOR:troubleshooting -->
## 4. TROUBLESHOOTING

### Common Issues

#### Missing implementation-summary.md

**Symptom**: Template folder doesn't have implementation-summary.md after setup

**Cause**: This file is intentionally excluded from initial setup

**Solution**: Copy the template AFTER implementation completes:
```bash
cp .opencode/skill/system-spec-kit/templates/level_1/implementation-summary.md specs/###-short-name/
```

#### Should I use Level 1 or Level 2?

**Decision Criteria**:
- LOC < 100 → Level 1
- LOC 100-499 → Level 2
- Needs QA validation → Level 2
- Needs checklist → Level 2
- Simple bug fix → Level 1

### Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| Forgot which templates to copy | See Quick Start section above |
| Task grew beyond 100 LOC | Migrate to Level 2 templates |

<!-- /ANCHOR:troubleshooting -->

---

<!-- ANCHOR:related-documents -->
## 5. RELATED DOCUMENTS

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [Level 2 Templates](../level_2/) | When to escalate (100-499 LOC, QA validation) |
| [Template Mapping Reference](../../references/templates/template_guide.md) | Complete template selection guide |
| [Level Decision Matrix](../../assets/level_decision_matrix.md) | Choosing the right level |

<!-- /ANCHOR:related-documents -->

---

<!--
LEVEL 1 TEMPLATES - Minimal Documentation
- 4 required files: spec, plan, tasks, implementation-summary
- <100 LOC features
- Simple changes with clear requirements
- No checklist or decision-record needed
- implementation-summary.md created AFTER implementation
-->
