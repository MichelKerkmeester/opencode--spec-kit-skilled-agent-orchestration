## F-01: Feature flag governance
- **Status:** PASS
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** NONE. This is a process-control feature defining governance workflows for feature flag lifecycle management. No dedicated implementation files; governance is enforced via documented procedures and the `search-flags.ts` module structure.
- **Test Gaps:** NONE
- **Playbook Coverage:** NEW-095+
- **Recommended Fixes:** NONE

## F-02: Feature flag sunset audit
- **Status:** PASS
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** NONE. Documented current-state assertions align with code: `isPipelineV2Enabled()` is hardcoded `return true` with `@deprecated` annotation (`mcp_server/lib/search/search-flags.ts:97-103`). Helper inventory of 23 exported `is*` functions verified against `search-flags.ts` exports (lines 101-208): `isPipelineV2Enabled`, `isEmbeddingExpansionEnabled`, `isConsolidationEnabled`, `isEncodingIntentEnabled`, `isGraphSignalsEnabled`, `isCommunityDetectionEnabled`, `isMemorySummariesEnabled`, `isAutoEntitiesEnabled`, `isEntityLinkingEnabled`, `isDegreeBoostEnabled`, `isContextHeadersEnabled`, `isFileWatcherEnabled`, `isLocalRerankerEnabled` plus 10 additional helpers defined earlier in the file.
- **Test Gaps:** NONE
- **Playbook Coverage:** NEW-095+
- **Recommended Fixes:** NONE
