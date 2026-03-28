---
title: Folder Structure Reference
description: Spec folder naming conventions, level requirements, and organization patterns
---

# Folder Structure Reference

Spec folder naming conventions, level requirements, and organization patterns.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

This document covers spec folder organization, naming conventions, and level-specific requirements for the Spec Kit system.

### Template Directory Structure

```
templates/
├── core/                    # Minimal templates (~60-90 LOC) - source components
│   ├── spec-core.md
│   ├── plan-core.md
│   ├── tasks-core.md
│   └── impl-summary-core.md
│
├── addendum/                # Level-specific additions
│   ├── level2-verify/       # +Verification addendums
│   ├── level3-arch/         # +Architecture addendums
│   └── level3plus-govern/   # +Governance addendums
│
├── level_1/                 # Pre-composed Level 1 (ALWAYS use for new specs)
├── level_2/                 # Pre-composed Level 2
├── level_3/                 # Pre-composed Level 3
├── level_3+/                # Pre-composed Level 3+
│
└── [cross-level templates]  # handover.md, debug-delegation.md, research/research.md
```

> **IMPORTANT:** Always copy templates from `level_N/` folders for new specs. The `core/` and `addendum/` folders are source components.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:naming-convention -->
## 2. NAMING CONVENTION

### Spec Folder Names

Format: `NNN-short-descriptive-name`

| Component | Rule | Example |
|-----------|------|---------|
| Number prefix | 3 digits, zero-padded | `007` |
| Separator | Single hyphen | `-` |
| Name | Lowercase, hyphen-separated | `add-auth-system` |

**Examples:**
- ✅ `001-initial-setup`
- ✅ `042-refactor-api-endpoints`
- ❌ `1-setup` (missing zero-padding)
- ❌ `001_setup` (underscore instead of hyphen)
- ❌ `001-Setup` (uppercase)

### Sub-Folder Names

For iterative work within a spec folder:

Format: `NNN-topic-name`

```
007-feature/
├── 001-initial-implementation/
├── 002-bug-fixes/
└── 003-performance-optimization/
```

---

<!-- /ANCHOR:naming-convention -->
<!-- ANCHOR:level-requirements -->
## 3. LEVEL REQUIREMENTS

### Level 1 (< 100 LOC)

**Required Files:**
```
specs/NNN-name/
├── spec.md                    # Problem statement, goals, scope
├── plan.md                    # Implementation approach
├── tasks.md                   # Task breakdown
└── implementation-summary.md  # Created AFTER implementation completes
```

**Optional:**
- `scratch/` - Temporary files
- `memory/` - Context for future sessions

### Level 2 (100-499 LOC)

**Required Files:**
```
specs/NNN-name/
├── spec.md
├── plan.md
├── tasks.md
├── checklist.md               # QA validation items
└── implementation-summary.md  # Created AFTER implementation completes
```

**Optional:**
- `scratch/`
- `memory/`

### Level 3 (≥ 500 LOC)

**Required Files:**
```
specs/NNN-name/
├── spec.md
├── plan.md
├── tasks.md
├── checklist.md
├── decision-record.md         # Architecture decisions
└── implementation-summary.md  # Created AFTER implementation completes
```

**Optional:**
- `scratch/`
- `memory/`
- `research/research.md` - Extended research documentation

---

<!-- /ANCHOR:level-requirements -->
<!-- ANCHOR:special-folders -->
## 4. SPECIAL FOLDERS

### scratch/

Temporary, disposable files. Cleaned up after task completion.

**Use for:**
- Debug logs
- Test scripts
- Prototypes
- Temporary data

**Rules:**
- Never commit sensitive data
- Clean up when done
- Don't reference from permanent docs

### memory/

Context preservation for future sessions.

**Use for:**
- Session summaries
- Decision rationale
- Blockers encountered
- Continuation context

**File Naming:** `DD-MM-YY_HH-MM__topic-name.md`

Example: `07-12-25_14-30__feature-name.md`

```markdown
---
title: Session Summary
created: DD-MM-YY
type: context
triggers:
  - keyword1
  - keyword2
---

# Content here
```

---

<!-- /ANCHOR:special-folders -->
<!-- ANCHOR:archive-pattern -->
## 5. ARCHIVE PATTERN

Completed or superseded specs use the `z_archive/` prefix:

```
specs/
├── 001-active-feature/
├── 002-in-progress/
└── z_archive/
    ├── 001-completed-feature/
    └── 002-abandoned-approach/
```

**Archive Triggers:**
- Feature fully implemented and verified
- Approach abandoned for alternative
- Spec superseded by newer version

---

<!-- /ANCHOR:archive-pattern -->
<!-- ANCHOR:example-structures -->
## 6. EXAMPLE STRUCTURES

### Simple Feature (Level 1)

```
specs/015-add-dark-mode/
├── spec.md
├── plan.md
├── tasks.md
└── implementation-summary.md  # Created after implementation
```

### Medium Feature (Level 2)

```
specs/016-user-preferences/
├── spec.md
├── plan.md
├── tasks.md
├── checklist.md
├── implementation-summary.md  # Created after implementation
├── scratch/
│   └── test-data.json
└── memory/
    └── 15-01-24_10-30__user-preferences.md
```

### Complex Feature (Level 3)

```
specs/017-authentication-system/
├── spec.md
├── plan.md
├── tasks.md
├── checklist.md
├── decision-record.md
├── implementation-summary.md
├── scratch/
│   ├── oauth-flow-test.js
│   └── token-debug.log
└── memory/
    ├── 10-01-24_09-15__authentication-system.md
    └── 12-01-24_14-00__authentication-system.md
```

### Iterative Work (Sub-folders)

```
specs/018-api-refactor/
├── 001-endpoint-analysis/
│   ├── spec.md
│   ├── plan.md
│   └── tasks.md
├── 002-breaking-changes/
│   ├── spec.md
│   ├── plan.md
│   ├── tasks.md
│   └── checklist.md
└── 003-migration-guide/
    ├── spec.md
    └── plan.md
```

```
specs/022-hybrid-rag-fusion/        <- Coordination root (point-in-time snapshot)
├── spec.md                          <- Phase map + current tree truth
├── decision-record.md               <- ADR-001: tree truth > historical synthesis
├── 001-epic/                        <- Child phase packet
├── 002-indexing/                    <- Child phase packet
└── 011-skill-alignment/             <- Child phase packet
    └── 002-skill-review/            <- Nested child
```

---

<!-- /ANCHOR:example-structures -->
<!-- ANCHOR:related-resources -->
## 7. RELATED RESOURCES

- [Level Specifications](../templates/level_specifications.md)
- [Template Guide](../templates/template_guide.md)
- [Sub-folder Versioning](../structure/sub_folder_versioning.md)
<!-- /ANCHOR:related-resources -->
