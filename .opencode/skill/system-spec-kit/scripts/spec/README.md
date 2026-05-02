---
title: "Spec Scripts"
description: "Spec lifecycle scripts for create, upgrade, placeholder cleanup, validation, and completion checks."
trigger_phrases:
  - "spec scripts"
  - "upgrade spec level"
  - "validate spec folder"
  - "check placeholders"
---


# Spec Scripts

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1-overview)
- [2. CURRENT INVENTORY](#2-current-inventory)
- [3. UPGRADE FLOW (SPEC124/128/129/136-139)](#3-upgrade-flow-spec124128129136-139)
- [4. COMPLETION GATE](#4-completion-gate)
- [5. NOTES](#5-notes)

<!-- /ANCHOR:table-of-contents -->
<!-- ANCHOR:overview -->
## 1. OVERVIEW

The `scripts/spec/` directory is the shell-based spec lifecycle layer.
Under Gate E, these scripts validate and evolve the canonical packet docs that `/spec_kit:resume` restores through `handover.md` -> `_memory.continuity` -> spec docs. Generated memory artifacts remain supporting only.

### Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                    SPEC LIFECYCLE ARCHITECTURE                        │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│                           ┌─────────────┐                           │
│                           │ create.sh   │                           │
│                           │ (scaffold)  │                           │
│                           └──────┬──────┘                           │
│                                  │                                   │
│    ┌──────────┐    ┌─────────────▼─────────────┐    ┌──────────┐   │
│    │AI agent  │───▶│    upgrade-level.sh      │───▶│ validate │   │
│    │populates │    │    (inject sections)      │    │ .sh      │   │
│    │spec docs │    └───────────────────────────┘    │ (rules/) │   │
│    └──────────┘                                     └────┬─────┘   │
│                                  ┌────────────────────────▼───────┐ │
│                                  │       check-placeholders.sh    │ │
│                                  │       (verify clean)           │ │
│                                  └───────────────┬────────────────┘ │
│                                                  │                  │
│  ┌───────────────────────────────────────────────▼───────────────┐ │
│  │                    QUALITY GATES                              │ │
│  │  ┌─────────────────┐  ┌──────────────────┐  ┌──────────────┐ │ │
│  │  │ validate.sh     │  │ check-           │  │ calculate-   │ │ │
│  │  │ (modular rules) │  │ completion.sh    │  │ completeness │ │ │
│  │  └─────────────────┘  │ (gate-enforce)   │  │ .sh (metrics)│ │ │
│  │                       └──────────────────┘  └──────────────┘ │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │               SUPPORTING SCRIPTS                                 ││
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          ││
│  │  │archive.sh    │  │recommend-    │  │progressive-  │          ││
│  │  │(stale specs) │  │ level.sh     │  │ validate.sh  │          ││
│  │  └──────────────┘  │(auto-detect) │  │(4-stage pipe)│          ││
│  │                    └──────────────┘  └──────────────┘          ││
│  └─────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │                   INPUTS                                        ││
│  │ ┌──────────┐ ┌──────────┐ ┌──────────────┐ ┌────────────────┐  ││
│  │ │rules/    │ │templates/│ │ spec-kit-    │ │ spec folder    │  ││
│  │ │check-*.sh│ │manifest/ │ │ docs.json    │ │ (target path)  │  ││
│  │ └──────────┘ └──────────┘ └──────────────┘ └────────────────┘  ││
│  └─────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  Phase support: create.sh --phase + validate.sh --recursive         │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### Directory Tree

```
scripts/spec/
├── create.sh                      # Scaffold new spec folders from templates (--level, --phase)
├── upgrade-level.sh               # Upgrade spec folder to Level 2/3/3+ (--dry-run, --keep-backups)
├── check-placeholders.sh          # Detect unresolved [PLACEHOLDER] markers
├── validate.sh                    # Orchestrate modular validation rules (--strict, --recursive)
├── progressive-validate.sh        # 4-stage validation pipeline (detect → auto-fix → suggest → report)
├── test-validation.sh             # Validation orchestration behavior helper
├── check-completion.sh            # Enforce Gate: checklist.md all verified
├── calculate-completeness.sh      # Compute checklist completion metrics
├── recommend-level.sh             # Auto-recommend Level from task signals
├── archive.sh                     # Archive completed or stale spec folders
└── README.md
```

<!-- /ANCHOR:overview -->
<!-- ANCHOR:current-inventory -->
## 2. CURRENT INVENTORY


- `create.sh` - create new spec folders from templates
- `upgrade-level.sh` - upgrade existing folders to `2`, `3`, or `3+`
- `check-placeholders.sh` - detect unresolved bracket placeholders after upgrades
- `validate.sh` - orchestrate modular validation rules
- `test-validation.sh` - validation helper script for spec rule orchestration behavior
- `check-completion.sh` - enforce completion gate before claiming done
- `calculate-completeness.sh` - compute checklist completion metrics
- `recommend-level.sh` - recommend level from task signals
- `archive.sh` - archive completed or stale specs
- `progressive-validate.sh` - progressive 4-level validation pipeline (detect, auto-fix, suggest, report)


<!-- /ANCHOR:current-inventory -->
<!-- ANCHOR:upgrade-flow-spec124128129136-139 -->
## 3. UPGRADE FLOW (SPEC124/128/129/136-139)


Canonical flow for upgrades:

```bash
# 1) Upgrade target level
bash .opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh specs/<###-spec-name> --to 3

# 2) AI auto-populate injected placeholder sections from existing spec context

# 3) Verify no placeholders remain
bash .opencode/skill/system-spec-kit/scripts/spec/check-placeholders.sh specs/<###-spec-name>

# 4) Run full validation (includes anchor checks)
bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/<###-spec-name>
```

`validate.sh` executes modular rules in `scripts/rules/`, including `check-anchors.sh` for ANCHOR tag pairing.


Phase-based spec folders (specs 136-139 and later) use `--phase` with `create.sh` and `--recursive` with `validate.sh`:

```bash
# Create a phase child folder inside an existing spec
bash .opencode/skill/system-spec-kit/scripts/spec/create.sh --phase specs/<###-parent-spec>/<###-phase-child>

# Validate a phase parent and all its children recursively
bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/<###-parent-spec> --recursive
```

<!-- /ANCHOR:upgrade-flow-spec124128129136-139 -->
<!-- ANCHOR:completion-gate -->
## 4. COMPLETION GATE


Before completion claims:

```bash
bash .opencode/skill/system-spec-kit/scripts/spec/check-completion.sh specs/<###-spec-name>
```


<!-- /ANCHOR:completion-gate -->
<!-- ANCHOR:notes -->
## 5. NOTES


- `upgrade-level.sh` supports `--dry-run`, `--json`, `--verbose`, and `--keep-backups`.
- `create.sh` supports `--subfolder` for subfolder-based work inside an existing spec folder.
- `create.sh` supports `--phase` to create a numbered phase child folder inside a parent spec (e.g., `001-phase-name/`).
- `validate.sh` supports `--recursive` to validate a parent spec folder and all its phase children in one pass.
- `validate.sh` supports emergency bypass via `SPECKIT_SKIP_VALIDATION=1`.
- `create.sh` auto-generates `description.json` in each created folder (normal mode, phase parent, and phase children) via `generate-description.js`. Generation failures are non-fatal — a warning is printed and creation continues.
<!-- /ANCHOR:notes -->
