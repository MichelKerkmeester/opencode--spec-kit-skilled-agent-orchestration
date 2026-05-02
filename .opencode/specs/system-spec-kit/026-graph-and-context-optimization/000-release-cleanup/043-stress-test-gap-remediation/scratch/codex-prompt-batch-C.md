# Batch C — sa-037 Python bench wrapper stress test

You are generating ONE Vitest stress test that wraps the Python skill_advisor bench runner. Repository root: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`.

## Output location

`.opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/python-bench-runner-stress.vitest.ts`

## Feature

- **feature_id**: `sa-037`
- **Catalog**: `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/feature_catalog/08--python-compat/03-bench-runner.md`
- **Python script**: `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor_bench.py` — measures cache-hit p95 ≤ 50ms, uncached p95 ≤ 60ms (or whatever the catalog documents)

## Reference patterns

- `.opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/scorer-fusion-stress.vitest.ts`
- Sibling tests under `mcp_server/stress_test/`

## Required behavior

1. **Python interpreter detection**: at the top of the test, probe `python3 --version` via `child_process.execSync`. If absent or non-zero exit, the entire suite must `it.skip(...)` with a clear reason (e.g. `'sa-037 skipped: python3 not available on PATH'`).
2. **Subprocess invocation**: spawn the bench runner with a small but realistic input set (e.g. 10-20 prompts). Capture stdout/stderr.
3. **Pass criteria**: the wrapper test passes when:
   - The Python process exits with code 0 (or exits with code 0 OR a documented "no benchmarks ran" code)
   - stdout is non-empty
   - If the bench script outputs a JSON envelope with p95 numbers, parse it and assert p95 ≤ documented bound

If the Python script signature, input format, or output schema is unclear, READ THE PYTHON SCRIPT to learn it. If the script requires arguments, pass them. If it requires a fixture file, write a minimal one to `tmpdir()`.

## Required structure

```typescript
import { describe, it, expect } from 'vitest';
import { execSync, spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const PYTHON_AVAILABLE = (() => {
  try {
    execSync('python3 --version', { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
})();

const BENCH_SCRIPT = '<absolute or repo-root-relative path to skill_advisor_bench.py>';

describe('sa-037 — Python bench runner', () => {
  if (!PYTHON_AVAILABLE) {
    it.skip('python3 not available on PATH; sa-037 skipped', () => {});
    return;
  }

  it('runs without error on a small synthetic input', () => {
    // spawn with --help or minimal args first, verify exit 0
  });

  it('produces a parseable output envelope', () => {
    // spawn with a real input fixture, capture stdout, parse, assert
  });
});
```

## How to work

1. **Read the Python script first** to understand its CLI interface and output format. Cite the script path verbatim in the test.
2. **Write the test** with the early-return skip pattern shown above.
3. **Use `tmpdir()`** for any input fixture files; clean in `afterEach` if used.
4. **Self-validate** by running:

```bash
cd .opencode/skill/system-spec-kit/mcp_server
npx vitest run --config vitest.stress.config.ts stress_test/skill-advisor/python-bench-runner-stress.vitest.ts
```

If the test fails because the Python script has an unexpected signature or schema, adjust the test to match the actual script — do NOT modify the Python script. If the Python script truly cannot be invoked headlessly without modification, document the limitation in a code comment and weaken the test to "verify python3 + script existence + invocation surface" as the minimum.

## Done definition

- 1 new file at the documented path
- File is self-contained (no external deps beyond `node:child_process` and `vitest`)
- Test is `it.skip` when `python3` is missing
- Test passes when `python3` is available and the script is functional
