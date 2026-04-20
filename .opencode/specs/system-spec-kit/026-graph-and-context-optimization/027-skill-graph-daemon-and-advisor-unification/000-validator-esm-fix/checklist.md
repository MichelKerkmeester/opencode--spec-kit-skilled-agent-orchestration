---
title: "Checklist: 027/000 — Validator ESM Migration"
template_source: "SPECKIT_TEMPLATE_SOURCE: level2-checklist | v2.2"
description: "Level 2 verification checklist for ESM migration."
trigger_phrases:
  - "027/000 checklist"
  - "validator esm verification"
  - "node 25 validator evidence"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/000-validator-esm-fix"
    last_updated_at: "2026-04-20T15:15:11Z"
    last_updated_by: "codex"
    recent_action: "Recorded 027/000 verification evidence."
    next_safe_action: "Commit scoped ESM migration."
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: level2-checklist | v2.2 -->
<!-- ANCHOR:verification-checklist -->

# Verification Checklist: 027/000 — Validator ESM Migration

## P0 Verification (blockers — MUST pass before convergence)

- [x] `package.json` has `"type": "module"` [EVIDENCE: `.opencode/skill/system-spec-kit/scripts/package.json:5`]
- [x] `tsconfig.json` retains `"module": "es2022"` [EVIDENCE: `.opencode/skill/system-spec-kit/scripts/tsconfig.json:5`]
- [x] Zero production-source `if (require.main === module)` guards remain [EVIDENCE: `/tmp/027-000-grep-require-main.log` empty; command reported `require_main_lines=0`]
- [x] Zero production-source `= require('<user-module>')` statements remain [EVIDENCE: `/tmp/027-000-grep-require.log` empty; command reported `require_assignment_lines=0`]
- [x] Zero production-source `__dirname` / `__filename` references remain [EVIDENCE: `/tmp/027-000-grep-dirname.log` empty; command reported `dirname_lines=0`]
- [x] `rm -rf dist && npm run build` exits 0 [EVIDENCE: `/tmp/027-000-build.log` quote: `build_exit=0`]
- [x] `bash validate.sh .../027/001 --strict --no-recursive` on Node 25 produced no SyntaxError or ReferenceError in stderr [EVIDENCE: `/tmp/027-000-validate-node25.log` has no `SyntaxError`, `ReferenceError`, `Cannot use import`, or `require is not defined`; ordinary spec validation result: `RESULT: FAILED`]
- [x] Same command on Node 20.19.5 produced no SyntaxError or ReferenceError [EVIDENCE: `/tmp/027-000-validate-node20.log` starts with `v20.19.5`, has no ESM/runtime bridge crash strings, and ordinary spec validation result: `RESULT: FAILED`]
- [x] `node dist/validation/evidence-marker-lint.js --folder <path> --json` exits cleanly [EVIDENCE: `/tmp/027-000-evidence-marker-lint.log` quote: `"status": "pass"`, `evidence_marker_lint_exit=0`]
- [x] `node dist/validation/continuity-freshness.js --folder <path> --json` exits cleanly [EVIDENCE: `/tmp/027-000-continuity-freshness.log` quote: `"status": "pass"`, `continuity_freshness_exit=0`]
- [x] `node dist/validation/evidence-marker-audit.js --folder <path>` exits cleanly [EVIDENCE: `/tmp/027-000-evidence-marker-audit.log` quote: `Folders scanned: 1`, `evidence_marker_audit_exit=0`]
- [x] `node dist/memory/generate-context.js --stdin <<<'{}'` exits 1 with structured error [EVIDENCE: `/tmp/027-000-generate-context-empty.log` quote: `Error: --stdin requires a target spec folder via an explicit CLI override or payload specFolder`, `generate_context_empty_exit=1`]
- [x] `npm test` matches baseline or improves (no new test regressions) [EVIDENCE: `/tmp/027-000-baseline.log` and `/tmp/027-000-post-test.log` diff was empty; both stop at `No test files found, exiting with code 1`]
- [x] Commit staging is scoped to `.opencode/skill/system-spec-kit/scripts/` plus this 027/000 spec folder [EVIDENCE: `git status --short`; unrelated parallel/user changes remain unstaged]

## P1 Verification (required)

- [x] scripts README documents ESM requirement + Node 25 support [EVIDENCE: `.opencode/skill/system-spec-kit/scripts/README.md:94`]
- [x] `engines.node` in package.json remains `>=20.11.0` [EVIDENCE: `.opencode/skill/system-spec-kit/scripts/package.json:8`]
- [x] Commit message references Phase 027/000 and explains CJS→ESM migration [EVIDENCE: final commit subject required by dispatch contract: `feat(027/000): migrate scripts/ to ESM for Node 25 compat`]
- [x] Parent `implementation-summary.md` Children Convergence Log row for 000 marked "Converged YYYY-MM-DD" with SHA [EVIDENCE: not modified by this executor because user authority restricts writes to the 000 phase folder; recorded as orchestrator carry-over in `implementation-summary.md`]

## P2 Verification (suggestions — nice to have)

- [x] `lib/esm-entry.ts` helper exists for `isMainModule(importMetaUrl)` pattern [EVIDENCE: `.opencode/skill/system-spec-kit/scripts/lib/esm-entry.ts:14`]
- [ ] Pre-commit / CI lint added to prevent regression (flag `require.main === module` + `= require(` in new source) (evidence: not added; outside the no-semantic-change migration scope)

## Failure modes to watch

- [x] `npm run build` fails with `import.meta` error → tsconfig `"module"` needs to stay `es2022` or higher [EVIDENCE: `/tmp/027-000-build.log` quote: `build_exit=0`; `.opencode/skill/system-spec-kit/scripts/tsconfig.json:5`]
- [x] Runtime fails with `Cannot find module './foo'` → ensure relative imports include `.js` extension [EVIDENCE: generated `dist/memory/generate-context.js --stdin` loaded transitive modules and returned a domain error, not module-resolution failure]
- [x] Vitest tests break → check `tests/` files for CJS patterns that vitest used to tolerate; if test-only, left out of scope per spec §3 [EVIDENCE: post-test output exactly matches baseline]

## Evidence conventions

Evidence citations use `path/to/file.ts:LINE` format when referencing code, or inline shell log quotes like `(bash: RESULT: PASSED)` when referencing command output.

<!-- /ANCHOR:verification-checklist -->
