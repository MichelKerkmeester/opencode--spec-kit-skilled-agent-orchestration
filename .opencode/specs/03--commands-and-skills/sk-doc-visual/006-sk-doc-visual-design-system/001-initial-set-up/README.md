---
title: "Level 3 Templates [template:level_3/README.md]"
description: "Architecture-oriented templates for large or high-risk implementation work."
trigger_phrases:
  - "level 3"
  - "architecture"
  - "decision record"
importance_tier: "normal"
contextType: "general"
---
# Level 3 Templates

Use when implementation needs explicit architecture and risk management.

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. OVERVIEW](#1--overview)
- [2. REQUIRED FILES](#2--required-files)
- [3. LEVEL 3 ADDITIONS](#3--level-3-additions)
- [4. QUICK START](#4--quick-start)
- [5. WORKFLOW NOTES](#5--workflow-notes)
- [6. PHASE DECOMPOSITION](#6--phase-decomposition)
- [7. RELATED](#7--related)

<!-- /ANCHOR:table-of-contents -->

## 1. OVERVIEW
<!-- ANCHOR:overview -->

- Typical size is 500+ LOC.
- Architecture decisions need durable records.
- Risk, dependencies, and stakeholder alignment are central.

Use Level 3+ if governance and formal approvals are required.

<!-- /ANCHOR:overview -->

## 2. REQUIRED FILES
<!-- ANCHOR:files -->

- `spec.md`
- `plan.md`
- `tasks.md`
- `checklist.md`
- `decision-record.md`
- `implementation-summary.md`

<!-- /ANCHOR:files -->

## 3. LEVEL 3 ADDITIONS
<!-- ANCHOR:additions -->

- Architecture-focused sections in spec and plan templates.
- Risk/dependency/critical-path detail for execution control.
- `decision-record.md` for major technical decisions.

<!-- /ANCHOR:additions -->

## 4. QUICK START
<!-- ANCHOR:quick-start -->

```bash
mkdir -p specs/###-feature-name
cp .opencode/skill/system-spec-kit/templates/level_3/*.md specs/###-feature-name/
bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/###-feature-name/
```

<!-- /ANCHOR:quick-start -->

## 5. WORKFLOW NOTES
<!-- ANCHOR:workflow-notes -->

- Keep `decision-record.md` updated as decisions are made.
- Keep checklist evidence current before completion claims.
- Finalize `implementation-summary.md` at the end of delivery.

<!-- /ANCHOR:workflow-notes -->

## 6. PHASE DECOMPOSITION
<!-- ANCHOR:phase -->

Phase decomposition is recommended for Level 3 tasks exceeding 500 LOC across multiple subsystems. Breaking large architectural work into ordered phases improves delivery control and risk management. Use Gate 3 Option E to target a specific phase child and `/spec_kit:phase` to create the phase structure.

See the Phase System in the [main templates README](../README.md#phase-system) for full details.

<!-- /ANCHOR:phase -->

## 7. RELATED
<!-- ANCHOR:related -->

- `../level_2/README.md`
- `../level_3+/README.md`
- `../addendum/level3-arch/`
- `../../references/templates/level_specifications.md`

<!-- /ANCHOR:related -->
