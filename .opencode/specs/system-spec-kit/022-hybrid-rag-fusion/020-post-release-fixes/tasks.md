---
title: "Tasks: 020 Pre-Release Remediation [system-spec-kit/022-hybrid-rag-fusion/020-post-release-fixes/tasks]"
description: "tasks document for 020-post-release-fixes."
trigger_phrases:
  - "tasks"
  - "020"
  - "pre"
  - "release"
  - "remediation"
  - "post"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: 020 Pre-Release Remediation

<!-- ANCHOR:notation -->
## Task Notation

- This is the active remediation backlog generated from the canonical review in [`review/review-report.md`](./review/review-report.md).
- Most remediation items below remain `[ ]` while the broader remediation program is still staged. Seven narrow slices are recorded as `[x]` below from fresh evidence, and none changes the overall `FAIL` verdict.
- Primary IDs in this file use the `RT###` format.
- Each task cites the canonical finding IDs it is meant to close, reduce, or re-verify.
- The historical top-level `review-report.md` in this folder is provenance only and is not the task source of truth.

### Coverage Summary

| Source | Active Count | Representation In This File |
|--------|--------------|-----------------------------|
| Canonical `P1` findings | 14 | Mapped across `RT001-RT018`, `RT030`, and verification tasks |
| Canonical `P2` findings | 16 | Mapped across `RT010-RT018`, `RT020-RT023`, `RT031-RT033`, and verification tasks |
| Review workstreams | 4 | Preserved as sections 1 through 4 below |
| Feature-state baseline | `191 / 48 / 7 / 9` | Preserved as planning context for WS-4 and final verification |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] RT000 Confirm explicit implementation go-ahead before touching runtime, wrapper, or public-doc remediation surfaces. `[Gate]`
- [ ] RT001 Replay the current baseline gates and capture the starting evidence set for remediation. `[Supports: HRF-DR-001-030]`
- [ ] RT002 Keep the release verdict `FAIL` until fresh reruns justify any change. `[Supports: HRF-DR-001-030]`

### WS-2 Packet/Spec Docs Truth-Sync

- [ ] RT010 Re-anchor the packet docs to `review/review-report.md` and mark the top-level `review-report.md` as historical evidence only. `[Findings: HRF-DR-001, HRF-DR-009]`
- [ ] RT011 Fix the `012` packet local validator failures, including packet-local template/header drift, AI-protocol expectations, and broken internal references. `[Findings: HRF-DR-001]`
- [ ] RT012 Reconcile the `012` release story so packet-local FAIL, runtime-green, and historical statements no longer contradict each other. `[Findings: HRF-DR-002]`
- [ ] RT013 Update parent-epic and packet-local references to the live `020-post-release-fixes` slug. `[Findings: HRF-DR-003]`
- [ ] RT014 Refresh packet-local summaries and companion docs only after the packet truth-sync work is evidence-backed. `[Findings: HRF-DR-001, HRF-DR-002, HRF-DR-009]`
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### WS-1 Runtime/Code Integrity

- [ ] RT020 Make TM-04 dedup scope-aware and add direct scoped-save regression coverage. `[Findings: HRF-DR-010, HRF-DR-012]`
- [ ] RT021 Propagate scope through PE arbitration and prove cross-boundary safety. `[Findings: HRF-DR-011]`
- [ ] RT022 Fix constitutional cache warmup empties and folder-scoped invalidation drift. `[Findings: HRF-DR-013, HRF-DR-015]`
- [ ] RT023 Restore embedding-dimension integrity validation for custom-path DB initialization. `[Findings: HRF-DR-014]`
- [ ] RT024 Bind working-memory and shared-memory actions to corroborated ownership rather than caller-controlled identity alone. `[Findings: HRF-DR-016, HRF-DR-017]`
- [ ] RT025 Correct bulk-delete outage signaling, mixed-ingest partial acceptance, and mutation-ledger failure surfacing. `[Findings: HRF-DR-018, HRF-DR-019, HRF-DR-020]`
- [ ] RT026 Revisit confidence scoring and query-routing invariants, and add direct fail-open coverage for Stage 2b. `[Findings: HRF-DR-021, HRF-DR-022, HRF-DR-023]`
- [ ] RT027 Clear stale in-flight tool-cache reuse across invalidation or shutdown and extend lifecycle failure-branch coverage. `[Findings: HRF-DR-024, HRF-DR-025]`
- [ ] RT028 Sanitize retry-manager operator logs so raw provider failures do not leak. `[Findings: HRF-DR-026]`
- [x] RT029 Update `.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts` so the extended limit for `formatters/search-results.js` is `536` and the adjacent actual-count note is `536`, keeping the modularization guard aligned to the narrowly landed split. Evidence: `npx vitest run tests/modularization.vitest.ts`; `timeout 180 npm run test:core`; `python3 .opencode/skill/sk-code-opencode/scripts/verify_alignment_drift.py --root .opencode/skill/system-spec-kit`. `[Supports: narrow modularization/test-budget slice only; no canonical verdict change]`
- [x] RT035 Run a conservative Spec Kit memory DB causal-graph hygiene pass: create checkpoints `pre-supports-hub-prune-global-20260328-0910` and `pre-supports-hub-prune-20260328-0910`, prune only deprecated-to-deprecated `supports` edges from deprecated source hubs meeting the `>=10` outgoing edges and `>=8` distinct target folders rule, then verify `585` candidate edges across `44` source hubs and `78` target folders were deleted while post-prune graph health stayed green. Evidence: checkpoint creation records; candidate scan (`585` / `44` / `78`); `spec_kit_memory_memory_causal_stats` healthy at `3104` total edges, `2218` supports, `886` caused, `78.25%` coverage, `0` orphaned edges; `spec_kit_memory_memory_health` healthy at `2409` indexed memories; follow-up note that `408` deprecated-to-deprecated supports remain and archived/deprecated hubs `25019`, `24960`, `25018`, `24742`, `24743`, `25017`, `24938`, `24980`, `24981`, `24982`, `24983`, `24984` are cleanup candidates rather than closed findings. `[Operational: narrow graph-hygiene/usefulness slice only; no canonical finding closure or verdict change]`
- [x] RT036 Run a second conservative Spec Kit memory DB causal-graph hygiene pass focused on archived deprecated supports-only hubs: create checkpoints `pre-archive-supports-prune-global-20260328-0921` and `pre-archive-supports-prune-20260328-0921`, then delete only `supports` edges where the source memory is `deprecated`, the source `spec_folder` contains `z_archive`, and the source has zero remaining `supports` targets outside `deprecated`. Evidence: candidate scan (`148` edges / `23` source hubs / `36` target folders); mutation applied with `148` causal edges deleted; `spec_kit_memory_memory_causal_stats` healthy at `2956` total edges, `2070` supports, `886` caused, `77.04%` coverage, `0` orphaned edges; `spec_kit_memory_memory_health` healthy at `2409` indexed memories; `260` deprecated-to-deprecated supports remain; exact per-node follow-up limited to prune-outgoing-only hubs `24743`, `24981`, `24982`, `24983`, `24984` and leave-as-historical-lineage hubs `24742`, `24986`, `24987`, `24989`, `24992`, `24993`, `24994`, `24729`, `24734`, `24736`. `[Operational: narrow graph-hygiene/usefulness slice only; keep review/review-report authoritative and overall verdict FAIL; no canonical finding closure]`
- [x] RT037 Run a third conservative Spec Kit memory DB causal-graph hygiene pass focused only on deprecated broadcaster nodes `24743`, `24981`, `24982`, `24983`, and `24984`: create checkpoints `pre-targeted-broadcaster-prune-global-20260328-0933` and `pre-targeted-broadcaster-prune-20260328-0933`, validate that deleting all outgoing `supports` would remove `58` edges total (`24743=11`, `24981=13`, `24982=12`, `24983=11`, `24984=11`), confirm those five nodes have zero outgoing `caused` edges and a target-tier mix of `50 deprecated`, `8 normal`, `0` critical/important/constitutional` with only repeated non-deprecated targets `25560` and `25561`, then apply the `58` edge deletions and verify post-prune health. Evidence: `58` causal edges deleted; `spec_kit_memory_memory_causal_stats` healthy at `2898` total edges, `2012` supports, `886` caused, `76.88%` coverage, `0` orphaned edges; `spec_kit_memory_memory_health` healthy at `2409` indexed memories; trace spot-checks show `24743` is no longer a broadcaster and now shows only inbound/support context, `24742` remains a sink-heavy deprecated historical node, and active node `25860` remains connected but still semantically noisy via generic `supports` fan-out. `[Operational: narrow graph-hygiene/usefulness slice only; keep review/review-report authoritative and overall verdict FAIL; no canonical finding closure]`
- [x] RT038 Switch the next graph-hygiene follow-up from broad pruning to case-by-case cleanup and execute the first single-node action on deprecated node `24980` (`Implementation Summary - Voyage 4 Upgrade [067-voyage-4-upgrade/implementation-summary]`, `implementation_summary`, `deprecated`, spec folder `system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/067-voyage-4-upgrade`): create checkpoints `pre-node-24980-prune-global-20260328-1009` and `pre-node-24980-prune-20260328-1009`, confirm pre-delete scope at exactly `13` outgoing `supports`, `0` outgoing `caused`, and target mix `11 deprecated`, `2 normal`, `0` critical/important/constitutional with only normal targets `25559` (`Manual Testing Per Playbook Discovery Phase`) and `25560` (`005 Lifecycle Manual Testing`), then delete the `13` outgoing `supports` edges from `24980`, remove the six reappearing synthetic orphan test edges `5436`-`5441` as contamination cleanup, and verify final healthy state. Evidence: `spec_kit_memory_memory_causal_stats` healthy at `2885` total edges, `1999` supports, `886` caused, `76.42%` coverage, `0` orphaned edges; `spec_kit_memory_memory_health` healthy at `2417` indexed memories; `spec_kit_memory_memory_drift_why(24980)` shows no causal relationships remain; progress sequence now reads baseline `3689`/`78.41%`, pass 1 `3104`/`78.25%`, pass 2 `2956`/`77.04%`, pass 3 `2898`/`76.88%`, case-by-case node pass `2885`/`76.42%`; `24742` remains sink-heavy lineage and active `25860` remains semantically noisy but connected. `[Operational: narrow graph-hygiene/usefulness slice only; keep review/review-report authoritative and overall verdict FAIL; no canonical finding closure]`
- [x] RT039 Continue the case-by-case graph-hygiene follow-up with a second single-node action on deprecated node `25027` (`Verification Checklist: Foundation Package [001-foundation-phases-0-1-1-5/checklist]`, `checklist`, `deprecated`, spec folder `system-spec-kit/z_archive/020-mcp-working-memory-hybrid-rag/001-foundation-phases-0-1-1-5`): create checkpoints `pre-node-25027-prune-global-20260328-1043` and `pre-node-25027-prune-20260328-1043`, confirm pre-delete scope at exactly `10` outgoing `supports`, `0` outgoing `caused`, and target mix `9 deprecated`, `1 normal`, `0` critical/important/constitutional with the only normal target `25195` (`T008: lastDbCheck advancement`), then delete the `10` outgoing `supports` edges from `25027` and verify final healthy state. Evidence: `spec_kit_memory_memory_causal_stats` healthy at `2875` total edges, `1989` supports, `886` caused, `76.42%` coverage, `0` orphaned edges; `spec_kit_memory_memory_health` healthy at `2417` indexed memories; `spec_kit_memory_memory_drift_why(25027)` shows only inbound/support context and no outgoing causal graph fan-out; progress sequence now reads baseline `3689`/`78.41%`, pass 1 `3104`/`78.25%`, pass 2 `2956`/`77.04%`, pass 3 `2898`/`76.88%`, case-by-case node `24980` pass `2885`/`76.42%`, case-by-case node `25027` pass `2875`/`76.42%`; `25027` no longer acts as a broadcaster, `24980` remains fully disconnected, `24742` remains sink-heavy lineage, and active `25860` remains semantically noisy but connected. `[Operational: narrow graph-hygiene/usefulness slice only; keep review/review-report authoritative and overall verdict FAIL; no canonical finding closure]`

### WS-3 Public Docs And Wrapper Alignment

- [ ] RT030 Refresh root/public README and install surfaces to live counts, labels, versions, and filesystem paths, including the broken CocoIndex install path and UX-hooks README drift. `[Findings: HRF-DR-004]`
- [ ] RT031 Rebuild `006-feature-catalog` wrapper denominators and claims against the live `255`-feature, `21`-category tree. `[Findings: HRF-DR-005]`
- [ ] RT032 Rebuild `015-manual-testing-per-playbook` totals, orphan-story claims, and capability references against the live playbook tree. `[Findings: HRF-DR-006]`
- [ ] RT033 Clear the root `019/020` phase-link warning and remove the duplicated effort-estimation block from root `022` plan surfaces. `[Findings: HRF-DR-007, HRF-DR-008]`
- [x] RT034 Convert `.opencode/skill/system-spec-kit/mcp_server/scripts/map-ground-truth-ids.ts` into a thin compatibility wrapper that delegates to `../../scripts/dist/evals/map-ground-truth-ids.js`, fixing the wrapper-only architecture-boundary failure for that script surface. Evidence: `npm run check --workspace=scripts` in `.opencode/skill/system-spec-kit`; `python3 .opencode/skill/sk-code-opencode/scripts/verify_alignment_drift.py --root .opencode/skill/system-spec-kit`. `[Supports: narrow wrapper-alignment slice only; no canonical verdict change]`

### WS-4 Feature Verification And Tooling Contract Repair

- [ ] RT040 Fix the `/memory:learn` docs-alignment contract across the command-group README surface, feature entry, and failing regression test. `[Findings: HRF-DR-027]`
- [ ] RT041 Repair the seven catalog mismatch entries, including stale verification references, non-concrete evidence tables, and duplicate ordinals. `[Findings: HRF-DR-028]`
- [ ] RT042 Reduce the under-tested block by adding direct tests, documenting strong static proof, or recording explicit approved deferrals for the `48` flagged features. `[Findings: HRF-DR-029]`
- [ ] RT043 Retire or rewrite stale `007-code-audit-per-feature-catalog` correctness claims so they no longer function as live evidence. `[Findings: HRF-DR-030]`
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] RT050 Replay the baseline commands at remediation start: `012` local validate, root `022 --recursive`, and `mcp_server npm test`. `[Supports: HRF-DR-001-030]`
- [ ] RT051 Run targeted subsystem Vitest subsets for each touched runtime or tooling wave before merge. `[Supports: HRF-DR-010-030]`
- [ ] RT052 Re-run packet-local validation for `012` and any touched packet families after truth-sync or wrapper edits land. `[Supports: HRF-DR-001-009, HRF-DR-028-030]`
- [ ] RT053 Update the canonical `review/` artifacts and packet-local release summaries from fresh evidence only. `[Supports: HRF-DR-001-030]`
- [ ] RT054 Preserve the written `FAIL` verdict unless fresh reruns justify a replacement review. `[Supports: HRF-DR-001-030]`
- [ ] RT055 Save implementation memory and handoff context after the remediation wave completes. `[Operational]`
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All active `P1` findings have landed fixes or evidence-backed reclassification.
- [ ] All active `P2` findings have landed fixes, explicit proof, or explicit accepted deferrals.
- [ ] The canonical `review/` packet and this packet's release-control docs are updated from fresh rerun evidence.
- [ ] The verdict remains `FAIL` unless the reruns justify a replacement review.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

| Finding | Task Coverage |
|---------|---------------|
| `HRF-DR-001` | `RT010`, `RT011`, `RT014`, `RT050`, `RT052`, `RT053`, `RT054` |
| `HRF-DR-002` | `RT012`, `RT014`, `RT053`, `RT054` |
| `HRF-DR-003` | `RT013` |
| `HRF-DR-004` | `RT030` |
| `HRF-DR-005` | `RT031` |
| `HRF-DR-006` | `RT032` |
| `HRF-DR-007` | `RT033` |
| `HRF-DR-008` | `RT033` |
| `HRF-DR-009` | `RT010`, `RT014`, `RT053` |
| `HRF-DR-010` | `RT020` |
| `HRF-DR-011` | `RT021` |
| `HRF-DR-012` | `RT020` |
| `HRF-DR-013` | `RT022` |
| `HRF-DR-014` | `RT023` |
| `HRF-DR-015` | `RT022` |
| `HRF-DR-016` | `RT024` |
| `HRF-DR-017` | `RT024` |
| `HRF-DR-018` | `RT025` |
| `HRF-DR-019` | `RT025` |
| `HRF-DR-020` | `RT025` |
| `HRF-DR-021` | `RT026` |
| `HRF-DR-022` | `RT026` |
| `HRF-DR-023` | `RT026` |
| `HRF-DR-024` | `RT027` |
| `HRF-DR-025` | `RT027` |
| `HRF-DR-026` | `RT028` |
| `HRF-DR-027` | `RT040` |
| `HRF-DR-028` | `RT041` |
| `HRF-DR-029` | `RT042` |
| `HRF-DR-030` | `RT043` |
<!-- /ANCHOR:cross-refs -->
