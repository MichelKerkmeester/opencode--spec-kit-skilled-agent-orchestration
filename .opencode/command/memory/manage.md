---
description: Manage memory database and shared-memory lifecycle - stats, scan, cleanup, bulk-delete, tier, triggers, validate, delete, health, checkpoint, ingest, and shared-space operations
argument-hint: "[scan [--force]] | [cleanup] | [bulk-delete <tier> [--older-than <days>] [--folder <spec>]] | [tier <id> <tier>] | [triggers <id>] | [validate <id> <useful|not>] | [delete <id>] | [health] | [checkpoint <subcommand>] | [ingest <subcommand>] | [shared <enable|create|member|status> ...]"
allowed-tools: Read, spec_kit_memory_memory_stats, spec_kit_memory_memory_list, spec_kit_memory_memory_search, spec_kit_memory_memory_index_scan, spec_kit_memory_memory_validate, spec_kit_memory_memory_update, spec_kit_memory_memory_delete, spec_kit_memory_memory_bulk_delete, spec_kit_memory_memory_health, spec_kit_memory_checkpoint_create, spec_kit_memory_checkpoint_restore, spec_kit_memory_checkpoint_list, spec_kit_memory_checkpoint_delete, spec_kit_memory_memory_ingest_start, spec_kit_memory_memory_ingest_status, spec_kit_memory_memory_ingest_cancel, spec_kit_memory_shared_space_upsert, spec_kit_memory_shared_space_membership_set, spec_kit_memory_shared_memory_status, spec_kit_memory_shared_memory_enable
---

# 🚨 MANDATORY FIRST ACTION - DO NOT SKIP

> **NEVER use Bash to query the database directly. NEVER run `sqlite3` commands.**
> All database access MUST go through the `spec_kit_memory_*` MCP tools listed in `allowed-tools`.
> If an MCP tool returns an error, report the error to the user: do NOT fall back to raw SQL via Bash.

**STATUS: BLOCKED** (until argument is parsed)

```text
BEFORE executing ANY workflow:

1. PARSE $ARGUMENTS to determine mode
2. VALIDATE mode is recognized (stats, scan, cleanup, bulk-delete, tier, triggers, validate, delete, health, checkpoint, ingest, shared)
   - IF $ARGUMENTS is empty → mode = "stats" (default)
3. For modes requiring <id>: VERIFY id is provided and numeric
4. For modes requiring <name>: VERIFY name is provided

IF mode unrecognized:
  → STATUS=FAIL ERROR="Unknown mode: <mode>. Valid: scan, cleanup, bulk-delete, tier, triggers, validate, delete, health, checkpoint, ingest, shared"

IF required parameter missing:
  → STATUS=FAIL ERROR="Missing required parameter for <mode>"
```

---

# Memory Management Command

Unified management interface for the memory database and shared-memory lifecycle: scan for new files, cleanup old memories, bulk-delete by tier, change tiers, edit triggers, validate usefulness, delete entries, check health, manage checkpoints, run async ingest, and manage shared spaces.

```yaml
role: Memory Database Administrator
purpose: Unified management interface for memory database maintenance, checkpoint operations, async ingest, and shared-memory lifecycle management
action: Route through scan, cleanup, bulk-delete, tier, triggers, validate, delete, health, checkpoint, ingest, or shared based on arguments
operating_mode:
  workflow: interactive_management
  approvals: cleanup_delete_restore_require_confirmation
```

---

## 1. PURPOSE

Provide a unified interface for memory database **management** operations:
- Indexing new files and scanning for updates
- Cleanup of old or deprecated memories
- Tier management and trigger editing
- Validation feedback and deletion
- Health checks and diagnostics
- Checkpoint creation, restoration, listing, and deletion
- Shared-memory setup, shared-space creation, membership changes, and rollout inspection

**Separation from `/memory:search`:**
- `/memory:search` = RETRIEVAL + ANALYSIS (intent-aware search, epistemic baselines, causal graph, evaluation)
- `/memory:manage` = MANAGEMENT + SHARED-MEMORY LIFECYCLE (modify, delete, maintain, checkpoint, ingest, shared spaces)

---

## 2. CONTRACT

**Inputs:** `$ARGUMENTS`: Mode keyword with optional parameters
**Outputs:** `STATUS=<OK|FAIL>` with mode-specific output

### Argument Patterns

| Pattern                                  | Mode              | Example                                                |
| ---------------------------------------- | ----------------- | ------------------------------------------------------ |
| (empty)                                  | Stats             | `/memory:manage`                                       |
| `scan`                                   | Scan              | `/memory:manage scan`                                  |
| `scan --force`                           | Force Scan        | `/memory:manage scan --force`                          |
| `cleanup`                                | Cleanup           | `/memory:manage cleanup`                               |
| `bulk-delete <tier>`                     | Bulk Delete       | `/memory:manage bulk-delete deprecated`                |
| `bulk-delete <tier> --older-than <days>` | Bulk Delete       | `/memory:manage bulk-delete temporary --older-than 30` |
| `bulk-delete <tier> --folder <spec>`     | Bulk Delete       | `/memory:manage bulk-delete normal --folder 007-auth`  |
| `tier <id> <tier>`                       | Tier Change       | `/memory:manage tier 42 critical`                      |
| `triggers <id>`                          | Edit Triggers     | `/memory:manage triggers 42`                           |
| `validate <id> useful`                   | Validate          | `/memory:manage validate 42 useful`                    |
| `validate <id> not`                      | Validate          | `/memory:manage validate 42 not`                       |
| `delete <id>`                            | Delete            | `/memory:manage delete 42`                             |
| `health`                                 | Health            | `/memory:manage health`                                |
| `checkpoint create <name>`               | Create Checkpoint | `/memory:manage checkpoint create before-refactor`     |
| `checkpoint restore <name>`              | Restore           | `/memory:manage checkpoint restore before-refactor`    |
| `checkpoint list`                        | List Checkpoints  | `/memory:manage checkpoint list`                       |
| `checkpoint delete <name>`               | Delete Checkpoint | `/memory:manage checkpoint delete old-checkpoint`      |
| `ingest start <path1> [path2 ...]`       | Start Ingest      | `/memory:manage ingest start /path/file.md`            |
| `ingest status <jobId>`                  | Ingest Status     | `/memory:manage ingest status abc-123`                 |
| `ingest cancel <jobId>`                  | Cancel Ingest     | `/memory:manage ingest cancel abc-123`                 |
| `shared`                                 | Shared Overview   | `/memory:manage shared`                                |
| `shared enable`                          | Enable Shared     | `/memory:manage shared enable`                         |
| `shared create <spaceId> <tenantId> <name> (--actor-user <id> \| --actor-agent <id>)` | Create Shared Space | `/memory:manage shared create team-alpha tenant-1 "Team Alpha" --actor-user user-1` |
| `shared member <spaceId> <tenantId> <subjectType> <subjectId> <role> (--actor-user <id> \| --actor-agent <id>)` | Set Membership | `/memory:manage shared member team-alpha tenant-1 user user-42 editor --actor-user user-1` |
| `shared status [--tenant <id>] (--actor-user <id> \| --actor-agent <id>)` | Shared Status | `/memory:manage shared status --tenant tenant-1 --actor-user user-42` |

### Importance Tiers

| Tier           | Description                        |
| -------------- | ---------------------------------- |
| constitutional | Universal rules (~2000 tokens max) |
| critical       | Architecture, core patterns        |
| important      | Key implementations                |
| normal         | General context                    |
| temporary      | Short-term, WIP                    |
| deprecated     | Mark as outdated                   |

---

## 3. QUICK REFERENCE

| Command                                                | Result                    |
| ------------------------------------------------------ | ------------------------- |
| `/memory:manage`                                       | Stats dashboard           |
| `/memory:manage scan`                                  | Index new files           |
| `/memory:manage scan --force`                          | Re-index all files        |
| `/memory:manage cleanup`                               | Cleanup old memories      |
| `/memory:manage bulk-delete deprecated`                | Delete all deprecated     |
| `/memory:manage bulk-delete temporary --older-than 30` | Delete temporary >30 days |
| `/memory:manage tier 42 critical`                      | Change tier               |
| `/memory:manage triggers 42`                           | Edit triggers             |
| `/memory:manage validate 42 useful`                    | Mark as useful            |
| `/memory:manage validate 42 not`                       | Mark as not useful        |
| `/memory:manage delete 42`                             | Delete memory             |
| `/memory:manage health`                                | System health check       |
| `/memory:manage checkpoint create "name"`              | Save memory state         |
| `/memory:manage checkpoint restore "name"`             | Restore to saved state    |
| `/memory:manage checkpoint list`                       | Show all checkpoints      |
| `/memory:manage checkpoint delete "name"`              | Remove checkpoint         |
| `/memory:manage ingest start /path/file.md`            | Start async ingest job    |
| `/memory:manage ingest status abc-123`                 | Check ingest progress     |
| `/memory:manage ingest cancel abc-123`                 | Cancel ingest job         |
| `/memory:manage shared`                                | Shared overview           |
| `/memory:manage shared enable`                         | Enable shared memory      |
| `/memory:manage shared create ...`                     | Create or update shared space |
| `/memory:manage shared member ...`                     | Set shared-space membership |
| `/memory:manage shared status`                         | Inspect rollout status    |

---

## 4. ARGUMENT ROUTING

```text
$ARGUMENTS
    │
    ├─ Empty (no args)       → STATS DASHBOARD (Section 5)
    ├─ "scan [--force]"      → SCAN MODE (Section 6)
    ├─ "cleanup"             → CLEANUP MODE (Section 7)
    ├─ "bulk-delete <tier>"  → BULK DELETE MODE (Section 8)
    ├─ "tier <id> <tier>"    → TIER MANAGEMENT (Section 9)
    ├─ "triggers <id>"       → TRIGGER EDIT (Section 10)
    ├─ "validate <id> <u|n>" → VALIDATE MODE (Section 11)
    ├─ "delete <id>"         → DELETE MODE (Section 12)
    ├─ "health"              → HEALTH CHECK (Section 13)
    ├─ "checkpoint <sub>"    → CHECKPOINT OPERATIONS (Section 14)
    │   ├─ "create <name>"   → Create snapshot
    │   ├─ "restore <name>"  → Restore (confirmation required)
    │   ├─ "list"            → List snapshots
    │   └─ "delete <name>"   → Delete snapshot
    ├─ "ingest <sub>"       → INGEST MODE (Section 15)
    │   ├─ "start <paths>"   → Start async job
    │   ├─ "status <jobId>"  → Check progress
    │   └─ "cancel <jobId>"  → Cancel running job
    └─ "shared <sub>"       → SHARED MEMORY LIFECYCLE (Section 16)
        ├─ "enable"          → First-time setup
        ├─ "create ..."      → Create or update shared space
        ├─ "member ..."      → Set shared-space membership
        └─ "status ..."      → Inspect rollout state
```

---

## 5. STATS DASHBOARD

**Trigger:** `/memory:manage` with no arguments

Call `memory_stats()` and `memory_list({ limit: 10, sortBy: "updated_at" })` in parallel. Display:

```text
MEMORY:STATS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Total       <N>
  Size        <size>
  Indexed     <date>

→ Tier Distribution ────────────────────────────────
  constitutional  ██░░░░░░░░  <N>
  critical        ████░░░░░░  <N>
  important       ██████░░░░  <N>
  normal          █████████░  <N>
  temporary       ██░░░░░░░░  <N>
  deprecated      █░░░░░░░░░  <N>

→ Top Folders ──────────────────────────────────────
  <folder-1>  █████████░  <N>
  <folder-2>  ██████░░░░  <N>
  <folder-3>  ████░░░░░░  <N>

─────────────────────────────────────────────────────
[scan] index    [cleanup] remove    [health] check    [checkpoint] ops

STATUS=OK
```

User Input: Type action name (scan, cleanup, health, checkpoint, quit) to proceed

> **Retrieval Metrics (P2):** Additional internal retrieval metrics are tracked by the search pipeline; dashboard exposure remains deferred until handler wiring is completed.

---

## 6. SCAN MODE

**Trigger:** `/memory:manage scan` or `/memory:manage scan --force`

Normal scan skips unchanged files (mtime check). Force scan re-indexes all files regardless.

### Confirmation Gate

**⚠️ Confirmation required before every scan.**

Before running `memory_index_scan`, ask:

```text
MEMORY:SCAN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

→ Scan Mode ────────────────────────────────────────
  [n] normal  incremental scan (default)
  [f] force   full re-index
  [b] back    cancel
```

Map selection to `force` for this run. **WAIT for user selection** before calling `memory_index_scan`.

### Frontmatter Normalization Prerequisite (For Corpus Rebuilds)

Before bulk re-index operations after documentation/template changes, run normalization first:

```bash
# 1) Dry-run normalization
node .opencode/skill/system-spec-kit/scripts/dist/memory/backfill-frontmatter.js --dry-run --include-archive

# 2) Apply normalization (only after dry-run review)
node .opencode/skill/system-spec-kit/scripts/dist/memory/backfill-frontmatter.js --apply --include-archive

# 3) Re-run scan
spec_kit_memory_memory_index_scan({ force: true })
```

Recommended order: **normalize → verify → rebuild**.

### 3-Source Pipeline

The scan discovers memory-eligible files from three sources:

| #   | Source         | Key                 | Location                              |
| --- | -------------- | ------------------- | ------------------------------------- |
| 1   | Spec Memories  | specFiles           | specs/*/memory/*.{md,txt}             |
| 2   | Constitutional | constitutionalFiles | .opencode/skill/*/constitutional/*.md |
| 3   | Spec Documents | specDocFiles        | .opencode/specs/**/*.md               |

### Canonical Path Deduplication

- The scan canonicalizes alias roots (`specs/` vs `.opencode/specs/`) before indexing.
- Duplicate logical files are merged into a unique scan set before batch indexing.
- Scan diagnostics should be interpreted with dedup behavior in mind (unique files vs duplicates removed).

### Call Examples

```javascript
spec_kit_memory_memory_index_scan({ force: false })  // Normal incremental
spec_kit_memory_memory_index_scan({ force: true })   // Force full re-index
```

**Targeted indexing examples:**
- Exclude spec docs: `{ includeSpecDocs: false }`
- Exclude constitutional: `{ includeConstitutional: false }`
- Specific folder: `{ specFolder: "007-auth" }`
- Force full re-index: `{ force: true }`

### Output

```text
MEMORY:SCAN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Mode        <normal|force>
  Indexed     <N>
  Skipped     <N>
  Updated     <N>
  Errors      <N>

  Details     unique=<N>, deduped=<N> (when dedup diagnostics are emitted)

STATUS=OK INDEXED=<N> SKIPPED=<N> UPDATED=<N>
```

---

## 7. CLEANUP MODE

**Trigger:** `/memory:manage cleanup`

### Confirmation Gate

**⚠️ Confirmation required before any deletions.**

1. Execute `memory_list({ limit: 50, sortBy: "created_at" })`
2. Filter by tier eligibility:
   - `deprecated` → Always include
   - `temporary` → Include if >7 days old
   - `normal` → Include if >90 days old AND <3 accesses
   - `important/critical/constitutional` → PROTECTED (never include)
3. If no candidates: Display "No cleanup candidates found" → Exit
4. If candidates found: Display with options (below)
5. **WAIT for user selection** before proceeding

**HARD STOP:** DO NOT delete any memories until user explicitly chooses [a]ll or [y]es per item.

### Workflow

1. **Safety:** Create auto-checkpoint `pre-cleanup-{timestamp}` before any deletions
2. **Identify:** `memory_list({ limit: 50, sortBy: "created_at" })`, filter by tier eligibility rules above
3. **Display candidates:**
```text
MEMORY:CLEANUP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

→ Candidates ───────────────────────────── <N> found

  ID    Tier          Title                   Age       Accesses
  42    deprecated    Early hero experiments   4 months  1
  38    temporary     Debug session notes      2 months  0

→ Protected ────────────────────────────────────────
  constitutional <N>  ·  critical <N>  ·  important <N>

─────────────────────────────────────────────────────
[a] remove all    [r] review each    [n] keep all    [b] back
```
4. **Actions:** `a`→checkpoint+delete all, `r`→step through each, `n`→cancel, `b`→back, `q`→exit
5. **Completion:**
```text
MEMORY:CLEANUP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Checkpoint  pre-cleanup-<timestamp>
  Removed     <N>
  Kept        <N>

  Undo: /memory:manage checkpoint restore pre-cleanup-<timestamp>

STATUS=OK REMOVED=<N> KEPT=<N> CHECKPOINT=<name>
```

---

## 8. BULK DELETE MODE

**Trigger:** `/memory:manage bulk-delete <tier> [--older-than <days>] [--folder <spec>]`

### Confirmation Gate

**⚠️ Confirmation required before bulk deletion.**

1. Parse `<tier>` (required), `--older-than <days>` (optional), `--folder <spec>` (optional)
2. Validate tier is one of: constitutional, critical, important, normal, temporary, deprecated
3. If tier is `constitutional` or `critical` AND no `--folder` specified:
   - REFUSE: "Bulk delete of constitutional/critical tier requires --folder scope. Use: bulk-delete <tier> --folder <spec>"
4. Preview affected count via `memory_list({ limit: 100 })` filtered by tier (and folder/age if specified)
5. Display count and ask: `[y]es | [n]o`

**HARD STOP:** DO NOT execute bulk delete until user explicitly confirms.

### Workflow

1. **Parse:** Extract tier (required), `--older-than` days (optional), `--folder` spec (optional)
2. **Validate:** Tier must be valid. Constitutional/critical require `--folder` scope.
3. **Preview:** `memory_list({ limit: 100, sortBy: "created_at" })` → filter by tier, age, and folder
4. **Display:**

```text
MEMORY:BULK-DELETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Tier        <tier>
  Scope       <all | folder: <spec>>
  Age Filter  <all | older than <N> days>
  Affected    <N> memories

─────────────────────────────────────────────────────
[y] delete all    [n] cancel
```

5. **Execute:**

```javascript
spec_kit_memory_memory_bulk_delete({
  tier: "<tier>",
  confirm: true,
  specFolder: "<spec>",       // omit if not specified
  olderThanDays: <N>,         // omit if not specified
  skipCheckpoint: false
})
```

6. **Confirm:**

```text
MEMORY:BULK-DELETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Tier        <tier>
  Removed     <N>
  Checkpoint  auto-pre-bulk-delete-<timestamp>

  Undo: /memory:manage checkpoint restore auto-pre-bulk-delete-<timestamp>

STATUS=OK REMOVED=<N> TIER=<tier>
```

**Notes:**
- `memory_bulk_delete` auto-creates a checkpoint before deletion (unless `skipCheckpoint: true`)
- The tool refuses unscoped deletion of constitutional/critical tiers at the MCP level as well
- For fine-grained per-item review, use `/memory:manage cleanup` instead

---

## 9. TIER MANAGEMENT

**Trigger:** `/memory:manage tier <id> <tier>`

Tier resolution for indexed content is deterministic:
- Precedence: **metadata tier → inline marker tier → default tier**
- Manual tier updates via this command override stored tier values for the target memory ID.

### Workflow

1. **Validate:** tier must be one of: constitutional, critical, important, normal, temporary, deprecated
2. **Validate:** id must exist in memory database
3. **Execute:** `spec_kit_memory_memory_update({ id: <id>, importanceTier: "<tier>" })`
4. **Confirm:**

```text
MEMORY:TIER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Memory      #<id> "<title>"
  Old Tier    <old_tier>
  New Tier    <new_tier>

STATUS=OK ID=<id> TIER=<tier>
```

---

## 10. TRIGGER EDIT

**Trigger:** `/memory:manage triggers <id>`

1. **Load:** `memory_list({ limit: 100, sortBy: "created_at" })` → find memory, extract `triggerPhrases`
2. **Display:** Current triggers numbered, with `[a]dd | [r]emove # | [s]ave | [b]ack` actions
3. **Edit:** `a`→prompt for new phrase, `r`→prompt for number to remove, `s`→save via `memory_update({ triggerPhrases: [...] })`, `b`→back (discard)
4. **Confirm:**
```text
MEMORY:TRIGGERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Memory      #<id> "<title>"

→ Current Triggers ─────────────────────────────────
  1) <phrase1>
  2) <phrase2>
  3) <phrase3>

─────────────────────────────────────────────────────
[a] add    [r] remove #    [s] save    [b] back

STATUS=OK ID=<id> TRIGGERS=<N>
```

---

## 11. VALIDATE MODE

**Trigger:** `/memory:manage validate <id> useful` or `/memory:manage validate <id> not`

### Workflow

1. Parse: `"useful"` → `wasUseful: true` | `"not"` → `wasUseful: false`
2. Execute: `spec_kit_memory_memory_validate({ id: <id>, wasUseful: <bool> })`
3. Confirm:

```text
MEMORY:VALIDATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Memory      #<id> "<title>"
  Feedback    <useful|not useful>
  Confidence  <old>% → <new>%

STATUS=OK ID=<id> USEFUL=<true|false>
```

---

## 12. DELETE MODE

**Trigger:** `/memory:manage delete <id>`

### Confirmation Gate

**⚠️ Confirmation required before deletion.**

1. Retrieve memory details via `memory_list`
2. If ID not found → `STATUS=FAIL ERROR="Memory #<id> not found"`
3. If tier is `constitutional` or `critical`:
   - Show warning, require typing `DELETE <title>` to confirm
4. If other tier: Ask `[y]es | [n]o`

**HARD STOP:** DO NOT delete any memory until user explicitly confirms.

### Step 1: Retrieve and Display

```javascript
spec_kit_memory_memory_list({ limit: 100, sortBy: "created_at" })
```

For protected tiers (constitutional, critical):
```text
MEMORY:DELETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  WARN  Protected memory
  Memory      #<id> "<title>"
  Tier        <tier>
  Created     <date>

  Type 'DELETE <title>' to confirm, or [b] back
```

For other tiers:
```text
MEMORY:DELETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Memory      #<id> "<title>"
  Tier        <tier>
  Created     <date>

─────────────────────────────────────────────────────
[y] delete    [n] cancel
```

### Step 2: Execute and Confirm

```javascript
spec_kit_memory_memory_delete({ id: <id> })
```

```text
MEMORY:DELETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Removed     #<id> "<title>"

STATUS=OK DELETED=<id>
```

---

## 13. HEALTH CHECK

**Trigger:** `/memory:manage health`

Execute `spec_kit_memory_memory_health({})`. Display:

```text
MEMORY:HEALTH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Status      <healthy|degraded|error>
  Size        <size>
  Schema      v23
  Total       <N>

→ Tables ───────────────────────────────────────────
  PASS  memory_index (v23)
  PASS  memory_history
  PASS  checkpoints
  PASS  memory_conflicts
  PASS  causal_edges
  PASS  memory_corrections

  Note: causal_edges stores explicit memory relationships for lineage tooling.

→ Checks ───────────────────────────────────────────
  PASS  DB accessible
  PASS  Embeddings valid
  PASS  No orphans
  PASS  No duplicate IDs

→ Warnings ─────────────────────────────────────────
  WARN  <N> memories without trigger phrases
  WARN  <N> memories older than 90 days

STATUS=OK HEALTH=<healthy|degraded|error> SCHEMA=v13
```

---

## 14. CHECKPOINT OPERATIONS

### Checkpoint Create

**Trigger:** `/memory:manage checkpoint create <name>`

```javascript
spec_kit_memory_checkpoint_create({
  name: "<checkpoint_name>",
  specFolder: "<folder>",   // Optional
  metadata: { ... }         // Optional
})
```

```text
MEMORY:CHECKPOINT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Name        <checkpoint_name>
  Memories    <N>
  Folders     <N>

STATUS=OK CHECKPOINT=<name> ACTION=create
```

**Limits:** Max 10 checkpoints. Auto-cleanup: checkpoints older than 30 days.

---

### Checkpoint Restore

**Trigger:** `/memory:manage checkpoint restore <name>`

#### Confirmation Gate

**⚠️ Confirmation required before restore.**

1. Verify checkpoint exists via `checkpoint_list()`
2. If not found → `STATUS=FAIL ERROR="Checkpoint '<name>' not found"`
3. Show diff summary: memories added since checkpoint (will be removed)
4. Ask: `[y]es | [n]o | [v]iew diff`

**HARD STOP:** DO NOT restore checkpoint until user explicitly confirms.

#### Restore Workflow

1. Verify checkpoint exists via `checkpoint_list()`
   
   **INTEGRITY:** After listing checkpoints, verify the target checkpoint still exists immediately before calling checkpoint_restore. If the checkpoint was modified or deleted between check and restore, abort and notify the user.
2. Create pre-restore snapshot: `checkpoint_create({ name: "pre-restore-{timestamp}", metadata: { type: "rollback-snapshot" } })`
3. Execute restore: `checkpoint_restore({ name: "<name>", clearExisting: false })`
4. On success: delete pre-restore snapshot, show confirmation
5. On failure: rollback to pre-restore snapshot, report failure

**Output (Success):**
```text
MEMORY:CHECKPOINT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Restored    <checkpoint_name>
  Removed     <N>
  Recovered   <N>

STATUS=OK CHECKPOINT=<name> ACTION=restore
```

**Output (Failure):**
```text
MEMORY:CHECKPOINT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  FAIL  Restore failed
  Target      <checkpoint_name>
  Error       <reason>
  Rollback    <successful|failed>

STATUS=FAIL CHECKPOINT=<name> ACTION=restore ROLLBACK=<status>
```

**Output (Failure + Rollback Failed):**
```text
MEMORY:CHECKPOINT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  FAIL  Restore failed
  Target      <checkpoint_name>
  Error       <reason>
  Rollback    FAIL — manual intervention required
  Recovery    pre-restore-<timestamp>

  Run: /memory:manage checkpoint restore "pre-restore-<timestamp>"

STATUS=FAIL CHECKPOINT=<name> ACTION=restore ROLLBACK=failed
```

**Caution:**
- Default (`clearExisting=false`): Marks existing memories as `deprecated`
- `clearExisting=true`: Deletes existing memories before restore
- Always run `memory_index_scan` after restore to regenerate embeddings

---

### Checkpoint List

**Trigger:** `/memory:manage checkpoint list`

```javascript
spec_kit_memory_checkpoint_list({ limit: 50, specFolder: "<folder>" })
```

```text
MEMORY:CHECKPOINT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

→ Available ────────────────────────────── <N> checkpoints

  Name              Created          Memories  Size
  before-refactor   Dec 8, 10:30 AM  47        12.4 KB
  feature-auth      Dec 7, 3:15 PM   42        10.8 KB

  Total: <N> checkpoints (<size>)

STATUS=OK ACTION=list
```

---

### Checkpoint Delete

**Trigger:** `/memory:manage checkpoint delete <name>`

**CONFIRMATION GATE:** Before calling checkpoint_delete, display the checkpoint name and ask for explicit user confirmation. Do not proceed without a confirmed response.

```javascript
spec_kit_memory_checkpoint_delete({ name: "<checkpoint_name>", confirmName: "<checkpoint_name>" })
```

> **Safety contract:** `confirmName` is **required** and must exactly match `name`. The tool will reject the request if `confirmName` is missing or does not match.

Confirmation required before deleting. Output:
```text
MEMORY:CHECKPOINT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Deleted     <checkpoint_name>

STATUS=OK CHECKPOINT=<name> ACTION=delete
```

---

## 15. INGEST MODE

**Trigger:** `/memory:manage ingest start|status|cancel`

Async bulk ingestion of multiple markdown files. Files are processed sequentially in the background while you continue working.

**Distinction from scan:** `/memory:manage scan` discovers files automatically across the workspace. Ingest takes a specific list of files you provide.

### Ingest Start

**Trigger:** `/memory:manage ingest start <path1> [path2 ...] [--folder <specFolder>]`

```javascript
spec_kit_memory_memory_ingest_start({
  paths: ["/abs/path/file1.md", "/abs/path/file2.md"],
  specFolder: "<spec-folder>"  // optional
})
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `paths` | string[] | Yes | Absolute file paths (min 1, max 50) |
| `specFolder` | string | No | Spec folder label for the job |

**SCOPE:** Ingest paths should be within the repository root or known spec directories. Reject paths outside the workspace. Individual files should not exceed 100KB to prevent resource exhaustion.

Returns a `jobId` immediately. Use `ingest status <jobId>` to check progress.

### Ingest Status

**Trigger:** `/memory:manage ingest status <jobId>`

```javascript
spec_kit_memory_memory_ingest_status({ jobId: "<jobId>" })
```

Shows job state (`running`, `completed`, `cancelled`, `failed`) and per-file progress.

### Ingest Cancel

**Trigger:** `/memory:manage ingest cancel <jobId>`

```javascript
spec_kit_memory_memory_ingest_cancel({ jobId: "<jobId>" })
```

Cancellation is checked between files: the currently processing file completes before the job stops.

### Output

```text
MEMORY:INGEST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Job ID      <jobId>
  Status      <running|completed|cancelled|failed>
  Progress    <completed>/<total> files

STATUS=OK ACTION=ingest JOB=<jobId>
```

---

## 16. SHARED MEMORY LIFECYCLE

**Trigger:** `/memory:manage shared [enable|create|member|status]`

This namespace manages shared-memory setup, shared-space creation, membership changes, and rollout inspection without requiring a separate top-level command.

### Shared Enablement Gate

Before routing any `shared` subcommand, call `shared_memory_status()` unless the explicit subcommand is `enable`.

```text
1. Parse the nested subcommand after `shared`
2. IF subcommand is missing:
   → IF shared memory disabled:
       Display first-time setup prompt and offer `enable`
     ELSE:
       Display shared overview dashboard
3. IF subcommand is not `enable` AND shared memory is disabled:
   → Display the setup prompt below
   → WAIT for confirmation
   → On "yes": call shared_memory_enable()
   → Continue only after setup completes
4. Route to the requested shared subcommand workflow
```

When shared memory is disabled, display:

```text
MEMORY:MANAGE SHARED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Shared memory is not yet enabled for this workspace.

  This will:
  - Create shared-memory infrastructure tables
  - Persist enablement in the database
  - Generate a README in shared-spaces/

  Enable shared memory? (yes/no)
```

### Shared Overview

**Trigger:** `/memory:manage shared`

```text
MEMORY:MANAGE SHARED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

→ Available Subcommands ──────────────────────────

  [enable]   Enable shared memory (first-time setup)
  [create]   Create or update a shared-memory space
  [member]   Set deny-by-default membership
  [status]   Inspect rollout state and accessible spaces

  Note: Spaces stay deny-by-default after bootstrap. The first successful
  create auto-grants `owner` to the acting caller, and later access changes
  still require explicit membership updates by an existing owner.

STATUS=OK ACTION=shared-overview
```

### Shared Enable

**Trigger:** `/memory:manage shared enable`

`shared_memory_enable()` still takes no user-supplied arguments, but the server now requires authenticated caller context and only the configured shared-memory admin can complete the first-run enablement. If the runtime does not provide an authenticated caller, surface the auth error verbatim instead of retrying with guessed parameters.

Call `spec_kit_memory_shared_memory_enable({})`. On success:

```text
MEMORY:MANAGE SHARED ENABLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Shared memory is now enabled.
  Use `/memory:manage shared ...` to manage spaces and memberships.

STATUS=OK ACTION=shared-enable
```

### Shared Create or Update

**Trigger:** `/memory:manage shared create <spaceId> <tenantId> <name> (--actor-user <id> | --actor-agent <id>)`

Workflow:
1. Parse `spaceId`, `tenantId`, `name`, and exactly one actor identity
2. Validate one and only one actor identity is present: `--actor-user <id>` or `--actor-agent <id>`
3. Apply optional rollout parameters (`rolloutEnabled`, `rolloutCohort`, `killSwitch`)
4. Call `shared_space_upsert()` with the parsed parameters
5. Display confirmation with bootstrap-owner details

```text
MEMORY:MANAGE SHARED CREATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Space       <spaceId>
  Tenant      <tenantId>
  Name        <name>
  Actor       <user:<actorUserId>|agent:<actorAgentId>>
  Rollout     <enabled|disabled>
  Kill Switch <off|ON>
  Owner Grant <bootstrap owner granted|existing owner verified>

STATUS=OK ACTION=shared-create SPACE=<spaceId>
```

### Shared Membership

**Trigger:** `/memory:manage shared member <spaceId> <tenantId> <subjectType> <subjectId> <role> (--actor-user <id> | --actor-agent <id>)`

Workflow:
1. Parse `spaceId`, `tenantId`, actor identity, `subjectType`, `subjectId`, and `role`
2. Validate exactly one actor identity is present
3. Validate `subjectType` is `user` or `agent`
4. Validate `role` is `owner`, `editor`, or `viewer`
5. Call `shared_space_membership_set()` and display confirmation

```text
MEMORY:MANAGE SHARED MEMBER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Space       <spaceId>
  Tenant      <tenantId>
  Subject     <subjectType>:<subjectId>
  Role        <role>
  Actor       <user:<actorUserId>|agent:<actorAgentId>>

STATUS=OK ACTION=shared-member SPACE=<spaceId>
```

### Shared Status

**Trigger:** `/memory:manage shared status [--tenant <id>] (--actor-user <id> | --actor-agent <id>)`

Workflow:
1. Parse optional `tenantId`
2. Validate exactly one actor identity is present: `--actor-user <id>` or `--actor-agent <id>`
3. Call `shared_memory_status({ tenantId, actorUserId, actorAgentId })`
4. Display rollout state and accessible spaces for that caller

```text
MEMORY:MANAGE SHARED STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

→ Rollout ────────────────────────────────────────
  Feature     <enabled|disabled>
  Spaces      <N> total

→ Accessible Spaces ─────────────────────────────
  <spaceId>   <name>   <role>
  <spaceId>   <name>   <role>

STATUS=OK ACTION=shared-status
```

---

## 17. ERROR HANDLING

| Condition                | Response                                                                                                                         |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| Unknown subcommand       | `STATUS=FAIL`: list valid subcommands                                                                                            |
| Memory ID not found      | `STATUS=FAIL ERROR="Memory #<id> not found"`                                                                                     |
| Invalid tier             | `STATUS=FAIL ERROR="Invalid tier: <tier>"`                                                                                       |
| Database locked          | `STATUS=FAIL ERROR="Database locked"`                                                                                            |
| Permission denied        | `STATUS=FAIL ERROR="Cannot access database"`                                                                                     |
| Scan failed              | `STATUS=FAIL ERROR="Scan failed: <reason>"`                                                                                      |
| Checkpoint not found     | `STATUS=FAIL ERROR="Checkpoint not found"`                                                                                       |
| Max checkpoints reached  | Auto-delete oldest, warn user                                                                                                    |
| MCP tool unavailable     | `STATUS=FAIL ERROR="MCP tool unavailable. Verify the Spec Kit Memory MCP server is running."` Do NOT fall back to Bash/sqlite3.  |
| Database not initialized | `STATUS=FAIL ERROR="Database not initialized. Run memory_index_scan() to create schema, or restart the MCP server."`             |
| Ingest job not found     | `STATUS=FAIL ERROR="Job '<jobId>' not found"`                                                                                    |
| Too many ingest paths    | `STATUS=FAIL ERROR="Maximum 50 paths per job"`                                                                                   |
| Shared memory disabled   | Offer `/memory:manage shared enable` or first-time setup prompt                                                                   |
| Shared enable denied     | `STATUS=FAIL ERROR="Only the configured shared-memory admin can enable shared memory"`; verify authenticated caller context      |
| Invalid shared role      | `STATUS=FAIL ERROR="role must be owner, editor, or viewer"`                                                                      |
| Invalid shared subject   | `STATUS=FAIL ERROR="subjectType must be user or agent"`                                                                          |
| Shared space not found   | `STATUS=FAIL ERROR="Space '<spaceId>' not found"`                                                                                |

---

## 18. RELATED COMMANDS

- `/memory:search`: Intent-aware context retrieval and analysis tools
- `/memory:save`: Save conversation context
- `/memory:learn`: Constitutional memories
- `/spec_kit:resume`: Session recovery and continuation
- `/memory:manage shared`: Shared-memory spaces

---
<!-- APPENDIX: Reference material for AI agent implementation -->

## APPENDIX A: MCP TOOL REFERENCE

### Enforcement Matrix

| MODE               | REQUIRED CALLS                                                          | PATTERN  | ON FAILURE      |
| ------------------ | ----------------------------------------------------------------------- | -------- | --------------- |
| STATS              | `memory_stats()` + `memory_list()`                                      | PARALLEL | Show error msg  |
| SCAN               | `memory_index_scan()`                                                    | SINGLE   | Show error msg  |
| CLEANUP            | `memory_list()` → [confirm] → `checkpoint_create()` → `memory_delete()` | SEQUENCE | Abort operation |
| BULK DELETE        | `memory_list()` → [confirm] → `memory_bulk_delete()`                    | SEQUENCE | Abort operation |
| TIER CHANGE        | `memory_update()`                                                       | SINGLE   | Show error msg  |
| TRIGGER EDIT       | `memory_update()`                                                       | SINGLE   | Show error msg  |
| VALIDATION         | `memory_validate()`                                                     | SINGLE   | Show error msg  |
| DELETE             | `memory_list()` → [confirm] → `memory_delete()`                         | SEQUENCE | Abort operation |
| HEALTH             | `memory_health()`                                                       | SINGLE   | Show error msg  |
| CHECKPOINT CREATE  | `checkpoint_create()`                                                   | SINGLE   | Show error msg  |
| CHECKPOINT RESTORE | `checkpoint_list()` → [confirm] → snapshot → `checkpoint_restore()`     | SEQUENCE | Rollback+abort  |
| CHECKPOINT LIST    | `checkpoint_list()`                                                     | SINGLE   | Show empty msg  |
| CHECKPOINT DELETE  | `checkpoint_delete()`                                                   | SINGLE   | Show error msg  |
| INGEST START       | `memory_ingest_start()`                                                 | SINGLE   | Show error msg  |
| INGEST STATUS      | `memory_ingest_status()`                                                | SINGLE   | Show error msg  |
| INGEST CANCEL      | `memory_ingest_cancel()`                                                | SINGLE   | Show error msg  |
| SHARED ENABLE      | `shared_memory_enable()`                                                | SINGLE   | Show error msg  |
| SHARED CREATE      | `shared_space_upsert()`                                                 | SINGLE   | Show error msg  |
| SHARED MEMBER      | `shared_space_membership_set()`                                         | SINGLE   | Show error msg  |
| SHARED STATUS      | `shared_memory_status()`                                                | SINGLE   | Show error msg  |

### Tool Signatures

```javascript
spec_kit_memory_memory_stats({})
spec_kit_memory_memory_list({ limit: N, sortBy: "created_at", specFolder: "optional" })
spec_kit_memory_memory_search({ query: "<q>", limit: N, specFolder: "optional" })
spec_kit_memory_memory_index_scan({ force, specFolder, includeSpecDocs, includeConstitutional, incremental })
spec_kit_memory_memory_validate({ id: <id>, wasUseful: <bool> })
spec_kit_memory_memory_update({ id: <id>, importanceTier: "<tier>", triggerPhrases: [...] })
spec_kit_memory_memory_delete({ id: <id> })
spec_kit_memory_memory_bulk_delete({ tier: "<tier>", confirm: true, specFolder: "optional", olderThanDays: N, skipCheckpoint: false })
spec_kit_memory_memory_health({})
spec_kit_memory_checkpoint_create({ name: "<name>", specFolder: "optional", metadata: {...} })
spec_kit_memory_checkpoint_restore({ name: "<name>", clearExisting: <bool> })
spec_kit_memory_checkpoint_list({ limit: 50, specFolder: "optional" })
spec_kit_memory_checkpoint_delete({ name: "<name>", confirmName: "<name>" })
spec_kit_memory_memory_ingest_start({ paths: ["<path1>", "<path2>"], specFolder: "optional" })
spec_kit_memory_memory_ingest_status({ jobId: "<jobId>" })
spec_kit_memory_memory_ingest_cancel({ jobId: "<jobId>" })
spec_kit_memory_shared_memory_enable({})
spec_kit_memory_shared_space_upsert({ spaceId, tenantId, name, actorUserId, actorAgentId, rolloutEnabled, rolloutCohort, killSwitch })
spec_kit_memory_shared_space_membership_set({ spaceId, tenantId, subjectType, subjectId, role, actorUserId, actorAgentId })
spec_kit_memory_shared_memory_status({ tenantId, actorUserId, actorAgentId })
```

> **Feature Flag Behavior:** `SPECKIT_ADAPTIVE_FUSION` affects scan and search behavior: when enabled, index scans apply adaptive weight profiles during embedding and artifact-class routing during re-indexing. `SPECKIT_EXTENDED_TELEMETRY` enables detailed per-operation metrics for scan, search, and health calls. **Mutation Ledger:** cleanup and delete operations are recorded in the append-only mutation ledger, providing a full audit trail that can be reviewed when investigating unexpected state changes.

### memory_index_scan Parameters

| Parameter             | Type    | Default | Description                        |
| --------------------- | ------- | ------- | ---------------------------------- |
| force                 | boolean | false   | Force re-index all files           |
| specFolder            | string  | -       | Limit scan to specific spec folder |
| includeSpecDocs       | boolean | true    | Include spec folder documents      |
| includeConstitutional | boolean | true    | Include constitutional rule files  |
| incremental           | boolean | true    | Skip unchanged files (mtime check) |

---

## APPENDIX B: ADVANCED PARAMETERS

### memory_stats: Full Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `folderRanking` | string | `count` | Rank folders by: `count`, `recency`, `importance`, `composite` (weighted multi-factor score) |
| `excludePatterns` | string[] | — | Regex patterns to exclude folders (e.g., `["z_archive", "scratch"]`) |
| `includeScores` | boolean | false | Include score breakdown for each folder |
| `includeArchived` | boolean | false | Include archived/test/scratch folders |
| `limit` | number | 10 | Maximum folders to return (max 100) |

### memory_health: Full Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `reportMode` | string | `full` | `full` (system diagnostics) or `divergent_aliases` (compact alias triage) |
| `limit` | number | 20 | Max divergent alias groups when `reportMode=divergent_aliases` (max 200) |
| `specFolder` | string | — | Spec folder filter for divergent alias triage mode |
| `autoRepair` | boolean | false | Attempt best-effort repair actions (e.g., FTS rebuild) |
| `confirmed` | boolean | false | Required with `autoRepair:true` to execute repairs. Without it, returns confirmation-only response |

### memory_list: Additional Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `includeChunks` | boolean | false | Include chunk child rows. Default false returns parent memories only for cleaner browsing |

### memory_update: Additional Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `allowPartialUpdate` | boolean | false | Allow update to succeed even if embedding regeneration fails. Metadata changes are applied and the embedding is marked for re-index. When false (default), entire update is rolled back on embedding failure |

### memory_validate: Full Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number | Yes | Memory ID to validate |
| `wasUseful` | boolean | Yes | Whether the memory was useful |
| `queryId` | string | No | Query identifier for implicit feedback context |
| `queryTerms` | string[] | No | Normalized query terms for learned feedback term extraction |
| `resultRank` | number | No | Rank position (1-based) of the selected memory in search results |
| `totalResultsShown` | number | No | Total results shown to the user |
| `searchMode` | string | No | Search mode context (`search`, `context`, `trigger`) |
| `intent` | string | No | Classified intent associated with the originating query |
| `sessionId` | string | No | Session identifier for selection telemetry |
| `notes` | string | No | Free-form notes for this validation event |

> Memories with high confidence and validation counts may be promoted to critical tier via learned feedback.

### memory_bulk_delete: Additional Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `skipCheckpoint` | boolean | false | Skip auto-checkpoint creation before delete. Rejected for constitutional/critical tiers. Speed optimization for non-critical tiers |

### memory_delete: Dual-Mode Contract

`memory_delete` operates in two modes:

| Mode | Required Parameters | Description |
|------|---------------------|-------------|
| Single delete | `id` | Delete one memory by ID |
| Bulk folder delete | `specFolder` + `confirm: true` | Delete all memories in a spec folder |

The `confirm` parameter only accepts `true` (not `false`): it is a safety gate, not a toggle.

---

## APPENDIX C: CONSTITUTIONAL TIER HANDLING

Constitutional tier memories receive special treatment across all operations:

- **Cleanup:** NEVER included in cleanup candidates, always protected regardless of age/access count
- **Delete:** Requires typing `DELETE <title>` to confirm, with extra irreversibility warning
- **Checkpoint Restore:** Constitutional memories added AFTER a checkpoint will be removed on restore

**Best Practice:** Before restoring a checkpoint that predates constitutional memory additions:
1. Review current constitutional memories
2. Note any that should be preserved
3. After restore, manually re-promote critical rules if needed
