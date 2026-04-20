# Iteration 003 — Dimension(s): D3

## Scope this iteration
Reviewed D3 Performance + Observability because the default rotation for iteration 3 selects D3. I focused on advisor cache behavior, hook metric/diagnostic records, smart-router telemetry JSONL flow, static measurement output, analyzer interpretation, and live-session wrapper behavior.

## Evidence read
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts:8 → exact prompt cache TTL is 5 minutes.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts:60 → exact prompt cache stores entries in an in-memory `Map`.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts:72 → expired prompt-cache entries are evicted only when the same key is read.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts:84 → prompt-cache `set` inserts entries without a max-entry bound or expired-entry sweep.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/source-cache.ts:19 → source cache has a 15-minute TTL.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/source-cache.ts:20 → source cache is capped at 16 entries.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/source-cache.ts:36 → source cache evicts overflow by oldest access time.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/metrics.ts:78 → advisor hook metrics use the `speckit_advisor_hook_*` namespace.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/metrics.ts:111 → diagnostic serialization explicitly forbids prompt-bearing fields.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/metrics.ts:249 → serializer rejects records outside the prompt-free closed schema.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/metrics.ts:258 → health section aggregates rolling cache-hit rate, cache-hit p95, and fail-open rate.
- .opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:139 → Codex hook emits serialized advisor diagnostics through `writeDiagnostic`.
- .opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:260 → Codex hook records runtime status, freshness, duration, cache-hit state, and skill label after building the brief.
- .opencode/skill/system-spec-kit/scripts/observability/smart-router-telemetry.ts:123 → smart-router telemetry defaults to `.opencode/skill/.smart-router-telemetry/compliance.jsonl`.
- .opencode/skill/system-spec-kit/scripts/observability/smart-router-telemetry.ts:138 → telemetry appends one JSONL compliance record per call.
- .opencode/skill/system-spec-kit/scripts/observability/smart-router-telemetry.ts:152 → compliance classification treats empty or unknown allowed resources as `unknown_unparsed`.
- .opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts:591 → static measurement runs the advisor across corpus rows.
- .opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts:597 → static measurement records telemetry by default unless disabled.
- .opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts:626 → every measured corpus row emits a smart-router compliance telemetry record when recording is enabled.
- .opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts:631 → static measurement prepends `__unknown_unparsed__` to allowed resources.
- .opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts:707 → the report says static compliance JSONL intentionally classifies as `unknown_unparsed`.
- .opencode/skill/system-spec-kit/scripts/observability/smart-router-analyze.ts:42 → analyzer reads the same default compliance JSONL path.
- .opencode/skill/system-spec-kit/scripts/observability/smart-router-analyze.ts:247 → analyzer includes static-measurement caveats only as interpretation notes after reporting aggregate distributions.
- .opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts:98 → live-session wrapper stores a configured predicted route and allowed resources in memory.
- .opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts:146 → each observed Read call records a compliance record with the active prompt id and predicted route.
- .opencode/skill/system-spec-kit/mcp_server/tests/advisor-observability.vitest.ts:16 → tests lock the advisor metric namespace and closed labels.
- .opencode/skill/system-spec-kit/mcp_server/tests/smart-router-telemetry.vitest.ts:101 → tests confirm empty or sentinel allowed resources classify as `unknown_unparsed`.
- .opencode/skill/system-spec-kit/mcp_server/tests/smart-router-measurement.vitest.ts:129 → tests verify the measurement report caveat but do not cover default telemetry pollution.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
id P1-003-01, dimension D3, static measurement pollutes the live-session telemetry stream by default. Evidence: .opencode/skill/system-spec-kit/scripts/observability/smart-router-telemetry.ts:123 defaults compliance telemetry to `.opencode/skill/.smart-router-telemetry/compliance.jsonl`, while .opencode/skill/system-spec-kit/scripts/observability/smart-router-analyze.ts:42 reads that same path. The static harness enables telemetry by default at .opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts:597, emits a compliance record for every corpus row at .opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts:626, and prepends `__unknown_unparsed__` at .opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts:631, which the classifier turns into `unknown_unparsed` at .opencode/skill/system-spec-kit/scripts/observability/smart-router-telemetry.ts:152. Impact: running the static measurement CLI without `--no-record-telemetry` writes synthetic unknown records into the same file used for live wrapper analysis, so analyzer totals and unknown rates can no longer be trusted as live-session compliance signals. Remediation: make static measurement telemetry opt-in or route it to a separate default file, and add a regression test that the CLI default does not write to the live compliance JSONL path.

### P2 (Suggestion)
id P2-003-01, dimension D3, exact prompt cache has no size bound or insertion-time stale sweep. Evidence: .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts:60 stores entries in a `Map`, .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts:72 only evicts an expired entry when that same key is fetched, and .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts:84 inserts new entries without evicting expired entries or enforcing a maximum size; by contrast, .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/source-cache.ts:20 caps source-cache entries and .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/source-cache.ts:36 evicts overflow. Impact: long-lived hook hosts or test harnesses that see many unique prompts can retain expired prompt-cache entries until a source-signature change or explicit clear, making memory growth harder to reason about. Remediation: mirror the source-cache hygiene pattern by sweeping expired entries on `set` and adding a conservative max-entry cap.

### Re-verified (no new severity)
None.

## Metrics
- newInfoRatio: 0.70 (first D3 pass read fresh cache, metric, telemetry, measurement, analyzer, wrapper, and test evidence and found one required observability issue plus one cache-hygiene suggestion)
- cumulative_p0: 0
- cumulative_p1: 3
- cumulative_p2: 1
- dimensions_advanced: [D3]
- stuck_counter: 0

## Next iteration focus
Advance D4 Maintainability + sk-code-opencode alignment with fresh evidence from the skill-advisor TypeScript modules and the OpenCode coding standards.
