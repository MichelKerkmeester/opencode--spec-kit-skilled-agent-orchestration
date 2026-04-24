---
title: "Decision Record: Memory Indexer Invariants [system-spec-kit/026-graph-and-context-optimization/010-memory-indexer-invariants/decision-record]"
description: "Unified ADRs for both invariant tracks: Track A lineage and concurrency fix choices (A2, B2); Track B shared SSOT, delete-not-downgrade, important downgrade, constitutional README exclusion, Wave-1 SQL-layer remediation, and Wave-2 hardening decisions."
trigger_phrases:
  - "026/010 decisions"
  - "memory indexer invariants adr"
  - "fromscan adr"
  - "pe a2 adr"
  - "index scope adr"
  - "constitutional tier adr"
importance_tier: "important"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/010-memory-indexer-invariants"
    last_updated_at: "2026-04-24T19:25:00+02:00"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Merged Track A + Track B ADRs into root decision record"
    next_safe_action: "Close Track A live MCP rescan"
    blockers: []
    completion_pct: 100
    status: "complete"
    open_questions: []
    answered_questions: []
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->"
---
# Decision Record: Memory Indexer Invariants

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Track A Fix A — A2 (Post-Filter at PE Decision Time)

### Metadata
| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-23 |
| **Deciders** | Codex + user request |

### Context

Live scans on `026/009` surfaced `E_LINEAGE=68` errors caused by the prediction-error gate selecting a sibling spec doc (e.g. `checklist.md`) as the best `UPDATE` or `REINFORCE` candidate for `tasks.md`, then attempting to append the new row onto the sibling's lineage chain.

### Constraints
- The fix must not change vector-search filtering semantics for other consumers.
- The guard must be explicit at the exact point where a lineage-bearing decision would otherwise be applied.

### Decision
**We chose**: A2 — post-filter at decision time inside `handlers/save/pe-orchestration.ts`. Extend `SimilarMemory` to carry `canonical_file_path`, preserve it in `findSimilarMemories()`, and compare the chosen candidate's canonical path to the save target inside the PE orchestration step. If the paths differ, rewrite the decision to `CREATE`.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **A2 — Post-filter at decision time** | Preserves candidate-search surface; rule lives at the exact decision point | Touches PE orchestration + `SimilarMemory` shape | 9/10 |
| A1 — Filter candidates at vector search | Single chokepoint | Changes search behavior for all consumers; opaque rule | 5/10 |

### Consequences
- **Improves**: Lineage safety rule is explicit and testable at the decision site.
- **Costs**: Slight `SimilarMemory` shape change; localized regressions required.

### Five Checks
1. Necessary? PASS — `E_LINEAGE=68` confirms the bug. 2. Beyond local maxima? PASS — compared A1 vs A2 explicitly. 3. Sufficient? PASS — downgrade prevents the lineage-chain corruption. 4. Fits goal? PASS — matches the invariant. 5. Open horizons? PASS — the guard is easy to extend.
<!-- /ANCHOR:adr-001 -->

---

## ADR-002: Track A Fix B — B2 (`fromScan` Flag Bypasses Transactional Recheck)

### Metadata
| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-23 |
| **Deciders** | Codex + user request |

### Context

After A2 landed, live acceptance on `026/009` showed `E_LINEAGE` → `0` but `candidate_changed` went from `58` → `159`. B1 (forcing `scanBatchSize=1` to serialize batches) was the wrong layer — the save-time transactional reconsolidation recheck was the real source, not outer batch overlap. `withSpecFolderLock` already serializes writes per spec folder; the remaining race was inside the save transaction comparing planner-time vs commit-time candidates.

### Constraints
- Do not change normal (non-scan) `memory_save` behavior.
- Keep the packet scope tight — no refactoring reconsolidation semantics.

### Decision
**We chose**: B2 — mark scan-originated saves with `fromScan: true` and skip the transactional complement recheck only for those saves. Thread the flag from `handlers/memory-index.ts → indexMemoryFile()` into `handlers/memory-save.ts`; restore default `BATCH_SIZE`.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **B2 — Scan-only `fromScan` flag** | Narrow; preserves normal save semantics | Adds a scan-only flag path | 9/10 |
| B1 — `scanBatchSize=1` | Conceptually cheaper | Proven insufficient in live acceptance (`candidate_changed 58→159`) | 3/10 |

### Consequences
- **Improves**: Scan-originated saves no longer false-positive on `candidate_changed`.
- **Costs**: One scan-only branch inside `memory_save`; non-scan regression required to prove the guarded path still fires.

### Five Checks
1. Necessary? PASS — live evidence proved B1 wrong. 2. Beyond local maxima? PASS — tried B1 first, rolled back with evidence. 3. Sufficient? PASS — removes the scan-only false positive without changing normal saves. 4. Fits goal? PASS — closes the concurrency regression surface-for-surface. 5. Open horizons? PASS — the flag is easy to grep and reason about.

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Shared Index-Scope Helper and Save-Time Guard (Track B SSOT)

### Metadata
| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-24 |
| **Deciders** | Codex + user request |

### Context

Memory discovery, spec-doc classification, `isMemoryFile()`, direct saves, and code-graph scans each had their own exclusion logic. Drift caused `z_archive` to be excluded in some places, `z_future` in some but not all, and `/external/` never enforced across both scanning systems.

### Constraints
- Preserve existing exclusions (`node_modules`, `.git`, `dist`, `vendor`, `mcp-coco-index/mcp_server`).
- Do not change unrelated save semantics or refactor Track A work.

### Decision
**We chose**: one shared path-scope module in `mcp_server/lib/utils/index-scope.ts`, plus a save-time guard as defense in depth. Walkers, spec-doc classification, and code-graph file collection call the shared helper before indexing. Direct and scan-originated saves also pass through a save-time guard so excluded paths are rejected even when a caller bypasses discovery.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Shared helper + save-time guard** | One policy source, low drift risk, easy to test | Touches several files | 9/10 |
| Scatter local checks in each walker | Small local diffs | High drift risk, harder to audit | 5/10 |
| Save-time guard only | Strong last-line defense | Walkers still waste work, policy stays implicit | 6/10 |

### Consequences
- **Improves**: Path exclusions become consistent across memory discovery, save, and code-graph scan paths; future invariant additions have one place to land.
- **Costs**: More integration points require focused regression tests.

### Five Checks
1. Necessary? PASS — multiple runtime surfaces already drifted. 2. Beyond local maxima? PASS. 3. Sufficient? PASS — helper + save guard covers discovery + bypass paths. 4. Fits goal? PASS. 5. Open horizons? PASS.
<!-- /ANCHOR:adr-003 -->

---

## ADR-004: Delete `z_future` Pollution Instead of Downgrading

### Metadata
| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-24 |
| **Deciders** | Codex + user request |

### Context

Live DB inspection showed thousands of indexed rows under `z_future`, including the vast majority of constitutional-tier pollution. The invariant is not "z_future may be lower priority"; it is "z_future must never be indexed."

### Constraints
- Cleanup must be transactional and idempotent.
- Preserve the legitimate constitutional files under `/constitutional/`.

### Decision
**We chose**: delete all `z_future` rows, regardless of tier, rather than downgrading their tier. The cleanup CLI targets rows whose `file_path` contains `/z_future/` or whose `spec_folder` contains `z_future`, removes the memory row plus associated references, and verifies the invariant afterwards.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Delete all `z_future` rows** | Matches the invariant exactly, removes polluted search data | Requires broader cleanup work | 10/10 |
| Downgrade to `important` or `normal` | Smaller mutation | Leaves forbidden rows indexed and searchable | 2/10 |

### Consequences
- **Improves**: Forbidden future-state material leaves the active index completely; constitutional auto-surface stops being dominated by `z_future` research chunks.
- **Costs**: Cleanup must inspect ancillary tables and reference rewrites — mitigated by single transaction + `--verify`.

### Five Checks
5/5 PASS.

---

## ADR-005: Downgrade Invalid Constitutional Saves to `important`

### Metadata
| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-24 |
| **Deciders** | Codex + user request |

### Context

The parser accepts `importanceTier: constitutional` from frontmatter anywhere, and the save pipeline would write that value through to `memory_index.importance_tier`. Failing hard on invalid saves would be noisy for specs that accidentally copy template metadata.

### Decision
**We chose**: downgrade invalid constitutional saves to `important` and emit a `governance_audit` row. After normal tier extraction, the save pipeline checks the canonical file path. If the path does not contain `/constitutional/`, the tier is rewritten to `important` before any DB write and a durable audit row is written.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Downgrade to `important`** | Safe, durable, keeps accidental saves working | Slightly more implicit than hard failure | 9/10 |
| Reject the save entirely | Loud and unambiguous | Breaks valid spec-doc saves over metadata drift | 6/10 |
| Downgrade to `normal` | Stronger correction | Over-corrects genuinely high-signal docs | 7/10 |

### Consequences
- **Improves**: Constitutional-tier pollution cannot be reintroduced by frontmatter drift; direct and scan-originated saves share one normalization point.
- **Costs**: System becomes quietly corrective rather than loudly rejecting — mitigated by the governance audit row.

### Five Checks
5/5 PASS.

---

## ADR-006: Keep Constitutional README Out of the Memory Index

### Metadata
| Field | Value |
|-------|-------|
| **Status** | Accepted (supersedes an earlier decision to index it) |
| **Date** | 2026-04-24 |
| **Deciders** | Codex + user request |

### Context

The first implementation pass backfilled `.opencode/skill/system-spec-kit/constitutional/README.md` into the live DB and adjusted runtime discovery/parser behavior to admit it. The user clarified that this README is a human-facing overview, not a constitutional rule surface, so it must stay out of the memory index even though other rule files in `/constitutional/` remain indexable.

### Constraints
- Do not widen scanner logic or change the shared index-scope helper.
- Keep the canonical constitutional rule files indexed.

### Decision
**We chose**: keep the constitutional README overview file out of the memory index and remove the row that was backfilled. Constitutional discovery and parser admissibility both reject `README.md` under `/constitutional/`; the live DB cleanup removes the existing README row and leaves FTS cleanup to the `memory_index` trigger chain.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Keep README excluded** | Matches the user-directed invariant; preserves rule-only constitutional surfaces | Removes one searchable overview doc | 10/10 |
| Keep README indexed | No reversal work | Violates the corrected invariant and pollutes constitutional counts | 1/10 |
| Index README but downgrade tier | Keeps the overview searchable | Still violates "must not be indexed" | 2/10 |

### Consequences
- **Improves**: `constitutional_total` returns to the intended value of `2`; constitutional retrieval stays anchored to actual rule files.
- **Costs**: Overview README no longer searchable through memory indexing — available as normal repo documentation.

### Five Checks
5/5 PASS.

---

## ADR-007: Wave-1 Uses SQL-Layer Tier Guards and Atomic Restore Validation

### Metadata
| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-24 |
| **Deciders** | Codex + user request |

### Context

The deep-review pass-1 found two release-blocking bypasses after the original save-path invariant work shipped. `memory_update` could still promote arbitrary rows to `importance_tier='constitutional'`, and `checkpoint_restore` could replay snapshot rows with raw `(file_path, importance_tier)` pairs that never re-entered the save pipeline. The earlier save-time downgrade path wrote only a console warning, leaving no durable audit row.

### Constraints
- The constitutional-path invariant must hold for every mutation surface, not only the `memory_save` insert path.
- `checkpoint_restore` must remain atomic: one invalid row aborts the restore instead of silently skipping part of the snapshot.
- Governance-audit writes must not block the correctness fix when audit persistence itself fails.

### Decision
**We chose**: enforce the constitutional-tier guard at the SQL write layer, validate restore rows inside the barrier-held restore transaction, and standardize downgrade auditing around a stable `governance_audit.action`.

- `vector-index-mutations.ts` downgrades `importance_tier='constitutional'` to `important` before `UPDATE memory_index ...` runs when the stored path is outside `/constitutional/`.
- `post-insert-metadata.ts` applies the same inline guard so post-insert metadata writes cannot bypass the invariant.
- `checkpoints.ts` validates each replay row inside the restore transaction, rejects walker-excluded paths, downgrades invalid constitutional tiers in place, and aborts the restore on the first rejected row.
- Audit contract uses `action='tier_downgrade_non_constitutional_path'` with `decision='conflict'`, `reason='non_constitutional_path'`, and metadata capturing source + before/after tier context.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **SQL-layer guard + atomic restore validation** | Covers every caller, removes handler-only blind spots, keeps restore semantics explicit | Touches storage-layer code and tests | 10/10 |
| Handler-only `memory_update` check | Smaller patch | Leaves future internal callers and restore paths exposed | 3/10 |
| Restore-time silent reject of bad rows | Keeps the rest of the snapshot | Hides corruption; can leave operators with partially replayed state | 2/10 |

### Consequences
- **Improves**: `memory_update`, checkpoint replay, and post-insert tier writes all inherit the same constitutional-path rule. Restore rejection is all-or-nothing. Operators get a durable governance-audit trail.
- **Costs**: Storage layer owns a small amount of policy logic — mitigated by keeping the action string and metadata shape explicit in ADR-009 and focused tests.

### Five Checks
5/5 PASS.

---

## ADR-008: Cleanup Audits Are Durable Historical Evidence

### Metadata
| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-24 |
| **Deciders** | Codex + user request |

### Context

Deep-review pass-2 found that the cleanup CLI bulk-downgraded invalid constitutional rows without writing any `governance_audit` rows, and it also deleted historical `governance_audit` rows for memory IDs that the cleanup removed. That made the cleanup path invisible to later forensic review.

### Decision
**We chose**: keep historical `governance_audit` rows even when the referenced `memory_index` row is deleted, and emit a cleanup-specific audit action for every cleanup downgrade. `cleanup-index-scope-violations.ts` preserves existing audit rows, writes `action='tier_downgrade_non_constitutional_path_cleanup'`, and stamps the reason as `cleanup-script bulk normalization`.

### Consequences
- Cleanup remains repair-oriented but becomes auditable after the fact.
- Operators can distinguish runtime guard downgrades from maintenance-time normalization.

---

## ADR-009: Spec-Doc Exclusions Stay Additive Around `index-scope.ts`

### Metadata
| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-24 |
| **Deciders** | Codex + user request |

### Context

Packet already established `index-scope.ts` as the canonical memory/code-graph invariant source, but `spec-doc-paths.ts` and `memory-index-discovery.ts` still carried overlapping exclusion arrays. That duplication meant `z_archive` and future invariant changes could drift again.

### Decision
**We chose**: keep `shouldIndexForMemory()` as the single source of truth for invariant exclusions and limit spec-doc-specific filters to additive overlays only. The spec-doc helpers call `shouldIndexForMemory()` first, while directory-specific exclusions (`scratch/`, `memory/`, `iterations/`) remain separate additive overlays.

### Consequences
- Changing `EXCLUDED_FOR_MEMORY` automatically changes spec-doc classification and discovery.
- Packet-specific walker exclusions still exist, but only for behavior intentionally outside the core invariant set.

---

## ADR-010: Realpath Hardening Wins Over String-Normalized Paths

### Metadata
| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-24 |
| **Deciders** | Codex + user request |

### Context

Pass-1 flagged that `memory-save.ts` and `structural-indexer.ts` used `path.resolve()` only, which normalizes strings but does not follow symlinks. A safe-looking path could therefore point into `z_future/` or another excluded subtree.

### Decision
**We chose**: add one shared `resolveCanonicalPath()` helper that prefers `fs.realpathSync()` and falls back to the caller-supplied absolute path when the target is missing or broken. Save-time exclusion checks and code-graph `specificFiles` checks evaluate the realpath, not just the apparent path string.

### Consequences
- Symlinked files no longer bypass invariant enforcement on the save path or specific-file code-graph refreshes.
- The helper stays fail-open for missing paths so atomic save flows still work for not-yet-created files.

---

## ADR-011: Cleanup Apply Builds Its Plan on the Transaction Snapshot

### Metadata
| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-24 |
| **Deciders** | Codex + user request |

### Context

`cleanup-index-scope-violations.ts` originally built its apply plan before opening the SQLite transaction. A concurrent write between plan generation and apply could leave a violating row behind.

### Decision
**We chose**: rebuild the cleanup plan inside the apply transaction instead of trusting a pre-transaction snapshot. The CLI still prints a dry-run plan for operators, but the mutating `--apply` path computes its own fresh plan inside `database.transaction(...)` before any deletes or downgrades run.

### Consequences
- Cleanup-apply decisions match the same transactional snapshot as the writes they perform.
- Dry-run output remains informative, but the authoritative plan for mutation lives inside the transaction.

---

## ADR-012: Governance-Audit Actions and Tier-Downgrade Emission Are Shared Helpers

### Metadata
| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-24 |
| **Deciders** | Codex + user request |

### Context

Pass-2 found the same audit payload shape duplicated across save, update, checkpoint, post-insert, and cleanup code. Bare action-string literals were also spread across runtime code and tests.

### Decision
**We chose**: centralize the stable action strings in `GOVERNANCE_AUDIT_ACTIONS` and route downgrade writes through one `recordTierDowngradeAudit()` helper plus `buildGovernanceLogicalKey()`. All invariant-related downgrade emitters share the same action enum, decision, logical-key format, and metadata scaffolding.

### Consequences
- Audit payload drift is reduced across runtime and maintenance surfaces.
- Operators and tests can filter on a stable action-string set documented in the README.
