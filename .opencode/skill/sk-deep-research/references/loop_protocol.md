---
title: Loop Protocol Reference
description: Canonical specification for the deep research loop lifecycle with 4 phases, reference-only wave orchestration, and error handling.
---

# Loop Protocol Reference

Canonical specification for the deep research loop lifecycle.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

The deep research loop has 4 phases: initialization, iteration (repeated), synthesis, and save. The YAML workflow manages the lifecycle; the @deep-research agent executes individual iterations.

```
┌──────────┐     ┌──────────────────────────┐     ┌──────────────┐     ┌──────────┐
│  INIT    │────>│  LOOP                    │────>│  SYNTHESIS   │────>│  SAVE    │
│          │     │  ┌────────────────────┐  │     │              │     │          │
│ Config    │     │  │ Read State         │  │     │ Final        │     │ Memory   │
│ Strategy │     │  │ Check Convergence  │  │     │ research.md  │     │ Context  │
│ State    │     │  │ Dispatch Agent     │  │     │ compilation  │     │ Save     │
│          │     │  │ Evaluate Results   │  │     │              │     │          │
│          │     │  │ Loop Decision      │  │     │              │     │          │
│          │     │  └────────┬───────────┘  │     │              │     │          │
│          │     │           │ repeat       │     │              │     │          │
└──────────┘     └──────────────────────────┘     └──────────────┘     └──────────┘
```

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:phase-initialization -->
## 2. PHASE: INITIALIZATION

### Purpose
Set up all state files for a new research session.

### Steps

1. **Classify session state before writing**:
   - `fresh`: no config/state/strategy files exist
   - `resume`: config + state + strategy all exist and agree
   - `completed-session`: consistent prior state with `config.status == "complete"`
   - `invalid-state`: partial or contradictory artifacts
2. **Create spec folder** (if needed): `mkdir -p {spec_folder}/scratch`
3. **Write config**: `scratch/deep-research-config.json` from template + user parameters
4. **Initialize state log**: First line of `scratch/deep-research-state.jsonl` with config record
5. **Initialize strategy**: `scratch/deep-research-strategy.md` from template with:
   - Topic from user input
   - Initial key questions (3-5, from topic analysis)
   - Known context from `memory_context()` results (if any), injected only after the strategy file exists
   - Research boundaries from config
5a. **Validate Research Charter**:
   - Verify strategy.md contains a "Non-Goals" section (may be empty but must exist)
   - Verify strategy.md contains a "Stop Conditions" section (may be empty but must exist)
   - If either section is missing, append it as an empty placeholder before proceeding
   - In **confirm mode**: present the charter (topic, key questions, non-goals, stop conditions) for user review before proceeding
   - In **auto mode**: accept the charter automatically and continue
6. **Resume only if config, JSONL, and strategy agree**; otherwise halt for repair instead of guessing

### Outputs
- `scratch/deep-research-config.json`
- `scratch/deep-research-state.jsonl` (1 line)
- `scratch/deep-research-strategy.md`

### Auto-Resume Protocol
If state files already exist from a prior session:
1. Verify config, JSONL, and strategy all exist and agree on topic/spec folder
2. Read JSONL, count iteration records
3. Read strategy.md for current state
4. Set iteration counter to last completed + 1
5. Log resume event to JSONL: `{"type":"event","event":"resumed","fromIteration":N}`
6. Continue loop from step_read_state

---

<!-- /ANCHOR:phase-initialization -->
<!-- ANCHOR:phase-iteration-loop -->
## 3. PHASE: ITERATION LOOP

### Loop Steps (repeated until convergence)

#### Step 1: Read State
- Read `deep-research-state.jsonl` -- count iterations, get last newInfoRatio
- Read `deep-research-strategy.md` -- get next focus, remaining questions

#### Step 2: Check Convergence
Run the convergence algorithm (see convergence.md):
- Max iterations reached? STOP
- Stuck count >= threshold? STUCK_RECOVERY
- Average newInfoRatio < threshold? STOP
- All questions answered? STOP
- Otherwise: CONTINUE

#### Step 2c: Quality Guard Check

When the convergence algorithm returns STOP:
1. Run quality guard checks (see convergence.md §2.4)
2. Verify minimum coverage, source diversity, and question resolution thresholds
3. If **all guards pass**: proceed with STOP, exit to synthesis
4. If **any guard fails**: override decision to CONTINUE
   - Log each violation: `{"type":"event","event":"guard_violation","guard":"<name>","iteration":N,"detail":"<reason>"}`
   - Append failed guard details to strategy.md "Active Risks" section
5. The loop continues until BOTH convergence AND quality guards pass simultaneously
6. Guard checks apply only to STOP decisions — CONTINUE and STUCK_RECOVERY bypass this step

#### Step 2a: Check Pause Sentinel

Before dispatching, check for a pause sentinel file:

1. Check if `scratch/.deep-research-pause` exists
2. If present:
   - Log event to JSONL: `{"type":"event","event":"paused","reason":"sentinel file detected"}`
   - Halt the loop with message:
     ```
     Research paused. Delete scratch/.deep-research-pause to resume.
     Current state: Iteration {N}, {remaining} questions remaining.
     ```
   - Do NOT exit to synthesis -- the loop is suspended, not stopped
3. On resume (file deleted and loop restarted):
   - Log event: `{"type":"event","event":"resumed","fromIteration":N}`
   - Continue from step_read_state

**Use case**: In autonomous mode, this provides the only graceful intervention mechanism short of killing the process. Users can create the sentinel file at any time to pause research between iterations.

#### Step 2b: Generate State Summary

Generate a compact state summary (~200 tokens) for injection into the dispatch prompt:

```
STATE SUMMARY (auto-generated):
Segment: {current_segment} | Iteration: {N} of {max}
Questions: {answered}/{total} answered | Last focus: {last_focus}
Last 2 ratios: {ratio_N-1} -> {ratio_N} | Stuck count: {stuck_count}
Recovery: {active_recovery_strategy or "none"}
Next focus: {strategy.nextFocus}
```

This summary is prepended to the dispatch context (Step 3) to ensure the agent has baseline context even if detailed strategy.md reading fails or is incomplete. It serves as a redundant context channel.

#### Step 3: Dispatch Agent
Dispatch `@deep-research` with explicit context:
```
{state_summary}  // Auto-generated (Step 2b)

Research Topic: {config.topic}
Iteration: {N} of {maxIterations}
Focus Area: {strategy.nextFocus}
Remaining Questions: {strategy.remainingQuestions}
Last 3 Iterations Summary: {brief summaries}
State Files:
  - Config: {spec_folder}/scratch/deep-research-config.json
  - State: {spec_folder}/scratch/deep-research-state.jsonl
  - Strategy: {spec_folder}/scratch/deep-research-strategy.md
Output: Write findings to {spec_folder}/scratch/iteration-{NNN}.md
CONSTRAINT: LEAF agent -- do NOT dispatch sub-agents
```

The dispatch context may include a suggested `focusTrack` label (e.g., `"focusTrack": "performance"`, `"focusTrack": "security"`). Agents may tag their iteration with this track label for post-hoc grouping and analysis. Track labels are metadata only — the orchestrator does not use them for loop decisions.

#### Step 3a: Per-Iteration Budget

After dispatch, the orchestrator monitors the running iteration against budget limits:
- **Tool call count**: tracked against `config.maxToolCallsPerIteration` (default: 12)
- **Elapsed time**: tracked against `config.maxMinutesPerIteration` (default: 10)
- If either limit is exceeded and no iteration file has been written yet:
  1. Mark the iteration as `"status": "timeout"` in the JSONL record
  2. Log event: `{"type":"event","event":"iteration_timeout","iteration":N,"reason":"tool_calls|elapsed_time"}`
  3. Continue to the next iteration (do not retry the timed-out iteration)
- Budget limits are soft caps — if the agent is actively writing its iteration file when the limit is reached, allow completion

#### Step 4: Evaluate Results
After agent completes:
1. Verify `scratch/iteration-{NNN}.md` was created
2. Verify JSONL was appended with iteration record
3. Verify strategy.md was updated
4. Extract `newInfoRatio` from JSONL record
5. Track stuck count: skip if `status == "thought"` (no change), reset to 0 if `status == "insight"` (breakthrough counts as progress), increment if `newInfoRatio < config.convergenceThreshold`, reset otherwise

#### Step 4a: Generate Dashboard

After evaluating iteration results, generate a human-readable dashboard:

1. Read JSONL state log (all iteration records) and strategy.md (current state)
2. Generate or regenerate `scratch/deep-research-dashboard.md` with the following sections:
   - **Iteration table**: `| run | focus | newInfoRatio | findings count | status |`
   - **Question status**: `X/Y answered` with itemized list (answered vs remaining)
   - **Trend**: Last 3 newInfoRatio values with direction indicator (ascending, descending, flat)
   - **Dead ends**: Consolidated from all iteration `ruledOut` data
   - **Next focus**: Current value from strategy.md
   - **Active risks**: Guard violations, stuck count, budget warnings
3. Log event: `{"type":"event","event":"dashboard_generated","iteration":N}`
4. The dashboard is **auto-generated only** — never manually edited
5. The dashboard file is overwritten each iteration (not appended)
6. Dashboard generation is non-blocking: if it fails, log a warning and continue the loop

In **confirm mode**, the dashboard is displayed to the user at each iteration approval gate. In **auto mode**, it is written silently for post-hoc review.

#### Step 4b: Checkpoint Commit (REFERENCE-ONLY)

This checkpointing pattern is documented for reference, but current runtimes should not assume it is available.

After each iteration is verified (JSONL appended, iteration file written, strategy updated):

1. **Stage targeted files only** (never `git add -A`):
   ```bash
   git add scratch/iteration-{NNN}.md
   git add scratch/deep-research-state.jsonl
   git add scratch/deep-research-strategy.md
   git add research.md  # if it exists
   ```
2. **Sanitize**: Exclude `.env`, credentials, large binaries from staging
3. **Commit**: `git commit -m "chore(deep-research): iteration {NNN} complete"`
4. **On commit failure**: Log warning and continue (checkpoint is non-blocking)

Checkpoint commits provide rollback points: `git log -- scratch/` shows the last good state for any file. If state corruption occurs, `git checkout HEAD~1 -- scratch/deep-research-state.jsonl` restores the previous version.

#### Step 5: Loop Decision
- If convergence check returns STOP: exit to synthesis
- If STUCK_RECOVERY: modify focus directive, reset stuck count, continue
- Otherwise: increment iteration counter, go to Step 1

### Ideas Backlog Convention

A persistent ideas file at `scratch/research-ideas.md` serves as a parking lot for promising directions not yet pursued.

#### Check Points

The orchestrator checks the ideas backlog at three points:

1. **Init**: During strategy initialization, if `scratch/research-ideas.md` exists from a prior session, read it and incorporate relevant ideas into the initial key questions or "Next Focus"
2. **Stuck**: During stuck recovery (Step 2a of the recovery protocol in convergence.md), check ideas backlog before defaulting to generic recovery strategies. Deferred ideas often provide the best escape from stuck states
3. **Resume**: On auto-resume, read the ideas file alongside JSONL and strategy.md to restore full context

#### Format

```markdown
# Research Ideas

## Deferred (not yet explored)
- [Idea description] (noted iteration N: [why deferred])
- [Idea description] (noted iteration N: [why deferred])

## Promoted (moved to Key Questions)
- [Idea] -> promoted to Key Question in iteration N
```

Users can edit `research-ideas.md` between sessions to steer future iterations. Agents append new ideas during iterations when they encounter promising tangents that fall outside the current focus.

### Stuck Recovery Protocol
When stuckThreshold consecutive iterations show no progress (default: 3, configurable via config.json):

**Step 0: Classify Failure Mode**
Before selecting a recovery strategy, classify why progress stalled:
1. Read the last N iteration files (where N = stuckThreshold) to determine the failure pattern
2. Classify into one of the following modes:
   - `shallow_sources` — iterations find content but lack depth or authoritative sources
   - `contradictory` — iterations return conflicting information without resolution
   - `too_broad` — focus area is too wide, producing scattered low-value findings
   - `repetitive` — iterations keep rediscovering the same information
   - `exhausted` — the topic area has been thoroughly explored with diminishing returns
3. Select a targeted recovery prompt based on the classification (see convergence.md §4 for category-specific strategies)
4. Log classification: `{"type":"event","event":"stuck_classified","mode":"<classification>","iteration":N}`

**Steps 1-5: Execute Recovery**
1. Read strategy.md "What Worked" section
2. Identify least-explored question from "Key Questions"
3. Set next focus to: "RECOVERY: Widen scope to {least-explored-area}. Try a fundamentally different approach." (refined by classification)
4. Reset stuck counter
5. If recovery iteration also shows no progress: exit to synthesis with gaps documented

### Step 3b: Direct Mode Fallback (REFERENCE-ONLY)

When agent dispatch fails after the earlier recovery tiers are exhausted:

1. Detect dispatch failure: Task tool timeout, API overload (529), or agent crash
2. Log event: `{"type":"event","event":"direct_mode","iteration":N,"reason":"dispatch_failure"}`
3. Orchestrator absorbs the iteration work:
   - Read state files (JSONL + strategy.md)
   - Determine focus from strategy "Next Focus"
   - Execute 3-5 research actions directly
   - Write `scratch/iteration-NNN.md`
   - Update strategy.md
   - Append iteration record to JSONL
4. Continue loop normally after direct-mode iteration completes
5. If direct mode also fails, escalate to the final user-escalation tier

**Note**: Direct mode iterations are logged with `"directMode": true` in their JSONL record for diagnostic tracking.

---

<!-- /ANCHOR:phase-iteration-loop -->
<!-- ANCHOR:wave-orchestration-protocol -->
## 3a. WAVE ORCHESTRATION PROTOCOL (REFERENCE-ONLY)

An optional parallel execution mode for research topics with multiple independent questions. Treat this as reference guidance unless the runtime explicitly supports it; the live workflow remains sequential.

### When to Use Waves

- 3+ independent key questions identified during initialization
- Questions do not depend on each other's answers
- Parallelism is beneficial (time-constrained research, broad survey)

### Wave Execution Model

```
Wave 1: Dispatch N agents on independent questions
  |
  +-- Agent A: Question 1 --> iteration-001.md (newInfoRatio: 0.8)
  +-- Agent B: Question 2 --> iteration-002.md (newInfoRatio: 0.3)
  +-- Agent C: Question 3 --> iteration-003.md (newInfoRatio: 0.7)
  |
Scoring: Rank by newInfoRatio, prune below median when wave support is enabled
  |
Wave 2: Follow-up on top-K questions (K = ceil(N/2))
  +-- Agent A: Question 1 follow-up --> iteration-004.md
  +-- Agent C: Question 3 follow-up --> iteration-005.md
  |
Repeat until convergence
```

### Scoring and Pruning

After each wave completes:
1. Rank all wave iterations by `newInfoRatio`
2. Compute wave median: `median([i.newInfoRatio for i in wave_iterations])`
3. **Prune**: Questions with newInfoRatio below median are deprioritized when wave support is enabled
4. **Promote**: Top-K questions (K = ceil(N/2)) get follow-up iterations
5. Pruned questions are moved to the ideas backlog, not discarded

### Breakthrough Detection

When any single iteration in a wave achieves `newInfoRatio > 2x wave_average`:

1. Flag as **breakthrough**: `{"type":"event","event":"breakthrough","iteration":N,"ratio":X.XX}`
2. Generate 2-3 adjacent questions from the breakthrough findings
3. Prioritize these adjacent questions in the next wave
4. Breakthrough iterations are NEVER pruned

### Wave JSONL Records

Wave iterations use standard iteration records with an additional field:
```json
{"type":"iteration","run":N,"wave":1,"status":"complete",...}
```

Wave events:
```json
{"type":"event","event":"wave_complete","wave":1,"iterations":[1,2,3],"medianRatio":0.5}
{"type":"event","event":"breakthrough","wave":1,"iteration":2,"ratio":0.95}
```

### Integration with Sequential Loop

- Waves are an ALTERNATIVE to sequential iteration, not a replacement
- The convergence algorithm applies identically (uses all iteration records)
- Wave mode can transition to sequential mode when questions narrow to 1-2
- Sequential mode can spawn a wave when new independent questions emerge

---

<!-- /ANCHOR:wave-orchestration-protocol -->
<!-- ANCHOR:context-isolation-dispatch -->
## 3b. CONTEXT ISOLATION DISPATCH (EXPERIMENTAL, REFERENCE-ONLY)

An alternative dispatch mechanism that guarantees fresh context per iteration by launching a new OS process. Treat this as reference-only unless the runtime explicitly implements alternate CLI dispatch.

### Motivation

The standard dispatch (Task tool) shares the parent session's token budget. In long research sessions (10+ iterations), this may cause context compression that degrades reasoning quality. Process-level isolation eliminates this risk.

### Dispatch Mechanism

Replace Task tool dispatch with shell-level `claude -p` invocation:

1. **Generate prompt**: Orchestrator builds a self-contained prompt from:
   - Strategy.md (current state)
   - Config.json (parameters)
   - Last N iteration summaries (from JSONL)
   - Compact state summary (Step 2b)
   - Full agent protocol instructions
2. **Write to temp file**: `scratch/.dispatch-prompt-{NNN}.md`
3. **Execute**: `claude -p "$(cat scratch/.dispatch-prompt-{NNN}.md)" --max-turns 50 --output-format json`
4. **Collect output**: Agent writes iteration file directly to disk
5. **Verify**: Orchestrator checks iteration file and JSONL were created
6. **Cleanup**: Remove temp prompt file

### Trade-offs

| Aspect | Task Tool Dispatch | `claude -p` Dispatch |
|--------|-------------------|---------------------|
| Context freshness | Shared budget, may degrade | Guaranteed fresh |
| Token cost | Lower (cached context) | Higher (full context per call) |
| Latency | Lower (in-process) | Higher (new process startup) |
| Context size | Limited by parent budget | Full model context available |
| Error handling | In-process exceptions | Process exit codes |

### When to Use

- Autonomous/unattended research sessions (overnight runs)
- Research past iteration 8+ where context degradation is measurable
- Critical research where reasoning quality must not degrade

**Status**: Reference-only. Track adoption based on need for fully autonomous overnight research sessions.

---

<!-- /ANCHOR:context-isolation-dispatch -->
<!-- ANCHOR:phase-synthesis -->
## 4. PHASE: SYNTHESIS

### Purpose
Compile all iteration findings into final research.md. The synthesis workflow owns the canonical `research.md` output.

### Steps

1. **Read all iteration files**: `scratch/iteration-*.md`
2. **Read strategy.md**: Final state of questions, approaches
3. **Compile research.md**: Merge findings into 17-section format
   - Deduplicate overlapping findings
   - Organize by section topic
   - Add citations from iteration files
   - Note unanswered questions in Section 12 (Open Questions)
   - **Include a mandatory "## Eliminated Alternatives" section** as primary research output:
     - Consolidate all `ruledOut` entries from iteration JSONL records
     - Consolidate all `## Dead Ends` sections from iteration files
     - Format as a table: `| Approach | Reason Eliminated | Evidence | Iteration(s) |`
     - This section documents negative knowledge (what was tried and why it failed)
     - Treat as primary research output — not an appendix or afterthought
     - Place after Section 11 (Recommendations) and before Section 12 (Open Questions)
4. **Update config status**: Set `status: "complete"` in config.json
5. **Final JSONL entry**: `{"type":"event","event":"synthesis_complete","totalIterations":N,"answeredCount":A,"totalQuestions":Q,"stopReason":"converged"}`

### Progressive vs Final Synthesis
- If `progressiveSynthesis: true` (default): research.md was updated each iteration. Final synthesis is a cleanup pass.
- If `progressiveSynthesis: false`: research.md is created from scratch during synthesis.

---

<!-- /ANCHOR:phase-synthesis -->
<!-- ANCHOR:phase-save -->
## 5. PHASE: SAVE

### Purpose
Preserve research context to memory system.

### Steps

1. **Generate context**: `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js {spec_folder}`
2. **No extra indexing step in the live contract**: `generate-context.js` is the supported save boundary for this workflow
3. **Verify**: Confirm memory/*.md file created with proper anchors

---

<!-- /ANCHOR:phase-save -->
<!-- ANCHOR:state-transitions -->
## 6. STATE TRANSITIONS

```
[INITIALIZED] --> config + strategy + state created
    |
[ITERATING] --> agent dispatched, executing research
    |
[EVALUATING] --> iteration complete, checking convergence
    |
    |-- newInfoRatio >= threshold --> [ITERATING]
    |-- stuck_count >= stuckThreshold --> [STUCK_RECOVERY]
    |-- converged or max_iterations --> [SYNTHESIZING]

[STUCK_RECOVERY] --> widen focus, try different approach
    |
    |-- recovered (newInfoRatio > 0) --> [ITERATING]
    |-- still stuck --> [SYNTHESIZING] (gaps documented)

[SYNTHESIZING] --> final research.md compilation
    |
[SAVING] --> memory context preservation
    |
[COMPLETE] --> all artifacts created, loop finished
```

---

<!-- /ANCHOR:state-transitions -->
<!-- ANCHOR:error-handling -->
## 7. ERROR HANDLING

| Error | Phase | Action |
|-------|-------|--------|
| Agent dispatch timeout | Loop | Retry once with reduced scope. If second timeout, mark iteration as "timeout" and continue |
| WebFetch fails | Loop | Log URL in iteration file, try alternative source, continue with available data |
| State file missing | Init/Loop | If JSONL missing: re-initialize. If strategy missing: reconstruct from JSONL |
| JSONL malformed | Loop | Skip malformed lines, reconstruct from valid entries |
| 3+ consecutive failures | Loop | Halt loop, enter synthesis with partial findings |
| Agent dispatch failure (API overload, timeout) | Loop | Escalate through the documented recovery ladder in order. Direct mode fallback is reference-only unless the runtime explicitly supports it. |
| Memory save fails | Save | Save to scratch/ as backup, log error |

### State Recovery Protocol

When state files are missing or corrupted, apply this 5-priority cascade:

| Priority | Condition | Recovery Action |
|----------|-----------|----------------|
| 1 (Primary) | JSONL exists and parseable | Normal operation (with fault-tolerant parsing) |
| 2 (Strategy rebuild) | JSONL exists, strategy.md missing | Reconstruct strategy from JSONL: extract questions, focus areas, newInfoRatio trend. Create minimal strategy.md |
| 3 (JSONL reconstruction) | JSONL missing/corrupt, iteration files exist | Scan `scratch/iteration-*.md`, parse Assessment sections, reconstruct JSONL with `status: "reconstructed"` |
| 4 (Config-only restart) | Only config.json remains | Restart from initialization phase using config parameters. Log: `{"type":"event","event":"fresh_restart","reason":"state_files_missing"}` |
| 5 (Abort) | Config.json also missing | Cannot recover. Report error and halt. |

Each priority level is attempted in order. If a level fails, fall through to the next. See state_format.md for JSONL reconstruction details.

---

<!-- /ANCHOR:error-handling -->
<!-- ANCHOR:confirm-mode-additions -->
## 8. CONFIRM MODE ADDITIONS

In confirm mode, the YAML workflow adds approval gates:

| Gate Location | Behavior |
|---------------|----------|
| After initialization | Show config and initial strategy. Wait for approval |
| After each iteration | Show iteration findings and convergence status. Options: Continue, Adjust Focus, Stop |
| Before synthesis | Show summary of all iterations. Wait for approval to synthesize |
| After synthesis | Show final research.md summary. Approve or request revisions |

<!-- /ANCHOR:confirm-mode-additions -->
