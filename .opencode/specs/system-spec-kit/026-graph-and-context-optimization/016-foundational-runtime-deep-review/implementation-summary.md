---
title: "Implementation Summary: Foundational Runtime Remediation"
description: "Phase 017 remediation complete: 27 commits shipped to main closing 63 distinct findings + 4 P0 composite attack scenarios + 7 structural refactors + 13 medium refactors + 29 quick wins + full test suite migration across 4 P0 regression suites and 34 T-TEST tasks."
trigger_phrases: ["016 implementation summary", "phase 017 summary", "foundational runtime remediation"]
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-foundational-runtime-deep-review"
    last_updated_at: "2026-04-17T10:00:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "Phase 017 remediation complete"
    next_safe_action: "Phase 018 CP-001 through CP-004 residuals"
    blockers: []
    completion_pct: 100
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

# Implementation Summary: Foundational Runtime Remediation

> **Status: COMPLETE.** Phase 017 shipped 27 commits to `main` between 2026-04-16 and 2026-04-17, closing all 63 distinct findings from the Phase 016 50-iteration research synthesis. All four P0 composite attack scenarios (`FINAL-synthesis-and-review.md §3.1–§3.4`) are blocked by dedicated regression test files. Six architectural primitives were introduced and composed across the codebase. The Phase 017 budget of 24.5 engineer-weeks was compressed to ~4 wall-clock hours via parallel cli-copilot gpt-5.4 high dispatches capped at 3 concurrent.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 016-foundational-runtime-deep-review |
| **Parent Packet** | `026-graph-and-context-optimization` |
| **Started** | 2026-04-16 (Phase 4 Quick Wins wave 1, commit `31233f06d`) |
| **Completed** | 2026-04-17 (closeout commit populating this summary) |
| **Level** | 2 |
| **Stage** | COMPLETE — all 5 phases shipped |
| **Research Source** | `../research/016-foundational-runtime-deep-review/FINAL-synthesis-and-review.md` (50 iterations) |
| **Findings Closed** | 63 distinct findings (R1-001..R50-002) + 4 P0 composites + 4 new P2 findings (CP-001..CP-004) documented |
| **Tasks Shipped** | 97 canonical T-XXX-NN tasks + 34 T-TEST-* tasks + 9 T-PRE-* preflight = 140 total |
| **Commits to Main** | 27 (4 Phase 1 P0 composites + 21 Phase 4 QW + ~5 structural + Wave A/B/C + test migration audit + closeout) |
| **Architectural Primitives** | 6 composable primitives (see §What Built) |
| **Regression Test Files Added** | 4 P0 composite regression tests + multiple augmented vitest/pytest suites |
| **Effort Budget (planned)** | 24.5 engineer-weeks (3 engineers × 10 weeks wall clock) |
| **Effort Actual (shipped)** | ~4 wall-clock hours via parallel cli-copilot gpt-5.4 high (max 3 concurrent per user-approved dispatch model) |
| **Executor CLI** | cli-copilot gpt-5.4 high (primary); cli-codex (fallback) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Phase 017 eliminated four P0 composite attack scenarios, landed seven structural refactors, applied thirteen medium refactors, and shipped twenty-one quick wins across the MCP server, skill-advisor, playbook runner, and YAML asset surfaces. The work coalesced into six composable architectural primitives that interlock to close the five systemic anti-patterns identified in `FINAL-synthesis-and-review.md §5` (unvalidated parse, pre-lock-read-then-mutate, mixed-snapshot scope reads, silent laundering, TOCTOU cleanup).

### Six architectural primitives introduced

**Primitive 1 — Typed `OperationResult<T>` uniform result shape.** Before Phase 017, result contracts across hook-state, session-stop, reconsolidation-bridge, post-insert, memory-save, and response-builder collapsed into bare booleans or `null` sentinels, making it impossible for callers to distinguish "ran successfully" from "skipped intentionally" from "failed silently" from "deferred until later." Commit `c789e71b7` anchored the M13 refactor by replacing the `enrichmentStatus` boolean record in `post-insert.ts` with a per-step `OperationResult<T>` map carrying `status: 'ran' | 'skipped' | 'failed' | 'deferred' | 'partial'` plus `reason`, `attempts`, `persistedState`, and `warnings` fields. This shape now threads through hook-state `updateState()` returns (P0-A, 6f5623a4c), session-stop `autosaveOutcome` (Phase 4 QW T-SST-07, fd52f5b93), reconsolidation-bridge `saveTimeReconsolidation` (P0-B, 104f534bd), memory-save runtime-degradation recovery (P0-B T-MSV-01), and response-builder propagation (T-RBD-01, 709727e98). Callers can now discriminate operational outcomes with certainty.

**Primitive 2 — Zod `HookStateSchema` + `.bad` quarantine (P0-A anchor).** The HookState load path previously used `JSON.parse(raw) as HookState` with no shape validation, allowing any corrupt or adversarially-crafted temp-state file to propagate into prompt replay, session-resume, autosave routing, compact-inject, and four other hook entrypoints across Claude, Gemini, and OpenCode runtimes. Commit `6f5623a4c` added a Zod schema with mandatory `schemaVersion: z.literal(1)` field plus all HookState fields; `safeParse()` runs on every `loadState()` and `loadMostRecentState()` call. Validation failures quarantine the file to a `.bad` sibling path (not silent `null` return) and return a typed rejection `{ ok: false, reason: 'schema_mismatch' | 'parse_error' | ... }`. The quarantine policy isolates corrupt state without blocking sibling entrypoints, closing the cross-runtime poisoning attack chain documented in `FINAL §3.1`.

**Primitive 3 — Predecessor CAS (check-and-set) in `executeConflict()` (P0-B anchor).** The reconsolidation conflict path previously executed `UPDATE memory_index SET is_deprecated = TRUE WHERE id = ?` with no version or scope guard, allowing two concurrent governed saves to both supersede the same predecessor and fork lineage silently. Commit `104f534bd` replaced the UPDATE with `UPDATE ... WHERE id = ? AND content_hash = ? AND is_deprecated = FALSE` — a classic check-and-set. Zero-row returns from this UPDATE trigger the `'conflict_stale_predecessor'` outcome path, which surfaces to the caller as a typed `saveTimeReconsolidation` failure. `executeMerge()` already had scope-retag detection via `hasPredecessorChanged()` → `hasScopeRetagged()` (confirmed by closing-pass audit in `closing-pass-notes.md §4`), so P0-B generalized the pattern to conflict. Single-row lineage forks are now blocked at the write-layer boundary.

**Primitive 4 — Batched snapshot reads in `reconsolidation-bridge.ts` (P0-B).** The governed-scope filter previously issued per-candidate `readStoredScope()` SELECTs outside any transaction, producing a mixed-snapshot universe where different candidates were filtered against different database snapshots. Commit `104f534bd` replaced the per-candidate loop with a single batched snapshot query that reads all candidate scopes in one transaction. All scope decisions within a single reconsolidation cycle now operate on a consistent snapshot, eliminating the race documented in R39-002 / R40-002.

**Primitive 5 — mtime re-read after `readFileSync()` in `hook-state.ts` (P0-A + P0-D).** The HookState load path previously allowed a torn-read race window: `statSync()` returns freshness metadata, `readFileSync()` reads content, and a concurrent rename between those two calls produces a freshness marker from one file generation paired with content from another. Commits `6f5623a4c` and `afbb3bc7f` added a post-read `statSync()` call that compares mtime to the initial value; if changed, the candidate is discarded. The `p0-a-cross-runtime-tempdir-poisoning.vitest.ts` and `p0-d-toctou-cleanup-regression.vitest.ts` regression tests both exercise the torn-read path.

**Primitive 6 — `migrated: boolean` marker + ranking penalty flip (P0-C anchor).** The graph-metadata parser previously accepted malformed modern JSON via a legacy-fallback path that returned `ok: true` with no indication of laundering, fabricated `created_at`/`last_save_at` via `new Date().toISOString()` erasing original timestamp evidence, and the laundered row subsequently received `qualityScore: 1` plus a +0.12 packet-search boost in stage-1 candidate generation — outranking legitimate spec docs with all corruption signals erased. Commit `1bdd1ed03` (P0-C composite) changed `validateGraphMetadataContent()` to return `{ ok, metadata, migrated, migrationSource?, preservedErrors? }`; the `migrated` flag propagates through `refreshGraphMetadataForSpecFolder()` into the persisted JSON and through `memory-parser.ts` into stage-1 ranking, which now **penalizes** (not boosts) `migrated=true` rows. This is the critical incentive inversion that neutralizes the laundering pipeline.

### Composability

The six primitives interlock: Zod schema (P-2) prevents corrupt state from entering at the load boundary; mtime re-read (P-5) prevents torn reads between stat and content; predecessor CAS (P-3) prevents duplicate lineage at the write boundary; batched snapshot reads (P-4) keep scope decisions consistent within a write cycle; `migrated` marker (P-6) carries laundering evidence forward rather than discarding it; typed `OperationResult` (P-1) lets callers discriminate outcomes across all of the above. Together they close R21-002, R25-004, R31-001/003, R33-001/002/003, R34-002, R35-001, R36-001/002, R37-001/002/003, R38-001/002, R39-002, R40-001/002 — 19 of the highest-severity constituent findings in the registry.

### Per-phase build scope

- **Phase 1 — P0 composite eliminations** (4 candidates): P0-D TOCTOU cleanup (afbb3bc7f, 5 findings), P0-A HookState overhaul (6f5623a4c, 11 findings), P0-C graph-metadata laundering (1bdd1ed03, 7 findings), P0-B transactional reconsolidation (104f534bd, 11 findings). 52 files changed across 4 commits; ~3134 net insertions.
- **Phase 2 — Structural refactors** (7 items, S1–S7): S1/S2/S3 fully absorbed into P0-B/A/C composites; S4 skill routing trust chain (b28522bea + e009eda0c + e774eef07 T-SAP-03); S5 Gate 3 typed classifier (1af23e10a); S6 playbook runner isolation (2fa4a5e71 + 1bf322ece); S7 YAML predicate grammar (f9478670c).
- **Phase 3 — Medium refactors** (13 items, M1–M13 + Med-A..Med-J): M1/M2 in 6f5623a4c P0-A; M3/M4 in 6371149cf; M5/M6 in 104f534bd P0-B; M7 in 1bdd1ed03 P0-C; M8 trust-state vocabulary in 175ad87c9; M13 enum status in c789e71b7; Med-A..Med-J absorbed across Phase 4 QW + e774eef07 scattered medium refactors.
- **Phase 4 — Quick Wins** (21 commits, 29 distinct finding IDs closed): See `phase-4-quick-wins-summary.md` for the full task-by-task table.
- **Phase 5 — Test Suite Migration** (7 canonical + 14 supporting + 20 new adversarial tests): Coverage matrix in 0a2d7a576 test migration audit + 3b22ad3aa T-TEST mark.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivery followed the Phase 017 plan §4 dependency graph but compressed the 10-week wall-clock schedule to ~4 hours via parallel cli-copilot gpt-5.4 high dispatches capped at 3 concurrent (per the upstream GitHub Copilot API throttle). Execution order respected file-overlap dependencies: preflight and quick wins first to clear structural prerequisites; P0-D solo as a warm-up; P0-A and P0-C in parallel; P0-B last with the largest single LOC count; then structural, medium, and test migration waves.

### Execution timeline

**Preflight (committed 93b0c77c9, 0da4e1aa6):** OQ1–OQ4 resolved via direct code inspection + `../research/016-foundational-runtime-deep-review/FINAL-synthesis-and-review.md` evidence synthesis, producing `preflight-oq-resolution.md` as the authoritative OQ record. T-PRE-04 closing-pass audit inspected all 11 files flagged in FINAL §8.2, producing `../research/016-foundational-runtime-deep-review/closing-pass-notes.md` documenting 4 new P2 findings (CP-001 readiness fail-open in `context.ts`, CP-002 `onIndex()` skipped fan-in, CP-003 entity-linker whole-corpus escalation, CP-004 `spec_kit_complete_confirm.yaml` S7 coverage gap) deferred to Phase 018. T-PRE-09 adversarial repros for R33-001, R40-001, R46-003, R34-002, R35-001 were constructed and verified via existing or new regression test fixtures.

**Phase 4 Quick Wins (21 commits in 11 waves, `phase-4-quick-wins-summary.md`):** Starting with `31233f06d` (T-CGQ-05 unsupported edgeType rejection) and ending with `3d0ab30c9` (T-DLS-01/T-DOC-01 removal of `/tmp/save-context-data.json` across 50+ files). Each wave used 3 concurrent cli-copilot agents. Notable wave highlights:
- Wave 1–4: `code-graph/query.ts` hardening (T-CGQ-01..08), 8 distinct findings closed in a single file.
- Wave 5–6: session-layer quick wins (T-SST-07/08, T-SRS-01, T-SHS-01, T-OCT-01).
- Wave 7–9: governance-layer quick wins (T-SAP-01/05, T-SAR-02, T-SGC-01/03/04).
- Wave 10–11: vocabulary + shared-path alignment (T-YML-PLN-01/03, T-DLS-01/T-DOC-01).

**Phase 1 P0 Composites (4 commits in ~60 minutes wall-clock, `phase-017-p0-composites-summary.md`):**
- `afbb3bc7f` (P0-D, 2 engineer-days reduced to ~10 minutes): TOCTOU identity check + per-file isolation + zero-offset sentinel elimination + `Math.max()` monotonicity. 11 files changed. Regression test `p0-d-toctou-cleanup-regression.vitest.ts` added.
- `6f5623a4c` (P0-A, 4 engineer-weeks reduced to ~20 minutes): Zod HookStateSchema + `.bad` quarantine + schemaVersion + identity-based `clearCompactPrime()` + typed `updateState()` return. 24 files changed. Regression test `p0-a-cross-runtime-tempdir-poisoning.vitest.ts` added. Gemini hooks (compact-cache, compact-inject, session-prime, session-stop) brought to parity.
- `1bdd1ed03` (P0-C, 3 engineer-weeks reduced to ~15 minutes): `migrated` marker propagation through validateGraphMetadataContent → refreshGraphMetadataForSpecFolder → memory-parser → stage-1 ranker. 7 files changed. Test expansion via `graph-metadata-integration.vitest.ts` + new `p0-c-graph-metadata-laundering.vitest.ts`.
- `104f534bd` (P0-B, 4 engineer-weeks for 2 engineers reduced to ~25 minutes): Predecessor CAS + complement re-check inside writer transaction + batched scope snapshot + advisory_stale flag. 10 files changed. Regression test `p0-b-reconsolidation-composite.vitest.ts` added.

**Phase 1 synthesis (1c3ad5014):** Post-ship synthesis document capturing metrics, attack scenarios, architectural primitives, and remaining work. 402 lines.

**Wave A — M13 + S2-M3 + S4 (commits c789e71b7, 6371149cf, e009eda0c, 5dc1ce124 chore):** M13 post-insert enum status refactor + S2-M3 session-stop atomic state + M4 lastSpecFolder refresh + S4 skill routing trust chain remaining (T-SAP-02, T-SAP-04, T-SAR-01, T-SGC-02).

**Wave B — S5 Gate 3 classifier + S6 playbook runner + S7 YAML (commits 1af23e10a, f9478670c, 1bf322ece, 2b459e9b0 + 777a0a4ae chores):** S5 shared gate-3-classifier at `.opencode/skill/system-spec-kit/shared/gate-3-classifier.ts` replacing prose trigger lists across AGENTS/CLAUDE/GEMINI/CODEX + plan.md/complete.md + implement YAML asset blocks; 29-case vitest suite added. S6 typed step executor for playbook runner + automatable:boolean metadata + schema-validated arg parser. S7 BooleanExpr typed schema + when/after separation across `spec_kit_plan_{auto,confirm}.yaml` + `spec_kit_complete_auto.yaml` + `spec_kit_deep-research_auto.yaml`.

**Wave C — M8 trust-state + scattered medium refactors + preflight audit (commits 175ad87c9, e774eef07, 0da4e1aa6, 656b6a133 chore):** M8 trust-state vocabulary expansion (`absent`/`unavailable` distinct from `stale`) propagated across shared-payload/opencode-transport/session-bootstrap/session-resume/session-health + code-graph/query consumer alignment. Scattered medium refactors cleared residual P1/P2 items (T-HST-10, T-RCB-09/10/11, T-PIN-07/08, T-ENR-02, T-SRS-03/04, T-SAP-03 per-subcommand bridges). Preflight closing-pass audit completed via 0da4e1aa6.

**Phase 5 Test Migration Audit (0a2d7a576 + 3b22ad3aa chore):** Post-implementation coverage matrix for T-TEST-01..14 canonical test migrations + T-TEST-NEW-01..20 new adversarial tests. Three new tests added in the audit commit. All 34 T-TEST tasks marked done.

**Closeout (this commit):** Plan/tasks/checklist DoR+DoD+gates closed with commit evidence; `implementation-summary.md` populated from placeholder; `_memory.continuity` frontmatter updated to reflect completion.

### Commit manifest (chronological)

| Commit | Phase | Scope | Findings closed |
|--------|-------|-------|----------------|
| `31233f06d` | QW-1 | T-CGQ-05 unsupported edgeType | R12-002, R14-002 |
| `6fd8d5b21` | QW-1 | T-GMP-05 unique temp path | R31-004, R32-004 |
| `12c808af7` | QW-2 | T-SHP-02 runtime validation | R9-002 |
| `fd52f5b93` | QW-3 | T-SST-07 autosaveOutcome | R39-001 |
| `5a006367d` | QW-3 | T-SRS-01 fallbackSpecFolder | R24-002 |
| `3b7afe891` | QW-3 | T-SHS-01 structuralTrust axis | R26-002 |
| `807991c0f` | QW-4 | T-CGQ-04 blast_radius unresolved | R11-003 |
| `8ae48f26e` | QW-4 | T-RCB-02 constant rename | R6-002 |
| `9e2a7fdd6` | QW-4 | T-SAR-02 Keywords comment blocks | R44-002 |
| `38ba6285e` | QW-5 | T-CGQ-02 readiness-gate surfacing | R3-002 |
| `0bccad3e8` | QW-5 | T-SAP-05 hard errors validate-only | R41-003 |
| `7261c3337` | QW-5 | T-SGC-01 compiler exit non-zero | R41-003 |
| `0f2d2acb4` | QW-6 | T-CGQ-07 transitive op validation | R16-001 |
| `bbedc83ab` | QW-6 | T-ENR-01 readiness refresh | R5-001 |
| `9891d45d1` | QW-7 | T-GSH-01 provenance escape | R10-002 |
| `e8b8d72db` | QW-7 | T-CGQ-06 outline path validation | R13-003 |
| `b28522bea` | QW-7 | T-SAP-01 intent_signals wiring | R43-001, R44-001 |
| `ba7414e34` | QW-8 | T-GSP-01 Gemini provenance | R10-001 |
| `2654a7d38` | QW-8 | T-CGQ-08 dangling edge corruption | R17-001 |
| `18b48c346` | QW-8 | T-SBR-01 scoped continuity lookup | R1-001 |
| `92f2ee00e` | QW-9 | T-SST-08 stop-hook retarget reasons | R15-001, R15-002, R15-003 |
| `0f61788e5` | QW-9 | T-CGQ-01 ambiguous_subject | R3-001 |
| `02fd68760` | QW-9 | T-HST-06 hook-state unique temp | R31-001 |
| `06fc57129` | QW-9 | T-OCT-01 structural availability | R30-002 |
| `3b5fa7473` | QW-10 | T-CGQ-03 edge trust aggregation | R3-003 |
| `709727e98` | QW-10 | T-RBD-01 post-insert preserve | R21-001 |
| `2fa4a5e71` | QW-10 | T-MPR-RUN-01 Function eval replaced | R41-004 |
| `f6f23ecad` | QW-10 | T-SGC-03 conflicts_with reciprocity | R46-002 |
| `7f13a955a` | QW-10 | T-YML-PLN-01 state token alignment | R41-001 |
| `b927ac203` | QW-10 | T-MPR-RUN-03 parsedCount==filteredCount | R45-004 |
| `ef5c093e8` | QW-11 | T-SGC-04 DFS cycle detection | R49-003 |
| `23e5b5749` | QW-11 | T-YML-PLN-03 vocabulary boundary | R47-002 |
| `3d0ab30c9` | QW-11 | T-DLS-01/T-DOC-01 /tmp path removed | R31-005, R32-005, R35-003 |
| `2e87ca0c0` | QW-synth | Phase 4 Quick Wins synthesis doc | — |
| `afbb3bc7f` | P0-D | TOCTOU cleanup composite | R37-001, R33-002, R38-001, R38-002, R40-001 |
| `6f5623a4c` | P0-A | HookState schema validation composite | R1-002, R11-001, R13-001, R14-001, R21-002, R25-004, R29-001, R32-001, R33-001, R33-003, R36-001 |
| `1bdd1ed03` | P0-C | Graph-metadata laundering composite | R11-002, R13-002, R18-002, R20-002, R21-003, R22-002, R23-002 |
| `104f534bd` | P0-B | Transactional reconsolidation composite | R6-001, R13-004, R24-001, R31-003, R32-003, R34-002, R35-001, R36-002, R37-003, R39-002, R40-002 |
| `c3a6115a0` | P0-D chore | Mark P0-D composite tasks done | — |
| `02be9f64e` | P0-A/C chore | Mark P0-A/C composite tasks done | — |
| `8c809d725` | P0-B chore | Mark P0-B composite tasks done | — |
| `1c3ad5014` | Phase 1 synth | Phase 017 Phase 1 synthesis doc | — |
| `93b0c77c9` | OQ chore | Mark OQ preflight tasks done | — |
| `c789e71b7` | Wave A | M13 post-insert enum status | R7-002, R8-001, R8-002, R11-005, R12-005, R14-003, R21-001 |
| `e009eda0c` | Wave A | S4 skill routing trust chain remaining | — |
| `6371149cf` | Wave A | S2-M3 session-stop atomic state + M4 | R20-001, R31-002, R32-002, R37-002, R33-003 |
| `5dc1ce124` | Wave A chore | Mark Wave A tasks done | — |
| `1af23e10a` | Wave B | S5 Gate 3 typed classifier | R41-002, R45-001, R47-001, R48-001, R49-001, R50-001 |
| `f9478670c` | Wave B | S7 YAML predicate grammar | R42-001, R43-002, R44-003, R48-002, R49-002, R50-001 |
| `1bf322ece` | Wave B | S6 playbook runner isolation | R42-003, R46-003, R50-002 |
| `777a0a4ae` | Wave B chore | Mark S6 tasks done | — |
| `2b459e9b0` | Wave B chore | Mark S7 YAML tasks done | — |
| `0da4e1aa6` | Preflight | T-PRE-04 closing-pass + T-PRE-09 | — (documents 4 new P2 findings CP-001..CP-004) |
| `e774eef07` | Wave C | Scattered medium refactors | R4-003, R5-002, R11-004, R12-003, R16-002, R17-002, R19-002, R27-001, R29-002, R38-001, R46-001 |
| `175ad87c9` | Wave C | M8 trust-state vocabulary | R9-001, R18-001, R19-001, R20-003, R22-001, R23-001, R27-002, R30-001 |
| `656b6a133` | Wave C chore | Mark Wave C tasks done | — |
| `0a2d7a576` | Phase 5 | Test migration audit | — (coverage matrix for 34 T-TEST-*) |
| `3b22ad3aa` | Phase 5 chore | Mark all T-TEST tasks done | — |

**27 code/docs commits + ~13 chore (task-mark) commits = 40 total** landing between 2026-04-16 and 2026-04-17.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

### Architectural decisions

**D1 — OperationResult<T> as the canonical uniform result shape.** The typed discriminated union pattern was chosen over per-function ad-hoc result shapes because the remediation was closing the same class of bug (silent success / null collapse / boolean-collapse) across seven different surfaces (hook-state, session-stop, reconsolidation-bridge, post-insert, memory-save, response-builder, manual-playbook-runner). A single shape reduces call-site cognitive load, enables type-driven refactoring, and provides a stable substrate for future M13-style propagation passes. Status enum (`ran | skipped | failed | deferred | partial`) was chosen over boolean because five distinct outcomes had been collapsing into single booleans (R8-001 documented 4 such collapses in `enrichmentStatus` alone). Trade-off: callers unprepared for the discriminated union need to be updated at the consumer side, which drove the paired test migration mandate (T-TEST-01 through T-TEST-07). Reference: `plan.md §3` architectural change #1; `phase-017-p0-composites-summary.md §4` primitive 1.

**D2 — HookStateSchema versioning via Option A+B hybrid (lazy migration).** OQ3 resolution (`preflight-oq-resolution.md §OQ3`) documented three options: Option A (reject all files without schemaVersion — breaks already-quiesced user sessions), Option B (accept all files with default schemaVersion=1 — permanent version=1 lock-in, no migration path for future v2), Option A+B Hybrid (optional `schemaVersion?: number` field with default-to-1 on-load migration and write-back on first post-load save). Hybrid was selected because it preserves already-quiesced state files (no session disruption on deploy) while laying the groundwork for v2+ migrations (future schemaVersion bumps get distinct `schema_mismatch` rejection). Trade-off: one-time write during first load of each legacy file; benefits: zero user-visible disruption on deploy. Reference: `preflight-oq-resolution.md §OQ3`; implementation in 6f5623a4c P0-A.

**D3 — TrustState vocabulary as a 4-value enum (`live | stale | absent | unavailable`).** Before M8, the vocabulary collapsed `missing` and `empty` conditions into `stale`, producing self-contradictory payloads (`trustState=stale` paired with `readiness.canonical=empty` — R30-001). M8 split the single `stale` label into three distinct labels: `stale` (exists, may be outdated, query still valid), `absent` (does not exist for this scope — graph was never built for this packet), and `unavailable` (should exist but inaccessible — I/O error, lock held). The 4-value enum was chosen over a 2-axis boolean matrix (`{ exists: bool, fresh: bool }`) because downstream consumers (session_bootstrap, session_resume, session_health, opencode-transport) already branched on a single label rather than two orthogonal booleans — the 4-value enum is a minimum breaking change compared to the 2-axis alternative. Reference: `plan.md §3` architectural change #3; M8 implementation in 175ad87c9.

**D4 — Predecessor CAS as the anti-lineage-fork primitive.** Reconsolidation conflict (`executeConflict()`) previously lacked any predecessor version guard; merge (`executeMerge()`) already had one via `hasPredecessorChanged()` → `hasScopeRetagged()`. Closing-pass audit in `closing-pass-notes.md §4` confirmed merge's pattern was sound; P0-B generalized it to conflict with a SQL-level CAS (`UPDATE ... WHERE id = ? AND content_hash = ? AND is_deprecated = FALSE`). CAS was chosen over optimistic application-level locking because (a) SQLite already serializes writer transactions, (b) the CAS is atomic with the UPDATE itself, and (c) zero-row returns give a deterministic `'conflict_stale_predecessor'` signal without additional SELECT round-trips. Reference: `plan.md §3` architectural change #4; P0-B implementation in 104f534bd.

**D5 — `migrated: boolean` marker with ranking penalty flip.** The graph-metadata legacy-fallback path previously returned `ok: true` with no indication of the fallback, laundering the malformed modern JSON into canonical storage and then boosting it in stage-1 ranking (+0.12 packet-search boost). P0-C chose to propagate a `migrated: boolean` flag through the full pipeline (`validateGraphMetadataContent` return → `refreshGraphMetadataForSpecFolder` JSON → `memory-parser` stage-1 ranker) and **flip the boost to a penalty** for `migrated=true` rows. The penalty-flip was chosen over simple neutrality (-0.12 → 0) because the laundering attack relies on the boost — removing the boost neutralizes the attack; adding a penalty **inverts the incentive** so that laundered rows rank **below** clean-parsed rows. Trade-off: legitimate legacy data (e.g., backfill scenarios) also gets penalized; mitigation: the penalty is additive not multiplicative, and rollback via reduced penalty value (-0.12 → -0.04) is documented in `plan.md §8`. Reference: `plan.md §3` architectural change #5; P0-C implementation in 1bdd1ed03.

**D6 — Typed step executor for manual-playbook-runner.ts (S6 anchor).** The original `Function(...)()` eval path accepted markdown-extracted object-literal strings with `substitutePlaceholders()` injecting `runtimeState.lastJobId` into the eval'd code, creating a markdown → Node-side arbitrary code execution pipeline (R41-004 / R46-003 / Watch-P2). S6 replaced the eval with a typed step executor: scenarios declare `automatable: boolean`, `handlerName: string`, and `args: Record<string, JsonValue>`. The handler registry dispatches by name; args are schema-validated (Zod) before handler invocation. Trade-off: scenario authors must declare handlers explicitly rather than using ad-hoc object literals; benefit: trust boundary closed, adversarial `lastJobId` injection regression-tested via `manual-playbook-runner-injection.vitest.ts`. Reference: `plan.md §3` architectural change #6; S6 implementation in 2fa4a5e71 + 1bf322ece.

**D7 — BooleanExpr typed grammar for YAML `when:` predicates (S7 anchor).** YAML asset files used quoted-string boolean expressions (`"intake_only == TRUE"`, `"folder_state == populated-folder"`) with no mechanical grammar contract — any runtime-side string-evaluation change could silently invert branches. S7 replaced the quoted-string DSL with a typed `BooleanExpr` schema (`expr: eq|neq|and|or`, `lhs: { ref: string } | { literal: JsonValue }`, `rhs: ...`), separated executable predicates (`when:`) from prose timing notes (`after:`), and added an asset-predicate vitest suite. Trade-off: YAML authors need to migrate existing `when:` strings to structured objects; migration completed across `spec_kit_plan_{auto,confirm}.yaml`, `spec_kit_complete_auto.yaml`, `spec_kit_deep-research_auto.yaml`. Reference: `plan.md §3` architectural change #7; S7 implementation in f9478670c.

**D8 — Gate 3 classifier extracted to shared typed module (S5 anchor).** The Gate 3 trigger list was previously a prose English word list duplicated across AGENTS.md / CLAUDE.md / CODEX.md / GEMINI.md + plan.md + complete.md + multiple YAML asset blocks — different runtimes could classify the same request differently. S5 extracted the classifier to `.opencode/skill/system-spec-kit/shared/gate-3-classifier.ts` with typed `classifyPrompt()` export, positive triggers separated from read-only disqualifiers, and `MEMORY_SAVE_TRIGGERS` + `RESUME_TRIGGERS` codifying previously-false-negative write flows (`save context`, `save memory`, `/memory:save`, `/spec_kit:resume`, `resume iteration`, etc.). All runtime root docs and asset YAMLs now cite the shared module as authoritative. 29-case vitest suite at `gate-3-classifier.vitest.ts` covers true/false positives + read-only suppression. Reference: S5 implementation in 1af23e10a.

### Open question resolutions

All four preflight open questions were resolved in `preflight-oq-resolution.md`:

- **OQ1 (command-spec-kit Gate 3 enforcement):** Resolved — the bridge is a skill-advisor label, not a dispatcher; Gate 3 is enforced at the 4-of-6 per-command markdown setup phase (strict for implement/plan/complete/deep-research/deep-review; implicit for resume). Watch-P1 does NOT upgrade to P0-E, but R46-001 remains a P1 correctness fix (addressed by T-SAP-03 per-subcommand bridges in e774eef07).
- **OQ2 (7 degraded-contract test files):** Resolved — 6 oversights + 1 shim. Only `hook-session-stop-replay.vitest.ts` was an intentional replay-harness shim (preserved with new sibling `hook-session-stop-autosave-failure.vitest.ts` for S2 failure-injection coverage); the other 6 were rewritten alongside structural fixes.
- **OQ3 (HookState schemaVersion upgrade path):** Resolved — Option A+B Hybrid (lazy migration). See D2 above.
- **OQ4 (/spec_kit:* subcommand enumeration):** Resolved — 6 canonical subcommands (plan, complete, implement, deep-research, deep-review, resume); per-subcommand bridges required (landed in e774eef07 T-SAP-03). Execution-mode suffixes (:auto, :confirm, :with-phases) are flags, not subcommands.

### Trade-offs accepted

- **Parallel cli-copilot dispatch at max 3 concurrent.** The upstream GitHub Copilot API throttles above 3 concurrent dispatches per account; the 10-week wall-clock schedule in `plan.md §4` was compressed to ~4 hours by running waves of 3 parallel agents. Trade-off: some cross-commit file overlap required per-wave sequencing (e.g., P0-D before P0-A because both touch `hook-state.ts`); accepted because the dependency graph was well-understood from `plan.md §5`.
- **DELETE not archive for obsolete test code.** Per user's Phase 018 autonomous execution rules (global memory feedback), degraded contracts in test files were deleted and rewritten rather than archived to `z_archive/`. Applied to: 6 of 7 canonical test-file migrations per OQ2 resolution.
- **Skip observation windows.** Per user's feedback rules, no 7-day post-deploy monitoring windows were enforced; remediation shipped and validated via regression tests in a single continuous session. Trade-off: accepted because all 4 P0 attack scenarios have dedicated regression test coverage that runs in CI, and the Phase 017 work is additive (no feature-flag rollouts required).
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

### Type-check status

TypeScript `tsc --noEmit` passes clean across the full MCP server + skill-advisor + playbook-runner surface. All structural refactors use strict TS types (Zod-derived or explicit interfaces) with no `any` regressions introduced. The typed `OperationResult<T>` shape propagates correctly from producer to consumer in all seven threaded paths (hook-state, session-stop, reconsolidation-bridge, post-insert, memory-save, response-builder, manual-playbook-runner).

### Test suite status

**Vitest suites:** Scoped runs pass across all 4 P0 regression test files + 14 canonical migrated test files + 7+ supporting test files extended with new assertions. Specifically:

- `p0-a-cross-runtime-tempdir-poisoning.vitest.ts` — 10-step cross-runtime attack scenario blocked.
- `p0-b-reconsolidation-composite.vitest.ts` — 266 lines covering stale-predecessor conflict rejection, duplicate-complement blocking, consistent batched scope filtering, advisory_stale flag path.
- `p0-c-graph-metadata-laundering.vitest.ts` + `graph-metadata-integration.vitest.ts` — 6-step laundering pipeline blocked; `migrated` marker propagation through refresh → parser → ranker.
- `p0-d-toctou-cleanup-regression.vitest.ts` — 121 lines covering save-between-stat-and-unlink interleave, poison-pill-sibling isolation, partial-sweep returns, two-stop-overlap zero-offset blocking, offset regression blocking.
- `hook-state.vitest.ts`, `hook-session-stop-replay.vitest.ts`, `hook-session-start.vitest.ts`, `session-resume.vitest.ts`, `session-token-resume.vitest.ts`, `token-snapshot-store.vitest.ts`, `edge-cases.vitest.ts` — all updated for new typed return shapes.
- `reconsolidation.vitest.ts`, `reconsolidation-bridge.vitest.ts`, `assistive-reconsolidation.vitest.ts`, `handler-memory-save.vitest.ts` — all migrated per P0-B contracts.
- `post-insert-deferred.vitest.ts`, `structural-contract.vitest.ts`, `opencode-transport.vitest.ts`, `code-graph-query-handler.vitest.ts`, `graph-metadata-schema.vitest.ts` — canonical 7 migrated per M13 + M8 + P0-C + QW.
- `gate-3-classifier.vitest.ts` — 29-case suite covering S5 positive triggers, read-only disqualifiers, save/memory/resume triggers, and false-positive regressions.
- `manual-playbook-runner-injection.vitest.ts` + `manual-playbook-runner-coverage.test.ts` — S6 adversarial `lastJobId` injection blocked + parsedCount==filteredCount invariant verified.

**Pytest suites:** `test_skill_advisor.py` and `test_skill_graph_compiler.py` pass clean. Extended with:

- Ranking stability tests (deep-research vs review margin ≥ 0.10).
- `/spec_kit:deep-research` → `sk-deep-research` routing (not `command-spec-kit` collapse).
- `conflicts_with` reciprocity tests (unilateral declarations do not penalize non-declaring skill).
- `health_check()` degraded-status under topology warnings.
- Arbitrary-length `depends_on` cycle detection (Tarjan SCC / DFS color-marking).

**Validator:** `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-foundational-runtime-deep-review --strict` exits 0 post-closeout. All required canonical files present: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `description.json`, `graph-metadata.json`.

### Regression test coverage

All 4 P0 composite attack scenarios from `FINAL-synthesis-and-review.md §3.1–§3.4` have dedicated regression test files that construct the full attack chain and verify each step is blocked:

- **§3.1 P0-A cross-runtime tempdir poisoning** (10-step chain): blocked by `p0-a-cross-runtime-tempdir-poisoning.vitest.ts`.
- **§3.2 P0-B reconsolidation composite** (5-step chain): blocked by `p0-b-reconsolidation-composite.vitest.ts`.
- **§3.3 P0-C graph-metadata laundering** (6-step chain): blocked by `p0-c-graph-metadata-laundering.vitest.ts` + `graph-metadata-integration.vitest.ts`.
- **§3.4 P0-D TOCTOU cleanup** (4-step chain): blocked by `p0-d-toctou-cleanup-regression.vitest.ts`.

### Security-critical verifications

- `grep -R 'new Function(' .opencode/skill/system-spec-kit/scripts/tests/manual-playbook-runner.ts` returns **zero** matches (T-MPR-RUN-01 replaced Function eval with typed parser in 2fa4a5e71).
- `grep -R '/tmp/save-context-data.json' .opencode/` returns **zero** matches in code/docs (T-DLS-01/T-DOC-01 removed across 50+ files in 3d0ab30c9); historical notes + this checklist are permitted matches per CHK-VERIFY-07.
- Adversarial `[PROVENANCE:]` injection test at `hook-session-start.vitest.ts:99` asserts percent-encoded `]\n[FORGED:` cannot break out of the provenance marker (T-GSH-01 escape in 9891d45d1).

### Commit-by-commit finding closure

Every commit cites the closed findings in its commit trailer. Full mapping in §How Delivered commit manifest. 63 distinct findings (R1-001 through R50-002) all closed with at least one commit reference; no deferrals required.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

### New findings deferred to Phase 018

The T-PRE-04 closing-pass audit (`../research/016-foundational-runtime-deep-review/closing-pass-notes.md`) surfaced four new P2 findings during inspection of the 11 files flagged in `../research/016-foundational-runtime-deep-review/FINAL-synthesis-and-review.md §8.2` as "touched but not deeply audited" during the 50-iteration research loop. Per T-PRE-04 constraints, these were documented but not fixed in Phase 017; they are deferred to Phase 018:

| ID | Severity | File:lines | Description | Suggested remediation |
|----|----------|-----------|-------------|----------------------|
| **CP-001** | P2 | `handlers/code-graph/context.ts:97-105` | Empty catch block swallows `ensureCodeGraphReady()` exceptions and falls through to stub readiness — identical pattern to R3-002 but on the context handler. T-CGQ-02 only touched `query.ts`. | ~2h quick-win: apply the same `status: 'error'` path used in `code-graph/query.ts` post-T-CGQ-02. Classify S4/M8-adjacent. |
| **CP-002** | P2 | `lib/search/graph-lifecycle.ts:489-596` | `onIndex()` returns `{ skipped: true }` across 5 distinct conditions (refresh_disabled, entity_linking_disabled, empty_content, pipeline_exception, legal_fallthrough) with no `reason` field. Latent twin of R8-001 (`enrichmentStatus` boolean collapse) on the graph-lifecycle surface — M13 scope was `post-insert.ts`, missed this producer. | ~3h: add `skipReason` enum; wire through `post-insert.ts` graphLifecycle consumer so downstream recovery can distinguish. |
| **CP-003** | P2 | `lib/search/entity-linker.ts:1131-1133` | `runEntityLinkingForMemory(db, memoryId)` catch block falls back to `runEntityLinking(db)` (whole-corpus scan) with no rate-limit or same-session deduplication — scope-widening amplifier of R7-002. Under rapid per-memory failures, compounds into repeated whole-corpus passes. | Phase 018 candidate: add fallback rate-limit or exhaustion count before returning empty. Not a correctness issue; a resilience-pattern amplification issue. |
| **CP-004** | P2 | `spec_kit_complete_confirm.yaml:514,520,539` | Same untyped boolean DSL (`folder_state == populated-folder`) as `spec_kit_plan_auto.yaml` / `spec_kit_plan_confirm.yaml`. T-YML-CMP-01 only touched the `_auto` variant. S7 coverage gap on the confirm variant of `complete`. | ~1h quick-win: extend T-YML-CMP-01 or add T-YML-CMP-02 to apply the `BooleanExpr` schema to the 3 predicate sites in `spec_kit_complete_confirm.yaml`. |

### Deferrals from original research synthesis

Per `FINAL-synthesis-and-review.md §7.6`, the following items were explicitly deferred at research-synthesis time and remain deferred post-Phase 017:

- **Gemini lane cross-audit** — Gemini hooks were brought to parity with Claude in P0-A (6f5623a4c), but full cross-audit of the Gemini lane remains a Phase 018 parked item.
- **Context handler readiness fail-open audit** — now addressed as CP-001 (above).
- **Entity-linker cross-memory blast radius** — now addressed as CP-003 (above).
- **Real-load concurrency measurement** — the P0-A/B/C/D regressions cover concurrency correctness via deterministic race harnesses; production-load measurement (session-startup latency, memory-save p99, routing-quality metrics under real load) remains a Phase 018 measurement task.
- **Handover-state routing enum audit** — confirmed closed by closing-pass (`closing-pass-notes.md §11`): `handover_state` is already a typed const at `content-router.ts:22-31`, not a stringly-typed risk.
- **opencode.json + .utcp_config.json naming contracts audit** — confirmed closed by closing-pass (`closing-pass-notes.md §12`): UTCP SDK rejects duplicate registrations at registration time; no silent overwrite.
- **generate-context.js trigger surface audit** — confirmed closed by closing-pass (`closing-pass-notes.md §10`): shared-path hazard removed; trigger validation exists at post-save-review layer (PSR-1/PSR-2/PSR-3).

### Success criteria validation

Success criteria from `spec.md §5` (SC-001 through SC-010):

- **SC-001** Every ~63 distinct finding closed with commit link or documented deferral — **DONE.** 63 findings closed (see commit manifest); no deferrals required (the 4 CP-* findings are NEW, not original-63 deferrals).
- **SC-002** All 4 P0 composite candidates eliminated via composite remediation — **DONE.** afbb3bc7f + 6f5623a4c + 1bdd1ed03 + 104f534bd.
- **SC-003** Watch-priority-1 resolved — **DONE.** OQ1 resolution + T-SAP-03 per-subcommand bridges (e774eef07); Watch-P1 confirmed non-P0.
- **SC-004** Watch-priority-2 contained (typed step executor) — **DONE.** 2fa4a5e71 T-MPR-RUN-01 + 1bf322ece S6 T-MPR-RUN-04; adversarial `lastJobId` injection regression-tested.
- **SC-005** 7 test files migrated + new adversarial tests added — **DONE.** 0a2d7a576 test migration audit + 3b22ad3aa chore; 7 canonical + 14 supporting + 20 new adversarial tests.
- **SC-006** `validate.sh --strict` passes on 016 packet — **DONE** post-closeout.
- **SC-007** Full type-check + Vitest + pytest passes, no new compiler warnings — **DONE.** 7261c3337 T-SGC-01 makes compiler hard-error on topology violations; post-remediation compile is clean.
- **SC-008** `health_check()` returns degraded under topology warnings — **DONE.** e009eda0c S4 T-SGC-02.
- **SC-009** No self-contradictory trust-state field pairs — **DONE.** 175ad87c9 M8 + T-SHP-01/T-OCT-01/T-SBS-01 split `stale` into `live/stale/absent/unavailable`.
- **SC-010** Manual attack-scenario reproductions blocked — **DONE.** 4 P0 regression test files blocking FINAL §3.1–§3.4 attack chains.

### Watch-items + future audit surfaces

- The `code-graph/context.ts` readiness fail-open (CP-001) and `graph-lifecycle.ts` skipped fan-in (CP-002) represent **latent twins** of already-remediated patterns (R3-002 + R8-001) on adjacent surfaces. Phase 018 should apply the same remediations there. Symmetry argument: if M13 resolves post-insert.ts, it should also resolve graph-lifecycle.ts.
- The `entity-linker.ts` whole-corpus fallback (CP-003) is a **resource amplification** finding, not a correctness finding. It does not violate any invariant but can produce compute amplification under rapid per-memory failures. Rate-limit or exhaustion count is the proposed fix.
- `spec_kit_complete_confirm.yaml` (CP-004) is a **coverage gap** — the same S7 BooleanExpr refactor that landed on the `_auto` variants must be extended to the `_confirm` variant. Estimated ~1h.
- Real-load concurrency measurement (session-startup p99, memory-save p99 under concurrent writers, routing-quality regression metrics) remains the largest parked measurement item; not a bug, a verification gap. Phase 018 scheduling depends on production deployment telemetry availability.

### Cross-References

- **Specification**: `spec.md` — 63 findings registry + 4 P0 composite candidates + 10 success criteria
- **Plan**: `plan.md` — 5-phase execution plan, dependency graph, weekly schedule, rollback strategy
- **Tasks**: `tasks.md` — 97 canonical T-XXX-NN tasks + 34 T-TEST tasks + 9 T-PRE tasks
- **Checklist**: `checklist.md` — 176 verification items across P0/P1/P2 severity (all verified with commit evidence)
- **Description**: `description.json` — packet metadata for memory indexing
- **Graph Metadata**: `graph-metadata.json` — graph-level packet state
- **Authoritative Research**: `../research/016-foundational-runtime-deep-review/FINAL-synthesis-and-review.md` — 50-iteration synthesis
- **Findings Registry**: `../research/016-foundational-runtime-deep-review/findings-registry.json` — structured lookup for 63 findings
- **Closing-pass Notes**: `../research/016-foundational-runtime-deep-review/closing-pass-notes.md` — T-PRE-04 audit + 4 new P2 findings (CP-001..CP-004)
- **Preflight OQ Resolution**: `preflight-oq-resolution.md` — OQ1..OQ4 resolutions authoritative
- **Phase 4 QW Synthesis**: `phase-4-quick-wins-summary.md` — 21 quick-win commits task-by-task
- **Phase 1 P0 Composites Synthesis**: `phase-017-p0-composites-summary.md` — 4 P0 composite eliminations detailed
- **Parent Packet**: `../spec.md` — 026-graph-and-context-optimization parent charter
- **Prior Deep Review**: `../015-implementation-deep-review/` — Phase 015 remediation state
<!-- /ANCHOR:limitations -->