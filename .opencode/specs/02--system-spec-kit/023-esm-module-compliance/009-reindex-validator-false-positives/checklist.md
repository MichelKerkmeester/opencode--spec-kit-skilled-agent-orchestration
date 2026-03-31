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

- [ ] Cross-spec contamination rule receives spec folder context during bulk reindex (no more `current_spec: unknown`)
- [ ] Topical coherence rule does not block memory files in `specs/**/memory/` directories
- [ ] `reindex-embeddings.js` completes with zero false-positive index blocks on memory files
- [ ] Previously blocked memory files (36 gap) are now indexed
- [ ] No regression: interactive `memory_save` still validates correctly

## P1 — Should Pass

- [ ] Spec docs (spec.md, plan.md, checklist.md) appear in DB with `document_type: 'spec_doc'`
- [ ] V8 contamination rule still blocks genuine cross-spec contamination (only false positives fixed)
- [ ] V12 topical coherence still warns on mismatch (diagnostic value preserved)
- [ ] `SELECT COUNT(*) FROM memory_index WHERE file_path LIKE '%/memory/%'` >= 90

## P2 — Nice to Have

- [ ] Validation rules use descriptive names in log output (not just V8/V12 codes)
- [ ] Reindex summary shows accurate scanned/indexed/failed counts (currently shows `undefined`)
- [ ] Batch reindex logs per-file skip reasons for debugging
