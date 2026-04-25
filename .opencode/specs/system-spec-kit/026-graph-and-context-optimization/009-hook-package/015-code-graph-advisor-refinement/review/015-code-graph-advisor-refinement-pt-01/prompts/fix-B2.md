# Fix-up Batch B2 — Metric label policy + bench harness hardening (16h)

You are implementing remediation Batch B2. **GATE 3 PRE-APPROVED.**

Spec folder: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/015-code-graph-advisor-refinement`

Findings in this batch (find each via `grep '"id":"<ID>"' <spec-folder>/review/015-code-graph-advisor-refinement-pt-01/deltas/iter-*.jsonl`):
- **R1-P1-003** PR-5 metrics cardinality risk from env-derived labels (label-policy subset)
- **R2-P1-002** PR-3 delete-sweep traceability — bench-related subset (e.g. ARCHITECTURE.md or README scrub if not yet done)
- **R5-P1-001** bench harness defaults / vitest config inclusion side effects
- **R5-P1-002** bench env restoration / SPECKIT_METRICS_ENABLED leak between tests
- **R5-P2-001** signal/noise bench coverage gap (P2 advisory)

For each finding:
1. Read the JSONL record's `evidence`, `reproduce`, and `fix` fields
2. Apply the surgical fix to the cited file:line
3. Preserve unrelated content
4. Run `cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit` after each edit; halt if any new tsc error

Output report: `<spec-folder>/applied/B2.md` with structure: Source / Target Files Modified / Evidence of Change (before/after) / Verification (tsc + targeted vitest) / Deferred.

Constraints: edit ONLY files cited in finding evidence. NO scope creep. Closes 4 P1 + 1 P2.

Start now.
