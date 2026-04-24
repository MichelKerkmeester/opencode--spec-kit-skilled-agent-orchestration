# Pass 2 · Iteration 005 — traceability (docs vs Wave-1 patches)

## Dispatcher
- iteration: 5 of 7
- pass: 2
- dimension: traceability
- dispatcher: @deep-review (LEAF)
- timestamp: 2026-04-24T11:40:00Z
- session: 2026-04-24T09:48:20.783Z (generation 2, lineageMode=restart)
- parentSessionId: 2026-04-24T08:04:38.636Z

## Summary

Wave-1 doc updates are **substantially landed**. Pass-1 P1-010 (_memory.continuity staleness), P1-011 (generic scaffolding continuity), and P1-012 (spec.md Status drift) from pass-1 iter-3 are **CLOSED**: all 6 root packet docs (spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md) have identical, updated `_memory.continuity` blocks (`last_updated_at: 2026-04-24T09:31:49Z`, `recent_action: "Wave-1 remediation landed..."`, `next_safe_action: "Run 7-iteration deep review pass 2..."`, `status: "wave1-remediation-complete"`, `completion_pct: 95`). Spec.md Status field reads "Wave-1 Complete" (line 57). Plan.md DoD + Implementation Phases are fully `[x]`-checked (lines 55-62, 88-101). Tasks.md contains T-W1-01 through T-W1-05 all marked `[x]` (lines 108-112). Checklist.md adds five CHK-W1-00{1..5} items, all `[x]` with evidence. decision-record.md adds ADR-006 titled "Wave-1 Remediation Uses SQL-Layer Tier Guards and Atomic Restore Validation" (line 415) covering SSOT-at-SQL-layer, atomic restore validation, and the `governance_audit.action='tier_downgrade_non_constitutional_path'` contract. Implementation-summary.md contains the Wave-1 section with P0-001/P0-002/P1-008/P1-016/P1-018 mapped to file:line patches plus live verify pass (`constitutional_total=2`, `gate_enforcement_rows=1`). Live DB reverify matches pass-1: 2 constitutional rows (both gate files).

Three **traceability findings** surface in this pass:
1. **P2-pass2-002 CONFIRMED** — strategy.md:15 still reads "`importance_tier` removed from ALLOWED_POST_INSERT_COLUMNS allowlist", but in the shipped code `importance_tier` is **still in the allowlist** at `post-insert-metadata.ts:56`; the actual fix is a guard hoist above the SET builder at :88-128. Doc-to-code drift in the strategy doc only (no prod-code drift).
2. **NEW P2-pass2-005 — research/research.md is frozen at pre-Wave-1 state**: `_memory.continuity.recent_action` and `status` frontmatter block are updated to `"wave1-remediation-complete"`, but the research body (§1-§9) is unchanged from the original read-only investigation — there is no "Wave-1 findings" or "remediation outcome" addendum. The frontmatter says Wave-1 complete but the body still reads as future-tense ("need two layers", "Cleanup must be broader…"). Minor — a reader using only research.md body will not learn what landed.
3. **NEW P2-pass2-006 — cleanup-script audit gap (P1-pass2-004) is NOT acknowledged in any packet doc**: grep across all 7 packet docs for the word "cleanup" shows every mention treats the cleanup CLI as fully-covered (checklist CHK-030/CHK-031/CHK-W1-005, impl-summary verify block). Implementation-summary.md:75 claims "durable downgrade auditing so operators can see when a non-constitutional path tried to claim constitutional priority" — but the cleanup path (the highest-volume operator scenario) emits zero audits. If the packet ships as-is, an operator reading impl-summary could reasonably believe the cleanup script also emits governance_audit rows, when iter-3 proved it does not. Minor — does not block Wave-1, but the impl-summary claim is broader than the shipped code.
4. **NEW P2-pass2-007 — audit action strings not documented in README**: README.md:111-117 "Index Scope Invariants" section documents the three invariant rules but does **NOT** document the governance_audit action strings `tier_downgrade_non_constitutional_path` or `checkpoint_restore_excluded_path_rejected`. ADR-006 (decision-record.md:443) documents the action contract, and impl-summary.md:77-85 references the action strings via finding tables, but the operator-facing README (the discovery surface for the public contract) is silent. Operators querying `SELECT action, COUNT(*) FROM governance_audit GROUP BY action` have no README reference explaining what actions to expect.

Pass-1 P1-010/P1-011/P1-012 **CLOSED** by Wave-1. No doc-to-code structural drift beyond the 3 P2s above.

## Doc-update audit table

| Required Wave-1 doc change | Status | file:line |
|---|---|---|
| decision-record.md new ADR | **landed** — ADR-006 titled "Wave-1 Remediation Uses SQL-Layer Tier Guards and Atomic Restore Validation" | `decision-record.md:415-490` |
| ADR-006 covers SSOT-at-SQL-layer | **landed** — decision section cites `vector-index-mutations.ts`, `post-insert-metadata.ts`, storage-layer as SSOT rationale | `decision-record.md:437-443` |
| ADR-006 covers atomic restore | **landed** — "checkpoints.ts validates each replay row inside the restore transaction … aborts the restore on the first rejected row" | `decision-record.md:442` |
| ADR-006 covers governance_audit contract | **landed** — action/decision/reason/metadata shape explicit | `decision-record.md:443` |
| impl-summary.md Wave-1 section | **landed** — findings table + focused tests + live verify | `implementation-summary.md:75-96` |
| Finding IDs addressed (P0-001, P0-002, P1-008, P1-016, P1-018) | **landed** — all five in findings table | `implementation-summary.md:79-85` |
| file:line of each patch | **landed but line-stale-checked** — impl-summary cites `vector-index-mutations.ts:61-113,456-477`; reality is `:76-114, :456-478`; `post-insert-metadata.ts:82-154` vs reality `:82-128`; `checkpoints.ts:75-103,1291-1367,1545-1777` vs reality helper `:92-103`, `validateMemoryRow :1291-1360`, transaction `:1636-1838`. Minor off-by-a-few-lines drift, likely from post-Wave-1 auxiliary edits. Functionally correct, not a P-finding. | `implementation-summary.md:81-83` |
| Test file names | **landed** — 3 vitest files cited with line ranges | `implementation-summary.md:89-91` |
| Live DB verify-pass | **landed** — exit 0 + 5 counter values | `implementation-summary.md:93-96` |
| tasks.md T-W1-01..05 [x] | **landed** — all 5 tasks present and `[x]`; descriptions map to shipped patches | `tasks.md:108-112` |
| checklist.md Wave-1 items | **landed** — CHK-W1-001..005 all `[x]` with evidence | `checklist.md:60, 76, 87, 88, 89` |
| checklist.md P0 count reconciled | **landed** — CHK-W1-001/002/003 are P0, CHK-W1-004/005 are P1; summary shows 17/17 P0 + 18/18 P1 | `checklist.md:119-121` |
| _memory.continuity bumps | **landed in all 7 root docs** — identical block across spec.md:14-27, plan.md:11-24, tasks.md:11-22, checklist.md:11-22, decision-record.md:11-22, implementation-summary.md:10-21, research/research.md:10-24 | all `_memory` frontmatter |
| spec.md Status field | **landed** — "Wave-1 Complete" | `spec.md:57` |
| plan.md DoD [x] | **landed** — both DoR and DoD items are `[x]` | `plan.md:55-62` |
| plan.md Implementation Phases [x] | **landed** — all 9 phase items `[x]` | `plan.md:88-101` |
| audit action strings documented | **partial** — ADR-006 documents them, impl-summary references them; README.md `Index Scope Invariants` section (line 111-117) does NOT mention them | see P2-pass2-007 |
| research.md body updated for Wave-1 | **not landed** — frontmatter bumped, body still reads as pre-Wave-1 investigation | see P2-pass2-005 |
| P2-pass2-002 (strategy.md allowlist-removal drift) | **still open** — strategy.md:15 claim contradicts shipped code | see P2-pass2-002 |
| P1-pass2-004 (cleanup-script audit gap) acknowledgment | **not landed** — zero doc mentions it; impl-summary.md:75 "durable downgrade auditing" claim is broader than shipped behavior | see P2-pass2-006 |

## Live DB reverify

- `sqlite3 context-index__voyage__voyage-4__1024.sqlite "SELECT COUNT(*) FROM memory_index WHERE importance_tier='constitutional';"` → **2**
- Paths:
  - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/constitutional/gate-tool-routing.md`
  - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/constitutional/gate-enforcement.md`
- Matches pass-1 iter-3 DB-verified claims: **YES** (2, 2, both gate files). No regression.

## Pass-1 P1-010/011/012 (doc drift) status

- **P1-010 (stale _memory.continuity blocks)** — **CLOSED**. All 7 packet doc `_memory.continuity` blocks refreshed to `2026-04-24T09:31:49Z`, `status: "wave1-remediation-complete"`, `completion_pct: 95`, `recent_action` referencing Wave-1 landing. Zero docs still read `completion_pct: 20` or old scaffolding action text.
- **P1-011 (generic scaffolding continuity)** — **CLOSED**. Same refresh as P1-010; scaffolding text (e.g., `[###-feature-name]`) does not appear in any `_memory.continuity` block.
- **P1-012 (spec.md Status field drift)** — **CLOSED**. `spec.md:57` reads `Wave-1 Complete`, consistent with 95% completion in continuity frontmatter, ADR-006 status `Accepted`, and the checklist's 17/17 + 18/18 completion summary.

## New findings (this iteration)

### P0
None.

### P1
None.

### P2
1. **P2-pass2-005 — research/research.md body is pre-Wave-1 while its frontmatter claims Wave-1 complete** — `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-index-scope-and-constitutional-tier-invariants/research/research.md:10-24` (updated continuity frontmatter) vs `:26-95` (body unchanged from original read-only investigation; §9 "Design Implications" still uses future tense "need two layers", "Cleanup must be broader"). A reader who trusts the frontmatter and reads only the body will form a pre-Wave-1 mental model. Recommend: append a `## 10. Wave-1 Remediation Outcome` section citing P0-001/P0-002/P1-008/P1-016/P1-018 resolution and their file:line patches, OR downgrade the frontmatter back to `status: "read-only-investigation-complete"` and route Wave-1 evidence exclusively through implementation-summary.md.

2. **P2-pass2-006 — No packet doc acknowledges the cleanup-script audit gap filed as P1-pass2-004 (iter-3)** — `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-index-scope-and-constitutional-tier-invariants/implementation-summary.md:75` claims "durable downgrade auditing so operators can see when a non-constitutional path tried to claim constitutional priority"; iter-3 verification shows `scripts/memory/cleanup-index-scope-violations.ts:324-330` emits zero `governance_audit` rows on bulk downgrade and `:309` deletes pre-existing audit rows. The packet claim is broader than the shipped behavior. `checklist.md:89` CHK-W1-005 reports `--verify` exit 0 but does not call out that cleanup `--apply` (the mutation path) does not emit audits. Recommend: either (a) add a "Known Gaps" subsection to implementation-summary.md explicitly noting the cleanup script does not emit the `tier_downgrade_non_constitutional_path` audit and deferring the fix to Wave-2, or (b) fix the cleanup script and update impl-summary to reflect closure.

3. **P2-pass2-007 — Governance_audit action-string contract not documented in README's "Index Scope Invariants" section** — `.opencode/skill/system-spec-kit/mcp_server/README.md:111-117` documents the three path/tier invariant rules but does not mention `action='tier_downgrade_non_constitutional_path'` or `action='checkpoint_restore_excluded_path_rejected'`. These are the public observability contract Wave-1 established (per ADR-006). Operators running `SELECT action, COUNT(*) FROM governance_audit GROUP BY action` have no README reference. ADR-006 at `decision-record.md:443` documents it, but decision-records are not the operator surface. Recommend: add a short "Observability" subsection under "Index Scope Invariants" with the two action strings and their semantics.

### Confirmed active findings (no change)
- **P2-pass2-002 — Strategy.md describes allowlist-removal that did not land** — `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-index-scope-and-constitutional-tier-invariants/review-pass-02/deep-review-strategy.md:15` reads `"importance_tier removed from ALLOWED_POST_INSERT_COLUMNS allowlist"`, but `post-insert-metadata.ts:56` still retains `importance_tier` in the allowlist. Functional equivalence holds because of the guard hoist at :88-128. Strategy-level doc drift only. Remains P2.

## Traceability Checks

- **doc-to-code-shape protocol**: partial — strategy.md:15 allowlist-removal claim is structurally inaccurate (P2-pass2-002, carried forward). impl-summary.md:81-83 file:line citations are functionally correct but a few lines off (not flagged as a P2 — within acceptable drift). All T-W1-0x descriptions map cleanly to shipped code surfaces.
- **_memory-continuity-freshness protocol**: pass — all 7 packet docs have identical, current continuity blocks (`2026-04-24T09:31:49Z`, `completion_pct: 95`, Wave-1 status). P1-010/011 CLOSED.
- **spec.md-status-field protocol**: pass — "Wave-1 Complete" on spec.md:57. P1-012 CLOSED.
- **plan-DoD-tasks-checklist-sync protocol**: pass — DoD `[x]`, Implementation Phases `[x]`, tasks T001-T014 + T-W1-01..05 `[x]`, checklist CHK-W1-001..005 `[x]`. Three-way alignment holds.
- **ADR-coverage protocol**: pass — ADR-006 added; covers SSOT-at-SQL-layer, atomic restore, audit-contract. No missing ADR for Wave-1 decisions.
- **research.md-currency protocol**: fail — body pre-Wave-1 while frontmatter claims post-Wave-1 (P2-pass2-005).
- **README-operator-contract protocol**: partial — invariant rules documented, audit-action public contract undocumented (P2-pass2-007).
- **known-gap-transparency protocol**: fail — P1-pass2-004 (cleanup-script audit gap) not reflected in any packet doc; impl-summary.md:75 claim is broader than reality (P2-pass2-006).
- **pass-1-finding-id-reference-integrity protocol**: pass — impl-summary finding IDs (P0-001, P0-002, P1-008, P1-016, P1-018) all appear in pass-1's frozen review-report.md. No fabricated IDs. Pass-1 report not modified (per contract).

## Confirmed-Clean Surfaces

- All 7 packet docs' `_memory.continuity` blocks are fresh, identical, and consistent.
- spec.md Status "Wave-1 Complete" matches 95% completion and Wave-1 artifacts.
- Plan DoD + Implementation Phases correctly `[x]` to match tasks.md and checklist.md.
- tasks.md T-W1-01 through T-W1-05 descriptions structurally map to shipped patches at claimed surfaces.
- decision-record.md ADR-006 is well-formed: status Accepted, deciders, 5/5 checks, implementation + rollback, alternatives table, consequences + risks. Covers SSOT-at-SQL-layer, atomic restore, audit contract.
- implementation-summary.md Wave-1 section cites correct finding IDs and test file names, and the live verify result matches the iter-3 DB reverify.
- Pass-1 review-report.md **not** modified (read-only audit trail preserved per contract).
- Live DB counts stable since pass-1 iter-3 (constitutional_total=2, paths=[gate-enforcement.md, gate-tool-routing.md]).
- Reducer-owned `deep-review-findings-registry.json` P1-008/P1-016/P1-018 resolvedFindings entries have evidence arrays consistent with the shipped patches.

## Coverage
- Dimension: traceability — covered
- Files reviewed: 8 packet docs + 1 README + 1 strategy.md + live DB = 10 surfaces
- Pass-2 dimensions complete: correctness (iter-1, iter-2), audit-trail (iter-3), maintainability (iter-4), traceability (iter-5)
- Remaining pass-2 dimensions: regression / exploit-chain re-validation (iter-6), synthesis (iter-7)

## Files Reviewed
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-index-scope-and-constitutional-tier-invariants/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-index-scope-and-constitutional-tier-invariants/plan.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-index-scope-and-constitutional-tier-invariants/tasks.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-index-scope-and-constitutional-tier-invariants/checklist.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-index-scope-and-constitutional-tier-invariants/decision-record.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-index-scope-and-constitutional-tier-invariants/implementation-summary.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-index-scope-and-constitutional-tier-invariants/research/research.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-index-scope-and-constitutional-tier-invariants/review-pass-02/deep-review-strategy.md`
- `.opencode/skill/system-spec-kit/mcp_server/README.md` (Index Scope Invariants section)
- Live DB: `.opencode/skill/system-spec-kit/mcp_server/database/context-index__voyage__voyage-4__1024.sqlite` (constitutional_total query)

## Next iteration focus

**Pass 2 Iter 6 — regression / exploit-chain re-validation against live runtime.** Re-walk the original compound P0-001+P0-002 attack chain against the Wave-1 patched code: (a) attempt a direct `memory_update` that sets `importance_tier='constitutional'` on a non-constitutional path; confirm the SQL-layer guard downgrades and emits the audit row. (b) construct a synthetic checkpoint blob containing a poisoned `(file_path, importance_tier)` row on a z_future or non-/constitutional/ path; confirm `checkpoint_restore` aborts the transaction inside the barrier and flushes the excluded-path-reject audit. (c) exercise the defense-in-depth layering: if the SQL-layer guard is bypassed (hypothetically), does the post-insert-metadata guard still catch it? (d) re-confirm that the 2-row max redundancy from iter-3's §Redundancy analysis holds under the current shipped code. Focus on runtime evidence, not re-reading docs. Do NOT re-audit doc drift (covered iter-5). Also: decide whether P2-pass2-005/006/007 warrant promotion or stay P2.
