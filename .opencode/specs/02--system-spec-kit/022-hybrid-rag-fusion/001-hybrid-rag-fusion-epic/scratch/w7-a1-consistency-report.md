# W7-A1 Consistency Report

Audit scope: `001`, `002`, `005`, `006`, `007`, `009`, `010`, and `012` under `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/`.

## Status and file consistency

| Folder | Spec status | Checklist status | Impl-summary exists | Date consistent | Score |
|--------|-------------|------------------|---------------------|-----------------|-------|
| `001-hybrid-rag-fusion-epic` | `in-progress` | `in-progress` | Yes | Yes | warn |
| `002-indexing-normalization` | `complete` | `complete` | Yes | Yes | warn |
| `005-core-rag-sprints-0-to-8` | `in-progress` | `in-progress` | Yes | Yes | fail |
| `006-extra-features` | `in-progress` | `in-progress` | Yes | Yes | fail |
| `007-ux-hooks-automation` | `in-progress` | `in-progress` | Yes | Yes | warn |
| `009-architecture-audit` | `complete` | `complete` | Yes | Yes | fail |
| `010-spec-descriptions` | `in-progress` | `in-progress` | Yes | Yes | warn |
| `012-command-alignment` | `complete` | `complete` | Yes | Yes | fail |

## Inconsistencies found

- `001-hybrid-rag-fusion-epic`: frontmatter says `level: 3`, but the spec metadata table says `Level 3+` (`spec.md:4`, `spec.md:90`). The epic phase map also still carries historical sprint aliases in comments, which keeps navigation partially stale even though the current folder targets are consolidated under `005` (`spec.md:177-193`).
- `006-extra-features`: frontmatter says `status: in-progress` and `level: 3`, while the metadata table says `Status: Draft` and `Level: 3+` (`spec.md:3-4`, `spec.md:45-49`). The summary also refers to the `023` refinement program inside the `022-hybrid-rag-fusion` tree (`spec.md:31`).
- `007-ux-hooks-automation`: frontmatter says `status: in-progress`, but the metadata table says `Status: Implemented` (`spec.md:3`, `spec.md:32`).
- `010-spec-descriptions`: frontmatter says `status: in-progress`, but the metadata table says `Status: Ready` (`spec.md:3`, `spec.md:31`).
- No spec/checklist frontmatter status mismatches were found between `spec.md` and `checklist.md`; all eight folders use matching frontmatter status values.
- No missing `implementation-summary.md` files were found for folders whose frontmatter status is `complete` (`002`, `009`, `012`).
- No `updated` frontmatter date mismatches were found between `spec.md` and `checklist.md`; all eight pairs currently use `2026-03-08`.

## Broken or missing cross-references

- `001-hybrid-rag-fusion-epic`: the epic status dashboard points at the current child folders, but the phase map still embeds historical retired folder names (`006-measurement-foundation`, `011-graph-signal-activation`, `012-scoring-calibration`, `013-query-intelligence`, `014-feedback-and-quality`, `015-pipeline-refactor`, `016-indexing-and-graph`, `017-long-horizon`) instead of a fully normalized consolidated navigation model (`spec.md:177-193`).
- `002-indexing-normalization`: no explicit backlink to the current epic spec (`001-hybrid-rag-fusion-epic`) was found in the canonical `spec.md`/`checklist.md` pair.
- `005-core-rag-sprints-0-to-8`: embedded navigation still points to stale parent and sibling locations such as `../000-feature-overview/spec.md`, `../000-feature-overview/plan.md`, `../006-measurement-foundation/`, and `../013-query-intelligence/` (`spec.md:342-346`).
- `006-extra-features`: `| **Parent Spec** | ../spec.md |` is broken because there is no `spec.md` at the `022-hybrid-rag-fusion/` root (`spec.md:404-408`). The predecessor note also says historical continuity was folded from retired `009-architecture-audit`, but `009-architecture-audit` still exists as an active complete folder (`spec.md:407-408`).
- `007-ux-hooks-automation`: no explicit backlink to the current epic spec (`001-hybrid-rag-fusion-epic`) was found in the canonical `spec.md`/`checklist.md` pair.
- `009-architecture-audit`: `| **Parent Spec** | ../spec.md |` is broken because there is no `spec.md` at the `022-hybrid-rag-fusion/` root (`spec.md:320-323`).
- `010-spec-descriptions`: no explicit backlink to the current epic spec (`001-hybrid-rag-fusion-epic`) was found in the canonical `spec.md`/`checklist.md` pair.
- `012-command-alignment`: the doc contains both a stale parent pointer to `../000-feature-overview/spec.md` and a broken `| **Parent Spec** | ../spec.md |` entry (`spec.md:208`, `spec.md:212-216`).

## Bidirectional link check

- Parent to child: the epic spec does mention every requested child folder by current folder name in its dashboard (`001-hybrid-rag-fusion-epic/spec.md:58-81`).
- Child to parent: none of the seven non-epic folders in scope has a clean, current spec-level backlink to `001-hybrid-rag-fusion-epic`.
  - Explicit but broken/stale backlink: `005`, `006`, `009`, `012`
  - Missing explicit backlink in canonical spec/checklist docs: `002`, `007`, `010`

## Overall assessment

- **001-hybrid-rag-fusion-epic**: warn — current child coverage exists, but level metadata and historical phase naming are not fully normalized.
- **002-indexing-normalization**: warn — status/date checks pass, but spec-level backlink to the epic is missing.
- **005-core-rag-sprints-0-to-8**: fail — multiple stale parent/sibling navigation references remain after consolidation.
- **006-extra-features**: fail — broken parent link plus status/level drift and contradictory lifecycle wording.
- **007-ux-hooks-automation**: warn — status vocabulary drifts from frontmatter and no clean epic backlink is present.
- **009-architecture-audit**: fail — explicit parent-spec link is broken.
- **010-spec-descriptions**: warn — status vocabulary drifts from frontmatter and no clean epic backlink is present.
- **012-command-alignment**: fail — both parent references are stale/broken.
