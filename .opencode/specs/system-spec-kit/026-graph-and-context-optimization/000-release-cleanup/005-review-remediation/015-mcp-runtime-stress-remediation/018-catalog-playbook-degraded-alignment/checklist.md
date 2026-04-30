---
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
title: "Verification Checklist: Catalog and playbook degraded-alignment [system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/018-catalog-playbook-degraded-alignment/checklist]"
description: "Verification Date: 2026-04-27"
template_source: "SPECKIT_TEMPLATE_SOURCE: checklist | v2.2"
trigger_phrases:
  - "catalog playbook degraded checklist"
  - "018 checklist"
  - "verification 018"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/018-catalog-playbook-degraded-alignment"
    last_updated_at: "2026-04-27T22:45:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored verification checklist"
    next_safe_action: "Run validate.sh --strict"
    blockers: []
    key_files: ["checklist.md"]
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Catalog and playbook degraded-alignment

<!-- SPECKIT_LEVEL: 1 -->
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
- [x] CHK-001 [P0] Requirements documented in `spec.md` (REQ-001..006). [EVIDENCE: REQ table at `spec.md` §4 lists six requirements covering F-005, F-007, F-008.]
- [x] CHK-002 [P0] Technical approach defined in `plan.md` (three Markdown edits, no code change). [EVIDENCE: `plan.md` §1 SUMMARY and §4 IMPLEMENTATION PHASES.]
- [x] CHK-003 [P0] Review-report §4 (F-005 / F-007 / F-008 doc parts) and §7 Packet C read end-to-end. [EVIDENCE: `../011-post-stress-followup-research/review/review-report.md` ingested by spec author; finding citations match.]
- [x] CHK-004 [P1] Source-of-truth Zod schema confirmed at `mcp_server/schemas/tool-input-schemas.ts:482-492` (`rankingSignals: z.array(z.string()).optional()`). [EVIDENCE: direct read of the schema file at the cited line range.]
- [x] CHK-005 [P1] Hardlink topology confirmed (`stat -f %l` returns 1 for all 3 target files; only `.opencode/` hosts them). [EVIDENCE: `stat -f "%i %l %N"` output saved at packet authoring time.]
- [x] CHK-006 [P1] Sibling packet 016 status checked (folder empty — write against expected contract from review-report §3 / §7 Packet A). [EVIDENCE: `ls .opencode/specs/.../016-degraded-readiness-envelope-parity/` shows empty folder at write time.]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Doc Quality
- [x] CHK-010 [P0] No code (`.ts`/`.js`/`.py`/`.sh`) file modified — REQ-004 invariant. [EVIDENCE: only Markdown and JSON files in the diff.]
- [x] CHK-011 [P0] No file in packets 003-015 / 016 / 017 modified — REQ-005 invariant. [EVIDENCE: diff scope limited to catalog/playbook + 018 packet folder.]
- [x] CHK-012 [P0] Catalog wording uses forward references (does NOT promise a specific field shape for context readiness-crash). [EVIDENCE: auto-trigger page uses footnote citing 016's implementation-summary instead of inline field name.]
- [x] CHK-013 [P1] Footnote in auto-trigger catalog page cites 016's implementation-summary by absolute path AND review-report §3 / §7 Packet A as binding-expectation fallback. [EVIDENCE: footnote `[^c016]` at end of recovery-routing paragraph.]
- [x] CHK-014 [P1] Wording "shared vocabulary, handler-local payload fields" appears in BOTH catalog pages (cross-doc consistency). [EVIDENCE: phrase verbatim in auto-trigger page and readiness-contract page §1 OVERVIEW.]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Verification (re-read)
- [x] CHK-020 [P0] Auto-trigger catalog page shows three per-handler bullets (query / context / status) — REQ-001. [EVIDENCE: bullet list at lines 22-26 of the modified file.]
- [x] CHK-021 [P0] Auto-trigger catalog page footnote references 016's implementation-summary — REQ-006. [EVIDENCE: footnote `[^c016]` cites verbatim absolute spec-folder path.]
- [x] CHK-022 [P0] Readiness-contract catalog page states the shared-vocabulary / handler-local-shape rule — REQ-002. [EVIDENCE: paragraph in §1 OVERVIEW.]
- [x] CHK-023 [P0] Readiness-contract catalog page lists concrete per-handler shape (query / context / status) — REQ-002. [EVIDENCE: three-bullet list following the rule.]
- [x] CHK-024 [P0] CocoIndex routing playbook page says `rankingSignals (array of strings)` (not `(object)`) — REQ-003. [EVIDENCE: prompt text and Expected paragraph both updated.]
- [x] CHK-025 [P0] CocoIndex routing playbook page Pass/Fail criterion asserts `Array<string>` shape — REQ-003. [EVIDENCE: Pass/Fail bullets updated.]
- [x] CHK-026 [P1] CocoIndex routing playbook page cites the Zod schema by file path + line range — REQ-003 traceability. [EVIDENCE: Expected paragraph cites `mcp_server/schemas/tool-input-schemas.ts:482-492`.]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security
- [x] CHK-030 [P1] No new secrets, env vars, credentials, or external network calls (docs-only). [EVIDENCE: prose-only edits.]
- [x] CHK-031 [P1] No runtime behavior change — purely documentation. [EVIDENCE: no executable file modified.]
- [x] CHK-032 [P2] No `description.json` / `graph-metadata.json` writes outside the 018 packet folder. [EVIDENCE: scope discipline.]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
- [x] CHK-040 [P0] `spec.md` REQ-001..006 documented. [EVIDENCE: REQ table at §4.]
- [x] CHK-041 [P0] `plan.md` phases all walked. [EVIDENCE: phases 1-4 covered with checkboxes in §4.]
- [x] CHK-042 [P0] `tasks.md` per-REQ traceability complete. [EVIDENCE: T101-T103 each cite (REQ-NNN).]
- [x] CHK-043 [P0] `implementation-summary.md` authored (NOT placeholder). [EVIDENCE: filled-in narrative + Files Changed table + Verification table.]
- [ ] CHK-044 [P1] `validate.sh --strict` PASS recorded. Pending: final validator run.
<!-- /ANCHOR:docs -->

---

### Scope Discipline
- [x] CHK-050 [P0] No code change — pure docs (REQ-004). [EVIDENCE: diff only contains `.md` and `.json` files.]
- [x] CHK-051 [P0] No edit to packet 016 / 017 docs or code (REQ-005). [EVIDENCE: those folders are untouched.]
- [x] CHK-052 [P0] No edit to packets 003-015 (frozen). [EVIDENCE: those folders are untouched.]
- [x] CHK-053 [P0] No new feature catalog page added — only existing pages edited. [EVIDENCE: only the three named files were modified under feature_catalog/manual_testing_playbook.]
- [x] CHK-054 [P1] `git diff --name-only` shows only `.md` + `.json` files in scope. [EVIDENCE: post-edit diff inspection.]
- [x] CHK-055 [P1] No per-runtime copies created (only `.opencode/skill/system-spec-kit/` hosts these files). [EVIDENCE: `find .gemini .claude .codex` returned no feature_catalog or manual_testing_playbook trees.]
