---
title: "Implementation Summary [template:level_2/implementation-summary.md]"
description: "This phase made JSON the preferred routine-save contract, kept stateless mode as recovery-only, and moved obsolete dynamic-capture follow-ups under the archived branch parent."
trigger_phrases:
  - "implementation summary"
  - "json primary deprecation"
  - "017 json primary deprecation"
importance_tier: "high"
contextType: "implementation"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 017-json-primary-deprecation |
| **Completed** | 2026-03-20 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase ended the fiction that dynamic capture was a trustworthy routine-save path. You now have a JSON-primary contract for routine saves, the runtime warns when someone falls back to the deprecated stateless path, and the obsolete follow-up phases live under a real archived branch parent instead of dangling as direct children.

### JSON-Primary Contract Shift

The runtime and operator guidance now agree on the same posture: structured JSON is the preferred routine-save contract, while stateless capture stays available only for recovery. The phase also recorded which follow-up phases were kept, reframed, or archived so the branch history remains understandable instead of silently disappearing.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts` | Modified | Warn on deprecated routine stateless saves |
| `.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts` | Modified | Mirror the same runtime posture in the loader path |
| `.opencode/skill/system-spec-kit/scripts/types/session-types.ts` | Modified | Add structured JSON enrichment types |
| `.opencode/skill/system-spec-kit/SKILL.md` | Modified | Teach the JSON-primary operator contract |
| `.opencode/command/memory/save.md` | Modified | Align the save command with the new contract |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The work landed in one contract-focused pass. Runtime warnings and structured JSON support shipped first, the operator docs were updated in the same phase, and the obsolete dynamic-capture follow-ups were moved under `../000-dynamic-capture-deprecation/` so the historical trail stayed intact.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep stateless mode as recovery-only instead of removing it | Crash-recovery workflows still need a fallback path |
| Prefer JSON as the routine-save contract | The calling AI has better session context than after-the-fact transcript reconstruction |
| Archive obsolete dynamic-capture follow-ups instead of deleting them | The historical evidence still matters, but it no longer belongs in the active direct-child chain |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Runtime deprecation warning present | PASS |
| JSON-primary wording present in operator docs | PASS |
| Modified JSON artifacts parse correctly | PASS |
| Archived follow-up branch parent resolves cleanly | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Recovery-only path still exists** Stateless mode remains available for recovery, so the deprecation is a posture shift, not a hard removal.
2. **Future removal remains open** If the project ever removes stateless mode entirely, that decision still needs its own follow-up phase and verification.
<!-- /ANCHOR:limitations -->
