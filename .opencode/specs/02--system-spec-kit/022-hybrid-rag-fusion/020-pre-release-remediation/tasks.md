<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: 020 Pre-Release Remediation

<!-- ANCHOR:notation -->
## Task Notation

- This is the active remediation backlog generated from the canonical review in [`review/review-report.md`](./review/review-report.md).
- Most remediation items below remain `[ ]` while the broader remediation program is still staged. Two narrow slices are recorded as `[x]` below from fresh evidence, and neither changes the overall `FAIL` verdict.
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
- [ ] RT013 Update parent-epic and packet-local references to the live `020-pre-release-remediation` slug. `[Findings: HRF-DR-003]`
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
- [x] RT029 Update `.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts` so the extended limit for `formatters/search-results.js` is `536` and the adjacent actual-count note is `536`, keeping the modularization guard aligned to the narrowly landed split. Evidence: `npx vitest run tests/modularization.vitest.ts`; `timeout 180 npm run test:core`; `python3 .opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py --root .opencode/skill/system-spec-kit`. `[Supports: narrow modularization/test-budget slice only; no canonical verdict change]`

### WS-3 Public Docs And Wrapper Alignment

- [ ] RT030 Refresh root/public README and install surfaces to live counts, labels, versions, and filesystem paths, including the broken CocoIndex install path and UX-hooks README drift. `[Findings: HRF-DR-004]`
- [ ] RT031 Rebuild `006-feature-catalog` wrapper denominators and claims against the live `255`-feature, `21`-category tree. `[Findings: HRF-DR-005]`
- [ ] RT032 Rebuild `015-manual-testing-per-playbook` totals, orphan-story claims, and capability references against the live playbook tree. `[Findings: HRF-DR-006]`
- [ ] RT033 Clear the root `019/020` phase-link warning and remove the duplicated effort-estimation block from root `022` plan surfaces. `[Findings: HRF-DR-007, HRF-DR-008]`
- [x] RT034 Convert `.opencode/skill/system-spec-kit/mcp_server/scripts/map-ground-truth-ids.ts` into a thin compatibility wrapper that delegates to `../../scripts/dist/evals/map-ground-truth-ids.js`, fixing the wrapper-only architecture-boundary failure for that script surface. Evidence: `npm run check --workspace=scripts` in `.opencode/skill/system-spec-kit`; `python3 .opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py --root .opencode/skill/system-spec-kit`. `[Supports: narrow wrapper-alignment slice only; no canonical verdict change]`

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
