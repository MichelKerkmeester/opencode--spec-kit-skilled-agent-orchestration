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

## Scope

**In scope:**
- Fix V8 to pass spec folder context during bulk reindex
- Fix V12 to use a minimum overlap threshold (e.g., 1 of N phrases) instead of requiring >0
- Ensure all 92 memory files on disk get indexed after fix
- Ensure spec docs get indexed with `document_type: 'spec_doc'`

**Out of scope:**
- Changing V8/V12 behavior during interactive `memory_save` (single-file saves work correctly)
- Adding new validation rules
- Restructuring the validation pipeline

## Success Criteria

- `reindex-embeddings.js` indexes all memory files that pass basic frontmatter checks
- `SELECT COUNT(*) FROM memory_index WHERE file_path LIKE '%/memory/%'` returns >= 90 (currently 56)
- Spec docs indexed: `SELECT COUNT(*) FROM memory_index WHERE document_type = 'spec_doc'` > 0
- Zero false-positive V8 blocks when `current_spec` is properly set
- V12 uses soft threshold (e.g., >=1 phrase match) instead of hard >0
