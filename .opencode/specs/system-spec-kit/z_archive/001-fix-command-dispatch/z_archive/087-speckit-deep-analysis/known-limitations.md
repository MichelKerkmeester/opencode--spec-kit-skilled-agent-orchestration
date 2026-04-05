# Known Limitations & Remediation Guide

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: supplementary | v1.0 -->
<!-- Parent: 087-speckit-deep-analysis -->

---

## Purpose

This document details the known limitations deferred from the 087-speckit-deep-analysis remediation, with full root cause analysis, impact assessment, and step-by-step remediation instructions for each.

---

## Table of Contents

1. [KL-1: SQLite Database Schema Drift](#kl-1-sqlite-database-schema-drift)
2. [KL-2: Legacy Install Guide Stale Gate Numbering](#kl-2-legacy-install-guide-stale-gate-numbering)
3. [KL-3: Undocumented Spec Scripts](#kl-3-undocumented-spec-scripts)
4. [KL-4: Minor Signal Handler Gaps](#kl-4-minor-signal-handler-gaps)
5. [Dismissed: MCP Tool Details in AGENTS.md](#dismissed-mcp-tool-details-in-agentsmd)

---

## KL-1: SQLite Database Schema Drift

### Severity: HIGH

### Summary

Existing SQLite databases have an outdated `memory_conflicts` table schema. The 087 fix added `CREATE_LINKED` to the CHECK constraint in the **source code**, but existing databases retain the old schema. Additionally, a deeper issue exists: **three conflicting DDL definitions** for the same table produce column mismatches that silently fail.

### Root Cause

Three separate code paths define the `memory_conflicts` table with incompatible schemas:

| Schema | Location | Key Differences |
|--------|----------|-----------------|
| **A** (Migration v4) | `vector-index.js:424-436` | `new_memory_hash`, `similarity_score`, `notes`, FOREIGN KEY, CHECK constraint |
| **B** (create_schema) | `vector-index.js:1165-1177` | Identical to Schema A |
| **C** (prediction-error-gate) | `prediction-error-gate.js:80-95` | `new_memory_id`, `similarity`, `reason`, `new_content_preview`, `existing_content_preview`, `contradiction_type`, `spec_folder`, AUTOINCREMENT, **no CHECK constraint** |

SQLite's `CREATE TABLE IF NOT EXISTS` means whichever code path runs first "wins". In practice, `initialize_db()` calls `create_schema()` first (Schema A/B), then `prediction-error-gate.init()` is a no-op.

**The real problem:** Two callers INSERT into columns that don't match the actual table:

| Caller | File:Lines | Columns Used | Match Schema A? |
|--------|-----------|--------------|-----------------|
| `memory-save.js` | `:270-289` | `spec_folder`, `created_at` | **NO** — columns don't exist |
| `prediction-error-gate.js` `log_conflict()` | `:336-366` | `new_memory_id`, `similarity`, `reason`, `new_content_preview`, `existing_content_preview` | **NO** — columns don't exist |

Both callers **silently swallow** the resulting `no such column` errors (memory-save.js:292, prediction-error-gate.js:369), masking the schema mismatch entirely.

### Impact

- Conflict tracking data is **silently lost** on every `CREATE_LINKED`, `UPDATE`, `SUPERSEDE`, and `REINFORCE` decision
- The `memory_conflicts` table is effectively a dead table — no data can be written to it from either code path
- Database migration versions 10 and 11 are declared in comments (vector-index.js:153-154) but have no migration code

### Pre-087 vs Post-087 State

| Aspect | Pre-087 | Post-087 |
|--------|---------|----------|
| CHECK constraint in source | Missing `CREATE_LINKED` | Has `CREATE_LINKED` |
| CHECK constraint in existing DBs | Missing `CREATE_LINKED` | **Still missing** (no migration) |
| Column mismatch | Present (silent failures) | **Still present** (not in scope) |
| Error swallowing | Present | **Still present** (not in scope) |

### Remediation Options

#### Option A: Full Schema Unification Migration (Recommended)

Create migration v12 that rebuilds the table with a unified schema containing all columns from both callers.

**Steps:**

1. **Design unified schema** combining Schema A and Schema C columns:

```sql
CREATE TABLE memory_conflicts_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
    -- Schema A columns
    new_memory_hash TEXT,
    -- Schema C columns
    new_memory_id INTEGER,
    existing_memory_id INTEGER,
    -- Unified naming (Schema C preferred)
    similarity REAL,
    action TEXT CHECK(action IN ('CREATE', 'CREATE_LINKED', 'UPDATE', 'SUPERSEDE', 'REINFORCE')),
    reason TEXT,
    -- Schema C additions
    new_content_preview TEXT,
    existing_content_preview TEXT,
    contradiction_detected INTEGER DEFAULT 0,
    contradiction_type TEXT,
    spec_folder TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (existing_memory_id) REFERENCES memory_index(id) ON DELETE SET NULL
);
```

2. **Add migration v12** to the `migrations` object in `vector-index.js` (~line 610):

```javascript
12: (db) => {
    // Rebuild memory_conflicts with unified schema
    db.exec(`
        CREATE TABLE memory_conflicts_new (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
            new_memory_hash TEXT,
            new_memory_id INTEGER,
            existing_memory_id INTEGER,
            similarity REAL,
            action TEXT CHECK(action IN ('CREATE', 'CREATE_LINKED', 'UPDATE', 'SUPERSEDE', 'REINFORCE')),
            reason TEXT,
            new_content_preview TEXT,
            existing_content_preview TEXT,
            contradiction_detected INTEGER DEFAULT 0,
            contradiction_type TEXT,
            spec_folder TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (existing_memory_id) REFERENCES memory_index(id) ON DELETE SET NULL
        );

        -- Copy any existing data (columns that exist in both schemas)
        INSERT INTO memory_conflicts_new (id, timestamp, existing_memory_id, contradiction_detected)
            SELECT id, timestamp, existing_memory_id, contradiction_detected
            FROM memory_conflicts;

        DROP TABLE memory_conflicts;
        ALTER TABLE memory_conflicts_new RENAME TO memory_conflicts;
    `);
}
```

3. **Update `create_schema()`** (vector-index.js:1165-1177) to use the unified schema

4. **Remove `ensure_conflicts_table()`** from prediction-error-gate.js (lines 80-95) — the table is now always created by vector-index.js

5. **Fix INSERT statements** in both callers to match the unified schema

6. **Update SCHEMA_VERSION** to `12` (vector-index.js:155)

7. **Remove error swallowing** from both INSERT callers — errors should now surface properly

**Files to modify:**
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.js`
- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.js`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.js`

#### Option B: Drop and Recreate (If Conflict Audit Data Is Disposable)

Add migration v12 that drops and recreates with unified schema. Simpler but loses any existing conflict data.

```javascript
12: (db) => {
    db.exec(`
        DROP TABLE IF EXISTS memory_conflicts;
        -- Then CREATE TABLE with unified schema (same as Option A)
    `);
}
```

#### Option C: Delete Database File (Nuclear Option)

```bash
rm .opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite*
# Or if project-local:
rm .opencode-local/database/context-index.sqlite*
# Then trigger re-index via MCP: memory_index_scan({})
```

**Warning:** Destroys ALL data — memories, vectors, checkpoints, causal graph, corrections. Only appropriate for development/testing.

### SQLite Constraint Limitation

SQLite does NOT support `ALTER TABLE ... DROP CONSTRAINT` or `ALTER TABLE ... MODIFY COLUMN`. The only way to change a CHECK constraint is the "12-step ALTER TABLE" process: create new table, copy data, drop old, rename new. This is acknowledged in the codebase at migration v7 (vector-index.js:538-542).

### Verification After Fix

```bash
# 1. Check schema version was updated
sqlite3 context-index.sqlite "PRAGMA user_version;"
# Expected: 12

# 2. Verify unified table schema
sqlite3 context-index.sqlite ".schema memory_conflicts"
# Expected: All columns present, CHECK constraint includes CREATE_LINKED

# 3. Test INSERT succeeds (from memory-save.js path)
# Trigger a memory save with similarity 0.70-0.89 to get CREATE_LINKED action
# Check: SELECT * FROM memory_conflicts ORDER BY id DESC LIMIT 1;

# 4. Verify no silent errors in MCP server logs
```

---

## KL-2: Legacy Install Guide Stale Gate Numbering

### Severity: MEDIUM

### Summary

The file `SET-UP - AGENTS.md` uses a legacy 7-gate system (Gates 0-6) that no longer matches the current 3-gate scheme in AGENTS.md. Additionally, several **active** files still contain stale Gate 4 and Gate 6 references.

### Files Affected

#### Priority 1 — Active files loaded by agents at runtime

| File | Line | Current (Stale) | Correct |
|------|------|-----------------|---------|
| `.opencode/agent/orchestrate.md` | 231 | `Gate 4` | `Gate 3` |
| `AGENTS.md` (project root) | 503 | `Gate 4 Option B` | `Gate 3 Option B` |

#### Priority 2 — Active scripts and config

| File | Line(s) | Current (Stale) | Correct |
|------|---------|-----------------|---------|
| `.opencode/skill/system-spec-kit/scripts/scripts-registry.json` | 45, 54 | `Gate 6` | `Completion Verification Rule` |
| `.opencode/skill/system-spec-kit/scripts/README.md` | 136, 244, 325 | `Gate 6` | `Completion Verification Rule` |
| `.opencode/skill/system-spec-kit/scripts/spec/check-completion.sh` | 44 | `Gate 6` | `Completion Verification Rule` |

#### Priority 3 — Legacy install guide documentation

| File | Line(s) | Issue |
|------|---------|-------|
| `.opencode/install_guides/SET-UP - AGENTS.md` | 125-131 | Full Gates 0-6 table |
| | 135-168 | Flow diagram with Gates 4-6 |
| | 968 | "All 7 gates documented" validation check |
| | 1057 | "Gates 7 \| Gate 0-6" appendix summary |

### Old vs Current Gate Numbering

| Old Scheme | Old Name | Current Equivalent |
|------------|----------|-------------------|
| Gate 0 | Compaction Check | Removed entirely |
| Gate 1 | Understanding | **Gate 1** (same) |
| Gate 2 | Skill Routing | **Gate 2** (same) |
| Gate 3 | Spec Folder | **Gate 3** (same) |
| Gate 4 | Memory Loading | **Memory Context Loading** (unnumbered, soft) |
| Gate 5 | Memory Save | **Memory Save Rule** (unnumbered, post-execution) |
| Gate 6 | Completion | **Completion Verification Rule** (unnumbered, post-execution) |

### Is `SET-UP - AGENTS.md` Actively Used?

**No.** It is not loaded by any agent, command, or skill at runtime. However:
- Referenced from `SET-UP - Skill Creation.md` (line 958)
- Referenced from `install_guides/README.md` (line 1149)
- Part of the Public repo source of truth

### Remediation

**Phase 1 — Fix active files (Priority 1-2):**

```bash
# orchestrate.md line 231
sed -i '' 's/Gate 4/Gate 3/' .opencode/agent/orchestrate.md

# AGENTS.md line 503 (project root)
sed -i '' 's/Gate 4 Option B/Gate 3 Option B/' AGENTS.md

# scripts-registry.json lines 45, 54
sed -i '' 's/Gate 6 (Completion Verification)/Completion Verification Rule/g' \
    .opencode/skill/system-spec-kit/scripts/scripts-registry.json
sed -i '' 's/Gate 6 enforcement/Completion Verification Rule enforcement/g' \
    .opencode/skill/system-spec-kit/scripts/scripts-registry.json

# scripts/README.md lines 136, 244, 325
sed -i '' 's/Gate 6/Completion Verification Rule/g' \
    .opencode/skill/system-spec-kit/scripts/README.md

# check-completion.sh line 44
sed -i '' 's/Gate 6 Enforcement/Completion Verification Rule/g' \
    .opencode/skill/system-spec-kit/scripts/spec/check-completion.sh
```

**Phase 2 — Update legacy install guide (Priority 3):**

Rewrite the gate system section (lines 123-168) to reflect the current 3-gate pre-execution + behavioral rules architecture. Update the validation checklist (line 968) and appendix (line 1057).

### Verification

```bash
# After Phase 1
grep -rn "Gate 4" .opencode/agent/ AGENTS.md  # Expected: 0 matches (except speckit.md internal numbering)
grep -rn "Gate 6" .opencode/skill/system-spec-kit/scripts/  # Expected: 0 matches

# After Phase 2
grep -n "Gate [456]" ".opencode/install_guides/SET-UP - AGENTS.md"  # Expected: 0 matches
```

---

## KL-3: Undocumented Spec Scripts

### Severity: LOW

### Summary

Three spec management scripts exist but are not listed in speckit.md's Capability Scan or SKILL.md's Key Scripts table.

### Scripts

| Script | Path | Lines | Purpose |
|--------|------|-------|---------|
| `archive.sh` | `.opencode/skill/system-spec-kit/scripts/spec/archive.sh` | 294 | Archive completed spec folders to `z_archive/`. Modes: `archive <folder>`, `--list`, `--restore <folder>`. Checks >=90% completeness before archiving. |
| `check-completion.sh` | `.opencode/skill/system-spec-kit/scripts/spec/check-completion.sh` | 319 | Completion Verification Rule enforcement. Parses `checklist.md` for `[x]`/`[ ]` items. Counts P0/P1/P2. Exit codes: 0=complete, 1=incomplete, 2=error. Has `--strict` mode. |
| `recommend-level.sh` | `.opencode/skill/system-spec-kit/scripts/spec/recommend-level.sh` | 534 | Automated level recommendation replacing manual LOC estimation. 4-dimension scoring: LOC (35%), files (20%), risk (25%), complexity (20%). Level mapping: <25=L0, 25-44=L1, 45-69=L2, 70+=L3. |

### Where They Should Be Listed

| Document | Current Scripts Listed | Missing |
|----------|----------------------|---------|
| `speckit.md` Capability Scan (lines 188-193) | `create.sh`, `validate.sh`, `calculate-completeness.sh` | `archive.sh`, `check-completion.sh`, `recommend-level.sh` |
| `SKILL.md` Key Scripts table (lines 192-199) | `generate-context.js`, `validate.sh`, `create.sh`, `compose.sh` | `archive.sh`, `check-completion.sh`, `recommend-level.sh` |

### Impact

- `recommend-level.sh` could replace the manual LOC/complexity estimation the speckit agent currently performs — a deterministic scoring script exists but agents don't know about it
- `check-completion.sh` could automate the Completion Verification workflow — the script exists but the completion command/agent doesn't reference it
- `archive.sh` provides spec folder lifecycle management invisible to all agents

### Remediation

1. **Add all 3 scripts** to speckit.md Capability Scan table
2. **Add all 3 scripts** to SKILL.md Key Scripts table
3. **Consider integrating** `recommend-level.sh` into the spec folder creation workflow (Option B in Gate 3)
4. **Consider integrating** `check-completion.sh` into the Completion Verification Rule workflow

### Files to Modify

- `.opencode/agent/speckit.md` — Capability Scan table
- `.opencode/skill/system-spec-kit/SKILL.md` — Key Scripts table

---

## KL-4: Minor Signal Handler Gaps

### Severity: LOW (Corrected from Original Assessment)

### Summary

**The original N-5 claim ("No process.on('SIGINT') cleanup") was factually incorrect.** Signal handlers DO exist in `context-server.js:290-326` and are comprehensive. Both SIGINT and SIGTERM handlers properly clean up the main resources. Minor gaps remain.

### What IS Cleaned Up on Shutdown

Source: `context-server.js:296-312`

| Resource | Handler | Evidence |
|----------|---------|----------|
| Archival manager background job | `archivalManager.cleanup()` | Line 300 |
| Retry manager background job | `retryManager.stop_background_job()` | Line 301 |
| Access tracker pending counts | `accessTracker.flush_access_counts()` | Line 302 |
| SQLite database connection | `vectorIndex.closeDb()` | Line 303 |

### What Is NOT Cleaned Up

| Resource | File | Severity | Notes |
|----------|------|----------|-------|
| Tool cache cleanup interval | `tool-cache.js:361` | **Negligible** | Uses `.unref()` — will NOT prevent Node.js from exiting |
| Working memory sessions | N/A | **Low** | In-memory only, lost on exit regardless |
| Session manager state | N/A | **Low** | In-memory only |
| Duplicate access tracker handlers | `access-tracker.js:165-167` | **Cosmetic** | Registers its own SIGINT/SIGTERM, redundant with context-server.js |

### Background Intervals

| Interval | Source | Frequency | Stopped? |
|----------|--------|-----------|----------|
| Archival scan | `archival-manager.js:442` | Hourly | YES |
| Retry job | `retry-manager.js:368` | Every 5 min | YES |
| Tool cache cleanup | `tool-cache.js:361` | Every 30 sec | NO (but `.unref()` — harmless) |

### One Genuine Concern

`unhandledRejection` handler (context-server.js:324) logs but does NOT exit. A critical async failure could leave the server running in a degraded state without cleanup. This is a deliberate design choice (log-only) but could mask issues in production.

### Remediation

**Minimal (recommended):**
1. Add `toolCache.stopCleanupInterval()` to the SIGINT/SIGTERM handlers (cosmetic, the `.unref()` already handles it)
2. Remove the duplicate `process.on('SIGINT'/'SIGTERM')` handlers from `access-tracker.js` (lines 165-167) to avoid double-flush

**Optional:**
3. Consider making `unhandledRejection` trigger cleanup + exit for known-critical promise chains

### Files to Modify

- `.opencode/skill/system-spec-kit/mcp_server/context-server.js` — Add toolCache cleanup
- `.opencode/skill/system-spec-kit/mcp_server/lib/access-tracker.js` — Remove duplicate handlers

---

## Dismissed: MCP Tool Details in AGENTS.md

The original analysis identified three gaps related to MCP tool coverage in AGENTS.md:

- **N-1**: `memory_context` (L1) barely mentioned in AGENTS.md
- **N-2**: AGENTS.md mentions only 5 of 22 MCP tools
- **N-4**: Layer architecture invisible in AGENTS.md

**Decision: Not applicable.** AGENTS.md is the behavioral framework (gates, rules, routing). MCP tool details, layer architecture, and tool-specific documentation belong in `system-spec-kit/SKILL.md`, its `references/`, and `assets/` — which is where they already live. Gate 2 (Skill Routing) ensures agents load the appropriate SKILL.md when needed, which provides full tool documentation.

This is **by design**, not a gap.

---

## Remediation Priority Matrix

| ID | Limitation | Severity | Effort | Recommended Spec |
|----|-----------|----------|--------|-----------------|
| **KL-1** | SQLite schema drift | HIGH | Medium (migration code + 3 files) | New spec: `088-memory-conflicts-schema-unification` |
| **KL-2** | Stale gate numbering | MEDIUM | Low (sed replacements + install guide rewrite) | New spec: `089-gate-numbering-cleanup` |
| **KL-3** | Undocumented scripts | LOW | Low (add to capability scan tables) | Can be a Level 1 fix |
| **KL-4** | Signal handler gaps | LOW | Minimal (2 lines) | Can be a Level 1 fix |

### Suggested Execution Order

1. **KL-1** first — only limitation with active data loss (silent INSERT failures)
2. **KL-2 Phase 1** — fix active files with stale Gate 4/6 references (5 files, quick fixes)
3. **KL-3** — add 3 scripts to speckit.md and SKILL.md capability tables
4. **KL-2 Phase 2** — rewrite legacy install guide gate section (lower priority, documentation-only)
5. **KL-4** — cosmetic signal handler cleanup (lowest priority)

---

## Cross-References

- **Parent spec**: `087-speckit-deep-analysis/`
- **Implementation summary**: `implementation-summary.md` (Known Limitations section)
- **Original findings**: Plan at `plan.md` (Minor Gaps N-1 through N-5)
- **Decision records**: `decision-record.md` (ADR-001 through ADR-004)
