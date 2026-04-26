# Adversarial test coverage — Phase 016 T-PRE-09

This directory holds adversarial regression tests that exercise the five
scenarios flagged by Phase 016 FINAL-synthesis-and-review.md §8.3
("Weaker findings that need verification before acting on them").

Each Phase 016 finding here either maps to an existing regression test
(that provides effective coverage) or receives a dedicated adversarial
regression in this folder.

## Coverage mapping

| Finding | Scenario | Coverage | Location |
| ------- | -------- | -------- | -------- |
| R33-001 | Compact-prime identity race — fresh payload erased by stale consumer clear | Dedicated (NEW) | `tests/adversarial/compact-prime-identity-race.vitest.ts` (this folder) |
| R40-001 | Cleanup TOCTOU — `cleanStaleStates` deletes fresh state between stat and unlink | Covered by existing regression | `tests/p0-d-toctou-cleanup-regression.vitest.ts` |
| R46-003 | Adversarial `lastJobId` — injection payload reaches `Function(...)` via substitution | Covered by existing regression | `scripts/tests/manual-playbook-runner.vitest.ts` (T-MPR-RUN-04) |
| R34-002 | Complement duplicate window — near-duplicate inserted between plan and commit | Covered by existing regression | `tests/p0-b-reconsolidation-composite.vitest.ts` |
| R35-001 | Conflict fork — two concurrent saves both supersede same predecessor | Covered by existing regression | `tests/p0-b-reconsolidation-composite.vitest.ts` |

## Why one new test and four mappings

The T-PRE-09 task specifies two acceptable outcomes per finding:

> either (a) confirm the existing regression test covers the adversarial case and document the mapping, OR (b) add a dedicated adversarial test if coverage is thin.

After auditing the P0-A / P0-B / P0-D / T-MPR-RUN-04 regression suites:

- **R40-001, R34-002, R35-001, R46-003** — thick coverage. The Phase 017
  P0 composite regressions directly reproduce the adversarial interleaves
  (TOCTOU cleanup between stat and unlink; duplicate complement insert
  between pre-transaction search and commit; two concurrent conflict
  writers; adversarial `lastJobId` payload). No additional test needed.
- **R33-001** — thin coverage. The `p0-a-cross-runtime-tempdir-poisoning`
  regression exercises full-payload corruption via an external poison
  file, but does NOT exercise the specific compact-prime identity race
  where two legitimate producers interleave. `hook-precompact.vitest.ts`
  and `edge-cases.vitest.ts` reference `pendingCompactPrime.cachedAt` but
  never exercise the identity-guard path in `clearCompactPrime()`. This
  folder's new `compact-prime-identity-race.vitest.ts` closes the gap.

## Per-finding coverage detail

### R33-001 — compact-prime identity race (NEW dedicated test)

**Scenario (FINAL §8.3):** "Construct a read/write/clear overlap on
`pendingCompactPrime` and verify the newer payload is erased" — reframed
as "verify the fix ensures the newer payload is NOT erased."

**Test approach:** The dedicated
`compact-prime-identity-race.vitest.ts` reproduces the exact timeline:

1. Consumer A reads the older `pendingCompactPrime` (captures
   `cachedAt` identity at T1).
2. Producer writes a fresher `pendingCompactPrime` (cachedAt T2 > T1)
   via `updateState()`.
3. Consumer A calls `clearCompactPrime()` with the T1-era identity.
4. Post-T-HST-07: clear is refused, fresh payload survives.

Also includes the positive-path test where matching identity permits
the clear, so the guard is not over-aggressive.

**Fix under verification:** T-HST-07 / R33-001 identity-based
`clearCompactPrime()` at `hook-state.ts:738-756`.

**Expected log evidence:** `"Skipped clearing compact payload for
session <sid> because the cached payload changed"` on the mismatching
clear.

### R40-001 — cleanup TOCTOU

**Coverage:** `tests/p0-d-toctou-cleanup-regression.vitest.ts` (126 LOC)

**Adversarial interleave exercised:** A stale state file is saved,
a stale mtime is forced via `utimesSync()`, and then
`fs.openSync` is spied so that when `cleanStaleStates()` attempts to
open the stale file it triggers a fresh `saveState()` call — simulating
a live writer replacing the stale file between the stat and the unlink.

**Post-fix behaviour verified:** `cleanup.removed === 0`, skipped === 1,
`errors[0].detail === 'identity_changed_before_cleanup'`, fresh state
survives on disk, and `loadMostRecentState()` recovers the fresh
generation.

**Fix under verification:** T-HST-05 identity check in
`cleanStaleStates()` before `unlinkSync()` at
`hook-state.ts:247-255`.

### R46-003 — adversarial `lastJobId` injection

**Coverage:** `scripts/tests/manual-playbook-runner.vitest.ts` T-MPR-RUN-04

**Adversarial payloads exercised:**

- `'job-42"});globalThis.__manualPlaybookInjected = true;//'` — the
  canonical injection payload from FINAL §8.3. Must throw on
  `parseObjectLiteralArgs` without setting `__manualPlaybookInjected`.
- `'"},{malicious:true}//'` — payload with quoted-out object break.
- Sanitizer-level payloads: `'abc def'` (whitespace),
  `'job\nwith\nnewlines'` (newlines), `''` (empty), and positive
  cases (`'job_abc123def456'`, `'JOB-123_XYZ'`).

**Defense chain under verification:**
`sanitizeJobIdForSubstitution()` (nanoid allowlist) +
`parseObjectLiteralArgs()` (strict object-literal parser) +
`validateToolArgsSchema()` (args schema validation). All three tested
separately plus end-to-end through `parseObjectLiteralArgs`.

**Post-fix behaviour verified:** Throw on each adversarial payload;
`Reflect.get(globalThis, '__manualPlaybookInjected')` remains
`undefined`; no `Function(...)` evaluation of attacker-controlled text.

### R34-002 — complement duplicate window

**Coverage:** `tests/p0-b-reconsolidation-composite.vitest.ts` test
"blocks duplicate complement inserts when a concurrent writer creates
a high-similarity candidate before commit" (lines 131-196)

**Adversarial interleave exercised:** Initial `findScopeFilteredCandidates`
returns an empty candidate set. BEFORE the transactional commit, a
near-duplicate row (id 91, similarity 99 to the incoming content) is
INSERTed. A `database.transaction()` callback then re-runs
`findScopeFilteredCandidates` and invokes `determineAction(similarity)`.

**Post-fix behaviour verified:** `determineAction(99)` returns
`'complement'` (or merge, not 'conflict'); the duplicate insert is
blocked before the new row (id 99) is written; post-transaction
count of id 99 in `memory_index` is 0.

**Fix under verification:** T-RCB `findScopeFilteredCandidates` re-run
inside writer transaction, with fallthrough to merge/conflict when a
near-duplicate appears between plan and commit.

### R35-001 — conflict fork (two-concurrent-conflict regression)

**Coverage:** `tests/p0-b-reconsolidation-composite.vitest.ts` test
"rejects the second conflict writer with conflict_stale_predecessor
instead of forking lineage" (lines 72-129)

**Adversarial interleave exercised:** Same `staleSnapshot`
(predecessor row id 1, content_hash 'hash-original') is handed to two
sequential `executeConflict()` calls — one with new spec-doc record id 2, one
with new spec-doc record id 3.

**Post-fix behaviour verified:**

- First `executeConflict` → action 'conflict', existingMemoryId 1,
  newMemoryId 2.
- Second `executeConflict` → action 'conflict', STATUS
  `'conflict_stale_predecessor'`, existingMemoryId 1, newMemoryId 3.
- `memory_index.importance_tier` for id 1 is `'deprecated'` (single
  successor).
- `causal_edges` count with relation `'supersedes'` is 1, NOT 2
  (single lineage, no fork).

**Fix under verification:** T-RCB predecessor `content_hash` +
`is_deprecated = FALSE` CAS guard in `executeConflict()` at
`reconsolidation.ts:522-537`.

## Relationship to Phase 017 tasks

All five §8.3 findings are remediated by Phase 017 landed work:

| Finding | Task | Status per tasks.md |
| ------- | ---- | -------------------- |
| R33-001 | T-HST-07 | `[x]` complete |
| R40-001 | T-HST-05 | `[x]` complete |
| R46-003 | T-MPR-RUN-04 | `[x]` complete |
| R34-002 | T-RCB-03 / T-RCB-04 (complement-inside-tx) | `[x]` complete |
| R35-001 | T-RCB-01 (conflict CAS) | `[x]` complete |

T-PRE-09's role is to verify the coverage. Four scenarios are verified by
mapping to existing tests; the fifth (R33-001) gets a dedicated
adversarial regression here to close the coverage gap noted in the
T-PRE-09 task description ("may be partially covered by P0-A regression
test").

## Layout

```
mcp_server/tests/adversarial/
├── README.md                                   # this file
└── compact-prime-identity-race.vitest.ts       # R33-001 (T-PRE-09, NEW)
```

New adversarial regressions for findings that surface in future phases
should be added here with the naming convention
`<finding-id>-<slug>.vitest.ts` and cross-referenced in this README.
