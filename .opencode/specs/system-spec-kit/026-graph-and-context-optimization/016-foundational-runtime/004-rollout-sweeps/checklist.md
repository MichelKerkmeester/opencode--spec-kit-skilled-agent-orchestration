---
title: "Verification Checklist: Phase 017 Wave C — Rollout + Sweeps"
description: "CHK-C-01..05 + CHK-C-GATE verification items for Wave C (5 tasks). All items use canonical `]` evidence-marker closers per T-EVD-01 contract."
trigger_phrases: ["phase 017 wave c checklist", "017 rollout checklist", "chk-c-01", "chk-c-gate"]
importance_tier: "critical"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-foundational-runtime/004-rollout-sweeps"
    last_updated_at: "2026-04-17T14:41:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "Wave C checklist scaffolded from parent checklist.md CHK-C section"
    next_safe_action: "Verify items during Wave C implementation; Phase 1 parallel, Phase 2 staged, Phase 3 sweep"
    blockers: ["Wave A merged", "Wave B merged"]
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->

# Verification Checklist: Phase 017 Wave C — Rollout + Sweeps

<!-- ANCHOR:protocol -->
## Protocol

**Legend**: `[ ]` pending • `[x]` verified (with `[EVIDENCE: <commit-hash> <description>]`) • `[~]` partial • `[!]` blocked

**Evidence marker format**: Every completed item MUST close with `[EVIDENCE: <commit-hash> <description>]` — canonical `]` closer per T-EVD-01 contract. Non-canonical `)` closer will fail T-EVD-01 lint in `--strict` mode.

**Verification ordering**: Execute checks in phase order (Phase 1 → Phase 2 → Phase 3 → Wave C gate). CHK-C-GATE MUST pass before Wave D proceeds.

**Final ship gate**: Wave C contributes to CHK-SHIP-01..04 in parent `../checklist.md`.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

Before starting Wave C, verify prerequisites:

- [ ] Wave A (`../001-infrastructure-primitives/`) MERGED; ship gate green [EVIDENCE: pending]
- [ ] Wave B (`../002-cluster-consumers/`) MERGED; ship gate green [EVIDENCE: pending]
- [ ] T-EVD-01-prep confirmed complete: `grep -c '\[EVIDENCE:.*\)$' 016-foundational-runtime/001-initial-research/checklist.md` returns `0` [EVIDENCE: pending]
- [ ] Pre-sweep backup ready: `git stash push -m "pre-017-sweep" -- 026-graph-and-context-optimization/*/description.json 026-graph-and-context-optimization/*/graph-metadata.json` [EVIDENCE: pending]
- [ ] Canary session target identified for T-SRS-BND-01 [EVIDENCE: pending]
- [ ] Smoke-test folder chosen for T-CNS-03 (low-risk target) [EVIDENCE: pending]
- [ ] `/spec_kit:deep-review :auto` ×7 gate protocol acknowledged (per feedback_phase_018_autonomous.md) [EVIDENCE: pending]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality Gates

Continuous requirements across all 5 Wave C tasks:

- [ ] TypeScript compiles without errors (`npx tsc --noEmit`) after each task [EVIDENCE: pending]
- [ ] No new ESLint violations introduced [EVIDENCE: pending]
- [ ] Vitest suite passes on every commit [EVIDENCE: pending]
- [ ] `validate.sh --strict` on 017/003-rollout-sweeps folder exits 0 after each task [EVIDENCE: pending]
- [ ] No commented-out code blocks left in modified files [EVIDENCE: pending]
- [ ] No TODO comments added without ticket reference [EVIDENCE: pending]
- [ ] Import ordering preserved (no shuffle outside task scope) [EVIDENCE: pending]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Gates

Test-coverage verification:

- [ ] `evidence-marker-lint.vitest.ts` passes with 5+ cases (pass, `)` fail, false-positive avoidance, multi-marker, EVIDENCE-in-prose) [EVIDENCE: pending]
- [ ] `session-resume.vitest.ts` covers accept + reject cases [EVIDENCE: pending]
- [ ] `memory-context.vitest.ts` passes after `readiness` → `advisoryPreset` rename [EVIDENCE: pending]
- [ ] T-CNS-03 16-folder sweep produces observable fresh timestamps in each per-folder commit diff [EVIDENCE: pending]
- [ ] Cumulative regression: `/spec_kit:deep-review :auto` ×7 on Wave C scope — ZERO new P0 / P1 [EVIDENCE: pending]
- [ ] Parent spec FC-2 verified post-sweep: 16/16 folders converge within 10m [EVIDENCE: pending]
- [ ] Parent spec FC-7 verified post-T-SRS-BND-01 reject-mode: mismatch rejected [EVIDENCE: pending]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:security -->
## Security Gates

Security-relevant verification for Wave C:

- [ ] T-SRS-BND-01 — `handleSessionResume` sessionId binding tested with mismatched identities [EVIDENCE: pending]
- [ ] T-SRS-BND-01 canary log preserved for audit [EVIDENCE: pending]
- [ ] No new MCP-args injection surfaces introduced [EVIDENCE: pending]
- [ ] No new JSON.parse sinks without Zod validation [EVIDENCE: pending]
- [ ] T-W1-MCX-01 field rename does not expose privileged state via advisory payload [EVIDENCE: pending]
- [ ] T-CNS-03 sweep does not inadvertently write over user-authored manual fields in any folder [EVIDENCE: pending]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation Gates

Documentation completeness verification:

- [ ] `spec.md` frozen scope matches implementation (no scope creep) [EVIDENCE: pending]
- [ ] `plan.md` phase structure reflects actual execution order [EVIDENCE: pending]
- [ ] `tasks.md` every task has `[EVIDENCE: <commit>]` citation after completion [EVIDENCE: pending]
- [ ] `implementation-summary.md` populated after Wave C completes [EVIDENCE: pending]
- [ ] `description.json.lastUpdated` refreshed post-implementation [EVIDENCE: pending]
- [ ] T-CPN-01 amend visible in closing-pass-notes.md with `[STATUS: RESOLVED 2026-04-17]` tag [EVIDENCE: pending]
- [ ] Wave C handover.md created if iterations span multiple sessions [EVIDENCE: pending]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization Gates

- [ ] New file placed in canonical directory: `.opencode/skill/system-spec-kit/scripts/validation/evidence-marker-lint.ts` [EVIDENCE: pending]
- [ ] No ad-hoc helpers added outside canonical locations [EVIDENCE: pending]
- [ ] Test files co-located with convention (`*.vitest.ts` in `scripts/tests/` or `mcp_server/tests/`) [EVIDENCE: pending]
- [ ] No temporary scratch files left in `scratch/` after Wave C completes [EVIDENCE: pending]
- [ ] Pre-sweep stash dropped only after Wave C gate passes [EVIDENCE: pending]
<!-- /ANCHOR:file-org -->

---

## Wave C Task Verification

### CHK-C-01 — T-EVD-01 landed
- [ ] `scripts/validation/evidence-marker-lint.ts` exists [EVIDENCE: pending]
- [ ] Asserts `[EVIDENCE: ...]` closes with `]` (not `)`) [EVIDENCE: pending]
- [ ] `--strict` mode exits 1 on `)` closer [EVIDENCE: pending]
- [ ] Wired into `validate.sh` [EVIDENCE: pending]
- [ ] All 16 sibling 026 spec folders pass the lint post T-CNS-03 sweep [EVIDENCE: pending]
- [ ] Vitest 5+ cases pass [EVIDENCE: pending]

### CHK-C-02 — T-CNS-03 landed (16-folder sweep)
- [ ] Pre-sweep backup stash committed: `git stash list` shows `pre-017-sweep` entry [EVIDENCE: pending]
- [ ] Smoke-folder sweep verified: `jq '.lastUpdated' description.json` returns fresh time [EVIDENCE: pending]
- [ ] Smoke-folder committed as standalone commit before proceeding [EVIDENCE: pending]
- [ ] Remaining 15 folders swept sequentially [EVIDENCE: pending]
- [ ] Per-folder commits visible in git log with `chore(017): T-CNS-03 ...` prefix (16 commits total) [EVIDENCE: pending]
- [ ] Final verification: 16/16 folders have `lastUpdated ≤ derived.last_save_at + 10m` [EVIDENCE: pending]

### CHK-C-03 — T-CPN-01 landed
- [ ] `closing-pass-notes.md:72-88` CP-002 section marked `[STATUS: RESOLVED 2026-04-17]` [EVIDENCE: pending]
- [ ] Cites T-PIN-08 / commit `e774eef07` [EVIDENCE: pending]
- [ ] Diff review confirms no content changes beyond status tag + citation [EVIDENCE: pending]

### CHK-C-04 — T-W1-MCX-01 landed
- [ ] `readiness` field renamed to `advisoryPreset` in `StructuralRoutingNudgeMeta` (or removed if always-literal) [EVIDENCE: pending]
- [ ] `grep -rn '\\breadiness\\b' mcp_server/handlers/memory-context.ts` returns 0 or documented residual [EVIDENCE: pending]
- [ ] Consumer-facing contract preserved (or explicit advisory note added) [EVIDENCE: pending]
- [ ] TypeScript compiles [EVIDENCE: pending]

### CHK-C-05 — T-SRS-BND-01 landed (staged rollout)
- [ ] `handleSessionResume` rejects mismatched `args.sessionId` vs caller MCP identity [EVIDENCE: pending]
- [ ] Permissive-mode flag exists with default ON during canary [EVIDENCE: pending]
- [ ] Canary log records at least 1 accept + 1 reject outcome [EVIDENCE: pending]
- [ ] Permissive-mode flag flipped OFF post-canary, committed to main [EVIDENCE: pending]
- [ ] Vitest covers accept + reject cases [EVIDENCE: pending]
- [ ] `lifecycle-tools.ts:67` wired to new auth contract [EVIDENCE: pending]

### CHK-C-GATE — Wave C gate passed
- [ ] `/spec_kit:deep-review :auto` ×7 on Wave C scope emits 0 new P0, 0 new P1 [EVIDENCE: pending]
- [ ] `validate.sh --strict` on `003-rollout-sweeps` folder exits 0 with 0 warnings [EVIDENCE: pending]
- [ ] 16-folder sweep verified end-to-end [EVIDENCE: pending]
- [ ] Session-resume auth canary + reject-mode flip confirmed [EVIDENCE: pending]
- [ ] All 5 Wave C tasks have per-task commits visible in git log [EVIDENCE: pending]

---

<!-- ANCHOR:summary -->
## Summary Gate

Final summary verification (end of Wave C):

- [ ] All 6 ANCHOR:security items verified [EVIDENCE: pending]
- [ ] All 7 ANCHOR:docs items verified [EVIDENCE: pending]
- [ ] All 5 ANCHOR:file-org items verified [EVIDENCE: pending]
- [ ] All 5 CHK-C-* task checks green [EVIDENCE: pending]
- [ ] CHK-C-GATE green (×7 deep-review + strict validator) [EVIDENCE: pending]
- [ ] Final validator run: `validate.sh --strict` on 017/003-rollout-sweeps folder exits 0 with 0 warnings [EVIDENCE: pending]
- [ ] Parent spec FC-2 + FC-7 both satisfied by Wave C outcomes [EVIDENCE: pending]
- [ ] Wave D (`../004-p2-maintainability/`) cleared to proceed [EVIDENCE: pending]
<!-- /ANCHOR:summary -->

---

## Summary counts

| Category | Items | Status |
|----------|-------|--------|
| Pre-implementation | 7 | 0/7 |
| Code quality gates | 7 | 0/7 |
| Testing gates | 7 | 0/7 |
| Security gates | 6 | 0/6 |
| Documentation gates | 7 | 0/7 |
| File organization gates | 5 | 0/5 |
| CHK-C-01..05 (Wave C tasks) | 5 groups (24 items) | 0/24 |
| CHK-C-GATE | 5 | 0/5 |
| Summary gate | 8 | 0/8 |
| **Total verification items** | **~81 CHK items across 9 groups** | **0/81 verified** |
