# Iteration 010 — Dimension(s): D3

## Scope this iteration
This iteration followed the default rotation to D3 performance and observability. The review targeted the Phase 025 fixes for static-vs-live telemetry separation, prompt-finalization in the live-session wrapper, and analyzer-side prompt aggregation/baseline handling using fresh code and test evidence.

## Evidence read
- `.opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts:79-89` -> measurement options now separate `liveStream` from explicit `telemetryOutputPath`, so the static harness does not have to share the live-session sink.
- `.opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts:104-108` -> static compliance output defaults to `.opencode/reports/smart-router-static/compliance.jsonl`, distinct from the live telemetry path.
- `.opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts:629-640` -> `runMeasurement()` writes telemetry to the static path unless `liveStream` is explicitly enabled.
- `.opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts:653-655` -> the summary caveat still states this harness only measures predicted routes, not live AI read behavior.
- `.opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts:712-715` -> the report caveats explicitly mark static compliance JSONL as intentionally `unknown_unparsed` and reserve causal claims for live-session telemetry.
- `.opencode/skill/system-spec-kit/mcp_server/tests/smart-router-measurement.vitest.ts:149-166` -> regression coverage asserts static measurement records land in the separated default stream under `.opencode/reports/smart-router-static/compliance.jsonl`.
- `.opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts:102-116` -> wrapper initialization starts one tracked prompt session and seeds prompt-level telemetry state.
- `.opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts:156-184` -> `onToolCall()` normalizes `Read` paths into `{ observedSkill, resource }` pairs and records them against the active prompt id.
- `.opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts:190-197` -> `finalizePrompt()` flushes one prompt-scoped telemetry record and removes the prompt from in-memory state.
- `.opencode/skill/system-spec-kit/scripts/observability/smart-router-telemetry.ts:213-242` -> compliance classification now considers aggregated `observedSkills`, preserving cross-skill detection even when the selected skill name matches some reads.
- `.opencode/skill/system-spec-kit/scripts/observability/smart-router-telemetry.ts:269-300` -> prompt observations are merged by `promptId` and finalized into a single JSONL record.
- `.opencode/skill/system-spec-kit/mcp_server/tests/smart-router-telemetry.vitest.ts:204-259` -> tests verify multi-read prompt aggregation, `observedSkill` persistence, and cross-skill reads classifying as `extra`.
- `.opencode/skill/system-spec-kit/scripts/observability/smart-router-analyze.ts:119-160` -> analyzer collapse logic groups records by `promptId`, preserves `observedSkills`, and treats baseline-only `SKILL.md` reads as compliant only when they stay on the selected skill.
- `.opencode/skill/system-spec-kit/scripts/observability/smart-router-analyze.ts:173-205` -> analysis metrics are computed from the collapsed prompt-level view rather than raw per-read rows.
- `.opencode/skill/system-spec-kit/mcp_server/tests/smart-router-analyze.vitest.ts:75-104` -> tests confirm promptId collapse and the baseline `SKILL.md` special case both behave as intended.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
None.

### P2 (Suggestion)
None.

### Re-verified (no new severity)
- **DR-P1-003 remains closed for static-vs-live telemetry separation.** The measurement harness writes to a dedicated static sink by default and continues to label its results as non-live methodology output, preventing accidental mixing with live-session compliance conclusions (`.opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts:104-108`, `.opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts:629-640`, `.opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts:712-715`, `.opencode/skill/system-spec-kit/mcp_server/tests/smart-router-measurement.vitest.ts:149-166`).
- **DR-P1-003 remains closed for live-session prompt finalization and observed-skill tracking.** The wrapper records normalized `{ observedSkill, resource }` reads per prompt, and finalization emits one aggregated telemetry record whose tests still cover both multi-read same-skill flows and cross-skill violations (`.opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts:156-197`, `.opencode/skill/system-spec-kit/scripts/observability/smart-router-telemetry.ts:213-242`, `.opencode/skill/system-spec-kit/scripts/observability/smart-router-telemetry.ts:269-300`, `.opencode/skill/system-spec-kit/mcp_server/tests/smart-router-telemetry.vitest.ts:204-259`).
- **DR-P1-003 remains closed for analyzer prompt aggregation and baseline SKILL.md handling.** The analyzer collapses rows by `promptId`, retains observed-skill context, and only treats `SKILL.md`-only reads as compliant when they do not cross skill boundaries; regression tests still enforce both behaviors (`.opencode/skill/system-spec-kit/scripts/observability/smart-router-analyze.ts:119-160`, `.opencode/skill/system-spec-kit/scripts/observability/smart-router-analyze.ts:173-205`, `.opencode/skill/system-spec-kit/mcp_server/tests/smart-router-analyze.vitest.ts:75-104`).

## Metrics
- newInfoRatio: 0.05
- cumulative_p0: 0
- cumulative_p1: 1
- cumulative_p2: 1
- dimensions_advanced: [D3]
- stuck_counter: 0

## Next iteration focus
Rotate to D4 and re-check the Phase 025 maintainability fixes around cache bounds, deprecated normalizer aliases, and broader sk-code-opencode alignment.
