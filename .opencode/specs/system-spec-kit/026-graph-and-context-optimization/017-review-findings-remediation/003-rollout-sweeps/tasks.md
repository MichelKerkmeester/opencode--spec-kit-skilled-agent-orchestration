---
title: "Tasks: Phase 017 Wave C — Rollout + Sweeps"
description: "5 Wave C tasks with acceptance criteria and finding crosswalk: T-EVD-01, T-CNS-03, T-CPN-01, T-W1-MCX-01, T-SRS-BND-01. Canonical `]` closers per T-EVD-01 contract."
trigger_phrases: ["phase 017 wave c tasks", "017 rollout tasks", "t-evd-01", "t-cns-03", "t-cpn-01", "t-w1-mcx-01", "t-srs-bnd-01"]
importance_tier: "critical"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/017-review-findings-remediation/003-rollout-sweeps"
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

**Legend**: `[ ]` pending • `[x]` complete • `[~]` in progress • `[!]` blocked
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

### T-EVD-01 — [ ] Evidence-marker lint activation

**Severity**: P2 | **Effort**: M (3h) | **Phase**: 1
**Files**: `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`, new `.opencode/skill/system-spec-kit/scripts/validation/evidence-marker-lint.ts`
**Resolves**: R3-P2-002 (tool side)
**Prerequisite**: T-EVD-01-prep (Wave A §2.5) completed — all 170/179 closers in 016 checklist.md rewrapped to `]`.

**Changes**:
1. Create `evidence-marker-lint.ts` that parses markdown files and asserts every `[EVIDENCE: ...]` closes with `]` (not `)`).
2. Wire into `validate.sh` as new `--strict` mode check.
3. Run against 017 folder in warn-mode first; flip to strict once confirmed 0 warnings.

**Acceptance**:
- [ ] Lint script exists at `scripts/validation/evidence-marker-lint.ts`
- [ ] Asserts `[EVIDENCE: ...]` closes with `]`, not `)`
- [ ] `--strict` mode exits 1 on any `)` closer detected
- [ ] Vitest `evidence-marker-lint.vitest.ts` passes with 5+ cases (pass, `)` fail, false-positive avoidance, multi-marker line, EVIDENCE-in-prose)
- [ ] All 16 sibling 026 folders pass the lint post T-CNS-03 sweep
- [ ] `validate.sh --strict` integration confirmed

**Evidence**: `[EVIDENCE: pending]`

### T-CPN-01 — [ ] Closing-pass-notes CP-002 amend

**Severity**: P2 | **Effort**: S (1h) | **Phase**: 1
**Files**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-foundational-runtime-deep-review/research/016-foundational-runtime-deep-review/closing-pass-notes.md:72-88`
**Resolves**: R3-P1-001

**Changes**:
1. Locate CP-002 section (lines 72-88) in closing-pass-notes.md.
2. Add status tag `[STATUS: RESOLVED 2026-04-17]` at section header.
3. Cite T-PIN-08 / commit `e774eef07` as the resolution evidence.

**Acceptance**:
- [ ] CP-002 section has `[STATUS: RESOLVED 2026-04-17]` tag visible at section header
- [ ] Cites T-PIN-08 / commit `e774eef07`
- [ ] Diff review shows no content changes beyond status + citation addition
- [ ] `grep -c 'STATUS: RESOLVED 2026-04-17' closing-pass-notes.md` returns at least 1

**Evidence**: `[EVIDENCE: pending]`

### T-W1-MCX-01 — [ ] memory-context readiness field rename

**Severity**: P2 | **Effort**: S (2h) | **Phase**: 1
**Files**: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:200, 425`
**Resolves**: R52-P2-002

**Changes**:
1. Grep for all consumers of the `readiness` field in `StructuralRoutingNudgeMeta`: `grep -rn 'readiness' mcp_server/ lib/`.
2. Rename `readiness` → `advisoryPreset` at both line 200 (type/interface) and line 425 (assignment/use site).
3. If grep reveals the field is always-literal (never read by consumer logic), alternative: remove the field entirely.
4. Preserve consumer-facing contract with advisory note if observable surface exists.

**Acceptance**:
- [ ] `readiness` field renamed to `advisoryPreset` in `StructuralRoutingNudgeMeta` (or removed if always-literal)
- [ ] `grep -rn '\\breadiness\\b' mcp_server/handlers/memory-context.ts` returns 0 (or documented residual consumer contract)
- [ ] Consumer-facing contract preserved (or explicit advisory note added)
- [ ] Vitest `memory-context.vitest.ts` passes post-rename
- [ ] TypeScript compiles (`npx tsc --noEmit`)

**Evidence**: `[EVIDENCE: pending]`

---

<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2 — Session-Resume Auth Staged Rollout (~8h)

### T-SRS-BND-01 — [ ] Session-resume auth binding

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
- [ ] `handleSessionResume` rejects `args.sessionId` mismatching MCP transport identity
- [ ] Permissive-mode flag exists with default ON during canary
- [ ] Canary run logged: at least 1 accept outcome + 1 reject outcome
- [ ] Permissive-mode flag flipped OFF post-canary (committed to main)
- [ ] Vitest `session-resume.vitest.ts` covers accept + reject cases
- [ ] `lifecycle-tools.ts:67` wired to new auth contract

**Staged rollout log**:
- [ ] Phase 2a (code): commit `<hash>` `[EVIDENCE: pending]`
- [ ] Phase 2b (permissive canary): commit `<hash>` + log summary `[EVIDENCE: pending]`
- [ ] Phase 2c (reject-mode): commit `<hash>` `[EVIDENCE: pending]`

**Evidence**: `[EVIDENCE: pending]`

---

<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3 — 16-Folder Canonical-Save Sweep (~8h, HIGH rollback cost)

### T-CNS-03 — [ ] 16-folder canonical-save sweep

**Severity**: P1 | **Effort**: L (8h) | **Phase**: 3
**Files**: All 16 sibling `026-graph-and-context-optimization/*/` folders
**Resolves**: R5-P1-001, R3-P2-001 (data side)
**Prerequisite**: T-CNS-01 + T-W1-CNS-04 (Wave A §2.1) MERGED — canonical-save writer fix.

**Changes**:
1. Pre-sweep backup: `git stash push -m "pre-017-sweep" -- 026-graph-and-context-optimization/*/description.json 026-graph-and-context-optimization/*/graph-metadata.json`.
2. Smoke test on 1 low-risk folder (e.g. `002-cache-warning-hooks/` or comparable). Verify fresh `lastUpdated` + `last_save_at`.
3. Commit smoke folder first as isolation checkpoint.
4. If smoke test passes: sweep remaining 15 folders sequentially.
5. Per-folder `/memory:save --subfolder=<folder>` followed by per-folder commit.
6. Final verification loop: `for f in 026/*/; do jq '.lastUpdated' $f/description.json; jq '.derived.last_save_at' $f/graph-metadata.json; done`.

**Acceptance**:
- [ ] Smoke folder sweep verified: `jq '.lastUpdated' description.json` returns fresh time (within 10m of run)
- [ ] Smoke folder committed as standalone commit before proceeding
- [ ] Remaining 15 folders swept sequentially
- [ ] 16 per-folder commits in git log with `chore(017): T-CNS-03 ...` prefix
- [ ] Final verification: 16/16 folders have `lastUpdated ≤ derived.last_save_at + 10m`
- [ ] Pre-sweep `git stash` dropped only after Wave C gate passes

**Rollback**: Per-folder `git revert` (16 separate commits); restore `git stash pop` pre-sweep backup for un-committed folders.

**Evidence**: `[EVIDENCE: pending]`

---

<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Phase 4 — Wave C Ship Gate (~1h)

After all 5 tasks complete:

- [ ] Run `/spec_kit:deep-review :auto` ×7 on Wave C scope (16-folder sweep + evidence-marker lint + session-resume auth + memory-context rename)
- [ ] Run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh 026-graph-and-context-optimization/017-review-findings-remediation/003-rollout-sweeps --strict` — exits 0 with 0 warnings
- [ ] Verify ZERO new P0 findings emitted
- [ ] Verify ZERO new P1 findings emitted
- [ ] Mark all CHK-C-01..05 + CHK-C-GATE items complete in `checklist.md` with `[EVIDENCE: <commit-hash> <description>]` citations
- [ ] Update `implementation-summary.md` with Wave C completion narrative and commit hashes for all 5 tasks

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

- **Review report**: `../../016-foundational-runtime-deep-review/review/016-foundational-runtime-deep-review/review-report.md`
- **Segment-2 synthesis**: `../../016-foundational-runtime-deep-review/research/016-foundational-runtime-deep-review/segment-2-synthesis.md`

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
| T-EVD-01 | M (3h) | P2 | 1 | pending |
| T-CPN-01 | S (1h) | P1 | 1 | pending |
| T-W1-MCX-01 | S (2h) | P2 | 1 | pending |
| T-SRS-BND-01 | L (8h) | P1 | 2 | pending |
| T-CNS-03 | L (8h) | P1 | 3 | pending |
| **Total** | **~22h raw / ~15h effective (Phase 1 parallelized)** | **3 P1 + 2 P2** | — | **0/5 complete** |

**Critical path**: T-SRS-BND-01 (canary monitoring) + T-CNS-03 (sequential 16-folder sweep) — these two cannot be parallelized with each other or with Phase 1 without risk.
