OpenAI Codex v0.111.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
model: gpt-5.4
provider: openai
approval: never
sandbox: read-only
reasoning effort: high
reasoning summaries: none
session id: 019ccedc-fba5-7b22-a449-4635bb9e8c09
--------
user
You are a cross-cutting architectural review agent. Perform deep analysis of storage and transaction code for data integrity bugs.

WORKING DIRECTORY: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
MCP SERVER: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/

FOCUS FILES (read ALL of these):
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/ (all .ts files)
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/database/ (all .ts files)
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/causal-edges.ts

PRIOR FINDINGS TO RE-VERIFY:
- F4: checkpoints.ts:664 — restoreCheckpoint FK CASCADE risk on working_memory
- F5: checkpoints.ts:873 — Causal-edge restore bypasses self-loop guard in insertEdge
- F20: causal-edges.ts:522 — cleanupOrphanedEdges without transaction; partial cleanup risk

AUDIT FOR:
1. Transaction boundaries — multi-step mutations without BEGIN/COMMIT
2. FK cascade risks — ON DELETE CASCADE chains that could delete too much
3. Self-loop injection via restore/import paths bypassing guards
4. INSERT OR REPLACE without schema validation
5. Concurrent access — WAL mode assumptions, lock contention
6. Missing rollback on partial failure
7. Orphan data from failed operations

For each prior finding (F4/F5/F20): state whether it is STILL PRESENT, FIXED, or PARTIALLY FIXED with evidence.

OUTPUT FORMAT:
---
FINDING: [id]
FILE: [path]:[line_range]
SEVERITY: [P0-CRITICAL/P1-IMPORTANT/P2-MINOR]
TYPE: [TRANSACTION/FK_CASCADE/SELF_LOOP/VALIDATION/CONCURRENCY]
STATUS: [NEW/STILL_PRESENT/FIXED/PARTIALLY_FIXED]
PRIOR_REF: [F# if re-verifying, or NONE]
DESCRIPTION: [what is wrong]
EVIDENCE: [code snippet]
SUGGESTED_FIX: [how to fix]
---

LEAF NESTING CONSTRAINT: You are at depth 1. Do NOT invoke sub-agents.
Depth: 1
warning: Under-development features enabled: child_agents_md. Under-development features are incomplete and may behave unpredictably. To suppress this warning, set `suppress_unstable_features_warning = true` in /Users/michelkerkmeester/.codex/config.toml.
mcp: code_mode starting
mcp: spec_kit_memory starting
mcp: sequential_thinking starting
mcp: code_mode ready
mcp: spec_kit_memory failed: MCP client for `spec_kit_memory` failed to start: MCP startup failed: handshaking with MCP server failed: connection closed: initialize response
mcp: sequential_thinking ready
mcp startup: ready: code_mode, sequential_thinking; failed: spec_kit_memory
codex
I’m treating this as a read-only architecture audit over the storage and transaction paths you listed, with explicit re-verification of F4/F5/F20. First I’m routing through the repo’s required skill flow, then I’ll read every target file and trace the mutation paths for integrity risks.
exec
/bin/zsh -lc 'rg --files .opencode/skill/system-spec-kit/mcp_server/lib/storage .opencode/skill/system-spec-kit/mcp_server/database .opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/causal-edges.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 2 in 52ms:
rg: .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/causal-edges.ts: No such file or directory (os error 2)
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts
.opencode/skill/system-spec-kit/mcp_server/database/README.md
.opencode/skill/system-spec-kit/mcp_server/lib/storage/README.md
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/index-refresh.ts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts
exec
/bin/zsh -lc 'python3 .opencode/skill/scripts/skill_advisor.py "Perform deep analysis of storage and transaction code for data integrity bugs in the MCP server, with prior finding re-verification" --threshold 0.8' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 1.45s:
python3: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
python3: error: couldn't create cache file '/tmp/xcrun_db-guv8WVSZ' (errno=Operation not permitted)
[
  {
    "skill": "mcp-clickup",
    "kind": "skill",
    "confidence": 0.86,
    "uncertainty": 0.2,
    "passes_threshold": true,
    "reason": "Matched: !intent:tooling, code, mcp(name), prior~"
  },
  {
    "skill": "sk-code--web",
    "kind": "skill",
    "confidence": 0.85,
    "uncertainty": 0.28,
    "passes_threshold": true,
    "reason": "Matched: !code(multi), !verification, code(name), verification"
  },
  {
codex
The audit target has one path mismatch: the requested `lib/cognitive/causal-edges.ts` does not exist here, but there is a [`lib/storage/causal-edges.ts`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts) that appears to be the live file. I’m proceeding against that file and the rest of the listed storage/database code, and I’ll call out any places where the moved path affects confidence.
exec
/bin/zsh -lc "rg --files .opencode/skill/system-spec-kit/mcp_server/database -g '*.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/sk-code--review/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 52ms:

 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Checkpoints
// ---------------------------------------------------------------

/* ---------------------------------------------------------------
   1. LIB MODULE IMPORTS
--------------------------------------------------------------- */

import * as checkpoints from '../lib/storage/checkpoints';
import * as vectorIndex from '../lib/search/vector-index';
import * as bm25Index from '../lib/search/bm25-index';
import * as triggerMatcher from '../lib/parsing/trigger-matcher';
import * as confidenceTracker from '../lib/scoring/confidence-tracker';
import { executeAutoPromotion } from '../lib/search/auto-promotion';
import { recordSelection } from '../lib/search/learned-feedback';
import { recordUserSelection } from '../lib/eval/ground-truth-feedback';
import { recordNegativeFeedbackEvent } from '../lib/scoring/negative-feedback';
import { checkDatabaseUpdated } from '../core';
import { requireDb, toErrorMessage } from '../utils';

 succeeded in 52ms:
---
name: sk-code--review
description: "Stack-agnostic code review baseline skill with findings-first severity analysis, mandatory security/correctness minimums, and adaptive overlay compatibility with sk-code--opencode, sk-code--web, and sk-code--full-stack standards."
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
version: 1.2.0.0
---

<!-- Keywords: sk-code--review, code-review, pull-request, findings-first, security-review, quality-gate, stack-agnostic, baseline-overlay -->

# Code Review Baseline - Stack-Agnostic Findings-First Review

Universal `sk-code` review baseline for any codebase, implemented by `sk-code--review` and paired with one `sk-code--*` overlay skill for stack-specific rules.

<!-- ANCHOR:when-to-use -->
## 1. WHEN TO USE

### Activation Triggers

Use this skill when:
- A user asks for code review, PR review, quality gate, or merge readiness.
 succeeded in 50ms:
// ---------------------------------------------------------------
// MODULE: Causal Edges
// ---------------------------------------------------------------
// Causal relationship graph for memory lineage
// ---------------------------------------------------------------

import type Database from 'better-sqlite3';
import { clearDegreeCache } from '../search/graph-search-fn';

/* -------------------------------------------------------------
   1. CONSTANTS
----------------------------------------------------------------*/

const RELATION_TYPES = Object.freeze({
  CAUSED: 'caused',
  ENABLED: 'enabled',
  SUPERSEDES: 'supersedes',
  CONTRADICTS: 'contradicts',
  DERIVED_FROM: 'derived_from',
  SUPPORTS: 'supports',
codex
I’ve confirmed the review overlay and I’m moving through the actual mutation code now. The key threads I’m tracing are checkpoint restore/delete behavior, edge insert/cleanup paths, and whether any “best effort” error handling leaves the database in a half-mutated state.
Plan update
Read all targeted storage/handler files, trace mutation flows, re-verify prior findings, then synthesize only integrity-related findings with evidence.
  → Inventory and read all target files in storage/database plus checkpoint and causal-edge handlers
  • Trace transaction boundaries, FK cascade behavior, restore/import paths, and concurrency assumptions
  • Re-verify prior findings F4, F5, and F20 with line-cited evidence
  • Produce findings-first audit report in the requested format
exec
/bin/zsh -lc "sed -n '260,620p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "find .opencode/skill/system-spec-kit/mcp_server/database -maxdepth 1 -name '*.ts' | sort" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "find .opencode/skill/system-spec-kit/mcp_server/lib/storage -maxdepth 1 -name '*.ts' | sort" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"transaction\\(|BEGIN|COMMIT|ROLLBACK|INSERT OR REPLACE|ON DELETE CASCADE|FOREIGN KEY|PRAGMA journal_mode|WAL|busy_timeout|restoreCheckpoint|cleanupOrphanedEdges|insertEdge\\(\" .opencode/skill/system-spec-kit/mcp_server/lib/storage .opencode/skill/system-spec-kit/mcp_server/database .opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:

 succeeded in 52ms:
  try {
    return (db.prepare(`
      SELECT * FROM causal_edges
      WHERE source_id = ?
      ORDER BY strength DESC
      LIMIT ?
    `) as Database.Statement).all(sourceId, limit) as CausalEdge[];
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[causal-edges] getEdgesFrom error: ${msg}`);
    return [];
  }
}

function getEdgesTo(targetId: string, limit: number = MAX_EDGES_LIMIT): CausalEdge[] {
  if (!db) return [];

  try {
    return (db.prepare(`
      SELECT * FROM causal_edges
 succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/index-refresh.ts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts
 succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:193:  const result = checkpoints.restoreCheckpoint(name, clear_existing);
.opencode/skill/system-spec-kit/mcp_server/database/README.md:33:- Runtime-generated (canonical): `dist/database/context-index.sqlite` and WAL sidecars (`-wal`, `-shm`).
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:213:    CREATE TRIGGER IF NOT EXISTS memory_fts_insert AFTER INSERT ON memory_index BEGIN
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:220:    CREATE TRIGGER IF NOT EXISTS memory_fts_update AFTER UPDATE ON memory_index BEGIN
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:229:    CREATE TRIGGER IF NOT EXISTS memory_fts_delete AFTER DELETE ON memory_index BEGIN
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:271:    const run = database.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:297:        INSERT OR REPLACE INTO schema_version (id, version, updated_at)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:377:  const updateTx = db.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:342:    database.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts:144:   5. ROLLBACK
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:102:    process.env.CI_COMMIT_REF_NAME,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:103:    process.env.VERCEL_GIT_COMMIT_REF,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:393:    const checkpointInfo = database.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:569:function restoreCheckpoint(nameOrId: string | number, clearExisting: boolean = false): RestoreResult {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:625:    // clearExisting mode: INSERT OR REPLACE is safe (table was already emptied).
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:626:    // merge mode: INSERT OR REPLACE triggers CASCADE DELETE on working_memory
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:627:    // via the FOREIGN KEY (memory_id) REFERENCES memory_index(id) ON DELETE CASCADE.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:666:            FOREIGN KEY (memory_id) REFERENCES memory_index(id) ON DELETE SET NULL
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:697:    // If any INSERT fails after DELETE, ROLLBACK restores original data.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:699:    // the transaction, allowing COMMIT after DELETE + partial inserts = data loss.
exec
/bin/zsh -lc "sed -n '261,560p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '620,860p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '561,980p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
  if (!db) return [];
  try {
    return (db.prepare(`
      SELECT * FROM weight_history WHERE edge_id = ? ORDER BY changed_at DESC LIMIT ?
    `) as Database.Statement).all(edgeId, limit) as WeightHistoryEntry[];
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[causal-edges] getWeightHistory error: ${msg}`);
    return [];
  }
}

function rollbackWeights(edgeId: number, toTimestamp: string): boolean {
  if (!db) return false;
  const database = db;
  try {
    // AI-WHY: Wrap SELECTs + UPDATE + logWeightChange in a transaction for atomicity
    const changed = database.transaction(() => {
      // Get current strength before rollback
      const current = (database.prepare(
 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Checkpoints
// ---------------------------------------------------------------
// Gzip-compressed database checkpoints with embedding preservation
// ---------------------------------------------------------------

// Node stdlib
import * as zlib from 'zlib';

// External packages
import type Database from 'better-sqlite3';

// Internal utils
import { toErrorMessage } from '../../utils/db-helpers';

/* -------------------------------------------------------------
   1. CONSTANTS
----------------------------------------------------------------*/

const MAX_CHECKPOINTS = 10;
 succeeded in 52ms:
  return value;
}

function getMemoryRestoreColumns(
  database: Database.Database,
  memories: Array<Record<string, unknown>>
): string[] {
  const tableColumns = new Set(getTableColumns(database, 'memory_index'));
  if (tableColumns.size === 0) {
    return [];
  }

  const snapshotColumns = new Set<string>();
  for (const memory of memories) {
    for (const key of Object.keys(memory)) {
      if (tableColumns.has(key)) {
        snapshotColumns.add(key);
      }
    }
  }
 succeeded in 52ms:
    return (row as CheckpointEntry) || null;
  } catch (error: unknown) {
    const msg = toErrorMessage(error);
    console.warn(`[checkpoints] getCheckpoint error: ${msg}`);
    return null;
  }
}

function restoreCheckpoint(nameOrId: string | number, clearExisting: boolean = false): RestoreResult {
  const database = getDatabase();
  const result: RestoreResult = { restored: 0, skipped: 0, errors: [], workingMemoryRestored: 0 };

  try {
    const checkpoint = getCheckpoint(nameOrId);
    if (!checkpoint || !checkpoint.memory_snapshot) {
      result.errors.push('Checkpoint not found or empty');
      return result;
    }

    // Decompress snapshot
codex
I’ve reached the checkpoint restore internals now. Two prior items already look materially changed: the restore path now validates snapshot rows before mutating, and both the working-memory schema and causal-edge restore path include explicit guards that weren’t in the historical findings.
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Transaction Manager
// ---------------------------------------------------------------
// AI-GUARD: Atomic file + index operations with pending file recovery
// ---------------------------------------------------------------

import * as fs from 'fs';
import * as path from 'path';

/* -------------------------------------------------------------
   1. CONSTANTS
----------------------------------------------------------------*/

const PENDING_SUFFIX = '_pending';
const TEMP_SUFFIX = '.tmp';

/* -------------------------------------------------------------
   2. INTERFACES
----------------------------------------------------------------*/

 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Mutation Ledger
// ---------------------------------------------------------------
// Append-only audit trail for all memory mutations
// SQLite triggers enforce immutability (no UPDATE/DELETE on ledger)
// ---------------------------------------------------------------

import { createHash } from 'crypto';
import type Database from 'better-sqlite3';

/* -------------------------------------------------------------
   1. TYPES
----------------------------------------------------------------*/

type MutationType = 'create' | 'update' | 'delete' | 'merge' | 'archive' | 'restore' | 'reindex';

interface MutationLedgerEntry {
  id: number;
  timestamp: string;
  mutation_type: MutationType;
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Incremental Index
// ---------------------------------------------------------------
// Mtime-based incremental indexing for fast re-indexing
// ---------------------------------------------------------------

// Node stdlib
import * as fs from 'fs';

// External packages
import type Database from 'better-sqlite3';

// Internal modules
import { getCanonicalPathKey } from '../utils/canonical-path';

/* -------------------------------------------------------------
   1. CONSTANTS
----------------------------------------------------------------*/

const MTIME_FAST_PATH_MS = 1000; // Skip if mtime within 1 second
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: N3-lite Consolidation Engine
// ---------------------------------------------------------------
// Lightweight graph maintenance: contradiction scan, Hebbian
// strengthening, staleness detection, edge bounds enforcement.
// Sprint 6a — behind SPECKIT_CONSOLIDATION flag.
// ---------------------------------------------------------------

import type Database from 'better-sqlite3';
import { isConsolidationEnabled } from '../search/search-flags';
import {
  updateEdge,
  getStaleEdges,
  countEdgesForNode,
  MAX_EDGES_PER_NODE,
  MAX_AUTO_STRENGTH,
  MAX_STRENGTH_INCREASE_PER_CYCLE,
  STALENESS_THRESHOLD_DAYS,
  DECAY_STRENGTH_AMOUNT,
  DECAY_PERIOD_DAYS,
exec
/bin/zsh -lc "sed -n '261,520p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '261,520p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
}

function listStaleIndexedPaths(scannedFilePaths: string[]): string[] {
  if (!db) return [];

  const scannedCanonicalPaths = new Set(scannedFilePaths.map((filePath) => getCanonicalPathKey(filePath)));
  const stalePaths = new Set<string>();

  try {
    const rows = hasCanonicalPathColumn()
      ? (db.prepare(`
          SELECT DISTINCT file_path, canonical_file_path
          FROM memory_index
          WHERE file_path IS NOT NULL AND file_path != ''
        `) as Database.Statement).all() as IndexedPathRow[]
      : (db.prepare(`
          SELECT DISTINCT file_path
          FROM memory_index
          WHERE file_path IS NOT NULL AND file_path != ''
        `) as Database.Statement).all() as IndexedPathRow[];
 succeeded in 51ms:
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom > 0 ? dot / denom : 0;
}

function computeWordOverlap(textA: string, textB: string): number {
  const wordsA = new Set(textA.toLowerCase().split(/\s+/).filter(w => w.length > 3));
  const wordsB = new Set(textB.toLowerCase().split(/\s+/).filter(w => w.length > 3));
  if (wordsA.size === 0 || wordsB.size === 0) return 0;

  let overlap = 0;
  for (const w of wordsA) {
    if (wordsB.has(w)) overlap++;
  }
  return overlap / Math.max(wordsA.size, wordsB.size);
}

/* -------------------------------------------------------------
   4. T002e: CONTRADICTION CLUSTER SURFACING
----------------------------------------------------------------*/
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Reconsolidation
// ---------------------------------------------------------------
// ---------------------------------------------------------------
// TM-06: Reconsolidation-on-Save
//
// After embedding generation, check top-3 most similar memories
// in the spec folder:
// - similarity >= 0.88: MERGE (duplicate - merge content,
//   boost importance_weight)
// - similarity 0.75-0.88: CONFLICT (supersede prior memory via causal
//   'supersedes' edge)
// - similarity < 0.75: COMPLEMENT (store new memory unchanged)
//
// Behind SPECKIT_RECONSOLIDATION flag (default OFF)
// REQUIRES: checkpoint created before first enable
// ---------------------------------------------------------------

import { createHash } from 'crypto';
import type Database from 'better-sqlite3';
 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: History
// ---------------------------------------------------------------
// Tracks change history for memory entries (ADD, UPDATE, DELETE)
// ---------------------------------------------------------------

// External packages
import type Database from 'better-sqlite3';

/* -------------------------------------------------------------
   1. INTERFACES
----------------------------------------------------------------*/

/**
 * Describes the HistoryEntry shape.
 */
export interface HistoryEntry {
  id: string;
  memory_id: number;
  prev_value: string | null;
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '261,520p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/index-refresh.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Access Tracker
// ---------------------------------------------------------------
// Batched access tracking with accumulator
// ---------------------------------------------------------------

import type Database from 'better-sqlite3';

/* -------------------------------------------------------------
   1. CONSTANTS
----------------------------------------------------------------*/

const ACCUMULATOR_THRESHOLD = 0.5;
const INCREMENT_VALUE = 0.1;
// AI-TRACE: P4-14 FIX: Cap accumulator Map size to prevent unbounded memory growth
const MAX_ACCUMULATOR_SIZE = 10000;

/* -------------------------------------------------------------
   2. INTERFACES
----------------------------------------------------------------*/
 succeeded in 51ms:
 * Merge two content strings by appending unique new lines.
 *
 * Splits both contents into lines, then appends lines from the new
 * content that are not present in the existing content.
 *
 * @param existing - The existing memory content
 * @param incoming - The new memory content
 * @returns The merged content string
 */
export function mergeContent(existing: string, incoming: string): string {
  if (!existing || existing.trim().length === 0) {
    return incoming;
  }
  if (!incoming || incoming.trim().length === 0) {
    return existing;
  }

  const existingLines = new Set(
    existing.split('\n').map(line => line.trim()).filter(line => line.length > 0)
  );
 succeeded in 50ms:
// ---------------------------------------------------------------
// MODULE: Schema Downgrade (v16 -> v15)
// ---------------------------------------------------------------
// AI-WHY: Targeted downgrade utility for removing chunking columns added in v16:
//   - parent_id
//   - chunk_index
//   - chunk_label
// This intentionally supports ONLY v16 -> v15.
// ---------------------------------------------------------------

import type Database from 'better-sqlite3';
import * as checkpoints from './checkpoints';

/* ---------------------------------------------------------------
   1. TYPES
--------------------------------------------------------------- */

interface SchemaDowngradeOptions {
  specFolder?: string;
  checkpointName?: string;
 succeeded in 50ms:
// ---------------------------------------------------------------
// MODULE: Index Refresh
// ---------------------------------------------------------------
// Manages embedding index freshness on the memory_index table
// ---------------------------------------------------------------

// External packages
import type Database from 'better-sqlite3';

/* -------------------------------------------------------------
   1. CONSTANTS
----------------------------------------------------------------*/

const RETRY_THRESHOLD = 3;

/* -------------------------------------------------------------
   2. INTERFACES
----------------------------------------------------------------*/

/**
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '241,420p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts | sed -n '620,930p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts | sed -n '120,560p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:

function downgradeSchemaV16ToV15(
  database: Database.Database,
  options: SchemaDowngradeOptions = {}
): SchemaDowngradeResult {
  const currentVersion = getCurrentSchemaVersion(database);
  if (currentVersion !== TARGET_FROM_VERSION) {
    throw new Error(`Downgrade supports only v${TARGET_FROM_VERSION} -> v${TARGET_TO_VERSION}. Current schema is v${currentVersion}.`);
  }

  ensureColumnsExist(database, REMOVED_COLUMNS);

  const checkpointName = options.checkpointName || `pre-schema-downgrade-v16-to-v15-${nowTimestampForName()}`;
  const checkpoint = checkpoints.createCheckpoint({
    name: checkpointName,
    specFolder: options.specFolder || null,
    metadata: {
      reason: 'schema downgrade v16->v15',
      fromVersion: TARGET_FROM_VERSION,
      toVersion: TARGET_TO_VERSION,
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Learned Triggers Schema Migration (R11)
// ---------------------------------------------------------------
// AI-GUARD: Schema migration for the learned_triggers column.
//
// ALTER TABLE memory_index ADD COLUMN learned_triggers TEXT DEFAULT '[]';
//
// CRITICAL: This column MUST NOT be added to the FTS5 index.
// The column stores JSON array of { term, addedAt, source, expiresAt }
// objects representing learned relevance feedback terms.
//
// Rollback: ALTER TABLE memory_index DROP COLUMN learned_triggers;
// (SQLite 3.35.0+)
// ---------------------------------------------------------------

import type { DatabaseExtended as Database } from '@spec-kit/shared/types';

/* ---------------------------------------------------------------
   1. TYPES
   --------------------------------------------------------------- */
 succeeded in 51ms:
   620	      result.errors.push('No compatible memory_index columns found for restore');
   621	      return result;
   622	    }
   623	
   624	    // AI-GUARD: P0-005 FIX: Split INSERT strategy by restore mode.
   625	    // clearExisting mode: INSERT OR REPLACE is safe (table was already emptied).
   626	    // merge mode: INSERT OR REPLACE triggers CASCADE DELETE on working_memory
   627	    // via the FOREIGN KEY (memory_id) REFERENCES memory_index(id) ON DELETE CASCADE.
   628	    // Use INSERT OR IGNORE + explicit UPDATE to avoid the delete-reinsert cycle.
   629	    const memoryInsertStmt = memoryRestoreColumns.length > 0
   630	      ? database.prepare(`
   631	          INSERT OR ${clearExisting ? 'REPLACE' : 'IGNORE'} INTO memory_index (${memoryRestoreColumns.join(', ')})
   632	          VALUES (${memoryRestoreColumns.map(() => '?').join(', ')})
   633	        `) as Database.Statement
   634	      : null;
   635	
   636	    const nonIdColumns = memoryRestoreColumns.filter(c => c !== 'id');
   637	    const memoryUpdateStmt = (!clearExisting && nonIdColumns.length > 0)
   638	      ? database.prepare(`
   639	          UPDATE memory_index SET ${nonIdColumns.map(c => `${c} = ?`).join(', ')}
 succeeded in 51ms:
   120	  } catch (_e: unknown) {
   121	    // Best-effort: table may not exist yet during early startup sequencing
   122	  }
   123	}
   124	
   125	/* -------------------------------------------------------------
   126	   5. EDGE OPERATIONS
   127	----------------------------------------------------------------*/
   128	
   129	function insertEdge(
   130	  sourceId: string,
   131	  targetId: string,
   132	  relation: RelationType,
   133	  strength: number = 1.0,
   134	  evidence: string | null = null,
   135	  shouldInvalidateCache: boolean = true,
   136	  createdBy: string = 'manual',
   137	): number | null {
   138	  if (!db) {
   139	    console.warn('[causal-edges] Database not initialized. Server may still be starting up.');
codex
I’ve read the main storage modules; the last sweep is around schema definitions and helper flows to see whether any integrity guarantees are undermined elsewhere. I’m specifically looking for places where the code comments claim atomicity but inner helpers still swallow errors or where an older FK definition can quietly survive migrations.
exec
/bin/zsh -lc "sed -n '220,420p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"restoreCheckpoint\\(|cleanupOrphanedEdges\\(|insertEdge\\(|deleteEdge\\(|db\\.transaction\\(|transaction\\(\" .opencode/skill/system-spec-kit/mcp_server -g '*.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"create table if not exists working_memory|CREATE TABLE IF NOT EXISTS working_memory|memory_history|causal_edges\" .opencode/skill/system-spec-kit/mcp_server -g '*.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"working_memory|causal_edges|ON DELETE|FOREIGN KEY|INSERT OR REPLACE|INSERT OR IGNORE|PRAGMA journal_mode|busy_timeout|wal|WAL|foreign_keys\" .opencode/skill/system-spec-kit/mcp_server -g '*.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
      accumulators.clear();
    } catch {
      // Ignore all errors during shutdown flush
    }
  };

  _exitFlushHandler = flush;
  process.on('beforeExit', flush);
  process.on('SIGTERM', flush);
  process.on('SIGINT', flush);

  exitHandlersInstalled = true;
}

function cleanupExitHandlers(): void {
  if (_exitFlushHandler) {
    process.removeListener('beforeExit', _exitFlushHandler);
    process.removeListener('SIGTERM', _exitFlushHandler);
    process.removeListener('SIGINT', _exitFlushHandler);
    _exitFlushHandler = null;
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:170:  const bulkDeleteTx = database.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:50:  const indexWithMetadata = database.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:69:      database.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:161:      const bulkDeleteTx = database.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:135:    database.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:401:      const orphanResult = causalEdges.cleanupOrphanedEdges();
.opencode/skill/system-spec-kit/mcp_server/cli.ts:299:  const bulkDeleteTx = db.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:502:    const edge = causalEdges.insertEdge(String(sourceId), String(targetId), safeRelation, strength ?? 1.0, evidence ?? null);
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:682:    const result: { deleted: boolean } = { deleted: causalEdges.deleteEdge(edgeId) };
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:148:        causalEdges.insertEdge(edgeSourceId, edgeTargetId, mapping.relation, 1.0, `Auto-extracted from ${link_type} in memory file`);
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:193:  const result = checkpoints.restoreCheckpoint(name, clear_existing);
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:147:  const setupParent = database.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:343:      const rollbackTx = database.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:384:    const finalizeSwapTx = database.transaction((newChildIds: number[]) => {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:415:    db.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:445:    const runBatch = db.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/tests/n3lite-consolidation.vitest.ts:193:    insertEdge('1', '3', 'caused');
.opencode/skill/system-spec-kit/mcp_server/tests/n3lite-consolidation.vitest.ts:194:    insertEdge('2', '4', 'supports');
.opencode/skill/system-spec-kit/mcp_server/tests/n3lite-consolidation.vitest.ts:223:    const edgeId = insertEdge('1', '2', 'caused', 0.5);
.opencode/skill/system-spec-kit/mcp_server/tests/n3lite-consolidation.vitest.ts:240:    const edgeId = insertEdge('1', '2', 'caused', 0.3);
 succeeded in 50ms:
Total output lines: 299

.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:77:        description: 'Enable causal-neighbor boost (2-hop traversal on causal_edges). Defaults to SPECKIT_CAUSAL_BOOST env flag.'
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:37:    // Create memory_history table
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:39:      CREATE TABLE IF NOT EXISTS memory_history (
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:31:  id: number;               // T202: causal_edges.id for unlink workflow
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:578:      const linkedRows = (db.prepare('SELECT DISTINCT source_id FROM causal_edges UNION SELECT DISTINCT target_id FROM causal_edges') as import('better-sqlite3').Statement).all() as Array<{ source_id: string }>;
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:583:      // causal_edges table may not exist yet — coverage is 0
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:112:    // Create causal_edges table
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:114:      CREATE TABLE IF NOT EXISTS causal_edges (
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:133:        edge_id INTEGER NOT NULL REFERENCES causal_edges(id) ON DELETE CASCADE,
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:156:    testDb.exec('DELETE FROM causal_edges');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:300:          SELECT CAST(target_id AS INTEGER) as neighbor_id FROM causal_edges WHERE source_id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:302:          SELECT CAST(source_id AS INTEGER) as neighbor_id FROM causal_edges WHERE target_id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:345:        SELECT id, strength, last_accessed, created_by FROM causal_edges
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:369:        SELECT id, strength, last_accessed, created_by FROM causal_edges
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:453:        SELECT source_id AS node_id FROM causal_edges
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:455:        SELECT target_id AS node_id FROM causal_edges
.opencode/skill/system-spec-kit/mcp_server/tests/graph-search-fn.vitest.ts:182:      if (sql.includes('FROM causal_edges ce')) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:55:    CREATE TABLE IF NOT EXISTS memory_history (
 succeeded in 51ms:
Total output lines: 543

.opencode/skill/system-spec-kit/mcp_server/context-server.ts:833:    // T076: Verify WAL mode is active for operational concurrency guarantees.
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:834:    const walRow = database.prepare('PRAGMA journal_mode').get() as { journal_mode?: string } | undefined;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:835:    const journalMode = String(walRow?.journal_mode ?? '').toLowerCase();
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:836:    if (journalMode !== 'wal') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:837:      database.pragma('journal_mode = WAL');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:838:      console.warn('[context-server] journal_mode was not WAL; forcing WAL mode');
.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:213:    db.prepare('INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)').run('last_index_scan', time.toString());
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:410:      INSERT OR IGNORE INTO session_sent_memories (session_id, memory_hash, memory_id, sent_at)
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:441:      INSERT OR IGNORE INTO session_sent_memories (session_id, memory_hash, memory_id, sent_at)
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:524: *   - working_memory: entries with last_focused older than threshold
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:545:  // 1. Clean stale working_memory entries
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:547:    const wmStmt = db.prepare('DELETE FROM working_memory WHERE last_focused < ?');
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:554:      errors.push(`working_memory cleanup: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:587:      `[session-manager] Stale session cleanup: removed ${workingMemoryDeleted} working_memory, ` +
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:183:    db.prepare('INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)')
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts:132: * FAIL-SAFE: never throws — all errors are swallowed to ensure
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts:166:    // AI-GUARD: Intentionally swallowed — instrumentation must never cause failures
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:56:  function walkSpecsDir(specsRoot: string, dir: string): void {
codex
One architectural wrinkle showed up outside the exact focus list: the restore code now creates `working_memory` with `ON DELETE SET NULL`, but the normal runtime schema still appears to create that table with `ON DELETE CASCADE`. I’m checking that now because it changes whether F4 is truly fixed or only mitigated in the restore path.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts | sed -n '36,90p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts | sed -n '1068,1092p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/context-server.ts | sed -n '828,842p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts | sed -n '320,372p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
    36	// AI-WHY: Cap mention_count to prevent unbounded integer growth in long-lived
    37	// sessions. The mention boost formula (mention_count * MENTION_BOOST_FACTOR)
    38	// would produce unreasonably large scores without a ceiling.
    39	const MAX_MENTION_COUNT = 100;
    40	
    41	/* --- 2. SCHEMA SQL --- */
    42	
    43	const SCHEMA_SQL = `
    44	  CREATE TABLE IF NOT EXISTS working_memory (
    45	    id INTEGER PRIMARY KEY AUTOINCREMENT,
    46	    session_id TEXT NOT NULL,
    47	    memory_id INTEGER NOT NULL,
    48	    attention_score REAL DEFAULT 1.0,
    49	    added_at TEXT DEFAULT CURRENT_TIMESTAMP,
    50	    last_focused TEXT DEFAULT CURRENT_TIMESTAMP,
    51	    focus_count INTEGER DEFAULT 1,
    52	    event_counter INTEGER NOT NULL DEFAULT 0,
    53	    mention_count INTEGER NOT NULL DEFAULT 0,
    54	    source_tool TEXT,
    55	    source_call_id TEXT,
 succeeded in 51ms:
  1068	/**
  1069	 * Ensure companion tables exist alongside memory_index.
  1070	 */
  1071	export function ensureCompanionTables(database: Database.Database): void {
  1072	  database.exec(`
  1073	    CREATE TABLE IF NOT EXISTS memory_history (
  1074	      id TEXT PRIMARY KEY,
  1075	      memory_id INTEGER NOT NULL,
  1076	      prev_value TEXT,
  1077	      new_value TEXT,
  1078	      event TEXT NOT NULL CHECK(event IN ('ADD', 'UPDATE', 'DELETE')),
  1079	      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  1080	      is_deleted INTEGER DEFAULT 0,
  1081	      actor TEXT DEFAULT 'system',
  1082	      FOREIGN KEY (memory_id) REFERENCES memory_index(id)
  1083	    )
  1084	  `);
  1085	
  1086	  database.exec(`
  1087	    CREATE TABLE IF NOT EXISTS checkpoints (
 succeeded in 51ms:
   828	    }
   829	
   830	    // Check SQLite version meets minimum requirement (3.35.0+)
   831	    checkSqliteVersion(database);
   832	
   833	    // T076: Verify WAL mode is active for operational concurrency guarantees.
   834	    const walRow = database.prepare('PRAGMA journal_mode').get() as { journal_mode?: string } | undefined;
   835	    const journalMode = String(walRow?.journal_mode ?? '').toLowerCase();
   836	    if (journalMode !== 'wal') {
   837	      database.pragma('journal_mode = WAL');
   838	      console.warn('[context-server] journal_mode was not WAL; forcing WAL mode');
   839	    }
   840	
   841	    const graphSearchFn = isGraphUnifiedEnabled()
   842	      ? createUnifiedGraphSearchFn(database)
 succeeded in 51ms:
   320	    // AI-GUARD: Add causal 'supersedes' edge only when caller provides a distinct new ID.
   321	    // Prevent self-referential supersedes edges (source == target).
   322	    let edgeId: number | null = null;
   323	    const hasDistinctNewId =
   324	      typeof newMemory.id === 'number' &&
   325	      Number.isFinite(newMemory.id) &&
   326	      newMemory.id !== existingMemory.id;
   327	
   328	    if (hasDistinctNewId) {
   329	      // AI-GUARD: Atomic transaction: deprecate + edge must succeed or fail together.
   330	      // Without this, a failed insertEdge leaves an orphaned deprecation.
   331	      db.transaction(() => {
   332	        db.prepare(`
   333	          UPDATE memory_index
   334	          SET importance_tier = 'deprecated',
   335	              updated_at = datetime('now')
   336	          WHERE id = ?
   337	        `).run(existingMemory.id);
   338	
   339	        const sourceId = String(newMemory.id);
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts | sed -n '340,392p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts | sed -n '222,242p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts | sed -n '136,214p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts | sed -n '392,410p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
   340	  });
   341	
   342	  return update_memory_tx();
   343	}
   344	
   345	/**
   346	 * Deletes a memory and its related index records.
   347	 * @param id - The memory identifier.
   348	 * @returns True when a memory was deleted.
   349	 */
   350	export function delete_memory(id: number): boolean {
   351	  const database = initialize_db();
   352	  const sqlite_vec = get_sqlite_vec_available();
   353	
   354	  const delete_memory_tx = database.transaction(() => {
   355	    database.prepare('DELETE FROM memory_history WHERE memory_id = ?').run(id);
   356	
   357	    if (sqlite_vec) {
   358	      try {
   359	        database.prepare('DELETE FROM vec_memories WHERE rowid = ?').run(BigInt(id));
 succeeded in 51ms:
   222	      // v7 -> v8: Create causal_edges table for Causal Memory Graph (REQ-012, T043-T047)
   223	      try {
   224	        database.exec(`
   225	          CREATE TABLE IF NOT EXISTS causal_edges (
   226	            id INTEGER PRIMARY KEY,
   227	            source_id TEXT NOT NULL,
   228	            target_id TEXT NOT NULL,
   229	            relation TEXT NOT NULL CHECK(relation IN (
   230	              'caused', 'enabled', 'supersedes', 'contradicts', 'derived_from', 'supports'
   231	            )),
   232	            strength REAL DEFAULT 1.0 CHECK(strength >= 0.0 AND strength <= 1.0),
   233	            evidence TEXT,
   234	            extracted_at TEXT DEFAULT (datetime('now')),
   235	            created_by TEXT DEFAULT 'manual',
   236	            last_accessed TEXT,
   237	            UNIQUE(source_id, target_id, relation)
   238	          )
   239	        `);
   240	        logger.info('Migration v8: Created causal_edges table');
   241	      } catch (e: unknown) {
 succeeded in 51ms:
   392	    }
   393	  }
   394	  // AI-WHY: Fix #28 (017-refinement-phase-6) — cleanupOrphanedEdges was exported but
   395	  // never invoked at runtime. Wire it into autoRepair so orphaned causal edges
   396	  // (referencing deleted memories) are cleaned up during health checks.
   397	  if (autoRepair && database) {
   398	    try {
   399	      // AI: Fix F8 — ensure causal-edges DB init before orphan cleanup.
   400	      causalEdges.init(database);
   401	      const orphanResult = causalEdges.cleanupOrphanedEdges();
   402	      if (orphanResult.deleted > 0) {
   403	        repair.attempted = true;
   404	        repair.repaired = true;
   405	        repair.actions.push(`orphan_edges_cleaned:${orphanResult.deleted}`);
   406	        hints.push(`Auto-repair: removed ${orphanResult.deleted} orphaned causal edge(s)`);
   407	      }
   408	    } catch (orphanError: unknown) {
   409	      repair.errors.push(`Orphan edge cleanup failed: ${sanitizeErrorForHint(toErrorMessage(orphanError))}`);
   410	    }
 succeeded in 51ms:
   136	
   137	/**
   138	 * Delete a file if it exists.
   139	 */
   140	function deleteFileIfExists(filePath: string): boolean {
   141	  try {
   142	    if (fs.existsSync(filePath)) {
   143	      fs.unlinkSync(filePath);
   144	      metrics.totalDeletes++;
   145	      metrics.lastOperationTime = new Date().toISOString();
   146	      return true;
   147	    }
   148	    return false;
   149	  } catch (error: unknown) {
   150	    const msg = error instanceof Error ? error.message : String(error);
   151	    console.warn(`[transaction-manager] deleteFileIfExists error: ${msg}`);
   152	    metrics.totalErrors++;
   153	    return false;
   154	  }
   155	}
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts | sed -n '856,924p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts | sed -n '340,392p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts | sed -n '520,542p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts | sed -n '372,430p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
   372	      newMemoryId: newMemory.id ?? existingMemory.id,
   373	      causalEdgeId: edgeId,
   374	      similarity: existingMemory.similarity,
   375	    };
   376	  } catch (err: unknown) {
   377	    const message = err instanceof Error ? err.message : String(err);
   378	    throw new Error(`Conflict operation failed: ${message}`);
   379	  }
   380	}
   381	
   382	/* ---------------------------------------------------------------
   383	   8. COMPLEMENT OPERATION
   384	   --------------------------------------------------------------- */
   385	
   386	/**
   387	 * Store a new memory unchanged (similarity < 0.75).
   388	 *
   389	 * The new memory is distinct enough from existing memories to be
   390	 * stored as a separate entry.
   391	 *
 succeeded in 52ms:
   856	
   857	      // P1-036: Restore causal_edges from checkpoint snapshot.
   858	      if (tableExists(database, 'causal_edges')) {
   859	        if (checkpointSpecFolder && restoredMemoryIds.size > 0) {
   860	          try {
   861	            deleteCausalEdgesForMemoryIds(database, Array.from(restoredMemoryIds));
   862	          } catch (_error: unknown) {
   863	            // Table may not exist
   864	          }
   865	        }
   866	
   867	        if (!Array.isArray(snapshot.causalEdges) || snapshot.causalEdges.length === 0) {
   868	          // No edges captured for this checkpoint state — leave the scoped graph cleared.
   869	        } else {
   870	        const edgeColumns = getTableColumns(database, 'causal_edges');
   871	        if (edgeColumns.length > 0) {
   872	          const memoryExistsStmt = database.prepare(
   873	            'SELECT 1 FROM memory_index WHERE id = ? LIMIT 1'
   874	          ) as Database.Statement;
   875	          const edgeInsertStmt = database.prepare(`
 succeeded in 52ms:
   520	    return [];
   521	  }
   522	}
   523	
   524	// AI-WHY: Fix #28 (017-refinement-phase-6) — Automated orphan edge cleanup
   525	function cleanupOrphanedEdges(): { deleted: number } {
   526	  if (!db) return { deleted: 0 };
   527	  try {
   528	    const orphaned = findOrphanedEdges();
   529	    let deleted = 0;
   530	    // AI: Fix F20 — wrap multi-step mutation in transaction for atomicity.
   531	    const runInTransaction = db.transaction(() => {
   532	      for (const edge of orphaned) {
   533	        if (deleteEdge(edge.id)) deleted++;
   534	      }
   535	    });
   536	    runInTransaction();
   537	    return { deleted };
   538	  } catch (error: unknown) {
   539	    const msg = error instanceof Error ? error.message : String(error);
 succeeded in 52ms:
   340	  try {
   341	    // AI-WHY: Wrap all DB operations in a single transaction for atomicity
   342	    database.transaction(() => {
   343	      // Strengthen: edges accessed in the last cycle period (7 days)
   344	      const recentEdges = (database.prepare(`
   345	        SELECT id, strength, last_accessed, created_by FROM causal_edges
   346	        WHERE last_accessed IS NOT NULL
   347	          AND last_accessed > datetime('now', '-7 days')
   348	          AND strength < 1.0
   349	      `) as Database.Statement).all() as CausalEdge[];
   350	
   351	      for (const edge of recentEdges) {
   352	        const increase = Math.min(MAX_STRENGTH_INCREASE_PER_CYCLE, 1.0 - edge.strength);
   353	        if (increase > 0) {
   354	          const newStrength = Math.min(1.0, edge.strength + increase);
   355	          // Auto edges cannot exceed MAX_AUTO_STRENGTH
   356	          const cappedStrength = edge.created_by === 'auto'
   357	            ? Math.min(newStrength, MAX_AUTO_STRENGTH)
   358	            : newStrength;
   359	
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts | sed -n '430,520p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
   430	 * normal store path).
   431	 *
   432	 * @param newMemory - The new memory to reconsolidate
   433	 * @param db - The database instance
   434	 * @param options - Callbacks for similarity search and storage
   435	 * @returns ReconsolidationResult or null if feature is disabled
   436	 */
   437	export async function reconsolidate(
   438	  newMemory: NewMemoryData,
   439	  db: Database.Database,
   440	  options: ReconsolidateOptions
   441	): Promise<ReconsolidationResult | null> {
   442	  if (!isReconsolidationEnabled()) {
   443	    return null;
   444	  }
   445	
   446	  const { findSimilar, storeMemory, generateEmbedding } = options;
   447	
   448	  // Step 1: Find similar memories
   449	  const similarMemories = findSimilarMemories(
Plan update
  ✓ Inventory and read all target files in storage/database plus checkpoint and causal-edge handlers
  ✓ Trace transaction boundaries, FK cascade behavior, restore/import paths, and concurrency assumptions
  ✓ Re-verify prior findings F4, F5, and F20 with line-cited evidence
  → Produce findings-first audit report in the requested format
codex
---
FINDING: F4
FILE: [checkpoints.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts#L624) lines 624-667
SEVERITY: P1-IMPORTANT
TYPE: FK_CASCADE
STATUS: PARTIALLY_FIXED
PRIOR_REF: F4
DESCRIPTION: The checkpoint restore path no longer uses `INSERT OR REPLACE` in merge mode and now creates `working_memory` with `ON DELETE SET NULL`, which removes the original cascade trigger in fresh tables. But this does not migrate existing `working_memory` tables, and the canonical runtime schema still defines `ON DELETE CASCADE`, so live databases can keep the old FK behavior.
EVIDENCE:
```ts
// checkpoints.ts
INSERT OR ${clearExisting ? 'REPLACE' : 'IGNORE'} INTO memory_index ...
FOREIGN KEY (memory_id) REFERENCES memory_index(id) ON DELETE SET NULL

// lib/cognitive/working-memory.ts
FOREIGN KEY (memory_id) REFERENCES memory_index(id) ON DELETE CASCADE
```
SUGGESTED_FIX: Add an explicit schema migration that rebuilds legacy `working_memory` tables to `ON DELETE SET NULL`, or centralize the schema so restore/runtime cannot diverge.

---
FINDING: F5
FILE: [checkpoints.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts#L880) lines 880-895
SEVERITY: P1-IMPORTANT
TYPE: SELF_LOOP
STATUS: FIXED
PRIOR_REF: F5
DESCRIPTION: The restore path now blocks self-loop causal edges before raw insertion, so checkpoint restore no longer bypasses the `insertEdge()` self-loop guard.
EVIDENCE:
```ts
if (edge.source_id === edge.target_id) {
  console.warn(`[checkpoints] Skipping self-loop causal edge during restore: ${String(edge.source_id)}`);
  continue;
}
```
SUGGESTED_FIX: Keep this guard in place and keep restore/import tests covering malformed self-loop snapshot rows.

---
FINDING: F20
FILE: [causal-edges.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts#L525) lines 525-533
SEVERITY: P2-MINOR
TYPE: TRANSACTION
STATUS: PARTIALLY_FIXED
PRIOR_REF: F20
DESCRIPTION: `cleanupOrphanedEdges()` is now transaction-wrapped, but it still delegates to `deleteEdge()`, which swallows SQL errors and returns `false`. That means the outer transaction can still commit earlier deletions after a later delete fails, so the partial-cleanup risk remains.
EVIDENCE:
```ts
const runInTransaction = db.transaction(() => {
  for (const edge of orphaned) {
    if (deleteEdge(edge.id)) deleted++;
  }
});

// deleteEdge()
} catch (error: unknown) {
  console.warn(`[causal-edges] deleteEdge error: ${msg}`);
  return false;
}
```
SUGGESTED_FIX: Delete rows directly inside `cleanupOrphanedEdges()` with a prepared `DELETE` that throws on failure, or add a throwing variant of `deleteEdge()` for transactional callers.

---
FINDING: N1
FILE: [checkpoints.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts#L857) lines 857-923
SEVERITY: P1-IMPORTANT
TYPE: TRANSACTION
STATUS: NEW
PRIOR_REF: NONE
DESCRIPTION: Scoped merge restore (`clearExisting=false`) deletes existing causal edges for restored memories before replaying snapshot edges, but rollback is only triggered for `clearExisting=true`. If any later edge insert errors, merge-mode commits with graph data removed even though the code comments say “no data was deleted”.
EVIDENCE:
```ts
if (checkpointSpecFolder && restoredMemoryIds.size > 0) {
  deleteCausalEdgesForMemoryIds(database, Array.from(restoredMemoryIds));
}

if (clearExisting && txErrors.length > 0) {
  throw new Error(...);
}
// For non-clearExisting, partial failures are acceptable (no data was deleted)
```
SUGGESTED_FIX: Treat causal-edge deletion as destructive work and rollback on any later edge restore error, or validate all snapshot edges before deleting the current scoped graph.

---
FINDING: N2
FILE: [reconsolidation.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts#L328) lines 328-348
SEVERITY: P1-IMPORTANT
TYPE: TRANSACTION
STATUS: NEW
PRIOR_REF: NONE
DESCRIPTION: `executeConflict()` claims the deprecate-plus-edge step is atomic, but it never checks whether `causalEdges.insertEdge()` actually succeeded. Because `insertEdge()` returns `null` instead of throwing on failure, the transaction can commit a deprecated existing memory with no `supersedes` edge.
EVIDENCE:
```ts
db.transaction(() => {
  db.prepare(`UPDATE memory_index SET importance_tier = 'deprecated' ...`).run(existingMemory.id);
  edgeId = causalEdges.insertEdge(sourceId, targetId, 'supersedes', 1.0, ...);
})();

// causal-edges.ts
if (sourceId === targetId) return null;
...
} catch (error: unknown) {
  console.warn(`[causal-edges] insertEdge error: ${msg}`);
  return null;
}
```
SUGGESTED_FIX: Require `edgeId !== null` and throw inside `executeConflict()` when edge creation fails, or expose a strict `insertEdgeOrThrow()` for transactional callers.

Requested-path note: the repo does not contain `lib/cognitive/causal-edges.ts`; the active file is [`lib/storage/causal-edges.ts`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts). Also, `database/` contains no `.ts` files in this workspace.
tokens used
124,882
---
FINDING: F4
FILE: [checkpoints.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts#L624) lines 624-667
SEVERITY: P1-IMPORTANT
TYPE: FK_CASCADE
STATUS: PARTIALLY_FIXED
PRIOR_REF: F4
DESCRIPTION: The checkpoint restore path no longer uses `INSERT OR REPLACE` in merge mode and now creates `working_memory` with `ON DELETE SET NULL`, which removes the original cascade trigger in fresh tables. But this does not migrate existing `working_memory` tables, and the canonical runtime schema still defines `ON DELETE CASCADE`, so live databases can keep the old FK behavior.
EVIDENCE:
```ts
// checkpoints.ts
INSERT OR ${clearExisting ? 'REPLACE' : 'IGNORE'} INTO memory_index ...
FOREIGN KEY (memory_id) REFERENCES memory_index(id) ON DELETE SET NULL

// lib/cognitive/working-memory.ts
FOREIGN KEY (memory_id) REFERENCES memory_index(id) ON DELETE CASCADE
```
SUGGESTED_FIX: Add an explicit schema migration that rebuilds legacy `working_memory` tables to `ON DELETE SET NULL`, or centralize the schema so restore/runtime cannot diverge.

---
FINDING: F5
FILE: [checkpoints.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts#L880) lines 880-895
SEVERITY: P1-IMPORTANT
TYPE: SELF_LOOP
STATUS: FIXED
PRIOR_REF: F5
DESCRIPTION: The restore path now blocks self-loop causal edges before raw insertion, so checkpoint restore no longer bypasses the `insertEdge()` self-loop guard.
EVIDENCE:
```ts
if (edge.source_id === edge.target_id) {
  console.warn(`[checkpoints] Skipping self-loop causal edge during restore: ${String(edge.source_id)}`);
  continue;
}
```
SUGGESTED_FIX: Keep this guard in place and keep restore/import tests covering malformed self-loop snapshot rows.

---
FINDING: F20
FILE: [causal-edges.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts#L525) lines 525-533
SEVERITY: P2-MINOR
TYPE: TRANSACTION
STATUS: PARTIALLY_FIXED
PRIOR_REF: F20
DESCRIPTION: `cleanupOrphanedEdges()` is now transaction-wrapped, but it still delegates to `deleteEdge()`, which swallows SQL errors and returns `false`. That means the outer transaction can still commit earlier deletions after a later delete fails, so the partial-cleanup risk remains.
EVIDENCE:
```ts
const runInTransaction = db.transaction(() => {
  for (const edge of orphaned) {
    if (deleteEdge(edge.id)) deleted++;
  }
});

// deleteEdge()
} catch (error: unknown) {
  console.warn(`[causal-edges] deleteEdge error: ${msg}`);
  return false;
}
```
SUGGESTED_FIX: Delete rows directly inside `cleanupOrphanedEdges()` with a prepared `DELETE` that throws on failure, or add a throwing variant of `deleteEdge()` for transactional callers.

---
FINDING: N1
FILE: [checkpoints.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts#L857) lines 857-923
SEVERITY: P1-IMPORTANT
TYPE: TRANSACTION
STATUS: NEW
PRIOR_REF: NONE
DESCRIPTION: Scoped merge restore (`clearExisting=false`) deletes existing causal edges for restored memories before replaying snapshot edges, but rollback is only triggered for `clearExisting=true`. If any later edge insert errors, merge-mode commits with graph data removed even though the code comments say “no data was deleted”.
EVIDENCE:
```ts
if (checkpointSpecFolder && restoredMemoryIds.size > 0) {
  deleteCausalEdgesForMemoryIds(database, Array.from(restoredMemoryIds));
}

if (clearExisting && txErrors.length > 0) {
  throw new Error(...);
}
// For non-clearExisting, partial failures are acceptable (no data was deleted)
```
SUGGESTED_FIX: Treat causal-edge deletion as destructive work and rollback on any later edge restore error, or validate all snapshot edges before deleting the current scoped graph.

---
FINDING: N2
FILE: [reconsolidation.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts#L328) lines 328-348
SEVERITY: P1-IMPORTANT
TYPE: TRANSACTION
STATUS: NEW
PRIOR_REF: NONE
DESCRIPTION: `executeConflict()` claims the deprecate-plus-edge step is atomic, but it never checks whether `causalEdges.insertEdge()` actually succeeded. Because `insertEdge()` returns `null` instead of throwing on failure, the transaction can commit a deprecated existing memory with no `supersedes` edge.
EVIDENCE:
```ts
db.transaction(() => {
  db.prepare(`UPDATE memory_index SET importance_tier = 'deprecated' ...`).run(existingMemory.id);
  edgeId = causalEdges.insertEdge(sourceId, targetId, 'supersedes', 1.0, ...);
})();

// causal-edges.ts
if (sourceId === targetId) return null;
...
} catch (error: unknown) {
  console.warn(`[causal-edges] insertEdge error: ${msg}`);
  return null;
}
```
SUGGESTED_FIX: Require `edgeId !== null` and throw inside `executeConflict()` when edge creation fails, or expose a strict `insertEdgeOrThrow()` for transactional callers.

Requested-path note: the repo does not contain `lib/cognitive/causal-edges.ts`; the active file is [`lib/storage/causal-edges.ts`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts). Also, `database/` contains no `.ts` files in this workspace.
