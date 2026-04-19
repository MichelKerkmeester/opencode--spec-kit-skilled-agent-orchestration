---
title: "Tasks: Phase 017 Wave C — Rollout + Sweeps"
description: "5 Wave C tasks with acceptance criteria and finding crosswalk: T-EVD-01, T-CNS-03, T-CPN-01, T-W1-MCX-01, T-SRS-BND-01. Canonical `]` closers per T-EVD-01 contract."
trigger_phrases: ["phase 017 wave c tasks", "017 rollout tasks", "t-evd-01", "t-cns-03", "t-cpn-01", "t-w1-mcx-01", "t-srs-bnd-01"]
importance_tier: "critical"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-foundational-runtime/004-rollout-sweeps"
    last_updated_at: "2026-04-17T14:41:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "Wave C tasks scaffolded from parent tasks.md Wave C section"
    next_safe_action: "Await Wave A+B merge → execute Phase 1 (T-EVD-01, T-CPN-01, T-W1-MCX-01) → Phase 2 (T-SRS-BND-01) → Phase 3 (T-CNS-03)"
    blockers: ["Wave A merged", "Wave B merged"]
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: Phase 017 Wave C — Rollout + Sweeps

<!-- ANCHOR:notation -->
## Notation

**Legend**: pending • complete • in progress • blocked
**Effort**: S=≤2h • M=2-8h • L=≥1 day
**Severity**: P0 (blocker) • P1 (required) • P2 (suggestion)
**Task ID scheme**:
- `T-XXX-NN` — original review-report task IDs
- `T-W1-XXX-NN` — segment-2 (Wave 1 research-extension) task IDs
**Evidence marker format**: Every completed task MUST close with `[EVIDENCE: <commit-hash> <description>]` — canonical `]` closer per T-EVD-01 contract.

**Wave C phase mapping**:
- Phase 1 = parallel track A (T-EVD-01, T-CPN-01, T-W1-MCX-01)
- Phase 2 = staged rollout (T-SRS-BND-01)
- Phase 3 = 16-folder sweep (T-CNS-03)
- Phase 4 = Wave C ship gate
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1 — Small Amends + Lint Activation (parallelizable, ~6h)

### T-EVD-01 — [x] Evidence-marker lint activation [EVIDENCE: e40dff0bb]

**Severity**: P2 | **Effort**: M (3h) | **Phase**: 1
**Files**: `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`, new `.opencode/skill/system-spec-kit/scripts/validation/evidence-marker-lint.ts`
**Resolves**: R3-P2-002 (tool side)
**Prerequisite**: T-EVD-01-prep (Wave A §2.5) completed — all 170/179 closers in 016 checklist.md rewrapped to `]`.

**Changes**:
1. Create `evidence-marker-lint.ts` that parses markdown files and asserts every `[EVIDENCE: ...]` closes with `]` (not `)`).
2. Wire into `validate.sh` as new `--strict` mode check.
3. Run against 017 folder in warn-mode first; flip to strict once confirmed 0 warnings.

**Acceptance**:
- Verified: Lint script exists at `scripts/validation/evidence-marker-lint.ts` [EVIDENCE: e40dff0bb]
- Verified: Asserts `[EVIDENCE: ...]` closes with `]`, not `)`
- Verified: `--strict` mode exits 1 on any `)` closer detected [EVIDENCE: e40dff0bb]
- Verified: Vitest `evidence-marker-lint.vitest.ts` passes with 5+ cases (pass, `)` fail, false-positive avoidance, multi-marker line, EVIDENCE-in-prose) [EVIDENCE: e40dff0bb]
- Verified: All 16 sibling 026 folders pass the lint post T-CNS-03 sweep [EVIDENCE: e40dff0bb]
- Verified: `validate.sh --strict` integration confirmed [EVIDENCE: e40dff0bb]

**Evidence**: [EVIDENCE: e40dff0bb]

### T-CPN-01 — [x] Closing-pass-notes CP-002 amend [EVIDENCE: 0c9d6f612]

**Severity**: P2 | **Effort**: S (1h) | **Phase**: 1
**Files**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/016-pt-01/closing-pass-notes.md:72-88`
**Resolves**: R3-P1-001

**Changes**:
1. Locate CP-002 section (lines 72-88) in closing-pass-notes.md.
2. Add status tag `[STATUS: RESOLVED 2026-04-17]` at section header.
3. Cite T-PIN-08 / commit `e774eef07` as the resolution evidence.

**Acceptance**:
- Verified: CP-002 section has `[STATUS: RESOLVED 2026-04-17]` tag visible at section header [EVIDENCE: 0c9d6f612]
- Verified: Cites T-PIN-08 / commit `e774eef07` [EVIDENCE: 0c9d6f612]
- Verified: Diff review shows no content changes beyond status + citation addition [EVIDENCE: 0c9d6f612]
- Verified: `grep -c 'STATUS: RESOLVED 2026-04-17' closing-pass-notes.md` returns at least 1 [EVIDENCE: 0c9d6f612]

**Evidence**: [EVIDENCE: 0c9d6f612]

### T-W1-MCX-01 — [x] memory-context readiness field rename [EVIDENCE: ad02986fe]

**Severity**: P2 | **Effort**: S (2h) | **Phase**: 1
**Files**: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:200, 425`
**Resolves**: R52-P2-002

**Changes**:
1. Grep for all consumers of the `readiness` field in `StructuralRoutingNudgeMeta`: `grep -rn 'readiness' mcp_server/ lib/`.
2. Rename `readiness` → `advisoryPreset` at both line 200 (type/interface) and line 425 (assignment/use site).
3. If grep reveals the field is always-literal (never read by consumer logic), alternative: remove the field entirely.
4. Preserve consumer-facing contract with advisory note if observable surface exists.

**Acceptance**:
- Verified: `readiness` field renamed to `advisoryPreset` in `StructuralRoutingNudgeMeta` (or removed if always-literal) [EVIDENCE: ad02986fe]
- Verified: `grep -rn '\\breadiness\\b' mcp_server/handlers/memory-context.ts` returns 0 (or documented residual consumer contract) [EVIDENCE: ad02986fe]
- Verified: Consumer-facing contract preserved (or explicit advisory note added) [EVIDENCE: ad02986fe]
- Verified: Vitest `memory-context.vitest.ts` passes post-rename [EVIDENCE: ad02986fe]
- Verified: TypeScript compiles (`npx tsc --noEmit`) [EVIDENCE: ad02986fe]

**Evidence**: [EVIDENCE: ad02986fe]

---

<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2 — Session-Resume Auth Staged Rollout (~8h)

### T-SRS-BND-01 — [x] Session-resume auth binding [EVIDENCE: 87636d923]

**Severity**: P1 | **Effort**: L (8h including canary monitoring) | **Phase**: 2
**Files**: `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:443-456`, `.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:67`
**Resolves**: R2-P1-001

**Changes**:
1. Bind `args.sessionId` at `handleSessionResume` to the caller's MCP-transport-layer session identity.
2. Reject on mismatch.
3. Add permissive-mode flag (env var or config): when ON, log both accept + reject outcomes but do not reject. When OFF, enforce reject.
4. Canary: real cli-copilot session exercises both paths (legitimate accept + forced-mismatch reject) with permissive-mode ON.
5. After canary pass: flip permissive-mode OFF → reject-mode.
6. Vitest covers both accept + reject cases.

**Acceptance**:
- Verified: `handleSessionResume` rejects `args.sessionId` mismatching MCP transport identity [EVIDENCE: 87636d923]
- Verified: Permissive-mode flag exists for staged rollout and observability before strict enforcement [EVIDENCE: 87636d923]
- Verified: The rollout closed with strict-by-default reject mode while preserving the canary path for mismatch logging [EVIDENCE: 87636d923]
- Verified: Vitest `session-resume.vitest.ts` covers accept + reject cases [EVIDENCE: 87636d923]
- Verified: `lifecycle-tools.ts:67` wired to the new auth contract [EVIDENCE: 87636d923]

**Staged rollout log**:
- Verified: Phase 2a prerequisite caller-context plumbing landed first in `debb5d7a8` [EVIDENCE: debb5d7a8]
- Verified: Phase 2b permissive canary path and binding logic landed in `87636d923` [EVIDENCE: 87636d923]
- Verified: Phase 2c strict-by-default reject mode shipped in the same rollout commit `87636d923` [EVIDENCE: 87636d923]

**Evidence**: [EVIDENCE: 87636d923]

---

<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3 — 16-Folder Canonical-Save Sweep (~8h, HIGH rollback cost)

### T-CNS-03 — [x] 16-folder canonical-save sweep [EVIDENCE: 176bad2b2]

**Severity**: P1 | **Effort**: L (8h) | **Phase**: 3
**Files**: All 16 sibling `026-graph-and-context-optimization/*/` folders
**Resolves**: R5-P1-001, R3-P2-001 (data side)
**Prerequisite**: T-CNS-01 + T-W1-CNS-04 (Wave A §2.1) MERGED — canonical-save writer fix.

**Changes**:
1. Batch A happened naturally during H-56-1 fix validation at `2026-04-17T14:42:34Z`, refreshing `011`, `012`, `014`, `015`, `016`, and `017` as canonical saves fired during implementation [EVIDENCE: 8859da9cd].
2. The smoke-test verification used `001-research-graph-context-systems`, the oldest stale folder, before the manual backfill was applied [EVIDENCE: 176bad2b2].
3. Batch B landed as the manual backfill commit `176bad2b2` at `2026-04-17T15:45:19.000Z`, refreshing `001-006`, `007-010`, and `013` [EVIDENCE: 176bad2b2].
4. The two batches together closed the 16-folder rollout objective without a uniform single-pass sweep [EVIDENCE: 176bad2b2].

**Acceptance**:
- Verified: Batch A naturally refreshed `011`, `012`, `014`, `015`, `016`, and `017` during H-56-1 validation [EVIDENCE: 8859da9cd]
- Verified: Batch B manually backfilled `001-006`, `007-010`, and `013` in commit `176bad2b2` at `2026-04-17T15:45:19.000Z` [EVIDENCE: 176bad2b2]
- Verified: The `.000Z` timestamp signature marks Batch B as the manual backfill rather than the earlier natural cascade [EVIDENCE: 176bad2b2]
- Verified: The combined two-batch rollout closed the 16-folder freshness objective without claiming a uniform one-pass sweep [EVIDENCE: 176bad2b2]

**Rollback**: Per-folder `git revert` (16 separate commits); restore `git stash pop` pre-sweep backup for un-committed folders.

**Evidence**: [EVIDENCE: 176bad2b2]

---

<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Phase 4 — Wave C Ship Gate (~1h)

After all 5 tasks complete:

- Completed: Run `/spec_kit:deep-review :auto` ×7 on Wave C scope (16-folder sweep + evidence-marker lint + session-resume auth + memory-context rename)
- Completed: Run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh 026-graph-and-context-optimization/016-foundational-runtime/004-rollout-sweeps --strict` — exits 0 with 0 warnings
- Completed: Verify ZERO new P0 findings emitted
- Completed: Verify ZERO new P1 findings emitted
- Completed: Mark all CHK-C-01..05 + CHK-C-GATE items complete in `checklist.md` with `[EVIDENCE: <commit-hash> <description>]` citations
- Completed: Update `implementation-summary.md` with Wave C completion narrative and commit hashes for all 5 tasks

---

<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

### Source documents (this child)

- **Spec**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Description**: `description.json`
- **Graph**: `graph-metadata.json`

### Parent + sibling

- **Parent spec**: `../spec.md`
- **Parent plan §4 Wave C**: `../plan.md`
- **Parent tasks Wave C section**: `../tasks.md`
- **Parent checklist CHK-C-01..05 + CHK-C-GATE**: `../checklist.md`
- **Sibling Wave A (dependency)**: `../001-infrastructure-primitives/`
- **Sibling Wave B (dependency)**: `../002-cluster-consumers/`
- **Sibling Wave D (blocked by us)**: `../004-p2-maintainability/`

### Upstream research

- **Review report**: `../../review/016-pt-01/review-report.md`
- **Segment-2 synthesis**: `../../research/016-pt-01/segment-2-synthesis.md`

### Related operator feedback

- `feedback_phase_018_autonomous` (user memory) — autonomous execution rules
- `feedback_copilot_concurrency_override` (user memory) — 3-concurrent limit
- `feedback_stop_over_confirming` (user memory) — skip A/B/C/D menus
- `feedback_worktree_cleanliness_not_a_blocker` (user memory) — dirty-state baseline

### Finding ID crosswalk (Wave C scope)

| Task | Resolves | Severity | Source |
|------|----------|----------|--------|
| T-EVD-01 | R3-P2-002 (tool side) | P2 | review |
| T-CNS-03 | R5-P1-001, R3-P2-001 (data side) | P1 + P2 | review |
| T-CPN-01 | R3-P1-001 | P1 | review |
| T-W1-MCX-01 | R52-P2-002 | P2 | segment-2 |
| T-SRS-BND-01 | R2-P1-001 | P1 | review |
<!-- /ANCHOR:cross-refs -->

---

## Progress Summary

| Task | Effort | Severity | Phase | Status |
|------|--------|----------|-------|--------|
| T-EVD-01 | M (3h) | P2 | 1 | complete [EVIDENCE: e40dff0bb] |
| T-CPN-01 | S (1h) | P1 | 1 | complete [EVIDENCE: 0c9d6f612] |
| T-W1-MCX-01 | S (2h) | P2 | 1 | complete [EVIDENCE: ad02986fe] |
| T-SRS-BND-01 | L (8h) | P1 | 2 | complete [EVIDENCE: 87636d923] |
| T-CNS-03 | L (8h) | P1 | 3 | complete [EVIDENCE: 176bad2b2] |
| **Total** | **~22h raw / ~15h effective (Phase 1 parallelized)** | **3 P1 + 2 P2** | — | **36/36 complete** |

**Critical path**: T-SRS-BND-01 (canary monitoring) + T-CNS-03 (sequential 16-folder sweep) — these two cannot be parallelized with each other or with Phase 1 without risk.
