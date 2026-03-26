---
title: "Feature catalog code references"
description: "Feature catalog code references embed inline traceability comments in a measured majority of audited non-test TypeScript source files, linking implementation code back to the feature catalog by name. Annotated files declare which catalog features they implement via `// Feature catalog: <feature-name>` comments near the top of the file."
---

# Feature catalog code references

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)
- [5. PLAYBOOK COVERAGE](#5--playbook-coverage)

## 1. OVERVIEW

Feature catalog code references embed inline traceability comments in a measured majority of non-test TypeScript source files, linking implementation code back to the feature catalog by name. Annotated files declare which catalog features they implement via `// Feature catalog: <feature-name>` comments near the top of the file.

This feature works like a label on a warehouse box — instead of tracking items by aisle number (which changes when shelves move), you write the product name directly on the box. Anyone can grep the codebase for a feature name and immediately find many of the annotated files that implement it, without needing to know the folder structure or historical sprint/phase numbering.

---

## 2. CURRENT REALITY

Measured audit coverage at HEAD is approximately 69%: `192` of `280` non-test TypeScript files under `mcp_server/` and `shared/` carry one or more `// Feature catalog: <feature-name>` comments whose name must exactly match an H3 heading in `feature_catalog/FEATURE_CATALOG.md`. Files implementing multiple catalog features list all applicable entries. Some pure utility, type, and barrel-export files are treated as exempt, and the convention is still only partial rather than universal across the live tree.

The `// MODULE: Name` header convention provides a standardized 3-line block at the top of every `.ts` file (separator → module name → separator) using box-drawing characters (`───`) in `mcp_server/` and dashes (`---`) in `shared/` and `scripts/`.

Stale references to "Sprint N", "Phase NNN", or "spec NNN" in non-test comments have been removed and replaced with name-only catalog references. The `verify_alignment_drift.py` script enforces `MODULE:` header presence across all non-test `.ts` files.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/index.ts` | Handler | Representative in-repo handler surface showing `// MODULE:` and `// Feature catalog:` conventions in live code |
| `shared/trigger-extractor.ts` | Shared | Representative shared module carrying a `// Feature catalog:` annotation and `// MODULE:` header |
| `scripts/utils/workspace-identity.ts` | Scripts | Representative script module using the standardized `// MODULE:` header convention |
| `mcp_server/README.md` | Docs | Documents code conventions for `// MODULE:` headers and `// Feature catalog:` annotations |
| `README.md` | Docs | Skill-level component documentation summarizing the traceability convention |

### Verification

| File | Focus |
|------|-------|
| `.opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py` | Enforces `MODULE:` header in first 40 lines of all non-test `.ts` files |

---

## 4. SOURCE METADATA

- Group: Tooling and scripts
- Source feature title: Feature catalog code references
- Current reality source: FEATURE_CATALOG.md

---

## 5. PLAYBOOK COVERAGE

- Mapped to manual testing playbook scenarios 135, 136, 137, 138
