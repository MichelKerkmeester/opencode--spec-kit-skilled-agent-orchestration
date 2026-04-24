---
title: "Deep Review Report — Pass 2 · Packet 011: Wave-1 Remediation Verification"
verdict: "CONDITIONAL"
p0_count: 0
p1_count_new_pass2: 1
p1_count_pass1_open_inherited: 14
p2_count_new_pass2: 7
pass1_findings_closed_by_wave1: 8
sessionId: "2026-04-24T09:48:20.783Z"
parentSessionId: "2026-04-24T08:04:38.636Z"
lineageMode: "restart"
generation: 2
pass: 2
iterations: 7
max_iterations: 7
stop_reason: "converged+maxIterations"
release_readiness_state: "conditional"
pass1_verdict: "FAIL"
pass1_ref: "../review/review-report.md"
---

# Deep Review Report — Pass 2 · Packet 011: Wave-1 Remediation Verification

## 1. Executive Summary

**Verdict: CONDITIONAL — Wave-1 IS release-worthy; Wave-2 backlog remains.**

Pass-1 verdict was **FAIL** (2 active P0s, 18 P1s, 22 P2s). Wave-1 remediation targeted the 5 release-blocking findings (P0-001, P0-002, P1-008, P1-016, P1-018) and pass-2 verification confirms **5/5 closed** with the compound pass-1 exploit chain **fully severed** at every named guard. Pass-2 P0 count = **0**. One new P1 (`P1-pass2-004`: cleanup-script audit gap) and 7 new P2s were discovered during the deeper probe of the patched surface; 3 additional pass-1 traceability P1s (P1-010/011/012) also closed this pass as a side-effect of the Wave-1 continuity-block refresh. The remaining 14 pass-1 P1s are pre-existing Wave-2 scope (TOCTOU, symlink, SSOT exclusion, FTS trigger, walker DoS, ADR back-refs, etc.) and were **not regressed** by Wave-1. Release-readiness: the Wave-1 patched surface clears the binary quality gates for P0 and for the Wave-1 scope; the packet can ship the Wave-1 patches as-is, with Wave-2 tracked as a follow-up remediation cycle.

- Top-line pass-2 new findings: **P0=0, P1=1 (new), P2=7 (new)**
- Pass-1 findings closed by Wave-1 (verified this pass): **8** (P0-001, P0-002, P1-008, P1-010, P1-011, P1-012, P1-016, P1-018)
- Remaining pass-1 P1s inherited as Wave-2 scope: **14** (no regressions)

## 2. Methodology Delta (pass-1 → pass-2)

| Axis | Pass 1 | Pass 2 |
|---|---|---|
| Iterations | 7 | 7 |
| Session | `2026-04-24T08:04:38.636Z` (gen 1, lineageMode=new) | `2026-04-24T09:48:20.783Z` (gen 2, lineageMode=restart, parentSessionId=pass-1) |
| Total findings surfaced | 42 (2 P0 + 18 P1 + 22 P2) | 8 new (0 P0 + 1 P1 + 7 P2) + 8 pass-1 closures verified |
| Verdict | FAIL (release-blocking) | CONDITIONAL (Wave-1 cleared) |
| Dimensions | correctness × 2, security × 2, traceability, maintainability, exploit-chain synthesis | correctness-P0-001, correctness-P0-002, audit-trail (P1-008+P1-016), maintainability, traceability, regression-exploit-chain, synthesis |
| Primary posture | Discovery | Closure verification + regression scan |
| Probe depth | Original surface | **Deeper probe of the patched surface** (Wave-1 attack-surface weaponization tests, 12-site SQL-write census, chain re-walk) |
| Severity threshold | P2 | P2 |
| Convergence algo | severity-weighted ratio, MAD floor, P0 override | Same |

Pass-2 was deliberately structured to verify Wave-1 closure BEFORE broadening. Iter-1 and iter-2 directly target the two pass-1 P0s; iter-3 verifies the audit-trail gap; iter-4 probes patch debt (maintainability); iter-5 re-validates traceability against the refreshed packet docs; iter-6 re-walks the full 5-step exploit chain against the current code tree with fresh reads; iter-7 synthesizes.

## 3. Wave-1 Closure Verdict

All 5 Wave-1 targets verified closed against current code with file:line evidence.

| Target | Status | Primary Evidence |
|---|---|---|
| **P0-001** `memory_update` bypass of Invariant 3 | **CLOSED** | SQL-layer guard at `lib/search/vector-index-mutations.ts:456-478` (inside `update_memory` txn); call-site audit 12/12 clean; 8 bypass probes run, 0 findings. Handler-layer narrow re-verification audit at `handlers/memory-crud-update.ts:153-208`. Test coverage: `tests/memory-crud-update-constitutional-guard.vitest.ts` (both downgrade and preservation branches exercised). |
| **P0-002** `checkpoint_restore` bypass via raw `(file_path, importance_tier)` rehydration | **CLOSED** | `validateMemoryRow` extended at `lib/storage/checkpoints.ts:1291-1360` (adds `shouldIndexForMemory` + `isConstitutionalPath`); pre-flight sweep INSIDE the restore transaction at `:1637-1645` BEFORE any INSERT/UPDATE; atomic rollback via `database.transaction(...)` at `:1636`; governance_audit flush in the OUTER `finally` at `:1847-1849` (survives rollback). 7 bypass probes run, 0 findings. Test: `tests/checkpoint-restore-invariant-enforcement.vitest.ts` (3 scenarios: clean preservation, poisoned downgrade, walker-excluded atomic abort + rollback). |
| **P1-008** save-time audit gap | **CLOSED** | `handlers/memory-save.ts:314-336` emits typed `tier_downgrade_non_constitutional_path` row with `decision='conflict'`, `source='memory_save'`. Canonical writer: `lib/governance/scope-governance.ts:314-334`. Audit emitted pre-transaction so survives rollback. |
| **P1-016** update-time audit gap | **CLOSED** | SQL-layer emit via `tryRecordTierDowngradeAudit` at `lib/search/vector-index-mutations.ts:76-114` (called from `update_memory` :465). Handler narrow re-verification audit at `handlers/memory-crud-update.ts:182-207` for `previousTier='constitutional' && nextTier='important'`. Both routed through canonical `recordGovernanceAudit`. |
| **P1-018** allowlist fragility (`importance_tier` in `ALLOWED_POST_INSERT_COLUMNS`) | **CLOSED (resolved-in-spirit)** | `importance_tier` remains in the allowlist at `lib/storage/post-insert-metadata.ts:56`, BUT a guard was hoisted above the dynamic SET builder at `:88-128`. Functionally equivalent to allowlist removal. **Doc-drift side effect: strategy.md still claims the allowlist removal** → logged as **P2-pass2-002** (traceability). |

**Compound exploit chain (pass-1 iter-7) — full re-walk in pass-2 iter-6:**

| Step | Attack vector | Pass-2 verdict | Guard |
|---|---|---|---|
| 1 | `memory_update` tier promotion on non-constitutional path | **BLOCKED** | `vector-index-mutations.ts:456-478` SQL-layer guard |
| 2 | `file_path`/`canonical_file_path` mutation via UPDATE tool | **BLOCKED at schema** | `tool-schemas.ts:297` `additionalProperties:false`; no handler populates path fields |
| 3 | Direct write to `checkpoints` table via MCP | **BLOCKED** | Only writer is `checkpoints.ts:1428` inside `createCheckpoint`, which builds from guarded `memory_index`; no MCP surface accepts `memory_snapshot` |
| 4 | `checkpoint_restore` with mutated snapshot | **BLOCKED** | Pre-flight `validateMemoryRow` sweep inside transaction at `checkpoints.ts:1637-1645`; excluded paths throw, triggering atomic rollback; constitutional-on-non-constitutional paths downgraded pre-insert |
| 5 | Post-restore async pipeline re-elevation (embedding regen, auto-surface hook, consolidation, vector backfill) | **NOT A RISK** | Tier corrected at `:1358` BEFORE `memoryInsertStmt.run(...)` at `:1755`; `auto-promotion.ts:47-67` caps at `critical`; `NON_PROMOTABLE_TIERS` includes `constitutional`; consolidation hard-codes `deprecated`; no async path elevates tier |

**Chain integrity verdict: FULLY SEVERED.** No viable bypass path through the Wave-1 patched surface. Residual observations (forged-blob `canonical_file_path` vs `file_path` divergence; `update_memory` dormant internal `canonicalFilePath` write branch) require out-of-band capabilities (direct filesystem/root access, non-existent MCP handler field) and are covered by existing pass-1 Wave-2 findings P1-003/P1-017.

## 4. Findings Matrix (Pass-2)

### 4.1 New in pass-2

**P1 (1)**

- **P1-pass2-004** — Cleanup script bypasses `governance_audit` on bulk tier downgrades and deletes existing audit rows — `.opencode/skill/system-spec-kit/scripts/memory/cleanup-index-scope-violations.ts:324-330` (bulk UPDATE emits zero audit rows) + `:309` (generic reference-cleanup loop deletes `governance_audit` rows for deleted memory ids). Does NOT violate Invariant 3 (moves AWAY from constitutional), but makes `governance_audit` non-authoritative for compliance/forensics after `--apply`. Natural Wave-2 deferral; not Wave-1 regression. First seen iter-3.

**P2 (7)**

- **P2-pass2-001** — Redundant `tier_downgrade` audit emitters across 3 code sites (`handlers/memory-crud-update.ts:182-202`, `lib/search/vector-index-mutations.ts:88-114`, `lib/storage/post-insert-metadata.ts:105-120`). Iter-3 control-flow trace confirms **max redundancy is 2 rows per decision**, not 3 (theoretical maximum). Iter-first-seen 1.
- **P2-pass2-002** — Wave-1 strategy.md drift: claims `importance_tier` allowlist removal but code hoisted-guarded instead (functional equivalence holds). Iter-first-seen 1.
- **P2-pass2-003** — Constitutional→critical downgrade on non-constitutional path emits no `governance_audit`. Guard only triggers for requests with `importanceTier==='constitutional'`; a request with `importanceTier='critical'` against a constitutional row on a non-constitutional path silently downgrades. Observability gap, not invariant violation. `vector-index-mutations.ts:456-478` + `handlers/memory-crud-update.ts:167-172`. Iter-first-seen 1.
- **P2-pass2-004** — Audit-emission pattern duplicated across 5 sites; no shared helper exported, no action-string enum. `tryRecordTierDowngradeAudit` is module-local to `vector-index-mutations.ts`. Action strings `tier_downgrade_non_constitutional_path` and `checkpoint_restore_excluded_path_rejected` appear as bare literals at 5 prod + 3 test sites and 1 prod + 1 test site respectively. Iter-first-seen 4.
- **P2-pass2-005** — `research/research.md` body is pre-Wave-1 while frontmatter claims `status='wave1-remediation-complete'`. `_memory.continuity` frontmatter fresh; body §1-§9 unchanged from original investigation. Iter-first-seen 5.
- **P2-pass2-006** — No packet doc acknowledges the cleanup-script audit gap (P1-pass2-004). `implementation-summary.md:75-96` claims durable downgrade auditing; every cleanup mention across 7 packet docs treats the CLI as fully covered. Iter-first-seen 5.
- **P2-pass2-007** — README.md Index Scope Invariants section (`mcp_server/README.md:111-117`) does not document `governance_audit` action strings. ADR-006 at `decision-record.md:443` has the contract but decision-records are not the operator discovery surface. Iter-first-seen 5.

### 4.2 Pass-1 findings status

| Pass-1 ID | Severity | Status after pass-2 | Notes |
|---|---|---|---|
| P0-001 | P0 | **CLOSED** (iter-1) | Wave-1 target |
| P0-002 | P0 | **CLOSED** (iter-2) | Wave-1 target |
| P1-008 | P1 | **CLOSED** (iter-3) | Wave-1 target |
| P1-010 | P1 | **CLOSED** (iter-5) | Traceability side-effect of continuity refresh |
| P1-011 | P1 | **CLOSED** (iter-5) | Traceability side-effect of continuity refresh |
| P1-012 | P1 | **CLOSED** (iter-5) | Traceability side-effect of continuity refresh |
| P1-016 | P1 | **CLOSED** (iter-3) | Wave-1 target |
| P1-018 | P1 | **CLOSED** (resolved-in-spirit, iter-1) | Wave-1 target; hoisted-guard pattern |
| P1-001 | P1 | **OPEN — no regression** | TOCTOU in cleanup script, Wave-2 |
| P1-003 | P1 | **OPEN — no regression** | Symlink canonical divergence, Wave-2 |
| P1-004 | P1 | **OPEN — no regression** | LIKE pattern divergence, Wave-2 |
| P1-005 | P1 | **OPEN — no regression** | FTS trigger, Wave-2 |
| P1-006 | P1 | **OPEN — no regression** | Idempotence + mutation-ledger stub, Wave-2 |
| P1-007 | P1 | **OPEN — no regression** | Log-injection on save-time WARN, Wave-2 |
| P1-009 | P1 | **OPEN — no regression** | Walker DoS, Wave-2 |
| P1-013 | P1 | **OPEN — no regression** | Exclusion SSOT drift, Wave-2 |
| P1-014 | P1 | **OPEN — no regression** | Exclusion SSOT drift, Wave-2 |
| P1-015 | P1 | **OPEN — no regression** | Inline ADR back-refs, Wave-3 |
| P1-017 | P1 | **OPEN — no regression** | Canonical vs file_path divergence, Wave-2 |
| P1 (remaining) | P1 | Counted as "14 open pass-1 P1s" | All pre-existing Wave-2/3 scope |
| 22 pass-1 P2s | P2 | **unchanged** | No regression; Wave-3 scope |

**Release-blocker accounting:** 0 active P0, 0 Wave-1-regression P1. The 14 inherited pass-1 P1s are pre-existing defense-in-depth and maintainability gaps — they were present at pass-1 and are not Wave-1 regressions.

## 5. Invariant Health Matrix (pass-2 update)

| Invariant | INSERT (memory_save) | UPDATE (memory_update) | `checkpoint_restore` | Direct DB write | Pass-2 verdict |
|---|---|---|---|---|---|
| **1 — z_future never indexed** | Enforced (save-time guard, iter-1/3 pass-1; no regression pass-2) | N/A (no path mutation on update) | **Enforced** via `validateMemoryRow` → `shouldIndexForMemory` → atomic rollback on match | Out-of-scope (filesystem access) | **PASS** |
| **2 — external never indexed** | Enforced (save-time guard, iter-1/3 pass-1; no regression pass-2) | N/A | **Enforced** via `validateMemoryRow` → `shouldIndexForMemory` → atomic rollback on match | Out-of-scope | **PASS** |
| **3 — constitutional tier only on /constitutional/ paths** | Enforced (save-time guard) | **Enforced at SQL layer** via `isConstitutionalPath` guard in `update_memory` (Wave-1 new) | **Enforced** via `validateMemoryRow` → `isConstitutionalPath` → pre-insert tier mutation + audit | Out-of-scope | **PASS (Wave-1 closed the two bypass paths)** |
| **4 — README.md + decision-record excluded** | Enforced (spec-doc path filter) | N/A | Enforced (validator honors excluded paths) | Out-of-scope | **PASS (unchanged)** |

Pass-1 matrix had Invariant 3 marked FAIL on UPDATE and `checkpoint_restore` columns. Pass-2 matrix is all PASS.

## 6. Remediation Plan (Wave-2 scope)

**Wave-2 blocking: NONE.** No active P0, no critical P1 regression from Wave-1.

**Wave-2 recommended (prioritized):**

- **W2-01** — Close cleanup-script audit gap (`P1-pass2-004`). Extend `cleanup-index-scope-violations.ts:324-330` to emit `tier_downgrade_cleanup` (or equivalent) audit rows keyed to affected ids; remove the generic reference-cleanup audit-row DELETE at `:309` and replace with a retain-by-default audit-trail policy. Priority: HIGH (closes the only new pass-2 P1).
- **W2-02** — Unify exclusion SSOT (`P1-013` + `P1-014`). Collapse the three parallel exclusion sources (`EXCLUDED_FOR_MEMORY`, `SPEC_DOCUMENT_EXCLUDED_SEGMENTS`, `SPEC_DOC_EXCLUDE_DIRS`) onto `index-scope.ts` with explicit overlays. Priority: HIGH (multi-path drift risk).
- **W2-03** — Realpath guard hardening (`P1-003` + `P1-017`). Add `fs.realpathSync` at save-time guard input and walker inputs so symlinks under `/constitutional/` that point OUT are caught. Priority: MEDIUM (not MCP-reachable, but tightens the out-of-band threat).
- **W2-04** — Cleanup script TOCTOU fix (`P1-001`). Move `buildPlan` inside the SQLite transaction so read-for-plan and write-for-apply share the same lock. Priority: MEDIUM.
- **W2-05** — Extract audit-emission helpers + define action-string enum (`P2-pass2-004`). Move `tryRecordTierDowngradeAudit` into `scope-governance.ts` and export; define `GOVERNANCE_AUDIT_ACTIONS` const-namespace enum; replace bare literals at 5 prod + 3 test sites. Priority: MEDIUM (reduces drift risk but not a defect).

**Wave-3 optional (cosmetic):**

- **W3-01** — Inline ADR back-references in shipped code (`P1-015`, `P2-015`).
- **W3-02** — README audit-contract documentation (`P2-pass2-007`) — short Observability subsection with the two action strings.
- **W3-03** — `research/research.md` body alignment with frontmatter (`P2-pass2-005`) — append §10 Wave-1 Remediation Outcome or revert frontmatter status.
- **W3-04** — Logger consistency (`console.warn` vs `logger.warn`) across audit fail-safe wrappers.
- **W3-05** — Constitutional→critical downgrade audit coverage (`P2-pass2-003`) — extend audit trigger to also fire when a constitutional row on a non-constitutional path downgrades to `critical`.
- **W3-06** — Packet-doc acknowledgment of cleanup-script audit gap (`P2-pass2-006`) — add a Known Gaps subsection to `implementation-summary.md`.
- **W3-07** — JSDoc coverage on exported functions in `index-scope.ts` and new audit helpers.

## 7. Evidence Inventory

| Iteration | Dimension | Findings (P0/P1/P2) | Artifact |
|---|---|---|---|
| Pass-2 iter-1 | correctness (P0-001 verification) | 0 / 0 / 3 | `review-pass-02/iterations/iteration-001.md` |
| Pass-2 iter-2 | correctness (P0-002 verification) | 0 / 0 / 0 | `review-pass-02/iterations/iteration-002.md` |
| Pass-2 iter-3 | audit-trail (P1-008 + P1-016) | 0 / 1 / 0 | `review-pass-02/iterations/iteration-003.md` |
| Pass-2 iter-4 | maintainability | 0 / 0 / 1 | `review-pass-02/iterations/iteration-004.md` |
| Pass-2 iter-5 | traceability | 0 / 0 / 3 | `review-pass-02/iterations/iteration-005.md` |
| Pass-2 iter-6 | regression-exploit-chain | 0 / 0 / 0 | `review-pass-02/iterations/iteration-006.md` |
| Pass-2 iter-7 | synthesis | — | `review-pass-02/iterations/iteration-007.md` (pointer); this report |

Per-iteration deltas in `review-pass-02/deltas/iter-NNN.jsonl`.

**Pass-2 new-findings totals:** **P0 = 0, P1 = 1 (new), P2 = 7 (new).**
**Pass-2 closures of pass-1 findings:** **8** (P0-001, P0-002, P1-008, P1-010, P1-011, P1-012, P1-016, P1-018).

## 8. Convergence Signals

- **Per-iteration newFindingsRatio (severity-weighted):** `[1.00, 0.00, 0.14, 0.14, 0.43, 0.00, 0.00]` (iter-7 synthesis adds zero new findings).
- **MAD noise floor:** median of `[1.00, 0.00, 0.14, 0.14, 0.43, 0.00]` = 0.14; absDeviations = `[0.86, 0.14, 0.00, 0.00, 0.29, 0.14]`; median absDev ≈ 0.14; MAD ≈ 0.14; threshold = MAD * 1.4826 * 1.4 ≈ **0.29**. Iter-6 ratio (0.00) and iter-7 ratio (0.00) both below threshold.
- **P0 override:** NOT in effect (0 active P0 throughout pass-2).
- **Convergence verdict:** met at iter-6 (ratio 0.00 below MAD-derived threshold, two consecutive zero-ratio iterations with iter-7).
- **Stop reason:** `converged+maxIterations` (both criteria satisfied simultaneously).
- **Dimension coverage:** all 4 required dimensions covered (correctness×2, audit-trail, maintainability, traceability) plus regression-exploit-chain re-walk. Coverage age ≥ 2 iterations per dimension across pass-1 + pass-2 combined.
- **Novelty justification (iter-7):** synthesis-only iteration, zero new findings, weighted ratio 0.0.

## 9. Next Actions

1. **Wave-1 is RELEASE-READY.** `dist/` is built, MCP is restarted, Wave-1 tests pass, the compound exploit chain is fully severed, and no new P0 was discovered during the deeper patched-surface probe. The packet can commit + push the Wave-1 artifacts as-is.
2. **Commit the pass-2 review packet as the durable audit trail** before proceeding. Include `review-pass-02/review-report-pass-02.md`, `review-pass-02/iterations/iteration-00{1..7}.md`, `review-pass-02/deep-review-findings-registry.json`, `review-pass-02/deep-review-state.jsonl`, `review-pass-02/deltas/iter-00{1..7}.jsonl`, `review-pass-02/deep-review-config.json`, `review-pass-02/deep-review-strategy.md`.
3. **Wave-2 queued** with W2-01..W2-05. Recommend handing off to `/spec_kit:plan` if the user wants to continue Wave-2 in this session, OR deferring Wave-2 to a later session and closing the pass-2 packet now. The CONDITIONAL verdict explicitly permits release of the Wave-1 subset with Wave-2 tracked as a follow-up.
4. **Do NOT re-mark packet 011 as Wave-1 Complete → fully complete.** Status should remain "Wave-1 Complete" with Wave-2 tracked.
5. **Do NOT run `/create:changelog` for a full packet release yet.** If a Wave-1-only changelog is desired, note the Wave-2 backlog in the entry.

---

**Report generated:** 2026-04-24T12:20:00Z
**Session:** `2026-04-24T09:48:20.783Z` (generation 2, lineageMode=restart, parentSessionId=`2026-04-24T08:04:38.636Z`)
**Iterations executed:** 7 of 7
**Stop reason:** `converged+maxIterations`
