# Iteration 002

## Focus

Q2: `description.json` auto-regeneration preserve-field gaps. Inspect why later regeneration can advance packet freshness surfaces without preserving or refreshing richer `description.json` content, especially on the small sibling folders `007`, `008`, `009`, `010`, `014`, `015`, and `017`.

## Actions Taken

1. Read the deep-research loop contract, prior iteration narrative, and current JSONL state to keep this iteration aligned with the packet-local workflow.
2. Located the actual regeneration entrypoint at `.opencode/skill/system-spec-kit/scripts/spec-folder/generate-description.ts` and inspected the script-level write path.
3. Enumerated the exact Phase 026 sibling directories that match the shorthand targets from the prompt, then extracted their current `description.json` payload shape.
4. Compared those same folders' `graph-metadata.json` derived freshness fields to see whether the tree records any explicit description-sync provenance.

## Findings

### P1. `generate-description.ts` is a whole-object rewrite surface, not a merge-preserving refresh path

Reproduction path:
- Read `.opencode/skill/system-spec-kit/scripts/spec-folder/generate-description.ts`.
- Observe that the script always ends in `savePerFolderDescription(desc, folderPath)`.
- In the explicit `--description` path it only loads the prior file to carry forward `memorySequence` and `memoryNameHistory`; all other fields are rebuilt from scratch.
- In the default path it does not load the existing file at all before delegating to `generatePerFolderDescription(folderPath, basePath)`.

Impact:
- Any richer hand-authored `description.json` fields outside the generator's output model are exposed to silent overwrite/drop on regeneration.
- Script-level evidence already explains the preserve-field gap even before inspecting downstream helpers: there is no merge contract at the CLI boundary.

### P1. The small sibling folders are already converging to the same minimal `description.json` shape, which makes overwrite damage hard to detect after the fact

Current disk state for `007`, `008`, `009`, `010`, `014`, `015`, and `017` shows the same pattern:
- non-empty `description`
- zero-length `implementationSummary`
- zero-length `scope`
- zero-length `keyFiles`
- zero-length `tags`

Representative examples:
- `007-release-alignment-revisits/description.json`: `descriptionLen=470`, all richer arrays/sections empty
- `014-memory-save-rewrite/description.json`: `descriptionLen=418`, all richer arrays/sections empty
- `017-review-findings-remediation/description.json`: `descriptionLen=578`, all richer arrays/sections empty

Impact:
- Later auto-regeneration can look "successful" because `title`, `description`, and `lastUpdated` still exist, while richer metadata has already collapsed to a stubby baseline.
- This particularly affects the tiny phase packets named in the prompt because their current description files already provide no secondary evidence that richer content ever survived regeneration.

### P2. Graph freshness can move independently because these folders do not record any successful description-sync provenance

Reproduction path:
- Inspect the same sibling set's `graph-metadata.json`.
- `007` through `010` expose `derived.last_save_at = 2026-04-13T16:01:59Z`, but `derived.last_description_sync_at = null`.
- `014` shows `derived.last_save_at = 2026-04-15T16:45:28Z`, `derived.last_description_sync_at = null`.
- `017` shows `derived.last_save_at = 2026-04-17T14:20:00Z`, `derived.last_description_sync_at = null`.
- `015` is even looser: `status = "in-progress"` but `derived.last_save_at = null` and `derived.last_description_sync_at = null`.

Impact:
- The tree currently has no durable proof that a given graph refresh also refreshed `description.json`.
- That leaves the Phase 017/H-56-1 aftermath vulnerable to two different failure modes:
  1. graph freshness advances while description freshness stays stale
  2. description is regenerated but audits cannot distinguish a safe same-pass refresh from a later overwrite

### P2. The current generator contract is biased toward `spec.md` summarization, not preservation of packet-specific metadata

Script-level evidence:
- The module header documents only two input modes: `--description` or "Otherwise reads `spec.md` via `generatePerFolderDescription()`."
- No path mentions `implementation-summary.md`, existing `scope`, existing `keyFiles`, existing `tags`, or a patch/merge mode for the prior JSON.

Inference:
- For short phase packets, where `spec.md` often carries only the packet headline and a narrow scope, repeated regeneration naturally recreates a concise summary but not the richer operational metadata the file may have accumulated later.

Mitigation candidates:
- Add a merge-preserving mode that treats existing non-empty fields (`scope`, `keyFiles`, `tags`, `implementationSummary`) as authoritative unless the caller explicitly requests replacement.
- Stamp `graph-metadata.derived.last_description_sync_at` whenever description regeneration succeeds, so freshness audits can distinguish "graph-only refresh" from "graph + description refresh."
- Add a regression fixture using one of the small Phase 026 sibling folders with hand-authored rich fields, then assert they survive `generate-description.ts` regeneration.

## Questions Answered

- Q2. Root causes + mitigation options for `generate-description.js` auto-regen overwriting hand-authored rich content: partially answered.
  The primary cause is now clear at the script boundary: regeneration rewrites from a generated object instead of merging the existing `description.json`, and the current freshness metadata does not record description-sync success. What remains is confirming the exact downstream helper behavior inside `generatePerFolderDescription()` / `savePerFolderDescription()`, but the preserve-field risk is already evidenced by the caller contract and the current stub-shaped outputs.

## Questions Remaining

- Does `savePerFolderDescription()` serialize only the generated object, or does it contain any hidden field-level preservation beyond what the script exposes?
- Is the empty `implementationSummary` / `scope` / `keyFiles` / `tags` pattern on these sibling folders caused purely by generator design, or also by sparse `spec.md` source content?
- Which runtime paths besides `generate-description.ts` can move `graph-metadata.json.derived.last_save_at` without updating `description.json.lastUpdated`?
- Should Phase 019 treat this as a preservation bug in the generator, a provenance gap in graph metadata, or both?

## Next Focus

Q3: code-graph readiness vocabulary completeness. Inspect whether all `SharedPayloadTrustState` values are actually reachable from each of the sibling handlers, and separate live readiness vocabulary from dead or documentation-only enum states.
