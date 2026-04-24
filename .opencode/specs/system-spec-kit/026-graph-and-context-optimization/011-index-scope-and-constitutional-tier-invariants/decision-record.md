---
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->"
title: "Decision Record: Index Scope and Constitutional Tier Invariants"
description: "Records the invariant enforcement point, delete-vs-downgrade cleanup strategy, constitutional save-time gate behavior, and the README exclusion correction."
trigger_phrases:
  - "026/011 decisions"
  - "index scope adr"
  - "constitutional tier adr"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-index-scope-and-constitutional-tier-invariants"
    last_updated_at: "2026-04-24T09:31:49Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Wave-1 remediation landed; P0-001 and P0-002 patched at SQL layer, audit-trail gap closed"
    next_safe_action: "Run 7-iteration deep review pass 2 to confirm P0s resolved"
    status: "wave1-remediation-complete"
    blockers: []
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Decision Record: Index Scope and Constitutional Tier Invariants

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Shared Index-Scope Helper and Save-Time Guard

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-24 |
| **Deciders** | Codex + user request |

---

<!-- ANCHOR:adr-001-context -->
### Context

Memory discovery, spec-doc classification, `isMemoryFile()`, direct saves, and code-graph scans each have their own exclusion logic today. That split caused drift: `z_archive` is excluded in some places, `z_future` is excluded in some but not all, and `/external/` is not enforced across both scanning systems.

### Constraints

- The fix must preserve existing exclusions such as `node_modules`, `.git`, `dist`, `vendor`, and `mcp-coco-index/mcp_server`.
- The packet must not change unrelated save semantics or refactor the `fromScan` work from packet 010.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: one shared path policy module in `mcp_server/lib/utils/index-scope.ts`, plus a save-time guard as defense in depth.

**How it works**: Walkers, spec-doc classification, and code-graph file collection call the shared helper before indexing. Direct and scan-originated saves also pass through a save-time guard so excluded paths are rejected even if a caller bypasses discovery.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Shared helper + save-time guard** | One policy source, low drift risk, easy to test | Touches several files | 9/10 |
| Scatter local checks in each walker | Small local diffs | High drift risk, harder to audit | 5/10 |
| Save-time guard only | Strong last-line defense | Walkers still waste work and policy stays implicit | 6/10 |

**Why this one**: The issue is policy drift, not one missing `if` statement. A shared helper fixes the drift, and the save-time guard keeps the system safe if a direct caller bypasses discovery.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Path exclusions become consistent across memory discovery, save, and code-graph scan paths.
- Future invariant additions have one place to land instead of multiple ad hoc lists.

**What it costs**:
- More integration points need focused regression tests. Mitigation: add targeted Vitest coverage around the helper and each wired surface.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Helper false positive excludes valid files | M | Keep exclusions segment-based and preserve existing behavior through tests |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Multiple runtime surfaces already drifted |
| 2 | **Beyond Local Maxima?** | PASS | Compared helper-based policy with local checks |
| 3 | **Sufficient?** | PASS | Helper plus save guard covers discovery and bypass paths |
| 4 | **Fits Goal?** | PASS | Directly enforces the three requested invariants |
| 5 | **Open Horizons?** | PASS | Future exclusions can reuse the same module |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Create `index-scope.ts` and import it into memory discovery, spec-doc classification, memory save, and code graph scanning.
- Add tests for both helper functions and their wired callers.

**How to roll back**: Revert the helper imports and restore the prior local exclusion logic, then rerun focused discovery/save tests.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

### ADR-002: Delete `z_future` Pollution Instead of Downgrading It

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-24 |
| **Deciders** | Codex + user request |

### Context

Live DB inspection shows thousands of indexed rows under `z_future`, including the vast majority of constitutional-tier pollution. The invariant is not "z_future may be lower priority"; it is "z_future must never be indexed."

### Constraints

- Cleanup must be transactional and idempotent.
- The operation must preserve the legitimate constitutional files under `/constitutional/`.

### Decision

**We chose**: delete all `z_future` rows, regardless of tier, rather than downgrading their tier.

**How it works**: The cleanup CLI targets rows whose `file_path` contains `/z_future/` or whose `spec_folder` contains `z_future`, removes the memory row and associated references, and verifies the invariant afterwards.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Delete all `z_future` rows** | Matches the invariant exactly, removes polluted search data | Requires broader cleanup work | 10/10 |
| Downgrade `z_future` rows to `important` or `normal` | Smaller mutation | Leaves forbidden rows indexed and searchable | 2/10 |

**Why this one**: The invariant is absolute. Downgrading would keep forbidden data in the index and would not solve the search pollution problem.

### Consequences

**What improves**:
- Forbidden future-state material leaves the active index completely.
- Constitutional auto-surface stops being dominated by `z_future` research chunks.

**What it costs**:
- Cleanup needs to inspect ancillary tables and reference rewrites. Mitigation: one transaction plus a verify mode.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Hidden references to deleted memory IDs remain | H | Rewrite known references and verify zero violations after apply |

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The invariant says these rows must not exist |
| 2 | **Beyond Local Maxima?** | PASS | Compared delete vs downgrade explicitly |
| 3 | **Sufficient?** | PASS | Full deletion removes the pollution root cause |
| 4 | **Fits Goal?** | PASS | Restores index-scope integrity |
| 5 | **Open Horizons?** | PASS | Verify mode keeps the invariant enforceable later |

**Checks Summary**: 5/5 PASS

### Implementation

**What changes**:
- Cleanup CLI deletes `z_future` and `external` rows in one transaction.
- Verification logic reports remaining violations for CI or maintenance use.

**How to roll back**: Restore the DB from checkpoint or backup captured before running `--apply`.
---

### ADR-003: Downgrade Invalid Constitutional Saves to `important`

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-24 |
| **Deciders** | Codex + user request |

### Context

The parser accepts `importanceTier: constitutional` from frontmatter anywhere, and the save pipeline writes that value through to `memory_index.importance_tier`. Failing hard on invalid saves would be noisy for specs that accidentally copy template metadata.

### Constraints

- The gate must hit both direct saves and scan-originated saves.
- The save should remain durable for non-constitutional docs instead of failing the entire operation.

### Decision

**We chose**: downgrade invalid constitutional saves to `important` and log a warning.

**How it works**: After normal tier extraction, the save pipeline checks the canonical file path. If the path does not contain `/constitutional/`, the tier is rewritten to `important` before any DB write happens.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Downgrade to `important`** | Safe, durable, keeps accidental saves working | Slightly more implicit than a hard failure | 9/10 |
| Reject the save entirely | Loud and unambiguous | Breaks otherwise valid spec-doc saves over metadata drift | 6/10 |
| Downgrade to `normal` | Stronger correction | Over-corrects genuinely high-signal docs | 7/10 |

**Why this one**: `important` preserves the signal that the doc mattered, without allowing it to outrank true constitutional rule files.

### Consequences

**What improves**:
- Constitutional tier pollution cannot be reintroduced by frontmatter drift.
- Direct and scan-originated saves share one normalization point.

**What it costs**:
- The system becomes quietly corrective rather than loudly rejecting. Mitigation: log a clear warning with the file path and reason.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Warning goes unnoticed during scripted runs | M | Add focused test coverage and document the behavior in README |

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Current parser/save path accepts invalid constitutional tiers |
| 2 | **Beyond Local Maxima?** | PASS | Compared reject vs downgrade vs lower-tier downgrade |
| 3 | **Sufficient?** | PASS | Prevents polluted constitutional rows without blocking saves |
| 4 | **Fits Goal?** | PASS | Matches the invariant while preserving user flow |
| 5 | **Open Horizons?** | PASS | The warning keeps accidental misuse visible |

**Checks Summary**: 5/5 PASS

### Implementation

**What changes**:
- Save pipeline normalizes the parsed tier after existing extraction.
- Focused tests assert both the downgrade and the valid `/constitutional/` preserve case.

**How to roll back**: Remove the downgrade branch and restore prior pass-through behavior, then rerun the save tests.
---

### ADR-004: Index `.opencode/skill/system-spec-kit/constitutional/README.md`

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Superseded |
| **Date** | 2026-04-24 |
| **Deciders** | Codex + user request |

**Superseded note**: Reversed later the same day by ADR-005 after the user clarified that the README inside the `constitutional/` folder is a human-oriented overview document and must not be indexed.

### Context

`findConstitutionalFiles()` and `isMemoryFile()` currently skip constitutional README files even though the constitutional folder README describes the rule set itself. Live DB inspection confirms `.opencode/skill/system-spec-kit/constitutional/README.md` is not indexed.

### Constraints

- The change must not start indexing README files across the repo.
- Only constitutional markdown files should be affected.

### Decision

**We chose**: allow `.opencode/skill/system-spec-kit/constitutional/README.md` to be indexed and keep generic README handling unchanged elsewhere.

**How it works**: Constitutional discovery stops excluding `README.md`, and constitutional path acceptance continues to require both `/constitutional/` and a markdown extension.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Index constitutional README only** | Captures canonical overview doc without broadening scope | Slightly changes prior expectations in tests | 9/10 |
| Keep skipping README | No behavior change | Leaves real constitutional guidance invisible | 4/10 |
| Index all README files | Broad discovery | Massive scope creep and noise | 1/10 |

**Why this one**: It solves the specific visibility gap without widening the scanner beyond the constitutional set.

### Consequences

**What improves**:
- Constitutional folder overview guidance becomes searchable and injectable.
- The constitutional set is internally consistent.

**What it costs**:
- Existing README-skip tests need to be updated. Mitigation: narrow the new assertions to constitutional paths only.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Future readers assume all READMEs are now indexed | L | Document the scoped rule in README and tests |

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The constitutional overview doc is currently invisible |
| 2 | **Beyond Local Maxima?** | PASS | Compared scoped inclusion with broader README rules |
| 3 | **Sufficient?** | PASS | Constitutional path gating keeps the scope tight |
| 4 | **Fits Goal?** | PASS | Restores missing constitutional guidance without extra noise |
| 5 | **Open Horizons?** | PASS | The rule remains explicit and easy to test |

**Checks Summary**: 5/5 PASS

### Implementation

**What changes**:
- Remove the constitutional README skip in discovery and parser admissibility.
- Update tests to assert scoped inclusion for constitutional README files only.

**How to roll back**: Reintroduce the README exclusion in the constitutional discovery and parser checks, then rerun the constitutional discovery tests.
---

### ADR-005: Do Not Index `.opencode/skill/system-spec-kit/constitutional/README.md`

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-24 |
| **Deciders** | Codex + user request |

### Context

The first implementation pass for packet 011 backfilled `.opencode/skill/system-spec-kit/constitutional/README.md` into the live DB and adjusted runtime discovery/parser behavior to admit it. The user clarified that this README is a human-facing overview, not a constitutional rule surface, so it must stay out of the memory index even though other rule files in `/constitutional/` remain indexable.

### Constraints

- The correction must not widen scanner logic or change the shared index-scope helper.
- The canonical constitutional rule files must remain indexed.

### Decision

**We chose**: keep the constitutional README overview file out of the memory index and remove the row that was backfilled into the live DB.

**How it works**: Constitutional discovery and parser admissibility both restore the README exclusion, while the live DB cleanup removes the existing README row and leaves FTS cleanup to the `memory_index` trigger chain.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Keep README excluded** | Matches the user-directed invariant and preserves rule-only constitutional surfaces | Removes one searchable overview doc | 10/10 |
| Keep the README indexed | No reversal work | Violates the corrected invariant and pollutes constitutional counts | 1/10 |
| Index README but downgrade its tier | Keeps the overview searchable | Still violates the "must not be indexed" rule | 2/10 |

**Why this one**: The rule is about index membership, not ranking. The README is documentation for humans, not a runtime constitutional rule surface.

### Consequences

**What improves**:
- `constitutional_total` returns to the intended value of `2`.
- Constitutional retrieval stays anchored to actual rule files rather than overview prose.

**What it costs**:
- The overview README is no longer searchable through memory indexing. Mitigation: keep it available as normal repository documentation.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Future work accidentally reintroduces README indexing | M | Keep discovery/parser tests explicit about rejecting `README.md` under `/constitutional/` |

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The user explicitly corrected the invariant to exclude the README |
| 2 | **Beyond Local Maxima?** | PASS | Compared exclusion with both indexing and downgrade variants |
| 3 | **Sufficient?** | PASS | Runtime exclusion plus DB row deletion restores the final invariant |
| 4 | **Fits Goal?** | PASS | Keeps constitutional rows limited to actual rule files |
| 5 | **Open Horizons?** | PASS | Tests and verify counts make regressions obvious |

**Checks Summary**: 5/5 PASS

### Implementation

**What changes**:
- Restore the README exclusion in constitutional discovery and parser admissibility.
- Delete live README rows from `memory_index` and companion tables without touching `memory_fts` directly.

**How to roll back**: Re-allow constitutional README discovery/parser admission and re-index the README intentionally.

---

### ADR-006: Wave-1 Remediation Uses SQL-Layer Tier Guards and Atomic Restore Validation

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-24 |
| **Deciders** | Codex + user request |

### Context

The deep-review packet for 011 found two release-blocking bypasses after the original save-path invariant work shipped. `memory_update` could still promote arbitrary rows to `importance_tier='constitutional'`, and `checkpoint_restore` could replay snapshot rows with raw `(file_path, importance_tier)` pairs that never re-entered the save pipeline. The earlier save-time downgrade path also wrote only a console warning, leaving no durable audit row for attempted smuggling.

### Constraints

- The constitutional-path invariant must hold for every mutation surface, not only the `memory_save` insert path.
- `checkpoint_restore` must remain atomic: one invalid row aborts the restore instead of silently skipping part of the snapshot.
- Governance audit writes must not block the correctness fix when audit persistence itself fails.

### Decision

**We chose**: enforce the constitutional-tier guard at the SQL write layer, validate restore rows inside the barrier-held restore transaction, and standardize downgrade auditing around a stable `governance_audit.action`.

**How it works**:
- `vector-index-mutations.ts` now downgrades `importance_tier='constitutional'` to `important` before `UPDATE memory_index ...` runs when the stored path is outside `/constitutional/`.
- `post-insert-metadata.ts` applies the same inline guard so post-insert metadata writes cannot bypass the invariant.
- `checkpoints.ts` validates each replay row inside the restore transaction, rejects walker-excluded paths, downgrades invalid constitutional tiers in place, and aborts the restore on the first rejected row.
- The downgrade audit contract uses `action='tier_downgrade_non_constitutional_path'` with `decision='conflict'`, `reason='non_constitutional_path'`, and metadata that captures the source plus before/after tier context.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **SQL-layer guard + atomic restore validation** | Covers every caller, removes handler-only blind spots, keeps restore semantics explicit | Touches storage-layer code and tests | 10/10 |
| Handler-only `memory_update` check | Smaller patch | Leaves future internal callers and restore paths exposed | 3/10 |
| Restore-time silent reject of bad rows | Keeps the rest of the snapshot | Hides corruption and can leave operators with a partially replayed state | 2/10 |

**Why this one**: the bypasses existed because the invariant lived too high in the stack. The storage layer is the only place shared by both user-facing and internal mutation paths.

### Consequences

**What improves**:
- `memory_update`, checkpoint replay, and post-insert tier writes now inherit the same constitutional-path rule.
- Restore-time rejection is all-or-nothing for memory rows, which is safer than a partial replay during incident recovery.
- Operators get a durable `governance_audit` trail for attempted non-constitutional constitutional-tier writes.

**What it costs**:
- The storage layer now owns a small amount of policy logic. Mitigation: keep the action string and metadata shape explicit in this ADR and in the focused tests.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Future callers bypass the downgrade audit helper shape | M | Keep the action string stable and cover all current write surfaces with focused tests |
| Restore-time audit persistence fails after a rejected replay | L | Catch audit insertion errors, warn, and preserve the invariant/rollback outcome |

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Two public write paths bypassed the save-time invariant |
| 2 | **Beyond Local Maxima?** | PASS | Compared handler-only, SQL-layer, and partial-restore alternatives explicitly |
| 3 | **Sufficient?** | PASS | SQL-layer downgrades plus restore validation cover the release-blocking paths |
| 4 | **Fits Goal?** | PASS | Restores the constitutional-tier invariant without widening Wave-1 scope |
| 5 | **Open Horizons?** | PASS | The audit contract is stable and machine-greppable for re-review and ops follow-up |

**Checks Summary**: 5/5 PASS

### Implementation

**What changes**:
- Patch `vector-index-mutations.ts`, `post-insert-metadata.ts`, `memory-save.ts`, and `checkpoints.ts`.
- Add focused Vitest coverage for `memory_update`, `checkpoint_restore`, and save-path downgrade auditing.

**How to roll back**: revert the Wave-1 remediation patch set, rebuild `mcp_server`, and rerun the focused Vitest and cleanup `--verify` commands before restoring broader use.
