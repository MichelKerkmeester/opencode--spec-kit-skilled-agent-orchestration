---
title: "Specification: Workflows-Code Reference QA [002-reference-structure-qa/spec]"
description: "Quality assurance pass on the recently standardized workflows-code skill reference files. The previous task involved adding standard \"Overview\" sections and renumbering all subs..."
trigger_phrases:
  - "specification"
  - "workflows"
  - "code"
  - "reference"
  - "spec"
  - "021"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 2 -->

<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# Specification: Workflows-Code Reference QA

<!-- ANCHOR:executive-summary -->
## 1. Overview
Quality assurance pass on the recently standardized `workflows-code` skill reference files. The previous task involved adding standard "Overview" sections and renumbering all subsequent sections across 13 markdown files. This task validates the integrity of those changes, specifically focusing on broken internal links and proper formatting.

<!-- /ANCHOR:executive-summary -->

<!-- ANCHOR:requirements -->
## 2. Goals
- **Link Verification:** Identify and fix any internal markdown links (e.g., `[See Section 1](#1-...)`) that broke due to section renumbering (e.g., Section 1 became Section 2).
- **Formatting Check:** Ensure `debugging_workflows.md` does not have duplicate "Core Principle" sections.
- **Structure Verification:** Validate that the `## 1. 📋 OVERVIEW` pattern is correctly applied with no stray text above it.

<!-- /ANCHOR:requirements -->

<!-- ANCHOR:scope -->
## 3. Scope
- **Target Files:** All 13 files in `.opencode/skills/workflows-code/references/`.
- **Target Issues:** Broken internal links, duplicate content, formatting anomalies.

<!-- /ANCHOR:scope -->

<!-- ANCHOR:success-criteria -->
## 4. Success Criteria
- All internal section links in the target files point to the correct (renumbered) sections.
- `debugging_workflows.md` is free of duplicate content.
- All files start cleanly with the Overview section.
- A report of fixes applied is generated.

<!-- /ANCHOR:success-criteria -->
