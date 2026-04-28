---
title: "Plan: Memory Indexer Invariants [system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/plan]"
description: "Unified Level 3 implementation plan covering both invariant tracks: PE lineage guard + fromScan recheck bypass (Track A), and shared index-scope SSOT + multi-layer constitutional-tier enforcement + transactional cleanup CLI (Track B), including Wave-1 SQL-layer remediation and Wave-2 hardening."
trigger_phrases:
  - "026/010 plan"
  - "memory indexer invariants plan"
  - "index scope invariants plan"
  - "constitutional tier cleanup plan"
importance_tier: "important"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level3-arch | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants"
    last_updated_at: "2026-04-24T19:25:00+02:00"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Merged Track A and Track B plans into single root plan"
    next_safe_action: "Restart MCP and rerun memory_index_scan on 026/009 to close Track A live acceptance"
    blockers:
      - "Track A live MCP rescan on 026/009 still pending"
    completion_pct: 95
    status: "code-complete-pending-track-a-live-rescan"
    open_questions: []
    answered_questions:
      - "The memory invariant enforcement point is shared helper plus save-time guard plus SQL-layer guard plus restore-time validation."
      - "The constitutional downgrade target is `important`."
      - "Fix A is applied at PE orchestration decision time (A2); Fix B threads fromScan into memory_save (B2)."
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level3-arch | v2.2 -->"
---
# Implementation Plan: Memory Indexer Invariants

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js 20+, SQLite |
| **Framework** | MCP server plus scripts package |
| **Storage** | `better-sqlite3` + `sqlite-vec` Voyage-4 DB |
| **Testing** | Vitest |

### Overview

The plan is organized around two invariant tracks that share the same runtime surface:

- **Track A — Lineage and Concurrency** keeps the patch surgical: preserve canonical file path on PE candidates, downgrade cross-file `UPDATE` / `REINFORCE` decisions to `CREATE` (A2), restore the default scan batch size, and skip the save-time transactional reconsolidation recheck only for scan-originated saves (B2).
- **Track B — Index Scope and Constitutional Tier** starts from one shared path-scope SSOT module (`lib/utils/index-scope.ts`) and pushes it through memory discovery, spec-doc classification, `isMemoryFile()`, save-time guards, SQL-layer update writes, post-insert metadata, checkpoint restore, and code-graph scanning. Wave-1 closes the two release-blocking bypasses uncovered by deep review (SQL-layer update + checkpoint restore) and adds `governance_audit` durability. Wave-2 completes the deferred hardening: cleanup audit durability, SSOT unification, realpath canonicalization, cleanup TOCTOU closure, walker DoS caps, and shared governance-audit helpers.

The cleanup CLI (`scripts/memory/cleanup-index-scope-violations.ts`) is the one-shot maintenance tool that transactionally removes the existing `z_future` pollution, consolidates the duplicate gate-enforcement rule rows (keeping the newer row), and verifies invariants idempotently.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented per track
- [x] Success criteria measurable (zero-count verifications + focused test green)
- [x] Dependencies identified (`better-sqlite3`, `sqlite-vec`, embedding access for Track A rescan)

### Definition of Done
- [x] All acceptance criteria met (Track B fully; Track A code complete, pending live rescan)
- [x] Focused tests pass (Track A: `pe-orchestration` + `handler-memory-index`; Track B: `index-scope`, `memory-save-index-scope`, `memory-crud-update-constitutional-guard`, `checkpoint-restore-invariant-enforcement`, `cleanup-script-audit-emission`, `exclusion-ssot-unification`, `symlink-realpath-hardening`, `walker-dos-caps`, `memory-governance`)
- [x] `test:core` carryover failures isolated from this packet and recorded honestly
- [x] Docs updated (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`)

### Track-specific Gates

| Gate | Pass Criteria |
|------|---------------|
| Track A Fix A | `tasks.md` vs sibling `checklist.md` regression falls through to `CREATE` and never calls `updateExistingMemory` or `reinforceExistingMemory` |
| Track A Fix B | `fromScan` propagation test passes and the non-scan control still hits the transactional recheck |
| Track B SSOT | `shouldIndexForMemory()` rejects `z_future`, `external`, `z_archive`, `.git`, `node_modules`; `shouldIndexForCodeGraph()` rejects `external` plus legacy defaults |
| Track B Defense-in-depth | SQL-layer update, post-insert metadata, and checkpoint restore all downgrade invalid constitutional tiers and emit `governance_audit` rows |
| Track B Cleanup | Dry-run, apply, and verify all exit `0`; verify counts land at `constitutional_total=2`, `z_future_rows=0`, `external_rows=0`, `invalid_constitutional_rows=0` |
| Build & Typecheck | `mcp_server` and `scripts` both exit `0` on `npm run typecheck` and `npm run build` |
| Packet Validation | `validate.sh --strict --no-recursive` exits `0` |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

**Shared policy helpers + defense-in-depth guards.** One SSOT for path scope and one SSOT for governance-audit action strings. Every mutation surface (walker, save, update, post-insert, restore, cleanup) imports from those sources rather than defining its own rule.

### Key Components

- **`lib/utils/index-scope.ts`** — Canonical path-segment exclusions. Exports `EXCLUDED_FOR_MEMORY`, `shouldIndexForMemory(path)`, `shouldIndexForCodeGraph(path)`.
- **`lib/utils/canonical-path.ts`** — `resolveCanonicalPath()` wrapper around `fs.realpathSync` with fail-open fallback for missing targets.
- **`lib/governance/scope-governance.ts`** — `GOVERNANCE_AUDIT_ACTIONS` enum, `recordTierDowngradeAudit()`, and `buildGovernanceLogicalKey()`. Imported by every emitter.
- **`handlers/save/pe-orchestration.ts`** — A2 canonical-path guard: if the chosen candidate's `canonical_file_path` differs from the save target, rewrite the PE decision to `CREATE`.
- **`handlers/pe-gating.ts` + `handlers/save/types.ts`** — Carry `canonical_file_path` through `SimilarMemory` so the A2 guard has the data it needs.
- **`handlers/memory-index.ts`** — Threads `fromScan: true` into `indexMemoryFile()` for scan-originated saves; restores default `BATCH_SIZE`.
- **`handlers/memory-save.ts`** — B2 guard on the transactional complement recheck; B-track scope + tier guard; realpath canonicalization before invariant checks.
- **`handlers/memory-index-discovery.ts` + `lib/config/spec-doc-paths.ts` + `lib/parsing/memory-parser.ts`** — All call `shouldIndexForMemory()` as SSOT; spec-doc and discovery overlays are additive (scratch/, memory/, iterations/) rather than replacing the invariant set.
- **`lib/search/vector-index-mutations.ts` + `lib/storage/post-insert-metadata.ts` + `handlers/memory-crud-update.ts`** — SQL-layer downgrade before `UPDATE memory_index ...` and inline tier guard on post-insert writes. Update-path `constitutional → critical` transitions are audited.
- **`lib/storage/checkpoints.ts`** — Re-validates index-scope and tier invariants inside the barrier-held restore transaction; one invalid row aborts the restore atomically.
- **`code_graph/lib/indexer-types.ts` + `code_graph/lib/structural-indexer.ts`** — Preserves legacy default excludes, adds `external`, and routes both recursive and `specificFiles` scans through `shouldIndexForCodeGraph()`. Walker caps (`.gitignore` 1MB, depth 20, ≤ 50,000 nodes) apply to both memory and code-graph walkers.
- **`scripts/memory/cleanup-index-scope-violations.ts`** — Dry-run / apply / verify modes. The apply path rebuilds the plan inside `database.transaction(...)` to close the TOCTOU window between plan-build and mutation. Emits `tier_downgrade_non_constitutional_path_cleanup` audit rows and preserves historical `governance_audit` rows for deleted memories.

### Data Flow

```
Path candidate (memory save / index scan / code-graph scan / checkpoint restore)
       |
       v
resolveCanonicalPath() — fs.realpathSync with fail-open fallback
       |
       v
shouldIndexForMemory() / shouldIndexForCodeGraph() — reject z_future, external, etc.
       |
       v
Tier guard — if importance_tier='constitutional' AND path ∉ /constitutional/, downgrade to 'important'
       |
       v
recordTierDowngradeAudit() — durable governance_audit row with stable action string
       |
       v
Mutation (INSERT/UPDATE/RESTORE) — only runs when all guards pass
```

### Decision Rationale

- **Track A Fix A2 over A1**: A1 would filter candidates at vector search; A2 keeps discovery intact and moves the safety rule to the one decision point where lineage actually matters. Preserves existing similarity-search surface.
- **Track A Fix B2 over B1**: B1 forced `scanBatchSize=1` to serialize saves, but live acceptance showed the transactional reconsolidation recheck (inside the save transaction) was the real `candidate_changed` source. `E_LINEAGE 68→0` and `candidate_changed 58→159` proved B1 insufficient; B2 guards only the save-time recheck for scan saves.
- **Track B Shared helper over scattered checks**: The bug was policy drift across walkers and save paths. A shared helper fixes the drift; the save-time guard + SQL-layer guard + restore-time validation together prevent a bypass from reintroducing pollution even if a caller skips discovery.
- **Track B Delete `z_future` over downgrade**: The invariant is absolute, not "lower priority." Downgrading would keep forbidden rows indexed and still pollute retrieval.
- **Track B Downgrade invalid constitutional to `important` over reject**: Preserves the save while stopping the polluted tier; rejecting would break otherwise valid spec-doc saves over metadata drift.
- **Track B Constitutional README excluded**: User-directed invariant — the README is human-facing overview, not a runtime rule surface.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Investigation and Shared Infrastructure
- [x] Read `/tmp/codex-lineage-investigation-output.txt` and confirm Track A root causes
- [x] Live-inspect the Voyage-4 DB for Track B baseline (5700 constitutional, 5947 z_future, 0 external)
- [x] Read existing code paths: PE gating, prediction-error gate, scan batching, reconsolidation bridge, save-time transaction, memory discovery, spec-doc classification, code-graph walkers
- [x] Create `lib/utils/index-scope.ts` (SSOT for memory + code-graph exclusions)
- [x] Decide and document helper semantics in `decision-record.md` (ADR-001)

### Phase 2: Track A Runtime Changes
- [x] Add `canonical_file_path` to `SimilarMemory`
- [x] Preserve `canonical_file_path` in `findSimilarMemories()`
- [x] Add A2 downgrade guard in `handlers/save/pe-orchestration.ts`
- [x] Revert B1 (forced `scanBatchSize=1`) to restore default `BATCH_SIZE`
- [x] Thread `fromScan: true` through `handlers/memory-index.ts → indexMemoryFile()`
- [x] Guard the transactional complement recheck in `handlers/memory-save.ts` with `!fromScan`

### Phase 3: Track B Baseline Wiring
- [x] Wire memory discovery, spec-doc classification, and `isMemoryFile()` to `shouldIndexForMemory()`
- [x] Add save-time path rejection + constitutional tier downgrade in `handlers/memory-save.ts`
- [x] Wire code-graph recursive + specific-file scans to `shouldIndexForCodeGraph()`
- [x] Preserve existing code-graph default excludes + add `/external/`

### Phase 4: Wave-1 Storage-Layer Remediation
- [x] Hoist constitutional-tier guard into `lib/search/vector-index-mutations.ts` before `UPDATE memory_index`
- [x] Add inline guard in `lib/storage/post-insert-metadata.ts`
- [x] Re-assert index-scope and tier invariants inside the barrier-held restore transaction in `lib/storage/checkpoints.ts`
- [x] Emit durable `governance_audit` rows with `action='tier_downgrade_non_constitutional_path'` on downgrade attempts without failing the write

### Phase 5: Wave-2 Hardening
- [x] Close cleanup-script audit gap: retain historical `governance_audit` rows for deleted memories; emit cleanup-specific action `tier_downgrade_non_constitutional_path_cleanup`
- [x] Collapse spec-doc exclusion drift: `spec-doc-paths.ts` and `memory-index-discovery.ts` call `shouldIndexForMemory()` as SSOT; additive overlays only
- [x] Add realpath canonicalization: `lib/utils/canonical-path.ts` with `fs.realpathSync` + fail-open fallback; wire into save-time + code-graph `specificFiles`
- [x] Move cleanup apply planning inside the transaction snapshot to close the TOCTOU window
- [x] Add walker DoS caps: `.gitignore` ≤ 1MB, depth ≤ 20, ≤ 50,000 nodes with warnings
- [x] Centralize governance-audit action strings in `GOVERNANCE_AUDIT_ACTIONS`; route every emitter through `recordTierDowngradeAudit()`; extend update-path `constitutional → critical` auditing

### Phase 6: Verification and Cleanup
- [x] Add focused Vitest coverage for each invariant (9 new/modified test files)
- [x] Run packet strict validation (`validate.sh --strict --no-recursive`)
- [x] Run `npm run typecheck`, `npm run build` for `mcp_server` and `scripts`
- [x] Run focused Vitest commands (Wave-2 passed with 20 tests across 8 files; README regressions passed with 218 tests across 4 files)
- [x] Run `npm run test:core` and record carryover failures (`copilot-hook-wiring.vitest.ts`, `stage3-rerank-regression.vitest.ts`)
- [x] Run cleanup dry-run / apply / verify against the live Voyage-4 DB; capture before/after counts
- [x] Update operator README with invariants + helper location + audit action strings
- [x] Merge phase tracks into root docs
- [ ] Track A live MCP rescan on `026/009-hook-parity` — requires user restart + embedding-capable runtime
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Layer | Test File | Asserts |
|-------|-----------|---------|
| Unit | `tests/index-scope.vitest.ts` | `shouldIndexForMemory` and `shouldIndexForCodeGraph` reject the correct segments |
| Unit | `tests/memory-governance.vitest.ts` | `GOVERNANCE_AUDIT_ACTIONS` enum + `recordTierDowngradeAudit()` emit stable payloads |
| Integration | `tests/pe-orchestration.vitest.ts` | Sibling `checklist.md` candidate cannot drive `UPDATE` or `REINFORCE` for `tasks.md` |
| Integration | `tests/handler-memory-index.vitest.ts` | Scan-originated saves pass `fromScan: true` and bypass the transactional recheck; non-scan saves keep the normal path |
| Integration | `tests/memory-save-index-scope.vitest.ts` | Save-time scope guard rejects excluded paths; valid `/constitutional/` saves preserve tier; non-constitutional saves downgrade to `important` |
| Integration | `tests/memory-crud-update-constitutional-guard.vitest.ts` | SQL-layer `UPDATE memory_index` downgrades invalid constitutional writes |
| Integration | `tests/checkpoint-restore-invariant-enforcement.vitest.ts` | Restore inside the barrier-held transaction rejects any invariant-violating row atomically |
| Integration | `tests/cleanup-script-audit-emission.vitest.ts` | Cleanup preserves historical `governance_audit` rows and emits the cleanup-specific action per downgraded row |
| Integration | `tests/exclusion-ssot-unification.vitest.ts` | Spec-doc classification and discovery inherit `EXCLUDED_FOR_MEMORY` through helper calls, not duplicated arrays |
| Integration | `tests/symlink-realpath-hardening.vitest.ts` | `fs.realpathSync` routes save-time + `specificFiles` checks to the real path |
| Integration | `tests/walker-dos-caps.vitest.ts` | `.gitignore` > 1MB truncates with warning; depth > 20 stops; > 50,000 nodes aborts with warning |
| Regression | `tests/handler-memory-index`, `tests/memory-parser-extended`, `tests/full-spec-doc-indexing`, `tests/gate-d-regression-constitutional-memory` | Constitutional README stays excluded; gate-D indexing gates still work |
| Build | `npm run typecheck`, `npm run build` | mcp_server and scripts both exit `0` |
| Suite | `npm run test:core` | Outcome recorded with explicit carryover failure isolation |
| Packet | `validate.sh --strict --no-recursive` | Exits `0` |
| Manual | `scripts/dist/memory/cleanup-index-scope-violations.js` dry-run / apply / verify | Live Voyage-4 before/after counts |
| Live Acceptance (pending) | `memory_index_scan` on `026/009-hook-parity` | Zero `E_LINEAGE`, zero `candidate_changed` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `better-sqlite3` + `sqlite-vec` runtime load | Internal | Green | Cleanup CLI cannot inspect or mutate the Voyage-4 DB |
| `mcp_server` typecheck + build | Internal | Green | Dist outputs would not ship guards, helpers, or cleanup script |
| `scripts` typecheck + build | Internal | Green | Cleanup CLI would not ship |
| Focused Vitest harnesses | Internal | Green | Regression proof would be weak |
| `npm run test:core` baseline | Internal | Yellow | Carryover failures (`copilot-hook-wiring`, `stage3-rerank-regression`) recorded separately |
| External embedding access for Track A live packet acceptance | External | Yellow | Track A packet acceptance remains at `code-complete-pending-track-a-live-rescan` until the user restarts MCP in an embedding-capable runtime |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Typecheck or build regressions, invariant helper false positives, cleanup verification mismatch, or unacceptable perf impact on PE decisions.
- **Procedure**:
  1. Revert the helper wiring (`lib/utils/index-scope.ts` imports in discovery/save/code-graph/checkpoint), the `canonical-path` wrapper, and the governance-audit centralization.
  2. Revert the Track A PE canonical-path guard and restore prior `SimilarMemory` shape.
  3. Revert the `fromScan` flag on `memory_index_scan` and reinstate the transactional complement recheck unconditionally.
  4. If cleanup `--apply` already ran, restore the DB from the pre-apply checkpoint or backup.
  5. Rerun focused Vitest and `--verify` to confirm the rollback landed cleanly.
- **Scope**: The patch is localized to `mcp_server/`, `scripts/`, and this packet; rollback does not require spec-folder migration or schema changes.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────────────┐
│ Investigation & Baseline │
│  - codex-lineage report  │
│  - Live DB inspection    │
└──────────┬───────────────┘
           ▼
┌──────────────────────────────────────────────┐
│ Shared Infrastructure                        │
│  - index-scope.ts (SSOT)                     │
│  - canonical-path.ts (realpath)              │
│  - scope-governance.ts (audit actions)       │
└────────┬────────────────────────┬────────────┘
         ▼                        ▼
┌───────────────────┐    ┌──────────────────────┐
│ Track A Runtime   │    │ Track B Runtime      │
│  - PE guard (A2)  │    │  - Memory discovery  │
│  - fromScan (B2)  │    │  - Spec-doc paths    │
│                   │    │  - Parser            │
│                   │    │  - Save guard        │
│                   │    │  - SQL-layer guard   │
│                   │    │  - Post-insert guard │
│                   │    │  - Restore guard     │
│                   │    │  - Code-graph scope  │
└────────┬──────────┘    └──────────┬───────────┘
         ▼                          ▼
┌───────────────────────────────────────────────┐
│ Verification Stack                            │
│  - 9+ Vitest files (Track A + Track B)        │
│  - Walker DoS caps + realpath tests           │
│  - Cleanup CLI dry-run / apply / verify       │
│  - Strict validate.sh                         │
└───────────────────────────────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Investigation & baseline | `/tmp/codex-lineage-investigation-output.txt`, live DB inspection | Documented root causes + pollution counts | Shared-helper design |
| Shared infrastructure | Investigation evidence | `index-scope.ts`, `canonical-path.ts`, `scope-governance.ts` | Track A + Track B runtime wiring |
| Track A runtime | Shared infrastructure | PE guard + `fromScan` propagation | Track A regressions + live rescan |
| Track B runtime | Shared infrastructure | SSOT wiring + defense-in-depth | Track B regressions + cleanup CLI |
| Cleanup CLI | Track B runtime + schema inspection | Transactional pollution removal + verify mode | Live verification |
| Verification | All runtime + CLI | Exit codes + before/after counts + strict validate | Packet readiness |
<!-- /ANCHOR:dependency-graph -->
