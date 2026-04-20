---
title: "Checklist: 027/000 — Validator ESM Migration"
description: "Level 2 verification checklist for ESM migration."
importance_tier: "high"
contextType: "implementation"
---

# Checklist: 027/000

## P0 Verification (blockers — MUST pass before convergence)

- [ ] `package.json` has `"type": "module"` (evidence: `scripts/package.json:<line>`)
- [ ] `tsconfig.json` retains `"module": "es2022"` (evidence: `scripts/tsconfig.json:<line>`)
- [ ] Zero production-source `if (require.main === module)` guards remain (evidence: grep output)
- [ ] Zero production-source `= require('<user-module>')` statements remain (evidence: grep output)
- [ ] Zero production-source `__dirname` / `__filename` references remain (or all converted to `fileURLToPath(import.meta.url)`) (evidence: grep output)
- [ ] `rm -rf dist && npm run build` exits 0 (evidence: shell log)
- [ ] `bash validate.sh .../027/001 --strict --no-recursive` on Node 25 → no SyntaxError or ReferenceError in stderr (evidence: log file)
- [ ] Same command on Node 20.19.5 → no SyntaxError or ReferenceError (evidence: log file)
- [ ] `node dist/validation/evidence-marker-lint.js --folder <path> --json` exits cleanly (evidence: exit code + JSON)
- [ ] `node dist/validation/continuity-freshness.js --folder <path> --json` exits cleanly (evidence: exit code + JSON)
- [ ] `node dist/validation/evidence-marker-audit.js --folder <path>` exits cleanly (evidence: exit code)
- [ ] `node dist/memory/generate-context.js --stdin <<<'{}'` exits 1 with structured error (evidence: stderr content)
- [ ] `npm test` matches baseline or improves (no new test regressions) (evidence: test log diff)
- [ ] No changes outside `.opencode/skill/system-spec-kit/scripts/` + the 027/000 spec folder (evidence: `git diff --stat`)

## P1 Verification (required)

- [ ] `scripts/README.md` documents ESM requirement + Node 25 support (evidence: README diff)
- [ ] `engines.node` in package.json remains `>=20.11.0` (evidence: package.json line)
- [ ] Commit message references Phase 027/000 and explains CJS→ESM migration (evidence: git log)
- [ ] Parent `implementation-summary.md` Children Convergence Log row for 000 marked "Converged YYYY-MM-DD" with SHA (evidence: parent summary)

## P2 Verification (suggestions — nice to have)

- [ ] `lib/esm-entry.ts` helper exists for `isMainModule(importMetaUrl)` pattern (evidence: file existence)
- [ ] Pre-commit / CI lint added to prevent regression (flag `require.main === module` + `= require(` in new source) (evidence: hook or CI config)

## Failure modes to watch

- [ ] `npm run build` fails with `import.meta` error → tsconfig `"module"` needs to stay `es2022` or higher
- [ ] Runtime fails with `Cannot find module './foo'` → ensure relative imports include `.js` extension (not `.ts`)
- [ ] Vitest tests break → check `tests/` files for CJS patterns that vitest used to tolerate; if test-only, left out of scope per spec §3

## Evidence conventions

Evidence citations use `path/to/file.ts:LINE` format when referencing code, or inline shell log quotes like `(bash: RESULT: PASSED)` when referencing command output.
