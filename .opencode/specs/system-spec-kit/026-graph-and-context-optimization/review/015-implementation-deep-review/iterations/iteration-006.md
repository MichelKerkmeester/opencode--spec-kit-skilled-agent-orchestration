# Iteration 6 - correctness - handlers

## Dispatcher
- iteration: 6 of 50
- dispatcher: cli-copilot gpt-5.4 high (code review v1)
- timestamp: 2026-04-16T05:26:29.337Z

## Files Reviewed
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/index.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/document-helpers.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/config/spec-doc-paths.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/atomic-index-memory.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-dedup-order.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-stats-edge.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/search-archival.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-quality-filter.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/pe-gating.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts`

## Findings - New
### P0 Findings
- None.

### P1 Findings
1. **`handleMemoryStats` advertises regex-based folder exclusion, but executes literal substring matching instead.**  
   Evidence: `memory-crud-stats.ts:78-95` validates `excludePatterns` as "regex pattern strings", and `tool-schemas.ts:231` documents regex behavior, but the filtering path at `memory-crud-stats.ts:186-195` lowercases each pattern and calls `folderName.includes(pattern)`. Valid regex input such as `^scratch$` or `^specs/.*/z_archive$` will never behave as promised, so callers get incorrect `topFolders` / `totalSpecFolders` output.

   ```json
   {
     "claim": "memory_stats.excludePatterns is documented and validated as regex input, but handleMemoryStats performs plain substring matching, so regex-shaped inputs silently produce wrong filtering results.",
     "evidenceRefs": [
       ".opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:78-95",
       ".opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:186-195",
       ".opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:231",
       ".opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-stats-edge.vitest.ts:120-142"
     ],
     "counterevidenceSought": "Checked for any later RegExp compilation or schema note downgrading excludePatterns to substring matching; none exists. The only test coverage uses the literal string 'scratch', which does not exercise regex semantics.",
     "alternativeExplanation": "The team may have intentionally simplified excludePatterns to case-insensitive substring matching and left the older regex wording behind.",
     "finalSeverity": "P1",
     "confidence": 0.98,
     "downgradeTrigger": "Downgrade if the public contract is explicitly changed everywhere to 'substring match' and callers are no longer told to supply regex patterns."
   }
   ```

2. **Routed canonical saves persist the target `document_type`, but keep the source file's lower `importance_weight`.**  
   In `create-record.ts:252-256`, the save path correctly derives `persistedDocumentType` from the routed target doc path; however `create-record.ts:274` still computes `importanceWeight` with `parsed.documentType`, and `document-helpers.ts:21-44` gives canonical docs higher weights than generic `memory`. A routed save from a memory artifact into `implementation-summary.md` / `decision-record.md` therefore stores a canonical `document_type` with a generic `0.5` weight instead of `0.6` / `0.8`, skewing ranking and any logic that depends on document-type-aware weighting.

   ```json
   {
     "claim": "createMemoryRecord underweights routed canonical saves because it derives persistedDocumentType from the target path but still calculates importanceWeight from the original parsed.documentType.",
     "evidenceRefs": [
       ".opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:252-275",
       ".opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:287-338",
       ".opencode/skill/system-spec-kit/mcp_server/lib/storage/document-helpers.ts:21-44",
       ".opencode/skill/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts:526-582",
       ".opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1147-1163",
       ".opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:2160-2163"
     ],
     "counterevidenceSought": "Looked for a later overwrite of importance_weight after insert, or a routed-save regression test that asserts persisted weight alignment with the canonical target type. Neither exists.",
     "alternativeExplanation": "The author may have intended canonical routing to change the stored document_type only, while leaving ranking weight anchored to the source memory artifact.",
     "finalSeverity": "P1",
     "confidence": 0.95,
     "downgradeTrigger": "Downgrade if downstream ranking intentionally ignores importance_weight for routed canonical docs, or if another post-insert path rewrites the stored weight to the target document type."
   }
   ```

3. **`handleMemorySearch` silently ignores `includeArchived: true` even though the public schema still promises archived results.**  
   The handler captures `includeArchivedRequested` at `memory-search.ts:645`, immediately hardcodes `const includeArchived = false` at `memory-search.ts:658`, passes that forced `false` into cache/pipeline configuration at `memory-search.ts:847-916`, then reports `includeArchivedCompatibility: 'ignored'` in the response at `memory-search.ts:1102-1107`. `tool-schemas.ts:169-172` still describes the flag as "Include archived memories in search results", so callers requesting archived memories cannot actually retrieve them.

   ```json
   {
     "claim": "memory_search exposes includeArchived as a live retrieval control in its public schema, but handleMemorySearch hardcodes the flag off and only reports it as ignored.",
     "evidenceRefs": [
       ".opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:169-172",
       ".opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:645-658",
       ".opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:847-916",
       ".opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1102-1107",
       ".opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:224-238",
       ".opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:269-285",
       ".opencode/skill/system-spec-kit/mcp_server/tests/search-archival.vitest.ts:107-119"
     ],
     "counterevidenceSought": "Searched for any code path that reenables archived retrieval when includeArchivedRequested is true; none exists. Existing tests explicitly lock in the compatibility-only/no-op behavior rather than validating archived result delivery.",
     "alternativeExplanation": "Gate D may have intentionally retired archived-memory retrieval while keeping the flag as a compatibility placeholder, but the public schema was not updated to match.",
     "finalSeverity": "P1",
     "confidence": 0.96,
     "downgradeTrigger": "Downgrade if the public contract is revised to mark includeArchived as deprecated/no-op compatibility rather than a behavior-changing search option."
   }
   ```

### P2 Findings
- None.

## Traceability Checks
- `memory_search` no longer behaves like its published tool schema for `includeArchived`; the runtime now self-reports that the flag is ignored, while the schema still describes it as a live retrieval control.
- Routed canonical save coverage proves target-file mutation (`memory-save-integration.vitest.ts:526-582`, `handler-memory-save.vitest.ts:1147-1163`) but never inspects persisted ranking metadata, which is why the target-type/weight split in `create-record.ts` survives.
- `memory_stats` coverage validates literal substring cases only (`handler-memory-stats-edge.vitest.ts:120-142`), leaving the documented regex contract untested.

## Confirmed-Clean Surfaces
- `handlers/save/atomic-index-memory.ts` correctly rolls back promoted files on rejected writes and on retry exhaustion; the rollback, retry, and shared-lock paths are coherently implemented and exercised by `tests/atomic-index-memory.vitest.ts:63-296`.
- `handlers/save/dedup.ts` correctly combines same-path unchanged detection with metadata equivalence and a secondary content check for cross-path hash matches, avoiding blind hash-only false positives (`dedup.ts:145-188`, `213-356`).
- `handlers/memory-save.ts` still performs content-hash dedup before the chunking branch, so large-file chunking does not bypass duplicate suppression (`memory-save.ts:2134-2143`, `2173-2183`; covered by `tests/memory-save-dedup-order.vitest.ts:5-20`).

## Next Focus
- Inspect post-insert enrichment / mutation-hook paths and cached-response branches for metadata drift: verify that DB rows, response envelopes, and mocked tests stay aligned after save/search cache hits.
