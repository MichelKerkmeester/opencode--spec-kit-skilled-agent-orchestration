---
title: "Level 3 Templates [template:level_3/README.md]"
description: "Architecture-oriented templates for large or high-risk implementation work."
trigger_phrases:
  - "level 3"
  - "architecture"
  - "decision record"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/templates/level_3"
    last_updated_at: "2026-04-11T00:00:00Z"
    last_updated_by: "template-author"
    recent_action: "Initialized Level 3 template"
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
# Level 3 Templates

Use when implementation needs explicit architecture and risk management.

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. OVERVIEW](#1--overview)
- [2. REQUIRED FILES](#2--required-files)
- [3. OPTIONAL FILES](#3--optional-files)
- [4. LEVEL 3 ADDITIONS](#4--level-3-additions)
- [5. QUICK START](#5--quick-start)
- [6. WORKFLOW NOTES](#6--workflow-notes)
- [7. PHASE DECOMPOSITION](#7--phase-decomposition)
- [8. RELATED](#8--related)

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

## 3. OPTIONAL FILES
<!-- ANCHOR:optional-files -->

- `resource-map.md` - lean, scannable catalog of every path analyzed, created, updated, or removed (copy from `../resource-map.md`).

<!-- /ANCHOR:optional-files -->

## 4. LEVEL 3 ADDITIONS
<!-- ANCHOR:additions -->

- Architecture-focused sections in spec and plan templates.
- Risk/dependency/critical-path detail for execution control.
- `decision-record.md` for major technical decisions.

<!-- /ANCHOR:additions -->

## 5. QUICK START
<!-- ANCHOR:quick-start -->

### Primary Path — Canonical Intake

Use `/spec_kit:plan --intake-only` to run the shared intake contract. It classifies the folder, emits the canonical trio (`spec.md` + `description.json` + `graph-metadata.json`) atomically, and auto-detects Level from architecture signals and scope. Override detection with `--level=3` when you know the level up front.

```text
/spec_kit:plan --intake-only --level=3
```

The intake contract ([`../../references/intake-contract.md`](../../references/intake-contract.md)) handles folder classification, trio publication, graph-metadata scaffolding, and continuity initialization — none of which the manual copy path performs. For Level 3 work, the intake additionally stages the `decision-record.md` slot so architecture decisions have a destination from the first write.

### Manual Fallback (Advanced)

Only use direct template copy when the canonical intake is unavailable or when explicitly repairing an existing packet. This path bypasses automated metadata generation, so you must backfill `description.json` and `graph-metadata.json` manually (see `scripts/memory/generate-description.js` and the graph-metadata backfill).

```bash
mkdir -p specs/###-feature-name
cp .opencode/skill/system-spec-kit/templates/level_3/spec.md specs/###-feature-name/
cp .opencode/skill/system-spec-kit/templates/level_3/plan.md specs/###-feature-name/
cp .opencode/skill/system-spec-kit/templates/level_3/tasks.md specs/###-feature-name/
cp .opencode/skill/system-spec-kit/templates/level_3/checklist.md specs/###-feature-name/
cp .opencode/skill/system-spec-kit/templates/level_3/decision-record.md specs/###-feature-name/
cp .opencode/skill/system-spec-kit/templates/level_3/implementation-summary.md specs/###-feature-name/
bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/###-feature-name/
```

<!-- /ANCHOR:quick-start -->

## 6. WORKFLOW NOTES
<!-- ANCHOR:workflow-notes -->

- Keep `decision-record.md` updated as decisions are made.
- Keep checklist evidence current before completion claims.
- Finalize `implementation-summary.md` at the end of delivery.
- Resume architectural follow-up through `/spec_kit:resume`, using `handover.md -> _memory.continuity -> spec docs` as the canonical continuity order.
- Save continuity with `/memory:save`, which routes updates into canonical packet docs such as `decision-record.md`, `implementation-summary.md`, and `handover.md`.

<!-- /ANCHOR:workflow-notes -->

## 7. PHASE DECOMPOSITION
<!-- ANCHOR:phase -->

Phase decomposition is recommended for Level 3 tasks exceeding 500 LOC across multiple subsystems. Breaking large architectural work into ordered phases improves delivery control and risk management. Use Gate 3 Option E to target a specific phase child and `/spec_kit:plan :with-phases` to create the phase structure. If that target phase packet is still `no-spec`, `partial-folder`, `repair-mode`, or `placeholder-upgrade`, `/spec_kit:plan` delegates to the shared intake contract in [`../../references/intake-contract.md`](../../references/intake-contract.md) before phase setup continues.

See the Phase System in the [main templates README](../README.md#phase-system) for full details.

<!-- /ANCHOR:phase -->

## 8. RELATED
<!-- ANCHOR:related -->

- `../level_2/README.md`
- `../level_3+/README.md`
- `../addendum/level3-arch/`
- `../../references/templates/level_specifications.md`

<!-- /ANCHOR:related -->
