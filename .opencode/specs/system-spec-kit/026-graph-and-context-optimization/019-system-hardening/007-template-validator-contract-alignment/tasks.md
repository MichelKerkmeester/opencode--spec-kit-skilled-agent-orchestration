---
title: "Tasks: Template/Validator Contract Alignment"
description: "Task list for 5 ranked proposals."
trigger_phrases: ["validator alignment tasks"]
importance_tier: "critical"
contextType: "tasks"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/019-system-hardening/007-template-validator-contract-alignment"
    last_updated_at: "2026-04-18T22:55:00Z"
    last_updated_by: "codex-gpt-5.4"
    recent_action: "Completed validator regression; full mcp_server suite blocked"
    next_safe_action: "Resolve broad mcp_server suite failures outside validator scope"
---
# Tasks: Template/Validator Contract Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` completed with evidence cited inline.
- `[ ]` pending or blocked.
- P0 blocks closure, P1 is required unless explicitly deferred, P2 is optional.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Read audit source at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/019-system-hardening-001-initial-research-006-template-validator-audit/review-report.md` [EVIDENCE: ranked proposals consumed]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 [P0] Create `scripts/lib/validator-registry.{ts,json}` with full rule metadata [EVIDENCE: `.opencode/skill/system-spec-kit/scripts/lib/validator-registry.json`, `.opencode/skill/system-spec-kit/scripts/lib/validator-registry.ts`]
- [x] T003 [P0] Refactor `validate.sh` dispatch loop to read registry [EVIDENCE: `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` registry query + `emit_rule_script()`]
- [x] T004 [P0] Generate `show_help()` output from registry [EVIDENCE: `.opencode/skill/system-spec-kit/scripts/spec/validate.sh --help` output groups registry rules]
- [x] T005 [P0] Verify same rule set dispatched as before [EVIDENCE: `node -e` registry count returned 33 unique populated rule entries]
- [x] T006 [P0] Commit+push explicitly skipped per dispatch constraint [EVIDENCE: user constraint "DO NOT git commit or git push"]
- [x] T007 [P0] Update `check-frontmatter.sh` to reject empty `title`/`description`/`trigger_phrases`/`importance_tier`/`contextType` [EVIDENCE: `.opencode/skill/system-spec-kit/scripts/rules/check-frontmatter.sh`]
- [x] T008 [P0] Update `spec-doc-structure.ts` `requiredPairs` to treat empty-string as missing [EVIDENCE: `.opencode/skill/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts`]
- [x] T009 [P1] Add grandfathering allowlist with cutoff timestamp [EVIDENCE: `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-grandfather-allowlist.json`]
- [x] T010 [P0] Add synthetic empty-field fixture test [EVIDENCE: `npx vitest run tests/spec-doc-structure.vitest.ts`]
- [x] T011 [P0] Commit+push explicitly skipped per dispatch constraint [EVIDENCE: user constraint "DO NOT git commit or git push"]
- [x] T012 [P0] Update `check-anchors.sh` to reject duplicate IDs [EVIDENCE: `.opencode/skill/system-spec-kit/scripts/rules/check-anchors.sh`]
- [x] T013 [P0] Pre-scan active packets for latent duplicates [EVIDENCE: active 026 duplicate-anchor scan returned no duplicate opening anchor IDs]
- [x] T014 [P0] Add synthetic duplicate-anchor fixture test [EVIDENCE: `npx vitest run tests/spec-doc-structure.vitest.ts`]
- [x] T015 [P0] Commit+push explicitly skipped per dispatch constraint [EVIDENCE: user constraint "DO NOT git commit or git push"]
- [x] T016 [P0] Fix `.opencode/skill/system-spec-kit/templates/level_3/decision-record.md` frontmatter description [EVIDENCE: `.opencode/skill/system-spec-kit/templates/level_3/decision-record.md`]
- [x] T017 [P0] Verify template validates [EVIDENCE: decision-record template frontmatter now contains valid description text]
- [x] T018 [P2] Categorize rules in registry as `authored_template` vs `operational_runtime` [EVIDENCE: `.opencode/skill/system-spec-kit/scripts/lib/validator-registry.json`]
- [x] T019 [P2] Update coverage-matrix output grouping [EVIDENCE: `validate.sh --help` and `.opencode/skill/system-spec-kit/scripts/rules/README.md` group rules by category]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 [P0] Full validator regression green [EVIDENCE: `.opencode/skill/system-spec-kit/scripts/spec/test-validation.sh` -> 32 passed; `.opencode/skill/system-spec-kit/scripts/tests/test-validation-extended.sh` -> 108 passed; `node .opencode/skill/system-spec-kit/scripts/tests/test-validation-system.js` -> 99 passed]
- [ ] T021 [P0] Full mcp_server test suite green [BLOCKED: `npm test` reported broad failures across memory-save, graph payload, transaction recovery, resume, docs, and performance suites, then stopped producing output; scoped `npx vitest run tests/spec-doc-structure.vitest.ts` passed 14 tests]
- [x] T022 [P0] Update checklist.md [EVIDENCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/019-system-hardening/007-template-validator-contract-alignment/checklist.md` records validator-green/full-suite-blocked status]
- [x] T023 [P0] Update implementation-summary.md [EVIDENCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/019-system-hardening/007-template-validator-contract-alignment/implementation-summary.md` records final verification]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Validator registry, semantic frontmatter, anchor parity, reporting split, and decision template fix are all implemented.
- [x] Strict phase validation passes for this packet after final evidence updates.
- [x] Full mcp_server test suite result is recorded.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- Parent: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/019-system-hardening/spec.md`
- Source review: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/019-system-hardening-001-initial-research-006-template-validator-audit/review-report.md`
<!-- /ANCHOR:cross-refs -->
