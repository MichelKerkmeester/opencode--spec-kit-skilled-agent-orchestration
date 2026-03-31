---
title: "Phase 009: Reindex [02--system-spec-kit/023-esm-module-compliance/009-reindex-validator-false-positives/spec]"
description: "Fix false-positive validation rules that block legitimate memory and spec doc files from being indexed during bulk reindex. Two rules cause the majority of rejections."
trigger_phrases:
  - "reindex false positive"
  - "validator blocking index"
  - "memory files not indexed"
  - "cross-spec contamination false positive"
  - "topical coherence mismatch"
  - "bulk reindex missing files"
  - "memory_index_scan rejections"
importance_tier: "important"
contextType: "implementation"
---
# Phase 009: Reindex Validator False Positives

## Problem

Running `reindex-embeddings.js` discovers 184 memory files on disk but only 56 end up in the database. Two validation rules cause false-positive rejections during bulk reindex:

### 1. Cross-Spec Contamination (rule `V8`)

**What it does:** Blocks files whose body text mentions other spec folder IDs (e.g., a memory in spec 022 that references spec 024).

**Why it's a false positive during reindex:** The validator receives `current_spec: unknown` when run in batch mode because `runMemoryIndexScan` doesn't propagate the per-file spec folder context to the contamination checker. Without knowing which spec a file belongs to, ANY cross-reference triggers the rule.

**Impact:** Blocks nearly all spec docs (spec.md, plan.md, checklist.md, tasks.md, implementation-summary.md, decision-record.md) — 1,106 "would-reject" events in a single reindex run. Also blocks memory files that legitimately reference related specs.

**Config:** `severity: 'high'`, `blockOnWrite: true`, `blockOnIndex: true`

**File:** `scripts/dist/lib/validate-memory-quality.js` line 88

### 2. Topical Coherence Mismatch (rule `V12`)

**What it does:** Blocks memory files whose content has zero overlap with the parent spec's `trigger_phrases` from `spec.md`.

**Why it's a false positive:** Legitimate memory files (e.g., deep-review results, implementation summaries, next-steps notes) may use different terminology than the parent spec's trigger phrases. The rule is too strict — zero overlap is a high bar when trigger phrases are narrow.

**Impact:** Blocks 6 confirmed memory files from being indexed. These files are written, saved to disk, but silently excluded from the vector index, making them invisible to `memory_search` and `memory_context`.

**Config:** `severity: 'medium'`, `blockOnWrite: false`, `blockOnIndex: true`

**File:** `scripts/dist/lib/validate-memory-quality.js` line 120

## Evidence

```
# Reindex output analysis (2026-03-31):
On disk:     92 memory .md files (find .opencode/specs -path "*/memory/*.md")
In database: 56 entries (SELECT COUNT(*) FROM memory_index)
Gap:         36 files never indexed

# V8 false positives during reindex:
- 1,106 "would-reject: true" events
- 176 spec.md hard blocks, 78 checklist.md, 55 plan.md, etc.
- Root cause: current_spec: unknown → all cross-references trigger

# V12 index blocks:
- 6 memory files hard-blocked from index
- Example: "01-03-26_08-52__feature-verification-flag-graduation.md: V12"
- These files exist on disk but are invisible to search
```

### 3. Frontmatter Source of Truth — Wrong Defaults

**What it does:** `scripts/lib/frontmatter-migration.ts` assigns `contextType` to all spec documents via defaults and normalization. Both `create.sh` (new docs) and `backfill-frontmatter.js` (bulk normalization) use this module.

**Three bugs in the source:**
1. `VALID_CONTEXT_TYPES` set didn't include `"planning"` — any file with `contextType: "planning"` got rejected as invalid
2. `DOC_DEFAULT_CONTEXT` mapped spec/plan/decision-record to `"decision"` — not a valid downstream value
3. `normalizeContextType()` aliased `"planning"` → `"decision"` — actively reversed any manual fix

**Impact:** Every backfill run re-introduced `contextType: "decision"` across all spec and plan docs, undoing manual fixes. The spec 008 compliance audit fixed files, then the next backfill reverted them.

**File:** `scripts/lib/frontmatter-migration.ts` lines 101, 134, 834

## Scope

**In scope:**
- Fix cross-spec contamination to pass spec folder context during bulk reindex
- Fix topical coherence to skip memory-dir files and spec doc files
- Fix template contract to use warn-only during force reindex
- Fix frontmatter-migration.ts source of truth: VALID_CONTEXT_TYPES, DOC_DEFAULT_CONTEXT, normalizeContextType alias
- Retroactive backfill across all spec docs
- Ensure all memory files on disk get indexed after fix
- Ensure spec docs get indexed with correct document_type

**Out of scope:**
- Changing validation behavior during interactive `memory_save` (single-file saves work correctly)
- Adding new validation rules
- Restructuring the validation pipeline

## Resolution

All issues resolved. Changes made:

1. **Cross-spec contamination** — `validate-memory-quality.ts`: extract spec folder from file path as fallback when frontmatter `spec_folder` is empty
2. **Topical coherence** — `validate-memory-quality.ts`: skip check for `*/memory/` directory files and spec doc files
3. **Template contract** — `memory-index.ts`: force reindex uses `warn-only` mode for all files
4. **File path threading** — `v-rule-bridge.ts` + `memory-save.ts`: pass `filePath` through validation bridge
5. **Frontmatter defaults** — `frontmatter-migration.ts`: add `"planning"` to valid types, fix DOC_DEFAULT_CONTEXT (spec→implementation, plan→planning, decision_record→planning), reverse alias (decision→planning), override existing "decision" values
6. **Retroactive backfill** — 354 files updated across all specs

## Success Criteria — All Met

- Force reindex: 0 V-rule blocks, 0 failures (was 1106 blocks + 90 failures)
- Main database: 12,140 entries, 95 memory-dir files (all 93 on disk accounted for)
- Spec docs indexed with correct document_type: plan (2319), spec (2319), checklist (1943), etc.
- contextType distribution: implementation (186), planning (27), research (11), general (44)
- Only 2 files with legacy "decision" remain (malformed frontmatter, cannot be auto-processed)
