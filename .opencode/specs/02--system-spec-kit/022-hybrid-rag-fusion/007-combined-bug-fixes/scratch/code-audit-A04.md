● SQL: Create audit todos
  └ 5 row(s) inserted. Last inserted row ID: 5.

● Read .opencode/skill/system-spec-kit/feature_catalog/02--mutation/06-transaction-wrappers-on-mutati
  on-handlers.md
  └ 94 lines read

● Read
  .opencode/skill/system-spec-kit/feature_catalog/02--mutation/07-namespace-management-crud-tools.md
  └ 1 line read

● Read .opencode/skill/system-spec-kit/feature_catalog/02--mutation/08-prediction-error-save-arbitrat
  ion.md
  └ 32 lines read

● Read
  .opencode/skill/system-spec-kit/feature_catalog/02--mutation/09-correction-tracking-with-undo.md
  └ 27 lines read

● Read .opencode/skill/system-spec-kit/feature_catalog/02--mutation/10-per-memory-history-log.md
  └ 32 lines read

● Todo started:

● Extract implementation source file paths from feature files
  $ python - <<'PY'
  from pathlib import Path
  import re, json
  root=Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit/feature_catalog/02--mutation')...
  └ 20 lines...

● Extract implementation source file paths from feature files
  $ python3 - <<'PY'
  from pathlib import Path
  import re
  root=Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit/feature_catalog/02--mutation')...
  └ 271 lines...

● Read .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts
  └ 252 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts
  └ 253 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts
  └ 352 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts
  └ 163 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts
  └ 538 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts
  └ 132 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts
  └ 1 line read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts
  └ 1 line read

● Read .opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts
  └ 1 line read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts
  └ 1 line read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts
  └ 551 lines read

✗ Read scripts/memory/cleanup-orphaned-vectors.ts
  Path does not exist

● Grep "memory_history" (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts)
  └ 6 lines found

● Glob "**/cleanup-orphaned-vectors.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public
  └ 1 file found

● Grep "record|undo|revert|stability|superseded|deprecated|merged|refined"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts)
  └ 5 lines found

● Grep "memory_history|INSERT INTO
memory_history|event_type|created|updated|merged|archived|restored"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts)
  └ 12 lines found

● Grep "history|memory_history|INSERT|DELETE|causal"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts)
  └ 57 lines found

● Grep "^(export\s+)?function\s+" (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts)
  └ 17 lines found

● Grep "^(export\s+)?function\s+" (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts)
  └ 2 lines found

● Grep "^(export\s+)?function\s+" (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts)
  └ 21 lines found

● Grep "memory_history|CREATE TABLE IF NOT EXISTS memory_history|event_type|metadata"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts)
  └ 10 lines found

● Read .opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts lines 300-620
  └ 321 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts lines 1068-1135
  └ 68 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts lines 1-240
  └ 240 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts lines 240-620
  └ 381 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts lines 430-550
  └ 121 lines read

● Read .opencode/skill/system-spec-kit/scripts/memory/cleanup-orphaned-vectors.ts
  └ 210 lines read

● Compute README coverage for source files in each feature
  $ python3 - <<'PY'
  from pathlib import Path
  import re, json
  root=Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit')...
  └ 285 lines...

● Grep "INSERT INTO
memory_history|event\s*=|event\)|'ADD'|'UPDATE'|'DELETE'|created|updated|merged|archived|restored"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts)
  └ 8 lines found

●Todo completed: audit-feature-06, audit-feature-07, audit-feature-08, audit-feature-09,
                 audit-feature-10

---
FEATURE: 06-transaction-wrappers-on-mutation-handlers.md  
SOURCE_FILES_AUDITED: 40  
BUGS_FOUND: 2

BUG: F06-B01  
FILE: mcp_server/handlers/memory-crud-update.ts:187-200  
SEVERITY: P1-IMPORTANT  
TYPE: ERROR_HANDLING  
DESCRIPTION: Update-abort path returns a success envelope when DB is unavailable, which can make callers treat a failed mutation as successful.  
EVIDENCE:  
```ts
console.warn('[memory-crud-update] No database handle, aborting update...');
return createMCPSuccessResponse({
  tool: 'memory_update',
  summary: `Memory ${id} update aborted: database unavailable`,
  data: { updated: null, ... }
});
```  
SUGGESTED_FIX: Return an explicit error response/throw `MemoryError(ErrorCodes.DATABASE_ERROR, ...)` so clients can reliably detect failure.

BUG: F06-B02  
FILE: mcp_server/handlers/memory-crud-delete.ts:93-106  
SEVERITY: P1-IMPORTANT  
TYPE: ERROR_HANDLING  
DESCRIPTION: Delete-abort path also returns success when DB is unavailable, masking a failed delete operation.  
EVIDENCE:  
```ts
console.warn('[memory-crud-delete] No database handle, aborting delete...');
return createMCPSuccessResponse({
  tool: 'memory_delete',
  summary: 'Delete aborted: database unavailable',
  data: { deleted: 0, error: 'Database unavailable ...' }
});
```  
SUGGESTED_FIX: Return a failure response/throw database error instead of success envelope.

README_COVERAGE:
- mcp_server/hooks/memory-surface.ts: MISSING in mcp_server/hooks/README.md
- All other 39 source files: LISTED in their directory README.md
---

---
FEATURE: 07-namespace-management-crud-tools.md  
SOURCE_FILES_AUDITED: 189  
BUGS_FOUND: 2

BUG: F07-B01  
FILE: mcp_server/handlers/memory-crud-update.ts:187-200  
SEVERITY: P1-IMPORTANT  
TYPE: ERROR_HANDLING  
DESCRIPTION: Database-unavailable branch reports success for an aborted update.  
EVIDENCE: same code path as F06-B01.  
SUGGESTED_FIX: Surface as error (`MemoryError`/error envelope), not success.

BUG: F07-B02  
FILE: mcp_server/handlers/memory-crud-delete.ts:93-106  
SEVERITY: P1-IMPORTANT  
TYPE: ERROR_HANDLING  
DESCRIPTION: Database-unavailable branch reports success for an aborted delete.  
EVIDENCE: same code path as F06-B02.  
SUGGESTED_FIX: Surface as error (`MemoryError`/error envelope), not success.

README_COVERAGE:
- mcp_server/hooks/memory-surface.ts: MISSING in mcp_server/hooks/README.md
- mcp_server/hooks/mutation-feedback.ts: MISSING in mcp_server/hooks/README.md
- All other 187 source files: LISTED in their directory README.md
---

---
FEATURE: 08-prediction-error-save-arbitration.md  
SOURCE_FILES_AUDITED: 4  
BUGS_FOUND: 2

BUG: F08-B01  
FILE: mcp_server/handlers/save/pe-orchestration.ts:53 + mcp_server/lib/cognitive/prediction-error-gate.ts:268-281  
SEVERITY: P1-IMPORTANT  
TYPE: LOGIC  
DESCRIPTION: Conflict decisions can be logged twice to `memory_conflicts` (once in `evaluateMemory` and again in orchestration), causing duplicate telemetry rows.  
EVIDENCE:  
```ts
// pe-orchestration.ts
logPeDecision(peDecision, parsed.contentHash, parsed.specFolder);

// prediction-error-gate.ts
if (similarity >= THRESHOLD.LOW_MATCH && db) {
  const record = formatConflictRecord(...);
  logConflict(record);
}
```  
SUGGESTED_FIX: Choose one logging point (gate OR orchestration) or add idempotency key/unique constraint.

BUG: F08-B02  
FILE: mcp_server/handlers/save/pe-orchestration.ts:70,100,112,145,152  
SEVERITY: P2-MINOR  
TYPE: LOGIC  
DESCRIPTION: Similarity is normalized 0..1 but logged as percentage without multiplying by 100, producing misleading values (e.g., `1.0%` for 0.96).  
EVIDENCE:  
```ts
console.error(`[PE-Gate] REINFORCE ... (${peDecision.similarity.toFixed(1)}%)`);
```  
SUGGESTED_FIX: Use `(peDecision.similarity * 100).toFixed(1)` in all percentage logs.

README_COVERAGE:
- mcp_server/handlers/pe-gating.ts: LISTED in mcp_server/handlers/README.md
- mcp_server/handlers/save/pe-orchestration.ts: LISTED in mcp_server/handlers/save/README.md
- mcp_server/lib/cognitive/prediction-error-gate.ts: LISTED in mcp_server/lib/cognitive/README.md
- mcp_server/handlers/save/create-record.ts: LISTED in mcp_server/handlers/save/README.md
---

---
FEATURE: 09-correction-tracking-with-undo.md  
SOURCE_FILES_AUDITED: 1  
BUGS_FOUND: 1

BUG: F09-B01  
FILE: mcp_server/lib/learning/corrections.ts:590-598  
SEVERITY: P1-IMPORTANT  
TYPE: LOGIC  
DESCRIPTION: Undo deletes all causal edges between two memories regardless of relation/source context; unrelated edges can be removed accidentally.  
EVIDENCE:  
```ts
DELETE FROM causal_edges
WHERE source_id = ? AND target_id = ?
```  
SUGGESTED_FIX: Store `causal_edges.id` (or exact relation/evidence fingerprint) when recording correction and delete only that specific edge on undo.

README_COVERAGE:
- mcp_server/lib/learning/corrections.ts: LISTED in mcp_server/lib/learning/README.md
---

---
FEATURE: 10-per-memory-history-log.md  
SOURCE_FILES_AUDITED: 5  
BUGS_FOUND: 2

BUG: F10-B01  
FILE: mcp_server/lib/search/vector-index-mutations.ts:355 and 445  
SEVERITY: P1-IMPORTANT  
TYPE: LOGIC  
DESCRIPTION: Deleting a memory deletes all of its `memory_history` rows, which breaks “per-memory lifecycle audit trail” expectations.  
EVIDENCE:  
```ts
database.prepare('DELETE FROM memory_history WHERE memory_id = ?').run(id);
```  
SUGGESTED_FIX: Keep history immutable; mark tombstones in history instead of purging rows on delete.

BUG: F10-B02  
FILE: mcp_server/lib/search/vector-index-schema.ts:1078  
SEVERITY: P2-MINOR  
TYPE: EDGE_CASE  
DESCRIPTION: `memory_history.event` CHECK only allows `ADD/UPDATE/DELETE`, but feature semantics mention `created/updated/merged/archived/restored`; schema blocks richer event types.  
EVIDENCE:  
```ts
event TEXT NOT NULL CHECK(event IN ('ADD', 'UPDATE', 'DELETE'))
```  
SUGGESTED_FIX: Expand enum (or normalize event taxonomy) to include required lifecycle events.

README_COVERAGE:
- mcp_server/lib/search/vector-index-schema.ts: LISTED in mcp_server/lib/search/README.md
- mcp_server/handlers/session-learning.ts: LISTED in mcp_server/handlers/README.md
- mcp_server/lib/storage/causal-edges.ts: LISTED in mcp_server/lib/storage/README.md
- mcp_server/lib/search/vector-index-mutations.ts: LISTED in mcp_server/lib/search/README.md
- scripts/memory/cleanup-orphaned-vectors.ts: LISTED in scripts/memory/README.md
---


Total usage est:        1 Premium request
API time spent:         2m 43s
Total session time:     2m 56s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.3-codex           568.2k in, 9.5k out, 448.8k cached (Est. 1 Premium request)
