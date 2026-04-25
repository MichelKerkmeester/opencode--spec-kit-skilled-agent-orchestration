---
title: "Implementation Summary: Memory Indexer Invariants [system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/implementation-summary]"
description: "Unified implementation summary for both invariant tracks, Wave-1 SQL-layer remediation, Wave-2 hardening, live DB cleanup results, and the phase-merge restructure."
trigger_phrases:
  - "026/010 implementation summary"
  - "memory indexer invariants implementation summary"
  - "index scope implementation summary"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level3-arch | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants"
    last_updated_at: "2026-04-24T19:25:00+02:00"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Merged Track A + Track B implementation summaries into root"
    next_safe_action: "Restart MCP and rerun memory_index_scan on 026/009 to close Track A live acceptance"
    blockers:
      - "Track A live MCP rescan on 026/009 still pending"
    completion_pct: 95
    status: "code-complete-pending-track-a-live-rescan"
    open_questions: []
    answered_questions:
      - "A2 preserves similarity search surface and localizes the safety rule to PE orchestration."
      - "B2 replaced B1 after live acceptance proved the transactional reconsolidation recheck, not batch overlap, was the real source of candidate_changed."
      - "z_future rows are deleted (invariant is absolute); invalid constitutional saves are downgraded to important (preserves otherwise valid saves)."
      - "Constitutional README is a human-facing overview, not a rule surface; keeps constitutional_total at 2."
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level3-arch | v2.2 -->"
---
# Implementation Summary: Memory Indexer Invariants

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level3-arch | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 010-memory-indexer-invariants |
| **Level** | 3 |
| **Completed** | 2026-04-24 (Track B fully; Track A code complete, pending live MCP rescan) |
| **Status** | Code Complete Pending Track A Live Rescan |
| **Parent** | `026-graph-and-context-optimization/` |
| **Predecessor** | `../010-hook-parity/` |
| **Successor** | None |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This packet lands two invariant tracks over the same runtime surface and consolidates them into one coordinated release.

### Track A — Lineage and Concurrency

Closes two distinct save-path regressions surfaced by the read-only investigation at `/tmp/codex-lineage-investigation-output.txt`:

- **`E_LINEAGE` cross-file reuse** — `handlers/save/pe-orchestration.ts` now downgrades PE `UPDATE` and `REINFORCE` decisions to `CREATE` whenever the chosen candidate's `canonical_file_path` differs from the save target. Canonical-path plumbing lives in `handlers/pe-gating.ts` and `handlers/save/types.ts`.
- **`candidate_changed` scan recheck** — `handlers/memory-index.ts` threads `fromScan: true` into scan-originated saves while restoring the default `BATCH_SIZE`, and `handlers/memory-save.ts` skips the transactional reconsolidation recheck only for those saves. Non-scan saves keep the normal guarded path.

Regression coverage: `tests/pe-orchestration.vitest.ts` (sibling-doc lineage) and `tests/handler-memory-index.vitest.ts` (`fromScan` propagation + non-scan control).

### Track B — Index Scope and Constitutional Tier Invariants

Closes the live database pollution (`5700` constitutional rows with only `2` from real `/constitutional/` files; `5947` `z_future` rows) and permanently enforces three invariants:

1. `z_future/` paths must never be indexed.
2. `external/` paths must never be indexed by memory or code-graph scanners.
3. The `constitutional` tier is valid only for `/constitutional/` files.

The invariant is enforced through a shared SSOT (`mcp_server/lib/utils/index-scope.ts`) with two public predicates (`shouldIndexForMemory`, `shouldIndexForCodeGraph`) and one exclusion set (`EXCLUDED_FOR_MEMORY`). The SSOT is imported by memory discovery (`memory-index-discovery.ts`), spec-doc classification (`spec-doc-paths.ts`), parser admissibility (`memory-parser.ts`), save-time guards (`memory-save.ts`), and the code-graph walker (`structural-indexer.ts`, `indexer-types.ts`).

Defense-in-depth layers cover every mutation surface:

- Save-time guard + tier downgrade in `memory-save.ts`
- SQL-layer downgrade before `UPDATE memory_index ...` in `vector-index-mutations.ts`
- Inline guard on post-insert metadata in `post-insert-metadata.ts`
- Atomic restore validation in `checkpoints.ts` inside the barrier-held transaction
- Shared audit emission via `GOVERNANCE_AUDIT_ACTIONS` and `recordTierDowngradeAudit()` in `lib/governance/scope-governance.ts`

### Wave-1 Remediation (Storage-Layer Bypass Closure)

Deep-review pass-1 identified two release-blocking bypasses and the missing audit surface; Wave-1 closed all three.

| Finding | Patch Surface |
|---------|---------------|
| `memory_update` could promote arbitrary rows to constitutional | `vector-index-mutations.ts` SQL-layer downgrade |
| `checkpoint_restore` could replay invariant-violating snapshot rows | `checkpoints.ts` atomic restore validation |
| Downgrade attempts left no durable audit trail | `governance_audit` row with `action='tier_downgrade_non_constitutional_path'`, emitted from save / update / checkpoint / post-insert paths |

### Wave-2 Hardening (Pass-2 Deferred Items)

Pass-2 flagged five P1 items and doc drift; Wave-2 closed all of them surgically without regressing Wave-1 guards.

| Finding IDs | Patch Surface | Evidence |
|-------------|---------------|----------|
| `P1-pass2-004`, `P2-pass2-006` | `scripts/memory/cleanup-index-scope-violations.ts:318-358,429-435` | Cleanup preserves historical `governance_audit` rows for deleted memories, emits `tier_downgrade_non_constitutional_path_cleanup` per downgraded row, and rebuilds the apply plan inside the transaction snapshot |
| `P1-013`, `P1-014` | `lib/config/spec-doc-paths.ts:29-80`; `handlers/memory-index-discovery.ts:28-49,89-130,243-285` | Spec-doc classification and discovery call `shouldIndexForMemory()` as SSOT with additive overlays only |
| `P1-003`, `P1-017` | `lib/utils/canonical-path.ts:32-41`; `handlers/memory-save.ts:308-325,2714-2718`; `code-graph/lib/structural-indexer.ts:1273-1285` | Save-time invariant checks and code-graph `specificFiles` evaluate `fs.realpathSync()` results instead of string-normalized paths |
| `P1-001`, `P1-009` | `scripts/memory/cleanup-index-scope-violations.ts:429-435`; `handlers/memory-index-discovery.ts:28-49,91-110,253-273`; `code-graph/lib/structural-indexer.ts:1161-1240` | Cleanup apply builds from the transaction snapshot; `.gitignore` reads cap at 1MB, recursive walkers stop at depth 20 or 50,000 nodes with warnings |
| `P2-pass2-003`, `P2-pass2-004`, `P2-pass2-007`, `P1-015` | `lib/governance/scope-governance.ts:117-137,184-195,372-390`; `lib/search/vector-index-mutations.ts:64-100,450-472`; `handlers/memory-crud-update.ts:156-200`; `lib/storage/post-insert-metadata.ts:91-116`; `handlers/memory-save.ts:318-325`; `lib/storage/checkpoints.ts:92-100,1291-1368,1570-1572,1651,1858-1862`; `.opencode/skill/system-spec-kit/mcp_server/README.md:119-123` | Shared action strings and `recordTierDowngradeAudit()` drive every tier-downgrade emitter; update-path `constitutional → critical` transitions are audited; the operator README documents the stable action strings |

### Cleanup CLI

`scripts/memory/cleanup-index-scope-violations.ts` provides dry-run / apply / verify modes. The apply path opens `database.transaction(...)`, rebuilds the cleanup plan inside the transaction snapshot to close the TOCTOU window, emits governance-audit rows for every downgrade, and lets the `memory_index` trigger chain handle FTS cleanup.

### Root Merge Restructure

Both tracks originally shipped as sibling phase folders (`001-*/`, `002-*/`). On 2026-04-24 the phase folders were merged into the root packet — `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and `implementation-summary.md` were rewritten to own the full consolidated context rather than delegating to phase docs. Legacy flat and phase paths are preserved in `graph-metadata.json.aliases` so external cross-references continue to resolve.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The packet landed in five stages:

1. **Investigation** — Read `/tmp/codex-lineage-investigation-output.txt`, live-inspected the Voyage-4 DB, and confirmed both tracks' root causes (5700 constitutional / 5947 z_future / duplicate gate-enforcement rows at ids 1 and 9868).
2. **Track A runtime changes** — Added canonical-path plumbing to `SimilarMemory`, implemented the A2 PE orchestration guard, restored default scan batch size, threaded `fromScan: true`, and guarded the transactional reconsolidation recheck.
3. **Track B baseline wiring** — Created `index-scope.ts` as SSOT, wired it into memory discovery + spec-doc classification + `isMemoryFile()` + save + code-graph, added the cleanup CLI with dry-run / apply / verify, and ran the first live cleanup.
4. **Wave-1 storage-layer remediation** — Hoisted the constitutional-tier guard into `vector-index-mutations.ts`, protected post-insert metadata writes, added atomic restore validation in `checkpoints.ts`, and standardized downgrade audit emission.
5. **Wave-2 hardening and root merge** — Closed cleanup-audit durability, unified SSOT imports, added realpath canonicalization and walker DoS caps, extracted shared governance-audit helpers, and merged both phase tracks into root docs with legacy-path aliases preserved.

### Timeline

- `2026-04-23` — Track A shipped: B1 replaced with B2 after live acceptance evidence; focused regressions `26/26` passed; typecheck + build exit `0`; `test:core` exit `124` with unrelated `copilot-hook-wiring` carryover.
- `2026-04-24` — Track B baseline + Wave-1 + Wave-2 shipped; live cleanup applied and verified.
- `2026-04-24` — Root merge: both phase folders merged into root docs; description + graph-metadata rewritten; phase folders removed from the tree.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Track A Fix A2 over A1 | Preserves vector-search surface; safety rule lives at the PE decision point where lineage actually matters |
| Track A Fix B2 over B1 | Live acceptance proved the transactional reconsolidation recheck (not batch overlap) was the real `candidate_changed` source — `E_LINEAGE 68→0` and `candidate_changed 58→159` under A+B1 |
| Track B Shared helper + defense-in-depth | The bug was policy drift across walkers and save paths; one SSOT plus guards at every mutation surface prevents reintroduction |
| Track B Delete `z_future` over downgrade | The invariant is absolute; downgrading would keep forbidden rows indexed and still pollute retrieval |
| Track B Downgrade invalid constitutional to `important` | Preserves the save while stopping polluted tier; rejecting would break valid spec-doc saves over metadata drift |
| Track B Constitutional README excluded | User-directed invariant — README is human-facing overview, not a runtime rule surface |
| Wave-1 Enforce at the storage layer | `memory_update` and `checkpoint_restore` bypassed the handler-only check; SQL-layer downgrade + atomic restore validation is the only place shared by both user-facing and internal mutation paths |
| Wave-2 Keep cleanup audits durable | Bulk-downgrade without audit rows made the cleanup path invisible to forensic review |
| Wave-2 Spec-doc exclusions stay additive around SSOT | Duplicated exclusion arrays caused `z_archive` drift; additive overlays keep packet-specific walker behavior without forking the invariant |
| Wave-2 Realpath over `path.resolve()` | Symlinks into `z_future/` could bypass string-normalized checks |
| Wave-2 Cleanup plan on transaction snapshot | Pre-transaction plan + mutating apply opened a TOCTOU window where a concurrent write could leave a violating row behind |
| Root merge into single packet | Both tracks share the same runtime surface, evaluation tests, and operator-facing invariant surface; one packet beats two sibling phases for discoverability |
| Preserve legacy paths in `graph-metadata.json.aliases` | External docs and historical cross-references keep resolving without a full fanout update |

See `decision-record.md` (ADR-001 through ADR-012) for each decision's full alternatives, constraints, and five-checks evaluation.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

### Track A Verification

| Check | Command | Result |
|-------|---------|--------|
| Track A focused regressions | `npx vitest run tests/pe-orchestration.vitest.ts tests/handler-memory-index.vitest.ts` | passed (`26/26`) |
| Typecheck | `npm run typecheck` | exit `0` |
| Build | `npm run build` | exit `0` |
| Full core suite (Track A) | `timeout 240 npm run test:core` | exit `124` after surfacing unrelated `tests/copilot-hook-wiring.vitest.ts` failure |
| Isolated unrelated failure | `npx vitest run tests/copilot-hook-wiring.vitest.ts` | failed (exit `1`) in untouched code |
| Track A live packet rescan | `memory_index_scan` on `026/010-hook-parity` after MCP restart | **PENDING** — requires live-capable runtime; until this rerun is recorded, Track A packet readiness and scan counts are not authoritative |

Track A acceptance summary from live evidence:

| Mode | E_LINEAGE | candidate_changed | Notes |
|------|-----------|-------------------|-------|
| Before fix | 68 | 58 | baseline |
| After A + B1 | 0 | 159 | B1 insufficient; A converted E_LINEAGE to candidate_changed |
| After A + B2 (focused tests) | N/A | N/A | `26/26` focused regressions passed; live packet acceptance still pending |

### Track B Verification

| Check | Result |
|-------|--------|
| Pre-change `constitutional` rows | `5700` total, `2` under `/constitutional/` |
| Pre-change `z_future` rows | `5947` |
| Pre-change `external` rows | `0` |
| Duplicate gate-enforcement rule rows | IDs `1` and `9868`; newer row is `9868` |
| `mcp_server` typecheck + build | exit `0` |
| `scripts` typecheck + build | exit `0` |
| Wave-2 focused Vitest (`index-scope`, `memory-save-index-scope`, `memory-crud-update-constitutional-guard`, `checkpoint-restore-invariant-enforcement`, `cleanup-script-audit-emission`, `exclusion-ssot-unification`, `symlink-realpath-hardening`, `walker-dos-caps`) | exit `0`; `20` tests passed |
| README-regression Vitest (`handler-memory-index`, `memory-parser-extended`, `full-spec-doc-indexing`, `gate-d-regression-constitutional-memory`) | exit `0`; `218` tests passed |
| `tests/memory-governance.vitest.ts` | exit `0`; cleanup action-string coverage added for `tier_downgrade_non_constitutional_path_cleanup` |
| `timeout 300 npm run test:core` | exit `124`; carryover failures in `copilot-hook-wiring.vitest.ts` and `stage3-rerank-regression.vitest.ts` (both outside packet scope, reproduced in isolation) |
| Cleanup dry-run | exit `0` (post-final-state: `0` planned deletions and `0` downgrades) |
| Cleanup first apply | exit `0`; see "Cleanup Apply Details" below |
| README reversal delete | exit `0`; deleted memory `11672` plus `memory_history=1`, `memory_lineage=1`, `vec_memories=1`, `active_memory_projection=1`; `memory_index` handled FTS via trigger |
| Cleanup verify after reversal | exit `0` |
| Wave-1 cleanup verify | exit `0`; `constitutional_total=2`, `constitutional_in_folder=2`, `z_future_rows=0`, `external_rows=0`, `invalid_constitutional_rows=0`, `gate_enforcement_rows=1` |
| Wave-2 cleanup verify | exit `0`; `0` planned deletions, `0` duplicate deletes, `0` downgrades in the final state |
| Final SQL check | exit `0`; `constitutional_total=2`, `constitutional_in_folder=2` — only the two constitutional-folder rule files remain (gate-enforcement and gate-tool-routing) |
| Strict packet validate | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh ... --strict --no-recursive` exit `0` |

### Before / After DB Counts

| Metric | Before Cleanup | After Initial Cleanup | Final Corrected State |
|--------|----------------|-----------------------|-----------------------|
| `importance_tier='constitutional'` | `5700` | `2` | `2` |
| Constitutional rows under `/constitutional/` | `2` | `2` | `2` |
| Rows under `z_future` | `5947` | `0` | `0` |
| Rows under `external` | `0` | `0` | `0` |
| Invalid constitutional rows outside `/constitutional/` | `5698` | `0` | `0` |
| Gate-enforcement duplicates | `2` | `1` | `1` |

### Cleanup Apply Details

Successful first `--apply` reported:

- `deleted_memory_rows=254`
- `deleted_history_rows=252`
- `deleted_lineage_rows=251`
- `deleted_vector_rows=5945`
- `deleted_feedback_rows=9`
- `deleted_other_reference_rows=10811`
- `deleted_embedding_cache_rows=0`
- `downgraded_rows=0` (final state already normalized by Wave-1 SQL guards)
- `rewritten_feedback_rows=2`
- `rewritten_lineage_rows=3`
- `rewritten_mutation_ledger_rows=0`
- `fts_cleanup_strategy=memory_index_trigger`

The `deleted_memory_rows` count reflects the top-level `memory_index` deletes reported by SQLite after cascade/trigger behavior. The invariant outcomes are confirmed by the before/after summary counts above.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Track A live packet acceptance is pending.** The `memory_index_scan` rerun on `026/010-hook-parity` still requires an MCP restart in an embedding-capable runtime. Code-level fixes are shipped and focused regressions pass; only the live re-verification gate remains. Until that rerun is recorded here, Track A packet readiness and scan counts are not authoritative.
2. **MCP restart is required.** All runtime changes are built into `dist/`, but a running MCP client still needs a restart before the new save / scan / update / checkpoint / code-graph / cleanup-helper behavior is active for its clients.
3. **`npm run test:core` carryover.** The suite times out after surfacing existing failures in `tests/copilot-hook-wiring.vitest.ts` and `tests/stage3-rerank-regression.vitest.ts`. Both reproduce in isolation, both are outside this packet's touched files, and no attempt was made to widen scope and fix them here.
4. **`SPEC_DOC_INTEGRITY` prose-mention warnings persist.** Some packet docs mention runtime file paths in prose that the validator flags. This pattern pre-exists the packet and is consistent with other 026 packets — not a regression.
<!-- /ANCHOR:limitations -->
