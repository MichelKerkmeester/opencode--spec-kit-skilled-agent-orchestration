---
title: "Gate B — Foundation"
feature: phase-018-gate-b-foundation
level: 3
status: planned
parent: 018-canonical-continuity-refactor
gate: B
description: "Execution plan for the two-week Gate B foundation lane: prove the migration on a copy, execute the approved schema and archive changes in production, then validate ranking and archived-hit observability before Gate C starts."
trigger_phrases:
  - "gate b plan"
  - "foundation plan"
  - "archive flip"
  - "causal edges migration"
  - "phase 018"
importance_tier: "important"
contextType: "planning"
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Gate B — Foundation

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript runtime and storage helpers, shell migration wrapper, SQLite rehearsal and production operations, markdown packet docs |
| **Framework** | `system-spec-kit` MCP server, inline schema bootstrap in `vector-index-schema.ts`, stage-2 fusion ranking, stats/dashboard telemetry |
| **Storage** | SQLite `memory_index` and `causal_edges`, plus copy-based rehearsal forks from the production snapshot |
| **Testing** | Copy-first migration rehearsal, hard rollback drill, SQL validation queries, fixed-query replay, staging ranking proof, stats/dashboard smoke verification |

### Overview
Gate B follows the pacing locked in `../implementation-design.md`, `../resource-map.md` Section 4, iteration 028, and iteration 037: migration plan, migrate on copy, hard rollback on copy, production schema change, archive flip, ranking validation, metric visibility, and then gate close. The main technical correction is that `memory_index.is_archived` is already in the live schema, so the real Gate B schema work is the approved `causal_edges` anchor extension and the code paths that must preserve those fields.

The delivery strategy is evidence-first. Tests get the exact DDL, row-count expectations, and replay rules before the rehearsal starts; lead uses the rehearsal output to size the maintenance window; production only runs after copy migration, rerun, and hard rollback all pass; and the gate closes only once ranking and `archived_hit_rate` are observable at runtime.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Gate A is closed and the backup, restore, and rollback discipline is already proven on copies.
- [ ] `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` all reflect the corrected scope: reuse `is_archived`, add the approved `causal_edges` anchor fields, then archive flip and ranking/metric work.
- [ ] Tests have the exact rehearsal assertions, row counts, and sign-off contract from iteration 037 and iteration 028.
- [ ] ADR-001 records where the canonical migration logic will live before implementation work starts.

### Definition of Done
- [ ] Copy-first rehearsal passes, rerun is a no-op, and hard rollback returns the candidate copy to logical baseline equivalence.
- [ ] Production schema and storage-helper changes are live, the archive flip reaches exactly 155 rows, and row counts are preserved otherwise.
- [ ] Archived weighting and fallback behavior are validated on sample searches.
- [ ] `archived_hit_rate` is visible in the intended stats or dashboard surface.
- [ ] Gate B research tracks are converged enough to hand off cleanly into Gate C.
<!-- /ANCHOR:quality-gates -->

---

**AI Execution Protocol**

### Pre-Task Checklist
- [ ] Gate A is closed and the maintenance window is still valid for Gate B.
- [ ] The approved DDL, row-count targets, and archive-flip scope are frozen from `../resource-map.md` and `../scratch/resource-map/01-schema.md`.
- [ ] Tests have the rehearsal assertions and replay fixture before the first migration run starts.
- [ ] ADR-001 is accepted so migration ownership is not ambiguous during execution.

### Execution Rules

| Rule | Expectation |
|------|-------------|
| TASK-SEQ | Always run copy rehearsal, rerun, and hard rollback before the production schema change. |
| TASK-SCOPE | Stay inside rehearsal, schema/storage, archive flip, ranking, and metric surfaces only. |
| TASK-EVIDENCE | Capture JSON evidence, SQL validations, and search-order proof before marking any task complete. |
| TASK-STOP | If archive count, rollback equivalence, or ranking proof fails, stop the gate and preserve evidence. |

### Status Reporting Format

Use `STATUS | owner | surface | state | evidence or next step`.

### Blocked Task Protocol

If rehearsal, rerun, rollback, archive count, ranking validation, or metric visibility fails, mark the task `[B]`, preserve the failing copy or logs, stop any production expansion, and route the blocker to lead/tests with the exact failing evidence attached.

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Copy-first additive migration with hard rollback certification, followed by bounded production cutover and retrieval-observability proof.

### Key Components
- **Rehearsal wrapper**: the iteration 037 dual-fork flow (`S0`, `fork-A-pre`, `fork-B-post`) plus JSON evidence packaging.
- **Schema owner**: `mcp_server/lib/search/vector-index-schema.ts`, which remains the canonical bootstrap and migration source of truth.
- **Storage-threading lane**: `causal-edges.ts`, `checkpoints.ts`, and `reconsolidation.ts`, which must preserve the new anchor fields end-to-end.
- **Archive and ranking lane**: the bounded `archive-flip-018.sh` script plus the `mcp_server/lib/search/pipeline/stage2-fusion.ts` weighting update.
- **Observability lane**: the `memory_stats` or dashboard surface that reports `archived_hit_rate` using the presented-slot share definition.

### Data Flow
The gate starts from an immutable production snapshot. That snapshot forks into a baseline copy and a candidate copy so schema, row counts, samples, replay results, and rollback behavior can be compared directly. Once the rehearsal and rerun pass, the same approved migration logic executes in production, the archive flip marks the 155 legacy memory rows, stage-2 fusion starts demoting archived rows, and the stats surface begins recording how much of the user-visible result set still comes from archive.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Rehearsal and sign-off prep
- [ ] Freeze the Gate B DDL and expected row counts from `../resource-map.md` F-1/F-2, `../scratch/resource-map/01-schema.md`, and the narrowed critical-file list.
- [ ] Capture the immutable snapshot and create `fork-A-pre` and `fork-B-post`.
- [ ] Run the migration on `fork-B-post`, capture Q1-Q10 style evidence adapted to the corrected Gate B scope, rerun for idempotence, and record the JSON report.
- [ ] Run the hard rollback drill on `fork-B-post` and compare logical baseline equivalence against `fork-A-pre`.
- [ ] Hand the evidence package to tests and lead before the production window is approved.

### Phase 2: Production schema and storage cutover
- [ ] Apply the approved `causal_edges` anchor-column migration in `vector-index-schema.ts`.
- [ ] Update `causal-edges.ts`, `checkpoints.ts`, and `reconsolidation.ts` so the new fields round-trip at runtime.
- [ ] Resolve `schema-downgrade.ts` by code change or explicit exclusion note.
- [ ] Execute the production archive flip so legacy memory-file rows become `is_archived=1`.

### Phase 3: Retrieval validation and gate close
- [ ] Update the archived-row multiplier in `mcp_server/lib/search/pipeline/stage2-fusion.ts` or the equivalent fusion surface.
- [ ] Validate sample searches so fresh spec-doc results outrank archived peers when relevance is similar.
- [ ] Expose `archived_hit_rate` in the stats/dashboard surface and confirm the metric definition matches iterations 027 and 036.
- [ ] Reconcile the packet docs, checklist, and implementation-summary placeholder so Gate B is ready to hand off into Gate C.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Migration rehearsal | Schema, row-count, sample-row, rerun, and rollback proof on a DB copy | `sqlite3`, iteration 037 JSON evidence format, copy-fork diff checks |
| SQL validation | `memory_index` counts, archive counts, `causal_edges` columns/indexes, mixed-edge integrity | rehearsal SQL queries and post-production spot checks |
| Query replay | Fixed query set for search equivalence and latency bounds | iteration 037 replay fixture and query-class thresholds |
| Ranking proof | Fresh spec-doc versus archived ordering after the `x0.3` change | targeted sample searches in staging or maintenance validation |
| Runtime smoke check | `archived_hit_rate` visibility and metric shape | `memory_stats` or dashboard inspection after deployment |

The test mix is intentionally aligned to iteration 037's promotion rules and iteration 028's lead/tests handoff. Gate B closes on evidence quality, not on code edit count.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Gate A close | Internal | Green | Gate B cannot open safely without prior backup and rollback discipline. |
| `../resource-map.md` F-1/F-2 and `../scratch/resource-map/01-schema.md` | Internal | Green | They define the corrected schema scope and prevent duplicate `is_archived` work. |
| Iteration 028 | Internal | Green | Supplies the gate sequencing, handoffs, and "cannot slip" list for Gate B. |
| Iteration 037 | Internal | Green | Supplies the dual-fork rehearsal model, JSON evidence contract, and hard rollback requirement. |
| Iteration 027 and iteration 036 | Internal | Green | Supply the latency and metric framing for `archived_hit_rate` visibility. |
| Production maintenance window | Operational | Yellow | Exact duration is not fixed in grounding and must be derived from rehearsal timing plus rollback headroom. |
| `schema-downgrade.ts` resolution | Internal | Yellow | The downgrade path is the one remaining schema-surface uncertainty in the Gate B scope. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Rehearsal fails, rerun mutates the candidate copy, production schema validation fails, archive flip does not land on 155 rows, ranking proof fails, or the stats surface cannot report `archived_hit_rate`.
- **Procedure**: Use the hard rollback path proven during rehearsal, restore logical baseline equivalence from the pre-migration snapshot, revert the archived-weighting change, and block Gate B closeout until the exact failing surface is understood.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Gate A close ──► Phase 1 (Rehearsal) ──► Phase 2 (Prod cutover) ──► Phase 3 (Ranking + metric proof)
                     │                         │
                     └──── tests/lead sign-off┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Rehearsal | Gate A close, frozen DDL, replay fixture | Production cutover, maintenance approval |
| Production cutover | Rehearsal pass + hard rollback pass | Archive flip, ranking validation, metric visibility |
| Ranking + metric proof | Production schema and archive flip complete | Gate B close, Gate C handoff |
| Gate B close | All above plus research convergence | Gate C start |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Rehearsal and evidence packaging | High | 3-4 days |
| Production schema/storage cutover | High | 2-3 days |
| Ranking and metric validation | Medium | 2-3 days |
| Buffer / investigation headroom | Medium | 1-2 days |
| **Total** | | **~2 weeks** |

This matches the Gate B envelope in `../implementation-design.md`, `../resource-map.md`, and iteration 028.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Rehearsal JSON report exists and shows pass/fail per validation query.
- [ ] Hard rollback has already restored the candidate copy to logical baseline equivalence.
- [ ] Snapshot naming is unambiguous enough to avoid restoring the wrong pre-migration state.
- [ ] The archived-weight ranking change can be reverted independently if schema stays healthy but ordering fails.

### Rollback Procedure
1. Stop Gate B closeout and record the failing validation surface in `tasks.md` and `checklist.md`.
2. Execute the hard rollback path validated during rehearsal.
3. Restore the pre-migration snapshot or logically equivalent rebuilt state.
4. Revert the archived-weighting change if the failure is in ranking rather than schema.
5. Re-run the row-count and sample-row validation set before resuming any work.

### Data Reversal
- **Has data migrations?** Yes. Gate B adds `causal_edges` anchor fields and flips archive state on legacy memory rows.
- **Reversal procedure**: Restore or rebuild to the baseline schema and row state using the hard rollback path, then revert the archived weighting so retrieval returns to pre-Gate-B behavior.
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
┌────────────────────┐
│ Rehearsal on copy  │
│ schema + replay    │
└─────────┬──────────┘
          ▼
┌────────────────────┐
│ Hard rollback pass │
│ and rerun no-op    │
└─────────┬──────────┘
          ▼
┌────────────────────┐
│ Prod schema update │
│ + storage threading│
└─────────┬──────────┘
          ▼
┌────────────────────┐
│ Archive flip 155   │
│ rows to archived   │
└─────────┬──────────┘
          ▼
┌────────────────────┐
│ Ranking proof +    │
│ archived_hit_rate  │
└────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Rehearsal package | Gate A close | JSON evidence, rerun proof, hard rollback result | Prod cutover |
| Schema/storage cutover | Rehearsal package | Live anchor fields, threaded storage helpers | Archive flip, ranking proof |
| Archive flip script | Live schema + approved window | 155 archived rows | Ranking proof, metric visibility |
| Ranking and stats proof | Live schema + archive state | Search-order evidence and `archived_hit_rate` visibility | Gate B close |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Rehearse on copy, rerun, and hard rollback** - 3-4 days - CRITICAL
2. **Apply production schema and thread storage helpers** - 2-3 days - CRITICAL
3. **Run archive flip and validate row counts** - 1 day - CRITICAL
4. **Validate ranking and expose archived metrics** - 2-3 days - CRITICAL

**Total Critical Path**: approximately 8-11 working days inside the published two-week Gate B envelope.

**Parallel Opportunities**:
- Research convergence and narrative cleanup can run beside the rehearsal and ranking lanes once the technical scope is frozen.
- Tests can prepare replay fixtures and validation scripts while lead finalizes the production cutover plan.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Rehearsal approved | JSON evidence, rerun no-op, hard rollback pass | Week 1 |
| M2 | Production foundation live | `causal_edges` anchor fields live and 155 rows archived | Week 2 |
| M3 | Gate B close ready | Ranking proof passes and `archived_hit_rate` is visible | End of Gate B |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Keep the canonical Gate B migration in `vector-index-schema.ts`

**Status**: Accepted

Gate B follows the existing schema ownership model documented in `../resource-map.md` and `../scratch/resource-map/01-schema.md`: the canonical bootstrap and inline migration chain live in `mcp_server/lib/search/vector-index-schema.ts`. A standalone `.sql` file is optional operator packaging, not the source of truth. This keeps fresh bootstrap behavior, inline migrations, and future schema review aligned in one place.
