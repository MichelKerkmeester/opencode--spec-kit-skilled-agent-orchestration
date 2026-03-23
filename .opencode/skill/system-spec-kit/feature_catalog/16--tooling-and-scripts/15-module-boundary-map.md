---
title: "Module boundary map"
description: "MODULE_MAP.md documents internal module ownership, dependency directions, feature catalog mapping, and canonical locations for all 28 lib/ subdirectories."
---

# Module boundary map

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

## 1. OVERVIEW

MODULE_MAP.md is the internal ownership and dependency reference for `mcp_server/lib/`. It documents all 28 subdirectories with their purpose, key files, primary consumers, feature catalog cross-references, allowed/forbidden import directions, and canonical file locations.

Created during Phase 15 (Internal Module Boundary Remediation) after discovering that a symlink (`lib/cache/cognitive -> ../cognitive`) masked invisible cross-module dependencies. The map makes module boundaries explicit so that future refactors, dead-code analysis, and dependency enforcement have a single source of truth.

---

## 2. CURRENT REALITY

`MODULE_MAP.md` contains five sections:

1. **Overview** -- purpose and scope
2. **Module Inventory** -- 28 entries with purpose, key files, and primary consumers, including `feedback/` and `spec/`
3. **Feature Catalog Mapping** -- cross-reference between lib/ directories and the 19 feature catalog categories
4. **Dependency Directions** -- allowed/forbidden import directions between module tiers (core, foundation, infrastructure, domain, leaf). Enforcement is deferred (documentation-only; future AST checker planned)
5. **Canonical Locations** -- documents authoritative file locations where modules exist in multiple places (e.g., `lib/cognitive/` is canonical, not `lib/cache/cognitive/`)

The no-symlinks policy is documented in `ARCHITECTURE.md` under "No Symlinks in lib/ Tree".

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/MODULE_MAP.md` | Documentation | Module ownership map, dependency directions, canonical locations |
| `ARCHITECTURE.md` | Documentation | No-symlinks policy and source-dist alignment policy |

### Tests

| File | Focus |
|------|-------|
| _None yet_ | Manual review; future AST-based dependency checker planned |

---

## 4. SOURCE METADATA

- Group: Tooling and scripts
- Source feature title: Module boundary map
- Current reality source: mcp_server/lib/MODULE_MAP.md
