---
title: "Level 1 Templates [template:level_1/README.md]"
description: "Baseline documentation templates for low-risk, small-scope changes."
trigger_phrases:
  - "level 1"
  - "small change"
  - "baseline docs"
importance_tier: "normal"
contextType: "general"
---
# Level 1 Templates

Use for simple work where full verification/governance overhead is unnecessary.

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. OVERVIEW](#1--overview)
- [2. REQUIRED FILES](#2--required-files)
- [3. QUICK START](#3--quick-start)
- [4. PHASE DECOMPOSITION](#4--phase-decomposition)
- [5. RELATED](#5--related)

<!-- /ANCHOR:table-of-contents -->

## 1. OVERVIEW
<!-- ANCHOR:overview -->

- Typical size is under 100 LOC.
- Scope is clear and low risk.
- No architecture decision record needed.

Move to Level 2 when verification checklist tracking is required.

<!-- /ANCHOR:overview -->

## 2. REQUIRED FILES
<!-- ANCHOR:files -->

- `spec.md`
- `plan.md`
- `tasks.md`
- `implementation-summary.md` (required output, finalized after implementation)

<!-- /ANCHOR:files -->

## 3. QUICK START
<!-- ANCHOR:quick-start -->

```bash
mkdir -p specs/###-short-name
cp .opencode/skill/system-spec-kit/templates/level_1/spec.md specs/###-short-name/
cp .opencode/skill/system-spec-kit/templates/level_1/plan.md specs/###-short-name/
cp .opencode/skill/system-spec-kit/templates/level_1/tasks.md specs/###-short-name/
```

At completion, add and fill:

```bash
cp .opencode/skill/system-spec-kit/templates/level_1/implementation-summary.md specs/###-short-name/
```

<!-- /ANCHOR:quick-start -->

## 4. PHASE DECOMPOSITION
<!-- ANCHOR:phase -->

Phase decomposition is typically not needed at Level 1. Most Level 1 tasks are small enough to complete in a single pass without phased ordering.

If a task unexpectedly grows beyond Level 1 scope, consider escalating to Level 2+ with phase decomposition rather than splitting a Level 1 spec. See the Phase System in the [main templates README](../README.md#phase-system).

<!-- /ANCHOR:phase -->

## 5. RELATED
<!-- ANCHOR:related -->

- `../level_2/README.md`
- `../../references/templates/level_specifications.md`
- `../../references/validation/validation_rules.md`

<!-- /ANCHOR:related -->
