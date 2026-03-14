# Audit C-05: Template Compliance Across 12 Spec Folders
## Summary
| Folder | Template Source | Anchors | Frontmatter | Level | Overall |
|--------|-----------------|---------|-------------|-------|---------|
| 001 | MISSING | OK | INVALID | 3+ | FAIL |
| 002 | MISSING | OK | INVALID | 3 | FAIL |
| 003 | MISSING | OK | INVALID | 2 | FAIL |
| 004 | MISSING | OK | INVALID | 2 | FAIL |
| 005 | MISSING | OK | INVALID | 2 | FAIL |
| 006 | MISSING | OK | INVALID | 3+ | FAIL |
| 007 | MISSING | OK | INVALID | 2 | FAIL |
| 008 | MISSING | OK | INVALID | 3 | FAIL |
| 009 | MISSING | OK | INVALID | 3 | FAIL |
| 010 | MISSING | OK | INVALID | 2 | FAIL |
| 011 | MISSING | MISSING | INVALID | MISSING | FAIL |
| 012 | MISSING | OK | INVALID | 3 | FAIL |

## Common Issues
- Frontmatter does not include the required `title`, `status`, `level`, `created`, and `updated` fields. (12/12)
- SPECKIT_TEMPLATE_SOURCE is present but usually uses a shorthand alias instead of a concrete level template path. (11/12)
- SPECKIT_TEMPLATE_SOURCE metadata is missing entirely. (1/12)
- ANCHOR tags are missing or have unmatched open/close pairs. (1/12)
- SPECKIT_LEVEL declaration is missing. (1/12)
- Template metadata does not reference v2.2+. (1/12)

## Issues [ISS-C05-001]
- Folder: `001`
- File: `specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/spec.md`
- Finding: template source present but not path-based/correct for level 3+: `consolidated-epic-merge | v1`
- Finding: frontmatter YAML missing or invalid

## Issues [ISS-C05-002]
- Folder: `002`
- File: `specs/02--system-spec-kit/022-hybrid-rag-fusion/002-indexing-normalization/spec.md`
- Finding: template source present but not path-based/correct for level 3: `merge-consolidation | v1.0`
- Finding: frontmatter missing required fields: created, level, status, updated

## Issues [ISS-C05-003]
- Folder: `003`
- File: `specs/02--system-spec-kit/022-hybrid-rag-fusion/003-speckit-quality-and-standards/spec.md`
- Finding: template source present but not path-based/correct for level 2: `spec-core + level2-verify + level3-arch | v2.2`
- Finding: frontmatter missing required fields: created, level, status, updated

## Issues [ISS-C05-004]
- Folder: `004`
- File: `specs/02--system-spec-kit/022-hybrid-rag-fusion/004-constitutional-learn-refactor/spec.md`
- Finding: template source present but not path-based/correct for level 2: `spec-core + level2-verify | v2.2`
- Finding: frontmatter missing required fields: created, level, status, updated

## Issues [ISS-C05-005]
- Folder: `005`
- File: `specs/02--system-spec-kit/022-hybrid-rag-fusion/005-core-rag-sprints-0-to-8/spec.md`
- Finding: template source present but not path-based/correct for level 2: `spec-core + level2-verify + consolidation-merge | v2.2`
- Finding: frontmatter missing required fields: created, level, status, updated

## Issues [ISS-C05-006]
- Folder: `006`
- File: `specs/02--system-spec-kit/022-hybrid-rag-fusion/006-extra-features/spec.md`
- Finding: template source present but not path-based/correct for level 3+: `spec-core + level2-verify + level3-arch + level3plus-govern | v2.2`
- Finding: frontmatter missing required fields: created, level, status, updated

## Issues [ISS-C05-007]
- Folder: `007`
- File: `specs/02--system-spec-kit/022-hybrid-rag-fusion/006-ux-hooks-automation/spec.md`
- Finding: template source present but not path-based/correct for level 2: `spec-core | v2.2`
- Finding: frontmatter missing required fields: created, level, status, updated

## Issues [ISS-C05-008]
- Folder: `008`
- File: `specs/02--system-spec-kit/022-hybrid-rag-fusion/007-combined-bug-fixes/spec.md`
- Finding: template source present but not path-based/correct for level 3: `spec-core | v2.2`
- Finding: frontmatter missing required fields: created, level, status, updated

## Issues [ISS-C05-009]
- Folder: `009`
- File: `specs/02--system-spec-kit/022-hybrid-rag-fusion/008-architecture-audit/spec.md`
- Finding: template source present but not path-based/correct for level 3: `spec-core + level2-verify + level3-arch | v2.2`
- Finding: frontmatter missing required fields: created, level, status, updated

## Issues [ISS-C05-010]
- Folder: `010`
- File: `specs/02--system-spec-kit/022-hybrid-rag-fusion/009-spec-descriptions/spec.md`
- Finding: template source present but not path-based/correct for level 2: `spec-core | v2.2`
- Finding: frontmatter missing required fields: created, level, status, updated

## Issues [ISS-C05-011]
- Folder: `011`
- File: `specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/spec.md`
- Finding: missing SPECKIT_TEMPLATE_SOURCE metadata
- Finding: no ANCHOR tags found
- Finding: frontmatter YAML missing or invalid
- Finding: missing SPECKIT_LEVEL declaration
- Finding: template version reference missing or earlier than v2.2

## Issues [ISS-C05-012]
- Folder: `012`
- File: `specs/02--system-spec-kit/022-hybrid-rag-fusion/012-command-alignment/spec.md`
- Finding: template source present but not path-based/correct for level 3: `spec-core + level2-verify + level3-arch | v2.2`
- Finding: frontmatter missing required fields: created, level, status, updated
