---
description: Recover session from crash, compaction, or timeout - resume interrupted work
argument-hint: "[recovery-mode:auto|manual]"
allowed-tools: Read, Bash, spec_kit_memory_memory_context, spec_kit_memory_memory_search, spec_kit_memory_memory_list, spec_kit_memory_memory_stats
---

# 🚨 MANDATORY FIRST ACTION - DO NOT SKIP

**BEFORE READING ANYTHING ELSE IN THIS FILE, CHECK `$ARGUMENTS`:**

```
IF $ARGUMENTS contains ":auto":
    → Store as: recovery_mode = "auto"
    → Route to AUTO workflow (Section 6)

IF $ARGUMENTS contains ":manual":
    → Store as: recovery_mode = "manual"
    → Route to MANUAL workflow (Section 7)

IF $ARGUMENTS is empty or invalid:
    → Detect recovery scenario from system state
    → CHECK for CONTINUE_SESSION.md in recent spec folders
    → CHECK for recent memory files with state anchor
    → CHECK for context compaction in system messages
    → Determine scenario: crash | compaction | timeout
    → Store as: recovery_mode = "auto", scenario = "<detected>"

IF detection fails:
    → ASK user: "What caused the interruption?"
        A) MCP server crash/restart
        B) Context compaction (conversation too long)
        C) Session timeout (returned after break)
        D) Manual recovery (specify reason)
    → WAIT for response, store scenario and recovery_mode
```

---

# Memory Continue Command

Session recovery from crash, compaction, or timeout. Resume interrupted work with full context restoration.

---

```yaml
role: Session Recovery Specialist
purpose: Restore interrupted sessions from crash/compaction/timeout with context recovery
action: Execute recovery workflow based on detected scenario

operating_mode:
  workflow: session_recovery
  workflow_compliance: MANDATORY
  approvals: manual_mode_only
  tracking: recovery_state
```

---

## 1. PURPOSE

Enable session recovery from three interruption scenarios:

1. **Crash Recovery**: MCP server crashed or restarted mid-session
2. **Compaction Recovery**: Conversation context was compressed due to length
3. **Session Timeout**: User returned after break (hours or days)

This command restores the most recent session state, loads relevant context, and presents continuation options.

---

## 2. MCP ENFORCEMENT MATRIX

**CRITICAL:** This command uses MCP tools directly. Native MCP only - NEVER Code Mode.

| SCREEN     | REQUIRED MCP CALLS                                                                            | MODE   | ON FAILURE                 |
| ---------- | --------------------------------------------------------------------------------------------- | ------ | -------------------------- |
| DETECTION  | `spec_kit_memory_memory_context({ input: "session", mode: "resume", includeContent: false })` | SINGLE | Fall back to memory_search |
| STATE LOAD | `spec_kit_memory_memory_context({ input: "[query]", mode: "resume", includeContent: true })`  | SINGLE | Use CONTINUE.md            |
| STATS      | `spec_kit_memory_memory_stats`                                                                | SINGLE | Show error msg             |

**Tool Call Format:**
```
spec_kit_memory_memory_context({ input: "session state", mode: "resume", specFolder: "<folder>", includeContent: true })
spec_kit_memory_memory_search({ query: "session state", specFolder: "<folder>", includeContent: true })
spec_kit_memory_memory_list({ limit: 5, sortBy: "updated_at" })
spec_kit_memory_memory_stats({ includeScores: true })
Read({ filePath: "<absolute_path>" })
```

---

## 3. CRASH RECOVERY PERSISTENCE

All session state is immediately persisted to SQLite with write-ahead logging (WAL) for crash safety. State changes use IMMEDIATE transactions to survive process crashes.

### Transaction Safety

| Operation         | Isolation | Recovery Guarantee     |
| ----------------- | --------- | ---------------------- |
| State write       | IMMEDIATE | Survives process crash |
| Checkpoint create | EXCLUSIVE | Full consistency       |
| Memory save       | IMMEDIATE | Write-ahead logged     |

### Database Path

```
.opencode/skill/system-spec-kit/mcp_server/dist/database/context-index.sqlite
```

Compatibility note: `.opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite` may exist as a symlink to the canonical `dist/database` path.

Recovery from SQLite returns the most recent `session_state` record for the given session ID, with `_recovered: true`, `_recovered_at` timestamp, and `_source: 'sqlite'` metadata.

---

## 4. CONTRACT

**Inputs:** `$ARGUMENTS` - Optional recovery mode flag (`:auto` or `:manual`)
**Outputs:** `STATUS=<OK|FAIL|CANCELLED> SCENARIO=<crash|compaction|timeout> SESSION=<spec-folder>`

---

## 5. RECOVERY SCENARIOS

| Scenario       | Detection Signal                     | Recovery Source          | Auto-Recoverable |
| -------------- | ------------------------------------ | ------------------------ | ---------------- |
| **Crash**      | MCP restart detected, recent session | CONTINUE_SESSION.md      | Yes              |
| **Compaction** | System message: "continue from..."   | Most recent memory file  | Yes              |
| **Timeout**    | Last activity >2 hours ago           | Memory with state anchor | Yes              |

---

## 6. WORKFLOW: AUTO MODE

Auto mode attempts automatic recovery without user confirmation.

### Step 1: Detect Recovery Scenario

Match the current state against the Recovery Scenarios table (Section 5) using this priority order:

1. **Crash** — Find most recent `CONTINUE_SESSION.md` in specs (modified within last 24h). If found, load it.
2. **Compaction** — Scan system messages for "continue from where we left off".
3. **Timeout** — Check most recent memory file mtime (>2h ago).
4. **Fallback** — If none detected, switch to MANUAL mode and ask user.

### Step 2: Load Session State

**For Crash (CONTINUE_SESSION.md exists):**

Read the file and parse the session state table to extract:
- `specFolder`, `lastAction`, `nextSteps`, `progress`, `blockers`

**For Compaction/Timeout (use memory files):**

```
spec_kit_memory_memory_list({ limit: 1, sortBy: "updated_at" })
```

Extract state from the `ANCHOR:state` section of the most recent memory.

### Step 3: Validate Content vs Folder Alignment

**CRITICAL**: Before displaying the recovery summary, validate that memory content matches the spec folder.

Check `key_files` from memory metadata against the spec folder:
- If >50% of key_files are in `.opencode/` but spec_folder is project-specific → **mismatch detected**
- Infrastructure patterns to detect: `memory`, `spec-kit`, `speckit`, `opencode`, `command`, `agent`

**Mismatch Detection Signals:**

| Signal                                                                                   | Meaning                      |
| ---------------------------------------------------------------------------------------- | ---------------------------- |
| `key_files` contain `.opencode/skill/`                                                   | Skill/infrastructure work    |
| `key_files` contain `.opencode/command/`                                                 | Command development work     |
| `key_files` contain `.opencode/agent/`, `.opencode/agent/chatgpt/`, or `/.claude/agents` | Agent development work       |
| `spec_folder` doesn't match patterns                                                     | Likely saved to wrong folder |

**On mismatch, present options:**
- A) Search for infrastructure-related spec folder
- B) Continue with stored spec folder anyway
- C) Select spec folder manually

### Step 4: Display Recovery Summary

```
MEMORY:CONTINUE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Scenario    <scenario> (<detection detail>)
  Spec        <spec-folder>
  Activity    <time ago>

→ Last Action ──────────────────────────────────────
  <last action description>

→ Next Steps ───────────────────────────────────────
  1. <step 1>
  2. <step 2>
  3. <step 3>

→ Progress ─────────────────────────────────────────
  █████████░░░░░░░░░░░  47% (118/250 tasks)

  Blockers    none

→ Key Files ────────────────────────────────────────
  <file-path-1>
  <file-path-2>
  (showing first 3 of N files)

STATUS=OK SCENARIO=<scenario> SESSION=<spec-folder>
```

**IMPORTANT**: Always display key files in the recovery summary so the user can verify that the spec folder makes sense for the work that was done.

### Step 5: Auto-Continue

In auto mode, immediately present continuation options:

```
─────────────────────────────────────────────────────
[a] continue from last action    [b] review session state
[c] change direction             [d] cancel recovery
```

---

## 7. WORKFLOW: MANUAL MODE

Manual mode requires user confirmation at each step.

### Step 1: Ask User for Scenario

```
Session interruption detected. What caused the interruption?

  A) MCP server crash/restart
  B) Context compaction (conversation too long)
  C) Session timeout (returned after break)
  D) Manual recovery (specify reason)

Reply with A/B/C/D
```

### Step 2: Confirm Session Detection

```
Most recent session detected:

  Spec: specs/082-speckit-reimagined/
  Last Activity: 15 minutes ago
  Last Memory: session-20260201-152030.md

Is this the session to recover?

  A) Yes, recover this session
  B) No, select a different spec folder
  C) Cancel recovery

Reply with A/B/C
```

### Step 3: Load and Confirm State

Same as Auto Mode Step 2, but wait for confirmation before proceeding:

```
Loaded session state. Confirm context is accurate?

  Last Action: Created /memory:continue command file
  Next Steps: Verify command structure, test scenarios
  Progress: 47% (118/250 tasks)

  A) Yes, context is accurate
  B) Context incomplete - load more memory files
  C) Context incorrect - investigate

Reply with A/B/C
```

### Step 4: Present Continuation Options

Same as Auto Mode Step 5.

---

## 8. SESSION STATE STRUCTURE

### CONTINUE_SESSION.md Format

```markdown
# SESSION CONTINUATION

| Field       | Value                                 |
| ----------- | ------------------------------------- |
| Spec Folder | specs/082-speckit-reimagined/         |
| Active Task | T118 - Implement /memory:continue     |
| Last Action | Created /memory:continue command file |
| Next Steps  | Verify structure, test scenarios      |
| Progress    | 47% (118/250 tasks)                   |
| Blockers    | None                                  |
| Session ID  | session-20260201-152030               |
| Timestamp   | 2026-02-01 15:20:30                   |

## Context Summary

Created /memory:continue command following patterns from checkpoint.md, search.md, and resume.md.
Implemented Phase 1 detection logic, auto/manual workflows, and recovery from three scenarios.

## Pending Work

- [ ] Verify command structure against existing patterns
- [ ] Test crash recovery scenario
- [ ] Test compaction recovery scenario
- [ ] Test timeout recovery scenario
- [ ] Update tasks.md with completion status

## Quick Resume

To continue this session: `/memory:continue`
Context will be automatically restored. Next action: Verify command structure.
```

### Memory File State Anchor Format

```markdown
<!-- ANCHOR:state -->

**Current State:** Implementing T118 - /memory:continue command

**Last Action:** Created command file with Phase 1 detection logic

**Next Steps:**
1. Verify command structure against patterns
2. Test recovery scenarios
3. Update tasks.md with status

**Progress:** 47% (118/250 tasks)

**Blockers:** None

<!-- /ANCHOR:state -->
```

---

## 9. ERROR HANDLING

| Condition                        | Action                                        |
| -------------------------------- | --------------------------------------------- |
| CONTINUE_SESSION.md not found    | Fall back to memory file search               |
| Invalid CONTINUE_SESSION.md      | Use memory file fallback                      |
| No session detected              | Ask user for spec folder or start new session |
| Missing state anchor             | Load full memory content, extract manually    |
| Multiple sessions detected       | Ask user to select                            |
| Session state corrupt/incomplete | Reconstruct from multiple memory files        |
| Spec folder not found            | List available, ask user to select            |
| Stale session (>7 days)          | Warn about staleness, confirm recovery        |
| Context compaction detected      | Show compaction message, load recent memory   |

> **Adaptive Fusion in Recovery:** When `SPECKIT_ADAPTIVE_FUSION` is enabled, recovery context matching uses adaptive fusion weights tuned for the `resume` mode — recency and state-anchor relevance are boosted to improve hit rate on fragmented or post-compaction sessions. When `SPECKIT_EXTENDED_TELEMETRY` is enabled, recovery success metrics (match confidence, anchor hit rate, reconstruction steps) are captured and appended to the telemetry log for post-session analysis.

---

## 10. QUICK REFERENCE

| Command                    | Result                            |
| -------------------------- | --------------------------------- |
| `/memory:continue`         | Auto-detect and recover session   |
| `/memory:continue :auto`   | Auto-recover without confirmation |
| `/memory:continue :manual` | Manual recovery with user prompts |

---

## 11. USE CASES

### Use Case 1: Crash Recovery

```
User: /memory:continue

AI: MEMORY:CONTINUE
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

      Scenario    crash (MCP restart detected)
      Spec        specs/082-speckit-reimagined/
      Activity    15 minutes ago

    → Last Action ──────────────────────────────────────
      Created /memory:continue command file

    → Next Steps ───────────────────────────────────────
      1. Verify structure
      2. Test scenarios

    STATUS=OK SCENARIO=crash SESSION=specs/082-speckit-reimagined/
```

### Use Case 2: Compaction Recovery

```
User: [System message: "Please continue from where we left off..."]

AI: MEMORY:CONTINUE
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

      Scenario    compaction (context compressed)
      Spec        specs/082-speckit-reimagined/
      Activity    30 minutes ago

    Run /memory:continue to restore context.

User: /memory:continue

AI: [Loads state from memory file, presents continuation options]
```

### Use Case 3: Session Timeout

```
User: /memory:continue

AI: MEMORY:CONTINUE
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

      Scenario    timeout (returned after 4 hours)
      Spec        specs/082-speckit-reimagined/
      Activity    4 hours ago

      WARN  Codebase may have changed since last session

    ─────────────────────────────────────────────────────
    [a] continue    [b] review changes    [c] fresh start
```

---

## 12. RELATED COMMANDS

- `/spec_kit:resume` - Resume work on spec folder (broader scope, includes planning)
- `/spec_kit:handover` - Create handover for session continuity
- `/memory:context` - Search memories for context
- `/memory:manage` - Create checkpoint for rollback

---

## 13. NEXT STEPS AFTER RECOVERY

| Condition                 | Suggested Action                       |
| ------------------------- | -------------------------------------- |
| Crash recovery successful | Continue from last action              |
| Compaction recovery       | Verify context accuracy, then continue |
| Timeout after >4 hours    | Review codebase changes first          |
| Blockers detected         | Address blockers before continuing     |
| Progress <50%             | Review plan.md, verify alignment       |
| Progress >90%             | Verify completion criteria             |

---

## 14. RECOVERY PRIORITIES

**Priority order for context sources:**

1. **CONTINUE_SESSION.md** (if <24h old) - Highest fidelity (~200-300 tokens)
2. **Memory file with state anchor** - Targeted state extraction (~150-200 tokens)
3. **Most recent memory file (full)** - Complete context (~500-1000 tokens)
4. **checklist.md progress** - Minimal state reconstruction
5. **User input** - Fallback when automated recovery fails

---

## 15. SESSION ISOLATION

- Each recovery session is isolated; session IDs prevent cross-session data leakage
- CONTINUE_SESSION.md contains no secrets
- Memory files filtered by spec folder scope
- Verify spec folder exists before loading; validate session ID format; check timestamps for staleness
