## Dimension: maintainability

## Files Reviewed (path:line list)

- `.opencode/skill/system-spec-kit/mcp_server/code_graph/README.md` — `rg` returned no banned-vocabulary hits.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:137-158`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:328-358`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/startup-brief.ts:70-72`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:278-288`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:600-632`
- `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:515-605`
- `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:258-264`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts:30-50`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:180-236`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:338-344`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:280-310`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/spec.md:119-128`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/checklist.md:92-98`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/decision-record.md:151-181`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/resource-map.md:50-88`

## Findings by Severity

### P0

None.

### P1

None.

### P2

#### R2-I3-P2-001: Readiness stale reason leaks internal manifest vocabulary

The ADR-005 vocabulary sweep found no banned terms in `code_graph/README.md`, and most in-code `kind` hits are internal schema discriminators or output field names. One user-visible readiness reason still says `candidate manifest drift`, which exposes an internal storage label in a blocked/full-scan explanation. The surrounding comments and constants show `candidate_manifest` is an implementation detail used to store a bounded count/digest baseline, while `code_graph_context` advertises readiness metadata and blocked payloads to tool callers. This is a maintainability/user-facing wording leak rather than a behavior failure.

Evidence:

- `ensure-ready.ts:137-147` defines the candidate manifest as internal `code_graph_metadata.candidate_manifest` state.
- `ensure-ready.ts:333-337` describes the stale/full-scan trigger as implementation-internal candidate-manifest drift logic.
- `ensure-ready.ts:351-358` returns `reason: 'candidate manifest drift: indexable file set has changed since last scan'`.
- `tool-schemas.ts:608` documents that blocked code graph context responses include readiness metadata for callers.
- `spec.md:126-128` requires the new surface to follow ADR-005 workflow invariance and avoid banned vocabulary in user-facing prose.

Severity: P2. The stale/full-scan action remains correct and explicit, but the reason string should use end-user wording such as "indexable file set changed since last scan" instead of the internal manifest label.

Downgrade trigger: If this reason is proven to be maintainer-internal only and never emitted in tool responses, this can be downgraded to a ruled-out vocabulary hit. Current evidence indicates readiness metadata is part of blocked tool payloads.

## Traceability Checks

- `spec_code`: PASS with P2 advisory. Default scope behavior still matches F1-F3 via `resolveIndexScopePolicy()` and `getDefaultConfig()` (`index-scope-policy.ts:30-50`, `scan.ts:233-234`), but NF2 has one user-facing wording leak in the readiness reason (`ensure-ready.ts:357`).
- `checklist_evidence`: PASS with advisory. CHK-042 remains substantively covered because README/env/schema surfaces describe `SPECKIT_CODE_GRAPH_INDEX_SKILLS`, `includeSkills`, and full scans without code_graph README vocabulary hits; the new finding is limited to a readiness reason string.
- `skill_agent`: PASS. This iteration stayed LEAF-only, did not dispatch sub-agents, and wrote findings only under the approved review packet.
- `feature_catalog_code`: PASS. No feature-catalog contradiction was found; the finding is a wording leak in an existing readiness full-scan reason, not a feature behavior mismatch.
- `adr_005_vocabulary`: PARTIAL. Required scan executed with `rg -i "preset|capabilit(y|ies)|kind|manifest" .opencode/skill/system-spec-kit/mcp_server/code_graph/ --type ts --type md`; README had no hits, typed `kind` fields were ruled internal, and `candidate manifest drift` remains the only substantive user-facing leak.

## Run-1 Regression Check

- PASS — R1-P1-001 precedence: re-verified `includeSkills:false` still wins over env opt-in through `perCallProvided ? input.includeSkills === true : envIncludesSkills` (`index-scope-policy.ts:30-39`) and regression coverage (`code-graph-scan.vitest.ts:280-310`).
- PASS — R3-P1-001 symlink rootDir bypass: re-verified `scan.ts` canonicalizes `rootDir` before `getDefaultConfig()` (`scan.ts:201-234`).
- PASS — R1-P2-001/R2-P2-001/R4-P2-002 resource-map drift: re-verified the resource map now lists the implementation file set and FIX-009 doc updates (`resource-map.md:50-88`).
- PASS — R4-P2-001 absolute path leakage: re-verified warning rewriting still relativizes paths before response serialization (`scan.ts:180-194`, `scan.ts:338-344`).

## Verdict — PASS

No P0/P1 findings. One P2 maintainability advisory was recorded for ADR-005 user-facing wording cleanup.

## Next Dimension

Maintainability, iteration 4: finish the maintainability lane by checking status/readiness wording consistency after any ADR-005 cleanup and confirming no additional scope labels leak implementation vocabulary.
