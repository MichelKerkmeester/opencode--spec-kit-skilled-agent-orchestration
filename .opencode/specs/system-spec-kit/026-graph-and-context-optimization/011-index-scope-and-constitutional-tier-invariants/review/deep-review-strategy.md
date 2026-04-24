# Deep Review Strategy — Packet 011

## Review Target
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-index-scope-and-constitutional-tier-invariants`

## Target Type
spec-folder (Level 3 packet + implementation code + cleanup script + tests)

## Dimensions (risk-ordered)
1. **correctness** — do the three invariants actually enforce what they claim?
2. **security** — does the save-time guard or cleanup script open any new attack surface (e.g., traversal, SQL injection in cleanup, privilege escalation)?
3. **traceability** — do spec claims map to code + tests + DB evidence? Every P0/P1 finding must cite file:line.
4. **maintainability** — single source of truth for exclusion patterns, idempotence of cleanup, test isolation, dead code

## Scope Files
See `reviewScopeFiles` in `deep-review-config.json`.

## Known Context (prior work in session)
- Packet 010 landed Fix A (pe-orchestration canonical-path post-filter) + Fix B2 (fromScan transactional-recheck bypass). Untouched here.
- Packet 011 creates `mcp_server/lib/utils/index-scope.ts` as shared path-policy helper
- Save-time guard at memory-save.ts downgrades `tier=constitutional` for non-`/constitutional/` paths → `important`
- Cleanup script at `scripts/memory/cleanup-index-scope-violations.ts` with `--apply` / `--verify` / `--dry-run` modes
- Live DB state after cleanup: 2 constitutional rows (gate-enforcement.md + gate-tool-routing.md), 0 z_future, 0 external, 0 invalid-constitutional
- README.md correction reversed: discovery + parser now both exclude `readme.md` from constitutional/ (user-directed invariant)

## Three invariants (user-directed)
1. `/z_future/*` → NEVER indexed by memory system
2. `/external/*` → NEVER indexed by memory system OR code graph
3. `importanceTier: constitutional` → only valid for files under `/constitutional/` folder

## Max Iterations: 7
## Convergence Threshold: 0.10

## Dimension Queue
correctness → security → traceability → maintainability → correctness (deeper pass) → security (edge cases) → synthesis

## Iteration Log
- **iter-001 (correctness) — complete**: 11 findings (P0: 0, P1: 6, P2: 5). Regex boundary semantics verified clean; save-time guard covers both direct + scan-originated saves; code-graph walker + specificFiles both gated. Main open risks: cleanup-script TOCTOU (plan outside transaction), FTS cleanup trigger unverified, symlink bypass on `path.resolve`, LIKE patterns diverge from regex semantics, no idempotence short-circuit, mutation-ledger stub no-op.

## Running Findings
- Total open: 11 (P0: 0, P1: 6, P2: 5)
- Next dimension: security

## What Worked (iter-001)
- Direct regex mental-execution with node confirmed boundary behavior on 15+ edge-case paths
- Reading both helpers and consumers confirmed no-gap coverage at indexing entrypoints
- Test files (`index-scope.vitest.ts`, `memory-save-index-scope.vitest.ts`) confirm the positive paths empirically

## Exhausted Approaches (do not retry)
- Single-dimension regex enumeration for invariants 1-3: fully covered in iter-001. Future iterations should focus on cross-cutting concerns (security, traceability, maintainability).

## Review Instructions for Iteration Agent
- READ-ONLY on all scope files. Do NOT modify code or spec docs.
- Every P0/P1 finding MUST cite `file:line` with direct evidence.
- At each iteration's end, write a new `iterations/iteration-NNN.md` file.
- Append a JSONL record of the iteration to `deep-review-state.jsonl`.
- Update `deep-review-findings-registry.json` with consolidated findings.
- Stop conditions: convergence ratio < 0.10 AND all dimensions covered, OR iteration ≥ 7.
