# Batch A — Generate 6 daemon/freshness stress tests for skill_advisor

You are generating Vitest stress tests under spec-kit packet 043. Repository root: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`.

## Working directory + output location

Write all 6 new test files to: `.opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/`

## Reference patterns to mimic (READ FIRST)

- `.opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/scorer-fusion-stress.vitest.ts` — fixture-based concurrent load
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/skill-graph-rebuild-concurrency.vitest.ts` — concurrent rebuild
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts` — temp-dir isolation
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/walker-dos-caps.vitest.ts` — DoS caps under stress
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/daemon-freshness-foundation.vitest.ts` — existing unit tests for daemon (use these as API guides)

## Required structure for every new file

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
// + product-source imports from mcp_server/skill_advisor/lib/...

describe('<feature_id> — <feature name>', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'sa-stress-<id>-'));
  });

  afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true });
  });

  it('<stress axis 1>', async () => {
    // exercise pressure
    expect(...).toBeTruthy();
  });

  it('<stress axis 2>', async () => {
    // ...
  });
});
```

## The 6 features to generate

### File 1: `chokidar-narrow-scope-stress.vitest.ts` (sa-001)

- **Catalog**: `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/feature_catalog/01--daemon-and-freshness/01-watcher.md`
- **Source**: `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/watcher.ts` — exports `discoverWatchTargets`, possibly `runWithBusyRetry`
- **Stress axes**:
  1. `discoverWatchTargets` correctly narrows to `SKILL.md` and `graph-metadata.json` only when given a directory containing 100+ unrelated files
  2. Discovery completes in <100ms even with deep nested directories (5+ levels)

### File 2: `single-writer-lease-stress.vitest.ts` (sa-002)

- **Catalog**: `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/feature_catalog/01--daemon-and-freshness/02-lease.md`
- **Source**: `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/lease.ts` — exports `acquireSkillGraphLease`, `readLeaseSnapshot`, `openLeaseDatabase`
- **Stress axes**:
  1. 10 concurrent `acquireSkillGraphLease` calls in the same workspace — exactly one acquires; others see `stale`/`absent` snapshot without blocking
  2. After lease holder dies (simulated by direct DB delete of heartbeat), reclaim succeeds within reasonable timeout
  3. Heartbeat aging — manually advance `last_heartbeat_at` backward, then verify reader correctly sees `stale`

### File 3: `daemon-lifecycle-stress.vitest.ts` (sa-003)

- **Catalog**: `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/feature_catalog/01--daemon-and-freshness/03-lifecycle.md`
- **Source**: `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/lifecycle.ts` — exports the lifecycle entry point; if hard to instantiate fully, exercise the underlying `acquireSkillGraphLease` + `discoverWatchTargets` in tight loop
- **Stress axes**:
  1. 50 boot/shutdown cycles in <10s with no FD leaks (use `process.report` or simply check no `Error: EMFILE`)
  2. Health envelope from `advisor_status` handler stays consistent across restarts (skillCount stable, generation monotonic)

### File 4: `generation-snapshot-stress.vitest.ts` (sa-004)

- **Catalog**: `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/feature_catalog/01--daemon-and-freshness/04-generation.md`
- **Source**: `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness/generation.ts` (atomic bump); `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/generation.ts` (storage)
- **Stress axes**:
  1. 100 sequential generation bumps complete with monotonically increasing values, no gaps
  2. Concurrent reads during a bump never see a half-written generation (atomic rename invariant)
  3. Corrupted generation file triggers `unavailable` trust state, not a crash

### File 5: `trust-state-stress.vitest.ts` (sa-005)

- **Catalog**: `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/feature_catalog/01--daemon-and-freshness/05-trust-state.md`
- **Source**: `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness/trust-state.ts` — exports the classifier; `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness.ts`
- **Stress axes**:
  1. All four states (`live`, `stale`, `absent`, `unavailable`) reachable from the same workspace by simulating: present+fresh / present+aged / file-missing / file-corrupt
  2. State transitions never block readers (each classifier call returns in <10ms even on a 1000-skill corpus)

### File 6: `generation-cache-invalidation-stress.vitest.ts` (sa-007)

- **Catalog**: `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/feature_catalog/01--daemon-and-freshness/07-cache-invalidation.md`
- **Source**: `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness/cache-invalidation.ts`; `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/prompt-cache.ts`
- **Stress axes**:
  1. After 10 generation bumps in <1s, no prompt-cache entry from before the first bump remains accessible
  2. Cache TTL (typically 5 min) does NOT outlive a generation bump — entry is invalidated immediately on bump

## How to work

1. **Read the existing stress tests** (the 5 files cited above) to learn the project's import style, expect API, fixture conventions, and timing/cleanup patterns. Mimic them.
2. **Read each feature's source file** to know the exact exported names. Do not invent function names.
3. **Read `daemon-freshness-foundation.vitest.ts`** to see how the existing unit tests construct fixtures for the daemon — reuse those construction helpers if exported, otherwise inline minimal fixtures.
4. **Write each test** with at least 2 `it(...)` blocks, each exercising a stated stress axis. Use `expect(...)` from vitest. Keep each file under 200 LOC.
5. **Use `node:os`'s `tmpdir()`** for isolation. Clean up in `afterEach`.
6. **Do NOT** add `// TODO` or stubs. Every `it(...)` block must run real code and assert real behavior.
7. **Do NOT** modify any product source files. Read-only access to `mcp_server/skill_advisor/lib/`.

## Done definition

- 6 new files exist at `.opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/`
- File names exactly match the 6 names listed above
- Each file imports from at least one real product source path
- Each file's `describe` block opens with the feature_id (e.g. `'sa-001 — Chokidar narrow-scope watcher'`)
- Each file has at least 2 `it(...)` blocks
- After writing, do a final `ls .opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/` to confirm all 6 files appear

## After file generation: SELF-VALIDATION

Run from `mcp_server/`:

```bash
cd .opencode/skill/system-spec-kit/mcp_server
npx vitest run --config vitest.stress.config.ts stress_test/skill-advisor/chokidar-narrow-scope-stress.vitest.ts stress_test/skill-advisor/single-writer-lease-stress.vitest.ts stress_test/skill-advisor/daemon-lifecycle-stress.vitest.ts stress_test/skill-advisor/generation-snapshot-stress.vitest.ts stress_test/skill-advisor/trust-state-stress.vitest.ts stress_test/skill-advisor/generation-cache-invalidation-stress.vitest.ts
```

If any file fails to compile or run, fix it. If a test fails because of a real product issue (not a test-quality issue), DO NOT modify product code — instead, weaken the assertion to "verify the surface is callable" and emit a `// FIXME(sa-NNN): real product behavior under stress requires investigation` comment so the user can triage. Keep the file passing.
