---
title: "Iteration 034 — Feature-flag state machine and rollback transitions"
iteration: 34
band: F
timestamp: 2026-04-11T13:20:35Z
worker: cli-codex gpt-5.4 xhigh fast
scope: q8_q9_feature_flag_state_machine
status: complete
focus: "Define the exact feature-flag state machine for dual-write cutover: states, transitions, trigger conditions, automatic rollback rules, flag storage/caching, and incident playbook."
maps_to_questions: [Q8, Q9]
---

# Iteration 034 — Feature-flag state machine and rollback transitions

## 1. Goal
Phase 019 already has rollout gates, pacing, shadow-compare rules, and alert thresholds. What it still lacks is the explicit control-plane contract that turns "shadow-only -> dual-write -> canonical" into an auditable state machine. This iteration defines the states, promotion conditions, rollback paths, cache semantics, override rules, and operator playbook so Gate C can advance without hidden assumptions.

Grounding posture:
- iteration 020 provides the gate sequence
- iteration 028 provides pacing and observation windows
- iteration 030 provides the migration posture: writer first, reader second, flip last
- iteration 032 provides class-specific parity thresholds and auto-disable logic
- iteration 033 provides alert thresholds, shadow spans, and rollback-sensitive telemetry

## 2. States

### Canonical state graph
```text
S0 disabled
  -> S1 shadow_only
  -> S2 dual_write_10pct
  -> S3 dual_write_50pct
  -> S4 dual_write_100pct
  -> S5 canonical
  -> S6 legacy_cleanup

Rollback control edge:
Sn -> S7 rolled_back -> fallback target

Default fallback target:
S1 -> S0
S2 -> S1
S3 -> S2
S4 -> S3
S5 -> S4
S6 -> S5

Correctness-loss exception from iter 032:
S2/S3/S4/S5 may snap directly to S1
for resume or trigger_match correctness failures.
```

### State definitions
| State | Name | Exact meaning |
|---|---|---|
| `S0` | `disabled` | New path exists but is off. Legacy is fully authoritative. Only synthetic probes may touch the new path. |
| `S1` | `shadow_only` | New path mirrors real input, writes only to compare logs and telemetry, and never changes canonical docs. Legacy serves the real outcome. |
| `S2` | `dual_write_10pct` | Ten percent of eligible traffic executes both paths. Legacy still serves the user-visible result. |
| `S3` | `dual_write_50pct` | Fifty percent of eligible traffic executes both paths. This is the first realistic concurrency and lock-contention state. |
| `S4` | `dual_write_100pct` | All eligible traffic executes both paths. Legacy still serves, but the proving window is now full-production shaped. |
| `S5` | `canonical` | New path becomes the default. Legacy remains available only as verification and rollback substrate. |
| `S6` | `legacy_cleanup` | Legacy serving path is disabled. Archived memory remains readable, but legacy write routing is no longer live. |
| `S7` | `rolled_back` | Transient safety latch. It freezes forward promotion, records the incident, then resolves to a named fallback target. |

### State invariants
- `S0-S1` are pre-cutover states.
- `S2-S4` are proving states.
- `S5` is the default-serving state.
- `S6` is permanence territory and belongs after gate-F approval.
- `S7` is never a steady serving state.

## 3. Transition table
For rows whose trigger is `automatic`, `approval_required` means who must approve re-entry or the equivalent manual replay. The automatic move into `S7` does not wait for human approval.

| from_state | to_state | trigger | gate_condition | approval_required | cooldown | rollback_path |
|---|---|---|---|---|---|---|
| `S0` | `S1` | manual | Gate B complete, reducer live, dashboards live, rollback drill proven on a copy, synthetic probes healthy | paired | none | `S0` |
| `S1` | `S2` | combined | Golden set exists, regression scenarios green, `classifier_refusal_rate <= 2%`, no fingerprint rollback, 24h clean shadow baseline | paired | `>=24h` in `S1` | `S1 -> S7 -> S0` |
| `S2` | `S3` | combined | 24h live traffic, iter-032 class thresholds healthy, minimum sample counts reached, zero auto-disable events, no active warning breach | paired | `>=24h` in `S2` | `S2 -> S7 -> S1` |
| `S3` | `S4` | combined | 72h live traffic, flagged classes healthy in every `30m` window, latency delta within `+10%`, weekly golden set passes, no unresolved incident | paired | `>=72h` in `S3` | `S3 -> S7 -> S2` |
| `S4` | `S5` | combined | D0 observation complete, no severe breach in trailing 7 days, manual playbooks pass, all 13 regressions green, gate-D metrics healthy | paired | `>=7d` in `S4` | `S4 -> S7 -> S3` |
| `S5` | `S6` | manual | Gate E closed, gate-F permanence decision approved, 30d stable canonical operation, background shadow healthy, no class on rollback watchlist | incident commander | `>=30d` in `S5` | `S6 -> S7 -> S5` |
| `S1` | `S7` | automatic or manual | Shadow-only run breaks compare-log or validator contract before any traffic bucket opens | solo | immediate | default `S0` |
| `S2` | `S7` | automatic or manual | Any iter-032 severe breach, iter-033 critical alert, or operator-declared incident during 10% canary | solo | immediate | default `S1` |
| `S3` | `S7` | automatic or manual | Same as `S2`, now under 50% traffic and production-like contention | solo | immediate | default `S2`, exception `S1` |
| `S4` | `S7` | automatic or manual | Same as `S3`, plus any gate-D blocker during 100% dual-write | incident commander | immediate | default `S3`, exception `S1` |
| `S5` | `S7` | automatic or manual | Any correctness-loss incident after default flip, any post-flip fingerprint rollback, or failed operator playbook | incident commander | immediate | default `S4`, exception `S1` |
| `S6` | `S7` | manual | Cleanup reveals hidden dependency, audit hold, or a failed permanence review | incident commander | immediate | `S5` |

### Transition rules
- No skipped buckets.
- Any rollback resets the timer for the current bucket.
- Correctness-loss rollback is stricter than performance rollback.
- `S7` must always emit an audit event before resolution.

## 4. Automatic rollback rules
These are the rules that may demote the state machine without waiting for human approval.

| active_state | metric | threshold | window | rollback_to_state | human_required | notification path |
|---|---|---|---|---|---|---|
| `S1` | `validator.rollback.fingerprint rate` | any non-zero event in canary or staging | `1h rolling` | `S0` | no | page on-call, incident Slack, append `feature_flag_events` |
| `S2-S4` | `search.shadow.diff divergence rate` | `>3%` mismatches or any correctness-loss mismatch | `1h rolling` | default `Sn-1` | no | page on-call, incident Slack, divergence log |
| `S2-S4` | `resume weighted_overlap@3` plus guard | `<0.95` for 2 consecutive `5m` windows or `rank1_exact_match < 0.95` with `>=25` samples | `10m effective` | `S1` | no | page on-call, resume panel, rollback event |
| `S2-S4` | `trigger_match exact_target_match` | any target miss with `>=20` samples | `30m rolling` | `S1` | no | page on-call, trigger alert, rollback event |
| `S2-S4` | `causal_graph kendall_tau@5` or guard | `tau < 0.85` or `primary_path_exact_match < 0.90` for 2 consecutive windows | `2 x 15m` | default `Sn-1` | no | page on-call, causal dashboard, rollback event |
| `S2-S4` | `search:fix_bug weighted_overlap@5` | `<0.92` for 3 consecutive severe windows | `3 x 10m` | default `Sn-1` | no | page on-call, intent-scoped incident, rollback event |
| `S2-S4` | `save.path.total p95` | `>5000ms` once or `>2x` 7-run baseline on 2 runs | `5m rolling plus benchmark` | default `Sn-1` | no | page on-call, save latency panel, rollback event |
| `S2-S4` | `save.lock.wait p99` | `>500ms` for 2 consecutive windows | `2 x 15m` | default `Sn-1` | no | page on-call, mutex panel, rollback event |
| `S5` | `resume.path.total p95` | `>1000ms` once or `>2x` 7-run baseline on 2 runs | `5m rolling plus benchmark` | `S4` | no | page on-call, canonical incident, rollback event |
| `S5` | `validator.rollback.fingerprint rate` | any non-zero event after default flip | immediate | `S4`, exception `S1` if failure is global | no | page on-call, incident Slack, rollback event |
| `S5` | `search.shadow.diff divergence rate` | `>3%` mismatches or any correctness-loss mismatch | `1h rolling` | `S4` | no | page on-call, shadow panel, rollback event |
| `S5` | `archived_hit_rate` plus fast-path miss | `archived_hit_rate > 10%` at week-4 review or fast-path miss `>15%` daily with visible regressions | `24h + review checkpoint` | `S4` | yes | incident commander review, dashboard note, audit event |

### Cross-class rollback rule
If two or more noncritical classes hit a severe breach in the same `30m` window:
- enter `S7`
- demote one bucket by default
- freeze promotion for at least 24 hours
- escalate to `S1` only if one class is `resume` or `trigger_match`

### Freeze-only rules
These block promotion but do not auto-roll back:
- `classifier_refusal_rate > 2%` and `<10%`
- warning-only latency breaches that recover within 24 hours
- sample volume below iter-032 minimums
- `archived_hit_rate > 10%` before the canonical default flip

### `S6` exception
`S6` has no safe blind automatic rollback because cleanup may retire code, not just flip a flag. Re-entry to `S5` is manual.

## 5. Flag storage and read-path caching

### Storage model
Use a dedicated control-plane table in the same SQLite family as the rest of runtime state:
```text
feature_flags
  flag_key TEXT PRIMARY KEY
  state TEXT NOT NULL
  bucket_percent INTEGER NOT NULL
  version INTEGER NOT NULL
  cooldown_until TEXT NULL
  override_mode TEXT NOT NULL
  changed_by TEXT NOT NULL
  changed_reason TEXT NOT NULL
  changed_at TEXT NOT NULL
  incident_id TEXT NULL

feature_flag_events
  id INTEGER PRIMARY KEY
  flag_key TEXT NOT NULL
  from_state TEXT NOT NULL
  to_state TEXT NOT NULL
  resolved_state TEXT NULL
  transition_kind TEXT NOT NULL
  trigger_metric TEXT NULL
  trigger_window TEXT NULL
  trigger_value TEXT NULL
  approved_by TEXT NULL
  reason TEXT NOT NULL
  created_at TEXT NOT NULL
```

### Why this storage wins
- shared truth across concurrent local processes
- atomic transition plus audit event in one transaction
- easy incident queryability
- not tied to deploy-time env vars
- restart-safe without a second control service

### Why not env vars or a config file
- env vars are too static for canary promotion and emergency rollback
- config files are weaker on atomicity, auditability, and multi-process visibility
- rollout state is runtime truth, not build truth

### Read-path caching semantics
- key: `canonical_continuity_rollout`
- cache scope: per process
- TTL: `1000ms`
- cached fields: `state`, `bucket_percent`, `version`, `cooldown_until`, `override_mode`
- local writes invalidate immediately
- remote writes become visible within one TTL
- after any rollback event, bypass cache for the next 60 seconds

This is intentionally simpler than a watcher. One SQLite read per second per process is cheap and keeps rollback propagation fast.

### Write semantics
Only these actors may flip the flag:
- rollout controller code for automatic move into `S7`
- on-call engineer for rollback to a safer state
- paired approvers for forward promotion through `S5`
- incident commander for `S5 -> S6`, `S6 -> S5`, or any warning-gate override

Every write must:
1. update `feature_flags`
2. insert a `feature_flag_events` row
3. record `changed_by`, `reason`, and ticket or incident reference
4. clear the local cache
5. emit a dashboard and incident-log event

## 6. Incident response playbook
When an automatic rollback fires, phase 019 should follow the same path every time.

1. **Page on-call**: trigger the primary page and attach an incident ID.
2. **Read rollback event log**: confirm `from_state`, `resolved_state`, trigger metric, window, and observed value in `feature_flag_events`.
3. **Check current state**: read `feature_flags.state`, `bucket_percent`, `cooldown_until`, and `override_mode`, then confirm all serving processes converge within one cache TTL.
4. **Validate data integrity**: inspect in-flight saves, non-zero fingerprint rollback, external-edit retries, shadow mismatches, and any save that completed between trigger detection and rollback commit.
5. **Root-cause investigation**: pull worst examples from `search.shadow.diff`, latency spans, or trigger logs and classify the incident as correctness, performance, data-shape drift, or observability failure.
6. **Plan the next attempt**: name owner, fix, proof required, and earliest retry time from `cooldown_until`; do not re-run promotion until the note says which gate evidence is being re-proven.

## 7. Cool-down and blackout windows

### Minimum hold times
| state | minimum hold time before forward transition | reason |
|---|---:|---|
| `S0` | none | administrative starting state |
| `S1` | `24h` | establish shadow-only baseline and trustworthy dashboards |
| `S2` | `24h` | satisfy iter-032 minimum live sample sizes |
| `S3` | `72h` | expose realistic concurrency, lock, and latency behavior |
| `S4` | `7d` | final proving window before default flip |
| `S5` | `30d` before `S6` | permanence decision and background drift observation |

### Post-rollback freezes
| rollback cause | minimum freeze before any new promotion attempt |
|---|---:|
| performance-only severe alert | `24h` |
| parity breach without correctness loss | `24h` |
| correctness-loss breach (`resume`, `trigger_match`, fingerprint mismatch) | `72h` |
| post-flip rollback from `S5` | `7d` |
| telemetry outage or missing dashboard panel | until telemetry is restored and one clean window completes |

### Blackout windows
No forward transition may happen during:
- schema migration rehearsal or production migration
- archive flip, reindex, or rollback drill
- dashboard outage longer than 30 minutes
- shadow reducer disabled or sampled data below required minimums
- open P0/P1 incident on save, resume, trigger, or shadow compare
- manual playbook execution for a pending canonical flip

Rollback to a safer state remains allowed during a blackout. Promotion does not.

## 8. Manual override path
Manual override exists for controlled exceptions, not for bypassing correctness failures.

### Allowed overrides
| override | allowed when | approval |
|---|---|---|
| force rollback to a safer state | automation did not move fast enough | solo on-call |
| replay a blocked promotion after a warning-only breach | warning is understood, owner named, expiry set | paired |
| force `S5 -> S4` or `S6 -> S5` during cleanup surprise | production rollback is needed immediately | incident commander |
| bypass a warning gate for a time-boxed retry | only warning thresholds are active; no correctness-loss metric is live | incident commander |

### Disallowed overrides
- no override may bypass a non-zero post-flip fingerprint rollback
- no override may bypass a `trigger_match` miss
- no override may bypass a `resume` correctness-loss breach
- no override may jump from `S1` to `S3` or from `S4` to `S6`

### Audit log requirements
Every override must record:
- previous state and requested state
- approver name and role
- incident or ticket ID
- exact expiry time
- plain-language reason
- whether serving behavior changes or only promotion gating changes

Expired overrides automatically clear and restore normal gating.

## 9. Integration with Gate C, D, and E criteria
| rollout gate | required state outcome | exact close criteria |
|---|---|---|
| `Gate C - Writer ready` | `S4` reached and stable | `S4` has held for at least `72h`; unit coverage `>80%`; integration tests green; `search.shadow.diff divergence rate <= 1%` with no severe class breach; `save.path.total p95 <= 2000ms`; `validator.rollback.fingerprint rate = 0`; reducer and dashboard panels live |
| `Gate D - Reader ready` | `S5` entered and survives D0 | `S5` holds through the `14d` D0 observation window; resume p95 `<500ms`; search p95 `<300ms`; fast-path miss `<=15%`; all 13 regressions green; `archived_hit_rate <15%`; no unresolved rollback incident |
| `Gate E - Runtime complete` | `S5` remains default and healthy | `S5` remains stable through the phase-019 monitoring window; manual playbooks pass; `archived_hit_rate <5%` at week-4 review; no critical alert is open; rollback remains available but unused; commands, agents, and docs align to canonical behavior |

Interpretation:
- Gate C is the proof that `S2-S4` were boring enough to trust.
- Gate D is the first gate that assumes `S5` is real.
- Gate E is not a new state; it is the sustained-health proof for `S5`.
- `S6` belongs to gate F and the permanence decision.

## 10. Ruled Out
| rejected design | why rejected | replacement |
|---|---|---|
| per-user rollout flags | too much cardinality and too many partial states | one global rollout flag with traffic buckets |
| per-spec-folder rollout flags | migration risk is in shared runtime behavior, not individual packets | one runtime-wide state machine |
| env-var-only state | too static for canary promotion and emergency rollback | SQLite-backed control-plane row |
| config-file source of truth | weak audit log and weak multi-process visibility | `feature_flags` plus `feature_flag_events` |
| direct `shadow_only -> canonical` jump | skips the evidence-building buckets required by iter 032 | `10% -> 50% -> 100% -> canonical` |
| permanent per-query dynamic routing during cutover | makes rollback ambiguous and operator reasoning harder | one global serving state, class-specific metrics only drive rollback |
| no explicit `S7` latch | hides rollback as an auditable control-plane event | transient `rolled_back` state with explicit resolution |

## Findings
- **F34.1**: The real serving states are `S0-S6`; `S7` exists to make rollback explicit, auditable, and cooldown-aware.
- **F34.2**: Default rollback is one bucket, but correctness-loss incidents for `resume` and `trigger_match` must jump straight to `S1`.
- **F34.3**: A dedicated SQLite flag row plus a 1-second per-process cache is the simplest control plane that still supports fast rollback and clean auditability.
- **F34.4**: Gate C closes at stable `S4`, gate D proves `S5` over D0, and gate E proves that `S5` stays healthy long enough to trust the default flip.
- **F34.5**: `S6` should stay manual-only because once cleanup starts, rollback may require code restoration instead of a pure flag flip.
