# Iteration 032 — Correctness: Spec Artifacts + P0 Fixes

**Dimension:** Correctness — Spec artifact internal consistency + P0 fix implementation verification
**Focus:** Cross-document count/ID/phase consistency; code-level verification of all 5 P0 fixes
**Status:** complete
**Reviewer note:** This is iteration 2 of a fresh independent review pass. The file previously existed; this replaces it with a more detailed structural analysis.

---

## Findings

### SEV-001

**Severity:** P1
**Title:** spec.md success criteria and scope still describe a 20-iteration, read-only audit after the project expanded to 30 iterations and full fix execution
**File:Line:** `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/026-memory-database-refinement/spec.md:79,126,133`
**Evidence:**
- Line 79: `"- Implementing fixes (findings only; fixes go to follow-up specs)"`
- Line 126: `"SC-001: 20 review iterations complete with convergence or max-iterations reached."`
- Line 133: `"when all 20 iterations complete, then a review/review-report.md exists"`
**Impact:** The spec still declares itself a read-only, 20-iteration audit. In practice the packet records 30 review iterations plus 10 fix sprints (P0/P1/P2 + deferred-P2 + integration reconciliation). Any downstream reader, compliance check, or review gate that validates work against spec.md acceptance criteria will conclude the project is over-scope and the fix work was unauthorized. The scope freeze in CLAUDE.md §1 treats spec.md scope as FROZEN, so this divergence is a correctness defect, not a cosmetic one.
**Fix Recommendation:** Update spec.md §3 Out-of-Scope, §4 Requirements table (REQ-001/002/003), and §5 Success Criteria to reflect the approved 30-iteration review and fix-phase scope that was actually executed and recorded in tasks.md/checklist.md.

---

### SEV-002

**Severity:** P1
**Title:** plan.md iteration-to-dimension mapping is frozen at 20 iterations but the project executed 30
**File:Line:** `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/026-memory-database-refinement/plan.md:68,97`
**Evidence:**
- Line 68: `"Iterations: 20"`
- Line 97: final row is `| 020 | Cross-cutting: concurrency and state | ...`
- plan.md §4 phases list checkboxes for "Run /spec_kit:deep-research:review:auto with 20 iterations"
**Impact:** plan.md is the authoritative technical context for the review loop. With iterations 021–030 executed (deep-dive passes, documented in tasks.md T003) but absent from the mapping, the plan is factually incomplete. Any agent resuming from plan.md will attempt a 20-iteration run and consider convergence reached before the deep-dive dimensions are covered.
**Fix Recommendation:** Extend the iteration-to-dimension mapping table in plan.md §3 to include iterations 021–030, update the Deep-Research Review Configuration parameter from 20 to 30, and check the Phase 2 checkbox text accordingly.

---

### SEV-003

**Severity:** P1
**Title:** tasks.md Phase 10 checklist items are all unchecked despite T130–T144 being marked complete
**File:Line:** `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/026-memory-database-refinement/tasks.md:241-244`
**Evidence:**
```
- [ ] CHK-070 [P0] All 15 deferred P2 findings fixed with passing tests
- [ ] CHK-071 [P0] Build and typecheck clean after all fixes
- [ ] CHK-072 [P1] No regressions in existing tests
```
Tasks T130–T144 are all marked `[x]` with explicit evidence strings. The Phase 10 completion criteria at the bottom of the same file (`tasks.md:267`) also remains unchecked: `"- [ ] All 15 deferred P2 findings fixed (Phase 10)"`.
**Impact:** CHK-070 and CHK-071 are P0 checklist items. Leaving them unchecked while the underlying tasks are complete creates contradictory completion signals. Automated validate.sh and any completion gate that reads checklist state will report the packet as incomplete.
**Fix Recommendation:** Mark CHK-070, CHK-071, CHK-072 as `[x]` with evidence matching the T130–T144 task completion strings, and mark the Phase 10 completion criterion in the Completion Criteria section as `[x]`.

---

### SEV-004

**Severity:** P1
**Title:** tasks.md Phase 11 documentation alignment tasks are all unchecked — open work not reflected in spec.md or checklist.md status fields
**File:Line:** `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/026-memory-database-refinement/tasks.md:223-233`
**Evidence:**
```
- [ ] T150 [P] Audit and update all mcp_server/ code READMEs
- [ ] T151 [P] Audit and update mcp_server/README.md
...
- [ ] T158 Run full test suite + typecheck after all updates
- [ ] T159 Save final context to memory
```
spec.md §1 metadata status field reads: `"Complete — All 121 findings triaged: 5 P0 + 75 P1 + 22 P2 fixed, 16 P2 deferred, 3 P2 rejected; 8771 tests pass"`. checklist.md §Verification Summary is completely filled with verified counts.
**Impact:** The packet declares itself complete in two places while containing 10 open P1 tasks (T150–T159). Any integration consumer that reads spec.md status will incorrectly assume documentation alignment is finished.
**Fix Recommendation:** Either complete Phase 11 tasks before marking status as "Complete", or update spec.md metadata status to explicitly note "Phase 11 (documentation alignment) pending" and add a corresponding unchecked P1 item to checklist.md.

---

### SEV-005

**Severity:** P1
**Title:** checklist.md Verification Summary table counts are inconsistent with the actual checklist item counts
**File:Line:** `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/026-memory-database-refinement/checklist.md:86-93`
**Evidence:**
```
| P0 Items (review)      | 5 | 5/5 |
| P1 Items (review)      | 6 | 6/6 |
| P0 Items (fix)         | 2 | 2/2 |
| P1 Items (fix — sprints) | 4 | 4/4 |
| P1 Items (fix — integration) | 2 | 2/2 |
| P2 Items (fix)         | 1 | 1/1 |
```
The summary lists 2 P0 fix items (CHK-060 and CHK-061). However, tasks.md Phase 10 adds CHK-070 and CHK-071 as two additional P0 items (`[P0]` tag visible at tasks.md:241-242). These are absent from the summary table, making the P0 fix count understated by 2.
**Impact:** The summary is the first thing a release reviewer reads. An understated P0 count (2 listed vs 4 actual) creates a false picture of P0 completion coverage.
**Fix Recommendation:** Add rows for Phase 10 P0 items (CHK-070, CHK-071) to the Verification Summary table once they are checked, and audit the summary for any other Phase 10/11 items that should appear.

---

### SEV-006

**Severity:** P2
**Title:** checklist.md CHK-068 claims "full green" but acknowledges a known failing test file
**File:Line:** `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/026-memory-database-refinement/checklist.md:68`
**Evidence:** `"CHK-068 [P1] Full test suite green [Evidence: 8771 passed, 327/328 files pass, tsc clean; sole failure is pre-existing eval_run_ablation 30s timeout]"`
**Impact:** The item label says "full green" but the evidence says one file still fails. A completion reviewer reading only the label will conclude zero failures. This is a wording accuracy issue, not a blocking defect (the failure is pre-existing), but it degrades the packet's credibility.
**Fix Recommendation:** Rephrase the checklist item label to "All test files pass except pre-existing eval_run_ablation timeout (327/328 pass)" and keep the existing evidence string.

---

## P0 Fix Verification Results

### T010 — buildScopePrefix() with SHA-256 hash (lineage-state.ts)

**Status: VERIFIED**

`buildScopePrefix()` is present at `lib/storage/lineage-state.ts:201-219`. It:
1. Assembles a scope tuple from `tenant_id`, `user_id`, `agent_id`, `session_id`, `shared_space_id`, filtering null/empty values.
2. Hashes the JSON-serialized tuple using `createHash('sha256')` (imported from `node:crypto` at line 6), taking the first 24 hex characters.
3. Returns `scope-sha256:<24-char-digest>` or `null` for global (un-scoped) rows.
4. `buildLogicalKey()` at line 245 incorporates the prefix into the full key, preventing cross-scope collisions.

No defects observed. Fix is correctly implemented.

---

### T011 — getStartupEmbeddingDimension() fail-fast (vector-index-store.ts)

**Status: VERIFIED WITH MINOR CONCERN (P2)**

`getStartupEmbeddingDimension` is imported at line 23 and used in `get_embedding_dim()` at lines 90-94. The pre-bootstrap dimension validation at lines 758-765 calls `validate_embedding_dimension_for_connection()`, and on mismatch throws `VectorIndexError` with `INTEGRITY_ERROR` code — correctly blocking DB bootstrap.

**Minor concern:** `get_embedding_dim()` lines 90-95 contain a subtle logic inversion:
```typescript
const startup_dim = getStartupEmbeddingDimension();
if (process.env.EMBEDDING_DIM) {
  return startup_dim;   // returns startup_dim regardless of EMBEDDING_DIM value
}
```
When `EMBEDDING_DIM` is set, the function returns `startup_dim` (from `getStartupEmbeddingDimension`) instead of the env-var value. This bypasses the profile check entirely but does not use the env-var directly. The intent appears to be "if the env-var is set, use the startup resolver" — which is logical since `getStartupEmbeddingDimension` should honor `EMBEDDING_DIM` internally. This should be confirmed against the shared factory implementation; if `getStartupEmbeddingDimension` does NOT read `EMBEDDING_DIM`, this is a P1 bug. Flagged as P2 pending that verification.

---

### T012 — Savepoint-per-table atomicity in checkpoint merge (checkpoints.ts)

**Status: VERIFIED**

The helper function at `lib/storage/checkpoints.ts:1005-1040` implements the pattern:
1. Names the savepoint `checkpoint_merge_<sanitized-table-name>`.
2. Issues `SAVEPOINT <name>` before attempting the pre-clear + restore.
3. On success: `RELEASE SAVEPOINT`.
4. On failure: `ROLLBACK TO SAVEPOINT` then `RELEASE SAVEPOINT` in a `finally` block.

`result.partialFailure` and `result.rolledBackTables` are populated at lines 1540-1541 (initialized) and 1827-1828 (populated on failure). The handler (`handlers/checkpoints.ts:435-457`) surfaces `rolledBackTables` in the `CHECKPOINT_RESTORE_PARTIAL_FAILURE` error response.

Fix is correctly implemented and the partial-failure metadata is correctly threaded to the MCP response.

---

### T013 — validateCallerAuth() on admin mutations (shared-memory.ts)

**Status: VERIFIED**

`validateCallerAuth()` is defined at `handlers/shared-memory.ts:182-213`. It:
1. Requires non-empty `tenantId` for all tools except `shared_memory_enable` (line 188).
2. Calls `resolveAdminActor()` to retrieve the server-configured admin identity from env-vars (lines 89-141).
3. Returns `{ actor, isAdmin }` where `isAdmin` is true only when the caller matches the configured admin identity (lines 210-212).

All three admin mutation handlers call `validateCallerAuth()`:
- `handleSharedSpaceUpsert` — line 400
- `handleSharedSpaceMembershipSet` — line 587
- `handleSharedMemoryEnable` — line 738

`handleSharedMemoryEnable` additionally enforces `!isAdmin` guard at line 743. The `SharedMemoryAuthError` exception class and `throwSharedMemoryAuthError` ensure auth failures exit via a structured MCP error response, not an unhandled exception.

Fix is correctly implemented.

---

### T014 — executeMerge() upserts projection/lineage/BM25 (reconsolidation.ts)

**Status: VERIFIED**

Inside the transaction block at `lib/storage/reconsolidation.ts:265-362`, `executeMerge()`:

1. **Lineage**: calls `recordLineageTransition(db, newId, { actor: 'mcp:reconsolidation', predecessorMemoryId: existingMemory.id, transitionEvent: 'SUPERSEDE' })` at lines 329-333. `recordLineageTransition` (in `lineage-state.ts:623+`) calls `upsertActiveProjection()` at line 732, which performs the `active_memory_projection` upsert with `ON CONFLICT(logical_key) DO UPDATE`. Projection coverage is therefore indirect but complete.

2. **BM25**: calls `bm25.removeDocument(String(existingMemory.id))` and `bm25.addDocument(String(newId), mergedBm25DocumentText)` at lines 338-339. A `repairBm25Document` fallback handles failure outside the transaction boundary at lines 364-374.

3. **Return value**: the function returns `MergeResult` with `newMemoryId: newId` at line 379. The `newId` value is populated from `insertResult.lastInsertRowid` at line 302 and is the surviving memory's ID.

The tasks.md evidence claim "bridge returns newMemoryId" refers to the orchestrator (`reconsolidate()`) returning the result from `executeMerge()`, which carries `newMemoryId`. This is confirmed at line 616: `return executeMerge(topMatch, newMemory, db, generateEmbedding)`.

Fix is correctly implemented. The projection upsert is indirect (via `recordLineageTransition`) rather than a direct `INSERT` in `reconsolidation.ts`, which is architecturally correct.

---

## Summary

| Metric | Value |
|--------|-------|
| Spec artifacts reviewed | spec.md, plan.md, checklist.md, tasks.md |
| P0 fixes verified | 5/5 |
| Findings total | 6 |
| P0 findings | 0 |
| P1 findings | 4 (SEV-001 through SEV-004) |
| P2 findings | 2 (SEV-005, SEV-006) |

**Key observations:**

1. All 5 P0 code fixes are correctly implemented and match the task evidence descriptions. No regressions are introduced by any of the 5 fixes at the code level.

2. A minor logic concern in `get_embedding_dim()` (lines 90-95) is flagged as P2 pending verification that `getStartupEmbeddingDimension()` itself reads `process.env.EMBEDDING_DIM`. If it does not, this becomes a P1 silent no-op for the env-var override path.

3. The spec packet has a persistent internal consistency gap: spec.md/plan.md describe a 20-iteration read-only audit, while tasks.md/checklist.md record 30 iterations and 10 fix sprints. The status field in spec.md declares "Complete" while Phase 11 (documentation alignment, T150–T159) remains fully unchecked. These P1 findings do not block runtime correctness but do degrade the packet's usefulness as an authoritative project record.
