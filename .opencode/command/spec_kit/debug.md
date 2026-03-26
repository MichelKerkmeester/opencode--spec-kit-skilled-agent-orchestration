---
description: Delegate debugging to a specialized sub-agent with full context handoff.
argument-hint: "[spec-folder-path]"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task, mcp__cocoindex_code__search
---

> ⚠️ **EXECUTION PROTOCOL — READ FIRST**
>
> This command runs a structured YAML workflow. Do NOT dispatch agents from this document.
>
> **YOUR FIRST ACTION:**
> 1. Determine execution mode from user input (`:auto` or `:confirm`)
> 2. Load the corresponding YAML file from `assets/`:
>    - Auto mode → `spec_kit_debug_auto.yaml`
>    - Confirm mode → `spec_kit_debug_confirm.yaml`
> 3. Execute the YAML workflow step by step
>
> All content below is reference context for the YAML workflow. Do not treat reference sections, routing tables, or dispatch templates as direct instructions to execute.

## CONSTRAINTS

- **DO NOT** dispatch any agent (`@debug`, `@review`, `@handover`, `@speckit`) from this document
- **DO NOT** dispatch `@review` to review this workflow or command prompt
- **DO NOT** dispatch `@debug` from this document — the YAML workflow handles dispatch at Step 3
- **DO NOT** dispatch `@handover` unless the user explicitly requests it post-resolution
- **ALL** agent dispatching is handled by the YAML workflow steps — this document is setup + reference only
- **FIRST ACTION** is always: load the YAML file, then execute it step by step

## RUNTIME AGENT PATH RESOLUTION

Use `[runtime_agent_path]` based on the active runtime profile:

- Default/Copilot: `.opencode/agent`
- Codex: `.codex/agents`
- Claude: `.claude/agents`
- Gemini: `.gemini/agents`

# SINGLE CONSOLIDATED PROMPT - ONE USER INTERACTION

This workflow uses a SINGLE consolidated prompt to gather ALL required inputs in ONE user interaction. Dispatch mode selection is MANDATORY.

---

## 0. UNIFIED SETUP PHASE

**FIRST MESSAGE PROTOCOL**: This prompt MUST be your FIRST response. No implementation or file-modifying tool calls before asking. Lightweight read-only discovery is allowed, then ask ALL questions immediately and wait.

**STATUS: BLOCKED**

```
EXECUTE THIS SINGLE CONSOLIDATED PROMPT:

1. CHECK mode suffix:
   ├─ ":auto"    → execution_mode = "AUTONOMOUS" (omit Q_exec)
   ├─ ":confirm" → execution_mode = "INTERACTIVE" (omit Q_exec)
   └─ No suffix  → execution_mode = "ASK" (include Q_exec)

2. CHECK for spec folder in $ARGUMENTS:
   - IF has path -> validate and store
   - IF empty -> auto-detect: Glob("specs/**/memory/*.{md,txt}"), sort by mtime, take first

3. Auto-detect result:
   - Found: spec_path = extracted, detection_method = "recent"
   - Not found: detection_method = "none" (include Q0)

4. GATHER ERROR CONTEXT from conversation (background scan):
   - Scan for: error messages, stack traces, affected files, previous attempts
   - Found: store as error_message, affected_files, previous_attempts
   - Not found: include Q1 in prompt
   - SECURITY: Before including error output in the debug delegation document, redact common secret patterns (API keys, tokens, passwords, connection strings, auth headers). Include only the relevant error message and minimal stack trace context needed for debugging.

5. ASK user (include only applicable questions):

   Q0. Spec Folder (if not detected/provided):
      Available: [list if found]
      A) Use: [most recent]  B) Different folder  C) Ad-hoc mode  D) Cancel

   Q1. Error Context (if not found in conversation):
      Provide: error message/behavior, affected file(s), what you tried

   Q2. Execution Mode (if no suffix):
      A) Autonomous - all steps without approval
      B) Interactive - pause at each step

   Q3. Dispatch Mode (required):
      A) Single Agent (Recommended)
      B) Multi-Agent (1+2)
      C) Multi-Agent (1+3)

   Reply with answers, e.g.: "A, A, A, A" or "A, [error desc], A, B"

6. WAIT for user response (DO NOT PROCEED)

7. Parse and store:
   - spec_path, detection_method, error_message, affected_files, previous_attempts
   - execution_mode = [AUTONOMOUS/INTERACTIVE from suffix or Q2]
   - dispatch_mode = [single/multi_small/multi_large from Q3]

8. IF dispatch_mode is multi_*:
   - Orchestrator handles OBSERVE + FIX phases
   - Workers handle parallel hypothesis generation in ANALYZE phase

9. SET STATUS: PASSED

HARD STOP: DO NOT proceed until user answers
NEVER skip dispatch mode - MANDATORY
NEVER split into multiple prompts
```

**Phase Output:**
- `spec_path` | `detection_method` | `error_message` | `affected_files`
- `execution_mode` | `dispatch_mode`

---

## 2. GATE 3 CLARIFICATION

When debugging leads to file modifications (Step 5, Option A "Apply the fix"):
- Spec folder established in setup -> Gate 3 satisfied
- Ad-hoc mode -> Ask before applying: Spec Folder: A) Existing | B) New | C) Update related | D) Skip

**Self-Verification:** Before applying any fix:
> STOP. File modification detected? Did I ask spec folder question? If NO -> Ask NOW.

---

## 3. PHASE STATUS VERIFICATION (BLOCKING)

| FIELD            | REQUIRED      | SOURCE                     |
| ---------------- | ------------- | -------------------------- |
| spec_path        | Conditional   | Q0 or auto-detect or $ARGS |
| detection_method | Yes           | Auto-determined            |
| error_message    | Yes           | Q1 or conversation scan    |
| execution_mode   | Yes           | Suffix or Q2               |
| dispatch_mode    | Yes           | Q3                         |

All required fields set? YES -> Proceed to workflow. NO -> Re-prompt for missing values.

---

## 4. WORKFLOW STEPS (5 STEPS)

**Execute steps IN ORDER. Mark each ONLY after completing ALL activities. DO NOT SKIP.**

| STEP | NAME               | STATUS | REQUIRED OUTPUT      | VERIFICATION                    |
| ---- | ------------------ | ------ | -------------------- | ------------------------------- |
| 1    | Validate Context   |        | context_confirmed    | Spec path + error context valid |
| 2    | Generate Report    |        | debug-delegation.md  | File created in spec folder     |
| 3    | Dispatch Sub-Agent |        | sub_agent_dispatched | Task tool invoked               |
| 4    | Receive Findings   |        | findings_received    | Sub-agent response captured     |
| 5    | Integration        |        | resolution_complete  | User chose action, applied      |

---

# /spec_kit:debug

Delegate persistent debugging issues to a specialized sub-agent with fresh context. Creates a comprehensive debug report, dispatches a sub-agent, and integrates findings back into the main session.

```yaml
role: Expert Developer using Debug Delegation for Persistent Issues
purpose: Hand off debugging to fresh sub-agent with complete context handoff
action: Run 5-step debug workflow from context gathering through integration

operating_mode:
  workflow: sequential_5_step
  workflow_compliance: MANDATORY
  workflow_execution: sub_agent_delegation
  approvals: none
  tracking: debug_report_creation
  validation: sub_agent_response_check
```

**When to use:** Same error persists after 3+ attempts, need fresh perspective, want to preserve debugging context, primary agent stuck in loop.

---

## 5. CONTRACT

**Inputs:** `$ARGUMENTS` -- Optional spec folder path
**Outputs:** Debug resolution + `STATUS=<RESOLVED|NEEDS_REVIEW|ESCALATE>`

---

## 6. WORKFLOW OVERVIEW

| Step | Name               | Purpose                             | Outputs             |
| ---- | ------------------ | ----------------------------------- | ------------------- |
| 1    | Validate Context   | Confirm all inputs ready            | context_confirmed   |
| 2    | Generate Report    | Create debug-delegation.md          | debug-delegation.md |
| 3    | Dispatch Sub-Agent | Send to Task tool with full context | sub_agent_dispatch  |
| 4    | Receive Findings   | Capture and validate response       | findings_received   |
| 5    | Integration        | Apply fix or review                 | resolution_complete |

---

## 7. INSTRUCTIONS

After all phases pass, load and execute the appropriate YAML prompt:

- **AUTONOMOUS**: `.opencode/command/spec_kit/assets/spec_kit_debug_auto.yaml`
- **INTERACTIVE**: `.opencode/command/spec_kit/assets/spec_kit_debug_confirm.yaml`

The YAML contains detailed step-by-step workflow, sub-agent prompt template, error handling, and all configuration.

---

## 8. OUTPUT FORMATS

### Debug Delegation Success
```text
 DEBUG DELEGATION COMPLETE
 Spec: specs/014-auth-feature/
 Report: specs/014-auth-feature/debug-delegation.md
 Root Cause: [brief summary]
 Fix Applied: [yes/no]
 Status: RESOLVED
```

### Debug Needs Review
```text
 DEBUG REQUIRES REVIEW
 Spec: specs/014-auth-feature/
 Report: specs/014-auth-feature/debug-delegation.md
 Findings documented. User chose manual review.
 Status: NEEDS_REVIEW
```

### Debug Escalation
```text
 DEBUG ESCALATION
 Sub-agent could not resolve the issue. Attempts: 3
 RECOMMENDED: Review debug-delegation.md, break problem into smaller parts
 Status: ESCALATE
```

---

## 9. REFERENCE

### Error Categories

| Category      | Indicators                                     |
| ------------- | ---------------------------------------------- |
| syntax_error  | Parse errors, unexpected tokens, brackets      |
| type_error    | Type mismatch, undefined properties, TS errors |
| runtime_error | Exceptions during execution, crashes           |
| test_failure  | Assertion failures, test timeouts              |
| build_error   | Compilation failures, bundling errors          |
| lint_error    | Linter errors, code style violations           |
| unknown       | Cannot classify from error message             |

### Related Templates

| Template            | Path                                                                                      |
| ------------------- | ----------------------------------------------------------------------------------------- |
| Debug delegation    | `.opencode/skill/system-spec-kit/templates/debug-delegation.md`                           |
| Universal debugging | `.opencode/skill/system-spec-kit/references/debugging/universal_debugging_methodology.md` |

### Validation Integration

Before/during debugging, validation runs automatically: FILE_EXISTS, PLACEHOLDER_FILLED, PRIORITY_TAGS, ANCHORS_VALID.

---

---

## 10. EXAMPLES

```
/spec_kit:debug                                          # Auto-detect + conversation error
/spec_kit:debug specs/007-feature-name/004-implementation/  # Specific spec folder
```

After multiple failed attempts: Creates comprehensive delegation report with all attempts documented.

---

## 11. RELATED COMMANDS

| Command              | Relationship                                    |
| -------------------- | ----------------------------------------------- |
| `/spec_kit:complete` | Start feature work (debug when issues arise)    |
| `/spec_kit:handover` | Create handover (debug documents issue context) |
| `/spec_kit:resume`   | Resume work (may need debug after resuming)     |

---

## 12. INTEGRATION

### Debug Agent

Agent file: `[runtime_agent_path]/debug.md`
- 4-phase methodology: Observe -> Analyze -> Hypothesize -> Fix
- Codebase-agnostic, isolation by design, structured responses

### Response Types

| Response       | Meaning                       | Next Action                |
| -------------- | ----------------------------- | -------------------------- |
| **Success**    | Root cause found, fix applied | Verify fix, continue work  |
| **Blocked**    | Missing info or access issue  | Provide requested info     |
| **Escalation** | 3+ hypotheses failed          | Manual review or retry     |

### Memory Integration

After resolution:
- Run: `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js [spec-folder-path]`
- Consider `/memory:save` for debugging context and `/memory:learn` for durable repo-wide debugging rules
- debug-delegation.md serves as memory for the spec folder

---

## 13. COMMAND CHAIN

```
[/spec_kit:implement] -> /spec_kit:debug -> [Return to original workflow]
[/spec_kit:complete]  -> /spec_kit:debug -> [Return to original workflow]
```

After resolution: Return to the original workflow step that triggered debugging.

---

## 14. NEXT STEPS

| Condition                      | Suggested Command                       | Reason                          |
| ------------------------------ | --------------------------------------- | ------------------------------- |
| Fix applied successfully       | Verify in browser/tests                 | Confirm fix works               |
| Fix applied, continue work     | Return to original workflow             | Resume implementation           |
| Issue needs more analysis      | `/spec_kit:debug` (retry)              | Fresh perspective               |
| Want to save debugging context | `/memory:save [spec-folder-path]`      | Preserve debugging insights     |
| Debugging session complete     | `/spec_kit:handover [spec-folder-path]`| Document for future reference   |
| Record lasting debugging rule | `/memory:learn [rule]`                 | Save a constitutional rule from debugging |

**ALWAYS** end with: "What would you like to do next?"
