# Iteration 010: autoresearch-opencode Source Code Deep Dive

## Focus
Code-level analysis of autoresearch-opencode's shell scripts, plugin, JSONL data, worklog, and dashboard

## Key Findings

### Finding 1: Plugin Context Injection is Static String, Not Dynamic
[SOURCE: plugins/autoresearch-context.ts]

The plugin is surprisingly simple -- it injects a hardcoded static string, NOT dynamically assembled context:

```typescript
export const autoresearchContext: Plugin = {
  name: "autoresearch-context",
  description: "...",
  events: {
    "tui.prompt.append": async (_event, ctx) => {
      if (checkSentinelFile()) return;    // .autoresearch-off exists → skip
      if (!checkCommandFile()) return;    // autoresearch.md missing → skip
      ctx.context.append(CONTEXT_INJECTION);  // Static string
    }
  }
}
```

The `CONTEXT_INJECTION` constant is a static string containing autoresearch mode instructions. It does NOT:
- Read the current JSONL state
- Summarize the worklog
- Extract metrics from results
- Provide iteration count or progress

The plugin merely checks two files exist (`autoresearch.md` present, `.autoresearch-off` absent) then injects fixed instructions telling the agent to operate in autoresearch mode.

**Reusability**: This is simpler than described in Round 1's architectural analysis. The "rich context injection" we attributed to this repo is actually just a static prompt -- the agent reads state files itself during execution. Our Compact State Summary proposal (P3.2) would be MORE sophisticated than anything in this repo.

### Finding 2: autoresearch.sh is a Benchmark Harness, Not a Loop Script
[SOURCE: autoresearch.sh]

The shell script is NOT a Claude invocation loop. It runs the benchmark directly:

```bash
#!/bin/bash
set -euo pipefail
for ((i = 1; i <= NUM_ITERATIONS; i++)); do
    timeout ${TIMEOUT_PER_ITERATION}s python3 bogo_sort_optimized.py 2>&1
done
```

This runs `bogo_sort_optimized.py` with a 2-second timeout per iteration, 10 iterations total. It accumulates runtime and shuffle count metrics. There is no `claude` invocation -- the agent invokes this script as a benchmark tool, similar to AGR's benchmark.py.

**Key detail**: `set -euo pipefail` is used here (unlike AGR's loop script which has no error handling). Timeout handling captures the timeout as a special case with `RUNTIME=$TIMEOUT_PER_ITERATION`.

### Finding 3: Real JSONL Execution Data Reveals Schema
[SOURCE: autoresearch.jsonl]

Actual JSONL records from a completed session:

**Config record**: `{"type":"config","name":"bogo-sort-optimize","metricName":"runtime","metricUnit":"s","bestDirection":"lower"}`

**Experiment records**: `{"run":N,"commit":"hash","metric":float,"metrics":{"runtime":X,"shuffle_count":Y},"status":"keep"|"discard","description":"approach name","timestamp":epoch,"segment":0}`

Schema observations:
- `segment: 0` on all records -- this session never re-initialized
- `metrics` contains nested secondary metrics (runtime + shuffle_count)
- `commit` can be a real git hash or an approach label (e.g., "approach2", "approach5")
- Status values used: "keep" and "discard" only (no "crash" or "checks_failed" in this session)
- Timestamps are Unix epoch integers
- 9 experiment records + 1 config record = 10 lines total

### Finding 4: Worklog Shows Real Convergence Pattern
[SOURCE: worklog.md]

8 experiments over one session with clear convergence behavior:

| Phase | Experiments | Strategy | Outcome |
|-------|------------|----------|---------|
| Linear optimization | 1-3 | Try different comparison operators | 6-22% improvements |
| Micro-optimization | 4-5 | Direct indexing, hybrid heuristics | REGRESSION (slower) |
| Breakthrough | 6 | Bisect binary search | 99.94% improvement |
| Post-breakthrough | 7-8 | Variants on bisect approach | REGRESSION |

**Convergence trajectory**: The system found a major breakthrough (O(n) to O(log n)) at experiment 6, then two follow-up attempts failed to improve further. Success rate: 3/8 kept = 37.5%.

**Key insight for Q13**: Real convergence is non-linear. The biggest improvement came from a paradigm shift (binary search), not incremental optimization. Attempts to refine the breakthrough regressed. This suggests that after a breakthrough, the optimal strategy is to explore a completely different angle rather than refining the current best.

### Finding 5: backup-state.sh is Comprehensive File Backup System
[SOURCE: scripts/backup-state.sh]

Full backup/restore system for 3 files:
- `autoresearch.jsonl`
- `autoresearch-dashboard.md`
- `experiments/worklog.md`

Features:
- `set -euo pipefail` for strict error handling
- Timestamp-based naming: `filename.bak.YYYYMMDD_HHMMSS`
- Max 5 backups per file with automatic rotation (oldest deleted)
- Two restore modes: interactive (user selects) and automatic (latest backup)
- File existence validation before backup/restore
- Backups stored in project root alongside originals

```bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "${SCRIPT_DIR}")"
BACKUP_DIR="${PROJECT_ROOT}"
```

**Reusability**: The backup rotation pattern (max N backups, timestamp-named, auto-cleanup) is a simple but effective state protection mechanism. More practical than our proposed git-commit-per-iteration (P3.3) for lightweight protection.

### Finding 6: Dashboard is Simple Markdown Table
[SOURCE: autoresearch-dashboard.md]

The dashboard is a static markdown file (not dynamically rendered like pi-autoresearch's TUI):

```
# Bogo Sort Optimization Dashboard
Runs: 9 | Kept: 4 | Discarded: 5 | Crashed: 0
Baseline: 15.605s (run #1)
Best: 0.002s (run #7, 99.99% improvement)

| # | Commit | Runtime | Delta | Status | Description |
```

This is written by the agent during `log_experiment`, not by a separate rendering engine. The agent manually formats the markdown table and updates the stats.

### Finding 7: Sentinel File Pause Mechanism
[SOURCE: plugins/autoresearch-context.ts:checkSentinelFile]

The pause mechanism is a simple file existence check:

```typescript
function checkSentinelFile(): boolean {
  return fs.existsSync('.autoresearch-off');
}
```

If `.autoresearch-off` exists, the plugin skips context injection, effectively disabling autoresearch mode. To resume, delete the file. No lock file, no PID, no signal -- just a file presence check.

**Reusability**: Simple but effective for user-initiated pause. Our system could adopt a similar `research/.deep-research-pause` sentinel for manual intervention during long-running research sessions.

### Finding 8: Command File (autoresearch.md) is the Skill Definition
[SOURCE: commands/autoresearch.md (2,928 bytes) + autoresearch.md (1,522 bytes)]

Two separate files serve different purposes:
- `autoresearch.md` (root): Skill/instruction definition loaded by the plugin. Contains optimization target, permitted files, constraints.
- `commands/autoresearch.md`: Command definition for the OpenCode framework. Likely contains invocation instructions.

The root `autoresearch.md` defines:
- Primary objective: minimize bogo_sort runtime
- Two-tier metric: runtime (primary) + shuffle_count (secondary)
- Permitted modifications: only experiment/runner/metrics/reporter scripts
- Off-limits: original bogo_sort implementation
- No explicit convergence criteria ("empty initially -- will be updated")

### Finding 9: Experiment Directory Structure
[SOURCE: repo structure analysis]

The repo has a clear separation:
```
/
  autoresearch.sh          # Benchmark harness
  autoresearch.md          # Skill definition
  autoresearch.jsonl       # State log
  autoresearch-dashboard.md # Status display
  worklog.md               # Narrative experiment log
  bogo_sort.py             # Original (immutable)
  bogo_sort_optimized.py   # Agent's optimization target
  plugins/                 # Context injection
  scripts/                 # backup, install, uninstall
  commands/                # CLI command definitions
  docs/                    # Usage guides
  experiments/             # Experiment artifacts
```

No `src/` directory despite the autoresearch.md referencing `src/experiment.py`, `src/runner.py`, etc. -- suggesting the skill definition is aspirational/template, not matching the actual implementation.

### Finding 10: install.sh and uninstall.sh for Framework Setup
[SOURCE: scripts/ directory listing -- install.sh (9,926 bytes), uninstall.sh (6,696 bytes)]

The presence of install/uninstall scripts (10KB + 7KB) suggests a non-trivial setup process. These likely configure the OpenCode framework integration (plugin registration, command registration, skill registration) and handle dependency management.

## Decision Logic Map
autoresearch-opencode delegates ALL decision logic to the agent. The "skill" provides:
1. What to optimize (bogo_sort runtime)
2. What files can be changed
3. What the benchmark script is

The agent decides:
- When to try a new approach
- Whether to keep or discard
- What to try next
- When to stop (no automated convergence)

This is the most "hands-off" implementation of the three repos.

## Script Implementations

| Script | Size | Purpose | Key Feature |
|--------|------|---------|-------------|
| autoresearch.sh | 1,288 bytes | Benchmark harness | `set -euo pipefail`, timeout per iteration |
| backup-state.sh | 11,624 bytes | State backup/restore | 5-backup rotation, interactive + auto restore |
| install.sh | 9,926 bytes | Framework setup | Plugin + command + skill registration |
| uninstall.sh | 6,696 bytes | Framework teardown | Clean removal of all components |

## Plugin Architecture

Minimal -- single event handler, static string injection, two file existence checks:

```
Event: tui.prompt.append
  → Check: .autoresearch-off exists? → SKIP
  → Check: autoresearch.md exists? → SKIP if missing
  → Action: Append static CONTEXT_INJECTION string
```

No dynamic state reading, no metrics computation, no history summarization.

## Assessment
- Questions addressed: Q11, Q13, Q15
- Questions answered: Q13 (partially -- real execution data analyzed), Q11 (partially -- limited reusable code patterns)
- newInfoRatio: 0.70
- Key insight: autoresearch-opencode is significantly simpler than Round 1 suggested. The "plugin-based context injection" is a static string, not dynamic state assembly. The real value is in the worklog showing a non-linear convergence pattern (breakthrough at experiment 6 after 5 incremental attempts).

## Recommended Next Focus
Community issues/PRs to understand real-world pain points that these implementations fail to address.
