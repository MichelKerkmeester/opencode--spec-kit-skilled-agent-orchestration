---
title: "Iteration 036 — Archive permanence decision: statistical thresholds and trend detection"
iteration: 36
band: F
timestamp: 2026-04-11T13:12:55Z
worker: cli-codex gpt-5.4 xhigh fast
scope: q8_archive_permanence_thresholds
status: complete
focus: "Turn the 180-day archive permanence decision from prose guidance into a statistical rulebook: EWMA trend detection, variance bounds, seasonality handling, escalation ladder, human-review gates, rollback-from-decision."
maps_to_questions: [Q8]
---
# Iteration 036 - Archive permanence decision: thresholds and trend detection

## 1. Goal
Iteration 016, iteration 020, and `findings/migration-strategy.md` define the Day-180 table:
- `<0.5%` stable for 30+ days -> retire
- `0.5%-2%` stable -> keep thin layer
- `>2%` -> investigate
What was missing is a statistical definition of "stable."
If the rule is vague, the archive can be retired too early after a quiet week, or kept too long because of isolated spikes.
The decision is effectively irreversible in operations terms, so the rulebook must be conservative, auditable, and backed by a human sign-off gate.

## 2. Metric definition
Use `archived_hit_rate` as a **presented-slot share**, not a query share.
For retrieval event `e`:
- `presented_slots(e) = min(10, number_of_results_shown_to_user)`
- `archived_slots(e) = count(result where is_archived=1 AND rank <= 10)`
For day `d`:
```text
archived_hit_rate_d =
  sum(archived_slots(e) for events on day d) /
  sum(presented_slots(e) for events on day d)
```
This preserves the original metric from iteration 016 and iteration 027:
- numerator: count(results where `is_archived=1` AND `rank <= K_PRESENTED`)
- denominator: count(results where `rank <= K_PRESENTED`)
- `K_PRESENTED = 10`
- base aggregation: 1-day buckets
Why slot share: it measures real ranking occupancy, avoids overstating rank-10 archive appearances, and avoids session-length bias.
Recommended grain:
- **Primary decision grain**: daily global slot share across all retrieval calls
- **Mandatory breakout grain**: daily by query intent and by spec-folder family
- **Advisory grain only**: per-user and per-session
Do not drive the retirement decision from per-session or per-user rates.
Eligibility for a decision-quality day:
- `presented_slots_d >= 1000` and `unique_queries_d >= 100`
- no telemetry outage that affects ranking logs and not flagged as anomaly day
Days below the floor stay on the chart but do **not** count toward the 30-day permanence streak.

## 3. Smoothing algorithm
Three reasonable choices exist:
| Method | Strength | Weakness | Decision |
|---|---|---|---|
| 30-day simple moving average | easy to explain | lags inflection points | reject as primary |
| **EWMA, alpha=0.1** | responsive and stable | slightly less intuitive | **recommend** |
| 30-day median | robust to spikes | weak trend signal | audit metric only |
Recommended primary smoother:
```text
EWMA_d = alpha * adjusted_rate_d + (1 - alpha) * EWMA_(d-1)
alpha = 0.1
```
Initialization:
- if 7 eligible days exist, `EWMA_0 = mean(adjusted_rate_1 ... adjusted_rate_7)`
- otherwise use the first eligible day
Why `alpha = 0.1`: effective memory is about 10 days, half-life is about 6.6 days, and the signal reacts within 1-2 weeks without overreacting to one-day noise.
Worked example:
| Day | Adjusted daily rate | EWMA |
|---:|---:|---:|
| 1 | 0.0070 | 0.00700 |
| 2 | 0.0060 | 0.00690 |
| 3 | 0.0050 | 0.00671 |
| 4 | 0.0040 | 0.00644 |
| 5 | 0.0040 | 0.00620 |
| 6 | 0.0030 | 0.00588 |
| 7 | 0.0030 | 0.00559 |
| 8 | 0.0020 | 0.00523 |
| 9 | 0.0020 | 0.00491 |
Interpretation:
- the raw rate drops below the `0.5%` boundary on day 3
- the EWMA crosses below `0.5%` only on day 9
That lag is desirable. It blocks retirement based on a short dip.
Keep the 30-day SMA and 30-day median as supporting diagnostics on the dashboard, not as the primary decision rule.

## 4. Variance bounds for "stable"
For the **retire** path, define stability as all of the following holding for **30 consecutive eligible days**:
```text
1. EWMA_d < 0.005 for each eligible day in the streak
2. rolling_stddev_30(adjusted_rate) <= 0.002
3. max(raw_rate) over the same 30-day streak < 0.010
4. slope_14 <= 0.0001 per day
5. no telemetry gap > 3 consecutive days
```
Definitions:
```text
slope_14 = (EWMA_d - EWMA_(d-14)) / 14
```
Why `stddev <= 0.002`: at `p = 0.005`, binomial noise is about `0.00223` for `n = 1000` and `0.00158` for `n = 2000`, so `0.002` filters low-volume noise without demanding impossible precision.
Why `max(raw_rate) < 0.010`: a 1.0% raw day is 2x the retirement boundary, which is too large to ignore for an irreversible decision.
Why `slope_14 <= 0.0001`: the retire path should be flat or improving; the EWMA may rise a little, but not enough to mask a re-inflating archive.
Stable bands:
```text
stable_retire_band = [0.0000, 0.0050)
stable_keep_band = [0.0050, 0.0200)
```
For the keep-thin-layer class, use looser variance guards:
```text
rolling_stddev_30(adjusted_rate) <= 0.004
max(raw_rate) < 0.030
abs(slope_14) <= 0.00025
```
That band carries real long-tail demand, so it should not escalate on normal low-level variation.

## 5. Seasonality handling
Archive usage will not be flat: weekly research cycles, release-week doc sweeps, holiday dips, and occasional month-end cleanup bursts all matter.
Default automatic correction: weekly seasonality only.
Use an 8-week trailing day-of-week index:
```text
dow_index[w] =
  median(raw_rate on weekday w over trailing 56 eligible days) /
  median(raw_rate over trailing 56 eligible days)
```
Guardrails:
- require at least 6 observations for each weekday and clamp each weekday factor to `[0.8, 1.2]`
- only apply the correction if `max(dow_index) - min(dow_index) >= 0.2`
Adjusted rate:
```text
adjusted_rate_d = raw_rate_d / dow_index[weekday(d)]
```
Holiday and outage rule:
- mark a day as anomaly day if `presented_slots_d < 0.5 * median(presented_slots over prior 28 eligible days)`
- also mark as anomaly day for incidents, telemetry gaps, or manual holiday flags
Anomaly days stay on the chart, do not count toward the 30-day streak, and must appear in the evidence package.
Monthly seasonality should be **diagnostic only**, not automatic:
- the 180-day window yields too few monthly cycles for a reliable automated month-of-cycle correction
- if month-end clustering is suspected, surface it in escalation evidence instead of silently adjusting it away
In short: weekly seasonality -> automatic correction; monthly seasonality -> human-reviewed diagnostic.

## 6. Decision ladder
Inputs are seasonality-adjusted unless marked `raw`.
```text
eligible_day =
  presented_slots_d >= 1000
  AND unique_queries_d >= 100
  AND not anomaly_day

retire_candidate_day =
  EWMA_d < 0.005
  AND rolling_stddev_30(adjusted_rate) <= 0.002
  AND max_raw_rate_30 < 0.010
  AND slope_14 <= 0.0001

keep_candidate_day =
  EWMA_d >= 0.005
  AND EWMA_d < 0.020
  AND rolling_stddev_30(adjusted_rate) <= 0.004
  AND max_raw_rate_30 < 0.030
  AND abs(slope_14) <= 0.00025

investigate_candidate =
  EWMA_d >= 0.020
  OR slope_14 > 0.00025 for 7 consecutive eligible days
  OR any intent slice has EWMA_d >= 0.030 for 14 eligible days
```
Outcome ladder:
```text
IF retire_candidate_day holds for 30 consecutive eligible days:
  -> RETIRE_CANDIDATE
  -> REQUIRE human review and snapshot verification
  -> then execute Option F in phase 021

ELIF keep_candidate_day holds for 30 consecutive eligible days:
  -> KEEP thin layer permanently

ELIF investigate_candidate:
  -> INVESTIGATE routing rules
  -> do NOT retire

ELSE:
  -> ESCALATE to human review with evidence package
```
Human-review gates before any actual retirement:
- no unresolved telemetry gaps
- no intent slice still meaningfully dependent on archive results
- top archive-only queries are explained
- cold snapshot exists and restore rehearsal has run at least once
Important nuance: the machine may classify `RETIRE_CANDIDATE`; the human decides whether the irreversible step actually runs.

## 7. Escalation evidence package
When the result is `ESCALATE` or `RETIRE_CANDIDATE`, the engineer should receive:
1. **90-day trend chart**: raw daily `archived_hit_rate`, EWMA line, +/- 1 standard deviation band, threshold lines at `0.5%` and `2.0%`, and anomaly-day shading.
2. **Query class breakdown**: by intent, by spec-folder family, by user cohort if relevant, with sample size, EWMA, and 14-day slope for each slice.
3. **Top 20 archive-only queries**: query text or normalized fingerprint, appearance count, best archived rank, and whether any fresh-doc result outranked it.
4. **Fresh-doc search comparison**: the current fresh-doc search results for each archive-only query plus a short routing/coverage/ranking note.
5. **Cost estimate**: keep cost = live index size + latency overhead + maintenance burden; retire cost = snapshot storage + restore rehearsal + re-index effort if rollback is needed.
Definition of archive-only query:
```text
archived result appears in top 10
AND no fresh spec_doc or continuity result outranks the best archived result
AND archive presence is not just a tie-breaker at rank 10
```
Escalate even if the global EWMA looks quiet when:
- the 30-day window straddles both retire and keep bands
- more than 20% of streak days are ineligible
- one intent slice remains above `3.0%`
- the trend reverses direction twice inside the same candidate window

## 8. Rollback-from-decision
Retirement should be **logical first, physical much later**.
Day-180 retirement should mean:
1. remove archived rows from the live retrieval path
2. stop live ranking/index participation
3. freeze a snapshot for rollback
4. keep the source markdown and row manifest intact during a bake period
This stays consistent with iteration 016's low-risk M4 design: Day 0 never deleted the legacy material, which is why rollback was cheap.
Recommended recovery posture for the first 30 post-decision days:
- keep a SQLite snapshot of archived rows plus a manifest of `row_id`, `source_path`, checksum, and embedding/index version
- keep original markdown files in cold storage if they still exist, and do not run hard-delete jobs on archived data
If retirement proves wrong within 30 days:
1. restore the archived snapshot into a recovery table or recovery database
2. re-enable archived retrieval in candidate generation
3. rebuild FTS/vector entries for the archived subset if required
4. restore the `0.3x` weight
5. run a fresh 14-day observation period before attempting retirement again
Cost principle:
- re-indexing ~155 archived rows is low and bounded
- data loss cost is open-ended and unacceptable
Therefore the system may retire **search participation**, but should not hard-delete archived source data on the first retirement decision.

## 9. Observability during the window
Primary dashboard panel: **Archive Hit Rate**
- daily raw `archived_hit_rate`, 30-day EWMA line, +/- 1 rolling standard deviation band
- threshold lines at `0.5%` and `2.0%`, plus a 14-day slope indicator
- markers for eligible vs ineligible days
Supporting panels:
1. **Volume**
   - presented slots/day, unique queries/day, anomaly-day markers
2. **Breakdown**
   - archive hit rate by intent, by spec-folder family, and archive-only query count/day
3. **Decision readiness**
   - current streak length, current class, and current blocker
Alerts when thresholds are crossed:
- **Retire-watch**: EWMA below `0.5%` for 14 consecutive eligible days
- **Retire-ready**: full 30-day retire rule satisfied
- **Keep-band**: EWMA in `0.5%-2.0%` for 14 eligible days
- **Investigate**: EWMA above `2.0%`, or slope above `0.00025/day` for 7 eligible days, or intent slice above `3.0%` for 14 eligible days
The alert should announce threshold direction explicitly: crossed down into retire-watch, crossed up into investigate, or re-entered ambiguous state.

## 10. Ruled Out
Rejected simpler rules:
1. **Retire automatically at Day 180**
   - rejected because it ignores actual usage
2. **Use raw daily percentage with no smoothing**
   - rejected because spikes and holiday dips would dominate the decision
3. **Use only a 30-day simple moving average**
   - rejected because it reacts too slowly to an upward trend
4. **Use only the 30-day median**
   - rejected because it hides direction and magnitude
5. **Decide per session or per user**
   - rejected because the archive is a system-level fallback, not a personal feature
6. **Hard-delete rows immediately after retirement**
   - rejected because snapshot retirement captures almost all the value with far less risk

## Final rule
Turn "stable for 30+ days" into this operational contract:
- measure archive usage as **daily presented-slot share**
- smooth with **EWMA(alpha=0.1)**
- require **sample floors**, **variance bounds**, and **spike guards**
- correct **weekly** seasonality automatically
- treat **monthly** seasonality as diagnostic only
- classify by the ladder above
- execute Option F only after **human sign-off plus snapshot readiness**
That is conservative enough for an irreversible archive retirement decision and concrete enough to automate.
