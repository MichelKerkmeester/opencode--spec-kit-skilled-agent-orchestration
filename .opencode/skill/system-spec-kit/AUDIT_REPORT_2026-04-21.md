# system-spec-kit Dead Code + Legacy Audit

Date: 2026-04-21
Scope root: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit`
Excluded: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/**`, other skills, `node_modules/`, `dist/`, `.git/`, `.venv/`, `.pytest_cache/`, `.tmp/`, `scripts/out/*.json`, and runtime SQLite files under `mcp_server/database/`.

## Summary

- Total scoped files audited: 2,687 files total, including 2,644 source/doc/config candidates (`.ts`, `.mjs`, `.js`, `.py`, `.sh`, `.md`, `.json`, `.yaml`).
- Findings by category and severity:
  - A - Orphan Files: 4 items (3 MEDIUM, 1 LOW)
  - B - Dead Exports: 1 item (1 MEDIUM)
  - C - Legacy Files: 4 items (3 MEDIUM, 1 LOW)
  - D - Empty Folders: 9 items (9 LOW)
  - E - Duplicated Content: 2 items (2 LOW)
  - F - Runtime Artifacts Tracked: 7 items (3 MEDIUM, 4 LOW)
  - G - Stale Configuration: 2 items (2 MEDIUM)
- Safe deletions applied: 12 items (3 tracked runtime/cache files, 9 empty directories).
- Risky findings deferred for human review: 16 report entries, covering 14 unique files or fixture/content groups.
- Tests still green: YES. Typecheck/build exited 0, Vitest reported 219/219 passed, and Python regression reported 52/52 with `overall_pass: true`.
- Commit status: BLOCKED by git index lock permission; see `blocker.md`.

## Section A -- Orphan Files (4 items)

- File path: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/bench/safety-bench.ts`
  - Category: A
  - Severity: MEDIUM
  - Evidence: `rg -n "runSafetyBench|safety-bench" .opencode/skill/system-spec-kit --glob '!**/node_modules/**' --glob '!**/dist/**' --glob '!**/.opencode/specs/**'` found the file itself and documentation mentions, but no package script, test include, or importer. Last touched in commit `5696acf4a`.
  - Recommendation: KEEP-WITH-JUSTIFICATION. It is an exported TypeScript benchmark entry point, so deletion is risky even with no live importer.

- File path: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/SCENARIO_RUN_2026-04-21.md`
  - Category: A
  - Severity: MEDIUM
  - Evidence: Orphan scanner found no importers or links after checking scoped `*.ts`, `*.mjs`, `*.js`, `*.py`, `*.sh`, `*.md`, `*.json`, and `*.yaml` files. The path is operator-facing manual testing content.
  - Recommendation: KEEP-WITH-JUSTIFICATION. User review required for any `manual_testing_playbook/` content.

- File path: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/11-query-concept-expansion.md`
  - Category: A
  - Severity: MEDIUM
  - Evidence: Orphan scanner found no importers or links after checking scoped source, doc, and config extensions. The path is feature catalog content.
  - Recommendation: KEEP-WITH-JUSTIFICATION. User review required for any `feature_catalog/` content.

- File path: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/018-deep-loop-cli-executor/scratch/phase-b-codex-prompt.md`
  - Category: A
  - Severity: LOW
  - Evidence: The file sits under `mcp_server/.opencode/specs/`, outside the canonical `.opencode/specs/**` tree and outside current package imports. It is historical Phase 018 scratch content.
  - Recommendation: KEEP-WITH-JUSTIFICATION. User directive marks Phase 018/019 files and historical spec-doc references as risky; do not delete automatically.

## Section B -- Dead Exports (1 item)

- File path: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/bench/safety-bench.ts`
  - Category: B
  - Severity: MEDIUM
  - Evidence: `runSafetyBench` is exported and self-invoked for direct CLI execution, but no scoped importer was found with `rg -n "runSafetyBench|safety-bench"`. It is not referenced by `mcp_server/package.json` scripts.
  - Recommendation: KEEP-WITH-JUSTIFICATION. This may be a public/manual benchmark API; human review should decide whether to add a package script or retire it.

## Section C -- Legacy Files (4 items)

- File path: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/018-deep-loop-cli-executor/scratch/phase-b-codex-prompt.md`
  - Category: C
  - Severity: MEDIUM
  - Evidence: Frontmatter and content describe Phase 018 execution with embedded Gate 3/session instructions. The location is a legacy nested `.opencode/specs` tree under `mcp_server/`, not the active top-level spec tree.
  - Recommendation: KEEP-WITH-JUSTIFICATION. Preserve Phase 018/019 autonomous-completion directive content unless explicitly approved for relocation or archival.

- File path: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/scripts/map-ground-truth-ids.ts`
  - Category: C
  - Severity: MEDIUM
  - Evidence: The file is a compatibility wrapper in `mcp_server/scripts/`. `rg -n "map-ground-truth-ids|mapGroundTruth" .opencode/skill/system-spec-kit --glob '!**/node_modules/**' --glob '!**/dist/**'` found README/operator references and historical references, but it is not part of active TypeScript package imports.
  - Recommendation: KEEP-WITH-JUSTIFICATION. It is a documented compatibility shim; defer retirement decision to maintainers.

- File path: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/scripts/reindex-embeddings.ts`
  - Category: C
  - Severity: MEDIUM
  - Evidence: The file is a compatibility wrapper in `mcp_server/scripts/`. `rg -n "reindex-embeddings|reindexEmbeddings" .opencode/skill/system-spec-kit --glob '!**/node_modules/**' --glob '!**/dist/**'` found README/operator references and historical references, but it is not part of active TypeScript package imports.
  - Recommendation: KEEP-WITH-JUSTIFICATION. It is a documented compatibility shim; defer retirement decision to maintainers.

- File path: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/.opencode/skill/.advisor-state/generation.json`
  - Category: C
  - Severity: LOW
  - Evidence: Misplaced runtime advisor state at `mcp_server/.opencode/skill/.advisor-state/generation.json`, content was `{"generation":0,"updatedAt":"2026-04-20T19:12:12.176Z"}`. Expected advisor state belongs under the workspace-root `.opencode/skill/.advisor-state/`, not inside the package. Last referenced in commit `97a318d83b`.
  - Recommendation: DELETE. Safe deletion executed.

## Section D -- Empty Folders (9 items)

- File path: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor`
  - Category: D
  - Severity: LOW
  - Evidence: Recursive empty-directory scan found zero files and no `.gitkeep` intent.
  - Recommendation: DELETE. Safe deletion executed.

- File path: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tmp-test-fixtures/specs/system-spec-kit`
  - Category: D
  - Severity: LOW
  - Evidence: Recursive empty-directory scan found zero files and no `.gitkeep` intent.
  - Recommendation: DELETE. Safe deletion executed.

- File path: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/optimizer/audit/promotion-reports`
  - Category: D
  - Severity: LOW
  - Evidence: Recursive empty-directory scan found zero files and no `.gitkeep` intent.
  - Recommendation: DELETE. Safe deletion executed.

- File path: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/.tmp-phase4-pr7`
  - Category: D
  - Severity: LOW
  - Evidence: Recursive empty-directory scan found zero files and no `.gitkeep` intent.
  - Recommendation: DELETE. Safe deletion executed.

- File path: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/.opencode/skill/.advisor-state`
  - Category: D
  - Severity: LOW
  - Evidence: Parent became empty after deleting misplaced `generation.json`; no `.gitkeep` intent.
  - Recommendation: DELETE. Safe deletion executed.

- File path: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/.opencode/skill`
  - Category: D
  - Severity: LOW
  - Evidence: Parent became empty after deleting misplaced advisor state; no `.gitkeep` intent.
  - Recommendation: DELETE. Safe deletion executed.

- File path: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tmp-test-fixtures/specs`
  - Category: D
  - Severity: LOW
  - Evidence: Parent became empty after deleting nested empty fixture folder; no `.gitkeep` intent.
  - Recommendation: DELETE. Safe deletion executed.

- File path: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tmp-test-fixtures`
  - Category: D
  - Severity: LOW
  - Evidence: Parent became empty after deleting nested empty fixture folder; no `.gitkeep` intent.
  - Recommendation: DELETE. Safe deletion executed.

- File path: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/optimizer/audit`
  - Category: D
  - Severity: LOW
  - Evidence: Parent became empty after deleting empty `promotion-reports`; no `.gitkeep` intent.
  - Recommendation: DELETE. Safe deletion executed.

## Section E -- Duplicated Content (2 items)

- File path: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/`
  - Category: E
  - Severity: LOW
  - Evidence: Diff-based similarity found repeated `tasks.md`, `plan.md`, and `spec.md` fixture bodies across `expected-2phase-default/`, `expected-3phase-named/`, and `expected-template-metadata/` with greater than 80 percent overlap.
  - Recommendation: KEEP-WITH-JUSTIFICATION. These are expected-output fixtures; deduplication could reduce test readability and is not a safe deletion.

- File path: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/test-fixtures/`
  - Category: E
  - Severity: LOW
  - Evidence: Diff-based similarity found repeated invalid-template fixture documents across `058-template-reordered-anchor/`, `059-checklist-h1-invalid/`, `060-checklist-chk-format-invalid/`, and `061-template-optional-absent/` with greater than 80 percent overlap.
  - Recommendation: KEEP-WITH-JUSTIFICATION. These are validation fixtures where duplication documents intentional variants.

## Section F -- Runtime Artifacts Tracked (7 items)

- File path: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/shared/mcp_server/database/context-index__voyage__voyage-4__1024.sqlite`
  - Category: F
  - Severity: MEDIUM
  - Evidence: `git ls-files .opencode/skill/system-spec-kit | rg '(\.sqlite|\.wal|\.shm|\.log|-cache\.json)'` showed this SQLite runtime DB as tracked. `shared/mcp_server/database/README.md` says SQLite files are generated at runtime and should not be committed. Last referenced in commit `5a6bc31860`.
  - Recommendation: DELETE. Safe deletion executed.

- File path: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/shared/mcp_server/database/test-context-index.sqlite`
  - Category: F
  - Severity: MEDIUM
  - Evidence: `git ls-files .opencode/skill/system-spec-kit | rg '(\.sqlite|\.wal|\.shm|\.log|-cache\.json)'` showed this SQLite runtime DB as tracked. `shared/mcp_server/database/README.md` says SQLite files are generated at runtime and should not be committed. Last referenced in commit `9a27c5b78f`.
  - Recommendation: DELETE. Safe deletion executed.

- File path: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/.opencode/skill/.advisor-state/generation.json`
  - Category: F
  - Severity: MEDIUM
  - Evidence: Tracked runtime generation state under a package-local `.opencode/skill/.advisor-state/` directory. It is cache/state content, not source.
  - Recommendation: DELETE. Safe deletion executed.

- File path: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/progressive-validation.vitest.d.ts.map`
  - Category: F
  - Severity: LOW
  - Evidence: `git ls-files .opencode/skill/system-spec-kit | rg '(\.d\.ts\.map|\.js\.map)'` found this generated map tracked. `scripts/tests/README.md` explicitly lists generated JavaScript artifacts, and historical spec docs reference the path.
  - Recommendation: KEEP-WITH-JUSTIFICATION. User directive says files referenced by historical spec docs are risky; defer deletion.

- File path: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/progressive-validation.vitest.js.map`
  - Category: F
  - Severity: LOW
  - Evidence: `git ls-files .opencode/skill/system-spec-kit | rg '(\.d\.ts\.map|\.js\.map)'` found this generated map tracked. `scripts/tests/README.md` explicitly lists generated JavaScript artifacts, and historical spec docs reference the path.
  - Recommendation: KEEP-WITH-JUSTIFICATION. User directive says files referenced by historical spec docs are risky; defer deletion.

- File path: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.d.ts.map`
  - Category: F
  - Severity: LOW
  - Evidence: `git ls-files .opencode/skill/system-spec-kit | rg '(\.d\.ts\.map|\.js\.map)'` found this generated map tracked. `scripts/tests/README.md` explicitly lists generated JavaScript artifacts, and historical spec docs reference the path.
  - Recommendation: KEEP-WITH-JUSTIFICATION. User directive says files referenced by historical spec docs are risky; defer deletion.

- File path: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.js.map`
  - Category: F
  - Severity: LOW
  - Evidence: `git ls-files .opencode/skill/system-spec-kit | rg '(\.d\.ts\.map|\.js\.map)'` found this generated map tracked. `scripts/tests/README.md` explicitly lists generated JavaScript artifacts, and historical spec docs reference the path.
  - Recommendation: KEEP-WITH-JUSTIFICATION. User directive says files referenced by historical spec docs are risky; defer deletion.

## Section G -- Stale Configuration (2 items)

- File path: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/README.md`
  - Category: G
  - Severity: MEDIUM
  - Evidence: Lines 120-133 list generated JavaScript artifacts and map files as part of the committed/generated artifact inventory. That documentation keeps generated maps discoverable and is why the map files were deferred.
  - Recommendation: KEEP-WITH-JUSTIFICATION for this audit. If maintainers decide generated test maps should be removed, update this README in the same change.

- File path: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.gitignore`
  - Category: G
  - Severity: MEDIUM
  - Evidence: Tracked runtime SQLite files existed under `shared/mcp_server/database/`, and a package-local `.opencode/skill/.advisor-state/` runtime file existed under `mcp_server/`. The ignore rules did not prevent these tracked artifacts from landing.
  - Recommendation: KEEP-WITH-JUSTIFICATION for this audit because `.gitignore` is outside the authorized write scope. Follow-up recommendation: add package-local runtime-state and SQLite patterns once approved.

## SAFE DELETIONS (executed)

- Deleted `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/shared/mcp_server/database/context-index__voyage__voyage-4__1024.sqlite` - tracked runtime SQLite DB with no source purpose; last referenced in commit `5a6bc31860`.
- Deleted `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/shared/mcp_server/database/test-context-index.sqlite` - tracked runtime SQLite DB with no source purpose; last referenced in commit `9a27c5b78f`.
- Deleted `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/.opencode/skill/.advisor-state/generation.json` - tracked runtime advisor generation state; last referenced in commit `97a318d83b`.
- Removed 9 empty directories with no `.gitkeep` intent:
  - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor`
  - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tmp-test-fixtures/specs/system-spec-kit`
  - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/optimizer/audit/promotion-reports`
  - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/.tmp-phase4-pr7`
  - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/.opencode/skill/.advisor-state`
  - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/.opencode/skill`
  - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tmp-test-fixtures/specs`
  - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tmp-test-fixtures`
  - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/optimizer/audit`

## RISKY FINDINGS (need human review)

- `mcp_server/skill-advisor/bench/safety-bench.ts` and export `runSafetyBench` - no live importer found, but it is exported TypeScript and may be a manual benchmark entry point.
- `mcp_server/skill-advisor/manual_testing_playbook/SCENARIO_RUN_2026-04-21.md` - orphan-like operator-facing documentation.
- `feature_catalog/12--query-intelligence/11-query-concept-expansion.md` - orphan-like feature catalog content.
- `mcp_server/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/018-deep-loop-cli-executor/scratch/phase-b-codex-prompt.md` - misplaced historical Phase 018 scratch content; preserve unless explicitly approved.
- `mcp_server/scripts/map-ground-truth-ids.ts` - documented compatibility wrapper; review before retirement.
- `mcp_server/scripts/reindex-embeddings.ts` - documented compatibility wrapper; review before retirement.
- Duplicate fixture clusters under `scripts/tests/fixtures/phase-creation/` and `scripts/test-fixtures/` - intentional fixture duplication likely worth keeping.
- Generated map files under `scripts/tests/*.map` - generated/tracked artifacts, but documented and historically referenced.
- `.gitignore` gap for runtime SQLite/advisor state - follow-up needed outside this audit's write scope.

## Verification

- `cd .opencode/skill/system-spec-kit/mcp_server && npm run typecheck && npm run build`: exit 0.
- `cd .opencode/skill/system-spec-kit/mcp_server && ../scripts/node_modules/.bin/vitest run mcp_server/skill-advisor/tests/ mcp_server/code-graph/tests/ --reporter=default`: exit 0; 30 test files passed, 219/219 tests passed.
- `python3 .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor_regression.py --dataset .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl`: exit 0; 52/52 cases passed, `overall_pass: true`. The script reported `Skill graph: SQLite unavailable, using JSON fallback`, which is expected after removing tracked runtime SQLite artifacts.
