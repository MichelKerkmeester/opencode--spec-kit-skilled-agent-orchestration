---
title: "Context Index [template:context-index.md]"
description: "Optional migration bridge for phase parents that have been reorganized, renumbered, or consolidated after earlier phase planning."
trigger_phrases:
  - "context index"
  - "phase migration bridge"
  - "phase reorganization"
  - "phase renumbering"
importance_tier: "normal"
contextType: "general"
---
# Context Index

<!-- SPECKIT_TEMPLATE_SOURCE: context-index | v1.0 -->

---

<!-- ANCHOR:when-to-use -->
## WHEN TO USE THIS TEMPLATE

Use this file only when a phase parent has been reorganized after earlier work existed: phase renames, gap renumbers, splits, joins, or archival moves.

Do not auto-scaffold this template for new phase parents. A clean phase parent should stay on the lean trio: `spec.md`, `description.json`, and `graph-metadata.json`.

Keep this file optional and brief. It is a navigation bridge for humans and resume tools, not a second parent plan.
<!-- /ANCHOR:when-to-use -->

---

<!-- ANCHOR:migration-bridge -->
## Migration Bridge

| Original Phase | New Home | Status | Notes |
|----------------|----------|--------|-------|
| [YOUR_VALUE_HERE: original folder or label] | [YOUR_VALUE_HERE: new folder/path] | [YOUR_VALUE_HERE: active/archive/replaced] | [YOUR_VALUE_HERE: short note] |
<!-- /ANCHOR:migration-bridge -->

---

<!-- ANCHOR:author-instructions -->
## Author Instructions

- Keep rows scoped to phase-folder movement or identity changes.
- Use repo-relative paths in `New Home`.
- Prefer one row per original phase.
- Leave detailed rationale in child `decision-record.md` or `implementation-summary.md`.
- Remove this file when the bridge no longer helps navigation.
<!-- /ANCHOR:author-instructions -->
