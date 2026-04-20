---
title: "Feature Specification: 027/000 — Validator ESM Migration (Node 25 Compat)"
description: "Convert .opencode/skill/system-spec-kit/scripts/ from hybrid CJS/ESM to pure ESM so bash validate.sh runs under Node 25. Prereq for 027/001-006 post-phase verification."
trigger_phrases:
  - "027/000"
  - "validator esm fix"
  - "node 25 compat"
  - "require.main migration"
  - "scripts package esm"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/000-validator-esm-fix"
    last_updated_at: "2026-04-20T15:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Scaffolded 027/000 packet (validator ESM migration)"
    next_safe_action: "Dispatch cli-codex gpt-5.4 high fast on 027/000 before 027/001"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/scripts/package.json"
      - ".opencode/skill/system-spec-kit/scripts/tsconfig.json"
      - ".opencode/skill/system-spec-kit/scripts/validation/evidence-marker-lint.ts"
      - ".opencode/skill/system-spec-kit/scripts/validation/continuity-freshness.ts"
      - ".opencode/skill/system-spec-kit/scripts/validation/evidence-marker-audit.ts"
      - ".opencode/skill/system-spec-kit/scripts/memory/generate-context.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "027-000-scaffold-r01"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: 027/000 — Validator ESM Migration (Node 25 Compat)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

## 1. METADATA

| Field | Value |
|---|---|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-04-20 |
| **Parent** | `../` |
| **Research source** | Session preflight discovery, 2026-04-20: `bash validate.sh` fails on every Phase 027 packet under Node 25 because compiled dist/ mixes CommonJS (`Object.defineProperty(exports, …)` + `require.main === module`) and ESM (`import` statements); `package.json "type": "commonjs"` + `tsconfig.json "module": "es2022"` are mutually incompatible. |

## 2. PROBLEM & PURPOSE

### Problem
The `.opencode/skill/system-spec-kit/scripts/` package was authored for Node 20 with hybrid CJS/ESM patterns. Under Node 25:
- `package.json` declares `"type": "commonjs"` but `tsconfig.json` compiles with `"module": "es2022"` → dist contains ESM `import` statements inside a CommonJS-declared package → `SyntaxError: Cannot use import statement outside a module` on every run.
- 16+ TypeScript source files use the CJS entrypoint idiom `if (require.main === module)` which has no direct ESM equivalent — flipping `package.json` to `"type": "module"` makes those fail with `ReferenceError: require is not defined in ES module scope`.
- One source file (`validation/continuity-freshness.ts:11`) still uses `const yaml = require('js-yaml')` which breaks under strict ESM.
- `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <folder> --strict` therefore **fails unconditionally on Node 25** (`Errors: 9, Warnings: 8, RESULT: FAILED`) even on pristine packets.

This blocks Phase 027's post-phase verification step for children 001-006. Without validate.sh, we lose: evidence-marker-lint, continuity-freshness checks, structure validation, frontmatter validation, and strict-mode escalation signals.

### Purpose
Convert the scripts package from hybrid CJS/ESM to pure ESM so validators run green on Node 25 (the user's current runtime) and Node 20 (legacy target declared in `engines`). This is a hard prereq before dispatching 027/001 — without it, every phase's post-dispatch verification step is broken.

## 3. SCOPE

### In Scope
- **Package-level migration:**
  - `package.json`: flip `"type": "commonjs"` → `"type": "module"`
  - `tsconfig.json`: keep `"module": "es2022"` (already correct for target output); verify `"moduleResolution": "node"` is compatible with ESM (switch to `"bundler"` or `"node16"` if necessary)
- **Source file migrations (~16-20 files):**
  - Convert all `if (require.main === module)` entrypoint guards to the ESM equivalent:
    ```ts
    import { fileURLToPath } from 'node:url';
    if (import.meta.url === `file://${process.argv[1]}` ||
        import.meta.url === fileURLToPath(process.argv[1])) { … }
    ```
    (or an equivalent helper that handles macOS path resolution)
  - Convert `const yaml = require('js-yaml')` → `import yaml from 'js-yaml'` (or `import * as yaml` depending on module shape)
  - Convert any `__dirname` / `__filename` uses to `fileURLToPath(import.meta.url)` + `path.dirname()`
  - Convert any `require.resolve()` to `import.meta.resolve()` or equivalent
- **Post-migration cleanup:**
  - Delete and regenerate `dist/` with fresh `npm run build`
  - Verify `validate.sh` exits cleanly (exit 0 or exit 1 with warnings, never SyntaxError/ReferenceError)
  - Verify `generate-context.js` can be invoked without syntax crash
  - Run existing `npm test` suite — must match pre-migration baseline
- **Documentation updates:**
  - Add a line to `.opencode/skill/system-spec-kit/scripts/README.md` noting the ESM requirement
  - Update `engines.node` in package.json if appropriate (keep ≥20.11, but note Node 25 is now supported)

### Out of Scope
- Any semantic change to validator logic (no finding behavior changes)
- Any changes outside `.opencode/skill/system-spec-kit/scripts/` (no mcp_server/ touches)
- Rewriting validators for performance or clarity
- Fixing pre-existing validator warnings unrelated to the ESM issue
- Porting test files (`*.vitest.ts`) that use `require()` for test mocking — vitest handles hybrid mode fine
- Fixing validate.sh on non-macOS / non-darwin (current runtime only)

## 4. REQUIREMENTS

### 4.1 P0 (Blocker)
1. `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/.../027-.../001-daemon-freshness-foundation --strict --no-recursive` completes with exit 0 or 1 (no SyntaxError, no ReferenceError, no "Cannot use import", no "require is not defined")
2. All `require.main === module` entrypoint guards in production source files converted to ESM equivalent
3. All `= require('user-module')` statements converted to `import` statements (Node built-ins may stay as `import ... from 'node:path'` which is already correct)
4. `package.json` `"type": "module"` committed
5. `npm run build` in scripts/ exits 0 from a clean `dist/` (rm -rf dist && npm run build)
6. `npm test` in scripts/ passes (or matches the documented pre-migration baseline — some test failures may be pre-existing and unrelated)
7. Migration is isolated: no changes outside `.opencode/skill/system-spec-kit/scripts/` except the 027/000 spec folder itself

### 4.2 P1 (Required)
1. `node dist/validation/evidence-marker-lint.js --folder <path> --json` exits cleanly (stdout is parseable JSON or documented error, never SyntaxError)
2. `node dist/validation/continuity-freshness.js --folder <path> --json` exits cleanly
3. `node dist/validation/evidence-marker-audit.js --folder <path>` exits cleanly
4. `node dist/memory/generate-context.js --stdin` with `{}` input returns documented error (missing specFolder), not SyntaxError
5. Regression: Node 20.19.5 also runs the validators without crashing (backwards compat with `engines.node >= 20.11.0`)
6. `tsconfig.json` kept at `"module": "es2022"` (document the choice in the commit message)

### 4.3 P2 (Suggestion)
1. Consider a helper module `lib/esm-entry.ts` exporting `isMain(importMetaUrl: string): boolean` to avoid copy-pasting the `file://...process.argv[1]` check
2. Consider adding a pre-commit / CI check that lints `require.main === module` + `= require(` in new source files to prevent regression

## 5. ACCEPTANCE SCENARIOS

1. **AC-1** Run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/.../027-.../001-daemon-freshness-foundation --strict --no-recursive` under Node 25 → exits 0 or 1 with no SyntaxError/ReferenceError in stderr
2. **AC-2** Run the same command under Node 20.19.5 → same result (backwards compat)
3. **AC-3** `rm -rf .opencode/skill/system-spec-kit/scripts/dist && npm run build` completes successfully in scripts/
4. **AC-4** `node dist/validation/evidence-marker-lint.js --folder .../027-.../001-daemon-freshness-foundation --json` exits 0 and prints valid JSON (or exits 1 with parseable error JSON)
5. **AC-5** `grep -rln "require.main === module" .opencode/skill/system-spec-kit/scripts --include="*.ts" | grep -v node_modules | grep -v "\.vitest\.ts"` returns 0 lines (all production sources migrated)
6. **AC-6** `grep -rln "^const .* = require(" .opencode/skill/system-spec-kit/scripts --include="*.ts" | grep -v node_modules | grep -v "\.vitest\.ts"` returns 0 lines
7. **AC-7** `npm test` in scripts/ passes OR matches the documented pre-migration baseline (no new failures introduced)
8. **AC-8** `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --stdin <<<'{}'` exits 1 with structured error output (not a SyntaxError)

## 6. FILES TO CHANGE

### Modified (under `.opencode/skill/system-spec-kit/scripts/`)
- `package.json` — `"type"` field flipped to `"module"`
- `tsconfig.json` — verify `moduleResolution`; possibly update if ESM output requires it
- `README.md` — document ESM requirement + Node 25 support

### Source files requiring `require.main === module` conversion (production, ~16 files)
- `evals/check-architecture-boundaries.ts`
- `evals/check-no-mcp-lib-imports-ast.ts`
- `evals/run-redaction-calibration.ts`
- `graph/backfill-graph-metadata.ts`
- `lib/validate-memory-quality.ts`
- `memory/backfill-frontmatter.ts`
- `memory/backfill-research-metadata.ts`
- `memory/cleanup-orphaned-vectors.ts`
- `memory/generate-context.ts`
- `memory/migrate-trigger-phrase-residual.ts`
- `memory/rank-memories.ts`
- `memory/rebuild-auto-entities.ts`
- `memory/reindex-embeddings.ts`
- `memory/validate-memory-quality.ts`
- `spec-folder/nested-changelog.ts`
- `tests/manual-playbook-runner.ts`
- `validation/continuity-freshness.ts`
- `validation/evidence-marker-audit.ts`
- `validation/evidence-marker-lint.ts`

### Source files requiring `require()` → `import` conversion
- `validation/continuity-freshness.ts:11` (`const yaml = require('js-yaml')`)
- Any other occurrences found via `grep -n "= require(" validation/**/*.ts memory/**/*.ts`

### Test files (out of scope — vitest handles hybrid)
- `tests/*.vitest.ts` — left untouched

### Regenerated (not committed — gitignored)
- `.opencode/skill/system-spec-kit/scripts/dist/**` — clean rebuild after migration

### Read-only references
- `common.sh` — bash orchestrator, no changes needed
- `spec/validate.sh` — bash dispatcher, no changes needed

## 7. DISPATCH CONTRACT (for cli-codex)

**Executor:** `codex exec --model gpt-5.4 -c model_reasoning_effort="high" -c service_tier="fast" -c approval_policy=never --sandbox workspace-write`

**Expected wall-clock:** 30-60 minutes (small, pattern-based migration across ~20 files).

**Preconditions:**
- Phase 027/000 is the first phase to dispatch in the Phase 027 campaign; no predecessors.
- Baseline `npm test` failure set documented before migration so regressions can be diffed.

**Post-conditions:**
- All P0 items green
- `git diff --stat` shows only scripts/ changes + the 027/000 spec folder updates
- New commit `feat(027/000): migrate scripts/ to ESM for Node 25 compat` pushed to main
- Parent `implementation-summary.md` Children Convergence Log row for 000 marked "Converged"
