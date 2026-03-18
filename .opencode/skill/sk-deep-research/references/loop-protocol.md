# Loop Protocol Reference

Canonical specification for the deep research loop lifecycle.

---

## 1. OVERVIEW

The deep research loop has 4 phases: initialization, iteration (repeated), synthesis, and save. The YAML workflow manages the lifecycle; the @deep-research agent executes individual iterations.

```
┌──────────┐     ┌──────────────────────────┐     ┌──────────────┐     ┌──────────┐
│  INIT    │────>│  LOOP                    │────>│  SYNTHESIS   │────>│  SAVE    │
│          │     │  ┌────────────────────┐  │     │              │     │          │
│ Config   │     │  │ Read State         │  │     │ Final        │     │ Memory   │
│ Strategy │     │  │ Check Convergence  │  │     │ research.md  │     │ Context  │
│ State    │     │  │ Dispatch Agent     │  │     │ compilation  │     │ Save     │
│          │     │  │ Evaluate Results   │  │     │              │     │          │
│          │     │  │ Loop Decision      │  │     │              │     │          │
│          │     │  └────────┬───────────┘  │     │              │     │          │
│          │     │           │ repeat       │     │              │     │          │
└──────────┘     └──────────────────────────┘     └──────────────┘     └──────────┘
```

---

## 2. PHASE: INITIALIZATION

### Purpose
Set up all state files for a new research session.

### Steps

1. **Create spec folder** (if needed): `mkdir -p {spec_folder}/scratch`
2. **Write config**: `scratch/deep-research-config.json` from template + user parameters
3. **Initialize state log**: First line of `scratch/deep-research-state.jsonl` with config record
4. **Initialize strategy**: `scratch/deep-research-strategy.md` from template with:
   - Topic from user input
   - Initial key questions (3-5, from topic analysis)
   - Known context from `memory_context()` results (if any)
   - Research boundaries from config
5. **Check for existing state** (auto-resume): If JSONL already exists, count iterations and resume from last

### Outputs
- `scratch/deep-research-config.json`
- `scratch/deep-research-state.jsonl` (1 line)
- `scratch/deep-research-strategy.md`

### Auto-Resume Protocol
If state files already exist from a prior session:
1. Read JSONL, count iteration records
2. Read strategy.md for current state
3. Set iteration counter to last completed + 1
4. Log resume event to JSONL: `{"type":"event","event":"resumed","fromIteration":N}`
5. Continue loop from step_read_state

---

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

#### Step 3: Dispatch Agent
Dispatch `@deep-research` with explicit context:
```
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

#### Step 4: Evaluate Results
After agent completes:
1. Verify `scratch/iteration-{NNN}.md` was created
2. Verify JSONL was appended with iteration record
3. Verify strategy.md was updated
4. Extract `newInfoRatio` from JSONL record
5. Track stuck count (increment if newInfoRatio < 0.05, reset otherwise)

#### Step 5: Loop Decision
- If convergence check returns STOP: exit to synthesis
- If STUCK_RECOVERY: modify focus directive, reset stuck count, continue
- Otherwise: increment iteration counter, go to Step 1

### Stuck Recovery Protocol
When 3 consecutive iterations show no progress:
1. Read strategy.md "What Worked" section
2. Identify least-explored question from "Key Questions"
3. Set next focus to: "RECOVERY: Widen scope to {least-explored-area}. Try a fundamentally different approach."
4. Reset stuck counter
5. If recovery iteration also shows no progress: exit to synthesis with gaps documented

---

## 4. PHASE: SYNTHESIS

### Purpose
Compile all iteration findings into final research.md.

### Steps

1. **Read all iteration files**: `scratch/iteration-*.md`
2. **Read strategy.md**: Final state of questions, approaches
3. **Compile research.md**: Merge findings into 17-section format
   - Deduplicate overlapping findings
   - Organize by section topic
   - Add citations from iteration files
   - Note unanswered questions in Section 12 (Open Questions)
4. **Update config status**: Set `status: "complete"` in config.json
5. **Final JSONL entry**: `{"type":"event","event":"synthesis_complete","totalIterations":N,"answeredRatio":0.85}`

### Progressive vs Final Synthesis
- If `progressive_synthesis: true` (default): research.md was updated each iteration. Final synthesis is a cleanup pass.
- If `progressive_synthesis: false`: research.md is created from scratch during synthesis.

---

## 5. PHASE: SAVE

### Purpose
Preserve research context to memory system.

### Steps

1. **Generate context**: `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js {spec_folder}`
2. **Index for MCP visibility**: `memory_index_scan({ specFolder: "{spec_folder_name}" })` or `memory_save()`
3. **Verify**: Confirm memory/*.md file created with proper anchors

---

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

## 7. ERROR HANDLING

| Error | Phase | Action |
|-------|-------|--------|
| Agent dispatch timeout | Loop | Retry once with reduced scope. If second timeout, mark iteration as "timeout" and continue |
| WebFetch fails | Loop | Log URL in iteration file, try alternative source, continue with available data |
| State file missing | Init/Loop | If JSONL missing: re-initialize. If strategy missing: reconstruct from JSONL |
| JSONL malformed | Loop | Skip malformed lines, reconstruct from valid entries |
| 3+ consecutive failures | Loop | Halt loop, enter synthesis with partial findings |
| Memory save fails | Save | Save to scratch/ as backup, log error |

---

## 8. CONFIRM MODE ADDITIONS

In confirm mode, the YAML workflow adds approval gates:

| Gate Location | Behavior |
|---------------|----------|
| After initialization | Show config and initial strategy. Wait for approval |
| After each iteration | Show iteration findings and convergence status. Options: Continue, Adjust Focus, Stop |
| Before synthesis | Show summary of all iterations. Wait for approval to synthesize |
| After synthesis | Show final research.md summary. Approve or request revisions |
