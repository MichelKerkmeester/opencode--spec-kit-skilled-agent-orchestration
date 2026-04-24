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
- **iter-002 (security) — complete**: 6 new findings (P0: 0, P1: 3, P2: 3). No exploitable RCE/SQLi. New P1s: log-injection in save-time downgrade WARN (parser-controlled file_path), silent tier downgrade with no governance audit row, walker DoS via unbounded readdirSync + whole-file .gitignore reads. New P2s: DB path disclosure on sqlite error, no machine-readable cleanup report, sqlite-vec supply-chain trust. Cross-referenced iter-1 findings with stronger security framing: P1-003 (privilege-escalation), P1-004 (cleanup-evasion), P2-002 (future PR risk). Ruled out: SQL injection, DB_PATH tampering, README case/directory attacks, ReDoS, excluded-path parse traces.

## Running Findings
- Total open: 17 (P0: 0, P1: 9, P2: 8)
- Next dimension: traceability

## What Worked (iter-001, iter-002)
- Direct regex mental-execution with node confirmed boundary behavior on 15+ edge-case paths (iter-1)
- Reading both helpers and consumers confirmed no-gap coverage at indexing entrypoints (iter-1)
- Test files (`index-scope.vitest.ts`, `memory-save-index-scope.vitest.ts`) confirm the positive paths empirically (iter-1)
- Threat-model question lists (SQLi, traversal, DoS, privilege, log-injection, supply-chain) produced actionable P1s that correctness pass missed (iter-2)
- Cross-referencing iter-1 correctness findings from a security angle surfaced escalation paths (symlink = privesc; LIKE divergence = cleanup-evasion) without re-reporting (iter-2)

## Exhausted Approaches (do not retry)
- Single-dimension regex enumeration for invariants 1-3: fully covered in iter-001. Future iterations should focus on cross-cutting concerns (security, traceability, maintainability).
- SQL injection enumeration on cleanup script: verified parameterized end-to-end (iter-2). Do not re-check.
- DB_PATH tampering via CLI/env: `import.meta.url` resolution is not attacker-controllable (iter-2). Do not re-check.

## Review Instructions for Iteration Agent
- READ-ONLY on all scope files. Do NOT modify code or spec docs.
- Every P0/P1 finding MUST cite `file:line` with direct evidence.
- At each iteration's end, write a new `iterations/iteration-NNN.md` file.
- Append a JSONL record of the iteration to `deep-review-state.jsonl`.
- Update `deep-review-findings-registry.json` with consolidated findings.
- Stop conditions: convergence ratio < 0.10 AND all dimensions covered, OR iteration ≥ 7.
