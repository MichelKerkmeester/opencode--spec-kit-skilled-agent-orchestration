---
title: "Nested Changelog Templates"
description: "Canonical packet-local changelog templates for root specs and phase child folders."
trigger_phrases:
  - "nested changelog"
  - "packet changelog"
  - "phase changelog"
importance_tier: "normal"
contextType: "general"
---
# Nested Changelog Templates

Canonical templates for packet-local changelogs generated inside spec folders.

## Files

| Template | Use |
|---|---|
| `root.md` | Root spec folder changelog written to `changelog/changelog-<packet>-root.md` |
| `phase.md` | Phase child changelog written to the parent packet `changelog/` folder |

## Notes

- These templates are separate from the global `.opencode/changelog/` release-note templates.
- The generator script fills them from `spec.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and `implementation-summary.md` when available.
- Root changelogs may include a phase coverage rollup when direct child phase folders exist.
