---
title: "Checklist: Review Remediation [024/029]"
description: "Verification checklist for the active deep-review blocker set and optional advisory parity follow-up."
trigger_phrases:
  - "029 checklist"
  - "review remediation checklist"
importance_tier: "normal"
contextType: "verification"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Verification Checklist: Review Remediation

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | Hard blocker | Cannot close the phase until complete |
| **[P1]** | Required | Must complete or be explicitly deferred |
| **[P2]** | Advisory | May defer with documented rationale |
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The packet still matches the active deep-review registry and does not add unrelated remediation scope. [EVIDENCE: all runtime and doc edits stayed inside WS-1 through WS-6 surfaces named in the parent review report]
- [x] CHK-002 [P0] A resolution path is chosen for `session_bootstrap` contract truth-sync before code changes begin. [EVIDENCE: implemented additive `nextActions` in `session-bootstrap.ts` so public contracts stay truthful]
- [x] CHK-003 [P1] Root evidence ownership for Phase 015/016 shipped status is agreed before editing historical packet docs. [EVIDENCE: root implementation summary refreshed to current truth instead of repointing checklist ownership]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `session_bootstrap` handler output matches every public contract surface after WS-1. [EVIDENCE: handler emits `nextActions`; tool schema now includes a formal `outputSchema` documenting `resume`, `health`, `structuralContext`, `hints`, and `nextActions`; MCP README describes recommended next actions]
- [x] CHK-011 [P0] Gemini SessionStart compact recovery applies the intended provenance fence or the packet/docs no longer claim that it does. [EVIDENCE: `hooks/gemini/session-prime.ts` now uses `wrapRecoveredCompactPayload()` for compact recovery output]
- [x] CHK-012 [P0] Claude stop-hook autosave no longer chooses a packet solely by transcript frequency. [EVIDENCE: `hooks/claude/session-stop.ts` validates `state.lastSpecFolder` and `state.sessionSummary` presence before autosave; returns `null` when either is missing rather than falling back to transcript-frequency heuristics]
- [x] CHK-013 [P1] Phase 021 reflects the current bootstrap-first recovery contract without leaving superseded guidance ambiguous. [EVIDENCE: Phase 021 spec and implementation summary now document `session_bootstrap()` as the public first-call recovery surface]
- [x] CHK-014 [P1] Phase 027 documents a structural budget claim that matches actual runtime behavior. [EVIDENCE: `buildStructuralBootstrapContract()` now enforces the documented 500-token hard ceiling]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Targeted verification proves the repaired `session_bootstrap` contract shape. [EVIDENCE: `vitest` PASS for `tests/session-bootstrap.vitest.ts`]
- [x] CHK-021 [P0] Targeted hook verification proves Gemini fencing and Claude autosave targeting behavior. [EVIDENCE: `vitest` PASS for `tests/hook-session-start.vitest.ts` and new `tests/hook-session-stop.vitest.ts`]
- [x] CHK-022 [P1] Root packet evidence no longer cites stale shipped-status proof for phases 015/016. [EVIDENCE: root `implementation-summary.md` now aligns with the shipped Phase 015/016 status already reflected in the root checklist]
- [x] CHK-023 [P1] A focused post-remediation review sweep on the parent packet reports the current P1 findings as closed or intentionally downgraded. [EVIDENCE: targeted review sweep found no remaining mismatches on the seven original finding surfaces]
- [x] CHK-024 [P2] If WS-6 ships, the active runtime `context-prime` surfaces expose the same structural Prime Package shape, including the Codex TOML definition if it remains canonical. [EVIDENCE: Claude and Codex `context-prime` copies now include the explicit Structural Context section already present in OpenCode]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Recovered compact text is fenced consistently on the runtime paths that claim prompt-safety protection. [EVIDENCE: Gemini compact recovery now routes through the shared provenance wrapper used by the Claude hook utilities]
- [x] CHK-031 [P1] Autosave packet selection validates authoritative session ownership before persistence. [EVIDENCE: ambiguous transcript-only matches now return `null`, and existing active-session state is preserved]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` in this phase describe the same blocker/advisory split. [EVIDENCE: packet docs now reflect completed WS-1 through WS-5 plus shipped advisory WS-6]
- [x] CHK-041 [P1] Updated sibling packet docs tell the truth about current runtime behavior and historical status. [EVIDENCE: Phase 021 and root 024 summary were truth-synced; Phase 027's hard ceiling is now true in code]
- [x] CHK-042 [P2] Advisory WS-6 is either completed or clearly deferred as maintenance debt. [EVIDENCE: WS-6 shipped and the Claude/Codex `context-prime` copies now mirror the Structural Context section]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Remediation changes stay limited to the reviewed workstream surfaces and do not spill into `030-opencode-plugin/`. [EVIDENCE: changed-file review stayed inside WS-1 through WS-6 runtime, packet, and agent surfaces]
- [x] CHK-051 [P1] Planning-only packet files remain truthful and do not claim completed implementation before evidence exists. [EVIDENCE: this phase packet now documents the completed implementation state and includes a packet-local implementation summary]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 9 | 9/9 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-04-03
<!-- /ANCHOR:summary -->
