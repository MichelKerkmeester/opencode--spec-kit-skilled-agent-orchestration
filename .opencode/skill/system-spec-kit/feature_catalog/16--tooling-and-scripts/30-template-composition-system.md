---
title: "Template Composition System"
description: "Automated composition and drift-verification pipeline that builds level-specific Spec Kit templates from core and addendum sources."
---

# Template Composition System

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

## 1. OVERVIEW

The Template Composition System is the script-and-template pipeline that turns the Spec Kit `core/` and `addendum/` source fragments into the ready-to-copy template sets under `templates/level_1`, `level_2`, `level_3`, and `level_3+`.

Its job is not just file generation. The composer also normalizes level markers, rewrites template-title suffixes, strips composition-only markers from addendum fragments, and provides a verify mode that detects drift between the source fragments and the committed composed outputs.

## 2. CURRENT REALITY

The shipped behavior in this slice currently works as follows:

1. `scripts/templates/compose.sh` is the authoritative composer. It resolves the `templates/` root from its own location, defines `core/`, `addendum/`, and four output directories, and defaults to composing all four levels unless the caller explicitly limits the run to `1`, `2`, `3`, or `3+`.
2. The CLI supports three operating modes around the same composition engine: normal write mode, `--dry-run` preview mode, and `--verify` drift-detection mode. `--verbose` enables additional debug output, and `--help` prints the composition contract and level rules.
3. Before composing anything, the script validates that the core directory, addendum directory, and a fixed list of required source files exist. That list spans the Level 2 verification fragments, the Level 3 architecture fragments, and the Level 3+ governance fragments, so missing upstream pieces fail the run before outputs are touched.
4. `spec.md` is composed differently by level. Level 1 is core-only. Level 2 injects `spec-level2.md` before the core open-questions section and renumbers that section from 7 to 10. Level 3 and Level 3+ rebuild the document from extracted frontmatter, a generated H1 block, level-specific guidance text, prefix and suffix fragments, the core sections 1 through 6, a renumbered open-questions block, and a shared related-documents footer.
5. `plan.md` follows a simpler append model: the composer starts from `plan-core.md`, strips the trailing comment block, and appends Level 2, Level 3, and Level 3+ plan fragments according to the requested output level. `tasks.md` and `implementation-summary.md` stay core-only across every level, with only the `SPECKIT_LEVEL` marker updated.
6. `checklist.md` comes from the Level 2 verification addendum for every level above 1. For both Level 3 and Level 3+, the composer appends the `level3plus-govern/checklist-extended.md` fragment before writing the final checklist. `decision-record.md` is copied from the Level 3 architecture addendum for both Level 3 and Level 3+ outputs.
7. Several helper transforms keep the generated files publishable. The composer strips frontmatter off inserted fragments, removes `SPECKIT_ADDENDUM` comments, rewrites `<!-- SPECKIT_LEVEL: ... -->` markers, replaces the metadata-table placeholder `| **Level** | [1/2/3] |`, and normalizes frontmatter `title` values so composed files carry a `[template:relative/path]` suffix that matches their output location.
8. The write path ensures output directories exist and then either writes the generated files, previews the first lines in dry-run mode, or compares generated content against committed outputs in verify mode. In verify mode, any missing file or content mismatch is treated as drift and causes a non-zero exit after the full scan.
9. The surrounding template tree documents the intended usage contract. `templates/README.md` tells consumers to copy from `level_1` through `level_3+` rather than from `core/` or `addendum/` directly, and the audited directory layout confirms that the composed outputs sit alongside the source fragments, helper templates, and supporting template documentation.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/system-spec-kit/scripts/templates/compose.sh` | Composer CLI | Validates template sources, composes level outputs, normalizes metadata, and detects drift |
| `.opencode/skill/system-spec-kit/templates/README.md` | Usage contract | Documents the core-plus-addendum architecture and directs consumers to the composed level outputs |
| `.opencode/skill/system-spec-kit/templates/core/spec-core.md` | Core source | Base spec template shared by every composed level |
| `.opencode/skill/system-spec-kit/templates/core/plan-core.md` | Core source | Base implementation-plan template shared by every composed level |
| `.opencode/skill/system-spec-kit/templates/core/tasks-core.md` | Core source | Base task template copied into every level output |
| `.opencode/skill/system-spec-kit/templates/core/impl-summary-core.md` | Core source | Base implementation-summary template copied into every level output |
| `.opencode/skill/system-spec-kit/templates/addendum/level2-verify/*.md` | Addendum set | Level 2 verification fragments for spec, plan, and checklist composition |
| `.opencode/skill/system-spec-kit/templates/addendum/level3-arch/*.md` | Addendum set | Level 3 architecture fragments for spec, plan, and decision-record composition |
| `.opencode/skill/system-spec-kit/templates/addendum/level3plus-govern/*.md` | Addendum set | Level 3+ governance fragments and extended checklist inputs |

### Tests

| File | Focus |
|------|-------|
| `scripts/tests/test-template-system.js` | Compose-script structure, `--verify`, `--dry-run`, and level-selection behavior |
| `scripts/tests/test-template-comprehensive.js` | Compose-script function coverage, single/multi-level execution, and drift-detection mode |
| `scripts/tests/template-structure.vitest.ts` | Template-structure validation and allowed-content drift checks |

## 4. SOURCE METADATA

- Group: Tooling and Scripts
- Source feature title: Template Composition System
- Current reality source: direct implementation audit of the template composer, current template source/output layout, and the listed script-level coverage
