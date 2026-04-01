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

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->

## P0 — Must Pass

- [x] Cross-spec contamination rule receives spec folder context during bulk reindex — extracts spec folder from file path as fallback when frontmatter `spec_folder` is empty
- [x] Topical coherence rule does not block memory files in `specs/**/memory/` directories — skips V12 for memory dir files and spec doc files
- [x] `reindex-embeddings.js` completes with zero false-positive index blocks on memory files — V-rule blocks dropped from 1106 to 0
- [x] Previously blocked memory files are now indexed — all 93 on-disk memory files present in main DB (context-index.sqlite). After dedup: 1,200 unique entries (95 memories, 1,104 spec docs, 1 constitutional)
- [x] No regression: interactive `memory_save` still validates correctly — V-rule changes only add optional `filePath` parameter; existing calls without it behave identically

## P1 — Should Pass

- [x] Spec docs (spec.md, plan.md, checklist.md) appear in DB with proper document_type — confirmed: spec (221), plan (221), tasks (207), implementation_summary (201), checklist (186), decision_record (41), research (19), handover (8)
- [x] Cross-spec contamination rule still blocks genuine contamination — only added filePath-based spec folder extraction as fallback; core contamination logic unchanged
- [x] Topical coherence rule still warns on mismatch — skips only for memory-dir files and spec docs; other file types still checked
- [x] Memory file count >= 90 in main DB — 95 memory entries after dedup. All 93 on-disk files accounted for

## P2 — Nice to Have

- [x] Validation rules use descriptive names in log output (not just V8/V12 codes) — added `name` field to `ValidationRuleMetadata` and `RuleResult` interfaces; all 14 V-rules now have descriptive names (e.g., V8=cross-spec-contamination, V12=topical-coherence-mismatch)
- [ ] Reindex summary shows accurate scanned/indexed/failed counts — deferred: cooldown bug is in the MCP handler response, not the reindex script. Requires handler-level investigation
- [ ] Batch reindex logs per-file skip reasons for debugging — deferred: requires changes to MCP handler `runMemoryIndexScan` response format
- [x] Force reindex uses warn-only quality gate for all files — template contract no longer rejects older memory files during bulk reindex (failures dropped from 90 to 0)
- [x] Frontmatter source of truth hardened — VALID_CONTEXT_TYPES includes "planning", DOC_DEFAULT_CONTEXT uses correct values (spec→implementation, plan→planning), normalizeContextType alias reversed (decision→planning), inferContextType overrides legacy "decision"
- [x] Retroactive backfill applied to all 2383 files (including z_archive) — 828 files updated, 0 files with contextType "decision" remaining
- [x] MCP parser CONTEXT_TYPE_MAP fixed — decision→planning, discovery→general, added "planning" to ContextType union
- [x] DB CHECK constraint updated — added "planning" to allowed context_type values in schema + downgrade
- [x] DB migration — UPDATE 2006 decision→planning, 3 discovery→general in context-index.sqlite
- [x] DB dedup — removed 13,211 duplicate rows, 1,200 unique entries remain (0 duplicates, 0 test files, 0 orphans)
- [x] All runtime consumers updated — session-extractor (detectContextType→planning), intent-classifier (find_spec/find_decision→planning), save-quality-gate (accepts planning+legacy decision), fsrs-scheduler (no-decay set includes planning), memory-state-baseline (valid set includes planning)
- [x] All 186 spec folders from spec 008 verified — 0 files with contextType "decision" in frontmatter
- [x] system-spec-kit docs verified — templates, assets, references, README.md, SKILL.md all clean

## Deep Review Remediation

- [x] P1-1: Parser test T08 canonical valid types set updated — removed legacy decision/discovery (memory-parser-extended.vitest.ts:231)
- [x] P1-2: V8 regex matches single-level spec paths — made parent directory optional in regex (validate-memory-quality.ts:634)
- [x] P1-3: Shared `CONTEXT_TYPE_CANONICAL_MAP` constant — created `shared/context-types.ts` as single source of truth, 5 consumers updated to import from shared
- [x] P1-4: Force reindex dedup — removed `!force` bypass from `checkExistingRow` to prevent duplicate row accumulation (dedup.ts:226)
- [x] P1-5: Schema migration v25 — UPDATEs legacy values then rebuilds `memory_index` with strict CHECK(context_type) canonical-only constraint. SCHEMA_VERSION bumped to 25
- [x] P1-6: Test coverage for filePath fallback — 5 new tests: V8 multi/single-level paths, V12 memory/spec-doc skip, descriptive names
- [x] P1-7: Documentation claims narrowed — spec.md and checklist.md updated with Phase 3 changes
- [x] P1-8: CHECK constraint cleanup — CREATE TABLE + schema-downgrade.ts now use canonical-only CHECK; migration v25 rebuilds existing databases
- [x] P2-5: Hardcoded log message fixed — `context_type=${params.contextType}` replaces `context_type=decision`
- [x] TypeScript compilation — clean across shared/, mcp_server/, scripts/ workspaces
- [x] All dist artifacts rebuilt — shared/dist, scripts/dist, mcp_server compiled
- [x] sk-code--opencode alignment — verifier PASS (0 findings) on shared/
- [x] 139 tests pass — validate-memory-quality (7), memory-parser-extended (46), content-hash-dedup (31), fsrs-scheduler (55)
