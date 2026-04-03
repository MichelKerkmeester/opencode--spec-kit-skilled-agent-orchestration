---
title: "Implementation Summary: Nested Changelog Per Spec [02--system-spec-kit/025-nested-changelog-per-spec]"
description: "Packet-local changelog generation now ships with system-spec-kit, so packet roots and child phases can keep chronological history beside their implementation summaries."
trigger_phrases:
  - "implementation summary"
  - "nested changelog"
  - "phase changelog"
  - "025"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 025-nested-changelog-per-spec |
| **Completed** | 2026-04-03 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Packet-local changelog generation now lives beside the existing implementation summary workflow. You can generate a changelog for a packet root or a nested phase folder without inventing filenames or hand-assembling markdown, and the result lands in the parent packet's `changelog/` directory with a consistent naming rule.

### Nested changelog generator

The new `nested-changelog.ts` script handles the heavy lifting. It resolves approved spec folders, detects whether the target is a packet root or a child phase, reads packet documents such as `spec.md`, `implementation-summary.md`, `tasks.md`, and `checklist.md`, and derives the summary, change buckets, verification bullets, and follow-up notes that appear in the final changelog.

Root packet output writes to `<spec-root>/changelog/changelog-<packet>-root.md`. Child phase output writes to `<spec-root>/changelog/changelog-<packet>-<phase-folder>.md`, which keeps the packet history centralized instead of scattering changelog files across phase folders.

### Canonical templates for packet history

System Spec Kit now has dedicated changelog templates for packet roots and phase children. `.opencode/skill/system-spec-kit/templates/changelog/root.md` is tuned for packet-level rollups, including included-phase summaries, while `.opencode/skill/system-spec-kit/templates/changelog/phase.md` focuses on the specific phase and points back to the parent packet. This replaces the previous situation where packet changelog files existed but had no single source-of-truth template.

### Command and workflow alignment

`/create:changelog` now supports two concepts cleanly: the existing global release-note flow and the new nested spec/phase mode. `/spec_kit:implement` and `/spec_kit:complete` now instruct packet-aware workflows to create a nested changelog in addition to `implementation-summary.md` when the target is a packet root or child phase.

The skill, template, validation, phase-structure, and workflow reference docs were updated in the same pass. That keeps the runtime contract, the packet-writing guidance, and the command surfaces saying the same thing, which is the real value of this packet.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The work started by analyzing packet `024-compact-code-graph`, which already had nested changelog examples but not a canonical workflow. From there, the generator and templates were added first, the command/skill/reference surfaces were aligned second, and the packet was closed only after fixing the first test failure caused by template path resolution.

Verification stayed narrow and honest. The scripts workspace build was rerun after the generator fix, and a focused Vitest suite now covers both packet-root and phase-child output behavior. Packet `025` was then added to document the shipped scope and keep the workflow change auditable.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep nested changelog additive to `implementation-summary.md` | The implementation summary still owns the narrative closeout story. The changelog adds chronological packet history without breaking the existing completion contract. |
| Use one generator with root/phase modes | Path resolution and naming rules are the fragile part of the feature. Centralizing them in one tested script reduces drift and keeps command docs simple. |
| Update commands and references in the same packet | A packet-local workflow is only useful if the command surfaces, templates, and docs all point at the same behavior. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm run build --workspace=@spec-kit/scripts` | PASS |
| `npx vitest run tests/nested-changelog.vitest.ts --config ../mcp_server/vitest.config.ts --root .` | PASS |
| Root output path contract | PASS - focused test asserts `changelog-<packet>-root.md` |
| Phase output path contract | PASS - focused test asserts parent-packet `changelog-<packet>-<phase-folder>.md` output |
| Command/workflow alignment review | PASS - `/create:changelog`, `/spec_kit:implement`, `/spec_kit:complete`, skill docs, templates, and references updated together |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Nested changelog generation is workflow-aware, not a universal validator gate.** This packet teaches the commands when to create packet changelogs, but it does not force every packet in the repository to have one.
2. **Generated quality depends on packet document quality.** If `implementation-summary.md`, `tasks.md`, or `checklist.md` are sparse, the changelog will fall back to simpler derived bullets.
3. **Historical packet changelogs remain mixed.** This packet standardizes the forward-looking workflow; it does not retroactively normalize older packet changelog files.
<!-- /ANCHOR:limitations -->
