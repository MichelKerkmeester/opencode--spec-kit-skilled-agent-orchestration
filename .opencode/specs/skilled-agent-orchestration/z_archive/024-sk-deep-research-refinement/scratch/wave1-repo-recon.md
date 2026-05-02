# Wave 1A: External Repository Reconnaissance

> Captured: 2026-03-18 | Agent: 1A (Opus 4.6)
> Sources: GitHub API + WebFetch on 3 repos

---

## Repo 1: AGR (Artificial-General-Research)

**URL:** https://github.com/JoaquinMulet/Artificial-General-Research
**Last commit:** 2026-03-16 (README polish, chart updates)
**License:** MIT

### Current Structure

```
Artificial-General-Research/
├── skills/agr/
│   ├── SKILL.md              ← Main skill definition (Claude Code slash command)
│   └── references/
│       ├── guide.md          ← 13-section comprehensive guide (~2500 lines)
│       └── templates.md      ← benchmark.py, program.md, STRATEGY.md, analysis.py,
│                                run_agr.sh, run_agr.ps1, .gitignore templates
├── LICENSE (MIT)
├── README.md
└── progress.png              ← Optimization timeline chart (spatialize case study)
```

This is a **pure skill package** -- no runtime code, no MCP server, no extension. The entire system is prompt-driven via `SKILL.md` and the generated `program.md` file.

### Key Source Code

#### Main Loop (run_agr.sh template from templates.md)

```bash
#!/bin/bash
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR"
MAX_ITERATIONS=100

for ((i=1; i<=MAX_ITERATIONS; i++)); do
    echo "=== ITERATION $i / $MAX_ITERATIONS [$(date '+%Y-%m-%d %H:%M:%S')] ==="
    claude -p "$(cat program.md)" \
        --dangerously-skip-permissions \
        --max-turns 50 \
        --effort high \
        2>&1 || true
    echo "--- Iteration $i done ---"
    python analysis.py 2>/dev/null || true
    sleep 2
done
```

Key: Uses `claude -p` (headless mode) for fresh context per iteration. This is the "Ralph Loop" pattern -- each iteration is a new Claude Code instance that dies after completing one experiment.

#### Strategy Persistence (STRATEGY.md)

The persistent brain between iterations. Template structure:

- **Current State**: best metric, iteration count
- **Bottleneck Analysis**: per-benchmark breakdown with priorities
- **Variance Profile**: measurement noise bands per sub-benchmark
- **Ideas to Try**: prioritized optimization ideas
- **Ideas Already Tried**: what was tried + WHY it worked/failed
- **Exhausted Approaches**: depleted categories (agent must not retry)
- **Key Insights**: accumulated knowledge

Critical innovation: stores the **reasoning** behind failures, not just outcomes.

#### Error Handling (3-tier from SKILL.md)

Decision logic (verbatim from SKILL.md):

```
1. GUARD FAILED + Metric improved?   -> REWORK (max 2 attempts)
2. GUARD FAILED + Metric didn't?     -> DISCARD
3. GUARD PASSED + Metric improved?   -> KEEP
4. GUARD PASSED + benchmark >5% up?  -> KEEP (noise-masked improvement)
5. GUARD PASSED + code simpler?      -> KEEP (simplification win)
6. None of above?                    -> DISCARD
7. Build crashed?                    -> Fix (3 attempts) or CRASH
8. Benchmark timeout?                -> CRASH
```

The Metric+Guard separation with rework is credited to uditgoenka/autoresearch.

#### Stuck Detection (>5 consecutive discards)

When the agent encounters multiple failures in sequence it:
1. Re-reads ALL source files comprehensively
2. Reviews the complete results log for patterns
3. Attempts combining 2-3 previous successful optimizations
4. Tries opposite approaches to recent failures
5. Explores radical architectural changes (different algorithms, not micro-optimizations)

#### Variance-Aware Acceptance

Per-benchmark acceptance -- if ANY individual benchmark improves >5% without others regressing >5%, KEEP even if total metric didn't improve. This prevents measurement noise in large benchmarks from masking real improvements in smaller ones.

Artifact detection: if ALL experiments show the same "improvement" in a benchmark, the baseline was the outlier, not the experiments.

#### Supervisor Pattern

A parent agent or human monitors results.tsv, audits discards for hidden improvements, and adjusts strategy between batches. Not fully autonomous -- designed for human-in-the-loop oversight.

### Changes Since Spec 023

- **v1.0.0 release** (2026-03-15): Initial public release with full skill package
- **README polish** (2026-03-16): SEO optimization, chart updates, case study documentation
- **No structural changes** since initial release -- the codebase is stable
- The skill package is Claude Code specific (`claude -p` flags, `--dangerously-skip-permissions`)

---

## Repo 2: pi-autoresearch

**URL:** https://github.com/davebcn87/pi-autoresearch
**Last commit:** 2026-03-18 (TODAY -- active development)
**License:** MIT

### Current Structure

```
pi-autoresearch/
├── extensions/
│   └── pi-autoresearch/
│       └── index.ts          ← Main extension (~2000+ lines TypeScript)
│                                Implements tools, dashboard, JSONL state, UI widgets
├── skills/
│   └── autoresearch-create/
│       └── SKILL.md          ← Session setup and loop instructions
├── .gitignore
├── LICENSE (MIT)
├── README.md
├── package.json
├── package-lock.json
└── pi-autoresearch.png       ← Dashboard screenshot
```

This is a **Pi Agent extension** -- a full TypeScript runtime with tool definitions, TUI dashboard, and system prompt injection. Substantially more infrastructure than AGR.

### Key Source Code

#### Extension Architecture (index.ts)

Three tool definitions:
- **`init_experiment`**: Configures session (name, metric, unit, direction). Writes config header to JSONL.
- **`run_experiment`**: Runs shell command, times it, captures output, parses `METRIC name=value` lines. Optionally runs `autoresearch.checks.sh` for backpressure.
- **`log_experiment`**: Records result with status (keep/discard/crash/checks_failed), auto-commits on keep, auto-reverts on discard/crash.

Key types:

```typescript
interface ExperimentState {
  results: ExperimentResult[];
  bestMetric: number | null;
  bestDirection: "lower" | "higher";
  metricName: string;
  metricUnit: string;
  secondaryMetrics: MetricDef[];
  name: string | null;
  currentSegment: number;
  maxExperiments: number | null;
}
```

Notable features:
- **Segment model**: Each `init_experiment` call starts a new segment. Baseline is the first result after the config header. Allows metric changes mid-session.
- **Structured METRIC parsing**: `METRIC name=value` lines from command output are auto-parsed. Names validated against prototype pollution (`__proto__`, `constructor`, `prototype` denied).
- **autoresearch.sh guard**: `isAutoresearchShCommand()` function strips env vars and wrappers to validate that the command is genuinely running autoresearch.sh, preventing bypass.
- **Dashboard widget**: Ctrl+Shift+X toggle for fullscreen overlay with scrollable result table, spinner animation during experiments.
- **Auto-resume**: Limited to 20 turns with rate limiting.
- **Context injection**: `autoresearch.md` content injected into context on every turn via `before_agent_start`.
- **Output limits**: Experiment output capped at 10 lines / 4KB sent to LLM to conserve context.

#### JSONL State Format

```json
{"type":"config","name":"<session>","metricName":"<metric>","metricUnit":"<unit>","bestDirection":"lower|higher"}
{"run":1,"commit":"abc1234","metric":42.3,"metrics":{"secondary":123},"status":"keep","description":"baseline","timestamp":1234567890,"segment":0}
```

Config headers start new segments. Results carry segment index. Reconstruction happens by replaying JSONL on session start.

#### Skill (autoresearch-create/SKILL.md)

Loop rules:
- **LOOP FOREVER** -- never ask "should I continue?"
- Primary metric is king: improved -> keep, worse/equal -> discard
- Simpler is better: removing code for equal perf = keep
- Don't thrash: repeatedly reverting same idea -> try structurally different
- Think longer when stuck: re-read source, study profiling data
- **Ideas backlog**: Append to `autoresearch.ideas.md` when discovering complex ideas not worth pursuing immediately. On resume, prune stale/tried entries and experiment with the rest.

#### Backpressure Checks (autoresearch.checks.sh)

Optional correctness gate:
- Runs after every passing benchmark
- If checks fail, result logged as `checks_failed` (cannot keep)
- Separate timeout (default 300s)
- Output truncated to last 80 lines for context efficiency
- Only created when user constraints require correctness validation

### Changes Since Spec 023

**Very active -- 10+ commits on 2026-03-18 alone:**
- `feat: structured METRIC line parsing + wall-clock/metric display` (PR #21, merged today)
- `fix: robust autoresearch.sh guard against bypass and false negatives` (PR #20, merged today)
- `fix: prevent prototype pollution via crafted METRIC names`
- `fix: handle abort signal race when child.pid is not yet assigned`
- `fix: preserve experiment history across init_experiment reinits`
- `fix: reset secondaryMetrics on segment change during jsonl reconstruction`
- `fix: use actual totalBytes from stream instead of rolling buffer size`

Key additions since spec 023:
1. **METRIC line parsing** -- new structured output format (was not present before)
2. **autoresearch.sh command guard** -- security hardening against bypass
3. **Prototype pollution protection** -- input validation on metric names
4. **Segment-aware secondary metric reset** -- fixes state corruption on reinit
5. **Streaming + wall-clock display** -- real-time output during experiments

---

## Repo 3: autoresearch-opencode

**URL:** https://github.com/dabiggm0e/autoresearch-opencode
**Last commit:** 2026-03-14 (4 days ago)
**Default branch:** `master` (not `main`)
**License:** Not specified in tree

### Current Structure

```
autoresearch-opencode/
├── commands/
│   └── autoresearch.md       ← Slash command definition (handles off/dashboard/resume/fresh)
├── docs/
│   └── BACKUP-USAGE.md       ← Backup and restore guide
├── experiments/
│   └── worklog.md            ← Experiment narrative log
├── plugins/
│   └── autoresearch-context.ts  ← Context injection plugin (TypeScript)
├── scripts/
│   ├── backup-state.sh       ← State backup utility
│   ├── install.sh            ← Installation script
│   └── uninstall.sh          ← Uninstallation script
├── skills/
│   └── autoresearch/
│       └── SKILL.md          ← Main skill definition (comprehensive, ~500 lines)
├── .gitignore
├── CHANGES.md                ← Changelog
├── QUICKSTART.md             ← 3-minute setup guide
├── README.md
├── autoresearch-dashboard.md ← Generated dashboard
├── autoresearch.jsonl        ← JSONL state file (committed as example)
├── autoresearch.md           ← Session state file (bogo sort example)
├── autoresearch.sh           ← Benchmark runner (bogo sort example)
├── bogo_sort.py              ← Original bogo sort (immutable)
├── bogo_sort_optimized.py    ← Optimized version
└── worklog.md                ← Top-level worklog
```

This is a **pure OpenCode skill** -- no MCP server, no native extension. Port of pi-autoresearch concepts into OpenCode's skill/command/plugin system. Uses built-in tools only.

### Key Source Code

#### Context Injection Plugin (autoresearch-context.ts)

```typescript
const SENTINEL_FILE = '.autoresearch-off';

export const autoresearchContext: Plugin = {
  name: 'autoresearch-context',
  events: {
    'tui.prompt.append': async (context) => {
      const hasSentinel = await checkSentinelFile();
      if (hasSentinel) return;  // Sentinel pause: skip injection

      const hasCommandFile = await checkCommandFile();
      if (!hasCommandFile) return;  // No autoresearch.md = not in a session

      context.append(CONTEXT_INJECTION);
    },
  },
};
```

The sentinel pause mechanism:
- `.autoresearch-off` file in working directory = context injection disabled
- Created by `/autoresearch off` command
- Deleted by `/autoresearch` (resume) command
- Simple file existence check -- no state, no lock

Context injection content:
- "LOOP FOREVER - Never ask should I continue?"
- Primary metric is king
- Read autoresearch.md, autoresearch.jsonl, experiments/worklog.md for context
- If autoresearch.ideas.md exists, use for inspiration

#### SKILL.md (Comprehensive -- ~500 lines)

**JSONL State Protocol** (detailed, more rigorous than pi-autoresearch):

```json
{"type":"config","name":"<session>","metricName":"<metric>","metricUnit":"<unit>","bestDirection":"lower|higher"}
{"run":1,"commit":"abc1234","metric":42.3,"metrics":{"secondary":123},"status":"keep","description":"baseline","timestamp":1234567890,"segment":0}
```

Same format as pi-autoresearch but with additional protocols:
- **Pre-write validation**: Validates JSONL before appending (checks last 5 lines are valid JSON)
- **Atomic write pattern**: Write to temp file, validate, atomic `mv` to target
- **Post-write verification**: Count runs after write, compare to expected
- **Backup before user-confirmable actions**: Auto-backup via `scripts/backup-state.sh`
- **Data loss detection**: Cross-check JSONL run count against `experiments/worklog.md` count
- **Missing state file recovery**: 3 options presented to user (fresh start / context-only / restore from backup)

#### Ideas Backlog (autoresearch.ideas.md)

Explicit lifecycle:
1. Append promising but complex ideas as bullets during experiments
2. On resume (context limit, crash), read and use as inspiration
3. Prune stale/tried entries
4. Create experiments based on remaining ideas
5. When all paths exhausted, delete file and write final summary
6. When no ideas file exists and loop ends, research is complete

#### Command Definition (commands/autoresearch.md)

Handles arguments:
- `off` -- Creates `.autoresearch-off` sentinel, pauses mode
- `dashboard` -- Regenerates `autoresearch-dashboard.md` from JSONL state
- (no args, autoresearch.md exists) -- Resume: delete sentinel, read state, continue loop
- (no args, no autoresearch.md) -- Fresh start: invoke skill for setup

#### Worklog (experiments/worklog.md)

Per-experiment narrative entries:

```markdown
### Run N: <short description> -- <primary_metric>=<value> (<STATUS>)
- Timestamp: YYYY-MM-DD HH:MM
- What changed: <1-2 sentences>
- Result: <metric values>, <delta vs best>
- Insight: <what was learned>
- Next: <what to try next>
```

Updated every experiment. Survives context compactions and crashes. Includes "Key Insights" and "Next Ideas" sections at bottom.

### Changes Since Spec 023

- **Last active commit**: 2026-03-14 (merge of bogo sort optimization results)
- **Bogo sort case study**: 7,802x speedup via bisect-based sorted-state detection
- **No major structural changes** since initial release
- Repo appears less actively developed than pi-autoresearch
- Has committed example state files (autoresearch.jsonl, autoresearch.md) in repo root

---

## Cross-Repo Summary

### Architecture Comparison

| Dimension | AGR | pi-autoresearch | autoresearch-opencode |
|---|---|---|---|
| **Runtime** | Claude Code (bash loop) | Pi Agent (TS extension) | OpenCode (skill + plugin) |
| **Loop mechanism** | External bash script (`run_agr.sh`) | Internal tool calls (within agent session) | Agent-driven (skill instructions) |
| **State format** | TSV (`results.tsv`) + Markdown (`STRATEGY.md`) | JSONL (`autoresearch.jsonl`) + Markdown (`autoresearch.md`) | JSONL + Markdown (same as pi) |
| **Context management** | Fresh instance per iteration (Ralph Loop) | Long session with context injection | Long session with context injection |
| **Tool surface** | Generated files only (no tools) | 3 native tools (init/run/log) | Built-in tools only (Read/Write/Bash) |
| **UI** | None (progress.png chart) | TUI dashboard + Ctrl+X overlay | Generated dashboard markdown |
| **LOC (main code)** | ~0 (pure prompts/templates) | ~2000+ (TypeScript) | ~60 (TypeScript plugin) + ~500 (SKILL.md) |

### Common Patterns Across All Three

1. **JSONL/TSV append-only experiment log** -- immutable history of all experiments
2. **Markdown strategy document** -- persistent brain updated each iteration
3. **Keep/discard/crash status taxonomy** -- same 3-4 statuses across all
4. **"Loop forever" philosophy** -- never ask for permission, never stop
5. **Git as experiment tracker** -- commit on keep, revert on discard
6. **Simpler-is-better criterion** -- from Karpathy's original autoresearch
7. **Ideas tracking** -- all three have mechanisms for parking complex ideas

### Unique Features Per Repo

**AGR only:**
- Fresh context per iteration (Ralph Loop) -- no degradation at iteration 100
- Per-benchmark variance analysis with artifact detection
- Metric+Guard separation with 2-attempt rework before discard
- Exhausted Approaches registry (category-level blacklist)
- Supervisor pattern (human/parent agent audits discards)
- Complexity budget (>30 tool calls = split into smaller iterations)
- Complete template system for any domain

**pi-autoresearch only:**
- Native Pi Agent extension with typed tool schemas
- Structured METRIC line parsing (`METRIC name=value`)
- TUI dashboard with real-time spinner and Ctrl+X fullscreen overlay
- Segment model for mid-session metric changes
- Secondary metrics tracking with baseline comparison
- `autoresearch.checks.sh` backpressure/correctness gate
- `autoresearch.config.json` for max iterations and working directory override
- Prototype pollution protection on metric names
- autoresearch.sh command guard (security hardening)
- Auto-resume with 20-turn limit and rate-limiting

**autoresearch-opencode only:**
- `.autoresearch-off` sentinel file for pause/resume (simplest pause mechanism)
- Context injection via OpenCode plugin (`tui.prompt.append` event)
- Triple-redundant state (JSONL + worklog + autoresearch.md)
- Data integrity protocol (pre-write validation, atomic writes, post-write verification)
- `scripts/backup-state.sh` utility for state backup/restore
- Data loss detection (cross-check JSONL vs worklog counts)
- Missing state file recovery protocol (3 options)
- `experiments/worklog.md` narrative per-experiment log
- Slash command with argument routing (off/dashboard/resume/fresh)

### Notable Divergences

1. **Context strategy**: AGR uses fresh-instance-per-iteration (no degradation but higher cost). pi-autoresearch and autoresearch-opencode use long sessions with context injection (lower cost but potential degradation).

2. **Correctness handling**: AGR has formal Metric+Guard separation with rework. pi-autoresearch has optional `autoresearch.checks.sh`. autoresearch-opencode relies on skill instructions only.

3. **Data integrity**: autoresearch-opencode is most paranoid (atomic writes, pre/post validation, cross-check, backup scripts). pi-autoresearch has segment-aware state reconstruction. AGR trusts the agent to manage TSV correctly.

4. **Stuck detection**: AGR has an explicit 5-discard threshold with escalation protocol. pi-autoresearch and autoresearch-opencode rely on "think longer when stuck" skill instructions.

5. **Pause mechanism**: autoresearch-opencode has explicit `.autoresearch-off` sentinel. pi-autoresearch has no pause (Ctrl+C only). AGR has no pause (kill the bash loop).

6. **Development velocity**: pi-autoresearch is most active (10+ commits today). AGR is stable (no changes since 2026-03-16). autoresearch-opencode is least active (last commit 2026-03-14).

### Patterns Relevant to sk-deep-research

For adapting these patterns to deep research (non-optimization, knowledge-convergence tasks):

| Autoresearch Pattern | Deep Research Adaptation |
|---|---|
| JSONL experiment log | JSONL iteration log (already in sk-deep-research) |
| STRATEGY.md | strategy.md (already in sk-deep-research) |
| Keep/discard/crash | Converging/diverging/error tiers |
| Stuck detection (5 discards) | Plateau detection (N iterations without convergence gain) |
| Exhausted Approaches | Explored-and-closed research branches |
| Ideas backlog | Open questions / unexplored angles |
| Sentinel pause | Could adopt `.autoresearch-off` pattern for `.deep-research-off` |
| Data integrity protocol | Valuable for long research sessions (atomic writes, validation) |
| Variance-aware acceptance | Confidence-interval-aware convergence scoring |
| Supervisor pattern | Human review between research phases |
