# Fix-up Batch B1 — Trust-state / freshness semantics repair (6h)

You are implementing remediation Batch B1. **GATE 3 PRE-APPROVED.**

Spec folder: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/015-code-graph-advisor-refinement`

Findings in this batch (find each via `grep '"id":"<ID>"' <spec-folder>/review/015-code-graph-advisor-refinement-pt-01/deltas/iter-*.jsonl`):
- **R1-P1-001** PR-4 startup-brief trust-state drift
- **R2-P1-003** PR-5 metrics cardinality risk from env-derived labels — but only the freshness_state subset (re-categorized into B1 by iter-7)
- **R3-P1-001** PR-4 vocab unification — backward compat alias evidence

For each finding:
1. Read the JSONL record's `evidence`, `reproduce`, and `fix` fields
2. Apply the surgical fix to the cited file:line
3. Preserve unrelated content
4. Run `cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit` after each edit; halt if any new tsc error

Output report: `<spec-folder>/applied/B1.md` with structure: Source / Target Files Modified / Evidence of Change (before/after) / Verification (tsc exit) / Deferred.

Constraints: edit ONLY the files cited in finding evidence. NO scope creep. Closes 3 P1 findings.

Start now.
