---
title: "phase parent section [template:addendum/phase/phase-parent-section.md]"
description: "Template document for addendum/phase/phase-parent-section.md."
trigger_phrases:
  - "phase"
  - "parent"
  - "section"
  - "template"
  - "phase parent section"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_ADDENDUM: Phase - Parent Section -->
<!-- Append to parent spec.md after SCOPE section -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
<!-- [YOUR_VALUE_HERE: PHASE_ROW] — Replaced by create.sh with full 4-column table rows (e.g., "| 1 | 001-name/ | [focus] | Pending |") -->

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit
- Packet-local changelog files live under `changelog/`; root uses `changelog-<packet>-root.md` and phases use `changelog-<packet>-<phase-folder>.md`

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
<!-- [YOUR_VALUE_HERE: HANDOFF_ROW] — Replaced by create.sh with full 4-column table rows (e.g., "| 001-name | 002-name | [criteria] | [verification] |") -->
<!-- /ANCHOR:phase-map -->
