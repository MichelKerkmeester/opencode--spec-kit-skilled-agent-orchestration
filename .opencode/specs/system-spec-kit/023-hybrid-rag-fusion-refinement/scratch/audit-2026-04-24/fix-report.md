# 023 Spec-Doc Audit + Fix Report

**Date:** 2026-04-24
**Scope:** `.opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/` (root + 14 phases + 9 sub-phases under 011)
**Executor:** claude-opus-4-7 orchestrator + cli-copilot (gpt-5.4, autopilot) delegation
**Commit:** `51951b69d` pushed to `origin/main`

---

## Validator progression

| Stage | Errors | Warnings | Real errors (ex-validator-bug) |
|-------|--------|----------|-------------------------------|
| Baseline (`validator-full.txt`) | 19 | 18 | 19 (6 TEMPLATE_SOURCE + 13 EVIDENCE_MARKER_LINT — see "validator bug" below) |
| After copilot autopilot (`validator-after-copilot.txt`) | 18 | 0 | 6 |
| After trigger_phrases flow-style compact | 15 | 0 | 2 |
| After re-compact (parallel track re-wrote 2 files) (`validator-final.txt`) | **13** | **0** | **0** |

Exit code stays at 2 only because of the validator bug described below; no real spec-content error remains.

---

## Root-cause categories cleared

1. **Duplicate / orphaned anchors** (P0)
   - Root 023 `plan.md:143` — duplicate anchor id `dependencies` renamed
   - Root 023 `spec.md:197` / `spec.md:203` — orphan closing anchors `edge-cases`, `questions` reconciled
   - Phase 006 `spec.md` — 1 mismatch + 3 parse errors fixed
   - Phase 012 `spec.md` — missing required `metadata` anchor added

2. **Broken relative-path references in root spec.md** (P0 — SPEC_DOC_INTEGRITY)
   - 5 self-referential absolute-style paths rewritten to relative (`./spec.md`, `./plan.md`, …)

3. **Phase link chain 013 ↔ 014** (P1 — PHASE_LINKS warning)
   - `014-feedback-signal-pipeline/spec.md` parent back-reference + predecessor link to 013 added
   - `013-fts5-fix-and-search-dashboard/spec.md` successor link to 014 added

4. **Missing research citations** (P0/P1 — SPEC_DOC_SUFFICIENCY_004)
   - Root 023 `research/research.md`, phase 008 `research/research.md`, phase 012 `research/research.md` — citations added

5. **Missing `_memory` frontmatter blocks** (P1 — FRONTMATTER_MEMORY_BLOCK warnings, strict-upgraded to errors)
   - ~60 spec files across root + 14 phases — mechanical backfill via `backfill-frontmatter.js` → `_memory.continuity` YAML block populated

6. **TEMPLATE_SOURCE header visibility** (P0 — TEMPLATE_SOURCE, regression from step 5)
   - Backfilled `_memory` blocks pushed `<!-- SPECKIT_TEMPLATE_SOURCE -->` past the validator's 20-line window in 6 files (007/spec.md, 007/implementation-summary.md, 008/spec.md, 010/spec.md, 013/plan.md, 014/spec.md)
   - Fix: compacted `trigger_phrases:` YAML list from block-style to flow-style inline (6–8 lines → 1 line per file), restoring HTML comment within first 20 lines
   - Two files (013/plan.md, 014/spec.md) were re-expanded by a concurrent parallel track; re-compacted

---

## Known remaining (out-of-scope) validator defect

All 13 residual errors are `EVIDENCE_MARKER_LINT` failures with the same signature:

```
ENOENT: no such file or directory, scandir '.../<phase>/[0-9][0-9][0-9]-*'
```

The validator's evidence-marker-lint step tries to scan phase-child folders using a glob pattern that is NOT pre-expanded. When a phase has no numbered sub-phase children (e.g. phases 001–010, 012–014), the literal glob path does not resolve and `fs.scandir` throws ENOENT. Only phase 011 passes because it actually has 9 sub-phase folders.

**Classification:** validator script bug, not spec-content defect. Filing a separate ticket is recommended; no spec edits should be made to work around it.

**Affected phases:** 001, 002, 003, 004, 005, 006, 007, 008, 009, 010, 012, 013, 014 (13 of 14 phases).

---

## Commands run

```bash
# Initial strict recursive validation
bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement \
  --recursive --strict > scratch/audit-2026-04-24/validator-full.txt 2>&1

# Mechanical frontmatter _memory backfill (via copilot autopilot dispatch)
# plus hand-fixes for anchors, path refs, research citations, phase links
copilot -p "<audit+fix prompt>" --model gpt-5.4 --allow-all-tools \
  > scratch/audit-2026-04-24/copilot-run.log 2>&1

# Re-validate after copilot partial work
bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement \
  --recursive --strict > scratch/audit-2026-04-24/validator-after-copilot.txt 2>&1

# Compact trigger_phrases to flow-style YAML in 6 files
python3 /tmp/compact-trigger-phrases.py

# Final validation
bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement \
  --recursive --strict > scratch/audit-2026-04-24/validator-final.txt 2>&1

# Metadata refresh
node .opencode/skill/system-spec-kit/scripts/dist/spec-folder/generate-description.js \
  .opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement .opencode/specs

node .opencode/skill/system-spec-kit/scripts/dist/graph/backfill-graph-metadata.js \
  --root .opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement

# Commit + push
git add -A
git commit -m "chore: batch-sync parallel tracks + 023 spec-doc audit/fix"
git push origin main
```

---

## Files changed inside the 023 tree

- **Spec-doc content edits:** 148 markdown files (frontmatter `_memory` backfill + targeted content fixes)
- **Generated metadata:** `description.json`, `graph-metadata.json` at root and affected phases
- **Audit artifacts** (scratch/audit-2026-04-24/): `copilot-run.log`, `frontmatter-dry-run.json`, `validator-full.txt`, `validator-after-copilot.txt`, `validator-final.txt`, `fix-report.md`

Total in 023 subtree: **152 files** included in commit `51951b69d`.

---

## Reindex

- `description.json` at root 023 regenerated ✓
- `graph-metadata.json` inclusive backfill across 023 tree ✓
- `memory_index_scan` for `system-spec-kit/023-hybrid-rag-fusion-refinement` (force=true, incremental=false) → **scanned 173, indexed 1, updated 148, unchanged 24, failed 0** ✓
  - First attempt used short specFolder `023-hybrid-rag-fusion-refinement` → only picked up 2 constitutional files
  - Correct call requires the full path `system-spec-kit/023-hybrid-rag-fusion-refinement`

---

## Follow-ups

1. File validator bug for `EVIDENCE_MARKER_LINT` ENOENT on unexpanded phase-child glob.
2. Verify `memory_index_scan` completes post-lease-release.
3. Consider whether the `template_source_hint:` YAML field should be formally recognized by the TEMPLATE_SOURCE validator (alternate to the HTML comment) to stop this regression from recurring whenever `_memory` blocks are backfilled.
