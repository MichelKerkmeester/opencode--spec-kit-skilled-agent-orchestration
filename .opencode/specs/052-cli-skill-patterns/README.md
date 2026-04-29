---
title: "Level 2 Templates [template:level_2/README.md]"
description: "Verification-focused templates for medium complexity changes."
trigger_phrases:
  - "level 2"
  - "checklist"
  - "verification"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/templates/level_2"
    last_updated_at: "2026-04-11T00:00:00Z"
    last_updated_by: "template-author"
    recent_action: "Initialized Level 2 template"
    next_safe_action: "Replace continuity placeholders"
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
# Level 2 Templates

Use for medium-scope work that needs explicit validation.

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. OVERVIEW](#1-overview)
- [2. REQUIRED FILES](#2-required-files)
- [3. OPTIONAL FILES](#3-optional-files)
- [4. LEVEL 2 ADDITIONS](#4-level-2-additions)
- [5. QUICK START](#5-quick-start)
- [6. WORKFLOW NOTES](#6-workflow-notes)
- [7. PHASE DECOMPOSITION](#7-phase-decomposition)
- [8. RELATED](#8-related)

<!-- /ANCHOR:table-of-contents -->

## 1. OVERVIEW
<!-- ANCHOR:overview -->

- Typical size is 100-499 LOC.
- Quality gates and edge-case tracking are required.
- Non-functional requirements must be documented.

Escalate to Level 3 for architecture-heavy decisions.

<!-- /ANCHOR:overview -->

## 2. REQUIRED FILES
<!-- ANCHOR:files -->

- `spec.md`
- `plan.md`
- `tasks.md`
- `checklist.md`
- `implementation-summary.md`

<!-- /ANCHOR:files -->

## 3. OPTIONAL FILES
<!-- ANCHOR:optional-files -->

- `resource-map.md` - lean, scannable catalog of every path analyzed, created, updated, or removed (copy from `../resource-map.md`).

<!-- /ANCHOR:optional-files -->

## 4. LEVEL 2 ADDITIONS
<!-- ANCHOR:additions -->

- Verification-first `checklist.md` with P0/P1/P2 priorities.
- NFR and edge-case sections in `spec.md`.
- Stronger execution and rollback detail in `plan.md`.

<!-- /ANCHOR:additions -->

## 5. QUICK START
<!-- ANCHOR:quick-start -->

### Primary Path — Canonical Intake

Use `/spec_kit:plan --intake-only` to run the shared intake contract. It classifies the folder, emits the canonical trio (`spec.md` + `description.json` + `graph-metadata.json`) atomically, and auto-detects the appropriate Level from scope signals. Override detection with `--level=2` when you know the level up front.

```text
/spec_kit:plan --intake-only --level=2
```

The intake contract ([`../../references/intake-contract.md`](../../references/intake-contract.md)) handles folder classification, trio publication, graph-metadata scaffolding, and continuity initialization — none of which the manual copy path performs.

### Manual Fallback (Advanced)

Only use direct template copy when the canonical intake is unavailable or when explicitly repairing an existing packet. This path bypasses automated metadata generation, so you must backfill `description.json` and `graph-metadata.json` manually (see `scripts/memory/generate-description.js` and the graph-metadata backfill).

```bash
mkdir -p specs/###-feature-name
cp .opencode/skill/system-spec-kit/templates/level_2/*.md specs/###-feature-name/
bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/###-feature-name/
```

<!-- /ANCHOR:quick-start -->

## 6. WORKFLOW NOTES
<!-- ANCHOR:workflow-notes -->

- Keep checklist current during implementation.
- Completion checks run in priority order: P0, then P1, then P2.
- `implementation-summary.md` is finalized after implementation work.
- Resume active packet work through `/spec_kit:resume`, which rebuilds continuity from `handover.md -> _memory.continuity -> spec docs`.
- Save continuity with `/memory:save`, which routes updates into canonical packet docs such as `implementation-summary.md`, `decision-record.md`, and `handover.md` when those surfaces apply.

<!-- /ANCHOR:workflow-notes -->

## 7. PHASE DECOMPOSITION
<!-- ANCHOR:phase -->

Consider phase decomposition for multi-sprint Level 2 tasks where work naturally divides into ordered stages. Use Gate 3 Option E to target a specific phase child and `/spec_kit:plan :with-phases` to create the phase structure. If that target phase packet is still `no-spec`, `partial-folder`, `repair-mode`, or `placeholder-upgrade`, `/spec_kit:plan` delegates to the shared intake contract in [`../../references/intake-contract.md`](../../references/intake-contract.md) before phase setup continues.

See the Phase System in the [main templates README](../README.md#phase-system) for full details.

<!-- /ANCHOR:phase -->

## 8. RELATED
<!-- ANCHOR:related -->

- `../level_1/README.md`
- `../level_3/README.md`
- `../addendum/level2-verify/`
- `../../references/validation/validation_rules.md`

<!-- /ANCHOR:related -->
