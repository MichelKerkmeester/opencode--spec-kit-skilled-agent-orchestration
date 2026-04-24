---
description: Save current conversation context into canonical spec-doc continuity surfaces with semantic indexing
argument-hint: "<spec-folder>"
allowed-tools: Read, Edit, Bash, Task, spec_kit_memory_memory_save, spec_kit_memory_memory_index_scan, spec_kit_memory_memory_stats, spec_kit_memory_memory_update
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

    TIER 1: Gate 3 Carry-Over (highest confidence - no confirmation needed)
    - Check if a spec folder was established via Gate 3 earlier in this conversation
    - If yes → use it directly as target_folder (per CLAUDE.md Memory Save Rule)
    - Announce: "Using active spec folder from this session: [folder]"

    TIER 2: Conversation Signal Analysis (high confidence - confirm)
    - Scan files modified/read during this conversation
    - Map file paths to spec folders:
      * Files under specs/NNN-name/ or its children
      * Files referenced in a spec folder's description.json
      * Supporting docs (feature_catalog, manual_testing_playbook) linked via symlinks to a spec tree
    - If ALL modified files map to a single spec folder (or one parent and its children):
      → Propose: "Based on this session's work, the target folder is [folder]. Saving there. [Y/n]"
      → If user confirms or does not object → store as target_folder
    - If modified files span multiple unrelated spec folders → proceed to Tier 3

    TIER 3: Guided Selection (fallback - must ask)
    - List the spec folders touched in this conversation, ranked by file-edit count
    - ASK: "Multiple spec folders were touched. Which one should this context be saved to?"
    - If no spec folders detected at all → list recent/related spec folders and ask
    - WAIT for user response → store as target_folder
```

**CRITICAL RULES:**
- Tier 1 (Gate 3 carry-over) proceeds without confirmation per CLAUDE.md Memory Save Rule
- Tier 2 proposals MUST show the detected folder and ask for brief confirmation
- Tier 3 MUST wait for explicit user response before proceeding
- When ambiguous (files in multiple unrelated spec folders), ALWAYS ask - do not guess

---

# /memory:save

> Save current conversation context into the packet's canonical continuity surfaces with semantic indexing.

---

## 1. INSTRUCTIONS

Resolve the target spec folder first, build structured JSON from the session evidence, then run the save workflow below. Prefer canonical packet docs and `_memory.continuity` over any legacy supporting artifacts.

---

## 2. PURPOSE

Save the current conversation context, including session summary, key decisions, modified files, and trigger phrases, into the packet's canonical continuity surfaces so `/spec_kit:resume` and `/memory:search` read the same source of truth.

**Key difference from `/memory:learn`:**
- `/memory:save` = Session context routed into canonical packet docs and `_memory.continuity`
- `/memory:learn` = Constitutional rules saved to `constitutional/` (always-surface tier)

### Canonical Routing Model

- `handover.md` remains the top recovery document for active-session state and pending work.
- `_memory.continuity` stores the compact continuity block used by `/spec_kit:resume`.
- AI may directly edit `_memory.continuity` frontmatter blocks in `implementation-summary.md` when only those doc-local continuity hints need updating.
- Canonical spec docs such as `implementation-summary.md` and `decision-record.md` receive the durable narrative content when the route applies.
- `generate-context.js` remains the primary save mechanism when the workflow also needs DB indexing, embedding generation, `description.json` refresh, `graph-metadata.json` refresh, or anchor-managed compatibility output.
- Canonical save requests now default to **planner-first** behavior: return the routed target, proposed edit summary, blockers, advisories, and follow-up actions before any mutation-first apply path is requested.
- Explicit fallback remains available with `plannerMode: "full-auto"` or CLI `--full-auto` when an operator wants the legacy atomic writer behavior.
- Standalone memory markdown is not the primary operator-facing destination for this command.

### Handover Document Maintenance

`/memory:save` is the canonical maintainer for `handover.md` through `handover_state` routing. When a packet does not already contain `handover.md`, create it from `.opencode/skill/system-spec-kit/templates/handover.md`, then merge subsequent stop-state updates into `handover.md::session-log` while keeping `_memory.continuity` aligned for `/spec_kit:resume`.

### Routed Save Categories

The canonical save router works with 8 categories:

| Category | Typical target | Notes |
| -------- | -------------- | ----- |
| `narrative_progress` | `implementation-summary.md::what-built` | What changed in the system or packet |
| `narrative_delivery` | `implementation-summary.md::how-delivered` | Sequencing, gating, rollout, and verification story |
| `decision` | `decision-record.md::adr-NNN` on L3/L3+ or `implementation-summary.md::decisions` on L1/L2 | Choice, tradeoff, rationale |
| `handover_state` | `handover.md::session-log` | Stop-state, blockers, recent action, next safe action. Use `.opencode/skill/system-spec-kit/templates/handover.md` for initial creation when `handover.md` does not exist. |
| `research_finding` | `research/research.md::findings` | Evidence, investigation result, cited upstream behavior |
| `task_update` | `tasks.md::<phase-anchor>` | Checklist/task status mutation |
| `metadata_only` | `_memory.continuity` in frontmatter | Machine-owned continuity payloads |
| `drop` | `scratch/pending-route-<hash>.json` via refusal | Non-canonical transcript/tooling noise; never auto-merged |

Routing tiers:

- Tier 1 handles structured routes and strong heuristics.
- Tier 2 uses prototype similarity against the frozen routing library.
- Tier 3 is part of the live save handler by default. When `LLM_REFORMULATION_ENDPOINT` is reachable and returns a usable decision, it participates automatically; if that endpoint is unavailable or unusable, the save path falls back to Tier 2 with a confidence penalty when safe, otherwise it refuses the merge.

Boundary rules:

- Delivery cues are now stronger when the chunk mentions sequencing, gating, rollout, or verification.
- Handover keeps state-first stop/resume notes even if they mention soft operational commands like `git diff`, `list memories`, or `force re-index`.
- Hard transcript, telemetry, and wrapper scaffolding still route to `drop`.

Override and context rules:

- `routeAs` can force any of the 8 categories. The router preserves the natural decision for audit and warns if an override is accepted against a natural `drop`.
- Router context passes `packet_kind` derived from spec metadata first (`type`, `title`, `description`), with parent-phase fallback only when the metadata is silent.

---

## 3. CONTRACT

| Field   | Value                                                                                        |
| ------- | -------------------------------------------------------------------------------------------- |
| Input   | Spec folder path (from Gate 3 or `$ARGUMENTS`) + AI-composed JSON data                       |
| Output  | Canonical spec-doc continuity updates + indexed continuity data. Also refreshes `graph-metadata.json` derived fields in the spec folder: `trigger_phrases` are deduplicated and capped at 12, `key_files` are sanitized before storage, `entities` are deduplicated with canonical-path preference, and `status` is checklist-aware and normalized to lowercase. |
| Script  | `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js`               |
| Primary | **JSON mode:** `generate-context.js <json-data-path>` (e.g. a path under `$TMPDIR` or `/tmp/save-context-data-<session-id>.json`) or `--json '<data>'` |
| Trigger | "save context", "save memory", `/memory:save`                                                |

Planner behavior:
- Default: `plan-only` for canonical save requests, with explicit follow-up actions such as `apply`, `refresh-graph`, and `reindex`
- Fallback: `full-auto` restores the legacy mutation-first canonical writer
- Deferred freshness actions: graph refresh and spec-doc reindex are surfaced as follow-ups instead of assumed default side effects

---

## 4. QUICK REFERENCE

| Usage                                                  | Behavior                                                |
| ------------------------------------------------------ | ------------------------------------------------------- |
| `/memory:save`                                         | Auto-detect the active packet, confirm if needed, then route into canonical continuity targets |
| `/memory:save 011-memory`                              | Save to a specific spec folder                          |
| `/memory:save specs/006-semantic-memory/003-debugging` | Save to a nested spec folder                            |
| `node .../generate-context.js --full-auto ...`         | Opt back into the legacy full-auto canonical apply path |

---

## 5. VALIDATION

### Pre-Flight Checks (Phase 0)

Execute BEFORE folder validation to prevent data quality issues. All checks must pass.

#### Check 1: Anchor Format Validation

- Scan conversation for existing canonical spec-doc references
- If any canonical spec documents (`decision-record.md`, `implementation-summary.md`, `handover.md`, `resource-map.md`) were read during the session, verify they contain BOTH opening AND closing ANCHOR tags
- Pattern: `<!-- ANCHOR:id --> ... <!-- /ANCHOR:id -->`
- If missing closing tags → WARN user before proceeding
- Why: Broken anchors break section-specific retrieval (93% token waste)

#### Check 2: Token Budget Validation

- Estimate conversation size: `message_count * avg_tokens_per_message`
- If estimated > 50,000 tokens:
  - WARN: "Large conversation detected"
  - OPTIONS: `[C]ontinue anyway | [S]plit save | [E]dit scope`
  - WAIT for response

#### Check 3: Spec Folder Existence

- If `$ARGUMENTS` contains folder → validate exists, store as `pending_folder`
- If `$ARGUMENTS` empty → defer to Phase 1

#### Check 4: Stop Hook Awareness

- Confirm whether recent hook-driven context preservation evidence exists for this session
- Current limitation: no dedicated `pendingStopSave` field is shipped in the hook state, so `/memory:save` must not claim a guaranteed auto-save merge marker
- If no recent hook-save evidence can be established: PASSED (proceed normally)

**Phase 0 Output:**
```text
anchor_validation: PASSED | WARNED
token_budget:      PASSED | SPLIT_REQUESTED
folder_existence:  PASSED
stop_hook_check:   PASSED
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

## 6. WORKFLOW

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

Every generated canonical spec document MUST include anchors for section-specific retrieval (enables 93% token savings).

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

**CRITICAL:** The AI MUST construct this JSON from Step 2 analysis. The script requires proper JSON input to produce high-quality canonical spec-doc updates across decision-record.md, implementation-summary.md, and handover.md.

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
    { "tool": "Read", "inputSummary": "Read scripts/dist/memory/generate-context.js", "outputSummary": "Runtime CLI entry point verified for JSON-mode saves", "status": "success", "durationEstimate": "fast" },
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
| `triggerPhrases`   | 5-12 items | Keywords for semantic search. Parser-enforced cap at 12. |
| `technicalContext` | Optional   | Additional technical details                         |
| `toolCalls`        | Optional   | AI-summarized tool calls (richer than DB extraction) |
| `exchanges`        | Optional   | Key user-assistant exchanges during session          |

### Step 5: Execute Processing Script

| Mode                              | Command                                                           | Use When                                     |
| --------------------------------- | ----------------------------------------------------------------- | -------------------------------------------- |
| **JSON File** (standard)          | `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js ${TMPDIR:-/tmp}/save-context-data.json <spec-folder>` | Rich context with decisions, files, triggers |

> **Why JSON mode:** The AI has strictly better information about its own session than any database query can reconstruct. JSON mode eliminates wrong-session capture, multi-session ambiguity, and exchange pairing bugs.

> **026 Memory Quality (Post-Save Review):** After `generate-context.js` completes, it outputs a POST-SAVE QUALITY REVIEW. HIGH-severity issues (stale titles, weak trigger phrases, wrong importance tier) MUST be patched via Edit tool immediately. MEDIUM issues should be patched when practical. Trigger phrases are sanitized: generic phrases (e.g., "context", "session") are flagged for replacement with domain-specific terms per 026-003-009/010 trigger sanitization rules.

> **Graph metadata refresh:** The same save pass refreshes `graph-metadata.json` with checklist-aware status fallback (`implementation-summary.md` presence + checklist completion), lowercase status normalization, sanitized `key_files`, deduplicated entities, and a 12-item cap on derived trigger phrases.

> **Auto-index of touched files (Step 11.5):** After the canonical save updates packet docs and `graph-metadata.json`, the workflow runs an incremental `memory_index_scan` scoped to the target spec folder. This re-indexes any canonical spec docs (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, `handover.md`, `research/research.md`, `resource-map.md`) and `graph-metadata.json` that were modified earlier in the session. Incremental mode skips unchanged files cheaply via mtime + content-hash checks.
>
> Kill switches: `SPECKIT_AUTO_INDEX_TOUCHED=false` (targeted opt-out) or `SPECKIT_INDEX_SPEC_DOCS=false` (existing global opt-out) disables Step 11.5. The backend has a 51s cooldown between scans; when a save fires during cooldown, Step 11.5 logs `skipped (scan cooldown active; retry on next save)` and continues — the index catches up on the next save.

> **Cross-Platform Note:** `${TMPDIR:-/tmp}` uses the system temp directory. On macOS/Linux this resolves to `/tmp` or `$TMPDIR`. On Windows (Git Bash/WSL), use `$TEMP` or `%TEMP%`.

> SECURITY: When using heredoc or --stdin, ensure JSON content is properly escaped. Prefer --json flag with single-quoted inline JSON or write to /tmp/save-context-data-<session-id>.json via Write tool first (exception to the Write tool exclusion: writing the intermediate JSON data file is permitted).

Write to `/tmp/save-context-data-<session-id>.json` (Write tool exception: intermediate JSON data file only) or use `--json`/`--stdin`, then execute:
```bash
TEMP_FILE="${TMPDIR:-/tmp}/save-context-data.json"

# 1. Write JSON data to the temp file
cat > "$TEMP_FILE" << 'EOF'
{ "specFolder": "...", "sessionSummary": "...", ... }
EOF

# 2. Execute the script
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js "$TEMP_FILE" specs/###-folder/

# 3. Clean up
rm "$TEMP_FILE"
```

**Expected Output (Success):**
```text
✓ Loaded conversation data
✓ Transformed manual format to MCP-compatible structure
✓ Found N messages
✓ Found N decisions
✓ Routed canonical targets prepared
✓ Continuity surfaces updated
✓ Indexed continuity data
```

### File Output

**Primary result:** canonical packet docs and `_memory.continuity` are updated in-place for the selected spec folder.

**Typical targets:**
- `handover.md`
- `implementation-summary.md`
- `decision-record.md`
- frontmatter `_memory.continuity`
- `graph-metadata.json`

If compatibility artifacts are emitted during migration cleanup, they remain secondary to the canonical packet update and should not be treated as the source of truth.

### Step 6: Report Results

Display the completion report (see Section 6).

---

## 7. COMPLETION REPORT

### Structured Response Envelope

```json
{
  "summary": "Context saved successfully into the canonical continuity surfaces for specs/011-memory",
  "data": {
    "status": "OK",
    "spec_folder": "011-memory",
    "targets_updated": [
      "handover.md",
      "implementation-summary.md",
      "_memory.continuity"
    ],
    "indexing_status": "indexed",
    "anchors_updated": ["summary-011", "decision-vector-search-011", "files-011"],
    "trigger_phrases": ["semantic search", "vector embeddings", "memory retrieval"],
    "timestamp": "2026-02-01T14:30:00Z"
  },
  "hints": [
    "Use /memory:search to find the updated packet context later",
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
| `data.targets_updated`   | string[] | Canonical packet targets updated         |
| `data.indexing_status`   | string   | "indexed", "deferred", or "failed"       |
| `data.anchors_updated`   | string[] | List of anchor IDs updated or created    |
| `meta.deferred_indexing` | boolean  | Whether indexing was deferred to restart |

### Human-Friendly Display

```text
MEMORY:SAVE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Folder      <spec_folder>
  Targets     <target_1>, <target_2>, <target_3>
  Indexing    <indexing_status>

→ Anchors ─────────────────────────────────── <count> updated
  <anchor1>
  <anchor2>
  <anchor3>

→ Triggers ──────────────────────────────────────────
  <phrase1> · <phrase2> · <phrase3> · ...

─────────────────────────────────────────────────────
[t] edit triggers    [d] done

STATUS=OK TARGETS=<count> ANCHORS=<count>
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

## 8. ERROR HANDLING

| Condition               | Action                                          |
| ----------------------- | ----------------------------------------------- |
| No spec folder found    | Prompt user to create one                       |
| Folder not found        | Show available folders, ask user                |
| Topic-folder mismatch   | Warn, suggest alternatives, ask to confirm      |
| Empty conversation      | Return `STATUS=FAIL ERROR="No context to save"` |
| Script execution fails  | Show error, suggest manual save                 |
| Embedding fails         | Canonical docs updated, will auto-index on MCP restart |
| MCP unavailable         | Canonical docs updated, indexing deferred to restart   |
| JSON not loaded         | Check temp file path and content format          |

---

## 9. NEXT STEPS

| Condition                    | Suggested Command                          | Reason                        |
| ---------------------------- | ------------------------------------------ | ----------------------------- |
| Context saved, continue work | Return to previous task                    | Memory preserved, continue    |
| Ending session               | `/memory:save [spec-folder-path]`           | Update `handover.md` through `handover_state` routing |
| Search saved memories        | `/memory:search [query]`                | Find related context          |
| Start new work               | `/spec_kit:complete [feature-description]` | Begin new feature             |

**ALWAYS** end with: "Context saved. What would you like to do next?"

---

## 10. RELATED COMMANDS

- `/memory:search`: Intent-aware context retrieval and analysis tools
- `/memory:manage`: Database management, checkpoints, ingest
- `/memory:learn`: Constitutional memories
- `/spec_kit:resume`: Session recovery and continuation

---
<!-- APPENDIX: Reference material for AI agent implementation -->

## APPENDIX A: MCP TOOL REFERENCE

> **Tool Restriction (Memory Save Rule - HARD BLOCK):** `Write` remains intentionally excluded. `Edit` is allowed only for direct `_memory.continuity` frontmatter updates inside `implementation-summary.md`. Use `generate-context.js` for indexed saves, embedding generation, `description.json` refresh, `graph-metadata.json` refresh, and anchor-managed canonical spec-doc routing. Standalone `memory/*.md` files are retired and the runtime rejects them. See AGENTS.md Memory Save Rule.

> **Mutation Ledger & Artifact Routing:** Every save operation is now recorded in the mutation ledger, an append-only audit trail that captures the file path, spec folder, timestamp, and indexing outcome. Artifact metadata associated with the saved memory may also be classified via artifact-class routing before indexing, ensuring consistent type tagging across the database.

### Enforcement Matrix

```text
STEP            REQUIRED CALLS                            ON FAILURE
─────────────── ───────────────────────────────────────── ──────────────
FOLDER DETECT   Bash (ls, CLI argument)                   Prompt user
CONTEXT SAVE    Bash (node generate-context.js)           Show error msg
IMMEDIATE INDEX spec_kit_memory_memory_index_scan (optional) Show error msg
```

**Script Location:** `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js`

**Immediate indexing:** Canonical spec-doc surfaces participate in spec-doc indexing. If you need fresh retrieval immediately after a save, run a targeted index scan:

```javascript
spec_kit_memory_memory_index_scan({
  specFolder: "011-memory",
  includeSpecDocs: true,
  force: true
})
```

`memory_update({ id, triggerPhrases })`: Update trigger phrases on an existing indexed canonical spec document. Used by the `[t]` edit triggers action in the post-save review.

---

## APPENDIX B: ADVANCED REFERENCE

### Indexing Options

Four indexing methods are available: auto-indexing on MCP startup (default), `generate-context.js` (standard save workflow), `memory_save` (single file), and `memory_index_scan` (bulk). See full parameter references below.

#### Normalization Before Bulk Rebuild

When corpus-wide markdown metadata has changed, run normalization before force re-index:

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

When MCP is unavailable or embedding fails, the canonical document update still lands on disk. Follow with a targeted `memory_index_scan` after MCP recovery so the updated spec docs and continuity anchors are discoverable across retrieval channels.

**Manual Retry:**
```javascript
// Entire folder
spec_kit_memory_memory_index_scan({ specFolder: "011-memory", force: true })
```

**Recovery Options:**

| Issue                  | Recovery                                                                                                                       |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| MCP server unreachable | Restart OpenCode to restart MCP server. Post-026: run `memory_health()` after restart to verify all retrieval channels (graph, vector, FTS5) are operational |
| Embedding timeout      | Use `memory_index_scan` with smaller batch                                                                                     |
| Corrupted file         | Read file, verify ANCHOR tags, re-save with corrections                                                                        |
| Database locked        | For database recovery, use `/memory:manage health` to diagnose issues and `/memory:manage checkpoint restore` to recover from a known-good state. Avoid manual file deletion. |

#### Full Parameter Reference: memory_save

| Parameter        | Type    | Default    | Description                                         |
| ---------------- | ------- | ---------- | --------------------------------------------------- |
| `filePath`       | string  | *required* | Absolute path to the generated canonical spec document |
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

### Governance, Provenance & Retention

The `memory_save` tool schema advertises advanced governance parameters for multi-tenant, multi-agent, and compliance-aware deployments. These parameters take effect only when governance guardrails are enabled.

#### Governance Scoping

| Parameter | Type | Description |
|-----------|------|-------------|
| `tenantId` | string | Tenant boundary for governed ingest |
| `userId` | string | User boundary for governed ingest |
| `agentId` | string | Agent boundary for governed ingest |
| `sessionId` | string | Session boundary for governed ingest |

#### Provenance

| Parameter | Type | Description |
|-----------|------|-------------|
| `provenanceSource` | string | Required provenance source when governance guardrails are enabled |
| `provenanceActor` | string | Required provenance actor when governance guardrails are enabled |
| `governedAt` | string | ISO timestamp for governed ingest. Defaults to now when omitted |

#### Retention

| Parameter | Type | Description |
|-----------|------|-------------|
| `retentionPolicy` | string | Retention class: `keep` (permanent), `ephemeral` (short-lived), `shared` (reserved compatibility value) |
| `deleteAfter` | string | Optional ISO timestamp after which retention sweep may delete the memory |

> **Note:** Governance parameters (tenantId, userId, agentId, sessionId) are validated by the memorySaveSchema when provided. All governance fields must pass schema validation.

#### Async Bulk Ingestion

For ingesting multiple files at once without blocking, use `/memory:manage ingest` instead:

```bash
# Start async ingestion of multiple files
/memory:manage ingest start /path/to/file1.md /path/to/file2.md --folder 007-auth

# Check progress
/memory:manage ingest status <jobId>
```

See `/memory:manage ingest` for the full async ingestion workflow.
