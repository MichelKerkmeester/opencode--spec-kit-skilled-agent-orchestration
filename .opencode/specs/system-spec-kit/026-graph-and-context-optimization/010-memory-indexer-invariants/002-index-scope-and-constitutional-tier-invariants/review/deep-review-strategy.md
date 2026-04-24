# Deep Review Strategy — Packet 011

## Review Target
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-memory-indexer-invariants/002-index-scope-and-constitutional-tier-invariants`

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

## Next Focus (iteration 7)
Dimension: **exploit-chain synthesis + final sweep**. Priorities:
- **Exploit-chain validation for P0-001 + P0-002 compound attack**: can an attacker reach checkpoint_restore without admin privilege today? (Mirror of P0-001 reachability probe in iter-6.) Trace the end-to-end chain: poison → checkpoint_create → bulk_delete audit → checkpoint_restore.
- **Shadow-handler sweep**: iter-6 enumerated tool-schemas.ts. Iter-7 must sweep `memory-tools.ts` dispatch for any handler NOT in tool-schemas.ts (shadow handlers, test-only handlers reachable at runtime).
- **`canonical-path.ts` interaction with `isConstitutionalPath`**: iter-5 noted realpathSync is used for canonical_file_path computation. Does the canonical_file_path ever get consulted as input to `isConstitutionalPath`? If pre-symlink file_path and post-symlink canonical_file_path diverge, does the guard check the correct one?
- **Decision gate**: if iter-7 finds a 3rd P0, recommend FAIL verdict immediately and extend the review budget OR accept the current state. If zero new P0s, proceed to synthesis.

## Prior "Next Focus" — iteration 5 (executed)
Dimension: correctness (deeper pass). Priorities: revisit specificFiles edge cases, probe matchesScopedSpecFolder interplay, trace indexMemoryFileFromScan orphan paths, audit entry-guard asymmetry, contradiction scan across iter-1..iter-4. **Executed in iter-5 (resulted in P0-001).**

## Iteration Log
- **iter-001 (correctness) — complete**: 11 findings (P0: 0, P1: 6, P2: 5). Regex boundary semantics verified clean; save-time guard covers both direct + scan-originated saves; code-graph walker + specificFiles both gated. Main open risks: cleanup-script TOCTOU (plan outside transaction), FTS cleanup trigger unverified, symlink bypass on `path.resolve`, LIKE patterns diverge from regex semantics, no idempotence short-circuit, mutation-ledger stub no-op.
- **iter-002 (security) — complete**: 6 new findings (P0: 0, P1: 3, P2: 3). No exploitable RCE/SQLi. New P1s: log-injection in save-time downgrade WARN (parser-controlled file_path), silent tier downgrade with no governance audit row, walker DoS via unbounded readdirSync + whole-file .gitignore reads. New P2s: DB path disclosure on sqlite error, no machine-readable cleanup report, sqlite-vec supply-chain trust. Cross-referenced iter-1 findings with stronger security framing: P1-003 (privilege-escalation), P1-004 (cleanup-evasion), P2-002 (future PR risk). Ruled out: SQL injection, DB_PATH tampering, README case/directory attacks, ReDoS, excluded-path parse traces.
- **iter-003 (traceability) — complete**: 7 new findings (P0: 0, P1: 3, P2: 4). **DB TRUTH AUDIT GREEN**: all 6 implementation-summary.md DB claims verified live (constitutional_total=2, z_future=0, external=0, gate_enforcement=1, README not indexed, two constitutional paths match). New P1s: spec.md Status=In Progress contradicts Completed=Yes in impl-summary/checklist/tasks; stale `_memory.continuity` frontmatter in plan.md + decision-record.md + spec.md (completion_pct=20 while siblings are 100); plan.md DoD + Implementation Phases checkboxes still `[ ]` after full delivery. New P2s: stale open-question about README count (2-vs-3 resolved by ADR-005); feature_catalog + manual_testing_playbook have no entry for the three invariants; decision-record does not document packet 010/011 save-path composition; parent 026 graph-metadata.json has double-slash drift in child reference. Research.md file:line citations all resolve; test files all exist; ADR-004/ADR-005 supersede chain correctly recorded; parent 026 topology correctly references 011.
- **iter-004 (maintainability) — complete**: 9 new findings (P0: 0, P1: 3, P2: 6). Single-source-of-truth finding: THREE parallel exclusion lists govern spec-doc discovery (EXCLUDED_FOR_MEMORY + SPEC_DOCUMENT_EXCLUDED_SEGMENTS + walker-local SPEC_DOC_EXCLUDE_DIRS), each overlapping partially with the helper; `z_archive` is duplicated across two files; the walker's bare `'iterations'` diverges from the spec-doc-paths.ts `/research/iterations/` + `/review/iterations/` granularity. Zero inline back-references to packet 011 / ADR-004 / ADR-005 anywhere in shipped code — a future refactor of the soft-downgrade branch has no local signal. Cleanup script diverges from sibling `cleanup-orphaned-vectors.ts` on DB_PATH source (inline fileURLToPath vs shared @spec-kit/shared/paths import) and section banners. Tests do not cover `isConstitutionalPath` directly or guard ADR-005's readme-exclusion as a regression. No JSDoc on any exported function in index-scope.ts. `--verify` exit-code contract is unreferenced by any CI hook. Confirmed clean: no TODO/FIXME, no stray console.log, no commented-out blocks, no unused imports, no magic numbers.
- **iter-005 (correctness-deep) — complete; CONVERGENCE VETO**: 6 new findings (P0: 1, P1: 2, P2: 3). **First P0 discovered: memory_update MCP tool bypasses Invariant 3** — `handleMemoryUpdate` at `memory-crud-update.ts:67` validates `importanceTier` only against VALID_TIERS and passes it through to `vectorIndex.updateMemory` which writes `importance_tier = ?` via the dynamic SET builder at `vector-index-mutations.ts:399-403` with no `file_path` check. Tool is exposed on the public MCP surface (`tool-schemas.ts:295`, `memory-tools.ts:104`). Any MCP caller can promote any indexed memory to constitutional tier. P1s: memory_update missing governance_audit for tier changes; symlink-bypass design-level inconsistency (code-graph uses realpathSync with explicit SECURITY comment; memory-save does not). P2s: clear_constitutional_cache invalidation with no durable signal; README Invariants section omits memory_update; no regression test for memory_update tier transitions. Confirmed clean: reconsolidation merge path, lineage-state markHistoricalPredecessor, schema migration, attention-decay/retry-manager/corrections UPDATE paths, auto-surface hook.
- **iter-007 (exploit-chain synthesis + final sweep) — complete; CONVERGENCE VETO; FINAL**: 0 new findings, 1 refuted (P1-019). Exploit chain P0-001 → checkpoint_create → checkpoint_restore verified end-to-end reachable by ordinary MCP client (no admin/tenant/provenance gate on either P0 tool). Shadow-handler sweep: clean (no orphan handlers). Canonical-path audit: memory-save.ts:306 uses path.resolve (no symlink follow); new attack variant surfaced — symlink-INTO-constitutional-pointing-OUT causes double Invariant 1+3 violation (reinforces P1-003; remediation must use getCanonicalPathKey as guard input). Config-driven bypass grep: only test-env hook SPECKIT_TEST_DISABLE_CANONICAL_ROUTING; does not bypass invariants. P1-019 refuted: memory-save.ts:307 runs shouldIndexForMemory unconditionally before the tier check, so direct saves ARE gated. P1-011 spot-check: spec.md _memory.continuity still stale (completion_pct=20, recent_action="Packet scaffolded"). Synthesis report written to review/review-report.md. Final verdict: FAIL (two P0s). Stopping at max-iterations cap (7).
- **iter-006 (security-extended) — complete; CONVERGENCE VETO**: 4 new findings (P0: 1, P1: 2, P2: 1). **Second P0 discovered: checkpoint_restore bypasses Invariant 3** — `restoreCheckpoint` at `checkpoints.ts:1467` decompresses a snapshot blob (line 1492), parses JSON, and writes rows via `INSERT OR REPLACE INTO memory_index` (line 1544) or dynamic UPDATE (line 1552) with `importance_tier` and `file_path` taken DIRECTLY from the snapshot. `validateMemoryRow` at line 1258 checks TYPES only; never calls `isConstitutionalPath` or `shouldIndexForMemory`. Compound exploit with P0-001: poison → checkpoint → delete audit trail → restore. New P1s: `applyPostInsertMetadata` ALLOWED_POST_INSERT_COLUMNS allowlist includes `importance_tier` with no path check (structural fragility for all callers); `memory_save` direct-call bypasses walker's z_future/external exclusion because `prepareParsedMemoryForIndexing` only gates tier=constitutional, not the full `shouldIndexForMemory` predicate — Invariant 1/2 hold only on walker path. New P2: P0-001 reachability re-check — confirmed NO admin/provenance gate on memory_update tool. Attack-surface inventory table complete: 17 MCP tools audited (15 clean, 2 P0 bypasses). 9 INSERT sites + 10 UPDATE-tier sites grepped across mcp_server/ and scripts/. Confirmed clean: auto-promotion (PROMOTION_PATHS never targets constitutional; NON_PROMOTABLE_TIERS excludes constitutional sources), confidence-tracker.promoteToCritical (hard-coded 'critical'), memory_bulk_delete (requires specFolder scope for constitutional), memory_delete, memory_validate, memory_causal_*, memory_ingest_*, ccc_reindex/feedback, code_graph_*, chunking-orchestrator (post-guard parsed pass-through), pe-gating/reconsolidation/create-record/lineage-state (hardcoded deprecated or CASE-preserve). Noise floor MAD = 0.0; iter-6 ratio = 1.0; firmly above floor. Recommendation: iter-7 MUST continue finding (NOT synthesis-only); exploit-chain validation + shadow-handler sweep + canonical-path realpath audit.

## Running Findings
- Total open: 42 (P0: 2, P1: 18, P2: 22)
- Total resolved: 1 (P1-019 refuted in iter-7)
- Status: **complete** (verdict = FAIL; report at `review/review-report.md`)

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
