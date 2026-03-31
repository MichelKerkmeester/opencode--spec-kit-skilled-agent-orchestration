---
title: "Checklist: Phase 009 — [02--system-spec-kit/023-esm-module-compliance/009-reindex-validator-false-positives/checklist]"
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
- [x] Previously blocked memory files are now indexed — all 93 on-disk memory files present in main DB (context-index.sqlite). Initial investigation looked at wrong DB file (context-index__voyage__*.sqlite secondary cache had only 57 entries). Main DB has 12,140 total entries including 218 memory files, 95 of which are from specs/**/memory/ directories
- [x] No regression: interactive `memory_save` still validates correctly — V-rule changes only add optional `filePath` parameter; existing calls without it behave identically

## P1 — Should Pass

- [x] Spec docs (spec.md, plan.md, checklist.md) appear in DB with proper document_type — confirmed in main DB: plan (2319), spec (2319), tasks (2183), checklist (1943), decision_record (515), research (430), handover (96). Initial investigation looked at wrong DB file
- [x] Cross-spec contamination rule still blocks genuine contamination — only added filePath-based spec folder extraction as fallback; core contamination logic unchanged
- [x] Topical coherence rule still warns on mismatch — skips only for memory-dir files and spec docs; other file types still checked
- [x] Memory file count >= 90 in main DB — 95 memory-dir entries (218 total with document_type='memory') in context-index.sqlite. All 93 on-disk files accounted for

## P2 — Nice to Have

- [ ] Validation rules use descriptive names in log output (not just V8/V12 codes)
- [ ] Reindex summary shows accurate scanned/indexed/failed counts — currently shows `undefined` when rate-limited (cooldown bug in reindex script)
- [ ] Batch reindex logs per-file skip reasons for debugging
- [x] Force reindex uses warn-only quality gate for all files — template contract no longer rejects older memory files during bulk reindex (failures dropped from 90 to 0)
- [x] Frontmatter source of truth hardened — VALID_CONTEXT_TYPES includes "planning", DOC_DEFAULT_CONTEXT uses correct values (spec→implementation, plan→planning), normalizeContextType alias reversed (decision→planning), inferContextType overrides legacy "decision"
- [x] Retroactive backfill applied to all 1299 spec/memory/template files — 354 files updated, contextType: implementation (186), planning (27), research (11), general (44), only 2 malformed outliers remain
