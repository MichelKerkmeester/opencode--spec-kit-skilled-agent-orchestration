## Focus

Final Q2 closure pass: determine whether any current invalid-load callers can distinguish parse failure from schema failure, and test whether a repair-mode merge can be made deterministic without reintroducing stale-field drift.

## Actions Taken

1. Re-read the current strategy, iteration 029, and the relevant description-loading code paths to keep this pass narrowly scoped to Q2 closure rather than reopening corpus counting.
2. Read `mcp_server/lib/search/folder-discovery.ts` around `loadPerFolderDescription()` and `generatePerFolderDescription()` to verify how invalid `description.json` loads are classified and what fields regeneration recomputes versus preserves.
3. Read `scripts/spec-folder/generate-description.ts` and `scripts/core/workflow.ts` to inspect every currently visible invalid-load caller and confirm whether any branch distinguishes JSON parse failure from parseable-but-schema-invalid content.
4. Read `mcp_server/tests/slug-utils-boundary.vitest.ts` and `mcp_server/tests/folder-discovery-integration.vitest.ts` to confirm the tested behavior for corrupt, stale, and invalid tracking-field cases.
5. Inspected the live specimen `016-foundational-runtime/002-infrastructure-primitives/description.json` and compared its authored content to the generated fallback extracted from `spec.md` to judge whether a deterministic repair merge is realistic and what must be preserved.

## Findings

### P1. No current invalid-load caller can distinguish parse failure from schema failure; both collapse to the same regeneration branch

- `loadPerFolderDescription()` returns `null` both when `JSON.parse()` throws and when the parsed object fails structural validation.
- The currently visible callers only branch on truthiness:
  - `scripts/spec-folder/generate-description.ts` loads the file and, when the load is falsy, falls back to `generatePerFolderDescription()`.
  - `scripts/core/workflow.ts` does the same inside canonical save metadata refresh.
  - `mcp_server/lib/search/folder-discovery.ts` repairs stale or invalid cache entries through the same generated fallback path.
- The tests reinforce the collapse instead of separating it:
  - `slug-utils-boundary.vitest.ts` shows schema-invalid tracking values like `memorySequence: "5"` returning `null`.
  - `folder-discovery-integration.vitest.ts` repairs corrupt JSON and stale files through the same fallback-oriented discovery flow.

Why this matters:

- A parseable-but-schema-invalid file is materially different from unreadable JSON. The first still contains salvageable authored content; the second does not.
- Because current callers only see `null`, every invalid-load site is forced into the same lossy recovery policy.

Reproduction path:

- Take any parseable but schema-invalid `description.json`, for example by changing `memorySequence` from a number to a string.
- Run either `generate-description.ts`, canonical save metadata refresh in `workflow.ts`, or folder discovery repair.
- The caller cannot tell that the JSON body was parseable, so it regenerates from `spec.md` instead of repairing from the parsed raw object.

Risk-ranked remediation candidates:

- Phase 019 P1: replace the boolean-ish load contract with a richer result type such as `ok | parse_error | schema_error` plus the raw parsed payload when available.
- Phase 019 P1: add regression tests proving that parseable schema-invalid input does not get treated the same as unreadable JSON.

### P1. A deterministic repair-mode merge is feasible, but only for parseable schema-invalid files and only if canonical derived fields always win

- The live specimen `001-infrastructure-primitives/description.json` currently carries:
  - a 793-character authored description
  - 14 extra authored keys outside the generated contract
- The generated fallback description from `spec.md` is only `Specification: Phase 017 Wave A — Infrastructure Primitives`, which proves the current regeneration path would materially flatten both narrative richness and packet-control metadata.
- A deterministic repair merge is still possible if the algorithm is explicitly asymmetric:
  - always regenerate canonical derived fields from current source-of-truth inputs: `specFolder`, `specId`, `folderSlug`, `parentChain`, `lastUpdated`, and regenerated `keywords`
  - preserve authored extension keys only from the parseable raw JSON object
  - keep the richer description text when the parsed raw `description` is a non-empty string and is more informative than the generated fallback
  - preserve valid tracking data only when it passes narrow type checks; otherwise fall back to generated defaults

Why this avoids stale-field drift:

- The stale-field risk comes from reusing derived fields whose truth should come from the folder path or current `spec.md`.
- If the repair path always regenerates derived structural fields and only preserves authored narrative/extension data, repeated repairs converge on the same output for the same inputs.
- In other words, determinism is achievable only if preservation is restricted to authored payload, not to path-derived metadata.

Reproduction path:

- Compare the checked-in `001-infrastructure-primitives/description.json` with the fallback text extracted from its `spec.md`.
- The gap shows exactly what a repair merge must preserve: the rich authored description and packet-control keys, while still recomputing current canonical fields.

Risk-ranked remediation candidates:

- Phase 019 P1: introduce a parseable-invalid repair helper that receives both the raw parsed object and the freshly generated canonical description, then performs a selective merge with explicit precedence rules.
- Phase 019 P1: snapshot-test a real 017 schema-extended specimen through two consecutive repair passes and assert byte-stable output apart from expected timestamp movement.

### P2. Repair-mode merge cannot solve unreadable JSON, so the corrupt-file branch still needs explicit observability and a hard-regeneration contract

- When `JSON.parse()` fails, there is no trustworthy authored payload to merge.
- That means Phase 019 should not pretend one repair strategy covers both failure classes:
  - parseable schema-invalid files can be repaired with selective preservation
  - corrupt JSON files still require full regeneration from canonical sources
- The current system has weak operator visibility here because all invalid cases collapse to the same branch and the resulting write looks like an ordinary regeneration.

Risk-ranked remediation candidates:

- Phase 019 P2: emit an explicit repair reason (`schema_repair` vs `corrupt_regeneration`) in logs or status output wherever description regeneration happens.
- Phase 019 P2: add a warning surface when a corrupt file forces full regeneration so operators know authored content may have been lost.

## Questions Answered

- Q2: saturated enough for Phase 019 scoping.
- Q2 sub-question: can any current invalid-load caller distinguish parse failure from schema failure? No. All currently visible callers receive the same `null` contract.
- Q2 sub-question: can a repair-mode merge be deterministic without reviving stale-field drift? Yes, but only for parseable schema-invalid JSON and only if canonical derived fields always override preserved data.

## Questions Remaining

- Q1 remains open as a neighboring but distinct failure class: ordering skew and graph-only regeneration are not the same thing as Q2 authored-content loss.
- Q3, Q5, and the other untouched questions still hold more fresh-information potential than another Q2 pass.
- For implementation design, the only meaningful Q2 follow-on is choosing the exact result type and precedence rules for a parseable-invalid repair helper.

## Next Focus

For Phase 019+ scoping, treat Q2 as closed enough to draft remediation work:

- split invalid-load handling into `parse_error` vs `schema_error`
- add a deterministic parseable-invalid repair helper with explicit precedence rules
- add visibility for corrupt-file full regeneration

If another research loop were available, switch to Q3 or Q5 rather than spend more iterations on Q2 corpus counting.
