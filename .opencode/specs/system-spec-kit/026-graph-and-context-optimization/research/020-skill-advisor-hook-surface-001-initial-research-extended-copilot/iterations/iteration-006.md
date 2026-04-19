# Iteration 006 - X6 Full Observability + Telemetry Design

## Focus

Define the observability contract for the future skill-advisor prompt hook: concrete metric names and types, fixed dimensions, one structured log record per invocation, alarm thresholds, and the shape of a new `advisor_hook_health` section that can plug into the existing `session_health` surface without logging raw prompt material.

## Inputs Read

- Packet prompt and state:
  - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/prompts/iteration-6.md`
  - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/deep-research-state.jsonl`
  - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/deep-research-strategy.md`
- Wave-1 authority:
  - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research/research.md`
- Existing health / startup surfaces:
  - `.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/README.md`
- Existing hook logging surfaces:
  - `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/session-prime.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/compact-cache.ts`
- Existing advisor health / performance surfaces:
  - `.opencode/skill/skill-advisor/scripts/skill_advisor.py`
  - `.opencode/skill/skill-advisor/scripts/skill_advisor_runtime.py`
  - `.opencode/skill/skill-advisor/scripts/skill_advisor_bench.py`
  - `.opencode/skill/skill-advisor/scripts/skill_advisor_regression.py`
- Existing telemetry schema style:
  - `.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/trace-schema.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts`

## Existing Contract We Must Preserve

Wave 1 already fixed four observability rules for the hook surface:

1. `stdout` is reserved for runtime hook output only.
2. `stderr` carries one-line redacted diagnostics.
3. Metrics should cover runtime, status, freshness, error code, duration, retries, and cache hits.
4. Health should surface as either a dedicated `advisor_hook_health` payload or an added section inside `session_health`. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research/research.md:233-240]

That fits the checked-in runtime surfaces. Shared hook utilities currently write plain-text `INFO/WARN/ERROR` lines to `stderr`, and Copilot's session-prime hook also writes bracketed diagnostics directly to `stderr` while keeping `stdout` for the banner payload. [SOURCE: file:.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:82-93] [SOURCE: file:.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/session-prime.ts:152-164] [SOURCE: file:.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/session-prime.ts:185-190]

The repo also already has a canonical pattern for telemetry payloads: fixed-key JSON objects, sanitized fields only, and rejection of unknown/sensitive structure drift. That makes newline-delimited JSON the right format for per-invocation advisor logs, not free-form text or ad-hoc `key=value` strings. [SOURCE: file:.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/trace-schema.ts:5-7] [SOURCE: file:.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/trace-schema.ts:20-32] [SOURCE: file:.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/trace-schema.ts:98-136]

## Reusable Local Signals

### 1. Advisor health already has a concrete machine shape

`health_check()` already emits `status`, cache health, source-metadata health, skill-graph load state, topology warnings, and inventory-parity drift between SKILL discovery and the compiled graph. That is enough to drive an operator-facing health section without inventing new health dimensions. [SOURCE: file:.opencode/skill/skill-advisor/scripts/skill_advisor.py:2632-2703]

`skill_advisor_runtime.py` also exposes the cache shape directly: cached/not cached, record count, skipped file count, skipped paths, and a derived `ok`/`degraded` cache status keyed by file signature `(path, mtime, size)`. That gives the observability contract a real cache-hit and cache-health boundary instead of a vague "warm/cold" concept. [SOURCE: file:.opencode/skill/skill-advisor/scripts/skill_advisor_runtime.py:28-33] [SOURCE: file:.opencode/skill/skill-advisor/scripts/skill_advisor_runtime.py:159-169] [SOURCE: file:.opencode/skill/skill-advisor/scripts/skill_advisor_runtime.py:231-284]

### 2. Bench and regression tooling already define baseline gates

The current benchmark harness already uses p50/p95 timing summaries, tracks one-shot subprocess, warm in-process, and batch throughput, and ships hard gates of warm p95 <= 20 ms, cold p95 <= 60 ms, and batch throughput >= 2x subprocess throughput. [SOURCE: file:.opencode/skill/skill-advisor/scripts/skill_advisor_bench.py:84-97] [SOURCE: file:.opencode/skill/skill-advisor/scripts/skill_advisor_bench.py:229-258]

The regression harness already emits routing-quality metrics that matter for health: `top1_accuracy`, `command_bridge_fp_rate`, and `p0_pass_rate`, with default gates of >= 0.92, <= 0.05, and == 1.0 respectively. These should not become prompt-hook hot-path metrics, but they should appear in background quality dashboards and advisor health summaries. [SOURCE: file:.opencode/skill/skill-advisor/scripts/skill_advisor_regression.py:126-170] [SOURCE: file:.opencode/skill/skill-advisor/scripts/skill_advisor_regression.py:188-245]

### 3. `session_health` already has the right extension point

`session_health` today returns `ok` / `warning` / `stale`, carries detailed sections, and already publishes a compact health payload plus hints. The existing sections are `session-health`, `quality-score`, `structural-context`, and `code-graph-readiness`. Adding `advisor-hook-health` as a peer section is safer than overloading the structural summary or startup banner. [SOURCE: file:.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:36-75] [SOURCE: file:.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:163-176] [SOURCE: file:.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:235-293] [SOURCE: file:.opencode/skill/system-spec-kit/mcp_server/README.md:764-766]

## X6 Observability Contract

## 1. Metrics Catalog

### Core counters

| Metric | Type | Dimensions | Meaning |
| --- | --- | --- | --- |
| `speckit_advisor_hook_invocations_total` | counter | `runtime`, `hook_event`, `status`, `freshness` | Every advisor hook attempt, including `ok`, `skipped`, `degraded`, and `fail_open`. |
| `speckit_advisor_hook_errors_total` | counter | `runtime`, `hook_event`, `error_code` | Sanitized failures only: `enoent`, `timeout`, `bad_json`, `nonzero_exit`, `sqlite_busy`, `input_shape`, `health_degraded`. |
| `speckit_advisor_hook_skips_total` | counter | `runtime`, `hook_event`, `skip_reason` | Prompt-policy skips such as `short_casual`, `confidence_below_floor`, `hook_input_missing`, or `runtime_not_enabled`. |
| `speckit_advisor_hook_brief_total` | counter | `runtime`, `hook_event`, `brief_state`, `freshness` | Whether the invocation produced `injected`, `suppressed`, or `degraded_injected` output. |
| `speckit_advisor_hook_recommendation_total` | counter | `runtime`, `hook_event`, `recommendation_state` | `passing`, `non_passing`, or `none`. |
| `speckit_advisor_hook_semantic_lane_total` | counter | `runtime`, `semantic_mode`, `semantic_result` | `disabled`, `auto`, `forced` crossed with `hit`, `miss`, `timeout`, or `error`. |
| `speckit_advisor_hook_cache_lookup_total` | counter | `runtime`, `cache_layer`, `cache_result` | Cache lookups for `inventory`, `health_snapshot`, and future `exact_prompt`, with result `hit`, `miss`, `stale`, or `bypass`. |
| `speckit_advisor_hook_health_total` | counter | `runtime`, `health_status` | Direct projection of advisor `health_check()` result: `ok`, `degraded`, `error`. |

### Latency / size histograms

| Metric | Type | Dimensions | Meaning |
| --- | --- | --- | --- |
| `speckit_advisor_hook_duration_ms` | histogram | `runtime`, `hook_event`, `status` | End-to-end hook wall time from input parse start to stdout write completion. This is the alerting source for p99 > 500 ms. |
| `speckit_advisor_hook_advisor_exec_ms` | histogram | `runtime`, `exec_mode`, `semantic_lane` | Time spent in the advisor subprocess or in-process analysis only. `exec_mode` starts as `subprocess`; reserve `warm` and `batch` for benchmark parity. |
| `speckit_advisor_hook_semantic_duration_ms` | histogram | `runtime`, `semantic_mode`, `semantic_result` | Time spent in semantic-search enrichment when used. |
| `speckit_advisor_hook_brief_tokens` | histogram | `runtime`, `hook_event`, `brief_state` | Estimated prompt-visible brief size, proving the 80/120-token caps stay intact. |
| `speckit_advisor_hook_retry_delay_ms` | histogram | `runtime`, `retry_reason` | Only for the bounded SQLite-busy retry path from wave 1. |

### Derived gauges

| Metric | Type | Dimensions | Meaning |
| --- | --- | --- | --- |
| `speckit_advisor_hook_fail_open_rate_1h` | gauge | `runtime`, `hook_event` | Rolling 1-hour fail-open ratio = `fail_open / invocations`. |
| `speckit_advisor_hook_duration_p99_ms_15m` | gauge | `runtime`, `hook_event` | Rolling 15-minute p99 derived from `speckit_advisor_hook_duration_ms`. |
| `speckit_advisor_hook_cache_hit_rate_30m` | gauge | `runtime`, `cache_layer` | Rolling 30-minute hit ratio for each cache layer. |
| `speckit_advisor_hook_last_success_age_seconds` | gauge | `runtime`, `hook_event` | Seconds since the last `status=ok` invocation. |
| `speckit_advisor_hook_inventory_parity_mismatch` | gauge | `runtime` | `0` when discovery and graph inventories match; `1` when drift exists. |
| `speckit_advisor_hook_skipped_files` | gauge | `runtime` | Mirrors `get_cache_status().skipped_files` so parse regressions show up immediately. |

### Required dimension limits

Keep dimensions fixed and low-cardinality:

1. `runtime`: `claude`, `gemini`, `copilot`, `codex`
2. `hook_event`: `user_prompt_submit`, `session_start`, `pre_tool_use`, `post_tool_use`
3. `status`: `ok`, `skipped`, `degraded`, `fail_open`
4. `freshness`: `live`, `stale`, `absent`, `unavailable`
5. `error_code`: fixed allowlist only; no raw exception text
6. `cache_layer`: `inventory`, `health_snapshot`, `exact_prompt`
7. `cache_result`: `hit`, `miss`, `stale`, `bypass`

Do **not** dimension on raw prompt text, skill IDs, free-form error messages, session IDs, transcript paths, or spec-folder paths. That would violate the wave-1 privacy rule and explode metric cardinality. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research/research.md:211-216] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research/research.md:233-240]

## 2. Structured Log Contract

### Verdict: JSONL on `stderr`, one record per invocation

The hook should keep `stdout` reserved for model-visible output and emit exactly one canonical JSON record to `stderr` per invocation. The record should follow the repo's fixed-key telemetry style and avoid arbitrary nested dumps. Plain-text log lines are acceptable for today's startup hooks, but they are insufficient for per-hook alerting, cache diagnostics, and privacy-safe sampling at packet 020 scale. [SOURCE: file:.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:82-93] [SOURCE: file:.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/trace-schema.ts:20-32]

Recommended record:

```json
{
  "ts": "2026-04-19T07:38:31Z",
  "surface": "advisor_hook",
  "runtime": "copilot",
  "hookEvent": "user_prompt_submit",
  "status": "ok",
  "freshness": "live",
  "healthStatus": "ok",
  "durationMs": 83,
  "advisorExecMs": 47,
  "semanticDurationMs": 0,
  "retryCount": 0,
  "briefState": "injected",
  "recommendationState": "passing",
  "recommendationCount": 3,
  "passingCount": 1,
  "cache": {
    "inventory": "hit",
    "healthSnapshot": "hit",
    "exactPrompt": "miss"
  },
  "quality": {
    "top1Confidence": 0.95,
    "top1Uncertainty": 0.15
  },
  "policy": {
    "confidenceThreshold": 0.8,
    "uncertaintyThreshold": 0.35
  },
  "healthFlags": {
    "inventoryParity": "in_sync",
    "topologyWarnings": false,
    "skippedFiles": 0
  },
  "errorCode": null,
  "sessionIdHash": "sha256:7a1c...",
  "specFolderHash": "sha256:64f1..."
}
```

### Logging rules

1. **No raw prompt, normalized prompt, token list, transcript tail, or raw stderr/stdout fragments.**
2. **Hash session and spec identifiers if they are included at all.**
3. **Use `errorCode`, not free-form exception strings, in the structured record.**
4. **Keep free-form human diagnostics on `stderr` only for rare crash cases, and suppress repeats.**
5. **Attach the current advisor health snapshot (`inventoryParity`, `topologyWarnings`, `skippedFiles`) because those are already local, cheap, and operator-relevant.**

`key=value` was ruled out for the primary sink because cache state, quality thresholds, and health flags are naturally nested, and the repo already prefers canonical JSON payloads with allowlisted keys over stringly-typed trace lines. [SOURCE: file:.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/trace-schema.ts:138-179]

## 3. Alarm Catalog

| Alert | Condition | Severity | Why it matters |
| --- | --- | --- | --- |
| `advisor_hook_fail_open_rate_high` | `speckit_advisor_hook_fail_open_rate_1h > 0.01` and `invocations_total >= 100` | P1 | Matches the packet threshold and detects a real integrity-loss surface even when prompts still proceed. |
| `advisor_hook_latency_p99_high` | `speckit_advisor_hook_duration_p99_ms_15m > 500` for any `runtime + hook_event` | P1 | 500 ms is the explicit packet threshold and protects prompt-time UX. |
| `advisor_hook_cache_hit_rate_low` | `speckit_advisor_hook_cache_hit_rate_30m{cache_layer="inventory"} < 0.30` and `cache_lookup_total >= 50` | P2 | Matches the packet threshold and catches warm-path regressions before they turn into latency incidents. |
| `advisor_hook_health_degraded` | `speckit_advisor_hook_health_total{health_status="degraded"} / invocations_total > 0.05` over 15 min | P1 | Captures inventory parity drift, topology warnings, or skipped SKILL files even if requests still complete. |
| `advisor_hook_no_recent_success` | `speckit_advisor_hook_last_success_age_seconds > 3600` on an enabled runtime | P1 | Distinguishes silent outage from low traffic and feeds `session_health` hints. |
| `advisor_hook_inventory_parity_drift` | `speckit_advisor_hook_inventory_parity_mismatch == 1` for 10 min | P1 | Directly reflects the checked-in health contract: discovery and graph disagree. |
| `advisor_hook_skipped_files_detected` | `speckit_advisor_hook_skipped_files > 0` for 10 min | P2 | A parse regression in `SKILL.md` files downgrades routing health before top-1 accuracy visibly collapses. |

## 4. `session_health` Integration

### New section

Add a fifth peer section:

```ts
{
  key: 'advisor-hook-health',
  title: 'Advisor Hook Health',
  content: 'status=ok; failOpenRate1h=0.002; p99Ms15m=83; cacheHitRate30m=0.74; lastSuccessAgeSec=18; inventoryParity=in_sync; skippedFiles=0',
  source: 'operational'
}
```

### Section status rules

Map it into the existing `session_health` vocabulary:

1. **`ok`** when `health_check().status == "ok"`, fail-open rate <= 1%, p99 <= 500 ms, cache hit rate >= 30%, and last success age <= 15 minutes.
2. **`warning`** when any one threshold breaches, or when advisor health is `degraded`, or when last success age is between 15 and 60 minutes.
3. **`stale`** when the runtime is configured for advisor hooks but there has been no successful invocation for >60 minutes, or health is `error`, or freshness is `absent` / `unavailable`.

### Hint rules

Reuse the current hint model:

- If health is `degraded`, add `Advisor hook health is degraded. Check inventory parity, skipped SKILL files, or topology warnings.`
- If fail-open rate is high, add `Advisor hook is failing open above SLO. Prompt flow is continuing, but model-visible guidance is unreliable.`
- If cache hit rate is low, add `Advisor inventory cache hit rate is low. Expect elevated prompt-hook latency until the warm path is restored.`

This is a better fit than startup-banner expansion because `session_health` already exists to show operational state plus actionable hints, while the startup brief is intentionally a compact snapshot. [SOURCE: file:.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:223-255] [SOURCE: file:.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:173-193]

## Determination

**X6 is answered.** The repo already contains enough local evidence to define the advisor observability contract precisely:

1. The wave-1 fail-open/privacy rules set the hard boundary.
2. The checked-in hook utilities prove `stdout` / `stderr` separation and show where structured logs must fit.
3. `health_check()` plus runtime cache diagnostics already provide the health inputs.
4. Bench/regression tooling already provides the latency and routing-quality baselines.
5. `session_health` already has the section/hint architecture needed for operator visibility.

The missing piece is not discovery; it is standardization. Packet 020 should adopt one canonical metric namespace, one JSONL invocation log schema, and one threshold table shared across runtimes.

## Ruled Out

### 1. Logging raw prompt or advisor reason text

Ruled out because wave 1 explicitly prohibited raw prompt logging, and the future brief boundary must stay whitelist-only. The observability layer should prove behavior through counters, status fields, and hashed identifiers, not prompt excerpts. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research/research.md:211-216]

### 2. Reusing today's plain-text hook lines as the long-term telemetry sink

Ruled out because current plain-text `stderr` lines are human-readable but not sufficient for fixed-key aggregation, alerting, or low-risk sampling across runtimes. They remain useful as fallback crash diagnostics only. [SOURCE: file:.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:82-93]

## Decisions

- **Use `speckit_advisor_hook_*` as the canonical metric namespace.** Keep names runtime-neutral so Claude, Gemini, Copilot, and future Codex surfaces can share dashboards.
- **Emit one JSONL record to `stderr` per invocation.** Preserve `stdout` exclusively for hook output.
- **Promote advisor health into `session_health` as a peer section, not a startup-banner expansion.**
- **Alert first on fail-open rate, p99 latency, cache-hit collapse, and inventory-parity drift.**
- **Keep routing-quality metrics (`top1_accuracy`, `command_bridge_fp_rate`, `p0_pass_rate`) in background dashboards, not hot-path per-invocation logs.**

## Question Status

- **X6 answered**: packet 026 now has a concrete metrics catalog, log schema, alarm table, and `session_health` integration contract anchored to checked-in repo surfaces.

## Next Focus

Iteration 7 should move to X7 and determine how advisor caches, health snapshots, and hook freshness behave when skills are added, removed, or renamed mid-session.
