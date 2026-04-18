---
title: "Feature Specification: Phase 017 Wave B — Cluster Consumers"
description: "Wave B child of Phase 017. 9 tasks / 30h across 3 parallel lanes consuming Wave A primitives: Lane B1 Cluster B consumers (12h), Lane B2 Cluster D + Cluster E (16h), Lane B3 Cluster A + Cluster C + Standalone P1 (12h). Resolves FC-3/FC-4/FC-5/FC-6/FC-8."
trigger_phrases: ["017 wave b", "phase 017 wave b cluster consumers", "t-cns-02 research backfill", "t-w1-cgc-03 readiness propagation", "t-w1-hok-01 copilot compact-cache", "017 lane b1", "017 lane b2", "017 lane b3"]
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-foundational-runtime/003-cluster-consumers"
    last_updated_at: "2026-04-17T14:41:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "Child 002 Wave B spec scaffolded from parent plan.md §3"
    next_safe_action: "Begin Wave B after Wave A (child 001) merged"
    blockers: ["Wave A merge prerequisite"]
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Feature Specification: Phase 017 Wave B — Cluster Consumers

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Wave** | B (Cluster Consumers) |
| **Parent** | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-foundational-runtime/` |
| **Priority** | P1 (7 P1 tasks + 2 P2 supporting) |
| **Status** | Spec Ready, Blocked on Wave A Merge |
| **Created** | 2026-04-17 |
| **Updated** | 2026-04-17 |
| **Branch** | `main` |
| **Effort Estimate** | 30h total across 3 parallel lanes (~4 working days wall-clock if lanes run concurrent) |
| **Task Count** | 9 tasks (4 + 2 + 3 by lane) |
| **Upstream Dependency** | Child 001 (Wave A — Infrastructure Primitives) merged to `main` |
| **Downstream Dependents** | Child 003 (Wave C — Rollout + Sweeps), Child 004 (Wave D — P2 Maintainability) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Wave A lands the canonical-save metadata writer (`workflow.ts:1259, 1333`), the shared `readiness-contract.ts` module, the `hooks/shared-provenance.ts` module, and collapses 4 scope normalizers. Those are foundational primitives — on their own they fix H-56-1 at the writer level but do **not** propagate the readiness contract to the 6 code-graph sibling handlers, do **not** add the Copilot compact-cache consumer, do **not** backfill the research-iteration folders, and do **not** harden Gate 3 against unicode homoglyphs. Shipping only Wave A leaves:

1. **Cluster B holes** — R3-P1-002 (research iteration folders invisible to memory layer), R51-P1-003 (no freshness validator catches drift post-Wave-A), R6-P1-001 (context.ts silent catch masks readiness errors), R6-P2-001 (rollup sites lack design-intent comments).
2. **Cluster D asymmetry unchanged** — R52-P1-001: `scan.ts`, `status.ts`, `context.ts`, `ccc-status.ts`, `ccc-reindex.ts`, `ccc-feedback.ts` still emit ZERO `canonicalReadiness` / `trustState` / `lastPersistedAt` tokens. `status.ts` (IS canonical readiness probe) remains the highest-priority gap.
3. **Cluster E gap unchanged** — R52-P1-002 + R56-P1-NEW-002 (H-56-4): Copilot `hooks/copilot/compact-cache.ts` still absent. Copilot-driven sessions continue to lose trust provenance across compaction, which directly blocks the Phase 017 autonomous-execution plan that uses cli-copilot as 3-concurrent fallback.
4. **Cluster C hole** — R2-P1-002 (Gate 3 homoglyph bypass), R2-P2-001 (sanitizeRecoveredPayload NFKC gap), R3-P2-003 (Gate 3 test naming), R5-P2-001 (test drift).
5. **Cluster A prevention missing** — R4-P1-001 prevention: without a lint rule, future PRs will re-introduce in-module normalizers.
6. **Standalone P1 open** — R1-P1-002 `partial_causal_link_unresolved` retries still uncounted, no exhaustion signal.

Wave B closes all six gaps in parallel across 3 lanes.

### Purpose

Consume the Wave A primitives across the remaining 5 clusters + 1 standalone-P1 scope in parallel:

- **Lane B1 — Cluster B consumers (12h)**: Close R3-P1-002, R51-P1-003, partial R6-P1-001, R6-P2-001 via T-CNS-02, T-W1-CNS-05, T-CGC-02, T-RBD-03.
- **Lane B2 — Cluster D + Cluster E (16h)**: Close R52-P1-001 (Cluster D 5-sibling readiness propagation) + R52-P1-002 + R56-P1-NEW-002 (Cluster E Copilot compact-cache) via T-W1-CGC-03, T-W1-HOK-01.
- **Lane B3 — Cluster A + Cluster C + Standalone P1 (12h)**: Close R4-P1-001 prevention + R2-P1-002 + R2-P2-001 + R3-P2-003 + R5-P2-001 + R1-P1-002 via T-SCP-02, T-SAN-01+02+03, T-PIN-RET-01.

Shipping Wave B brings all 10 original P1s + 5 of 9 segment-2 P1s to RESOLVED and unblocks the Wave C rollout + sweeps.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### 3.1 In-Scope — 9 Tasks Across 3 Parallel Lanes

**Lane B1 — Cluster B consumers (4 tasks, 12h)**:

1. **T-CNS-02** — Research folder backfill (M, 4h) — Resolves R3-P1-002, R56-P1-NEW-003
2. **T-W1-CNS-05** — Continuity freshness validator (M, 4h) — Resolves R51-P1-003
3. **T-CGC-02** — `context.ts` explicit error branch (S, 2h) — Resolves partial R6-P1-001
4. **T-RBD-03** — Design-intent comments at rollup sites (S, 2h) — Resolves R6-P2-001

**Lane B2 — Cluster D + Cluster E (2 tasks, 16h)**:

5. **T-W1-CGC-03** — 5-sibling code-graph readiness propagation (L, 16h) — Resolves R52-P1-001 (Cluster D)
6. **T-W1-HOK-01** — Copilot compact-cache + session-prime (M, 6h) — Resolves R52-P1-002 (Cluster E), R56-P1-NEW-002 (H-56-4)

**Lane B3 — Cluster A + Cluster C + Standalone P1 (3 tasks, 12h)**:

7. **T-SCP-02** — Normalizer lint rule (S, 2h) — Resolves R4-P1-001 prevention
8. **T-SAN-01 + T-SAN-02 + T-SAN-03** — NFKC unicode normalization + tests (S+S+S, 6h) — Resolves R2-P1-002, R2-P2-001, R3-P2-003, R5-P2-001
9. **T-PIN-RET-01** — Retry-exhaustion counter (M, 4h) — Resolves R1-P1-002

### 3.2 Out-of-Scope (Deferred to Other Children)

- **Wave A (child 001)**: Infrastructure primitives (T-CNS-01, T-W1-CNS-04, T-CGC-01, T-W1-HOK-02, T-SCP-01, T-EVD-01-prep) — merge required before Wave B starts.
- **Wave C (child 003)**: Rollout + sweeps (T-EVD-01, T-CNS-03, T-CPN-01, T-W1-MCX-01, T-SRS-BND-01) — depends on Wave B merged.
- **Wave D (child 004)**: P2 maintainability (T-EXH-01, T-PIN-GOD-01, T-W1-PIN-02, T-RCB-DUP-01, T-YML-CP4-01, T-W1-HST-02) — deferrable.
- Any finding outside the 6 listed in §2 above.
- Re-auditing the 4 P0 composites (already verified in parent spec).

### 3.3 Cluster / Finding Crosswalk (Wave B only)

| Cluster | Finding | Severity | Task | Lane |
|---------|---------|----------|------|------|
| B | R3-P1-002 | P1 | T-CNS-02 | B1 |
| B | R51-P1-003 | P1 | T-W1-CNS-05 | B1 |
| B | R6-P1-001 (partial) | P1 | T-CGC-02 | B1 |
| B | R6-P2-001 | P2 | T-RBD-03 | B1 |
| B | R56-P1-NEW-003 | P1 | T-CNS-02 | B1 |
| D | R52-P1-001 | P1 | T-W1-CGC-03 | B2 |
| E | R52-P1-002 | P1 | T-W1-HOK-01 | B2 |
| E | R56-P1-NEW-002 | P1 (compound) | T-W1-HOK-01 | B2 |
| A | R4-P1-001 (prevention) | P1 | T-SCP-02 | B3 |
| C | R2-P1-002 | P1 | T-SAN-01 + T-SAN-03 | B3 |
| C | R2-P2-001 | P2 | T-SAN-02 | B3 |
| C | R3-P2-003 | P2 | T-SAN-03 | B3 |
| C | R5-P2-001 | P2 | T-SAN-03 | B3 |
| Standalone | R1-P1-002 | P1 | T-PIN-RET-01 | B3 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

Wave B directly satisfies 5 of the 8 parent FC items (FC-3/FC-4/FC-5/FC-6/FC-8). FC-1/FC-2/FC-7 are Wave A or Wave C scope.

### 4.1 Functional Requirements (Wave B subset)

- **FC-3**: Every research iteration folder (`research/NNN-*/iterations/`) either has `description.json` + `graph-metadata.json` or is explicitly flagged as auto-invisible. **Owner**: T-CNS-02 (Lane B1).
- **FC-4**: `handlers/code-graph/{scan,status,context,ccc-status,ccc-reindex,ccc-feedback}.ts` emit `canonicalReadiness` + `trustState` + `lastPersistedAt` via shared `lib/code-graph/readiness-contract.ts`. **Owner**: T-W1-CGC-03 (Lane B2).
- **FC-5**: `hooks/copilot/compact-cache.ts` exists and writes `trustState: 'cached'`; `hooks/copilot/session-prime.ts` reads `payloadContract?.provenance.trustState`. **Owner**: T-W1-HOK-01 (Lane B2).
- **FC-6**: `shared/gate-3-classifier.ts:normalizePrompt` applies `.normalize('NFKC')` + strips `[\u00AD\u200B-\u200F\uFEFF]` zero-width/soft-hyphen characters. **Owner**: T-SAN-01 (Lane B3).
- **FC-8**: `partial_causal_link_unresolved` outcomes have a retry-exhaustion counter keyed on `(memoryId, step, reason)`. **Owner**: T-PIN-RET-01 (Lane B3).

### 4.2 Non-Functional Requirements

- **NFW-B-1**: Zero new P0 findings introduced by Wave B commits (verified by `/spec_kit:deep-review :auto` ×7 on Wave B scope).
- **NFW-B-2**: Zero new P1 findings introduced by Wave B commits.
- **NFW-B-3**: T-W1-CGC-03 atomic-ship constraint respected — either all 6 code-graph handlers ship in one PR OR un-refactored handlers emit `trustState: 'unavailable'` stubs during staged rollout.
- **NFW-B-4**: T-W1-HOK-01 depends on T-W1-HOK-02 (Wave A) — reverse order re-inlines the helper as a third duplicate.
- **NFW-B-5**: T-SAN-01 + T-SAN-03 land in same PR — tests fail until code lands.
- **NFW-B-6**: T-SCP-01 (Wave A) must land before T-SCP-02 — lint-first breaks build.
- **NFW-B-7**: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh --strict` on 017 folder exits 0 with 0 warnings after Wave B completes.
- **NFW-B-8**: Vitest suite passes for all modified modules.

### 4.3 Contract Requirements

- `trustState` vocabulary remains `'live' | 'stale' | 'absent' | 'unavailable'` — Wave B's T-W1-CGC-03 does NOT introduce a new value. `'cached'` in T-W1-HOK-01 is a separate `SharedPayloadTrustState` vocabulary for hooks, not code-graph.
- All new files placed in canonical directories (`lib/enrichment/retry-budget.ts`, `hooks/copilot/compact-cache.ts`, `scripts/memory/backfill-research-metadata.ts`, `scripts/validation/continuity-freshness.ts`).
- Consumer-facing contracts for `StructuralRoutingNudgeMeta`, hook payload shapes, and `canonicalReadiness` must be preserved (no renames without explicit scoped task).
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

### 5.1 Per-Lane Exit Criteria

**Lane B1 complete when**:
- All 4 tasks merged (T-CNS-02, T-W1-CNS-05, T-CGC-02, T-RBD-03)
- Every `research/NNN-*/iterations/` has metadata
- `validate.sh --strict` warns on stale continuity fixtures (verified by inducing test stale state)
- `context.ts:98-105` replaced silent catch with explicit error branch
- Both rollup sites carry design-intent comments citing commit `709727e98`

**Lane B2 complete when**:
- T-W1-CGC-03 merged (6 handlers refactored OR staged stub rollout complete)
- T-W1-HOK-01 merged (Copilot compact-cache exists + session-prime reads trustState)
- Vitest covers parallel Claude/Gemini/Copilot compact-cycle behavior
- Atomic-ship constraint verified (single PR OR `trustState: 'unavailable'` stub verified in intermediate state)

**Lane B3 complete when**:
- T-SCP-02 lint rule active (verified by attempting to add `normalizeScopeFoo` in scratch branch — build fails)
- T-SAN-01 + T-SAN-02 + T-SAN-03 merged (NFKC applied in both sites, 5+ unicode test cases pass)
- T-PIN-RET-01 merged (retry counter keyed on tuple, skip after N=3, structured warning log)

### 5.2 Wave B Gate (CHK-B-GATE)

Wave B closes when ALL 3 lanes complete AND the following pass:

- `/spec_kit:deep-review :auto` ×7 on Wave B scope emits ZERO new P0, ZERO new P1
- `validate.sh --strict` on 017 folder exits 0 with 0 warnings
- Vitest suite passes end-to-end
- T-W1-CGC-03 atomic-ship constraint verified (inspected via `git log --follow handlers/code-graph/`)
- Rollback procedure verified per-lane (see `plan.md` §6)

### 5.3 Downstream-Readiness Criteria (unblocks Wave C)

- All 5 Wave B tasks resolving Cluster B/D/E P1 findings shipped with `[EVIDENCE: <commit-hash>]` citations in `tasks.md`
- Phase 017 autonomous-execution pre-req satisfied: Cluster E closed BEFORE Copilot autonomous iteration resumes
- 16-folder sweep pre-flight clean: `jq '.lastUpdated' description.json` across all 16 folders returns pre-Wave-C baseline (stale, expected — T-CNS-03 in Wave C will refresh them)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

### 6.1 Hard Dependencies on Wave A

| Wave A artefact | Wave B consumer | Risk if missing |
|------------------|------------------|------------------|
| `lib/code-graph/readiness-contract.ts` (T-CGC-01) | T-W1-CGC-03 import target | Handlers have nothing to import → 6-way broken build |
| `hooks/shared-provenance.ts` (T-W1-HOK-02) | T-W1-HOK-01 import target | Copilot `compact-cache.ts` would re-inline as 3rd duplicate |
| `scope-governance.ts` canonical normalizer intact (T-SCP-01) | T-SCP-02 lint rule | Lint would reject the only remaining canonical declaration |
| `workflow.ts` metadata writer (T-CNS-01 + T-W1-CNS-04) | T-CNS-02 post-save wiring | Research backfill would not trigger on canonical save |

### 6.2 Risk Matrix (Wave B specific)

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|-------------|
| T-W1-CGC-03 split mid-rollout → naive consumers see `trustState: undefined` | Medium | Medium | Atomic-ship OR `trustState: 'unavailable'` stubs per plan.md §3.2.1 |
| T-W1-HOK-01 shipped before T-W1-HOK-02 (ordering error) | Low | Medium | Task ordering check in plan.md §3.2.2; vitest fails if helper not exported |
| T-SAN-01 code without T-SAN-03 tests (red repo) | Low | Low | Atomic-ship both in same PR per plan.md §3.3.2 |
| T-SCP-02 lint lands before T-SCP-01 normalizer collapse (Wave A) | Low | High (build-red) | Wave ordering enforces T-SCP-01 merged before T-SCP-02 activation |
| T-CNS-02 backfill clobbers existing iteration `description.json` | Low | Medium | Use "missing-only" write semantics (don't overwrite extant files); vitest covers 3 cases |
| 3 parallel lanes introduce merge conflicts | Medium | Low | Lane-local file scopes minimise overlap; B1/B2/B3 touch disjoint modules |
| T-PIN-RET-01 counter grows unbounded in long-running processes | Low | Low | Counter scope is (memoryId, step, reason) tuple; memoryId is enrichment-scoped, not session-lifetime |
| Wave B autonomous-execution dispatch triggers H-56-4 before T-W1-HOK-01 merges | Medium | Medium | Per `feedback_phase_018_autonomous` (user memory), Cluster E MUST land BEFORE autonomous Copilot iteration |

### 6.3 File-Collision Summary (Wave B scope only)

- **`handlers/code-graph/*.ts`** (6 handlers): All in T-W1-CGC-03 scope → single-task ownership, no intra-wave collision.
- **`hooks/copilot/*.ts`**: Only T-W1-HOK-01 writes here in Wave B.
- **`shared/gate-3-classifier.ts`**: T-SAN-01 sole writer.
- **`hooks/claude/shared.ts:100-119`**: T-SAN-02 sole writer (Wave B scope); T-W1-HOK-02 (Wave A) touched a different region (lines 125-129).
- **`handlers/save/post-insert.ts`**: T-RBD-03 (lines 344-369) + T-PIN-RET-01 (lines 159-173, 347-365). Overlap at 347-365 requires sequencing within Lane B1/B3 OR merging in one sub-PR.
- **`handlers/save/response-builder.ts`**: T-RBD-03 sole writer in Wave B.
- **`scripts/spec/validate.sh`**: T-W1-CNS-05 (Lane B1) + T-SCP-02 (Lane B3) both extend this. Merge coordination required.

### 6.4 Rollback Dependencies

- Wave B rollback MUST preserve Wave A state. If any Lane requires `git revert`, verify the Wave A primitives remain intact (readiness-contract.ts present, shared-provenance.ts present, collapsed normalizers present).
- T-W1-CGC-03 rollback: if atomic-ship PR is reverted, restore `query.ts` as sole readiness probe (Wave A state) — 6 siblings revert to pre-Wave-B silent behavior.
- T-W1-HOK-01 rollback: delete `hooks/copilot/compact-cache.ts`; revert `session-prime.ts` to non-reading state. Claude/Gemini unaffected.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

Wave B scope is fully closed in parent spec.md §7.6. No Wave-B-specific open questions at spec-approval time. Parked items for Phase 019+:

- **KQ-B-1** (post-merge): Do the 6 code-graph sibling handlers benefit from a shared integration test, or is per-handler vitest parity sufficient? Revisit after T-W1-CGC-03 lands.
- **KQ-B-2** (T-CNS-02): Backfill semantics for partially-written iteration folders (one of two metadata files present) — current spec says "missing-only write"; confirm this matches operator intent for recovery scenarios.
- **KQ-B-3** (T-PIN-RET-01): Persistence of the retry-exhaustion counter across process restarts — current design is in-memory Map; confirm in-process scope is sufficient (long-running autonomous iterations may span restarts).
- **KQ-B-4** (T-SAN-01): Canonicalization order — NFKC first, then zero-width strip? Confirm via unicode-vet fixtures.

If any question becomes blocking during implementation, escalate via `/spec_kit:deep-research [focused-topic]` or surface in `handover.md` for the next Opus session.
<!-- /ANCHOR:questions -->

---

## 7. PARALLEL-LANE DEPENDENCIES (narrative)

Lanes B1 / B2 / B3 execute concurrently once Wave A merges. Within each lane, task order matters:

**Lane B1 sequence (4 tasks, single engineer-equivalent)**:
- T-CNS-02 (depends on T-CNS-01 + T-W1-CNS-04 from Wave A — post-save hook point needs canonical writer active)
- T-W1-CNS-05 (depends on T-W1-CNS-04 — freshness validator needs `derived.last_save_at` to be refreshed canonically first)
- T-CGC-02 (independent of other Lane B1 tasks; ordered last because its mitigation value is reduced once T-W1-CGC-03 lands in Lane B2)
- T-RBD-03 (independent comment-only change; runs anywhere)

**Lane B2 sequence (2 tasks, strict order)**:
- T-W1-CGC-03 (depends on T-CGC-01 from Wave A — shared module must exist)
- T-W1-HOK-01 (depends on T-W1-HOK-02 from Wave A — shared-provenance.ts must exist; can run in parallel with T-W1-CGC-03 since file scopes disjoint)

**Lane B3 sequence (3 tasks, mostly independent)**:
- T-SCP-02 (depends on T-SCP-01 from Wave A — lint fires on non-canonical declarations; Wave A must have completed the collapse)
- T-SAN-01 + T-SAN-02 + T-SAN-03 (same-PR atomic-ship; order within PR: SAN-01 code → SAN-02 code → SAN-03 tests; SAN-03 alone would fail)
- T-PIN-RET-01 (independent of other Lane B3 tasks)

---

## 8. NEXT STEPS

- [ ] Confirm Wave A (child 001) merged to `main` before Wave B starts
- [ ] Dispatch Lane B1 + Lane B2 + Lane B3 in parallel under cli-codex primary + cli-copilot fallback (3-concurrent max per `feedback_copilot_concurrency_override` (user memory))
- [ ] Run `/spec_kit:deep-review :auto` ×7 after Wave B code-complete (per `feedback_phase_018_autonomous` (user memory))
- [ ] Verify T-W1-CGC-03 atomic-ship constraint via `git log`
- [ ] Update parent `implementation-summary.md` with Wave B outcomes
- [ ] Trigger child 003 (Wave C) kickoff once Wave B gate passes

---

## 9. REFERENCES

- **Parent spec**: `../spec.md`
- **Parent plan**: `../plan.md` §3 (Wave B detailed task breakdowns)
- **Parent tasks**: `../tasks.md` (Wave B section)
- **Parent checklist**: `../checklist.md` (CHK-B1-*/B2-*/B3-*/B-GATE items)
- **Upstream research**: `../../research/016-foundational-runtime-001-initial-research/segment-2-synthesis.md`
- **Operator feedback**: `feedback_phase_018_autonomous` (user memory), `feedback_copilot_concurrency_override` (user memory)

<!-- ANCHOR:references -->
<!-- /ANCHOR:references -->
