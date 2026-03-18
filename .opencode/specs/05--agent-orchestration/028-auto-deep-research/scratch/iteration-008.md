# Iteration 008: pi-autoresearch Source Code Deep Dive

## Focus
Complete code-level walkthrough of pi-autoresearch's `extensions/pi-autoresearch/index.ts` (88,705 bytes)

## Key Findings

### Finding 1: Event-Driven Architecture (No Traditional Loop)
[SOURCE: extensions/pi-autoresearch/index.ts:agent_end handler]

pi-autoresearch does NOT use a while/for loop. Instead, it uses an event-driven architecture built on the pi-ai extension platform:
- `pi.on("agent_end", ...)` triggers auto-resume after each agent turn completes
- `pi.on("agent_start", ...)` resets per-session counters
- The "loop" is achieved by `pi.sendUserMessage(resumeMsg)` which sends a synthetic user message to restart the agent

Rate-limiting: 5-minute minimum gap between auto-resumes. Turn limit: `MAX_AUTORESUME_TURNS = 20`. Ideas-aware: if `autoresearch.ideas.md` exists, the resume prompt references it.

**Reusability**: This pattern maps directly to our `agent_end` → dispatch next iteration pattern. The rate-limiting and turn-limiting are simpler than our convergence detection but serve the same purpose.

### Finding 2: Complete Type System for Experiment State
[SOURCE: extensions/pi-autoresearch/index.ts:interfaces]

Six key interfaces define the entire state model:

```typescript
interface ExperimentResult {
  commit: string; metric: number; metrics: Record<string, number>;
  status: "keep" | "discard" | "crash" | "checks_failed";
  description: string; timestamp: number; segment: number;
}

interface ExperimentState {
  results: ExperimentResult[]; bestMetric: number | null;
  bestDirection: "lower" | "higher"; metricName: string;
  metricUnit: string; secondaryMetrics: MetricDef[];
  name: string | null; currentSegment: number; maxExperiments: number | null;
}

interface RunDetails {
  command: string; exitCode: number | null; durationSeconds: number;
  passed: boolean; crashed: boolean; timedOut: boolean;
  tailOutput: string; checksPass: boolean | null; checksTimedOut: boolean;
  checksOutput: string; checksDuration: number;
  parsedMetrics: Record<string, number> | null; parsedPrimary: number | null;
}

interface AutoresearchRuntime {
  autoresearchMode: boolean; dashboardExpanded: boolean;
  lastAutoResumeTime: number; experimentsThisSession: number;
  autoResumeTurns: number; lastRunChecks: {...} | null;
  lastRunDuration: number | null; runningExperiment: {...} | null;
  state: ExperimentState;
}
```

**Reusability**: The `ExperimentResult` → our JSONL iteration record. `ExperimentState` → our strategy.md state. `RunDetails` → our iteration execution metadata. The `status` enum ("keep" | "discard" | "crash" | "checks_failed") is more granular than our simple complete/failed.

### Finding 3: JSONL Read with Segment-Aware Reconstruction
[SOURCE: extensions/pi-autoresearch/index.ts:reconstructState]

The `reconstructState()` function reads JSONL line-by-line:
- `type: "config"` entries increment the segment counter (if results already exist)
- All other entries are parsed as ExperimentResult with fallback defaults (`?? ""`, `?? 0`, `?? "keep"`)
- Malformed lines are silently skipped via empty catch blocks
- Segment assignment is implicit: each result inherits the current segment counter at parse time

The segment boundary detection: `if (state.results.length > 0) { segment++; }` -- meaning a config entry after any results marks a new segment. First config entry = segment 0.

### Finding 4: Dual Recovery Path (JSONL Primary, Session History Fallback)
[SOURCE: extensions/pi-autoresearch/index.ts:reconstructState fallback]

If JSONL loading fails or produces no results, the system falls back to session history:
```typescript
if (!loadedFromJsonl) {
  for (const entry of ctx.sessionManager.getBranch()) {
    if (entry.type !== "message") continue;
    if (msg.role !== "toolResult" || msg.toolName !== "log_experiment") continue;
    const details = msg.details as LogDetails;
    if (details?.state) {
      runtime.state = cloneExperimentState(details.state);
    }
  }
}
```

This iterates through the session's message branch looking for `log_experiment` tool results, which contain the full state snapshot. Last one wins. This is a pi-platform-specific recovery mechanism (we don't have session history), but the PATTERN of embedding state snapshots in tool outputs is transferable.

### Finding 5: Experiment Lifecycle as Three Discrete Tools
[SOURCE: extensions/pi-autoresearch/index.ts:tools]

The lifecycle is enforced via 3 separate MCP tools:
1. **`init_experiment`**: Sets name, metricName, metricUnit, direction. Increments segment if reinit. Writes/appends config to JSONL.
2. **`run_experiment`**: Spawns child process via `spawn("bash", ["-c", command])` with `detached: true`. Captures stdout/stderr to temp file. Parses `METRIC` lines via regex. Runs optional checks script.
3. **`log_experiment`**: Records result with commit, metric, status, description. Auto-commits (git add -A + commit) on keep. Auto-reverts (git checkout -- . + git clean -fd) on discard/crash. Checks maxExperiments limit.

**Key detail**: `detached: true` on the child process allows process group management. `killTree(pid)` sends SIGTERM to the process group (`process.kill(-pid, "SIGTERM")`), falling back to single-process kill.

### Finding 6: Metric Parsing via Structured Output Lines
[SOURCE: extensions/pi-autoresearch/index.ts:parseMetricLines]

```typescript
const regex = new RegExp(`^${METRIC_LINE_PREFIX}\\s+([\\w.u]+)=(\\S+)\\s*$`, "gm");
```

Experiments output metrics as `METRIC key=value` lines (grep-friendly format). A deny-list (`DENIED_METRIC_NAMES`) filters out known irrelevant metrics. Only `Number.isFinite()` values are accepted.

**Reusability**: This structured output parsing is more robust than our free-text newInfoRatio self-assessment. For code optimization research, this pattern enables objective measurement.

### Finding 7: Dashboard Rendering with Progress Tracking
[SOURCE: extensions/pi-autoresearch/index.ts:renderDashboardLines]

The dashboard computes and displays:
- Runs count (total, kept, crashed)
- Baseline metric (first result in current segment)
- Best kept metric with delta percentage: `((best - baseline) / baseline) * 100`
- Per-experiment table with color-coded status (green=keep, gray=discard, red=crash)
- Number formatting with commas and configurable decimal places

`isBetter(current, best, direction)` handles both lower-is-better and higher-is-better metrics. `formatNum()` handles null values with em-dash fallback.

### Finding 8: Configuration via JSON File with Sensible Defaults
[SOURCE: extensions/pi-autoresearch/index.ts:readConfig]

```typescript
function readConfig(cwd: string): AutoresearchConfig {
  const configPath = path.join(cwd, "autoresearch.config.json");
  if (!fs.existsSync(configPath)) return {};
  return JSON.parse(fs.readFileSync(configPath, "utf-8"));
}
```

Config supports: `maxIterations` (number, optional) and `workingDir` (string, optional, relative or absolute). Defaults: no max iterations, working dir = cwd. `resolveWorkDir()` handles relative path resolution.

### Finding 9: Process Management with Kill Tree
[SOURCE: extensions/pi-autoresearch/index.ts:killTree]

```typescript
function killTree(pid: number): void {
  try { process.kill(-pid, "SIGTERM"); }
  catch { try { process.kill(pid, "SIGTERM"); } catch {} }
}
```

Negative PID signals the entire process group (Unix). Fallback to single-process kill. Used when experiments exceed timeout. Combined with `detached: true` on spawn, this ensures cleanup of subprocess trees.

### Finding 10: Runtime Store for Multi-Session Isolation
[SOURCE: extensions/pi-autoresearch/index.ts:createRuntimeStore]

```typescript
function createRuntimeStore() {
  const runtimes = new Map<string, AutoresearchRuntime>();
  return {
    ensure(sessionKey: string): AutoresearchRuntime { ... },
    clear(sessionKey: string): void { ... },
  };
}
```

Keyed by session, prevents state leaks between concurrent sessions (this was a bug: Issue #7, fixed in PR #8). Each session gets an isolated `AutoresearchRuntime` instance.

### Finding 11: Git Operations Embedded in Experiment Logging
[SOURCE: extensions/pi-autoresearch/index.ts:log_experiment]

On KEEP: `git add -A` then `git commit -m "[autoresearch] description"`. Error caught and reported as warning.
On DISCARD/CRASH: `git add [jsonl+dashboard]` then `git checkout -- .` then `git clean -fd`. This preserves the JSONL update while reverting all other changes.

Shell injection was a vulnerability (PR #13 fixed it by sanitizing commit messages).

## Code Patterns Catalog

| Pattern | Signature/Approach | Transferability |
|---------|-------------------|-----------------|
| Event-driven loop | `pi.on("agent_end", ...)` + `sendUserMessage()` | High -- maps to our dispatch pattern |
| Segment management | Counter incremented on config entry in JSONL | High -- directly implementable |
| Dual recovery | JSONL primary → session history fallback | Medium -- we lack session history API |
| Structured metric output | `METRIC key=value` grep-friendly lines | Medium -- useful for optimization research |
| Process group kill | `process.kill(-pid, "SIGTERM")` | Low -- we use Task tool, not OS processes |
| Runtime isolation store | `Map<string, Runtime>` with ensure/clear | Medium -- relevant for concurrent research |
| JSONL fault tolerance | Silent skip of malformed lines, `?? default` | High -- improves our JSONL robustness |
| Git keep/discard | Add-all+commit vs checkout+clean | Low -- research doesn't produce code changes |

## Error Handling Map

| Error Type | Handler | Recovery | Notes |
|-----------|---------|----------|-------|
| Malformed JSONL line | Empty catch in parse loop | Skip line, continue | No logging of skipped lines |
| Missing JSONL file | `fs.existsSync()` check | Fall through to session history | Graceful degradation |
| Working dir not found | `validateWorkDir()` returns error string | Error returned to LLM | LLM decides next action |
| Git add/commit failure | try/catch around exec | Warning appended to output | Does not halt experiment |
| Process timeout | killTree(pid) | SIGTERM to process group | Fallback to single-process |
| Checks script failure | try/catch with checksPass=false | Recorded as checks_failed status | Experiment continues |
| Max experiments reached | Conditional check in log_experiment | Returns stop message, disables mode | Clean shutdown |

## Assessment
- Questions addressed: Q11, Q15
- Questions answered: Q11 (partially -- pi-autoresearch patterns cataloged), Q15 (partially -- pi-autoresearch error handling mapped)
- newInfoRatio: 0.80
- Key insight: The event-driven architecture with tool-separated lifecycle phases (init/run/log) is more modular than a monolithic loop. The JSONL fault tolerance (silent skip + defaults) and dual recovery path are directly implementable improvements to our system.

## Recommended Next Focus
Community pain points across repos (Wave 5) to validate which code-level patterns address real user problems.
