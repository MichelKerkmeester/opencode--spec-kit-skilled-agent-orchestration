## Dimension: security

## Files Reviewed (path:line list)

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/deep-review-state.jsonl:1-3`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/deep-review-findings-registry.json:1-47`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/deep-review-strategy.md:1-80`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/iterations/iteration-001.md:46-61`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/iterations/iteration-002.md:57-73`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/spec.md:84-122`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/plan.md:144-167`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/checklist.md:82-88`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/implementation-summary.md:64-80`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/resource-map.md:54-90`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/resource-map.md:103-109`
- `.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts:48-65`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:141-166`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1292-1305`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1390-1423`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1435-1485`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:2070-2098`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:213-251`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:586-593`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:293-303`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:520-570`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/startup-brief.ts:223-240`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:179-219`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:233-253`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:287-328`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:168-278`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:562-577`
- `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:488-496`
- `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:683-746`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:257-325`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:245-277`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-siblings-readiness.vitest.ts:217-223`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-siblings-readiness.vitest.ts:302-319`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scope-readiness.vitest.ts:63-100`
- `.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:534-545`
- `.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:615-628`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/README.md:236-270`
- `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:256-265`

## Findings by Severity

### P0 (Blocker)

No new P0 findings.

### P1 (Required)

#### R3-P1-001 — Symlinked `rootDir` can bypass the default `.opencode/skill/**` exclusion

- **claim**: `code_graph_scan` validates a caller-supplied `rootDir` with realpath-based containment, but then builds the indexer config from the non-canonical `resolvedRootDir`. If a workspace-local symlink points at `.opencode/skill`, a scan through the symlink path can present files as `<workspace>/<alias>/...`; the default segment filter never sees `.opencode/skill`, so skill internals can be indexed without `includeSkills:true`.
- **evidenceRefs**:
  - `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:184-217`
  - `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1390-1423`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts:48-65`
  - `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:2070-2098`
  - `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:302-325`
- **evidence**: `handleCodeGraphScan()` computes `resolvedRootDir`, realpath-validates it, and checks the canonical root is inside the canonical workspace, but passes `resolvedRootDir` to `getDefaultConfig()` instead of the already-derived canonical root. The default walker descends from `config.rootDir`, builds each candidate `fullPath` lexically with `resolve(currentDir, entry.name)`, and calls `shouldIndexForCodeGraph(fullPath, config.scopePolicy)` before any per-candidate canonicalization. The skill exclusion in `shouldIndexForCodeGraph()` is string/segment based on the path it receives. Existing tests cover direct `.opencode/skill` paths and opt-in behavior, but not a symlink alias whose canonical target is a skill directory.
- **counterevidenceSought**: I checked the explicit workspace canonicalization in the scan handler, the default walker, the specific-file path, and scope tests. The specific-file path does canonicalize candidate files before `shouldIndexForCodeGraph()`, but the default full-scan path does not. I also searched the code-graph tests for symlink/realpath coverage; the relevant scope tests compare realpaths of direct paths, not symlink-root aliases.
- **alternativeExplanation**: The product may treat `rootDir` as a fully trusted maintainer-only input, or may consider symlinked roots unsupported. That would reduce the impact, but it would still leave the deny-by-default scope guarantee dependent on an undocumented caller discipline rather than the canonical path boundary already computed by the handler.
- **severity-rationale**: P1 because this is a crafted path/symlink edge case rather than the default `process.cwd()` flow, but it is a security-relevant scope bypass of the packet's deny-by-default skill-internal filtering.
- **finalSeverity**: P1
- **confidence**: 0.84
- **downgradeTrigger**: Downgrade to P2 if `rootDir` is explicitly documented and tested as trusted-only and symlinked roots are unsupported; escalate to P0 if `code_graph_scan.rootDir` is exposed to untrusted callers or repositories can supply symlinks that make the default scan traverse skill internals.

### P2 (Suggestion)

No new P2 findings.

## Traceability Checks (which spec/checklist claims you verified)

- **spec_code F1 default exclusion**: Partially verified. Direct `.opencode/skill/**` paths are excluded by default through both default globs and the hard scope guard, but the symlink-root alias path above can bypass the segment guard because canonical containment is not used as the index root. Evidence: `spec.md:119`, `indexer-types.ts:141-166`, `index-scope.ts:48-65`, `scan.ts:184-217`, `structural-indexer.ts:1390-1423`.
- **spec_code F2/F3 opt-in**: Verified that env and per-call true opt-ins are documented and wired, with the prior non-security precedence gap still open as `R1-P1-001`. Evidence: `plan.md:144-167`, `tool-schemas.ts:562-577`, `README.md:250-264`, `ENV_REFERENCE.md:261`, `iteration-001.md:46-61`.
- **checklist_evidence CHK-030**: Verified no secret-like `SPECKIT_CODE_GRAPH_INDEX_SKILLS=...` assignment was found by the required pattern search.
- **checklist_evidence CHK-031**: Verified strict input validation still rejects unknown `code_graph_scan` fields and non-boolean `includeSkills`. Evidence: `schemas/tool-input-schemas.ts:488-496`, `schemas/tool-input-schemas.ts:683-746`, `tool-input-schema.vitest.ts:615-628`.
- **checklist_evidence CHK-032**: Partially verified. Direct path filtering is deny-by-default for `.opencode/skill/**`, but `R3-P1-001` shows the guarantee is incomplete for symlinked scan roots. Evidence: `checklist.md:85-88`, `index-scope.ts:48-65`, `code-graph-indexer.vitest.ts:257-325`, `scan.ts:184-217`, `structural-indexer.ts:1390-1423`.
- **SQL injection / metadata storage**: Ruled out for this pass. Scope fingerprint and label are written through existing bound parameters in `setMetadata()`, and count queries do not interpolate caller-controlled strings. Evidence: `code-graph-db.ts:213-251`, `code-graph-db.ts:586-593`.
- **Status payload disclosure**: Ruled out as a P1/P2 in this pass. `activeScope` and `storedScope` disclose fixed fingerprints, labels, booleans, and source enums, but not absolute paths or secret values; `excludedTrackedFiles` is a count only. Evidence: `status.ts:168-278`.
- **DoS via fingerprint computation**: Ruled out. The active scope fingerprint is a fixed policy literal stored after scan; there is no hashing of file lists or large payloads in the fingerprint path. Evidence: `indexer-types.ts:141-166`, `code-graph-db.ts:249-251`, `ensure-ready.ts:293-303`.
- **Resource map coverage**: No new security-specific resource-map finding beyond prior `R1-P2-001` and `R2-P2-001`. The current scoped diff contains all user-listed in-scope implementation files, while the prior untracked readiness test and two README gaps remain already reported. Evidence: `resource-map.md:54-90`, `iteration-001.md:63-65`, `iteration-002.md:63-73`.

## Verdict — CONDITIONAL

CONDITIONAL — one new P1 security finding shows the default skill-internal exclusion can be bypassed through a symlinked scan root; prior P1 `R1-P1-001` also remains open.

## Next Dimension — which dimension you'd run next if continuing

Security again: validate whether the symlink-root bypass also affects status/readiness remediation paths or only explicit `code_graph_scan` full scans.
