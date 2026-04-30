---
title: "Verification Checklist: v1.0.4 Full-Matrix Stress Test Design"
template_source: "SPECKIT_TEMPLATE_SOURCE: checklist | v2.2"
description: "Design-phase verification checklist and future execution DQI gates for the full-matrix v1.0.4 stress test."
trigger_phrases:
  - "full matrix checklist"
  - "v1.0.4 full matrix DQI"
  - "stress execution gates"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/030-v1-0-4-full-matrix-stress-test-design"
    last_updated_at: "2026-04-29T11:40:34Z"
    last_updated_by: "codex"
    recent_action: "Checklist authored"
    next_safe_action: "Use future execution DQI gates when a separate execution packet is approved"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:030-full-matrix-checklist"
      session_id: "030-full-matrix-design"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Verification Checklist: v1.0.4 Full-Matrix Stress Test Design

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | Hard blocker | Cannot claim design phase complete until checked |
| **[P1]** | Required | Must complete or explicitly defer |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Target authority limited to this packet folder. [EVIDENCE: user pre-approved Gate 3 target and scope; docs restate no writes elsewhere.]
- [x] CHK-002 [P0] Requirements documented in `spec.md`. [EVIDENCE: `spec.md` sections 4 and 7.]
- [x] CHK-003 [P0] Technical approach defined in `plan.md`. [EVIDENCE: `plan.md` architecture, rubric, harness, and CLI sub-plan sections.]
- [x] CHK-004 [P1] Corpus design extracted to `corpus-plan.md`. [EVIDENCE: record shape, matrix size, scenario seeds, and applicability table.]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] No runtime code was modified. [EVIDENCE: this packet contains only design docs and metadata.]
- [x] CHK-011 [P0] No stress matrix was run. [EVIDENCE: no findings or measurements artifacts were created.]
- [x] CHK-012 [P1] Design uses existing project templates and Level 3 structure. [EVIDENCE: template comments in authored docs.]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Matrix covers all requested F1-F14 surfaces. [EVIDENCE: `spec.md` feature matrix and `corpus-plan.md` scenario seeds.]
- [x] CHK-021 [P0] Executor matrix covers cli-codex, cli-copilot, cli-gemini, cli-claude-code, cli-opencode, native, and inline. [EVIDENCE: `spec.md` executor matrix and `plan.md` CLI sub-plan.]
- [x] CHK-022 [P1] Rubric design preserves canonical 4 dimensions and 0-2 scale. [EVIDENCE: `plan.md` rubric design section.]
- [x] CHK-023 [P1] Harness-extension options A/B/C documented and one recommended. [EVIDENCE: `decision-record.md` ADR-004.]
- [x] CHK-024 [P1] Future execution tasks sequenced. [EVIDENCE: `tasks.md`.]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets required or requested during design. [EVIDENCE: design uses read-only discovery and packet-local writes.]
- [x] CHK-031 [P1] Execution plan requires `SKIP` for unavailable auth/index rather than credential workarounds. [EVIDENCE: `spec.md` edge cases and `corpus-plan.md` applicability rules.]
- [x] CHK-032 [P1] Destructive future cells constrained to disposable sandboxes. [EVIDENCE: `spec.md` non-functional requirements.]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks, checklist, decision record, corpus plan, implementation summary, description, and graph metadata exist. [EVIDENCE: packet file list.]
- [x] CHK-041 [P1] Existing surfaces are cited with file:line evidence. [EVIDENCE: `spec.md`, `plan.md`, and `corpus-plan.md` cite catalog, playbook, harness, CLI, hook, validator, and prior-packet files.]
- [x] CHK-042 [P1] Comparability caveat is explicit. [EVIDENCE: `spec.md` executive summary and `decision-record.md` ADR-006.]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files were not created inside this packet. [EVIDENCE: packet file list contains docs and metadata only.]
- [x] CHK-051 [P1] Packet metadata files exist: `description.json` and `graph-metadata.json`. [EVIDENCE: both metadata files are present in this packet.]
<!-- /ANCHOR:file-org -->

---

### Future Execution DQI Gates

These gates are for the future execution packet. They are not checked in this design packet because no matrix was run.

| Gate | Execution Phase | Required Evidence | Fail Condition |
|------|-----------------|-------------------|----------------|
| DQI-001 | Pre-flight | One harmless cell per executor with PASS/SKIP evidence | Any executor assumed available without smoke |
| DQI-002 | Corpus freeze | Manifest hash, cell counts, applicability counts | Scoring begins before manifest freeze |
| DQI-003 | Per-feature batch | Cell JSONL rows for every applicable scenario | Missing row without `NA`/`SKIP` reason |
| DQI-004 | Aggregation | Sidecar aggregate math and denominator proof | `NA`/`SKIP` included in score denominator |
| DQI-005 | Regression review | Hunter -> Skeptic -> Referee for each dropped same-cell score | REGRESSION published from delta alone |
| DQI-006 | Artifact integrity | JSON/JSONL parse checks and artifact list | Malformed sidecar or unparseable JSONL |
| DQI-007 | Strict validation | `validate.sh <execution-packet> --strict` exit 0 | Validator warning/error left unresolved |
| DQI-008 | Scope hygiene | Dirty-worktree diff limited to execution target | Runtime/prior packet mutation without authority |

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 12 | 12/12 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-04-29
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decisions documented in `decision-record.md`. [EVIDENCE: ADR-001 through ADR-007.]
- [x] CHK-101 [P1] ADRs have status. [EVIDENCE: each ADR metadata table marks Status as Accepted.]
- [x] CHK-102 [P1] Alternatives documented with rejection rationale. [EVIDENCE: each ADR includes Alternatives Considered and Why this one.]
- [x] CHK-103 [P2] Migration path documented where applicable. [EVIDENCE: execution phase separated from design phase.]
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] All spec documents synchronized. [EVIDENCE: docs share Level 3 design-only scope and execution-pending status.]
- [x] CHK-141 [P1] Existing surface evidence cited. [EVIDENCE: discovery citations appear across `spec.md`, `plan.md`, and `corpus-plan.md`.]
- [x] CHK-142 [P2] User-facing documentation not applicable; this is internal packet design. [EVIDENCE: no user-facing docs were requested.]
<!-- /ANCHOR:docs-verify -->
