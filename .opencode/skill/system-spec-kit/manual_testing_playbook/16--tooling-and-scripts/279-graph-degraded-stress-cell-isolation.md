---
title: "279 -- Graph degraded stress cell with SPEC_KIT_DB_DIR isolation"
description: "This scenario validates the deterministic isolated-DB sweep that exercises all 4 fallbackDecision matrix branches without touching the live code-graph DB (packet 013). Pattern: initDb(tmpdir) + vi.spyOn(getDb) + sha256 byte-equality."
---

# 279 -- Graph degraded stress cell with SPEC_KIT_DB_DIR isolation

## 1. OVERVIEW

This scenario validates the integration sweep authored in packet 013 that closes the v1.0.2 NEUTRAL verdict on packet 005's fast-fail handler. It focuses on the test-isolation pattern (`initDb(tmpdir)` + `vi.spyOn(getDb)` + `vi.spyOn(process, 'cwd')`) plus the live-DB byte-equality guard that proves the sweep cannot mutate production bytes.

---

## 2. SCENARIO CONTRACT

- **Objective**: Verify the deterministic isolated-DB sweep exercises all 4 `fallbackDecision` matrix branches end-to-end without touching the live code-graph DB. Each bucket sets up a fresh tmpdir, swaps the DB singleton via `initDb(tempDir)`, and pins `process.cwd()` to keep the readiness-debounce cache key unique per test.
- **Prerequisites**:
  - Working directory is the project root
  - `mcp_server/tests/code-graph-degraded-sweep.vitest.ts` exists and is the post-013 sweep
  - `shasum` (or `sha256sum`) available for byte-equality assertion
  - Live `mcp_server/database/code-graph.sqlite` present (the guard cannot validate against a missing DB)
- **Prompt**: `As a tooling validation operator, validate the graph degraded stress cell isolation contract against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/code-graph-degraded-sweep.vitest.ts. Verify the 4 buckets (empty, broad-stale, readiness exception, fresh) emit the documented fallbackDecision routing, the live code-graph.sqlite is byte-equal sha256 pre/post, and the suite completes in under 1 second. Return a concise pass/fail verdict with the main reason and cited evidence.`
- **Expected signals**:
  - All 4 buckets pass: empty + broad-stale → `nextTool:"code_graph_scan"`; readiness exception → `nextTool:"rg"`; fresh → no `fallbackDecision`
  - Live `code-graph.sqlite` sha256 byte-equal before and after the sweep (proves `initDb(tmpdir)` + spy isolation works)
  - Suite runtime < 1 second (deterministic, no I/O against the live DB)
  - The dedicated guard test (`does not mutate the live code-graph.sqlite during the sweep`) is wired and passes
- **Pass/fail criteria**:
  - PASS: 4 buckets correct routing AND live DB byte-equal AND runtime under 1s AND guard test passes
  - FAIL: any bucket mis-routes, live DB sha256 changes, runtime exceeds budget by >5x, or the guard test silently no-ops because the live DB is missing

---

## 3. TEST EXECUTION

### Prompt

```
As a tooling validation operator, validate the isolated-DB sweep + live-DB byte-equality guard. Run the vitest, capture sha256 pre/post on the live code-graph.sqlite, assert all 4 buckets pass and bytes unchanged. Return a concise pass/fail verdict.
```

### Commands

1. `shasum -a 256 .opencode/skill/system-spec-kit/mcp_server/database/code-graph.sqlite > /tmp/279-pre.sha`
2. `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/code-graph-degraded-sweep.vitest.ts 2>&1 | tee /tmp/279-vitest.txt`
3. `shasum -a 256 .opencode/skill/system-spec-kit/mcp_server/database/code-graph.sqlite > /tmp/279-post.sha && diff /tmp/279-pre.sha /tmp/279-post.sha`

### Expected

Vitest exits 0 with all 4 bucket assertions passing and the dedicated live-DB guard test passing. Sha256 diff is empty (live DB byte-equal pre/post). Suite total runtime under 1 second.

### Evidence

`/tmp/279-vitest.txt` (vitest transcript with all 4 buckets + guard test) + `/tmp/279-pre.sha` + `/tmp/279-post.sha` + diff output

### Pass / Fail

- **Pass**: vitest exits 0 with 5 tests passing (4 buckets + guard) AND sha256 diff empty
- **Fail**: any bucket fails, guard test fails, runtime >5s, OR sha256 diff non-empty (live DB was touched — isolation broke)

### Failure Triage

If sha256 diff non-empty: inspect `mcp_server/tests/code-graph-degraded-sweep.vitest.ts` for missing `initDb(tempDir)` call, missing `vi.spyOn(process, 'cwd')` pin, or readiness-debounce cache leak. If guard test no-ops (live DB absent): the protection check cannot run; restore the live DB before re-running. If a bucket mis-routes: cross-check against `mcp_server/code_graph/handlers/query.ts` `buildGraphQueryPayload()` and `mcp_server/code_graph/lib/ensure-ready.ts` `detectState()`.

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Sibling (operator-facing fast-fail contract): [22--context-preservation-and-code-graph/277-code-graph-fast-fail.md](../22--context-preservation-and-code-graph/277-code-graph-fast-fail.md)
- Sibling (rebuild + restart + live probe): [278-mcp-daemon-rebuild-restart-live-probe.md](./278-mcp-daemon-rebuild-restart-live-probe.md)
- Implementation summary: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/013-graph-degraded-stress-cell/implementation-summary.md`

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 279
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/279-graph-degraded-stress-cell-isolation.md`
