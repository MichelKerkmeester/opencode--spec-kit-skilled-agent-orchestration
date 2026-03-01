# CI Monitoring Notes: Hybrid RAG Fusion

> **Spec:** 138-hybrid-rag-fusion | **Last updated:** 2026-02-20

---

## 1. Skill Graph Link Validation (`check-links.sh`)

**Integration point:** Post-merge CI hook.

```bash
# Run link validation after merge to main
./check-links.sh
```

- Validates all wikilinks across skill files to ensure zero broken references.
- Must exit 0 (CHK-005 verified: 0 broken wikilinks).
- Should run on every merge that touches files under `.opencode/skill/` or skill graph metadata.

**Recommended CI step:**

```yaml
- name: Validate skill graph links
  run: ./check-links.sh
  if: github.event_name == 'push' && github.ref == 'refs/heads/main'
```

---

## 2. Full Test Suite

**Command:**

```bash
npx vitest run
```

**Expected baseline:**
- **159 test files**
- **~4770 tests**
- All must pass (exit 0)

**CI integration:**

```yaml
- name: Run test suite
  run: npx vitest run
  timeout-minutes: 5
```

---

## 3. Regression Guard: Flag-Off Baseline

**Critical test file:** `tests/graph-regression-flag-off.vitest.ts`

- **18 tests** verify that the hybrid search pipeline behaves identically to pre-graph baseline when all feature flags are off (default state).
- This file must always pass regardless of other changes.
- If any of these 18 tests fail, it indicates a regression in the flag-off code path -- the graph channel is leaking into the default pipeline.

**Targeted run:**

```bash
npx vitest run tests/graph-regression-flag-off.vitest.ts
```

---

## 4. Feature Flag Smoke Test

**Verify all 3 flags default to `false`:**

The following must hold true in any environment where the flags are not explicitly set:

| Flag | Check | Expected |
|------|-------|----------|
| `SPECKIT_GRAPH_UNIFIED` | `isGraphUnifiedEnabled()` | `false` |
| `SPECKIT_GRAPH_MMR` | `isGraphMMREnabled()` | `false` |
| `SPECKIT_GRAPH_AUTHORITY` | `isGraphAuthorityEnabled()` | `false` |

**Verified by:** `tests/graph-flags.vitest.ts` (12 unit tests covering all flag states including default-off, explicit true, explicit false, and non-'true' values).

**Targeted run:**

```bash
npx vitest run tests/graph-flags.vitest.ts
```

---

## 5. Monitoring Checklist for CI Pipeline

| Check | Frequency | Fail Action |
|-------|-----------|-------------|
| `check-links.sh` exits 0 | Every merge to main | Block merge, fix broken links |
| Full test suite passes (159 files) | Every PR / push | Block merge |
| `graph-regression-flag-off.vitest.ts` passes (18 tests) | Every PR / push | Critical: graph code leaking into default path |
| `graph-flags.vitest.ts` passes (12 tests) | Every PR / push | Flag defaults may have changed |
| No new npm dependencies added | PR review | Manual check against CHK-131 |
