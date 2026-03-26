---
title: Feature Catalog Snippet Template
description: Template for per-feature reference files stored directly under feature_catalog category directories.
---

# Feature Catalog Snippet Template

Per-feature reference files for split feature catalogs. Use this template for the one-file-per-feature contract described in the main feature catalog template.

---

## 1. OVERVIEW

Each feature file is the canonical home for detailed current-reality reference material. The root `FEATURE_CATALOG.md` stays readable by summarizing the feature and linking here, while the per-feature file carries the fuller behavior description, structured source-file references, validation anchors, and concise metadata.

**Required uses**:
- One file per catalog feature
- Frontmatter that mirrors the larger root docs (`title` + `description`)
- Current-reality explanation that stays aligned with the root catalog summary
- Structured source-file and validation references
- Stable file path once published

**Do not use this template for**:
- General reusable prose fragments
- Replacing the root feature catalog
- Splitting one feature across multiple primary files without a clear reason

---

## 2. TEMPLATE SCAFFOLD

Copy this into `feature_catalog/{CATEGORY_DIR}/{NN}-{feature-name}.md`:

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

### Authoring Notes

- Keep the per-feature file aligned with the matching root catalog summary.
- Preserve stable file IDs, category numbering, and slugs once published.
- Put detailed source-file listings here instead of bloating the root catalog.
- If a feature has no implementation yet, say so clearly in `CURRENT REALITY` and `SOURCE FILES`.
