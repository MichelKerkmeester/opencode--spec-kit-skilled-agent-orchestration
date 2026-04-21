<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
---
title: "Verification Checklist: Doc Surface Alignment: Graph Metadata Changes"
description: "Verification Date: 2026-04-13"
trigger_phrases:
  - "verification"
  - "graph metadata checklist"
  - "doc alignment"
  - "active-only validation"
importance_tier: "important"
contextType: "verification"
status: complete
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/005-doc-surface-alignment"
    last_updated_at: "2026-04-13T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Marked the packet verification checklist complete after the doc sweep and validator repair"
    next_safe_action: "Reference this checklist if later doc surfaces drift from the graph metadata parser contract"
    blockers: []
    key_files:
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:019-phase-005-doc-surface-alignment-checklist"
      session_id: "019-phase-005-doc-surface-alignment-checklist"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Which scanned surfaces were intentionally left unchanged"
---
# Verification Checklist: Doc Surface Alignment: Graph Metadata Changes

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The packet spec names the six graph-metadata behavior changes that must be reflected in docs. [EVIDENCE: spec.md sections 2-5]
- [x] CHK-002 [P0] Every requested surface was scanned before edits were made. [EVIDENCE: read pass across the listed command, guidance, skill, template, feature, playbook, and script files]
- [x] CHK-003 [P1] Verification-only surfaces were identified before patching so unchanged files could stay untouched. [EVIDENCE: `.opencode/skill/system-spec-kit/ARCHITECTURE.md` and `.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md` were read and left unchanged]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Updated docs now describe lowercase checklist-aware `status` derivation. [EVIDENCE: `.opencode/command/memory/save.md`, `.opencode/command/memory/manage.md`, `AGENTS.md`, `CLAUDE.md`, `.opencode/skill/system-spec-kit/SKILL.md`, `.opencode/skill/system-spec-kit/mcp_server/lib/graph/README.md`]
- [x] CHK-011 [P0] Updated docs now describe sanitized `key_files`, deduplicated `entities`, and the 12-item `trigger_phrases` cap. [EVIDENCE: `.opencode/command/memory/save.md`, `.opencode/skill/system-spec-kit/SKILL.md`, `.opencode/skill/system-spec-kit/mcp_server/lib/graph/README.md`, feature catalog 27, playbook 202]
- [x] CHK-012 [P1] Affected templates now use lowercase status examples. [EVIDENCE: `.opencode/skill/system-spec-kit/templates/handover.md`, `.opencode/skill/system-spec-kit/templates/debug-delegation.md`]
- [x] CHK-013 [P1] The patch set stays inside the requested surfaces plus packet-local documentation. [EVIDENCE: touched files match the requested scan list and this packet folder]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Focused text sweeps confirm the new contract language appears on the updated surfaces. [EVIDENCE: `rg -n -i "checklist-aware|active-only|lowercase|trigger_phrases|key_files|deduplicated entities" ...`]
- [x] CHK-021 [P0] Strict packet validation passes after the Level 2 packet docs were repaired. [EVIDENCE: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh --strict .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/005-doc-surface-alignment`]
- [x] CHK-022 [P1] `git diff --check` passes for the touched files. [EVIDENCE: `git diff --check -- <touched files>`]
- [x] CHK-023 [P1] The metadata feature and playbook pair now validate the refreshed graph-metadata surface, not just `_memory.continuity`. [EVIDENCE: feature catalog 27 and playbook 202 now mention parser-contract checks]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Backfill guidance does not imply archived folders are skipped by default. [EVIDENCE: `.opencode/command/memory/manage.md`, `AGENTS.md`, `CLAUDE.md`, `.opencode/skill/system-spec-kit/SKILL.md`, script header]
- [x] CHK-031 [P0] Lowercase status guidance does not weaken existing packet-state meaning; it only describes storage normalization. [EVIDENCE: updated docs frame lowercase values as normalized storage/runtime output]
- [x] CHK-032 [P1] No secrets, credentials, or unsafe commands were introduced while documenting backfill behavior. [EVIDENCE: touched surfaces are markdown/text guidance plus a source comment header]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Command docs, guidance docs, runtime reference, feature catalog, and playbook now tell the same graph-metadata story. [EVIDENCE: updated surface set reflects the same six behavior changes]
- [x] CHK-041 [P1] Packet-local `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` all use the active Level 2 template structure. [EVIDENCE: strict validator passed after template repair]
- [x] CHK-042 [P2] Unchanged scanned surfaces are called out explicitly in the packet docs. [EVIDENCE: `implementation-summary.md` and this checklist note why `.opencode/skill/system-spec-kit/ARCHITECTURE.md` and `.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md` were left unchanged]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Packet-local docs live only inside this spec folder. [EVIDENCE: `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` created under `005-doc-surface-alignment/`]
- [x] CHK-051 [P1] No scratch or temporary files were introduced as part of the packet repair. [EVIDENCE: working tree diff contains only requested surfaces plus packet docs]
- [x] CHK-052 [P2] The backfill guidance appears in operator-facing docs and the inline script surface, so no extra README was needed. [EVIDENCE: `.opencode/command/memory/manage.md` plus `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts` header]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 10 | 10/10 |
| P2 Items | 4 | 4/4 |

**Verification Date**: 2026-04-13
<!-- /ANCHOR:summary -->
