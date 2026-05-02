---
title: "Validation Rules"
description: "Shell rule modules that validate spec folder structure, metadata and documentation state."
trigger_phrases:
  - "validation rules"
  - "check spec folder"
  - "spec validation scripts"
---

# Validation Rules

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. ARCHITECTURE](#2--architecture)
- [3. DIRECTORY TREE](#3--directory-tree)
- [4. KEY FILES](#4--key-files)
- [5. BOUNDARIES AND FLOW](#5--boundaries-and-flow)
- [6. ENTRYPOINTS](#6--entrypoints)
- [7. VALIDATION](#7--validation)
- [8. RELATED](#8--related)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`scripts/rules/` owns the shell modules used by `scripts/spec/validate.sh`. Each rule reports through the shared `run_check()` interface and sets `RULE_*` variables that the validator reads.

Current state:

- Rule metadata and dispatch order come from `scripts/lib/validator-registry.json`.
- Authored rules validate packet files, template markers, anchors, sections and metadata.
- Runtime rules validate generated artifacts, save contracts, link scans and continuity support files.
- Shell modules stay small and defer shared logic to `scripts/lib/` when possible.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:architecture -->
## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                         scripts/rules                            │
╰──────────────────────────────────────────────────────────────────╯

┌──────────────┐      ┌──────────────────┐      ┌──────────────────┐
│ validate.sh  │ ───▶ │ registry metadata│ ───▶ │ check-*.sh rules │
└──────┬───────┘      └────────┬─────────┘      └────────┬─────────┘
       │                       │                         │
       │                       ▼                         ▼
       │              ┌──────────────────┐      ┌──────────────────┐
       └──────────▶   │ scripts/lib/*    │ ◀─── │ RULE_* variables │
                      └────────┬─────────┘      └──────────────────┘
                               │
                               ▼
                      ┌──────────────────┐
                      │ validator output │
                      └──────────────────┘

Dependency direction: validate.sh ───▶ registry ───▶ rules ───▶ scripts/lib
```

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:directory-tree -->
## 3. DIRECTORY TREE

```text
rules/
+-- check-files.sh              # Required file checks by level
+-- check-sections.sh           # Required section checks
+-- check-template-source.sh    # Template source marker checks
+-- check-template-headers.sh   # Template header checks
+-- check-canonical-save.sh     # Save-time contract checks
+-- check-canonical-save-helper.cjs
+-- check-graph-metadata.sh     # Graph metadata checks
+-- check-links.sh              # Optional cross-skill link scan
+-- check-phase-links.sh        # Parent and child phase references
+-- check-phase-parent-content.sh
+-- check-*.sh                  # Additional focused rule modules
`-- README.md
```

The full rule list is the set of `check-*.sh` files in this directory plus `check-canonical-save-helper.cjs` for canonical-save support.

<!-- /ANCHOR:directory-tree -->

---

<!-- ANCHOR:key-files -->
## 4. KEY FILES

| File | Responsibility |
|---|---|
| `check-files.sh` | Confirms required packet files for the declared level. |
| `check-level-match.sh` | Compares declared level with required-file state. |
| `check-template-source.sh` | Verifies template-source metadata markers. |
| `check-template-headers.sh` | Verifies template header contracts. |
| `check-canonical-save.sh` | Checks canonical save artifacts and lineage data. |
| `check-links.sh` | Runs optional markdown link validation when enabled. |
| `check-phase-parent-content.sh` | Checks phase-parent content boundaries. |

<!-- /ANCHOR:key-files -->

---

<!-- ANCHOR:boundaries-flow -->
## 5. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Source shared shell helpers from `scripts/lib/`. |
| Registry | Add or change public rule metadata in `scripts/lib/validator-registry.json`. |
| Ownership | Keep rule-specific checks in `check-*.sh`. Keep orchestration in `scripts/spec/validate.sh`. |
| Output | Set `RULE_NAME`, `RULE_STATUS`, `RULE_MESSAGE`, `RULE_DETAILS` and `RULE_REMEDIATION`. |

Main flow:

```text
╭──────────────────────────────────────────╮
│ Developer runs validate.sh               │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ Validator reads registry metadata        │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ Rule module run_check() executes         │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ RULE_* result fields are collected       │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ Validator prints text or JSON output     │
╰──────────────────────────────────────────╯
```

<!-- /ANCHOR:boundaries-flow -->

---

<!-- ANCHOR:entrypoints -->
## 6. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `scripts/spec/validate.sh` | Shell command | Runs registered rule checks for a spec folder. |
| `run_check()` | Shell function | Executes one rule module against a target packet. |
| `scripts/lib/validator-registry.json` | Registry | Defines rule aliases, severity and dispatch metadata. |

<!-- /ANCHOR:entrypoints -->

---

<!-- ANCHOR:validation -->
## 7. VALIDATION

Run from the repository root:

```bash
.opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/051-readme-code-template --strict
python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/scripts/rules/README.md
```

Expected result: spec validation passes or reports only accepted packet warnings, and README validation exits `0` with no HVR violations.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 8. RELATED

- [Validator command](../spec/validate.sh)
- [Validator registry](../lib/validator-registry.json)
- [System Spec Kit skill](../../SKILL.md)
- [Spec templates](../../templates/README.md)

<!-- /ANCHOR:related -->
