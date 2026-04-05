## Agent 06 - Wave 1 Slice A06 Notes

- Updated 9 README files under `.opencode/skill/system-spec-kit/scripts/` scope to match current on-disk script inventory.
- Replaced stale module counts and outdated migration notes with factual file-level inventories from current directories.
- Aligned docs with post-spec124/128/129 workflow: `upgrade-level.sh` -> AI auto-populate -> `check-placeholders.sh` -> `validate.sh` (including anchor enforcement).
- Added explicit references to current core modules (`file-writer.ts`, `memory-indexer.ts`, `quality-scorer.ts`, `topic-extractor.ts`) and current test files (including `test-upgrade-level.sh`, `test-subfolder-resolution.js`).
- Kept content ASCII and removed placeholder text.

## Checks

- Validation approach: factual cross-check against directory listings for each documented folder.
- Runtime/tests: not executed in this slice (docs-only update).
