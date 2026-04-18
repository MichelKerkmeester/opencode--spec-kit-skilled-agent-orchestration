# Iteration 028

## Focus

Q2 follow-up: inspect `generate-description.ts`, the `folder-discovery.ts` description helpers, and the canonical-save block in `workflow.ts` to determine exactly which `description.json` fields are preserved, which are recomputed, and where richer hand-authored content can still be silently replaced during auto-regeneration.

## Actions Taken

1. Read the live `generate-description.ts` CLI wrapper to separate the explicit `--description` path from the default `spec.md`-driven regeneration path.
2. Read `mcp_server/lib/search/folder-discovery.ts` to trace `generatePerFolderDescription()`, `loadPerFolderDescription()`, `savePerFolderDescription()`, and `extractDescription()`.
3. Read the canonical-save `description.json` update block in `scripts/core/workflow.ts` plus the metadata/backfill tests to identify when the save path mutates an existing file versus rebuilding a fresh record.

## Findings

### P1. Canonical save preserves rich authored content only while `description.json` remains structurally valid; the recovery branch rebuilds a fresh minimal record and drops everything else

Reproduction path:
- Read `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` around the `ctxFileWritten` description-tracking block.
- Read `.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts` around `loadPerFolderDescription()` and `generatePerFolderDescription()`.

Evidence:
- The canonical-save path first calls `loadPerFolderDescription(specFolderAbsolute)` and only enters regeneration when that load returns `null`.
- `loadPerFolderDescription()` accepts only the core `PerFolderDescription` shape: `specFolder`, `description`, `keywords`, `lastUpdated`, optional path identity fields, and the two tracking fields. Any missing required key or wrong type causes a full `null` return.
- When load succeeds, the workflow mutates the parsed object in place by updating only `memorySequence`, `memoryNameHistory`, and `lastUpdated`, then writes the whole object back. That means unknown extra keys and richer authored `description` text survive this path.
- When load fails, the workflow regenerates through `generatePerFolderDescription()`, which returns a fresh object containing only `specFolder`, `description`, `keywords`, `lastUpdated`, `specId`, `folderSlug`, `parentChain`, `memorySequence`, and `memoryNameHistory`.

Why this matters:
- There is no general authored-content preservation contract on the regen path. The contract is only "preserve existing object if it parses."
- A hand-authored `description.json` can therefore keep richer content indefinitely until a missing file, malformed JSON, or schema drift trips the recovery branch, at which point the file is silently normalized down to the minimal generated shape.

Risk-ranked remediation candidates:
- Phase 019 P1: distinguish `missing` from `corrupt/invalid` in logs and emit an explicit preserve-risk warning before any overwrite.
- Phase 019 P1: add a merge-style regen path that starts from the parsed raw JSON object when possible, preserving unknown keys even during schema upgrade / repair.
- Phase 019 P2: add a non-destructive quarantine path (`description.json.bak` or in-memory diff report) before replacing invalid metadata.

### P1. The regenerated `description` field is intentionally narrow: first heading or first sentence from `spec.md`, truncated to 150 chars, not a rich summary surface

Reproduction path:
- Read `.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts` around `extractDescription()` and `generatePerFolderDescription()`.
- Read `.opencode/skill/system-spec-kit/scripts/spec-folder/generate-description.ts` for the explicit `--description` path.

Evidence:
- `extractDescription()` returns the first `#` heading if present before it even considers "Problem Statement", "Problem & Purpose", "Purpose", or "Overview" sections.
- If no heading is used, the extractor takes the first non-heading sentence and truncates it to `MAX_DESCRIPTION_LENGTH = 150`.
- The explicit `--description` path in `generate-description.ts` also slices the provided description text to 150 chars.
- Regeneration recomputes `keywords` from the newly generated short description rather than preserving existing richer keywords.

Why this matters:
- If a richer authored summary was intentionally stored in `description.json.description`, any regeneration flattens it into a title-like or first-sentence snippet.
- This is not just a timestamp refresh issue; it is a semantic downgrade of the packet summary surface that can reduce search quality and human readability.

Risk-ranked remediation candidates:
- Phase 019 P1: add an explicit authored-description field or provenance flag so generated snippets and curated summaries are not stored in the same slot.
- Phase 019 P1: prefer a dedicated summary section in `spec.md` over the first heading when regenerating, so fallback content is less title-shaped.
- Phase 019 P2: preserve prior `keywords` when the regenerated description is shorter or obviously lower-information than the existing one.

### P2. The preserve-field contract is narrower than current tests imply: backfill tests protect valid existing files, but they do not cover invalid-yet-salvageable authored metadata

Reproduction path:
- Read `.opencode/skill/system-spec-kit/scripts/tests/backfill-research-metadata.vitest.ts`.
- Read `.opencode/skill/system-spec-kit/scripts/tests/workflow-canonical-save-metadata.vitest.ts`.

Evidence:
- Backfill tests assert that an existing valid `description.json` with custom text such as `"Keep me"` stays untouched when the file already exists.
- Canonical-save metadata tests assert `lastUpdated` monotonicity and memory-tracking updates, but do not test preservation of richer authored content across the regen path.
- No inspected test covers the case where `description.json` is syntactically readable but partially invalid, schema-evolved, or richer than the generated fallback surface.

Why this matters:
- The current suite proves the happy path, not the failure-to-repair path that actually threatens authored summaries.
- Phase 019 can land a focused regression harness here without needing a broad metadata redesign first.

Risk-ranked remediation candidates:
- Phase 019 P1: add a regression test where a partially invalid `description.json` contains richer description text plus extra keys, then assert repair preserves them where safe.
- Phase 019 P2: add a test that distinguishes "missing file" from "invalid file" so replacement behavior is intentional and observable.

## Questions Answered

- Q2 is now materially narrowed. Rich authored `description.json` content is not normally overwritten on every canonical save.
- The destructive behavior comes from regeneration paths, not from the steady-state load-mutate-save path.
- On regeneration, only `memorySequence` and `memoryNameHistory` are preserved from the previous file; the main summary payload is recomputed from `spec.md` and path structure.
- The recomputed `description` surface is intentionally short and can collapse a curated summary into a heading or first sentence.

## Questions Remaining

- Which real operator/runtime paths currently trigger the `!existing` recovery branch most often: malformed edits, stale schema variants, or file-missing backfills?
- Should Phase 019 treat authored-description preservation as a schema split problem (`generatedDescription` vs `authoredDescription`) or as a softer merge-on-repair policy?
- Are there checked-in `description.json` examples in the 026 tree where extra authored keys already exist and would be lost by the current regen path?

## Next Focus

Stay on Q2 for one more pass, but shift from code-path inspection to live-corpus impact. Search the 026 tree for hand-authored or schema-extended `description.json` examples, then estimate how many packets are currently one invalid-edit away from summary flattening during the next auto-regeneration.
