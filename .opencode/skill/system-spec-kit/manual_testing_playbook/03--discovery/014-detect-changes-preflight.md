---
title: "EX-014 -- detect_changes preflight (Code Graph)"
description: "This scenario validates detect_changes for `EX-014`. It covers the P1 safety invariant (status='blocked' on stale graph; accurate symbol attribution on fresh graph) AND two 010/007 hardening scenarios: adversarial path traversal rejection (R-007-3) and multi-file diff boundary correctness (R-007-4)."
---

# EX-014 -- detect_changes preflight (Code Graph)

## 1. OVERVIEW

This scenario validates `detect_changes` end-to-end. Covers (1) the P1 safety invariant — `status='blocked'` on stale graph, `status='ok'` with accurate symbol attribution on fresh graph; (2) **adversarial path traversal** rejection added in 010/007/T-D (R-007-3); (3) **multi-file diff boundary** correctness added in 010/007/T-D (R-007-4) so a 3-file diff doesn't have downstream files' `--- a/<path>` headers consumed as hunk-body lines.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `EX-014` and confirm the expected signals without contradicting evidence.

- Objective: Confirm `detect_changes` refuses to answer on stale state, reports correct affected symbols on fresh state, rejects diffs whose paths escape the canonical root, and correctly partitions multi-file diffs.
- Prompt: `As a discovery validation operator, validate detect_changes against (1) a stale graph, (2) a fresh graph with a single-file diff, (3) a fresh graph with an adversarial path-traversal diff, and (4) a fresh graph with a 3-file diff. Verify the stale run returns status='blocked' (never 'ok' with empty affectedSymbols), the fresh run returns status='ok' with affectedSymbols, the path-traversal run returns status='parse_error' with blockedReason naming the offending path, and the 3-file run attributes symbols to all three files without dropping any. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: `status='blocked'` on stale; `status='ok'` with non-empty `affectedSymbols` on fresh diff; `status='parse_error'` on path traversal; `status='ok'` with `affectedFiles.length === 3` on multi-file diff.
- Pass/fail: PASS if all four behaviors are observed; FAIL on any false-safe (`'ok'` with empty `affectedSymbols` on stale OR silent acceptance of a `../../etc/passwd` path) or on a multi-file diff that drops a file.

---

## 3. TEST EXECUTION

### Prompt

```
As a discovery validation operator, validate detect_changes preflight against the documented validation surface. Run it once when the graph is intentionally stale, once after a fresh code_graph_scan with a single-file diff, once with an adversarial path-traversal diff, and once with a 3-file diff. Verify status='blocked' on stale (NEVER 'ok' with empty affectedSymbols), status='ok' with the expected affected symbols on fresh single-file, status='parse_error' on path traversal, and status='ok' with all three files attributed on multi-file. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

**Block A — Stale-vs-fresh safety invariant (P1):**

1. Modify a tracked source file to make the graph stale (or skip running `code_graph_scan`).
2. Generate a unified diff that touches a known indexed function: `git diff -- path/to/file.ts > /tmp/diff.txt`.
3. Call `detect_changes({ diff: <diff text>, rootDir: <workspace> })` with the stale graph and confirm `status: 'blocked'` plus a `blockedReason` describing the stale state.
4. Run `code_graph_scan({ incremental: true })` to refresh the graph.
5. Re-run `detect_changes` with the same diff and confirm `status: 'ok'` plus `affectedSymbols[]` containing the touched function/class/method by `fqName`.
6. Inspect `affectedFiles` to confirm the touched file paths roll up correctly.

**Block B — Adversarial path traversal (R-007-3, 010/007/T-D):**

7. Construct a unified diff whose `--- a/` and `+++ b/` headers reference a path that resolves outside the canonical root, e.g. `--- a/../../etc/passwd` / `+++ b/../../etc/passwd` with a synthetic `@@` hunk body.
8. Call `detect_changes({ diff: <adversarial diff>, rootDir: <workspace> })` with a fresh graph.
9. Confirm response: `status: 'parse_error'`, `affectedSymbols: []`, `blockedReason` STRING containing the offending escape path AND a phrase like "outside canonical root" or "path containment".
10. Cross-check with a relative-path variant: `--- a/legitimate/file.ts` should still PASS through the canonical-root check (assertion: prior fresh-diff step still returns `'ok'`).

**Block C — Multi-file diff boundary (R-007-4, 010/007/T-D):**

11. Generate a 3-file unified diff: `git diff -- path/a.ts path/b.ts path/c.ts > /tmp/multi.diff`. Each file should have at least one `@@`-bounded hunk that touches an indexed symbol.
12. Call `detect_changes({ diff: <multi-file diff>, rootDir: <workspace> })` with a fresh graph.
13. Confirm `affectedFiles.length === 3` AND each file's expected symbols appear in `affectedSymbols[]`.
14. **Boundary assertion**: confirm none of the downstream files' `--- a/<path>` or `+++ b/<path>` lines were consumed as a previous file's hunk-body line. Operationally: the symbol counts for files B and C should not be undercounted vs running each file's diff in isolation. Compare `affectedSymbols` returned for the combined diff against running steps 11–13 with each file's diff individually; the union must be identical.

### Expected

- Block A: Stale graph → `{ status: 'blocked', affectedSymbols: [], blockedReason: 'graph readiness is "stale" ...', readiness.freshness: 'stale' }`. Fresh graph → `{ status: 'ok', affectedSymbols: [...], affectedFiles: [...], readiness.freshness: 'fresh' }`.
- Block B: Adversarial path → `{ status: 'parse_error', affectedSymbols: [], blockedReason: '... <offending-path> ... outside canonical root ...' }`. Legitimate relative path → unchanged (still `'ok'`).
- Block C: 3-file diff → `{ status: 'ok', affectedFiles: [...3 paths], affectedSymbols: <union of per-file outputs> }`.

### Evidence

Stored response payloads from steps 3, 5, 9, 10, 13; the diff texts from steps 2, 7, 11; the file paths and known indexed symbol `fqNames` from `code_graph_query({ operation: 'outline', subject: <filePath> })`. For Block C, also store the per-file response payloads from running each file's diff in isolation, used as the boundary-correctness reference.

### Pass / Fail

- **Pass**: All three blocks pass their assertions. Block A: stale → `'blocked'`, fresh → `'ok'` with expected symbols. Block B: traversal path rejected with `'parse_error'`. Block C: combined-diff response matches union of per-file responses.
- **Fail**: Block A: stale invocation returns `'ok'` with empty `affectedSymbols` (false-safe RISK-03 violation). Block B: traversal path returns `'ok'` (R-007-3 regression — security-critical). Block C: combined-diff response missing symbols that appear in a per-file response (R-007-4 regression — multi-file boundary leaked into hunk body).

### Failure Triage

- Block A: confirm `ensureCodeGraphReady` is wired with `allowInlineIndex: false` so the read path doesn't silently scan → check `mcp_server/code_graph/handlers/detect-changes.ts:readinessRequiresBlock` switch is comparing against `'fresh'` only → if attribution misses, inspect `queryOutline(filePath)` rows and `parseUnifiedDiff` hunk ranges for off-by-one in line numbering.
- Block B: confirm `mcp_server/code_graph/handlers/detect-changes.ts:118-160` returns the structured `CandidatePathResult` with `status: 'reject'` for paths escaping `canonicalRootDir` (010/007/T-D R-007-3); verify the `blockedReason` string carries the offending path.
- Block C: confirm `mcp_server/code_graph/lib/diff-parser.ts:109-220` tracks `remainingOldLines` / `remainingNewLines` per hunk so subsequent `---`/`+++` headers terminate the hunk body (010/007/T-D R-007-4); compare hunk-body line counters against expected per-file totals.

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [03--discovery/04-detect-changes-preflight.md](../../feature_catalog/03--discovery/04-detect-changes-preflight.md)

---

## 5. SOURCE METADATA

- Group: Discovery
- Playbook ID: EX-014
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--discovery/014-detect-changes-preflight.md`
- Phase / sub-phase: `026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/002-code-graph-phase-runner-and-detect-changes` (P1 stale/fresh) + `026/010/007-review-remediation` T-D (R-007-3 path traversal + R-007-4 multi-file boundary)
- Research basis: pt-02 §11 Packet 1, §12 RISK-03; 010/007/T-D R-007-3 + R-007-4
- Coverage extension: 010/011-manual-testing-playbook-coverage-and-run (Blocks B + C added)
