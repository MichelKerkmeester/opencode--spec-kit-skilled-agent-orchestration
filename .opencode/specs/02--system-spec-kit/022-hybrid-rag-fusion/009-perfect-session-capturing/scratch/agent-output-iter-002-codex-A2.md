1. **Exact code path (written but not indexed)**
- Write happens first in Step 9 via `writeFilesAtomically(...)` ([workflow.ts:2172](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2172), [file-writer.ts:112](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/file-writer.ts:112)).
- Index decision happens later in Step 11 ([workflow.ts:2259](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2259)).
- “Written but not indexed” occurs when:
  - policy says skip index (`skipped_index_policy`) ([workflow.ts:2324](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2324)),
  - embedding returns null (`skipped_embedding_unavailable`) ([workflow.ts:2317](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2317), [memory-indexer.ts:72](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:72)),
  - embedding throws (`failed_embedding`) ([workflow.ts:2330](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2330)).

2. **All conditions causing it**
- **Index-policy skip (file written, indexing intentionally skipped):**
  - Validation disposition `write_skip_index` ([validate-memory-quality.ts:416](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts:416)).
  - Current rules that are index-blocking but not write-blocking:
    - `V2`: `[N/A]` placeholder present while tool_count > 0 ([validate-memory-quality.ts:471](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts:471), metadata at [validate-memory-quality.ts:47](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts:47)).
    - `V12`: zero overlap with spec `trigger_phrases` ([validate-memory-quality.ts:607](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts:607), metadata at [validate-memory-quality.ts:127](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts:127)).
- **Technical soft-fail after write:**
  - embedding unavailable/null ([memory-indexer.ts:72](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:72)),
  - embedding exception ([workflow.ts:2330](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2330)).
- **Not this path (these abort before write):**
  - template contract fail ([workflow.ts:2073](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2073)),
  - insufficiency fail ([workflow.ts:2121](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2121)),
  - quality score below abort threshold ([workflow.ts:2128](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2128), threshold default 0.15 at [config.ts:239](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/config.ts:239)),
  - contamination hard rules (V8/V9) and other write blockers ([workflow.ts:2138](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2138), rule metadata at [validate-memory-quality.ts:95](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts:95)).

3. **What user sees**
- For index-policy skip: warning that save continues but indexing is skipped ([workflow.ts:2154](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2154)), then log skip in Step 11 ([workflow.ts:2324](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2324)).
- For embedding exception: warning that embedding failed, save succeeded without indexing, plus rebuild hint ([workflow.ts:2337](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2337)).
- In `silent: true`, all these logs/warnings are suppressed ([workflow.ts:1301](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1301)).
- `metadata.json` is updated with explicit embedding status/reason when possible ([memory-indexer.ts:156](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:156)).

4. **How many real-world scenarios lead to this**
- **3 practical families** where file exists but not indexed:
  1. Policy skip (`write_skip_index`) via index-blocking validation (currently V2 or V12).
  2. Embedding unavailable (`null`).
  3. Embedding error/exception.
- Your examples map as:
  - very short sessions: usually abort earlier (not saved),
  - heavy contamination: usually hard-abort (not saved),
  - malformed render/input: usually hard-abort (not saved).

5. **Actual user impact**
- Durable memory file is present on disk, but `memoryId` is `null` and status is non-indexed/failure ([workflow.ts:2367](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2367)).
- Because `vectorIndex.indexMemory(...)` is not committed in these branches, semantic retrieval won’t have this record until reindex/rebuild path succeeds ([workflow.ts:2298](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2298), [vector-index-mutations.ts:140](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:140)).
- Important correction: indexing does **not** require `qualityValidation.valid === true`; `V10` can fail and still index (warn-only) ([workflow.ts:2094](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2094), [workflow-e2e.vitest.ts:487](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts:487)).

6. **Test coverage**
- Exists:
  - Rule metadata coverage for `write_skip_index` classification (`V2`) ([validation-rule-metadata.vitest.ts:43](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/tests/validation-rule-metadata.vitest.ts:43)).
  - E2E write+skip-index (`skipped_index_policy`) ([workflow-e2e.vitest.ts:532](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts:532)).
  - E2E save-then-embedding-failure (`failed_embedding`) ([workflow-e2e.vitest.ts:747](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts:747)).
  - V10 soft-fail-but-indexed behavior ([workflow-e2e.vitest.ts:487](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts:487)).
- Missing/gaps:
  - No explicit E2E for `V12` causing `write_skip_index`.
  - No explicit E2E for `skipped_embedding_unavailable`.
  - No direct assertion for `skipped_duplicate` status (duplicate behavior tested, status not asserted) ([workflow-e2e.vitest.ts:627](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts:627)).
  - `skipped_quality_gate` branch has no test and appears effectively unreachable in current flow. 

Static code/test inspection only; I did not execute the test suite in this pass.
