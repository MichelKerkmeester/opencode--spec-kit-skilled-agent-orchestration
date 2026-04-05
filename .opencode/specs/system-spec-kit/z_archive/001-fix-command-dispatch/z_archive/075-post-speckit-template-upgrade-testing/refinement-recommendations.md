# Refinement Recommendations: SpecKit Template Optimization

> **Spec:** 074-speckit-template-optimization-refinement
> **Date:** 2026-01-19
> **Purpose:** Actionable recommendations for improving the Spec 073 implementation

---

## Executive Summary

Based on comprehensive analysis of the current implementation versus the original backup, this document provides **15 prioritized recommendations** for refinement. The recommendations are grouped by priority and effort, with specific implementation guidance for each.

---

## Priority Matrix

| Priority | Count | Focus Area |
|----------|-------|------------|
| **P0 (Critical)** | 2 | User onboarding, template maintenance |
| **P1 (High)** | 4 | Documentation gaps, path clarity |
| **P2 (Medium)** | 5 | Developer experience, consistency |
| **P3 (Low)** | 4 | Nice-to-haves, future enhancements |

---

## P0: Critical Recommendations

### REC-001: Create Verbose Template Variants

**Problem:** The v2.0 templates removed extensive guidance that helped new users understand what content to provide. The `[YOUR_VALUE_HERE: description]` and `[NEEDS CLARIFICATION: (a) (b) (c)]` patterns provided valuable scaffolding.

**Recommendation:** Create a `verbose/` template set alongside the current minimal templates.

**Implementation:**
```
templates/
├── core/              # Minimal (current)
├── verbose/           # NEW: Guided templates
│   ├── core/
│   │   ├── spec-core-verbose.md
│   │   ├── plan-core-verbose.md
│   │   ├── tasks-core-verbose.md
│   │   └── impl-summary-core-verbose.md
│   └── README.md      # Explains when to use verbose
├── addendum/
└── composed/
```

**Content to Restore (from backup):**

1. **Placeholder Guidance:**
   ```markdown
   <!-- BEFORE (Current) -->
   **Problem Statement:** [Describe the problem]

   <!-- AFTER (Verbose) -->
   **Problem Statement:** [YOUR_VALUE_HERE: Describe the specific problem being solved. Include:
   - What is currently broken or missing?
   - Who is affected?
   - What is the business impact?
   Example: "Users cannot reset their passwords because the email service integration is broken, affecting ~500 daily password reset requests."]
   ```

2. **Clarification Options:**
   ```markdown
   <!-- BEFORE (Current) -->
   **Scope:** [Define scope]

   <!-- AFTER (Verbose) -->
   **Scope:** [NEEDS CLARIFICATION: Choose scope boundary:
   (a) Single file change - isolated fix
   (b) Feature-scoped - affects one feature area
   (c) System-wide - crosses multiple features
   (d) Infrastructure - affects build/deploy/config]
   ```

**Effort:** 4-6 hours
**Impact:** High - significantly improves onboarding experience

---

### REC-002: Create Automated Compose Script

**Problem:** Templates were manually composed during Spec 073. Future changes to `core/` or `addendum/` require manual recomposition, risking drift between source and composed templates.

**Recommendation:** Create `scripts/templates/compose.sh` to automate template composition.

**Implementation:**
```bash
#!/bin/bash
# compose.sh - Compose templates from core + addendums

TEMPLATES_DIR=".opencode/skill/system-spec-kit/templates"

compose_level() {
    local level=$1
    local output_dir="$TEMPLATES_DIR/composed/level_$level"

    mkdir -p "$output_dir"

    # Start with core
    for core_file in "$TEMPLATES_DIR/core/"*.md; do
        local basename=$(basename "$core_file" | sed 's/-core//')
        cp "$core_file" "$output_dir/$basename"
    done

    # Append addendums based on level
    case $level in
        2)
            append_addendum "$output_dir" "level2-verify"
            ;;
        3)
            append_addendum "$output_dir" "level2-verify"
            append_addendum "$output_dir" "level3-arch"
            ;;
        "3+")
            append_addendum "$output_dir" "level2-verify"
            append_addendum "$output_dir" "level3-arch"
            append_addendum "$output_dir" "level3plus-govern"
            ;;
    esac

    # Update template version marker
    sed -i '' "s/SPECKIT_LEVEL: [0-9+]*/SPECKIT_LEVEL: $level/" "$output_dir/"*.md
}

# Run for all levels
for level in 1 2 3 "3+"; do
    compose_level "$level"
done
```

**Effort:** 2-4 hours
**Impact:** High - ensures template consistency and enables easy updates

---

## P1: High Priority Recommendations

### REC-003: Clarify Template Path Conventions

**Problem:** Three path conventions exist (`core/`, `addendum/`, `composed/`) plus legacy `level_N/` paths, causing potential confusion.

**Recommendation:** Add clear documentation and deprecate legacy paths.

**Implementation:**
1. Add to `SKILL.md` and `level_specifications.md`:
   ```markdown
   ## Template Paths

   | Path | Purpose | When to Use |
   |------|---------|-------------|
   | `templates/composed/level_N/` | Ready-to-use templates | **ALWAYS use this** |
   | `templates/core/` | Source components | For understanding only |
   | `templates/addendum/` | Level additions | For understanding only |
   | `templates/level_N/` | **DEPRECATED** | Do not use |
   ```

2. Add deprecation warning to legacy paths:
   ```markdown
   <!-- templates/level_1/spec.md -->
   <!-- DEPRECATED: Use templates/composed/level_1/spec.md instead -->
   ```

**Effort:** 1-2 hours
**Impact:** Medium - reduces user confusion

---

### REC-004: Unify Level Calculator

**Problem:** Level recommendation logic is split between `recommend-level.sh` (shell) and `complexity-config.jsonc` (config), creating two sources of truth.

**Recommendation:** Consolidate into single JavaScript module with JSON config.

**Implementation:**
```javascript
// scripts/spec/recommend-level.js
import complexityConfig from '../../config/complexity-config.jsonc';

export function recommendLevel(metrics) {
    const { loc, fileCount, riskFactors, dependencies } = metrics;

    // Primary: LOC-based
    if (loc < 100) return 1;
    if (loc < 500) return 2;

    // Secondary: Complexity score
    const score = calculateComplexityScore(metrics, complexityConfig);
    if (score >= 80) return "3+";
    if (score >= 56) return 3;

    return 2;
}
```

**Effort:** 4-8 hours
**Impact:** Medium - improves maintainability

---

### REC-005: Add Template Selection Preference

**Problem:** Users cannot choose between minimal and verbose templates based on their experience level.

**Recommendation:** Add `SPECKIT_TEMPLATE_STYLE` environment variable.

**Implementation:**
1. Add to `config/config.jsonc`:
   ```jsonc
   {
     "templates": {
       "style": "minimal",  // "minimal" | "verbose"
       "styleFallback": "minimal"
     }
   }
   ```

2. Update `create.sh`:
   ```bash
   TEMPLATE_STYLE="${SPECKIT_TEMPLATE_STYLE:-minimal}"
   if [[ "$TEMPLATE_STYLE" == "verbose" ]]; then
       TEMPLATE_SOURCE="$TEMPLATES_DIR/verbose/composed"
   else
       TEMPLATE_SOURCE="$TEMPLATES_DIR/composed"
   fi
   ```

**Effort:** 2-4 hours
**Impact:** High - supports both new and experienced users

---

### REC-006: Restore WHEN TO USE Sections

**Problem:** The detailed "WHEN TO USE THIS TEMPLATE" sections at the top of templates were removed, losing context about template purpose.

**Recommendation:** Restore as HTML comments (invisible but available).

**Implementation:**
```markdown
<!-- WHEN TO USE THIS TEMPLATE:
Level 1 (Core) is appropriate when:
- Changes affect <100 lines of code
- Single feature or bug fix
- Low risk, well-understood change
- No architectural decisions needed

DO NOT use Level 1 if:
- Multiple features affected
- Significant risk involved
- Architectural decisions required
- Cross-team coordination needed
-->

# Specification: {{PROJECT_NAME}}
```

**Effort:** 2-3 hours
**Impact:** Medium - provides guidance without template bloat

---

## P2: Medium Priority Recommendations

### REC-007: Add Template Validation Rule

**Problem:** No validation ensures composed templates match core + addendums.

**Recommendation:** Add `check-template-composition.sh` validation rule.

**Implementation:**
```bash
# scripts/rules/check-template-composition.sh
RULE_NAME="TEMPLATE_COMPOSITION"
RULE_SEVERITY="warn"

run_check() {
    local expected actual
    for level in 1 2 3 "3+"; do
        expected=$(compose_template_to_string "$level")
        actual=$(cat "$TEMPLATES_DIR/composed/level_$level/spec.md")
        if [[ "$expected" != "$actual" ]]; then
            RULE_STATUS="fail"
            RULE_MESSAGE="Level $level composed template differs from source"
        fi
    done
}
```

**Effort:** 2-4 hours
**Impact:** Medium - catches composition drift

---

### REC-008: Document Migration Path from v1.0

**Problem:** Existing spec folders using v1.0 templates may need migration guidance.

**Recommendation:** Add migration guide to references.

**Implementation:**
Create `references/templates/migration_v1_to_v2.md`:
```markdown
# Migration Guide: v1.0 to v2.0 Templates

## Who Needs to Migrate
- Existing spec folders using v1.0 templates do NOT require migration
- Templates in spec folders are snapshots, not live references

## If You Want to Update
1. No action needed - existing specs work as-is
2. To use new features, copy v2.0 sections manually
3. Template version is informational only

## Breaking Changes: None
- All section headings preserved
- All required fields preserved
- Only presentation changed
```

**Effort:** 1-2 hours
**Impact:** Low - reduces migration anxiety

---

### REC-009: Add Inline Examples as Comments

**Problem:** Inline examples (`[example: ...]`) were removed, losing quality guidance.

**Recommendation:** Restore examples as HTML comments.

**Implementation:**
```markdown
**Requirements:**
<!-- Example:
REQ-001: User authentication
- Priority: P0
- Type: Functional
- Description: Users must authenticate via OAuth 2.0
- Acceptance: Login flow completes in <3 seconds
-->

| ID | Description | Priority | Type |
|----|-------------|----------|------|
| REQ-001 | [Requirement description] | P0/P1/P2 | Functional/NFR |
```

**Effort:** 3-4 hours
**Impact:** Medium - provides quality guidance

---

### REC-010: Standardize Placeholder Syntax

**Problem:** Mixed placeholder syntax in templates (`[brackets]` vs `{{mustache}}`).

**Recommendation:** Standardize on single format.

**Implementation:**
- Use `[PLACEHOLDER_NAME]` for user-filled content
- Use `{{MUSTACHE}}` only for template rendering
- Document in `template_style_guide.md`

**Effort:** 2-3 hours
**Impact:** Low - consistency improvement

---

### REC-011: Add Level Comparison Table

**Problem:** Users must read multiple sections to understand level differences.

**Recommendation:** Add comparison table to `level_specifications.md`.

**Implementation:**
```markdown
## Quick Comparison

| Feature | L1 | L2 | L3 | L3+ |
|---------|:--:|:--:|:--:|:---:|
| spec.md | ✓ | ✓ | ✓ | ✓ |
| plan.md | ✓ | ✓ | ✓ | ✓ |
| tasks.md | ✓ | ✓ | ✓ | ✓ |
| impl-summary.md | ✓ | ✓ | ✓ | ✓ |
| checklist.md | - | ✓ | ✓ | ✓ |
| decision-record.md | - | - | ✓ | ✓ |
| NFRs | - | ✓ | ✓ | ✓ |
| Risk Matrix | - | - | ✓ | ✓ |
| AI Protocols | - | - | - | ✓ |
| Approval Workflow | - | - | - | ✓ |
| **Typical LOC** | ~270 | ~390 | ~540 | ~640 |
```

**Effort:** 1 hour
**Impact:** Medium - quick reference value

---

## P3: Low Priority Recommendations

### REC-012: Add Template Preview Command

**Problem:** Users cannot preview template content before creating spec folder.

**Recommendation:** Add `--preview` flag to `create.sh`.

**Implementation:**
```bash
# In create.sh
if [[ "$PREVIEW" == "true" ]]; then
    echo "=== Preview: Level $LEVEL Templates ==="
    for file in "$TEMPLATE_SOURCE/"*.md; do
        echo "--- $(basename "$file") ---"
        head -50 "$file"
        echo "..."
    done
    exit 0
fi
```

**Effort:** 1-2 hours
**Impact:** Low - convenience feature

---

### REC-013: Add Template Diff Command

**Problem:** Hard to see what changed between template versions.

**Recommendation:** Add `scripts/templates/diff.sh`.

**Implementation:**
```bash
#!/bin/bash
# diff.sh - Compare template versions
diff -u "$BACKUP_DIR/templates/level_$1/spec.md" \
        "$CURRENT_DIR/templates/composed/level_$1/spec.md"
```

**Effort:** 1 hour
**Impact:** Low - developer tooling

---

### REC-014: Add Complexity Score Visualization

**Problem:** Complexity scores in `parallel_dispatch_config.md` are abstract.

**Recommendation:** Add visual complexity meter to output.

**Implementation:**
```bash
# In recommend-level.sh
print_complexity_meter() {
    local score=$1
    local filled=$((score / 5))
    local empty=$((20 - filled))
    printf "[%s%s] %d%%\n" \
        "$(printf '█%.0s' $(seq 1 $filled))" \
        "$(printf '░%.0s' $(seq 1 $empty))" \
        "$score"
}
```

**Effort:** 1 hour
**Impact:** Low - visual polish

---

### REC-015: Create Template Cookbook

**Problem:** No examples of well-written spec folders using v2.0 templates.

**Recommendation:** Create `references/templates/cookbook.md` with examples.

**Implementation:**
```markdown
# Template Cookbook

## Example 1: Simple Bug Fix (Level 1)
[Full spec.md example with commentary]

## Example 2: New Feature (Level 2)
[Full spec.md + checklist.md example]

## Example 3: Architecture Change (Level 3)
[Full decision-record.md example]
```

**Effort:** 4-6 hours
**Impact:** Medium - training resource

---

## Implementation Roadmap

### Phase 1: Critical (Week 1) - COMPLETE
- [x] REC-001: Create verbose template variants
- [x] REC-002: Create automated compose script

### Phase 2: High Priority (Week 2) - COMPLETE
- [x] REC-003: Clarify template path conventions
- [x] REC-005: Add template selection preference
- [x] REC-006: Restore WHEN TO USE sections

### Phase 3: Medium Priority (Week 3-4)
- [ ] REC-004: Unify level calculator
- [ ] REC-007: Add template validation rule
- [ ] REC-009: Add inline examples as comments
- [ ] REC-011: Add level comparison table

### Phase 4: Polish (Future)
- [ ] REC-008: Document migration path
- [ ] REC-010: Standardize placeholder syntax
- [ ] REC-012: Add template preview command
- [ ] REC-013: Add template diff command
- [ ] REC-014: Add complexity score visualization
- [ ] REC-015: Create template cookbook

---

## Summary

### What to Keep (Current Implementation)
1. CORE + ADDENDUM architecture - excellent design
2. Value-based scaling (+Verify, +Arch, +Govern) - clear communication
3. Pre-composed templates - user-friendly
4. 70% template reduction - token efficiency
5. All validation and memory systems - stability

### What to Add
1. Verbose template variants for onboarding
2. Compose script for maintenance
3. Clear path documentation
4. Template preference system
5. Hidden guidance comments

### What to Consider Restoring
1. `[YOUR_VALUE_HERE: ...]` prompts (in verbose variant)
2. `[NEEDS CLARIFICATION: ...]` guidance (in verbose variant)
3. `[example: ...]` hints (as comments)
4. WHEN TO USE sections (as comments)

---

## Effort Summary

| Priority | Recommendations | Total Effort |
|----------|-----------------|--------------|
| P0 | 2 | 6-10 hours |
| P1 | 4 | 8-17 hours |
| P2 | 5 | 9-14 hours |
| P3 | 4 | 7-10 hours |
| **Total** | **15** | **30-51 hours** |

Implementing P0 and P1 recommendations (6 items, ~14-27 hours) would address the most significant gaps while preserving all benefits of the current implementation.
