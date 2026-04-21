# Deep Review Strategy: Phase 027 skill-graph-daemon-and-advisor-unification

## Mission

40-iter autonomous deep review of the full Phase 027 delivery (000 validator ESM + 001-006 feature children) with cli-copilot gpt-5.4 high agents.

## Review Target

**Spec folder:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/`

**7 children shipped end-to-end:**

| Child | SHA | Summary |
|---|---|---|
| 000 validator-esm-fix | `77b0f59e2` | Migrated scripts/ from CJS/ESM hybrid to pure ESM for Node 25 compat |
| 001 daemon-freshness-foundation | `32fd9197c` | Chokidar watcher + SQLite single-writer lease + fail-open freshness (CPU 0.031% / RSS 5.516MB) |
| 002 lifecycle-and-derived-metadata | `8318dfaf8` | Schema v1↔v2 additive migration + A7 sanitizer + derived.key_files + z_archive/z_future |
| 003 native-advisor-core (HARD GATE) | `1146faeec` + `e35f93b52` | 5-lane fusion + Py↔TS parity (80.5% / 77.5% / UNKNOWN 10 / 0 regressions) |
| 004 mcp-advisor-surface | `08bd30145` | advisor_recommend + advisor_status + advisor_validate MCP tools |
| 006 promotion-gates | `5696acf4a` | Shadow-cycle + seven-gate bundle |
| 005 compat-migration-and-bootstrap | `a61547796` | Python shim + plugin bridge + install guide + H5 playbook + Gate 7 fix (52/52 P0 pass) |

## Review Dimensions

All 4 canonical dimensions — reviewed in risk order per iteration:

1. **correctness** — does the implementation satisfy spec §4.1 + §4.1.a + §5 acceptance scenarios for each child
2. **security** — A7 sanitizer coverage at every write boundary; privacy contracts in MCP handlers; no prompt leakage; instruction-shaped fixture rejection
3. **traceability** — spec ↔ code alignment; checklist [x] items have file:line evidence; ADR-007 decision captured; cross-references intact
4. **maintainability** — package boundaries clean (skill-advisor/ self-contained); imports follow conventions; tests colocated; no regression in existing 65-test baseline

## Focus Areas (10 threads)

1. **Native scorer correctness** vs spec §11 deterministic gates (80.5% full / 77.5% holdout / UNKNOWN 10 / gold-none / explicit-skill / ambiguity / attribution / adversarial)
2. **Daemon lifecycle + Track H hardening** — reindex-storm back-pressure, malformed SKILL.md quarantine, partial-write resilience, SQLITE_BUSY backoff
3. **A7 sanitizer coverage** — SQLite writes, graph-metadata.json.derived, envelope publication, diagnostic emit; reject instruction-shaped adversarial fixtures
4. **Schema v1↔v2 migration safety** — additive backfill, rollback symmetry, v1 routable during transition, no data loss
5. **MCP handler privacy contracts + Zod strictness** — no prompt leakage, no PII, workspace-scoped cache keys, invalid inputs rejected
6. **Shadow-cycle guarantees + weight-delta cap** — no-live-mutation, max Δw 0.05, two-cycle requirement, semantic lock at 0.00
7. **Python shim compat + plugin bridge regression preservation** — `--stdin` (025), SIGKILL (026), workspace cache key (026), disable flag
8. **Regression-protection parity semantics** (ADR-007) — 120/120 Python-correct preserved, 0 regressions, 41 improvements
9. **Adversarial/gold-none/supersession edge cases** — stuffing rejection, gold-none stable, redirect_from/redirect_to surfaces
10. **HARD GATE review content** — 5-lane fusion math, ambiguity top-2-within-0.05, derived-dominant attribution

## Executor Contract

- **Executor:** cli-copilot gpt-5.4 high (per `deep-review-config.json.executor`)
- **Concurrency:** max 3 concurrent copilot agents (per memory feedback — upstream API throttles above 3/account)
- **Per-iter delta files** to avoid shared-write races
- **State writer:** `reduce-state.cjs` after each iteration

## Per-Iteration Output Contract

Each iteration MUST produce:
1. `iterations/iteration-{NNN}.md` — narrative with Dimension, Files Reviewed, Findings by Severity (P0/P1/P2), Traceability Checks, Verdict, Next Dimension
2. Appended record to `deep-review-state.jsonl` with `type: "iteration"` + required schema
3. `deltas/iter-{NNN}.jsonl` — structured event stream (iteration record + per-finding + classification + ruled_out)

## Convergence

- Threshold: `newFindingsRatio` rolling average ≤ 0.10
- Stuck threshold: 2 (halt if 2 consecutive iters with same P0/P1 count)
- P0 override: new P0 findings block convergence regardless of threshold
- Coverage gate: all 4 dimensions must be reviewed ≥ 1x before STOP_ALLOWED

## Known Context

Phase 027 is COMPLETE as of 2026-04-20. All 7 children shipped. This review is post-implementation quality audit for release readiness.

Prior reviews:
- r02 deep-review of phases 020-024 (pre-027) in `025-deep-review-remediation/`
- r03 post-remediation review in `026-r03-post-remediation/`

This is r04 — the first post-027-ship review.

## Output

- `iterations/iteration-001.md` through `iteration-040.md`
- `deltas/iter-001.jsonl` through `iter-040.jsonl`
- `deep-review-state.jsonl` (append-only, reduced by reduce-state.cjs)
- `deep-review-findings-registry.json` (auto-generated)
- `deep-review-dashboard.md` (auto-generated)
- `review-report.md` — final synthesis with P0/P1/P2 summary + PASS/CONDITIONAL/FAIL verdict + remediation plan
