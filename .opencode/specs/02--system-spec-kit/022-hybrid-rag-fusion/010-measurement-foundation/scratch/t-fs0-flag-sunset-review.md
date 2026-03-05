# T-FS0: Feature Flag Sunset Review

**Sprint**: 001 — Sprint 0 Measurement Foundation
**Spec**: 02--system-spec-kit / 140-hybrid-rag-fusion-refinement
**Date**: 2026-02-27
**Auditor**: T-FS0 automated review (T008 sprint exit)

---

## 1. Governance Reminder

- **Cap**: ≤ 6 simultaneous **active experiment** flags
- **Lifespan**: 90-day max from introduction to binary decision
- **Extension**: one-time 14-day (INCONCLUSIVE state only)
- **Infrastructure flags**: exempt from the 6-flag cap (no sunset required)
- **ADOPTED flags**: behavior hardcoded, no longer experimental → do not count against cap

---

## 2. Flag Inventory with Sunset Recommendations

### 2a. Infrastructure Flags (Exempt — No Sunset Required)

These flags are operational plumbing. They do not control experiment behavior.
They are **never counted** against the 6-flag active experiment cap.

| Flag | Default | State | Recommendation |
|------|---------|-------|----------------|
| `SPECKIT_DB_PATH` | (unset) | Infrastructure | **KEEP** — required DB path override; no sunset |
| `SPECKIT_SKIP_API_VALIDATION` | false | Infrastructure | **KEEP** — CI/testing safety valve; no sunset |
| `SPECKIT_EAGER_WARMUP` | false | Infrastructure | **KEEP** — restores deprecated behavior for rollback; no sunset |
| `SPECKIT_DEBUG` | false | Infrastructure | **KEEP** — debug logging; no sunset |
| `SPECKIT_DEBUG_INDEX_SCAN` | false | Infrastructure | **KEEP** — verbose index scan logging; no sunset |
| `SPECKIT_LAZY_LOADING` | (unset) | Infrastructure (test only) | **KEEP** — test fixture flag; no production exposure |
| `SPECKIT_ROLLOUT_PERCENT` | 100 | Infrastructure | **KEEP** — global rollout gate; no sunset (it is the sunset mechanism) |
| `SPECKIT_LEVEL` | (marker) | Infrastructure | **NOT A FLAG** — HTML comment marker in memory files, not an env var |
| `SPECKIT_INDEX_SPEC_DOCS` | true | Infrastructure | **KEEP** — feature toggle for spec doc indexing; adopted |

### 2b. Active Feature Flags (Count Toward 6-Flag Cap)

| Flag | Default | State | Age | Metric Evidence | Recommendation |
|------|---------|-------|-----|-----------------|----------------|
| `SPECKIT_ADAPTIVE_FUSION` | true | **ADOPTED** | Sprint 138 | Positive — intent-aware weighted RRF is core to pipeline | **ENABLE PERMANENTLY**: Remove flag, hardcode `true`. Does NOT count against cap (ADOPTED). |
| `SPECKIT_MMR` | true | **MEASURING** | Sprint 138 | Pending T008+ eval pipeline | **KEEP MEASURING** — counts as active experiment flag (1/6) |
| `SPECKIT_TRM` | true | **MEASURING** | Sprint 138 | Pending R13 eval pipeline | **KEEP MEASURING** — counts as active experiment flag (2/6) |
| `SPECKIT_MULTI_QUERY` | true | **MEASURING** | Sprint 138 | Pending R13 eval pipeline | **KEEP MEASURING** — counts as active experiment flag (3/6) |
| `SPECKIT_CROSS_ENCODER` | true | **MEASURING** | Sprint 139 | Pending R13 eval pipeline | **KEEP MEASURING** — counts as active experiment flag (4/6) |
| `SPECKIT_GRAPH_UNIFIED` | true | **MEASURING** | Sprint 140 | T001 graph hit rate >0% confirmed | **KEEP MEASURING** — counts as active experiment flag (5/6) |
| `SPECKIT_RRF` | true | **ADOPTED** | Sprint 139 | Positive — core fusion infrastructure | **ENABLE PERMANENTLY**: Remove flag, hardcode `true`. Does NOT count against cap (ADOPTED). |

### 2c. Cognitive / Session Flags (Rollout-Gated)

These flags are gated via `SPECKIT_ROLLOUT_PERCENT`. They behave as a group under
the rollout umbrella and are counted separately from the main 6-flag cap.

| Flag | Default | State | Metric Evidence | Recommendation |
|------|---------|-------|-----------------|----------------|
| `SPECKIT_SESSION_BOOST` | true | MEASURING | Pending R13 pipeline | **KEEP MEASURING** |
| `SPECKIT_CAUSAL_BOOST` | true | MEASURING | Pending R13 pipeline | **KEEP MEASURING** |
| `SPECKIT_EVENT_DECAY` | true | MEASURING | Pending R13 pipeline | **KEEP MEASURING** |
| `SPECKIT_AUTO_RESUME` | true | MEASURING | Pending R13 pipeline | **KEEP MEASURING** |
| `SPECKIT_PRESSURE_POLICY` | true | MEASURING | Pending R13 pipeline | **KEEP MEASURING** |
| `SPECKIT_EXTRACTION` | true | MEASURING | Pending R13 pipeline | **KEEP MEASURING** |
| `SPECKIT_RELATIONS` | true | MEASURING | CHK-069 causal graph in use | **KEEP MEASURING** |
| `SPECKIT_WORKING_MEMORY` | true | **ADOPTED** | Positive — session feature fully operational | **ENABLE PERMANENTLY**: Remove flag. |
| `SPECKIT_ARCHIVAL` | true | MEASURING | Pending R13 pipeline | **KEEP MEASURING** |
| `SPECKIT_COACTIVATION` | true | MEASURING | Positive signal (co-activation used in trigger matching) | **KEEP MEASURING** |

### 2d. Telemetry Flags

| Flag | Default | State | Metric Evidence | Recommendation |
|------|---------|-------|-----------------|----------------|
| `SPECKIT_EXTENDED_TELEMETRY` | true | MEASURING | 4-dimension retrieval metrics active | **KEEP MEASURING** — data required for R13 |
| `SPECKIT_EVAL_LOGGING` | false | **INTRODUCED** (T005) | None yet — newly introduced in Sprint 0 | **EXTEND**: Enable in CI/staging to begin accumulating eval data. Reassess at Sprint 1 exit gate. |

### 2e. Cognitive Config Flags (Structured — Not Boolean Experiments)

| Flag | Type | Recommendation |
|------|------|----------------|
| `SPECKIT_COGNITIVE_COACTIVATION_PATTERN` | Regex string | **KEEP** — configuration, not experiment flag |
| `SPECKIT_COGNITIVE_COACTIVATION_FLAGS` | Regex flags | **KEEP** — configuration, not experiment flag |

---

## 3. Active Experiment Flag Count Verification

### Flags Counted Against the 6-Flag Cap

Only flags in **MEASURING** state under the "Active Feature Flags" section (2b) count:

| # | Flag | State | Counts? |
|---|------|-------|---------|
| 1 | `SPECKIT_MMR` | MEASURING | YES |
| 2 | `SPECKIT_TRM` | MEASURING | YES |
| 3 | `SPECKIT_MULTI_QUERY` | MEASURING | YES |
| 4 | `SPECKIT_CROSS_ENCODER` | MEASURING | YES |
| 5 | `SPECKIT_GRAPH_UNIFIED` | MEASURING | YES |
| — | `SPECKIT_ADAPTIVE_FUSION` | ADOPTED | NO (adopted) |
| — | `SPECKIT_RRF` | ADOPTED | NO (adopted) |

**Active experiment flag count: 5 / 6 maximum.**

Status: **WITHIN CAP** (one slot remaining for a new experiment if needed in Sprint 1).

---

## 4. SPECKIT_EVAL_LOGGING — Special Status (T005)

`SPECKIT_EVAL_LOGGING` was newly introduced in T005 (Sprint 0, this sprint).

| Attribute | Value |
|-----------|-------|
| Default | `false` (disabled by default) |
| State | INTRODUCED |
| Age | 0 days (introduced 2026-02-27) |
| 90-day deadline | 2026-05-27 |
| Metric evidence | None yet (data accumulation pending) |
| Counts against 6-flag cap? | No — telemetry flag, not a search experiment flag |

**Recommendation**: Enable `SPECKIT_EVAL_LOGGING=true` in CI and staging environments
beginning Sprint 1 to start accumulating eval run data in `speckit-eval.db`. This is
the prerequisite for the R13 automated eval pipeline. The flag itself remains
INTRODUCED until the first full eval cycle completes.

**Action required by**: 2026-05-27 — binary decision: ADOPT (make logging permanent)
or RETIRE (remove logging infrastructure).

---

## 5. Flags Past Deadline

No flags are currently past their 90-day deadline or extension deadline.

The oldest measuring flags (Sprint 138: `SPECKIT_MMR`, `SPECKIT_TRM`, `SPECKIT_MULTI_QUERY`)
were introduced in Sprint 138 with no date anchor available. If Sprint 138 predates
2025-11-28 (90 days before 2026-02-27), those flags are approaching or past deadline
and require an INCONCLUSIVE evaluation or forced binary decision at the next monthly audit.

**Recommended action**: Confirm Sprint 138 introduction dates and compute exact deadlines
at the February monthly audit (first Monday of March 2026 = 2026-03-02).

---

## 6. Flags Recommended for Promotion This Cycle

| Flag | Promotion | Reason |
|------|-----------|--------|
| `SPECKIT_ADAPTIVE_FUSION` | ADOPT | Core to pipeline; positive signal; no longer experimental |
| `SPECKIT_RRF` | ADOPT | Core fusion infrastructure; permanently needed |
| `SPECKIT_WORKING_MEMORY` | ADOPT | Session feature fully operational; no rollback path needed |

Promoting these three flags to ADOPTED reduces future audit noise and confirms
the architecture decisions made in Sprints 138-139.

---

## 7. Signal Ceiling Check (B8)

Current active scoring signals: **12 / 12 maximum** (at ceiling).

Adding any new scoring signal requires retiring an existing one until R13 automated
eval pipeline is operational. T008 BM25 baseline runner does not add a new signal —
it measures existing BM25/FTS5 signals only.

No action required for T008.
