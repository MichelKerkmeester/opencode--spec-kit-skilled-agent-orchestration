---
description: Create session handover document for continuing work in a new conversation
argument-hint: "[spec-folder-path]"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task
---

> ⚠️ **EXECUTION PROTOCOL — READ FIRST**
>
> This command runs a structured YAML workflow. Do NOT dispatch agents from this document.
>
> **YOUR FIRST ACTION:**
> 1. Load the YAML workflow: `assets/spec_kit_handover_full.yaml`
> 2. Execute the YAML workflow step by step
>
> All content below defines workflow context for the YAML runner. Treat it as executable only when running this command workflow; otherwise use it as reference.

## CONSTRAINTS

- **DO NOT** dispatch any agent (`@handover`, `@speckit`, `@review`) from this document
- **DO NOT** dispatch `@handover` from this document — the YAML workflow handles dispatch
- **DO NOT** dispatch `@review` to review this workflow or command prompt
- **ALL** agent dispatching is handled by the YAML workflow steps — this document is setup + reference only
- **FIRST ACTION** is always: load the YAML file (`assets/spec_kit_handover_full.yaml`), then execute it step by step

## RUNTIME AGENT PATH RESOLUTION

Use `[runtime_agent_path]` based on the active runtime profile:

- Default/Copilot: `.opencode/agent`
- Codex: `.codex/agents`
- Claude: `.claude/agents`
- Gemini: `.gemini/agents`

# SINGLE CONSOLIDATED PROMPT - ONE USER INTERACTION

This workflow uses a SINGLE consolidated prompt to gather ALL required inputs in ONE user interaction.

---

## 0. UNIFIED SETUP PHASE

**FIRST MESSAGE PROTOCOL**: This prompt MUST be your FIRST response. No implementation or file-modifying tool calls before asking. Lightweight read-only discovery is allowed, then ask ALL questions immediately and wait.

**STATUS: BLOCKED**

```
EXECUTE THIS SINGLE CONSOLIDATED PROMPT:

1. CHECK for spec folder in $ARGUMENTS:
   - IF has path -> validate path exists
   - IF empty -> auto-detect with deterministic filtered ranking across `specs/` and `.opencode/specs/`

2. Auto-detect result:
   - Found: spec_path = extracted, detection_method = "ranked"
     (archive/test/fixture/scratch filtered, stable tie-breakers, low-confidence confirm/fallback contract)
   - Not found: detection_method = "none" (include Q0)

3. Run pre-handover validation (background, strict mode):
   - Check: ANCHORS_VALID, PRIORITY_TAGS, PLACEHOLDER_FILLED
   - Store: validation_status = [passed/warnings/errors]

4. ASK user (include only applicable questions):

   Q0. Spec Folder (if not detected/provided):
      No active session detected. Available: [list]
      A) List and select  B) Cancel

   Q1. Confirm Detected Session (if auto-detected):
      Detected: [spec_path] (last activity: [date])
      A) Yes, create handover  B) Select different  C) Cancel

   Q2. Validation Issues (if warnings/errors found):
      Pre-handover validation found: [list]
      A) Fix before handover  B) Proceed anyway  C) Cancel

   Reply with answers, e.g.: "A" or "A, B"

5. WAIT for user response (DO NOT PROCEED)

6. Parse and store:
   - spec_path, detection_method, validation_choice [FIX/BYPASS/N/A]

7. Handle redirects:
   - validation_choice == FIX -> Fix issues, re-run validation
   - Q0/Q1 == B -> Re-prompt with folder selection
   - Cancel -> Cancel workflow

8. SET STATUS: PASSED

HARD STOP: DO NOT proceed until user answers
NEVER assume spec folder without confirmation when path was invalid
NEVER skip pre-handover validation
NEVER split into multiple prompts
```

**Phase Output:**
- `spec_path` | `detection_method` | `validation_status`

---

## 2. PHASE STATUS VERIFICATION (BLOCKING)

| FIELD             | REQUIRED | SOURCE                          |
| ----------------- | -------- | ------------------------------- |
| spec_path         | Yes      | Q0/Q1 or auto-detect or $ARGS  |
| detection_method  | Yes      | Auto-determined                 |
| validation_status | Yes      | Validation check (Q2 if issues) |

All required fields set? YES -> Proceed to workflow. NO -> Re-prompt for missing values.

---

## 3. WORKFLOW STEPS (4 STEPS)

**Execute steps IN ORDER. Mark each ONLY after completing ALL activities. DO NOT SKIP.**

| STEP | NAME            | STATUS | REQUIRED OUTPUT        | VERIFICATION                |
| ---- | --------------- | ------ | ---------------------- | --------------------------- |
| 1    | Validate Spec   |        | spec_path confirmed    | Path validated              |
| 2    | Gather Context  |        | context_summary        | Session context loaded      |
| 3    | Create Handover |        | handover.md            | File created in spec folder |
| 4    | Display Result  |        | continuation_displayed | Instructions shown to user  |

---

# SpecKit Handover

Create session handover document for continuing work in a new conversation.

```yaml
role: Expert Developer using Smart SpecKit for Session Handover
purpose: Create continuation documentation for session branching and context preservation
action: Run 4 step handover workflow from context gathering through document creation

operating_mode:
  workflow: sequential_4_step
  workflow_compliance: MANDATORY
  tracking: file_creation
  validation: file_exists_check
```

---

## 4. PURPOSE

Create a handover document that enables seamless session continuation. Captures session context, decisions, blockers, and next steps.

---

## 5. CONTRACT

**Inputs:** `$ARGUMENTS` -- Optional spec folder path
**Outputs:** `handover.md` + `STATUS=<OK|FAIL|CANCELLED>`

---

## 6. WORKFLOW OVERVIEW

| Step | Name            | Purpose                              | Outputs           |
| ---- | --------------- | ------------------------------------ | ----------------- |
| 1    | Validate Spec   | Confirm spec folder exists           | spec_path         |
| 2    | Gather Context  | Load session context                 | context_summary   |
| 3    | Create Handover | Generate handover.md                 | handover.md       |
| 4    | Display Result  | Show file path and continuation info | user_instructions |

---

## 7. INSTRUCTIONS

After all phases pass, load the YAML prompt for workflow configuration:

- `.opencode/command/spec_kit/assets/spec_kit_handover_full.yaml`

The YAML contains the handover template, agent routing, quality gates, and workflow configuration.

Then execute the workflow steps below. This command uses a single YAML configuration and operates in single-mode (no auto/confirm variants).

> Unlike other spec_kit commands, handover operates in single mode and delegates to a sub-agent rather than switching between auto/confirm YAML prompts.

### Step 1: Validate Spec
Confirm spec folder path exists and contains relevant context files.

### Step 2: Gather Context
Load from: `spec.md`/`plan.md`/`tasks.md` (project definition), `checklist.md` (progress), `memory/*.{md,txt}` (session context).

### Step 3: Create Handover
Template: `.opencode/skill/system-spec-kit/templates/handover.md`

**Attempt Counter:**
```
IF handover.md exists: Extract [N] from "CONTINUATION - Attempt [N]", new = N+1
ELSE: new = 1
```

**7 Required Sections:**
1. **Session Summary** - Date, duration, objective, progress %, accomplishments
2. **Current State** - Phase, active file/line, last action, system state
3. **Completed Work** - Tasks done, files modified, tests passed, docs updated
4. **Pending Work** - Next action, remaining tasks, effort estimates, dependencies
5. **Key Decisions** - Decisions, rationale, alternatives rejected, impact
6. **Blockers & Risks** - Blockers, risks, mitigation strategies
7. **Continuation Instructions** - Resume command, files to review, context to load

### Step 4: Display Result
Show created file path and continuation instructions.

---

## 8. OUTPUT FORMATS

**Output Location:** `[spec_folder]/handover.md` (NOT in memory/)

> **Crash Recovery:** For emergency scenarios, same format can be saved as `CONTINUE_SESSION.md` in the spec folder. Checked by `/spec_kit:resume`.

> **MANDATORY:** After creating handover, run:
> `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js [spec-folder-path]`

### Handover Success
```text
 HANDOVER CREATED
 File: specs/014-auth-feature/handover.md
 TO CONTINUE IN NEW SESSION:
 /spec_kit:resume specs/014-auth-feature/
 Or paste: CONTINUATION - Attempt 1 | Spec: specs/014-auth-feature/ | Last: [action] | Next: [action]
```

### No Spec Folder Found
```text
 NO ACTIVE SESSION
 No eligible spec folders found from deterministic auto-detection.
 Options: /spec_kit:handover specs/014-*/ or /spec_kit:complete
```

---

## 9. REFERENCE

**Template:** `.opencode/skill/system-spec-kit/templates/handover.md`
**See also:** AGENTS.md Section 2 (Compaction Recovery, Context Health).

---

## 10. EXAMPLES

```
/spec_kit:handover                           # Auto-detect via deterministic filtered ranking
/spec_kit:handover specs/014-auth-feature/   # Specific folder
```

---

## 11. RELATED RESOURCES

### Commands

| Command              | Relationship                                                     |
| -------------------- | ---------------------------------------------------------------- |
| `/spec_kit:resume`   | Loads handover document to continue work                         |
| `/spec_kit:complete` | Start new feature (handover captures in-progress)                |
| `/memory:save`       | Recommended companion - save semantic context for search         |
| `/spec_kit:resume`   | Standard continuation and crash recovery - loads handover, CONTINUE_SESSION.md, and resume-mode memory context |

> After creating handover.md, also run `/memory:save` for semantic retrieval across sessions.

### Agents

| Agent          | Relationship                                     |
| -------------- | ------------------------------------------------ |
| `@handover`    | Dedicated sub-agent for this command             |
| `@orchestrate` | Coordinates multi-agent routing; handover creation remains owned by `@handover` |
| `@speckit`     | Works with spec folders this command reads       |

### Files

| File                                                            | Purpose            |
| --------------------------------------------------------------- | ------------------ |
| `[runtime_agent_path]/handover.md`                               | Agent definition   |
| `.opencode/command/spec_kit/assets/spec_kit_handover_full.yaml` | YAML configuration |
| `.opencode/skill/system-spec-kit/templates/handover.md`         | Output template    |

---

## 12. INTEGRATION

### Context Health Suggestions

- **Tier 1** (15 exchanges): "Consider /spec_kit:handover soon"
- **Tier 2** (25 exchanges): "Recommend /spec_kit:handover now"
- **Tier 3** (35 exchanges): "Handover strongly recommended"

### Compaction Recovery (AGENTS.md Section 2)

On context compaction detection ("Please continue the conversation..."):
```
CONTINUATION - Attempt [N] | Spec: [PATH] | Last: [TASK] | Next: [TASK]
Run /spec_kit:handover, then /spec_kit:resume [spec-path] in new session
```

### Keyword Triggers

Proactive suggestion on: "stopping", "done", "finished", "break", "later", "forgetting", "remember", "context", "losing track"

---

## 13. COMMAND CHAIN

```
[Any workflow] -> /spec_kit:handover -> [/spec_kit:resume]
```

Next step: `/spec_kit:resume [spec-folder-path]` (in new session)

---

## 14. NEXT STEPS

| Condition                 | Suggested Action                           | Reason                    |
| ------------------------- | ------------------------------------------ | ------------------------- |
| Handover created          | Copy continuation prompt                   | Ready for new session     |
| Ready to continue now     | `/spec_kit:resume [spec-folder-path]`      | Load context and continue |
| Want to save more context | `/memory:save [spec-folder-path]`          | Preserve additional info  |
| Starting new work         | `/spec_kit:complete [feature-description]` | Begin different feature   |

**ALWAYS** end with: "What would you like to do next?"
