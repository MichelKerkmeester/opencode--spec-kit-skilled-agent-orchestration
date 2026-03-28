---
title: "Implementation Plan: 020 Pre-Release Remediation [template:level_3/plan.md]"
description: "Execution plan for closing the canonical review findings captured under 020-pre-release-remediation/review/, while recording seven narrow landed slices without overstating broader closure."
trigger_phrases:
  - "020 plan"
  - "post-review remediation plan"
  - "canonical review implementation plan"
importance_tier: "high"
contextType: "general"
---
# Implementation Plan: 020 Pre-Release Remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown packet docs coordinating TypeScript runtime, tests, validators, wrappers, and feature-catalog remediation |
| **Framework** | system-spec-kit remediation packet driven by the canonical review in `review/` |
| **Storage** | Spec packet docs under `020-pre-release-remediation/`; runtime and test surfaces under `.opencode/skill/system-spec-kit/` |
| **Testing** | `validate.sh`, `validate.sh --recursive`, `npm test`, and targeted Vitest subsets from the canonical review |

### Overview

This plan turns the canonical review into an execution sequence. The current review baseline is still `FAIL` as of **2026-03-27**. Implementation is now in progress for seven narrow remediation slices: `.opencode/skill/system-spec-kit/mcp_server/scripts/map-ground-truth-ids.ts` has been converted into a thin compatibility wrapper that delegates to `../../scripts/dist/evals/map-ground-truth-ids.js`; `.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts` now records the landed `formatters/search-results.js` extended limit at `536` with the adjacent actual-count note updated to `536`; the Spec Kit memory DB received an initial conservative causal-graph hygiene pass that pruned only qualifying deprecated-to-deprecated `supports` hubs after creating safety checkpoints; a second conservative causal-graph hygiene pass then targeted archived deprecated supports-only hubs by deleting only `supports` edges where the source memory is `deprecated`, the source `spec_folder` contains `z_archive`, and the source has zero remaining `supports` targets outside `deprecated`; and a third, narrower causal-graph hygiene pass then targeted only deprecated broadcaster nodes `24743`, `24981`, `24982`, `24983`, and `24984`. In that third pass, checkpoints `pre-targeted-broadcaster-prune-global-20260328-0933` and `pre-targeted-broadcaster-prune-20260328-0933` were created; pruning all outgoing `supports` from those five nodes deleted `58` edges total (`24743=11`, `24981=13`, `24982=12`, `24983=11`, `24984=11`); pre-delete validation confirmed zero outgoing `caused` edges and a target-tier mix of `50 deprecated`, `8 normal`, `0` critical/important/constitutional, with the only non-deprecated targets being repeated links to manual-testing nodes `25560` and `25561`; and post-prune graph health stayed green at `2898` total edges, `2012` supports, `886` caused, `76.88%` coverage, `0` orphaned edges, and `2409` indexed memories. These slices are real and verified, but broader workstreams remain staged pending further execution, exact per-node follow-up, targeted cleanup, and fresh rerun evidence.

The sixth and seventh landed slices narrow the follow-up mode further: instead of broad pruning, cleanup now proceeds case by case. The first single-node action inspected and pruned node `24980` (`Implementation Summary - Voyage 4 Upgrade [067-voyage-4-upgrade/implementation-summary]`) after creating checkpoints `pre-node-24980-prune-global-20260328-1009` and `pre-node-24980-prune-20260328-1009`. Pre-delete inspection found exactly `13` outgoing `supports` edges, `0` outgoing `caused` edges, and a target mix of `11 deprecated`, `2 normal`, `0` critical/important/constitutional, with the only normal targets `25559` and `25560`. After deleting those `13` outgoing `supports` edges, six synthetic orphan test edges (`5436`-`5441`) reappeared in graph health and were immediately removed as contamination cleanup. Final post-cleanup verification stayed healthy at `2885` total edges, `1999` supports, `886` caused, `76.42%` coverage, `0` orphaned edges, `2417` indexed memories, and `memory_drift_why(24980)` showing no remaining causal relationships.

The second single-node action then continued the same case-by-case cleanup on node `25027` (`Verification Checklist: Foundation Package [001-foundation-phases-0-1-1-5/checklist]`, `checklist`, `deprecated`, spec folder `02--system-spec-kit/z_archive/020-mcp-working-memory-hybrid-rag/001-foundation-phases-0-1-1-5`) after creating checkpoints `pre-node-25027-prune-global-20260328-1043` and `pre-node-25027-prune-20260328-1043`. Pre-delete inspection found exactly `10` outgoing `supports` edges, `0` outgoing `caused` edges, and a target mix of `9 deprecated`, `1 normal`, `0` critical/important/constitutional, with the only normal target `25195` (`T008: lastDbCheck advancement`). After deleting those `10` outgoing `supports` edges, final post-cleanup verification stayed healthy at `2875` total edges, `1989` supports, `886` caused, `76.42%` coverage, `0` orphaned edges, and `2417` indexed memories, while `memory_drift_why(25027)` now shows only inbound/support context and no outgoing causal graph fan-out. This remains a narrow graph-hygiene/usefulness slice only: `25027` no longer acts as a broadcaster, `24980` remains fully disconnected, `24742` still reflects sink-heavy historical lineage, active `25860` remains semantically noisy but connected, `review/review-report.md` stays authoritative, and the overall verdict remains `FAIL`.

The work is organized into four review-driven remediation workstreams:

- **WS-1** Runtime/code integrity
- **WS-2** Packet/spec docs truth-sync
- **WS-3** Public docs and wrapper alignment
- **WS-4** Feature verification and tooling contract repair

The active finding load that drives this plan is:

- `14` active `P1`
- `16` active `P2`
- feature-state baseline `191 / 48 / 7 / 9`
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] The canonical review in [`review/review-report.md`](./review/review-report.md) has been read as the authoritative source
- [x] The current packet docs (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`) have been re-anchored to the canonical review
- [x] The normalized feature-state denominator (`255` features, `21` categories, `191/48/7/9`) is known
- [x] The packet records seven evidence-backed narrow remediation slices as landed while the broader backlog remains staged or unchecked

### Definition of Done

- [ ] All `P1` findings are fixed or explicitly reclassified by fresh evidence
- [ ] All `P2` findings are fixed, verified, or explicitly accepted with rationale
- [ ] Packet/spec docs, wrapper docs, public docs, and feature-catalog verification surfaces are synchronized to the post-remediation truth
- [ ] Fresh reruns update the canonical review surfaces and support any verdict change
<!-- /ANCHOR:quality-gates -->

---

### AI Execution Protocol

### Pre-Task Checklist

- Confirm the edit stays inside the approved `020-pre-release-remediation` remediation scope.
- Read the canonical `review/review-report.md` and the packet docs before changing wording or status markers.
- Keep runtime, wrapper, and review-surface claims tied to fresh validator or test evidence.
- Re-run the relevant validators before reporting progress.

### Execution Rules

| Rule ID | Rule | Why |
|---------|------|-----|
| AI-SEQ-001 | Execute WS-2 before declaring any packet-level release-story improvement | Packet truth-sync is the prerequisite for trustworthy release-control language |
| AI-SCOPE-001 | Do not treat the historical top-level `review-report.md` as current review authority | The canonical findings live under `review/` |
| AI-EVID-001 | Only mark remediation steps complete when validator or test evidence exists | Prevents synthetic closure |
| AI-COORD-001 | Keep packet, wrapper, and public-doc edits synchronized when they share the same denominator or release claim | Avoids reintroducing drift across surfaces |

### Status Reporting Format

- Start state: which findings or workstream items are being touched.
- Work state: which packet or wrapper files changed and what evidence was refreshed.
- End state: validator and test outcomes, plus any remaining blockers.

### Blocked Task Protocol

1. If a file still points at missing or retired packet names, correct the packet-local truth before expanding scope.
2. If validator output conflicts with packet prose, preserve the validator truth and record the contradiction explicitly.
3. If a needed fix falls outside the approved ownership set, stop at the boundary and report the exact blocker.

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Canonical-review-driven remediation packet

### Key Components

- **`review/review-report.md`**: authoritative finding registry, workstreams, baselines, and severity
- **`spec.md`**: remediation contract and scope boundary
- **`plan.md`**: workstream order, phase sequencing, and verification strategy
- **`tasks.md`**: executable backlog that maps every active finding to implementation work
- **`checklist.md`**: verification gates for implementation time
- **Runtime/test surfaces**: the TypeScript handlers, libs, tests, wrappers, and feature-catalog files named by the review findings

### Data Flow

1. The canonical review defines the active finding registry and baseline truth.
2. This packet translates those findings into workstreams, tasks, and checklist gates.
3. Implementation happens by workstream after approval.
4. Fresh reruns update the canonical review artifacts and any release-control verdict change.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 0: Approval Hold And Baseline Replay

- [ ] Confirm implementation go-ahead before changing runtime, wrapper, or public docs
- [ ] Replay the current baseline gates so implementation starts from known evidence
- [ ] Keep the packet verdict `FAIL` until later reruns justify any replacement

### Phase 1: WS-2 Packet/Spec Docs Truth-Sync

- [ ] Fix packet-local validator drift, packet-story contradictions, and canonical review boundary issues inside `012`
- [ ] Update parent-lineage references that still point at retired packet names
- [ ] Keep packet-local release-control wording aligned to the canonical review and fresh validator outputs

### Phase 2: WS-1 Runtime/Code Integrity

- [x] Refresh the modularization guard in `.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts` so `formatters/search-results.js` uses extended limit `536` and adjacent actual-count note `536`; verify with `npx vitest run tests/modularization.vitest.ts`, `timeout 180 npm run test:core`, and `python3 .opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py --root .opencode/skill/system-spec-kit`
- [x] Execute a conservative causal-graph hygiene pass in the Spec Kit memory DB by creating safety checkpoints `pre-supports-hub-prune-global-20260328-0910` and `pre-supports-hub-prune-20260328-0910`, then deleting only deprecated-to-deprecated `supports` edges from qualifying high-fanout deprecated hubs; verify `585` candidate edges across `44` source hubs and `78` target folders were deleted, `spec_kit_memory_memory_causal_stats` remained healthy at `3104` total edges with `0` orphaned edges, `spec_kit_memory_memory_health` remained healthy at `2409` indexed memories, `408` deprecated-to-deprecated `supports` edges still remain, and noisy archived/deprecated cleanup candidates were preserved for follow-up analysis rather than treated as closed. `[Supports: narrow graph-hygiene/usefulness slice only; no canonical finding closure or verdict change]`
- [x] Execute a second conservative archived-supports hygiene pass in the Spec Kit memory DB by creating safety checkpoints `pre-archive-supports-prune-global-20260328-0921` and `pre-archive-supports-prune-20260328-0921`, then deleting only `supports` edges where the source memory is `deprecated`, the source `spec_folder` contains `z_archive`, and the source has zero remaining `supports` targets outside `deprecated`; verify `148` candidate edges across `23` source hubs touching `36` target folders were deleted, `spec_kit_memory_memory_causal_stats` remained healthy at `2956` total edges, `2070` supports, `886` caused, `77.04%` coverage, and `0` orphaned edges, `spec_kit_memory_memory_health` remained healthy at `2409` indexed memories, `260` deprecated-to-deprecated `supports` edges still remain, and the per-node action-table follow-up stays limited to prune-outgoing-only hubs `24743`, `24981`, `24982`, `24983`, `24984` plus historical-lineage hubs `24742`, `24986`, `24987`, `24989`, `24992`, `24993`, `24994`, `24729`, `24734`, `24736`. `[Supports: narrow graph-hygiene/usefulness slice only; no canonical finding closure or verdict change]`
- [x] Execute a third conservative targeted-broadcaster hygiene pass in the Spec Kit memory DB by creating safety checkpoints `pre-targeted-broadcaster-prune-global-20260328-0933` and `pre-targeted-broadcaster-prune-20260328-0933`, then deleting only outgoing `supports` from deprecated broadcaster nodes `24743`, `24981`, `24982`, `24983`, and `24984`; verify pre-delete scope at `58` edges total (`24743=11`, `24981=13`, `24982=12`, `24983=11`, `24984=11`), zero outgoing `caused` edges from those five nodes, target-tier mix `50 deprecated`, `8 normal`, `0` critical/important/constitutional, only repeated non-deprecated targets `25560` and `25561`, and post-prune health at `2898` total edges, `2012` supports, `886` caused, `76.88%` coverage, `0` orphaned edges, and `2409` indexed memories. `[Supports: narrow graph-hygiene/usefulness slice only; keep review/review-report authoritative and overall verdict FAIL; no canonical finding closure]`
- [x] Switch the next graph-hygiene follow-up from broad pruning to case-by-case cleanup by inspecting deprecated node `24980` (`Implementation Summary - Voyage 4 Upgrade [067-voyage-4-upgrade/implementation-summary]`) and deleting only its `13` outgoing `supports` edges after creating checkpoints `pre-node-24980-prune-global-20260328-1009` and `pre-node-24980-prune-20260328-1009`; verify pre-delete scope at exactly `13` outgoing `supports`, `0` outgoing `caused`, and target mix `11 deprecated`, `2 normal`, `0` critical/important/constitutional with only normal targets `25559` and `25560`, then remove the six reappearing synthetic orphan test edges `5436`-`5441` as contamination cleanup and confirm final healthy state at `2885` total edges, `1999` supports, `886` caused, `76.42%` coverage, `0` orphaned edges, `2417` indexed memories, and `memory_drift_why(24980)` showing no remaining relationships. `[Supports: narrow graph-hygiene/usefulness slice only; keep review/review-report authoritative and overall verdict FAIL; no canonical finding closure]`
- [ ] Fix scope loss in save dedup and PE arbitration
- [ ] Close constitutional cache, custom-path DB integrity, session trust, bulk-delete contract, tool-cache, and logging defects
- [ ] Land the missing direct regression coverage the review identified while runtime fixes are touched

### Phase 3: WS-3 Public Docs And Wrapper Alignment

- [x] Land the `map-ground-truth-ids` compatibility-wrapper fix by delegating `mcp_server/scripts/map-ground-truth-ids.ts` to `../../scripts/dist/evals/map-ground-truth-ids.js`; verify with `npm run check --workspace=scripts` in `.opencode/skill/system-spec-kit` and `python3 .opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py --root .opencode/skill/system-spec-kit`
- [ ] Refresh public README and install surfaces against live repo truth
- [ ] Rebuild wrapper denominators and status claims for `006`, `015`, and root hygiene surfaces
- [ ] Clear release-surface warnings that still block trustworthy release-control summaries

### Phase 4: WS-4 Feature Verification And Tooling Contract Repair

- [ ] Fix the `/memory:learn` docs-alignment regression
- [ ] Repair mismatched feature entries and duplicate ordinals
- [ ] Reduce the under-tested block with direct tests, static proof, or explicit deferrals

### Phase 5: Verification And Release-Control Sync

- [ ] Replay targeted subsystem subsets after each wave
- [ ] Re-run `012` local validation, root `022 --recursive`, and `npm test`
- [ ] Update the canonical `review/` artifacts and packet-local summaries from fresh evidence only
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Baseline replay | Reproduce the current `FAIL/PASS/PASS` review baseline before implementation | `validate.sh`, `validate.sh --recursive`, `npm test` |
| Runtime regression | Save, scope, cache, lifecycle, query, and logging fixes | Targeted Vitest subsets plus any new focused tests |
| Wrapper and public-doc validation | `006`, `015`, root README/install, root 019/020, root 022 plan | Local file review plus packet validators where applicable |
| Feature verification | mismatched and under-tested feature entries | Targeted Vitest, source-audit proof, and explicit deferral notes |
| Final release-gate verification | Full packet and tree-level release sync | `validate.sh`, `validate.sh --recursive`, `npm test` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `review/review-report.md` | Internal | Green | The backlog loses its authoritative finding map |
| Runtime modules and tests cited by `HRF-DR-010` through `HRF-DR-026` | Internal | Green | Runtime findings cannot be remediated or re-verified |
| Public and wrapper docs cited by `HRF-DR-004` through `HRF-DR-009` | Internal | Green | Release surfaces remain untrustworthy |
| Feature catalog and scripts surfaces cited by `HRF-DR-027` through `HRF-DR-030` | Internal | Green | Feature verification debt and tooling drift remain open |
| Validator tooling under `.opencode/skill/system-spec-kit/scripts/spec/` | Internal | Green | The packet cannot prove closure honestly |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A remediation wave creates contradictions with the canonical review, regresses the validator baseline, or introduces new unplanned release blockers.
- **Procedure**: Revert the affected workstream changes, restore the last known good packet/runtime state, replay the baseline gates, and update the packet docs with the actual rollback disposition.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Approval hold and baseline replay | This documentation pass | All implementation phases |
| WS-2 packet/spec truth-sync | Approval hold | Final release-control sync |
| WS-1 runtime/code integrity | Approval hold | Final release-control sync |
| WS-3 public docs and wrapper alignment | Approval hold; may partially depend on WS-1 outputs | Final release-control sync |
| WS-4 feature verification and tooling repair | Approval hold; depends on WS-1 and WS-3 for some evidence | Final release-control sync |
| Verification and release-control sync | WS-1 through WS-4 completion or explicit deferral set | Verdict replacement |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Approval hold and baseline replay | Low | 0.25-0.5 day |
| WS-2 packet/spec truth-sync | Medium | 0.5-1.5 days |
| WS-1 runtime/code integrity | High | 2-5 days |
| WS-3 public docs and wrapper alignment | Medium | 1-2 days |
| WS-4 feature verification and tooling repair | High | 1-3 days |
| Verification and release-control sync | Medium | 0.5-1 day |
| **Total** | | **5.25-13 days** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [ ] The canonical review still matches the active remediation backlog
- [ ] No workstream has silently changed the verdict without rerun evidence
- [ ] Public, wrapper, and feature-catalog surfaces remain traceable to live filesystem truth

### Rollback Procedure

1. Revert the affected remediation wave.
2. Replay the baseline gates for the impacted subsystem or packet surfaces.
3. Update `review/` and packet-local summaries so the rollback is explicit and evidence-backed.

### Data Reversal

- **Has data migrations?** Possibly, depending on runtime fixes
- **Reversal procedure**: Any runtime migration or storage-surface change must define its own bounded reversal steps before landing
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
canonical review in review/
          |
          v
spec + plan + tasks + checklist
          |
          v
 approval + baseline replay
          |
          v
 WS-2 packet truth-sync ----\
 WS-1 runtime fixes ---------+--> targeted reruns --> final gates --> verdict review
 WS-3 public/wrapper docs ---/
 WS-4 feature/tooling repair /
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Review-driven backlog | Canonical review report | Execution-ready packet docs | Implementation start |
| Runtime/code remediation | WS-1 tasks | Fixed source/test surfaces | Final release sync |
| Docs and wrapper remediation | WS-2 and WS-3 tasks | Trustworthy packet/public surfaces | Final release sync |
| Feature verification remediation | WS-4 tasks | Reduced mismatch/under-tested block | Final release sync |
| Final reruns | Completed or explicitly deferred workstreams | Updated release-control truth | Verdict replacement |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Replay baseline and confirm implementation order after approval** - CRITICAL
2. **Close WS-2 packet truth drift so the packet can report remediation honestly** - CRITICAL
3. **Fix the WS-1 runtime `P1` findings and their direct verification debt** - CRITICAL
4. **Repair WS-3/WS-4 release-surface and feature-verification blockers** - CRITICAL
5. **Replay final gates and update release-control truth from fresh evidence** - CRITICAL

**Parallel Opportunities**:
- WS-3 and WS-4 can run partly in parallel once the shared baselines are replayed.
- Some WS-2 packet truth-sync edits can happen alongside WS-1 runtime fixes if they do not depend on final rerun output.
- Under-tested feature reduction can be parallelized by catalog cluster during WS-4.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Review-driven packet staged | `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` all align to the canonical review | Current doc pass |
| M2 | Packet truth-sync wave complete | `012` packet truth and lineage blockers are closed or explicitly re-verified | WS-2 |
| M3 | Runtime/code blockers closed | Active WS-1 `P1` findings are fixed and directly re-tested | WS-1 |
| M4 | Release surfaces and feature verification repaired | WS-3 and WS-4 findings are fixed, deferred with rationale, or materially reduced | WS-3 / WS-4 |
| M5 | Fresh gate truth captured | Final reruns update the packet and justify any verdict change | Phase 5 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

- **ADR-012-R1**: This packet now follows the canonical `review/` report instead of the historical top-level report.
- **ADR-012-R2**: The remediation program is grouped by workstream rather than by predecessor packet lineage.
- **ADR-012-R3**: The packet remains in active remediation, with only seven narrow landed slices recorded so far: the `map-ground-truth-ids` compatibility-wrapper slice, the modularization test-budget slice, the first conservative causal-graph hygiene slice, the second archived-supports hygiene slice, the third targeted-broadcaster hygiene slice, the node-`24980` case-by-case cleanup slice, and the node-`25027` case-by-case cleanup slice.
