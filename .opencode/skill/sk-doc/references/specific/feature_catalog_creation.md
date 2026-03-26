---
title: Feature Catalog Creation - Standards and Workflow
description: Standards and workflow guidance for creating feature catalogs with a rooted inventory, numbered category folders, stable per-feature files, and current-reality source references.
---

# Feature Catalog Creation - Standards and Workflow

Standards and workflow guidance for creating feature catalogs with a rooted inventory, numbered category folders, stable per-feature files, and current-reality source references.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Feature catalogs are the canonical inventory for what a system does today. They organize capabilities by category, summarize current behavior in a root catalog, and link to per-feature files that carry implementation anchors, tests, and metadata.

**Core Principle**: Use the root catalog for stable inventory and navigation, and use per-feature files for implementation truth and traceable source anchors.

**Primary Sources**:
- [feature_catalog_template.md](../../assets/documentation/feature_catalog/feature_catalog_template.md)
- [feature_catalog_snippet_template.md](../../assets/documentation/feature_catalog/feature_catalog_snippet_template.md)
- `.opencode/skill/system-spec-kit/feature_catalog/`

**Current Reality Highlights**:
- feature catalogs use frontmatter and a short H1 intro
- `TABLE OF CONTENTS` is unnumbered
- numbered H2 sections begin with `## 1. OVERVIEW`
- per-feature files live in numbered root-level category folders
- per-feature files describe shipped or current-reality behavior, not vague aspirations

<!-- /ANCHOR:overview -->
<!-- ANCHOR:when-to-create-a-feature-catalog -->
## 2. WHEN TO CREATE A FEATURE CATALOG

Create a feature catalog when the system needs a canonical capability inventory.

**Strong signals**:
- the feature surface is too large for a trustworthy README-only summary
- multiple docs need a stable source of truth for feature names and links
- reviewers or operators need one place to see what the system does now
- manual playbooks or specs need a canonical feature list to cross-reference

**Use a lighter alternative when**:
- the system has only a handful of features
- a README already provides a complete and stable inventory
- the product is too volatile for a maintained catalog to stay accurate

Decision rule:

```text
Need a stable, reviewable current-state inventory?
  YES -> Create a feature catalog package
  NO  -> Keep capability summary in README or install guide
```

<!-- /ANCHOR:when-to-create-a-feature-catalog -->
<!-- ANCHOR:canonical-package-shape -->
## 3. CANONICAL PACKAGE SHAPE

The current catalog contract is:

```text
feature_catalog/
├── FEATURE_CATALOG.md
├── 01--category-name/
│   ├── 01-feature-name.md
│   └── 02-feature-name.md
└── 02--another-category/
    └── 01-feature-name.md
```

**Invariants**:
- root file is always `FEATURE_CATALOG.md`
- category directories use `NN--category-name`
- per-feature files use `NN-feature-name.md`
- one root entry maps to one per-feature file
- slugs should remain stable after publication

**Naming rule**:
- category numbering defines root section order
- per-feature numbering defines local order within the category

<!-- /ANCHOR:canonical-package-shape -->
<!-- ANCHOR:root-catalog-responsibilities -->
## 4. ROOT CATALOG RESPONSIBILITIES

The root catalog is the top-level inventory and navigation layer.

It should own:
- frontmatter and H1 intro
- unnumbered `TABLE OF CONTENTS`
- `## 1. OVERVIEW`
- numbered capability sections by category
- short per-feature summaries
- explicit links to per-feature files

**Root summaries should answer**:
- what this feature does
- what its current reality is
- where to find source-file and test detail

**Do not overload the root catalog with**:
- exhaustive file tables
- full scenario matrices
- speculative future-state design

That information belongs in per-feature files, playbooks, or specs.

<!-- /ANCHOR:root-catalog-responsibilities -->
<!-- ANCHOR:per-feature-file-responsibilities -->
## 5. PER-FEATURE FILE RESPONSIBILITIES

Each per-feature file is the detailed reference entry for one catalog item.

Required structure:
1. `## 1. OVERVIEW`
2. `## 2. CURRENT REALITY`
3. `## 3. SOURCE FILES`
4. `## 4. SOURCE METADATA`

**Per-feature files must include**:
- frontmatter with stable title and one-line description
- a concise overview of the feature
- current-reality behavior description
- implementation source tables
- validation or test anchors where relevant
- metadata including group and canonical file path

**Current-reality rule**:
- describe behavior that exists now
- if a rollout or compatibility layer is documented, label it explicitly
- avoid roadmap or speculative wording unless the feature itself is a documented compatibility or feature-flag surface

<!-- /ANCHOR:per-feature-file-responsibilities -->
<!-- ANCHOR:authoring-workflow -->
## 6. AUTHORING WORKFLOW

Recommended workflow:

1. Decide the category taxonomy.
2. Create `feature_catalog/FEATURE_CATALOG.md`.
3. Create numbered category folders.
4. Create one per-feature file for each root entry.
5. Write concise root summaries and link each feature file.
6. Fill per-feature source-file and metadata sections.
7. Validate the root document and manually verify feature-file links.

**Authoring order matters**:
- stabilize names and slugs before polishing prose
- finish root taxonomy before expanding file-level detail
- use implementation and test anchors to justify every feature summary

**Template/reference split**:
- use the template bundle to scaffold the docs
- use this reference to decide what belongs in the root, what belongs in the per-feature file, and how to keep the package aligned with current standards

<!-- /ANCHOR:authoring-workflow -->
<!-- ANCHOR:relationship-to-playbooks-and-validation -->
## 7. RELATIONSHIP TO PLAYBOOKS AND VALIDATION

Feature catalogs and manual testing playbooks serve different purposes:

| Document | Primary Question |
|---|---|
| Feature catalog | What does the system do today? |
| Manual testing playbook | How do we validate that behavior manually? |

**Cross-reference rule**:
- playbooks should link back to the matching catalog entry when one exists
- catalogs should stay focused on current behavior, not test execution detail

**Validation workflow**:
- validate the root catalog with `validate_document.py`
- manually check per-feature file links and source anchors
- confirm the root entry list matches the per-feature file set

**Current validator limitation**:
- validation is strongest at the root-doc level
- per-feature file link and source-anchor quality still require manual review

<!-- /ANCHOR:relationship-to-playbooks-and-validation -->
<!-- ANCHOR:common-mistakes -->
## 8. COMMON MISTAKES

| Mistake | Why It Breaks | Correct Fix |
|---|---|---|
| Treating the catalog like a roadmap | Readers cannot trust current-state claims | Keep speculative material out or label it explicitly |
| Unstable renaming of category or feature slugs | Breaks links from playbooks and other docs | Keep published slugs stable unless there is a deliberate rename migration |
| Missing source anchors | Catalog claims become hard to audit | Add implementation and validation file references in the per-feature file |
| Writing execution-heavy scenario detail in the catalog | Blurs the boundary with playbooks | Keep execution matrices in playbooks, not the catalog |
| Playbook cross-references drifting from catalog names | Inventory and validation no longer match | Update catalog and playbook links together when a feature name changes |

<!-- /ANCHOR:common-mistakes -->
<!-- ANCHOR:related-resources -->
## 9. RELATED RESOURCES

- [feature_catalog_template.md](../../assets/documentation/feature_catalog/feature_catalog_template.md) - root catalog scaffold
- [feature_catalog_snippet_template.md](../../assets/documentation/feature_catalog/feature_catalog_snippet_template.md) - per-feature file scaffold
- [manual_testing_playbook_creation.md](./manual_testing_playbook_creation.md) - companion reference for validation-package design
- [quick_reference.md](../global/quick_reference.md) - condensed commands and file locations
- [workflows.md](../global/workflows.md) - execution-mode reference

<!-- /ANCHOR:related-resources -->
