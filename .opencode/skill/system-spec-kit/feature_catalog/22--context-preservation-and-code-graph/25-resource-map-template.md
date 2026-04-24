---
title: "Resource map template"
description: "Optional cross-cutting template that provides a lean, scannable catalog of analyzed, created, updated, or removed paths and wires that surface into the system-spec-kit discovery docs."
audited_post_018: true
---

# Resource map template

## 1. OVERVIEW

`templates/resource-map.md` is the cross-cutting, any-level template for recording the file footprint of a packet in one flat, review-friendly place. It complements `implementation-summary.md` by focusing on paths instead of narrative, so reviewers can scan what was analyzed, created, updated, or removed without reconstructing that ledger from prose or git history.

This rollout ties the template into the main template README, every level README, the skill and references surfaces, the feature catalog, the manual testing playbook, and the spec-doc classification list. That keeps discovery, copy guidance, and memory classification aligned around one optional template.

---

## 2. CURRENT REALITY

templates/resource-map.md plus the discovery and classification surfaces that expose it: templates/README.md, templates/level_1/README.md, templates/level_2/README.md, templates/level_3/README.md, templates/level_3+/README.md, SKILL.md, README.md, references/templates/level_specifications.md, mcp_server/lib/config/spec-doc-paths.ts

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `templates/resource-map.md` | Template | Canonical optional path-ledger template |
| `templates/README.md` | Template index | Main template architecture surface listing the cross-cutting template |
| `templates/level_1/README.md` | Template guide | Level 1 optional-files surface for copying the template |
| `templates/level_2/README.md` | Template guide | Level 2 optional-files surface for copying the template |
| `templates/level_3/README.md` | Template guide | Level 3 optional-files surface for copying the template |
| `templates/level_3+/README.md` | Template guide | Level 3+ optional-files surface for copying the template |
| `SKILL.md` | Skill | Canonical skill guidance listing the template as optional cross-cutting documentation |
| `README.md` | Guide | Main system-spec-kit README surface describing the template architecture |
| `references/templates/level_specifications.md` | Reference | Level-by-level and cross-cutting template reference for operators |
| `mcp_server/lib/config/spec-doc-paths.ts` | Config | Spec-doc classification set that recognizes `resource-map.md` |
| `feature_catalog/22--context-preservation-and-code-graph/25-resource-map-template.md` | Feature catalog | This feature entry for ongoing discovery |
| `manual_testing_playbook/22--context-preservation-and-code-graph/270-resource-map-template.md` | Playbook | Manual verification scenario for the rollout |

---

## 4. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Source feature title: Resource map template
- Current reality source: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-resource-map-template/`
