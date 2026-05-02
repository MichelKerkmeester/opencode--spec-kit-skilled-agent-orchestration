## Dimension: traceability

## Files Reviewed (path:line list)

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/deep-review-state.jsonl:1-5`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/deep-review-strategy.md:1-80`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/deep-review-findings-registry.json:1-71`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/iterations/iteration-002.md:57-73`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/iterations/iteration-004.md:50-67`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/plan.md:203-277`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/plan.md:281-310`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/checklist.md:193-224`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/decision-record.md:65-80`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/implementation-summary.md:61-80`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/resource-map.md:50-90`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts:1-51`
- `.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts:18-65`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:140-167`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:26-34`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:179-219`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:244-294`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1292-1305`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1375-1448`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1451-1489`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:213-251`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:579-594`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:277-304`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:489-563`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/startup-brief.ts:223-234`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:159-172`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:248-295`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:561-577`
- `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:488-496`
- `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:683-746`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:248-325`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:245-277`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scope-readiness.vitest.ts:1-108`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-siblings-readiness.vitest.ts:217-223`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-siblings-readiness.vitest.ts:265-319`
- `.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:534-545`
- `.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:615-628`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/README.md:233-270`
- `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:255-265`

## Findings by Severity

### P0 (Blocker)

No new P0 findings.

### P1 (Required)

No new P1 findings.

Prior P1 findings remain active and were not duplicated:

- `R1-P1-001`: explicit `includeSkills:false` cannot override `SPECKIT_CODE_GRAPH_INDEX_SKILLS=true`.
- `R3-P1-001`: symlinked `rootDir` can bypass default `.opencode/skill` exclusion.

### P2 (Suggestion)

No new P2 findings.

The resource-map and changed-file drift that surfaced during this pass is already covered by prior P2 findings `R1-P2-001`, `R2-P2-001`, and `R4-P2-002`; this iteration found no new file:line + claim combination that warrants a separate finding.

## Traceability Checks (which spec/checklist claims you verified)

- **Plan §4 Phase 1 line-cite ranges**: Verified the planned Phase 1 surfaces map to actual implementation: the shared policy helper resolves default/env/per-call policy, `getDefaultConfig()` adds `.opencode/skill/**` only when skill indexing is off, `scan.ts` accepts `includeSkills`, `structural-indexer.ts` applies the same policy in candidate walking and specific-file paths, tool schemas accept strict boolean input, and focused tests cover default/env/per-call behavior. Evidence: `plan.md:206-228`, `index-scope-policy.ts:30-50`, `indexer-types.ts:141-166`, `scan.ts:26-34`, `scan.ts:216-219`, `structural-indexer.ts:1292-1305`, `structural-indexer.ts:1451-1489`, `tool-schemas.ts:561-577`, `tool-input-schemas.ts:488-496`, `code-graph-indexer.vitest.ts:257-325`, `code-graph-scan.vitest.ts:252-277`.
- **Plan §4 Phase 2 line-cite ranges**: Verified the implemented Phase 2 core: scope fingerprints and labels persist in `code_graph_metadata`, readiness compares stored vs active scope and returns full-scan action on mismatch, read-path inline full scan can be skipped, status exposes active/stored scope and tracked skill counts, and startup brief emits a concise scope-change hint. The direct `context.ts`/`query.ts`/`detect-changes.ts`/`verify.ts` resource-map overstatement was already recorded in earlier resource-map findings. Evidence: `plan.md:229-249`, `code-graph-db.ts:242-251`, `ensure-ready.ts:293-303`, `ensure-ready.ts:520-535`, `status.ts:168-172`, `status.ts:248-278`, `startup-brief.ts:229-234`, `iteration-002.md:57-73`, `iteration-004.md:59-67`.
- **Plan §4 Phase 3 line-cite ranges**: Verified user-facing docs describe the default exclusion, env opt-in, per-call opt-in, and explicit full-scan migration; ENV reference documents `SPECKIT_CODE_GRAPH_INDEX_SKILLS=false`. Recorded validation/performance claims are present in `implementation-summary.md`; this pass checked traceability of recorded evidence, not a fresh rerun. Evidence: `plan.md:251-277`, `plan.md:281-310`, `code_graph/README.md:233-270`, `ENV_REFERENCE.md:255-265`, `implementation-summary.md:116-126`.
- **CHK-G1-01..G1-08 evidence**: Verified the implementation has a shared helper file, default deny path guard, opt-in default config, scan handler wiring, structural walker wiring, strict schema coverage, focused tests, and env cleanup. The prior env-precedence P1 remains open and is not a new traceability finding. Evidence: `checklist.md:197-205`, `index-scope-policy.ts:1-51`, `index-scope.ts:56-65`, `indexer-types.ts:141-166`, `scan.ts:216-219`, `structural-indexer.ts:1292-1305`, `code-graph-indexer.vitest.ts:257-325`, `tool-input-schema.vitest.ts:534-545`, `tool-input-schema.vitest.ts:615-628`.
- **CHK-G2-01..G2-06 evidence**: Verified fingerprint round-trip, mismatch detection, no inline full-scan self-heal for read paths, blocked full-scan shape via shared readiness, status fields, and startup hint. Evidence: `checklist.md:208-214`, `code-graph-scope-readiness.vitest.ts:63-107`, `code-graph-db.ts:242-251`, `ensure-ready.ts:293-303`, `ensure-ready.ts:520-535`, `status.ts:168-278`, `startup-brief.ts:229-234`.
- **CHK-G3-01..G3-08 evidence**: Verified README/ENV docs and implementation-summary evidence claims are present. Full validation/test pass claims are recorded in the summary/checklist, but were not rerun in this traceability-only iteration. Evidence: `checklist.md:217-224`, `code_graph/README.md:233-270`, `ENV_REFERENCE.md:255-265`, `implementation-summary.md:116-126`.
- **ADR-001 five sub-decisions**: Verified all five accepted defaults map to code/docs: default excludes `.opencode/skill/**`, env opt-in is `SPECKIT_CODE_GRAPH_INDEX_SKILLS=true`, per-call field is `includeSkills:true`, `mcp-coco-index/mcp_server` remains excluded even under skill opt-in, and the migration model stores scope fingerprint/label and requires full scan on mismatch. Evidence: `decision-record.md:70-80`, `index-scope-policy.ts:5-50`, `indexer-types.ts:145-166`, `ensure-ready.ts:293-303`, `code_graph/README.md:250-270`.
- **Resource-map §2 vs actual changed-file set**: Verified the in-scope implementation files are represented, while broader touched artifacts and the added readiness test are already captured by prior resource-map findings. No new resource-map coverage finding was emitted. Evidence: `resource-map.md:58-90`, `iteration-002.md:57-73`, `iteration-004.md:59-67`.
- **Implementation-summary "What Was Built"**: Verified the described code paths exist: scan default behavior, opt-in surfaces, scope metadata/readiness/status behavior, and docs updates. Evidence: `implementation-summary.md:61-80`, `scan.ts:216-219`, `code-graph-db.ts:242-251`, `ensure-ready.ts:293-303`, `status.ts:268-278`, `tool-schemas.ts:561-577`, `schemas/tool-input-schemas.ts:488-496`, `code_graph/README.md:233-270`, `ENV_REFERENCE.md:255-265`.

## Verdict — CONDITIONAL

CONDITIONAL: no new traceability findings were discovered, but the two prior P1 findings and four prior P2 findings remain open.

## Next Dimension — which dimension you'd run next if continuing

Traceability stabilization: rerun a second traceability pass focused only on CHK-G evidence persistence and duplicate-resource-map adjudication before moving to maintainability.
