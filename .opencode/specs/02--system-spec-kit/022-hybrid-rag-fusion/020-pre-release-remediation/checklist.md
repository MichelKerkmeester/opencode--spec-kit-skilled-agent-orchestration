<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Verification Checklist: 020 Pre-Release Remediation

<!-- ANCHOR:protocol -->
## Verification Protocol

- This is the active verification checklist derived from the canonical review in [`review/review-report.md`](./review/review-report.md).
- Most verification items below remain `[ ]` while the broader remediation program is still staged. Seven narrow slices are recorded as `[x]` below from fresh evidence, and none changes the overall `FAIL` verdict.
- Primary IDs in this file use the `CHK-R###` format.
- Checklist rows are grouped by remediation workstream and by final rerun gates rather than by historical packet lineage.

### Coverage Summary

| Source | Active Count | Representation In This File |
|--------|--------------|-----------------------------|
| Canonical `P1` findings | 14 | Covered by workstream-specific closure checks |
| Canonical `P2` findings | 16 | Covered by grouped verification, coverage, or disposition checks |
| Review workstreams | 4 | Preserved as sections 2 through 5 |
| Final gate surfaces | 3 core + targeted subsets | Preserved in section 6 |
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-R001 [P0] `review/review-report.md` is loaded as the authoritative review source for this packet. `[Supports: HRF-DR-001-030]`
- [ ] CHK-R002 [P0] `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` all reference the same review baseline and workstream structure. `[Supports: HRF-DR-001-030]`
- [ ] CHK-R003 [P0] The top-level `review-report.md` is treated as historical evidence only. `[Supports: HRF-DR-009]`
- [ ] CHK-R004 [P0] No remediation row is marked complete before explicit implementation go-ahead is given. `[Gate]`
- [ ] CHK-R005 [P1] The packet preserves the normalized feature-state denominator of `255` features, `21` categories, and `191 / 48 / 7 / 9`. `[Supports: HRF-DR-028-030]`
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-R020 [P0] Scoped save dedup and PE arbitration are scope-aware and covered by direct regression tests. `[Findings: HRF-DR-010, HRF-DR-011, HRF-DR-012]`
- [ ] CHK-R021 [P0] Constitutional cache warmup and folder-scoped invalidation no longer leak empty or stale state. `[Findings: HRF-DR-013, HRF-DR-015]`
- [ ] CHK-R022 [P0] Custom-path DB initialization enforces embedding-dimension integrity. `[Findings: HRF-DR-014]`
- [ ] CHK-R023 [P0] Session trust and shared-memory admin actions are bound to corroborated ownership rather than caller-controlled identity alone. `[Findings: HRF-DR-016, HRF-DR-017]`
- [ ] CHK-R024 [P0] Bulk-delete, mixed-ingest, and mutation-ledger error surfaces are accurate, non-silent, and contract-consistent. `[Findings: HRF-DR-018, HRF-DR-019, HRF-DR-020]`
- [ ] CHK-R025 [P1] Confidence scoring and query routing enforce the intended invariants without synthetic overstatement. `[Findings: HRF-DR-021, HRF-DR-022]`
- [ ] CHK-R026 [P1] Stage-2b fail-open behavior and context-server lifecycle failure branches are covered by direct tests. `[Findings: HRF-DR-023, HRF-DR-025]`
- [ ] CHK-R027 [P0] Tool-cache invalidation and shutdown clear stale in-flight state safely. `[Findings: HRF-DR-024]`
- [ ] CHK-R028 [P1] Retry-manager operator logs no longer expose raw provider failure text. `[Findings: HRF-DR-026]`
- [x] CHK-R029 [P1] `.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts` records the landed `formatters/search-results.js` extended limit at `536` and the adjacent actual-count note at `536`. `[EVIDENCE: \`npx vitest run tests/modularization.vitest.ts\` passed, \`timeout 180 npm run test:core\` passed, and \`python3 .opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py --root .opencode/skill/system-spec-kit\` passed for this narrow modularization/test-budget slice.]` `[Supports: narrow modularization/test-budget slice only; no canonical verdict change]`
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-R040 [P1] The `/memory:learn` docs-alignment regression passes against the live command-group README surface. `[Findings: HRF-DR-027]`
- [ ] CHK-R041 [P1] The seven catalog mismatch entries use concrete evidence or unique ordinals after remediation. `[Findings: HRF-DR-028]`
- [ ] CHK-R042 [P1] Each of the forty-eight under-tested features has one of: direct automated coverage, strong static proof, or an explicit approved deferral. `[Findings: HRF-DR-029]`

- [ ] CHK-R050 [P0] The baseline command set is replayed and recorded at remediation start: `012` local validate, root `022 --recursive`, and `mcp_server npm test`. `[Supports: HRF-DR-001-030]`
- [ ] CHK-R051 [P0] Targeted Vitest subsets are rerun for each touched runtime or tooling wave before merge. `[Supports: HRF-DR-010-030]`
- [ ] CHK-R052 [P0] Packet-local validation is rerun for `012` and any touched packet families after doc or wrapper edits land. `[Supports: HRF-DR-001-009, HRF-DR-028-030]`
- [ ] CHK-R053 [P0] The canonical `review/` artifacts are updated from fresh evidence only. `[Supports: HRF-DR-001-030]`
- [ ] CHK-R054 [P0] `spec_code`, `checklist_evidence`, `feature_catalog_code`, and `playbook_capability` statuses are refreshed truthfully after remediation. `[Supports: HRF-DR-001-030]`
- [ ] CHK-R055 [P0] The written `FAIL` verdict changes only if fresh reruns justify a replacement review. `[Supports: HRF-DR-001-030]`
- [ ] CHK-R056 [P2] Final memory and handoff context are saved after the remediation wave completes. `[Operational]`
- [x] CHK-R057 [P2] The conservative deprecated-supports hub prune was executed with safety checkpoints `pre-supports-hub-prune-global-20260328-0910` and `pre-supports-hub-prune-20260328-0910`, deleting only the `585` qualifying deprecated-to-deprecated `supports` edges found across `44` source hubs and `78` target folders; post-prune verification stayed healthy and broader review findings remained open. `[EVIDENCE: Candidate scan recorded 585 edges / 44 hubs / 78 target folders; spec_kit_memory_memory_causal_stats healthy at 3104 total edges, 2218 supports, 886 caused, 78.25% coverage, 0 orphaned edges; spec_kit_memory_memory_health healthy at 2409 memories indexed; 408 deprecated-to-deprecated supports remain; follow-up cleanup candidates include hubs 25019, 24960, 25018, 24742, 24743, 25017, 24938, 24980, 24981, 24982, 24983, 24984.]` `[Supports: narrow graph-hygiene/usefulness slice only; no canonical verdict change]`
- [x] CHK-R058 [P2] The second archived deprecated supports-only hygiene pass was executed with safety checkpoints `pre-archive-supports-prune-global-20260328-0921` and `pre-archive-supports-prune-20260328-0921`, deleting only `supports` edges whose source memory is `deprecated`, whose source `spec_folder` contains `z_archive`, and whose source has zero remaining `supports` targets outside `deprecated`; post-prune verification stayed healthy and broader review findings remained open. `[EVIDENCE: Candidate scan recorded 148 edges / 23 source hubs / 36 target folders; mutation applied with 148 causal edges deleted; spec_kit_memory_memory_causal_stats healthy at 2956 total edges, 2070 supports, 886 caused, 77.04% coverage, 0 orphaned edges; spec_kit_memory_memory_health healthy at 2409 memories indexed; 260 deprecated-to-deprecated supports remain; action-table follow-up stays limited to prune-outgoing-only hubs 24743, 24981, 24982, 24983, 24984 and leave-as-historical-lineage hubs 24742, 24986, 24987, 24989, 24992, 24993, 24994, 24729, 24734, 24736.]` `[Supports: narrow graph-hygiene/usefulness slice only; keep review/review-report authoritative and overall verdict FAIL; no canonical finding closure]`
- [x] CHK-R059 [P2] The third targeted-broadcaster hygiene pass was executed with safety checkpoints `pre-targeted-broadcaster-prune-global-20260328-0933` and `pre-targeted-broadcaster-prune-20260328-0933`, deleting only outgoing `supports` from deprecated broadcaster nodes `24743`, `24981`, `24982`, `24983`, and `24984`; post-prune verification stayed healthy and broader review findings remained open. `[EVIDENCE: Pre-delete scope recorded 58 edges total with per-node counts 24743=11, 24981=13, 24982=12, 24983=11, 24984=11; those five nodes had zero outgoing caused edges; target-tier mix was 50 deprecated, 8 normal, 0 critical/important/constitutional, with only repeated non-deprecated targets 25560 and 25561; mutation applied with 58 causal edges deleted; spec_kit_memory_memory_causal_stats healthy at 2898 total edges, 2012 supports, 886 caused, 76.88% coverage, 0 orphaned edges; spec_kit_memory_memory_health healthy at 2409 memories indexed; trace spot-checks show 24743 is no longer a broadcaster, 24742 remains a sink-heavy deprecated historical node, and 25860 remains connected but still semantically noisy via generic supports fan-out.]` `[Supports: narrow graph-hygiene/usefulness slice only; keep review/review-report authoritative and overall verdict FAIL; no canonical finding closure]`
- [x] CHK-R062 [P2] The next graph-hygiene follow-up switched from broad pruning to case-by-case cleanup and executed the first single-node action on `24980`, deleting only that node's `13` outgoing `supports` edges and then removing six reappearing synthetic orphan test edges as contamination cleanup; broader review findings remained open. `[EVIDENCE: Safety checkpoints created: pre-node-24980-prune-global-20260328-1009 and pre-node-24980-prune-20260328-1009; node 24980 inspected as \`Implementation Summary - Voyage 4 Upgrade [067-voyage-4-upgrade/implementation-summary]\` (\`implementation_summary\`, \`deprecated\`, spec folder \`02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/067-voyage-4-upgrade\`); pre-delete scope was exactly 13 outgoing supports, 0 outgoing caused, and target mix 11 deprecated / 2 normal / 0 critical-important-constitutional, with normal targets 25559 \`Manual Testing Per Playbook Discovery Phase\` and 25560 \`005 Lifecycle Manual Testing\`; mutation deleted the 13 outgoing supports edges from 24980; synthetic orphan test edges 5436-5441 were immediately removed as contamination cleanup; final spec_kit_memory_memory_causal_stats healthy at 2885 total edges, 1999 supports, 886 caused, 76.42% coverage, 0 orphaned edges; spec_kit_memory_memory_health healthy at 2417 memories indexed; spec_kit_memory_memory_drift_why(24980) shows no causal relationships remain.]` `[Supports: narrow graph-hygiene/usefulness slice only; keep review/review-report authoritative and overall verdict FAIL; no canonical finding closure]`
- [x] CHK-R063 [P2] The second case-by-case node cleanup executed a single-node action on `25027`, deleting only that node's `10` outgoing `supports` edges; broader review findings remained open. `[EVIDENCE: Safety checkpoints created: pre-node-25027-prune-global-20260328-1043 and pre-node-25027-prune-20260328-1043; node 25027 inspected as \`Verification Checklist: Foundation Package [001-foundation-phases-0-1-1-5/checklist]\` (\`checklist\`, \`deprecated\`, spec folder \`02--system-spec-kit/z_archive/020-mcp-working-memory-hybrid-rag/001-foundation-phases-0-1-1-5\`); pre-delete scope was exactly 10 outgoing supports, 0 outgoing caused, and target mix 9 deprecated / 1 normal / 0 critical-important-constitutional, with the only normal target 25195 \`T008: lastDbCheck advancement\`; mutation deleted the 10 outgoing supports edges from 25027; final spec_kit_memory_memory_causal_stats healthy at 2875 total edges, 1989 supports, 886 caused, 76.42% coverage, 0 orphaned edges; spec_kit_memory_memory_health healthy at 2417 memories indexed; spec_kit_memory_memory_drift_why(25027) shows only inbound/support context and no outgoing causal graph fan-out.]` `[Supports: narrow graph-hygiene/usefulness slice only; keep review/review-report authoritative and overall verdict FAIL; no canonical finding closure]`
<!-- /ANCHOR:testing -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-R060 [P0] Scope, session, shared-memory, and cache invalidation fixes preserve or improve the current security posture. `[Findings: HRF-DR-010, HRF-DR-011, HRF-DR-016, HRF-DR-017, HRF-DR-024, HRF-DR-026]`
- [ ] CHK-R061 [P1] No new provider-error leakage, over-broad enumeration, or caller-controlled trust path is introduced while closing the runtime findings. `[Findings: HRF-DR-016, HRF-DR-017, HRF-DR-026]`
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-R010 [P0] The `012` packet validates locally or any remaining blockers are explicitly reduced to out-of-scope carry-over with evidence. `[Findings: HRF-DR-001]`
- [ ] CHK-R011 [P0] The `012` packet tells one coherent release story and preserves the current `FAIL` verdict until reruns justify change. `[Findings: HRF-DR-002]`
- [ ] CHK-R012 [P0] Parent-epic and packet-local references point at the live `020-pre-release-remediation` slug everywhere. `[Findings: HRF-DR-003]`
- [ ] CHK-R013 [P1] Packet-local docs clearly distinguish the canonical `review/` packet from the historical top-level report. `[Findings: HRF-DR-009]`
- [ ] CHK-R014 [P1] Packet-local summaries and companion docs reflect the post-review remediation program rather than the historical consolidation storyline. `[Findings: HRF-DR-001, HRF-DR-002, HRF-DR-009]`
- [ ] CHK-R030 [P1] Root/public README and install surfaces match live counts, labels, versions, and filesystem paths. `[Findings: HRF-DR-004]`
- [ ] CHK-R031 [P1] `006-feature-catalog` wrapper denominators and claims match the live `255`-feature, `21`-category tree. `[Findings: HRF-DR-005]`
- [ ] CHK-R032 [P1] `015-manual-testing-per-playbook` totals, orphan-story claims, and capability links match the live playbook tree. `[Findings: HRF-DR-006]`
- [ ] CHK-R033 [P2] Root `019/020` phase-link drift is cleared. `[Findings: HRF-DR-007]`
- [ ] CHK-R034 [P2] Root `022` plan no longer contains the duplicated effort-estimation block. `[Findings: HRF-DR-008]`
- [x] CHK-R035 [P1] `.opencode/skill/system-spec-kit/mcp_server/scripts/map-ground-truth-ids.ts` is now a thin compatibility wrapper delegating to `../../scripts/dist/evals/map-ground-truth-ids.js`. `[EVIDENCE: \`npm run check --workspace=scripts\` in \`.opencode/skill/system-spec-kit\` exited 0, and \`python3 .opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py --root .opencode/skill/system-spec-kit\` exited 0 for this wrapper-only alignment slice.]` `[Supports: narrow wrapper-alignment slice only; no canonical verdict change]`
- [ ] CHK-R043 [P2] `007-code-audit-per-feature-catalog` is no longer treated as live correctness evidence anywhere in the release packet surfaces. `[Findings: HRF-DR-030]`
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-R070 [P1] `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` stay synchronized after the remediation wave. `[Supports: HRF-DR-001-030]`
- [ ] CHK-R071 [P1] `review/` remains the canonical audit surface and the top-level `review-report.md` remains historical only. `[Supports: HRF-DR-009]`
- [ ] CHK-R072 [P1] No unrelated packet families are edited without explicit scope expansion. `[Operational]`
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

- [ ] [P0] Every active finding from `HRF-DR-001` through `HRF-DR-030` is represented in `tasks.md` and `checklist.md`.
- [ ] [P0] All checklist items remain unchecked except the seven evidence-backed narrow slices recorded in `CHK-R029`, `CHK-R035`, `CHK-R057`, `CHK-R058`, `CHK-R059`, `CHK-R062`, and `CHK-R063`.
- [ ] [P0] The packet continues to treat `review/review-report.md` as canonical and the top-level `review-report.md` as historical.
- [ ] [P1] The verification sequence still depends on fresh reruns rather than historical prose.
<!-- /ANCHOR:summary -->
