---
title: "Plan: Phase 009 — Reindex [02--system-spec-kit/023-esm-module-compliance/009-reindex-validator-false-positives/plan]"
description: "Fix two validation rules (cross-spec contamination, topical coherence) that false-positive reject legitimate files during bulk reindex."
trigger_phrases:
  - "fix reindex validator"
  - "cross-spec contamination fix"
  - "topical coherence threshold"
  - "bulk reindex context propagation"
  - "validator false positive plan"
importance_tier: "normal"
contextType: "planning"
---
# Plan: Phase 009 — Reindex Validator False Positives

## Approach

Two targeted fixes in the validation pipeline. No architectural changes.

### Fix 1: Cross-Spec Contamination — Propagate Spec Folder Context

**Problem:** `handleMemoryIndexScan` calls `validateMemoryQualityContent(content)` but doesn't pass the file's spec folder. The contamination checker sees `current_spec: unknown` and triggers on any cross-reference.

**Solution:** Extract the spec folder from each file's path before validation. Pass it as context to `validateMemoryQualityContent` so the contamination checker can distinguish "references own spec's phases" (allowed) from "dominated by foreign spec content" (genuine contamination).

**Files to modify:**
- `scripts/src/lib/validate-memory-quality.ts` — Accept optional `specFolder` parameter in the contamination check
- `mcp_server/handlers/memory-save.ts` — Already passes context correctly (no change needed)
- `mcp_server/handlers/memory-index.js` — Pass extracted spec folder to validator during batch scan

**Key logic change:**
```
// Before: validateMemoryQualityContent(content)
// After:  validateMemoryQualityContent(content, { specFolder: extractedFolder })
```

The contamination checker already has an allowlist mechanism for child phase folders — it just needs the `specFolder` parameter to activate it.

### Fix 2: Topical Coherence — Soft Threshold Instead of Hard Zero

**Problem:** V12 blocks indexing when zero spec trigger phrases appear in memory content. This is too strict — a memory about "feature flag graduation" won't match a spec whose triggers are "esm migration" and "module compliance".

**Solution:** Change the threshold from "any > 0" to "at least 1 match OR file is in a known memory/ directory". Memory files in `specs/**/memory/` directories are already structurally validated by the save pipeline — they don't need a second topical gate at index time.

**Files to modify:**
- `scripts/src/lib/validate-memory-quality.ts` — Adjust V12 check: if file path contains `/memory/`, skip topical coherence check (trust the save pipeline)

**Alternative:** Lower blockOnIndex to `false` for V12 entirely. The rule still provides diagnostic value via warnings without preventing indexing.

### Fix 3: Spec Doc Indexing — Verify Warn-Only Path Inserts

**Problem:** Spec docs (spec.md, plan.md, checklist.md) get V8 "warn-only" during reindex but still don't appear in the DB (0 entries with `document_type: 'spec_doc'`).

**Investigation:** The warn-only code path in `memory-save.ts` may skip the actual DB insert for spec docs. Need to trace the code path when `disposition === 'warn_only'` for spec doc types.

**Files to investigate:**
- `mcp_server/handlers/memory-save.ts` — Trace the spec doc warn-only path
- `mcp_server/handlers/memory-index.js` — Check if spec docs are processed through the same save path

## Execution Order

1. Fix V12 (simplest — one condition change)
2. Fix V8 context propagation (medium — thread spec folder through validation)
3. Verify spec doc insertion (investigation — may be a separate code path issue)
4. Run `reindex-embeddings.js` and verify counts
5. Update checklist

## Verification

```bash
# After fixes, run reindex
cd mcp_server && node ../scripts/dist/memory/reindex-embeddings.js

# Verify memory file count
node -e "
const Database = require('better-sqlite3');
const db = new Database('database/context-index__voyage__voyage-4__1024.sqlite', { readonly: true });
console.log('Memory files:', db.prepare(\"SELECT COUNT(*) as c FROM memory_index WHERE file_path LIKE '%/memory/%'\").get().c);
console.log('Spec docs:', db.prepare(\"SELECT COUNT(*) as c FROM memory_index WHERE document_type = 'spec_doc'\").get().c);
console.log('Total:', db.prepare('SELECT COUNT(*) as c FROM memory_index').get().c);
db.close();
"
# Target: memory files >= 90, spec docs > 0, total > 56
```
