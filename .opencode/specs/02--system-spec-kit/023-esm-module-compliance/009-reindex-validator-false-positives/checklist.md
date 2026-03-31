---
title: "Checklist: Phase 009 — Reindex Validator False Positives [02--system-spec-kit/023-esm-module-compliance/009-reindex-validator-false-positives/checklist]"
description: "Verification checklist for fixing false-positive validation rules during bulk reindex."
trigger_phrases:
  - "checklist"
  - "reindex validator"
  - "false positive fix"
  - "009"
importance_tier: "normal"
contextType: "implementation"
---
# Checklist: Phase 009 — Reindex Validator False Positives

## P0 — Must Pass

- [x] Cross-spec contamination rule receives spec folder context during bulk reindex — extracts spec folder from file path as fallback when frontmatter `spec_folder` is empty
- [x] Topical coherence rule does not block memory files in `specs/**/memory/` directories — skips V12 for memory dir files and spec doc files
- [x] `reindex-embeddings.js` completes with zero false-positive index blocks on memory files — V-rule blocks dropped from 1106 to 0
- [ ] Previously blocked memory files (36 gap) are now indexed — PARTIALLY FIXED: 0 failures during scan but near-duplicate supersession prevents new entries. 57 in DB vs 93 on disk. Root cause: force reindex "updates" existing entries in-place; files without prior DB entries may be superseded by near-duplicates
- [x] No regression: interactive `memory_save` still validates correctly — V-rule changes only add optional `filePath` parameter; existing calls without it behave identically

## P1 — Should Pass

- [ ] Spec docs (spec.md, plan.md, checklist.md) appear in DB with `document_type: 'spec_doc'` — spec docs process through pipeline with warn-only mode but all 1108 get `document_type: 'memory'` and supersede each other. The spec doc type assignment may need fixing in the save pipeline
- [x] Cross-spec contamination rule still blocks genuine contamination — only added filePath-based spec folder extraction as fallback; core contamination logic unchanged
- [x] Topical coherence rule still warns on mismatch — skips only for memory-dir files and spec docs; other file types still checked
- [ ] `SELECT COUNT(*) FROM memory_index WHERE file_path LIKE '%/memory/%'` >= 90 — currently 57. Blocked by near-duplicate supersession

## P2 — Nice to Have

- [ ] Validation rules use descriptive names in log output (not just V8/V12 codes)
- [ ] Reindex summary shows accurate scanned/indexed/failed counts — currently shows `undefined` when rate-limited (cooldown bug in reindex script)
- [ ] Batch reindex logs per-file skip reasons for debugging
- [x] Force reindex uses warn-only quality gate for all files — template contract no longer rejects older memory files during bulk reindex (failures dropped from 90 to 0)
