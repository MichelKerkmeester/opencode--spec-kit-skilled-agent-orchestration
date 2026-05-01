---
title: "Resource map template"
description: "Optional cross-cutting template that provides a lean, scannable catalog of analyzed, created, updated, or removed paths and wires that surface into the system-spec-kit discovery docs."
---

# Resource map template

## 1. OVERVIEW

`resource-map.md` is the cross-cutting, any-level packet document for recording the file footprint of a packet in one flat, review-friendly place. It complements `implementation-summary.md` by focusing on paths instead of narrative, so reviewers can scan what was analyzed, created, updated, or removed without reconstructing that ledger from prose or git history.

This rollout ties the document into the Level template contract, the skill and references surfaces, the feature catalog, the manual testing playbook, and the spec-doc classification list. That keeps discovery, generation guidance, and memory classification aligned around one optional document.

---

## 2. CURRENT REALITY

Generated packet `resource-map.md` output plus the discovery and classification surfaces that expose it: Level template contract docs, SKILL.md, README.md, references/templates/level_specifications.md, and mcp_server/lib/config/spec-doc-paths.ts.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `resource-map.md` generated in a packet | Packet document | Optional path-ledger document rendered through the Level template contract |
| Level template contract docs | Template guide | Describes when the optional path-ledger document is available |
| `SKILL.md` | Skill | Canonical skill guidance listing the template as optional cross-cutting documentation |
| `README.md` | Guide | Main system-spec-kit README surface describing the template architecture |
| `references/templates/level_specifications.md` | Reference | Level-by-level and cross-cutting template reference for operators |
| `mcp_server/lib/config/spec-doc-paths.ts` | Config | Spec-doc classification set that recognizes `resource-map.md` |
| `feature_catalog/22--context-preservation-and-code-graph/25-resource-map-template.md` | Feature catalog | This feature entry for ongoing discovery |
| `manual_testing_playbook/22--context-preservation-and-code-graph/270-resource-map-template.md` | Playbook | Manual verification scenario for the rollout |

---

## 4. SOURCE METADATA
- Group: Context Preservation And Code Graph
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `22--context-preservation-and-code-graph/25-resource-map-template.md`
