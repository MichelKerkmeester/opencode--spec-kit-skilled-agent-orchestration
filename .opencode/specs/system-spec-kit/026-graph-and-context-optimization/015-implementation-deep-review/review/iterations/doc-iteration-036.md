# Iteration 36 - Dimension: traceability - Subset: 009+010+012

## Dispatcher
- iteration: 36 of 50
- dispatcher: cli-copilot (model gpt-5.4, effort high, parallel v2)
- timestamp: 2026-04-15T18:53:09Z

## Files Reviewed
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-combined-deep-review-four-specs/review/deep-review-config.json
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-combined-deep-review-four-specs/review/deep-review-strategy.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-combined-deep-review-four-specs/review/deep-review-state.jsonl
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-playbook-and-remediation/001-playbook-prompt-rewrite/spec.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-playbook-and-remediation/001-playbook-prompt-rewrite/checklist.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/003-graph-metadata-validation/checklist.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/003-graph-metadata-validation/006-key-file-resolution/spec.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/003-graph-metadata-validation/006-key-file-resolution/plan.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/003-graph-metadata-validation/006-key-file-resolution/tasks.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/003-graph-metadata-validation/006-key-file-resolution/checklist.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/003-graph-metadata-validation/006-key-file-resolution/implementation-summary.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/003-graph-metadata-validation/007-entity-quality-improvements/spec.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/003-graph-metadata-validation/007-entity-quality-improvements/plan.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/003-graph-metadata-validation/007-entity-quality-improvements/tasks.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/003-graph-metadata-validation/007-entity-quality-improvements/checklist.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/003-graph-metadata-validation/007-entity-quality-improvements/implementation-summary.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-canonical-intake-and-middleware-cleanup/spec.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-canonical-intake-and-middleware-cleanup/checklist.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-canonical-intake-and-middleware-cleanup/implementation-summary.md

## Findings - New This Iteration
### P0 Findings
- None.

### P1 Findings
#### P1-036-01 - `010/003/006-key-file-resolution` broadens its delivered pruning rule beyond the approved packet contract
- Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/003-graph-metadata-validation/006-key-file-resolution/spec.md:20-25`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/003-graph-metadata-validation/006-key-file-resolution/plan.md:20`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/003-graph-metadata-validation/006-key-file-resolution/tasks.md:17`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/003-graph-metadata-validation/006-key-file-resolution/implementation-summary.md:54-60`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/003-graph-metadata-validation/006-key-file-resolution/implementation-summary.md:67-68`
- `spec.md` and `plan.md` scope Phase 006 to stale-deletion pruning ("files deleted more than 30 days ago"), but the completion artifacts record a broader rule that drops any unresolved file-shaped candidate. Reviewers can no longer trace the delivered behavior back to a packet-local REQ or success criterion.

```json
{
  "claim": "Phase 006's closeout artifacts broaden the approved stale-deletion rule into unconditional missing-file pruning, leaving the delivered behavior under-specified by the packet's own contract.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/003-graph-metadata-validation/006-key-file-resolution/spec.md:20-25",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/003-graph-metadata-validation/006-key-file-resolution/plan.md:20",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/003-graph-metadata-validation/006-key-file-resolution/tasks.md:17",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/003-graph-metadata-validation/006-key-file-resolution/implementation-summary.md:54-60",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/003-graph-metadata-validation/006-key-file-resolution/implementation-summary.md:67-68"
  ],
  "counterevidenceSought": "Looked for a packet-local REQ, SC, ADR, or checklist row that expands stale pruning from '>30 day deletions' to all unresolved file-shaped candidates; none was present.",
  "alternativeExplanation": "The implementation may have intentionally generalized the fix during delivery, but the packet contract was not updated to make that broader behavior reviewable.",
  "finalSeverity": "P1",
  "confidence": 0.95,
  "downgradeTrigger": "Downgrade if the packet's requirements or acceptance criteria are updated to authorize general missing-file pruning, or if the closeout artifacts are narrowed back to the >30-day deletion rule."
}
```

#### P1-036-02 - `010/003/007-entity-quality-improvements` expands the runtime-name rejection list beyond the approved requirement surface
- Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/003-graph-metadata-validation/007-entity-quality-improvements/spec.md:22-26`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/003-graph-metadata-validation/007-entity-quality-improvements/plan.md:20`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/003-graph-metadata-validation/007-entity-quality-improvements/tasks.md:20-21`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/003-graph-metadata-validation/007-entity-quality-improvements/implementation-summary.md:58-61`
- `spec.md` approves rejecting four bare runtime names (`python`, `node`, `bash`, `sh`), while `tasks.md` and `implementation-summary.md` close out nine names (`+ npm, npx, vitest, jest, tsc`). `plan.md` says only "extend the rejection list," so the packet no longer exposes one unambiguous requirement surface a reviewer can audit against.

```json
{
  "claim": "Phase 007's approved requirement names only four runtime tokens, but the delivered behavior and completion evidence extend that list to nine tokens without a matching packet-local requirement update.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/003-graph-metadata-validation/007-entity-quality-improvements/spec.md:22-26",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/003-graph-metadata-validation/007-entity-quality-improvements/plan.md:20",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/003-graph-metadata-validation/007-entity-quality-improvements/tasks.md:20-21",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/003-graph-metadata-validation/007-entity-quality-improvements/implementation-summary.md:58-61"
  ],
  "counterevidenceSought": "Looked for a packet-local REQ, SC, ADR, or checklist row authorizing rejection beyond `python`, `node`, `bash`, and `sh`; none was present.",
  "alternativeExplanation": "The plan's generic 'extend the rejection list' wording may reflect intended scope growth, but the spec's enumerated requirement was never updated to keep the approval surface auditable.",
  "finalSeverity": "P1",
  "confidence": 0.9,
  "downgradeTrigger": "Downgrade if the packet's requirements or acceptance criteria are updated to enumerate the broader rejection list, or if closeout artifacts are narrowed back to the original four-token contract."
}
```

### P2 Findings
- None.

## Findings - Confirming / Re-validating Prior
- `009-playbook-and-remediation/001-playbook-prompt-rewrite` still carries stale `Phase 014` / `014-playbook-prompt-rewrite` lineage inside the live `001-playbook-prompt-rewrite` folder, so packet identity remains non-self-consistent for traceability review (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-playbook-and-remediation/001-playbook-prompt-rewrite/spec.md:2`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-playbook-and-remediation/001-playbook-prompt-rewrite/spec.md:22`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-playbook-and-remediation/001-playbook-prompt-rewrite/spec.md:48-51`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-playbook-and-remediation/001-playbook-prompt-rewrite/spec.md:67`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-playbook-and-remediation/001-playbook-prompt-rewrite/checklist.md:83-84`).

## Traceability Checks
- `spec_code` (core): **fail** - `010/003/006` and `010/003/007` no longer keep their approved requirement text aligned with tasks and closeout summaries; `009/001` prior lineage drift still reproduces.
- `checklist_evidence` (core): **partial** - `012` keeps REQ/SC rows and verification evidence aligned (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-canonical-intake-and-middleware-cleanup/spec.md:239-279`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-canonical-intake-and-middleware-cleanup/spec.md:285-317`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-canonical-intake-and-middleware-cleanup/checklist.md:60-123`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-canonical-intake-and-middleware-cleanup/implementation-summary.md:68-110`), but `010/003/006` and `010/003/007` checklists stay too coarse to clear the broader-vs-narrower contract drift.
- `playbook_capability` (overlay): **partial** - `009/001` still accurately scopes itself to documentation repair and the real playbook index reference (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-playbook-and-remediation/001-playbook-prompt-rewrite/spec.md:47-52`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-playbook-and-remediation/001-playbook-prompt-rewrite/spec.md:59-67`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-playbook-and-remediation/001-playbook-prompt-rewrite/spec.md:77`), but the stale phase identity prevents clean packet-to-capability lineage.

## Confirmed-Clean Surfaces
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-canonical-intake-and-middleware-cleanup/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-canonical-intake-and-middleware-cleanup/checklist.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-canonical-intake-and-middleware-cleanup/implementation-summary.md`
- Within this traceability slice, `012` keeps its requirement table, success criteria, checklist evidence, and closeout summary mutually aligned.

## Next Focus (recommendation)
- Recheck `014` for requirement-to-closeout drift, especially where remediation packets may have broadened delivered behavior beyond their written REQ/SC surfaces.
