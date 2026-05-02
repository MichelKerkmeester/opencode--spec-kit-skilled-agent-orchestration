## Dimension: correctness

## Files Reviewed (path:line list)

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/deep-review-config.json:1-20`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/deep-review-state.jsonl:1`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/deep-review-strategy.md:1-120`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/spec.md:84-120`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/plan.md:70-155`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/checklist.md:63-78`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/implementation-summary.md:64-80`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/resource-map.md:56-90`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts:30-38`
- `.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts:56-65`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:141-157`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1292-1305`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1451-1470`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:242-251`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:293-303`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:531-563`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/startup-brief.ts:229-233`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:216-219`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:287-295`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:168-278`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:562-577`
- `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:488-496`
- `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:683-746`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:257-289`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:302-325`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:252-277`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-siblings-readiness.vitest.ts:217-223`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-siblings-readiness.vitest.ts:302-319`
- `.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:534-545`
- `.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:615-628`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/README.md:236-270`
- `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:256-265`

## Findings by Severity

### P0 (Blocker)

None.

### P1 (Required)

#### R1-P1-001 — `includeSkills:false` cannot force an end-user scan when the env opt-in is set

- **claim**: The scope policy treats `SPECKIT_CODE_GRAPH_INDEX_SKILLS=true` as stronger than an explicit per-call `includeSkills:false`, so a maintainer process with the env enabled cannot perform a one-off default/end-user-only scan through `code_graph_scan({ includeSkills:false })`.
- **evidenceRefs**:
  - `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts:30-38`
  - `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:216-219`
  - `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:266-289`
  - `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:252-277`
  - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/plan.md:144-154`
- **evidence**: `resolveIndexScopePolicy()` computes `includeSkills` as `input.includeSkills === true || envIncludesSkills`; only `includeSkills === true` gets scan-argument source, while env true wins whenever the argument is false or absent. `handleCodeGraphScan()` passes `args.includeSkills` into that resolver. Tests cover default false, env true, and per-call true, but not env true plus explicit per-call false. The plan describes the per-call field as deterministic control before policy collapse.
- **counterevidenceSought**: I checked the spec, README, env reference, implementation summary, and tests for language or cases saying `includeSkills` is intentionally a true-only opt-in and cannot disable an env-enabled process. The docs describe env and `includeSkills:true` opt-ins, but I did not find a statement that `includeSkills:false` is ignored by design.
- **alternativeExplanation**: The intended product contract may be that the env var is a process-wide maintainer mode and `includeSkills` only adds a one-call opt-in when env is unset. If so, the behavior is intentional, but the docs/tests should say false does not override env.
- **severity-rationale**: P1 because this is not the default path, but it is a correctness gap in the env/per-call precedence matrix and can silently prevent the documented default scope from being requested in an env-enabled maintainer process.
- **finalSeverity**: P1
- **confidence**: 0.78
- **downgradeTrigger**: Downgrade to P2 if the team explicitly decides that `SPECKIT_CODE_GRAPH_INDEX_SKILLS=true` is non-overridable process policy and updates docs/tests to lock that contract.

### P2 (Suggestion)

- **R1-P2-001**: Resource-map coverage is slightly over-broad: it marks `context.ts`, `query.ts`, `detect-changes.ts`, and `verify.ts` as modified/OK for Phase 2, but `git diff --name-only HEAD` for this packet did not show those files changed; keep the map aligned so later review passes do not chase non-existent implementation edits. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/resource-map.md:78-83`.

## Traceability Checks (which spec/checklist claims you verified)

- **F1 default exclusion**: Verified default policy path excludes `.opencode/skill/**` through both `shouldIndexForCodeGraph()` and default `excludeGlobs`. Evidence: `spec.md:119`, `index-scope.ts:56-65`, `indexer-types.ts:141-157`, `code-graph-indexer.vitest.ts:257-264`.
- **F2 documented opt-in**: Verified env and per-call true opt-ins are implemented and documented. Evidence: `spec.md:120`, `index-scope-policy.ts:30-38`, `tool-schemas.ts:562-577`, `README.md:250-260`, `ENV_REFERENCE.md:261`.
- **CHK-022 edge cases**: Partially verified. Default false, env true, and per-call true are covered; env true plus explicit per-call false is missing. Evidence: `checklist.md:74-78`, `code-graph-indexer.vitest.ts:266-289`, `code-graph-scan.vitest.ts:252-277`.
- **CHK-032 deny-by-default path filtering**: Verified for `.opencode/skill/example.ts` and `mcp-coco-index/mcp_server` under opt-in. Evidence: `checklist.md:85-88`, `code-graph-indexer.vitest.ts:257-295`.
- **Resource map coverage**: Actual changed implementation files are listed in the map, including the added policy helper, but the map also lists several Phase 2 handler files that were not changed in the current HEAD diff. Evidence: `resource-map.md:56-90`.

## Verdict — CONDITIONAL

CONDITIONAL — no P0s found, but the env/per-call false precedence gap should be resolved or explicitly documented before claiming the precedence matrix is complete.

## Next Dimension — security

I would run the next iteration on security, focusing on whether path canonicalization plus scope filtering avoids symlink/path-prefix bypasses and whether status/readiness payloads leak only intended local path metadata.
