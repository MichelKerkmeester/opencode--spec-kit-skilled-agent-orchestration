## Dimension: correctness

## Files Reviewed (path:line list)

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/deep-review-state.jsonl:1-2`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/deep-review-findings-registry.json:1-120`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/deep-review-strategy.md:1-120`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/iterations/iteration-001.md:46-73`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/spec.md:86-122`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/plan.md:72-80`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/plan.md:144-167`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/plan.md:214-249`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/decision-record.md:68-80`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/checklist.md:75-77`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/checklist.md:197-218`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/implementation-summary.md:64-80`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/resource-map.md:54-90`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/resource-map.md:103-109`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts:1-51`
- `.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts:31-65`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:141-166`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1245-1305`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1451-1470`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:242-251`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:580-593`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:287-303`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:520-535`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/startup-brief.ts:223-233`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:179-219`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:233-253`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:287-294`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:168-172`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:248-278`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:562-577`
- `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:488-496`
- `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:683-685`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:101-102`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:257-295`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:302-325`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:246-277`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-siblings-readiness.vitest.ts:217-223`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-siblings-readiness.vitest.ts:302-319`
- `.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:534-545`
- `.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:615-628`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scope-readiness.vitest.ts:1-80`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/README.md:1-40`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/README.md:1-40`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/README.md:233-270`
- `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:255-262`

## Findings by Severity

### P0 (Blocker)

No new P0 findings.

### P1 (Required)

No new P1 findings. Prior finding `R1-P1-001` remains the active required correctness concern: `includeSkills:false` cannot override an env-enabled maintainer process.

### P2 (Suggestion)

- **R2-P2-001**: Resource-map coverage misses actual implementation artifacts: `code_graph/tests/code-graph-scope-readiness.vitest.ts` is an untracked added test, and `code_graph/handlers/README.md` plus `code_graph/lib/README.md` are modified docs, but `resource-map.md` lists neither the new readiness test nor those two README files in the added/modified sections. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/resource-map.md:54-90`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scope-readiness.vitest.ts:1-80`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/README.md:1-40`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/README.md:1-40`.

## Traceability Checks (which spec/checklist claims you verified)

- **spec_code default scope**: Verified the implemented default excludes `.opencode/skill/**` at both scope layers: `getDefaultConfig()` includes the skill exclude when `includeSkills` is false, and `shouldIndexForCodeGraph()` rejects `.opencode/skill` paths unless the active policy includes skills. Evidence: `spec.md:119`, `indexer-types.ts:141-166`, `index-scope.ts:56-65`.
- **path-prefix correctness**: Verified `.opencode/skill` matching is path-segment based and handles root-relative paths/trailing slash through the hard guard; the structural glob translator also supports root-relative `**/` matches. Evidence: `index-scope.ts:48-65`, `structural-indexer.ts:1245-1305`.
- **opt-in matrix**: Verified default false, env true, and per-call true coverage exists; did not duplicate prior `env=true` plus explicit `includeSkills:false` gap. Evidence: `code-graph-indexer.vitest.ts:257-295`, `code-graph-scan.vitest.ts:252-277`, `iteration-001.md:46-58`.
- **fingerprint stability**: Verified fingerprints are fixed literals, not JSON/set/locale-derived strings, and are persisted in metadata. Evidence: `index-scope-policy.ts:40-49`, `code-graph-db.ts:242-251`.
- **readiness/status behavior**: Verified stored-vs-active fingerprint mismatch returns a full-scan action when graph rows exist and inline read paths with `allowInlineFullScan:false` do not self-heal by running a full scan. Status exposes `activeScope`, `storedScope`, `scopeMismatch`, and `excludedTrackedFiles`. Evidence: `ensure-ready.ts:287-303`, `ensure-ready.ts:520-535`, `status.ts:168-172`, `status.ts:248-278`.
- **checklist_evidence**: Verified CHK-G1-02 through CHK-G1-06 and CHK-G2-01 through CHK-G2-06 have corresponding code/test evidence, with the known precedence gap from iteration 1 still open. Evidence: `checklist.md:197-218`, `code-graph-indexer.vitest.ts:257-325`, `tool-input-schema.vitest.ts:534-545`, `tool-input-schema.vitest.ts:615-628`, `code-graph-scope-readiness.vitest.ts:63-80`.
- **resource_map_coverage**: Verified requested in-scope implementation files are represented in the map, but actual touched artifacts include one added readiness test and two README docs absent from the map. Evidence: `resource-map.md:54-90`, `code-graph-scope-readiness.vitest.ts:1-80`, `handlers/README.md:1-40`, `lib/README.md:1-40`.

## Verdict — CONDITIONAL

CONDITIONAL: no new P0/P1 correctness issue was found in iteration 2, but the prior P1 precedence finding remains open and this pass adds one P2 resource-map coverage gap.

## Next Dimension — which dimension you'd run next if continuing

Security: focus on symlink/canonicalization boundaries, rootDir containment, and whether scope/status payloads expose only intended local path metadata.
