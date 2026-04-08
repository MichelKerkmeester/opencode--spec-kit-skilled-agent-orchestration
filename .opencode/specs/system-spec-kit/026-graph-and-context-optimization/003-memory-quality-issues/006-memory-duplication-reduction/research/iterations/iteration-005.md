---
title: "Iteration 005: structural duplication"
description: "Phase 6 deep-research iteration 005 — structural duplication duplication landscape and proposed remediation"
trigger_phrases:
  - "phase 6 iteration 005"
  - "structural duplication"
  - "memory duplication structural duplication"
importance_tier: important
contextType: "research"
---

# Iteration 005: structural duplication

## Question
Do recent post-Phase-5 memory files still carry structurally redundant scaffolding or duplicated machine-facing fields, and if so which current template/reviewer surfaces are keeping that redundancy alive?

## Method
- Files sampled: 52 total. I reviewed the 50 most-recent repo files that matched `.opencode/specs/**/memory/*.md` plus the 2 files currently present in `~/.claude/projects/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/memory/`.
- Detection technique: regex scans for comment anchors, HTML anchors, heading slugs, repeated `## MEMORY METADATA` sections, and frontmatter-to-YAML field mirrors; exact and overlap comparisons for `trigger_phrases`, `contextType/context_type`, `importance_tier`, and `key_topics`; targeted owner tracing through `context_template.md`, `post-save-review.ts`, `memory-metadata.ts`, and `frontmatter-migration.ts`.
- Bounding rule: I counted something as structural duplication only when the same identifier or field value was written twice without carrying distinct human-versus-machine meaning. I treated the 49 generated memory artifacts as the primary denominator and used the vendored `SKILL.md` plus the 2 Claude auto-memory docs as negative controls.

## Findings
- `F005.1` Pattern: section identity is emitted as a three-part scaffold in every current generated memory file.
  Frequency: 49 of 49 generated memory artifacts had at least one repeated section identity triplet; 0 of 49 had orphaned closing anchor comments or duplicate comment-anchor ids.
  Example(s): `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/memory/07-04-26_13-08__decomposed-the-locked-9-pr-remediation-train-from.md:87-90` contains the exact sequence `<!-- ANCHOR:continue-session -->`, `<a id="continue-session"></a>`, `## CONTINUE SESSION`; the same file repeats the pattern at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/memory/07-04-26_13-08__decomposed-the-locked-9-pr-remediation-train-from.md:636-639` with `<!-- ANCHOR:metadata -->`, `<a id="memory-metadata"></a>`, `## MEMORY METADATA`.
  Cause hypothesis: the template still emits both comment anchors and HTML ids for the same section start, while the indexer only extracts comment anchors (`.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:343-345`) and the reviewer regex explicitly expects the triplet instead of treating it as redundant (`.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:274-278`).
  Severity: MEDIUM.

- `F005.2` Pattern: frontmatter fields are still mirrored into the bottom `MEMORY METADATA` block, so Phase 2 fixed the importance-tier mismatch but not the broader duplicate-write design.
  Frequency: 49 of 49 generated memory artifacts duplicated `importance_tier`, `contextType/context_type`, and `trigger_phrases` structurally; exact trigger list order matched in 25 of 49 sampled generated memories.
  Example(s): `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/memory/07-04-26_13-08__decomposed-the-locked-9-pr-remediation-train-from.md:4-18` defines frontmatter `trigger_phrases:`, `importance_tier: "important"`, and `contextType: "planning"`, then the same file repeats `importance_tier: "important"` and `context_type: "planning"` at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/memory/07-04-26_13-08__decomposed-the-locked-9-pr-remediation-train-from.md:656-657` and repeats the full `trigger_phrases:` list beginning at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/memory/07-04-26_13-08__decomposed-the-locked-9-pr-remediation-train-from.md:738`. The same mirrored structure appears in `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/memory/08-04-26_08-18__extended-the-005-claudest-deep-research-packet.md:4-37` and `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/memory/08-04-26_08-18__extended-the-005-claudest-deep-research-packet.md:572-664`.
  Cause hypothesis: `context_template.md` still writes the same classification/trigger data into both frontmatter and metadata (`.opencode/skill/system-spec-kit/templates/context_template.md:1-6`, `.opencode/skill/system-spec-kit/templates/context_template.md:755-836`); `frontmatter-migration.ts` only knows how to reconcile `importance_tier` inside `MEMORY METADATA` (`.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1027-1087`); `post-save-review.ts` only checks D4 tier drift and has no equivalent check for `context_type` or `trigger_phrases` duplication (`.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:666-673`).
  Severity: HIGH.

- `F005.3` Pattern: the human-facing `Key Topics` snapshot line and machine-facing `key_topics:` YAML list are near-mirrors fed by the same template variable.
  Frequency: 45 of 49 generated memory artifacts had at least 80% overlap between the `**Key Topics:**` line and the `key_topics:` YAML list; exact equality occurred in 1 historical file.
  Example(s): `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/memory/07-04-26_13-08__decomposed-the-locked-9-pr-remediation-train-from.md:158` renders `**Key Topics:**` with `priority bands`, `prior research`, and `implementation-summary.md placeholders`, while the same file repeats the same topic family under YAML `key_topics:` at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/memory/07-04-26_13-08__decomposed-the-locked-9-pr-remediation-train-from.md:723-735`.
  Cause hypothesis: the template renders `TOPICS` once in the PROJECT STATE SNAPSHOT and again in `MEMORY METADATA`, so the duplication is template-driven rather than corpus drift (`.opencode/skill/system-spec-kit/templates/context_template.md:274`, `.opencode/skill/system-spec-kit/templates/context_template.md:831-833`).
  Severity: LOW.

- `F005.4` Pattern: one legacy memory still carries exact duplicate HTML ids.
  Frequency: 1 sampled generated memory file, 4 duplicate HTML-anchor occurrences.
  Example(s): `.opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/070-memory-ranking/memory/16-01-26_16-09__memory-ranking.md:151` and `:173` both contain `<a id="decisions"></a>`; the same file repeats `<a id="conversation"></a>` at `.opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/070-memory-ranking/memory/16-01-26_16-09__memory-ranking.md:193` and `:201`.
  Cause hypothesis: this looks like a historical pre-template-cleanup artifact, not a current template regression. None of the April 7-8 generated memories repeated an HTML id exactly.
  Severity: LOW.

## Negative Cases
- I found no generated memory file with the same `## MEMORY METADATA` section twice. Frequency: 0 of 49.
- I found no orphaned `<!-- /ANCHOR:... -->` closes and no duplicate comment-anchor ids in the 49 generated memory artifacts. The current problem is redundant parallel anchor systems, not broken comment-anchor balance.
- I found no repeated `embedding_status:` entry in sampled recent metadata blocks. Frequency: 0 of 49.
- The Claude auto-memory files at `~/.claude/projects/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/memory/MEMORY.md` and `.../feedback_implementation_summary_placeholders.md` are not generated session-memory artifacts and did not reproduce the structural duplication patterns above.

## Proposed Remediation
- `F005.1`
  Owner file:line: `.opencode/skill/system-spec-kit/templates/context_template.md:187-188`, `.opencode/skill/system-spec-kit/templates/context_template.md:736-737`, `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:274-278`, `.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:343-345`
  Patch shape: code change plus template edit
  Risk: MEDIUM. If the wrong anchor system is removed, TOC links or parser expectations could break.
  Verification: render 3 representative memories and prove that TOC links still resolve, `extractAnchorIds()` still returns the expected section ids, and the reviewer no longer assumes a comment-anchor-plus-HTML-id triplet.

- `F005.2`
  Owner file:line: `.opencode/skill/system-spec-kit/templates/context_template.md:1-6`, `.opencode/skill/system-spec-kit/templates/context_template.md:755-836`, `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1027-1087`, `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:666-673`
  Patch shape: code change plus template edit
  Risk: MEDIUM. Some downstream readers may currently rely on frontmatter while others read `MEMORY METADATA`.
  Verification: choose one single source of truth for `contextType/context_type` and `trigger_phrases`, replay representative saves, then prove that frontmatter parsing, metadata parsing, and memory search/indexing still return the same effective classification and trigger set.

- `F005.3`
  Owner file:line: `.opencode/skill/system-spec-kit/templates/context_template.md:274` and `.opencode/skill/system-spec-kit/templates/context_template.md:831-833`
  Patch shape: template edit
  Risk: LOW. This is a readability-versus-indexing duplication question, not a semantic integrity risk.
  Verification: confirm that removing or compressing one of the two topic surfaces preserves the same searchable topic set and still leaves a readable human snapshot.

- `F005.4`
  Owner file:line: `.opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/070-memory-ranking/memory/16-01-26_16-09__memory-ranking.md:151-201`
  Patch shape: one-time migration
  Risk: LOW. The file is historical and already outside the current generator path.
  Verification: bounded grep for `^<a id=\"decisions\"></a>$|^<a id=\"conversation\"></a>$` in live memory stores should return at most one occurrence per id after cleanup.

## Confidence
0.88. The structural patterns are directly visible in 49 current generated memory artifacts, the duplicate-write template owners are concrete, and the reviewer/indexer blind spots are line-identifiable. Confidence is lower than 0.9 only because the `Key Topics` overlap finding is partly based on high-overlap matching rather than exact equality, and one duplicate-id case is historical rather than current-template output.

## Convergence Signal
There is one actionable HIGH finding in this dimension: frontmatter-to-`MEMORY METADATA` mirroring still duplicates live classification and trigger data across the entire current generated corpus. I consider the structural-duplication landscape converged enough for synthesis and remediation planning; another iteration in this dimension would mostly expand the historical migration inventory rather than surface a new current-template defect class.
