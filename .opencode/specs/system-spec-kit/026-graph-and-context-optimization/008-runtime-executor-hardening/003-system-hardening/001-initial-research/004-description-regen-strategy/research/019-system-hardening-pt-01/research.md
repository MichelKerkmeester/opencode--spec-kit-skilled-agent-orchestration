---
title: "...03-system-hardening/001-initial-research/004-description-regen-strategy/research/019-system-hardening-pt-01/research]"
description: "This packet tested whether description.json regeneration is actually deleting meaningful packet-local metadata and, if so, what the smallest safe repair should be. The investiga..."
trigger_phrases:
  - "system"
  - "hardening"
  - "001"
  - "initial"
  - "research"
  - "019"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/003-system-hardening/001-initial-research/004-description-regen-strategy/research/019-system-hardening-pt-01"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["research.md"]
---
# Description Regen Strategy Synthesis

## Executive Summary

This packet tested whether `description.json` regeneration is actually deleting meaningful packet-local metadata and, if so, what the smallest safe repair should be. The investigation combined runtime-path inspection, a live audit of all 86 `description.json` files in the 026 tree, comparison against the earlier 018 research conclusions, and a final implementation-readiness pass against the concrete TypeScript write surfaces.

The result is now stable: the live system already behaves like a field-level merge model, but the contract is implicit and split across two lanes. Schema-valid files currently survive refresh because `getDescriptionWritePayload()` in `folder-discovery.ts` merges existing data with canonical overrides, while schema-invalid-but-parseable files survive through the 018 R4 `mergePreserveRepair()` helper. That means the problem is no longer "rich metadata is broadly wiped"; it is "preservation semantics are real but under-specified, duplicated, and partially accidental."

The recommended implementation is therefore to formalize one policy, not redesign storage. Introduce a shared `description.json` schema around the existing `FolderDescription`, `PerFolderDescription`, and `LoadResult` surfaces, route both the schema-valid and schema-error lanes through one merge helper, and preserve unknown non-reserved top-level keys as explicit passthrough for this rollout. Rollout order should be schema first, unified merge second, targeted regen/audit third, with `007/008/009/010` root-doc remediation kept separate because those packet roots fail before merge logic can even run.

The implementation handoff should move to a dedicated 019-system-hardening child such as `019-system-hardening/003-description-regen-hardening`, while sibling `001` continues to own the save-lineage wrapper fix and validator sequencing in `002-canonical-save-hardening`. There is no strategy conflict between the packets: `001` defines the structural packet-root remediation and validator rollout boundaries, while `004` supplies the description-regeneration contract needed before a full regen/audit sweep can safely run.

## Field Catalogue

### Canonical derived fields

- `specFolder`
- `specId`
- `folderSlug`
- `parentChain`
- `lastUpdated`

These should always be regenerated from packet structure or save-time context.

### Canonical fields derived from authored packet docs

- `description`
- `keywords`

These are authored indirectly through `spec.md` content or explicit CLI input, but once the generator runs they are canonical refresh outputs rather than packet-local preserved overrides.

### System tracking fields

- `memorySequence`
- `memoryNameHistory`

These must survive writes but remain system-owned, not free-form authored metadata.

### Known authored optional fields

- `title`
- `type`
- `trigger_phrases`
- `path`

These are the live rich-field surface the implementation must preserve intentionally.

### Unknown extension keys

- Non-reserved top-level keys outside the known authored set

Current runtime behavior already preserves them for schema-valid files. The implementation choice is whether to formalize that as a supported contract or replace it with a heavier authored-bag redesign.

### Missing classification in the current system

The current path lacks one shared schema that explicitly says which fields are:

- canonical reserved
- tracking
- known authored optional
- unknown passthrough

That missing classification is the root architectural gap.

## Rich File Audit

### Reference versus live count

- Earlier Phase 018 material cited 29 rich files.
- Iteration 002 found 28 rich files in the live tree.
- The difference looks like stale prior counting, not a new regression.

### Distribution

- Implementation packets: 27 rich files out of 416
- Research packets: 0 rich files out of 22
- Archived packets: 1 rich file out of 179

### Observed field prevalence

- `title`: 28 files
- `type`: 12 files
- `trigger_phrases`: 5 files
- `path`: 6 files
- custom extra top-level keys: 1 archived file

### Pattern summary

- Research packets are currently canonical-only.
- Rich descriptions are concentrated in implementation and coordination packets.
- The authored field set is narrow and legible rather than sprawling.
- Unknown custom keys are rare, not a dominant live pattern.
- Current normal regeneration is already more preservation-friendly than the initial generator-only reading suggested.
- Parse-error files remain destructive by necessity because there is no safe object to preserve.
- `007/008/009/010` are not merge-policy evidence because default generation fails before merge logic runs.

### Net audit conclusion

The live tree does not show broad deletion of authored rich fields during ordinary schema-valid regeneration. The real defect is that preservation works mostly because of permissive implementation details rather than because the contract names authored fields explicitly.

## Strategy Comparison Matrix

| Strategy | Migration Cost | Reliability | Complexity | Backward Compatibility | Assessment |
| --- | --- | --- | --- | --- | --- |
| Opt-in regen flag | Medium | Mixed | Low to medium | Medium | Useful as a safety valve, but correctness depends on callers remembering to use it. |
| Hash-based change detection | Medium to high | Medium | Medium to high | Medium | Better as a churn guard than as the primary preservation model. |
| Schema-versioned authored layer | High | Very high | High | High if additive | Architecturally clean, but much heavier than the live evidence justifies. |
| Field-level merge policy | Medium | High | Medium | High | Best fit for the current runtime shape and the smallest explicit fix. |

### Why field-level merge policy ranks first

- The live system already behaves like a field-level preservation model.
- The authored field surface is small enough to formalize without redesigning storage.
- Backward compatibility matters more here than conceptual purity.
- The two existing preservation branches can be unified instead of replaced.

## Recommended Strategy
Adopt **field-level merge policy** as the implementation direction.

### Core contract

- Canonical reserved fields always win on regen.
- Tracking fields remain system-owned and survive refreshes through explicit logic.
- Known authored optional fields are preserved intentionally.
- Unknown non-reserved top-level keys are preserved as passthrough for this rollout.
- Parse-error files remain replacement-only.

### Unknown extension keys: final decision
Keep them as explicit top-level passthrough for now.

### Why this is the right near-term choice

- It matches observed runtime behavior.
- It preserves backward compatibility for all existing file shapes.
- The live custom-key footprint is tiny.
- It avoids broad read/write-path redesign outside the current packet goal.

### Why not migrate immediately to an authored metadata bag

- The evidence does not justify the migration cost.
- The problem is contract ambiguity, not custom-key sprawl.
- A storage-model split would expand scope from policy clarification into broader metadata architecture.

### Future option
If custom-key usage grows materially later, a named authored metadata bag remains a viable follow-on refactor. It is not required to fix the current regeneration contract safely.

## 018 R4 Integration Plan
### What 018 R4 already shipped

- Parse errors and schema errors are now distinguished.
- Schema-invalid-but-parseable files go through a merge-preserving repair helper.
- That helper already encodes the same semantic rule this packet recommends: canonical fields win while authored data survives where safe.

### What remains unfinished

- Schema-valid files and schema-error files still preserve data through different code paths.
- The preservation intent is duplicated rather than centralized.
- The path still lacks one shared schema that defines field classes explicitly.

### Integration conclusion
Phase 018 R4 is not a competing strategy. It is already the schema-error half of the recommended field-level merge model.

### Integration steps

1. Keep the 018 repair behavior as the semantic baseline.
2. Introduce a shared per-folder description schema.
3. Route schema-valid preservation through the same merge-policy helper used by the schema-error lane.
4. Leave parse-error fallback replacement unchanged.

### Expected result
- one policy
- one merge helper
- one field classification model
- fewer silent differences between valid and repair flows

## Interaction With Sub-packet 001 (SSK-RR-2)

| Topic | `001-canonical-save-invariants` recommendation | `004-description-regen-strategy` recommendation | Conflict? |
| --- | --- | --- | --- |
| `007/008/009/010` missing-root-spec defect | Repair packet-root docs as a separate remediation wave before final hard validator enforcement | Keep root-doc remediation outside the merge-policy rollout because default regen cannot reach merge without root `spec.md` | No conflict; same defect, same separation principle |
| Save-path sequencing | Land wrapper/runtime hardening first in `002-canonical-save-hardening`; validator hardening follows after backfill/remediation | Land description schema + unified merge helper before any regen/audit sweep | No conflict; the two packets harden different layers |
| Regen/audit readiness | Do not finalize hard enforcement while structural exceptions remain | Do not run the description regen/audit as the primary proof until merge semantics are explicit | No conflict; both require prerequisites before broad rollout |
| Implementation ownership | `001` points to `019-system-hardening/002-canonical-save-hardening` for save-lineage and validator work | `004` should hand off into a sibling implementation child such as `019-system-hardening/003-description-regen-hardening` | No conflict; separate implementation children are cleaner than combining the scopes |

### Net interaction conclusion

`001` and `004` reinforce each other rather than compete. `001` owns wrapper persistence, packet-root repair, and validator rollout timing. `004` owns the `description.json` field-classification contract and merge unification needed before a description-focused regen pass is trustworthy. The shared finding about `007/008/009/010` is aligned: those roots should be repaired separately, not folded into the merge-helper change set.

## Implementation Spec
### Schema

Introduce a shared per-folder description schema for the regeneration path, centered on the existing runtime types and replacing the current manual structural checks with one explicit parse contract.

#### TypeScript surfaces to keep authoritative

- `FolderDescription`
- `PerFolderDescription`
- `LoadResult`

#### Zod additions to introduce

- `FolderDescriptionSchema`
- `PerFolderDescriptionSchema`
- `DescriptionFileSchema` as the passthrough-capable top-level validator used by `loadExistingDescription()` and `getPerFolderDescriptionIssues()`

Recommended location:

- new `.opencode/skill/system-spec-kit/mcp_server/lib/description/schema.ts`

Recommended shape:

- `FolderDescriptionSchema = z.object({ specFolder, description, keywords, lastUpdated })`
- `PerFolderDescriptionSchema = FolderDescriptionSchema.extend({ specId, folderSlug, parentChain, memorySequence, memoryNameHistory }).passthrough()`
- canonical reserved fields remain explicit in schema and merge policy
- unknown non-reserved top-level keys remain allowed through `.passthrough()`

#### Required canonical fields

- `specFolder: string`
- `description: string`
- `keywords: string[]`
- `lastUpdated: string`
- `specId: string`
- `folderSlug: string`
- `parentChain: string[]`
- `memorySequence: number`
- `memoryNameHistory: string[]`

#### Optional authored fields

- `title?: string`
- `type?: string`
- `trigger_phrases?: string[]`
- `path?: string`

#### Unknown key behavior

- allow passthrough for non-reserved top-level keys
- keep reserved-field overwrite semantics canonical

#### Normalization defaults

- `parentChain = []`
- `memorySequence = 0`
- `memoryNameHistory = []`

### Merge policy helper

The shared helper should:

1. accept canonical overrides and an existing parseable object
2. preserve known authored fields explicitly
3. preserve unknown non-reserved top-level keys
4. reapply canonical reserved fields last so they always win
5. keep `memoryNameHistory` on its current dedicated refresh path

Concrete implementation target:

- expand or replace `mergePreserveRepair()` in `.opencode/skill/system-spec-kit/mcp_server/lib/description/repair.ts`
- route both the schema-valid lane and the schema-error lane in `getDescriptionWritePayload()` through that same helper
- keep parse-error fallback replacement unchanged

### Parse modes

#### Schema-valid file

- use the shared helper
- eliminate spread-order accident as the implicit contract

#### Schema-error but parseable file

- use the same shared helper
- repair canonical structure while keeping valid authored data where possible

#### Parse-error file

- replace with canonical payload
- do not claim authored preservation guarantees

### Migration path for the 86 existing files

#### Driver

- use the existing generator entrypoint: `.opencode/skill/system-spec-kit/scripts/spec-folder/generate-description.ts`
- operational surface at rollout time is the compiled CLI: `generate-description.js`
- run the sweep as a 026-scoped batch over the already-audited 86 `description.json` files

#### Atomicity and retry model

- Per-file writes already have atomic replace semantics through `savePerFolderDescription()` temp-file-plus-rename behavior in `folder-discovery.ts`.
- The migration therefore does **not** need one giant cross-tree transaction.
- The correct guarantee is: each file update is atomic, and the 86-file sweep is idempotent and resumable.

#### Expected file classes

- 58 canonical-only files should remain effectively unchanged apart from normal canonical refresh fields.
- 28 rich files should become explicitly policy-supported instead of implicitly preserved.
- `007/008/009/010` remain structural exceptions until root docs exist, because default spec-driven regen returns `null` before merge.

#### Safe rollout sequence

1. Land schema + merge-helper code first.
2. Run a dry inventory on all 86 files and confirm only the expected 28 rich files carry authored optional data.
3. Run the scoped regen sweep via `generate-description.js`.
4. Diff/audit the results and manually isolate only structural outliers.

### Rollout order
1. shared schema
2. unified merge helper
3. targeted regen/audit pass
4. separate root-doc remediation for `007/008/009/010`

### Why this order is correct

- The schema defines the policy boundary.
- The merge helper depends on that policy boundary.
- The audit should verify a stable contract, not a moving target.
- `007/008/009/010` are blocked before merge, so bundling them would only blur scope.

### Validation fixtures

Primary test files:

- `.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery-integration.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/description/repair.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/description/repair-specimens.vitest.ts`

Case list:

1. schema-valid rich file with `title`, `type`, `trigger_phrases`, and `path`
2. schema-valid file with unknown custom top-level key
3. canonical conflict case where reserved fields were manually changed
4. schema-error but parseable rich file
5. malformed known optional field such as wrong-typed `trigger_phrases`
6. parse-error file
7. explicit `--description` flow without `spec.md`
8. default regen without `spec.md`

### Expected audit outcomes

- canonical-only files stay stable except for normal refreshes
- rich implementation files retain authored fields through explicit contract
- schema-invalid parseable files repair without dropping good authored data
- parse-error files replace safely
- `007/008/009/010` still require separate root-doc remediation before default regen can succeed

### Likely file list

- `.opencode/skill/system-spec-kit/mcp_server/lib/description/schema.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/description/repair.ts`
- `.opencode/skill/system-spec-kit/scripts/spec-folder/generate-description.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery-integration.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/description/repair.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/description/repair-specimens.vitest.ts`
- fixture files under `.opencode/skill/system-spec-kit/mcp_server/tests/description/fixtures/`

### Backward compatibility

- Existing schema-valid files keep their current behavior, but preservation stops depending on object-spread order.
- Existing schema-error-but-parseable files keep the 018 R4 repair-preserving outcome, now through the same helper as valid files.
- Existing parse-error files stay replacement-only; this packet does not widen guarantees there.
- The 86-file migration is additive for the 58 canonical-only files and explicit-contract hardening for the 28 rich files.
- Unknown non-reserved top-level keys remain supported as passthrough for this rollout, which preserves the lone archived custom-key outlier without forcing a storage redesign.

## Open Questions
- Should preserved unknown top-level keys emit warnings so future custom metadata growth is visible before it becomes a migration problem?
- Should the shared schema derive the TypeScript type directly, or should the existing interface remain manually synchronized?
- Should explicit `--description` writes use the exact same merge helper surface as default spec-driven regen, or retain a narrower operator-intent mode?

## Out Of Scope
- Root-document remediation for `007/008/009/010`
- Packet-root identity normalization outside this description contract
- Hash-based regen suppression as the primary solution
- A new authored metadata bag or schema-versioned storage split
- Broad consumer redesign outside the regeneration/write path

## Final Conclusion
The packet no longer needs another round of strategy discovery. The answer is now stable:

- field-level merge policy is the right implementation model
- Phase 018 R4 should be absorbed, not replaced
- unknown extension keys should remain top-level passthrough for this rollout
- rollout ordering is schema first, merge second, audit third, and root-doc remediation separate

The next meaningful step is implementation, not more policy search. The cleanest handoff is a dedicated implementation child such as `019-system-hardening/003-description-regen-hardening`, with sibling `002-canonical-save-hardening` left to the wrapper/save-lineage work already scoped by `001`.
