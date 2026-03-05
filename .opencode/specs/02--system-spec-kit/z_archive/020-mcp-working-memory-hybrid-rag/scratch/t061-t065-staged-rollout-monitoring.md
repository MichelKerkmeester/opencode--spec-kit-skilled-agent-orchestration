# T061-T065 Staged Rollout Monitoring Template

Status: AWAITING HUMAN EXECUTION (T061-T065 open/pending, blocked on T055)
Prepared: 2026-02-19

Complete each stage in order. Do NOT skip a stage or shorten monitoring windows.
All gate metrics must PASS before advancing to the next stage.

---

## Prerequisites

[ ] T055 Phase 2 dark launch confirmed stable (scratch/t028-t055-dark-launch-checklist.md)
[ ] Telemetry dashboard can be re-run on demand:
    npx tsx .opencode/skill/system-spec-kit/scripts/evals/run-phase3-telemetry-dashboard.ts
    .opencode/specs/02--system-spec-kit/020-mcp-working-memory-hybrid-rag
[ ] Rollback runbook available:
    .opencode/skill/system-spec-kit/references/workflows/rollback-runbook.md

---

## Reference: Pre-Rollout Telemetry Baseline

From evaluation lane (scratch/phase3-telemetry-dashboard.md, 2026-02-19):

| Metric | Baseline (pre-rollout) |
|--------|----------------------|
| Session boost rate | 40.00% |
| Causal boost rate | 33.40% |
| Pressure activation rate | 64.00% (WARN: above 60% threshold) |
| Extraction count (104 sessions) | 104 inserts |
| Extraction match rate | 26.00% |

---

## STAGE 1: 10% Rollout (T061 + T062)

### Enable (T061)

Operator: _______________  Date/time: _______________

[ ] Set SPECKIT_ROLLOUT_PERCENT=10
[ ] Enable Phase 1 flags for 10% user segment:
      SPECKIT_SESSION_BOOST=true (10%)
      SPECKIT_PRESSURE_POLICY=true (10%)
      SPECKIT_EVENT_DECAY=true (10%)
[ ] Enable Phase 2 flags for 10% user segment:
      SPECKIT_EXTRACTION=true (10%)
      SPECKIT_CAUSAL_BOOST=true (10%)
[ ] Confirm rollout_percent in effect (check runtime env or server log)

### Monitor Window: 24 hours (T062)

Window start: _______________  Window end: _______________

Re-run telemetry dashboard each 8h and record:

  Hour 8 snapshot:
    Session boost rate: _______%  (gate: within +/-15% of 40.00%)
    Causal boost rate: _______%   (gate: within +/-15% of 33.40%)
    Pressure activation: _______%  (gate: < 80%)
    Extraction inserts: _______
    Error rate delta vs baseline: _______%  (gate: <= +5%)
    Context errors: _______%  of baseline  (gate: <= 25%)

  Hour 16 snapshot:
    Session boost rate: _______%
    Causal boost rate: _______%
    Pressure activation: _______%
    Extraction inserts: _______
    Error rate delta: _______%
    Context errors: _______%

  Hour 24 snapshot (24h window close):
    Session boost rate: _______%
    Causal boost rate: _______%
    Pressure activation: _______%
    Extraction inserts: _______
    Error rate delta: _______%
    Context errors: _______%
    Token waste delta vs baseline: _______%  (gate: reduction >= 10%)

### Stage 1 Gate Decision

[ ] All 24h snapshots within gate thresholds
[ ] No P0 errors or crashes logged
[ ] Rollback was NOT required

  DECISION:
  [ ] ADVANCE to Stage 2 (50%)
  [ ] HOLD (extend monitoring window; reason: _____________)
  [ ] ROLLBACK (trigger runbook; reason: _____________)

  Approved by: _______________  Date: _______________

---

## STAGE 2: 50% Rollout (T063 + T064)

### Enable (T063)

Operator: _______________  Date/time: _______________

[ ] Set SPECKIT_ROLLOUT_PERCENT=50
[ ] Confirm Stage 1 gate decision was ADVANCE
[ ] Update server environment and restart

### Monitor Window: 48 hours (T064)

Window start: _______________  Window end: _______________

Record snapshots every 12 hours:

  Hour 12 snapshot:
    Session boost rate: _______%
    Causal boost rate: _______%
    Pressure activation: _______%
    Extraction inserts: _______
    Error rate delta: _______%
    Context errors: _______%

  Hour 24 snapshot:
    Session boost rate: _______%
    Causal boost rate: _______%
    Pressure activation: _______%
    Extraction inserts: _______
    Error rate delta: _______%
    Context errors: _______%
    Token waste delta: _______%

  Hour 36 snapshot:
    Session boost rate: _______%
    Causal boost rate: _______%
    Pressure activation: _______%
    Error rate delta: _______%

  Hour 48 snapshot (48h window close):
    Session boost rate: _______%
    Causal boost rate: _______%
    Pressure activation: _______%
    Extraction inserts: _______
    Error rate delta: _______%
    Context errors: _______%  (gate: <= 25% of baseline)
    Token waste delta: _______%  (gate: >= 15% reduction)
    MRR delta (run phase2-closure-metrics): _______x  (gate: >= 0.95x)

### Stage 2 Gate Decision

[ ] All 48h snapshots within gate thresholds
[ ] MRR delta at 50% >= 0.95x baseline
[ ] No P0 errors or crashes logged
[ ] Rollback was NOT required

  DECISION:
  [ ] ADVANCE to Stage 3 (100%)
  [ ] HOLD (reason: _____________)
  [ ] ROLLBACK (trigger runbook; reason: _____________)

  Approved by: _______________  Date: _______________

---

## STAGE 3: 100% Rollout (T065)

### Enable (T065)

Operator: _______________  Date/time: _______________

[ ] Set SPECKIT_ROLLOUT_PERCENT=100
[ ] Confirm Stage 2 gate decision was ADVANCE
[ ] Update server environment and restart

### Post-100% Confirmation (24h window)

Window start: _______________  Window end: _______________

  Hour 24 final snapshot:
    Session boost rate: _______%
    Causal boost rate: _______%
    Pressure activation: _______%
    Extraction inserts: _______
    Error rate delta: _______%
    Context errors: _______%
    Token waste delta: _______%
    MRR delta: _______x

### Stage 3 Completion

[ ] 24h 100% window snapshot recorded
[ ] All metrics within gate thresholds
[ ] CHK-162 evidence recorded: (paste telemetry snapshot above)
[ ] Proceed to T066 user satisfaction survey

  Confirmed by: _______________  Date: _______________

---

## Rollback Trigger Reference

Trigger rollback immediately if ANY of the following are observed:
  - Error rate increases > 5% vs dark-launch baseline
  - Context errors exceed 25% of pre-boost baseline
  - MRR ratio drops below 0.90x baseline
  - P0-level crash or data integrity issue
  - Pressure activation rate exceeds 85% sustained over 6h

Rollback command (quick reference):
  unset SPECKIT_SESSION_BOOST SPECKIT_PRESSURE_POLICY SPECKIT_EVENT_DECAY
  unset SPECKIT_AUTO_RESUME SPECKIT_EXTRACTION SPECKIT_CAUSAL_BOOST
  (or set all to "false")
  Restart MCP server.
  Full procedure: .opencode/skill/system-spec-kit/references/workflows/rollback-runbook.md

---

## NOTES AND INCIDENTS

(Record any anomalies, interventions, or monitoring observations here)

Stage 1:
  ________________________________________________________________

Stage 2:
  ________________________________________________________________

Stage 3:
  ________________________________________________________________
