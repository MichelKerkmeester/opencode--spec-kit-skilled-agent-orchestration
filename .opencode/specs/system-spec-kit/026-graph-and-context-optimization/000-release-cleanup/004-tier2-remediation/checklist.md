---
title: "Verification Checklist: Tier 2 Remediation"
template_source: "SPECKIT_TEMPLATE_SOURCE: checklist-core + level2-verify | v2.2"
description: "P0/P1/P2 gates for closing 15 Tier 2 D/E/F/G findings."
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/004-tier2-remediation"
    last_updated_at: "2026-04-28T19:30:00Z"
    last_updated_by: "codex-gpt-5-hygiene-pass"
    recent_action: "Strict-validator closure pass"
    next_safe_action: "Keep validators green"
    completion_pct: 100
trigger_phrases:
  - "004-tier2-remediation"
  - "validator hygiene"
importance_tier: "normal"
contextType: "verification"
---

# Verification Checklist: Tier 2 Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling |
|----------|----------|
| **P0** | HARD BLOCKER (none in this sub-phase; H deferred) |
| **P1** | Required |
| **P2** | Optional / advisory |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] **CHK-D01** [P1] REQ-001 Copilot current-turn decision documented as accept-and-document. [EVIDENCE: `008/007/decision-record.md:215`, `008/007/spec.md:109`]
- [x] **CHK-D02** [P1] REQ-002 008/007 checklist aligned with implementation-summary. [EVIDENCE: `008/007/checklist.md:88`]
- [x] **CHK-D03** [P2] REQ-009 `@path` large-prompt behavior verified or test-covered. [EVIDENCE: `mcp_server/tests/deep-loop/cli-matrix.vitest.ts:381`]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] **CHK-E01** [P1] REQ-003 path drift corrected in 009/005 spec/decision-record/implementation-summary. [EVIDENCE: `009/005/implementation-summary.md:161`]
- [x] **CHK-E02** [P2] REQ-010 P2-001 closed. [EVIDENCE: `009/005/checklist.md:125`, `.opencode/plugins/spec-kit-compact-code-graph.js:405`]
- [x] **CHK-E03** [P2] REQ-010 P2-002 closed. [EVIDENCE: `009/005/checklist.md:126`, `.opencode/plugins/spec-kit-compact-code-graph.js:146`]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] **CHK-F01** [P1] REQ-004 Copilot hook routing rationale explicit and restored. [EVIDENCE: `009/002/decision-record.md:95`, `.github/hooks/superset-notify.json:7`, `.github/hooks/superset-notify.json:21`]
- [x] **CHK-F02** [P1] REQ-005 custom-instructions cleanup/scoping contract added and documented. [EVIDENCE: `009/002/spec.md:121`, `custom-instructions.ts:129`]
- [x] **CHK-F03** [P2] REQ-011 managed-block diagnostics improvement closed. [EVIDENCE: `custom-instructions.ts:176`, `custom-instructions.ts:197`, `009/002/checklist.md:54`]
- [x] **CHK-F04** [P2] REQ-011 cross-release cleanup story documented. [EVIDENCE: `009/002/decision-record.md:110`, `009/002/checklist.md:55`]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] **CHK-G01** [P1] REQ-006 spec.md reflects completed 10-iter run, not "planned to start". [EVIDENCE: `006/008/spec.md:81`]
- [x] **CHK-G02** [P1] REQ-007 metadata path drift `010->006` corrected in description.json, graph-metadata.json, and spec.md frontmatter. [EVIDENCE: `006/008/spec.md:13`, `006/008/description.json:2`, `006/008/graph-metadata.json:3`]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] **CHK-G03** [P1] REQ-008 sibling 006/007 contradictions resolved. [EVIDENCE: `006/007/tasks.md:13`, `006/007/checklist.md:14`, `006/007/implementation-summary.md:355`]
- [x] **CHK-G04** [P2] REQ-012 acceptance criteria added to 006/008 spec.md. [EVIDENCE: `006/008/spec.md:81`]
- [x] **CHK-G05** [P2] REQ-013 research artifact references aligned with on-disk reality. [EVIDENCE: `006/008/spec.md:85`]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] **CHK-H01** [P1] H deferred document records the human-action gate. [EVIDENCE: `__tier2-h-deferred.md:11`, `__tier2-h-deferred.md:21`, `__tier2-h-deferred.md:29`]
- [x] **CHK-H02** [P1] No runtime-code edits are part of this strict-validator closure pass. [EVIDENCE: temporary hygiene summary records packet-level doc-only validation status]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

- [x] **CHK-V01** [P0] Strict validator exits 0 for this sub-phase after template restructuring. [EVIDENCE: temporary hygiene summary records the final strict-validator command and exit code]
- [x] **CHK-V02** [P1] No regressions in existing focused test suites of touched packets. [EVIDENCE: `implementation-summary.md:56`]
- [x] **CHK-V03** [P1] `implementation-summary.md` carries disposition for each of 15 actionable findings plus H deferral note. [EVIDENCE: `implementation-summary.md:31`, `implementation-summary.md:69`]
<!-- /ANCHOR:summary -->
