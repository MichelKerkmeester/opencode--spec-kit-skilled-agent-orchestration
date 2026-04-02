---
description: Resume or recover work on an existing spec folder - smart memory recovery, crash breadcrumbs, and one clear next step
argument-hint: "[spec-folder-path] [:auto|:confirm] [--phase-folder=<path>]"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task, memory_context, memory_search, memory_match_triggers, memory_list, memory_stats, memory_delete, memory_update, memory_validate, memory_index_scan, memory_health, checkpoint_create, checkpoint_list, checkpoint_restore, checkpoint_delete, mcp__cocoindex_code__search
---

> ⚠️ **EXECUTION PROTOCOL — READ FIRST**
>
> This command runs a structured YAML workflow. Do NOT dispatch agents from this document.
>
> **YOUR FIRST ACTION:**
> 1. Determine execution mode from user input (`:auto` or `:confirm`)
> 2. Load the corresponding YAML file from `assets/`:
>    - Auto mode → `spec_kit_resume_auto.yaml`
>    - Confirm mode → `spec_kit_resume_confirm.yaml`
> 3. Execute the YAML workflow step by step
>
> All content below defines workflow context for the YAML runner. Treat it as executable only when running this command workflow; otherwise use it as reference.

## CONSTRAINTS

- **DO NOT** dispatch any agent from this document
- **ALL** agent dispatching is handled by the YAML workflow steps — this document is setup + reference only
- **FIRST ACTION** is always: load the YAML file, then execute it step by step

> **Format:** `/spec_kit:resume [spec-folder-path] [:auto|:confirm]`
> Examples: `/spec_kit:resume specs/007-feature/` | `/spec_kit:resume:auto specs/007-feature/`

# SINGLE CONSOLIDATED PROMPT - ONE USER INTERACTION

This workflow gathers ALL inputs in ONE prompt. Mode defaults to INTERACTIVE unless :auto suffix used.

> **Gate 3 Note:** Resume inherently satisfies Gate 3 — it REQUIRES a spec folder (provided or detected).

---

## 0. UNIFIED SETUP PHASE

**FIRST MESSAGE PROTOCOL**: This prompt MUST be your FIRST response. No implementation or file-modifying tool calls before asking. Lightweight read-only discovery is allowed, then ask ALL questions immediately and wait.

**STATUS: BLOCKED**

```
EXECUTE THIS SINGLE CONSOLIDATED PROMPT:

1. CHECK mode suffix:
   ├─ ":auto"    → execution_mode = "AUTONOMOUS"
   ├─ ":confirm" → execution_mode = "INTERACTIVE"
   └─ No suffix  → execution_mode = "INTERACTIVE" (default - safer)

2. CHECK $ARGUMENTS for spec folder path:
   ├─ Has path → validate path exists
   └─ Empty → auto-detect from deterministic filtered candidates

3. Auto-detect if needed:
   - Build candidates from session-learning + known spec roots (`specs/`, `.opencode/specs/`)
   - Normalize aliases, filter archive/test/fixture/scratch, then rank deterministically
   - Low confidence: confirm in interactive mode; non-interactive safely falls through
   - Found → spec_path = extracted, detection_method = "ranked"
   - Not found → detection_method = "none" (include Q0)

3b. CHECK --phase-folder flag OR detect phase parent:
   - IF --phase-folder=<path> provided → auto-resolve spec_path to that child folder
     Set spec_path = <path>, detection_method = "phase-folder"
     Validate path matches pattern: `{specs|.opencode/specs}/[###]-*/[0-9][0-9][0-9]-*/`
   - IF spec_path is a parent phase folder (contains numbered child folders like 001-*, 002-*):
     List child phases with completion status:
       $ ls -d [spec_path]/[0-9][0-9][0-9]-*/ 2>/dev/null
     For each child: check tasks.md completion %, show status (not started / in progress / complete)
     Present phase selection to user so they can choose which phase to resume
   - ELSE → continue normally

4. Check for "CONTINUATION - Attempt" handoff pattern in recent messages:
   - Detected → continuation_detected = TRUE, parse Last/Next
   - Not detected → continuation_detected = FALSE

4b. Check for CONTINUE_SESSION.md crash recovery:
    - Exists in spec folder AND modified <24h → crash_recovery_available = TRUE
    - Parse spec folder, Last, Next values (fallback for unexpected termination)

5. Validate artifacts in spec folder:
   - Check: spec.md, plan.md, tasks.md
   - Store: artifacts_valid = [yes/partial/no]

6. Check memory files:
   - $ ls [spec_path]/memory/*.{md,txt} 2>/dev/null
   - Store: memory_files_exist = [yes/no], memory_count = [N]

7. ASK with SINGLE prompt (include only applicable questions):

   Q0. Spec Folder (if not detected/provided):
     No active session detected. Available spec folders: [list]
     A) List and select  B) Start new with /spec_kit:complete  C) Cancel
     E) Phase folder — resume a specific phase child (e.g., specs/NNN-name/001-phase/)

   Q1. Confirm Detected Session (if auto-detected):
     Detected: [spec_path] (last activity: [date])
     A) Yes, resume  B) Select different folder  C) Cancel

   Q2. Continuation Validation (if handoff pattern with mismatch):
     Handoff claims: Last=[X], Next=[Y] | Memory shows: Last=[A], Next=[B]
     A) Use handoff claims  B) Use memory state  C) Investigate first

   Q3. Missing Artifacts (if artifacts_valid != yes):
     Missing: [list]
     A) Run /spec_kit:plan  B) Select different folder  C) Continue anyway

   Q4. Smart Memory Preference (if memory files exist):
     Found [N] file(s) in [spec_path]/memory/
     A) Fast resume - just enough context to continue safely
     B) Fill missing next step / blockers
     C) Deep context - load up to 3 recent files
     D) Skip extra memory and use artifacts only

   Reply format: "A, A" or "A, A, B"

8. WAIT for user response (DO NOT PROCEED)

9. Parse response and store ALL results:
   - spec_path = [from Q0/Q1 or auto-detected or $ARGUMENTS]
   - detection_method = [provided/recent]
   - execution_mode = [AUTONOMOUS/INTERACTIVE from suffix]
   - continuation_choice = [from Q2, or N/A]
   - artifacts_valid = [yes/partial/no]
   - memory_choice = [A/B/C from Q4, or N/A]

10. Execute background operations:
    - IF memory_choice == A: Recover only the default resume packet
    - IF memory_choice == B: Run targeted gap-filling for next step / blockers
    - IF memory_choice == C: Load up to 3 recent memory files
    - IF memory_choice == D: Use artifacts only
    - Calculate progress from tasks.md/checklist.md

11. SET STATUS: PASSED

STOP HERE - Wait for user answers before continuing.

⛔ DO NOT proceed until user explicitly answers
⛔ NEVER assume spec folder without confirmation when path was invalid
⛔ NEVER split questions into multiple prompts
```

**Phase Output:**
- `spec_path` | `detection_method` | `execution_mode`
- `artifacts_valid` | `memory_loaded`

---

## 2. PHASE STATUS VERIFICATION (BLOCKING)

| FIELD            | REQUIRED      | SOURCE                        |
| ---------------- | ------------- | ----------------------------- |
| spec_path        | Yes           | Q0/Q1 or auto-detect or $ARGS |
| detection_method | Yes           | Auto-determined               |
| execution_mode   | Yes           | Suffix (defaults INTERACTIVE) |
| artifacts_valid  | Yes           | Validation check              |
| memory_loaded    | Conditional   | Q4 (if memory files exist)    |

ALL required fields set? → Proceed to workflow | Missing? → Re-prompt for missing only

---

## 3. VIOLATION SELF-DETECTION (BLOCKING)

**You are in violation if you:** started workflow before fields set, asked questions in multiple prompts, proceeded without validating artifacts, assumed spec folder without confirmation, didn't display progress, claimed "resumed" without continuation options.

**Recovery:** STOP → state violation → present consolidated prompt → WAIT → resume after all fields set.

---

# WORKFLOW EXECUTION

Execute steps IN ORDER. Mark each ✅ ONLY after completing ALL activities and verifying outputs.

---

## 4. AUTO MODE (4 STEPS)

| STEP | NAME               | REQUIRED OUTPUT      | VERIFICATION            |
| ---- | ------------------ | -------------------- | ----------------------- |
| 1    | Session Detection  | spec_path confirmed  | Path validated          |
| 2    | Load Memory        | context_loaded       | Recovery packet loaded  |
| 3    | Calculate Progress | progress_percentages | Tasks/checklist counted |
| 4    | Present Resume     | resume_summary       | Summary displayed       |

---

## 5. CONFIRM MODE (5 STEPS)

| STEP | NAME               | REQUIRED OUTPUT      | VERIFICATION            |
| ---- | ------------------ | -------------------- | ----------------------- |
| 1    | Session Detection  | spec_path confirmed  | Path validated          |
| 2    | Memory Selection   | user_choice          | User selected A/B/C/D   |
| 3    | Load Memory        | context_loaded       | Requested gaps loaded   |
| 4    | Calculate Progress | progress_percentages | Tasks/checklist counted |
| 5    | Present Resume     | resume_summary       | Summary displayed       |

---

# SpecKit Resume

Resume work on an existing spec folder by detecting the last active session, loading just enough useful context to continue safely, and presenting progress with clear next steps.

```yaml
role: Expert Developer using Smart SpecKit for Session Recovery
purpose: Resume interrupted work with full context restoration and progress visibility
action: Run 4-5 step resume workflow from session detection through continuation options

operating_mode:
  workflow: sequential_4_or_5_step
  workflow_compliance: MANDATORY
  workflow_execution: autonomous_or_interactive
  approvals: memory_selection_in_confirm_mode
  tracking: progress_calculation
  validation: artifact_based
```

---

## 6. PURPOSE

Resume work on an existing or recently interrupted spec-folder session by detecting the last active state, loading structured handoff or memory context, and presenting the smallest useful recovery packet: where you are, what happened last, what should happen next, and what might block it. This command owns both normal continuation and crash-recovery routing.

---

## 7. CONTRACT

**Inputs:** `$ARGUMENTS` — Optional spec folder path with optional :auto/:confirm suffix
**Outputs:** Resumed session context + progress display + `STATUS=<OK|FAIL|CANCELLED>`

```text
$ARGUMENTS
```

---

## 8. INSTRUCTIONS

After all phases pass, load and execute the appropriate YAML prompt:

- **AUTONOMOUS**: `.opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml`
- **INTERACTIVE**: `.opencode/command/spec_kit/assets/spec_kit_resume_confirm.yaml`

The YAML contains detailed step-by-step workflow, output formats, and all configuration.

---

## 9. SESSION DETECTION FLOW

**Priority order for finding spec folder:**
1. Validate provided path from $ARGUMENTS
2. `memory_match_triggers()` — fast phrase matching (<50ms)
3. `memory_context()` — L1 unified retrieval (score > 0.6)
4. Deterministic filtered ranking (session-learning + alias-normalized spec roots)
5. No session found → offer: /spec_kit:complete or specify path

**Context loading priority (after spec_path confirmed):**
1. handover.md (exists & <24h) → use handover context
2. `session_bootstrap()` or `memory_context({ mode: "resume", profile: "resume" })` → primary interrupted-session recovery path
3. `CONTINUE_SESSION.md` → crash breadcrumb when present and recent
4. `memory_search()` with resume anchors → fallback when the summary is thin
5. checklist.md → progress state fallback

**Stale session (>7 days):** Warn user, offer: A) Resume anyway, B) Fresh start, C) Review changes, D) Cancel

---

## 10. SMART MEMORY LOGIC

**Goal:** recover enough state to take the next safe action, not to replay the whole project history.

### Resume Essentials

| Signal | Why it matters | Primary source | Fallback |
| ------ | -------------- | -------------- | -------- |
| Current phase or task | Orient the user immediately | `handover.md`, `tasks.md` | `session_bootstrap()` or `memory_context({ mode: "resume", profile: "resume" })` |
| Last confirmed action | Prevent duplicate work | `handover.md`, recent memory | `memory_search()` with `state` anchor |
| Next safe action | Make the resume actually useful | `session_bootstrap()` or `memory_context({ mode: "resume", profile: "resume" })` | `memory_search()` with `next-steps` anchor |
| Blockers or "none" | Avoid unsafe continuation | `session_bootstrap()` or `memory_context({ mode: "resume", profile: "resume" })` | `memory_search()` with `blockers` or `summary` anchor |
| Relevant artifact or file | Give the user a concrete place to start | `tasks.md`, `implementation-summary.md`, `handover.md` | recent memory content |

### Sufficiency Rule

- Stop loading more context once the command can name a **Next Safe Action** plus at least two of: current phase/task, blocker status, last confirmed action, or relevant artifact/file.
- If the next safe action is still ambiguous after the primary recovery chain, run targeted gap-filling instead of broad memory loading.
- If ambiguity remains after targeted recovery, report uncertainty clearly instead of guessing.

### Gap-Filling Order

1. Missing current phase/task: check `tasks.md`, `checklist.md`, or `handover.md`.
2. Missing next safe action: use `session_bootstrap()` or `memory_context({ mode: "resume", profile: "resume" })`, then targeted `memory_search()` on `next-steps` and `state`.
3. Missing blockers: target `blockers` and `summary`.
4. Missing concrete starting point: look for the most relevant artifact, file, or unfinished task before loading more memory files.
5. Only use deep memory loading when the focused recovery packet is still insufficient.

---

## 11. OUTPUT FORMATS

**Success:**
```
RESUME BRIEF
Spec: [path]
Confidence: [high|medium|low] | Source: [handover|memory_context|continue_session|combined]
Now: [phase/current task]
Last confirmed: [action]
Next safe action: [action]
Blockers: [none|details]
Progress: [X]% ([done]/[total] tasks)
Why this is next: [short reason based on tasks/checklist/memory]
```

**No Session:** Offer /spec_kit:complete or specify folder path.

**Stale Session (>7 days):** Warn context may be outdated, offer Resume/Fresh/Review/Cancel.

---

## 12. REFERENCE

**Full details in YAML prompts:** Workflow steps, progress calculation, memory loading, session detection priority, stale handling, mode behaviors, failure recovery.

**See also:** AGENTS.md Sections 2-6 for memory loading, confidence framework, and request analysis.

---

## 13. MCP TOOL USAGE

Call MCP tools directly — NEVER through Code Mode.

### Memory Tools

| Tool                    | Purpose                                |
| ----------------------- | -------------------------------------- |
| `memory_search`         | Find/load context (includeContent: true)|
| `memory_match_triggers` | Fast trigger phrase matching (<50ms)   |
| `memory_list`           | Browse stored memories with pagination |
| `memory_stats`          | Memory system statistics               |
| `memory_delete`         | Remove memory by ID or spec folder     |
| `memory_update`         | Update metadata (title, triggers, tier)|
| `memory_validate`       | Record validation feedback             |
| `memory_index_scan`     | Bulk index after creating memory files |
| `memory_health`         | Check database/embeddings/index status |

### Checkpoint Tools

| Tool                 | Purpose                              |
| -------------------- | ------------------------------------ |
| `checkpoint_create`  | Snapshot state before major work     |
| `checkpoint_list`    | Browse checkpoints with metadata     |
| `checkpoint_restore` | Rollback to previous checkpoint      |
| `checkpoint_delete`  | Clean up old checkpoints             |

**Note:** No `memory_load` tool. Use `session_bootstrap()` as the canonical first recovery call, or `memory_context({ mode: "resume", profile: "resume" })` when you want the direct resume-retrieval primitive. In the current handler, resume mode is effectively a focused recovery search over the anchors `state`, `next-steps`, `summary`, and `blockers`; use `memory_search` with `includeContent: true` only when one of those essential signals is still missing.

### Session Deduplication

- Prefer deterministic ranked active candidates (archive/test/fixture filtered)
- handover.md takes priority; if it is absent or thin, use `session_bootstrap()` or `memory_context({ mode: "resume", profile: "resume" })` before checking `CONTINUE_SESSION.md`
- Treat `CONTINUE_SESSION.md` as a breadcrumb, not the primary source of truth
- Older handovers preserved for audit trail

### Compaction Continuation Safety

- If a context-compaction continuation prompt is detected, stop and present current task/state summary before taking actions.
- Wait for user confirmation after the summary, then proceed with normal resume flow.

### Validation on Resume

After loading context, auto-validates: missing files, broken memory anchors, unfilled placeholders, and whether the recovery packet actually includes a usable next action.

---

## 14. PARALLEL DISPATCH

Resume is a **utility workflow** — no parallel dispatch. All steps sequential.
- Auto: 4 steps | Confirm: 5 steps with user checkpoints

---

## 15. EXAMPLES

```
/spec_kit:resume                                          → Auto-detect via deterministic filtered ranking
/spec_kit:resume:auto                                     → Auto-detect and recover an interrupted session
/spec_kit:resume specs/014-context-aware-permission-system/ → Resume specific folder
/spec_kit:resume:confirm specs/014-*/                      → Interactive with memory options
```

---

## 16. RELATED COMMANDS

| Command               | Relationship                                            |
| --------------------- | ------------------------------------------------------- |
| `/spec_kit:complete`  | Start new (resume continues existing)                   |
| `/spec_kit:plan`      | Create planning artifacts (if missing on resume)        |
| `/spec_kit:implement` | Execute implementation (call after resume)              |
| `/spec_kit:handover`  | Create handover doc (resume loads these)                |
| `/memory:search`     | Broader historical lookup and learning-history review   |

---

## 17. COMMAND CHAIN

```
[/spec_kit:handover] → /spec_kit:resume → [Continue workflow]
```

Prerequisite: `/spec_kit:handover [spec-folder-path]` (creates handover.md)

---

## 18. NEXT STEPS

| Condition                  | Suggested Command                        | Reason                    |
| -------------------------- | ---------------------------------------- | ------------------------- |
| Planning incomplete        | `/spec_kit:plan [feature-description]`   | Complete planning phase   |
| Ready to implement         | `/spec_kit:implement [spec-folder-path]` | Continue implementation   |
| Implementation in progress | Continue from last task                  | Resume where you left off |
| Found issues               | `/spec_kit:debug [spec-folder-path]`     | Debug problems            |
| Need broader history       | `/memory:search history [spec-folder]`  | Inspect learning history  |
| Session ending again       | `/spec_kit:handover [spec-folder-path]`  | Save progress for later   |

**ALWAYS** end with: "What would you like to do next?"
