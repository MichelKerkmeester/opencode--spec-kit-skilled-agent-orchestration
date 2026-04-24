---
title: "Verification Checklist: Release Cleanup Playbooks [system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks/checklist]"
description: "Consolidated verification checklist covering documentation parity revisits, runtime cleanup and audit, and playbook plus deep-review remediation — plus the root-only flatten verification."
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
trigger_phrases:
  - "005-release-cleanup-playbooks checklist"
  - "release cleanup playbooks verification"
  - "phase 5 checklist 026"
  - "release alignment checklist"
  - "cleanup audit checklist"
  - "playbook remediation checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks"
    last_updated_at: "2026-04-24T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Created consolidated root checklist"
    next_safe_action: "Reference only; work complete"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:merge-phases-root-only-2026-04-24"
      session_id: "026-phase-005-merge-root-only-2026-04-24"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
status: complete
---
# Verification Checklist: Release Cleanup Playbooks

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

- [x] [P0] This packet records three workstreams and one consolidation pass with evidence in `implementation-summary.md`. [EVIDENCE: implementation-summary.md]
- [x] [P1] Root docs are the single source of truth; prior per-phase docs are preserved in git history only. [EVIDENCE: packet root directory listing]
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] [P0] CHK-001 Documentation parity scope locked to the 016 reference-map file lists. [EVIDENCE: implementation-summary.md §Workstream A]
- [x] [P1] CHK-002 Phase 018 continuity contract re-read before edits began in each doc-parity pass. [EVIDENCE: implementation-summary.md §Workstream A]
- [x] [P0] CHK-003 Shared-memory deletion scope confirmed as hard-delete (no deprecation surface). [EVIDENCE: implementation-summary.md §Workstream B]
- [x] [P1] CHK-004 `graph-metadata.json` schema design reviewed before rollout. [EVIDENCE: implementation-summary.md §Workstream B]
- [x] [P1] CHK-005 MCP config scope locked to five Public configs. [EVIDENCE: implementation-summary.md §Workstream B]
- [x] [P1] CHK-006 Playbook runner retargeted to the active packet path before the live sweep. [EVIDENCE: implementation-summary.md §Workstream C]
- [x] [P1] CHK-007 All 22 deep-review findings triaged before Wave 1 fixes. [EVIDENCE: implementation-summary.md §Workstream C]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] [P0] CHK-010 Save-path guidance in all updated docs points to `generate-context.js`. [EVIDENCE: implementation-summary.md §Workstream A]
- [x] [P0] CHK-011 Recovery guidance in all updated docs describes `handover -> _memory.continuity -> spec docs`. [EVIDENCE: implementation-summary.md §Workstream A]
- [x] [P0] CHK-012 Active-state guidance in all updated docs uses only `HOT`, `WARM`, `COLD`, `DORMANT`. [EVIDENCE: implementation-summary.md §Workstream A]
- [x] [P0] CHK-013 Shared-memory handler, shared-spaces library, governance / HYDRA / archival flags fully removed from active TypeScript. [EVIDENCE: implementation-summary.md §Workstream B grep results]
- [x] [P0] CHK-014 `graph-metadata.json` schema, parser, canonical-save hook, indexing, causal-edge processing, and backfill CLI shipped. [EVIDENCE: implementation-summary.md §Workstream B]
- [x] [P0] CHK-015 Five Public MCP configs aligned to the minimal canonical env block (`EMBEDDINGS_PROVIDER=auto` + `_NOTE_*` in the same order). [EVIDENCE: implementation-summary.md §Workstream B]
- [x] [P0] CHK-016 Dead imports, dead locals, dead helper paths, and raw runtime `console.log` removed from production runtime modules. [EVIDENCE: implementation-summary.md §Workstream B]
- [x] [P0] CHK-017 All 22 deep-review findings resolved with code, documentation, or test evidence in Waves 1 / 2 / 3. [EVIDENCE: implementation-summary.md §Workstream C]
- [x] [P1] CHK-018 Playbook scaffold restored to Level 2 template structure with strict validation PASS. [EVIDENCE: implementation-summary.md §Workstream C]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] [P0] CHK-020 All 71 edited documentation files were re-read after patching across the three doc-parity passes. [EVIDENCE: implementation-summary.md §Workstream A]
- [x] [P0] CHK-021 `tsc --noEmit` (both workspaces) passed after each code-touching pass. [EVIDENCE: implementation-summary.md §Verification]
- [x] [P0] CHK-022 `vitest run` on affected suites passed (incl. 15 files / 363 tests in Wave 3). [EVIDENCE: implementation-summary.md §Verification]
- [x] [P1] CHK-023 Vitest blocker rerun for `handler-helpers` and `spec-doc-structure` PASS (2 files, 78 tests). [EVIDENCE: implementation-summary.md §Workstream C]
- [x] [P0] CHK-024 `grep -rn "SPECKIT_HYDRA"`, `"SPECKIT_ARCHIVAL"`, `"SCOPE_ENFORCEMENT"` on active TS (non-test) returns 0 matches. [EVIDENCE: implementation-summary.md §Verification]
- [x] [P0] CHK-025 `graph-metadata.json` backfill coverage: 515/515 spec-folder roots at rollout time. [EVIDENCE: implementation-summary.md §Workstream B verification table]
- [x] [P0] CHK-026 Env-block parity across all five Public MCP configs verified identical. [EVIDENCE: implementation-summary.md §Workstream B verification table]
- [x] [P1] CHK-027 Live manual playbook runner evidence captured: 300 discovered, 290 parsed, 10 parse failures, seeding abort. [EVIDENCE: implementation-summary.md §Workstream C known limitations]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] [P1] CHK-030 `shared_space_id` schema-column exception documented: columns retained for backward-compatible DB migration; not used by runtime. [EVIDENCE: implementation-summary.md §Workstream B known limitations]
- [x] [P1] CHK-031 Manual `graph-metadata.json` relationship arrays start empty (no invented packet relationships). [EVIDENCE: implementation-summary.md §Workstream B]
- [x] [P1] CHK-032 Seven stale `.agents/commands/` mirror wrappers documented with sandbox `Operation not permitted` evidence. [EVIDENCE: implementation-summary.md §Workstream A known limitations]
- [x] [P1] CHK-033 Wave 2 replaced the absolute path in `.gemini/settings.json` with a relative path. [EVIDENCE: implementation-summary.md §Workstream C]
- [x] [P1] CHK-034 Legitimate archive-folder, packet-status, and constitutional-memory references were preserved. [EVIDENCE: implementation-summary.md §Workstream A]
- [x] [P1] CHK-035 Manual prompt spot-check is recorded as an explicit deferral, not silently dropped. [EVIDENCE: implementation-summary.md §Workstream C known limitations]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] [P0] CHK-040 Consolidated evidence recorded in `implementation-summary.md`. [EVIDENCE: implementation-summary.md]
- [x] [P0] CHK-041 Every completed sub-phase passed `validate.sh --strict` at closure time (sub-phase 002 not re-run at packet level; Phase 014 `CONTINUITY_FRESHNESS` caveat documented). [EVIDENCE: implementation-summary.md §Verification]
- [x] [P1] CHK-042 Architecture narrative rewritten against live modules. [EVIDENCE: implementation-summary.md §Workstream B]
- [x] [P0] CHK-043 Root-only flatten verified: no `001-*/`, `002-*/`, or `003-*/` child folders remain; no context-index file. [EVIDENCE: packet root directory listing]
- [x] [P0] CHK-044 `validate.sh --strict --no-recursive` PASS at the flattened packet root. [EVIDENCE: implementation-summary.md §Verification]
- [x] [P1] CHK-045 `description.json` and `graph-metadata.json` describe a childless, complete packet (`children_ids: []`, `status: complete`, no `spec_phase` entities). [EVIDENCE: `description.json`, `graph-metadata.json`]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] [P2] CHK-050 The packet root contains only root docs, metadata JSONs, `path-references-audit.md`, and the support directories `research/` and `review/`. [EVIDENCE: packet root directory listing]
- [x] [P2] CHK-051 The `008-cleanup-and-audit-pt-01` deep-review archive is preserved under root `review/` after the phase-002 folder deletion. [EVIDENCE: `review/008-cleanup-and-audit-pt-01/` listing]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| Pre-implementation | 7 | 7/7 |
| Code quality | 9 | 9/9 |
| Testing | 8 | 8/8 |
| Security / exceptions | 6 | 6/6 |
| Documentation + packet closure | 6 | 6/6 |
| File organization | 2 | 2/2 |
<!-- /ANCHOR:summary -->
