---
description: "Evaluate and improve any agent across 5 integration-aware dimensions with proposal-first candidates, deterministic scoring, and guarded promotion — supports :auto and :confirm modes"
argument-hint: "<agent_path> [:auto|:confirm] [--spec-folder=PATH] [--iterations=N]"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task
---

> **EXECUTION PROTOCOL — READ FIRST**
>
> This command runs a structured workflow. Do NOT dispatch agents from this document.
>
> **YOUR FIRST ACTION:**
> 1. Run Phase 0: @general agent self-verification (below)
> 2. Run Setup Phase: consolidated prompt to gather inputs
> 3. Determine execution mode from user input (`:auto` or `:confirm`)
> 4. Load matching YAML workflow and execute
>
> This command is **general-agent based** and does **not** require `@write`.

---

# 🚨 PHASE 0: @GENERAL AGENT VERIFICATION

**STATUS: ☐ BLOCKED**

```
EXECUTE THIS AUTOMATIC SELF-CHECK (NOT A USER QUESTION):

SELF-CHECK: Are you operating as the @general agent?
│
├─ INDICATORS that you ARE @general agent:
│   ├─ You were invoked without @write-only constraints
│   ├─ You can orchestrate Read/Write/Edit/Bash workflow execution
│   ├─ You can load skill references and execute defined logic
│
├─ IF YES (all indicators present):
│   └─ general_agent_verified = TRUE → Continue to Setup Phase
│
└─ IF NO or UNCERTAIN:
    │
    ├─ ⛔ HARD BLOCK - DO NOT PROCEED
    │
    ├─ DISPLAY to user:
    │   ┌────────────────────────────────────────────────────────────┐
    │   │ ⛔ GENERAL AGENT REQUIRED                                  │
    │   │                                                            │
    │   │ This command orchestrates sk-improve-agent skill          │
    │   │ invocation and does not require @write routing.            │
    │   │                                                            │
    │   │ To proceed, restart with:                                  │
    │   │   /improve:agent [arguments]                               │
    │   └────────────────────────────────────────────────────────────┘
    │
    └─ RETURN: STATUS=FAIL ERROR="General agent required"
```

**Phase Output:**
- `general_agent_verified = ________________`

---

# 🔒 UNIFIED SETUP PHASE

**STATUS: ☐ BLOCKED**

**🚨 SINGLE CONSOLIDATED PROMPT - ONE USER INTERACTION**

This workflow uses a SINGLE consolidated prompt to gather ALL required inputs in ONE user interaction.

**Round-trip optimization:** This workflow requires only 1 user interaction for setup.

```
EXECUTE THIS SINGLE CONSOLIDATED PROMPT:

1. CHECK for mode suffix in $ARGUMENTS or command invocation:
   ├─ ":auto" suffix detected → execution_mode = "AUTONOMOUS" (pre-set, omit Q2)
   ├─ ":confirm" suffix detected → execution_mode = "INTERACTIVE" (pre-set, omit Q2)
   └─ No suffix → execution_mode = "ASK" (include Q2 in prompt)

2. CHECK if $ARGUMENTS contains an agent path:
   ├─ IF present (.opencode/agent/*.md) → target_path = detected value, omit Q0
   └─ IF missing → include Q0 in prompt

3. CHECK for --spec-folder flag:
   ├─ IF present → spec_folder = value, omit Q1
   └─ IF missing → include Q1 in prompt

4. CHECK for --iterations flag:
   ├─ IF present → max_iterations = value
   └─ IF missing → max_iterations = 5 (default)

5. List available agents for Q0:
   $ ls .opencode/agent/*.md

6. List recent spec folders for Q1:
   $ ls -d specs/*/ 2>/dev/null | tail -10

7. ASK user with SINGLE consolidated prompt (include only applicable questions):

   ┌────────────────────────────────────────────────────────────────┐
   │ **Before proceeding, please answer:**                          │
   │                                                                │
   │ **Q0. Target Agent** (if not provided in command):             │
   │    Which agent would you like to evaluate and improve?         │
   │    [list agents found above]                                   │
   │                                                                │
   │ **Q1. Spec Folder** (if no --spec-folder flag):                 │
   │    A) Use existing spec folder: [list if found]                │
   │    B) Create new spec folder                                   │
   │    C) Use temporary directory                                  │
   │                                                                │
   │ **Q2. Execution Mode** (if no :auto/:confirm suffix):            │
   │    A) Autonomous — run loop without approval gates             │
   │    B) Interactive — confirm at each iteration                   │
   │                                                                │
   │ **Q3. Scoring Mode**:                                          │
   │    A) Dynamic — 5-dimension integration-aware (any agent)      │
   │    B) Static — legacy profile (handover/context-prime only)     │
   │                                                                │
   │ Reply format: "handover, A, A, A" or                           │
   │ ".opencode/agent/debug.md, B, B, A"                            │
   └────────────────────────────────────────────────────────────────┘

8. WAIT for user response (DO NOT PROCEED)

9. Parse response and store ALL results:
   - target_path = [from Q0 or $ARGUMENTS]
   - target_profile = [derived: handover, context-prime, or dynamic]
   - spec_folder = [from Q1 or --spec-folder]
   - execution_mode = [AUTONOMOUS/INTERACTIVE from suffix or Q2]
   - scoring_mode = [dynamic/static from Q3]
   - max_iterations = [from --iterations or default 5]

10. SET STATUS: ✅ PASSED

**STOP HERE** - Wait for user to answer ALL applicable questions before continuing.

⛔ HARD STOP: DO NOT proceed until user explicitly answers
⛔ NEVER infer target agent from context, screenshots, or conversation history
⛔ NEVER auto-select spec folder without user confirmation
⛔ NEVER split these questions into multiple prompts
⛔ NEVER assume what the user wants based on open files or recent activity
```

**Phase Output:**
- `general_agent_verified = ________________`
- `target_path = ________________`
- `target_profile = ________________`
- `spec_folder = ________________`
- `execution_mode = ________________`
- `scoring_mode = ________________`
- `max_iterations = ________________`

---

## PHASE STATUS VERIFICATION (BLOCKING)

**Before continuing to the workflow, verify ALL values are set:**

| FIELD                  | REQUIRED      | YOUR VALUE | SOURCE                  |
| ---------------------- | ------------- | ---------- | ----------------------- |
| general_agent_verified | ✅ Yes         | ______     | Automatic check         |
| target_path            | ✅ Yes         | ______     | Q0 or $ARGUMENTS        |
| target_profile         | ✅ Yes         | ______     | Derived from target     |
| spec_folder            | ✅ Yes         | ______     | Q1 or --spec-folder     |
| execution_mode         | ✅ Yes         | ______     | Suffix or Q2            |
| scoring_mode           | ✅ Yes         | ______     | Q3                      |
| max_iterations         | ✅ Yes         | ______     | --iterations or 5       |

```
VERIFICATION CHECK:
├─ ALL required fields have values?
│   ├─ YES → Proceed to "INSTRUCTIONS" section below
│   └─ NO  → Re-prompt for missing values only
```

---

## CONSTRAINTS

- **DO NOT** dispatch any agent from this document
- **DO NOT** infer target agent from context, screenshots, or conversation history
- **DO NOT** start the loop without all setup values resolved
- **FIRST ACTION** is always: run Phase 0, run Setup, then load YAML workflow

---

# Improve Agent

Evaluate and improve any agent across 5 integration-aware dimensions. The skill scans all surfaces the agent touches, derives a scoring profile from the agent's own rules, writes packet-local candidates, scores them deterministically, and only allows promotion when evidence and approval gates are satisfied.

---

## 1. PURPOSE

Run a bounded evaluator-first loop that:
1. Scans the target agent's full integration surface (mirrors, commands, YAML workflows, skills)
2. Generates a dynamic scoring profile from the agent's own ALWAYS/NEVER/ESCALATE IF rules
3. Proposes packet-local candidates without mutating the canonical target
4. Scores candidates across 5 weighted dimensions (structural, ruleCoherence, integration, outputQuality, systemFitness)
5. Runs fixture benchmarks against target-specific test sets
6. Reduces evidence into a dimensional dashboard with plateau detection
7. Stops when improvement plateaus, max iterations reached, or operator decides

---

## 2. CONTRACT

**Inputs:** `$ARGUMENTS` — agent path, optional mode suffix, optional spec folder, optional iteration count
**Outputs:** improvement packet state under `{spec_folder}/improvement/` + `STATUS=<OK|FAIL|CANCELLED>`

### User Input

```text
$ARGUMENTS
```

---

## 3. 5-DIMENSION REFERENCE

| Dimension | Weight | What It Measures |
| --- | --- | --- |
| Structural Integrity | 0.20 | Agent template compliance (required sections) |
| Rule Coherence | 0.25 | ALWAYS/NEVER rules align with workflow steps |
| Integration Consistency | 0.25 | Mirrors in sync, commands reference agent, skills reference agent |
| Output Quality | 0.15 | Output verification items present, no placeholder content |
| System Fitness | 0.15 | Permission-capability alignment, resource references valid |

### Scoring Modes

| Mode | Flag | Profiles | Use When |
| --- | --- | --- | --- |
| Dynamic | `--dynamic` | Any agent (generated on-the-fly) | Evaluating arbitrary agents, integration health checks |
| Static | `--profile=ID` | handover, context-prime (hardcoded) | Promotion workflows with static fixture sets |

---

## 4. WORKFLOW STEPS

### Step 1: Load sk-improve-agent Skill

```
Read(".opencode/skill/sk-improve-agent/SKILL.md")
```

### Step 2: Run Integration Scan

```bash
node .opencode/skill/sk-improve-agent/scripts/scan-integration.cjs --agent={agent_name} --output={spec_folder}/improvement/integration-report.json
```

Review the integration report: mirror sync status, command coverage, skill references.

### Step 3: Generate or Load Profile

**Dynamic mode (scoring_mode = dynamic):**
```bash
node .opencode/skill/sk-improve-agent/scripts/generate-profile.cjs --agent={target_path} --output={spec_folder}/improvement/dynamic-profile.json
```

**Static mode (scoring_mode = static):**
Load profile from `.opencode/skill/sk-improve-agent/assets/target-profiles/{target_profile}.json`

### Step 4: Initialize Runtime

Create the improvement directory structure and copy templates:
```bash
mkdir -p {spec_folder}/improvement/candidates {spec_folder}/improvement/benchmark-runs/{target_profile}
```
Copy config, strategy, charter, and manifest from skill assets into runtime root.

### Step 5: Execute Loop

Load the matching YAML workflow based on execution mode:
- **AUTONOMOUS** -> `assets/improve_agent-improver_auto.yaml`
- **INTERACTIVE** -> `assets/improve_agent-improver_confirm.yaml`

Execute the YAML workflow step by step. Each iteration:
1. Scan integration surfaces (refresh)
2. Dispatch `@agent-improver` to write one bounded candidate
3. Score candidate (dynamic 5D or static profile)
4. Run benchmark fixtures
5. Append results to JSONL ledger
6. Reduce state, refresh dashboard
7. Check stop conditions (plateau, max iterations, infra failure)

### Step 6: Review Results

After loop exits, present:
- `{spec_folder}/improvement/agent-improvement-dashboard.md` — dimensional progress + stop status
- `{spec_folder}/improvement/experiment-registry.json` — per-profile metrics + best-known state
- Recommendation: continue, promote (if eligible), or stop

### Step 6B: Journal Emission (Phase 005)

At each journal boundary, the orchestrator MUST emit events via `improvement-journal.cjs`. The CLI entrypoint accepts `--emit`, `--journal`, and `--details`:

```bash
# At session start:
node .opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs --emit session_start --journal specs/042/008/improvement/improvement-journal.jsonl --details '{"sessionId":"imp-2026-04-11T12-00-00Z","target":"deep-research","charter":"...","startedAt":"2026-04-11T12:00:00Z"}'

# At iteration boundaries:
# candidate_generated after the candidate is written
# candidate_scored after scoring completes
# gate_evaluation after stop-check or operator-gate evaluation
# The CLI form carries boundary metadata inside details because the helper's CLI does not expose top-level iteration/candidate fields.

# At session end:
# node .opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs --emit session_end --journal {spec_folder}/improvement/improvement-journal.jsonl --details '{"stopReason":"blockedStop","sessionOutcome":"advisoryOnly","endedAt":"2026-04-11T12:05:00Z","totalIterations":3}'
```

### Step 6C: Stop-Reason Reporting (Phase 005)

After loop exits, classify the termination:

**stopReason** (WHY):
- `converged` — All legal-stop gate bundles passed
- `maxIterationsReached` — Hit `max_iterations` limit
- `blockedStop` — Convergence math triggered but gate bundles failed
- `manualStop` — User cancelled
- `error` — Script or infra failure
- `stuckRecovery` — Stuck detection triggered and recovery exhausted

**sessionOutcome** (WHAT):
- `keptBaseline` — Baseline retained
- `promoted` — Candidate promoted to canonical target
- `rolledBack` — Promotion reversed
- `advisoryOnly` — Assessment only, no mutation

### Step 6D: Resume Semantics (Phase 005)

When `--session-id=<prior-id>` is provided:

1. Read the prior journal from `{spec_folder}/improvement/improvement-journal.jsonl`
2. Replay journal state to determine `continuedFromIteration`
3. Resume the iteration counter from that point
4. Do NOT repeat already-completed iterations

Supported lineage modes: `new`. sk-improve-agent is one-session-only in the current release — every invocation starts a fresh session with generation 1. `resume`, `restart`, `fork`, and `completed-continue` were described in earlier drafts but have no runtime wiring; see `.opencode/skill/sk-improve-agent/SKILL.md §Resume/Continuation Semantics (current release)` for the full retraction.

### Step 7: Return Status

- Completed normally: `STATUS=OK ITERATIONS={N} BEST_SCORE={score}`
- User cancelled: `STATUS=CANCELLED`
- Max iterations: `STATUS=OK REASON="max_iterations_reached"`
- Plateau: `STATUS=OK REASON="all_dimensions_plateaued"`
- Error: `STATUS=FAIL ERROR="{message}"`

---

## 5. EXAMPLES

### Evaluate Handover Agent (Static Profile, Interactive)

```
/improve:agent ".opencode/agent/handover.md" :confirm --spec-folder=specs/041/008
```

### Evaluate Any Agent (Dynamic Profile, Autonomous)

```
/improve:agent ".opencode/agent/debug.md" :auto --iterations=3
```

### Quick Integration Health Check

```
/improve:agent ".opencode/agent/review.md" :auto --iterations=1
```

### Prompt for Target Selection

```
/improve:agent :confirm
```
Setup phase lists available agents and asks for selection.

---

## 6. EXAMPLE OUTPUT

```
Agent Improvement Loop Complete
────────────────────────────────

Target: .opencode/agent/handover.md
Profile: handover (static)
Scoring: 5-dimension dynamic
Iterations: 3

Dimensional Scores (final):
  Structural:    100 (best: 100, trend: ->)
  Rule Coherence: 95 (best: 95, trend: ->)
  Integration:   100 (best: 100, trend: ->)
  Output Quality:  90 (best: 95, trend: down)
  System Fitness: 100 (best: 100, trend: ->)

Weighted Score: 97/100
Stop Reason: All dimensions plateaued after 3 iterations

Artifacts:
  Dashboard: specs/041/008/improvement/agent-improvement-dashboard.md
  Registry:  specs/041/008/improvement/experiment-registry.json
  Candidates: 3 written to specs/041/008/improvement/candidates/

STATUS=OK ITERATIONS=3 BEST_SCORE=97 REASON="all_dimensions_plateaued"
```

---

## 7. NOTES

- **Skill dependency**: Requires `sk-improve-agent` at `.opencode/skill/sk-improve-agent/`
- **Promotion**: Only handover target with static profile is promotion-eligible. Dynamic profiles produce assessment only.
- **Scoring**: All 5 dimensions are deterministic (regex, string matching, file existence). No LLM-as-judge.
- **Stop rules**: Loop stops on dimension plateau (3+ identical scores), max iterations, or infra failure threshold.
- **Runtime parity**: Agent exists across 4 runtimes (.opencode, .claude, .codex, .agents). Scanner checks all.

---

## 8. RELATED COMMANDS

| Command | Purpose |
| --- | --- |
| `/spec_kit:complete` | Full spec-driven development workflow |
| `/spec_kit:handover` | Create session handover for continuing work |
| `/improve:prompt` | Improve AI prompts with DEPTH + CLEAR scoring |
| `/spec_kit:deep-review` | Iterative code review with convergence detection |

---

## 9. VIOLATION SELF-DETECTION (BLOCKING)

**YOU ARE IN VIOLATION IF YOU:**

**Phase Violations:**
- Executed workflow without @general agent verification
- Started executing steps before all Setup Phase fields are set
- Asked questions in MULTIPLE separate prompts instead of ONE consolidated prompt
- Inferred target agent from context, screenshots, or conversation history
- Auto-selected spec folder without user confirmation

**Workflow Violations (Steps 1-7):**
- Skipped integration scan before candidate generation
- Loaded wrong YAML workflow for execution mode
- Dispatched agents from this markdown command body (YAML owns loop execution)
- Promoted a non-eligible target (only handover with static profile can promote)
- Modified canonical agent file directly instead of writing packet-local candidate

**VIOLATION RECOVERY PROTOCOL:**
```
FOR PHASE VIOLATIONS:
1. STOP immediately
2. STATE: "I [specific violation]. Correcting now."
3. PRESENT the single consolidated prompt with ALL applicable questions
4. WAIT for user response
5. RESUME only after all fields are set

FOR WORKFLOW VIOLATIONS:
1. STOP immediately
2. STATE: "I skipped STEP [X] by [specific action]. Correcting now."
3. RETURN to the skipped step
4. COMPLETE all activities for that step
5. CONTINUE to next step in sequence
```

**If ANY violation:** STOP -> State violation -> Return to correct step -> Complete properly
