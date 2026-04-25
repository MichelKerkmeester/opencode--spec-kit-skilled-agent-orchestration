# Fix-up Batch B5 — Legacy parity corpus path repair (2h)

You are implementing remediation Batch B5. **GATE 3 PRE-APPROVED.**

Spec folder: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/015-code-graph-advisor-refinement`

Findings in this batch (find via `grep '"id":"R2-P1-001"' <spec-folder>/review/015-code-graph-advisor-refinement-pt-01/deltas/iter-*.jsonl`):
- **R2-P1-001** Legacy parity test (`advisor-corpus-parity.vitest.ts`) and `advisor-validate.ts` still reference legacy 019 corpus path

Background context (from PR 1 follow-up): During PR 1 implementation, the agent flagged that `advisor-validate.ts` and `tests/legacy/advisor-corpus-parity.vitest.ts` survived PR 3's delete sweep but still reference the deprecated `019-system-hardening-pt-03/corpus/...` path. Should now point at `scripts/routing-accuracy/labeled-prompts.jsonl` (same target as PR 1's parity test fix).

Steps:
1. Grep both files for the legacy path:
   `grep -n "019-system-hardening-pt-03" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/legacy/advisor-corpus-parity.vitest.ts`
2. If hits found, repoint to `scripts/routing-accuracy/labeled-prompts.jsonl` (relative to mcp_server root) — re-use the `SPECKIT_BENCH_CORPUS_PATH` constant from `tests/parity/python-ts-parity.vitest.ts` if importable, otherwise inline the path
3. Verify: `cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit` exit 0
4. Targeted vitest run on the corpus-parity test if it has skip-able runtime guards

Output report: `<spec-folder>/applied/B5.md` with before/after diff.

Constraints: 2 files maximum. Surgical edits only. Closes 1 P1.

Start now.
