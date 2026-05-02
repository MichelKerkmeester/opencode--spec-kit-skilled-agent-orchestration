---
title: README Template and Selection Guide
description: Concise guidance for project, skill, feature and component README files, with routing to the code-folder README template when developer topology is the main need.
---

# README Template and Selection Guide

Use this template for project, skill, feature and component READMEs. Use [`readme_code_template.md`](./readme_code_template.md) for source-folder READMEs that explain package topology, files, boundaries and data or control flow.

---

## 1. README SELECTION

README files answer two questions: what is this, and how does someone use or navigate it?

| Type | Use When | Template |
|---|---|---|
| Project | The repository or package needs a public entry point | This file |
| Skill | A skill needs human-facing context beyond `SKILL.md` | This file |
| Feature | A user-facing feature needs setup, usage or behavior notes | This file |
| Component | A reusable module has an API, examples or configuration | This file, trimmed |
| Code Folder | A source directory needs developer orientation | [`readme_code_template.md`](./readme_code_template.md) |

Create a README when someone can land in the folder and need orientation. Skip it when inline comments or a nearby parent README already explain the folder.

```text
Is this a project, package, skill or feature root?
+-- Yes: write a general README.
`-- No: is this source-code orientation?
    +-- Yes: use readme_code_template.md.
    `-- No: write a focused README only if readers need setup, usage or navigation help.
```

Keep READMEs current-state only. Do not cite spec packet numbers, phase IDs or migration history. Use feature names, file paths, commands and stable source links.

---

## 2. GENERAL STRUCTURE

Use only the sections that fit the audience. Project and skill READMEs often need most sections. Feature and component READMEs should stay shorter.

| Section | Include When | Content |
|---|---|---|
| Overview | Always | Purpose, audience, main value and prerequisites |
| Key Statistics | Useful facts help readers decide scope | Counts, version, supported modes, limits |
| How This Compares | Readers may confuse this with nearby tools | Short comparison table |
| Quick Start | Readers need to run or try something | Short setup, verification and first use |
| Features | Capabilities need explanation | Feature groups, behavior notes and examples |
| Requirements | Runtime, tool or service needs exist | Minimum versions, permissions and external services |
| Structure | Navigation matters | Directory tree and key files |
| Configuration | Settings exist | Config files, options, defaults and env vars |
| Usage Examples | Patterns are easier shown than described | Simple and advanced examples with expected results |
| Troubleshooting | Users can hit known issues | What they see, cause and fix |
| FAQ | Repeated questions exist | Short answers only |
| Related Resources | Always when links exist | Grouped skills, documents, commands or external references |

Code-folder READMEs are different. Do not force Quick Start, Features, FAQ or Troubleshooting unless the directory has runnable commands or known reader problems. Use [`readme_code_template.md`](./readme_code_template.md).

---

## 3. SKILL AND PROJECT PROFILE

Use this profile for OpenCode skills, package roots and project-level READMEs that need more than a bare overview.

| Profile Block | Good For | Keep It Short By |
|---|---|---|
| `trigger_phrases` | Search, memory and skill routing | 3-8 concrete phrases |
| Table of contents | READMEs longer than 150 lines | Link only top-level sections |
| Key Statistics | Skill counts, tool counts, version facts | Use one compact table |
| How This Compares | Neighboring skills or tools | Compare only reader-relevant differences |
| Key Features | Current capability inventory | Group related features |
| Requirements | Tooling and runtime needs | Separate required from optional |
| Related Skills | Skill graph navigation | Group by relationship type |
| Related Documents | Operator or developer references | Link stable docs, not packet history |
| FAQ | Repeated questions | 3-6 high-value Q&A pairs |

Optional HTML anchors help memory and extraction tools find stable sections. Use them only around long-lived sections.

```markdown
<!-- ANCHOR:overview -->
## 1. OVERVIEW

[Section content]

<!-- /ANCHOR:overview -->
```

---

## 4. WRITING RULES

Write for scanning first.

- Lead with what the thing does.
- Put the fastest useful path before detailed reference.
- Use tables for options, file lists and comparisons.
- Use fenced code blocks with language tags.
- Test commands before documenting them.
- Show expected output for verification commands.
- Use relative links for local docs.
- Remove unused sections instead of leaving placeholders.

Voice by README type:

| Type | Voice |
|---|---|
| Project, Skill, Feature | Plain explanation first, reference detail later |
| Component | Technical and concise |
| Code Folder | Technical and concise, via `readme_code_template.md` |

Human Voice Rules apply to all README content:

- No em dashes. Use commas, periods or colons.
- No semicolons. Split the sentence or use "and".
- No Oxford comma in inline lists.
- No setup phrases.
- No banned words from the HVR reference.
- Prefer active voice and direct verbs.

Full reference: [`hvr_rules.md`](../../references/global/hvr_rules.md).

---

## 5. FRONTMATTER

Frontmatter is optional for normal project READMEs and recommended for skill or system documentation that should be discoverable.

```yaml
---
title: "[DOCUMENT_TITLE]"
description: "[One-sentence description]"
trigger_phrases:
  - "[search phrase]"
  - "[routing phrase]"
---
```

Use frontmatter when it improves routing, search or maintenance. Omit it for small human-only documents.

---

## 6. FILLABLE SCAFFOLD

Copy this scaffold, then remove sections that do not apply.

````markdown
---
title: "[PROJECT_OR_FEATURE_NAME]"
description: "[One-sentence description]"
trigger_phrases:
  - "[search phrase]"
---

# [PROJECT_OR_FEATURE_NAME]

> [One-sentence purpose statement.]

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1-overview)
- [2. QUICK START](#2-quick-start)
- [3. FEATURES](#3-features)
- [4. REQUIREMENTS](#4-requirements)
- [5. STRUCTURE](#5-structure)
- [6. CONFIGURATION](#6-configuration)
- [7. USAGE EXAMPLES](#7-usage-examples)
- [8. TROUBLESHOOTING](#8-troubleshooting)
- [9. FAQ](#9-faq)
- [10. RELATED RESOURCES](#10-related-resources)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

[Explain what this is, who it is for and why it exists.]

### Key Statistics

| Metric | Value |
|---|---|
| Status | [Current state] |
| Version | [Version or release channel] |
| Main audience | [Who uses this] |
| Operating modes | [Mode count or short list] |

### How This Compares

| Capability | This Project | Related Option |
|---|---|---|
| [Capability] | [Current behavior] | [Difference] |

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:quick-start -->
## 2. QUICK START

```bash
# Install or prepare
[command]

# Verify
[command]
```

Expected result: [what success looks like].

<!-- /ANCHOR:quick-start -->

---

<!-- ANCHOR:features -->
## 3. FEATURES

### Key Features

| Feature | What It Does |
|---|---|
| [Feature] | [Current behavior] |

<!-- /ANCHOR:features -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| Requirement | Minimum | Notes |
|---|---|---|
| [Runtime or tool] | [Version] | [Why it is needed] |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:structure -->
## 5. STRUCTURE

```text
[root]/
+-- [path]/        # [Purpose]
`-- [file]         # [Purpose]
```

| Path | Purpose |
|---|---|
| `[path]` | [Role] |

<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:configuration -->
## 6. CONFIGURATION

| Option | Default | Purpose |
|---|---|---|
| `[OPTION]` | `[value]` | [What it controls] |

<!-- /ANCHOR:configuration -->

---

<!-- ANCHOR:usage-examples -->
## 7. USAGE EXAMPLES

```bash
[command]
```

Result: [expected output or behavior].

<!-- /ANCHOR:usage-examples -->

---

<!-- ANCHOR:troubleshooting -->
## 8. TROUBLESHOOTING

| What You See | Cause | Fix |
|---|---|---|
| [Symptom] | [Cause] | [Action] |

<!-- /ANCHOR:troubleshooting -->

---

<!-- ANCHOR:faq -->
## 9. FAQ

**Q: [Question readers ask often]?**

A: [Short answer with a link when useful.]

<!-- /ANCHOR:faq -->

---

<!-- ANCHOR:related-resources -->
## 10. RELATED RESOURCES

### Related Skills

| Skill | Relationship | Use When |
|---|---|---|
| [`[skill-name]`](../skill-name/SKILL.md) | [Sibling or dependency] | [When to use it] |

### Related Documents

| Document | Purpose |
|---|---|
| [`[Document]`](./path/to/doc.md) | [Why it matters] |

<!-- /ANCHOR:related-resources -->
````

---

## 7. VALIDATION CHECKLIST

- [ ] README type is correct. Code folders use `readme_code_template.md`.
- [ ] Included sections match the audience and task.
- [ ] No empty sections remain.
- [ ] Commands were tested or marked as examples.
- [ ] Links use correct relative paths.
- [ ] Frontmatter is valid if present.
- [ ] Optional anchors wrap only stable sections.
- [ ] HVR passes: no em dashes, semicolons, banned words or setup phrases.

---

## 8. RELATED RESOURCES

- [`readme_code_template.md`](./readme_code_template.md) - Code-folder README scaffold.
- [`readme_creation.md`](../../references/specific/readme_creation.md) - README workflow and quality criteria.
- [`core_standards.md`](../../references/global/core_standards.md) - Markdown formatting rules.
- [`validation.md`](../../references/global/validation.md) - Document validation and DQI scoring.
- [`hvr_rules.md`](../../references/global/hvr_rules.md) - Human Voice Rules.
