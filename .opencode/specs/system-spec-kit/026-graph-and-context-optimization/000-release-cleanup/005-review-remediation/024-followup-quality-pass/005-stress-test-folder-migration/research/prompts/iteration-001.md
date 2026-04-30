## Packet 037/005: stress-test-folder-migration — Tier C code+config

You are cli-codex (gpt-5.5 high fast) implementing **037/005-stress-test-folder-migration**.

### Goal

Operator's explicit directive: "make a dedicated folder for the stress test inside `.opencode/skill/system-spec-kit/mcp_server/` so we can easily maintain and update it from there. Should not be in tests folder but dedicated folder."

Migrate the stress-test logic out of `mcp_server/tests/` into a NEW dedicated folder `mcp_server/stress_test/`. Update all imports, references, and config so the migration is transparent (build green, tests still runnable, docs accurate).

### Read these first

- `.opencode/skill/system-spec-kit/mcp_server/tests/` — survey existing files; identify which are stress-test (vs unit/integration tests)
- `.opencode/skill/system-spec-kit/mcp_server/vitest.config.ts` (or equivalent) — test discovery config
- `.opencode/skill/system-spec-kit/mcp_server/package.json` — test scripts
- Stress-test references in:
  - `.opencode/skill/system-spec-kit/mcp_server/README.md`
  - `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/` (any pointers to current paths)
  - `specs/system-spec-kit/026-graph-and-context-optimization/030-v1-0-4-full-matrix-stress-test-design/` (matrix design citations)
  - Any `*.md` files mentioning `stress-test` or `stress_test`

### Discovery (Phase 1)

```bash
# Find candidate stress-test files in tests/
find .opencode/skill/system-spec-kit/mcp_server/tests -type f -iname '*stress*'
find .opencode/skill/system-spec-kit/mcp_server -type f -iname '*stress*'

# Find references in code
grep -rn "stress" .opencode/skill/system-spec-kit/mcp_server/ --include='*.ts' --include='*.tsx' | head -50

# Find references in docs
grep -rn "stress[-_]test" .opencode/skill/system-spec-kit/ --include='*.md' | head -50
grep -rn "tests/stress" .opencode --include='*.md' --include='*.ts' --include='*.json' | head
```

Identify which files are "stress test" (load testing, benchmark, multi-cell matrix runs, performance validation) vs unit tests. Classify each candidate:
- DEFINITELY_STRESS_TEST (move)
- AMBIGUOUS (document; leave in tests/ unless evidence is clear)
- NOT_STRESS_TEST (skip)

Write `migration-plan.md` at packet root with the classification.

### Implementation (Phase 2)

#### Step 1: Create new folder

```bash
mkdir -p .opencode/skill/system-spec-kit/mcp_server/stress_test
```

Add `mcp_server/stress_test/README.md` documenting:
- Purpose (stress / load / matrix tests for the mcp_server)
- How to run (`npx vitest run mcp_server/stress_test/...` or similar)
- Adding new stress tests
- Differences vs `mcp_server/tests/` (unit/integration)

#### Step 2: Move files

For each DEFINITELY_STRESS_TEST file: `git mv` it from `tests/` to `stress_test/`.

#### Step 3: Update imports

Stress-test files often import from `../some/module` — these paths may need updating after the move (depending on relative depth). Walk through each moved file and adjust imports.

Also: any OTHER file (under `tests/` or elsewhere) that imports FROM a moved stress-test file needs its import path updated.

#### Step 4: Update vitest config

If `vitest.config.ts` (or equivalent) has explicit test file patterns, ensure stress_test/ is included for stress-test runs but excluded from default unit-test runs (or include both — depends on existing convention).

Suggested config approach:
- Default `npm test` runs `tests/` only (fast)
- New script `npm run stress` runs `stress_test/` (slow)
- Update `package.json` scripts accordingly

#### Step 5: Update package.json

Add appropriate npm scripts. Document in stress_test/README.md.

#### Step 6: Update doc references

Find every reference to `tests/stress*` or `stress` in tests/ across:
- `.opencode/skill/system-spec-kit/mcp_server/README.md`
- All packet docs in `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/` and `030-v1-0-4-full-matrix-stress-test-design/`
- Any other refs surfaced by Phase 1 discovery

Update each reference to the new `stress_test/` path.

### Verification (Phase 3)

```bash
cd .opencode/skill/system-spec-kit/mcp_server
npm run build  # MUST pass
npm test       # MUST pass (no broken imports from the move)
npm run stress 2>&1 | head -50   # Smoke check: stress tests are runnable
```

### Packet structure to create (Level 2)

7-file structure under `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/024-followup-quality-pass/005-stress-test-folder-migration/`.

PLUS: `migration-plan.md` at packet root.

**Deps**: `manual.depends_on=["system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/024-followup-quality-pass/001-sk-code-opencode-audit"]`.

**Trigger phrases**: `["037-005-stress-test-folder-migration","stress test folder","dedicated stress folder","mcp_server/stress_test"]`.

**Causal summary**: `"Migrates stress-test logic from mcp_server/tests/ to dedicated mcp_server/stress_test/ folder. Updates imports, vitest config, package.json scripts, and all doc references. Build + tests verified post-migration."`.

**Frontmatter**: compact rules.

### Constraints

- This packet MOVES code and updates references. Be surgical.
- Build MUST pass post-migration.
- Existing unit tests MUST still pass.
- Strict validator MUST exit 0 on this packet.
- DO NOT commit; orchestrator will commit.
- If a candidate file is genuinely AMBIGUOUS (could go either way), leave it in tests/ and document in migration-plan.md.
- If no clear stress-test files exist (e.g., they're embedded in scripts/ instead of tests/), document that in migration-plan.md and move what fits the stress-test definition. Do NOT fabricate stress tests.

When done, last action is strict validator + build + test passing. No narration; just write files and exit.
