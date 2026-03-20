**Test Discovery (your requested patterns)**  
- `*.test.ts`/`*.spec.ts` (excluding `node_modules`):  
[quality-extractors.test.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts), [spec-doc-health.test.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/shared/parsing/spec-doc-health.test.ts)  
- `__tests__/` dirs: none  
- Vendor-only matches in `mcp_server/node_modules`: 159 files (mostly Zod tests)  
- Practical project coverage is mostly in `*.vitest.ts` (37 files under `scripts/tests`).

## 1) Complete abort/validation chain (flowchart)

```text
Input source
  -> data-loader (explicit file OR native capture fallback)
     -> path security + JSON parse + validateInputData
     -> normalizeInputData / transformOpencodeCapture (relevance filtering)
  -> runWorkflow (serialized lock)
     -> "no data?" hard abort
     -> stateless alignment pre-check
        -> Block A: warning-only
        -> Block B overlap < 15%: hard abort
     -> detect spec folder + setup context dir
     -> contamination scrub (pre-enrichment)
     -> stateless enrichment
     -> post-enrichment alignment overlap < 10%: hard abort
     -> collect/extract/render template
     -> quality/sufficiency/template gate stack
        -> template contract invalid: hard abort
        -> sufficiency fail: hard abort
        -> quality < threshold: hard abort
        -> validation disposition:
           - abort_write: hard abort
           - write_skip_index: continue (write-only)
           - write_and_index: continue
     -> writeFilesAtomically
        -> duplicate context file: skip write of ctx file (non-fatal)
        -> any write error: rollback + hard abort
     -> description.json tracking (ctx written only; errors are soft warnings)
     -> indexing policy
        -> duplicate ctx: skipped_duplicate
        -> write_skip_index: skipped_index_policy
        -> else try indexMemory
           -> embedding null: skipped_embedding_unavailable
           -> indexing exception: failed_embedding (soft-fail; file remains saved)
           -> success: indexed
     -> metadata embedding status update (best-effort; warning-only on failure)
```

## 2) Gate-by-gate: checks, owner, failure mode, coverage

- `G1 Input/path gate`  
Checks: explicit `dataFile` path sanitization, read, parse, schema validation.  
Owner: [data-loader.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:489), [input-normalizer.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:551).  
Failure: hard abort (`EXPLICIT_DATA_FILE_LOAD_FAILED`, `NO_DATA_AVAILABLE`).  
Coverage: strong in [runtime-memory-inputs.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:67).

- `G2 Capture relevance filter`  
Checks: spec-keyword/spec-affinity filtering; irrelevant content skipped.  
Owner: [input-normalizer.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:823).  
Failure mode: skip (not abort).  
Coverage: good in [stateless-enrichment.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/tests/stateless-enrichment.vitest.ts:45).

- `G3 Stateless alignment gate`  
Checks: pre-enrichment overlap ratio; `<0.15` abort, no-anchor becomes warning.  
Owner: [workflow.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1325).  
Failure: warning or hard abort (`ALIGNMENT_BLOCK`).  
Coverage: covered in [workflow-e2e.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts:448), [task-enrichment.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:1134).

- `G4 Post-enrichment alignment gate`  
Checks: overlap after enrichment `<0.10` abort.  
Owner: [workflow.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1507).  
Failure: hard abort (`POST_ENRICHMENT_ALIGNMENT_BLOCK`).  
Coverage: gap (no direct test hit).

- `G5 Contamination filter gate`  
Checks: pattern removal + severity tracking (`low/medium/high`).  
Owner: [contamination-filter.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts:136).  
Failure mode: clean/score impact (not direct abort here).  
Coverage: good in [contamination-filter.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/tests/contamination-filter.vitest.ts:7).

- `G6 Template/quality/sufficiency/validation-disposition stack`  
Checks: template contract, sufficiency, quality threshold, rule-based disposition (`abort_write`/`write_skip_index`/`write_and_index`).  
Owner: [workflow.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2068), [validate-memory-quality.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts:416).  
Failure: hard abort or write-only soft path.  
Coverage: strong across [task-enrichment.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:608), [validation-rule-metadata.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/tests/validation-rule-metadata.vitest.ts:11), [workflow-e2e.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts:532).

- `G7 File output gate`  
Checks: leaked placeholders, minimum substance, filename traversal, containment, size verify, duplicate detection, rollback on failure.  
Owner: [file-writer.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/file-writer.ts:112).  
Failure: hard abort with rollback; duplicate is skip.  
Coverage: partial. Direct failure test mostly only placeholder leak in [test-scripts-modules.js](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:1645); happy-path/duplicate observed via [workflow-e2e.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts:627).

- `G8 Index policy + index execution`  
Checks: duplicate skip, policy skip, embedding null, indexing exception, status persistence.  
Owner: [workflow.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2259), [memory-indexer.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:54).  
Failure: soft-fail after save (`skipped_*`, `failed_embedding`).  
Coverage: partial-good. `skipped_index_policy` and `failed_embedding` covered in [workflow-e2e.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts:532), [workflow-e2e.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts:747); weighting path covered in [memory-indexer-weighting.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-indexer-weighting.vitest.ts:53).

## 3) Missing test scenarios (high-value gaps)

- Alignment boundary tests at exact `0.15` (pre-enrichment) and exact `0.10` (post-enrichment).  
- Post-enrichment hard abort path (`POST_ENRICHMENT_ALIGNMENT_BLOCK`).  
- File-writer rollback/restore path when a later file fails after earlier writes succeeded.  
- File-writer `MIN_SUBSTANCE_CHARS` boundary (`199`, `200`, `201`).  
- File-writer traversal/absolute filename rejection cases.  
- `skipped_embedding_unavailable` path (`indexMemory` returns `null`).  
- Duplicate-save status assertions for `skipped_duplicate` (test currently checks files, not status/reason).  
- `normalizeQualityAbortThreshold` invalid inputs (`<=0`, `>100`, `NaN`) fallback behavior.  
- `validateInputData` multi-error aggregation message content.  
- `write_skip_index` from `V12` (currently `V2` covered; `V12` workflow path not explicitly asserted).

## 4) “Saved but not indexed” path map (all conditions)

- `saved + skipped_index_policy`  
Condition: validation fails with index-blocking-only rules (`write_skip_index`, e.g. `V2`/`V12`), but write is allowed.  
Path: [workflow.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2137) -> [workflow.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2287) -> [workflow.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2324).

- `saved + skipped_duplicate`  
Condition: context markdown was duplicate; `writeFilesAtomically` skips it; workflow still persists metadata status.  
Path: [file-writer.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/file-writer.ts:123) -> [workflow.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2278).

- `saved + skipped_embedding_unavailable`  
Condition: indexing attempted, but embedding generation returns `null`.  
Path: [memory-indexer.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:72) -> [workflow.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2317).

- `saved + failed_embedding`  
Condition: exception during embedding/indexing after write.  
Path: [workflow.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2330).

- Note on `skipped_quality_gate`  
Code path exists in status enum/branching, but with current hard-abort ordering most of those conditions are terminated before index step, making this effectively a defensive fallback path in current flow.
