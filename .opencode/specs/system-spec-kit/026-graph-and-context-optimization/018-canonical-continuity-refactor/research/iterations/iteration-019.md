---
title: "Iteration 019 — Testing strategy and evidence plan"
iteration: 19
band: D
timestamp: 2026-04-11T15:05:00Z
worker: claude-opus-4-6
scope: q9_testing_strategy
status: complete
focus: "Enumerate test classes, blocking vs informational, automation requirements before phase 018 merges."
maps_to_questions: [Q9]
---

# Iteration 019 — Testing Strategy

## Goal

What test coverage does phase 018 need before it can merge? Which tests are blocking, which are informational, which must be automated vs manual?

## Test class taxonomy

### Class 1: Unit tests (target: >80% coverage of new code)

**Target modules**:
- `contentRouter` classifier (iteration 2) — 15-20 unit tests per category × 8 categories = 120+ tests
- `anchorMergeOperation` merge modes (iteration 3) — 10 unit tests per mode × 5 modes = 50 tests
- `thin continuity schema` validation (iteration 5) — 10 tests (valid/invalid blocks)
- `spec-doc-structure` validator (iteration 9) — 15 tests
- `resumeLadder` (iteration 13) — 10 tests for each fallback path

**Total new unit tests**: ~200

**Blocking**: yes. Cannot merge phase 018 without green unit tests on the new components.

**Automation**: run in CI on every PR. Existing `vitest` infrastructure at `mcp_server/test/` and `scripts/tests/`.

### Class 2: Integration tests (end-to-end save + search + resume)

**Target scenarios**:
- Fresh packet: plan → save → resume → search → complete (end-to-end)
- Existing packet: save adds to existing anchors without corrupting them
- Concurrent saves to the same packet (mutex works)
- External edit during save (mtime check works)
- Root-packet with no canonical docs (fallback to archived)

**Total integration tests**: ~25

**Blocking**: yes. Cannot merge without green integration tests.

**Automation**: run in CI nightly (too slow for per-PR). Use a test spec folder that gets reset between runs.

### Class 3: Regression tests (all 13 features still work)

**Target**: one regression test per advanced feature (from phase 017 feature list):

1. Trigger phrase matching — sub-ms latency preserved
2. Intent routing — 7 intents route correctly
3. Session dedup — ~50% token savings preserved
4. Quality gates — reject invalid inputs, accept valid
5. Reconsolidation — >0.96 similarity auto-merges
6. Causal graph — 2-hop BFS traversal
7. Memory tiers — constitutional always surfaces
8. FSRS decay — retrievability decreases over time
9. Shared memory — deny-by-default works
10. Ablation — `archived_hit_rate` metric emitted
11. Constitutional — moved to dedicated dir
12. Embedding search — Voyage 1024-dim unchanged
13. 4-stage pipeline — gather/score/rerank/filter all work

**Total regression tests**: 13

**Blocking**: yes. Cannot merge without green regression on all 13.

**Automation**: run in CI nightly. Each regression is small (≤50 LOC) and fast.

### Class 4: Performance tests

**Target metrics**:
- Resume latency p95 < 500ms
- Save latency p95 < 2s
- Trigger match latency p95 < 10ms
- Search latency p95 < 300ms
- Embedding warmup time < 5s (improvement from current 30s)

**Blocking**: partial. p95 targets are soft blockers (fail = investigation, not automatic reject). Latency spikes >2x baseline are hard blockers.

**Automation**: benchmark suite runs on every PR against a fixed test dataset. Historical trend stored in the dashboard.

### Class 5: UX / manual playbook

**Target playbooks**:
- Manual resume flow (user runs `/spec_kit:resume`, verifies output)
- Manual save flow (user runs `/memory:save`, inspects routing output)
- Manual override (user passes `--route-as`)
- Manual rollback (user reverts via git)
- Manual conflict resolution (simulate external edit)

**Total playbooks**: ~10

**Blocking**: no. Informational — runs before each phase 018 release for smoke-check.

**Automation**: manual, documented in `manual-testing-playbook.md`. Operators run before tagging a release.

## Test infrastructure requirements

| Infrastructure | Exists? | Action |
|---|---|---|
| vitest for unit tests | Yes (mcp_server/test/, scripts/tests/) | Reuse |
| Integration test spec folder | No | Create `test-fixtures/phase-018-packet/` |
| Benchmark suite | Partially (some perf tests exist) | Extend with new metrics |
| Manual playbook doc | Yes (sk-doc manual-testing-playbook) | Add phase 018 playbooks |
| CI per-PR workflow | Yes | Add new test classes |
| CI nightly workflow | Yes (for longer tests) | Add integration + regression suites |

## Test budget

From iteration 8, tests are 12% of total phase 018 effort (~50 M-equivalent of ~418 total). That budget breaks down as:

- Unit tests: ~20 M-equivalent (largest chunk, ~200 tests)
- Integration tests: ~15 M-equivalent (~25 tests, each longer to write)
- Regression tests: ~10 M-equivalent (~13 tests)
- Performance tests: ~3 M-equivalent
- Manual playbooks: ~2 M-equivalent

**Total**: ~50 M-equivalent. Matches iteration 8 estimate.

## CI workflow

```yaml
# On every PR
pr-workflow:
  - unit tests (5 min)
  - lint + type check
  - small integration test subset (3 tests covering common paths)

# Nightly
nightly-workflow:
  - full unit suite
  - full integration suite (25 tests)
  - all 13 regression tests
  - performance benchmarks
  - manual playbook reminders

# Pre-release
release-workflow:
  - all of the above
  - manual playbook execution by operator
  - dashboard review (archived_hit_rate, latencies)
```

## Findings

- **F19.1**: ~250 total tests across 4 classes (unit, integration, regression, performance) plus 10 manual playbooks. Matches the ~50 M-eq budget from iteration 8.
- **F19.2**: Unit tests are the largest chunk (200+ tests) but also the cheapest to write per test. They're the primary safety net.
- **F19.3**: Regression tests per advanced feature lock in the "preserve 13 features" constraint programmatically. If a regression test fails, phase 018 can't merge.
- **F19.4**: Performance tests catch latency regressions before users feel them. The 4x resume improvement from iteration 13 should become a regression test target.
- **F19.5**: Manual playbooks are informational but critical for UX validation. Automated tests can't catch "this feels bad to use" — humans can.

## Next focus

Iteration 20 — final rollout plan, risk register, go/no-go criteria. Close the loop.
