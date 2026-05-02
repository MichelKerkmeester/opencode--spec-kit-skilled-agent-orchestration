## Audit QA2-C04: file-extractor.ts — Copilot Cross-Validation
### P0 Blockers: 0 — None.
### P1 Required: 3 —
- [file-extractor.ts:142-156,218] Duplicate-path deduplication does not merge a later `ACTION` unless the later entry also wins the description/provenance comparison. In practice, two entries for the same file with the same description but only the second carrying `ACTION: 'rename'` return a file record with no `ACTION`, so rename/delete/add metadata can disappear based purely on input order.
- [file-extractor.ts:76-86,241-267; git-context-extractor.ts:23,65-71,138-146] `normalizeFileAction()` only recognizes `created|modified|deleted|read|renamed`, but the stateless git enrichment introduced by specs 012+013 emits `add|modify|delete|rename`. When those values reach semantic enhancement, `add`, `delete`, and `rename` all collapse to `Modified`, so the extractor does not preserve a correct ACTION enum across the full pipeline.
- [file-extractor.ts:245-267] Rename enhancement falls back to a unique basename match and ignores directory context. That means a semantic rename on `src/config.ts` can relabel an unrelated `tests/config.ts` entry as `Renamed` and copy over the other file's description, so rename detection is not path-accurate in repos that reuse filenames.
### P1 Required: supporting reproduction notes —
- `extractFilesFromData({ FILES: [{ FILE_PATH: 'src/a.ts', DESCRIPTION: 'Auth module' }, { FILE_PATH: 'src/a.ts', DESCRIPTION: 'Auth module', ACTION: 'rename' }] }, [])` => `[{ FILE_PATH: 'src/a.ts', DESCRIPTION: 'Auth module' }]`
- `enhanceFilesWithSemanticDescriptions([{ FILE_PATH: 'src/a.ts', DESCRIPTION: 'Modified during session' }], new Map([['src/a.ts', { description: 'Moved file', action: 'rename' }]]))` => `ACTION: 'Modified'`
- `enhanceFilesWithSemanticDescriptions([{ FILE_PATH: 'tests/config.ts', DESCRIPTION: 'Modified during session' }], new Map([['src/config.ts', { description: 'Moved config loader', action: 'renamed' }]]))` => `tests/config.ts` incorrectly becomes `Renamed`
### P2 Suggestions: 1 —
- [file-extractor.ts:124-125,167-220; test-extractors-loaders.js:1148-1154] Empty/null file lists currently degrade safely to `[]`, which is the right behavior for the stateless path. Add explicit regression coverage for `FILES: []`, `observations: []`, duplicate-path ACTION preservation, and basename-collision renames, because the current tests only assert "returns an array" and would not catch the regressions above.
### Score: 68
