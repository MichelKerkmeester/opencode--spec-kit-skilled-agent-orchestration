## Packet 045/010: upgrade-safety-operability — Deep-review angle 10 (release-readiness)

### CRITICAL: Spec folder path

The packet folder for THIS audit is: `specs/system-spec-kit/026-graph-and-context-optimization/045-release-readiness-deep-review-program/010-upgrade-safety-operability/` — write ALL packet files (spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md, description.json, graph-metadata.json, review-report.md) under that path. Do NOT ask for the spec folder; use this exact path.

READ-ONLY deep-review audit. Output: `review-report.md` with severity-classified P0/P1/P2 findings.

### Target surface

- `.opencode/skill/system-spec-kit/mcp_server/db/` (schema migrations)
- `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md`
- `.opencode/skill/system-spec-kit/mcp_server/package.json` (scripts; npm test, npm run stress, npm run hook-tests)
- `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md`
- `.opencode/command/doctor/assets/doctor_mcp_install_*.yaml`
- `.opencode/command/doctor/assets/doctor_mcp_debug_*.yaml`
- Recent file relocations: `mcp_server/stress_test/` (from 037/005 + 038), `mcp_server/matrix_runners/` (from 036), `mcp_server/code_graph/feature_catalog/` (from 039)
- Configuration sanity: `opencode.json`, runtime hook configs

### Audit dimensions + operability-specific questions

For correctness: install/upgrade flow works on a clean checkout; DB migrations have rollback paths; relocated files have working import paths.

For security: install guide doesn't recommend insecure defaults (e.g., `--allow-all-tools` without context); env vars don't expose secrets.

For traceability: install/upgrade emits clear progress signals; failures are operator-actionable; doctor commands actually diagnose.

For maintainability: package.json scripts are documented; env vars have defaults; sanity-check the env-flag default-state table from 034.

### Specific questions

- After 038's stress-test folder migration, are there any orphan imports from `tests/search-quality/` or `tests/code-graph-degraded-sweep` that still reference the old paths?
- After 036's matrix_runners addition, is `npm run hook-tests` reachable from the post-044 npm scripts?
- DB migrations: can a fresh install reach the current schema? Can an old DB (e.g., 026/005 era) upgrade cleanly?
- doctor:mcp_install workflow: does it install the 4 native MCP servers cleanly, in correct order, with verification?
- doctor:mcp_debug: what diagnostic signals does it surface? Are there gaps?
- Env var defaults: SPECKIT_RETENTION_SWEEP=on (default), SPECKIT_FILE_WATCHER=off (default), etc. Is the default state matrix accurate in ENV_REFERENCE.md?
- Backwards-compat: do existing spec folders (e.g., 026/005-memory-indexer-invariants) still validate cleanly under the current validator?

### Read also

- 037/005 + 038 stress-test folder migration plans
- 036 matrix_runners README
- 042 README refresh (cites tool counts + scripts)
- 034 env-flag default-state table

### Output

Same 9-section review-report.md format. Severity rubric: P0=clean install fails / DB migration breaks / orphan imports break build, P1=upgrade path drift / doctor gaps, P2=ergonomics.

### Packet structure (Level 2)

Same 7-file structure. Deps include 045 phase parent.

**Trigger phrases**: `["045-010-upgrade-safety-operability","upgrade safety audit","operability review","install guide review","doctor mcp install review"]`.

**Causal summary**: `"Deep-review angle 10: upgrade safety + operability — DB migrations, install/upgrade flow, file relocations don't break imports, doctor commands diagnose, env var defaults sanity, backwards-compat."`.

### Constraints

READ-ONLY. Strict validator must exit 0. Cite file:line. DO NOT commit. Evergreen-doc rule.

When done, last action: strict validator passing + review-report.md complete.
