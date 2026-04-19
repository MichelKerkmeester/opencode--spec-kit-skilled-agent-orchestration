---
title: "Implementation Summary: Gemini + Copilot Hook Wiring"
description: "Placeholder. Populated post-implementation with runtime capability matrix + smoke results."
trigger_phrases:
  - "020 007 summary"
importance_tier: "critical"
contextType: "implementation-summary"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/007-gemini-copilot-hook-wiring"
    last_updated_at: "2026-04-19T09:30:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Placeholder scaffolded"
    next_safe_action: "Populate post-implementation"
    blockers: []
    key_files: []

---
# Implementation Summary: Gemini + Copilot Hook Wiring

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

> **Placeholder.** Populated after `/spec_kit:implement :auto` converges.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-gemini-copilot-hook-wiring |
| **Completed** | TBD |
| **Level** | 2 |
| **Parent** | `../spec.md` |
| **Predecessors** | `../004-*`, `../005-*`, `../006-*` |
| **Position in train** | 6 of 8 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

TBD. Expected: Gemini adapter + Copilot adapter (SDK + wrapper) + cross-runtime parity test + capability matrix.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| TBD | TBD | TBD |

### Runtime Capability Matrix (populate post-capture)

| Runtime | SDK return-object | Fallback path | Parity verified |
|---------|-------------------|---------------|-----------------|
| Claude | — (plain JSON via 006) | N/A | TBD |
| Gemini | JSON `hookSpecificOutput.additionalContext` | Fail-open if unknown event schema | TBD |
| Copilot | `onUserPromptSubmitted` → `{ additionalContext }` | Prompt-wrapper preamble | TBD |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

TBD.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

Inherits ADR-002 + ADR-003 + ADR-004 from parent.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

TBD.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

TBD.
<!-- /ANCHOR:limitations -->
