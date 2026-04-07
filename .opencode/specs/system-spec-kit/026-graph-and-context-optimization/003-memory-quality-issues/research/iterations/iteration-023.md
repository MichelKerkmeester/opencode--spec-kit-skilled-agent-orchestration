# Iteration 23: Migration Strategy for Pre-fix Broken Files (Q20)

## Focus
Gen-1 deliberately treated manual repair of the original seven broken memory files as out of scope, but Gen-2 changed the scale of the problem: iteration 12 found **82 JSON-mode candidates out of 135 total memory files**, with D8 present in all 82, D4 in 81, and D3 in 52. That turns migration from an edge-case cleanup into a corpus-shaping decision for search quality, lineage trust, and user confidence in historical memories. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/deep-research-strategy.md:61-67] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-012.md:130-147]

The migration question matters now because the canonical 9-PR train fixes future saves, but it does not automatically clean historical artifacts. If pre-fix and post-fix files coexist indefinitely, the memory corpus stays mixed: new saves improve while old D3/D4/D8-heavy files continue to pollute retrieval and metadata trust. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:314-328] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-012.md:142-147]

## Approach
- Re-read Gen-3 scope and the original non-goal boundary so the migration recommendation stays additive rather than reopening Q1-Q17.
- Use iteration 12 as the population baseline for file counts, per-defect prevalence, and corpus spread.
- Inspect representative broken files to separate defects that are still recoverable from the artifact itself versus defects where source information is already lost.
- Check current remediation guidance and PR train ordering to place migration after the preventive fixes and post-save reviewer hardening.
- Search the repository for existing migration/backfill tooling to see whether a one-shot repo-wide script fits established patterns.

## Population recap (from iter 12)
- Total memory files in repo: 135 [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-012.md:15-18]
- JSON-mode candidates matching broken heuristics: 82 [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-012.md:15-18]
- Spread across 49 spec folders [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-012.md:47-128]
- Per-defect presence breakdown:

| Defect | Count | % of JSON-mode pop | % of total memory pop |
|--------|------:|-------------------:|----------------------:|
| D1 | 0 | 0.0% | 0.0% |
| D2 | 2 | 2.4% | 1.5% |
| D3 | 52 | 63.4% | 38.5% |
| D4 | 81 | 98.8% | 60.0% |
| D5 | 0 | 0.0% | 0.0% |
| D6 | 1 | 1.2% | 0.7% |
| D7 | 0 | 0.0% | 0.0% |
| D8 | 82 | 100.0% | 60.7% |

[SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-012.md:130-140]

Iteration 12 explicitly treated D1/D5/D7 zeroes as lower-bound survey results, not proof that those defects disappeared; they were harder to count from static file evidence than D3/D4/D8. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-012.md:147-152]

## Option A: Do nothing (status quo)
- **What it means:** Leave the 82 files as-is. Only new saves get the fix.
- **Cost:** zero
- **User impact:** LOW-MEDIUM — broken files are historical, but D8 remains universal, D4 near-universal, and D3 common enough that retrieval quality remains visibly mixed for older memories. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-012.md:130-147]
- **Risk:** causal graph keeps holes where `supersedes` was never written; search retrieval and metadata trust stay noisy on legacy files. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:57-63] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/06-04-26_13-47__extended-deep-research-run-13-iterations-total-8.md:495-503]
- **Recoverability:** none (but no damage either)

## Option B: Auto-heal on next save
- **What it means:** When a memory file is next saved (edited/re-saved), apply D1-D8 fixes in-place.
- **Cost:** modest (one-time edit per file, triggered naturally)
- **User impact:** LOW — transparent
- **Risk:** MEDIUM — timing is unpredictable, many historical files may never be re-saved, and some defects are not safely recoverable from the artifact alone. D1 truncation has already lost summary text, D2 placeholder decisions have lost original decision labels/content, and D7 provenance cannot be truthfully reconstructed from current HEAD. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/06-04-26_13-47__extended-deep-research-run-13-iterations-total-8.md:198-205] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/06-04-26_13-47__extended-deep-research-run-13-iterations-total-8.md:231-357] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/06-04-26_13-47__extended-deep-research-run-13-iterations-total-8.md:466-470]
- **Recoverability:** per-file

## Option C: One-shot batch migration script
- **What it means:** Write a CLI tool that scans all memory files matching the broken heuristics and applies D1-D8 fixes in one pass. Dry-run + diff mode.
- **Cost:** NEW script + test suite + review + one-time run. For the defects iteration 12 could actually count, the script would touch roughly **216 deterministic defect instances** before any guarded D5 handling (82x D8 + 81x D4 + 52x D3 + 1x D6, with overlap across 82 files). [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-012.md:130-140]
- **User impact:** MEDIUM — one explicit migration event, but the repo already has precedents for dry-run/apply/report bulk rewrites and conflict-skipping migrations. [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/backfill-frontmatter.ts:99-120] [SOURCE: .opencode/skill/system-spec-kit/scripts/migrate-deep-research-paths.ts:44-64] [SOURCE: .opencode/skill/system-spec-kit/scripts/migrate-deep-research-paths.ts:97-109] [SOURCE: .opencode/skill/system-spec-kit/scripts/migrate-deep-research-paths.ts:194-209]
- **Risk:** MEDIUM if scoped to deterministic fixes only; HIGH if it tries to invent missing content or lineage. D5 is only safe when predecessor discovery is immediate and unambiguous, while D1/D2/D7 are not recoverable mechanically. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:71-75] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/06-04-26_13-47__extended-deep-research-run-13-iterations-total-8.md:198-205] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/06-04-26_13-47__extended-deep-research-run-13-iterations-total-8.md:231-357] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/06-04-26_13-47__extended-deep-research-run-13-iterations-total-8.md:466-470]
- **Recoverability:** git revert

## Option D: Regenerate from session transcripts
- **What it means:** Find the original session transcripts, re-run generate-context.js in capture mode to produce fresh files.
- **Cost:** HIGH — representative broken JSON-mode files persist empty `_sourceTranscriptPath` and `_sourceSessionId`, so the original source is often not discoverable from the artifact itself. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/06-04-26_13-47__extended-deep-research-run-13-iterations-total-8.md:55-58] [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/memory/31-03-26_17-35__implemented-45-item-v2-remediation-across-phases.md:36-39]
- **User impact:** HIGH — regenerated files would likely produce new content hashes, new filenames/timestamps, and broken downstream references/citations.
- **Risk:** very high — this swaps historical artifacts rather than repairing them, and it depends on source material that is frequently absent.
- **Recoverability:** none

## Recommendation
**Choose Option C** because the population is too large for status-quo drift, too historically frozen for next-save healing, and too weakly linked to source transcripts for regeneration. The right shape is **not** a blanket D1-D8 rewrite; it is a **safe subset migration** that batch-fixes only defects still recoverable from the artifact or its immediate folder context:

- **Safe/mechanical:** D8 anchor rename, D4 tier synchronization, D6 dedupe, D3 trigger-phrase sanitation. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:69-75] [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/memory/31-03-26_17-35__implemented-45-item-v2-remediation-across-phases.md:4-34] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/06-04-26_13-47__extended-deep-research-run-13-iterations-total-8.md:195-205]
- **Guarded/skip-on-ambiguity:** D5 `supersedes` backfill only when continuation signal plus one immediate predecessor is unambiguous. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:71-75]
- **Do not batch-heal:** D1, D2, and D7. Those defects already lost source truth or provenance, so a migration script can only fabricate replacements. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/06-04-26_13-47__extended-deep-research-run-13-iterations-total-8.md:198-205] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/06-04-26_13-47__extended-deep-research-run-13-iterations-total-8.md:231-357] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/06-04-26_13-47__extended-deep-research-run-13-iterations-total-8.md:466-470]

**Migration plan:**
1. Land PR-1 through PR-9 first so the preventive fixes and reviewer checks are canonical before touching historical files. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:314-328]
2. Open **PR-10 (optional)** with a migration CLI that follows existing repo conventions: `--dry-run`, `--apply`, JSON report output, and conflict/ambiguity skip behavior. [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/backfill-frontmatter.ts:99-120] [SOURCE: .opencode/skill/system-spec-kit/scripts/migrate-deep-research-paths.ts:44-64] [SOURCE: .opencode/skill/system-spec-kit/scripts/migrate-deep-research-paths.ts:194-209]
3. Run dry-run first and emit three buckets: `fixed`, `skipped-ambiguous`, and `unrecoverable` (D1/D2/D7).
4. Apply only D3/D4/D6/D8 globally and D5 only for exact one-predecessor matches; never synthesize missing overview text, decision content, or git provenance.
5. Re-run the upgraded post-save reviewer/contamination checks on migrated files and keep git revert as the rollback path.

**Safety gates:**
- Dry-run required
- Per-defect toggle (fix D1 only, fix D4 only, etc.)
- Per-file backup to research/archive/migrations/
- Post-migration contamination check

## Interaction with PR train
- This migration is **post-PR-9** (after all fixes + post-save reviewer land). [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:320-328]
- It becomes a new **PR-10 (optional, not part of the canonical train)** if selected. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:314-328]

## Findings
1. The migration target is materially larger than the original non-goal: 82 JSON-mode candidates across 135 memory files and 49 spec folders, so “leave history alone” is now a corpus-level decision rather than a seven-file cleanup. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/deep-research-strategy.md:61-67] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-012.md:15-18] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-012.md:47-128]
2. D8 and D4 dominate the population (82/82 and 81/82), which makes them strong candidates for mechanical migration rather than manual follow-up. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-012.md:130-147]
3. D3 is also broad and visibly mechanical: representative broken files carry path-fragment trigger phrases such as `kit/024`, `compact`, `code`, and `graph`, so a sanitizer-style cleanup is realistic. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-012.md:144-145] [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/memory/31-03-26_17-35__implemented-45-item-v2-remediation-across-phases.md:4-34]
4. D1 and D2 are not safely auto-healable from the file alone: the overview text is already cut mid-sentence and the decision titles degraded to `observation decision 1` / `user decision 1`, meaning the missing human-authored content is gone. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/06-04-26_13-47__extended-deep-research-run-13-iterations-total-8.md:198-205] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/06-04-26_13-47__extended-deep-research-run-13-iterations-total-8.md:231-357]
5. D7 provenance is also unrecoverable mechanically: the broken files store blank git provenance today, and writing current repo state back into historical memories would fabricate rather than restore provenance. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/06-04-26_13-47__extended-deep-research-run-13-iterations-total-8.md:466-470]
6. D5 can be backfilled only under strict ambiguity controls because the current recommendation already limits auto-supersedes to the immediate, unambiguous predecessor. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:71-75]
7. A one-shot migration script matches existing repository practice better than an ad hoc manual sweep: there is already a frontmatter backfill CLI with dry-run/apply/report semantics and a separate bulk migration script with conflict-skipping and rewrite accounting. [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/backfill-frontmatter.ts:99-120] [SOURCE: .opencode/skill/system-spec-kit/scripts/migrate-deep-research-paths.ts:44-64] [SOURCE: .opencode/skill/system-spec-kit/scripts/migrate-deep-research-paths.ts:194-209]

## Ruled out / not reproducible
- **Blind full-artifact regeneration as the default plan:** representative broken JSON-mode files keep `_sourceTranscriptPath` and `_sourceSessionId` empty, so the source material is often not addressable from the artifact. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/06-04-26_13-47__extended-deep-research-run-13-iterations-total-8.md:55-58]
- **Blanket D5 backfill across every “extended/continuation” title:** the accepted D5 design already requires an immediate, unambiguous predecessor and ambiguity skip. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:71-75]
- **Batch-fixing D1/D2/D7 from the current file only:** the missing source truth is not reproducible from the corrupted artifact. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/06-04-26_13-47__extended-deep-research-run-13-iterations-total-8.md:198-205] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/06-04-26_13-47__extended-deep-research-run-13-iterations-total-8.md:231-357] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/06-04-26_13-47__extended-deep-research-run-13-iterations-total-8.md:466-470]

## New questions raised
- Should PR-10 emit a machine-readable `skipped-ambiguous` manifest so D1/D2/D7 and ambiguous D5 candidates can be reviewed later without re-scanning the repo?

## Next focus recommendation
Iteration 24 should execute Q21 (observability / telemetry). See strategy §15. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/deep-research-strategy.md:223-231]
