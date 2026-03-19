# NEW-144 — Advisory Ingest Lifecycle Forecast Evidence

## Preconditions
- MCP server healthy (v1.7.2)
- Sandbox spec folder `test-sandbox-lifecycle` with seed files
- Ingest forecast module active in job-queue.ts

## Execution Transcript

### Step 1: memory_ingest_start
```
memory_ingest_start({
  paths: [".../seed-file-3.md" through ".../seed-file-8.md"],
  specFolder: "test-sandbox-lifecycle"
})
```
**Response:** `job_MNJbBi2fCtIZ`, state: `queued`, filesTotal: 6

### Step 2: memory_ingest_status (immediate poll)
```
memory_ingest_status({ jobId: "job_MNJbBi2fCtIZ" })
```
**Response:**
```json
{
  "state": "complete",
  "filesProcessed": 6,
  "progress": 100,
  "forecast": {
    "etaSeconds": 0,
    "etaConfidence": 1,
    "failureRisk": 0,
    "riskSignals": [],
    "caveat": null
  }
}
```
- Forecast object is present in complete state
- All 5 forecast fields present: `etaSeconds`, `etaConfidence`, `failureRisk`, `riskSignals`, `caveat`

### Step 3: Additional forecast evidence from other tests
Job `job_tAiRK3Z4d1AU` (complete):
```json
"forecast": { "etaSeconds": 0, "etaConfidence": 1, "failureRisk": 0, "riskSignals": [], "caveat": null }
```
Job `job_20Y7ofqZVQQr` (complete, 18 files):
```json
"forecast": { "etaSeconds": 0, "etaConfidence": 1, "failureRisk": 0, "riskSignals": [], "caveat": null }
```
- Forecast consistently present across all observed status responses

### Step 4: Code analysis — Sparse and progressing state handling
Source: `mcp_server/lib/ops/job-queue.ts` (lines 470-552)

**Terminal states:**
- `failed`: `failureRisk: 1`, `riskSignals: ['terminal_failed']`
- `complete`: `failureRisk: clampUnitInterval(errorRatio * 0.5)`, signals include `completed_with_file_errors` if applicable
- `cancelled`: `failureRisk: 0`, `riskSignals: ['terminal_cancelled']`, `caveat: 'Forecast is advisory only because the job is no longer progressing.'`

**Sparse/early states:**
- Queued with no baseline (line 504-508):
  ```
  etaSeconds: null, etaConfidence: null, failureRisk: null
  caveat: 'Forecast unavailable because the queue has no file-count baseline yet.'
  ```
- Early processing (line 530):
  ```
  caveat: 'Forecast is low-confidence until at least one file has been processed.'
  ```
- Low confidence (line 536-537):
  ```
  caveat: 'Forecast is low-confidence because queue history is still sparse or noisy.'
  ```
- No throughput (line 540):
  ```
  caveat: 'Forecast unavailable because throughput could not be derived from queue history.'
  ```

**Risk signals catalog:**
- `file_errors_seen` — active job has file errors
- `queued_not_started` — job is queued but hasn't begun
- `active_without_progress` — job is active but no progress
- `high_error_ratio` — error ratio exceeds threshold

**Telemetry integration (handler line 96):**
```typescript
retrievalTelemetry.recordLifecycleForecastDiagnostics(telemetry, forecast, { ... })
```
- Telemetry is additive — attached to response without changing status contract

**Handler error safety (handler lines 79-89):**
```typescript
try {
  forecast = getIngestForecast(job);
} catch {
  forecast = { etaSeconds: null, etaConfidence: null, failureRisk: null, riskSignals: [], caveat: 'Forecast unavailable: ...' };
}
```
- Forecast computation is wrapped in try/catch — never breaks handler

## Expected Signals Checklist
- [x] Status payloads always include a `forecast` object (MCP evidence + code try/catch fallback)
- [x] Sparse progress yields null or low-confidence fields plus caveat text (code analysis: 4 distinct caveat messages)
- [x] Progressing jobs update ETA/risk fields without breaking handler contract (code: `clampUnitInterval`, try/catch)
- [x] Optional telemetry remains additive (code: `recordLifecycleForecastDiagnostics` is separate from response)

## Observations
- Forecast is a first-class contract field — never omitted even in error states
- 4 distinct caveat messages handle various sparse/early scenarios
- `clampUnitInterval()` ensures values stay in [0,1] range
- Risk signals are additive and descriptive (not error codes)
- Handler try/catch ensures forecast computation failure never crashes the status endpoint

## Verdict: **PASS**
All acceptance checks satisfied. Forecast fields are always present (MCP observation confirms), code analysis confirms sparse-state safe degradation with descriptive caveats, telemetry is additive, and handler is protected by try/catch.
