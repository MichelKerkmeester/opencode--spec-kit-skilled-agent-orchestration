# Detector Discovery + Containment Verification

- Date: 2026-03-10
- Scope: `folder-detector.ts`, `generate-context.ts`, targeted regression tests only

## Files Changed

- `.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts`
- `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/test-folder-detector-functional.js`
- `.opencode/skill/system-spec-kit/scripts/tests/test-subfolder-resolution.js`

## Behavior Fixed

- Category-rooted discovery now includes `NN--category/NNN-parent/NNN-child` for session bare-child resolution and auto-detect candidate collection.
- Approved-root containment now uses canonical realpath-safe validation in detector and generate-context flows, preventing symlink escape aliases from passing approved-root checks.
- Added regressions for category-rooted lookup/discovery and symlink escape rejection.

## Commands Run

- `npm run build` -> PASS
- `python3 .opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py --root .opencode/skill/system-spec-kit` -> PASS
- `node .opencode/skill/system-spec-kit/scripts/tests/test-folder-detector-functional.js` -> PASS (`35 passed, 0 failed, 0 skipped`)
- `node .opencode/skill/system-spec-kit/scripts/tests/test-subfolder-resolution.js` -> PASS (`32 passed, 0 failed, 0 skipped`)
- `.opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-combined-bug-fixes` -> FAIL (pre-existing spec-doc integrity refs to missing `hooks/README.md`, out of scope)

## Follow-up Risks

- Spec validation still fails because `checklist.md` and `tasks.md` reference missing `hooks/README.md`; this task did not modify spec docs by instruction.
