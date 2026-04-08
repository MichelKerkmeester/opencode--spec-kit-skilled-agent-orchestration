---
title: "Iteration 003: key_topics and FILES table duplication"
description: "Phase 6 deep-research iteration 003 — key_topics and FILES table duplication landscape and proposed remediation"
trigger_phrases:
  - "phase 6 iteration 003"
  - "key_topics and files table duplication"
  - "memory duplication key_topics and files table"
importance_tier: important
contextType: "research"
---

# Iteration 003: key_topics and FILES table duplication

## Question
Do recent memory artifacts still duplicate `key_topics` or FILES-table entries after PR5, and when apparent repetition is actually valid tree-thinned provenance rather than an extractor bug?

## Method
- Files sampled: 51 memory files total: 50 newest `.opencode/specs/**/memory/*.md` files across 26 spec-memory directories, plus 1 newest `~/.claude/projects/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/memory/*.md` file. Excluded `scratch/`, `z_archive/`, `external/`, `quarantine/`, and `.archive-pre-quality-rebuild/`.
- Detection technique: line-based parsing of `**Key Topics:**`, legacy `key_topics:` YAML, and `**Key Files:**` tables; per-memory exact-path row counting; normalized topic clustering (lowercase, hyphen/underscore/slash collapse, trailing-`s` singularization); manual spot-checks with line references; code-owner review in `file-extractor.ts`, `alignment-validator.ts`, and `semantic-signal-extractor.ts`.
- Bounding rule: counted FILES duplication only when the same `FILE_PATH` appeared in multiple table rows within one memory; counted topic duplication only when distinct strings normalized to the same noun phrase; treated `Tree-thinning merged ... Merged from ...` text inside one surviving row as valid multi-file condensation unless it leaked into other retrieval-facing fields.

## Findings
- `F003.1` Pattern label: Tree-thinning carrier rows create apparent FILES duplication without duplicate `FILE_PATH` rows.
  - Frequency: 31/51 sampled memories contained `Tree-thinning merged ...` rows; 82 such rows total; 24 memories had descriptions with 2 or more `Merged from ...` clauses. Exact repeated `FILE_PATH` rows were found in 0/50 repo-sampled recent memories.
  - Examples:
  - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/memory/06-04-26_18-30__completed-a-10-iteration-deep-research.md:224` stores a single FILES row for `research/(merged-small-files)` whose description starts `Tree-thinning merged 3 small files (research.md, deep-research-state.jsonl, deep-research-config.json)...`
  - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/memory/08-04-26_08-18__extended-the-005-claudest-deep-research-packet.md:211` and `:214` each keep one row, but append multiple `Merged from ...` clauses into the description text.
  - Cause hypothesis: `file-extractor.ts` already dedupes canonical paths into a single map entry, so row-level duplication is not the current bug. The noisy repetition is introduced later by `alignment-validator.ts`, which appends merged provenance back into the carrier row description for tree-thinned groups.
  - Severity: MEDIUM (semantic noise and token waste in retrieval-facing FILES descriptions, but not broken path-level dedupe).
- `F003.2` Pattern label: Singular/plural key_topics duplication survives in older memories but not in the recent post-PR5 corpus.
  - Frequency: 1/51 sampled memories overall; 0/21 sampled memories dated `2026-04-06` through `2026-04-08`.
  - Examples:
  - `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/012-command-alignment/memory/15-03-26_08-26__implemented-016-command-alignment-aligned-the.md:140` renders both ``command`` and ``commands`` in `**Key Topics:**`.
  - The same memory also preserves both values in legacy metadata at `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/012-command-alignment/memory/15-03-26_08-26__implemented-016-command-alignment-aligned-the.md:487-494`.
  - Cause hypothesis: historical topic output only deduped exact strings. `semantic-signal-extractor.ts` still ends with exact-string dedupe, but the current post-PR5 sample did not reproduce the singular/plural case.
  - Severity: LOW (historical corpus cleanup issue, not an active recent-output defect).

## Negative Cases
- Exact same-path FILES-table duplication was not found in the recent corpus. `file-extractor.ts` dedupe logic (`filesMap` keyed by canonical path) appears to be holding on current saves; the apparent repetition in FILES tables is description inflation, not repeated rows.
- Recent post-PR5 noun-variant duplication was not reproduced. Across the 21 most recent sampled memories (`2026-04-06` to `2026-04-08`), normalized topic clustering found zero `command`/`commands`-style duplicates.
- After stripping tree-thinning provenance, I did not find clean leading FILES descriptions that merely restated the memory's own spec-folder slug. Apparent `spec-folder-name` echoes were false positives caused by `Merged from <full path>` text embedded in the description.
- The single auto-memory file sampled (`feedback_implementation_summary_placeholders.md`) had no FILES table and no `key_topics`, so it did not contribute duplication issues in this dimension.

## Proposed Remediation
- `F003.1`
  - Owner file:line: `.opencode/skill/system-spec-kit/scripts/core/alignment-validator.ts:151-178`
  - Patch shape: code change
  - Risk: LOW
  - Mitigation: keep tree-thinning coverage and carrier-row selection intact; only move verbose `Merged from ...` provenance out of `DESCRIPTION` and into a non-topic-bearing field/comment/auxiliary section while preserving a short summary such as `Merged 3 small files`.
  - Verification: replay a tree-thinned save and assert (1) no duplicate `FILE_PATH` rows, (2) same carrier rows remain, (3) FILES descriptions no longer contain 2+ `Merged from` clauses, and (4) existing tree-thinning coverage in `workflow-e2e.vitest.ts` still passes.
- `F003.2`
  - Owner file:line: `.opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts:321-323`
  - Patch shape: one-time migration preferred; optional cheap code guard
  - Risk: LOW
  - Mitigation: if touched in code, only collapse normalized-equal variants (`command`/`commands`, hyphen/underscore spelling variants) at the final dedupe step; otherwise keep this as a migration/backfill for historical files so recent post-PR5 output remains unchanged.
  - Verification: migrate or replay the older `012-command-alignment` memory and assert a single canonical topic remains; confirm the 21-file recent post-PR5 sample is unchanged.

## Confidence
0.88 — strong for the recent corpus because the scan was automated, bounded, and then manually spot-checked against concrete lines and code owners. Weakness: the sample intentionally excluded archives/quarantine/external trees, so this is a good answer for current memory quality, not for the full historical backlog.

## Convergence Signal
No HIGH-severity items were found in this dimension. For recent memories, the investigation is converged: FILES-table path dedupe is working, the main live issue is tree-thinning provenance inflation, and singular/plural `key_topics` duplication looks historical rather than current. Another iteration would only help if the scope explicitly expands to archived-corpus migration or to path-fragment overlap as a separate post-PR5 topic-noise study.
