# Fix-up Batch B3 — PR-3 deletion inventory + traceability (3h)

You are implementing remediation Batch B3. **GATE 3 PRE-APPROVED.**

Spec folder: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/015-code-graph-advisor-refinement`

Findings in this batch (find each via `grep '"id":"<ID>"' <spec-folder>/review/015-code-graph-advisor-refinement-pt-01/deltas/iter-*.jsonl`):
- **R1-P1-002** PR-3 delete-sweep traceability mismatch (docs subset)
- **R3-P1-003** PR-3 implementation-summary close-out / packet traceability

For each finding:
1. Read the JSONL record's `evidence`, `reproduce`, and `fix` fields
2. Apply the surgical fix — most likely:
   - Update `<spec-folder>/implementation-summary.md` to reflect Phase 5 completion + reference to applied/ folder
   - Update `<spec-folder>/checklist.md` if any P0/P1 items remain unchecked despite implementation
   - Scrub any remaining stale references to deleted promotion modules in remaining doc files
3. Preserve unrelated content

Output report: `<spec-folder>/applied/B3.md` with structure: Source / Target Files Modified / Evidence of Change / Verification (no tsc — docs only) / Deferred.

Constraints: edit ONLY documentation files cited in evidence. NO code changes. Closes 2 P1.

Start now.
