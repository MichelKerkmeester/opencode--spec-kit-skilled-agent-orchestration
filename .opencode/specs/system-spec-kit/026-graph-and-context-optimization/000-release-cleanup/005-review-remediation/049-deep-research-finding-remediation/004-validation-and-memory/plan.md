---
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
title: "Implementation Plan: 004 Validation And Memory Remediation [template:level_2/plan.md]"
description: "Apply 13 surgical product-code/shell-rule edits and add tests + fixtures for findings F-005-A5-01..06, F-008-B3-01..02, F-009-B4-01..05."
trigger_phrases:
  - "F-005-A5 plan"
  - "F-008-B3 plan"
  - "F-009-B4 plan"
  - "004 validation and memory plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/049-deep-research-finding-remediation/004-validation-and-memory"
    last_updated_at: "2026-05-01T08:05:00Z"
    last_updated_by: "remediation-orchestrator"
    recent_action: "Plan authored after spec"
    next_safe_action: "Apply 13 surgical edits + 7 new tests + 4 new fixtures, then validate strict, then commit + push"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/schemas/advisor-tool-schemas.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-validate.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts"
      - ".opencode/skill/system-spec-kit/scripts/rules/check-spec-doc-integrity.sh"
      - ".opencode/skill/system-spec-kit/scripts/rules/check-evidence.sh"
      - ".opencode/skill/system-spec-kit/scripts/rules/check-template-headers.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "049-004-validation-and-memory"
      parent_session_id: null
    completion_pct: 30
    open_questions: []
    answered_questions: []
---
# Implementation Plan: 004 Validation And Memory Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Thirteen surgical edits across the advisor, memory parser, causal-links processor, checkpoint storage, search-results formatter, and three shell rules close findings F-005-A5-01..06, F-008-B3-01..02, and F-009-B4-01..05. Each fix tightens validation or parsing without changing the public API of the touched modules.

### Technical Context

The product code lives across the `mcp_server` TypeScript tree (advisor, formatters, parsing, storage, handlers) and the validation lives across `scripts/rules/*.sh` (sourced by `validate.sh`). All TS edits stay within existing files; the shell-rule edits introduce one new sourced helper (`scripts/lib/check-priority-helper.sh`) plus four new test fixtures under `scripts/test-fixtures/`.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Threshold |
|------|-----------|
| validate.sh --strict (this packet) | exit 0 (errors=0) |
| validate.sh against all existing 60+ fixtures | no NEW failures introduced |
| New vitest tests | all pass |
| `npm run stress` | exit 0 / >=56 files / >=163 tests |
| Inline finding markers | one `// F-NNN-XX-NN:` (TS), `# F-NNN-XX-NN:` (shell), or `<!-- F-NNN-XX-NN -->` (md) marker per finding |
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The fixes preserve the existing module boundaries:

- **Advisor** — Input schemas in `schemas/advisor-tool-schemas.ts` add `.refine()` validation; the two handlers `advisor-recommend.ts` and `advisor-validate.ts` canonicalize via `realpathSync.native` after `resolve()`.
- **Memory parser** — `extractCausalLinks` widens its YAML block matcher to accept both casings; `parseDescriptionMetadataContent` runs the parsed object through the existing `perFolderDescriptionSchema`.
- **Causal-links processor** — The `inserted` counter is gated on the real return shape of `causalEdges.insertEdge`.
- **Checkpoint storage** — `restoreCheckpoint` validates the snapshot via `CheckpointSnapshotSchema` and routes malformed rows to `result.errors`.
- **Search results formatter** — `triggerPhrases` parsed via a typed `string[]` validator.
- **Shell rules** — `check-spec-doc-integrity.sh` extends its awk extractor to capture three additional markdown link formats; `check-evidence.sh` swaps the same-line-second-checkbox heuristic for a strict semantic-marker requirement and reuses a sourced priority helper; `check-template-headers.sh` preserves `extra_header` results from the helper script and matches `[xX]` interchangeably.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| # | Phase | Action | File | Finding | Status |
|---|-------|--------|------|---------|--------|
| 1 | Edit | Bound advisor workspaceRoot via realpath + allowlist | advisor-tool-schemas.ts + advisor-recommend.ts + advisor-validate.ts | F-005-A5-01 | Pending |
| 2 | Edit | Strict zod schemas for corpus and regression rows | advisor-validate.ts | F-005-A5-02 | Pending |
| 3 | Edit | Validate Python stdout shape and length | advisor-validate.ts | F-005-A5-03 | Pending |
| 4 | Edit | Typed string[] validation for triggerPhrases | search-results.ts | F-005-A5-04 | Pending |
| 5 | Edit | Use perFolderDescriptionSchema for description.json | memory-parser.ts | F-005-A5-05 | Pending |
| 6 | Edit | CheckpointSnapshotSchema + quarantine rows | checkpoints.ts | F-005-A5-06 | Pending |
| 7 | Edit | Accept causal_links AND causalLinks block tokens | memory-parser.ts | F-008-B3-01 | Pending |
| 8 | Edit | Insert-counter only when storage returns a real id | causal-links-processor.ts | F-008-B3-02 | Pending |
| 9 | Edit | Markdown link extractor accepts angle-bracket and reference styles | check-spec-doc-integrity.sh | F-009-B4-01 | Pending |
| 10 | Edit | Strict semantic-marker evidence requirement | check-evidence.sh | F-009-B4-02 | Pending |
| 11 | Edit | Shared priority helper sourced into both rules | check-evidence.sh + scripts/lib/check-priority-helper.sh | F-009-B4-03 | Pending |
| 12 | Edit | Preserve helper extra_header results | check-template-headers.sh | F-009-B4-04 | Pending |
| 13 | Edit | Match [xX] in checklist guard regex | check-template-headers.sh | F-009-B4-05 | Pending |
| 14 | Test | Add 7 vitest files | mcp_server/{tests,formatters,skill_advisor}/__tests__/ | All TS | Pending |
| 15 | Fixture | Add 4 fixtures | scripts/test-fixtures/{064..067}-* | F-009-B4-* | Pending |
| 16 | Validate | validate.sh --strict on this packet | this packet | — | Pending |
| 17 | Stress | npm run stress | mcp_server/ | — | Pending |
| 18 | Refresh | generate-context.js for this packet | spec docs | — | Pending |
| 19 | Ship | commit + push to origin main | repo | — | Pending |
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit (vitest) | Schema validation per finding (7 new files) | vitest |
| Fixture (shell) | Strict validate against 4 new + all existing fixtures | `validate.sh` invoked over each fixture |
| Stress | Full `npm run stress` end-to-end | vitest stress config |

For each schema/parser change in TypeScript: extend or add a vitest in the relevant `__tests__/` dir using existing fixture patterns from `tests/memory-parser-extended.vitest.ts` and `skill_advisor/tests/handlers/advisor-validate.vitest.ts`.

For shell rule changes (B4-01 through B4-05): add fixture markdown files under `.opencode/skill/system-spec-kit/scripts/test-fixtures/`, then run `bash scripts/spec/validate.sh` against the fixture spec folders.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Source of truth: `046-system-deep-research-bugs-and-improvements/research/research.md` §5 (advisor + checkpoints), §8 (memory + causal links), §9 (validators)
- Validate script: `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`
- Stress runner: `cd mcp_server && npm run stress`
- No cross-packet dependencies; sub-phase 004 is independent within Wave 1.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

If any change breaks the stress baseline or breaks an existing fixture:
1. `git revert <commit-sha>` reverts all 13 fixes atomically.
2. Re-run validate + stress to confirm 048 baseline restored.
3. Identify the failing finding from inline `<!-- F-NNN-XX-NN -->` markers (each fix carries its ID).
4. Reauthor the failing edit with smaller scope; re-validate.

Each edit carries a finding marker so a partial-revert (single hunk) is straightforward.
<!-- /ANCHOR:rollback -->
