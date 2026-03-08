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

BUG: F07-B