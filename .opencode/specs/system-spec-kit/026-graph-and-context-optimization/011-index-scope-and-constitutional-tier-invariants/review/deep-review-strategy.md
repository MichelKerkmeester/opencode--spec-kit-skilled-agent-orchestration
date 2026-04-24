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

## Next Focus (iteration 5)
Dimension: **correctness (deeper pass)**. Priorities:
- Revisit `structural-indexer.ts:1254` specificFiles edge cases beyond symlink (P1-003): relative paths with `..`, paths resolving cross-workspace, real-target outside rootDir.
- Probe `matchesScopedSpecFolder` (discovery) interplay with `shouldIndexForMemory` — does a `specFolder` scoped to `z_future/foo/` silently produce empty results or crash?
- Trace `indexMemoryFileFromScan` for a path where `shouldIndexForMemory=true` but `canClassifyAsSpecDocument=false` (e.g., `.md` outside `/specs/`) — confirm no orphan row.
- Audit entry-guard asymmetry at `memory-save.ts:2695` vs deep guard at `306` (P2-003 iter-1 needs expansion).
- Contradiction scan across iter-1..iter-4 findings: any finding's "ruled out" colliding with another's "P1"? Surface inconsistencies before synthesis.

## Iteration Log
- **iter-001 (correctness) — complete**: 11 findings (P0: 0, P1: 6, P2: 5). Regex boundary semantics verified clean; save-time guard covers both direct + scan-originated saves; code-graph walker + specificFiles both gated. Main open risks: cleanup-script TOCTOU (plan outside transaction), FTS cleanup trigger unverified, symlink bypass on `path.resolve`, LIKE patterns diverge from regex semantics, no idempotence short-circuit, mutation-ledger stub no-op.
- **iter-002 (security) — complete**: 6 new findings (P0: 0, P1: 3, P2: 3). No exploitable RCE/SQLi. New P1s: log-injection in save-time downgrade WARN (parser-controlled file_path), silent tier downgrade with no governance audit row, walker DoS via unbounded readdirSync + whole-file .gitignore reads. New P2s: DB path disclosure on sqlite error, no machine-readable cleanup report, sqlite-vec supply-chain trust. Cross-referenced iter-1 findings with stronger security framing: P1-003 (privilege-escalation), P1-004 (cleanup-evasion), P2-002 (future PR risk). Ruled out: SQL injection, DB_PATH tampering, README case/directory attacks, ReDoS, excluded-path parse traces.
- **iter-003 (traceability) — complete**: 7 new findings (P0: 0, P1: 3, P2: 4). **DB TRUTH AUDIT GREEN**: all 6 implementation-summary.md DB claims verified live (constitutional_total=2, z_future=0, external=0, gate_enforcement=1, README not indexed, two constitutional paths match). New P1s: spec.md Status=In Progress contradicts Completed=Yes in impl-summary/checklist/tasks; stale `_memory.continuity` frontmatter in plan.md + decision-record.md + spec.md (completion_pct=20 while siblings are 100); plan.md DoD + Implementation Phases checkboxes still `[ ]` after full delivery. New P2s: stale open-question about README count (2-vs-3 resolved by ADR-005); feature_catalog + manual_testing_playbook have no entry for the three invariants; decision-record does not document packet 010/011 save-path composition; parent 026 graph-metadata.json has double-slash drift in child reference. Research.md file:line citations all resolve; test files all exist; ADR-004/ADR-005 supersede chain correctly recorded; parent 026 topology correctly references 011.
- **iter-004 (maintainability) — complete**: 9 new findings (P0: 0, P1: 3, P2: 6). Single-source-of-truth finding: THREE parallel exclusion lists govern spec-doc discovery (EXCLUDED_FOR_MEMORY + SPEC_DOCUMENT_EXCLUDED_SEGMENTS + walker-local SPEC_DOC_EXCLUDE_DIRS), each overlapping partially with the helper; `z_archive` is duplicated across two files; the walker's bare `'iterations'` diverges from the spec-doc-paths.ts `/research/iterations/` + `/review/iterations/` granularity. Zero inline back-references to packet 011 / ADR-004 / ADR-005 anywhere in shipped code — a future refactor of the soft-downgrade branch has no local signal. Cleanup script diverges from sibling `cleanup-orphaned-vectors.ts` on DB_PATH source (inline fileURLToPath vs shared @spec-kit/shared/paths import) and section banners. Tests do not cover `isConstitutionalPath` directly or guard ADR-005's readme-exclusion as a regression. No JSDoc on any exported function in index-scope.ts. `--verify` exit-code contract is unreferenced by any CI hook. Confirmed clean: no TODO/FIXME, no stray console.log, no commented-out blocks, no unused imports, no magic numbers.

## Running Findings
- Total open: 33 (P0: 0, P1: 15, P2: 18)
- Next dimension: correctness (deeper pass)

## What Worked (iter-001, iter-002, iter-003)
- Direct regex mental-execution with node confirmed boundary behavior on 15+ edge-case paths (iter-1)
- Reading both helpers and consumers confirmed no-gap coverage at indexing entrypoints (iter-1)
- Test files (`index-scope.vitest.ts`, `memory-save-index-scope.vitest.ts`) confirm the positive paths empirically (iter-1)
- Threat-model question lists (SQLi, traversal, DoS, privilege, log-injection, supply-chain) produced actionable P1s that correctness pass missed (iter-2)
- Cross-referencing iter-1 correctness findings from a security angle surfaced escalation paths (symlink = privesc; LIKE divergence = cleanup-evasion) without re-reporting (iter-2)
- Live DB sqlite3 queries against the Voyage-4 DB anchored every quantitative claim in implementation-summary.md and confirmed zero falsified claims (iter-3)
- Cross-document frontmatter diff (tasks.md/checklist.md/impl-summary.md at completion_pct=100 vs plan.md/DR/spec.md at completion_pct=20) surfaced three-doc stale-continuity drift in one pass (iter-3)
- Overlay grep on feature_catalog + manual_testing_playbook caught documentation scope gaps without relying on trigger-word enumeration (iter-3)

## Exhausted Approaches (do not retry)
- Single-dimension regex enumeration for invariants 1-3: fully covered in iter-001. Future iterations should focus on cross-cutting concerns (security, traceability, maintainability).
- SQL injection enumeration on cleanup script: verified parameterized end-to-end (iter-2). Do not re-check.
- DB_PATH tampering via CLI/env: `import.meta.url` resolution is not attacker-controllable (iter-2). Do not re-check.
- DB truth audit (quantitative claim verification): all six impl-summary claims verified green in iter-3. Do not re-check unless DB is mutated.
- Research.md file:line citation resolution: sampled + confirmed in iter-3. Line drift within ±3 is tolerable convention here.
- Checklist count integrity (P0=14, P1=16): enumerated and matches summary in iter-3. Do not re-count.
- Parent 026 topology inclusion of 011: confirmed in description.json + graph-metadata.json. Double-slash drift logged as P2-012; do not re-enumerate.

## Review Instructions for Iteration Agent
- READ-ONLY on all scope files. Do NOT modify code or spec docs.
- Every P0/P1 finding MUST cite `file:line` with direct evidence.
- At each iteration's end, write a new `iterations/iteration-NNN.md` file.
- Append a JSONL record of the iteration to `deep-review-state.jsonl`.
- Update `deep-review-findings-registry.json` with consolidated findings.
- Stop conditions: convergence ratio < 0.10 AND all dimensions covered, OR iteration ≥ 7.
