---
title: "Verification Checklist: Review Gap Remediation for 009 Hook/Daemon Parity"
description: "Verification Date: 2026-04-24"
trigger_phrases:
  - "verification checklist"
  - "review gap remediation"
  - "015-review-gap-remediation"
importance_tier: "high"
contextType: "checklist"
level: 2
status: "Complete"
template_source_marker: "checklist-core | v2.2"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/015-review-gap-remediation"
    last_updated_at: "2026-04-24T11:15:57Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Verified RG-001 through RG-039 against the packet-local applied ledger"
    next_safe_action: "Repair packet scaffolding gaps."
    blockers:
      - "Strict packet validation still depends on missing planning docs plus existing spec template drift outside this closeout write scope."
    key_files:
      - "checklist.md"
      - "implementation-summary.md"
      - "applied/RG-001.md"
      - "applied/RG-039.md"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Mark every RG finding complete with a packet-local evidence pointer."
    status: "complete"
---
# Verification Checklist: Review Gap Remediation for 009 Hook/Daemon Parity

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **P0** | Hard blocker | Cannot claim packet closeout until the blocker is remediated and evidenced |
| **P1** | Required | Must land or be explicitly rewritten as on-disk, auditable proof |
| **P2** | Optional follow-up | Can bundle into packet closeout when the evidence ledger shows it landed |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P1] `RG-006` replaced packet `013` references to non-existent `applied/T-*.md` evidence with artifacts that are present on disk. [Evidence: `applied/RG-006.md`]
- [x] CHK-002 [P1] `RG-016` realigned packet `014`'s governing spec so the folder no longer claims research-only scope while also claiming completed implementation. [Evidence: `applied/RG-016.md`]
- [x] CHK-003 [P1] `RG-017` repaired packet `014`'s missing task-evidence ledger by removing claims that depended on absent `applied/T-###.md` files. [Evidence: `applied/RG-017.md`]
- [x] CHK-004 [P1] `RG-019` narrowed packet `014`'s Codex verification narrative to the success-path proof that actually exists in the checkout. [Evidence: `applied/RG-019.md`]
- [x] CHK-005 [P2] `RG-037` cleaned the packet `014` resource map so it no longer reports non-existent artifacts as present. [Evidence: `applied/RG-037.md`]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P1] `RG-002` reranked large ambiguity sets so `CALLS` and import subject resolution no longer miss the right implementation after the first ten SQL matches. [Evidence: `applied/RG-002.md`]
- [x] CHK-011 [P1] `RG-003` preserved CocoIndex seed fidelity for both `seed.file` and `seed.filePath`. [Evidence: `applied/RG-003.md`]
- [x] CHK-012 [P1] `RG-004` fixed `partialOutput.omittedAnchors` so deadline exits count every anchor left unprocessed. [Evidence: `applied/RG-004.md`]
- [x] CHK-013 [P1] `RG-005` kept no-op incremental scans from dropping skipped-file counts or clearing persisted enrichment summaries without a replacement write. [Evidence: `applied/RG-005.md`]
- [x] CHK-014 [P1] `RG-018` converged shared-payload and hook-visible advisor brief rendering onto one renderer contract. [Evidence: `applied/RG-018.md`]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P1] `RG-013` updated the startup playbook so it validates the startup payload and graph-quality assertions added in packet `013`. [Evidence: `applied/RG-013.md`]
- [x] CHK-021 [P1] `RG-014` repointed the storage/query playbook at the live suites and added `graphQualitySummary` assertions. [Evidence: `applied/RG-014.md`]
- [x] CHK-022 [P1] `RG-015` extended semantic-vs-structural routing checks to cover blocked-read and `partialOutput` behavior. [Evidence: `applied/RG-015.md`]
- [x] CHK-023 [P1] `RG-023` updated the OpenCode bridge manual flow to the live helper path and 014 threshold pair. [Evidence: `applied/RG-023.md`]
- [x] CHK-024 [P1] `RG-025` extended the native `advisor_recommend` manual scenario to assert `workspaceRoot` and `effectiveThresholds`. [Evidence: `applied/RG-025.md`]
- [x] CHK-025 [P1] `RG-027` expanded the native `advisor_validate` playbook to check threshold semantics, telemetry diagnostics, and outcome totals. [Evidence: `applied/RG-027.md`]
- [x] CHK-026 [P2] `RG-028` restored startup parity evidence across Gemini and Copilot instead of only Claude and Codex. [Evidence: `applied/RG-028.md`]
- [x] CHK-027 [P2] `RG-030` added ambiguity regression coverage beyond the hard candidate cap. [Evidence: `applied/RG-030.md`]
- [x] CHK-028 [P2] `RG-031` added the multi-anchor deadline regression that guards the `omittedAnchors` path end to end. [Evidence: `applied/RG-031.md`]
- [x] CHK-029 [P2] `RG-032` exercised the no-op incremental scan bug with the real skip-fresh path instead of a mock-only shortcut. [Evidence: `applied/RG-032.md`]
- [x] CHK-030 [P2] `RG-038` added happy-path assertions for the public `advisor_recommend` response fields in the handler test. [Evidence: `applied/RG-038.md`]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] `RG-001` made `advisor_recommend` cache keys workspace-aware so recommendations cannot bleed across repositories. [Evidence: `applied/RG-001.md`]
- [x] CHK-041 [P1] `RG-020` made `advisor_validate` tolerate malformed JSONL outcome telemetry instead of throwing on corrupt lines. [Evidence: `applied/RG-020.md`]
- [x] CHK-042 [P1] `RG-021` scoped or explicitly labeled validation totals so subset checks no longer surface misleading workspace-global numbers. [Evidence: `applied/RG-021.md`]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] `RG-007` refreshed the central MCP README to the post-013 `code_graph_status` and `code_graph_context` contract. [Evidence: `applied/RG-007.md`]
- [x] CHK-051 [P1] `RG-008` refreshed the code-graph subsystem README with status, blocked-read, and startup-quality details. [Evidence: `applied/RG-008.md`]
- [x] CHK-052 [P1] `RG-009` extended the install guide with the live 013-era status and context vocabulary. [Evidence: `applied/RG-009.md`]
- [x] CHK-053 [P1] `RG-010` updated public tool-schema descriptions for the live `code_graph_status` and `code_graph_context` outputs. [Evidence: `applied/RG-010.md`]
- [x] CHK-054 [P1] `RG-011` repaired the storage/query feature page so it points at the current tests and status framing. [Evidence: `applied/RG-011.md`]
- [x] CHK-055 [P1] `RG-012` updated the CocoIndex bridge feature page with seed-fidelity plus blocked/partial-output behavior. [Evidence: `applied/RG-012.md`]
- [x] CHK-056 [P1] `RG-022` updated the OpenCode plugin-bridge feature page and helper references to the relocated helper path and landed thresholds. [Evidence: `applied/RG-022.md`]
- [x] CHK-057 [P1] `RG-024` expanded the `advisor_recommend` feature page to include `workspaceRoot` and `effectiveThresholds`. [Evidence: `applied/RG-024.md`]
- [x] CHK-058 [P1] `RG-026` updated the `advisor_validate` feature page to the live threshold, telemetry, and outcome contract. [Evidence: `applied/RG-026.md`]
- [x] CHK-059 [P2] `RG-033` refreshed the handler-local code-graph README to describe the live readiness, blocked-read, and `partialOutput` surfaces. [Evidence: `applied/RG-033.md`]
- [x] CHK-060 [P2] `RG-034` updated the readiness-contract feature page to the richer blocked-read caller contract. [Evidence: `applied/RG-034.md`]
- [x] CHK-061 [P2] `RG-035` reframed the auto-trigger feature page around the explicit blocked query/context contract that operators now see. [Evidence: `applied/RG-035.md`]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-070 [P2] `RG-029` restored the missing Codex startup adapter row to packet `013`'s `Files Changed` inventory so the closeout ledger matches the actual implementation surface. [Evidence: `applied/RG-029.md`]
- [x] CHK-071 [P2] `RG-036` updated the auto-trigger manual-testing playbook to the live handler/test layout instead of the stale indexer-only path. [Evidence: `applied/RG-036.md`]
- [x] CHK-072 [P2] `RG-039` brought the setup guide's OpenCode bridge wording back in line with the relocated helper layout already used by the plugin. [Evidence: `applied/RG-039.md`]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | `1` | `1/1` |
| P1 Items | `26` | `26/26` |
| P2 Items | `12` | `12/12` |

**Verification Date**: `2026-04-24`
**Verification Basis**: `39` packet-local applied reports plus the merged findings registry in `../../research/013-014-review-gap-merged-findings.json`
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
