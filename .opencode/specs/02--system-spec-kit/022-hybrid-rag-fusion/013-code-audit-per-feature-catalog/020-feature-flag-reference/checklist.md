## F-01: 1. Search Pipeline Features (SPECKIT_*)
- **Status:** FAIL
- **Code Issues:** NONE
- **Standards Violations:** 1. Multiple Source File mappings are stale or incorrect for key flags, reducing traceability and auditability: `SPECKIT_ABLATION` (`feature_catalog/20--feature-flag-reference/01-1-search-pipeline-features-speckit.md:7`) is implemented in `ablation-framework.ts` via `isAblationEnabled()` (`mcp_server/lib/eval/ablation-framework.ts:45-47`), not `eval-metrics.ts`; `SPECKIT_CONTEXT_HEADERS` (`...speckit.md:23`) is read via `isContextHeadersEnabled()` in `search-flags.ts` (`mcp_server/lib/search/search-flags.ts:186-188`); `SPECKIT_FILE_WATCHER` (`...speckit.md:40`) is read via `isFileWatcherEnabled()` in `search-flags.ts` with an explicit `'true'` requirement (`mcp_server/lib/search/search-flags.ts:195-198`); `SPECKIT_LAZY_LOADING` (`...speckit.md:48`) has no active read site in `context-server.ts` (only `SPECKIT_EAGER_WARMUP` messaging appears) and lazy-loading policy is hardcoded/inert in shared embeddings; `SPECKIT_RRF` points to non-existent `lib/search/rrf-fusion.ts` (`...speckit.md:62`) while implementation lives in `shared/algorithms/rrf-fusion.ts`.
- **Behavior Mismatch:** The table presents authoritative per-flag source ownership, but several rows point at non-authoritative (barrel re-exports) or missing sources, so the documented "where this flag is implemented" reality is inaccurate for at least 5 of the listed flags in this feature file.
- **Test Gaps:** No automated validation in this phase checks that each flag row's Source File exists and actually references the listed env var. Given the number of stale mappings found, a CI script would prevent future drift.
- **Playbook Coverage:** Cross-cutting
- **Recommended Fixes:** 1. Reconcile Source File column entries against actual env-var read sites (grep for `process.env.SPECKIT_*` and `isFeatureEnabled('SPECKIT_*')` calls). 2. Correct `SPECKIT_ABLATION` source to `lib/eval/ablation-framework.ts`. 3. Correct `SPECKIT_RRF` source path to `shared/algorithms/rrf-fusion.ts`. 4. Remove or clarify `SPECKIT_LAZY_LOADING` entry (no active read site). 5. Add a CI validation script that checks Source File existence + env-var symbol presence for all flag-reference tables.

## F-02: 2. Session and Cache
- **Status:** PASS
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** NONE
- **Test Gaps:** NONE
- **Playbook Coverage:** Cross-cutting
- **Recommended Fixes:** NONE

## F-03: 3. MCP Configuration
- **Status:** PASS
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** NONE
- **Test Gaps:** NONE
- **Playbook Coverage:** Cross-cutting
- **Recommended Fixes:** NONE

## F-04: 4. Memory and Storage
- **Status:** WARN
- **Code Issues:** NONE
- **Standards Violations:** 1. Source mappings for `MEMORY_DB_DIR` and `MEMORY_DB_PATH` point to `lib/search/vector-index-impl.ts` (`feature_catalog/20--feature-flag-reference/04-4-memory-and-storage.md:9-10`), but that file is now a barrel re-export (`mcp_server/lib/search/vector-index-impl.ts:4-13`); active path-resolution logic is in `vector-index-store.ts` (`mcp_server/lib/search/vector-index-store.ts:214-224`). The barrel re-export makes the documented source authoritative in name only; developers following the trace will find no implementation at the listed location.
- **Behavior Mismatch:** Documentation implies env ownership in `vector-index-impl.ts`, while effective runtime behavior for `MEMORY_DB_DIR` and `MEMORY_DB_PATH` resolution is implemented in `vector-index-store.ts`.
- **Test Gaps:** No automated Source File validation detects this mapping drift. No test validates that `MEMORY_DB_DIR`/`MEMORY_DB_PATH` are read from the documented location.
- **Playbook Coverage:** Cross-cutting
- **Recommended Fixes:** 1. Update Source File entries for `MEMORY_DB_DIR` and `MEMORY_DB_PATH` to `lib/search/vector-index-store.ts`. 2. Add mapping validation in CI to catch future barrel-re-export drift.

## F-05: 5. Embedding and API
- **Status:** WARN
- **Code Issues:** NONE
- **Standards Violations:** 1. `EMBEDDINGS_PROVIDER` is mapped to `lib/providers/embeddings.ts` (`feature_catalog/20--feature-flag-reference/05-5-embedding-and-api.md:9`), but that file is a pure re-export (`mcp_server/lib/providers/embeddings.ts:7-9`); provider selection logic is in shared factory logic (`shared/embeddings/factory.ts:73-103`). 2. `EMBEDDING_DIM` is mapped to `vector-index-impl.ts` (`.../05-5-embedding-and-api.md:8`), but effective dimension logic is in `vector-index-store.ts` (`mcp_server/lib/search/vector-index-store.ts:118-140`, `156-157`).
- **Behavior Mismatch:** The `EMBEDDING_DIM` row says this is a general env override, but implementation does not apply an arbitrary override value; it uses provider-derived dimensions with a compatibility check specifically for `'768'` (`mcp_server/lib/search/vector-index-store.ts:156-157`). Setting `EMBEDDING_DIM` to other values (e.g., `'512'`, `'1024'`) would not override the provider dimension as the documentation implies.
- **Test Gaps:** No automated table/source validation catches these source and semantics drifts. No test validates what happens when `EMBEDDING_DIM` is set to a non-768 value.
- **Playbook Coverage:** Cross-cutting
- **Recommended Fixes:** 1. Update `EMBEDDINGS_PROVIDER` Source File to `shared/embeddings/factory.ts`. 2. Update `EMBEDDING_DIM` Source File to `lib/search/vector-index-store.ts`. 3. Clarify `EMBEDDING_DIM` semantics in Current Reality text: it is a 768-compatibility check, not a general dimension override.

## F-06: 6. Debug and Telemetry
- **Status:** PASS
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** NONE
- **Test Gaps:** NONE
- **Playbook Coverage:** Cross-cutting
- **Recommended Fixes:** NONE

## F-07: 7. CI and Build (informational)
- **Status:** PASS
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** NONE
- **Test Gaps:** NONE
- **Playbook Coverage:** Cross-cutting
- **Recommended Fixes:** NONE
