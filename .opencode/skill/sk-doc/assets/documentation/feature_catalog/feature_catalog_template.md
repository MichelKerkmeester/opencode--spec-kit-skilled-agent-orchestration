---
title: Feature Catalog Creation - Templates and Standards
description: Templates for creating feature-catalog-style inventories with a root catalog, numbered category sections, current frontmatter conventions, and per-feature reference files.
---

# Feature Catalog Creation - Templates and Standards

Templates for creating feature catalogs that combine top-level capability inventory with per-feature reference files.

---

## 1. OVERVIEW

**Purpose**: Feature catalogs provide a canonical inventory of what a system does today. They organize live capabilities into numbered sections, summarize current behavior in the root document, and point to per-feature reference files for implementation details, tests, and metadata.

**Key Characteristics**:
- **Inventory-first**: The root catalog acts as the system-level directory and summary surface.
- **Feature-catalog shaped**: The root file uses frontmatter, an H1 intro paragraph, an unnumbered `TABLE OF CONTENTS`, and numbered all-caps H2 section headers.
- **Per-feature files**: Each catalog entry maps to exactly one per-feature file in a numbered category directory.
- **Current-reality focused**: The root and per-feature files describe shipped behavior, not speculative roadmaps unless clearly marked.
- **Reference-rich**: Per-feature files carry source-file tables, implementation anchors, and metadata.
- **Stable naming**: Category directory names and feature file slugs should remain stable after publication.

**Location Convention**: `{SKILL_PATH}/feature_catalog/`

Canonical layout:

```text
feature_catalog/
├── FEATURE_CATALOG.md                 # Root inventory and summary catalog
├── 01--category-name/                 # Required per-feature files for category 1
│   ├── 01-feature-name.md
│   └── 02-feature-name.md
└── 02--another-category/              # Required per-feature files for category 2
    └── 01-feature-name.md
```

**Existing Example**:
- `.opencode/skill/system-spec-kit/feature_catalog/`

---

## 2. WHEN TO CREATE FEATURE CATALOGS

**Create a feature catalog when**:
- A skill or system has enough surface area that a flat README no longer gives a trustworthy inventory.
- You need a stable, reviewable list of current capabilities.
- Operators, reviewers, or agents need one place to map features to implementation and test anchors.
- Manual playbooks, install guides, or specs need a canonical feature reference to link back to.

**Keep simpler when**:
- The system has only a handful of features.
- A README or install guide already provides an accurate full inventory.
- The system is too early and volatile for a maintained catalog to be worth the overhead.

---

## 3. CATEGORY AND FILE DESIGN

Each category groups related features under a numbered directory.

| Category Purpose | Example Directory | Example File |
|---|---|---|
| Retrieval | `01--retrieval` | `01-unified-context-retrieval-memorycontext.md` |
| Mutation | `02--mutation` | `01-memory-indexing-memorysave.md` |
| Tooling and scripts | `17--tooling-and-scripts` | `01-admin-cli-bootstrap.md` |

Directory and file rules:
- Category directories use `NN--category-name`.
- Per-feature files use `NN-feature-name.md`.
- The numeric prefix should match the order in the root catalog section.
- Published slugs should remain stable unless the feature is intentionally renamed.

Per-feature file shape:
1. `## 1. OVERVIEW`
2. `## 2. CURRENT REALITY`
3. `## 3. SOURCE FILES`
4. `## 4. SOURCE METADATA`

---

## 4. ROOT CATALOG SCAFFOLD

Copy this scaffold to create `{SKILL_PATH}/feature_catalog/FEATURE_CATALOG.md`:

```markdown
---
title: "{SYSTEM_NAME}: Feature Catalog"
description: "Unified reference combining the complete feature inventory and current-reality reference for the {SYSTEM_NAME} system."
---

# {SYSTEM_NAME}: Feature Catalog

This document combines the current feature inventory for the `{SYSTEM_SLUG}` system into a single reference. The root catalog acts as the system-level directory: it summarizes each capability area, describes what the system does today, and points to the per-feature files that carry the deeper implementation and validation anchors.

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. {CAT1_HEADING}](#2--{CAT1_ANCHOR})
- [3. {CAT2_HEADING}](#3--{CAT2_ANCHOR})
- [4. {CAT3_HEADING}](#4--{CAT3_ANCHOR})

---

## 1. OVERVIEW

Use this catalog as the canonical inventory for the live `{SYSTEM_SLUG}` feature surface. The numbered sections below group the system by capability area so readers can move from a top-level summary into per-feature reference files without losing implementation or validation context.

---

## 2. {CAT1_HEADING}

### {FEATURE_NAME_1}

#### Description

{FEATURE_DESCRIPTION_1}

#### Current Reality

{CURRENT_REALITY_SUMMARY_1}

#### Source Files

See [`{CAT1_DIR}/{FEATURE_FILE_1}`]({CAT1_DIR}/{FEATURE_FILE_1}) for full implementation and test file listings.

---

### {FEATURE_NAME_2}

#### Description

{FEATURE_DESCRIPTION_2}

#### Current Reality

{CURRENT_REALITY_SUMMARY_2}

#### Source Files

See [`{CAT1_DIR}/{FEATURE_FILE_2}`]({CAT1_DIR}/{FEATURE_FILE_2}) for full implementation and test file listings.

---

## 3. {CAT2_HEADING}

### {FEATURE_NAME_3}

#### Description

{FEATURE_DESCRIPTION_3}

#### Current Reality

{CURRENT_REALITY_SUMMARY_3}

#### Source Files

See [`{CAT2_DIR}/{FEATURE_FILE_3}`]({CAT2_DIR}/{FEATURE_FILE_3}) for full implementation and test file listings.
```

---

## 5. PER-FEATURE FILE SCAFFOLD

Copy this scaffold to create `feature_catalog/{CATEGORY_DIR}/{NN}-{feature-name}.md`:

```markdown
---
title: "{FEATURE_NAME}"
description: "{OVERVIEW_ONE_LINE}"
---

# {FEATURE_NAME}

## 1. OVERVIEW

{OVERVIEW_ONE_LINE}

{OVERVIEW_DETAIL}

---

## 2. CURRENT REALITY

{CURRENT_REALITY_PARAGRAPHS}

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `{IMPLEMENTATION_FILE_1}` | {LAYER_1} | {ROLE_1} |
| `{IMPLEMENTATION_FILE_2}` | {LAYER_2} | {ROLE_2} |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `{TEST_FILE_1}` | {TEST_TYPE_1} | {TEST_ROLE_1} |
| `{TEST_FILE_2}` | {TEST_TYPE_2} | {TEST_ROLE_2} |

---

## 4. SOURCE METADATA

- Group: {CATEGORY_NAME}
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `{CATEGORY_DIR}/{NN}-{feature-name}.md`
```

---

## 6. AUTHORING NOTES

- Add frontmatter to both the root catalog and per-feature files.
- Keep the root catalog readable by summarizing behavior instead of dumping raw source-file tables there.
- Put implementation and test anchor detail in the per-feature files.
- Preserve stable file paths once other docs start linking to them.
- Use numbered all-caps H2 section headers in the root catalog, with `TABLE OF CONTENTS` as the one intentional unnumbered H2.

---

## 7. CHECKLIST

Before publishing a feature catalog, verify:

```markdown
Structure:
- [ ] `FEATURE_CATALOG.md` exists with frontmatter and H1 intro paragraph
- [ ] Root catalog has `## TABLE OF CONTENTS`
- [ ] Root catalog uses numbered all-caps H2 section headers after the TOC
- [ ] Category directories use `NN--category-name`
- [ ] Every root catalog entry links to exactly one per-feature file
- [ ] Every per-feature file includes frontmatter with `title` and `description`

Content:
- [ ] Every root catalog entry has Description, Current Reality, and Source Files callout
- [ ] Every per-feature file has `OVERVIEW`, `CURRENT REALITY`, `SOURCE FILES`, and `SOURCE METADATA`
- [ ] Source-file tables are specific and meaningful
- [ ] Current reality text describes shipped behavior honestly

Validation:
- [ ] Root catalog links resolve locally
- [ ] Count of root entries matches count of per-feature files
- [ ] Other docs link to the root catalog rather than duplicating the inventory
```

---

## 8. RELATED RESOURCES

- [feature_catalog_snippet_template.md](./feature_catalog_snippet_template.md) - Per-feature file template
- [manual_testing_playbook_template.md](../testing_playbook/manual_testing_playbook_template.md) - Parallel pattern for manual validation packages
- [frontmatter_templates.md](../frontmatter_templates.md) - Frontmatter conventions
