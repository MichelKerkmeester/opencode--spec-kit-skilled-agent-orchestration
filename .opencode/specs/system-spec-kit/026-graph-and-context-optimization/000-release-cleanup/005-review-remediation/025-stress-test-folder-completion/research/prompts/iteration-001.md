## Packet 038: stress-test-folder-completion — Tier C content-based migration

You are cli-codex (gpt-5.5 high fast) implementing **025-stress-test-folder-completion**.

### CRITICAL CONTEXT — read this first

Packet 037/005 attempted the stress-test folder migration but used a **name-based filter** (`find -iname '*stress*'`). This was scope-narrow: only 2 files matched. The actual stress-test surface lives elsewhere under different names ("harness", "search-quality", "baseline", "telemetry-export", "matrix", etc.).

037/005 result: only 2 files in `mcp_server/stress_test/`:
- `code-graph-degraded-sweep.vitest.ts`
- `session-manager-stress.vitest.ts`

That's ~5% of the actual stress-test surface. The operator explicitly requested a "dedicated folder for the stress test so we can easily maintain and update it from there" — covering EVERY FEATURE of MCP memory, skill advisor, and code graph. Current state does not honor that.

### Goal

Complete the stress-test folder migration with a **content-based** discovery approach. Move ALL stress-test infrastructure from `mcp_server/tests/` to `mcp_server/stress_test/`, organized by subsystem. Update imports, vitest config, package.json scripts, and all doc references. Verify `npm run stress` runs the FULL suite.

### Read these first

- `.opencode/skill/system-spec-kit/mcp_server/stress_test/README.md` (current minimal state)
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/` (entire dir — this is THE main stress harness; ~10+ files)
- `.opencode/skill/system-spec-kit/mcp_server/tests/README.md` (boundary doc)
- `.opencode/skill/system-spec-kit/mcp_server/vitest.config.ts` + `package.json` (current test discovery + scripts)
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/024-followup-quality-pass/005-stress-test-folder-migration/migration-plan.md` (what the prior pass did/missed)
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/spec.md` (stress-cycle history; references the harness pattern)

### Phase 1: Content-based discovery

Run this discovery sequence — DO NOT filter on filename alone:

```bash
# Discover the harness directory (move whole dir)
ls .opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/

# Discover files importing harness (these are stress-test consumers)
grep -rln "from.*['\"].*search-quality" .opencode/skill/system-spec-kit/mcp_server/tests/ \
  --include='*.ts' --include='*.vitest.ts'

# Discover files using stress patterns (concurrency, throughput, load)
grep -rln "concurrency\|throughput\|spike\|stress\|load test\|matrix cell\|stage1\|stage2.*\.ts" \
  .opencode/skill/system-spec-kit/mcp_server/tests/ --include='*.vitest.ts'

# Discover files matching W3-W13 stress cells (search feature stress)
grep -rln "^const W[0-9]\|stress.*cell\|baseline.*matrix\|telemetry.*export.*mode" \
  .opencode/skill/system-spec-kit/mcp_server/tests/ --include='*.vitest.ts'

# Discover by recent stress-cycle commits
git --no-pager log --oneline --since='2026-04-01' \
  --grep='stress\|harness\|matrix\|cell\|baseline\|telemetry-export' | head -30
```

Classify each candidate as:
- **STRESS_HARNESS** (search-quality/* — the harness machinery; move whole dir)
- **STRESS_CONSUMER** (vitest files that import harness; move them)
- **STRESS_PATTERN** (vitest files exercising load/throughput/spike/concurrency without harness; move them)
- **MATRIX_CELL** (W-cell matrix tests, baseline runs, per-feature stress cells; move them)
- **AMBIGUOUS** (looks stress-like but mixed with unit tests; document and leave)
- **NOT_STRESS** (pure unit / integration; leave in tests/)

Write `migration-plan.md` at packet root listing every file with its classification + rationale.

### Phase 2: Reorganize stress_test/ by subsystem

Create this structure under `.opencode/skill/system-spec-kit/mcp_server/stress_test/`:

```
stress_test/
├── README.md (refresh — reflects full structure)
├── search-quality/         ← move whole stress_test/search-quality/ here
├── memory/                 ← memory-subsystem stress tests
├── skill-advisor/          ← skill advisor stress tests
├── code-graph/             ← code-graph stress tests (existing degraded-sweep here)
├── session/                ← session-manager stress (existing here)
└── matrix/                 ← W3-W13 cells, harness baselines, matrix invocations
```

Subsystem assignment by content:
- **search-quality/**: the entire dir; covers harness, corpus, metrics, baseline, telemetry-export, w10/w11/w13
- **memory/**: tests touching memory_save throughput, memory_index churn, FTS/vector load, retention sweep load, scope-governance bulk
- **skill-advisor/**: tests touching advisor-status spike, advisor-rebuild load, daemon TOKEN_BOOSTS, plugin bridge load
- **code-graph/**: code-graph-degraded-sweep.vitest.ts (move from current location), plus any full-scan/large-repo/readiness-spike tests
- **session/**: session-manager-stress.vitest.ts (move from current location), plus any session-bootstrap stress
- **matrix/**: matrix-cell tests, W3-W13 cell tests, baseline.vitest.ts (if not in search-quality/)

Use `git mv` for every move (preserves blame).

### Phase 3: Update imports

For each moved file, walk through its imports — paths likely need updating since the file moved deeper. Also: any file IN tests/ or elsewhere that imports FROM a moved file needs its import path updated.

Use `grep -rln "from.*<old-relative-path>" .opencode/skill/system-spec-kit/mcp_server/` for each moved file.

### Phase 4: Update vitest config

`vitest.config.ts` needs:
- Default `npm test` runs `tests/**/*.vitest.ts` only (fast, unit/integration)
- `npm run stress` runs `stress_test/**/*.vitest.ts` (slow, the full surface)
- Maintain existing exclude patterns for hangs (per memory feedback)

If a separate `vitest.stress.config.ts` is cleaner, create one and reference it from package.json scripts.

### Phase 5: Update package.json

Confirm scripts:
- `"test"`: runs unit/integration only
- `"stress"`: runs full stress folder
- `"stress:harness"`: optional — just the search-quality harness
- `"stress:matrix"`: optional — just the matrix subdir

### Phase 6: Update doc references

Find every reference to old paths (e.g., `stress_test/search-quality/...`, `stress_test/code-graph/code-graph-degraded-sweep`, etc.) across:
- `.opencode/skill/system-spec-kit/mcp_server/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/README.md` (refresh)
- `.opencode/skill/system-spec-kit/mcp_server/tests/README.md`
- All packet docs in `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/**` (the stress-cycle packets that cite harness paths)
- `specs/system-spec-kit/026-graph-and-context-optimization/030-v1-0-4-full-matrix-stress-test-design/**`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/022-full-matrix-execution-validation/**`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/024-followup-quality-pass/005-stress-test-folder-migration/migration-plan.md` (note that 038 supersedes the partial migration)

Use a scoped grep over moved stress-test path stems in `.opencode/` and `specs/`
to surface any remaining stale references.

### Phase 7: Verification

```bash
cd .opencode/skill/system-spec-kit/mcp_server
npm run build  # MUST pass
npm test       # MUST pass (no broken imports from moves)
npm run stress 2>&1 | head -100  # The full stress suite is now reachable
```

If the broad `npm test` hits pre-existing hangs (memory feedback notes this), document it but DO NOT block on it. Verify the moved stress files run cleanly under `npm run stress`.

### Packet structure to create (Level 2)

7-file structure under `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/025-stress-test-folder-completion/`.

PLUS: `migration-plan.md` at packet root listing every classified file.

**Deps**: `manual.depends_on=["system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/024-followup-quality-pass/005-stress-test-folder-migration"]`. (037/005 was a partial first pass; 038 completes it.)

**Trigger phrases**: `["025-stress-test-folder-completion","stress test full migration","search-quality harness move","content-based stress migration","stress folder reorganization"]`.

**Causal summary**: `"Completes the stress-test folder migration that 037/005 only partially executed. Moves the search-quality harness directory, harness consumers, stress patterns, and matrix-cell tests into mcp_server/stress_test/ organized by subsystem (search-quality, memory, skill-advisor, code-graph, session, matrix). Content-based discovery (not name-based). Updates imports, vitest config, package.json, all doc references."`.

**Frontmatter**: compact `recent_action` / `next_safe_action` rules. < 80 chars.

### Constraints

- Strict validator MUST exit 0 on this packet.
- Build MUST pass.
- `npm run stress` MUST execute the moved files cleanly.
- DO NOT commit; orchestrator will commit.
- Use `git mv` for all moves (preserves blame across the move).
- Cite file:line evidence in packet docs.
- If a candidate is genuinely AMBIGUOUS (mix of unit and stress), document in migration-plan.md and leave in tests/.
- Honest reporting: if some stress tests can't be moved cleanly (circular imports, vitest config edge case), document the blocker in migration-plan.md.

When done, last action is strict validator + build passing + `npm run stress` reaching the full surface. No narration; just write files and exit.
