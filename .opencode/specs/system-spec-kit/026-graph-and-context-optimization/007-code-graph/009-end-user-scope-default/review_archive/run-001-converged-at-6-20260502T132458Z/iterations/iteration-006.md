## Dimension: traceability

## Files Reviewed (path:line list)

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/deep-review-state.jsonl:1-7`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/deep-review-strategy.md:1-80`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/deep-review-findings-registry.json:1-71`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/iterations/iteration-005.md:1-84`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/spec.md:84-128`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/plan.md:70-260`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/checklist.md:193-224`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/decision-record.md:65-80`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/implementation-summary.md:61-126`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/resource-map.md:50-129`
- `.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts:1-82`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:140-167`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1292-1305`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1451-1489`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:242-251`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:293-303`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:520-563`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/startup-brief.ts:223-234`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:179-219`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:168-278`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:561-577`
- `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:488-496`
- `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:683-746`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:257-325`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:252-277`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-siblings-readiness.vitest.ts:217-223`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-siblings-readiness.vitest.ts:302-319`
- `.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:534-545`
- `.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:615-628`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/README.md:233-270`
- `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:255-265`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts:5-49` (traceability context only; not used for new findings outside the stated in-scope list)
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scope-readiness.vitest.ts:67-92` (traceability context only; prior resource-map gap already recorded)
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:196` and `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:825` (traceability context only for CHK-G2-04)

## Findings by Severity

### P0 (Blocker)

No new P0 findings.

### P1 (Required)

No new P1 findings.

Prior P1 findings remain active and were not duplicated:

- `R1-P1-001`: explicit `includeSkills:false` cannot force end-user scope when `SPECKIT_CODE_GRAPH_INDEX_SKILLS=true`.
- `R3-P1-001`: symlinked `rootDir` can bypass default `.opencode/skill` exclusion.

### P2 (Suggestion)

No new P2 findings.

Prior P2 findings already cover the traceability drift seen again in this pass: resource-map overstatement for Phase 2 read handlers, omission of the added scope-readiness test and broad README artifacts, and absolute-path wording in scan errors.

## Traceability Checks (which spec/checklist claims you verified)

- **Plan §4 Phase 1 line-cite ranges**: Verified the planned default-off scan policy maps to actual implementation surfaces: `index-scope.ts` rejects `.opencode/skill/**` unless policy opt-in is active, `getDefaultConfig()` adds `.opencode/skill/**` to default excludes, `scan.ts` resolves `includeSkills`, the structural indexer uses the same policy for directory walking and specific files, strict schemas include `includeSkills`, and focused tests cover default/env/per-call behavior. Evidence: `plan.md:206-228`, `index-scope.ts:56-65`, `indexer-types.ts:140-167`, `scan.ts:216-219`, `structural-indexer.ts:1292-1305`, `structural-indexer.ts:1451-1489`, `tool-schemas.ts:561-577`, `tool-input-schemas.ts:488-496`, `code-graph-indexer.vitest.ts:257-325`, `code-graph-scan.vitest.ts:252-277`, `tool-input-schema.vitest.ts:534-545`, `tool-input-schema.vitest.ts:615-628`.
- **Plan §4 Phase 2 line-cite ranges**: Verified stored scope metadata, mismatch detection, blocked full-scan readiness, status scope fields, and startup hint are implemented in the in-scope files. The plan/resource-map claim that `context.ts`, `query.ts`, `detect-changes.ts`, and `verify.ts` were modified remains covered by prior resource-map findings and was not reopened as a duplicate. Evidence: `plan.md:229-249`, `code-graph-db.ts:242-251`, `ensure-ready.ts:293-303`, `ensure-ready.ts:520-563`, `status.ts:168-278`, `startup-brief.ts:223-234`, `iteration-005.md:68-75`.
- **Plan §4 Phase 3 line-cite ranges**: Verified README and ENV reference document the default `.opencode/skill/**` exclusion, `SPECKIT_CODE_GRAPH_INDEX_SKILLS=true`, `includeSkills:true`, and explicit full-scan migration. Evidence: `plan.md:251-260`, `code_graph/README.md:233-270`, `ENV_REFERENCE.md:255-265`.
- **CHK-G1-01..G1-08 evidence**: Verified every marked item has corresponding code/test evidence, with the known env-precedence P1 still open rather than duplicated. Evidence: `checklist.md:197-205`, `index-scope.ts:56-65`, `indexer-types.ts:140-167`, `scan.ts:216-219`, `structural-indexer.ts:1292-1305`, `code-graph-indexer.vitest.ts:257-325`, `code-graph-scan.vitest.ts:252-277`, `tool-input-schema.vitest.ts:534-545`, `tool-input-schema.vitest.ts:615-628`.
- **CHK-G2-01..G2-06 evidence**: Verified metadata round-trip/mismatch/read-path full-scan/status/startup claims against the cited implementation and test evidence. The added readiness test file is still absent from the packet resource map, already covered by `R2-P2-001`. Evidence: `checklist.md:208-214`, `code-graph-db.ts:242-251`, `ensure-ready.ts:293-303`, `ensure-ready.ts:520-563`, `status.ts:168-278`, `startup-brief.ts:223-234`, `code-graph-scope-readiness.vitest.ts:67-92`.
- **CHK-G3-01..G3-08 evidence**: Verified doc/update evidence is present. The recorded validation and performance results are traceable to the implementation summary; this iteration did not rerun those commands because the dimension is traceability-only. Evidence: `checklist.md:217-224`, `code_graph/README.md:233-270`, `ENV_REFERENCE.md:255-265`, `implementation-summary.md:116-126`.
- **ADR-001 five sub-decisions**: Verified the accepted defaults still match the code/docs: end-user default excludes `.opencode/skill/**`, env opt-in is `SPECKIT_CODE_GRAPH_INDEX_SKILLS=true`, per-call opt-in is `includeSkills:true`, `mcp-coco-index/mcp_server` stays excluded, and scope fingerprint/label require a full scan on mismatch. Evidence: `decision-record.md:70-80`, `indexer-types.ts:140-167`, `index-scope.ts:56-65`, `ensure-ready.ts:293-303`, `code_graph/README.md:250-270`.
- **Resource-map §2 vs actual changed-file set**: Rechecked the current relevant diff. The in-scope implementation files are represented in `resource-map.md`, while broader changed README artifacts and the added `code-graph-scope-readiness.vitest.ts` remain covered by earlier P2 findings. Evidence: `resource-map.md:58-90`, `iteration-002.md:57-73`, `iteration-004.md:59-67`, `git diff --name-only` output from this pass.
- **Implementation-summary "What Was Built"**: Verified the described code paths exist: scan default behavior, opt-in surfaces, scope metadata/readiness/status behavior, and docs updates. Evidence: `implementation-summary.md:61-80`, `scan.ts:216-219`, `code-graph-db.ts:242-251`, `ensure-ready.ts:293-303`, `status.ts:268-278`, `tool-schemas.ts:561-577`, `tool-input-schemas.ts:488-496`, `code_graph/README.md:233-270`, `ENV_REFERENCE.md:255-265`.

## Verdict — CONDITIONAL

CONDITIONAL: no new traceability findings were discovered in iteration 6, but the two prior P1 findings remain active.

## Next Dimension — which dimension you'd run next if continuing

Maintainability.
