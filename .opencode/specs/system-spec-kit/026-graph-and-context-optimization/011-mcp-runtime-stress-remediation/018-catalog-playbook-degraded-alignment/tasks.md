---
# SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2
title: "Tasks: Catalog and playbook degraded-alignment [system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/018-catalog-playbook-degraded-alignment/tasks]"
description: "Per-REQ work units for the docs-only Packet C alignment. Three Markdown edits plus 7 packet docs."
trigger_phrases:
  - "catalog playbook degraded tasks"
  - "018 tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/018-catalog-playbook-degraded-alignment"
    last_updated_at: "2026-04-27T22:45:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Decomposed work units"
    next_safe_action: "Author checklist.md and remaining packet files"
    blockers: []
    key_files: ["tasks.md"]
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Catalog and playbook degraded-alignment

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] T001 Read `../011-post-stress-followup-research/review/review-report.md` §4 (F-005 / F-007 / F-008 doc parts) and §7 Packet C end-to-end
- [x] T002 [P] Read the auto-trigger catalog page at `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/15-code-graph-auto-trigger.md` lines 15-23 (the `fallbackDecision` bullet)
- [x] T003 [P] Read the readiness-contract catalog page at `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/24-code-graph-readiness-contract.md` §1 OVERVIEW
- [x] T004 [P] Read the CocoIndex routing playbook page at `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md` lines 133-144 (rankingSignals shape)
- [x] T005 [P] Read `mcp_server/schemas/tool-input-schemas.ts:482-492` to confirm Zod shape
- [x] T006 [P] Verify hardlink topology with `stat -f %l` on the 3 target files (link count = 1 confirmed; only `.opencode/` hosts these files)
- [x] T007 [P] Check sibling packet 016 status (folder empty — write against expected contract from review-report §3 / §7 Packet A)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T101 (REQ-001) Edit auto-trigger catalog page — split the single `fallbackDecision` bullet into three per-handler bullets (query / context / status). Add footnote citing 016's implementation-summary (absolute spec-folder path) plus review-report §3 / §7 Packet A as binding-expectation fallback while 016 is in flight
- [x] T102 (REQ-002) Edit readiness-contract catalog page — replace the implied "single shared response type" wording with explicit "shared vocabulary, handler-local payload fields" rule. List concrete per-handler shape (query / context / status). Cross-reference packet 016 for the context readiness-crash envelope
- [x] T103 (REQ-003) Edit CocoIndex routing playbook page — change `rankingSignals (object)` to `rankingSignals (array of strings)`. Cite the Zod schema by file path + line range. Update Pass/Fail criterion to assert `Array<string>` shape
- [x] T104 Author packet docs: spec, plan, tasks (this file), checklist, description.json, graph-metadata.json, implementation-summary (filled in, NOT placeholder); set parent_id=011 phase parent, depends_on=[011-post-stress-followup-research, 016-degraded-readiness-envelope-parity, 014-graph-status-readiness-snapshot, 015-cocoindex-seed-telemetry-passthrough], related_to=[005-code-graph-fast-fail]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [ ] T201 Run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/018-catalog-playbook-degraded-alignment --strict` — PASS
- [ ] T202 Re-read auto-trigger catalog page to confirm REQ-001 (per-handler bullets + footnote)
- [ ] T203 Re-read readiness-contract catalog page to confirm REQ-002 (shared-vocabulary rule + per-handler paragraphs)
- [ ] T204 Re-read CocoIndex routing playbook page to confirm REQ-003 (`rankingSignals (array of strings)` + Pass/Fail update)
- [ ] T205 `git diff --name-only` confirms no code files modified (only `.md` and `.json` under the catalog/playbook + 018 packet folder) — REQ-004 + REQ-005 verification
- [ ] T206 Confirm REQ-006 — verbatim absolute path `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/016-degraded-readiness-envelope-parity/implementation-summary.md` is present in the catalog footnote
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All Phase 1-2 tasks `[x]`
- [ ] Phase 3 T201-T206 `[x]`
- [ ] REQ-001..006 verified per Acceptance Scenarios in spec
- [ ] No commit (deferred to user — packet contract per task instructions)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Sources**:
  - `../011-post-stress-followup-research/review/review-report.md` §4 (F-005 / F-007 / F-008 doc parts) and §7 Packet C — primary source of truth
- **Related siblings**:
  - `../016-degraded-readiness-envelope-parity/` — Packet A (in flight); catalog forward references
  - `../014-graph-status-readiness-snapshot/` — provides status `getGraphReadinessSnapshot()` helper this packet documents
  - `../015-cocoindex-seed-telemetry-passthrough/` — provides the Zod schema this packet cites
  - `../005-code-graph-fast-fail/` — historical context for graph degraded-state policy (related_to link in graph metadata)
<!-- /ANCHOR:cross-refs -->
