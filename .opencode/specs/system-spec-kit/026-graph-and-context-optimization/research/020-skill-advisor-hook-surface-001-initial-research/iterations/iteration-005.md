# Iteration 005 - Failure-Mode and Fail-Open Contract

## Focus

Answer Q5: define the detailed fail-open contract for prompt-time skill-advisor hooks, including subprocess error modes, freshness signal behavior, retry policy, result shape, and observability.

This iteration treats the hook as advisory, not authoritative. The invariant is:

> Skill-advisor hook failures must never block, rewrite, or delay the user prompt beyond the hook timeout budget. Failures become structured diagnostics plus a null advisor brief.

## Source Evidence

- The active strategy asks Q5: "What subprocess-error modes must the fail-open contract handle (binary missing, timeout, JSON parse error, concurrent write to skill-graph)?" [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research/deep-research-strategy.md:24`]
- Iteration 003 measured single-prompt advisor subprocess calls at about 52-58 ms with semantic disabled, and recommended a 15-minute source cache plus a 5-minute exact prompt-result cache. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research/iterations/iteration-003.md:47-94`]
- Iteration 004 established Codex `UserPromptSubmit` as the primary native injection surface and recommended prompt wrapping only as compatibility fallback. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research/iterations/iteration-004.md:97-170`]
- Existing hook utilities define an 1800 ms hard hook timeout, return fallback values on timeout, and write diagnostics to stderr because stdout is reserved for hook output injection. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:8-9`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:66-93`]
- The advisor's SQLite graph loader returns `None` on `sqlite3.Error`, malformed graph JSON, and graph shape errors; the higher-level loader prefers SQLite, then JSON fallback, then optional JSON auto-compile. [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:279-392`] [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:431-475`]
- The advisor's built-in CocoIndex lane is explicitly fail-open: missing binary, timeout, non-zero exit, or unexpected output return an empty hit list. [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:1697-1730`]
- Advisor health returns structured degradation signals for missing/unavailable graph state, cache parse failures, source metadata issues, and inventory parity mismatch. [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:2632-2713`] [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor_runtime.py:231-284`]
- The shared payload contract already defines the trust-state vocabulary needed by hook consumers: `live`, `stale`, `absent`, and `unavailable` are the relevant public values. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:20-65`]
- Current local advisor health is `degraded`, not `ok`, because the SQLite skill graph has 21 graph IDs while `SKILL.md` discovery has 20 skills and is missing `skill-advisor` in discovery. [COMMAND: `python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py --health`]
- A current single-prompt advisor call for this iteration's prompt returned code `0`, parsed JSON on stdout, and completed in about `55.91 ms`; stderr contained only the graph-source diagnostic. [COMMAND: `python3 - <<'PY' ... subprocess.run(..., timeout=2) ... PY`]

## Contract Summary

The hook result should distinguish three concepts that are easy to blur:

1. **Hook execution status**: did the hook complete, degrade, or fail open?
2. **Advisor freshness**: can the advisor's skill inventory and graph source be trusted?
3. **Recommendation threshold status**: did any skill recommendation pass confidence and uncertainty gates?

Fail-open means the hook exits `0` and emits no model-visible advisor brief unless it has a parsed, threshold-aware result. It may still log diagnostics to stderr and update in-memory metrics.

## Error-Mode Matrix

| Error mode | Detection | Hook behavior | Freshness signal | Log level | User-visible impact | Retry |
| --- | --- | --- | --- | --- | --- | --- |
| Python not in `PATH` | `spawn`/`execFile` raises `ENOENT` for configured Python binary | Return `AdvisorHookResult` with `status: "fail_open"`, no brief, no recommendations | `unavailable` | `error` once per source signature, then `warn` with suppression counter | No advisor context is injected; prompt proceeds normally | No hot-path retry. Healthcheck can retry on next invocation after config changes |
| `skill_advisor.py` missing or moved | `existsSync(scriptPath)` false before spawn, or spawn returns file-not-found for script | Fail open before subprocess; include `scriptPath` in diagnostics, redacted to repo-relative path when possible | `absent` | `error` | No advisor context; healthcheck reports missing script | No retry until source signature changes |
| Subprocess timeout over 2 seconds | Abort controller or child-process timeout fires before parse | Kill process, fail open, preserve stale cached brief only for health surfaces, not prompt injection | `unavailable` if no valid cache; `stale` if only stale cache exists | `warn` for first timeout, `error` after repeated timeouts in a session | No prompt-time advisor brief; optional startup/health banner can say advisor unavailable | No immediate retry in prompt hook. Background health uses 250 ms, 500 ms, 1000 ms exponential backoff with jitter |
| Malformed JSON output | `JSON.parse(stdout)` fails or parsed shape is not an array/object matching expected mode | Fail open; record first 160 chars of sanitized stdout in diagnostics, never inject raw stdout | `unavailable` for this invocation; underlying cached freshness unchanged | `warn` | No advisor context; prompt proceeds | No retry. Re-running the same broken process usually repeats the same output |
| Non-zero exit code | `status !== 0`; include `stderr || stdout` summary | Fail open unless exit code is a known validation-only code from an explicit healthcheck path; prompt hook treats all non-zero as no brief | `unavailable` | `warn`; `error` if repeated or exit suggests missing dependency/config | No advisor context | No prompt retry. Healthcheck may retry once after 250 ms only for transient dependency codes |
| Concurrent write to skill-graph SQLite / stale read window | `sqlite3.Error`, `database is locked`, incomplete rows, empty graph, or graph mtime changes during read | Prefer last live source snapshot if source signature still matches; otherwise fail open. Do not block waiting for writer | `stale` when a prior live snapshot exists; `unavailable` without cache | `warn` | If cached snapshot is used, advisor brief says `stale`; otherwise no brief | One bounded retry after 75-125 ms only if remaining hook budget is at least 500 ms; otherwise none |
| Process killed by signal | Child closes with `signal` set or no exit code | Fail open; record signal name and elapsed time | `unavailable` | `error` for terminating signals, `warn` for caller-initiated timeout kill | No advisor context | No retry in prompt hook |
| Network dependency appears in future | Any remote fetch path enabled by config, DNS/connect/read timeout, HTTP non-2xx, schema mismatch | Prompt hook must not call remote fetch directly. Use precomputed/cache-only remote data; if missing, fail open | `stale` if cached remote data is still inside TTL; `unavailable` otherwise | `warn` for transient remote failure, `error` for auth/schema/config failure | No live remote wait in prompt path; optional health says remote advisor augmentation unavailable | Background-only retry: 250 ms, 500 ms, 1000 ms, max 3 attempts, full jitter, circuit-break after 3 failed windows |
| Advisor health is degraded | Parsed `--health` has `status: "degraded"` or analysis detects degraded graph/cache/source metadata | Allow a brief only if recommendation parsing succeeds, but prefix `Advisor: stale/degraded` and include no enforcement wording | `stale` | `info` for known degraded state; `warn` when state changed from live | User may see `Advisor: stale; ...` only when there is still a parsed recommendation | No retry; freshness invalidation decides next probe |
| No recommendation passes thresholds | Parsed JSON is valid but every result has `passes_threshold: false` | Return `status: "ok"` with `brief: null` or a diagnostic-only 120-token debug brief when enabled | `live` or `stale`, based on source freshness | `debug`/`info` | Usually no user-visible advisor text | No retry |
| Unsupported hook input shape | Runtime hook payload lacks prompt text/session/cwd or Codex passes JSON as argv in an unexpected shape | Parse defensively from stdin first, then argv. If still unsupported, fail open | `unavailable` for this invocation | `warn` | No advisor context | No retry |

## Freshness Semantics

Recommended mapping:

| Internal condition | Public freshness | Rationale |
| --- | --- | --- |
| Advisor script exists, Python works, graph/source inventory loaded, health `ok`, source signature unchanged | `live` | Current result can be trusted as prompt-time guidance |
| Health `degraded`, graph/cache/source metadata mismatch, SQLite lock with usable previous snapshot, or source cache older than preferred TTL but not expired | `stale` | Result may still be useful but must not be framed as authoritative |
| Advisor script or graph artifact does not exist and no fallback artifact exists | `absent` | The expected local artifact is missing |
| Python/spawn/timeout/parse/non-zero/signal/permissions failure prevents reading an artifact that should exist | `unavailable` | The source should be available but cannot be accessed now |

Prompt-time output rules:

- `live` plus passing recommendation: inject normal 80-token brief.
- `stale` plus passing recommendation: inject only if confidence is high and uncertainty is low; include `Advisor: stale`.
- `absent` or `unavailable`: inject nothing into the model-visible prompt.
- Any failed threshold: inject nothing by default, regardless of freshness.

## Retry Policy

The prompt hook should optimize for bounded latency, not perfect recovery.

| Surface | Retry policy |
| --- | --- |
| Prompt hook (`UserPromptSubmit`, Claude/Gemini/Copilot equivalents) | Zero retries for deterministic configuration and parse failures. One optional short retry only for SQLite busy/stale-read windows when remaining budget is at least 500 ms. |
| Session-start readiness banner | One retry for transient advisor subprocess timeout or SQLite busy, capped at 250 ms delay. Degrade to `unavailable` if it still fails. |
| Healthcheck endpoint/tool | Up to three attempts for transient timeout, SQLite busy, or future remote fetch failures: 250 ms, 500 ms, 1000 ms with full jitter. |
| Background warmer | May use the healthcheck curve, but must update only in-memory or atomic cache snapshots; it must not mutate prompt text or hook state while a prompt hook is reading. |

Retry classification:

- **Never retry in prompt hook**: Python missing, script missing, malformed JSON, unsupported hook input, non-zero exit from malformed flags/config, signal kill.
- **Maybe retry once in prompt hook**: SQLite busy/read-window only.
- **Background only**: network, semantic augmentation, health recomputation, graph/source cache rebuild.

## `AdvisorHookResult` Interface

```ts
export type AdvisorFreshness = 'live' | 'stale' | 'absent' | 'unavailable';

export type AdvisorHookStatus =
  | 'ok'
  | 'skipped'
  | 'degraded'
  | 'fail_open';

export type AdvisorHookErrorCode =
  | 'python_not_found'
  | 'advisor_script_missing'
  | 'timeout'
  | 'malformed_json'
  | 'non_zero_exit'
  | 'sqlite_busy'
  | 'process_signaled'
  | 'network_unavailable'
  | 'unsupported_hook_input'
  | 'unknown_error';

export interface AdvisorRecommendation {
  skill: string;
  kind: 'skill' | 'command';
  confidence: number;
  uncertainty: number;
  passesThreshold: boolean;
  reason?: string;
}

export interface AdvisorHookDiagnostics {
  code: AdvisorHookErrorCode;
  message: string;
  detail?: string;
  exitCode?: number;
  signal?: string;
  stderrSample?: string;
  stdoutSample?: string;
  retryable: boolean;
}

export interface AdvisorHookMetrics {
  durationMs: number;
  timedOut: boolean;
  retries: number;
  cacheHit: boolean;
  promptFingerprint?: string;
  sourceSignature?: string;
}

export interface AdvisorHookResult {
  status: AdvisorHookStatus;
  freshness: AdvisorFreshness;
  brief: string | null;
  recommendations: AdvisorRecommendation[];
  diagnostics: AdvisorHookDiagnostics | null;
  metrics: AdvisorHookMetrics;
  generatedAt: string;
}
```

Shape rules:

- `status: "fail_open"` always means `brief: null`.
- `status: "degraded"` may have a brief, but it must include stale/degraded wording and must not say `MUST invoke`.
- `status: "skipped"` means the hook intentionally did not run because the prompt was too short or not work-intent shaped.
- `recommendations` may include failed threshold candidates for debug/trace, but brief generation must consider only passing recommendations.
- `promptFingerprint` must be a salted, non-reversible hash when present in diagnostics or metrics. Raw prompt text must not be logged.

## Observability Plan

### Logs

Use stderr for all hook diagnostics. Stdout remains reserved for the runtime-specific hook response:

```text
INFO  [speckit-advisor-hook:result] live ok duration=56ms cacheHit=false top=sk-deep-research pass=true
WARN  [speckit-advisor-hook:sqlite_busy] stale fail_open duration=142ms retries=1
ERROR [speckit-advisor-hook:python_not_found] unavailable fail_open python=python3
```

Rules:

- Log one line per hook invocation at `info` only when debug mode or state changes are enabled.
- Always log fail-open events at `warn` or `error`.
- Suppress repeated identical failures after the first event per `(workspaceRoot, sourceSignature, errorCode)` window; emit a summary counter instead.
- Redact raw prompts, absolute home paths when not needed, and full stdout/stderr payloads.

### Metrics

Keep prompt-hook metrics in memory by default:

| Metric | Type | Purpose |
| --- | --- | --- |
| `advisor_hook_invocations_total{runtime,status,freshness}` | counter | Overall hook health by runtime |
| `advisor_hook_fail_open_total{runtime,errorCode}` | counter | Alert on degraded prompt-routing support |
| `advisor_hook_duration_ms{runtime,status}` | histogram | Keep p95 below 200 ms and hard cap below 1800 ms |
| `advisor_hook_cache_hits_total{cacheKind}` | counter | Validate 15-minute source cache and 5-minute exact prompt-result cache |
| `advisor_hook_retries_total{reason}` | counter | Ensure prompt-path retries remain rare |
| `advisor_hook_briefs_injected_total{freshness}` | counter | Watch stale/live injection ratio |
| `advisor_hook_parse_failures_total{runtime}` | counter | Catch runtime hook schema drift |

Persistence should be optional and aggregate-only. Do not persist raw prompt text, raw hook payloads, or full recommendation reason strings unless a debug flag explicitly writes packet-local scratch logs.

### Healthcheck Endpoint or Tool

Add a lightweight advisor hook health surface adjacent to existing session health patterns:

```ts
export interface AdvisorHookHealth {
  status: 'ok' | 'degraded' | 'error';
  freshness: AdvisorFreshness;
  pythonAvailable: boolean;
  scriptExists: boolean;
  graphSource: 'sqlite' | 'json' | 'none';
  advisorHealthStatus: 'ok' | 'degraded' | 'error' | 'unknown';
  lastSuccessAt: string | null;
  lastFailureAt: string | null;
  lastErrorCode: AdvisorHookErrorCode | null;
  p95DurationMs: number | null;
  failOpenCount: number;
  cache: {
    sourceCacheAgeMs: number | null;
    sourceCacheTtlMs: number;
    promptResultCacheTtlMs: number;
  };
}
```

Recommended surfaces:

- CLI: `node dist/hooks/advisor/health.js --json`
- MCP: `advisor_hook_health` or an `advisorHook` section inside `session_health`
- Startup brief: one line only, for example `Skill Advisor: live` or `Skill Advisor: unavailable (fail-open)`

The healthcheck may run `skill_advisor.py --health`; the prompt hook should not run full health on every prompt.

## Q5 Answer

The fail-open contract should be explicit and typed:

1. Every subprocess failure path returns exit `0` from the hook wrapper and no model-visible advisor brief.
2. `live/stale/absent/unavailable` freshness is separate from recommendation pass/fail.
3. Prompt hooks get at most one short SQLite-busy retry; all other retry work belongs to healthcheck/background warming.
4. `AdvisorHookResult` is the internal contract that runtime adapters convert into Claude/Gemini/Copilot/Codex-specific output.
5. Observability must record fail-open frequency, duration, freshness, cache hits, and parse failures without logging raw prompt text.

## Follow-On Questions

- Q7 remains open: prompt fingerprints should likely be salted TTL hashes, but the precise salt scope and persistence boundary still need a dedicated privacy pass.
- Q8 remains open: snapshot tests should include fail-open fixtures for each runtime output format, especially malformed JSON and timeout cases.

## Ruled Out

- Retrying missing Python or missing script in the prompt hook.
- Waiting on SQLite writers beyond a short jittered retry.
- Injecting a stale/degraded advisor brief without explicit stale wording.
- Persisting raw prompt text for observability.
- Adding future network fetches to the prompt hot path.
