# Fix-up Batch B4 — Hook execution anchors + settings parity assertions (8h)

You are implementing remediation Batch B4. **GATE 3 PRE-APPROVED.**

Spec folder: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/005-code-graph-advisor-refinement`

Findings in this batch (find each via `grep '"id":"<ID>"' <spec-folder>/review/015-code-graph-advisor-refinement-pt-01/deltas/iter-*.jsonl`):
- **R3-P1-002** PR-7 settings parity test coverage gap
- **R4-P1-002** Hook command path resolution security (cwd / git toplevel resolution)
- **R3-P2-001** Hook registration documentation freshness (P2 advisory)

For each finding:
1. Read the JSONL record's `evidence`, `reproduce`, and `fix` fields
2. Apply the surgical fix to the cited file:line — most likely target files:
   - `mcp_server/skill-advisor/tests/hooks/settings-driven-invocation-parity.vitest.ts` (add stronger assertions per R3-P1-002)
   - `.claude/settings.local.json` if cwd resolution needs hardening (likely just doc note, not code change)
   - hook-related README/docs for R3-P2-001
3. Preserve unrelated content
4. Run `cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit` after edit

Output report: `<spec-folder>/applied/B4.md`. Closes 2 P1 + 1 P2.

Start now.
