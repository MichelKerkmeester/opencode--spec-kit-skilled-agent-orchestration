# Iteration 013

## Focus

Q2: preserve-field analysis for `generate-description.js`. Determine the exact overwrite paths, which hand-authored `description.json` fields are currently lost, and the safest mitigation pattern that preserves authored metadata without blocking canonical regeneration.

## Actions Taken

1. Re-anchored on the active deep-research context in `deep-research-strategy.md`, iteration 012, and the live state log to confirm Q2 was the next highest-priority unanswered question.
2. Read the generator implementation in `.opencode/skill/system-spec-kit/scripts/spec-folder/generate-description.ts` and the shared MCP helpers in `.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts`.
3. Traced all reachable regeneration and repair call sites, including `generate-description.js`, `generateFolderDescriptions()`, and `repairStaleDescriptions()`, to identify where a fresh object is written back over existing metadata.
4. Sampled rich real-world `description.json` files under `026-graph-and-context-optimization/` to compare the authored field set against the generator's narrow `PerFolderDescription` contract.
5. Read downstream extraction code in `.opencode/skill/system-spec-kit/scripts/extractors/spec-folder-extractor.ts` and canonical-save behavior in `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` to distinguish safe snapshot mutation from destructive regeneration.

## Findings

### P1. `generate-description.js` overwrites by reconstruction, not by merge, so any rich hand-authored fields outside the narrow `PerFolderDescription` contract are dropped

Reproduction path:
- Read `.opencode/skill/system-spec-kit/scripts/spec-folder/generate-description.ts`.
- Read `.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:39-41` and `:636-757`.
- Compare the generated object shape with a rich packet file such as `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/017-review-findings-remediation/002-cluster-consumers/description.json`.

Evidence:
- `PerFolderDescription` only defines `specFolder`, `description`, `keywords`, `lastUpdated`, `specId`, `folderSlug`, `parentChain`, `memorySequence`, and `memoryNameHistory`.
- Both generator branches construct a brand-new object literal and preserve only `memorySequence` and `memoryNameHistory` from the existing file before calling `savePerFolderDescription(...)`.
- `savePerFolderDescription(...)` serializes exactly the provided object, so omitted keys disappear on write.
- Real packet metadata includes many extra authored fields that are outside the generator contract, including `title`, `type`, `trigger_phrases`, `kind`, `status`, `level`, `parentPacket`, `phaseStage`, `wave`, `waveScope`, and `qualityGate`.

Why this matters:
- The overwrite is deterministic, not accidental. Any reuse of `generate-description.js` on a rich packet rewrites the file down to the canonical minimal subset plus the two memory tracking fields.
- This means "repair metadata" and "refresh description" are currently unsafe for authored packet metadata even when the underlying `spec.md` is healthy.

Risk-ranked remediation candidates:
- P1: change regeneration to preserve unknown existing top-level keys by loading the raw JSON object, overwriting only the canonical generated fields, and then writing the merged result back.
- P1: keep the generated field list explicit and small (`specFolder`, `description`, `keywords`, `lastUpdated`, `specId`, `folderSlug`, `parentChain`, `memorySequence`, `memoryNameHistory`) so preservation cannot silently override canonical values.

### P1. The dangerous overwrite path is reachable from automatic stale-description repair, not just the standalone CLI

Reproduction path:
- Read `.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:470-556`.
- Search for `generatePerFolderDescription(` and `savePerFolderDescription(` across the repo.

Evidence:
- `generateFolderDescriptions()` performs best-effort on-disk repair when `description.json` exists but is stale, corrupt, or blank.
- `repairStaleDescriptions()` also regenerates stale files through the same `generatePerFolderDescription(...)` plus `savePerFolderDescription(...)` path.
- Both flows rewrite the entire file with the narrow generator output instead of a merge-preserving patch.

Why this matters:
- The bug is broader than "someone manually ran the helper." Normal discovery and maintenance flows can silently scrub rich authored metadata whenever staleness repair is triggered.
- That makes this a Phase 019-worthy safety issue because the overwrite can happen during routine cache/discovery maintenance, not just deliberate operator surgery.

Risk-ranked remediation candidates:
- P1: immediately narrow auto-repair so it only backfills missing files and blank descriptions until a preservation merge exists.
- P1: treat stale-but-parseable rich `description.json` files as read-only for now; surface a warning instead of rewriting them.
- P2: add logging that explicitly says "stale description left untouched because preservation-safe regen is unavailable" to keep the operator signal honest.

### P1. Canonical `/memory:save` is comparatively safe because it mutates the loaded snapshot in place, which preserves extra keys already on disk

Reproduction path:
- Read `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1334-1415`.
- Compare with `.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:699-757`.

Evidence:
- The canonical save path loads the existing `description.json`, increments `memorySequence`, appends to `memoryNameHistory`, updates `lastUpdated`, and saves the same object back.
- Because the snapshot originates from parsed JSON, extra authored keys remain present during that mutation path.
- The regression surface is therefore regeneration and stale-repair, not the normal canonical-save writer.

Why this matters:
- The safest mitigation is not a broad rewrite of all description handling. The destructive behavior is concentrated in the regen helpers.
- That gives Phase 019 a low-blast-radius fix: patch the generator/repair path without destabilizing the canonical save flow that already preserves extra keys in practice.

Risk-ranked remediation candidates:
- P1: introduce a shared helper such as `regeneratePerFolderDescriptionPreservingFields(...)` and use it from both the CLI and repair paths.
- P2: add a regression test that seeds a rich `description.json`, runs regen, and asserts authored keys like `title`, `status`, `level`, and nested objects survive.

### P2. Downstream consumers already rely on some rich `description.json` fields, so the loss is behavioral, not merely cosmetic

Reproduction path:
- Read `.opencode/skill/system-spec-kit/scripts/extractors/spec-folder-extractor.ts:302-389`.
- Compare with rich packet examples under `026-graph-and-context-optimization/017-review-findings-remediation/`.

Evidence:
- `extractSpecFolderContext(...)` reads `description.title`, `description.status`, `description.level`, `description.name`, and related metadata into synthesized summary/observation output.
- Rich packet descriptions use exactly those fields to express packet identity, status, and execution semantics.
- The current generator contract does not preserve those fields.

Why this matters:
- A stale-repair overwrite can degrade session/context extraction quality and erase machine-readable packet metadata that other tools already surface.
- This raises the priority above "metadata nice-to-have"; the loss changes the quality of spec-folder context reconstruction.

Risk-ranked remediation candidates:
- P2: document which `description.json` fields are canonical-generated versus operator-authored so future helpers do not collapse the schema by accident.
- P2: add a validation warning when a regen candidate contains rich authored keys that would be dropped by the current narrow writer.

## Questions Answered

- Q2 is answered: the root cause is that `generate-description.js` and the stale-description repair helpers rebuild a fresh minimal `PerFolderDescription` object and save it wholesale, preserving only memory tracking fields from the existing file.
- The rich fields currently at risk include at least `title`, `type`, `trigger_phrases`, `kind`, `status`, `level`, `parentPacket`, `phaseStage`, `wave`, `waveScope`, and `qualityGate`, plus any other authored top-level extensions.
- The safest mitigation pattern is a merge-preserving regen helper that overwrites only canonical generated fields while preserving unknown authored keys, combined with an immediate stopgap that disables stale rich-file auto-repair until that helper ships.

## Questions Remaining

- We still need to verify whether any other writers besides `generate-description` and `folder-discovery` perform full-object rewrites against `description.json`.
- It is still worth checking whether the preservation helper should preserve all unknown keys blindly or protect against a short denylist of deprecated/generated aliases.
- We have not yet quantified whether any existing operator playbooks intentionally rely on the current destructive regen behavior for schema cleanup.

## Next Focus

Move to Q3 and audit the 7 code-graph sibling handlers against the 8 `SharedPayloadTrustState` values to determine whether the current readiness vocabulary is fully reachable or partly dead-code/documentation-only.
