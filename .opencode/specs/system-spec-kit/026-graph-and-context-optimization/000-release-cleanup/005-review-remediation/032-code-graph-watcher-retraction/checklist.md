---
title: "Checklist: Code Graph Watcher Retraction"
template_source: "SPECKIT_TEMPLATE_SOURCE: checklist | v2.2"
description: "Verification checklist for packet 032 code-graph watcher retraction."
trigger_phrases:
  - "032-code-graph-watcher-retraction"
  - "code-graph watcher retraction"
  - "structural watcher doc fix"
  - "read-path graph freshness"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/032-code-graph-watcher-retraction"
    last_updated_at: "2026-04-29T13:58:12Z"
    last_updated_by: "cli-codex"
    recent_action: "Watcher claim retracted"
    next_safe_action: "Plan packet 033 next"
    blockers: []
    completion_pct: 100
---
# Verification Checklist: Code Graph Watcher Retraction

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

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

- [x] CHK-001 [P0] Requirements documented in spec.md. [EVIDENCE: spec.md requirements table]
- [x] CHK-002 [P0] Technical approach defined in plan.md. [EVIDENCE: plan.md architecture and phases]
- [x] CHK-003 [P1] Source research read and cited. [EVIDENCE: 013 report and iteration 004 read before edits]
- [x] CHK-004 [P1] Target docs read before editing. [EVIDENCE: README, system-spec-kit skill guide, CLAUDE.md, and hook reference inspected with line numbers]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Runtime code remains read-only. [EVIDENCE: no `.ts`, `.js`, `.py`, or shell implementation files edited]
- [x] CHK-011 [P0] Edits are limited to requested docs and packet docs. [EVIDENCE: README plus packet docs only for packet 032]
- [x] CHK-012 [P1] README documents read-path selective self-heal. [EVIDENCE: `.opencode/skill/system-spec-kit/mcp_server/README.md:521`]
- [x] CHK-013 [P1] README documents manual `code_graph_scan` full repair. [EVIDENCE: `.opencode/skill/system-spec-kit/mcp_server/README.md:523`]
- [x] CHK-014 [P1] README documents `code_graph_status` as read-only diagnostic. [EVIDENCE: `.opencode/skill/system-spec-kit/mcp_server/README.md:525`]
- [x] CHK-015 [P1] README documents query blocked required-action behavior. [EVIDENCE: `.opencode/skill/system-spec-kit/mcp_server/README.md:527`]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Strict validator exits 0. [EVIDENCE: final `validate.sh --strict` run]
- [x] CHK-021 [P1] Targeted `rg` checks find no current false structural watcher claim. [EVIDENCE: current operator docs only return negative README claims]
- [x] CHK-022 [P1] Targeted diff shows no runtime code edits. [EVIDENCE: changed implementation surface is README only]
- [x] CHK-023 [P1] JSON metadata parses and validator sees both metadata files. [EVIDENCE: strict validator `GRAPH_METADATA_PRESENT` passed]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets copied from user-level config. [EVIDENCE: packet cites only repo files and implementation line refs]
- [x] CHK-031 [P0] No destructive commands used. [EVIDENCE: no reset/checkout/delete commands used]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] README references 013 research-report reality matrix. [EVIDENCE: `.opencode/skill/system-spec-kit/mcp_server/README.md:519`]
- [x] CHK-041 [P1] System-spec-kit skill guide checked or patched for code-graph automation wording. [EVIDENCE: `.opencode/skill/system-spec-kit/SKILL.md:796-798`]
- [x] CHK-042 [P1] CLAUDE.md checked or patched for code-graph automation wording. [EVIDENCE: `CLAUDE.md:107`]
- [x] CHK-043 [P1] Hook-system reference checked or patched for code-graph automation wording. [EVIDENCE: `.opencode/skill/system-spec-kit/references/config/hook_system.md:76-101`]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Required seven packet files exist. [EVIDENCE: strict validator `FILE_EXISTS` passed]
- [x] CHK-051 [P1] Packet metadata JSON is valid and scoped to 032. [EVIDENCE: strict validator `GRAPH_METADATA_PRESENT` passed]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 15 | 15/15 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-04-29 — watcher retraction complete, validator green
<!-- /ANCHOR:summary -->
