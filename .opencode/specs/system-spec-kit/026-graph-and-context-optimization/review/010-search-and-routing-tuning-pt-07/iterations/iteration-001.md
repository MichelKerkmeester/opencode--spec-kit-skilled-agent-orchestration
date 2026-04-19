# Iteration 1: Correctness on metadata-only continuity host selection

## Focus
Reviewed the metadata-only route in the live save handler, especially how `spec-frontmatter` resolves a target document once the router classifies a chunk as `metadata_only`. Cross-checked the code against the canonical save workflow and continuity-ladder docs to verify that the chosen host doc still matches the resume contract.

## Findings

### P0

### P1
- **F001**: Metadata-only routed saves can update a non-canonical frontmatter host — `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1054` — `resolveMetadataHostDocPath()` prefers the current non-memory document over `implementation-summary.md`, but the continuity contract says the primary `_memory.continuity` block lives in `implementation-summary.md` and the resume ladder reads that file first. Because `handleMemorySave()` accepts spec docs directly, a `metadata_only` routed save on `spec.md` or `tasks.md` can write continuity into a document the recovery ladder does not treat as canonical.

{"type":"claim-adjudication","findingId":"F001","claim":"Metadata-only routed saves can persist continuity onto a non-canonical host document that `/spec_kit:resume` does not read as authoritative.","evidenceRefs":[".opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1054",".opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2090",".opencode/skill/system-spec-kit/references/memory/save_workflow.md:167","AGENTS.md:52"],"counterevidenceSought":"I checked whether the current-doc shortcut only affects memory-file saves, but it explicitly triggers for any existing non-memory spec doc.","alternativeExplanation":"If operators only ever use memory files or direct manual continuity edits, impact is lower, but the tool surface still accepts spec-doc inputs and the routing helper can therefore violate the canonical host contract.","finalSeverity":"P1","confidence":0.93,"downgradeTrigger":"Downgrade if the continuity contract is updated to allow any spec doc frontmatter as a first-class `_memory.continuity` host."}

### P2

## Ruled Out
- Ordinary memory-file routed saves still land on `implementation-summary.md`, because the current-document shortcut only fires when the source is already a non-memory spec doc.

## Dead Ends
- No live mutation repro was run because this review was explicitly read-only on the target packet and runtime surfaces.

## Recommended Next Focus
Verify that the older phase-003 `packet_kind` and `save_mode` prompt regressions are actually closed in the current code before treating the remaining open issues as current-state findings.

## Assessment
- New findings ratio: 1.00
- Dimensions addressed: correctness, traceability
- Novelty justification: This was the first pass over metadata-only host selection and it surfaced a new P1 contract mismatch.
