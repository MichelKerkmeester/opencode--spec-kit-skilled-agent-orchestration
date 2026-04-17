---
title: "Feature Specification: Phase 017 Wave C — Rollout + Sweeps"
description: "Child spec for Wave C: 5 tree-wide rollout and sweep tasks (15h / 2 days). Activates evidence-marker lint, runs 16-folder canonical-save sweep, amends stale closing-pass-notes, renames memory-context readiness field, and binds session-resume auth to MCP transport identity with staged rollout. Depends on Waves A + B merged."
trigger_phrases: ["phase 017 wave c", "017 rollout sweeps", "t-evd-01 evidence lint", "t-cns-03 sixteen-folder sweep", "t-srs-bnd-01 session-resume auth", "t-cpn-01 cp-002 amend", "t-w1-mcx-01 memory-context rename"]
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/017-review-findings-remediation/003-rollout-sweeps"
    last_updated_at: "2026-04-17T14:41:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "Child folder scaffolded from parent §4 Wave C scope"
    next_safe_action: "Await Waves A+B merge → execute T-EVD-01 + T-CPN-01 + T-W1-MCX-01 → canary T-SRS-BND-01 → sweep T-CNS-03"
    blockers: ["Wave A merged (001-infrastructure-primitives)", "Wave B merged (002-cluster-consumers)"]
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Feature Specification: Phase 017 Wave C — Rollout + Sweeps

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 (T-CNS-03, T-SRS-BND-01) + P2 (T-EVD-01, T-CPN-01, T-W1-MCX-01) |
| **Status** | Ready for Implementation (blocked on Waves A + B merge) |
| **Created** | 2026-04-17 |
| **Updated** | 2026-04-17 |
| **Parent** | `../` (017-review-findings-remediation) |
| **Wave** | C (Rollout + Sweeps) |
| **Effort Estimate** | ~15h / 2 working days / 1 engineer |
| **Depends On** | `../001-infrastructure-primitives/` (Wave A) merged + `../002-cluster-consumers/` (Wave B) merged |
| **Blocks** | `../004-p2-maintainability/` (Wave D) ship gate |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Wave C is the tree-wide rollout phase of Phase 017. It has TWO structural obligations that only become safe once Waves A + B land:

1. **Tree-wide data refresh** — Wave A fixed the canonical-save writer (T-CNS-01 + T-W1-CNS-04), but the fix only applies to NEW saves. The existing 16 sibling folders under `026-graph-and-context-optimization/` still carry stale `description.json.lastUpdated` and `graph-metadata.json.derived.last_save_at` timestamps from before the fix. Wave C runs the T-CNS-03 sweep that forces a fresh canonical-save per folder, verifying each one in turn.

2. **Strict-mode lint + vocabulary hygiene** — Wave A rewrapped the 016 checklist.md evidence markers (T-EVD-01-prep), enabling T-EVD-01 to activate the `evidence-marker-lint` in `--strict` mode. Wave B hardened the code-graph trust-state vocabulary. Wave C renames the last `readiness` field in `memory-context.ts` to `advisoryPreset` (T-W1-MCX-01) and amends a stale closing-pass-note that contradicts Phase 017's resolution (T-CPN-01).

3. **Session-resume auth rollout** — T-SRS-BND-01 closes R2-P1-001 (session-ID authentication gap) but requires a canary on a test session before full enable, since an over-eager binding could block legitimate session-resume flows.

### Purpose

Execute the 5 Wave C tasks in a staged, reversible manner that respects the HIGH rollback cost of the 16-folder sweep and the staged-rollout requirement for T-SRS-BND-01. Verify tree-wide metadata freshness (FC-2) and session-resume auth contract (FC-7) from parent spec.md §4.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### 3.1 In-Scope — 5 Wave C Tasks

1. **T-EVD-01** — Evidence-marker lint activation (3h, M)
   - Files: `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`, new `scripts/validation/evidence-marker-lint.ts`
   - Resolves: R3-P2-002 (tool side)
   - Prerequisite: T-EVD-01-prep (Wave A) completed (170 closer rewraps in 016 checklist.md)

2. **T-CNS-03** — 16-folder canonical-save sweep (8h, L)
   - Files: All 16 sibling `026-graph-and-context-optimization/*/` folders
   - Resolves: R5-P1-001, R3-P2-001 (data side)
   - HIGH ROLLBACK COST — 1-folder smoke test first, per-folder commit, stashable

3. **T-CPN-01** — Closing-pass-notes CP-002 amend (1h, S)
   - Files: `research/016-foundational-runtime-deep-review/closing-pass-notes.md:72-88`
   - Resolves: R3-P1-001

4. **T-W1-MCX-01** — memory-context readiness field rename (2h, S)
   - Files: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:200, 425`
   - Resolves: R52-P2-002

5. **T-SRS-BND-01** — Session-resume auth binding (8h including monitoring, L)
   - Files: `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:443-456`, `tools/lifecycle-tools.ts:67`
   - Resolves: R2-P1-001
   - Staged rollout with permissive-mode flag + canary verification before full enable

### 3.2 Out-of-Scope

- Any Wave A infrastructure task (owned by `../001-infrastructure-primitives/`).
- Any Wave B consumer task (owned by `../002-cluster-consumers/`).
- Wave D P2 maintainability tasks (owned by `../004-p2-maintainability/`).
- New clusters or findings that surface mid-sweep — route back to parent spec before acting.
- Re-running Wave A fixes if 16-folder sweep exposes gaps — escalate to parent, do not hotfix in-child.

### 3.3 Rollout Hazards Owned by This Child

| Hazard | Mitigation |
|--------|------------|
| 16-folder sweep corrupts critical folder (e.g. 016-foundational) | 1-folder smoke test first on low-risk target; per-folder commit; pre-sweep `git stash` |
| Un-verified writer runs against all 16 folders | Wave A gate MUST have green `/spec_kit:deep-review :auto` ×7 before sweep starts |
| T-SRS-BND-01 blocks legitimate session-resume flows | Permissive-mode flag; canary test session; only flip to reject-mode after canary pass |
| T-EVD-01 `--strict` fails on un-rewrapped folder | Verify T-EVD-01-prep (Wave A §2.5) completed; run lint in warn-mode first on 017 + 018 folders |
| T-W1-MCX-01 breaks consumers via field rename | Grep for `readiness` consumers first; add advisory note if contract surface preserved |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

Wave C's success criteria are a subset of the parent spec's FC-1..FC-8. The 2 requirements owned here:

- **FC-2** (owned by T-CNS-03): All 16 sibling folders under `026-graph-and-context-optimization/` have `description.json.lastUpdated ≥ graph-metadata.json.derived.last_save_at - 10m`.
- **FC-7** (owned by T-SRS-BND-01): `handleSessionResume` binds `args.sessionId` to the caller's MCP-transport-layer session identity.

Supporting (non-functional) requirements:

- **NF-1** (inherited): Zero new P0 findings introduced — verified by `/spec_kit:deep-review :auto` ×7 on Wave C scope per `feedback_phase_018_autonomous` (user memory).
- **NF-2** (inherited): `validate.sh --strict` on 017 folder exits 0 with 0 warnings after Wave C completes.
- **NF-C-1** (Wave-C-specific): T-CNS-03 per-folder commits enable selective `git revert` without disturbing siblings.
- **NF-C-2** (Wave-C-specific): T-SRS-BND-01 canary pass documented before permissive-mode flag flips to reject-mode.
- **NF-C-3** (Wave-C-specific): T-EVD-01 `--strict` mode does not activate until 16-folder sweep completes (otherwise mid-sweep folders trigger spurious `)` closer noise).
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

### 5.1 Functional (Wave C owned)

- **WC-FC-1** (FC-2 from parent): `jq '.lastUpdated' description.json` across all 16 folders returns timestamps within 10m of `jq '.derived.last_save_at' graph-metadata.json`.
- **WC-FC-2** (FC-7 from parent): `handleSessionResume` rejects `args.sessionId` mismatching caller's MCP transport identity; permissive-mode flag is OFF post-canary.
- **WC-FC-3**: `evidence-marker-lint` wired into `--strict` mode; `grep -c '\[EVIDENCE:.*\)$' 016/checklist.md` returns 0 across all 16 folders post-sweep.
- **WC-FC-4**: `closing-pass-notes.md:72-88` CP-002 section marked `[STATUS: RESOLVED 2026-04-17]` citing T-PIN-08 / commit `e774eef07`.
- **WC-FC-5**: `memory-context.ts` field `readiness` renamed to `advisoryPreset` (or removed if always-literal); consumer contract preserved.

### 5.2 Non-Functional

- **WC-NF-1**: All 5 Wave C commits visible in git log with per-task commit messages.
- **WC-NF-2**: Wave C gate `/spec_kit:deep-review :auto` ×7 emits ZERO new P0, ZERO new P1 in the Wave C scope (16-folder sweep outcomes + evidence-marker lint strict mode + session-resume auth).
- **WC-NF-3**: T-CNS-03 sweep produces 16 separate git commits, each with a diff showing fresh `lastUpdated` + `last_save_at`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

### 6.1 Phase Dependencies

- **Depends on**: `../001-infrastructure-primitives/` (Wave A) MERGED — otherwise canonical-save writer still broken and sweep produces no updates.
- **Depends on**: `../002-cluster-consumers/` (Wave B) MERGED — otherwise trust-state vocabulary and research-folder backfill are incomplete.
- **Blocks**: `../004-p2-maintainability/` (Wave D) ship gate.

### 6.2 File Dependencies

- T-EVD-01 depends on T-EVD-01-prep (Wave A §2.5) having rewrapped 170/179 closers in 016 checklist.md.
- T-CNS-03 depends on T-CNS-01 + T-W1-CNS-04 (Wave A §2.1) having fixed the canonical-save writer.
- T-CPN-01, T-W1-MCX-01, T-SRS-BND-01 are file-independent from each other and from T-EVD-01 / T-CNS-03.

### 6.3 Risk Matrix (Wave C scope)

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|-------------|
| T-CNS-03 corrupts 016-foundational or other critical folder | Medium | High | Run on low-risk folder first; per-folder commit; pre-sweep `git stash` of all `026/*/description.json` |
| T-SRS-BND-01 blocks legitimate session-resume flows | Low | High | Permissive-mode flag; verify on canary session before reject-mode |
| T-EVD-01 `--strict` activation fails on un-rewrapped 017/018 folder | Medium | Low | Run lint in warn-mode first; confirm T-EVD-01-prep coverage was complete |
| T-CPN-01 amend clashes with concurrent edit | Low | Low | Small surface; rebase before commit |
| T-W1-MCX-01 breaks `readiness` consumer that wasn't grepped | Low | Medium | `grep -rn 'readiness' handlers/ lib/` + preserve consumer-facing contract with advisory note |
| Mid-sweep failure leaves 7/16 folders updated | Medium | Medium | Per-folder commit; resume from last successful folder; no batch-rollback required |
| Wave A or B regression discovered mid-Wave-C | Low | High | Escalate to parent; HALT sweep; re-open Wave A/B child before continuing |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking at spec-approval time. Parking-lot for Phase 019+:

- OQ-C-1: Should T-CNS-03 sweep also refresh research iteration sub-folders under each 026 sibling, or is that Wave B's T-CNS-02 territory exclusively? (Currently: T-CNS-02 owns research iterations; T-CNS-03 owns top-level 16-sibling folders.)
- OQ-C-2: Canary session definition for T-SRS-BND-01 — does Phase 018 need an isolated test harness, or can a real cli-copilot session serve as canary? (Default: real session, since permissive-mode flag makes it reversible.)
- OQ-C-3: If T-EVD-01 flags legitimate `)` closers in prose (non-evidence contexts), should lint scope be tightened to `^- \[ \]` or `^- \[x\]` line starts only? (Currently: lint targets EVIDENCE markers specifically via regex anchor.)

Escalate via `/spec_kit:deep-research [focused-topic]` if any becomes blocking.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:next-steps -->
## 8. NEXT STEPS

- [ ] Wave A merged (`../001-infrastructure-primitives/` ship gate green)
- [ ] Wave B merged (`../002-cluster-consumers/` ship gate green)
- [ ] Pre-sweep stash: `git stash push -m "pre-017-sweep" -- 026-graph-and-context-optimization/*/description.json`
- [ ] Execute T-EVD-01 (warn-mode first, then strict)
- [ ] Execute T-CPN-01 + T-W1-MCX-01 (file-independent, parallelizable)
- [ ] Execute T-SRS-BND-01 with permissive-mode canary
- [ ] Execute T-CNS-03: 1 test folder first, verify, then 15 sequential
- [ ] Run Wave C gate: `/spec_kit:deep-review :auto` ×7
- [ ] Update `implementation-summary.md` post-completion
<!-- /ANCHOR:next-steps -->

---

<!-- ANCHOR:references -->
## 9. REFERENCES

- Parent spec: `../spec.md`
- Parent plan §4 Wave C: `../plan.md`
- Parent tasks Wave C section: `../tasks.md`
- Parent checklist CHK-C-01..05 + CHK-C-GATE: `../checklist.md`
- Sibling Wave A: `../001-infrastructure-primitives/`
- Sibling Wave B: `../002-cluster-consumers/`
- Sibling Wave D: `../004-p2-maintainability/`
- Operator feedback: `feedback_phase_018_autonomous` (user memory), `feedback_stop_over_confirming` (user memory), `feedback_worktree_cleanliness_not_a_blocker` (user memory)
<!-- /ANCHOR:references -->
