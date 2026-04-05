# MCP Server Test Comparison: Post-Update vs Pre-Update Baseline

Date: 2026-02-19
Spec: `specs/system-spec-kit/020-mcp-working-memory-hybrid-rag`

---

## 1) Goal

Produce a detailed, reproducible comparison of MCP server test outcomes between:

1. **Post-update state** (current workspace with spec 136 implementation changes), and
2. **Pre-update baseline** (clean detached worktree at commit `1d8e31eb` before local uncommitted updates).

---

## 2) Execution Method

### Post-update run (current workspace)

- Working directory: `.opencode/skill/system-spec-kit/mcp_server`
- Command:

```bash
npm test
```

- Result source: direct Vitest output from current workspace run.

### Pre-update run (clean baseline)

1. Created detached worktree from commit `1d8e31eb`:

```bash
git worktree add --detach "/tmp/spec136-preupdate-mcp-baseline" HEAD
```

2. Installed baseline dependencies (required for test runner availability):

```bash
npm install
```

3. Ran baseline test suite:

```bash
npm test
```

4. Removed temporary worktree after capture:

```bash
git worktree remove --force "/tmp/spec136-preupdate-mcp-baseline"
```

---

## 3) High-Level Results

| Metric | Pre-Update Baseline | Post-Update Current | Delta |
|--------|----------------------|---------------------|-------|
| Test files (total) | 127 | 137 | +10 |
| Test files passed | 75 | 133 | +58 |
| Test files failed | 48 | 0 | -48 |
| Test files skipped | 4 | 4 | 0 |
| Tests (total) | 2852 | 4343 | +1491 |
| Tests passed | 2623 | 4271 | +1648 |
| Tests failed | 156 | 0 | -156 |
| Tests skipped | 73 | 72 | -1 |
| Exit code | 1 (failed) | 0 (passed) | PASS |
| Duration | 2.03s | 3.64s | +1.61s |

### Pass-rate comparison

- **File pass rate (excluding skipped files)**
  - Pre-update: `75 / (127-4) = 75 / 123 = 60.98%`
  - Post-update: `133 / (137-4) = 133 / 133 = 100.00%`

- **Test pass rate (excluding skipped tests)**
  - Pre-update: `2623 / (2852-73) = 2623 / 2779 = 94.39%`
  - Post-update: `4271 / (4343-72) = 4271 / 4271 = 100.00%`

---

## 4) Pre-Update Failure Profile (Baseline)

The pre-update run failed with broad import/export and module resolution issues. Dominant signatures:

1. **Hybrid/BM25 module resolution failures**
   - Repeated: `Cannot find module './bm25-index'`
   - Impacted suites include `tests/hybrid-search.vitest.ts` and related lexical/BM25 paths.

2. **Vector index API/export mismatches**
   - `tests/vector-index-impl.vitest.ts` reported `126 failed` tests.
   - Repeated `TypeError` patterns such as undefined exported functions.

3. **Import-time suite failures with 0 executed tests**
   - Multiple suites loaded as `0 test`, indicating initialization/import failures before test execution.

These baseline failures collectively produced:

- **48 failed test files**
- **156 failed tests**
- **overall failing exit code**

---

## 5) Post-Update Stability Snapshot

Current workspace run completed with no failing suites:

- `133 passed | 4 skipped` files
- `4271 passed | 72 skipped` tests
- no failing test files
- no failing test cases

This resolves all failure categories observed in the baseline run.

---

## 6) Additional Validation Context (Post-Update)

Beyond MCP server tests, the related spec validation and evaluation lanes were re-run and are green:

- Spec validator: `PASSED` (`0 errors`, `0 warnings`)
- Phase 1.5 eval: `rho=1.0000`
- Phase 2 closure metrics:
  - `precision=100.00%`
  - `recall=88.89%`
  - `manual_save_ratio=24.00%`
  - `mrr_ratio=0.9811x`
- Phase 3 telemetry:
  - `session_boost_rate=40.00%`
  - `causal_boost_rate=33.40%`
  - `pressure_activation_rate=64.00%`
  - `extraction_count=104`

---

## 7) Conclusion

Compared to the pre-update MCP server baseline (`1d8e31eb` detached worktree), the post-update state shows a full quality-gate recovery and expansion:

- baseline failure state (`48` failed files, `156` failed tests) -> **fully green**
- increased test surface (`+10` files, `+1491` tests total)
- **100% pass rate on non-skipped tests/files** in current state

Net: The update converts a failing baseline into a stable and significantly broader passing suite.
