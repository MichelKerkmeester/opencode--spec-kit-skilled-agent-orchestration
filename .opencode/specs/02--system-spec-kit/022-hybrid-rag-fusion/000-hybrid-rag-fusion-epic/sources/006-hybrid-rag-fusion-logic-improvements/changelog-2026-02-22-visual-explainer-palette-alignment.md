# Changelog - 2026-02-22 - Doc Visual Palette Alignment

- Date: 2026-02-22
- Scope: Enforce a single shared palette across the removed visual skill templates within `139-hybrid-rag-fusion/006-hybrid-rag-fusion-logic-improvements`.

## Summary of Request
Enforce one palette across all removed visual skill templates, using `artifact-dashboard` as the palette baseline.

## Files Changed
Paths below are absolute relative to workspace root (`/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public`):
- `architecture.html`
- `data-table.html`
- `mermaid-flowchart.html`
- `traceability-board.html`

## Visual Bug Fixes Applied
- `data-table`: improved sticky header reliability by applying sticky positioning to table header cells (`th`) for consistent behavior.
- `traceability-board`: constrained drag-pan interaction to only activate when zoomed in (and on primary-button drag), preventing accidental panning at base zoom.

## Validation Evidence
- Template validator passed for all 5 templates:
  - `architecture.html`
  - `data-table.html`
  - `mermaid-flowchart.html`
  - `artifact-dashboard.html`
  - `traceability-board.html`
- Fixture tests passed for the legacy template validator fixtures (result: `validator fixture tests passed`).

## Scope Control
No unrelated changes.
