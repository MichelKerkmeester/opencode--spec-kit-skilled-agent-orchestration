---
title: "Iteration 038 — Routing audit reducer: schema, pattern matching, alert rules"
iteration: 38
band: F
timestamp: 2026-04-11T15:19:22+02:00
worker: cli-codex gpt-5.4 xhigh fast
scope: q1_q7_q9_routing_audit
status: complete
focus: "Define the routing audit JSONL schema, reducer pseudocode for detecting misroutes, automated alerting rules, log retention, and feedback loop into Tier 2 prototype refresh."
maps_to_questions: [Q1, Q7, Q9]
---

# Iteration 038 — Routing Audit Reducer

## 1. Goal
Iteration 026 defined the routing audit log, but not the mechanism that turns logs into action. Without a reducer, a wrong route can silently pollute `implementation-summary.md`, `handover.md`, `tasks.md`, or `research/research.md` until a human notices later. The reducer exists to surface those failures within minutes, score how strong the evidence is, and turn confirmed corrections into Tier 2 training examples rather than one-off cleanup.

Operationally, the loop is:
1. `contentRouter` emits one audit row for every final classification.
2. A reducer joins that row with follow-up routes, anchor edits, and confirmed-correct fingerprint history.
3. The reducer emits `suspect_misroute` or `confirmed_misroute`.
4. Alerts fire on rate spikes and calibration drift.
5. Confirmed fixes feed the Tier 2 prototype refresh process.

## 2. JSONL audit entry schema
Every final decision emits one `CR001` row after category normalization:
- normalize internal Tier 3 `drop_candidate` to final audit category `drop`
- keep refusal as `merge_mode = "refuse-to-route"`, not as a ninth category
- when `tier_used = 3`, reserve `alternatives[0]` for Tier 2 top-1 so the reducer can test "Tier 2 was right"
- cap `alternatives` at 2 entries

```json
{
  "ts": "ISO-8601",
  "component": "content-router",
  "code": "CR001",
  "chunk_id": "short-hash",
  "chunk_text_preview": "<first 120 chars>",
  "chunk_hash": "sha256(normalized)",
  "tier_used": 1,
  "category": "narrative_progress",
  "confidence": 0.87,
  "target_doc": "implementation-summary.md",
  "target_anchor": "what-built",
  "merge_mode": "append-as-paragraph",
  "alternatives": [{ "cat": "narrative_delivery", "conf": 0.62 }],
  "decision_latency_ms": 42,
  "spec_folder": "...",
  "session_id": "..."
}
```

| Field | Purpose | Reducer use | Storage note |
|---|---|---|---|
| `ts` | routing event time | windows, correction timing, alert bucketing | one timestamp |
| `component` | stable emitter family | isolate router metrics | constant string |
| `code` | stable event code | separate `CR001` decision rows from health events like `CR002` | constant string |
| `chunk_id` | operator-friendly handle | UI and triage | short string |
| `chunk_text_preview` | minimal human context | fast review without loading full chunk | hard-cap 120 chars, redact first |
| `chunk_hash` | normalized chunk identity | dedupe, reroute joins, fingerprint history | fixed digest |
| `tier_used` | winning tier | Tier 1/2/3 mix, Tier 3 health | integer enum |
| `category` | normalized winning class | confusion pairs, rate metrics | one of 8 |
| `confidence` | certainty at decision time | warn/crit thresholds, calibration | float |
| `target_doc` | chosen destination doc | hotspot and post-merge joins | bounded doc family |
| `target_anchor` | chosen destination anchor | contamination and correction joins | bounded anchor family |
| `merge_mode` | write intent | route vs refusal, append vs update | small enum |
| `alternatives` | losing candidates | Tier 2 vs Tier 3 disagreement, prototype mining | max 2 |
| `decision_latency_ms` | routing latency only | latency regressions by tier | integer |
| `spec_folder` | packet partition | ownership, retention, packet-level alerts | relative slug |
| `session_id` | opaque save session | same-session reroute detection | never a user id |

Excluded on purpose: raw chunk text, user IDs, query text, provider error strings, embeddings, and whole-doc fingerprints.

## 3. Storage & retention
Canonical storage should be packet-local JSONL:
- path: `<spec-folder>/scratch/routing-audit-YYYY-MM-DD.jsonl`
- write mode: append-only, one JSON object per line, flush on classification
- rotation: daily; only split earlier if a file exceeds 128 MB
- mirror: optional structured-log mirror is fine, but reducer reads the file as source-of-truth

Packet-local `scratch/` is preferred because ownership stays local, replay does not depend on external telemetry infra, and unrelated spec folders avoid a shared file lock.

Reducer cadence:
- nearline pass every 5 minutes over trailing 65 minutes for alerts
- hourly pass for durable packet summaries
- nightly compactor for compression and long-window trend output

## 4. Misroute detection patterns
The reducer should score evidence, not guess from low confidence alone.

### 4.1 Post-hoc human fix
- if the same `chunk_hash` in the same `session_id` is reclassified to a different target within 15 minutes, the earlier route is `confirmed_misroute`
- if the original anchor is edited within 30 minutes, the chunk disappears there, and it appears elsewhere, the earlier route is `confirmed_misroute`
- if the chunk disappears after an anchor edit but no new destination is found, mark `suspect_removed_after_fix`

### 4.2 Tier 2 vs Tier 3 disagreement
- if `tier_used = 3`, treat `alternatives[0]` as recorded Tier 2 top-1
- if a later confirmed correction lands on that candidate, record `tier2_was_right = true`
- repeated confirmed corrections for the same Tier 3-over-Tier 2 confusion pair become prototype-refresh candidates

### 4.3 Confidence-accuracy correlation
- bucket routed rows into `0.50-0.69`, `0.70-0.89`, `0.90-1.00`
- compute confirmed-misroute rate per bucket
- any confirmed failure in the `0.90+` band is tagged `high_confidence_failure`
- if the user reroutes a `0.90+` route in the same session, count it as both a misroute and a calibration miss

### 4.4 Cross-anchor contamination
- maintain a reducer-side fingerprint library keyed by `(category, target_doc, target_anchor)`
- populate it from previously confirmed-correct routes plus confirmed corrections
- if a new route sends a `chunk_hash` to anchor X but that hash already belongs to anchor Y's confirmed set, mark `suspect_cross_anchor`
- if one confusion pair repeats at least 3 times in 7 days, escalate it into the weekly prototype review batch

### 4.5 Evidence weights
| Signal | Weight | Outcome |
|---|---:|---|
| same-session reroute to different target in 15m | 1.00 | confirmed |
| removed from original anchor and reappears elsewhere in 30m | 1.00 | confirmed |
| removed after human edit, no destination found | 0.70 | suspect |
| Tier 2 top-1 later becomes confirmed-correct | 0.60 | suspect unless paired with correction |
| chunk hash already belongs to another anchor's confirmed set | 0.50 | suspect |
| confidence `>= 0.90` and later corrected | +0.20 | severity boost |

Scoring:
- `>= 1.00` => `confirmed_misroute`
- `0.50-0.99` => `suspect_misroute`
- `< 0.50` => audit-only unless repeated 3 times in 7 days

## 5. Reducer pseudocode
```text
CONSTANTS:
  QUICK_WINDOW_MIN = 65
  HUMAN_REROUTE_WINDOW_MIN = 15
  HUMAN_FIX_WINDOW_MIN = 30
  HOURLY_WARN_RATE = 0.01
  DAILY_CRIT_RATE = 0.03
  HIGH_CONFIDENCE = 0.90

function runRoutingAuditReducer(mode, now):
  windowStart = resolveWindow(mode, now)
  auditRows = loadAuditRows(windowStart, now)
  if auditRows.empty:
    emitEmptySummary(mode, now)
    return

  rows = normalizeRows(auditRows)
  rows = rows.filter(row => row.code == "CR001")
  followups = indexBySessionAndChunkHash(rows)
  fingerprints = loadConfirmedFingerprintLibrary()
  anchorState = loadCurrentAnchorState(uniqueTargets(rows))
  docEdits = loadDocMutationSignals(uniqueDocs(rows), windowStart, now)
  tier3Health = loadRoutingHealthSignals(windowStart, now)  // CR002 or telemetry

  findings = []
  metrics = initMetrics()

  for row in rows:
    if row.merge_mode == "refuse-to-route":
      continue

    evidence = []
    reroute = findReroute(followups, row, HUMAN_REROUTE_WINDOW_MIN)
    if reroute exists:
      evidence.push(signal("same_session_reroute", 1.00, reroute.target_doc, reroute.target_anchor))

    state = anchorState[row.spec_folder, row.target_doc, row.target_anchor]
    stillPresent = anchorContainsChunkHash(state, row.chunk_hash)
    editWindow = findDocEdits(docEdits, row.spec_folder, row.target_doc, row.ts, HUMAN_FIX_WINDOW_MIN)

    if editWindow not empty and not stillPresent:
      movedTarget = findConfirmedDestination(rows, row.chunk_hash, row.ts, HUMAN_FIX_WINDOW_MIN)
      if movedTarget exists:
        evidence.push(signal("removed_and_moved", 1.00, movedTarget.doc, movedTarget.anchor))
      else:
        evidence.push(signal("removed_after_edit", 0.70, null, null))

    if row.tier_used == 3 and row.alternatives.length >= 1:
      tier2Alt = normalizeCategory(row.alternatives[0].cat)
      if reroute exists and tier2Alt == classifyTarget(reroute.target_doc, reroute.target_anchor):
        evidence.push(signal("tier2_was_right", 0.60, reroute.target_doc, reroute.target_anchor))

    owner = fingerprintOwner(fingerprints, row.chunk_hash)
    if owner exists and owner != (row.category, row.target_doc, row.target_anchor):
      evidence.push(signal("cross_anchor_fingerprint", 0.50, owner.doc, owner.anchor))

    score = sumWeights(evidence)
    status = "audit_only"
    severity = "info"
    if score >= 1.00:
      status = "confirmed_misroute"
      severity = "warn"
    else if score >= 0.50:
      status = "suspect_misroute"
      severity = "warn"

    if row.confidence >= HIGH_CONFIDENCE and status != "audit_only":
      severity = "crit_candidate"
      evidence.push(signal("high_confidence_failure", 0.20, null, null))

    finding = makeFinding(row, status, severity, evidence)
    findings.push(finding)
    metrics = updateMetrics(metrics, row, finding)

  summary = summarizeFindings(findings, metrics, tier3Health)
  alerts = evaluateAlertRules(summary, mode)

  writeJson(summaryPath(mode, now), summary)
  appendJsonl(misrouteReportPath(now), findings.filter(f => f.status != "audit_only"))

  for finding in findings.filter(f => f.status == "confirmed_misroute"):
    corrected = finding.corrected_target or bestEvidenceTarget(finding)
    upsertConfirmedFingerprint(fingerprints, corrected, finding.chunk_hash)

  emitMetrics(summary, alerts)
  emitAlerts(alerts)

  if mode == "nightly":
    compactRawLogs(olderThanDays = 7)
    pruneRawLogs(olderThanDays = 30)
    pruneSummaries(olderThanDays = 365)
    snapshotTopConfusionPairs(summary)
```

Reducer outputs: hourly summary JSON, misroute report JSONL, rolling confirmed-fingerprint library, and weekly prototype-review candidate list.

## 6. Alert rules
Iteration 033 already defined the operational policy: critical alerts block gate closure immediately; warnings become blocking after 24 hours without an owner. Routing audit alerts should inherit that exact interpretation.

| Alert | Window | Threshold | Tie-back |
|---|---|---|---|
| Misroute rate warn | 1h rolling | `>1%` of routed chunks for 2 consecutive runs | same as iteration 033 shadow-divergence warn band |
| Misroute rate crit | 24h rolling | `>3%` confirmed misroutes | same as iteration 033 shadow-divergence crit band |
| Tier 3 unavailability warn | 30m rolling | `>10%` of Tier 3 attempts unavailable or fallback-only | same as iteration 033 provider-fallback warn |
| Confidence distribution drift warn | 24h vs trailing 7d baseline | absolute mean confidence shift `>0.08` | catches behavior drift before visible anchor damage |
| High-confidence hotspot warn | 24h rolling | `>=2` confirmed `0.90+` failures in one packet | rare and safety-relevant by design |

Notes: denominator is routed chunks only; warn uses `confirmed + suspect`; crit uses `confirmed` only; packet-level crit MAY page early above `5%`; Tier 3 unavailability comes from routing-health telemetry, not `CR001` alone.

## 7. Feedback loop into Tier 2 prototypes
Confirmed misroutes become structured Tier 2 learning examples.

Flow:
1. reducer tags the event `misroute_fixed`
2. weekly review surfaces top 10 `misroute_fixed` chunks by repeated confusion pair and confidence severity
3. human reviewer confirms the corrected target
4. approved examples update `mcp_server/lib/routing/routing-prototypes.json`
5. prototype library version increments
6. routing prototype embedding cache is invalidated and regenerated

Cadence and ownership:
- weekly by default during active rollout
- ad hoc if one confusion pair appears `>=3` times in 7 days or causes a critical alert
- owner: continuity-routing maintainer
- reviewer: packet owner or designated research maintainer

A/B gate before promotion:
1. rerun the last 14 days of ambiguous chunks with current library
2. add candidate prototype and rerun same holdout set
3. require `>=5pp` improvement on the targeted confusion pair
4. require `<=1pp` regression overall
5. require no increase in Tier 3 escalation rate

## 8. Log retention policy
Retention should separate replay from long-lived training data:
- raw JSONL audit files: 30 days
- hourly and nightly summaries: 1 year
- confirmed misroutes and confirmed-correct fingerprint library: indefinite
- compressed raw archives after day 7: optional, but still deleted at day 30

PII handling:
1. redact `chunk_text_preview` before write
2. store `[REDACTED]` if preview becomes empty
3. keep `session_id` opaque and non-user-identifying
4. keep indefinite records to `chunk_hash`, confusion pair, corrected target, and redacted preview only
5. do not retain full chunk text indefinitely

## 9. Dashboard panels
Routing quality needs its own dashboard surface.

| Panel | Primary metric | Required breakdown |
|---|---|---|
| Misroute rate | 24h rolling confirmed and suspect rate | global plus `spec_folder` |
| Tier usage breakdown | routed chunk share by Tier 1, 2, and 3 | by `category` and `spec_folder` |
| Confidence distribution | histogram and 7-day band trend | by `tier_used` |
| Confirmed misroute count | absolute count and top confusion pairs | by `spec_folder` and `target_anchor` |
| Prototype library size and last refresh | library version, example count, last refresh timestamp | global |

Supporting panels should also include high-confidence failures by packet, Tier 3 unavailability rate, top confusion pairs over 7 days, and routing latency p50/p95 by tier.

## 10. Ruled Out
| Rejected strategy | Why rejected | Replacement |
|---|---|---|
| full post-merge diff analysis on every save | too noisy; unrelated anchor edits look like misroutes | hash-based reroute plus fix windows |
| user feedback only | sparse and delayed | automated reducer with human correction as strongest signal |
| blocking every low-confidence route | over-refusal hurts saves | warn-band routing plus audit follow-up |
| storing full chunk text indefinitely | duplicates canonical content and raises privacy risk | 120-char redacted preview plus `chunk_hash` |
| manual review queue for every Tier 3 decision | too expensive; many Tier 3 calls are correct | weekly review of confirmed `misroute_fixed` only |
| embedding every whole-doc diff | expensive and hard to interpret on naturally evolving docs | confirmed fingerprint library keyed by chunk hash |

This contract keeps routing auditable, calibrated, and self-improving: the router is not just allowed to be wrong; it is required to leave enough evidence that wrong routes become measurable and learnable.
