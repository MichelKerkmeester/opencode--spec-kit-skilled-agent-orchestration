# H13 TypeScript Standards Audit

Scope: exact file list provided by user under `.opencode/skill/system-spec-kit/scripts/`.

- Files audited: 40
- Files with findings: 40
- Total findings: 69

## Check Definitions
- P0: MODULE header (exact 3-line), no `any` in exports, PascalCase type names, no commented-out code, WHY comments must be AI-prefixed.
- P1: explicit return types, named interfaces for object params, non-null assertion justification, TSDoc on exports, `catch` uses `unknown` + `instanceof`.

## Findings by File

### `extractors/collect-session-data.ts`
- **P0** [Header block] Missing/invalid exact 3-line MODULE header at top of file.
- **P1** [TSDoc on exports] Exported declarations missing TSDoc at line(s): 47, 53, 64, 72, 76

### `extractors/contamination-filter.ts`
- **P0** [Header block] Missing/invalid exact 3-line MODULE header at top of file.
- **P1** [TSDoc on exports] Exported declarations missing TSDoc at line(s): 59

### `extractors/conversation-extractor.ts`
- **P0** [Header block] Missing/invalid exact 3-line MODULE header at top of file.
- **P1** [TSDoc on exports] Exported declarations missing TSDoc at line(s): 19, 30

### `extractors/decision-extractor.ts`
- **P0** [Header block] Missing/invalid exact 3-line MODULE header at top of file.
- **P1** [TSDoc on exports] Exported declarations missing TSDoc at line(s): 15, 21

### `extractors/diagram-extractor.ts`
- **P0** [Header block] Missing/invalid exact 3-line MODULE header at top of file.
- **P1** [TSDoc on exports] Exported declarations missing TSDoc at line(s): 25, 38

### `extractors/file-extractor.ts`
- **P0** [Header block] Missing/invalid exact 3-line MODULE header at top of file.
- **P1** [TSDoc on exports] Exported declarations missing TSDoc at line(s): 24, 30, 39, 51, 57

### `extractors/implementation-guide-extractor.ts`
- **P0** [Header block] Missing/invalid exact 3-line MODULE header at top of file.
- **P1** [TSDoc on exports] Exported declarations missing TSDoc at line(s): 14, 19, 24, 28, 33

### `extractors/index.ts`
- **P0** [Header block] Missing/invalid exact 3-line MODULE header at top of file.
- **P1** [TSDoc on exports] Exported declarations missing TSDoc at line(s): 23

### `extractors/opencode-capture.ts`
- **P0** [Header block] Missing/invalid exact 3-line MODULE header at top of file.
- **P1** [TSDoc on exports] Exported declarations missing TSDoc at line(s): 15, 22, 31, 43, 50

### `extractors/quality-scorer.ts`
- **P0** [Header block] Missing/invalid exact 3-line MODULE header at top of file.
- **P1** [TSDoc on exports] Exported declarations missing TSDoc at line(s): 122

### `extractors/session-extractor.ts`
- **P0** [Header block] Missing/invalid exact 3-line MODULE header at top of file.
- **P1** [TSDoc on exports] Exported declarations missing TSDoc at line(s): 23, 37, 44, 49, 58

### `loaders/data-loader.ts`
- **P0** [Header block] Missing/invalid exact 3-line MODULE header at top of file.
- **P1** [TSDoc on exports] Exported declarations missing TSDoc at line(s): 29

### `loaders/index.ts`
- **P0** [Header block] Missing/invalid exact 3-line MODULE header at top of file.
- **P1** [TSDoc on exports] Exported declarations missing TSDoc at line(s): 7

### `memory/ast-parser.ts`
- **P0** [Header block] Missing/invalid exact 3-line MODULE header at top of file.

### `memory/backfill-frontmatter.ts`
- **P0** [Header block] Missing/invalid exact 3-line MODULE header at top of file.

### `memory/cleanup-orphaned-vectors.ts`
- **P0** [Header block] Missing/invalid exact 3-line MODULE header at top of file.
- **P1** [catch unknown + instanceof] Catch handling issue(s): 167 (unknown without instanceof nearby), 186 (unknown without instanceof nearby)

### `memory/generate-context.ts`
- **P0** [Header block] Missing/invalid exact 3-line MODULE header at top of file.
- **P0** [Commented-out code] Likely commented-out code at line(s): 248
- **P1** [TSDoc on exports] Exported declarations missing TSDoc at line(s): 29
- **P1** [catch unknown + instanceof] Catch handling issue(s): 353 (unknown without instanceof nearby), 356 (unknown without instanceof nearby)

### `memory/rank-memories.ts`
- **P0** [Header block] Missing/invalid exact 3-line MODULE header at top of file.
- **P1** [TSDoc on exports] Exported declarations missing TSDoc at line(s): 33, 45, 59, 66, 77

### `memory/reindex-embeddings.ts`
- **P0** [Header block] Missing/invalid exact 3-line MODULE header at top of file.

### `memory/validate-memory-quality.ts`
- **P0** [Header block] Missing/invalid exact 3-line MODULE header at top of file.
- **P1** [TSDoc on exports] Exported declarations missing TSDoc at line(s): 343

### `renderers/index.ts`
- **P0** [Header block] Missing/invalid exact 3-line MODULE header at top of file.
- **P1** [TSDoc on exports] Exported declarations missing TSDoc at line(s): 14

### `renderers/template-renderer.ts`
- **P0** [Header block] Missing/invalid exact 3-line MODULE header at top of file.

### `spec-folder/alignment-validator.ts`
- **P0** [Header block] Missing/invalid exact 3-line MODULE header at top of file.
- **P1** [TSDoc on exports] Exported declarations missing TSDoc at line(s): 17, 27, 33, 40, 51

### `spec-folder/directory-setup.ts`
- **P0** [Header block] Missing/invalid exact 3-line MODULE header at top of file.
- **P1** [catch unknown + instanceof] Catch handling issue(s): 47 (unknown without instanceof nearby), 83 (unknown without instanceof nearby)

### `spec-folder/folder-detector.ts`
- **P0** [Header block] Missing/invalid exact 3-line MODULE header at top of file.
- **P1** [catch unknown + instanceof] Catch handling issue(s): 422 (unknown without instanceof nearby), 444 (unknown without instanceof nearby), 641 (unknown without instanceof nearby), 652 (unknown without instanceof nearby), 662 (unknown without instanceof nearby)

### `spec-folder/generate-description.ts`
- **P0** [Header block] Missing/invalid exact 3-line MODULE header at top of file.

### `spec-folder/index.ts`
- **P0** [Header block] Missing/invalid exact 3-line MODULE header at top of file.

### `types/session-types.ts`
- **P0** [Header block] Missing/invalid exact 3-line MODULE header at top of file.
- **P0** [PascalCase types] Non-PascalCase type/interface/class/enum names: definitions@3, hierarchies@4, count@140

### `utils/data-validator.ts`
- **P0** [Header block] Missing/invalid exact 3-line MODULE header at top of file.

### `utils/file-helpers.ts`
- **P0** [Header block] Missing/invalid exact 3-line MODULE header at top of file.

### `utils/index.ts`
- **P0** [Header block] Missing/invalid exact 3-line MODULE header at top of file.
- **P1** [TSDoc on exports] Exported declarations missing TSDoc at line(s): 7, 18, 29, 60, 68

### `utils/input-normalizer.ts`
- **P0** [Header block] Missing/invalid exact 3-line MODULE header at top of file.
- **P0** [PascalCase types] Non-PascalCase type/interface/class/enum names: indicating@10

### `utils/logger.ts`
- **P0** [Header block] Missing/invalid exact 3-line MODULE header at top of file.

### `utils/message-utils.ts`
- **P0** [Header block] Missing/invalid exact 3-line MODULE header at top of file.

### `utils/path-utils.ts`
- **P0** [Header block] Missing/invalid exact 3-line MODULE header at top of file.

### `utils/prompt-utils.ts`
- **P0** [Header block] Missing/invalid exact 3-line MODULE header at top of file.

### `utils/slug-utils.ts`
- **P0** [Header block] Missing/invalid exact 3-line MODULE header at top of file.
- **P1** [TSDoc on exports] Exported declarations missing TSDoc at line(s): 49, 65, 70, 79, 87

### `utils/task-enrichment.ts`
- **P0** [Header block] Missing/invalid exact 3-line MODULE header at top of file.
- **P1** [Explicit return types] Potential missing explicit return type on exported functions at line(s): 16, 29
- **P1** [TSDoc on exports] Exported declarations missing TSDoc at line(s): 12, 16, 29

### `utils/tool-detection.ts`
- **P0** [Header block] Missing/invalid exact 3-line MODULE header at top of file.

### `utils/validation-utils.ts`
- **P0** [Header block] Missing/invalid exact 3-line MODULE header at top of file.

## Aggregate Counts
- p0_header: 40
- p0_any_exports: 0
- p0_pascal: 2
- p0_commented_code: 1
- p0_why_prefix: 0
- p1_return_types: 1
- p1_object_params: 0
- p1_nonnull: 0
- p1_tsdoc: 21
- p1_catch: 4
