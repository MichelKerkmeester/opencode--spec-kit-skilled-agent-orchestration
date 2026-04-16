# Iteration 19 - security - handlers

## Dispatcher
- iteration: 19 of 50
- dispatcher: cli-copilot gpt-5.4 high (code review v1)
- timestamp: 2026-04-16T06:00:16.573Z

## Files Reviewed
- .opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts
- .opencode/skill/system-spec-kit/mcp_server/handlers/save/index.ts
- .opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts
- .opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts
- .opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts
- .opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts
- .opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts
- .opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts
- .opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts
- .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts
- .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts
- .opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/index.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation-bridge.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/assistive-reconsolidation.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts

## Findings - New
### P0 Findings
- **Governed save-time reconsolidation can cross scope boundaries and then persist the survivor without governance metadata.** The normal save path treats `tenant_id`, `user_id`, `agent_id`, and `session_id` as a strict four-part boundary, but `runReconsolidationIfEnabled()` weakens that contract in two places: its reconsolidation candidate filter only rejects tenant/user/agent mismatches when the candidate row already has a value, so null-scoped rows still pass, and it never checks `session_id` at all; then its assistive path performs an unfiltered `vectorSearch()` and returns the chosen `olderMemoryId`/`candidateMemoryIds` back to the caller through `buildSaveResponse()`. Worse, the reconsolidation `storeMemory()` callback bypasses `create-record.ts` and writes the survivor with `indexMemory()` + `applyPostInsertMetadata()` but never stamps `tenant_id`, `user_id`, `agent_id`, or `session_id`, so a governed save can both consult out-of-scope memories and create an unscoped survivor row.  
  **Evidence:** `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:208-223`, `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:250-280`, `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:384-425`, `.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:184-235`, `.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:324-338`, `.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:451-477`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1560-1563`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2496`

  ```json
  {
    "claim": "The reconsolidation bridge bypasses the repository's governed-scope contract: it can inspect out-of-scope memories during save-time reconsolidation/assistive review and can persist reconsolidation survivors without tenant/user/agent/session metadata.",
    "evidenceRefs": [
      ".opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:208-223",
      ".opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:250-280",
      ".opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:384-425",
      ".opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:184-235",
      ".opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:324-338",
      ".opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:451-477",
      ".opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1560-1563",
      ".opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2496"
    ],
    "counterevidenceSought": "Checked the normal create path for intended scope semantics and found strict equality on all four scope columns; also checked the dedicated reconsolidation tests for tenant/user/agent/session coverage and found none.",
    "alternativeExplanation": "This would be less severe only if reconsolidation were intentionally outside governance, but that conflicts with the strict scope handling already implemented in dedup/create-record and with the dedicated governed-scope schema/indexes.",
    "finalSeverity": "P0",
    "confidence": 0.96,
    "downgradeTrigger": "Downgrade if vectorSearch is proven to enforce the same four-column scope boundary implicitly and reconsolidation-created rows are shown to inherit governance metadata through a hidden write path not visible from these call sites."
  }
  ```

### P1 Findings
- None.

### P2 Findings
- `.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation-bridge.vitest.ts:117-174`, `.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation-bridge.vitest.ts:199-220`, `.opencode/skill/system-spec-kit/mcp_server/tests/assistive-reconsolidation.vitest.ts:1-235` - The reconsolidation security tests never exercise governed inputs (`tenantId`, `userId`, `agentId`, `sessionId`) or assert that assistive recommendations stay in-scope. The bridge tests call `runReconsolidationIfEnabled()` with the scope argument omitted, and the assistive suite only checks helper thresholds/logging, which is why the scope-bypass path shipped uncovered.

## Traceability Checks
- The save stack clearly intends governed isolation: `dedup.ts` and `create-record.ts` both treat `tenant_id`, `user_id`, `agent_id`, and `session_id` as strict matching keys, and the schema carries a dedicated governed-scope index. `reconsolidation-bridge.ts` does not preserve that contract, so the implementation diverges from the surrounding handler intent.
- `session-resume.ts` does match its trust/freshness intent: cached summaries are rejected on unreadable transcripts, fingerprint drift, stale timestamps, or scope mismatch before they are surfaced.
- The review scope listed `.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts`, but no source file exists at that path in this checkout, so there was nothing implementation-level to inspect for that entry.

## Confirmed-Clean Surfaces
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts` - Same-path and content-hash dedup both normalize and apply all four governance columns, including `session_id`, before declaring a match.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts` - Prediction-error candidate discovery forwards `tenantId`, `userId`, `agentId`, and `sessionId` together, so PE gating itself is not the scope leak.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts` - The bootstrap composite fails closed if the nested `session_resume` payload omits `structuralTrust`, which is the right stance for trust-carrying startup data.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/index.ts` - Pure export barrel; no handler logic or side effects to attack.

## Next Focus
- Follow this governance issue into `handlers/memory-save.ts`, `handlers/save/atomic-index-memory.ts`, and `lib/storage/reconsolidation.ts` to see whether any other alternate save paths bypass governed-scope propagation or surface out-of-scope IDs.
