# Iteration 027 — Dimension(s): D6

## Scope this iteration
Reviewed D6 Test coverage + test-code quality because iteration 27 rotates to D6. This pass avoided the already-recorded plugin/parity/subprocess gaps and instead spot-checked the smart-router telemetry and analyzer suites for fresh, still-untested filesystem and env-override branches.

## Evidence read
- .opencode/skill/system-spec-kit/scripts/observability/smart-router-telemetry.ts:123-135 → telemetry output path resolution gives priority to `SPECKIT_SMART_ROUTER_TELEMETRY_PATH`, then falls back to `SPECKIT_SMART_ROUTER_TELEMETRY_DIR`, then the repo-default compliance JSONL path.
- .opencode/skill/system-spec-kit/mcp_server/tests/smart-router-telemetry.vitest.ts:12-15 → the telemetry suite only defines and snapshots `SPECKIT_SMART_ROUTER_TELEMETRY_DIR`.
- .opencode/skill/system-spec-kit/mcp_server/tests/smart-router-telemetry.vitest.ts:109-173 → the recording tests exercise JSONL writes, idempotent directory creation, and newline sanitization, but every case writes through the directory override path.
- .opencode/skill/system-spec-kit/scripts/observability/smart-router-analyze.ts:278-283 → the analyzer writer computes the output path, creates parent directories, and persists the markdown report.
- .opencode/skill/system-spec-kit/mcp_server/tests/smart-router-analyze.vitest.ts:7-13 → the analyzer suite imports `analyzeTelemetryFile`, `analyzeTelemetryRecords`, `formatTelemetryAnalysisReport`, and `readTelemetryJsonl`, but not `writeTelemetryAnalysisReport`.
- .opencode/skill/system-spec-kit/mcp_server/tests/smart-router-analyze.vitest.ts:44-116 → analyzer tests cover aggregation, no-data handling, parse-error counting, and markdown formatting only.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
None.

### P2 (Suggestion)
id P2-027-01, dimension D6, the smart-router telemetry suite does not exercise the higher-priority explicit file override path. Evidence: `.opencode/skill/system-spec-kit/scripts/observability/smart-router-telemetry.ts:123-135` gives `SPECKIT_SMART_ROUTER_TELEMETRY_PATH` precedence over the directory override and repo-default path, but the test file only defines the directory env at `.opencode/skill/system-spec-kit/mcp_server/tests/smart-router-telemetry.vitest.ts:12-15` and all write-path cases at `.opencode/skill/system-spec-kit/mcp_server/tests/smart-router-telemetry.vitest.ts:109-173` route through `SPECKIT_SMART_ROUTER_TELEMETRY_DIR`. Impact: a regression in explicit-file routing or env-precedence could silently redirect compliance JSONL output for operators using the path override while the focused telemetry suite still passes. Remediation: add a temp-file test that sets both env vars, asserts the file-path override wins, and verifies the record lands at the exact overridden file.

id P2-027-02, dimension D6, the analyzer suite never covers the report-writing surface that creates directories and persists markdown output. Evidence: `.opencode/skill/system-spec-kit/scripts/observability/smart-router-analyze.ts:278-283` exports `writeTelemetryAnalysisReport()` and owns path resolution plus `mkdirSync`/`writeFileSync`, but `.opencode/skill/system-spec-kit/mcp_server/tests/smart-router-analyze.vitest.ts:7-13` does not import that writer and the covered cases at `.opencode/skill/system-spec-kit/mcp_server/tests/smart-router-analyze.vitest.ts:44-116` stop at in-memory analysis and formatted strings. Impact: regressions in default report-path generation, parent-directory creation, or custom output handling can ship without any analyzer test failing. Remediation: add a filesystem-backed analyzer test that exercises both the default timestamped report path and an explicit output override.

### Re-verified (no new severity)
None.

## Metrics
- newInfoRatio: 0.05
- cumulative_p0: 0
- cumulative_p1: 15
- cumulative_p2: 15
- dimensions_advanced: [D6]
- stuck_counter: 0

## Next iteration focus
Advance D7 by re-checking whether the shipped hook-reference and skill-advisor docs still match the current runtime/test surface after these late-cycle D6 coverage findings.
