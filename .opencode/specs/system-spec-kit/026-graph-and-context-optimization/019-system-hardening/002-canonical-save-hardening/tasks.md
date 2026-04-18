---
title: "Tasks: Canonical-Save Hardening"
description: "Task list for 3-wave canonical-save hardening child."
trigger_phrases:
  - "canonical save hardening tasks"
importance_tier: "critical"
contextType: "tasks"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/019-system-hardening/002-canonical-save-hardening"
    last_updated_at: "2026-04-18T23:40:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Tasks scaffolded"
    next_safe_action: "Begin T001"

---
# Tasks: Canonical-Save Hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

## Task Notation

- `[ ]` pending
- `[x]` complete with evidence
- P0 / P1 severity per spec

## Phase 1: Setup

- [ ] T001 Read research context: 019/001/001 research.md §4 P0 #1 + P0 #2 (P0)
- [ ] T002 Validate spec folder baseline: `validate.sh --strict --no-recursive` passes at start (P0)

## Phase 2: Implementation

### Wave A — Lineage runtime parity

- [ ] T003 Widen `mcp_server/api/indexing.ts` `refreshGraphMetadata()` to accept GraphMetadataRefreshOptions and forward to internal impl (P0)
- [ ] T004 Update caller in `scripts/core/workflow.ts:1434-1450` if signature changed (P0)
- [ ] T005 Rebuild dist: `npm run build --workspace=@spec-kit/mcp-server` or equivalent (P0)
- [ ] T006 Confirm `dist/core/workflow.js`, `dist/lib/graph/graph-metadata-parser.js`, `dist/lib/graph/graph-metadata-schema.js` include `save_lineage` field handling (P0)
- [ ] T007 Add regression test: workflow-level save produces `save_lineage: 'same_pass'` in graph-metadata.json (P0)
- [ ] T008 Add regression test: indexing API wrapper preserves refresh options (P0)
- [ ] T009 Commit+push Wave A with conventional commit message (P0)

### Wave B — Packet-root remediation

- [ ] T010 Author `026/007-release-alignment-revisits/spec.md` with coordination-parent content (P0)
- [ ] T011 Author `026/008-cleanup-and-audit/spec.md` (P0)
- [ ] T012 Author `026/009-playbook-and-remediation/spec.md` (P0)
- [ ] T013 Author `026/010-search-and-routing-tuning/spec.md` (P0)
- [ ] T014 Run `generate-context.js` for each of 007/008/009/010 to refresh description + graph-metadata (P0)
- [ ] T015 Verify `derived.source_docs` is non-empty for all 4 packets (P0)
- [ ] T016 Commit+push Wave B (P0)

### Wave C — Validator rollout

- [ ] T017 Create `scripts/rules/check-canonical-save.sh` with 5 rule implementations (P0)
- [ ] T018 Add dispatch entries to `scripts/spec/validate.sh` (P0)
- [ ] T019 Update `show_help()` in validate.sh to list 5 new rules (P0)
- [ ] T020 Author synthetic fixture set: broken + passing test cases (P1)
- [ ] T021 Run validator against fixtures, confirm expected pass/fail pattern (P0)
- [ ] T022 Run validator against full 026 tree with allowlist, confirm no unexpected failures (P0)
- [ ] T023 Document grandfathering cutoff timestamps in validator rule comments (P1)
- [ ] T024 Commit+push Wave C (P0)

## Phase 3: Verification

- [ ] T025 Run full mcp_server test suite, confirm green (P0)
- [ ] T026 Run `validate.sh --strict` on 026 tree, confirm green with allowlist (P0)
- [ ] T027 Update checklist.md with evidence for each item (P0)
- [ ] T028 Update implementation-summary.md post-completion (P0)
- [ ] T029 Mark all checklist items verified (P0)

## Completion Criteria

- All 3 Waves land with their Definition of Done met
- No regression in existing test suite
- Checklist.md shows all items `[x]` with evidence

## Cross-References

- Parent: `../spec.md`
- Source Research: `../001-initial-research/001-canonical-save-invariants/research.md`
- Parent Findings Registry: `../001-initial-research/findings-registry.json`
