---
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
title: "Tasks: 004 Validation And Memory Remediation [template:level_2/tasks.md]"
description: "Task list for closing F-005-A5-01..06, F-008-B3-01..02, F-009-B4-01..05. Thirteen surgical edits + 7 vitest files + 4 fixtures + validate + stress + commit + push."
trigger_phrases:
  - "F-005-A5 tasks"
  - "F-008-B3 tasks"
  - "F-009-B4 tasks"
  - "004 validation and memory tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/049-deep-research-finding-remediation/004-validation-and-memory"
    last_updated_at: "2026-05-01T08:08:00Z"
    last_updated_by: "remediation-orchestrator"
    recent_action: "Tasks authored"
    next_safe_action: "Begin Phase 2: apply 13 fixes"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "049-004-validation-and-memory"
      parent_session_id: null
    completion_pct: 30
    open_questions: []
    answered_questions: []
---
# Tasks: 004 Validation And Memory Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

`T### [P?] Description (file path)` — `[P?]` is the priority tag from packet 046 (P1 or P2). Status uses `[x]` for done, `[ ]` for pending. Each finding ID appears in the description for traceability.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P1] Re-read packet 046 §5/§8/§9 to confirm finding IDs and cited line ranges (`.opencode/specs/.../046-system-deep-research-bugs-and-improvements/research/research.md`)
- [x] T002 [P1] Verify each cited file:line still matches research.md claim before editing (9 target files)
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 [P1] Bound advisor `workspaceRoot` via realpath + allowlist (F-005-A5-01) (`mcp_server/skill_advisor/schemas/advisor-tool-schemas.ts` + `handlers/advisor-recommend.ts` + `handlers/advisor-validate.ts`)
- [ ] T004 [P1] Add zod schemas for corpus and regression rows with line-numbered errors (F-005-A5-02) (`mcp_server/skill_advisor/handlers/advisor-validate.ts`)
- [ ] T005 [P2] Validate Python parity stdout shape and length (F-005-A5-03) (`mcp_server/skill_advisor/handlers/advisor-validate.ts`)
- [ ] T006 [P2] Replace generic JSON parse with typed string[] validation for triggerPhrases (F-005-A5-04) (`mcp_server/formatters/search-results.ts`)
- [ ] T007 [P2] Reuse perFolderDescriptionSchema for description.json metadata parsing (F-005-A5-05) (`mcp_server/lib/parsing/memory-parser.ts`)
- [ ] T008 [P2] Add CheckpointSnapshotSchema and quarantine malformed snapshot rows (F-005-A5-06) (`mcp_server/lib/storage/checkpoints.ts`)
- [ ] T009 [P1] Widen causal-link block matcher to accept causal_links AND causalLinks (F-008-B3-01) (`mcp_server/lib/parsing/memory-parser.ts`)
- [ ] T010 [P1] Gate insert-counter on real return shape; report skipped reasons (F-008-B3-02) (`mcp_server/handlers/causal-links-processor.ts`)
- [ ] T011 [P1] Markdown link extractor accepts angle-bracket and reference styles (F-009-B4-01) (`scripts/rules/check-spec-doc-integrity.sh`)
- [ ] T012 [P1] Strict semantic-marker requirement for evidence (F-009-B4-02) (`scripts/rules/check-evidence.sh`)
- [ ] T013 [P2] Shared priority helper sourced into both rules (F-009-B4-03) (`scripts/lib/check-priority-helper.sh` + `scripts/rules/check-evidence.sh`)
- [ ] T014 [P1] Preserve helper extra_header results; classify by position (F-009-B4-04) (`scripts/rules/check-template-headers.sh`)
- [ ] T015 [P2] Match [xX] interchangeably in checklist guard regex (F-009-B4-05) (`scripts/rules/check-template-headers.sh`)
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T016 [P1] Add 7 vitest files for new schemas/parsers (`mcp_server/skill_advisor/{schemas,handlers}/__tests__/` + `mcp_server/formatters/__tests__/` + `mcp_server/tests/`)
- [ ] T017 [P1] Add 4 test fixtures under `scripts/test-fixtures/` (064-067)
- [ ] T018 [P1] Run targeted vitest: `cd mcp_server && npx vitest run skill_advisor/tests/handlers/advisor-validate.vitest.ts skill_advisor/schemas/__tests__/ formatters/__tests__/ tests/memory-parser-description-schema.vitest.ts tests/memory-parser-causal-links-snake-case.vitest.ts tests/causal-links-processor-null-insert.vitest.ts tests/checkpoints-restore-snapshot-schema.vitest.ts`
- [ ] T019 [P1] Run validate.sh against ALL existing 60+ fixtures + 4 new ones
- [ ] T020 [P1] Run `validate.sh --strict` on this packet — must exit 0
- [ ] T021 [P1] Run `npm run stress` (from mcp_server) — exit 0 / >=56 files / >=163 tests
- [ ] T022 [P1] Run `generate-context.js` to refresh metadata for this packet
- [ ] T023 [P1] Confirm git diff shows only target product files + this packet's spec docs + new tests/fixtures
- [ ] T024 [P1] Commit + push to origin main with finding IDs in message body
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- All 13 findings marked `[x]` in the Findings closed table of `checklist.md` and `implementation-summary.md`
- `validate.sh --strict` exit 0 on this packet
- `npm run stress` exit 0 / >=56 files / >=163 tests
- Commit pushed to origin main with finding IDs in body
- 7 new vitest files pass
- 4 new fixtures pass strict validate
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- Source of truth: `../046-system-deep-research-bugs-and-improvements/research/research.md` §5, §8, §9
- Parent packet: `../spec.md` (049 phase parent — manifest)
- Worked-pilot pattern: `../010-cli-orchestrator-drift/` (commit `889d1ee08`)
<!-- /ANCHOR:cross-refs -->
