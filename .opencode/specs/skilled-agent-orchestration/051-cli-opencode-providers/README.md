---
title: "Level 1 Templates [template:level_1/README.md]"
description: "Baseline documentation templates for low-risk, small-scope changes."
trigger_phrases:
  - "level 1"
  - "small change"
  - "baseline docs"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "000-feature-name"
    last_updated_at: "2026-04-11T00:00:00Z"
    last_updated_by: "template-author"
    recent_action: "Initialize continuity block"
    next_safe_action: "Replace template defaults on first save"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Level 1 Templates

Use for simple work where full verification/governance overhead is unnecessary.

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. OVERVIEW](#1-overview)
- [2. REQUIRED FILES](#2-required-files)
- [3. OPTIONAL FILES](#3-optional-files)
- [4. QUICK START](#4-quick-start)
- [5. PHASE DECOMPOSITION](#5-phase-decomposition)
- [6. RELATED](#6-related)

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

## 3. OPTIONAL FILES
<!-- ANCHOR:optional-files -->

- `resource-map.md` - lean, scannable catalog of every path analyzed, created, updated, or removed (copy from `../resource-map.md`).

<!-- /ANCHOR:optional-files -->

## 4. QUICK START
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

Resume follow-up work through `/spec_kit:resume`, which rebuilds packet continuity from `handover.md -> _memory.continuity -> spec docs`. Save continuity with `/memory:save`, which routes updates into canonical packet docs such as `implementation-summary.md` and `handover.md`.

<!-- /ANCHOR:quick-start -->

## 5. PHASE DECOMPOSITION
<!-- ANCHOR:phase -->

Phase decomposition is typically not needed at Level 1. Most Level 1 tasks are small enough to complete in a single pass without phased ordering.

If a task unexpectedly grows beyond Level 1 scope, consider escalating to Level 2+ with phase decomposition rather than splitting a Level 1 spec. See the Phase System in the [main templates README](../README.md#phase-system).

<!-- /ANCHOR:phase -->

## 6. RELATED
<!-- ANCHOR:related -->

- `../level_2/README.md`
- `../../references/templates/level_specifications.md`
- `../../references/validation/validation_rules.md`

<!-- /ANCHOR:related -->
