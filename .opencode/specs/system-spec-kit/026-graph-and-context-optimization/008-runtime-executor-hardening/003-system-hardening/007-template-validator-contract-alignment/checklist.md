---
title: "...optimization/008-runtime-executor-hardening/003-system-hardening/007-template-validator-contract-alignment/checklist]"
description: "Verification for 5 ranked proposals."
trigger_phrases:
  - "validator alignment checklist"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/003-system-hardening/007-template-validator-contract-alignment"
    last_updated_at: "2026-04-18T22:55:00Z"
    last_updated_by: "codex-gpt-5.4"
    recent_action: "Completed validator regression; full mcp_server suite blocked"
    next_safe_action: "Resolve broad mcp_server suite failures outside validator scope"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
---
# Verification Checklist: Template/Validator Contract Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

- [x] CHK-001 [P0] Verify implementation against the ranked audit proposals. [EVIDENCE: ranked proposals mapped to T002-T019]
- [x] CHK-002 [P0] Run final strict packet validation after docs are updated. [EVIDENCE: `validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/003-system-hardening/007-template-validator-contract-alignment --strict --quiet` -> `RESULT: PASSED (errors=0 warnings=0)`]
- [x] CHK-003 [P0] Run full mcp_server test suite. [EVIDENCE: `npm test` attempted full `test:core && test:file-watcher`; `test:core` reported broad failures and stopped producing output before file-watcher]
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-010 [P0] Audit reviewed before edits. [EVIDENCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/019-system-hardening-001-initial-research-006-template-validator-audit/review-report.md`]
- [x] CHK-011 [P0] Existing dirty worktree reviewed without reverting unrelated edits. [EVIDENCE: `git status --short` showed pre-existing unrelated changes before patching]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-020 [P0] Rank 1 registry exists with full metadata. [EVIDENCE: `.opencode/skill/system-spec-kit/scripts/lib/validator-registry.json` has 33 unique populated entries]
- [x] CHK-021 [P0] Rank 1 `validate.sh` reads registry for canonical names, severity, scripts, and help. [EVIDENCE: `bash -n .opencode/skill/system-spec-kit/scripts/spec/validate.sh`; `validate.sh --help`]
- [x] CHK-022 [P0] Rank 2 shell frontmatter validation rejects semantic empty values. [EVIDENCE: empty-frontmatter synthetic fixture exited 2]
- [x] CHK-023 [P0] Rank 2 TypeScript frontmatter validation treats empty continuity values as missing. [EVIDENCE: `spec-doc-structure.vitest.ts` empty-continuity test passed]
- [x] CHK-024 [P0] Rank 3 duplicate-anchor rejection matches preflight uniqueness semantics. [EVIDENCE: duplicate-anchor fixture exited 2 with `Duplicate anchor ID`]
- [x] CHK-025 [P0] Rank 4 reporting split groups authored-template and operational-runtime rules. [EVIDENCE: `validate.sh --help`; `.opencode/skill/system-spec-kit/scripts/rules/README.md`]
- [x] CHK-026 [P0] Rank 5 decision-record placeholder fixed. [EVIDENCE: `.opencode/skill/system-spec-kit/templates/level_3/decision-record.md`]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-030 [P0] Shell syntax checks pass. [EVIDENCE: `bash -n validate.sh`, `bash -n check-frontmatter.sh`, `bash -n check-anchors.sh`]
- [x] CHK-031 [P0] Focused mcp_server validator tests pass. [EVIDENCE: `npx vitest run tests/spec-doc-structure.vitest.ts` -> 14 passed]
- [x] CHK-032 [P0] Full validator regression green. [EVIDENCE: main shell suite 32/32, extended shell suite 108/108, JS validation system 99/99]
- [ ] CHK-033 [P0] Full mcp_server test suite green. [BLOCKED: `npm test` failed/hung with unrelated broad runtime-suite failures; scoped `npx vitest run tests/spec-doc-structure.vitest.ts` passed 14/14]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] No new secrets introduced. [EVIDENCE: registry/allowlist/test/template changes contain no credentials]
- [x] CHK-041 [P0] Grandfathering allowlist is bounded by cutoff. [EVIDENCE: `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-grandfather-allowlist.json` cutoff `2026-05-01T00:00:00Z`]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P0] `spec.md`, `plan.md`, and `tasks.md` aligned to implementation scope. [EVIDENCE: tasks T002-T019 completed]
- [x] CHK-051 [P0] `implementation-summary.md` populated with final verification results. [EVIDENCE: implementation summary verification section records validator regression, scoped mcp_server pass, and full-suite blocker]
- [x] CHK-052 [P1] `.opencode/skill/system-spec-kit/scripts/rules/README.md` updated with registry reference. [EVIDENCE: `.opencode/skill/system-spec-kit/scripts/rules/README.md`]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P0] Registry files live in `scripts/lib/`. [EVIDENCE: `.opencode/skill/system-spec-kit/scripts/lib/validator-registry.{json,ts}`]
- [x] CHK-061 [P0] No temporary synthetic fixture directories left in repo. [EVIDENCE: synthetic fixtures created under `/tmp` and removed]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Status: Implementation ranks complete; validator regression green; full mcp_server suite blocked outside this packet's validator-owned surface.
<!-- /ANCHOR:summary -->
