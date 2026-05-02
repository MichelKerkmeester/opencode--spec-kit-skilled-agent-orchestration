---
title: "Checklist: 014-agents-md-alignment [system-spec-kit/022-hybrid-rag-fusion/014-agents-md-alignment/checklist]"
description: "Level 2 verification checklist for AGENTS.md Quick Reference alignment."
trigger_phrases:
  - "014 checklist"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/022-hybrid-rag-fusion/014-agents-md-alignment"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["checklist.md"]
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: 014-agents-md-alignment

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

- [x] CHK-001 [P0] Constitutional memory row updated in all 3 files -- shows `list | edit | remove | budget` subcommands [EVIDENCE: Grep `list.*edit.*remove.*budget` returns 3 matches (AGENTS.md:66, FS:92, Barter:98)]
- [x] CHK-002 [P0] Database maintenance row includes `ingest` in all 3 files [EVIDENCE: Grep `ingest operations` returns 3 matches (AGENTS.md:62, FS:88, Barter:94)]
- [x] CHK-003 [P0] Search or analysis row (`/memory:search`) present in all 3 files [EVIDENCE: Grep `/memory:search` returns 3 matches across the three governance files.]
- [x] CHK-004 [P0] Shared memory lifecycle row (`/memory:manage shared`) present in all 3 files [EVIDENCE: Grep `/memory:manage shared` returns 3 matches across the three governance files.]
- [x] CHK-005 [P0] Barter READ-ONLY git policy preserved [EVIDENCE: Grep `Read-only` returns matches (Barter:67, 87, 400)]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-006 [P1] FS-Enterprises Research/exploration row includes `memory_context()` unified alternative [EVIDENCE: Grep `memory_context.*unified` returns 1 match (FS:71)]
- [x] CHK-007 [P1] FS-Enterprises stack detection table preserved (lines 11-19 unchanged) [EVIDENCE: verified via diff]
- [x] CHK-008 [P1] Quick Reference table row order consistent across all 3 files [EVIDENCE: manual comparison]
- [x] CHK-009 [P1] No accidental removal of variant-specific rows (Go/Angular/Swift verification, Git analysis) [EVIDENCE: verified via diff]
- [x] CHK-010 [P2] Table column alignment visually consistent within each file [EVIDENCE: visual inspection]
- [x] CHK-011 [P2] Spec documentation (Level 2) complete: spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md [EVIDENCE: all files present]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

### Refinement Pass (2026-03-16)

- [x] CHK-012 [P0] G-01: FS Resume prior work row has `/memory:continue` + `memory_search()` [EVIDENCE: Grep `memory:continue` returns 4/4 (AGENTS.md, FS, Barter, CLAUDE.md)]
- [x] CHK-013 [P0] G-02: FS Save context row has `/memory:save` [EVIDENCE: Grep `memory:save` returns 4/4 (AGENTS.md, FS, Barter, CLAUDE.md)]
- [x] CHK-014 [P0] G-06: File modification row shows `Gate 3 -> Gate 1 -> Gate 2` in all 4 files [EVIDENCE: Grep `Gate 3.*ask spec folder.*Gate 1.*Gate 2` returns 4/4; old ordering returns 0 matches]
- [x] CHK-015 [P1] G-03/G-04: No trailing extra pipe on Claim completion rows [EVIDENCE: Grep returns 0 matches]
- [x] CHK-016 [P1] G-05: FS Documentation row has `validate_document.py` [EVIDENCE: Grep `validate_document.py` in Quick Reference returns 4/4]
- [x] CHK-017 [P1] GPT-5.4 ultra-think cross-AI review completed (Analytical 88, Critical 92, Holistic 88) [EVIDENCE: live session scores, no preserved artifact in packet]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-018 [P0] No secrets or credentials introduced [EVIDENCE: documentation-only changes]
- [x] CHK-019 [P1] Barter git policy preserved across all edits [EVIDENCE: Grep `GIT POLICY: READ-ONLY` returns 1 match]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-020 [P1] Universal skill section references sk-code-opencode with system-spec-kit + memory system [EVIDENCE: verified via grep]
- [x] CHK-021 [P1] FS skill section references sk-code-full-stack with 3-phase lifecycle + stack verification [EVIDENCE: verified via grep]
- [x] CHK-022 [P1] Both files reference sk-git with full workflow (Worktree / Commit / Finish) [EVIDENCE: verified via grep]
- [x] CHK-023 [P1] Changelog v2.2.0.0 created [EVIDENCE: file exists at .opencode/changelog/02--agents-md/]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-024 [P1] Write scope stayed inside the canonical 014 packet plus the 3 AGENTS.md files [EVIDENCE: scoped edits only]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 7/7 |
| P1 Items | 11 | 11/11 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-03-16
<!-- /ANCHOR:summary -->

---
