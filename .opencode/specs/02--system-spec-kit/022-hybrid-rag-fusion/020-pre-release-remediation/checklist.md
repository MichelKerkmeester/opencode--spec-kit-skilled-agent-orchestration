<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Verification Checklist: 020 Pre-Release Remediation

<!-- ANCHOR:protocol -->
## Verification Protocol

- This is the active verification checklist derived from the canonical review in [`review/review-report.md`](./review/review-report.md).
- Most verification items below remain `[ ]` while the broader remediation program is still staged. Two narrow slices are recorded as `[x]` below from fresh evidence, and neither changes the overall `FAIL` verdict.
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
- [ ] [P0] All checklist items remain unchecked except the two evidence-backed narrow slices recorded in `CHK-R029` and `CHK-R035`.
- [ ] [P0] The packet continues to treat `review/review-report.md` as canonical and the top-level `review-report.md` as historical.
- [ ] [P1] The verification sequence still depends on fresh reruns rather than historical prose.
<!-- /ANCHOR:summary -->
