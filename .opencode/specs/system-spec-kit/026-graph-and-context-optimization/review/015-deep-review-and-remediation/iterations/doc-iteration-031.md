# Iteration 31 - Dimension: traceability - Subset: 012+014

## Dispatcher
- iteration: 31 of 50
- dispatcher: cli-copilot (model gpt-5.4, effort high, parallel v2)
- timestamp: 2026-04-15T18:45:33Z

## Files Reviewed
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-command-graph-consolidation/spec.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-command-graph-consolidation/tasks.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-command-graph-consolidation/checklist.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-command-graph-consolidation/implementation-summary.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-command-graph-consolidation/graph-metadata.json
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-command-graph-consolidation/description.json
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-memory-save-rewrite/spec.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-memory-save-rewrite/tasks.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-memory-save-rewrite/checklist.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-memory-save-rewrite/implementation-summary.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-memory-save-rewrite/decision-record.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-memory-save-rewrite/graph-metadata.json
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-memory-save-rewrite/description.json

## Findings - New This Iteration
### P0 Findings
- None.

### P1 Findings
- **P1 - 014 checklist evidence no longer traces back to first-order proof surfaces.** `014/tasks.md:56` promises that "every line of evidence cites the right artifact" from the audit, research, or deep-review snapshots, but the live checklist repeatedly cites copied checklist/docs surfaces instead of primary proof: `014/checklist.md:135-170` leans on `review/015-deep-review-snapshot/primary-docs/checklist.md` for most contract/test claims, and `014/checklist.md:199-208` falls back to generic placeholders like `packet tree`, `copied snapshot files`, and `validator output`. Direct packet-local verification surfaces do exist in `014/implementation-summary.md:145-158`, so the broken chain is documentary rather than missing evidence. This makes the packet hard to independently audit and breaks the packet's own stated lineage contract.

```json
{
  "claim": "014's verification checklist is not first-order traceable: it cites copied checklists and generic placeholders instead of the underlying source artifacts or packet-local verification records.",
  "evidenceRefs": [
    "014/tasks.md:56",
    "014/checklist.md:135-170",
    "014/checklist.md:199-208",
    "014/implementation-summary.md:145-158"
  ],
  "counterevidenceSought": "Looked for an explicit packet rule saying copied primary-doc snapshots are the canonical evidence surface for checklist rows, or for packet-local rows that linked back to the underlying research/review/test artifacts.",
  "alternativeExplanation": "Because 014 is a consolidation packet, the author may have intended copied snapshot docs to serve as the authoritative evidence bundle.",
  "finalSeverity": "P1",
  "confidence": 0.92,
  "downgradeTrigger": "Downgrade if the packet's traceability contract explicitly allows checklist-to-checklist citations and generic placeholders as sufficient evidence for closeout rows."
}
```

### P2 Findings
- **P2 - machine-readable evidence indexing only exposes one of the three transcript proofs.** `014/spec.md:220` says the packet is validated by three real session transcripts, and `014/implementation-summary.md:69` repeats that all three were exercised before closeout, but `014/graph-metadata.json:41-52` only advertises `scratch/transcripts-snapshot/transcript-1.md` in `derived.key_files`. Discovery/review tooling that relies on metadata will miss transcript-2 and transcript-3 unless the metadata is widened or the claim is narrowed.

## Findings - Confirming / Re-validating Prior
- **Prior P1 still reproduces:** `014/spec.md:217` still says `SC-016: Packet 016 primary docs pass validate_document.py`, while `014/tasks.md:54,220-228` and `014/checklist.md:199-208` still use `P016-*` / `CHK-016-*` lineage inside the live `014-memory-save-rewrite` packet. This remains the previously reported packet-identity drift, not a new finding from this iteration.

## Traceability Checks
- **core / spec_code: partial** - `012` remains internally aligned across spec/tasks/checklist/summary, but `014` still carries stale `016` packet lineage in success criteria and packet-verification ledgers (`014/spec.md:217`, `014/tasks.md:54,220-228`, `014/checklist.md:199-208`).
- **core / checklist_evidence: partial** - `012/checklist.md:60-64,159-160` and `012/implementation-summary.md:224-239` cite direct command/result evidence with explicit caveats, while `014/checklist.md:135-170,199-208` often points to copied checklists or generic placeholders instead of first-order proof.
- **overlay / playbook_capability: notApplicable** - This subset is about packet closeout truthfulness and evidence chains, not runtime playbook capability claims.

## Confirmed-Clean Surfaces
- `012` packet-local verification remains traceable: the checklist uses concrete grep/validator evidence and the implementation summary preserves nuanced `PASS` vs `CONDITIONAL` outcomes without overstating closure (`012/checklist.md:159-160`, `012/implementation-summary.md:224-239`).
- `014/implementation-summary.md:145-158` is internally coherent as a verification summary; the traceability problem is that the checklist does not consistently cite back to those direct packet-local results.

## Next Focus (recommendation)
Inspect 009+010 for the same two traceability failure modes: stale packet/phase IDs and checklist rows that cite copied review artifacts instead of first-order evidence.
