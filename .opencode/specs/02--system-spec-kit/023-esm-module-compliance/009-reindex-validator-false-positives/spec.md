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

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

## Problem

Running `reindex-embeddings.js` discovers 184 memory files on disk but only 56 end up in the database. Two validation rules cause false-positive rejections during bulk reindex:

### 1. Cross-Spec Contamination (rule `V8`)

**What it does:** Blocks files whose body text mentions other spec folder IDs (e.g., a memory in spec 022 that references spec 024).

**Why it's a false positive during reindex:** The validator receives `current_spec: unknown` when run in batch mode because `runMemoryIndexScan` doesn't propagate the per-file spec folder context to the contamination checker. Without knowing which spec a file belongs to, ANY cross-reference triggers the rule.

**Impact:** Blocks nearly all spec docs (spec.md, plan.md, checklist.md, tasks.md, implementation-summary.md, decision-record.md) — 1,106 "would-reject" events in a single reindex run. Also blocks memory files that legitimately reference related specs.

**Config:** `severity: 'high'`, `blockOnWrite: true`, `blockOnIndex: true`

**File:** `scripts/lib/validate-memory-quality.ts` lines 101-107

### 2. Topical Coherence Mismatch (rule `V12`)

**What it does:** Blocks memory files whose content has zero overlap with the parent spec's `trigger_phrases` from `spec.md`.

**Why it's a false positive:** Legitimate memory files (e.g., deep-review results, implementation summaries, next-steps notes) may use different terminology than the parent spec's trigger phrases. The rule is too strict — zero overlap is a high bar when trigger phrases are narrow.

**Impact:** Blocks 6 confirmed memory files from being indexed. These files are written, saved to disk, but silently excluded from the vector index, making them invisible to `memory_search` and `memory_context`.

**Config:** `severity: 'medium'`, `blockOnWrite: false`, `blockOnIndex: true`

**File:** `scripts/lib/validate-memory-quality.ts` lines 133-139

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

**File:** `scripts/lib/frontmatter-migration.ts` lines 101-107, 135-146, 834-840

## Scope

**In scope:**
- Fix cross-spec contamination to pass spec folder context during bulk reindex
- Fix topical coherence to skip memory-dir files and spec doc files
- Fix template contract to use warn-only during force reindex
- Fix frontmatter-migration.ts source of truth: VALID_CONTEXT_TYPES, DOC_DEFAULT_CONTEXT, normalizeContextType alias
- Retroactive backfill across all spec docs
- Ensure all memory files on disk get indexed after fix
- Ensure spec docs get indexed with correct document_type
- Deep review P1 remediation: regex fix, dedup fix, test coverage, log fixes, descriptive V-rule names
- Extract shared `CONTEXT_TYPE_CANONICAL_MAP` constant across 6 consumers (P1-3)
- Schema migration v25 to retrofit strict CHECK constraint on existing databases (P1-5)

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
6. **MCP parser** — `memory-parser.ts`: fix CONTEXT_TYPE_MAP (decision→planning, discovery→general), add "planning" to ContextType union
7. **DB schema** — `vector-index-schema.ts` + `schema-downgrade.ts`: add "planning" to CHECK constraint on context_type column
8. **Retroactive backfill** — 828 files updated across all specs including z_archive (0 "decision" remaining on disk)
9. **DB migration** — direct UPDATE: 2006 decision→planning, 3 discovery→general
10. **DB dedup** — removed 13,211 duplicate rows from force reindex accumulation (1,200 unique entries remain)
11. **context_template.md** — updated detection logic comment and pseudo-code from decision/discovery to planning/research
12. **session-extractor.ts** — `detectContextType()` returns `'planning'` instead of `'decision'`, web-heavy sessions return `'research'` instead of `'discovery'`, `detectImportanceTier()` checks `'planning'`
13. **intent-classifier.ts** — `find_spec` and `find_decision` intent weights use `contextType: 'planning'`
14. **save-quality-gate.ts** — `isShortCriticalException()` accepts both `'planning'` and legacy `'decision'`
15. **fsrs-scheduler.ts** — `CONTEXT_TYPE_STABILITY_MULTIPLIER` and `HYBRID_NO_DECAY_CONTEXT_TYPES` include `'planning'` with `'decision'` as legacy alias
16. **memory-state-baseline.ts** — validation query includes `'planning'` in valid context_type set

### Phase 3: Deep Review Remediation

17. **Parser test T08** — `memory-parser-extended.vitest.ts`: removed legacy `decision`/`discovery` from canonical valid types set
18. **V8 regex fix** — `validate-memory-quality.ts`: fixed regex to match single-level spec paths like `specs/001-feature/`
19. **Force reindex dedup** — `dedup.ts`: removed `!force` bypass from `checkExistingRow` to prevent duplicate row accumulation
20. **filePath test coverage** — `validate-memory-quality.vitest.ts`: added 5 new tests for V8 multi/single-level paths, V12 memory/spec-doc skip, descriptive name field
21. **Log message fix** — `save-quality-gate.ts`: replaced hardcoded `context_type=decision` with `context_type=${params.contextType}`, updated to use `resolveCanonicalContextType()`
22. **V-rule descriptive names** — `validate-memory-quality.ts`: added `name` field to `ValidationRuleMetadata` and `RuleResult` interfaces for all 14 V-rules
23. **Shared context types** — `shared/context-types.ts`: single source of truth for `CanonicalContextType`, `LEGACY_CONTEXT_TYPE_ALIASES`, `resolveCanonicalContextType()`. 5 consumers updated to import from shared
24. **Schema migration v25** — `vector-index-schema.ts`: UPDATEs legacy values then rebuilds `memory_index` table with strict `CHECK(context_type IN ('research', 'implementation', 'planning', 'general'))`. `SCHEMA_VERSION` bumped to 25
25. **CHECK constraint cleanup** — `vector-index-schema.ts` + `schema-downgrade.ts`: CREATE TABLE now uses canonical-only CHECK constraint

## Success Criteria — All Met

- Force reindex: 0 V-rule blocks, 0 failures (was 1106 blocks + 90 failures)
- Main database: 1,200 unique entries after dedup (95 memories, 1,104 spec docs, 1 constitutional)
- Spec docs indexed with correct document_type: spec (221), plan (221), tasks (207), implementation_summary (201), checklist (186), decision_record (41), research (19), handover (8)
- 0 files with "decision" contextType in frontmatter across all 186 folders from spec 008
- 0 duplicates, 0 test files, 0 orphaned entries
- All runtime consumers (session extractor, intent classifier, quality gate, FSRS scheduler, eval baseline) updated to use "planning"
- Templates, assets, references, README.md, SKILL.md verified clean
- Deep review P1 findings: 8/8 addressed (6 fixed, 2 resolved via shared constant + migration)
- Shared `context-types.ts` module created as single source of truth for contextType definitions
- Schema migration v25 rebuilds CHECK constraint to canonical-only types
- 139 tests pass across 4 suites (validate-memory-quality 7, memory-parser-extended 46, content-hash-dedup 31, fsrs-scheduler 55)
- sk-code--opencode alignment verifier: PASS (0 findings)
