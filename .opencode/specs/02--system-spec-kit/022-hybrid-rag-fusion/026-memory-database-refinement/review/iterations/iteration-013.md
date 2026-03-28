# Iteration 013: Session learning (FSRS)

## Findings

### [P1] `task_postflight` can overwrite another session's baseline while keeping the old `session_id`
**File**: `.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts`

**Issue**: Preflight stores `session_id`, and learning-history queries can filter on it, but postflight does not accept a `sessionId` and does not verify session ownership before updating the row. Any caller that knows the same `specFolder` and `taskId` can complete the record, overwrite the deltas/learning index, and leave the original `session_id` attached. That corrupts session-scoped history because the completed record now contains one session's identity and another session's outcomes.

**Evidence**:
- Preflight accepts and persists `sessionId` in `session-learning.ts:225-226`, `session-learning.ts:266-280`, and `session-learning.ts:312-329`.
- `task_postflight` has no `sessionId` field in the public contract at `tool-schemas.ts:470-473`.
- Postflight looks up and updates the record using only `spec_folder` and `task_id` at `session-learning.ts:405-410` and `session-learning.ts:444-471`.
- Learning-history filtering assumes `session_id` is trustworthy at `session-learning.ts:568-575` and returns it to callers at `session-learning.ts:591-595`.

**Fix**: Add `sessionId` to `task_postflight` and enforce a match against the stored `session_id` whenever the baseline was session-scoped. If cross-session completion is intentionally allowed, update the stored session attribution explicitly instead of silently preserving the old value.

### [P1] Completed rows are write-once per `spec_folder/task_id`, so later learning cycles are rejected and lost
**File**: `.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts`

**Issue**: The schema enforces `UNIQUE(spec_folder, task_id)`, and preflight hard-rejects any existing `complete` row for that pair. In practice this means a common task identifier such as `implementation` can only ever be recorded once per spec folder. Any later session that wants to measure the same task again is blocked, so recurring work collapses into a single cycle and the later learning history is never stored.

**Evidence**:
- The schema makes `spec_folder + task_id` globally unique at `session-learning.ts:126-155`.
- Re-preflight on a completed record is rejected at `session-learning.ts:257-263`.
- The public tool contract explicitly encourages generic task IDs like `"T1"`, `"T2"`, and `"implementation"` at `tool-schemas.ts:467`.
- The history endpoint is framed as session-level learning history, but the storage model cannot represent multiple completed cycles for the same task key.

**Fix**: Store immutable learning cycles keyed by a run identifier, or extend uniqueness to include `session_id` so repeated sessions can record separate baselines and completions for the same logical task.

### [P2] The file scoped as "Session learning (FSRS)" does not implement any FSRS state or scheduling
**File**: `.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts`

**Issue**: The review packet scopes iteration 013 as "Session learning (FSRS)" and explicitly points at this handler plus stability/difficulty columns, but this module only tracks epistemic score snapshots and a weighted learning index. There is no stability/difficulty state, no review count, no interval calculation, and no next-review scheduling. That leaves the advertised FSRS dimension effectively unimplemented here, including the first-review and interval-computation cases this audit was supposed to examine.

**Evidence**:
- The packet scope calls out `handlers/session-learning.ts` and "stability/difficulty columns" at `spec.md:69` and `plan.md:91`.
- The local `session_learning` schema contains only pre/post scores, deltas, and gap fields at `session-learning.ts:126-155`.
- Postflight computes only `deltaKnowledge`, `deltaUncertainty`, `deltaContext`, and `learningIndex` at `session-learning.ts:420-425`.
- Returned history rows likewise expose score snapshots and deltas only at `session-learning.ts:606-624` and summary aggregates at `session-learning.ts:637-646`.
- A text search over this handler finds no `stability`, `difficulty`, `fsrs`, `interval`, or `next review` logic.

**Fix**: Either narrow the contract and review dimension to "epistemic score tracking" so expectations match reality, or add explicit FSRS parameters and scheduling outputs here with tests for first-review behavior and interval updates.

## Summary
P1: 2, P2: 1.

The highest-risk issues in this slice are state-integrity problems around session attribution and repeated learning cycles. I did not find any actual FSRS parameter or interval math in this handler to audit; the more fundamental problem is that the file currently stores score deltas only, so the packet's FSRS responsibility is not implemented here.
