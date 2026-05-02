## Dimension: security

## Files Reviewed (path:line list)

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/deep-review-state.jsonl:1-4`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/deep-review-strategy.md:1-80`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/iterations/iteration-001.md:46-73`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/iterations/iteration-002.md:57-73`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/iterations/iteration-003.md:52-83`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/spec.md:84-128`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/checklist.md:82-88`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/resource-map.md:54-90`
- `.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts:1-82`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:140-166`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1245-1305`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1390-1448`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1451-1490`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:2070-2105`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:213-251`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:579-593`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:287-303`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:520-563`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/startup-brief.ts:223-240`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:179-219`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:287-328`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:160-285`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:561-577`
- `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:488-496`
- `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:683-746`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/README.md:236-270`
- `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:256-265`

## Findings by Severity

### P0 (Blocker)

No new P0 findings.

### P1 (Required)

No new P1 findings. Prior security-relevant P1s remain open: `R1-P1-001` (env opt-in cannot be overridden by per-call `includeSkills:false`) and `R3-P1-001` (symlinked `rootDir` can bypass the default `.opencode/skill/**` exclusion).

### P2 (Suggestion)

- **R4-P2-001**: Scope validation errors and scan warnings expose absolute filesystem paths to the tool caller/log stream. `handleCodeGraphScan()` returns `resolvedRootDir` for invalid/broken paths and `canonicalWorkspace` for out-of-workspace paths, while the walker warns with `currentDir`, `fullPath`, and specific-file paths; `warnings` are copied into the scan response. This is not a privilege-escalation bug in the local MCP trust model, but it is avoidable path disclosure in security-sensitive scope handling. Evidence: `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:184-198`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:204-217`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1394-1397`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1413-1416`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1436-1441`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1477-1479`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:311-328`.
- **R4-P2-002**: Resource-map coverage is still under-complete for actual changed docs/artifacts. Beyond the already-reported `code_graph/tests/code-graph-scope-readiness.vitest.ts`, `code_graph/handlers/README.md`, and `code_graph/lib/README.md` gaps, `git diff --name-only HEAD` currently shows broad `mcp_server/**/README.md` changes plus `data/search-decisions.jsonl` that are absent from the packet map. If those changes belong to this implementation, add them to the map; if they are unrelated workspace noise, exclude them from the packet diff before synthesis. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/resource-map.md:58-90`.

## Traceability Checks (which spec/checklist claims you verified)

- **spec_code F1 default exclusion**: Direct `.opencode/skill/**` paths remain excluded by default through both default glob excludes and the hard scope guard. The prior symlink-root alias bypass remains open and was not duplicated as a new finding. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/spec.md:119`, `.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts:56-65`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:141-166`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/iterations/iteration-003.md:52-67`.
- **spec_code F2/F3 opt-in**: Env and per-call true opt-ins are wired and documented; the prior env-vs-per-call false precedence gap remains open as `R1-P1-001`. Evidence: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:561-577`, `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:488-496`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/README.md:236-270`, `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:256-265`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/iterations/iteration-001.md:46-61`.
- **checklist_evidence CHK-030**: Verified no secret-like `SPECKIT_CODE_GRAPH_INDEX_SKILLS=.*[A-Za-z0-9]{20}` assignment was found in the repository.
- **checklist_evidence CHK-031**: Verified strict schema still exposes `includeSkills` as boolean-only and keeps `code_graph_status` parameterless. Evidence: `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:488-496`, `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:683-746`.
- **checklist_evidence CHK-032**: Direct deny-by-default skill filtering is present; prior symlink-root bypass means the guarantee is still partial for canonical path aliases. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/checklist.md:85-88`, `.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts:48-65`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1292-1305`.
- **Status payload disclosure**: Ruled out as a new finding. `activeScope` and `storedScope` expose fixed fingerprints/labels/source booleans, and `excludedTrackedFiles` is a count only; no absolute paths or secret values are returned there. Evidence: `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:168-278`.
- **Logging/error path disclosure**: New P2 recorded as `R4-P2-001`; the problematic data is absolute path text in scan validation errors and walker warnings, not in scope fingerprints.
- **DoS via fingerprint computation**: Ruled out. Scope fingerprints are fixed policy literals stored after scan, not hashes of file lists or large caller-controlled payloads. Evidence: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:141-166`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:249-251`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:293-303`.
- **SQL injection / metadata storage**: Ruled out. Scope metadata uses parameter binding for both lookup and upsert; the tracked-skill count query contains no caller-controlled interpolation. Evidence: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:213-251`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:586-593`.
- **Resource map coverage**: New P2 recorded as `R4-P2-002` for broader working-tree resource-map drift; prior resource-map P2s remain open.

## Verdict — CONDITIONAL

CONDITIONAL — no new P0/P1 was found in this security pass, but prior P1s remain open and this iteration adds two P2 security/coverage advisories.

## Next Dimension — which dimension you'd run next if continuing

Traceability: reconcile the resource map against the actual implementation diff and verify the spec/checklist claims against the final changed-file set.
