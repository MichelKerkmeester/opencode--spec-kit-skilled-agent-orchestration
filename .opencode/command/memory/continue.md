---
description: Recover interrupted work using resume-mode memory retrieval plus crash-recovery breadcrumbs
argument-hint: "[recovery-mode:auto|manual] [spec-folder]"
allowed-tools: Read, Bash, spec_kit_memory_memory_context, spec_kit_memory_memory_search, spec_kit_memory_memory_list, spec_kit_memory_memory_stats
---

# 🚨 MANDATORY FIRST ACTION - DO NOT SKIP

**BEFORE READING ANYTHING ELSE IN THIS FILE, CHECK `$ARGUMENTS`:**

```text
1. PARSE execution mode:
   - contains ":auto"   -> recovery_mode = "auto"
   - contains ":manual" -> recovery_mode = "manual"
   - otherwise          -> recovery_mode = "auto"

2. PARSE optional spec folder:
   - if a remaining argument looks like a spec folder path, store it as target_spec
   - examples:
     specs/082-speckit-reimagined
     .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/016-command-alignment

3. START with resume-mode retrieval:
   spec_kit_memory_memory_context({
     input: "resume previous work continue session",
     mode: "resume",
     specFolder: target_spec (if present),
     includeContent: true
   })

4. IF resume-mode retrieval returns a clear session/spec match:
   -> continue with AUTO or MANUAL workflow below

5. IF results are empty or low-confidence:
   -> call spec_kit_memory_memory_list({ limit: 5, sortBy: "updated_at" })
   -> switch to MANUAL workflow

6. IF nothing recoverable is found:
   -> ASK user which spec folder/session to resume
   -> WAIT for response
```

**CRITICAL RULES:**
- `memory_context(... mode: "resume")` is the primary recovery path
- `CONTINUE_SESSION.md` is enrichment, not the primary source of truth
- Do not invent fields that are not present in `CONTINUE_SESSION.md`
- If the user already knows the spec folder and wants full artifact progress, prefer `/spec_kit:resume <spec-folder>`

---

# Memory Continue Command

Recover interrupted work after crash, compaction, or timeout by reconstructing session state from resume-oriented memory retrieval and optional crash-recovery breadcrumbs.

---

```yaml
role: Session Recovery Specialist
purpose: Restore interrupted work with the smallest reliable recovery path
action: Resolve the most likely session, summarize state, and route to the best next command

operating_mode:
  workflow: session_recovery
  workflow_compliance: MANDATORY
  approvals: manual_mode_only
  tracking: recovery_confidence
```

---

## 1. PURPOSE

Use `/memory:continue` when the user says some version of:

- "continue from where we left off"
- "what was I doing?"
- "the server restarted"
- "the chat compacted"
- "I came back after a break"

This command is optimized for **state reconstruction**:
- recover likely session state from memory anchors
- enrich with crash breadcrumbs when available
- show the shortest trustworthy summary of last action, next steps, and likely files
- route to `/spec_kit:resume` when deeper spec-folder workflow is the better next step

### Command Boundary

| Command | Best For |
| ------- | -------- |
| `/memory:continue` | Reconstructing interrupted context when the session/spec is uncertain or partial |
| `/spec_kit:resume <spec-folder>` | Resuming a known spec folder with plan/tasks/checklist progress |

---

## 2. CONTRACT

**Inputs:** `$ARGUMENTS` with optional `:auto` or `:manual`, plus optional spec folder

**Outputs:** `STATUS=<OK|FAIL|CANCELLED> MODE=<auto|manual> SOURCE=<memory_context|continue_session|memory_search|user> SESSION=<spec-folder|unknown>`

---

## 3. QUICK REFERENCE

| Command | Result |
| ------- | ------ |
| `/memory:continue` | Auto-detect likely interrupted session |
| `/memory:continue :auto` | Recover using the strongest detected session with minimal prompting |
| `/memory:continue :manual` | Recover with explicit confirmation when confidence is low |
| `/memory:continue specs/082-speckit-reimagined` | Recover directly inside a known spec folder |

### Recovery Sources

| Priority | Source | Use |
| -------- | ------ | --- |
| 1 | `memory_context(... mode: "resume")` | Primary recovery path |
| 2 | `CONTINUE_SESSION.md` | Crash breadcrumb and quick-resume hint |
| 3 | `memory_search()` with resume anchors | Fallback when summary is thin |
| 4 | `memory_list()` | Recent-candidate discovery |
| 5 | User confirmation | Final fallback |

### Example Output

```text
MEMORY:CONTINUE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Mode        auto
  Source      memory_context + CONTINUE_SESSION.md
  Spec        specs/082-speckit-reimagined

→ Last Action ───────────────────────────────────
  Refined recovery flow for /memory:continue

→ Next Steps ────────────────────────────────────
  1. Verify the resume summary
  2. Open the spec workflow if implementation should continue

→ Likely Files ──────────────────────────────────
  .opencode/command/memory/continue.md
  .opencode/command/spec_kit/resume.md
  .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts

→ Best Next Command ─────────────────────────────
  /spec_kit:resume specs/082-speckit-reimagined

STATUS=OK MODE=auto SOURCE=memory_context SESSION=specs/082-speckit-reimagined
```

---

## 4. AUTO MODE WORKFLOW

Auto mode should stay short and deterministic. Use the first trustworthy session candidate rather than building a large custom recovery system.

### Step 1: Resolve the Candidate Session

1. If `target_spec` was passed, prefer it immediately.
2. Call:

```text
spec_kit_memory_memory_context({
  input: "resume previous work continue session",
  mode: "resume",
  specFolder: "<target_spec-if-known>",
  includeContent: true
})
```

3. Prefer a candidate when one of these is true:
   - response metadata includes folder discovery for a spec folder
   - top results cluster around a single `specFolder`
   - returned content clearly contains `state`, `next-steps`, `summary`, or `blockers`

4. If recovery is still ambiguous, call:

```text
spec_kit_memory_memory_list({ limit: 5, sortBy: "updated_at" })
```

and switch to MANUAL mode.

### Step 2: Enrich with Crash Breadcrumbs

If the chosen spec folder contains `CONTINUE_SESSION.md`, read it and extract only the fields the generator actually writes:

- `Session ID`
- `Spec Folder`
- `Current Task`
- `Last Action`
- `Status`
- `Updated`
- `Context Summary`
- `Pending Work`
- `Quick Resume`

Use this file to enrich the summary. Do **not** expect `Next Steps`, `Progress`, or `Blockers` table rows from this file.

### Step 3: Fallback Search for Thin Summaries

If `memory_context` returns the right folder but not enough state detail, run a targeted fallback:

```text
spec_kit_memory_memory_search({
  query: "session state next steps summary blockers",
  specFolder: "<resolved-spec-folder>",
  anchors: ["state", "next-steps", "summary", "blockers"],
  includeContent: true,
  limit: 5
})
```

Use the top 1-3 results to fill in missing next-step detail.

### Step 4: Display the Recovery Summary

Always show:

- recovery mode
- source(s) used
- resolved spec folder
- last action
- next steps
- likely files or titles from the recovered results

If the generated quick-resume command in `CONTINUE_SESSION.md` points to `/spec_kit:resume <spec-folder>`, surface that as the recommended next command instead of paraphrasing it.

---

## 5. MANUAL MODE WORKFLOW

Use manual mode when:

- no clear session candidate exists
- multiple recent folders look plausible
- the user explicitly asked for `:manual`
- recovered state conflicts with the user's expectation

### Step 1: Show the Best Candidate and Alternatives

Present:

- detected spec folder, if any
- top 2-3 recent folders from `memory_list()`
- why the top candidate was selected

### Step 2: Ask One Consolidated Question

```text
I found a likely interrupted session.

  Detected: <best-spec-folder-or-unknown>
  Alternatives:
  A) Use detected session
  B) Pick from recent folders
  C) Enter a spec folder manually
  D) Cancel recovery

Reply with A/B/C/D
```

### Step 3: Load the Final State

After the user chooses a folder or confirms the candidate:

1. run `memory_context(... mode: "resume")` for that folder
2. optionally read `CONTINUE_SESSION.md` if present
3. optionally run fallback `memory_search()` if the summary is still thin

### Step 4: Route to the Next Command

Use this routing rule:

- if the user wants a quick "what was I doing?" answer, stop after the recovery summary
- if they want to continue structured spec work, recommend `/spec_kit:resume <spec-folder>`
- if they want broader historical analysis, recommend `/memory:analyze history <spec-folder>`

---

## 6. ERROR HANDLING

| Condition | Action |
| --------- | ------ |
| No resume results | Fall back to `memory_list()` and ask user to choose |
| Resume results found but spec unclear | Switch to MANUAL mode |
| `CONTINUE_SESSION.md` missing | Continue with memory-only recovery |
| `CONTINUE_SESSION.md` conflicts with memory results | Trust `memory_context` first, use the file as supporting evidence |
| User knows the exact spec folder already | Recommend `/spec_kit:resume <spec-folder>` |
| Recovered summary is too thin | Run anchored `memory_search()` fallback |
| Session looks stale after long inactivity | Warn that codebase/worktree state may have changed |

---

## 7. ACTUAL RUNTIME NOTES

These notes should stay aligned with the live memory stack.

### Resume-Mode Defaults

`memory_context` resume mode currently routes to `memory_search()` with:

- `anchors`: `["state", "next-steps", "summary", "blockers"]`
- `limit`: `5`
- `includeContent`: `true`
- `includeConstitutional`: `false`
- `enableDedup`: `false`
- `useDecay`: `false`
- `minState`: `WARM`

The resume-mode token budget is `1200`.

### Resume Heuristic

When `memory_context` is called in `auto` mode, inputs containing words such as `resume`, `continue`, `pick up`, `where was i`, or `what's next` may be auto-routed into resume mode.

### Crash-Recovery Breadcrumbs

The session manager maintains crash-recovery state in SQLite and can generate `CONTINUE_SESSION.md` during checkpoints. The generated quick-resume command currently prefers:

```text
/spec_kit:resume <spec-folder>
```

when a spec folder is known.

That means `/memory:continue` should treat the file as:

- a human-readable crash breadcrumb
- a session-id hint
- a route to the richer spec-folder resume workflow

not as a full replacement for resume-mode memory retrieval.

---

## 8. RELATED COMMANDS

- `/memory:context`: General intent-aware context retrieval
- `/memory:save`: Save current session context for future recovery
- `/memory:manage`: Inspect database state, checkpoints, and ingest operations
- `/memory:analyze history <spec-folder>`: Review epistemic history for a resumed spec folder
- `/spec_kit:handover`: Create structured continuation notes before ending a session
- `/spec_kit:resume <spec-folder>`: Continue structured work inside a known spec folder
