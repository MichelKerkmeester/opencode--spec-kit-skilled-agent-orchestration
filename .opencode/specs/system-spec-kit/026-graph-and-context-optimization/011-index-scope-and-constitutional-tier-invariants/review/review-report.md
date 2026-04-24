---
title: "Deep Review Report — Packet 011: Index Scope and Constitutional Tier Invariants"
verdict: "FAIL"
p0_count: 2
p1_count: 18
p2_count: 22
sessionId: "2026-04-24T08:04:38.636Z"
iterations: 7
max_iterations: 7
stop_reason: "maxIterationsReached (P0 convergence veto in effect)"
release_readiness_state: "fail"
---

# Deep Review Report — Packet 011: Index Scope and Constitutional Tier Invariants

## 1. Executive Summary

**Verdict: FAIL — release-blocking.**

Packet 011 delivers a shared path-exclusion helper (`index-scope.ts`) plus save-time guard and cleanup script that correctly enforce all three user-directed invariants on the `memory_save` INSERT path. However, deep review revealed that Invariant 3 (constitutional tier restricted to files under `/constitutional/`) is bypassed on TWO other write paths that were not audited during implementation: **`memory_update` promotes arbitrary memories to constitutional tier without any path check (P0-001)**, and **`checkpoint_restore` hydrates raw `(file_path, importance_tier)` pairs from snapshot blobs with only TYPE-level validation (P0-002)**. Both tools are reachable by any MCP client on the public surface — no admin, tenant, or provenance gate. A compound exploit chain (poison via memory_update → snapshot → restore) is reachable end-to-end and would inject attacker-controlled content into every session's constitutional auto-surface.

- Top-line counts: **P0 = 2, P1 = 18, P2 = 22** (43 open findings)
- Remediation urgency: Wave 1 (P0 patches) BLOCKING for release; Wave 2 (P1 defense-in-depth) REQUIRED within the same packet cycle; Wave 3 (P2 maintainability) OPTIONAL

## 2. Methodology

- **7 iterations** across 4 review dimensions (correctness × 2, security × 2, traceability, maintainability, plus a final exploit-chain synthesis)
- **Agent-based externalized state**: `deep-review-state.jsonl` log, `deep-review-findings-registry.json` registry, per-iteration `iterations/iteration-NNN.md` artifacts, per-iteration `deltas/iter-NNN.jsonl` deltas. Fresh context per iteration.
- **Live DB verification** for traceability claims: direct SQL queries against `context-index__voyage__voyage-4__1024.sqlite` confirmed every quantitative claim in `implementation-summary.md` (constitutional_total=2, z_future=0, external=0, gate_enforcement_rows=1, two constitutional paths match, README not indexed).
- **File:line evidence** on every P0 and P1 finding; typed claim-adjudication packets (claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, downgradeTrigger) on every P0.
- **Hunter/Skeptic/Referee adversarial self-check** run on both P0 candidates; both survived skeptic challenge (reachability re-checked, alternative interpretations explored).
- **Severity-weighted newFindingsRatio**: iter-1..7 ratios = [1.0, 0.77, 0.81, 1.0, 1.0, 1.0, 0.0]; MAD noise floor = 0.0; P0 override kept convergence blocked through iter-6; iter-7 ratio fell to 0.0 (zero new findings, one refuted) — would have converged if not for the two open P0s.

## 3. Verdict and Rationale

**FAIL (release-blocking).**

- **Why FAIL rather than CONDITIONAL:** two active P0s violate binary quality gates. Either P0 alone is release-blocking per the sk-code-review severity rubric (P0 = user-facing correctness or security issue requiring resolution before release). The compound attack chain composes them into a stronger single vulnerability.
- **Why not PASS (even if P0s were absent):** the P1 density (18 findings concentrated on chain integrity, race windows, audit gaps, documentation drift, maintainability debt, walker DoS) indicates insufficient defense-in-depth; a PASS would misrepresent the packet as release-worthy by minimum rubric.
- **Explicit decision:** packet 011 CANNOT ship as release-worthy until Wave-1 remediation lands (P0-001, P0-002, and the governance_audit gap from P1-008/P1-016 that otherwise hides the attack).

Confidence in FAIL: 0.95. Downgrade trigger: Wave-1 patches land with regression tests AND remediation review confirms zero new P0s.

## 4. Findings by Severity

### P0 (2 — both release-blocking)

- **P0-001 — `memory_update` bypasses Invariant 3 via arbitrary tier promotion**
  - Files: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:67, 87, 149`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:399-403`; public surface at `tool-schemas.ts:294-297`, `tools/memory-tools.ts:104`
  - Description: `handleMemoryUpdate` validates `importanceTier` only against `VALID_TIERS` (6 string literals) and passes it through to `updateMemory` which writes `importance_tier = ?` via a dynamic SET builder with no `file_path` coupling. The MCP tool is exposed to any caller with zero admin/provenance gate. Any client can invoke `memory_update({ id: <any-id>, importanceTier: 'constitutional' })` and the row's tier becomes constitutional regardless of its `file_path`. The row then surfaces in every session's auto-surface constitutional prelude (`hooks/memory-surface.ts:187`). Defeats the user-directed invariant completely.
  - Iteration first seen: 5

- **P0-002 — `checkpoint_restore` hydrates raw `(file_path, importance_tier)` pairs with no invariant re-assertion**
  - Files: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1467-1570` (restoreCheckpoint body), `:1492` (JSON parse), `:1544` (INSERT OR REPLACE INTO memory_index), `:1552` (UPDATE memory_index SET ...), `:1258-1282` (validateMemoryRow — TYPE-only checks); public surface at `tool-schemas.ts:363-377`, `tools/checkpoint-tools.ts:36`
  - Description: `restoreCheckpoint` decompresses the `memory_snapshot` blob, parses JSON row-by-row, and writes rows via `INSERT OR REPLACE` or dynamic `UPDATE` using `importance_tier` and `file_path` columns DIRECTLY from the snapshot. `validateMemoryRow` checks only types (id is finite number, file_path is non-empty string, required columns present); never calls `isConstitutionalPath` or `shouldIndexForMemory`. An attacker with any prior Invariant-3 bypass (notably P0-001) can create a checkpoint that captures the poisoned state, then the restore re-hydrates arbitrary `(file_path, importance_tier)` combinations. Checkpoints are presented as a safety/recovery mechanism, making this an especially grave regression on operator trust.
  - Iteration first seen: 6

**Compound exploit chain (iter-7 verification):** poison via `memory_update` → snapshot via `checkpoint_create` → optional ledger purge via `memory_bulk_delete` (tier=deprecated) → re-hydrate via `checkpoint_restore`. Every step reachable by an ordinary MCP client (no admin/tenant/provenance gate on either P0 tool). See `iterations/iteration-007.md §A.1` for full step-by-step evidence.

### P1 (18 — grouped by theme)

**Theme: chain integrity / structural fragility (6 findings)**
- **P1-008** — Silent tier downgrade indexes attacker-declared-constitutional content; no governance audit row (`memory-save.ts:310-314`)
- **P1-016** — `memory_update` writes no governance_audit on tier changes; successful attack leaves no typed audit signal (`memory-crud-update.ts:201, 220`)
- **P1-018** — `applyPostInsertMetadata` allowlist includes `importance_tier` with no path check; structural fragility for all current and future callers (`post-insert-metadata.ts:54, 80, 104`)
- **P1-003** — Symlink bypass: `path.resolve` does not follow symlinks (`memory-save.ts:306`)
- **P1-017** — Design-level inconsistency: `code-graph/handlers/scan.ts:135` uses `realpathSync` with explicit SECURITY comment; `memory-save.ts:306` does not
- **P1-009** — Walker DoS: unbounded `readdirSync` + whole `.gitignore` reads (`structural-indexer.ts:1162, 1206`; `memory-index-discovery.ts:68, 218`)

**Theme: cleanup-script correctness (5 findings)**
- **P1-001** — Cleanup builds plan outside transaction (TOCTOU window before `--apply`) (`cleanup-index-scope-violations.ts:376, 399`)
- **P1-002** — FTS cleanup relies on assumed trigger with no runtime verification (`cleanup-index-scope-violations.ts:46, 281`)
- **P1-004** — Cleanup LIKE patterns miss rows with no leading slash (semantic divergence from runtime regex) (`cleanup-index-scope-violations.ts:99, 103, 107, 117`)
- **P1-005** — Cleanup `--apply` has no idempotence short-circuit (`cleanup-index-scope-violations.ts:394, 399`)
- **P1-006** — `stripDeletedIdsFromMutationLedger` is a silent no-op stub (`cleanup-index-scope-violations.ts:232, 293`)

**Theme: log-injection / audit gaps (1 finding)**
- **P1-007** — Log-injection in save-time downgrade WARN: parser-controlled `file_path` logged verbatim with no control-char strip (`memory-save.ts:311, 319`)

**Theme: spec-doc / traceability drift (3 findings)**
- **P1-010** — `spec.md` Status=In Progress contradicts verified delivered state (`spec.md:56`)
- **P1-011** — Stale `_memory.continuity` frontmatter in `plan.md`, `decision-record.md`, `spec.md` (completion_pct=20 vs 100% elsewhere) — confirmed still stale at iter-7
- **P1-012** — `plan.md` Implementation Phases + DoD checkboxes remain unchecked after completion (`plan.md:59, 62, 87, 100`)

**Theme: maintainability / single-source-of-truth (3 findings)**
- **P1-013** — Parallel exclusion lists in `spec-doc-paths.ts` duplicate `index-scope.ts` invariants (`spec-doc-paths.ts:29, 34, 40`)
- **P1-014** — Third exclusion source in `memory-index-discovery.ts` (`SPEC_DOC_EXCLUDE_DIRS`) with partial overlap and `iterations` granularity drift (`memory-index-discovery.ts:28, 73, 224`)
- **P1-015** — Zero code back-references to packet 011, ADR-004, or ADR-005 anywhere in shipped code (`memory-save.ts:306, 310, 314` and related sites) — compounds with every other structural-fragility finding

> **Note on refuted finding:** P1-019 (iter-6, "memory_save direct-call bypasses walker's z_future/external exclusion") was REFUTED in iter-7. Re-read of `memory-save.ts:298-320` confirmed line 307 unconditionally runs `shouldIndexForMemory(canonicalFilePath)` BEFORE the tier check at line 310; any `z_future/external/z_archive` path throws immediately on direct save. The walker is NOT the sole enforcement; direct saves are gated. P1-019 is removed from the open-finding list (count: 18, not 19).

### P2 (22 — grouped by theme)

**Theme: correctness — regex / enforcement edge cases (5 findings)**
- **P2-001** — `isConstitutionalPath` recompiles regex per call (`index-scope.ts:50, 52`)
- **P2-002** — README.md rejection is defense-in-depth by coincidence (`memory-parser.ts:955, 979`)
- **P2-003** — Two guard invocations with different input normalization (`memory-save.ts:306, 2695`)
- **P2-004** — `EXCLUDED_FOR_CODE_GRAPH` blanket-excludes any `dist` segment (`index-scope.ts:36`)
- **P2-005** — Cleanup `collectSummary.zFutureRows` mixes OR conditions that delete cannot match (`cleanup-index-scope-violations.ts:99, 118`)

**Theme: security hygiene (3 findings)**
- **P2-006** — Cleanup `console.error` leaks absolute DB path on better-sqlite3 I/O failure (`cleanup-index-scope-violations.ts:407`)
- **P2-007** — Cleanup produces no machine-readable report (`cleanup-index-scope-violations.ts:337, 361, 378, 405`)
- **P2-008** — Supply-chain: sqlite-vec native extension loaded unconditionally in cleanup (`cleanup-index-scope-violations.ts:6, 374`)

**Theme: traceability / documentation coverage (4 findings)**
- **P2-009** — `spec.md` Section 13 open-question about README count (2 vs 3) is stale after ADR-005 (`spec.md:291, 294`)
- **P2-010** — `feature_catalog` + `manual_testing_playbook` carry no entry for the three invariants or `index-scope` helper
- **P2-011** — `decision-record` does not document packet 010/011 composition for save-path defense-in-depth (`decision-record.md:51`)
- **P2-012** — Parent 026 `graph-metadata.json` child reference contains double-slash drift (`graph-metadata.json:17`)

**Theme: maintainability (6 findings)**
- **P2-013** — Cleanup script diverges from sibling-script conventions (DB_PATH source, banners) (`cleanup-index-scope-violations.ts:1, 57`)
- **P2-014** — No test-visible access to `compileSegmentPattern` / `normalizeIndexScopePath` / `isConstitutionalPath` (`index-scope.vitest.ts:7, 11, 49`)
- **P2-015** — `index-scope.ts` has no JSDoc on any exported function (`index-scope.ts:42, 46, 50`)
- **P2-016** — Tests do not lock in that `readme.md` is excluded under `/constitutional/` (`index-scope.vitest.ts:49, 114`)
- **P2-017** — Operator-facing `--verify` has no CI hook documented (`cleanup-index-scope-violations.ts:386, 392`)
- **P2-018** — Function naming: `shouldIndexForMemory` ambiguous with RAM vs memory-system-index (`index-scope.ts:42, 46`)

**Theme: cross-cutting from iter-5 / iter-6 (4 findings)**
- **P2-019** — `update_memory` silently invalidates constitutional cache on every tier change; no durable signal distinguishing legitimate vs attempted promotions (`vector-index-mutations.ts:402`)
- **P2-020** — `mcp_server/README.md` Invariants section omits memory_update UPDATE path (and, post-iter-6, checkpoint_restore + post-insert-metadata) (`README.md:111-116`)
- **P2-021** — No regression test for `memory_update` tier-promotion scenarios (`tests/memory-save-index-scope.vitest.ts:326, 379`)
- **P2-022** — P0-001 reachability re-check — confirmed exposed on public MCP surface with no admin/provenance gate (`tools/memory-tools.ts:70, 104`)

## 5. Invariant Health Matrix

| Invariant | Coverage at INSERT (memory_save) | Coverage at UPDATE (memory_update) | Coverage via checkpoint_restore | Coverage via direct-DB-write (applyPostInsertMetadata, lineage, reconsolidation) | Verdict |
|---|---|---|---|---|---|
| **1. `/z_future/*` NEVER indexed** | YES — `shouldIndexForMemory` at `memory-save.ts:307` throws; walker excludes | N/A (memory_update does not touch `file_path`) | **NO — `validateMemoryRow` does not check `file_path` against `EXCLUDED_FOR_MEMORY`** | Transitively safe TODAY (all callers pass post-guard `parsed.importanceTier` — but structural fragility flagged in P1-018) | **PARTIAL — checkpoint_restore gap** |
| **2. `/external/*` NEVER indexed** (memory + code-graph) | YES — `shouldIndexForMemory` at `memory-save.ts:307`; code-graph `shouldIndexForCodeGraph` | N/A | **NO — checkpoint_restore accepts external paths** | Transitively safe TODAY | **PARTIAL — checkpoint_restore gap** |
| **3. `constitutional` tier ONLY for `/constitutional/` paths** | YES — guard at `memory-save.ts:310` downgrades | **NO — P0-001: `memory_update` accepts arbitrary tier with no path check** | **NO — P0-002: `checkpoint_restore` writes raw `importance_tier` from snapshot** | Transitively safe TODAY via `parsed.importanceTier` (post-guard) — but `applyPostInsertMetadata` allowlist includes the column with no path check (P1-018 structural fragility) | **FAIL — two bypass paths** |
| **4. README.md excluded from `/constitutional/`** | YES — walker + parser both reject (`memory-index-discovery.ts:170-180`, `memory-parser.ts:955-960`) | N/A | **NO — `validateMemoryRow` does not reject `file_path` ending in `readme.md`** | N/A | **PARTIAL — checkpoint_restore gap** |

**Summary:** only the `memory_save` INSERT path enforces all four invariants. `memory_update` leaves Invariant 3 unguarded. `checkpoint_restore` leaves ALL FOUR unguarded (because `validateMemoryRow` is type-only). Direct-DB-write paths are transitively safe today but structurally fragile.

## 6. Remediation Plan

### Wave 1 — Pre-release, BLOCKING

1. **Patch P0-001: add constitutional-path guard to `memory_update`**
   - Files: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts` (add guard after line 75 where `existing` row is fetched); optionally lift guard into `vector-index-mutations.ts:399` so all UPDATE callers are covered
   - Fix: before writing `importance_tier`, if the new tier is `'constitutional'`, call `isConstitutionalPath(existing.file_path)` and either reject the update or downgrade to `'important'` with a governance_audit record
   - Regression test: `mcp_server/tests/memory-update-index-scope.vitest.ts` (new file) — assert `handleMemoryUpdate({ id, importanceTier: 'constitutional' })` on a row whose `file_path` is not under `/constitutional/` either rejects or downgrades

2. **Patch P0-002: re-validate every row on `checkpoint_restore`**
   - File: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts` (extend `validateMemoryRow` at line 1258-1282 OR add a row-level guard just before the INSERT OR REPLACE batch at line 1544 and UPDATE batch at line 1552)
   - Fix: for each row, if `row.importance_tier === 'constitutional'` AND `!isConstitutionalPath(row.file_path)` → reject (preferred) or downgrade; if `!shouldIndexForMemory(row.file_path)` → reject the row entirely (covers Invariants 1+2)
   - Run the validation inside the barrier-held transaction so a single bad row halts the entire restore atomically
   - Regression test: add a checkpoint fixture with a seeded `(file_path='specs/foo/bar.md', importance_tier='constitutional')` row and assert restore rejects it

3. **Add governance_audit on tier transitions (P1-008 + P1-016 compounded)**
   - File: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:310-314` AND `memory-crud-update.ts` post-update hook
   - Fix: when the save guard downgrades a constitutional-tier save, write a `governance_audit` row with `event_type='tier_downgrade_invariant_3'` and the pre/post tier + file_path. Likewise for `memory_update` tier changes touching constitutional. Closes the audit gap that hides successful attacks.

### Wave 2 — Post-release, REQUIRED (same packet cycle)

4. **Unify exclusion sources — `index-scope.ts` as SSOT (P1-013 + P1-014)**
   - Files: `.opencode/skill/system-spec-kit/mcp_server/lib/config/spec-doc-paths.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts`
   - Fix: remove parallel `SPEC_DOCUMENT_EXCLUDED_SEGMENTS` and `SPEC_DOC_EXCLUDE_DIRS` in favor of `EXCLUDED_FOR_MEMORY` (or explicit overlays with a single-source-of-truth import). Resolve `iterations` granularity drift by using specific paths (`/research/iterations/`, `/review/iterations/`).

5. **Realpath resolution at memory-save guard input (P1-003 + P1-017)**
   - File: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:306`
   - Fix: replace `path.resolve(parsed.filePath)` with `getCanonicalPathKey(parsed.filePath)` so symlinks under `/constitutional/` that point OUT (to `/z_future/` or `/external/`) are caught. Matches the doctrine already in use at `code-graph/handlers/scan.ts:135`.

6. **Cleanup script TOCTOU + idempotence + mutation-ledger stub (P1-001 + P1-005 + P1-006)**
   - File: `.opencode/skill/system-spec-kit/scripts/memory/cleanup-index-scope-violations.ts`
   - Fix: move `buildPlan` inside the SQLite transaction so the read-for-plan and the write-for-apply happen under the same lock. Add early-exit when `before` summary shows zero violations. Implement `stripDeletedIdsFromMutationLedger` (or delete the stub).

7. **Walker DoS bounds (P1-009)**
   - Files: `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts`
   - Fix: add max-depth and max-node-count bounds on `readdirSync` walks; cap `.gitignore` read size; memoize per-directory `.gitignore` parse.

8. **Log-injection strip on save-time WARN (P1-007)**
   - File: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:311, 319`
   - Fix: strip newlines / control chars from `parsed.filePath` before logging.

### Wave 3 — Optional (maintainability)

9. **Inline ADR back-references + JSDoc (P1-015, P2-015)** — add inline comments linking to `ADR-004` / `ADR-005` at every guard site; JSDoc on exported functions in `index-scope.ts`.
10. **CI `--verify` hook (P2-017)** — wire cleanup `--verify` into the test or CI job chain.
11. **Feature catalog + playbook entries (P2-010)** — add entries for the three invariants + index-scope helper.
12. **Spec-doc continuity fixes (P1-010, P1-011, P1-012, P2-009, P2-011, P2-012)** — refresh `_memory.continuity` in `spec.md`/`plan.md`/`decision-record.md`; tick DoD checkboxes; resolve stale open-question; fix double-slash in parent 026 `graph-metadata.json`.

## 7. Evidence Inventory

| Iteration | Dimension | Findings (P0/P1/P2) | Artifact |
|---|---|---|---|
| 1 | correctness | 0/6/5 | `review/iterations/iteration-001.md` |
| 2 | security | 0/3/3 | `review/iterations/iteration-002.md` |
| 3 | traceability | 0/3/4 | `review/iterations/iteration-003.md` |
| 4 | maintainability | 0/3/6 | `review/iterations/iteration-004.md` |
| 5 | correctness-deep | 1/2/3 (P0-001 discovered) | `review/iterations/iteration-005.md` |
| 6 | security-extended | 1/2/1 (P0-002 discovered; P1-019 later refuted) | `review/iterations/iteration-006.md` |
| 7 | exploit-chain synthesis | 0/0/0 (P1-019 refuted) | `review/iterations/iteration-007.md` |

Final totals: **P0=2, P1=18 (was 19 — P1-019 refuted), P2=22.** Per-iteration deltas in `review/deltas/iter-NNN.jsonl`.

## 8. Convergence Signals

- **Per-iteration newFindingsRatio (severity-weighted):** `[1.0, 0.77, 0.81, 1.0, 1.0, 1.0, 0.0]`
- **MAD noise floor:** median of [1.0, 0.77, 0.81, 1.0, 1.0, 1.0] = 1.0; absDeviations = [0, 0.23, 0.19, 0, 0, 0]; MAD = 0.0; threshold = MAD * 1.4826 * 1.4 = **0.0**
- **Did convergence criteria hit?** iter-7 ratio (0.0) IS at the floor, which would satisfy convergence in a vacuum. But **P0 override is in effect**: two P0s still open (P0-001 from iter-5, P0-002 from iter-6). Per strategy §P0 override rule, ANY open P0 blocks convergence. So convergence was NOT allowed.
- **Dimension coverage:** all 4 (correctness, security, traceability, maintainability) covered; plus two additional synthesis iterations (correctness-deep, security-extended).
- **Why we stopped at 7:** user-specified cap (`maxIterations: 7`); not convergence-driven. If the budget were higher, iter-8 would focus on Wave-1 remediation verification rather than further discovery.

## 9. Next Actions

1. **Hand off to `/spec_kit:plan`** for Wave-1 remediation planning. Use this report as the source-of-truth for scope and acceptance criteria.
2. **Commit + push recommendation:** commit this `review/` packet (`review-report.md`, `iterations/iteration-00{1..7}.md`, `deep-review-findings-registry.json`, `deep-review-state.jsonl`, `deltas/iter-00{1..7}.jsonl`) before starting remediation. The packet is the durable audit trail.
3. **Follow-up dispatch:** run a focused remediation session (e.g., `codex exec` or `cli-copilot` patch run) targeted at P0-001 + P0-002 + governance_audit gap (Wave 1 only). Verify with a new `@deep-review` pass of ≥3 iterations against the patched code BEFORE closing the packet.
4. **Do NOT mark packet 011 complete, do NOT advance `completion_pct` past current, do NOT run `/create:changelog`** until Wave-1 lands and passes re-review.
5. **Consider a spec update**: either tighten Invariant 3 to cover UPDATE + restore paths explicitly, or document the current carve-out in a decision-record. The user-directed invariant is absolute; the implementation should match that absolutism.

---

**Report generated:** 2026-04-24T14:00:00Z
**Session:** 2026-04-24T08:04:38.636Z (generation 1, lineageMode=new)
**Iterations executed:** 7 of 7
**Verdict:** FAIL — two release-blocking P0s open
