---
title: "...t/026-graph-and-context-optimization/007-deep-review-remediation/research/007-deep-review-remediation-pt-05/research]"
description: "This 10-iteration pass found that 007-deep-review-remediation now mixes three different realities: real unresolved P0/P1 blockers, shipped remediation packets whose task/checkli..."
trigger_phrases:
  - "026"
  - "graph"
  - "and"
  - "context"
  - "optimization"
  - "research"
  - "007"
  - "deep"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/research/007-deep-review-remediation-pt-05"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["research.md"]
---
# Deep Research — 007-deep-review-remediation

## Summary
This 10-iteration pass found that `007-deep-review-remediation` now mixes three different realities: real unresolved P0/P1 blockers, shipped remediation packets whose task/checklist surfaces were never synchronized, and newer hook/daemon parity drift that the original backlog no longer models. Phase 020 and Phase 026 both contain strong evidence that implementation landed, but their packet metadata still reads as unstarted or draft. The `005-006` family is more mixed: some children are complete, some are stale, and some still carry real blocked P0/P1 work that depends on historical source-packet rewrites. Cross-phase review against `009-hook-package` shows that some old `007/001` status tasks are now stale, but at least one remains live and two newer 009 regressions are missing from the backlog entirely. CocoIndex semantic search was attempted for unfamiliar code surfaces, but runtime-cancelled calls forced exact file reads as fallback.

## Scope
The investigation covered the phase root docs for `007-deep-review-remediation`, all nested sub-packet spec surfaces (`spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, `checklist.md`, `decision-record.md` where present), and targeted sibling docs under `009-hook-package` for cross-phase reasoning. It also inspected selected runtime/workflow code for live status-related tasks, including `collect-session-data.ts`, `spec_kit_complete_confirm.yaml`, and the deep-review workflow YAML. The goal was not to re-review every historical finding, but to identify which P0/P1 items are still real, which packets are stale, and where the `007` backlog has drifted away from the current 009 parity state.

## Key Findings
### P0
- `005-006-campaign-findings-remediation/001-graph-and-metadata-quality` still has a live P0 blocker (`CF-108`) because strict validation reproduces and the required fix sits in historical source packets outside the prior worker's write authority. This is not packet-staleness; it is unresolved blocker debt. Evidence: [iteration-06.md](./iterations/iteration-06.md), `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/005-006-campaign-findings-remediation/001-graph-and-metadata-quality/checklist.md:59`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/005-006-campaign-findings-remediation/001-graph-and-metadata-quality/checklist.md:66`

### P1
- Phase 020 is effectively shipped but administratively stale. Its implementation summary says `R1-R11` shipped and `116/116` scoped tests passed, while `tasks.md` still starts at `Begin T-AUD-01` with every wave unchecked and the parent map still shows `Spec Ready`. Evidence: [iteration-02.md](./iterations/iteration-02.md), `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/002-cli-executor-remediation/implementation-summary.md:3`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/002-cli-executor-remediation/tasks.md:13`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/spec.md:100`
- Phase 026 is internally contradictory. The spec/continuity surface still says draft/zero-percent/awaiting dispatch, but the task ledger and implementation summary show T01-T12 closed with evidence. Evidence: [iteration-04.md](./iterations/iteration-04.md), `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/004-r03-post-remediation/spec.md:38`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/004-r03-post-remediation/tasks.md:10`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/004-r03-post-remediation/implementation-summary.md:33`
- The old `001-deep-review-and-remediation` status-cleanup backlog is partially stale against current `009` truth. `009/003` now looks complete, so T030/T032/T033 are likely superseded; however `009/001` is still advertised as `Complete` by the `009` parent while its child checklist remains fully pending, so T031 remains live. Evidence: [iteration-07.md](./iterations/iteration-07.md), `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/spec.md:106`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/spec.md:108`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/001-skill-advisor-hook-surface/checklist.md:36`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/003-hook-parity-remediation/graph-metadata.json:74`
- `007` has drifted behind newer `009` parity outcomes. The current `009` parent says child `006` is still in progress and children `010`/`011` were reverted and must be reapplied, but the old `007/001` status-cleanup workstream does not model those states at all. Evidence: [iteration-08.md](./iterations/iteration-08.md), `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/spec.md:111`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/spec.md:115`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/implementation-summary.md:78`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/implementation-summary.md:79`
- Two cross-cutting status/code issues still appear live. `determineSessionStatus()` still auto-completes clean/high-activity sessions without explicit completion proof, and `spec_kit_complete_confirm.yaml` still routes "`Dispatch @debug`" to `general-purpose` instead of `debug`. Evidence: [iteration-09.md](./iterations/iteration-09.md), `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:443`, `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:524`, `.opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml:920`, `.opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml:929`
- `005-006-campaign-findings-remediation/002-spec-structure-and-validation` still carries live P1 debt because recursive validation depends on historical packet doc repairs outside allowed authority, even though local no-recursive validation passes. Evidence: [iteration-06.md](./iterations/iteration-06.md), `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/005-006-campaign-findings-remediation/002-spec-structure-and-validation/checklist.md:59`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/005-006-campaign-findings-remediation/002-spec-structure-and-validation/checklist.md:61`

### P2
- The `005-006` parent packet is now a stale roll-up surface: it stays globally `Draft` with `0/165` verified even though at least one child (`010`) is fully complete and another (`009`) has a fully closed checklist but a stale draft spec. Evidence: [iteration-05.md](./iterations/iteration-05.md), `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/005-006-campaign-findings-remediation/checklist.md:102`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/005-006-campaign-findings-remediation/009-security-and-guardrails/spec.md:39`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/005-006-campaign-findings-remediation/010-telemetry-measurement-and-rollout-controls/spec.md:39`
- Phase 025's remaining unchecked items are mostly integration/performance follow-through and admin closeout, not unremediated scoped findings. Evidence: [iteration-03.md](./iterations/iteration-03.md), `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/003-deep-review-remediation/checklist.md:70`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/003-deep-review-remediation/tasks.md:74`

## Evidence Trail
- [iteration-02.md](./iterations/iteration-02.md): captured the Phase 020 contradiction between `"All eleven ... remediations"` in the summary and `next_safe_action: "Begin T-AUD-01"` in `tasks.md`.
- [iteration-04.md](./iterations/iteration-04.md): showed Phase 026 saying `"Awaiting 12 sequential cli-copilot dispatches"` while T01-T12 were already checked and logged as `Closed`.
- [iteration-06.md](./iterations/iteration-06.md): identified the hard blocker line `CF-108 [P0] Blocked` plus the write-authority limitation that keeps it unresolved.
- [iteration-07.md](./iterations/iteration-07.md): separated stale `009/003` cleanup tasks from the still-live `009/001` mismatch.
- [iteration-08.md](./iterations/iteration-08.md): surfaced the newer `009` parent truth that `010` and `011` are `"Reverted - Reapply Required"`.
- [iteration-09.md](./iterations/iteration-09.md): tied the live code concerns directly to `collect-session-data.ts:443-447`, `collect-session-data.ts:524-525`, and `spec_kit_complete_confirm.yaml:928-929`.

## Recommended Fixes
- `[P0][005-006 blocked historical docs]` Open a write-authorized follow-up that can edit the historical source packets needed for CF-108 and CF-207, or formally defer them in an ADR if those packets are intentionally immutable.
- `[P1][007/002 packet sync]` Close Phase 020 administratively: update `tasks.md`, child spec status, and the parent phase map to match the shipped implementation summary and narrow deferred list.
- `[P1][007/004 packet sync]` Reconcile Phase 026 scaffold metadata with its completed task/summary evidence; either mark it implemented-with-verification-pending or rerun the remaining integration checks and close it fully.
- `[P1][runtime correctness]` Fix `determineSessionStatus()` so clean-repo/high-activity heuristics cannot claim completion without explicit completion evidence, and add regression tests that fail on false-positive completion.
- `[P1][/complete workflow]` Change `spec_kit_complete_confirm.yaml` to dispatch the `debug` subagent rather than `general-purpose`, and add parity coverage so this drift cannot recur silently.
- `[P1][007/001 backlog re-baseline]` Prune superseded 009 cleanup tasks (for example T030/T032/T033/T056), keep T031 live, and import the actual 009 parent risks now advertised by 006/010/011.
- `[P2][005-006 roll-up hygiene]` Add a parent roll-up rule for mixed child states so completed sub-phases are visible without pretending the entire `005-006` packet is done.

## Convergence Report
The loop reached useful synthesis after 10 iterations, but it did not hit the strict early-stop threshold of two consecutive `newInfoRatio < 0.05` iterations. The highest-yield iterations were 2, 4, 7, and 9 because they each converted a vague "maybe stale" suspicion into a specific contradiction or live-code finding. Iterations 5 and 6 separated true blockers from parent-roll-up noise, which was important before prioritization. Iterations 8 through 10 mostly consolidated drift introduced after `009` landed and turned the research into a narrower remediation plan. Net result: partial convergence with clear next actions, not exhaustive closure of every historical sub-finding.

## Open Questions
- Which team or packet owns the historical source-packet rewrites required to clear CF-108 and CF-207?
- Are `009-hook-package/010` and `011` already being actively reapplied elsewhere, or do they need to be brought explicitly into the next `007` remediation phase?
- Should `001-deep-review-and-remediation` remain an active backlog source after re-baselining, or should it be archived as a historical review ledger?
- Which Phase 026 integration checks were actually run but never synchronized back into its checklist and parent summary?

## References
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/implementation-summary.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/001-deep-review-and-remediation/tasks.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/002-cli-executor-remediation/{spec.md,tasks.md,implementation-summary.md}`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/003-deep-review-remediation/{tasks.md,checklist.md,implementation-summary.md}`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/004-r03-post-remediation/{spec.md,tasks.md,checklist.md,implementation-summary.md}`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/005-006-campaign-findings-remediation/**`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/{spec.md,implementation-summary.md,001-skill-advisor-hook-surface/checklist.md,003-hook-parity-remediation/spec.md,003-hook-parity-remediation/graph-metadata.json}`
- `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/collect-session-data.vitest.ts`
- `.opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`
- CocoIndex semantic-search attempts were cancelled by the runtime during this session, so unfamiliar code-path checks used exact `rg`/`nl` fallback reads instead.
