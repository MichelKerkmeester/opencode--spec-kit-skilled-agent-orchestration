---
title: "Level 3+ Templates [template:level_3+/README.md]"
description: "Extended templates for high-complexity work needing approval tracking and workstream coordination."
trigger_phrases:
  - "level 3+"
  - "governance"
  - "compliance"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/templates/level_3+"
    last_updated_at: "2026-04-11T00:00:00Z"
    last_updated_by: "template-author"
    recent_action: "Initialized Level 3 plus template"
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
# Level 3+ Templates

Use for high-complexity work that needs approval tracking, compliance checkpoints, and coordinated multi-workstream execution.

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. OVERVIEW](#1--overview)
- [2. REQUIRED FILES](#2--required-files)
- [3. OPTIONAL FILES](#3--optional-files)
- [4. GOVERNANCE ADDITIONS](#4--governance-additions)
- [5. QUICK START](#5--quick-start)
- [6. WORKFLOW NOTES](#6--workflow-notes)
- [7. PHASE DECOMPOSITION](#7--phase-decomposition)
- [8. RELATED](#8--related)

<!-- /ANCHOR:table-of-contents -->

## 1. OVERVIEW
<!-- ANCHOR:overview -->

- Approval workflow with reviewer checkpoints is required.
- Compliance checkpoints must be documented.
- Multiple workstreams need coordination.
- Complexity is high enough that Level 3 is not sufficient.
- Under Gate E, the packet remains the continuity source of truth: `/spec_kit:resume` rebuilds context from `handover.md` -> `_memory.continuity` -> spec docs, while generated memory artifacts stay supporting only.

<!-- /ANCHOR:overview -->

## 2. REQUIRED FILES
<!-- ANCHOR:files -->

- `spec.md`
- `plan.md`
- `tasks.md`
- `checklist.md`
- `decision-record.md`
- `implementation-summary.md`

These are the same core files as Level 3 with additional approval, compliance and stakeholder sections.

<!-- /ANCHOR:files -->

## 3. OPTIONAL FILES
<!-- ANCHOR:optional-files -->

- `resource-map.md` - lean, scannable catalog of every path analyzed, created, updated, or removed (copy from `../resource-map.md`).

<!-- /ANCHOR:optional-files -->

## 4. GOVERNANCE ADDITIONS
<!-- ANCHOR:additions -->

- Approval workflow with reviewer checkpoint table.
- Compliance checkpoints and traceability fields.
- Stakeholder tracking and workstream coordination sections.
- Expanded checklist coverage for release-readiness validation.

<!-- /ANCHOR:additions -->

## 5. QUICK START
<!-- ANCHOR:quick-start -->

### Primary Path — Canonical Intake

Use `/spec_kit:plan --intake-only` to run the shared intake contract. It classifies the folder, emits the canonical trio (`spec.md` + `description.json` + `graph-metadata.json`) atomically, and auto-detects Level from governance, compliance, and multi-workstream signals. Override detection with `--level=3+` when you know the level up front.

```text
/spec_kit:plan --intake-only --level=3+
```

The intake contract ([`../../references/intake-contract.md`](../../references/intake-contract.md)) handles folder classification, trio publication, graph-metadata scaffolding, and continuity initialization — none of which the manual copy path performs. For Level 3+ work, the intake additionally stages approval-tracking, compliance, and stakeholder sections so governance checkpoints have a durable home from the first write.

### Manual Fallback (Advanced)

Only use direct template copy when the canonical intake is unavailable or when explicitly repairing an existing packet. This path bypasses automated metadata generation, so you must backfill `description.json` and `graph-metadata.json` manually (see `scripts/memory/generate-description.js` and the graph-metadata backfill) and re-initialize governance trackers by hand.

```bash
mkdir -p specs/###-feature-name
cp .opencode/skill/system-spec-kit/templates/level_3+/*.md specs/###-feature-name/
bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/###-feature-name/
```

<!-- /ANCHOR:quick-start -->

## 6. WORKFLOW NOTES
<!-- ANCHOR:workflow-notes -->

- Keep approvals and compliance checks updated as work progresses.
- Track checklist evidence continuously; do not batch at the end.
- Finalize `implementation-summary.md` with delivered outcomes and open follow-ups.
- Resume governance-heavy follow-up through `/spec_kit:resume`, using `handover.md -> _memory.continuity -> spec docs` as the canonical continuity order. Approval state and stakeholder sign-offs must be rehydrated from packet docs before work continues.
- Save continuity with `/memory:save`, which routes updates into canonical packet docs such as `decision-record.md`, `implementation-summary.md`, `handover.md`, and the approval/compliance tracker sections. Never hand-author standalone continuity artifacts under `memory/`.
- For multi-agent or AI-orchestrated workflows, ensure every spec-doc write uses templates from `.opencode/skill/system-spec-kit/templates/level_3+/`, runs `validate.sh --strict` after each write, and routes continuity updates through `/memory:save` — the distributed-governance rule applies regardless of which agent holds the pen.

<!-- /ANCHOR:workflow-notes -->

## 7. PHASE DECOMPOSITION
<!-- ANCHOR:phase -->

Phase decomposition is strongly recommended for Level 3+ complexity. High-complexity work benefits from phased ordering, enabling approval checkpoints and compliance verification at each stage. Use Gate 3 Option E to target a specific phase child and `/spec_kit:plan :with-phases` to create the phase structure. If that target phase packet is still `no-spec`, `partial-folder`, `repair-mode`, or `placeholder-upgrade`, `/spec_kit:plan` delegates to the shared intake contract in [`../../references/intake-contract.md`](../../references/intake-contract.md) before phase setup continues.

See the Phase System in the [main templates README](../README.md#phase-system) for full details.

<!-- /ANCHOR:phase -->

## 8. RELATED
<!-- ANCHOR:related -->

- `../level_3/README.md`
- `../addendum/level3plus-govern/`
- `../../references/templates/level_specifications.md`
- `../../references/validation/validation_rules.md`

<!-- /ANCHOR:related -->
