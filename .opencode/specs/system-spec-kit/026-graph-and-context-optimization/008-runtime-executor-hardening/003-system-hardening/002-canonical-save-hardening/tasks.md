---
title: "...raph-and-context-optimization/008-runtime-executor-hardening/003-system-hardening/002-canonical-save-hardening/tasks]"
description: "Task list for 3-wave canonical-save hardening child."
trigger_phrases:
  - "canonical save hardening tasks"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/003-system-hardening/002-canonical-save-hardening"
    last_updated_at: "2026-04-18T22:20:00Z"
    last_updated_by: "codex-gpt-5.4"
    recent_action: "Implemented Waves A-C and updated verification evidence"
    next_safe_action: "Orchestrator review and commit"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
---
# Tasks: Canonical-Save Hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

## Task Notation

- `[ ]` pending
- `[x]` complete with evidence
- P0 / P1 severity per spec

## Phase 1: Setup

- [x] T001 Read research context: 019/001/001 research.md §4 P0 #1 + P0 #2 (P0) — evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/003-system-hardening/001-initial-research/001-canonical-save-invariants/research/019-system-hardening-pt-04/research.md` read before implementation
- [ ] T002 Validate spec folder baseline: `validate.sh --strict --no-recursive` passes at start (P0) — not complete: baseline validation had inherited anchor/reference and sandbox `tsx` execution blockers before implementation

## Phase 2: Implementation

### Wave A — Lineage runtime parity

- [x] T003 Widen `mcp_server/api/indexing.ts` `refreshGraphMetadata()` to accept GraphMetadataRefreshOptions and forward to internal impl (P0) — evidence: `.opencode/skill/system-spec-kit/mcp_server/api/indexing.ts:96`
- [x] T004 Update caller in `scripts/core/workflow.ts:1434-1450` if signature changed (P0) — evidence: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1447`
- [x] T005 Rebuild dist: `npm run build --workspace=@spec-kit/mcp-server` or equivalent (P0) — evidence: relevant dist artifacts verified at `.opencode/skill/system-spec-kit/mcp_server/dist/api/indexing.js:67` and `.opencode/skill/system-spec-kit/scripts/dist/core/workflow.js:1170`
- [x] T006 Confirm `dist/core/workflow.js`, `dist/lib/graph/graph-metadata-parser.js`, `dist/lib/graph/graph-metadata-schema.js` include `save_lineage` field handling (P0) — evidence: `.opencode/skill/system-spec-kit/mcp_server/dist/lib/graph/graph-metadata-parser.js:858`, `.opencode/skill/system-spec-kit/mcp_server/dist/lib/graph/graph-metadata-schema.js:9`
- [x] T007 Add regression test: workflow-level save produces `save_lineage: 'same_pass'` in graph-metadata.json (P0) — evidence: `.opencode/skill/system-spec-kit/scripts/tests/workflow-canonical-save-metadata.vitest.ts:239`
- [x] T008 Add regression test: indexing API wrapper preserves refresh options (P0) — evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/follow-up-api.vitest.ts:78`
- [ ] T009 Commit+push Wave A with conventional commit message (P0) — orchestrator-owned; user instructed not to commit or push

### Wave B — Packet-root remediation

- [x] T010 Author `026/007-release-alignment-revisits/spec.md` with coordination-parent content (P0) — evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks/001-release-alignment-revisits/spec.md:1`
- [x] T011 Author `026/008-cleanup-and-audit/spec.md` (P0) — evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks/002-cleanup-and-audit/spec.md:1`
- [x] T012 Author `026/009-playbook-and-remediation/spec.md` (P0) — evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks/003-playbook-and-remediation/spec.md:1`
- [x] T013 Author `026/010-search-and-routing-tuning/spec.md` (P0) — evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/spec.md:1`
- [x] T014 Run `generate-context.js` for each of 007/008/009/010 to refresh description + graph-metadata (P0) — evidence: description timestamps at `007-release-alignment-revisits/description.json:38`, `008-cleanup-and-audit/description.json:38`, `009-playbook-and-remediation/description.json:37`, `010-search-and-routing-tuning/description.json:38`
- [x] T015 Verify `derived.source_docs` is non-empty for all 4 packets (P0) — evidence: `007-release-alignment-revisits/graph-metadata.json:95`, `008-cleanup-and-audit/graph-metadata.json:97`, `009-playbook-and-remediation/graph-metadata.json:95`, `010-search-and-routing-tuning/graph-metadata.json:95`
- [ ] T016 Commit+push Wave B (P0) — orchestrator-owned; user instructed not to commit or push

### Wave C — Validator rollout

- [x] T017 Create `scripts/rules/check-canonical-save.sh` with 5 rule implementations (P0) — evidence: `.opencode/skill/system-spec-kit/scripts/rules/check-canonical-save.sh:1` and `.opencode/skill/system-spec-kit/scripts/rules/check-canonical-save-helper.cjs:125`
- [x] T018 Add dispatch entries to `scripts/spec/validate.sh` (P0) — evidence: `.opencode/skill/system-spec-kit/scripts/spec/validate.sh:418` and `.opencode/skill/system-spec-kit/scripts/spec/validate.sh:447`
- [x] T019 Update `show_help()` in validate.sh to list 5 new rules (P0) — evidence: `.opencode/skill/system-spec-kit/scripts/spec/validate.sh:105`
- [x] T020 Author synthetic fixture set: broken + passing test cases (P1) — evidence: `.opencode/skill/system-spec-kit/scripts/tests/canonical-save-validation.vitest.ts:126`
- [x] T021 Run validator against fixtures, confirm expected pass/fail pattern (P0) — evidence: `node scripts/node_modules/vitest/vitest.mjs run scripts/tests/canonical-save-validation.vitest.ts --config mcp_server/vitest.config.ts` → 1 file passed, 6 tests passed
- [x] T022 Run validator against full 026 tree with allowlist, confirm no unexpected failures (P0) — evidence: canonical-save rule pack on full 026 tree → 19 phases, 0 errors, 0 warnings
- [x] T023 Document grandfathering cutoff timestamps in validator rule comments (P1) — evidence: `.opencode/skill/system-spec-kit/scripts/rules/check-canonical-save.sh:6`
- [ ] T024 Commit+push Wave C (P0) — orchestrator-owned; user instructed not to commit or push

## Phase 3: Verification

- [ ] T025 Run full mcp_server test suite, confirm green (P0) — not complete: targeted mcp-server regression equivalent passed 3 files / 19 tests, but broad workspace suite is not claimed green due unrelated baseline failures
- [x] T026 Run `validate.sh --strict` on 026 tree, confirm green with allowlist (P0) — evidence: `SPECKIT_RULES='CANONICAL_SAVE_ROOT_SPEC_REQUIRED,CANONICAL_SAVE_SOURCE_DOCS_REQUIRED,CANONICAL_SAVE_LINEAGE_REQUIRED,CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED,CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS' bash .../validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization --recursive --strict --verbose` → RESULT PASSED
- [x] T027 Update checklist.md with evidence for each item (P0) — evidence: `checklist.md` updated in this packet
- [x] T028 Update implementation-summary.md post-completion (P0) — evidence: `implementation-summary.md` updated in this packet
- [ ] T029 Mark all checklist items verified (P0) — not complete: checklist intentionally leaves orchestrator-owned commit/broad-baseline items open

## Completion Criteria

- All 3 Waves land with their Definition of Done met
- No regression in existing test suite
- Checklist.md shows all items `[x]` with evidence

## Cross-References

- Parent: `../spec.md`
- Source Research: `../001-initial-research/001-canonical-save-invariants/research.md`
- Parent Findings Registry: `../001-initial-research/findings-registry.json`
