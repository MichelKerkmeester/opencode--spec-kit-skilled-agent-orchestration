---
title: "Implemen [system-spec-kit/023-hybrid-rag-fusion-refinement/009-reindex-validator-false-positives/implementation-summary]"
description: "Fixed false-positive validation rules blocking legitimate memory/spec files from bulk reindex, plus contextType migration from decision/discovery to planning/general across the full stack."
trigger_phrases:
  - "implementation summary"
  - "009 reindex validator"
  - "false positive fix summary"
  - "contexttype migration"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/023-hybrid-rag-fusion-refinement/009-reindex-validator-false-positives"
    last_updated_at: "2026-04-24T14:55:00Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Backfilled memory block"
    next_safe_action: "Revalidate packet docs"
    key_files: ["implementation-summary.md"]
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

# Implementation Summary

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-reindex-validator-false-positives |
| **Completed** | 2026-04-01 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Bulk reindex went from rejecting 1,106 files to accepting all of them. Two validation rules (V8 cross-spec contamination, V12 topical coherence) were producing false positives because the batch pipeline lacked per-file context. The fix threads file path context through validation, skips unnecessary checks on memory and spec doc files, and corrects a cascading frontmatter bug that was silently reverting `contextType` values across every backfill run.

### Core Fixes (Phase 2, 16 items)

1. **V8 cross-spec contamination**: Extract spec folder from file path as fallback when frontmatter `spec_folder` is empty. Single-level spec paths now also resolve correctly.
2. **V12 topical coherence**: Skip check for `*/memory/` directory files and spec doc files that define the spec itself.
3. **Template contract**: Force reindex uses `warn-only` quality gate mode.
4. **File path threading**: Pass `filePath` through `v-rule-bridge.ts` and `memory-save.ts` validation bridge.
5. **Frontmatter source of truth**: Added `"planning"` to VALID_CONTEXT_TYPES, fixed DOC_DEFAULT_CONTEXT mappings, reversed `normalizeContextType` alias from `decision->planning`.
6. **MCP parser**: Fixed CONTEXT_TYPE_MAP (`decision->planning`, `discovery->general`), added `"planning"` to ContextType union.
7. **DB schema**: Added `"planning"` to CHECK constraint on `context_type` column.
8. **Retroactive backfill**: 828 files updated across all specs including z_archive.
9. **DB migration**: 2,006 `decision->planning`, 3 `discovery->general` direct UPDATEs.
10. **DB dedup**: Removed 13,211 duplicate rows from force reindex accumulation.
11. **Runtime consumers**: Updated session-extractor, intent-classifier, save-quality-gate, fsrs-scheduler, and memory-state-baseline.

### Deep Review Remediation (Phase 3, 9 items)

1. **P1-1**: Removed legacy `decision`/`discovery` from parser test T08 canonical valid types set.
2. **P1-2**: Fixed V8 regex to match single-level spec paths like `specs/001-feature/`.
3. **P1-3**: Created `shared/context-types.ts` as single source of truth for `CanonicalContextType`, `LEGACY_CONTEXT_TYPE_ALIASES`, and `resolveCanonicalContextType()`. Updated 5 consumers to import from shared module.
4. **P1-4**: Removed force bypass from `checkExistingRow` dedup to prevent duplicate row accumulation during force reindex.
5. **P1-5**: Added schema migration v25 that UPDATEs legacy values then rebuilds `memory_index` table with strict `CHECK(context_type IN ('research', 'implementation', 'planning', 'general'))`. Bumped `SCHEMA_VERSION` to 25.
6. **P1-6**: Added 5 new test cases for filePath fallback (V8 multi/single-level) and V12 skip (memory dir, spec doc, descriptive names).
7. **P1-8**: Removed legacy `decision`/`discovery` from CREATE TABLE CHECK constraints in both `vector-index-schema.ts` and `schema-downgrade.ts`.
8. **P2-5**: Fixed hardcoded `context_type=decision` log message to use actual `params.contextType`.
9. **P2**: Added `name` field to `ValidationRuleMetadata` and `RuleResult` interfaces with descriptive names for all 14 V-rules.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `shared/context-types.ts` | Created | Single source of truth for context type definitions, aliases, resolver |
| `shared/index.ts` | Modified | Re-exports from context-types.ts |
| `scripts/lib/validate-memory-quality.ts` | Modified | V8 regex fix, descriptive `name` field on rule metadata/results |
| `scripts/lib/frontmatter-migration.ts` | Modified | Imports CANONICAL_CONTEXT_TYPES and LEGACY_CONTEXT_TYPE_ALIASES from shared |
| `scripts/tests/validate-memory-quality.vitest.ts` | Modified | Added 5 new tests for filePath/V12/name coverage |
| `mcp_server/lib/parsing/memory-parser.ts` | Modified | ContextType re-exported from shared, CONTEXT_TYPE_MAP uses shared aliases |
| `mcp_server/lib/cognitive/fsrs-scheduler.ts` | Modified | Stability multipliers and no-decay sets built from shared aliases |
| `mcp_server/lib/validation/save-quality-gate.ts` | Modified | Uses resolveCanonicalContextType() instead of hardcoded check |
| `mcp_server/lib/search/vector-index-schema.ts` | Modified | SCHEMA_VERSION 25, migration v25, strict CHECK constraint |
| `mcp_server/lib/storage/schema-downgrade.ts` | Modified | Strict CHECK constraint (canonical-only) |
| `mcp_server/handlers/save/dedup.ts` | Modified | Removed `!force` bypass to prevent duplicate accumulation |
| `mcp_server/tests/memory-parser-extended.vitest.ts` | Modified | Removed legacy types from T08 valid set |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Phase 2 (core fixes) shipped first with immediate validation: force reindex dropped from 1,106 blocks to 0. Phase 3 (review remediation) addressed all 8 P1 findings from a 10-iteration deep review plus 1 P2 item. The shared `context-types.ts` module was created first, then consumers were updated, then schema migration v25 was added. All changes validated through TypeScript compilation (clean across shared/, scripts/, mcp_server/), 139 passing tests across 4 suites, dist artifacts rebuilt, and sk-code-opencode alignment verifier (PASS, 0 findings). Two P2 items (reindex summary counts, per-file skip reasons) deferred because they require MCP handler-level changes.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Remove `!force` from `checkExistingRow` rather than adding UPSERT | Simplest fix that prevents duplicate accumulation. If content and metadata are identical, re-embedding produces the same result, so skipping is correct. |
| Place shared constant in `shared/context-types.ts` | Both workspaces already import from `@spec-kit/shared/*`. A dedicated file is cleaner than adding to the already large `types.ts`. |
| Migration v25 rebuilds table rather than ALTER | SQLite doesn't support `ALTER CONSTRAINT`. Table rebuild is the only way to retrofit CHECK constraints. Legacy values are UPDATEd first so the copy succeeds. |
| Strict CHECK with 4 canonical types only | All save paths go through parser normalization. Direct SQL writes don't exist. The constraint enforces the canonical set at the DB boundary. |
| Add `name` field as optional on `RuleResult` | Non-breaking change. Existing consumers that don't use `name` are unaffected. New consumers get human-readable rule identification. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| TypeScript compilation | PASS: `tsc --noEmit` clean across shared/, scripts/, mcp_server/ |
| validate-memory-quality tests | PASS: 7/7 (2 original + 5 new) |
| memory-parser-extended tests | PASS: 46/46 (including updated T08) |
| content-hash-dedup tests | PASS: 31/31 (including T079-1 force dedup) |
| fsrs-scheduler tests | PASS: 55/55 (shared alias import verified) |
| Dist build | PASS: shared/dist, scripts/dist, mcp_server all compiled clean |
| sk-code-opencode alignment | PASS: 0 findings on shared/ (35 files scanned) |
| Checklist P0 items | PASS: All 5 verified with evidence |
| Checklist P1 items | PASS: All 4 verified with evidence |
| Checklist P2 items | 12/13 complete, 2 P2 deferred with rationale |
| Deep review findings | 8/8 P1 addressed, 1 P2 addressed |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Reindex summary counts show `undefined` during rate limiting.** The cooldown logic in the MCP handler doesn't propagate counts back to the reindex script. Requires handler-level fix.
2. **Batch reindex does not log per-file skip reasons.** The `runMemoryIndexScan` response format includes only aggregated counts, not individual file decisions.
3. **Migration v25 table rebuild drops and recreates indexes.** If custom indexes exist beyond the standard set, they would be lost. Standard indexes are recreated from `sqlite_master`.
<!-- /ANCHOR:limitations -->
