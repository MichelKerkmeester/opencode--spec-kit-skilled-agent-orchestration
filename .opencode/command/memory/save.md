---
description: Save current conversation context to memory with semantic indexing
argument-hint: "<spec-folder>"
allowed-tools: Read, Bash, Task, spec_kit_memory_memory_save, spec_kit_memory_memory_index_scan, spec_kit_memory_memory_stats, spec_kit_memory_memory_update
---

# MANDATORY FIRST ACTION - SPEC FOLDER RESOLUTION

**BEFORE READING ANYTHING ELSE IN THIS FILE, resolve `target_folder`:**

```text
IF $ARGUMENTS contains a spec folder path:
    → Validate folder exists
    → Store as target_folder
    → Continue reading this file

IF $ARGUMENTS is empty, undefined, or contains only whitespace:
    → Run AUTO-DETECTION (Tier 1 → Tier 2 → Tier 3):

    TIER 1: Gate 3 Carry-Over (highest confidence — no confirmation needed)
    - Check if a spec folder was established via Gate 3 earlier in this conversation
    - If yes → use it directly as target_folder (per CLAUDE.md Memory Save Rule)
    - Announce: "Using active spec folder from this session: [folder]"

    TIER 2: Conversation Signal Analysis (high confidence — confirm)
    - Scan files modified/read during this conversation
    - Map file paths to spec folders:
      * Files under specs/NNN-name/ or its children
      * Files referenced in a spec folder's description.json
      * Supporting docs (feature_catalog, manual_testing_playbook) linked via symlinks to a spec tree
    - If ALL modified files map to a single spec folder (or one parent and its children):
      → Propose: "Based on this session's work, the target folder is [folder]. Saving there. [Y/n]"
      → If user confirms or does not object → store as target_folder
    - If modified files span multiple unrelated spec folders → proceed to Tier 3

    TIER 3: Guided Selection (fallback — must ask)
    - List the spec folders touched in this conversation, ranked by file-edit count
    - ASK: "Multiple spec folders were touched. Which one should this context be saved to?"
    - If no spec folders detected at all → list recent/related spec folders and ask
    - WAIT for user response → store as target_folder
```

**CRITICAL RULES:**
- Tier 1 (Gate 3 carry-over) proceeds without confirmation per CLAUDE.md Memory Save Rule
- Tier 2 proposals MUST show the detected folder and ask for brief confirmation
- Tier 3 MUST wait for explicit user response before proceeding
- When ambiguous (files in multiple unrelated spec folders), ALWAYS ask — do not guess

---

# /memory:save

> Save current conversation context to a spec folder's memory directory with semantic indexing.

---

## 1. PURPOSE

Save the current conversation context, including session summary, key decisions, modified files, and trigger phrases, to a spec folder's `memory/` directory with semantic indexing for future retrieval.

**Key difference from `/memory:learn`:**
- `/memory:save` = Session context saved to `specs/*/memory/` (any tier)
- `/memory:learn` = Constitutional rules saved to `constitutional/` (always-surface tier)

---

## 2. CONTRACT

| Field   | Value                                                                                        |
| ------- | -------------------------------------------------------------------------------------------- |
| Input   | Spec folder path (from Gate 3 or `$ARGUMENTS`) + AI-composed JSON data                       |
| Output  | Memory file in `[spec]/memory/` + indexed in MCP                                             |
| Script  | `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js`               |
| Primary | **JSON mode:** `generate-context.js /tmp/save-context-data.json` or `--json '<data>'`        |
| Trigger | "save context", "save memory", `/memory:save`                                                |

---

## 3. QUICK REFERENCE

| Usage                                                  | Behavior                                                |
| ------------------------------------------------------ | ------------------------------------------------------- |
| `/memory:save`                                         | Auto-detect from session context, confirm if needed, then save |
| `/memory:save 011-memory`                              | Save to specific spec folder                            |
| `/memory:save specs/006-semantic-memory/003-debugging` | Save to nested spec folder                              |

---

## 4. VALIDATION

### Pre-Flight Checks (Phase 0)

Execute BEFORE folder validation to prevent data quality issues. All checks must pass.

#### Check 1: Anchor Format Validation

- Scan conversation for existing memory file references
- If memory files were read during session, verify they contain BOTH opening AND closing ANCHOR tags
- Pattern: `<!-- ANCHOR:id --> ... <!-- /ANCHOR:id -->`
- If missing closing tags → WARN user before proceeding
- Why: Broken anchors break section-specific retrieval (93% token waste)

#### Check 2: Duplicate Session Detection

- Call `spec_kit_memory_memory_stats({})`
- Compare `lastSessionHash` vs current conversation fingerprint
- If duplicate detected (same topic + timeframe < 1h):
  - WARN: "Recent save detected for this topic"
  - Show: Last save time, topic, file path
  - ASK: `[O]verwrite | [A]ppend | [N]ew file | [C]ancel`
  - WAIT for explicit response

#### Check 3: Token Budget Validation

- Estimate conversation size: `message_count * avg_tokens_per_message`
- If estimated > 50,000 tokens:
  - WARN: "Large conversation detected"
  - OPTIONS: `[C]ontinue anyway | [S]plit save | [E]dit scope`
  - WAIT for response

#### Check 4: Spec Folder Existence

- If `$ARGUMENTS` contains folder → validate exists, store as `pending_folder`
- If `$ARGUMENTS` empty → defer to Phase 1

#### Check 5: File Naming Conflict

- Generate filename: `{DD-MM-YY}_{HH-MM}__{topic}.md`
- If file already exists (and not duplicate from Check 2):
  - WARN: "Filename collision detected"
  - ASK: `[A]uto-increment | [R]ename | [O]verwrite`

#### Check 6: Stop Hook Double-Save Detection

- Check if a Claude Code Stop hook recently saved session context (within last 5 minutes)
- Detection method: look for hook state file at `${os.tmpdir()}/speckit-claude-hooks/<project-hash>/<sha256(session-id)[0:16]>.json` and check if `pendingStopSave.cachedAt` is within the last 5 minutes
- If recent auto-save detected:
  - WARN: "Stop hook already saved session context at [timestamp]"
  - ASK: `[M]erge (combine contexts) | [O]verwrite | [S]kip (trust hook save) | [C]ontinue as new`
- If no hook state found or state is stale (>5 min): PASSED (proceed normally)

**Phase 0 Output:**
```text
anchor_validation: PASSED | WARNED
duplicate_check:   PASSED | DUPLICATE_RESOLVED
token_budget:      PASSED | SPLIT_REQUESTED
folder_existence:  PASSED
filename_conflict:  PASSED | RENAMED_TO=[new_name]
stop_hook_check:   PASSED | DUPLICATE_RESOLVED
```

### Spec Folder Validation (Phase 1)

```text
IF target_folder already set (from $ARGUMENTS or Tier 1/2 auto-detection):
  → Validate folder exists → Proceed to Content Alignment Check
IF target_folder not yet set (Tier 3 pending):
  → WAIT for user response → Validate → Proceed
IF folder invalid:
  → Show available folders → ASK user → WAIT
```

**HARD STOP:** Do NOT proceed to save workflow until `target_folder` is set and validated.

#### Content Alignment Check

After Phase 1, validate the conversation topic matches the target folder:

- Extract conversation topic (subject, files modified, problem being solved)
- Compare to `target_folder` name
- If clear match → PASS
- If mismatch → WARN with alternatives:
  - Show: "Conversation topic: [topic]" / "Selected folder: [target_folder]"
  - Suggest top 3 alternative folders
  - ASK: `[C]ontinue | [1][2][3] alternatives | [N]ew folder`

---

## 5. WORKFLOW

### Step 1: Folder Detection

Use the `target_folder` value from Phase 1.

### Step 2: Context Analysis (AI MUST PERFORM)

**CRITICAL:** The AI agent MUST analyze the conversation and extract this data. The script does NOT auto-extract: the AI constructs this manually.

Extract from the current conversation:
- **Session summary**: 2-4 sentences describing what was accomplished
- **Key decisions**: Array of choices with rationale (format: "Decision: [choice] because [reason]")
- **Files modified**: Full paths to all files created/edited during session
- **Trigger phrases**: 5-10 keywords/phrases for future semantic search retrieval
- **Technical context**: Key technical details, patterns used, or implementation notes

### Step 3: Anchor Generation (MANDATORY)

Every memory file MUST include anchors for section-specific retrieval (enables 93% token savings).

**Anchor Format:**
```html
<!-- ANCHOR:anchor-id -->
Content for this section...
<!-- /ANCHOR:anchor-id -->
```

**Rules:**
- Use UPPERCASE `ANCHOR` (recommended, though lowercase works)
- **MUST include BOTH opening AND closing tags**: closing tag is REQUIRED
- No space after colon: `ANCHOR:id` not `ANCHOR: id`
- Without closing tag, extraction fails silently

**Anti-Pattern:**
```html
<!-- WRONG: No closing tag = anchor extraction fails -->
<!-- ANCHOR:summary -->
Content...
<!-- Missing closing tag! -->

<!-- CORRECT: Both tags present -->
<!-- ANCHOR:summary -->
Content...
<!-- /ANCHOR:summary -->
```

**Anchor ID Pattern:** `[context-type]-[keywords]-[spec-number]`

| Context Type     | Use For                  | Example                             |
| ---------------- | ------------------------ | ----------------------------------- |
| `implementation` | Code patterns, solutions | `implementation-oauth-callback-049` |
| `decision`       | Architecture choices     | `decision-database-schema-005`      |
| `research`       | Investigation findings   | `research-lenis-scroll-006`         |
| `discovery`      | Learnings, insights      | `discovery-api-limits-011`          |
| `general`        | Mixed content            | `general-session-summary-049`       |

**Minimum Anchors:** 1 required (primary section). Recommended: 2+ (summary + decisions/implementation).

**Standard Anchor Set:**
```markdown
<!-- ANCHOR:summary-[spec#] -->
## Session Summary
...
<!-- /ANCHOR:summary-[spec#] -->

<!-- ANCHOR:decision-[topic]-[spec#] -->
## Key Decisions
...
<!-- /ANCHOR:decision-[topic]-[spec#] -->

<!-- ANCHOR:files-[spec#] -->
## Files Modified
...
<!-- /ANCHOR:files-[spec#] -->
```

### Step 4: Create JSON Data (AI CONSTRUCTS THIS)

**CRITICAL:** The AI MUST construct this JSON from Step 2 analysis. The script requires proper JSON input to produce high-quality memory files.

**Required JSON Structure:**
```json
{
  "specFolder": "005-memory/010-feature-name",
  "sessionSummary": "Comprehensive description of what was accomplished. Include problem solved, approach taken, outcome achieved. 100+ chars.",
  "keyDecisions": [
    "Decision 1: Chose X because Y - provides Z benefit",
    "Decision 2: Selected A over B due to performance"
  ],
  "filesModified": [
    ".opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js",
    "specs/005-memory/010-feature-name/spec.md"
  ],
  "triggerPhrases": [
    "generate-context", "memory save", "JSON input",
    "context preservation", "session capture"
  ],
  "technicalContext": {
    "rootCause": "Description of the problem's root cause",
    "solution": "How it was solved",
    "patterns": "Key patterns or approaches used"
  },
  "toolCalls": [
    { "tool": "Read", "inputSummary": "Read generate-context.ts", "outputSummary": "612 lines, CLI entry point", "status": "success", "durationEstimate": "fast" },
    { "tool": "Edit", "inputSummary": "Updated Memory Save Rule in CLAUDE.md", "outputSummary": "Changed JSON-primary wording", "status": "success" }
  ],
  "exchanges": [
    { "userInput": "Implement the JSON-primary plan", "assistantResponse": "Updated CLAUDE.md, SKILL.md, session-types.ts, data-loader.ts with JSON-primary changes", "timestamp": "2026-03-20T12:00:00Z" }
  ]
}
```

**Field Guidelines:**

| Field              | Min Length | Purpose                                              |
| ------------------ | ---------- | ---------------------------------------------------- |
| `sessionSummary`   | 100+ chars | Becomes OVERVIEW: be comprehensive                   |
| `keyDecisions`     | 1+ items   | Each decision with rationale                         |
| `filesModified`    | 0+ items   | Actual paths modified                                |
| `triggerPhrases`   | 5-10 items | Keywords for semantic search                         |
| `technicalContext` | Optional   | Additional technical details                         |
| `toolCalls`        | Optional   | AI-summarized tool calls (richer than DB extraction) |
| `exchanges`        | Optional   | Key user-assistant exchanges during session          |

### Step 5: Execute Processing Script

| Mode                              | Command                                                           | Use When                                     |
| --------------------------------- | ----------------------------------------------------------------- | -------------------------------------------- |
| **JSON File** (standard)          | `node generate-context.js ${TMPDIR:-/tmp}/save-context-data.json` | Rich context with decisions, files, triggers |

> **Why JSON mode:** The AI has strictly better information about its own session than any database query can reconstruct. JSON mode eliminates wrong-session capture, multi-session ambiguity, and exchange pairing bugs.

> **Cross-Platform Note:** `${TMPDIR:-/tmp}` uses the system temp directory. On macOS/Linux this resolves to `/tmp` or `$TMPDIR`. On Windows (Git Bash/WSL), use `$TEMP` or `%TEMP%`.

> SECURITY: When using heredoc or --stdin, ensure JSON content is properly escaped. Prefer --json flag with single-quoted inline JSON or write to /tmp/save-context-data.json via Write tool first (exception to the Write tool exclusion: writing the intermediate JSON data file is permitted).

Write to `/tmp/save-context-data.json` (Write tool exception: intermediate JSON data file only) or use `--json`/`--stdin`, then execute:
```bash
TEMP_FILE="${TMPDIR:-/tmp}/save-context-data.json"

# 1. Write JSON data to the temp file
cat > "$TEMP_FILE" << 'EOF'
{ "specFolder": "...", "sessionSummary": "...", ... }
EOF

# 2. Execute the script
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js "$TEMP_FILE"

# 3. Clean up
rm "$TEMP_FILE"
```

**Expected Output (Success):**
```text
✓ Loaded conversation data
✓ Transformed manual format to MCP-compatible structure
✓ Found N messages
✓ Found N decisions
✓ Template populated (quality: 100/100)
✓ {filename}.md (300+ lines)
✓ Indexed as memory #NN
```

### File Output

**Naming:** `{DD-MM-YY}_{HH-MM}__{topic}.md`
Example: `08-12-25_12-30__semantic-memory.md`

**Location:** `specs/{spec-folder}/memory/{timestamp}__{topic}.md`

### Step 6: Report Results

Display the completion report (see Section 6).

---

## 6. COMPLETION REPORT

### Structured Response Envelope

```json
{
  "summary": "Memory saved successfully to specs/011-memory/memory/08-02-26_14-30__semantic-search.md",
  "data": {
    "status": "OK",
    "file_path": "specs/011-memory/memory/08-02-26_14-30__semantic-search.md",
    "spec_folder": "011-memory",
    "memory_id": 42,
    "indexing_status": "indexed",
    "anchors_created": ["summary-011", "decision-vector-search-011", "files-011"],
    "trigger_phrases": ["semantic search", "vector embeddings", "memory retrieval"],
    "file_size_kb": 12.4,
    "timestamp": "2026-02-01T14:30:00Z"
  },
  "hints": [
    "Use /memory:search to find this memory later",
    "Anchors enable 93% token savings when loading specific sections"
  ],
  "meta": {
    "command": "/memory:save",
    "duration_ms": 1247,
    "mcp_available": true,
    "deferred_indexing": false
  }
}
```

**Key Fields:**

| Field                    | Type     | Description                              |
| ------------------------ | -------- | ---------------------------------------- |
| `data.status`            | string   | "OK" or "FAIL"                           |
| `data.file_path`         | string   | Path to saved memory file                |
| `data.memory_id`         | number   | Database ID (null if deferred indexing)  |
| `data.indexing_status`   | string   | "indexed", "deferred", or "failed"       |
| `data.anchors_created`   | string[] | List of anchor IDs in the file           |
| `meta.deferred_indexing` | boolean  | Whether indexing was deferred to restart |

### Human-Friendly Display

```text
MEMORY:SAVE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Folder      <spec_folder>
  File        <file_path>
  Memory ID   #<memory_id>
  Indexing    <indexing_status>

→ Anchors ─────────────────────────────────── <count> created
  <anchor1>
  <anchor2>
  <anchor3>

→ Triggers ──────────────────────────────────────────
  <phrase1> · <phrase2> · <phrase3> · ...

─────────────────────────────────────────────────────
[t] edit triggers    [d] done

STATUS=OK PATH=<file_path> ANCHORS=<count>
```

### Post-Save Actions

| Input | Action                                            |
| ----- | ------------------------------------------------- |
| t     | Edit trigger phrases for this memory (add/remove) |
| d     | Done, exit save workflow                          |

### Trigger Edit (if selected)

```text
MEMORY:TRIGGERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Memory      #<id> "<memory_title>"

→ Current Triggers ─────────────────────────────────
  1) <phrase1>
  2) <phrase2>
  3) <phrase3>

─────────────────────────────────────────────────────
[a] add    [r] remove #    [s] save    [d] done

STATUS=OK ID=<id> TRIGGERS=<count>
```

---

## 7. ERROR HANDLING

| Condition               | Action                                          |
| ----------------------- | ----------------------------------------------- |
| No spec folder found    | Prompt user to create one                       |
| Folder not found        | Show available folders, ask user                |
| Topic-folder mismatch   | Warn, suggest alternatives, ask to confirm      |
| Empty conversation      | Return `STATUS=FAIL ERROR="No context to save"` |
| Script execution fails  | Show error, suggest manual save                 |
| Embedding fails         | File saved, will auto-index on MCP restart      |
| MCP unavailable         | File saved, indexing deferred to restart        |
| Duplicate session (<1h) | Warn, offer: Overwrite / Append / New / Cancel  |
| JSON not loaded         | Check temp file path and content format          |

---

## 8. NEXT STEPS

| Condition                    | Suggested Command                          | Reason                        |
| ---------------------------- | ------------------------------------------ | ----------------------------- |
| Context saved, continue work | Return to previous task                    | Memory preserved, continue    |
| Ending session               | `/spec_kit:handover [spec-folder-path]`    | Create full handover document |
| Search saved memories        | `/memory:search [query]`                | Find related context          |
| Start new work               | `/spec_kit:complete [feature-description]` | Begin new feature             |

**ALWAYS** end with: "Context saved. What would you like to do next?"

---

## 9. RELATED COMMANDS

- `/memory:search`: Intent-aware context retrieval and analysis tools
- `/memory:manage`: Database management, checkpoints, ingest
- `/memory:learn`: Constitutional memories
- `/spec_kit:resume`: Session recovery and continuation
- `/memory:manage shared`: Shared-memory spaces
- `/spec_kit:handover`: Full session handover document

---
<!-- APPENDIX: Reference material for AI agent implementation -->

## APPENDIX A: MCP TOOL REFERENCE

> **Tool Restriction (Memory Save Rule - HARD BLOCK):** `Write` and `Edit` tools are intentionally excluded from this command's `allowed-tools`. Memory files MUST be created via the `generate-context.js` script to ensure proper ANCHOR tags, SESSION SUMMARY table, and MEMORY METADATA YAML block. See AGENTS.md Memory Save Rule.

> **Mutation Ledger & Artifact Routing:** Every save operation is now recorded in the mutation ledger, an append-only audit trail that captures the file path, spec folder, timestamp, and indexing outcome. Artifact metadata associated with the saved memory may also be classified via artifact-class routing before indexing, ensuring consistent type tagging across the database.

### Enforcement Matrix

```text
STEP            REQUIRED CALLS                            ON FAILURE
─────────────── ───────────────────────────────────────── ──────────────
FOLDER DETECT   Bash (ls, CLI argument)                   Prompt user
CONTEXT SAVE    Bash (node generate-context.js)           Show error msg
IMMEDIATE INDEX spec_kit_memory_memory_save (optional)    Auto on restart
```

**Script Location:** `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js`

**Auto-Indexing:** Memory files in `specs/*/memory/` are automatically indexed on MCP server start. For immediate indexing:

```javascript
spec_kit_memory_memory_save({
  filePath: "specs/<folder>/memory/<filename>.md"
})
```

`memory_update({ id, triggerPhrases })`: Update trigger phrases on an existing memory file. Used by the `[t]` edit triggers action in the post-save review.

---

## APPENDIX B: ADVANCED REFERENCE

### Indexing Options

Four indexing methods are available: auto-indexing on MCP startup (default), `generate-context.js` (standard save workflow), `memory_save` (single file), and `memory_index_scan` (bulk). See full parameter references below.

#### Normalization Before Bulk Rebuild

When corpus-wide markdown metadata has changed (templates/spec docs/memory docs), run normalization before force re-index:

```bash
# Dry-run normalization
node .opencode/skill/system-spec-kit/scripts/dist/memory/backfill-frontmatter.js --dry-run --include-archive

# Apply normalization
node .opencode/skill/system-spec-kit/scripts/dist/memory/backfill-frontmatter.js --apply --include-archive

# Rebuild index after normalization
spec_kit_memory_memory_index_scan({ force: true })
```

Recommended order: **normalize → verify → rebuild**.

#### Deferred Indexing (Graceful Degradation)

When MCP is unavailable or embedding fails, the system uses deferred indexing:

1. Memory file is written to disk (ALWAYS succeeds)
2. Immediate indexing attempted via MCP
3. On failure: file remains on disk, auto-indexed on next MCP restart
4. File includes `indexing_status: deferred` metadata for tracking

**Manual Retry:**
```javascript
// Single file
spec_kit_memory_memory_save({ filePath: ".opencode/specs/.../memory/context.md", force: true })

// Single file (non-blocking embedding)
spec_kit_memory_memory_save({ filePath: ".opencode/specs/.../memory/context.md", asyncEmbedding: true })

// Entire folder
spec_kit_memory_memory_index_scan({ specFolder: "011-memory", force: true })
```

Note: `filePath` should be specified relative to the repository root (e.g., `.opencode/specs/.../memory/context.md`).

**Recovery Options:**

| Issue                  | Recovery                                                                                                                       |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| MCP server unreachable | Restart OpenCode to restart MCP server                                                                                         |
| Embedding timeout      | Use `memory_index_scan` with smaller batch                                                                                     |
| Corrupted file         | Read file, verify ANCHOR tags, re-save with corrections                                                                        |
| Database locked        | For database recovery, use `/memory:manage health` to diagnose issues and `/memory:manage checkpoint restore` to recover from a known-good state. Avoid manual file deletion. |

#### Full Parameter Reference: memory_save

| Parameter        | Type    | Default    | Description                                         |
| ---------------- | ------- | ---------- | --------------------------------------------------- |
| `filePath`       | string  | *required* | Absolute path to the memory file                    |
| `force`          | boolean | false      | Force re-index even if content hash unchanged       |
| `dryRun`         | boolean | false      | Validate only without saving                        |
| `skipPreflight`  | boolean | false      | Skip pre-flight validation checks (not recommended) |
| `asyncEmbedding` | boolean | false      | Defer embedding generation for non-blocking saves   |

#### Full Parameter Reference: memory_index_scan

| Parameter               | Type    | Default | Description                        |
| ----------------------- | ------- | ------- | ---------------------------------- |
| `force`                 | boolean | false   | Force re-index all files           |
| `specFolder`            | string  | -       | Limit scan to specific spec folder |
| `includeSpecDocs`       | boolean | true    | Include spec folder documents      |
| `includeConstitutional` | boolean | true    | Include constitutional rule files  |
| `incremental`           | boolean | true    | Skip unchanged files (mtime check) |

### Sub-Agent Delegation

The save workflow delegates execution to a sub-agent for token efficiency. The main agent handles folder validation and user interaction; the sub-agent handles context analysis and file generation.

#### Architecture

```text
Main Agent (reads command):
├── PHASE 0-1: Pre-flight + Spec Folder Validation
├── DISPATCH: Task tool with sub-agent
│   ├── Sub-agent analyzes conversation
│   ├── Sub-agent generates JSON data
│   ├── Sub-agent executes generate-context.js
│   └── Sub-agent returns result
├── FALLBACK (if Task unavailable):
│   └── Execute Steps 2-5 directly
└── Step 6: Report Results (always main agent)
```

#### Sub-Agent Dispatch

When phases pass, dispatch via Task tool:

- **subagent_type:** `general`
- **description:** "Save memory context"
- **prompt:** Include:
  1. `target_folder` and `alignment_validated` from phases
  2. Instructions for Steps 2-5 (context analysis → anchor generation → JSON construction → script execution)
  3. Expected return format: `{ status, file_path, memory_id, anchors_created, trigger_phrases, spec_folder }`

#### Fallback Logic

Fallback triggers if Task tool returns error, times out, or sub-agent returns `status: FAIL`.

**Fallback behavior:** Execute Steps 2-5 directly in the main agent context, then continue to Step 6.

| Benefit               | Description                                           |
| --------------------- | ----------------------------------------------------- |
| Token efficiency      | Heavy context extraction happens in sub-agent context |
| Main agent responsive | Validation and reporting stay lightweight             |
| Fallback safety       | Commands always work, even without Task tool          |

### Session Deduplication

Prevents redundant saves of the same conversation content (accidental duplicates, post-compaction saves, database bloat).

**Detection:** Generate SHA-256 fingerprint of (topic + files + timeframe), compare against most recent memory in target folder. If match AND time delta < 1 hour → DUPLICATE DETECTED. Delta 1-4h → suggest review. Delta > 4h → proceed normally.

**User Options on Duplicate:**

| Option        | File Action                         | Metadata                            |
| ------------- | ----------------------------------- | ----------------------------------- |
| **Overwrite** | Replace file content, keep filename | `dedup_status: duplicate_overwrite` |
| **Append**    | Merge sections, preserve anchors    | Update `related_sessions` array     |
| **New**       | Create new file with +1 minute      | `dedup_status: duplicate_new`       |
| **Cancel**    | No file created                     | No changes                          |

**Metadata** in YAML frontmatter: `session_hash`, `session_timestamp`, `previous_session_id`, `dedup_status`, `related_sessions[]`.

### Governance, Provenance & Retention

The `memory_save` tool schema advertises advanced governance parameters for multi-tenant, multi-agent, and compliance-aware deployments. These parameters are rollout-dependent: they take effect only when governance guardrails are enabled.

#### Governance Scoping

| Parameter | Type | Description |
|-----------|------|-------------|
| `tenantId` | string | Tenant boundary for governed ingest |
| `userId` | string | User boundary for governed ingest |
| `agentId` | string | Agent boundary for governed ingest |
| `sessionId` | string | Session boundary for governed ingest |
| `sharedSpaceId` | string | Shared-memory space for collaboration saves. Requires explicit membership (see `/memory:manage shared`) |

#### Provenance

| Parameter | Type | Description |
|-----------|------|-------------|
| `provenanceSource` | string | Required provenance source when governance guardrails are enabled |
| `provenanceActor` | string | Required provenance actor when governance guardrails are enabled |
| `governedAt` | string | ISO timestamp for governed ingest. Defaults to now when omitted |

#### Retention

| Parameter | Type | Description |
|-----------|------|-------------|
| `retentionPolicy` | string | Retention class: `keep` (permanent), `ephemeral` (short-lived), `shared` (shared-space lifecycle) |
| `deleteAfter` | string | Optional ISO timestamp after which retention sweep may delete the memory |

> **Note:** Governance parameters (tenantId, userId, agentId, sharedSpaceId) are validated by the memorySaveSchema when provided. All governance fields must pass schema validation.

#### Async Bulk Ingestion

For ingesting multiple files at once without blocking, use `/memory:manage ingest` instead:

```bash
# Start async ingestion of multiple files
/memory:manage ingest start /path/to/file1.md /path/to/file2.md --folder 007-auth

# Check progress
/memory:manage ingest status <jobId>
```

See `/memory:manage ingest` for the full async ingestion workflow.
