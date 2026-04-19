# Iteration 11 — Dimension: correctness — Subset: 010+012

## Dispatcher
- iteration: 11 of 50
- dispatcher: cli-copilot (binary copilot, model gpt-5.4, effort high)
- timestamp: 2026-04-15T18:01:29Z

## Files Reviewed
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-combined-deep-review-four-specs/review/deep-review-config.json
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-combined-deep-review-four-specs/review/deep-review-strategy.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-combined-deep-review-four-specs/review/deep-review-state.jsonl
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-combined-deep-review-four-specs/review/deep-review-findings-registry.json
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-search-and-routing-tuning/003-graph-metadata-validation/spec.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-search-and-routing-tuning/003-graph-metadata-validation/plan.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-search-and-routing-tuning/003-graph-metadata-validation/tasks.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-search-and-routing-tuning/003-graph-metadata-validation/checklist.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-search-and-routing-tuning/003-graph-metadata-validation/implementation-summary.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-search-and-routing-tuning/003-graph-metadata-validation/graph-metadata.json
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-search-and-routing-tuning/003-graph-metadata-validation/005-doc-surface-alignment/spec.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-search-and-routing-tuning/003-graph-metadata-validation/005-doc-surface-alignment/plan.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-search-and-routing-tuning/003-graph-metadata-validation/005-doc-surface-alignment/tasks.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-search-and-routing-tuning/003-graph-metadata-validation/005-doc-surface-alignment/checklist.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-search-and-routing-tuning/003-graph-metadata-validation/005-doc-surface-alignment/implementation-summary.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-search-and-routing-tuning/003-graph-metadata-validation/005-doc-surface-alignment/graph-metadata.json
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-search-and-routing-tuning/003-graph-metadata-validation/006-key-file-resolution/spec.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-search-and-routing-tuning/003-graph-metadata-validation/006-key-file-resolution/plan.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-search-and-routing-tuning/003-graph-metadata-validation/006-key-file-resolution/tasks.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-search-and-routing-tuning/003-graph-metadata-validation/006-key-file-resolution/checklist.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-search-and-routing-tuning/003-graph-metadata-validation/006-key-file-resolution/implementation-summary.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-search-and-routing-tuning/003-graph-metadata-validation/006-key-file-resolution/graph-metadata.json
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-search-and-routing-tuning/003-graph-metadata-validation/007-entity-quality-improvements/spec.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-search-and-routing-tuning/003-graph-metadata-validation/007-entity-quality-improvements/plan.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-search-and-routing-tuning/003-graph-metadata-validation/007-entity-quality-improvements/tasks.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-search-and-routing-tuning/003-graph-metadata-validation/007-entity-quality-improvements/checklist.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-search-and-routing-tuning/003-graph-metadata-validation/007-entity-quality-improvements/implementation-summary.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-search-and-routing-tuning/003-graph-metadata-validation/007-entity-quality-improvements/graph-metadata.json
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-command-graph-consolidation/graph-metadata.json
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-command-graph-consolidation/description.json

## Findings — New This Iteration
### P0 Findings
None.

### P1 Findings
#### DR11-P1-001 — `010/003` child packets `006-key-file-resolution` and `007-entity-quality-improvements` still advertise `planned` after closure
Both late child packets under `010/003-graph-metadata-validation` still publish `status: planned` in `spec.md` and `plan.md`, but their packet-local closure surfaces all mark them complete. That makes packet status truthfulness unreliable for any consumer that reads the canonical spec/plan docs instead of the checklist or generated metadata.

Evidence:
- `010-search-and-routing-tuning/003-graph-metadata-validation/006-key-file-resolution/spec.md:4`
- `010-search-and-routing-tuning/003-graph-metadata-validation/006-key-file-resolution/plan.md:4`
- `010-search-and-routing-tuning/003-graph-metadata-validation/006-key-file-resolution/tasks.md:4`
- `010-search-and-routing-tuning/003-graph-metadata-validation/006-key-file-resolution/checklist.md:4`
- `010-search-and-routing-tuning/003-graph-metadata-validation/006-key-file-resolution/implementation-summary.md:11`
- `010-search-and-routing-tuning/003-graph-metadata-validation/006-key-file-resolution/graph-metadata.json:33`
- `010-search-and-routing-tuning/003-graph-metadata-validation/007-entity-quality-improvements/spec.md:4`
- `010-search-and-routing-tuning/003-graph-metadata-validation/007-entity-quality-improvements/plan.md:4`
- `010-search-and-routing-tuning/003-graph-metadata-validation/007-entity-quality-improvements/tasks.md:4`
- `010-search-and-routing-tuning/003-graph-metadata-validation/007-entity-quality-improvements/checklist.md:4`
- `010-search-and-routing-tuning/003-graph-metadata-validation/007-entity-quality-improvements/implementation-summary.md:11`
- `010-search-and-routing-tuning/003-graph-metadata-validation/007-entity-quality-improvements/graph-metadata.json:33`

```json
{
  "claim": "The 006-key-file-resolution and 007-entity-quality-improvements child packets under 010/003 still present themselves as planned in spec.md and plan.md even though their tasks, checklists, implementation summaries, and graph metadata all mark them complete.",
  "evidenceRefs": [
    "010-search-and-routing-tuning/003-graph-metadata-validation/006-key-file-resolution/spec.md:4",
    "010-search-and-routing-tuning/003-graph-metadata-validation/006-key-file-resolution/plan.md:4",
    "010-search-and-routing-tuning/003-graph-metadata-validation/006-key-file-resolution/tasks.md:4",
    "010-search-and-routing-tuning/003-graph-metadata-validation/006-key-file-resolution/checklist.md:4",
    "010-search-and-routing-tuning/003-graph-metadata-validation/006-key-file-resolution/implementation-summary.md:11",
    "010-search-and-routing-tuning/003-graph-metadata-validation/006-key-file-resolution/graph-metadata.json:33",
    "010-search-and-routing-tuning/003-graph-metadata-validation/007-entity-quality-improvements/spec.md:4",
    "010-search-and-routing-tuning/003-graph-metadata-validation/007-entity-quality-improvements/plan.md:4",
    "010-search-and-routing-tuning/003-graph-metadata-validation/007-entity-quality-improvements/tasks.md:4",
    "010-search-and-routing-tuning/003-graph-metadata-validation/007-entity-quality-improvements/checklist.md:4",
    "010-search-and-routing-tuning/003-graph-metadata-validation/007-entity-quality-improvements/implementation-summary.md:11",
    "010-search-and-routing-tuning/003-graph-metadata-validation/007-entity-quality-improvements/graph-metadata.json:33"
  ],
  "counterevidenceSought": "Looked for pending tasks, unchecked checklist rows, missing implementation summaries, or graph-metadata statuses that would justify leaving either packet in planned state; none were present.",
  "alternativeExplanation": "The spec.md and plan.md frontmatter could be intentionally left at planned until a separate archival step, but that does not fit packets that already carry complete tasks, complete checklists, complete implementation summaries, and regenerated graph metadata with derived complete status.",
  "finalSeverity": "P1",
  "confidence": 0.98,
  "downgradeTrigger": "Downgrade if this workflow explicitly allows spec.md and plan.md to remain planned after packet-local closure artifacts are marked complete."
}
```

### P2 Findings
None.

## Findings — Confirming / Re-validating Prior
- Revalidated the prior `010/003` lineage drift from iterations 6 and 9: `plan.md:18`, `checklist.md:15`, and `implementation-summary.md:26` still say `root 019`, while `tasks.md:13` and `graph-metadata.json:3-4` identify the live packet as `003`.

## Traceability Checks
- `spec_code` (core): **fail** — `010/003/006` and `010/003/007` still expose `planned` in `spec.md` + `plan.md` while packet-local completion surfaces and generated metadata all say `complete`.
- `checklist_evidence` (core): **pass** — `006` and `007` each have complete `tasks.md`, complete `checklist.md`, complete `implementation-summary.md`, and `graph-metadata.json` derived status `complete`, isolating the defect to stale spec/plan status.
- `agent_cross_runtime` (overlay): **notApplicable** — this correctness pass stayed on packet-local status truthfulness rather than runtime-mirror parity.

## Confirmed-Clean Surfaces
- `010/003/005-doc-surface-alignment` is internally aligned on status: `spec.md:13`, `plan.md:13`, `tasks.md:12`, `checklist.md:12`, `implementation-summary.md:12`, and `graph-metadata.json:42` all report `complete`.
- `012-command-graph-consolidation` no longer reproduces the earlier timestamp-recency drift: `description.json:12` reports `lastUpdated` at `2026-04-15T16:45:25.714Z`, while `graph-metadata.json:270` reports `last_save_at` at `2026-04-15T17:30:00.000Z`, which is no longer future-dated relative to this iteration.

## Next Focus (recommendation)
Security on `010+012`, especially packet surfaces that describe file/path resolution and command-intake behavior.
